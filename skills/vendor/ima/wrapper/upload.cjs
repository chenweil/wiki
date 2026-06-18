#!/usr/bin/env node
'use strict';

/**
 * upload.cjs — MyWiki → IMA Knowledge Base upload wrapper.
 *
 * Single command that wraps the full IMA file-upload pipeline:
 *   1. preflight (type/size check)
 *   2. check_repeated_names (duplicate gate)
 *   3. create_media (get media_id + COS credentials)
 *   4. cos-upload (PUT file to COS)
 *   5. add_knowledge (register uploaded media in KB)
 *
 * Usage:
 *   node upload.cjs --file /path/to/book.pdf [--kb-id <id>] [--title <title>]
 *                   [--on-repeated keep|cancel] [--timeout <ms>]
 *
 * Resolution:
 *   --kb-id > env IMA_DEFAULT_KB_ID > die
 *
 * Output:
 *   stdout (success): one JSON object
 *     { ok: true, media_id, kb_id, file_name, file_size, media_type,
 *       content_type, title, url }
 *   stderr (failure): one JSON object per failure
 *     { ok: false, step, code, msg, ...extra }
 *   exit: 0 on success, 1 on failure, 2 on usage error
 *
 * Notes:
 *   - This wrapper does NOT decide whether a file should go to IMA.
 *     That policy (e.g. "files > 5MB go to IMA") belongs to the caller
 *     (skills/ingest/SKILL.md).
 *   - On repeated-name detection, default behavior is "cancel" (refuse
 *     to upload). Pass --on-repeated keep to append a timestamp.
 *   - Title defaults to file_name (matches GATE 2 in knowledge-base/SKILL.md).
 */

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { imaApi } = require('../ima_api.cjs');

const PREFLIGHT_SCRIPT = path.join(
  __dirname, '..', 'knowledge-base', 'scripts', 'preflight-check.cjs',
);
const COS_UPLOAD_SCRIPT = path.join(
  __dirname, '..', 'knowledge-base', 'scripts', 'cos-upload.cjs',
);

const DEFAULT_COS_TIMEOUT_MS = 300_000; // 5 min — cos-upload.cjs default
const MAX_FILE_BYTES_DEFAULT = 200 * 1024 * 1024; // safety guard

// ─── Error reporting ────────────────────────────────────────────────────────

function die(step, msg, extra) {
  const payload = Object.assign(
    { ok: false, step, code: -100, msg },
    extra || {},
  );
  process.stderr.write(JSON.stringify(payload) + '\n');
  process.exit(1);
}

function usageError(msg) {
  process.stderr.write(
    'Usage: node upload.cjs --file <path> [--kb-id <id>] [--title <title>] ' +
    '[--on-repeated keep|cancel] [--timeout <ms>]\n' +
    `error: ${msg}\n`,
  );
  process.exit(2);
}

// ─── Arg parsing ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (val === undefined || val.startsWith('--')) usageError(`missing value for --${key}`);
    args[key] = val;
    i += 1;
  }
  return args;
}

// ─── IMA API helper (returns parsed JSON or dies) ───────────────────────────

async function callIma(step, apiPath, body) {
  let text;
  try {
    text = await imaApi(apiPath, body);
  } catch (err) {
    const code = typeof err.code === 'number' ? err.code : -100;
    die(step, err.msg || err.message || 'IMA API call threw', { code });
  }
  let resp;
  try {
    resp = JSON.parse(text);
  } catch {
    die(step, 'non-JSON response from IMA', { raw: (text || '').slice(0, 500) });
  }
  if (resp && typeof resp.code === 'number' && resp.code !== 0) {
    die(step, `IMA ${apiPath} failed: ${resp.msg || 'unknown'}`, {
      code: resp.code,
      raw: resp,
    });
  }
  return resp || {};
}

// ─── Step 1: preflight (spawn vendored script) ──────────────────────────────

function runPreflight(filePath) {
  const r = spawnSync('node', [PREFLIGHT_SCRIPT, '--file', filePath], { encoding: 'utf8' });
  if (r.status === 2) {
    // preflight-check.cjs uses exit 2 for "file not found / usage error"
    die('preflight', `preflight could not run: ${r.stderr.trim() || 'unknown error'}`);
  }
  if (r.status !== 0) {
    let parsed;
    try { parsed = JSON.parse(r.stdout); } catch { parsed = {}; }
    die(
      'preflight',
      parsed.reason || `preflight failed (exit ${r.status})`,
      { preflight: parsed },
    );
  }
  let parsed;
  try { parsed = JSON.parse(r.stdout); } catch { parsed = {}; }
  if (!parsed.pass) {
    die('preflight', parsed.reason || 'preflight did not pass', { preflight: parsed });
  }
  return parsed;
}

// ─── Repeated-name policy ───────────────────────────────────────────────────

function applyRepeatedPolicy(fileName, mediaType, isRepeated, onRepeated) {
  if (!isRepeated) return fileName;
  if (onRepeated === 'cancel') {
    die(
      'check_repeated',
      `file "${fileName}" already exists in target knowledge base`,
      { repeated: true, file_name: fileName, media_type: mediaType },
    );
  }
  if (onRepeated !== 'keep') {
    die('config', `invalid --on-repeated "${onRepeated}" (expected keep|cancel)`);
  }
  const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const dot = fileName.lastIndexOf('.');
  return dot >= 0
    ? `${fileName.slice(0, dot)}_${ts}${fileName.slice(dot)}`
    : `${fileName}_${ts}`;
}

// ─── Step 4: COS upload (spawn vendored script) ────────────────────────────

function runCosUpload(filePath, pre, cos, timeoutMs) {
  const args = [
    COS_UPLOAD_SCRIPT,
    '--file', filePath,
    '--secret-id', cos.secret_id,
    '--secret-key', cos.secret_key,
    '--token', cos.token,
    '--bucket', cos.bucket_name,
    '--region', cos.region,
    '--cos-key', cos.cos_key,
    '--content-type', pre.content_type,
    '--start-time', String(cos.start_time),
    '--expired-time', String(cos.expired_time),
    '--timeout', String(timeoutMs),
  ];
  const r = spawnSync('node', args, { encoding: 'utf8', timeout: timeoutMs + 30_000 });
  if (r.status !== 0) {
    die(
      'cos_upload',
      `cos-upload.cjs failed (exit ${r.status})`,
      { stderr: (r.stderr || '').slice(0, 500) },
    );
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  const filePath = args.file ? path.resolve(args.file) : null;
  if (!filePath) usageError('missing --file');

  const kbId = args['kb-id'] || process.env.IMA_DEFAULT_KB_ID;
  if (!kbId) {
    die(
      'config',
      'no kb_id resolved: pass --kb-id <id> or set env IMA_DEFAULT_KB_ID',
    );
  }

  const onRepeated = args['on-repeated'] || 'cancel';
  if (onRepeated !== 'keep' && onRepeated !== 'cancel') {
    usageError(`--on-repeated must be "keep" or "cancel", got "${onRepeated}"`);
  }

  const timeoutMs = args.timeout ? Number(args.timeout) : DEFAULT_COS_TIMEOUT_MS;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    usageError(`--timeout must be a positive number (ms), got "${args.timeout}"`);
  }

  // Step 1 — preflight
  const pre = runPreflight(filePath);

  if (pre.file_size > MAX_FILE_BYTES_DEFAULT) {
    die(
      'preflight',
      `file size ${pre.file_size} exceeds wrapper safety limit ${MAX_FILE_BYTES_DEFAULT}`,
      { file_size: pre.file_size },
    );
  }

  // Step 2 — check_repeated_names
  const checkResp = await callIma('check_repeated', 'openapi/wiki/v1/check_repeated_names', {
    params: [{ name: pre.file_name, media_type: pre.media_type }],
    knowledge_base_id: kbId,
  });
  const isRepeated = Boolean(checkResp.data && checkResp.data.is_repeated);
  const finalFileName = applyRepeatedPolicy(
    pre.file_name, pre.media_type, isRepeated, onRepeated,
  );

  // Step 3 — create_media
  const createResp = await callIma('create_media', 'openapi/wiki/v1/create_media', {
    file_name: finalFileName,
    file_size: pre.file_size,
    content_type: pre.content_type,
    knowledge_base_id: kbId,
    file_ext: pre.file_ext,
  });
  const data = createResp.data || {};
  const mediaId = data.media_id;
  const cos = data.cos_credential;
  if (!mediaId || !cos) {
    die(
      'create_media',
      'create_media response missing media_id or cos_credential',
      { response: createResp },
    );
  }

  // Step 4 — COS upload (GATE 4: non-zero exit → STOP, do not call add_knowledge)
  runCosUpload(filePath, pre, cos, timeoutMs);

  // Step 5 — add_knowledge (GATE 2: title must equal file_name)
  const finalTitle = args.title || finalFileName;
  const addResp = await callIma('add_knowledge', 'openapi/wiki/v1/add_knowledge', {
    media_type: pre.media_type,
    media_id: mediaId,
    title: finalTitle,
    knowledge_base_id: kbId,
    file_info: {
      cos_key: cos.cos_key,
      file_size: pre.file_size,
      file_name: finalFileName,
    },
  });

  // Output success
  const result = {
    ok: true,
    media_id: mediaId,
    kb_id: kbId,
    file_name: finalFileName,
    file_size: pre.file_size,
    media_type: pre.media_type,
    content_type: pre.content_type,
    title: finalTitle,
    url: (addResp.data && addResp.data.url) || null,
  };
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main().catch((err) => die('unknown', (err && err.message) || String(err)));
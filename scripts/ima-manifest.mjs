#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const manifestPath = "raw/ima/sources.yml";
const wikiRoot = "wiki";
const imaApiPath = "skills/vendor/ima/ima_api.cjs";
const allowedKinds = new Set(["ima-note", "ima-media"]);
const allowedMetadataStatus = new Set(["partial", "synced", "stale", "needs-review"]);
const allowedStatus = new Set(["active", "needs-review", "archived"]);

function usage() {
  console.error("Usage:");
  console.error("  node scripts/ima-manifest.mjs lint");
  console.error("  node scripts/ima-manifest.mjs sync --dry-run [--id <source-id>]");
  console.error("  node scripts/ima-manifest.mjs sync [--id <source-id>]");
}

function stripQuotes(value) {
  if (value === "null") return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  return stripQuotes(trimmed);
}

function parseManifest(text) {
  const manifest = { sources: [] };
  let inSources = false;
  let current = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, "");
    if (line.trim() === "" || line.trim().startsWith("#")) continue;

    if (line === "sources:") {
      inSources = true;
      continue;
    }

    if (!inSources) {
      const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (top) {
        manifest[top[1]] = parseScalar(top[2]);
      }
      continue;
    }

    const itemStart = line.match(/^  - ([A-Za-z0-9_-]+):\s*(.*)$/);
    if (itemStart) {
      current = {};
      manifest.sources.push(current);
      current[itemStart[1]] = parseScalar(itemStart[2]);
      continue;
    }

    const field = line.match(/^    ([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field && current) {
      current[field[1]] = parseScalar(field[2]);
    }
  }

  return manifest;
}

function quoteYaml(value) {
  if (value === null || value === undefined) return "null";
  return JSON.stringify(String(value));
}

function serializeManifest(manifest) {
  const lines = [];
  lines.push(`version: ${manifest.version || 1}`);
  lines.push(`updated: ${quoteYaml(manifest.updated || new Date().toISOString().slice(0, 10))}`);
  lines.push("policy:");
  lines.push(`  purpose: ${quoteYaml(manifest.policy_purpose || "Track Tencent IMA notes and media used as raw sources for MyWiki.")}`);
  lines.push(`  source_of_truth: ${quoteYaml(manifest.policy_source_of_truth || "IMA stores the external object; this file stores MyWiki's local provenance record.")}`);
  lines.push(`  required_for_new_ima_sources: ${manifest.policy_required_for_new_ima_sources === "false" ? "false" : "true"}`);
  lines.push("");
  lines.push("sources:");

  for (const source of manifest.sources) {
    lines.push(`  - id: ${source.id}`);
    lines.push(`    kind: ${source.kind}`);
    lines.push(`    title: ${quoteYaml(source.title)}`);
    if (source.kind === "ima-note") {
      lines.push(`    note_id: ${quoteYaml(source.note_id)}`);
    }
    if (source.kind === "ima-media") {
      lines.push(`    kb_id: ${quoteYaml(source.kb_id)}`);
      lines.push(`    media_id: ${quoteYaml(source.media_id)}`);
      lines.push(`    file_name: ${quoteYaml(source.file_name)}`);
    }
    lines.push(`    url: ${quoteYaml(source.url)}`);
    lines.push(`    status: ${source.status || "active"}`);
    lines.push(`    metadata_status: ${source.metadata_status || "partial"}`);
    lines.push(`    summary_page: ${source.summary_page || "null"}`);
    lines.push(`    extracted_text_path: ${quoteYaml(source.extracted_text_path)}`);
    lines.push(`    created_at: ${quoteYaml(source.created_at)}`);
    lines.push(`    updated_at: ${quoteYaml(source.updated_at)}`);
    lines.push(`    registered_at: ${quoteYaml(source.registered_at)}`);
    lines.push(`    notes: ${quoteYaml(source.notes)}`);
    lines.push("");
  }

  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function loadManifest() {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing ${manifestPath}`);
  }
  return parseManifest(fs.readFileSync(manifestPath, "utf8"));
}

function walkMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files.sort();
}

function parseImaRefsFromMarkdown(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return [];

  const refs = [];
  const lines = match[1].split(/\r?\n/);
  let current = null;

  for (const line of lines) {
    const kind = line.match(/^  - kind:\s*(ima-note|ima-media)\s*$/);
    if (kind) {
      current = { file: filePath, kind: kind[1] };
      refs.push(current);
      continue;
    }

    if (!current) continue;
    const field = line.match(/^    (note_id|media_id):\s*(.*)$/);
    if (field) {
      current[field[1]] = stripQuotes(field[2].trim());
    }

    if (/^  - kind: /.test(line) && !kind) {
      current = null;
    }
  }

  return refs;
}

function parseArgs(argv) {
  const args = { command: argv[2], dryRun: false, id: null };
  for (let i = 3; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--id") {
      args.id = argv[i + 1] || null;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function callImaApi(apiPath, body) {
  const result = spawnSync("node", [
    imaApiPath,
    apiPath,
    JSON.stringify(body),
    JSON.stringify({ lastCheckFile: "tmp/ima-last-update-check" }),
  ], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    let message = result.stderr.trim() || result.stdout.trim() || `ima_api exited with ${result.status}`;
    try {
      const parsed = JSON.parse(result.stderr);
      message = parsed.msg || message;
    } catch {
      // Keep raw message.
    }
    return { ok: false, message };
  }

  let response;
  try {
    response = JSON.parse(result.stdout || "{}");
  } catch {
    return { ok: false, message: "IMA API returned non-JSON response" };
  }

  if (response.code !== 0) {
    return { ok: false, message: response.msg || `IMA API business error ${response.code}` };
  }

  return { ok: true, data: response.data || {} };
}

function syncNote(source) {
  return callImaApi("openapi/note/v1/get_doc_content", {
    note_id: source.note_id,
    target_content_format: 0,
  });
}

function syncMedia(source) {
  return callImaApi("openapi/wiki/v1/get_media_info", {
    media_id: source.media_id,
  });
}

function summarizeChanges(source, next) {
  const changes = [];
  for (const field of ["status", "metadata_status", "updated_at", "notes"]) {
    if ((source[field] || null) !== (next[field] || null)) {
      changes.push(`${field}: ${quoteYaml(source[field])} -> ${quoteYaml(next[field])}`);
    }
  }
  return changes;
}

function requireField(errors, source, field) {
  if (source[field] === undefined || source[field] === "") {
    errors.push(`${source.id || "<missing id>"}: missing required field "${field}"`);
  }
}

function lint() {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(manifestPath)) {
    errors.push(`Missing ${manifestPath}`);
    report(errors, warnings, 0, 0);
    return;
  }

  const manifest = parseManifest(fs.readFileSync(manifestPath, "utf8"));
  if (String(manifest.version) !== "1") {
    errors.push(`${manifestPath}: version must be 1`);
  }
  if (!Array.isArray(manifest.sources)) {
    errors.push(`${manifestPath}: sources must be a list`);
  }

  const ids = new Set();
  const noteIds = new Set();
  const mediaIds = new Set();

  for (const source of manifest.sources) {
    requireField(errors, source, "id");
    requireField(errors, source, "kind");
    requireField(errors, source, "title");
    requireField(errors, source, "status");
    requireField(errors, source, "metadata_status");
    requireField(errors, source, "summary_page");
    requireField(errors, source, "registered_at");

    if (source.id) {
      if (ids.has(source.id)) errors.push(`${source.id}: duplicate id`);
      ids.add(source.id);
    }

    if (source.kind && !allowedKinds.has(source.kind)) {
      errors.push(`${source.id}: unsupported kind "${source.kind}"`);
    }
    if (source.status && !allowedStatus.has(source.status)) {
      errors.push(`${source.id}: unsupported status "${source.status}"`);
    }
    if (source.metadata_status && !allowedMetadataStatus.has(source.metadata_status)) {
      errors.push(`${source.id}: unsupported metadata_status "${source.metadata_status}"`);
    }

    if (source.kind === "ima-note") {
      requireField(errors, source, "note_id");
      if (source.note_id) noteIds.add(source.note_id);
    }
    if (source.kind === "ima-media") {
      requireField(errors, source, "kb_id");
      requireField(errors, source, "media_id");
      requireField(errors, source, "file_name");
      if (source.media_id) mediaIds.add(source.media_id);
    }

    if (source.summary_page && !fs.existsSync(source.summary_page)) {
      errors.push(`${source.id}: summary_page does not exist: ${source.summary_page}`);
    }
    if (source.extracted_text_path && !fs.existsSync(source.extracted_text_path)) {
      errors.push(`${source.id}: extracted_text_path does not exist: ${source.extracted_text_path}`);
    }
  }

  const refs = walkMarkdownFiles(wikiRoot).flatMap(parseImaRefsFromMarkdown);
  for (const ref of refs) {
    if (ref.kind === "ima-note" && !noteIds.has(ref.note_id)) {
      errors.push(`${ref.file}: ima-note ${ref.note_id || "<missing note_id>"} is missing from ${manifestPath}`);
    }
    if (ref.kind === "ima-media" && !mediaIds.has(ref.media_id)) {
      errors.push(`${ref.file}: ima-media ${ref.media_id || "<missing media_id>"} is missing from ${manifestPath}`);
    }
  }

  for (const source of manifest.sources) {
    if (source.metadata_status === "partial") {
      warnings.push(`${source.id}: metadata_status is partial; run future sync when IMA metadata verification is needed`);
    }
  }

  report(errors, warnings, manifest.sources.length, refs.length);
}

function sync({ dryRun, id }) {
  const manifest = loadManifest();
  const today = new Date().toISOString().slice(0, 10);
  const selected = id ? manifest.sources.filter((source) => source.id === id) : manifest.sources;

  if (id && selected.length === 0) {
    console.error(`No manifest source found for id: ${id}`);
    process.exit(1);
  }

  const results = [];

  for (const source of selected) {
    let remote;
    if (source.kind === "ima-note") {
      remote = syncNote(source);
    } else if (source.kind === "ima-media") {
      remote = syncMedia(source);
    } else {
      remote = { ok: false, message: `unsupported kind ${source.kind}` };
    }

    const next = { ...source };
    if (remote.ok) {
      next.status = "active";
      next.metadata_status = "synced";
      next.updated_at = today;
      next.notes = source.notes || "Remote metadata verified by ima-manifest sync.";
    } else {
      next.metadata_status = "needs-review";
      next.updated_at = today;
      next.notes = `Sync failed: ${remote.message}`;
    }

    results.push({ source, next, ok: remote.ok, message: remote.message || "ok" });

    if (!dryRun) {
      Object.assign(source, next);
    }
  }

  console.log(`IMA manifest sync${dryRun ? " dry-run" : ""}`);
  console.log(`- Selected sources: ${selected.length}`);
  console.log(`- Successful remote checks: ${results.filter((result) => result.ok).length}`);
  console.log(`- Failed remote checks: ${results.filter((result) => !result.ok).length}`);

  for (const result of results) {
    console.log(`\n${result.source.id}: ${result.ok ? "synced" : "needs-review"}`);
    if (!result.ok) {
      console.log(`- ${result.message}`);
    }
    const changes = summarizeChanges(result.source, result.next);
    if (changes.length === 0) {
      console.log("- no local manifest changes");
    } else {
      for (const change of changes) console.log(`- ${change}`);
    }
  }

  if (!dryRun) {
    manifest.updated = today;
    fs.writeFileSync(manifestPath, serializeManifest(manifest));
    console.log(`\nUpdated ${manifestPath}`);
  } else {
    console.log(`\nDry run only. ${manifestPath} was not modified.`);
  }
}

function report(errors, warnings, manifestCount, wikiRefCount) {
  console.log("IMA manifest lint");
  console.log(`- Manifest: ${manifestPath}`);
  console.log(`- Manifest sources: ${manifestCount}`);
  console.log(`- Wiki IMA references: ${wikiRefCount}`);
  console.log(`- Errors: ${errors.length}`);
  console.log(`- Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log("\nErrors");
    for (const error of errors) console.log(`- ${error}`);
  }
  if (warnings.length > 0) {
    console.log("\nWarnings");
    for (const warning of warnings) console.log(`- ${warning}`);
  }
  process.exit(errors.length > 0 ? 1 : 0);
}

let args;
try {
  args = parseArgs(process.argv);
} catch (error) {
  console.error(error.message);
  usage();
  process.exit(2);
}

if (args.command === "lint") {
  lint();
} else if (args.command === "sync") {
  sync(args);
} else {
  usage();
  process.exit(2);
}

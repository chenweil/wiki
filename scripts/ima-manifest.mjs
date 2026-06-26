#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const manifestPath = "raw/ima/sources.yml";
const wikiRoot = "wiki";
const allowedKinds = new Set(["ima-note", "ima-media"]);
const allowedMetadataStatus = new Set(["partial", "synced", "stale", "needs-review"]);
const allowedStatus = new Set(["active", "needs-review", "archived"]);

function usage() {
  console.error("Usage: node scripts/ima-manifest.mjs lint");
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

const command = process.argv[2];
if (command !== "lint") {
  usage();
  process.exit(2);
}

lint();

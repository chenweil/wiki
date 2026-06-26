#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const roots = ["raw/sources", "raw/inbox"];
const largeFileBytes = 5 * 1024 * 1024;
const binaryExtensions = new Set([
  ".pdf",
  ".epub",
  ".mobi",
  ".azw3",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
]);

function gitLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function isLargeBinaryCandidate(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!binaryExtensions.has(ext)) return false;
  return fs.statSync(filePath).size > largeFileBytes;
}

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

const tracked = new Set(gitLines(["ls-files", "--", ...roots]));
const untracked = new Set(gitLines(["ls-files", "--others", "--exclude-standard", "--", ...roots]));
const stagedAdds = new Set(gitLines(["diff", "--cached", "--name-only", "--diff-filter=A", "--", ...roots]));
const candidates = roots.flatMap(walkFiles).filter(isLargeBinaryCandidate).sort();

const errors = [];
const warnings = [];

for (const file of candidates) {
  const size = formatSize(fs.statSync(file).size);
  const detail = `${file} (${size})`;

  if (stagedAdds.has(file)) {
    errors.push(`${detail}: staged as a new large binary; upload to IMA or document an explicit exception`);
  } else if (untracked.has(file)) {
    errors.push(`${detail}: untracked large binary; upload to IMA instead of committing it`);
  } else if (tracked.has(file)) {
    warnings.push(`${detail}: already tracked large binary; migrate only through an explicit IMA cleanup plan`);
  }
}

console.log("Raw large-file lint");
console.log(`- Roots: ${roots.join(", ")}`);
console.log(`- Threshold: ${formatSize(largeFileBytes)}`);
console.log(`- Large binary candidates: ${candidates.length}`);
console.log(`- Errors: ${errors.length}`);
console.log(`- Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.log("\nErrors");
  for (const error of errors) {
    console.log(`- ${error}`);
  }
}

if (warnings.length > 0) {
  console.log("\nWarnings");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

process.exit(errors.length > 0 ? 1 : 0);

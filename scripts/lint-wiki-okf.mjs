#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const wikiRoot = path.resolve("wiki");
const reservedNames = new Set(["index.md", "log.md"]);
const recommendedFields = ["title", "description", "tags"];

function walkMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function readFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  if (!text.startsWith("---\n")) {
    return null;
  }

  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    return null;
  }

  const keys = new Set();
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):/);
    if (match) {
      keys.add(match[1]);
    }
  }

  return keys;
}

function relative(filePath) {
  return path.relative(process.cwd(), filePath);
}

if (!fs.existsSync(wikiRoot)) {
  console.error("Missing wiki/ directory.");
  process.exit(1);
}

const files = walkMarkdownFiles(wikiRoot);
const normalPages = files.filter((file) => !reservedNames.has(path.basename(file)));
const errors = [];
const warnings = [];

for (const file of normalPages) {
  const keys = readFrontmatter(file);
  const rel = relative(file);

  if (!keys) {
    errors.push(`${rel}: missing YAML frontmatter`);
    continue;
  }

  if (!keys.has("type")) {
    errors.push(`${rel}: missing required frontmatter field "type"`);
  }

  const missingRecommended = recommendedFields.filter((field) => !keys.has(field));
  if (missingRecommended.length > 0) {
    warnings.push(`${rel}: missing recommended fields ${missingRecommended.join(", ")}`);
  }
}

console.log("OKF compatibility lint");
console.log(`- Markdown pages: ${files.length}`);
console.log(`- Reserved pages: ${files.length - normalPages.length}`);
console.log(`- Normal knowledge pages: ${normalPages.length}`);
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

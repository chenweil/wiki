#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const vendorRoot = "skills/vendor";

function gitLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

const staged = gitLines(["diff", "--cached", "--name-only", "--", vendorRoot]);
const unstaged = gitLines(["diff", "--name-only", "--", vendorRoot]);
const untracked = gitLines(["ls-files", "--others", "--exclude-standard", "--", vendorRoot]);

console.log("Vendor clean lint");
console.log(`- Vendor root: ${vendorRoot}`);
console.log(`- Staged changes: ${staged.length}`);
console.log(`- Unstaged changes: ${unstaged.length}`);
console.log(`- Untracked files: ${untracked.length}`);

if (staged.length + unstaged.length + untracked.length === 0) {
  process.exit(0);
}

console.log("\nBlocked vendor changes");
for (const file of staged) {
  console.log(`- staged: ${file}`);
}
for (const file of unstaged) {
  console.log(`- unstaged: ${file}`);
}
for (const file of untracked) {
  console.log(`- untracked: ${file}`);
}

console.log("\nTreat vendored skills as pinned dependencies. Put project-local wrappers under skills/<name>/ or scripts/ instead.");
process.exit(1);

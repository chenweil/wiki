#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const checks = [
  ["OKF compatibility", ["node", "scripts/lint-wiki-okf.mjs"]],
  ["Raw large files", ["node", "scripts/lint-raw-large-files.mjs"]],
  ["IMA manifest", ["node", "scripts/ima-manifest.mjs", "lint"]],
  ["Vendor clean", ["node", "scripts/lint-vendor-clean.mjs"]],
];

let failed = 0;

for (const [name, command] of checks) {
  console.log(`\n== ${name} ==`);
  const result = spawnSync(command[0], command.slice(1), {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    failed += 1;
  }
}

console.log(`\nMaintenance checks complete: ${checks.length - failed}/${checks.length} passed`);
process.exit(failed === 0 ? 0 : 1);

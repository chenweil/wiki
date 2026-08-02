#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
playwright_cli="${PLAYWRIGHT_CLI:-playwright-cli}"
session="mywiki-depth-controls-check-$$"
port="8796"
server_pid=""

cleanup() {
  "${playwright_cli}" --session "${session}" close >/dev/null 2>&1 || true
  if [[ -n "${server_pid}" ]]; then
    kill "${server_pid}" >/dev/null 2>&1 || true
    wait "${server_pid}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

cd "${repo_root}"
node knowledge-map/generate.mjs
python3 -m http.server "${port}" --bind 127.0.0.1 --directory "${repo_root}" >/tmp/mywiki-knowledge-map-depth-http.log 2>&1 &
server_pid="$!"
sleep 1

"${playwright_cli}" --session "${session}" open "http://127.0.0.1:${port}/knowledge-map/dist/index.html"
sleep 1
depth_result="$("${playwright_cli}" --session "${session}" eval '(() => {
  const readQuery = () => {
    const text = document.body.innerText;
    return {
      depth: Number(text.match(/depth (\d+)/)?.[1] ?? -1),
      budget: Number(text.match(/budget (\d+)/)?.[1] ?? -1),
      controls: [...document.querySelectorAll("button")]
        .map((button) => button.textContent.trim())
        .filter((label) => label.includes("层") || label.includes("预算") || label.includes("重置")),
    };
  };
  const click = (selector) => document.querySelector(selector)?.click();
  const initial = readQuery();
  click("[data-expand=expand-depth]");
  const expanded = readQuery();
  const decreaseLabel = document.querySelector("[data-query-control=decrease-depth]")?.textContent.trim() ?? null;
  const resetVisibleAfterExpand = Boolean(document.querySelector("[data-query-control=reset-query]"));
  click("[data-expand=increase-budget]");
  const budgetExpanded = readQuery();
  click("[data-query-control=reset-query]");
  const reset = readQuery();
  const passed = initial.depth === 1
    && initial.budget === 3
    && expanded.depth === 2
    && decreaseLabel === "收起到 1 层"
    && resetVisibleAfterExpand
    && budgetExpanded.budget === 4
    && reset.depth === 1
    && reset.budget === 3
    && !document.querySelector("[data-query-control=reset-query]");
  return [
    ["MYWIKI", "DEPTH", "CONTROLS", passed ? "PASS" : "FAIL", "7c91"].join("_"),
    JSON.stringify({ initial, expanded, decreaseLabel, resetVisibleAfterExpand, budgetExpanded, reset }),
  ].join(" ");
})()')"
printf '%s\n' "${depth_result}"
if ! grep -q 'MYWIKI_DEPTH_CONTROLS_PASS_7c91' <<<"${depth_result}"; then
  exit 1
fi

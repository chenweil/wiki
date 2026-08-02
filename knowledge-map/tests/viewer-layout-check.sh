#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
playwright_cli="${PLAYWRIGHT_CLI:-playwright-cli}"
session="mywiki-layout-check-$$"
port="8793"
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
python3 -m http.server "${port}" --bind 127.0.0.1 --directory "${repo_root}" >/tmp/mywiki-knowledge-map-layout-http.log 2>&1 &
server_pid="$!"
sleep 1

"${playwright_cli}" --session "${session}" open "http://127.0.0.1:${port}/knowledge-map/dist/index.html"
sleep 1
layout_result="$("${playwright_cli}" --session "${session}" eval '(() => { const frame = document.querySelector(".map-frame"); const svg = document.querySelector(".map-frame svg"); const frameBox = frame?.getBoundingClientRect(); const nodes = [...document.querySelectorAll(".map-frame .node")]; const visibleNodeCount = nodes.filter((node) => { const box = node.getBoundingClientRect(); return box.width > 0 && box.height > 0 && box.bottom > (frameBox?.top ?? 0) && box.top < innerHeight; }).length; const metrics = { viewport: [innerWidth, innerHeight], frame: frameBox?.toJSON(), svg: svg?.getBoundingClientRect().toJSON(), visibleNodeCount }; const passed = frame && svg && frameBox.height <= innerHeight && visibleNodeCount > 0; const marker = ["MYWIKI", "MAP", "LAYOUT", passed ? "PASS" : "FAIL", "4d2e"].join("_"); return [marker, JSON.stringify(metrics)].join(" "); })()')"
printf '%s\n' "${layout_result}"
if ! grep -q 'MYWIKI_MAP_LAYOUT_PASS_4d2e' <<<"${layout_result}"; then
  exit 1
fi

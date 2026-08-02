import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

const viewerPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../viewer/index.html');

test('exposes the synchronized B Navigator acceptance controls', async () => {
  const viewer = await readFile(viewerPath, 'utf8');

  assert.match(viewer, /\['focus', 'strict'\]/);
  assert.match(viewer, /data-visibility-mode="\$\{mode\}"/);
  assert.match(viewer, /聚焦模式/);
  assert.match(viewer, /严格隐藏/);
  assert.match(viewer, /子图查询 provenance/);
  assert.match(viewer, /省略/);
  assert.match(viewer, /ArrowDown/);
  assert.match(viewer, /ArrowUp/);
  assert.match(viewer, /node\.provenance/);
  assert.match(viewer, /result\.provenance/);
});

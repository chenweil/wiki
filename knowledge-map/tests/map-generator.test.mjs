import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  DEFAULT_SCOPE,
  generateMapSnapshot,
  writeMapSnapshot,
} from '../lib/map-generator.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const wikiRoot = path.join(repoRoot, 'wiki');

test('generates a versioned AI-engineering snapshot from maintained Wiki pages', () => {
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });

  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.manifest.scope.id, DEFAULT_SCOPE.id);
  assert.equal(snapshot.manifest.generatedAt, '2026-08-02T00:00:00.000Z');
  assert.equal(snapshot.nodes.length, DEFAULT_SCOPE.slugs.length);
  assert.deepEqual(
    new Set(snapshot.nodes.map((node) => node.type)),
    new Set(['concept', 'source', 'synthesis']),
  );
  assert.ok(snapshot.nodes.every((node) => node.status === 'located'));
  assert.ok(snapshot.nodes.every((node) => node.pagePath.startsWith('wiki/')));
  assert.ok(snapshot.nodes.every((node) => !path.isAbsolute(node.pagePath)));
  assert.ok(snapshot.manifest.inputs.every((input) => input.contentHash.length === 64));
});

test('preserves explicit page-link relations and their declaring evidence', () => {
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });
  const claudeToSkill = snapshot.relations.find(
    (relation) => relation.from === 'claude-code' && relation.to === 'skill',
  );
  const claudeToGuide = snapshot.relations.find(
    (relation) => relation.from === 'claude-code' && relation.to === 'claude-code-from-beginner-to-master-v2',
  );

  assert.equal(claudeToSkill?.kind, 'explicit');
  assert.equal(claudeToSkill?.layer, 'page-link');
  assert.ok(claudeToSkill.provenance.declarations.some((item) => item.kind === 'wikilink'));
  assert.equal(claudeToSkill.provenance.sourcePagePath, 'wiki/concepts/claude-code.md');
  assert.ok(claudeToSkill.provenance.declarations.every((item) => item.field));
  assert.equal(claudeToGuide?.kind, 'explicit');
  assert.ok(claudeToGuide.provenance.declarations.some((item) => item.kind === 'source'));
  assert.ok(snapshot.relations
    .filter((relation) => relation.layer === 'page-link')
    .every((relation) => relation.provenance.sourcePagePath.startsWith('wiki/')));
});

test('rebuilds the same snapshot identity for the same input and generation time', () => {
  const options = { wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' };
  const first = generateMapSnapshot(options);
  const second = generateMapSnapshot(options);

  assert.equal(first.manifest.mapVersion, second.manifest.mapVersion);
  assert.deepEqual(first.nodes, second.nodes);
  assert.deepEqual(first.relations, second.relations);
});

test('writes a JSON artifact that can be loaded by the viewer', async () => {
  const tempDirectory = await mkdtemp(path.join(tmpdir(), 'mywiki-map-'));
  const outputPath = path.join(tempDirectory, 'map.json');
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });

  await writeMapSnapshot(snapshot, outputPath);
  const loaded = JSON.parse(await readFile(outputPath, 'utf8'));

  assert.equal(loaded.manifest.mapVersion, snapshot.manifest.mapVersion);
  assert.equal(loaded.nodes.length, snapshot.nodes.length);
  assert.equal(loaded.relations.length, snapshot.relations.length);
});

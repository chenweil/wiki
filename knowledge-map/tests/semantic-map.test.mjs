import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

import { generateMapSnapshot } from '../lib/map-generator.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const wikiRoot = path.join(repoRoot, 'wiki');
const options = { wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' };

test('generates stable semantic positions in a separate inferred relation layer', () => {
  const snapshot = generateMapSnapshot(options);
  const semanticRelations = snapshot.relations.filter((relation) => relation.layer === 'semantic-exploration');

  assert.equal(snapshot.manifest.generation.embedding.backend, 'deterministic-token-hash');
  assert.equal(snapshot.manifest.generation.embedding.remote, false);
  assert.equal(snapshot.manifest.generation.projection.algorithm, 'seeded-random-projection-v1');
  assert.ok(snapshot.nodes.every((node) => node.status === 'located' && node.position));
  assert.ok(semanticRelations.length > 0);
  assert.ok(semanticRelations.every((relation) => relation.kind === 'inferred'));
  assert.ok(semanticRelations.every((relation) => relation.provenance.basis.kind === 'semantic-similarity'));
  assert.ok(semanticRelations.every((relation) => Number.isFinite(relation.provenance.basis.score)));
  assert.ok(semanticRelations.every((relation) => !snapshot.relations.some(
    (candidate) => candidate.layer === 'page-link'
      && candidate.from === relation.from
      && candidate.to === relation.to,
  )));
});

test('keeps inferred relations within the per-node budget and stable across rebuilds', () => {
  const first = generateMapSnapshot(options);
  const second = generateMapSnapshot(options);
  const semanticRelations = first.relations.filter((relation) => relation.layer === 'semantic-exploration');
  const degree = new Map(first.nodes.map((node) => [node.id, 0]));
  for (const relation of semanticRelations) {
    degree.set(relation.from, degree.get(relation.from) + 1);
    degree.set(relation.to, degree.get(relation.to) + 1);
  }

  assert.equal(first.manifest.mapVersion, second.manifest.mapVersion);
  assert.deepEqual(first.nodes, second.nodes);
  assert.deepEqual(
    semanticRelations,
    second.relations.filter((relation) => relation.layer === 'semantic-exploration'),
  );
  assert.ok([...degree.values()].every((count) => count <= 3));
  assert.ok(semanticRelations.every((relation) => relation.provenance.basis.score >= 0.18));
});

test('keeps a failed semantic node visible and unlocated without a fabricated position', () => {
  const failingBackend = {
    backend: 'test-failure-backend',
    model: 'fixture',
    version: '1',
    dimensions: 32,
    seed: 'fixture',
    remote: false,
    embed(text) {
      if (text.includes('Claude Code Engineering Map')) throw new Error('fixture embedding failure');
      return [1, ...Array(31).fill(0)];
    },
  };
  const snapshot = generateMapSnapshot({ ...options, embeddingBackend: failingBackend });
  const failedNode = snapshot.nodes.find((node) => node.id === 'claude-code-engineering-map');

  assert.equal(failedNode.status, 'unlocated');
  assert.equal(failedNode.position, null);
  assert.equal(failedNode.locationError, 'fixture embedding failure');
  assert.ok(snapshot.relations.some(
    (relation) => relation.layer === 'page-link'
      && (relation.from === failedNode.id || relation.to === failedNode.id),
  ));
  assert.ok(snapshot.relations.every(
    (relation) => relation.layer !== 'semantic-exploration'
      || (relation.from !== failedNode.id && relation.to !== failedNode.id),
  ));
});

test('rejects a remote embedding backend without explicit opt-in', () => {
  const remoteBackend = {
    backend: 'remote-fixture',
    model: 'fixture',
    version: '1',
    dimensions: 32,
    seed: 'fixture',
    remote: true,
    embed() {
      throw new Error('remote backend should not receive Wiki content');
    },
  };

  assert.throws(
    () => generateMapSnapshot({ ...options, embeddingBackend: remoteBackend }),
    /Remote embedding requires explicit opt-in/,
  );
});

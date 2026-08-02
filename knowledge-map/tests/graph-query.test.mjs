import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

import { generateMapSnapshot } from '../lib/map-generator.mjs';
import { querySubgraph } from '../lib/graph-query.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const wikiRoot = path.join(repoRoot, 'wiki');

test('returns a versioned bounded initial subgraph with continuation metadata', () => {
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });
  const result = querySubgraph(snapshot, {
    seedNodeId: 'claude-code-engineering-map',
    layers: ['page-link'],
    depth: 1,
    relationBudget: 1,
    filters: {},
  });

  assert.equal(result.snapshotVersion, snapshot.manifest.mapVersion);
  assert.equal(result.query.seedNodeId, 'claude-code-engineering-map');
  assert.deepEqual(result.query.layers, ['page-link']);
  assert.equal(result.query.depth, 1);
  assert.equal(result.query.relationBudget, 1);
  assert.ok(result.nodes.some((node) => node.id === result.query.seedNodeId));
  assert.ok(result.nodes.length < snapshot.nodes.length);
  assert.equal(result.complete, false);
  assert.ok(result.omitted.nodes > 0 || result.omitted.relations > 0);
  assert.ok(result.continuation);
  assert.ok(result.relations.every((relation) => result.nodes.some((node) => node.id === relation.from)));
  assert.ok(result.relations.every((relation) => result.nodes.some((node) => node.id === relation.to)));
});

test('records query scope and bounded result state in structured provenance', () => {
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });
  const result = querySubgraph(snapshot, {
    seedNodeId: 'claude-code-engineering-map',
    layers: ['page-link'],
    depth: 0,
    relationBudget: 1,
  });

  assert.deepEqual(result.provenance.scope, snapshot.manifest.scope);
  assert.equal(result.provenance.snapshotVersion, snapshot.manifest.mapVersion);
  assert.deepEqual(result.provenance.query, result.query);
  assert.equal(result.provenance.result.status, result.status);
  assert.equal(result.provenance.result.complete, result.complete);
  assert.deepEqual(result.provenance.result.omitted, result.omitted);
  assert.deepEqual(result.provenance.result.continuation, result.continuation);
  assert.equal(result.provenance.result.failure, null);
});

test('repeats the same query stably without mutating the immutable snapshot', () => {
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });
  const before = JSON.stringify(snapshot);
  const query = {
    seedNodeId: 'claude-code-engineering-map',
    layers: ['page-link', 'semantic-exploration'],
    depth: 1,
    relationBudget: 2,
    filters: { types: ['concept', 'synthesis'] },
  };
  const first = querySubgraph(snapshot, query);
  const second = querySubgraph(snapshot, query);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(snapshot), before);
  assert.equal(first.provenance.snapshotVersion, snapshot.manifest.mapVersion);
  assert.deepEqual(first.provenance.query, first.query);
  assert.ok(first.nodes.every((node) => ['concept', 'synthesis'].includes(node.type)));
  assert.ok(first.relations.every((relation) => ['page-link', 'semantic-exploration'].includes(relation.layer)));
});

test('returns explicit failure provenance for invalid or filtered queries', () => {
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });
  const unknownSeed = querySubgraph(snapshot, { seedNodeId: 'missing-node' });
  const invalidLayer = querySubgraph(snapshot, { seedNodeId: 'claude-code', layer: 'unknown-layer' });
  const filteredSeed = querySubgraph(snapshot, {
    seedNodeId: 'claude-code',
    filters: { types: ['synthesis'] },
  });

  assert.equal(unknownSeed.status, 'failed');
  assert.equal(unknownSeed.failure.code, 'unknown-seed');
  assert.equal(unknownSeed.snapshotVersion, snapshot.manifest.mapVersion);
  assert.equal(invalidLayer.failure.code, 'invalid-query');
  assert.equal(filteredSeed.failure.code, 'seed-filtered');
  assert.equal(filteredSeed.nodes.length, 0);
  assert.equal(filteredSeed.provenance.result.failure.code, 'seed-filtered');
  assert.deepEqual(filteredSeed.provenance.scope, snapshot.manifest.scope);
});

test('expanding the same seed preserves the current subgraph and adds bounded neighbors', () => {
  const snapshot = generateMapSnapshot({ wikiRoot, generatedAt: '2026-08-02T00:00:00.000Z' });
  const initial = querySubgraph(snapshot, {
    seedNodeId: 'claude-code-engineering-map',
    layers: ['page-link', 'semantic-exploration'],
    depth: 1,
    relationBudget: 2,
    filters: {},
  });
  const expanded = querySubgraph(snapshot, {
    ...initial.query,
    depth: 2,
  });

  assert.equal(expanded.snapshotVersion, initial.snapshotVersion);
  assert.ok(expanded.nodes.length >= initial.nodes.length);
  assert.ok(expanded.relations.length >= initial.relations.length);
  assert.ok(initial.nodes.every((node) => expanded.nodes.some((candidate) => candidate.id === node.id)));
  assert.ok(initial.relations.every((relation) => expanded.relations.some((candidate) => candidate.id === relation.id)));
  assert.equal(expanded.query.depth, 2);
});

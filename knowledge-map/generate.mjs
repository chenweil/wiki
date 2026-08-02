#!/usr/bin/env node

import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEFAULT_SCOPE, generateMapSnapshot, writeMapSnapshot } from './lib/map-generator.mjs';

const knowledgeMapRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(knowledgeMapRoot, '..');
const args = new Map();
for (let index = 0; index < process.argv.slice(2).length; index += 2) {
  const key = process.argv[index + 2];
  const value = process.argv[index + 3];
  if (key?.startsWith('--')) args.set(key, value);
}

if (args.has('--help')) {
  console.log('Usage: node knowledge-map/generate.mjs [--wiki-root PATH] [--out DIR]');
  process.exit(0);
}

const wikiRoot = path.resolve(args.get('--wiki-root') || path.join(repositoryRoot, 'wiki'));
const outputDirectory = path.resolve(args.get('--out') || path.join(knowledgeMapRoot, 'dist'));
const snapshot = generateMapSnapshot({ wikiRoot, scope: DEFAULT_SCOPE });

await writeMapSnapshot(snapshot, path.join(outputDirectory, 'map.json'));
await copyFile(path.join(knowledgeMapRoot, 'viewer', 'index.html'), path.join(outputDirectory, 'index.html'));
await copyFile(path.join(knowledgeMapRoot, 'viewer', 'page.html'), path.join(outputDirectory, 'page.html'));

console.log(JSON.stringify({
  ok: true,
  mapVersion: snapshot.manifest.mapVersion,
  nodes: snapshot.nodes.length,
  relations: snapshot.relations.length,
  outputDirectory,
}));

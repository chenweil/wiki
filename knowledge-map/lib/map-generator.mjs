import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const MAP_SCHEMA_VERSION = 1;
export const PROVENANCE_SCHEMA_VERSION = 1;

export const DEFAULT_SEMANTIC_OPTIONS = Object.freeze({
  relationBudget: 3,
  similarityThreshold: 0.18,
  projection: Object.freeze({
    algorithm: 'seeded-random-projection-v1',
    seed: 'mywiki-semantic-v1',
  }),
});

export const DEFAULT_SCOPE = Object.freeze({
  id: 'ai-engineering',
  label: 'AI engineering topic subgraph',
  slugs: Object.freeze([
    'claude-code',
    'skill',
    'skill-development',
    'plugin',
    'agent-architecture',
    'loop-design',
    'agent-harness-survey',
    'ai-programming-deep-dive',
    'obsidian-claude-code-skill-trigger',
    'obsidian-claude-code-multi-agent-guide',
    'obsidian-agent-skill-spec-build-patterns',
    'loop-design-five-levels',
    'claude-code-from-beginner-to-master-v2',
    'hermes-agent-mastery',
    'claude-code-engineering-map',
  ]),
});

const PAGE_TYPE_BY_DIRECTORY = new Map([
  ['concepts', 'concept'],
  ['sources', 'source'],
  ['syntheses', 'synthesis'],
]);

export function createDeterministicEmbeddingBackend({ dimensions = 32, seed = 'mywiki-semantic-v1' } = {}) {
  return Object.freeze({
    backend: 'deterministic-token-hash',
    model: 'token-hash-v1',
    version: '1',
    dimensions,
    seed,
    remote: false,
    embed(text) {
      return deterministicEmbedding(text, dimensions, seed);
    },
  });
}

export const DEFAULT_EMBEDDING_BACKEND = createDeterministicEmbeddingBackend();

export function generateMapSnapshot({
  wikiRoot,
  scope = DEFAULT_SCOPE,
  generatedAt = new Date().toISOString(),
  embeddingBackend = DEFAULT_EMBEDDING_BACKEND,
  semanticOptions = DEFAULT_SEMANTIC_OPTIONS,
  allowRemoteEmbedding = false,
} = {}) {
  if (!wikiRoot) throw new Error('wikiRoot is required');

  const records = collectPages(wikiRoot);
  const recordsBySlug = new Map(records.map((record) => [record.slug, record]));
  const missingSlugs = scope.slugs.filter((slug) => !recordsBySlug.has(slug));
  if (missingSlugs.length > 0) {
    throw new Error(`Scope references missing Wiki pages: ${missingSlugs.join(', ')}`);
  }

  const nodes = scope.slugs.map((slug) => createNode(recordsBySlug.get(slug)));
  const nodesBySlug = new Map(nodes.map((node) => [node.id, node]));
  const explicitRelations = createExplicitRelations(scope.slugs.map((slug) => recordsBySlug.get(slug)), nodesBySlug);
  const embeddingConfig = normalizeEmbeddingConfig(embeddingBackend);
  if (embeddingConfig.remote && !allowRemoteEmbedding) {
    throw new Error('Remote embedding requires explicit opt-in');
  }
  const normalizedSemanticOptions = normalizeSemanticOptions(semanticOptions);
  const semanticRelations = createSemanticLayer({
    records: scope.slugs.map((slug) => recordsBySlug.get(slug)),
    nodes,
    explicitRelations,
    embeddingBackend,
    embeddingConfig,
    semanticOptions: normalizedSemanticOptions,
  });
  const relations = [...explicitRelations, ...semanticRelations].sort(sortRelations);
  const inputHashes = nodes.map(({ id, pagePath, contentHash }) => ({ id, pagePath, contentHash }));
  const identity = {
    schemaVersion: MAP_SCHEMA_VERSION,
    scopeId: scope.id,
    nodeIds: nodes.map((node) => node.id),
    inputHashes,
    relationMode: 'explicit-page-link+semantic-exploration',
    embedding: embeddingConfig,
    projection: normalizedSemanticOptions.projection,
    relationBudget: normalizedSemanticOptions.relationBudget,
    similarityThreshold: normalizedSemanticOptions.similarityThreshold,
  };
  const mapVersion = `map-v${MAP_SCHEMA_VERSION}-${hash(identity).slice(0, 16)}`;
  const generation = { mapVersion, generatedAt, scopeId: scope.id };
  for (const node of nodes) node.provenance.generation = generation;
  for (const relation of relations) relation.provenance.generation = generation;

  return {
    schemaVersion: MAP_SCHEMA_VERSION,
    manifest: {
      mapVersion,
      generatedAt,
      scope: {
        id: scope.id,
        label: scope.label,
        nodeIds: nodes.map((node) => node.id),
      },
      inputs: inputHashes,
      generation: {
        relationMode: 'explicit-page-link+semantic-exploration',
        layout: normalizedSemanticOptions.projection.algorithm,
        embedding: embeddingConfig,
        projection: {
          ...normalizedSemanticOptions.projection,
          dimensions: 2,
          relationBudget: normalizedSemanticOptions.relationBudget,
          similarityThreshold: normalizedSemanticOptions.similarityThreshold,
        },
        layers: ['page-link', 'semantic-exploration'],
      },
      provenance: {
        schemaVersion: PROVENANCE_SCHEMA_VERSION,
        sourceBoundary: 'wiki',
        generation,
      },
    },
    nodes,
    relations,
  };
}

export async function writeMapSnapshot(snapshot, outputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}

function normalizeEmbeddingConfig(embeddingBackend) {
  if (!embeddingBackend || typeof embeddingBackend.embed !== 'function') {
    throw new Error('embeddingBackend.embed must be a function');
  }
  const dimensions = Number(embeddingBackend.dimensions);
  if (!Number.isInteger(dimensions) || dimensions < 2) {
    throw new Error('embeddingBackend.dimensions must be an integer greater than 1');
  }
  return {
    backend: String(embeddingBackend.backend || 'custom'),
    model: String(embeddingBackend.model || 'custom'),
    version: String(embeddingBackend.version || '1'),
    dimensions,
    seed: String(embeddingBackend.seed || 'custom'),
    remote: Boolean(embeddingBackend.remote),
  };
}

function normalizeSemanticOptions(options) {
  const projection = {
    ...DEFAULT_SEMANTIC_OPTIONS.projection,
    ...(options?.projection || {}),
  };
  const relationBudget = Number(options?.relationBudget ?? DEFAULT_SEMANTIC_OPTIONS.relationBudget);
  const similarityThreshold = Number(options?.similarityThreshold ?? DEFAULT_SEMANTIC_OPTIONS.similarityThreshold);
  if (!Number.isInteger(relationBudget) || relationBudget < 0) {
    throw new Error('semanticOptions.relationBudget must be a non-negative integer');
  }
  if (!Number.isFinite(similarityThreshold) || similarityThreshold < -1 || similarityThreshold > 1) {
    throw new Error('semanticOptions.similarityThreshold must be between -1 and 1');
  }
  return { relationBudget, similarityThreshold, projection };
}

function deterministicEmbedding(text, dimensions, seed) {
  const vector = Array.from({ length: dimensions }, () => 0);
  const tokens = text.toLocaleLowerCase().match(/[a-z0-9][a-z0-9_-]*|[\u4e00-\u9fff]/g) || [];
  for (const token of tokens) {
    const digest = createHash('sha256').update(`${seed}:${token}`).digest();
    const bucket = digest.readUInt32BE(0) % dimensions;
    const sign = digest[4] % 2 === 0 ? 1 : -1;
    vector[bucket] += sign;
  }
  return normalizeVector(vector);
}

function validateVector(vector, dimensions) {
  if (!vector || typeof vector[Symbol.iterator] !== 'function') {
    throw new Error('embedding backend returned a non-iterable vector');
  }
  const values = [...vector].map(Number);
  if (values.length !== dimensions || values.some((value) => !Number.isFinite(value))) {
    throw new Error(`embedding backend returned an invalid ${dimensions}-dimensional vector`);
  }
  return normalizeVector(values);
}

function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value ** 2, 0));
  if (!magnitude) throw new Error('embedding backend returned a zero vector');
  return vector.map((value) => value / magnitude);
}

function createProjectionAxis(dimensions, seed, axis) {
  return Array.from({ length: dimensions }, (_, index) => {
    const digest = createHash('sha256').update(`${seed}:projection:${axis}:${index}`).digest();
    return digest[0] % 2 === 0 ? 1 : -1;
  });
}

function dot(left, right) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function range(values) {
  if (!values.length) return { min: 0, max: 0 };
  return { min: Math.min(...values), max: Math.max(...values) };
}

function scale(value, bounds) {
  if (bounds.max === bounds.min) return 0.5;
  return round((value - bounds.min) / (bounds.max - bounds.min));
}

function round(value) {
  return Number(value.toFixed(6));
}

function unorderedRelationKey(left, right) {
  return [left, right].sort().join('\u0000');
}

function sortRelations(left, right) {
  return left.layer.localeCompare(right.layer) || left.id.localeCompare(right.id);
}

function collectPages(directory, root = directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectPages(entryPath, root);
    if (!entry.isFile() || !entry.name.endsWith('.md')) return [];

    const markdown = readFileSync(entryPath, 'utf8');
    const frontmatter = parseFrontmatter(markdown);
    const relativePath = toPosix(path.relative(path.dirname(root), entryPath));
    const directoryName = path.basename(path.dirname(entryPath));
    const slug = path.basename(entry.name, '.md');

    return [{
      slug,
      markdown,
      body: frontmatter.body,
      frontmatter,
      pagePath: relativePath,
      inferredType: PAGE_TYPE_BY_DIRECTORY.get(directoryName),
      contentHash: hash(markdown),
    }];
  });
}

function createNode(record) {
  const frontmatter = record.frontmatter;
  const title = frontmatter.title || firstHeading(record.body) || record.slug;
  const type = frontmatter.type || record.inferredType || 'page';

  return {
    id: record.slug,
    title,
    type,
    status: 'unlocated',
    description: frontmatter.description || '',
    summary: extractSection(record.body, 'Summary') || frontmatter.description || '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    sources: Array.isArray(frontmatter.sources) ? frontmatter.sources : [],
    updated: frontmatter.updated || null,
    pagePath: record.pagePath,
    contentHash: record.contentHash,
    position: null,
    provenance: {
      kind: 'wiki-page',
      page: {
        id: record.slug,
        path: record.pagePath,
        contentHash: record.contentHash,
      },
    },
  };
}

function createSemanticLayer({
  records,
  nodes,
  explicitRelations,
  embeddingBackend,
  embeddingConfig,
  semanticOptions,
}) {
  const recordsById = new Map(records.map((record) => [record.slug, record]));
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const vectors = new Map();

  for (const node of nodes) {
    try {
      const vector = embeddingBackend.embed(createEmbeddingInput(recordsById.get(node.id)));
      vectors.set(node.id, validateVector(vector, embeddingConfig.dimensions));
    } catch (error) {
      node.status = 'unlocated';
      node.position = null;
      node.locationError = error instanceof Error ? error.message : String(error);
    }
  }

  assignSemanticPositions(nodes, vectors, semanticOptions.projection);
  return createSemanticRelations({
    nodes,
    nodesById,
    vectors,
    explicitRelations,
    embeddingConfig,
    projection: semanticOptions.projection,
    relationBudget: semanticOptions.relationBudget,
    similarityThreshold: semanticOptions.similarityThreshold,
  });
}

function createEmbeddingInput(record) {
  const frontmatter = record.frontmatter;
  return [
    frontmatter.title,
    frontmatter.description,
    ...(Array.isArray(frontmatter.tags) ? frontmatter.tags : []),
    record.body,
  ].filter((value) => typeof value === 'string' && value.trim()).join('\n');
}

function assignSemanticPositions(nodes, vectors, projection) {
  const axes = [
    createProjectionAxis(vectors.values().next().value?.length || 0, projection.seed, 0),
    createProjectionAxis(vectors.values().next().value?.length || 0, projection.seed, 1),
  ];
  const projected = nodes
    .filter((node) => vectors.has(node.id))
    .map((node) => ({
      node,
      x: dot(vectors.get(node.id), axes[0]),
      y: dot(vectors.get(node.id), axes[1]),
    }));

  const ranges = {
    x: range(projected.map((point) => point.x)),
    y: range(projected.map((point) => point.y)),
  };
  for (const point of projected) {
    point.node.status = 'located';
    point.node.position = {
      x: scale(point.x, ranges.x),
      y: scale(point.y, ranges.y),
    };
  }
}

function createSemanticRelations({
  nodes,
  nodesById,
  vectors,
  explicitRelations,
  embeddingConfig,
  projection,
  relationBudget,
  similarityThreshold,
}) {
  const explicitKeys = new Set(explicitRelations.map((relation) => unorderedRelationKey(relation.from, relation.to)));
  const candidates = [];
  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
      const left = nodes[leftIndex];
      const right = nodes[rightIndex];
      if (!vectors.has(left.id) || !vectors.has(right.id)) continue;
      if (explicitKeys.has(unorderedRelationKey(left.id, right.id))) continue;
      const score = dot(vectors.get(left.id), vectors.get(right.id));
      if (score < similarityThreshold) continue;
      candidates.push({ from: left.id, to: right.id, score });
    }
  }

  candidates.sort((left, right) => right.score - left.score || left.from.localeCompare(right.from) || left.to.localeCompare(right.to));
  const degree = new Map(nodes.map((node) => [node.id, 0]));
  return candidates.flatMap((candidate) => {
    if (degree.get(candidate.from) >= relationBudget || degree.get(candidate.to) >= relationBudget) return [];
    degree.set(candidate.from, degree.get(candidate.from) + 1);
    degree.set(candidate.to, degree.get(candidate.to) + 1);
    const score = round(candidate.score);
    return [{
      id: `relation:semantic:${candidate.from}:${candidate.to}`,
      from: candidate.from,
      to: candidate.to,
      kind: 'inferred',
      layer: 'semantic-exploration',
      score,
      provenance: {
        kind: 'inferred-semantic',
        sourceNodeId: candidate.from,
        targetNodeId: candidate.to,
        sourcePage: pageIdentity(nodesById.get(candidate.from)),
        targetPage: pageIdentity(nodesById.get(candidate.to)),
        basis: {
          kind: 'semantic-similarity',
          label: 'cosine similarity in the local deterministic embedding space',
          score,
        },
        embedding: {
          backend: embeddingConfig.backend,
          model: embeddingConfig.model,
          version: embeddingConfig.version,
          inputHashes: {
            [candidate.from]: nodesById.get(candidate.from).contentHash,
            [candidate.to]: nodesById.get(candidate.to).contentHash,
          },
          configuration: { ...embeddingConfig },
        },
        projection: { ...projection, dimensions: 2 },
        relationPolicy: { relationBudget, similarityThreshold },
      },
    }];
  });
}

function createExplicitRelations(records, nodesBySlug) {
  const relationByTarget = new Map();

  for (const record of records) {
    const declarations = [];
    for (const target of extractWikiLinks(record.body)) {
      if (nodesBySlug.has(target)) {
        declarations.push({ kind: 'wikilink', field: 'body', target });
      }
    }
    for (const source of record.frontmatter.sources || []) {
      if (source?.kind === 'wiki-page' && typeof source.page === 'string' && nodesBySlug.has(source.page)) {
        declarations.push({ kind: 'source', field: 'sources', target: source.page });
      }
    }

    for (const declaration of declarations) {
      const key = `${record.slug}\u0000${declaration.target}`;
      const relation = relationByTarget.get(key) || {
        id: `relation:${record.slug}:${declaration.target}`,
        from: record.slug,
        to: declaration.target,
        kind: 'explicit',
        layer: 'page-link',
        provenance: {
          kind: 'explicit-page-link',
          sourceNodeId: record.slug,
          sourcePagePath: nodesBySlug.get(record.slug).pagePath,
          sourcePage: pageIdentity(nodesBySlug.get(record.slug)),
          targetNodeId: declaration.target,
          targetPage: pageIdentity(nodesBySlug.get(declaration.target)),
          declarations: [],
        },
      };
      relation.provenance.declarations.push(declaration);
      relationByTarget.set(key, relation);
    }
  }

  return [...relationByTarget.values()].sort((left, right) => left.id.localeCompare(right.id));
}

function parseFrontmatter(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  if (lines[0] !== '---') return { body: markdown };
  const end = lines.indexOf('---', 1);
  if (end === -1) return { body: markdown };

  const data = {};
  let currentListKey = null;
  let currentObject = null;

  for (const line of lines.slice(1, end)) {
    if (line.trim() === '') continue;
    const listItem = line.match(/^\s*-\s*(.*)$/);
    if (listItem && currentListKey) {
      const objectItem = listItem[1].match(/^([\w-]+):\s*(.*)$/);
      if (objectItem) {
        currentObject = { [objectItem[1]]: parseScalar(objectItem[2]) };
        data[currentListKey].push(currentObject);
      } else {
        currentObject = null;
        data[currentListKey].push(parseScalar(listItem[1]));
      }
      continue;
    }

    const nested = line.match(/^\s{2,}([\w-]+):\s*(.*)$/);
    if (nested && currentObject) {
      currentObject[nested[1]] = parseScalar(nested[2]);
      continue;
    }

    const field = line.match(/^([\w-]+):\s*(.*)$/);
    if (!field) continue;
    const [, key, value] = field;
    if (value === '') {
      data[key] = [];
      currentListKey = key;
      currentObject = null;
    } else {
      data[key] = parseScalar(value);
      currentListKey = null;
      currentObject = null;
    }
  }

  return { ...data, body: lines.slice(end + 1).join('\n').replace(/^\n+/, '') };
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  return trimmed;
}

function extractWikiLinks(body) {
  const links = [];
  const pattern = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]+)?\]\]/g;
  for (const match of body.matchAll(pattern)) links.push(match[1].trim());
  return links;
}

function extractSection(body, heading) {
  const lines = body.split('\n');
  const start = lines.findIndex((line) => line.trim().toLowerCase() === `## ${heading.toLowerCase()}`);
  if (start === -1) return '';
  const section = [];
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line)) break;
    section.push(line);
  }
  return section.join(' ').replace(/\s+/g, ' ').trim();
}

function firstHeading(body) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim() || '';
}

function hash(value) {
  const input = typeof value === 'string' ? value : JSON.stringify(value);
  return createHash('sha256').update(input).digest('hex');
}

function pageIdentity(node) {
  return {
    id: node.id,
    path: node.pagePath,
    contentHash: node.contentHash,
  };
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

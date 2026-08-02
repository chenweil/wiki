import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const MAP_SCHEMA_VERSION = 1;

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

export function generateMapSnapshot({
  wikiRoot,
  scope = DEFAULT_SCOPE,
  generatedAt = new Date().toISOString(),
} = {}) {
  if (!wikiRoot) throw new Error('wikiRoot is required');

  const records = collectPages(wikiRoot);
  const recordsBySlug = new Map(records.map((record) => [record.slug, record]));
  const missingSlugs = scope.slugs.filter((slug) => !recordsBySlug.has(slug));
  if (missingSlugs.length > 0) {
    throw new Error(`Scope references missing Wiki pages: ${missingSlugs.join(', ')}`);
  }

  const nodes = scope.slugs.map((slug, index) => createNode(recordsBySlug.get(slug), index, scope.slugs.length));
  const nodesBySlug = new Map(nodes.map((node) => [node.id, node]));
  const relations = createExplicitRelations(scope.slugs.map((slug) => recordsBySlug.get(slug)), nodesBySlug);
  const inputHashes = nodes.map(({ id, pagePath, contentHash }) => ({ id, pagePath, contentHash }));
  const identity = {
    schemaVersion: MAP_SCHEMA_VERSION,
    scopeId: scope.id,
    nodeIds: nodes.map((node) => node.id),
    inputHashes,
    relationMode: 'explicit-page-link',
    layout: 'explicit-radial-v1',
  };
  const mapVersion = `map-v${MAP_SCHEMA_VERSION}-${hash(identity).slice(0, 16)}`;

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
        relationMode: 'explicit-page-link',
        layout: 'explicit-radial-v1',
        embedding: null,
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

function createNode(record, index, total) {
  const frontmatter = record.frontmatter;
  const title = frontmatter.title || firstHeading(record.body) || record.slug;
  const type = frontmatter.type || record.inferredType || 'page';
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 0.34;

  return {
    id: record.slug,
    title,
    type,
    status: 'located',
    description: frontmatter.description || '',
    summary: extractSection(record.body, 'Summary') || frontmatter.description || '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    sources: Array.isArray(frontmatter.sources) ? frontmatter.sources : [],
    updated: frontmatter.updated || null,
    pagePath: record.pagePath,
    contentHash: record.contentHash,
    position: {
      x: Number((0.5 + Math.cos(angle) * radius).toFixed(6)),
      y: Number((0.5 + Math.sin(angle) * radius).toFixed(6)),
    },
  };
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
          sourceNodeId: record.slug,
          sourcePagePath: nodesBySlug.get(record.slug).pagePath,
          targetNodeId: declaration.target,
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

function toPosix(value) {
  return value.split(path.sep).join('/');
}

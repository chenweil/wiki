export const QUERY_SCHEMA_VERSION = 1;

const SUPPORTED_LAYERS = new Set(['page-link', 'semantic-exploration']);

export function querySubgraph(snapshot, inputQuery = {}) {
  const snapshotVersion = snapshot?.manifest?.mapVersion || null;
  let query;
  try {
    query = normalizeQuery(inputQuery);
  } catch (error) {
    return failureResult(snapshotVersion, fallbackQuery(inputQuery), 'invalid-query', error.message, snapshot?.manifest?.scope);
  }

  if (!snapshotVersion || !Array.isArray(snapshot.nodes) || !Array.isArray(snapshot.relations)) {
    return failureResult(snapshotVersion, query, 'invalid-snapshot', 'MapSnapshot is missing nodes, relations, or version', snapshot?.manifest?.scope);
  }

  const nodesById = new Map(snapshot.nodes.map((node) => [node.id, node]));
  const seed = nodesById.get(query.seedNodeId);
  if (!seed) return failureResult(snapshotVersion, query, 'unknown-seed', `Unknown seed node: ${query.seedNodeId}`, snapshot.manifest.scope);
  if (!matchesFilter(seed, query.filters)) {
    return failureResult(snapshotVersion, query, 'seed-filtered', `Seed node does not match the query filters: ${query.seedNodeId}`, snapshot.manifest.scope);
  }

  const adjacency = createAdjacency(snapshot.nodes, snapshot.relations);
  const visited = new Set([seed.id]);
  const depthByNode = new Map([[seed.id, 0]]);
  const queue = [seed.id];
  const selectedRelationIds = new Set();
  const omittedNodeIds = new Set();
  const omittedRelationIds = new Set();

  while (queue.length) {
    const currentId = queue.shift();
    const currentDepth = depthByNode.get(currentId);
    for (const layer of query.layers) {
      const candidates = [...(adjacency.get(currentId)?.get(layer) || [])].sort(compareRelations);
      const allowed = candidates.slice(0, query.relationBudget);
      for (const relation of candidates.slice(query.relationBudget)) {
        omittedRelationIds.add(relation.id);
        const neighborId = otherNodeId(relation, currentId);
        if (neighborId && !visited.has(neighborId) && matchesFilter(nodesById.get(neighborId), query.filters)) {
          omittedNodeIds.add(neighborId);
        }
      }

      for (const relation of allowed) {
        const neighborId = otherNodeId(relation, currentId);
        const neighbor = nodesById.get(neighborId);
        if (!neighbor) {
          omittedRelationIds.add(relation.id);
          continue;
        }
        if (visited.has(neighborId)) {
          selectedRelationIds.add(relation.id);
          continue;
        }
        if (currentDepth < query.depth && matchesFilter(neighbor, query.filters)) {
          visited.add(neighborId);
          depthByNode.set(neighborId, currentDepth + 1);
          queue.push(neighborId);
          selectedRelationIds.add(relation.id);
          continue;
        }
        omittedRelationIds.add(relation.id);
        if (matchesFilter(neighbor, query.filters)) omittedNodeIds.add(neighborId);
      }
    }
  }

  const resultNodes = [...visited].map((nodeId) => clone(nodesById.get(nodeId)));
  const resultRelations = snapshot.relations
    .filter((relation) => selectedRelationIds.has(relation.id))
    .sort(compareRelations)
    .map(clone);
  const omitted = { nodes: omittedNodeIds.size, relations: omittedRelationIds.size };
  const complete = omitted.nodes === 0 && omitted.relations === 0;
  const continuation = complete ? null : createContinuation(query, omitted);
  const status = complete ? 'complete' : 'partial';

  return {
    schemaVersion: QUERY_SCHEMA_VERSION,
    status,
    snapshotVersion,
    query,
    nodes: resultNodes,
    relations: resultRelations,
    omitted,
    complete,
    continuation,
    failure: null,
    provenance: createResultProvenance({
      snapshotVersion,
      scope: snapshot.manifest.scope,
      query,
      status,
      complete,
      omitted,
      continuation,
      failure: null,
    }),
  };
}

function normalizeQuery(inputQuery) {
  const rawLayers = inputQuery.layers || (inputQuery.layer ? [inputQuery.layer] : [...SUPPORTED_LAYERS]);
  const layers = [...new Set(rawLayers.map(String))];
  const unsupportedLayer = layers.find((layer) => !SUPPORTED_LAYERS.has(layer));
  if (unsupportedLayer) throw new Error(`Unsupported relation layer: ${unsupportedLayer}`);

  const depth = Number(inputQuery.depth ?? inputQuery.range ?? 1);
  const relationBudget = Number(inputQuery.relationBudget ?? 3);
  if (!Number.isInteger(depth) || depth < 0) throw new Error('depth must be a non-negative integer');
  if (!Number.isInteger(relationBudget) || relationBudget < 0) throw new Error('relationBudget must be a non-negative integer');

  return {
    seedNodeId: String(inputQuery.seedNodeId || ''),
    layers,
    depth,
    relationBudget,
    filters: normalizeFilters(inputQuery.filters),
  };
}

function normalizeFilters(filters = {}) {
  const types = normalizeStringList(filters.types ?? filters.type);
  const statuses = normalizeStringList(filters.statuses ?? filters.status);
  const text = String(filters.text ?? filters.query ?? '').trim().toLowerCase();
  return { types, statuses, text };
}

function normalizeStringList(value) {
  if (value === undefined || value === null || value === '' || value === 'all') return [];
  return [...new Set((Array.isArray(value) ? value : [value]).map(String).filter(Boolean))].sort();
}

function fallbackQuery(inputQuery) {
  return {
    seedNodeId: String(inputQuery?.seedNodeId || ''),
    layers: [],
    depth: null,
    relationBudget: null,
    filters: { types: [], statuses: [], text: '' },
  };
}

function failureResult(snapshotVersion, query, code, message, scope = null) {
  const failure = { code, message };
  const omitted = { nodes: 0, relations: 0 };
  return {
    schemaVersion: QUERY_SCHEMA_VERSION,
    status: 'failed',
    snapshotVersion,
    query,
    nodes: [],
    relations: [],
    omitted,
    complete: false,
    continuation: null,
    failure,
    provenance: createResultProvenance({
      snapshotVersion,
      scope,
      query,
      status: 'failed',
      complete: false,
      omitted,
      continuation: null,
      failure,
    }),
  };
}

function createResultProvenance({ snapshotVersion, scope, query, status, complete, omitted, continuation, failure }) {
  return {
    kind: 'subgraph-query',
    schemaVersion: QUERY_SCHEMA_VERSION,
    snapshotVersion,
    scope: clone(scope),
    query: clone(query),
    result: {
      status,
      complete,
      omitted: clone(omitted),
      continuation: clone(continuation),
      failure: clone(failure),
    },
  };
}

function createContinuation(query, omitted) {
  const actions = [];
  if (omitted.nodes > 0) {
    actions.push({
      kind: 'expand-depth',
      query: { ...clone(query), depth: query.depth + 1 },
    });
  }
  if (omitted.relations > 0) {
    actions.push({
      kind: 'increase-budget',
      query: { ...clone(query), relationBudget: Math.max(1, query.relationBudget + 1) },
    });
  }
  return { actions };
}

function createAdjacency(nodes, relations) {
  const adjacency = new Map(nodes.map((node) => [node.id, new Map()]));
  for (const relation of relations) {
    if (!SUPPORTED_LAYERS.has(relation.layer)) continue;
    if (!adjacency.has(relation.from) || !adjacency.has(relation.to)) continue;
    for (const nodeId of [relation.from, relation.to]) {
      const byLayer = adjacency.get(nodeId);
      const layerRelations = byLayer.get(relation.layer) || [];
      layerRelations.push(relation);
      byLayer.set(relation.layer, layerRelations);
    }
  }
  return adjacency;
}

function matchesFilter(node, filters) {
  if (!node) return false;
  if (filters.types.length && !filters.types.includes(node.type)) return false;
  if (filters.statuses.length && !filters.statuses.includes(node.status)) return false;
  if (!filters.text) return true;
  const haystack = [node.title, node.description, node.summary, ...(node.tags || [])].join(' ').toLowerCase();
  return haystack.includes(filters.text);
}

function otherNodeId(relation, currentId) {
  if (relation.from === currentId) return relation.to;
  if (relation.to === currentId) return relation.from;
  return null;
}

function compareRelations(left, right) {
  if (left.layer !== right.layer) return left.layer.localeCompare(right.layer);
  if (left.layer === 'semantic-exploration' && left.score !== right.score) return (right.score || 0) - (left.score || 0);
  return left.id.localeCompare(right.id);
}

function clone(value) {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

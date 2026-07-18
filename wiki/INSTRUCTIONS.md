---
type: project
status: active
created: 2026-07-18
updated: 2026-07-18
title: "Wiki Instructions"
description: "MyWiki 知识层的范围、来源策略和维护偏好。"
tags:
  - mywiki
  - knowledge-management
  - source-policy
---

# Wiki Instructions

This file defines the scope and maintenance preferences for the knowledge layer under `wiki/`.

## Scope

- `wiki/` stores maintained knowledge, not a mirror of every raw document.
- `wiki/sources/` contains one concise summary for each durable source or source batch.
- `wiki/concepts/` contains reusable concepts that should remain useful beyond one source.
- `wiki/syntheses/` contains conclusions derived from multiple source summaries or concepts.
- `wiki/index.md` and `wiki/log.md` are operational pages and remain the navigation and audit trail.

## Source Policy

1. Preserve the original in its source system: `raw/`, the read-only Obsidian vault, or IMA.
2. Keep large binaries out of Git when IMA is the better storage location.
3. Keep enough source metadata and extracted text in this repository for the wiki to remain understandable without a live connector.
4. Use structured `sources` frontmatter. Do not invent paths, IMA identifiers, or claims.
5. Prefer a source summary plus focused concept updates over copying a whole note or book into `wiki/`.

## Ingest Preferences

- Ingest only an explicitly named file, note, or directory.
- For directories, inventory first and process coherent batches in source order.
- Update existing pages before creating near-duplicates.
- Record conflicts and uncertainty instead of silently overwriting an older claim.
- Append one concise entry to `wiki/log.md` for every ingest or maintenance operation.

## Query Preferences

- Start with `wiki/index.md`, then search `wiki/` with `rg`.
- Answer from the maintained wiki first; verify against `raw/`, Obsidian, or IMA only when needed.
- Cite the page or structured source used for important claims.
- When an answer is durable and not already represented, propose a focused wiki page.

## Quality Bar

- Keep pages short enough to scan.
- Use Chinese for maintained content unless preserving the source language is useful.
- Use `[[wikilinks]]` for internal relationships.
- New pages should include `title`, `description`, and `tags` in frontmatter.
- Before committing, run `node scripts/lint-all.mjs` and `git diff --check`.

## Source Instances

The source-instance model is a lightweight registry, not a connector daemon. See `schema/source-registry.md` for the fields and lifecycle. Current source instances are recorded in `raw/obsidian/manifest.md` and `raw/ima/sources.yml`.

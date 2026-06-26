# OKF Compatibility Notes

This repository follows a local LLM wiki workflow. Open Knowledge Format (OKF) is useful here as a small interoperability layer, not as a replacement for the existing source policy.

## Scope

| Area | Rule |
| --- | --- |
| `wiki/` concept pages | Should remain plain Markdown with YAML frontmatter. |
| `wiki/index.md` | Reserved navigation page; do not treat as a normal concept page. |
| `wiki/log.md` | Reserved update history; do not treat as a normal concept page. |
| `raw/` | Remains the raw-source layer; do not convert raw materials into OKF concept pages. |
| `raw/ima/sources.yml` | Remains the provenance registry for IMA notes and media. |
| Obsidian vault | Remains read-only unless explicitly requested otherwise. |

## Minimum Compatibility

Every normal knowledge page under `wiki/` should have YAML frontmatter with:

```yaml
---
type: concept | source | synthesis | project | person | book | question
status: draft | active | needs-review
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources:
  - kind: local-raw | external-raw | obsidian | ima-note | ima-media | wiki-page
---
```

The `type` field is the OKF-required interoperability key. The other fields are local workflow fields that support maintenance, citation, and review.

## Recommended Metadata

When creating or materially touching a page, prefer adding these OKF-style fields:

```yaml
title: Human-readable title
description: One-sentence summary of the page
tags:
  - short-tag
```

Use `resource` only when the page describes a durable external asset with a stable URI. Do not use `resource` as a substitute for `sources`; sourced claims should still use structured `sources` frontmatter and body citations where needed.

## Citation Boundary

OKF treats citations as external support for claims. In this wiki:

1. Raw evidence belongs in `raw/`, Obsidian, or IMA.
2. Source summaries belong in `wiki/sources/`.
3. Concepts and syntheses may depend on source summaries via `kind: wiki-page`, but should preserve direct raw-source provenance when practical.
4. IMA note/media references must also be registered in `raw/ima/sources.yml`.

## Current Audit

As of 2026-06-26:

| Check | Result |
| --- | --- |
| Total `wiki/*.md` pages | 30 |
| Reserved pages (`index.md`, `log.md`) | 2 |
| Normal knowledge pages | 28 |
| Normal pages with frontmatter | 28 |
| Normal pages with `type` | 28 |
| Normal pages with `title` | 0 |
| Normal pages with `description` | 0 |
| Normal pages with `tags` | 0 |

This means the wiki already satisfies the OKF hard requirement for normal concept documents. The next useful migration is gradual enrichment of `title`, `description`, and `tags` when pages are touched for real content work.

## Migration Strategy

Do not run a broad metadata-only rewrite. Instead:

1. New pages should include `title`, `description`, and `tags`.
2. Existing pages should be enriched when they are materially updated.
3. `index.md` and `log.md` should stay operational pages.
4. Linting should warn on missing recommended fields, but only fail on missing frontmatter or missing `type` for normal pages.

Run the local compatibility check with:

```bash
node scripts/lint-wiki-okf.mjs
```

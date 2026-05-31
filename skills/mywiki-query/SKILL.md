---
name: mywiki-query
description: Query and maintain the user's MyWiki LLM wiki. Use when the user asks about their personal wiki, collected notes, Obsidian knowledge base, durable knowledge, prior ingested sources, or wants to search, ingest, update, lint, or file answers back into MyWiki.
---

# MyWiki Query

## Wiki Location

The user's MyWiki repository is:

```text
/Users/chenweilong/Documents/mywiki
```

Primary entry points:

- `wiki/index.md`
- `wiki/log.md`
- `AGENTS.md`
- `schema/workflows.md`
- `schema/citation-rules.md`

External Obsidian vault, read-only by default:

```text
/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note
```

## Query Workflow

Use this when answering questions from the wiki.

1. Read `/Users/chenweilong/Documents/mywiki/wiki/index.md`.
2. Search `/Users/chenweilong/Documents/mywiki/wiki/` with `rg`.
3. Read relevant source, concept, and synthesis pages.
4. Search `raw/` or the external Obsidian vault only when wiki pages are missing context or verification is needed.
5. Answer in Chinese.
6. Cite the wiki page or local source path used.
7. If the answer is durable, offer to write it back into `wiki/`.

## Ingest Workflow

Use this when the user asks to import a PDF, Markdown source, Obsidian note, web clip, or raw material.

1. Identify the source type and exact path.
2. Preserve the original source.
3. For PDFs, extract text under `raw/extracted/pdf/` when needed.
4. Create or update a source summary under `wiki/sources/`.
5. Update related pages under `wiki/concepts/`, `wiki/syntheses/`, or another suitable wiki directory.
6. Update `wiki/index.md`.
7. Append one entry to `wiki/log.md`.
8. Run lightweight checks such as `git diff --check`, `rg` link checks, and `git status`.
9. Commit and push from `/Users/chenweilong/Documents/mywiki`.

## Lint Workflow

Use this when the user asks to check wiki health or import quality.

Check for:

- Pages not reachable from `wiki/index.md`.
- Claims without source references.
- Duplicated or overlapping concepts.
- Stale pages contradicted by newer source summaries.
- Missing source summaries for important raw files.
- Query answers that should be promoted into synthesis pages.

Report findings first, then propose or apply focused fixes.

## Rules

- Do not modify the external Obsidian vault unless explicitly instructed.
- Treat `raw/` and the external Obsidian vault as source material.
- Treat `wiki/` as the LLM-maintained knowledge layer.
- Keep pages readable in plain Markdown and Obsidian.
- Prefer updating existing pages before creating near-duplicates.
- Do not start a local HTTP server for normal Markdown wiki work.


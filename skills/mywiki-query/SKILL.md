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
- `wiki/INSTRUCTIONS.md`
- `wiki/log.md`
- `AGENTS.md`
- `schema/workflows.md`
- `schema/citation-rules.md`
- `schema/source-registry.md`

When working from another directory, use this file as the stable protocol and treat `/Users/chenweilong/Documents/mywiki` as the knowledge repository. Do not infer that the caller's current directory is the wiki root.

External Obsidian vault, read-only by default:

```text
/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note
```

## Query Workflow

Use this when answering questions from the wiki.

1. Read `/Users/chenweilong/Documents/mywiki/wiki/index.md`.
2. Read `/Users/chenweilong/Documents/mywiki/wiki/INSTRUCTIONS.md` when maintaining or filing knowledge.
3. Search `/Users/chenweilong/Documents/mywiki/wiki/` with `rg`.
4. Read relevant source, concept, and synthesis pages.
5. Search `raw/`, the external Obsidian vault, or IMA references only when wiki pages are missing context or verification is needed.
6. Answer in Chinese.
7. Cite the wiki page or structured source reference used.
8. If the answer is durable, offer to write it back into `wiki/`.

## Source Instance Workflow

Before ingesting from a folder or external system:

1. Read `schema/source-registry.md`.
2. Confirm the source instance and its access boundary in `raw/obsidian/manifest.md`, `raw/ima/sources.yml`, or the relevant raw directory.
3. Treat `registered` or `active` as an access status, not as proof that all contents are synchronized.
4. Ingest only the explicit file or reviewed batch named by the user.

## Ingest Workflow

Use this when the user asks to import a PDF, Markdown source, Obsidian note, web clip, or raw material.

1. Identify the source type and exact path.
2. Decide whether the source belongs in Git, the external Obsidian vault, or IMA.
3. Preserve the original source in its chosen location; do not commit large binaries when IMA is the better fit.
4. For PDFs, extract text under `raw/extracted/pdf/` when needed.
5. Create or update a source summary under `wiki/sources/` with structured `sources` frontmatter.
6. Update related pages under `wiki/concepts/`, `wiki/syntheses/`, or another suitable wiki directory.
7. Update `wiki/index.md`.
8. Append one entry to `wiki/log.md`.
9. Run lightweight checks such as `git diff --check`, `rg` link checks, and `git status`.
10. Commit and push from `/Users/chenweilong/Documents/mywiki`.

## Lint Workflow

Use this when the user asks to check wiki health or import quality.

Check for:

- Pages not reachable from `wiki/index.md`.
- Claims without source references.
- Duplicated or overlapping concepts.
- Stale pages contradicted by newer source summaries.
- Missing source summaries for important raw files.
- Local binary sources that should move to IMA or be documented as intentionally committed.
- Query answers that should be promoted into synthesis pages.

Report findings first, then propose or apply focused fixes.

## Rules

- Do not modify the external Obsidian vault unless explicitly instructed.
- Treat `raw/`, IMA, and the external Obsidian vault as source material.
- Treat `wiki/` as the LLM-maintained knowledge layer.
- Keep pages readable in plain Markdown and Obsidian.
- Prefer updating existing pages before creating near-duplicates.
- Do not start a local HTTP server for normal Markdown wiki work.
- Do not modify `wiki/INSTRUCTIONS.md` for ordinary content ingest; change it only when the wiki-wide maintenance policy changes.

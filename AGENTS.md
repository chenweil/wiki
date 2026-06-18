# AGENTS.md

# LLM Wiki Operating Rules

## Language and workflow

- Always reply in Chinese.
- Always give a short plan before doing substantial work.
- Prefer simple, file-based workflows before adding tools, databases, MCP servers, or custom scripts.
- Do not modify the user's Obsidian vault unless explicitly asked.
- Do not modify files under `raw/` unless the task is to organize raw materials or regenerate extracted text.
- Treat `raw/` and the external Obsidian vault as source material, not as the maintained wiki.
- Treat `wiki/` as the LLM-maintained knowledge layer.
- Treat `schema/` and this file as the operating contract for the wiki.

## Source locations

| Source | Path | Rule |
| --- | --- | --- |
| Obsidian notes | `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note` | Read-only by default |
| Downloaded sources | `raw/sources/` | Read-only by default |
| Temporary inbox | `raw/inbox/` | New unprocessed material can be placed here |
| Extracted PDF text | `raw/extracted/pdf/` | Regeneratable working copy |
| IMA knowledge base | External (ima.qq.com) | For large files unsuitable for Git; upload via `skills/vendor/ima/wrapper/upload.cjs` and reference by `kind: ima-media` in source frontmatter |
| Maintained wiki | `wiki/` | LLM may create and update pages |
| Repo-local skills | `skills/` | Versioned Skill source files for agents |

## Architecture

This wiki follows the LLM Wiki pattern:

1. Raw sources are the source of truth.
2. Wiki pages are synthesized, interlinked Markdown maintained by the LLM.
3. Schema files define page formats, citation rules, and workflows.

Do not copy large raw documents into `wiki/`. Instead, create concise source summaries and link back to the original source reference, either a local `raw/` path, an Obsidian path, or an IMA `media_id` / `note_id`.

## Repo-local Skills

The `skills/` directory stores Skill source files that help other agents query or maintain this wiki from outside the repository.

Current Skill:

| Skill | Purpose |
| --- | --- |
| `skills/ingest/SKILL.md` | Compile one explicit source into wiki pages, then update index and log |
| `skills/mywiki-query/SKILL.md` | Query, ingest, lint, and update MyWiki using the repository's index, log, schema, and raw sources |

This directory is versioned source. It is not guaranteed that every agent runtime auto-discovers root-level `skills/`; install, copy, or symlink the Skill into the relevant agent's global/project skill location when needed.

## Required operating flow

Before answering a knowledge question:

1. Read `wiki/index.md`.
2. Search relevant pages in `wiki/`.
3. Search raw sources only when the wiki is missing context or the answer needs verification.
4. Cite the source page or structured source reference used.
5. If the answer creates durable knowledge, offer to file it back into `wiki/`.

Before ingesting a source:

1. Identify whether the source is an Obsidian note, Markdown file, PDF, or other asset.
2. Preserve the original file, either in place, in `raw/`, or externally in IMA for large binaries.
3. Create or update a source summary under `wiki/sources/`.
4. Update relevant concept, person, book, project, question, or synthesis pages.
5. Update `wiki/index.md`.
6. Append one chronological entry to `wiki/log.md`.

## Page quality rules

- Every durable claim should point to a source page or structured source reference when possible.
- Prefer short, linked pages over long monolithic documents.
- When new material contradicts existing pages, record the contradiction instead of silently replacing the older claim.
- Use `[[wikilinks]]` for internal concepts when useful.
- Keep generated pages readable in plain Markdown and Obsidian.
- Avoid fake data, invented citations, or unsupported synthesis.

## Maintenance checks

During lint or cleanup, check for:

- Orphan pages missing links from `wiki/index.md`.
- Concepts mentioned repeatedly but lacking their own page.
- Claims without source references.
- Stale summaries contradicted by newer sources.
- Duplicate pages with overlapping meanings.
- PDF files that still lack extracted text or a source summary.

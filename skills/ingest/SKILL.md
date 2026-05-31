---
name: ingest
description: Ingest one explicit source into the user's MyWiki LLM wiki. Use when the user says /ingest, 导入, 摄入, 收入, 处理这个资料, or asks to compile a PDF, Markdown file, Obsidian note, web clip, or raw source into the wiki.
---

# Ingest

## Scope

Use this Skill to compile one explicit source into MyWiki.

Supported source forms:

- `raw/sources/example.pdf`
- `raw/sources/example.md`
- `raw/inbox/example.md`
- `Obsidian: 收集内容/Some Note`
- Any exact local source path provided by the user

Do not scan and ingest all of `raw/` unless the user explicitly asks for batch ingest.

## Repository

MyWiki repository:

```text
/Users/chenweilong/Documents/mywiki
```

External Obsidian vault, read-only by default:

```text
/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note
```

## Workflow

1. Confirm the exact source path.
2. Read `wiki/index.md`, `wiki/log.md`, and relevant existing pages.
3. Read the source.
4. For PDFs, extract text to `raw/extracted/pdf/` when useful.
5. Create or update one source summary in `wiki/sources/`.
6. Update existing concept or synthesis pages before creating duplicates.
7. Create new concept or synthesis pages only when the source adds durable knowledge.
8. Update `wiki/index.md`.
9. Append one `ingest` entry to `wiki/log.md`.
10. Run checks:
    - `git diff --check`
    - `rg` for the new page links
    - `git status --short`
11. Commit and push from `/Users/chenweilong/Documents/mywiki`.

## Source Summary Requirements

Each source summary should include:

- YAML frontmatter with `type: source`, `status`, dates, and source path.
- Short summary in Chinese.
- Key points.
- Durable takeaways.
- Connections using `[[wikilinks]]`.
- Open questions when relevant.

## Rules

- Preserve original source files.
- Do not move files to an archive directory by default.
- Do not modify the external Obsidian vault unless explicitly instructed.
- Do not create a near-duplicate concept page if an existing page can be updated.
- If new information contradicts existing wiki pages, record the conflict and ask before overwriting the old claim.
- Use Chinese for maintained wiki content unless the page has a clear reason to preserve another language.


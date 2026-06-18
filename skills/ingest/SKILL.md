---
name: ingest
description: Ingest an explicit source or source directory into the user's MyWiki LLM wiki. Use when the user says /ingest, 导入, 摄入, 收入, 处理这个资料, 导入课程, or asks to compile a PDF, Markdown file, Obsidian note, course folder, web clip, or raw source into the wiki.
---

# Ingest

## Scope

Use this Skill to compile one explicit source, or one explicit source directory, into MyWiki.

Supported source forms:

- `raw/sources/example.pdf`
- `raw/sources/example.md`
- `raw/inbox/example.md`
- `raw/sources/course-folder/`
- `Obsidian: 收集内容/Some Note`
- `Obsidian: Claude Code工程化实战-共26讲/`
- Any exact local source path provided by the user

Do not scan and ingest all of `raw/` unless the user explicitly asks for batch ingest.

When the source is a directory, treat it as a course or collection ingest. Do not blindly ingest every file in one pass. First inventory the directory, create a small ingest plan, and process it in coherent batches.

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
3. Determine whether the source is a single file or a directory.
4. If it is a directory, run the directory workflow below.
5. If it is a single file, read the source.
6. Decide storage location using the storage policy below.
7. For PDFs, extract text to `raw/extracted/pdf/` when useful.
8. Create or update one source summary in `wiki/sources/`.
9. Update existing concept or synthesis pages before creating duplicates.
10. Create new concept or synthesis pages only when the source adds durable knowledge.
11. Update `wiki/index.md`.
12. Append one `ingest` entry to `wiki/log.md`.
13. Run checks:
    - `git diff --check`
    - `rg` for the new page links
    - `git status --short`
14. Commit and push from `/Users/chenweilong/Documents/mywiki`.

## Storage Policy

Choose source storage before committing binaries.

| Source | Default storage |
| --- | --- |
| Markdown, text, small structured files | Commit under `raw/sources/` or `raw/inbox/` |
| Small PDFs that are useful offline | Commit under `raw/sources/` |
| Large PDFs, EPUBs, books, manuscripts, large DOCX/PPTX | Upload to Tencent IMA Knowledge Base |
| External Obsidian notes | Keep in the Obsidian vault and cite as `kind: obsidian` |
| IMA notes | Cite as `kind: ima-note` |

The default large-binary threshold is 5MB. This is a project policy, not a hard technical limit. If the user explicitly asks to commit a larger binary, do so only after noting the Git repository growth tradeoff.

For IMA media upload:

```bash
node skills/vendor/ima/wrapper/upload.cjs --file <path> --kb-id <kb_id>
```

Capture the returned JSON fields, especially `kb_id`, `media_id`, `file_name`, and `url` when present. In the source summary, reference the original file as:

```yaml
sources:
  - kind: ima-media
    kb_id: "<knowledge_base_id>"
    media_id: "<media_id>"
    file_name: "<original-file-name>"
    url: "<stable-url-if-available>"
```

Do not invent IMA IDs. If upload fails or credentials are unavailable, leave the source summary as `needs-review` and report the blocking step.

## Directory Workflow

Use this when `/ingest` points to a directory, such as a course folder.

1. Inventory files with `find` or `rg --files`, excluding hidden files and obvious assets unless they are needed.
2. Classify files by type and order:
   - Markdown lessons or notes
   - PDFs
   - transcripts
   - assets
3. Create a brief ingest plan before editing:
   - Course or collection title
   - Number of files
   - Proposed batch size
   - First batch to ingest
   - Expected wiki pages to update
4. For large directories, process a focused first batch instead of the whole directory.
5. Create or update a collection-level synthesis page under `wiki/syntheses/` when useful.
6. Create one source summary per important source file, not one giant summary for the entire directory.
7. Update shared concept pages across the batch.
8. Log the batch in `wiki/log.md` with the directory path and files processed.

Recommended batch sizes:

| Directory size | Default behavior |
| --- | --- |
| 1-3 files | Ingest all |
| 4-10 files | Ask or propose a first batch of 3-5 files |
| 10+ files | Create a course ingest plan and process only the first coherent batch |

For course folders, prefer preserving sequence order when filenames include lesson numbers.

## Single File Workflow

1. Read the source.
2. For PDFs, extract text to `raw/extracted/pdf/` when useful.
3. Create or update one source summary in `wiki/sources/`.
4. Update existing concept or synthesis pages before creating duplicates.
5. Create new concept or synthesis pages only when the source adds durable knowledge.
6. Update `wiki/index.md`.
7. Append one `ingest` entry to `wiki/log.md`.
8. Run checks:
    - `git diff --check`
    - `rg` for the new page links
    - `git status --short`
9. Commit and push from `/Users/chenweilong/Documents/mywiki`.

## Source Summary Requirements

Each source summary should include:

- YAML frontmatter with `type: source`, `status`, dates, and structured `sources`.
- Short summary in Chinese.
- Key points.
- Durable takeaways.
- Connections using `[[wikilinks]]`.
- Open questions when relevant.

## Rules

- Preserve original source files in their chosen storage location.
- Do not move files to an archive directory by default.
- Do not modify the external Obsidian vault unless explicitly instructed.
- Do not commit large binary source files when IMA storage is the better fit.
- Do not create a near-duplicate concept page if an existing page can be updated.
- If new information contradicts existing wiki pages, record the conflict and ask before overwriting the old claim.
- Use Chinese for maintained wiki content unless the page has a clear reason to preserve another language.
- For directory ingests, prefer incremental batches over exhaustive one-shot ingestion.

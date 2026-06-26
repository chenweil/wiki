# Wiki Workflows

## Ingest Markdown

1. Read the source Markdown.
2. Identify title, author/source if available, date if available, and main claims.
3. Create or update one page in `wiki/sources/`.
4. Update related pages in `wiki/concepts/`, `wiki/books/`, `wiki/projects/`, or `wiki/syntheses/`.
5. Update `wiki/index.md`.
6. Append an entry to `wiki/log.md`.

## Ingest PDF

1. Decide source storage before committing the binary.
   - Small, durable PDFs can live in `raw/sources/`.
   - Large PDFs, books, manuscripts, large DOCX/PPTX files, and other binaries unsuitable for Git should be uploaded to Tencent IMA Knowledge Base via `skills/vendor/ima/wrapper/upload.cjs`.
2. If using IMA, capture `kb_id`, `media_id`, `file_name`, file size, and stable URL when available.
3. Extract text into `raw/extracted/pdf/` when useful; extracted text can be committed even when the original binary lives in IMA.
4. Summarize the extracted text into `wiki/sources/`.
5. In source summary frontmatter, cite the original as `kind: local-raw` or `kind: ima-media`.
6. Add source references to relevant concept and synthesis pages.
7. Record extraction, storage location, and summary status in `wiki/log.md`.

## Ingest IMA Note Or Media

1. Treat IMA as an external raw source, not as generated wiki content.
2. For IMA notes, record `kind: ima-note`, `note_id`, and stable URL when available.
3. For IMA media, record `kind: ima-media`, `kb_id`, `media_id`, `file_name`, and stable URL when available.
4. Add or update the corresponding entry in `raw/ima/sources.yml`.
5. Do not invent IMA identifiers. If an upload or lookup failed, mark the wiki source summary and manifest entry as `needs-review`.
6. Keep enough extracted text or source summary in Git so the wiki remains useful even when the external binary is not locally present.
7. Update related concept and synthesis pages just like local raw ingests.

## Query Wiki

1. Read `wiki/index.md`.
2. Use `rg` to search `wiki/`.
3. Read the relevant pages.
4. If necessary, verify against raw sources: local `raw/`, external Obsidian notes, or IMA references.
5. Answer in Chinese with source references.
6. If the answer is durable, suggest filing it into the wiki.

## Lint Wiki

Run the maintenance checks:

```bash
node scripts/lint-wiki-okf.mjs
node scripts/lint-raw-large-files.mjs
node scripts/lint-vendor-clean.mjs
```

The OKF check fails only when normal `wiki/` pages are missing YAML frontmatter or the required `type` field. Missing `title`, `description`, and `tags` are warnings for gradual cleanup.
The raw large-file check fails for new or untracked large binaries under `raw/sources/` and `raw/inbox/`; already tracked large files are warnings.
The vendor check fails when `skills/vendor/` has staged, unstaged, or untracked changes.

1. Find pages not linked from `wiki/index.md`.
2. Find repeated concepts without dedicated pages.
3. Find pages without sources.
4. Find contradictions and stale claims.
5. Find local binary sources that should be moved to IMA or documented as intentionally committed.
6. Find IMA references in `wiki/` that are missing from `raw/ima/sources.yml`.
7. Confirm `skills/vendor/` has no local edits.
8. Write recommended fixes before editing.

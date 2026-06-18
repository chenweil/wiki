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
4. Do not invent IMA identifiers. If an upload or lookup failed, mark the wiki source summary as `needs-review`.
5. Keep enough extracted text or source summary in Git so the wiki remains useful even when the external binary is not locally present.
6. Update related concept and synthesis pages just like local raw ingests.

## Query Wiki

1. Read `wiki/index.md`.
2. Use `rg` to search `wiki/`.
3. Read the relevant pages.
4. If necessary, verify against raw sources: local `raw/`, external Obsidian notes, or IMA references.
5. Answer in Chinese with source references.
6. If the answer is durable, suggest filing it into the wiki.

## Lint Wiki

1. Find pages not linked from `wiki/index.md`.
2. Find repeated concepts without dedicated pages.
3. Find pages without sources.
4. Find contradictions and stale claims.
5. Find local binary sources that should be moved to IMA or documented as intentionally committed.
6. Write recommended fixes before editing.

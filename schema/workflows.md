# Wiki Workflows

## Ingest Markdown

1. Read the source Markdown.
2. Identify title, author/source if available, date if available, and main claims.
3. Create or update one page in `wiki/sources/`.
4. Update related pages in `wiki/concepts/`, `wiki/books/`, `wiki/projects/`, or `wiki/syntheses/`.
5. Update `wiki/index.md`.
6. Append an entry to `wiki/log.md`.

## Ingest PDF

1. Keep the original PDF in `raw/sources/`.
2. Extract text into `raw/extracted/pdf/` when needed.
3. Summarize the extracted text into `wiki/sources/`.
4. Add source references to relevant concept and synthesis pages.
5. Record extraction and summary status in `wiki/log.md`.

## Query Wiki

1. Read `wiki/index.md`.
2. Use `rg` to search `wiki/`.
3. Read the relevant pages.
4. If necessary, verify against raw sources.
5. Answer in Chinese with source references.
6. If the answer is durable, suggest filing it into the wiki.

## Lint Wiki

1. Find pages not linked from `wiki/index.md`.
2. Find repeated concepts without dedicated pages.
3. Find pages without sources.
4. Find contradictions and stale claims.
5. Write recommended fixes before editing.


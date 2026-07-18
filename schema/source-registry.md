# Source Registry

The source-instance model records where a family of materials comes from and how it is maintained. It is intentionally a small Markdown/YAML convention, not a database or background sync service.

## Source Instance

A source instance is a named, repeatable input boundary such as the Obsidian vault, a course folder, `raw/sources/`, or an IMA knowledge base.

| Field | Meaning |
| --- | --- |
| `id` | Stable local slug, for example `obsidian-collect` or `raw-sources` |
| `kind` | `obsidian`, `local-raw`, `ima`, `external-raw`, or `web` |
| `location` | Path, vault-relative path, URL, or IMA registry path |
| `role` | What this source is used for |
| `access` | `read-only`, `user-managed`, `llm-managed`, or `external` |
| `status` | `registered`, `active`, `paused`, or `needs-review` |
| `ingest_policy` | `explicit`, `batch`, or `manual-only` |
| `last_reviewed` | Date when the registry entry was last checked |

## Instance Status

The `status` field applies only to the source boundary:

1. **registered**: the location and ownership boundary are known but have not been used recently.
2. **active**: the boundary is available for explicit or reviewed-batch ingest.
3. **paused**: do not ingest from this boundary until it is reactivated.
4. **needs-review**: access, ownership, or source metadata must be checked before use.

## Source Item Lifecycle

1. **Registered**: the location and ownership boundary are known.
2. **Scoped**: a file, note, or directory is explicitly selected for ingest.
3. **Ingested**: a source summary and relevant wiki updates exist.
4. **Reviewed**: links, citations, and conflicts have been checked.
5. **Paused or needs-review**: access, source quality, or metadata requires attention.

The instance status describes the source boundary. It does not claim that every file under that boundary has been ingested. Per-source ingest state belongs in `wiki/log.md` and source summary pages.

## Current Boundaries

| ID | Kind | Location | Role | Access | Ingest policy | Status | Last reviewed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `obsidian-note` | `obsidian` | `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note` | Personal notes and collected material | `read-only` | `explicit` / `batch` | `active` | 2026-07-18 |
| `raw-sources` | `local-raw` | `raw/sources/` | Durable local source files | `user-managed` | `explicit` | `active` | 2026-07-18 |
| `raw-inbox` | `local-raw` | `raw/inbox/` | Temporary material awaiting review | `user-managed` | `explicit` | `active` | 2026-07-18 |
| `ima` | `ima` | `raw/ima/sources.yml` | External notes and large-file provenance | `external` | `explicit` | `active` | 2026-07-18 |

## Rules

- Do not scan or ingest an entire instance without an explicit request.
- Do not modify the Obsidian instance from this repository.
- Do not treat a registered instance as proof that its contents are synchronized.
- When a source moves or its ownership changes, update the registry and append a maintenance entry to `wiki/log.md`.

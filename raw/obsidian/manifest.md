# Obsidian Vault Manifest

## Registered Vault

| Field | Value |
| --- | --- |
| Path | `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note` |
| Role | Read-only source material |
| Registered on | 2026-05-31 |

## Handling Rules

- Do not modify this vault unless the user explicitly asks.
- Prefer reading files directly from the filesystem for batch ingest.
- Use Obsidian CLI only for targeted read/search/open actions when helpful.
- Preserve original note paths when citing or summarizing.
- Registration here does not mean the whole vault has been ingested.
- Ingest only an explicitly named note or a reviewed directory batch.

## Source Instance

| Field | Value |
| --- | --- |
| ID | `obsidian-note` |
| Kind | `obsidian` |
| Access | `read-only` |
| Ingest policy | `explicit` for notes, `batch` for reviewed folders |
| Status | `active` |
| Last reviewed | 2026-07-18 |

Per-source ingest state is recorded in `wiki/sources/` and `wiki/log.md`; this manifest records the vault boundary, not a full synchronization cursor.

## Ingested Source Groups

| Group | Vault-relative path | State | Wiki entry |
| --- | --- | --- | --- |
| Agent / Skill / Plugin engineering | `收集内容/` and `Claude Code工程化实战-共26讲/` | Partial, selected notes ingested | `wiki/index.md` source summaries |
| Personal journal | `日记/` | Not ingested | - |
| Book notes | `读书/` | Not ingested | - |
| General articles | `文章/` | Not ingested | - |

## Candidate Folders Observed

| Folder | Likely use |
| --- | --- |
| `日记/` | Personal journal and life notes |
| `读书/` | Book notes |
| `技术笔记/` | Technical notes |
| `课程/` | Course notes |
| `文章/` | Saved articles |
| `Claude Code工程化实战-共26讲/` | Agent and Claude Code engineering material |

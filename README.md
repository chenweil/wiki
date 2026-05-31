# MyWiki

MyWiki is a personal LLM-maintained Markdown wiki inspired by Karpathy's LLM Wiki pattern.

The goal is not to build another raw document archive. Raw materials live in `raw/`; the maintained knowledge layer lives in `wiki/`. An LLM agent reads source material, writes summaries, updates concept pages, cross-links related ideas, records changes, and keeps the wiki useful over time.

## Current Status

This repository is in the seed-wiki stage. The file structure and first ingest loop are already in place, and the first compiled domain is Claude Code / Agent / Skill / Plugin engineering.

| Area | Status |
| --- | --- |
| Raw source storage | Ready |
| Obsidian vault registration | Ready |
| Source summaries | Started |
| Concept pages | Started |
| Synthesis pages | Started |
| Ingest workflow | Manual, documented |
| Query-to-wiki workflow | Planned |
| Lint workflow | Planned |
| Local Skill automation | Not yet |

## Structure

| Path | Purpose | Edit rule |
| --- | --- | --- |
| `raw/sources/` | Downloaded PDFs, Markdown files, clipped articles, and other source documents | User-managed, treated as source of truth |
| `raw/inbox/` | Temporary place for unprocessed material | User-managed |
| `raw/obsidian/manifest.md` | Registered external Obsidian vault metadata | Update only when the vault setup changes |
| `raw/extracted/` | Regeneratable text extracted from PDFs and other binary sources | Tool/LLM-managed |
| `raw/assets/` | Local images and attachments | User/tool-managed |
| `wiki/index.md` | Main content index and navigation entry | LLM-maintained |
| `wiki/log.md` | Chronological append-only maintenance log | LLM-maintained |
| `wiki/sources/` | One summary page per ingested source | LLM-maintained |
| `wiki/concepts/` | Reusable concepts and durable knowledge pages | LLM-maintained |
| `wiki/syntheses/` | Cross-source analyses and higher-level conclusions | LLM-maintained |
| `schema/` | Workflow, citation, and page template rules | Human/LLM co-maintained |
| `AGENTS.md` | Operating contract for future agents | Human/LLM co-maintained |

## Key Entry Points

| File | Use |
| --- | --- |
| `wiki/index.md` | Start here when browsing or answering questions |
| `wiki/overview.md` | High-level map of the current wiki |
| `wiki/log.md` | What has been ingested or changed |
| `AGENTS.md` | Rules future agents must follow |
| `schema/workflows.md` | Ingest, query, and lint workflows |
| `schema/citation-rules.md` | Source and citation conventions |

## Current Compiled Domain

The first topic area is Claude Code and Agent engineering.

| Page | Role |
| --- | --- |
| `wiki/syntheses/claude-code-engineering-map.md` | Main synthesis map |
| `wiki/concepts/claude-code.md` | Claude Code workflow concept |
| `wiki/concepts/skill.md` | Skill concept |
| `wiki/concepts/skill-development.md` | Skill specification and design patterns |
| `wiki/concepts/plugin.md` | Plugin concept |
| `wiki/concepts/agent-architecture.md` | Agent architecture concept |

## How To Add Material

Add new source files to one of these locations:

| Material | Put it here |
| --- | --- |
| PDF | `raw/sources/` |
| Markdown article or note export | `raw/sources/` |
| Web clip | `raw/sources/` |
| Image or attachment | `raw/assets/` |
| Unsure / temporary | `raw/inbox/` |

After adding material, ask the LLM agent to ingest it. Example prompts:

```text
帮我导入 raw/sources/example.pdf
```

```text
帮我导入 Obsidian 里: 收集内容/Agent Skill规范、构建与设计模式
```

The agent should then:

1. Read the source.
2. Preserve the original source.
3. Create or update a source summary under `wiki/sources/`.
4. Update related concept or synthesis pages.
5. Update `wiki/index.md`.
6. Append an entry to `wiki/log.md`.
7. Commit and push the changes.

## Obsidian Vault

The registered external Obsidian vault is:

```text
/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note
```

By default, this repository treats that vault as read-only source material. The LLM should read from it when asked, but should not modify the vault unless explicitly instructed.

## Git Workflow

This repository is backed by GitHub:

```text
https://github.com/chenweil/wiki.git
```

After meaningful wiki changes:

```bash
git status --short
git add <changed files>
git commit -m "docs: describe the change"
git push
```

Do not commit `.DS_Store`, temporary files, or logs.

## Notes

- This is a Markdown/Obsidian wiki, not a web application.
- A local HTTP server is not needed for normal use.
- Prefer opening this repository in Obsidian or editing it directly as Markdown.
- The valuable layer is the maintained `wiki/`, not a raw dump of files.
- The next maturity step is to run query-to-wiki and lint workflows, then decide whether to create a local `llm-wiki-ingest` Skill.


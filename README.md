# MyWiki

MyWiki is a personal LLM-maintained Markdown wiki inspired by Karpathy's LLM Wiki pattern.

The goal is not to build another raw document archive. Raw materials live in `raw/`; the maintained knowledge layer lives in `wiki/`. An LLM agent reads source material, writes summaries, updates concept pages, cross-links related ideas, records changes, and keeps the wiki useful over time.

For binary sources that are too large or otherwise unsuitable for committing to Git (books, large manuscripts, long PDFs), MyWiki uses Tencent IMA Knowledge Base as external storage. Files are uploaded via `skills/vendor/ima/wrapper/upload.cjs` and referenced from source summaries using `kind: ima-media`; only text artifacts live in the repo.

## Current Status

This repository is in the seed-wiki stage. The file structure and first ingest loop are already in place, and the first compiled domain is Claude Code / Agent / Skill / Plugin engineering.

| Area | Status |
| --- | --- |
| Raw source storage | Ready |
| Obsidian vault registration | Ready |
| Source summaries | Started |
| Concept pages | Started |
| Synthesis pages | Started |
| Ingest workflow | Repo-local Skill started |
| Query-to-wiki workflow | Started |
| Lint workflow | Started |
| OKF compatibility check | Ready |
| Repo-local Skill source | Started |
| IMA large-file storage | Ready (vendor + wrapper) |

## Structure

| Path | Purpose | Edit rule |
| --- | --- | --- |
| `raw/sources/` | Downloaded PDFs, Markdown files, clipped articles, and other source documents | User-managed, treated as source of truth |
| `raw/sources/README.md` | Storage policy for local raw sources vs IMA external sources | Human/LLM co-maintained |
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
| `scripts/` | Small repo-local maintenance checks | Human/LLM co-maintained |
| `skills/` | Repo-local Skill source files for agents that need to query or maintain this wiki | Human/LLM co-maintained |
| `skills/vendor/` | Third-party Skill source files (e.g. `skills/vendor/ima/`) vendored into this repo. Treat as versioned dependencies; do not modify in place. | Vendor-pinned |
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
| `schema/okf-compat.md` | Local OKF compatibility rules |
| `scripts/lint-all.mjs` | Runs all repo-local maintenance checks |
| `scripts/ima-manifest.mjs` | Lints the local IMA source registry against wiki references |
| `scripts/lint-wiki-okf.mjs` | Checks normal wiki pages for OKF minimum metadata |
| `scripts/lint-raw-large-files.mjs` | Blocks new large raw binaries that should go to IMA |
| `scripts/lint-vendor-clean.mjs` | Blocks accidental edits under `skills/vendor/` |
| `skills/ingest/SKILL.md` | Repo-local Skill for `/ingest` source compilation |
| `skills/mywiki-query/SKILL.md` | Repo-local Skill for querying and maintaining MyWiki from other agent contexts |

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
| Small PDF | `raw/sources/` |
| Large PDF, book, manuscript, large DOCX/PPTX | Upload to IMA; keep extracted text and source summary in Git |
| Markdown article or note export | `raw/sources/` |
| Course or collection folder | `raw/sources/<course-name>/` or an external Obsidian folder |
| Web clip | `raw/sources/` |
| Image or attachment | `raw/assets/` |
| Unsure / temporary | `raw/inbox/` |

After adding material, ask the LLM agent to ingest it. Example prompts:

```text
/ingest raw/sources/example.pdf
```

```text
/ingest Obsidian: 收集内容/Agent Skill规范、构建与设计模式
```

For a course or folder:

```text
/ingest Obsidian: Claude Code工程化实战-共26讲/
```

Natural language is also fine:

```text
帮我导入 raw/sources/example.pdf
```

For large binary material, ask for IMA-backed ingest:

```text
/ingest /path/to/large-book.pdf，文件走 IMA，不提交原始 PDF 到 Git。
```

The agent should then:

1. Read the source.
2. Decide whether the source belongs in Git or IMA.
3. Create or update a source summary under `wiki/sources/`.
4. Update related concept or synthesis pages.
5. Update `wiki/index.md`.
6. Append an entry to `wiki/log.md`.
7. Commit and push the changes.

## Wiki Lint

Run the maintenance checks:

```bash
node scripts/lint-all.mjs
```

Or run the checks individually:

```bash
node scripts/lint-wiki-okf.mjs
node scripts/lint-raw-large-files.mjs
node scripts/ima-manifest.mjs lint
node scripts/lint-vendor-clean.mjs
```

The OKF check treats `wiki/index.md` and `wiki/log.md` as reserved operational pages. For normal `wiki/` pages, missing YAML frontmatter or missing `type` is an error; missing `title`, `description`, and `tags` is a warning for gradual cleanup.
The raw large-file check fails for new or untracked large binaries under `raw/sources/` and `raw/inbox/`; already tracked large files are warnings so they can be migrated through a separate IMA cleanup plan.
The IMA manifest check verifies that `raw/ima/sources.yml` has valid local provenance entries for every `ima-note` and `ima-media` reference in `wiki/`.
The vendor check fails when `skills/vendor/` has staged, unstaged, or untracked changes; use project-local wrappers instead of editing vendored skills in place.

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

## Repo-local Skills

This repository keeps versioned Skill source files under `skills/`.

Current Skill:

| Skill | Purpose |
| --- | --- |
| `skills/ingest/SKILL.md` | Turns one explicit source into wiki pages and updates index/log |
| `skills/mywiki-query/SKILL.md` | Gives other agents a stable protocol for finding, querying, ingesting, linting, and updating this wiki |

This directory is the source of truth for the Skill content. Different agent runtimes may require installing, copying, or symlinking the Skill into their own global or project-specific skill directory.

### How to use `/ingest`

Use `/ingest` for the common "导入资料" operation.

```text
/ingest raw/sources/example.pdf
```

```text
/ingest Obsidian: 收集内容/Agent Skill规范、构建与设计模式
```

For a course or folder:

```text
/ingest Obsidian: Claude Code工程化实战-共26讲/
```

The first version is intentionally explicit: it ingests a named file or named directory. It does not scan all of `raw/` or move sources into an archive directory by default. Directory ingest should start with an inventory and a batch plan; large folders should be processed in coherent batches rather than all at once.

### How to use `mywiki-query`

There are three practical ways to use the repo-local Skill.

| Situation | How to use it |
| --- | --- |
| Working inside this repository | Ask the agent to read `skills/mywiki-query/SKILL.md` before querying or updating the wiki |
| Working from another local project | Tell the agent to use `/Users/chenweilong/Documents/mywiki/skills/mywiki-query/SKILL.md` as the workflow |
| Want automatic Skill discovery | Copy or symlink `skills/mywiki-query/` into the target agent runtime's Skill directory |

Example prompts:

```text
使用 /Users/chenweilong/Documents/mywiki/skills/mywiki-query/SKILL.md，基于我的 mywiki 回答：Skill 和 Plugin 怎么区分？
```

```text
使用 mywiki-query，帮我导入 raw/sources/example.pdf。
```

```text
使用 mywiki-query，跑一次 wiki lint，检查孤儿页、缺来源和重复概念。
```

For Codex on this machine, one possible global install location is:

```text
/Users/chenweilong/.codex/skills/mywiki-query/
```

You can copy it:

```bash
mkdir -p /Users/chenweilong/.codex/skills
cp -R /Users/chenweilong/Documents/mywiki/skills/mywiki-query /Users/chenweilong/.codex/skills/
```

Or symlink it so future edits in this repository are reflected immediately:

```bash
mkdir -p /Users/chenweilong/.codex/skills
ln -sfn /Users/chenweilong/Documents/mywiki/skills/mywiki-query /Users/chenweilong/.codex/skills/mywiki-query
```

If using another agent runtime, use that runtime's own Skill/plugin directory instead. The repo-local copy remains the canonical source.

## Notes

- This is a Markdown/Obsidian wiki, not a web application.
- A local HTTP server is not needed for normal use.
- Prefer opening this repository in Obsidian or editing it directly as Markdown.
- The valuable layer is the maintained `wiki/`, not a raw dump of files.
- The next maturity step is to continue exercising query-to-wiki and lint workflows, then decide whether to split `mywiki-query` into dedicated `query` and `lint` Skills.

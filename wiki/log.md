---
type: project
status: active
created: 2026-05-31
updated: 2026-06-18
sources:
  - AGENTS.md
  - schema/workflows.md
---

# LLM Wiki Log

Append-only chronological record. Use entries like:

```markdown
## [YYYY-MM-DD] ingest | Source title

- Source: `path`
- Output pages: concept-page, source-summary
- Notes:
```

## [2026-05-31] setup | Initial wiki scaffold

- Source: user-provided Obsidian vault path and existing `raw/sources/` PDFs.
- Output pages: [[index]], [[overview]]
- Notes: Created the initial LLM Wiki structure. Obsidian vault is registered as read-only source material.

## [2026-05-31] ingest | Claude Code engineering first batch

- Source: `raw/sources/Claude Code从入门到精通-v2.0.0.pdf`
- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/09｜触类旁通：SKILL.md结构与触发机制-Claude Code 工程化实战-极客时间.md`
- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/04｜量体裁衣：从Sub-Agents到Multi-Agent的工程指南-Claude Code 工程化实战-极客时间.md`
- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/23｜化零为整：Plugins 插件打包与分发-Claude Code 工程化实战-极客时间.md`
- Output pages: [[claude-code-from-beginner-to-master-v2]], [[obsidian-claude-code-skill-trigger]], [[obsidian-claude-code-multi-agent-guide]], [[obsidian-claude-code-plugin-packaging]], [[claude-code]], [[skill]], [[plugin]], [[agent-architecture]], [[claude-code-engineering-map]]
- Notes: Completed the first scoped ingest pass. PDF text was extracted to `raw/extracted/pdf/claude-code-from-beginner-to-master-v2.0.0.txt`.

## [2026-05-31] ingest | Agent Skill specification and design patterns

- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/Agent Skill规范、构建与设计模式.md`
- Output pages: [[obsidian-agent-skill-spec-build-patterns]], [[skill-development]]
- Updated pages: [[skill]], [[agent-architecture]], [[claude-code-engineering-map]], [[index]]
- Notes: Added Skill specification details, progressive loading rules, Skill-Creator / Writing-Skills development loops, and five Skill design patterns.

## [2026-05-31] ingest | 21小时从入门到精通-Claude Code

- Source: `raw/sources/21小时从入门到精通-Claude Code.pdf`
- Output pages: [[21-hours-claude-code-mastery]]
- Updated pages: [[claude-code]], [[agent-architecture]], [[index]]
- Notes: Extracted PDF text to `raw/extracted/pdf/21-hours-claude-code-mastery.txt`. This source provides deep technical analysis of Claude Code 2.1.88 source code, covering 10 chapters from build system to design philosophy. Added architecture overview, task system details, and AgentTool implementation specifics.

## [2026-05-31] ingest | Claude Code 工程化实战直播分享版

- Source: `raw/sources/Claude+Code+工程化实战直播分享版.pdf`
- Output pages: [[claude-code-engineering-live]]
- Updated pages: [[index]]
- Notes: Extracted PDF text to `raw/extracted/pdf/claude-code-engineering-live.txt`. This is a live sharing slides by 黄佳, providing a framework for cognitive shift from "tool user" to "Agent builder". Key concepts: four-layer architecture, four core components comparison, memory system, and best practices.

## [2026-05-31] ingest | 使用 Claude Skills 自动化代码审查

- Source: `raw/sources/使用Claude_Skills自动化代码审查完整指南.md.pdf`
- Output pages: [[claude-skills-code-review]]
- Updated pages: [[index]]
- Notes: Extracted PDF text to `raw/extracted/pdf/claude-skills-code-review.txt`. Practical guide on using Claude Skills for automated code review, saving ~10 hours per week. Key insights: Skills vs static analysis tools, 5-minute setup, multi-language Skills, CI/CD integration.

## [2026-05-31] ingest | Hermes Agent 从入门到精通

- Source: `raw/sources/Hermes-Agent-从入门到精通-v260407.pdf`
- Output pages: [[hermes-agent-mastery]]
- Updated pages: [[index]]
- Notes: Extracted PDF text to `raw/extracted/pdf/hermes-agent-mastery.txt`. Comprehensive guide to Hermes Agent v0.7.0 by 花叔. Key concepts: learning loop (5 stages), three-layer memory, Skill self-improvement, 40+ tools + MCP, multi-agent orchestration, comparison with Claude Code and OpenClaw.

## [2026-05-31] update | Hermes Agent 相关概念页更新

- Updated pages: [[agent-architecture]], [[claude-code-engineering-map]]
- Notes: Added "Three Paradigms Comparison" (Claude Code vs OpenClaw vs Hermes), "Self-Improving Agent: Hermes Model" section with learning loop and three-layer memory. Updated synthesis page with Hermes content and new open question about self-improvement error accumulation.

## [2026-05-31] ingest | Vibe Coding之道

- Source: `raw/sources/Vibe Coding之道.md`
- Output pages: [[vibe-coding-way]]
- Updated pages: [[index]]
- Notes: Ingested from Markdown source and supporting extracted notes. Key concepts: Vibe Coding definition, AI four forms, Agent three core abilities, ideal workflow (Explore → Select → Brainstorm → Review → Execute → Verify → Learn), AI-era new skills (questioning, judgment, meta-cognition), Context 复利.

## [2026-05-31] ingest | Agent Harness 综述

- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/刚刚，一篇最全 Agent Harness 综述来了！.md`
- Output pages: [[agent-harness-survey]]
- Updated pages: [[index]]
- Notes: Datawhale 对 CMU/Yale/JHU 联合发表的 Agent Harness 综述论文的深度解读. Key concepts: ETCLOVG 七层框架 (Execution, Tooling, Context, Lifecycle, Observability, Verification, Governance), 三次工程迁移 (Prompt → Context → Harness Engineering), trace-native 评估, 跨层矛盾, Framework → Platform 演进.

## [2026-05-31] ingest | 浅谈 AI 编程

- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/浅谈 AI 编程.md`
- Output pages: [[ai-programming-deep-dive]]
- Updated pages: [[index]]
- Notes: 浮之静的深度长文，探讨 AI 编程的范式迁移。核心观点：当代码生成边际成本趋近于零时，软件工程的核心将从"写代码"转向"治理 AI 生产系统"。Key concepts: Goal vs Workflow, 原语地图, 非对称性（生成快、审查慢）, Harness 六层, AI 接管老代码库五阶段方法论, 未来架构文档十类标准。

## [2026-06-06] ingest | IMA 笔记：放下焦虑与执着——道、佛、无为的共通智慧

- Source: IMA 笔记 (note_id: 7465939918418409) + IMA 笔记 (note_id: 7465972512356248)
- Output pages: [[ima-note-three-traditions]], [[three-traditions-detachment]], [[fan-zhe-dao-zhi-dong]], [[chu-gou]], [[wo-zhi]], [[wu-wei]], [[zhi-ming]], [[yi-shang-nuli-guo-shang-suiyuan]]
- Updated pages: [[index]]
- Notes: 从 IMA 知识库导入。与 AI 对话产生的哲学综合笔记，探讨佛家（我执）、道家（无为）、儒家（知命）三家对"放下执着"的共通智慧。拆分为 1 个源摘要 + 1 个综合页 + 6 个概念页。第二篇笔记"读《人类简史》帝国章节的思考"中的"心无挂碍"段落并入综合页。

## [2026-06-06] create | Go 学习路线图 2026

- Source: `/Users/chenweilong/Documents/go.pdf` (roadmap.sh 旧版 Go 路线图)
- Output pages: [[go-roadmap-2026]]
- Updated pages: [[index]]
- Notes: 基于用户提供的旧版 Go 路线图 PDF，生成 2026 版本。更新内容：补充泛型（Go 1.18+）、slog（Go 1.21）、range over integers（Go 1.22）等新特性；移除过时框架（Beego、Revel、Buffalo）；添加 Fiber、sqlx、sqlc 等现代工具；更新微服务框架（go-zero、Kratos）；补充测试工具（testify、gomock）和日志方案（slog、Zap）。路线图分 5 个阶段：基础语法、并发编程、Web 开发、工具链、微服务。

## [2026-06-18] maintenance | Wiki lint and schema normalization

- Source: `schema/page-template.md`
- Updated pages: [[index]], [[log]], [[overview]], [[ima-note-three-traditions]], [[three-traditions-detachment]], [[go-roadmap-2026]], [[fan-zhe-dao-zhi-dong]], [[chu-gou]], [[wo-zhi]], [[wu-wei]], [[zhi-ming]], [[yi-shang-nuli-guo-shang-suiyuan]]
- Notes: Ran lightweight wiki lint for missing frontmatter, missing `sources`, index coverage, wikilink targets, planned workflow labels, and whitespace errors. Normalized all current wiki Markdown pages to include frontmatter and source metadata; changed README query/lint workflow status from Planned to Started.

## [2026-06-18] maintenance | Structured source reference migration

- Source: `schema/page-template.md`, `schema/citation-rules.md`
- Updated pages: [[claude-code-from-beginner-to-master-v2]], [[21-hours-claude-code-mastery]], [[claude-code-engineering-live]], [[claude-skills-code-review]], [[hermes-agent-mastery]], [[vibe-coding-way]], [[agent-harness-survey]], [[ai-programming-deep-dive]], [[obsidian-claude-code-skill-trigger]], [[obsidian-claude-code-multi-agent-guide]], [[obsidian-claude-code-plugin-packaging]], [[obsidian-agent-skill-spec-build-patterns]], [[claude-code]], [[skill]], [[plugin]], [[agent-architecture]], [[skill-development]], [[go-roadmap-2026]], [[three-traditions-detachment]], [[fan-zhe-dao-zhi-dong]], [[chu-gou]], [[wo-zhi]], [[wu-wei]], [[zhi-ming]], [[yi-shang-nuli-guo-shang-suiyuan]], [[claude-code-engineering-map]]
- Notes: Added `kind: external-raw` for explicit source files outside the repository and `kind: wiki-page` for internal wiki dependencies. Migrated knowledge-page frontmatter from plain paths and `[[wikilinks]]` to structured `sources` objects. Left `wiki/index.md`, `wiki/log.md`, and `wiki/overview.md` as operational-page exceptions for project contract references.

## [2026-06-24] maintenance | 建立 IMA 来源台账

- Source: `wiki/sources/ima-note-three-traditions.md`
- Output files: `raw/ima/sources.yml`
- Updated pages: [[index]]
- Updated contracts: `AGENTS.md`, `schema/workflows.md`, `raw/sources/README.md`
- Notes: 新增 IMA external source registry，登记当前 wiki 已引用的两个 IMA note，并要求后续 IMA note/media 引用同步进入 `raw/ima/sources.yml`。

## [2026-06-26] maintenance | Raw large-file guard

- Source: `raw/sources/README.md`
- Output files: `scripts/lint-raw-large-files.mjs`
- Updated contracts: `AGENTS.md`, `README.md`, `schema/workflows.md`, `.gitignore`
- Notes: Added a reusable raw-source large-file check. New or untracked large binaries under `raw/sources/` and `raw/inbox/` fail lint; existing tracked large binaries remain warnings and require an explicit IMA cleanup plan.

# LLM Wiki Log

Append-only chronological record. Use entries like:

```markdown
## [YYYY-MM-DD] ingest | Source title

- Source: `path`
- Output pages: [[concept-page]], [[source-summary]]
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

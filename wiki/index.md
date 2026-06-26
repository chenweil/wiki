---
type: project
status: active
created: 2026-05-31
updated: 2026-06-18
sources:
  - AGENTS.md
  - schema/workflows.md
---

# My LLM Wiki Index

This is the main navigation file for the LLM-maintained wiki.

## Start Here

| Page | Purpose |
| --- | --- |
| [[overview]] | High-level map of what this wiki currently knows |
| [[log]] | Chronological record of ingests, queries, lint passes, and maintenance |

## Source Summaries

Source summaries live in `wiki/sources/`.

| Source | Summary | Status |
| --- | --- | --- |
| Obsidian note vault | `raw/obsidian/manifest.md` | Registered, not ingested |
| IMA external source registry | `raw/ima/sources.yml` | Registered |
| Downloaded PDFs | `raw/sources/` | Registered, not ingested |
| Claude Code 从入门到精通 v2.0.0 | [[claude-code-from-beginner-to-master-v2]] | Ingested |
| 21小时从入门到精通-Claude Code | [[21-hours-claude-code-mastery]] | Ingested |
| Claude Code 工程化实战直播分享版 | [[claude-code-engineering-live]] | Ingested |
| 使用 Claude Skills 自动化代码审查 | [[claude-skills-code-review]] | Ingested |
| Hermes Agent 从入门到精通 | [[hermes-agent-mastery]] | Ingested |
| 开发前测试方法 | - | ❌ 内容不足（仅 2 行） |
| Vibe Coding之道 | [[vibe-coding-way]] | Ingested |
| Agent Harness 综述 | [[agent-harness-survey]] | Ingested |
| SKILL.md 结构与触发机制 | [[obsidian-claude-code-skill-trigger]] | Ingested |
| Sub-Agents 到 Multi-Agent 工程指南 | [[obsidian-claude-code-multi-agent-guide]] | Ingested |
| Plugins 插件打包与分发 | [[obsidian-claude-code-plugin-packaging]] | Ingested |
| Agent Skill 规范、构建与设计模式 | [[obsidian-agent-skill-spec-build-patterns]] | Ingested |
| 浅谈 AI 编程 | [[ai-programming-deep-dive]] | Ingested |
| IMA 笔记：佛道儒共通智慧 | [[ima-note-three-traditions]] | Ingested |

## Knowledge Areas

| Area | Directory | Notes |
| --- | --- | --- |
| Concepts | `wiki/concepts/` | Reusable ideas and technical concepts |
| People | `wiki/people/` | People, authors, thinkers, speakers |
| Books | `wiki/books/` | Book notes and long-form reading synthesis |
| Projects | `wiki/projects/` | Work projects, tools, systems, implementations |
| Questions | `wiki/questions/` | Open questions worth investigating |
| Syntheses | `wiki/syntheses/` | Cross-source analysis and durable conclusions |

## Current Concept Pages

| Concept | Notes |
| --- | --- |
| [[claude-code]] | Terminal-native agentic coding workflow |
| [[skill]] | Progressive knowledge loading and callable SOPs |
| [[skill-development]] | Skill specification, construction loops, and design patterns |
| [[plugin]] | Packaging and distribution of Claude Code capabilities |
| [[agent-architecture]] | Single Agent, Skills, Sub-Agents, Handoffs, Router |
| [[go-roadmap-2026]] | Go 语言学习路线图 2026 版，基于 Go 1.22+ |
| [[fan-zhe-dao-zhi-dong]] | 反者道之动——事物走向反面是道的运动规律 |
| [[chu-gou]] | 刍狗思维——万物皆有时，不把任何事看得太重 |
| [[wo-zhi]] | 我执——佛家核心概念，对"固定自我"的执念 |
| [[wu-wei]] | 无为——不违反自然规律地做 |
| [[zhi-ming]] | 知命——明知不可为而为之 |
| [[yi-shang-nuli-guo-shang-suiyuan]] | 因上努力，果上随缘——三家共通的实践智慧 |

## Current Syntheses

| Synthesis | Notes |
| --- | --- |
| [[claude-code-engineering-map]] | Layered map from project memory to plugins and agent architecture |
| [[three-traditions-detachment]] | 佛道儒三家对"放下执着"的共通智慧与实践方法论 |

## Current Ingest Backlog

| Item | Source path | Next action |
| --- | --- | --- |
| Obsidian note vault | `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note` | Build a scoped ingest plan before importing |
| 开发前测试方法 | `raw/sources/胥克谦原创：开发前测试方法.pdf` | ❌ 内容不足，仅 2 行 |

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
| Downloaded PDFs | `raw/sources/` | Registered, not ingested |
| Claude Code 从入门到精通 v2.0.0 | [[claude-code-from-beginner-to-master-v2]] | Ingested |
| SKILL.md 结构与触发机制 | [[obsidian-claude-code-skill-trigger]] | Ingested |
| Sub-Agents 到 Multi-Agent 工程指南 | [[obsidian-claude-code-multi-agent-guide]] | Ingested |
| Plugins 插件打包与分发 | [[obsidian-claude-code-plugin-packaging]] | Ingested |
| Agent Skill 规范、构建与设计模式 | [[obsidian-agent-skill-spec-build-patterns]] | Ingested |

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

## Current Syntheses

| Synthesis | Notes |
| --- | --- |
| [[claude-code-engineering-map]] | Layered map from project memory to plugins and agent architecture |

## Current Ingest Backlog

| Item | Source path | Next action |
| --- | --- | --- |
| Obsidian note vault | `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note` | Build a scoped ingest plan before importing |
| Remaining Claude Code and agent PDFs | `raw/sources/` | Extract text, summarize one PDF at a time |
| Remaining Claude Code course notes | External Obsidian vault | Continue with `CLAUDE.md`, Hooks, MCP, Commands, Agent SDK |

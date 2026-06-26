---
type: source
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Plugins 插件打包与分发"
description: "关于 Claude Code Plugins 如何打包 commands、agents、skills、hooks 和 MCP 配置的 Obsidian 笔记摘要。"
tags:
  - plugin
  - claude-code
  - distribution
sources:
  - kind: obsidian
    path: "Claude Code工程化实战-共26讲/23｜化零为整：Plugins 插件打包与分发-Claude Code 工程化实战-极客时间.md"
---

# Obsidian Source: Plugins 插件打包与分发

## Summary

这篇笔记把 Claude Code Plugins 解释为标准化的打包和分发机制。插件本身不引入全新的能力，而是把 commands、agents、skills、hooks、MCP 配置等组件组合成可安装、可共享、可约束的团队能力包。

Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/23｜化零为整：Plugins 插件打包与分发-Claude Code 工程化实战-极客时间.md`

## Key Points

- 插件的价值是把个人或团队约定从“文档建议”变成“可分发约束”。
- 标准目录结构以 `.claude-plugin/plugin.json` 作为插件身份入口，其他目录如 `commands/`、`agents/`、`skills/`、`hooks/` 位于插件根目录。
- Commands 是用户直接感知的执行入口，适合流程型任务。
- Agents 用于封装专门角色，适合安全扫描、快速修复、代码审查等职责。
- Skills 放在 `skills/<name>/SKILL.md`，可配合章节化目录做渐进式披露。
- Hooks 能把安全检查、自动格式化等行为强制化。
- MCP 是最敏感的组件，配置应通过环境变量引用 token 和连接串，不应硬编码敏感信息。

## Durable Takeaways

- 插件适合在工作流稳定之后再做，不适合在第一天就抽象。
- 如果一套规则只服务当前项目，先放 `AGENTS.md` 或项目内 schema；如果要跨项目复用，再考虑 Skill；如果要分发给团队或社区，再考虑 Plugin。
- 插件设计的重点不是“包含更多组件”，而是明确哪些能力应该被一起安装、一起更新、一起治理。

## Connections

- Related: [[plugin]]
- Related: [[skill]]
- Related: [[agent-architecture]]

## Open Questions

- 本 wiki 的 ingest 流程稳定后，是否要打包成本地个人插件或只做 Skill。


---
type: concept
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Plugin"
description: "Claude Code 生态中用于打包 commands、agents、skills、hooks 和 MCP 配置的分发单元。"
tags:
  - claude-code
  - plugin
  - distribution
sources:
  - kind: wiki-page
    page: obsidian-claude-code-plugin-packaging
  - kind: wiki-page
    page: claude-code-from-beginner-to-master-v2
---

# Plugin

## Summary

Plugin 是 Claude Code 生态中的打包和分发单元。它可以把 Commands、Agents、Skills、Hooks、MCP 配置和文档组织成一个可安装的能力包。

## Key Points

- Plugin 的价值是标准化分发，而不是发明新机制。
- 插件入口是 `.claude-plugin/plugin.json`，它定义名称、版本、描述、作者、仓库等元数据。
- `commands/` 适合放用户显式触发的流程入口。
- `agents/` 适合放专门角色。
- `skills/` 适合放按需加载的知识和工作流。
- `hooks/` 适合放强制执行的检查和自动化。
- `.mcp.json` 适合连接外部工具，但必须谨慎处理敏感环境变量。

## When To Use

| Situation | Better choice |
| --- | --- |
| 只服务当前项目 | `AGENTS.md` / project schema |
| 跨项目复用一个工作流 | Skill |
| 要给团队统一安装一组能力 | Plugin |
| 要连接外部 API 或数据库 | MCP, often packaged in Plugin |

## Working Implication For This Wiki

本 wiki 暂时不需要 Plugin。等 ingest、lint、query 三类流程稳定，并且你希望在多个知识库里复用时，再考虑打包。

## Connections

- Related: [[skill]]
- Related: [[claude-code]]
- Related: [[agent-architecture]]


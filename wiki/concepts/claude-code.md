---
type: concept
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Claude Code"
description: "终端原生 Agent 式编程工作台及其工程循环、扩展系统和项目规则沉淀方式。"
tags:
  - claude-code
  - ai-agents
  - agentic-coding
sources:
  - kind: wiki-page
    page: claude-code-from-beginner-to-master-v2
  - kind: wiki-page
    page: 21-hours-claude-code-mastery
---

# Claude Code

## Summary

Claude Code 是一种终端原生的 Agent 式编程工作台。相较于 IDE 内嵌的代码补全或对话式改代码，它更强调独立执行工程循环：理解需求、读取项目、修改文件、运行命令、验证结果、管理 Git 和沉淀规则。

## Architecture Overview

基于 Claude Code 2.1.88 源码分析，系统包含超过 1900 个 TypeScript 源文件，构建产物为约 22MB 的单文件。

| 子系统 | 职责 |
|--------|------|
| 构建系统 | Bun 驱动、feature flag 编译期门控、MACRO 常量注入 |
| 入口与 REPL | CLI 多路分发、init() 职责链、QueryEngine 查询生命周期 |
| 工具系统 | Tool.ts 类型定义、BashTool/AgentTool 等具体实现、权限检查 |
| 终端 UI | 自研 Ink 引擎（React reconciler + Yoga 布局）、组件树、键绑定 |
| 上下文工程 | 系统提示词组装、MEMORY.md 记忆系统、compact 自动压缩 |
| Agent Runtime | Task 类型系统、LocalShellTask、LocalAgentTask、远程执行 |
| 扩展系统 | Skills、MCP 协议、Plugins、Bridge 桥接层 |
| 安全权限 | PermissionMode、权限规则优先级、SSRF 防护、OAuth 认证 |

## Key Points

- 它的优势不只是”写代码”，而是把产品构建过程中的大量工程动作外包给 Agent。
- 显式规则文件是关键资产。Claude 生态中是 `CLAUDE.md`，这个 wiki 中对应的是 `AGENTS.md` 和 `schema/`。
- 扩展能力通常按梯度演进：先写项目规则，再沉淀 Skills，再用 Hooks 强制执行，再用 MCP 连接外部系统，最后用 Plugins 打包分发。
- 上下文管理是核心能力。不是给模型所有信息，而是给当前任务需要的信息。
- 技术栈选型：Bun 构建、ESM 模块、React + Ink 终端 UI。

## Design Philosophy

- **默认安全**：未经明确授权的操作不会执行，权限检查发生在工具执行之前。
- **分层控制**：用户级（PermissionMode + 规则）→ 组织级（PolicyLimits）→ 协议级（SSRF Guard）。
- **编译期 vs 运行时门控**：feature flag 在编译期消除未使用代码，GrowthBook 提供运行时特性开关。

## Working Implication For This Wiki

本 wiki 不应该一次性把所有 Obsidian 笔记塞进上下文，而应该像 Claude Code 项目规则一样，逐步沉淀：

1. 原始资料保持不变。
2. 每次只导入一个主题或少数资料。
3. 把稳定结论写到概念页和综合页。
4. 把规则变化写回 `AGENTS.md` 或 `schema/`。

## Connections

- Related: [[skill]]
- Related: [[plugin]]
- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]


---
type: concept
status: active
created: 2026-05-31
updated: 2026-05-31
sources:
  - [[obsidian-claude-code-multi-agent-guide]]
  - [[obsidian-claude-code-skill-trigger]]
  - [[claude-code-from-beginner-to-master-v2]]
---

# Agent Architecture

## Summary

Agent 架构的核心不是让系统看起来更复杂，而是用合适的结构解决上下文、职责、状态和并行问题。默认应从单 Agent 开始，只有当明确遇到瓶颈时才升级。

## Pattern Map

| Pattern | Solves | Cost |
| --- | --- | --- |
| Single Agent + Tools | 简单任务、少量工具、低复杂度 | 最低 |
| Skills | 能力多但单次只需少数能力 | 共享上下文，隔离弱 |
| Sub-Agents | 专业职责隔离、大量信息过滤、并行研究 | 调度和 token 成本高 |
| Handoffs | 多阶段顺序流程、状态流转 | 阶段设计和退出条件复杂 |
| Router | 跨领域或多数据源并行查询 | 合成和调试复杂 |

## Decision Rules

- 单一领域、工具少、上下文轻：保持单 Agent。
- 工具和规则变多，但任务仍需连续对话：优先 Skills。
- 多领域需要独立上下文：考虑 Sub-Agents。
- 流程有明确阶段和完成条件：考虑 Handoffs。
- 查询天然可拆分到多个数据源：考虑 Router。

## Working Implication For This Wiki

当前 wiki 处于早期，材料数量不大，结构仍在形成。最适合的架构是：

1. 单 Agent 维护 wiki。
2. `index.md` 做导航。
3. `rg` 做本地检索。
4. 按主题分批 ingest。
5. 暂不引入多 Agent、数据库或 MCP。

## Connections

- Related: [[skill]]
- Related: [[plugin]]
- Related: [[claude-code-engineering-map]]


---
type: source
status: active
created: 2026-05-31
updated: 2026-06-26
title: "从 Sub-Agents 到 Multi-Agent 的工程指南"
description: "关于何时从单 Agent 升级到 Skills、Sub-Agents、Handoffs 或 Router 的 Obsidian 笔记摘要。"
tags:
  - multi-agent
  - agent-architecture
  - claude-code
sources:
  - kind: obsidian
    path: "Claude Code工程化实战-共26讲/04｜量体裁衣：从Sub-Agents到Multi-Agent的工程指南-Claude Code 工程化实战-极客时间.md"
---

# Obsidian Source: 从 Sub-Agents 到 Multi-Agent 的工程指南

## Summary

这篇笔记围绕何时升级到多 Agent 展开，核心立场是避免过早复杂化：先从单 Agent 开始，优先增加工具，只有遇到明确的上下文、职责分工或并行需求瓶颈时，再引入 Skills、Sub-Agents、Handoffs 或 Router。

Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/04｜量体裁衣：从Sub-Agents到Multi-Agent的工程指南-Claude Code 工程化实战-极客时间.md`

## Key Points

- 升级到多 Agent 的两个核心触发条件是上下文管理挑战和分布式开发需求。
- Sub-Agent 模式强调 Supervisor 委派和上下文隔离，适合大量信息过滤、并行检索和独立专业职责。
- Skills 模式仍是单 Agent，但通过按需加载能力降低上下文成本，适合能力多但单次只需要少数能力的系统。
- Handoffs 是状态驱动的阶段切换，更适合顺序流程，如客服、工单、诊断链路。
- Router 适合跨多个领域或数据源的并行查询，由上层负责分类、分发和合成。
- 多 Agent 架构不是线性升级，而是根据任务特征在性能、成本和可控性之间权衡。

## Durable Takeaways

- “上下文隔离”往往比“并行”更能解释多 Agent 的价值。
- 多 Agent 的成本和调试复杂度显著高于单 Agent，只有高价值、高复杂度任务才值得承担。
- 对本 wiki 来说，早期不需要多 Agent；`index.md + rg + 主题化 ingest` 比引入复杂调度更合适。

## Connections

- Related: [[agent-architecture]]
- Related: [[skill]]
- Related: [[claude-code-engineering-map]]

## Open Questions

- 本 wiki 后续是否需要 Router 式查询，应等到页面数量和主题跨度明显增大后再判断。


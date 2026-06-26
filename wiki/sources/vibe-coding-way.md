---
type: source
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Vibe Coding 之道"
description: "关于 Vibe Coding 到 Agentic 模式演进、Context 复利和 AI 协作工作流的小册子摘要。"
tags:
  - vibe-coding
  - agentic-coding
  - context-engineering
sources:
  - kind: local-raw
    path: "raw/sources/Vibe Coding之道.md"
  - kind: local-raw
    path: "raw/extracted/pdf/vibe-coding-way.md"
---

# Vibe Coding 之道

## Summary

这是 ChaoGeek 的一本小册子，探讨从 Vibe Coding 到 Agentic 模式的演进。核心观点：Vibe Coding 是起点不是终点，真正的红利在于 Context 复利——让 AI 越用越懂你。

Source: `raw/sources/Vibe Coding之道.md`

## Key Points

### Vibe Coding 的定义

Andrej Karpathy 的定义："完全屈服于氛围，拥抱指数级增长，忘记代码的存在。"

- 不需要审查每一行代码
- 遇到错误就复制粘贴给 AI
- 通常就能修好

**价值**：打破心理障碍，教会所有人信任模型的智能。

**局限**：没有解决"如何让 AI 越用越聪明"的问题。

### AI 的四种形态

| 形态 | 特点 | 例子 |
|------|------|------|
| Chat + AI | 你问我答 | ChatGPT 网页版 |
| IDE + AI | AI 嵌入开发环境 | Cursor、Copilot |
| Agent | AI 自己规划、自己执行 | Claude Code、Codex |
| Multi-Agent | 多个 Agent 协作 | 团队式协作 |

**Agent 的核心区别**：能自己行动，不需要你一步步告诉它怎么做。

### Agent 的三个核心能力

1. **感知**：理解环境、读取文件、分析代码
2. **决策**：规划步骤、判断下一步、处理异常
3. **行动**：执行命令、修改文件、运行测试

### 从 Vibe Coding 到 Agent 的三步

1. **选择工具**：快速原型用 Vibe Coding，长期项目需要 Agent + 记忆系统
2. **建立记忆系统**：短期记忆、长期记忆、程序性记忆
3. **设计工作流**：人只在关键决策点介入

### 理想工作流

```
Explore → 你选方向 → Brainstorm → 你审方案 → Execute → Verify → Learn
```

**人只出现在两个点**：选方向、审方案。其余全交给 AI。

### AI 时代的新技能

| 技能 | 说明 |
|------|------|
| 提问能力 | 好的问题比好的指令更有价值 |
| 判断能力 | 从 AI 给的选项中选择最好的 |
| 元认知 | 知道何时信任、何时介入、何时推翻 |

## Durable Takeaways

> 瓶颈从来不是模型的智能。瓶颈是模型是否理解你的 schema。

> Every skill you write is a permanent upgrade. It never degrades. It never forgets.

> 不是造更聪明的 AI，而是养更深的 Context。

**核心洞见**：Context 复利是 Agent 时代的真正红利——每次对话积累经验、每次踩坑变成规则、每次成功沉淀为 Skill。

## Connections

- Related: [[skill]]
- Related: [[agent-architecture]]
- Related: [[hermes-agent-mastery]]
- Related: [[claude-code-engineering-map]]

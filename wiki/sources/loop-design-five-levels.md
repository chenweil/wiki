---
type: source
status: active
created: 2026-06-26
updated: 2026-06-26
title: "The 5 Levels of Loop Design"
description: "一篇从 prompting 到 autonomous agents 的 loop design 五层阶梯文章摘要。"
tags:
  - ai-agents
  - loop-design
  - autonomous-agents
sources:
  - kind: obsidian
    path: "收集/The 5 Levels of Loop Design From Prompting to Autonomous Agents.zh-CN.md"
---

# The 5 Levels of Loop Design

## Summary

这篇文章把 AI 使用能力从"写 prompt"重新框定为"设计 loop"：真正的进阶不是更会提示模型，而是能设计一个发现任务、执行、检查、修正、停止或继续的工作循环。它提出了 5 个层级：Prompting、Manual Loop、Verified Loop、Self-Running Loop、Autonomous Agents。

Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集/The 5 Levels of Loop Design From Prompting to Autonomous Agents.zh-CN.md`

## Key Points

- Level 1 Prompting：人写一个 prompt，读一个答案，再写下一个 prompt；瓶颈是人的输入和阅读速度。
- Level 2 Manual Loop：人开始意识到"做、检查、修正、再来"是循环，但每一轮仍由人手动推动。
- Level 3 Verified Loop：把"完成"定义成机器可检查的条件，例如测试通过、lint 干净、输出符合评分标准；执行者不能给自己打分。
- Level 4 Self-Running Loop：给出目标和停止条件，loop 自己跨多轮执行、读取失败、修复、重跑检查；需要 max turns、上下文前置和状态快照等护栏。
- Level 5 Autonomous Agents：loop 能自启动、并行运行，并把经验写回规则、skill 或记忆系统，形成会随时间改进的小型组织。

## Durable Takeaways

- AI agent 的能力梯度可以看成从"人是 loop"到"人设计 loop"的迁移。
- 判断一个工作流是否成熟，关键看它有没有独立验证者、停止条件、失败反馈和可持久化学习。
- Autonomous agent 不是单纯更长的 prompt，而是事件触发、并行隔离、结果整合和经验回写构成的系统。

## Connections

- Related: [[loop-design]]
- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]

## Open Questions

- 这篇文章中关于 Claude Code `/goal` 的描述需要在未来结合官方文档或本地手测核对。
- 对个人知识库维护来说，哪些任务值得从 manual loop 升级到 verified loop 或 self-running loop？

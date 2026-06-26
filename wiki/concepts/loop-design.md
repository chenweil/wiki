---
type: concept
status: active
created: 2026-06-26
updated: 2026-06-26
title: "Loop Design"
description: "把 AI 工作从单轮 prompt 升级为可验证、可自运行、可自改进循环的设计方法。"
tags:
  - ai-agents
  - loop-design
  - workflow-design
sources:
  - kind: wiki-page
    page: loop-design-five-levels
---

# Loop Design

## Summary

Loop Design 是把 AI 工作流设计成循环系统的能力：任务进入循环后，系统能执行、检查、修正、决定是否继续，并在更高层级中自启动、并行运行和持续改进。它把人的角色从"逐条提示模型"推向"设计工作系统"。

## Key Points

- **Prompting 不是终点**：单轮 prompt 适合快速任务，但吞吐量受人的注意力和操作速度限制。
- **Manual Loop 是第一步**：当你反复让 agent 执行、检查、修正时，已经进入循环思维，但控制权仍在人手里。
- **Verified Loop 是质变点**：完成条件必须外部化、机器可检查，并由独立检查者判断，而不是由执行 agent 自评。
- **Self-Running Loop 需要护栏**：自动循环要有最大轮数、上下文边界、状态快照和明确停止条件，否则只是更快地空转。
- **Autonomous Agents 是系统设计**：自启动、并行、经验回写共同构成 autonomous agent 的实际边界。

## Practical Ladder

| Level | Pattern | Human role | Stop condition |
| --- | --- | --- | --- |
| 1 | Prompting | 逐条输入和判断 | 人读完觉得够了 |
| 2 | Manual Loop | 手动推动每一轮 | 人决定再跑或停止 |
| 3 | Verified Loop | 定义可检查完成条件 | 测试、lint、评分器等外部检查 |
| 4 | Self-Running Loop | 设目标并监督 | loop 自动重试直到条件达成或触发护栏 |
| 5 | Autonomous Agents | 设计系统和反馈机制 | 事件、调度、并行结果和经验回写共同驱动 |

## Working Implication For This Wiki

当前 MyWiki 的维护流程已经接近 Level 3：`lint-all` 把 OKF metadata、大文件保护和 vendor clean 作为独立检查。下一步不应急着做全自动 agent，而应先把 ingest 的完成条件继续明确化，例如：

1. 新 source summary 已创建。
2. 相关 concept/synthesis 已更新。
3. `wiki/index.md` 与 `wiki/log.md` 已更新。
4. `node scripts/lint-all.mjs` 通过。

等这些条件稳定后，再考虑把 `/ingest` 从人工驱动的 manual loop 升级为 verified loop。

## Connections

- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]
- Related: [[claude-code]]

## Open Questions

- MyWiki 是否需要一个更严格的 ingest completion checklist，让每次导入都能被机器检查？
- 个人知识库维护的 self-running loop 应该限制在什么范围，才不会误写入低质量综合？

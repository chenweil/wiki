---
type: source
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Agent Harness 综述"
description: "关于 Agent Harness ETCLOVG 七层框架及模型外部工程系统重要性的资料摘要。"
tags:
  - agent-harness
  - harness-engineering
  - ai-agents
sources:
  - kind: obsidian
    path: "收集内容/刚刚，一篇最全 Agent Harness 综述来了！.md"
---

# Agent Harness 综述

## Summary

这是 Datawhale 对 CMU、Yale、JHU 等机构联合发表的 Agent Harness 综述论文的深度解读。核心观点：Agent 性能瓶颈已从模型能力转向模型外部的工程系统（Harness），提出了 ETCLOVG 七层框架。

Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/刚刚，一篇最全 Agent Harness 综述来了！.md`

## Key Points

### 核心判断

> 同一个模型，换一套执行外壳，表现可以完全不一样。

- Agent 失败常因系统管理不善，而非模型不够聪明
- 改进 Harness 可在不换模型的情况下带来数倍性能提升
- 例：GPT-5.2-Codex 通过重构 harness，在 Terminal-Bench 2.0 上从 52.8% 提升到 66.5%

### 三次工程迁移

| 阶段 | 解决的问题 | 工程对象 |
|------|------------|----------|
| Prompt Engineering | 怎么跟模型说话 | 提示词 |
| Context Engineering | 模型该看见什么 | 上下文、记忆 |
| Harness Engineering | 怎么让模型在真实世界可靠行动 | 执行环境、工具、权限、验证 |

### ETCLOVG 七层框架

| 层 | 名称 | 核心问题 |
|----|------|----------|
| E | Execution | Agent 在哪里跑？本地、容器、沙箱？ |
| T | Tooling | 工具怎么描述、发现、调用？怎么防止乱选工具？ |
| C | Context | 短期上下文、会话状态、长期记忆怎么管理？ |
| L | Lifecycle | 单轮还是多轮？一个 Agent 还是分工协作？ |
| O | Observability | 每次调用、报错、重试、成本怎么追踪？ |
| V | Verification | 结果对不对？失败是哪一层的问题？ |
| G | Governance | Agent 有什么权限？谁来审批？谁来审计？ |

### 可观测性和治理：独立核心层

**为什么必须独立**：

- Agent 会执行真实操作：调工具、改代码、发邮件、访问 API
- 没有可观测性 → 失败了不知道为什么
- 没有治理 → 成功了也不敢用

### Trace-Native 评估

**问题**：最终成功率掩盖了多变量影响

**方案**：把完整执行轨迹作为评估对象

记录内容：
- 模型输出、工具调用、工具返回
- 环境状态变化、上下文快照
- 错误、重试、恢复动作
- token 使用、延迟、成本

判断三件事：结果是否正确、路径是否合理、评估器是否可信

### 跨层矛盾

| 矛盾 | 说明 |
|------|------|
| 成本-质量-速度三角 | 更安全 = 更强沙箱 + 更细权限 + 更完整 trace = 更高成本 |
| 能力与控制矛盾 | 更多工具 = 更能干 = 更容易选错 = 更大攻击面 |
| Harness Coupling | 改任何一层都可能改变整个系统行为 |

### Framework → Platform

| 阶段 | 解决的问题 |
|------|------------|
| Framework | 局部抽象：agent、tool、memory、loop |
| Platform | 完整生产系统：workspace、sandbox、identity、billing、observability、governance |

**竞争焦点**：谁的执行环境更稳、工具协议更清晰、trace 更好用、权限更可控

### 动态调整原则

> 好 Harness 不只是会加控制，还要知道什么时候删控制。

- 每一层控制都代表一个假设：模型自己做不好
- 模型变强后，某些控制可能不再必要
- 例：某些 context reset 对旧模型有用，对更强模型可以去掉

## Durable Takeaways

- Agent 的下一场竞争，不只是模型能力，而是模型外面的工程外壳
- Prompt Engineering 是把模型叫醒，Context Engineering 是让模型看见正确信息，Harness Engineering 是让模型在真实世界可靠行动
- Agent 要从玩具变成基础设施，差的就是这层外壳

## Connections

- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]
- Related: [[skill]]
- Related: [[plugin]]

## Open Questions

- 如何根据模型能力动态调整 Harness 的复杂度？
- ETCLOVG 七层框架在不同场景下的优先级如何排序？

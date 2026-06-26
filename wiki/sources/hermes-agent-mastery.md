---
type: source
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Hermes Agent 从入门到精通"
description: "关于 Hermes Agent 自改进循环、三层记忆和 24/7 后台运行模式的资料摘要。"
tags:
  - hermes-agent
  - autonomous-agents
  - harness-engineering
sources:
  - kind: local-raw
    path: "raw/sources/Hermes-Agent-从入门到精通-v260407.pdf"
  - kind: local-raw
    path: "raw/extracted/pdf/hermes-agent-mastery.txt"
---

# Hermes Agent 从入门到精通

## Summary

这是花叔的橙皮书系列，系统介绍 Hermes Agent——一个"出厂就带缰绳"的自改进 AI Agent。核心定位：不是又一个 Agent 工具，而是 Harness Engineering 方法论的产品化。Hermes 的独特之处在于学习循环、三层记忆、Skill 自改进和 24/7 后台运行。

Source: `raw/sources/Hermes-Agent-从入门到精通-v260407.pdf`

## Key Points

### 核心定位

> Hermes 是第一个出厂就带缰绳的 Agent。而且缰绳会自己长大。

- 不是替代 Claude Code 或 OpenClaw，而是解决不同层面的问题
- Claude Code：交互式编码，你坐在终端前实时协作
- OpenClaw：配置即行为，SOUL.md 定义 Agent 人格
- Hermes：自主后台 + 自改进，24/7 运行，自己记忆、自己创建 Skill、自己改进

### 五组件映射：Harness Engineering 的产品化

| Harness 五组件 | 手动实现方式 | Hermes 内建系统 |
|----------------|--------------|-----------------|
| 指令层 | 手写 CLAUDE.md | Skill 系统（自动创建 + 自改进） |
| 约束层 | 配置 hooks / linter | Tool permissions + sandbox + toolset |
| 反馈层 | 人工审查 / 评估者 Agent | 自改进学习循环 |
| 记忆层 | 手动维护 knowledge base | 三层记忆 + Honcho 用户建模 |
| 编排层 | 自己搭多 Agent pipeline | 子 Agent 委派 + cron 调度 |

### 学习循环：五个环节

1. **策划记忆**：对话结束，主动决定哪些信息值得记住
2. **自主创建 Skill**：复杂任务完成后，提炼解决方案为 Skill
3. **Skill 自改进**：根据反馈自动修改 Skill 文件
4. **FTS5 跨会话召回**：按需检索历史记忆，不是全量加载
5. **用户建模**：Honcho 辩证建模，推理用户偏好

### 三层记忆系统

| 记忆层 | 回答的问题 | 技术实现 |
|--------|------------|----------|
| 会话记忆 | 发生了什么？ | SQLite + FTS5 按需检索 |
| 持久记忆 | 你是谁？ | SQLite，跨会话保持 |
| Skill 记忆 | 怎么做事？ | ~/.hermes/skills/ 下的 markdown 文件 |

### 40+ 工具与 MCP

五大类工具：执行类、信息类、媒体类、记忆类、协调类。MCP 可接入 6000+ 外部应用。

### 多 Agent 编排

- delegate_task 工具，最多 3 个子 Agent 并发
- 独立上下文、受限工具集、结果回传主 Agent

### 与其他工具的对比

| 维度 | Claude Code | OpenClaw | Hermes Agent |
|------|-------------|----------|--------------|
| 核心理念 | 交互式编码 | 配置即行为 | 自主后台 + 自改进 |
| 你的角色 | 坐在终端前指挥 | 写配置文件定义行为 | 部署后偶尔检查 |
| 记忆机制 | CLAUDE.md + auto-memory | SOUL.md（扁平） | 三层自改进记忆 |
| 运行模式 | 按需启动 | 按需启动 | 24/7 后台运行 |
| 部署成本 | 订阅制 | 免费 + API 费 | $5 VPS 起 |

### 部署方案

- $5/月 VPS（Hetzner CX22、DigitalOcean、Vultr）
- 支持 Docker、Serverless（Daytona、Modal）
- 多平台 Gateway：Telegram、Discord、Slack、WhatsApp、Signal

## Durable Takeaways

- Hermes 的核心创新是"学习循环"——用得越多，每个环节都在变强
- 三层记忆 + FTS5 按需检索，解决了传统 AI 记忆的上下文爆炸问题
- agentskills.io 标准让 Skill 在不同 Agent 之间互通
- 自改进的天花板由反馈信号决定——人定义方向，Agent 优化执行

## Connections

- Related: [[claude-code]]
- Related: [[skill]]
- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]

## Open Questions

- Hermes 的自改进机制在长期运行中会不会积累错误规则？
- agentskills.io 标准能否真正实现生态互通？

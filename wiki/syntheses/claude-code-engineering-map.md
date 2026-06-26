---
type: synthesis
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Claude Code Engineering Map"
description: "整合 Claude Code、Skills、Plugins、Agent 架构和 Loop Design 的工程化知识地图。"
tags:
  - claude-code
  - engineering-map
  - ai-agents
sources:
  - kind: wiki-page
    page: loop-design-five-levels
  - kind: wiki-page
    page: claude-code-from-beginner-to-master-v2
  - kind: wiki-page
    page: obsidian-claude-code-skill-trigger
  - kind: wiki-page
    page: obsidian-claude-code-multi-agent-guide
  - kind: wiki-page
    page: obsidian-claude-code-plugin-packaging
  - kind: wiki-page
    page: obsidian-agent-skill-spec-build-patterns
  - kind: wiki-page
    page: 21-hours-claude-code-mastery
  - kind: wiki-page
    page: claude-code-engineering-live
  - kind: wiki-page
    page: hermes-agent-mastery
---

# Claude Code Engineering Map

## Summary

Claude Code 工程化可以理解为一套从个人效率到团队能力分发的递进体系：先让 Agent 能稳定理解项目，再让它按需加载知识，然后用确定性自动化兜底，最后把稳定能力打包分发。

## Core Positioning

> Claude Code 不只是工具，而是一个可编程、可扩展、可组合的 AI Agent 框架/平台。

**认知转变**：从被动使用（问什么答什么）到主动驾驭（配置 Agent 自主工作）。

## Three Paradigms: Claude Code vs OpenClaw vs Hermes

| 维度 | Claude Code | OpenClaw | Hermes Agent |
|------|-------------|----------|--------------|
| 核心理念 | 交互式编码 | 配置即行为 | 自主后台 + 自改进 |
| 你的角色 | 坐在终端前指挥 | 写配置文件定义行为 | 部署后偶尔检查 |
| 记忆机制 | CLAUDE.md + auto-memory | SOUL.md（扁平） | 三层自改进记忆 |
| Skill 维护 | 手动安装 | ClawHub 44000+ | Agent 自创 + 自改进 |
| 运行模式 | 按需启动 | 按需启动 | 24/7 后台运行 |
| 部署成本 | 订阅制 | 免费 + API 费 | $5 VPS 起 |

**组合使用**：Claude Code 处理”白天团队”任务（交互编码），Hermes 处理”夜班团队”任务（后台值守），OpenClaw 提供透明可控的配置语言。

## Layered Model

| Layer | Mechanism | Main Question | When to introduce |
| --- | --- | --- | --- |
| Project memory | `CLAUDE.md` / `AGENTS.md` | 这个项目怎么干活 | 一开始就需要 |
| Knowledge loading | Skills | 这类任务应该怎么做 | 口头规则重复出现时 |
| Skill engineering | Skill spec / Skill-Creator / Writing-Skills | 如何把工作流做成可复用能力 | 重复流程稳定且值得长期复用时 |
| Deterministic checks | Hooks | 哪些事必须强制执行 | 模型偶尔忘记会造成损失时 |
| External access | MCP | 需要连接哪些外部系统 | 需要数据库、API、设计稿、监控时 |
| Packaging | Plugins | 如何把一组能力分享出去 | 团队或跨项目复用时 |
| Architecture scaling | Sub-Agents / Handoffs / Router | 谁来做、何时切换、如何并行 | 遇到上下文或职责边界后 |
| Loop design | Verified / self-running loops | 工作如何跨轮执行、检查、停止和改进 | 重复任务需要从人工推动升级为系统运行时 |

## Four Core Components Comparison

| 组件 | 触发方式 | 决策权 | 确定性 | 典型用例 |
|------|----------|--------|--------|----------|
| Commands | 用户 /command | 人 | 100% | 统一 commit 格式 |
| Skills | 语义推理 | 模型 | 概率性 | 代码安全审查 |
| SubAgents | 用户或 Claude | 架构 | 可控 | 跑 500 行测试 |
| Hooks | 系统事件 | 系统 | 100% | 保存自动格式化 |

## Self-Improving Agent: Hermes Model

Hermes 提出了一个”学习循环”模型，让 Agent 自己给自己造缰绳：

### 五环节学习循环

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

## Main Synthesis

这些资料共同指向一个工程原则：**先沉淀规则，再增加结构；先局部稳定，再抽象分发。**

Loop Design 资料把这条原则再往前推进了一步：成熟的 agent 工作流不是更长的 prompt，而是有明确停止条件、独立验证者和经验回写的循环系统。对 Claude Code 这类工具来说，关键不是一次会话里让模型多做一点，而是把重复工作逐步升级为 manual loop、verified loop，最终才考虑 self-running loop。

对个人知识库也是同样逻辑。这个 `mywiki` 不应该一开始就安装一堆 Skill、MCP 或导入所有 Obsidian 笔记。更稳的做法是：

1. 先用 `AGENTS.md` 定义维护规则。
2. 选择一个主题做小批量 ingest。
3. 把 source summary、概念页、综合页跑通。
4. 等重复动作稳定，再设计本地 Skill。
5. 等多个知识库都需要同样能力，再考虑 Plugin。

新导入的 Skill 规范资料补充了一个更严格的判断：创建 Skill 之前，先区分它是 Tool Wrapper、Generator、Reviewer、Inversion 还是 Pipeline。对本 wiki 来说，ingest 更像 Pipeline + Reviewer，而 query 回写更像 Inversion + Generator。

## Best Practices

1. **先跑起来，再优化**：从零配置 → Commands → Skills → SubAgents，逐步演进
2. **写好 CLAUDE.md**：最高杠杆投入，30 分钟写好项目规范
3. **善用 SubAgents 隔离噪声**：高噪声任务用子代理，只把结论带回主对话
4. **用 Hooks 做安全兜底**：系统强制比 AI 判断更可靠
5. **组合使用而非单打独斗**：Commands + Skills + Hooks + MCP
6. **先做 Verified Loop**：把完成条件交给测试、lint、评分器或 reviewer，而不是让执行 agent 自评
7. **从小处着手，逐步扩展**：先一个 Command 解决痛点

## Practical Roadmap For This Wiki

| Phase | Action | Exit criteria |
| --- | --- | --- |
| 1 | 手动导入 Claude Code/Agent 主题 | 有 source summary、概念页、综合页 |
| 2 | 增加 PDF 抽取和引用规范 | 每个 PDF 有 extracted text 和 source summary |
| 3 | 定义 ingest checklist | 每次导入步骤一致 |
| 4 | 做 `llm-wiki-ingest` Skill | 不再需要每次口述导入规则 |
| 5 | 添加 lint 流程 | 能找孤立页、缺来源、重复概念 |

## Candidate Local Skills

| Skill | Pattern | Trigger |
| --- | --- | --- |
| `llm-wiki-ingest` | Pipeline + Reviewer | 用户要求导入 Markdown、PDF、Obsidian 笔记或 raw source |
| `llm-wiki-query` | Inversion + Generator | 用户基于 wiki 提问，且答案值得沉淀 |
| `llm-wiki-lint` | Reviewer | 用户要求检查 wiki 健康度或导入质量 |

## Open Questions

- 这个 wiki 是否更偏”AI 工程学习库”，还是会覆盖生活、读书、健康、项目管理等全域个人知识？
- 如果覆盖全域知识，是否需要按主题设立多个 `overview` 或 map of content？
- `llm-wiki-ingest` 是否已经值得做成 Skill，还是继续手工运行 2-3 轮。
- Hermes 的自改进机制在长期运行中会不会积累错误规则？

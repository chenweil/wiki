---
type: concept
status: active
created: 2026-05-31
updated: 2026-06-26
sources:
  - kind: wiki-page
    page: loop-design-five-levels
  - kind: wiki-page
    page: obsidian-claude-code-multi-agent-guide
  - kind: wiki-page
    page: obsidian-claude-code-skill-trigger
  - kind: wiki-page
    page: claude-code-from-beginner-to-master-v2
  - kind: wiki-page
    page: obsidian-agent-skill-spec-build-patterns
  - kind: wiki-page
    page: 21-hours-claude-code-mastery
  - kind: wiki-page
    page: hermes-agent-mastery
  - kind: wiki-page
    page: agent-harness-survey
---

# Agent Architecture

## Summary

Agent 架构的核心不是让系统看起来更复杂，而是用合适的结构解决上下文、职责、状态和并行问题。默认应从单 Agent 开始，只有当明确遇到瓶颈时才升级。

## ETCLOVG 七层框架

基于 Agent Harness 综述，生产级 Agent 需要七层工程支撑：

| 层 | 名称 | 核心问题 |
|----|------|----------|
| E | Execution | Agent 在哪里跑？本地、容器、沙箱？ |
| T | Tooling | 工具怎么描述、发现、调用？怎么防止乱选工具？ |
| C | Context | 短期上下文、会话状态、长期记忆怎么管理？ |
| L | Lifecycle | 单轮还是多轮？一个 Agent 还是分工协作？ |
| O | Observability | 每次调用、报错、重试、成本怎么追踪？ |
| V | Verification | 结果对不对？失败是哪一层的问题？ |
| G | Governance | Agent 有什么权限？谁来审批？谁来审计？ |

**关键洞见**：工具调用只是其中一层。真正的 Agent 产品，要有执行环境、上下文、编排、监控、验证和治理。

## Pattern Map

| Pattern | Solves | Cost |
| --- | --- | --- |
| Single Agent + Tools | 简单任务、少量工具、低复杂度 | 最低 |
| Skills | 能力多但单次只需少数能力 | 共享上下文，隔离弱 |
| Sub-Agents | 专业职责隔离、大量信息过滤、并行研究 | 调度和 token 成本高 |
| Handoffs | 多阶段顺序流程、状态流转 | 阶段设计和退出条件复杂 |
| Router | 跨领域或多数据源并行查询 | 合成和调试复杂 |

## Loop Design Ladder

基于 [[loop-design-five-levels]]，Agent 架构也可以按 loop 成熟度理解：

| Level | 架构形态 | 关键能力 |
| --- | --- | --- |
| 1 | Prompting | 人逐条驱动，Agent 回答 |
| 2 | Manual Loop | 人手动推动执行、检查、修正 |
| 3 | Verified Loop | 独立检查者定义完成条件 |
| 4 | Self-Running Loop | 目标和停止条件驱动多轮自动执行 |
| 5 | Autonomous Agents | 自启动、并行、经验回写 |

这条阶梯补充了 Pattern Map：Sub-Agents、Handoffs、Router 是结构形态；Loop Design 描述的是工作是否能可靠地跨轮运行、验证和改进。

## Three Paradigms Comparison

基于 Hermes Agent 文档，三种 Agent 工具代表不同的设计理念：

| 维度 | Claude Code | OpenClaw | Hermes Agent |
|------|-------------|----------|--------------|
| 核心理念 | 交互式编码 | 配置即行为 | 自主后台 + 自改进 |
| 你的角色 | 坐在终端前指挥 | 写配置文件定义行为 | 部署后偶尔检查 |
| 记忆机制 | CLAUDE.md + auto-memory | SOUL.md（扁平） | 三层自改进记忆 |
| Skill 维护 | 手动安装 | ClawHub 44000+ | Agent 自创 + 自改进 |
| 运行模式 | 按需启动 | 按需启动 | 24/7 后台运行 |
| 部署成本 | 订阅制 | 免费 + API 费 | $5 VPS 起 |

**关键洞察**：这三个工具不是竞争关系，而是各管一段。Claude Code 是"白天团队"（交互编码），Hermes 是"夜班团队"（后台值守），OpenClaw 提供透明可控的配置语言。

## Task System (from Source Code Analysis)

基于 Claude Code 2.1.88 源码，Task 类型系统定义了多种后台任务类型：

| TaskType | 用途 |
|----------|------|
| local_bash | 本地 shell 命令 |
| local_agent | 本地子代理 |
| remote_agent | 远程代理 |
| in_process_teammate | 进程内团队成员 |
| local_workflow | 本地工作流 |
| monitor_mcp | MCP 监控 |
| dream | 梦境模式 |

任务状态机：pending → running → completed/failed/killed。

### AgentTool 实现细节

AgentTool 实现了子代理的完整生命周期：
- runAgent.ts 是核心，直接调用 query() 函数创建独立的查询循环
- 子代理拥有自己的系统提示词、消息历史和工具集合
- loadAgentsDir.ts 从 `.claude/agents/` 目录加载代理定义
- agentMemory.ts 管理子代理的记忆隔离

## Self-Improving Agent: Hermes Model

Hermes Agent 提出了一个"学习循环"模型，让 Agent 自己给自己造缰绳：

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

### Harness Engineering 的产品化

| Harness 五组件 | 手动实现方式 | Hermes 内建系统 |
|----------------|--------------|-----------------|
| 指令层 | 手写 CLAUDE.md | Skill 系统（自动创建 + 自改进） |
| 约束层 | 配置 hooks / linter | Tool permissions + sandbox + toolset |
| 反馈层 | 人工审查 / 评估者 Agent | 自改进学习循环 |
| 记忆层 | 手动维护 knowledge base | 三层记忆 + Honcho 用户建模 |
| 编排层 | 自己搭多 Agent pipeline | 子 Agent 委派 + cron 调度 |

## 三次工程迁移

| 阶段 | 解决的问题 | 工程对象 |
|------|------------|----------|
| Prompt Engineering | 怎么跟模型说话 | 提示词 |
| Context Engineering | 模型该看见什么 | 上下文、记忆 |
| Harness Engineering | 怎么让模型在真实世界可靠行动 | 执行环境、工具、权限、验证 |

## Decision Rules

- 单一领域、工具少、上下文轻：保持单 Agent。
- 工具和规则变多，但任务仍需连续对话：优先 Skills。
- 多领域需要独立上下文：考虑 Sub-Agents。
- 流程有明确阶段和完成条件：考虑 Handoffs。
- 查询天然可拆分到多个数据源：考虑 Router。
- 需要 24/7 后台运行 + 自改进：考虑 Hermes 模式。
- 需要生产级可靠性：必须考虑 ETCLOVG 七层。

## Working Implication For This Wiki

当前 wiki 处于早期，材料数量不大，结构仍在形成。最适合的架构是：

1. 单 Agent 维护 wiki。
2. `index.md` 做导航。
3. `rg` 做本地检索。
4. 按主题分批 ingest。
5. 暂不引入多 Agent、数据库或 MCP。

## Connections

- Related: [[skill]]
- Related: [[skill-development]]
- Related: [[plugin]]
- Related: [[claude-code-engineering-map]]
- Related: [[hermes-agent-mastery]]
- Related: [[agent-harness-survey]]

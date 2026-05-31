---
type: source
status: active
created: 2026-05-31
updated: 2026-05-31
sources:
  - /Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/浅谈 AI 编程.md
---

# 浅谈 AI 编程

## Summary

浮之静的深度长文，探讨 AI 编程的范式迁移。核心观点：当代码生成边际成本趋近于零时，软件工程的核心将从"写代码"转向"治理 AI 生产系统"，规格、约束与验证体系将成为比代码本身更重要的资产。

Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/浅谈 AI 编程.md`

## Key Points

### 核心矛盾迁移

> 代码生产的边际成本正在快速趋近于零。当代码变得越来越便宜，软件工程的核心矛盾就会从"谁来写代码"转向"谁来定义正确性、谁来约束生成、谁来验证结果"。

### 四大瓶颈

| 瓶颈 | 说明 |
|------|------|
| 目标瓶颈 | 模型可以持续行动，但必须知道什么叫完成 |
| 上下文瓶颈 | 真实代码库有历史包袱、隐性约定、兼容承诺 |
| 验证瓶颈 | AI 生成代码很快，但正确性不是语言流畅度决定的 |
| 组织吸收瓶颈 | 权限、审查、回滚、合规、责任归属 |

### Goal vs Workflow

| 概念 | 解决的问题 |
|------|------------|
| Goal | 定义"什么时候算完成"，目标持续化 |
| Workflow | 定义"任务如何被组织和执行"，编排外置化 |

**Codex Goal**：把口头指令升级为"完成合同"（Outcome、Verification surface、Constraints）

**Claude Dynamic Workflows**：生成 JavaScript 脚本调度 subagents，解决大规模任务的编排失控

### 原语地图

| 概念 | 本质 |
|------|------|
| Agent | 能围绕目标调用工具并持续行动的执行体 |
| Subagent | 主 agent 派出去的子任务执行者，返回摘要 |
| Handoff | 把后续处理权转交给另一个 agent |
| Workflow | 编排器，决定何时启动哪个 agent |
| Agent Teams | 多个独立会话之间的协作，成员可互相交流 |

### 非对称性：生成快、审查慢

> 机器可以在几分钟内生成几千行代码，人类却要花几小时判断是否真的符合系统意图。

"几乎对"的代码是最危险的状态——局部合理、整体失稳。

### 代码是负债，规格约束才是资产

**代码的三个负债属性**：
- 代码会腐烂
- 代码会隐藏意图
- 代码会制造审查负担

**规格约束的价值**：让模型升级变成可控的"再编译"

### AI 接管老代码库：五阶段方法论

| Phase | 行动 |
|-------|------|
| 0 | 只读接管，建立地图 |
| 1 | 建立事实基线（CONFIRMED/OBSERVED/INFERRED/UNCERTAIN/CONFLICTED） |
| 2 | 冻结隐性行为（golden master、snapshot、contract tests） |
| 3 | 沉淀约束文件（AGENTS.md、ARCHITECTURE.md、DOMAIN_MODEL.md） |
| 4 | 窄范围 Goal 执行 |
| 5 | 每次变更反向更新规格 |

### 未来架构文档：十类标准

1. SYSTEM_CHARTER：系统使命与非目标
2. DOMAIN_MODEL：领域模型与不变量
3. ARCHITECTURE.md：模块边界与依赖方向
4. API_CONTRACTS.md：接口契约
5. DATA_CONTRACTS.md：数据不变量
6. ADR：架构决策记录
7. TESTING.md：验证命令与覆盖边界
8. MIGRATION_PLAYBOOK.md：迁移策略
9. RISK_REGISTER.md：风险清单
10. AGENTS.md / CLAUDE.md：agent 操作手册

### Harness 六层

1. **文档层**：让 agent 读到正确上下文
2. **目标层**：把需求写成可执行合同
3. **测试层**：把信任改造成验证
4. **隔离层**：控制爆炸半径
5. **Hook/Guardrail 层**：让错误在行动前被拦截
6. **审查层**：从逐行 diff 审查转向风险审查

## Durable Takeaways

> 未来最强的人，不是写代码最快的人，而是最会定义目标、沉淀规格、设计约束、验证结果、治理 AI 生产系统的人。

> AI 不是组织解药，而是组织放大器。

> 代码可以被下一代模型重写，但系统为什么存在、什么不能破坏、怎样才算正确，这些问题仍然需要人类回答。

## Connections

- Related: [[agent-architecture]]
- Related: [[agent-harness-survey]]
- Related: [[claude-code-engineering-map]]
- Related: [[skill]]
- Related: [[vibe-coding-way]]

## Open Questions

- 如何在快速迭代中保持规格文档的同步更新？
- 规格约束的粒度如何平衡——太细增加维护成本，太粗失去约束力？

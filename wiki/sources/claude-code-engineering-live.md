---
type: source
status: active
created: 2026-05-31
updated: 2026-05-31
sources:
  - raw/sources/Claude+Code+工程化实战直播分享版.pdf
  - raw/extracted/pdf/claude-code-engineering-live.txt
---

# Claude Code 工程化实战直播分享版

## Summary

这是黄佳的 Claude Code 工程化实战直播分享 slides，提供一个从"工具使用者"到"Agent 构建者"的认知转变框架。核心观点：Claude Code 不只是工具，而是一个可编程、可扩展、可组合的 AI Agent 框架/平台。

Source: `raw/sources/Claude+Code+工程化实战直播分享版.pdf`

## Key Points

### 认知转变：从被动使用到主动驾驭

| 被动使用 | 主动驾驭 |
|----------|----------|
| 用户 → 输入问题 → Claude 回答 | 用户 → 配置 Agent → 自主工作 |
| 像用计算器：输入数字，得到结果 | 像编程序：设计好，自动运行 |
| 问什么答什么，用完即走 | 建立系统，持续产出价值 |
| 只能处理即时任务 | 可以处理复杂、长期任务 |
| 每次都要重复说明需求 | 一次配置，永久生效 |

### 四层架构

从下往上：基础能力 → 扩展能力 → 外部连接 → 编程控制

1. **基础层**：Memory 记忆系统（CLAUDE.md = "新员工手册"）
2. **扩展层**：四大核心组件
3. **连接层**：MCP 等外部连接
4. **编程层**：Headless、Agent SDK、Plugins

### 四大核心组件对比

| 组件 | 触发方式 | 决策权 | 确定性 | 典型用例 |
|------|----------|--------|--------|----------|
| Commands | 用户 /command | 人 | 100% | 统一 commit 格式 |
| Skills | 语义推理 | 模型 | 概率性 | 代码安全审查 |
| SubAgents | 用户或 Claude | 架构 | 可控 | 跑 500 行测试 |
| Hooks | 系统事件 | 系统 | 100% | 保存自动格式化 |

### Memory 记忆系统

- CLAUDE.md 每次对话自动加载
- 内容：项目技术栈、代码风格、重要规则、禁区
- 三级记忆层级：`~/.claude/CLAUDE.md` → `项目/CLAUDE.md` → `.claude/rules/*.md`

## Best Practices

1. **先跑起来，再优化**：从零配置 → Commands → Skills → SubAgents，逐步演进
2. **写好 CLAUDE.md**：最高杠杆投入，30 分钟写好项目规范，每次对话受益
3. **善用 SubAgents 隔离噪声**：高噪声任务用子代理，只把结论带回主对话
4. **用 Hooks 做安全兜底**：系统强制比 AI 判断更可靠
5. **组合使用而非单打独斗**：Commands + Skills + Hooks + MCP，组合威力大
6. **从小处着手，逐步扩展**：先一个 Command 解决痛点，验证后再扩展

## Durable Takeaways

- Claude Code 的定位是"平台"而非"工具"，关键在于从被动使用转向主动驾驭。
- 四大组件各有适用场景：Commands（确定性人工触发）、Skills（语义自动激活）、SubAgents（隔离高噪声任务）、Hooks（系统强制执行）。
- 最佳演进路径：零配置 → Commands → Skills → SubAgents，不要一开始追求完美架构。

## Connections

- Related: [[claude-code]]
- Related: [[skill]]
- Related: [[plugin]]
- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]

## Open Questions

- 直播中提到的"第五部分：生产化 — Headless、Agent SDK、Plugins"是否有详细资料？

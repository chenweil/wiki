---
type: source
status: active
created: 2026-05-31
updated: 2026-05-31
sources:
  - /Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/Agent Skill规范、构建与设计模式.md
---

# Obsidian Source: Agent Skill 规范、构建与设计模式

## Summary

这篇剪藏笔记系统整理了 Agent Skill 的规范格式、三层渐进式加载机制、模型驱动触发方式、Skill-Creator 构建方法论、Writing-Skills 的 TDD 式创建流程，以及 Google 总结的五种 Skill 设计模式。

Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/Agent Skill规范、构建与设计模式.md`

## Key Points

- 一个 Skill 的最小形态是 `skill-name/SKILL.md`，由 YAML frontmatter 和 Markdown 指令正文组成。
- `name` 和 `description` 是必填字段；`description` 是模型判断是否触发 Skill 的关键入口。
- 三层渐进式加载包括目录层、指令层、资源层：会话启动时只加载 `name + description`，触发后加载 `SKILL.md`，再按需读取 `scripts/`、`references/`、`assets/`。
- Skill-Creator 把 Skill 开发类比为机器学习工程：要有测试集、评估指标、A/B 对比、迭代优化和防过拟合意识。
- Skill-Creator 的评估链包括 Grader、Comparator、Analyzer 三类专业 Agent，但也带来 token 成本高、流程冗长、子任务数量多、学习曲线陡峭等问题。
- Writing-Skills 更强调 RED-GREEN-REFACTOR：先观察没有 Skill 时 Agent 如何失败，再写最小 Skill，最后针对新的合理化借口持续补洞。
- `description` 不应总结完整工作流，否则 Agent 可能只凭 description 走捷径，跳过完整 Skill 正文。
- 五种常见设计模式是 Tool Wrapper、Generator、Reviewer、Inversion、Pipeline。

## Durable Takeaways

- Skill 不是 Prompt，而是围绕任务、工具、流程和输出边界设计的结构化行为单元。
- 写 Skill 的优先级应是：触发条件清晰、正文简洁、资源按需加载、验证闭环明确。
- 对简单 Skill，完整 Skill-Creator 流程可能过重；对高价值、会长期复用的 Skill，评估和迭代流程才值得投入。
- 本 wiki 的未来 `llm-wiki-ingest` Skill 更像 Pipeline + Reviewer：按步骤导入资料，并在最后检查引用、索引和日志。

## Connections

- Related: [[skill]]
- Related: [[skill-development]]
- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]

## Open Questions

- 本 wiki 的 ingest 流程是否已经稳定到值得创建 `llm-wiki-ingest` Skill。
- 如果创建本地 Skill，应采用轻量 Writing-Skills/TDD 路线，还是完整 Skill-Creator 评估路线。


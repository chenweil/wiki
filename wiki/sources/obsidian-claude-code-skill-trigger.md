---
type: source
status: active
created: 2026-05-31
updated: 2026-06-18
sources:
  - kind: obsidian
    path: "Claude Code工程化实战-共26讲/09｜触类旁通：SKILL.md结构与触发机制-Claude Code 工程化实战-极客时间.md"
---

# Obsidian Source: SKILL.md 结构与触发机制

## Summary

这篇笔记从第一性原理解释 Skills：它不是简单文档，也不是普通工具，而是一种按需加载的可操作知识结构。它让 Agent 在有限上下文窗口里，只在需要时加载特定领域的规则、流程和输出约束。

Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/09｜触类旁通：SKILL.md结构与触发机制-Claude Code 工程化实战-极客时间.md`

## Key Points

- Agent 生态可拆成 Tools、SubAgents、Hooks、Skills 四类支柱：Tools 回答能做什么，SubAgents 回答谁来做，Hooks 回答什么时候检查，Skills 回答怎么做以及何时做。
- Skills 的核心价值是把组织 SOP、领域知识、执行步骤和输出格式封装成模型可语义触发的能力包。
- Skill 触发依赖模型对 `description` 的语义判断，而不是精确关键词匹配。
- 渐进式加载是 Skills 的关键设计：`SKILL.md` 应该像导航页，详细资料应拆到引用文档、示例或脚本中。
- Skills 可分为参考型和任务型。参考型适合自动触发，任务型因为可能有副作用，常配合 `disable-model-invocation: true` 只允许手动触发。

## Durable Takeaways

- 好的 Skill 不是“写更多说明”，而是把重复执行的判断、步骤、边界和输出格式结构化。
- `description` 是给模型看的触发器，需要写清楚使用场景，而不是写给人看的宣传文案。
- 当知识量变大时，应该采用“导航页 + 详情页”的渐进式披露结构，避免上下文被一次性塞满。

## Connections

- Related: [[skill]]
- Related: [[agent-architecture]]
- Related: [[plugin]]

## Open Questions

- 后续可以基于这篇笔记为本 wiki 设计一个 `llm-wiki-ingest` 本地 Skill。


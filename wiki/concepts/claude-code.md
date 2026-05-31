---
type: concept
status: active
created: 2026-05-31
updated: 2026-05-31
sources:
  - [[claude-code-from-beginner-to-master-v2]]
---

# Claude Code

## Summary

Claude Code 是一种终端原生的 Agent 式编程工作台。相较于 IDE 内嵌的代码补全或对话式改代码，它更强调独立执行工程循环：理解需求、读取项目、修改文件、运行命令、验证结果、管理 Git 和沉淀规则。

## Key Points

- 它的优势不只是“写代码”，而是把产品构建过程中的大量工程动作外包给 Agent。
- 显式规则文件是关键资产。Claude 生态中是 `CLAUDE.md`，这个 wiki 中对应的是 `AGENTS.md` 和 `schema/`。
- 扩展能力通常按梯度演进：先写项目规则，再沉淀 Skills，再用 Hooks 强制执行，再用 MCP 连接外部系统，最后用 Plugins 打包分发。
- 上下文管理是核心能力。不是给模型所有信息，而是给当前任务需要的信息。

## Working Implication For This Wiki

本 wiki 不应该一次性把所有 Obsidian 笔记塞进上下文，而应该像 Claude Code 项目规则一样，逐步沉淀：

1. 原始资料保持不变。
2. 每次只导入一个主题或少数资料。
3. 把稳定结论写到概念页和综合页。
4. 把规则变化写回 `AGENTS.md` 或 `schema/`。

## Connections

- Related: [[skill]]
- Related: [[plugin]]
- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]


---
type: concept
status: active
created: 2026-05-31
updated: 2026-05-31
sources:
  - [[obsidian-claude-code-skill-trigger]]
  - [[claude-code-from-beginner-to-master-v2]]
  - [[obsidian-claude-code-plugin-packaging]]
---

# Skill

## Summary

Skill 是一种可被语义触发、按需加载的能力包。它把领域知识、执行步骤、输出规范和约束条件组织成模型可以在合适时机调用的结构。

## Key Points

- Skill 不是普通文档。普通文档等待人阅读，Skill 则通过 `description` 让模型判断何时加载。
- Skill 不是工具。工具回答“能做什么”，Skill 回答“在这个任务里应该怎么做”。
- Skill 适合解决上下文稀释问题：只在需要时加载领域知识，而不是把所有规范常驻主上下文。
- 好的 Skill 通常采用“导航页 + 详情页”结构：`SKILL.md` 保持短小，复杂内容拆到引用文件、示例或脚本。
- 参考型 Skill 可以让模型自动触发；任务型 Skill 涉及副作用时更适合手动触发。

## Design Rules

- `description` 要写触发场景，不要写宣传语。
- 主文件要短，细节分层加载。
- 输出格式、检查点、失败条件要明确。
- 如果会部署、发消息、删改外部系统，应禁用自动触发或加权限控制。

## Working Implication For This Wiki

本 wiki 现在还不急着安装或创建 Skill。更稳的路径是先用 `AGENTS.md` 跑出稳定 ingest 流程，再把重复步骤沉淀为本地 Skill，例如：

- `llm-wiki-ingest`: 处理一个 Markdown/PDF source。
- `llm-wiki-lint`: 检查孤立页、缺来源、重复概念。
- `llm-wiki-query`: 先读索引，再检索 wiki，再必要时查 raw。

## Connections

- Related: [[claude-code]]
- Related: [[plugin]]
- Related: [[agent-architecture]]


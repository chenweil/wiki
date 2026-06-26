---
type: concept
status: active
created: 2026-05-31
updated: 2026-06-26
title: "Skill Development"
description: "把可重复领域知识、工作流程和输出边界沉淀为可触发、可测试、可迭代 Skill 的方法。"
tags:
  - skills
  - skill-development
  - ai-agents
sources:
  - kind: wiki-page
    page: obsidian-agent-skill-spec-build-patterns
  - kind: wiki-page
    page: obsidian-claude-code-skill-trigger
---

# Skill Development

## Summary

Skill development 是把重复的领域知识、工作流程、工具使用方式和输出边界，沉淀为可被 Agent 语义触发并按需加载的结构化能力。它不是单纯写 Prompt，而是设计一个可复用、可测试、可迭代的行为单元。

## Specification

| Part | Role |
| --- | --- |
| `name` | Skill 唯一标识，应与目录名一致，保持短小、稳定、可发现 |
| `description` | 触发条件，描述什么时候使用，而不是完整总结工作流 |
| Markdown body | 具体操作步骤、边界条件、输出格式、检查点 |
| `scripts/` | 可执行辅助脚本，适合重复出现的机械步骤 |
| `references/` | 按需加载的技术参考、清单、规则 |
| `assets/` | 模板、图片、数据、schema 等静态资源 |

## Progressive Loading

Skill 的核心工程价值来自三层渐进式加载：

1. L1 目录层：启动时只加载 `name + description`。
2. L2 指令层：任务匹配时读取完整 `SKILL.md`。
3. L3 资源层：正文需要时再读取脚本、参考资料或模板。

这意味着 Skill 主文件应该像导航页，而不是百科全书。长规范、示例和脚本应拆到资源文件中。

## Description Rules

- 描述触发条件，不要总结完整工作流。
- 聚焦用户意图，而不是内部实现。
- 包含用户可能使用的自然表达和关键任务词。
- 不要写成过宽泛的宣传语。
- 对操作型、有副作用的 Skill，要考虑手动触发或权限控制。

## Development Loops

| Method | Good for | Risk |
| --- | --- | --- |
| Skill-Creator | 高价值、长期复用、需要评估的 Skill | token 成本高、流程重、并发子任务多 |
| Writing-Skills / RED-GREEN-REFACTOR | 纪律型、流程型、希望轻量迭代的 Skill | 需要认真设计压力场景 |
| 手写最小 Skill | 简单规范、个人使用、快速验证 | 容易缺少测试和边界 |

## Design Patterns

| Pattern | Core idea | Use when |
| --- | --- | --- |
| Tool Wrapper | 主文件引导 Agent 加载专家资料或工具说明 | 封装技术栈规范、API、团队约定 |
| Generator | 模板 + 风格指南 + 缺失信息提问 | 生成结构一致的文档、报告、脚手架 |
| Reviewer | 检查清单和执行逻辑分离 | 代码审查、安全扫描、内容审查 |
| Inversion | Agent 先采访用户，收集完整需求 | 需求不明确、项目规划、架构设计 |
| Pipeline | 多步骤、检查点、不可跳步 | 文档生成、资料导入、发布流程 |

## Implication For This Wiki

未来的 `llm-wiki-ingest` Skill 不应该一开始就做成复杂评估系统。更稳的第一版是 Pipeline + Reviewer：

1. 读取 source。
2. 创建 source summary。
3. 更新相关 concept/synthesis。
4. 更新 `wiki/index.md`。
5. 追加 `wiki/log.md`。
6. Reviewer 阶段检查来源、链接、索引、重复概念。

当这个流程跑过多轮且稳定后，再考虑把常见检查写成脚本或独立参考文件。

## Connections

- Related: [[skill]]
- Related: [[agent-architecture]]
- Related: [[claude-code-engineering-map]]


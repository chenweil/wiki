---
type: synthesis
status: active
created: 2026-05-31
updated: 2026-05-31
sources:
  - [[claude-code-from-beginner-to-master-v2]]
  - [[obsidian-claude-code-skill-trigger]]
  - [[obsidian-claude-code-multi-agent-guide]]
  - [[obsidian-claude-code-plugin-packaging]]
  - [[obsidian-agent-skill-spec-build-patterns]]
---

# Claude Code Engineering Map

## Summary

Claude Code 工程化可以理解为一套从个人效率到团队能力分发的递进体系：先让 Agent 能稳定理解项目，再让它按需加载知识，然后用确定性自动化兜底，最后把稳定能力打包分发。

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

## Main Synthesis

这些资料共同指向一个工程原则：**先沉淀规则，再增加结构；先局部稳定，再抽象分发。**

对个人知识库也是同样逻辑。这个 `mywiki` 不应该一开始就安装一堆 Skill、MCP 或导入所有 Obsidian 笔记。更稳的做法是：

1. 先用 `AGENTS.md` 定义维护规则。
2. 选择一个主题做小批量 ingest。
3. 把 source summary、概念页、综合页跑通。
4. 等重复动作稳定，再设计本地 Skill。
5. 等多个知识库都需要同样能力，再考虑 Plugin。

新导入的 Skill 规范资料补充了一个更严格的判断：创建 Skill 之前，先区分它是 Tool Wrapper、Generator、Reviewer、Inversion 还是 Pipeline。对本 wiki 来说，ingest 更像 Pipeline + Reviewer，而 query 回写更像 Inversion + Generator。

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

- 这个 wiki 是否更偏“AI 工程学习库”，还是会覆盖生活、读书、健康、项目管理等全域个人知识？
- 如果覆盖全域知识，是否需要按主题设立多个 `overview` 或 map of content？
- `llm-wiki-ingest` 是否已经值得做成 Skill，还是继续手工运行 2-3 轮。

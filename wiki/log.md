# LLM Wiki Log

Append-only chronological record. Use entries like:

```markdown
## [YYYY-MM-DD] ingest | Source title

- Source: `path`
- Output pages: [[page]]
- Notes:
```

## [2026-05-31] setup | Initial wiki scaffold

- Source: user-provided Obsidian vault path and existing `raw/sources/` PDFs.
- Output pages: [[index]], [[overview]]
- Notes: Created the initial LLM Wiki structure. Obsidian vault is registered as read-only source material.

## [2026-05-31] ingest | Claude Code engineering first batch

- Source: `raw/sources/Claude Code从入门到精通-v2.0.0.pdf`
- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/09｜触类旁通：SKILL.md结构与触发机制-Claude Code 工程化实战-极客时间.md`
- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/04｜量体裁衣：从Sub-Agents到Multi-Agent的工程指南-Claude Code 工程化实战-极客时间.md`
- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/Claude Code工程化实战-共26讲/23｜化零为整：Plugins 插件打包与分发-Claude Code 工程化实战-极客时间.md`
- Output pages: [[claude-code-from-beginner-to-master-v2]], [[obsidian-claude-code-skill-trigger]], [[obsidian-claude-code-multi-agent-guide]], [[obsidian-claude-code-plugin-packaging]], [[claude-code]], [[skill]], [[plugin]], [[agent-architecture]], [[claude-code-engineering-map]]
- Notes: Completed the first scoped ingest pass. PDF text was extracted to `raw/extracted/pdf/claude-code-from-beginner-to-master-v2.0.0.txt`.

## [2026-05-31] ingest | Agent Skill specification and design patterns

- Source: `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note/收集内容/Agent Skill规范、构建与设计模式.md`
- Output pages: [[obsidian-agent-skill-spec-build-patterns]], [[skill-development]]
- Updated pages: [[skill]], [[agent-architecture]], [[claude-code-engineering-map]], [[index]]
- Notes: Added Skill specification details, progressive loading rules, Skill-Creator / Writing-Skills development loops, and five Skill design patterns.

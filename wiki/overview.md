# Overview

This wiki is intended to compile the user's collected notes, downloaded materials, PDFs, and durable conversations into an interlinked Markdown knowledge base.

## Current Shape

| Layer | Location | Maintainer |
| --- | --- | --- |
| Original Obsidian notes | External vault path | User |
| Downloaded raw materials | `raw/sources/` | User |
| Extracted text | `raw/extracted/` | Tooling / LLM |
| Maintained knowledge pages | `wiki/` | LLM, reviewed by user |
| Rules and templates | `AGENTS.md`, `schema/` | User and LLM |

## Initial Focus

The first useful domain appears to be AI engineering, Claude Code, agent workflows, skills, plugins, TDD, DevOps, and technical learning notes.

## First Compiled Domain

| Domain | Entry |
| --- | --- |
| Claude Code engineering | [[claude-code-engineering-map]] |
| Claude Code as workflow | [[claude-code]] |
| Skills | [[skill]] |
| Plugins | [[plugin]] |
| Agent architecture | [[agent-architecture]] |

## Open Decisions

| Decision | Current default |
| --- | --- |
| Whether to ingest all Obsidian notes | No; ingest by topic or folder first |
| Whether to copy Obsidian notes into this repo | No; read from the existing vault path |
| Whether to install a third-party LLM wiki skill | No; start with local rules and plain Markdown |
| Whether to add search tooling | Later; use `rg` and `wiki/index.md` first |

---
type: synthesis
status: active
created: 2026-05-31
updated: 2026-06-26
title: "MyWiki Overview"
description: "MyWiki 的总体结构说明，描述 raw、wiki、schema 与外部 Obsidian vault 的分层关系。"
tags:
  - mywiki
  - knowledge-base
  - llm-wiki
sources:
  - [[index]]
  - AGENTS.md
---

# Overview

This wiki is intended to compile the user's collected notes, downloaded materials, PDFs, and durable conversations into an interlinked Markdown knowledge base.

## Summary

MyWiki is a file-based, LLM-maintained Markdown knowledge layer. Raw materials stay in `raw/` or the external Obsidian vault, while durable summaries, concepts, and syntheses live under `wiki/`.

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

## Connections

- Related: [[index]]
- Related: [[log]]
- Related: [[claude-code-engineering-map]]

## Open Questions

- 是否需要把 `mywiki-query` 拆分为独立 query/lint Skills，应等更多维护循环稳定后再决定。

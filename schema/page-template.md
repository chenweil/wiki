# Page Template

Use this template for durable wiki pages.

```markdown
---
type: concept | source | person | book | project | question | synthesis
status: draft | active | needs-review
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources:
  - kind: local-raw | obsidian | ima-note | ima-media
    # kind-specific fields below
---

# Title

## Summary

Short explanation in Chinese.

## Key Points

- Point with source reference.

## Connections

- Related: [[other-page]]

## Open Questions

- Question to investigate later.
```

## `sources` Field Schema

The `sources` frontmatter field is a **list of structured objects**, not plain strings. Each object has a `kind` discriminator and kind-specific fields.

### `kind: local-raw`

A file inside this repository, typically in `raw/sources/`, `raw/inbox/`, or `raw/extracted/`.

```yaml
sources:
  - kind: local-raw
    path: raw/sources/胥克谦原创：开发前测试方法.pdf
  - kind: local-raw
    path: raw/extracted/pdf/some-pdf.md
```

Use this when the original file (or extracted text) lives inside the repo and is durable. Do not list transient files in `tmp/`.

### `kind: obsidian`

A note from the user's external Obsidian vault (read-only by default).

```yaml
sources:
  - kind: obsidian
    path: "收集内容/Some Note"
    vault: /Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note
```

`vault` defaults to the path in `AGENTS.md`; can be omitted when unambiguous.

### `kind: ima-note`

A note stored in Tencent IMA (online knowledge base). Used when the source is conversation-style or short text that does not warrant a repo commit.

```yaml
sources:
  - kind: ima-note
    note_id: "7465939918418409"
    url: https://ima.qq.com/note/7465939918418409   # optional, for clickable link
```

`url` is optional — include it when IMA exposes a stable share URL.

### `kind: ima-media`

A file (book, manuscript, large PDF) uploaded to an IMA Knowledge Base via `skills/vendor/ima/wrapper/upload.cjs`. **Use this when the file is too large or otherwise unsuitable for committing to Git.**

```yaml
sources:
  - kind: ima-media
    kb_id: "<knowledge_base_id>"
    media_id: "<media_id from upload.cjs output>"
    file_name: 大部头.pdf
    url: https://ima.qq.com/...   # optional
```

### Mixing kinds

A page may list multiple sources of different kinds:

```yaml
sources:
  - kind: local-raw
    path: raw/sources/original-course.pdf
  - kind: ima-note
    note_id: "12345"
  - kind: obsidian
    path: "Claude Code工程化实战/第3讲.md"
```

### Migration note

Older pages in `wiki/` still use the string form (e.g. `sources: ["IMA note_id: 7465939918418409"]`). When touching such a page, normalize its `sources` to the structured form.


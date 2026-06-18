# Citation Rules

## Source Priority

| Priority | Source |
| --- | --- |
| 1 | Local raw source files under `raw/` |
| 2 | Tencent IMA raw sources referenced as `kind: ima-note` or `kind: ima-media` |
| 3 | External Obsidian vault files |
| 4 | Existing source summaries under `wiki/sources/` |
| 5 | Existing synthesis pages under `wiki/` |

## Required Citation Style

Use file paths for local sources:

```markdown
Source: `/absolute/path/to/source.md`
Source: `raw/sources/example.pdf`
```

Use structured frontmatter for IMA sources:

```yaml
sources:
  - kind: ima-note
    note_id: "7465939918418409"
    url: https://ima.qq.com/note/7465939918418409
```

```yaml
sources:
  - kind: ima-media
    kb_id: "<knowledge_base_id>"
    media_id: "<media_id>"
    file_name: "large-source.pdf"
    url: https://ima.qq.com/...
```

Use wiki links for generated pages:

```markdown
See: [[concept-name]]
```

## Rules

- Do not invent citations.
- If a claim comes from synthesis rather than a direct source, say so.
- If source text is unavailable or extraction failed, mark the page as `needs-review`.
- If IMA upload or lookup failed, do not cite a guessed `media_id` or `note_id`.
- Prefer `kind: local-raw`, `kind: obsidian`, `kind: ima-note`, and `kind: ima-media` objects in frontmatter for all newly touched pages.
- Prefer concise quotes only when exact wording matters.

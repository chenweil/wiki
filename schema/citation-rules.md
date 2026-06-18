# Citation Rules

## Source Priority

| Priority | Source |
| --- | --- |
| 1 | Local raw source files under `raw/` |
| 2 | Tencent IMA raw sources referenced as `kind: ima-note` or `kind: ima-media` |
| 3 | Explicit external raw files referenced as `kind: external-raw` |
| 4 | External Obsidian vault files |
| 5 | Existing source summaries under `wiki/sources/`, referenced as `kind: wiki-page` |
| 6 | Existing synthesis pages under `wiki/`, referenced as `kind: wiki-page` |

## Required Citation Style

For knowledge pages, use structured frontmatter source objects. Operational pages such as `wiki/index.md`, `wiki/log.md`, and `wiki/overview.md` may keep plain project contract paths.

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

Use `kind: wiki-page` for internal wiki dependencies:

```yaml
sources:
  - kind: wiki-page
    page: claude-code-from-beginner-to-master-v2
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
- Use `kind: external-raw` only as a transitional state for source files outside this repository.
- Prefer `kind: local-raw`, `kind: external-raw`, `kind: obsidian`, `kind: ima-note`, `kind: ima-media`, and `kind: wiki-page` objects in frontmatter for all newly touched pages.
- Prefer concise quotes only when exact wording matters.

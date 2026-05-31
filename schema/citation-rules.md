# Citation Rules

## Source Priority

| Priority | Source |
| --- | --- |
| 1 | Raw source files under `raw/` |
| 2 | External Obsidian vault files |
| 3 | Existing source summaries under `wiki/sources/` |
| 4 | Existing synthesis pages under `wiki/` |

## Required Citation Style

Use file paths for local sources:

```markdown
Source: `/absolute/path/to/source.md`
Source: `raw/sources/example.pdf`
```

Use wiki links for generated pages:

```markdown
See: [[concept-name]]
```

## Rules

- Do not invent citations.
- If a claim comes from synthesis rather than a direct source, say so.
- If source text is unavailable or extraction failed, mark the page as `needs-review`.
- Prefer concise quotes only when exact wording matters.


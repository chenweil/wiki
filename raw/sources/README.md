# Raw Sources

`raw/sources/` stores source material that is small enough and useful enough to keep directly in Git.

## Storage Policy

| Source type | Default handling |
| --- | --- |
| Markdown, text, CSV, small structured files | Commit here |
| Small PDFs that should remain available offline | Commit here |
| Large PDFs, books, manuscripts, large DOCX/PPTX, course bundles | Upload to Tencent IMA Knowledge Base and cite as `kind: ima-media` |
| Temporary or unsorted material | Put in `raw/inbox/` first |

The current project policy treats binary files larger than about 5MB as IMA candidates. This threshold is intentionally conservative to keep GitHub pushes and clones fast.

## Large File Guard

Before committing new raw material, run:

```bash
node scripts/lint-raw-large-files.mjs
```

The check fails for new or untracked large binary files under `raw/sources/` and `raw/inbox/`. Existing tracked large files are warnings only; move them to IMA through an explicit cleanup plan.

For local staging that should not be committed, use ignored folders such as `raw/sources/_large/`, `raw/sources/_ima-upload/`, or `raw/inbox/_large/`.

## Existing Large Files

Some large files may already be tracked by Git. Do not remove them only because they exceed the threshold. If a tracked large file should move to IMA:

1. Upload the file to IMA first.
2. Update the related `wiki/sources/` summary to use `kind: ima-media`.
3. Confirm extracted text or a useful source summary remains in Git.
4. Remove the local binary in a separate, explicit cleanup commit.

Removing a tracked file does not shrink existing Git history. History cleanup is a separate repository maintenance task.

## IMA References

When a source is uploaded to IMA, do not commit the large binary here. Instead:

1. Register the source in `raw/ima/sources.yml`.
2. Keep extracted text under `raw/extracted/` when useful.
3. Create a source summary under `wiki/sources/`.
4. Use structured frontmatter:

```yaml
sources:
  - kind: ima-media
    kb_id: "<knowledge_base_id>"
    media_id: "<media_id>"
    file_name: "<original-file-name>"
    url: "<stable-url-if-available>"
```

This keeps the wiki traceable while avoiding Git history bloat.

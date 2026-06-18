# IMA Upload Wrapper (MyWiki)

`upload.cjs` 是 mywiki 项目封装的 **IMA Knowledge Base 单文件上传** thin wrapper。

## 目标

把 `skills/vendor/ima/knowledge-base/SKILL.md` 里 5 步流程（preflight → check_repeated → create_media → cos upload → add_knowledge）封装成一条命令，让 ingest skill / ingest workflow 通过命令行调用即可。

## 与 IMA 原生 skill 的关系

| 角色 | 实现位置 |
| --- | --- |
| 底层 API 客户端 | `../ima_api.cjs` |
| preflight 类型检查 | `../knowledge-base/scripts/preflight-check.cjs` |
| COS 上传实现 | `../knowledge-base/scripts/cos-upload.cjs` |
| 工作流封装（5 步编排） | `upload.cjs`（本文件） |

本 wrapper **不重复**实现上述能力，只负责编排与错误标准化。

## 不做的事（策略归调用方）

- **不判断文件大小是否该走 IMA** —— ">5MB 走 IMA" 这种策略放在 `skills/ingest/SKILL.md`。
- **不决定 kb_id** —— 由 `--kb-id` 或 `IMA_DEFAULT_KB_ID` 环境变量传入，wrapper 不做"猜哪个知识库"的逻辑。
- **不做语言层面的重命名/翻译** —— GATE 2 要求 `title === file_name`，wrapper 强制遵守。

## 用法

```bash
node upload.cjs --file /path/to/book.pdf --kb-id "<kb_id>"
node upload.cjs --file /path/to/book.pdf --on-repeated keep --timeout 600000
```

环境变量兜底：

```bash
export IMA_DEFAULT_KB_ID="<kb_id>"
node upload.cjs --file /path/to/book.pdf   # 不需要 --kb-id
```

## 退出码与输出

| 退出码 | 含义 |
| --- | --- |
| `0` | 成功，stdout 是结果 JSON |
| `1` | 业务失败，stderr 是错误 JSON（含 `step` 字段） |
| `2` | 使用错误（参数缺失或非法） |

**stdout（成功）**：
```json
{
  "ok": true,
  "media_id": "...",
  "kb_id": "...",
  "file_name": "...",
  "file_size": 12345,
  "media_type": 1,
  "content_type": "application/pdf",
  "title": "...",
  "url": "https://..."
}
```

**stderr（失败）**：
```json
{
  "ok": false,
  "step": "preflight|check_repeated|create_media|cos_upload|add_knowledge|config",
  "code": -100,
  "msg": "..."
}
```

`step` 让调用方能精准定位失败位置，便于上层报告或重试策略。

## 安全门（来自 IMA 原生 skill，未弱化）

| Gate | 行为 |
| --- | --- |
| GATE 1 类型/大小 | preflight 不通过 → wrapper 不进入 create_media |
| GATE 2 命名 | `title` 默认等于 `file_name`；`--title` 显式覆盖时也由调用方负责合规 |
| GATE 3 重名 | `is_repeated=true` → 默认 `cancel`（拒绝上传）；`--on-repeated keep` 时追加 `_YYYYMMDDHHmmss` |
| GATE 4 COS 失败 | cos-upload 非零退出 → **不调用 add_knowledge**，直接 die |
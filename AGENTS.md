# LLM Wiki Operating Rules

## 基本规则

- 用中文回复
- 大规模操作前先给出简短计划
- 优先使用简单文件工作流，避免过度工程化
- 不修改用户 Obsidian 库（除非明确要求）
- 不修改 `raw/` 下文件（除非任务是整理原始材料）

## 目录结构

| 目录 | 用途 | 权限 |
| --- | --- | --- |
| `wiki/` | LLM 维护的知识库 | 可读写 |
| `raw/sources/` | 下载的源文件 | 只读 |
| `raw/inbox/` | 待处理的临时材料 | 可写入 |
| `raw/ima/` | IMA 外部来源台账 | 可读写 |
| `raw/extracted/pdf/` | 提取的 PDF 文本 | 可重新生成 |
| `skills/` | 本地 Skill 源文件 | 版本控制 |
| `skills/vendor/` | 第三方 Skill 依赖 | 只读，项目改动放 wrapper |
| Obsidian | `/Users/chenweilong/Library/Mobile Documents/iCloud~md~obsidian/Documents/note` | 只读 |
| IMA | ima.qq.com（大文件） | 外部引用 |

## 核心原则

1. **原始材料是真相来源**：`raw/` 和 Obsidian 是原材料，`wiki/` 是 LLM 维护的知识层
2. **不搬运大文档**：在 `wiki/` 中创建精简摘要，链接回原始来源
3. **引用优先**：每个论断尽可能指向源文件
4. **外部来源要登记**：使用 IMA note/media 时，同步记录到 `raw/ima/sources.yml`

## 操作流程

**回答知识问题**：读 `wiki/index.md` → 搜索 `wiki/` → 必要时查 `raw/` → 引用来源

**摄入新来源**：识别类型 → 保留原文件 → 创建 `wiki/sources/` 摘要 → 更新相关页面 → 更新 `index.md` 和 `log.md`

## 页面质量

- 短页面优于长文档，多用链接
- 新材料与旧内容冲突时，记录矛盾而非静默替换
- 使用 `[[wikilinks]]` 链接内部概念
- 避免伪造数据和虚假引用

## 维护检查

- `wiki/index.md` 中缺失链接的孤儿页面
- 缺少独立页面的重复概念
- 无来源引用的论断
- 被新来源证伪的过时摘要
- 缺少提取文本或摘要的 PDF
- 新增大二进制原始材料：提交前运行 `node scripts/lint-raw-large-files.mjs`
- IMA 来源台账一致性：提交前运行 `node scripts/ima-manifest.mjs lint`
- `skills/vendor/` 不能有本地改动：提交前运行 `node scripts/lint-vendor-clean.mjs`

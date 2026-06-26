---
type: source
status: active
created: 2026-05-31
updated: 2026-06-26
title: "使用 Claude Skills 自动化代码审查完整指南"
description: "关于用 Claude Skills 沉淀代码审查规则并自动化审查流程的实战资料摘要。"
tags:
  - claude-skills
  - code-review
  - automation
sources:
  - kind: local-raw
    path: "raw/sources/使用Claude_Skills自动化代码审查完整指南.md.pdf"
  - kind: local-raw
    path: "raw/extracted/pdf/claude-skills-code-review.txt"
---

# 使用 Claude Skills 自动化代码审查完整指南

## Summary

这是一篇实战经验分享文章，作者讲述如何用 Claude Skills 自动化代码审查，一周节省约 10 小时。核心观点：Skills 让 AI 记住审查规则，一次配置永久生效，而且比静态分析工具更灵活。

Source: `raw/sources/使用Claude_Skills自动化代码审查完整指南.md.pdf`

## Key Points

### 为什么选择 Claude Skills

- 传统静态分析工具（ESLint、SonarQube）只能检查写死的规则，添加新规则需要写插件、全员升级配置
- Claude Skills 理解代码上下文，能做更灵活的判断，用自然语言配置

### 5 分钟快速上手

1. **开启功能**：Settings → Features → Agent Skills
2. **创建 Skill**：直接问 Claude "帮我创建一个代码审查的 Skill"
3. **写审查规则**：告诉 Claude 具体怎么审查（快速扫描 → 认真看 → 给报告）
4. **测试**：在真实项目里试用，根据结果调整规则

### 审查规则示例结构

- **第一遍快速扫描**：PR 行数、提交信息、改的模块
- **第二遍认真看**：逻辑、安全问题、代码质量
- **最后给报告**：严重问题、建议改进、写得好的地方

### 真实效果

| 指标 | 使用前 | 使用后 |
|------|--------|--------|
| 每个 PR 审查时间 | 40-50 分钟 | 15-20 分钟 |
| 每周节省时间 | - | ~10 小时 |

### 实用技巧

1. **针对不同语言创建不同 Skill**：python-review、react-review、api-review
2. **集成到 CI/CD**：PR 提交后 AI 先审查，没问题才通知人工
3. **团队共享 Skills**：放到 Git 仓库，新人入职第一天就能用

### 局限性

- 有时太严格（原型代码也要求完整错误处理）
- 不懂业务逻辑（需要把业务规则写进 references）
- 偶尔误报（需要人工判断）

## Durable Takeaways

- Skills 的核心价值是"一次配置，永久生效"，不用每次重复说明
- 最佳用法：AI 做初筛，人做决策。像有个实习生先看一遍，最终决定还是人做
- 静态分析工具解决"规则明确的问题"，Skills 解决"需要上下文判断的问题"

## Connections

- Related: [[skill]]
- Related: [[skill-development]]
- Related: [[claude-code]]
- Related: [[claude-code-engineering-map]]

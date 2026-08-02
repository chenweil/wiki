# Knowledge Map UI Prototype

这是一个明确标记为 throwaway 的本地 UI 原型，用来验证 MyWiki 的核心导航场景：从一个已知页面发现相关页面、查看关系依据，并打开 Wiki 页面。

运行：

```bash
python3 -m http.server 8787
```

打开 `http://127.0.0.1:8787/prototype/knowledge-map/?variant=B`。B（List-first Navigator）是当前选定的首选结构；通过 URL 的 `?variant=A`、`?variant=B`、`?variant=C` 仍可切换三个对照版本，底部切换条也支持左右方向键。

原型使用当前 AI 工程主题的少量真实 Wiki 页面作为 fixture。它不生成 embedding、不写入 Wiki、不接入 Hermes Studio，也不代表最终实现。

当前验证重点是导航结构和信息层级；真实 embedding、2D/3D 投影、派生 artifact 格式和生成脚本仍属于后续技术决策。

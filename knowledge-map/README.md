# MyWiki Knowledge Map

这是 T01/T02/T03/T04 的本地只读实现：从维护中的 AI 工程 Wiki 页面生成版本化 `MapSnapshot`，并通过 B · List-first Navigator 导航。快照同时包含显式页面链接图和本地确定性的语义探索图；查看器在同一个不可变快照上按 seed、层、depth、关系预算和 filters 请求有边界的子图。

默认语义层使用 `deterministic-token-hash` embedding 和固定 seed 的 2D projection。语义关系是推断提示，不是 Wiki 事实；每个节点默认最多保留 3 条语义关系。语义计算失败的节点仍保留在列表和详情中，标记为 `unlocated`，不伪造坐标。没有远程 embedding 默认路径，远程 backend 必须显式 opt-in。

生成地图：

```bash
node knowledge-map/generate.mjs
```

生成结果位于 `knowledge-map/dist/`。从仓库根目录启动静态 HTTP 服务后打开：

```bash
python3 -m http.server 8787
```

浏览器地址：`http://127.0.0.1:8787/knowledge-map/dist/`

测试：

```bash
node --test knowledge-map/tests/*.test.mjs
```

地图是只读的。生成过程不扫描 `raw/`、Obsidian 或 IMA，也不接入 Hermes Studio。显式页面链接和语义探索可以在查看器左侧独立切换，详情会显示语义关系的 basis、backend 和版本信息。

T03 的初始查询默认从 `claude-code-engineering-map` 展开 1 层，用户可以使用“展开到下一层”或“增加关系预算”。查询结果显示 `snapshotVersion`、depth、budget、omitted counts 和 partial/complete 状态；展开使用内存中的快照，不重新加载整张地图。

T04 为节点、显式关系、语义关系、manifest 和子图结果补充结构化 provenance：详情可以回溯 Wiki 页面身份、内容 hash、声明字段、embedding/projection 配置、查询范围和生成快照。B Navigator 默认使用“聚焦模式”保留 bounded subgraph 上下文，也可以切换“严格隐藏”；搜索、列表、地图、详情、关系层筛选和键盘方向键共享同一选择状态。整个 viewer 仍然只读，不写入 Wiki、`raw/`、来源台账、Obsidian 或 IMA。

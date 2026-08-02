# MyWiki Knowledge Map

这是第一个生产方向的 T01 实现：从维护中的 AI 工程 Wiki 页面生成版本化 `MapSnapshot`，并通过 B · List-first Navigator 做只读导航。它只使用显式页面链接关系；语义探索图和渐进式子图展开属于后续 tickets。

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

地图是只读的。生成过程不扫描 `raw/`、Obsidian 或 IMA，也不接入 Hermes Studio。

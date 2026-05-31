# Vibe Coding 之道

## ChaoGeek · 2026

---

## 01 开篇：为什么写这本书

Vibe Coding 是什么？

这是 OpenAI 创始成员 Andrej Karpathy 给出的定义："完全屈服于氛围，拥抱指数级增长，忘记代码的存在。"

翻译成人话就是：你不需要审查 AI 写的每一行代码，不需要理解每一行代码的实现细节，遇到错误就把错误信息复制粘贴给 AI，让它自己修，通常就能修好。

**Vibe Coding 是一次解放。**

在 Karpathy 提出这个概念之前，大多数开发者对 AI 编程抱着怀疑态度——能写 Hello World 但写不了生产代码。Vibe Coding 打破了这个心理障碍，教会所有人一件事：**信任模型的智能**。

但这本书不是教你如何 Vibe Coding。相反，这本书是关于 Vibe Coding 的缺陷、局限，以及如何从 Vibe Coding 演进到更成熟的 Agentic 模式。

---

## 02 认知：什么是 Agent

### AI 的四种形态

从产品形态看，AI 可以分成四类：

1. **Chat + AI**：你问我答，比如 ChatGPT 网页版。这是最基础的形态。
2. **IDE + AI**：AI 嵌入到开发环境里，比如 Cursor、Copilot。AI 能看到你的代码，能帮你改代码。
3. **Agent**：AI 有了"手"和"脚"，能自己跑命令、操作文件、执行测试。你给它一个目标，它自己规划步骤、自己执行。
4. **Multi-Agent**：多个 Agent 协作，每个 Agent 有自己的专长和职责，像一个小团队。

**Agent 和普通 AI 的核心区别**：Agent 能自己行动，不需要你一步步告诉它怎么做。

### Agent 的核心能力

Agent 需要具备三个核心能力：

- **感知**：理解环境、读取文件、分析代码
- **决策**：规划步骤、判断下一步、处理异常
- **行动**：执行命令、修改文件、运行测试

Agent 的价值在于：把人从执行链里解放出来。人只需要在关键决策点介入，剩下的交给 Agent。

---

## 03 实战：从 Vibe Coding 到 Agent

### 第一步：选择合适的工具

不同场景适合不同的工具：

- **快速原型**：Claude Code、Cursor、Vibe Coding
- **长期项目**：需要 Agent + 记忆系统
- **团队协作**：需要 Multi-Agent + 规范

### 第二步：建立记忆系统

Agent 如果没有记忆，每次对话都从零开始，那它永远不会变聪明。

记忆系统需要解决三个问题：

1. **短期记忆**：当前对话的上下文
2. **长期记忆**：跨会话的知识积累
3. **程序性记忆**：如何做某类任务的方法论

### 第三步：设计工作流

好的工作流不是"你告诉我做什么，我一步一步执行"，而是：

1. **Explore**：AI 探索，给你选项
2. **你选方向**
3. **Brainstorm**：你和 AI 共创方案
4. **你审方案**
5. **Execute**：AI 自主执行
6. **Verify**：AI 自我验证
7. **Learn**：系统自动积累经验

人只出现在两个点：**选方向**和**审方案**。其余全交给 AI。

---

## 04 案例：Windows 95 游戏机项目

这是一个真实的项目：用 Vibe Coding + Agent 方式，从零开始做一个 Windows 95 风格的个人网站。

项目特点：

- **技术栈不确定**：可以用 React，也可以用 Vue
- **设计风格明确**：Windows 95 复古风
- **功能边界模糊**：边做边发现

这个项目展示了如何用 Agent 方式推进一个探索性项目。

**关键经验**：

- 先让 AI 探索可能性，再锁定方向
- 用 OpenSpec 的 Proposal → Apply 流程管理变更
- 每次变更都让 AI 自己跑测试验证

---

## 05 进阶：AI 时代的新技能

### 新技能 1：提问能力

AI 时代最稀缺的能力不是写代码，而是**问对问题**。

好的问题比好的指令更有价值。一个好的问题能让 AI 探索出你没想到的可能性。

### 新技能 2：判断能力

当 AI 给出多个方案时，你需要判断哪个更好。这需要：

- 理解技术本质
- 知道什么是"好的"
- 有自己的品味和判断力

### 新技能 3：元认知

元认知是"对思考的思考"。在 AI 时代，你需要：

- 知道什么时候该信任 AI
- 知道什么时候该介入
- 知道什么时候该推翻重来

---

## 06 结语：从 Vibe Coding 到 Context 复利

Vibe Coding 是起点，不是终点。

它教会了我们信任 AI 的能力，但它没有解决"如何让 AI 越用越聪明"的问题。

答案在于 **Context 复利**：

- 每次对话都积累经验
- 每次踩坑都变成规则
- 每次成功都沉淀为 Skill

当你的 Context 越来越深，AI 就越来越懂你。这才是 Agent 时代的真正红利。

---

## 关键洞见

> 瓶颈从来不是模型的智能。瓶颈是模型是否理解你的 schema。

> Every skill you write is a permanent upgrade. It never degrades. It never forgets. And when the next model drops, every skill instantly gets better.

> 不是造更聪明的 AI，而是养更深的 Context。

---

## 连接

- Related: [[skill]]
- Related: [[agent-architecture]]
- Related: [[hermes-agent-mastery]]
- Related: [[claude-code-engineering-map]]

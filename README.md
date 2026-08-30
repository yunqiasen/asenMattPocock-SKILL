# asenMattPocock Skills

基于 [`mattpocock/skills`](https://github.com/mattpocock/skills) 的二开 Skill 仓库，只维护本项目需要的 15 个 AI Agent Skill。

## 快速开始（不需要 clone，不需要初始化）

一条命令装好，直接开工。**没有任何项目初始化步骤。**

```bash
ASEN="npx -y github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork"
TARGET="/你的项目路径"

$ASEN install --project "$TARGET" --agent codex --workflow standard
```

装完在客户端里启动入口 Skill，一条龙走完：对齐需求 -> 写规格 -> 拆 Ticket -> 实现 -> 审查。

| 客户端 | 启动方式 |
|---|---|
| Codex | `$grill-with-docs`，或先输入 `/skills` 再选 |
| Claude Code | `/grill-with-docs` |

Skill 自己决定规格和 Ticket 写在哪里，不需要你预先配置：

| 情况 | 落地位置 |
|---|---|
| 仓库有 GitHub remote 且 `gh` 已登录 | GitHub Issues |
| 其他情况 | `.scratch/<feature-slug>/` |

前提条件：

| 条件 | 说明 |
|---|---|
| Node.js >= 18 | `npx` 随 npm 提供 |
| 能访问 GitHub | 拉取 `MattPocock-Fork` 分支 |
| 仓库为 public | 无需配置 token |

什么时候才需要 clone 本仓库：

| 你要做的事 | 需要 clone 吗 |
|---|---|
| 给项目安装 Skill | 不需要 |
| 查看有哪些 Skill 和工作流 | 不需要，用 `$ASEN install --list` |
| 修改 Skill 内容、调整工作流、同步上游 | 需要，见[二开本仓库时才需要 clone](#6-二开本仓库时才需要-clone) |

## 项目定位

```text
upstream/main (mattpocock/skills)
        ↓ 只做快进同步
main    上游镜像分支，不做二开
        ↓ 逐个检查保留的 15 个 Skill，选择性移植
MattPocock-Fork 二开分支，日常开发分支，也是安装源
```

- `main`：只跟踪和更新上游，不写二开代码
- `MattPocock-Fork`：保存本项目删减、工作流编排和 Skill 微调
- 禁止把整个 `main` 直接合并进 `MattPocock-Fork`
- 上游更新后，只检查本项目保留的 15 个 Skill；逐个决定是否移植
- 上游新增或删除 Skill，不自动改变本项目的 15 个 Skill 清单

当前上游审查基线：`5b15a47`，审查日期：`2026-08-24`。该基线表示上游内容已检查到此提交，不表示所有上游实现都已复制到 `MattPocock-Fork`。

## 安装

安装 Skill 时确定三件事：

1. **客户端**：`codex` 或 `claude-code`
2. **作用域**：项目级或全局
3. **工作流**：只安装这条工作流需要的 Skill，不默认安装全部 15 个

两种调用方式，选一个：

| 方式 | 命令前缀 | 是否需要 clone | 适用 |
|---|---|---|---|
| **npx 直跑（推荐）** | `npx -y github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork` | 不需要 | 日常使用，npx 自动拉取并缓存分支 |
| 本地 clone | `./scripts/install-skills.sh` | 需要 | 只在二开本仓库时用 |

下文统一用一个变量简化命令：

```bash
ASEN="npx -y github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork"
```

npx 会把该分支缓存在本机 npm 缓存里。分支更新后想强制拉最新内容，清 npx 缓存再跑（新版 npm 已移除 `--ignore-existing`）：

```bash
npm cache clean --force
$ASEN install --list-workflows
```

也可以钉死到某个 commit，避免缓存歧义：

```bash
npx -y "github:yunqiasen/asenMattPocock-SKILL#<commit-sha>" install --list-workflows
```

### 1. 按工作流安装（项目级）

项目级安装只对目标项目生效。命令从任意目录运行都可以，`--project` 指向真正开发的项目。

```bash
TARGET="/你的项目路径"

# Codex
$ASEN install --project "$TARGET" --agent codex --workflow standard

# Claude Code
$ASEN install --project "$TARGET" --agent claude-code --workflow standard

# 两个客户端一起装
$ASEN install --project "$TARGET" --agent codex --agent claude-code --workflow standard
```

安装位置：

```text
Claude Code：目标项目/.claude/skills/<skill-name>/
Codex：      目标项目/.agents/skills/<skill-name>/
锁定文件：   目标项目/skills-lock.json
```

### 2. 全局安装

全局安装对当前用户所有项目生效，不写入当前项目目录。

```bash
$ASEN install --global --agent codex --workflow simple
$ASEN install --global --agent claude-code --workflow simple
```

安装位置：

```text
Claude Code：~/.claude/skills/<skill-name>/
Codex：      ~/.agents/skills/<skill-name>/
```

Codex 用户级 Skill 目录是 `~/.agents/skills`，不是 `~/.codex/skills`。

### 3. 六条工作流的安装闭包

推荐按工作流安装，不要直接装全部 15 个。安装器按 [`skills/manifest.json`](skills/manifest.json) 展开两类 Skill：

| 类别 | 含义 | 默认是否安装 |
|---|---|---|
| 入口 + 必需依赖 | 工作流运行时会被 `Call the Skill tool with "name"` 显式调用的 Skill，递归展开 | 是 |
| 捆绑 Skill | 工作流不调用，但同场景常用的辅助 Skill（目前只有 `ask-matt` 路由器） | 是，`--no-ask-matt` 可关 |

客户端会常驻已安装 Skill 的名称和描述，完整 `SKILL.md` 在触发后才加载。按工作流安装主要减少常驻元数据、Skill 选择噪音和后续正文加载范围。

| 使用场景 | 命令核心参数 | 数量 | 安装的 Skill |
|---|---|---:|---|
| 简单任务 | `--workflow simple` | 6 | `grilling`、`tdd`、`code-review`、`codebase-design`、`prototype`、`ask-matt` |
| 标准开发 | `--workflow standard` | 11 | `grill-with-docs`、`grilling`、`domain-modeling`、`to-spec`、`to-tickets`、`implement`、`tdd`、`code-review`、`codebase-design`、`prototype`、`ask-matt` |
| 模糊大任务 | `--workflow wayfinder` | 12 | `wayfinder`、`grilling`、`domain-modeling`、`research`、`prototype`、`codebase-design`、`to-spec`、`to-tickets`、`implement`、`tdd`、`code-review`、`ask-matt` |
| 架构改进 | `--workflow architecture` | 11 | `improve-codebase-architecture`、`codebase-design`、`prototype`、`grilling`、`domain-modeling`、`to-spec`、`to-tickets`、`implement`、`tdd`、`code-review`、`ask-matt` |
| Bug 调试 | `--workflow bug` | 2 | `diagnosing-bugs`、`code-review` |
| 研究后开发 | `--workflow research` | 11 | `research`、`grill-with-docs`、`grilling`、`domain-modeling`、`to-spec`、`to-tickets`、`implement`、`tdd`、`code-review`、`codebase-design`、`prototype` |
| 全量安装 | `--all` | 15 | 全部 15 个 Skill |

多条工作流可以一次装，安装器自动去重：

```bash
$ASEN install --project "$TARGET" --agent codex \
  --workflow standard --workflow wayfinder --workflow bug --workflow architecture
```

这四条并集正好是 15 个，也就是除 Bug 调试外的所有 Skill。

#### 为什么 `prototype` 和 `codebase-design` 是必需的

两者都被显式调用，属于运行时硬依赖：

| 调用方 | 被调用 | 触发条件 |
|---|---|---|
| `wayfinder` | `prototype`、`research` | 产生 `wayfinder:prototype` 或 `wayfinder:research` 类型的 decision Ticket 时 |
| `codebase-design` | `prototype` | UI 方案不明确，需要对比多个可运行方案时 |
| `tdd` | `codebase-design` | 模块深度、Seam 位置或接口形状本身存在疑问时 |
| `improve-codebase-architecture` | `codebase-design` | 全程使用其架构术语和 design-it-twice 模式 |

因为 `tdd` 出现在除 Bug 调试外的每条工作流里，`codebase-design` 和 `prototype` 也就随之进入这些工作流的必需闭包。漏装会导致运行到一半找不到 Skill。

#### `ask-matt` 的捆绑规则

`ask-matt` 是路由器，任何工作流内部都不会调用它，但用户选不准入口时需要它。因此它按**捆绑**方式安装，不写进运行时依赖：

| 工作流 | 是否捆绑 `ask-matt` | 原因 |
|---|---|---|
| 简单任务 | 是 | 判断该走最小流程还是标准流程 |
| 标准开发 | 是 | 判断该走标准流程还是先探索 |
| 模糊大任务 | 是 | 判断该建地图还是直接写规格 |
| 架构改进 | 是 | 判断该扫架构还是走标准开发 |
| Bug 调试 | 否 | 入口唯一，没有可路由的分支 |
| 研究后开发 | 否 | 入口唯一，`research` 之后路径已固定 |

不需要路由器时关掉：

```bash
$ASEN install --project "$TARGET" --agent codex --workflow standard --no-ask-matt
```

#### 校验闭包

```bash
$ASEN install --list-workflows   # 每条工作流的完整闭包和数量
$ASEN install --list             # 15 个 Skill 的调用模式和依赖
$ASEN check                      # 校验 manifest 与每个 SKILL.md 的真实调用是否一致
```

`check` 会逐个比对 `SKILL.md` 里的 `Call the Skill tool with "name"` 与 `manifest.json` 的 `dependsOn`，同时检查调用模式在 `SKILL.md` 和 `agents/openai.yaml` 之间是否一致。修改任何 Skill 的内部调用后都应先跑它。

正式安装前会打印 `Installing: ...` 和 `Bundled skills included: ...`，便于确认没有多装或漏装。

### 4. 单独安装某个 Skill

```bash
$ASEN install --project "$TARGET" --agent codex --skill diagnosing-bugs
```

安装器仍会自动补齐该 Skill 的必需依赖。

### 5. 直接用底层 npx skills（不经本仓库解析）

`npx skills@latest` 是上游通用安装器，没有本仓库的 `--workflow` 解析能力，必须手写每个 `--skill`；项目级安装还必须先 `cd` 进目标项目，因为它没有指定目标目录的参数。

```bash
cd "/你的项目路径"

npx skills@latest add \
  "https://github.com/yunqiasen/asenMattPocock-SKILL.git#MattPocock-Fork" \
  --agent codex \
  --skill grilling \
  --skill tdd \
  --skill code-review \
  --copy \
  --yes
```

要自动展开工作流闭包，用 `$ASEN install --workflow <name>`。

### 6. 二开本仓库时才需要 clone

只有以下情况需要本地副本：修改 Skill 正文、调整工作流编排、同步上游、改安装脚本。日常给项目 `install` 不需要。

```bash
cd "/Users/yunqiroot/Documents/ChatGPT/Agent-项目"
git clone git@github.com:yunqiasen/asenMattPocock-SKILL.git
cd asenMattPocock-SKILL
git switch MattPocock-Fork
git remote add upstream git@github.com:mattpocock/skills.git
```

`upstream` 已存在时不要重复添加，先 `git remote -v` 确认。clone 之后可以直接调脚本：

```bash
./scripts/install-skills.sh --project "$TARGET" --agent codex --workflow standard
./scripts/check-manifest.mjs
```

### 7. 卸载

`npx skills remove` 在实测中会打印成功但不真正删除文件。手动删更可靠：

```bash
cd "/你的项目路径"
mv .agents/skills /tmp/skills-backup-$(date +%s)
mv skills-lock.json /tmp/
```

Claude Code 对应目录是 `.claude/skills`。

## 六条工作流

流程中的括号表示“这个 Skill 内部调用了谁”；箭头表示运行顺序；“确认门”表示必须等待用户明确确认，不能自动跳过。

| # | 工作流 | 适用场景 | 详细运行流程（括号为内部调用） | 最终结果 |
|---|---|---|---|---|
| 1 | **简单任务** | 改文案、调样式、小功能、简单修复、普通文档或规划 | ① `grilling`<br>② 【确认门】用户确认需求<br>③ Agent 执行<br>④ 代码任务：`tdd`（`grilling` 顶层内部调用）<br>⑤ `code-review`（`tdd` 内部调用）<br>非代码任务：第③步输出结果后结束 | 代码变更完成并审查；非代码任务直接交付 |
| 2 | **标准开发** | 需求明确，需要正式规格、任务拆分和完整实现 | ① `grill-with-docs`（内部调用：`grilling` + `domain-modeling`）<br>② 【确认门】确认对齐结果<br>③ `to-spec`（`grill-with-docs` 内部调用）<br>④ 【确认门】确认 spec<br>⑤ `to-tickets`（`to-spec` 内部调用）<br>⑥ 【确认门】确认 frontier Ticket<br>⑦ `implement`（`to-tickets` 内部调用）<br>⑧ `tdd`（`implement` 内部调用，跳过 TDD 自己的审查步骤）<br>⑨ `code-review`（`implement` 内部调用） | 一个已批准 Ticket 完成 TDD、检查和一次最终审查 |
| 3 | **模糊大任务** | 目标模糊、未知项很多，需要先探索再决定 | ① `wayfinder`（内部调用：`grilling` + `domain-modeling`）<br>② 创建并解决 decision Tickets（按 Ticket 内部调用：`research` / `prototype` / `grilling` / `domain-modeling`）<br>③ 【确认门】地图完成，确认交接<br>④ `to-spec`（`wayfinder` 内部调用）<br>⑤ 【确认门】确认 spec<br>⑥ `to-tickets`（`to-spec` 内部调用）<br>⑦ 【确认门】确认 frontier Ticket<br>⑧ `implement`（`to-tickets` 内部调用）<br>⑨ `tdd`（`implement` 内部调用）<br>⑩ `code-review`（`implement` 内部调用） | 先完成调查和决策，再进入正式开发；Wayfinder 不实现业务 Ticket |
| 4 | **架构改进** | 扫描代码坏味道、寻找 Deep Module 和系统性重构机会 | ① `improve-codebase-architecture`（内部调用：`codebase-design`）<br>② 扫描代码库并生成 HTML 报告<br>③ 用户选择候选<br>④ `grilling` + `domain-modeling`（架构 Skill 内部调用）<br>⑤ 【确认门】确认重构决策<br>⑥ `to-spec`（架构 Skill 内部调用）<br>⑦ 【确认门】确认 spec<br>⑧ `to-tickets`（`to-spec` 内部调用）<br>⑨ 【确认门】确认 frontier Ticket<br>⑩ `implement`（`to-tickets` 内部调用）<br>⑪ `tdd`（`implement` 内部调用）<br>⑫ `code-review`（`implement` 内部调用） | 重构决策经过规格和 Ticket 确认后实施；不能从架构报告直接进入 `implement` |
| 5 | **Bug 调试** | 顽固 Bug、修 A 坏 B、根因不清楚 | ① `diagnosing-bugs`<br>② 复现 → 最小化 → 验证假设 → 修复 → 回归测试<br>③ 【确认门】用户确认进入审查<br>④ `code-review`（`diagnosing-bugs` 内部调用）<br>⑤ 修复有效审查意见<br>⑥ 提交 | 修复完成、回归测试通过、审查一次后提交 |
| 6 | **研究后开发** | 技术、库、SDK 或方案不熟悉，需要先查清楚再开发 | ① `research` → 生成 `research/*.md`<br>② **停止并提示用户手动启动** `grill-with-docs`（不是 `research` 内部调用）<br>③ `grill-with-docs`（内部调用：`grilling` + `domain-modeling`）<br>④ 【确认门】确认对齐结果<br>⑤ `to-spec`（`grill-with-docs` 内部调用）<br>⑥ 【确认门】确认 spec<br>⑦ `to-tickets`（`to-spec` 内部调用）<br>⑧ 【确认门】确认 frontier Ticket<br>⑨ `implement`（`to-tickets` 内部调用）<br>⑩ `tdd`（`implement` 内部调用）<br>⑪ `code-review`（`implement` 内部调用） | 调研结果进入标准开发链；不让研究 Skill 越过人工规划门 |

上表中每个 Skill 都是运行时硬依赖，没有可选项。`tdd -> codebase-design -> prototype` 这条链让 `codebase-design` 和 `prototype` 进入除 Bug 调试外的所有工作流；`wayfinder` 另外直接依赖 `research` 和 `prototype`。

## 运行时调用规则

- `SKILL.md` 中明确写出的 `Call the Skill tool with "name"` 才是运行时内部调用
- [`skills/manifest.json`](skills/manifest.json) 的 `dependsOn` 只用于安装依赖展开，不是工作流执行顺序
- `workflows.<name>.bundledSkills` 是同场景辅助 Skill，默认随工作流安装，用 `--no-ask-matt` 关闭；它们不参与运行时调用
- `workflows.<name>.optionalSkills` 保留给将来真正的条件分支，当前六条工作流都为空
- `dependsOn` 必须与 `SKILL.md` 的真实调用一致，由 `asen-skills check` 强制校验
- 没有项目初始化步骤：`to-spec`、`to-tickets`、`wayfinder` 各自判断 tracker，有 GitHub remote 且 `gh` 可用就写 Issues，否则写 `.scratch/`
- 三个 tracker Skill 各自捆绑 `references/github-tracker.md`：tracker 选 GitHub 时按需读取，内含 `gh` 命令速查、标签存在才打、阻塞边写法和认证失败回退 `.scratch/` 的规则
- `grilling`：顶层小任务可进入执行；嵌套调用只返回对齐结果
- `to-spec -> to-tickets -> implement`：按顺序衔接，每一步都遵守自己的确认门
- `tdd`：独立运行时调用一次 `code-review`；被 `implement` 调用时跳过内部审查
- `implement`：完成整个 Ticket 后统一调用一次 `code-review`
- `diagnosing-bugs`：修复验证完成并经用户确认后调用一次 `code-review`
- `wayfinder`、`improve-codebase-architecture`：完成决策后进入 `to-spec`，不能直接进入 `implement`

## Skill 清单

调用方式说明：

| 调用方式 | 含义 |
|---|---|
| **自动 + 手动** | Agent 可以根据任务自动调用，用户也可以明确指定该 Skill |
| **仅手动** | 只有用户明确指定时才能启动，Skill 设置了 `disable-model-invocation: true` |

本项目没有“只能自动、不能手动”的 Skill。

| Skill | 调用方式 | 定位 | 作用 |
|---|---|---|---|
| [`grilling`](skills/productivity/grilling/SKILL.md) | **自动 + 手动** | 最小工作流入口 | 通用拷问和需求对齐；顶层简单任务确认后进入执行，被其他 Skill 调用时只返回对齐结果 |
| [`grill-with-docs`](skills/engineering/grill-with-docs/SKILL.md) | **仅手动** | 标准开发入口 | 绑定代码库进行工程拷问，调用 `grilling`、`domain-modeling`，维护 `CONTEXT.md` 和 ADR |
| [`domain-modeling`](skills/engineering/domain-modeling/SKILL.md) | **自动 + 手动** | 基础能力 | 维护领域词汇、`CONTEXT.md` 和架构决策记录 |
| [`wayfinder`](skills/engineering/wayfinder/SKILL.md) | **仅手动** | 模糊大任务入口 | 建立探索地图，通过调查和决策 Ticket 逐步消除未知项 |
| [`tdd`](skills/engineering/tdd/SKILL.md) | **自动 + 手动** | 实现基础能力 | 执行失败测试 → 最小实现 → 重构 → 提交；独立运行时最终调用一次 `code-review` |
| [`code-review`](skills/engineering/code-review/SKILL.md) | **自动 + 手动** | 审查基础能力 | 沿代码标准轴和规格符合度轴并行执行双轴审查 |
| [`ask-matt`](skills/engineering/ask-matt/SKILL.md) | **仅手动** | Skill 路由入口 | 用户不知道使用哪个 Skill 时，根据任务选择正确入口或工作流 |
| [`to-spec`](skills/engineering/to-spec/SKILL.md) | **自动 + 手动** | 确认门节点 | 把已对齐内容写成正式规格，用户确认后调用 `to-tickets` |
| [`to-tickets`](skills/engineering/to-tickets/SKILL.md) | **自动 + 手动** | 确认门节点 | 把规格拆成 Tracer Bullet 垂直切片，用户确认后调用 `implement` |
| [`implement`](skills/engineering/implement/SKILL.md) | **自动 + 手动** | 实现节点 | 实现一个已批准的规格或 Ticket，内部运行 TDD，最终统一审查一次 |
| [`diagnosing-bugs`](skills/engineering/diagnosing-bugs/SKILL.md) | **自动 + 手动** | Bug 工作流入口 | 系统化执行复现、最小化、假设验证、修复和回归测试，确认后进入审查 |
| [`research`](skills/engineering/research/SKILL.md) | **自动 + 手动** | 调研基础能力 | 查询高可信一手资料并生成带引用的 `research/*.md` |
| [`improve-codebase-architecture`](skills/engineering/improve-codebase-architecture/SKILL.md) | **仅手动** | 架构改进入口 | 扫描 Deep Module 和重构机会，生成 HTML 报告，并通过拷问形成重构决策 |
| [`codebase-design`](skills/engineering/codebase-design/SKILL.md) | **自动 + 手动** | 设计基础能力 | 分析 Deep Module、接口、Seam、测试边界和 UI 架构 |
| [`prototype`](skills/engineering/prototype/SKILL.md) | **自动 + 手动** | 原型基础能力 | 用一次性逻辑原型或 UI 原型快速回答设计问题 |

## 上游维护

### 分支职责

| 分支 | 唯一职责 | 禁止事项 |
|---|---|---|
| `main` | 快进同步 `mattpocock/skills` 的 `upstream/main` | 不做二开、不删 Skill、不改工作流 |
| `MattPocock-Fork` | 保存本项目的 15 个 Skill、安装器和二开逻辑 | 不直接拉取或整体合并 `main` |

### 1. 只更新 main

```bash
git fetch upstream --prune
git switch main
git merge --ff-only upstream/main
git push origin main
git switch MattPocock-Fork
```

这一步只更新上游镜像，不修改 `MattPocock-Fork`。

### 2. 检查上游保留 Skill 的变化

以上一次 README 记录的审查基线为起点，先查看上游哪些文件发生变化：

```bash
BASELINE=5b15a47
git diff --name-status "$BASELINE"..main -- \
  skills/engineering/ask-matt \
  skills/engineering/code-review \
  skills/engineering/codebase-design \
  skills/engineering/diagnosing-bugs \
  skills/engineering/domain-modeling \
  skills/engineering/grill-with-docs \
  skills/engineering/implement \
  skills/engineering/improve-codebase-architecture \
  skills/engineering/prototype \
  skills/engineering/research \
  skills/engineering/tdd \
  skills/engineering/to-spec \
  skills/engineering/to-tickets \
  skills/engineering/wayfinder \
  skills/productivity/grilling
```

只审查输出中发生变化的 Skill。每个 Skill 分别判断：

1. 上游改动是否修复问题或改善原逻辑
2. 是否与本项目的六条工作流冲突
3. 是否影响确认门、自动调用或单次 `code-review` 规则
4. 是否需要同步附属文档、脚本和 `agents/openai.yaml`
5. 是否需要更新 `skills/manifest.json` 的安装依赖

### 3. 选择性移植到 MattPocock-Fork

```text
上游没有相关变化 -> 不改 MattPocock-Fork
上游改动有价值且不冲突 -> 只移植该 Skill 的目标改动
上游改动与二开流程冲突 -> 保留 MattPocock-Fork，记录拒绝原因
上游新增 Skill -> 默认不引入
上游删除 Skill -> 不自动跟随，单独评估
```

禁止以下操作：

```bash
git switch MattPocock-Fork
git pull upstream main
git merge main
```

它们会把上游整个仓库、已删除目录和无关 Skill 重新带回二开分支。

### 4. 移植后验证

```bash
scripts/check-manifest.mjs
scripts/install-skills.sh --list
scripts/install-skills.sh --list-workflows
git diff --check
```

同时检查：

- 仍然只有 15 个 Skill
- `skills/manifest.json` 和实际目录一致
- Claude Code、Codex 的项目级和全局安装仍然可用
- 六条工作流的确认门和内部调用没有被上游覆盖
- 验证通过后再更新 README 中的上游审查基线并提交 `MattPocock-Fork`

## 最终目录

```text
asenMattPocock-SKILL/
├── AGENTS.md                              # Agent 入口，指向仓库规则
├── CLAUDE.md                              # 仓库开发、分支和维护约束
├── CONTEXT.md                             # Skill、安装、分支和依赖术语
├── LICENSE                                # 上游 MIT 许可证
├── README.md                              # 安装、工作流、维护流程和目录说明
├── package.json                           # 提供 asen-skills 命令，支持 npx 免 clone 调用
├── .gitignore                             # 忽略本地依赖和客户端状态
├── bin/
│   └── cli.mjs                            # asen-skills 命令入口：install / list / check
├── scripts/
│   ├── check-manifest.mjs                 # 校验 manifest 与 SKILL.md 真实调用是否一致
│   ├── install-skills.sh                  # Claude/Codex 项目级与全局安装入口
│   ├── list-skills.sh                     # 列出仓库内所有 SKILL.md
│   └── resolve-skills.mjs                 # 根据 manifest 展开安装依赖
└── skills/
    ├── manifest.json                      # 15 个 Skill、6 个工作流入口和安装依赖
    ├── engineering/                       # 工程开发类 Skill
    │   ├── ask-matt/                      # Skill 路由
    │   ├── code-review/                   # 双轴代码审查
    │   ├── codebase-design/               # 代码库架构设计
    │   ├── diagnosing-bugs/               # 系统化 Bug 调试
    │   ├── domain-modeling/                # 领域模型和项目语境维护
    │   ├── grill-with-docs/                # 绑定代码库的需求拷问
    │   ├── implement/                     # 规格或 Ticket 实现
    │   ├── improve-codebase-architecture/ # 架构扫描和重构决策
    │   ├── prototype/                     # 逻辑和 UI 原型
    │   ├── research/                      # 一手资料调研
    │   ├── tdd/                           # TDD 红绿重构
    │   ├── to-spec/                       # 对齐结果转规格
    │   │   └── references/github-tracker.md
    │   ├── to-tickets/                    # 规格转垂直切片 Ticket
    │   │   └── references/github-tracker.md
    │   └── wayfinder/                     # 模糊大任务探索地图
        └── references/github-tracker.md
    └── productivity/                      # 通用生产力 Skill
        └── grilling/                      # 通用拷问与最小工作流入口
```

## 许可证

本项目保留上游 MIT 许可证，见 [`LICENSE`](LICENSE)。

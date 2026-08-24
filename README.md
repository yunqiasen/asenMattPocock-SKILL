# asenMattPocock Skills

基于 [`mattpocock/skills`](https://github.com/mattpocock/skills) 的二开 Skill 仓库，只维护本项目需要的 16 个 AI Agent Skill。

## 项目定位

```text
upstream/main (mattpocock/skills)
        ↓ 只做快进同步
main    上游镜像分支，不做二开
        ↓ 逐个检查保留的 16 个 Skill，选择性移植
develop 二开分支，日常开发分支，也是安装源
```

- `main`：只跟踪和更新上游，不写二开代码
- `develop`：保存本项目删减、工作流编排和 Skill 微调
- 禁止把整个 `main` 直接合并进 `develop`
- 上游更新后，只检查本项目保留的 16 个 Skill；逐个决定是否移植
- 上游新增或删除 Skill，不自动改变本项目的 16 个 Skill 清单

当前上游审查基线：`5b15a47`，审查日期：`2026-08-24`。该基线表示上游内容已检查到此提交，不表示所有上游实现都已复制到 `develop`。

## 安装

二开内容在 `develop`，安装时必须使用该分支：

```text
https://github.com/yunqiasen/asenMattPocock-SKILL/tree/develop
```

### 1. 获取开发仓库

```bash
cd "/Users/yunqiroot/Documents/ChatGPT/Agent-项目"
git clone git@github.com:yunqiasen/asenMattPocock-SKILL.git
cd asenMattPocock-SKILL
git switch develop
git remote add upstream git@github.com:mattpocock/skills.git
```

如果 `upstream` 已存在，不要重复添加：

```bash
git remote -v
```

### 2. 项目级安装

项目级安装只对目标项目生效。安装器可以从任意目录运行，`--project` 必须指向真正开发的项目，不是本 Skill 仓库。

```bash
SKILLS_REPO="/Users/yunqiroot/Documents/ChatGPT/Agent-项目/asenMattPocock-SKILL"
TARGET_PROJECT="/Users/yunqiroot/Desktop/项目/中"

# Claude Code 项目级
"$SKILLS_REPO/scripts/install-skills.sh" \
  --project "$TARGET_PROJECT" \
  --agent claude-code \
  --skill grilling

# Codex 项目级
"$SKILLS_REPO/scripts/install-skills.sh" \
  --project "$TARGET_PROJECT" \
  --agent codex \
  --skill grilling
```

安装位置：

```text
Claude Code：目标项目/.claude/skills/<skill-name>/
Codex：      目标项目/.agents/skills/<skill-name>/
锁定文件：   目标项目/skills-lock.json
```

Claude Code 和 Codex 都需要时，可以在一条命令中同时安装：

```bash
"$SKILLS_REPO/scripts/install-skills.sh" \
  --project "$TARGET_PROJECT" \
  --agent claude-code \
  --agent codex \
  --skill grill-with-docs
```

### 3. 全局安装

全局安装对当前用户的所有项目生效，不写入当前项目目录。

```bash
SKILLS_REPO="/Users/yunqiroot/Documents/ChatGPT/Agent-项目/asenMattPocock-SKILL"

# Claude Code 全局
"$SKILLS_REPO/scripts/install-skills.sh" \
  --global \
  --agent claude-code \
  --skill grilling

# Codex 全局
"$SKILLS_REPO/scripts/install-skills.sh" \
  --global \
  --agent codex \
  --skill grilling
```

安装位置：

```text
Claude Code：~/.claude/skills/<skill-name>/
Codex：      ~/.agents/skills/<skill-name>/
```

### 4. 按工作流安装

安装器会根据 [`skills/manifest.json`](skills/manifest.json) 自动补齐安装依赖。`dependsOn` 只表示需要同时安装，不表示运行时自动调用顺序。

| 使用场景 | 安装参数 |
|---|---|
| 简单任务 | `--skill grilling` |
| 标准开发 | `--skill grill-with-docs` |
| 模糊大任务 | `--skill wayfinder` |
| 架构改进 | `--skill improve-codebase-architecture` |
| Bug 调试 | `--skill diagnosing-bugs` |
| 研究后开发 | `--skill research --skill grill-with-docs` |
| 安装全部 16 个 Skill | `--all` |

示例：给 Codex 项目安装“研究后开发”工作流。

```bash
"$SKILLS_REPO/scripts/install-skills.sh" \
  --project "$TARGET_PROJECT" \
  --agent codex \
  --skill research \
  --skill grill-with-docs
```

项目初始化由 `setup-matt-pocock-skills` 单独执行，不算一条开发工作流：

```bash
"$SKILLS_REPO/scripts/install-skills.sh" \
  --project "$TARGET_PROJECT" \
  --agent codex \
  --skill setup-matt-pocock-skills
```

### 5. 直接使用 npx

不克隆仓库也可以直接安装。项目级安装必须先进入目标项目目录，因为 `npx skills` 没有用于指定目标项目的 `--dir` 参数。

```bash
cd "/Users/yunqiroot/Desktop/项目/中"

npx skills@latest add \
  "https://github.com/yunqiasen/asenMattPocock-SKILL/tree/develop" \
  --agent codex \
  --skill grilling \
  --skill tdd \
  --skill code-review \
  --skill codebase-design \
  --skill prototype \
  --copy \
  --yes
```

全局安装：

```bash
npx skills@latest add \
  "https://github.com/yunqiasen/asenMattPocock-SKILL/tree/develop" \
  --agent claude-code \
  --skill grilling \
  --skill tdd \
  --skill code-review \
  --skill codebase-design \
  --skill prototype \
  --global \
  --copy \
  --yes
```

直接使用 `npx` 时，需要自行把工作流涉及的 Skill 全部选上；仓库安装器会自动展开依赖，因此更推荐使用安装器。

## 六条工作流

| # | 工作流 | 适用场景 | 完整流程 | 关键规则 |
|---|---|---|---|---|
| 1 | **简单任务** | 改文案、调样式、小功能、简单修复、普通文档或规划 | `grilling` → 用户确认 → Agent 执行 → 代码任务：`tdd` → `code-review`；非代码任务：输出结果后结束 | `grilling` 顶层运行时进入执行；被其他 Skill 调用时只返回对齐结果。独立 TDD 最终只审查一次 |
| 2 | **标准开发** | 需求明确，需要正式规格、任务拆分和完整实现 | `grill-with-docs` → 确认对齐结果 → `to-spec` → 确认 spec → `to-tickets` → 确认当前 frontier ticket → `implement` → `tdd` → `code-review` | `to-spec`、`to-tickets` 都有确认门。`implement` 忽略 TDD 内部审查，由自己统一审查一次 |
| 3 | **模糊大任务** | 目标模糊、未知项很多，需要先探索再决定 | `wayfinder` → 确定 destination → 解决 decision tickets → `research` / `prototype` / `grilling` / `domain-modeling` → 确认进入规格阶段 → `to-spec` → `to-tickets` → `implement` → `tdd` → `code-review` | Wayfinder Ticket 只负责调查和决策，不是业务实现 Ticket；不能直接调用 `implement` |
| 4 | **架构改进** | 扫描代码坏味道、寻找 Deep Module 和系统性重构机会 | `improve-codebase-architecture` → HTML 报告 → 用户选择候选 → `grilling` + `domain-modeling` → 重构决策 → 确认进入规格阶段 → `to-spec` → `to-tickets` → `implement` → `tdd` → `code-review` | 架构 Skill 只负责扫描、报告和决策；必须经过 `to-spec → to-tickets` 才能实现 |
| 5 | **Bug 调试** | 顽固 Bug、修 A 坏 B、根因不清楚 | `diagnosing-bugs` → 复现 → 最小化 → 验证假设 → 修复 → 回归测试 → 确认进入审查 → `code-review` → 修复有效意见 → 提交 | 用户确认后只调用一次 `code-review`；不确认则停在提交前 |
| 6 | **研究后开发** | 技术、库、SDK 或方案不熟悉，需要先查清楚再开发 | `research` → `research/*.md` → `grill-with-docs` → 确认对齐结果 → `to-spec` → 确认 spec → `to-tickets` → 确认当前 frontier ticket → `implement` → `tdd` → `code-review` | `research` 只负责调研产物，不绕过需求对齐、规格确认和任务拆分 |

## 运行时调用规则

- `SKILL.md` 中明确写出的 `Call the Skill tool with "name"` 才是运行时内部调用
- [`skills/manifest.json`](skills/manifest.json) 的 `dependsOn` 只用于安装依赖展开，不是工作流执行顺序
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
| [`setup-matt-pocock-skills`](skills/engineering/setup-matt-pocock-skills/SKILL.md) | **仅手动** | 项目初始化 | 配置 issue tracker、标签、领域文档和工作流目录 |
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
| `develop` | 保存本项目的 16 个 Skill 和二开逻辑 | 不直接拉取或整体合并 `main` |

### 1. 只更新 main

```bash
git fetch upstream --prune
git switch main
git merge --ff-only upstream/main
git push origin main
git switch develop
```

这一步只更新上游镜像，不修改 `develop`。

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
  skills/engineering/setup-matt-pocock-skills \
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

### 3. 选择性移植到 develop

```text
上游没有相关变化 -> 不改 develop
上游改动有价值且不冲突 -> 只移植该 Skill 的目标改动
上游改动与二开流程冲突 -> 保留 develop，记录拒绝原因
上游新增 Skill -> 默认不引入
上游删除 Skill -> 不自动跟随，单独评估
```

禁止以下操作：

```bash
git switch develop
git pull upstream main
git merge main
```

它们会把上游整个仓库、已删除目录和无关 Skill 重新带回二开分支。

### 4. 移植后验证

```bash
scripts/install-skills.sh --help
scripts/install-skills.sh --list
git diff --check
```

同时检查：

- 仍然只有 16 个 Skill
- `skills/manifest.json` 和实际目录一致
- Claude Code、Codex 的项目级和全局安装仍然可用
- 六条工作流的确认门和内部调用没有被上游覆盖
- 验证通过后再更新 README 中的上游审查基线并提交 `develop`

## 最终目录

```text
asenMattPocock-SKILL/
├── AGENTS.md                              # Agent 入口，指向仓库规则
├── CLAUDE.md                              # 仓库开发、分支和维护约束
├── CONTEXT.md                             # Skill、安装、分支和依赖术语
├── LICENSE                                # 上游 MIT 许可证
├── README.md                              # 安装、工作流、维护流程和目录说明
├── .gitignore                             # 忽略本地依赖和客户端状态
├── scripts/
│   ├── install-skills.sh                  # Claude/Codex 项目级与全局安装入口
│   ├── list-skills.sh                     # 列出仓库内所有 SKILL.md
│   └── resolve-skills.mjs                 # 根据 manifest 展开安装依赖
└── skills/
    ├── manifest.json                      # 16 个 Skill 的唯一清单和安装依赖
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
    │   ├── setup-matt-pocock-skills/      # 项目初始化
    │   ├── tdd/                           # TDD 红绿重构
    │   ├── to-spec/                       # 对齐结果转规格
    │   ├── to-tickets/                    # 规格转垂直切片 Ticket
    │   └── wayfinder/                     # 模糊大任务探索地图
    └── productivity/                      # 通用生产力 Skill
        └── grilling/                      # 通用拷问与最小工作流入口
```

## 许可证

本项目保留上游 MIT 许可证，见 [`LICENSE`](LICENSE)。

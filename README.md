# asenMattPocock Skills

面向 AI Agent 的工程 Skill 集合。当前只维护 16 个 Skill，分为自动调用基础、手动调用入口和确认门工作流节点。

## 安装

直接使用 `npx skills@latest` 时，命令必须在目标项目目录执行。使用本仓库安装器时，可以从任意目录运行，并通过 `--project` 指定目标项目。项目级安装会把 Skill 写入目标项目，只有客户端能扫描到对应目录后，AI 才会真正使用它们。

推荐使用仓库自带安装器。它会自动展开 Skill 依赖，并支持 Claude Code、Codex、项目级和全局安装。

### 项目级安装

项目级 Skill 只对指定项目生效，适合团队项目和项目专属工作流。

```bash
SKILLS_REPO="/Users/yunqiroot/Documents/ChatGPT/Agent-项目/asenMattPocock-SKILL"
TARGET_PROJECT="/Users/yunqiroot/Desktop/项目/中"

# Claude Code
"$SKILLS_REPO/scripts/install-skills.sh" \
  --project "$TARGET_PROJECT" \
  --agent claude-code \
  --skill grilling

# Codex
"$SKILLS_REPO/scripts/install-skills.sh" \
  --project "$TARGET_PROJECT" \
  --agent codex \
  --skill implement
```

安装结果：

```text
Claude Code 项目级：目标项目/.claude/skills/<skill-name>/
Codex 项目级：      目标项目/.agents/skills/<skill-name>/
两者都会生成：      目标项目/skills-lock.json
```

项目级安装只需要选一个客户端。两个客户端都要用时，分别执行一次即可。

### 全局安装

全局 Skill 对所有项目生效，适合通用的基础 Skill。全局安装不会写入当前项目目录。

```bash
SKILLS_REPO="/Users/yunqiroot/Documents/ChatGPT/Agent-项目/asenMattPocock-SKILL"

# Claude Code
"$SKILLS_REPO/scripts/install-skills.sh" \
  --global \
  --agent claude-code \
  --skill grilling

# Codex
"$SKILLS_REPO/scripts/install-skills.sh" \
  --global \
  --agent codex \
  --skill grilling
```

全局安装结果：

```text
Claude Code: ~/.claude/skills/<skill-name>/
Codex:      ~/.agents/skills/<skill-name>/
```

这里的 Codex 路径是 `skills` CLI 的通用 Agent Skills 全局目录。不要手动把 Codex Skill 放到本仓库的 `skills/` 目录中。

### 直接使用 npx

也可以直接调用 `npx skills@latest`，但它不会自动展开本仓库 Skill 之间的调用依赖，推荐优先使用上面的安装器。

```bash
cd "/Users/yunqiroot/Desktop/项目/中"

npx skills@latest add \
  "https://github.com/yunqiasen/asenMattPocock-SKILL/tree/develop" \
  --agent codex \
  --skill grilling \
  --copy \
  --yes
```

关键规则：

- 不存在 `--dir` 参数，项目安装位置由执行命令时的当前目录决定。
- `--global` 表示安装到用户目录，不加则安装到当前项目。
- `--agent claude-code` 安装到 Claude Code，`--agent codex` 安装到 Codex。
- `--copy` 使用真实文件，跨客户端和跨机器更稳定；不加时 CLI 默认优先使用 symlink。
- 当前二开内容在 `develop`，安装源必须指向 `tree/develop`，不能省略分支。

### 选择 Skill

安装器会自动补齐依赖。例如：

```text
grilling
└── tdd
    ├── codebase-design
    │   └── prototype
    └── code-review

implement
├── setup-matt-pocock-skills
├── tdd
│   ├── codebase-design
│   │   └── prototype
│   └── code-review
└── code-review
```

可用完整名称见 [`skills/manifest.json`](skills/manifest.json)。

## Skill 分类

### 自动调用基础 Skill

- [`grilling`](skills/productivity/grilling/SKILL.md)：通用拷问；直接用于小任务时，确认后进入执行阶段
- [`domain-modeling`](skills/engineering/domain-modeling/SKILL.md)：维护项目领域词汇、`CONTEXT.md` 和 ADR
- [`tdd`](skills/engineering/tdd/SKILL.md)：失败测试、最小实现、重构、提交；独立运行时调用一次 `code-review`
- [`code-review`](skills/engineering/code-review/SKILL.md)：标准轴和规格轴双轴审查
- [`diagnosing-bugs`](skills/engineering/diagnosing-bugs/SKILL.md)：复现、最小化、假设、修复、回归测试，确认后调用一次 `code-review`
- [`research`](skills/engineering/research/SKILL.md)：基于高可信一手资料调研并生成引用 Markdown
- [`codebase-design`](skills/engineering/codebase-design/SKILL.md)：Deep Module、接口、Seam 和架构设计词汇
- [`prototype`](skills/engineering/prototype/SKILL.md)：用原型回答逻辑或 UI 设计问题

### 手动调用入口

- [`grill-with-docs`](skills/engineering/grill-with-docs/SKILL.md)：绑定代码库并产出 `CONTEXT.md`、ADR
- [`wayfinder`](skills/engineering/wayfinder/SKILL.md)：大任务探索地图和调查 Ticket
- [`setup-matt-pocock-skills`](skills/engineering/setup-matt-pocock-skills/SKILL.md)：项目初始化和工作流配置
- [`ask-matt`](skills/engineering/ask-matt/SKILL.md)：Skill 路由
- [`improve-codebase-architecture`](skills/engineering/improve-codebase-architecture/SKILL.md)：扫描 Deep Module 优化机会并生成 HTML 报告

### 可手动启动、也可被上游调用

- [`to-spec`](skills/engineering/to-spec/SKILL.md)：对话转正式规格说明书，确认后内部进入 `to-tickets`
- [`to-tickets`](skills/engineering/to-tickets/SKILL.md)：规格转 Tracer Bullet 垂直切片，确认后内部进入 `implement`
- [`implement`](skills/engineering/implement/SKILL.md)：按规格实施，内部驱动 TDD，忽略 TDD 的审查交接，由自身统一调用一次代码审查

## 六条工作流

### 1. 简单任务

```text
grilling
  -> 用户确认
  -> Agent 执行
  -> 代码任务：tdd -> code-review
  -> 非代码任务：输出结果后结束
```

这是最小工作流。`grilling` 直接处理简单需求；需要维护 `CONTEXT.md` 或 ADR 时改用 `grill-with-docs`。`grilling` 被其他 Skill 调用时，只负责拷问并把控制权返回给调用方，不自动进入 TDD。

### 2. 代码库内的标准开发

```text
grill-with-docs
  -> 用户确认对齐结果
  -> to-spec
  -> 用户确认 spec
  -> to-tickets
  -> 用户确认 frontier ticket
  -> implement
  -> tdd
  -> code-review
```

`implement` 调用 `tdd` 时，TDD 不调用 `code-review`；由 `implement` 在全部切片、类型检查和全量测试通过后统一调用一次。

### 3. 模糊且规模很大的任务

```text
wayfinder
  -> 确定 destination
  -> 创建并解决 decision tickets
  -> research / prototype / grilling / domain-modeling
  -> 地图清空
  -> to-spec
  -> 用户确认 spec
  -> to-tickets
  -> 用户确认 frontier ticket
  -> implement -> tdd -> code-review
```

`wayfinder` 只解决决策，不实现业务功能。它的 Ticket 不是实现 Ticket。

### 4. 架构改进

```text
improve-codebase-architecture
  -> 扫描代码库
  -> 生成 architecture-review HTML 报告
  -> 用户选择候选
  -> grilling + domain-modeling
  -> 重构决策方案
  -> to-spec
  -> 用户确认 spec
  -> to-tickets
  -> 用户确认 frontier ticket
  -> implement -> tdd -> code-review
```

`improve-codebase-architecture` 不直接调用 `implement`，也不直接修改代码。重构决策必须经过 `to-spec -> to-tickets` 才进入实现。

### 5. Bug 调试

```text
diagnosing-bugs
  -> 复现
  -> 最小化
  -> 生成并验证假设
  -> 修复和回归测试
  -> 用户确认审查
  -> code-review
  -> 修复有效审查意见
  -> 提交
```

本流程只运行一次 `code-review`。用户拒绝审查确认时，停止在提交前。

### 6. 研究后开发

```text
research
  -> research/*.md（高可信一手资料和引用）
  -> grill-with-docs
  -> 用户确认对齐结果
  -> to-spec
  -> 用户确认 spec
  -> to-tickets
  -> 用户确认 frontier ticket
  -> implement -> tdd -> code-review
```

## 工作流调用规则

- `SKILL.md` 中的 `Call the Skill tool with "name"` 才是运行时内部调用
- `skills/manifest.json` 的 `dependsOn` 只用于安装时展开依赖闭包，不代表执行顺序
- `grilling` 是通用拷问入口，直接启动时可在确认后进入最小执行流；被其他 Skill 调用时只返回对齐结果
- `to-spec`、`to-tickets`、`implement` 是可手动启动、也可被上游 Skill 内部调用的确认门工作流节点
- `tdd` 独立运行时调用一次 `code-review`；被 `implement` 调用时跳过内部审查
- `diagnosing-bugs` 在用户确认后调用一次 `code-review`
- `wayfinder` 和 `improve-codebase-architecture` 完成决策后都回到 `to-spec`，不能直接跳到 `implement`

项目初始化仍由 `setup-matt-pocock-skills` 单独执行，不计入六条工作流。明确的 bug 直接使用 `diagnosing-bugs`。需要单独回答架构或 UI 设计问题时使用 `codebase-design` 或 `prototype`。

## 最终目录

```text
asenMattPocock-SKILL/
├── AGENTS.md                              # Agent 入口，只指向仓库规则
├── CLAUDE.md                              # 仓库开发和维护约束
├── CONTEXT.md                             # 本仓库的 Skill、安装和依赖词汇
├── LICENSE                                # MIT 许可证
├── README.md                               # 安装流程、Skill 清单和使用路线
├── .gitignore                              # 忽略本地依赖和 Claude 状态
├── scripts/
│   ├── install-skills.sh                   # 项目级/全局、Claude/Codex 安装入口
│   ├── list-skills.sh                      # 列出当前仓库所有 SKILL.md 路径
│   └── resolve-skills.mjs                  # 展开 Skill 依赖闭包
└── skills/
    ├── manifest.json                       # 16 个 Skill 的唯一清单和依赖关系
    ├── engineering/                        # 工程开发类 Skill
    │   ├── ask-matt/
    │   ├── code-review/
    │   ├── codebase-design/
    │   ├── diagnosing-bugs/
    │   ├── domain-modeling/
    │   ├── grill-with-docs/
    │   ├── implement/
    │   ├── improve-codebase-architecture/
    │   ├── prototype/
    │   ├── research/
    │   ├── setup-matt-pocock-skills/
    │   ├── tdd/
    │   ├── to-spec/
    │   ├── to-tickets/
    │   └── wayfinder/
    └── productivity/                        # 通用工作流 Skill
        └── grilling/
```

## 仓库分支

```text
main     ← 同步上游 mattpocock/skills
 develop ← 本项目二开分支，日常开发和安装源
```

二开安装源：

```text
https://github.com/yunqiasen/asenMattPocock-SKILL/tree/develop
```

## 许可证

本项目保留上游 MIT 许可证，见 [`LICENSE`](LICENSE)。

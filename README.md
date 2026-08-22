# asenMattPocock Skills

面向 AI Agent 的工程 Skill 集合。当前只维护 17 个 Skill，分为自动调用和手动调用两类。

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
  --skill grill-me

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
  --skill grill-me \
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
grill-me
└── grilling

implement
├── setup-matt-pocock-skills
├── tdd
│   └── codebase-design
└── code-review
```

可用完整名称见 [`skills/manifest.json`](skills/manifest.json)。

## Skill 分类

### 自动调用

- [`grilling`](skills/productivity/grilling/SKILL.md)：底层通用拷问逻辑
- [`domain-modeling`](skills/engineering/domain-modeling/SKILL.md)：维护项目领域词汇、`CONTEXT.md` 和 ADR
- [`tdd`](skills/engineering/tdd/SKILL.md)：失败测试、最小实现、重构、提交
- [`code-review`](skills/engineering/code-review/SKILL.md)：标准轴和规格轴双轴审查
- [`diagnosing-bugs`](skills/engineering/diagnosing-bugs/SKILL.md)：复现、最小化、假设、修复、回归测试
- [`research`](skills/engineering/research/SKILL.md)：基于高可信一手资料调研并生成引用 Markdown
- [`codebase-design`](skills/engineering/codebase-design/SKILL.md)：Deep Module、接口、Seam 和架构设计词汇
- [`prototype`](skills/engineering/prototype/SKILL.md)：用原型回答逻辑或 UI 设计问题

### 手动调用

- [`grill-me`](skills/productivity/grill-me/SKILL.md)：不绑定代码库的通用拷问
- [`grill-with-docs`](skills/engineering/grill-with-docs/SKILL.md)：绑定代码库并产出 `CONTEXT.md`、ADR
- [`wayfinder`](skills/engineering/wayfinder/SKILL.md)：大任务探索地图和调查 Ticket
- [`setup-matt-pocock-skills`](skills/engineering/setup-matt-pocock-skills/SKILL.md)：项目初始化和工作流配置
- [`ask-matt`](skills/engineering/ask-matt/SKILL.md)：Skill 路由
- [`to-spec`](skills/engineering/to-spec/SKILL.md)：对话转正式规格说明书
- [`to-tickets`](skills/engineering/to-tickets/SKILL.md)：规格转 Tracer Bullet 垂直切片
- [`implement`](skills/engineering/implement/SKILL.md)：按规格实施，内部驱动 TDD，最后调用代码审查
- [`improve-codebase-architecture`](skills/engineering/improve-codebase-architecture/SKILL.md)：扫描 Deep Module 优化机会并生成 HTML 报告

## 推荐工作流

```text
setup-matt-pocock-skills
          ↓
  grill-with-docs / grill-me
          ↓
       to-spec
          ↓
      to-tickets
          ↓
      implement
       ↙     ↘
     tdd   code-review
```

模糊且规模很大的任务先用 `wayfinder`。明确的 bug 直接使用 `diagnosing-bugs`。需要回答架构或 UI 设计问题时使用 `prototype`。

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
    ├── manifest.json                       # 17 个 Skill 的唯一清单和依赖关系
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
        ├── grill-me/
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

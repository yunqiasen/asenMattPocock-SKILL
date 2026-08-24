# asenMattPocock Skills

这是一个只维护 15 个 Agent Skill 的二开仓库，另外提供两条命令行入口：项目初始化和 Skill 安装。不要恢复上游已删除的发布系统、官网文档、实验 Skill 或杂项 Skill。

## 分支约束

- `main` 只作为 `mattpocock/skills` 的上游镜像分支，只允许快进同步 `upstream/main`。
- `MattPocock-Fork` 是二开开发分支和唯一安装源，所有删减、调用编排和 Skill 微调都在这里完成。
- 不得在 `main` 开发，不得在 `MattPocock-Fork` 执行 `git pull upstream main` 或 `git merge main`。
- 上游更新后，只检查本项目保留的 15 个 Skill；逐个判断并选择性移植，不整体合并上游。
- 上游新增、删除或移动 Skill 时，不自动修改本项目清单。
- 每轮上游审查完成并通过验证后，更新 README 的上游审查基线；该基线表示已检查，不表示全部移植。

## 目录约束

- `skills/manifest.json` 是 Skill 名称、调用模式、依赖关系和六个工作流入口的唯一清单。
- `templates/` 放项目初始化写入目标项目的固定模板文本，不属于任何 Skill 目录。
- `bin/cli.mjs` 是 `asen-skills` 命令入口，只做参数转发；真实逻辑在 `scripts/`。
- `skills/engineering/` 放工程 Skill，`skills/productivity/` 放通用工作流 Skill。
- 每个 Skill 必须包含 `SKILL.md` 和 `agents/openai.yaml`。
- Skill 的调用模式必须同时同步：`SKILL.md` 的 `disable-model-invocation` 和 `agents/openai.yaml` 的 `policy.allow_implicit_invocation`。
- 自动 + 手动 Skill 不得设置 `disable-model-invocation: true`；Agent 可以自动选择，用户也可以明确启动。
- 仅手动 Skill 必须设置 `disable-model-invocation: true`，并在 `agents/openai.yaml` 设置 `policy.allow_implicit_invocation: false`。
- 自动 + 手动的工作流节点通过确认门保留人工控制，允许被上游 Skill 调用，也允许用户直接启动。
- `scripts/install-skills.sh` 是对外安装入口。它必须按 `skills/manifest.json` 自动展开 Skill 或 `--workflow` 的必需依赖闭包，支持项目级、全局、Claude Code 和 Codex。
- 条件分支 Skill 记录在 `workflows.<name>.optionalSkills`，只有 `--with-optional` 才随工作流安装。不要把条件调用混入必需的运行时 `dependsOn`。
- 项目初始化由 `scripts/init-project.sh` 完成，是纯 bash 命令，不是 Skill。它的产出全部是 `templates/` 中的固定文本加脚本生成的 `## Agent skills` 块，不需要 AI 判断，也不占用 Agent 上下文。
- 禁止把项目初始化重新做成 Skill。输出固定、判断项可脚本推断的工作一律用命令行实现。
- `init-project.sh` 必须保持幂等：`## Agent skills` 块原地替换，`docs/agents/*.md` 默认跳过已存在文件。
- 修改 Skill 调用关系或工作流入口时，同时更新 `skills/manifest.json`、相关 Skill 的 `SKILL.md` 和 README 表格。
- 所有会落到目标项目的配置都必须使用目标项目自己的路径，不要写死本仓库路径。

## 15 个 Skill

自动 + 手动 Skill：`grilling`、`domain-modeling`、`tdd`、`code-review`、`to-spec`、`to-tickets`、`implement`、`diagnosing-bugs`、`research`、`codebase-design`、`prototype`。

仅手动 Skill：`grill-with-docs`、`wayfinder`、`ask-matt`、`improve-codebase-architecture`。

## 验证

修改后至少执行：

```bash
scripts/install-skills.sh --help
scripts/install-skills.sh --list
scripts/install-skills.sh --list-workflows
scripts/init-project.sh --help
bin/cli.mjs --help
```

并在临时 Git 项目中验证：

- `init-project.sh` 的 GitHub 与本地 tracker 自动探测
- `## Agent skills` 块重复运行不产生重复内容
- Claude Code 和 Codex 的项目级、全局安装路径

最终检查 `git status`、Skill 数量、Manifest 中的 15 个名称和 README 安装命令。

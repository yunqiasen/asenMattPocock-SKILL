# asenMattPocock Skills

这是一个只维护 16 个 Agent Skill 的二开仓库。不要恢复上游已删除的发布系统、官网文档、实验 Skill 或杂项 Skill。

## 分支约束

- `main` 只作为 `mattpocock/skills` 的上游镜像分支，只允许快进同步 `upstream/main`。
- `develop` 是二开开发分支和唯一安装源，所有删减、调用编排和 Skill 微调都在这里完成。
- 不得在 `main` 开发，不得在 `develop` 执行 `git pull upstream main` 或 `git merge main`。
- 上游更新后，只检查本项目保留的 16 个 Skill；逐个判断并选择性移植，不整体合并上游。
- 上游新增、删除或移动 Skill 时，不自动修改本项目清单。
- 每轮上游审查完成并通过验证后，更新 README 的上游审查基线；该基线表示已检查，不表示全部移植。

## 目录约束

- `skills/manifest.json` 是 Skill 名称、调用模式和依赖关系的唯一清单。
- `skills/engineering/` 放工程 Skill，`skills/productivity/` 放通用工作流 Skill。
- 每个 Skill 必须包含 `SKILL.md` 和 `agents/openai.yaml`。
- Skill 的调用模式必须同时同步：`SKILL.md` 的 `disable-model-invocation` 和 `agents/openai.yaml` 的 `policy.allow_implicit_invocation`。
- 自动调用 Skill 不得设置 `disable-model-invocation: true`。
- 手动调用 Skill 必须设置 `disable-model-invocation: true`，并在 `agents/openai.yaml` 设置 `policy.allow_implicit_invocation: false`。
- 可手动启动且允许被上游 Skill 调用的工作流节点，不设置 `disable-model-invocation: true`；它们通过确认门保留人工控制。
- `scripts/install-skills.sh` 是对外安装入口。它必须按 `skills/manifest.json` 自动展开依赖，支持项目级、全局、Claude Code 和 Codex。
- 修改 Skill 调用关系时，同时更新 `skills/manifest.json`、相关 Skill 的 `SKILL.md` 和 README 索引。
- 所有会落到目标项目的配置都必须使用目标项目自己的路径，不要写死本仓库路径。

## 16 个 Skill

自动调用基础 Skill：`grilling`、`domain-modeling`、`tdd`、`code-review`、`diagnosing-bugs`、`research`、`codebase-design`、`prototype`。

手动调用入口：`grill-with-docs`、`wayfinder`、`setup-matt-pocock-skills`、`ask-matt`、`improve-codebase-architecture`。

可手动启动且可被上游调用：`to-spec`、`to-tickets`、`implement`。

## 验证

修改后至少执行：

```bash
scripts/install-skills.sh --help
scripts/install-skills.sh --list
```

并在临时 Git 项目中验证 Claude Code 和 Codex 的项目级、全局安装路径。最终检查 `git status`、Skill 数量、Manifest 中的 16 个名称和 README 安装命令。

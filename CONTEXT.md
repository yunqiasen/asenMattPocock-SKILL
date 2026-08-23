# asenMattPocock Skills

本仓库维护一组供 AI Agent 使用的工程 Skill。Skill 是可安装的 Agent 指令集，按客户端和安装范围写入目标项目或用户级 Skill 目录。

## Language

**Skill**:
一个带有 `SKILL.md` 的 Agent 指令集，可被客户端自动调用，也可以由用户手动调用。
_Avoid_: 普通提示词、脚本插件

**自动调用**:
客户端或模型根据 Skill 的描述和触发条件主动使用它。
_Avoid_: 强制调用

**手动调用**:
只有用户明确选择或输入 Skill 名称时才使用它。
_Avoid_: 自动 Skill

**确认门工作流节点**:
可由用户手动启动，也可被上游 Skill 内部调用；在进入下一阶段前必须等待用户明确确认。
_Avoid_: 无确认自动连跑

**项目级安装**:
只对当前项目生效的安装，写入项目内客户端识别的 Skill 目录。
_Avoid_: 局部复制

**全局安装**:
对用户所有项目生效的安装，写入客户端的用户级 Skill 目录。
_Avoid_: 系统安装

**Skill 依赖**:
一个 Skill 正常工作前必须同时安装的其他 Skill。依赖关系统一记录在 `skills/manifest.json`。
_Avoid_: 隐式复制

**目标项目**:
真正使用 Skill 的项目目录，不是本 Skill 仓库目录。
_Avoid_: 安装源

**安装源**:
提供 Skill 文件的仓库和分支。本项目开发期间使用 `develop` 分支。
_Avoid_: 目标项目

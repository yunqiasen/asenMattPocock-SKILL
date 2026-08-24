# asenMattPocock Skills

本仓库维护一组供 AI Agent 使用的工程 Skill。Skill 是可安装的 Agent 指令集，按客户端和安装范围写入目标项目或用户级 Skill 目录。

## Language

**Skill**:
一个带有 `SKILL.md` 的 Agent 指令集，可被客户端自动调用，也可以由用户手动调用。
_Avoid_: 普通提示词、脚本插件

**自动 + 手动**:
客户端或模型可以根据 Skill 的描述和触发条件主动使用，用户也可以明确指定启动。
_Avoid_: 仅自动

**仅手动**:
只有用户明确选择或输入 Skill 名称时才启动；通过 `disable-model-invocation: true` 禁止模型自动选择。
_Avoid_: 自动 + 手动

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

**工作流安装闭包**:
由 `skills/manifest.json` 中工作流的一次性前置 Skill、入口 Skill 和递归依赖组成的完整安装集合。默认保证新项目不漏装；项目已初始化时可以跳过前置 Skill，只保留日常运行闭包。
_Avoid_: 运行顺序

**目标项目**:
真正使用 Skill 的项目目录，不是本 Skill 仓库目录。
_Avoid_: 安装源

**安装源**:
提供 Skill 文件的仓库和分支。本项目开发期间使用 `MattPocock-Fork` 分支。
_Avoid_: 目标项目

**上游镜像分支**:
本仓库的 `main`，只快进同步 `mattpocock/skills` 的 `upstream/main`，不承载二开修改。
_Avoid_: 开发分支

**二开分支**:
本仓库的 `MattPocock-Fork`，保存删减后的 16 个 Skill、工作流编排和安装逻辑，也是对外安装源。
_Avoid_: 上游镜像

**上游审查基线**:
最近一次已经逐个检查本项目保留 Skill 的上游提交。表示已审查到该提交，不表示全部上游改动都已移植。
_Avoid_: 合并基线

**选择性移植**:
上游更新后，只把已评估且适合本项目的单个 Skill 改动带入 `MattPocock-Fork`，不整体合并 `main`。
_Avoid_: 同步分支

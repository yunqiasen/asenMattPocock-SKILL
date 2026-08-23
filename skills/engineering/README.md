# Engineering Skills

自动调用基础 Skill：

- [code-review](code-review/SKILL.md)：代码标准轴和规格轴双轴审查
- [codebase-design](codebase-design/SKILL.md)：UI 和 Deep Module 架构设计
- [diagnosing-bugs](diagnosing-bugs/SKILL.md)：复现、最小化、假设、修复、回归测试，确认后调用一次代码审查
- [domain-modeling](domain-modeling/SKILL.md)：维护领域词汇、`CONTEXT.md` 和 ADR
- [prototype](prototype/SKILL.md)：用可运行原型回答设计问题
- [research](research/SKILL.md)：基于高可信一手资料调研
- [tdd](tdd/SKILL.md)：失败测试、最小代码、重构、提交，独立运行时调用一次代码审查

手动调用入口：

- [ask-matt](ask-matt/SKILL.md)：路由 Skill
- [grill-with-docs](grill-with-docs/SKILL.md)：代码库拷问并产出文档
- [improve-codebase-architecture](improve-codebase-architecture/SKILL.md)：扫描架构优化机会并生成 HTML 报告
- [setup-matt-pocock-skills](setup-matt-pocock-skills/SKILL.md)：初始化项目工作流配置
- [wayfinder](wayfinder/SKILL.md)：大任务探索地图和调查 Ticket

可手动启动、也可被上游调用：

- [to-spec](to-spec/SKILL.md)：对话转正式规格说明书，确认后内部调用 `to-tickets`
- [to-tickets](to-tickets/SKILL.md)：规格转 Tracer Bullet 垂直切片，确认后内部调用 `implement`
- [implement](implement/SKILL.md)：按规格实施，内部调用 TDD，并统一收尾一次代码审查

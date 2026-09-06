---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

Call the Skill tool twice, for "grilling" and "domain-modeling".

After both Skills return, show the repository-bound decisions recorded in `CONTEXT.md` and ADRs, then open the handoff gate

1. Ask whether to formalize this alignment as a spec
2. End the response immediately after the question. Do not call `to-spec` in the same turn
3. Continue only after a later user message explicitly confirms this handoff
4. If the user requests changes, return to the relevant grilling or domain-modeling work and reopen this gate

This gate is a turn boundary so the user can review the actual decisions before specification work starts

Do not call `to-tickets` or `implement` here. `to-spec` owns the next confirmation gate, then continues to `to-tickets` and `implement`

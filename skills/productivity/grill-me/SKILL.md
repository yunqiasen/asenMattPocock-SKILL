---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".

After the user confirms that the shared understanding is complete, choose the handoff by task shape

- For a pure decision, planning, or writing task, stop with the agreed result
- For a small, clear code change that does not need a spec or ticket, call the Skill tool with "tdd" to execute it test-first. The standalone TDD run owns one final `code-review`
- For repository-bound planning that needs `CONTEXT.md` or ADR updates, tell the user to run `/grill-with-docs` instead of continuing here

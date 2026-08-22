---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Call the Skill tool with "tdd" and implement at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once implementation and its tests pass, call the Skill tool with "code-review" to review the work.

Fix every valid review finding. The `tdd` skill commits each completed slice, so only create an additional commit when review fixes changed the tree.

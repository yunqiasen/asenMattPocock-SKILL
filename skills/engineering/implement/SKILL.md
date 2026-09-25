---
name: implement
description: "Implement one approved spec or ticket through TDD, checks, and one final code review. Use when the work is already decided and ready to build."
---

Implement one approved ticket or spec. Do not use this skill to settle an unresolved idea or raw conversation; send that work back to `to-spec` or `to-tickets` first.

Before changing the code, verify all of the following in the current conversation or the referenced tracker artifact:

- The spec or ticket is identifiable
- Its scope and acceptance criteria are settled
- The seams to test are recorded
- The selected spec or frontier ticket has explicit user approval to implement this scope; for a ticket, its blockers are resolved

Trace approval to the caller's displayed implementation gate and a later user reply, or to a direct user request to implement this already-approved spec or ticket. An issue marked ready, the caller's own "approved" note, or a general request to work on the project is not enough

If the scope, acceptance criteria, or seams are missing, stop without modifying code and ask to resolve them in the planning phase. Do not silently invoke upstream skills. If only implementation approval is missing, show the selected scope and ask `Awaiting confirmation: start implementation of <spec/ticket>?`, then end the turn and wait

Reuse a valid approval for the same scope without asking twice. After a scope change, unresolved blocker, or missing approval history, reopen the relevant gate instead of assuming permission

Capture the current `HEAD` as the fixed point before making changes and pass it to the final review

Call the Skill tool with "tdd" and implement at pre-agreed seams. The nested TDD run may contain a review handoff for standalone use, but `implement` owns this run's final review: ignore the nested `code-review` step and do not execute it.

Pass the approved seams and their approval source to `tdd`. Without a Skill tool, load each named installed `SKILL.md` at its turn and follow it. Announcing a call without loading and applying the skill does not complete that step

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once all TDD slices, implementation checks, and the full test suite pass, call the Skill tool with "code-review" exactly once for the complete ticket diff.

Fix every valid review finding. The `tdd` skill commits each completed slice, so only create an additional commit when review fixes changed the tree.

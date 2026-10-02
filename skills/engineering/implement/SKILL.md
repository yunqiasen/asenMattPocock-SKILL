---
name: implement
description: "Implement one approved spec or ticket through TDD, checks, and one final code review. Use when the work is already decided and ready to build."
---

Implement one approved ticket or spec. Do not use this skill to settle an unresolved idea or raw conversation; send that work back to `to-spec` or `to-tickets` first.

Use the document paths passed in the handoff. If a path was lost, search established document locations, including shared folders, by project and task name and read the matching spec or ticket in place. Finding the file does not restore missing user approval

Before changing the code, verify all of the following in the current conversation or the referenced tracker artifact:

- The spec or ticket is identifiable
- Its scope and acceptance criteria are settled
- The selected spec or frontier ticket has explicit user approval to implement this scope; for a ticket, its blockers are resolved

Trace approval to the parent spec's implementation approval and the actual user reply, or to a direct user request to implement this settled spec or ticket. The spec-level implementation approval covers tickets faithfully derived from that spec: check that the ticket's behavior and acceptance criteria fit the authorized scope, not that its ID was separately approved. Respect any narrower selection and check blockers without asking for per-ticket approval. An issue marked ready, the caller's own "approved" note, or a general request to work on the project is not enough

If the scope or acceptance criteria are missing, stop without modifying code and ask to resolve them in the planning phase. Do not silently invoke upstream skills. Missing test seams alone do not block implementation: let `tdd` identify suitable existing public interfaces within the approved scope. If only implementation approval is missing, show the selected scope and ask `Awaiting confirmation: start implementation of <spec/ticket>?`, then end the turn and wait

Reuse a valid approval for the same scope without asking twice. These entry checks are agent checks, not additional user gates. On resume, recover the user's approval from the conversation or its referenced record before asking again. A material scope change needs a new decision; an unresolved blocker needs resolution, not a repeated approval of unchanged work

Capture the current `HEAD` as the fixed point before making changes and pass it to the final review

Call the Skill tool with "tdd" and implement the approved behavior at the recorded seams, or suitable existing seams identified during TDD. The nested TDD run may contain a review handoff for standalone use, but `implement` owns this run's final review: ignore the nested `code-review` step and do not execute it.

Pass the task's implementation approval, any recorded seams, and explicit review ownership to `tdd`. Continue TDD, checks, and final review without asking permission between them. Without a Skill tool, load each named installed `SKILL.md` at its turn and follow it. Announcing a call without loading and applying the skill does not complete that step

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once all TDD slices, implementation checks, and the full test suite pass, call the Skill tool with "code-review" exactly once for the complete ticket diff.

Fix every valid review finding. The `tdd` skill commits each completed slice, so only create an additional commit when review fixes changed the tree.

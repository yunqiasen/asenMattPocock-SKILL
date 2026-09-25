---
name: tdd
description: Test-driven development through red, green, refactor, and commit. Use when the user wants to build features or fix bugs test-first, mentions red-green-refactor, or wants integration tests.
---

# Test-Driven Development

TDD is the red → green → refactor → commit loop. This skill makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of each cycle.

When exploring the codebase, read `CONTEXT.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** First identify the seams, scope, and their approval source in the conversation or referenced spec/ticket. Reuse explicit user approval for the same unchanged seams, including approval passed by `implement`, without asking again. A seam listed in a document or proposed by an agent is not approval by itself

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), call the Skill tool with "codebase-design" for the vocabulary. It is the shared source of the module, interface, depth, seam, adapter, leverage and locality terms, and it is a reference to consult, not a session to run.

When approval is missing, show the proposed public interfaces and the behavior each test will observe. Agreeing these boundaries before coding keeps testing focused on the important behavior rather than every implementation detail

```text
Awaiting confirmation: test seams -> TDD
Ready: <seams, behaviors, and scope>
Next: write the first failing test, then implement at these seams
Use these seams, revise them, or stop here?
```

Translate the card into the user's language. Use a final response or an input request that waits for the user; if unavailable, end the turn with the card. Do not write tests or production code, including via a subagent, while the gate is pending

Resume only after a later user reply explicitly approves the displayed seams. An earlier "fix this", silence, a tool result, or agreement to a different phase is not approval. Clarify an ambiguous answer; revise and ask again if the seams or scope change. Missing approval history means reopen this gate

After approval, state which seams were confirmed and start the loop. This is not a new spec requirement for the minimal workflow, and it adds no extra confirmation before the final review

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior. Work in **vertical slices** instead: one test → one implementation → one refactor → one commit, each cycle responding to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write one failing test first and run it to prove it fails for the intended reason.
- **Minimal green.** Write only enough production code to make that test pass. Do not anticipate future tests or add speculative behavior.
- **Refactor while green.** Improve names, structure, duplication, and module depth without changing behavior. Run focused tests after each meaningful refactor.
- **Commit the slice.** Commit only after red, green, refactor, and relevant checks pass. Each commit represents one coherent behavior slice.
- **One slice at a time.** One seam, one failing test, one minimal implementation, one refactor, one commit per cycle.

## Review handoff

This skill owns at most one `code-review` call per standalone TDD run

- When TDD is invoked directly or by a workflow other than `implement`, capture the fixed point before the first slice, complete all slices, and call the Skill tool with "code-review" exactly once after the final checks pass
- When TDD is invoked by `implement`, do not execute the `code-review` step here. Return control to `implement`, which owns the single review for the complete ticket
- If the invocation context is unclear, do not start a second review. Ask which skill owns the current run's final review

---
name: ask-matt
description: Route a task to the right skill or workflow in this repository.
disable-model-invocation: true
---

# Ask Matt

Use this router when the user does not know which skill fits the task.

## Main delivery flow

1. Run `/setup-matt-pocock-skills` once for a new codebase.
2. Use `/grill-with-docs` for repository-bound planning. It invokes `grilling` and `domain-modeling` and records `CONTEXT.md` and ADR decisions.
3. Use `/to-spec` when the conversation is settled and needs a formal specification.
4. Use `/to-tickets` when the work must be split into tracer-bullet vertical slices with blocking edges.
5. Use `/implement` to build from a spec or ticket. It invokes `tdd`, then `code-review`.

For a small, already-clear change, go directly to `/implement`.

## Large or unclear work

Use `/wayfinder` when the destination is clear enough to name but the route is too foggy or too large for one session. It creates a map and resolves research, prototype, grilling, and task tickets one at a time. When the route is clear, continue with `/to-spec`.

## Standalone choices

| Situation | Skill |
| --- | --- |
| General interview with no codebase | `/grill-me` |
| Repository interview with domain documents | `/grill-with-docs` |
| Hard bug or performance regression | `diagnosing-bugs` |
| High-trust primary-source investigation | `research` |
| Logic or UI question that needs a concrete artifact | `prototype` |
| Architecture scan and HTML report | `/improve-codebase-architecture` |
| Test-first implementation of one behavior | `tdd` |
| Review a diff against standards and a specification | `code-review` |

## Automatic foundations

- `grilling`: the reusable interview primitive.
- `domain-modeling`: maintains domain vocabulary, `CONTEXT.md`, and ADRs.
- `codebase-design`: supplies deep-module, interface, seam, and UI design vocabulary.
- `tdd`: runs red, green, refactor, commit.
- `code-review`: reviews standards and specification compliance in parallel.
- `diagnosing-bugs`: runs reproduce, minimize, hypothesize, fix, regression-test.
- `research`: produces a cited Markdown research artifact.
- `prototype`: answers design questions with throwaway logic or UI artifacts.

## Boundary rule

Do not route to a skill outside this repository's 17 entries. If a task needs several skills, name the full sequence and explain the transition point between them.

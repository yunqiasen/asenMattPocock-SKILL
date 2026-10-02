---
name: to-spec
description: "Turn an agreed conversation into a formal spec, publish it to the project issue tracker, and after user confirmation continue to to-tickets. Use when the plan is settled and needs a written specification."
---

## Entry and approval checks

Check the current phase before exploring files or loading another skill. Once specification work is authorized, perform the internal steps continuously up to the single specification handoff gate

When another skill hands off, recover its displayed handoff and the later user reply authorizing specification work for the current scope from the conversation or its referenced record. Agreement with the requirements alone is not this approval. If either cannot be recovered, show the scope and ask permission to enter `to-spec`, then end the turn before drafting or publishing a spec

A direct user request to run `to-spec` or write a spec authorizes this phase without replaying a caller's gate. Reuse a valid caller approval for the same scope without asking again. Neither entry path authorizes ticket creation or implementation

| Current state | Work allowed now |
| --- | --- |
| Entry approved for the current scope | Inspect the codebase, choose test seams, write and publish the complete spec, then show the ticket handoff card and end the turn |
| Published spec shown, ticket handoff awaiting approval | Answer questions or revise the spec; do not start ticket work |
| Later user reply approves that spec's ticket handoff | Load `to-tickets` and pass the approved scope |

Keep `to-tickets/SKILL.md` unread until the last row applies. Preloading downstream instructions to check availability or prepare the workflow crosses the same boundary as invoking them. Approval of one row does not authorize the next row's gated action

At the final gate, tie approval to the complete spec, scope, and next action. Use a final response or a client input request that waits; if no such tool is available, end the turn with the question. A progress update is not a pause. While waiting, do not execute the next phase inline, through tools, or through a subagent

Accept a later clear affirmative reply to that gate, not an earlier "build it", a tool result, an issue status, or the agent's claim that approval exists. A material change to scope or decisions invalidates its old approval. On resume, recover the relevant user approval from the conversation or its referenced record and reuse it; ask only if it cannot be recovered. If the user declines, stop

Pick the issue tracker without any project setup step: use GitHub Issues via the `gh` CLI when `git remote -v` points at GitHub and `gh auth status` succeeds, otherwise write Markdown under `.scratch/<feature-slug>/`. State which one you chose in one line before publishing anything. If `docs/agents/issue-tracker.md` exists, follow it instead. When the tracker is GitHub, read `references/github-tracker.md` (bundled next to this SKILL.md) for exact `gh` command shapes and the label rule before publishing.

For local documents, keep established locations, including shared workspace folders. Search by project and task name before writing and reuse matching files and task directories in place. For a new shared path, use `<project>-<task>` as the feature slug, e.g. `.scratch/shop-checkout/spec.md`, unless its parent already identifies the project. Keep actual document paths in the handoff so the next skill can reuse them

## Process

Synthesize the agreed context rather than restarting the requirements interview. Keep every analysis and writing step, but do not insert approval questions between them. Ask only when a missing product decision or material change to the agreed plan genuinely requires the user

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Put the chosen seams and the behavior each test observes in the spec's Testing Decisions. Do not open a separate test-seam approval gate: the user reviews these choices with the complete specification at step 4. Respect previously agreed interfaces; do not silently change product behavior or public contracts to make testing easier

3. Write the spec using the template below, then publish it to the tracker chosen above. On GitHub, apply a `ready-for-agent` label only when that label already exists; skip labelling rather than creating labels.

If writing or publication is unavailable, report the current-phase blocker and preserve the draft. Do not read downstream skills to work around a missing tool or ask for approval as if publication had succeeded

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- The public seams to exercise and the required behavior each test observes
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>

4. Open the specification handoff gate. Show the published spec reference, acceptance criteria, chosen seams, scope exclusions, and ticket publication destination. This one decision authorizes decomposition and implementation of the displayed scope together. Finish with this card in the user's language

```text
Awaiting confirmation: to-spec -> to-tickets
Ready: <spec reference and scope summary>
Next: split and publish tickets, then implement them in dependency order through TDD and code review
Approve this complete spec and its implementation, split tasks only without coding, revise the spec, or stop here?
```

5. End the turn at the card. Do not load `to-tickets`, create tickets, or implement anything while this gate is pending

6. After a later user reply approves the displayed spec and next action, state `Confirmed: to-spec -> to-tickets` and call the Skill tool with "to-tickets". Pass the spec reference, testing decisions, scope, publication destination, and the actual approving reply, explicitly stating whether implementation is authorized. With full approval, `to-tickets` publishes and implements all derived tickets within that scope without another gate. If the user chooses tasks only, pass that restriction and stop after decomposition and publication; if they choose to stop at the spec, do not call downstream. Without a Skill tool, load the installed `to-tickets/SKILL.md` and follow it instead of merely describing it

Approval of the spec alone is not implementation permission when the reply explicitly limits work to documents or decomposition. A clear yes answering the displayed full-execution card authorizes its stated actions. Do not upgrade an older approval that only allowed ticket planning into implementation authorization

7. If the user rejects or materially changes the spec, revise it, republish the affected content, and reopen this gate. Clarifications or ambiguous replies stay in this phase. Permission to write the spec does not approve splitting it into tickets

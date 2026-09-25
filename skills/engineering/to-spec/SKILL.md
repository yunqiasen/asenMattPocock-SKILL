---
name: to-spec
description: "Turn an agreed conversation into a formal spec, publish it to the project issue tracker, and after user confirmation continue to to-tickets. Use when the plan is settled and needs a written specification."
---

## Entry and approval checks

Check the current phase before exploring files or loading another skill. The steps below span multiple user turns, not one uninterrupted run

When another skill hands off, verify that the conversation contains its displayed handoff and a later user reply authorizing specification work for the current scope. Agreement with the requirements alone is not this approval. If either is missing, show the scope and ask permission to enter `to-spec`, then end the turn before drafting or publishing a spec

A direct user request to run `to-spec` or write a spec authorizes this phase without replaying a caller's gate. It does not approve unconfirmed test seams, ticket creation, or implementation

| Current state | Work allowed now |
| --- | --- |
| Entry approved, test seams not yet approved | Inspect the codebase, propose seams, ask for confirmation, then end the turn |
| Entry and seams approved for the same scope | Write and publish the spec, show the ticket handoff card, then end the turn |
| Published spec shown, ticket handoff awaiting approval | Answer questions or revise the spec; do not start ticket work |
| Later user reply approves that spec's ticket handoff | Load `to-tickets` and pass the approved scope |

Keep `to-tickets/SKILL.md` unread until the last row applies. Preloading downstream instructions to check availability or prepare the workflow crosses the same boundary as invoking them. Approval of one row does not authorize the next row's gated action

For each gate below, tie approval to the displayed artifact, scope, and next action. Use a final response or a client input request that waits; if no such tool is available, end the turn with the question. A progress update is not a pause. While waiting, do not execute the next step inline, through tools, or through a subagent

Accept a later clear affirmative reply to that gate, not an earlier "build it", a tool result, an issue status, or the agent's claim that approval exists. A changed scope invalidates its old approval. If approval is missing after a context reset, reopen the affected gate; if the user declines, stop

Pick the issue tracker without any project setup step: use GitHub Issues via the `gh` CLI when `git remote -v` points at GitHub and `gh auth status` succeeds, otherwise write Markdown under `.scratch/<feature-slug>/`. State which one you chose in one line before publishing anything. If `docs/agents/issue-tracker.md` exists, follow it instead. When the tracker is GitHub, read `references/github-tracker.md` (bundled next to this SKILL.md) for exact `gh` command shapes and the label rule before publishing.

## Process

Synthesize the agreed context rather than restarting the requirements interview. Ask only the approval questions needed for the current phase

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Open a seam confirmation gate before writing the spec unless the same seams and scope already have explicit user approval in the conversation or a user-authored approval on the referenced spec or ticket

- Show the proposed seams and why each one observes the required behavior
- Ask `Awaiting confirmation: test seams -> spec draft. Use these boundaries to write the spec, revise them, or stop?` in the user's language
- End the response immediately after the question. Do not write or publish the spec in that turn
- Continue only after a later user message explicitly confirms the seams
- If the user rejects or changes a seam, revise the proposal and reopen this gate

When approval already exists, identify its source, carry it forward, and do not ask for the same confirmation again. A document that merely lists the seams is not proof that the user approved them

3. Write the spec using the template below, then publish it to the tracker chosen above. On GitHub, apply a `ready-for-agent` label only when that label already exists; skip labelling rather than creating labels.

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
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>

4. Open the specification handoff gate. Show the published spec reference, acceptance criteria, chosen seams, and scope exclusions. Finish with this card in the user's language

```text
Awaiting confirmation: to-spec -> to-tickets
Ready: <spec reference and scope summary>
Next: propose implementation tickets, not start implementation
Split this spec into tickets, revise it, or stop here?
```

5. End the turn at the card. Do not load `to-tickets`, create tickets, or implement anything while this gate is pending

6. After a later user reply explicitly approves this spec and the ticket handoff, state `Confirmed: to-spec -> to-tickets` and call the Skill tool with "to-tickets". Pass the spec reference, approved seams, scope, and the approving reply. Without a Skill tool, load the installed `to-tickets/SKILL.md` and follow it instead of merely describing it

7. If the user rejects or changes the spec, revise it, republish the affected content, and reopen this gate. Clarifications or ambiguous replies stay in this phase. Confirmation of seams or permission to write the spec does not approve splitting it into tickets

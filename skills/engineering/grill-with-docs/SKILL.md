---
name: grill-with-docs
description: "Align repository-bound requirements through an interview, maintain the glossary and ADRs, then ask for approval before handing off to to-spec. Use when the user wants engineering decisions clarified and documented before specification or implementation."
disable-model-invocation: true
---

## Choose the current phase first

Before reading or invoking another skill, locate the latest user reply and the question it answers. Select one row, not a sequence of rows to complete in this turn

| Conversation state | Next action |
| --- | --- |
| Alignment is incomplete, or the reply changes the scope | Continue alignment with the helpers below; any previous handoff approval no longer applies |
| Alignment is settled, but its handoff card has not been shown | Show the confirmation card below and end the turn |
| The card is pending and the reply asks a question or only acknowledges the decisions | Answer or clarify within alignment, then ask again; stay in this phase |
| A later user reply explicitly approves the displayed card and its unchanged scope | Announce the confirmed handoff and invoke `to-spec` |
| The user declines | Stop without handing off |

Load skills only when the selected phase needs them. In particular, leave `to-spec/SKILL.md` unread until the handoff is approved; do not preload it to check availability or learn the next workflow. Its instructions belong to the next phase, not preparation for this one

## Align and document

While alignment needs work, call the Skill tool twice, for "grilling" and "domain-modeling"

Pass that this is a nested call: `grilling` returns the shared understanding to `grill-with-docs`, not permission to start TDD or write a spec. Do not restart a completed interview when resuming its handoff gate

Update `CONTEXT.md` and relevant ADRs as decisions settle, following `domain-modeling`. Finish those updates before asking for the handoff so the user can review the actual result

## Confirmation gate: alignment -> specification

Treat agreement with the requirements and permission to write a spec as separate decisions. A reply to a grilling question approves that answer, not the next workflow phase

1. Present the current decisions, scope, unresolved assumptions, and links to any glossary or ADR updates
2. End the turn with the following confirmation card, translated into the user's language

```text
Awaiting confirmation: grill-with-docs -> to-spec
Ready: <alignment summary and document links>
Next: write a specification from these decisions, not tickets or code
Proceed to to-spec with this scope, revise the decisions, or stop here?
```

3. Stop after the card. Use a final response or the client's input request that actually waits for the user; a progress message followed by more work is not a pause. If the input tool is unavailable, ask in the final response and end the turn
4. Resume only when a later user reply explicitly approves this displayed transition and its unchanged scope. A short yes counts only as a clear answer to this specific card. Earlier requests such as "build this", agreement inside `grilling`, silence, tool results, and an agent's own summary do not approve this handoff
5. If the reply only acknowledges the decisions, asks a question, or is ambiguous, answer within alignment and repeat the card. If it changes the scope, revise the decisions and present a new card; if it declines, stop
6. Only in the approved row above, state `Confirmed: grill-with-docs -> to-spec` with the approved scope and the user's reply, then call the Skill tool with "to-spec"

Carry the displayed decision summary and the approving reply into `to-spec`. When there is no Skill tool, read the installed target `SKILL.md` and follow it at the point of its permitted call, including the alignment helpers; naming the skill is not invoking it

While the gate is pending, do not load or delegate the downstream phase, draft a spec inline, create tickets, or write implementation code. Missing approval after a context reset means reopen the gate, not assume it was passed

Do not call `to-tickets` or `implement` here. `to-spec` owns its own confirmation gates and may not reuse this approval for ticket creation or implementation

---
name: to-tickets
description: Break an approved spec into tracer-bullet tickets with blocking edges, publish them, and automatically call implement within the authorized scope. Use when settled work needs execution in manageable slices; respect requests to split only without implementation.
---

# To Tickets

Break a plan, spec, or conversation into a set of **tickets**: tracer-bullet vertical slices, each declaring the tickets that **block** it.

## Execution scope

This skill has no routine confirmation gate. Decomposition is execution planning within an already settled specification, not a second design approval. When the user approved the spec and its implementation, split and publish tickets, then automatically call `implement` in dependency order

Recover the spec reference, acceptance criteria, implementation authorization, and any scope limits from the caller, conversation, or referenced user approval. Spec-level authorization covers all tickets faithfully derived from that scope; ticket IDs need not have existed when the user approved it. A direct request to split and implement a settled spec also authorizes this flow

For decomposition-only or publication-only requests, finish that work and stop without loading `implement` or prompting to start coding. A direct request only to split tasks, or approval of an older handoff that explicitly excluded implementation, does not authorize code changes. If the caller claims execution was authorized but the actual user approval cannot be recovered, ask only for the missing authorization rather than inventing it

Ask the user only if decomposition exposes an unresolved product decision or requires a material change to the approved scope, acceptance criteria, or public contract. Explain the specific decision and wait before taking that changed path. Routine ticket granularity, dependency ordering, publication, and same-scope implementation need no additional approval

Pick the issue tracker without any project setup step: use GitHub Issues via the `gh` CLI when `git remote -v` points at GitHub and `gh auth status` succeeds, otherwise write Markdown under `.scratch/<feature-slug>/`. State which one you chose in one line before publishing anything. If `docs/agents/issue-tracker.md` exists, follow it instead. When the tracker is GitHub, read `references/github-tracker.md` (bundled next to this SKILL.md) for exact `gh` command shapes and the label rule before publishing.

For local documents, search established locations, including shared folders, by project and task name. Reuse matching tickets and any existing task-specific directory; preserve paths and ticket numbers on resume. For a new shared task directory, use `<project>-<task>` as the feature slug unless its parent already identifies the project, e.g. `.scratch/shop-checkout/issues/01-place-order.md`. Pass the actual spec and ticket paths into the handoff

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes a reference (a spec path, an issue number or URL) as an argument, fetch it and read its full body and comments.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Ticket titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

### 4. Check and report the breakdown

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work
- **Acceptance criteria and test seams**: summarize or reference the spec so the user can judge the proposed work

Verify that every ticket traces to the approved scope and acceptance criteria, and that the breakdown covers that scope without adding features. Check dependency ordering and resolve mechanical mistakes yourself

State the publication destination and execution scope as a progress update, not an approval question. By default, implement all tickets derived from the authorized spec; preserve any user limit to a particular subset. Identify tickets by draft number and title until publication supplies tracker IDs. Continue directly to publication

### 5. Publish the tickets to the configured tracker

Publish the tickets derived from the approved scope to the tracker chosen at the start of this skill, unless the user requested drafts only. No separate publication approval is needed for the authorized workflow. The tickets are the same either way, only the shape of the blocking edges changes:

- **Local files** → write one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first). Each file's "Blocked by" lists the numbers/titles it depends on. Use the per-ticket file template below: one ticket per file, never a single combined file.
- **GitHub** → publish one issue per ticket in dependency order (blockers first) so each ticket's blocking edges can reference real identifiers. Use GitHub's native blocking or sub-issue relationship where available; otherwise set each ticket's "Blocked by" to the blocking issues. Apply a `ready-for-agent` label when that label already exists on the repository; skip labelling rather than creating labels.

Work the **frontier**: any ticket whose blockers are all done. For a purely linear chain that means top to bottom.

Do NOT close or modify any parent issue.

<local-ticket-template>

# <NN>: <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None (can start immediately)".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)".

</issue-template>

In either form, avoid specific file paths or code snippets: they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

### 6. Execute the approved selection

After publication, automatically continue to `implement` when the spec's implementation is authorized. Map draft numbers and titles to published references and pass through the original authorization; do not ask the user to approve the derived tickets or start the first one

- Recheck that the next selected ticket is unchanged and all its blockers are actually complete. An empty frontier or a ready label is not proof of completion
- State `Executing: to-tickets -> implement` with the selected scope, then call the Skill tool with "implement" for one unblocked ticket at a time. Pass the ticket and parent spec references, scope, seams, execution limits, and the original user authorization. Without a Skill tool, load the installed `implement/SKILL.md` and follow it; merely mentioning the skill or suggesting the user invoke it is not a handoff
- After each ticket's implementation, checks, and final review finish, record its completion in the tracker. For a local ticket, check the verified acceptance criteria and set its status to completed; for GitHub, close that completed ticket. Do not mark a failed or partial ticket complete
- For an approved batch, continue to the next selected unblocked ticket without a per-ticket confirmation. `implement` still handles one ticket and one final review per call; batch permission does not waive any checks
- Stop after the approved selection is complete and report the result without prompting to expand it. Do not ask to start the next unselected ticket at completion. Do not start unselected tickets or silently implement an unapproved prerequisite. If a blocker prevents continuation, report it; ask only when a new user decision, changed scope, or missing authorization is needed

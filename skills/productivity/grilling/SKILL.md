---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed.

## Return to a caller or confirm execution

When another skill called `grilling`, return the settled decisions, scope, and remaining assumptions to that caller as soon as the frontier is empty. Do not add a confirmation gate just to return. The caller continues its own steps and owns any final plan or handoff confirmation. Keep genuine interview questions: returning automatically does not let the agent answer decisions on the user's behalf

The confirmation gate below applies only when `grilling` is the top-level workflow

When the frontier is empty, show the decisions, scope, and remaining assumptions. Name the next action before asking so agreement with an interview answer cannot silently authorize execution

```text
Awaiting confirmation: shared understanding -> <next action>
Ready: <decisions and scope>
Next: <start TDD for this code task, or execute this non-code task>
Confirm this understanding and next action, revise it, or stop here?
```

Translate the card into the user's language. End the turn using a final response or an input request that waits for the user. If that tool is unavailable, use the final response. A progress message followed by further work is not a pause

Resume only after a later user reply explicitly approves that card. Earlier answers, a generic request to build something, silence, tool results, and an agent's own summary do not pass it. Questions or ambiguous replies stay in alignment; a correction or new requirement invalidates the old approval and needs a revised card

Reuse an already confirmed top-level scope and next action without repeating this gate. On resume, recover that decision from the conversation or its referenced record; ask only if the approval cannot be recovered or the scope materially changes

## Execution handoff

Choose the handoff by invocation mode; only top-level execution needs the confirmation above

- When `grilling` is the top-level workflow for a small, clear task, execute the agreed task. For a code change, call the Skill tool with "tdd"; the standalone TDD run owns the final `code-review`. Without a Skill tool, load the installed `tdd/SKILL.md` and follow it
- When another skill called `grilling`, return control without a closing approval question. Do not start `tdd` or a downstream phase from a nested grilling run
- For a non-code task, execute the agreed writing, planning, or decision work directly without `tdd`

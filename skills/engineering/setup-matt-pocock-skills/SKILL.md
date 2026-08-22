---
name: setup-matt-pocock-skills
description: "Initialize a project for the engineering skills: configure its issue tracker, triage labels, and domain document layout. Run once before the first engineering workflow."
disable-model-invocation: true
---

# Setup Agent Skills

Configure the target project so `to-spec`, `to-tickets`, `wayfinder`, `implement`, `code-review`, and the domain skills know where project artifacts live.

This is a prompt-driven skill. Inspect first, present the proposed setup, get confirmation, then write the files.

## Explore

Read what exists before choosing a layout:

- `git remote -v` and `.git/config`
- `AGENTS.md` and `CLAUDE.md`
- `CONTEXT.md` and `CONTEXT-MAP.md`
- `docs/adr/` and `docs/agents/`
- `.scratch/`

The project has one context unless it clearly has multiple independent contexts. Do not create empty domain files or directories before a term or decision needs them.

## Section A: Issue tracker

Recommend GitHub when the project has a GitHub remote. Otherwise recommend local Markdown.

Supported choices:

- **GitHub**: use `gh issue` for project issues and GitHub dependencies.
- **Local Markdown**: use `.scratch/<feature>/` for specs and one file per issue.

Record the choice in `docs/agents/issue-tracker.md`. Use the matching template in this skill directory.

## Section B: Triage labels

Configure the five labels used by the planning and implementation flow:

- `needs-triage`
- `needs-info`
- `ready-for-agent`
- `ready-for-human`
- `wontfix`

Ask whether the project already uses different label names. Record the mapping in `docs/agents/triage-labels.md`. `to-spec` and `to-tickets` use this mapping when they publish work.

## Section C: Domain documents

Use the single-context layout by default:

```text
CONTEXT.md
 docs/
   adr/
```

Record the consumer rules in `docs/agents/domain.md`. Create `CONTEXT.md` and `docs/adr/` only when `domain-modeling` has a term or decision to record.

## Section D: Agent instructions

If `CLAUDE.md` exists, edit it. Otherwise edit `AGENTS.md`. Never create both just for this setup.

Add or update one `## Agent skills` block with pointers to:

- `docs/agents/issue-tracker.md`
- `docs/agents/triage-labels.md`
- `docs/agents/domain.md`

Do not overwrite unrelated instructions.

## Confirmation

Before writing, show the proposed issue tracker, label mapping, domain layout, and agent-instructions block. After confirmation, write the files and report which skills now depend on them.

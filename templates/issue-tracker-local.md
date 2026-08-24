# Issue tracker: Local Markdown

Project issues and specs live in `.scratch/`.

## Operations

- One feature per directory: `.scratch/<feature-slug>/`
- Spec: `.scratch/<feature-slug>/spec.md`
- Tickets: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`
- Comments: append under `## Comments`
- Ticket state: use a `Status:` line with `ready`, `claimed`, or `resolved`

## Wayfinder

The map is `.scratch/<effort>/map.md`. Each decision ticket is one file under `.scratch/<effort>/issues/`. Use `Blocked by: NN, NN` near the top of a ticket. A ticket is unblocked when every listed ticket is resolved.

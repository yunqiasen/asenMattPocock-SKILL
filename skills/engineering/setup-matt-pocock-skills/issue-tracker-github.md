# Issue tracker: GitHub

Project issues and specs live in GitHub Issues. Use the `gh` CLI from the project checkout.

## Operations

- Create: `gh issue create --title "..." --body "..."`
- Read: `gh issue view <number> --comments`
- List: `gh issue list --state open --json number,title,body,labels,comments`
- Comment: `gh issue comment <number> --body "..."`
- Close: `gh issue close <number> --comment "..."`
- Edit labels: `gh issue edit <number> --add-label "..."`

## Specs and tickets

`to-spec` creates one issue containing the formal specification. `to-tickets` creates one issue per tracer-bullet slice. Use GitHub's native issue dependencies when available. If native dependencies are unavailable, record `Blocked by: #<number>` in the issue body.

## Wayfinder

`wayfinder` uses one map issue and child issues. The map records the destination, notes, decisions so far, fog, and out-of-scope items. Child issues record one decision question each.

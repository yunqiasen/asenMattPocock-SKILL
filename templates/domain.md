# Domain documents

Before exploring a target project, read its domain documents:

- `CONTEXT-MAP.md` if it exists, then the relevant context files
- Otherwise the root `CONTEXT.md` if it exists
- ADRs under `docs/adr/` that touch the work

Use the terms defined by the glossary in specs, tickets, test names, and refactor proposals. If a term is missing or overloaded, use `domain-modeling` to resolve it before encoding it in a durable artifact.

## Default layout

```text
/
├── CONTEXT.md
└── docs/
    └── adr/
```

Create files lazily. Do not create empty context or ADR files just because the setup ran.

---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where such notes already live, including shared workspace folders; if there is no convention, choose a sensible location and say where. Search by project and topic before writing and reuse the matching note in place. For a new note in a shared folder, use `<project>-<topic>.md`, e.g. `research/shop-payment-options.md`; omit the project prefix if the parent path already identifies it

After the research file is complete, stop the research phase and tell the user to start `/grill-with-docs` with the research file as input. Do not call `grill-with-docs` from this automatic skill because it is a user-invoked repository planning gate

---
name: process
description: Call when a request is vague, an app idea needs a spec, work should be split across subagents, or docs need writing.
---

# Process — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

| Reference | Read it when |
| --- | --- |
| `prompt-enhancement` | A request is vague, underspecified, or readable several ways. Applies before the others. |
| `app-prompt` | Building an application from a rough idea — the interview, then a build-ready spec. |
| `subagents` | A task is big enough to split, or needs independent verification. |
| `subagent-briefs` | Writing the brief or system prompt a subagent runs on. |
| `documentation` | Creating or updating project docs. Copies its automation from `assets/`. |

Paths: `references/<name>.md`. Front-to-back: sharpen the ask → spec it if it's an app → split it if
it's large → document the result.

**Binds regardless:** never bury a decision. Ask when the answer would change what you build;
otherwise assume and **write the assumption down** where the user can veto it.

`app-prompt-engineer` compiles a settled brief off the main thread; `doc-writer` handles larger doc
jobs. The interactive **AskUserQuestion** interviews stay in the main thread.

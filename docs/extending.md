---
title: Extending
description: >-
  How to add a reference to an existing hub, add a whole new hub, and add commands, subagents,
  templates, and hooks. Includes the file templates and the conventions that keep startup context to
  four descriptions.
order: 70
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Extending

> Adding references, hubs, commands, subagents, templates, and hooks.

## Add a reference (the usual case)

**Almost every addition is a reference, not a skill.** A reference costs nothing until it is read; a
skill costs its description every session forever. To add, say, a RAG guide:

1. Create `plugins/devkit/skills/agent-development/references/rag.md`. **Plain Markdown, no
   frontmatter** — it is not a registered skill. Start with an H1.

2. Add a row to that hub's router (`skills/agent-development/SKILL.md`):

   ```markdown
   | `rag` | Grounding an agent in a document corpus. |
   ```

   Two columns: the name and **when to read it**. Resist adding a "what it covers" column — it is a
   table of contents for a file the model is about to open, and it changes no routing decision.

3. Cross-link siblings by filename (`see \`troubleshooting.md\``), never by absolute path.

4. Optionally add a keyword group to `plugins/devkit/hooks/scripts/suggest-pack.mjs` under that hub,
   with `hint: "references/rag.md"` so a matching prompt names the reference directly.

That's it. No new registration, no startup cost, and `/devkit:agent-development` reaches it.

## Add a hub (rare — think first)

A new hub adds ~570 bytes of description to **every session**. Only justified when the domain is
genuinely distinct from all four and its trigger phrases wouldn't fit an existing description.

1. Create `plugins/devkit/skills/<hub>/SKILL.md`:

   ```markdown
   ---
   name: <hub>
   description: >-
     What the domain is and when to reach for it, with the trigger phrases a user would actually
     type. This is the only text that costs startup context — make it earn its place.
   ---

   # <Hub> — router

   > **Driving this skill.** Say in one line that devkit **<hub>** is active and which reference
   > you're reading. Then **read only the reference(s) the task needs, on demand.**

   | Reference | Read it when |
   | --- | --- |
   | `<topic>` | … |

   **One or two things that bind regardless of which reference you read:** …
   ```

   `name` must equal the directory name, and the directory must sit **directly** under `skills/` —
   Claude Code discovers skills one level deep, not nested.

2. Add its references under `<hub>/references/`.

3. Add a row to the `/devkit` menu (`plugins/devkit/commands/devkit.md`) and a keyword group to the
   suggest hook.

Keep the router a **router**: the reference table plus the two or three rules that hold everywhere.
Aim for under 2 KB. Anything longer belongs in a reference — a fat router defeats the whole design.

## When to write a command instead

Commands are for **behavior a skill can't provide** — running something, printing something, copying
files. `/devkit` (menu), `/scaffold`, and `/mcp-preview-server` are the three that qualify.

Do **not** write a command whose body is "read this file and follow it." That costs a tool call, a
permission prompt outside auto-accept mode, and a duplicate copy of the content. Make it a reference
on a hub and the router points at it for free.

## Add a template

Templates are runnable starter files `/scaffold` copies into a project and adapts.

1. Create `plugins/devkit/templates/<name>/`.
2. Add a `TEMPLATE.md` manifest:

   ```markdown
   ---
   name: your-template
   description: One line — what the template gives you and when to use it.
   ---

   # Template: Your Template
   - Files: (list them)
   - Placeholders: {{PROJECT_NAME}}, {{MODEL}}, ...
   - After copying: (the steps to adapt it)
   ```

3. Add the files, using `{{TOKENS}}` for values the agent fills in. Keep them literal and valid so
   they double as reference examples and copy cleanly.

`/scaffold` discovers it automatically (it scans `templates/*/`). `TEMPLATE.md` is never copied into
the target project. See [Templates & scaffolding](templates.md).

## Add a subagent

Create `plugins/devkit/agents/<name>.md`:

```markdown
---
name: your-agent
description: When to invoke this subagent.
tools: Read, Write, Edit, Grep, Glob, Skill
---

System prompt. Load your guidance with the Skill tool — `devkit:<hub>`, then read the reference you
need — rather than reading a SKILL.md by path.
```

Grant `Skill` so the subagent loads devkit guidance the same cheap way the main thread does.

## Add a hook

Edit `plugins/devkit/hooks/hooks.json` and add an entry under the relevant event (`SessionStart`,
`UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, …):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/scripts/your-hook.mjs\"" }
        ]
      }
    ]
  }
}
```

Write the script under `hooks/scripts/`. Prefer Node so it runs identically everywhere; read the event
JSON from stdin, emit `hookSpecificOutput` JSON on stdout, and always exit cleanly so a hook failure
never blocks the user. When a hook points at guidance, name the hub **and the reference**.

## Add another plugin to the marketplace

Add a folder under `plugins/<other-plugin>/` with its own `.claude-plugin/plugin.json`, then add an
entry to the `plugins` array in `.claude-plugin/marketplace.json`.

## Conventions

- **Default to a reference, not a hub.** Registration is the only cost you can't defer.
- Every reference row needs a *when*, and only a *when* — that is how it gets picked without being
  read, and anything more is paid for on every invoke.
- Cross-reference within a hub by filename; across hubs as
  `` `devkit:<hub>` → `references/<file>.md` ``. Never point at a devkit `SKILL.md` by path.
- Keep references self-contained plain Markdown so they work outside Claude Code.
- Update the `/devkit` menu, the suggest hook, and this repo's docs when you add something, per the
  [documentation method](../plugins/devkit/skills/process/references/documentation.md).

## Related

- [Architecture](architecture.md) — why hubs and references.
- [Skill hubs](skill-packs.md) — what ships today.

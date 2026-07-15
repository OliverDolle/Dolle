---
title: Extending
description: >-
  How to add your own skills, sections, commands, subagents, and hooks to devkit. Includes the
  file templates and the conventions that keep everything consistent, portable, and out of
  startup context.
order: 70
---

# Extending

> Adding your own skills, sections, commands, subagents, and hooks to devkit.

## Add a skill to an existing section

To add, say, a `rag` skill to the agent-development section:

1. Create `plugins/devkit/packs/agent-development/rag/SKILL.md`:

   ```markdown
   ---
   name: rag
   description: One line — what it covers and when to read it.
   ---

   # RAG
   ...guidance...
   ```

2. Add a row to that section's catalog, `plugins/devkit/packs/agent-development/INDEX.md`, so
   the loader knows the skill exists and when to read it.

That's it — the section's loader command already reads the index and picks relevant skills.

## Add a whole new section (command-gated)

1. Create the section folder under `plugins/devkit/packs/<section>/`.
   - **Multi-skill:** add `INDEX.md` (a catalog like agent-development's) plus one
     `<skill>/SKILL.md` per skill.
   - **Single-skill:** just add `SKILL.md` at the section root.

2. Create a loader command `plugins/devkit/commands/<section>.md`:

   ```markdown
   ---
   description: Load the <section> skill section into context.
   argument-hint: "[optional task]"
   ---

   Read `${CLAUDE_PLUGIN_ROOT}/packs/<section>/INDEX.md` (if present), then the relevant
   `SKILL.md` files under `${CLAUDE_PLUGIN_ROOT}/packs/<section>/`. Confirm what you loaded,
   summarize briefly, then start on: $ARGUMENTS
   ```

3. Add a row to the `/devkit` menu in `plugins/devkit/commands/devkit.md`, and (optionally) a
   keyword entry in `plugins/devkit/hooks/scripts/suggest-pack.mjs`.

The whole pattern: content in `packs/`, exposed by a command, kept out of startup context.

## Make a skill always-on (native skill)

If you want a skill loaded automatically (not command-gated), copy or symlink its folder into
`plugins/devkit/skills/`:

```
plugins/devkit/skills/<skill>/SKILL.md
```

Claude Code then auto-discovers it and loads its name+description at startup. Keep the single
source in `packs/` and symlink to avoid drift.

## Add a template

Templates are runnable starter files that `/scaffold` copies into a project and adapts.

1. Create `plugins/devkit/packs/<section>/templates/<name>/`.
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

3. Add the template's files, using `{{TOKENS}}` for values the agent fills in. Keep them as
   literal, valid files so they double as reference and copy cleanly.

`/scaffold` discovers it automatically (it scans `packs/*/templates/*/`). `TEMPLATE.md` is
never copied into the target project. See [Templates & scaffolding](templates.md).

## Add a subagent

Create `plugins/devkit/agents/<name>.md`:

```markdown
---
name: your-agent
description: When to invoke this subagent.
tools: Read, Write, Edit, Grep, Glob
---

System prompt for the agent. It can read a section via
${CLAUDE_PLUGIN_ROOT}/packs/<section>/INDEX.md and the relevant SKILL.md files.
```

## Add a hook

Edit `plugins/devkit/hooks/hooks.json` and add an entry under the relevant event
(`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, …):

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

Write the script under `hooks/scripts/`. Prefer Node so it runs identically on every platform;
read the event JSON from stdin, and emit `hookSpecificOutput` JSON on stdout. Always exit
cleanly so a hook failure never blocks the user.

## Add another plugin to the marketplace

Add a folder under `plugins/<other-plugin>/` with its own `.claude-plugin/plugin.json`, then
add an entry to the `plugins` array in `.claude-plugin/marketplace.json`.

## Conventions

- Keep each skill self-contained and portable (one `SKILL.md`) so it works outside Claude Code.
- Loader commands should confirm what loaded and summarize briefly — no surprises.
- Update the `/devkit` menu, the section `INDEX.md`, and this repo's docs when you add
  something, per the
  [documentation method](../plugins/devkit/packs/documentation/SKILL.md).

## Related

- [Architecture](architecture.md) — how loading works under the hood.
- [Skill sections](skill-packs.md) — the sections that ship today.

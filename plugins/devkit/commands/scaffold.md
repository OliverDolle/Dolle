---
description: "Use when starting a new project or component from a template — BEFORE hand-rolling boilerplate. Copies a bundled devkit starter (e.g. a LangGraph or LangChain project) and adapts it to your task. Triggers: 'scaffold a project', 'start a new langgraph app', 'bootstrap from a template', 'new project skeleton', 'generate boilerplate'."
argument-hint: "[template name] [target dir] — or leave blank to list templates"
---

Templates are bundled with devkit at
`${CLAUDE_PLUGIN_ROOT}/packs/<section>/templates/<template>/`, each with a `TEMPLATE.md`
manifest describing its files, placeholders, and post-copy steps.

Follow this process:

1. **Discover templates.** Find every directory matching
   `${CLAUDE_PLUGIN_ROOT}/packs/*/templates/*/` and read the `name` + `description` from each
   `TEMPLATE.md` frontmatter.
2. **If the user did not name a template** (check the arguments below), show the list of
   templates with their descriptions and ask which to use. Copy nothing yet.
3. **Once a template is chosen:**
   a. Read its `TEMPLATE.md` in full for the placeholders and post-copy steps.
   b. Determine the target directory — from the arguments, else ask; default to the current
      project and follow its existing conventions.
   c. Copy the template's files (everything **except** `TEMPLATE.md`) into the target.
   d. **Adapt** the copied files to the user's task: replace every placeholder token
      (e.g. `{{PROJECT_NAME}}`, `{{MODEL}}`), rename state fields / nodes / tools / classes to
      match the task, and delete parts they don't need.
   e. Summarize what you copied and each change you made, and state exactly how to run it.

Rules:
- Never overwrite an existing file without confirming first.
- Keep the copy in a working state as you adapt it.
- If no templates are found, say so and point the user to `docs/templates.md`.

Arguments: $ARGUMENTS

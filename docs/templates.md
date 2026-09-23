---
title: Templates & scaffolding
description: >-
  How devkit bundles runnable starter templates that an agent copies into your project and
  adapts to the task. Covers the /scaffold command, the templates that ship today, how the
  copy-and-adapt flow works, and how to add your own.
order: 35
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Templates & scaffolding

devkit can bundle **code templates** — runnable starter files an agent copies into your
workspace and then edits to fit your task. This is the "import a template and change it" flow:
the agent reads the template, copies it in, and adapts it. (It does *not* load template code as
a library into its own runtime — it works with the files, exactly like a developer would.)

## Using `/scaffold`

```
/scaffold                          # list available templates and pick one
/scaffold langgraph-workflow ./svc # copy that template into ./svc and adapt it
/scaffold promptfoo-eval-ci        # add an eval merge gate to the current repo
```

The command discovers every bundled template, and once you choose one it:

1. copies the template's files into the target directory,
2. replaces placeholder tokens (e.g. `{{PROJECT_NAME}}`, `{{MODEL}}`),
3. adapts the code to your task (renames state fields, nodes, tools; removes unused parts),
4. summarizes what changed and tells you how to run it.

It won't overwrite existing files without asking. You can also just say *"scaffold a LangGraph
workflow that does X"* and the `agent-developer` subagent will use the same templates, loading
`devkit:agent-development` for the guidance behind them. Hub routers name the template that goes
with a reference (`/scaffold promptfoo-eval-ci` from `eval-harness-ci`, `/scaffold cicd-starters`
from the shipping hub), so Claude reaches for them on its own.

## Templates that ship today

All live under `plugins/devkit/templates/`:

| Template | What you get | Guidance behind it |
| --- | --- | --- |
| `langgraph-workflow` | A custom `StateGraph` app: typed state, a model node, a tool node, conditional routing with a loop, and a checkpointer — plus `main.py`, `requirements.txt`, and a README. | `devkit:agent-development` → `langgraph-workflows`, `workflow-design` |
| `langchain-agent` | A compact tool-calling agent: model, example tools, a prompt with the required `agent_scratchpad`, and an `AgentExecutor` in a single runnable `agent.py`. | `devkit:agent-development` → `langchain-agents` |
| `promptfoo-eval-ci` | An eval merge gate: `promptfooconfig.yaml` with a deterministic and an `llm-rubric` assertion, a seed `tests.yaml`, and a GitHub Actions workflow that runs on PRs and fails below a pass-rate threshold. | `devkit:agent-development` → `eval-harness-ci`, `llm-as-judge` |
| `cicd-starters` | Keyless-OIDC pipeline starters — `.github/workflows/deploy.yml` (GitHub Actions) and `azure-pipelines.yml` (Azure DevOps) — each with a build stage and a gated production deploy. Copy the one for your platform. | `devkit:shipping` → `cloud-infrastructure`, `github-actions`, `azure-devops` |

Each template folder contains a `TEMPLATE.md` manifest (its `name`, `description`, placeholder
tokens, and post-copy steps). `TEMPLATE.md` itself is never copied into your project.

## How it works

Templates are ordinary files stored inside the plugin. The agent reaches them through the
`${CLAUDE_PLUGIN_ROOT}` variable, which resolves to the plugin's install path, so the same
command works no matter where the plugin is installed:

```
${CLAUDE_PLUGIN_ROOT}/templates/<template>/
```

Keeping templates as **literal, valid files** means they double as reference examples and copy
cleanly. Placeholders are plain `{{TOKEN}}` strings the agent substitutes during the adapt
step.

## Adding your own template

1. Create `plugins/devkit/templates/<name>/`.
2. Add a `TEMPLATE.md` with frontmatter (`name`, `description`) and a body listing the files,
   the placeholder tokens, and the post-copy adaptation steps.
3. Add the template's files, using `{{TOKENS}}` for values the agent should fill in.

`/scaffold` finds it automatically — no wiring needed. See [Extending](extending.md#add-a-template).

## Cross-platform note

`${CLAUDE_PLUGIN_ROOT}` and `/scaffold` are Claude Code features. With other agents (Codex,
Cursor), point them at the template by its repo-relative path instead, e.g. *"Copy
`plugins/devkit/templates/langgraph-workflow/` into ./svc and adapt
it."* The templates themselves are plain files and port fine.

## Related

- [Skill hubs](skill-packs.md) — the references behind these templates.
- [Extending](extending.md) — add templates, references, hubs, agents, and hooks.
- [Code map](code-map.md) — where templates and the scaffold command live.

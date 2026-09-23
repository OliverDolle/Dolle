---
name: agent-development
description: Call before building, prompting, evaluating, or debugging an AI agent or LLM feature — LangChain, LangGraph, system prompts, evals, voice (STT/TTS).
---

# Agent development — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

LangChain supplies models, tools, prompts, output parsers; LangGraph supplies the stateful control
flow. Real work usually uses both. Build, then measure — the eval references prove it works.

| Reference | Read it when |
| --- | --- |
| `langchain-agents` | Building a tool-using assistant without hand-managing the loop. |
| `langgraph-workflows` | Control flow matters — branching, loops with exit conditions, memory across turns, approval steps. |
| `combining-langchain-and-langgraph` | Unsure which does what, or wiring both together. |
| `workflow-design` | **Before** writing a non-trivial graph. Most workflow bugs are control-flow bugs. |
| `prompt-engineering` | Writing or improving a system prompt — structure, few-shot, structured output, model-specific tips. (A *user's* vague request is `devkit:process` → `references/prompt-enhancement.md`.) |
| `speech-to-text` / `text-to-speech` | Adding voice input or output. A voice agent needs both, streaming. |
| `eval-foundations` | Deciding what "good" means — task/component/trajectory evals, the dataset. Start evals here. |
| `llm-as-judge` | Scoring open-ended output with a model — rubric design, judge bias. |
| `eval-harness-ci` | Gating merges on an eval pass rate. Starter: `/scaffold promptfoo-eval-ci`. |
| `langgraph-workflow-evals` | Evaluating a `StateGraph` specifically — node, trajectory, final-response evaluators. |
| `tracing-observability` | Tracing or monitoring an agent — OpenTelemetry GenAI, online evals, drift. |
| `troubleshooting` | You hit an error. **Append an entry** when you fix one that isn't listed. |

Paths: `references/<name>.md`. From scratch: `langchain-agents` + `langgraph-workflows`.

**Binds regardless:** fast path first (`create_react_agent` before a custom `StateGraph`); a hard exit
on every loop; verify package names, signatures, model names, and prices against what's installed or
current — these move between minor releases. Design the eval dataset alongside the agent, not after.

Starters at `${CLAUDE_PLUGIN_ROOT}/templates/` via `/scaffold`. Dispatch `agent-developer` for larger
builds.

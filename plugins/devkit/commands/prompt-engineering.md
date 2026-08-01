---
description: "Use when writing or improving a prompt or system prompt for an LLM — the craft of reliable output, not sharpening a user's request (that's /prompt-enhancement). Covers prompt structure & XML/delimiters, few-shot, chain-of-thought vs. reasoning models, output/structured-output control, prompt patterns (chaining/routing/parallel/evaluator), eval-driven iteration, and Claude/OpenAI model-specific tips. Triggers: 'write a prompt', 'improve this prompt', 'system prompt', 'few-shot', 'structured output', 'prompt template', 'prompt patterns'."
argument-hint: "[optional: the prompt or task to write a prompt for]"
---

**A prompt- or system-prompt-authoring task matches this command — load it before writing the
prompt; do not wing it from memory.** Read the file
`${CLAUDE_PLUGIN_ROOT}/packs/prompt-engineering/SKILL.md` in full and follow it as the active
method for this work.

This is the *craft of the prompt*. If instead the user's own request to you is vague and needs
clarifying, that's `/prompt-enhancement`; turning an app idea into a spec is `/app-prompt`;
writing the brief for a subagent is `/subagents writing-subagent-instructions`.

Then:
1. Confirm in one line that the **prompt-engineering** section is loaded.
2. Summarize the method in 3–5 bullets: structure with clear sections/delimiters (put long data
   at the top); show 3–5 diverse examples; match reasoning effort to the model (don't force
   step-by-step on reasoning models); pin the output format (structured output); iterate against
   an eval set.
3. If the user provided a prompt or task below, start on it.

User task (optional): $ARGUMENTS

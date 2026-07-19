---
description: "Use when a request is vague, underspecified, or could be read several ways — BEFORE doing the work. Diagnose the missing goal/context/constraints/success-criteria, clarify the blocking gaps with AskUserQuestion, then restate a sharpened prompt. Triggers: 'help me write a prompt', 'this is vague', 'scope this task', 'what should I ask', 'refine my request'."
argument-hint: "[optional: a rough request to enhance, or a task to scope]"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/prompt-enhancement/SKILL.md` in full and adopt it as
active guidance for the rest of this session.

Then:
1. Confirm in one line that the **prompt-enhancement** section is loaded.
2. Summarize the method in 3–5 bullets: diagnose what the prompt is missing (goal, context, scope,
   constraints, success criteria, output format, examples); decide ask-vs-assume by whether the
   answer would change what you do next; clarify only the blocking gaps with **AskUserQuestion**
   (2–4 tappable options, recommended first, batched); read the codebase before asking anything it
   can answer; sharpen the request into a structured prompt and restate it before expensive work.
3. If the user supplied a rough request below, run the method on it now — diagnose the gaps, ask
   only the blocking questions via AskUserQuestion, then restate the sharpened prompt for
   confirmation.

User task (optional): $ARGUMENTS

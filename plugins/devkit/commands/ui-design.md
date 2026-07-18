---
description: Load the ui-design skill — the tool-agnostic craft of great UI (hierarchy, spacing/type scales, semantic color & contrast, component states, forms, feedback, responsive, accessibility) plus a review checklist.
argument-hint: "[optional: the screen/component/flow you're designing, or a UI to review]"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/SKILL.md` in full and adopt it as active
guidance for the rest of this session.

Then:
1. Confirm in one line that the **ui-design** section is loaded.
2. Summarize the method in 3–5 bullets: establish hierarchy (one primary action per view); one
   spacing scale + a small type scale (body ≥16px, 45–75ch lines); semantic color roles with
   **AA contrast** and meaning never by color alone; design **every** component state
   (hover/focus/active/disabled/loading) and all four content states (empty/loading/error/overflow);
   forms one-column with real labels + specific inline validation; accessibility and reduced-motion
   are constraints, not phases — finish against the review checklist.
3. If the user named a screen/component to design or a UI to review below, start there — apply the
   checklist. For *aesthetic direction* lean on `frontend-design`; to *build* it on the Dolle-MCP
   server use `devkit:ui-ux-design`.

User task (optional): $ARGUMENTS

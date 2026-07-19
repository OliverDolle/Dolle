---
description: "Use when designing or reviewing the craft of any screen, component, or flow — BEFORE finalizing a UI. Tool-agnostic fundamentals: visual hierarchy, spacing/type scales, semantic color and WCAG contrast, every component and content state, forms, feedback, responsive layout, accessibility, plus a review checklist. Triggers: 'design this screen', 'review my UI', 'improve the layout', 'fix the spacing', 'form design'."
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

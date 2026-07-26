---
description: "Use when a page feels slow or BEFORE shipping a new page/site — to hit Core Web Vitals (LCP, CLS, INP). Measure first (lab + field), then apply the per-metric fix playbook and JS/image/font/third-party budgets. Triggers: 'page is slow', 'optimize load time', 'improve performance', 'reduce bundle size', 'core web vitals', 'lighthouse score'."
argument-hint: "[optional: a page/URL to optimize, or a metric e.g. 'LCP']"
---

**A "page is slow / hit Core Web Vitals" request matches this command — load it before optimizing;
do not guess at fixes.** Read the file `${CLAUDE_PLUGIN_ROOT}/packs/web-performance/SKILL.md` in full
and follow it as the active method for this work.

Then:
1. Confirm in one line that the **web-performance** section is loaded.
2. Summarize the method in 3–5 bullets: measure first (lab via Lighthouse throttled to mobile,
   then field via the `web-vitals` lib / CrUX); the three Core Web Vitals and their 75th-percentile
   thresholds (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms); fix by metric (LCP → images/fonts/TTFB,
   CLS → reserve space, INP → unblock the main thread); hold JS/image/font/third-party budgets;
   change one thing and re-measure.
3. If the user named a page or metric below, start there — establish the baseline numbers before
   proposing changes, and attribute each win to a specific change.

User task (optional): $ARGUMENTS

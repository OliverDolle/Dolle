#!/usr/bin/env node
// devkit SessionStart hook.
// Injects a one-line reminder so the on-demand skills are discoverable, without
// loading any skill body into context.
//
// Written in Node (guaranteed present wherever Claude Code runs) so it behaves
// identically on Windows, macOS, and Linux, avoiding shell-quoting differences.

const context =
  "devkit is available as four skill hubs: devkit:agent-development (LangChain/LangGraph), " +
  "devkit:design (web, desktop, UI craft, design systems, Core Web Vitals), devkit:shipping " +
  "(Docker, Kubernetes, CI/CD & IaC), devkit:process (prompt sharpening, app specs, subagents, " +
  "docs). Invoke a hub with the Skill tool — its body is a short router listing references and " +
  "when to read each; read only the reference the task needs. Never read a devkit SKILL.md off " +
  "disk. Run /devkit for the menu. Only the four descriptions sit in startup context.";

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context,
    },
  })
);

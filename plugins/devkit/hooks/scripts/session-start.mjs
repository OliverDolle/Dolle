#!/usr/bin/env node
// devkit SessionStart hook.
// Injects a one-line reminder so the on-demand skill-pack system is discoverable,
// without loading any pack content into context.
//
// Written in Node (guaranteed present wherever Claude Code runs) so it behaves
// identically on Windows, macOS, and Linux, avoiding shell-quoting differences.

const context =
  "devkit is available. Run /devkit to list the on-demand skill sections " +
  "(agent-development, subagent-driven development, documentation, ui-ux-design, " +
  "web-performance). " +
  "Each section loads only when you call its command, so startup context stays minimal.";

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context,
    },
  })
);

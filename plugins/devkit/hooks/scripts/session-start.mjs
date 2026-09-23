#!/usr/bin/env node
// devkit SessionStart hook.
// One short line reinforcing the hub descriptions: call a hub before the work, read one reference.
// Kept deliberately tiny — it is paid for in every session.
//
// Written in Node (guaranteed present wherever Claude Code runs) so it behaves
// identically on Windows, macOS, and Linux, avoiding shell-quoting differences.

const context =
  "devkit: before UI, agent/LLM, shipping, debugging/database, or planning work, call the matching " +
  "devkit hub with the Skill tool and read only the reference its router names.";

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context,
    },
  })
);

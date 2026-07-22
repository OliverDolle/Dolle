#!/usr/bin/env node
// devkit SessionStart hook.
//
// 1) Injects a one-line reminder so the on-demand skill-pack system is discoverable,
//    without loading any pack content into context.
// 2) Checks that `uvx` (shipped with `uv`) is on PATH — the bundled Dolle-MCP design
//    server launches via it. If it is NOT found, it injects guidance that tells the
//    agent to first ASK the user whether uv is installed (the PATH check can miss a uv
//    that is installed but not on the PATH this hook sees), and to offer the install
//    command for Windows, macOS, and Linux. It only DETECTS and GUIDES; it never
//    installs anything itself.
//
// Written in Node (guaranteed present wherever Claude Code runs) so it behaves
// identically on Windows, macOS, and Linux, avoiding shell-quoting differences.

import { spawnSync } from "node:child_process";

// True if `command` resolves on PATH. Uses `where` (Windows) / `which` (POSIX), which
// are themselves reliably present. If the finder itself can't be spawned, assume the
// command is present so we don't nag with a false warning.
function onPath(command) {
  const finder = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(finder, [command], { stdio: "ignore" });
  if (result.error) return true;
  return result.status === 0;
}

let context =
  "devkit is available. Run /devkit to list the on-demand skill sections " +
  "(agent-development, subagent-driven development, documentation, ui-ux-design, " +
  "web-performance, ui-design, gui-design, containerization, kubernetes, " +
  "cloud-infrastructure, prompt-enhancement, app-prompt). " +
  "Each section loads only when you call its command, so startup context stays minimal.";

if (!onPath("uvx")) {
  const detectedOs =
    process.platform === "win32"
      ? "Windows"
      : process.platform === "darwin"
        ? "macOS"
        : "Linux";

  context +=
    " NOTE FOR THE ASSISTANT: the bundled Dolle-MCP design server did not start because `uvx` " +
    "(from `uv`) was not found on PATH, so its tools (templates, curated palettes, WCAG contrast, " +
    "SVG, screenshots) are unavailable this session. When the user's task would use these design " +
    "tools (or they ask about the design server), do this:\n" +
    "1) FIRST ask the user whether they already have `uv` installed. This PATH check can miss a uv " +
    "that is installed but not on the PATH this hook sees, so confirm before assuming it's absent. " +
    "(Detected OS: " +
    detectedOs +
    ".)\n" +
    "2) If they DO have it: have them make sure `uv`/`uvx` is on PATH, then restart Claude Code so " +
    "the server relaunches.\n" +
    "3) If they DON'T: offer the install command for their OS, then a restart:\n" +
    '   • Windows (PowerShell): powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"\n' +
    "   • macOS:                curl -LsSf https://astral.sh/uv/install.sh | sh   (or: brew install uv)\n" +
    "   • Linux:                curl -LsSf https://astral.sh/uv/install.sh | sh\n" +
    "   • Any OS with Python:   pipx install uv   (or: pip install uv)\n" +
    "Do NOT run the installer without the user's explicit go-ahead. After install + restart the " +
    "server auto-launches; its screenshot tools also need a one-time `uvx playwright install chromium`. " +
    "devkit's design skills still work without the server — they just lose the live template, " +
    "palette, contrast, and screenshot tooling.";
}

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context,
    },
  })
);

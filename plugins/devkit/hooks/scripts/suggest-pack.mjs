#!/usr/bin/env node
// devkit UserPromptSubmit hook.
// If the user's prompt mentions a topic a devkit hub covers, inject a short one-line hint naming
// the hub and — where the keywords are specific enough — the exact reference to read. It prints
// NOTHING when no topic matches, so it is silent on unrelated prompts.
//
// This is the second half of the lazy-loading UX: a hub's router body is not loaded until it is
// invoked, and its references are read only on demand — but the hook nudges you toward the right
// one exactly when it is relevant.
//
// The script never blocks a prompt: any error results in no output and a clean exit.

import { readFileSync } from "node:fs";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function main() {
  const raw = readStdin();
  if (!raw) return;

  let prompt = "";
  try {
    prompt = String(JSON.parse(raw).prompt || "").toLowerCase();
  } catch {
    return;
  }
  if (!prompt) return;

  // One entry per hub. A group's `hint` names the reference its keywords point at, so the model
  // can go straight there instead of scanning the whole router. `hint: null` means the keywords
  // identify the hub but not which reference.
  const hubs = [
    {
      label: "devkit:agent-development",
      groups: [
        { hint: "references/langchain-agents.md", keys: ["langchain", "tool-calling", "tool calling", "agentexecutor", "agent_scratchpad", "with_structured_output"] },
        { hint: "references/langgraph-workflows.md", keys: ["langgraph", "stategraph", "state graph", "create_react_agent", "react agent", "checkpointer", "human-in-the-loop", "human in the loop"] },
        { hint: "references/workflow-design.md", keys: ["agent workflow", "workflow design", "design a workflow"] },
        { hint: "references/troubleshooting.md", keys: ["graphrecursionerror", "recursion limit"] },
        { hint: null, keys: ["build an agent", "ai agent", "llm workflow"] },
      ],
    },
    {
      label: "devkit:design",
      groups: [
        { hint: "references/ui-fundamentals.md", keys: ["design great ui", "great ui", "ui fundamentals", "visual hierarchy", "spacing scale", "type scale", "component states", "empty state", "loading state", "form design", "accessible ui", "wcag contrast", "review my ui", "fix the spacing"] },
        { hint: "references/design-systems.md", keys: ["design system", "design tokens", "design token", "component library", "theming"] },
        { hint: "references/web-dolle-mcp.md", keys: ["ui design", "ux design", "ui/ux", "web design", "landing page", "design a page", "design a site", "design a website", "build a website", "color palette", "colour palette", "menu bar", "menubar", "navbar", "hero section", "dolle-mcp", "svg animation", "style the page"] },
        { hint: "references/desktop-native.md", keys: ["desktop app", "desktop gui", "native gui", "native app", "qt app", "qt widgets", "pyqt", "pyside", "qml", "qmainwindow", "gtk", "wxwidgets", "winui", "human interface guidelines"] },
        { hint: "references/web-performance.md", keys: ["core web vitals", "web vitals", "lighthouse", "lcp", "cls", "inp", "page speed", "pagespeed", "slow page", "load time", "optimize performance", "performance budget", "bundle size"] },
      ],
    },
    {
      label: "devkit:shipping",
      groups: [
        { hint: "references/containerization.md", keys: ["docker", "dockerfile", "docker compose", "docker-compose", "container image", "containerize", "containerise", "multi-stage build", "multistage build", "image size", ".dockerignore", "buildkit", "distroless"] },
        { hint: "references/kubernetes.md", keys: ["kubernetes", "k8s", "kubectl", "kubernetes manifest", "deployment yaml", "helm", "helm chart", "kustomize", "ingress", "configmap", "liveness probe", "readiness probe", "crashloopbackoff", "hpa", "pod"] },
        { hint: "references/cloud-infrastructure.md", keys: ["ci/cd", "cicd", "ci pipeline", "github actions", "gitlab ci", "terraform", "opentofu", "infrastructure as code", "iac", "cloud run", "aws lambda", "serverless", "fargate", "deploy pipeline", "oidc"] },
      ],
    },
    {
      label: "devkit:process",
      groups: [
        { hint: "references/prompt-enhancement.md", keys: ["prompt enhancement", "enhance my prompt", "enhance the prompt", "improve my prompt", "improve the prompt", "refine my prompt", "better prompt", "prompt engineering", "clarify my request", "clarifying questions", "ask me questions", "askuserquestion", "underspecified", "scope this task"] },
        { hint: "references/app-prompt.md", keys: ["build an app", "build me an app", "build an application", "create an app", "make an app", "spec out", "spec this app", "app spec", "app requirements", "build brief", "plan this application", "plan an app", "turn my idea into", "app idea"] },
        { hint: "references/subagents.md", keys: ["subagent", "sub-agent", "sub agent", "orchestrate agents", "fan out agents", "fan-out", "break this down", "parallelize this"] },
        { hint: "references/documentation.md", keys: ["documentation", "document the", "write docs", "readme", "doc index", "docs are stale"] },
      ],
    },
  ];

  const hits = [];
  for (const hub of hubs) {
    const refs = [];
    let matched = false;
    for (const g of hub.groups) {
      if (!g.keys.some((k) => prompt.includes(k))) continue;
      matched = true;
      if (g.hint && !refs.includes(g.hint)) refs.push(g.hint);
    }
    if (!matched) continue;
    hits.push(refs.length ? `${hub.label} (${refs.join(", ")})` : hub.label);
  }

  if (hits.length === 0) return;

  const context =
    "devkit hint: these devkit skill(s) cover your request: " +
    hits.join("; ") +
    ". Invoke the hub with the Skill tool, then read only the reference named — never read a devkit SKILL.md off disk.";

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: context,
      },
    })
  );
}

try {
  main();
} catch {
  // Never block the user's prompt on a hook failure.
}

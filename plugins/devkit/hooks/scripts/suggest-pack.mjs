#!/usr/bin/env node
// devkit UserPromptSubmit hook.
// If the user's prompt mentions a topic that a devkit pack covers, inject a short,
// one-line hint suggesting the matching loader command. It prints NOTHING when no
// topic matches, so it is silent on unrelated prompts.
//
// This is the second half of the lazy-loading UX: packs are not auto-loaded, but
// the hook nudges you toward the right one exactly when it is relevant.
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

  const packs = [
    {
      label: "agent development (/agent-development)",
      keys: [
        "langchain",
        "langgraph",
        "stategraph",
        "state graph",
        "create_react_agent",
        "react agent",
        "tool-calling",
        "tool calling",
        "build an agent",
        "ai agent",
        "agent workflow",
        "checkpointer",
      ],
    },
    {
      label: "subagent-driven development (/subagents)",
      keys: ["subagent", "sub-agent", "sub agent", "orchestrate agents", "fan out agents", "fan-out"],
    },
    {
      label: "documentation (/docs)",
      keys: ["documentation", "document the", "write docs", "readme", "doc index"],
    },
    {
      label: "ui/ux design (/ui-ux-design)",
      keys: [
        "ui design",
        "ux design",
        "ui/ux",
        "web design",
        "landing page",
        "design a page",
        "design a site",
        "design a website",
        "color palette",
        "colour palette",
        "menu bar",
        "menubar",
        "navbar",
        "dolle-mcp",
        "svg animation",
        "style the page",
      ],
    },
    {
      label: "web performance (/web-performance)",
      keys: [
        "core web vitals",
        "web vitals",
        "lighthouse",
        "lcp",
        "cls",
        "inp",
        "page speed",
        "pagespeed",
        "slow page",
        "load time",
        "optimize performance",
        "performance budget",
        "bundle size",
      ],
    },
    {
      label: "ui design — fundamentals & design systems (/ui-design)",
      keys: [
        "design great ui",
        "great ui",
        "ui fundamentals",
        "visual hierarchy",
        "spacing scale",
        "type scale",
        "design system",
        "design tokens",
        "design token",
        "component library",
        "theming",
        "component states",
        "empty state",
        "loading state",
        "form design",
        "accessible ui",
        "wcag contrast",
      ],
    },
    {
      label: "gui design — native/desktop (/gui-design)",
      keys: [
        "desktop app",
        "desktop gui",
        "native gui",
        "native app",
        "qt app",
        "qt widgets",
        "pyqt",
        "pyside",
        "qml",
        "qmainwindow",
        "gtk",
        "wxwidgets",
        "winui",
        "human interface guidelines",
      ],
    },
    {
      label: "containerization (/containerization)",
      keys: [
        "docker",
        "dockerfile",
        "docker compose",
        "docker-compose",
        "container image",
        "containerize",
        "containerise",
        "multi-stage build",
        "multistage build",
        "image size",
        ".dockerignore",
        "buildkit",
        "distroless",
      ],
    },
    {
      label: "kubernetes (/kubernetes)",
      keys: [
        "kubernetes",
        "k8s",
        "kubectl",
        "kubernetes manifest",
        "deployment yaml",
        "helm",
        "helm chart",
        "kustomize",
        "ingress",
        "configmap",
        "liveness probe",
        "readiness probe",
        "crashloopbackoff",
        "hpa",
        "pod",
      ],
    },
    {
      label: "cloud infrastructure (/cloud-infrastructure)",
      keys: [
        "ci/cd",
        "cicd",
        "ci pipeline",
        "github actions",
        "gitlab ci",
        "terraform",
        "opentofu",
        "infrastructure as code",
        "iac",
        "cloud run",
        "aws lambda",
        "serverless",
        "fargate",
        "deploy pipeline",
        "oidc",
      ],
    },
    {
      label: "prompt enhancement (/prompt-enhancement)",
      keys: [
        "prompt enhancement",
        "enhance my prompt",
        "enhance the prompt",
        "improve my prompt",
        "improve the prompt",
        "refine my prompt",
        "better prompt",
        "prompt engineering",
        "clarify my request",
        "clarifying questions",
        "ask me questions",
        "askuserquestion",
        "underspecified",
      ],
    },
    {
      label: "app prompt engineering (/app-prompt)",
      keys: [
        "build an app",
        "build me an app",
        "build an application",
        "create an app",
        "make an app",
        "spec out",
        "spec this app",
        "app spec",
        "app requirements",
        "build brief",
        "plan this application",
        "plan an app",
        "turn my idea into",
        "app idea",
      ],
    },
  ];

  const hits = packs
    .filter((p) => p.keys.some((k) => prompt.includes(k)))
    .map((p) => p.label);

  if (hits.length === 0) return;

  const context =
    "devkit hint: your request relates to these skill section(s): " +
    hits.join(", ") +
    ". If you have not loaded the relevant section yet, run its command (or /devkit) to pull in focused guidance.";

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

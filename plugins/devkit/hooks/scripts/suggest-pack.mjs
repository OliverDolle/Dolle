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
      keys: [
        "subagent",
        "sub-agent",
        "sub agent",
        "orchestrate agents",
        "fan out agents",
        "fan-out",
        "delegate to an agent",
        "subagent prompt",
        "subagent instructions",
        "agent system prompt",
        "worker brief",
        "guide subagents",
        "guide sub agents",
      ],
    },
    {
      label: "ai agent evaluation (/agent-evaluation)",
      keys: [
        "evaluate my agent",
        "agent eval",
        "llm eval",
        "llm-as-judge",
        "llm as a judge",
        "llm as judge",
        "promptfoo",
        "deepeval",
        "ragas",
        "langsmith",
        "langfuse",
        "braintrust",
        "eval dataset",
        "regression test prompt",
        "trajectory eval",
        "tool-call eval",
        "faithfulness",
        "hallucination eval",
        "eval harness",
        "gate deploy on eval",
        "opentelemetry genai",
        "otel llm",
        "trace my agent",
        "evaluate my langgraph",
        "langsmith eval",
        "trajectory evaluation",
        "node-level eval",
        "evaluate agent workflow",
      ],
    },
    {
      label: "documentation (/docs)",
      keys: ["documentation", "document the", "write docs", "readme", "doc index"],
    },
    {
      label: "database design & configuration (/database-design)",
      keys: [
        "database",
        "schema",
        "data model",
        "normalize",
        "normalization",
        "denormalize",
        "sql vs nosql",
        "postgres",
        "postgresql",
        "mysql",
        "index",
        "indexing",
        "slow query",
        "explain analyze",
        "migration",
        "db migration",
        "database migration",
        "connection pool",
        "pgbouncer",
        "isolation level",
        "deadlock",
        "orm",
        "foreign key",
        "database backup",
      ],
    },
    {
      label: "extensible code architecture (/extensible-architecture)",
      keys: [
        "extensible",
        "extensibility",
        "make it extensible",
        "modular architecture",
        "decouple",
        "loose coupling",
        "tight coupling",
        "separation of concerns",
        "dependency injection",
        "dependency inversion",
        "open-closed",
        "open closed",
        "solid principles",
        "plugin architecture",
        "extension point",
        "hexagonal architecture",
        "ports and adapters",
        "clean architecture",
        "refactor toward seams",
        "module boundaries",
        "package by feature",
        "stable api",
        "stable contract",
        "feature flag",
        "feature toggle",
      ],
    },
    {
      label: "deployment pipelines — github actions & azure devops (/deployment-pipelines)",
      keys: [
        "azure pipelines",
        "azure devops",
        "azure-pipelines.yml",
        "service connection",
        "workload identity federation",
        "variable group",
        "deployment job",
        "multi-stage pipeline",
        "reusable workflow",
        "composite action",
        "github environment",
        "deployment protection",
        "required reviewers",
        "matrix build",
        "attest",
        "slsa provenance",
        "dependabot",
        "pin actions",
        "github actions workflow",
      ],
    },
    {
      label: "systematic debugging (/systematic-debugging)",
      keys: [
        "debug this",
        "debug the",
        "why is this failing",
        "why does this fail",
        "systematic debugging",
        "root cause",
        "flaky test",
        "works on my machine",
        "can't reproduce",
        "stack trace",
        "git bisect",
        "heisenbug",
        "race condition",
        "segfault",
      ],
    },
    {
      label: "speech interfaces — STT & TTS (/speech-interfaces)",
      keys: [
        "speech to text",
        "speech-to-text",
        "text to speech",
        "text-to-speech",
        "speech recognition",
        "speech synthesis",
        "transcribe audio",
        "transcription",
        "whisper",
        "deepgram",
        "elevenlabs",
        "voice input",
        "voice output",
        "voice agent",
        "wake word",
        "ssml",
      ],
    },
    {
      label: "embedded dev boards — ESP32 (/esp32)",
      keys: [
        "esp32",
        "esp-idf",
        "esp idf",
        "esp8266",
        "platformio",
        "can't upload to esp",
        "cant upload to esp",
        "flash firmware",
        "xtaskcreatepinnedtocore",
        "freertos",
        "dual core",
        "strapping pin",
        "brownout",
        "arduino esp",
      ],
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
        "deploy to kubernetes",
        "gitops",
        "argocd",
        "argo cd",
        "flux cd",
        "argo rollouts",
        "flagger",
        "progressive delivery",
        "canary deployment",
        "kubectl rollout",
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
      label: "prompt engineering — the craft of the prompt (/prompt-engineering)",
      keys: [
        "write a prompt",
        "write a system prompt",
        "system prompt",
        "improve this prompt",
        "improve my prompt",
        "few-shot",
        "few shot",
        "multishot",
        "chain-of-thought",
        "chain of thought",
        "structured output",
        "prompt template",
        "prompt pattern",
        "prompt patterns",
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

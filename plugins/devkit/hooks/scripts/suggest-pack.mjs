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
// Keywords match on word boundaries (a trailing "s"/"es" is allowed), so "inp" does not fire on
// "input" and "pod" does not fire on "podcast".
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

function keyPattern(key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const head = /^[a-z0-9]/.test(key) ? "(?<![a-z0-9])" : "";
  const tail = /[a-z0-9]$/.test(key) ? "(?:s|es)?(?![a-z0-9])" : "";
  return new RegExp(head + escaped + tail);
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
        { hint: "references/prompt-engineering.md", keys: ["system prompt", "few-shot", "few shot", "prompt template", "prompt pattern", "structured output"] },
        { hint: "references/speech-to-text.md", keys: ["speech to text", "speech-to-text", "stt", "speech recognition", "transcribe", "transcription", "whisper", "voice input", "dictation"] },
        { hint: "references/text-to-speech.md", keys: ["text to speech", "text-to-speech", "tts", "speech synthesis", "elevenlabs", "voice output", "ssml"] },
        { hint: "references/eval-foundations.md", keys: ["evaluate my agent", "evaluate the agent", "agent evaluation", "llm eval", "eval dataset", "golden dataset"] },
        { hint: "references/llm-as-judge.md", keys: ["llm-as-judge", "llm as judge", "llm as a judge", "llm judge", "model-graded"] },
        { hint: "references/eval-harness-ci.md", keys: ["promptfoo", "regression test prompts", "eval gate", "evals in ci", "eval in ci"] },
        { hint: "references/langgraph-workflow-evals.md", keys: ["langsmith", "agentevals", "trajectory eval"] },
        { hint: "references/tracing-observability.md", keys: ["trace my agent", "agent tracing", "llm observability", "opentelemetry genai", "langfuse"] },
        { hint: "references/troubleshooting.md", keys: ["graphrecursionerror", "recursion limit"] },
        { hint: null, keys: ["build an agent", "ai agent", "llm workflow", "voice agent"] },
      ],
    },
    {
      label: "devkit:design",
      groups: [
        { hint: "references/ui-fundamentals.md", keys: ["design great ui", "great ui", "ui fundamentals", "visual hierarchy", "spacing scale", "type scale", "component states", "empty state", "loading state", "form design", "accessible ui", "wcag contrast", "review my ui", "fix the spacing", "improve the ui", "improve my ui"] },
        { hint: "references/anti-slop.md", keys: ["anti-slop", "ai slop", "ai-generated", "ai generated", "looks generic", "less generic", "too generic"] },
        { hint: "references/structural-variety.md", keys: ["page shape", "page structure", "footer design", "nav archetype"] },
        { hint: "references/type-and-color.md", keys: ["font pairing", "typeface", "typography", "oklch"] },
        { hint: "references/surfaces-and-details.md", keys: ["card design", "border radius", "box shadow", "drop shadow", "glassmorphism"] },
        { hint: "references/motion-and-interaction.md", keys: ["animation", "micro-interaction", "microinteraction", "easing", "framer motion"] },
        { hint: "references/data-visualization.md", keys: ["chart", "dashboard", "data viz", "dataviz", "data visualization", "visualize data"] },
        { hint: "references/design-systems.md", keys: ["design system", "design tokens", "design token", "component library", "theming"] },
        { hint: "references/web-dolle-mcp.md", keys: ["ui design", "ux design", "ui/ux", "web design", "landing page", "design a page", "design a site", "design a website", "build a website", "color palette", "colour palette", "menu bar", "menubar", "navbar", "hero section", "dolle-mcp", "svg animation", "style the page"] },
        { hint: "references/desktop-native.md", keys: ["desktop app", "desktop gui", "native gui", "native app", "qt app", "qt widgets", "pyqt", "pyside", "qml", "qmainwindow", "gtk", "wxwidgets", "winui", "human interface guidelines"] },
        { hint: "references/web-performance.md", keys: ["core web vitals", "web vitals", "lighthouse", "lcp", "cls", "inp", "page speed", "pagespeed", "slow page", "load time", "optimize performance", "performance budget", "bundle size"] },
      ],
    },
    {
      label: "devkit:shipping",
      groups: [
        { hint: "references/containerization.md", keys: ["docker", "dockerfile", "dockerize", "docker compose", "docker-compose", "container image", "containerize", "containerise", "multi-stage build", "multistage build", "image size", ".dockerignore", "buildkit", "distroless"] },
        { hint: "references/kubernetes.md", keys: ["kubernetes", "k8s", "kubectl", "kubernetes manifest", "deployment yaml", "helm", "helm chart", "kustomize", "ingress", "configmap", "liveness probe", "readiness probe", "crashloopbackoff", "hpa", "pod"] },
        { hint: "references/kubernetes-gitops.md", keys: ["gitops", "argo cd", "argocd", "argo rollouts", "flagger", "fluxcd", "flux cd", "canary", "blue-green", "blue/green", "progressive delivery"] },
        { hint: "references/cloud-infrastructure.md", keys: ["ci/cd", "cicd", "ci pipeline", "github actions", "gitlab ci", "terraform", "opentofu", "infrastructure as code", "iac", "cloud run", "aws lambda", "serverless", "fargate", "deploy pipeline", "oidc"] },
        { hint: "references/github-actions.md", keys: ["github actions", "github workflow", ".github/workflows", "reusable workflow", "pin actions"] },
        { hint: "references/azure-devops.md", keys: ["azure devops", "azure pipelines", "azure-pipelines", "service connection"] },
      ],
    },
    {
      label: "devkit:engineering",
      groups: [
        { hint: "references/systematic-debugging.md", keys: ["debug this", "debugging", "why is this failing", "root cause", "flaky", "stack trace", "bisect", "works on my machine"] },
        { hint: "references/extensible-architecture.md", keys: ["extensible", "plugin architecture", "decouple", "dependency injection", "hexagonal", "ports and adapters", "open-closed", "module boundaries", "refactor toward seams"] },
        { hint: "references/data-modeling.md", keys: ["design a schema", "schema design", "database schema", "data model", "sql vs nosql", "normalization", "entity relationship"] },
        { hint: "references/database-operations.md", keys: ["slow query", "explain analyze", "query plan", "database migration", "db migration", "connection pool", "pgbouncer", "isolation level", "deadlock", "postgres tuning", "add an index"] },
        { hint: "references/esp32.md", keys: ["esp32", "esp-idf", "esp idf", "platformio", "freertos", "flash firmware", "firmware", "brownout", "strapping pin"] },
      ],
    },
    {
      label: "devkit:process",
      groups: [
        { hint: "references/prompt-enhancement.md", keys: ["prompt enhancement", "enhance my prompt", "enhance the prompt", "improve my prompt", "improve the prompt", "refine my prompt", "better prompt", "prompt engineering", "clarify my request", "clarifying questions", "ask me questions", "askuserquestion", "underspecified", "scope this task"] },
        { hint: "references/app-prompt.md", keys: ["build an app", "build me an app", "build an application", "create an app", "make an app", "spec out", "spec this app", "app spec", "app requirements", "build brief", "plan this application", "plan an app", "turn my idea into", "app idea"] },
        { hint: "references/subagents.md", keys: ["subagent", "sub-agent", "sub agent", "orchestrate agents", "fan out agents", "fan-out", "break this down", "parallelize this"] },
        { hint: "references/subagent-briefs.md", keys: ["subagent prompt", "subagent brief", "subagent instructions", "worker brief"] },
        { hint: "references/documentation.md", keys: ["documentation", "document the", "write docs", "readme", "doc index", "docs are stale"] },
      ],
    },
  ];

  const hits = [];
  for (const hub of hubs) {
    const refs = [];
    let matched = false;
    for (const g of hub.groups) {
      if (!g.keys.some((k) => keyPattern(k).test(prompt))) continue;
      matched = true;
      if (g.hint && !refs.includes(g.hint)) refs.push(g.hint);
    }
    if (!matched) continue;
    hits.push(refs.length ? `${hub.label} (${refs.join(", ")})` : hub.label);
  }

  if (hits.length === 0) return;

  const context =
    "devkit hint: call " +
    hits.join("; ") +
    " with the Skill tool before starting, then read only the reference named.";

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

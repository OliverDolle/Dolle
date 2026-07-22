---
name: promptfoo-eval-ci
description: Starter for gating an LLM prompt/agent on quality in CI with promptfoo — a config with both a deterministic and a model-graded (llm-rubric) assertion, a seed dataset, and a GitHub Actions workflow that runs on PRs and fails below a pass-rate threshold. Copy it in and adapt the provider, prompt, and cases.
---

# Template: promptfoo eval-in-CI

A minimal, runnable eval gate. It evaluates a prompt against a small dataset with a mix of
deterministic and LLM-as-judge assertions (see the `eval-harness-ci` skill §1), and fails
the build when the pass rate drops below a threshold (§2). Use it to protect a prompt,
model, or agent change from silently regressing.

## Files (copy all except this TEMPLATE.md)
- `promptfooconfig.yaml` — provider, prompt, and assertions (deterministic + `llm-rubric`)
- `tests.yaml` — the seed eval dataset (test cases: vars + per-case asserts)
- `.github/workflows/eval.yml` — runs the eval on PRs, fails below the pass-rate threshold

## Placeholders to replace
- `{{PROVIDER}}` — the promptfoo provider id for the model under test
  (e.g. `openai:gpt-4o-mini`, `anthropic:messages:claude-3-5-haiku-latest`). Verify the
  current provider id and model name for your vendor before committing.
- `{{JUDGE_PROVIDER}}` — provider id for the `llm-rubric` judge (a capable model, ideally a
  different family from the one under test — see `llm-as-judge` §3). May equal `{{PROVIDER}}`.
- `{{API_KEY_SECRET}}` — the GitHub Actions secret name holding the model API key
  (e.g. `OPENAI_API_KEY`). Set it under repo Settings → Secrets and variables → Actions.
- `{{API_KEY_ENV}}` — the env var name the provider SDK reads (e.g. `OPENAI_API_KEY`).
- `{{PASS_THRESHOLD}}` — minimum pass rate to allow the merge, as a fraction (e.g. `0.9`).

## After copying — adapt to the task
1. Set `{{PROVIDER}}` / `{{JUDGE_PROVIDER}}` and confirm the provider ids/model names are
   current for your vendor.
2. Replace the prompt in `promptfooconfig.yaml` with your real prompt (or point it at a
   prompt file / your app's endpoint).
3. Replace the seed cases in `tests.yaml` with real ones; grow them from production failures
   (see `eval-foundations` §3) and add a regression case for every bug you fix.
4. Tune the deterministic and `llm-rubric` assertions to your criteria; tag safety/format
   ones so they hard-fail.
5. Add `{{API_KEY_SECRET}}` as a repo secret and set `{{PASS_THRESHOLD}}` from your suite's
   real pass rate.
6. Make the workflow a **required** status check on the protected branch.

Run locally with `npx promptfoo@latest eval -c promptfooconfig.yaml` (set
`{{API_KEY_ENV}}` in your shell first); `npx promptfoo@latest view` opens the results UI.

See the devkit `agent-evaluation` skill `eval-harness-ci` for the full method.

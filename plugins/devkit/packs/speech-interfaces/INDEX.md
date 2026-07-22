---
name: speech-interfaces
description: Section index for adding voice I/O to an app — speech-to-text (STT / recognition) and text-to-speech (TTS / synthesis). Engine selection matrices, streaming vs batch, latency/accuracy/cost tradeoffs, audio formats, and integration patterns. Pairs with agent-development for voice agents.
---

# Speech Interfaces — section index

This section covers the two halves of a voice interface: turning **audio into text** (STT) and
**text into audio** (TTS). Both are dominated by the same three decisions — do you go **cloud or
on-device**, **streaming or batch**, and what do you trade between **accuracy/naturalness,
latency, and cost**. The skills below give you a current option matrix plus the integration
patterns, so you can pick deliberately instead of defaulting to whatever SDK you saw last.

Read the skill relevant to the direction you need. A full **voice agent** is both, wired
back-to-back: mic → STT → your agent → TTS → speaker. Read both skills and see
`agent-development` for the reasoning loop in between.

> **Vendor facts move fast.** Model names, latency numbers, and pricing in these skills reflect
> the 2025-2026 landscape and go stale quickly. Treat them as a starting map — **verify current**
> model names and prices against the vendor's own docs before you commit.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **Speech-to-text** | Recognition/STT: engine choice, streaming vs batch, audio capture & format, VAD/endpointing, diarization, timestamps | `speech-to-text/SKILL.md` |
| **Text-to-speech** | Synthesis/TTS: engine choice, streaming synthesis, voice/prosody/SSML, audio formats, caching | `text-to-speech/SKILL.md` |

Paths are relative to this section folder
(`${CLAUDE_PLUGIN_ROOT}/packs/speech-interfaces/`).

## How to use this section

- **Adding voice input** (dictation, transcription, voice search): read `speech-to-text`.
- **Adding voice output** (readback, narration, notifications): read `text-to-speech`.
- **Building a voice agent / conversational assistant:** read **both**, prioritise the
  **streaming** sections (first-token/first-byte latency dominates the felt experience), and read
  `devkit:agent-development` for the loop between them.
- **Speccing an app that includes voice from scratch:** run `devkit:app-prompt` first to settle
  scope (which direction, languages, on-device vs cloud, privacy constraints), then come back
  here for the engine decision.

## How it relates to other sections

- **`agent-development`** — a voice agent is STT + an agent loop + TTS. This section handles the
  ears and the mouth; that section handles the brain (tool-calling, state, memory). Streaming
  matters on both ends so the agent can start thinking before the user stops talking and start
  speaking before the full reply is generated.
- **`app-prompt`** — voice touches auth (who's speaking), data (are recordings stored?),
  non-functional requirements (latency budget, offline support), and privacy/consent. Decide
  those in the app spec, then let the engine matrices here fall out of the constraints.

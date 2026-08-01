---
description: "Use when adding voice to an app — speech recognition (STT) or speech synthesis (TTS). Two skills: speech-to-text (engine options cloud & on-device, streaming vs batch, audio capture, wake words, diarization) and text-to-speech (engine options, streaming synthesis, SSML/prosody, latency & cost). Triggers: 'speech to text', 'text to speech', 'STT', 'TTS', 'speech recognition', 'speech synthesis', 'whisper', 'elevenlabs', 'voice input', 'voice output', 'transcribe'."
argument-hint: "[optional task, or a skill: speech-to-text | text-to-speech]"
---

**A voice / speech task matches this command — load it before choosing an engine; do not pick one
from memory.** First read the section index at
`${CLAUDE_PLUGIN_ROOT}/packs/speech-interfaces/INDEX.md`, then read the skill(s) the task needs:

- `speech-to-text/SKILL.md` — recognition/STT: engine selection (cloud vs. open/on-device),
  streaming vs. batch, audio capture & format, wake words, diarization, integration patterns.
- `text-to-speech/SKILL.md` — synthesis/TTS: engine selection, streaming synthesis & first-byte
  latency, voice/prosody/SSML, audio formats, cost, integration patterns.

For a two-way voice agent, read both. Engine/vendor specifics move fast — verify current models and
pricing against the provider's docs.

Then:
1. Confirm in one line which skill(s) you loaded.
2. Summarize the method in 3–5 bullets (start from the constraint: accuracy vs. latency vs. cost vs.
   on-device/privacy).
3. If the user provided a task below, start on it.

User task / focus (optional): $ARGUMENTS

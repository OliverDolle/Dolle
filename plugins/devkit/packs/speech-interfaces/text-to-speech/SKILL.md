---
name: text-to-speech
description: Use when adding speech synthesis / TTS to an app — choosing an engine (cloud: Azure, Google, AWS Polly, ElevenLabs, OpenAI; open/on-device: Piper, Coqui/XTTS, espeak-ng), streaming synthesis, voice selection & prosody/SSML, latency & cost, audio formats, and integration patterns. Triggers: 'text to speech', 'TTS', 'speech synthesis', 'voice output', 'elevenlabs', 'ssml', 'voice cloning'.
---

# Text-to-Speech (TTS)

Turning text into audio. Same discipline as STT: get the **decision** right first. The axes are
**cloud vs on-device**, **streaming vs one-shot**, and where you sit on **naturalness / latency /
cost**. For anything interactive, **first-byte latency** (time to the first audio chunk) matters
far more than total synthesis time — that's what the listener feels.

> **Verify current.** Voice/model names, latency numbers, and prices below are the 2025-2026
> landscape and go stale fast. Confirm against the vendor's docs before committing.

## §0 Pick by constraint

- **Most natural / expressive (audiobooks, characters, brand voice)** → ElevenLabs is the
  reference for expressiveness; premium cloud neural voices (Azure, Google, OpenAI) are close and
  cheaper.
- **Lowest interactive latency (voice agent readback)** → a low-latency streaming model
  (ElevenLabs Flash, Cartesia Sonic, Deepgram Aura-2, OpenAI) targeting sub-300 ms first byte.
- **Offline / private / no per-character cost** → on-device (Piper, Coqui/XTTS, espeak-ng).
- **Voice cloning** → ElevenLabs (instant clone from ~30 s) or Coqui/XTTS on-device — but see the
  **consent** note in §6; this is a legal, not just technical, decision.
- **Broadest languages / enterprise compliance** → Azure (400+ neural voices, 140+ locales),
  Google, AWS Polly.
- **Robotic-but-free, tiny, embedded** → espeak-ng: intelligible, not natural, runs anywhere.

Sanity check: **is a human waiting on this audio in real time?** If yes, optimise first-byte
latency and stream. If it's narration generated ahead of time, optimise naturalness and cost and
just batch it.

## §1 Engine option matrix

| Engine | Type | Streaming | Voice cloning | Notable | Watch out |
| --- | --- | --- | --- | --- | --- |
| **ElevenLabs** (Flash, multilingual, v3) | Cloud | Yes, ~75 ms first byte | Yes (instant + pro) | Most expressive; rich voice library | Priciest at volume; subscription/character tiers |
| **OpenAI** (`gpt-4o-mini-tts`) | Cloud | Yes | No public cloning | Simple API, steerable style, pay-as-you-go | Curated voice set only |
| **Azure AI Speech** | Cloud | Yes (real-time + batch) | Custom Neural Voice (gated) | 400+ voices, full SSML + `mstts` extensions | Setup heavier |
| **Google Cloud TTS** | Cloud | Yes | Custom voice | Broad languages, WaveNet/Neural2 voices | — |
| **AWS Polly** | Cloud | Yes | No | AWS-native, cheap, Neural voices, SSML | Fewer top-tier expressive voices |
| **Cartesia** (Sonic) | Cloud | Yes, very low latency | Yes | Built for real-time voice agents | Newer; verify quotas |
| **Deepgram Aura-2** | Cloud | Yes, low latency | No | Pairs with their STT for full voice stack | Smaller voice catalogue |
| **Piper** | Open / on-device | Streaming-ish | No | Fast, tiny, great on Pi/Home Assistant | **Archived Oct 2025** (still works); consider Kokoro |
| **Kokoro TTS** | Open / on-device | Yes | No | Newer, high-quality small model | Evaluate maturity/licensing |
| **Coqui / XTTS** | Open / on-device | Yes | Yes (cross-lingual) | Cloning + many languages, on your hardware | Heavy compute; project maintenance flux |
| **espeak-ng** | Open / on-device | Yes | No | Ubiquitous, minuscule, 100+ langs | Robotic (formant synthesis), not natural |

Rule of thumb: **ElevenLabs/Cartesia = expressive + real-time (pay for it).** **Azure/Google/Polly
= reliable, broad, enterprise.** **Piper/Kokoro/espeak = free, offline, on-device.**

## §2 Streaming synthesis & first-byte latency

For real-time / voice-agent use, don't wait for the whole clip.

- **Stream the audio out** as it's synthesised so playback starts on the first chunk. **Time to
  first byte (TTFB)** is the felt latency — a 10 s sentence that starts playing in 200 ms feels
  instant; the same sentence delivered as a finished file after 2 s feels laggy.
- **Feed text incrementally.** In a voice agent the LLM is *also* streaming tokens — pipe partial
  text into the TTS as sentences/clauses complete (sentence-boundary chunking) instead of waiting
  for the full reply. STT→LLM→TTS all streaming is what makes a conversation feel live.
- **Pick a low-latency model** for this (ElevenLabs Flash, Cartesia Sonic, Deepgram Aura-2, OpenAI)
  — the flagship "most natural" model is often the higher-latency one; there's a
  quality/speed knob.
- **One-shot** (synthesise whole file, then play/store) is fine and simpler for narration,
  notifications, and pre-generated audio — use it when nobody's waiting live.

## §3 Voice, prosody & SSML

- **Voice selection** is a product decision: language/locale, gender, age, persona — audition
  candidates with *your* real copy, not the vendor's demo sentence. Lock a specific voice ID; some
  clone voices drift between model versions.
- **SSML** (Speech Synthesis Markup Language) is the standard control layer where supported:
  - `<break time="500ms"/>` — pauses.
  - `<prosody rate="slow" pitch="+2st" volume="loud">` — pace, pitch, loudness.
  - `<say-as interpret-as="telephone|date|currency|characters">` — read numbers/dates/spellings
    correctly (huge for phone numbers, prices, IDs).
  - `<phoneme>` / lexicons — fix mispronounced names and jargon.
  - `<emphasis>`, plus vendor extensions (Azure's `mstts:express-as` styles/emotions).
- **Not every engine takes SSML** — OpenAI/ElevenLabs steer more via plain-text phrasing,
  punctuation, and style parameters than full SSML. Check support before authoring SSML.
- **Normalise text first:** expand or mark up "$4.99", "Dr.", "10/03", URLs, and acronyms — raw
  strings get read literally or wrong. This is the biggest quality lever after voice choice.

## §4 Audio formats & playback

- **Streaming interactive:** low-overhead chunkable formats — **Opus** (efficient, great for web/
  WebRTC) or **raw PCM** (lowest latency, no decode step, bigger). MP3 streams but has framing
  overhead.
- **Files / downloads:** MP3 (universal) or Opus (smaller). WAV/PCM for lossless or further DSP.
- **Sample rate:** 24 kHz is common for neural TTS; 16 kHz for telephony, 44.1/48 kHz for
  music-grade. Match the playback path and the STT side if it's a full loop.
- **Browser playback:** for streams, feed chunks via **MediaSource Extensions** or the Web Audio
  API rather than waiting for a complete `Audio` src — otherwise you throw away the streaming
  latency win.

## §5 Integration patterns

- **Server-side synth + stream to client:** app sends text to your backend → backend calls the
  TTS (**API keys stay server-side**) → audio streams back to the client and plays on first chunk.
  Standard for voice agents and readback.
- **Cache common phrases:** greetings, menu prompts, error messages, confirmations — synthesise
  **once**, store the audio, replay. Cuts cost and latency to near zero for repeated lines; key
  the cache by `(text, voice, model, format)`. Only synthesise the truly dynamic parts live.
- **Pre-generate static narration** (docs, lessons, IVR trees) as a batch build step and serve as
  static files — don't pay to synthesise the same content on every request.
- **On-device** (Piper/Kokoro/espeak) for offline, private, or zero-marginal-cost output; accept
  the naturalness ceiling and per-platform packaging.
- **Full voice loop:** pair with `speech-to-text` — STT partials feed the agent, agent tokens
  stream into TTS; overlap the three stages so total turn latency is the *slowest* stage, not the
  *sum*.

## §6 Pitfalls & cost checklist

- **Voice-cloning consent** — cloning a real person's voice without explicit, documented consent
  is a legal and ethical line, not a feature toggle. Get written permission; many vendors require
  a verification statement. Never clone from scraped or public audio.
- **Un-normalised text** — "$4.99", "Dr.", phone numbers, and URLs get mangled; normalise or SSML
  them.
- **Optimising total latency instead of first-byte** — measure and tune **TTFB** for interactive
  use.
- **Using the flagship voice for real-time** — it may be the slowest; switch to the low-latency
  model when a human is waiting.
- **API keys in the client** — relay through your backend.
- **Not caching** — re-synthesising identical static phrases burns money and adds latency for
  nothing.
- **Cost:** cloud TTS is priced **per character** (watch SSML tags and repeated content);
  ElevenLabs-tier expressiveness costs multiples of Azure/Polly. Cloning and premium voices carry
  surcharges. **On-device** trades per-character cost for compute/packaging — model the crossover.
- **Voice/model drift** — pin voice + model versions; regenerate and re-audition cached audio when
  you upgrade, or the voice can change under you.
- **Reduced-motion / accessibility of autoplay** — don't autoplay audio unexpectedly; give
  controls, respect mute, and don't rely on audio as the only channel.

## Related

- `speech-interfaces/speech-to-text/SKILL.md` — the other half; pair for a full voice loop.
- `devkit:agent-development` — stream LLM tokens into TTS so replies start speaking sooner.
- `devkit:app-prompt` — settle voice persona, languages, on-device vs cloud, and any
  cloning/consent requirements in the spec before choosing an engine.

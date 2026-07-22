---
name: speech-to-text
description: Use when adding speech recognition / STT to an app — choosing an engine (cloud: Azure Speech, Google, AWS Transcribe, Deepgram, OpenAI/Whisper API; open/on-device: whisper.cpp, faster-whisper, Vosk), streaming vs batch, latency/accuracy/cost tradeoffs, audio capture & format (sample rate, mono, VAD), wake words, diarization & timestamps, and integration patterns. Triggers: 'speech to text', 'STT', 'speech recognition', 'transcribe audio', 'whisper', 'voice input', 'real-time transcription'.
---

# Speech-to-Text (STT)

Turning audio into text. Get the **decision** right first — the SDK is the easy part. Three axes
drive everything: **cloud vs on-device**, **streaming vs batch**, and where you sit on the
**accuracy / latency / cost** triangle. Pick against your constraints, then the engine and the
audio pipeline follow.

> **Verify current.** Model names, WER numbers, and prices below are the 2025-2026 landscape and
> go stale fast. Confirm against the vendor's docs before committing.

## §0 Pick by constraint

Start from the hard constraint, not the brand.

- **Privacy / offline / no per-minute cost** → on-device (whisper.cpp, faster-whisper, Vosk).
  Audio never leaves the machine; you pay in compute and setup instead of per minute.
- **Lowest interactive latency (voice agent, live captions)** → a streaming cloud engine built
  for it (Deepgram, AssemblyAI, ElevenLabs Scribe Realtime), or faster-whisper on a local GPU.
- **Highest accuracy on hard audio (accents, noise, jargon), latency-tolerant** → a large Whisper
  model (cloud or local) or a top batch engine; accuracy peaks when you can afford to wait.
- **Broadest language coverage** → Azure / Google (140+ locales) or Whisper (~100 languages).
- **Cheapest at volume, tolerant of setup** → self-hosted faster-whisper on your own GPU amortises
  well past a few hundred hours/month.

Sanity check: **what is the latency budget, in ms?** "Real-time feel" is < ~300 ms to first
partial. Post-call transcription can take minutes. That single number eliminates most options.

## §1 Engine option matrix

| Engine | Type | Streaming | Notable | Watch out |
| --- | --- | --- | --- | --- |
| **Deepgram** (Nova-3, Flux) | Cloud | Yes, sub-300 ms | Fast, cheap/min; Flux does built-in end-of-turn detection | Fewer speech-intelligence extras than AssemblyAI |
| **AssemblyAI** (Universal) | Cloud | Yes | Bundled summarise/sentiment/entities; strong accuracy | Intelligence features add cost |
| **OpenAI** (Whisper API, `gpt-4o-transcribe`, Realtime API) | Cloud | Realtime API (GA 2025) only | Great accuracy, simple API, ~100 langs | Base Whisper API is **batch only** — no native streaming |
| **Azure Speech** | Cloud | Yes | 140+ locales, custom models, enterprise/compliance | Setup heavier; latency lags specialists |
| **Google Cloud STT** | Cloud | Yes | Broad languages, GCP integration | — |
| **AWS Transcribe** | Cloud | Yes | AWS-native, medical/call-analytics variants | — |
| **ElevenLabs Scribe (Realtime)** | Cloud | Yes, very low latency | 90+ langs, predictive streaming | Newer; verify quotas |
| **faster-whisper** | Open / on-device | Pseudo (chunked) | CTranslate2; ~4× whisper.cpp on GPU w/ int8 | Needs a GPU for real-time-ish |
| **whisper.cpp** | Open / on-device | Pseudo (chunked) | CPU + Apple Metal, tiny footprint, easy embed | Slower; large model wants real hardware |
| **Vosk** | Open / on-device | Yes (true streaming) | Kaldi-based, ~50 MB/lang, runs on Pi/mobile/embedded | Lower ceiling accuracy vs Whisper-class |

Rules of thumb: **Whisper family = accuracy king, batch-shaped.** **Deepgram/AssemblyAI =
purpose-built streaming.** **Vosk = the true-streaming, tiny-footprint edge choice.**
"Whisper" alone means the *model*; whether you get streaming depends on the *wrapper* (base
Whisper API is batch; OpenAI's Realtime API streams).

## §2 Streaming vs batch

**Batch** (file/blob → full transcript): simplest, highest accuracy (the model sees full
context), best for recordings, uploads, and post-processing. One request, one result.

**Streaming** (mic/socket → interim + final results): mandatory for live captions, dictation
feedback, and voice agents. Key concepts:

- **Partial / interim results** arrive as the user speaks and get **revised** as more audio lands
  — render them greyed/italic, then commit on the **final** result. Never treat a partial as
  final.
- **Endpointing / VAD** (voice activity detection) decides when an utterance *ends*. Too eager →
  it cuts users off; too slow → laggy turns. Tunable via silence-duration thresholds. Newer
  conversational models (e.g. Deepgram Flux) fold **end-of-turn** detection in so you don't run a
  separate VAD.
- **Trade-off:** streaming gives responsiveness but slightly lower accuracy than a batch pass over
  the same audio. For a recording you can afford to wait on, batch wins.

If you don't need live feedback, **don't use streaming** — batch is simpler and more accurate.

## §3 Audio capture & format

Most STT wants **16 kHz, mono, 16-bit PCM** (linear16). Get this wrong and accuracy silently
tanks — it's the most common self-inflicted STT bug.

- **Sample rate:** 16 kHz is the standard for speech models; 8 kHz for telephony. Sending 44.1/48
  kHz studio audio is wasteful and sometimes rejected — **resample** to what the engine expects.
- **Channels:** **mono.** If you have stereo (e.g. two call legs), split channels and transcribe
  separately for clean per-speaker text — cleaner than diarization.
- **Encoding:** raw PCM (linear16) for streaming; for batch, compressed (FLAC lossless, or
  Opus/MP3) cuts upload size — most engines accept common containers.
- **Chunking for streaming:** send small frames (e.g. 20-100 ms / a few KB) so partials flow;
  don't buffer seconds of audio before sending.
- **Browser capture:** `getUserMedia` → `AudioWorklet` (not the deprecated `ScriptProcessor`) to
  pull raw frames, downsample to 16 kHz, ship over a WebSocket. Set `echoCancellation`,
  `noiseSuppression`, `autoGainControl` in the `getUserMedia` constraints.
- **Client-side VAD** (e.g. Silero VAD in the browser/worker) before you send saves bandwidth and
  cost — only stream when someone is actually talking.

## §4 Accuracy levers

Before switching engines, pull these — they're cheaper than a migration:

- **Domain vocabulary / phrase hints / keyterm prompting:** feed product names, jargon, and
  proper nouns so the model biases toward them. Biggest single win for specialised domains.
- **Diarization** ("who spoke when"): enable if you need speaker labels. For known channels
  (stereo call), splitting channels beats diarization.
- **Punctuation & formatting:** most engines auto-punctuate and can format numbers/dates/currency
  ("smart formatting") — toggle it on for readable transcripts.
- **Word-level timestamps:** enable when you need captions, click-to-seek, or alignment to media.
- **Language:** set it explicitly when known — auto-detect adds latency and occasional mistakes.
- **Model size (Whisper family):** larger model = higher accuracy, more compute/latency. Pick the
  smallest that clears your accuracy bar.

## §5 Integration patterns

- **Mic → WebSocket streaming (interactive):** browser/app captures 16 kHz mono frames → your
  backend relays to the STT socket (**keep API keys server-side** — never ship them to the
  client) → interim results stream back to the UI, finals commit. Standard for live captions,
  dictation, voice agents.
- **File → batch (offline):** upload/enqueue the file, poll or receive a webhook, store the
  transcript + timestamps. Standard for recordings, uploads, meeting notes.
- **Edge vs server:** on-device (Vosk / whisper.cpp) for privacy, offline, or zero per-minute
  cost — accept the accuracy/hardware ceiling. Server/cloud for top accuracy, big models, and no
  device footprint. Hybrid: on-device wake word / VAD, cloud for the heavy transcription.
- **Wake word:** don't stream everything to a cloud STT to catch "Hey X" — run a dedicated,
  tiny on-device wake-word/keyword spotter (openWakeWord, Porcupine, or a Vosk closed grammar),
  and only open the STT stream after it fires. Cheaper, more private, lower latency.

## §6 Pitfalls & cost checklist

- **Wrong sample rate / stereo audio** — the #1 silent accuracy killer. Verify 16 kHz mono PCM.
- **Treating partials as finals** — you'll double-count or show text that gets revised away.
- **VAD tuned wrong** — cutting users off mid-sentence or hanging after they stop; tune silence
  thresholds against real users.
- **Base Whisper API expecting streaming** — it's batch; use a Realtime API or a streaming engine.
- **API keys in the client** — always relay through your backend.
- **Cost:** priced per minute of **audio** (not text). Streaming bills wall-clock, so client-side
  VAD (don't stream silence) directly cuts the bill. **Self-hosted** trades per-minute cost for
  GPU/ops — model the crossover (roughly a few hundred hours/month) before assuming cloud is
  cheaper. Watch add-on fees for diarization / summarisation / intelligence features.
- **Hallucinations on silence/noise** — Whisper-family models can invent text on empty audio;
  gate with VAD and a confidence/no-speech threshold.
- **Privacy/consent** — recording people has legal weight; know your data-retention and
  cross-border rules, and whether the vendor trains on your audio (opt out if needed).

## Related

- `speech-interfaces/text-to-speech/SKILL.md` — the other half; pair for a full voice loop.
- `devkit:agent-development` — the reasoning loop between STT and TTS in a voice agent.
- `devkit:app-prompt` — settle languages, on-device vs cloud, privacy/consent, and latency budget
  in the spec before choosing an engine.

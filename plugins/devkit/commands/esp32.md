---
description: "Use when developing, flashing, or debugging ESP32 (and similar dev-board) firmware — BEFORE fighting the toolchain. Toolchain choice (ESP-IDF/Arduino/PlatformIO), flashing & upload-failure fixes (hold BOOT while resetting/powering, USB-UART drivers, ports, baud, erase_flash), dual-core FreeRTOS (a task per core, WiFi on core 0), GPIO/strapping-pin gotchas, brownout, deep sleep, and serial/JTAG debugging. Triggers: 'esp32', \"can't upload to esp32\", 'esp-idf', 'platformio', 'flash firmware', 'freertos task', 'dual core', 'gpio strapping', 'brownout'."
argument-hint: "[optional: the board task, upload failure, or symptom]"
---

**An ESP32 / embedded-dev-board task matches this command — load it before debugging the toolchain
from memory.** Read the file `${CLAUDE_PLUGIN_ROOT}/packs/esp32/SKILL.md` in full and follow it as
the active method for this work.

Then:
1. Confirm in one line that the **esp32** section is loaded.
2. Summarize the tips in 3–5 bullets: pick the toolchain (ESP-IDF vs. Arduino vs. PlatformIO); if
   uploads fail, force download mode (hold **BOOT**, tap **EN/RESET** — or hold BOOT through
   power-up until the flash completes) and check the USB-UART driver/port/baud; pin heavy tasks per
   core with `xTaskCreatePinnedToCore` (core 0 runs WiFi/BT); watch strapping pins and the brownout
   detector.
3. If the user described a task or a symptom below, start there — for an upload failure, work the
   symptom→fix table first.

User task (optional): $ARGUMENTS

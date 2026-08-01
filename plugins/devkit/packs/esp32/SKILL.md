---
name: esp32
description: >-
  Use when developing, flashing, or debugging firmware for ESP32 (and similar dev boards) — choosing a toolchain (ESP-IDF vs Arduino vs PlatformIO), flashing and the upload-failure fixes (hold BOOT while resetting/powering, USB-UART drivers CP2102/CH340, ports, baud, erase_flash), dual-core FreeRTOS (pin a task per core with xTaskCreatePinnedToCore; core 0 runs WiFi/BT), GPIO & strapping-pin gotchas, brownout, deep sleep, and serial/JTAG debugging. Triggers: 'esp32', "can't upload to esp32", 'esp-idf', 'platformio', 'flash firmware', 'freertos task', 'dual core', 'gpio strapping', 'brownout'.
---

# ESP32 firmware (dev, flash, debug)

A field manual for getting firmware onto an ESP32 and keeping it running. ESP32 is the worked
example here, but most of it — download-mode entry, USB-UART drivers, strapping pins, FreeRTOS
task pinning — carries to ESP32-S3/C3/C6 and other bootloader-based dev boards; chip-specific pins
and mode combos differ, so **check the pinout for your exact module**. The single most common
wall you'll hit is "won't upload"; §1 and §2 exist to get you past it fast.

## §0 — Pick a toolchain

| Toolchain | Use when | Trade-off |
| --- | --- | --- |
| **ESP-IDF** (Espressif's official, CMake + `idf.py`) | Production, full hardware access, latest chips, tight control over sdkconfig, OTA, security | Steeper; C/C++ and menuconfig; you own the build |
| **Arduino-ESP32** (Arduino core) | Prototyping, rich library ecosystem, `setup()`/`loop()`, hobby/quick sensors | Abstractions hide config; larger builds; lags newest IDF features |
| **PlatformIO** (VS Code, wraps either) | Multi-board projects, reproducible pinned deps, CI, teams | Extra layer to learn; still ESP-IDF/Arduino underneath |

- Arduino-ESP32 is actually **built on top of ESP-IDF** — you can call IDF APIs (FreeRTOS, `esp_sleep`, NVS) directly from Arduino sketches. Start on Arduino, drop to IDF calls when you need them.
- PlatformIO's `platformio.ini` pins the platform version, framework, board, and libraries — the reproducible-build win over the Arduino IDE. Prefer it once a project matters.
- Whatever you pick, keep the flashing mental model identical: a USB-UART bridge talks to the ROM bootloader, which must be in **download mode**.

## §1 — Flashing & the upload loop

The chip has three states: **run** (execute flash), **sleep**, and **download/flash** mode. It
enters download mode when **GPIO0 (BOOT) is held LOW at reset (EN/RESET released)**. Everything
about flashing is getting it reliably into that state.

**Auto-reset circuit.** Most dev boards wire DTR/RTS from the USB-UART chip to EN and GPIO0 (plus
a small cap on EN) so `esptool`/the IDE can toggle download mode for you — no buttons. When that
circuit is flaky or absent (bare modules, some clones), you do it by hand.

**The manual download-mode trick (do this when auto-reset fails):**
1. Hold **BOOT** (IO0).
2. Tap/hold **EN** (RESET).
3. Release **RESET**, then release **BOOT**.
4. Start the upload immediately — the chip is now in download mode.

**The hold-through-power variant (owner's go-to when the auto-reset cap/circuit misbehaves):**
hold **BOOT down while plugging in / powering the board**, keep holding, start the upload, and
**keep BOOT held until the upload finishes**. Crude but reliable when DTR/RTS timing won't catch.

**Port, driver, baud, monitor:**
- **Driver first.** The board's USB-UART chip needs a host driver: **CP2102/CP210x** (Silicon Labs) or **CH340/CH341** (WCH) are the two common ones; FTDI on some. No driver → no serial port appears. Install it, replug, confirm a port shows up.
- **Right port.** `COMx` (Windows), `/dev/ttyUSB0`/`ttyACM0` (Linux), `/dev/cu.usbserial-*` (macOS). Linux: add yourself to `dialout` for permissions. Pick the port that *appears when you plug the board in*.
- **Close the monitor.** A serial monitor holding the port blocks the upload — the #1 silent cause of "resource busy" / connect failures. Close it before flashing.
- **Baud.** 115200 always works; 460800/921600 upload faster but a bad cable/long lead makes them flake — drop back to 115200 to diagnose.
- **`esptool erase_flash`** for a clean slate (wipes NVS/WiFi creds/partition cruft) when a board boots weird after reflashing.
- **The cable.** Charge-only USB cables have no data lines — the board powers up (LED on) but no port ever enumerates. Swap to a known data cable before anything else.

## §2 — Upload / boot failure table

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Failed to connect … Wrong boot mode detected (0xNN)` | Not in download mode | Manual BOOT+EN trick, or hold-BOOT-through-power (§1) |
| `Failed to connect … Timed out waiting for packet header` | Auto-reset not triggering; wrong port; monitor open | Hold BOOT during connect; close monitor; verify port |
| No serial port appears at all | Missing USB-UART driver, or charge-only cable | Install CP2102/CH340 driver; swap to a data cable |
| `Permission denied` on `/dev/ttyUSB0` | Not in `dialout` group (Linux) | `sudo usermod -aG dialout $USER`, re-login |
| Uploads, then boots into flashing again / bootloop | GPIO0 held low by wiring; strapping-pin peripheral | Free GPIO0; disconnect strapping-pin loads at boot (§4) |
| Flashes fine, resets, `rst:0xc (SW_CPU_RESET)` / panic | App crash — real bug | Decode the backtrace (§6) |
| `Brownout detector was triggered` in boot log | Insufficient/noisy power | Better cable/supply, add caps (§5) |
| Random garbage in monitor | Baud mismatch | Set monitor to the firmware's baud (usually 115200) |
| Upload works at 115200, fails at 921600 | Cable/USB-hub can't sustain high baud | Lower upload baud |
| `A serial exception error occurred` mid-upload | Cable/contact drop, or bad USB port/hub | New cable, direct port (no hub), reseat |

If auto-reset never works on a given board, that's usually a **missing/failed cap on EN** — the
hold-BOOT-through-power method is your permanent workaround; don't keep fighting the timing.

## §3 — Dual-core & FreeRTOS

The ESP32 has **two cores**. Core 0 ("PRO_CPU") runs the **WiFi/Bluetooth/BLE protocol stacks**;
under Arduino the `loop()` runs as a task on **Core 1** ("APP_CPU"). The Arduino runtime *is*
FreeRTOS — `loop()` is just one task. Put deliberate work on deliberate cores.

**Create a task pinned to a core:**
```c
xTaskCreatePinnedToCore(
    taskFn,       // void taskFn(void*) — must never return; loop with a delay inside
    "sensor",     // name (for debugging)
    4096,         // stack depth in WORDS (not bytes) — too small = silent stack overflow
    NULL,         // param passed to taskFn
    1,            // priority (higher = more urgent; idle is 0)
    &taskHandle,  // out handle (or NULL)
    1             // core: 0 (with WiFi/BT) or 1 (app). Use tskNO_AFFINITY to let the scheduler choose
);
```

- **Pin CPU-heavy or timing-sensitive work to Core 1**, away from the WiFi/BT stack on Core 0. If you starve Core 0, WiFi drops and BLE stutters.
- **Pass data between cores/tasks with FreeRTOS primitives**, not shared globals: `xQueue*` (producer/consumer), `xSemaphore*` / mutex (guard a shared resource), `xTaskNotify*` (fastest, lightweight signal). A raw shared variable across cores is a race.
- **Never block `loop()` or any task** with a busy-wait. Use `vTaskDelay(pdMS_TO_TICKS(ms))` to yield; a bare `while(1){}` or long `delay()` starves lower-priority tasks and trips the watchdog.
- **Feed the task watchdog.** A task that hogs a core without yielding triggers the **Task Watchdog Timer (TWDT)** → reset. Yield regularly (`vTaskDelay`), or explicitly reset the WDT for that task if it legitimately runs long.
- Stack is in **words** — a task that crashes only sometimes is usually a too-small stack. Bump it and re-test; watch the high-water mark with `uxTaskGetStackHighWaterMark()`.

## §4 — GPIO & strapping pins

- **Strapping pins** (GPIO0, 2, 5, 12/MTDI, 15/MTDO on classic ESP32) are sampled at reset to pick boot mode. A peripheral that pulls one at power-up **breaks flashing/boot**. Keep them free during reset, or drive them only *after* boot. GPIO12 pulled high at boot can even set the wrong flash voltage and brick a boot — leave it alone.
- **Input-only pins: GPIO34–39.** No output, **no internal pull-up/pull-down** — add an external resistor if you need one. Great for pure sensor inputs.
- **ADC2 vs WiFi.** ADC2 channels (GPIO 0, 2, 4, 12–15, 25–27) **stop working while WiFi is active** — the radio shares that circuitry and wins. If you sample an analog input with WiFi on, **use ADC1** (GPIO 32–39). This bites people constantly: "my analog read is garbage but only when connected."
- Pins **6–11** are wired to the SPI **flash** on most modules — don't use them.
- GPIO0/2 double as strapping *and* often the onboard button/LED — mind the overlap when wiring.

## §5 — Power

- **Brownout.** `Brownout detector was triggered` at boot = supply dipped below threshold, usually during the WiFi TX current spike (can burst to ~500 mA). Fixes in order: **better data cable**, a **powered USB port / decent 5V supply** (not a weak hub), add **bulk + decoupling caps** (e.g. 470–1000 µF + 0.1 µF near the module), avoid long thin leads. Only lower/disable the brownout detector as a last resort — it's protecting you.
- **Deep sleep** cuts draw to ~10 µA. Wake sources:
  - **Timer** — `esp_sleep_enable_timer_wakeup(us)`.
  - **ext0** — one specific **RTC-capable** GPIO; keeps RTC peripherals powered.
  - **ext1** — a mask of RTC GPIOs; works with RTC peripherals off (lowest power for button wake).
  - **Touch**, **ULP**. Note: on classic ESP32, touch wake can't combine with ext0 / forced-on RTC periph.
- **Wake pins must be RTC-capable** (0, 2, 4, 12–15, 25–27, 32, 33). A non-RTC pin silently never wakes the chip. Add a pull-up and wake on LOW for a button-to-GND: `esp_sleep_enable_ext0_wakeup(pin, 0)`.
- RTC memory (`RTC_DATA_ATTR`) survives deep sleep; regular RAM and normal globals do not.

## §6 — Debugging

- **Serial monitor.** `idf.py monitor`, PlatformIO monitor, or Arduino Serial Monitor — match the baud. `idf.py monitor` is the good one: it auto-decodes panic backtraces to file:line.
- **Decode a panic backtrace.** A crash prints `Guru Meditation Error` + a `Backtrace: 0x400d… 0x…` list of addresses. Turn addresses into source lines with the toolchain's addr2line against your ELF: `xtensa-esp32-elf-addr2line -pfiaC -e build/app.elf <addr> <addr> …` (`idf.py monitor` does this live). No ELF = no useful decode, so keep the build that produced the running firmware.
- **Read the reset reason.** `rst:0x1 (POWERON)`, `SW_CPU_RESET`, `TG*WDT` (watchdog), `brownout` — the boot banner tells you *why* it restarted before you guess.
- **Core dump.** Enable core-dump-to-flash in ESP-IDF (`CONFIG_ESP_COREDUMP_*`) to capture a full crash snapshot you can inspect later with `espcoredump.py` — invaluable for crashes you can't reproduce on the bench.
- **JTAG / OpenOCD.** ESP32-S3/C3 and the ESP-PROG expose real breakpoint/step debugging over JTAG via OpenOCD + GDB (built into the VS Code ESP-IDF extension). Reach for it when print-debugging a timing/heap bug stops scaling.

## §7 — Gotchas checklist

- [ ] USB-UART driver installed (CP2102 / CH340) and a **data** cable (not charge-only).
- [ ] Correct port selected; **serial monitor closed** before uploading.
- [ ] Can't connect? Manual BOOT+EN, or hold BOOT through power-up until upload ends.
- [ ] Nothing on strapping pins (0/2/5/12/15) pulling them at reset.
- [ ] Analog + WiFi → use **ADC1** (GPIO 32–39), never ADC2.
- [ ] GPIO34–39 are input-only, no internal pull resistors.
- [ ] Brownout at boot → power/cable/caps before touching the detector.
- [ ] FreeRTOS: pin heavy work to Core 1, keep Core 0 for WiFi/BT, `vTaskDelay` to yield, feed the WDT, size stacks in **words**.
- [ ] Cross-core data via queue/semaphore/notification, never a bare shared global.
- [ ] Deep-sleep wake pin is RTC-capable; use `RTC_DATA_ATTR` for state that must survive.
- [ ] Keep the ELF that matches the running firmware so you can decode backtraces.

## Related

- `devkit:systematic-debugging` — the reset-reason → backtrace → core-dump flow here is exactly the "read the actual error before guessing" discipline applied to embedded.

---
description: "Use this whenever the user is building or reviewing a native/desktop GUI app — load it BEFORE building windows, menus, or dialogs. Covers the platform HIG (Apple/Windows/GNOME), window & app structure, menus and the command model, the desktop keyboard model, resizable layout via layout managers, HiDPI & system fonts, native feel and OS dark mode, keeping the UI thread responsive, undo/redo & unsaved-changes, and desktop accessibility. Qt as the worked example; ports to GTK/WinUI/wx. NOT for web pages or sites (use ui-ux-design). Triggers: 'Qt app', 'desktop app UI', 'PyQt/PySide', 'GTK app', 'menu bar', 'QMainWindow', 'native GUI'."
argument-hint: "[optional: the desktop app/window/dialog you're designing, or a GUI to review]"
---

**A native/desktop GUI request matches this command — load it before building windows or menus; do
not wing the platform conventions.** Read the file `${CLAUDE_PLUGIN_ROOT}/packs/gui-design/SKILL.md`
in full and follow it as the active method for this work. It sits **on top of** the `ui-design`
section — the shared
UI craft lives there, so also read `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/fundamentals/SKILL.md`
(and `design-systems/SKILL.md` if the app is more than one screen).

Then:
1. Confirm in one line that the **gui-design** section is loaded.
2. Summarize the method in 3–5 bullets: follow the target platform HIG and pick a native-vs-
   consistent stance; structure the app (menu bar + order, toolbar, status bar, dialogs, SDI/MDI);
   make it fully keyboard-operable (mnemonics, platform-standard accelerators, Enter/Esc, label
   buddies); lay out with layout managers + size policies (never absolute positioning), HiDPI-clean
   with system fonts; keep the UI thread responsive (long work off-thread with progress/cancel),
   handle undo/redo and unsaved-changes, and expose accessibility via the platform API — all on top
   of the `ui-design` fundamentals.
3. If the user named a desktop app/window to design or a GUI to review below, start there — apply
   the checklist. For *aesthetic direction* lean on the `frontend-design` skill if it is available; for the shared UI craft use
   `devkit:ui-design`.

User task (optional): $ARGUMENTS

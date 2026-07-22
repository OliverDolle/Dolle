---
name: gui-design
description: >-
  Designing native/desktop GUI applications — the conventions the web skills don't cover. Load when
  building a desktop app in Qt (Widgets or QML), GTK, WinUI, wxWidgets, or similar. Covers following
  the platform Human Interface Guidelines (Apple HIG, Windows/Fluent, GNOME/KDE), window & app
  structure (menu bar, toolbar, status bar, sidebars, dialogs, SDI/MDI), menus & the command model,
  the desktop keyboard model (mnemonics, accelerators, default/cancel), resizable layout via layout
  managers, HiDPI scaling and system fonts, native feel (native widgets/dialogs, OS dark mode,
  platform button order), keeping the UI thread responsive, undo/redo and unsaved-changes handling,
  and desktop accessibility via the platform a11y APIs. Uses Qt as the worked example; the concepts
  port to GTK/WinUI/wx. Sits on top of the ui-design fundamentals and design-systems skills.
---

# GUI design (native & desktop)

Designing a desktop app is the `ui-design` craft **plus a platform layer the web doesn't have**.
Hierarchy, a spacing/type scale, semantic color, component states, forms, and accessibility all
still apply — **read `devkit:ui-design` (fundamentals + design-systems) first; this skill does not
repeat them.** What's different on the desktop is the *shell*: windows and their chrome, a menu &
command model, a richer keyboard contract, resizable layouts, HiDPI, native widgets, an OS theme to
follow, and a UI thread you must not block. This skill covers that layer, with **Qt** as the worked
example — but the concepts port to GTK, WinUI, wxWidgets, and native toolkits.

## 1 — Follow the platform's Human Interface Guidelines

Desktop users have decades of muscle memory. Meeting their expectations *is* the design; violating
them reads as broken, not original. Each platform has a HIG — know the one(s) you target:

- **macOS** — Apple Human Interface Guidelines. Global menu bar at the top of the screen (not in
  the window), traffic-light window controls at top-left, `⌘`-based shortcuts.
- **Windows** — Fluent / WinUI guidelines. In-window menu bar, window controls at top-right,
  `Ctrl`-based shortcuts.
- **Linux** — GNOME HIG (header-bar centric, often no traditional menu bar) or KDE HIG (more
  traditional/configurable). More fragmented; pick the desktop you target.

**Decide your cross-platform stance up front**, because it changes every later choice:

- **Native on each platform** — adopt each platform's conventions (menu placement, button order,
  shortcuts, widgets). Best when the app should feel like it belongs. Qt gets you most of this for
  free via native styles.
- **One consistent look everywhere** — your own themed style on all platforms. Best for brand-heavy
  or creative tools where users expect a distinct environment. Still honor the non-negotiables
  (keyboard shortcuts, dark mode, accessibility) even with a custom skin.

Whichever you pick, **don't half-do it** — a Windows-looking app with macOS button order is worse
than either.

## 2 — Window & app structure (the chrome)

Choose the app's skeleton deliberately:

- **Window model:** **SDI** (one document per window — most apps), **MDI** (child windows inside one
  parent — mostly legacy, avoid unless the domain demands it), or a **single main window** with
  panels. Utility/tool windows and inspectors float above the main window.
- **The standard furniture, top to bottom:** title bar/window controls → **menu bar** (§3) →
  **toolbar** (icon buttons for the most common menu commands — a shortcut, never the *only* path
  to a command) → optional **sidebar / navigation** (source list, tree, tabs) → **main content
  area** → **status bar** (context, progress, non-modal messages — not for critical alerts).
- **Dialogs:** **modal** only when the app genuinely can't proceed (a required choice, a destructive
  confirmation); **modeless** (or inline panels/inspectors) for everything else — modal dialogs
  interrupt, so spend them sparingly, exactly like modals on the web.
- **Docks/panels** (IDE-style) should be dockable, floatable, and closable, and their arrangement
  saved (§5). Qt: `QMainWindow` gives you the menu bar, toolbars, status bar, and dock areas as
  first-class regions — use it rather than hand-placing them.

## 3 — Menus & the command model

The menu bar is the app's **complete, discoverable command surface** — everything the app can do
should be reachable there, even commands that also live on a toolbar or shortcut.

- **Use the standard menus in the standard order:** `File  Edit  View  …  Window  Help` (plus the
  app menu on macOS). Put commands where users expect them (Preferences under the app menu on macOS,
  under Edit/Tools on Windows). Don't invent a novel top-level menu for something that belongs in a
  standard one.
- **Mnemonics (access keys):** mark a letter per menu/item (`&File`, `E&xit`) so the menu is
  keyboard-drivable (Alt+F…). Keep them unique within a menu.
- **Accelerators (shortcuts):** assign the **platform-standard** key to standard commands
  (`Ctrl/⌘+S` save, `Ctrl/⌘+Z` undo, `Ctrl/⌘+C/V/X`, `Ctrl/⌘+F`) and **never override a
  platform-reserved shortcut**. Show the accelerator in the menu item so it's learnable. Qt:
  `QKeySequence::Save` etc. resolve to the right key per platform — use the standard sequences,
  don't hardcode `Ctrl+S`.
- **Context menus:** right-click gives the relevant commands *for the thing under the cursor* — a
  subset of the menu bar, not new-only commands. Desktop users expect them everywhere.
- **Enable/disable vs hide:** **disable** (grey out) a command that's temporarily unavailable so its
  location stays learnable; **hide** only what's irrelevant to the current mode. A menu that
  reshuffles its items is disorienting.
- **Group and separate** with separators; use submenus sparingly (one level deep where possible);
  a trailing `…` means "opens a dialog for more input."

## 4 — The desktop keyboard model

Desktop apps are expected to be **fully operable without a mouse** — more strictly than the web.

- **Logical tab order** through controls; a **visible focus indicator** always (same rule as
  `fundamentals` §5). Group radio buttons for arrow-key navigation.
- **Default and cancel buttons:** **Enter** triggers the default (primary) button, **Esc** cancels
  the dialog/closes the popup. Mark them so keyboard users get them for free (Qt:
  `button->setDefault(true)`; `QDialog` maps Esc to reject).
- **Label buddies:** associate each field's label with its control (mnemonic focuses the field) —
  Qt `label->setBuddy(field)`; this is also an accessibility win (§9).
- Respect **system-level** shortcuts and text-editing keys; don't repurpose them inside your app.

## 5 — Layout that resizes (never absolute positioning)

A desktop window is **resized, maximized, and split** by the user, and text **translates** to
different lengths. Fixed pixel positions break all three.

- **Use the toolkit's layout managers**, not absolute coordinates. Qt: `QVBoxLayout` /
  `QHBoxLayout` for stacks, `QGridLayout` for tabular arrangement, `QFormLayout` for label→field
  forms. GTK/WinUI have the equivalents (boxes, grids). Compose nested layouts rather than placing
  widgets by x/y.
- **Control what stretches:** stretch factors + spacers decide which regions grow when the window
  does; **size policies** (`Fixed` / `Preferred` / `Expanding`) declare each widget's flex. Set
  sensible **minimum sizes** so the layout never collapses into overlap.
- **Splitters** (`QSplitter`) for user-resizable panes; **scroll areas** for content that can exceed
  the viewport.
- **Save and restore window geometry and panel layout** between sessions (`QSettings` +
  `saveState`/`saveGeometry`) — reopening where you left off is a baseline desktop expectation.
- Density is higher than the web and pointers are precise, but **still keep comfortable spacing**
  (the `fundamentals` scale) and adequate click targets — toolbar icons ~24–32px with padding, not
  crammed.

## 6 — HiDPI, scaling, and system fonts

Desktops run at 100/125/150/200 % scale across mixed-DPI monitors. Hardcoded pixels look right on
exactly one machine.

- **Work in device-independent units** and let the toolkit scale. Qt 6 enables HiDPI scaling by
  default and works in logical pixels — don't fight it with manual DPI math.
- **Icons and images:** prefer **vector/SVG icons** (scale crisply at any factor) or provide
  `@2x`/`@3x` raster variants. A single 16px PNG is blurry at 200 %. **Never use system/OS emoji as
  toolbar/menu/status icons** — they render differently per platform, ignore the app palette, and
  are announced by name to screen readers; ship a real SVG icon set instead (see `devkit:ui-design`
  §12).
- **Use the system font and system metrics**, not a hardcoded family/size — it's what makes the app
  look native and respects the user's font-size setting. Theme *relative* to it.
- Test on a HiDPI display and a scaled display, and across a multi-monitor drag between them.

## 7 — Native feel & honoring the OS

Even a custom-styled app should honor the environment it runs in:

- **Native widgets and native dialogs** — use the OS file open/save, color, and print dialogs
  (Qt `QFileDialog::getOpenFileName` uses the native one). Users trust and know them; a hand-rolled
  file picker is a red flag.
- **Follow the OS theme, including dark mode.** Read system colors from the platform palette
  (Qt `QPalette` / `QStyleHints::colorScheme`) rather than hardcoding — an app that stays white when
  the OS goes dark looks broken. This is the same semantic-token discipline as `design-systems` §3,
  applied to the system palette.
- **Platform button order in dialogs** differs and matters: Windows is typically
  `[ OK ] [ Cancel ]`; macOS and GNOME put the confirming action on the **right**,
  `[ Cancel ] [ OK ]`. Qt `QDialogButtonBox` with standard roles lays them out **per platform
  automatically** — use it instead of placing buttons yourself.
- **Respect system settings:** reduced motion, high-contrast themes, and the user's font size.
- **Terminology per platform:** "Preferences" (macOS) vs "Settings/Options" (Windows), "Quit" vs
  "Exit". Small, but it's the tell of a native app.

## 8 — Responsiveness, feedback & long operations

- **Never block the UI thread.** The event loop must keep painting and handling input — a frozen
  window ("Not Responding") is the cardinal desktop sin. Do file/network/CPU work **off the main
  thread** and marshal results back. Qt: a `QThread`/worker or `QtConcurrent`, communicating via
  **signals/slots** (which safely cross threads); never touch widgets from a worker thread.
- **Show progress for anything >~1s:** a busy cursor for short waits, a **determinate** progress bar
  when you know the extent, **indeterminate** when you don't, and a **Cancel** for long jobs.
- **Undo/redo:** desktop users expect `Ctrl/⌘+Z` to work for their edits app-wide. Design around a
  command/undo-stack model (Qt `QUndoStack`/`QUndoCommand`) rather than bolting it on later.
- **Unsaved-changes protection:** intercept window close (`closeEvent`) and prompt to save when the
  document is dirty — losing work on an accidental close is unforgivable on the desktop.
- Use the **status bar** for transient, non-critical feedback; reserve dialogs for things that must
  be acknowledged.

## 9 — Accessibility on the desktop

Desktop a11y goes through **platform accessibility APIs** — UI Automation (Windows), AT-SPI
(Linux), NSAccessibility (macOS) — which screen readers (Narrator, Orca, VoiceOver) consume.

- **Standard widgets are accessible for free** — they report their role/name/state to the platform
  API. This is the strongest reason to use native controls and *not* paint custom widgets on a bare
  canvas; if you must, you take on implementing the accessibility interface yourself
  (Qt `QAccessible`).
- **Give every meaningful control a name** (Qt `setAccessibleName` / `setAccessibleDescription`),
  and label fields via **buddies/mnemonics** (§4) so the label is programmatically tied to the input.
- **Full keyboard operability, visible focus, logical order** (§4) — the same non-negotiables as the
  web.
- **Don't encode meaning in color alone; honor high-contrast themes**; ensure text contrast meets
  AA against the *actual* system palette in both light and dark.
- **WCAG 2.2 is the reference where it applies** (it's authored for the web, but its intent ports):
  keep **click/tap targets** comfortable (the 24px floor / 44px comfortable target-size guidance —
  don't cram toolbar buttons, see §5); keep the **focused control fully visible** — auto-scroll it
  into view so a docked panel, status bar, or floating inspector never covers the focus ring (the
  desktop analogue of Focus Not Obscured); and give any **drag-only** interaction a keyboard/click
  alternative (the Dragging Movements analogue).

## 10 — Qt specifics (and how they generalize)

- **Widgets vs QML/Qt Quick:** choose per app. **Qt Widgets** — traditional desktop controls, native
  look, best for form/document/tool apps. **QML (Qt Quick)** — GPU-accelerated, animation-friendly,
  fluid/touch or custom-styled UIs, best for modern or cross-device looks. Don't mix paradigms
  without reason.
- **Theming as tokens:** style with **QSS** (Qt Style Sheets — CSS-like) and/or a customized
  `QPalette`. Centralize colors/metrics as a single stylesheet/palette so themes swap in one place —
  the `design-systems` token model, expressed in Qt. (GTK is literally CSS; WinUI uses XAML resource
  dictionaries — same idea.)
- **Model/View for data:** show lists/tables/trees through a model (`QAbstractItemModel` +
  `QTableView`/`QTreeView`), not by hand-syncing widgets to data — it scales, sorts, and stays
  consistent. Every serious toolkit has this pattern.
- **`.ui` files / Qt Designer** to lay out visually and keep layout separate from logic; load with
  `uic`. **`tr()`** wrap all user-facing strings for translation from day one (and remember
  translated text changes width — see §5).
- **How it ports:** GTK → CSS theming + `GtkBuilder` + box/grid containers + GObject signals;
  WinUI → XAML + data binding + resource dictionaries; wxWidgets → sizers + native controls. The
  vocabulary changes; **layout managers, a menu/command model, native theming, an event loop you
  keep free, and the platform a11y bridge are universal.**

## Review checklist (before calling a desktop UI done)

- [ ] Follows the target platform HIG; a deliberate native-vs-consistent stance, applied fully.
- [ ] `QMainWindow`-style structure: standard menu bar + order, toolbar mirrors key commands, status
      bar for transient feedback; modals only when unavoidable.
- [ ] Every command is in the menu bar; mnemonics set; **platform-standard** accelerators shown and
      none overridden; context menus where expected; unavailable commands disabled, not removed.
- [ ] Fully keyboard-operable: tab order, visible focus, Enter=default / Esc=cancel, label buddies.
- [ ] Layout uses layout managers with size policies/stretch + minimum sizes — resizes and
      translates without breaking; window geometry & panel state saved/restored.
- [ ] HiDPI-clean at 100/150/200 %: device-independent units, vector/@2x icons (**no system
      emoji** as icons), system font.
- [ ] Native file/color dialogs; follows OS light/dark palette; per-platform dialog button order
      (`QDialogButtonBox`); respects reduced-motion / high-contrast / font-size settings.
- [ ] UI thread never blocks — long work is off-thread with progress + cancel; unsaved-changes
      prompt on close; undo/redo for edits.
- [ ] Accessible via the platform API: named controls, standard widgets (or a custom a11y bridge),
      keyboard + focus, no color-only meaning, AA contrast on the real palette. **WCAG 2.2 analogues:**
      comfortable target sizes (24/44px), focused control auto-scrolled into view (not obscured),
      drag-only actions have a keyboard/click alternative.
- [ ] The `ui-design` fundamentals (hierarchy, spacing/type scale, states, forms) and token
      discipline still hold — the platform layer is *on top of* them, not instead.

## Related

- `devkit:ui-design` — **read first.** `fundamentals` (hierarchy, spacing/type, component & content
  states, forms, feedback, accessibility) and `design-systems` (tokens, theming, component library)
  are the base craft; this skill only adds the native/desktop platform layer.
- `devkit:ui-design` `fundamentals` §0 — aesthetic direction (distinctive, not templated; the
  AI-default looks to avoid). Applies to a custom-styled desktop app just as to the web. The external
  `frontend-design` skill covers the same ground, optionally — not required.
- `devkit:ui-ux-design` — the web counterpart (Dolle-MCP build workflow). Use it for browser UIs;
  use this for native ones. The design-brief discipline (settle direction before building) is worth
  borrowing either way.

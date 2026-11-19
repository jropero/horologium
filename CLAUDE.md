# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. Component and utility notes live in `components/CLAUDE.md` and `utils/CLAUDE.md`; the festival scholarly review procedure is in `docs/research/CLAUDE.md`.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Vite+ (Rolldown) build → dist/
npm run preview  # Preview the production build locally
npm run lint     # Oxlint (vp lint)
npm run format   # Oxfmt (vp fmt)
```

Unit tests live in `tests/` (Vitest 5, `npm run test` or `vp test run`). `scripts/buildRomanRoads.ts` regenerates the bundled Roman roads (see `utils/CLAUDE.md`). Verification scripts in the root (`verify_moon.ts`, `verify_descriptions.ts`, `verify_translation.ts`) can be run with `npx tsx <file>` for ad-hoc checks.

### Toolchain

Vite+ 1.5.0 replaces ESLint + Prettier + Babel. All tooling is configured in `vite.config.ts` (`lint`, `fmt`, `staged` blocks). Pre-commit hook runs `vp staged`. SonarJS rules load via `lint/sonarjs.js` (Oxlint JS plugin).

### Android (Capacitor)

```bash
npm run build && npx cap sync android   # Sync web assets to Android project
npx cap open android                    # Open Android Studio
```

## Architecture

**Horologium Romanum** is a PWA + Android app that converts modern time into the temporal systems of five ancient civilizations using precise astronomical algorithms. No backend — all computation is client-side.

### Civilization system

The active civilization (`rome` | `hellas` | `aegyptus` | `babylonia` | `zhongguo`) is stored in `CivilizationContext` (`contexts/CivilizationContext.tsx`) and persisted to `localStorage`. It drives three parallel tracks:

- **Time calculation**: `utils/romanTimeUtils.ts`, `utils/hellenicTimeUtils.ts`, `utils/egyptianTimeUtils.ts`, `utils/babylonianCalendarUtils.ts`, `utils/chineseTimeUtils.ts` — each returns a civilization-specific time object. These functions receive `(Date, lat, lng)` and compute temporal hours, calendar date, moon phase, planetary ruler, etc.
- **Clock component**: `RomanClock` for Rome and Hellas; `EgyptianClock` for Aegyptus; `BabylonianClock` for Babylonia; `ChineseClock` for Zhongguo.
- **Calendar info bar**: `RomanCalendarInfo`, `HellenicCalendarInfo`, `EgyptianCalendarInfo`, `BabylonianCalendarInfo` — rendered conditionally in `App.tsx`. Zhongguo has no separate info bar; all content is embedded in `ChineseClock`.
- **UI labels**: All strings are civilization-specific, sourced from `utils/civLabels.ts` via the context.

### Theming

A single dark theme is driven by the `data-civ` HTML attribute (set in `App.tsx`), which selects civilization-specific CSS variable overrides in `index.css`. CSS custom properties on `:root`: `--ink`, `--gold-leaf`, `--gold-dim`, `--parchment`, `--parchment-dark`, `--midnight`, `--roman-red`, `--festival-text`, plus shared vars `--travel-accent` (time-travel amber, the same in every civilization — don't use `--festival-text` for it), `--font-body`, `--shadow-xl`, `--shadow-card`, `--blur-modal`, `--blur-card`, `--modal-max-w`, `--lh-prose`. Each `[data-civ="…"]` block overrides the colour tokens for its palette. Styling is plain CSS — no Tailwind; component-scoped CSS files live alongside each component in `components/`. Fonts: `Cinzel` (headings) and IM Fell English via `var(--font-body)` (body text; canvas code, which can't read CSS variables, names `"IM Fell English", Georgia, serif` directly). IM Fell has a single weight, so its `@font-face` rules cover 100–900: bold text uses the real glyphs instead of a synthesised faux bold.

**Global minimum font size: 12px** (`font-size: 0.75rem`) throughout the entire app. Never go below this — it applies globally, including modals and dense data tables.

### Weather

`hooks/useWeather.ts` fetches from Open-Meteo (free, no key required) via `utils/weather.ts`. Results include civilization-specific wind names and descriptions. Live weather is refreshed every 30 minutes. When the user time-travels to a date (via `DateTimePicker` / `CivilCalendarDatePicker`), `App.tsx` passes that date to `useWeather`, and `fetchWeather` pulls the recorded weather for that specific day/hour from the archive API (`archive-api.open-meteo.com`), falling back to the forecast API's `past_days` window for recent dates and to live weather when no historical data exists (e.g. the future or dates before 1940). This drives every weather effect in the app.

### Capacitor (Android)

The Android native shell hides the status bar on startup. `SplashScreen.hide()` is called after the first time calculation resolves. The time ticker fires every 15 seconds (not every second) to reduce CPU usage on mobile.

### PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. Service worker uses `autoUpdate` strategy. Google Fonts are cached for 365 days via Workbox `CacheFirst`.

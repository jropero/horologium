# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # TypeScript compile + Vite build → dist/
npm run preview  # Preview the production build locally
```

There are no lint or test scripts. Verification scripts in the root (`verify_moon.ts`, `verify_descriptions.ts`, `verify_translation.ts`) can be run with `npx tsx <file>` for ad-hoc checks.

### Android (Capacitor)
```bash
npm run build && npx cap sync android   # Sync web assets to Android project
npx cap open android                    # Open Android Studio
```

## Architecture

**Horologium Romanum** is a PWA + Android app that converts modern time into the temporal systems of three ancient Mediterranean civilizations using precise astronomical algorithms. No backend — all computation is client-side.

### Civilization system

The active civilization (`rome` | `hellas` | `aegyptus` | `babylonia`) is stored in `CivilizationContext` (`contexts/CivilizationContext.tsx`) and persisted to `localStorage`. It drives three parallel tracks:

- **Time calculation**: `utils/romanTimeUtils.ts`, `utils/hellenicTimeUtils.ts`, `utils/egyptianTimeUtils.ts`, `utils/babylonianCalendarUtils.ts` — each returns a civilization-specific time object. These functions receive `(Date, lat, lng)` and compute temporal hours, calendar date, moon phase, planetary ruler, etc.
- **Clock component**: `RomanClock` is used for both Rome and Hellas; `EgyptianClock` for Aegyptus; `BabylonianClock` for Babylonia.
- **Calendar info bar**: `RomanCalendarInfo`, `HellenicCalendarInfo`, `EgyptianCalendarInfo`, `BabylonianCalendarInfo` — rendered conditionally in `App.tsx`.
- **UI labels**: All strings are civilization-specific, sourced from `utils/civLabels.ts` via the context.

### Astronomical core

`utils/solar.ts` implements Meeus/NOAA algorithms for sunrise/sunset and moon phase with no external dependencies. The moon phase is anchored to Jan 29, 2025 for current-era accuracy. All time calculations in the three `*TimeUtils` files depend on `getSunTimes` and `getMoonPhase` from this module.

### Data files (static)

Heavy static datasets live in `utils/`:
- Roman: `romanCalendarData.ts`, `romanHistoryData.ts`, `romanYearData.ts`, `romanProvinces.ts`
- Hellenic: `atticCalendarData.ts`, `atticCalendarUtils.ts`, `greekRegions.ts`, `greekTranslations.ts`, `greekTransliteration.ts`, `sortesHomericae.ts`
- Egyptian: `egyptianCalendarData.ts`, `egyptianCalendarUtils.ts`, `egyptianDeities.ts`, `egyptianFestivalsData.ts`, `egyptianHemerologyData.ts`, `egyptianWisdomData.ts`, `egyptianAstronomy.ts`, `egyptianRegions.ts`
- Babylonian: `babylonianCalendarUtils.ts`, `babylonianLoreData.ts`, `babylonianSkylineGenerator.ts`
- Shared: `sententiaeData.ts`, `apophthegmataData.ts`, `sortesVergilianae.ts`, `locations.ts`

### Procedural skyline

Four generators (`utils/skylineGenerator.ts`, `greekSkylineGenerator.ts`, `egyptianSkylineGenerator.ts`, `babylonianSkylineGenerator.ts`) produce SVG paths using a seeded PRNG, rendering civilization-appropriate architecture (temples, acrópolis, obelisks, ziggurats) as the animated background.

### Theming

Two themes (`dark` / `light`/parchment) are set via `data-theme` and `data-civ` HTML attributes. Custom Tailwind tokens: `ink`, `gold-leaf`, `gold-dim`, `parchment`, `parchment-dark`, `midnight`. Fonts: `Cinzel` (serif headings) and `IM Fell English` (body). See `tailwind.config.js`.

### Weather

`hooks/useWeather.ts` fetches from Open-Meteo (free, no key required) via `utils/weather.ts`. Results include civilization-specific wind names and descriptions. Refreshed every 30 minutes.

### Capacitor (Android)

The Android native shell hides the status bar on startup. `SplashScreen.hide()` is called after the first time calculation resolves. The time ticker fires every 15 seconds (not every second) to reduce CPU usage on mobile.

### PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. Service worker uses `autoUpdate` strategy. Google Fonts are cached for 365 days via Workbox `CacheFirst`.

---

## Babylonian Calendar — Implementation Notes

### Calendar system

- **Era**: Seleucid Era (SE), epoch = 1 Nisannu SE 1 = 3–4 April 311 BCE (Julian). Code: `seYear = nisannuGregYear + 311` (Babylonian spring reckoning). Using `+ 312` would be the Macedonian autumn reckoning — wrong for this context.
- **Months**: 12 lunisolar months, each 29 or 30 days (synodic). Month lengths alternate but are determined astronomically.
- **Intercalation**: 7 intercalary months per 19-year Metonic cycle. The extra month is always **Addaru II** (after month 12) or occasionally **Ulūlu II** (after month 6). `babylonianCalendarUtils.ts` contains the lookup table.
- **Month names and numbers** (important — "Warḫum N" means "Month N"):
  1. Nisannu · 2. Aiaru · 3. Simanu · 4. Dumuzu · 5. Abu · 6. Ulūlu
  7. Tašrītu · 8. Araḫsamnu · 9. Kislīmu · 10. Ṭebētu · 11. Šabāṭu · 12. Addaru
- **"Warḫum"** (𒌗) is the Akkadian word for "month" (literally "moon"). Displayed as "Warḫum N" in the UI badge below the month name = canonical tablet notation.
- **Day divisions**: The Babylonian day begins at sunset. Nights are divided into 3 watches (maṣṣartu), days into temporal hours. The planetary-hour ruler cycles through the 7 planets (Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn).
- **Sapatu** (day 15): the full moon "rest" day — sacred, shown with amber gold dot. Do NOT confuse with the Judaic Sabbath; it is a lunar phenomenon, not a weekly cycle.
- **Šapaṭu** / special days: 7, 14, 15 (sapatu), 19, 21, 28 had restrictions on royal/priestly activity per cuneiform texts.

### Key algorithms in `babylonianCalendarUtils.ts`

- `getBabylonianDate(date, lat, lng)` is the main entry point — returns a `BabylonianDateInfo` object.
- Month boundaries are computed from actual lunar conjunction (new moon) times, not a fixed calendar.
- `getMoonPhase()` from `solar.ts` is reused; phase anchored to 29 Jan 2025 known new moon.
- The Seleucid year starts with Nisannu, which begins on the first new moon after the vernal equinox.
- Metonic intercalation: `isIntercalaryYear(seYear)` checks whether the SE year needs Addaru II.

### Day events in `babylonianLoreData.ts`

Each month entry in `BABYLONIAN_LORE` has:
- `deity`, `icon`, `description`, `festival`, `zodiacSign` — month-level metadata.
- `dayEvents?: Record<number, BabylonianDayEvent>` — day-specific festivals/rituals.

`BabylonianDayEvent` interface:
```ts
interface BabylonianDayEvent {
  shortLabel: string;  // 1-3 word label shown in day grid dot tooltip
  description: string; // full ritual description shown in tap panel
  type: 'festival' | 'ritual' | 'omen' | 'rest';
}
```
Days with `dayEvents` entries show a **green dot** (top-right of cell) in the DayGrid. Primary sources used: Cohen 1983 *Cultic Calendars of the Ancient Near East*, ANETODAY ritual texts.

### Theme — Lapis Lazuli / Ishtar Gate palette

CSS variables are overridden in `[data-civ="babylonia"]` block in `index.css`:
- `--ink`: `#07101d` (deep lapis night)
- `--gold-leaf`: `#60a5fa` (blue-400, the "primary accent" colour)
- `--gold-dim`: `#93c5fd` (blue-300, secondary)
- `--parchment`: `#e8edf8` (cool linen for readable text)
- `--roman-red`: `#818cf8` (indigo-400, secondary accent)

Tailwind utility classes used in Babylonian components should use `blue-*` / `indigo-*` tones, **not** amber/orange (those belong to Egypt). Minimum font size: `text-xs` (12px) throughout.

### `CuneiformBorder` SVG in `BabylonianCalendarInfo.tsx`

Replicates the actual **Ishtar Gate upper frieze** (Pergamon Museum, Berlin):
- **Pattern tile**: 50×36 user units, repeating via `<pattern>`.
- **Palmette** (cream fan flower, 7 radiating ribs + arc): centered at x=25, amber base cup at y≈26.
- **Teal S-scroll volutes**: flanking the palmette at x≈2 and x≈48 (outer amber beads at tile edges for near-continuous tiling), inner cream dot at tip.
- **Amber brick strips**: top (y=0–4) and bottom (y=32–36) with mortar joint dividers every 12.5 units.
- Colors: `#060e22` cobalt ground · `rgba(210,150,40)` amber · `rgba(238,228,200)` cream · `rgba(20,190,215)` turquoise.
- SVG height: `h-14` (CSS) / viewBox height 36, `preserveAspectRatio="none"`.

### `DayGrid` interaction model

Mobile-first tap/click (no hover):
- Each day is a `<button>` with `onClick` toggling `selectedDay` state.
- Tapping a selected day deselects it (panel closes).
- Info panel renders below the grid (not a tooltip/overlay) showing special day info + festival description.
- Green dot top-right of cell = has `dayEvent`. Bottom dot = SPECIAL_DAYS (sapatu, quarters, etc.).

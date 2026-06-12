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

The active civilization (`rome` | `hellas` | `aegyptus` | `maya`) is stored in `CivilizationContext` (`contexts/CivilizationContext.tsx`) and persisted to `localStorage`. It drives three parallel tracks:

- **Time calculation**: `utils/romanTimeUtils.ts`, `utils/hellenicTimeUtils.ts`, `utils/egyptianTimeUtils.ts`, `utils/mayaCalendarUtils.ts` — each returns a civilization-specific time object. These functions receive `(Date, lat, lng)` and compute temporal hours, calendar date, moon phase, planetary ruler, Long Count, etc.
- **Clock component**: `RomanClock` is used for both Rome and Hellas; `EgyptianClock` for Aegyptus; `MayaClock` for Maya.
- **Calendar info bar**: `RomanCalendarInfo`, `HellenicCalendarInfo`, `EgyptianCalendarInfo`, `MayaCalendarInfo` — rendered conditionally in `App.tsx`.
- **UI labels**: All strings are civilization-specific, sourced from `utils/civLabels.ts` via the context.

### Astronomical core

`utils/solar.ts` implements Meeus/NOAA algorithms for sunrise/sunset and moon phase with no external dependencies. The moon phase is anchored to Jan 29, 2025 for current-era accuracy. All time calculations in the three `*TimeUtils` files depend on `getSunTimes` and `getMoonPhase` from this module.

### Data files (static)

Heavy static datasets live in `utils/`:
- Roman: `romanCalendarData.ts`, `romanHistoryData.ts`, `romanYearData.ts`, `romanProvinces.ts`
- Hellenic: `atticCalendarData.ts`, `atticCalendarUtils.ts`, `greekRegions.ts`, `greekTranslations.ts`, `greekTransliteration.ts`, `sortesHomericae.ts`
- Egyptian: `egyptianCalendarData.ts`, `egyptianCalendarUtils.ts`, `egyptianDeities.ts`, `egyptianFestivalsData.ts`, `egyptianHemerologyData.ts`, `egyptianWisdomData.ts`, `egyptianAstronomy.ts`, `egyptianRegions.ts`
- Maya: `mayaLoreData.ts`, `mayaCalendarUtils.ts`
- Shared: `sententiaeData.ts`, `apophthegmataData.ts`, `sortesVergilianae.ts`, `locations.ts`

### Procedural skyline

Four generators (`utils/skylineGenerator.ts`, `greekSkylineGenerator.ts`, `egyptianSkylineGenerator.ts`, `mayaSkylineGenerator.ts`) produce SVG paths using a seeded PRNG, rendering civilization-appropriate architecture (temples, acrópolis, obelisks, pyramids) as the animated background.

### Theming

Two themes (`dark` / `light`/parchment) are set via `data-theme` and `data-civ` HTML attributes. Custom Tailwind tokens: `ink`, `gold-leaf`, `gold-dim`, `parchment`, `parchment-dark`, `midnight`. Fonts: `Cinzel` (serif headings) and `IM Fell English` (body). See `tailwind.config.js`.

### Weather

`hooks/useWeather.ts` fetches from Open-Meteo (free, no key required) via `utils/weather.ts`. Results include civilization-specific wind names and descriptions. Refreshed every 30 minutes.

### Capacitor (Android)

The Android native shell hides the status bar on startup. `SplashScreen.hide()` is called after the first time calculation resolves. The time ticker fires every 15 seconds (not every second) to reduce CPU usage on mobile.

### PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. Service worker uses `autoUpdate` strategy. Google Fonts are cached for 365 days via Workbox `CacheFirst`.

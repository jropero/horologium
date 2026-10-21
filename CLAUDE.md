# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # TypeScript compile + Vite build → dist/
npm run preview  # Preview the production build locally
```

There are no lint or test scripts. `scripts/buildRomanRoads.ts` regenerates the bundled Roman roads (see "Roman roads layer"). Verification scripts in the root (`verify_moon.ts`, `verify_descriptions.ts`, `verify_translation.ts`) can be run with `npx tsx <file>` for ad-hoc checks.

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

### Astronomical core

`utils/solar.ts` wraps `astronomy-engine` (sunrise/sunset via `SearchRiseSet`, moon phase via `MoonPhase`, conjunctions via `SearchMoonPhase`, equinoxes/solstices via `Seasons`). All `*TimeUtils` files depend on `getSunTimes` and `getMoonPhase` from this module. `getSunTimes(date)` takes the device-local Y/M/D of `date` but places the day window at the observer's mean solar midnight, so a device in a far-away timezone still gets exactly one sunrise and one sunset per day.

**Day boundaries and planetary hours (all civilizations).** Planetary hours run continuously in Chaldean order and the planetary day begins at sunrise: night hours (also those after midnight) belong to the weekday of the preceding daylight. The weekday is taken at the observer's mean local solar time from the sunrise/sunset that opened the current 12-hour period, never from `now.getDay()`.

**Observational lunar calendars (Babylonian, Attic)** share `utils/lunarCivilCalendar.ts`: the civil day runs sunset → sunset; a month begins at the first sunset when the Moon is at least `minAgeDays` old (Babylon 0.75 d, Athens 1.5 d), which guarantees 29/30-day months; the year begins with the first month starting on or after the spring equinox (Babylon) or summer solstice (Athens); month starts are computed for the user's coordinates (Attic falls back to Athens when no location is passed). Day N = N-th sunset counted from the month-start sunset. Date pickers represent each civil day by the noon of its daylight half.

### Data files (static)

Heavy static datasets live in `utils/`:
- Roman: `romanCalendarData.ts`, `romanHistoryData.ts`, `romanYearData.ts`, `romanProvinces.ts`, `romanRoads.ts` (roads layer, see below)
- Hellenic: `atticCalendarData.ts`, `atticCalendarUtils.ts`, `greekRegions.ts`, `greekTranslations.ts`, `greekTransliteration.ts`, `sortesHomericae.ts`
- Egyptian: `egyptianCalendarData.ts`, `egyptianCalendarUtils.ts`, `egyptianDeities.ts`, `egyptianFestivalsData.ts`, `egyptianHemerologyData.ts`, `egyptianWisdomData.ts`, `egyptianAstronomy.ts`, `egyptianRegions.ts`, `egyptianSkyMap.ts` (star-map positions), `brightStarCatalog.ts` (2851 stars ≤ mag 5.5, lazy-loaded)
- Babylonian: `babylonianCalendarUtils.ts`, `babylonianLoreData.ts`, `babylonianSkylineGenerator.ts`, `babylonianWisdomData.ts`
- Chinese: `chineseCalendarData.ts`, `chineseCalendarUtils.ts`, `chineseLunisolarUtils.ts`, `chineseTimeUtils.ts`
- Shared: `sententiaeData.ts`, `apophthegmataData.ts`, `sortesVergilianae.ts`, `locations.ts`
- The Roman map (`components/RomanMapCanvas.tsx` + `utils/romanProvinces.ts`) draws the klokantech/roman-empire layers bundled under `public/assets/roman-map/` (provinces, labels, ~8 000 places, rivers, lakes, fortifications). `loadRomanMapData()` reads them from `${import.meta.env.BASE_URL}assets/roman-map/` — `/r/` on the web, `./` in the Android APK — so the map is fully offline. The map only opens for Rome (`canOpenMap` in `ProvinciaInfo.tsx`), so the roads layer below never exists for other civilizations.

### Roman roads layer (Itiner-e)

- **Data**: `public/assets/roman-map/roads.json` (2.9 MB, 0.95 MB gzip), all 14 769 segments of Itiner-e static version 2024 (de Soto, Pažout, Brughmans et al., *Scientific Data* 2025; doi:10.5281/zenodo.17122148; **CC BY 4.0**, attribution shown under the map while the layer is on). Generated by `npx tsx scripts/buildRomanRoads.ts <itinere_roads.geojson>`: EPSG:3395 → WGS84, Douglas–Peucker at 0.001°, 1e-4° integer deltas, string table. The script documents every normalisation. Don't hand-edit the JSON.
- **Loading**: `utils/romanRoads.ts` `loadRomanRoads()` fetches it from the same `DATA_BASE`, only while the toggle is on (`localStorage` key `romanMapRoads`, default on). It is precached by the service worker through `includeAssets`, but kept out of `globPatterns` (`globIgnores` in `vite.config.ts`) because it is over Workbox's 2 MiB glob limit.
- **Names**: the dataset's `Itinerary` field is split into three groups. Latin road names (`Via …`, `Strata …`) are the only ones used as map labels. Ancient itineraries (Tabula Peutingeriana, Itinerarium Antonini, Stadiasmus Patarensis…) are listed in the card. Modern names (Watling Street, Fosse Way, Limesweg…) are shown in the card only as *Nomina recentiora*: never as labels and never translated. Builders (`Cons_per_e`, English in the dataset) map to their standard Latin names. Period labels with no ancient form ("Tetrarchy", "Severan"…) are dropped, and only their dates are shown. The segment name (`Tractus`) mixes ancient and modern toponyms as the dataset gives them.
- **Dating**: Itiner-e dates only 477 segments (`Lower/Upper_Date` with error margins, 9999 = unknown). The build adds the start year of `Cons_per_e` (≈ 2 800 more), giving 3 300 dated segments; 11 469 have no date. Errata are fixed in `DATE_FIX` with their source (Via Aemilia 187 BCE, Livy 39.2.10). `roadExistence()` returns `yes`/`no`/`unknown`, with the error margins read as "may have existed".
- **Time-awareness**: live, every road is drawn. When the app is time-travelling (`travelDate` App → ProvinciaInfo → `year` prop), dated roads outside their range are hidden. Undated roads are **drawn faded, not hidden**: the dataset can't say they did not exist, and we don't guess. The road card's *Iter per tempora* slider sets a map-only year (`cardYear`) that overrides the app date for the roads layer. It resets when the app date changes.
- **Drawing** (`RomanMapCanvas`): roads are grouped into 5° tiles, each road in the tile of its bbox centre. Path2Ds are built lazily per level of detail (`ROAD_LODS`, chosen to stay under ½ px) × tile × style, and cleared when the year changes. Styles: main roads wider; certainty certain > conjectured (lighter) > hypothetical (dotted); undated roads faded while time-travelling; secondary roads fade in with zoom. Road names are set letter by letter along chained segments of the same via (`buildRoadChains`), from zoom 2.5. They are placed after the city names in the same collision grid, in IM Fell English italic at ≥ 12 px. A tap hits a city or creature first, then the nearest road within 10 px.
- **Strings**: all Latin, in `ROMAN_ROAD_LABELS` (`utils/civLabels.ts`).
- **Performance** (Chrome, 6× CPU throttle, dev build): vertical pan median 5.8 ms / max 9.6 ms per frame with roads (1.7 ms without). Warm zoom max 9.2 ms. The first visit to a new level of detail costs one ~60 ms frame while its paths are built.

### Procedural skyline

Four generators (`utils/skylineGenerator.ts`, `greekSkylineGenerator.ts`, `egyptianSkylineGenerator.ts`, `babylonianSkylineGenerator.ts`) produce SVG paths using a seeded PRNG, rendering civilization-appropriate architecture (temples, acrópolis, obelisks, ziggurats). `RomanClock` uses the first two (switching on civilization); `EgyptianCalendarInfo` uses the third (over the `EgyptianStarMap` canvas); `BabylonianCalendarInfo` uses the fourth inline. `ChineseClock` has its own built-in SVG rendering and does not use a separate skyline generator.

### Theming

A single dark theme is driven by the `data-civ` HTML attribute (set in `App.tsx`), which selects civilization-specific CSS variable overrides in `index.css`. Custom Tailwind tokens: `ink`, `gold-leaf`, `gold-dim`, `parchment`, `parchment-dark`, `midnight`. Fonts: `Cinzel` (serif headings) and `IM Fell English` (body). See `tailwind.config.js`.

### Weather

`hooks/useWeather.ts` fetches from Open-Meteo (free, no key required) via `utils/weather.ts`. Results include civilization-specific wind names and descriptions. Live weather is refreshed every 30 minutes. When the user time-travels to a date (via `DateTimePicker` / `CivilCalendarDatePicker`), `App.tsx` passes that date to `useWeather`, and `fetchWeather` pulls the recorded weather for that specific day/hour from the archive API (`archive-api.open-meteo.com`), falling back to the forecast API's `past_days` window for recent dates and to live weather when no historical data exists (e.g. the future or dates before 1940). This drives every weather effect in the app.

### Capacitor (Android)

The Android native shell hides the status bar on startup. `SplashScreen.hide()` is called after the first time calculation resolves. The time ticker fires every 15 seconds (not every second) to reduce CPU usage on mobile.

### PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. Service worker uses `autoUpdate` strategy. Google Fonts are cached for 365 days via Workbox `CacheFirst`.

### Hour panels (PlanetaryPositions, EgyptianHours, BabylonianSkyDiary)

Planetary hours and the planetary week are Greco-Roman (Cassius Dio 37.18–19; Bultrighini & Stern 2021: no planetary week in Egypt or Mesopotamia before the 2nd c. CE). `App.tsx` therefore renders a different hour panel per civilization. **All sources behind these panels — verbatim texts, citations, URLs, open uncertainties and enhancement ideas — are in `docs/research/hours-and-planets-sources.md`. Read it before changing or extending this data.**

- **`components/PlanetaryPositions.tsx`** — Rome, Hellas, Zhongguo. Builds the 24 hours of the current planetary day (sunrise → next sunrise) plus the next day, and lists the current hour and the next three (running on past sunrise into the next day). The current row has a progress bar; the header shows day/night hour length. Parapegma section above it (Rome, Hellas).
  - Rome: `utils/romanHoursData.ts`. `CHRONOGRAPH_HOURS` = the Chronograph of 354 captions (verbatim "… utile est" clause + the omens for births, a runaway, the sick and theft + B/C/N rating, a badge on every row). `CIVIC_DAY_HOURS` = Martial 4.8 (hours I–X, XI–XII Censorinus' *suprema*); `CIVIC_NIGHT_HOURS` = Censorinus 24, mapped approximately onto night hours; `vigiliaOf` = Vegetius 3.8 (four watches of three hours).
  - Hellas: `VALENS` = verbatim excerpts of Vettius Valens I.1 (Kroll 1908, page.line) with Spanish translation; `GREEK_STAR_NAMES` = Φαίνων, Φαέθων… ([Arist.] *De mundo* 392a).
  - Zhongguo: a note that the 七曜 week came with the 宿曜经 (759).
- **`components/EgyptianHours.tsx`** — Aegyptus. The 12 hour goddesses of the current half: night from the Amduat (Hornung), day from the Book of the Day (Müller-Roth 2008, lower confidence). Data in `utils/egyptianHoursData.ts`; transliterations only where verified.
- **`components/BabylonianSkyDiary.tsx`** — Babylonia. Time since sunset/sunrise in bēru and UŠ, the watch (`getWatch` in `babylonianCalendarUtils.ts`, names after Streck, RlA "Tag"), and the five planets as in the Astronomical Diaries: logogram + Akkadian name, sign (Late Babylonian abbreviation, tropical like the rest of the app), ina NIM / ina ŠÚ, UŠ (station). No Diaries term for retrograde is attested, so it is Spanish only. Planet state comes from `utils/planetSkyState.ts` (ecliptic of date, elongation-based visibility, daily motion).

---

## Egyptian Star Map — Implementation Notes

The sky scene of the Egyptian hero (`EgyptianCalendarInfo.tsx`, 16:9 box under the lotus frieze) is a 360° draggable panorama rendered by `components/EgyptianStarMap.tsx` on a Canvas 2D. `EgyptianClock` does not use it.

### Layering and pointer events

- Stack inside the sky scene: `EgyptianStarMap` (`absolute inset-0 z-0`, owns the drag) → weather SVG → skyline SVG → title text. Every layer above the star map is `pointer-events-none`, so drags anywhere in the scene reach the canvas. Anything interactive added on top must opt back in with `pointer-events-auto`.
- The canvas uses `touch-action: pan-y`: horizontal drags rotate the sky, vertical swipes still scroll the page. Do not change it to `none`, or the page can't be scrolled while a finger is on the hero.
- The `horizon={0.9}` prop puts altitude 0° on the skyline's ground line (y=180 of its 300×200 viewBox). The compass (N/E/S/O) and the curated ↔ full-sky toggle sit at the top edge because the skyline covers the bottom. The toggle calls `stopPropagation` because the hero wrapper has an `onClick`.

### Projection

- x = azimuth, 6 px/° (2160px panorama, wraps), centred on south (180°) on load. y = altitude from the horizon line up to `ALT_MAX` = 72°.
- The drag offset is kept in a ref (not state) and redraws are coalesced with `requestAnimationFrame`; there is a short fling inertia. Nothing is drawn while idle. A redraw happens only on drag, a new minute, a resize, or a mode change.
- The unmount cleanup resets `frameRef` to `null`. React StrictMode re-runs effects, and a stale frame id would make `scheduleDraw` skip every future draw (blank canvas).

### Data (`utils/egyptianSkyMap.ts`)

- `computeSky(date, lat, lng)` is memoised per minute. It returns apparent alt/az for the Sun, the Moon (+ `getMoonPhase`), Sopdet/Sirius (`Body.Star1`) and Algol (`Body.Star2`, + `getAlgolPhase().isEclipsed`), plus the 5 planets via `Equator` + `Horizon`. It also returns Sah (Orion, 7 stars) and Meskhetyu (Big Dipper, 7 stars) with their line pairs, and the Milky Way (galactic plane b=0, sampled every 3° of l, weighted toward the galactic centre).
- Fixed stars go through `Rotation_EQJ_HOR` + `HorizonFromVector`: J2000 in, precession/nutation/refraction handled. Don't pass J2000 RA/Dec straight to `Horizon()`: it expects equator-of-date coordinates, which puts stars about 0.3° off.
- `DefineStar` slots follow `egyptianAstronomy.ts`: Star1 = Sirius, Star2 = Algol. Their J2000 constants are exported from that file.
- The Milky Way is re-projected every minute (it rotates with the sky), not only on location change.
- `brightStarCatalog.ts` is a flat `[raDeg, decDeg, mag, …]` array, **sorted brightest first** (the draw loop `break`s at the magnitude limit). It was generated from d3-celestial `data/stars.6.json` (Yale BSC, BSD-3-Clause). It is a separate chunk (~20 KB gzip) loaded on mount via dynamic `import()`.
- Dev aid: opening the app with `?mockplanets` replaces the real alt/az of the 5 planets with fixed on-screen values (`MOCK_PLANET_SKY` in `EgyptianStarMap.tsx`) so every pictogram can be inspected at once, at any time of day. It is opt-in and side-effect-free otherwise — it only overrides `snapshot.planets`, which nothing else consumes.

### Modes and day/night

- Curated mode (default) draws the catalogue down to mag 4.5 at 0.85 opacity as a backdrop, so the view is never empty. Example: an October evening in Basel, when no Egyptian body is in the south view. On top come the Egyptian objects with labels: Sopdet (CSS-pulsed `.sopdet-glow` element in `index.css`), Ojo de Horus, Sah, Meskhetyu, Iah, Ra, and the five planets. Each planet gets a distinct pictogram via `drawPlanet()` — Sebegu (Mercury, small disc), Seba-dja (Venus, four rays), Hor-desher (Mars, red disc), Hor-tash-tawy (Jupiter, banded disc), Hor-ka-pet (Saturn, ringed disc) — keyed on `SkyPlanet.key`, so a body reads without its name. These are the attested Egyptian planet names (astronomical ceilings, e.g. the Ramesseum), not deity substitutes; sources are in the `PLANETS` comment in `egyptianSkyMap.ts`.
- Full mode draws all 2851 stars at full opacity.
- `dayFactor` (0 night → 1 day) blends linearly within ±30 min of sunrise/sunset. The hero passes `getSunTimes()` for the day, and events are also tested shifted by ±24 h. The sky palette goes night → twilight → day. Stars and the Milky Way fade out; only the Sun, Moon and planets above the horizon remain by day. A dark scrim keeps the hero text readable by day.

### Performance

Measured in Chrome during a drag: about 1 ms JS per frame at desktop speed, ≤ 3 ms at 6× CPU throttle in full mode. Position maths takes about 1.5 ms per minute. WASM isn't worthwhile: the cost is canvas rasterisation, not JS. If a low-end Android device stutters, cap the canvas DPR at 2 or cache the Milky Way band in an offscreen canvas.

---

## Babylonian Calendar — Implementation Notes

### Calendar system

- **Era**: Seleucid Era (SE), epoch = 1 Nisannu SE 1 = 3–4 April 311 BCE (Julian). Code: `seYear = nisannuGregYear + 311` (Babylonian spring reckoning). Using `+ 312` would be the Macedonian autumn reckoning — wrong for this context.
- **Months**: 12 lunisolar months, each 29 or 30 days (synodic). Month lengths alternate but are determined astronomically.
- **Intercalation**: 7 intercalary months per 19-year Metonic cycle. Historically the extra month was **Addaru II** (after month 12) or occasionally **Ulūlu II** (after month 6). The app does not use a lookup table: a year is intercalary when 13 crescent months fall between two Nisannu 1s (astronomical reconstruction), and the extra month is always shown as Addaru II.
- **Month names and numbers** (important — "Warḫum N" means "Month N"):
  1. Nisannu · 2. Aiaru · 3. Simanu · 4. Dumuzu · 5. Abu · 6. Ulūlu
  7. Tašrītu · 8. Araḫsamnu · 9. Kislīmu · 10. Ṭebētu · 11. Šabāṭu · 12. Addaru
- **"Warḫum"** (𒌗) is the Akkadian word for "month" (literally "moon"). Displayed as "Warḫum N" in the UI badge below the month name = canonical tablet notation.
- **Day divisions**: The Babylonian day begins at sunset. Nights are divided into 3 watches (maṣṣartu), days into temporal hours. The planetary-hour ruler cycles through the 7 planets (Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn).
- **Sapatu** (day 15): the full moon "rest" day — sacred, shown with amber gold dot. Do NOT confuse with the Judaic Sabbath; it is a lunar phenomenon, not a weekly cycle.
- **Šapaṭu** / special days: 7, 14, 15 (sapatu), 19, 21, 28 had restrictions on royal/priestly activity per cuneiform texts.

### Key algorithms in `babylonianCalendarUtils.ts`

- `getBabylonianDate(date, lat, lng)` is the main entry point — returns a `BabylonianDateInfo` object.
- Month boundaries come from real conjunctions + crescent sunset (`utils/lunarCivilCalendar.ts`), at the user's location; the civil day starts at sunset.
- The Seleucid year starts with Nisannu, which begins at the first crescent sunset on or after the vernal equinox (`getNisannu1`).
- Intercalation: `getBabylonianCalendarMeta` reports 13-month years (`isIntercalaryYear`, `intercalaryPositions` in the current 19-year cycle).

### Day events in `babylonianLoreData.ts`

Each month entry in `BABYLONIAN_LORE` has:
- `monthRegent`, `festivalDeity`, `regentNote?`, `icon`, `description`, `festival`, `zodiacSign` — month-level metadata.
  - `monthRegent` = canonical regent of the month, from the cuneiform month-regent lists (IV R 33; the Astrolabe B regent series). Shared source of truth: `BABYLONIAN_MONTH_REGENTS` in `types/babylonia.ts` (also drives `tutelaMensis` and the date-picker gloss). The regent's descriptive bio shown in the UI is `MONTH_REGENT_DESCS` in `babylonianCalendarUtils.ts`, exposed as `monthRegentDesc` on the date object.
  - `festivalDeity` = deity presiding the month's main festival / the Astrolabe B menology ("the month of X"). This is the evocative hero of the month card; it is NOT the regent.
  - `regentNote` = note on variants/ambiguity (Abu: Ningishzida con variante Ninurta; Addaru: los Siete grandes dioses).
- `dayEvents?: Record<number, BabylonianDayEvent>` — day-specific festivals/rituals.

`BabylonianDayEvent` interface:
```ts
interface BabylonianDayEvent {
  shortLabel: string;  // 1-3 word label shown in day grid dot tooltip
  description: string; // full ritual description shown in tap panel
  type: 'akitu' | 'procession' | 'mourning' | 'marriage' | 'ritual' | 'festival' | 'astronomy';
}
```
Days with `dayEvents` entries show a **green dot** (top-right of cell) in the DayGrid. Primary source for festivals: Cohen 1993 *Cultic Calendars of the Ancient Near East* (CDL Press), ANETODAY ritual texts. Month regents follow the cuneiform month-regent lists (IV R 33; Astrolabe B / KAV 218, ed. Horowitz, *The Three Stars Each*, 2014), corroborated by the *Iqqur īpuš* menology (Labat 1965, no. 105) and Muss-Arnolt 1892 (JBL 11).

### Theme — Lapis Lazuli / Ishtar Gate palette

CSS variables are overridden in `[data-civ="babylonia"]` block in `index.css`:
- `--ink`: `#07101d` (deep lapis night)
- `--gold-leaf`: `#60a5fa` (blue-400, the "primary accent" colour)
- `--gold-dim`: `#93c5fd` (blue-300, secondary)
- `--parchment`: `#e8edf8` (cool linen for readable text)
- `--roman-red`: `#818cf8` (indigo-400, secondary accent)

Tailwind utility classes used in Babylonian components should use `blue-*` / `indigo-*` tones, **not** amber/orange (those belong to Egypt). Minimum font size: `text-xs` (12px) throughout.

### Akkadian text and Spanish glosses

Every Akkadian term or heading on the Babylonian page is shown with its Spanish translation below or beside it, in a smaller, lighter italic (`text-xs`). The Akkadian stays the prominent element and is never replaced. UI text is Spanish or Akkadian only, never English, and no font may be under 12px on this page.

- **Sources.** Glosses are quoted from Spanish text already in the repo (`MONTH_REGENT_DESCS`, the month descriptions, `SPECIAL_DAYS`), or derived from mappings the code already makes (Akkadian planet → planet, hour number). Do not invent translations. If a term has no source, leave it unglossed and flag it.
- **Hero exception.** The 16:9 hero carries no glosses, by the user's decision. Its month, hour, ruler and watch are glossed in the cards below it.
- **Data:**
  - `SPECIAL_DAYS` (in `BabylonianCalendarInfo.tsx`): `label` is the Akkadian name, `es` the gloss.
  - `BabylonianLore`: `monthGloss` and `festivalDeityGloss?`.
  - `BabylonianDate`: `planetaryRulerEs`, `hourNameEs`, `moonPhaseNameEs`.
  - `BABYLONIAN_ZODIAC_ES` (in `types/babylonia.ts`): the tropical-sign equivalent of each Babylonian sign.
- **Shared components.** On the Babylonian page their Latin headings are replaced by Akkadian + Spanish pairs: Controls, LocationSelector, LocationModal, WeatherModal, WeatherWidget and the mobile menu in `App.tsx`. The pairs come from `BABYLONIAN_UI_TERMS` in `utils/civLabels.ts` (e.g. Ašru · Lugar, Naṣāru ša ginê · Observación regular) and render through `components/GlossedTerm.tsx`, with the Akkadian at 14px and the gloss at 12px. Measurements with no Akkadian equivalent (Velocidad, Dirección, Presión) are shown in Spanish only. The footer gloss uses the optional label `footerMottoEs`.
- **Day 7** is `Sebūtu` ("seventh day of the month"). **Day 21** is `Ūmu lemnu` (UD.ḪUL.GÁL, "evil day", glossed "Día funesto"), the label the hemerologies give it (Livingstone, CUSAS 25, 2013).

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

---

## Chinese Calendar (Zhongguo) — Implementation Notes

### Time system

- **Shichen** (時辰): The day is divided into 12 double-hours keyed to the Twelve Earthly Branches (地支, *dìzhī*). Each Shichen spans 2 solar hours and is associated with a zodiac animal. `getCurrentShichen(date)` in `utils/chineseTimeUtils.ts` returns the current branch and progress within it.
- **Solar Terms** (二十四节气, *Èrshísì Jiéqì*): 24 points of the ecliptic at 15° intervals, each ~15 days. Each is further divided into 3 pentads (候, *hòu*) of 5 days, each associated with a natural phenomenon. Computed in `utils/chineseCalendarUtils.ts`.
- **Lunisolar calendar**: Month boundaries follow actual lunar conjunctions. `utils/chineseLunisolarUtils.ts` computes the current month, day, and whether the year is intercalary.
- **Sexagenary cycle** (干支, *gānzhī*): 60-year cycle combining 10 Heavenly Stems (天干) and 12 Earthly Branches. Year, month, day, and hour each have their own pillar — together forming the Four Pillars of Destiny (八字, *bāzì*).

### Key components

- `ChineseClock` — main container; renders the animal clock face, solar term indicator, and sub-panels.
- `ChineseAnimalClock` — SVG clock face with the 12 zodiac animals arranged as hour sectors.
- `ChineseDatePillars` — Four Pillars (bāzì) display.
- `ChineseSolarTermsModal` — full 24-term wheel with pentad details.
- `ChineseYearCycle` / `ChineseYearWheel` — 60-year sexagenary cycle visualization.
- `ChineseWeatherOracle` — weather framed in traditional Chinese cosmology.
- `SexagenaryCycleCard` — compact card showing the current year's stem-branch pair.

### Theme — Ink Wash / Vermilion palette

CSS variables are overridden in `[data-civ="zhongguo"]` block in `index.css`:
- `--ink`: `#1a1410` (deep ink-wash dark)
- `--gold-leaf`: `#e11d48` (rose-600, vermilion red primary accent)
- `--gold-dim`: `#be123c` (rose-700, secondary)
- `--parchment`: `#fef3c7` (warm amber-50 for text)
- `--roman-red`: `#e11d48` (same as gold-leaf here)
- Background: radial ink-wash gradients simulating brushed ink depth.

Tailwind utility classes in Chinese components use `red-*` / `rose-*` for primary accents and `amber-*` / `yellow-*` for secondary. Minimum font size: `text-xs` throughout.

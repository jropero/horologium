# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Vite+ (Rolldown) build → dist/
npm run preview  # Preview the production build locally
npm run lint     # Oxlint (vp lint)
npm run format   # Oxfmt (vp fmt)
```

Unit tests live in `tests/solar.test.ts` (Vitest 5, `npm run test` or `vp test run`). `scripts/buildRomanRoads.ts` regenerates the bundled Roman roads (see "Roman roads layer"). Verification scripts in the root (`verify_moon.ts`, `verify_descriptions.ts`, `verify_translation.ts`) can be run with `npx tsx <file>` for ad-hoc checks.

### Toolchain

Vite+ 1.5.0 replaces ESLint + Prettier + Babel. All tooling is configured in `vite.config.ts` (`lint`, `fmt`, `staged` blocks). Pre-commit hook runs `vp staged`. SonarJS rules load via `lint/sonarjs.js` (Oxlint JS plugin).

### Android (Capacitor)

```bash
npm run build && npx cap sync android   # Sync web assets to Android project
npx cap open android                    # Open Android Studio
```

## Egyptian festival data — sources and quality standards

Festival data for the Aegyptus civilization lives in `utils/egyptianFestivalsData.ts`. Two collections:

- **`CIVIL_FESTIVALS`**: keyed `"month-day"` (0-based month, e.g. `"3-1"` = I Peret day 1) plus epagomenal keys `"e-1"` … `"e-5"`. 27 entries as of 2026-10-25.
- **`LUNAR_FESTIVALS`**: array of festivals tied to lunar phases (new moon, full moon), not civil dates.

Each `Festival` entry has `name`, `description`, optional `icon`, and optional `fonte: FestivalFonte` for a Book of the Dead quote.

```ts
interface FestivalFonte {
  spell: string; // "Capítulo CXXX"
  excerpt: string; // verbatim excerpt in Spanish
  source: string; // edition and papyrus citation
}
```

`HALL_OF_MAATI` (array of 42 `MaatiAssessor` entries) comes from Ch. CXXV, Papiro de Nebseni (BM 9,900). It drives the Hall of Maāti modal in `EgyptianCalendarInfo.tsx`. Minimum font size in that modal: **12px**; never go below `font-size: 0.75rem` (12px) inside it. The 12px minimum applies globally throughout the entire app.

Sources cross-referenced for festival entries:

- S. El-Sabban, _Temple Festival Calendars of Ancient Egypt_ (2000) — primary civil festival reference
- C. J. Bleeker, _Egyptian Festivals_ (1967) — ritual interpretation
- A. von Lieven, _Grundriss des Laufes der Sterne_ (2007) — astronomical calendar
- E. A. Wallis Budge, _The Book of the Dead_ (1898), Theban Recension — `fonte` quotes; papyri Ani (BM 10,470), Nu (BM 10,477), Nebseni (BM 9,900)

Research files live in `docs/research/`:

- `egypt-festivals-review-2026-10-25.md` — consolidated review report
- `extracts/egypt-by-month.md` — unified civil-month reference from all sources
- `extracts/book-of-the-dead/extract.md` — BoD spells cross-referenced to calendar dates

**Rules for editing festival entries:**

1. **`fonte` field is sourced, not invented.** Only add a `FestivalFonte` if Budge's Theban Recension explicitly links the spell to a date or rite. Cite the chapter number and papyrus.
2. **Epagomenal days** (`"e-1"` … `"e-5"`) have their base text from `getEpagomenalDayInfo()` in `egyptianCalendarData.ts`. The `fonte` from `CIVIL_FESTIVALS["e-N"]` is surfaced separately in the epagomenal card in `EgyptianCalendarInfo.tsx` — both paths must be kept consistent.
3. **Do not invent festivals.** Every entry must trace to El-Sabban or Bleeker. Open items are catalogued in the review report.
4. **Key format**: civil keys are `"${monthIndex}-${day}"` with 0-based month (I Akhet = 0 … IV Shomu = 11). Epagomenal keys are `"e-${1..5}"`.

---

## How to run a festival scholarly review

Use this procedure whenever festival data needs a quality pass — for any civilization. It has been run for Rome (2026-10-25), Hellas (2026-10-25), Aegyptus (2026-10-25), and Babylonia (2026-10-25).

### Phase pipeline

Run phases sequentially; each agent's output feeds the next.

**Phase 0 — Read current app data**
Spawn an agent to read the relevant data file(s) and produce a structured list of every festival entry: key, name, description, deity, sources cited (if any). This is the baseline.

**Phase 1 — Source extraction**
For each primary source PDF in `docs/research/` (or user-supplied), spawn one agent per source to extract festival/calendar data month by month. Save output to `docs/research/extracts/<source>/`. Use consistent month headings so Phase 2 can diff them.

**Phase 2 — Month-by-month comparison**
One agent compares the app baseline (Phase 0) against all source extracts (Phase 1) for each month. Output: `docs/research/extracts/review/month-N.md` per month with MATCH / WRONG / MISSING / EXTRA annotation per entry.

**Phase 3 — Consolidated review report**
Aggregate all month files into a single `docs/research/<civ>-festivals-review-<date>.md`. Categorise findings:

- `WRONG_DATE` — attested date differs from app
- `WRONG_DEITY` — wrong deity assigned
- `WRONG_RITUAL` — ritual description contradicts sources
- `INVENTED_AITION` / `INVENTED` — no source supports the claim
- `MISSING` — festival in sources but not in app
- `MINOR` — wording, uncertainty markers, secondary sources

Assign severity: HIGH (factual error), MEDIUM (sourcing issue), MINOR/LOW (wording).

**Phase 4 — Apply corrections**
Apply HIGH and MEDIUM findings first in one pass, then MINOR/LOW in a second pass. For each change, cite the source inline in the data file comment or field. Commit each pass separately.

### Book of the Dead cross-reference (Aegyptus only)

After Phase 4, run a separate agent to read `docs/research/extracts/book-of-the-dead/extract.md` and map each BoD spell to its calendar date. For spells that map unambiguously, add a `fonte: FestivalFonte` to the corresponding `CIVIL_FESTIVALS` or `LUNAR_FESTIVALS` entry. Save the extract file before this step.

### Primary text fonte pass (Babylonia only)

After Phase 4, add `fonte: BabylonianFonte` entries to `dayEvents` in `babylonianLoreData.ts`. Only add a fonte where a verbatim primary-text passage (Akkadian ritual tablet, Sumerian poem, creation epic) is directly linked to the rite of that day. Sources already used: King 1902 (Enūma Eliš), Thureau-Dangin 1921 (Akītu tablets), Rogers 1908 (Descent of Ištar), Jacobsen 1976 (sacred marriage hymns), Abusch 2016 (Maqlu). Future pass: Sachs & Hunger _Astronomical Diaries_ (attested diary entries) for `BabylonianSkyDiary` component.

### Output files to commit

- `docs/research/extracts/<source>/*.md` — raw extracts
- `docs/research/extracts/review/*.md` — month comparisons (optional, useful for audit trail)
- `docs/research/<civ>-festivals-review-<date>.md` — consolidated report
- The corrected data file (`romanYearData.ts`, `atticCalendarData.ts`, `egyptianFestivalsData.ts`, etc.)

---

## Hellenic festival data — sources and quality standards

Festival data for the Hellas civilization lives in `utils/atticCalendarData.ts` (`getAtticFestivalInfo(monthIndex, dayOfMonth)`). Every festival entry has been cross-referenced against three scholarly sources:

- H. W. Parke, _Festivals of the Athenians_ (1977) — primary source
- L. Deubner, _Attische Feste_ (1932) — primary source
- J. D. Mikalson, _The Sacred and Civil Calendar of the Athenian Year_ (1975) — date attestation

Research files live in `docs/research/`:

- `hellenic-festivals-review-2026-10-25.md` — consolidated review report (77 findings, 6 categories)
- `extracts/review/` — per-month comparison files (12 months)
- `extracts/parke/`, `extracts/deubner/`, `extracts/mikalson/` — source extracts

**Rules for editing festival entries:**

1. **`aition` field is sourced, not invented.** Only add an aition if Parke, Deubner, or Mikalson explicitly discusses the myth or founding narrative. If no source gives one, leave the field empty.
2. **Day numbers are often uncertain.** Many festivals have no fixed ancient day within their month. Mark uncertain days as approximate in `festivalDesc`; do not present them as fact.
3. **Deity fields must match sources.** Check which deity is primary per the inscriptional and textual evidence; order matters (primary first).
4. **Do not conflate separate festivals.** E.g. Munichia ≠ Brauronia; Rural Dionysia ≠ City Dionysia phallus-carts.
5. Open items (17 missing festivals, 25 unsourced aitia, 16 minor issues) are catalogued in the review report — tackle them before adding new data in those months.

---

## Roman festival data — sources and quality standards

Roman calendar day data lives in `utils/romanYearData.ts` (`ROMAN_YEAR_DATA`). Keys are `"month-day"` (0-based month). Each entry is a `YearDayEntry`:

```ts
interface YearDayEntry {
  status: string; // "F" | "C" | "N" | "NP" | "EN" | "FP" | "QRCF" | "QRCI" | "COMP"
  statusFull: string; // Latin expansion of status abbreviation
  deity?: string; // primary deity or deities
  deityDesc?: string; // description of the deity's role
  festivalName?: string; // name of the festival if any
  festivalDesc?: string; // description of the festival
}
```

Sources cross-referenced (134 corrections applied 2026-10-25):

- H. H. Scullard, _Festivals and Ceremonies of the Roman Republic_ (1981) — primary reference
- W. W. Fowler, _The Roman Festivals of the Period of the Republic_ (1899) — secondary

A consolidated review was completed 2026-10-25 in two passes (93 HIGH+MEDIUM + 41 MINOR/LOW corrections). No separate review report file was kept; changes are traceable via git log commits 7de5d30 and e64745e.

**Rules for editing entries:**

1. `status` codes follow Mommsen's _Fasti_. Do not invent new codes.
2. `festivalDesc` must be sourced. If Scullard or Fowler gives no description, leave the field empty rather than paraphrasing encyclopaedias.
3. Deity order: primary deity first. Joint cults (e.g. Jupiter Optimus Maximus) are not split.

---

## Babylonian festival data — sources and quality standards

Festival day-event data lives in `utils/babylonianLoreData.ts` as `BABYLONIAN_MONTH_LORE` — an array of 12 `BabylonianLore` entries (one per month). Each month entry has an optional `dayEvents: Record<number, BabylonianDayEvent>` keyed by day number (1–30).

```ts
interface BabylonianFonte {
  title: string; // e.g. "Enūma Eliš · Tablilla IV"
  excerpt: string; // verbatim excerpt in Spanish
  source: string; // edition and line citation
}

interface BabylonianDayEvent {
  shortLabel: string; // 1–3 word label shown in day grid dot tooltip
  description: string; // full ritual description shown in tap panel
  type: 'akitu' | 'procession' | 'mourning' | 'marriage' | 'ritual' | 'festival' | 'astronomy';
  fonte?: BabylonianFonte; // optional primary-text quote panel (collapsible)
}
```

Sources cross-referenced for day events (scholarly review completed 2026-10-25, 8 HIGH + 6 MEDIUM corrections, 7 missing entries added):

- M. E. Cohen, _The Cultic Calendars of the Ancient Near East_. CDL Press, 1993 — primary day-level reference
- M. J. H. Linssen, _The Cults of Uruk and Babylon_. Cuneiform Monographs 25, Brill, 2004 — Hellenistic ritual series
- F. Thureau-Dangin, _Rituels Accadiens_. Ernest Leroux, 1921 — primary Akītu tablet (DT.109, MNB.1848)
- T. Jacobsen, _The Treasures of Darkness_. Yale UP, 1976 — mythological/theological background

Sources used for `fonte` excerpts:

- L. W. King, _The Seven Tablets of Creation_. London, 1902 — Enūma Eliš (Nisannu 4, Kislīmu 4)
- Thureau-Dangin 1921, DT.109+MNB.1848 ll. 414–450 — King's humiliation ritual (Nisannu 5)
- R. W. Rogers, _Religion of Babylonia and Assyria_. Eaton & Mains, 1908 — Descent of Ištar (Duʾūzu 27)
- Jacobsen 1976 — sacred marriage hymn of Inanna (Ulūlu 3)
- T. Abusch, _The Magical Ceremony Maqlû_. SBL Press, 2016 — Maqlu Tablet I (Abu 28)

Research files:

- `docs/research/babylon-festivals-review-2026-10-25.md` — consolidated review report
- `docs/research/extracts/babylon/{cohen,linssen,thureau-dangin,jacobsen}/extract.md` — source extracts

UI features built on this data:

- **DayGrid** in `BabylonianCalendarInfo.tsx`: days with `dayEvent` show a green dot; tap to expand description + optional `BabylonianFontePanel` (collapsible, 𒀭 DINGIR prefix, lapis-blue palette)
- **Próximos Festivales modal**: `getNextBabylonianFestivals(monthIndex, day, count)` in `babylonianLoreData.ts` walks `BABYLONIAN_MONTH_LORE` day by day and returns the next N upcoming events (approximates 30 days/month for distance)

**Rules for editing day events:**

1. **`fonte` is sourced, not invented.** Only add a `BabylonianFonte` if a verbatim cuneiform text passage is directly linked to the rite of that specific day. Cite edition and line numbers.
2. **Uncertain days must be flagged.** Many month-level rites have no attested day number. Mark them as approximate in `description` — do not silently assign a day.
3. **Do not conflate city traditions.** Uruk and Babylon often held parallel rites; check Cohen and Linssen separately. Note the city in `description`.
4. **Minimum font size: 12px** (`font-size: 0.75rem`) throughout the Babylonian page.

---

## Architecture

**Horologium Romanum** is a PWA + Android app that converts modern time into the temporal systems of five ancient civilizations using precise astronomical algorithms. No backend — all computation is client-side.

### Civilization system

The active civilization (`rome` | `hellas` | `aegyptus` | `babylonia` | `zhongguo`) is stored in `CivilizationContext` (`contexts/CivilizationContext.tsx`) and persisted to `localStorage`. It drives three parallel tracks:

- **Time calculation**: `utils/romanTimeUtils.ts`, `utils/hellenicTimeUtils.ts`, `utils/egyptianTimeUtils.ts`, `utils/babylonianCalendarUtils.ts`, `utils/chineseTimeUtils.ts` — each returns a civilization-specific time object. These functions receive `(Date, lat, lng)` and compute temporal hours, calendar date, moon phase, planetary ruler, etc.
- **Clock component**: `RomanClock` for Rome and Hellas; `EgyptianClock` for Aegyptus; `BabylonianClock` for Babylonia; `ChineseClock` for Zhongguo.
- **Calendar info bar**: `RomanCalendarInfo`, `HellenicCalendarInfo`, `EgyptianCalendarInfo`, `BabylonianCalendarInfo` — rendered conditionally in `App.tsx`. Zhongguo has no separate info bar; all content is embedded in `ChineseClock`.
- **UI labels**: All strings are civilization-specific, sourced from `utils/civLabels.ts` via the context.

### Astronomical core

`utils/solar.ts` wraps `astronomy-engine` (sunrise/sunset via `SearchRiseSet`, moon phase via `MoonPhase`, conjunctions via `SearchMoonPhase`, equinoxes/solstices via `Seasons`, twilight crossings via `SearchAltitude`). All `*TimeUtils` files depend on `getSunTimes` and `getMoonPhase` from this module. `getSunTimes(date)` takes the device-local Y/M/D of `date` but places the day window at the observer's mean solar midnight, so a device in a far-away timezone still gets exactly one sunrise and one sunset per day.

`getTwilightTimes(date, lat, lng)` returns `{ civilMorning, nauticalMorning, civilEvening, nauticalEvening }` — the UTC moments when the sun crosses -6° (civil) and -12° (nautical) on a given calendar day. Any field is `null` during polar phenomena (midnight sun / polar night). Results are cached per UTC day × coordinates. Used by `RomanClock` to draw the sky gradient across the full three-band twilight window (-18° → 0°) and to display the crepusculum schedule in the info bar.

`RomanClockProps` includes `locationTimezone: string` (IANA timezone of the selected location). Ortus/Occasus Solis and the time-travel banner both format times in this timezone so values match the observer's local clock regardless of device timezone.

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

- **Data**: `public/assets/roman-map/roads.json` (2.9 MB, 0.95 MB gzip), all 14 769 segments of Itiner-e static version 2024 (de Soto, Pažout, Brughmans et al., _Scientific Data_ 2025; doi:10.5281/zenodo.17122148; **CC BY 4.0**, attribution shown under the map while the layer is on). Generated by `npx tsx scripts/buildRomanRoads.ts <itinere_roads.geojson>`: EPSG:3395 → WGS84, Douglas–Peucker at 0.001°, 1e-4° integer deltas, string table. The script documents every normalisation. Don't hand-edit the JSON.
- **Loading**: `utils/romanRoads.ts` `loadRomanRoads()` fetches it from the same `DATA_BASE`, only while the toggle is on (`localStorage` key `romanMapRoads`, default on). It is precached by the service worker through `includeAssets`, but kept out of `globPatterns` (`globIgnores` in `vite.config.ts`) because it is over Workbox's 2 MiB glob limit.
- **Names**: the dataset's `Itinerary` field is split into three groups. Latin road names (`Via …`, `Strata …`) are the only ones used as map labels. Ancient itineraries (Tabula Peutingeriana, Itinerarium Antonini, Stadiasmus Patarensis…) are listed in the card. Modern names (Watling Street, Fosse Way, Limesweg…) are shown in the card only as _Nomina recentiora_: never as labels and never translated. Builders (`Cons_per_e`, English in the dataset) map to their standard Latin names. Period labels with no ancient form ("Tetrarchy", "Severan"…) are dropped, and only their dates are shown. The segment name (`Tractus`) mixes ancient and modern toponyms as the dataset gives them.
- **Dating**: Itiner-e dates only 477 segments (`Lower/Upper_Date` with error margins, 9999 = unknown). The build adds the start year of `Cons_per_e` (≈ 2 800 more), giving 3 300 dated segments; 11 469 have no date. Errata are fixed in `DATE_FIX` with their source (Via Aemilia 187 BCE, Livy 39.2.10). `roadExistence()` returns `yes`/`no`/`unknown`, with the error margins read as "may have existed".
- **Time-awareness**: live, every road is drawn. When the app is time-travelling (`travelDate` App → ProvinciaInfo → `year` prop), dated roads outside their range are hidden. Undated roads are **drawn faded, not hidden**: the dataset can't say they did not exist, and we don't guess. The road card's _Iter per tempora_ slider sets a map-only year (`cardYear`) that overrides the app date for the roads layer. It resets when the app date changes.
- **Drawing** (`RomanMapCanvas`): roads are grouped into 5° tiles, each road in the tile of its bbox centre. Path2Ds are built lazily per level of detail (`ROAD_LODS`, chosen to stay under ½ px) × tile × style, and cleared when the year changes. Styles: main roads wider; certainty certain > conjectured (lighter) > hypothetical (dotted); undated roads faded while time-travelling; secondary roads fade in with zoom. Road names are set letter by letter along chained segments of the same via (`buildRoadChains`), from zoom 2.5. They are placed after the city names in the same collision grid, in IM Fell English italic at ≥ 12 px. A tap hits a city or creature first, then the nearest road within 10 px.
- **Strings**: all Latin, in `ROMAN_ROAD_LABELS` (`utils/civLabels.ts`).
- **Performance** (Chrome, 6× CPU throttle, dev build): vertical pan median 5.8 ms / max 9.6 ms per frame with roads (1.7 ms without). Warm zoom max 9.2 ms. The first visit to a new level of detail costs one ~60 ms frame while its paths are built.

### Procedural skyline

`utils/egyptianSkylineGenerator.ts` produces the Egyptian skyline SVG paths with a seeded PRNG (obelisks, pylons), drawn by `EgyptianCalendarInfo` over the `EgyptianStarMap` canvas. Rome, Hellas and Babylonia use full scenes built on the hero scene kit instead (see below). `ChineseClock` has its own built-in SVG rendering and does not use a separate skyline generator.

### Hero scene kit (procedural landscapes)

Shared toolkit for the procedural hero scenes of Rome (`RomanScene`), Hellas (`HellenicScene`), Babylonia (`BabylonianScene`) and Zhongguo (`ChineseScene`). Civilization-specific code is only the landscape geometry, the palette (`SceneLight` plus any extra CSS variables) and the composition. Ground fills should reach y ≥ 206: on some phone sizes the heroes show slightly below y 200.

- **`utils/sceneKit.ts`** (geometry only): `SCENE_X0`/`SCENE_X1`/`SCENE_W` (−40…340: the 16:9 heroes show x −30…330 of the 3:2 viewBox, so every full-width layer must cover this span), `seededRandom`, the `Pen` path builder (local units, u right / v up, `flip` mirrors so monuments face the centre; only M/L/C/Z; `gap()` cuts real holes), `buildShape()` + `ShapeDraw`/`ShapeKit` (body, relief, detail, openings, windows, torches), `ridge()`, `tufts()`, the `SceneLight` type and `sceneLightStyle()`.
- **`components/SceneParts.tsx`**: `SceneRoot` (sets the light CSS variables and `scene--lit` / `scene--snow`), `SceneDefs` (ground, torch, aurora-glow gradients), `MonumentShape`, `Birds`, `sceneFlags()` (fog style, veiled sun, birds, splashes), `sceneUid()`.
- **`components/SceneSky.tsx`**: fixed seeded stars with a Milky Way band and the Big Dipper, the hour arc (13 ticks, current hour highlighted), sun and moon; also exported separately (`Stars`, `HourArc`, `Sun`, `Moon`).
- **`components/SceneInstrument.tsx`**: marble plinth with a bronze gnomon (day) or glass clepsydra (night). The vessel coordinates are the ones the water clip paths are built on.
- **`components/SceneWeather.tsx`**: passed to `WeatherSvgEffects` through its `effects` prop (replaces the default clouds / rain / snow / fog / wind; the aurora and its crossfade stay in `WeatherSvgEffects`). Clouds are three depths of 300-wide tiles drawn three times and shifted by one tile per loop. The lightning bolt shares the `lightningFlash` 7 s keyframes with the white flash. `SceneRainSplashes` is drawn by the scene on top of its ground.
- **`components/SceneKit.css`**: every colour derives from `--haze`, `--rim`, `--stone`, `--cloud-light`, `--cloud-shade` (set by `SceneRoot`; CSS variables inherit, so an HTML ancestor can set them for several SVGs) and `--ink`. Prefixes: `sk-` scene kit, `sw-` scene weather. Civ-specific classes go in the civ's own CSS.

### Roman hero scene (Rome only)

`RomanClock` is shared by Rome and Hellas, but for Rome everything inside the 300×200 hero SVG is drawn by `components/RomanScene.tsx`. Don't merge the Rome and Hellas branches.

- **Landscape**: `utils/romanLandscape.ts` `generateRomanLandscape(seed)` (seed = calendar day): two mountain ridges, an aqueduct whose arches are real holes, the monuments of the two hills (each hill gets a different big one: Colosseum, Pantheon or temple; plus arch, column, obelisk, insula, villa, cypresses, stone pines) and foreground trees. x 104–196 stays free for the instrument. Tests: `tests/romanLandscape.test.ts`.
- **Light**: `sceneLight()` in `RomanScene.tsx` picks the palette from the time of day, twilight, weather and the aurora. At night or under the aurora the scene is lit: openings, lit windows and torches glow and flicker.

### Hellenic hero scene (Hellas)

`components/HellenicScene.tsx` draws both Hellenic heroes on the scene kit: the clock (`RomanClock`, Hellas branch, with `instrument` and `SceneWeather` via `effects`) and the info bar (`HellenicCalendarInfo`, `layout="wide"`, no instrument; sun and moon at their real altitude/azimuth via `bodies`, the hoplite via `figures`; one SVG `.hel-scene-svg` with `meet`, so the light variables reach every layer).

- **Landscape**: `utils/hellenicLandscape.ts` `generateHellenicLandscape(seed, layout)` draws Athens from the Pnyx, c. 406 BCE (Erechtheion finished, Long Walls still standing). Fixed: the Acropolis rock with the Kimonian wall, Nike bastion and temple, Propylaia and Pinakotheke, Athena Promachos, the sacred olive, the Erechtheion with the Karyatid porch and the Parthenon; on the south slope the 5th-century earth theatre and the Odeion of Perikles; Lykabettos; the Hephaisteion; the Tholos. Seeded: Hymettos, houses, trees, the Agora stoa (Zeus Eleutherios or Poikile), the foreground olive or pine. Later buildings (Lykourgan stone theatre, Stoa of Attalos) are deliberately absent. In the clock layout x 104–196 stays free.
- **Sources**: cited per shape (Hurwit 1999, Travlos 1971, Camp 2001, Pausanias, Herodotus 8.55, Plutarch _Per._ 13.5, Xenophon _Hell._ 2.2.23); anything uncertain is marked "approximate". The Travlos (Odeion, theatre) and Camp (Panathenaic Way) citations still need page references.
- **Light**: `hellenicSceneLight()` adds `--marble`, `--marble-shade`, `--rock`, `--leaf`, `--earth` and `--tile` to the kit variables (`HellenicScene.css`, prefix `hs-`). Marble is warm white by day and moonlit blue at night; lamps and the Erechtheion glow are lit at night and under the aurora.
- **Tests**: `tests/hellenicLandscape.test.ts`.

### Babylonian hero scene (Babylonia only)

`BabylonianCalendarInfo` draws its 16:9 hero in one SVG (`.bci-scene-svg`, `xMidYMax meet`) with `components/BabylonianScene.tsx`, built on the scene kit; weather is `SceneWeather` via `WeatherSvgEffects`' `effects` prop.

- **View**: Neo-Babylonian Babylon (6th c. BCE) from the north looking south, so west (the Euphrates) is on the right. This matches the Sin mapping (azimuth 180° = centre). Šamaš and Sin are drawn at their real positions (`heroSky()` in `BabylonianCalendarInfo.tsx`).
- **Landscape**: `utils/babylonianLandscape.ts` `generateBabylonianLandscape(seed)` (seed = calendar day). Fixed anchors: Etemenanki (stage dimensions from the Esagila tablet AO 6555, ed. George, _Babylonian Topographical Texts_, 1992), Esagila, the inner (Imgur-Enlil) and outer (Nēmetti-Enlil) walls with the main and front Ishtar Gates (glazed lapis, ochre bulls and mušḫuššu; Koldewey 1913), the Euphrates through gaps in both walls with the bridge, and the Processional Way. Houses, courtyard palms, lit windows and wall torches vary by seed. No Hanging Gardens (no archaeological evidence at Babylon). Approximate reconstructions (wall and gate heights, merlons, Esagila façade, number of animal rows, Etemenanki's buttressing) are marked as such in the code.
- **Hero text**: nothing in front of the far layer may rise into x 70–230 above y 145 (`OVERLAY_BOX`, tested in `tests/babylonianLandscape.test.ts`). The hero carries no glosses.
- **Light**: `babylonianLight()` adds `--earth` (brick), `--glaze` (lapis glazed brick) and `--ochre` (the glazed animals) to the kit variables; `babylonianSkyGradient()` drives the HTML sky. Lapis/indigo dominates; amber is used for firelight, the twilight horizon, golden hour, sunlit brick and the ochre animals. Classes use the `bs-` prefix in `BabylonianScene.css`.

### Zhongguo hero scene (Zhongguo only)

`components/ChineseHero.tsx` draws a 16:9 hero at the top of `ChineseClock`: sky gradient and aurora sky as HTML layers, one positioned SVG `.chinese-hero__svg` with `meet`, a paper vignette, the vermilion seal 長安 and, at night, the current shíchén beside the clepsydra arrow (both HTML, ≥ 12px). `ChineseClock` receives `currentLat`/`currentLng` from `App.tsx`. The SVG content is `components/ChineseScene.tsx` on the scene kit, in a shanshui ink-wash style; weather is `SceneWeather` via `WeatherSvgEffects`' `effects` prop.

- **View**: Tang Chang'an (first half of the 8th c.) from the Leyou plateau looking south (east on the left); sun and moon at their real positions (azimuth 180° = centre).
- **Landscape**: `utils/chineseLandscape.ts` `generateChineseLandscape(seed)` (seed = YYYYMMDD). Fixed: the rammed-earth south wall with the Mingde gate (five passages, dark at night: curfew), the seven-storey Big Wild Goose Pagoda (701–704 rebuilding; Cen Can 752 "七層摩蒼穹") with the Ci'en temple halls, the Qujiang pool, the plateau. Seeded: the Qinling in three ink layers with a main peak, texture strokes and moss dots, ward roofs and trees, willows (Du Fu, 哀江頭), the foreground pine (kept right of the pagoda). x 104–196 stays free. Approximate reconstructions are marked in the code. Tests: `tests/chineseLandscape.test.ts`.
- **Seasons**: `utils/chineseSeasons.ts`, driven by `getChineseCalendarData(date)` (same term as the term card and time travel) and `getSolarLongitudeDeg(date)`. `TERM_DETAILS` gives each of the 24 solar terms one tiny ink detail taken from one of its own 七十二候 pentads (sequence after the 逸周書·時訓解, with 禮記·月令 / 呂氏春秋 as parallels; wording as in `chineseCalendarData.ts`), e.g. 桃始华 peach branch, 虹始见 rainbow, 鹿角解 deer, 菊有黄华 chrysanthemums, 鹊始巢 magpie nest. Each entry has a layer (sky, pool, ground), a time (day, night, any) and `hideIn` weathers, so details never contradict the weather (no rainbow without sun, no swallows in a storm). `seasonBase()` is continuous: willow foliage and leaf colour (bare → light green → full → yellow → bare), grass colour, and paper warmth `cos(λ − 120°)` (warmest at 大暑, coldest at 大寒) tinting paper, air, water and sky. The pool is frozen exactly in 冬至, 小寒 and 大寒 (`POOL_FROZEN_TERMS`, an interpretation of the pentad timing, not a climate source); 立冬 shows a rim of ice, 立春 thaw floes. Details stay out of x 104–196, the pagoda and gate boxes and the seal corner; they are purely visual (no labels). The plant identities of 王瓜 and 荔 are marked uncertain. Tests: `tests/chineseSeasons.test.ts`.
- **Instrument**: `components/ChineseInstrument.tsx`. Day: guibiao, an 8-chi gnomon on a 13-chi scale running north (towards the viewer); the shadow is computed from the sun's real altitude and azimuth and is hidden under overcast skies. Night: a three-tank inflow clepsydra whose arrow rises through twelve shíchén marks from the start of 子 (`getCurrentShichen`, device clock as elsewhere on the page). The multi-tier design's attribution to Lü Cai is unverified; Needham vol. 3 is cited without page numbers.
- **Light**: `chineseLight()` adds `--paper` (unpainted paper/mist), `--wash` (ink), `--lacquer`, `--water`, and the seasonal `--leaf` and `--grass` to the kit variables; `chineseSkyGradient()` drives the HTML sky. Ink on warm paper by day, vermilion paper at golden hour and dusk, indigo ink at night with lit wards and gate torches; snow leaves the peaks as bare paper. Classes use the `cs-` prefix in `ChineseScene.css`.
- **Known gaps**: clouds are still the kit's cumulus (ink-coloured, not brush clouds); the app loads no Chinese webfont (system serif CJK).

### Aurora borealis

Shown when there is no weather data (offline, failed or slow fetch) or when the user turns it on. Two renderers, switched on separately from the menu (`auroraGl`, `auroraSvg` in `CustomWeatherConfig`; `toggleAuroraLayer()` in `utils/customWeather.ts`): the WebGL shader (`utils/auroraGl.ts`, mounted by `components/Aurora.tsx` as a canvas inserted right before the weather SVG, which therefore must be positioned) and the SVG curtains (`components/AuroraSvg.tsx`, also the fallback when WebGL is unavailable).

### Theming

A single dark theme is driven by the `data-civ` HTML attribute (set in `App.tsx`), which selects civilization-specific CSS variable overrides in `index.css`. CSS custom properties on `:root`: `--ink`, `--gold-leaf`, `--gold-dim`, `--parchment`, `--parchment-dark`, `--midnight`, `--roman-red`, `--festival-text`, plus shared vars `--travel-accent` (time-travel amber, the same in every civilization — don't use `--festival-text` for it), `--font-body`, `--shadow-xl`, `--shadow-card`, `--blur-modal`, `--blur-card`, `--modal-max-w`, `--lh-prose`. Each `[data-civ="…"]` block overrides the colour tokens for its palette. Styling is plain CSS — no Tailwind; component-scoped CSS files live alongside each component in `components/`. Fonts: `Cinzel` (headings) and IM Fell English via `var(--font-body)` (body text; canvas code, which can't read CSS variables, names `"IM Fell English", Georgia, serif` directly). IM Fell has a single weight, so its `@font-face` rules cover 100–900: bold text uses the real glyphs instead of a synthesised faux bold.

### Weather

`hooks/useWeather.ts` fetches from Open-Meteo (free, no key required) via `utils/weather.ts`. Results include civilization-specific wind names and descriptions. Live weather is refreshed every 30 minutes. When the user time-travels to a date (via `DateTimePicker` / `CivilCalendarDatePicker`), `App.tsx` passes that date to `useWeather`, and `fetchWeather` pulls the recorded weather for that specific day/hour from the archive API (`archive-api.open-meteo.com`), falling back to the forecast API's `past_days` window for recent dates and to live weather when no historical data exists (e.g. the future or dates before 1940). This drives every weather effect in the app.

### Capacitor (Android)

The Android native shell hides the status bar on startup. `SplashScreen.hide()` is called after the first time calculation resolves. The time ticker fires every 15 seconds (not every second) to reduce CPU usage on mobile.

### PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. Service worker uses `autoUpdate` strategy. Google Fonts are cached for 365 days via Workbox `CacheFirst`.

### Hour panels (PlanetaryPositions, EgyptianHours, BabylonianSkyDiary)

Planetary hours and the planetary week are Greco-Roman (Cassius Dio 37.18–19; Bultrighini & Stern 2021: no planetary week in Egypt or Mesopotamia before the 2nd c. CE). `App.tsx` therefore renders a different hour panel per civilization. **All sources behind these panels — verbatim texts, citations, URLs, open uncertainties and enhancement ideas — are in `docs/research/hours-and-planets-sources.md`. Read it before changing or extending this data.**

- **`components/PlanetaryPositions.tsx`** — Rome, Hellas, Zhongguo. Builds the 24 hours of the current planetary day (sunrise → next sunrise) plus the next day, and lists the current hour and the next three (running on past sunrise into the next day). The current row has a progress bar; the header shows day/night hour length. Parapegma section above it (Rome, Hellas).
  - Rome: `utils/romanHoursData.ts`. `CHRONOGRAPH_HOURS` = the Chronograph of 354 captions (verbatim "… utile est" clause + the omens for births, a runaway, the sick and theft + B/C/N rating, a badge on every row). `CIVIC_DAY_HOURS` = Martial 4.8 (hours I–X, XI–XII Censorinus' _suprema_); `CIVIC_NIGHT_HOURS` = Censorinus 24, mapped approximately onto night hours; `vigiliaOf` = Vegetius 3.8 (four watches of three hours).
  - Hellas: `VALENS` = verbatim excerpts of Vettius Valens I.1 (Kroll 1908, page.line) with Spanish translation; `GREEK_STAR_NAMES` = Φαίνων, Φαέθων… ([Arist.] _De mundo_ 392a).
  - Zhongguo: a note that the 七曜 week came with the 宿曜经 (759).
- **`components/EgyptianHours.tsx`** — Aegyptus. The 12 hour goddesses of the current half: night from the Amduat (Hornung), day from the Book of the Day (Müller-Roth 2008, lower confidence). Data in `utils/egyptianHoursData.ts`; transliterations only where verified.
- **`components/BabylonianSkyDiary.tsx`** — Babylonia. Time since sunset/sunrise in bēru and UŠ, the watch (`getWatch` in `babylonianCalendarUtils.ts`, names after Streck, RlA "Tag"), and the five planets as in the Astronomical Diaries: logogram + Akkadian name, sign (Late Babylonian abbreviation, tropical like the rest of the app), ina NIM / ina ŠÚ, UŠ (station). No Diaries term for retrograde is attested, so it is Spanish only. Planet state comes from `utils/planetSkyState.ts` (ecliptic of date, elongation-based visibility, daily motion).

---

## Egyptian Star Map — Implementation Notes

The sky scene of the Egyptian hero (`EgyptianCalendarInfo.tsx`, 16:9 box under the lotus frieze) is a 360° draggable panorama rendered by `components/EgyptianStarMap.tsx` on a Canvas 2D. `EgyptianClock` does not use it.

### Layering and pointer events

- Stack inside the sky scene: `EgyptianStarMap` (`.egyptian-star-map`, `position: absolute; inset: 0; z-index: 0`, owns the drag) → weather SVG (`.eci-weather-svg`) → skyline SVG (`.eci-skyline-svg`) → title text (`.eci-sky-text`). Every layer above the star map has `pointer-events: none` in `EgyptianCalendarInfo.css`, so drags anywhere in the scene reach the canvas. Anything interactive added on top must opt back in with `pointer-events: auto` (as `.egyptian-star-map__toggle` does).
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
  2. Tašrītu · 8. Araḫsamnu · 9. Kislīmu · 10. Ṭebētu · 11. Šabāṭu · 12. Addaru
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
  shortLabel: string; // 1-3 word label shown in day grid dot tooltip
  description: string; // full ritual description shown in tap panel
  type: 'akitu' | 'procession' | 'mourning' | 'marriage' | 'ritual' | 'festival' | 'astronomy';
}
```

Days with `dayEvents` entries show a **green dot** (top-right of cell) in the DayGrid. Primary source for festivals: Cohen 1993 _Cultic Calendars of the Ancient Near East_ (CDL Press), ANETODAY ritual texts. Month regents follow the cuneiform month-regent lists (IV R 33; Astrolabe B / KAV 218, ed. Horowitz, _The Three Stars Each_, 2014), corroborated by the _Iqqur īpuš_ menology (Labat 1965, no. 105) and Muss-Arnolt 1892 (JBL 11).

### Theme — Lapis Lazuli / Ishtar Gate palette

CSS variables are overridden in `[data-civ="babylonia"]` block in `index.css`:

- `--ink`: `#07101d` (deep lapis night)
- `--gold-leaf`: `#60a5fa` (blue-400, the "primary accent" colour)
- `--gold-dim`: `#93c5fd` (blue-300, secondary)
- `--parchment`: `#e8edf8` (cool linen for readable text)
- `--roman-red`: `#818cf8` (indigo-400, secondary accent)

Babylonian components use `blue-*` / `indigo-*` as the base accent family. Amber/orange is allowed where it fits (firelight, golden-hour light, mud brick, the glazed animals of the Ishtar Gate). Minimum font size: 12px throughout.

### Akkadian text and Spanish glosses

Every Akkadian term or heading on the Babylonian page is shown with its Spanish translation below or beside it, in a smaller, lighter italic (12px minimum). The Akkadian stays the prominent element and is never replaced. UI text is Spanish or Akkadian only, never English, and no font may be under 12px anywhere in the app.

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
- SVG height: `.bci-frieze-svg { height: 3.5rem }` (CSS) / viewBox height 36, `preserveAspectRatio="none"`.

### `DayGrid` interaction model

Mobile-first tap/click (no hover):

- Each day is a `<button>` with `onClick` toggling `selectedDay` state.
- Tapping a selected day deselects it (panel closes).
- Info panel renders below the grid (not a tooltip/overlay) showing special day info + festival description.
- Green dot top-right of cell = has `dayEvent`. Bottom dot = SPECIAL_DAYS (sapatu, quarters, etc.).

---

## Chinese Calendar (Zhongguo) — Implementation Notes

### Time system

- **Shichen** (時辰): The day is divided into 12 double-hours keyed to the Twelve Earthly Branches (地支, _dìzhī_). Each Shichen spans 2 solar hours and is associated with a zodiac animal. `getCurrentShichen(date)` in `utils/chineseTimeUtils.ts` returns the current branch and progress within it.
- **Solar Terms** (二十四节气, _Èrshísì Jiéqì_): 24 points of the ecliptic at 15° intervals, each ~15 days. Each is further divided into 3 pentads (候, _hòu_) of 5 days, each associated with a natural phenomenon. Computed in `utils/chineseCalendarUtils.ts`.
- **Lunisolar calendar**: Month boundaries follow actual lunar conjunctions. `utils/chineseLunisolarUtils.ts` computes the current month, day, and whether the year is intercalary.
- **Sexagenary cycle** (干支, _gānzhī_): 60-year cycle combining 10 Heavenly Stems (天干) and 12 Earthly Branches. Year, month, day, and hour each have their own pillar — together forming the Four Pillars of Destiny (八字, _bāzì_).

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

Chinese components use `red-*` / `rose-*` colour tones for primary accents and `amber-*` / `yellow-*` for secondary. Minimum font size: 12px throughout.

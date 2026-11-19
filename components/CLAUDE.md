# components/CLAUDE.md

Implementation notes for components in this directory. Shared architecture and commands are in the root `CLAUDE.md`; data conventions and scholarly sources are in `utils/CLAUDE.md`.

---

## Hero scene kit (procedural landscapes)

Shared toolkit for the procedural hero scenes of Rome (`RomanScene`), Hellas (`HellenicScene`), Babylonia (`BabylonianScene`) and Zhongguo (`ChineseScene`). Civilization-specific code is only the landscape geometry, the palette (`SceneLight` plus any extra CSS variables) and the composition. Ground fills should reach y ≥ 206: on some phone sizes the heroes show slightly below y 200.

- **`utils/sceneKit.ts`** (geometry only): `SCENE_X0`/`SCENE_X1`/`SCENE_W` (−40…340: the 16:9 heroes show x −30…330 of the 3:2 viewBox, so every full-width layer must cover this span), `seededRandom`, the `Pen` path builder (local units, u right / v up, `flip` mirrors so monuments face the centre; only M/L/C/Z; `gap()` cuts real holes), `buildShape()` + `ShapeDraw`/`ShapeKit` (body, relief, detail, openings, windows, torches), `ridge()`, `tufts()`, the `SceneLight` type and `sceneLightStyle()`.
- **`SceneParts.tsx`**: `SceneRoot` (sets the light CSS variables and `scene--lit` / `scene--snow`), `SceneDefs` (ground, torch, aurora-glow gradients), `MonumentShape`, `Birds`, `sceneFlags()` (fog style, veiled sun, birds, splashes), `sceneUid()`.
- **`SceneSky.tsx`**: fixed seeded stars with a Milky Way band and the Big Dipper, the hour arc (13 ticks, current hour highlighted), sun and moon; also exported separately (`Stars`, `HourArc`, `Sun`, `Moon`).
- **`SceneInstrument.tsx`**: marble plinth with a bronze gnomon (day) or glass clepsydra (night). The vessel coordinates are the ones the water clip paths are built on.
- **`SceneWeather.tsx`**: passed to `WeatherSvgEffects` through its `effects` prop (replaces the default clouds / rain / snow / fog / wind; the aurora and its crossfade stay in `WeatherSvgEffects`). Clouds are three depths of 300-wide tiles drawn three times and shifted by one tile per loop. The lightning bolt shares the `lightningFlash` 7 s keyframes with the white flash. `SceneRainSplashes` is drawn by the scene on top of its ground.
- **`SceneKit.css`**: every colour derives from `--haze`, `--rim`, `--stone`, `--cloud-light`, `--cloud-shade` (set by `SceneRoot`; CSS variables inherit, so an HTML ancestor can set them for several SVGs) and `--ink`. Prefixes: `sk-` scene kit, `sw-` scene weather. Civ-specific classes go in the civ's own CSS.

### Aurora borealis

Shown when there is no weather data (offline, failed or slow fetch) or when the user turns it on. Two renderers, switched on separately from the menu (`auroraGl`, `auroraSvg` in `CustomWeatherConfig`; `toggleAuroraLayer()` in `utils/customWeather.ts`): the WebGL shader (`utils/auroraGl.ts`, mounted by `Aurora.tsx` as a canvas inserted right before the weather SVG, which therefore must be positioned) and the SVG curtains (`AuroraSvg.tsx`, also the fallback when WebGL is unavailable).

### Procedural skyline (Aegyptus)

`utils/egyptianSkylineGenerator.ts` produces the Egyptian skyline SVG paths with a seeded PRNG (obelisks, pylons), drawn by `EgyptianCalendarInfo` over the `EgyptianStarMap` canvas. Rome, Hellas and Babylonia use full scenes built on the hero scene kit instead. `ChineseClock` has its own built-in SVG rendering and does not use a separate skyline generator.

---

## Roman hero scene

`RomanClock` is shared by Rome and Hellas, but for Rome everything inside the 300×200 hero SVG is drawn by `RomanScene.tsx`. Don't merge the Rome and Hellas branches. The Rome hero also supports a toggle between the procedural scene and `RomanClassicScene.tsx` (a hand-drawn static alternative).

- **Landscape**: `utils/romanLandscape.ts` `generateRomanLandscape(seed)` (seed = calendar day): two mountain ridges, an aqueduct whose arches are real holes, the monuments of the two hills (each hill gets a different big one: Colosseum, Pantheon or temple; plus arch, column, obelisk, insula, villa, cypresses, stone pines) and foreground trees. x 104–196 stays free for the instrument. Tests: `tests/romanLandscape.test.ts`.
- **Light**: `sceneLight()` in `RomanScene.tsx` picks the palette from the time of day, twilight, weather and the aurora. At night or under the aurora the scene is lit: openings, lit windows and torches glow and flicker.

---

## Hellenic hero scene

`HellenicScene.tsx` draws both Hellenic heroes on the scene kit: the clock (`RomanClock`, Hellas branch, with `instrument` and `SceneWeather` via `effects`) and the info bar (`HellenicCalendarInfo`, `layout="wide"`, no instrument; sun and moon at their real altitude/azimuth via `bodies`, the hoplite via `figures`; one SVG `.hel-scene-svg` with `meet`, so the light variables reach every layer).

- **Landscape**: `utils/hellenicLandscape.ts` `generateHellenicLandscape(seed, layout)` draws Athens from the Pnyx, c. 406 BCE (Erechtheion finished, Long Walls still standing). Fixed: the Acropolis rock with the Kimonian wall, Nike bastion and temple, Propylaia and Pinakotheke, Athena Promachos, the sacred olive, the Erechtheion with the Karyatid porch and the Parthenon; on the south slope the 5th-century earth theatre and the Odeion of Perikles; Lykabettos; the Hephaisteion; the Tholos. Seeded: Hymettos, houses, trees, the Agora stoa (Zeus Eleutherios or Poikile), the foreground olive or pine. Later buildings (Lykourgan stone theatre, Stoa of Attalos) are deliberately absent. In the clock layout x 104–196 stays free.
- **Sources**: cited per shape (Hurwit 1999, Travlos 1971, Camp 2001, Pausanias, Herodotus 8.55, Plutarch _Per._ 13.5, Xenophon _Hell._ 2.2.23); anything uncertain is marked "approximate". The Travlos (Odeion, theatre) and Camp (Panathenaic Way) citations still need page references.
- **Light**: `hellenicSceneLight()` adds `--marble`, `--marble-shade`, `--rock`, `--leaf`, `--earth` and `--tile` to the kit variables (`HellenicScene.css`, prefix `hs-`). Marble is warm white by day and moonlit blue at night; lamps and the Erechtheion glow are lit at night and under the aurora.
- **Tests**: `tests/hellenicLandscape.test.ts`.

---

## Babylonian hero scene

`BabylonianCalendarInfo` draws its 16:9 hero in one SVG (`.bci-scene-svg`, `xMidYMax meet`) with `BabylonianScene.tsx`, built on the scene kit; weather is `SceneWeather` via `WeatherSvgEffects`' `effects` prop.

- **View**: Neo-Babylonian Babylon (6th c. BCE) from the north looking south, so west (the Euphrates) is on the right. This matches the Sin mapping (azimuth 180° = centre). Šamaš and Sin are drawn at their real positions (`heroSky()` in `BabylonianCalendarInfo.tsx`).
- **Landscape**: `utils/babylonianLandscape.ts` `generateBabylonianLandscape(seed)` (seed = calendar day). Fixed anchors: Etemenanki (stage dimensions from the Esagila tablet AO 6555, ed. George, _Babylonian Topographical Texts_, 1992), Esagila, the inner (Imgur-Enlil) and outer (Nēmetti-Enlil) walls with the main and front Ishtar Gates (glazed lapis, ochre bulls and mušḫuššu; Koldewey 1913), the Euphrates through gaps in both walls with the bridge, and the Processional Way. Houses, courtyard palms, lit windows and wall torches vary by seed. No Hanging Gardens (no archaeological evidence at Babylon). Approximate reconstructions (wall and gate heights, merlons, Esagila façade, number of animal rows, Etemenanki's buttressing) are marked as such in the code.
- **Hero text**: nothing in front of the far layer may rise into x 70–230 above y 145 (`OVERLAY_BOX`, tested in `tests/babylonianLandscape.test.ts`). The hero carries no glosses.
- **Light**: `babylonianLight()` adds `--earth` (brick), `--glaze` (lapis glazed brick) and `--ochre` (the glazed animals) to the kit variables; `babylonianSkyGradient()` drives the HTML sky. Lapis/indigo dominates; amber is used for firelight, the twilight horizon, golden hour, sunlit brick and the ochre animals. Classes use the `bs-` prefix in `BabylonianScene.css`.

### Babylonian theme and UI conventions

CSS variables are overridden in `[data-civ="babylonia"]` block in `index.css`: `--ink` `#07101d` · `--gold-leaf` `#60a5fa` (blue-400) · `--gold-dim` `#93c5fd` (blue-300) · `--parchment` `#e8edf8` · `--roman-red` `#818cf8` (indigo-400). Babylonian components use `blue-*` / `indigo-*` as the base accent family. Amber/orange is allowed where it fits (firelight, mud brick, the glazed animals).

### Akkadian text and Spanish glosses

Every Akkadian term or heading on the Babylonian page is shown with its Spanish translation below or beside it, in a smaller, lighter italic (12px minimum). The Akkadian stays the prominent element and is never replaced. UI text is Spanish or Akkadian only, never English.

- **Sources**: glosses are quoted from Spanish text already in the repo (`MONTH_REGENT_DESCS`, the month descriptions, `SPECIAL_DAYS`), or derived from mappings the code already makes. Do not invent translations. If a term has no source, leave it unglossed and flag it.
- **Hero exception**: the 16:9 hero carries no glosses. Its month, hour, ruler and watch are glossed in the cards below it.
- **Data**: `SPECIAL_DAYS` in `BabylonianCalendarInfo.tsx` (`label` = Akkadian, `es` = gloss); `BabylonianLore` (`monthGloss`, `festivalDeityGloss?`); `BabylonianDate` (`planetaryRulerEs`, `hourNameEs`, `moonPhaseNameEs`); `BABYLONIAN_ZODIAC_ES` in `types/babylonia.ts`.
- **Shared components**: on the Babylonian page, Latin headings are replaced by Akkadian + Spanish pairs via `BABYLONIAN_UI_TERMS` in `utils/civLabels.ts`, rendered through `GlossedTerm.tsx` (Akkadian 14px, gloss 12px).
- **Day 7** is `Sebūtu` ("seventh day"). **Day 21** is `Ūmu lemnu` (UD.ḪUL.GÁL, "evil day", glossed "Día funesto") per Livingstone, CUSAS 25, 2013.

### `CuneiformBorder` SVG

Replicates the actual **Ishtar Gate upper frieze** (Pergamon Museum, Berlin):

- **Pattern tile**: 50×36 user units, repeating via `<pattern>`.
- **Palmette** (cream fan flower, 7 radiating ribs + arc): centered at x=25, amber base cup at y≈26.
- **Teal S-scroll volutes**: flanking the palmette at x≈2 and x≈48 (outer amber beads at tile edges for near-continuous tiling), inner cream dot at tip.
- **Amber brick strips**: top (y=0–4) and bottom (y=32–36) with mortar joint dividers every 12.5 units.
- Colors: `#060e22` cobalt ground · `rgba(210,150,40)` amber · `rgba(238,228,200)` cream · `rgba(20,190,215)` turquoise.
- SVG height: `.bci-frieze-svg { height: 3.5rem }` / viewBox height 36, `preserveAspectRatio="none"`.

### `DayGrid` interaction model

Mobile-first tap/click (no hover):

- Each day is a `<button>` with `onClick` toggling `selectedDay` state.
- Tapping a selected day deselects it (panel closes).
- Info panel renders below the grid (not a tooltip/overlay) showing special day info + festival description.
- Green dot top-right of cell = has `dayEvent`. Bottom dot = SPECIAL_DAYS (sapatu, quarters, etc.).

---

## Zhongguo hero scene

`ChineseHero.tsx` draws a 16:9 hero at the top of `ChineseClock`: sky gradient and aurora sky as HTML layers, one positioned SVG `.chinese-hero__svg` with `meet`, a paper vignette, the vermilion seal 長安 and, at night, the current shíchén beside the clepsydra arrow (both HTML, ≥ 12px). `ChineseClock` receives `currentLat`/`currentLng` from `App.tsx`. The SVG content is `ChineseScene.tsx` on the scene kit, in a shanshui ink-wash style; weather is `SceneWeather` via `WeatherSvgEffects`' `effects` prop.

- **View**: Tang Chang'an (first half of the 8th c.) from the Leyou plateau looking south (east on the left); sun and moon at their real positions (azimuth 180° = centre).
- **Landscape**: `utils/chineseLandscape.ts` `generateChineseLandscape(seed)` (seed = YYYYMMDD). Fixed: the rammed-earth south wall with the Mingde gate (five passages, dark at night: curfew), the seven-storey Big Wild Goose Pagoda (701–704 rebuilding; Cen Can 752 "七層摩蒼穹") with the Ci'en temple halls, the Qujiang pool, the plateau. Seeded: the Qinling in three ink layers with a main peak, texture strokes and moss dots, ward roofs and trees, willows (Du Fu, 哀江頭), the foreground pine (kept right of the pagoda). x 104–196 stays free. Approximate reconstructions are marked in the code. Tests: `tests/chineseLandscape.test.ts`.
- **Seasons (72 pentads)**: `utils/chineseSeasons.ts`, driven by `getChineseCalendarData(date)` and `getSolarLongitudeDeg(date)`. `PENTAD_DETAILS` has one entry per pentad (72; tested: three per term, in order). Each entry holds the pentad's canonical name (simplified), tone-marked pinyin, the Spanish caption, and the drawing spec: layer (sky, pool, ground), time (day, night, any), `hideIn` weathers, `replacesBirds`, and a `draw()`. The sequence follows 逸周書·時訓解, with 禮記·月令 / 呂氏春秋 as parallels. Transformation pentads are drawn as they would be seen; sound-only pentads draw the creature. Details never contradict the weather or the hour (no rainbow without sun, no birds in a storm, fireflies only at night), stay out of x 104–196, the pagoda and gate boxes and the seal corner, and every detail class must have a rule in `ChineseScene.css` (tested). Creature strokes carry an `anchor` (feet / perch / water line) and are scaled about it by `DetailContext.creatureScale` via `creatureScaleFor()` (1 at ≥ 560 px; up to 1.7 at ≤ 360 px); landscape-wide strokes never change size. `seasonBase()` is continuous: willow foliage, leaf colour, grass colour, paper warmth `cos(λ − 120°)`. Pool is frozen in 冬至, 小寒, 大寒; 立冬 shows rim of ice; 立春 shows thaw floes. Tests: `tests/chineseSeasons.test.ts`.
- **Instrument**: `ChineseInstrument.tsx`. Day: guibiao, an 8-chi gnomon on a 13-chi scale; shadow computed from real sun altitude/azimuth, hidden under overcast. Night: three-tank inflow clepsydra whose arrow rises through 12 shíchén marks from the start of 子.
- **Light**: `chineseLight()` adds `--paper`, `--wash` (ink), `--lacquer`, `--water`, seasonal `--leaf` and `--grass`; `chineseSkyGradient()` drives the HTML sky. Classes use `cs-` prefix in `ChineseScene.css`.
- **Known gaps**: clouds are still the kit's cumulus (ink-coloured, not brush clouds); the app loads no Chinese webfont (system serif CJK).

### Chinese theme

CSS variables in `[data-civ="zhongguo"]`: `--ink` `#1a1410` · `--gold-leaf` `#e11d48` (rose-600) · `--gold-dim` `#be123c` (rose-700) · `--parchment` `#fef3c7` (amber-50) · `--roman-red` `#e11d48`. Chinese components use `red-*` / `rose-*` for primary accents and `amber-*` / `yellow-*` for secondary.

### Chinese key components

- `ChineseClock` — main container; renders the animal clock face, solar term indicator, and sub-panels.
- `ChineseAnimalClock` — SVG clock face with the 12 zodiac animals arranged as hour sectors.
- `ChineseDatePillars` — Four Pillars (bāzì) display.
- `ChineseSolarTermsModal` — full 24-term wheel with pentad details.
- `ChineseYearCycle` / `ChineseYearWheel` — 60-year sexagenary cycle visualization.
- `ChineseWeatherOracle` — weather framed in traditional Chinese cosmology.
- `SexagenaryCycleCard` — compact card showing the current year's stem-branch pair.

---

## Egyptian Star Map

The sky scene of the Egyptian hero (`EgyptianCalendarInfo.tsx`, 16:9 box under the lotus frieze) is a 360° draggable panorama rendered by `EgyptianStarMap.tsx` on a Canvas 2D. `EgyptianClock` does not use it.

### Layering and pointer events

- Stack inside the sky scene: `EgyptianStarMap` (`.egyptian-star-map`, `position: absolute; inset: 0; z-index: 0`, owns the drag) → weather SVG (`.eci-weather-svg`) → skyline SVG (`.eci-skyline-svg`) → title text (`.eci-sky-text`). Every layer above the star map has `pointer-events: none` in `EgyptianCalendarInfo.css`. Anything interactive added on top must opt back in with `pointer-events: auto`.
- The canvas uses `touch-action: pan-y`: horizontal drags rotate the sky, vertical swipes still scroll the page. Do not change it to `none`.
- The `horizon={0.9}` prop puts altitude 0° on the skyline's ground line (y=180 of its 300×200 viewBox). The toggle calls `stopPropagation` because the hero wrapper has an `onClick`.

### Projection

- x = azimuth, 6 px/° (2160px panorama, wraps), centred on south (180°) on load. y = altitude from the horizon line up to `ALT_MAX` = 72°.
- The drag offset is kept in a ref (not state) and redraws are coalesced with `requestAnimationFrame`; there is a short fling inertia. Nothing is drawn while idle.
- The unmount cleanup resets `frameRef` to `null`. React StrictMode re-runs effects, and a stale frame id would make `scheduleDraw` skip every future draw (blank canvas).

### Data (`utils/egyptianSkyMap.ts`)

- `computeSky(date, lat, lng)` is memoised per minute. Returns apparent alt/az for the Sun, the Moon (+ `getMoonPhase`), Sopdet/Sirius (`Body.Star1`) and Algol (`Body.Star2`, + `getAlgolPhase().isEclipsed`), plus the 5 planets. Also returns Sah (Orion, 7 stars) and Meskhetyu (Big Dipper, 7 stars) with their line pairs, and the Milky Way (galactic plane b=0, sampled every 3° of l, weighted toward the galactic centre).
- Fixed stars go through `Rotation_EQJ_HOR` + `HorizonFromVector`: J2000 in, precession/nutation/refraction handled. Don't pass J2000 RA/Dec straight to `Horizon()`: it expects equator-of-date coordinates, which puts stars about 0.3° off.
- `DefineStar` slots follow `egyptianAstronomy.ts`: Star1 = Sirius, Star2 = Algol.
- `brightStarCatalog.ts` is a flat `[raDeg, decDeg, mag, …]` array, **sorted brightest first** (the draw loop `break`s at the magnitude limit). Loaded on mount via dynamic `import()` (~20 KB gzip).
- Dev aid: `?mockplanets` replaces real planet alt/az with fixed on-screen values (`MOCK_PLANET_SKY`) so every pictogram can be inspected at any time of day.

### Modes and day/night

- Curated mode (default): draws catalogue to mag 4.5 as backdrop, then Egyptian objects with labels (Sopdet, Ojo de Horus, Sah, Meskhetyu, Iah, Ra, the five planets). Each planet has a distinct pictogram via `drawPlanet()` — Sebegu (Mercury), Seba-dja (Venus), Hor-desher (Mars), Hor-tash-tawy (Jupiter), Hor-ka-pet (Saturn) — using attested Egyptian planet names from astronomical ceilings (e.g. the Ramesseum).
- Full mode: all 2851 stars at full opacity.
- `dayFactor` (0 night → 1 day) blends linearly within ±30 min of sunrise/sunset. Stars and Milky Way fade out by day; a dark scrim keeps hero text readable.

### Performance

About 1 ms JS per frame at desktop speed, ≤ 3 ms at 6× CPU throttle in full mode. If a low-end Android device stutters, cap the canvas DPR at 2 or cache the Milky Way band in an offscreen canvas.

---

## Hour panels

Planetary hours and the planetary week are Greco-Roman (Cassius Dio 37.18–19; Bultrighini & Stern 2021: no planetary week in Egypt or Mesopotamia before the 2nd c. CE). `App.tsx` therefore renders a different hour panel per civilization. **All sources — verbatim texts, citations, URLs, open uncertainties and enhancement ideas — are in `docs/research/hours-and-planets-sources.md`. Read it before changing or extending this data.**

- **`PlanetaryPositions.tsx`** — Rome, Hellas, Zhongguo. Builds the 24 hours of the current planetary day (sunrise → next sunrise) plus the next day, and lists the current hour and the next three. The current row has a progress bar; the header shows day/night hour length. Parapegma section above it (Rome, Hellas).
  - Rome: `utils/romanHoursData.ts`. `CHRONOGRAPH_HOURS` = Chronograph of 354 captions (verbatim "… utile est" clause + omens + B/C/N rating). `CIVIC_DAY_HOURS` = Martial 4.8; `CIVIC_NIGHT_HOURS` = Censorinus 24; `vigiliaOf` = Vegetius 3.8.
  - Hellas: `VALENS` = verbatim excerpts of Vettius Valens I.1 (Kroll 1908) with Spanish translation; `GREEK_STAR_NAMES` = ([Arist.] _De mundo_ 392a).
  - Zhongguo: a note that the 七曜 week came with the 宿曜经 (759).
- **`EgyptianHours.tsx`** — Aegyptus. The 12 hour goddesses of the current half: night from the Amduat (Hornung), day from the Book of the Day (Müller-Roth 2008, lower confidence). Data in `utils/egyptianHoursData.ts`; transliterations only where verified.
- **`BabylonianSkyDiary.tsx`** — Babylonia. Time since sunset/sunrise in bēru and UŠ, the watch (`getWatch` in `babylonianCalendarUtils.ts`, names after Streck, RlA "Tag"), and the five planets as in the Astronomical Diaries: logogram + Akkadian name, sign, ina NIM / ina ŠÚ, UŠ (station). No Diaries term for retrograde is attested, so it is Spanish only. Planet state comes from `utils/planetSkyState.ts`.

# Roman Festivals Review — 2026-10-25
*Sources: Scullard (1981), Fowler (1899)*
*Target: utils/romanYearData.ts*

---

## Executive Summary

| Category | Jan–Apr | May–Aug | Sep–Dec | **Total** |
|---|---|---|---|---|
| WRONG_DATE | 0 | 2 | 3 | **5** |
| WRONG_DEITY | 11 | 5 | 12 | **28** |
| WRONG_STATUS | 6 | 17 | 7 | **30** |
| WRONG_RITUAL | 8 | 14 | 8 | **30** |
| MISSING_FESTIVAL | 7 | 21 | 12 | **40** |
| INVENTED_AITION | 1 | 1 | 1 | **3** |
| MINOR | 11 | 12 | 7 | **30** |
| **TOTAL** | **44** | **72** | **50** | **166** |

**Priority breakdown (WRONG_* findings only):**
- HIGH: 55 (all 5 WRONG_DATE + 20 WRONG_STATUS + 17 WRONG_DEITY + 13 WRONG_RITUAL)
- MEDIUM: 38 (10 WRONG_STATUS + 11 WRONG_DEITY + 17 WRONG_RITUAL)
- LOW: 0

---

## Top Urgent Fixes

Grouped by category, HIGH priority WRONG_* only. These require immediate code changes.

### WRONG_STATUS (HIGH)

- `"1-1"` → status `'NP'` should be `'N'` — Scullard p.71; Fowler p.302
- `"1-21"` → status `'NP'` should be `'F'` — Scullard p.74–75; Fowler p.306–310
- `"3-4"` → status `'NP'` should be `'C'` — Scullard p.97; Fowler p.69
- `"4-1"` → status `'NP'` should be `'F'` — Scullard p.116; Fowler p.101
- `"4-9"` → status `'NP'` should be `'N'` — Scullard p.118; Fowler p.107
- `"4-11"` → status `'NP'` should be `'N'` — Scullard p.118; Fowler p.107
- `"4-13"` → status `'NP'` should be `'N'` — Scullard p.118; Fowler p.107
- `"5-1"` → status `'NP'` should be `'N'` — Scullard p.127; Fowler p.129
- `"5-5"` → status `'F'` should be `'N'` — Scullard pp.147–148; Fowler p.135
- `"5-9"` → status `'NP'` should be `'N'` — Scullard pp.149–150; Fowler pp.146–154
- `"5-11"` → status `'NP'` should be `'N'` — Scullard pp.150–152; Fowler pp.154–157
- `"6-7"` → status `'NP'` should be `'N'` — Scullard p.161; Fowler p.176
- `"6-13"` → status `'NP'` should be `'C'` — Scullard p.164
- `"7-1"` → status `'NP'` should be `'F'` — Scullard pp.169–170
- `"7-9"` → status `'NP'` should be `'C'` — Scullard p.171; Fowler pp.191–193
- `"7-19"` → status `'NP'` should be `'F'` — Scullard p.177; Fowler pp.204–206
- `"7-21"` → status `'F'` should be `'NP'` — Scullard pp.177–178; Fowler pp.206–209
- `"7-28"` → status `'NP'` should be `'C'` — Scullard p.182
- `"10-1"` → status `'NP'` should be `'F'` — Scullard p.196
- `"10-8"` → status `'NP'` should be `'C'` — Scullard p.197

### WRONG_DEITY (HIGH)

- `"0-1"` → deity `"Jano / Juno"` should be `"Júpiter Óptimo Máximo"` — Scullard p.52–55; Fowler p.278–279
- `"0-24"/"0-25"/"0-26"` → deity `"Ceres y Tellus"` (all three) should be Tellus alone (day 1); Ceres alone (day 2, ~7 days later); three consecutive days is wrong — Scullard p.68–69; Fowler p.294–296
- `"1-15"` → deity `"Fauno / Lupercus"` should be `"Fauno / Inuus (incierto)"` — Scullard p.78; Fowler p.310–321
- `"2-19"` → deity `"Minerva"` should be `"Marte / Minerva"` — Scullard p.93–95; Fowler p.57–62
- `"3-1"` → deity `"Venus Verticordia"` should be `"Venus Verticordia / Fortuna Virilis"` — Scullard p.96–97; Fowler p.67–69
- `"3-19"` → deity `"Ceres"` should be `"Ceres, Liber, Libera"` — Scullard p.102; Fowler p.72
- `"3-23"` → deity `"Venus / Júpiter"` should be `"Júpiter / Venus Erucina"` — Scullard p.106; Fowler p.85
- `"5-7"` → deity `"Tiberinus"` should be `"Vulcanus"` — Scullard p.148
- `"7-1"` → deity `"Spes / Marte"` should be `"Spes / Victoria"` — Scullard pp.169–170
- `"8-13"` → deity `"Júpiter"` should be `"Júpiter; Juno; Minerva"` (full Capitoline Triad) — Scullard p.186–187; Fowler pp.217–220
- `"8-14"` → deity `"Marte / Júpiter"` should be `"Ninguna"` — Scullard p.188; Fowler pp.215–216
- `"9-1"` → deity `"Fides"` should be `"Fides / Jano Curiacio / Juno Sororia"` — Scullard p.190; Fowler pp.238–239
- `"9-7"` → deity `"Júpiter Fulgur / Juno"` should be `"Júpiter Fulgur / Juno Curitis"` — Scullard p.191; Fowler p.239
- `"9-9"` → deity `"Genius Publicus"` should be `"Genius Publicus / Fausta Felicitas / Venus Victrix"` — Scullard p.191
- `"10-1"` → deity `"Juno"` should be `"Victoria"` — Scullard p.196
- `"10-8"` → deity `"Manes"` should be `"Divinidades ctónicas"` — Scullard p.197
- `"11-13"` → deity `"Tellus"` should be `"Tellus / Ceres"`; festivalName `"Lectisternium a Ceres"` misrepresents Tellus as secondary — Scullard pp.204–205

### WRONG_RITUAL (HIGH)

- `"0-24"/"0-25"/"0-26"` → festivalDesc presents three consecutive Sementivae days; correct structure is two non-consecutive days, seven days apart — Scullard p.68–69; Fowler p.294–296
- `"1-21"` → festivalDesc includes "Día nefasto: toda actividad pública estaba prohibida"; Feralia is status F (dies fastus); legal business permitted — Scullard p.74–75; Fowler p.306–310
- `"2-17"` → festivalDesc describes toga virilis ceremony as primary; liba-selling by old women and Liber/Libera cult is primary — Scullard p.91–93; Fowler p.54–57
- `"3-1"` → festivalDesc attributes statue bath to Venus Verticordia; bathing rite belongs to Fortuna Virilis; two distinct cults conflated — Scullard p.96; Fowler p.68
- `"3-25"` → festivalDesc says "un animal de pelaje rojo"; correct victims are a dog and a sheep (two victims) — Scullard p.131; Fowler p.88
- `"7-13"` → festivalName `"Nemoralia"` should be `"Dianae in Aventino"`; the fasti entry is the Aventine temple, not Nemi — Scullard pp.173–175; Fowler pp.198–202
- `"8-14"` → festivalDesc says "purificación"; Equorum Probatio was review/inspection only, no purification rite — Scullard p.188; Fowler pp.215–216
- `"9-15"` → festivalDesc says "purificado y sacrificado"; horse was killed with a spear only, no purification — Scullard p.193–195; Fowler pp.241–250
- `"10-1"` → festivalDesc says "Conclusión de los juegos de Sila. Honores habituales de las Calendas."; should describe concluding Circenses of Ludi Victoriae Sullanae — Scullard p.196
- `"10-8"` → festivalDesc says "Segunda apertura"; this is the third and final opening (sequence: 24 Aug → 5 Oct → 8 Nov) — Scullard p.197
- `"11-3"` → festivalDesc says "el vino estaba terminantemente prohibido"; wine was the central offering, renamed 'milk' by ritual convention — Scullard pp.199–201; Fowler p.256
- `"11-15"` → festivalDesc says "burros y mulas eran coronados" and "Se destapaba su altar del Circo Máximo"; horses (equi) and mules, and altar-uncovering belongs to August Consualia — Scullard p.205; Fowler p.268
- `"11-23"` → festivalDesc says "Conclusión sombría de las Saturnales"; Larentalia is independent parentatio at tomb of Acca Larentia, unconnected to Saturnalia — Scullard pp.211–212; Fowler pp.275–276

### WRONG_DATE (all HIGH)

- `"6-24"` → Furrinalia listed on July 24; correct date is July 25; move festivalName/deity/festivalDesc to `"6-25"`, clear `"6-24"` — Scullard p.169; Fowler p.187
- `"7-11"` → Hercules/Ara Maxima listed on Aug 11; correct date is Aug 12; move to `"7-12"`, clear `"7-11"` — Scullard pp.171–173; Fowler pp.193–197
- `"8-4"` → Ludi Romani "Comienzo" listed on Sep 4; Republican attested start is Sep 5; fix festivalDesc of `"8-4"` — Scullard p.183–186; Fowler p.215
- `"10-3"` → Ludi Plebeii start listed Nov 3; correct is Nov 4 (PR. NON. NOV.); `"10-3"` should have no festivalName — Scullard pp.196–197; Fowler p.252
- `"10-15"` → Feronia placed Nov 15; "Feroniae in Campo" is unambiguously under Nov 13 (Ides); move to `"10-13"` — Scullard pp.197–198; Fowler p.252

---

## Month-by-Month Findings

### Ianuarius

**["0-1"] WRONG_DEITY HIGH**
Field `deity`: current `"Jano / Juno"` → correct `"Júpiter Óptimo Máximo"`
Source: Scullard p.52–55; Fowler p.278–279

**["0-3"/"0-4"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: Two consecutive Compitalia days → Single day (feriae conceptivae)
Source: Scullard p.59–60; Fowler p.279–281

**["0-11"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Carmenta / Juturna"` combined → `"Carmenta"` (Juturna structurally distinct)
Source: Scullard p.62–65; Fowler p.290–293

**["0-24"/"0-25"/"0-26"] WRONG_RITUAL HIGH**
Field `festivalDesc`: Three consecutive Sementivae days presented → Two non-consecutive days, seven days apart
Source: Scullard p.68–69; Fowler p.294–296

**["0-24"/"0-25"/"0-26"] WRONG_DEITY HIGH**
Field `deity`: current `"Ceres y Tellus"` jointly on all three days → Tellus alone (day 1); Ceres alone (day 2, ~7 days later)
Source: Scullard p.68–69; Fowler p.294–296

### Februarius

**["1-1"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.71; Fowler p.302

**["1-15"] WRONG_DEITY HIGH**
Field `deity`: current `"Fauno / Lupercus"` → `"Fauno / Inuus (incierto)"`
Source: Scullard p.78; Fowler p.310–321

**["1-17"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Quirino / Fornax"` → `"Quirino"` (Fornax is scholastic invention)
Source: Scullard p.73–74; Fowler p.302–306

**["1-21"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'F'`
Source: Scullard p.74–75; Fowler p.306–310

**["1-21"] WRONG_RITUAL HIGH**
Field `festivalDesc`: contains "Día nefasto: toda actividad pública estaba prohibida" → Feralia is status F (dies fastus); legal business permitted; dies religiosus not nefastus
Source: Scullard p.74–75; Fowler p.306–310

**["1-22"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Concordia Familiar"` → `"Lares"`
Source: Scullard p.75–76; Fowler p.309–310

**["1-27"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: current says "carreras de carros y caballos" → horse-racing only; chariot involvement uncertain
Source: Scullard p.82; Fowler p.330

### Martius

**["2-14"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: current says "honrar y purificar a las monturas militares" → horse-race (feriae Marti); not a purification of mounts
Source: Scullard p.89–90; Fowler p.44

**["2-17"] WRONG_RITUAL HIGH**
Field `festivalDesc`: describes toga virilis ceremony only → Toga virilis secondary; liba-selling by old women and Liber/Libera cult is primary
Source: Scullard p.91–93; Fowler p.54–57

**["2-17"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Liber Pater / Marte"` → `"Liber Pater / Libera"`
Source: Scullard p.91–93; Fowler p.54–57

**["2-19"] WRONG_DEITY HIGH**
Field `deity`: current `"Minerva"` → `"Marte / Minerva"` (Mars primary; Minerva secondary popular association)
Source: Scullard p.93–95; Fowler p.57–62

### Aprilis

**["3-1"] WRONG_DEITY HIGH**
Field `deity`: current `"Venus Verticordia"` → `"Venus Verticordia / Fortuna Virilis"`
Source: Scullard p.96–97; Fowler p.67–69

**["3-1"] WRONG_RITUAL HIGH**
Field `festivalDesc`: attributes statue-bath to Venus Verticordia; Fortuna Virilis absent → Bathing rite belongs to Fortuna Virilis; two distinct cults conflated
Source: Scullard p.96; Fowler p.68

**["3-4"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'C'`
Source: Scullard p.97; Fowler p.69

**["3-5"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'C'`
Source: Scullard p.101

**["3-10"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.101; Fowler p.69

**["3-19"] WRONG_DEITY HIGH**
Field `deity`: current `"Ceres"` → `"Ceres, Liber, Libera"`
Source: Scullard p.102; Fowler p.72

**["3-23"] WRONG_DEITY HIGH**
Field `deity`: current `"Venus / Júpiter"` → `"Júpiter / Venus Erucina"` (Jupiter primary throughout Republic)
Source: Scullard p.106; Fowler p.85

**["3-23"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'F'`
Source: Scullard p.106; Fowler p.85

**["3-25"] WRONG_RITUAL HIGH**
Field `festivalDesc`: says "un animal de pelaje rojo" → Dog and a sheep (two victims); Flamen Quirinalis sacrificed both
Source: Scullard p.131; Fowler p.88

### Maius

**["4-1"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'F'`
Source: Scullard p.116; Fowler p.101

**["4-9"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.118; Fowler p.107

**["4-9"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "arrojaba habas negras a sus espaldas" → "escupiendo habas negras de su boca nueve veces"
Source: Scullard p.118; Fowler p.107

**["4-11"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.118; Fowler p.107

**["4-13"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.118; Fowler p.107

**["4-14"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "efigies de paja" → "efigies de junco"; also date presented as certain on day 14 when Fowler gives day 15
Source: Scullard p.120; Fowler p.111

**["4-23"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "dedicadas a Vulcano" → Tubilustrium had no named deity; Feriae Volcano is a separate festival
Source: Scullard p.123; Fowler pp.123–124

**["4-24"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: current `"El Rex Sacrorum completaba sus deberes religiosos."` → formal Comitia dismissal enabling legal acts (wills)
Source: Scullard p.123; Fowler p.123

**["4-29"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Deidades agrarias"` → `"Marte / Ceres"`
Source: Scullard p.124; Fowler p.125

### Iunius

**["5-1"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.127; Fowler p.129

**["5-5"] WRONG_STATUS HIGH**
Field `status`: current `'F'` → `'N'`
Source: Scullard pp.147–148; Fowler p.135

**["5-7"] WRONG_DEITY HIGH**
Field `deity`: current `"Tiberinus"` → `"Vulcanus"`
Source: Scullard p.148

**["5-9"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard pp.149–150; Fowler pp.146–154

**["5-9"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "Comienza la principal purificación de la casa de Vesta" → penus opened 7 June, not 9; day 9 is the principal feast day
Source: Scullard p.148; Fowler pp.146–147

**["5-11"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard pp.150–152; Fowler pp.154–157

**["5-14"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "Último día de labores previas a la apertura ritual total" → penus had been open since June 7; "apertura ritual" already happened
Source: Scullard p.148

**["5-15"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'N'` (or `'QSDF'`)
Source: Scullard p.153; Fowler p.153

**["5-15"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "cenizas purgadas" → "stercus (suciedad acumulada / floor-sweepings)"
Source: Scullard p.153; Fowler p.153

**["5-20"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "Sacrificio de expiación" → dies natalis offering (not a piaculum / expiatory rite)
Source: Scullard pp.153–155; Fowler pp.160–161

### Iulius

**["6-1"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.158

**["6-1"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Juno"` → `"Juno / Felicitas"`
Source: Scullard pp.158–159

**["6-5"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "vinculados a asaltos de pueblos vecinos en los albores de Roma" → rejected Fidenae aition presented as established fact
Source: Scullard p.159; Fowler pp.174–176

**["6-7"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.161; Fowler p.176

**["6-13"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'C'`
Source: Scullard p.164

**["6-17"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Honos"` → `"Honos y Virtus"`
Source: Scullard pp.165–166

**["6-18"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: omits defeat of Fabii on Cremera (479 BC) → include both disasters: Allia + Cremera ("Dies Alliae et Fabiorum")
Source: Scullard p.166

**["6-24"] WRONG_DATE HIGH**
`festivalName` "Furrinalia" listed on key "6-24" (July 24) → move to `"6-25"` (July 25); `"6-24"` should have no festival
Source: Scullard p.169; Fowler p.187

### Augustus

**["7-1"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'F'`
Source: Scullard pp.169–170

**["7-1"] WRONG_DEITY HIGH**
Field `deity`: current `"Spes / Marte"` → `"Spes / Victoria"` (Mars Ultor belongs on 12 May, not 1 Aug)
Source: Scullard pp.169–170

**["7-9"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'C'`
Source: Scullard p.171; Fowler pp.191–193

**["7-11"] WRONG_DATE HIGH**
`festivalName` "Culto de Ara Maxima" on key "7-11" (Aug 11) → move to `"7-12"` (Aug 12); `"7-11"` should be plain dies comitialis
Source: Scullard pp.171–173; Fowler pp.193–197

**["7-13"] WRONG_RITUAL HIGH**
Field `festivalName`: current `"Nemoralia"` → `"Dianae in Aventino"` (fasti entry is Aventine temple, not Nemi)
Source: Scullard pp.173–175; Fowler pp.198–202

**["7-19"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'F'`
Source: Scullard p.177; Fowler pp.204–206

**["7-21"] WRONG_STATUS HIGH**
Field `status`: current `'F'` → `'NP'`
Source: Scullard pp.177–178; Fowler pp.206–209

**["7-24"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "día nefasto" → "dies religiosus" (legally distinct category per Macrobius 1.16.18)
Source: Scullard pp.180–181; Fowler pp.211–212

**["7-25"] WRONG_RITUAL MEDIUM**
Field `festivalDesc`: says "Pontifex Maximus" → "Rex Sacrorum (sacerdos publicus)"
Source: Scullard p.181; Fowler pp.212–214

**["7-28"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'C'`
Source: Scullard p.182

### September

**["8-1"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'F'`
Source: Scullard p.183

**["8-1"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Juno Regina"` → `"Juno Regina; Júpiter Tonante; Júpiter Libre"`
Source: Scullard p.183

**["8-4"] WRONG_DATE HIGH**
`festivalDesc` of `"8-4"` shows "Comienzo de los masivos Juegos Romanos" → Republican attested start is Sep 5; `"8-4"` should not present as opening day
Source: Scullard p.183–186; Fowler p.215

**["8-13"] WRONG_DEITY HIGH**
Field `deity`: current `"Júpiter"` → `"Júpiter; Juno; Minerva"` (full Capitoline Triad)
Source: Scullard p.186–187; Fowler pp.217–220

**["8-14"] WRONG_DEITY HIGH**
Field `deity`: current `"Marte / Júpiter"` → `"Ninguna"` (no named patron deity in sources)
Source: Scullard p.188; Fowler pp.215–216

**["8-14"] WRONG_RITUAL HIGH**
Field `festivalDesc`: says "purificación militar" → Review/inspection only (equorum probatio); no purification rite
Source: Scullard p.188; Fowler pp.215–216

**["8-15"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'C'` (or `'F'`; NP not supported for Sep 15)
Source: Scullard p.183–186; Fowler p.215–216

**["8-23"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Apolo"` → `"Apolo; Latona"`
Source: Scullard p.188

### October

**["9-1"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.189–190

**["9-1"] WRONG_DEITY HIGH**
Field `deity`: current `"Fides"` → `"Fides / Jano Curiacio / Juno Sororia"` (Tigillum Sororium deities erased)
Source: Scullard p.190; Fowler pp.238–239

**["9-7"] WRONG_DEITY HIGH**
Field `deity`: current `"Júpiter Fulgur / Juno"` → `"Júpiter Fulgur / Juno Curitis"` (specific Faliscan epithet)
Source: Scullard p.191; Fowler p.239

**["9-9"] WRONG_DEITY HIGH**
Field `deity`: current `"Genius Publicus"` → `"Genius Publicus / Fausta Felicitas / Venus Victrix"`
Source: Scullard p.191

**["9-10"] WRONG_RITUAL MEDIUM**
Field `festivalName`: current `"Ludi Augustales"` → `"Iunoni Monetae"` (independent named calendar entry suppressed)
Source: Scullard p.191–192

**["9-15"] WRONG_RITUAL HIGH**
Field `festivalDesc`: says "purificado y sacrificado" → "sacrificado" only; no purification — horse was killed with a spear
Source: Scullard p.193–195; Fowler pp.241–250

### November

**["10-1"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'F'`
Source: Scullard p.196

**["10-1"] WRONG_DEITY HIGH**
Field `deity`: current `"Juno"` → `"Victoria"` (Victoria Sullana)
Source: Scullard p.196

**["10-1"] WRONG_RITUAL HIGH**
Field `festivalDesc`: current `"Conclusión de los juegos de Sila. Honores habituales de las Calendas."` → Concluding Circenses of Ludi Victoriae Sullanae; Kalends rites not the content
Source: Scullard p.196

**["10-3"] WRONG_DATE HIGH**
`festivalName` "Ludi Plebeii" start listed Nov 3 → Nov 4 (PR. NON. NOV.); `"10-3"` should have no festivalName
Source: Scullard pp.196–197; Fowler p.252

**["10-8"] WRONG_STATUS HIGH**
Field `status`: current `'NP'` → `'C'` (dies religiosus)
Source: Scullard p.197

**["10-8"] WRONG_DEITY HIGH**
Field `deity`: current `"Manes"` → `"Divinidades ctónicas"` (no named deity in sources)
Source: Scullard p.197

**["10-8"] WRONG_RITUAL HIGH**
Field `festivalDesc`: says "Segunda apertura sagrada" → Third and final annual opening (sequence: 24 Aug → 5 Oct → 8 Nov)
Source: Scullard p.197

**["10-14"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Marte / Júpiter"` → `"Ninguna"` (no deity stated; Mars attribution is unsourced inference)
Source: Scullard p.198

**["10-15"] WRONG_DATE HIGH**
Feronia placed Nov 15 → Nov 13 (Ides); "Feroniae in Campo" is unambiguously under 13 Nov; move to `"10-13"`
Source: Scullard pp.197–198; Fowler p.252

### December

**["11-1"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'N'`
Source: Scullard p.199

**["11-3"] WRONG_RITUAL HIGH**
Field `festivalDesc`: says "el vino estaba terminantemente prohibido" → Wine was the central offering, renamed 'milk' by ritual convention; prohibition was on the word not the substance
Source: Scullard pp.199–201; Fowler p.256

**["11-8"] WRONG_DEITY MEDIUM**
Field `deity`: current `"Tiberinus"` → `"Tiberinus / Gaia"`
Source: Scullard pp.202–203

**["11-13"] WRONG_DEITY HIGH**
Field `deity`: current `"Tellus"` → `"Tellus / Ceres"`; field `festivalName`: current `"Lectisternium a Ceres"` → correct to reflect Tellus as primary (dies natalis of Tellus temple)
Source: Scullard pp.204–205

**["11-15"] WRONG_RITUAL HIGH**
Field `festivalDesc`: says "Los burros y mulas eran coronados" and "Se destapaba su altar del Circo Máximo" → correct animals are horses (equi) and mules; altar-uncovering belongs to August Consualia (21 Aug), not December
Source: Scullard p.205; Fowler p.268

**["11-23"] WRONG_RITUAL HIGH**
Field `festivalDesc`: says "Conclusión sombría de las Saturnales de diciembre" → Larentalia is independent parentatio at tomb of Acca Larentia; unconnected to Saturnalia
Source: Scullard pp.211–212; Fowler pp.275–276

**["11-25"] WRONG_STATUS MEDIUM**
Field `status`: current `'NP'` → `'C'` (Republican calendar; Sol Invictus is an imperial-era addition)
Source: Scullard p.212

---

## Code Changes Required

Only HIGH and MEDIUM WRONG_DATE, WRONG_DEITY, WRONG_STATUS, WRONG_RITUAL findings. Ordered by month ascending, day ascending. Current values verified against `utils/romanYearData.ts`.

---

### Key "0-1" — Kalendae Ianuariae
**Field**: `deity`
**Current**: `"Jano / Juno"`
**Change to**: `"Júpiter Óptimo Máximo"`
**Source**: Scullard p.52–55; Fowler p.278–279

---

### Keys "0-3" / "0-4" — Compitalia
**Field**: `festivalDesc` on `"0-4"`
**Current**: `"Continuación de las festividades en honor a los Lares."`
**Change to**: Remove `"0-4"` festivalName and festivalDesc (Compitalia is a single day, feriae conceptivae); note moveable date in `"0-3"` only
**Source**: Scullard p.59–60; Fowler p.279–281

---

### Key "0-11" — Carmentalia / Juturnalia
**Field**: `deity`
**Current**: `"Carmenta / Juturna"`
**Change to**: `"Carmenta"`
**Source**: Scullard p.62–65; Fowler p.290–293

---

### Key "0-24" — Feriae Sementivae (day 1)
**Field**: `deity`
**Current**: `"Ceres y Tellus"`
**Change to**: `"Tellus"`
**Source**: Scullard p.68–69; Fowler p.294–296

**Field**: `festivalDesc`
**Current**: `"Fiesta agrícola móvil de la siembra celebrada habitualmente a finales de enero para pedir protección para los cultivos."`
**Change to**: Note that Sementivae spans two non-consecutive days (~7 days apart); day 1 honors Tellus alone
**Source**: Scullard p.68–69; Fowler p.294–296

---

### Key "0-25" — Feriae Sementivae (continuation)
**Field**: `deity`
**Current**: `"Ceres y Tellus"`
**Change to**: Remove or mark as day between the two Sementivae rites (not a Sementivae day)
**Source**: Scullard p.68–69; Fowler p.294–296

---

### Key "0-26" — Feriae Sementivae (day 2, ~7 days later)
**Field**: `deity`
**Current**: `"Ceres y Tellus"`
**Change to**: `"Ceres"` (second day of Sementivae honors Ceres alone, ~7 days after day 1)
**Source**: Scullard p.68–69; Fowler p.294–296

---

### Key "1-1" — Kalendae Februariae
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.71; Fowler p.302

---

### Key "1-15" — Lupercalia
**Field**: `deity`
**Current**: `"Fauno / Lupercus"`
**Change to**: `"Fauno / Inuus (incierto)"`
**Source**: Scullard p.78; Fowler p.310–321

---

### Key "1-17" — Quirinalia
**Field**: `deity`
**Current**: `"Quirino / Fornax"`
**Change to**: `"Quirino"`
**Source**: Scullard p.73–74; Fowler p.302–306

---

### Key "1-21" — Feralia
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'F'`
**Source**: Scullard p.74–75; Fowler p.306–310

**Field**: `festivalDesc`
**Current**: `"Día público de cierre de la Parentalia dedicado a apaciguar a los Manes y realizar ofrendas en las tumbas familiares. Día nefasto: toda actividad pública estaba prohibida."`
**Change to**: Remove "Día nefasto: toda actividad pública estaba prohibida." — Feralia is a dies fastus; legal business was permitted; it is dies religiosus but not nefastus
**Source**: Scullard p.74–75; Fowler p.306–310

---

### Key "1-22" — Caristia
**Field**: `deity`
**Current**: `"Concordia Familiar"`
**Change to**: `"Lares"`
**Source**: Scullard p.75–76; Fowler p.309–310

---

### Key "1-27" — Equirria
**Field**: `festivalDesc`
**Current**: `"Primera de las carreras de carros y caballos en el Campo de Marte, dedicadas al dios antes de la temporada militar."`
**Change to**: Horse-racing only; chariot involvement uncertain; remove "carros y"
**Source**: Scullard p.82; Fowler p.330

---

### Key "2-14" — Segunda Equirria
**Field**: `festivalDesc`
**Current**: `"Segunda fecha de carreras de caballos sagradas en el Campo de Marte para honrar y purificar a las monturas militares."`
**Change to**: Remove "purificar a las monturas militares" — this is a horse-race (feriae Marti), not a purification of mounts
**Source**: Scullard p.89–90; Fowler p.44

---

### Key "2-17" — Liberalia
**Field**: `deity`
**Current**: `"Liber Pater / Marte"`
**Change to**: `"Liber Pater / Libera"`
**Source**: Scullard p.91–93; Fowler p.54–57

**Field**: `festivalDesc`
**Current**: `"Se celebra el crecimiento de la juventud; los adolescentes romanos asumen la Toga Virilis (ropa de adultez civil)."`
**Change to**: Toga virilis was secondary; primary rite was liba-selling by old women at crossroads and Liber/Libera cult processions
**Source**: Scullard p.91–93; Fowler p.54–57

---

### Key "2-19" — Quinquatrus
**Field**: `deity`
**Current**: `"Minerva"`
**Change to**: `"Marte / Minerva"`
**Source**: Scullard p.93–95; Fowler p.57–62

---

### Key "3-1" — Veneralia
**Field**: `deity`
**Current**: `"Venus Verticordia"`
**Change to**: `"Venus Verticordia / Fortuna Virilis"`
**Source**: Scullard p.96–97; Fowler p.67–69

**Field**: `festivalDesc`
**Current**: `"Las mujeres bañaban ritualmente la estatua de Venus y rogaban que sus corazones se mantuvieran fieles hacia la virtud y el honor marital."`
**Change to**: Bathing rite belongs to Fortuna Virilis, not Venus Verticordia; two distinct cults on the same day; clarify both
**Source**: Scullard p.96; Fowler p.68

---

### Key "3-4" — Megalesia
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'`
**Source**: Scullard p.97; Fowler p.69

---

### Key "3-5" — Nonae Apriles / Megalesia
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'`
**Source**: Scullard p.101

---

### Key "3-10" — Megalesia (Fin)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.101; Fowler p.69

---

### Key "3-19" — Cerialia (Fin)
**Field**: `deity`
**Current**: `"Ceres"`
**Change to**: `"Ceres, Liber, Libera"`
**Source**: Scullard p.102; Fowler p.72

---

### Key "3-23" — Vinalia Priora
**Field**: `deity`
**Current**: `"Venus / Júpiter"`
**Change to**: `"Júpiter / Venus Erucina"`
**Source**: Scullard p.106; Fowler p.85

**Field**: `status`
**Current**: `'NP'`
**Change to**: `'F'`
**Source**: Scullard p.106; Fowler p.85

---

### Key "3-25" — Robigalia
**Field**: `festivalDesc`
**Current**: `"El flamen Quirinalis sacrificaba un animal de pelaje rojo para apaciguar al dios/diosa del mildiu y rogar que no oxidara el trigo incipiente."`
**Change to**: Two victims: a dog and a sheep; Flamen Quirinalis sacrificed both
**Source**: Scullard p.131; Fowler p.88

---

### Key "4-1" — Kalendae Maiae
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'F'`
**Source**: Scullard p.116; Fowler p.101

---

### Key "4-9" — Lemuria
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.118; Fowler p.107

**Field**: `festivalDesc`
**Current**: `"Primer día de los ritos arcaicos de propiciación familiar. El paterfamilias arrojaba habas negras a sus espaldas en la noche para aplacar a los espíritus."`
**Change to**: Replace "arrojaba habas negras a sus espaldas" with "escupiendo habas negras de su boca nueve veces"
**Source**: Scullard p.118; Fowler p.107

---

### Key "4-11" — Lemuria (II)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.118; Fowler p.107

---

### Key "4-13" — Lemuria (III)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.118; Fowler p.107

---

### Key "4-14" — Ritos de los Argei
**Field**: `festivalDesc`
**Current**: `"Procesión sagrada. Las vírgenes vestales arrojan efigies de paja llamadas 'Argei' a las aguas del río Tíber."`
**Change to**: Replace "paja" with "junco" (rush-figures, not straw); note date disputed (Scullard: 14; Fowler: 15 May)
**Source**: Scullard p.120; Fowler p.111

---

### Key "4-23" — Tubilustrium (Maius)
**Field**: `festivalDesc`
**Current**: `"Segunda purificación anual de las trompetas sagradas (tubae), dedicadas a Vulcano."`
**Change to**: Remove "dedicadas a Vulcano" — Tubilustrium had no named deity; Feriae Volcano is a separate festival on the same day
**Source**: Scullard p.123; Fowler pp.123–124

---

### Key "4-24" — Quando Rex Comitiavit Fas (Maius)
**Field**: `festivalDesc`
**Current**: `"El Rex Sacrorum completaba sus deberes religiosos."`
**Change to**: Describe formal Comitia dismissal by the Rex Sacrorum enabling legal acts (wills) for the remainder of the day
**Source**: Scullard p.123; Fowler p.123

---

### Key "4-29" — Ambarvalia
**Field**: `deity`
**Current**: `"Deidades agrarias"`
**Change to**: `"Marte / Ceres"`
**Source**: Scullard p.124; Fowler p.125

---

### Key "5-1" — Kalendae Iuniae
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.127; Fowler p.129

---

### Key "5-5" — Nonae Iuniae
**Field**: `status`
**Current**: `'F'`
**Change to**: `'N'`
**Source**: Scullard pp.147–148; Fowler p.135

---

### Key "5-7" — Ludi Piscatorii
**Field**: `deity`
**Current**: `"Tiberinus"`
**Change to**: `"Vulcanus"`
**Source**: Scullard p.148

---

### Key "5-9" — Vestalia
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard pp.149–150; Fowler pp.146–154

**Field**: `festivalDesc`
**Current**: `"Comienza la principal purificación de la casa de Vesta. Los burros de los panaderos eran adornados con panes y coronas."`
**Change to**: The penus opened June 7 (Vesta Aperitur); June 9 is the principal feast day, not the opening; revise accordingly
**Source**: Scullard p.148; Fowler pp.146–147

---

### Key "5-11" — Matralia
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard pp.150–152; Fowler pp.154–157

---

### Key "5-14" — Vestalia (continued)
**Field**: `festivalDesc`
**Current**: `"Último día de labores previas a la apertura ritual total."`
**Change to**: Remove "apertura ritual" framing — penus had been open since June 7; June 14 is within the open Vestalia period
**Source**: Scullard p.148

---

### Key "5-15" — Quando Stercum Delatum Fas
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'` (or note the QSDF designation in statusFull)
**Source**: Scullard p.153; Fowler p.153

**Field**: `festivalDesc`
**Current**: `"Fin oficial de la limpieza del Penus Vestae. Las cenizas purgadas eran arrastradas al Tíber o a lugares sagrados."`
**Change to**: Replace "cenizas purgadas" with "stercus (suciedad acumulada, floor-sweepings)"
**Source**: Scullard p.153; Fowler p.153

---

### Key "5-20" — Summanalia
**Field**: `festivalDesc`
**Current**: `"Sacrificio de expiación a Summanus. Se ofrecían pasteles de harina con forma de ruedas."`
**Change to**: Replace "Sacrificio de expiación" with "ofrenda del dies natalis" — this is not a piaculum
**Source**: Scullard pp.153–155; Fowler pp.160–161

---

### Key "6-1" — Kalendae Iuliae
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.158

**Field**: `deity`
**Current**: `"Juno"`
**Change to**: `"Juno / Felicitas"`
**Source**: Scullard pp.158–159

---

### Key "6-5" — Poplifugia
**Field**: `festivalDesc`
**Current**: `"La 'Huida del Pueblo'. Ritos misteriosos de origen antiquísimo vinculados a asaltos de pueblos vecinos en los albores de Roma."`
**Change to**: Remove the Fidenae aition — it is explicitly rejected by both Scullard and Fowler as a secondary invention; describe as mysterious rite of unknown origin
**Source**: Scullard p.159; Fowler pp.174–176

---

### Key "6-7" — Nonae Iuliae / Nonae Caprotinae
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.161; Fowler p.176

---

### Key "6-13" — Ludi Apollinares (Fin)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'`
**Source**: Scullard p.164

---

### Key "6-17" — Dedicación del Templo de Honos
**Field**: `deity`
**Current**: `"Honos"`
**Change to**: `"Honos y Virtus"`
**Source**: Scullard pp.165–166

---

### Key "6-18" — Dies Alliensis
**Field**: `festivalDesc`
**Current**: `"Día de luto. Conmemora la derrota devastadora del ejército romano frente a los galos en la batalla del Alia (390 a.C.)."`
**Change to**: Add the defeat of the Fabii on the Cremera (479 BC) — this day commemorates both disasters ("Dies Alliae et Fabiorum")
**Source**: Scullard p.166

---

### Key "6-24" → "6-25" — Furrinalia (WRONG_DATE)
**Action**: Move entire festival entry from `"6-24"` to `"6-25"`

**Key "6-24"**
**Current**: `{ status: 'N', deity: "Furrina", festivalName: "Furrinalia", festivalDesc: "Se ofrecían sacrificios a la olvidada diosa Furrina en su santuario del monte Janículo." }`
**Change to**: Remove festivalName, festivalDesc, and Furrina from `"6-24"`; restore as plain N-day with no deity or festival

**Key "6-25"**
**Current**: `{ status: 'C', deity: "Ninguna" }` (no festival)
**Change to**: `{ status: 'NP', deity: "Furrina", festivalName: "Furrinalia", festivalDesc: "Se ofrecían sacrificios a la olvidada diosa Furrina en su santuario del monte Janículo." }`
**Source**: Scullard p.169; Fowler p.187

---

### Key "7-1" — Kalendae Augusti
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'F'`
**Source**: Scullard pp.169–170

**Field**: `deity`
**Current**: `"Spes / Marte"`
**Change to**: `"Spes / Victoria"`
**Source**: Scullard pp.169–170

---

### Key "7-9" — Sol Indiges
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'`
**Source**: Scullard p.171; Fowler pp.191–193

---

### Key "7-11" → "7-12" — Ara Maxima / Hercules (WRONG_DATE)
**Action**: Move festival entry from `"7-11"` to `"7-12"`

**Key "7-11"**
**Current**: `{ status: 'C', deity: "Hércules", festivalName: "Culto de Ara Maxima", festivalDesc: "Día tradicional de ritos vinculados al Altar Magno de Hércules (Ara Maxima)." }`
**Change to**: Remove festivalName, festivalDesc, and Hercules from `"7-11"`; restore as plain C-day with no deity or festival

**Key "7-12"**
**Current**: `{ status: 'C', deity: "Ninguna" }` (no festival)
**Change to**: `{ status: 'C', deity: "Hércules", festivalName: "Hercules Invictus / Ara Maxima", festivalDesc: "Dies natalis del culto de Hércules en el Ara Maxima y de Venus Victrix en el teatro de Pompeyo." }`
**Source**: Scullard pp.171–173; Fowler pp.193–197

---

### Key "7-13" — Idus Augusti / Dianae in Aventino
**Field**: `festivalName`
**Current**: `"Nemoralia"`
**Change to**: `"Dianae in Aventino"`
**Source**: Scullard pp.173–175; Fowler pp.198–202

---

### Key "7-19" — Vinalia Rustica
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'F'`
**Source**: Scullard p.177; Fowler pp.204–206

---

### Key "7-21" — Consualia (Augustus)
**Field**: `status`
**Current**: `'F'`
**Change to**: `'NP'`
**Source**: Scullard pp.177–178; Fowler pp.206–209

---

### Key "7-24" — Mundus Patet (I)
**Field**: `festivalDesc`
**Current**: `"Primera de las tres fechas del año en que el 'Mundo' (fosa ritual del más allá) quedaba abierto, siendo un día nefasto para cualquier labor militar o política mayor."`
**Change to**: Replace "día nefasto" with "dies religiosus" — legally distinct category (Macrobius 1.16.18); dies nefastus concerns courts/assemblies, not this rite
**Source**: Scullard pp.180–181; Fowler pp.211–212

---

### Key "7-25" — Opiconsivia
**Field**: `festivalDesc`
**Current**: `"Festividad secreta y sagrada celebrada en la Regia por las Vírgenes Vestales y el Pontifex Maximus en honor a la abundancia agraria."`
**Change to**: Replace "Pontifex Maximus" with "Rex Sacrorum (sacerdos publicus)"
**Source**: Scullard p.181; Fowler pp.212–214

---

### Key "7-28" — Culto del Sol y la Luna
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'`
**Source**: Scullard p.182

---

### Key "8-1" — Dedicación de Juno Regina (September)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'F'`
**Source**: Scullard p.183

**Field**: `deity`
**Current**: `"Juno Regina"`
**Change to**: `"Juno Regina; Júpiter Tonante; Júpiter Libre"`
**Source**: Scullard p.183

---

### Key "8-4" — Ludi Romani (Sep 4)
**Field**: `festivalDesc`
**Current**: `"Comienzo de los masivos Juegos Romanos que se celebraban durante dos semanas en el mes de septiembre en agradecimiento a Júpiter."`
**Change to**: Remove "Comienzo"; Sep 4 is not the Republican attested start; the games run from Sep 5 (Nonae). Sep 4 can note anticipatory preparations or be treated as a generic C-day
**Source**: Scullard p.183–186; Fowler p.215

---

### Key "8-13" — Epulum Jovis (Ides Septembres)
**Field**: `deity`
**Current**: `"Júpiter"`
**Change to**: `"Júpiter; Juno; Minerva"`
**Source**: Scullard p.186–187; Fowler pp.217–220

---

### Key "8-14" — Equorum Probatio (September)
**Field**: `deity`
**Current**: `"Marte / Júpiter"`
**Change to**: `"Ninguna"`
**Source**: Scullard p.188; Fowler pp.215–216

**Field**: `festivalDesc`
**Current**: `"Exhibición, revisión y purificación militar de los caballos romanos durante la estructura de los grandes juegos."`
**Change to**: Remove "purificación"; equorum probatio was a review and inspection only
**Source**: Scullard p.188; Fowler pp.215–216

---

### Key "8-15" — Ludi Romani (Sep 15)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'` (NP not supported for Sep 15; see also Open Questions)
**Source**: Scullard p.183–186; Fowler p.215–216

---

### Key "8-23" — Dedicación del Templo de Apolo
**Field**: `deity`
**Current**: `"Apolo"`
**Change to**: `"Apolo; Latona"`
**Source**: Scullard p.188

---

### Key "9-1" — Ritos a Fides / Tigillum Sororium (October)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.189–190

**Field**: `deity`
**Current**: `"Fides"`
**Change to**: `"Fides / Jano Curiacio / Juno Sororia"`
**Source**: Scullard p.190; Fowler pp.238–239

---

### Key "9-7" — Ritos a Júpiter (October)
**Field**: `deity`
**Current**: `"Júpiter Fulgur / Juno"`
**Change to**: `"Júpiter Fulgur / Juno Curitis"`
**Source**: Scullard p.191; Fowler p.239

---

### Key "9-9" — Dedicación y Juegos (October)
**Field**: `deity`
**Current**: `"Genius Publicus"`
**Change to**: `"Genius Publicus / Fausta Felicitas / Venus Victrix"`
**Source**: Scullard p.191

---

### Key "9-10" — Dies Comitialis (October 10)
**Field**: `festivalName`
**Current**: `"Ludi Augustales"`
**Change to**: `"Iunoni Monetae"` (independent named calendar entry; dies natalis of Juno Moneta's temple)
**Source**: Scullard p.191–192

---

### Key "9-15" — Equus October
**Field**: `festivalDesc`
**Current**: `"Carrera de carros solemne final de la temporada bélica. El caballo ganador a la derecha era purificado y sacrificado al dios Marte en el Campo."`
**Change to**: Remove "purificado"; the horse was killed with a spear (not purified beforehand); "sacrificado" is sufficient
**Source**: Scullard p.193–195; Fowler pp.241–250

---

### Key "10-1" — Kalendae Novembres / Ludi Sullanae
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'F'`
**Source**: Scullard p.196

**Field**: `deity`
**Current**: `"Juno"`
**Change to**: `"Victoria"`
**Source**: Scullard p.196

**Field**: `festivalDesc`
**Current**: `"Conclusión de los juegos de Sila. Honores habituales de las Calendas."`
**Change to**: Describe concluding Circenses of Ludi Victoriae Sullanae; Kalends rites are not the content here
**Source**: Scullard p.196

---

### Key "10-3" → "10-4" — Ludi Plebeii (WRONG_DATE)
**Action**: Move festivalName start from `"10-3"` to `"10-4"`

**Key "10-3"**
**Current**: `{ status: 'C', deity: "Júpiter", festivalName: "Ludi Plebeii", festivalDesc: "Inician los históricos Juegos de la Plebe…" }`
**Change to**: Remove `festivalName` from `"10-3"`; change `festivalDesc` to generic or blank
**Source**: Scullard pp.196–197; Fowler p.252

**Key "10-4"**
**Current**: `{ status: 'C', deity: "Júpiter", festivalName: "Ludi Plebeii", festivalDesc: "Festividades organizadas por los ediles plebeyos." }`
**Change to**: Add opening-day language to `"10-4"` festivalDesc
**Source**: Scullard pp.196–197; Fowler p.252

---

### Key "10-8" — Mundus Patet (III, November)
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'`
**Source**: Scullard p.197

**Field**: `deity`
**Current**: `"Manes"`
**Change to**: `"Divinidades ctónicas"`
**Source**: Scullard p.197

**Field**: `festivalDesc`
**Current**: `"Segunda apertura sagrada de la fosa al inframundo. Es el último momento anual en que los muertos vagan libremente por convención formal."`
**Change to**: Replace "Segunda" with "Tercera" — sequence is 24 Aug (prima) → 5 Oct (secunda) → 8 Nov (tertia et ultima)
**Source**: Scullard p.197

---

### Key "10-14" — Equorum Probatio (November)
**Field**: `deity`
**Current**: `"Marte / Júpiter"`
**Change to**: `"Ninguna"`
**Source**: Scullard p.198

---

### Key "10-15" → "10-13" — Feronia (WRONG_DATE)
**Action**: Move Feronia entry from `"10-15"` to `"10-13"`

**Key "10-15"**
**Current**: `{ status: 'NP', deity: "Feronia", festivalName: "Ludi Plebeii / Feronia", festivalDesc: "Se suman celebraciones de la diosa protectora Feronia a los espectáculos circenses." }`
**Change to**: Remove Feronia from `"10-15"`; festivalName becomes `"Ludi Plebeii"` only

**Key "10-13"**
**Current**: `{ status: 'NP', deity: "Júpiter", festivalName: "Epulum Jovis", festivalDesc: "Importante banquete divino para Júpiter…" }`
**Change to**: Add Feronia as secondary festival (Feroniae in Campo); update deity to include Feronia
**Source**: Scullard pp.197–198; Fowler p.252

---

### Key "11-1" — Kalendae Decembres
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'N'`
**Source**: Scullard p.199

---

### Key "11-3" — Ritos de la Bona Dea
**Field**: `festivalDesc`
**Current**: `"Sacrificios místicos de bienestar auspiciados por la mujer de un magistrado; la participación masculina y el vino estaban terminantemente prohibidos."`
**Change to**: Wine was the central offering, referred to as 'milk' (lac) by ritual convention; the prohibition was on using the word "wine" and on men, not on wine substance itself
**Source**: Scullard pp.199–201; Fowler p.256

---

### Key "11-8" — Tiberinalia
**Field**: `deity`
**Current**: `"Tiberinus"`
**Change to**: `"Tiberinus / Gaia"`
**Source**: Scullard pp.202–203

---

### Key "11-13" — Idus Decembres / Lectisternium
**Field**: `deity`
**Current**: `"Tellus"`
**Change to**: `"Tellus / Ceres"`
**Source**: Scullard pp.204–205

**Field**: `festivalName`
**Current**: `"Lectisternium a Ceres"`
**Change to**: Rename to reflect Tellus as primary — e.g. `"Dies Natalis Telluris / Lectisternium Cereris"`
**Source**: Scullard pp.204–205

---

### Key "11-15" — Consualia de Invierno
**Field**: `festivalDesc`
**Current**: `"Se destapaba su altar del Circo Máximo. Los burros y mulas eran coronados en agradecimiento general agrario."`
**Change to**: (1) Replace "burros" with "caballos (equi)" — the December Consualia honored equi et muli, not donkeys; (2) Remove "Se destapaba su altar del Circo Máximo" — altar-uncovering belongs to the August Consualia (21 Aug), not December
**Source**: Scullard p.205; Fowler p.268

---

### Key "11-23" — Larentalia
**Field**: `festivalDesc`
**Current**: `"Conclusión sombría de las Saturnales de diciembre con un rito mortuorio por los ancestros y la heroína nutricia romana en el Velabro."`
**Change to**: Larentalia is an independent parentatio at the tomb of Acca Larentia in the Velabrum; it has no connection to the Saturnalia; remove "Conclusión sombría de las Saturnales"
**Source**: Scullard pp.211–212; Fowler pp.275–276

---

### Key "11-25" — Dies Natalis Solis Invicti
**Field**: `status`
**Current**: `'NP'`
**Change to**: `'C'`
**Source**: Scullard p.212

---

## Missing Festivals

### Ianuarius

- **Day 1: Dedicatio Aesculapii et Vediovis in Insula** — Double temple dies natalis (Aesculapius 291 BCE, Vediovis 194 BCE) on the Tiber Island; attested in multiple fasti; absent from `"0-1"`. [MEDIUM]
- **Day 11: Juturnalia (as structurally distinct festival)** — Separate deity (Juturna), separate constituency (water-workers), separate venue (Campus Martius temple and Lacus Iuturnae); currently merged into Carmentalia as a footnote in `"0-11"`. [MEDIUM]

### Februarius

- **Day 1: Helernus** — Pontifical sacrifice (black ox per Festus) to a primitive possibly chthonic deity in a Tiber grove; attested by Ovid and Festus; absent from `"1-1"`. [LOW]
- **Moveable: Amburbium** — Major public lustration procession of the pomerium with suovetaurilia; priests, Vestals, augurs, Salii all participated; not represented anywhere in February. [HIGH]

### Martius

- **Day 9: Arma Ancilia Moventur** — Second of the three calendar-marked Salian procession days (1, 9, 23 March); both sources name it explicitly; `"2-9"` has no festival name or deity. [HIGH]
- **Day 14: Mamuralia / Sacrum Mamurio** — Man clad in skins beaten with rods and expelled from the city; attested from Philocalus (354 CE), Lydus, Servius; both sources discuss at length; absent from `"2-14"`. [MEDIUM]

### Aprilis

- **Moveable: Feriae Latinae** — One of the oldest Latin festivals; consuls announced date; Latin allies assembled on Mt. Albano; Jupiter Latiaris; libation was milk; both sources give substantial treatment; no entry anywhere in April. [HIGH]

### Maius

- **Day 1: Maia** — Sacrifice of pregnant sow by Flamen Volcanalis; month name may derive from her. [HIGH]
- **Day 11: Mania** — Fasti Antiquitatis Maioris records sacrifice to Mania (Mater Larum) on same day as Lemuria. [LOW]
- **Day 14: Mars Invictus** — Temple anniversary in Circus Flaminius (pridie Idus); Fasti Venusini. [MEDIUM]
- **Day 23: Feriae Volcano** — Separately attested in Fasti Venusini + Amiterninum; app collapses it into Tubilustrium. [MEDIUM]

### Iunius

- **Day 1 (a): Mars in Clivo** — Dies natalis of temple of Mars extra portam Capenam (c. 388 BC). [LOW]
- **Day 1 (b): Tempestates** — Temple vowed by L. Cornelius Scipio after storm off Corsica. [LOW]
- **Day 7: Vesta Aperitur** — Opening of Vestal penus; Philocalus calendar ("Vesta aperit"); religious period runs 7–15 June. [MEDIUM]
- **Day 11: Fortuna Virgo in Foro Boario** — Dedicated same day as Mater Matuta by Servius Tullius; Scullard pp.151–152. [MEDIUM]
- **Days 25–26: Ludi Taurei** — Quinquennial games in Circus Flaminius for Di inferi; `"5-25"` and `"5-26"` have no entry. [MEDIUM]
- **Day 27: Lares V[...]** — Attested in Ant. mai.; interpretation uncertain. [LOW]

### Iulius

- **Day 6: Fortunae Muliebri** — Temple dedication on Via Latina; cult restricted to univirae; Scullard pp.160–161. [MEDIUM]
- **Day 7 (a): Consus in Circo** — Sacrifice at underground Consus altar (first meta of Circus Maximus). [MEDIUM]
- **Day 8: Vitulatio** — Sacrifice to Vitula (goddess of victory/joyful song) with pontifical attendance; attested in both sources. [HIGH]
- **Day 17: Victoriae in Capitolio** — Separate C-status sacrifice to Victoria; gold statue from Hiero of Syracuse. [MEDIUM]
- **Days 20–30: Ludi Victoriae Caesaris** — Eleven-day games vowed at Pharsalus; keys `"6-20"`–`"6-29"` currently blank C-days. [MEDIUM]

### Augustus

- **Day 1: Victoria / Victoria Virgo** — Two Palatine temple dedications (294 BC, 193 BC); entirely absent. [MEDIUM]
- **Day 12: Hercules Invictus at Ara Maxima + Venus Victrix at Pompey's Theatre** — Linked to WRONG_DATE finding on day 11. [HIGH]
- **Day 13: Vortumnus, Fortuna Equestris, Hercules Victor, Castor & Pollux in Circo, Camenae, Flora** — Five additional cult entries absent from `"7-13"`. [MEDIUM]
- **Day 17: Janus ad theatrum Marcelli** — Fasti evidence. [LOW]
- **Day 19: Venus Libitina** — Temple in Lucus Libitinae on Esquiline; headquarters of libitinarii and death registrations. [MEDIUM]
- **Day 24: Luna in Graecostasi** — Fasti Pinciani. [LOW]

### September

- **Day 5: Dedicatio Iovis Statoris** — Dies natalis of Q. Caecilius Metellus Macedonicus's temple of Jupiter Stator (146 BC); absent from `"8-5"` (subsumed by Ludi Romani). [MEDIUM]
- **Days 20–23: Mercatus** — Post-Ludi market days following the Ludi Romani; `"8-20"` through `"8-23"` have no Mercatus entry. [MEDIUM]

### October

- **Day 14: Penatibus in Velia** — Named calendar entry (EN) for the Temple of the Penates Dei on the Velia; `"9-14"` has correct status EN but no festivalName or festivalDesc. [MEDIUM]
- **Day 15: Ludi Capitolini** — Private games by the College of Capitolini; attested by Cicero, Plutarch, Tertullian; not mentioned in `"9-15"`. [MEDIUM]

### November

- **Day 13: Feronia in Campo** — "Feroniae in Campo" on the Ides of November; freedwomen contributed offerings; absent from `"10-13"` and incorrectly placed on day 15 (see WRONG_DATE above). [HIGH]
- **Day 13: Fortuna Primigenia** — Dies natalis of her Capitol temple (dedicated 194 BC; Livy 29.36, 34.53); absent from `"10-13"`. [MEDIUM]
- **Day 13: [Pietati]** — Dies natalis of the temple of Pietas in the Forum Holitorium; partially preserved in Antiate calendar; absent from `"10-13"`. [LOW]

### December

- **Day 1: Neptuno et Pietati** — Dies natales of the temple of Neptune and temple of Pietas; absent from `"11-1"`. [MEDIUM]
- **Day 10: Tribuni Plebis** — Tribunes of the plebs assumed office on 10 December (Praenestine Fasti); absent from `"11-10"`. [LOW]
- **Day 12: Consualia I (Aventino)** — Dies natalis of the temple of Consus on the Aventine (status EN); `"11-12"` has correct EN status but no festivalName, deity, or description. [MEDIUM]
- **Day 21: Sacrifice to Hercules and Ceres** — Sacrifice of a pregnant sow with loaves and mulsum; absent from `"11-21"` (Scullard p.210). [LOW]
- **Day 23: Dianae et Iunoni Reginae** — Dies natales of Diana's temple and Juno Regina's temple in Campo, both dedicated 179 BC by M. Aemilius Lepidus; absent from `"11-23"`. [MEDIUM]

---

## Invented Aitia

**[Martius "2-15"] INVENTED_AITION**
`festivalDesc` states the festival was "históricamente marcado por el asesinato de Julio César (44 a.C.)." Neither Scullard nor Fowler connects Caesar's assassination to Anna Perenna. Fowler notes the festival may have been declining or obsolete by 44 BCE. The assassination is a historical coincidence, not a religious or cultural element of the observance. Remove the Caesar reference entirely.
Source: Scullard; Fowler

**[Iulius "6-19"] INVENTED_AITION**
`festivalDesc` states "donde los romanos se ocultaron tras el desastre del Alia." Both Scullard (pp.166–167) and Fowler (pp.182–185) explicitly call this a secondary aetiological invention formed after the ritual's meaning was lost. The genuine purpose was propitiation of woodland spirits before tree-felling. Replace with the attested woodland-propitiation purpose.
Source: Scullard pp.166–167; Fowler pp.182–185

**[October "9-7"] INVENTED_AITION**
`festivalDesc` gives "apaciguamiento estacional al dios de los rayos." Neither Scullard nor Fowler states any seasonal-appeasement purpose; Fowler explicitly says "nothing else is known." The description is an unsourced inference. Replace with a neutral acknowledgment that sources give no ritual details.
Source: Scullard p.191; Fowler p.239

---

## Minor Findings

### Ianuarius

- `"0-1"` Vota Publica — `festivalDesc` omits defining ritual elements (white bull sacrifice to Jupiter OMax, sellae curules, procession, Senate convening); addressed by the deity correction.
- `"0-11"` `deityDesc` — "Diosa del parto y ninfa de las fuentes" inaccurately splices Carmenta's domain (childbirth/prophecy) with Juturna's (springs); neither deity is accurately described by the composite.

### Februarius

- `"1-13"` `festivalName` — "Inicio de la Parentalia" leads the entry; per Scullard p.73 the NP status belongs to "Fauno in Insula," not to the Parentalia; festivalName should be "Fauno in Insula / Inicio de la Parentalia."
- `"1-23"` Terminalia — `festivalDesc` too sparse; private rite (garlanded stone, hearthfire, spelt cake, feast with silent neighbours), public rite (sheep at sixth milestone, Via Laurentina), and aition (Numa; Capitol Terminus stone) all absent.

### Martius

- `"2-1"` Matronalia — Key ritual details absent: husbands' gifts to wives, wives serving food to slaves, requirement to unbind all knots and hair before entering Juno Lucina's temple (sympathetic magic for safe birth).
- `"2-15"` Anna Perenna location — `festivalDesc` says "a orillas del Tíber"; both sources specify the grove was at the first milestone on the Flaminian Way (near modern Porta del Popolo), in the Campus Martius — near the Tiber but not a riverside description.
- `"2-16"`/`"2-17"` Argei circuit — `"2-16"` notes the procession; both sources say it ran over both 16 and 17 March; `"2-17"` makes no mention. Shrine count also disputed (Scullard/Varro: 27; Fowler: 24).
- `"2-24"` Q.R.C.F. status — App gives `'F'` (following Scullard); Fowler reads as NP/IP; choice is defensible but `statusFull` could note "QRCF (NP en algunos Fasti)."

### Aprilis

- `"3-13"` Jupiter Libertas omitted — App names only "Júpiter Victor"; Scullard p.102 records both Jupiter Victor (Palatine) and Jupiter Libertas (Aventine) on the April Ides; monthly ovis idulis by Flamen Dialis also unmentioned.
- `"3-15"` Fordicidia — `festivalDesc` is accurate but omits the Vestal ash-keeping (unborn calves burned; ashes kept for mixing with October Horse blood at Parilia); this cross-festival link is the structural core of the spring agricultural cycle per both sources.
- `"3-21"` Parilia — `festivalDesc` captures pastoral and Foundation Day aspects; urban ceremony entirely absent: Vestals' suffimen (Fordicidia ash + October Horse blood) thrown on burning bean-straw; men and women leapt through purifying flames on the Palatine.

### Maius

- `"4-12"` Ludi Martiales — App states temple of Mars Ultor dedicated this day, but Res Gestae 21.2 gives 1 August. [MEDIUM]
- `"4-15"` Maia omitted from deity — Ancient calendars name Maia alongside Mercury and Jupiter for the Ides of May.

### Iunius

- `"5-3"` Bellona — Omits columella (pillar = symbolic enemy territory) and fetial spear-casting rite for declaring war on overseas enemies.
- `"5-4"` Hercules Magnus Custos — Deity listed as "Hercules Custos"; both sources give full epithet "Hercules Magnus Custos."
- `"5-11"` Matralia — Description omits (1) univira restriction, (2) slave-girl beaten and expelled, (3) testuacia cakes.
- `"5-24"` Fors Fortuna — Listed as generic "Fortuna"; both sources distinguish "Fors Fortuna" (trans Tiberim) as a separate cult.
- `"5-30"` Hercules Musarum — Description omits nine Muses' statues from Ambracia and Hercules lyre detail.

### Iulius

- Days 19 & 21 Lucaria status — Scullard: NP; Fowler: IP; sources disagree, no change required (see Open Questions).
- `"6-22"` Concordia — "otra fundación" implies subordinacy; this is the primary July dedication.
- `"6-23"` Neptunalia — Salacia (Neptune's consort) not listed; single source (Fowler).

### Augustus

- `"7-3"` Supplicia Canum — Describes only dog punishment; omits equally attested goose procession.
- `"7-5"` Salus — Description says "altar de la salud"; both sources describe a temple.

### September

- `"8-23"` Dedicatio Apollini et Latonae — `festivalDesc` attributes the 431 BC original dedication to Sep 23; what falls on Sep 23 is the Sosian restoration (c. 32 BC); original 431 BC date is uncertain (possibly July 13).
- `"8-26"` Dedicatio Veneri Genetrici — `festivalDesc` omits the Pharsalus vow aition (Caesar's vow before Pharsalus 48 BC), which Scullard describes as the explicit founding occasion.

### October

- `"9-5"` Mundus Patet — Deity "Augusto / Manes" conflates two distinct rites (Ludi Augustales and Mundus Patet).
- `"9-19"` Armilustrium — `festivalDesc` says "armas de las legiones eran purificadas y devueltas a depósito"; the Armilustrium was a Salian ceremony using the ancilia (sacred shields at the Regia), not a legionary logistics operation.
- `"9-31"` Ludi Victoriae Sullanae — `festivalDesc` says "Último día natural del mes" implying games end Oct 31; games continued into and culminated on 1 November.

### November

- `"10-1"` `festivalName` "Ludi Sullanae" is an incomplete truncation; full attested name is "Ludi Victoriae Sullanae."

### December

- `"11-22"` Lares Permarini — `festivalName` shows "Saturnalia", obscuring the distinct dies natalis of the Lares Permarini temple; `festivalDesc` says "altar" but the structure is a temple (aedes).

---

## Open Questions

1. **Maius "4-14" / Argei date** — Scullard gives May 14 for the Argei rush-figure rite; Fowler gives May 15. Current key `"4-14"` follows Scullard. No change recommended pending further fasti evidence; add a note in `festivalDesc` marking the date as uncertain.

2. **Iulius "6-19" and "6-21" Lucaria status** — Scullard gives NP; Fowler gives IP (intercisus). Current values in the app are both `'NP'`, which follows Scullard. No change recommended; the IP reading is a minority position. Could note in `statusFull`.

3. **Martius "2-24" Q.R.C.F. status** — App gives `'F'` following Scullard; Fowler reads as NP or IP. Both readings are defensible and attested in different fasti. No change recommended; add "QRCF (NP en algunos Fasti)" note to `statusFull`.

4. **Iunius "5-15" status** — Current `'NP'`; Scullard gives `'N'`; the day is also designated QSDF (Quando Stercum Delatum Fas), a special category. The app's `'NP'` is unsupported. Safest change: `'N'` with `statusFull` = `"Q.St.D.F."`.

5. **September "8-15" status** — Current `'NP'` (`statusFull` "Dies Nefastus Publicus"); Scullard gives `'C'` or `'F'`; NP is explicitly not supported for this date by either source. Recommended: `'C'`.

6. **November "10-15" and Feronia** — Feronia at `"10-15"` conflicts with the Missing Festival finding that Feronia belongs at `"10-13"`. Resolving the WRONG_DATE finding (moving Feronia to `"10-13"`) simultaneously addresses the Missing Festival. The `"10-13"` entry currently has Epulum Jovis — both entries can coexist on the same key.

7. **December "11-13" festivalName** — The current name "Lectisternium a Ceres" and the correct primary deity (Tellus, dies natalis of Tellus temple) need to be reconciled without erasing the real Ceres lectisternium that sources confirm. Recommended approach: rename to "Dies Natalis Telluris / Lectisternium Cereris" and update `deity` to "Tellus / Ceres".

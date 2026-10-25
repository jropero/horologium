# Roman Festival Review — Summary Jan–Apr
**Generated**: 2026-10-25
**Sources**: Scullard (1981); Fowler (1899)
**App data**: `utils/romanYearData.ts`

---

## All Findings — Main Table (WRONG_* categories only)

| Month | Key | Category | Priority | Field | Current Value | Correct Value | Source |
|---|---|---|---|---|---|---|---|
| Ianuarius | "0-1" | WRONG_DEITY | HIGH | deity | "Jano / Juno" | "Júpiter Óptimo Máximo" | Scullard p.52–55; Fowler p.278–279 |
| Ianuarius | "0-3"/"0-4" | WRONG_RITUAL | MEDIUM | festivalDesc | Two consecutive Compitalia days | Single day (feriae conceptivae) | Scullard p.59–60; Fowler p.279–281 |
| Ianuarius | "0-11" | WRONG_DEITY | MEDIUM | deity | "Carmenta / Juturna" combined | "Carmenta" (Juturna structurally distinct) | Scullard p.62–65; Fowler p.290–293 |
| Ianuarius | "0-24"–"0-26" | WRONG_RITUAL | HIGH | festivalDesc | Three consecutive Sementivae days | Two non-consecutive days, seven days apart | Scullard p.68–69; Fowler p.294–296 |
| Ianuarius | "0-24"–"0-26" | WRONG_DEITY | HIGH | deity | "Ceres y Tellus" jointly on all three days | Tellus alone (day 1); Ceres alone (day 2, ~7 days later) | Scullard p.68–69; Fowler p.294–296 |
| Februarius | "1-1" | WRONG_STATUS | HIGH | status | "NP" | "N" | Scullard p.71; Fowler p.302 |
| Februarius | "1-15" | WRONG_DEITY | HIGH | deity | "Fauno / Lupercus" | "Fauno / Inuus (incierto)" | Scullard p.78; Fowler p.310–321 |
| Februarius | "1-17" | WRONG_DEITY | MEDIUM | deity | "Quirino / Fornax" | "Quirino" (Fornax is scholastic invention) | Scullard p.73–74; Fowler p.302–306 |
| Februarius | "1-21" | WRONG_STATUS | HIGH | status | "NP" | "F" | Scullard p.74–75; Fowler p.306–310 |
| Februarius | "1-21" | WRONG_RITUAL | HIGH | festivalDesc | "Día nefasto: toda actividad pública estada prohibida" | F (dies fastus) = legal business permitted; dies religiosus not nefastus | Scullard p.74–75; Fowler p.306–310 |
| Februarius | "1-22" | WRONG_DEITY | MEDIUM | deity | "Concordia Familiar" | "Lares" | Scullard p.75–76; Fowler p.309–310 |
| Februarius | "1-27" | WRONG_RITUAL | MEDIUM | festivalDesc | "carreras de carros y caballos" | Horse-racing only; chariot involvement uncertain | Scullard p.82; Fowler p.330 |
| Martius | "2-14" | WRONG_RITUAL | MEDIUM | festivalDesc | "purificar a las monturas militares" | Horse-race (feriae Marti); not a purification of mounts | Scullard p.89–90; Fowler p.44 |
| Martius | "2-17" | WRONG_RITUAL | HIGH | festivalDesc | Describes toga virilis ceremony only | Toga virilis secondary; liba-selling by old women and Liber/Libera cult is primary | Scullard p.91–93; Fowler p.54–57 |
| Martius | "2-17" | WRONG_DEITY | MEDIUM | deity | "Liber Pater / Marte" | "Liber Pater / Libera" | Scullard p.91–93; Fowler p.54–57 |
| Martius | "2-19" | WRONG_DEITY | HIGH | deity | "Minerva" | "Marte / Minerva" (Mars primary; Minerva secondary popular association) | Scullard p.93–95; Fowler p.57–62 |
| Aprilis | "3-1" | WRONG_DEITY | HIGH | deity | "Venus Verticordia" | "Venus Verticordia / Fortuna Virilis" | Scullard p.96–97; Fowler p.67–69 |
| Aprilis | "3-1" | WRONG_RITUAL | HIGH | festivalDesc | Statue-bath attributed to Venus Verticordia; Fortuna Virilis absent | Bathing rite belongs to Fortuna Virilis; two distinct cults conflated | Scullard p.96; Fowler p.68 |
| Aprilis | "3-4" | WRONG_STATUS | HIGH | status | "NP" | "C" | Scullard p.97; Fowler p.69 |
| Aprilis | "3-5" | WRONG_STATUS | MEDIUM | status | "NP" | "C" | Scullard p.101 |
| Aprilis | "3-10" | WRONG_STATUS | MEDIUM | status | "NP" | "N" | Scullard p.101; Fowler p.69 |
| Aprilis | "3-19" | WRONG_DEITY | HIGH | deity | "Ceres" | "Ceres, Liber, Libera" | Scullard p.102; Fowler p.72 |
| Aprilis | "3-23" | WRONG_DEITY | HIGH | deity | "Venus / Júpiter" | "Júpiter / Venus Erucina" (Jupiter primary throughout Republic) | Scullard p.106; Fowler p.85 |
| Aprilis | "3-23" | WRONG_STATUS | MEDIUM | status | "NP" | "F" | Scullard p.106; Fowler p.85 |
| Aprilis | "3-25" | WRONG_RITUAL | HIGH | festivalDesc | "un animal de pelaje rojo" | Dog and a sheep (two victims); Flamen Quirinalis sacrificed both | Scullard p.131; Fowler p.88 |

---

## Missing Festivals (Jan–Apr)

- Ianuarius Day 1: Dedicatio Aesculapii et Vediovis in Insula — Double temple dies natalis (Aesculapius 291 BCE, Vediovis 194 BCE) on the Tiber Island; attested in multiple fasti and covered at length by both sources; entirely absent from "0-1"
- Ianuarius Day 11: Juturnalia as structurally distinct festival — Separate deity (Juturna), separate constituency (water-workers), separate venue (Campus Martius temple and Lacus Iuturnae); currently merged into Carmentalia as a footnote
- Februarius Day 1: Helernus — Pontifical sacrifice (black ox per Festus) to a primitive possibly chthonic deity in a Tiber grove; attested by Ovid and Festus; absent from "1-1"
- Februarius (moveable): Amburbium — Major public lustration procession of the pomerium with suovetaurilia; priests, Vestals, augurs, Salii all participated; Macrobius links it to Numa and Di Manes; not represented anywhere in app February data
- Martius Day 9: Arma Ancilia Moventur — Second of the three calendar-marked Salian procession days (1, 9, 23 March); both sources name it explicitly; "2-9" has no festival name or deity at all
- Martius Day 14: Mamuralia / Sacrum Mamurio — Man clad in skins beaten with rods and expelled from the city; recorded by Lydus, referenced by Servius and Minucius Felix; attested from Philocalus (354 CE); both sources discuss it at length for this day; absent from "2-14"
- Aprilis (moveable): Feriae Latinae — One of the oldest Latin festivals; consuls announced the date; magistrates and Latin allies assembled on Mt. Albano to sacrifice a white heifer to Jupiter Latiaris and share the carnem; libation was milk; both sources give it substantial treatment; no entry anywhere in app April data

---

## Invented Aitia (Jan–Apr)

- Martius Day 15: Anna Perenna — festivalDesc states the festival was "históricamente marcado por el asesinato de Julio César (44 a.C.)"; neither Scullard nor Fowler connects Caesar's assassination to Anna Perenna; Fowler notes the festival may have been declining or obsolete by 44 BCE; the assassination is a historical coincidence not a religious or cultural element of the observance

---

## Minor Findings (Jan–Apr)

- Ianuarius Day 1: Vota Publica — festivalDesc omits defining ritual elements (white bull sacrifice to Jupiter OMax, sellae curules, procession, Senate convening); addressed by the deity correction
- Ianuarius Day 11: deityDesc — "Diosa del parto y ninfa de las fuentes" inaccurately splices Carmenta's domain (childbirth/prophecy) with Juturna's (springs); neither deity is accurately described by the composite
- Februarius Day 13: festivalName — "Inicio de la Parentalia" leads the entry; per Scullard p.73 the NP status in the Fasti belongs to "Fauno in Insula," not to the Parentalia; festivalName should be "Fauno in Insula / Inicio de la Parentalia"
- Februarius Day 23: Terminalia — festivalDesc too sparse; private rite (garlanded stone, hearthfire, spelt cake, feast with silent neighbours), public rite (sheep at sixth milestone, Via Laurentina), and aition (Numa; Capitol Terminus stone) all absent
- Martius Day 1: Matronalia — Key ritual details absent: husbands' gifts to wives, wives serving food to slaves, requirement to unbind all knots and hair before entering Juno Lucina's temple (sympathetic magic for safe birth)
- Martius Day 15: Anna Perenna location — festivalDesc says "a orillas del Tíber"; both sources specify the grove was at the first milestone on the Flaminian Way (near modern Porta del Popolo), in the Campus Martius — near the Tiber but not a riverside description
- Martius Days 16–17: Argei circuit — "2-16" notes the procession; both sources say it ran over both 16 and 17 March; "2-17" makes no mention; shrine count also disputed (Scullard/Varro: 27; Fowler: 24)
- Martius Day 24: Q.R.C.F. status — app gives F (following Scullard); Fowler reads as NP/IP; choice is defensible but statusFull could note "QRCF (NP en algunos Fasti)"
- Aprilis Day 13: Jupiter Libertas omitted — app names only "Júpiter Victor"; Scullard p.102 records both Jupiter Victor (Palatine) and Jupiter Libertas (Aventine) on the April Ides; monthly ovis idulis by Flamen Dialis also unmentioned
- Aprilis Day 15: Fordicidia — festivalDesc is accurate but omits the Vestal ash-keeping (unborn calves burned; ashes kept for mixing with October Horse blood at Parilia); this cross-festival link is the structural core of the spring agricultural cycle per both sources
- Aprilis Day 21: Parilia — festivalDesc captures pastoral and Foundation Day aspects; urban ceremony entirely absent: Vestals' suffimen (Fordicidia ash + October Horse blood) thrown on burning bean-straw; men and women leapt through the purifying flames on the Palatine

---

## Totals

| Category | Count |
|---|---|
| WRONG_DATE | 0 |
| WRONG_DEITY | 11 |
| WRONG_STATUS | 6 |
| WRONG_RITUAL | 8 |
| MISSING_FESTIVAL | 7 |
| INVENTED_AITION | 1 |
| MINOR | 11 |
| **TOTAL** | **44** |

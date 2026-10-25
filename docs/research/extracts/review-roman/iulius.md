# Roman Calendar Review — Iulius (July)

**App data**: `utils/romanYearData.ts`, keys `"6-1"` through `"6-31"`
**Sources**: H.H. Scullard, *Festivals and Ceremonies of the Roman Republic* (1981), pp. 158–171; W. Warde Fowler, *The Roman Festivals of the Period of the Republic* (1899), pp. 174–188
**Date**: 2026-10-25

---

## WRONG_DATE: Furrinalia — Day 24 vs. Day 25

- **App**: key `"6-24"` | status=N | festivalName="Furrinalia" | deity="Furrina"
- **App**: key `"6-25"` | status=C | festivalName=(none)
- **Source**: Scullard p.169 — "Day: 25" — "Furrinalia, 25 July (VIII Kal. Sext.), NP". Fowler p.187 — "Day: 25 (VIII Kal. Sext.)" — "FERIAE FURINAE" in Pinc., Allif.
- **Issue**: The app places the Furrinalia one day early (July 24 = key `"6-24"`). Both sources unambiguously place it on July 25. Key `"6-24"` should have no festival; key `"6-25"` should carry the Furrinalia entry.
- **Fix**:
  - `"6-24"`: remove `festivalName` and `festivalDesc`; status should be N or C (not a festival day).
  - `"6-25"`: status=`NP`, statusFull=`"Furrinalia"`, deity=`"Furrina"`, deityDesc=`"Antigua diosa arcaica de las fuentes; su flamen (flamen Furrinalis) es la prueba de su antigüedad."`, festivalName=`"Furrinalia"`, festivalDesc=`"Festividad estatal de la olvidada diosa Furrina, con sacrificio anual. Para tiempos de Varrón su nombre y su ritual habían caído prácticamente en el olvido. Su lucus sagrado se hallaba en el Janículo."`.
- **Priority**: HIGH

---

## WRONG_STATUS: Nonae Caprotinae — Day 7

- **App**: key `"6-7"` | status=NP | statusFull="Nonae" | festivalName="Nonae Caprotinae"
- **Source**: Scullard p.161 — "Fasti status: N". Fowler p.176 — "Fasti status: N — not in the old Republican fasti as an NP feast."
- **Issue**: The app gives NP; both Scullard and Fowler record the day's status as N (dies nefastus). The Nones of July coinciding with the festival does not elevate it to NP status.
- **Fix**: `status: 'N'`
- **Priority**: HIGH

---

## WRONG_STATUS: Ludi Apollinares chief day — Day 13

- **App**: key `"6-13"` | status=NP | festivalName="Fin de los Ludi Apollinares"
- **Source**: Scullard p.164 — "Fasti status: C (chief day)". The dies natalis of the Temple of Apollo, the oldest in Rome, dedicated in 431 BC on account of a plague (Apollo Medicus).
- **Issue**: App gives NP; Scullard gives C (the Antiate maiores record sacrifice to Apollo on this specific day, and the chief day of ludi is marked C in surviving calendars). The festivalName also downplays July 13 — it is the dies natalis of the temple, not merely the final day of games.
- **Fix**: `status: 'C'`, `statusFull: "Ludi Apollinares (dies natalis)"`, `festivalName: "Ludi Apollinares"`, `festivalDesc: "Dies natalis del templo de Apolo Médico (431 a.C.), jornada principal de los juegos escénicos y carreras en el Circo. Sacrificio de un buey a Apolo, una vaca a Latona, dos cabras blancas probablemente a Diana. La gente llevaba guirnaldas; las matronas ofrecían plegarias."`.
- **Priority**: HIGH

---

## WRONG_STATUS: Kalendae Iuliae — Day 1

- **App**: key `"6-1"` | status=NP | festivalName="Kalendae de Julio" | deity="Juno"
- **Source**: Scullard p.158 — "Fasti status: N". The July Kalends are listed under N status; Scullard records both Juno and Felicitas for this day.
- **Issue**: App gives NP; Scullard gives N. The Kalends of July do not carry NP status in the surviving fasti.
- **Fix**: `status: 'N'`
- **Priority**: MEDIUM

---

## WRONG_DEITY: Kalendae Iuliae — Day 1

- **App**: key `"6-1"` | deity="Juno"
- **Source**: Scullard p.158–159 — "Deity: Juno (Kalends), Felicitas". Antiate maiores: Felicitati; Antiate minores: Felicitati in Capitolio (temple of Fausta Felicitas on the Capitol).
- **Issue**: The app lists only Juno; Felicitas is also attested for July 1 across multiple Antiate fasti.
- **Fix**: `deity: "Juno / Felicitas"`, `deityDesc: "Juno reina de los dioses (Kalendas); Felicitas, diosa de la prosperidad (templo en el Capitolio)."`. Add to `festivalDesc` a note that the Antiate minores record a cult of Felicitas in Capitolio on this day.
- **Priority**: MEDIUM

---

## WRONG_DEITY: Honori — Day 17

- **App**: key `"6-17"` | festivalName="Dedicación del Templo de Honos" | deity="Honos"
- **Source**: Scullard p.165–166 — "Deity: Honos (and Virtus)". The temple complex comprised a restored temple of Honos (Fabius Cunctator, dedicated after 233 BC) and a new section for Virtus (dedicated by Marcellus' son in 205 BC). The two were architecturally joined just outside the Porta Capena.
- **Issue**: The app names only Honos; Virtus is explicitly the co-deity of the same temple complex, and Scullard treats the dedication date as belonging to Honos *et* Virtus.
- **Fix**: `deity: "Honos y Virtus"`, `deityDesc: "Dioses de la virtud militar y el honor, con templo conjunto fuera de la Porta Capena."`, `festivalName: "Dedicación del Templo de Honos et Virtus"`.
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Dies Alliensis — Day 18

- **App**: key `"6-18"` | festivalDesc="Día de luto. Conmemora la derrota devastadora del ejército romano frente a los galos en la batalla del Alia (390 a.C.)."
- **Source**: Scullard p.166 — "A dies ater (black day) commemorating two Roman military disasters: the defeat of the Fabii on the Cremera (479 BC) and the Roman defeat at the Allia by the Gauls (390 BC)." The Antiate minores record the day as "Dies Alliae et Fabiorum".
- **Issue**: The app mentions only the Allia disaster; the defeat of the Fabii on the Cremera (479 BC) is equally attested by the Antiate minores and constitutes a significant omission.
- **Fix**: `festivalDesc: "Día infausto (dies ater). Conmemora dos catástrofes militares: la derrota de los Fabios en el río Cremera (479 a.C.) y la derrota en el Alia frente a los galos (390 a.C.), que condujo al saco de Roma. Los Antiates menores lo registran como 'Dies Alliae et Fabiorum'."`.
- **Priority**: MEDIUM

---

## INVENTED_AITION: Lucaria — Day 19

- **App**: key `"6-19"` | festivalDesc="Fiestas purificadoras de los bosques sagrados donde los romanos se ocultaron tras el desastre del Alia."
- **Source**: Scullard p.166–167 — the aetiological explanation (Romans hid in the grove fleeing the Gauls after the Allia) is explicitly "a secondary invention". Scullard's preferred reading is that the festival was an ancient rite of propitiation before forest land was cleared. Fowler p.182–185 — dismisses the same legend as "analogous to the aetiological stories for the Poplifugia, formed after the ritual's meaning had been forgotten." He explicitly says Lucaria was a propitiatory rite for woodland deities at harvest-time, unrelated to any Gallic flight.
- **Issue**: The app presents the rejected aetiological legend as the festival's actual purpose ("donde los romanos se ocultaron"). Both sources treat this as a late rationalization invented after the true meaning was lost. The genuine purpose (propitiation of grove spirits before tree-felling / harvest-time woodland ritual) is absent.
- **Fix**: `festivalDesc: "Festividad en un gran bosque (lucus) entre la Vía Salaria y el Tíber. El sentido original se había perdido ya en época de Varrón; probablemente un antiguo rito de propiciación dirigido a las divinidades del bosque antes de talar árboles. La explicación antigua de que los romanos se refugiaron allí huyendo de los galos tras el Alia es considerada por los estudiosos modernos una racionalización tardía."`.
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Poplifugia — Day 5

- **App**: key `"6-5"` | festivalDesc="La 'Huida del Pueblo'. Ritos misteriosos de origen antiquísimo vinculados a asaltos de pueblos vecinos en los albores de Roma."
- **Source**: Scullard p.159 — gives two competing ancient aitia: (1) flight when Romulus disappeared in a storm; (2) flight from the people of Fidenae after the Gallic sack. "Neither is accepted as genuine by Scullard." Fowler p.174–176 — dismisses both as "late rationalisations"; the first is "incompatible with the festival's evident great antiquity." Fowler tentatively proposes an ancient lustration rite (fleeing after sacrifice), not an historical event.
- **Issue**: The app conflates the Fidenae explanation (one of two competing, modern-dismissed aitia) and presents it as the festival's established historical meaning. The phrase "asaltos de pueblos vecinos en los albores de Roma" is derived from the rejected Fidenae aition and presented as fact.
- **Fix**: `festivalDesc: "La 'Huida del Pueblo'. Festival de carácter NP cuyo significado original se había perdido para tiempos de Varrón. Se conservaban en los ritos vestigia (rastros de huida). Las explicaciones antiguas — la desaparición de Rómulo en una tempestad, o una fuga ante los fidentes — son consideradas por Escullard y Fowler racionalizaciones tardías."`.
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Vitulatio — Day 8

- **App**: key `"6-8"` | festivalName="Ludi Apollinares" — no mention of Vitulatio
- **Source**: Scullard p.163–164 — "Day: 8, Fasti status: N Dies religiosus, Deity: Vitula. Sacrifices for the goddess Vitula, apparently an official ceremony attended by the pontiffs. The occasion was linked to a tradition of a Roman victory on 8 July." Fowler p.179 — "VIII Id. Quinct. ... *vitulatio* ... 'post victoriam certis sacrificiis fiat vitulatio' (Macrobius 3.9.11 citing Piso)."
- **Issue**: Vitulatio on July 8 is covered in both sources; the app records only the Ludi Apollinares for this day and omits Vitulatio entirely.
- **Suggested entry** (to be noted alongside the Ludi entry):
  ```
  "6-8": { status: 'NP', statusFull: "Vitulatio / Ludi Apollinares",
    deity: "Vitula / Apolo", deityDesc: "Vitula, diosa de la victoria y la alegría; Apolo (ludi).",
    festivalName: "Vitulatio",
    festivalDesc: "Sacrificios en honor de Vitula, diosa de la victoria (o del canto de triunfo), con asistencia de los pontífices. Su nombre se relaciona con victoria, vita (vida) o vitulari (cantar un peán). Vinculado legendariamente a una victoria sobre los etruscos el día siguiente al Poplifugia. Día también comprendido en los Ludi Apollinares." }
  ```
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Fortunae Muliebri — Day 6

- **App**: key `"6-6"` | festivalName="Ludi Apollinares" — no mention of Fortunae Muliebri
- **Source**: Scullard p.160–161 — "Day: 6, Fasti status: N, Deity: Fortuna Muliebris. Temple dedicated on 6 July (vow made 1 December), located c. four miles outside Rome on the Via Latina. Cult confined to univirae (women married once only)."
- **Issue**: The temple dedication of Fortuna Muliebris on July 6 is attested in Scullard and absent from the app. (Fowler does not cover it in his July chapter.)
- **Suggested entry** (secondary note alongside Ludi):
  ```
  "6-6": { status: 'N', statusFull: "Ludi Apollinares / Fortunae Muliebri",
    deity: "Apolo / Fortuna Muliebris", deityDesc: "Apolo (ludi); Fortuna Muliebris, diosa de la buena suerte femenina.",
    festivalName: "Fortunae Muliebri / Ludi Apollinares",
    festivalDesc: "Dies natalis del templo de Fortuna Muliebris en la Vía Latina (aprox. 6 km de Roma). El culto estaba reservado a univirae (mujeres casadas una sola vez). Ligado legendariamente a las matronas que disuadieron a Coriolano de atacar Roma. También primer día oficial de los Ludi Apollinares." }
  ```
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Consus in Circo — Day 7

- **App**: key `"6-7"` — no mention of Consus
- **Source**: Scullard p.163 — "Day: 7, Deity: Consus. Sacrifice at the underground altar of Consus at the first turning-point (meta) in the Circus Maximus, performed by state-priests. The altar was kept covered and exposed only at the festival." Fowler p.178 cites Tertullian (*de Spect.* 5) for Consus' sacrifice on the same day as the Nonae Caprotinae.
- **Issue**: Both sources attest a sacrifice to Consus at his underground altar on July 7. The app has no mention of this rite.
- **Suggested addition** (to festivalDesc of `"6-7"`): append "En el mismo día, los sacerdotes públicos descubrían el altar subterráneo de Consualia en el Circo Máximo y realizaban un sacrificio a Consus (Tertuliano, *De spect.* 5)."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Palibus duobus (second Parilia) — Day 7

- **App**: key `"6-7"` — no mention of a second Parilia
- **Source**: Scullard p.161 — "Day: 7, Fasti status: N, Deity: Pales. Recorded in the Antiate maiores as a second celebration in honour of Pales (cf. the Parilia on 21 April). Pales received a temple on the Palatine in 267 BC."
- **Issue**: The Antiate maiores record a second Parilia (Palibus duobus) on July 7; absent from the app. This is a single-source (Antiate maiores) entry.
- **Suggested addition**: Note in `festivalDesc` of `"6-7"` that the Antiate maiores also record a second celebration of Pales (*Palibus duobus*) on this day.
- **Priority**: LOW

---

## MISSING_FESTIVAL: Victoriae in Capitolio — Day 17

- **App**: key `"6-17"` | festivalName="Dedicación del Templo de Honos" — no mention of Victoria
- **Source**: Scullard p.166 — "Day: 17, Fasti status: C, Deity: Victoria. Sacrifice on the Capitol; a gold statue of Victory sent by Hiero of Syracuse was placed in the temple of Jupiter Optimus Maximus."
- **Issue**: Scullard records a separate C-status entry for Victoriae in Capitolio on July 17, alongside Honori. The app has only the Honos dedication for this day.
- **Suggested addition** (alongside 6-17): `festivalDesc` should note: "La misma fecha registra también un sacrificio a Victoria en el Capitolio (C), en torno a la estatua de oro de la Victoria enviada por Hierón de Siracusa, colocada en el templo de Júpiter Óptimo Máximo."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Ludi Victoriae Caesaris — Days 20–30

- **App**: keys `"6-20"` through `"6-30"` — C or no festival, no mention of Ludi Victoriae Caesaris (except July 30 which has the Fortuna Huiusce Diei dedication)
- **Source**: Scullard p.167–168 — "Days: 20–30, Deity: Venus Genetrix (also Victoria). Games vowed by Julius Caesar at Pharsalus; temple to Venus Genetrix dedicated in his Forum 26 September 46 BC. From 45 BC: seven days scenic events + four days Circus. After 46 BC, more than half of July consumed by Games."
- **Issue**: The Ludi Victoriae Caesaris (July 20–30) are absent from the app. Scullard covers them as a major late-Republican/Imperial addition consuming eleven days of July. Fowler does not cover them (post-Republican), but Scullard's treatment is thorough. The app's July 20–29 entries are all blank C-days, which misrepresents what those days were in the calendar.
- **Suggested entries**: Add `festivalName: "Ludi Victoriae Caesaris"` and appropriate `festivalDesc` to keys `"6-20"` through `"6-29"` (July 30 retains the Fortuna Huiusce Diei entry). Example for `"6-20"`: `{ status: 'C', statusFull: "Ludi Victoriae Caesaris", deity: "Venus Genetrix", deityDesc: "Venus Madre, ancestro de la gens Iulia.", festivalName: "Ludi Victoriae Caesaris", festivalDesc: "Inicio de los once días de juegos escénicos y circenses votados por Julio César antes de la batalla de Farsalia (48 a.C.) y celebrados desde 45 a.C. el 20–30 de julio. Vinculados al templo de Venus Genetrix en el Foro de César." }`.
- **Priority**: MEDIUM

---

## MINOR: Lucaria status discrepancy between sources

- **App**: keys `"6-19"` and `"6-21"` | status=NP
- **Source**: Scullard says NP for both days (agrees with app). Fowler says IP (in Pinc., Allif.) for both days.
- **Issue**: The sources disagree on whether Lucaria was NP or IP. The app follows Scullard (NP), which is a defensible choice. Worth documenting but not a clear error.
- **Fix**: No change required; add a comment in the data or note that Fowler reads IP.
- **Priority**: LOW

---

## MINOR: Neptunalia — missing consort Salacia

- **App**: key `"6-23"` | deity="Neptuno"
- **Source**: Fowler p.185–187 — "Neptunus was paired with Salacia in ancient cult formulae (Gellius 13.23.2)." Scullard does not mention Salacia explicitly.
- **Issue**: Salacia, Neptune's consort, is attested in ancient cult formulae for this festival (Fowler, citing Gellius). Single source (Fowler/Gellius); Scullard does not mention her.
- **Fix**: Optionally update `deity: "Neptuno (y Salacia)"`. Low priority given single-source attestation.
- **Priority**: LOW

---

## MINOR: Concordia (July 22) — description phrasing

- **App**: key `"6-22"` | festivalDesc="Aniversario de otra fundación del templo."
- **Source**: Scullard p.168 — dies natalis of the temple of Concordia at the foot of the Capitol; linked to Camillus' vow of 367 BC and/or Opimius' restoration of 121 BC.
- **Issue**: The phrase "otra fundación" ("another foundation") is misleading — this is the primary July temple dedication, not a secondary one. The January 16 entry (key `"0-16"`) covers a different Concordia temple; the July 22 entry should stand on its own without implying subordinacy.
- **Fix**: `festivalDesc: "Dies natalis del templo de Concordia al pie del Capitolio. Camilo habría votado el templo en 367 a.C. para celebrar la concordia entre patricios y plebeyos; restaurado o dedicado formalmente por L. Opimio en 121 a.C. tras la muerte de Cayo Graco."`.
- **Priority**: LOW

---

## Summary

| # | Category | Festival / Day | Priority |
|---|----------|---------------|----------|
| 1 | WRONG_DATE | Furrinalia on July 24 (should be July 25) | HIGH |
| 2 | WRONG_STATUS | Nonae Caprotinae, Day 7 (NP → N) | HIGH |
| 3 | WRONG_STATUS | Ludi Apollinares chief day, Day 13 (NP → C) | HIGH |
| 4 | MISSING_FESTIVAL | Vitulatio, Day 8 | HIGH |
| 5 | WRONG_STATUS | Kalendae Iuliae, Day 1 (NP → N) | MEDIUM |
| 6 | WRONG_DEITY | Kalendae Iuliae, Day 1 (Juno only → Juno + Felicitas) | MEDIUM |
| 7 | WRONG_DEITY | Honori, Day 17 (Honos only → Honos et Virtus) | MEDIUM |
| 8 | WRONG_RITUAL | Dies Alliensis, Day 18 (omits defeat of Fabii on Cremera) | MEDIUM |
| 9 | INVENTED_AITION | Lucaria, Day 19 (aetiological legend presented as fact) | MEDIUM |
| 10 | WRONG_RITUAL | Poplifugia, Day 5 (one dismissed aition presented as fact) | MEDIUM |
| 11 | MISSING_FESTIVAL | Fortunae Muliebri, Day 6 | MEDIUM |
| 12 | MISSING_FESTIVAL | Consus in Circo, Day 7 | MEDIUM |
| 13 | MISSING_FESTIVAL | Victoriae in Capitolio, Day 17 | MEDIUM |
| 14 | MISSING_FESTIVAL | Ludi Victoriae Caesaris, Days 20–30 | MEDIUM |
| 15 | MISSING_FESTIVAL | Palibus duobus (second Parilia), Day 7 | LOW |
| 16 | MINOR | Lucaria status (NP vs IP — sources disagree) | LOW |
| 17 | MINOR | Neptunalia — Salacia as consort not listed | LOW |
| 18 | MINOR | Concordia (Day 22) — "otra fundación" phrasing | LOW |

**Counts by category**:
- WRONG_DATE: 1
- WRONG_STATUS: 3
- WRONG_DEITY: 2
- WRONG_RITUAL: 2
- INVENTED_AITION: 1
- MISSING_FESTIVAL: 6
- MINOR: 3

**Total findings**: 18

**Most critical fixes** (should be applied before next release):
1. Move Furrinalia from July 24 to July 25.
2. Correct Nonae Caprotinae status from NP to N.
3. Correct Ludi Apollinares chief day (July 13) status from NP to C.
4. Add Vitulatio entry for July 8.
5. Revise Lucaria (July 19) festivalDesc to remove the presented-as-fact aetiological legend.

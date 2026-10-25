# October — Roman Calendar Review
**App data**: `utils/romanYearData.ts`, keys `"9-1"` – `"9-31"`
**Sources**: Scullard (1981) pp. 189–198; Fowler (1899) pp. 238–251 (printed)
**Date of review**: 2026-10-25

---

## WRONG_STATUS: Fidei in Capitolio / Day 1

- **App**: key "9-1" | status=NP | festivalName="Ritos a Fides / Tigillum Sororium" | deity="Fides"
- **Source**: Scullard p. 189–190 — "Fidei in Capitolio | Fasti status: N". The N (Nefas) designation indicates a day forbidden for legal proceedings; NP (Nefas Publicus) is a stronger, formally sacred designation. These are distinct categories in the fasti.
- **Issue**: App gives NP, but Scullard records the Kalends of October as N. NP is reserved for the major public sacral festivals (Agonalia, Parilia, Lupercalia etc.); the Kalends of October held a less emphatic N.
- **Fix**: Change `status` to `'N'` and `statusFull` to `"Kalendae (N)"` (or `"Kalendae Octobres"` with a note that the day is N, not NP).
- **Priority**: MEDIUM

---

## WRONG_DEITY: Oct 1 — Tigillum Sororium deities suppressed

- **App**: key "9-1" | deity="Fides" | festivalName="Ritos a Fides / Tigillum Sororium"
- **Source**: Scullard p. 190 — the Tigillum Sororium rite on 1 October honored **Janus Curiatius** and **Juno Sororia** (two altars at the beam). Fowler pp. 238–239 confirms: "Janus Curiatius; Juno Sororia." Both sources treat this as a separate and distinct cult from the Fides ceremony, with different participants (pontiffs; those undergoing passage rites) and different location (Compitum Acili on the Oppian slope, not the Capitol).
- **Issue**: The app merges two independent 1 October rites into a single entry and names only "Fides" as the deity, erasing the Tigillum's pair Janus Curiatius / Juno Sororia. The `festivalDesc` then refers to "viga purificatoria" (the beam) — a Tigillum detail — but assigns it to Fides, which is entirely wrong. Fides had her own separate temple on the Capitol and her own distinct rite (flamines in hooded carriage, hands wrapped).
- **Fix**: Either (a) split into two entries with a shared day or (b) give a combined `deity` field: "Fides / Jano Curiacio / Juno Sororia" and rewrite `festivalDesc` to describe each rite clearly and separately: the Fides ceremony (flamines, wrapped hands) and the Tigillum rite (passage under the beam, expiation). Option (a) is architecturally cleaner if the data model supports multiple events per day.
- **Priority**: HIGH

---

## WRONG_DEITY + INVENTED_AITION: Iovi Fulguri, Iunoni Curitis in Campo / Day 7

- **App**: key "9-7" | status=F | festivalName="Ritos a Júpiter" | deity="Júpiter Fulgur / Juno" | festivalDesc="Día tradicional de apaciguamiento estacional al dios de los rayos."
- **Source**: Scullard p. 191 — festival name is "Iovi Fulguri, Iunoni Quiriti (Iunoni Curriti in Campo)"; the specific epithet is **Juno Curitis** (or Curitis), the goddess of Falerii, whose introduction to Rome may derive from the capture of Falerii in 241 BC. Fowler p. 239 confirms "Iuno Curitis" and adds: "Of these worships in Rome nothing else is known."
- **Issue (deity)**: App says "Juno" (generic). Both sources are clear the deity is the specific Iuno Curitis (also written Curitis), a distinct aspect associated with Falerii, not a generic Juno. The epithet carries cultic significance (possible connection with the curiae or a Faliscan origin) that should not be erased.
- **Issue (invented aition)**: festivalDesc gives "apaciguamiento estacional al dios de los rayos" (seasonal appeasement of the god of lightning). Neither Scullard nor Fowler states any seasonal-appeasement purpose or any ritual detail at all for this day in Rome. Fowler explicitly says nothing else is known. This description is an inference not supported by the sources.
- **Fix (deity)**: Change `deity` to `"Júpiter Fulgur / Juno Curitis"` and `deityDesc` to something like "Dios del rayo diurno / diosa de Falerii y las curias."
- **Fix (aition)**: Rewrite `festivalDesc` to: "Ritos en el Campo Marte en honor a Júpiter Fulgur (rayo diurno) y Juno Curitis. El culto de Juno Curitis pudo llegar a Roma desde Falerii. De los ritos no se conserva descripción." Remove the seasonal-appeasement claim entirely.
- **Priority**: HIGH (deity fix); MEDIUM (aition fix)

---

## WRONG_DEITY: Genio Publico, Faustae Felicitati, Veneri Victrici / Day 9

- **App**: key "9-9" | status=C | festivalName="Dedicación y Juegos" | deity="Genius Publicus" | festivalDesc="Celebración del aniversario de los Genios protectores del pueblo, entrelazada con Ludi."
- **Source**: Scullard p. 191 — the calendar entry is **"Genio Publico, Faustae Felicitati, Veneri Victrici in Capitolio"**: three distinct divine recipients — Genius Publicus, Fausta Felicitas, and Venus Victrix — honored at ceremonies on the Capitol on this day.
- **Issue**: App lists only Genius Publicus, omitting Fausta Felicitas and Venus Victrix. The festivalDesc references "Genios" (plural, implying only the genius cluster) and mentions "Ludi" which Scullard does not associate with this day. The festivalName "Dedicación y Juegos" is vague and unsourced.
- **Fix**: Change `deity` to `"Genius Publicus / Fausta Felicitas / Venus Victrix"`, `deityDesc` to `"El Genio del pueblo romano, la diosa de la buena fortuna, y Venus Victoriosa."` Change `festivalName` to `"Genio Publico, Faustae Felicitati, Veneri Victrici"`. Remove reference to Ludi in `festivalDesc`; Scullard says nothing about games on this day. `festivalDesc` example: "Ceremonias en el Capitolio en honor a tres divinidades: el Genius Publicus (also attested with a temple near Concordia, 43 a.C.), Fausta Felicitas (possibly same temple as the July 1 dedication), y Venus Victrix (templo de Pompeyo)."
- **Priority**: HIGH

---

## WRONG_RITUAL: Iunoni Monetae / Day 10

- **App**: key "9-10" | status=C | festivalName="Ludi Augustales" | deity="Juno Moneta" | festivalDesc="Continuación de juegos, así como conmemoración de templos atávicos."
- **Source**: Scullard p. 191–192 — the calendar has a distinct named entry for 10 October: **"Iunoni Monetae"**, commemorating a restoration of the Temple of Juno Moneta (original dedication 1 June).
- **Issue**: The app correctly identifies the deity as Juno Moneta but suppresses the festival name under the running Ludi Augustales. "Iunoni Monetae" is a genuine independent calendar entry on this day; calling it "Ludi Augustales" erases the named event. The `festivalDesc` ("templos atávicos") alludes to it but vaguely and without sourcing.
- **Fix**: Change `festivalName` to `"Iunoni Monetae"`. Change `festivalDesc` to: "Conmemoración de la restauración del Templo de Juno Moneta en el Capitolio. La dedicación original del templo databa del 1 de junio; este día marca su restauración posterior." If the Ludi Augustales overlap must be noted, add parenthetically.
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Penatibus in Velia / Day 14

- **App**: key "9-14" | status=EN | no festivalName | deity="Ninguna"
- **Source**: Scullard p. 193 — 14 October is explicitly listed as **EN** with a named festival: **"[...]Penatibus in Velia"** — the Temple of the Penates Dei on the Velia. Mentioned in the Sacrifices of the Argei, by Livy, and by Obsequens. Augustus restored or rebuilt it. The date 14 October may refer to the Augustan restoration rather than the original dedication.
- **Issue**: The app has the correct status (EN) but no festivalName or festivalDesc. A named calendar entry exists for this day that the app omits entirely.
- **Fix**: Add the following fields to "9-14":

  ```
  deity: "Penates Dei",
  deityDesc: "Dioses Penates del pueblo romano.",
  festivalName: "Penatibus in Velia",
  festivalDesc: "Aniversario del Templo de los Penates Dei en la Velia, restaurado por Augusto. Citado en los Sacrificios de los Argeos, en Livio y en Obsecuente. Su posible emplazamiento bajo SS. Cosma e Damiano es incierto."
  ```

- **Priority**: MEDIUM

---

## WRONG_RITUAL: Equus October / Day 15

- **App**: key "9-15" | status=NP | festivalName="Equus October" | deity="Marte" | festivalDesc="Carrera de carros solemne final de la temporada bélica. El caballo ganador a la derecha era purificado y sacrificado al dios Marte en el Campo."
- **Source**: Scullard p. 193–195 — the horse was **sacrificed** (killed with a spear by the flamen Martialis); the word "purified" (purificado) is absent from the rite. The ceremony also included: (1) the horse's head decorated with cakes; (2) a struggle between inhabitants of Via Sacra and the Suburra for possession of the head; (3) the tail rushed to the Regia so blood dripped on the sacred hearth; (4) Vestal Virgins preserving the blood for use at the Parilia. Fowler pp. 241–250 devotes nine pages to this rite and confirms all these elements. The festivalDesc in the app omits the head-contest, the blood-to-Regia episode, and the Parilia connection entirely.
- **Note on left vs. right horse**: Scullard says "right-hand horse"; Fowler says "near (left) horse" — a genuine scholarly discrepancy. The app follows Scullard ("a la derecha"), which is a defensible position but the dispute should be noted.
- **Issue**: The term "purificado" is not supported by either source — the horse was slaughtered (sacrificed), not purified. The Armilustrium on Oct 19 is the purification rite; the Oct 15 horse is a sacrifice. Additionally, the festivalDesc suppresses the most distinctive elements of the ritual (the head-fight, the blood-rush to the Regia, the Vestal connection to Parilia).
- **Fix**: Remove "purificado y". Expand `festivalDesc` to include the head-fight between Via Sacra and Suburra residents, the blood on the Regia hearth, and the Parilia connection. Example: "Carrera de carros en el Campo de Marte que cerraba la temporada bélica. El caballo derecho del par victorioso era sacrificado con una lanza por el flamen Martialis. La cabeza, adornada con tortas, era disputada entre vecinos de la Vía Sacra y la Subura; si ganaban los de la Vía Sacra, se clavaba en la Regia; si los de la Subura, en la Turris Mamilia. La cola, aún sangrante, se llevaba a toda prisa a la Regia para que la sangre cayera sobre el hogar sagrado. Las Vestales guardaban parte de la sangre cuajada para los ritos de la Parilia (21 de abril)."
- **Priority**: HIGH (removal of "purificado"); MEDIUM (expansion of festivalDesc)

---

## MISSING_FESTIVAL: Ludi Capitolini / Day 15

- **App**: key "9-15" — no mention of Ludi Capitolini
- **Source**: Scullard p. 194–195 — the **Ludi Capitolini** (private games by the College of Capitolini) were held around 15 October. Not in the official calendars (private, not public games). Included athletic contests and a ceremony in which a herald proclaimed "Sardians are for sale" while an old man wearing a child's bulla was led about in mockery (Plutarch). Attributed to Romulus or Camillus; if pre-Republican, originally in honor of Jupiter Feretrius.
- **Issue**: The app has no mention of these games. Since they are not in the official calendars, absence is defensible; however, their historical attestation (Cicero, Plutarch, Tertullian) is substantial enough that a note is warranted.
- **Fix** (suggested addition to festivalDesc of "9-15" or as a note):
  "También en torno a esta fecha, el Colegio de los Capitolini celebraba los Ludi Capitolini (juegos privados, no incluidos en el calendario oficial): combates de pugilato, carreras, y una proclama ritual ('Se venden sardos') mientras un anciano con bula infantil era paseado en broma. Su origen se atribuye a Rómulo o a Camilo."
- **Priority**: LOW (not in official calendars; a note rather than a standalone entry)

---

## MINOR: Mundus Patet / Day 5

- **App**: key "9-5" | status=C | deity="Augusto / Manes" | festivalName="Ludi Augustales / Mundus Patet"
- **Source**: Scullard p. 191 — Mundus patet, status C (Dies religiosus), **deity not stated**. Fowler p. 239 — deity not stated.
- **Issue**: The deity field "Augusto / Manes" conflates the Ludi Augustales (honoring divus Augustus, a separate institution) with the Mundus Patet (no deity specified in either source). Neither Scullard nor Fowler names "Manes" as the deity of the mundus opening; the association of the mundus with the Manes appears in Varro and Macrobius but is not part of either source's treatment of 5 October specifically. The festivalDesc phrase "los espíritus de los muertos vagan libremente por la ciudad" is an embellishment beyond what Scullard states here.
- **Fix**: Separate the Mundus Patet entry from the Ludi Augustales, or at minimum adjust `deity` so that the Mundus element is listed without a deity ("no determinado") and Ludi Augustales specifies Augustus. Consider shortening `festivalDesc` to what the sources actually say about this day.
- **Priority**: MINOR

---

## MINOR: Armilustrium — "legiones" anachronism / Day 19

- **App**: key "9-19" | festivalDesc="Las armas de las legiones eran purificadas y devueltas a depósito de forma sagrada."
- **Source**: Scullard p. 195–196 — "the arma (weapons) and ancilia (sacred shields) were purified and put away." The ancilia are the sacred shields of the Salii (not legionary equipment). Fowler p. 250–251 — "The arms (arma) and sacred shields (ancilia) were purified (lustrata) and put away for the winter." The Salii performed sacred rites in arms while sounding trumpets.
- **Issue**: Saying "armas de las legiones" (arms of the legions) conflates the ritual arms-purification performed by the Salii (using the ancilia, holy objects kept at the Regia) with a legionary arms-stockpiling rite. The Armilustrium was a Salian ceremony on the Aventine, not a legionary logistics operation.
- **Fix**: Change `festivalDesc` to: "Clausura de la temporada militar. Los sacerdotes Salios danzaban armados, sonaban las tubae durante el sacrificio, y las armas sagradas (arma y ancilia) eran purificadas y guardadas hasta la primavera siguiente. El lustratio se realizaba en el Aventino, posiblemente última estación de la procesión Salia."
- **Priority**: MINOR

---

## MINOR: Ludi Victoriae Sullanae — Oct 31 description / Day 31

- **App**: key "9-31" | festivalDesc="Último día natural del mes durante los juegos del dictador romano."
- **Source**: Scullard p. 196 — the Ludi Victoriae Sullanae ran 26 October–**1 November**, "culminated in Circenses on 1 November (the date of the battle)." The app's "10-1" entry correctly carries the games into November 1 as "Ludi Sullanae."
- **Issue**: The Oct 31 entry describes itself as "Último día natural del mes" (last natural day of the month), implying the games end here. But they continue into and culminate on 1 November. This description is misleading.
- **Fix**: Change `festivalDesc` for "9-31" to: "Penúltimo día de los juegos conmemorativos de la victoria de Sila en la Puerta Collina (82 a.C.). Los juegos se prolongaban hasta el 1 de noviembre, fecha de la batalla." Remove "último día natural del mes."
- **Priority**: MINOR

---

## Summary

| Category | Count | Days affected |
|----------|-------|---------------|
| WRONG_STATUS | 1 | 1 |
| WRONG_DEITY | 3 | 1, 7, 9 |
| WRONG_RITUAL | 2 | 10, 15 |
| INVENTED_AITION | 1 | 7 |
| MISSING_FESTIVAL | 2 | 14, 15 (Ludi Capitolini) |
| MINOR | 4 | 5, 19, 31 (+deity conflation Oct 1) |
| **Total** | **13** | |

**Priority breakdown**:
- HIGH (fix before shipping): Oct 1 (Tigillum deity suppressed), Oct 7 (Juno Curitis; invented aition), Oct 9 (two deities omitted), Oct 15 ("purificado" unsupported).
- MEDIUM: Oct 1 (status N vs NP), Oct 10 (Iunoni Monetae eclipsed by Ludi Augustales label), Oct 14 (missing Penates festival), Oct 15 (festivalDesc very sparse).
- LOW: Oct 15 Ludi Capitolini note, Oct 5 deity conflation, Oct 19 "legiones," Oct 31 description.

**Structurally sound entries**: Oct 4 (Ieiunium Cereris), Oct 11 (Meditrinalia), Oct 13 (Fontinalia), Oct 19 (Armilustrium — correct name/status/deity, only MINOR ritual wording), Oct 26–30 (Ludi Victoriae Sullanae, all C with correct deity Victoria).

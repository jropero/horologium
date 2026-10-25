# Ianuarius — App vs. Sources Review
**Date**: 2026-10-25
**Sources consulted**:
- Scullard, H.H. *Festivals and Ceremonies of the Roman Republic* (Thames & Hudson, 1981), pp. 51–70
- Fowler, W.W. *The Roman Festivals of the Period of the Republic* (Macmillan, 1899), pp. 278–307
**App data**: `utils/romanYearData.ts`, keys "0-1" through "0-31"

---

## WRONG_DEITY: Kalendae Ianuariae / Vota Publica — Day 1

- **App**: key "0-1" | status=F | festivalName="Kalendae Ianuariae" | deity="Jano / Juno"
- **Source**: Scullard pp. 52–55: the principal ceremony of 1 January is the *Vota Publica* — consuls sacrifice a **white bull to Jupiter Optimus Maximus** on the Capitol and proclaim new public vows for the safety of the state (*vota pro salute rei publicae*). Jupiter OMax is the explicit and sole recipient of the vows. Janus is god of the month and of beginnings generally but is not named as the deity of this ceremony. Fowler pp. 278–279 corroborates: he discusses Vediovis and Aesculapius on the island on Jan 1 but gives the consular ceremony to Jupiter OMax.
- **Issue**: The app assigns "Jano / Juno" as deities for this entry and the festivalDesc opens "Celebración del Año Nuevo romano dedicada a Jano." Both sources make clear that the *Vota Publica* — the defining public rite of 1 January — was directed to Jupiter Optimus Maximus, not Janus. Juno's presence on the Kalends is standard (she is patroness of all Kalends) but is not specific to this festival's content. Attributing the ceremony to Janus misidentifies the primary cult recipient.
- **Fix**: `deity: "Júpiter Óptimo Máximo"`, `deityDesc: "Dios supremo del Estado romano, receptor de los votos públicos anuales."`. Revise `festivalDesc` to: "El primer día del año los cónsules entrantes ofrecían un toro blanco a Júpiter Óptimo Máximo en el Capitolio y proclamaban votos públicos por la seguridad del Estado (*vota publica*). Desfilaban desde sus casas hasta el templo del Capitolio escoltados por el Senado, sentados en las *sellae curules* recibían la aclamación popular, y abrían el año convocando el Senado."
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Dedicatio Aesculapii et Vediovis in Insula — Day 1

- **App**: key "0-1" — no reference to Aesculapius or Vediovis.
- **Source**: Scullard pp. 54–58: On 1 January, two temples on the Tiber Island (south tip, near modern S. Bartolomeo) had their *dies natalis* — the temple of Aesculapius (dedicated 1 January 291 BC) and the island temple of Vediovis (dedicated 1 January 194 BC). Both calendars record this: *Aesculapio, Vediovi in Insula* (Praen.). The Aesculapius cult included incubation healing; its founding myth (plague → Sibylline Books → sacred snake from Epidaurus → island) is narrated by Ovid (*Met.* and *Fasti* 1.289ff). Fowler p. 278–279 corroborates: he leads the January entry with the Vediovis/Aesculapius dedication on the island.
- **Issue**: A double temple dedication attested in multiple calendars and discussed at length by both sources is entirely absent from the app's January 1 entry.
- **Fix**: Add to "0-1" festivalDesc or create a secondary note. Since the app has one entry per day, append to the existing festivalDesc: "También el 1 de enero se conmemoraba la dedicación de los templos de Esculapio (291 a.C.) y Vediovis (194 a.C.) en la Isla Tiberina. El culto de Esculapio incluía la incubación: los enfermos dormían en el templo buscando sueños curativos divinos." Consider expanding `deity` to include Aesculapius and Vediovis or creating a `festivalName2` field pattern already used elsewhere.

  Suggested standalone entry pattern if the data model is ever extended to support multiple events per day:
  ```typescript
  "0-1-b": {
    status: 'F',
    statusFull: "Dies Fastus",
    deity: "Esculapio / Vediovis",
    deityDesc: "Dios de la medicina y deidad arcaica itálica.",
    festivalName: "Dedicación del Templo de Esculapio y Vediovis en la Isla Tiberina",
    festivalDesc: "Aniversario doble: el templo de Esculapio (dedicado el 1 de enero de 291 a.C.) y el templo de Vediovis (1 de enero de 194 a.C.), ambos en la Isla Tiberina. El culto de Esculapio, traído de Epidauro según mandato de los Libros Sibilinos durante una plaga, incluía la incubación. El sacrificio a Vediovis era una cabra inmolada *humano ritu* (Aulo Gelio)."
  }
  ```
- **Priority**: HIGH

---

## WRONG_RITUAL: Compitalia — Days 3–4

- **App**: key "0-3" | status=C | festivalName="Compitalia (fecha probable)" | festivalDesc="Fiesta móvil (feriae conceptivae) tradicionalmente celebrada a principios de enero en los cruces de los caminos." // key "0-4" | status=C | festivalName="Compitalia" | festivalDesc="Continuación de las festividades en honor a los Lares."
- **Source**: Scullard pp. 59–60: Compitalia was *feriae conceptivae* (moveable), but in Cicero's day it was celebrated **on a single day**. The Philocalus calendar places the *Ludi Compitales* on Jan 3–5 (later Empire), but even then as a brief span — not a multi-day continuous festival. Scullard's praetor's formula cited from Aulus Gellius announces it as a single day event (*'Die noni populo Romano Quiritibus Compitalia erunt'*). Fowler p. 279–281 likewise treats it as a single-day ceremony.
- **Issue**: The app gives Compitalia two consecutive days (0-3 and 0-4), with 0-4 described as "Continuación de las festividades." No source supports a two-day format. The second day entry is fabricated.
- **Fix**: Retain only "0-3" with corrected festivalDesc. Remove festivalName and deity from "0-4" (or set deity to "Ninguna" and remove festivalName). Revised festivalDesc for 0-3: "Fiesta móvil (*feriae conceptivae*) celebrada en los cruces de caminos (*compita*) a principios de enero. La víspera se colgaban muñecos de lana por cada libre del hogar y bolas por cada esclavo. El *vilicus* sacrificaba cerdos engordados; cada familia contribuía una torta de miel. Los esclavos participaban con inusual libertad. Augusto la reorganizó vinculando los *Lares Compitales* al *Genius Augusti*."
- **Priority**: MEDIUM

---

## WRONG_DEITY + MINOR: Carmentalia / Juturnalia — Day 11

- **App**: key "0-11" | status=NP | festivalName="Carmentalia / Juturnalia" | deity="Carmenta / Juturna" | deityDesc="Diosa del parto y ninfa de las fuentes."
- **Source**: Scullard pp. 62–65: Carmentalia (Day 11) and Iuturnae/Juturnalia (Day 11) are **two separate festivals** with distinct cult sites, participants, and ritual purposes. Carmentalia: deity = Carmentis; the *flamen Carmentalis* officiated; participants were primarily women; site = shrine at the Porta Carmentalis; leather (*scortea*) excluded from the shrine. Juturnalia: deity = Juturna; worshippers = those whose work involved water (*qui artificum aqua exercent*); site = Campus Martius temple (and the *Lacus Iuturnae* in the Forum). Fowler p. 290–293 similarly treats them as distinct, noting that the Juturnalia is the dedication day of Augustus' temple (possibly not an ancient rite in the strict sense).
- **Issue 1**: Listing both deities as "Carmenta / Juturna" for a single combined festival entry conflates two structurally distinct cults. They had different priests, different participants, and different sacred spaces.
- **Issue 2**: The `deityDesc` "Diosa del parto y ninfa de las fuentes" splices together Carmenta's domain (childbirth/prophecy) with Juturna's (a nymph of springs). The composite description makes neither deity accurately identifiable.
- **Fix**: Split into primary entry for Carmentalia and a secondary note for Juturnalia:
  - `deity: "Carmenta"`, `deityDesc: "Diosa de los partos y la profecía, patrona de las matronas."`, `festivalName: "Carmentalia"`.
  - Add to festivalDesc: "El *flamen Carmentalis* presidía el culto; todo objeto de cuero (*scortea*) quedaba excluido del santuario. Las matronas veneraban a Carmenta en su templo junto a la Porta Carmentalis. Ese mismo día el templo de Juturna en el Campo de Marte celebraba su fiesta (*Juturnalia*), frecuentada por quienes trabajaban con el agua."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Juturnalia as distinct festival — Day 11

- **App**: key "0-11" — Juturna is mentioned only as a co-deity alongside Carmenta in a blended entry.
- **Source**: Scullard pp. 64–65: Juturnalia is attested in the Fasti Antiates Maiores as a distinct *NP* day alongside Carmentalia; it had its own Campus Martius temple, its own constituency (water-workers), and its own cult site (Lacus Iuturnae). Ovid explicitly records 11 January as Juturna's cult day. The *statio aquarum* (water department) had its headquarters adjacent to her shrine by the 4th century AD.
- **Issue**: Juturnalia is treated as a footnote inside Carmentalia. It had no ritual overlap with Carmentalia — different deity, different worshippers, different venue. It deserves either its own entry or a clearly demarcated description within "0-11" that does not fuse the two festivals.
- **Fix**: If the data model allows only one entry per day, restructure "0-11" with Carmenta as primary and include a clearly labelled paragraph on the Juturnalia. Alternatively, mark this as a known data-model limitation and add a tracking note for when multi-event days are supported.
- **Priority**: LOW

---

## WRONG_RITUAL + WRONG_DEITY: Feriae Sementivae — Days 24–26

- **App**: key "0-24" | deity="Ceres y Tellus" | festivalDesc="Fiesta agrícola móvil de la siembra celebrada habitualmente a finales de enero..." // key "0-25" | deity="Ceres y Tellus" | festivalDesc="Continuación de los ritos agrícolas de la siembra." // key "0-26" | deity="Ceres y Tellus" | festivalDesc="Finalización de los ritos de bendición de las semillas."
- **Source**: Scullard pp. 68–69: Sementivae was *feriae conceptivae* held on **two non-consecutive days with a seven-day interval** between them. Day 1 (Ovid dates ~24 January): sacrifices to **Tellus alone** (pregnant sow + spelt cake). Day 2 (seven days later, ~31 January): sacrifices to **Ceres alone**. The two deities did not receive joint worship on the same day. Fowler pp. 294–296 corroborates: he explicitly cites Lydus on the two days separated by seven (*una per Tellurem, altera per Cererem*) and identifies each deity as sole recipient on her respective day.
- **Issue 1 (WRONG_RITUAL)**: The app presents Sementivae as three **consecutive** days (24, 25, 26), with day 25 as "Continuación" and day 26 as "Finalización." Both sources are unambiguous: two non-consecutive days, seven days apart, not three consecutive days and not a continuous three-day festival.
- **Issue 2 (WRONG_DEITY)**: All three app entries assign "Ceres y Tellus" jointly. Sources insist each goddess had her own separate day: Tellus on day 1, Ceres on day 2. There was no joint ceremony.
- **Fix**: Reduce to two entries. Keep "0-24" for Tellus' day; change "0-26" to blank/standard C day; make "0-31" (or wherever a second placeholder falls approximately 7 days later within the same calendar slot) the Ceres day. Or, since both days are moveable, note the structure in a single entry:
  - "0-24": `deity: "Tellus"`, `deityDesc: "Diosa de la tierra madre."`, festivalDesc: "Primera jornada de las Sementivas (*Feriae Sementivae / Paganalia*), fiesta móvil de la siembra. Se sacrificaba una cerda preñada y una torta de espelta a Tellus. Los bueyes del arado eran engalanados con guirnaldas; se rogaba protección para la semilla frente a pájaros, bestias y enfermedades. La segunda jornada, consagrada a Ceres, se celebraba siete días después."
  - Remove festivalName and deity from "0-25" and "0-26".
- **Priority**: HIGH

---

## MINOR: Vota Publica — Ritual Detail Insufficient (Day 1)

- **App**: key "0-1" | festivalDesc="...los nuevos cónsules asumían su cargo y se realizaban votos públicos por el estado."
- **Source**: Scullard pp. 52–55: The Vota Publica ceremony was elaborate — auspices at dawn; purple-bordered toga (*praetexta*); formal *salutatio* by senators; procession up the Capitoline; ivory chairs (*sellae curules*); white bull sacrifice per consul; proclamation of new vows; convening of the Senate. Within five days the consuls had to swear to obey the laws before the quaestors in Saturn's temple.
- **Issue**: The description is not wrong, but it omits the defining ritual element (white bull sacrifice to Jupiter OMax) and implies the ceremony was "dedicated to Janus." Correcting the deity (see WRONG_DEITY finding above) also corrects the implication.
- **Fix**: Incorporate into the deity fix above. No separate change needed once deity is corrected.
- **Priority**: LOW

---

## Summary

| Category | Count | Findings |
|---|---|---|
| WRONG_DEITY | 3 | Day 1 (Vota Publica → Jupiter OMax not Janus/Juno); Day 11 (Carmenta/Juturna conflation); Days 24–26 (Tellus and Ceres separate days, not jointly) |
| WRONG_RITUAL | 2 | Days 3–4 (Compitalia is 1 day, not 2 consecutive); Days 24–26 (Sementivae is 2 non-consecutive days 7 apart, not 3 consecutive) |
| MISSING_FESTIVAL | 2 | Day 1 (Dedicatio Aesculapii et Vediovis in Insula); Day 11 (Juturnalia as structurally distinct from Carmentalia) |
| MINOR | 1 | Day 1 ritual detail (addressed by deity fix) |
| **TOTAL** | **8** | |

**Priority distribution**: 3 HIGH · 2 MEDIUM · 3 LOW

**Days with no findings** (sources silent or app correct): 2, 6, 7, 8, 10, 12, 13, 14, 15, 16, 17–23, 27, 28, 29, 30, 31.

**Notes on Jan 16 (Concordia) and Jan 30 (Ara Pacis)**: Neither Scullard nor Fowler covers these temple anniversaries for January. They are attested in the calendrical record but outside the scope of these two sources; they cannot be confirmed or denied from the present review. The Ara Pacis dedication date of 30 January 9 BCE is historically correct (Res Gestae 12).

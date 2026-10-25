# Iunius — Roman Festival Review
**App data key prefix**: `"5-"` (month index 5 = June, 0-based)
**Sources cross-referenced**:
- H. H. Scullard, *Festivals and Ceremonies of the Roman Republic* (1981), pp. 127–158
- W. Warde Fowler, *The Roman Festivals of the Period of the Republic* (1899), pp. 129–173

**Reviewer note**: Scullard's fasti-status summary (end of chapter) lists: N = days 1, 5, 7, 8, 9 June; NP = day 13; C = days 3, 4, 19, 20, 24, 25–26, 27, 29; Q.ST.D.F. = day 15; day 11 is N? (uncertain in Scullard, N in Fowler).

---

## WRONG_STATUS: Kalendae Iuniae / Day 1

- **App**: key "5-1" | status=`NP` | statusFull="Kalendae" | festivalName="Kalendae Fabariae" | deity="Carna / Juno Moneta"
- **Source**: Scullard p. 127: fasti status **N** (nefastus). Fowler p. 129: fasti status **N**. Both sources agree: 1 June is N, not NP.
- **Issue**: App records status `NP` (nefas piaculum, a fully blocked day requiring expiation). The correct status is `N` (nefastus — lawcourts cannot sit but routine private acts are permitted). NP is a stronger category reserved for days like the Lemuria, the Parentalia, etc.
- **Fix**: `status: 'N'`, `statusFull: "Kalendae Fabariae"` (or retain "Kalendae" with an added note; the popular name Kalendae Fabariae is attested and meaningful).
- **Priority**: HIGH

---

## WRONG_STATUS: Nonae Iuniae / Day 5

- **App**: key "5-5" | status=`F` | statusFull="Nonae" | festivalName="Dedicación del Templo de Dius Fidius" | deity="Semo Sancus Dius Fidius"
- **Source**: Scullard pp. 147–148: fasti status **N** (nefastus). Fowler p. 135: fasti status **N**. Both list 5 June explicitly in the N column.
- **Issue**: App marks the Nones of June as `F` (fastus — a full business day). The Nones of June were nefastus, not fastus. The day has a temple dedication (Semo Sancus, 466 BC) but that does not change the inherited calendar status to F.
- **Fix**: `status: 'N'`, `statusFull: "Nonae Iuniae"`.
- **Priority**: HIGH

---

## WRONG_STATUS: Vestalia / Day 9

- **App**: key "5-9" | status=`NP` | statusFull="Vestalia" | festivalName="Vestalia" | deity="Vesta"
- **Source**: Scullard pp. 149–150: fasti status **N** (nefastus), dies religiosus. Fowler pp. 146–154: status **N**. Scullard's chapter-end table lists 9 June as N, not NP.
- **Issue**: App assigns `NP` to the Vestalia. The Vestalia belongs to the *religiosi* series (7–15 June) where the status is N, not NP. NP days are those that are fully forbidden (Parentalia, Lemuria); the Vestalia is nefastus but not of that category.
- **Fix**: `status: 'N'`.
- **Priority**: HIGH

---

## WRONG_STATUS: Matralia / Day 11

- **App**: key "5-11" | status=`NP` | statusFull="Matralia" | festivalName="Matralia" | deity="Mater Matuta"
- **Source**: Scullard pp. 150–152: fasti status **N?** (uncertain, probably N). Fowler pp. 154–157: fasti status **N**. Neither source gives NP.
- **Issue**: App assigns `NP`. Both sources indicate N (or N?, with Scullard uncertain). The Matralia is a dies religiosus in the Vestalia period, sharing N with the surrounding days; there is no evidence it was NP.
- **Fix**: `status: 'N'`.
- **Priority**: HIGH

---

## WRONG_DEITY: Ludi Piscatorii / Day 7

- **App**: key "5-7" | status=`N` | festivalName="Ludi Piscatorii" | deity="Tiberinus" | deityDesc="Dios del río Tíber."
- **Source**: Scullard p. 148: "the fishermen's catch was not taken to the market but to the *Area Volcani* (Volcanal in the Roman Forum) — live fish given to **Vulcan** as substitutes for human souls." The deity receiving the ritual offering is **Vulcan**, not Tiberinus. The Tiber is the location (and fishermen's livelihood), not the recipient deity.
- **Issue**: The app assigns Tiberinus as the deity, but the defining ritual act — live fish taken to the Area Volcani — is a sacrifice to Vulcan. Tiberinus is nowhere named by Scullard as receiving the sacrifice.
- **Fix**: `deity: "Vulcanus"`, `deityDesc: "Dios del fuego y la forja. Los pescadores le ofrecían sus capturas vivas como sustitutos de las almas humanas."`, and update `festivalDesc` to include the substitution logic: fish given live to the Volcanal (Area Volcani) so that Vulcan spares those easily harmed by fire.
- **Priority**: HIGH

---

## WRONG_RITUAL: Vestalia / Day 9 (description error)

- **App**: key "5-9" | festivalDesc="Comienza la principal purificación de la casa de Vesta. Los burros de los panaderos eran adornados con panes y coronas."
- **Source**: Scullard p. 148: "The inner sanctum (*penus*) of the temple of Vesta was **opened** [on 7 June] … and remained open until 15 June." Fowler pp. 146–147: "*Vesta aperit* [7 June]." The opening of the penus and the beginning of the religious period are on **7 June**, not 9 June.
- **Issue**: festivalDesc says "Comienza la principal purificación" — implying the festival starts on day 9. In fact the penus opened on 7 June (Vesta aperitur), two days earlier. 9 June is the Vestalia's principal feast day, not the day the purification begins.
- **Fix**: festivalDesc should read something like: "Día principal de la Vestalia. Las matronas visitaban descalzas el santuario de Vesta (abierto desde el 7 de junio) con ofrendas sencillas. Las Vestales preparaban la mola salsa con espigas recogidas en mayo. Los panaderos y molineros festejaban: sus asnos, coronados de violetas y panes, descansaban este día."
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Quando Stercum Delatum Fas / Day 15

- **App**: key "5-15" | festivalDesc="Fin oficial de la limpieza del Penus Vestae. Las **cenizas** purgadas eran arrastradas al Tíber o a lugares sagrados."
- **Source**: Scullard p. 153: "the temple of Vesta was swept clean (*stercus* = the accumulated **dirt/rubbish**), the dirt carried to the *porta stercoria* … and then carried down to the Tiber." Fowler p. 153: "the *penus* was swept and the sweepings thrown into the Tiber."
- **Issue**: festivalDesc uses "cenizas" (ashes), but what was swept out was *stercus* — the general accumulated floor-sweepings, rubbish, and refuse from the temple, not ashes. "Cenizas purgadas" mischaracterises the material and the ritual's nature.
- **Fix**: `festivalDesc`: "Fin oficial del período de la Vestalia (*Quando Stercum Delatum Fas*). Las Vestales barrían el *penus* y el *stercus* (la suciedad acumulada) era llevado a la *porta stercoria* y arrojado al Tíber. Solo entonces el día se volvía lícito (*fas*) y podían reanudarse los negocios públicos."
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Quando Stercum Delatum Fas — status approximation / Day 15

- **App**: key "5-15" | status=`NP` | statusFull="Q.St.D.F."
- **Source**: Scullard p. 153 and Fowler p. 153: the calendar annotation is **Q.ST.D.F.** (*Quando stercum delatum fas*) — a unique designation, not NP. It means the day is nefastus until the sweeping is done, then becomes fastus.
- **Issue**: The `status` field is `NP`, which in the app's enum represents *nefas piaculum* (a fully forbidden day requiring propitiation). Q.ST.D.F. is its own category: conditionally fastus after a specific act. The app's `statusFull` is correct ("Q.St.D.F."), but the `status` code is wrong.
- **Fix**: The app's `DayStatus` type would need a new value (e.g. `'QSDF'`) or the status should be `'N'` with the statusFull carrying the full annotation. Using `'NP'` misrepresents the legal character of the day. Preferred minimal fix: `status: 'N'` (nefastus until the act is done, consistent with Fowler's annotation).
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Summanalia / Day 20 (not an expiatory sacrifice)

- **App**: key "5-20" | festivalDesc="**Sacrificio de expiación** a Summanus. Se ofrecían pasteles de harina con forma de ruedas."
- **Source**: Scullard pp. 153–155: this is the *dies natalis* (founding anniversary) of the temple. Offerings of black wethers (*verveces atri*) and wheel-shaped cakes — a regular annual cult observance, not expiation. Fowler pp. 160–161: "Dies natalis of the temple of Summanus." Neither source characterises it as expiatory.
- **Issue**: "Sacrificio de expiación" (*piaculum*) implies the cult is propitiating an offence or averting anger. The Summanalia was a birthday-of-the-temple offering, not a *piaculum*. The conflation is theologically inaccurate.
- **Fix**: `festivalDesc`: "Aniversario (*dies natalis*) del templo de Summanus junto al Circo Máximo, fundado c. 278 a.C. Se ofrecían machos cabríos negros y pasteles de harina con forma de rueda (*Summanalia*). Summanus regía los rayos nocturnos, a diferencia de Júpiter que gobernaba los diurnos."
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Vestalia continuation / Day 14

- **App**: key "5-14" | festivalDesc="Último día de labores previas a la apertura ritual total."
- **Source**: Scullard p. 148: the penus was open from 7 June until 15 June. "Apertura ritual" happened on June 7, not on June 14. There is no source that describes June 14 as a preparatory day before "total opening."
- **Issue**: festivalDesc is internally incoherent: by day 14 the penus has been open for a week. "Labores previas a la apertura ritual total" implies the penus is still closed, which contradicts the attested calendar.
- **Fix**: `festivalDesc`: "Penúltimo día del período religioso de la Vestalia. El *penus Vestae* permanece abierto a las matronas. Mañana será barrido el santuario y cerrado de nuevo."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Vesta Aperitur / Day 7

- **App**: key "5-7" | festivalName="Ludi Piscatorii" only. No Vesta entry on day 7.
- **Source**: Scullard p. 148: "**7 June** (*VII Id. Iun.*): the inner sanctum (*penus*) of the temple of Vesta was opened — for women only — and remained open until 15 June." Fowler pp. 146–147: "*Vesta aperit* June 7." The Philocalus calendar explicitly has *Vesta aperit* on June 7.
- **Issue**: The opening of the Vestal penus on 7 June is a distinct, attested calendar event. The app places "Vestalia" only at day 9, with no indication that the religious period began on day 7. The Ludi Piscatorii entry on day 7 is correct but Vesta should appear alongside it.
- **Fix**: Add secondary deity/entry to "5-7" or note in the Vestalia description that the penus opened on 7 June. If a single entry must be chosen, a note is the minimum. Suggested addition to festivalDesc of 5-7: "(El *penus* del templo de Vesta fue abierto hoy a las matronas, inaugurando el período religioso hasta el 15 de junio.)"
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Fortuna Virgo in Foro Boario / Day 11

- **App**: key "5-11" | Only Matralia appears. No Fortuna entry.
- **Source**: Scullard pp. 151–152: "Temple of Fortuna in the Forum Boarium, adjacent to the Mater Matuta temple. **Both founded by Servius Tullius** and destroyed/rebuilt together … dedicated 11 June." Fowler p. 154: "A temple of Fortuna in the Forum Boarium shared the same dedication-day." Both sources treat this as a distinct cult entry for 11 June.
- **Issue**: The Fortuna Virgo temple in the Forum Boarium was dedicated on the same day as Mater Matuta (11 June), by the same king (Servius Tullius), and at the adjacent site. It is omitted from the app.
- **Suggested app entry** (secondary deity note within 5-11, or a separate entry):

```typescript
// Additional secondary entry to note within 5-11's festivalDesc, or expand deity field:
deity: "Mater Matuta / Fortuna Virgo",
deityDesc: "Antigua diosa de la luz matinal y diosa de la fortuna protectora de las jóvenes.",
festivalDesc: "Fiesta de las matronas. Se rogaba a la diosa que protegiera a los hijos de sus hermanas por encima de los propios. Solo una mujer casada en primeras nupcias (*univira*) podía adornar la estatua. Las esclavas eran excluidas del templo; una era introducida brevemente y expulsada con un golpe. Se ofrecían tortas de barro cocido (*testuacia*). En el templo adyacente, también fundado por Servio Tulio, se veneraba a Fortuna Virgo: las jóvenes le dedicaban sus ropas al casarse.",
```
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Mars in Clivo / Day 1

- **App**: key "5-1" | deity="Carna / Juno Moneta". Mars is not mentioned.
- **Source**: Scullard p. 127: "Temple on the Slope of Mars (*Clivus*) outside the Capena Gate … dedicated 1 June probably in 388 BC. Contained a statue of Mars and wolves. **Soldiers assembled here before setting out for war.** Starting point of the *transvectio equitum* (cavalry victory march, held annually on 15 July)."
- **Issue**: The 1 June dies natalis of the temple of Mars outside the Capena Gate is a distinct attested cult event that the app entirely omits. While it is reasonable to foreground Carna and Juno Moneta, the Mars entry is significant — it was the mustering point for armies.
- **Suggested entry note**: Add Mars to the deity field and festivalDesc: "También: aniversario del templo de Marte *extra portam Capenam* (c. 388 a.C.), donde los soldados se reunían antes de partir a la guerra."
- **Priority**: LOW

---

## MISSING_FESTIVAL: Ludi Taurei / Days 25–26

- **App**: keys "5-25" and "5-26" | status=`C`, no festival name or deity.
- **Source**: Scullard p. 156: "**Ludi Taurei quinquennales** (25–26 June; VI–V Kal. Quinct.) — Quinquennial Games, the only Circus Games held in the Circus Flaminius. Established in the reign of Tarquinius Superbus … Dedicated to the **Di inferi** (gods of the underworld). Included horse-racing. Aition: a plague of pregnant women caused by eating beef sold piecemeal, ordered expiated by the Sibylline Books."
- **Issue**: The Ludi Taurei, while quinquennial (held every 5 years), are attested and documented. No entry exists in the app for June 25–26.
- **Suggested app entries**:

```typescript
"5-25": {
    status: 'C',
    statusFull: "Ludi Taurei",
    deity: "Di Inferi",
    deityDesc: "Dioses del mundo subterráneo.",
    festivalName: "Ludi Taurei (quinquenales)",
    festivalDesc: "Juegos quinquenales en el Circo Flaminio, únicos juegos circenses celebrados en ese recinto. Instituidos por Tarquinio el Soberbio según los Libros Sibilinos para expiar una plaga que afectó a mujeres embarazadas. Consagrados a los dioses infernales."
},
"5-26": {
    status: 'C',
    statusFull: "Ludi Taurei (dies II)",
    deity: "Di Inferi",
    deityDesc: "Dioses del mundo subterráneo.",
    festivalName: "Ludi Taurei (día II)",
    festivalDesc: "Segundo día de los Juegos Taurinos quinquenales. Carreras de caballos alrededor de la meta en el Circo Flaminio."
},
```
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Lares V[...] / Day 27

- **App**: key "5-27" | Only Jupiter Stator appears. No Lares entry.
- **Source**: Scullard p. 157: "The calendar reads *Laribus V[...]* (Ant. mai.). K. Latte proposed *Laribus Vialibus* (guardians of roads and travellers). Scullard suggests this refers to the temple of the Lares at the top of the Via Sacra (mentioned in 106 BC; restored by Augustus)."
- **Issue**: The Lares V[...] entry is a distinct calendar event on the same day as Jupiter Stator. While the interpretation is uncertain (Viales vs. another Lares group), its attestation in Ant. mai. is firm.
- **Suggested note**: Add to 5-27 festivalDesc: "En este mismo día, los calendarios atestiguan *Laribus V[...]* (probablemente Lares Viales o los Lares del tope de la Via Sacra, restaurados por Augusto)."
- **Priority**: LOW

---

## MISSING_FESTIVAL: Tempestates / Day 1 (date uncertain)

- **App**: key "5-1" | No mention of Tempestates.
- **Source**: Scullard p. 127: "Temple dedicated by L. Cornelius Scipio (cos. 259 BC) after surviving a great storm off Corsica in the First Punic War. Located outside the Capena Gate … Ovid assigns 1 June; calendar Ant. mai. gives 23 December." Date is explicitly stated as doubtful.
- **Issue**: Scullard covers the Tempestates temple for 1 June, though noting the dual date. Given the date uncertainty, omission from the app is defensible but worth flagging.
- **Priority**: LOW

---

## MINOR: Hercules Magnus Custos — deity name incomplete / Day 4

- **App**: key "5-4" | deity="Hercules Custos"
- **Source**: Scullard p. 146: "Hercules **Magnus** Custos." Fowler p. 135: "Hercules Magnus Custos." Both sources give the full epithet with *Magnus*.
- **Issue**: The app omits "Magnus" from the deity name.
- **Fix**: `deity: "Hercules Magnus Custos"`, `deityDesc: "Hércules el Gran Guardián."`.
- **Priority**: LOW

---

## MINOR: Bellona — omits columella / spear-casting ritual / Day 3

- **App**: key "5-3" | festivalDesc="Aniversario de la dedicación del templo en el Campo de Marte (296 a.C.)."
- **Source**: Scullard p. 146 and Fowler p. 135: a small pillar (*columella*) in front of the Bellona temple served as the symbolic "enemy territory" over which the fetial priest cast a spear to declare war on overseas enemies. This is one of Rome's most distinctive ritual acts.
- **Issue**: The app's description reduces the entry to a plain temple anniversary, omitting the *columella* / spear-casting, which is the defining feature of the Bellona cult in practice.
- **Fix**: Expand festivalDesc to include the *columella* ritual: "… Ante el templo se erguía una pequeña columna (*columella*) que simbolizaba tierra enemiga: los sacerdotes fetiales arrojaban una lanza sobre ella para declarar formalmente la guerra a enemigos de ultramar. El Senado también usaba el templo para recibir embajadores y generales que solicitaban el triunfo."
- **Priority**: LOW

---

## MINOR: Matralia — festivalDesc incomplete / Day 11

- **App**: key "5-11" | festivalDesc="Fiesta de las matronas. Se rogaba a la diosa que protegiera a los hijos de sus hermanas por encima de los propios."
- **Source**: Scullard pp. 150–152 and Fowler pp. 154–157: Four distinctive ritual features — (1) only a *univira* (wife married once) could adorn the statue; (2) one slave girl was brought in and beaten/slapped; (3) sacred cakes (*testuacia*) cooked in earthenware pots; (4) women prayed for nephews/nieces first, own children second.
- **Issue**: The app captures only point (4) and omits (1)–(3). The slave-girl beating and the *univira* restriction are the most unusual and well-documented elements in both sources.
- **Fix**: See the MISSING_FESTIVAL: Fortuna Virgo fix above, which also expands the Matralia description.
- **Priority**: LOW

---

## MINOR: Fors Fortuna — deity name imprecise / Day 24

- **App**: key "5-24" | deity="Fortuna"
- **Source**: Scullard pp. 155–156 and Fowler pp. 161–172: "**Fors Fortuna**" — the full name distinguishes this cult from Fortuna Virgo (June 11) and Fortuna at Praeneste. Scullard chapter heading: "Forti Fortunae (trans Tiberim)."
- **Issue**: The generic "Fortuna" does not distinguish Fors Fortuna from the other Fortuna cults in June.
- **Fix**: `deity: "Fors Fortuna"`, `deityDesc: "Diosa de la buena suerte activa, venerada especialmente por el pueblo llano y los esclavos."`.
- **Priority**: LOW

---

## MINOR: Hercules Musarum — festivalDesc sparse / Day 30

- **App**: key "5-30" | festivalDesc="Dedicación del Templo erigido en el Circo Flaminio."
- **Source**: Scullard pp. 157–158: Temple of "Hercules of the Muses" built by M. Fulvius Nobilior after triumph over the Ambracians. Contained statues of the **nine Muses** (brought from Ambracia) and a statue of **Hercules playing a lyre**. Nobilior also installed a copy of his *Fasti* in the temple.
- **Issue**: The festivalDesc is too sparse. The nine Muses' statues and Hercules's lyre are precisely what make this cult distinctive and known to literary figures like Cicero.
- **Fix**: `festivalDesc`: "Aniversario del templo de Hércules y las Musas en el Circo Flaminio, levantado por M. Fulvio Nobilior con el botín del triunfo sobre los ambraciotas. Contenía estatuas de las nueve Musas y una imagen de Hércules tocando la lira, ambas traídas de Ambracia."
- **Priority**: LOW

---

## Summary

| Category | Count | Days affected |
|---|---|---|
| WRONG_STATUS | 5 | 1, 5, 9, 11, 15 |
| WRONG_DEITY | 1 | 7 |
| WRONG_RITUAL | 4 | 9, 14, 15, 20 |
| MISSING_FESTIVAL | 6 | 1 (Mars, Tempestates), 7 (Vesta aperitur), 11 (Fortuna Virgo), 25–26 (Ludi Taurei), 27 (Lares V[...]) |
| MINOR | 6 | 3, 4, 11, 24, 30 + Day 14 desc |
| INVENTED_AITION | 0 | — |

**Total findings**: 22

**Highest-priority fixes:**
1. Status corrections for days 1, 5, 9, 11 (all HIGH — wrong calendar category).
2. Day 7 deity: Tiberinus → Vulcanus (HIGH — ritual misdirected to wrong god).
3. Days 25–26: add Ludi Taurei entries (MEDIUM — fully absent).
4. Day 11: add Fortuna Virgo (MEDIUM — fully absent, documented by both sources).
5. Day 9 festivalDesc: correct the "comienza" error (MEDIUM — implies wrong start date).
6. Day 20: remove "expiación" (MEDIUM — wrong ritual category).

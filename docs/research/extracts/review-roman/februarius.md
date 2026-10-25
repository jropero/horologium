# Roman Calendar Review — Februarius
**App data**: `utils/romanYearData.ts` keys `"1-1"` through `"1-28"`
**Sources**: Scullard (1981) pp. 69–85; Fowler (1899) pp. 299–331
**Reviewer**: Claude Sonnet 4.6
**Date**: 2026-10-25

---

## WRONG_STATUS: Juno Sospita / Day 1

- **App**: key "1-1" | status=NP | statusFull="Kalendae" | festivalName="Dedicación del Templo de Juno" | deity="Juno Sospita"
- **Source**: Scullard p.71 says "N (Ant. mai.)" — the Fasti Antiates Maiores records 1 February as N (dies nefastus), not NP. Fowler p.302 concurs: "Fasti status: N." The Kalends of February was an exceptional N day, unlike most Kalends (which were NP); this is explicitly stated in both scholars' entries for this day.
- **Issue**: The app assigns `status: 'NP'` to Feb 1. Both sources are unambiguous that this day was N. The standard rule that Kalends = NP does not apply here; the February Kalends was specifically listed as N in the Fasti.
- **Fix**: Change `status: 'NP'` → `status: 'N'`. The `statusFull` value `"Kalendae"` can remain as a structural label.
- **Priority**: HIGH

---

## WRONG_DEITY: Lupercalia / Day 15

- **App**: key "1-15" | status=NP | festivalName="Lupercalia" | deity="Fauno / Lupercus"
- **Source**: Scullard p.78 says: "'Lupercus' was an Augustan invention; the original deity is uncertain and probably pre-anthropomorphic." Fowler p.310–321 is equally explicit: "no deity called Lupercus existed." Both scholars name Faunus (per Ovid) and Inuus (per Livy) as the competing ancient attributions, but both reject Lupercus as genuine.
- **Issue**: The app lists "Lupercus" as a co-deity alongside Faunus. This presents as fact a deity that both scholarly sources specifically identify as an Augustan-era fabrication with no ancient basis.
- **Fix**: Change `deity` to `"Fauno / Inuus (incierto)"`. In `festivalDesc`, add a note that the original deity is uncertain: Ovid attributes the rite to Faunus, Livy to Inuus; a god named Lupercus is an Augustan invention with no earlier attestation.
- **Priority**: HIGH

---

## WRONG_STATUS + WRONG_RITUAL: Feralia / Day 21

- **App**: key "1-21" | status=NP | statusFull="Feralia" | festivalName="Feralia" | festivalDesc="… Día nefasto: toda actividad pública estaba prohibida."
- **Source**: Scullard p.74–75 gives the Fasti status as "F (Ant. mai.; Maff.) / FP (Caer.; Vend.). Dies religiosus." Fowler p.306–310 concurs: "Feralia appears in three calendars (Caer. Maff. Farn.) in large letters, and is partly F/FP." Neither source gives NP for this day.
- **Issue** (two compounding errors):
  1. `status: 'NP'` is wrong; the attested calendar designations are F or FP depending on the calendar.
  2. The `festivalDesc` states "Día nefasto: toda actividad pública estaba prohibida." F (dies fastus) means legal business *was* permitted — the opposite of what the app claims. The Feralia was a dies religiosus but not nefastus in the usual sense; private piety and family tomb-visits characterised it, not a general ban on public activity.
- **Fix**: Change `status: 'F'` (taking the majority Fasti reading — Ant. mai., Maff.). Remove the sentence "Día nefasto: toda actividad pública estaba prohibida" from `festivalDesc`. Replace with: "Único festival público del período de la Parentalia. Los ritos eran de carácter privado: las familias llevaban ofrendas a las tumbas y apaciguaban a los Manes. Como dies religiosus, los magistrados depusieron sus insignias durante todo el período parental." Also add a brief note on the private rite of Tacita/Muta (Scullard p.75; Fowler p.308): an old woman performed sympathetic magic with incense, black beans, and a fish sewn with a bronze needle, to silence hostile spirits — this private rite is described by Ovid alongside the official Feralia.
- **Priority**: HIGH

---

## WRONG_DEITY: Caristia / Day 22

- **App**: key "1-22" | status=C | festivalName="Caristia (Cara Cognatio)" | deity="Concordia Familiar"
- **Source**: Scullard p.75–76 says the deity honored was the Lares (family gods): "Worship was paid to the Lares: incense offered to the family gods; food set before them on a platter." Fowler p.309–310 also specifies "Lares of the family (who shared in the sacred meal, 'incincti')."
- **Issue**: The app gives `deity: "Concordia Familiar"`. "Concordia Familiar" is not an attested deity for this festival; it is a modern descriptive phrase. The actual deity receiving cult on this day was the family Lares. Concordia is a separate state deity honoured on 5 February in a completely different context.
- **Fix**: Change `deity` to `"Lares"` and `deityDesc` to `"Dioses del hogar familiar."` The concept of family harmony belongs in `festivalDesc`, not in the deity field.
- **Priority**: MEDIUM

---

## WRONG_DEITY: Quirinalia / Day 17 (Fornax attribution)

- **App**: key "1-17" | status=NP | festivalName="Quirinalia / Fornacalia (Fin)" | deity="Quirino / Fornax"
- **Source**: Scullard p.73–74 states: "No major deity [for the Fornacalia]; Fornax (Goddess of the Oven) was a later invention. Dionysius of Halicarnassus (2.23) records that the curiae tables were dedicated to Iuno Curitis." Fowler p.302–306 similarly treats Fornax as the "spirit of the oven" rather than as a genuine ancient deity, and notes Juno (Curitis) as the deity actually honored in the curiae. Scullard explicitly calls Fornax a "later invention."
- **Issue**: The app places "Fornax" as a co-deity of the Quirinalia in the `deity` field. Both sources indicate Fornax is a late scholastic invention to explain the etymology of the Fornacalia; the actual deity honored in the curiae was Juno Curitis, and the Quirinalia itself belonged to Quirinus.
- **Fix**: Change `deity` to `"Quirino"`. In `festivalDesc`, replace references to Fornax as a genuine deity with: "El Quirinalia servía también como último día (Stultorum Feriae) de la Fornacalia, fiesta de las treinta curias en que cada una tostaba farro (far) en su local. Las curias honraban a Iuno Curitis en sus mensas; el nombre 'Fornacalia' deriva de fornax (horno), diosa cuyo carácter es una invención erudita tardía (Scullard p.73–74)."
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Equirria / Day 27

- **App**: key "1-27" | status=NP | festivalName="Equirria" | festivalDesc="Primera de las carreras de carros y caballos en el Campo de Marte…"
- **Source**: Scullard p.82 says: "Whether chariots were involved is uncertain." Fowler p.330 calls it simply "Horse-race in the Campus Martius" with no mention of chariots. Both sources describe horse-racing (equi), not chariot racing (quadrigae).
- **Issue**: The app states "carreras de carros y caballos" (chariot and horse races), presenting chariot involvement as established fact. Scullard explicitly flags this as uncertain, and Fowler's account is chariot-free. The festival name itself (Equirria, from equi = horses) supports a horse-only interpretation.
- **Fix**: Change `festivalDesc` to remove "carros y": "Primera carrera de caballos en el Campo de Marte (o en el monte Celio si éste estaba inundado), dedicadas a Marte antes del inicio de la temporada militar. Si los carros participaban es incierto (Scullard p.82). Romulus habría instituido las carreras según la tradición."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Helernus / Day 1

- **App**: key "1-1" — no mention of Helernus
- **Source**: Scullard p.72: "Ovid says that on 1 February the grove of Helernus was thronged with worshippers: 'the pontiffs still bring sacrifices thither' (sacra ferunt). A black ox was sacrificed, according to Festus." Helernus is described as a primitive deity, possibly of the underworld, with a grove near the Tiber below the Palatine. The name is uncertain in manuscripts (variants: Avernus, Elernus, Elemo).
- **Issue**: A distinct cult-sacrifice by the pontiffs on 1 February is entirely absent from the app.
- **Fix**: The simplest approach is to add a note in the existing `"1-1"` festivalDesc. A standalone entry is not possible because the calendar date is shared with Juno Sospita and the day can only carry one primary key. Suggested addition to `festivalDesc`:

```typescript
// Addition to "1-1" festivalDesc:
festivalDesc: "Aniversario del templo de Juno Sospita en Roma (voto de C. Cornelio Cetego, 197 a.C.; dedicado en 194 a.C.). Los cónsules realizaban un sacrificio anual en su santuario principal en Lanuvio. En el mismo día, los pontífices ofrendaban en el bosque sagrado de Helernus, divinidad primitiva posiblemente ctónica cuyo nombre varía en los manuscritos (Avernus, Elernus); Festo menciona el sacrificio de un buey negro (Scullard p.72)."
```
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Amburbium (moveable, February)

- **App**: no entry anywhere for Amburbium
- **Source**: Scullard pp.82–84: "Macrobius (1.13.3) places it in February: 'King Numa ordered the city to be lustrated in February and sacrifice offered to the Di Manes.'" It was a feriae conceptivae (moveable feast): a pig, sheep, and ox (suovetaurilia) were led in procession around the pomerium and sacrificed. Pontiffs, Vestal Virgins, College of Fifteen, augurs, Salii, and a flamen all participated. Attested crisis instances: 49 BC and AD 271.
- **Issue**: A major public purification rite of February is not represented anywhere in the app. Unlike the Fornacalia (which the app mentions within the Quirinalia entry), the Amburbium has no presence at all.
- **Fix**: Since this is a feriae conceptivae with no fixed date, it cannot be given a specific numeric key. A suggested approach is to add a note to the month-level documentation (if the app has such a structure) or to add it as a parenthetical note within one of the N days of mid-February. If a fixed-day anchor is needed, Feb 13 (already the Parentalia/Faunus day) is plausible given Macrobius's Di Manes connection. Suggested entry if added as "1-13" note or as a separate conceptivae flag:

```typescript
// Suggested addition to festivalDesc of "1-13" or as a separate documentation note:
// "En febrero también se celebraba el Amburbium (feriae conceptivae, fecha móvil): lustración procesional
// del pomerium de Roma con suovetaurilia (cerdo, oveja y buey). Participaban pontífices, Vestales,
// quindecimviros, augures, Salios y un flamen. Macrobio (1.13.3) lo vincula a Numa y a los Di Manes.
// Casos históricos documentados: 49 a.C. y 271 d.C. (Scullard pp.82–84)."
```
- **Priority**: MEDIUM

---

## MINOR: Faunus in Insula displaced by Parentalia / Day 13

- **App**: key "1-13" | status=NP | festivalName="Inicio de la Parentalia" | deity="Fauno"
- **Source**: Scullard p.73: the NP entry on 13 February in the Fasti is specifically for Faunus's temple on the Tiber Island ("Fauno in Insula"). The Parentalia also begins on this day (from the sixth hour), but it is not formally NP — it is a dies religiosus covering the whole period 13–21 February.
- **Issue**: The festivalName foregrounds "Inicio de la Parentalia" rather than "Fauno in Insula," which is the actual named festival in the Fasti for this day. The result slightly misrepresents the calendar's organisation: the NP status belongs to the Faunus festival, not to the Parentalia (which has no separate NP marking per Mommsen, cited by Fowler p.306).
- **Fix**: Change `festivalName` to `"Fauno in Insula / Inicio de la Parentalia"`. Update `festivalDesc` to lead with the Faunus temple dedication (built 196 BC with fines on ager publicus defaulters, dedicated 194 BC per Fowler p.302; Scullard p.73) and add as a second paragraph that the Parentalia also begins this day from the sixth hour, with all temples closing and the Senior Vestal performing a parentatio.
- **Priority**: LOW

---

## MINOR: Terminalia festivalDesc too sparse / Day 23

- **App**: key "1-23" | status=NP | festivalName="Terminalia" | festivalDesc="Ritos celebrados en las piedras fronterizas que marcaban propiedades y fronteras para mantener el orden de la propiedad terrenal."
- **Source**: Scullard pp.80–81 gives the most detailed description of any February festival: private rite with garlanded stone, fire brought from the hearth, corn and honeycomb cast into the bonfire, silent white-clad neighbours, blood of a lamb or sucking pig sprinkled on the stone, feast and songs. Public rite: annual sheep sacrifice at the sixth milestone on the Via Laurentina. Aition: established by Numa; the Capitol terminus-stone preserved inside Jupiter's temple with an opening in the roof. Fowler p.324–327 adds gromatic evidence (Siculus Flaccus on the original burial of victims' bones under the stone) and notes that Varro and Ovid wrongly identified Terminalia as the year's last festival.
- **Issue**: The festivalDesc conveys almost no detail from either source. The specific ritual elements, the aition, the Capitol stone, and the Via Laurentina public rite are all missing.
- **Fix**: Expand `festivalDesc` to include the private boundary-stone rite (garlanded stone, fire, offerings, feast and songs), the aition (Numa; the Capitol Terminus refusing to leave Jupiter's temple), and the public sacrifice at the sixth milestone of the Via Laurentina.
- **Priority**: LOW

---

## Summary

| Category | Count | Findings |
|---|---|---|
| WRONG_STATUS | 2 | Day 1 (NP→N); Day 21 (NP→F) |
| WRONG_DEITY | 3 | Day 15 (Lupercus); Day 17 (Fornax); Day 22 (Concordia Familiar→Lares) |
| WRONG_RITUAL | 2 | Day 21 (nefastus claim); Day 27 (chariots as established fact) |
| INVENTED_AITION | 0 | — |
| MISSING_FESTIVAL | 2 | Helernus (Feb 1); Amburbium (moveable) |
| MINOR | 2 | Day 13 (Faunus displaced); Day 23 (Terminalia too sparse) |
| **TOTAL** | **11** | |

### Priority summary
- **HIGH** (3): Wrong status Feb 1; Lupercus invented deity; Feralia status+ritual double-error
- **MEDIUM** (5): Caristia deity; Quirinalia/Fornax deity; Equirria chariots; Helernus missing; Amburbium missing
- **LOW** (2): Faunus/Parentalia ordering; Terminalia description sparse

### Sources consulted
- H. H. Scullard, *Festivals and Ceremonies of the Roman Republic* (1981), pp. 69–85 (Februarius chapter)
- W. Warde Fowler, *The Roman Festivals of the Period of the Republic* (1899), pp. 299–331 (Mensis Februarius)

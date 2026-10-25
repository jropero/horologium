# Roman November — App vs. Scullard / Fowler Review

**Sources:**
- H. H. Scullard, *Festivals and Ceremonies of the Roman Republic* (1981), pp. 196–202
- W. Warde Fowler, *The Roman Festivals of the Period of the Republic* (1899), pp. 252–254 (printed; PDF pp. 263–265)
- App data: `utils/romanYearData.ts`, keys `"10-1"` through `"10-30"` (month index 10 = November, 0-based)

**Note on sources:** Fowler's November chapter is extremely thin (three printed pages). Scullard is the primary source for this month. Fowler corroborates on the major items (Ludi Plebeii, Mundus patet, Feronia, Fortuna Primigenia) but adds no detail that contradicts Scullard.

---

## WRONG_STATUS + WRONG_DEITY + WRONG_RITUAL: Ludi Victoriae Sullanae — Day 1

- **App**: key `"10-1"` | status=`NP` | statusFull=`"Kalendae"` | festivalName=`"Ludi Sullanae"` | deity=`"Juno"` | festivalDesc=`"Conclusión de los juegos de Sila. Honores habituales de las Calendas."`
- **Source**: Scullard p. 196 — 1 Nov. (KAL. NOV.) is the culminating day (Circenses) of the *Ludi Victoriae Sullanae*, a games sequence running 26 October – 1 November. Fasti status: **F**. Deity: **Victoria / Victoria Sullana**. The Circenses on 1 November marked the anniversary of the Battle of the Colline Gate (81 BC). Staged by praetors. Established by Sulla; originally called *Victoriae*, later renamed *Sullanae* to distinguish from Caesar's games.
- **Issue (status):** App records NP; Scullard gives F.
- **Issue (deity):** App lists Juno, which belongs to the Kalendae formula but is not the deity of this festival. Scullard clearly names Victoria / Victoria Sullana.
- **Issue (ritual):** festivalDesc conflates Kalends rites ("honores habituales de las Calendas") with the actual games. The correct content is the concluding Circenses of the Ludi Victoriae Sullanae.
- **Issue (name):** "Ludi Sullanae" is an incomplete name. Full attested name is *Ludi Victoriae Sullanae*.
- **Fix:**
  ```ts
  "10-1": {
    status: 'F',
    statusFull: "Kalendae Novembres",
    deity: "Victoria",
    deityDesc: "Diosa de la victoria.",
    festivalName: "Ludi Victoriae Sullanae (clausura)",
    festivalDesc: "Día final (Circenses) de los Ludi Victoriae Sullanae, juegos de varios días (26 oct.–1 nov.) establecidos en 81 a.C. por Sila para conmemorar su victoria sobre los samnitas en la Porta Collina. Organizados por pretores."
  }
  ```
- **Priority**: HIGH

---

## WRONG_DATE: Ludi Plebeii start — Day 3

- **App**: key `"10-3"` | status=`C` | festivalName=`"Ludi Plebeii"` | festivalDesc=`"Inician los históricos Juegos de la Plebe..."`
- **Source**: Scullard pp. 196–197 — Ludi Plebeii run **4–17 November** (PR. NON. NOV. = 4 Nov. to the Ides + following circus days). Fowler p. 252 also gives "Nov. 4 to Nov. 11" (Fowler's earlier date range) or Nov. 13 as original nucleus, extended to start Nov. 4.
- **Issue**: The app starts the games on day 3 (Nov 3), one day early. The games do not begin until day 4 (Nov 4). Key `"10-3"` should have no festivalName.
- **Fix**: Remove `festivalName` and `festivalDesc` from `"10-3"`. Change deity and deityDesc to reflect a plain comitial day or remove them. Transfer the Ludi Plebeii opening description to `"10-4"`.
  ```ts
  "10-3": { status: 'C', statusFull: "Dies Comitialis", deity: "Ninguna", deityDesc: "Día sin deidad específica." }
  ```
- **Priority**: HIGH

---

## WRONG_STATUS + WRONG_RITUAL + WRONG_DEITY: Mundus Patet — Day 8

- **App**: key `"10-8"` | status=`NP` | deity=`"Manes"` | festivalName=`"Mundus Patet"` | festivalDesc=`"Segunda apertura sagrada de la fosa al inframundo. Es el último momento anual en que los muertos vagan libremente por convención formal."`
- **Source**: Scullard p. 197 — 8 Nov. (vi ID. NOV.): Fasti status **C; dies religiosus**. No named deity (chthonic — the mundus pit itself). This is the **third and final** annual opening of the mundus (first: 24 August; second: 5 October; third: 8 November). Fowler p. 252 gives only a one-sentence cross-reference: "one of the three days on which the mundus was open."
- **Issue (status):** App records NP; Scullard gives C (dies religiosus). The comitial base-type with the dies religiosus overlay is significant.
- **Issue (ritual):** App calls this the "segunda apertura" (second opening). It is the **third** and final annual opening. The sequence is 24 Aug → 5 Oct → 8 Nov.
- **Issue (deity):** App names "Manes" as the deity. Neither Scullard nor Fowler assigns a named deity to this entry; Scullard describes it as chthonic without specification.
- **Fix:**
  ```ts
  "10-8": {
    status: 'C',
    statusFull: "Dies Comitialis / Dies Religiosus",
    deity: "Divinidades ctónicas",
    deityDesc: "Poderes del inframundo asociados al mundus.",
    festivalName: "Mundus Patet",
    festivalDesc: "Tercera y última apertura anual del mundus, la fosa sagrada que comunicaba con el inframundo. Las otras dos aperturas son el 24 de agosto y el 5 de octubre. Día religioso (dies religiosus): los negocios públicos se evitaban."
  }
  ```
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Feronia — Day 13

- **App**: key `"10-13"` only records the Epulum Iovis / Iovis epulum. No Feronia entry exists on day 13. The app incorrectly places Feronia on day 15 (see below).
- **Source**: Scullard pp. 197–198 — Fasti entry "Feroniae in Campo" (Arv.); "Feroniae, Fortunae Primigeniae, [Pie]tati" (Ant. mai.). Status: **NP** (same Ides day). Feronia had a temple/grove in the Campus Martius. Freedwomen (*libertinae*) contributed money as a gift to Feronia. At Terracina slaves could receive the cap of freedom (*pilleus*) at her altar. She may have originated as an agricultural goddess who later acquired association with freedmen's liberation. Fowler pp. 252–254: "the only mention we have of Feronia in Rome"; her cult predates the Ludi Plebeii in the Campus Martius.
- **Issue**: The festival of Feronia belongs on day 13 (Ides of November), not day 15. It is completely absent from `"10-13"`.
- **Suggested entry** (to be merged into `"10-13"` data or handled as a secondary festival note):
  ```ts
  // Add to "10-13" festivalDesc or create a secondary display mechanism:
  // festivalName: "Feronia in Campo / Epulum Iovis"
  // festivalDesc should cover both: the Iovis epulum (senators' feast) AND the
  // Feronia cult (Campus Martius temple; libertinae contributions).
  ```
  If the app can only display one festivalName per day, the existing Epulum Iovis is the higher-profile entry, but Feronia should be acknowledged in the description:
  ```ts
  "10-13": {
    status: 'NP',
    statusFull: "Idus Novembres",
    deity: "Júpiter / Feronia",
    deityDesc: "Rey de los dioses y diosa itálica de la fertilidad y la libertas.",
    festivalName: "Epulum Iovis / Feronia in Campo",
    festivalDesc: "Las Idus de noviembre concentran el contenido más sagrado del mes. El Epulum Iovis es el banquete solemne de Júpiter que separa los nueve días escénicos de los tres días circenses de los Ludi Plebeii; los senadores participaban en él. En la misma jornada se celebraba la Feronia en su recinto del Campo de Marte: las libertinas aportaban dinero como ofrenda a la diosa, asociada a la fertilidad agraria y a la manumisión de esclavos."
  }
  ```
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Fortuna Primigenia — Day 13

- **App**: key `"10-13"` — no entry for Fortuna Primigenia.
- **Source**: Scullard p. 198 — Fasti entry "Fortunae Primigeniae in C[apitolio?]" (Arv.). Status: **NP** (same NP Ides day). Dies natalis of the Capitol temple of Fortuna Primigenia (distinct from the Colline Hill temple dedicated 25 May). Fowler p. 254: "date of introduction of this cult at Rome is 204 BC" (dedicated 194 BC; Livy 29.36, 34.53). Fowler notes the conjunction with Feronia is "curious: both were goddesses of Praeneste."
- **Issue**: This temple anniversary is unrecorded in the app.
- **Fix**: Incorporate into `"10-13"` description (as a third item alongside Epulum Iovis and Feronia), or note it as a minor temple anniversary. Full entry for this day is best consolidated into the fix for the Feronia finding above.
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: [Pietati] — Day 13

- **App**: key `"10-13"` — no entry for Pietas temple.
- **Source**: Scullard p. 198 — Fasti entry "[Pie]tati" (Ant. mai.; supplement, partially preserved). Status: **NP** (same Ides day). Dies natalis of the temple of Pietas in the Forum Holitorium, vowed at Thermopylae (191 BC) by M'. Acilius Glabrio, dedicated by his son. The temple contained the first gilded statue of a private individual in Rome. Destroyed 44 BC for the Theatre of Marcellus. Connected with the story of a daughter nursing her imprisoned parent.
- **Issue**: Not recorded in the app. The entry is partially preserved in the Antiate calendar (supplemented text), so it carries lower certainty than the others on this day.
- **Fix**: Optionally mention in `"10-13"` festivalDesc alongside the Feronia and Fortuna Primigenia entries. Given the fragmentary nature of the source, a brief mention is sufficient:
  ```
  También el dies natalis del templo de la Pietas en el Foro Holitorium (voto en Termópilas, 191 a.C.).
  ```
- **Priority**: LOW (partially preserved source)

---

## WRONG_DATE: Feronia placed on Day 15 instead of Day 13

- **App**: key `"10-15"` | status=`NP` | deity=`"Feronia"` | festivalName=`"Ludi Plebeii / Feronia"` | festivalDesc=`"Se suman celebraciones de la diosa protectora Feronia a los espectáculos circenses."`
- **Source**: Scullard pp. 197–198 — Feronia's festival day is the **Ides of November (13th)**, not the 15th. The fasti entry "Feroniae in Campo" is unambiguously under 13 November. Fowler p. 252: Feronia is "probably on the day which was the original nucleus of the games" — i.e., the Ides (13th).
- **Issue**: Feronia is placed two days late. Day 15 should be a plain Ludi Plebeii circus day. The festivalDesc also incorrectly describes Feronia as accompanying circus shows; her cult was in the Campus Martius and is distinct from the circus programme.
- **Fix**: Remove the Feronia deity and festivalName from `"10-15"`. Replace with a plain Ludi Plebeii entry:
  ```ts
  "10-15": {
    status: 'NP',
    statusFull: "Dies Nefastus Publicus",
    deity: "Júpiter",
    deityDesc: "Rey de los dioses.",
    festivalName: "Ludi Plebeii (Circenses)",
    festivalDesc: "Días de carreras en el Circo Flaminio (luego Circo Máximo) como parte de los Ludi Plebeii."
  }
  ```
- **Priority**: HIGH

---

## WRONG_DEITY: Equorum Probatio — Day 14

- **App**: key `"10-14"` | status=`F` | deity=`"Marte / Júpiter"` | festivalName=`"Equorum Probatio"` | festivalDesc=`"Otra revisión militar ecuestre ritual celebrada durante las pausas del festival."`
- **Source**: Scullard p. 198 — Status F; dies religiosus. **No deity is stated** for the Equorum probatio entry; Scullard cross-references the 15 July entry (p. 164f.) for the full description. The inspection of horses is part of the Ludi Plebeii programme.
- **Issue**: The app assigns "Marte / Júpiter" to this day. Scullard records no named deity for the Equorum probatio. "Marte" for an equestrian review is a plausible inference but not sourced here.
- **Fix**: Either remove the deity or note the attribution is inferential:
  ```ts
  "10-14": {
    status: 'F',
    statusFull: "Dies Fastus / Dies Religiosus",
    deity: "Ninguna (atribuido a Marte por contexto)",
    deityDesc: "Sin deidad explícita en las fuentes para esta jornada.",
    festivalName: "Equorum Probatio",
    festivalDesc: "Revisión oficial de los caballos que participarán en los días de carreras de los Ludi Plebeii. Día fasto pero de carácter religioso (dies religiosus)."
  }
  ```
- **Priority**: MEDIUM

---

## Summary

| Category | Count | Days affected |
|---|---|---|
| WRONG_STATUS | 2 | 1, 8 |
| WRONG_DEITY | 3 | 1, 8, 14 |
| WRONG_RITUAL | 2 | 1, 8 |
| WRONG_DATE | 2 | 3 (Ludi Plebeii start), 15 (Feronia) |
| MISSING_FESTIVAL | 3 | 13 (Feronia, Fortuna Primigenia, [Pietati]) |
| MINOR | 1 | 1 (festival name truncation) |
| **Total** | **13** | |

**Priority breakdown:**
- HIGH (5): Day 1 (Ludi Victoriae Sullanae composite), Day 3 (Ludi Plebeii start), Day 8 (Mundus Patet), Day 13 (Feronia missing), Day 15 (Feronia wrong date)
- MEDIUM (2): Day 13 (Fortuna Primigenia missing), Day 14 (Equorum Probatio deity)
- LOW (1): Day 13 ([Pietati] missing)

**Key observations:**
- November is the Roman calendar's leanest month (both Scullard and Fowler explicitly characterize it as such). The app's coverage is broadly correct in structure but has significant precision errors on the three major fixed points: the Ludi Victoriae Sullanae closing day (1st), the Mundus Patet (8th), and the Ides cluster (13th).
- The Ides of November (13th) are the most complex day: four distinct NP events share it — Iovis epulum, Feronia, Fortuna Primigenia, and [Pietati]. The app covers only one and misplaces Feronia two days forward.
- Days 21–30 of November have no recorded festivals in either source and the app's plain C entries for those days are correct.
- The Mercatus (days 18–20) is correctly placed and labeled.

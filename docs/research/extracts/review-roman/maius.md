# Roman Calendar Review — Maius (Month Index 4)

**Sources consulted:**
- H. H. Scullard, *Festivals and Ceremonies of the Roman Republic* (1981), pp. 115–128
- W. Warde Fowler, *The Roman Festivals of the Period of the Republic* (1899), pp. 98–129

**App data range:** keys `"4-1"` through `"4-31"` in `utils/romanYearData.ts`

**Review date:** 2026-10-25

---

## WRONG_STATUS: Kalendae Maiae (Day 1)

- **App**: key `"4-1"` | status=`NP` | festivalName="Dedicaciones / Floralia" | deity="Bona Dea / Lares Praestites"
- **Source**: Scullard p. 116 — "Fasti status: F (KAL. MAI.)". Fowler p. 101 — "Fasti Venusini: 'Kal. Mai. F.'"
- **Issue**: The Kalends of May are marked F (fastus) in the ancient fasti, not NP (nefas priore parte diei). Both sources are explicit and consistent.
- **Fix**: Change `status` from `'NP'` to `'F'`; change `statusFull` from `"Kalendae"` to `"Kalendae Maiae"`.
- **Priority**: HIGH

---

## WRONG_STATUS: Lemuria — Day 9

- **App**: key `"4-9"` | status=`NP` | festivalName="Lemuria"
- **Source**: Scullard p. 118 — "Fasti status: N, Dies religiosi (VII, V, III ID. MAI.)". Fowler p. 107 — "N (marked in major calendars: Venusini, Maffeianus, Tusculanus)".
- **Issue**: All three Lemuria days (9, 11, 13 May) are N (nefastus / dies religiosi), not NP. Both sources agree. N marks days that were hostile, not merely restricted — a significant distinction Fowler explicitly draws in contrast with the Feralia.
- **Fix**: Change `status` from `'NP'` to `'N'`; update `statusFull` to `"Dies Nefastus (Lemuria)"`.
- **Priority**: HIGH

---

## WRONG_STATUS: Lemuria — Day 11

- **App**: key `"4-11"` | status=`NP` | festivalName="Lemuria"
- **Source**: Scullard p. 118 — N, dies religiosus. Fowler p. 107 — N.
- **Issue**: Same as Day 9 — must be N, not NP.
- **Fix**: Change `status` from `'NP'` to `'N'`; update `statusFull` to `"Dies Nefastus (Lemuria)"`.
- **Priority**: HIGH

---

## WRONG_STATUS: Lemuria — Day 13

- **App**: key `"4-13"` | status=`NP` | festivalName="Lemuria"
- **Source**: Scullard p. 118 — N, dies religiosus. Fowler p. 107 — N.
- **Issue**: Same as Days 9 and 11 — must be N, not NP.
- **Fix**: Change `status` from `'NP'` to `'N'`; update `statusFull` to `"Dies Nefastus (Lemuria)"`.
- **Priority**: HIGH

---

## WRONG_DEITY: Ambarvalia (Day 29)

- **App**: key `"4-29"` | deity="Deidades agrarias" | festivalName="Ambarvalia"
- **Source**: Scullard p. 124 — "Deity: Mars (primary, in Cato's farmer's prayer); Ceres (Virgil, Tibullus)." Fowler p. 125 — "Mars (primary in Cato's formula, R.R. 141); Ceres (prominent in Virgil's parallel description, Georg. 1.338 ff.)." Cato's verbatim prayer (*Agr.* 141) is addressed to *Pater Mars*.
- **Issue**: The vague "Deidades agrarias" obscures the fact that Mars is the primary deity per the earliest and best-attested ritual source (Cato). Ceres is secondary (Virgil). The deity field should name Mars first.
- **Fix**: Change `deity` to `"Marte / Ceres"` and `deityDesc` to `"Dios de los campos (Cato) y diosa de los cereales (Virgilio)."`.
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Lemuria bean rite — Day 9 description

- **App**: key `"4-9"` | festivalDesc="…El paterfamilias arrojaba habas negras a sus espaldas en la noche para aplacar a los espíritus."
- **Source**: Scullard p. 118 — "the paterfamilias rises at midnight… spitting black beans from his mouth nine times with head averted, saying 'with these beans I redeem me and mine.'" Fowler p. 107 — "spitting black beans out of his mouth nine times."
- **Issue**: The app says he *threw* beans *behind his back* ("arrojaba habas negras a sus espaldas"). Both sources specify he *spat* them from his mouth ("spitting… from his mouth"). The averted head (not looking) is a distinct action — he looks away during the spitting; he does not throw beans over his shoulder in the generic folk-magic sense. The distinction matters because it reflects specific Ovidian evidence (*Fasti* 5.437). The nine-fold repetition and the subsequent bronze-clanging are also omitted but this is a completeness gap rather than a factual error.
- **Fix**: Update `festivalDesc` on `"4-9"` to reflect the spitting rite: "…el paterfamilias, descalzo y en ayuno, recorría la casa escupiendo habas negras de su boca nueve veces, sin mirar atrás, para apaciguar a los lemures."
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Argei effigies described as straw (Day 14)

- **App**: key `"4-14"` | festivalDesc="…Las vírgenes vestales arrojan efigies de paja llamadas 'Argei' a las aguas del río Tíber."
- **Source**: Scullard p. 120 — "rush effigies of human form." Fowler p. 111 — "rush puppets (*simulacra*) resembling men bound hand and foot."
- **Issue**: The app says "efigies de paja" (straw effigies). Both sources call them effigies of *rush* (junco), not straw. In addition, the app attributes the throwing entirely to "las vírgenes vestales," but both sources name the Pontifices and magistrates as participants in the procession, and the Vestal Virgins specifically as the throwers from the bridge — the attribution is incomplete. Scullard (p. 120) also adds that the Flaminica Dialis accompanied the procession with dishevelled hair.
- **Fix**: Change "efigies de paja" to "efigies de junco" ("de junco atadas como hombres"). Expand description to mention the Pontifices and magistrates leading the procession, with the Vestals casting the effigies from the Pons Sublicius.
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Argei date uncertainty (Day 14 vs. 15)

- **App**: key `"4-14"` | festivalName="Ritos de los Argei"
- **Source**: Scullard p. 120 — "Day: 14 (Scullard prefers this to Dionysius' date of 15 May)." Fowler p. 111 — "Day: 15 (Ides of May)." Fowler places the Argei on May 15 and notes the Venusine calendar's reading (May 16 is an error in one calendar).
- **Issue**: Two sources disagree: Scullard prefers May 14; Fowler gives May 15. The app places the Argei on May 14 without acknowledging the uncertainty. Neither date is definitively wrong, but the description should note it is disputed.
- **Fix**: Add to `festivalDesc`: "La fecha es incierta: Escullard prefiere el 14; Dionisio (apud Fowler) indica el 15 de mayo." Keep on day 14 but acknowledge the dispute. Alternatively add a parallel note on `"4-15"`.
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Tubilustrium falsely linked to Vulcan (Day 23)

- **App**: key `"4-23"` | festivalName="Tubilustrium" | festivalDesc="Segunda purificación anual de las trompetas sagradas (tubae), dedicadas a Vulcano."
- **Source**: Scullard p. 123 — "No deity named for the Tubilustrium itself… The Vulcan festival on the same day was unconnected with the Tubilustrium; the Romans invented a link by noting Vulcan as smith who made the trumpets." Fowler p. 123 — keeps Tubilustrium and Feriae Volcano as separate entries; Fowler p. 124 — "Ovid's interpretation — that Vulcan as smith made the trumpets and so was honoured at their lustration — is treated by Fowler as a later rationalization through Greek influence (Hephaestus as armour-smith)."
- **Issue**: Saying the trumpets were "dedicadas a Vulcano" repeats a Roman rationalization that both Scullard and Fowler explicitly reject as secondary and invented. The Tubilustrium had no deity; the coincident Feriae Volcano was a separate festival on the same day. Presenting them as a unified Vulcan event is historically misleading.
- **Fix**: Split or clarify: the Tubilustrium (trumpet lustration) had no presiding deity. The co-occurring Feriae Volcano was a separate Vulcan festival. Update `festivalDesc` to: "Purificación de las tubae (trompetas de convocatoria), sin deidad asignada. En el mismo día se celebraban por separado las Feriae Volcano, aunque la relación entre ambos es secundaria y tardía." Add Vulcan only as a parenthetical note, not as the stated deity of the Tubilustrium.
- **Priority**: MEDIUM

---

## WRONG_RITUAL: QRCF description inaccurate (Day 24)

- **App**: key `"4-24"` | festivalName="Quando Rex Comitiavit Fas" | festivalDesc="El Rex Sacrorum completaba sus deberes religiosos."
- **Source**: Scullard p. 123 — "Formal dismissal of the Comitia by the Rex Sacrorum; after this, legal business (*fas*) could be transacted. Parallel to 24 March entry." Fowler p. 123 — "May 24 was the day the *comitia calata* could make and witness wills."
- **Issue**: The description "El Rex Sacrorum completaba sus deberes religiosos" is vague and inaccurate. The Q.R.C.F. marker indicates a specific procedural event: once the Rex Sacrorum had formally dismissed the Comitia, the day became judicially open (*fas*) for legal transactions, notably the witnessing of wills. This is not about completing generic religious duties.
- **Fix**: Update `festivalDesc` to: "El Rex Sacrorum clausuraba formalmente los Comicios (*quando rex comitiavit fas*), tras lo cual los actos jurídicos — especialmente la firma de testamentos — quedaban permitidos para ese día."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Maia — sacrifice by Flamen Volcanalis (Day 1)

- **App**: key `"4-1"` makes no mention of Maia.
- **Source**: Scullard p. 116 — "Sacrifice offered by the *flamen Volcanalis*. The victim was a pregnant sow, proper for an earth-goddess. Cornelius Labeo identified Maia with Terra." Fowler pp. 102–106 — "The Flamen Volcanalis sacrificed to Maia (= Bona Dea) on the Kalends (*Gell.* 13.23). The goddess's real name was unknown."
- **Issue**: Maia's sacrifice on May 1 by the Flamen Volcanalis is the month's first and most characteristic rite in Scullard (it is his lead entry for Maius). The month name itself may derive from Maia. This is entirely absent from the app's May 1 entry.
- **Suggested entry addition**: Add to the `"4-1"` festivalDesc: "El flamen Volcanalis sacrificaba una cerda preñada a Maia, diosa de la tierra y del crecimiento (raíz *mag-*), cuyo nombre da probablemente nombre al mes." Add `"Maia"` to the deity field.
- **Fix**: Change `deity` to `"Maia / Bona Dea / Lares Praestites"` and expand `deityDesc`. Update `festivalName` to `"Sacrificio a Maia / Dedicaciones"`.
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Mania sacrifice (Day 11)

- **App**: key `"4-11"` has only the generic Lemuria entry; no mention of Mania.
- **Source**: Scullard p. 119 — "Ma[niae] sacrifice. Day: 11. Fasti status: N, Dies religiosus (V ID. MAI.) — listed in Ant. mai. as *Ma[niae]*. Deity: Mania (mother of the Lares, *Mater Larum*). A sacrifice was made, probably to Mania rather than to Mars or Mater Matuta… The Lemuria was considered a suitable time for Mania to receive sacrifice."
- **Issue**: The Fasti Antiquitatis Maioris specifically list a sacrifice to Mania (Mater Larum) on May 11, separate from the generic Lemuria. This is attested in the epigraphic calendar and discussed by Scullard. Fowler does not separately cover Mania on May 11, so this is a single-source finding, but from a primary epigraphic source cited by Scullard.
- **Suggested festivalDesc addition to `"4-11"`**: Add a parenthetical note: "El calendario Antiquitatis Maioris registra también un sacrificio a Mania (Mater Larum, madre de los Lares) en este día de la Lemuria."
- **Priority**: LOW (single-source, parenthetical in Scullard)

---

## MISSING_FESTIVAL: Mars Invictus temple anniversary (Day 14)

- **App**: key `"4-14"` lists only the Argei; no Mars Invictus entry.
- **Source**: Scullard pp. 119–120 — "Marti Invicto (Ven.). Day: 14. Fasti status: C (PR ID.). Temple of Mars Invictus in the Circus Flaminius, founded by D. Junius Brutus Callaicus (consul 135 BC). Temple designed by a Greek architect and decorated with verses of the poet Accius; contained a colossal statue of Mars by Scopas."
- **Issue**: The Fasti Venusini explicitly record a dedication anniversary for Mars Invictus on May 14 (pridie Idus). The app only places the Argei on that day and ignores this temple anniversary.
- **Suggested addition to `"4-14"` festivalDesc**: "El 14 de mayo (pridie Idus) se conmemoraba también la dedicación del templo de Marte Invicto en el Circo Flaminio, fundado por D. Junio Bruto Callaico (cónsul 135 a.C.) y decorado con versos de Accio; contenía una estatua colosal de Marte, obra de Scopas."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Feriae Volcano (Day 23)

- **App**: key `"4-23"` covers only the Tubilustrium with Vulcan as deity; Feriae Volcano is not named as a distinct festival.
- **Source**: Scullard p. 123 — "*Feriae Volcano* listed alongside (Ven. and Amit.)… the Romans invented a link [with the Tubilustrium]." Fowler pp. 123–124 — Feriae Volcano is a separate entry, with the Flamen Volcanalis's role throughout May (sacrificing to Maia on 1 May, honoured again on 23 May). Two calendars (Venusini, Amiterninum) explicitly attest *Feriae Volcano*.
- **Issue**: Both sources treat Feriae Volcano on May 23 as a genuine and separately attested festival (two fasti calendars), not a mere gloss of the Tubilustrium. The app collapses the two. The Feriae Volcano is attested in the same two sources (Venusini, Amiterninum) and should appear as a named companion entry.
- **Suggested festivalDesc note on `"4-23"`**: "En el mismo día los calendarios Venusino y Amiternino registran las *Feriae Volcano*, festival independiente de Vulcano que coincide con el Tubilustrium sin estar vinculado a él en origen."
- **Priority**: MEDIUM

---

## MINOR: Ludi Martiales / Mars Ultor (Day 12)

- **App**: key `"4-12"` | status=`NP` | festivalName="Dedicación del Templo de Marte Ultor" | festivalDesc="Juegos en el Circo que conmemoran la dedicación del templo de Marte en el foro de Augusto (2 a.C.)."
- **Source**: Neither Scullard nor Fowler mention May 12 in connection with Mars Ultor. Fowler's work focuses on the Republic and would not cover Imperial additions. The temple of Mars Ultor (Forum of Augustus) was dedicated 1 August 2 BCE per the *Res Gestae* (21.2), not May 12.
- **Issue**: The dedication date of the temple is wrong (it was 1 August, not May 12). The app may be conflating this with Augustan-era *ludi* held in May in honor of Mars, which is a separate calendrical matter. Neither source confirms May 12 for this event. The stated date of "2 a.C." for the dedication is correct historically but the month (August, not May) is wrong per the *Res Gestae*.
- **Fix**: Verify against Ovid *Fasti* Book 5 or the *Feriale Duranum* whether May 12 holds any Augustan Mars rite. If no primary source confirms it, remove or qualify. If kept, correct the description to distinguish between the temple dedication date (1 August) and whatever Augustan festival may fall on May 12.
- **Priority**: MEDIUM (factual error in dedication date if the *Res Gestae* date is used)

---

## MINOR: Maia absent from May 15 deity list

- **App**: key `"4-15"` | deity="Mercurio / Júpiter"
- **Source**: Scullard p. 122 — "Mercurio et Maiae (Mercury's birthday). Fasti status: NP (ID. MAI.) — also *Feriae Iovi* (Ven.), *Natalis Mercurii* (Phil.), *Sacrum Mercurio* (Menol.)." Fowler p. 120 — "calendars (Tusculum, Venusini, Caere) record: *Feriae Iovi. Mercurio. Maiae. Maiae ad circum Maximum. Mercurio.*"
- **Issue**: Both sources name all three deities on the Ides of May: Jupiter (every Ides), Mercury, and Maia. The app omits Maia from the deity field. Maia is well-attested epigraphically (the ancient calendars name her explicitly).
- **Fix**: Change `deity` to `"Mercurio / Júpiter / Maia"` and update `deityDesc` accordingly.
- **Priority**: LOW

---

## Summary

| Category | Count | Keys affected |
|---|---|---|
| WRONG_STATUS | 4 | 4-1, 4-9, 4-11, 4-13 |
| WRONG_DEITY | 1 | 4-29 |
| WRONG_RITUAL | 5 | 4-9 (bean rite), 4-14 (material + actors), 4-14 (date dispute), 4-23 (Vulcan link), 4-24 (QRCF) |
| MISSING_FESTIVAL | 4 | Maia (4-1), Mania (4-11), Mars Invictus (4-14), Feriae Volcano (4-23) |
| MINOR | 2 | 4-12 (Ludi Martiales wrong dedication date), 4-15 (Maia omitted) |
| **TOTAL** | **16** | |

**Priority breakdown:**
- HIGH (fix immediately): 5 — Kalends status (4-1), all three Lemuria statuses (4-9, 4-11, 4-13), missing Maia sacrifice (4-1)
- MEDIUM: 8 — bean rite wording, Argei material/actors, Argei date dispute, Tubilustrium/Vulcan link, QRCF description, Mars Invictus missing, Feriae Volcano missing, Ambarvalia deity, Ludi Martiales date
- LOW: 3 — Mania sacrifice note, Maia on May 15 deity list

**Key interpretive note for all Lemuria entries (4-9, 4-11, 4-13):** Both sources stress that the N (nefastus) classification, not NP, is historically and theologically significant: the dead of the Lemuria are hostile (*lemures*), in contrast to the friendly dead of the Feralia (February). Correcting the status from NP to N should also be reflected in the `statusFull` and `deityDesc` fields to convey that these are days of avoidance and appeasement, not merely restricted-morning days.

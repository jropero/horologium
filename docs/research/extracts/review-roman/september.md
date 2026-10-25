# September — Roman Calendar Review
**App data**: `utils/romanYearData.ts`, keys "8-1" through "8-30"
**Sources**: Scullard (1981) pp. 182–192; Fowler (1899) pp. 215–235
**Reviewed**: 2026-10-25

Context: September is dominated by the Ludi Romani (5–19 Sep). Fowler calls the calendar "almost a blank." Only the Kalends, Nones, and Ides carry the large-letter designation; the remaining entries are temple dedication anniversaries and the post-Ludi Mercatus. No day other than Sep 13 (Ides) bears NP status among the Ludi days.

---

## WRONG_DATE: Ludi Romani / Day 4

- **App**: key "8-4" | status=C | festivalName="Ludi Romani" | deity="Júpiter" | festivalDesc="Comienzo de los masivos Juegos Romanos…"
- **Source**: Scullard p. 183–186: "Day: 5–19 (by the late Republic)". Fowler p. 215: "Days: Sep 5–19 (in Cicero's time; Sep 4 probably added after Caesar's death per Mommsen, C.I.L. 338)." — Fowler presents the Sep 4 start as Mommsen's inference based on one imperial-era inscription, not as a Republican-era attestation.
- **Issue**: The app marks Sep 4 as the opening day of the Ludi Romani ("Comienzo…"). The well-attested Republican date range is 5–19. The Sep 4 start is an uncertain Mommsen inference tied specifically to posthumous honours for Caesar in the imperial period; it should not be presented as the opening day without qualification.
- **Fix**: Remove `festivalName` and `festivalDesc` from "8-4". The Ludi Romani begin on "8-5" (September 5, the Nones). If a Sep 4 entry is desired, mark it as `festivalDesc: "Posiblemente primer día de los Ludi Romani en época imperial, según Mommsen (C.I.L. 338); la fecha republicana certificada es el 5 de septiembre."` and status C with no deity.
- **Priority**: HIGH

---

## WRONG_DEITY: Dedicatio Iunoni Reginae / Day 1

- **App**: key "8-1" | status=NP | festivalName="Dedicación de Juno Regina" | deity="Juno Regina" | festivalDesc="Dedicación oficial del templo consagrado a la protectora Juno Regina en el monte Aventino."
- **Source**: Scullard p. 183: September 1 marks three separate temple dedications — Iovis Tonantis (by Augustus 22 BC), Iovis Liberi (restored by Augustus), and Iunonis Reginae in Aventino (originally 392 BC, statue evoked from Veii by Camillus). The aition for Juno Regina is explicit: Camillus vowed the temple to persuade the goddess to abandon Veii before the siege (evocatio); after the city's capture in 396 BC the Aventine temple was built in 392 BC.
- **Issue**: The app records only Juno Regina. Two Jovian dedications on the same day (Jupiter Tonans and Jupiter Liber) are omitted from both the deity field and the festivalDesc. The evocatio aition, which Scullard gives explicitly, is absent from the festivalDesc.
- **Fix**: deity field: `"Juno Regina; Júpiter Tonante; Júpiter Libre"`. festivalDesc should note (a) the Camillus evocatio aition for Juno Regina; (b) that Jupiter Tonans and Jupiter Liber were also rededicated by Augustus on this day.
- **Priority**: MEDIUM

---

## WRONG_STATUS: Kalendae Septembres / Day 1

- **App**: key "8-1" | statusFull="Kalendae" | status=NP
- **Source**: Scullard p. 183: "Fasti status: F" for the September 1 dedication entries. The Fasti Praenestini and Fasti Antiates confirm the September Kalends as F, not NP. While most Kalends carried NP status in the standard reconstruction, the September Kalends appears as F in the surviving Republican fasti.
- **Issue**: The app assigns NP, following the default assumption that all Kalends are NP. Scullard explicitly gives F for September 1. This is a case where the default pattern overrides the specific calendar evidence.
- **Fix**: status should be `'F'`, statusFull `"Kalendae"`.
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Dedicatio Iovis Statoris / Day 5

- **App**: key "8-5" | status=F | statusFull="Nonae" | deity="Júpiter" | festivalName="Ludi Romani" | no mention of Iovis Statoris
- **Source**: Scullard p. 183: "Day: 5 (Nonae Septembres). Fasti status: F. Deity: Jupiter Stator. Ritual: Temple anniversary. A second temple of Jupiter Stator was dedicated in 146 BC by Q. Caecilius Metellus Macedonicus near the Circus Flaminius (beneath the later church of S. Maria in Campitelli). Metellus also built the adjacent temple to Juno Regina. These two temples were probably the first all-marble temples in Rome; Lysippus's bronze equestrian statues of Alexander's generals were displayed in front of the Jupiter Stator temple."
- **Issue**: The Sep 5 Dedicatio Iovis Statoris does not appear anywhere in the app. The day is taken entirely by the Ludi Romani entry. Both dedications (Metellus's temple and the earlier 294 BC one) are historically significant.
- **Suggested entry**: Add a note to the "8-5" festivalDesc, e.g.:
  ```
  festivalDesc: "Nones de septiembre. Inicio de los Ludi Romani. También en este día, aniversario de la dedicación del templo de Júpiter Estator construido por Q. Cecilio Metelo Macedónico en 146 a.C. cerca del Circo Flaminio — posiblemente el primer templo de mármol macizo de Roma, adornado con las estatuas ecuestres de bronce de los generales de Alejandro, obra de Lisipo."
  ```
- **Priority**: MEDIUM

---

## WRONG_DEITY: Epulum Iovis / Day 13

- **App**: key "8-13" | status=NP | festivalName="Epulum Jovis" | deity="Júpiter" | festivalDesc="Banquete central de los Idus consagrado a la Tríada Capitolina; los senadores comían ritualmente junto a imágenes de los dioses."
- **Source**: Scullard p. 186–187: "Deity: Jupiter Optimus Maximus; Juno; Minerva." Fowler pp. 217–220: "Deity: Jupiter, Juno, Minerva (the Capitoline Triad)." Both sources explicitly name all three members of the Capitoline Triad. Scullard: "images of the three Capitoline deities presided dressed for a banquet: Jupiter's face was reddened with minium and he reclined on a lectulus; Juno and Minerva were seated on sellae."
- **Issue**: The app's `festivalDesc` correctly names the "Tríada Capitolina" in the text, but the `deity` field lists only "Júpiter". This is an internal inconsistency and a WRONG_DEITY error in the structured field.
- **Fix**: `deity: "Júpiter; Juno; Minerva"`, `deityDesc: "La Tríada Capitolina: Júpiter Óptimo Máximo, Juno y Minerva."`. Additionally, the festivalDesc is accurate as far as it goes but omits (a) Jupiter's face reddened with minium; (b) Jupiter on a lectulus, Juno and Minerva on sellae; (c) the role of the Vestal Virgins (mola salsa); (d) the clavus annalis ceremony on the same day (nail driven into the Capitoline temple wall). These are enrichments rather than errors.
- **Priority**: HIGH

---

## WRONG_DEITY: Equorum Probatio / Day 14

- **App**: key "8-14" | status=F | festivalName="Equorum Probatio" | deity="Marte / Júpiter" | festivalDesc="Exhibición, revisión y purificación militar de los caballos romanos durante la estructura de los grandes juegos."
- **Source**: Scullard p. 188: "Fasti status: F Dies religiosus. Deity: None named." Fowler p. 215–216: describes the equorum probatio as a preliminary to the races, taking place on Sep 14 (the day after the Ides), but names no deity. No source names Mars or Jupiter as the deity of this event.
- **Issue**: Two separate errors. (1) WRONG_DEITY: No source assigns Mars or Jupiter to the equorum probatio. The July 15 transvectio equitum has stronger Martian associations, but the September equorum probatio is a distinct, later event with no named patron deity. (2) WRONG_RITUAL: The app says "purificación militar" (military purification). Neither Scullard nor Fowler describe this as a purification rite. It is a cavalry review (equorum probatio = inspection/approval of horses). Scullard also cautions the entry may be imperial-era only and absent from the Republican Fasti Antiates maiores.
- **Fix**: `deity: "Ninguna"`, `deityDesc: "Sin deidad patrona específica."`. festivalDesc: `"Revista y aprobación oficial de los caballos de la caballería romana (equorum probatio), celebrada el día después de los Idus, previa a las carreras circenses de los Ludi Romani. Scullard advierte que este evento no aparece en los Fasti Antiates maiores republicanos y podría ser de época imperial."`.
- **Priority**: HIGH

---

## WRONG_STATUS: Ludi Romani / Day 15

- **App**: key "8-15" | status=NP | statusFull="Dies Nefastus Publicus" | festivalName="Ludi Romani"
- **Source**: Scullard p. 183–186: "Fasti status: Not stated as a unit; the central day (13 Sep) is NP." Fowler p. 215–216: the NP Ides is Sep 13. No source assigns NP status to Sep 15. The ludi days outside the Ides (Sep 5–12 and 14–19) carry F or C designations in the surviving calendars; only Sep 13 (Ides) is NP.
- **Issue**: The app marks Sep 15 as NP without source support. Fowler does note Sep 15 may have been the "real centre-point" for the pompa circensis, but he gives it no special calendar status — he is speaking of the probable historical sequence of ceremonies, not of the fasti designation.
- **Fix**: `status: 'C'`, `statusFull: "Dies Comitialis"`. Alternatively `'F'` if the surviving fasti for that day are F. NP is not supported.
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Mercatus / Days 20–23

- **App**: keys "8-20", "8-21", "8-22", "8-23" — no Mercatus entry. Key "8-20" through "8-22" have no festivalName at all.
- **Source**: Scullard p. 188: "After the Games (20–23 Sep), market days (Mercatus) were held." Scullard analogises these to the Mercatus following the Apolline Games of 13 July. This is a recognized post-Ludi institution, not a minor footnote.
- **Issue**: The Mercatus (Sep 20–23) is entirely absent from the app. This is an attested element of the September calendar.
- **Suggested entries**: For keys "8-20" through "8-23" (alongside the Apollo dedication on 8-23):
  ```
  festivalName: "Mercatus"
  festivalDesc: "Días de mercado (mercatus) que seguían inmediatamente a los Ludi Romani, análogos a los mercatus posteriores a los Ludi Apollinares de julio. Reunían a comerciantes y público en Roma tras las festividades."
  deity: "Ninguna"
  ```
  Key "8-23" already has the Apollo dedication; add the Mercatus as a secondary note in the festivalDesc.
- **Priority**: MEDIUM

---

## MINOR: Dedicatio Apollini et Latonae / Day 23

- **App**: key "8-23" | status=C | festivalName="Dedicación del Templo de Apolo" | deity="Apolo" | festivalDesc="Celebración cívica conmemorando la dedicación del primer templo a Apolo en el Campo de Marte (431 a.C.)."
- **Source**: Scullard p. 188: "Deity: Apollo; Latona." The temple on Sep 23 was the restoration by C. Sosius (consul 32 BC), who chose Augustus's birthday for the rededication. The original 431 BC dedication date is uncertain — Scullard says "possibly 13 July." The Sep 23 calendar entry is for the Sosian restoration, not the original 431 BC foundation.
- **Issues**: (1) WRONG_DEITY: Latona (Leto) is absent from the app's deity field. (2) MINOR: The festivalDesc attributes the 431 BC original dedication to Sep 23. What falls on Sep 23 is the Sosian restoration (c. 32 BC); the original 431 BC date is uncertain (possibly July 13). Presenting Sep 23 as the 431 BC original dedication date is misleading.
- **Fix**: `deity: "Apolo; Latona"`. festivalDesc: `"Aniversario de la restauración del templo de Apolo y Latona en el Campo de Marte, rededicated por Cayo Sosio (cónsul 32 a.C.) en el cumpleaños de Augusto. La dedicación original (431 a.C.) tuvo posiblemente lugar el 13 de julio. El templo, conocido como de Apolo Sosiano, albergaba obras de arte de gran valor; tres de sus columnas fueron re-erigidas en 1940."`.
- **Priority**: MEDIUM

---

## MINOR: Dedicatio Veneri Genetrici / Day 26

- **App**: key "8-26" | status=C | festivalName="Dedicación de Venus Genetrix" | festivalDesc="Aniversario de la dedicación del templo principal en el Foro de Julio César (46 a.C.)."
- **Source**: Scullard p. 188: agrees on Sep 26, 46 BC, Foro of Julius Caesar. Aition: Caesar's vow at the battle of Pharsalus (48 BC) — explicit founding occasion per Scullard.
- **Issue**: The festivalDesc is factually correct but omits the Pharsalus vow aition, which Scullard describes as "the explicit founding occasion." No invented content; this is an enrichment gap.
- **Fix**: Add to festivalDesc: `"Julio César había prometido el templo a Venus Genetrix —ancestral de la gens Iulia— antes de la batalla de Farsalo (48 a.C.); fue inaugurado el 26 de septiembre de 46 a.C., último día de su triunfo. Contenía una estatua dorada de Cleopatra y una coraza decorada con perlas de Britania."`.
- **Priority**: LOW

---

## Summary

| Category | Count | Days affected |
|----------|-------|---------------|
| WRONG_DATE | 1 | 4 |
| WRONG_DEITY | 4 | 1, 13, 14, 23 |
| WRONG_STATUS | 2 | 1, 15 |
| WRONG_RITUAL | 1 | 14 |
| MISSING_FESTIVAL | 2 | 5 (Iovis Statoris), 20–23 (Mercatus) |
| MINOR | 2 | 23 (wrong occasion implied), 26 (aition gap) |
| **Total** | **12** | |

### Priority breakdown
- **HIGH** (fix before next release): 3 findings — WRONG_DATE on day 4 (Ludi start), WRONG_DEITY on day 13 (Epulum missing Juno + Minerva in deity field), WRONG_DEITY + WRONG_RITUAL on day 14 (invented Mars/Jupiter deity and purification ritual for Equorum Probatio)
- **MEDIUM**: 6 findings — days 1 (status and deity), 5 (missing Iovis Statoris), 15 (wrong status NP), 20–23 (missing Mercatus), 23 (Latona missing + wrong occasion)
- **LOW**: 1 finding — day 26 (aition enrichment only)

### Key structural note
The Ludi Romani (Sep 5–19) are correctly represented as the dominant feature of the month. The most serious structural error is the Equorum Probatio entry (8-14): it invents both a deity (Mars/Jupiter) and a ritual type (purification) that no source supports. The second most serious is the Epulum Iovis deity field listing only Jupiter when both Scullard and Fowler clearly name the full Capitoline Triad.

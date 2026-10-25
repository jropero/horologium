# Babylonian Festival Data — Scholarly Review 2026-10-25

## Sources

- Cohen, M. E. *The Cultic Calendars of the Ancient Near East*. CDL Press, Bethesda, 1993. [Cohen]
- Linssen, M. J. H. *The Cults of Uruk and Babylon: The Temple Ritual Texts as Evidence for Hellenistic Cult Practices*. Cuneiform Monographs 25, Brill/Styx, Leiden, 2004. [Linssen]
- Thureau-Dangin, F. *Rituels Accadiens*. Ernest Leroux, Paris, 1921. [T-D]
- Jacobsen, T. *The Treasures of Darkness: A History of Mesopotamian Religion*. Yale University Press, 1976. [Jacobsen]

**Primary tablets cited by Linssen/T-D:** RAcc. = T-D composite text (DT.15, DT.109, DT.114, MNB.1848) for Babylon Nisannu; TU 39–40, K 3753, LKU no. 51, SBH VII–VIII, BRM 4,25, BM 32206+ for Uruk and Babylon Hellenistic ritual series.

**Scope note on Jacobsen:** Jacobsen (1976) is a literary and religious history organized around mythological metaphor, not a festival calendar. He gives no day-specific calendar data. His contribution here is confirming myth backgrounds and general festival patterns; he neither confirms nor contradicts the app's day-level entries.

---

## Summary

**8 HIGH findings** (factual errors: WRONG_RITUAL, WRONG_DEITY, WRONG_DAY, INVENTED)  
**6 MEDIUM findings** (sourcing issues: UNCERTAIN_DAY, WRONG_CITY, NOT_ATTESTED)  
**3 MINOR/LOW findings** (wording, uncertain derivations, downstream text errors)  
**7 missing festivals** attested in sources but absent from the app  
**20 entries confirmed** by at least one source with no discrepancy

---

## Findings by Severity

---

### HIGH — Factual Errors

---

**[Nisannu] Day 1 — Akītu comienza** `WRONG_RITUAL`

- Current app: "La estatua de Marduk abandona el Esagila y parte en procesión hacia el Bīt Akitu extramuros de Babilonia."
- Sources say: The Nisannu tablet text begins at Day 2/3 (T-D, p. 129: "DT.15, col. I — lines 1–40 are lost; Day 1 is not covered"). T-D's commentary (p. 146–147) places the procession departure from Esagila to the Bīt Akītu unambiguously on **Day 8**. Linssen (pp. 83–85) independently confirms: "Day 8: Clothing ceremony for Marduk; procession of Bēl from Esagila … moving to the akītu-temple" (Diaries no. -204; SBH VIII; Chronicles 13b). Day 1 ceremonies in Babylon are only minimally attested (regular offerings, pīt bābi opening; Linssen pp. 79, 90), with no procession departure.
- Correction: Day 1 entry should describe the opening of the festival (meager evidence: high priest enters courtyard, key ceremony, regular offerings — Çağirgan *Festivals* 1; AB 244 rev. 30, per Linssen p. 79), not Marduk's departure. The departure from Esagila belongs to the Day 8 entry. The month-level `description` and `festival` fields also contain "La estatua de Marduk parte del Esagila en gran procesión" — this language should be moved to Day 8.

---

**[Nisannu] Day 4 — Enūma Eliš** `WRONG_RITUAL` (event conflation)

- Current app: "En la noche del cuarto día, los sacerdotes recitan el Enūma Eliš — el poema de la creación — ante Marduk. El rey es humillado: depone su cetro y confiesa sus pecados ante el dios."
- Sources say: T-D (pp. 133–134, DT.15 col. VI, lines 280–284) explicitly places the **Enūma Eliš recitation at the end of Day 4**. The **king's humiliation is Day 5** (T-D, DT.109 + MNB.1848, lines 414–450, pp. 144–145): the *urigallu* removes the sceptre (*ḫaṭṭu*), golden circle (*manšaltu*), and sword-harp (*harpē*); strikes the king's cheek ("leḫ šarri imḫaṣ," line 421); king kneels and confesses; regalia returned (line 450). Linssen (pp. 81–82, RAcc. lines 413ff.) confirms this day-by-day separation: "Enūma Eliš is Day 4 … the king's humiliation is Day 5."
- Correction: Day 4 entry = Enūma Eliš recitation only. King humiliation → move to a new Day 5 entry (see Missing Festivals below).

---

**[Nisannu] Day 8 — Gran procesión** `WRONG_RITUAL` + `WRONG_DAY`

- Current app: "La gran procesión de Marduk **regresa** del Bīt Akitu al Esagila. El rey **recupera su cetro y es reinvestido** de autoridad real para el año venidero."
- Sources say: Two independent errors on this day.
  - *Direction reversed.* T-D (p. 147): "La partie de ce rituel relative à la procession de l'akītu ne nous est pas parvenue" — reconstructed from royal inscriptions as Marduk **departing** from Esagila toward the Bīt Akītu on Day 8. Seven ritual stages are named (sanctuary → between the curtains → star seat → *parak šīmāti* → street → boat → Bīt Akītu). The **return** is Day 11 (T-D p. 148, citing Nebuchadnezzar inscription Nbk. n°15, II, 57). Linssen (pp. 83–85): "Day 8: procession of Bēl from Esagila … to the akītu-temple" (outward); "Day 11: Return from akītu-temple back to Esagila."
  - *Reinvestiture misplaced.* The king's regalia are returned on **Day 5** (T-D, line 450, p. 145; Linssen pp. 81–82), immediately after his confession and the tear-omen. There is no reinvestiture ceremony on Day 8 in either source.
- Correction: Day 8 = procession **departs** from Esagila to Bīt Akītu. Remove all mention of return or reinvestiture. Reinvestiture → Day 5 entry.

---

**[Nisannu] Day 11 — Akītu concluye** `INVENTED` (venue name)

- Current app: "Los destinos del año son fijados en la Asamblea de los Dioses en el **templo Upuruppuu** de Babylon."
- Sources say: T-D (p. 148) confirms Day 11 as the last day of the festival and attests Marduk passing through the *parak šīmāti* (Shrine of Destinies) on his return (Nbk. n°15, II, 57). T-D does not mention any temple named "Upuruppuu." The **Upšukkannakku shrine** is where Nabû and Marduk meet on **Day 5** (T-D p. 144), not Day 11. T-D states explicitly that an "Assembly of Gods" (*puhru*) ceremony on Day 11 is not described in the surviving text. Linssen (pp. 83–85) confirms Day 11 = return to Esagila, passage of *parak šīmāti*, Bēl determines destinies, and the marriage festival (*ḥadaššūtu*) of Marduk and Zarpanītu — no "Upuruppuu."
- Correction: Replace "templo Upuruppuu" with "*parak šīmāti* (Santuario de los Destinos)" within the Esagila complex. Remove "Asamblea de los Dioses" as a named ceremony; replace with "Marduk fija los destinos del año en el parak šīmāti." Add the marriage of Marduk and Zarpanītu (Linssen SBH VIII).

---

**[Ulūlu] Day 3 — Matrimonio de Anu y Antu** `WRONG_DEITY`

- Current app: "En el Eanna de Uruk, **Anu y Antu** celebran su matrimonio sagrado en el Eturnunna: las estatuas comparten el lecho divino mientras los sacerdotes recitan himnos nupciales."
- Sources say: Cohen (pp. 323–324, citing Weidner *Gestirn-Darstellungen* pl. 11, K.3753 i 7–22): "purification rites for the statues of Anu and **Ištar**, followed by a sacred marriage ceremony." The same passage notes that clothing ceremonies for Anu and Adad are separate rites on Day 3, while the marriage ceremony belongs to **Ištar**. Linssen (K 3753, pp. 70–71): "Marriage ceremony of **Ištar** (*ḥadaššūtu* or wedding ceremony, K 3753; 'the whole month of Ulūlu deals with Ištar,' K 3753, I, 9)." Both independent sources agree: the marriage is Ištar's, not Antu's.
- Correction: Replace "Anu y Antu" with "Ištar" (or Anu and Ištar if the clothing ceremony of Anu is included). Antu is Anu's traditional consort and overlaps with Ištar in Uruk theology, but the text specifies Ištar as the marriage partner. The venue "Eturnunna" also needs sourcing verification; the primary text cites the Eanna complex.

---

**[Araḫsamnu] Day 18 — Disputa Azada–Arado** `WRONG_RITUAL`

- Current app: "Los cantores recitan la «Disputa de la Azada y el Arado» en sumerio ante los dioses."
- Sources say: Cohen (p. 331) confirms the Hoe and Plow disputation was recited during this month (per Astrolabe B: "the hoe and plow hold a dispute in the field"), but **assigns no specific day number**. For Day 18 specifically, Linssen (BRM 4,25; SBH VII, pp. 64, 90) documents a **ceremony for Šamaš with a brazier festival (*kinūnu*) at Babylon**, plus a **procession of the Sons of Bēl** (*mārī Bēl*) to the temple of Adad (Enamḫe) at Babylon. The Dispute is a month-level tradition (confirmed, no day); Day 18 belongs to the Šamaš brazier and Sons of Bēl ceremony (attested).
- Correction: Day 18 entry should describe the Šamaš brazier festival and Sons of Bēl procession (Linssen BRM 4,25; SBH VII). The Dispute of the Hoe and Plow is a month-level feature, not tied to Day 18 — remove it from the `dayEvent` or leave it in the month description without a day assignment.

---

**[Duʾūzu] Day 28 — Día de Tammuz** `WRONG_RITUAL` (wrong festival name)

- Current app: shortLabel "Día de Tammuz"; description references Tammuz rising.
- Sources say: Cohen (p. 316, citing LKU 51 obv. 28–31 and the Livingstone *Court Poetry* text) gives the attested name for Day 28 at Uruk as **"Day of the Stall" (*u₄ TÚG.si₄*)** — the sheepfold or stall where Dumuzi was captured by the *gallā*-demons. Cohen (p. 317) also notes "Tammuz rises at the request of [...]" for Day 28, but the named festival designation in the cuneiform source is "Day of the Stall," not "Day of Tammuz."
- Correction: Change shortLabel to "Día del Aprisco" or "Día del Redil" (*u₄ TÚG.si₄*) with a note that Tammuz "rises" on this day. The current label "Día de Tammuz" is a reasonable summary but misses the primary attested name, which is specific to the stall/sheepfold setting of Dumuzi's capture.

---

**[Ṭebētu] Day 16 — Akītu de Ištar** `WRONG_DEITY` + `WRONG_PLACE`

- Current app: "El Akītu de Ištar ilumina el **Emagmaš de Uruk**."
- Sources say: Linssen (TU 41, pp. 59, 68, 89, 122–124) describes the nocturnal ceremony on Days 16–17 of (likely) Ṭebētu at **Uruk** as a festival for **Anu** at the Rēš-temple — not for Ištar. It involves the scepter and lamp-shoe (Nusku), torch (*gizillû*) procession, kindling of brushwood piles, and an all-night vigil before Anu and Antu. Cohen (p. 335) does attest an Akītu of Ištar on Day 16, citing Livingstone *Court Poetry* 18–19 (= ABRT 1 7ff.): "On the 16th of Ṭebet is her awakening (*e-ra-šâ*), she brightens **Emagmaš**" — but the Emagmaš is an **Assyrian** temple of Ištar at Assur, not at Uruk. The app conflates the Assyrian Ištar-Emagmaš event with Uruk, placing an Assyrian Ištar festival at a Uruk location that actually hosted an Anu ceremony.
- Correction: Either split into two entries — (a) Uruk: nocturnal torch procession for Anu at Rēš-temple (Linssen TU 41); (b) Assyria: Akītu of Ištar at Emagmaš (Cohen/Livingstone) — or clarify that "Emagmaš" is at Assur, not Uruk, and the Uruk nocturnal ceremony is for Anu. Do not combine them.

---

### MEDIUM — Sourcing Issues

---

**[Aiaru] Day 7 — Coronación de Nabû** `WRONG_CITY`

- Current app: "Nabû llega al **Eanna de Uruk** y asume la corona de Anu como rey de los dioses."
- Sources say: Cohen (p. 311, citing a Seleucid Babylon ritual text) places Nabû's assumption of Anu's kingship on Day 7 at the Eanna — in Cohen's context this is a Uruk source. However, Linssen (SBH VIII, II, 23ff., pp. 63, 68, 90) attests the Day 7 ceremony for Nabû only at **Babylon** (specifically at Emeurur, the garden of Anu in Babylon). Linssen has no Uruk data for month II. The "crowned king of gods" language is not in Linssen's text; Day 7 is a procession/garden ceremony. City attribution is genuinely disputed across sources.
- Correction: Note in the description that the ceremony is attested at Babylon (Linssen SBH VIII) and possibly also at Uruk (Cohen, from Seleucid ritual text). The "coronación" / "crowned king" language is Cohen's inference from the phrase "he has assumed Anu's kingship … he wears Anu's crown"; it is a reasonable paraphrase. Mark city as uncertain.

---

**[Araḫsamnu] Day 1 — Akītu de la siembra** `NOT_ATTESTED` (specific day)

- Current app: "El Akītu de la estación de la siembra (a-ki-tu ur) da inicio."
- Sources say: Cohen (p. 331, Astrolabe B) confirms the Akītu of the seeding season (*á-ki-ti-šu-numun*) during this month, but **does not assign Day 1** as the opening day. Linssen has no Day 1 data for Araḫsamnu in either Uruk or Babylon. The month-level Akītu is well attested; the Day 1 assignment is undocumented.
- Correction: Retain the month-level Akītu description in the `festival` field. Either remove the Day 1 `dayEvent` or label it explicitly as "uncertain: month-level festival, specific day not attested."

---

**[Ulūlu] Day 1 — Lustración de las diosas** `UNCERTAIN_DAY`

- Current app: "«La obra de las diosas» (gipir Ištarāte) da inicio. Las estatuas de las grandes diosas son transportadas … hasta el río sagrado."
- Sources say: Cohen (p. 322, Astrolabe B: "the goddesses are purified in the sacred river") confirms a month-wide lustration series, but the **first specific day Cohen gives is Day 2** (Uruk, p. 323). Cohen does not assign Day 1 as the opening of the lustration. Linssen has no Day 1 data for Ulūlu. The *gipir Ištarāte* expression (= "work of the Ištarāte") is confirmed for the month (Streck Asb., 118 Cyl B v 77–79, cited by Cohen p. 322) but not for Day 1 specifically.
- Correction: Either mark Day 1 as approximate ("uncertain: month opening inferred, not directly cited") or consolidate into the month description without a `dayEvent`.

---

**[Abu] Day 1 — Ab/pum se abre** `UNCERTAIN_DAY`

- Current app: "El montículo sagrado (ab/pum) se abre sobre la puerta del Inframundo."
- Sources say: Cohen (pp. 319–321) confirms the *ab/pum* as a month-long observance of benign and malevolent ghosts returning; "the month apparently involved a series of lustrations" and athletic contests. He **does not assign Day 1** as the specific day the passage opens. The first dated entry Cohen gives for Abu is Day 28 (Maqlu, p. 320). Jacobsen does not discuss the *ab/pum* rite.
- Correction: Mark as approximate or move to month description. "Day 1" as the opening of the *ab/pum* is a logical inference, not a documented day number.

---

**[Abu] Day 16 — Certámenes de Gilgameš** `UNCERTAIN_DAY`

- Current app: "Comienzan nueve días de carreras a pie, luchas y certámenes atléticos en honor de Gilgameš."
- Sources say: Cohen (p. 319, Astrolabe B: "for nine days men contest in wrestling and athletics in their city quarters") confirms nine days of athletic contests honoring Gilgameš during Abu, but **gives no start date**. Day 16 is not assigned by Cohen or any other source in these extracts. Linssen has no Abu data.
- Correction: Mark Day 16 as unattested ("start date uncertain: nine days confirmed by Astrolabe B, specific first day not cited"). Alternatively move the nine-day contest to the month description without a start day.

---

**[Šabāṭu] Day 7 — Matrimonio sagrado** `UNCERTAIN_DAY`

- Current app: "Bēl desposa a Beltiya, su esposa divina; simultáneamente Nabû desposa a Tašmētu en el Ezida de Borsippa."
- Sources say: Cohen (p. 337, citing the Nergal-šarrani letter to Esarhaddon = ABL 65 = AOAT 5/1, 267–268) confirms "during this month there may have been a double marriage between Bēl and Bēltiya and between Nabû and Tašmētu." Cohen uses tentative language and **does not assign Day 7**. Linssen has no Hellenistic Babylon or Uruk data for Šabāṭu. Jacobsen's hieros gamos discussion covers Sumerian traditions (Dumuzi/Inanna in spring, Nanna in month 12), not this Neo-Babylonian pair, so he neither confirms nor contradicts. Day 7 needs a specific source.
- Correction: The sacred marriage in Šabāṭu is correctly attributed to the month (Cohen p. 337). Day 7 assignment has no textual backing in these sources. Mark as approximate or note the lack of a specific day.

---

### MINOR/LOW — Wording and Downstream Errors

---

**[Nisannu] Month description and festival field** `WRONG_DAY` (downstream from Finding #3)

- The month-level `description` reads: "el día 8.º recupera su poder soberano para otro año."
- The `festival` field reads: "humillación y reinvestidura del rey ante Marduk el día 8.º."
- These repeat the Day 8 reinvestiture error. Per T-D (line 450, p. 145) and Linssen (pp. 81–82), reinvestiture is Day 5. Update both fields to reference Day 5 after the Day 5 `dayEvent` is added.

---

**[Tašrītu] Day 8 — Enūma Eliš recited** `UNCERTAIN`

- Current app: "Los cantores recitan el Enūma Eliš ante Marduk por segunda vez en el año."
- Sources say: Cohen (pp. 328–329) confirms Enūma Eliš recitation for the Tašrītu Akītu at Babylon (citing an unpublished Lambert tablet). T-D explicitly states the Enūma Eliš is Marduk's epic, associated with Babylon Nisannu; the Uruk Tišrit Akītu (AO. 6459 per T-D, p. 89) has no Enūma Eliš. Linssen fn. 424 tentatively suggests the epic may have been recited monthly at Babylon, but marks this as speculative. The "second time in the year" framing is Cohen's inference from the parallel Akītu structure; it is not directly attested for Tašrītu in any tablet text.
- Correction: Retain the Tašrītu Day 8 Enūma Eliš based on Cohen (p. 328), but note it is attested only via an unpublished Lambert tablet and is uncertain. Remove the "segunda vez en el año" phrase unless a direct source confirms it.

---

**[Šabāṭu] Day 16 — eight-day count** `MINOR`

- Current app: "Comienzan **ocho días** de lamentaciones sumerias (ershemma) en el Bīt Dagan de Asur."
- Sources say: Cohen (pp. 338–341, citing Van Driel, A 125 = *Aššur* 124ff.; BM 121206 vii) documents the major Aššur ritual beginning on Day 16 of Šabāṭu and **continuing through Day 10 of Addaru** — a total of approximately 22–24 days, not 8. The Šabāṭu portion runs Days 16–end (= 9 days within Šabāṭu); the Addaru continuation is 10 more days. "Eight days" may refer to an earlier or partial reconstruction; it is not the count given by Cohen.
- Correction: Either remove the day-count entirely or correct to "durante días en dos meses (Šabāṭu–Addaru)" with a note that the festival continues into Addaru Day 10 per Cohen pp. 338–341.

---

## Missing Festivals (Attested in Sources, Absent from App)

**Nisannu Day 5 — King's humiliation, temple purification, Nabû arrives**

The central event of the Babylon Nisannu Akītu, attested by the longest surviving tablet section (T-D: DT.109 face + MNB.1848, lines 283–460, pp. 136–146; Linssen: RAcc. lines 413ff., pp. 81–82). Events on Day 5:
1. *Urigallu* rises 4 *bēru* before dawn and purifies the Esagila.
2. Temple purification: a white ram (*immeru peṣû*) is decapitated; its carcass and head are thrown into the Euphrates. The *āšipu* (carcass-thrower) and the bearer of the ram's head remain outside the city from Day 5 to Day 12 (line 360, p. 141).
3. **Nabû arrives** at Ezida from Borsippa (attested by colophon, T-D p. 147; Linssen p. 81).
4. **King's humiliation** (lines 414–450, pp. 144–145): the *urigallu* removes sceptre, golden circle, and sword from the king; strikes the king's cheek; king kneels and confesses innocence before Bēl; high priest assures king of Bēl's support; regalia are returned; cheek struck again (tears = Bēl satisfied).
5. Banquet (*akalū*): Nabû and Marduk meet at the Upšukkannakku shrine.

Suggested `dayEvent` type: `'ritual'`.

---

**Aiaru Day 17 — Procession of Nanāja from Euršaba**

Linssen (SBH VIII, II, 27–28, pp. 68, 90): "Procession of Nanāja from Euršaba to 'the garden of the Mountain.'" This is a Babylon ceremony following the Day 2 wedding of Nabû and Ninkali (Nanāja). Suggested type: `'procession'`.

---

**Araḫsamnu Day 5 — Procession of Mīšaru from Eḫenunna**

Cohen (p. 332, citing BM 121206 vii, Van Driel *Aššur*, 90): "In Uruk there was a procession involving Mišarri from the Ehenunna temple to the temple of Adad on the 5th of the month." Linssen (TU 39 rev. 26; K 3753, pp. 68, 89): "Procession of Mīšaru (god of justice) from Eḫenunna, temple of Adad." Both sources agree. Suggested type: `'procession'`.

---

**Araḫsamnu Day 18 — Šamaš brazier festival + Sons of Bēl procession (Babylon)**

Linssen (BRM 4,25; SBH VII // BRM 4,25, obv. 6, pp. 64, 69, 90): "Ceremony for Šamaš with offerings in various temples; procession and brazier festival (*kinūnu*) of Šamaš in Babylon and neighbouring cities. Procession of the Sons of Bēl (*mārī Bēl*) to Enamḫe, the temple of Adad in Babylon." Replaces (or corrects) the current wrong Day 18 "Dispute" entry. Suggested type: `'procession'` or `'festival'`.

---

**Kislīmu Day 4 — Marduk/Zarpanītu ceremony; procession; Enūma Eliš (Babylon)**

Linssen (BM 32206+; SBH VII // BRM 4,25; BM 78076, pp. 69, 81, 91, 118): "Ceremony for Marduk and Zarpanītu; procession of a slave riding a bull and Ea's vizier Usmû from the entrance of Esagila cella to the akītu-temple; return same day; Enūma Eliš recited for Bēl by the *nāru* (singer); lamentations recited; kettledrums of Bēl and Bēltīja present." Also: "palm festival — date palm branches (*libbi gišimmari*) brought by boat to tent near Ea's temple." The current Kislīmu `dayEvents` cover only the Uruk Kinunu days (1, 2, 6, 7, 14, 15). Day 4 is a major unlisted Babylon ceremony. Suggested type: `'ritual'`.

---

**Ṭebētu Days 16–17 — Nocturnal torch procession for Anu (Uruk)**

Linssen (TU 41, pp. 59, 68, 89, 122–124): Nocturnal festival in the Rēš-temple of Anu at Uruk. Scepter and lamp-shoe descend to Grand Courtyard; Papsukkal, Nusku, Usmû sit in Anu's courtyard; torch (*gizillû*) procession through temples; fires kindled at gates; brushwood piles (*abru*) kindled from the Torch; all-night vigil; *šalām bīti* ("good-functioning") ceremony at gates; at morning, gate opened, vigil ended. Separate from (and does not contradict) the Assyrian Ištar-Emagmaš event on Day 16 in Cohen. Suggested type: `'ritual'`.

---

**Addaru Day 8 — Ceremony for Antu (Uruk)**

Linssen (OECT 9, 40; 42; 44; 45 // 46; 60, pp. 62, 89): "A special ceremony for Antu is referenced in the sale of a prebend dated to the 8th of Adar" (McEwan, *Priest and Temple*, 171; K.3753 ii). Suggested type: `'ritual'`.

---

## Confirmed Entries

The following entries are confirmed by at least one source with no substantive discrepancy.

| Month | Day | App label | Confirmed by | Source |
|---|---|---|---|---|
| Nisannu | 1 | Akītu begins (festival opens) | Linssen | Çağirgan *Festivals* 1; AB 244 rev. 30 (pp. 79, 90) |
| Nisannu | 11 | Akītu ends; Marduk returns; destinies fixed at *parak šīmāti* | T-D + Linssen | T-D p. 148 (Nbk. n°15, II, 57); Linssen pp. 83–85 (SBH VIII; AB 244) |
| Aiaru | 2 | Wedding of Nabû (marriage ceremony) | Cohen + Linssen | Cohen p. 311; Linssen SBH VIII, II, 15–21 (pp. 68, 90) |
| Aiaru | 6 | Public ceremony for Nabû in garden | Cohen + Linssen | Cohen p. 311; Linssen SBH VIII, II, 22 (pp. 63, 90) |
| Aiaru | 13 | E-ma of Ištar in Assyria | Cohen | Cohen pp. 312–313 (BM 121206; Sennacherib tablet) |
| Simānu | 9 | Kiln rites at Eanna of Uruk | Cohen | Cohen p. 315 (LKU 51 obv. 33–35) |
| Simānu | 15 | Festival for Lady of the Gods (Bēlet-ilī) | Cohen + Linssen | Cohen p. 315 (SBH VIII); Linssen pp. 64, 90 (SBH VIII; BM 32656) |
| Simānu | 25 | Procession of Bēlet-Babili in Nineveh | Cohen | Cohen p. 315 (Aššurbanipal inscription) |
| Duʾūzu | 11 | Goddesses exchange houses — summer solstice rite | Cohen | Cohen pp. 317–318 (Babylonian cultic calendar text) |
| Duʾūzu | 26 | Day of the cry (*ūm ragāmi*) | Cohen | Cohen p. 317 (ABL 1097 = AOAT 5/1, 5) |
| Duʾūzu | 27 | Dumuzi captured — statue on bier (Uruk) | Cohen | Cohen p. 317 (LKU 51 obv. 28–31) |
| Abu | 28 | Maqlu exorcism | Cohen | Cohen p. 320 (ABL 56 = AOAT 5/1, 155) |
| Ulūlu | 17 | Akītu of Ištar of Arbela at Milkiya | Cohen | Cohen p. 323 (VS 20 no. 98; LKU 51 rev. 26–38) |
| Tašrītu | 8 | Grand procession of Bēl to Bīt Akītu (departure) | Cohen + Linssen | Cohen pp. 328–329; Linssen pp. 78, 90 (BM 32206+) |
| Tašrītu | 27 | Festival of the Sacred Mound at Nippur | Cohen | Cohen pp. 326–327 (Nippur Compendium) |
| Kislīmu | 1,2,6,7,14,15 | Festival of the Brazier (Kinunu) at Eanna of Uruk | Cohen + Linssen | Cohen p. 334 (SBH p. 144:12; LKU 51 rev. 15–18); Linssen p. 88 Table XVI (LKU no. 51) — exact match |
| Ṭebētu | 3 | Goddesses exchange houses — winter solstice rite | Cohen | Cohen p. 336 (Babylonian cultic calendar text) |
| Šabāṭu | 16 | Lamentations/ershemma begin at Bīt Dagan of Aššur | Cohen | Cohen pp. 338–341 (Van Driel, A 125 = *Aššur* 124ff.; BM 121206 vii) |
| Addaru | 6 | Grand procession of all gods | Cohen | Cohen p. 342 (Neo-Babylonian letter, Nabû-aḫḫē-šullim) |
| Addaru | 17 | Garratu festival day 1 | Cohen | Cohen p. 341 (KAV 79 r. 9; CAD Q 145 sub *qarrātu*) |
| Addaru | 18 | Garratu festival day 2 | Cohen | Cohen p. 341 (KAV 79) |

**Note on Nisannu Day 11:** Confirmed in substance (festival ends, return to Esagila, passage of *parak šīmāti*), but the "templo Upuruppuu" name in the current app text is invented (see HIGH finding above). The Day 11 entry should be retained after that name is corrected.

**Note on Tašrītu Day 8:** Confirmed for the procession departure; the Enūma Eliš claim for Tašrītu rests on a single unpublished Lambert tablet cited by Cohen and is uncertain (see MINOR/LOW finding above).

---

## Jacobsen's Contribution

Jacobsen (1976) provides mythological context for the Duʾūzu lament cycle (pp. 47–62): Dumuzi's death at the onset of summer heat, the role of Inanna/Ištar and Geshtinanna as mourners, the half-year alternation (p. 61), and the sacred marriage tradition placed at New Year/spring (p. 38) or Month 12 (Addaru) for Nanna (p. 126). He positively supports the app's month-level placement and characterization of Duʾūzu, and days 1, 7, 15 as universally important (p. 122). He does not provide day-level calendar data for any of the app's `dayEvent` entries and contradicts none of them.

---

## Priority Corrections

In order of urgency:

1. **Add Nisannu Day 5** (missing entry: king humiliation, temple purification, Nabû arrival) — the central event of the Akītu, currently absent.
2. **Fix Nisannu Day 8** (direction reversed: departure not return; remove reinvestiture) and update month `description` and `festival` fields.
3. **Fix Nisannu Day 4** (remove king humiliation — it belongs to Day 5).
4. **Fix Nisannu Day 11** (replace "Upuruppuu" with "*parak šīmāti*"; add marriage of Marduk and Zarpanītu).
5. **Fix Ulūlu Day 3** (replace "Anu y Antu" with Ištar as marriage partner).
6. **Fix Araḫsamnu Day 18** (replace "Disputa" with Šamaš brazier + Sons of Bēl procession; move Dispute to month description only).
7. **Fix Ṭebētu Day 16** (clarify: Uruk nocturnal ceremony is for Anu per TU 41; Emagmaš is Assyrian not Uruk).
8. **Fix Duʾūzu Day 28** (change label to "Día del Aprisco / *u₄ TÚG.si₄*").
9. **Mark uncertain days** (Abu 1, Abu 16, Ulūlu 1, Araḫsamnu 1, Šabāṭu 7) as approximate in their `description` fields.
10. **Add missing entries** where sourcing is solid: Aiaru 17, Araḫsamnu 5, Kislīmu 4, Ṭebētu 16–17, Addaru 8.

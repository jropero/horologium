# Review: Munichion
Sources: Parke (1977), Deubner (1932)
Date: 2026-10-25

---

## Feast of Eros — Day 4

**Parke**: Festival for Eros on the 4th. Attested by a mid-fifth-century rock inscription found by Broneer in the Aphrodite sanctuary on the north slope of the Akropolis. No ritual details preserved. Parke: "As there are no other references to this particular feast, there are no details of the ritual available." The 4th was traditionally dedicated to Aphrodite; Eros was worshipped alongside her.

**Deubner**: Confirms: "Eros festival — Eros — festival for Eros at his sanctuary on the north slope of the Akropolis; details not preserved; rock inscription reads 'for Eros the festival on the 4th of Munichion.'"

**App**: No entry for Day 4 Munichion.

**Verdict**: MISSING_FESTIVAL

**Issue**: A named festival attested in both Parke and Deubner by epigraphic evidence is entirely absent from the app.

**Fix**: Add `if (dayOfMonth === 4) return { festivalName: "Fiesta de Eros", deity: "Eros / Afrodita", deityDesc: "Dios del amor, venerado junto a Afrodita.", festivalDesc: "Festival en el santuario de Eros en la ladera norte de la Acrópolis, atestiguado por una inscripción rupestre del siglo V a.C. No se conservan detalles del rito.", category: "Purificación y Expiación" };`  Do not invent a ritual; the sources have none.

---

## Delphinia — Day 6

**Parke**: Procession of the maidens of Athens to the Delphinion carrying boughs of sacred Athenian olive bound with white wool (hikétériai). The ceremony is really directed to Artemis (not Apollo), despite the shrine's Apolline name; the 6th was Artemis's traditional day, the 7th Apollo's. The Theseus aition (he dedicated a suppliant bough at the Delphinion before sailing to Crete) is explicitly called a "secondary rationalisation" that has "nothing whatever to do with" the original ceremony, which was simply a communal supplication.

**Deubner**: Deity listed as Apollon (+Artemis). Aition: Theseus carrying supplicant branch before sailing to Crete. Deubner does not flag the aition as secondary.

**App**: Deity "Artemisa / Apolo" — order inverts Deubner's priority (Apollon + Artemis) but aligns with Parke's argument that Artemis is the true recipient. Festival description correctly describes the procession with hikétériai. Aition states: "Teseo hizo esa misma ofrenda de súplica en el templo de Apolo justo antes de embarcar hacia Crete para ser sacrificado al Minotauro."

**Verdict**: UNSOURCED_AITION (partial) / MISSING_DETAIL

**Issues**:
1. The aition is attested in both sources, so it is not invented — but Parke explicitly calls it a "secondary rationalisation." The app presents it as the authoritative explanation without qualification.
2. "para ser sacrificado al Minotauro" adds narrative context not cited in either source for this specific festival entry; it is general mythological knowledge attached here without warrant.
3. The app omits Parke's key interpretive point: the original ceremony was a communal women's supplication to Artemis as protectress of the female sex; the Apollo/Theseus layer is secondary.

**Fix**: The aition text is not wrong, but add a hedge: the Theseus connection is the traditional explanation. Optionally note that the rite was performed by women because Artemis was being invoked as guardian of women. No change needed to day or deity.

---

## Munichia — Day 16

**Parke**: Festival for Artemis at the hill of Munichia. Key elements: (1) round amphiphontes cakes with lighted candles in a circle, carried in procession and brought as private offerings; (2) she-goat sacrifice; (3) by the Hellenistic period, the Epheboi held a regatta around the Munichia promontory. Aition: a she-bear entered the shrine and was killed; goddess sent plague; oracle demanded a daughter be sacrificed; Embaros volunteered on condition his family received the hereditary priesthood; he hid his daughter, dressed a she-goat in female clothing, and sacrificed the goat instead. The candles on the cakes connect to the moon's circle. Brauronia is a completely separate festival at Brauron (see "Unplaced" in Deubner), not associated with Day 16 of Munichion.

**Deubner**: Day 16: Munichia — Artemis Munichia. Adds: Hekate honoured at crossroads privately (not in Parke's Munichion discussion). Epheboi sacrificed and held a regatta around the Munichia peninsula. The day liturgically commemorated the Salamis victory. Brauronia listed separately as an unplaced/annual festival at Brauron; no connection made to Munichion Day 16.

**App**: `festivalName: "Munichia y Brauronia"`. `festivalDesc`: "Se ofrecían pasteles iluminados con velas (amphiphontes) para la diosa de la luna. Las niñas de Atenas actúan como osas en el santuario." `aition`: Embaros legend (correct) + "También recuerda el mito de las niñas 'osa' que apaciguaban a Artemisa por la muerte de su mascota sagrada."

**Verdict**: WRONG_DEITY (festival name); UNSOURCED_AITION (second half); MISSING_DETAIL (multiple)

**Issues**:
1. **Festival name is wrong.** "Munichia y Brauronia" conflates two distinct festivals. The Brauronia is a separate annual (and penteteris) celebration at Brauron — neither Parke nor Deubner places it on Munichion Day 16.
2. **"Las niñas de Atenas actúan como osas en el santuario"** belongs to the Arkteia/Brauronia at Brauron, not to the Munichia. This element has been imported from the wrong festival.
3. **Second aition clause ("el mito de las niñas 'osa'…")** is similarly from Brauronia/Arkteia, not Munichia. Neither source links it to Munichion Day 16.
4. **Missing: Hekate at crossroads** (Deubner; private cult on the same day).
5. **Missing: Epheboi regatta** around the Munichia promontory (both sources).
6. **Missing: Salamis commemoration** (Deubner).

**Fix**:
- Rename to `"Munichia"` only.
- Remove all "bears/osas" content from `festivalDesc` and `aition` — it belongs to Brauronia.
- Keep the Embaros aition (attested by Parke).
- Add Epheboi regatta to `festivalDesc` or `agonDesc`.
- Optionally add Hekate at crossroads as a note.
- Brauronia should appear as a separate, unplaced/penteteris entry if it appears at all; it should not be placed on Day 16.

---

## Olympieia — Day 19

**Parke**: Day 19. Zeus Olympios. Main elements: cavalry procession, Anthippasia (tribal cavalry contingents charging at each other in turn at the trumpet signal, with the council as official spectators), large bull sacrifice, beef dinners. Probably instituted by Peisistratos when he laid the foundations of the colossal Ionic temple near the Ilissos. The Phocion incident (Plutarch): at the 318 BC festival the cavalry procession rode past the prison where Phocion awaited forced suicide — cited by Parke as a vivid illustration of the festival's character, not as its founding legend.

**Deubner**: Day 19. Zeus Olympios. Cavalry pompe; hippic agon (Anthippasia). Notes agonistic Olympia only in the imperial period (none older than Hadrian).

**App**: Day 19, Zeus Olímpico, Anthippasia — all correct. `aition`: "La leyenda del festival se tiñó de tragedia cuando, en pleno desfile militar, el amado general Foción fue obligado a suicidarse, haciendo que los jinetes cabalgaran llorando bajo sus cascos festivos."

**Verdict**: UNSOURCED_AITION (mislabelled)

**Issue**: The Phocion anecdote (Plutarch, drawn from Parke p. 144) is a historical incident that happened to coincide with the festival in 318 BC, not a founding aition or "leyenda del festival." Parke uses it only to convey the atmosphere of the procession. The true foundation tradition — that Peisistratos instituted it when beginning the great temple — is absent. Presenting the Phocion story as "the legend of the festival" inverts the source's intent.

**Fix**: Replace `aition` text. Correct content: the festival was likely founded by Peisistratos in the late sixth century, coinciding with the laying of the foundations of the vast Ionic temple of Zeus near the Ilissos (completed only under Hadrian). The Phocion anecdote may be kept as a `historicalNote` field if the data model supports it, but must not be labelled as the festival's legend.

---

## Arrephoria — (not Munichion)

**Parke**: Discussed at length within the Munichion chapter (pp. 140–143) but explicitly without being assigned to that month. Parke says "the date on which the ceremony took place is not at all clear"; a lexicon places it in Skiraphorion.

**Deubner**: Month Skiraphorion explicitly named (Etym. magnum); listed in the Skiraphorion section of the Deubner extract.

**App**: Correctly placed in Skiraphorion (monthIndex === 11, dayOfMonth === 3). No action needed.

**Verdict**: OK (placement correct; Parke discusses it in the Munichion chapter only for contextual/thematic reasons, not because it belongs there).

---

## Summary table

| Day | Festival | App status |
|-----|----------|-----------|
| 4   | Feast of Eros | MISSING_FESTIVAL |
| 6   | Delphinia | UNSOURCED_AITION (aition presented uncritically; bears/owl motif added beyond sources) |
| 16  | Munichia | WRONG_FESTIVAL_NAME; Brauronia conflated; bears aition from wrong festival; missing Hekate, epheboi regatta, Salamis note |
| 19  | Olympieia | UNSOURCED_AITION (Phocion anecdote wrongly labelled as founding legend) |

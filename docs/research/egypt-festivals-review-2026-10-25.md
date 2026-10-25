# Egyptian Festival Data — Scholarly Review 2026-10-25

## Executive Summary

**Overall quality score: 12 / 20 entries defensible (60 %)**

Sources consulted (via the Phase 1 consolidated file `docs/research/extracts/egypt-by-month.md` and individual source extracts):
- **ES-NK** — El-Sabban (2000), Ch. 2 (Middle Kingdom, Illahun/Lahun papyri) and Ch. 5 (Medinet Habu, Ramesses III / New Kingdom)
- **ES-PT** — El-Sabban (2000), Ch. 6 (Ptolemaic: Kom Ombo, Esna, Edfu, Dendera)
- **BL** — Bleeker (1967), *Egyptian Festivals*
- **VL** — Von Lieven (2016), hemerology papyri (pSallier IV, pCairo JE 86637)

Period note: MK = Middle Kingdom (Dynasties 11–13); NK = New Kingdom (Dynasties 18–20); PT = Ptolemaic (300–30 BCE). Festival names, deities, and dates can differ across periods.

| Status | Count |
|--------|-------|
| ATTESTED (confirmed in ≥ 1 source at the given date) | 12 |
| PARTIALLY_ATTESTED (festival real, date uncertain or approximate) | 4 |
| WRONG_DATE (festival real, belongs to a different day/month) | 2 |
| INVENTED (no scholarly source for this festival at this date) | 2 |
| **Total civil entries reviewed** | **20** |

The five epagomenal entries (e-1 through e-5) are all well-attested and do not need correction. The civil entries have two significant errors (wrong dates), two unattestable entries, and four others where the description overstates certainty or conflates sources.

The most critical gap is the complete absence of the **Opet festival** (a 24-day festival covering II Akhet Day 18 through III Akhet Day 12, the most extensively documented festival in the New Kingdom) and the **Sokar cycle** (IV Akhet Days 20–29), of which only the final day (the Djed-raising) is in the app.

---

## Findings per app entry

---

### Key: "0-1" — Wep Renpet / Nacimiento de Re / Neheb-Kau

- **Status**: ATTESTED
- **Priority**: LOW (correct placement; description issue only)
- **Source attestation**: All periods, all temples. MK (Illahun, Sesostris III Yr 35); NK (MH 629, "Coming out of Sothis on its day"); Ptolemaic (Kom Ombo, Esna, Edfu, Dendera); BL p. 113, 132.
- **Issue**: The name bundles three distinct things: *Wep Renpet* (the primary name, universally attested), "Nacimiento de Re" (a theological aspect, not a festival name), and "Neheb-Kau" (attested specifically at Esna and the Illahun papyri but not the primary deity). Deity varies by context: Re / Amon-Re / Horus (never solely Neheb-Kau).
- **Recommended correction**: Name: `"Wep Renpet — Apertura del Año"`. Description: acknowledge the variation ("Amon-Re en Medinet Habu; Neheb-Kau y Jnum en Esna; Hathor en Dendera") and note that MK ritual included torch-kindling, procession, and loaves (Illahun; Hapdjefa contracts per Bleeker p. 132).

---

### Key: "0-18" — Festividad Fija de Wagy

- **Status**: ATTESTED
- **Priority**: LOW (minor description clarification only)
- **Source attestation**: MK (Illahun); NK (MH entry 667, "1(8)th day"); BL p. 132 (Hepzefi contract: bread, torch, funerary procession). Also: Ahmose I inscription sequences "feast of Wag, feast of Thoth."
- **Issue**: The description is substantially correct. It calls this "Festividad Fija" to distinguish it from the lunar version, which is appropriate. However it could note that this is specifically a festival of the dead (Osiris / Upwaut / Anubis); model boats were placed in graves. The phrase "pBerlin 10282" is an Illahun papyrus but the primary scholarly attestation should name El-Sabban Ch. 2 and Bleeker.
- **Recommended correction**: Minimal. Add: "Festival de los muertos por excelencia. Incluía procesiones nocturnas con antorchas, ofrendas de pan a los difuntos, y colocación de barcas en las tumbas (Bleeker p. 132; contratos de Hapdjefa)."

---

### Key: "0-19" — Fiesta de Thoth

- **Status**: ATTESTED
- **Priority**: LOW
- **Source attestation**: NK (MH 686); BL p. 132 (Ahmose I inscription: "the feast of Wag, the feast of Thoth" in sequence); Esna (day-rating: "half good, half bad").
- **Issue**: The description is correct. No material error.
- **Recommended correction**: None needed. Optionally add: "Bleeker confirma la secuencia inmediata tras el festival Wagy (Ahmose I); la deidad principal en Medinet Habu es Amon-Re con su Enéada (entrada 686)."

---

### Key: "1-15" — Inicio de la Fiesta de Opet

- **Status**: WRONG_DATE
- **Priority**: HIGH
- **Source attestation**: II Akhet Day 15 — no festival is named in any source. The Opet festival begins at **II Akhet Day 18** (eve) / Day 19 (first day) per Medinet Habu (NK). ES-NK: "Eve of the festival of Amon in his festival of Opet — List 28 (725)" = II Akhet Day 18. "1st day of Amon's festival of Opet — List 29 (743)" = II Akhet Day 19. No source places any Opet start on Day 15.
- **Issue**: Day 15 is the full moon, and a recurring half-month feast (*Full Moon feast, psDntyw*) is attested throughout the year at that day, but this is not the Opet start. The description's claim that Thutmose III began Opet on II Akhet 15 is not supported by El-Sabban's Medinet Habu analysis nor by Bleeker.
- **Recommended correction**: Either (a) delete this entry and add a proper Opet entry at "1-18" / "1-19" (see Missing Festivals below), or (b) if a source other than those reviewed supports Day 15, that source must be cited explicitly. Based on the consolidated scholarly record, the correct Opet start is **II Akhet Day 18 (eve) / Day 19 (first full day)**. Corrected key: `"1-18"` (eve) and `"1-19"` (Day 1 of Opet).

---

### Key: "2-1" — Fiesta de Hathor

- **Status**: PARTIALLY_ATTESTED
- **Priority**: MEDIUM
- **Source attestation**: III Akhet Day 1 is the **13th day of the Opet festival** at Medinet Habu (MH 846). A "Feast of Sekhmet" is attested at Esna on III Akhet Day 1 (temple-specific). No source confirms a named "Fiesta de Hathor" on III Akhet Day 1 (as a stand-alone festival).
- **Issue**: The month Athyr / Hathor (Greek transliteration of *Ḥw.t-Ḥr*) gives III Akhet its name, and the implicit logic that "Hathor's month begins with her festival" is not supported by any attested festival entry in the four sources. The description hedges ("Hathor daba nombre al tercer mes, celebrándose en el primer día **o** desplazado a IV Akhet 1"), which actually undermines the entry's own certainty claim. An MK "Heden-plant feast of Hathor" is attested but at **III Akhet Day 20** (not Day 1). IV Akhet 1 does have a Hathor festival (covered under key "3-1").
- **Recommended correction**: Replace the description to note: "Este día (1 de Athyr) marca la continuación del festival de Opet en el Medinet Habu (día 13 del festival). Una fiesta de Sejmet está atestiguada en Esna. Un festival de Hathor en el primer día del mes no está confirmado como festividad autónoma en las fuentes estudiadas; el *Heden-plant feast of Hathor* del Reino Medio ocurría el día 20 de Athyr." Priority: MEDIUM — the day is real but the festival identity is speculative.

---

### Key: "3-1" — Fiesta de Hathor (variante) / Khoiak

- **Status**: ATTESTED (partially misleading name)
- **Priority**: MEDIUM
- **Source attestation**: MK (Illahun: "Periplus of Hathor"); NK (MH 917: "Festival of Hathor" — deity: Amon-Re with Ennead); Ptolemaic (Esna: "Feast of Ka-hir-ka"; Edfu Cal 3: 3rd day of procession of Hathor and ennead). The Hathor festival component is well-attested.
- **Issue**: The name includes "Khoiak," which is the name of the month (IV Akhet), not a festival on this day. The Khoiak/Sokar cycle proper begins around Day 20 at the earliest. The description's claim that this is "inicio del festival de Khoiak/Neheb-Kau" is unsupported — the Sokar purification cycle does not begin until Day 20 (MH 932). Adding "Neheb-Kau" here is also unsupported (Neheb-Kau is attested at Esna but not in direct connection with this day's Hathor festival).
- **Recommended correction**: Name: `"Festival de Hathor / Periplum de Hathor"`. Remove "Khoiak" from the name and description — it refers to the month, not this festival. Description: cite MK (Illahun), MH 917, and the Esna Ka-hir-ka feast.

---

### Key: "3-4" — Masticación de Cebollas para Bastet

- **Status**: WRONG_DATE
- **Priority**: HIGH
- **Source attestation**: "Chewing onions for Bast" is attested at **IV Peret Day 4** (app key "7-4"), not at IV Akhet Day 4. Source: MH 1373 — "Chewing onions for Bast — deity: Amon-Re with his Ennead." At IV Akhet Day 4, the only source attestation is a temple-specific procession of Nebtu at Esna (with no festival name).
- **Issue**: The entry is placed 4 months too early. The onion-chewing ritual for Bast/Bastet is unambiguously a IV Peret Day 4 festival at Medinet Habu. A distinct onion ritual (the *Nḏrj.t* festival, "garlands of onions") occurs at IV Akhet Day 25 in connection with the Sokar festival (MH 1003; BL p. 73), but this involves different deities and is not a Bastet festival.
- **Recommended correction**: Move this entry from `"3-4"` to `"7-4"`. Description: "IV Peret 4. Atestiguado en el Calendario de Festividades de Medinet Habu bajo Ramsés III (entrada 1373). La deidad principal es Amon-Re con su Enéada." Note: a distinct onion ritual (*Nḏrj.t*) occurs at IV Akhet 25 in the context del ciclo de Sokar — separate entry recommended.

---

### Key: "3-30" — Levantamiento del Pilar Djed

- **Status**: ATTESTED
- **Priority**: LOW (citation note only)
- **Source attestation**: MK (Illahun: "Drawing along Sokar" + "Entering into the Sky"); NK (MH List 51, 1163: "Raising the Djed pillar"); Ptolemaic (Esna; Edfu Cal 3: "feast of erecting the Djed-pillar"; Bleeker p. 70 table; Denderah Khoiak text: "30 Khoiak: interment of Osiris").
- **Issue**: The description cites "Jauhiainen en su estudio de los trabajadores de Deir el-Medina" as the primary source. Jauhiainen's study may provide secondary support, but the major primary attestation is Medinet Habu (NK) and the Denderah Khoiak text (Ptolemaic), as extensively documented by Bleeker. Citing Jauhiainen as the primary source understates the festival's significance and multi-period attestation.
- **Recommended correction**: Replace the Jauhiainen citation with: "Atestiguado en Medinet Habu bajo Ramsés III (Lista 51, MH 1163); en el texto copto de Khoiak de Dendera ('30 Khoiak: entierro de Osiris' — Bleeker p. 70); en Esna (Ptolemaico). El pilar Djed era erguido por el rey; al entierro de Osiris le seguía la erección del pilar."

---

### Key: "4-1" — Fiesta de Neheb-Kau / Khoiak

- **Status**: ATTESTED (but name misleads)
- **Priority**: MEDIUM
- **Source attestation**: Neheb-kau festival confirmed at I Peret Day 1 — MK (Illahun); NK (MH 1191: "Neheb-kau festival of the royal appearance"); Ptolemaic (Edfu Cal 2, Cal 3: "feast of opening the year of the reign of Horus"); BL p. 113–114 ("beginning of the flowering season; ideal date for coronation").
- **Issue**: The name appends "/ Khoiak" which is the name of the immediately preceding month (IV Akhet), not a festival occurring on I Peret 1. Adding "Ka-her-ka (Khoiak)" in the description conflates the Esna Ka-hir-ka feast (which is attested at **IV Akhet 1**, not I Peret 1) with the Neheb-kau festival here.
- **Recommended correction**: Name: `"Festival de Neheb-Kau / Inicio del Año de Reinado"`. Description: remove the "Ka-her-ka (Khoiak)" identification and instead note: "Bleeker señala que I Peret 1 (1 Tybi) era la fecha ideal para la coronación del faraón ('inicio de la estación de la floración'). En el Reino Medio (Illahun), se celebraba también el *Periplum de Hathor, Señora de Ahnas*, el mismo día."

---

### Key: "4-30" — Periplous (Navegación) de Mut

- **Status**: WRONG_RITUAL
- **Priority**: HIGH
- **Source attestation**: I Peret Day 30 — Esna: "Feast of Hathor, mistress of Agny" (temple-specific, Ptolemaic). No source in the reviewed corpus attests a "Navigation of Mut" on this day. The description cites "Ostracon BM 29560 y Papiro Turín 68" as sources.
- **Issue**: The deity named (Mut) does not match the sole source found (Hathor at Esna). If OBM 29560 and P. Turin 68 genuinely document a Mut navigation on I Peret 30, these are not captured in El-Sabban, Bleeker, or Von Lieven and must be verified directly. A "Feast of Hathor" at I Peret 30 exists but it is temple-specific (Esna only) and relates to Hathor of Agny, not Mut. The navigation (*periplum*) format is plausible for Egyptian festivals but the Mut attribution on this specific date is unconfirmed.
- **Recommended correction**: Either (a) verify OBM 29560 and P. Turin 68 directly and correct the deity if they confirm Mut; or (b) replace with the confirmed festival: "I Peret 30. Fiesta de Hathor, señora de Agny (Esna, época ptolemaica) — atestiguación limitada a un único templo." If the Mut navigation cannot be confirmed, this entry should be deleted or significantly downgraded.

---

### Key: "5-1" — Navegación de Anubis

- **Status**: ATTESTED
- **Priority**: LOW
- **Source attestation**: NK (MH 1337: "Navigation of Anubis — deity: Amon-Re with his Ennead"); Esna: "Feast of the gods and goddesses; accomplishing all rites of navigation."
- **Issue**: The description cites "Lista 59 de Medinet Habu." The consolidated record gives MH entry 1337 for this festival. The list number (59) should be verified against El-Sabban's original pagination. Minor concern.
- **Recommended correction**: Verify list number against El-Sabban Ch. 5. Description is otherwise accurate.

---

### Key: "6-1" — Gran Quema (Rokeh Wer)

- **Status**: ATTESTED
- **Priority**: LOW
- **Source attestation**: MK (Illahun: "Great Burning / Rokeh Wer" at III Peret Day 1); NK (MH 1370: "1st day of Amon's festival of the Reentry of the Sky"); Ptolemaic (Esna: "Feast of Ptah; feast of lifting up the sky"; Edfu Cal 3: "Feast of Lifting up the Sky by Ptah alongside Herishef; burial of Osiris at Busiris").
- **Issue**: The description calls this "el primer mes del año solar/agrícola tras el orto helíaco" — this is an interpretive claim rooted in MK agricultural alignment and is correct in broad terms for the Middle Kingdom context. The NK evidence shows a different festival name (Lifting up the Sky / Reentry of the Sky), not "Great Burning." The app correctly privileges the MK name but should note that by the NK the event was known as the "Lifting up the Sky" festival.
- **Recommended correction**: Add: "En el Reino Nuevo (Medinet Habu, entrada 1370), esta festividad se conocía como 'Levantar el Cielo' (*Lifting up the Sky*). En Esna y Edfu (época ptolemaica), se asociaba a Ptah y a Herishef."

---

### Key: "7-1" — Pequeña Quema (Rokeh Nedjes)

- **Status**: ATTESTED
- **Priority**: MEDIUM
- **Source attestation**: MK (Illahun: "Lesser Burning" under IV Peret; El-Sabban notes this is assigned to IV Peret Day 1 in the MK data); NK (MH 1372: "1st day of Amon's festival of Entering the Sky"; MH 1388: "Festival of Sokar, brought by the new moon" — a separate NK entry for the same day).
- **Issue**: The description mentions only the "Lesser Burning (Rokeh Nedjes)" and the Illahun papyrus, but the NK evidence shows two simultaneous festivals on this day: (1) the Amon "Entering the Sky" festival and (2) a lunar-contingent Sokar festival. These are not mentioned. The description is not wrong but is significantly incomplete.
- **Recommended correction**: Add: "En el Reino Nuevo (Medinet Habu, entradas 1372 y 1388), este día acogía simultáneamente el festival de Amón 'Entrar al Cielo' y, en función de la luna nueva, un festival de Sokar (*Dios de los muertos*). La confluencia de estos tres niveles rituales (quema, procesión de Amón, festival lunar de Sokar) convierte a IV Peret 1 en una de las fechas más cargadas del calendario."

---

### Key: "7-25" — Fiesta Weresh

- **Status**: PARTIALLY_ATTESTED
- **Priority**: MEDIUM
- **Source attestation**: IV Peret Day 25 — no festival is attested in any of the four scholarly sources reviewed. The description cites the "Gran Estela de Dakhla" (Shoshenq I, 22nd Dynasty) as the source.
- **Issue**: The Dakhla Stele is a genuine monument, but it is not covered in El-Sabban, Bleeker, or Von Lieven, and "Weresh" as a festival name is unusual. The Egyptian root *wrs* means "to spend the night / to keep vigil," suggesting this may denote a vigil ritual rather than a named festival. Without direct access to the Dakhla Stele text, the entry cannot be verified or contradicted. The description also links it to a "procesión del dios Seth" at Dakhla — an oasis cult context quite different from the mainstream Theban/Memphite calendar. If the reference is genuine, it represents a geographically and dynastically marginal datum.
- **Recommended correction**: If the Dakhla Stele reference is accurate, flag it explicitly as a single-source attestation from a peripheral oasis context, late period. Description should note: "Atestiguación provisional: única fuente conocida en el periodo ptolemaico tardío / 22.ª Dinastía; contexto regional (oasis de Dakhleh). El término *wrs* denota una vigilia ritual, no necesariamente un festival de nombre 'Weresh'. No confirmado en los calendarios principales (Illahun, Medinet Habu, Esna, Edfu, Dendera)."

---

### Key: "8-1" — Festival de Renenutet

- **Status**: ATTESTED
- **Priority**: LOW
- **Source attestation**: NK (MH 1402: "Renenutet festival — deity: Amon-Re"); Ptolemaic (Kom Ombo East and West; Esna; Edfu Cal 2). Multiple-temple confirmation.
- **Issue**: The description's reference to "tumbas de Khaemhet y Neferhotep (Dinastía 18)" may be correct but these are not in the consolidated record — verify or remove. The MH + Ptolemaic attestation alone is sufficient.
- **Recommended correction**: Minimal. Remove the uncertain tomb references or verify them. Confirmed sources are MH 1402 and multiple Ptolemaic temples.

---

### Key: "8-10" — Fiesta de Vestir a Anubis

- **Status**: ATTESTED
- **Priority**: LOW
- **Source attestation**: NK (MH 1416: "Festival of clothing Anubis — deity: Amon-Re with his Ennead; note: 'daily offerings every day' suggests extended observance").
- **Issue**: The description cites "Lista 65 de Medinet Habu." The consolidated record gives MH entry 1416. Verify the list number against El-Sabban. Otherwise accurate.
- **Recommended correction**: Verify list number. No material change needed.

---

### Key: "8-11" — Procesión de Min a la Terraza

- **Status**: ATTESTED
- **Priority**: LOW
- **Source attestation**: NK (MH List 66, entry 1430: "Min's procession to the terrace when the new moon is in the morning"); BL p. 112, 121, 165 (three-part royal festival: harvest rite, release of birds to the four quarters, raising/birth of Min).
- **Issue**: The description says "Lista 66 de Medinet Habu" and "vinculado a la aparición de la luna nueva en la mañana" — both correct. Bleeker's three-part description enriches this entry considerably and could be included.
- **Recommended correction**: Add Bleeker's elements: "(1) rito de cosecha: el faraón golpeaba ceremonialmente la hoz en el grano; (2) liberación de cuatro pájaros para proclamar a los cuatro puntos cardinales el reinado de Horus; (3) *mfw.t* de Min: el 'nacimiento' del dios (Min se renueva continuamente). Bleeker pp. 121, 165."

---

### Key: "9-25" — Cruce del Río (Hermosa Fiesta del Valle)

- **Status**: PARTIALLY_ATTESTED
- **Priority**: MEDIUM
- **Source attestation**: The Beautiful Feast of the Valley is confirmed in II Shomu (Payni) in both MH (El-Sabban Ch. 5) and Bleeker (p. 152–175: Amon-Re crosses from Karnak to the west bank necropolis). However, **no source in the reviewed corpus specifies Day 25** within the month. Bleeker gives only "Payni (II Shomu)" with no day number. The consolidated record flags this: "No day 25 entry is attested for this festival in any source."
- **Issue**: The specific date (Day 25) may derive from Ostracon Cairo CG 25538 under Sethos II (as the description states), which is not covered in the four sources reviewed. This is plausible as a legitimate attestation, but must be treated as provisional. The festival's nature (river crossing, west-bank necropolis visit, funerary banquet) is correctly described.
- **Recommended correction**: Add a provenance caveat: "La fecha específica (día 25) deriva del Ostracon Cairo CG 25538 (Seti II) y no ha sido confirmada por los calendarios principales (Medinet Habu, Esna, Edfu, Dendera revisados). Bleeker y El-Sabban sitúan el festival en II Shemu (Payni) sin especificar el día. Fecha provisional." The festival identity and general period are correct; the specific day remains uncertain.

---

### Key: "11-9" — Unión con el Disco Solar

- **Status**: INVENTED
- **Priority**: HIGH
- **Source attestation**: IV Shomu Day 9 — no named festival found in any source. The consolidated record explicitly: "No named festival on IV Shomu Day 9 found in any source."
- **Issue**: "Union with the solar disc" (*hnm m itn*) is a liturgical act appearing throughout the year at many festivals (notably I Akhet 1 at Dendera; IV Shomu 15 at Edfu; IV Shomu 30 at Esna; etc.) — it is not a festival name or a specific event fixed to this date. The description links this to Esna and Re-Horakhty in the Greco-Roman period, but no Esna entry confirms Day 9 of IV Shomu. Edfu Cal 4 mentions "Praise of Mut" for "days 10–19" (not Day 9). The theological connection the description asserts (linking this to Wep Renpet) is speculative and not sourced.
- **Recommended correction**: **Delete this entry.** The "union with the solar disc" ritual is a common liturgical element, not a dated festival. If an Esna-specific reference exists, it must be cited with precise entry number. No correction can be proposed without a source.

---

### Key: "11-24" — Fiesta de Ptah-al-sur-de-su-muro

- **Status**: PARTIALLY_ATTESTED
- **Priority**: HIGH
- **Source attestation**: IV Shomu Day 24 — no named festival in any source. The consolidated record explicitly: "No named festival on IV Shomu Day 24 found in any source. The nearest is Day 27 (procession of Hathor)."
- **Issue**: The description cites "un grafito de Saqqara en el año 34 de Ramsés II. Borchardt y Casperson demostraron que coincidía con una luna llena." The "grafito de Saqqara" likely refers to an astronomical dating datum used by Egyptologists to fix the calendar — not a festival calendar entry per se. "Ptah-sur-de-su-muro" (*Ptah-shema-tawy* or *Ptah-south-of-his-wall*) is a genuine cult epithet, but the grafito's function as an astronomical anchor does not establish IV Shomu 24 as a recurring civil-calendar festival of Ptah.
- **Recommended correction**: Either (a) verify that the grafito records a recurring festival (not merely a one-time cultic event used as a dating synchronism), citing the original publication (Borchardt or Casperson with full reference); or (b) downgrade to a note in the description: "La única fuente es un grafito saqueado de Saqqara (año 34 de Ramsés II) empleado como sincronismo astronómico, no un festival recurrente en un calendario civil. Su inclusión en el calendario de festividades civiles no está confirmada." If no recurring festival can be established, this entry should be deleted.

---

### Epagomenal Days: e-1 through e-5

- **Status**: ALL ATTESTED (HIGH confidence)
- **Priority**: LOW (minor description enrichment possible)
- **Source attestation**: MK (Illahun: all five birth days); Ptolemaic (Esna, Edfu Cal 2, Cal 3, Cal 4, Dendera Cal 2, Kom Ombo); BL p. 33, 132; VL p. 35 (Day 3: Plutarch *De Iside* 12).
- **Issue**: The descriptions are sparse ("Dedicado a Osiris / Horus / Seth / Isis / Neftis"). The sources provide much richer ritual detail.
- **Recommended enrichment (optional, low priority)**:
  - **e-1 (Osiris)**: "Bleeker: los cinco días epagómenos 'se celebraban con la debida solemnidad'. Upwaut visita a Anubis (contratos de Hapdjefa); ofrendas. En Edfu: 'Vestidura del Gran Pilar de Behedet'. Considerados días peligrosos en la hemerología."
  - **e-4 (Isis)**: "Gran fiesta en todo el país. En Dendera: 'Día hermoso de la noche del niño en su nido'; procesión nocturna de Hathor alrededor de su mansion divina (Dendera Cal. 2)."
  - **e-3 (Seth)**: "Plutarco (*De Iside* 12) todavía conoce el mito fundacional de este día en época romana (VL p. 35). La tradición egipcia lo trata como día peligroso."

---

## Missing festivals

The following major attested festivals are entirely absent from the app. Listed by priority.

---

### 1. Opet Festival — II Akhet 18 to III Akhet 12 (24-day span)
- **Priority**: HIGH — largest single omission; the most extensively documented festival in the New Kingdom
- **Source**: ES-NK (MH Lists 28–37); BL p. 187
- **Period**: NK (Medinet Habu, Ramesses III); shorter duration in MK
- **Description**: "Opet" (ꜥIp.t) = the festival in which Amon, Mut, and Khonsu journey by boat from Karnak to the Luxor temple (harem/ꜥip.t). The three divine boats appear together. Duration 24 days in MH. BL interprets the central rite as a *hieros gamos* (sacred marriage). The god's boat is drawn on the Nile; elaborate offerings every day.
- **Recommended entries**:
  - `"1-18"` (eve): *Víspera del Festival de Opet* — "Víspera del festival de Amón en su festival de Opet (MH 725). Los tres barcos de Amón, Mut y Jonsu salen de Karnak."
  - `"1-19"` (Day 1): *Festival de Opet — Día 1* — "Primera jornada del festival de Amón en Opet (MH 743). Duración: 24 días hasta III Akhet 12 bajo Ramsés III. Bleeker: posible *hieros gamos* entre Amón y su harén divino en Luxor (p. 187)."
  - Range note: Existing range logic in `getFestivalsForDate` already covers II Akhet 16–30 and III Akhet 1–12 with a generic "Días del Festival de Opet" entry, but this lacks a primary entry for the festival's start date.

---

### 2. Festival of Sokar — IV Akhet 26 (principal day)
- **Priority**: HIGH — the most significant individual Sokar festival day
- **Source**: ES-NK (MK: Illahun; NK: MH List 47, 1025); BL p. 70; ES-PT (Esna; Edfu Cal 2; Dendera Cal 2)
- **Period**: MK through Ptolemaic — widest multi-period attestation
- **Description**: The solemn circuit (*ḥnw*) of Sokar's divine boat: king offers to Sokar; the ḥnw boat is drawn forth; the king and eight pairs of priests follow holding a chord; the emblem of Nefertem is carried; Horus falcon on standard; priests carry emblems. At Edfu: the wild ass is brought from the Temple of Seth; Apophis is slain. Bleeker: coincides with the winter solstice in the Ptolemaic calendar.
- **Recommended entry**: `"3-26"` — *Festival de Sokar* — "IV Akhet 26. Festival principal del ciclo de Sokar. El barco sagrado *ḥnw* procesiona; el faraón y sacerdotes lo siguen tomando una cuerda; se porta el emblema de Nefertem. Atestiguado en el Reino Medio (Illahun), el Reino Nuevo (Medinet Habu, Lista 47, entrada 1025) y la época ptolemaica (Esna, Edfu, Dendera). Bleeker: la fecha coincidía con el solsticio de invierno en el calendario ptolemaico (p. 70)."

---

### 3. Sokar Cycle initiation — IV Akhet 20 (Day 1 of the 10-day cycle)
- **Priority**: HIGH — the formal opening of the cycle that culminates in the Djed-raising on Day 30
- **Source**: ES-NK (MH 932: "Purifying the Ennead"); BL p. 70
- **Period**: NK; Ptolemaic (Edfu Cal 2)
- **Recommended entry**: `"3-20"` — *Purificación de la Enéada (inicio del ciclo de Sokar)* — "IV Akhet 20. Inicio del ciclo de 10 días de Sokar. 'Purificación de la Enéada' (Medinet Habu, entrada 932). Deidad: Ptah-Sokar-Osiris con su Enéada."

---

### 4. Great Procession of Osiris — I Akhet 22
- **Priority**: HIGH — confirmed MK + NK; listed by the consolidated file as a "major gap"
- **Source**: ES-NK (MK: Illahun; NK: MH 705)
- **Period**: MK and NK
- **Recommended entry**: `"0-22"` — *Gran Procesión de Osiris* — "I Akhet 22. Una de las atestaciones más sólidas del mes en el Reino Medio y el Reino Nuevo (Medinet Habu, entrada 705; papiros de Illahun). Deidad: Osiris / Amón-Re. Procesión solemne."

---

### 5. Feast of Drunkenness — I Akhet 20
- **Priority**: HIGH — attested MK (Illahun) + Ptolemaic (Dendera Cal 1, Cal 2); flagged as a "major gap" in the consolidated record
- **Source**: ES-NK (MK: Illahun); ES-PT (Dendera Cal 1, Cal 2); BL p. 244
- **Period**: MK and Ptolemaic
- **Description**: Bleeker: major Hathor festival at Denderah. Dendera Cal 1: "Feast of Drunkenness; feast of repeated drunkenness of this goddess; her barque is rowed." Dendera Cal 2: "Feast of the Purification of Re and of Drunkenness of the Lady of Dendera"; total 5 days of feast; procession of Hathor to temple roof; union with solar disc.
- **Recommended entry**: `"0-20"` — *Fiesta de la Embriaguez (de Hathor)* — "I Akhet 20. 'Fiesta de la Embriaguez de la Señora de Dendera' (Dendera Cal. 1 y 2). La barca de Hathor es remada; procesión de la diosa al techo del templo y unión con el disco solar. Atestiguado en el Reino Medio (Illahun) y la época ptolemaica (Dendera, Edfu). Total: 5 días de fiesta (Bleeker, p. 244)."

---

### 6. Feast of Victory — II Peret 21
- **Priority**: MEDIUM — Ptolemaic multi-temple convergence (Esna, Edfu Cal 2, Edfu Cal 3, Dendera Cal 2)
- **Source**: ES-PT (Esna; Edfu Cal 2, Cal 3; Dendera Cal 2); BL (Conclusion Summary)
- **Period**: Ptolemaic
- **Description**: Edfu Cal 3: "Feast of Victory in the whole land; ritual as on I Akhet Day 19; 'Mekhir' is the name of this day." Feast of Hathor, Horus, and Heqa. Navigation of Hathor to Pakhet; planting of divine gardens begins.
- **Recommended entry**: `"5-21"` — *Fiesta de la Victoria (Neshmet)* — "II Peret 21. 'Fiesta de la Victoria en todo el país' (Edfu Cal. 3: Hathor; Edfu Cal. 2: Horus; Esna: Heqa; Dendera). La diosa Hathor navega hacia Pakhet. En Edfu el día se llama 'Mekhir', nombre del mes. Comienza la siembra de los jardines divinos. Atestiguado en cuatro templos ptolemaicos."

---

### 7. Feast of Sokar (Middle Kingdom) — II Peret 16
- **Priority**: MEDIUM — MK date distinct from the NK Day 26 cycle
- **Source**: BL p. 70; ES-NK (MK: Illahun)
- **Period**: Middle Kingdom only (later shifted to IV Akhet 26 in NK)
- **Recommended entry**: `"5-16"` — *Fiesta de Sokar (versión del Reino Medio)* — "II Peret 16. Fecha del Festival de Sokar en el Reino Medio (papiros de Illahun; Bleeker p. 70). En el Reino Nuevo la fecha se desplazó al 26 de IV Akhet. Nota: fechas distintas reflejan la evolución del calendario a lo largo de los siglos."

---

### 8. Beautiful Feast of the Valley — II Shomu (day uncertain)
- **Priority**: MEDIUM — festival is real and major but specific day (app's "9-25") is unconfirmed
- **Source**: ES-NK (NK: MH, undated Shomu); BL p. 152–175
- **Period**: NK; likely earlier
- **Description**: The divine boat of Amon-Re crosses from Karnak to the west-bank necropolis of Thebes; dead commemorated at their tombs; funerary banquet. "Emerge from the earth, behold Re and follow Amon in his beautiful festival of the desert valley" (Bleeker p. 152).
- **Recommendation**: Retain the "9-25" entry but make the specific date provisional (see findings for "9-25" above). Add Bleeker's description.

---

## Integration recommendations

### 1. Delete or substantially revise the two invented entries (HIGH)
- `"11-9"` (Unión con el Disco Solar) — no source; delete.
- `"11-24"` (Fiesta de Ptah-al-sur-de-su-muro) — based on a dating synchronism, not a recurring festival; delete or downgrade to a footnote.

### 2. Fix the two wrong-date entries (HIGH)
- `"3-4"` (Masticación de Cebollas para Bastet) → move to `"7-4"` (IV Peret 4, MH 1373).
- `"1-15"` (Inicio de la Fiesta de Opet) → correct the start date to `"1-18"` (eve) / `"1-19"` (Day 1), which are directly attested in Medinet Habu.

### 3. Add the Opet festival (HIGH)
Add entries at `"1-18"` and `"1-19"` (the primary start dates per Medinet Habu). The existing range logic already covers II Akhet 16–III Akhet 12 generically, so a dedicated header entry for the festival's opening is the main gap.

### 4. Add the Festival of Sokar principal day (HIGH)
Add `"3-26"` as the principal Sokar festival day. This is the most widely attested single festival in the entire IV Akhet / Khoiak month and is currently absent. Optionally add `"3-20"` (Purification of the Ennead, cycle start).

### 5. Add the Feast of Drunkenness and Great Procession of Osiris (HIGH)
Add `"0-20"` (Feast of Drunkenness of Hathor, MK + Ptolemaic) and `"0-22"` (Great Procession of Osiris, MK + NK). Both are flagged as major gaps in the consolidated record and are among the best-attested I Akhet festivals absent from the app.

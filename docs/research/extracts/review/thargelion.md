# Review: Thargelion
Sources: Parke (1977) *Festivals of the Athenians*, pp. 146–155; Deubner (1932) *Attische Feste*
Date: 2026-10-25

App block: `utils/atticCalendarData.ts`, lines 122–128 (`monthIndex === 10`)

---

## Thargelia Day 1 — Day 6

**Parke**: Two pharmakoi (ugly, poor men — one representing the men of Athens, one the women; one with black figs, one with white) were fed at state expense, led through the city, beaten with fig-branches **and** squill, then expelled. A ram was also offered on the Acropolis to Demeter Chloe. Day 6 is not treated as an inauspicious day; the two-day structure parallels the plague-purification pattern of *Iliad* 1.314. Deubner adds that the pharmakoi were struck seven times on the genitals to concentrate and neutralise pollution.

**Deubner**: Confirms day 6 as purification day. Pharmakoi beaten with fig-branches and squill; struck seven times on the genitals. Philochoros places the Demeter Chloe offering on the Acropolis on this day.

**App**: Deity "Apolo". `isApaphrades: true`. festivalDesc: "Purificación violenta… dos chivos expiatorios humanos (Pharmakoi), alimentados a expensas del estado y luego expulsados." Aition: "son golpeados con cebollas silvestres y expulsados. Se creía que la cebolla actuaba como desinfectante mágico, absorbiendo la plaga de toda la ciudad."

**Verdict**: WRONG_FLAG | MISSING_DETAIL | UNSOURCED_AITION

**Issues**:

1. **`isApaphrades: true` is wrong.** Day 6 is not a dies nefastus in either source. Only Plynteria (day 25) carries that status in Thargelion. The `isApaphrades` flag here will incorrectly render the day as taboo in the UI.

2. **Fig-branches are missing from the beating implements.** Both Parke and Deubner specify fig-branches *and* squill. The aition mentions only "cebollas silvestres" (squill). The fig-branch is the better-attested element (Hipponax) and must be added.

3. **"Desinfectante mágico" is an unsourced rationalisation.** Neither source frames squill or fig-branches as a "magical disinfectant that absorbs plague." Parke explains the custom as a purification rite in the Iliadic pattern (purge, then offer). Remove this interpretive gloss or replace it with the Iliadic pattern.

4. **"Mendigos o criminales"** — Parke specifies "ugly, poor men," fed at public expense, not necessarily criminals. "Criminales" is an overstatement.

5. **Missing**: the two classes of pharmakoi (one for men / one for women) and the distinguishing fig-necklaces (black vs. white).

6. **Missing**: the ram sacrifice to Demeter Chloe on the Acropolis (attested by Philochoros, noted by both Parke and Deubner).

**Fix**:
- Remove `isApaphrades: true`.
- Add fig-branches to the beating implements: "golpeados con ramas de higuera y cebollas silvestres (squill)."
- Replace the "desinfectante mágico" aition with the Iliadic pattern: "El rito sigue el modelo iliádico (Il. 1.314): purificación el día primero, ofrenda el segundo. Uno de los Pharmakoi representaba a los hombres de Atenas, otro a las mujeres, distinguidos por collares de higos negros o blancos."
- Add the Demeter Chloe ram sacrifice as a secondary note or separate entry.

---

## Thargelia Day 2 — Day 7

**Parke**: A *thargelos* (pot of all grains and vegetables boiled together) was offered to Apollo as firstfruits — the central act naming the festival. Choral and musical *agones*: ten tribes paired into five men's choirs + five boys' choirs of 50 each, organised by the Archon Eponymos. Victor's choregos dedicated a tripod at the Pythion. The Phratriai also held sacrifice; fathers presented newly adopted or natural sons at the Phratria altar.

**Deubner**: Confirms firstfruits pot and a loaf (*thargelos*) conveyed to the deity in a solemn pompe organised by the Archon Eponymos. Choral competitions with choregoi. Confirms the Phratriai role.

**App**: festivalDesc: "Ofrenda de una olla con el primer grano (Thargelos). Gran competición de coros masculinos de las tribus." agonDesc: "coros de 50 hombres y 50 niños." economyDesc mentions choregos and tripod at the Pythion.

**Verdict**: MISSING_DETAIL

**Issues**:

1. **festivalDesc says "coros masculinos"** but the competition included both men's and boys' choirs. The agonDesc correctly states "50 hombres y 50 niños" — the festivalDesc contradicts it. Align them.

2. **Missing**: the Phratria custom — fathers presenting sons at the Phratria altar on this day (attested by Plato's *Republic* and Isaeus, cited by Parke). This is a significant civic dimension of the festival absent from the app.

3. **Missing**: the *thargelos* loaf (in addition to the pot). Deubner notes both a cooked pot and a baked loaf were offered.

4. Minor: the pompe organised by the Archon Eponymos (Deubner) is not mentioned in the app.

**Fix**:
- Change festivalDesc to "Ofrenda de una olla con el primer grano (Thargelos) y un pan de grano nuevo. Gran competición de coros de hombres y niños de las diez tribus."
- Add a note on the Phratria presentations (e.g., in `participants` or a `phratryNote`).

---

## Bendideia — Day 19

**Parke**: Day 19 Thargelion. Two processions converged on the Bendis sanctuary near Munichia: one Athenian (from the Prytaneion), one Thracian. Participants were provided with sponges, basins, water, and garlands on arrival. An equestrian torch relay-race took place after dusk — a Greek novelty. All-night festival (pannychis). Founded 429 BCE after the oracle of Dodona (not Delphi, which was hostile) gave approval. Sitalces, Thracian king, was an Athenian ally; Thracian metoikoi in the Piraeus had the right to acquire land and found the sanctuary.

**Deubner**: Day 19 extending into night of the 20th. Double pompe in the Piraeus (Athenian epichoroi + Thracian residents). Crowns and morning meal provided. Horseback torch-race by Thracians. Pannychis. Officially recognised by 429/8 BCE.

**App**: Deity "Bendis (Artemisa Tracia)". festivalDesc: "Espectacular carrera de antorchas a caballo de noche en el Pireo." participants: "Tracios residentes y Atenienses." pannychisDesc: mentions torch race and pannychis. Aition: "Atenas permitía esta carrera nocturna a caballo para agradar a los reyes tracios y asegurar la importación de trigo desde el Mar Negro, justificándolo mediante la asimilación de Bendis con Artemisa."

**Verdict**: UNSOURCED_AITION | MISSING_DETAIL

**Issues**:

1. **The grain-import aition is entirely unsourced.** Neither Parke nor Deubner mentions grain imports from the Black Sea as a motivation. Parke's account is political (Sitalces as ally, Athenian strategic interest in Thrace) and religious (oracle of Dodona's approval; Thracian metoikoi community). The grain-import claim is invented and should be removed.

2. **Missing the dual-procession structure.** Both Parke and Deubner emphasise that two separate processions took place simultaneously — one Athenian from the Prytaneion, one Thracian. This is the distinctive feature of the Bendideia. The app lists both groups as participants but does not describe the dual procession.

3. **Missing**: the oracle of Dodona (not Delphi) as the authorising oracle — a notable detail (Parke).

4. **Missing**: the wash-up provisions on arrival (sponges, basins, garlands) — Parke.

5. **Identification of Bendis with Artemis** is accurate and attested (Parke confirms).

6. Day (19th) is correct per both sources.

**Fix**:
- Replace the grain-import aition with: "El culto fue fundado oficialmente en 429 a.C. con sanción del estado ateniense tras consultar el oráculo de Dodona (no Delfos, entonces hostil). Atenas concedió a los tracios residentes (metoikoi) en el Pireo el derecho a adquirir terrenos y fundar un santuario. La carrera de antorchas a caballo fue una novedad: las carreras de antorchas griegas se corrían a pie; los tracios la introdujeron a caballo."
- Add the dual-procession structure to festivalDesc or pannychisDesc.

---

## Plynteria — Day 25

**Parke**: Day 25 (confirmed from "better source"; also described as "penultimate day"). Praxiergidai genos stripped and wrapped the old wooden image of Athena Polias with much ceremonial. Procession to Phaleron; two *Loutrides* (young women) washed the image in the sea; the *peplos* was washed by a special priestess (peplotheke). Torchlight return. Rope barrier across all sanctuary entrances; no business, oaths, or serious acts permitted. Dies nefastus: most inauspicious day of the Attic year. Aition: fig-basket carried by a woman leading the procession; figs = first food cultivated by man (Deubner's alternative: refreshment for the picnic). Xenophon records Alcibiades' return on this day as an ill omen.

**Deubner**: Day 25 from Plutarch (*Alc.* 34.1). Praxiergidai removed clothing secretly; image covered. Procession to Phaleron; two *plyntrides* washed it. Epheboi escorted. All sanctuaries roped off. ἡμέρα ἀποφράς (inauspicious). Photios' date of 29th rejected.

**App**: festivalDesc: "Día nefasto. La estatua de la diosa era despojada, el templo cerrado con cuerdas, y la estatua se lavaba en el mar de Falero." participants: "Praxiergidai, Epheboi." `isApaphrades: true`. Aition: "En la procesión se llevan pastelitos de higo. El mito asegura que los higos fueron la primera comida civilizada cultivada por la humanidad, y se le ofrecen a Atenea como 'picnic' para su día de baño en el mar."

**Verdict**: MISSING_DETAIL

**Issues**:

1. **"el templo cerrado con cuerdas"** understates the scope. Both Parke and Deubner specify that ALL sanctuaries in Athens were roped off, not only Athena's temple. The city was treated as in a state of general divine absence and ritual pollution.

2. **Missing**: the two *Loutrides* (plyntrides) — the named young women who performed the actual washing. This is a distinctive and well-attested detail.

3. **Missing**: the *peplotheke* (priestess-laundress who washed Athena's peplos separately).

4. **Missing**: the image was wrapped and covered for transport; it was forbidden for the public to see it (mystery-like solemnity). The app implies only washing, not the wrapping/transport secrecy.

5. **Missing**: the torchlight return procession.

6. **The fig aition is essentially sourced.** Parke gives both readings (first food of man; Deubner's picnic alternative). The app combines both correctly, though "pastelitos" for "sweetmeats made of figs" is acceptable.

7. `isApaphrades: true` is correct here.

8. Day (25th) and deity (Athena Polias) and participants (Praxiergidai, Epheboi) are all correct.

**Fix**:
- Change "el templo cerrado con cuerdas" to "todos los santuarios de Atenas eran acordonados con cuerdas."
- Add to participants or festivalDesc: the two *Loutrides* who washed the image in the sea, and the *peplotheke* who washed the peplos.
- Add a note that the image was wrapped and veiled for the procession — it could not be seen.

---

## Kallynteria — Day ~20–25 (MISSING FROM APP)

**Parke**: The "Beautification by sweeping and polishing" — the annual clean-up of the Erechtheion by priestesses and women with cleansing duties, under direction of the Praxiergidai. Exact date uncertain (Parke places it between 20th and 25th, rejecting a late lexicon's "19th" because that coincides with the Bendideia). Deubner infers it was also the day the eternal golden lamp of Athena Polias (Callimachus' lamp) was refilled with olive oil — the annual cleaning being the sensible time to do so. No aition is recorded.

**Deubner**: "Shortly before day 25" (rejecting Photios' 19th). Sweeping and cleaning of the Athena Polias temple. Renewal of the oil in the golden eternal lamp (Callimachus' lamp) probably on this day. No ritual details survive; the name is the primary evidence.

**App**: No entry for Kallynteria in Thargelion.

**Verdict**: MISSING_FESTIVAL

**Issue**: The Kallynteria is attested in both Parke and Deubner as a distinct Thargelion festival for Athena Polias and is unambiguously placed in this month. Its omission leaves a gap between the Bendideia (day 19) and the Plynteria (day 25). A day-20–24 floating entry is appropriate given the uncertain date.

**Fix**: Add a floating entry for approximately day 22–23 (or place it as `dayOfMonth === 22` with a note that the exact day is uncertain):

```
festivalName: "Kallynteria",
deity: "Atenea Polias",
deityDesc: "Diosa protectora de la ciudad.",
festivalDesc: "Barrido y limpieza solemne del Erecteion por las sacerdotisas. Probablemente también se rellenaba la lámpara de oro de Calímaco, que ardía perpetuamente en el santuario. La fecha exacta es incierta (entre los días 20 y 25).",
category: "Purificación y Expiación",
participants: "Sacerdotisas de Atenea; mujeres con funciones rituales de limpieza"
```

No aition should be invented — none is recorded in either source.

---

## Summary table

| Day | Festival | Day OK | Deity OK | Main issues |
|-----|----------|--------|----------|-------------|
| 6 | Thargelia I | Yes | Yes | `isApaphrades` wrong; fig-branches missing; aition unsourced; Demeter Chloe missing |
| 7 | Thargelia II | Yes | Yes | `festivalDesc` says "masculinos" only; Phratria detail missing |
| 19 | Bendideia | Yes | Yes | Grain-import aition unsourced; dual procession not described |
| 25 | Plynteria | Yes | Yes | Scope of rope closure understated; Loutrides/peplotheke missing; wrapping secrecy missing |
| ~22 | Kallynteria | — | — | **MISSING FESTIVAL** |

---

## Festivals in sources but not in app (beyond Kallynteria)

- **Demeter Chloe offering (Day 6)**: Philochoros ap. Schol. Aristoph. *Lys.* 835; both Parke and Deubner note a ram offered on the Acropolis to Demeter Chloe on Thargelion 6, concurrent with the Thargelia purification. Could be a secondary note on the day-6 entry rather than a separate entry.

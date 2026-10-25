# Review: Gamelion
Sources: Parke (1977), Deubner (1932)
Date: 2026-10-25

App block: `utils/atticCalendarData.ts`, `monthIndex === 6` (lines 93–96)

---

## Lenaia — Day 12

**Parke**: Day 12 confirmed. Procession organised by the Basileus; Daiduchos invocation "Son of Semele, Iacchos, giver of wealth"; dramatic contests of comedy AND tragedy; Athenians only, foreigners excluded (even metoikoi). Women's midnight revel reconstructed from vase-painting, flagged as not in literary sources. No aition given by Parke.

**Deubner**: Day 12 confirmed. Eleusinian Dadouchos invoked the god ("Kalete theon!"); Eleusinian episkopioi sacrificed; dramatic agon (tragedy AND comedy) organised by the Basileus; women performed an orgiastic rite (Lēnai) before a columnar Dionysus mask with ecstatic dancing, thyrsos, torches, tympana; skōmmata (ritual mockeries) thrown from wagons.

**App**: Day 12. Deity "Dionisio Lenaios". Description: "Festival dramático de invierno en el recinto del Lenaion. Famoso por sus competiciones de comedia." Aition: "Las devotas (Lenai) y los coros invocan a Dionisio en lo más oscuro del invierno. El rito asume que la magia extática del vino y el teatro genera un calor divino capaz de derrotar al frío y resucitar las plantas."

**Verdict**: WRONG_DETAIL | UNSOURCED_AITION

**Issues**:
1. The description singles out comedy but both Parke and Deubner attest tragedy AND comedy as equal components of the dramatic agon. This is a material error of omission.
2. The aition ("calor divino que derrota al frío y resucita las plantas") has no ancient support. Neither Parke nor Deubner records any aition for the Lenaia. Parke explicitly says none is discussed. The "magical heat" framing is modern romantic invention.
3. The key ritual details attested by both sources are absent: exclusion of foreigners (Parke: "a more native and intimate occasion"); the Daiduchos/Dadouchos invocation formula; the women's orgiastic rite (Lēnai) before the columnar Dionysus mask (Deubner).

**Fix**:
- Change "competiciones de comedia" to "competiciones de comedia y tragedia".
- Remove the aition entirely, or replace with a non-aition note referencing the exclusion of foreigners and the women's rite: "El único festival dramático exclusivamente para ciudadanos atenienses (ni extranjeros ni metecos). El daduco eleusinio invocaba al dios: '¡Invocad al dios!'. Las devotas (Lēnai) realizaban ritos extáticos ante una máscara de Dionisio."

---

## Theogamia / Gamelia / Hieros Gamos — Day 26 (app) vs. ca. Day 24 (Deubner)

**Parke**: Day 26 explicitly. "Celebrated on the 26th of the month as the anniversary." No ritual details preserved. Connection between human weddings in Gamelion and the divine model noted but the causal direction left unresolved. No aition given. Fn. 122: "No details of the festival of the Hieros Gamos (Sacred Wedding) or the Gamelia are preserved."

**Deubner**: "ca. Day 24." Calls the festival Theogamia / Gamelia. Attests a sacrifice to Zeus Hēraios on the Akropolis (a piglet, IG I² 840.20). Notes the month Gamelion is named from the associated feast (Gamelia). Notes Athenians favoured the days approaching the new moon as auspicious for human marriages.

**App**: Day 26. Name "Theogamia (Hieros Gamos)". Deity "Zeus y Hera". Description: "Celebración del matrimonio sagrado de los dioses, coincidiendo con la temporada popular de bodas en Atenas." Aition: "Se celebra la unión carnal del Rey y la Reina del cielo para que esa chispa de fertilidad celestial caiga sobre los campos congelados del Ática y los prepare para la primavera."

**Verdict**: WRONG_DAY (minor — sources conflict) | UNSOURCED_AITION | MISSING_DETAIL

**Issues**:
1. **Day conflict between sources**: Parke says 26th, Deubner says ca. 24th. The app follows Parke's day (26). This is defensible but should be flagged in a comment. Deubner's figure (24) has epigraphic backing (IG I² 840.20 is an old sacrifice calendar); Parke's figure is not explicitly sourced. Deubner's "ca. 24" is likely more reliable.
2. **Aition is invented**: Parke is explicit that "no details of the festival are preserved." The "fertilidad celestial que cae sobre los campos congelados" is modern romantic invention with no ancient attestation in either source.
3. **Missing detail**: The sacrifice to Zeus Hēraios (a piglet on the Akropolis, IG I² 840.20) is the only positively attested ritual element (Deubner) and is absent from the app.
4. **Missing name**: The name "Gamelia" (which gives the month its name) is absent. The app uses only "Theogamia (Hieros Gamos)".

**Fix**:
- Change day to 24 (Deubner, epigraphic; add code comment noting Parke says 26).
- Remove the aition; replace with the only attested fact: "Los detalles del rito no se han conservado. Se sabe que se ofrecía un lechón a Zeus Hēraios en la Acrópolis. El nombre del mes, Gamelion, deriva de esta fiesta (Gamelia)."
- Add the name "Gamelia" to `festivalName`, e.g. `"Theogamia / Gamelia (Hieros Gamos)"`.

---

## MISSING FESTIVALS — In sources but not in app

### Kittoseies Dionysou — Day 19

**Deubner**: Ivy-crowning of Dionysus images; attested in private sacrifice calendar of imperial date (IG² 1367.21). Not discussed by Parke.

**App**: No entry for Gamelion day 19.

**Verdict**: MISSING_FESTIVAL

**Issue**: Attested in an inscribed sacrifice calendar. Minor but real.

**Fix**: Optional — the imperial-date attestation is thin and the rite is minor. If adding: `{ festivalName: "Kittoseies Dionysou", deity: "Dionisio", festivalDesc: "Coronación de las imágenes de Dionisio con hiedra (kittós).", category: "Dramático y Dionisíaco" }`. No aition is attested.

---

### Goat sacrifice to Dionysos — Last third of month (φθίνοντος)

**Deubner**: Sacrifice of a select goat (ἐρίφος κριτός) to Dionysus; attested in IG I² 840.16 (old sacrifice calendar) and depicted on the Hagios Eleutherios calendar frieze (Dionysus riding a goat in the Gamelion panel). Not discussed by Parke.

**App**: No entry for this rite.

**Verdict**: MISSING_FESTIVAL

**Issue**: The rite is epigraphically attested and iconographically confirmed by the frieze. Day within the last third is not fixed.

**Fix**: Optional addition for the last third of the month (e.g. day 27 as a proxy, flagged as approximate): `{ festivalName: "Sacrificio de la Cabra a Dionisio", deity: "Dionisio", festivalDesc: "Se sacrificaba una cabra selecta (ἐρίφος κριτός) a Dionisio. Atestiguado en el calendario de sacrificios IG I² 840 y en el friso del calendario del Hagios Eleutherios.", category: "Dramático y Dionisíaco" }`. No aition attested.

---

### Ambrosia — Month (uncertain attribution)

**Deubner**: A festival called Ambrosia celebrated for Dionysus of the Lenai in Gamelion; attested by Plutarch in a scholion on Hesiod. Deubner flags its Athenian attribution as uncertain.

**App**: Not present.

**Verdict**: MISSING_FESTIVAL (acceptable omission)

**Issue**: Deubner himself marks the Athenian attribution as uncertain. Omission is defensible.

**Fix**: None required. If added, must be noted as "atribución ateniense incierta (Deubner)."

---

## Summary table

| Day | Festival | Day verdict | Deity verdict | Aition verdict | Key missing detail |
|-----|----------|------------|--------------|---------------|--------------------|
| 12 | Lenaia | OK (both sources) | OK | UNSOURCED | Tragedy omitted; foreigners excluded; Dadouchos invocation; women's orgiastic rite |
| 26 | Theogamia | WRONG_DAY (Deubner: 24) | OK | UNSOURCED | Gamelia name; piglet sacrifice to Zeus Hēraios |
| 19 | Kittoseies Dionysou | — | — | — | MISSING_FESTIVAL (thin attestation) |
| ~27 | Goat sacrifice | — | — | — | MISSING_FESTIVAL (epigraphically attested) |
| ? | Ambrosia | — | — | — | MISSING_FESTIVAL (uncertain; omission acceptable) |

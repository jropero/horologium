# Review: Poseideon
Sources: Parke (1977), Deubner (1932)
Date: 2026-10-25

App block: `atticCalendarData.ts` lines 87–90 (monthIndex === 5). Two entries: day 19 and day 26.

---

## Dionisias Rurales (Rural Dionysia) — Day 19

**Parke**: No fixed day; explicitly states the festival "was not tied to a single date in the month." It took place "in the latter part of Poseideon" at the choice of each township (pp. 100–103).

**Deubner**: "Posideon, before 19th (Myrrinus assembly date)." The 19th is the date of a *deme assembly* at Myrrinus that discussed arrangements for the festival — so the festival itself fell *before* the 19th, not on it. (dionysos-pt2.md)

**App** (day 19): `festivalName: "Dionisias Rurales"`, `deity: "Dionisio"`. agonDesc describes askoliasmos ("odres de piel de cabra inflados y engrasados con vino"). Aition: "Los jóvenes saltan sobre un odre de vino engrasado como burla ritual hacia el chivo, el animal que devoraba las viñas sagradas. Bailar sobre la piel de la bestia muerta era la venganza del viñador."

**Verdict**: WRONG_DAY | UNSOURCED_AITION

**Issues**:
1. Day 19 is wrong. The Myrrinus assembly *about* the festival fell before the 19th; the festival itself had no fixed day. Deubner's phrasing "before 19th" refers to the assembly date, not the festival date. Parke is explicit there was no single fixed day.
2. The aition is entirely unattested. Neither Parke nor Deubner give any aition for the Rural Dionysia, and neither source mentions anything about the goat that ate the vines or "revenge of the vineyard worker." Parke describes askoliasmos as a traditional game without an origin story.
3. Minor: the askoliasmos description ("odres de piel de cabra inflados y engrasados con vino") conflates the object (inflated greased goatskin) with wine-greasing; Parke says the skin was "blown up and greased," not specifically greased with wine.
4. Missing key ritual elements: daughter of the household as Kanephoros (basket-bearer); phallic song (*phallikon*) sung by the father; the he-goat as the standard sacrificial victim; slaves as full participants. These appear in both Parke and Aristophanes' *Acharnians* (Parke's primary source).

**Fix**:
- Remove fixed day assignment. If the calendar requires a placeholder, use a range or note "(sin fecha fija; segunda mitad del mes)."
- Delete the aition entirely — no ancient source provides one.
- Add Kanephoros, phallic song, and slave participation to the description.

---

## Haloa — Day 26

**Parke**: Day 26, "towards the end of the month, on the 26th." Deity: Demeter primarily; Dionysus described as "probable" and "intrusive into what was originally a festival of corn." Name etymology is "best left as unexplained." Ritual: women-only banquet at Eleusis; magistrates prepared and then departed; forbidden foods include pomegranate, apple, eggs, fowls, mullet, and certain fish; women carried models of *both* male *and* female genital organs; clay phallic objects set in the field; priestesses whispered to individual women — content of whispering not recorded by any source. (pp. 98–100)

**Deubner**: Day 26, Demeter + Kore. Women handled obscene objects and engaged in aischrologia; a great banquet of everything the earth and sea provide, with the same category of forbidden foods; priestesses whispered incitement; hetairai participated prominently; a pompé for Poseidon also connected. (demeter-pt2.md)

**App** (day 26): `deity: "Deméter y Dionisio"`. Description: "Fiesta de fertilidad en Eleusis. Banquete nocturno exclusivo para mujeres con abundancia de vino y símbolos fálicos para estimular las semillas." ritualOffering: "Pasteles con forma de símbolos fálicos." Aition: "Se comen pasteles con formas genitales y las sacerdotisas susurran a las mujeres que busquen amantes. Es magia simpática: al estimular la fertilidad humana, se estimulan las semillas de trigo recién plantadas."

**Verdict**: WRONG_DEITY | UNSOURCED_AITION | MISSING_DETAIL

**Issues**:
1. **WRONG_DEITY**: Dionysus is presented as co-equal with Demeter. Parke explicitly calls Dionysus's role "probable" and "intrusive into what was originally a festival of corn." Deubner lists the deity as "Demeter + Kore" — Kore/Persephone is omitted from the app entirely. The correct pairing per both sources is Demeter (+ Kore/Persephone) primary, Dionysus secondary.
2. **UNSOURCED_AITION — whispering content**: Parke states the content of the priestesses' whispering was "not recorded" by any ancient source. The app claims they whispered to women to "busquen amantes" (seek lovers), which is an extrapolation beyond what any source says.
3. **UNSOURCED_AITION — sympathetic magic frame**: The aition's core claim — that human fertility stimulation by the genital models was intended as sympathetic magic to stimulate newly planted seeds — is a modern anthropological interpretation, not an ancient aition. Neither Parke nor Deubner attribute this rationale to any ancient source as an *aition*; Parke connects the phallic element to the fertility season, but as a scholar's interpretation of the rite's function, not a mythological aition.
4. **WRONG_DETAIL — genital models**: The app says "símbolos fálicos" (phallic symbols). Parke is explicit that women "carried models of male *and* female genital organs" — both types, not only phallic.
5. **MISSING_DETAIL — forbidden foods**: Both Parke and Deubner specifically list the forbidden foods (pomegranate, apple, eggs, domestic fowl, mullet, certain fish). This is one of the most distinctive documented details of the Haloa banquet and is absent from the app.
6. **MISSING_DETAIL — Poseidon connection**: Deubner notes a pompé for Poseidon was also connected to the Haloa. Parke corroborates this from an inscription. Not present in app.

**Fix**:
- Change `deity` to "Deméter y Perséfone" (primary); note Dionysus as secondary/probable.
- Remove the whispering-content claim from the aition, or rephrase to "las sacerdotisas susurraban a las mujeres (el contenido no está registrado)."
- Either remove the aition entirely or reframe it as a scholarly interpretation, not a mythological origin story.
- Change "símbolos fálicos" to "símbolos de órganos masculinos y femeninos."
- Add the forbidden foods list to festivalDesc or ritualOffering.

---

## Poseidea — Day 8 [MISSING FESTIVAL]

**Parke**: Day 8 (probable, resting on two sacrificial calendars only; no literary source confirms it). Festival of Poseidon, largely unknown. Existence of the *Poseidea* confirmed; a penteteris at Sunium with a regatta is attested for Poseidon but Parke explicitly doubts it fell in this month. (pp. 97–98)

**Deubner**: Day 8 (probable). "State festival named for the month; largely lost; probably on the 8th (Poseidon's special day for Athenians); private calendar attests a sacrifice to Poseidon Khamaizelios with wineless libations; a penteteris at Sunion with Athenian theoria and regatta." (various-heroes-apaturia.md)

**App**: No entry for day 8 in Poseideon.

**Verdict**: MISSING_FESTIVAL

**Issue**: Both sources attest a festival called *Poseidea* in Poseideon, tentatively on day 8. While its ritual content is almost entirely unknown, its existence and probable date are sufficiently established in the scholarly record (Parke p. 97; Deubner) to warrant at minimum a minimal entry. The month is named after Poseidon; the absence of any entry for the god in his own month is a notable gap.

**Fix**: Add a minimal entry for day 8: `festivalName: "Posidea"`, `deity: "Poseidón"`, brief description noting it is a largely unknown state festival; no aition should be invented. Flag it explicitly as poorly attested.

---

## Summary table

| Day | Festival | Verdict |
|-----|----------|---------|
| 8   | Poseidea | MISSING_FESTIVAL |
| 19  | Dionisias Rurales | WRONG_DAY + UNSOURCED_AITION |
| 26  | Haloa | WRONG_DEITY + UNSOURCED_AITION + MISSING_DETAIL |

**Priority fixes:**
1. Rural Dionysia day: remove fixed day 19 — no ancient source assigns this day to the festival.
2. Rural Dionysia aition: delete entirely — unattested in any source.
3. Haloa deity: demote Dionysus to secondary; add Kore.
4. Haloa aition whispering: remove specific content claim — no source records it.
5. Haloa genital models: correct to male *and* female.
6. Poseidea: add minimal day-8 entry.

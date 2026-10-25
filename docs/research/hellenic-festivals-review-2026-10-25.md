# Hellenic Festival Data Review — Consolidated Report
**Date:** 2026-10-25
**Sources cross-referenced:** Parke (1977), Deubner (1932), Mikalson (1975)
**Scope:** All twelve Attic months, `utils/atticCalendarData.ts`, `getAtticFestivalInfo(monthIndex, dayOfMonth)`
**Excluded by prior decision:** Thesmophoria (Pyanepsion 11–13), Skira (Skiraphorion 12)

---

## 1. Executive Summary

### Finding counts by severity category

| Category | Count |
|---|---|
| WRONG_DATE | 9 |
| WRONG_DEITY | 6 |
| INVENTED_AITION | 25 |
| WRONG_RITUAL | 7 |
| MISSING_FESTIVAL | 17 |
| MINOR | 16 |

### Top 5 most urgent fixes

1. **Add Stenia (Pyanepsion 9)** — attested by Parke, Deubner, and Mikalson (explicitly listed in Calendar II). A named women's festival entirely absent from the app, sandwiched between the Theseia (day 8) and the Thesmophoria (days 11–13).
2. **Add Chalkeia (Pyanepsion 30)** — attested by Parke, Deubner, and Mikalson. One of the two major closing festivals of Pyanepsion, absent from the app, including the vital peplos-loom ceremony that opens the Panathenaic weaving cycle.
3. **Fix Munichia (Munichion 16): remove Brauronia conflation** — the app conflates two distinct festivals. "Las niñas actúan como osas" belongs to the Brauronia at Brauron, not to the Munichia at Munichia hill. Both Parke and Deubner treat these as entirely separate.
4. **Fix Anarrhysis deity (Pyanepsion, Apaturia day 2)** — app gives "Dionisio Melanaigis" as primary deity; both Parke and Deubner confirm the Anarrhysis sacrifice is to Zeus Phratrios and Athena Phratria.
5. **Add Eisagoge (Elaphebolion 8 evening)** — attested by both sources as the named torchlight procession that formally opens the City Dionysia. Its absence leaves the festival sequence structurally incomplete.

---

## 2. Finding categories

### WRONG_DATE — app places festival on wrong day vs. all/most sources

A finding is WRONG_DATE when no ancient source supports the app's specific day assignment.

### WRONG_DEITY — wrong deity name or epithet

### INVENTED_AITION — aition field states a myth not found in any of the three sources and appears invented or embellished

### WRONG_RITUAL — ritual interpretation that contradicts the sources

### MISSING_FESTIVAL — a festival attested in sources that has no entry in the app

### MINOR — minor inaccuracies, debatable interpretations, or things attested in only one source

---

## 3. Month-by-month findings

---

### Hekatombaion (monthIndex 0)

#### [WRONG_RITUAL] Kronia — Day 12

**App says:** "Los amos servían la cena a los esclavos" and the aition frames it as the Golden Age of Kronos.

**Sources say:** Both Parke (1977, pp. 29–32) and Deubner (1932) state masters and slaves *dined together* — not that masters served. The serving detail comes from the Roman Saturnalia (a cognate festival), not the Attic Kronia. Neither source invokes the Hesiodic Golden Age as the aition; Parke's aition is agricultural (end-of-harvest supper). Mikalson (1975, p. 187) confirms day 12 as ATTESTED but gives no aition.

**Fix:** Change "Los amos servían la cena a los esclavos" → "Los esclavos cenaban junto a sus amos." Trim the Golden Age framing from the aition; the harvest-supper explanation is the sourced one.

#### [INVENTED_AITION] Kronia — Day 12

**App says:** "Este festival recuerda la mítica Edad de Oro de Crono, cuando no existían clases sociales ni trabajo."

**Sources say:** Neither Parke nor Deubner uses the Golden Age narrative to explain the Kronia. Parke explicitly gives an agricultural aition (harvest-end supper). The Golden Age framing imports a Saturnalian (Roman) reading.

#### [WRONG_DEITY] Synoikia — Day 16

**App says:** Deity "Atenea" only.

**Sources say:** Parke and Deubner both confirm that the Synoikia (day 16, the annual day) included sacrifice to Zeus Phratrios as well as Athena. Deubner adds the cult of Eirene (Peace) introduced 374 BC (Cephisodotus' statue). Mikalson lists days 15–16 as a two-day ATTESTED festival block.

**Fix:** Deity field: add "Zeus Phratrios" — e.g. "Atenea y Zeus Phratrios (+ Eirene desde 374 a.C.)."

#### [INVENTED_AITION] Synoikia — Day 16

**App says:** "El mito asegura que Teseo viajó pueblo por pueblo convenciendo a los clanes para fundirse en la gran ciudad mágica de Atenas."

**Sources say:** Neither Parke nor Deubner describes Theseus as traveling from village to village persuading clans. Parke says only that the Synoikismos was "traditionally attributed to Theseus" and Thucydides accepts this.

**Fix:** Replace with: "Conmemora el Synoikismos atribuido a Teseo, la unificación de los demos del Ática (Tucídides 2.15)."

#### [INVENTED_AITION] Panathenaia — Day 28

**App says:** "la victoria épica de Atenea sobre el gigante Encélado **(o Asterión)**"

**Sources say:** Parke explicitly names Enceladus as the giant depicted on the peplos. Neither Parke nor Deubner mentions Asterión in this context; Asterión is not a Gigantomachy giant. This appears to be a fabrication or confusion with another myth.

**Fix:** Remove "o Asterión" entirely. Enceladus alone is attested.

#### [MINOR] Panathenaia — Day 28

App correctly describes the pannychis, torch-race, agons (Apobatai, Evandria), and peplos-as-ship-sail — all sourced. Missing: distinction between annual and quadrennial Great Panathenaia; Erichthonios as mythical founder (Deubner).

#### [MISSING_FESTIVAL] Apollon Hekatombaios — Day 7

Deubner infers an Apollon Hekatombaios sacrifice on day 7 from the Mykonos calendar. Parke says the Hecatombaia had "vanished from importance in Attica before classical times." Omission defensible. A day-7 note acknowledging the month's Apollonian origin would be optional.

---

### Metageitnion (monthIndex 1)

#### [WRONG_DATE] Metageitnia — Day 7

**App says:** Festival on day 7.

**Sources say:** Neither Parke (p. 51) nor Deubner assigns a day to this festival. Mikalson (pp. 37–46) explicitly states: "Metageitnia — day UNCERTAIN; no specific day can be established." Day 7 is unsupported guesswork.

**Fix:** Remove fixed day assignment. Note as "(sin fecha fija; mes de Metageitnión)."

#### [INVENTED_AITION] Metageitnia — Day 7

**App says:** "El nombre recuerda la migración mítica de los jonios desde Melite a Diomea, guiados por Apolo."

**Sources say:** Neither Parke nor Deubner records this Ionian migration narrative. Parke explicitly states no aition narrative survives.

**Fix:** Remove the migration aition entirely. Replace with: "El nombre derivaba de μετοίκησις (cambio de vecindad). Ninguna fuente ática transmite los ritos; el festival está atestiguado también en Mileto, Delos, Éfeso y Samos."

#### [WRONG_DATE] Herakleia en Kynosarges — Day 15

**App says:** Festival on day 15.

**Sources say:** Neither Parke (pp. 51–52) nor Deubner assigns day 15. The month placement is correct but no ancient source fixes it to the 15th.

#### [WRONG_RITUAL] Herakleia en Kynosarges — Day 15

**App says:** "Festival atlético celebrado en el gimnasio de Kynosarges… el único festival donde los hijos ilegítimos podían competir oficialmente."

**Sources say:** Parke characterises this as a feast festival — "generally included feasting as a prominent element." There is no mention of athletic competitions in Parke or Deubner. The app inverts the character of the festival entirely. Parke and Deubner both specify nothoi (children of mixed Athenian/foreign marriages), not metecos — a different legal category. The app also omits: the bull-lifting rite (the animal lifted bodily onto the altar for throat-cutting — the most distinctive detail in Parke), and the twelve Parasitoi.

**Fix:** Change "Festival atlético" to "Festival de sacrificio y banquete." Remove athletics agonDesc. Correct "metecos" to "nothoi (hijos de ciudadano y extranjera)." Add the bull-lifting rite and the Parasitoi.

#### [INVENTED_AITION] Herakleia en Kynosarges — Day 15

**App says:** White-dog (Kynosarges etymology) story — a dog stole sacrificial meat, the Oracle sanctified the spot.

**Sources say:** This etymology from late sources (scholia, Harpocration) is not in Parke 1977 or Deubner 1932. Cannot be confirmed from the scholarly sources used.

#### [MISSING_FESTIVAL] Eleusinia — Month (day uncertain)

Deubner attests an agonistic festival (Eleusinia) distinct from the Eleusinian Mysteries — placed in Metageitnion or early Boedromion, with athletic and musical competitions, a pompe with kanephore, sacrifices to Hermes, Poseidon, Artemis, Triptolemos, and the Two Goddesses; prizes of sacred Rarian barley. Not in the app.

**Fix:** Add entry noting disputed placement (Metageitnion or early Boedromion) and that exact day is unknown.

---

### Boedromion (monthIndex 2)

#### [INVENTED_AITION] Genesia — Day 5

**App says:** "Solón impuso este mito social: los caídos ya no pertenecían a sus familias, sino que la diosa Tierra (Ge) absorbía su sangre para convertirla en el cimiento invencible que unificaba a toda Atenas."

**Sources say:** Neither Parke nor Deubner describes any such narrative. Parke gives no mythological aition at all; the explanation is historical (Solon converting an aristocratic rite to a state festival). Mikalson (p. 187) confirms Genesia Boedromion 5 as ATTESTED; no aition recorded.

**Fix:** Remove the Ge-blood-foundation aition entirely. Replace with the historical explanation: Solon transformed an aristocratic clan rite into a state day of public mourning.

#### [WRONG_DEITY] Genesia — Day 5

**App says:** Deity "Los Muertos."

**Sources say:** Deubner explicitly notes sacrifice was made to Ge (Earth) as well as for the dead. Ge is missing from the deity field.

**Fix:** Add Ge as secondary deity.

#### [MINOR] Artemis Agrotera — Day 6

Both Parke and Deubner confirm: the 6th was chosen because Artemis already had a festival on that day (Apollo's birthday being the 7th, his twin born a day earlier). This calendrical logic is absent from the app but the rest of the entry is accurate. Mikalson confirms Boedromion 6 as ATTESTED.

#### [INVENTED_AITION] Boedromia — Day 7

**App says:** "los ejércitos de Eleusis iban a masacrar Atenas" and frames the end of the campaign season as established fact.

**Sources say:** Parke says Eumolpus was winning when Ion came to help — not that Eleusis was about to massacre Athens. The end-of-campaign-season explanation is Parke's speculation, not established. The Ion legend Parke explicitly calls "a typical story invented to explain a cult, but it is unnecessary."

**Fix:** Replace "masacrar Atenas" with "estaban venciendo a los atenienses." Flag the Ion legend as a secondary aetiological myth Parke considers doubtful.

#### [MISSING_FESTIVAL] Day 13 — Escort of the Hiera

Both Parke and Deubner confirm: Epheboi marched to Eleusis on the 13th to escort the sacred objects (Hiera) in round kistai with purple ribbons back to Athens. No app entry. Mikalson's Mysteries block (Boedromion 15–17, 19–22) implies the 13th was preparatory.

**Fix:** Add a Day 13 entry: deity Demeter y Perséfone; epheboi march to Eleusis, escort kistai (round boxes, purple ribbons), Phaidryntes reports to priestess of Athena on arrival.

#### [MISSING_FESTIVAL] Day 14 — Arrival of the Hiera

Deubner explicitly lists Day 14: the sacred objects arrived and were deposited in the urban Eleusinion. No app entry.

**Fix:** Add a Day 14 entry: the Hiera deposited in the Eleusinion. Those to be initiated not yet involved.

#### [INVENTED_AITION] Agyrmos (Mysteries day 1) — Day 15

**App says:** "El heraldo ruge advirtiendo a bárbaros y asesinos… un solo asesino oculto contaminaría la mirada de las Diosas y provocaría una plaga" and "terror neolítico."

**Sources say:** The proclamation excluding barbarians and those with blood-guilt is attested (Parke, Deubner). The specific plague-from-murderer's-gaze formulation and "neolithic terror" language are the app's invention.

**Fix:** Remove "terror neolítico" and the plague formulation. Replace with: the concept of miasma (ritual pollution) meant that impure participants could harm the rite and the community.

#### [INVENTED_AITION] [WRONG_RITUAL] Halade Mystai (Mysteries day 2) — Day 16

**App says:** "el pecado humano se transfería al cerdo, quien moría llevándose las culpas al inframundo."

**Sources say:** Parke explicitly states the pig was "the conventional victim offered to Demeter, perhaps as a natural emblem of fecundity" — the opposite of a pollution-bearer/scapegoat. The app inverts the ritual meaning of the pig. Deubner specifies the Kantharos harbour (Piraeus); the app says "a Falero" (Piraeus or Phaleron per Parke — Falero alone is slightly inaccurate).

**Fix:** Remove scapegoat/sin-transfer interpretation entirely — it directly contradicts Parke. Replace with: the pig was the traditional Demeter offering (fecundity). Change "a Falero" to "al Pireo (o Falero)."

#### [INVENTED_AITION] Great Procession (Mysteries day 5) — Day 19

**App says:** The gephyrismos (bridge insults) "imita a las ancianas que insultaron a Deméter."

**Sources say:** Parke makes no connection between the gephyrismos and old women insulting Demeter (that belongs to the Iambe/Baubo tradition in the Homeric Hymn, a different context). Parke explicitly says the purpose of the gephyrismos is unknowable. Additionally: the insulters wore covered heads to conceal their identity (the app says "lugareños" — locals); the anonymity is ritually significant.

**Fix:** Remove the old-women-Demeter connection. Replace with Parke's framing: men with covered heads hurled anonymous ribald insults at the Kephisos bridge — possibly apotropaic, possibly just traditional licence — its exact meaning unknown.

#### [MISSING_FESTIVAL] Night 19/20 — Torch-lit festival at Kallichoron (Eleusis)

Deubner explicitly lists: torch-lit dances and songs at the Kallichoron well at Eleusis; Iakchos received solemnly by the Epimeletes. No app entry. Parke implies the procession arrived at Eleusis after dark.

**Fix:** Add to the Day 19 entry or as a night 19/20 sub-entry: arrival at Eleusis, torch-lit dances at the Kallichoron well, solemn reception of Iakchos.

#### [MINOR] Eleusinian Mysteries Day 21 — Epopteia

Neither Parke nor Deubner assigns the Epopteia to a separate Day 21 — it is grouped with "days following 20." The day-by-day breakdown is the app's own construction, not a scholarly one.

#### [MINOR] Kykeon — Day 20

App describes "cebada y poleo"; Parke says water, flour (barley-meal), and pennyroyal. "Harina de cebada, agua y poleo" would match the Homeric Hymn's three-ingredient kykeon more precisely.

#### [MISSING_FESTIVAL] Demokratia — Day 12

Mikalson (p. 187) lists "Demokratia, Boedromion 12" as a positively dated festival day not in the app. Not discussed in the Parke/Deubner extracts used, but attested by Mikalson's Calendar II.

---

### Pyanepsion (monthIndex 3)

#### [WRONG_RITUAL] Pyanepsia + Oschophoria — Day 7

**App says:** "Carrera de jóvenes vestidos de mujer portando ramas de vid (Oschophoria)."

**Sources say:** The central ritual of the Oschophoria was a *procession* (pompe) of exactly two Oschoporoi (outstanding youths, not a general group), carrying grape-clusters to Phaleron — not a race. A subsidiary epheboi foot-race took place additionally (Deubner), but calling the main event a "carrera" conflates the two and errors the participant description.

**Fix:** Change to: "procesión solemne de dos jóvenes nobles (Oschophoroi) vestidos de mujer portando racimos de uva, desde un santuario de Dioniso hasta el templo de Atenea Skiras en Falero."

#### [WRONG_DEITY] Pyanepsia + Oschophoria — Day 7

**App says:** "Apolo / Dionisio y Atenea Skiras" (Dionysus listed before Athena Skiras).

**Sources say:** Parke establishes Athena Skiras as the *primary* deity of the Oschophoria (confirmed by an Agora inscription), with Dionysus secondary. The order as written implies Dionysus has the leading role.

**Fix:** Correct to "Apolo (Pyanepsia) / Atenea Skiras y Dioniso (Oschophoria)."

#### [INVENTED_AITION] Pyanepsia + Oschophoria — Day 7 (Eiresione)

**App says:** "Teseo inventó la rama decorada para agradecer a Apolo haberlos salvado."

**Sources say:** Parke says Theseus used suppliant boughs (*hiketeria*) already in existence on his voyage to Delos — not that he "invented" them to thank Apollo. Minor but the invention aspect is incorrect.

#### [MISSING_FESTIVAL] Stenia — Day 9

Both Parke and Deubner confirm a women's night festival (ritual abusive speech, aischrologia) two days before the Thesmophoria. Mikalson (p. 187) explicitly lists "Stenia, Pyanopsion 9" as an ATTESTED festival day with no Ekklesia meeting. The app has no entry for Day 9.

**Fix:** Add a Day 9 entry: deity Demeter y Perséfone; festival nocturno femenino con aischrología; los Prítanos sacrificaban a las diosas en nombre del Consejo y el Pueblo (Deubner).

#### [WRONG_DATE] [WRONG_DEITY] Apaturia — Days 19–21

**App says:** Days 19, 20, 21 assigned to Dorpia, Anarrhysis, and Koureotis respectively. Day 20 deity: "Dionisio Melanaigis."

**Sources say:** Both Parke and Deubner are explicit that the Apaturia had no fixed calendar date within Pyanepsion — different phratriai chose different days. Assigning specific day numbers is a scholarly fabrication. For day 20 (Anarrhysis), both Parke and Deubner confirm the sacrifice is to Zeus Phratrios and Athena Phratria — Dionysus Melanaigis was not the primary deity of the Anarrhysis. Mikalson does not fix specific days either.

**Fix:** Remove specific day numbers 19, 20, 21 or note as conventional approximations. Correct Anarrhysis deity to "Zeus Phratrios y Atenea Phratria." Add Athena Phratria to Koureotis alongside Zeus Phratrios. Add new brides (gamelia sacrifice) to Koureotis participants.

#### [INVENTED_AITION] Anarrhysis (Apaturia day 2)

**App says:** "Melanto ofreció un macho cabrío negro para agradecer a Dioniso."

**Sources say:** Neither Parke nor Deubner attributes a specific black-goat sacrifice by Melanthus to the Anarrhysis day. Parke mentions Dionysus Melainaigis as an epithet but does not connect a specific sacrifice on this day to it.

#### [MISSING_FESTIVAL] Chalkeia — Day 30

Both Parke and Deubner confirm the Chalkeia on the last day of Pyanepsion: festival of craftsmen, procession, night feast, and the start of weaving the Panathenaic peplos (Arrephoroi and priestess of Athena install the loom). Mikalson (p. 187) explicitly lists "Chalkeia, Pyanopsion 30" as ATTESTED. The app has no entry for Day 30.

**Fix:** Add a Day 30 entry: deity Atenea Ergane y Hefesto; procession of craftsmen with grain baskets; feast; on the Acropolis the Arrephoroi and priestess of Athena install the loom for the Panathenaic peplos (nine months before delivery at the Panathenaia).

---

### Maimakterion (monthIndex 4)

#### [WRONG_DATE] Maimakteria — Day 10

**App says:** Festival on day 10. Ram sacrifice. Wineless libations.

**Sources say:** Neither Parke nor Deubner gives any day for the Maimakteria. Mikalson (pp. 84–87) confirms: "No specific day-date attested." Day 10 is undocumented guesswork.

**Fix:** Remove day assignment. Note as "día desconocido, mes de Maimaktérion."

#### [WRONG_RITUAL] Maimakteria

**App says:** "Sacrificio solemne de un carnero" with wineless (nephálio) libations.

**Sources say:** Parke describes only prayers addressed to Zeus to moderate storm violence; no ritual details are preserved. Neither source records a ram sacrifice. The nephálio characterisation belongs to Demeter's rites, not this festival.

**Fix:** Remove ram sacrifice and nephálio claim. Replace with: prayers to Zeus Maimaktes to moderate winter storm violence; no ritual details preserved in any source.

#### [WRONG_RITUAL] Pompaia — Day 20 (fleece origin)

**App says:** The Dion Koidion (sacred fleece) came from the ram sacrificed at the Maimakteria.

**Sources say:** Deubner explicitly states the fleece came "from a Zeus Meilichios sacrifice" — a different sacrifice entirely. No source links the Maimakteria victim to the Pompaia fleece. The app invents this narrative bridge between the two festivals.

**Fix:** Change fleece origin: came from a sheep sacrificed to Zeus Meilichios.

#### [MINOR] Pompaia — Day 20 (missing details)

Parke specifically records: those being purified stood on the fleece with their *left foot* (a notable ritual detail). The caduceus/kērykeion is named by both Parke and Deubner as a key procession element. Deubner adds: purificatory material was cast at crossroads at the end. Parke is explicit that "the ordinary Athenian played no part" — priestly officials only; the app implies universal civic benefit.

---

### Poseideon (monthIndex 5)

#### [WRONG_DATE] Rural Dionysia (Dionisias Rurales) — Day 19

**App says:** Festival on day 19.

**Sources say:** Parke is explicit the festival "was not tied to a single date in the month." Deubner's "before 19th" refers to a deme-assembly at Myrrinus *about* the festival arrangements — the festival itself fell before the 19th, not on it. Mikalson (p. 187) confirms: "Rural Dionysia — various deme-specific days — UNCERTAIN (city)."

**Fix:** Remove fixed day 19. Note as "(sin fecha fija; segunda mitad del mes; cada demo en fecha propia)."

#### [INVENTED_AITION] Rural Dionysia

**App says:** "Los jóvenes saltan sobre un odre de vino engrasado como burla ritual hacia el chivo… venganza del viñador."

**Sources say:** Neither Parke nor Deubner gives any aition for the Rural Dionysia or for the askoliasmos game. Parke describes askoliasmos as a traditional game without any origin story.

**Fix:** Remove the aition entirely — no ancient source provides one.

#### [WRONG_DEITY] Haloa — Day 26

**App says:** Deity "Deméter y Dionisio" (co-equal).

**Sources say:** Parke explicitly calls Dionysus's role "probable" and "intrusive into what was originally a festival of corn." Deubner lists the primary deities as Demeter + Kore. Kore/Persephone is entirely omitted from the app. The correct pairing is Demeter (+ Kore) primary, Dionysus secondary/probable.

**Fix:** Change deity to "Deméter y Perséfone" (primary); note Dionysus as secondary.

#### [INVENTED_AITION] [WRONG_RITUAL] Haloa — Day 26

**App says:** Priestesses whispered to women to "busquen amantes" (seek lovers). Ritual carried "símbolos fálicos" (phallic symbols only).

**Sources say:** Parke states the content of the priestesses' whispering was "not recorded" by any ancient source. The app's specific content claim is an unsourced invention. Parke is explicit that women "carried models of male *and* female genital organs" — both types, not only phallic. Both sources also specifically list the forbidden foods (pomegranate, apple, eggs, domestic fowl, mullet, certain fish) — distinctive and documented details absent from the app.

**Fix:** Remove whispering content. Change "símbolos fálicos" to "símbolos de órganos masculinos y femeninos." Add the forbidden foods list.

#### [MISSING_FESTIVAL] Poseidea — Day 8

Both Parke (pp. 97–98) and Deubner attest a festival called Poseidea in Poseideon, tentatively on day 8 (Poseidon's monthly day). The ritual content is almost entirely unknown. Its absence is notable: no entry for Poseidon in the month named after him.

**Fix:** Add a minimal Day 8 entry: deity Poseidón; describe as "festival estatal escasamente documentado; ningún ritual conocido"; no aition should be invented.

---

### Gamelion (monthIndex 6)

#### [MINOR] Lenaia — Day 12

**App says:** "Famoso por sus competiciones de comedia."

**Sources say:** Both Parke and Deubner explicitly attest tragic AND comic competitions at equal weight. This is a material omission. The app also omits: exclusion of foreigners (even metoikoi — Parke: "a more native and intimate occasion"), the Daiduchos invocation formula, and the women's orgiastic rite (Lēnai before the columnar Dionysus mask). Mikalson places the Lenaia in the period Gamelion 12–19 (PROBABLE).

**Fix:** Change "competiciones de comedia" to "competiciones de comedia y tragedia." Note exclusion of foreigners and the women's rite.

#### [INVENTED_AITION] Lenaia — Day 12

**App says:** "la magia extática del vino y el teatro genera un calor divino capaz de derrotar al frío y resucitar las plantas."

**Sources say:** Neither Parke nor Deubner records any aition for the Lenaia.

**Fix:** Remove the aition entirely.

#### [WRONG_DATE] Theogamia / Gamelia / Hieros Gamos — Day 26

**App says:** Day 26 (following Parke).

**Sources say:** Deubner places it ca. day 24. Mikalson (1975) specifically corrects this: the Erkhia sacrificial calendar (IG II² 1358) designates Gamelion 27 with sacrifices to Kourotrophos, Hera, and Zeus Teleios — associated with the Theogamia by Salviat, accepted by Mikalson. Mikalson's verdict: "The Theogamia should be dated to Gamelion 27." This is the best-attested date and differs from the app by one day.

**Fix:** Change day to 27 (Mikalson, from Erkhia calendar). Add code comment noting Parke says 26, Deubner says ca. 24.

#### [INVENTED_AITION] Theogamia — Day 26/27

**App says:** "la chispa de fertilidad celestial caiga sobre los campos congelados del Ática y los prepare para la primavera."

**Sources say:** Parke is explicit that "no details of the festival are preserved." The only positively attested ritual element is a piglet sacrifice to Zeus Hēraios on the Acropolis (IG I² 840.20, Deubner). The fertility-sparks aition is modern romantic invention.

**Fix:** Remove the aition. Replace with the only attested fact: a piglet sacrificed to Zeus Hēraios on the Acropolis; no other ritual details preserved.

#### [MISSING_FESTIVAL] Kittoseies Dionysou — Day 19

Deubner attests ivy-crowning of Dionysus images on Gamelion 19 (private sacrifice calendar IG² 1367.21). Mikalson (p. 129) confirms this. The app has no entry. Attestation is thin (imperial-date inscription); addition is optional but the festival is real.

#### [MISSING_FESTIVAL] Goat sacrifice to Dionysos — last third of Gamelion

Deubner attests a select goat sacrifice (ἐρίφος κριτός) to Dionysus in the last third of Gamelion — confirmed epigraphically (IG I² 840.16) and iconographically (Hagios Eleutherios calendar frieze). Day not fixed. Optional addition.

---

### Anthesterion (monthIndex 7)

#### [INVENTED_AITION] Pithoigia — Day 11

**App says:** "Los atenienses rezan aterrados…Consideraban la fermentación un espíritu demoníaco."

**Sources say:** Both Parke (pp. 107–108) and Deubner describe the prayer for harmlessness as a standard precautionary libation, not an apotropaic rite against demonic spirits. The "terrified" framing and demonic-fermentation concept are the app's invention. Mikalson confirms Anthesterion 11 as ATTESTED.

**Fix:** Remove "aterrados" and demonic-fermentation framing. Replace with: a precautionary libation and prayer that the new wine be "inofensivo y beneficioso" — a standard ritual precaution.

#### [MISSING_DETAIL] Choes — Day 12

App correctly covers the drinking contest, Hieros Gamos, and Basilinna. Missing (attested by both sources): the ship-chariot procession of Dionysus; children in their third year crowned with flower-wreaths and given miniature choes (Deubner explicitly lists this as a component). Deubner also places the apotropaic ghost-customs (pitch on doors, chewing buckthorn) on Day 12, though Parke assigns them to Day 13 — both versions should be noted. Mikalson confirms Anthesterion 12 (Khoes) as ATTESTED.

#### [INVENTED_AITION] Chytroi — Day 13

**App says:** Erigone's suicide — "También recuerda el suicidio de la princesa Erígone."

**Sources say:** Neither Parke nor Deubner connects Erigone's death to the Chytroi. Parke is explicitly cautious about an Erigone connection to any part of the Anthesteria ("the identification is at least doubtful"). This is an invented aition.

**Fix:** Remove the Erigone reference entirely.

#### [MISSING_DETAIL] Chytroi — Day 13

The Hydrophoria (wheaten flour mixed with honey thrown into the Olympieion chasm, identified with Deucalion's Flood) is attested by both Parke and Deubner as a significant component of Day 13 — absent from the app.

**Fix:** Add: "La Hidroforia: el Estado vertía agua y mezcla de trigo y miel en la grieta del Olimpeion — la abertura por la que se tragó el agua del Gran Diluvio de Deucalión (Paus.; Apoll.)."

#### [INVENTED_AITION] Diasia — Day 23

**App says:** "El festival es una penitencia lúgubre por la infame masacre de Cilón, para limpiar a Atenas de aquella sangre derramada."

**Sources say:** Parke explicitly states the Diasia is "a very primitive institution" predating the Cylon affair. Thucydides (1.126) mentions the Diasia only to identify which festival the oracle referred to — not to say it was founded as Cylonian penance. Neither Parke nor Deubner gives any aition for the Diasia. Mikalson confirms Anthesterion 23 as ATTESTED.

**Fix:** Remove the Cylon penance aition entirely. Replace with: "Tucídides (1.126) lo llama el mayor festival de Zeus Meilichios. Sus orígenes son anteriores a la historia escrita: una ofrenda antiquísima de propiciación sin aition mítico preservado."

#### [WRONG_DEITY] (deityDesc) Diasia — Day 23

**App says:** deityDesc "Zeus 'el Apacible' (subterráneo)."

**Sources say:** Meilichios derives from μείλιχος ("honey-sweet/gentle/open to appease") — not "subterráneo." While Zeus Meilichios has chthonic associations, "subterráneo" is not a translation of the epithet. Parke glosses it as "kindly or open to propitiation."

**Fix:** Change deityDesc to "Zeus 'el Apacible' o 'el que se deja propiciar' (de μείλιχος); culto con rasgos ctónicos."

#### [MISSING_DETAIL] Diasia — Day 23

Both sources note: the Diasia was held *outside the city* near the Ilissos (Thucydides 1.126; Parke). The app omits the location. Parke and Deubner also note children received gifts (toy carts — Deubner) on this day alongside the gloomy sacrifices. Both missing.

#### [MISSING_FESTIVAL] Lesser Mysteries at Agrai — Month of Anthesterion

Both Parke (pp. 122–124) and Deubner attest the Kleine Mysterien (obligatory Eleusinian preliminary) held in Anthesterion at Agrai on the Ilissos — purification bath, Daiduchos officiating, pantomimic Dionysiac performances. Mikalson places them in Anthesterion 20–26 (UNCERTAIN — cannot be narrowed further). The app has no entry.

**Fix:** Add an entry for Anthesterion (no specific day): deity Demeter y Perséfone; preliminary initiation required before the Eleusinian Mysteries; purification bath in the Ilissos at Agrai; Daiduchos officiates.

---

### Elaphebolion (monthIndex 8)

#### [INVENTED_AITION] Elaphebolia — Day 6

**App says:** "Artemisa exigía piezas reales, pero los atenienses las extinguieron cazando. El mito asegura que la diosa aceptó piadosamente estos sustitutos mágicos."

**Sources say:** Neither Parke nor Deubner records this story. Parke explicitly notes no aition for the substitution; Deubner likewise. The comparison Parke makes is economic (practical substitution, as with cake animals at the Diasia), not mythological.

**Fix:** Remove the aition entirely. Replace with a factual note: by the fourth century, deer had become practically unobtainable; pastry substitutes (dough, honey, sesame shaped like deer) replaced the animal in the same way poor families used cake animals at other festivals.

#### [INVENTED_AITION] [WRONG_DEITY desc] Asclepieia — Day 8

**App says:** "Conmemora la llegada del dios a Atenas." Aition: Asclepius arrived late to the Mysteries; the Athenians repeated the rites for him alone; latecomers could then complete purifications on this day.

**Sources say:** "La llegada del dios a Atenas" refers to the Epidauria in Boedromion (month 3, day 18), when Asclepius was formally introduced to Athens in 420/19 BCE. The Elaphebolion Asclepieia is simply his local Athenian festival beside the Dionysiac theater — Parke says "almost nothing is known." The Mysteries-latecomer aition is misassigned: it belongs to Boedromion day 18, not here. Mikalson confirms Proagon + sacrifice to Asklepios on Elaphebolion 8 as ATTESTED.

**Fix:** Change festivalDesc: "Sacrificio y probable banquete sagrado en el santuario de Asclepio, adyacente al teatro de Dioniso. Parke speculates Sófocles may have arranged the site." Remove the aition about the Mysteries entirely.

#### [INVENTED_AITION] Proagon — Day 9

**App says:** "el Proagon demostraba que debajo de la magia divina seguían siendo ciudadanos mortales."

**Sources say:** Parke gives only a practical explanation: there were no playbills or programmes, so the audience needed advance notice of what they would see. Neither Parke nor Deubner offers any theological reading.

**Fix:** Replace with: "El Proagon era la única forma de publicidad disponible: sin carteles ni programas, el público necesitaba saber de antemano qué obras y autores competirían (Parke)."

#### [MISSING_FESTIVAL] Eisagoge — Evening of Day 8

Both Parke and Deubner confirm: Epheboi escorted the xoanon (old wooden statue) of Dionysus Eleuthereus by torchlight from the chapel near the Academy to the theater precinct, re-enacting the cult's transfer from Eleutherai. A general banquet preceded. Deubner explicitly names the evening of Day 8. The app has no entry, leaving the City Dionysia sequence without its opening rite.

**Fix:** Add a Day 8 evening entry: festivalName "Eisagoge"; deity Dionisio Eleuthereus; procesión nocturna de los efebos con antorchas; xoanon escorted to theater precinct; preceded by a general banquet. No aition needed — the Eleutherai transfer myth is the aition for the City Dionysia as a whole.

#### [WRONG_DATE] Pandia — Day 14

**App says:** Day 14.

**Sources say:** Mikalson (pp. 164, 188) assigns the Pandia to Elaphebolion 17 (PROBABLE), deduced from Photios' statement that it followed immediately after the City Dionysia, which ran through day 16. Neither Parke nor Deubner gives day 14. The app is 3 days early.

**Fix:** Change day to 17 per Mikalson. Mark as approximate ("ca. día 17, tras las Dionisias").

#### [INVENTED_AITION] Pandia — Day 14

**App says:** "Atenas debía recordar la estricta moralidad y el dolor del mundo real tras días de locura báquica."

**Sources say:** Both sources agree essentially nothing is known about the Pandia's content or meaning. Parke explicitly says the myth "has vanished." The "psychological brake" reading is the app's own fiction.

**Fix:** Remove the aition entirely.

#### [MINOR] City Dionysia — Days 10–13

**App says:** "falos gigantes montados en carros."

**Sources say:** Phallus-carts are a feature of the Rural Dionysia (Aristophanes' *Acharnians*). At the City Dionysia, Parke says phalli were "carried in procession" — not mounted on carts. The Komos (nocturnal revel) is a named rite in both sources not explicitly named in the app. Mikalson confirms first day of City Dionysia as Elaphebolion 10 (PROBABLE).

**Fix:** Remove "montados en carros." Add a named reference to the Komos.

#### [MISSING_FESTIVAL] Galaxia — Elaphebolion (day unknown, low priority)

Deubner attests a festival of Meter Theon (Mother of the Gods) in Elaphebolion, inferred from the Delian calendar parallel (Galaxion = Elaphebolion). Barley-and-milk porridge (galaxia) offering; epheboi sacrificed and dedicated a phiale. Athenian attribution is inferred, not certain. Optional addition.

---

### Munichion (monthIndex 9)

#### [MISSING_FESTIVAL] Feast of Eros — Day 4

Both Parke and Deubner confirm a named festival for Eros on day 4 of Munichion, attested by a mid-fifth-century rock inscription in the Aphrodite sanctuary on the north slope of the Acropolis. No ritual details preserved. Mikalson (p. 189) confirms Mounichion 4 as ATTESTED. The app has no entry.

**Fix:** Add a Day 4 entry: deity Eros / Afrodita; festival at the sanctuary on the north slope of the Acropolis, attested by rock inscription of the fifth century; no ritual details preserved; do not invent a ritual.

#### [MINOR] Delphinia — Day 6

The aition (Theseus's suppliant bough before sailing to Crete) is attested in both sources, but Parke explicitly labels it "a secondary rationalisation" that has "nothing whatever to do with" the original ceremony (a communal women's supplication to Artemis as protectress of women). The app presents the aition uncritically. Mikalson (p. 191) confirms Delphinia Mounichion 6 as ATTESTED and specifies Artemis (not Apollo) as the primary deity — confirming the app's deity order over Deubner's.

**Fix:** Add a hedging note that the Theseus connection is a secondary aetiological rationalisation.

#### [WRONG_DEITY] [WRONG_RITUAL] Munichia — Day 16

**App says:** festivalName "Munichia y Brauronia." Description includes "Las niñas de Atenas actúan como osas en el santuario." Aition includes "el mito de las niñas 'osa' que apaciguaban a Artemisa."

**Sources say:** The Brauronia is a entirely separate festival at Brauron — neither Parke nor Deubner places it on Munichion Day 16. "Las niñas actúan como osas" belongs to the Arkteia/Brauronia at Brauron, not to the Munichia. Both Parke and Deubner treat these as distinct. Mikalson confirms Mounichia Mounichion 16 as ATTESTED (no Brauronia connection).

**Fix:** Rename to "Munichia" only. Remove all "bears/osas" content from festivalDesc and aition. Keep the Embaros aition (attested by Parke). Add Epheboi regatta around the Munichia promontory (both sources). Brauronia should be a separate, unplaced penteteris entry if it appears at all.

#### [INVENTED_AITION] Olympieia — Day 19

**App says:** "La leyenda del festival se tiñó de tragedia cuando, en pleno desfile militar, el amado general Foción fue obligado a suicidarse."

**Sources say:** The Phocion anecdote (Plutarch, cited by Parke p. 144) is a historical incident that coincided with the festival in 318 BC — not a founding aition or "festival legend." Parke uses it only to convey the atmosphere of the procession. The actual founding tradition (Peisistratos, laying foundations of the great Ionic temple) is absent.

**Fix:** Replace aition with: the festival was probably instituted by Peisistratos when laying foundations of the great Ionic temple of Zeus near the Ilissos (completed under Hadrian). The Phocion anecdote (318 BC) may be kept as a historical note, clearly distinguished from the founding tradition.

---

### Thargelion (monthIndex 10)

#### [WRONG_RITUAL] Thargelia Day 1 — Day 6

**App says:** `isApaphrades: true`. Beating implements described as "cebollas silvestres" (squill) only.

**Sources say:** Day 6 is not a dies nefastus in either Parke or Deubner. Only the Plynteria (day 25) carries that status in Thargelion. The `isApaphrades` flag incorrectly renders Day 6 as taboo in the UI. Both Parke and Deubner specify fig-branches *and* squill as the beating implements — the fig-branch is the better-attested element (Hipponax) and is missing from the app. Mikalson assigns the Thargelia to Day 7 (ATTESTED via Plutarch Mor. 717D) and places Day 6 as the purification day (PROBABLE association only).

**Fix:** Remove `isApaphrades: true` from Day 6. Add fig-branches: "golpeados con ramas de higuera y cebollas silvestres (escila)."

#### [INVENTED_AITION] Thargelia Day 1 — Day 6

**App says:** "la cebolla actuaba como desinfectante mágico, absorbiendo la plaga de toda la ciudad."

**Sources say:** Neither source frames the instruments as magical disinfectants. Parke's explanation is the Iliadic pattern (purification day, then offering day). The two classes of pharmakoi (one for men/one for women) and their distinguishing fig-necklaces (black vs. white) are also absent.

**Fix:** Remove the "magical disinfectant" aition. Replace with the Iliadic pattern and add the two-pharmakos / fig-necklace detail.

#### [MINOR] Thargelia Day 2 — Day 7

festivalDesc says "coros masculinos" but the competition included men's AND boys' choirs (the agonDesc correctly states "50 hombres y 50 niños" — the festivalDesc contradicts it). Missing: the Phratria custom (fathers presenting sons at the Phratria altar, attested by Plato and Isaeus, cited by Parke); the thargelos loaf (in addition to the pot — Deubner).

#### [INVENTED_AITION] Bendideia — Day 19

**App says:** "Atenas permitía esta carrera nocturna a caballo para agradar a los reyes tracios y asegurar la importación de trigo desde el Mar Negro."

**Sources say:** Neither Parke nor Deubner mentions grain imports. Parke's account is political (Sitalces as ally, Thracian metoikoi community) and religious (oracle of Dodona, not Delphi). The oracle of Dodona (not Delphi) as the authorising oracle is a notable detail entirely absent from the app. Mikalson confirms Bendideia Thargelion 19 as ATTESTED.

**Fix:** Remove the grain-import aition. Add: the cult was founded in 429 BCE after the oracle of Dodona (specifically not Delphi) approved; Thracian metoikoi in the Piraeus received rights to acquire land and found the sanctuary. Add: the dual procession structure (one Athenian from the Prytaneion, one Thracian simultaneously) — distinctive and attested by both sources.

#### [MINOR] Plynteria — Day 25

The scope of the rope closure is understated: the app says "el templo cerrado con cuerdas" but both sources specify ALL sanctuaries in Athens were roped off, not only Athena's temple. Missing: the two *Loutrides* (Plyntrides) who performed the actual washing; the *peplotheke* who washed the peplos; the image was wrapped and veiled for transport (not visible to the public). Mikalson confirms Plynteria Thargelion 25 as ATTESTED.

#### [MISSING_FESTIVAL] Kallynteria — ca. Day 22–24

Both Parke and Deubner attest the Kallynteria (annual clean-up of the Erechtheion by priestesses; probably also the annual refilling of Callimachus' eternal golden lamp) in Thargelion, just before the Plynteria. Mikalson (p. 215) places it in any day in Thargelion 24–28 excluding day 25 — UNCERTAIN. The app has no entry.

**Fix:** Add a floating entry (e.g. day 22–23, flagged as approximate): deity Atenea Polias; barrido y limpieza solemne del Erecteion por las sacerdotisas; probable recarga de la lámpara de oro de Calímaco; fecha exacta incierta.

---

### Skiraphorion (monthIndex 11)

#### [WRONG_DATE] [INVENTED_AITION] Arrephoria — Day 3

**App says:** Day 3. Aition: daughters of Kekrops opened the basket and saw infant Erichthonius; threw themselves from the Acropolis.

**Sources say:** No ancient source fixes the Arrephoria to day 3. Mikalson (p. 228) says: "The evidence does suggest strongly that the state Arrephoria are to be dated to Skirophorion 3, but it is not conclusive" (PROBABLE). The aition conflates two distinct myths: the daughters of Kekrops opening Athena's basket (Pausanias 1.18.2; Apollodorus 3.14.6) with the Arrephoria girls, who carry objects they are explicitly forbidden to examine. Pausanias's Arrephoria account (1.27.3) says only that the girls carried down "what the priestess of Athena gives them without knowing what it is" — nothing about opening a box or jumping from the Acropolis.

**Fix:** Day 3 can remain but should be marked as "probable, not confirmed." Rewrite the aition: remove the box-opening and cliff-jumping narrative. Replace with: "Pausanias (1.27.3) records only that the Arrephoren carried covered objects without knowing what they contained, then brought back other covered objects equally unseen. La conexión mítica con las hijas de Cécrope es un glose aetiológico de fuentes tardías; el significado del rito es desconocido."

#### [WRONG_DATE] [WRONG_DEITY] [INVENTED_AITION] Diisoteria y Carrera de Pan — Day 30

**App says:** Day 30. Deity "Zeus Soter y Pan." Description: "Gran festival de cierre de año con una espectacular carrera de antorchas nocturna para el dios Pan."

**Sources say:** The year-end event on day 30 is the modest *Eisiteria* / year-end sacrifice to Zeus Soter alone — a small institutional sacrifice at the Agora's Stoa of Zeus by the King Archon and outgoing council (Parke, Deubner, confirmed by Mikalson who attests 10 instances of Ekklesia meetings on Skirophorion 30; Lysias 26.6 attests Zeus Soter sacrifice on the last day). The large Piraeus Diisoteria (with bull sacrifices and ephebe regatta) falls before day 20 per Deubner, or "towards end of month" per Parke — explicitly a Piraeus festival, not an Agora one. Pan has no attested connection to day 30 or to Zeus Soter. Parke tentatively places the Pan torch-race in Boedromion (9th of month), not Skiraphorion at all.

**Fix:** Change Day 30 entry: deity Zeus Soter alone; description = modest official year-end sacrifice at the Agora Stoa of Zeus by the King Archon and outgoing council; participants = city magistrates and council (not general public); no aition given (Lysias 382 BCE is earliest reference). Move the Piraeus Diisoteria to an earlier slot (Deubner: before day 20; a placeholder day 16–17 is defensible). Remove Pan and the torch-race from Skiraphorion entirely.

#### [OK] Dipolieia (Bouphonia) — Day 14

Day 14 and deity Zeus Polieus are correct per both sources and Mikalson (ATTESTED by two ancient sources). The Sopatros/Porphyry aition is correctly sourced. The "hacha" detail follows Pausanias's version consistently.

---

## 4. Confirmed Mikalson cross-checks

Mikalson (1975) provides independently attested dates that resolve or sharpen conflicts in the app. The following are cases where Mikalson's evidence directly affects the app:

| Festival | App day | Mikalson day | Mikalson confidence | Action |
|---|---|---|---|---|
| Gamelion Theogamia | 26 | 27 | ATTESTED (Erkhia calendar) | Change to 27 |
| Elaphebolion Pandia | 14 | 17 | PROBABLE | Change to 17 |
| Elaphebolion City Dionysia span | 10–13 | 10–16 (Pandia on 17) | PROBABLE | Extend awareness of span |
| Pyanopsion Stenia | absent | 9 | ATTESTED (Calendar II) | Add entry |
| Pyanopsion Chalkeia | absent | 30 | ATTESTED (Calendar II) | Add entry |
| Pyanopsion Theseia | 8 | 8 | ATTESTED | Confirmed correct |
| Boedromion Demokratia | absent | 12 | ATTESTED | Consider adding |
| Mounichion Feast of Eros | absent | 4 | ATTESTED (inscription) | Add entry |
| Mounichion Delphinia | 6 | 6 | ATTESTED (Artemis, not Apollo) | Deity order confirmed |
| Mounichion Olympieia | 19 | 19 | ATTESTED | Confirmed correct |
| Thargelion Bendideia | 19 | 19 | ATTESTED | Confirmed correct |
| Thargelion Plynteria | 25 | 25 | ATTESTED | Confirmed correct |
| Thargelion Thargelia | 7 | 7 | ATTESTED | Confirmed correct |
| Skiraphorion Dipolieia | 14 | 14 | ATTESTED (two ancient sources) | Confirmed correct |
| Skiraphorion Arrephoria | 3 | 3 | PROBABLE (not conclusive) | Flag as probable |
| Anthesterion 11–13 | 11–13 | 11–13 | ATTESTED | Confirmed correct |
| Anthesterion Diasia | 23 | 23 | ATTESTED | Confirmed correct |
| Gamelion Lenaia | 12 | period 12–19 | PROBABLE | Day 12 not conclusive |
| Metageitnia | 7 | unknown | UNCERTAIN | Remove fixed day |
| Maimakteria | 10 | unknown | UNCERTAIN | Remove fixed day |
| Rural Dionysia | 19 | various (deme-specific) | UNCERTAIN | Remove fixed day |

**Mikalson's "10 key findings" cross-check (from extract):**

1. Gamelion 27 = Theogamia: app has 26 — **change to 27**
2. Elaphebolion 10 = City Dionysia day 1: app has "10–13" block — Elaphebolion 10 confirmed as first day (Ferguson's dating accepted by Mikalson)
3. Thargelion 19 = Bendideia: confirmed; app is correct
4. Thargelion 25 = Plynteria: confirmed; app is correct
5. Mounichion 6 = Delphinia (Artemis, not Apollo): app has "Artemisa / Apolo" — deity order confirmed correct per Mikalson
6. Skirophorion 3 = Arrephoria: probable but not conclusive — app's day 3 is defensible, but should be marked as probable
7. Skirophorion 14 = Dipolieia: confirmed; app is correct
8. Lenaia period Gamelion 12–19: no single day established — Mikalson is more cautious than Deubner; avoid claiming day 12 as the firm date
9. Anthesterion 11–13 = Anthesteria (three days): confirmed
10. Boedromion 15–17 + 19–22 = Eleusinian Mysteries: seven total festival days confirmed; app's structure follows this correctly

---

## 5. Specific code changes required

The following are firmly attested by 2+ sources and require direct code changes in `utils/atticCalendarData.ts`. INVENTED_AITION findings are flagged but excluded from this list (the `aition` field is flavor text; the fix is optional/editorial). Each change is given as: monthIndex, dayOfMonth, field, current value → correct value.

---

### WRONG_DATE fixes

**Gamelion Theogamia** (Mikalson ATTESTED; overrides Parke's 26)
- `monthIndex 6, dayOfMonth 26` → move entry to `dayOfMonth 27`
- Add code comment: `// Parke: day 26; Deubner: ca. day 24; Mikalson (Erkhia calendar IG II² 1358): day 27 — use 27`

**Elaphebolion Pandia** (Mikalson PROBABLE, Photios confirmation)
- `monthIndex 8, dayOfMonth 14` → move entry to `dayOfMonth 17`
- Add code comment: `// Neither source gives day 14; Mikalson deduces day 17 from Photios + City Dionysia ending on day 16`

**Pyanepsion Anarrhysis** (both Parke and Deubner: no fixed day within Pyanepsion)
- Remove specific day assignment for Apaturia (days 19, 20, 21) or add a comment that these are conventional approximations with no ancient attestation of the specific days.

**Maimakterion Maimakteria** (both Parke and Deubner: no day given)
- `monthIndex 4, dayOfMonth 10` — either remove this entry's day or note as "día desconocido"

**Poseideon Rural Dionysia** (Parke: no fixed day; Mikalson: uncertain)
- `monthIndex 5, dayOfMonth 19` — remove fixed day or note as approximate/deme-specific

**Metageitnion Metageitnia** (Mikalson: uncertain; both Parke and Deubner: no day)
- `monthIndex 1, dayOfMonth 7` — remove fixed day

---

### WRONG_DEITY fixes

**Hekatombaion Synoikia** (both Parke and Deubner: Zeus Phratrios present)
- `monthIndex 0, dayOfMonth 16` — change field `deity` from `"Atenea"` to `"Atenea y Zeus Phratrios"` (also note: Eirene cult added 374 BC)

**Pyanepsion Oschophoria deity order** (Parke + Agora inscription: Athena Skiras primary)
- `monthIndex 3, dayOfMonth 7` — change field `deity` from the current order listing Dionysus before Athena Skiras to `"Apolo (Pyanepsia) / Atenea Skiras y Dioniso (Oschophoria)"`

**Pyanepsion Anarrhysis deity** (both Parke and Deubner: Zeus Phratrios + Athena Phratria)
- The Anarrhysis day entry — change field `deity` from `"Dionisio Melanaigis"` to `"Zeus Phratrios y Atenea Phratria"`

**Poseideon Haloa** (Parke + Deubner: Demeter + Kore; Dionysus secondary/probable)
- `monthIndex 5, dayOfMonth 26` — change field `deity` from `"Deméter y Dionisio"` to `"Deméter y Perséfone"` (note Dionysus as secondary)

**Boedromion Genesia** (Deubner: Ge also receives sacrifice)
- `monthIndex 2, dayOfMonth 5` — change field `deity` from `"Los Muertos"` to `"Los Muertos / Ge (Tierra)"`

**Anthesterion Diasia deityDesc** (both Parke and Deubner: Meilichios = honey-sweet, not underground)
- `monthIndex 7, dayOfMonth 23` — change field `deityDesc` from containing `"subterráneo"` to `"Zeus 'el Apacible' o 'el que se deja propiciar' (de μείλιχος); culto con rasgos ctónicos"`

**Munichion Munichia festival name and content** (both Parke and Deubner: Brauronia is a separate festival)
- `monthIndex 9, dayOfMonth 16` — change field `festivalName` from `"Munichia y Brauronia"` to `"Munichia"`
- Remove all content about girls acting as bears from `festivalDesc` and `aition`

**Skiraphorion Diisoteria deity** (all three sources: Zeus Soter alone on day 30)
- `monthIndex 11, dayOfMonth 30` — change field `deity` from `"Zeus Soter y Pan"` to `"Zeus Soter"`

---

### WRONG_RITUAL fixes

**Hekatombaion Kronia** (both Parke and Deubner: masters and slaves dined together, not masters serving)
- `monthIndex 0, dayOfMonth 12` — change phrase "Los amos servían la cena a los esclavos" to "Los esclavos cenaban junto a sus amos"

**Pyanepsion Oschophoria ritual description** (both Parke and Deubner: procession, not race)
- `monthIndex 3, dayOfMonth 7` — change "Carrera de jóvenes vestidos de mujer" to "Procesión de dos jóvenes nobles vestidos de mujer (Oschophoroi)"

**Boedromion Halade Mystai — pig's ritual role** (Parke directly contradicts the scapegoat reading)
- `monthIndex 2, dayOfMonth 16` — remove the scapegoat/sin-transfer interpretation from `aition`. The pig was a Demeter fecundity offering, not a pollution-bearer.

**Poseideon Haloa — genital symbols** (Parke: both male and female)
- `monthIndex 5, dayOfMonth 26` — change "símbolos fálicos" to "símbolos de órganos masculinos y femeninos"

**Thargelion Thargelia I — `isApaphrades` flag** (neither Parke nor Deubner: day 6 is not apaphrades)
- `monthIndex 10, dayOfMonth 6` — change field `isApaphrades` from `true` to `false`

**Thargelion Thargelia I — beating implements** (both Parke and Deubner: fig-branches AND squill)
- `monthIndex 10, dayOfMonth 6` — add "ramas de higuera" to the description of the pharmakoi beating alongside squill

**Maimakterion Pompaia — fleece origin** (Deubner: from a Zeus Meilichios sacrifice, not the Maimakteria ram)
- `monthIndex 4, dayOfMonth 20` — remove the claim that the fleece came from the Maimakteria ram; replace with "fleece from a sheep sacrificed to Zeus Meilichios"

**Metageitnion Herakleia en Kynosarges — festival character** (both Parke and Deubner: feast, not athletics)
- `monthIndex 1, dayOfMonth 15` — change "Festival atlético" to "Festival de sacrificio y banquete"; remove agonDesc about athletic competitions; correct "metecos" to "nothoi"

---

### MISSING_FESTIVAL entries requiring new code entries

Each item below requires a new `if (dayOfMonth === X) return { ... }` block or equivalent in `getAtticFestivalInfo`:

| monthIndex | dayOfMonth | festivalName | deity | Source attestation |
|---|---|---|---|---|
| 2 (Boedromion) | 13 | Procesión de las Hieras | Deméter y Perséfone | Parke + Deubner |
| 2 (Boedromion) | 14 | Depósito de las Hieras | Deméter y Perséfone | Parke + Deubner |
| 3 (Pyanepsion) | 9 | Stenia | Deméter y Perséfone | Parke + Deubner + Mikalson (ATTESTED) |
| 3 (Pyanepsion) | 30 | Chalkeia | Atenea Ergane y Hefesto | Parke + Deubner + Mikalson (ATTESTED) |
| 5 (Poseideon) | 8 | Posidea | Poseidón | Parke + Deubner (day tentative) |
| 8 (Elaphebolion) | 8 (eve) | Eisagoge | Dionisio Eleuthereus | Parke + Deubner |
| 9 (Munichion) | 4 | Fiesta de Eros | Eros / Afrodita | Parke + Deubner + Mikalson (ATTESTED) |
| 10 (Thargelion) | ~22 | Kallynteria | Atenea Polias | Parke + Deubner + Mikalson (UNCERTAIN day) |

Additional entries attested by one source or with uncertain day (add with appropriate caveats if the data model supports approximate entries):
- Boedromion, Night 19/20: torch-lit festival at the Kallichoron well at Eleusis (Deubner)
- Anthesterion, ~day 20–26: Lesser Mysteries at Agrai (both Parke and Deubner; Mikalson: UNCERTAIN within this range)
- Gamelion, day 19: Kittoseies Dionysou (Deubner; thin imperial-date attestation)
- Boedromion, day 12: Demokratia (Mikalson; not in Parke/Deubner extracts)

---

*End of review — 2026-10-25*

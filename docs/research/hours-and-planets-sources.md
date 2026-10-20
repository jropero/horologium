# Hours, Watches and Planets — Source Research

Research notes from the Oct 2026 rework of the hour panels (`PlanetaryPositions`,
`EgyptianHours`, `BabylonianSkyDiary`). The goal is to save the next round of work
from searching again, and to keep a record of what is **verified** and what is not.

Rules this file follows (same as the project's Babylonian gloss rule):

- Ancient-language text is marked **verbatim** only if it was fetched from an online
  edition or read off a page scan. Everything else is marked as a summary or a translation.
- Spanish renderings are ours unless stated otherwise.
- ⚠ marks an uncertainty or a gap. Check it before building on it.

---

## 1. The big picture: who had planetary hours?

| Culture | Planetary week / hours | What they had instead |
|---|---|---|
| Rome | **Yes** (from the late 1st c. BCE) | also the 8-day nundinal cycle, civic hour customs, 4 military watches |
| Hellenistic Greece | **Yes** (astrologers: Valens, Paulus) | Classical Athens had neither |
| Pharaonic Egypt | **No** (Greco-Roman Egypt only) | 10-day decades; 12 + 12 hours, each with an hour goddess |
| Babylon | **No** | 12 bēru (double hours), UŠ time-degrees, 3 + 3 watches |
| Tang China | **Imported**: 七曜 via the 宿曜经 (759) | 12 shichen (時辰) |

Key sources for this table:

- **Sachs & Hunger, *Astronomical Diaries and Related Texts from Babylonia* I (Vienna 1988)**, intro p. 13: "The Babylonian calendar uses days, months, and years. No weeks or units longer than a year are attested." Copy: https://www.caeno.org/pdf/F011A_Diary%20Intro%20All.pdf
- **I. Bultrighini & S. Stern, "The seven-day week in the Roman Empire: origins, standardization, and diffusion"**, in S. Stern (ed.), *Calendars in the Making* (Brill 2021), pp. 10–79. They say: "there is no evidence of a planetary week in ancient Egypt, Mesopotamia, the Hellenistic world, or anywhere further east, before the second century CE". The week first appears in Rome and central Italy in the late 1st c. BCE. Copy: https://discovery.ucl.ac.uk/id/eprint/10126925/ · blog summary: https://blogs.fu-berlin.de/zodiacblog/?p=148
  - ⚠ So "Hellenistic invention" is outdated wording. Say **"Greco-Roman, not Babylonian/Egyptian"**.
- **Chaldean order**: credited to Diogenes of Babylon, a 2nd c. BCE Stoic (Cicero, *De divinatione* 2.91).
- **Inscriptions**: the Potentia inscription (CIL IX 5808) shows the planetary sequence early.
- **Cassius Dio 37.18–19** calls the custom "Egyptian". This means Greco-Roman Alexandria at most, and he admits it was recent. Greek text (Perseus, Boissevain): https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:2008.01.0593:book=37:chapter=18 · English (Cary): https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cassius_Dio/37*.html
  - 37.18.1 (verbatim): τὸ δὲ δὴ ἐς τοὺς ἀστέρας τοὺς ἑπτὰ τοὺς πλάνητας ὠνομασμένους τὰς ἡμέρας ἀνακεῖσθαι κατέστη μὲν ὑπ' Αἰγυπτίων, πάρεστι δὲ καὶ ἐπὶ πάντας ἀνθρώπους
  - 37.19.1–2 (verbatim): τὰς ὥρας τῆς ἡμέρας καὶ τῆς νυκτὸς ἀπὸ τῆς πρώτης ἀρξάμενος ἀριθμεῖν, καὶ ἐκείνην μὲν τῷ Κρόνῳ διδούς, τὴν δὲ ἔπειτα τῷ Διί, καὶ τρίτην Ἄρει, τετάρτην ἡλίῳ, πέμπτην Ἀφροδίτῃ, ἕκτην Ἑρμῇ, καὶ ἑβδόμην σελήνῃ, κατὰ τὴν τάξιν τῶν κύκλων καθ' ἣν οἱ Αἰγύπτιοι αὐτὴν νομίζουσι, … εὑρήσεις τὴν πρώτην τῆς ἐπιούσης ἡμέρας ὥραν ἐς τὸν ἥλιον ἀφικνουμένην.
    - The "…" stands for καὶ τοῦτο καὶ αὖθις ποιήσας, πάσας τε οὕτω τὰς τέσσαρας καὶ εἴκοσιν ὥρας περιελθών.
    - 37.18.3–4 gives the second explanation, the musical tetrachord (διὰ τεσσάρων).

---

## 2. Rome

### 2.1 Chronograph of 354 (Calendar of Filocalus): planetary hours  *(used in `utils/romanHoursData.ts`)*

Text: https://www.tertullian.org/fathers/chronography_of_354_04_planets_and_days.htm (reproduces Mommsen, MGH Chronica Minora I pp. 42–45, with Strzygowski's figures 10–14).

**Ratings.** Each planet page has a table of the 12 night hours ("Noct") and the 12 day hours ("Diur"). Every hour shows its ruler and a letter: **B** = bona, **C** = communis, **N** = noxia. The rating depends only on the planet:
- Saturn, Mars → N
- Sol, Luna, Mercury → C
- Jupiter, Venus → B

⚠ Table quirks:
- The night column is the night *before* the day: under Saturn's day, night I = Mars. The hour rulers are the same as in the app's sunrise-start count; only the grouping into "days" differs.
- The Mercury table has a likely transcription slip ("III Mar. C", "IIII Sol. N").
- Only five pictures survive. For Jupiter and Venus only the text survives.

**Captions (verbatim):**
- **Saturni dies N.** Saturni dies horaque eius cum erit nocturna sive diurna, omnia obscura laboriosaque fiunt; qui nascentur periculosi erunt; qui recesserit non invenietur; qui decubuerit periclitabitur; furtum factum non invenietur.
- **Martis dies N.** Martis dies horaque eius cum erit nocturna sive diurna, nomen militiae dare, arma militaria comparare utile est. qui nascentur periculosi erunt; qui recesserit non invenietur; qui decubuerit periclitabitur; furtum factum non invenietur.
- **Mercuri dies C.** Mercuri dies horaque eius cum erit nocturna sive diurna, vilicum actorem institorem in negotio ponere utile est. qui nascentur vitales erunt; qui recesserit invenietur; qui decubuerit cito convalescet; furtum factum invenietur.
- **Lunae dies C.** Lunae dies horaque eius cum erit nocturna sive diurna, stercus in agro mittere, putea cisternas fabricare utile est. qui nascentur vitales erunt; qui recesserit invenietur; qui decubuerit convalescet; furtum factum invenietur.
- **Solis dies C.** Solis dies horaque eius cum erit nocturna sive diurna, viam navigium ingredi, navem in aquam deducere utile est. qui nascentur vitales erunt; qui recesserit invenietur; qui decubuerit convalescet; furtum factum invenietur.
- **Iovis dies B.** Iovis dies horaque eius cum erit nocturna sive diurna, beneficium petere, cum potente colloqui, rationem reddere utile est. qui nascentur vitales erunt; qui recesserit cito invenietur; qui decubuerit convalescet; furtum factum invenietur.
- **Veneris dies B.** Veneris dies horaque eius cum erit nocturna sive diurna, sponsalia facere, pueros puellas in disciplina mittere utile est. qui nascentur vitales erunt; qui recesserit cito invenietur; qui decubuerit convalescet; furtum factum invenietur.

Since the omens update, the second half of each caption (births, a runaway, the sick, theft) is shown verbatim as well (`omens` in `CHRONOGRAPH_HOURS`). "qui recesserit" = a runaway or fugitive, not "those who hide". "periculosi" = "at risk". The tertullian.org English is loose.

### 2.2 Martial, *Epigrammata* 4.8: the Roman's day  *(used)*

Text: https://www.thelatinlibrary.com/martial/mart4.shtml (verbatim, 12 lines):

```
Prima salutantes atque altera conterit hora,
     exercet raucos tertia causidicos,
in quintam uarios extendit Roma labores,
     sexta quies lassis, septima finis erit,
sufficit in nonam nitidis octaua palaestris,
     imperat extructos frangere nona toros:
hora libellorum decuma est, Eupheme, meorum,
     temperat ambrosias cum tua cura dapes
et bonus aetherio laxatur nectare Caesar
     ingentique tenet pocula parca manu.
Tunc admitte iocos: gressu timet ire licenti
     ad matutinum nostra Thalia Iouem.
```

Hour by hour:
- I–II salutatio
- III lawyers
- IV–V labores
- VI rest
- VII end of business
- VIII palaestra
- IX dinner
- X Martial's poems

XI and XII are **not covered**, and neither is the night.

### 2.3 Censorinus, *De die natali* 24: named parts of day and night  *(used for the night)*

Text: https://www.thelatinlibrary.com/censorinus.html (verbatim; the source text breaks off at the end):

> Sunt etiam plura noctis et diei tempora aliis subnotata propriisque discreta nominibus, quae apud veteres poetas passim scripta inveniuntur: ea omnia ordine suo exponam. Incipiam a nocte media, quod tempus principium et postremum est diei Romani. Tempus, quod huic proximum est, vocatur de media nocte; sequitur gallicinium, cum galli canere incipiunt, dein conticinium, cum conticuerunt; tunc ante lucem, et sic diluculum, cum sole nondum orto iam lucet. Secundum diluculum vocatur mane, cum lux videtur sole orto; post hoc ad meridiem, tunc meridies, quod est medii diei nomen, inde de meridie; hinc suprema: quamvis plurimi supremam post occasum solis esse existimant, quia est in XII tabulis scriptum sic: solis occasus suprema tempestas esto; sed postea M. Plaetorius tribunus plebiscitum tulit, in quo scriptum est praetor urbanus, qui nunc est quique posthac fuat, duo lictores apud se habeto iusque ad supremam—ad solem occasum usque—inter cives discito. Post supremam sequitur vespera, ante ortum scilicet eius stellae, quam Plautus vesperuginem, Ennius vesperum, Vergilius hesperon appellat. Inde porro crepusculum, sic fortasse appellatum, quod res incertae creperae dicuntur idque tempus noctis sit an diei incertum est. Post id sequitur tempus, quod dicimus luminibus accensis, antiqui prima face dicebant; deinde concubium, cum itum est cubitum; exinde intempesta—id est multa—nox, qua nihil agi tempestivum; tunc cum ad mediam noctem dicitur, et sic media nox * * *

Order: media nox → de media nocte → gallicinium → conticinium → ante lucem → diluculum → mane → ad meridiem → meridies → de meridie → suprema → vespera → crepusculum → luminibus accensis (prima fax) → concubium → intempesta nox → ad mediam noctem → media nox.

⚠ Censorinus never ties these segments to hours. The mapping onto the 12 night hours in `CIVIC_NIGHT_HOURS` is ours.

### 2.4 Macrobius, *Saturnalia* 1.3.12–15: a parallel list  *(not used)*

Text: https://penelope.uchicago.edu/Thayer/L/Roman/Texts/Macrobius/Saturnalia/1*.html (verbatim, including Thayer's typos "id es" and "tempora"):

> Qui dies ita dividitur. 12 Primum tempus diei dicitur mediae noctis inclinatio: deinde gallicinium, inde conticuum, cum et galli conticescunt et homines etiam tum quiescunt: deinde diluculum, id es cum incipit dinosci dies: inde mane, cum dies clarus est. 13 Mane autem dictum, aut quod ab inferioribus locis, id est a Manibus, exordium lucis emergat, aut, quod verius mihi videtur, ab omine boni nominis. […] 14 Deinde a mane ad meridiem, hoc est ad medium diei: inde iam supra vocatur tempus occiduum, et mox suprema tempestas, hoc est diei novissimum tempus, sicut expressum est in duodecim tabulis: SOLIS OCCASUS SUPREMA TEMPESTAS ESTO: 15 deinde vespera, quod a Graecis tractum est. […] Ab hoc tempora prima fax dicitur, deinde concubia, et inde intempesta, quae non habet idoneum tempus rebus gerendis. 16 Haec est diei civilis a Romanis observata divisio.

It differs from Censorinus: *conticuum*, *tempus occiduum*, *concubia*, and no crepusculum.

### 2.5 Vegetius, *Epitoma rei militaris* 3.8: four night watches  *(used)*

Checked at https://www.thelatinlibrary.com/vegetius3.html (verbatim): "ideo in quattuor partes ad clepsydram sunt diuisae uigiliae, ut non amplius quam tribus horis nocturnis necesse sit uigilare."

### 2.6 Firmicus Maternus, *Mathesis*: planetary natures in Latin  *(not used)*

Source: LacusCurtius, Kroll–Skutsch text, https://penelope.uchicago.edu/Thayer/L/Roman/Texts/Firmicus_Maternus/Mathesis/1*.html and `4*.html`. ⚠ Some books are not fully proofread.

**1.10.14** is a hymn to all seven planets (verbatim):
- **Sol:** "Sol optime maxime, qui mediam caeli possides partem, mens mundi atque temperies, dux omnium atque princeps, qui ceterarum stellarum ignes flammifera luminis tui moderatione perpetuas"
- **Luna:** "tuque, Luna, quae in postremis caeli regionibus collocata ad genitalium seminum perennitatem menstruis semper aucta luminibus Solis augusta radiatione fulgescis"
- **Saturn:** "et tu, Saturne, qui in summo caeli vertice constitutus livedinem sideris tui pigro cursu et tardis agitationibus provehis"
- **Jupiter:** "et tu, Iuppiter, Tarpeia rupis habitator, qui mundum ac terras salutari semper ac benigna maiestate laetificas et secundi globi possides principatum"
- **Mars:** "tu vero, Gradive Mars rutilo semper horrore metuende, qui in tertiis caeli regionibus contineris"
- **Mercury and Venus:** only "vos etiam, fidi Solis comites Mercurius et Venus"

**4.19 "De domino geniturae"** covers five planets; Sun and Moon never act as dominus (4.19.4, 4.19.31). Verbatim:
- **Saturn, 4.19.5:** "faciet homines inflatos, spiritum sublevatos, honoratos bonos graves, boni consilii … Vita vero eorum erit malitiosa laboriosa sollicita et adsiduis doloribus animi implicata"
- **Jupiter, 4.19.9:** "faciet homines magni animi magna appetentes et quibus fides semper habeatur … imperiosos et in omnibus actibus suis nobiles gloriosos honestos"
- **Mars, 4.19.13:** "faciet asperos invictos et qui nullis rationibus subiugentur, mobiles contentiosos audaces periculosos, violentos … mortem vero faciet aut repentinam aut violentam"
- **Venus, 4.19.17:** "facit homines delectabiles laetos vocabiles, adsiduo lusu vacantes, amabiles gratos venustos amatores libidinosos pios iustos"
- **Mercury, 4.19.24:** "faciet cordatos ingeniosos, cuncta discentes, modestos, omnium artium discere secreta cupientes"

---

## 3. Hellas

### 3.1 Vettius Valens, *Anthologiae* I.1 "Περὶ τῆς τῶν ἀστέρων φύσεως"  *(used, shortened)*

Read off the scan of Kroll 1908 at https://archive.org/details/bub_gb_OQ_gAAAAMAAJ (p. 1 = leaf n19, pp. 2–4 = n20–n22; the OCR layer is useless).
- English: M. Riley's translation (LaTeX re-typeset): https://raw.githubusercontent.com/janegca/latex-valens/main/book01/01-stars.tex
- ⚠ Polytonic accents were transcribed by eye. Spot-check them against the scan.
- ⟨ ⟩ marks Kroll's supplements (the rubricated first letters).

| Planet | Greek (verbatim) | Kroll p.l | Riley |
|---|---|---|---|
| Ἥλιος | σημαίνει μὲν ἐπὶ γενέσεως βασιλείαν, ἡγεμονίαν, νοῦν, φρόνησιν, μορφήν, κίνησιν, ὕψος τύχης, θεῶν χρηματισμόν, κρίσιν, δημοσίωσιν | 1.5–7 | kingship, rule, intellect, intelligence, beauty, motion, loftiness of fortune, the ordinance of the gods, judgment, public reputation |
| Σελήνη | σημαίνει μὲν κατὰ γένεσιν ἀνθρώποις ζωήν, σῶμα, μητέρα, σύλληψιν, ⟨μορφήν⟩, πρόσωπον, θέαν, συμβίωσιν ἤτοι γάμον νομικόν, τροφόν | 1.15–17 | man's life, body, the mother, conception, beauty, appearance, sight, living together (legitimate marriage), nurture |
| Κρόνος | ⟨Ὁ⟩ δὲ τοῦ Κρόνου ποιεῖ μὲν τοὺς ὑπ' αὐτὸν γεννωμένους μικρολόγους, βασκάνους, πολυμερίμνους, ἑαυτοὺς καταρρίπτοντας, μονοτρόπους | 2.1–3 | petty, malignant, care-worn, self-depreciating, solitary |
| Ζεύς | ⟨Ὁ⟩ δὲ τοῦ Διὸς σημαίνει τέκνωσιν, γονήν, ἐπιθυμίαν, ἔρωτας, συστάσεις, γνώσεις, φιλίας μεγάλων ἀνδρῶν, εὐπορίας | 2.24–25 | childbearing, engendering, desire, loves, political ties, acquaintance, friendships with great men, prosperity |
| Ἄρης | ⟨Ὁ⟩ δὲ τοῦ Ἄρεος σημαίνει βίας, πολέμους, ἁρπαγάς, κραυγάς, ὕβρεις, μοιχείας, ἀφαιρέσεις ὑπαρχόντων, ἐκπτώσεις, φυγαδείας | 2.35–37 | force, wars, plunderings, screams, violence, adulteries, loss of property, banishment, exile |
| Ἀφροδίτη | ⟨Ἡ⟩ δὲ Ἀφροδίτη ἐστὶ μὲν ἐπιθυμία καὶ ἔρως, σημαίνει δὲ μητέρα καὶ τροφόν· ποιεῖ δὲ ἱερωσύνας, γυμνασιαρχίας | 3.16–17 | desire and love; the mother and the nurse; priesthoods, gymnasiarchies |
| Ἑρμῆς | ⟨Ὁ⟩ δὲ τοῦ Ἑρμοῦ σημαίνει παιδείαν, γράμματα, ἔλεγχον, λόγον, ἀδελφότητα, ἑρμηνείαν, κηρυκείαν, ἀριθμόν, ψῆφον, γεωμετρίαν | 4.4–6 | education, letters, disputation, reasoning, brotherhood, interpretation, embassies, number, accounts, geometry |

⚠ Valens describes what a planet signifies in a **nativity**. These are not instructions for the hour.

### 3.2 Paulus Alexandrinus, *Eisagogika* (ed. Boer, Teubner 1958)

Read off a scan (unofficial upload, so cite the printed book):
- **Ch. 20 (κ΄), p. 40:** Περὶ τοῦ γνῶναι ἑκάστην ἡμέραν, τίνος τῶν θεῶν ἐστιν ("how to know which god each day belongs to")
- **Ch. 21 (κα΄), p. 41:** Περὶ τοῦ πολεύοντος καὶ διέποντος ("on the lord of the day and the lord of the hour")
- **Key sentence, p. 43.17–20 (verbatim):** διδόσθω εἶναι ἡμέραν Κρόνου. αὐτὸς ὁ ἀστὴρ κύριος τῆς ἡμέρας γίνεται καὶ πολεύει ὅλην τὴν ἡμέραν, τὴν πρώτην ὥραν αὐτὸς πολεύων καὶ διέπων· τὴν δευτέραν παραδίδωσι τῷ…

### 3.3 Greek astronomical planet names: [Aristotle] *De mundo* 2, 392a  *(used)*

Greek Wikisource (Bekker), https://el.wikisource.org/wiki/Περί_κόσμου (verbatim):

> Συνεχῆ δὲ ἔχει ἀεὶ τὴν θέσιν ταύτῃ ὁ τοῦ Φαίνοντος ἅμα καὶ Κρόνου καλούμενος κύκλος, ἐφεξῆς δὲ ὁ τοῦ Φαέθοντος καὶ Διὸς λεγόμενος, εἶθ' ὁ Πυρόεις, Ἡρακλέους τε καὶ Ἄρεος προσαγορευόμενος, ἑξῆς δὲ ὁ Στίλβων, ὃν ἱερὸν Ἑρμοῦ καλοῦσιν ἔνιοι, τινὲς δὲ Ἀπόλλωνος· μεθ' ὃν ὁ τοῦ Φωσφόρου, ὃν Ἀφροδίτης, οἱ δὲ Ἥρας προσαγορεύουσιν, εἶτα ὁ ἡλίου, καὶ τελευταῖος ὁ τῆς σελήνης…

Names: Saturn Φαίνων, Jupiter Φαέθων, Mars Πυρόεις, Mercury Στίλβων, Venus **Φωσφόρος** (not Ἑωσφόρος).
- Interesting variants: Mars is also "of Herakles", Mercury "of Apollo", Venus "of Hera".
- ⚠ The exact line numbers were not checked; LSJ confirms 392a24 for Φαέθων.

---

## 4. Egypt

### 4.1 Hour goddesses of the night: Amduat  *(used in `utils/egyptianHoursData.ts`)*

Sources:
- **Names:** E. Hornung, *Die Unterweltsbücher der Ägypter* (1997) p. 18, and *Das Amduat* (1963–67), via de.wikipedia "Amduat" and "Stundengottheiten".
- **Summaries:** en.wikipedia "Amduat".
- **Transliterations (hours 1 and 12 only):** Leitz, *Altägyptische Sternuhren* (1995), and von Lieven, *Grundriss des Laufes der Sterne* (2007), via the de.wiki articles "Erste/Zwölfte Nachtstunde".
- ⚠ The English renderings are translated from Hornung's German. Check them against Hornung & Abt, *The Egyptian Amduat* (2007).

| # | Hour goddess | Gate (de.wiki) | Region (de.wiki) | Ra |
|---|---|---|---|---|
| 1 | **Wšmt-ḥꜣwt-ḫftjw=s** "She who smashes the foreheads of *her* enemies" | Western gateway of the horizon | — | enters the western horizon; baboons greet him |
| 2 | The wise one who protects her lord | Swallower of all | ⚠ "Hall of the complete truth"; usually **Wernes** | waters of Wernes, fertility |
| 3 | She who cuts the bas | Robber | Field of the shore-dwellers | waters of Osiris |
| 4 | The great one who is in the Duat | Which hides the towing | With living forms | desert of Sokar (Rosetau); the barque becomes a serpent, towed through sand |
| 5 | Guide in the midst of her barque | Halting place of the gods | West | cavern of Sokar; towed over the mound of Osiris |
| 6 | Arrival who gives the right (way) | With sharp knives | Water-hole of the netherworld dwellers | the ba of Ra unites with his corpse, protected by Mehen |
| 7 | She who repels Hiu and beheads the one with the terrible face | Gate of Osiris | Mysterious cavern | Apophis is bound by Isis's magic |
| 8 | Mistress of the deep night | Which stands without tiring | Sarcophagus of her gods | Ra opens five doors with his voice; the dead receive clothing |
| 9 | Adoring one who protects her lord | Which guards the flood | With emerging forms | twelve oarsmen; bread and beer for the dead |
| 10 | Raging one who slaughters the treacherous | With great manifestations | With deep waters and high banks | guards against Apophis; Horus rescues the drowned |
| 11 | The starry one, mistress of the barque, who repels the rebel | Resting place of the netherworld dwellers | Edge of the cavern | Ra's eyes are healed; enemies are burned |
| 12 | **Ptrt-nfrw-nb=s** "She who sees the perfection of *her lord*" | Which raises the gods | End of the primeval darkness | reborn as Khepri in the east |

⚠ The gate and region columns may be misaligned in de.wiki. Schweizer (*The Sungod's Journey through the Netherworld*, 2010) calls the gate after hour 1 "He-who-devours-all".

### 4.2 Hour goddesses of the day: Book of the Day  *(used, lower confidence)*

Source: M. Müller-Roth, *Das Buch vom Tage* (2008); Osing, *Hieratische Papyri aus Tebtunis I* (1998) pp. 198–201; via de.wikipedia "Buch vom Tage". Ancient title: *sšmw n rḫ rnw n nꜣ wnwt nt hrw*.

| # | Name (deity) | Differs in de.wiki "Stundengottheiten"? |
|---|---|---|
| 1 | **S-ḫꜥ-nfrw-n-Rꜥ** She who makes the beauty of Ra appear (Maat/Heka) | same |
| 2 | She who drives away the darkness (Hu) | same |
| 3 | She who makes the bas of the gods rejoice and sees millions (Sia) | slightly |
| 4 | Light of the rising (Asebit) | blank |
| 5 | The hour of the goddess Igeret | blank |
| 6 | She who rises in seizing Seth | "Arud-nedjer", raising of Ra (Seth spears Apophis) |
| 7 | She who makes the heart wide (Horus) | same |
| 8 | Becoming and coming-into-being (Khonsu) | "Jubilant one" |
| 9 | Hour of crossing to Sekhet-iaru (Isis) | adds "of the glorious secret" |
| 10 | Descending to the Sektet barque to cross (Heka-wer) | same |
| 11 | Arranging the tow-ropes | "Beautiful to behold" |
| 12 | Setting of this god in the West (Ra) | **Ḥꜣpw-srt** "She who hides the shining one" (Leitz, Osing) |

⚠ Verify hours 2–11 in Müller-Roth 2008 or Piankoff, *Le Livre du jour et de la nuit* (1942). Some of the "Ra" lines for the day hours in `egyptianHoursData.ts` are our paraphrases of the hour names.

### 4.3 Vocabulary

| Term | Meaning | Source |
|---|---|---|
| **wnwt** (fem.) | unequal hour, 1/12 of day or night; also an hour duty, or a temple's hour-priesthood; Coptic ⲟⲩⲛⲟⲩ | https://en.wiktionary.org/wiki/wnwt |
| **jmj-wnwt** | "the one in the hour", astronomer or hour-watcher | wiktionary; Belmonte & Lull, *Astronomy of Ancient Egypt*, p. 83 |
| **wnwt nt hrw** | "the hours of the day" (attested) | Book of the Day title |
| **wnwt nt grḥ** | "the hours of the night" (by analogy) | Amduat: *wnwt pw tpt nt grḥ* "it is the first hour of the night" |

### 4.4 Planet names  *(used in `utils/egyptianSkyMap.ts`)*

Sources:
- Ramesseum ceiling, McMaster AEA database: https://aea.mcmaster.ca/index.php/en/database/ars/ar1-type-menu/ramesseum-second-hypostyle-hall (Nelson & Hoelscher 1929).
- Senenmut's ceiling has only Jupiter and Saturn.
- Standard references, not accessed: Neugebauer & Parker, *Egyptian Astronomical Texts* III; Clagett, *Ancient Egyptian Science* II.

| Planet | Transliteration | Popular | Meaning | Note |
|---|---|---|---|---|
| Jupiter | Ḥr-tꜣš-tꜣwj | Hor-tash-tawy | Horus who bounds the Two Lands; "southern star of the sky" | ⚠ de.wiki reads it Ḥr-wpš-tꜣwj, "who illuminates" (LGG VI 241) |
| Saturn | Ḥr-kꜣ-pt | Hor-ka-pet | Horus, bull of the sky; "eastern star that crosses the sky" | LGG V 293 |
| Mars | Ḥr-ꜣḫtj (Ramesseum) / **Ḥr-dšr** (MK, Greco-Roman) | Hor-desher | Red Horus; "travels backwards" (sḳdd=f m ḫtḫt), a description of retrograde motion! | LGG V 296; ⚠ "western" vs "eastern" star |
| Mercury | Sbg / Sbgw | Sebegu | meaning unclear; star of Seth (New Kingdom), star of Thoth (Greco-Roman) | LGG VI 266 |
| Venus | (Sbꜣ) ḏꜣ (Bnw); older Nṯr-dwꜣj | Seba-dja / Netjer-duai | the crosser (of the Benu bird); "the morning god" | LGG IV 445 |

Pharaonic Egypt used a 10-day week (three decades per 30-day month).

---

## 5. Babylon

Main sources:
- **ADRT I intro** = Sachs & Hunger 1988 (link in §1).
- **RlA "Tag"** = M. P. Streck, "Tag, Tageszeiten. A", *Reallexikon der Assyriologie* 13: https://www.gko.uni-leipzig.de/fileadmin/Fakult%C3%A4t_GKR/Altorientalisches_Institut/Dokumente/Institut/Mitarbeiter/Streck_Dokumente/RlA/RlA_Tag.pdf
- **ASE** = All Skies Encyclopaedia, https://ase.exopla.net (one entry per name; it cites Gössmann 1950 and Kurtik 2022).
- ⚠ **Not accessed:** CAD, Hunger & Pingree, *Astral Sciences in Mesopotamia* (1999), Rochberg 1998.

### 5.1 Time  *(used in `BabylonianSkyDiary.tsx`)*

- **The day begins at sunset** (ADRT I p. 15). The Diaries record the night (GE₆) first, then the day.
- **UŠ** ("time-degree") = 4 minutes; the sky turns 1° in 1 UŠ. 1/60 UŠ = 1 NINDA (ADRT I p. 16). Times are given relative to sunset or sunrise, e.g. "48 UŠ after sunset".
- **bēru (DANNA)** "double hour" = 30 UŠ; 12 bēru make one sunset-to-sunset day (from the 7th c. BCE on). Originally a distance measure. Counted from sunrise or sunset (RlA §1.5).
  - ⚠ The RlA copy says "60 UŠ", an apparent error.
  - Example: "6 bēru of daylight, 6 bēru of night" at the equinox (SAA 8, 140).

### 5.2 Watches (EN.NUN, *maṣṣartu*), three per night and three per day, varying with the season  *(used, `getWatch`)*

Source: RlA §1.3. Usually *maṣṣartu* is left out and the adjective stands alone as a noun.
- **Night watch 1:** en-nu-ùĝ an-ta, *barārītu* "(when evening light) glimmers"
- **Night watch 2:** en-nu-ùĝ murub-ba, *qablītu* "the middle one", also *šāt mūši*
- **Night watch 3:** u₄-zal-la / *uzallu*, *namārītu*, *šāt urri* "that of the bright day", *uḫḫurtu*
- **Day watches:** *maṣṣarti šēri* "of the dawn", *maṣṣarti muṣlāli* "of the siesta", *maṣṣarti līlâti* "of the evening"
- **In the Diaries themselves:**
  - Night parts: USAN, MURUB₄, ZALÁG (SAG GE₆ "beginning of night").
  - Day parts: *ina še-ri* "morning", AN.BAR₇ "noon", *ina* KIN.SIG "afternoon", KI ŠÚ šamaš "at sunset" (ADRT I p. 15).

### 5.3 Planets in the Diaries  *(used)*

Seleucid-era listing order: Jupiter, Venus, Mercury, Saturn, Mars (ADRT I intro).

| Planet | Diaries writing | Akkadian / meaning | Notes |
|---|---|---|---|
| Jupiter | MUL₂.BABBAR (= MÚL.BABBAR) | "the White/Bright Star" (*peṣû* = white); older ᵈSAG.ME.GAR; Greek Μολοβόβαρ | SAG.ME.GAR is **not** the Diaries form |
| Venus | ᵈdele-bat | Dil(i)bat "the sparkling one"; Greek Δελέφατ | |
| Mercury | GU₄.UD | *Šiḫṭu* ("jump"); Greek Σεχές | |
| Saturn | GENNA | *Kayyamānu* "the steady one"; earlier ᵈSAG.UŠ | ⚠ the old panel title "Ūmū Kayyāmānu" thus meant "days of Saturn" |
| Mars | AN | *Ṣalbatānu* (meaning unsettled) | |

Planet–god links (for possible future use):
- **Marduk = Jupiter:** solid (Oracc AMGG "Marduk").
- **Ištar = Venus:** solid.
- **Saturn = Ninurta:** Koch-Westenholz 1995. ⚠ In MUL.APIN, Ninurta is Mercury. Saturn is also called "the star of Šamaš" in Neo-Assyrian reports.
- **Nergal = Mars, Nabû = Mercury:** ⚠ weakly sourced so far. Confirm in Hunger & Pingree 1999.
- New Year ritual: Jupiter "bearing signs to the whole world", Saturn "star of truth and justice", Mars "the fierce fire-god" (Linssen 2004 p. 220).

### 5.4 Planetary phenomena terms

- **IGI:** first appearance, e.g. "GU₄.UD ina NIM ina GU IGI" = Mercury's first appearance in the east in Aquarius (Hollywood, Durham MSc 2002, https://etheses.durham.ac.uk/3978/).
- **ŠÚ (ŠU₂)** at the end of a phrase: disappearance, now preferred to "last appearance" (de Jong, *AHES* 2018). Inside "ina ŠÚ" it means **"in the west"**; NIM = **"east"**.
- **UŠ:** stationary point, *nenmudu*. First station UŠ IGI (*nēmetta maḫrīta*), second UŠ EGIR (*nēmetta arkīta*). ⚠ Medium confidence (Ossendrijver 2016 snippet).
- **ME:** acronychal rising, "ana ME-e A" (Sachs 1952; Hollywood & Steele, *Centaurus* 2004).
- **Retrograde:** ⚠ **no attested Diaries term found.** "LAL" in the Diaries is used for river levels. Show it in Spanish only.
- Modern labels: Γ Φ Θ Ψ Ω (Neugebauer) or FA, S1, AR, S2, LA (Ossendrijver).

### 5.5 Zodiac abbreviations (Late Babylonian)

| Sign | Abbr. | Full name |
|---|---|---|
| Aries | ḪUN | LU₂.ḪUN.GA₂, *agru* "Hired Man" |
| Taurus | MÚL | MUL.MUL, *zappu* "Bristle"; meant the Pleiades before about 320 BCE |
| Gemini | MAŠ.MAŠ | Twins |
| Cancer | ALLA | *alluttu* "Crab" |
| Leo | A | UR.A "Lion" |
| Virgo | ABSIN | *absinnu* "Furrow" |
| Libra | RÍN | *zibānītu* "Scales" (not RIN₂) |
| Scorpio | GÍR.TAB | *zuqaqīpu* "Scorpion" |
| Sagittarius | PA | Pabilsag |
| Capricorn | MÁŠ | SUḪUR.MÁŠ "Goat-fish" |
| Aquarius | GU | GU.LA "Great One" |
| Pisces | zib(.me) | *zibbātu* "Tails" |

⚠ The Babylonian zodiac was **sidereal**: about 25° from the tropical signs today (the modern Fagan–Bradley ayanamsa is a reconstruction of it). The app currently uses tropical signs everywhere on the Babylonian page.

---

## 6. China: 七曜 and the 宿曜经

- **Title:** 文殊師利菩薩及諸仙所說吉凶時日善惡宿曜經 (T21 no. 1299), 2 fascicles, by Amoghavajra 不空. CBETA: https://cbdata.dila.edu.tw/stable/juans?work=T1299&juan=1
- **Colophon:** 以乾元二年翻出此本 (Qianyuan 2 = **759**); 大唐廣德之二年 (764); annotated by 楊景風.
- **Recensions:** the Persian and Sogdian terms sit in fascicle 2, the earlier 759 recension (Bill M. Mak, "Persian Astronomy in China", 2024, doi:10.1177/09719458241247636).
- **Day names (verbatim, from the 七曜直日曆品 chapter, T1299 juan 2):**

| Day | Luminary | 胡名 (Sogdian) | 波斯名 (Persian) | 天竺名 (Indian) |
|---|---|---|---|---|
| Sun | 日曜 太陽 | 蜜 | 曜森勿 | 阿儞底耶 |
| Mon | 月曜 太陰 | 莫 | 婁禍森勿 | 蘇摩 |
| Tue | 火曜 熒惑 | 雲漢 | 勢森勿 | 盎哦囉迦 |
| Wed | 水曜 辰星 | 咥 | 掣森勿 | 部陀 |
| Thu | 木曜 歲星 | 鶻勿 | 本森勿 | 勿哩訶娑跛底 |
| Fri | 金曜 太白 | 那歇 | 數森勿 | 戌羯羅 |
| Sat | 土曜 鎮星 | 枳院 | 翕森勿 | 賒乃以室折囉 |

蜜 = Sogdian *Mīr* (Mihr). The Chinese UI of this app uses simplified characters.

---

## 7. Ideas for future enhancements

- **Rome:**
  - Show the Chronograph's *day* rating (Saturni dies N, …).
  - Add Macrobius' variant names.
- **Hellas:**
  - Add Paulus Alexandrinus' "πολεύων / διέπων" (lord of the day / of the hour) terminology.
  - Use the *De mundo* variants (Mars "of Herakles", Venus "of Hera").
- **Egypt:**
  - Verify day hours 2–11 in Müller-Roth.
  - Add the gate and region names of the Amduat hours.
  - Add decan star clocks to `EgyptianStarMap`.
  - Mars's epithet "travels backwards" could label retrograde Mars.
- **Babylon:**
  - Sidereal zodiac for the whole page.
  - Detect phenomena events (IGI first appearance, ŠÚ disappearance, UŠ stations, ME acronychal rising) from `planetSkyState.ts` and list upcoming ones, Diaries-style.
  - Add the Normal Stars (ADRT I table).
  - `BabylonianClock` still shows a planetary-hour ruler, which is anachronistic.
- **China:** show the Sogdian/Persian/Indian day names from the table above.

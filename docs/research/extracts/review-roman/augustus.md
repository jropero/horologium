# Review: Augustus (Month 7, August) — App vs. Sources
**Date**: 2026-10-25
**Sources compared**:
- Scullard, H.H. *Festivals and Ceremonies of the Roman Republic*. Thames & Hudson, 1981. pp. 169–184.
- Fowler, W.W. *The Roman Festivals of the Period of the Republic*. London, 1899. pp. 200–227.
**App data**: `utils/romanYearData.ts`, keys "7-1" through "7-31".

---

## WRONG_STATUS: Kalendae Augusti (Day 1)

- **App**: key "7-1" | status=NP | festivalName="Dedicaciones del 1 de Agosto" | deity="Spes / Marte"
- **Source**: Scullard p. 169–170 explicitly gives status **F** for the temple of Spes in the Forum Holitorium on Aug. 1. Victoria and Victoria Virgo on the Palatine are also F on the same day. Neither entry is NP.
- **Issue**: App status is NP; both attested Aug. 1 dedications carry status F in Scullard. No source gives NP for this date.
- **Fix**: Change `status` to `'F'` and `statusFull` to `"Dies Fastus"`.
- **Priority**: HIGH

---

## WRONG_DEITY: Spes / Marte — Day 1

- **App**: key "7-1" | deity="Spes / Marte" | festivalDesc="…Templo de Spes y del Templo de Marte Ultor en la era imperial."
- **Source**: Scullard p. 169–170: Aug. 1 attests Spes (Forum Holitorium) and Victoria / Victoria Virgo (Palatine). Neither Scullard nor Fowler mention Mars Ultor for this day. Mars Ultor's Augustan dedication day is 12 May (the Forum of Augustus), not 1 August.
- **Issue**: Mars Ultor does not belong here; the second deity on Aug. 1 is Victoria/Victoria Virgo, not Mars.
- **Fix**: Change `deity` to `"Spes / Victoria"` and update `deityDesc` and `festivalDesc` accordingly; remove the Mars Ultor reference.
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Victoria / Victoria Virgo — Day 1

- **App**: key "7-1" — no mention of Victoria or Victoria Virgo.
- **Source**: Scullard p. 170: "Two temples of Victoria stood on the Palatine. One dedicated by L. Postumius Megellus in 294 BC … The other, to Victoria Virgo, nearby, dedicated by M. Porcius Cato in 193 BC." Both carry status F on 1 August.
- **Issue**: An attested double dedication (Victoria and Victoria Virgo) on the same day is entirely absent.
- **Fix**: Add a note in `festivalDesc` for "7-1" that includes the Victoria dedications on the Palatine, or extend `deity` to cover all three (Spes, Victoria, Victoria Virgo).

  Suggested festivalDesc addition:
  ```
  También se conmemoran en este día las dedicaciones del Templo de Victoria y del Templo de Victoria Virgo en el Palatino (294 a.C. y 193 a.C. respectivamente).
  ```
- **Priority**: MEDIUM

---

## MINOR: Supplicia Canum description incomplete — Day 3

- **App**: key "7-3" | festivalDesc="Se castigaba ritualmente a los perros por no haber ladrado cuando los galos asediaron el Capitolio en el pasado lejano."
- **Source**: Scullard p. 170–171: The rite had two equally important elements — dogs were crucified on crosses of elder-wood and carried in procession; simultaneously, a goose (or geese) adorned with purple and gold was carried in a litter to honour its vigilant ancestors. The goose honor is the positive counterpart to the dog punishment.
- **Issue**: The festivalDesc describes only the dog punishment without the goose procession, giving a lopsided picture of the ritual.
- **Fix**: Extend `festivalDesc` to include the honor given to geese:
  ```
  Se castigaba ritualmente a los perros crucificándolos en cruces de saúco, por no haber ladrado cuando los galos asediaron el Capitolio. Al mismo tiempo, un ganso engalanado con púrpura y oro era llevado en litera en procesión, honrando a sus antepasados vigilantes que sí dieron la alarma.
  ```
- **Priority**: LOW

---

## MINOR: festivalDesc says "altar" instead of "temple" — Day 5

- **App**: key "7-5" | festivalDesc="Aniversario del altar de la salud protectora del pueblo romano."
- **Source**: Scullard p. 171 and Fowler p. 190–191 both describe the **temple** of Salus on the Quirinal (dedicated 302 BC by C. Iunius Bubulcus). There is no "altar of Salus" — the cult object is a temple.
- **Issue**: "altar" (altar) should be "templo" (temple).
- **Fix**: `festivalDesc` → "Aniversario de la dedicación del Templo de Salus en el Quirinal (302 a.C.)."
- **Priority**: LOW

---

## WRONG_STATUS: Sol Indiges — Day 9

- **App**: key "7-9" | status=NP | statusFull="Sol Indiges"
- **Source**: Scullard p. 171: status **C** (dies comitialis). Fowler p. 191–193: status F in Fasti Allif.; IP in Fasti Amit./Maff. — no source gives NP.
- **Issue**: NP is unsupported by any source. The calendar status is C (Scullard) or F/IP (Fowler).
- **Fix**: Change `status` to `'C'` and `statusFull` to `"Dies Comitialis"` (following Scullard). The deity and festival name are otherwise correct.
- **Priority**: HIGH

---

## WRONG_DATE: Hercules / Ara Maxima placed on Day 11 instead of Day 12

- **App**: key "7-11" | status=C | deity="Hércules" | festivalName="Culto de Ara Maxima"
- **Source**: Scullard p. 171–173: Hercules Invictus at the Ara Maxima is firmly on **12 August** (Pridie Idus). Fowler p. 193–197: "Aug. 12 (Pridie Idus Sextiles)." No source places an Ara Maxima rite on Aug. 11.
- **Issue**: The festival is on the wrong day. Key "7-11" should have no festivalName; key "7-12" should carry the Hercules entry.
- **Fix**:
  - Remove festivalName/festivalDesc/deity from "7-11" (leave as plain dies comitialis).
  - Move the festival to "7-12" (see MISSING_FESTIVAL: Hercules below).
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Hercules Invictus at Ara Maxima / Venus Victrix at Pompey's Theatre — Day 12

- **App**: key "7-12" | status=C | no festivalName
- **Source**:
  - Scullard p. 171–173: **Aug. 12**, status C. Praetor urbanus sacrificed a heifer at the Ara Maxima. Merchants paid tithes of profit; generals offered tithes of booty. Women and dogs excluded. Sacrifice eaten on-site; uncovered head, crowned with laurel (Greek rite).
  - Scullard p. 173: Also on Aug. 12, dies natalis of Pompey's stone theatre (55 BC) with temples to Venus Victrix, Honos, Virtus, Felicitas at the summit of the seating.
  - Fowler p. 193–197: same day, same rites.
- **Issue**: The Hercules festival is entirely missing from the correct day. The Venus Victrix / Pompey's theatre entry is also unrepresented anywhere.
- **Fix**: Suggested entry for "7-12":
  ```ts
  "7-12": {
      status: 'C',
      statusFull: "Dies Comitialis",
      deity: "Hércules Invicto / Venus Victrix",
      deityDesc: "El héroe divino invicto y diosa de la victoria.",
      festivalName: "Herculi Invicto ad Aram Maximam",
      festivalDesc: "El pretor urbano sacrificaba una novilla en el Ara Maxima con la cabeza descubierta y coronada de laurel, al modo griego. Los mercaderes y generales entregaban décimas de sus ganancias y botín. Las mujeres y los perros estaban excluidos del santuario; lo que no ardía en el altar era consumido en el lugar. También se celebraba el dies natalis del teatro de piedra de Pompeyo (55 a.C.), con sus templos a Venus Victrix, Honos, Virtus y Felicitas en lo alto de la cávea."
  },
  ```
- **Priority**: HIGH

---

## WRONG_RITUAL: "Nemoralia" / Festival focused on Lake Nemi — Day 13

- **App**: key "7-13" | festivalName="Nemoralia" | festivalDesc="Festival de la luz y de Diana celebrado en el lago Nemi, popular entre las mujeres y los esclavos."
- **Source**:
  - Scullard p. 173–175: The calendar entry is **Dianae in Aventino** — the Aventine temple. The slave holiday and women's torch processions from Aricia are described, as is the founding by Servius Tullius. The Nemi sanctuary (Diana Nemorensis) is associated but the *fasti* entry is specifically for the Aventine temple.
  - Fowler p. 198–202: "Diana in Aventino: Temple traditionally ascribed to Servius Tullius … commune Latinorum Dianae templum." Fowler discusses Lake Nemi only as context for the Arician cult.
- **Issue**: The app's festivalName "Nemoralia" and exclusive focus on Lake Nemi misrepresent the official Roman calendar entry, which records the Aventine temple of Diana. The Nemoralia at Nemi is the associated Latin festival; the *fasti* entry is "Dianae in Aventino."
- **Fix**:
  - Change `festivalName` to `"Dianae in Aventino (Ides of August)"`.
  - Update `festivalDesc` to centre on the Aventine temple, mentioning the slave holiday (all masters obliged to give slaves the day off), the torchlit processions of women from Aricia, and the Latin origins of the cult under Servius Tullius; Nemi can be noted as the associated Latin sanctuary.
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Vortumnus / Fortuna Equestris / Hercules Victor / Castor & Pollux / Camenae / Flora — Day 13

- **App**: key "7-13" records only Diana.
- **Source**: Scullard p. 175–176 and Fowler p. 198–202 list all the following as NP on 13 August in various fasti:
  - **Vortumnus (Vertumnus) in Aventino**: temple built by M. Fulvius Flaccus after capture of Volsinii (264 BC). Etruscan deity; a bronze statue also in the Vicus Tuscus.
  - **Fortunae Equestri**: temple vowed by Q. Fulvius Flaccus in 180 BC during the Celtiberian campaign (Fasti Antiates).
  - **Herculi Victori / Herculi Invicto ad Portam Trigeminam**: annual sacrifice at the temple near the Porta Trigemina.
  - **Castori, Polluci in Circo Flaminio**: temple of the Dioscuri in the Circus Flaminius.
  - **Camenis**: worship at the Camenae's grove and spring (southern Caelian Hill).
  - **Florae ad Circum Maximum**: probably marks Tiberius's restoration of the Flora temple (AD 17; Tac. Ann. 2.49).
- **Issue**: Five cult entries attested on this date are absent from the app.
- **Fix**: Extend `festivalDesc` for "7-13" to note the multiple dedications sharing the day (brief mention is sufficient; full entries would need separate keys, which the data model may not support for same-day multiple festivals). At minimum, add a note: "Comparten esta fecha los dies natales de los templos de Vortumno, de la Fortuna Equestre, de Hércules Victorioso ad Portam Trigeminam, de Cástor y Pólux en el Circo Flaminio, y del santuario de las Camenas."
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Janus ad Theatrum Marcelli — Day 17

- **App**: key "7-17" | festivalName="Portunalia" — no mention of Janus.
- **Source**: Scullard p. 176–177: "Temple of Janus built by C. Duilius after his defeat of the Carthaginians at Mylae in 260 BC, dedicated on the day of the Portunalia (17 August)." Fowler p. 202–204: "Iano ad theatrum Marcelli" (VALL. ALLIF.).
- **Issue**: The Janus temple dedication sharing the day of the Portunalia is absent.
- **Fix**: Add to `festivalDesc` for "7-17": "Comparte esta fecha la dedicación del Templo de Jano ad theatrum Marcelli, erigido por C. Duilio tras su victoria sobre los cartagineses en Mylae (260 a.C.)."
- **Priority**: LOW

---

## WRONG_STATUS: Vinalia Rustica — Day 19

- **App**: key "7-19" | status=NP | statusFull="Vinalia Rustica"
- **Source**: Scullard p. 177: status **F** (Fasti Antiates). Fowler p. 204–206: status PP (Fasti Antiates, Allif.) or IP (Maff., Amit.) — no source assigns NP.
- **Issue**: NP is not supported by Scullard or Fowler. Scullard gives F; Fowler gives PP/IP.
- **Fix**: Change `status` to `'F'` and `statusFull` to `"Dies Fastus"` (following Scullard). Alternatively `'NP'` could be argued from some calendars, but not from these two sources.
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Venus Libitina — Day 19

- **App**: key "7-19" — no mention of Venus Libitina.
- **Source**: Scullard p. 177: "A temple to Venus Libitina dedicated on 19 August in the Lucus Libitinae on the Esquiline." The area was headquarters of undertakers (libitinarii) where death registrations were kept. Plutarch speculates on the connection to birth and death.
- **Issue**: An attested Aug. 19 dedication (Venus Libitina) is absent.
- **Fix**: Add to `festivalDesc` for "7-19": "También se conmemora la dedicación del Templo de Venus Libitina en el Lucus Libitinae del Esquilino, sede de los profesionales fúnebres (libitinarii) y registro de defunciones."
- **Priority**: MEDIUM

---

## WRONG_STATUS: Consualia — Day 21

- **App**: key "7-21" | status=F | statusFull="Dies Fastus"
- **Source**: Scullard p. 177–178: status **NP** ("dies nefasti publici, major public festival" — explicitly listed among the six NP days of August). Fowler p. 206–209: status IP (Fasti Pinc., Maff., Vall., etc.).
- **Issue**: App gives F; Scullard gives NP; Fowler gives IP. The status F is not attested in either source. The Consualia is one of the most important festivals of August and cannot be a plain dies fastus.
- **Fix**: Change `status` to `'NP'` and `statusFull` to `"Consualia"` (following Scullard, the primary source used across this app).
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Luna in Graecostasi — Day 24

- **App**: key "7-24" — the only entry is "Mundus Patet"; no mention of Luna.
- **Source**: Scullard p. 180–181: "Sacrifice to Luna at the Graecostasis, a tribunal or platform between the Comitium and Forum" on 24 August (Fasti Pinciani). This is a separate cult event on the same dies comitialis.
- **Issue**: The Luna sacrifice at the Graecostasis is absent.
- **Fix**: Add to `festivalDesc` for "7-24": "Los Fasti Pinciani registran también un sacrificio a Luna en la Graecostasis, plataforma entre el Comicio y el Foro."
- **Priority**: LOW

---

## WRONG_RITUAL: Mundus Patet described as "dies nefasto" — Day 24

- **App**: key "7-24" | festivalDesc="Primera de las tres fechas del año en que el 'Mundo' (fosa ritual del más allá) quedaba abierto, siendo un día nefasto para cualquier labor militar o política mayor."
- **Source**: Scullard p. 180–181 and Fowler p. 211–212: The Mundus Patet days (24 Aug., 5 Oct., 8 Nov.) are described as **dies religiosi** — a legal/religious category distinct from dies nefasti. On a dies religiosus no public business, battle, levy, marriage, or sea voyage was permitted, but the classification is *religiosus* not *nefastus* (which carries different calendar-law implications).
- **Issue**: The app uses "nefasto" (dies nefastus) when sources specify *dies religiosus*. These are different categories in Roman calendrical law.
- **Fix**: Change `festivalDesc` to: "Primera de las tres fechas del año en que el 'Mundo' (fosa ritual del Palatino) quedaba abierto. Era un *dies religiosus*: prohibido el combate, la leva, el matrimonio y la navegación. No un *dies nefastus* formal, sino un día de recogimiento al abrirse la puerta del inframundo (Macrobio 1.16.18)."
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Opiconsivia — Pontifex Maximus named instead of Rex Sacrorum — Day 25

- **App**: key "7-25" | festivalDesc="…celebrada en la Regia por las Vírgenes Vestales y el Pontifex Maximus…"
- **Source**: Scullard p. 181: "Only the Vestal Virgins and the State-priest (wearing a white veil, the **suffibulum**)" — describes the priest as a public officiant in the Regia. He notes it corresponds to the store-cupboard (penus) of the king. Fowler p. 212–214 (citing Varro L.L. 6.21): "praeter Virgines Vestales et **sacerdotem publicum**" — the public priest, which Fowler glosses as "the rex sacrorum or a pontifex."
- **Issue**: Both sources say the priest is the *Rex Sacrorum* (or possibly a pontifex acting in that role), not specifically the Pontifex Maximus. The Pontifex Maximus is not mentioned by either Scullard or Fowler for this rite. Naming him by the wrong title introduces an anachronism (the Pontifex Maximus was absorbed into the emperors' titles; the *rex sacrorum* would have been the Republican officiant).
- **Fix**: Change `festivalDesc` to read "…celebrada en la Regia por las Vírgenes Vestales y el Rex Sacrorum (sacerdos publicus), quien llevaba el suffibulum (velo blanco ritual). Todos los demás quedaban excluidos."
- **Priority**: MEDIUM

---

## WRONG_STATUS: Sol y Luna — Day 28

- **App**: key "7-28" | status=NP | statusFull="Dies Nefastus" | festivalName="Culto del Sol y la Luna"
- **Source**: Scullard p. 182: dies natalis of the temple of Sol and Luna near the Circus Maximus; calendar status given as **C** (dies comitialis).
- **Issue**: App gives status NP and statusFull "Dies Nefastus" — doubly wrong. The calendar gives C (dies comitialis). Additionally, statusFull "Dies Nefastus" would correspond to status N, not NP.
- **Fix**: Change `status` to `'C'` and `statusFull` to `"Dies Comitialis"`. The festivalName and deity are otherwise correct.
- **Priority**: HIGH

---

## Summary

| Category | Count | Days affected |
|---|---|---|
| WRONG_STATUS | 5 | 1, 9, 19, 21, 28 |
| WRONG_DEITY | 1 | 1 (Mars Ultor ≠ Victoria) |
| WRONG_DATE | 1 | 11 (Hercules belongs on 12) |
| WRONG_RITUAL | 3 | 13 (Nemoralia vs. Aventine), 24 (nefastus vs. religiosus), 25 (Pontifex vs. Rex Sacrorum) |
| MISSING_FESTIVAL | 6 | 1 (Victoria/Victoria Virgo), 12 (Hercules + Venus Victrix), 13 (Vortumnus + 4 others), 17 (Janus), 19 (Venus Libitina), 24 (Luna in Graecostasi) |
| MINOR | 2 | 3 (Supplicia Canum incomplete), 5 ("altar" vs. "temple") |
| **TOTAL** | **18** | |

### HIGH-priority fixes (break scholarly accuracy)
1. 7-1: status NP → F
2. 7-1: deity "Spes / Marte" → "Spes / Victoria" (remove Mars Ultor)
3. 7-9: status NP → C
4. 7-11 / 7-12: Move Hercules from day 11 to day 12; add Venus Victrix on 12
5. 7-13: festivalName "Nemoralia" → "Dianae in Aventino"; refocus description on Aventine temple
6. 7-19: status NP → F
7. 7-21: status F → NP (Consualia is a major public festival, one of August's six NP days)
8. 7-28: status NP / statusFull "Dies Nefastus" → status C / statusFull "Dies Comitialis"

### Cross-checks not yet done
- Days 1–8 and 29–31 not covered by Scullard/Fowler extracts provided — no findings possible for those days beyond what is explicitly listed above.
- The app's days 2, 4, 6, 7, 8, 10, 14, 15, 16, 18, 20, 22, 26, 29, 30, 31 (plain F/C without festivalName) appear consistent with sources as blank days; no correction needed unless a missing festival is discovered in future source coverage.

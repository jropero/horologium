# Hellenic Festivals — Source Research

Research notes for `utils/atticCalendarData.ts`. Goal: record what is verified,
flag gaps, and save the next review from re-reading from scratch.

**Primary reference**: H. W. Parke, *Festivals of the Athenians* (Thames & Hudson,
1977; paperback 1986). PDF in project downloads.  
**PDF page offset**: printed page N → PDF page N + 14.  
(Verified: printed p. 73 Pyanepsion header = PDF p. 87. ✓)

Rules (same as `hours-and-planets-sources.md`):
- Block quotes are **verbatim** from the page scan.
- Spanish renderings are ours unless stated.
- ⚠ marks an uncertainty or gap; check before building on it.

---

## Chapter page map (Parke)

| Month | Printed page | PDF page |
|---|---|---|
| Hecatombaion | 29 | 43 |
| Metageitnion | 51 | 65 |
| Boedromion | 53 | 67 |
| Pyanepsion | 73 | 87 |
| Maimakterion | 95 | 109 |
| Poseideon | 97 | 111 |
| Gamelion | 104 | 118 |
| Anthesterion | 107 | 121 |
| Elaphebolion | 125 | 139 |
| Munichion | 137 | 151 |
| Thargelion | 146 | 160 |
| Skiraphorion | 156 | 170 |
| Other / Unplaced | 171 | 185 |

---

## Thesmophoria (Pyanepsion 11–13)
**Sources used**: Parke pp. 82–88 (PDF pp. 96–102) + Allison 2012 (Kalligeneia paper, cites Stehle 2007)

### Three-day structure

Parke (p. 87, PDF p. 87):

> "In Athens, each of the three days of the *Thesmophoria* had distinct rituals,
> corresponding to different phases of the myth of Demeter and Persephone. Day one
> was called the *Anodos*, or 'way up', in which women would process up to the
> festival site. The second day of the festival was called *Nesteia*, or 'fasting'.
> On this day, the women ate nothing, and sat on the ground, mimicking the mourning
> Demeter. The final day of the festival is the *Kalligeneia*, 'beautiful birth',
> when the women would feast and celebrate."

*(Source in the Allison paper is Stehle, Eva, "Thesmophoria and Eleusinian
Mysteries: The Fascination of Women's Secret Ritual," in Parca & Tzanetou eds.,
*Finding Persephone* (Indiana UP, 2007), pp. 167–68.)*

Parke directly (pp. 87–88, PDF pp. 87–88):

> "The third day bore the title *Kalligeneia* which meant day of fair offspring.
> Sometimes Kalligeneia was described as an attendant goddess of Demeter, evidently
> derived from this day of the festival. This time the reference is not to
> agriculture or even to animal husbandry. The Greeks typically associated together
> all natural birth, and Demeter though chiefly goddess of the corn-crop also
> presided over human fertility. It is not surprising that when the women of Athens
> met together in seed-time the climax of their thoughts and interest was the bearing
> of fine children. After the grimness and mourning of the fast they will on this day
> have both celebrated the gift of children and prayed for a blessing on them and on
> any future family. Details of the secret ceremonies are entirely lacking."

### The pit-descent ritual on Kalligeneia

Stehle (via Allison, p. 6 / Stehle p. 169):

> "the *Kalligeneia* was the day when the women would descend into pits which held
> the remains of sacrificed piglets from earlier in the year. They would bring up
> the remains and humus, mixing it with the seeds to be planted that fall, believing
> it would aid in the crops' fertility."

⚠ Parke (1977) does not mention this pit-descent on Kalligeneia specifically.
Stehle (2007) does. Parke says "details of the secret ceremonies are entirely
lacking." Stehle's account is the current scholarly consensus; use it, but note
it post-dates Parke.

### The Chalcidian Pursuit — ⚠ treat with caution

Parke (p. 87, PDF p. 87) — **verbatim**:

> "What this ritual contained ancient authors do not tell us. Only one scrap of
> information survives which by its very obscurity shows how little was revealed.
> The late writers of dictionaries refer to 'a sacrifice performed at Athens by the
> women in secret at the *Thesmophoria*', which had the extraordinary name of
> 'Chalcidian pursuit' (*Chalcidicon Diogma*). Some explanatory myth told that in
> time of war the women had prayed, and the enemy had fled and had been pursued to
> Chalcis. No proper historical context is given for this event, and it is probably
> not worth while to conjecture, as it is much more likely that the myth is a pure
> fiction made to explain a name which was otherwise unintelligible, and which may
> itself have been corrupted in the course of centuries."

**Conclusions for the data:**
- The name *Chalcidicon Diogma* is attested (late dictionary writers).
- The myth (women prayed → enemy fled → pursuit to Chalcis) is Parke's
  "pure fiction made to explain an unintelligible name."
- It is linked to the **Thesmophoria generally**, not specifically to Kalligeneia.
- Keep it in the Kalligeneia entry but flag Parke's skepticism explicitly.

### Egyptian/foreign origin — Herodotus 2.171.1–3

Parke (and Allison) cite Herodotus directly:

> "The daughters of Danaus were those who brought this rite out of Egypt and taught
> it to the Pelasgian women… Let me preserve a discreet silence, too, concerning
> that rite of Demeter which the Greeks call *Thesmophoria*, except as much of it
> as I am not forbidden to mention."

Use as: source for foreign-origin note on Anodos and secrecy note on Nesteia.

### The Stenia (Pyanepsion 9) — Parke p. 88, PDF p. 88

> "But two days before it on the 9th of Pyanepsion there was another women's
> festival, the *Stenia*. By the classical period it was largely overshadowed by the
> *Thesmophoria*, and nothing of its rites is recorded, except that late
> lexicographers attribute also to it the practice of abusing each other which is
> assigned to the *Thesmophoria*."

⚠ The *Stenia* is NOT currently in `atticCalendarData.ts`. It is a separate
women's festival on Pyanepsion 9, the day before the Thesmophoria begins (day 11).
Low priority to add but it is a real gap.

---

## Skira / Skirophoria (Skiraphorion 12) — Parke pp. 156–ff / PDF pp. 170–ff

⚠ This section has not yet been read from Parke. Read PDF pages 170–185 to verify:
- The megara / pit-throwing ritual and its connection to Thesmophoria
- The Eubuleo myth (swineherd whose pigs fell into the earth with Persephone)
- The Skiron (white parasol) detail and the procession route

---

## Key bibliography

**Ancient sources**
- Herodotus, *Histories* 2.171.1–3 (Thesmophoria, foreign origin)
- *Homeric Hymn to Demeter* (myth of Demeter/Persephone; Iambe episode; the fast)

**Modern sources**
- Parke, H. W., *Festivals of the Athenians* (Thames & Hudson, 1977).
  Primary reference for all entries. PDF: `~/Downloads/festivals-of-the-athenians_compress.pdf`
- Stehle, Eva, "Thesmophoria and Eleusinian Mysteries," in Parca, M. & Tzanetou, A.
  (eds.), *Finding Persephone: Women's Rituals in the Ancient Mediterranean*
  (Indiana UP, 2007), pp. 165–202.  
  Source for: pit-descent on Kalligeneia (p. 169).
- Allison, Suzanne, "Kalligeneia: Fertility and Feminine Focus on an Athenian Bell
  Krater" (Hollins University, 2012). Secondary; cites Stehle and Foley.
  PDF: `~/Downloads/Kalligeneia_ Fertility and Feminine Focus on an Athenian Bell Kra.pdf`
- Foley, H. P., *The Homeric Hymn to Demeter: Translation, Commentary, and
  Interpretative Essays* (Princeton UP, 1994).

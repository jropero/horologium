# Roman Festival Data — March (Martius) Review
**App data key range**: "2-1" through "2-31"
**Sources**: H. H. Scullard, *Festivals and Ceremonies of the Roman Republic* (1981), pp. 84–96 (extract: `scullard/martius.md`); W. Warde Fowler, *The Roman Festivals of the Period of the Republic* (1899), pp. 44–77 (extract: `fowler/martius.md`)
**Reviewed**: 2026-10-25

---

## MISSING_FESTIVAL: Arma Ancilia Moventur — Day 9

- **App**: key "2-9" | status=C | festivalName=(none) | deity="Ninguna"
- **Source**: Scullard p. 89: "Arma Ancilia Moventur (Second Salian Procession)" — status C, Dies religiosus, deity Mars. Fowler pp. 43–44: "VII Id. Mart. — Arma Ancilia Movent (March 9)" — status C, Mars (Salii); explicitly names this as the second principal day of moving the ancilia, one of the three calendar-marked peaks of the Salian processions (1, 9, 23 March).
- **Issue**: Both sources identify March 9 as a named, calendar-marked Salian observance. The app entry has no festival name or deity for this day despite the C (comitialis) status being correct. The Salian procession on March 9 is as well attested as those on March 1 and March 23.
- **Fix**:
  ```
  "2-9": { status: 'C', statusFull: "Arma Ancilia Moventur", deity: "Marte", deityDesc: "Dios de la guerra.", festivalName: "Arma Ancilia Moventur", festivalDesc: "Segunda procesión principal de los sacerdotes Salii por la ciudad, portando los escudos sagrados (ancilia). Es uno de los tres días de movimiento señalados por el calendario (1, 9 y 23 de marzo); los Salii danzaban en estaciones rituales y festejaban cada noche en la mansio Saliorum." }
  ```
- **Priority**: HIGH (clearly attested in both sources; named calendar entry absent entirely)

---

## WRONG_RITUAL: Equirria — Day 14

- **App**: key "2-14" | status=NP | festivalName="Segunda Equirria" | deity="Marte" | festivalDesc: "Segunda fecha de carreras de caballos sagradas en el Campo de Marte para **honrar y purificar a las monturas militares**."
- **Source**: Scullard p. 89–90: "Horse-racing festival … linked with preparations for the campaigning season." Fowler p. 44: "A horse-race (feriae Marti), the second Equirria of the year."
- **Issue**: The app's festivalDesc says the rite was to "purify the military mounts" (*purificar a las monturas militares*). Neither source supports this; the Equirria was a horse-race (*ludi equestres*, feriae Marti), not a purification of mounts. Purification language in March properly belongs to the Quinquatrus (purification of the *ancilia*) and the Tubilustrium (purification of the *tubae*). The phrase transplants a ritual concept from a different day.
- **Fix**: "Segunda carrera de caballos del año celebrada como feriae Marti en el Campo de Marte. Junto con la Equirria del 27 de febrero, inauguraba la temporada de campaña y rendía honores al dios de la guerra."
- **Priority**: MEDIUM (wrong ritual description, but name, date, status, and deity are correct)

---

## MISSING_FESTIVAL: Mamuralia / Sacrum Mamurio — Day 14

- **App**: key "2-14" | festivalName="Segunda Equirria" only; no mention of Mamuralia
- **Source**: Scullard pp. 89–90: "Mamuralia / Sacrum Mamurio — Day 14, Fasti status NP (same day as Equirria; listed in Philocalus and Menologia but not earlier calendars). Deity: Mamurius Veturius." Ritual: a man clad in skins was beaten with rods and driven from the city amid shouts of 'Mamurius' (Lydus, 6th c. CE); Servius and Minucius Felix record that the Salii 'beat a skin' on this day. Fowler pp. 44–50 devotes six pages to the rite and its debated interpretation (scapegoat, old year-spirit), while explicitly cautioning that the Mamuralia appears only from Philocalus (354 CE) onwards and is absent from the older calendar fasti.
- **Issue**: Both sources discuss the Mamuralia at length for March 14, even if Fowler is sceptical of its antiquity. The app makes no mention of it.
- **Suggested entry note**: Given Fowler's explicit warning that the rite is unattested before the 4th century CE and may be a popular festival name for the second Equirria, the Mamuralia should be mentioned in the festivalDesc as a late-attested alternative tradition on the same day rather than given a separate entry. A note in the Equirria's festivalDesc would be the minimal fix:
  - Add to existing festivalDesc: "Los calendarios tardíos (Filócalo, s. IV d.C.) denominan este mismo día *Mamuralia* o *Sacrum Mamurio*: según Lydus, un hombre vestido de pieles era golpeado con varas y expulsado de la ciudad; Fowler considera el rito de antigüedad incierta."
- **Priority**: MEDIUM (both sources cover it; the festival is debated but real enough to note)

---

## INVENTED_AITION: Anna Perenna — Day 15

- **App**: key "2-15" | status=NP | festivalName="Anna Perenna" | deity="Anna Perenna / Júpiter" | festivalDesc: "Fiesta popular a orillas del Tíber bebiendo vino para asegurar una larga vida. **Históricamente marcado por el asesinato de Julio César (44 a.C.)**."
- **Source**: Scullard pp. 90–91: full treatment of Anna Perenna; no mention of Caesar's assassination. Fowler pp. 50–54: full treatment of Anna Perenna; no mention of Caesar's assassination. The Ides of March as the date of Caesar's death in 44 BCE is a historical fact, but neither source links it to the Anna Perenna festival, and Fowler notes the festival may have been declining or already obsolete by that date (absent from rustic calendars, Philocalus, and Silvius of the Imperial period).
- **Issue**: The Caesar assassination is presented in the festivalDesc as if it were part of the festival's religious or cultural significance. Neither Scullard nor Fowler make this connection. Adding a historical coincidence not from either scholarly source to a festival description is an invented aition. It also risks suggesting that the assassination has ritual relevance to the day's observances.
- **Fix**: Remove the Caesar sentence. Replace the location "a orillas del Tíber" with the more precise "en el primer miliario de la Vía Flaminia (junto a la actual Porta del Popolo)" — both sources specify this location. Corrected festivalDesc: "Fiesta popular celebrada en el primer miliario de la Vía Flaminia. La gente se tumbaba en parejas sobre la hierba o bajo improvisadas tiendas, bebía vino en número de copas igual a los años de vida deseados, y cantaba canciones aprendidas en el teatro. Macrobio registra sacrificios públicos y privados 'ut annare perannareque commode liceat'."
- **Priority**: HIGH (invented historical association presented as religious fact)

---

## WRONG_DEITY: Quinquatrus — Day 19

- **App**: key "2-19" | status=NP | festivalName="Quinquatrus" | deity="**Minerva**" | deityDesc: "Diosa de las artes y la estrategia militar." | festivalDesc: "Gran festividad **dedicada a Minerva**…"
- **Source**: Scullard pp. 93–95: "Deity: Mars (primary; Fasti Vaticani state Feriae Marti); Minerva (secondary, popular association)." The original rite was Feriae Marti; Minerva was added because her Aventine temple was dedicated on this day. Fowler pp. 57–62: "Deity: Mars (primary, original); Minerva (from the temple dedication, later association)." Fowler explicitly: "The Salii danced in the Comitium… The ancilia were purified… Original: Feriae Marti."
- **Issue**: Both sources are unambiguous: Mars is the primary deity of the Quinquatrus; Minerva is a secondary popular association arising from her temple dedication. The app reverses this hierarchy, listing only Minerva and describing the day as "dedicated to Minerva." This misrepresents the festival's core character: the original and dominant rite was the Salian purification of the ancilia (arms) for Mars, not a celebration for Minerva.
- **Fix**:
  - `deity`: "Marte / Minerva"
  - `deityDesc`: "Dios de la guerra (primario); diosa de las artes (asociación popular desde la dedicación de su templo)."
  - `festivalDesc`: "Feriae Marti. Los sacerdotes Salii danzaban en el Comitium en presencia de pontífices y tribunos; los ancilia (escudos sagrados) eran purificados ceremonialmente para preparar las armas para la campaña. Popularmente asociada a Minerva por la dedicación de su templo en el Aventino ese mismo día: artesanos, maestros, médicos, estudiantes y aprendices le ofrecían primicias. Del día 20 al 23 se celebraban combates gladiatorios (en tiempos de Ovidio)."
- **Priority**: HIGH (primary deity inverted)

---

## WRONG_RITUAL: Liberalia — Day 17

- **App**: key "2-17" | status=NP | statusFull="Liberalia / Agonalia" | deity="Liber Pater / Marte" | festivalDesc: "**Se celebra el crecimiento de la juventud; los adolescentes romanos asumen la Toga Virilis** (ropa de adultez civil)."
- **Source**: Scullard pp. 91–93: Primary Liberalia ritual — old women acting as priestesses of Liber, crowned with ivy, sat throughout the city selling sacrificial cakes (liba) of oil and honey; they offered sacrifice on behalf of customers. Also: the phallic cart procession recorded by Varro via Augustine (at Lavinium). The Liberalia was the main festival of Liber Pater and Libera as fertility/vine deities. The toga virilis ceremony on this day was a domestic rite, not the cult's primary observance. Fowler pp. 54–57: Same — old women (sacerdotes Liberi) with portable altars selling liba throughout the city; general public thronged in from the countryside. The toga virilis was a secondary domestic ceremony that happened to fall on the same day.
- **Issue**: The festivalDesc describes exclusively the toga virilis ceremony and ignores the actual cult of Liber Pater/Libera entirely. The toga virilis was a private family rite; the Liberalia's public, civic religious content (old women acting as priests, liba sales, sacrifice for any buyer, the vine/fertility character of Liber) is absent. The description inverts the relationship: the toga ceremony was performed on this day because it was the Liberalia, not the other way around.
- **Fix**: "Festividad de Liber Pater y Libera, antiguos dioses de la fertilidad y la viña. Viejas mujeres coronadas de hiedra, que actuaban como sacerdotisas de Liber, se colocaban por toda la ciudad con pequeños altares portátiles (foculi), vendiendo tortas de aceite y miel (liba) y ofreciendo sacrificio por cuenta de quien las comprara; el pueblo del campo acudía en masa. Era también el día ordinario para que los jóvenes asumieran la toga virilis: el muchacho sacrificaba ante los Lares domésticos, era conducido al Foro en procesión de familia y amigos, y realizaba un segundo sacrificio en el Capitolio a Liber o a Iuventas."
- **Priority**: HIGH (primary festival content entirely absent; replaced by a secondary domestic ceremony)

---

## WRONG_DEITY: Liberalia — Day 17

- **App**: key "2-17" | deity="Liber Pater / **Marte**" | deityDesc: "Dios del vino y de la guerra."
- **Source**: Scullard p. 91–93: Deities are Liber Pater, Libera, Lares (domestic), and Liber or Iuventus (Capitol sacrifice for toga ceremony). Mars appears only in the Agonalia rite, a purely priestly sacrifice by the Rex Sacrorum — not a public cult element of the day. Fowler p. 54–57: Deities are Liber (primary), Jupiter (Capitol sacrifice by boys), Iuventas. Mars listed only in connection with the Agonalia (known to priests, not the common people).
- **Issue**: Listing Mars as the second deity of the Liberalia misrepresents the day. Libera — Liber's female counterpart, explicitly named in the Fasti Caeretani — is the more appropriate secondary deity. Mars's role via the Agonalia was a priestly rite unknown to the general public; the Fasti universally use the popular name Liberalia, not Agonalia, because the Agonalia was one of four such priestly observances per year.
- **Fix**: `deity`: "Liber Pater / Libera", `deityDesc`: "Antiguo dios de la fertilidad y la viña, y su contraparte femenina."
- **Priority**: MEDIUM (Libera is more appropriate than Mars as the secondary deity; Mars belongs in a note about the Agonalia rite)

---

## MINOR: Argei Circuit — Days 16 and 17

- **App**: key "2-16" | festivalName="Itinerario de los Argei" | festivalDesc: "**Primera** procesión del año recorriendo las 27 antiguas capillas…" Key "2-17" has no mention of the Argei.
- **Source**: Scullard p. 91: "Itur ad Argeos — Day 16–17." Fowler p. 84–86 (Liberalia entry): "On this day and the previous day (March 16–17), some kind of procession 'went to the Argei.'"
- **Issue**: Both sources say the Argei circuit ran over both 16 and 17 March. The app mentions it only on Day 16 and makes no note on Day 17. Additionally, the sources differ on the count of shrines: Scullard says twenty-seven, Fowler says twenty-four. The app's "27" matches Scullard but contradicts Fowler; the discrepancy should be noted.
- **Fix**: Add a brief note to key "2-17"'s festivalDesc: "Continúa también hoy el circuito a las capillas de los Argei iniciado ayer (Fasti señalan 16–17 de marzo)." Note in "2-16": the number of sacella is disputed (Varrón/Escullard: 27; Fowler: 24).
- **Priority**: LOW (the day-range issue is minor; the count discrepancy is a source dispute)

---

## MINOR: Anna Perenna location — Day 15

- **App**: festivalDesc says "a orillas del Tíber"
- **Source**: Scullard p. 90: "in a grove near the Tiber at the first milestone on the Flaminian Way (near modern Porta del Popolo)." Fowler p. 50: "Campus Martius near the Via Flaminia (ad lapidem primum, near the present Porta del Popolo)."
- **Issue**: "On the banks of the Tiber" is imprecise; the location was at the first milestone on the Flaminian Way, in the Campo Marzio. The festival was near the Tiber but not described as riverside in either source; the venue was a grove or open meadow on the Flaminian road.
- **Fix**: Replace "a orillas del Tíber" with "en el primer miliario de la Vía Flaminia (Campo de Marte)."
- **Priority**: LOW

---

## MINOR: Matronalia ritual detail — Day 1

- **App**: key "2-1" | festivalDesc: "Original Año Nuevo del calendario de Rómulo. Comienzan las procesiones de los sacerdotes Salii y las esposas celebran la Matronalia."
- **Source**: Scullard p. 87: Husbands prayed for the health of their wives and gave them presents; wives entertained their slaves and served their food. Women worshipping at the temple of Juno Lucina had to unbind their hair and untie any knot in dress. Fowler p. 38: Same; gift-giving described as widespread (Plautus, Tibullus, Tertullian).
- **Issue**: The app's description of the Matronalia is a single vague clause. Key ritual elements documented in both sources are absent: the husband-to-wife gift-giving, the wives serving slaves, and the requirement to unbind all knots in clothing before entering the temple of Juno Lucina (a sympathetic magic rite for safe childbirth).
- **Fix**: Expand: "Las esposas recibían regalos de sus maridos y, a su vez, servían personalmente la comida a sus esclavos. Quienes acudían al templo de Juno Lucina (en el Esquilino) debían desatar el cabello y deshacer todo nudo del vestido, pues nada debía obstaculizar simbólicamente un parto feliz."
- **Priority**: LOW (the identification is correct; detail is missing, not wrong)

---

## MINOR: Q.R.C.F. status — Day 24

- **App**: key "2-24" | status='F' | statusFull="QRCF"
- **Source**: Scullard p. 95–96: F. Fowler pp. 63–64: "Fasti status: NP (IP in Vaticanus and Caeretani; Maffeiani and Praenestini give Q.REX.C.F.)."
- **Issue**: Scullard reads this day as F; Fowler reads most fasti as NP/IP. The app follows Scullard's F. This is a genuine scholarly dispute between sources; the app's choice is defensible.
- **Fix**: No change required, but the statusFull could note the variant: "QRCF (NP en algunos Fasti)."
- **Priority**: LOW (disputed between sources; app follows Scullard)

---

## Summary

**Finding counts**:
| Category | Count |
|---|---|
| WRONG_DEITY | 2 (Days 17, 19) |
| WRONG_RITUAL | 2 (Days 14, 17) |
| INVENTED_AITION | 1 (Day 15) |
| MISSING_FESTIVAL | 2 (Days 9, 14) |
| MINOR | 4 (Days 15 location, 16–17 Argei, 1 Matronalia, 24 status) |
| **Total** | **11** |

**Overall assessment**: The March data is structurally sound — the major festivals (Matronalia, Equirria, Anna Perenna, Liberalia, Quinquatrus, Tubilustrium, Q.R.C.F., Luna) are all present and placed on the correct days. However, the data has two systematic blind spots that affect multiple entries. First, the month's Martian character is consistently under-represented: the Quinquatrus is misattributed primarily to Minerva when both sources agree Mars is the primary deity; the Liberalia's secondary deity is listed as Mars (via the Agonalia) rather than Libera; and the second Salian procession on March 9 — one of only three calendar-marked Salian days — is entirely absent. Second, the festivalDesc for Day 17 (Liberalia) describes a secondary domestic ceremony (toga virilis) while omitting the festival's entire public religious content (old women selling liba, cult of Liber/Libera). The Anna Perenna entry's inclusion of Caesar's assassination is the most serious single inaccuracy: it introduces an historical coincidence as if it were part of the festival's significance, which neither source supports. The Mamuralia is a legitimate additional note for Day 14, warranted by the coverage both sources give it despite Fowler's caution about its late attestation. No entries are placed on wrong days, and no deities are completely fabricated; the errors are primarily about emphasis, completeness, and one case of invented historical framing.

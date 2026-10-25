# Roman December — App vs. Sources Review
**Date**: 2026-10-25
**Sources**: Scullard (1981) pp. 199–212; Fowler (1899) pp. 256–281
**App keys**: "11-1" through "11-31" in `utils/romanYearData.ts`

---

## WRONG_STATUS: Kalendae Decembris — Day 1

- **App**: key "11-1" | status=NP | statusFull="Kalendae" | festivalName="Kalendae" | deity="Juno"
- **Source**: Scullard p. 199 records "N (KAL. DEC.)" for December Kalendae. December is not among the months whose Kalendae carry NP status.
- **Issue**: App assigns NP; the Republican calendar marks December Kalendae as N (dies nefastus), not NP.
- **Fix**: `status: 'N'`, `statusFull: "Kalendae Decembris"`
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Neptuno et Pietati — Day 1

- **App**: key "11-1" | festivalName="Kalendae" — no temple anniversary noted
- **Source**: Scullard p. 199: dies natales of the temple of Neptune (restored by Cn. Domitius, consul 32 BC, sculptural group by Scopas; Neptune, Thetis, etc.) and the temple of Pietas (by the Circus Flaminius) both fell on 1 December. Fowler does not cover this entry separately.
- **Issue**: Two attested temple anniversaries on Dec 1 are entirely absent.
- **Fix**: Add to festivalDesc: "Aniversario de los templos de Neptuno (restaurado por Domicio, con grupo escultórico de Scopas) y Pietas (junto al Circo Flaminio)."
- **Priority**: LOW

---

## WRONG_RITUAL: Bona Dea — Day 3

- **App**: key "11-3" | status=NP | festivalName="Ritos de la Bona Dea" | festivalDesc includes "el vino estaban terminantemente prohibidos"
- **Source**: Scullard pp. 199–201: "wine (called 'milk') was offered to the goddess." Fowler p. 256: the rite is a sacrifice of a pig; wine was offered but called "milk" by euphemism (Macrobius). Neither source says wine was prohibited — the prohibition was on using the word "wine" (vinum), not on wine itself.
- **Issue**: The festivalDesc states wine was "terminantemente prohibido" (strictly forbidden), which is the opposite of what both sources state. Wine was the central offering, renamed "milk" by ritual convention.
- **Fix**: `festivalDesc`: remove the prohibition claim; add "Se ofrecía vino a la diosa, llamado 'leche' por convención ritual; los hombres eran excluidos y también se sacrificaba una cerda."
- **Priority**: HIGH

---

## WRONG_DEITY: Tiberinus et Gaia — Day 8

- **App**: key "11-8" | status=C | deity="Tiberinus" | festivalName="Tiberinalia" | festivalDesc="Se honraba el aniversario del Templo del Dios Tíber en la isla Tiberina."
- **Source**: Scullard pp. 202–203: "Tiberino et Gaiae — dies natalis." Two deities: Tiberinus and Gaia. The Tiber Island temple is Tiberinus's. Gaia is a separate figure linked to the same island site, with a possible theriomorphic origin (gaius = magpie). Fowler does not cover this day. The standard name in the Fasti is paired: both deities.
- **Issue**: App lists only Tiberinus; Gaia is completely omitted. The festivalName "Tiberinalia" is not an ancient name attested in the sources; Scullard uses "Tiberino et Gaiae (dies natalis)."
- **Fix**: `deity: "Tiberinus / Gaia"`, `festivalName: "Dies Natalis Tiberini et Gaiae"`, add Gaia to festivalDesc.
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Tribuni Plebis — Day 10

- **App**: key "11-10" | status=C | deity="Ninguna" | no festivalName
- **Source**: Scullard p. 203: "Tribuni plebis magistratum ineunt — Day 10 (IV ID. DEC.), noted in Praenestine Fasti." The tribunes of the plebs assumed office on 10 December, not 1 January — a significant civic calendar marker.
- **Issue**: This civic entry is entirely absent. While not a religious festival proper, it appears in the Praenestine Fasti and is relevant to the calendar.
- **Fix**: Add `festivalName: "Tribunicium Imperium (ingressus)"`, `festivalDesc: "Los tribunos de la plebe tomaban posesión de su cargo el 10 de diciembre, no el 1 de enero, según el calendario antiquísimo (Fasti Praenestini)."` No deity change needed.
- **Priority**: LOW

---

## MISSING_FESTIVAL: Consualia I (Aventine) — Day 12

- **App**: key "11-12" | status=EN | statusFull="Dies Endotercissus" | deity="Ninguna" | no festivalName
- **Source**: Scullard p. 204: "Consualia (December I) — dies natalis. Day 12 (PR. ID. DEC.), status EN (Ant. mai.). Deity: Consus. The temple of Consus on the Aventine had its dies natalis on 12 December." Fowler p. 268: "Conso in Aventino — Day 12, status EN (Amiternian)."
- **Issue**: The EN status is correctly captured, but the dies natalis of Consus on the Aventine — which is why the day is EN — is not recorded at all.
- **Fix**: Add `festivalName: "Consualia I (Aventino)"`, `festivalDesc: "Aniversario del templo de Consus en el Aventino (dies natalis). El propio Consus recibiría de nuevo honras el 15 de diciembre."`, `deity: "Consus"`, `deityDesc: "Dios custodio de los silos de grano."`

Suggested TypeScript entry:
```typescript
"11-12": {
    status: 'EN',
    statusFull: "Consualia I (Aventino)",
    deity: "Consus",
    deityDesc: "Dios custodio de los silos de grano.",
    festivalName: "Dies Natalis Consi (Aventino)",
    festivalDesc: "Aniversario del templo de Consus en el monte Aventino. El mismo dios sería honrado de nuevo el 15 de diciembre en la Consualia de invierno."
},
```
- **Priority**: MEDIUM

---

## WRONG_DEITY: Feriae Telluris / Lectisternium Cereris — Day 13

- **App**: key "11-13" | status=NP | statusFull="Idus" | deity="Tellus" | festivalName="Lectisternium a Ceres" | festivalDesc="Se ofrecían las primicias agrícolas a la deidad dispuesta en lechos ceremoniales..."
- **Source**: Scullard pp. 204–205: "Telluri et Cereri — dies natalis Telluris, lectisternium Cereris." The primary deity and cult focus is **Tellus** (temple in Carinae, vowed in 268 BC during battle with Picentes). The lectisternium is for **Ceres** (a secondary rite, the only annual public lectisternium in the Fasti, conducted by the aediles per Arnobius and Praenestine Fasti). Fowler does not separately treat this entry.
- **Issue**: The festivalName "Lectisternium a Ceres" makes Ceres the apparent primary deity, inverting the Tellus/Ceres relationship. The temple whose dies natalis this marks is Tellus's; the lectisternium is secondary, for Ceres. The festivalDesc also does not mention Tellus's temple in Carinae.
- **Fix**: `festivalName: "Feriae Telluris / Lectisternium Cereris"`, `festivalDesc: "Dies natalis del templo de Tellus en Carinae (prometido en 268 a.C. durante la batalla de los Picentes). Los ediles organizaban también el único lectisternium público anual en honor a Ceres (Arnobio; Fasti Praenestini)."`, `deity: "Tellus / Ceres"`.
- **Priority**: HIGH

---

## WRONG_RITUAL: Consualia de Invierno — Day 15

- **App**: key "11-15" | status=NP | festivalName="Consualia de Invierno" | festivalDesc="Se destapaba su altar del Circo Máximo. Los burros y mulas eran coronados en agradecimiento general agrario."
- **Source**: Scullard p. 205 (Consualia December II): "Feriae Conso per Praenestine Fasti." The Praenestine note records that **horses** and **mules** were crowned with flowers (equi et [muli floribus coronantur]). Fowler p. 268: "horses and mules were garlanded with flowers." Neither source mentions uncovering an altar in the Circus Maximus for the December Consualia; that feature belongs to the **August** Consualia (21 Aug — where the underground altar in the Circus Maximus was exposed). For December, the main attested ritual is the garlanding of horses and mules.
- **Issue 1**: "Los **burros** y mulas" — both sources say **equi et muli** (horses and mules), not donkeys (asini / burros). Donkeys with garlands appear in the Vestalia (bakers' asses), not the Consualia.
- **Issue 2**: "Se destapaba su altar del Circo Máximo" — the altar-uncovering rite is attested only for the August Consualia (21 Aug), not the December one.
- **Fix**: `festivalDesc: "Los caballos y mulas eran coronados con flores ('equi et muli floribus coronantur') en señal de agradecimiento. La festividad se enmarca en la revisión invernal de la cosecha almacenada, junto a la Saturnalia y la Opalia."` Remove altar-uncovering reference.
- **Priority**: HIGH

---

## MINOR: Lares Permarini dies natalis — Day 22

- **App**: key "11-22" | status=C | deity="Lares Permarini" | festivalName="Saturnalia" | festivalDesc="Celebración adicional cívica por la dedicación republicana del **altar** a los Lares Permarini."
- **Source**: Scullard p. 211: "Dies natalis of the **temple** of the Lares Permarini in the Campus Martius." Vowed 190 BC by L. Aemilius Regillus during naval battle vs. Antiochus; dedicated 179 BC by M. Aemilius Lepidus. A dedicatory inscription in Saturnian metre stood on its walls. Fowler does not cover this entry separately.
- **Issue 1**: festivalName shows "Saturnalia" when the actual event of Dec 22 is the dies natalis of the Lares Permarini temple. The Saturnalia was ongoing, but this day has its own specific commemorative identity.
- **Issue 2**: festivalDesc says "altar" but it is a **temple** (aedes), not an altar.
- **Fix**: `festivalName: "Dies Natalis Larum Permarinorum"`, `festivalDesc: "Aniversario del templo de los Lares Permarinos (protectores de los navegantes), prometido en 190 a.C. en batalla naval contra Antíoco el Grande y dedicado en 179 a.C. por M. Emilio Lépido en el Campo de Marte."` Saturnalia continuation can be noted parenthetically.
- **Priority**: MEDIUM

---

## WRONG_RITUAL: Larentalia — Day 23

- **App**: key "11-23" | status=NP | festivalName="Larentalia" | festivalDesc="Conclusión sombría de las Saturnales de diciembre con un rito mortuorio por los ancestros y la heroína nutricia romana en el Velabro."
- **Source**: Scullard pp. 211–212: Larentalia is a parentatio (funerary rite) at the tomb of Acca Larentia in the Velabrum; pontiffs and the flamen Quirinalis officiated. Scullard is explicit that the Larentalia is a puzzle precisely because it falls in December while the February Parentalia is the normal ancestor commemoration period — the two are historically distinct events. Fowler p. 275–276: similarly treats it as an independent public parentatio tied to Acca Larentia's tomb, not as the conclusion of Saturnalia.
- **Issue**: "Conclusión sombría de las Saturnales" is not supported by any source. Neither Scullard nor Fowler links the Larentalia to the ending of the Saturnalia; the two are independent ceremonies, and characterising the Larentalia as the Saturnalia's conclusion is invented framing. The Saturnalia extended 17–23 Dec (sometimes) but the Larentalia is its own ancestral rite with different officiants and location.
- **Fix**: `festivalDesc: "Parentatio pública en la tumba de Acca Larentia en el Velabro. Ofician los pontífices y el flamen Quirinalis. La Larentia fue nodriza de Rómulo (una tradición) o cortesana que legó su fortuna al pueblo romano (Praen.). Distinto de la Parentalia de febrero."` Remove "conclusión de las Saturnales."
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Dianae et Iunoni Reginae — Day 23

- **App**: key "11-23" — no mention of Diana or Juno Regina
- **Source**: Scullard p. 212: Dies natales of two temples dedicated by M. Aemilius Lepidus as censor in 179 BC — Diana's temple west of the Circus Flaminius and Juno Regina's temple in Campo / Circo Flaminio (both vowed during his campaign of 187 BC). Scenic Games (3 days for Juno, 2 for Diana, 1 circus day each) were funded by the Senate. Also on 23 Dec: a celebration of the Tempestates. Fowler does not separately treat this entry.
- **Issue**: Two temple anniversaries on Dec 23 are entirely absent from the app. Low attestation in Fowler but solid in Scullard.
- **Fix**: Expand festivalDesc of "11-23" or add parenthetical: "También el 23 de diciembre: aniversarios de los templos de Diana (junto al Circo Flaminio) y Juno Regina (in Campo), ambos dedicados en 179 a.C. por M. Emilio Lépido tras su campaña de 187 a.C."
- **Priority**: LOW

---

## WRONG_STATUS: Dies Natalis Solis Invicti — Day 25

- **App**: key "11-25" | status=NP | statusFull="Dies Nefastus Publicus" | festivalName="Dies Natalis Solis Invicti"
- **Source**: Scullard p. 212: "Bruma (winter solstice) / Sol Invictus — Day 25, **status C** (VI KAL. IAN.) — noted but the day had **no importance in the Republican civil calendar before the cult of Sol Invictus (AD 273/274)**." The Republican fasti show C for this day; the Sol Invictus festival is a late imperial addition (Aurelian's temple dedicated AD 274). The NP/dies nefastus publicus classification is anachronistic and incorrectly applies imperial-era importance to the Republican calendar framework used by the app.
- **Issue**: Status NP is wrong for the Republican calendar. The app's calendar framework is Republican; Dec 25 was C. The Sol Invictus festival (correctly attributed to Aurelian in the festivalDesc) should be noted as an imperial addition without overriding the Republican day-status.
- **Fix**: `status: 'C'`, `statusFull: "Dies Comitialis / Bruma"`, retain festivalName/Desc but add note that it is an imperial-era cult (the desc already mentions Aurelian — this is correct).
- **Priority**: MEDIUM

---

## MISSING_FESTIVAL: Sacrifice to Hercules and Ceres — Day 21

- **App**: key "11-21" — no mention of Hercules or Ceres
- **Source**: Scullard p. 210: "Also on this day [21 December]: a sacrifice of a pregnant sow, loaves/cakes (panes) and honey-wine drink (mulsum) to Hercules and Ceres — nothing else is known about this ceremony." Fowler does not cover this separately.
- **Issue**: The Dec 21 entry for Divalia/Angeronalia is present, but the secondary sacrifice to Hercules and Ceres (attested by Scullard, though details are sparse) is not noted.
- **Fix**: Add to "11-21" festivalDesc: "También el 21 de diciembre: sacrificio de una cerda gestante con panes y mulsum (vino con miel) a Hércules y Ceres (ritual de escasa documentación, Escullard p. 210)."
- **Priority**: LOW

---

## Summary

| Category | Count | Days affected |
|---|---|---|
| WRONG_STATUS | 2 | 1, 25 |
| WRONG_RITUAL | 3 | 3, 15, 23 |
| WRONG_DEITY | 2 | 8, 13 |
| MISSING_FESTIVAL | 5 | 1 (Neptune/Pietas), 10 (Tribuni), 12 (Consualia I), 23 (Diana/Juno), 21 (Hercules/Ceres) |
| MINOR | 1 | 22 (Lares Permarini name/altar) |
| **Total** | **13** | |

### HIGH priority (fix first)
1. Day 3 — Bona Dea: wine was offered, not prohibited
2. Day 13 — festivalName inverts Tellus/Ceres relationship; Tellus is the primary deity
3. Day 15 — "burros" → "caballos"; altar-uncovering belongs to August Consualia, not December
4. Day 23 — Larentalia is not the "conclusion of Saturnalia"

### MEDIUM priority
5. Day 1 — status should be N not NP
6. Day 8 — Gaia missing; festivalName "Tiberinalia" not attested
7. Day 12 — EN day has no festivalName for Consualia I on Aventine
8. Day 22 — festivalName "Saturnalia" obscures Lares Permarini dies natalis; "altar" → "templo"
9. Day 25 — status should be C not NP

### LOW priority
10. Day 1 — Neptune/Pietas temple anniversaries unrecorded
11. Day 10 — Tribuni plebis office assumption unrecorded
12. Day 21 — secondary Hercules/Ceres sacrifice unrecorded
13. Day 23 — Diana/Juno Regina temple anniversaries unrecorded

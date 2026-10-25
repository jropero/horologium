# Aprilis — Review: App vs. Scullard (1981) & Fowler (1899)
**Review date**: 2026-10-25
**Month index in app**: 3 (keys "3-1" through "3-30")
**Sources**:
- Scullard, H. H., *Festivals and Ceremonies of the Roman Republic* (1981), pp. 96–116
- Fowler, W. W., *The Roman Festivals of the Period of the Republic* (1899), pp. 77–109

---

## WRONG_DEITY: Veneralia / Day 1
- **App**: key "3-1" | status=F | festivalName="Veneralia" | deity="Venus Verticordia"
- **Source**: Scullard p. 96–97: cult had two distinct strata — humbler women (and prostitutes, brides, mothers) supplicated **Fortuna Virilis** in the men's baths; women of rank (*honestiores*) supplicated **Venus Verticordia**. Fowler pp. 67–69: follows Mommsen in restoring the Praenestine note as "honestiores Veneri Verticordiae, humiliores etiam in balineis … Fortunae Virili." Both sources name both deities; Fortuna Virilis is the older popular stratum, Venus the later upper-class addition (temple founded 114 BCE).
- **Issue**: App's deity field lists only "Venus Verticordia", silently dropping Fortuna Virilis, who is the primary deity of the popular/older rite.
- **Fix**: `deity: "Venus Verticordia / Fortuna Virilis"`, `deityDesc: "Venus, la que vuelve los corazones; y Fortuna Virilis, diosa de la buena suerte en las relaciones."`
- **Priority**: HIGH

---

## WRONG_RITUAL: Veneralia / Day 1
- **App**: key "3-1" | festivalDesc="Las mujeres bañaban ritualmente la estatua de Venus y rogaban que sus corazones se mantuvieran fieles hacia la virtud y el honor marital."
- **Source**: Scullard p. 96: the ritual bathing described by Ovid belongs to **Fortuna Virilis** (the statue of Fortuna was removed of ornaments, washed, and jewels restored; women offered incense on entering the baths). Venus Verticordia's rite was a separate, aristocratic supplication for concord and modest life — not a statue-bath. Fowler p. 68: confirms the same split. The bathing is Fortuna's rite, not Venus's.
- **Issue**: The festivalDesc attributes the statue-bath to Venus Verticordia. This conflates the two distinct cults. It also omits Fortuna Virilis entirely, erasing the popular/plebeian dimension of the festival.
- **Fix**: `festivalDesc: "Dos cultos distintos: las mujeres de rango rogaban a Venus Verticordia por la castidad y la virtud; las de condición más humilde y prostitutas, en los baños públicos de los hombres, suplicaban a Fortuna Virilis llevando coronas de mirto y ofreciendo incienso, para que ocultara sus defectos a los ojos masculinos."`
- **Priority**: HIGH

---

## WRONG_STATUS: Megalesia opening / Day 4
- **App**: key "3-4" | status=NP | festivalName="Megalesia"
- **Source**: Scullard p. 97: Fasti status **C** (comitiales). Fowler p. 69: Fasti status **C** (Maff.); the *ludi* ran 4–10 April, attested C.I.L. 314. Days holding public *ludi* were *dies comitiales* (C), not *nefasti publici* (NP).
- **Issue**: App marks day 4 as NP, but both sources give C. The same error likely propagates through days 5–9 (all shown NP in the app for Megalesia continuation).
- **Fix**: Day 4: `status: 'C'`. Days 5–9 (ludi continuation): `status: 'C'`. See also day 10 finding below.
- **Priority**: HIGH

---

## WRONG_STATUS: Fortuna Publica / Day 5
- **App**: key "3-5" | status=NP | festivalName="Megalesia / Templo de Fortuna"
- **Source**: Scullard p. 101: Fasti status **N** for the Fortuna Publica temple dedication anniversary. "On this day of old the temple of Fortuna Publica was dedicated on the hill of Quirinus" (Ovid, F.4.375). Fowler does not discuss day 5 specifically.
- **Issue**: App marks NP; Scullard gives N. Additionally, as a Megalesia ludi day it would be C — the dual note (ludi + temple anniv.) makes day 5 C at a minimum, not NP.
- **Fix**: `status: 'C'` (ludi day overrides; Fortuna temple anniversary noted in desc)
- **Priority**: MEDIUM

---

## WRONG_STATUS: Megalesia culmination / Day 10
- **App**: key "3-10" | status=NP | festivalName="Fin de Megalesia"
- **Source**: Scullard p. 101: entry for the culmination of Megalesia lists Fasti status **N** ("On the Palatine, Matri deum Magnae Idaeae"). Temple of Cybele on the Palatine dedicated 10 April 191 BCE. Fowler p. 69: the temple *dies natalis* was April 10 within the span of C ludi days.
- **Issue**: App marks day 10 NP; Scullard gives N. The great Games in the Circus on this day were the culmination, but the calendar marking for the day itself is N per Scullard.
- **Fix**: `status: 'N'`
- **Priority**: MEDIUM

---

## WRONG_DEITY: Cerialia final day / Day 19
- **App**: key "3-19" | status=NP | festivalName="Cerialia (Fin)" | deity="Ceres"
- **Source**: Scullard p. 102: temple of Ceres on the Aventine was dedicated to **Ceres, Liber, and Libera** (493 BCE). The rites, decorations, and foundational myth involve all three. Fowler p. 72: "Ceres, Liber, Libera (corresponding to Demeter, Dionysus, Persephone)" — deity triad given explicitly.
- **Issue**: App lists only "Ceres" as deity; both sources are explicit that the triad is Ceres + Liber + Libera. The temple, cult, and festival belong to all three.
- **Fix**: `deity: "Ceres, Liber, Libera"`, `deityDesc: "Diosa del cereal, dios del vino y diosa del mundo subterráneo."`
- **Priority**: HIGH

---

## WRONG_DEITY + WRONG_STATUS: Vinalia Priora / Day 23
- **App**: key "3-23" | status=NP | festivalName="Vinalia Priora" | deity="Venus / Júpiter"
- **Source (deity)**: Scullard p. 106: "Jupiter (primary, per Varro)"; Venus Erucina only secondarily, from 181 BCE when her temple outside the Colline Gate was dedicated. Fowler p. 85: "The Vinalia, then, both in April and August, was really and originally sacred to Jupiter." Both sources explicitly correct the Venus-first reading. Verrius (ap. Festus) and Varro confirm Jupiter's ownership.
- **Source (status)**: Scullard p. 106: Fasti status **F** (Ant. mai.). Fowler p. 85: **F** (Caer.); also FP in a second Caer. entry; NP in Maff. and Praen. The weight of the oldest calendars and the flamen Dialis's involvement (priest of Jupiter, not of Liber or Venus) support **F**.
- **Issue 1**: App lists "Venus / Júpiter" with Venus first, inverting the attested priority. Jupiter is primary throughout the Republic; Venus's association dates only from 181 BCE.
- **Issue 2**: App status NP. Primary calendars (Ant. mai., Caer.) give F; NP appears in Maff. and Praen. but the Flamen Dialis's participation in opening the vintage confirms F as the older and more authoritative marking.
- **Fix**: `deity: "Júpiter / Venus Erucina"`, `deityDesc: "Júpiter, señor del vino de este día; Venus Erucina, añadida desde el 181 a.C."`, `status: 'F'`
- **Priority**: HIGH (deity order), MEDIUM (status, due to genuine calendar ambiguity)

---

## WRONG_RITUAL: Robigalia / Day 25
- **App**: key "3-25" | status=NP | festivalName="Robigalia" | festivalDesc="El flamen Quirinalis sacrificaba un animal de pelaje rojo para apaciguar al dios/diosa del mildiu y rogar que no oxidara el trigo incipiente."
- **Source**: Scullard p. 131: the Flamen Quirinalis cast wine, incense, and the entrails of **a dog and a sheep** on to a sacrificial fire; Columella specifies the dog was a sucking puppy (*lacteus catulus*). Fowler p. 88: "victims were a dog and a sheep"; he records also the separate Porta Catularia tradition of reddish sucking whelps (*rufae canes*), but notes this is a distinct ritual, not necessarily on this fixed day.
- **Issue**: The app says "un animal de pelaje rojo" — one red animal. Both sources clearly state **two** victims (dog + sheep). The "red animal" description appears to conflate the main Robigalia sacrifice with the separate Porta Catularia dog-sacrifice tradition (rufae canes). The Flamen's victims were a dog and a sheep, not a single rufous animal.
- **Fix**: `festivalDesc: "El flamen Quirinalis lideraba una procesión hasta la quinta milla de la Vía Claudia, donde sacrificaba a Robigo un perro y una oveja, arrojando sus entrañas y vino e incienso al fuego, rogando que el mildiu no destruyera el trigo en ciernes."`
- **Priority**: HIGH

---

## MISSING_FESTIVAL: Feriae Latinae (moveable feast, usually April)
- **App**: No entry exists for this festival.
- **Source**: Scullard pp. 111–115: the Feriae Latinae were a moveable (*conceptivae*) feast, "normally held before the consuls departed for the campaign season in spring"; Scullard treats it under April as its typical month. Fowler pp. 95–97: same; "no fixed date; normally held in April in historical times." Both devote substantial discussion to it as one of the oldest surviving Latin festivals.
- **Issue**: The Feriae Latinae are completely absent from the app's April data. Because they are *conceptivae* (moveable, announced by the consuls at the start of the year), they cannot appear on a fixed calendar day. However, the app should document their existence — possibly in a special note on a representative day (e.g. mid-April) or in a dedicated structure for moveable feasts.
- **Fix (suggested approach)**: Add a non-day-locked note, or tag a representative day (April 16 is typically free and mid-month) with a secondary entry. Suggested content:

```typescript
// Feriae Latinae — moveable (conceptivae), usually April
// Note: not calendar-fixed; this day is only a representative placeholder.
"3-16": {
  status: 'N',
  statusFull: "Dies Nefastus",
  deity: "Júpiter Latiaris",
  deityDesc: "Júpiter de los Latinos, en el monte Albano.",
  festivalName: "Feriae Latinae (moveable)",
  festivalDesc: "Las Feriae Latinae eran una festividad móvil (conceptivae), anunciada por los cónsules al inicio de cada año. Todos los magistrados romanos y los delegados de las ciudades latinas se reunían en el monte Albano para sacrificar una novilla blanca sin yugo a Júpiter Latiaris y compartir su carne en un banquete sagrado que renovaba la Liga Latina. La libación era de leche, no de vino — señal de su antiquísimo origen pastoril.",
},
```
- **Priority**: MEDIUM (festival is genuine and prominent in sources; moveable nature complicates placement)

---

## MINOR: Ides / Jupiter / Day 13
- **App**: key "3-13" | status=NP | deity="Júpiter Victor" | festivalDesc="Dedicación del templo de Júpiter Victor. Continúan los Juegos de Ceres."
- **Source**: Scullard p. 102: the Ides of April honoured both **Jupiter Victor** (temple on the Palatine, vowed 295 BC) and **Jupiter Libertas** (temple on the Aventine). The Ides of every month involved the Flamen Dialis sacrificing the *ovis idulis* on the Capitol.
- **Issue**: App names only Jupiter Victor; the temple of Jupiter Libertas on the Aventine (also commemorated on this day) is absent. The monthly Ides rite (*ovis idulis*) is also unmentioned.
- **Fix**: `deity: "Júpiter Victor / Júpiter Libertas"`, add Flamen Dialis rite to desc.
- **Priority**: LOW

---

## MINOR: Fordicidia / Day 15
- **App**: key "3-15" | festivalDesc="Sacrificio de vacas preñadas a Tellus (Madre Tierra) para potenciar la fertilidad del suelo romano en primavera."
- **Source**: Scullard p. 102–103 and Fowler p. 71–72 both stress the ritual connection to the Parilia: the attendants of the senior Vestal Virgin tore unborn calves from the slaughtered mothers' wombs and burned them; the Vestals **kept the ashes** for mixing with the October Horse blood at the Parilia bonfires on April 21. Fowler: "The ashes link this rite directly to the Parilia." This is the cross-festival link that gives the Fordicidia its wider significance.
- **Issue**: App description is accurate as far as it goes, but omits the Vestal ash-keeping and the connection to the Parilia. This is the central ritual significance of the Fordicidia in the scholarly tradition.
- **Fix**: Add to festivalDesc: "Las Vestales guardaban las cenizas de los terneros no nacidos para mezclarlas con la sangre del Caballo de Octubre en las hogueras de la Parilia."
- **Priority**: LOW

---

## MINOR: Parilia / Day 21
- **App**: key "3-21" | festivalName="Parilia / Natalis Romae" | festivalDesc="Festival pastoral de purificación de los rebaños, considerado tradicionalmente como el aniversario de la fundación mítica de Roma (Dies Natalis)."
- **Source**: Both sources (Scullard pp. 103–106; Fowler pp. 79–84) describe two parallel celebrations: (1) the rustic rite (shepherds purifying flocks with sulphur smoke and leaping through bonfires); (2) the urban rite, in which the Vestals' *suffimen* — ashes of Fordicidia calves mixed with October Horse blood — was thrown on burning bean-straw on the Palatine, and Romans leapt through the resulting smoke. The Rex Sacrorum conducted the official rite. The connection back to Fordicidia (Apr. 15) and forward to the October Horse (Oct. 15) is the structural core of the agricultural calendar.
- **Issue**: App desc captures the pastoral and Foundation Day dimension but omits entirely the urban ceremony — the Vestal *suffimen*, the burning bean-straw, the leaping through fire. Fowler calls this "at once one of the oldest and best attested festivals of the whole year."
- **Fix**: Expand festivalDesc to include: "En la ciudad, las Vestales aportaban el *suffimen* —cenizas de la Fordicidia mezcladas con la sangre del Caballo de Octubre— que se arrojaba sobre haces de paja ardiente; hombres y mujeres saltaban tres veces las llamas purificadoras en el Palatino."
- **Priority**: LOW

---

## Summary

| Category | Count | Days affected |
|---|---|---|
| WRONG_DATE | 0 | — |
| WRONG_DEITY | 3 | 1 (Fortuna Virilis missing), 19 (Liber+Libera missing), 23 (Venus before Jupiter) |
| WRONG_STATUS | 4 | 4 (NP→C), 5 (NP→N or C), 10 (NP→N), 23 (NP vs F) |
| WRONG_RITUAL | 2 | 1 (bathing conflated to wrong deity), 25 (one red animal vs dog+sheep) |
| INVENTED_AITION | 0 | — |
| MISSING_FESTIVAL | 1 | Feriae Latinae (conceptivae, no fixed day) |
| MINOR | 3 | 13 (Jupiter Libertas omitted), 15 (Parilia ash link omitted), 21 (urban ceremony omitted) |

**Total findings**: 13

**Highest-priority issues**:
1. Day 1 Veneralia: Fortuna Virilis missing from deity + ritual description conflates the two cults (HIGH).
2. Day 4–9 Megalesia: status NP should be C throughout the ludi span (HIGH).
3. Day 19 Cerialia: Liber and Libera missing from deity triad (HIGH).
4. Day 23 Vinalia: Venus listed before Jupiter — inverts attested priority; status NP vs F (HIGH/MEDIUM).
5. Day 25 Robigalia: one "red animal" instead of dog + sheep — wrong ritual (HIGH).

**Key cross-festival structure missing from descriptions**: The Fordicidia (Apr. 15) → Parilia (Apr. 21) ash link is not reflected in either day's description, though it is one of the best-attested and most structurally important connections in the Roman religious calendar (Fowler, Scullard, and Ovid all emphasise it). The triple link Fordicidia ash + October Horse blood → Parilia fire is the backbone of the Roman spring agricultural cycle.

# Review: Metageitnion
Sources: Parke (1977), Deubner (1932)
Date: 2026-10-25

---

## Metageitnia — Day 7

**Parke**: Apollo Metageitnios attested; no day given. No Athenian ritual details survive. "Not treated as one of importance in our literary or inscriptional sources." The month name is the principal evidence. Name's derivation as "changing neighbours" is noted as peculiar; modern interpretation (neighbourhood festival) preferred but not certain. No aition narrative given. (Parke p. 51.)

**Deubner**: Apollon Metageitnios; day unknown. Connected to neighbourhood associations (metageitnion = change of neighbours). No aition given. (Deubner extract, apollon-artemis.md.)

**App** (day 7): `festivalName: "Metageitnia"`, deity "Apolo Metageitnios", description "Festival homónimo del mes. Sacrificio y banquete comunitario para fortalecer los lazos entre vecinos (metageitnion = cambio de vecindario)." Aition: "El nombre recuerda la migración mítica de los jonios desde Melite a Diomea, guiados por Apolo, que les enseñó a ser buenos vecinos en su nuevo hogar."

**Verdict**: WRONG_DAY | UNSOURCED_AITION | MISSING_DETAIL

**Issues**:
1. **Day**: Neither Parke nor Deubner assigns a day to this festival. Day 7 is unsupported. The day may have been chosen by analogy with Apollo's number, but no source licenses it for Metageitnion.
2. **Aition (invented)**: The Ionian migration narrative (Melite → Diomea, led by Apollo) does not appear in Parke or Deubner. Parke explicitly states that no aition narrative survives. This is embellishment, not attestation.
3. **"Banquete comunitario"**: Parke says "no Athenian ritual details survive." A sacrifice is reasonable as a default festival element, but a community feast is not attested. The description imports a social function that the sources do not support.

**Fix**:
- Remove the specific day or note it as uncertain (no ancient source fixes it).
- Strip the migration aition entirely; replace with: "El nombre derivaba de μετοίκησις (cambio de vecindad). Ninguna fuente ática transmite los ritos; el festival está atestiguado también en Mileto, Delos, Éfeso y Samos."
- Remove "banquete comunitario"; retain only "sacrificio" as a generic festival element.

---

## Herakleia en Kynosarges — Day 15

**Parke**: Day uncertain ("must have been the chief annual feast at Kynosarges" in Metageitnion, but no specific day given). Deity: Heracles (no epithet). The festival's central ritual was feasting, not athletic competition. Key features: (1) twelve Parasitoi chosen to guarantee the god's meal at table; (2) a distinctive bull-lifting rite — the animal was placed bodily on the altar to be throat-cut, rather than pole-axed; (3) a law of Alcibiades required the priest and Parasitoi to conduct a monthly sacrifice; Parasitoi were to be drawn from the nothoi (children of mixed Athenian/foreign marriages) and sons of the nothoi. The gymnasium at Kynosarges "specially open to residents of non-citizen birth." Parke notes that the lifting custom appears at other festivals, so it does not solely characterise Heracles' cult. (Parke pp. 51–52.)

**Deubner**: Herakleia Kynosargic (Diomeian) — Herakles — celebrated at Kynosarges, deme Diomeia. Decree of Alkibiades required monthly sacrifices by priest together with parasitoi of illegitimate birth (νόθοι). Shown in Metageitnion on Hagios Eleutherios calendar frieze. (Deubner extract, various-heroes-apaturia.md.)

**App** (day 15): `festivalName: "Herakleia en Kynosarges"`, deity "Heracles", description "Festival atlético celebrado en el gimnasio de Kynosarges, fuera de las murallas. Abierto a los nothoi (hijos ilegítimos) y metecos, a quienes normalmente se excluía." agonDesc: "Competiciones atléticas en el gimnasio de Kynosarges. Era el único festival donde los hijos ilegítimos podían competir oficialmente." Aition: "Kynosarges ('perro blanco') recibe su nombre porque un perro blanco robó la carne del sacrificio a Heracles. El Oráculo dictaminó que el lugar donde el perro la devorase sería sagrado."

**Verdict**: WRONG_DAY | WRONG_DEITY (wrong characterisation) | UNSOURCED_AITION | MISSING_DETAIL

**Issues**:
1. **Day**: Neither Parke nor Deubner assigns day 15. The day is unsupported.
2. **"Festival atlético" is wrong**: Parke characterises this as a feast festival; feasting is the prominent ritual element ("generally included feasting as a prominent element in the ritual"). There is no mention of athletic competitions in Parke or Deubner. The app inverts the character of the festival.
3. **"Metecos"**: Parke and Deubner specify nothoi (children of mixed Athenian/foreign-wife marriages), not metecos. Metecos were a different legal category. This is inaccurate.
4. **Bull-lifting absent**: The most distinctive ritual — lifting the bull bodily onto the altar for its throat to be cut — is entirely absent from the app description. This is the detail Parke gives most attention to (Theophrastus' Late Learner; "a number of references in classical literature").
5. **Parasitoi absent**: The twelve Parasitoi and the Alcibiades law are both absent. These are the only specific institutional details attested in the sources.
6. **Aition (the white-dog etymology)**: The story of a white dog stealing sacrificial meat and the Oracle sanctifying the spot is not in Parke or Deubner. It circulates in late sources (scholia and Harpocration on Kynosarges), but its absence from both primary references used here means it cannot be confirmed from these sources alone. Flag as not traceable to Parke 1977 or Deubner 1932.

**Fix**:
- Remove specific day or note as uncertain.
- Change "Festival atlético" to "Festival de sacrificio y banquete" or equivalent.
- Remove "metecos"; retain only "nothoi (hijos de matrimonios mixtos de ciudadano y extranjera)."
- Remove athletics agonDesc entirely, or reduce to a general note that the gymnasium was open to this class.
- Add the bull-lifting rite: "El animal no era sacrificado en el altar al modo habitual sino que los jóvenes lo alzaban en peso para que se le cortara la garganta directamente sobre el altar (Teofrasto, Caracteres)."
- Add the Parasitoi: "Doce Parasitoi seleccionados garantizaban la comida del dios en la mesa."
- If the white-dog aition is retained, cite it as onomastic tradition from later lexicographers (Harpocración), not from Parke or Deubner, and note it is separate from the festival ritual.

---

## Eleusinia — MISSING FESTIVAL

**Parke**: Not discussed for Metageitnion in the Parke extract provided.

**Deubner**: Metageitnion (most probable placement; start of Boedromion also possible). An agonistic festival distinct from the Eleusinian Mysteries — athletic and musical competitions; a pompe with kanephore; sacrifices to Hermes, Poseidon, Artemis, Triptolemos, and the Two Goddesses (Demeter and Kore); prizes of sacred barley from the Rarian Plain; held as both a penteteris and a trieteris. (Deubner extract, demeter-pt2.md.)

**App**: Not present.

**Verdict**: MISSING_FESTIVAL

**Fix**: Consider adding the Eleusinia as a second entry in Metageitnion (with a note that its placement is disputed: Metageitnion or early Boedromion). Suggested entry:

```
festivalName: "Eleusinia",
deity: "Deméter y Core",
description: "Festival agonístico bienal (penteteris) distinto de los Misterios. Competiciones atléticas y musicales, procesión con canéfora, sacrificios a Hermes, Poseidón, Ártemis, Triptólemo y las Dos Diosas. Los vencedores recibían cebada sagrada de la Llanura Raria.",
category: "Cívico y Patriótico"
```

Note: the day within Metageitnion is not fixed in the sources; if a specific day is required, it should be flagged as uncertain.

---

## Summary

| Festival | Day | Deity/Epithet | Description | Aition | Missing Details |
|---|---|---|---|---|---|
| Metageitnia | WRONG (unsourced) | OK | Partly wrong (banquete unsourced) | INVENTED | — |
| Herakleia en Kynosarges | WRONG (unsourced) | Wrong character (feast not athletics) | Wrong (athletic framing) | UNSOURCED (white-dog) | Bull-lifting, Parasitoi |
| Eleusinia | — | — | — | — | ENTIRE FESTIVAL MISSING |

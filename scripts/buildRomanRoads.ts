// Builds public/assets/roman-map/roads.json from the Itiner-e static dataset.
//
//   npx tsx scripts/buildRomanRoads.ts <path/to/itinere_roads.geojson>
//
// Source: de Soto, Pažout, Brughmans et al., "Itiner-e: a high-resolution dataset of
// roads of the Roman Empire", Scientific Data (2025), doi:10.1038/s41597-025-06140-z.
// Data: Itiner-e static version 2024 (v1.3), doi:10.5281/zenodo.17122148, CC BY 4.0.
// Field meanings follow the record's "Data field description.docx".
//
// Changes made here (the CC BY "indicate modifications" note in the app says
// "lineae simplificatae"): EPSG:3395 → WGS84, Douglas–Peucker simplification,
// coordinates rounded to 1e-4°, and the name/date normalisation documented below.
// Every one of the 14 769 segments is kept.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const input = process.argv[2];
if (!input) throw new Error('usage: npx tsx scripts/buildRomanRoads.ts <itinere_roads.geojson>');
const OUT = fileURLToPath(new URL('../public/assets/roman-map/roads.json', import.meta.url));

// ≈ 110 m, 0.7 px at the map's MAX_ZOOM; finer than the dataset's own accuracy
// (≤ 200 m in the plains for 'Certain', worse for 'Conjectured').
const SIMPLIFY_DEG = 0.001;
const QUANT = 1e4; // coordinates stored as integer 1e-4° deltas

interface Props {
  Name: string;
  Type: 'Main Road' | 'Secondary Road';
  Lower_Date: number; Low_Date_E: number; Upper_Date: number; Up_Date_E: number;
  Bibliograp: string | null;
  Cons_per_e: string | null;
  Itinerary: string | null;
  Segment_s: 'Certain' | 'Conjectured' | 'Hypothetical';
  Shape_Leng: number;
}
interface Feature { properties: Props; geometry: { type: 'MultiLineString'; coordinates: number[][][] } }

// --- EPSG:3395 (World Mercator, WGS84 ellipsoid) → lng/lat ---
const A = 6378137;
const E = 0.0818191908426215;
const toLngLat = (x: number, y: number): [number, number] => {
  const t = Math.exp(-y / A);
  let phi = Math.PI / 2 - 2 * Math.atan(t);
  for (let i = 0; i < 8; i++) {
    const es = E * Math.sin(phi);
    phi = Math.PI / 2 - 2 * Math.atan(t * ((1 - es) / (1 + es)) ** (E / 2));
  }
  return [(x / A) * 180 / Math.PI, phi * 180 / Math.PI];
};

const simplify = (pts: [number, number][], tol: number): [number, number][] => {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    let best = -1, bestD = tol * tol;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
      const d = (ax + t * dx - px) ** 2 + (ay + t * dy - py) ** 2;
      if (d > bestD) { bestD = d; best = i; }
    }
    if (best >= 0) { keep[best] = 1; stack.push([a, best], [best, b]); }
  }
  return pts.filter((_, i) => keep[i]);
};

// --- Names from the `Itinerary` field ---
// It mixes three things: Latin road names ("Via Appia", "Strata Diocletiana") → map
// labels; ancient itineraries and geographies → "Itineraria" in the info card; and
// modern road names ("Watling Street", "Limesweg", "Incense Road") → shown in the card
// only as nomina recentiora, never as a map label, and not translated.
const ROAD_NAME = /^(Via|Strata) /;
const ITINERARIUM = /^(Tabula Peutingeriana|Itinerarium |Stadiasmus Patarensis|Ravennatis|Procopius|Eusebius)/;
// Spelling variants of the same works in the dataset, unified to the standard Latin title.
const ITINERARIUM_FIX: Record<string, string> = {
  'Itinerarium Burdigalensee': 'Itinerarium Burdigalense',
  'Ravenna Cosmography': 'Ravennatis Anonymi Cosmographia',
  'Rauennatis Anonyimi Cosmographia': 'Ravennatis Anonymi Cosmographia',
  'Rauennatis Anonyimi Cosmograph': 'Ravennatis Anonymi Cosmographia',
};
// Road names keep the dataset's spelling, except a trailing route description
// ("Via Popillia Capua-Rhegium" is the Via Popillia between those two towns).
const ROAD_NAME_FIX: Record<string, string> = { 'Via Popillia Capua-Rhegium': 'Via Popillia' };

// --- Builders (`Cons_per_e`) → Latin nomenclature ---
// The dataset gives the emperor or magistrate in English. Persons get their standard
// Latin name (as in Kienast, Römische Kaisertabelle, and Broughton, MRR); names that
// are already Latin map to themselves. Period labels with no ancient Latin form
// ("Tetrarchy", "Ptolemaic", "Severan", "Julio-Claudian", "Late Republic"…) are not
// translated: such a segment shows only its dates.
const CONDITOR: Record<string, string> = {
  'Claudius': 'Claudius', 'Hadrian': 'Hadrianus', 'Trajan': 'Traianus', 'Caracalla': 'Caracalla',
  'Septimius Severus': 'Septimius Severus', 'Septimius Severus Caracalla': 'Septimius Severus, Caracalla', 'Augustus': 'Augustus', 'Manius Aquilius': 'Manius Aquillius',
  'Vespasian': 'Vespasianus', 'Vespasianus': 'Vespasianus', 'Maximinus Thrax': 'Maximinus Thrax',
  'Maximinus': 'Maximinus', 'Severus Alexander': 'Severus Alexander', 'Marcus Aurelius': 'Marcus Aurelius',
  'Domitian': 'Domitianus', 'Nero': 'Nero', 'Gnaeus Egnatius': 'Gnaeus Egnatius',
  'Philip the Arab': 'Philippus Arabs', 'Philipp the Arab': 'Philippus Arabs', 'Philip the Arabian': 'Philippus Arabs',
  'Geta': 'Geta', 'Nerva': 'Nerva', 'Publius Popillius Laenas': 'Publius Popillius Laenas',
  'Gordian III': 'Gordianus III', 'Titus': 'Titus', 'Constantine': 'Constantinus', 'Constantin': 'Constantinus',
  'Constantine I': 'Constantinus I', 'Constantine II': 'Constantinus II', 'Constantine the Great': 'Constantinus Magnus',
  'Decius': 'Decius', 'Lucius Cornelius Scipio Asiaticus': 'Lucius Cornelius Scipio Asiaticus',
  'Gaius Laelius': 'Gaius Laelius', 'Spurius Postumius Albinus Magnus': 'Spurius Postumius Albinus Magnus',
  'Antoninus Pius': 'Antoninus Pius', 'Drusus': 'Drusus', 'Carus': 'Carus', 'Carinus': 'Carinus',
  'Numerian': 'Numerianus', 'Pertinax': 'Pertinax', 'Macrinus': 'Macrinus', 'Diadumenianus': 'Diadumenianus',
  'Tiberius': 'Tiberius', 'Gnaeus Domitius Ahenobarbus': 'Gnaeus Domitius Ahenobarbus',
  'Elagabalus': 'Elagabalus', 'Elagabal': 'Elagabalus', 'Gaius Aurelius Cotta': 'Gaius Aurelius Cotta',
  'Appius Claudius Caecus': 'Appius Claudius Caecus', 'Marcus Aemilius Lepidus': 'Marcus Aemilius Lepidus',
  'Theodosius I': 'Theodosius I', 'Valerian': 'Valerianus', 'Valerianus': 'Valerianus',
  'Diocletian': 'Diocletianus', 'Maximian': 'Maximianus', 'Florian': 'Florianus', 'Postumus': 'Postumus',
  'Marcus Valerius Messalla': 'Marcus Valerius Messalla', 'Probus': 'Probus',
  'Marcus Aemilius Scaurus': 'Marcus Aemilius Scaurus', 'Trebonianus Gallus': 'Trebonianus Gallus',
  'Volusianus': 'Volusianus', 'Aurelian': 'Aurelianus', 'Commodus': 'Commodus', 'Galerius': 'Galerius',
  'Gaius Flaminius Nepos': 'Gaius Flaminius', 'Licinius': 'Licinius', 'Titus Annius Rufus': 'Titus Annius Rufus',
  'Lucius Caecilius Metellus Calvus': 'Lucius Caecilius Metellus Calvus',
  'Lucius Caecilius Metellus Diadematus': 'Lucius Caecilius Metellus Diadematus',
  'Julian': 'Iulianus', 'Jovian': 'Iovianus', 'Gallus': 'Gallus', 'Gallienus': 'Gallienus',
  'Lucius Verus': 'Lucius Verus', 'Julius Caesar': 'Gaius Iulius Caesar',
  'Marcus Valerius Maximus': 'Marcus Valerius Maximus', 'Titus Quintius Flaminius': 'Titus Quinctius Flamininus',
};

/** "Septimius Severus and Caracalla" → "Septimius Severus et Caracalla"; null if any part is unmapped. */
const latinConditor = (name: string): string | null => {
  const parts = name.split(/( and | or |-)/);
  const out: string[] = [];
  for (const p of parts) {
    if (p === ' and ') out.push(' et ');
    else if (p === ' or ') out.push(' vel ');
    else if (p === '-') out.push('–');
    else if (CONDITOR[p.trim()]) out.push(CONDITOR[p.trim()]);
    else return null;
  }
  return out.join('');
};

// Dataset errata, checked against the ancient sources.
const DATE_FIX: Record<string, string> = {
  // Via Aemilia: M. Aemilius Lepidus, consul 187 BCE (Livy 39.2.10). The dataset says CE.
  'Marcus Aemilius Lepidus (189-187 CE)': 'Marcus Aemilius Lepidus (189-187 BCE)',
  'Commodus (183-85 CE)': 'Commodus (183-185 CE)',
};

/** Parses "(46 CE)", "(129-126 BCE)", "(12 BCE-47 CE)", "(193-211/222-235 CE)" → [first, last] signed years. */
const parseYears = (paren: string): [number, number] | null => {
  const tokens = [...paren.matchAll(/(\d+)\s*(BCE|BC|CE)?/g)];
  if (!tokens.length) return null;
  const years: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    // A number without its own era takes the next era given ("129-126 BCE").
    const era = tokens.slice(i).find(t => t[2])?.[2] ?? 'CE';
    const n = Number(tokens[i][1]);
    years.push(era === 'CE' ? n : -n);
  }
  return [Math.min(...years), Math.max(...years)];
};

const UNKNOWN = 9999;
const known = (v: number) => v !== UNKNOWN;

// --- Build ---
const features: Feature[] = JSON.parse(readFileSync(input, 'utf8')).features;
const strings: string[] = [];
const stringIdx = new Map<string, number>();
const str = (s: string) => {
  let i = stringIdx.get(s);
  if (i === undefined) { i = strings.length; strings.push(s); stringIdx.set(s, i); }
  return i;
};

let points = 0, unmappedConditor = 0, dated = 0;
const roads = features.map(f => {
  const p = f.properties;
  const viae: number[] = [], itineraria: number[] = [], recentiora: number[] = [];
  for (const raw of (p.Itinerary ?? '').split(/[,?]/).map(s => s.trim()).filter(Boolean)) {
    if (ROAD_NAME.test(raw)) viae.push(str(ROAD_NAME_FIX[raw] ?? raw));
    else {
      const it = ITINERARIUM_FIX[raw] ?? raw;
      if (ITINERARIUM.test(it)) itineraria.push(str(it));
      else recentiora.push(str(raw));
    }
  }

  // Dating: Lower/Upper_Date (+ error margins) when given, else the start of the
  // Cons_per_e period. 9999 = unknown in this export (the docs say 0).
  const cons = p.Cons_per_e ? (DATE_FIX[p.Cons_per_e] ?? p.Cons_per_e) : null;
  const consMatch = cons?.match(/^(.*?)\s*(?:\((.*)\))?\s*$/);
  const consYears = consMatch?.[2] ? parseYears(consMatch[2]) : null;
  const conditor = consMatch ? latinConditor(consMatch[1]) : null;
  if (cons && !conditor) unmappedConditor++;
  let from: number | null = null, fromErr = 0;
  if (known(p.Lower_Date)) { from = p.Lower_Date; fromErr = known(p.Low_Date_E) ? p.Low_Date_E : 0; }
  else if (consYears) from = consYears[0];
  const to = known(p.Upper_Date) ? p.Upper_Date : null;
  const toErr = to !== null && known(p.Up_Date_E) ? p.Up_Date_E : 0;
  if (from !== null || to !== null) dated++;

  const coords: number[] = [];
  for (const line of f.geometry.coordinates) {
    const pts = simplify(line.map(([x, y]) => toLngLat(x, y)), SIMPLIFY_DEG);
    points += pts.length;
    // Parts are separated by a length prefix: [n, x0, y0, dx1, dy1, …].
    coords.push(pts.length);
    let px = 0, py = 0;
    pts.forEach(([lng, lat], i) => {
      const x = Math.round(lng * QUANT), y = Math.round(lat * QUANT);
      coords.push(i ? x - px : x, i ? y - py : y);
      px = x; py = y;
    });
  }

  return [
    p.Type === 'Main Road' ? 0 : 1,
    p.Segment_s === 'Certain' ? 0 : p.Segment_s === 'Conjectured' ? 1 : 2,
    from, fromErr, to, toErr,
    str(p.Name),
    viae, itineraria, recentiora,
    p.Bibliograp ? str(p.Bibliograp) : -1,
    conditor ? str(conditor) : -1,
    consYears && conditor ? consYears : null,
    Math.round(p.Shape_Leng),
    coords,
  ];
});

const out = {
  source: 'Itiner-e static version 2024 (de Soto, Pažout, Brughmans et al. 2025), doi:10.5281/zenodo.17122148, CC BY 4.0. Simplified by scripts/buildRomanRoads.ts.',
  fields: ['type', 'certainty', 'from', 'fromErr', 'to', 'toErr', 'segment', 'viae', 'itineraria', 'recentiora', 'fontes', 'conditor', 'conditorYears', 'lengthM', 'coords'],
  strings,
  roads,
};
const json = JSON.stringify(out);
writeFileSync(OUT, json);
console.log(`${roads.length} roads, ${points} points, ${dated} dated, ${unmappedConditor} builders left untranslated, ${(json.length / 1e6).toFixed(2)} MB → ${OUT}`);

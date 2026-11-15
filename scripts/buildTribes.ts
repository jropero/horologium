// Builds public/assets/roman-map/tribes.json from AWMC geodata.
//
//   npx tsx scripts/buildTribes.ts [path/to/regional_names_linework.geojson]
//
// If no path is given, fetches the source directly from AWMC GitHub.
//
// Source: Ancient World Mapping Center (AWMC), "AWMC Geodata",
// https://github.com/AWMC/geodata, Open Database License (ODbL).
// Derived from the Barrington Atlas of the Greek and Roman World (Talbert, 2000).
//
// Modifications made here: filtered to named region bounding boxes, Douglas–Peucker
// simplification at 0.001°, coordinates encoded as integer 1e-4° deltas.
// Each tribe is tagged with its region so the renderer can toggle layers independently.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const AWMC_URL =
  'https://raw.githubusercontent.com/AWMC/geodata/master/Cultural-Data/regional_name_linework/regional_names_linework.geojson';
const OUT = fileURLToPath(new URL('../public/assets/roman-map/tribes.json', import.meta.url));

// Named region bounding boxes. A feature is assigned to the first region whose bbox
// contains its centroid. Centroids are used (not bbox overlap) to avoid broad cultural
// labels like "Celts" spanning all of western Europe from polluting specific layers.
const REGIONS: {
  id: string;
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}[] = [
  // Iberian Peninsula
  { id: 'iberia', minLng: -10, maxLng: 5, minLat: 35.5, maxLat: 44.5 },
  // Gaul (Arverni, Aedui, Belgae, etc.)
  { id: 'gallia', minLng: -5, maxLng: 8, minLat: 43, maxLat: 51.5 },
  // Germania and surrounding tribal belt (Suebi, Cherusci, Marcomanni, etc.)
  { id: 'germania', minLng: 8, maxLng: 32, minLat: 46, maxLat: 60 },
];

const SIMPLIFY_DEG = 0.001; // ≈ 110 m, matches the roads layer
const QUANT = 1e4; // coordinates stored as integer 1e-4° deltas

interface Feature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: number[][][] };
}

const getName = (p: Record<string, unknown>): string =>
  typeof p['TITLE'] === 'string' ? (p['TITLE'] as string) : '';

/** Centroid of all points across all lines. */
const centroid = (coords: number[][][]): [number, number] => {
  let sx = 0,
    sy = 0,
    n = 0;
  for (const line of coords)
    for (const [x, y] of line) {
      sx += x;
      sy += y;
      n++;
    }
  return [sx / n, sy / n];
};

const regionOf = (cx: number, cy: number): string | null => {
  for (const r of REGIONS) {
    if (cx >= r.minLng && cx <= r.maxLng && cy >= r.minLat && cy <= r.maxLat) return r.id;
  }
  return null;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const simplify = (pts: [number, number][], tol: number): [number, number][] => {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = pts[a],
      [bx, by] = pts[b];
    const dx = bx - ax,
      dy = by - ay,
      len2 = dx * dx + dy * dy;
    let best = -1,
      bestD = tol * tol;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
      const d = (ax + t * dx - px) ** 2 + (ay + t * dy - py) ** 2;
      if (d > bestD) {
        bestD = d;
        best = i;
      }
    }
    if (best >= 0) {
      keep[best] = 1;
      stack.push([a, best], [best, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
};

// eslint-disable-next-line sonarjs/cognitive-complexity
async function main() {
  let raw: string;
  const localPath = process.argv[2];
  if (localPath) {
    console.log(`Reading ${localPath}`);
    raw = readFileSync(localPath, 'utf8');
  } else {
    console.log(`Fetching ${AWMC_URL}`);
    const res = await fetch(AWMC_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    raw = await res.text();
  }

  const all: Feature[] = JSON.parse(raw).features;
  console.log(`${all.length} total features in source`);

  // String table for name deduplication
  const strings: string[] = [];
  const stringIdx = new Map<string, number>();
  const str = (s: string) => {
    let i = stringIdx.get(s);
    if (i === undefined) {
      i = strings.length;
      strings.push(s);
      stringIdx.set(s, i);
    }
    return i;
  };

  const regionIds = REGIONS.map(r => r.id);
  const counts: Record<string, number> = Object.fromEntries(regionIds.map(id => [id, 0]));
  let points = 0;

  const tribes: (number | number[])[][] = [];
  for (const f of all) {
    if (f.geometry?.type !== 'MultiLineString') continue;
    const [cx, cy] = centroid(f.geometry.coordinates);
    const region = regionOf(cx, cy);
    if (!region) continue;

    const name = getName(f.properties);
    const regionIdx = regionIds.indexOf(region);
    counts[region]++;

    const coords: number[] = [];
    for (const line of f.geometry.coordinates) {
      const pts = simplify(line as [number, number][], SIMPLIFY_DEG);
      points += pts.length;
      // Format: [n, x0, y0, dx1, dy1, …]
      coords.push(pts.length);
      let px = 0,
        py = 0;
      pts.forEach(([lng, lat], i) => {
        const x = Math.round(lng * QUANT),
          y = Math.round(lat * QUANT);
        coords.push(i ? x - px : x, i ? y - py : y);
        px = x;
        py = y;
      });
    }
    tribes.push([str(name), regionIdx, coords]);
  }

  if (!tribes.length) {
    console.error('No features matched — check the source file and region bounding boxes.');
    process.exit(1);
  }

  for (const [id, count] of Object.entries(counts)) {
    console.log(`  ${id}: ${count} features`);
    const regionNames = strings.filter((_, si) =>
      tribes.some(t => t[0] === si && regionIds[t[1] as number] === id),
    );
    regionNames.forEach(n => console.log('    -', n));
  }

  const out = {
    source:
      'AWMC Geodata (Ancient World Mapping Center, awmc.unc.edu), derived from the Barrington Atlas of the Greek and Roman World (Talbert 2000). Open Database License (ODbL). Filtered by region and simplified by scripts/buildTribes.ts.',
    regions: regionIds,
    // fields: [name (string idx), region (region idx), coords (encoded)]
    fields: ['name', 'region', 'coords'],
    strings,
    tribes,
  };
  const json = JSON.stringify(out);
  writeFileSync(OUT, json);
  console.log(
    `${tribes.length} total tribes, ${points} points, ${(json.length / 1e3).toFixed(1)} KB → ${OUT}`,
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

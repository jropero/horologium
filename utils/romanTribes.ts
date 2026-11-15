// Tribal boundary overlay for the Roman map, from AWMC geodata (ODbL).
// Source: Ancient World Mapping Center, derived from the Barrington Atlas
// (Talbert 2000). Built by scripts/buildTribes.ts.

import { DATA_BASE } from './romanProvinces';

export interface Tribe {
  name: string;
  region: string; // 'iberia' | 'germania'
  parts: Float32Array[]; // interleaved [lng, lat, lng, lat, …]
  lngMid: number; // centroid for label placement
  latMid: number;
  lngMin: number;
  lngMax: number;
  latMin: number;
  latMax: number;
}

const QUANT = 1e4;

const decodeParts = (coords: number[]) => {
  const parts: Float32Array[] = [];
  let lngMin = Infinity,
    lngMax = -Infinity,
    latMin = Infinity,
    latMax = -Infinity;
  let sx = 0,
    sy = 0,
    n = 0;
  for (let i = 0; i < coords.length;) {
    const len = coords[i++];
    const part = new Float32Array(len * 2);
    let x = 0,
      y = 0;
    for (let k = 0; k < len; k++) {
      x += coords[i++];
      y += coords[i++];
      const lng = x / QUANT,
        lat = y / QUANT;
      part[2 * k] = lng;
      part[2 * k + 1] = lat;
      lngMin = Math.min(lngMin, lng);
      lngMax = Math.max(lngMax, lng);
      latMin = Math.min(latMin, lat);
      latMax = Math.max(latMax, lat);
      sx += lng;
      sy += lat;
      n++;
    }
    parts.push(part);
  }
  return { parts, lngMin, lngMax, latMin, latMax, lngMid: sx / n, latMid: sy / n };
};

const decode = (json: {
  strings: string[];
  regions: string[];
  tribes: [number, number, number[]][];
}): Tribe[] => {
  const { strings, regions } = json;
  return json.tribes.map(([nameIdx, regionIdx, coords]) => ({
    name: strings[nameIdx],
    region: regions[regionIdx],
    ...decodeParts(coords),
  }));
};

let cache: Tribe[] | null = null;
let pending: Promise<Tribe[]> | null = null;

/** Fetches tribes.json on first call; cached per session. */
export const loadRomanTribes = (): Promise<Tribe[]> => {
  if (cache !== null) return Promise.resolve(cache);
  if (pending !== null) return pending;
  pending = fetch(DATA_BASE + 'tribes.json')
    .then(res => {
      if (!res.ok) throw new Error(`tribes.json: HTTP ${res.status}`);
      return res.json();
    })
    .then(json => (cache = decode(json)))
    .finally(() => {
      pending = null;
    });
  return pending;
};

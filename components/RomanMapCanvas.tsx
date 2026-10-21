import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  getProvinceMeta,
  getRomanProvince,
  loadRomanMapData,
  RomanMapData,
} from "../utils/romanProvinces";
import {
  CREATURES,
  CREATURE_ART_PX,
  MapCreature,
  paintCreature,
} from "../utils/romanMapCreatures";
import {
  loadRomanRoads,
  roadExistence,
  RomanRoad,
} from "../utils/romanRoads";
import { KM_PER_ROMAN_MILE } from "../utils/romanProvinces";
import { toRoman } from "../utils/romanTimeUtils";
import { ROMAN_ROAD_LABELS as RL } from "../utils/civLabels";

/**
 * Canvas map of the Roman Empire (AD 117) shown in the ProvinciaInfo modal.
 * Plate carrée projection. The map wrapper keeps the geographic 55:35 aspect ratio and
 * is wider than a phone screen; its container scrolls horizontally with native
 * scrolling, while vertical pan (when zoomed) and zoom are handled here. The canvas
 * itself only covers the visible strip plus OVERSCAN on each side and is re-centred
 * when the scroll leaves that margin, so its cost doesn't grow with zoom. Layers
 * are fetched at runtime by loadRomanMapData() and turned into Path2D objects
 * once per session.
 */

interface RomanMapCanvasProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  onClose: () => void;
  /** Historical year when time-travelling (roads are filtered by it); undefined when live. */
  year?: number;
}

// Map window at zoom 1: 55° of longitude × 35° of latitude.
const LNG_MIN = -11;
const LNG_SPAN = 55;
const LAT_MAX = 58;
const LAT_SPAN = 35;
const INITIAL_LNG = 15; // scroll to the Mediterranean on open
const MIN_ZOOM = 1;
const MAX_ZOOM = 40;
const REGIO_ZOOM = 2; // below this, Italy gets one "Italia" label instead of 11 regiones
const CREATURE_ZOOM = 3; // mythological creatures exist only from this zoom on
const CREATURE_FADE = 0.6; // zoom range over which they fade from faint to full
/** On-screen creature size in px: grows a little with zoom. */
const creatureSize = (zoom: number) => 44 + 12 * (zoom - CREATURE_ZOOM);
const MIN_CITIES = 50; // cities shown at minimum zoom; all of them at MAX_ZOOM
const HIT_RADIUS = 16; // px, regardless of the drawn dot size
const CLICK_SLOP = 6; // px of pointer travel before a press stops counting as a tap
const MAX_CANVAS_PIXELS = 16_000_000; // iOS Safari refuses larger canvases
const OVERSCAN = 0.5; // canvas margin beyond the visible strip, per side, in viewport widths
const CELL_DEG = 1; // spatial-index cell size
const MAX_CITY_R = 5; // px; larger dots merge into blobs in dense regions
const MAX_CITY_FONT = 16; // px; city names stay smaller than province labels
const MAX_LABELS = 200; // per frame; collision avoidance usually stops well before
const DEDUPE_ZOOM = 3; // above this, a dot whose centre falls inside a drawn dot is skipped

/** Dot radius in px: grows with zoom, capped so neighbours stay distinct. */
const cityRadius = (zoom: number) => Math.min(MAX_CITY_R, 1.6 + 0.35 * zoom);

const SEA = "#3a6186";
const RIVER = "rgba(58,97,134,0.8)";
const FORTIFICATION = "rgba(196,120,24,0.95)";
const PROVINCE_LABEL = "rgba(122,84,24,0.8)";
const MARKER = "#d62828";
const ROAD = "#7a2618";

const ROAD_TILE_DEG = 5; // roads are grouped into tiles so only those near the strip are stroked
/** Douglas–Peucker tolerance in degrees per level of detail; 0 = as bundled (0.001°). */
const ROAD_LODS = [0.025, 0.008, 0.0025, 0];
const ROAD_HIT = 10; // px
const ROAD_LABEL_ZOOM = 2.5; // road names from this zoom on
const MAX_ROAD_LABELS = 40; // per frame
const ROAD_LABEL_SPACING = 360; // px of road between repeats of one name
const ROADS_KEY = "romanMapRoads"; // localStorage: the layer toggle

/** Coarsest level of detail whose tolerance stays under half a pixel at s px/°. */
const roadLod = (s: number) => {
  let i = 0;
  while (i < ROAD_LODS.length - 1 && ROAD_LODS[i] * s > 0.5) i++;
  return i;
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** Canvas height: most of the modal, capped; the width follows from the geographic ratio. */
const baseHeight = () => Math.round(Math.min(window.innerHeight * 0.82, 600));

interface City {
  latin: string;
  modern: string;
  fortress: boolean;
  lng: number;
  lat: number;
}

interface ProvinceLabel {
  text: string;
  lng: number;
  lat: number;
  regio: boolean;
  widthDeg: number; // province extent, to hide labels that would swamp a tiny province
}

interface Scene {
  provinces: Path2D[];
  lakes: Path2D;
  rivers: Path2D;
  fortifications: Path2D;
  labels: ProvinceLabel[];
  italia: { lng: number; lat: number } | null;
  cities: City[]; // most significant first
  /** Indices into `cities` per CELL_DEG cell, ascending (= by rank). */
  cityGrid: Int32Array[];
}

const GRID_COLS = Math.ceil(LNG_SPAN / CELL_DEG);
const GRID_ROWS = Math.ceil(LAT_SPAN / CELL_DEG);
const gridCol = (lng: number) =>
  clamp(Math.floor((lng - LNG_MIN) / CELL_DEG), 0, GRID_COLS - 1);
const gridRow = (lat: number) =>
  clamp(Math.floor((LAT_MAX - lat) / CELL_DEG), 0, GRID_ROWS - 1);

const buildCityGrid = (cities: City[]): Int32Array[] => {
  const cells: number[][] = Array.from(
    { length: GRID_COLS * GRID_ROWS },
    () => [],
  );
  cities.forEach((c, i) =>
    cells[gridRow(c.lat) * GRID_COLS + gridCol(c.lng)].push(i),
  );
  return cells.map((c) => Int32Array.from(c));
};

/**
 * Screen-space bucket grid for collision tests: rectangles for labels, centres for dots.
 * Built per frame; only the few cells a query touches are visited.
 */
class ScreenGrid {
  private cells = new Map<number, number[]>();
  constructor(private cell: number) {}
  private key = (cx: number, cy: number) => cx * 65536 + cy;
  private bucket(cx: number, cy: number) {
    const k = this.key(cx, cy);
    let b = this.cells.get(k);
    if (!b) this.cells.set(k, (b = []));
    return b;
  }
  /** True when the rect [x0,x1]×[y0,y1] intersects a stored rect. */
  hitsRect(x0: number, y0: number, x1: number, y1: number) {
    const c = this.cell;
    for (let cx = Math.floor(x0 / c); cx <= Math.floor(x1 / c); cx++)
      for (let cy = Math.floor(y0 / c); cy <= Math.floor(y1 / c); cy++) {
        const b = this.cells.get(this.key(cx, cy));
        if (!b) continue;
        for (let i = 0; i < b.length; i += 4)
          if (x0 < b[i + 2] && x1 > b[i] && y0 < b[i + 3] && y1 > b[i + 1])
            return true;
      }
    return false;
  }
  addRect(x0: number, y0: number, x1: number, y1: number) {
    const c = this.cell;
    for (let cx = Math.floor(x0 / c); cx <= Math.floor(x1 / c); cx++)
      for (let cy = Math.floor(y0 / c); cy <= Math.floor(y1 / c); cy++)
        this.bucket(cx, cy).push(x0, y0, x1, y1);
  }
  /** True when a stored point lies closer than `d` (≤ cell size) to (x, y). */
  hitsPoint(x: number, y: number, d: number) {
    const cx = Math.floor(x / this.cell),
      cy = Math.floor(y / this.cell);
    for (let i = cx - 1; i <= cx + 1; i++)
      for (let j = cy - 1; j <= cy + 1; j++) {
        const b = this.cells.get(this.key(i, j));
        if (!b) continue;
        for (let k = 0; k < b.length; k += 2)
          if ((b[k] - x) ** 2 + (b[k + 1] - y) ** 2 < d * d) return true;
      }
    return false;
  }
  addPoint(x: number, y: number) {
    this.bucket(Math.floor(x / this.cell), Math.floor(y / this.cell)).push(
      x,
      y,
    );
  }
}

// Famous cities pinned to the top of the ranking, matched by name near these coordinates.
const SEED_CITIES: [string, number, number][] = [
  ["Roma", 12.5, 41.9],
  ["Alexandria", 29.9, 31.2],
  ["Carthago", 10.3, 36.9],
  ["Antiochia", 36.2, 36.2],
  ["Byzantium", 29.0, 41.0],
  ["Athenae", 23.7, 38.0],
  ["Londinium", -0.1, 51.5],
  ["Lugdunum", 4.8, 45.8],
  ["Ephesos", 27.3, 37.9],
  ["Tarraco", 1.2, 41.1],
  ["Gades", -6.3, 36.5],
  ["Augusta Emerita", -6.3, 38.9],
  ["Massalia", 5.4, 43.3],
  ["Mediolanum", 9.2, 45.5],
  ["Aquileia", 13.4, 45.8],
  ["Augusta Treverorum", 6.6, 49.8],
  ["Eburacum", -1.1, 54.0],
  ["Sirmium", 19.6, 45.0],
  ["Thessalonica", 22.9, 40.6],
  ["Lepcis Magna", 14.3, 32.6],
  ["Syracusae", 15.3, 37.1],
  ["Caesarea", 34.9, 32.5],
  ["Damascus", 36.3, 33.5],
  ["Cyrene", 21.9, 32.8],
];

/**
 * Orders cities by significance: the seeds, then location accuracy (20 m first),
 * and within each accuracy tier by farthest-point sampling, so any prefix of the
 * list is spread evenly over the empire instead of clustering in one province.
 */
const rankCities = (places: RomanMapData["places"]): City[] => {
  const all = places.features
    .filter((f) => {
      const [lng, lat] = f.geometry.coordinates;
      return (
        f.properties.latin &&
        lng >= LNG_MIN &&
        lng <= LNG_MIN + LNG_SPAN &&
        lat <= LAT_MAX &&
        lat >= LAT_MAX - LAT_SPAN
      );
    })
    .map((f) => ({
      city: {
        latin: f.properties.latin!,
        modern: f.properties.modern,
        fortress: f.properties.type === "17",
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
      },
      accuracy: f.properties.accuracy,
    }));
  const used = new Uint8Array(all.length);
  const order: number[] = [];
  const take = (i: number) => {
    used[i] = 1;
    order.push(i);
  };
  const d2 = (i: number, j: number) => {
    const dx = all[i].city.lng - all[j].city.lng,
      dy = all[i].city.lat - all[j].city.lat;
    return dx * dx + dy * dy;
  };

  for (const [name, lng, lat] of SEED_CITIES) {
    const i = all.findIndex(
      (c, k) =>
        !used[k] &&
        c.city.latin === name &&
        Math.abs(c.city.lng - lng) < 2 &&
        Math.abs(c.city.lat - lat) < 2,
    );
    if (i >= 0) take(i);
  }

  const tiers = [...new Set(all.map((c) => c.accuracy))].sort((a, b) => a - b);
  for (const accuracy of tiers) {
    const tier = all
      .map((_, i) => i)
      .filter((i) => !used[i] && all[i].accuracy === accuracy);
    const minD = tier.map((i) =>
      order.reduce((m, j) => Math.min(m, d2(i, j)), Infinity),
    );
    for (let left = tier.length; left > 0; left--) {
      let best = -1;
      for (let k = 0; k < tier.length; k++)
        if (!used[tier[k]] && (best < 0 || minD[k] > minD[best])) best = k;
      const pick = tier[best];
      take(pick);
      for (let k = 0; k < tier.length; k++)
        if (!used[tier[k]]) minD[k] = Math.min(minD[k], d2(tier[k], pick));
    }
  }
  return order.map((i) => all[i].city);
};

const addRing = (path: Path2D, ring: [number, number][]) => {
  ring.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
  path.closePath();
};

const addLine = (path: Path2D, line: [number, number][]) => {
  line.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
};

/** Paths are built in degrees (x = lng, y = lat); draw() maps them with a canvas transform. */
const buildScene = (data: RomanMapData): Scene => {
  const provinces = data.provinces.features.map((f) => {
    const path = new Path2D();
    for (const polygon of f.geometry.coordinates)
      polygon.forEach((ring) => addRing(path, ring));
    return path;
  });
  const extent = new Map(
    data.provinces.features.map((f) => {
      let lo = Infinity,
        hi = -Infinity;
      for (const polygon of f.geometry.coordinates)
        for (const [lng] of polygon[0]) {
          lo = Math.min(lo, lng);
          hi = Math.max(hi, lng);
        }
      return [f.properties.name, hi - lo] as const;
    }),
  );

  const lakes = new Path2D();
  for (const f of data.lakes.features)
    f.geometry.coordinates.forEach((ring) => addRing(lakes, ring));
  const rivers = new Path2D();
  for (const f of data.rivers.features)
    f.geometry.coordinates.forEach((line) => addLine(rivers, line));
  const fortifications = new Path2D();
  for (const f of data.fortifications.features)
    addLine(fortifications, f.geometry.coordinates);

  const labels = data.labels.features.map((f) => {
    const geoName = f.properties.name;
    const regio = /^[IVX]+$/.test(geoName);
    return {
      text: (regio
        ? `Regio ${geoName}`
        : getProvinceMeta(geoName).name
      ).toUpperCase(),
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
      regio,
      widthDeg: extent.get(geoName) ?? 0,
    };
  });
  const regiones = labels.filter((l) => l.regio);
  const italia = regiones.length
    ? {
        lng: regiones.reduce((s, l) => s + l.lng, 0) / regiones.length,
        lat: regiones.reduce((s, l) => s + l.lat, 0) / regiones.length,
      }
    : null;

  const cities = rankCities(data.places);
  return {
    provinces,
    lakes,
    rivers,
    fortifications,
    labels,
    italia,
    cities,
    cityGrid: buildCityGrid(cities),
  };
};

// The data is cached in romanProvinces.ts; the derived paths are cached here so a reopen is instant.
let sceneCache: { data: RomanMapData["provinces"]; scene: Scene } | null = null;
const getScene = (data: RomanMapData) => {
  if (sceneCache?.data !== data.provinces)
    sceneCache = { data: data.provinces, scene: buildScene(data) };
  return sceneCache.scene;
};

// --- Roads ---

interface RoadTile {
  roads: number[];
  lngMin: number;
  lngMax: number;
  latMin: number;
  latMax: number;
}

/** Consecutive segments of one named via joined into a single line, for its label. */
interface RoadChain {
  name: string;
  pts: Float32Array; // [lng, lat, …]
  lngMin: number;
  lngMax: number;
  latMin: number;
  latMax: number;
}

interface RoadScene {
  roads: RomanRoad[];
  tiles: RoadTile[]; // each road belongs to the tile of its bbox centre; tile bboxes cover their roads
  lods: (Float32Array[] | undefined)[][]; // [level][road], filled lazily
  // Per year (null = live): 0 hidden, 1 shown, 2 shown faded (dataset gives no date).
  year: number | null | undefined;
  vis: Uint8Array;
  paths: Map<number, Path2D | null>; // per level × tile × style, built lazily
  chains: RoadChain[];
}

/** Style index: type (main first) × certainty × faded; drawn from the highest index down. */
const roadStyle = (r: RomanRoad, faded: boolean) =>
  r.type * 6 + r.certainty * 2 + (faded ? 1 : 0);
const ROAD_STYLES = 12;

const simplifyFlat = (pts: Float32Array, tol: number): Float32Array => {
  const n = pts.length / 2;
  if (n < 3) return pts;
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [0, n - 1];
  while (stack.length) {
    const b = stack.pop()!,
      a = stack.pop()!;
    const ax = pts[2 * a],
      ay = pts[2 * a + 1];
    const dx = pts[2 * b] - ax,
      dy = pts[2 * b + 1] - ay;
    const len2 = dx * dx + dy * dy;
    let best = -1,
      bestD = tol * tol;
    for (let i = a + 1; i < b; i++) {
      const px = pts[2 * i] - ax,
        py = pts[2 * i + 1] - ay;
      const t = len2 ? clamp((px * dx + py * dy) / len2, 0, 1) : 0;
      const d = (t * dx - px) ** 2 + (t * dy - py) ** 2;
      if (d > bestD) {
        bestD = d;
        best = i;
      }
    }
    if (best >= 0) stack.push(a, best, best, b);
  }
  const out = new Float32Array(keep.reduce((s, k) => s + k, 0) * 2);
  for (let i = 0, j = 0; i < n; i++)
    if (keep[i]) {
      out[j++] = pts[2 * i];
      out[j++] = pts[2 * i + 1];
    }
  return out;
};

const roadPoints = (scene: RoadScene, level: number, i: number) => {
  const road = scene.roads[i];
  if (!ROAD_LODS[level]) return road.parts;
  return (scene.lods[level][i] ??= road.parts.map((p) =>
    simplifyFlat(p, ROAD_LODS[level]),
  ));
};

const buildRoadScene = (roads: RomanRoad[]): RoadScene => {
  const byKey = new Map<number, RoadTile>();
  roads.forEach((r, i) => {
    const tx = Math.floor((r.lngMin + r.lngMax) / 2 / ROAD_TILE_DEG);
    const ty = Math.floor((r.latMin + r.latMax) / 2 / ROAD_TILE_DEG);
    const key = (tx + 100) * 1000 + ty + 100;
    let tile = byKey.get(key);
    if (!tile)
      byKey.set(
        key,
        (tile = {
          roads: [],
          lngMin: Infinity,
          lngMax: -Infinity,
          latMin: Infinity,
          latMax: -Infinity,
        }),
      );
    tile.roads.push(i);
    tile.lngMin = Math.min(tile.lngMin, r.lngMin);
    tile.lngMax = Math.max(tile.lngMax, r.lngMax);
    tile.latMin = Math.min(tile.latMin, r.latMin);
    tile.latMax = Math.max(tile.latMax, r.latMax);
  });
  return {
    roads,
    tiles: [...byKey.values()],
    lods: ROAD_LODS.map(() => []),
    year: undefined,
    vis: new Uint8Array(roads.length),
    paths: new Map(),
    chains: [],
  };
};

/** Joins the visible segments of each named via end to end (≈ 1 km snapping), for labels. */
const buildRoadChains = (scene: RoadScene): RoadChain[] => {
  const byName = new Map<string, Float32Array[]>();
  scene.roads.forEach((r, i) => {
    if (!scene.vis[i]) return;
    for (const name of r.viae) {
      let list = byName.get(name);
      if (!list) byName.set(name, (list = []));
      list.push(...roadPoints(scene, 2, i));
    }
  });
  const key = (x: number, y: number) =>
    `${Math.round(x * 100)},${Math.round(y * 100)}`;
  const chains: RoadChain[] = [];
  byName.forEach((segs, name) => {
    const ends = new Map<string, number[]>();
    segs.forEach((p, i) => {
      for (const k of [key(p[0], p[1]), key(p[p.length - 2], p[p.length - 1])])
        (ends.get(k) ?? ends.set(k, []).get(k)!).push(i);
    });
    const used = new Uint8Array(segs.length);
    /** Extends `line` (lng, lat pairs) at its end with unused segments sharing that end point. */
    const extend = (line: number[]) => {
      for (;;) {
        const k = key(line[line.length - 2], line[line.length - 1]);
        const next = ends.get(k)?.find((j) => !used[j]);
        if (next === undefined) return;
        used[next] = 1;
        const p = segs[next];
        const forward = key(p[0], p[1]) === k;
        const n = p.length / 2;
        for (let m = 1; m < n; m++) {
          const q = forward ? m : n - 1 - m;
          line.push(p[2 * q], p[2 * q + 1]);
        }
      }
    };
    const reverse = (line: number[]) => {
      const out: number[] = [];
      for (let m = line.length - 2; m >= 0; m -= 2) out.push(line[m], line[m + 1]);
      return out;
    };
    segs.forEach((p, i) => {
      if (used[i]) return;
      used[i] = 1;
      let line = Array.from(p);
      extend(line);
      line = reverse(line);
      extend(line);
      let lngMin = Infinity,
        lngMax = -Infinity,
        latMin = Infinity,
        latMax = -Infinity;
      for (let m = 0; m < line.length; m += 2) {
        lngMin = Math.min(lngMin, line[m]);
        lngMax = Math.max(lngMax, line[m]);
        latMin = Math.min(latMin, line[m + 1]);
        latMax = Math.max(latMax, line[m + 1]);
      }
      chains.push({
        name,
        pts: Float32Array.from(line),
        lngMin,
        lngMax,
        latMin,
        latMax,
      });
    });
  });
  // Longest first, so a long via claims its label room before a short side road.
  return chains.sort((a, b) => b.pts.length - a.pts.length);
};

/** Recomputes visibility, paths and label chains when the year changes. */
const setRoadYear = (scene: RoadScene, year: number | null) => {
  if (scene.year === year) return;
  scene.year = year;
  scene.roads.forEach((r, i) => {
    const e = year === null ? "yes" : roadExistence(r, year);
    scene.vis[i] = e === "no" ? 0 : e === "yes" ? 1 : 2;
  });
  scene.paths.clear();
  scene.chains = buildRoadChains(scene);
};

const getRoadPath = (
  scene: RoadScene,
  level: number,
  tile: number,
  style: number,
): Path2D | null => {
  const key = (level * scene.tiles.length + tile) * ROAD_STYLES + style;
  let path = scene.paths.get(key);
  if (path !== undefined) return path;
  path = null;
  for (const i of scene.tiles[tile].roads) {
    const v = scene.vis[i];
    if (!v || roadStyle(scene.roads[i], v === 2) !== style) continue;
    path ??= new Path2D();
    for (const part of roadPoints(scene, level, i)) {
      path.moveTo(part[0], part[1]);
      for (let k = 2; k < part.length; k += 2)
        path.lineTo(part[k], part[k + 1]);
    }
  }
  scene.paths.set(key, path);
  return path;
};

/** The visible road nearest to (lng, lat) within tolDeg, from the bundled geometry. */
const hitRoad = (
  scene: RoadScene,
  lng: number,
  lat: number,
  tolDeg: number,
): RomanRoad | null => {
  let best: RomanRoad | null = null;
  let bestD = tolDeg * tolDeg;
  const outside = (b: RoadTile | RomanRoad) =>
    lng < b.lngMin - tolDeg ||
    lng > b.lngMax + tolDeg ||
    lat < b.latMin - tolDeg ||
    lat > b.latMax + tolDeg;
  for (const tile of scene.tiles) {
    if (outside(tile)) continue;
    for (const i of tile.roads) {
      const road = scene.roads[i];
      if (!scene.vis[i] || outside(road)) continue;
      for (const p of road.parts)
        for (let k = 2; k < p.length; k += 2) {
          const ax = p[k - 2],
            ay = p[k - 1],
            dx = p[k] - ax,
            dy = p[k + 1] - ay;
          const len2 = dx * dx + dy * dy;
          const t = len2
            ? clamp(((lng - ax) * dx + (lat - ay) * dy) / len2, 0, 1)
            : 0;
          const d = (ax + t * dx - lng) ** 2 + (ay + t * dy - lat) ** 2;
          if (d < bestD) {
            bestD = d;
            best = road;
          }
        }
    }
  }
  return best;
};

let roadSceneCache: { roads: RomanRoad[]; scene: RoadScene } | null = null;
const getRoadScene = (roads: RomanRoad[]) => {
  if (roadSceneCache?.roads !== roads)
    roadSceneCache = { roads, scene: buildRoadScene(roads) };
  return roadSceneCache.scene;
};

/** Point and direction at arc length t along a screen polyline with cumulative lengths `cum`. */
const alongAt = (
  xs: Float32Array,
  ys: Float32Array,
  cum: Float32Array,
  t: number,
): [number, number, number] => {
  let lo = 0,
    hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= t) lo = mid;
    else hi = mid;
  }
  const seg = cum[hi] - cum[lo] || 1;
  const f = (t - cum[lo]) / seg;
  const dx = xs[hi] - xs[lo],
    dy = ys[hi] - ys[lo];
  return [xs[lo] + f * dx, ys[lo] + f * dy, Math.atan2(dy, dx)];
};

interface Glyph {
  ch: string;
  x: number;
  y: number;
  a: number; // rotation, radians
}

/**
 * Letters of a label centred at arc length t, upright (reversed on a westward line),
 * or null where the line bends more than ~30° between letters or leaves `bounds`.
 */
const placeAlong = (
  xs: Float32Array,
  ys: Float32Array,
  cum: Float32Array,
  t: number,
  chars: string[],
  ws: number[],
  tw: number,
  fontPx: number,
  [bx0, by0, bx1, by1]: [number, number, number, number],
): { glyphs: Glyph[]; box: [number, number, number, number] } | null => {
  const flip =
    alongAt(xs, ys, cum, t + tw / 2)[0] < alongAt(xs, ys, cum, t - tw / 2)[0];
  const glyphs: Glyph[] = [];
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  let off = 0;
  for (let i = 0; i < chars.length; i++) {
    const at = flip ? t + tw / 2 - off - ws[i] / 2 : t - tw / 2 + off + ws[i] / 2;
    off += ws[i];
    const [x, y, dir] = alongAt(xs, ys, cum, at);
    const a = flip ? dir + Math.PI : dir;
    if (i) {
      const turn = Math.abs(
        ((a - glyphs[i - 1].a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI,
      );
      if (turn > 0.5) return null;
    }
    if (x < bx0 || x > bx1 || y < by0 || y > by1) return null;
    x0 = Math.min(x0, x - fontPx / 2);
    x1 = Math.max(x1, x + fontPx / 2);
    y0 = Math.min(y0, y - fontPx / 2);
    y1 = Math.max(y1, y + fontPx / 2);
    glyphs.push({ ch: chars[i], x, y, a });
  }
  return { glyphs, box: [x0, y0, x1, y1] };
};

const savedRoadsOn = () => localStorage.getItem(ROADS_KEY) !== "0";

/** Visible city count grows geometrically from MIN_CITIES at zoom 1 to all at MAX_ZOOM. */
const visibleCityCount = (zoom: number, total: number) =>
  Math.min(
    total,
    Math.round(
      MIN_CITIES *
        Math.pow(total / MIN_CITIES, (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)),
    ),
  );

const readColors = () => {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;
  return {
    ink: v("--ink", "#1a1a1a"),
    parchment: v("--parchment", "#e3d6b3"),
    goldDim: v("--gold-dim", "#a09040"),
    goldLeaf: v("--gold-leaf", "#cfb53b"),
  };
};

type Status = "loading" | "ready" | "error";

type Selection =
  | { kind: "city"; city: City }
  | { kind: "creature"; creature: MapCreature }
  // A road card sits at the tapped point; `related` = indices of the other segments of the same via.
  | { kind: "road"; road: RomanRoad; related: number[]; lng: number; lat: number };
const selectionPoint = (s: Selection) =>
  s.kind === "city" ? s.city : s.kind === "creature" ? s.creature : s;

/** "ab anno 46 p. Chr. n. (fortasse iam ab anno 45 p. Chr. n.); usque ad annum …" */
const roadAetas = (r: RomanRoad) => {
  const out: string[] = [];
  if (r.from !== null)
    out.push(RL.from(r.from) + (r.fromErr ? ` (${RL.fromErr(r.from - r.fromErr)})` : ""));
  if (r.to !== null)
    out.push(RL.to(r.to) + (r.toErr ? ` (${RL.toErr(r.to + r.toErr)})` : ""));
  return out.length ? out.join("; ") : RL.aetasIgnota;
};

const roadLength = (m: number) => {
  const miles = Math.max(1, Math.round(m / 1000 / KM_PER_ROMAN_MILE));
  return `${toRoman(miles)} m. p. (${Math.max(1, Math.round(m / 1000))} km)`;
};

/** Info card of a tapped road segment: all text Latin, data values as Itiner-e gives them. */
// Range of the card's year slider: from before the Via Appia (312 BCE) past the latest
// end dates in the dataset (406, 725 CE). The slider runs on astronomical years
// (0 = 1 BCE) so it has no gap; the label shows historical years.
const SLIDER_MIN = -319;
const SLIDER_MAX = 750;
const toAstro = (y: number) => (y < 0 ? y + 1 : y);
const toHistorical = (v: number) => (v <= 0 ? v - 1 : v);

const RoadCard: React.FC<{
  road: RomanRoad;
  year: number | null;
  onYear: (year: number | null) => void;
  /** True while the card's slider, not the app's date, sets the year. */
  ownYear: boolean;
}> = ({ road, year, onYear, ownYear }) => {
  const rows: [string, string][] = [
    [RL.segment, road.segment.replace(/-/g, " – ")],
    [RL.typeLabel, RL.types[road.type]],
    [RL.certaintyLabel, RL.certainty[road.certainty]],
    [RL.aetas, roadAetas(road)],
  ];
  if (road.conditor)
    rows.push([
      RL.conditor,
      road.conditorYears
        ? `${road.conditor} (${RL.yearRange(road.conditorYears)})`
        : road.conditor,
    ]);
  rows.push([RL.longitudo, roadLength(road.lengthM)]);
  if (road.itineraria.length) rows.push([RL.itineraria, road.itineraria.join(", ")]);
  if (road.recentiora.length) rows.push([RL.recentiora, road.recentiora.join(", ")]);
  if (road.fontes) rows.push([RL.fontes, road.fontes]);
  const status = year === null ? null : roadExistence(road, year);
  return (
    <>
      <div className="font-serif text-lg font-bold text-gold-leaf leading-tight">
        {road.viae.length ? road.viae.join(" · ") : RL.unnamed}
      </div>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 font-body text-sm leading-snug">
        {rows.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt className="font-serif text-xs uppercase tracking-[0.12em] text-gold-dim/80 pt-0.5">
              {k}
            </dt>
            <dd className="text-parchment/85">{v}</dd>
          </React.Fragment>
        ))}
      </dl>

      <div className="mt-3 pt-2 border-t border-gold-dim/30">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-serif text-xs uppercase tracking-[0.12em] text-gold-dim/80">
            {RL.iterTemporum}
          </span>
          <span className="font-serif text-sm text-gold-leaf">
            {year === null ? RL.omnesViae : RL.latinYear(year)}
          </span>
        </div>
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={1}
          value={toAstro(clamp(year ?? SLIDER_MAX, toHistorical(SLIDER_MIN), SLIDER_MAX))}
          onChange={(e) => onYear(toHistorical(Number(e.target.value)))}
          aria-label={RL.annusViarum}
          aria-valuetext={year === null ? RL.omnesViae : RL.latinYear(year)}
          className="w-full mt-1 accent-[var(--gold-leaf)]"
          // A horizontal drag here moves the year, not the map's native scroll.
          style={{ touchAction: "none" }}
        />
        {year !== null && (
          <div className="font-body italic text-sm text-parchment/75 leading-snug">
            {status === "yes"
              ? RL.exstabat
              : status === "unknown"
                ? RL.incerta
                : road.from !== null && year < road.from - road.fromErr
                  ? RL.nondum
                  : RL.iamNon}
          </div>
        )}
        <div className="mt-2 flex gap-2">
          {road.from !== null && (
            <button
              type="button"
              onClick={() => onYear(road.from)}
              className="flex-1 font-serif text-xs uppercase tracking-[0.12em] px-2 py-1.5 rounded-sm border border-gold-leaf/60 text-gold-leaf hover:bg-gold-leaf/10"
            >
              {RL.adConditum}
            </button>
          )}
          {ownYear && (
            <button
              type="button"
              onClick={() => onYear(null)}
              className="flex-1 font-serif text-xs uppercase tracking-[0.12em] px-2 py-1.5 rounded-sm border border-gold-dim/50 text-parchment/70 hover:bg-gold-leaf/10"
            >
              {RL.redire}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const RomanMapCanvas: React.FC<RomanMapCanvasProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onClose,
  year,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<Scene | null>(null);
  const colorsRef = useRef(readColors());
  const baseHRef = useRef(baseHeight());
  const zoomRef = useRef(MIN_ZOOM);
  const panYRef = useRef(0); // px scrolled down from LAT_MAX (only non-zero when zoomed)
  const dprRef = useRef(1);
  const viewWRef = useRef(0); // container (viewport) width
  const canvasWRef = useRef(0); // canvas strip width, ≤ map width
  const originXRef = useRef(0); // map x of the canvas strip's left edge
  // City label widths per font px, indexed by city rank (NaN = not measured yet).
  const labelWidthsRef = useRef(new Map<number, Float32Array>());
  const frameRef = useRef<number | null>(null);
  const zoomFrameRef = useRef<number | null>(null);
  const pendingZoomRef = useRef<{ zoom: number; x: number; y: number } | null>(
    null,
  );
  const hitsRef = useRef<{ city: City; x: number; y: number }[]>([]);
  const creatureLayerRef = useRef<HTMLDivElement>(null);
  const creatureElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const creatureHitsRef = useRef<
    { creature: MapCreature; x: number; y: number; r: number }[]
  >([]);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef<{
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const userRef = useRef({ lat: latitude, lng: longitude });
  userRef.current = { lat: latitude, lng: longitude };
  // The road card's time slider overrides the app's date for the roads layer only.
  const [cardYear, setCardYear] = useState<number | null>(null);
  const roadsYear = cardYear ?? year ?? null;
  const yearRef = useRef(roadsYear);
  yearRef.current = roadsYear;
  const roadSceneRef = useRef<RoadScene | null>(null);
  // Road-name glyph widths per font (cleared with the city label widths when fonts load).
  const glyphWidthsRef = useRef(new Map<string, Map<string, number>>());

  const [status, setStatus] = useState<Status>("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM); // mirrors zoomRef for the zoom buttons
  const [selected, setSelected] = useState<Selection | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const [roadsOn, setRoadsOn] = useState(savedRoadsOn);
  const roadsOnRef = useRef(roadsOn);
  roadsOnRef.current = roadsOn;
  const [roadStatus, setRoadStatus] = useState<Status>("loading");
  const [roadAttempt, setRoadAttempt] = useState(0);

  const scale = () => (baseHRef.current / LAT_SPAN) * zoomRef.current; // px per degree
  const canvasSize = () => ({
    w: Math.round(LNG_SPAN * scale()),
    h: baseHRef.current,
  });

  /** Where the canvas strip should start (map px) so the visible part sits in its middle. */
  const desiredOrigin = () => {
    const container = containerRef.current;
    if (!container) return 0;
    const { w } = canvasSize();
    const vw = viewWRef.current;
    const margin = Math.max(0, (vw - w) / 2); // the wrapper is centred when narrower
    return Math.round(
      clamp(
        container.scrollLeft - margin - OVERSCAN * vw,
        0,
        w - canvasWRef.current,
      ),
    );
  };

  const draw = useCallback(() => {
    frameRef.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = canvasSize();
    const cw = canvasWRef.current;
    const s = scale();
    const z = zoomRef.current;
    const panY = panYRef.current;
    const dpr = dprRef.current;
    const colors = colorsRef.current;
    // Everything below is in map px (the wrapper's coordinates); the canvas
    // transform shifts by the strip origin.
    const ox = desiredOrigin();
    if (ox !== originXRef.current || !canvas.style.transform) {
      originXRef.current = ox;
      canvas.style.transform = `translateX(${ox}px)`;
    }
    const xOf = (lng: number) => (lng - LNG_MIN) * s;
    const yOf = (lat: number) => (LAT_MAX - lat) * s - panY;

    // 1. Sea.
    ctx.setTransform(dpr, 0, 0, dpr, -dpr * ox, 0);
    ctx.fillStyle = SEA;
    ctx.fillRect(ox, 0, cw, h);

    const scene = sceneRef.current;
    const hits: { city: City; x: number; y: number }[] = [];
    if (scene) {
      // Geographic layers in degree space; line widths and dashes are divided by s to stay in px.
      ctx.setTransform(
        dpr * s,
        0,
        0,
        -dpr * s,
        -dpr * (s * LNG_MIN + ox),
        dpr * (LAT_MAX * s - panY),
      );
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // 2. Land.
      ctx.fillStyle = colors.parchment;
      for (const p of scene.provinces) ctx.fill(p, "evenodd");
      // 3. Lakes.
      ctx.fillStyle = SEA;
      ctx.fill(scene.lakes, "evenodd");
      // 4. Rivers.
      ctx.strokeStyle = RIVER;
      ctx.lineWidth = (0.5 + 0.2 * z) / s;
      ctx.stroke(scene.rivers);
      // 5. Fortifications.
      ctx.strokeStyle = FORTIFICATION;
      ctx.lineWidth = 1.5 / s;
      ctx.setLineDash([4 / s, 3 / s]);
      ctx.stroke(scene.fortifications);
      ctx.setLineDash([]);
      // 6. Province borders.
      ctx.strokeStyle = colors.goldDim;
      ctx.lineWidth = 0.9 / s;
      for (const p of scene.provinces) ctx.stroke(p);

      // 6b. Roads: only the tiles that reach the canvas strip, at the coarsest level
      // of detail that stays sub-pixel. Main roads are wider, hypothetical ones dotted,
      // conjectured ones lighter; when time-travelling, undated roads are faded.
      const roadScene = roadsOnRef.current ? roadSceneRef.current : null;
      const viewLng0 = ox / s + LNG_MIN,
        viewLng1 = (ox + cw) / s + LNG_MIN;
      const viewLatTop = LAT_MAX - panY / s,
        viewLatBottom = LAT_MAX - (panY + h) / s;
      if (roadScene) {
        setRoadYear(roadScene, yearRef.current);
        const level = roadLod(s);
        const tiles: number[] = [];
        roadScene.tiles.forEach((t, i) => {
          if (
            t.lngMax >= viewLng0 &&
            t.lngMin <= viewLng1 &&
            t.latMax >= viewLatBottom &&
            t.latMin <= viewLatTop
          )
            tiles.push(i);
        });
        ctx.strokeStyle = ROAD;
        // Secondary roads are a dense web at the widest view; they come in as you zoom.
        const minorAlpha = clamp(0.4 + 0.3 * (z - 1), 0.4, 1);
        for (let style = ROAD_STYLES - 1; style >= 0; style--) {
          const main = style < 6,
            certainty = Math.floor(style / 2) % 3,
            faded = style % 2 === 1;
          const width = main
            ? Math.min(3, 1 + 0.15 * z)
            : Math.min(1.8, 0.5 + 0.08 * z);
          ctx.globalAlpha =
            [0.95, 0.75, 0.75][certainty] *
            (main ? 1 : minorAlpha) *
            (faded ? 0.35 : 1);
          ctx.lineWidth = width / s;
          ctx.setLineDash(
            certainty === 2 ? [0.01 / s, (width + 2.5) / s] : [],
          );
          for (const t of tiles) {
            const path = getRoadPath(roadScene, level, t, style);
            if (path) ctx.stroke(path);
          }
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        const sel = selectedRef.current;
        if (sel?.kind === "road") {
          ctx.strokeStyle = colors.goldLeaf;
          const strokeRoad = (r: RomanRoad) => {
            ctx.beginPath();
            for (const p of r.parts) {
              ctx.moveTo(p[0], p[1]);
              for (let k = 2; k < p.length; k += 2) ctx.lineTo(p[k], p[k + 1]);
            }
            ctx.stroke();
          };
          ctx.globalAlpha = 0.6;
          ctx.lineWidth = 2.5 / s;
          for (const i of sel.related)
            if (roadScene.vis[i]) strokeRoad(roadScene.roads[i]);
          ctx.globalAlpha = 1;
          ctx.lineWidth = 4 / s;
          strokeRoad(sel.road);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, -dpr * ox, 0);
      // Canvas strip bounds in map px, widened by the tap radius.
      const xMin = ox - HIT_RADIUS,
        xMax = ox + cw + HIT_RADIUS;

      // 7. Province labels.
      const fontPx = Math.round(Math.min(18, 9 + 3 * (z - 1)));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = PROVINCE_LABEL;
      for (const l of scene.labels) {
        if (l.regio && z < REGIO_ZOOM) continue;
        const x = xOf(l.lng);
        if (x < ox - 400 || x > ox + cw + 400) continue; // wider than any label
        ctx.font = `${
          l.regio ? Math.round(fontPx * 0.8) : fontPx
        }px Cinzel, serif`;
        if (z < 3 && l.widthDeg * s < ctx.measureText(l.text).width * 0.5)
          continue;
        ctx.fillText(l.text, x, yOf(l.lat));
      }
      if (z < REGIO_ZOOM && scene.italia) {
        ctx.font = `${fontPx}px Cinzel, serif`;
        ctx.fillText("ITALIA", xOf(scene.italia.lng), yOf(scene.italia.lat));
      }

      // 8. Cities: filled circles for towns, hollow squares for legionary fortresses.
      // The spatial index yields only the ranked-in cities near the strip, in rank order.
      const n = visibleCityCount(z, scene.cities.length);
      const r = cityRadius(z);
      const lng0 = xMin / s + LNG_MIN,
        lng1 = xMax / s + LNG_MIN;
      const latTop = LAT_MAX - (panY - HIT_RADIUS) / s,
        latBottom = LAT_MAX - (panY + h + HIT_RADIUS) / s;
      const candidates: number[] = [];
      for (let row = gridRow(latTop); row <= gridRow(latBottom); row++)
        for (let col = gridCol(lng0); col <= gridCol(lng1); col++) {
          const cell = scene.cityGrid[row * GRID_COLS + col];
          for (let k = 0; k < cell.length && cell[k] < n; k++)
            candidates.push(cell[k]);
        }
      candidates.sort((a, b) => a - b);

      // Close in, a lower-ranked dot whose centre falls inside a drawn dot is skipped
      // (and so not tappable) until a closer zoom separates them; at MAX_ZOOM every city shows.
      const dedupe = z > DEDUPE_ZOOM && z < MAX_ZOOM;
      const dots = new ScreenGrid(Math.max(1, r));
      const ranks: number[] = [];
      const towns = new Path2D();
      const forts = new Path2D();
      for (const i of candidates) {
        const city = scene.cities[i];
        const x = xOf(city.lng),
          y = yOf(city.lat);
        if (x < xMin || x > xMax || y < -HIT_RADIUS || y > h + HIT_RADIUS)
          continue;
        if (dedupe) {
          if (dots.hitsPoint(x, y, r)) continue;
          dots.addPoint(x, y);
        }
        hits.push({ city, x, y });
        ranks.push(i);
        if (city.fortress) forts.rect(x - r, y - r, r * 2, r * 2);
        else {
          towns.moveTo(x + r, y);
          towns.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = colors.ink;
      ctx.fill(towns);
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1.2;
      ctx.stroke(forts);

      // Names for the most significant visible cities, with a parchment halo. Each
      // name tries above, right, left, then below its dot and is dropped if all
      // four would overlap a name already placed.
      const named = Math.min(hits.length, Math.round(16 * z * z));
      const cityFont = Math.round(Math.min(MAX_CITY_FONT, 9 + z));
      ctx.font = `${cityFont}px Cinzel, serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 3;
      ctx.strokeStyle = colors.parchment;
      ctx.fillStyle = colors.ink;
      let widths = labelWidthsRef.current.get(cityFont);
      if (!widths) {
        widths = new Float32Array(scene.cities.length).fill(NaN);
        labelWidthsRef.current.set(cityFont, widths);
      }
      const placed = new ScreenGrid(64);
      const half = cityFont / 2;
      const gap = r + 2;
      for (let k = 0, shown = 0; k < named && shown < MAX_LABELS; k++) {
        const { city, x, y } = hits[k];
        const rank = ranks[k];
        let tw = widths[rank];
        if (Number.isNaN(tw))
          tw = widths[rank] = ctx.measureText(city.latin).width;
        const spots = [
          [x - tw / 2, y - gap - half],
          [x + gap + 1, y],
          [x - gap - 1 - tw, y],
          [x - tw / 2, y + gap + half],
        ];
        for (const [lx, cy] of spots) {
          const x0 = lx - 2,
            y0 = cy - half - 1,
            x1 = lx + tw + 2,
            y1 = cy + half + 1;
          if (placed.hitsRect(x0, y0, x1, y1)) continue;
          placed.addRect(x0, y0, x1, y1);
          ctx.strokeText(city.latin, lx, cy);
          ctx.fillText(city.latin, lx, cy);
          shown++;
          break;
        }
      }

      // 8b. Road names, letter by letter along the line, upright, after the city names
      // and kept off them. A name repeats every ROAD_LABEL_SPACING px of its via and is
      // skipped where the road bends too sharply or leaves the strip.
      if (roadScene && z >= ROAD_LABEL_ZOOM) {
        const fontPx = Math.round(clamp(9 + z, 12, 15)); // never under 12 px
        const font = `italic ${fontPx}px "IM Fell English", serif`;
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let glyphW = glyphWidthsRef.current.get(font);
        if (!glyphW) glyphWidthsRef.current.set(font, (glyphW = new Map()));
        const widthOf = (ch: string) => {
          let w = glyphW!.get(ch);
          if (w === undefined) glyphW!.set(ch, (w = ctx.measureText(ch).width));
          return w;
        };
        const glyphs: Glyph[] = [];
        let labelled = 0;
        for (const chain of roadScene.chains) {
          if (labelled >= MAX_ROAD_LABELS) break;
          if (
            chain.lngMax < viewLng0 ||
            chain.lngMin > viewLng1 ||
            chain.latMax < viewLatBottom ||
            chain.latMin > viewLatTop
          )
            continue;
          const chars = [...chain.name];
          const ws = chars.map(widthOf);
          const tw = ws.reduce((a, b) => a + b, 0);
          const n = chain.pts.length / 2;
          const xs = new Float32Array(n),
            ys = new Float32Array(n),
            cum = new Float32Array(n);
          for (let k = 0; k < n; k++) {
            xs[k] = xOf(chain.pts[2 * k]);
            ys[k] = yOf(chain.pts[2 * k + 1]);
            if (k)
              cum[k] =
                cum[k - 1] + Math.hypot(xs[k] - xs[k - 1], ys[k] - ys[k - 1]);
          }
          const total = cum[n - 1];
          if (total < tw + 2 * fontPx) continue;
          const count = Math.max(
            1,
            Math.floor(total / Math.max(ROAD_LABEL_SPACING, 2 * tw)),
          );
          // One label per slot of the line: its middle first, then positions stepping
          // outwards (past a bend, a city name or the strip edge) while it fits the slot.
          const step = Math.max(tw / 2, 40);
          for (let c = 0; c < count && labelled < MAX_ROAD_LABELS; c++) {
            const slot0 = (c * total) / count,
              slot1 = ((c + 1) * total) / count;
            for (const k of [0, 1, -1, 2, -2, 3, -3]) {
              const t = (slot0 + slot1) / 2 + k * step;
              if (t - tw / 2 < slot0 || t + tw / 2 > slot1) continue;
              const label = placeAlong(xs, ys, cum, t, chars, ws, tw, fontPx, [
                ox,
                0,
                ox + cw,
                h,
              ]);
              if (!label || placed.hitsRect(...label.box)) continue;
              placed.addRect(...label.box);
              glyphs.push(...label.glyphs);
              labelled++;
              break;
            }
          }
        }
        // Halo pass, then letters, so no halo covers a neighbouring letter.
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors.parchment;
        ctx.fillStyle = ROAD;
        for (const pass of [0, 1])
          for (const g of glyphs) {
            const cos = Math.cos(g.a),
              sin = Math.sin(g.a);
            ctx.setTransform(
              dpr * cos,
              dpr * sin,
              -dpr * sin,
              dpr * cos,
              dpr * (g.x - ox),
              dpr * g.y,
            );
            if (pass) ctx.fillText(g.ch, 0, 0);
            else ctx.strokeText(g.ch, 0, 0);
          }
        ctx.setTransform(dpr, 0, 0, dpr, -dpr * ox, 0);
      }

      const sel = selectedRef.current;
      if (sel?.kind === "city") {
        ctx.strokeStyle = colors.goldLeaf;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xOf(sel.city.lng), yOf(sel.city.lat), r + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    hitsRef.current = hits;

    // Creatures: a DOM layer mounted only from CREATURE_ZOOM (its idle motion is CSS),
    // positioned here like the location pulse.
    const creatureHits: {
      creature: MapCreature;
      x: number;
      y: number;
      r: number;
    }[] = [];
    const layer = creatureLayerRef.current;
    if (layer && z >= CREATURE_ZOOM) {
      layer.style.opacity = String(
        0.25 + 0.75 * clamp((z - CREATURE_ZOOM) / CREATURE_FADE, 0, 1),
      );
      const size = creatureSize(z);
      CREATURES.forEach((creature, i) => {
        const el = creatureElsRef.current[i];
        if (!el) return;
        const x = xOf(creature.lng),
          y = yOf(creature.lat);
        const onCanvas = y > -size && y < h + size;
        el.style.visibility = onCanvas ? "visible" : "hidden";
        el.style.transform = `translate(${x - CREATURE_ART_PX / 2}px, ${
          y - CREATURE_ART_PX / 2
        }px) scale(${size / CREATURE_ART_PX})`;
        if (onCanvas)
          creatureHits.push({
            creature,
            x,
            y,
            r: Math.max(HIT_RADIUS, size * 0.45),
          });
      });
    }
    creatureHitsRef.current = creatureHits;

    // 9. Current location: crosshair here, pulse as a CSS-animated element.
    const ux = xOf(userRef.current.lng),
      uy = yOf(userRef.current.lat);
    const userVisible = ux >= 0 && ux <= w && uy >= 0 && uy <= h;
    if (userVisible) {
      ctx.strokeStyle = MARKER;
      ctx.fillStyle = MARKER;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ux, uy, 6, 0, Math.PI * 2);
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        ctx.moveTo(ux + dx * 8, uy + dy * 8);
        ctx.lineTo(ux + dx * 13, uy + dy * 13);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ux, uy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    const marker = markerRef.current;
    if (marker) {
      marker.style.display = userVisible ? "block" : "none";
      marker.style.transform = `translate(${ux}px, ${uy}px)`;
    }

    // Keep the card attached to its dot or creature (it lives in the canvas wrapper, so horizontal scroll is free).
    const card = cardRef.current;
    const sel = selectedRef.current;
    if (card && sel) {
      const p = selectionPoint(sel);
      const gap = sel.kind === "creature" ? creatureSize(z) / 2 + 2 : 14;
      const x = clamp(
        xOf(p.lng),
        card.offsetWidth / 2 + 4,
        w - card.offsetWidth / 2 - 4,
      );
      const y = yOf(p.lat);
      const above = y - card.offsetHeight - gap - 4 >= 0;
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.style.transform = above
        ? `translate(-50%, calc(-100% - ${gap}px))`
        : `translate(-50%, ${gap}px)`;
    }
  }, []);

  const scheduleDraw = useCallback(() => {
    if (frameRef.current === null)
      frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  /** Draws now, dropping any frame already scheduled. */
  const drawNow = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    draw();
  }, [draw]);

  /**
   * Sizes the wrapper to the map at the current zoom and the canvas to the visible
   * strip plus overscan. The canvas backing store is only reallocated (which clears
   * it) when its size changes, so callers must draw afterwards.
   */
  const applySize = useCallback(() => {
    const container = containerRef.current,
      wrapper = wrapperRef.current,
      canvas = canvasRef.current;
    if (!container || !wrapper || !canvas) return;
    const { w, h } = canvasSize();
    const vw = container.clientWidth;
    const cw = Math.min(w, Math.ceil(vw * (1 + 2 * OVERSCAN)));
    viewWRef.current = vw;
    canvasWRef.current = cw;
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2,
      Math.sqrt(MAX_CANVAS_PIXELS / (cw * h)),
    );
    dprRef.current = dpr;
    wrapper.style.width = `${w}px`;
    wrapper.style.height = `${h}px`;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${h}px`;
    const bw = Math.round(cw * dpr),
      bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    // Desktop: no scrollbar when the whole map fits.
    container.style.scrollbarWidth = w <= vw ? "none" : "thin";
  }, []);

  /** Zooms keeping the map point under (clientX, clientY) fixed on screen. */
  const zoomAt = useCallback(
    (target: number, clientX: number, clientY: number) => {
      const container = containerRef.current,
        wrapper = wrapperRef.current;
      if (!container || !wrapper) return;
      const z = clamp(target, MIN_ZOOM, MAX_ZOOM);
      if (Math.abs(z - zoomRef.current) < 1e-3) return;
      const rect = wrapper.getBoundingClientRect();
      const px = clientX - rect.left,
        py = clientY - rect.top;
      const s0 = scale();
      const lng = px / s0 + LNG_MIN;
      const degFromTop = (py + panYRef.current) / s0;

      zoomRef.current = z;
      const s1 = scale();
      panYRef.current = clamp(
        degFromTop * s1 - py,
        0,
        baseHRef.current * (z - 1),
      );
      applySize();
      const margin = Math.max(0, (container.clientWidth - canvasSize().w) / 2);
      container.scrollLeft =
        margin +
        (lng - LNG_MIN) * s1 -
        (clientX - container.getBoundingClientRect().left);
      drawNow(); // after the scroll, so the canvas strip lands under the viewport
      setZoom(z);
      if (z < CREATURE_ZOOM && selectedRef.current?.kind === "creature")
        setSelected(null);
    },
    [applySize, drawNow],
  );

  /** The zoom the map is heading to, including a request not yet applied this frame. */
  const targetZoom = () => pendingZoomRef.current?.zoom ?? zoomRef.current;

  /** Coalesces pinch / wheel zoom requests to one resize per frame. */
  const requestZoom = useCallback(
    (zoom: number, x: number, y: number) => {
      pendingZoomRef.current = { zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM), x, y };
      if (zoomFrameRef.current !== null) return;
      zoomFrameRef.current = requestAnimationFrame(() => {
        zoomFrameRef.current = null;
        const p = pendingZoomRef.current;
        pendingZoomRef.current = null;
        if (p) zoomAt(p.zoom, p.x, p.y);
      });
    },
    [zoomAt],
  );

  const zoomButton = (factor: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect)
      requestZoom(
        targetZoom() * factor,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
  };

  // Initial layout, centred on the Mediterranean.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    applySize();
    const margin = Math.max(0, (container.clientWidth - canvasSize().w) / 2);
    container.scrollLeft =
      margin + (INITIAL_LNG - LNG_MIN) * scale() - container.clientWidth / 2;
    drawNow();
  }, [applySize, drawNow]);

  // Native horizontal scrolling moves the canvas strip with the map; re-centre it
  // once the viewport has used up half of the overscan on either side.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (
        Math.abs(desiredOrigin() - originXRef.current) >
        (OVERSCAN * viewWRef.current) / 2
      )
        scheduleDraw();
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [scheduleDraw]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    loadRomanMapData()
      .then((data) => {
        if (cancelled) return;
        sceneRef.current = getScene(data);
        setStatus("ready");
        scheduleDraw();
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt, scheduleDraw]);

  useEffect(() => {
    const onResize = () => {
      baseHRef.current = baseHeight();
      panYRef.current = clamp(
        panYRef.current,
        0,
        baseHRef.current * (zoomRef.current - 1),
      );
      applySize();
      drawNow();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applySize, drawNow]);

  // Wheel / trackpad pinch zooms; horizontal wheel deltas keep scrolling natively.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      requestZoom(
        targetZoom() * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
        e.clientX,
        e.clientY,
      );
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [requestZoom]);

  // Escape closes an open city card first. Capture phase, so it runs before the modal's
  // own Escape handler, which skips events marked defaultPrevented.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !selectedRef.current) return;
      e.preventDefault();
      setSelected(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  // The roads file loads only while the layer is on (and once per session).
  useEffect(() => {
    localStorage.setItem(ROADS_KEY, roadsOn ? "1" : "0");
    if (!roadsOn) {
      if (selectedRef.current?.kind === "road") setSelected(null);
      scheduleDraw();
      return;
    }
    let cancelled = false;
    setRoadStatus("loading");
    loadRomanRoads()
      .then((roads) => {
        if (cancelled) return;
        roadSceneRef.current = getRoadScene(roads);
        setRoadStatus("ready");
        scheduleDraw();
      })
      .catch(() => {
        if (!cancelled) setRoadStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [roadsOn, roadAttempt, scheduleDraw]);

  // A new app date can hide the selected road, and it replaces the card's own year.
  useEffect(() => {
    if (selectedRef.current?.kind === "road") setSelected(null);
    setCardYear(null);
  }, [year]);

  useEffect(() => {
    scheduleDraw();
  }, [roadsYear, scheduleDraw]);

  const creaturesShown = status === "ready" && zoom >= CREATURE_ZOOM;

  // Draw synchronously when the card opens (or the creature layer mounts) so nothing
  // shows at its unpositioned origin.
  useLayoutEffect(() => {
    draw();
  }, [selected, latitude, longitude, creaturesShown, draw]);

  // Label widths measured with a fallback font are stale once Cinzel arrives.
  useEffect(() => {
    const fonts = document.fonts;
    if (!fonts) return;
    const refresh = () => {
      labelWidthsRef.current.clear();
      glyphWidthsRef.current.clear();
      scheduleDraw();
    };
    fonts.ready.then(refresh);
    fonts.addEventListener?.("loadingdone", refresh);
    return () => fonts.removeEventListener?.("loadingdone", refresh);
  }, [scheduleDraw]);

  useEffect(
    () => () => {
      // Reset the refs too: StrictMode re-runs effects, and a stale frame id would
      // make scheduleDraw think a frame is still pending.
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (zoomFrameRef.current !== null)
        cancelAnimationFrame(zoomFrameRef.current);
      frameRef.current = null;
      zoomFrameRef.current = null;
    },
    [],
  );

  const tapAt = (clientX: number, clientY: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect(); // hits are in map px
    if (!rect) return;
    const px = clientX - rect.left,
      py = clientY - rect.top;
    // Distances are relative to each target's hit radius, so a tap on a creature's body
    // beats a city dot at its edge, while a tap right on a dot still picks the city.
    let best: Selection | null = null;
    let bestD = 1;
    for (const { city, x, y } of hitsRef.current) {
      const d = ((x - px) ** 2 + (y - py) ** 2) / (HIT_RADIUS * HIT_RADIUS);
      if (d <= bestD) {
        bestD = d;
        best = { kind: "city", city };
      }
    }
    for (const { creature, x, y, r } of creatureHitsRef.current) {
      const d = ((x - px) ** 2 + (y - py) ** 2) / (r * r);
      if (d <= bestD) {
        bestD = d;
        best = { kind: "creature", creature };
      }
    }
    // Roads come last: a tap near a city dot or a creature still picks those.
    const roadScene = roadsOnRef.current ? roadSceneRef.current : null;
    if (!best && roadScene) {
      const s = scale();
      const lng = px / s + LNG_MIN,
        lat = LAT_MAX - (py + panYRef.current) / s;
      const road = hitRoad(roadScene, lng, lat, ROAD_HIT / s);
      if (road)
        best = {
          kind: "road",
          road,
          related: road.viae.length
            ? roadScene.roads.flatMap((r, i) =>
                r !== road && r.viae.some((v) => road.viae.includes(v))
                  ? [i]
                  : [],
              )
            : [],
          lng,
          lat,
        };
    }
    setSelected(best);
  };

  const pinchMetrics = () => {
    const [a, b] = [...pointersRef.current.values()];
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      gestureRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
    } else if (pointersRef.current.size === 2) {
      if (gestureRef.current) gestureRef.current.moved = true;
      pinchRef.current = { dist: pinchMetrics().dist, zoom: zoomRef.current };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointersRef.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x,
      dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;

    const pinch = pinchRef.current;
    if (pinch && pointersRef.current.size >= 2) {
      const m = pinchMetrics();
      if (pinch.dist > 0)
        requestZoom((pinch.zoom * m.dist) / pinch.dist, m.x, m.y);
      return;
    }
    const g = gestureRef.current;
    if (!g) return;
    if (
      !g.moved &&
      Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > CLICK_SLOP
    )
      g.moved = true;
    // Mouse drags pan both ways; on touch the browser pans horizontally itself
    // (touch-action: pan-x) and only vertical drags reach this handler.
    const container = containerRef.current;
    if (container && dx) container.scrollLeft -= dx;
    const panY = clamp(
      panYRef.current - dy,
      0,
      baseHRef.current * (zoomRef.current - 1),
    );
    if (panY !== panYRef.current) {
      panYRef.current = panY;
      scheduleDraw();
    }
  };

  const endPointer = (
    e: React.PointerEvent<HTMLCanvasElement>,
    cancelled: boolean,
  ) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    const tap =
      !cancelled &&
      pointersRef.current.size === 1 &&
      gestureRef.current &&
      !gestureRef.current.moved;
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) gestureRef.current = null;
    if (tap) tapAt(e.clientX, e.clientY);
  };

  const province =
    selected?.kind === "city"
      ? getRomanProvince(selected.city.lat, selected.city.lng)
      : null;

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-sm border border-gold-dim/40"
        // pan-x: native horizontal scrolling pans east–west; vertical drags and pinches come to the canvas.
        style={
          {
            touchAction: "pan-x",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties
        }
      >
        {/* Sea background: shows only if a fast fling outruns the canvas strip for a frame. */}
        <div
          ref={wrapperRef}
          className="relative mx-auto"
          style={{ background: SEA }}
        >
          <canvas
            ref={canvasRef}
            className="absolute left-0 top-0 block select-none cursor-grab active:cursor-grabbing"
            role="img"
            aria-label="Mapa del Imperio Romano — toque una ciudad para elegirla como ubicación"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endPointer(e, false)}
            onPointerCancel={(e) => endPointer(e, true)}
          />
          {creaturesShown && (
            <div
              ref={creatureLayerRef}
              className="absolute inset-0 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              {CREATURES.map((creature, i) => (
                <div
                  key={creature.key}
                  ref={(el) => {
                    creatureElsRef.current[i] = el;
                  }}
                  className="absolute left-0 top-0"
                  style={{
                    width: CREATURE_ART_PX,
                    height: CREATURE_ART_PX,
                    transformOrigin: "50% 50%",
                  }}
                >
                  <canvas
                    ref={(el) => {
                      if (el && !el.dataset.painted) {
                        paintCreature(el, creature);
                        el.dataset.painted = "1";
                      }
                    }}
                    className={`block ${
                      creature.sea ? "creature-bob" : "creature-breathe"
                    }`}
                    // Staggered so the creatures never move in step.
                    style={{
                      width: "100%",
                      height: "100%",
                      animationDuration: `${5 + (i % 4) * 0.9}s`,
                      animationDelay: `${-i * 0.73}s`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div
            ref={markerRef}
            className="absolute left-0 top-0 pointer-events-none"
            style={{ display: "none" }}
          >
            <span
              className="absolute -left-3 -top-3 w-6 h-6 rounded-full border-2 animate-ping"
              style={{ borderColor: MARKER }}
            />
          </div>

          {status !== "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <span className="font-body italic text-lg text-parchment/80">
                {status === "loading"
                  ? "Desplegando el mapa del Imperio…"
                  : "No se pudo cargar el mapa."}
              </span>
              {status === "error" && (
                <button
                  type="button"
                  onClick={() => setLoadAttempt((n) => n + 1)}
                  className="pointer-events-auto font-serif text-xs uppercase tracking-[0.25em] px-4 py-2 border border-gold-dim/60 text-gold-leaf hover:bg-gold-leaf/10 rounded-sm"
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {selected && (
            <div
              ref={cardRef}
              className={`absolute z-10 ${
                selected.kind === "road"
                  ? "w-72 max-h-[60%] overflow-y-auto overscroll-contain"
                  : "w-60"
              } p-3 rounded-sm border border-gold-dim/60 bg-ink/95 shadow-2xl`}
              style={{ left: 0, top: 0 }}
              role="dialog"
              aria-label={
                selected.kind === "city"
                  ? selected.city.latin
                  : selected.kind === "creature"
                    ? selected.creature.name
                    : selected.road.viae.join(" · ") || RL.unnamed
              }
            >
              {selected.kind === "road" ? (
                <RoadCard
                  road={selected.road}
                  year={roadsYear}
                  onYear={setCardYear}
                  ownYear={cardYear !== null}
                />
              ) : selected.kind === "city" ? (
                <>
                  <div className="font-serif text-xl font-bold text-gold-leaf leading-tight">
                    {selected.city.latin}
                  </div>
                  <div className="font-body italic text-base text-parchment/80 leading-snug">
                    {selected.city.modern}
                  </div>
                  <div className="font-body text-sm text-parchment/60 mt-1">
                    {selected.city.fortress ? "Castra" : "Urbs"}
                    {province ? ` · ${province.name}` : ""}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLocationChange(selected.city.lat, selected.city.lng);
                      onClose();
                    }}
                    className="mt-3 w-full font-serif text-xs uppercase tracking-[0.2em] px-3 py-2 rounded-sm border border-gold-leaf/60 text-gold-leaf hover:bg-gold-leaf/10"
                  >
                    Fijar como mi ubicación
                  </button>
                </>
              ) : (
                <>
                  <div className="font-serif text-lg font-bold tracking-[0.12em] text-gold-leaf leading-tight">
                    {selected.creature.name}
                  </div>
                  <div className="font-body italic text-base text-parchment/85 leading-snug mt-1">
                    {selected.creature.desc}
                  </div>
                  <div className="font-body text-sm text-parchment/50 mt-1">
                    {selected.creature.source}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <span className="font-body italic text-sm text-parchment/50 leading-tight">
          Imperium Romanum, 117 d. C. · Datos: Digital Atlas of the Roman Empire
          (DARE), vía klokantech/roman-empire
        </span>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setRoadsOn((v) => !v)}
            aria-pressed={roadsOn}
            title={roadsOn ? RL.toggleHide : RL.toggleShow}
            className={`h-9 px-3 flex items-center gap-2 rounded-sm border font-serif text-xs uppercase tracking-[0.2em] ${
              roadsOn
                ? "border-gold-leaf/60 text-gold-leaf bg-gold-leaf/10"
                : "border-gold-dim/50 text-parchment/60 hover:bg-gold-leaf/10"
            }`}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
              <path
                d="M1 8 C5 8 6 2 15 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {RL.toggle}
          </button>
          {(
            [
              [1 / 1.5, "−", "Alejar", zoom <= MIN_ZOOM],
              [1.5, "+", "Acercar", zoom >= MAX_ZOOM],
            ] as const
          ).map(([factor, glyph, label, disabled]) => (
            <button
              key={glyph}
              type="button"
              onClick={() => zoomButton(factor)}
              disabled={disabled}
              aria-label={label}
              title={label}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-gold-dim/50 text-gold-leaf text-lg leading-none hover:bg-gold-leaf/10 disabled:opacity-30"
            >
              {glyph}
            </button>
          ))}
        </div>
      </div>

      {roadsOn && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 font-body italic text-sm text-parchment/60 leading-tight">
          {roadStatus === "ready" ? (
            <>
              {(
                [
                  [RL.legendMaior, 3, 0.95, ""],
                  [RL.legendMinor, 1.5, 0.75, ""],
                  [RL.legendHypothetica, 2, 0.75, "0.01 4.5"],
                  ...(roadsYear !== null
                    ? ([[RL.legendIgnota, 3, 0.33, ""]] as const)
                    : []),
                ] as const
              ).map(([label, width, opacity, dash]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <svg width="28" height="8" viewBox="0 0 28 8" aria-hidden="true">
                    <rect width="28" height="8" rx="1" fill={colorsRef.current.parchment} />
                    <line
                      x1="3"
                      y1="4"
                      x2="25"
                      y2="4"
                      stroke={ROAD}
                      strokeOpacity={opacity}
                      strokeWidth={width}
                      strokeLinecap="round"
                      strokeDasharray={dash || undefined}
                    />
                  </svg>
                  {label}
                </span>
              ))}
              {roadsYear !== null && <span>{RL.yearNote(roadsYear)}</span>}
              {cardYear !== null && (
                <button
                  type="button"
                  onClick={() => setCardYear(null)}
                  className="not-italic font-serif text-xs uppercase tracking-[0.2em] px-2 py-1 border border-gold-dim/60 text-gold-leaf hover:bg-gold-leaf/10 rounded-sm"
                >
                  {RL.redire}
                </button>
              )}
            </>
          ) : roadStatus === "loading" ? (
            <span>{RL.loading}</span>
          ) : (
            <span className="flex items-center gap-2">
              {RL.error}
              <button
                type="button"
                onClick={() => setRoadAttempt((n) => n + 1)}
                className="not-italic font-serif text-xs uppercase tracking-[0.2em] px-2 py-1 border border-gold-dim/60 text-gold-leaf hover:bg-gold-leaf/10 rounded-sm"
              >
                {RL.retry}
              </button>
            </span>
          )}
          <span className="basis-full text-parchment/45">
            {RL.attribution}, doi:{" "}
            <a
              href="https://doi.org/10.5281/zenodo.17122148"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gold-leaf"
            >
              10.5281/zenodo.17122148
            </a>{" "}
            ·{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gold-leaf"
            >
              CC BY 4.0
            </a>{" "}
            · {RL.modified}
          </span>
        </div>
      )}
    </div>
  );
};

export default RomanMapCanvas;

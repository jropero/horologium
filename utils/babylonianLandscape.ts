/**
 * Procedural landscape of the Babylonian hero (300×200 viewBox, ground line
 * y = 181). Neo-Babylonian Babylon under Nebuchadnezzar II (6th c. BCE), seen
 * from the north, outside the city, looking south down the Processional Way:
 * the viewer faces south, like the sky mapping of the Sin moon (azimuth 180° =
 * centre), so west (the Euphrates) is on the right.
 *
 * Back to front:
 * - far: the plain, date-palm groves, Esagila and Etemenanki (fixed anchors);
 * - mid: flat-roofed mud-brick houses and palms inside the city;
 * - the inner wall (Imgur-Enlil) with the main Ishtar Gate;
 * - the outer wall (Nēmetti-Enlil) with the front Ishtar Gate (the one
 *   rebuilt in Berlin), both cut by the Euphrates;
 * - the ground, the Processional Way between its glazed walls, the river with
 *   the bridge, reeds on the banks, and date palms framing the view.
 *
 * Sources (only where they support the detail):
 * - R. Koldewey, *Das wieder erstehende Babylon* (1913): Ishtar Gate (double
 *   gate in the double wall, glazed brick with alternating rows of bulls and
 *   mušḫuššu dragons), the double city wall with towers, the Processional Way,
 *   the Euphrates bridge on piers, flat-roofed mud-brick houses.
 * - Esagila tablet (AO 6555), ed. A. R. George, *Babylonian Topographical
 *   Texts* (1992): the stage dimensions of Etemenanki used below (base
 *   15 × 15 nindan ≈ 90 m, total height 90 m, six stages and the temple).
 * - O. Pedersén, *Babylon: The Great City* (2021): city layout (Etemenanki
 *   beside the east bank, south of the Ishtar Gate, west of the Processional
 *   Way).
 * Approximate reconstruction (no exact source): the heights of the walls and
 * of the main gate, the shape of the crenellations, the façade of Esagila,
 * and the number and size of the animal rows on the gates.
 *
 * Everything that varies (houses, palms, lit windows, torches on the walls) is
 * derived from a seed (the calendar day); Etemenanki, Esagila, the gates, the
 * walls, the river and the bridge are fixed anchors. Drawing and light live in
 * `components/BabylonianScene.tsx`; helpers in `utils/sceneKit.ts`.
 */

import {
  Monument as SceneMonument,
  Pen,
  Rand,
  SCENE_X0,
  SCENE_X1,
  ShapeDraw,
  ShapeKit,
  buildShape,
  fmt,
  seededRandom,
} from './sceneKit';

export { SCENE_W, SCENE_X0, SCENE_X1, seededRandom } from './sceneKit';

export type MonumentKind =
  | 'etemenanki'
  | 'esagila'
  | 'mainGate'
  | 'ishtarGate'
  | 'wall'
  | 'house'
  | 'palm';

export type Monument = SceneMonument<MonumentKind>;

/** Ground line in front of the outer wall. */
export const GROUND_Y = 181;
/** The far plain, behind the walls (seen through the river gap). */
export const HORIZON_Y = 172;
export const GROUND_TOP = `M ${SCENE_X0 - 5} ${GROUND_Y} L ${SCENE_X1 + 5} ${GROUND_Y}`;

/** Centre of the Ishtar Gate and the Processional Way. */
export const GATE_CX = 33;

/** The region the hero text covers; no mid or near shape rises into it. */
export const OVERLAY_BOX = { x0: 70, x1: 230, yBottom: 145 };

// ── Euphrates: a straight reach running away from the viewer ────────────────
const VANISH_X = 268;
const VANISH_Y = 166;
const RIVER_SPREAD = 3.18;
const RIVER_SLANT = 0.62;

/** Left and right bank of the river at height y (perspective wedge). */
export const riverEdges = (y: number) => {
  const d = y - VANISH_Y;
  const c = VANISH_X - d * RIVER_SLANT;
  const w = d * RIVER_SPREAD;
  return { left: c - w / 2, right: c + w / 2 };
};

const riverPath = () => {
  const top = riverEdges(HORIZON_Y);
  const bottom = riverEdges(201);
  return `M${fmt(top.left)} ${HORIZON_Y}L${fmt(bottom.left)} 201L${fmt(bottom.right)} 201L${fmt(top.right)} ${HORIZON_Y}Z`;
};

// ── Shared drawing helpers ──────────────────────────────────────────────────

/**
 * Stepped merlons (three steps, as on the Babylonian walls and gates) along a
 * top edge from u0 to u1 at height v, appended left to right to `pts`.
 */
const merlons = (pts: number[], u0: number, u1: number, v: number, m: number) => {
  const step = m / 3;
  const pitch = 3 * m;
  const n = Math.max(1, Math.floor((u1 - u0) / pitch));
  const pad = (u1 - u0 - n * pitch) / 2;
  pts.push(u0, v);
  for (let i = 0; i < n; i++) {
    const a = Math.max(u0, u0 + pad + i * pitch + m / 2);
    pts.push(
      a, v,
      a, v + step,
      a + step, v + step,
      a + step, v + 2 * step,
      a + 2 * step, v + 2 * step,
      a + 2 * step, v + 3 * step,
      a + 4 * step, v + 3 * step,
      a + 4 * step, v + 2 * step,
      a + 5 * step, v + 2 * step,
      a + 5 * step, v + step,
      a + 6 * step, v + step,
      a + 6 * step, v,
    ); // prettier-ignore
  }
  pts.push(u1, v);
};

/** A gap through a crenellated mass: right edge, left edge, jamb height. */
type Passage = [number, number, number];

/**
 * Crenellated outline: contiguous segments [u0, u1, height] from left to
 * right, standing on v = 0, with round-topped passages cut through the base
 * (given right to left).
 */
const battlement = (
  pen: Pen,
  segs: [number, number, number][],
  m: number,
  passages: Passage[] = [],
) => {
  const pts: number[] = [];
  for (const [u0, u1, h] of segs) merlons(pts, u0, u1, h, m);
  const start = segs[0][0];
  const end = segs[segs.length - 1][1];
  pen.M(start, 0);
  for (let i = 0; i < pts.length; i += 2) pen.L(pts[i], pts[i + 1]);
  pen.L(end, 0);
  for (const [uR, uL, straight] of passages) pen.gap(uR, uL, straight);
  pen.L(start, 0).Z();
};

// Glazed animals in a 10 × 7 box, facing right, feet on v = 0.
/** Aurochs / bull (rēmu). */
const BULL = [
  0.3, 2.2, 0.7, 3.8, 1.2, 4.9, 3, 5.2, 5.6, 5.6, 6.8, 5.8, 7.6, 6, 7.9, 6.9, 8.3, 6.1, 9.3,
  5.6, 10, 4.4, 9.3, 3.9, 8.3, 4.1, 7.8, 3.4, 7.6, 0, 6.9, 0, 6.6, 2.6, 3, 2.6, 2.6, 0, 1.9, 0,
  1.7, 2.8, 1, 3.4, 0.6, 2.2,
];
/** Mušḫuššu: scaled body, raised tail, long neck, horned head. */
const DRAGON = [
  0, 5.6, 0.9, 4.6, 2.2, 4, 7.4, 4, 7.9, 5.6, 8.3, 6.6, 8.6, 7.2, 8.9, 6.6, 10, 6.1, 9, 5.6,
  8.7, 4.8, 8.4, 3.3, 7.3, 2.6, 7.2, 0, 6.5, 0, 6.4, 2.4, 3.4, 2.4, 3.3, 0, 2.6, 0, 2.4, 2.6,
  1.4, 3.2, 0.5, 4.4,
];

const animal = (
  k: ShapeKit,
  shape: number[],
  u: number,
  v: number,
  w: number,
  facingRight: boolean,
) => {
  const s = w / 10;
  const pts: number[] = [];
  for (let i = 0; i < shape.length; i += 2) {
    pts.push(u + (facingRight ? shape[i] : 10 - shape[i]) * s, v + shape[i + 1] * s);
  }
  k.relief.poly(pts);
};

/** Rows of animals across [u0, u1], alternating bulls and dragons by row. */
const animalRows = (
  k: ShapeKit,
  u0: number,
  u1: number,
  rows: number[],
  w: number,
  facingRight: boolean,
  firstRow = 0,
) => {
  const count = Math.max(1, Math.floor((u1 - u0) / (w * 1.35)));
  const pitch = (u1 - u0) / count;
  rows.forEach((v, r) => {
    const shape = (r + firstRow) % 2 === 0 ? BULL : DRAGON;
    for (let i = 0; i < count; i++) {
      animal(k, shape, u0 + pitch * i + (pitch - w) / 2, v, w, facingRight);
    }
  });
};

/** Band of small rosettes. */
const rosettes = (k: ShapeKit, u0: number, u1: number, v: number, size: number) => {
  for (let u = u0 + size; u < u1 - size; u += size * 2.4) k.relief.rect(u, v, size, size);
};

// ── Monuments ───────────────────────────────────────────────────────────────

/**
 * Etemenanki, in metres, after the Esagila tablet (George 1992): six stages
 * of 90, 78, 60, 51, 42 and 33 m with heights 33, 18, 6, 6, 6, 6 m, and the
 * temple on top (24 m wide, 15 m high): 90 m in all. The stairways were on
 * the south side, so they can't be seen from the north. The buttressed
 * façades are an approximate reconstruction.
 */
const ETEMENANKI_STAGES: [number, number][] = [
  [90, 33],
  [78, 18],
  [60, 6],
  [51, 6],
  [42, 6],
  [33, 6],
];

/** One stage centred on u = 45: buttresses on the big ones, a cornice line on the small ones. */
const etemenankiStage = (k: ShapeKit, v: number, w: number, h: number) => {
  const u0 = 45 - w / 2;
  k.body.rect(u0, v, w, h);
  if (h <= 10) {
    k.detail.line(u0, v + h * 0.5, u0 + w, v + h * 0.5);
    return;
  }
  const pitch = h > 20 ? 7.5 : 6.5;
  for (let u = u0 + pitch / 2; u < u0 + w - 1; u += pitch) k.relief.rect(u, v, 1.4, h - 1);
  k.detail.line(u0, v + h - 1.2, u0 + w, v + h - 1.2);
};

const drawEtemenanki: ShapeDraw = k => {
  let v = 0;
  for (const [w, h] of ETEMENANKI_STAGES) {
    etemenankiStage(k, v, w, h);
    v += h;
  }
  // Temple (šaḫūru) on the top stage.
  const pts: number[] = [];
  merlons(pts, 33, 57, 15, 1.6);
  k.body.M(33, v);
  for (let i = 0; i < pts.length; i += 2) k.body.L(pts[i], pts[i + 1] + v);
  k.body.L(57, v).Z();
  k.detail.line(33, v + 12.5, 57, v + 12.5);
  k.open.rect(43.2, v, 3.6, 7.5);
  k.window(37, v + 6.5, 1.4, 2.4, true);
  k.window(51.6, v + 6.5, 1.4, 2.4, true);
  k.torch(32.4, v + 4);
  k.torch(57.6, v + 4);
};

/**
 * Esagila, the temple of Marduk south of Etemenanki: a long crenellated
 * enclosure with towers and a central gate tower. Approximate reconstruction.
 */
const drawEsagila: ShapeDraw = k => {
  const segs: [number, number, number][] = [];
  let u = 0;
  while (u < 34) {
    segs.push([u, u + 3, 14], [u + 3, Math.min(34, u + 8), 12]);
    u += 8;
  }
  segs.push([34, 46, 18]);
  u = 46;
  while (u < 80) {
    segs.push([u, Math.min(80, u + 5), 12], [Math.min(80, u + 5), Math.min(80, u + 8), 14]);
    u += 8;
  }
  battlement(
    k.body,
    segs.filter(([a, b]) => b > a),
    1.2,
  );
  for (let x = 2; x < 80; x += 4) if (x < 34 || x > 46) k.relief.rect(x, 0, 0.8, 11);
  k.open.arch(38.3, 0, 3.4, 8);
  k.detail.line(34, 15.5, 46, 15.5);
  k.torch(36.5, 9);
  k.torch(43.5, 9);
};

/**
 * Front Ishtar Gate (in the outer wall; the gate rebuilt in Berlin), in
 * metres: ~30 m wide, ~15 m high, after Koldewey 1913. Glazed blue brick with
 * alternating rows of bulls and mušḫuššu dragons, a rosette band, stepped
 * merlons. Row count approximate.
 */
const drawIshtarGate: ShapeDraw = k => {
  battlement(
    k.body,
    [
      [0, 8.5, 15],
      [8.5, 21.5, 12.5],
      [21.5, 30, 15],
    ],
    1.05,
    [[18.5, 11.5, 6]],
  );
  animalRows(k, 0.5, 8, [1.6, 5, 8.4], 3, true);
  animalRows(k, 22, 29.5, [1.6, 5, 8.4], 3, false);
  animalRows(k, 9, 21, [10.1], 2.5, true, 1);
  rosettes(k, 0.3, 8.2, 12.3, 0.55);
  rosettes(k, 21.8, 29.7, 12.3, 0.55);
  k.detail.line(0, 0.7, 30, 0.7);
  k.detail.line(0, 13.6, 8.5, 13.6).line(21.5, 13.6, 30, 13.6);
  k.detail.line(8.5, 11.4, 21.5, 11.4);
  k.open.arch(11.5, 0, 7, 9.5);
  k.torch(10.6, 6.2);
  k.torch(19.4, 6.2);
};

/** Main Ishtar Gate in the inner wall, taller than the front gate. Height approximate. */
const drawMainGate: ShapeDraw = k => {
  battlement(
    k.body,
    [
      [0, 11, 24],
      [11, 29, 20.5],
      [29, 40, 24],
    ],
    1.3,
    [[23.5, 16.5, 8]],
  );
  animalRows(k, 0.6, 10.4, [2, 5.6, 9.2, 12.8, 16.4], 3, true);
  animalRows(k, 29.6, 39.4, [2, 5.6, 9.2, 12.8, 16.4], 3, false);
  animalRows(k, 11.6, 28.4, [12.6, 16], 2.6, true, 1);
  rosettes(k, 0.4, 10.6, 20.6, 0.6);
  rosettes(k, 29.4, 39.6, 20.6, 0.6);
  k.detail.line(0, 22.2, 11, 22.2).line(29, 22.2, 40, 22.2);
  k.open.arch(16.5, 0, 7, 11.5);
};

/** Flat-roofed mud-brick house: parapet, few small windows high up, sometimes a roof hut. */
const drawHouse =
  (w: number, h: number): ShapeDraw =>
  (k, rand) => {
    k.body.rect(0, 0, w, h);
    k.body.rect(-0.3, h, w + 0.6, 0.7);
    if (rand() < 0.45) {
      const hw = 2 + rand() * 2;
      const hu = rand() * (w - hw);
      k.body.rect(hu, h + 0.7, hw, 2.2);
    }
    k.detail.line(0, h - 0.2, w, h - 0.2);
    const n = 1 + Math.floor(rand() * Math.min(3, w / 4));
    for (let i = 0; i < n; i++) {
      const u = 1 + ((i + 0.5) / n) * (w - 3) + (rand() - 0.5);
      k.window(u, h - 3.4, 0.9, 1.3, rand() < 0.45);
    }
    k.open.rect(1 + rand() * (w - 3), 0, 1.4, 2.8);
  };

/**
 * Date palm: slender ringed trunk with a lean, drooping fronds and a few date
 * clusters. Local width 26, trunk at u = 13.
 */
const drawPalm =
  (h: number, lean: number): ShapeDraw =>
  (k, rand) => {
    const cx = 13 + lean;
    k.body
      .M(12.2, 0)
      .C(12.2, h * 0.4, 13 + lean * 0.6 - 0.45, h * 0.75, cx - 0.4, h)
      .L(cx + 0.4, h)
      .C(13 + lean * 0.6 + 0.45, h * 0.75, 13.8, h * 0.4, 13.8, 0)
      .Z();
    for (let v = 1.5; v < h - 1; v += 1.3) {
      const t = v / h;
      const x = 13 + lean * t * t;
      k.detail.line(x - 0.5, v, x + 0.5, v + 0.25);
    }
    const ANGLES = [-0.3, 0.15, 0.6, 1.05, 1.57, 2.09, 2.54, 2.99, 3.44];
    for (const base of ANGLES) {
      const a = base + (rand() - 0.5) * 0.25;
      const L = 9 + rand() * 3;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const rise = 1.6;
      const droop = 0.5 * L * Math.abs(c) + (s < 0 ? 1.5 : 0);
      const tx = cx + L * c;
      const ty = h + L * s - droop;
      const m1x = cx + 0.35 * L * c;
      const m1y = h + 0.35 * L * s + rise;
      const m2x = cx + 0.72 * L * c;
      const m2y = h + 0.72 * L * s + rise * 0.4 - droop * 0.4;
      k.body
        .M(cx, h + 0.3)
        .C(m1x, m1y + 0.9, m2x, m2y + 0.7, tx, ty)
        .C(m2x, m2y - 0.4, m1x, m1y - 0.7, cx, h - 0.4)
        .Z();
    }
    // Date clusters under the crown.
    k.relief.dome(cx - 1.4, h - 2.4, 1, 1.6);
    k.relief.dome(cx + 1.2, h - 2.2, 0.9, 1.4);
  };

/** Builds a monument at x0 (left edge) standing on `base` at scale s. */
const place = (
  kind: MonumentKind,
  draw: ShapeDraw,
  width: number,
  x0: number,
  base: number,
  s: number,
  rand: Rand,
  flip = false,
): Monument => buildShape(kind, draw, width, x0, base, s, flip, rand);

// ── Walls ───────────────────────────────────────────────────────────────────

interface WallSpec {
  base: number;
  top: number;
  towerTop: number;
  towerW: number;
  pitch: number;
  /** x range cut out for the river. */
  gap: [number, number];
  merlon: number;
  /** Chance that a tower carries a torch at night. */
  torchChance: number;
}

/** Outer wall (Nēmetti-Enlil), the nearer and lower one. Heights approximate. */
const OUTER: WallSpec = {
  base: 182,
  top: 165,
  towerTop: 159.5,
  towerW: 8,
  pitch: 25,
  gap: [229, 287],
  merlon: 1.1,
  torchChance: 0.35,
};

/** Inner wall (Imgur-Enlil), farther and higher. Heights approximate. */
const INNER: WallSpec = {
  base: 176,
  top: 162,
  towerTop: 157.5,
  towerW: 6.5,
  pitch: 19,
  gap: [242, 281],
  merlon: 0.85,
  torchChance: 0.2,
};

/** Tower positions (left edges) of a wall segment, anchored at the river gap. */
const towersOf = (spec: WallSpec, side: 'left' | 'right'): number[] => {
  const xs: number[] = [];
  if (side === 'left') {
    for (let x = spec.gap[0] - spec.towerW; x > SCENE_X0 - spec.towerW - 4; x -= spec.pitch)
      xs.unshift(x);
  } else {
    for (let x = spec.gap[1]; x < SCENE_X1 + 4; x += spec.pitch) xs.push(x);
  }
  return xs;
};

/** Top profile of a wall segment: curtain at height h, towers at height ht. */
const wallProfile = (
  xa: number,
  xb: number,
  towers: number[],
  tw: number,
  h: number,
  ht: number,
) => {
  const segs: [number, number, number][] = [];
  let cursor = xa;
  for (const t of towers) {
    const t0 = Math.max(xa, t);
    const t1 = Math.min(xb, t + tw);
    if (t0 > cursor) segs.push([cursor, t0, h]);
    segs.push([t0, t1, ht]);
    cursor = t1;
  }
  if (xb > cursor) segs.push([cursor, xb, h]);
  return segs;
};

/** One stretch of wall between xa and xb (absolute x; v up from the wall's base). */
const wallSegment = (
  k: ShapeKit,
  spec: WallSpec,
  xa: number,
  xb: number,
  towers: number[],
  rand: Rand,
) => {
  const h = spec.base - spec.top;
  const ht = spec.base - spec.towerTop;
  battlement(k.body, wallProfile(xa, xb, towers, spec.towerW, h, ht), spec.merlon);
  k.detail.line(xa, 1.2, xb, 1.2);
  k.detail.line(xa, h - 1.6, xb, h - 1.6);
  for (const t of towers) {
    k.detail.line(t, 0, t, ht).line(t + spec.towerW, 0, t + spec.towerW, ht);
    k.window(t + spec.towerW / 2 - 0.4, ht - 3.2, 0.8, 1.4, rand() < 0.3);
    if (rand() < spec.torchChance) k.torch(t + spec.towerW / 2, ht + 0.6);
  }
};

const buildWall = (spec: WallSpec, rand: Rand): Monument => {
  const draw: ShapeDraw = k => {
    wallSegment(k, spec, SCENE_X0 - 4, spec.gap[0], towersOf(spec, 'left'), rand);
    wallSegment(k, spec, spec.gap[1], SCENE_X1 + 4, towersOf(spec, 'right'), rand);
  };
  return place('wall', draw, 1, 0, spec.base, 1, rand);
};

// ── The landscape ───────────────────────────────────────────────────────────

export interface BabylonianLandscape {
  /** The plain behind the walls (visible through the river gap). */
  plain: string;
  /** Far palm groves and houses on the banks beyond the gap; one path. */
  farGrove: string;
  /** Etemenanki and Esagila. */
  far: Monument[];
  /** Houses and palms inside the city. */
  city: Monument[];
  innerWall: Monument;
  mainGate: Monument;
  outerWall: Monument;
  ishtarGate: Monument;
  /** Processional Way paving, and its flanking glazed walls. */
  way: string;
  wayWalls: string;
  wayDetail: string;
  river: string;
  /** Short strokes of light on the water. */
  shimmer: string;
  bridge: string;
  bridgeDetail: string;
  /** Bank lines of the river. */
  banks: string;
  reeds: string;
  tufts: string;
  foreground: Monument[];
}

/** Every full-width layer (for the span test). */
export const fullWidthLayers = (land: BabylonianLandscape) => [
  GROUND_TOP,
  land.plain,
  land.innerWall.body,
  land.outerWall.body,
];

const reedClump = (x: number, y: number, h: number) => {
  let d = '';
  for (const [dx, dh, lean] of [
    [-0.6, 0.8, -0.5],
    [0, 1, 0.15],
    [0.5, 0.9, 0.55],
    [0.9, 0.7, 0.9],
  ]) {
    d += `M${fmt(x + dx * h * 0.3)} ${fmt(y)}q${fmt(lean * h * 0.15)} ${fmt(-dh * h * 0.5)} ${fmt(lean * h * 0.35)} ${fmt(-dh * h)}`;
  }
  return d;
};

const ETEMENANKI_S = 0.89;
const MAIN_S = 1.75;
const FRONT_S = 2.3;
/** Half width of the front gate's passage, where the Processional Way starts. */
const WAY_HALF0 = 3.5 * FRONT_S;
const WAY_HALF1 = 34;

/** Etemenanki (fixed) and Esagila behind it, half hidden by the walls. */
const buildFar = (rand: Rand): Monument[] => [
  place('esagila', drawEsagila, 80, 140, 166, 0.85, rand),
  place(
    'etemenanki',
    drawEtemenanki,
    90,
    238 - 45 * ETEMENANKI_S,
    HORIZON_Y,
    ETEMENANKI_S,
    rand,
  ),
];

/** Far palm groves and bank houses, seen through the river gap. */
const buildFarGrove = (rand: Rand) => {
  let d = '';
  for (let i = 0; i < 9; i++) {
    const x = 232 + rand() * 62;
    const s = 0.2 + rand() * 0.12;
    const palm = drawPalm(14 + rand() * 6, (rand() - 0.5) * 3);
    d += ` ${place('palm', palm, 26, x - 13 * s, HORIZON_Y + 0.3, s, rand).body}`;
  }
  for (const [x, w, h] of [
    [244, 6, 3.5],
    [249, 4, 2.6],
    [276.5, 5, 3],
  ]) {
    d += ` M${x} ${HORIZON_Y + 0.4}h${w}v${-h}h${-w}Z`;
  }
  return d.trim();
};

/** A palm in a courtyard, its crown just over the inner wall. */
const cityPalm = (x: number, rand: Rand) => {
  const s = 0.6 + rand() * 0.1;
  const palm = drawPalm(16 + rand() * 3, (rand() - 0.5) * 4);
  return place('palm', palm, 26, x - 13 * s, 169, s, rand);
};

/** Left edge and width of each house, right of the gate, skipping the river gap. */
const houseSlots = (rand: Rand): [number, number][] => {
  const slots: [number, number][] = [];
  let x = 66 + rand() * 4;
  while (x < SCENE_X1) {
    const w = 8 + rand() * 8;
    // A house in the river gap would float over the water.
    if (x + w > 234 && x < 288) {
      x = 288 + rand() * 3;
      continue;
    }
    slots.push([x, w]);
    x += w + 0.5 + rand() * 4;
  }
  return slots;
};

/** Houses and palms behind the inner wall. */
const buildCity = (rand: Rand): Monument[] => {
  const houses: Monument[] = [];
  const palms: Monument[] = [];
  for (const [x, w] of houseSlots(rand)) {
    const h = 10 + rand() * 9;
    houses.push(place('house', drawHouse(w, h), w, x, 168 + rand() * 1.5, 1, rand));
    if (rand() < 0.3 && x + w + 6 < 230) palms.push(cityPalm(x + w, rand));
  }
  return [...houses, ...palms];
};

/** Processional Way from the front gate's passage to the viewer, with its glazed side walls. */
const buildWay = () => {
  const way = `M${fmt(GATE_CX - WAY_HALF0)} ${GROUND_Y}L${fmt(GATE_CX + WAY_HALF0)} ${GROUND_Y}L${GATE_CX + WAY_HALF1} 201L${GATE_CX - WAY_HALF1} 201Z`;
  const strip = (sign: number) => {
    const a0 = GATE_CX + sign * WAY_HALF0;
    const a1 = GATE_CX + sign * (WAY_HALF0 + 1.6);
    const b0 = GATE_CX + sign * WAY_HALF1;
    const b1 = GATE_CX + sign * 46;
    return `M${fmt(a0)} ${GROUND_Y}L${fmt(a1)} ${GROUND_Y - 1.2}L${b1} 196L${b0} 201Z`;
  };
  let wayDetail = '';
  for (const t of [0.12, 0.3, 0.52, 0.78]) {
    const y = GROUND_Y + t * 20;
    const half = WAY_HALF0 + t * (WAY_HALF1 - WAY_HALF0);
    wayDetail += `M${fmt(GATE_CX - half)} ${fmt(y)}L${fmt(GATE_CX + half)} ${fmt(y)}`;
  }
  return { way, wayWalls: `${strip(-1)} ${strip(1)}`, wayDetail };
};

/** Light on the water: short strokes, longer and sparser towards the viewer. */
const buildShimmer = (rand: Rand) => {
  let d = '';
  for (let i = 0; i < 26; i++) {
    const y = HORIZON_Y + 1 + (201 - HORIZON_Y - 1) * Math.pow(rand(), 0.8);
    const { left, right } = riverEdges(y);
    const len = (right - left) * (0.06 + rand() * 0.1);
    const xs = left + 1 + rand() * Math.max(0, right - left - len - 2);
    d += `M${fmt(xs)} ${fmt(y)}h${fmt(len)}`;
  }
  return d;
};

/** The Euphrates bridge on piers across the far reach (Koldewey 1913), and the bank lines. */
const buildBridge = () => {
  const DECK_Y = 171.2;
  let bridge = `M250.5 ${DECK_Y}h27v1.1h-27Z`;
  for (let px = 253; px < 277; px += 3.6)
    bridge += `M${fmt(px)} ${DECK_Y + 1}h1.3v${fmt(HORIZON_Y + 2.4 - DECK_Y - 1)}h-1.3Z`;
  const t0 = riverEdges(HORIZON_Y);
  const t1 = riverEdges(201);
  return {
    bridge,
    bridgeDetail: `M250.5 ${DECK_Y - 0.5}H277.5`,
    banks: `M${fmt(t0.left)} ${HORIZON_Y}L${fmt(t1.left)} 201M${fmt(t0.right)} ${HORIZON_Y}L${fmt(t1.right)} 201`,
  };
};

/** Reed clumps along both banks, taller towards the viewer. */
const buildReeds = (rand: Rand) => {
  let d = '';
  for (let i = 0; i < 26; i++) {
    const y = GROUND_Y + 0.5 + rand() * 19;
    const { left, right } = riverEdges(y);
    const h = 1.2 + ((y - GROUND_Y) / 20) * 7 + rand() * 1.5;
    const x = rand() < 0.55 ? left - rand() * 2 : right + rand() * 2;
    d += reedClump(x, y, h);
  }
  return d;
};

const onWaterOrWay = (x: number, y: number) => {
  const { left, right } = riverEdges(y);
  return (x > left - 1 && x < right + 1) || Math.abs(x - GATE_CX) < WAY_HALF0 + 3;
};

/** Grass tufts along the ground line, not on the road or the water. */
const buildTufts = (rand: Rand) => {
  let d = '';
  for (let i = 0; i < 46; i++) {
    const x = SCENE_X0 + rand() * (SCENE_X1 - SCENE_X0);
    const y = GROUND_Y + 0.3 + rand() * 1.2;
    const h = 1 + rand() * 1.3;
    if (onWaterOrWay(x, y)) continue;
    d += `M${fmt(x)} ${fmt(y)}l-0.6 ${fmt(-h * 0.8)}M${fmt(x)} ${fmt(y)}l0.3 ${fmt(-h)}M${fmt(x)} ${fmt(y)}l1 ${fmt(-h * 0.7)}`;
  }
  return d;
};

/** Foreground frame: a palm left of the gate, a tall one (sometimes two) on the west bank. */
const buildForeground = (rand: Rand): Monument[] => {
  const palm = (cx: number, s: number, h: number, lean: number) =>
    place('palm', drawPalm(h, lean), 26, cx - 13 * s, 202, s, rand);
  const out = [
    palm(-20 - rand() * 4, 2.2 + rand() * 0.3, 28 + rand() * 4, 2 + rand() * 2),
    palm(318 + rand() * 6, 2.6 + rand() * 0.4, 30 + rand() * 4, -2 - rand() * 3),
  ];
  if (rand() < 0.6) out.push(palm(303 + rand() * 4, 1.5 + rand() * 0.3, 26, -1 + rand() * 2));
  return out;
};

export const generateBabylonianLandscape = (seed: number): BabylonianLandscape => {
  const rand = seededRandom(seed);
  return {
    plain: `M ${SCENE_X0 - 5} ${HORIZON_Y - 0.5} L ${SCENE_X1 + 5} ${HORIZON_Y - 0.5} L ${SCENE_X1 + 5} ${GROUND_Y + 1} L ${SCENE_X0 - 5} ${GROUND_Y + 1} Z`,
    far: buildFar(rand),
    farGrove: buildFarGrove(rand),
    city: buildCity(rand),
    innerWall: buildWall(INNER, rand),
    outerWall: buildWall(OUTER, rand),
    mainGate: place(
      'mainGate',
      drawMainGate,
      40,
      GATE_CX - 20 * MAIN_S,
      INNER.base,
      MAIN_S,
      rand,
    ),
    ishtarGate: place(
      'ishtarGate',
      drawIshtarGate,
      30,
      GATE_CX - 15 * FRONT_S,
      OUTER.base,
      FRONT_S,
      rand,
    ),
    ...buildWay(),
    river: riverPath(),
    shimmer: buildShimmer(rand),
    ...buildBridge(),
    reeds: buildReeds(rand),
    tufts: buildTufts(rand),
    foreground: buildForeground(rand),
  };
};

/**
 * Procedural landscape of the Hellenic heroes (300×200 viewBox, ground line
 * y = 180): Athens seen from the Pnyx, looking north-east, c. 406 BCE.
 *
 * The moment is fixed so that everything drawn stood at the same time: the
 * Erechtheion is finished (building accounts end 406/405 BCE) and the Long
 * Walls still stand (pulled down in 404 BCE, Xen. Hell. 2.2.23). The stone
 * Theatre of Dionysos is later (Lykourgan, 4th c.), so the theatre here is the
 * 5th-century earth cavea; the Stoa of Attalos (2nd c.) and every Roman
 * building are left out.
 *
 * Back to front: Hymettos on the horizon, Lykabettos, the low town, the
 * Acropolis rock (fixed: the anchor of the scene) with the Nike bastion,
 * Propylaia, Athena Promachos, Erechtheion with the Karyatid porch and the
 * Parthenon; on its south slope the theatre and the Odeion of Perikles; on the
 * left Kolonos Agoraios with the Hephaisteion and, at its foot, the Tholos and
 * one Agora stoa; houses, olive trees, cypresses and Aleppo pines; dark
 * foreground trees that frame the view.
 *
 * Sources for the monuments (see the comment on each shape):
 * - J. M. Hurwit, The Athenian Acropolis (1999): Acropolis buildings, dates.
 * - J. Travlos, Pictorial Dictionary of Ancient Athens (1971): plans and
 *   positions (Hephaisteion, Tholos, stoas, Odeion, theatre).
 * - J. M. Camp, The Archaeology of Athens (2001): Agora buildings and dates.
 * - Pausanias 1.28.2 (Promachos visible from the sea), 1.26.6–7 (the ever-
 *   burning lamp of Kallimachos in the Erechtheion), 1.27.2 (the sacred olive);
 *   Plutarch, Perikles 13.5 (the Odeion's roof "sloping down from a single
 *   peak", like the Persian king's tent).
 * Proportions are simplified and enlarged for legibility; the compass layout
 * is approximate (it is a picture, not a survey).
 *
 * Seeded by the calendar day: houses, trees, the Agora stoa and the line of
 * Hymettos change; the Acropolis, Lykabettos, the Hephaisteion and the Tholos
 * stay the same. Geometry only: lighting lives in components/HellenicScene.tsx.
 */

import {
  LandscapeWindow,
  Monument as SceneMonument,
  Pen,
  Rand,
  SCENE_X0,
  SCENE_X1,
  ShapeDraw,
  ShapeKit,
  buildShape,
  fmt,
  ridge,
  seededRandom,
  tufts as grassTufts,
} from './sceneKit';

export { SCENE_W, SCENE_X0, SCENE_X1, seededRandom } from './sceneKit';

export type HellenicKind =
  | 'parthenon'
  | 'erechtheion'
  | 'propylaia'
  | 'nike'
  | 'promachos'
  | 'odeion'
  | 'theatre'
  | 'hephaisteion'
  | 'stoa-zeus'
  | 'stoa-poikile'
  | 'tholos'
  | 'house'
  | 'olive'
  | 'cypress'
  | 'pine';

export type HellenicMonument = SceneMonument<HellenicKind>;

/** Clock hero: x 104–196 stays free for the instrument. Wide: the info-bar hero. */
export type HellenicLayout = 'clock' | 'wide';

export interface HellenicRock {
  /** Silhouette of the Acropolis hill, closed down to y 184. */
  body: string;
  /** Sunlit facets of the cliffs. */
  facets: string;
  /** Kimonian south wall (ashlar masonry); the Nike bastion is part of the `nike` shape. */
  wall: string;
  /** Coursing of the wall, cracks in the rock. */
  detail: string;
  /** Scrub on the slopes. */
  scrub: string;
}

export interface HellenicLandscape {
  /** Hymettos, the long ridge on the horizon. */
  ridgeFar: string;
  /** Lykabettos: silhouette, its shaded east flank, scrub. */
  lykabettos: { body: string; shade: string; scrub: string };
  /** Distant roofs of the town on the plain. */
  town: string;
  townWindows: LandscapeWindow[];
  rock: HellenicRock;
  /** Buildings on the Acropolis, back to front. */
  acropolis: HellenicMonument[];
  /** Theatre and Odeion on the south slope. */
  slope: HellenicMonument[];
  /** Hephaisteion, Agora, houses (buildings first, then trees). */
  city: HellenicMonument[];
  foreground: HellenicMonument[];
  tufts: string;
  /** Low shrubs dotted over the near ground (texture). */
  shrubs: string;
}

export const GROUND_Y = 180;

const smooth = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};
const bump = (t: number) => (Math.abs(t) >= 1 ? 0 : Math.cos((Math.PI * t) / 2) ** 2);

/**
 * Height of the ground at x: Kolonos Agoraios on the left (flat top 14–46 for
 * the Hephaisteion), the plain of the Agora in the middle, the Areopagus and
 * the foot of the Acropolis on the right.
 */
export const groundY = (x: number): number => {
  let t = 0;
  if (x < 14) t = (14 - x) / 54;
  else if (x > 46) t = (x - 46) / 54;
  const kolonos = 12 * (1 - smooth(t));
  const areopagus = 6 * bump((x - 204) / 17);
  const foot = 2.5 * bump((x - 275) / 55);
  return GROUND_Y - kolonos - areopagus - foot;
};

const polyline = (from: number, to: number, step: number, y: (x: number) => number) => {
  let d = '';
  for (let x = from; x <= to + 1e-6; x += step) d += `${d ? ' L' : 'M'} ${fmt(x)} ${fmt(y(x))}`;
  return d;
};

/** Top edge of the ground, across the whole visible span. */
export const GROUND_TOP = polyline(SCENE_X0, SCENE_X1, 2, groundY);

/** Snow lying on the ground: a band under the crest. */
export const SNOW_BAND = (() => {
  let back = '';
  for (let x = SCENE_X1; x >= SCENE_X0; x -= 4) back += ` L ${fmt(x)} ${fmt(groundY(x) + 4.5)}`;
  return `${polyline(SCENE_X0, SCENE_X1, 4, x => groundY(x) - 0.4)}${back} Z`;
})();

// ── Shape helpers (local units, v up; all sub-paths counter-clockwise) ─────

/** Lumpy crown of foliage: lobes bulge outwards between points on an ellipse. */
const crown = (
  p: Pen,
  cu: number,
  cv: number,
  rx: number,
  ry: number,
  n: number,
  rand: Rand,
) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * (i + rand() * 0.35)) / n;
    const r = 0.88 + rand() * 0.2;
    return { a, r };
  });
  const at = (a: number, r: number) => [cu + rx * r * Math.cos(a), cv + ry * r * Math.sin(a)];
  const [u0, v0] = at(pts[0].a, pts[0].r);
  p.M(u0, v0);
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const bEnd = i === n - 1 ? b.a + Math.PI * 2 : b.a;
    const [ua, va] = at(a.a, a.r);
    const [ub, vb] = at(b.a, b.r);
    const [um, vm] = at((a.a + bEnd) / 2, ((a.r + b.r) / 2) * 1.32);
    p.C(
      ua + (um - ua) * 0.8,
      va + (vm - va) * 0.8,
      ub + (um - ub) * 0.8,
      vb + (vm - vb) * 0.8,
      ub,
      vb,
    );
  }
  return p.Z();
};

interface TempleSpec {
  /** Width of the (foreshortened) front, columns, height of the shafts. */
  front: number;
  cols: number;
  /** Length of the visible flank and its columns (0: a plain wall). */
  side: number;
  flankCols: number;
  colH: number;
  steps: number;
  ent: number;
  ped: number;
  /** Doric frieze (triglyph ticks) or Ionic (plain band). */
  doric: boolean;
}

/**
 * Peripteral temple in three-quarter view: the front (columns, pediment) on the
 * left, the flank receding to the right, the roof ridge running from the front
 * gable to the hidden back gable. The front plane takes the light (relief), the
 * flank stays in shade except for its round columns.
 */
const temple = (k: ShapeKit, t: TempleSpec) => {
  const W = t.front + t.side;
  const e = t.steps + t.colH;
  const top = e + t.ent;
  k.body.rect(0, 0, W, t.steps);
  k.body.rect(0.2, t.steps, W - 0.4, t.colH);
  k.body.rect(-0.15, e, W + 0.3, t.ent);
  k.body.poly([
    -0.35,
    top,
    W + 0.35,
    top,
    t.front / 2 + t.side,
    top + t.ped,
    t.front / 2,
    top + t.ped,
  ]);

  // Lit front: steps, entablature, tympanum; then every column shaft.
  k.relief.rect(0, 0, t.front, t.steps);
  k.relief.rect(-0.15, e, t.front + 0.15, t.ent);
  k.relief.poly([0.5, top + 0.25, t.front - 0.5, top + 0.25, t.front / 2, top + t.ped - 0.35]);
  const cw = Math.min(0.9, (t.front / t.cols) * 0.52);
  for (let i = 0; i < t.cols; i++) {
    const u = 0.3 + ((t.front - 0.6 - cw) * i) / (t.cols - 1);
    k.relief.rect(u, t.steps, cw, t.colH);
  }
  for (let i = 1; i <= t.flankCols; i++) {
    const u = t.front + ((t.side - 0.3 - cw) * i) / t.flankCols;
    k.relief.rect(u, t.steps, cw * 0.92, t.colH);
  }

  // Steps, architrave, frieze rhythm, the corner edge and the raking cornice.
  for (let i = 1; i < 3; i++) k.detail.line(0, (t.steps * i) / 3, W, (t.steps * i) / 3);
  k.detail.line(-0.15, e + t.ent * 0.42, W + 0.15, e + t.ent * 0.42);
  if (t.doric) {
    const pitch = Math.max(0.9, cw * 1.9);
    for (let u = 0.4; u < W - 0.2; u += pitch) k.detail.line(u, e + t.ent * 0.5, u, top - 0.2);
  }
  k.detail.line(t.front, 0, t.front, top);
  k.detail.poly([0.5, top + 0.25, t.front - 0.5, top + 0.25, t.front / 2, top + t.ped - 0.35]);
};

/** Standing figure (Karyatid, statue): skirt, torso, head; on v0, height h, centred on u. */
const figure = (p: Pen, u: number, v0: number, w: number, h: number) => {
  p.poly([
    u - w / 2,
    v0,
    u + w / 2,
    v0,
    u + w * 0.3,
    v0 + h * 0.72,
    u - w * 0.3,
    v0 + h * 0.72,
  ]);
  p.rect(u - w * 0.3, v0 + h * 0.7, w * 0.6, h * 0.16);
  p.dome(u, v0 + h * 0.86, w * 0.24, h * 0.14);
};

/** One block of a house: plastered walls, low tiled roof, small windows. */
const houseBlock = (k: ShapeKit, u: number, w: number, h: number, rand: Rand) => {
  k.body.rect(u, 0, w, h);
  const roof = [u - 0.3, h, u + w + 0.3, h, u + w * 0.62, h + 0.9, u + w * 0.38, h + 0.9];
  k.body.poly(roof);
  k.relief.poly(roof);
  k.window(u + 0.8, h - 1.3, 0.6, 0.7, rand() < 0.55);
  if (w > 4.5) k.window(u + w - 1.4, h - 1.3, 0.6, 0.7, rand() < 0.55);
};

/** A flat ellipse as a closed path (scrub, shrubs). */
const dot = (x: number, y: number, r: number, squash: number) =>
  ` M ${fmt(x - r)} ${fmt(y)} a ${fmt(r)} ${fmt(r * squash)} 0 1 0 ${fmt(2 * r)} 0 a ${fmt(r)} ${fmt(r * squash)} 0 1 0 ${fmt(-2 * r)} 0 Z`;

// ── The monuments ──────────────────────────────────────────────────────────

/** Local width and height of each shape at scale 1. */
export const SHAPE_SIZE: Record<HellenicKind, { w: number; h: number }> = {
  parthenon: { w: 42, h: 13 },
  erechtheion: { w: 22, h: 9.8 },
  propylaia: { w: 20, h: 10.6 },
  nike: { w: 6.7, h: 4.6 },
  promachos: { w: 5, h: 12 },
  odeion: { w: 24, h: 11 },
  theatre: { w: 26, h: 19.5 },
  hephaisteion: { w: 27, h: 10.4 },
  'stoa-zeus': { w: 30, h: 7.8 },
  'stoa-poikile': { w: 30, h: 7.4 },
  tholos: { w: 8, h: 7.2 },
  house: { w: 11.6, h: 5.4 },
  olive: { w: 10, h: 8.2 },
  cypress: { w: 4.2, h: 20 },
  pine: { w: 13, h: 13.6 },
};

const DRAW: Record<HellenicKind, ShapeDraw> = {
  // Doric octastyle, 8 × 17 columns, 447–432 BCE (Hurwit 1999, ch. 8). West
  // front on the left, south flank receding.
  parthenon: k =>
    temple(k, {
      front: 11,
      cols: 8,
      side: 31,
      flankCols: 16,
      colH: 7,
      steps: 1.3,
      ent: 2,
      ped: 2.4,
      doric: true,
    }),

  // Ionic, finished 406/405 BCE (Hurwit 1999). From the south: the blank south
  // wall with the Karyatid porch (six maidens, four in front) at its west end;
  // the taller north porch shows behind on the left. The north-porch
  // intercolumniations glow at night for the lamp of Kallimachos (Paus.
  // 1.26.6–7; the lamp burned in the cella: placing its glow here is approximate).
  erechtheion: k => {
    k.body.rect(0, 1.4, 5.2, 7.2);
    k.body.rect(-0.2, 8.6, 5.6, 1.2);
    for (const u of [0.5, 2.1, 3.7]) k.relief.rect(u, 1.4, 0.65, 7.2);
    for (const u of [1.25, 2.85]) k.open.rect(u, 1.6, 0.75, 6.2);
    k.body.rect(3, 0, 19, 1);
    k.body.rect(3.3, 1, 18.4, 6);
    k.body.rect(3, 7, 19, 1.2);
    k.body.poly([2.8, 8.2, 22.2, 8.2, 20.4, 9.4, 4.6, 9.4]);
    for (const v of [2.6, 4.2, 5.8]) k.detail.line(10.6, v, 21.7, v);
    k.detail.line(3, 7.5, 22, 7.5);
    // Karyatid porch: podium, maidens, entablature, flat roof.
    k.body.rect(4, 0, 6.6, 2.6);
    k.relief.rect(4, 0, 6.6, 2.6);
    for (const u of [4.9, 6.5, 8.1, 9.7]) figure(k.relief, u, 2.6, 0.95, 3.1);
    k.body.rect(3.8, 5.7, 7, 0.95);
    k.relief.rect(3.8, 5.7, 7, 0.95);
    k.body.rect(3.9, 6.65, 6.8, 0.45);
    k.detail.line(4, 2.6, 10.6, 2.6);
  },

  // Mnesikles' gateway, 437–432 BCE (Hurwit 1999): Doric hexastyle west front
  // with the wider central passage, and the Pinakotheke (north wing, three
  // columns) behind on the left.
  propylaia: k => {
    k.body.rect(0, 0, 7.6, 1);
    k.body.rect(0.2, 1, 7.2, 4.3);
    k.body.rect(-0.1, 5.3, 7.8, 1.2);
    k.body.poly([-0.3, 6.5, 7.9, 6.5, 7.9, 7.3, 1.2, 7.3]);
    for (const u of [1, 3.2, 5.4]) k.relief.rect(u, 1, 0.7, 4.3);
    k.detail.line(0, 5.8, 7.6, 5.8);
    // Central building (drawn in local units shifted by 6).
    const P = (pen: Pen) => ({
      rect: (u: number, v: number, w: number, h: number) => pen.rect(u + 6, v, w, h),
      poly: (pts: number[]) => pen.poly(pts.map((n, i) => (i % 2 === 0 ? n + 6 : n))),
      line: (a: number, b: number, c: number, d: number) => pen.line(a + 6, b, c + 6, d),
    });
    const body = P(k.body);
    const relief = P(k.relief);
    const detail = P(k.detail);
    const open = P(k.open);
    body.rect(0, 0, 14, 1.2);
    body.rect(0.2, 1.2, 13.6, 5.6);
    body.rect(-0.15, 6.8, 14.3, 1.6);
    body.poly([-0.35, 8.4, 14.35, 8.4, 10, 10.6, 4.2, 10.6]);
    relief.rect(0, 0, 8.4, 1.2);
    relief.rect(-0.15, 6.8, 8.55, 1.6);
    relief.poly([0.5, 8.65, 7.9, 8.65, 4.2, 10.3]);
    for (const u of [0.3, 1.5, 2.7, 5, 6.2, 7.4]) relief.rect(u, 1.2, 0.72, 5.6);
    for (const u of [9.6, 11.1, 12.6]) relief.rect(u, 1.2, 0.66, 5.6);
    open.rect(3.6, 1.2, 1.2, 4.2);
    detail.line(8.4, 0, 8.4, 8.4);
    detail.line(-0.15, 7.45, 14.15, 7.45);
    for (let u = 0.4; u < 14; u += 1.2) detail.line(u, 7.6, u, 8.3);
    detail.poly([0.5, 8.65, 7.9, 8.65, 4.2, 10.3]);
    k.torch(5.4, 1.6);
    k.torch(11.2, 1.6);
  },

  // Temple of Athena Nike on its bastion, Ionic amphiprostyle tetrastyle,
  // c. 427–424 BCE (Hurwit 1999). Drawn with its bastion (below v = 0), which
  // stands in front of the Propylaia's south-west corner.
  nike: k => {
    k.body.poly([-1.2, -8.8, 3.3, -10.6, 7.7, -7.4, 7.7, 0, -1.2, 0]);
    k.relief.poly([-1.2, -8.8, 3.3, -10.6, 3.3, 0, -1.2, 0]);
    for (const v of [-2.8, -5.6, -8.4]) k.detail.line(-1.2, v, 7.7, v);
    for (const u of [0.8, 2.6, 4.8, 6.6]) k.detail.line(u, -2.8, u, -5.6);
    k.body.rect(0, 0, 6.7, 0.5);
    k.body.rect(0.1, 0.5, 6.5, 2.5);
    k.body.rect(-0.1, 3, 6.9, 0.7);
    k.body.poly([-0.2, 3.7, 6.9, 3.7, 5.3, 4.6, 1.6, 4.6]);
    k.relief.rect(0, 0, 3.2, 0.5);
    k.relief.rect(-0.1, 3, 3.3, 0.7);
    for (const u of [0.2, 1.05, 1.9, 2.75]) k.relief.rect(u, 0.5, 0.36, 2.5);
    k.detail.line(3.2, 0, 3.2, 3.7);
  },

  // Bronze Athena Promachos by Pheidias, between the Propylaia and the
  // Erechtheion; spear tip and helmet crest seen from the sea off Sounion
  // (Paus. 1.28.2). Height and pose are approximate (no copy survives).
  promachos: k => {
    k.body.rect(0.6, 0, 3.8, 2.2);
    k.body.rect(0.3, 2.2, 4.4, 0.45);
    figure(k.body, 2.4, 2.65, 1.9, 7.6);
    k.body.poly([2.2, 10.1, 2.9, 10.1, 3.1, 10.9, 2.4, 11.1, 1.7, 10.7]);
    k.body.rect(1.05, 2.65, 0.3, 9.1);
    k.body.poly([1.0, 11.75, 1.4, 11.75, 1.2, 12.6]);
    k.body.poly([1.3, 8.3, 2.2, 8.6, 2.1, 8.9, 1.3, 8.7]);
    k.body.poly([3.2, 3.2, 4.4, 3.6, 4.6, 5.6, 3.6, 6.4, 3.0, 5.2]);
    k.relief.poly([1.0, 11.75, 1.4, 11.75, 1.2, 12.6]);
    k.relief.poly([2.2, 10.1, 2.9, 10.1, 3.1, 10.9, 2.4, 11.1, 1.7, 10.7]);
    k.detail.line(0.6, 1.6, 4.4, 1.6);
  },

  // Odeion of Perikles, east of the theatre: a square hall whose roof slopes
  // down from a single peak (Plut. Per. 13.5; Travlos 1971). The porch and
  // the doors are approximate.
  odeion: k => {
    k.body.rect(0, 0, 24, 4.6);
    k.body.poly([-0.6, 4.6, 24.6, 4.6, 12.6, 11]);
    k.relief.poly([-0.6, 4.6, 15.2, 4.6, 12.6, 11]);
    k.relief.rect(0, 0, 15.2, 0.5);
    for (let u = 1.2; u < 23; u += 2.2) k.detail.line(u, 0.5, u, 4.4);
    k.detail.line(15.2, 4.6, 12.6, 11);
    k.detail.line(0, 4.2, 24, 4.2);
    k.open.rect(5.2, 0.5, 1.2, 2.4);
    k.open.rect(9.6, 0.5, 1.2, 2.4);
    k.window(18, 2.4, 0.7, 0.9, true);
  },

  // Theatre of Dionysos in the late 5th c.: the earth cavea on the south
  // slope, the orchestra and a wooden stage building (the stone theatre is
  // Lykourgan, 4th c.; Travlos 1971). Bench lines and skene are approximate.
  theatre: k => {
    k.body.M(0, 18).C(2, 12, 5, 7, 8.5, 5).L(17.5, 5).C(21, 7, 24, 12, 26, 18);
    k.body.C(17, 19.6, 9, 19.6, 0, 18).Z();
    for (let i = 1; i <= 6; i++) {
      const v = 5 + i * 2.05;
      const t = (v - 5) / 13;
      const half = 4.5 + 8.5 * Math.sqrt(t);
      k.detail
        .M(13 - half, v)
        .C(13 - half * 0.5, v - 0.9, 13 + half * 0.5, v - 0.9, 13 + half, v);
    }
    k.detail.line(13, 5, 13, 18.6);
    k.detail.line(7.5, 6.6, 4.4, 15.8);
    k.detail.line(18.5, 6.6, 21.6, 15.8);
    k.relief.M(8.5, 5.4).C(10, 4.1, 16, 4.1, 17.5, 5.4).C(16, 6.1, 10, 6.1, 8.5, 5.4).Z();
    k.body.rect(6.5, 0, 13, 4.2);
    k.body.poly([6.2, 4.2, 19.8, 4.2, 19.4, 4.8, 6.6, 4.8]);
    for (const u of [8.6, 12.4, 16.2]) k.open.rect(u, 0, 1.2, 2.6);
  },

  // Hephaisteion on Kolonos Agoraios, Doric hexastyle peripteral (6 × 13),
  // begun c. 449 BCE (Camp 2001; Travlos 1971). East front faces the Agora.
  hephaisteion: k =>
    temple(k, {
      front: 8,
      cols: 6,
      side: 19,
      flankCols: 12,
      colH: 5.6,
      steps: 1,
      ent: 1.7,
      ped: 2,
      doric: true,
    }),

  // Stoa of Zeus Eleutherios, c. 430–420 BCE: Doric colonnade between two
  // projecting wings with pediments (Camp 2001; Travlos 1971).
  'stoa-zeus': k => {
    k.body.rect(4.6, 0, 20.8, 0.9);
    k.body.rect(4.8, 0.9, 20.4, 4.2);
    k.body.rect(4.6, 5.1, 20.8, 1);
    k.body.poly([4.6, 6.1, 25.4, 6.1, 25.4, 6.9, 4.6, 6.9]);
    for (const u0 of [0, 25.4]) {
      k.body.rect(u0, 0, 4.6, 0.9);
      k.body.rect(u0 + 0.1, 0.9, 4.4, 4.2);
      k.body.rect(u0 - 0.1, 5.1, 4.8, 1);
      k.body.poly([u0 - 0.25, 6.1, u0 + 4.85, 6.1, u0 + 2.3, 7.8]);
      k.relief.rect(u0 - 0.1, 5.1, 4.8, 1);
      k.relief.poly([u0 + 0.4, 6.3, u0 + 4.2, 6.3, u0 + 2.3, 7.5]);
      for (const u of [0.35, 1.75, 3.15]) k.relief.rect(u0 + u, 0.9, 0.55, 4.2);
    }
    for (let u = 5.4; u < 24.8; u += 1.3) k.relief.rect(u, 0.9, 0.5, 4.2);
    k.detail.line(0, 5.55, 30, 5.55);
    for (let u = 0.4; u < 30; u += 1.05) k.detail.line(u, 5.65, u, 6);
  },

  // Stoa Poikile, c. 470–460 BCE, north side of the Agora: a long Doric
  // colonnade (Camp 2001).
  'stoa-poikile': k => {
    k.body.rect(0, 0, 30, 0.9);
    k.body.rect(0.15, 0.9, 29.7, 4.2);
    k.body.rect(-0.15, 5.1, 30.3, 1);
    k.body.poly([-0.35, 6.1, 30.35, 6.1, 28.2, 7.4, 1.8, 7.4]);
    k.relief.rect(-0.15, 5.1, 30.3, 0.45);
    for (let u = 0.4; u < 29.6; u += 1.32) k.relief.rect(u, 0.9, 0.55, 4.2);
    k.detail.line(0, 0.45, 30, 0.45);
    for (let u = 0.4; u < 30; u += 1.05) k.detail.line(u, 5.6, u, 6);
  },

  // Tholos, c. 470 BCE, seat of the prytaneis at the SW corner of the Agora:
  // round drum, conical roof (Camp 2001). The roof's exact profile is unknown.
  tholos: k => {
    k.body.rect(0, 0, 8, 4.2);
    k.body
      .M(-0.3, 4.2)
      .L(8.3, 4.2)
      .C(6.4, 5.4, 5, 6.6, 4, 7.2)
      .C(3, 6.6, 1.6, 5.4, -0.3, 4.2)
      .Z();
    k.relief.rect(0.5, 0, 2.6, 4.2);
    k.relief.M(-0.3, 4.2).L(4, 4.2).L(4, 7.2).C(3, 6.6, 1.6, 5.4, -0.3, 4.2).Z();
    k.detail.line(0, 3.6, 8, 3.6);
    k.detail.line(0, 1.2, 8, 1.2);
    k.open.rect(3.3, 0, 1.4, 2.6);
  },

  // Athenian house: plastered walls, tiled roof, a few small windows; one or two blocks.
  house: (k, rand) => {
    const w1 = 4 + rand() * 2.6;
    const h1 = 2.6 + rand() * 1.4;
    houseBlock(k, 0, w1, h1, rand);
    if (rand() < 0.55)
      houseBlock(k, w1 - 0.4, 3 + rand() * 2, h1 + (rand() < 0.5 ? 1.2 : -0.6), rand);
    k.open.rect(w1 * 0.45, 0, 0.9, 1.6);
  },

  // Olive: short twisted trunk, rounded clumps of grey-green leaves.
  olive: (k, rand) => {
    k.body.poly([
      4.2, 0, 5.6, 0, 5.3, 1.5, 6.4, 3.4, 5.7, 3.7, 5, 2.4, 4.4, 3.8, 3.6, 3.5, 4.5, 1.6,
    ]);
    crown(k.body, 5, 5.4, 4.6, 2.5, 9, rand);
    crown(k.body, 2.6, 4.7, 2.3, 1.6, 6, rand);
    crown(k.body, 7.6, 4.9, 2.3, 1.7, 6, rand);
    crown(k.relief, 3.8, 6.4, 2.2, 1.2, 6, rand);
    crown(k.relief, 6.6, 6.7, 1.8, 1, 5, rand);
  },

  // Mediterranean cypress: tall flame.
  cypress: k => {
    const h = 20;
    k.body
      .M(2.1, h)
      .C(0.7, h * 0.74, -0.1, h * 0.32, 0.9, 1.2)
      .L(1.6, 1)
      .L(1.6, 0)
      .L(2.6, 0)
      .L(2.6, 1)
      .L(3.3, 1.2)
      .C(4.3, h * 0.32, 3.5, h * 0.74, 2.1, h)
      .Z();
    k.relief.M(1.4, 3).C(0.9, 8, 1.2, 13, 2, 17).C(1.9, 12, 1.8, 7, 1.4, 3).Z();
  },

  // Aleppo pine: leaning trunk, flat ragged tiers of needles.
  pine: (k, rand) => {
    k.body.poly([5, 0, 6.3, 0, 6.7, 4, 8.2, 8.9, 7.5, 9.1, 6, 5, 4.6, 8, 4.1, 7.8, 5.6, 4.2]);
    crown(k.body, 8.4, 10, 4.4, 1.7, 8, rand);
    crown(k.body, 4.4, 11.6, 3.5, 1.4, 7, rand);
    crown(k.body, 9.4, 12.4, 2.8, 1.1, 6, rand);
    crown(k.relief, 7.6, 10.9, 2.6, 0.7, 5, rand);
    crown(k.relief, 3.9, 12.3, 2, 0.6, 5, rand);
  },
};

const build = (
  kind: HellenicKind,
  x0: number,
  base: number,
  s: number,
  flip: boolean,
  rand: Rand,
): HellenicMonument =>
  buildShape(kind, DRAW[kind], SHAPE_SIZE[kind].w, x0, base, s, flip, rand);

/** Stands a shape on the ground: on the lower end of the slope, 0.6 into it. */
const onGround = (kind: HellenicKind, x0: number, s: number, flip: boolean, rand: Rand) => {
  const w = SHAPE_SIZE[kind].w * s;
  const base = Math.max(groundY(x0), groundY(x0 + w), groundY(x0 + w / 2)) + 0.6;
  return build(kind, x0, base, s, flip, rand);
};

// ── The Acropolis rock (fixed) ─────────────────────────────────────────────

/** Plateau (top of the south wall). */
export const PLATEAU_Y = 150;

const jagged = (pts: number[], rand: Rand, amp: number) => {
  let d = `M ${fmt(pts[0])} ${fmt(pts[1])}`;
  for (let i = 2; i < pts.length; i += 2) {
    const [xa, ya, xb, yb] = [pts[i - 2], pts[i - 1], pts[i], pts[i + 1]];
    const n = Math.max(1, Math.round(Math.hypot(xb - xa, yb - ya) / 2.5));
    for (let j = 1; j <= n; j++) {
      const t = j / n;
      const jit = j < n ? (rand() - 0.5) * amp : 0;
      d += ` L ${fmt(xa + (xb - xa) * t + jit * 0.5)} ${fmt(ya + (yb - ya) * t + jit)}`;
    }
  }
  return d;
};

const ROCK_OUTLINE = [
  184, 184, 190, 180, 197, 174, 203, 167.5, 208, 160.5, 214, 155, 221, 151.6, 223, 150, 313,
  150, 315.5, 153, 318, 158.5, 321.5, 163.5, 326, 170, 332, 176, 338, 180.5, 343, 184,
];

/** Kimonian south wall: ashlar band under the plateau edge, with a ragged foot. */
const rockWall = (rand: Rand) => {
  let wall = `M 221 151.6 L 223 150 L 313 150 L 315.5 153 L 316.4 156.4`;
  for (let x = 314; x >= 222; x -= 3) wall += ` L ${fmt(x)} ${fmt(156.2 + rand() * 1.4)}`;
  return `${wall} L 219 154 Z`;
};

/** Coursing and joints of the wall, cracks down the cliff face. */
const rockDetail = (rand: Rand) => {
  let detail = 'M 223 152.2 L 314 152.2 M 222 154.3 L 315 154.3';
  for (let x = 228; x < 312; x += 7 + rand() * 4)
    detail += ` M ${fmt(x)} 150.2 L ${fmt(x)} 156`;
  for (let i = 0; i < 16; i++) {
    const x = 220 + rand() * 98;
    const y = 158 + rand() * 4;
    detail += ` M ${fmt(x)} ${fmt(y)} l ${fmt((rand() - 0.5) * 2)} ${fmt(3 + rand() * 5)} l ${fmt((rand() - 0.5) * 2)} ${fmt(2 + rand() * 4)}`;
  }
  return detail;
};

/** Sunlit facets: irregular slabs of the cliff below the wall. */
const rockFacets = (rand: Rand) => {
  let facets = '';
  for (let x = 222; x < 314; x += 6 + rand() * 6) {
    const w = 3 + rand() * 5;
    const y = 157 + rand() * 1.5;
    const h = 4 + rand() * 6;
    facets += ` M ${fmt(x)} ${fmt(y)} L ${fmt(x + w)} ${fmt(y + 0.4)} L ${fmt(x + w * 0.8)} ${fmt(y + h)} L ${fmt(x + w * 0.1)} ${fmt(y + h * 0.8)} Z`;
  }
  return `${facets} M 205 168.5 L 208 160.8 L 214 155.4 L 216 157 L 211 165 Z`;
};

/** Top of the lower slopes (below the cliffs) at x. */
const slopeTop = (x: number) => {
  if (x < 210) return 166 + (210 - x) * 0.35;
  if (x > 318) return 162 + (x - 318) * 0.8;
  return 168;
};

const buildRock = (): HellenicRock => {
  const rand = seededRandom(406);
  const body = `${jagged(ROCK_OUTLINE, rand, 1.1)} Z`;
  const wall = rockWall(rand);
  const detail = rockDetail(rand);
  const facets = rockFacets(rand);
  let scrub = '';
  for (let i = 0; i < 46; i++) {
    const x = 188 + rand() * 150;
    scrub += dot(x, slopeTop(x) + rand() * 9, 0.6 + rand() * 0.9, 0.7);
  }
  return { body, facets, wall, detail, scrub };
};

const ROCK = buildRock();

const buildAcropolis = (): HellenicMonument[] => {
  const rand = seededRandom(447);
  return [
    // The sacred olive in the Pandroseion, west of the Erechtheion (Hdt. 8.55; Paus. 1.27.2).
    build('olive', 239.2, PLATEAU_Y + 1.2, 0.55, false, rand),
    build('erechtheion', 243, PLATEAU_Y + 1.4, 1, false, rand),
    build('promachos', 233.6, PLATEAU_Y + 0.6, 1, false, rand),
    build('propylaia', 206.5, 154.2, 1, false, rand),
    build('nike', 204.7, 158.8, 1, false, rand),
    build('parthenon', 263, PLATEAU_Y + 1, 1, false, rand),
  ];
};

const ACROPOLIS = buildAcropolis();

const buildSlope = (): HellenicMonument[] => {
  const rand = seededRandom(440);
  return [
    build('theatre', 273, 179, 1, false, rand),
    onGround('odeion', 299.5, 1, false, rand),
  ];
};

const SLOPE = buildSlope();

/** Lykabettos: steep limestone cone, its east flank in shade, scrub on the slopes. */
const buildLykabettos = () => {
  const rand = seededRandom(277);
  const body =
    'M 46 184 L 52 178 C 66 174 78 160 85.5 149 C 88.5 144.5 90 141.4 92.4 140.6 C 93.6 140.2 94.6 140.8 95.4 141.8 C 97.6 144.6 99.4 148.6 102.6 153.4 C 109 162.6 120 171 138 178 L 144 184 Z';
  const shade =
    'M 95.4 141.8 C 97.6 144.6 99.4 148.6 102.6 153.4 C 109 162.6 120 171 138 178 L 144 184 L 104 184 C 101 172 98.4 156 95.4 141.8 Z';
  let scrub = '';
  for (let i = 0; i < 28; i++) {
    const t = rand();
    const y = 146 + rand() * 32;
    // Inside the cone: half-width grows with depth below the top.
    const half = 4 + (y - 146) * 1.15;
    scrub += dot(93.5 + (t - 0.5) * 2 * half * 0.85, y, 0.45 + rand() * 0.6, 0.75);
  }
  return { body, shade, scrub: scrub.trim() };
};

const LYKABETTOS = buildLykabettos();

/**
 * The Panathenaic Way: from the Dipylon (bottom left, near the viewer) across
 * the Agora to the foot of the Acropolis ramp (Camp 2001). Widens towards the
 * viewer; the course is approximate.
 */
export const PANATHENAIC_WAY =
  'M 26 200 C 70 192 132 184 192 177.2 L 197.6 176 C 140 184.4 92 193 52 200 Z';

// ── Seeded parts ───────────────────────────────────────────────────────────

/** One row of tiny distant roofs between `from` and `to`; lit windows go to `windows`. */
const townRow = (from: number, to: number, rand: Rand, windows: LandscapeWindow[]) => {
  let d = '';
  let x = from;
  while (x < to - 2) {
    const w = 1.6 + rand() * 2.4;
    const h = 1.2 + rand() * 1.6;
    const base = Math.min(groundY(x), groundY(x + w)) + 0.4 - rand() * 2.8;
    d += ` M ${fmt(x)} ${fmt(base)} L ${fmt(x + w)} ${fmt(base)} L ${fmt(x + w)} ${fmt(base - h)} L ${fmt(x + w / 2)} ${fmt(base - h - 0.7)} L ${fmt(x)} ${fmt(base - h)} Z`;
    if (rand() < 0.3)
      windows.push({
        x: x + w * 0.4,
        y: base - h * 0.7,
        w: 0.4,
        h: 0.45,
        lit: true,
        delay: rand() * 6,
      });
    x += w + rand() * 1.2;
  }
  return d;
};

/** Tiny distant roofs on the plain; returns the path and the lit windows. */
const buildTown = (rand: Rand, layout: HellenicLayout) => {
  const windows: LandscapeWindow[] = [];
  const spans: [number, number][] =
    layout === 'clock'
      ? [
          [58, 104],
          [190, 206],
        ]
      : [[58, 206]];
  const d = spans.map(([from, to]) => townRow(from, to, rand, windows)).join('');
  return { d: d.trim(), windows };
};

/** Hymettos: long, flat-topped, highest behind the Acropolis. */
const buildHymettos = (rand: Rand) => {
  const p = [rand() * Math.PI * 2, rand() * Math.PI * 2];
  return ridge(
    x =>
      161 -
      12 * smooth((x - 120) / 170) -
      1.6 * Math.sin(x * 0.045 + p[0]) -
      0.8 * Math.sin(x * 0.13 + p[1]),
    186,
  );
};

const pick = <T>(rand: Rand, options: T[]) => options[Math.floor(rand() * options.length)];

/** Houses: the deme of Melite west of Kolonos, the Areopagus slope, and (wide) the plain. */
const buildHouses = (rand: Rand, layout: HellenicLayout): HellenicMonument[] => {
  const clusters: [number, number][] = [
    [-40, 6],
    [196, 214],
  ];
  if (layout === 'wide') clusters.push([108, 192]);
  const houses: HellenicMonument[] = [];
  for (const [from, to] of clusters) {
    let x = from + rand() * 2;
    while (x < to - 6) {
      const s = 0.8 + rand() * 0.3;
      houses.push(onGround('house', x, s, rand() < 0.5, rand));
      x += SHAPE_SIZE.house.w * s * (0.6 + rand() * 0.3) + rand() * 2;
    }
  }
  return houses;
};

const TREE_SLOTS: { x: number; kinds: HellenicKind[] }[] = [
  { x: -30, kinds: ['olive', 'cypress', 'pine'] },
  { x: 3, kinds: ['cypress', 'olive'] },
  { x: -14, kinds: ['pine', 'cypress', 'olive'] },
  { x: 9, kinds: ['cypress'] },
  { x: 44, kinds: ['cypress', 'pine', 'olive'] },
  { x: 48, kinds: ['cypress'] },
  { x: 60, kinds: ['olive', 'cypress'] },
  { x: 96, kinds: ['olive', 'pine', 'cypress'] },
  { x: 214, kinds: ['olive', 'cypress'] },
];

const WIDE_TREE_SLOTS: { x: number; kinds: HellenicKind[] }[] = [
  { x: 116, kinds: ['olive', 'cypress'] },
  { x: 178, kinds: ['olive', 'pine'] },
];

/** One tree in a slot; with `keepLeft`, trees left of the instrument stay left of x 100.5. */
const treeAt = (slot: { x: number; kinds: HellenicKind[] }, keepLeft: boolean, rand: Rand) => {
  const kind = pick(rand, slot.kinds);
  const s = kind === 'cypress' ? 0.55 + rand() * 0.25 : 0.7 + rand() * 0.35;
  const limit = keepLeft && slot.x < 104 ? 100.5 - SHAPE_SIZE[kind].w * s : 400;
  return onGround(kind, Math.min(slot.x + rand() * 3, limit), s, rand() < 0.5, rand);
};

/** Trees on the slopes of Kolonos, around the Agora and below the Acropolis. */
const buildTrees = (rand: Rand, layout: HellenicLayout): HellenicMonument[] => {
  const slots = layout === 'wide' ? [...TREE_SLOTS, ...WIDE_TREE_SLOTS] : TREE_SLOTS;
  const keepLeft = layout === 'clock';
  return slots.filter(() => rand() >= 0.25).map(slot => treeAt(slot, keepLeft, rand));
};

const buildCity = (rand: Rand, layout: HellenicLayout): HellenicMonument[] => {
  // Hephaisteion on the flat top of Kolonos Agoraios, east front towards the
  // Agora; at its foot the Tholos and one of the stoas (the other one, wide).
  const stoa = rand() < 0.5 ? 'stoa-zeus' : 'stoa-poikile';
  const other = stoa === 'stoa-zeus' ? 'stoa-poikile' : 'stoa-zeus';
  const buildings = [
    onGround('hephaisteion', 15.5, 0.95, true, rand),
    onGround('tholos', 52, 0.95, false, rand),
    onGround(stoa, 64 + rand() * 3, 1.08, false, rand),
    ...buildHouses(rand, layout),
  ];
  if (layout === 'wide') buildings.push(onGround(other, 132 + rand() * 6, 0.9, false, rand));
  return [...buildings, ...buildTrees(rand, layout)];
};

/**
 * Foreground frame: a big olive or Aleppo pine on the left edge, cypresses on
 * the right edge (the Odeion and the Hephaisteion stay clear).
 */
const buildForeground = (rand: Rand): HellenicMonument[] => {
  const fg = (kind: HellenicKind, x0: number, s: number, flip: boolean) =>
    build(kind, x0, 201, s, flip, rand);
  const leftTree =
    rand() < 0.6 ? fg('olive', -42 + rand() * 3, 4.2, false) : fg('pine', -44, 3.3, true);
  const right = [fg('cypress', 320.5 + rand() * 2, 1.7, false)];
  if (rand() < 0.5) right.push(fg('cypress', 326, 2.2, true));
  return [leftTree, ...right];
};

/** Low shrubs over the near ground, away from the instrument in the clock layout. */
const buildShrubs = (rand: Rand, layout: HellenicLayout) => {
  let shrubs = '';
  for (let i = 0; i < 34; i++) {
    const x = SCENE_X0 + rand() * (SCENE_X1 - SCENE_X0);
    const y = groundY(x) + 2 + rand() * (196 - groundY(x));
    const r = 0.5 + rand() * 0.9 * ((y - 178) / 20 + 0.4);
    if (layout === 'wide' || x < 108 || x > 192) shrubs += dot(x, y, r, 0.6);
  }
  return shrubs.trim();
};

export const generateHellenicLandscape = (
  seed: number,
  layout: HellenicLayout = 'clock',
): HellenicLandscape => {
  const rand = seededRandom(seed);
  const ridgeFar = buildHymettos(rand);
  const town = buildTown(rand, layout);
  const city = buildCity(rand, layout);
  const foreground = buildForeground(rand);
  const shrubs = buildShrubs(rand, layout);

  return {
    shrubs,
    ridgeFar,
    lykabettos: LYKABETTOS,
    town: town.d,
    townWindows: town.windows,
    rock: ROCK,
    acropolis: ACROPOLIS,
    slope: SLOPE,
    city,
    foreground,
    tufts:
      layout === 'clock'
        ? grassTufts(rand, 60, groundY, 116, 184)
        : grassTufts(rand, 70, groundY),
  };
};

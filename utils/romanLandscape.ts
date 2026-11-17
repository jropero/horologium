/**
 * Procedural landscape of the Roman hero (300×200 viewBox, ground line y = 180).
 *
 * Back to front: two mountain ridges, a long aqueduct across the plain (its
 * arches are real holes, so the sky shows through), the monuments on the two
 * hills left and right of the sundial, and dark foreground trees that frame the
 * view. The centre (x 100–200) stays free of monuments for the instrument.
 *
 * Everything is derived from a seed (the calendar day), so the city changes
 * from day to day but is stable within one. Drawing and lighting live in
 * `components/RomanScene.tsx`; this module only produces geometry.
 */

export type MonumentKind =
  | 'temple'
  | 'pantheon'
  | 'colosseum'
  | 'arch'
  | 'column'
  | 'obelisk'
  | 'insula'
  | 'villa'
  | 'cypress'
  | 'pine';

/** A window; `lit` ones glow at night. */
export interface LandscapeWindow {
  x: number;
  y: number;
  w: number;
  h: number;
  lit: boolean;
  /** Flicker phase in seconds. */
  delay: number;
}

export interface LandscapeTorch {
  x: number;
  y: number;
  delay: number;
}

export interface Monument {
  id: string;
  kind: MonumentKind;
  /** Silhouette. */
  body: string;
  /** Raised parts that catch the light (columns, gilded tips); filled. */
  relief: string;
  /** Engraved lines (cornices, steps, spiral bands); stroked. */
  detail: string;
  /** Doors and arcades: dim by day, lit from inside at night. */
  openings: string;
  windows: LandscapeWindow[];
  torches: LandscapeTorch[];
}

export interface RomanLandscape {
  ridgeFar: string;
  ridgeNear: string;
  aqueduct: string;
  /** Channel line along the top of the aqueduct. */
  aqueductDetail: string;
  monuments: Monument[];
  foreground: Monument[];
  /** Grass tufts along the crest of the ground. */
  tufts: string;
}

/** Ground line at the centre of the scene. */
export const GROUND_Y = 180;

/**
 * Horizontal span every full-width layer must cover. The hero box is 16:9 and
 * the viewBox 3:2 with the default `xMidYMid meet`, so the SVG shows x −30…330
 * (measured at 390–1600 px widths); 10 units of margin on each side.
 */
export const SCENE_X0 = -40;
export const SCENE_X1 = 340;
export const SCENE_W = SCENE_X1 - SCENE_X0;

/** Top edge of the ground: a hill on each side, flat in the middle and beyond the edges. */
export const GROUND_TOP = `M ${SCENE_X0} 180 L 0 180 Q 50 160 100 180 L 200 180 Q 250 160 300 180 L ${SCENE_X1} 180`;

/** Height of the ground at x (matches GROUND_TOP). */
export const groundY = (x: number): number => {
  const z = x <= 150 ? x : 300 - x;
  if (z >= 100) return GROUND_Y;
  const t = Math.max(0, z) / 100;
  return GROUND_Y - 40 * t + 40 * t * t;
};

/** Seeded pseudo-random generator (Lehmer), values in [0, 1). */
export const seededRandom = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const n = (v: number) => (Math.round(v * 100) / 100).toString();

/** Bézier handle length for a quarter circle of radius 1. */
const K = 0.5523;

/**
 * Path builder in monument-local units: u runs right from the left edge, v runs
 * up from the base. `flip` mirrors the monument inside its own width. Only
 * M/L/C/Z are emitted, so mirroring needs no arc-flag fixes.
 */
class Pen {
  private out: string[] = [];

  constructor(
    private x0: number,
    private base: number,
    private s: number,
    private width: number,
    private flip: boolean,
  ) {}

  x(u: number) {
    return this.x0 + (this.flip ? this.width - u : u) * this.s;
  }

  y(v: number) {
    return this.base - v * this.s;
  }

  M(u: number, v: number) {
    this.out.push(`M${n(this.x(u))} ${n(this.y(v))}`);
    return this;
  }

  L(u: number, v: number) {
    this.out.push(`L${n(this.x(u))} ${n(this.y(v))}`);
    return this;
  }

  C(u1: number, v1: number, u2: number, v2: number, u: number, v: number) {
    this.out.push(
      `C${n(this.x(u1))} ${n(this.y(v1))} ${n(this.x(u2))} ${n(this.y(v2))} ${n(this.x(u))} ${n(this.y(v))}`,
    );
    return this;
  }

  Z() {
    this.out.push('Z');
    return this;
  }

  rect(u: number, v: number, w: number, h: number) {
    return this.M(u, v)
      .L(u + w, v)
      .L(u + w, v + h)
      .L(u, v + h)
      .Z();
  }

  /** Closed polygon from a flat list u0, v0, u1, v1, … */
  poly(pts: number[]) {
    this.M(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) this.L(pts[i], pts[i + 1]);
    return this.Z();
  }

  line(u1: number, v1: number, u2: number, v2: number) {
    return this.M(u1, v1).L(u2, v2);
  }

  /** Round-topped opening: bottom-left corner (u, v), width w, total height h. */
  arch(u: number, v: number, w: number, h: number) {
    const r = w / 2;
    const t = v + Math.max(0, h - r);
    return this.M(u, v)
      .L(u, t)
      .C(u, t + r * K, u + r - r * K, t + r, u + r, t + r)
      .C(u + r + r * K, t + r, u + w, t + r * K, u + w, t)
      .L(u + w, v)
      .Z();
  }

  /** Half ellipse standing on the line v, centred on cu. */
  dome(cu: number, v: number, rx: number, ry: number) {
    return this.M(cu - rx, v)
      .C(cu - rx, v + ry * K, cu - rx * K, v + ry, cu, v + ry)
      .C(cu + rx * K, v + ry, cu + rx, v + ry * K, cu + rx, v)
      .Z();
  }

  /**
   * Part of an outline that runs along the base from right to left: steps up
   * into a round-topped gap between uR and uL and comes back down. `straight`
   * is the height of the vertical jambs.
   */
  gap(uR: number, uL: number, straight: number) {
    const r = (uR - uL) / 2;
    const mid = (uR + uL) / 2;
    return this.L(uR, 0)
      .L(uR, straight)
      .C(uR, straight + r * K, mid + r * K, straight + r, mid, straight + r)
      .C(mid - r * K, straight + r, uL, straight + r * K, uL, straight)
      .L(uL, 0);
  }

  toString() {
    return this.out.join(' ');
  }
}

interface Kit {
  body: Pen;
  relief: Pen;
  detail: Pen;
  open: Pen;
  windows: LandscapeWindow[];
  torches: LandscapeTorch[];
  window: (u: number, v: number, w: number, h: number, lit: boolean) => void;
  torch: (u: number, v: number) => void;
}

type Rand = () => number;

/** Local width and height of each monument at scale 1. */
export const MONUMENT_SIZE: Record<MonumentKind, { w: number; h: number }> = {
  temple: { w: 24, h: 20.6 },
  pantheon: { w: 31, h: 18.6 },
  colosseum: { w: 42, h: 17.5 },
  arch: { w: 17, h: 17.3 },
  column: { w: 5, h: 33.6 },
  obelisk: { w: 5, h: 30 },
  insula: { w: 15, h: 18.4 },
  villa: { w: 26, h: 12.5 },
  cypress: { w: 4.2, h: 24 },
  pine: { w: 14, h: 22 },
};

const DRAW: Record<MonumentKind, (k: Kit, rand: Rand) => void> = {
  // Hexastyle temple on a podium, door glowing between the middle columns.
  temple: k => {
    k.body.rect(0, 0, 24, 2.2);
    k.body.rect(1.2, 2.2, 21.6, 10.3);
    k.body.rect(-0.3, 12.5, 24.6, 1.7);
    k.body.poly([-0.9, 14.2, 12, 19.5, 24.9, 14.2]);
    k.body.poly([11.3, 19.2, 12, 20.6, 12.7, 19.2]);
    for (let i = 0; i < 6; i++) k.relief.rect(1.4 + i * 3.98, 2.2, 1.3, 10.3);
    k.detail.poly([2.4, 14.8, 12, 18.6, 21.6, 14.8]);
    k.detail.line(-0.3, 13.4, 24.3, 13.4);
    k.detail.line(0, 0.75, 24, 0.75).line(0, 1.5, 24, 1.5);
    k.open.rect(10.8, 2.2, 2.4, 6.4);
    k.torch(-1.2, 1.4);
    k.torch(25.2, 1.4);
  },

  // Rotunda with stepped dome and oculus, columned portico in front.
  pantheon: k => {
    k.body.rect(9, 0, 22, 9.5);
    k.body.rect(8.6, 9.5, 22.8, 0.9);
    k.body.rect(10.4, 10.4, 19.2, 1.1);
    k.body.rect(11.4, 11.5, 17.2, 1);
    k.body.dome(20, 10.4, 10.6, 8.2);
    k.body.rect(7, 0, 4, 12.4);
    k.body.rect(-0.4, 0, 9.8, 1.2);
    k.body.rect(0.3, 1.2, 8.6, 7.8);
    k.body.rect(-0.2, 9, 9.6, 1.3);
    k.body.poly([-0.7, 10.3, 4.6, 14.2, 9.9, 10.3]);
    for (let i = 0; i < 4; i++) k.relief.rect(0.5 + i * 2.5, 1.2, 1, 7.8);
    for (const v of [13.4, 14.9, 16.3]) {
      const half = 10.6 * Math.sqrt(1 - ((v - 10.4) / 8.2) ** 2);
      k.detail.line(20 - half, v, 20 + half, v);
    }
    k.detail.line(9, 5, 31, 5);
    k.detail.poly([1, 10.8, 4.6, 13.4, 8.2, 10.8]);
    k.open.rect(3.6, 1.2, 2, 5.2);
    k.open.rect(19.2, 18.2, 1.6, 0.5);
    k.torch(-1.4, 1);
  },

  // Three tiers of arcades, foreshortened towards the sides like a cylinder.
  colosseum: k => {
    k.body.poly([0, 0, 0, 15.4, 0.5, 16.8, 2, 17.5, 40, 17.5, 41.5, 16.8, 42, 15.4, 42, 0]);
    const ARCHES = 13;
    for (let i = 0; i < ARCHES; i++) {
      const theta = ((-78 + (i * 156) / (ARCHES - 1)) * Math.PI) / 180;
      const u = 21 + 20.2 * Math.sin(theta);
      const w = Math.max(0.55, 2.6 * Math.cos(theta));
      for (const v of [0.7, 5, 9.3]) k.open.arch(u - w / 2, v, w, 3.4);
      if (i % 2 === 0) k.open.rect(u - w * 0.25, 14.5, w * 0.5, 1.1);
    }
    for (const v of [4.55, 8.85, 13.15]) k.detail.line(0, v, 42, v);
    k.detail.line(1.2, 16.7, 40.8, 16.7);
    k.torch(-1.2, 1.2);
    k.torch(43.2, 1.2);
  },

  // Triple arch with attic and quadriga; the three passages are real holes.
  arch: k => {
    k.body
      .M(0, 0)
      .L(0, 10.6)
      .L(-0.4, 10.6)
      .L(-0.4, 11.4)
      .L(0.3, 11.4)
      .L(0.3, 15)
      .L(16.7, 15)
      .L(16.7, 11.4)
      .L(17.4, 11.4)
      .L(17.4, 10.6)
      .L(17, 10.6)
      .L(17, 0)
      .gap(14.9, 12.5, 3.6)
      .gap(11, 6, 6.3)
      .gap(4.5, 2.1, 3.6)
      .Z();
    k.body.poly([6, 15, 6.4, 16.6, 7.4, 16.1, 8.5, 17.3, 9.6, 16.2, 10.6, 16.8, 11, 15]);
    for (const u of [0.6, 4.85, 11.35, 15.6]) k.relief.rect(u, 0, 0.8, 10.6);
    k.detail.line(0.3, 12.2, 16.7, 12.2);
    k.detail.rect(4, 12.6, 9, 1.9);
  },

  // Honorary column with a spiral frieze and a statue on top.
  column: k => {
    k.body.rect(0, 0, 5, 4.2);
    k.body.rect(0.5, 4.2, 4, 0.8);
    k.body.rect(1.2, 5, 2.6, 23.5);
    k.body.rect(0.6, 28.5, 3.8, 1.1);
    k.body.rect(2.05, 29.6, 0.9, 2.6);
    k.body.poly([1.95, 32.2, 2.5, 33.6, 3.05, 32.2]);
    for (let v = 6; v < 27.5; v += 1.7) k.detail.line(1.2, v, 3.8, v + 0.8);
    k.detail.line(0, 3.4, 5, 3.4);
    k.detail.line(3.2, 30, 3.6, 33.4);
    k.open.rect(2.1, 0, 0.8, 1.7);
  },

  // Egyptian obelisk on a base, gilded pyramidion.
  obelisk: k => {
    k.body.rect(0, 0, 5, 2.5);
    k.body.poly([0.9, 2.5, 4.1, 2.5, 3.3, 27, 1.7, 27]);
    k.body.poly([1.7, 27, 3.3, 27, 2.5, 30]);
    k.relief.poly([1.7, 27, 3.3, 27, 2.5, 30]);
    for (let v = 6; v <= 24; v += 3) k.detail.line(2, v, 3, v);
    k.detail.line(0, 1.7, 5, 1.7);
  },

  // Apartment block: three storeys of windows, some of them lit.
  insula: (k, rand) => {
    k.body.rect(0, 0, 15, 16);
    k.body.poly([-0.6, 16, 7.5, 18.4, 15.6, 16]);
    for (const v of [4.2, 8.2, 12.2])
      for (const u of [2, 5.2, 8.4, 11.6]) k.window(u, v, 1.3, 1.7, rand() < 0.45);
    k.detail.line(1, 7.4, 14, 7.4).line(1, 11.4, 14, 11.4);
    k.open.arch(6.4, 0, 2.2, 3);
  },

  // Country house: gabled main block and a low colonnaded wing.
  villa: (k, rand) => {
    k.body.rect(0, 0, 10, 9);
    k.body.poly([-0.7, 9, 5, 12.5, 10.7, 9]);
    k.body.rect(10, 0, 16.4, 0.5);
    k.body.rect(10, 0.5, 16, 5.1);
    k.body.poly([10, 5.6, 10, 7.4, 26.6, 5.6]);
    for (let i = 0; i < 5; i++) k.relief.rect(11 + i * 3.4, 0.5, 0.7, 5.1);
    k.window(2.2, 4.6, 1.4, 2, rand() < 0.6);
    k.window(6.4, 4.6, 1.4, 2, rand() < 0.6);
    k.detail.poly([1.4, 9.5, 5, 11.6, 8.6, 9.5]);
    k.open.arch(4, 0, 2, 3.4);
  },

  // Tall flame-shaped cypress.
  cypress: k => {
    const h = 24;
    k.body
      .M(2.1, h)
      .C(3.5, h * 0.74, 4.3, h * 0.32, 3.3, 1.2)
      .L(2.6, 1)
      .L(2.6, 0)
      .L(1.6, 0)
      .L(1.6, 1)
      .L(0.9, 1.2)
      .C(-0.1, h * 0.32, 0.7, h * 0.74, 2.1, h)
      .Z();
  },

  // Stone pine: bare forked trunk under an umbrella crown.
  pine: k => {
    k.body.poly([6.5, 0, 7.6, 0, 7.4, 12, 10, 16, 9, 16, 7, 13.4, 4.5, 16, 3.7, 16, 6.6, 12]);
    k.body
      .M(0.5, 16)
      .C(0, 19, 3, 21.5, 6, 21)
      .C(8, 22.6, 11.5, 22, 12.5, 20)
      .C(14.5, 19.5, 14.2, 16.5, 12.8, 16.2)
      .C(10, 15.2, 4, 15.2, 0.5, 16)
      .Z();
  },
};

const buildMonument = (
  kind: MonumentKind,
  x0: number,
  base: number,
  s: number,
  flip: boolean,
  rand: Rand,
): Monument => {
  const width = MONUMENT_SIZE[kind].w;
  const pen = () => new Pen(x0, base, s, width, flip);
  const body = pen();
  const windows: LandscapeWindow[] = [];
  const torches: LandscapeTorch[] = [];
  const kit: Kit = {
    body,
    relief: pen(),
    detail: pen(),
    open: pen(),
    windows,
    torches,
    window: (u, v, w, h, lit) =>
      windows.push({
        x: Math.min(body.x(u), body.x(u + w)),
        y: body.y(v + h),
        w: w * s,
        h: h * s,
        lit,
        delay: rand() * 6,
      }),
    torch: (u, v) => torches.push({ x: body.x(u), y: body.y(v), delay: rand() * 4 }),
  };
  DRAW[kind](kit, rand);
  return {
    id: `${kind}-${n(x0)}`,
    kind,
    body: kit.body.toString(),
    relief: kit.relief.toString(),
    detail: kit.detail.toString(),
    openings: kit.open.toString(),
    windows,
    torches,
  };
};

/** Smooth ridge line from sample points, closed down to `floor`. */
const ridge = (sample: (x: number) => number, floor: number): string => {
  const STEP = 10;
  let d = `M ${SCENE_X0 - 5} ${floor} L ${SCENE_X0 - 5} ${n(sample(SCENE_X0 - 5))}`;
  for (let x = SCENE_X0; x <= SCENE_X1 + STEP; x += STEP) {
    // Quadratic through the midpoints: the samples act as control points.
    const midX = x + STEP / 2;
    d += ` Q ${x} ${n(sample(x))} ${midX} ${n((sample(x) + sample(x + STEP)) / 2)}`;
  }
  return `${d} L ${SCENE_X1 + 2 * STEP} ${floor} Z`;
};

/** One element of a hill, placed by its outer edge z (0 = the scene's side edge). */
interface Placement {
  kind: MonumentKind;
  z: number;
  s: number;
}

type BigMonument = 'colosseum' | 'pantheon' | 'temple';

/** The three slots of a hill: outer edge, crest (the big monument), inner slope. */
const planHill = (big: BigMonument, rand: Rand): Placement[] => {
  const j = () => rand() * 2;
  const outer: Placement[][] = [
    [{ kind: 'villa', z: 13 + j(), s: 0.6 }],
    [
      { kind: 'insula', z: 14 + j(), s: 0.72 },
      { kind: 'cypress', z: 26.5 + j(), s: 0.8 },
    ],
    [
      { kind: 'pine', z: 13 + j(), s: 0.7 },
      { kind: 'cypress', z: 23.5 + j(), s: 0.9 },
      { kind: 'cypress', z: 27.5, s: 0.7 },
    ],
  ];
  const crest: Record<BigMonument, Placement[]> = {
    colosseum: [
      { kind: 'colosseum', z: 32 + j(), s: 0.9 },
      { kind: 'cypress', z: 72, s: 1 },
    ],
    pantheon: [
      { kind: 'pantheon', z: 31 + j(), s: 0.95 },
      { kind: 'arch', z: 62 + j(), s: 0.72 },
    ],
    temple: [
      { kind: 'temple', z: 32 + j(), s: 1 },
      { kind: 'column', z: 58.5 + j(), s: 0.95 },
      { kind: 'pine', z: 64 + j(), s: 0.8 },
    ],
  };
  const inner: Placement[][] = [
    [
      { kind: 'obelisk', z: 79 + j(), s: 0.8 },
      { kind: 'cypress', z: 85.5, s: 0.85 },
      { kind: 'cypress', z: 90, s: 0.65 },
    ],
    [
      { kind: 'pine', z: 77 + j(), s: 0.75 },
      { kind: 'cypress', z: 88.5, s: 0.9 },
      { kind: 'obelisk', z: 93.5, s: 0.6 },
    ],
  ];
  // A small shrine on the slope, unless the crest already has the temple.
  if (big !== 'temple')
    inner.push([
      { kind: 'temple', z: 77 + j(), s: 0.55 },
      { kind: 'cypress', z: 91.5, s: 0.7 },
    ]);
  const pick = <T>(options: T[]) => options[Math.floor(rand() * options.length)];
  return [...pick(outer), ...crest[big], ...pick(inner)];
};

const isTree = (kind: MonumentKind) => kind === 'cypress' || kind === 'pine';

export const generateRomanLandscape = (seed: number): RomanLandscape => {
  const rand = seededRandom(seed);

  // Mountains: sums of sines with seeded phases.
  const phase = Array.from({ length: 5 }, () => rand() * Math.PI * 2);
  const ridgeFar = ridge(
    x =>
      157 -
      6 * Math.sin(x * 0.021 + phase[0]) -
      4 * Math.sin(x * 0.047 + phase[1]) -
      2 * Math.sin(x * 0.11 + phase[2]),
    184,
  );
  const ridgeNear = ridge(
    x => 169 - 3.5 * Math.sin(x * 0.03 + phase[3]) - 2.5 * Math.sin(x * 0.071 + phase[4]),
    184,
  );

  // Aqueduct: deck at y 164–167.4, 46 arches open down to the ground.
  const PITCH = 6.5;
  const OPENING = 4.9;
  const aq = new Pen(0, GROUND_Y, 1, 300, false);
  aq.M(SCENE_X0, 16).L(SCENE_X1, 16).L(SCENE_X1, 0);
  const firstArch = Math.ceil(SCENE_X0 / PITCH);
  for (let i = Math.floor((SCENE_X1 - PITCH) / PITCH); i >= firstArch; i--) {
    const uL = i * PITCH + 0.8;
    aq.gap(uL + OPENING, uL, 10.15);
  }
  aq.L(SCENE_X0, 0).Z();
  const aqueductDetail = `M ${SCENE_X0} 165.2 L ${SCENE_X1} 165.2`;

  // The two hills each get a different big monument.
  const bigs: BigMonument[] = ['colosseum', 'pantheon', 'temple'];
  for (let i = bigs.length - 1; i > 0; i--) {
    const k = Math.floor(rand() * (i + 1));
    [bigs[i], bigs[k]] = [bigs[k], bigs[i]];
  }
  const buildings: Monument[] = [];
  const trees: Monument[] = [];
  [false, true].forEach((right, side) => {
    for (const p of planHill(bigs[side], rand)) {
      const width = MONUMENT_SIZE[p.kind].w * p.s;
      const xa = right ? 300 - p.z - width : p.z;
      // Stand on the lower end of the slope; the ground hides the rest.
      const base = Math.max(groundY(xa), groundY(xa + width)) + 0.6;
      // Asymmetric monuments face the centre of the scene.
      const m = buildMonument(p.kind, xa, base, p.s, !right, rand);
      (isTree(p.kind) ? trees : buildings).push(m);
    }
  });

  // Foreground frame: a big stone pine on one side, two cypresses on the other.
  const pineLeft = rand() < 0.5;
  const fg = (kind: MonumentKind, z: number, s: number, right: boolean) => {
    const width = MONUMENT_SIZE[kind].w * s;
    return buildMonument(kind, right ? 300 - z - width : z, 201, s, !right, rand);
  };
  const foreground = [
    fg('pine', -10, 3.2, !pineLeft),
    fg('cypress', 7.5, 1.7, pineLeft),
    fg('cypress', -1, 2.3, pineLeft),
  ];

  // Grass along the crest, away from the instrument.
  let tufts = '';
  for (let i = 0; i < 46; i++) {
    const x = rand() * 300;
    if (x > 118 && x < 182) continue;
    const y = groundY(x) + 0.3;
    const h = 1.2 + rand() * 1.4;
    tufts += `M${n(x)} ${n(y)}l${n(-0.7)} ${n(-h * 0.8)}M${n(x)} ${n(y)}l${n(0.4)} ${n(-h)}M${n(x)} ${n(y)}l${n(1.2)} ${n(-h * 0.7)}`;
  }

  return {
    ridgeFar,
    ridgeNear,
    aqueduct: aq.toString(),
    aqueductDetail,
    // Trees after buildings: they stand in front of the walls.
    monuments: [...buildings, ...trees],
    foreground,
    tufts,
  };
};

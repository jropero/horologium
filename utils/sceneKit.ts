/**
 * Shared toolkit for the procedural hero scenes (Rome first; Hellas and
 * Babylonia build on it). Geometry only: drawing lives in components/Scene*.tsx
 * and the colours in components/SceneKit.css.
 *
 * Coordinates are the heroes' 300×200 viewBox. A scene module (e.g.
 * utils/romanLandscape.ts) defines its own monuments as `ShapeDraw` functions,
 * places them, and returns plain path strings that `MonumentShape` renders.
 */

/**
 * Horizontal span every full-width layer must cover. The hero boxes are 16:9
 * and the viewBox 3:2 with `xMidYMid meet`, so the SVG shows x −30…330
 * (measured at 390–1600 px widths); 10 units of margin on each side.
 */
export const SCENE_X0 = -40;
export const SCENE_X1 = 340;
export const SCENE_W = SCENE_X1 - SCENE_X0;

export type Rand = () => number;

/** Seeded pseudo-random generator (Lehmer), values in [0, 1). */
export const seededRandom = (seed: number): Rand => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** Number formatting for path strings: two decimals, no trailing zeros. */
export const fmt = (v: number) => (Math.round(v * 100) / 100).toString();

/** Bézier handle length for a quarter circle of radius 1. */
export const K = 0.5523;

/**
 * Path builder in shape-local units: u runs right from the left edge, v runs up
 * from the base. `flip` mirrors the shape inside its own width (so asymmetric
 * monuments can face the centre). Only M/L/C/Z are emitted, so mirroring needs
 * no arc-flag fixes.
 */
export class Pen {
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
    this.out.push(`M${fmt(this.x(u))} ${fmt(this.y(v))}`);
    return this;
  }

  L(u: number, v: number) {
    this.out.push(`L${fmt(this.x(u))} ${fmt(this.y(v))}`);
    return this;
  }

  C(u1: number, v1: number, u2: number, v2: number, u: number, v: number) {
    this.out.push(
      `C${fmt(this.x(u1))} ${fmt(this.y(v1))} ${fmt(this.x(u2))} ${fmt(this.y(v2))} ${fmt(this.x(u))} ${fmt(this.y(v))}`,
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
   * is the height of the vertical jambs. Gaps are real holes in the silhouette.
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

/** A built monument (or tree): path strings in viewBox units, ready to render. */
export interface Monument<Kind extends string = string> {
  id: string;
  kind: Kind;
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

/** The pens and helpers a `ShapeDraw` function draws with, all in local units. */
export interface ShapeKit {
  body: Pen;
  relief: Pen;
  detail: Pen;
  open: Pen;
  window: (u: number, v: number, w: number, h: number, lit: boolean) => void;
  torch: (u: number, v: number) => void;
}

export type ShapeDraw = (k: ShapeKit, rand: Rand) => void;

/**
 * Builds one shape at viewBox position x0 (left edge), standing on `base`, at
 * scale `s`. `width` is the shape's local width (needed for mirroring).
 */
export const buildShape = <Kind extends string>(
  kind: Kind,
  draw: ShapeDraw,
  width: number,
  x0: number,
  base: number,
  s: number,
  flip: boolean,
  rand: Rand,
): Monument<Kind> => {
  const pen = () => new Pen(x0, base, s, width, flip);
  const body = pen();
  const windows: LandscapeWindow[] = [];
  const torches: LandscapeTorch[] = [];
  const kit: ShapeKit = {
    body,
    relief: pen(),
    detail: pen(),
    open: pen(),
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
  draw(kit, rand);
  return {
    id: `${kind}-${fmt(x0)}`,
    kind,
    body: kit.body.toString(),
    relief: kit.relief.toString(),
    detail: kit.detail.toString(),
    openings: kit.open.toString(),
    windows,
    torches,
  };
};

/** Smooth ridge line from height samples across the whole span, closed down to `floor`. */
export const ridge = (sample: (x: number) => number, floor: number): string => {
  const STEP = 10;
  let d = `M ${SCENE_X0 - 5} ${floor} L ${SCENE_X0 - 5} ${fmt(sample(SCENE_X0 - 5))}`;
  for (let x = SCENE_X0; x <= SCENE_X1 + STEP; x += STEP) {
    // Quadratic through the midpoints: the samples act as control points.
    const midX = x + STEP / 2;
    d += ` Q ${x} ${fmt(sample(x))} ${midX} ${fmt((sample(x) + sample(x + STEP)) / 2)}`;
  }
  return `${d} L ${SCENE_X1 + 2 * STEP} ${floor} Z`;
};

/**
 * Grass tufts along a ground line, skipping the band [skipFrom, skipTo] (e.g.
 * under an instrument).
 */
export const tufts = (
  rand: Rand,
  count: number,
  groundAt: (x: number) => number,
  skipFrom = Infinity,
  skipTo = -Infinity,
): string => {
  let d = '';
  for (let i = 0; i < count; i++) {
    const x = SCENE_X0 + rand() * SCENE_W;
    if (x > skipFrom && x < skipTo) continue;
    const y = groundAt(x) + 0.3;
    const h = 1.2 + rand() * 1.4;
    d += `M${fmt(x)} ${fmt(y)}l-0.7 ${fmt(-h * 0.8)}M${fmt(x)} ${fmt(y)}l0.4 ${fmt(-h)}M${fmt(x)} ${fmt(y)}l1.2 ${fmt(-h * 0.7)}`;
  }
  return d;
};

/**
 * Colours of a scene's light, set as CSS variables on the scene root by
 * `sceneLightStyle`; SceneKit.css derives every colour from them (with --ink).
 */
export interface SceneLight {
  /** The air: far layers take its colour. */
  haze: string;
  /** Edge light and engraved detail. */
  rim: string;
  /** Plinth / stone of the instrument. */
  stone: string;
  /** Sunlit top and shaded base of the clouds. */
  cloudLight: string;
  cloudShade: string;
  /** Sun near the horizon: warmer sun. */
  golden: boolean;
  /** Lamps and torches are burning (night or aurora). */
  lit: boolean;
}

export const sceneLightStyle = (light: SceneLight) =>
  ({
    '--haze': light.haze,
    '--rim': light.rim,
    '--stone': light.stone,
    '--cloud-light': light.cloudLight,
    '--cloud-shade': light.cloudShade,
  }) as Record<string, string>;

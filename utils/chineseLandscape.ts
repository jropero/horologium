/**
 * Procedural landscape of the Zhongguo hero: Tang Chang'an (first half of the
 * 8th century) painted as a shanshui (山水) ink wash. 300×200 viewBox, ground
 * line y = 180 at the centre.
 *
 * Viewpoint: the Leyou plateau (樂遊原) in the south-east of the city, the
 * highest ground inside the walls and a famous viewing place in Tang poetry
 * (Li Shangyin, 登樂遊原), looking south. East is therefore on the left, west on
 * the right, and the sun crosses the frame from left to right like the light of
 * the instrument's shadow.
 *
 * Back to front: the Qinling range (秦嶺, Zhongnan shan) in three ink layers
 * dissolving into mist → the rammed-earth south wall with the Mingde gate
 * (明德門) → the wards (坊) and the Ci'en temple with the Big Wild Goose
 * Pagoda (大雁塔) on the right, the Qujiang pool (曲江池) with willows on the
 * left → the plateau where the instrument stands → a foreground pine.
 *
 * Fixed anchors: wall, gate, pagoda and temple halls, the pool's shoreline, the
 * plateau. Seeded (calendar day): the mountain shapes, their texture strokes
 * (皴) and moss dots (苔點), the ward roofs and trees, the willows and the pine.
 * x 104–196 stays free of buildings and trees for the instrument.
 *
 * Positions follow the bearings from the Leyou plateau only roughly: the
 * pagoda and the gate both lie to the south-west, and the gate is moved
 * right of the pagoda so both read (approximate composition).
 */

import {
  Monument as SceneMonument,
  Rand,
  SCENE_X0,
  SCENE_X1,
  ShapeDraw,
  buildShape,
  fmt,
  seededRandom,
  tufts as grassTufts,
} from './sceneKit';

export { SCENE_W, SCENE_X0, SCENE_X1, seededRandom } from './sceneKit';

export type ChineseKind = 'pagoda' | 'gate' | 'hall' | 'house' | 'tree';

export type Monument = SceneMonument<ChineseKind>;

/** Ground line at the centre (the aurora shader assumes y 180). */
export const GROUND_Y = 180;
/** Base of the south city wall (far). */
export const WALL_Y = 161;
/** Height of the wall in viewBox units (approximate: the rammed-earth wall is ~5 m). */
export const WALL_H = 3.4;
/** Far shore of the Qujiang pool (roughly). */
export const POOL_SHORE_Y = 166;
/** Centre strip kept free for the instrument. */
export const CLEAR_X0 = 104;
export const CLEAR_X1 = 196;

const smooth = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

/**
 * Edge of the Leyou plateau: flat under the instrument, slightly lower on the
 * left (towards the pool) and rising on the right (under the pine).
 */
export const groundY = (x: number): number => {
  // A soft undulation so the edge never reads as a ruled line (0 at the gnomon, x 150).
  const wave = 0.5 * Math.sin((x - 150) * 0.045) + 0.3 * Math.sin((x - 150) * 0.11);
  if (x < 100) return 179.5 + wave + 2.5 * smooth((100 - x) / 140);
  if (x > 205) return 179.5 + wave - 8.5 * smooth((x - 205) / 135);
  return 179.5 + wave;
};

/** Open smooth line through samples (quadratics through the midpoints). */
const lineThrough = (sample: (x: number) => number, x0: number, x1: number, step: number) => {
  let d = `M ${fmt(x0)} ${fmt(sample(x0))}`;
  for (let x = x0; x < x1; x += step) {
    const nx = Math.min(x1, x + step);
    d += ` Q ${fmt(x)} ${fmt(sample(x))} ${fmt((x + nx) / 2)} ${fmt((sample(x) + sample(nx)) / 2)}`;
  }
  return `${d} L ${fmt(x1)} ${fmt(sample(x1))}`;
};

/** Ridge closed down to `floor`, finer than the kit's `ridge()` so peaks stay sharp. */
const ridgeFine = (sample: (x: number) => number, floor: number, step = 4) => {
  const x0 = SCENE_X0 - 6;
  const x1 = SCENE_X1 + 6;
  return `${lineThrough(sample, x0, x1, step)} L ${x1} ${floor} L ${x0} ${floor} Z`;
};

/** Top edge of the plateau, across the whole span. */
export const GROUND_TOP = lineThrough(groundY, SCENE_X0 - 6, SCENE_X1 + 6, 5);

/** Qujiang pool: far shore at ~y 166, its near edge hidden under the plateau. */
export const POOL = `M ${SCENE_X0 - 6} 184 L ${SCENE_X0 - 6} 166.6 C -10 165.2 22 167.4 48 166.2 C 70 165.2 88 165.6 95 168.4 C 99 170.6 97 175 92 178.2 L 88 184 Z`;

/** Local width and height of each shape at scale 1. */
export const SHAPE_SIZE: Record<ChineseKind, { w: number; h: number }> = {
  pagoda: { w: 30, h: 56 },
  gate: { w: 26, h: 12.6 },
  hall: { w: 16, h: 9 },
  house: { w: 10, h: 5.8 },
  tree: { w: 7, h: 7.4 },
};

/**
 * Big Wild Goose Pagoda (大雁塔) of the Ci'en temple (慈恩寺): a square brick
 * pagoda of storeys in imitation of timber, each with thin corbelled eaves,
 * pilasters and an arched opening on every face. Seven storeys: rebuilt as a
 * seven-storey tower in the Chang'an era (701–704) after the five-storey
 * pagoda of 652 decayed; Cen Can's poem of 752 (與高適薛據登慈恩寺浮圖) has
 * "七層摩蒼穹". (A ten-storey phase in the Dali era, 766–779, is disputed.)
 * Proportions, the platform and the finial are approximate reconstruction.
 */
const drawPagoda: ShapeDraw = k => {
  const c = 15;
  k.body.rect(0, 0, 30, 4);
  k.detail.line(0, 3.2, 30, 3.2);
  let v = 4;
  for (let i = 0; i < 7; i++) {
    const w = 19 - 1.5 * i;
    const h = i === 0 ? 7 : 5.6 - 0.25 * i;
    const l = c - w / 2;
    k.body.rect(l, v, w, h);
    // Pilasters dividing the face into bays.
    for (const f of [0.08, 0.3, 0.7, 0.92]) k.relief.rect(l + w * f - 0.2, v, 0.4, h);
    const archH = Math.min(h - 1.4, 3.6);
    k.open.arch(c - 0.95, v + 0.6, 1.9, archH);
    v += h;
    // Corbelled eave: a step and the projecting course.
    k.body.rect(l - 0.5, v, w + 1, 0.35);
    k.body.rect(l - 1.1, v + 0.35, w + 2.2, 0.55);
    k.detail.line(l - 1.1, v + 0.35, l + w + 1.1, v + 0.35);
    v += 0.9;
  }
  // Pyramidal cap and finial (approximate).
  k.body.poly([c - 6, v, c - 1.2, v + 2.4, c + 1.2, v + 2.4, c + 6, v]);
  k.body.dome(c, v + 2.4, 1.7, 1.5);
  k.body.rect(c - 0.25, v + 3.6, 0.5, 4);
  k.body.poly([c - 0.5, v + 7.6, c, v + 8.9, c + 0.5, v + 7.6]);
  for (const r of [4.6, 5.6, 6.6]) k.detail.line(c - 0.9, v + r, c + 0.9, v + r);
};

/**
 * Mingde gate (明德門), the main south gate: a rammed-earth gate platform with
 * five passages (as excavated) and a timber gate tower with a hip roof and
 * faint vermilion columns. Tower form and proportions are approximate
 * reconstruction. The gates were shut at night (curfew), so the passages stay
 * dark; torches burn on the platform.
 */
const drawGate: ShapeDraw = (k, rand) => {
  k.body.rect(0, 0, 26, 4.6);
  for (let i = 0; i < 5; i++) k.open.arch(2.6 + i * 4.6, 0, 2.4, 3);
  k.body.rect(2.6, 4.6, 20.8, 0.6);
  k.body.rect(4, 5.2, 18, 3.1);
  for (let i = 0; i < 7; i++) k.relief.rect(4.3 + i * 2.85, 5.2, 0.45, 3.1);
  k.body
    .M(1, 8.8)
    .C(1.8, 8.3, 2.8, 8.2, 3.6, 8.2)
    .L(22.4, 8.2)
    .C(23.2, 8.2, 24.2, 8.3, 25, 8.8)
    .L(19.6, 11.4)
    .L(6.4, 11.4)
    .Z();
  k.body.poly([6, 11.2, 6.3, 12.6, 7, 11.4]);
  k.body.poly([19, 11.4, 19.7, 12.6, 20, 11.2]);
  k.detail.line(1.6, 8.5, 24.4, 8.5);
  k.window(8.6, 6, 1.4, 1.6, rand() < 0.7);
  k.window(16, 6, 1.4, 1.6, rand() < 0.7);
  k.torch(1.2, 5.2);
  k.torch(24.8, 5.2);
};

/** Tang hall: stone platform, columns, hip roof with flared eaves and ridge-end ornaments (鴟尾). */
const drawHall: ShapeDraw = (k, rand) => {
  k.body.rect(0, 0, 16, 0.9);
  k.body.rect(1.4, 0.9, 13.2, 3.4);
  k.body
    .M(-1.2, 4.9)
    .C(-0.4, 4.4, 0.6, 4.3, 1.4, 4.3)
    .L(14.6, 4.3)
    .C(15.4, 4.3, 16.4, 4.4, 17.2, 4.9)
    .L(12.6, 7.9)
    .L(3.4, 7.9)
    .Z();
  k.body.poly([3, 7.7, 3.3, 9, 4, 7.9]);
  k.body.poly([12, 7.9, 12.7, 9, 13, 7.7]);
  for (let i = 0; i < 6; i++) k.relief.rect(1.8 + i * 2.5, 0.9, 0.35, 3.4);
  for (const u of [3.4, 7.3, 11.2]) k.window(u, 1.5, 1.4, 1.8, rand() < 0.4);
  k.detail.line(-0.6, 4.6, 16.6, 4.6);
};

/** Small ward house with a tiled gable roof. */
const drawHouse: ShapeDraw = (k, rand) => {
  k.body.rect(0.6, 0, 8.8, 3);
  k.body
    .M(-0.6, 3.4)
    .C(0, 3, 0.4, 3, 0.8, 3)
    .L(9.2, 3)
    .C(9.6, 3, 10, 3, 10.6, 3.4)
    .L(8.4, 5.8)
    .L(1.6, 5.8)
    .Z();
  k.window(4.3, 0.8, 1.4, 1.4, rand() < 0.45);
};

/** Round tree inside the wards. */
const drawTree: ShapeDraw = k => {
  k.body.rect(3.2, 0, 0.6, 2.4);
  k.body
    .M(0.4, 2.6)
    .C(-0.4, 4.6, 1.2, 6.6, 3, 6.4)
    .C(4, 7.6, 6.2, 7.2, 6.4, 5.4)
    .C(7.6, 4.2, 6.8, 2.2, 5.4, 2.2)
    .C(4, 1.6, 1.6, 1.6, 0.4, 2.6)
    .Z();
};

const DRAW: Record<ChineseKind, ShapeDraw> = {
  pagoda: drawPagoda,
  gate: drawGate,
  hall: drawHall,
  house: drawHouse,
  tree: drawTree,
};

const build = (
  kind: ChineseKind,
  x0: number,
  base: number,
  s: number,
  rand: Rand,
  flip = false,
) => buildShape(kind, DRAW[kind], SHAPE_SIZE[kind].w, x0, base, s, flip, rand);

/** Fixed anchors: the pagoda in the Jinchang ward (晉昌坊), the gate on the wall. */
export const PAGODA_X = 213;
export const PAGODA_BASE = 172;
export const PAGODA_S = 1;
export const GATE_X = 252;
export const GATE_S = 0.9;

/** Willow: trunk polygon and hanging strands (stroked). */
export interface Willow {
  trunk: string;
  strands: string;
}

/** Foreground pine: trunk and branches, needle masses, needle strokes. */
export interface Pine {
  trunk: string;
  needles: string;
  needleDetail: string;
}

export interface ChineseLandscape {
  /** Qinling, far / middle / near (loess terraces south of the city). */
  ridgeFar: string;
  ridgeMid: string;
  ridgeNear: string;
  /** Texture strokes (皴) on the far and middle ranges. */
  cunFar: string;
  cunMid: string;
  /** Moss dots (苔點) along the middle and near crests. */
  moss: string;
  /** The rammed-earth south wall (without the gate). */
  wall: string;
  gate: Monument;
  pagoda: Monument;
  /** Ci'en temple halls flanking the pagoda (fixed; approximate layout). */
  temple: Monument[];
  /** Ward roofs and trees behind the pagoda's base line (y < PAGODA_BASE). */
  wardsBack: Monument[];
  /** Ward roofs and trees in front of it. */
  wardsFront: Monument[];
  /** Halls and trees on the far shore of the pool (Furong garden, approximate). */
  farShore: Monument[];
  willows: Willow[];
  pine: Pine;
  /** Dry-brush strokes on the plateau (clear of the gnomon's scale). */
  earth: string;
  /** Rocks at the foreground corners, with their texture strokes. */
  rocks: string;
  rockDetail: string;
  tufts: string;
}

/** A mountain range: the highest of a few seeded peaks plus some roughness. */
const rangeSampler = (
  rand: Rand,
  base: number,
  count: number,
  hMin: number,
  hMax: number,
  wMin: number,
  wMax: number,
  sharp: number,
  main?: { c: number; h: number; w: number },
) => {
  const span = SCENE_X1 - SCENE_X0 + 40;
  // Asymmetric peaks (steeper on one flank) so the range reads as painted, not as cones.
  const peaks = Array.from({ length: count }, (_, i) => {
    const w = wMin + rand() * (wMax - wMin);
    const tilt = 0.55 + rand() * 0.9;
    return {
      c: SCENE_X0 - 20 + ((i + 0.1 + rand() * 0.8) / count) * span,
      h: hMin + rand() * rand() * (hMax - hMin),
      wl: w * tilt,
      wr: w / tilt,
    };
  });
  // The main peak (主峰) of the composition, steeper towards the centre.
  if (main) peaks.push({ c: main.c, h: main.h, wl: main.w * 0.8, wr: main.w * 1.15 });
  const ph = [rand() * 6.3, rand() * 6.3, rand() * 6.3];
  return (x: number) => {
    let top = 0;
    let sum = 0;
    for (const p of peaks) {
      const u = Math.abs(x - p.c) / (x < p.c ? p.wl : p.wr);
      const v = p.h * Math.exp(-(u ** sharp));
      top = Math.max(top, v);
      sum += v;
    }
    // A little of the sum fills the saddles between summits.
    return (
      base -
      top -
      0.12 * (sum - top) -
      1.4 * Math.sin(x * 0.13 + ph[0]) -
      0.8 * Math.sin(x * 0.31 + ph[1]) -
      0.4 * Math.sin(x * 0.7 + ph[2])
    );
  };
};

/** Texture strokes running down from the crest. */
const cunStrokes = (rand: Rand, sample: (x: number) => number, count: number, len: number) => {
  let d = '';
  for (let i = 0; i < count; i++) {
    const x = SCENE_X0 + rand() * (SCENE_X1 - SCENE_X0);
    const y = sample(x) + 0.8 + rand() * 2;
    const dir = sample(x + 2) > sample(x - 2) ? 1 : -1; // follow the slope downhill
    const l = len * (0.5 + rand() * 0.8);
    const dx = dir * l * (0.25 + rand() * 0.3);
    d += `M${fmt(x)} ${fmt(y)}Q${fmt(x + dx * 0.2)} ${fmt(y + l * 0.55)} ${fmt(x + dx)} ${fmt(y + l)}`;
  }
  return d;
};

/** Moss dots: zero-length segments drawn with round caps. */
const mossDots = (rand: Rand, sample: (x: number) => number, count: number) => {
  let d = '';
  for (let i = 0; i < count; i++) {
    const x = SCENE_X0 + rand() * (SCENE_X1 - SCENE_X0);
    d += `M${fmt(x)} ${fmt(sample(x) + 0.3 + rand() * 0.8)}h0.01`;
  }
  return d;
};

const willow = (rand: Rand, bx: number, by: number, h: number): Willow => {
  const lean = (rand() - 0.5) * h * 0.25;
  const tx = bx + lean;
  const ty = by - h;
  const bw = h * 0.07;
  const trunk =
    `M${fmt(bx - bw)} ${fmt(by)}` +
    `C${fmt(bx - bw * 0.6)} ${fmt(by - h * 0.4)} ${fmt(tx - bw * 0.9)} ${fmt(by - h * 0.7)} ${fmt(tx - 0.3)} ${fmt(ty)}` +
    `L${fmt(tx + 0.3)} ${fmt(ty)}` +
    `C${fmt(tx + bw * 0.8)} ${fmt(by - h * 0.7)} ${fmt(bx + bw * 0.6)} ${fmt(by - h * 0.4)} ${fmt(bx + bw)} ${fmt(by)}Z`;
  // Boughs arching out from the crown, strands hanging from them.
  let strands = '';
  const boughs = 4 + Math.floor(rand() * 2);
  for (let b = 0; b < boughs; b++) {
    const side = b % 2 === 0 ? -1 : 1;
    const reach = h * (0.25 + rand() * 0.22);
    const ex = tx + side * reach;
    const ey = ty + h * (0.05 + rand() * 0.12);
    const cx = tx + side * reach * 0.45;
    const cy = ty - h * (0.12 + rand() * 0.08);
    strands += `M${fmt(tx)} ${fmt(ty + 1)}Q${fmt(cx)} ${fmt(cy)} ${fmt(ex)} ${fmt(ey)}`;
    const n = 6 + Math.floor(rand() * 4);
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      // Point on the bough's quadratic.
      const px = (1 - t) ** 2 * tx + 2 * (1 - t) * t * cx + t * t * ex;
      const py = (1 - t) ** 2 * (ty + 1) + 2 * (1 - t) * t * cy + t * t * ey;
      const l = h * (0.3 + rand() * 0.35) * (0.6 + t * 0.6);
      const sway = (rand() - 0.3) * 2.2;
      strands += `M${fmt(px)} ${fmt(py)}Q${fmt(px + sway * 0.4)} ${fmt(py + l * 0.5)} ${fmt(px + sway)} ${fmt(Math.min(py + l, by + 1))}`;
    }
  }
  return { trunk, strands };
};

/** Needle mass: two or three overlapping domed lobes with toothed undersides. */
const needleMass = (cx: number, cy: number, w: number, h: number, rand: Rand) => {
  const lobe = (lx: number, ly: number, lw: number, lh: number) => {
    const l = lx - lw / 2;
    let d = `M${fmt(l)} ${fmt(ly)}C${fmt(l + lw * 0.1)} ${fmt(ly - lh)} ${fmt(l + lw * 0.9)} ${fmt(ly - lh * 1.1)} ${fmt(l + lw)} ${fmt(ly)}`;
    const teeth = 6 + Math.floor(rand() * 4);
    for (let i = 1; i <= teeth; i++) {
      const x = l + lw - (lw * i) / teeth;
      d += `L${fmt(x + lw / teeth / 2)} ${fmt(ly + 1 + rand() * 1.6)}L${fmt(x)} ${fmt(ly)}`;
    }
    return `${d}Z`;
  };
  let d = lobe(cx, cy, w, h);
  const extra = 1 + Math.floor(rand() * 2);
  for (let i = 0; i < extra; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    d += lobe(
      cx + side * w * (0.2 + rand() * 0.15),
      cy - h * (0.35 + rand() * 0.3),
      w * 0.6,
      h * 0.8,
    );
  }
  return d;
};

const needleStrokes = (cx: number, cy: number, w: number, h: number, rand: Rand) => {
  let d = '';
  const n = 16 + Math.floor(rand() * 8);
  for (let i = 0; i < n; i++) {
    const x = cx - w * 0.42 + (w * 0.84 * i) / (n - 1);
    const top = cy - h * (0.55 + rand() * 0.45) * Math.sin((Math.PI * (i + 0.5)) / n);
    d += `M${fmt(x)} ${fmt(cy - 0.4)}L${fmt(x + (x - cx) * 0.12)} ${fmt(top - 0.8)}`;
  }
  return d;
};

type Pt = { x: number; y: number };

/** Closed outline around a spine of the given width, sampled in 16 steps. */
const taperedOutline = (spine: (t: number) => Pt, width: (t: number) => number) => {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= 16; i++) {
    const p = spine(i / 16);
    const w = width(i / 16) / 2;
    left.push(`${fmt(p.x - w)} ${fmt(p.y)}`);
    right.push(`${fmt(p.x + w)} ${fmt(p.y)}`);
  }
  return `M${left.join('L')}L${right.reverse().join('L')}Z`;
};

/** A branch from point p with its needle mass, kept right of the pagoda. */
const pineBranch = (rand: Rand, p: Pt, bw: number, goLeft: boolean) => {
  const reach = (goLeft ? 18 : 12) + rand() * 10;
  const ex = p.x + (goLeft ? -reach : reach);
  const ey = p.y - 4 + rand() * 6;
  const mx = (p.x + ex) / 2;
  const path = `M${fmt(p.x)} ${fmt(p.y - bw)}Q${fmt(mx)} ${fmt(ey - 5)} ${fmt(ex)} ${fmt(ey)}L${fmt(ex)} ${fmt(ey + 0.8)}Q${fmt(mx)} ${fmt(ey - 3.4)} ${fmt(p.x)} ${fmt(p.y + bw)}Z`;
  const w = 22 + rand() * 12;
  const mass: [number, number, number, number] = [
    Math.max(ex, 238 + w / 2),
    ey + 0.5,
    w,
    8 + rand() * 4,
  ];
  return { path, mass };
};

/**
 * Old pine leaning into the picture from the right edge (a stock motif of
 * landscape painting). Kept right of x 238 so it never hides the pagoda.
 */
const pineTree = (rand: Rand): Pine => {
  const bx = 330 + rand() * 6;
  const by = 206;
  const H = 150 + rand() * 18;
  const ph = rand() * 6.3;
  const spine = (t: number) => ({
    x: bx - 26 * t + 7 * Math.sin(t * 3.4 + ph) * t,
    y: by - H * t,
  });
  const width = (t: number) => 8.5 * (1 - t) + 1.6;
  let trunk = taperedOutline(spine, width);
  const top = spine(1);
  const masses: [number, number, number, number][] = [
    [top.x - 4, top.y + 2, 26 + rand() * 8, 9 + rand() * 3],
  ];
  for (const t of [0.52, 0.66, 0.8, 0.92]) {
    const b = pineBranch(rand, spine(t), width(t) * 0.35, t !== 0.66);
    trunk += b.path;
    masses.push(b.mass);
  }
  let needles = '';
  let needleDetail = '';
  for (const [cx, cy, w, h] of masses) {
    needles += needleMass(cx, cy, w, h, rand);
    needleDetail += needleStrokes(cx, cy, w, h, rand);
  }
  return { trunk, needles, needleDetail };
};

const earthStrokes = (rand: Rand) => {
  let d = '';
  for (let i = 0; i < 34; i++) {
    const x = SCENE_X0 + rand() * (SCENE_X1 - SCENE_X0);
    const y = groundY(x) + 2.5 + rand() * (204 - groundY(x) - 2.5);
    const l = 6 + rand() * 16;
    // Keep off the scale and the clepsydra's base.
    if (x + l > 128 && x < 172) continue;
    d += `M${fmt(x)} ${fmt(y)}Q${fmt(x + l / 2)} ${fmt(y - 0.6 - rand())} ${fmt(x + l)} ${fmt(y + rand() * 0.6)}`;
  }
  return d;
};

const wardKind = (r: number): ChineseKind => {
  if (r < 0.35) return 'hall';
  return r < 0.75 ? 'house' : 'tree';
};

const overlaps = (x: number, w: number, skip: [number, number] | null) =>
  !!skip && x + w >= skip[0] && x <= skip[1];

/** Fills a row of the wards with halls, houses and trees, skipping [skip0, skip1]. */
const wardRow = (
  rand: Rand,
  x0: number,
  x1: number,
  base: number,
  s: number,
  skip: [number, number] | null,
): Monument[] => {
  const out: Monument[] = [];
  let x = x0 + rand() * 4 * s;
  const fits = (x: number, w: number) =>
    groundY(x + w) > base + 1.5 && x + w < x1 + 8 && !overlaps(x, w, skip);
  while (x < x1) {
    const kind = wardKind(rand());
    const w = SHAPE_SIZE[kind].w * s;
    if (fits(x, w)) out.push(build(kind, x, base, s, rand, rand() < 0.5));
    x += w + (0.6 + rand() * 4) * s * 2;
  }
  return out;
};

const PAGODA_SPAN: [number, number] = [PAGODA_X - 4, PAGODA_X + 30 * PAGODA_S + 4];
const WARD_ROWS: [number, number][] = [
  [164.6, 0.34],
  [167.6, 0.42],
  [171, 0.5],
  [175.2, 0.6],
  [178.8, 0.68],
];

/** Ward rows right of the instrument; the rows in front of the pagoda leave it free. */
const cityWards = (rand: Rand) => {
  const wardsBack: Monument[] = [];
  const wardsFront: Monument[] = [];
  for (const [base, s] of WARD_ROWS) {
    const front = base > PAGODA_BASE;
    // Start past the instrument strip (hall roofs overhang their box by ~1.2 local units).
    const row = wardRow(rand, CLEAR_X1 + 3, SCENE_X1 + 4, base, s, front ? PAGODA_SPAN : null);
    (front ? wardsFront : wardsBack).push(...row);
  }
  return { wardsBack, wardsFront };
};

const shoreKind = (rand: Rand): ChineseKind => {
  if (rand() < 0.45) return 'tree';
  return rand() < 0.5 ? 'hall' : 'house';
};

/** Small halls and trees on the far shore of the pool. */
const farShoreRow = (rand: Rand) => {
  const out: Monument[] = [];
  const s = 0.34;
  let x = SCENE_X0 - 4 + rand() * 4;
  while (x < 86) {
    const kind = shoreKind(rand);
    const w = SHAPE_SIZE[kind].w * s;
    if (x + w < 90) out.push(build(kind, x, POOL_SHORE_Y - 0.2, s, rand, rand() < 0.5));
    x += w + 1 + rand() * 6;
  }
  return out;
};

/** Rocks: one at the left corner, one at the pine's foot. */
const rocks = (rr: number) =>
  `M ${SCENE_X0 - 6} 206 L ${SCENE_X0 - 6} 190 L -36 186.4 L -29 187.6 L -21 183.2 L -12 184.6 L -6 188.6 L 2 189.6 L 8 195 L 12 206 Z` +
  ` M 298 206 L 302 199.5 L 308 196.4 L ${fmt(314 + rr)} 192.6 L 322 193.4 L 329 190.8 L ${SCENE_X1 + 6} 193 L ${SCENE_X1 + 6} 206 Z`;
const ROCK_DETAIL =
  'M -21 183.6 Q -24 190 -30 197 M -21 183.6 Q -18 191 -20 200 M -12 185 Q -13 192 -9 199 M -6 188.8 Q -4 194 -6 204 M 2 189.8 Q 5 196 4 205 M -34 187 Q -36 193 -40 199' +
  ' M 314 193 Q 311 198 309 205 M 314 193 Q 318 199 317 206 M 322 193.6 Q 323 199 327 205 M 329 191 Q 332 197 336 203';

export const generateChineseLandscape = (seed: number): ChineseLandscape => {
  const rand = seededRandom(seed);

  const far = rangeSampler(rand, 140, 11, 12, 46, 9, 24, 1.15, {
    c: 4 + rand() * 50,
    h: 54 + rand() * 10,
    w: 20 + rand() * 6,
  });
  const mid = rangeSampler(rand, 151, 11, 5, 24, 7, 20, 1.2);
  const near = rangeSampler(rand, 157, 6, 1.5, 4.5, 18, 34, 1.8);
  const ridgeFar = ridgeFine(far, 172);
  const ridgeMid = ridgeFine(mid, 172);
  const ridgeNear = ridgeFine(near, 172);
  const cunFar = cunStrokes(rand, far, 44, 10);
  const cunMid = cunStrokes(rand, mid, 56, 7);
  const moss = mossDots(rand, mid, 40) + mossDots(rand, near, 26);

  // Wall: a plain rammed-earth band (parapet form unknown, so none is drawn).
  const wall = `M ${SCENE_X0 - 6} ${WALL_Y} L ${SCENE_X0 - 6} ${WALL_Y - WALL_H} L ${SCENE_X1 + 6} ${WALL_Y - WALL_H} L ${SCENE_X1 + 6} ${WALL_Y} Z`;
  const fixed = seededRandom(704);
  const gate = build('gate', GATE_X, WALL_Y + 0.3, GATE_S, fixed);
  const pagoda = build('pagoda', PAGODA_X, PAGODA_BASE, PAGODA_S, fixed);
  const temple = [
    build('hall', 199, PAGODA_BASE + 0.6, 0.62, fixed),
    build('hall', 246, PAGODA_BASE + 0.6, 0.62, fixed, true),
  ];

  const { wardsBack, wardsFront } = cityWards(rand);
  const farShore = farShoreRow(rand);

  // Willows on the near bank of the pool and two small ones on the far shore
  // (Du Fu, 哀江頭, 757: "細柳新蒲為誰綠" at the Qujiang).
  const willows = [
    willow(rand, 18 + rand() * 18, groundY(30) + 1.5, 34 + rand() * 8),
    willow(rand, 62 + rand() * 12, groundY(68) + 1.5, 26 + rand() * 6),
    willow(rand, 4 + rand() * 30, POOL_SHORE_Y + 0.4, 9 + rand() * 2),
    willow(rand, 50 + rand() * 24, POOL_SHORE_Y + 0.2, 8 + rand() * 2),
  ];

  const pine = pineTree(rand);

  const rr = rand() * 4;

  return {
    ridgeFar,
    ridgeMid,
    ridgeNear,
    cunFar,
    cunMid,
    moss,
    wall,
    gate,
    pagoda,
    temple,
    wardsBack,
    wardsFront,
    farShore,
    willows,
    pine,
    earth: earthStrokes(rand),
    rocks: rocks(rr),
    rockDetail: ROCK_DETAIL,
    tufts: grassTufts(rand, 40, groundY, CLEAR_X0 + 6, CLEAR_X1 - 6),
  };
};

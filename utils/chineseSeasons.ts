/**
 * The seasons in the Zhongguo hero, driven by the 72 pentads (七十二候) of the
 * 24 solar terms (二十四節氣).
 *
 * 1. `PENTAD_DETAILS`: one small ink detail per pentad, with the pentad's
 *    canonical name (as written in `utils/chineseCalendarData.ts`), its pinyin
 *    and the Spanish caption shown under the hero (ChineseClock). The sequence
 *    of 72 pentad signs is attested in the 逸周書·時訓解; most signs also
 *    appear, month by month, in the 禮記·月令 / 呂氏春秋 calendars. The app's
 *    data uses the later standard wording; variants exist. The names are the
 *    sourced part; the captions are literary. The 24 entries flagged
 *    `termScene` were the original one-per-term details, and their captions are
 *    Jesús's 24 term captions.
 * 2. A continuous seasonal base (`seasonBase`) from the sun's ecliptic
 *    longitude: willow foliage and its colour, a warmer or colder paper tone.
 * 3. The Qujiang pool is frozen in the three coldest terms (`POOL_FROZEN_TERMS`).
 *
 * Term and pentad come from `getChineseCalendarData(date)` (the same reckoning
 * as the solar-term card and the caption), the longitude from
 * `getSolarLongitudeDeg(date)`, so hero, caption, card and time travel always
 * agree. Geometry only: drawing is in `components/ChineseScene.tsx`, colours in
 * `ChineseScene.css` (`cs-sd-*`).
 *
 * Mythical or pre-scientific pentads (鷹化為鳩, 田鼠化為鴽, 雀入大水為蛤,
 * 腐草為螢, 雉入大水為蜃, 虹藏不見) are drawn as they would be seen, with the
 * classical reading explained in the entry's comment.
 *
 * Placement rules (tested): no detail enters the instrument strip (x 104–196),
 * the pagoda or gate boxes, or the seal's corner. Details are tiny on purpose.
 */

import { WeatherCondition } from '../types';
import { lerpColor } from './color';
import { groundY } from './chineseLandscape';
import { Rand, fmt, seededRandom } from './sceneKit';

// ── Path helpers (absolute M/L/Q/C only, so every coordinate pair is parseable) ──

type Pts = number[];

/** Transforms local points (u right, v up) to the viewBox: origin (ox, oy), scale s, rotation (deg). */
const place = (pts: Pts, ox: number, oy: number, s: number, rot = 0, flip = false): Pts => {
  const a = (rot * Math.PI) / 180;
  const out: Pts = [];
  for (let i = 0; i < pts.length; i += 2) {
    const u = (flip ? -pts[i] : pts[i]) * s;
    const v = pts[i + 1] * s;
    out.push(ox + u * Math.cos(a) + v * Math.sin(a), oy - v * Math.cos(a) + u * Math.sin(a));
  }
  return out;
};

const poly = (p: Pts) => {
  let d = `M${fmt(p[0])} ${fmt(p[1])}`;
  for (let i = 2; i < p.length; i += 2) d += `L${fmt(p[i])} ${fmt(p[i + 1])}`;
  return `${d}Z`;
};

const line = (p: Pts) => {
  let d = `M${fmt(p[0])} ${fmt(p[1])}`;
  for (let i = 2; i < p.length; i += 2) d += `L${fmt(p[i])} ${fmt(p[i + 1])}`;
  return d;
};

const K = 0.5523;
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${fmt(cx - rx)} ${fmt(cy)}` +
  `C${fmt(cx - rx)} ${fmt(cy - ry * K)} ${fmt(cx - rx * K)} ${fmt(cy - ry)} ${fmt(cx)} ${fmt(cy - ry)}` +
  `C${fmt(cx + rx * K)} ${fmt(cy - ry)} ${fmt(cx + rx)} ${fmt(cy - ry * K)} ${fmt(cx + rx)} ${fmt(cy)}` +
  `C${fmt(cx + rx)} ${fmt(cy + ry * K)} ${fmt(cx + rx * K)} ${fmt(cy + ry)} ${fmt(cx)} ${fmt(cy + ry)}` +
  `C${fmt(cx - rx * K)} ${fmt(cy + ry)} ${fmt(cx - rx)} ${fmt(cy + ry * K)} ${fmt(cx - rx)} ${fmt(cy)}Z`;

/** Round-capped dots (zero-length segments). */
const dots = (p: Pts) => {
  let d = '';
  for (let i = 0; i < p.length; i += 2)
    d += `M${fmt(p[i])} ${fmt(p[i + 1])}L${fmt(p[i] + 0.01)} ${fmt(p[i + 1])}`;
  return d;
};

/** Scatter n points in a box. */
const scatter = (rand: Rand, n: number, x0: number, x1: number, y0: number, y1: number): Pts =>
  Array.from({ length: n }, () => [x0 + rand() * (x1 - x0), y0 + rand() * (y1 - y0)]).flat();

/** A bird seen from below: two wing strokes. */
const wing = (x: number, y: number, s: number) =>
  `M${fmt(x - s)} ${fmt(y)}Q${fmt(x - s * 0.4)} ${fmt(y - s * 0.7)} ${fmt(x)} ${fmt(y)}` +
  `Q${fmt(x + s * 0.4)} ${fmt(y - s * 0.7)} ${fmt(x + s)} ${fmt(y)}`;

/**
 * A skein of geese in a V. The view faces south: geese flying north pass
 * overhead towards the top of the picture (apex up, larger); geese flying
 * south recede towards the Qinling (apex down, smaller).
 */
const skein = (ax: number, ay: number, north: boolean, arms = 3) => {
  const s = north ? 1.7 : 1.25;
  const dir = north ? 1 : -1;
  let d = wing(ax, ay, s);
  for (let i = 1; i <= arms; i++) {
    d += wing(ax - i * 3.4 * s * 0.7, ay + dir * i * 2.1, s * 0.92);
    d += wing(ax + i * 3.4 * s * 0.7, ay + dir * i * 2.1, s * 0.92);
  }
  return d;
};

// Local silhouettes (u right, v up, origin at the feet / centre).
const SWALLOW: Pts = [
  -3.2, 0.8, -0.6, 0.2, 0, 0.6, 0.6, 0.2, 3.2, 0.8, 0.7, -0.4, 0.5, -1.4, 0.9, -2.6, 0, -1.6,
  -0.9, -2.6, -0.5, -1.4, -0.7, -0.4,
];
const RAPTOR: Pts = [
  -4, -0.2, -1.5, 0.5, -0.4, 0.9, 0, 1.4, 0.4, 0.9, 1.5, 0.5, 4, -0.2, 1.2, -0.3, 0.6, -1.6,
  -0.6, -1.6, -1.2, -0.3,
];
/** Small perched bird facing left, long tail to the right (shrike, magpie). */
const PERCHED: Pts = [
  -0.4, 2.9, 0.2, 3.5, 1, 3.6, 1.6, 3.2, 3.2, 2.6, 5.6, 1.2, 5.8, 0.8, 3.4, 1.4, 2.4, 0.9, 1.2,
  1.2, 0.6, 1.9, 0.4, 2.6, -1, 2.8,
];
/** Deer facing left: body and neck/head; legs are added separately. */
const DEER_BODY: Pts = [2, 4.2, 3, 5.2, 7.5, 5.4, 8.6, 4.6, 8.4, 3.4, 7.6, 3.2, 3, 3.2];
const DEER_HEAD: Pts = [3, 5, 2.4, 6.6, 1.2, 7.4, 0, 7.1, 0.2, 6.6, 1.4, 6.2, 2.2, 4.6];
const LEAF: Pts = [0, 0, 0.9, 0.7, 2, 0, 0.9, -0.6];

const deer = (ox: number, oy: number, s: number) => {
  let d = poly(place(DEER_BODY, ox, oy, s)) + poly(place(DEER_HEAD, ox, oy, s));
  for (const u of [3, 3.8, 7, 7.8])
    d += poly(place([u, 0, u + 0.45, 0, u + 0.45, 3.4, u, 3.4], ox, oy, s));
  return d;
};

/** Dove in flight seen from below: small head, fan tail. */
const DOVE: Pts = [
  -3.6, 0.2, -1.2, 0.9, -0.4, 1.1, -0.3, 1.7, 0.3, 1.7, 0.4, 1.1, 1.2, 0.9, 3.6, 0.2, 1, -0.2,
  0.7, -1.6, -0.7, -1.6, -1, -0.2,
];
/** Falcon with swept, half-folded wings (head towards +v). */
const FALCON: Pts = [
  0, 3, -0.5, 1.2, -2.6, -0.4, -0.5, 0.1, -0.3, -2.4, 0.3, -2.4, 0.5, 0.1, 2.6, -0.4, 0.5, 1.2,
];
/** Fish, head to the left. */
const FISH: Pts = [0, 0, 2, 0.9, 4.6, 0.6, 6, 1.2, 6, -1.2, 4.6, -0.6, 2, -0.9];
/** Otter, low and long, head to the left, tail to the right. */
const OTTER: Pts = [
  0, 0.7, 1.2, 1.7, 7, 1.9, 8.6, 1.3, 11, 0.6, 8.4, 0.4, 7.6, 0, 6.8, 0.3, 2, 0.3, 1.4, 0,
];
/** Cock pheasant facing left: raised head, long tail. */
const PHEASANT: Pts = [
  -0.6, 5.2, 0, 5.8, 0.6, 5.4, 1, 3.6, 2.2, 3.2, 4, 2.6, 9, 2.4, 9.2, 2, 4.6, 1.4, 3.6, 0.8,
  1.6, 1, 0.8, 1.8, 0.4, 3.4, -1, 5,
];
const BEAST_BODY: Pts = [1.8, 3, 2.4, 4.4, 7.8, 4.6, 9, 3.6, 8.6, 2.6, 2, 2.6];
const BEAST_HEAD: Pts = [2.4, 4.2, 1.4, 5, 0, 4.5, 0.2, 3.9, 1.6, 3.4];

/** Four-legged beast (dhole, tiger) facing left, feet at (ox, oy); `flip` faces it right. */
const beast = (ox: number, oy: number, s: number, flip = false) => {
  let d =
    poly(place(BEAST_BODY, ox, oy, s, 0, flip)) +
    poly(place(BEAST_HEAD, ox, oy, s, 0, flip)) +
    poly(place([1.3, 4.8, 1.6, 5.8, 2, 4.9], ox, oy, s, 0, flip));
  for (const u of [2.5, 3.3, 7.4, 8.2])
    d += poly(place([u, 0, u + 0.45, 0, u + 0.45, 2.8, u, 2.8], ox, oy, s, 0, flip));
  return d;
};
const beastTail = (ox: number, oy: number, s: number, flip = false) =>
  line(place([8.9, 3.9, 10.4, 3.4, 11.4, 2.4], ox, oy, s, 0, flip));
const stripes = (ox: number, oy: number, s: number, flip = false) =>
  [3.6, 4.8, 6, 7.2].map(u => line(place([u, 4.4, u + 0.4, 2.8], ox, oy, s, 0, flip))).join('');

/** Plump perched bird (dove, quail, hen) facing left, feet at (x, y). */
const plump = (x: number, y: number, s: number, tail = 1) =>
  ellipse(x + 2.2 * s, y - 1.5 * s, 2.2 * s, 1.3 * s) +
  ellipse(x + 0.5 * s, y - 2.9 * s, 0.85 * s, 0.85 * s) +
  poly([x - 0.25 * s, y - 3.05 * s, x - 1.1 * s, y - 2.85 * s, x - 0.25 * s, y - 2.65 * s]) +
  poly([
    x + 4 * s,
    y - 2 * s,
    x + (4 + 1.8 * tail) * s,
    y - 1.7 * s,
    x + (4 + 1.6 * tail) * s,
    y - 1.1 * s,
    x + 4 * s,
    y - 1.2 * s,
  ]);

/** Swimming goose facing left on the water line y. */
const goose = (x: number, y: number, s: number) =>
  ellipse(x + 2.2 * s, y - 0.6 * s, 2.3 * s, 0.85 * s) +
  poly([
    x + 0.8 * s,
    y - 0.9 * s,
    x + 0.2 * s,
    y - 3.2 * s,
    x - 1 * s,
    y - 3.3 * s,
    x - 0.1 * s,
    y - 2.8 * s,
    x + 0.1 * s,
    y - 0.7 * s,
  ]);

/** Beetle seen from above-side, centred at (x, y). */
const beetle = (x: number, y: number, s: number) =>
  ellipse(x, y, 0.75 * s, 0.45 * s) +
  line([x - 0.4 * s, y + 0.3 * s, x - 0.9 * s, y + 0.8 * s]) +
  line([x + 0.4 * s, y + 0.3 * s, x + 0.9 * s, y + 0.8 * s]);

/** Cricket facing left, feet at (x, y): body, long hind leg, antenna. */
const cricket = (x: number, y: number, s: number) =>
  ellipse(x, y - 0.5 * s, 1.3 * s, 0.42 * s) +
  poly([
    x + 0.4 * s,
    y - 0.7 * s,
    x + 1.8 * s,
    y - 1.7 * s,
    x + 2.5 * s,
    y,
    x + 2.2 * s,
    y,
    x + 1.6 * s,
    y - 1.2 * s,
  ]) +
  poly([
    x - 1.1 * s,
    y - 0.7 * s,
    x - 2.8 * s,
    y - 2 * s,
    x - 2.7 * s,
    y - 2.15 * s,
    x - 1 * s,
    y - 0.85 * s,
  ]);

/** Cicada clinging head-up to a trunk, centred at (x, y). */
const cicada = (x: number, y: number, s: number) =>
  ellipse(x, y, 0.55 * s, 1.3 * s) +
  poly([x - 0.2 * s, y - 0.8 * s, x - 1.4 * s, y + 1.9 * s, x - 0.2 * s, y + 1.3 * s]) +
  poly([x + 0.2 * s, y - 0.8 * s, x + 1.4 * s, y + 1.9 * s, x + 0.2 * s, y + 1.3 * s]);

/** Mantis on a stem: body, raised forelegs, head (stroked). */
const mantis = (x: number, y: number, s: number) =>
  line([x, y, x - 0.6 * s, y - 2.6 * s, x - 1.2 * s, y - 3.2 * s]) +
  line([x - 0.6 * s, y - 2.4 * s, x - 1.6 * s, y - 2.8 * s, x - 1.9 * s, y - 2.2 * s]) +
  line([x - 0.2 * s, y - 1 * s, x + 0.9 * s, y + 0.6 * s]) +
  line([x - 0.3 * s, y - 1.4 * s, x - 1.2 * s, y - 0.2 * s]);

/** An earthworm: a small wave of length len. */
const worm = (x: number, y: number, len: number) =>
  `M${fmt(x)} ${fmt(y)}Q${fmt(x + len * 0.25)} ${fmt(y - 1)} ${fmt(x + len * 0.5)} ${fmt(y)}` +
  `Q${fmt(x + len * 0.75)} ${fmt(y + 1)} ${fmt(x + len)} ${fmt(y)}`;

/** An earthworm knotted on itself. */
const knot = (x: number, y: number) =>
  `M${fmt(x - 2)} ${fmt(y)}C${fmt(x - 1)} ${fmt(y - 1.4)} ${fmt(x + 1.2)} ${fmt(y - 1.2)} ${fmt(x + 0.6)} ${fmt(y)}` +
  `C${fmt(x)} ${fmt(y + 1)} ${fmt(x - 1)} ${fmt(y + 0.4)} ${fmt(x - 0.4)} ${fmt(y - 0.4)}` +
  `C${fmt(x + 0.2)} ${fmt(y - 1)} ${fmt(x + 1.6)} ${fmt(y - 0.4)} ${fmt(x + 2)} ${fmt(y + 0.2)}`;

/** A clam shell standing on the line y: a ribbed half-ellipse of half-width w. */
const shell = (cx: number, y: number, w: number) => {
  const p: Pts = [];
  for (let a = 180; a >= 0; a -= 30) {
    const t = (a * Math.PI) / 180;
    p.push(cx + w * Math.cos(t), y - w * 0.75 * Math.sin(t));
  }
  return poly(p);
};

/** Lumpy cloud: five bumps over a flat base. */
const cloudShape = (x0: number, base: number, w: number, h: number) => {
  let d = `M${fmt(x0)} ${fmt(base)}`;
  for (let i = 0; i < 5; i++) {
    const a = x0 + (w * i) / 5;
    const b = x0 + (w * (i + 1)) / 5;
    const top = base - h * (0.55 + 0.45 * Math.sin((Math.PI * (i + 0.5)) / 5));
    d += `C${fmt(a)} ${fmt(top)} ${fmt(b)} ${fmt(top)} ${fmt(b)} ${fmt(base)}`;
  }
  return `${d}Z`;
};

/** Slanted streaks between x0 and x1 from y0 down to y1 (rain shafts). */
const streaks = (x0: number, x1: number, y0: number, y1: number, n: number) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
    d += line([x, y0, x - 3, y1 - (i % 3) * 3]);
  }
  return d;
};

/** Curling wind strokes starting at the given points. */
const windCurls = (starts: [number, number][]) =>
  starts
    .map(
      ([x, y]) =>
        `M${fmt(x)} ${fmt(y)}C${fmt(x + 8)} ${fmt(y - 3)} ${fmt(x + 16)} ${fmt(y + 2)} ${fmt(x + 22)} ${fmt(y - 1)}` +
        `C${fmt(x + 26)} ${fmt(y - 3)} ${fmt(x + 25)} ${fmt(y - 6)} ${fmt(x + 22)} ${fmt(y - 5)}`,
    )
    .join('');

/** Wavy heat-shimmer lines between x0 and x1 at the given heights. */
const shimmer = (x0: number, x1: number, ys: number[]) =>
  ys
    .map(y => {
      let d = `M${fmt(x0)} ${fmt(y)}`;
      for (let x = x0; x < x1; x += 6)
        d += `Q${fmt(x + 1.5)} ${fmt(y - 0.7)} ${fmt(x + 3)} ${fmt(y)}Q${fmt(x + 4.5)} ${fmt(y + 0.7)} ${fmt(x + 6)} ${fmt(y)}`;
      return d;
    })
    .join('');

/** Spots on the left plateau, clear of the willows and the rock. */
const LEFT_SPOTS: [number, number][] = [
  [84, 190.4],
  [91, 191.8],
  [97, 189.8],
];
const mounds = (spots: [number, number][]) =>
  spots
    .map(
      ([x, y]) =>
        `M${fmt(x - 2.2)} ${fmt(y)}Q${fmt(x)} ${fmt(y - 1.8)} ${fmt(x + 2.2)} ${fmt(y)}`,
    )
    .join('');
const domes = (spots: [number, number][]) =>
  spots
    .map(
      ([x, y]) =>
        `M${fmt(x - 2.2)} ${fmt(y)}Q${fmt(x)} ${fmt(y - 2.4)} ${fmt(x + 2.2)} ${fmt(y)}Z`,
    )
    .join('');

/** Short V-shaped sprouts on the left plateau. */
const sprouts = (rand: Rand, n: number) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = -24 + rand() * 122;
    const y = groundY(x) + 2 + rand() * 13;
    d += line([x - 0.5, y - 1.2, x, y, x + 0.5, y - 1.4]);
  }
  return d;
};

/** Bent, withered grass blades in a box. */
const withered = (rand: Rand, x0: number, x1: number, y0: number, y1: number) => {
  let d = '';
  for (let i = 0; i < 18; i++) {
    const x = x0 + rand() * (x1 - x0);
    const y = y0 + rand() * (y1 - y0);
    d += `M${fmt(x)} ${fmt(y)}Q${fmt(x + 0.4)} ${fmt(y - 2)} ${fmt(x + 1.8)} ${fmt(y - 2.4)}`;
  }
  return d;
};

/** Ice floes scattered on the pool. */
const floes = (rand: Rand, n: number) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const cx = 6 + rand() * 78;
    const cy = 168.6 + rand() * 7.6;
    const w = 2.6 + rand() * 4;
    const h = 0.5 + rand() * 0.6;
    d += poly([
      cx - w,
      cy,
      cx - w * 0.3,
      cy - h,
      cx + w * 0.8,
      cy - h * 0.7,
      cx + w,
      cy + h * 0.3,
      cx,
      cy + h,
    ]);
  }
  return d;
};

/** Fallback when no landscape is passed (tests that only give the willow crown). */
const PINE_PERCH = { x: 322, y: 160 };

// ── The table ─────────────────────────────────────────────────────────────────

export type DetailLayer = 'sky' | 'pool' | 'ground';
export type DetailTime = 'day' | 'night' | 'any';

export interface DetailStroke {
  /** CSS class (`cs-sd-*`). */
  cls: string;
  d: string;
}

export interface DetailContext {
  /** Fork of the near-left willow (magpie's nest, oriole, cicada, huddled bird). */
  willowCrown: { x: number; y: number };
  /** Scene-facing edge of the pine trunk (the cold cicada). */
  pinePerch?: { x: number; y: number };
}

export interface PentadDetail {
  termId: number;
  /** Term as written in chineseCalendarData. */
  term: string;
  /** The pentad's canonical name, as written in chineseCalendarData (simplified). */
  pentad: string;
  /** Which of the term's three pentads (1–3). */
  pentadIndex: number;
  /** Tone-marked pinyin of the name. */
  pinyin: string;
  /** Spanish caption shown under the hero (literary). */
  caption: string;
  /** One of the original 24 one-per-term details (caption by Jesús). */
  termScene?: boolean;
  /** What is drawn, and where. */
  what: string;
  /** sky: behind the mountains; pool: clipped to the Qujiang; ground: on the plateau. */
  layer: DetailLayer;
  time: DetailTime;
  /** Weather that would contradict the detail: it is then hidden. */
  hideIn: WeatherCondition[];
  /** A bird detail in the sky: the scene's generic flock is left out while it shows. */
  replacesBirds?: boolean;
  draw: (ctx: DetailContext) => DetailStroke[];
}

/** Former name, kept for the per-term API. */
export type TermDetail = PentadDetail;

/** Class of the filled ink silhouettes (birds, beasts, insects). */
const SILHOUETTE = 'cs-sd-silhouette';

const AIRBORNE: WeatherCondition[] = ['storm', 'rain', 'snow', 'fog'];
const WET: WeatherCondition[] = ['storm', 'rain'];

const r = (termId: number) => seededRandom(termId * 97 + 13);

export const PENTAD_DETAILS: PentadDetail[] = [
  {
    // 立春 · 東風解凍 (1st pentad): the east wind thaws the ice.
    termId: 1,
    term: '立春',
    pentad: '东风解冻',
    pentadIndex: 1,
    pinyin: 'Dōng fēng jiě dòng',
    caption:
      "El viento del este rompe el hielo del Qujiang: Chang'an despierta al primer aliento de la primavera.",
    termScene: true,
    what: 'Thawing ice floes drifting on the Qujiang pool',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => {
      const rand = r(1);
      let d = '';
      for (let i = 0; i < 9; i++) {
        const cx = 6 + rand() * 78;
        const cy = 168.6 + rand() * 7.6;
        const w = 2.6 + rand() * 4;
        const h = 0.5 + rand() * 0.6;
        d += poly([
          cx - w,
          cy,
          cx - w * 0.3,
          cy - h,
          cx + w * 0.8,
          cy - h * 0.7,
          cx + w,
          cy + h * 0.3,
          cx,
          cy + h,
        ]);
      }
      return [{ cls: 'cs-sd-ice', d }];
    },
  },
  {
    // 立春 · 蟄蟲始振: the hibernating insects begin to stir.
    termId: 1,
    term: '立春',
    pentad: '蛰虫始振',
    pentadIndex: 2,
    pinyin: 'Zhé chóng shǐ zhèn',
    caption:
      "Bajo la tierra del Leyou, los insectos dormidos se estremecen: el invierno afloja su abrazo sobre Chang'an.",
    what: 'Beetles stirring at three small burrow mounds on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: 'cs-sd-earth', d: mounds(LEFT_SPOTS) },
      {
        cls: SILHOUETTE,
        d: LEFT_SPOTS.map(([x, y]) => beetle(x + 0.2, y - 1.4, 1.2)).join(''),
      },
    ],
  },
  {
    // 立春 · 魚陟負冰: the fish rise towards the surface, "carrying the ice" (they swim up under the thinning ice).
    termId: 1,
    term: '立春',
    pentad: '鱼陟负冰',
    pentadIndex: 3,
    pinyin: 'Yú zhì fù bīng',
    caption:
      'Los peces suben hacia la luz y empujan con el lomo los últimos témpanos que flotan en el Qujiang.',
    what: 'Two fish rising under the last thin floes of the pool',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: 'cs-sd-ice', d: floes(r(103), 5) },
      {
        cls: 'cs-sd-fish',
        d: poly(place(FISH, 28, 173.4, 1.1, -8)) + poly(place(FISH, 56, 171.2, 0.95, 6, true)),
      },
    ],
  },
  {
    // 雨水 · 獺祭魚: the otter "sacrifices" fish: it lays its catch out on the bank, which the ancients read as an offering.
    termId: 2,
    term: '雨水',
    pentad: '獭祭鱼',
    pentadIndex: 1,
    pinyin: 'Tǎ jì yú',
    caption:
      "La nutria alinea sus peces en la orilla del Qujiang como una ofrenda a los cielos de Chang'an.",
    what: 'An otter on the pool bank with three fish laid out in a row',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: SILHOUETTE, d: poly(place(OTTER, 78, 182.2, 1.05)) },
      {
        cls: 'cs-sd-fish',
        d: [91, 94.6, 98.2].map(x => poly(place(FISH, x, 182, 0.5, 90))).join(''),
      },
    ],
  },
  {
    // 雨水 · 候雁北 (2nd): the wild geese fly north.
    termId: 2,
    term: '雨水',
    pentad: '候雁北',
    pentadIndex: 2,
    pinyin: 'Hòu yàn běi',
    caption:
      'Los gansos salvajes emprenden el vuelo hacia el norte sobre la bruma de tinta que envuelve el Qinling.',
    termScene: true,
    what: 'Skein of wild geese heading north (overhead, apex up), left sky',
    layer: 'sky',
    time: 'day',
    hideIn: ['storm', 'fog'],
    replacesBirds: true,
    draw: () => [{ cls: 'cs-sd-bird', d: skein(48, 74, true) }],
  },
  {
    // 雨水 · 草木萌動: grass and trees begin to bud.
    termId: 2,
    term: '雨水',
    pentad: '草木萌动',
    pentadIndex: 3,
    pinyin: 'Cǎo mù méng dòng',
    caption:
      'Brotes tiernos asoman en la hierba del Leyou y una bruma verde empieza a teñir los sauces.',
    what: 'Tender sprouts dotting the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [{ cls: 'cs-sd-blade cs-sd-blade--sprout', d: sprouts(r(203), 34) }],
  },
  {
    // 驚蟄 · 桃始華 (1st): the peach begins to blossom.
    termId: 3,
    term: '惊蛰',
    pentad: '桃始华',
    pentadIndex: 1,
    pinyin: 'Táo shǐ huā',
    caption:
      "El melocotonero estalla en flor y los insectos despiertan bajo la tierra aún húmeda de Chang'an.",
    termScene: true,
    what: 'Peach branch in blossom reaching in from the upper-left corner',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const branch =
        'M-34 13Q-8 17 30 35M-14 16.6Q-10 9 -4 7M2 22.4Q6 16 12 15.2M12 26.6Q12 32 16 36M-24 14.6Q-26 21 -22 25';
      const blossoms = [
        -4, 7, -7, 9.8, -11, 12.4, 12, 15.2, 8, 17.8, 4, 21, 16, 36, 13.6, 31, 18, 29.4, 26, 33,
        30, 35, -22, 25, -25, 20.4, -18, 15.4, 22.4, 31.4,
      ];
      const buds = [-1.6, 6.4, 9.6, 14, 27.6, 36.6, -20.6, 27.6];
      return [
        { cls: 'cs-sd-branch', d: branch },
        { cls: 'cs-sd-blossom', d: dots(blossoms) },
        { cls: 'cs-sd-bud', d: dots(buds) },
      ];
    },
  },
  {
    // 惊蛰 · 倉庚鳴: the oriole (倉庚 = 黃鸝) sings; drawn as the bird itself.
    termId: 3,
    term: '惊蛰',
    pentad: '仓庚鸣',
    pentadIndex: 2,
    pinyin: 'Cāng gēng míng',
    caption:
      "La oropéndola, oro entre la tinta, canta en el sauce y Chang'an despierta con su primera melodía.",
    what: 'A golden oriole perched by the crown of the near-left willow',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: ({ willowCrown: c }) => [
      { cls: 'cs-sd-oriole', d: poly(place(PERCHED, c.x - 5.6, c.y + 3.2, 1.05)) },
      { cls: 'cs-sd-twig', d: line([c.x - 5.2, c.y + 0.4, c.x - 4.2, c.y + 0.2]) },
    ],
  },
  {
    // 惊蛰 · 鷹化為鳩: "the hawk turns into a dove": in spring the hawks withdraw and doves appear, which the ancients read as a transformation. Drawn as a dove flying where the hawk was, its faint ghost behind.
    termId: 3,
    term: '惊蛰',
    pentad: '鹰化为鸠',
    pentadIndex: 3,
    pinyin: 'Yīng huà wéi jiū',
    caption:
      'Donde ayer cazaba el halcón vuela hoy una tórtola: así veían los antiguos el paso de la primavera.',
    what: 'A turtle-dove flying in the left sky with the faint outline of a hawk behind it',
    layer: 'sky',
    time: 'day',
    hideIn: AIRBORNE,
    replacesBirds: true,
    draw: () => [
      { cls: 'cs-sd-ghost', d: poly(place(RAPTOR, 44, 70, 1.5, -6)) },
      { cls: SILHOUETTE, d: poly(place(DOVE, 40, 72, 1.25, 8)) },
    ],
  },
  {
    // 春分 · 玄鳥至 (1st): the swallows arrive.
    termId: 4,
    term: '春分',
    pentad: '玄鸟至',
    pentadIndex: 1,
    pinyin: 'Xuán niǎo zhì',
    caption:
      'Las golondrinas regresan rasando el Qujiang: el día y la noche se equilibran sobre la capital eterna.',
    termScene: true,
    what: 'Three swallows darting low over the pool',
    layer: 'ground',
    time: 'day',
    hideIn: AIRBORNE,
    replacesBirds: true,
    draw: () => [
      {
        cls: SILHOUETTE,
        d:
          poly(place(SWALLOW, 34, 150, 0.9, -18)) +
          poly(place(SWALLOW, 52, 144, 0.75, 12)) +
          poly(place(SWALLOW, 70, 153, 0.65, -6)),
      },
    ],
  },
  {
    // 春分 · 雷乃發聲: the thunder raises its voice; drawn as a distant thunderhead over the eastern Qinling.
    termId: 4,
    term: '春分',
    pentad: '雷乃发声',
    pentadIndex: 2,
    pinyin: 'Léi nǎi fā shēng',
    caption:
      "El primer trueno rueda sobre el Qinling y su eco despierta los tejados dormidos de Chang'an.",
    what: 'A dark thunderhead with faint rain over the eastern (left) Qinling',
    layer: 'sky',
    time: 'any',
    hideIn: ['fog', 'snow'],
    draw: () => [
      { cls: 'cs-sd-cloud cs-sd-cloud--dark', d: cloudShape(30, 116, 46, 11) },
      { cls: 'cs-sd-rainshaft', d: streaks(34, 72, 117, 140, 7) },
    ],
  },
  {
    // 春分 · 始電: lightning begins to be seen.
    termId: 4,
    term: '春分',
    pentad: '始电',
    pentadIndex: 3,
    pinyin: 'Shǐ diàn',
    caption:
      'Un relámpago lejano enciende un instante las cumbres del Qinling: la primavera trae su fuego.',
    what: 'A small distant lightning bolt over the left Qinling',
    layer: 'sky',
    time: 'any',
    hideIn: ['fog', 'snow'],
    draw: () => {
      const bolt = line([70, 104, 66, 114, 71, 116, 65, 128, 70, 130, 66, 140]);
      return [
        { cls: 'cs-sd-bolt-glow', d: bolt },
        { cls: 'cs-sd-bolt', d: bolt },
      ];
    },
  },
  {
    // 清明 · 桐始華: the paulownia (桐) begins to flower.
    termId: 5,
    term: '清明',
    pentad: '桐始华',
    pentadIndex: 1,
    pinyin: 'Tóng shǐ huā',
    caption:
      'La paulonia se cubre de flores violetas en la meseta, y su perfume sube hacia la pagoda.',
    what: 'A paulownia in lilac flower on the right of the plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const g = groundY(287) + 1.2;
      return [
        {
          cls: 'cs-sd-stem cs-sd-trunk',
          d:
            line([287, g, 286.6, g - 8]) +
            line([286.6, g - 6, 283.4, g - 10]) +
            line([286.6, g - 6.4, 290.4, g - 10.2]),
        },
        {
          cls: 'cs-sd-crown',
          d:
            ellipse(283.4, g - 11.4, 3.6, 2.4) +
            ellipse(290.6, g - 11.8, 3.6, 2.6) +
            ellipse(287, g - 14, 3.4, 2.2),
        },
        {
          cls: 'cs-sd-lilac',
          d: dots([
            281.4,
            g - 12.4,
            284,
            g - 13.6,
            286,
            g - 15.4,
            288.6,
            g - 14.8,
            291.4,
            g - 13.4,
            293,
            g - 11.6,
            282.6,
            g - 10.4,
            289.4,
            g - 11,
          ]),
        },
      ];
    },
  },
  {
    // 清明 · 田鼠化為鴽: "the field mouse turns into a quail (鴽)": the mice go to ground as the quail appear. Drawn as a quail beside an empty mouse hole.
    termId: 5,
    term: '清明',
    pentad: '田鼠化为鴽',
    pentadIndex: 2,
    pinyin: 'Tián shǔ huà wéi rú',
    caption:
      'Los ratones de campo se esconden y la codorniz aparece entre la hierba: la vida cambia de forma.',
    what: 'A quail on the left plateau beside an empty mouse hole',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => [
      { cls: SILHOUETTE, d: plump(84.6, 190.2, 0.95, 0.5) },
      { cls: 'cs-sd-hole', d: ellipse(95.4, 190.6, 1.4, 0.6) },
    ],
  },
  {
    // 清明 · 虹始見 (3rd): rainbows begin to appear.
    termId: 5,
    term: '清明',
    pentad: '虹始见',
    pentadIndex: 3,
    pinyin: 'Hóng shǐ xiàn',
    caption:
      "Un arco de luz atraviesa el Qinling tras la lluvia, y el aire de Chang'an brilla como jade recién lavado.",
    termScene: true,
    what: 'Faint rainbow over the eastern (left) Qinling',
    layer: 'sky',
    time: 'day',
    // A rainbow needs the sun: none in fog, snow, a storm or under a closed (rain/cloud) sky.
    hideIn: ['fog', 'snow', 'storm', 'cloudy', 'rain'],
    draw: () => {
      const arc = (rad: number) => {
        const p: Pts = [];
        for (let a = 165; a >= 25; a -= 7) {
          const t = (a * Math.PI) / 180;
          p.push(40 + rad * Math.cos(t), 158 - rad * Math.sin(t));
        }
        return line(p);
      };
      return [
        { cls: 'cs-sd-bow cs-sd-bow--r', d: arc(66) },
        { cls: 'cs-sd-bow cs-sd-bow--y', d: arc(64) },
        { cls: 'cs-sd-bow cs-sd-bow--b', d: arc(62) },
      ];
    },
  },
  {
    // 穀雨 · 萍始生 (1st): duckweed begins to grow.
    termId: 6,
    term: '谷雨',
    pentad: '萍始生',
    pentadIndex: 1,
    pinyin: 'Píng shǐ shēng',
    caption:
      "La lenteja de agua florece en el Qujiang y la lluvia de los cereales bendice los campos de Chang'an.",
    termScene: true,
    what: 'Patches of duckweed on the pool',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => {
      const rand = r(6);
      let p: Pts = [];
      for (const [cx, cy] of [
        [14, 172],
        [36, 175.6],
        [58, 170.4],
        [76, 174],
      ])
        p = p.concat(scatter(rand, 16, cx - 5, cx + 5, cy - 0.9, cy + 0.9));
      return [{ cls: 'cs-sd-duckweed', d: dots(p) }];
    },
  },
  {
    // 谷雨 · 鳴鳩拂其羽: the cooing dove flaps its wings.
    termId: 6,
    term: '谷雨',
    pentad: '鸣鸠拂其羽',
    pentadIndex: 2,
    pinyin: 'Míng jiū fú qí yǔ',
    caption:
      "La tórtola sacude sus plumas sobre la roca y su arrullo se mezcla con la lluvia tibia de Chang'an.",
    what: 'A dove on the rock at the pine’s foot, wings raised',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => [
      {
        cls: SILHOUETTE,
        d:
          plump(318.8, 193.4, 0.95) +
          poly([320.4, 191.2, 318.6, 186.4, 322.6, 190.6]) +
          poly([321.4, 191, 324.2, 186.8, 323.4, 191.2]),
      },
    ],
  },
  {
    // 谷雨 · 戴勝降于桑: the hoopoe alights on the mulberry.
    termId: 6,
    term: '谷雨',
    pentad: '戴胜降于桑',
    pentadIndex: 3,
    pinyin: 'Dài shèng jiàng yú sāng',
    caption:
      'La abubilla despliega su cresta y se posa en la morera: es tiempo de criar los gusanos de seda.',
    what: 'A hoopoe with raised crest on a small mulberry on the right of the plateau',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => {
      const g = groundY(287) + 1.2;
      return [
        { cls: 'cs-sd-stem cs-sd-trunk', d: line([287, g, 287.4, g - 7]) },
        { cls: 'cs-sd-crown cs-sd-crown--mulberry', d: ellipse(287.4, g - 10, 5.4, 3.4) },
        { cls: SILHOUETTE, d: poly(place(PERCHED, 279.8, g - 11.4, 0.85)) },
        {
          cls: 'cs-sd-twig',
          d:
            line([279.6, g - 14.6, 279, g - 16.4]) +
            line([280.2, g - 14.8, 280.4, g - 16.8]) +
            line([280.8, g - 14.6, 281.6, g - 16.2]) +
            line([278.8, g - 13.4, 276.8, g - 13.2]),
        },
      ];
    },
  },
  {
    // 立夏 · 螻蟈鳴: the 螻蟈 sings. Drawn as a mole cricket, as in the app data; Zheng Xuan glossed 螻蟈 as a frog, so the identification is uncertain.
    termId: 7,
    term: '立夏',
    pentad: '蝼蝈鸣',
    pentadIndex: 1,
    pinyin: 'Lóu guō míng',
    caption:
      "El grillo topo canta junto al agua del Qujiang y la noche de Chang'an se llena de verano.",
    what: 'A mole cricket at the mouth of its burrow on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: 'cs-sd-earth', d: mounds([[92, 190.6]]) },
      { cls: SILHOUETTE, d: cricket(87.4, 190.2, 1.5) },
    ],
  },
  {
    // 立夏 · 蚯蚓出: the earthworms come out.
    termId: 7,
    term: '立夏',
    pentad: '蚯蚓出',
    pentadIndex: 2,
    pinyin: 'Qiū yǐn chū',
    caption:
      'Las lombrices salen a la tierra húmeda del Leyou, y el suelo respira bajo el primer calor.',
    what: 'Earthworms on the moist ground of the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: ['snow'],
    draw: () => [
      { cls: 'cs-sd-worm', d: worm(78, 190, 6) + worm(86, 193.4, 5) + worm(93, 189.4, 5.4) },
    ],
  },
  {
    // 立夏 · 王瓜生 (3rd): the 王瓜 gourd grows (identification of the plant uncertain).
    termId: 7,
    term: '立夏',
    pentad: '王瓜生',
    pentadIndex: 3,
    pinyin: 'Wáng guā shēng',
    caption:
      "La enredadera trepa sobre la roca y el calor comienza a posarse sobre los tejados rojos de Chang'an.",
    termScene: true,
    what: 'Gourd vine with small leaves and flowers trailing over the left rock',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const vine =
        'M-38 187.2Q-33 185.4 -29 188.2Q-25 185 -21 183.8Q-16 186.4 -12 185.4Q-8 187 -6 189.2Q-2 188.6 3 190.4';
      const leaves = [-34, 186, -27, 187.2, -21, 183.6, -15, 185.4, -9, 186.6, -3, 189]
        .reduce<string[]>(
          (acc, v, i, a) =>
            i % 2 ? acc : [...acc, poly(place(LEAF, v, a[i + 1] - 0.4, 0.9, -30 + i * 9))],
          [],
        )
        .join('');
      return [
        { cls: 'cs-sd-vine', d: vine },
        { cls: 'cs-sd-leaf', d: leaves },
        { cls: 'cs-sd-flower', d: dots([-30.6, 186.4, -18, 184.2, -6.6, 188.2]) },
      ];
    },
  },
  {
    // 小满 · 苦菜秀: the bitter herb (苦菜, sow-thistle) flowers.
    termId: 8,
    term: '小满',
    pentad: '苦菜秀',
    pentadIndex: 1,
    pinyin: 'Kǔ cài xiù',
    caption:
      'Las hierbas amargas florecen en amarillo junto a los campos, alimento humilde de los días largos.',
    what: 'Bitter herbs in yellow flower on the right of the plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const g = groundY(286) + 1.4;
      return [
        {
          cls: 'cs-sd-stem',
          d: [282, 285, 288, 291]
            .map((x, i) => line([x, g, x + 0.4, g - 5 - (i % 2) * 1.6]))
            .join(''),
        },
        {
          cls: 'cs-sd-leaf',
          d: [281.6, 285.4, 289, 292]
            .map((x, i) => poly(place(LEAF, x, g - 0.6, 1, i % 2 ? 160 : 20)))
            .join(''),
        },
        {
          cls: 'cs-sd-flower',
          d: dots([282.4, g - 5, 285.4, g - 6.6, 288.4, g - 5, 291.4, g - 6.6]),
        },
      ];
    },
  },
  {
    // 小满 · 靡草死: the fine, delicate grasses wither in the heat.
    termId: 8,
    term: '小满',
    pentad: '靡草死',
    pentadIndex: 2,
    pinyin: 'Mǐ cǎo sǐ',
    caption:
      'Las hierbas más finas se secan bajo el sol fuerte y la meseta del Leyou se viste de paja.',
    what: 'A patch of withered grass bending on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: ['snow'],
    draw: () => [{ cls: 'cs-sd-straw', d: withered(r(802), 78, 100, 184, 192) }],
  },
  {
    // 小滿 · 麥秋至 (3rd): the wheat's "autumn" (harvest) arrives.
    termId: 8,
    term: '小满',
    pentad: '麦秋至',
    pentadIndex: 3,
    pinyin: 'Mài qiū zhì',
    caption:
      "El trigo dora la meseta y Chang'an respira el olor de la cosecha que se acerca bajo el sol alto.",
    termScene: true,
    what: 'Row of ripening wheat along the right edge of the plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const rand = r(8);
      let stalks = '';
      let ears = '';
      for (let x = 251; x < 292; x += 0.9 + rand() * 0.5) {
        const g = groundY(x) + 1.4;
        const h = 3.6 + rand() * 1.4;
        const lean = 0.3 + rand() * 0.5;
        stalks += line([x, g, x + lean, g - h]);
        ears += poly([
          x + lean - 0.3,
          g - h,
          x + lean + 0.2,
          g - h - 1.6,
          x + lean + 0.45,
          g - h,
        ]);
      }
      return [
        { cls: 'cs-sd-wheat', d: stalks },
        { cls: 'cs-sd-wheat-ear', d: ears },
      ];
    },
  },
  {
    // 芒种 · 螳螂生: the mantises hatch.
    termId: 9,
    term: '芒种',
    pentad: '螳螂生',
    pentadIndex: 1,
    pinyin: 'Táng láng shēng',
    caption:
      'Nacen las mantis entre los tallos, diminutas y atentas, mientras el trigo espera la hoz.',
    what: 'A young mantis on a grass stem on the right of the plateau',
    layer: 'ground',
    time: 'any',
    hideIn: ['snow'],
    draw: () => {
      const g = groundY(287) + 1.4;
      return [
        { cls: 'cs-sd-stem', d: line([287, g, 286.4, g - 9]) },
        { cls: 'cs-sd-mantis', d: mantis(286.6, g - 4.2, 1.5) },
      ];
    },
  },
  {
    // 芒種 · 鵙始鳴 (2nd): the shrike begins to sing.
    termId: 9,
    term: '芒种',
    pentad: '鵙始鸣',
    pentadIndex: 2,
    pinyin: 'Jú shǐ míng',
    caption:
      "El alcaudón canta desde la roca al pie del pino y los campos de Chang'an se llenan de espigas maduras.",
    termScene: true,
    what: 'A shrike perched on the rock at the pine’s foot',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => [
      { cls: SILHOUETTE, d: poly(place(PERCHED, 320.6, 193.4, 0.9)) },
      { cls: 'cs-sd-twig', d: line([321.9, 193.4, 321.8, 192.5]) },
    ],
  },
  {
    // 芒种 · 反舌無聲: the 反舌 (a mimic songbird) falls silent; drawn as the bird perched without song.
    termId: 9,
    term: '芒种',
    pentad: '反舌无声',
    pentadIndex: 3,
    pinyin: 'Fǎn shé wú shēng',
    caption:
      'El pájaro que imitaba todos los cantos guarda silencio en la roca: el verano se impone sin palabras.',
    what: 'A dark songbird perched silently on the left rock',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => [{ cls: SILHOUETTE, d: poly(place(PERCHED, -21, 183.4, 1.05, 0, true)) }],
  },
  {
    // 夏至 · 鹿角解 (1st): the deer shed their antlers.
    termId: 10,
    term: '夏至',
    pentad: '鹿角解',
    pentadIndex: 1,
    pinyin: 'Lù jiǎo jiě',
    caption:
      "El ciervo suelta su cornamenta en el solsticio más largo: el sol alcanza su cenit sobre Chang'an.",
    termScene: true,
    what: 'A deer on the right of the plateau, one antler shed on the ground',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const ox = 262;
      const oy = groundY(266) + 1.2;
      const s = 0.95;
      const antler =
        line(place([1.6, 7.3, 1.2, 9, 0.6, 9.8], ox, oy, s)) +
        line(place([1.2, 9, 1.9, 9.8], ox, oy, s));
      const shed = line(place([10.2, 0.2, 11.6, 0.6, 12.4, 1.2], ox, oy, s));
      return [
        { cls: SILHOUETTE, d: deer(ox, oy, s) },
        { cls: 'cs-sd-twig', d: antler + shed },
      ];
    },
  },
  {
    // 夏至 · 蜩始鳴: the cicadas (蜩) begin to sing; drawn as a cicada on the willow trunk.
    termId: 10,
    term: '夏至',
    pentad: '蜩始鸣',
    pentadIndex: 2,
    pinyin: 'Tiáo shǐ míng',
    caption:
      "La cigarra se aferra al tronco del sauce y su canto llena el mediodía inmóvil de Chang'an.",
    what: 'A cicada clinging to the near-left willow below its crown',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: ({ willowCrown: c }) => [{ cls: SILHOUETTE, d: cicada(c.x + 1.2, c.y + 9, 2) }],
  },
  {
    // 夏至 · 半夏生: the 半夏 (Pinellia ternata) sprouts, at the middle of summer.
    termId: 10,
    term: '夏至',
    pentad: '半夏生',
    pentadIndex: 3,
    pinyin: 'Bàn xià shēng',
    caption:
      'La pinelia brota en la sombra húmeda de la meseta: ha llegado la mitad del verano.',
    what: 'Three-leaved pinellia plants with their slender spathes on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: ['snow'],
    draw: () => [
      {
        cls: 'cs-sd-stem',
        d: [84, 90, 96]
          .map(x => line([x, 191, x, 186]) + line([x + 0.6, 191, x + 1.2, 184.4]))
          .join(''),
      },
      {
        cls: 'cs-sd-leaf',
        d: [84, 90, 96]
          .map(
            x =>
              poly(place(LEAF, x, 186, 1.1, 210)) +
              poly(place(LEAF, x, 186, 1.1, -30)) +
              poly(place(LEAF, x, 186, 1.1, 90)),
          )
          .join(''),
      },
    ],
  },
  {
    // 小暑 · 溫風至: the warm winds arrive; drawn as curling wind strokes over the pool.
    termId: 11,
    term: '小暑',
    pentad: '温风至',
    pentadIndex: 1,
    pinyin: 'Wēn fēng zhì',
    caption:
      'Llegan los vientos cálidos y ondulan sobre el Qujiang como pinceladas de tinta tibia.',
    what: 'Warm wind curling in ink strokes over the pool',
    layer: 'ground',
    time: 'any',
    hideIn: ['fog'],
    draw: () => [
      {
        cls: 'cs-sd-wind cs-sd-wind--warm',
        d: windCurls([
          [4, 150],
          [34, 143],
          [62, 154],
        ]),
      },
    ],
  },
  {
    // 小暑 · 蟋蟀居壁: the crickets keep to the walls (seeking the cool); drawn on the face of the rock.
    termId: 11,
    term: '小暑',
    pentad: '蟋蟀居壁',
    pentadIndex: 2,
    pinyin: 'Xī shuài jū bì',
    caption:
      'El grillo busca el frescor de la piedra y se refugia en la roca, lejos del calor de la meseta.',
    what: 'A cricket on the shaded face of the left rock',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [{ cls: SILHOUETTE, d: cricket(-14, 193.6, 1.5) }],
  },
  {
    // 小暑 · 鷹乃學習 (3rd): the young hawks learn to fly.
    termId: 11,
    term: '小暑',
    pentad: '鹰乃学习',
    pentadIndex: 3,
    pinyin: 'Yīng nǎi xué xí',
    caption:
      'Los jóvenes halcones aprenden a remontar el vuelo sobre el Leyou mientras el calor hace temblar el aire.',
    termScene: true,
    what: 'A hawk and its young circling high in the left sky',
    layer: 'sky',
    time: 'day',
    hideIn: AIRBORNE,
    replacesBirds: true,
    draw: () => [
      {
        cls: SILHOUETTE,
        d: poly(place(RAPTOR, 30, 58, 1.1, -8)) + poly(place(RAPTOR, 46, 66, 0.75, 14)),
      },
    ],
  },
  {
    // 大暑 · 腐草為螢 (1st): rotting grass turns into fireflies.
    termId: 12,
    term: '大暑',
    pentad: '腐草为萤',
    pentadIndex: 1,
    pinyin: 'Fǔ cǎo wéi yíng',
    caption:
      'Las luciérnagas flotan sobre el Qujiang en la noche más cálida del año, hilos de luz entre la tinta.',
    termScene: true,
    what: 'Fireflies over the pool bank (night only)',
    layer: 'ground',
    time: 'night',
    hideIn: ['storm', 'rain', 'snow'],
    draw: () => {
      const rand = r(12);
      return ['a', 'b', 'c'].map(k => ({
        cls: `cs-sd-firefly cs-sd-firefly--${k}`,
        d: dots(scatter(rand, 5, 2, 94, 158, 182)),
      }));
    },
  },
  {
    // 大暑 · 土潤溽暑: the soil is moist and the heat sultry; drawn as heat shimmer over the fields.
    termId: 12,
    term: '大暑',
    pentad: '土润溽暑',
    pentadIndex: 2,
    pinyin: 'Tǔ rùn rù shǔ',
    caption:
      "La tierra húmeda exhala calor y el aire tiembla sobre los campos: Chang'an suda bajo el bochorno.",
    what: 'Heat shimmer rising over the right of the plateau',
    layer: 'ground',
    time: 'day',
    hideIn: ['snow', 'fog'],
    draw: () => [{ cls: 'cs-sd-haze', d: shimmer(252, 294, [166.4, 168.8, 171]) }],
  },
  {
    // 大暑 · 大雨時行: the great rains come in their season; drawn as a distant rain squall over the Qinling.
    termId: 12,
    term: '大暑',
    pentad: '大雨时行',
    pentadIndex: 3,
    pinyin: 'Dà yǔ shí xíng',
    caption:
      'Una cortina de lluvia cruza el Qinling a lo lejos: los aguaceros de verano llegan y se van.',
    what: 'A distant rain squall falling from a cloud over the left Qinling',
    layer: 'sky',
    time: 'any',
    hideIn: ['snow', 'fog'],
    draw: () => [
      { cls: 'cs-sd-cloud cs-sd-cloud--dark', d: cloudShape(36, 108, 44, 9) },
      { cls: 'cs-sd-rainshaft', d: streaks(38, 78, 109, 146, 12) },
    ],
  },
  {
    // 立秋 · 涼風至: the cool winds arrive; drawn as cool wind strokes over the pool.
    termId: 13,
    term: '立秋',
    pentad: '凉风至',
    pentadIndex: 1,
    pinyin: 'Liáng fēng zhì',
    caption:
      "El primer viento fresco peina los sauces del Qujiang y Chang'an siente que el verano se despide.",
    what: 'Cool wind curling in grey-blue strokes over the pool',
    layer: 'ground',
    time: 'any',
    hideIn: ['fog'],
    draw: () => [
      {
        cls: 'cs-sd-wind',
        d: windCurls([
          [10, 146],
          [40, 154],
          [66, 144],
        ]),
      },
    ],
  },
  {
    // 立秋 · 白露降 (2nd): white dew descends.
    termId: 13,
    term: '立秋',
    pentad: '白露降',
    pentadIndex: 2,
    pinyin: 'Bái lù jiàng',
    caption:
      "El rocío blanco toca la hierba del Leyou: el otoño llega sin avisar y Chang'an muda de piel.",
    termScene: true,
    what: 'Glints of dew on the grass of the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: ['storm', 'rain', 'snow'],
    draw: () => {
      const rand = r(13);
      const p: Pts = [];
      for (let i = 0; i < 26; i++) {
        const x = -26 + rand() * 124;
        p.push(x, groundY(x) + 1 + rand() * 10);
      }
      return [{ cls: 'cs-sd-dew', d: dots(p) }];
    },
  },
  {
    // 立秋 · 寒蟬鳴: the cold cicada sings; drawn as a cicada on the pine trunk.
    termId: 13,
    term: '立秋',
    pentad: '寒蝉鸣',
    pentadIndex: 3,
    pinyin: 'Hán chán míng',
    caption:
      'La cigarra del frío canta en el tronco del pino, voz delgada de un otoño que comienza.',
    what: 'A cicada on the trunk of the foreground pine',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: ({ pinePerch: p = PINE_PERCH }) => [
      { cls: SILHOUETTE, d: cicada(p.x - 0.6, p.y, 2.1) },
    ],
  },
  {
    // 处暑 · 鷹乃祭鳥: the hawk "sacrifices" birds: it lays out its prey, read by the ancients as an offering.
    termId: 14,
    term: '处暑',
    pentad: '鹰乃祭鸟',
    pentadIndex: 1,
    pinyin: 'Yīng nǎi jì niǎo',
    caption:
      'El halcón posa su presa sobre la roca como una ofrenda: empieza el tiempo de la caza.',
    what: 'A hawk on the rock at the pine’s foot with its prey laid before it',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => [
      {
        cls: SILHOUETTE,
        d: poly(place(PERCHED, 318.6, 193.4, 1.25)) + ellipse(326.4, 191.4, 1.2, 0.5),
      },
      { cls: 'cs-sd-twig', d: line([318.2, 197, 317.2, 196.6]) },
    ],
  },
  {
    // 处暑 · 天地始肅: heaven and earth begin to grow austere; drawn as a lone tree reddening on the far shore.
    termId: 14,
    term: '处暑',
    pentad: '天地始肃',
    pentadIndex: 2,
    pinyin: 'Tiān dì shǐ sù',
    caption:
      'Un árbol solitario enrojece junto al agua: el cielo y la tierra se vuelven graves y serenos.',
    what: 'A lone tree with sparse reddening leaves on the far shore of the pool',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      {
        cls: 'cs-sd-stem cs-sd-trunk',
        d:
          line([-22, 166.2, -22.4, 158]) +
          line([-22.3, 160.4, -25.6, 156.4]) +
          line([-22.3, 161, -18.8, 157.6]),
      },
      {
        cls: 'cs-sd-red-leaf',
        d: dots([
          -26, 156, -24.4, 154.6, -22.6, 155.6, -20.4, 156.4, -18.6, 157.2, -25.2, 158.2, -19.6,
          158.8, -23.4, 153.8,
        ]),
      },
    ],
  },
  {
    // 處暑 · 禾乃登 (3rd): the grain is brought in.
    termId: 14,
    term: '处暑',
    pentad: '禾乃登',
    pentadIndex: 3,
    pinyin: 'Hé nǎi dēng',
    caption:
      "Las gavillas reposan sobre la meseta y el calor se retira; Chang'an recibe la abundancia del año.",
    termScene: true,
    what: 'Two stooks of harvested grain on the right of the plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      let body = '';
      let ties = '';
      for (const x of [262, 271]) {
        const g = groundY(x) + 1.2;
        body += poly([x - 2.6, g, x - 0.6, g - 6.4, x, g - 7.4, x + 0.6, g - 6.4, x + 2.6, g]);
        ties += line([x - 1.3, g - 3.6, x + 1.3, g - 3.6]);
      }
      return [
        { cls: 'cs-sd-sheaf', d: body },
        { cls: 'cs-sd-twig', d: ties },
      ];
    },
  },
  {
    // 白露 · 鴻雁來 (1st): the wild geese come (flying south).
    termId: 15,
    term: '白露',
    pentad: '鸿雁来',
    pentadIndex: 1,
    pinyin: 'Hóng yàn lái',
    caption:
      "Los gansos emprenden el vuelo hacia el sur sobrevolando el Qinling: el otoño ya es dueño de Chang'an.",
    termScene: true,
    what: 'Skein of wild geese heading south towards the Qinling (apex down), left sky',
    layer: 'sky',
    time: 'day',
    hideIn: ['storm', 'fog'],
    replacesBirds: true,
    draw: () => [{ cls: 'cs-sd-bird', d: skein(56, 92, false) }],
  },
  {
    // 白露 · 玄鳥歸: the swallows go back (south).
    termId: 15,
    term: '白露',
    pentad: '玄鸟归',
    pentadIndex: 2,
    pinyin: 'Xuán niǎo guī',
    caption:
      "Las golondrinas se alejan hacia el sur sobre el Qinling, dejando vacíos los aleros de Chang'an.",
    what: 'Three small swallows receding south towards the Qinling',
    layer: 'sky',
    time: 'day',
    hideIn: AIRBORNE,
    replacesBirds: true,
    draw: () => [
      {
        cls: SILHOUETTE,
        d:
          poly(place(SWALLOW, 40, 104, 0.6, 160)) +
          poly(place(SWALLOW, 54, 98, 0.5, 172)) +
          poly(place(SWALLOW, 66, 108, 0.45, 188)),
      },
    ],
  },
  {
    // 白露 · 群鳥養羞: the birds store provisions (羞 = 饈).
    termId: 15,
    term: '白露',
    pentad: '群鸟养羞',
    pentadIndex: 3,
    pinyin: 'Qún niǎo yǎng xiū',
    caption:
      'Los pájaros recogen granos en la meseta y guardan provisiones para el invierno que se acerca.',
    what: 'Two sparrows gathering grain on the left plateau',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => [
      {
        cls: SILHOUETTE,
        d:
          poly(place(PERCHED, 84, 190.4, 0.7)) + poly(place(PERCHED, 94, 191.6, 0.65, 0, true)),
      },
      {
        cls: 'cs-sd-grain',
        d: dots([88.6, 190.6, 89.8, 191.2, 90.6, 190.4, 87.4, 191.4, 91.6, 191.8]),
      },
    ],
  },
  {
    // 秋分 · 雷始收聲: the thunder begins to withdraw its voice; drawn as a last thin storm cloud dissolving over the Qinling.
    termId: 16,
    term: '秋分',
    pentad: '雷始收声',
    pentadIndex: 1,
    pinyin: 'Léi shǐ shōu shēng',
    caption:
      'La última nube de tormenta se deshace sobre el Qinling: el trueno guarda su voz hasta la primavera.',
    what: 'A last thin storm cloud dissolving over the left Qinling',
    layer: 'sky',
    time: 'any',
    hideIn: ['fog'],
    draw: () => [{ cls: 'cs-sd-cloud', d: cloudShape(6, 122, 70, 6) }],
  },
  {
    // 秋分 · 蟄蟲坯戶: the hibernating insects seal (坯) their doors with earth.
    termId: 16,
    term: '秋分',
    pentad: '蛰虫坯户',
    pentadIndex: 2,
    pinyin: 'Zhé chóng pī hù',
    caption:
      'Los insectos tapian con barro la entrada de sus refugios en la tierra fría del Leyou.',
    what: 'Burrow mounds with mud-sealed doors on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: 'cs-sd-earth cs-sd-earth--fill', d: domes(LEFT_SPOTS) },
      {
        cls: 'cs-sd-hole cs-sd-hole--sealed',
        d: LEFT_SPOTS.map(([x, y]) => ellipse(x, y - 0.7, 0.6, 0.4)).join(''),
      },
    ],
  },
  {
    // 秋分 · 水始涸 (3rd): the waters begin to dry up.
    termId: 16,
    term: '秋分',
    pentad: '水始涸',
    pentadIndex: 3,
    pinyin: 'Shuǐ shǐ hé',
    caption:
      'El Qujiang retrocede y deja al descubierto la orilla de barro: el equinoccio divide el año en silencio.',
    termScene: true,
    what: 'A strip of exposed shore where the pool has receded',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => [
      {
        cls: 'cs-sd-shoal',
        d: 'M-46 166.8C-10 165.4 22 167.6 48 166.4C70 165.4 86 165.8 93 168.2L93.6 170C80 168.2 60 168.6 48 168.8C20 170 -10 168.2 -46 169.4Z',
      },
      {
        cls: 'cs-sd-twig',
        d: 'M-40 169.2C-10 168 20 169.8 48 168.8C62 168.4 80 168.2 93.4 169.8',
      },
    ],
  },
  {
    // 寒露 · 鴻雁來賓: the wild geese come as guests (the last flocks arrive and rest).
    termId: 17,
    term: '寒露',
    pentad: '鸿雁来宾',
    pentadIndex: 1,
    pinyin: 'Hóng yàn lái bīn',
    caption:
      'Los últimos gansos llegan como huéspedes y descansan sobre el agua tranquila del Qujiang.',
    what: 'Three wild geese resting on the pool',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => [
      {
        cls: SILHOUETTE,
        d: goose(18, 172.6, 1.05) + goose(31, 174.6, 1.1) + goose(50, 171.4, 0.95),
      },
    ],
  },
  {
    // 寒露 · 雀入大水為蛤: "sparrows enter the great water and become clams": the sparrows vanish as clams appear on the shores, read by the ancients as a transformation. Drawn as a sparrow diving towards the water and clam shells on the bank.
    termId: 17,
    term: '寒露',
    pentad: '雀入大水为蛤',
    pentadIndex: 2,
    pinyin: 'Què rù dà shuǐ wéi gé',
    caption:
      'Los gorriones desaparecen y en la orilla aparecen almejas: los antiguos creían que el ave se volvía concha.',
    what: 'A sparrow diving towards the pool and clam shells on the bank',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    replacesBirds: true,
    draw: () => [
      { cls: SILHOUETTE, d: poly(place(SWALLOW, 76, 160, 0.95, 140)) },
      {
        cls: 'cs-sd-shell',
        d: shell(84.6, 182.6, 2.8) + shell(91, 183.4, 2.4) + shell(97.2, 182.8, 2.6),
      },
    ],
  },
  {
    // 寒露 · 菊有黃華 (3rd): the chrysanthemums bear yellow flowers.
    termId: 17,
    term: '寒露',
    pentad: '菊有黄华',
    pentadIndex: 3,
    pinyin: 'Jú yǒu huáng huā',
    caption:
      'El crisantemo abre su flor amarilla en la meseta y el rocío frío anuncia el fin del tiempo cálido.',
    termScene: true,
    what: 'A clump of yellow chrysanthemums on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const heads = [84, 184.6, 88, 183.2, 92, 184.4, 86.4, 186.4, 95, 185.8];
      let stems = '';
      for (let i = 0; i < heads.length; i += 2)
        stems += line([heads[i], heads[i + 1], 89 + (i - 4) * 0.2, 190.4]);
      return [
        { cls: 'cs-sd-stem', d: stems },
        { cls: 'cs-sd-chrysanthemum', d: dots(heads) },
        { cls: 'cs-sd-heart', d: dots(heads) },
      ];
    },
  },
  {
    // 霜降 · 豺乃祭獸: the dhole (豺) "sacrifices" beasts: it lays out its prey, read as an offering.
    termId: 18,
    term: '霜降',
    pentad: '豺乃祭兽',
    pentadIndex: 1,
    pinyin: 'Chái nǎi jì shòu',
    caption:
      'El cuón deja sus presas en fila sobre la meseta, ofrenda salvaje antes del invierno.',
    what: 'A dhole on the right of the plateau with its prey laid out',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const g = groundY(262) + 1.2;
      return [
        {
          cls: SILHOUETTE,
          d:
            beast(258, g, 0.9) +
            ellipse(272, g - 0.6, 1.4, 0.6) +
            ellipse(275.6, g - 0.6, 1.2, 0.55),
        },
        { cls: 'cs-sd-twig', d: beastTail(258, g, 0.9) },
      ];
    },
  },
  {
    // 霜降 · 草木黃落 (2nd): grass and trees yellow and shed their leaves.
    termId: 18,
    term: '霜降',
    pentad: '草木黄落',
    pentadIndex: 2,
    pinyin: 'Cǎo mù huáng luò',
    caption:
      'Las hojas amarillas caen en remolinos alrededor de los sauces y la escarcha pinta el amanecer de blanco.',
    termScene: true,
    what: 'Yellow leaves falling around the willows',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const rand = r(18);
      let d = '';
      for (let i = 0; i < 10; i++)
        d += poly(
          place(LEAF, 2 + rand() * 92, 142 + rand() * 40, 0.8 + rand() * 0.3, rand() * 180),
        );
      return [{ cls: 'cs-sd-fall-leaf', d }];
    },
  },
  {
    // 霜降 · 蟄蟲咸俯: all the hibernating insects lie dormant, heads down.
    termId: 18,
    term: '霜降',
    pentad: '蛰虫咸俯',
    pentadIndex: 3,
    pinyin: 'Zhé chóng xián fǔ',
    caption:
      'Todos los insectos duermen ya bajo tierra, cabeza abajo, y el Leyou se cubre de silencio.',
    what: 'Closed burrows under the first frost on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      {
        cls: 'cs-sd-hole',
        d: LEFT_SPOTS.map(([x, y]) => ellipse(x, y - 0.2, 1.1, 0.45)).join(''),
      },
      { cls: 'cs-sd-frost', d: dots(scatter(r(1803), 22, 78, 100, 184, 195)) },
    ],
  },
  {
    // 立冬 · 水始冰 (1st): water begins to freeze.
    termId: 19,
    term: '立冬',
    pentad: '水始冰',
    pentadIndex: 1,
    pinyin: 'Shuǐ shǐ bīng',
    caption:
      "El primer hielo bordea las orillas del Qujiang y el invierno pone su mano sobre Chang'an.",
    termScene: true,
    what: 'A rim of thin ice along the shores of the pool',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => [
      {
        cls: 'cs-sd-ice',
        d: 'M-46 166.8C-10 165.4 22 167.6 48 166.4C70 165.4 86 165.8 93 168.2C97 170 97 175 92 178.6L89 178C92 174 92 171 89.6 169.4C80 167.8 62 168 48 168.2C20 169.2 -10 167.6 -46 168.8Z',
      },
      {
        cls: 'cs-sd-ice-crack',
        d: 'M10 167.4L12 168.4M40 167.2L41 168M70 166.6L72.4 167.8M91 172L93.4 172.6',
      },
    ],
  },
  {
    // 立冬 · 地始凍: the earth begins to freeze.
    termId: 19,
    term: '立冬',
    pentad: '地始冻',
    pentadIndex: 2,
    pinyin: 'Dì shǐ dòng',
    caption:
      "La escarcha endurece la tierra del Leyou y cruje bajo los pasos en el alba de Chang'an.",
    what: 'Hoarfrost and frozen cracks across the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: 'cs-sd-frost', d: dots(scatter(r(1902), 46, -26, 100, 184, 199)) },
      {
        cls: 'cs-sd-ice-crack',
        d: 'M-20 194L-12 195.4L-6 194.2M30 196L38 197.6L46 196.2M38 197.6L40 199.4M70 193.4L78 194.8',
      },
    ],
  },
  {
    // 立冬 · 雉入大水為蜃: "the pheasant enters the great water and becomes a giant clam (蜃)": pheasants vanish in winter as large shells appear, read as a transformation. Drawn as a pheasant at the bank beside large shells.
    termId: 19,
    term: '立冬',
    pentad: '雉入大水为蜃',
    pentadIndex: 3,
    pinyin: 'Zhì rù dà shuǐ wéi shèn',
    caption:
      'El faisán se esconde y grandes conchas aparecen junto al agua: el invierno transforma a las criaturas.',
    what: 'A pheasant at the pool bank beside two large shells',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: SILHOUETTE, d: poly(place(PHEASANT, 76, 182.6, 1.1)) },
      { cls: 'cs-sd-shell', d: shell(90, 182.8, 3) + shell(96.6, 183.4, 2.6) },
    ],
  },
  {
    // 小雪 · 虹藏不見: the rainbows hide and are no longer seen. Drawn as the absence: a rain-washed sky with pale bands where the 清明 rainbow stood.
    termId: 20,
    term: '小雪',
    pentad: '虹藏不见',
    pentadIndex: 1,
    pinyin: 'Hóng cáng bù xiàn',
    caption:
      'Donde brillaba el arco iris solo queda un cielo lavado: el arco se esconde hasta la primavera.',
    what: 'Pale rain-washed bands in the empty left sky where the rainbow used to be',
    layer: 'sky',
    time: 'any',
    hideIn: [],
    draw: () => [
      {
        cls: 'cs-sd-wash',
        d: 'M-22 112C10 108 50 109 98 113M-18 122C20 118 60 119 96 124M-10 102C20 99 52 100 84 103',
      },
    ],
  },
  {
    // 小雪 · 天氣上升 (2nd): the qi of heaven rises (and the earth's descends).
    termId: 20,
    term: '小雪',
    pentad: '天气上升',
    pentadIndex: 2,
    pinyin: 'Tiān qì shàng shēng',
    caption:
      'El vapor del frío asciende del Qujiang como espíritus de tinta hacia el cielo gris de la pequeña nieve.',
    termScene: true,
    what: 'Thin wisps of cold vapour rising from the pool',
    layer: 'ground',
    time: 'any',
    hideIn: WET,
    draw: () => {
      let d = '';
      for (const x of [12, 30, 47, 63, 80])
        d += `M${x} 168C${x - 2} 162 ${x + 2.4} 157 ${x + 1} 150.4`;
      return [{ cls: 'cs-sd-qi', d }];
    },
  },
  {
    // 小雪 · 閉塞而成冬: (heaven and earth) close up and winter is formed; drawn as a heavy cloud lid on the Qinling.
    termId: 20,
    term: '小雪',
    pentad: '闭塞而成冬',
    pentadIndex: 3,
    pinyin: 'Bì sè ér chéng dōng',
    caption:
      'Nubes pesadas cierran las cumbres del Qinling: cielo y tierra se sellan y nace el invierno.',
    what: 'A heavy band of cloud sealing the peaks of the left Qinling',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [{ cls: 'cs-sd-cloud cs-sd-cloud--heavy', d: cloudShape(-34, 118, 130, 13) }],
  },
  {
    // 大雪 · 鶡鴠不鳴: the 鶡鴠 (a bird of the cold; identification uncertain) stops calling; drawn as a bird huddled silent in the bare willow.
    termId: 21,
    term: '大雪',
    pentad: '鹖鴠不鸣',
    pentadIndex: 1,
    pinyin: 'Hé dàn bù míng',
    caption:
      "El ave del frío calla, encogida en el sauce desnudo, mientras la nieve cubre Chang'an.",
    what: 'A small bird huddled silent at the crown of the bare willow',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: ({ willowCrown: c }) => [
      { cls: SILHOUETTE, d: plump(c.x - 6.4, c.y + 4.2, 0.85, 0.4) },
    ],
  },
  {
    // 大雪 · 虎始交: the tigers begin to mate; drawn as a pair of tigers on the plateau below the Qinling.
    termId: 21,
    term: '大雪',
    pentad: '虎始交',
    pentadIndex: 2,
    pinyin: 'Hǔ shǐ jiāo',
    caption:
      'En la gran nevada, los tigres del Qinling se buscan: aun en el frío, la vida prepara su regreso.',
    what: 'A pair of tigers on the right of the plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const g1 = groundY(258) + 1.2;
      const g2 = groundY(280) + 1.2;
      return [
        { cls: 'cs-sd-tiger', d: beast(253, g1, 1.2) + beast(291, g2, 1.15, true) },
        {
          cls: 'cs-sd-stripe',
          d:
            stripes(253, g1, 1.2) +
            stripes(291, g2, 1.15, true) +
            beastTail(253, g1, 1.2) +
            beastTail(291, g2, 1.15, true),
        },
      ];
    },
  },
  {
    // 大雪 · 荔挺出 (3rd): the 荔 plant puts out shoots (often identified as Iris lactea; uncertain).
    termId: 21,
    term: '大雪',
    pentad: '荔挺出',
    pentadIndex: 3,
    pinyin: 'Lì tǐng chū',
    caption:
      'Los brotes de 荔 rompen la tierra helada: incluso en la gran nevada, la vida empuja hacia la luz.',
    termScene: true,
    what: 'Slender green shoots of 荔 piercing the ground on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      let d = '';
      for (let i = -3; i <= 3; i++)
        d += `M${90 + i * 0.3} 190.4Q${90 + i * 0.9} 187 ${90 + i * 1.5} ${183.4 + Math.abs(i) * 0.9}`;
      return [{ cls: 'cs-sd-blade', d }];
    },
  },
  {
    // 冬至 · 蚯蚓結: the earthworms knot themselves (curl up underground).
    termId: 22,
    term: '冬至',
    pentad: '蚯蚓结',
    pentadIndex: 1,
    pinyin: 'Qiū yǐn jié',
    caption:
      'Bajo la tierra helada, las lombrices se enroscan como nudos de seda esperando la luz.',
    what: 'Knotted earthworms in a patch of bare earth on the left plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: 'cs-sd-earth cs-sd-earth--fill', d: ellipse(89, 191.4, 6.4, 1.6) },
      { cls: 'cs-sd-worm', d: knot(86, 191.4) + knot(91.6, 191.2) },
    ],
  },
  {
    // 冬至 · 麋角解: the milu (麋, Père David’s deer) sheds its antlers.
    termId: 22,
    term: '冬至',
    pentad: '麋角解',
    pentadIndex: 2,
    pinyin: 'Mí jiǎo jiě',
    caption:
      'El milú deja caer su cornamenta en la meseta: el solsticio de invierno renueva lo que muere.',
    what: 'A milu deer with a long tail on the right of the plateau, an antler shed beside it',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const ox = 264;
      const oy = groundY(268) + 1.2;
      const s = 1;
      return [
        { cls: SILHOUETTE, d: deer(ox, oy, s) },
        {
          cls: 'cs-sd-twig',
          d:
            line(place([8.6, 4.4, 9.8, 3.4, 10.2, 2.2], ox, oy, s)) +
            line(place([1.2, 7.4, 2.4, 9.2, 3.8, 9.8], ox, oy, s)) +
            line(place([2.4, 9.2, 2, 10.4], ox, oy, s)) +
            line(place([11.4, 0.2, 12.8, 0.8, 14, 0.6], ox, oy, s)) +
            line(place([12.8, 0.8, 13, 1.8], ox, oy, s)),
        },
      ];
    },
  },
  {
    // 冬至 · 水泉動 (3rd): the springs begin to move (under the ice).
    termId: 22,
    term: '冬至',
    pentad: '水泉动',
    pentadIndex: 3,
    pinyin: 'Shuǐ quán dòng',
    caption:
      'Una grieta en el hielo revela el agua viva del Qujiang: el solsticio más oscuro guarda la semilla de la luz.',
    termScene: true,
    what: 'A small open patch of spring water in the frozen pool, with ripples',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => [
      { cls: 'cs-sd-water', d: ellipse(40, 172.6, 6, 1.3) },
      { cls: 'cs-sd-ring', d: ellipse(40, 172.6, 3.6, 0.7) + ellipse(40, 172.6, 8.6, 1.9) },
    ],
  },
  {
    // 小寒 · 雁北鄉: the wild geese turn (鄉 = 向) towards the north.
    termId: 23,
    term: '小寒',
    pentad: '雁北乡',
    pentadIndex: 1,
    pinyin: 'Yàn běi xiàng',
    caption:
      'Los gansos giran hacia el norte en lo alto del cielo frío: ya presienten el viaje de regreso.',
    what: 'A small distant skein of geese wheeling north high in the left sky',
    layer: 'sky',
    time: 'day',
    hideIn: ['storm', 'fog'],
    replacesBirds: true,
    draw: () => [{ cls: 'cs-sd-bird', d: skein(46, 52, true, 2) }],
  },
  {
    // 小寒 · 鵲始巢 (2nd): the magpies begin to build their nests.
    termId: 23,
    term: '小寒',
    pentad: '鹊始巢',
    pentadIndex: 2,
    pinyin: 'Què shǐ cháo',
    caption:
      'La urraca comienza su nido en el sauce desnudo: el frío más profundo no apaga el instinto de crear.',
    termScene: true,
    what: 'A magpie beside its nest in the fork of the bare near-left willow',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: ({ willowCrown: c }) => {
      const nest =
        ellipse(c.x, c.y + 1.2, 2.4, 1.1) +
        line([c.x - 2.4, c.y + 0.6, c.x + 2.2, c.y + 1.8]) +
        line([c.x - 2, c.y + 1.8, c.x + 2.4, c.y + 0.6]);
      return [
        { cls: 'cs-sd-nest', d: nest },
        { cls: SILHOUETTE, d: poly(place(PERCHED, c.x + 3.6, c.y + 2.4, 0.85)) },
        { cls: 'cs-sd-magpie-white', d: ellipse(c.x + 5.4, c.y + 0.6, 0.9, 0.5) },
      ];
    },
  },
  {
    // 小寒 · 雉雊: the pheasants call.
    termId: 23,
    term: '小寒',
    pentad: '雉雊',
    pentadIndex: 3,
    pinyin: 'Zhì gòu',
    caption:
      'El faisán llama a su pareja desde la meseta helada y su grito rasga el silencio del invierno.',
    what: 'A cock pheasant calling, head raised, on the right of the plateau',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => {
      const g = groundY(278) + 1.2;
      return [
        { cls: SILHOUETTE, d: poly(place(PHEASANT, 274, g, 1.15)) },
        { cls: 'cs-sd-wattle', d: dots([273.6, g - 5.6]) },
      ];
    },
  },
  {
    // 大寒 · 雞乳: the hens begin to brood (lay and sit on their eggs).
    termId: 24,
    term: '大寒',
    pentad: '鸡乳',
    pentadIndex: 1,
    pinyin: 'Jī rǔ',
    caption:
      'La gallina se echa sobre sus huevos en el nido de paja: en lo más frío del año, la vida se incuba.',
    what: 'A hen sitting on a straw nest on the right of the plateau',
    layer: 'ground',
    time: 'any',
    hideIn: [],
    draw: () => {
      const g = groundY(284) + 1.2;
      return [
        { cls: 'cs-sd-sheaf', d: ellipse(285, g - 0.8, 4.4, 1.3) },
        {
          cls: SILHOUETTE,
          d:
            plump(282.4, g - 1.2, 1.05, 0.8) +
            poly([286.4, g - 4.2, 286.8, g - 5.4, 287.4, g - 4.2]),
        },
      ];
    },
  },
  {
    // 大寒 · 征鳥厲疾: the birds of prey fly fierce and swift.
    termId: 24,
    term: '大寒',
    pentad: '征鸟厉疾',
    pentadIndex: 2,
    pinyin: 'Zhēng niǎo lì jí',
    caption:
      'El halcón se lanza en picado sobre el Qujiang helado, feroz y veloz en el aire del gran frío.',
    what: 'A falcon stooping steeply in the left sky, with speed lines',
    layer: 'sky',
    time: 'day',
    hideIn: AIRBORNE,
    replacesBirds: true,
    draw: () => [
      { cls: SILHOUETTE, d: poly(place(FALCON, 54, 74, 1.4, 150)) },
      {
        cls: 'cs-sd-twig cs-sd-speed',
        d:
          line([47, 63, 51.6, 70]) +
          line([50.4, 61.4, 54.4, 68.4]) +
          line([44.4, 65.6, 49, 72]),
      },
    ],
  },
  {
    // 大寒 · 水澤腹堅 (3rd): the waters and marshes freeze solid.
    termId: 24,
    term: '大寒',
    pentad: '水泽腹坚',
    pentadIndex: 3,
    pinyin: 'Shuǐ zé fù jiān',
    caption:
      'El gran frío agrieta el hielo del Qujiang bajo la nieve acumulada en sus orillas: el año llega a su último aliento.',
    termScene: true,
    what: 'Cracks in the thick ice of the frozen pool, snow drifted along the edge',
    layer: 'pool',
    time: 'any',
    hideIn: [],
    draw: () => [
      {
        cls: 'cs-sd-ice-crack',
        d: 'M-30 171L-14 172.6L-2 171.4L12 173.6M12 173.6L24 172.4L38 174.8L50 173M24 172.4L30 170M50 173L64 175.4L80 173.2L88 174.6M38 174.8L42 177.4M64 175.4L60 178',
      },
      {
        cls: 'cs-sd-drift',
        d: 'M-46 169.2C-20 167.6 10 169.6 40 168.2C60 167.4 80 167.6 92 169.6L92 170.6C70 169.4 50 170 30 170.2C0 170.8 -24 169.6 -46 170.4Z',
      },
    ],
  },
];

/** The 24 original one-per-term details (the pentad each term scene showed before the 72). */
export const TERM_DETAILS: PentadDetail[] = PENTAD_DETAILS.filter(d => d.termScene);

/** The original detail of a term (1–24). */
export const termDetail = (termId: number): PentadDetail | undefined =>
  TERM_DETAILS.find(d => d.termId === termId);

/** The detail of a pentad: term 1–24, pentad 1–3 (as from getChineseCalendarData). */
export const pentadDetail = (termId: number, pentadIndex: number): PentadDetail | undefined =>
  PENTAD_DETAILS.find(d => d.termId === termId && d.pentadIndex === pentadIndex);

/** Whether the detail suits the hour and the weather (the aurora counts as night). */
export const detailVisible = (
  detail: TermDetail,
  isDay: boolean,
  weather: WeatherCondition,
  aurora: boolean,
): boolean => {
  if (detail.hideIn.includes(weather)) return false;
  const day = isDay && !aurora;
  if (detail.time === 'day') return day;
  return detail.time === 'night' ? !day : true;
};

// ── Frozen pool ───────────────────────────────────────────────────────────────

/**
 * Terms in which the Qujiang is drawn frozen over: 冬至, 小寒, 大寒. Water only
 * begins to freeze in 立冬 (水始冰, drawn as a rim of ice), the ice is solid by
 * 大寒 (水澤腹堅) and thaws in 立春 (東風解凍, drawn as floes).
 */
export const POOL_FROZEN_TERMS: ReadonlySet<number> = new Set([22, 23, 24]);

export const isPoolFrozen = (termId: number) => POOL_FROZEN_TERMS.has(termId);

// ── Continuous seasonal base ──────────────────────────────────────────────────

const smooth = (a: number, b: number, t: number) => {
  const c = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return c * c * (3 - 2 * c);
};

/** Willow leaf colours along the year (fraction t from 立春); piecewise-linear, so continuous. */
const LEAF_STOPS: [number, string][] = [
  [0, '#b9c77a'], // first buds: pale yellow-green
  [0.17, '#a9c464'], // 清明: fresh green
  [0.33, '#5f7d42'], // 芒種: full summer green
  [0.58, '#5b7440'], // 處暑
  [0.7, '#b39a48'], // 寒露: yellowing
  [0.8, '#a07a44'], // 立冬: brown-ochre
  [1, '#b9c77a'],
];

const leafColour = (t: number) => {
  for (let i = 1; i < LEAF_STOPS.length; i++) {
    const [t1, c1] = LEAF_STOPS[i];
    const [t0, c0] = LEAF_STOPS[i - 1];
    if (t <= t1) return lerpColor(c0, c1, (t - t0) / (t1 - t0));
  }
  return LEAF_STOPS[0][1];
};

export interface SeasonBase {
  /** Fraction of the solar year from 立春 (315°), 0–1. */
  t: number;
  /** Willow foliage 0 (bare) – 1 (full). */
  foliage: number;
  /** Leaf colour. */
  leaf: string;
  /** −1 coldest (around 大寒) … +1 warmest (around 大暑): tints the paper. */
  warmth: number;
}

/**
 * Seasonal base from the sun's ecliptic longitude (degrees). Foliage: bare in
 * winter, budding from 雨水 (草木萌動), full by 立夏, thinning from 寒露 and
 * bare again by 大雪. Warmth follows the temperature, which lags the sun by
 * about a month: warmest at 大暑 (120°), coldest at 大寒 (300°).
 */
export const seasonBase = (longitude: number): SeasonBase => {
  const t = ((((longitude - 315) % 360) + 360) % 360) / 360;
  const foliage = smooth(0.06, 0.25, t) * (1 - smooth(0.68, 0.86, t));
  return {
    t,
    foliage,
    leaf: leafColour(t),
    warmth: Math.cos(((longitude - 120) * Math.PI) / 180),
  };
};

/** Shifts a paper colour slightly warmer (amber) or colder (grey-blue) with the season. */
export const seasonPaper = (hex: string, warmth: number) =>
  warmth >= 0
    ? lerpColor(hex, '#f2dcae', warmth * 0.16)
    : lerpColor(hex, '#d9e1e6', -warmth * 0.2);

/** Bounding box of every coordinate pair in a detail's paths. */
export const detailBox = (strokes: DetailStroke[]) => {
  const nums = strokes.flatMap(s => (s.d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number));
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};

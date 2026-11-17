/**
 * The seasons in the Zhongguo hero, driven by the 24 solar terms (二十四節氣).
 *
 * 1. One small ink detail per term, drawn from one of that term's three
 *    pentads (候) of the 七十二候 sequence, as listed in
 *    `utils/chineseCalendarData.ts`. The sequence of 72 pentad signs is
 *    attested in the 逸周書·時訓解; most signs also appear, month by month,
 *    in the 禮記·月令 / 呂氏春秋 calendars. The app's data uses the later
 *    standard wording (e.g. 鷹化為鳩, 田鼠化為鴽); variants exist.
 * 2. A continuous seasonal base (`seasonBase`) from the sun's ecliptic
 *    longitude: willow foliage and its colour, a warmer or colder paper tone.
 * 3. The Qujiang pool is frozen in the three coldest terms (`POOL_FROZEN_TERMS`).
 *
 * The term comes from `getChineseCalendarData(date)` (the same reckoning as the
 * solar-term card), the longitude from `getSolarLongitudeDeg(date)`, so hero,
 * card and time travel always agree. Geometry only: drawing is in
 * `components/ChineseScene.tsx`, colours in `ChineseScene.css` (`cs-sd-*`).
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
const skein = (ax: number, ay: number, north: boolean) => {
  const s = north ? 1.7 : 1.25;
  const dir = north ? 1 : -1;
  let d = wing(ax, ay, s);
  for (let i = 1; i <= 3; i++) {
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

// ── The table ─────────────────────────────────────────────────────────────────

export type DetailLayer = 'sky' | 'pool' | 'ground';
export type DetailTime = 'day' | 'night' | 'any';

export interface DetailStroke {
  /** CSS class (`cs-sd-*`). */
  cls: string;
  d: string;
}

export interface DetailContext {
  /** Fork of the near-left willow (for the magpie's nest). */
  willowCrown: { x: number; y: number };
}

export interface TermDetail {
  termId: number;
  /** Term as written in chineseCalendarData. */
  term: string;
  /** The pentad sign drawn, as written in chineseCalendarData. */
  pentad: string;
  /** Which of the term's three pentads (1–3). */
  pentadIndex: number;
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

const AIRBORNE: WeatherCondition[] = ['storm', 'rain', 'snow', 'fog'];
const WET: WeatherCondition[] = ['storm', 'rain'];

const r = (termId: number) => seededRandom(termId * 97 + 13);

export const TERM_DETAILS: TermDetail[] = [
  {
    // 立春 · 東風解凍 (1st pentad): the east wind thaws the ice.
    termId: 1,
    term: '立春',
    pentad: '东风解冻',
    pentadIndex: 1,
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
    // 雨水 · 候雁北 (2nd): the wild geese fly north.
    termId: 2,
    term: '雨水',
    pentad: '候雁北',
    pentadIndex: 2,
    what: 'Skein of wild geese heading north (overhead, apex up), left sky',
    layer: 'sky',
    time: 'day',
    hideIn: ['storm', 'fog'],
    replacesBirds: true,
    draw: () => [{ cls: 'cs-sd-bird', d: skein(48, 74, true) }],
  },
  {
    // 驚蟄 · 桃始華 (1st): the peach begins to blossom.
    termId: 3,
    term: '惊蛰',
    pentad: '桃始华',
    pentadIndex: 1,
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
    // 春分 · 玄鳥至 (1st): the swallows arrive.
    termId: 4,
    term: '春分',
    pentad: '玄鸟至',
    pentadIndex: 1,
    what: 'Three swallows darting low over the pool',
    layer: 'ground',
    time: 'day',
    hideIn: AIRBORNE,
    replacesBirds: true,
    draw: () => [
      {
        cls: 'cs-sd-silhouette',
        d:
          poly(place(SWALLOW, 34, 150, 0.9, -18)) +
          poly(place(SWALLOW, 52, 144, 0.75, 12)) +
          poly(place(SWALLOW, 70, 153, 0.65, -6)),
      },
    ],
  },
  {
    // 清明 · 虹始見 (3rd): rainbows begin to appear.
    termId: 5,
    term: '清明',
    pentad: '虹始见',
    pentadIndex: 3,
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
    // 立夏 · 王瓜生 (3rd): the 王瓜 gourd grows (identification of the plant uncertain).
    termId: 7,
    term: '立夏',
    pentad: '王瓜生',
    pentadIndex: 3,
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
    // 小滿 · 麥秋至 (3rd): the wheat's "autumn" (harvest) arrives.
    termId: 8,
    term: '小满',
    pentad: '麦秋至',
    pentadIndex: 3,
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
    // 芒種 · 鵙始鳴 (2nd): the shrike begins to sing.
    termId: 9,
    term: '芒种',
    pentad: '鵙始鸣',
    pentadIndex: 2,
    what: 'A shrike perched on the rock at the pine’s foot',
    layer: 'ground',
    time: 'day',
    hideIn: ['storm'],
    draw: () => [
      { cls: 'cs-sd-silhouette', d: poly(place(PERCHED, 320.6, 193.4, 0.9)) },
      { cls: 'cs-sd-twig', d: line([321.9, 193.4, 321.8, 192.5]) },
    ],
  },
  {
    // 夏至 · 鹿角解 (1st): the deer shed their antlers.
    termId: 10,
    term: '夏至',
    pentad: '鹿角解',
    pentadIndex: 1,
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
        { cls: 'cs-sd-silhouette', d: deer(ox, oy, s) },
        { cls: 'cs-sd-twig', d: antler + shed },
      ];
    },
  },
  {
    // 小暑 · 鷹乃學習 (3rd): the young hawks learn to fly.
    termId: 11,
    term: '小暑',
    pentad: '鹰乃学习',
    pentadIndex: 3,
    what: 'A hawk and its young circling high in the left sky',
    layer: 'sky',
    time: 'day',
    hideIn: AIRBORNE,
    replacesBirds: true,
    draw: () => [
      {
        cls: 'cs-sd-silhouette',
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
    // 立秋 · 白露降 (2nd): white dew descends.
    termId: 13,
    term: '立秋',
    pentad: '白露降',
    pentadIndex: 2,
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
    // 處暑 · 禾乃登 (3rd): the grain is brought in.
    termId: 14,
    term: '处暑',
    pentad: '禾乃登',
    pentadIndex: 3,
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
    what: 'Skein of wild geese heading south towards the Qinling (apex down), left sky',
    layer: 'sky',
    time: 'day',
    hideIn: ['storm', 'fog'],
    replacesBirds: true,
    draw: () => [{ cls: 'cs-sd-bird', d: skein(56, 92, false) }],
  },
  {
    // 秋分 · 水始涸 (3rd): the waters begin to dry up.
    termId: 16,
    term: '秋分',
    pentad: '水始涸',
    pentadIndex: 3,
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
    // 寒露 · 菊有黃華 (3rd): the chrysanthemums bear yellow flowers.
    termId: 17,
    term: '寒露',
    pentad: '菊有黄华',
    pentadIndex: 3,
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
    // 霜降 · 草木黃落 (2nd): grass and trees yellow and shed their leaves.
    termId: 18,
    term: '霜降',
    pentad: '草木黄落',
    pentadIndex: 2,
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
    // 立冬 · 水始冰 (1st): water begins to freeze.
    termId: 19,
    term: '立冬',
    pentad: '水始冰',
    pentadIndex: 1,
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
    // 小雪 · 天氣上升 (2nd): the qi of heaven rises (and the earth's descends).
    termId: 20,
    term: '小雪',
    pentad: '天气上升',
    pentadIndex: 2,
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
    // 大雪 · 荔挺出 (3rd): the 荔 plant puts out shoots (often identified as Iris lactea; uncertain).
    termId: 21,
    term: '大雪',
    pentad: '荔挺出',
    pentadIndex: 3,
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
    // 冬至 · 水泉動 (3rd): the springs begin to move (under the ice).
    termId: 22,
    term: '冬至',
    pentad: '水泉动',
    pentadIndex: 3,
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
    // 小寒 · 鵲始巢 (2nd): the magpies begin to build their nests.
    termId: 23,
    term: '小寒',
    pentad: '鹊始巢',
    pentadIndex: 2,
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
        { cls: 'cs-sd-silhouette', d: poly(place(PERCHED, c.x + 3.6, c.y + 2.4, 0.85)) },
        { cls: 'cs-sd-magpie-white', d: ellipse(c.x + 5.4, c.y + 0.6, 0.9, 0.5) },
      ];
    },
  },
  {
    // 大寒 · 水澤腹堅 (3rd): the waters and marshes freeze solid.
    termId: 24,
    term: '大寒',
    pentad: '水泽腹坚',
    pentadIndex: 3,
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

/** The detail of a term (1–24). */
export const termDetail = (termId: number): TermDetail | undefined =>
  TERM_DETAILS.find(d => d.termId === termId);

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

import { describe, it, expect } from 'vite-plus/test';
import {
  CLEAR_X0,
  CLEAR_X1,
  GROUND_TOP,
  PAGODA_BASE,
  POOL,
  SCENE_X0,
  SCENE_X1,
  WALL_Y,
  generateChineseLandscape,
  groundY,
} from '../utils/chineseLandscape';
import { arrowMarks, shadowTip } from '../components/ChineseInstrument';

const SEEDS = [20261117, 20261118, 20270101, 20270615, 1, 99999999];

/** All numbers in a path string. */
const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
const xsOf = (d: string) => numbers(d).filter((_, i) => i % 2 === 0);
const ysOf = (d: string) => numbers(d).filter((_, i) => i % 2 === 1);

describe('generateChineseLandscape', () => {
  it('is stable for a seed and differs between days', () => {
    expect(generateChineseLandscape(20261117)).toEqual(generateChineseLandscape(20261117));
    const sig = (seed: number) => {
      const l = generateChineseLandscape(seed);
      return l.ridgeFar + l.wardsBack.map(m => m.id).join();
    };
    expect(new Set(SEEDS.map(sig)).size).toBe(SEEDS.length);
  });

  it('keeps the fixed anchors fixed', () => {
    const a = generateChineseLandscape(20261117);
    for (const seed of SEEDS) {
      const b = generateChineseLandscape(seed);
      expect(b.pagoda).toEqual(a.pagoda);
      expect(b.gate).toEqual(a.gate);
      expect(b.temple).toEqual(a.temple);
      expect(b.wall).toBe(a.wall);
    }
  });

  it('draws the pagoda with seven storeys (one arched opening per storey)', () => {
    const { pagoda } = generateChineseLandscape(1);
    expect(pagoda.openings.match(/M/g)?.length).toBe(7);
  });

  it('never emits NaN or undefined in a path', () => {
    for (const seed of SEEDS) {
      const l = generateChineseLandscape(seed);
      const shapes = [
        l.gate,
        l.pagoda,
        ...l.temple,
        ...l.wardsBack,
        ...l.wardsFront,
        ...l.farShore,
      ];
      const paths = [
        l.ridgeFar,
        l.ridgeMid,
        l.ridgeNear,
        l.cunFar,
        l.cunMid,
        l.moss,
        l.wall,
        l.earth,
        l.rocks,
        l.rockDetail,
        l.tufts,
        l.pine.trunk,
        l.pine.needles,
        l.pine.needleDetail,
        ...l.willows.flatMap(w => [w.trunk, w.strands]),
        ...shapes.flatMap(m => [m.body, m.relief, m.detail, m.openings]),
      ];
      for (const d of paths) expect(d).not.toMatch(/NaN|undefined|Infinity/);
    }
  });

  it('keeps buildings, trees, willows and the pine clear of the instrument', () => {
    for (const seed of SEEDS) {
      const l = generateChineseLandscape(seed);
      const bodies = [
        l.gate,
        l.pagoda,
        ...l.temple,
        ...l.wardsBack,
        ...l.wardsFront,
        ...l.farShore,
      ].map(m => [m.id, m.body]);
      l.willows.forEach((w, i) => bodies.push([`willow-${i}`, w.trunk + w.strands]));
      bodies.push(['pine', l.pine.trunk + l.pine.needles]);
      for (const [id, d] of bodies) {
        const xs = xsOf(d);
        const min = Math.min(...xs);
        const max = Math.max(...xs);
        expect(max < CLEAR_X0 || min > CLEAR_X1, `${id}: x ${min}..${max}`).toBe(true);
      }
    }
  });

  it('keeps the pine clear of the pagoda', () => {
    for (const seed of SEEDS) {
      const l = generateChineseLandscape(seed);
      const pagodaRight = Math.max(...xsOf(l.pagoda.body));
      expect(Math.min(...xsOf(l.pine.needles))).toBeGreaterThan(pagodaRight);
    }
  });

  it('stands buildings on their ground', () => {
    for (const seed of SEEDS) {
      const l = generateChineseLandscape(seed);
      // Gate on the wall's base line, pagoda and temple on the ward plain.
      expect(Math.max(...ysOf(l.gate.body))).toBeCloseTo(WALL_Y + 0.3, 5);
      expect(Math.max(...ysOf(l.pagoda.body))).toBeCloseTo(PAGODA_BASE, 5);
      for (const m of [...l.wardsBack, ...l.wardsFront]) {
        const base = Math.max(...ysOf(m.body));
        // On the plain between the wall and the plateau, visible above the plateau's edge.
        expect(base, m.id).toBeGreaterThan(WALL_Y);
        expect(base, m.id).toBeLessThan(groundY(Math.min(...xsOf(m.body))) + 0.01);
      }
      for (const w of l.willows.slice(0, 2)) {
        const ys = ysOf(w.trunk);
        const foot = Math.max(...ys);
        const x = Math.min(...xsOf(w.trunk));
        expect(foot).toBeGreaterThanOrEqual(groundY(x));
      }
    }
  });
});

describe('visible span', () => {
  // The hero shows x −27.8…327.8 (16:9 box, 3:2 viewBox): full-width layers must reach past it.
  const span = (d: string) => [Math.min(...xsOf(d)), Math.max(...xsOf(d))];

  it('ridges, wall, ground and the pool edge cover the whole width', () => {
    for (const seed of SEEDS) {
      const l = generateChineseLandscape(seed);
      for (const d of [l.ridgeFar, l.ridgeMid, l.ridgeNear, l.wall, GROUND_TOP]) {
        const [min, max] = span(d);
        expect(min).toBeLessThanOrEqual(SCENE_X0);
        expect(max).toBeGreaterThanOrEqual(SCENE_X1);
      }
      expect(Math.min(...xsOf(POOL))).toBeLessThanOrEqual(SCENE_X0);
    }
  });

  it('the plateau and the foreground reach y ≥ 206', () => {
    const l = generateChineseLandscape(1);
    expect(Math.max(...ysOf(l.rocks))).toBeGreaterThanOrEqual(206);
    expect(Math.max(...ysOf(l.pine.trunk))).toBeGreaterThanOrEqual(206);
    // The ground fill closes from GROUND_TOP down to 206 (ChineseScene).
    expect(Math.max(...ysOf(GROUND_TOP))).toBeLessThan(184);
  });
});

describe('instrument', () => {
  it('casts the noon shadow north (towards the viewer) along the scale', () => {
    // Chang'an, winter solstice noon: altitude ≈ 32.3° → ≈ 12.7 chi.
    const tip = shadowTip({ altitude: 32.3, azimuth: 180 })!;
    expect(tip.len).toBeCloseTo(12.66, 1);
    expect(tip.x).toBeCloseTo(150, 5);
    expect(tip.y).toBeGreaterThan(181);
  });

  it('casts a morning shadow to the west (screen right)', () => {
    const tip = shadowTip({ altitude: 10, azimuth: 120 })!;
    expect(tip.x).toBeGreaterThan(150);
  });

  it('casts no shadow with the sun on the horizon', () => {
    expect(shadowTip({ altitude: 0.2, azimuth: 120 })).toBeNull();
  });

  it('puts the mark of the current shíchén just above the lid', () => {
    for (let k = 0; k < 12; k++) {
      const { marks, current } = arrowMarks((k + 0.5) / 12);
      expect(current).toBe(k);
      // Emerged (above the lid at y 157), and the next one still hidden.
      expect(marks[k]).toBeLessThan(157);
      if (k < 11) expect(marks[k + 1]).toBeGreaterThan(157);
    }
  });
});

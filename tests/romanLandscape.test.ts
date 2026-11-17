import { describe, it, expect } from 'vite-plus/test';
import {
  GROUND_TOP,
  SCENE_X0,
  SCENE_X1,
  generateRomanLandscape,
  groundY,
} from '../utils/romanLandscape';

const SEEDS = [20261117, 20261118, 20270101, 20270615, 1, 99999999];

/** All numbers in a path string. */
const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe('generateRomanLandscape', () => {
  it('is stable for a seed and differs between days', () => {
    expect(generateRomanLandscape(20261117)).toEqual(generateRomanLandscape(20261117));
    const kinds = (seed: number) =>
      generateRomanLandscape(seed)
        .monuments.map(m => m.id)
        .join();
    expect(new Set(SEEDS.map(kinds)).size).toBeGreaterThan(1);
  });

  it('never emits NaN or undefined in a path', () => {
    for (const seed of SEEDS) {
      const land = generateRomanLandscape(seed);
      const paths = [
        land.ridgeFar,
        land.ridgeNear,
        land.aqueduct,
        land.tufts,
        ...[...land.monuments, ...land.foreground].flatMap(m => [
          m.body,
          m.relief,
          m.detail,
          m.openings,
        ]),
      ];
      for (const d of paths) expect(d).not.toMatch(/NaN|undefined|Infinity/);
    }
  });

  it('keeps the monuments on the two hills, clear of the instrument', () => {
    for (const seed of SEEDS) {
      for (const m of generateRomanLandscape(seed).monuments) {
        const xs = numbers(m.body).filter((_, i) => i % 2 === 0);
        const min = Math.min(...xs);
        const max = Math.max(...xs);
        // Either entirely left of the centre strip or entirely right of it.
        expect(max < 104 || min > 196, `${m.id}: x ${min}..${max}`).toBe(true);
        expect(min).toBeGreaterThan(-2);
        expect(max).toBeLessThan(302);
      }
    }
  });

  it('puts a different big monument on each hill', () => {
    const big = ['colosseum', 'pantheon'];
    for (const seed of SEEDS) {
      const kinds = generateRomanLandscape(seed).monuments.map(m => m.kind);
      const temples = kinds.filter(k => k === 'temple').length;
      const count = big.filter(k => kinds.includes(k as never)).length + (temples > 0 ? 1 : 0);
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });

  it('stands every monument on the ground, not above it', () => {
    for (const seed of SEEDS) {
      for (const m of generateRomanLandscape(seed).monuments) {
        const nums = numbers(m.body);
        const xs = nums.filter((_, i) => i % 2 === 0);
        const ys = nums.filter((_, i) => i % 2 === 1);
        const base = Math.max(...ys);
        const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
        // The base is at or below the crest at the monument's centre.
        expect(base).toBeGreaterThanOrEqual(groundY(mid) - 0.01);
        expect(base).toBeLessThan(182);
      }
    }
  });
});

describe('visible span', () => {
  // The hero shows x −30…330 (16:9 box, 3:2 viewBox): full-width layers must reach past it.
  const spans = (d: string) => {
    const xs = numbers(d).filter((_, i) => i % 2 === 0);
    return [Math.min(...xs), Math.max(...xs)];
  };

  it('ground, ridges and aqueduct cover the whole visible width', () => {
    const land = generateRomanLandscape(20261117);
    for (const d of [GROUND_TOP, land.ridgeFar, land.ridgeNear, land.aqueduct]) {
      const [min, max] = spans(d);
      expect(min).toBeLessThanOrEqual(SCENE_X0);
      expect(max).toBeGreaterThanOrEqual(SCENE_X1);
    }
    expect(SCENE_X0).toBeLessThan(-30);
    expect(SCENE_X1).toBeGreaterThan(330);
  });
});

describe('groundY', () => {
  it('is flat in the centre and 10 units higher on the hill tops', () => {
    expect(groundY(150)).toBe(180);
    expect(groundY(100)).toBe(180);
    expect(groundY(50)).toBeCloseTo(170);
    expect(groundY(250)).toBeCloseTo(170);
    expect(groundY(0)).toBe(180);
  });
});

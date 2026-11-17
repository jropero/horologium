import { describe, it, expect } from 'vite-plus/test';
import {
  GROUND_TOP,
  SCENE_X0,
  SCENE_X1,
  SNOW_BAND,
  generateHellenicLandscape,
  groundY,
} from '../utils/hellenicLandscape';

const SEEDS = [20261117, 20261118, 20270101, 20270615, 1, 99999999];

/** All numbers in a path string (no relative arcs are used in monument bodies). */
const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
const xsOf = (d: string) => numbers(d).filter((_, i) => i % 2 === 0);
const ysOf = (d: string) => numbers(d).filter((_, i) => i % 2 === 1);

/** The base reaches the crest everywhere under the shape, and stays near the ground line. */
const expectOnGround = (id: string, body: string) => {
  const xs = xsOf(body);
  const base = Math.max(...ysOf(body));
  const lo = Math.min(...xs);
  const hi = Math.max(...xs);
  for (const x of [lo, (lo + hi) / 2, hi])
    expect(base, `${id} at x ${x}`).toBeGreaterThanOrEqual(groundY(x) - 0.01);
  expect(base).toBeLessThan(182);
};

describe('generateHellenicLandscape', () => {
  it('is stable for a seed and differs between days', () => {
    expect(generateHellenicLandscape(20261117)).toEqual(generateHellenicLandscape(20261117));
    const ids = (seed: number) =>
      generateHellenicLandscape(seed)
        .city.map(m => m.id)
        .join();
    expect(new Set(SEEDS.map(ids)).size).toBeGreaterThan(1);
  });

  it('keeps the Acropolis fixed from day to day', () => {
    const a = generateHellenicLandscape(20261117);
    const b = generateHellenicLandscape(20270615, 'wide');
    expect(a.rock).toEqual(b.rock);
    expect(a.acropolis).toEqual(b.acropolis);
    expect(a.slope).toEqual(b.slope);
    expect(a.acropolis.map(m => m.kind)).toEqual(
      expect.arrayContaining(['parthenon', 'erechtheion', 'propylaia', 'nike', 'promachos']),
    );
    expect(a.city.map(m => m.kind)).toContain('hephaisteion');
  });

  it('never emits NaN or undefined in a path', () => {
    for (const seed of SEEDS) {
      for (const layout of ['clock', 'wide'] as const) {
        const land = generateHellenicLandscape(seed, layout);
        const paths = [
          land.ridgeFar,
          ...Object.values(land.lykabettos),
          land.town,
          land.tufts,
          land.shrubs,
          ...Object.values(land.rock),
          ...[...land.acropolis, ...land.slope, ...land.city, ...land.foreground].flatMap(m => [
            m.body,
            m.relief,
            m.detail,
            m.openings,
          ]),
        ];
        for (const d of paths) expect(d).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
  });

  it('keeps the centre clear for the instrument in the clock layout', () => {
    for (const seed of SEEDS) {
      const land = generateHellenicLandscape(seed, 'clock');
      for (const m of [...land.city, ...land.acropolis, ...land.slope]) {
        const xs = xsOf(m.body);
        const min = Math.min(...xs);
        const max = Math.max(...xs);
        expect(max < 104 || min > 196, `${m.id}: x ${min}..${max}`).toBe(true);
      }
    }
  });

  it('fills the plain in the wide layout', () => {
    const land = generateHellenicLandscape(20261117, 'wide');
    const central = land.city.filter(m => {
      const xs = xsOf(m.body);
      return Math.min(...xs) > 104 && Math.max(...xs) < 196;
    });
    expect(central.length).toBeGreaterThan(2);
  });

  it('stands every city building and tree on the ground, not above it', () => {
    const lands = SEEDS.flatMap(seed => [
      generateHellenicLandscape(seed, 'clock'),
      generateHellenicLandscape(seed, 'wide'),
    ]);
    for (const m of lands.flatMap(land => land.city)) expectOnGround(m.id, m.body);
  });

  it('stands the Acropolis buildings on the plateau', () => {
    const land = generateHellenicLandscape(20261117);
    for (const m of land.acropolis.filter(a => a.kind !== 'nike')) {
      const base = Math.max(...ysOf(m.body));
      expect(base, m.id).toBeGreaterThanOrEqual(150);
      expect(base, m.id).toBeLessThan(156);
    }
  });
});

describe('visible span', () => {
  // The clock hero shows x −30…330 (16:9 box, 3:2 viewBox): full-width layers must reach past it.
  it('ground, snow and Hymettos cover the whole visible width', () => {
    const land = generateHellenicLandscape(20261117);
    for (const d of [GROUND_TOP, SNOW_BAND, land.ridgeFar]) {
      const xs = xsOf(d);
      expect(Math.min(...xs)).toBeLessThanOrEqual(SCENE_X0);
      expect(Math.max(...xs)).toBeGreaterThanOrEqual(SCENE_X1);
    }
  });

  it('the rock runs off neither edge inside the view', () => {
    const xs = xsOf(generateHellenicLandscape(1).rock.body);
    // It ends past the right edge of the view, so no cliff stops in mid-air.
    expect(Math.max(...xs)).toBeGreaterThanOrEqual(SCENE_X1);
  });
});

describe('groundY', () => {
  it('is flat on the plain and on the top of Kolonos', () => {
    expect(groundY(150)).toBe(180);
    expect(groundY(30)).toBeCloseTo(168);
    expect(groundY(14)).toBeCloseTo(168);
    expect(groundY(46)).toBeCloseTo(168);
    expect(groundY(SCENE_X0)).toBeGreaterThan(178);
  });
});

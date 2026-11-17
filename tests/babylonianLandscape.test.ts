import { describe, it, expect } from 'vite-plus/test';
import {
  BabylonianLandscape,
  GATE_CX,
  GROUND_Y,
  HORIZON_Y,
  Monument,
  OVERLAY_BOX,
  SCENE_X0,
  SCENE_X1,
  fullWidthLayers,
  generateBabylonianLandscape,
  riverEdges,
} from '../utils/babylonianLandscape';

const SEEDS = [20409, 20410, 20500, 20800, 1, 99999999];
const LANDS = SEEDS.map(generateBabylonianLandscape);

/** All numbers in a path string (absolute M/L/C paths: pairs are x, y). */
const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
const xsOf = (d: string) => numbers(d).filter((_, i) => i % 2 === 0);
const ysOf = (d: string) => numbers(d).filter((_, i) => i % 2 === 1);
const points = (d: string) => xsOf(d).map((x, i) => [x, ysOf(d)[i]] as const);
const baseOf = (m: Monument) => Math.max(...ysOf(m.body));

/** Mid and near shapes: everything in front of Etemenanki and Esagila. */
const frontShapes = (land: BabylonianLandscape) => [
  ...land.city,
  land.innerWall,
  land.mainGate,
  land.outerWall,
  land.ishtarGate,
  ...land.foreground,
];
const allMonuments = (land: BabylonianLandscape) => [...land.far, ...frontShapes(land)];

const allPaths = (land: BabylonianLandscape) => [
  land.plain,
  land.farGrove,
  land.way,
  land.wayWalls,
  land.wayDetail,
  land.river,
  land.shimmer,
  land.bridge,
  land.banks,
  land.reeds,
  land.tufts,
  ...allMonuments(land).flatMap(m => [m.body, m.relief, m.detail, m.openings]),
];

const lightsAreFinite = (m: Monument) =>
  m.windows.every(w => Number.isFinite(w.x + w.y + w.w + w.h)) &&
  m.torches.every(t => Number.isFinite(t.x + t.y));

describe('generateBabylonianLandscape', () => {
  it('is stable for a seed and differs between days', () => {
    expect(generateBabylonianLandscape(20409)).toEqual(generateBabylonianLandscape(20409));
    const city = (land: BabylonianLandscape) => land.city.map(m => m.id).join();
    expect(new Set(LANDS.map(city)).size).toBeGreaterThan(1);
  });

  it('keeps Etemenanki, Esagila, the gates and the walls as fixed anchors', () => {
    const fixed = (land: BabylonianLandscape) =>
      [...land.far, land.ishtarGate, land.mainGate, land.innerWall, land.outerWall].map(
        m => m.body,
      );
    for (const land of LANDS) expect(fixed(land)).toEqual(fixed(LANDS[0]));
  });

  it('never emits NaN or undefined in a path', () => {
    for (const land of LANDS) {
      expect(allPaths(land).join(' ')).not.toMatch(/NaN|undefined|Infinity/);
      expect(allMonuments(land).every(lightsAreFinite)).toBe(true);
    }
  });

  it('follows the Esagila tablet: Etemenanki is as tall as it is wide', () => {
    const ete = LANDS[0].far.find(m => m.kind === 'etemenanki')!;
    const xs = xsOf(ete.body);
    const ys = ysOf(ete.body);
    // Merlons on the temple add ~1.6 m above the 90 m of the tablet.
    const ratio = (Math.max(...ys) - Math.min(...ys)) / (Math.max(...xs) - Math.min(...xs));
    expect(ratio).toBeGreaterThan(0.98);
    expect(ratio).toBeLessThan(1.04);
  });

  it('stands buildings on their ground line', () => {
    for (const land of LANDS) {
      // Houses stand on the city mound behind the inner wall (its base is 176).
      const houses = land.city.filter(c => c.kind === 'house').map(baseOf);
      expect(Math.min(...houses)).toBeGreaterThanOrEqual(168);
      expect(Math.max(...houses)).toBeLessThan(176);
      expect(Math.max(...land.far.map(baseOf))).toBeLessThan(176);
      expect(baseOf(land.ishtarGate)).toBeGreaterThanOrEqual(GROUND_Y);
      expect(baseOf(land.outerWall)).toBeGreaterThanOrEqual(GROUND_Y);
      expect(Math.min(...land.foreground.map(baseOf))).toBeGreaterThan(200);
    }
  });

  it('keeps the area of the hero text clear of mid and near shapes', () => {
    const intrudes = ([x, y]: readonly [number, number]) =>
      x > OVERLAY_BOX.x0 && x < OVERLAY_BOX.x1 && y < OVERLAY_BOX.yBottom;
    for (const land of LANDS) {
      const bad = frontShapes(land).filter(m => points(m.body).some(intrudes));
      expect(bad.map(m => m.id)).toEqual([]);
    }
  });

  it('leaves the river gap open in both walls', () => {
    const land = LANDS[0];
    const inGap = (y: number) => (x: number) => {
      const { left, right } = riverEdges(y);
      return x > left + 0.5 && x < right - 0.5;
    };
    expect(xsOf(land.outerWall.body).filter(inGap(GROUND_Y))).toEqual([]);
    expect(xsOf(land.innerWall.body).filter(inGap(176))).toEqual([]);
    expect(riverEdges(HORIZON_Y).right).toBeGreaterThan(riverEdges(HORIZON_Y).left);
  });

  it('opens the Processional Way at the gate', () => {
    const xs = xsOf(LANDS[0].way);
    expect((Math.min(...xs) + Math.max(...xs)) / 2).toBeCloseTo(GATE_CX, 0);
  });
});

describe('visible span', () => {
  // The hero shows x −28.8…328.8 (16:9 box, 3:2 viewBox, meet): full-width layers must reach past it.
  it('ground, plain and walls cover the whole visible width', () => {
    for (const d of fullWidthLayers(LANDS[0])) {
      const xs = xsOf(d);
      expect(Math.min(...xs)).toBeLessThanOrEqual(SCENE_X0);
      expect(Math.max(...xs)).toBeGreaterThanOrEqual(SCENE_X1);
    }
  });
});

import { describe, it, expect } from 'vite-plus/test';
import { chineseCalendarData } from '../utils/chineseCalendarData';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { CLEAR_X0, CLEAR_X1, generateChineseLandscape } from '../utils/chineseLandscape';
import {
  POOL_FROZEN_TERMS,
  TERM_DETAILS,
  detailBox,
  detailVisible,
  isPoolFrozen,
  seasonBase,
  termDetail,
} from '../utils/chineseSeasons';

const SEEDS = [20261117, 20270101, 20270615, 1, 99999999];

/** Corner where the 長安 seal sits (measured at 390–1280 px, with margin). */
const SEAL_BOX = { x0: 292, y0: 8, x1: 320, y1: 54 };

type Box = { x0: number; x1: number; y0: number; y1: number };
const overlap = (a: Box, b: Box) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const boxOf = (d: string) => detailBox([{ cls: '', d }]);

describe('solar-term details', () => {
  it('has exactly one detail for each of the 24 terms', () => {
    expect(TERM_DETAILS).toHaveLength(24);
    for (let id = 1; id <= 24; id++) expect(termDetail(id), `term ${id}`).toBeDefined();
  });

  it('draws a pentad of its own term, as written in chineseCalendarData', () => {
    for (const d of TERM_DETAILS) {
      const term = chineseCalendarData.find(t => t.id === d.termId)!;
      expect(term.hanzi).toBe(d.term);
      expect(term.pentads[d.pentadIndex - 1].description).toContain(d.pentad);
    }
  });

  it('never emits NaN and stays inside the picture', () => {
    for (const seed of SEEDS) {
      const crown = generateChineseLandscape(seed).willows[0].crown;
      for (const d of TERM_DETAILS) {
        const strokes = d.draw({ willowCrown: crown });
        for (const s of strokes) expect(s.d).not.toMatch(/NaN|undefined|Infinity/);
        const b = detailBox(strokes);
        expect(b.x0, d.term).toBeGreaterThanOrEqual(-46);
        expect(b.x1, d.term).toBeLessThanOrEqual(340);
        expect(b.y0, d.term).toBeGreaterThanOrEqual(0);
        expect(b.y1, d.term).toBeLessThanOrEqual(206);
      }
    }
  });

  it('keeps out of the instrument strip, the pagoda, the gate and the seal', () => {
    for (const seed of SEEDS) {
      const land = generateChineseLandscape(seed);
      const pagoda = boxOf(land.pagoda.body);
      const gate = boxOf(land.gate.body);
      for (const d of TERM_DETAILS) {
        const b = detailBox(d.draw({ willowCrown: land.willows[0].crown }));
        expect(b.x1 < CLEAR_X0 || b.x0 > CLEAR_X1, `${d.term}: x ${b.x0}..${b.x1}`).toBe(true);
        expect(overlap(b, pagoda), `${d.term} overlaps the pagoda`).toBe(false);
        expect(overlap(b, gate), `${d.term} overlaps the gate`).toBe(false);
        expect(overlap(b, SEAL_BOX), `${d.term} overlaps the seal`).toBe(false);
      }
    }
  });

  it('hides details that contradict the hour or the weather', () => {
    const rainbow = termDetail(5)!;
    expect(detailVisible(rainbow, true, 'clear', false)).toBe(true);
    expect(detailVisible(rainbow, true, 'fog', false)).toBe(false);
    expect(detailVisible(rainbow, true, 'rain', false)).toBe(false);
    expect(detailVisible(rainbow, false, 'clear', false)).toBe(false);
    const swallows = termDetail(4)!;
    expect(detailVisible(swallows, true, 'storm', false)).toBe(false);
    expect(detailVisible(swallows, true, 'partly-cloudy', false)).toBe(true);
    const fireflies = termDetail(12)!;
    expect(detailVisible(fireflies, true, 'clear', false)).toBe(false);
    expect(detailVisible(fireflies, false, 'clear', false)).toBe(true);
    expect(detailVisible(fireflies, true, 'clear', true)).toBe(true);
    // Ground details that don't depend on the weather stay, e.g. a snowy 立夏.
    expect(detailVisible(termDetail(7)!, true, 'snow', false)).toBe(true);
  });
});

describe('frozen pool', () => {
  it('is frozen exactly in 冬至, 小寒 and 大寒', () => {
    const frozen = chineseCalendarData.filter(t => isPoolFrozen(t.id)).map(t => t.hanzi);
    expect(frozen).toEqual(['冬至', '小寒', '大寒']);
    expect([...POOL_FROZEN_TERMS].sort((a, b) => a - b)).toEqual([22, 23, 24]);
  });

  it('agrees with the term card: frozen in mid-January, open in July', () => {
    expect(isPoolFrozen(getChineseCalendarData(new Date(2027, 0, 15, 12)).term.id)).toBe(true);
    expect(isPoolFrozen(getChineseCalendarData(new Date(2027, 6, 15, 12)).term.id)).toBe(false);
    expect(isPoolFrozen(getChineseCalendarData(new Date(2027, 1, 10, 12)).term.id)).toBe(false);
  });
});

describe('seasonal base', () => {
  const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

  it('changes smoothly from day to day over the whole year', () => {
    const step = 360 / 365.2422;
    let prev = seasonBase(0);
    for (let day = 1; day <= 366; day++) {
      const cur = seasonBase(day * step);
      expect(Math.abs(cur.foliage - prev.foliage)).toBeLessThan(0.04);
      expect(Math.abs(cur.warmth - prev.warmth)).toBeLessThan(0.02);
      const a = channels(cur.leaf);
      const b = channels(prev.leaf);
      for (let i = 0; i < 3; i++) expect(Math.abs(a[i] - b[i])).toBeLessThanOrEqual(6);
      prev = cur;
    }
  });

  it('is bare in winter, full in summer, and warmest in 大暑', () => {
    expect(seasonBase(270).foliage).toBe(0); // 冬至
    expect(seasonBase(90).foliage).toBe(1); // 夏至
    expect(seasonBase(120).warmth).toBeCloseTo(1, 5); // 大暑
    expect(seasonBase(300).warmth).toBeCloseTo(-1, 5); // 大寒
  });
});

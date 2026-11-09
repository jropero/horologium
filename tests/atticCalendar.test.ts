import { describe, it, expect } from 'vite-plus/test';
import { getAtticDate, getAtticDateForDisplay } from '../utils/atticCalendarUtils';
import { calculateHellenicTime } from '../utils/hellenicTimeUtils';

const ATHENS_LAT = 37.97;
const ATHENS_LNG = 23.72;

function computeExpectedDecade(dom: number): number {
  const secondOrThird = dom <= 20 ? 2 : 3;
  return dom <= 10 ? 1 : secondOrThird;
}

function findDateWithAtticDay(targetDom: number): Date {
  const start = new Date('2024-01-01T12:00:00Z');
  for (let i = 0; i < 400; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    if (getAtticDate(date, ATHENS_LAT, ATHENS_LNG).dayOfMonth === targetDom) {
      return date;
    }
  }
  throw new Error(`No date found with Attic day ${targetDom}`);
}

// ─── Decade invariant ─────────────────────────────────────────────────────────
// The decade field was refactored from a nested ternary to two named variables.
// The refactored code:
//   const decadeIfNotFirst = day <= 20 ? 2 : 3
//   const decade = day <= 10 ? 1 : decadeIfNotFirst
// must be semantically identical to:
//   day <= 10 ? 1 : day <= 20 ? 2 : 3

describe('decade invariant — refactored ternary must match formula', () => {
  it('decade matches formula for all sample dates across 2024-2025', () => {
    // Sample every 3 days through 2024-2025 to exercise diverse Attic days
    const start = new Date('2024-01-15T12:00:00Z');
    const end = new Date('2025-12-31T12:00:00Z');
    const stepMs = 3 * 24 * 60 * 60 * 1000;
    let checked = 0;
    for (let t = start.getTime(); t <= end.getTime(); t += stepMs) {
      const date = new Date(t);
      const result = getAtticDate(date, ATHENS_LAT, ATHENS_LNG);
      const { dayOfMonth, decade } = result;
      expect(decade, `decade wrong for dayOfMonth ${dayOfMonth} on ${date.toISOString()}`).toBe(
        computeExpectedDecade(dayOfMonth),
      );
      checked++;
    }
    // Sanity: ensure we actually exercised enough dates
    expect(checked).toBeGreaterThan(200);
  });

  it.each([
    { targetDays: [1, 10], expectedDecadeVal: 1 },
    { targetDays: [11, 20], expectedDecadeVal: 2 },
    { targetDays: [21, 30], expectedDecadeVal: 3 },
  ])(
    'decade === $expectedDecadeVal for Attic day boundaries $targetDays',
    ({ targetDays, expectedDecadeVal }) => {
      for (const dom of targetDays) {
        const date = findDateWithAtticDay(dom);
        const result = getAtticDate(date, ATHENS_LAT, ATHENS_LNG);
        expect(result.dayOfMonth).toBe(dom);
        expect(result.decade).toBe(expectedDecadeVal);
      }
    },
  );
});

// ─── Structural invariants ────────────────────────────────────────────────────

describe('getAtticDate structural invariants', () => {
  const testDates = [
    new Date('2024-07-15T12:00:00Z'),
    new Date('2024-10-01T12:00:00Z'),
    new Date('2025-01-15T12:00:00Z'),
  ];

  for (const date of testDates) {
    it(`dayOfMonth in [1,30] for ${date.toISOString()}`, () => {
      const result = getAtticDate(date, ATHENS_LAT, ATHENS_LNG);
      expect(result.dayOfMonth).toBeGreaterThanOrEqual(1);
      expect(result.dayOfMonth).toBeLessThanOrEqual(30);
    });

    it(`monthLength is 29 or 30 for ${date.toISOString()}`, () => {
      const result = getAtticDate(date, ATHENS_LAT, ATHENS_LNG);
      expect([29, 30]).toContain(result.monthLength);
    });

    it(`monthIndex in [0,12] for ${date.toISOString()}`, () => {
      const result = getAtticDate(date, ATHENS_LAT, ATHENS_LNG);
      expect(result.monthIndex).toBeGreaterThanOrEqual(0);
      expect(result.monthIndex).toBeLessThanOrEqual(12); // 12 for intercalary
    });

    it(`decade in [1,2,3] for ${date.toISOString()}`, () => {
      const result = getAtticDate(date, ATHENS_LAT, ATHENS_LNG);
      expect([1, 2, 3]).toContain(result.decade);
    });
  }

  it('snapshot — 2024-07-15', () => {
    expect(
      getAtticDate(new Date('2024-07-15T12:00:00Z'), ATHENS_LAT, ATHENS_LNG),
    ).toMatchSnapshot();
  });

  it('snapshot — 2024-10-01', () => {
    expect(
      getAtticDate(new Date('2024-10-01T12:00:00Z'), ATHENS_LAT, ATHENS_LNG),
    ).toMatchSnapshot();
  });

  it('snapshot — 2025-01-15', () => {
    expect(
      getAtticDate(new Date('2025-01-15T12:00:00Z'), ATHENS_LAT, ATHENS_LNG),
    ).toMatchSnapshot();
  });
});

// ─── getAtticDateForDisplay ───────────────────────────────────────────────────

describe('getAtticDateForDisplay', () => {
  it('returns atticDate and moonPhase in [0,1]', () => {
    const date = new Date('2024-07-15T12:00:00Z');
    const result = getAtticDateForDisplay(date, ATHENS_LAT, ATHENS_LNG);
    expect(result.atticDate).toBeDefined();
    expect(result.moonPhase).toBeGreaterThanOrEqual(0);
    expect(result.moonPhase).toBeLessThanOrEqual(1);
  });
});

// ─── calculateHellenicTime ────────────────────────────────────────────────────

describe('calculateHellenicTime structural invariants', () => {
  const testDates = [
    new Date('2024-07-15T12:00:00Z'),
    new Date('2024-10-01T12:00:00Z'),
    new Date('2025-01-15T12:00:00Z'),
  ];

  for (const date of testDates) {
    it(`romanHour in [1,12] for ${date.toISOString()}`, () => {
      const result = calculateHellenicTime(date, ATHENS_LAT, ATHENS_LNG);
      expect(result.romanHour).toBeGreaterThanOrEqual(1);
      expect(result.romanHour).toBeLessThanOrEqual(12);
    });

    it(`isDay is a boolean for ${date.toISOString()}`, () => {
      const result = calculateHellenicTime(date, ATHENS_LAT, ATHENS_LNG);
      expect(typeof result.isDay).toBe('boolean');
    });
  }

  it('midday is daytime in Athens (2024-07-15 12:00 UTC = 15:00 local)', () => {
    // 2024-07-15 noon UTC is 15:00 in Athens (UTC+3 in summer), well within daylight
    const date = new Date('2024-07-15T12:00:00Z');
    const result = calculateHellenicTime(date, ATHENS_LAT, ATHENS_LNG);
    expect(result.isDay).toBe(true);
  });

  it('midnight is nighttime in Athens (2024-07-15 00:00 UTC = 03:00 local)', () => {
    // 2024-07-15 00:00 UTC is 03:00 in Athens — clearly night
    const date = new Date('2024-07-15T00:00:00Z');
    const result = calculateHellenicTime(date, ATHENS_LAT, ATHENS_LNG);
    expect(result.isDay).toBe(false);
  });
});

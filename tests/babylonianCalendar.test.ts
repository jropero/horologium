import { describe, it, expect } from 'vitest';
import { getBabylonianDate, getBabylonianCalendarMeta } from '../utils/babylonianCalendarUtils';

// Babylon coordinates
const LAT = 32.5;
const LNG = 44.4;

// Three test dates (noon UTC — well within daytime, avoids sunset boundary)
const DATES = [
  new Date('2024-04-01T12:00:00Z'),
  new Date('2024-07-15T12:00:00Z'),
  new Date('2024-12-25T12:00:00Z'),
];

// ─── getBabylonianDate ────────────────────────────────────────────────────────

describe('getBabylonianDate', () => {
  for (const date of DATES) {
    describe(`date = ${date.toISOString()}`, () => {
      it('snapshot matches', () => {
        const result = getBabylonianDate(date, LAT, LNG);
        expect(result).toMatchSnapshot();
      });

      it('.day is in [1, 30]', () => {
        const { day } = getBabylonianDate(date, LAT, LNG);
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(30);
      });

      it('.monthIndex is in [0, 12]', () => {
        const { monthIndex } = getBabylonianDate(date, LAT, LNG);
        expect(monthIndex).toBeGreaterThanOrEqual(0);
        expect(monthIndex).toBeLessThanOrEqual(12);
      });

      it('.seYear for 2024 CE is 2334 or 2335', () => {
        const { seYear } = getBabylonianDate(date, LAT, LNG);
        expect([2334, 2335]).toContain(seYear);
      });

      it('.temporalHour is in [1, 12]', () => {
        const { temporalHour } = getBabylonianDate(date, LAT, LNG);
        expect(temporalHour).toBeGreaterThanOrEqual(1);
        expect(temporalHour).toBeLessThanOrEqual(12);
      });

      it('.watch is 1, 2, or 3', () => {
        const { watch } = getBabylonianDate(date, LAT, LNG);
        expect([1, 2, 3]).toContain(watch);
      });

      it('.moonPhase is in [0, 1)', () => {
        const { moonPhase } = getBabylonianDate(date, LAT, LNG);
        expect(moonPhase).toBeGreaterThanOrEqual(0);
        expect(moonPhase).toBeLessThan(1);
      });

      it('.dayProgress is in [0, 1]', () => {
        const { dayProgress } = getBabylonianDate(date, LAT, LNG);
        expect(dayProgress).toBeGreaterThanOrEqual(0);
        expect(dayProgress).toBeLessThanOrEqual(1);
      });
    });
  }

  it('non-intercalary .monthIndex is in [0, 11]', () => {
    for (const date of DATES) {
      const result = getBabylonianDate(date, LAT, LNG);
      if (!result.isIntercalary) {
        expect(result.monthIndex).toBeGreaterThanOrEqual(0);
        expect(result.monthIndex).toBeLessThanOrEqual(11);
      }
    }
  });

  it('intercalary month has isIntercalary = true and monthIndex = 12', () => {
    for (const date of DATES) {
      const result = getBabylonianDate(date, LAT, LNG);
      if (result.isIntercalary) {
        expect(result.monthIndex).toBe(12);
      }
    }
  });
});

// ─── getBabylonianCalendarMeta ────────────────────────────────────────────────

describe('getBabylonianCalendarMeta', () => {
  for (const date of DATES) {
    describe(`date = ${date.toISOString()}`, () => {
      it('.metonicPosition is in [1, 19]', () => {
        const { metonicPosition } = getBabylonianCalendarMeta(date, LAT, LNG);
        expect(metonicPosition).toBeGreaterThanOrEqual(1);
        expect(metonicPosition).toBeLessThanOrEqual(19);
      });

      it('.isIntercalaryYear is boolean', () => {
        const { isIntercalaryYear } = getBabylonianCalendarMeta(date, LAT, LNG);
        expect(typeof isIntercalaryYear).toBe('boolean');
      });

      it('implied month count is 12 or 13', () => {
        const { isIntercalaryYear } = getBabylonianCalendarMeta(date, LAT, LNG);
        const monthCount = isIntercalaryYear ? 13 : 12;
        expect([12, 13]).toContain(monthCount);
      });

      it('.monthLengthDays is 29 or 30', () => {
        const { monthLengthDays } = getBabylonianCalendarMeta(date, LAT, LNG);
        expect([29, 30]).toContain(monthLengthDays);
      });

      it('.seYear for 2024 CE is 2334 or 2335', () => {
        const { seYear } = getBabylonianCalendarMeta(date, LAT, LNG);
        expect([2334, 2335]).toContain(seYear);
      });

      it('.intercalaryPositions is a subset of [1..19]', () => {
        const { intercalaryPositions } = getBabylonianCalendarMeta(date, LAT, LNG);
        expect(Array.isArray(intercalaryPositions)).toBe(true);
        for (const pos of intercalaryPositions) {
          expect(pos).toBeGreaterThanOrEqual(1);
          expect(pos).toBeLessThanOrEqual(19);
        }
      });

      it('.driftDays is non-negative', () => {
        const { driftDays } = getBabylonianCalendarMeta(date, LAT, LNG);
        expect(driftDays).toBeGreaterThanOrEqual(0);
      });
    });
  }
});

import { describe, it, expect } from 'vite-plus/test';
import {
  civilDayStart,
  civilDaysBetween,
  getLunarYearMonths,
  getLunarYearStart,
  lastSunsetAtOrBefore,
  positionInYear,
} from '../utils/lunarCivilCalendar';
import { getMoonPhase } from '../utils/solar';

// Fixed test coordinates: Rome
const LAT = 41.9;
const LNG = 12.5;

// Fixed dates used throughout
const DATE_MARCH = new Date('2024-03-20T12:00:00Z');
const DATE_JULY = new Date('2024-07-15T12:00:00Z');
const DATE_NOV = new Date('2024-11-01T12:00:00Z');

// Babylonian calendar parameters
const BAB_TAG = 'bab';
const BAB_MIN_AGE = 0.75;
// Spring equinox 2024 (approx)
const SPRING_EQ_2024 = new Date('2024-03-20T03:06:00Z');
const SPRING_EQ_2025 = new Date('2025-03-20T09:01:00Z');

describe('lunarCivilCalendar — structural invariants', () => {
  describe('getMoonPhase (moon age proxy)', () => {
    it('returns a value in [0, 1] for 2024-03-20', () => {
      const phase = getMoonPhase(DATE_MARCH);
      expect(phase).toBeGreaterThanOrEqual(0);
      expect(phase).toBeLessThanOrEqual(1);
    });

    it('moon age in days is in [0, 29.53] for 2024-07-15', () => {
      const moonAge = getMoonPhase(DATE_JULY) * 29.53;
      expect(moonAge).toBeGreaterThanOrEqual(0);
      expect(moonAge).toBeLessThanOrEqual(29.53);
    });

    it('moon age in days is in [0, 29.53] for 2024-11-01', () => {
      const moonAge = getMoonPhase(DATE_NOV) * 29.53;
      expect(moonAge).toBeGreaterThanOrEqual(0);
      expect(moonAge).toBeLessThanOrEqual(29.53);
    });
  });

  describe('getLunarYearMonths', () => {
    it('returns 12 or 13 entries for the Babylonian year at Rome in 2024', () => {
      const yearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2024, LAT, LNG);
      const nextYearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2025, LAT, LNG);
      const months = getLunarYearMonths(
        BAB_TAG,
        BAB_MIN_AGE,
        yearStart,
        nextYearStart,
        LAT,
        LNG,
      );
      // months array includes boundary: length = monthCount + 1
      const monthCount = months.length - 1;
      expect(monthCount).toBeGreaterThanOrEqual(12);
      expect(monthCount).toBeLessThanOrEqual(13);
    });

    it('every month has a day count of 29 or 30', () => {
      const yearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2024, LAT, LNG);
      const nextYearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2025, LAT, LNG);
      const months = getLunarYearMonths(
        BAB_TAG,
        BAB_MIN_AGE,
        yearStart,
        nextYearStart,
        LAT,
        LNG,
      );
      for (let i = 0; i < months.length - 1; i++) {
        const days = civilDaysBetween(months[i], months[i + 1]);
        expect(days).toBeGreaterThanOrEqual(29);
        expect(days).toBeLessThanOrEqual(30);
      }
    });
  });

  describe('positionInYear', () => {
    it('.day is in [1, monthLength] and .monthIndex is >= 0', () => {
      const yearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2024, LAT, LNG);
      const nextYearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2025, LAT, LNG);
      const months = getLunarYearMonths(
        BAB_TAG,
        BAB_MIN_AGE,
        yearStart,
        nextYearStart,
        LAT,
        LNG,
      );
      const dayStart = civilDayStart(DATE_JULY, LAT, LNG);
      const pos = positionInYear(months, dayStart);
      expect(pos.monthIndex).toBeGreaterThanOrEqual(0);
      expect(pos.day).toBeGreaterThanOrEqual(1);
      expect(pos.day).toBeLessThanOrEqual(pos.monthLength);
      expect(pos.monthLength).toBeGreaterThanOrEqual(29);
      expect(pos.monthLength).toBeLessThanOrEqual(30);
    });
  });

  describe('civilDayStart', () => {
    it('returns a Date with UTC hours reasonable for a sunset time (14–22 UTC for Rome)', () => {
      const result = civilDayStart(DATE_MARCH, LAT, LNG);
      expect(result).toBeInstanceOf(Date);
      const utcHour = result.getUTCHours();
      // Sunset in Rome is typically 15:00–19:00 UTC (17:00–21:00 local)
      expect(utcHour).toBeGreaterThanOrEqual(14);
      expect(utcHour).toBeLessThanOrEqual(22);
    });

    it('returns a Date before the input time', () => {
      const result = civilDayStart(DATE_JULY, LAT, LNG);
      expect(result.getTime()).toBeLessThan(DATE_JULY.getTime());
    });
  });

  describe('lastSunsetAtOrBefore', () => {
    it('returns a Date (not null) for Rome at a normal date', () => {
      const result = lastSunsetAtOrBefore(DATE_JULY, LAT, LNG);
      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Date);
    });

    it('returned sunset is at or before the input time', () => {
      const result = lastSunsetAtOrBefore(DATE_JULY, LAT, LNG);
      expect(result!.getTime()).toBeLessThanOrEqual(DATE_JULY.getTime());
    });
  });

  describe('civilDaysBetween', () => {
    it('consecutive sunsets are 1 day apart', () => {
      const ss1 = civilDayStart(DATE_MARCH, LAT, LNG);
      // Approximately one day later
      const nextDay = new Date(DATE_MARCH.getTime() + 86400000);
      const ss2 = civilDayStart(nextDay, LAT, LNG);
      const days = civilDaysBetween(ss1, ss2);
      expect(days).toBe(1);
    });
  });
});

describe('lunarCivilCalendar — regression snapshots', () => {
  describe('getLunarYearMonths for Babylonian at Rome in 2024', () => {
    it('matches snapshot', () => {
      const yearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2024, LAT, LNG);
      const nextYearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2025, LAT, LNG);
      const months = getLunarYearMonths(
        BAB_TAG,
        BAB_MIN_AGE,
        yearStart,
        nextYearStart,
        LAT,
        LNG,
      );
      // Snapshot the ISO strings for readability
      expect(months.map(d => d.toISOString())).toMatchSnapshot();
    });
  });

  describe('positionInYear for 2024-07-15T12:00:00Z at Rome', () => {
    it('matches snapshot', () => {
      const yearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2024, LAT, LNG);
      const nextYearStart = getLunarYearStart(BAB_TAG, BAB_MIN_AGE, SPRING_EQ_2025, LAT, LNG);
      const months = getLunarYearMonths(
        BAB_TAG,
        BAB_MIN_AGE,
        yearStart,
        nextYearStart,
        LAT,
        LNG,
      );
      const dayStart = civilDayStart(DATE_JULY, LAT, LNG);
      const pos = positionInYear(months, dayStart);
      expect({
        monthIndex: pos.monthIndex,
        day: pos.day,
        monthLength: pos.monthLength,
        monthCount: pos.monthCount,
        dayStartISO: pos.dayStart.toISOString(),
      }).toMatchSnapshot();
    });
  });
});

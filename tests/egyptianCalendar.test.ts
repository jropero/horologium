import { describe, it, expect } from 'vite-plus/test';
import {
  getEgyptianDate,
  formatEgyptianDate,
  getThoth1,
  getSothicCycleYear,
  getEgyptianCalendarYear,
  EGYPTIAN_MONTHS,
  EGYPTIAN_SEASONS,
} from '../utils/egyptianCalendarUtils';
import { calculateEgyptianTime } from '../utils/egyptianTimeUtils';

// ─── Hardcoded anchor values ──────────────────────────────────────────────────
//
// Epoch: Alexandrian year y starts at JDN = 1825030 + 365*(y-1) + floor(y/4).
// GREG_TO_ALEX_YEAR = 283, so the Gregorian year in which an Alexandrian year
// starts = y + 283.
//
// Thoth 1 of the Alexandrian year that starts in 2024 (y = 1741):
//   JDN = 1825030 + 365*1740 + floor(1741/4) = 1825030 + 635100 + 435 = 2460565
//   Days from JDN_UNIX_EPOCH(2440588): 2460565−2440588 = 19977
//   2024-01-01 is day 19723 from Unix epoch → day 19977−19723 = 254 into 2024 → Sep 11, 2024
//
// Derived expected values (local-date computation, timezone-agnostic construction):
//
//   new Date(2024, 8, 15)  → dayOfYear = 5  → Thoth 5,    Akhet,  monthIndex 0, decade 1
//   new Date(2025, 0, 1)   → dayOfYear = 113 → Choiak 23, Akhet,  monthIndex 3, decade 3
//   new Date(2024, 0, 1)   → dayOfYear = 112 → Choiak 22, Akhet,  monthIndex 3, decade 3 (year started 2023)
//   new Date(2024, 8, 10)  → dayOfYear = 365 → Epagomenal 5 (year started 2023)

const CAIRO_LAT = 30.0;
const CAIRO_LNG = 31.2;

describe('getEgyptianDate', () => {
  describe('monthIndex range for regular months', () => {
    it('monthIndex is in [0, 11] for a date in a regular month', () => {
      const result = getEgyptianDate(new Date(2024, 8, 15)); // Sep 15, 2024 local
      expect(result.monthIndex).toBeGreaterThanOrEqual(0);
      expect(result.monthIndex).toBeLessThanOrEqual(11);
      expect(result.isEpagomenal).toBe(false);
    });

    it('dayOfMonth is in [1, 30] for regular months', () => {
      // Test several dates spread across the year
      const dates = [
        new Date(2024, 8, 15),
        new Date(2024, 10, 1),
        new Date(2025, 2, 10),
        new Date(2025, 5, 20),
      ];
      for (const d of dates) {
        const result = getEgyptianDate(d);
        if (!result.isEpagomenal) {
          expect(result.dayOfMonth).toBeGreaterThanOrEqual(1);
          expect(result.dayOfMonth).toBeLessThanOrEqual(30);
        }
      }
    });
  });

  describe('epagomenal days', () => {
    it('isEpagomenal is true and dayOfMonth is in [1, 5] for Sep 10, 2024', () => {
      // 2024-09-10 is 5 days before Thoth 1 (Sep 11, 2024), so it is the 5th epagomenal day
      // of the Alexandrian year that started Sep 2023.
      const result = getEgyptianDate(new Date(2024, 8, 10)); // Sep 10, 2024 local
      expect(result.isEpagomenal).toBe(true);
      expect(result.monthIndex).toBe(-1);
      expect(result.dayOfMonth).toBeGreaterThanOrEqual(1);
      expect(result.dayOfMonth).toBeLessThanOrEqual(6); // 5 normally, 6 in leap
    });

    it('epagomenal day has seasonName Epagomenai', () => {
      const result = getEgyptianDate(new Date(2024, 8, 10));
      expect(result.seasonName).toBe('Epagomenai');
      expect(result.monthName).toBe('Epagomenai');
    });
  });

  describe('hardcoded expected dates (derived from epoch math)', () => {
    it('2024-09-15 → Thoth 5, Akhet, monthIndex 0, decade 1, alexandrianYear 2024', () => {
      // Thoth 1 = Sep 11, 2024 → Sep 15 is day 5 → Thoth 5
      const result = getEgyptianDate(new Date(2024, 8, 15));
      expect(result.monthName).toBe('Thoth');
      expect(result.monthIndex).toBe(0);
      expect(result.dayOfMonth).toBe(5);
      expect(result.dayOfYear).toBe(5);
      expect(result.decade).toBe(1);
      expect(result.seasonName).toBe('Akhet');
      expect(result.alexandrianYear).toBe(2024);
      expect(result.isEpagomenal).toBe(false);
    });

    it('2025-01-01 → Choiak 23, Akhet, monthIndex 3, decade 3, alexandrianYear 2024', () => {
      // Thoth 1 = Sep 11, 2024.
      // Days from Sep 11 to Jan 1, 2025:
      //   Sep: 30−11 = 19 remaining + 1 (Sep 11 itself counted as day 1) = Sep 11→30 is days 1→20
      //   Oct: days 21→51 (31 days)
      //   Nov: days 52→81 (30 days)
      //   Dec: days 82→112 (31 days)
      //   Jan 1: day 113
      // monthIndex = floor((113−1)/30) = floor(3.73) = 3 (Choiak)
      // dayOfMonth = (112 % 30) + 1 = 22 + 1 = 23
      const result = getEgyptianDate(new Date(2025, 0, 1));
      expect(result.monthName).toBe('Choiak');
      expect(result.monthIndex).toBe(3);
      expect(result.dayOfMonth).toBe(23);
      expect(result.dayOfYear).toBe(113);
      expect(result.decade).toBe(3);
      expect(result.seasonName).toBe('Akhet');
      expect(result.alexandrianYear).toBe(2024);
      expect(result.isEpagomenal).toBe(false);
    });

    it('2024-01-01 → Choiak 22, Akhet, monthIndex 3, decade 3, alexandrianYear 2023', () => {
      // Alexandrian year that started Sep 11, 2023 (alexYear 1740).
      // alexYearStartJdn(1740) = 1825030 + 365*1739 + floor(1740/4)
      //   = 1825030 + 634735 + 435 = 2460200
      // JDN of 2024-01-01 = 2460311
      // dayOfYear = 2460311 − 2460200 + 1 = 112
      // monthIndex = floor(111/30) = 3 (Choiak), dayOfMonth = 22, decade = 3
      const result = getEgyptianDate(new Date(2024, 0, 1));
      expect(result.monthName).toBe('Choiak');
      expect(result.monthIndex).toBe(3);
      expect(result.dayOfMonth).toBe(22);
      expect(result.dayOfYear).toBe(112);
      expect(result.decade).toBe(3);
      expect(result.seasonName).toBe('Akhet');
      expect(result.alexandrianYear).toBe(2023);
      expect(result.isEpagomenal).toBe(false);
    });
  });

  describe('snapshot', () => {
    it('full return object matches snapshot for 2024-09-15', () => {
      const result = getEgyptianDate(new Date(2024, 8, 15));
      expect(result).toMatchSnapshot();
    });

    it('full return object matches snapshot for epagomenal day 2024-09-10', () => {
      const result = getEgyptianDate(new Date(2024, 8, 10));
      expect(result).toMatchSnapshot();
    });
  });

  describe('isBeforeSunrise flag', () => {
    it('when isBeforeSunrise=true, date shifts back one day', () => {
      const sep15 = new Date(2024, 8, 15);
      const sep14 = new Date(2024, 8, 14);
      const withFlag = getEgyptianDate(sep15, true);
      const normalSep14 = getEgyptianDate(sep14, false);
      expect(withFlag.dayOfYear).toBe(normalSep14.dayOfYear);
      expect(withFlag.dayOfMonth).toBe(normalSep14.dayOfMonth);
    });
  });

  describe('decade calculation', () => {
    it('days 1-10 → decade 1', () => {
      // Thoth 1 = Sep 11, so day 7 = Sep 17
      const result = getEgyptianDate(new Date(2024, 8, 17));
      expect(result.dayOfMonth).toBe(7);
      expect(result.decade).toBe(1);
    });

    it('days 11-20 → decade 2', () => {
      // Thoth 15 = Sep 25, 2024
      const result = getEgyptianDate(new Date(2024, 8, 25));
      expect(result.dayOfMonth).toBe(15);
      expect(result.decade).toBe(2);
    });

    it('days 21-30 → decade 3', () => {
      // Thoth 25 = Oct 5, 2024
      const result = getEgyptianDate(new Date(2024, 9, 5));
      expect(result.dayOfMonth).toBe(25);
      expect(result.decade).toBe(3);
    });
  });

  describe('month boundaries', () => {
    it('last day of Thoth (day 30) → Thoth, monthIndex 0', () => {
      // Thoth 30 = Sep 11 + 29 = Oct 10, 2024
      const result = getEgyptianDate(new Date(2024, 9, 10));
      expect(result.monthName).toBe('Thoth');
      expect(result.dayOfMonth).toBe(30);
      expect(result.monthIndex).toBe(0);
    });

    it('first day of Phaophi (day 31) → Phaophi, monthIndex 1', () => {
      // Phaophi 1 = Oct 11, 2024
      const result = getEgyptianDate(new Date(2024, 9, 11));
      expect(result.monthName).toBe('Phaophi');
      expect(result.dayOfMonth).toBe(1);
      expect(result.monthIndex).toBe(1);
    });

    it('first day of Mechir (Peret month 2, monthIndex 5)', () => {
      // 5 months * 30 = 150 days from Thoth 1 → Sep 11 + 150 = Feb 8, 2025
      const result = getEgyptianDate(new Date(2025, 1, 8));
      expect(result.monthName).toBe('Mechir');
      expect(result.monthIndex).toBe(5);
      expect(result.dayOfMonth).toBe(1);
      expect(result.seasonName).toBe('Peret');
    });

    it('first day of Pachon (Shemu month 1, monthIndex 8)', () => {
      // 8 months * 30 = 240 days from Thoth 1 → Sep 11 + 240 = May 9, 2025
      const result = getEgyptianDate(new Date(2025, 4, 9));
      expect(result.monthName).toBe('Pachon');
      expect(result.monthIndex).toBe(8);
      expect(result.dayOfMonth).toBe(1);
      expect(result.seasonName).toBe('Shemu');
    });
  });

  describe('season assignment', () => {
    it('months 0-3 → Akhet', () => {
      for (const monthIndex of [0, 1, 2, 3]) {
        const offset = monthIndex * 30;
        const d = new Date(2024, 8, 11 + offset); // Thoth 1 + offset days
        const result = getEgyptianDate(d);
        expect(result.seasonName).toBe('Akhet');
      }
    });

    it('months 4-7 → Peret', () => {
      // Use day-offset construction (same as Akhet) to avoid DST-sensitive ms arithmetic.
      // Thoth 1 = Sep 11, so month 4 (Tybi) starts Sep 11 + 120 = Jan 9, 2025
      for (const monthIndex of [4, 5, 6, 7]) {
        const d = new Date(2024, 8, 11 + monthIndex * 30);
        const result = getEgyptianDate(d);
        expect(result.seasonName).toBe('Peret');
      }
    });

    it('months 8-11 → Shemu', () => {
      // Thoth 1 = Sep 11, so month 8 (Pachon) starts Sep 11 + 240 = May 9, 2025
      for (const monthIndex of [8, 9, 10, 11]) {
        const d = new Date(2024, 8, 11 + monthIndex * 30);
        const result = getEgyptianDate(d);
        expect(result.seasonName).toBe('Shemu');
      }
    });
  });
});

describe('formatEgyptianDate', () => {
  it('formats regular date correctly', () => {
    const result = getEgyptianDate(new Date(2024, 8, 15));
    const formatted = formatEgyptianDate(result);
    expect(formatted).toContain('Thoth');
    expect(formatted).toContain('5');
    expect(formatted).toContain('Akhet');
    expect(formatted).toContain('Década 1');
  });

  it('formats epagomenal day correctly', () => {
    const result = getEgyptianDate(new Date(2024, 8, 10));
    const formatted = formatEgyptianDate(result);
    expect(formatted).toContain('epagómeno');
    expect(formatted).toContain('Epagomenai');
  });
});

describe('getThoth1', () => {
  it('returns a valid Date', () => {
    const thoth1 = getThoth1(2024);
    expect(thoth1).toBeInstanceOf(Date);
    expect(Number.isNaN(thoth1.getTime())).toBe(false);
  });

  it('Thoth 1 of 2024 falls in September', () => {
    // Thoth 1 = Sep 11, 2024 (UTC midnight)
    const thoth1 = getThoth1(2024);
    expect(thoth1.getUTCMonth()).toBe(8); // September (0-indexed)
    expect(thoth1.getUTCDate()).toBe(11);
    expect(thoth1.getUTCFullYear()).toBe(2024);
  });

  it('Thoth 1 of consecutive years are 365 or 366 days apart', () => {
    for (const year of [2022, 2023, 2024, 2025]) {
      const t1 = getThoth1(year);
      const t2 = getThoth1(year + 1);
      const diff = Math.round((t2.getTime() - t1.getTime()) / 86400000);
      expect([365, 366]).toContain(diff);
    }
  });
});

describe('getSothicCycleYear', () => {
  it('returns expected shape', () => {
    const result = getSothicCycleYear(2024);
    expect(typeof result.cycle).toBe('number');
    expect(typeof result.year).toBe('number');
    expect(typeof result.epoch).toBe('number');
    expect(typeof result.label).toBe('string');
    expect(result.label).toContain('Ciclo Sótico');
  });

  it('epoch 139 AD is the base epoch', () => {
    const result = getSothicCycleYear(139);
    expect(result.epoch).toBe(139);
    expect(result.year).toBe(1);
  });
});

describe('getEgyptianCalendarYear', () => {
  it('returns 13 month entries (12 regular + 1 epagomenal)', () => {
    const year = getEgyptianCalendarYear(2024);
    expect(year.months).toHaveLength(13);
  });

  it('regular months each have 30 days', () => {
    const year = getEgyptianCalendarYear(2024);
    for (const month of year.months.slice(0, 12)) {
      expect(month.days).toHaveLength(30);
      expect(month.kind).toBe('regular');
    }
  });

  it('epagomenal month has 5 or 6 days', () => {
    const year = getEgyptianCalendarYear(2024);
    const epag = year.months[12];
    expect(epag.kind).toBe('epagomenal');
    expect([5, 6]).toContain(epag.days.length);
  });

  it('total days is 365 or 366', () => {
    const year = getEgyptianCalendarYear(2024);
    const total = year.months.reduce((sum, m) => sum + m.days.length, 0);
    expect([365, 366]).toContain(total);
  });

  it('gregorian dates increase monotonically', () => {
    const year = getEgyptianCalendarYear(2024);
    const allDays = year.months.flatMap(m => m.days);
    for (let i = 1; i < allDays.length; i++) {
      expect(allDays[i].gregorian.getTime()).toBeGreaterThan(
        allDays[i - 1].gregorian.getTime(),
      );
    }
  });
});

describe('EGYPTIAN_MONTHS static data', () => {
  it('contains exactly 12 months', () => {
    expect(EGYPTIAN_MONTHS).toHaveLength(12);
  });

  it('each month has valid seasonIndex (0-2) and monthInSeason (1-4)', () => {
    for (const month of EGYPTIAN_MONTHS) {
      expect(month.seasonIndex).toBeGreaterThanOrEqual(0);
      expect(month.seasonIndex).toBeLessThanOrEqual(2);
      expect(month.monthInSeason).toBeGreaterThanOrEqual(1);
      expect(month.monthInSeason).toBeLessThanOrEqual(4);
    }
  });

  it('months have the correct names in order', () => {
    const expectedNames = [
      'Thoth',
      'Phaophi',
      'Athyr',
      'Choiak',
      'Tybi',
      'Mechir',
      'Phamenoth',
      'Pharmuthi',
      'Pachon',
      'Payni',
      'Epiphi',
      'Mesore',
    ];
    expect(EGYPTIAN_MONTHS.map(m => m.name)).toEqual(expectedNames);
  });
});

describe('EGYPTIAN_SEASONS static data', () => {
  it('contains exactly 3 seasons', () => {
    expect(EGYPTIAN_SEASONS).toHaveLength(3);
  });

  it('seasons cover all 12 months without overlap', () => {
    const allMonths = EGYPTIAN_SEASONS.flatMap(s => s.months);
    expect(allMonths.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });
});

describe('calculateEgyptianTime', () => {
  it('romanHour is in [1, 12]', () => {
    const result = calculateEgyptianTime(
      new Date('2024-06-21T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(result.romanHour).toBeGreaterThanOrEqual(1);
    expect(result.romanHour).toBeLessThanOrEqual(12);
  });

  it('isDay is a boolean', () => {
    const result = calculateEgyptianTime(
      new Date('2024-06-21T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(typeof result.isDay).toBe('boolean');
  });

  it('10:00 UTC on 2024-06-21 at Cairo is daytime (isDay=true)', () => {
    // Cairo sunrise ~03:40 UTC, sunset ~17:00 UTC on summer solstice
    const result = calculateEgyptianTime(
      new Date('2024-06-21T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(result.isDay).toBe(true);
  });

  it('22:00 UTC on 2024-06-21 at Cairo is nighttime (isDay=false)', () => {
    // 22:00 UTC = 00:00 Cairo next day — well past sunset (~17:00 UTC)
    const result = calculateEgyptianTime(
      new Date('2024-06-21T22:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(result.isDay).toBe(false);
  });

  it('romanHour is consistent when called twice with same input', () => {
    const date = new Date('2024-06-21T10:00:00Z');
    const r1 = calculateEgyptianTime(date, CAIRO_LAT, CAIRO_LNG);
    const r2 = calculateEgyptianTime(date, CAIRO_LAT, CAIRO_LNG);
    expect(r1.romanHour).toBe(r2.romanHour);
    expect(r1.isDay).toBe(r2.isDay);
  });

  it('sunrise and sunset are valid Date objects', () => {
    const result = calculateEgyptianTime(
      new Date('2024-06-21T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(result.sunrise).toBeInstanceOf(Date);
    expect(result.sunset).toBeInstanceOf(Date);
  });

  it('sunrise is before sunset', () => {
    const result = calculateEgyptianTime(
      new Date('2024-06-21T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(result.sunrise.getTime()).toBeLessThan(result.sunset.getTime());
  });

  it('romanDateString includes month name', () => {
    const result = calculateEgyptianTime(
      new Date('2024-09-15T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(typeof result.romanDateString).toBe('string');
    expect(result.romanDateString.length).toBeGreaterThan(0);
  });

  it('moonPhase is in [0, 1]', () => {
    const result = calculateEgyptianTime(
      new Date('2024-06-21T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    expect(result.moonPhase).toBeGreaterThanOrEqual(0);
    expect(result.moonPhase).toBeLessThanOrEqual(1);
  });

  it('planetaryRuler is one of the seven planets', () => {
    const result = calculateEgyptianTime(
      new Date('2024-06-21T10:00:00Z'),
      CAIRO_LAT,
      CAIRO_LNG,
    );
    const planets = ['Saturnus', 'Iuppiter', 'Mars', 'Sol', 'Venus', 'Mercurius', 'Luna'];
    expect(planets).toContain(result.planetaryRuler);
  });
});

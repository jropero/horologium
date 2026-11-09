import { describe, it, expect } from 'vite-plus/test';
import { getChineseLunisolarDate, getYearStemBranch } from '../utils/chineseLunisolarUtils';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { getCurrentShichen } from '../utils/chineseTimeUtils';

// Beijing coordinates (used as the observer location; the Chinese calendar is
// reckoned in China Standard Time, UTC+8, so location has no effect for these
// computations — the utils use CST internally)
const _BEIJING_LAT = 39.9;
const _BEIJING_LNG = 116.4;

// Two well-known astronomical moments in 2024
const SPRING_EQUINOX_2024 = new Date('2024-03-20T12:00:00Z'); // ~Chunfen (春分)
const SUMMER_SOLSTICE_2024 = new Date('2024-06-21T12:00:00Z'); // ~Xiazhi (夏至)

// ---- SOLAR TERMS ----

describe('Solar terms (jiéqì) — deterministic from solar longitude', () => {
  it('spring equinox 2024-03-20 falls on Chunfen (春分, term id 4)', () => {
    const { term } = getChineseCalendarData(SPRING_EQUINOX_2024);
    // Chunfen = Sun at 0° ecliptic longitude → index 3 in the 0-based array → id 4
    expect(term.hanzi).toBe('春分');
    expect(term.pinyin.toLowerCase()).toMatch(/ch[uū]nf[eē]n/);
    expect(term.id).toBe(4);
  });

  it('summer solstice 2024-06-21 falls on Xiazhi (夏至, term id 10)', () => {
    const { term } = getChineseCalendarData(SUMMER_SOLSTICE_2024);
    // Xiazhi = Sun at 90° ecliptic longitude → index 9 → id 10
    expect(term.hanzi).toBe('夏至');
    expect(term.pinyin.toLowerCase()).toMatch(/xi[aà]zh[iì]/);
    expect(term.id).toBe(10);
  });

  it('term id is always in [1, 24]', () => {
    for (const date of [SPRING_EQUINOX_2024, SUMMER_SOLSTICE_2024]) {
      const { term } = getChineseCalendarData(date);
      expect(term.id).toBeGreaterThanOrEqual(1);
      expect(term.id).toBeLessThanOrEqual(24);
    }
  });

  it('pentad is always in [1, 3]', () => {
    for (const date of [SPRING_EQUINOX_2024, SUMMER_SOLSTICE_2024]) {
      const { pentad } = getChineseCalendarData(date);
      expect(pentad).toBeGreaterThanOrEqual(1);
      expect(pentad).toBeLessThanOrEqual(3);
    }
  });

  it('spring equinox solar term snapshot', () => {
    const result = getChineseCalendarData(SPRING_EQUINOX_2024);
    expect(result.term).toMatchSnapshot();
  });

  it('summer solstice solar term snapshot', () => {
    const result = getChineseCalendarData(SUMMER_SOLSTICE_2024);
    expect(result.term).toMatchSnapshot();
  });
});

// ---- LUNISOLAR DATE ----

describe('Chinese lunisolar date', () => {
  it('month number is in [1, 13] for spring equinox 2024', () => {
    const result = getChineseLunisolarDate(SPRING_EQUINOX_2024);
    expect(result.monthNumber).toBeGreaterThanOrEqual(1);
    expect(result.monthNumber).toBeLessThanOrEqual(13);
  });

  it('day number is in [1, 30] for spring equinox 2024', () => {
    const result = getChineseLunisolarDate(SPRING_EQUINOX_2024);
    expect(result.dayNumber).toBeGreaterThanOrEqual(1);
    expect(result.dayNumber).toBeLessThanOrEqual(30);
  });

  it('month number is in [1, 13] for summer solstice 2024', () => {
    const result = getChineseLunisolarDate(SUMMER_SOLSTICE_2024);
    expect(result.monthNumber).toBeGreaterThanOrEqual(1);
    expect(result.monthNumber).toBeLessThanOrEqual(13);
  });

  it('day number is in [1, 30] for summer solstice 2024', () => {
    const result = getChineseLunisolarDate(SUMMER_SOLSTICE_2024);
    expect(result.dayNumber).toBeGreaterThanOrEqual(1);
    expect(result.dayNumber).toBeLessThanOrEqual(30);
  });

  it('2024 is Year of the Dragon (甲辰): yearStemIndex=0, yearBranchIndex=4', () => {
    // Chinese New Year 2024 began on 10 Feb 2024, so both test dates are in 甲辰年
    for (const date of [SPRING_EQUINOX_2024, SUMMER_SOLSTICE_2024]) {
      const result = getChineseLunisolarDate(date);
      expect(result.yearStemIndex).toBe(0); // 甲 (jiǎ)
      expect(result.yearBranchIndex).toBe(4); // 辰 (chén) = Dragon
      expect(result.yearStem).toBe('甲');
      expect(result.yearBranch).toBe('辰');
      expect(result.yearAnimal).toBe('龙');
    }
  });

  it('stem index is in [0, 9]', () => {
    for (const date of [SPRING_EQUINOX_2024, SUMMER_SOLSTICE_2024]) {
      const result = getChineseLunisolarDate(date);
      expect(result.yearStemIndex).toBeGreaterThanOrEqual(0);
      expect(result.yearStemIndex).toBeLessThanOrEqual(9);
      expect(result.monthStemIndex).toBeGreaterThanOrEqual(0);
      expect(result.monthStemIndex).toBeLessThanOrEqual(9);
      expect(result.dayStemIndex).toBeGreaterThanOrEqual(0);
      expect(result.dayStemIndex).toBeLessThanOrEqual(9);
    }
  });

  it('branch index is in [0, 11]', () => {
    for (const date of [SPRING_EQUINOX_2024, SUMMER_SOLSTICE_2024]) {
      const result = getChineseLunisolarDate(date);
      expect(result.yearBranchIndex).toBeGreaterThanOrEqual(0);
      expect(result.yearBranchIndex).toBeLessThanOrEqual(11);
      expect(result.monthBranchIndex).toBeGreaterThanOrEqual(0);
      expect(result.monthBranchIndex).toBeLessThanOrEqual(11);
      expect(result.dayBranchIndex).toBeGreaterThanOrEqual(0);
      expect(result.dayBranchIndex).toBeLessThanOrEqual(11);
    }
  });

  it('spring equinox 2024 lunisolar date snapshot', () => {
    expect(getChineseLunisolarDate(SPRING_EQUINOX_2024)).toMatchSnapshot();
  });

  it('summer solstice 2024 lunisolar date snapshot', () => {
    expect(getChineseLunisolarDate(SUMMER_SOLSTICE_2024)).toMatchSnapshot();
  });
});

// ---- STEM-BRANCH YEAR HELPER ----

describe('getYearStemBranch', () => {
  it('year 2024 → 甲辰, Dragon, stemIndex=0, branchIndex=4', () => {
    const result = getYearStemBranch(2024);
    expect(result.stem).toBe('甲');
    expect(result.branch).toBe('辰');
    expect(result.animal).toBe('龙');
    expect(result.stemIndex).toBe(0);
    expect(result.branchIndex).toBe(4);
    expect(result.display).toBe('甲辰');
  });

  it('stem index is always in [0, 9] for a range of years', () => {
    for (let y = 2000; y <= 2030; y++) {
      const { stemIndex } = getYearStemBranch(y);
      expect(stemIndex).toBeGreaterThanOrEqual(0);
      expect(stemIndex).toBeLessThanOrEqual(9);
    }
  });

  it('branch index is always in [0, 11] for a range of years', () => {
    for (let y = 2000; y <= 2030; y++) {
      const { branchIndex } = getYearStemBranch(y);
      expect(branchIndex).toBeGreaterThanOrEqual(0);
      expect(branchIndex).toBeLessThanOrEqual(11);
    }
  });
});

// ---- SHICHEN (double-hour) ----

describe('getCurrentShichen', () => {
  it('branch id is in [1, 12] (mapping to [0, 11] 0-based)', () => {
    // Test a spread of hours throughout the day
    for (let h = 0; h < 24; h++) {
      const date = new Date(`2024-03-20T${String(h).padStart(2, '0')}:30:00Z`);
      const { current } = getCurrentShichen(date);
      expect(current.id).toBeGreaterThanOrEqual(1);
      expect(current.id).toBeLessThanOrEqual(12);
    }
  });

  it('progressPercent is in [0, 1)', () => {
    for (let h = 0; h < 24; h++) {
      const date = new Date(`2024-03-20T${String(h).padStart(2, '0')}:30:00Z`);
      const { progressPercent } = getCurrentShichen(date);
      expect(progressPercent).toBeGreaterThanOrEqual(0);
      expect(progressPercent).toBeLessThan(1);
    }
  });

  it('progressPercent is 0 at the exact start of a shichen', () => {
    // 子 shichen (Rata) starts at 23:00 local — test at 23:00
    const date = new Date();
    date.setHours(23, 0, 0, 0);
    const { current, progressPercent } = getCurrentShichen(date);
    expect(current.branchHanzi).toBe('子');
    expect(progressPercent).toBe(0);
  });

  it('progressPercent is ~0.5 at the midpoint of a shichen', () => {
    // 午 shichen (Caballo) covers 11:00–13:00; midpoint is 12:00
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    const { current, progressPercent } = getCurrentShichen(date);
    expect(current.branchHanzi).toBe('午');
    expect(progressPercent).toBeCloseTo(0.5, 1);
  });

  it('returns a valid shichen with branchHanzi and animalName set', () => {
    const { current } = getCurrentShichen(SPRING_EQUINOX_2024);
    expect(current.branchHanzi).toBeTruthy();
    expect(current.animalName).toBeTruthy();
    expect(current.startHour).toBeGreaterThanOrEqual(0);
    expect(current.endHour).toBeGreaterThanOrEqual(0);
  });
});

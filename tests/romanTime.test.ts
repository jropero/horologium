import { describe, it, expect } from 'vitest';
import { calculateRomanTime } from '../utils/romanTimeUtils';
import { ROMAN_YEAR_DATA } from '../utils/romanYearData';

// Valid Roman calendar day status codes
const VALID_STATUS_CODES = new Set(['F', 'C', 'N', 'NP', 'EN', 'FP', 'QRCF', 'QRCI', 'COMP']);

// Rome coordinates
const ROME_LAT = 41.9;
const ROME_LNG = 12.5;

describe('ROMAN_YEAR_DATA — static data integrity', () => {
  it('has an entry for January 1 (Kalends, key "0-1") with a valid status', () => {
    const entry = ROMAN_YEAR_DATA['0-1'];
    expect(entry).toBeDefined();
    expect(VALID_STATUS_CODES.has(entry.status)).toBe(true);
  });

  it('has an entry for the Ides of March (key "2-15") mentioning Ides/Martis/Idus', () => {
    const entry = ROMAN_YEAR_DATA['2-15'];
    expect(entry).toBeDefined();
    const hasIdesRef =
      (entry.festivalName ?? '').match(/Ides|Martis|Idus/i) !== null ||
      (entry.statusFull ?? '').match(/Ides|Martis|Idus/i) !== null;
    expect(hasIdesRef).toBe(true);
  });

  it('every entry with a festivalName also has a non-empty festivalDesc', () => {
    for (const [key, entry] of Object.entries(ROMAN_YEAR_DATA)) {
      if (entry.festivalName !== undefined && entry.festivalName !== '') {
        expect(
          entry.festivalDesc,
          `Key ${key} has festivalName "${entry.festivalName}" but no festivalDesc`,
        ).toBeTruthy();
      }
    }
  });

  it('every entry has a status code from the allowed set', () => {
    for (const [key, entry] of Object.entries(ROMAN_YEAR_DATA)) {
      expect(
        VALID_STATUS_CODES.has(entry.status),
        `Key ${key} has unexpected status "${entry.status}"`,
      ).toBe(true);
    }
  });

  it('total entry count is between 355 and 366 (common + leap-day entries)', () => {
    const count = Object.keys(ROMAN_YEAR_DATA).length;
    expect(count).toBeGreaterThanOrEqual(355);
    expect(count).toBeLessThanOrEqual(366);
  });
});

describe('calculateRomanTime — computed Roman time', () => {
  it('returns currentHour (romanHour) in [1, 12] and isDay as a boolean', () => {
    const date = new Date('2024-06-21T12:00:00Z');
    const result = calculateRomanTime(date, ROME_LAT, ROME_LNG);
    expect(result.romanHour).toBeGreaterThanOrEqual(1);
    expect(result.romanHour).toBeLessThanOrEqual(12);
    expect(typeof result.isDay).toBe('boolean');
  });

  it('is daytime at Rome at 10:00 UTC on the summer solstice (noon local time)', () => {
    // Rome is UTC+2 in summer; 10:00 UTC = 12:00 CEST — well within daylight hours
    const date = new Date('2024-06-21T10:00:00Z');
    const result = calculateRomanTime(date, ROME_LAT, ROME_LNG);
    expect(result.isDay).toBe(true);
  });

  it('is nighttime at Rome at 22:00 UTC on the summer solstice (midnight local time)', () => {
    // Rome is UTC+2 in summer; 22:00 UTC = 00:00 CEST — well into night
    const date = new Date('2024-06-21T22:00:00Z');
    const result = calculateRomanTime(date, ROME_LAT, ROME_LNG);
    expect(result.isDay).toBe(false);
  });

  it('full return object matches snapshot (summer solstice noon, Rome)', () => {
    const date = new Date('2024-06-21T10:00:00Z');
    const result = calculateRomanTime(date, ROME_LAT, ROME_LNG);
    expect(result).toMatchSnapshot();
  });
});

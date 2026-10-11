// civilCalendar.ts — Shared shapes for the civilization-specific annual date picker.
// Each civilization engine (Attic, Egyptian, Babylonian) can build a full civil
// year as a list of months, each holding its days mapped to Gregorian dates.

export interface CivilCalendarDay {
  /** Day number within the month (or within the epagomenal period). */
  day: number;
  /** Gregorian date (local noon) the app will travel to for this civil day. */
  gregorian: Date;
}

export interface CivilCalendarMonth {
  /** Stable key, unique within the year. */
  key: string;
  /** Native month name (Greek / hieroglyph-bearing / Akkadian). */
  name: string;
  /** Latin transliteration, or secondary native script. */
  latin?: string;
  /** Short Spanish gloss shown under the name. */
  translation?: string;
  /** Month category, used for styling. */
  kind?: 'regular' | 'intercalary' | 'epagomenal';
  days: CivilCalendarDay[];
}

export interface CivilCalendarYear {
  /** Gregorian year the civil year is anchored to (used for navigation). */
  anchorGregYear: number;
  /** Headline year label, e.g. "SE 2336" or "Año 2026". */
  yearLabel: string;
  /** Optional subtitle, e.g. "Año intercalar (13 meses)". */
  yearSubtitle?: string;
  months: CivilCalendarMonth[];
}

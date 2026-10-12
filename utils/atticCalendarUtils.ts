// atticCalendarUtils.ts — Lunisolar Attic calendar engine
// Maps Gregorian dates to Attic equivalents using real lunar phases.
// The day runs from sunset to sunset. The Noumenia (1st of month) begins at the
// sunset when the new crescent is first visible. The Attic year begins with
// Hekatombaion, the first month starting on or after the summer solstice.
// Month boundaries are computed for the observer's location (default: Athens).
// Shared engine: utils/lunarCivilCalendar.ts.

import { getMoonPhase, summerSolsticeJDE } from './solar';
import type { CivilCalendarYear, CivilCalendarMonth, CivilCalendarDay } from '../types/civilCalendar';
import { translateGreekUI } from './greekTranslations';
import { getOlympiadYear } from './greekEra';
import {
  getLunarYearStart, getLunarYearMonths, civilDayStart, civilDaysBetween,
  positionInYear, daytimeOfCivilDay,
} from './lunarCivilCalendar';

const DAY_MS = 1000 * 60 * 60 * 24;
// Fallback observer for callers without a location (the Attic calendar was
// Athens' civil calendar). The live clock, hero, day list and date picker pass
// the user's coordinates instead.
export const ATHENS_LAT = 37.9838;
export const ATHENS_LNG = 23.7275;

// Moon age (days) at which the new crescent counts as visible (~38°N).
const CRESCENT_DELAY = 1.5;

const fromJD = (jd: number): Date => new Date((jd - 2440587.5) * 86400000);

// The 12 Attic months
export const ATTIC_MONTHS = [
  { name: "Ἑκατομβαιών", latin: "Hekatombaion", approxGreg: "Jul-Ago" },
  { name: "Μεταγειτνιών", latin: "Metageitnion", approxGreg: "Ago-Sep" },
  { name: "Βοηδρομιών", latin: "Boedromion", approxGreg: "Sep-Oct" },
  { name: "Πυανεψιών", latin: "Pyanepsion", approxGreg: "Oct-Nov" },
  { name: "Μαιμακτηριών", latin: "Maimakterion", approxGreg: "Nov-Dic" },
  { name: "Ποσειδεών", latin: "Poseideon", approxGreg: "Dic-Ene" },
  { name: "Γαμηλιών", latin: "Gamelion", approxGreg: "Ene-Feb" },
  { name: "Ἀνθεστηριών", latin: "Anthesterion", approxGreg: "Feb-Mar" },
  { name: "Ἐλαφηβολιών", latin: "Elaphebolion", approxGreg: "Mar-Abr" },
  { name: "Μουνυχιών", latin: "Mounichion", approxGreg: "Abr-May" },
  { name: "Θαργηλιών", latin: "Thargelion", approxGreg: "May-Jun" },
  { name: "Σκιροφοριών", latin: "Skirophorion", approxGreg: "Jun-Jul" }
];

// Intercalary month (inserted after Poseideon in 13-lunation years)
export const INTERCALARY_MONTH = { name: "Ποσειδεών Βʹ", latin: "Poseideon II", approxGreg: "Ene" };

// Greek ordinal day names
const GREEK_DAY_ORDINALS = [
  "", "πρώτη", "δευτέρα", "τρίτη", "τετάρτη", "πέμπτη",
  "ἕκτη", "ἑβδόμη", "ὀγδόη", "ἐνάτη", "δεκάτη"
];

// --- Attic year engine ---

/** Sunset that begins Hekatombaion 1 of the Attic year anchored in `gregorianYear`. */
export const getAtticYearStart = (
  gregorianYear: number, lat: number = ATHENS_LAT, lng: number = ATHENS_LNG
): Date => getLunarYearStart('attic', CRESCENT_DELAY, fromJD(summerSolsticeJDE(gregorianYear)), lat, lng);

const atticYearMonths = (anchor: number, lat: number, lng: number): Date[] =>
  getLunarYearMonths('attic', CRESCENT_DELAY, getAtticYearStart(anchor, lat, lng), getAtticYearStart(anchor + 1, lat, lng), lat, lng);

// Lunation index → month. In a 13-lunation year the 7th lunation is Poseideon II.
// (Modern astronomical reconstruction — Athenian intercalation was decided ad hoc
// by the archon, not by a fixed rule.)
const monthForLunation = (lunation: number, monthCount: number) => {
  const isIntercalaryYear = monthCount === 13;
  if (isIntercalaryYear && lunation === 6) {
    return { monthIndex: 5, isIntercalaryMonth: true, data: INTERCALARY_MONTH };
  }
  const monthIndex = Math.min(isIntercalaryYear && lunation > 6 ? lunation - 1 : lunation, 11);
  return { monthIndex, isIntercalaryMonth: false, data: ATTIC_MONTHS[monthIndex] };
};

/** Attic year/lunation/day of the civil day containing `date`. */
const locateAtticDay = (date: Date, lat: number, lng: number) => {
  const dayStart = civilDayStart(date, lat, lng);
  let anchor = dayStart.getFullYear();
  if (dayStart.getTime() + 3 * 3600000 < getAtticYearStart(anchor, lat, lng).getTime()) anchor--;
  const months = atticYearMonths(anchor, lat, lng);
  return { anchor, months, ...positionInYear(months, dayStart) };
};

// --- Day formatting (3-decade system) ---

const formatAtticDay = (dayOfMonth: number, monthLength: number): { short: string; full: string; spanishShort: string; spanishFull: string } => {
  if (dayOfMonth === 1) {
    return { short: "Νουμηνία", full: "Νουμηνία", spanishShort: "Día 1 (Novilunio)", spanishFull: "Luna Nueva" };
  }

  if (dayOfMonth <= 10) {
    const ordinal = GREEK_DAY_ORDINALS[dayOfMonth] || dayOfMonth.toString();
    return {
      short: `${ordinal} ἱσταμένου`,
      full: `Ἡμέρα ${ordinal} τοῦ μηνὸς ἱσταμένου`,
      spanishShort: `Día ${dayOfMonth} creciente`,
      spanishFull: `Día ${dayOfMonth} de la luna creciente`
    };
  }

  if (dayOfMonth <= 20) {
    if (dayOfMonth === 20) {
      return { short: `εἰκάς`, full: `εἰκάς`, spanishShort: `Día 20 (Eikas)`, spanishFull: `Día 20 (la vigésima)` };
    }
    const dayInDecade = dayOfMonth - 10;
    const ordinal = GREEK_DAY_ORDINALS[dayInDecade] || dayInDecade.toString();
    return {
      short: `${ordinal} μεσοῦντος`,
      full: `Ἡμέρα ${ordinal} ἐπὶ δέκα`,
      spanishShort: `Día ${dayOfMonth} (mes central)`,
      spanishFull: `Día ${dayOfMonth}, mitad del mes`
    };
  }

  if (dayOfMonth === monthLength) {
    return { short: "ἕνη καὶ νέα", full: "Ἕνη καὶ Νέα", spanishShort: "Mes viejo y nuevo", spanishFull: "Último día (vieja y nueva luna)" };
  }
  
  const theoreticalDaysFromEnd = 30 - dayOfMonth + 1;
  const ordinal = GREEK_DAY_ORDINALS[theoreticalDaysFromEnd] || theoreticalDaysFromEnd.toString();
  return {
    short: `${ordinal} φθίνοντος`,
    full: `${ordinal} φθίνοντος`,
    spanishShort: `Día ${theoreticalDaysFromEnd} desde el fin`,
    spanishFull: `Día ${theoreticalDaysFromEnd} desde el fin del mes`
  };
};

// --- Public interface ---

export interface AtticDateResult {
  short: string;
  full: string;
  spanishShort: string;
  spanishFull: string;
  monthName: string;
  dayOfMonth: number;
  monthIndex: number;
  decade: number;
  monthLength: number;
  isIntercalaryMonth: boolean;
  /** Gregorian year in which this Attic year began (Hekatombaion 1). */
  anchorGregYear: number;
}

/**
 * Attic date of the civil day (sunset → sunset) containing `date`, with month
 * boundaries computed for the given location (default: Athens).
 */
export const getAtticDate = (
  date: Date, lat: number = ATHENS_LAT, lng: number = ATHENS_LNG
): AtticDateResult => {
  const { anchor, monthIndex: lunation, day, monthLength, monthCount } = locateAtticDay(date, lat, lng);
  const { monthIndex, isIntercalaryMonth, data: monthData } = monthForLunation(lunation, monthCount);
  const dayFormatted = formatAtticDay(day, monthLength);

  return {
    short: `${dayFormatted.short}, ${monthData.name}`,
    full: `${dayFormatted.full}, μηνὸς ${monthData.name}`,
    spanishShort: `${dayFormatted.spanishShort}, mes de ${monthData.name}`,
    spanishFull: `${dayFormatted.spanishFull}, mes de ${monthData.name} (${monthData.latin})`,
    monthName: monthData.name,
    dayOfMonth: day,
    monthIndex,
    decade: day <= 10 ? 1 : day <= 20 ? 2 : 3,
    monthLength,
    isIntercalaryMonth,
    anchorGregYear: anchor,
  };
};

// For the Greek calendar modal — get Attic date for any date
export const getAtticDateForDisplay = (
  date: Date, lat: number = ATHENS_LAT, lng: number = ATHENS_LNG
): {
  atticDate: AtticDateResult;
  moonPhase: number;
} => {
  return {
    atticDate: getAtticDate(date, lat, lng),
    moonPhase: getMoonPhase(date)
  };
};

// ─── Annual civil calendar (for the date picker) ───────────────────────────────

/** Gregorian year that anchors the Attic year containing `date`. */
export const getAtticYearAnchor = (
  date: Date, lat: number = ATHENS_LAT, lng: number = ATHENS_LNG
): number => locateAtticDay(date, lat, lng).anchor;

/**
 * Builds a full Attic civil year as months of days mapped to Gregorian dates.
 * Each civil day (sunset → sunset) is represented by the noon of its daylight
 * half, so `getAtticDate` reports exactly the month/day shown in the picker.
 */
export const getAtticCalendarYear = (
  anchorGregYear: number, lat: number = ATHENS_LAT, lng: number = ATHENS_LNG
): CivilCalendarYear => {
  const starts = atticYearMonths(anchorGregYear, lat, lng);
  const totalMonths = starts.length - 1;

  const months: CivilCalendarMonth[] = [];
  for (let m = 0; m < totalMonths; m++) {
    const { isIntercalaryMonth, data } = monthForLunation(m, totalMonths);
    const length = civilDaysBetween(starts[m], starts[m + 1]);
    const days: CivilCalendarDay[] = [];
    for (let d = 1; d <= length; d++) {
      days.push({ day: d, gregorian: daytimeOfCivilDay(new Date(starts[m].getTime() + (d - 1) * DAY_MS)) });
    }
    months.push({
      key: `attic-${m}`,
      name: data.name,
      latin: data.latin,
      translation: translateGreekUI(data.name),
      kind: isIntercalaryMonth ? 'intercalary' : 'regular',
      days,
    });
  }

  const olympiad = getOlympiadYear(anchorGregYear);

  return {
    anchorGregYear,
    yearLabel: `Ol. ${olympiad.olympiad} · año ${olympiad.year}`,
    yearSubtitle: `${totalMonths === 13 ? 'Año intercalar · 13 meses' : 'Año de 12 meses'} · ${anchorGregYear}/${anchorGregYear + 1}`,
    months,
  };
};

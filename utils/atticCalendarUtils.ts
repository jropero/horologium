// atticCalendarUtils.ts — Lunisolar Attic calendar engine
// Maps Gregorian dates to Attic equivalents using real lunar phases.
// The Noumenia (1st of month) is the first day after New Moon.
// The Attic year begins with Hekatombaion at the first New Moon
// after the summer solstice (~June 21).

import { getMoonPhase } from './solar';

const DAY_MS = 1000 * 60 * 60 * 24;
const SYNODIC_MONTH = 29.53059; // Average synodic month in days

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

// --- Lunar search functions ---

// Find the most recent New Moon before or on a given date
const findNewMoon = (date: Date): Date => {
  const d = new Date(date);
  let prevPhase = getMoonPhase(d);

  for (let i = 1; i <= 35; i++) {
    const check = new Date(d);
    check.setDate(check.getDate() - i);
    const phase = getMoonPhase(check);

    if (phase > 0.8 && prevPhase < 0.2) {
      const nmDate = new Date(d);
      nmDate.setDate(d.getDate() - (i - 1));
      nmDate.setHours(0, 0, 0, 0);
      return nmDate;
    }
    prevPhase = phase;
  }
  return d; // fallback
};

// Find the next New Moon strictly after a given date
const findNextNewMoon = (date: Date): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  let prevPhase = getMoonPhase(d);

  for (let i = 1; i <= 35; i++) {
    const check = new Date(d);
    check.setDate(d.getDate() + i);
    const phase = getMoonPhase(check);

    if (prevPhase > 0.8 && phase < 0.2) {
      check.setHours(0, 0, 0, 0);
      return check;
    }
    prevPhase = phase;
  }
  const fallback = new Date(date);
  fallback.setDate(date.getDate() + 30);
  fallback.setHours(0, 0, 0, 0);
  return fallback;
};

// Find the first New Moon on or after a given date
const findFirstNewMoonOnOrAfter = (date: Date): Date => {
  const phase = getMoonPhase(date);
  if (phase < 0.04 || phase > 0.96) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }
  let prevPhase = phase;
  for (let i = 1; i <= 35; i++) {
    const check = new Date(date);
    check.setDate(date.getDate() + i);
    const p = getMoonPhase(check);
    if (prevPhase > 0.8 && p < 0.2) {
      check.setHours(0, 0, 0, 0);
      return check;
    }
    prevPhase = p;
  }
  return new Date(date);
};

// --- Attic year engine ---

// Get the start of the Attic year (Hekatombaion 1) for a given Gregorian year.
// = first New Moon on or after the summer solstice (~June 21).
const getAtticYearStart = (gregorianYear: number): Date => {
  const solstice = new Date(gregorianYear, 5, 21); // June 21 (approximate)
  return findFirstNewMoonOnOrAfter(solstice);
};

// Core: determine Attic month, day, and month length from a real date
const getAtticMonthFromDate = (date: Date): {
  monthIndex: number;
  newMoon: Date;
  monthLength: number;
  isIntercalaryMonth: boolean;
} => {
  const year = date.getFullYear();

  // Determine which Attic year we're in
  let yearStart = getAtticYearStart(year);
  if (date < yearStart) {
    yearStart = getAtticYearStart(year - 1);
  }

  // Find the New Moon that starts our current month
  const newMoon = findNewMoon(date);

  // Count lunations from year start to our New Moon
  const daysSinceStart = Math.max(0, (newMoon.getTime() - yearStart.getTime()) / DAY_MS);
  const lunationCount = Math.round(daysSinceStart / SYNODIC_MONTH);

  // Find the next New Moon to get real month length
  const nextNewMoon = findNextNewMoon(newMoon);
  const rawLength = Math.round((nextNewMoon.getTime() - newMoon.getTime()) / DAY_MS);
  const monthLength = Math.max(29, Math.min(rawLength, 30));

  // Detect intercalary year (13 lunations between solstices)
  const nextYearStart = getAtticYearStart(yearStart.getFullYear() + 1);
  const yearDays = (nextYearStart.getTime() - yearStart.getTime()) / DAY_MS;
  const isIntercalaryYear = yearDays > 370;

  let monthIndex: number;
  let isIntercalaryMonth = false;

  if (isIntercalaryYear && lunationCount === 6) {
    // Lunation 6 in a 13-month year = Poseideon II
    monthIndex = 5; // Display as Poseideon variant
    isIntercalaryMonth = true;
  } else if (isIntercalaryYear && lunationCount > 6) {
    // After intercalary, shift back by 1
    monthIndex = Math.min(lunationCount - 1, 11);
  } else {
    monthIndex = Math.min(lunationCount, 11);
  }

  return { monthIndex, newMoon, monthLength, isIntercalaryMonth };
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
}

export const getAtticDate = (date: Date, isAfterSunset: boolean = false): AtticDateResult => {
  const { monthIndex, newMoon, monthLength, isIntercalaryMonth } = getAtticMonthFromDate(date);

  // Calculate days since the new moon
  const diffMs = date.getTime() - newMoon.getTime();
  const diffDays = Math.floor(diffMs / DAY_MS);

  // The day transition happens at sunset.
  let dayOfMonth = diffDays + (isAfterSunset ? 1 : 0);

  // Handle month boundaries
  if (dayOfMonth <= 0) {
    // Before Day 1 — use previous month
    const prevMonth = getAtticMonthFromDate(new Date(newMoon.getTime() - DAY_MS));
    const prevMonthData = isIntercalaryMonth ? INTERCALARY_MONTH : ATTIC_MONTHS[prevMonth.monthIndex];
    const prevBoundedDay = Math.min(prevMonth.monthLength + dayOfMonth, prevMonth.monthLength);
    const prevDayFormatted = formatAtticDay(prevBoundedDay, prevMonth.monthLength);
    return {
      short: `${prevDayFormatted.short}, ${prevMonthData.name}`,
      full: `${prevDayFormatted.full}, μηνὸς ${prevMonthData.name}`,
      spanishShort: `${prevDayFormatted.spanishShort}, mes de ${prevMonthData.name}`,
      spanishFull: `${prevDayFormatted.spanishFull}, mes de ${prevMonthData.name} (${prevMonthData.latin})`,
      monthName: prevMonthData.name,
      dayOfMonth: prevBoundedDay,
      monthIndex: prevMonth.monthIndex,
      decade: prevBoundedDay <= 10 ? 1 : prevBoundedDay <= 20 ? 2 : 3,
      monthLength: prevMonth.monthLength,
      isIntercalaryMonth: prevMonth.isIntercalaryMonth
    };
  }

  if (dayOfMonth > monthLength) {
    dayOfMonth = monthLength;
  }

  const monthData = isIntercalaryMonth ? INTERCALARY_MONTH : ATTIC_MONTHS[monthIndex];
  const boundedDay = Math.min(dayOfMonth, monthLength);
  const dayFormatted = formatAtticDay(boundedDay, monthLength);

  let decade = 1;
  if (boundedDay > 10 && boundedDay <= 20) decade = 2;
  if (boundedDay > 20) decade = 3;

  return {
    short: `${dayFormatted.short}, ${monthData.name}`,
    full: `${dayFormatted.full}, μηνὸς ${monthData.name}`,
    spanishShort: `${dayFormatted.spanishShort}, mes de ${monthData.name}`,
    spanishFull: `${dayFormatted.spanishFull}, mes de ${monthData.name} (${monthData.latin})`,
    monthName: monthData.name,
    dayOfMonth: boundedDay,
    monthIndex,
    decade,
    monthLength,
    isIntercalaryMonth
  };
};

// For the Greek calendar modal — get Attic date for any date
export const getAtticDateForDisplay = (date: Date): {
  atticDate: AtticDateResult;
  moonPhase: number;
} => {
  return {
    atticDate: getAtticDate(date),
    moonPhase: getMoonPhase(date)
  };
};

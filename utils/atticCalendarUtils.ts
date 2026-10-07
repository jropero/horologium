// atticCalendarUtils.ts — Lunisolar Attic calendar engine
// Maps Gregorian dates to Attic equivalents using real lunar phases.
// The Noumenia (1st of month) is the first day after New Moon.
// The Attic year begins with Hekatombaion at the first New Moon
// after the summer solstice.

import { getMoonPhase, summerSolsticeJDE, trueNewMoonJDE, kForJDE } from './solar';

const DAY_MS = 1000 * 60 * 60 * 24;
const SYNODIC_MONTH = 29.530588853;

// ─── Julian Day helpers ───────────────────────────────────────────────────────

const toJD  = (d: Date): number => d.getTime() / 86400000 + 2440587.5;
const fromJD = (jd: number): Date => new Date((jd - 2440587.5) * 86400000);

// Most recent new moon JDE on or before `jd`.
const prevNewMoonJDE = (jd: number): number => {
  let k = kForJDE(jd);
  let nm = trueNewMoonJDE(k);
  while (nm > jd) { k--; nm = trueNewMoonJDE(k); }
  const nmNext = trueNewMoonJDE(k + 1);
  if (nmNext <= jd) { k++; nm = nmNext; }
  return nm;
};

// First new moon JDE strictly after `jd`.
const nextNewMoonJDE = (jd: number): number => {
  const k = kForJDE(jd);
  for (let offset = 0; offset <= 2; offset++) {
    const nm = trueNewMoonJDE(k + offset);
    if (nm > jd) return nm;
  }
  return trueNewMoonJDE(k + 2);
};

// First new moon JDE on or after `jd`.
const newMoonOnOrAfterJDE = (jd: number): number => {
  let k = kForJDE(jd) - 1;
  let nm = trueNewMoonJDE(k);
  while (nm < jd) { k++; nm = trueNewMoonJDE(k); }
  return nm;
};

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

// Minimum moon age before first crescent is visible (~1.5 days, Athens ~38°N).
const CRESCENT_DELAY = 1.5;

// --- Attic year engine ---

// Get the start of the Attic year (Hekatombaion 1) for a given Gregorian year.
// Hekatombaion 1 = Noumenia (first crescent) after the summer solstice.
// Uses the crescent criterion: find the first new moon whose crescent
// (conjunction + CRESCENT_DELAY) falls on or after the summer solstice.
const getAtticYearStart = (gregorianYear: number): Date => {
  const solsticeJD = summerSolsticeJDE(gregorianYear);
  const nmJD = newMoonOnOrAfterJDE(solsticeJD - CRESCENT_DELAY);
  return fromJD(nmJD);
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
  const nmJD = prevNewMoonJDE(toJD(date));
  const newMoon = fromJD(nmJD);

  // Count lunations from year start to our New Moon
  const daysSinceStart = Math.max(0, (newMoon.getTime() - yearStart.getTime()) / DAY_MS);
  const lunationCount = Math.round(daysSinceStart / SYNODIC_MONTH);

  // Find the next New Moon to get real month length
  const nextNewMoon = fromJD(nextNewMoonJDE(nmJD));
  const rawLength = Math.round((nextNewMoon.getTime() - newMoon.getTime()) / DAY_MS);
  const monthLength = Math.max(29, Math.min(rawLength, 30));

  // Detect intercalary year (13 lunations between solstices).
  // Threshold of 370 d separates 12-lunation (~354 d) from 13-lunation (~384 d) years.
  // This is a modern astronomical reconstruction — Athenian intercalation was decided
  // ad hoc by the archon, not by a fixed rule. The Metonic cycle (7 intercalary months
  // per 19 years) was known from 432 BC but its use in the civil calendar is disputed.
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

// atticCalendarUtils.ts — Lunisolar Attic calendar engine
// Maps Gregorian dates to approximate Attic equivalents using lunar phases.
// The Noumenia (1st of month) is the first day after New Moon.

import { getMoonPhase } from './solar';

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

// Greek ordinal day names
const GREEK_DAY_ORDINALS = [
  "", "πρώτη", "δευτέρα", "τρίτη", "τετάρτη", "πέμπτη",
  "ἕκτη", "ἑβδόμη", "ὀγδόη", "ἐνάτη", "δεκάτη"
];

// Find the most recent New Moon before or on a given date
const findNewMoon = (date: Date): Date => {
  const d = new Date(date);
  // Walk backwards day by day to find where the phase wraps from ~0.99 back to ~0.01
  let prevPhase = getMoonPhase(d);

  for (let i = 1; i <= 35; i++) {
    const check = new Date(d);
    check.setDate(check.getDate() - i);
    const phase = getMoonPhase(check);
    
    // Going backwards, if phase jumps from < 0.2 to > 0.8, we crossed the new moon.
    // The day closer to "now" (i-1) is the first day after the new moon.
    if (phase > 0.8 && prevPhase < 0.2) {
      const nmDate = new Date(d);
      nmDate.setDate(d.getDate() - (i - 1));
      nmDate.setHours(0, 0, 0, 0); // Normalize to midnight
      return nmDate;
    }
    prevPhase = phase;
  }
  return d; // fallback
};

// Determine which Attic month based on the Gregorian month of the New Moon
const getAtticMonthIndex = (newMoonDate: Date): number => {
  const month = newMoonDate.getMonth(); // 0-11
  const mapping: { [key: number]: number } = {
    6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5,
    0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11
  };
  return mapping[month] ?? 0;
};

// Format day within the 3-decade system
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
}

export const getAtticDate = (date: Date, isAfterSunset: boolean = false): AtticDateResult => {
  const newMoon = findNewMoon(date);

  // Calculate days since the new moon midnight
  const diffMs = date.getTime() - newMoon.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // The day transition happens at sunset.
  // We align daytime directly with the Hellenion calendar grid (e.g., Apr 20 = Mounichion 2),
  // and advance the explicit Attic date strictly after civil sunset.
  let dayOfMonth = diffDays + (isAfterSunset ? 1 : 0);

  // Approximate month length (29 or 30 days — alternating hollow/full months)
  let monthIndex = getAtticMonthIndex(newMoon);
  let monthLength = monthIndex % 2 === 0 ? 30 : 29;

  // Handle month boundary (going backwards before Day 1)
  if (dayOfMonth <= 0) {
    monthIndex = (monthIndex - 1 + 12) % 12;
    monthLength = monthIndex % 2 === 0 ? 30 : 29;
    dayOfMonth = monthLength + dayOfMonth; // if dayOfMonth is 0, goes to monthLength
  }

  // Handle month boundary (going forwards)
  if (dayOfMonth > monthLength) {
    dayOfMonth = monthLength; // Simplistic capping for now
  }

  const monthData = ATTIC_MONTHS[monthIndex];
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
    monthLength
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

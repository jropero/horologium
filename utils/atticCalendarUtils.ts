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
  // Walk backwards day by day to find the day with moon phase closest to 0
  let bestDate = new Date(d);
  let bestPhase = getMoonPhase(d);
  // Make bestPhase wrap-around aware (phases near 1.0 are also near new moon)
  let bestDist = Math.min(bestPhase, 1 - bestPhase);

  for (let i = 1; i <= 35; i++) {
    const check = new Date(d);
    check.setDate(check.getDate() - i);
    const phase = getMoonPhase(check);
    const dist = Math.min(phase, 1 - phase);
    if (dist < bestDist) {
      bestDist = dist;
      bestPhase = phase;
      bestDate = new Date(check);
    }
  }
  return bestDate;
};

// Determine which Attic month based on the Gregorian month of the New Moon
// This is a simplified mapping
const getAtticMonthIndex = (newMoonDate: Date): number => {
  const month = newMoonDate.getMonth(); // 0-11
  // Mapping: The Attic year starts at Hekatombaion ≈ July
  // July(6)=0, Aug(7)=1, Sep(8)=2, Oct(9)=3, Nov(10)=4, Dec(11)=5
  // Jan(0)=6, Feb(1)=7, Mar(2)=8, Apr(3)=9, May(4)=10, Jun(5)=11
  const mapping: { [key: number]: number } = {
    6: 0,  // Jul -> Hekatombaion
    7: 1,  // Aug -> Metageitnion
    8: 2,  // Sep -> Boedromion
    9: 3,  // Oct -> Pyanepsion
    10: 4, // Nov -> Maimakterion
    11: 5, // Dec -> Poseideon
    0: 6,  // Jan -> Gamelion
    1: 7,  // Feb -> Anthesterion
    2: 8,  // Mar -> Elaphebolion
    3: 9,  // Apr -> Mounichion
    4: 10, // May -> Thargelion
    5: 11  // Jun -> Skirophorion
  };
  return mapping[month] ?? 0;
};

// Format day within the 3-decade system
const formatAtticDay = (dayOfMonth: number, monthLength: number): { short: string; full: string; spanishShort: string; spanishFull: string } => {
  if (dayOfMonth === 1) {
    return { short: "Νουμηνία", full: "Νουμηνία", spanishShort: "Día 1 (Novilunio)", spanishFull: "Luna Nueva" };
  }

  if (dayOfMonth <= 10) {
    // Μὴν ἱστάμενος (waxing, days 1-10)
    const ordinal = GREEK_DAY_ORDINALS[dayOfMonth] || dayOfMonth.toString();
    return {
      short: `${ordinal} ἱσταμένου`,
      full: `Ἡμέρα ${ordinal} τοῦ μηνὸς ἱσταμένου`,
      spanishShort: `Día ${dayOfMonth} creciente`,
      spanishFull: `Día ${dayOfMonth} de la luna creciente`
    };
  }

  if (dayOfMonth <= 20) {
    // Μὴν μεσῶν (middle, days 11-20)
    if (dayOfMonth === 20) {
      return {
        short: `εἰκάς`,
        full: `εἰκάς`,
        spanishShort: `Día 20 (Eikas)`,
        spanishFull: `Día 20 (la vigésima)`
      };
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

  // Μὴν φθίνων (waning, days 21-29/30) — counted backwards!
  if (dayOfMonth === monthLength) {
    return { short: "ἕνη καὶ νέα", full: "Ἕνη καὶ Νέα", spanishShort: "Mes viejo y nuevo", spanishFull: "Último día (vieja y nueva luna)" };
  }
  
  // Count backwards from 30 regardless of month length (so day 21 is always 10th waning)
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
}

export const getAtticDate = (date: Date): AtticDateResult => {
  const newMoon = findNewMoon(date);

  // Day of month = days since the last new moon + 1 (Noumenia = day 1)
  const diffMs = date.getTime() - newMoon.getTime();
  const dayOfMonth = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  // Approximate month length (29 or 30 days — alternating hollow/full months)
  const monthIndex = getAtticMonthIndex(newMoon);
  const monthLength = monthIndex % 2 === 0 ? 30 : 29; // Full months (30) for even indices, hollow (29) for odd

  const monthData = ATTIC_MONTHS[monthIndex];
  const dayFormatted = formatAtticDay(Math.min(dayOfMonth, monthLength), monthLength);

  return {
    short: `${dayFormatted.short}, ${monthData.name}`,
    full: `${dayFormatted.full}, μηνὸς ${monthData.name}`,
    spanishShort: `${dayFormatted.spanishShort}, mes de ${monthData.name}`,
    spanishFull: `${dayFormatted.spanishFull}, mes de ${monthData.name} (${monthData.latin})`,
    monthName: monthData.name,
    dayOfMonth: Math.min(dayOfMonth, monthLength),
    monthIndex
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

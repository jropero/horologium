// --- START OF FILE horologium-main/utils/romanTimeUtils.ts ---

import { getSunTimes, getMoonPhase } from './solar';
import { RomanTimeData, CivilDayPart } from '../types';

export const LATIN_HOURS_DAY = [
  "Prima Hora", "Secunda Hora", "Tertia Hora", "Quarta Hora",
  "Quinta Hora", "Sexta Hora", "Septima Hora", "Octava Hora",
  "Nona Hora", "Decima Hora", "Undecima Hora", "Duodecima Hora"
];

export const LATIN_HOURS_NIGHT_FULL = [
  "Prima Hora Noctis", "Secunda Hora Noctis", "Tertia Hora Noctis", "Quarta Hora Noctis",
  "Quinta Hora Noctis", "Sexta Hora Noctis", "Septima Hora Noctis", "Octava Hora Noctis",
  "Nona Hora Noctis", "Decima Hora Noctis", "Undecima Hora Noctis", "Duodecima Hora Noctis"
];

export const MONTH_NAMES_LATIN = [
  "Ianuarius", "Februarius", "Martius", "Aprilis", "Maius", "Iunius",
  "Iulius", "Augustus", "September", "October", "November", "December"
];

export const LATIN_WEEKDAYS = [
  "Dies Solis", "Dies Lunae", "Dies Martis", "Dies Mercurii", "Dies Iovis", "Dies Veneris", "Dies Saturni"
];

const MONTH_ABBREVS = [
  "Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTH_NAMES_ACCUSATIVE = [
  "Ianuarias", "Februarias", "Martias", "Apriles", "Maias", "Iunias",
  "Iulias", "Augustas", "Septembres", "Octobres", "Novembres", "Decembres"
];

const MONTH_NAMES_ABLATIVE = [
  "Ianuariis", "Februariis", "Martiis", "Aprilibus", "Maiis", "Iuniis",
  "Iuliis", "Augustis", "Septembribus", "Octobribus", "Novembribus", "Decembribus"
];

const LATIN_ORDINALS: { [key: number]: string } = {
  2: "pridie",
  3: "tertium",
  4: "quartum",
  5: "quintum",
  6: "sextum",
  7: "septimum",
  8: "octavum",
  9: "nonum",
  10: "decimum",
  11: "undecimum",
  12: "duodecimum",
  13: "tertium decimum",
  14: "quartum decimum",
  15: "quintum decimum",
  16: "sextum decimum",
  17: "septimum decimum",
  18: "duodevicesimum",
  19: "undevicesimum"
};

export const PLANETARY_HOURS_ORDER = [
  "Saturnus", "Iuppiter", "Mars", "Sol", "Venus", "Mercurius", "Luna"
];

const DAY_START_INDEX = [3, 6, 2, 5, 1, 4, 0];

// `date` is the sunrise that opened the planetary day; with `lng` its weekday is
// taken at the observer's mean local solar time (independent of device timezone).
export const getPlanetaryRuler = (currentRomanHour: number, isDay: boolean, date: Date, lng?: number): string => {
  const dayOfWeek = lng === undefined ? date.getDay() : new Date(date.getTime() + lng * 240000).getUTCDay();
  const startIndex = DAY_START_INDEX[dayOfWeek];
  let hoursPassed = currentRomanHour - 1;
  if (!isDay) hoursPassed += 12;
  const rulerIndex = (startIndex + hoursPassed) % 7;
  return PLANETARY_HOURS_ORDER[rulerIndex];
};

export const toRoman = (num: number): string => {
  const lookup: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let roman = '';
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
};

// TUTELA_MENSIS (Deidades patronas de los meses)
// Basado principalmente en Manilio (Astronomica II.433-452) quien asigna deidades a los signos zodiacales.
// Nota: La correspondencia mes-deidad es una convención moderna aproximada, ya que en la antigüedad
// la tutela aplicaba a los signos zodiacales (ej. Júpiter rige Sagitario, no julio directamente).
const TUTELA_MENSIS = [
  "Iuno", "Neptunus", "Minerva", "Venus", "Apollo", "Mercurius",
  "Iuppiter", "Ceres", "Vulcanus", "Mars", "Diana", "Vesta"
];

// NUEVO: Calcular la Indicción (Ciclo de 15 años)
export const getIndiction = (year: number): number => {
  let indiction = (year + 3) % 15;
  if (indiction === 0) indiction = 15;
  return indiction;
};

// Calculado con declinación en caso Ablativo ("Sol in...")
export const getZodiacSign = (date: Date): string => {
  const d = date.getDate();
  const m = date.getMonth(); // 0-11
  if ((m === 2 && d >= 21) || (m === 3 && d <= 19)) return "Ariete";      // Aries
  if ((m === 3 && d >= 20) || (m === 4 && d <= 20)) return "Tauro";       // Taurus
  if ((m === 4 && d >= 21) || (m === 5 && d <= 20)) return "Geminis";     // Gemini (Abl. pl.)
  if ((m === 5 && d >= 21) || (m === 6 && d <= 22)) return "Cancro";      // Cancer
  if ((m === 6 && d >= 23) || (m === 7 && d <= 22)) return "Leone";       // Leo
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Virgine";     // Virgo
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Libra";       // Libra
  if ((m === 9 && d >= 23) || (m === 10 && d <= 21)) return "Scorpione";  // Scorpio
  if ((m === 10 && d >= 22) || (m === 11 && d <= 21)) return "Sagittario";// Sagittarius
  if ((m === 11 && d >= 22) || (m === 0 && d <= 19)) return "Capricorno"; // Capricornus
  if ((m === 0 && d >= 20) || (m === 1 && d <= 18)) return "Aquario";     // Aquarius
  return "Piscibus";                                                      // Pisces (Abl. pl.)
};

// ── Civil date in the calendar the Romans actually used ───────────────────────
// JS Dates are proleptic Gregorian. Before the Gregorian reform (15 Oct 1582,
// JDN 2299161) the Roman date must be computed from the Julian calendar date,
// whose leap rule (every 4th year) also differs from the Gregorian one.
export interface CivilDateParts {
  year: number;
  month: number; // 0-11
  day: number;   // 1-31
  isJulian: boolean;
}

const GREGORIAN_REFORM_JDN = 2299161;

const gregorianToJDN = (y: number, m1: number, d: number): number => {
  const a = Math.floor((14 - m1) / 12);
  const yy = y + 4800 - a;
  const mm = m1 + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4)
    - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
};

const jdnToJulian = (jdn: number): { year: number; month: number; day: number } => {
  const c = jdn + 32082;
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10) - 1,
    year: d - 4800 + Math.floor(m / 10),
  };
};

/** Local civil date parts, converted to the Julian calendar before 1582-10-15. */
export const getCivilDateParts = (date: Date): CivilDateParts => {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const jdn = gregorianToJDN(y, m + 1, d);
  if (jdn >= GREGORIAN_REFORM_JDN) return { year: y, month: m, day: d, isJulian: false };
  return { ...jdnToJulian(jdn), isJulian: true };
};

export const isCivilLeapYear = (parts: CivilDateParts): boolean =>
  parts.isJulian
    ? parts.year % 4 === 0
    : (parts.year % 4 === 0 && parts.year % 100 !== 0) || parts.year % 400 === 0;

const daysInCivilMonth = (parts: CivilDateParts): number => {
  if (parts.month === 1) return isCivilLeapYear(parts) ? 29 : 28;
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][parts.month];
};

/**
 * Key into ROMAN_YEAR_DATA ("month-day", 0-based month) for a civil date.
 * In leap years the bissextile day is the doubled a.d. VI Kal. Mar. Modern
 * convention: 24 Feb = a.d. bis VI Kal. Mar. (served by the "1-29" Dies Bissextus
 * entry), and 25-29 Feb take the entries of the common-year days 24-28
 * (so Regifugium falls on 25 Feb and Equirria on 28 Feb).
 */
export const getRomanYearDataKey = (date: Date): string => {
  const p = getCivilDateParts(date);
  if (p.month === 1 && isCivilLeapYear(p)) {
    if (p.day === 24) return '1-29';
    if (p.day > 24) return `1-${p.day - 1}`;
  }
  return `${p.month}-${p.day}`;
};

export interface RomanDateResult {
  short: string;
  full: string;
}

export const getRomanDate = (date: Date): RomanDateResult => {
  const civil = getCivilDateParts(date);
  const { month, year } = civil;
  let day = civil.day;
  const aucYear = year + 753;
  const indiction = getIndiction(year);

  const isMarchMayJulyOct = [2, 4, 6, 9].includes(month);
  const nonesDate = isMarchMayJulyOct ? 7 : 5;
  const idesDate = isMarchMayJulyOct ? 15 : 13;



  let romanString = "";
  let fullLatinString = "";
  let refName = "";

  if (day === 1) {
    romanString = `Kalendis ${MONTH_ABBREVS[month]}`;
    fullLatinString = `Kalendis ${MONTH_NAMES_ABLATIVE[month]}`;
  } else if (day < nonesDate) {
    const daysBefore = nonesDate - day + 1;
    refName = `Non ${MONTH_ABBREVS[month]}`;
    if (daysBefore === 2) {
      romanString = `Pridie ${refName}`;
      fullLatinString = `Pridie Nonas ${MONTH_NAMES_ACCUSATIVE[month]}`;
    } else {
      romanString = `a.d. ${toRoman(daysBefore)} ${refName}`;
      fullLatinString = `Ante diem ${LATIN_ORDINALS[daysBefore]} Nonas ${MONTH_NAMES_ACCUSATIVE[month]}`;
    }
  } else if (day === nonesDate) {
    romanString = `Nonis ${MONTH_ABBREVS[month]}`;
    fullLatinString = `Nonis ${MONTH_NAMES_ABLATIVE[month]}`;
  } else if (day < idesDate) {
    const daysBefore = idesDate - day + 1;
    refName = `Id ${MONTH_ABBREVS[month]}`;
    if (daysBefore === 2) {
      romanString = `Pridie ${refName}`;
      fullLatinString = `Pridie Idus ${MONTH_NAMES_ACCUSATIVE[month]}`;
    } else {
      romanString = `a.d. ${toRoman(daysBefore)} ${refName}`;
      fullLatinString = `Ante diem ${LATIN_ORDINALS[daysBefore]} Idus ${MONTH_NAMES_ACCUSATIVE[month]}`;
    }
  } else if (day === idesDate) {
    romanString = `Idibus ${MONTH_ABBREVS[month]}`;
    fullLatinString = `Idibus ${MONTH_NAMES_ABLATIVE[month]}`;
  } else if (month === 1 && day === 24 && isCivilLeapYear(civil)) {
    // Dies bissextus: the doubled sixth day before the Kalends of March
    romanString = `a.d. bis VI Kal ${MONTH_ABBREVS[2]}`;
    fullLatinString = `Ante diem bis sextum Kalendas ${MONTH_NAMES_ACCUSATIVE[2]}`;
  } else {
    let lastDayOfMonth = daysInCivilMonth(civil);
    if (month === 1 && lastDayOfMonth === 29) {
      // After the bissextile day, count as in a common year (25 Feb = a.d. VI)
      lastDayOfMonth = 28;
      if (day > 24) day -= 1;
    }
    const daysBefore = (lastDayOfMonth - day) + 1 + 1;
    const nextMonthIdx = (month + 1) % 12;
    refName = `Kal ${MONTH_ABBREVS[nextMonthIdx]}`;

    if (daysBefore === 2) {
      romanString = `Pridie ${refName}`;
      fullLatinString = `Pridie Kalendas ${MONTH_NAMES_ACCUSATIVE[nextMonthIdx]}`;
    } else {
      romanString = `a.d. ${toRoman(daysBefore)} ${refName}`;
      fullLatinString = `Ante diem ${LATIN_ORDINALS[daysBefore]} Kalendas ${MONTH_NAMES_ACCUSATIVE[nextMonthIdx]}`;
    }
  }

  return {
    short: `${romanString} anno ${toRoman(aucYear)} A.U.C.`,
    full: `${fullLatinString} anno ab urbe condita ${toRoman(aucYear)}, Indictione ${toRoman(indiction)}`
  };
};

const getLatinMoonPhaseName = (phase: number): string => {
  if (phase < 0.03 || phase > 0.97) return "Novilunium";
  if (phase < 0.22) return "Luna Corniculata";
  if (phase < 0.28) return "Prima Quadra";
  if (phase < 0.47) return "Gibbosa crescens";
  if (phase < 0.53) return "Plenilunium";
  if (phase < 0.72) return "Gibbosa decrescens";
  if (phase < 0.78) return "Ultima Quadra";
  return "Luna Corniculata";
};

const getVigilia = (romanHour: number): { name: string, desc: string } => {
  if (romanHour <= 3) return { name: "Prima Vigilia", desc: "Primera Guardia" };
  if (romanHour <= 6) return { name: "Secunda Vigilia", desc: "Segunda Guardia" };
  if (romanHour <= 9) return { name: "Tertia Vigilia", desc: "Tercera Guardia" };
  return { name: "Quarta Vigilia", desc: "Cuarta Guardia" };
};

/** Nundinal letter that marks the market day (nundinae) in this app's cycle. */
export const NUNDINAE_LETTER = 'C';

export const getNundinalLetter = (date: Date): string => {
  // Count whole days of the LOCAL civil date (the Roman day began at midnight),
  // not UTC days, so the letter changes at local midnight in every timezone.
  const utcMidnight = new Date(0);
  utcMidnight.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceEpoch = Math.round(utcMidnight.getTime() / (1000 * 60 * 60 * 24));
  // Usamos módulo 8 para ciclar entre 0 y 7. El (+ 8) asegura que no haya negativos.
  const nundinalIndex = (daysSinceEpoch % 8 + 8) % 8;
  const nundinalLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return nundinalLetters[nundinalIndex];
};

const getCivilDayPart = (isDay: boolean, hourFloat: number): CivilDayPart => {
  // División civil del día romano según Varrón (De Lingua Latina VI) y Censorino (De Die Natali XXIV)
  // hourFloat va de 0.0 (inicio del período) a 12.0 (final del período)
  if (isDay) {
    // DÍA: 12 horas solares desde el amanecer (ortus solis) hasta la puesta (solis occasus)
    if (hourFloat < 2.5)  return { name: "Mane", desc: "Mañana temprana" };
    if (hourFloat < 5.5)  return { name: "Ad Meridiem", desc: "Hacia el mediodía" };
    if (hourFloat < 6.5)  return { name: "Meridies", desc: "Mediodía" };
    if (hourFloat < 10.5) return { name: "De Meridie", desc: "Después del mediodía" };
    return { name: "Suprema", desc: "Última hora de luz" };
  } else {
    // NOCHE: 12 horas solares desde la puesta (solis occasus) hasta el amanecer (ortus solis)
    if (hourFloat < 1.5)  return { name: "Vespera", desc: "Anochecer" };
    if (hourFloat < 2.5)  return { name: "Crepusculum", desc: "Crepúsculo" };
    if (hourFloat < 3.5)  return { name: "Prima fax", desc: "Encendido de antorchas" };
    if (hourFloat < 5.0)  return { name: "Concubia nox", desc: "Hora de dormir" };
    if (hourFloat < 5.8)  return { name: "Intempesta nox", desc: "Noche profunda y muerta" };
    if (hourFloat < 6.2)  return { name: "Media nox", desc: "Medianoche" };
    if (hourFloat < 8.0)  return { name: "De media nocte", desc: "Tras la medianoche" };
    if (hourFloat < 9.5)  return { name: "Gallicinium", desc: "Canto del gallo" };
    if (hourFloat < 11.0) return { name: "Conticinium", desc: "Silencio (el gallo calla)" };
    return { name: "Diluculum", desc: "Primer resplandor del alba" };
  }
};

interface SunEvent {
  time: Date;
  type: 'sunrise' | 'sunset';
}

export const calculateRomanTime = (now: Date, lat: number, lng: number): RomanTimeData => {
  const points: SunEvent[] = [];

  for (let i = -2; i <= 2; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const { sunrise, sunset } = getSunTimes(d, lat, lng);
    points.push({ time: sunrise, type: 'sunrise' });
    points.push({ time: sunset, type: 'sunset' });
  }

  points.sort((a, b) => a.time.getTime() - b.time.getTime());

  let currentEvent = points[0];
  let nextEvent = points[1];
  let found = false;

  for (let i = 0; i < points.length - 1; i++) {
    if (now >= points[i].time && now < points[i + 1].time) {
      currentEvent = points[i];
      nextEvent = points[i + 1];
      found = true;
      break;
    }
  }

  if (!found) {
    if (now < points[0].time) {
      currentEvent = { time: new Date(points[0].time.getTime() - 12 * 60 * 60 * 1000), type: points[0].type === 'sunrise' ? 'sunset' : 'sunrise' };
      nextEvent = points[0];
    } else {
      currentEvent = points[points.length - 1];
      nextEvent = { time: new Date(points[points.length - 1].time.getTime() + 12 * 60 * 60 * 1000), type: points[points.length - 1].type === 'sunrise' ? 'sunset' : 'sunrise' };
    }
  }

  const isDay = currentEvent.type === 'sunrise';
  const baseTime = currentEvent.time;
  const endTime = nextEvent.time;

  // Latest sunrise at or before the start of the current period: the sunrise
  // that opened this planetary day (by night, the sunrise before this sunset).
  const prevSunrise = isDay
    ? baseTime
    : [...points].reverse().find(p => p.type === 'sunrise' && p.time < baseTime)?.time
      || new Date(baseTime.getTime() - 12 * 3600 * 1000);

  let nextSunriseDisplay = endTime;
  if (isDay) {
    const nextSr = points.find((p, idx) => idx > points.indexOf(nextEvent) && p.type === 'sunrise');
    if (nextSr) nextSunriseDisplay = nextSr.time;
  }

  const durationMs = endTime.getTime() - baseTime.getTime();
  const hourLengthMinutes = (durationMs / 1000 / 60) / 12;

  const elapsedMs = now.getTime() - baseTime.getTime();
  const elapsedMinutes = elapsedMs / 1000 / 60;

  let romanHour = Math.floor(elapsedMinutes / hourLengthMinutes) + 1;

  if (romanHour > 12) romanHour = 12;
  if (romanHour < 1) romanHour = 1;

  const hourName = isDay
    ? LATIN_HOURS_DAY[romanHour - 1]
    : LATIN_HOURS_NIGHT_FULL[romanHour - 1];

  // NEW: Calculate exactly where we are continuously from 0.0 to 12.0
  const hourFloat = elapsedMinutes / hourLengthMinutes;
  const civilDayPart = getCivilDayPart(isDay, hourFloat);

  const vigilia = !isDay ? getVigilia(romanHour) : undefined;
  const nundinalLetter = getNundinalLetter(now);

  const moonPhase = getMoonPhase(now);
  const moonPhaseLabel = getLatinMoonPhaseName(moonPhase);
  const dateInfo = getRomanDate(now);

  return {
    romanHour,
    isDay,
    hourName,
    hourLengthMinutes,
    sunrise: prevSunrise,
    sunset: isDay ? endTime : baseTime,
    nextSunrise: nextSunriseDisplay,
    romanDateString: dateInfo.short,
    romanDateFull: dateInfo.full,
    moonPhase,
    moonPhaseLabel,
    // The planetary day runs sunrise to sunrise: night hours (incl. those after
    // midnight) belong to the weekday of the preceding sunrise.
    planetaryRuler: getPlanetaryRuler(romanHour, isDay, prevSunrise, lng),
    civilDayPart,
    vigilia,
    nundinalLetter,
    isMarketDay: nundinalLetter === NUNDINAE_LETTER,
    dayOfWeek: LATIN_WEEKDAYS[now.getDay()],
    indiction: getIndiction(getCivilDateParts(now).year),
    tutelaMensis: TUTELA_MENSIS[now.getMonth()],
    zodiacSign: getZodiacSign(now)
  };
};
// --- END OF FILE horologium-main/utils/romanTimeUtils.ts ---
// babylonianCalendarUtils.ts — Babylonian temporal hours, lunisolar calendar & planetary hours
// Day starts at SUNSET (Babylonian civil convention).
// Temporal hour math mirrors hellenicTimeUtils.ts (Meeus/NOAA solar engine).

import { getSunTimes, getMoonPhase, springEquinoxJDE } from './solar';
import {
  getLunarYearStart, getLunarYearMonths, civilDayStart, civilDaysBetween,
  positionInYear, daytimeOfCivilDay,
} from './lunarCivilCalendar';
import { RomanTimeData, CivilDayPart } from '../types';
import { BabylonianDate, BABYLONIAN_MONTHS, BABYLONIAN_MONTH_REGENTS } from '../types/babylonia';
import type { CivilCalendarYear, CivilCalendarMonth, CivilCalendarDay } from '../types/civilCalendar';

// ─── Constants ───────────────────────────────────────────────────────────────

const SYNODIC_MONTH = 29.530588853;

// Minimum moon age (days after conjunction) before the crescent can be visible.
// At 0.75 days (18 h) the moon has enough elongation to be seen at sunset.
const CRESCENT_MIN_AGE = 0.75;

// ─── Planetary rulers (Chaldean order) ───────────────────────────────────────

const PLANETARY_HOURS_AKK = ['Ninurta', 'Marduk', 'Nergal', 'Šamaš', 'Ištar', 'Nabû', 'Sîn'];
const PLANETARY_HOURS_EN  = ['Saturn',  'Jupiter', 'Mars',  'Sun',   'Venus', 'Mercury', 'Moon'];
const DAY_START_INDEX = [3, 6, 2, 5, 1, 4, 0]; // Sun=0…Sat=6

// ─── Akkadian ordinals ────────────────────────────────────────────────────────

const AKKADIAN_ORDINALS = [
  'ištēn', 'šinā', 'šalāš', 'erbē', 'ḫamiš', 'šeš',
  'sebe', 'samāne', 'tiš', 'eser', 'ḫaddašer', 'šinalšer'
];

// ─── Month regents ────────────────────────────────────────────────────────────
// Canonical monthly regents live in types/babylonia.ts (BABYLONIAN_MONTH_REGENTS);
// the descriptions below follow that same order.

const MONTH_REGENT_DESCS = [
  'Anu, señor del cielo, y Enlil, señor del aire y de la tierra, comparten la regencia del primer mes: el de la renovación del año y el retorno de la vida.',
  'Ea (Enki), dios de las aguas dulces, la sabiduría y las artes mágicas, patrón de artesanos y exorcistas, rige el segundo mes, el de la siembra.',
  'Sîn (Nanna), dios de la luna y señor del cómputo del tiempo y del calendario, rige el tercer mes.',
  'Ninurta (Ninib), dios del arado y de la guerra victoriosa, vencedor del Anzû, rige el cuarto mes.',
  'Ningishzida, señor del Árbol de la Verdad y guardián de las puertas del Inframundo, rige el quinto mes.',
  'Ištar (Inanna), señora del amor, la guerra y el planeta Venus, rige el sexto mes.',
  'Šamaš (Utu), dios del sol, juez de los vivos y protector de la justicia, rige el séptimo mes.',
  'Marduk, rey de los dioses de Babilonia y señor de los destinos, rige el octavo mes.',
  'Nergal, señor del Inframundo, de la peste y de la guerra, rige el noveno mes.',
  'Papsukkal, visir y mensajero de los grandes dioses, rige el décimo mes.',
  'Adad (Ramman), dios de la tormenta, la lluvia y el trueno, rige el undécimo mes.',
  'Los Sebitti, los Siete dioses guerreros hijos de Anu que marchan al frente de Erra, rigen el duodécimo mes.',
];

// ─── Year engine (crescent months, sunset-to-sunset days) ─────────────────────
// Nisannu 1 begins at the first sunset on or after the spring equinox at which
// the new crescent is visible from the observer's location. Every later month
// begins at the next crescent sunset (see utils/lunarCivilCalendar.ts).

const jdToDate = (jd: number): Date => new Date((jd - 2440587.5) * 86400000);
const DAY_MS = 86400000;

/** Sunset that begins Nisannu 1 of the Babylonian year anchored in `gregYear`. */
export const getNisannu1 = (gregYear: number, lat: number, lng: number): Date =>
  getLunarYearStart('bab', CRESCENT_MIN_AGE, jdToDate(springEquinoxJDE(gregYear)), lat, lng);

const babYearMonths = (anchorGregYear: number, lat: number, lng: number): Date[] =>
  getLunarYearMonths('bab', CRESCENT_MIN_AGE, getNisannu1(anchorGregYear, lat, lng), getNisannu1(anchorGregYear + 1, lat, lng), lat, lng);

const monthsInYear = (anchorGregYear: number, lat: number, lng: number): number =>
  Math.round(civilDaysBetween(getNisannu1(anchorGregYear, lat, lng), getNisannu1(anchorGregYear + 1, lat, lng)) / SYNODIC_MONTH);

/** Babylonian year/month/day of the civil day containing `date`. */
const locateBabylonianDay = (date: Date, lat: number, lng: number) => {
  const dayStart = civilDayStart(date, lat, lng);
  let anchor = dayStart.getFullYear();
  if (dayStart.getTime() + 3 * 3600000 < getNisannu1(anchor, lat, lng).getTime()) anchor--;
  const months = babYearMonths(anchor, lat, lng);
  return { anchor, months, ...positionInYear(months, dayStart) };
};

// ─── Derived helpers ──────────────────────────────────────────────────────────

const getBabylonianZodiac = (date: Date): string => {
  const d = date.getDate();
  const m = date.getMonth();
  if ((m === 2 && d >= 21) || (m === 3 && d <= 19)) return 'Agru';
  if ((m === 3 && d >= 20) || (m === 4 && d <= 20)) return 'Gudanna';
  if ((m === 4 && d >= 21) || (m === 5 && d <= 20)) return 'Mastabbagalgal';
  if ((m === 5 && d >= 21) || (m === 6 && d <= 22)) return 'Pulukku';
  if ((m === 6 && d >= 23) || (m === 7 && d <= 22)) return 'Urgula';
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'Širu';
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'Zibanitu';
  if ((m === 9 && d >= 23) || (m === 10 && d <= 21)) return 'Zuqaqīpu';
  if ((m === 10 && d >= 22) || (m === 11 && d <= 21)) return 'Pabilsag';
  if ((m === 11 && d >= 22) || (m === 0 && d <= 19)) return 'Suḫurmāšu';
  if ((m === 0 && d >= 20) || (m === 1 && d <= 18)) return 'Gula';
  return 'Zibbātu';
};

const getBabylonianMoonPhaseName = (phase: number): string => {
  if (phase < 0.03 || phase > 0.97) return 'Ittu ša Sîn';
  if (phase < 0.22) return 'Urḫu';
  if (phase < 0.28) return 'Nanduru';
  if (phase < 0.47) return 'Šupûtu';
  if (phase < 0.53) return 'Ūm Babbar';
  if (phase < 0.72) return 'Napharu';
  if (phase < 0.78) return 'Šalšu';
  return 'Qīštu';
};

// Weekday at the observer's mean local solar time (independent of device timezone).
const observerWeekday = (t: Date, lng: number): number =>
  new Date(t.getTime() + lng * 240000).getUTCDay();

// `periodStart` = the sunrise (day) or sunset (night) that opened the current
// 12-hour period; its local weekday is the planetary day.
const getBabylonianPlanetaryRuler = (
  currentHour: number, isDay: boolean, periodStart: Date, lng: number
): { name: string; nameEn: string } => {
  const dayOfWeek = observerWeekday(periodStart, lng);
  const startIndex = DAY_START_INDEX[dayOfWeek];
  let hoursPassed = currentHour - 1;
  if (!isDay) hoursPassed += 12;
  const rulerIndex = (startIndex + hoursPassed) % 7;
  return { name: PLANETARY_HOURS_AKK[rulerIndex], nameEn: PLANETARY_HOURS_EN[rulerIndex] };
};

const getWatch = (hour: number, isDay: boolean): { watch: number; name: string; desc: string } => {
  if (isDay) {
    if (hour <= 4) return { watch: 1, name: 'Ṣēru', desc: 'Guardia matutina' };
    if (hour <= 8) return { watch: 2, name: 'Mušlālu', desc: 'Guardia del mediodía' };
    return { watch: 3, name: 'Liwītu', desc: 'Guardia vespertina' };
  }
  if (hour <= 4) return { watch: 1, name: 'Maṣṣartu Ūli', desc: 'Primera guardia nocturna' };
  if (hour <= 8) return { watch: 2, name: 'Maṣṣartu Qabli', desc: 'Guardia de medianoche' };
  return { watch: 3, name: 'Maṣṣartu Arkītu', desc: 'Última guardia' };
};

const getBabylonianCivilDayPart = (isDay: boolean, hourFloat: number): CivilDayPart => {
  if (isDay) {
    if (hourFloat < 1.0)  return { name: 'Šēr Ūmi',       desc: 'Alba' };
    if (hourFloat < 4.0)  return { name: 'Ina Āli šēri',  desc: 'Mañana' };
    if (hourFloat < 6.5)  return { name: 'Mušlālu',       desc: 'Mediodía' };
    if (hourFloat < 10.0) return { name: 'Ina Āli kalāmi',desc: 'Tarde' };
    return                       { name: 'Erēb Šamši',    desc: 'Ocaso' };
  }
  if (hourFloat < 4.0) return { name: 'Rīš Mūši',  desc: 'Inicio de la noche' };
  if (hourFloat < 8.0) return { name: 'Qabli Mūši', desc: 'Medianoche' };
  return                      { name: 'Šēr Mūši',   desc: 'Antes del alba' };
};

// ─── Shared sun-events helper (mirrors hellenicTimeUtils) ─────────────────────

interface SunEvent { time: Date; type: 'sunrise' | 'sunset'; }

const buildSunEvents = (now: Date, lat: number, lng: number): SunEvent[] => {
  const points: SunEvent[] = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const { sunrise, sunset } = getSunTimes(d, lat, lng);
    points.push({ time: sunrise, type: 'sunrise' });
    points.push({ time: sunset,  type: 'sunset'  });
  }
  points.sort((a, b) => a.time.getTime() - b.time.getTime());
  return points;
};

// ─── Public: getBabylonianCalendarMeta ───────────────────────────────────────

export interface BabylonianCalendarMeta {
  nisannu1Date: Date;
  springEquinoxDate: Date;
  driftDays: number;          // days Nisannu 1 fell after spring equinox (0–30)
  isIntercalaryYear: boolean;
  nextYearIsIntercalary: boolean;
  monthLengthDays: number;    // 29 or 30
  metonicPosition: number;    // 1–19
  intercalaryPositions: number[]; // which positions in the 19-year cycle are intercalary
  seYear: number;
}

export const getBabylonianCalendarMeta = (date: Date, lat: number, lng: number): BabylonianCalendarMeta => {
  const { anchor, months, monthLength } = locateBabylonianDay(date, lat, lng);
  const seYear = anchor + 311;

  const nisannu1Date = daytimeOfCivilDay(months[0]);
  const springEquinoxDate = jdToDate(springEquinoxJDE(anchor));
  const driftDays = Math.max(0, Math.round((months[0].getTime() - springEquinoxDate.getTime()) / DAY_MS));

  const isIntercalaryYear = months.length - 1 === 13;
  const nextYearIsIntercalary = monthsInYear(anchor + 1, lat, lng) === 13;

  // Metonic cycle position (1–19)
  const metonicPosition = ((seYear - 1) % 19) + 1;

  // Which positions in the current 19-year cycle are intercalary
  const cycleStartAnchor = anchor - metonicPosition + 1;
  const intercalaryPositions: number[] = [];
  for (let pos = 1; pos <= 19; pos++) {
    if (monthsInYear(cycleStartAnchor + pos - 1, lat, lng) === 13) intercalaryPositions.push(pos);
  }

  return {
    nisannu1Date,
    springEquinoxDate,
    driftDays,
    isIntercalaryYear,
    nextYearIsIntercalary,
    monthLengthDays: monthLength,
    metonicPosition,
    intercalaryPositions,
    seYear,
  };
};

// ─── Public: getBabylonianDate ────────────────────────────────────────────────

export const getBabylonianDate = (date: Date, lat: number, lng: number): BabylonianDate => {
  // Temporal hour calculation (same engine as Hellenic)
  const points = buildSunEvents(date, lat, lng);

  let currentEvent = points[0];
  let nextEvent = points[1];

  for (let i = 0; i < points.length - 1; i++) {
    if (date >= points[i].time && date < points[i + 1].time) {
      currentEvent = points[i];
      nextEvent = points[i + 1];
      break;
    }
  }

  const isDay = currentEvent.type === 'sunrise';
  const durationMs = nextEvent.time.getTime() - currentEvent.time.getTime();
  const hourLengthMs = durationMs / 12;
  const elapsedMs = date.getTime() - currentEvent.time.getTime();
  let temporalHour = Math.floor(elapsedMs / hourLengthMs) + 1;
  if (temporalHour > 12) temporalHour = 12;
  if (temporalHour < 1)  temporalHour = 1;

  const hourFloat = elapsedMs / hourLengthMs;
  const dayProgress = Math.min(Math.max(hourFloat / 12, 0), 1);

  const hourName = isDay
    ? `Māšaltu ${AKKADIAN_ORDINALS[temporalHour - 1]}`
    : `Māšaltu ${AKKADIAN_ORDINALS[temporalHour - 1]} ša Mūši`;

  const watchData = getWatch(temporalHour, isDay);

  // Planetary hours run continuously in Chaldean order and the planetary day
  // begins at sunrise, so the night belongs to the weekday of the daylight
  // that preceded it (currentEvent = that evening's sunset).
  const { name: planetaryRuler, nameEn: planetaryRulerEn } =
    getBabylonianPlanetaryRuler(temporalHour, isDay, currentEvent.time, lng);

  const moonPhase = getMoonPhase(date);
  const moonPhaseName = getBabylonianMoonPhaseName(moonPhase);

  // Lunisolar date: the civil day begins at sunset; month and year from the
  // crescent-month engine.
  const { anchor, monthIndex, day: dayInMonth, monthCount } = locateBabylonianDay(date, lat, lng);
  const seYear = anchor + 311;
  const isIntercalary = monthCount === 13 && monthIndex === 12;
  const monthName = isIntercalary ? 'Addaru II' : BABYLONIAN_MONTHS[monthIndex % 12];

  const regentIndex = monthIndex % 12;
  const monthRegent = BABYLONIAN_MONTH_REGENTS[regentIndex];
  const monthRegentDesc = MONTH_REGENT_DESCS[regentIndex];

  return {
    seYear,
    monthName,
    monthIndex,
    day: dayInMonth,
    isIntercalary,
    zodiacSign: getBabylonianZodiac(date),
    planetaryRuler,
    planetaryRulerEn,
    watch: watchData.watch,
    watchName: watchData.name,
    watchDesc: watchData.desc,
    temporalHour,
    hourName,
    isDay,
    moonPhase,
    moonPhaseName,
    dayProgress,
    monthRegent,
    monthRegentDesc,
  };
};

// ─── Public: calculateBabylonianTime ─────────────────────────────────────────
// Returns a RomanTimeData so App.tsx can use the same slot as other civilizations.

export const calculateBabylonianTime = (now: Date, lat: number, lng: number): RomanTimeData => {
  const points = buildSunEvents(now, lat, lng);

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
      currentEvent = {
        time: new Date(points[0].time.getTime() - 12 * 3600 * 1000),
        type: points[0].type === 'sunrise' ? 'sunset' : 'sunrise'
      };
      nextEvent = points[0];
    } else {
      currentEvent = points[points.length - 1];
      nextEvent = {
        time: new Date(points[points.length - 1].time.getTime() + 12 * 3600 * 1000),
        type: points[points.length - 1].type === 'sunrise' ? 'sunset' : 'sunrise'
      };
    }
  }

  const isDay = currentEvent.type === 'sunrise';
  const durationMs = nextEvent.time.getTime() - currentEvent.time.getTime();
  const hourLengthMinutes = durationMs / 1000 / 60 / 12;
  const elapsedMs = now.getTime() - currentEvent.time.getTime();
  const elapsedMinutes = elapsedMs / 1000 / 60;

  let romanHour = Math.floor(elapsedMinutes / hourLengthMinutes) + 1;
  if (romanHour > 12) romanHour = 12;
  if (romanHour < 1)  romanHour = 1;

  const hourFloat = elapsedMinutes / hourLengthMinutes;

  const hourName = isDay
    ? `Māšaltu ${AKKADIAN_ORDINALS[romanHour - 1]}`
    : `Māšaltu ${AKKADIAN_ORDINALS[romanHour - 1]} ša Mūši`;

  const civilDayPart = getBabylonianCivilDayPart(isDay, hourFloat);

  const watchData = getWatch(romanHour, isDay);
  const vigilia = !isDay ? { name: watchData.name, desc: watchData.desc } : undefined;

  const moonPhase = getMoonPhase(now);
  const moonPhaseLabel = getBabylonianMoonPhaseName(moonPhase);

  // Night hours belong to the weekday of the preceding daylight (see getBabylonianDate).
  const { name: planetaryRuler } = getBabylonianPlanetaryRuler(romanHour, isDay, currentEvent.time, lng);

  // Babylonian date string for romanDateString field
  const babDate = getBabylonianDate(now, lat, lng);
  const romanDateString = `${babDate.monthName} ${babDate.day} · SE ${babDate.seYear}`;
  const romanDateFull = `${babDate.day} ${babDate.monthName}, Era Seléucida ${babDate.seYear}`;

  const nextSunriseDisplay: Date = (() => {
    if (isDay) {
      const afterNext = points.find((p, idx) => idx > points.indexOf(nextEvent) && p.type === 'sunrise');
      return afterNext ? afterNext.time : new Date(nextEvent.time.getTime() + 12 * 3600 * 1000);
    }
    return nextEvent.time;
  })();

  return {
    romanHour,
    isDay,
    hourName,
    hourLengthMinutes,
    sunrise: isDay
      ? currentEvent.time
      : ([...points].reverse().find(p => p.type === 'sunrise' && p.time < currentEvent.time)?.time
          ?? new Date(currentEvent.time.getTime() - 12 * 3600 * 1000)),
    sunset: isDay ? nextEvent.time : currentEvent.time,
    nextSunrise: nextSunriseDisplay,
    romanDateString,
    romanDateFull,
    moonPhase,
    moonPhaseLabel,
    planetaryRuler,
    civilDayPart,
    vigilia,
    nundinalLetter: '',
    isMarketDay: false,
    // The weekday is named after the ruler of its first daylight hour.
    dayOfWeek: `Yūm ${PLANETARY_HOURS_AKK[DAY_START_INDEX[observerWeekday(currentEvent.time, lng)]]}`,
    indiction: 0,
    tutelaMensis: BABYLONIAN_MONTH_REGENTS[babDate.monthIndex % 12],
    zodiacSign: getBabylonianZodiac(now),
  };
};

// ─── Annual civil calendar (for the date picker) ───────────────────────────────

/** Gregorian year that anchors the Babylonian year (Nisannu 1) containing `date`. */
export const getBabylonianYearAnchor = (date: Date, lat: number, lng: number): number =>
  locateBabylonianDay(date, lat, lng).anchor;

/**
 * Builds a full Babylonian civil year (Nisannu → next Nisannu) as months of days
 * mapped to Gregorian dates. Each civil day (sunset → sunset) is represented by
 * the noon of its daylight half, so `getBabylonianDate` reports exactly the
 * month/day shown in the picker.
 */
export const getBabylonianCalendarYear = (anchorGregYear: number, lat: number, lng: number): CivilCalendarYear => {
  const starts = babYearMonths(anchorGregYear, lat, lng);
  const totalMonths = starts.length - 1;
  const isIntercalaryYear = totalMonths === 13;
  const seYear = anchorGregYear + 311;

  const months: CivilCalendarMonth[] = [];

  for (let m = 0; m < totalMonths; m++) {
    const isIntercalaryMonth = isIntercalaryYear && m === 12;
    const name = isIntercalaryMonth ? 'Addaru II' : BABYLONIAN_MONTHS[m % 12];
    const length = civilDaysBetween(starts[m], starts[m + 1]);
    const days: CivilCalendarDay[] = [];
    for (let d = 1; d <= length; d++) {
      days.push({ day: d, gregorian: daytimeOfCivilDay(new Date(starts[m].getTime() + (d - 1) * DAY_MS)) });
    }

    months.push({
      key: `bab-${m}`,
      name,
      latin: `Warḫum ${m + 1}`,
      translation: isIntercalaryMonth ? 'Mes intercalar' : `Regente: ${BABYLONIAN_MONTH_REGENTS[m % 12]}`,
      kind: isIntercalaryMonth ? 'intercalary' : 'regular',
      days,
    });
  }

  return {
    anchorGregYear,
    yearLabel: `SE ${seYear}`,
    yearSubtitle: isIntercalaryYear ? 'Año intercalar · 13 meses' : 'Año de 12 meses',
    months,
  };
};

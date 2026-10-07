// babylonianCalendarUtils.ts — Babylonian temporal hours, lunisolar calendar & planetary hours
// Day starts at SUNSET (Babylonian civil convention).
// Temporal hour math mirrors hellenicTimeUtils.ts (Meeus/NOAA solar engine).

import { getSunTimes, getMoonPhase } from './solar';
import { RomanTimeData, CivilDayPart } from '../types';
import { BabylonianDate, BABYLONIAN_MONTHS } from '../types/babylonia';

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

// ─── Month deities ────────────────────────────────────────────────────────────

const MONTH_DEITIES = [
  'Marduk', 'Ea', 'Sîn', 'Dumuzi', 'Gula', 'Ištar',
  'Šamaš', 'Marduk', 'Nabû', 'Šamaš', 'Enlil', 'Anu'
];

const MONTH_DEITY_DESCS = [
  'El gran Akitu celebra el año nuevo y la renovación del cosmos bajo el poder de Marduk.',
  'Ea, señor de las aguas subterráneas y la sabiduría, preside la siembra primaveral.',
  'Sîn, el dios luna, guía la primera cosecha de la cebada bajo su luz plateada.',
  'El lamento de Dumuzi: el dios de la vegetación desciende al inframundo y la tierra llora.',
  'Gula, gran diosa de la medicina, purifica el cuerpo y el espíritu con ritos de sanación.',
  'Ištar, señora del amor y la guerra, recibe ofrendas sagradas en sus grandes templos.',
  'El segundo Akitu conmemora el equinoccio otoñal bajo la protección de Šamaš.',
  'El arado vuelve a la tierra húmeda; Marduk recibe los primeros frutos de la siembra.',
  'Nabû, señor de los escribas, ilumina las noches de Kislīmu con el festival de las lámparas.',
  'Los grandes ritos del solsticio honran a Šamaš en su punto más bajo sobre el horizonte.',
  'Enlil desata las tormentas y los vientos del gran mar del norte sobre las llanuras.',
  'Anu, señor del cielo estrellado, completa el ciclo del año y aguarda el renacimiento.'
];

// ─── Julian Day helpers ───────────────────────────────────────────────────────

const toJD = (date: Date): number =>
  date.getTime() / 86400000 + 2440587.5;

const getSpringEquinoxJD = (year: number): number =>
  2451623.80984 + 365242.37404 * ((year - 2000) / 1000);

// Meeus "Astronomical Algorithms" ch. 47 — true new moon JDE with perturbations.
// Accurate to ~2 minutes; eliminates the ±14 h error of the mean lunation formula.
const trueNewMoonJDE = (k: number): number => {
  const T  = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let JDE = 2451550.09766
    + 29.530588861 * k
    + 0.00015437  * T2
    - 0.000000150 * T3
    + 0.00000000073 * T4;
  const rad = Math.PI / 180;
  const M      = (2.5534      + 29.10535670  * k - 0.0000014  * T2 - 0.00000011   * T3) * rad;
  const Mprime = (201.5643    + 385.81693528 * k + 0.0107582  * T2 + 0.00001238   * T3 - 0.000000058 * T4) * rad;
  const F      = (160.7108    + 390.67050284 * k - 0.0016118  * T2 - 0.00000227   * T3 + 0.000000011 * T4) * rad;
  const Omega  = (124.7746    - 1.56375588   * k + 0.0020672  * T2 + 0.00000215   * T3) * rad;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;
  JDE +=
    -0.40720 * Math.sin(Mprime)
    + 0.17241 * E   * Math.sin(M)
    + 0.01608        * Math.sin(2 * Mprime)
    + 0.01039        * Math.sin(2 * F)
    + 0.00739 * E   * Math.sin(Mprime - M)
    - 0.00514 * E   * Math.sin(Mprime + M)
    + 0.00208 * E2  * Math.sin(2 * M)
    - 0.00111        * Math.sin(Mprime - 2 * F)
    - 0.00057        * Math.sin(Mprime + 2 * F)
    + 0.00056 * E   * Math.sin(2 * Mprime + M)
    - 0.00042        * Math.sin(3 * Mprime)
    + 0.00042 * E   * Math.sin(M + 2 * F)
    + 0.00038 * E   * Math.sin(M - 2 * F)
    - 0.00024 * E   * Math.sin(2 * Mprime - M)
    - 0.00017        * Math.sin(Omega)
    - 0.00007        * Math.sin(Mprime + 2 * M)
    + 0.00004        * Math.sin(2 * Mprime - 2 * F)
    + 0.00004        * Math.sin(3 * M)
    + 0.00003        * Math.sin(Mprime + M - 2 * F)
    + 0.00003        * Math.sin(2 * Mprime + 2 * F)
    - 0.00003        * Math.sin(Mprime + M + 2 * F)
    + 0.00003        * Math.sin(Mprime - M + 2 * F)
    - 0.00002        * Math.sin(Mprime - M - 2 * F)
    - 0.00002        * Math.sin(3 * Mprime + M)
    + 0.00002        * Math.sin(4 * Mprime);
  return JDE;
};

// k index for a given decimal year (year + fractional month).
const kForDecimalYear = (y: number): number => Math.round((y - 2000) * 12.3685);

// First new moon whose crescent (first local sunset ≥ CRESCENT_MIN_AGE after conjunction)
// falls on or after the spring equinox. Uses the observer's GPS location so that
// e.g. a user in Reykjavik vs Auckland gets the astronomically correct sunset reference.
const getNisannu1JD = (gregYear: number, lat: number, lng: number): number => {
  const equinoxJD = getSpringEquinoxJD(gregYear);
  // Start ~35 days before equinox to catch the edge case where the previous lunation's
  // crescent qualifies (new moon before equinox but crescent after).
  const searchStart = equinoxJD - 35;
  const approxYear = 2000 + (searchStart - 2451545.0) / 365.25;
  let k = kForDecimalYear(approxYear) - 1;
  for (let attempt = 0; attempt < 5; attempt++, k++) {
    const conjJD = trueNewMoonJDE(k);
    // Check up to 3 consecutive sunsets until we find one ≥ CRESCENT_MIN_AGE after conjunction.
    for (let offset = 1; offset <= 3; offset++) {
      const checkDate = new Date((conjJD - 2440587.5 + offset) * 86400000);
      const { sunset } = getSunTimes(checkDate, lat, lng);
      const sunsetJD = toJD(sunset);
      if (sunsetJD - conjJD < CRESCENT_MIN_AGE) continue; // moon too young
      if (sunsetJD >= equinoxJD) return conjJD;           // crescent after equinox → Nisannu
      break;                                               // crescent before equinox → next lunation
    }
  }
  // Fallback: first conjunction strictly after equinox (should not normally be reached)
  const approxFallback = 2000 + (equinoxJD - 2451545.0) / 365.25;
  let kf = kForDecimalYear(approxFallback) - 1;
  let nm = trueNewMoonJDE(kf);
  while (nm < equinoxJD) { kf++; nm = trueNewMoonJDE(kf); }
  return nm;
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

const getBabylonianPlanetaryRuler = (
  currentHour: number, isDay: boolean, date: Date
): { name: string; nameEn: string } => {
  const dayOfWeek = date.getDay();
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
  const gregYear = date.getFullYear();

  let nisannu1JD = getNisannu1JD(gregYear, lat, lng);
  const currentJD = toJD(date);
  if (currentJD < nisannu1JD) nisannu1JD = getNisannu1JD(gregYear - 1, lat, lng);

  const nisannu1Date = new Date((nisannu1JD - 2440587.5) * 86400000);
  const nisannuGregYear = nisannu1Date.getFullYear();
  const seYear = nisannuGregYear + 311;

  const equinoxJD = getSpringEquinoxJD(nisannuGregYear);
  const springEquinoxDate = new Date((equinoxJD - 2440587.5) * 86400000);
  const driftDays = Math.max(0, Math.round(nisannu1JD - equinoxJD));

  const nextNisannu1JD = getNisannu1JD(nisannuGregYear + 1, lat, lng);
  const yearLengthMonths = (nextNisannu1JD - nisannu1JD) / SYNODIC_MONTH;
  const isIntercalaryYear = yearLengthMonths > 12.5;

  // Current month length (29 or 30 days)
  const daysSinceNisannu = currentJD - nisannu1JD;
  const monthsSinceNisannu = Math.floor(daysSinceNisannu / SYNODIC_MONTH);
  const thisMonthStart = monthsSinceNisannu * SYNODIC_MONTH;
  const nextMonthStart = (monthsSinceNisannu + 1) * SYNODIC_MONTH;
  const monthLengthDays = Math.round(nextMonthStart) - Math.round(thisMonthStart);

  // Metonic cycle position (1–19)
  const metonicPosition = ((seYear - 1) % 19) + 1;

  // Which positions in the current 19-year cycle are intercalary
  const cycleStartSE = seYear - metonicPosition + 1;
  const intercalaryPositions: number[] = [];
  for (let pos = 1; pos <= 19; pos++) {
    const checkGreg = (cycleStartSE + pos - 1) - 311;
    const checkNisannu = getNisannu1JD(checkGreg, lat, lng);
    const checkNext = getNisannu1JD(checkGreg + 1, lat, lng);
    if ((checkNext - checkNisannu) / SYNODIC_MONTH > 12.5) intercalaryPositions.push(pos);
  }

  // Is the immediately following Babylonian year intercalary?
  const nextNisannu1JD2 = getNisannu1JD(nisannuGregYear + 2, lat, lng);
  const nextYearIsIntercalary = (nextNisannu1JD2 - nextNisannu1JD) / SYNODIC_MONTH > 12.5;

  return {
    nisannu1Date,
    springEquinoxDate,
    driftDays,
    isIntercalaryYear,
    nextYearIsIntercalary,
    monthLengthDays: Math.max(29, Math.min(30, monthLengthDays)),
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
  const { name: planetaryRuler, nameEn: planetaryRulerEn } =
    getBabylonianPlanetaryRuler(temporalHour, isDay, date);

  const moonPhase = getMoonPhase(date);
  const moonPhaseName = getBabylonianMoonPhaseName(moonPhase);

  // ─── Lunisolar calendar ───────────────────────────────────────────────────
  // Babylonian civil day starts at sunset. The "representative Gregorian date"
  // for a Babylonian day is the date of its morning (sunrise portion). At night
  // (after today's sunset OR before tomorrow's sunrise) the next sunrise anchors
  // the JD so that midnight-to-sunrise hours show the same day as the afternoon.
  const calendarDate = isDay ? date : nextEvent.time; // nextEvent = next sunrise at night
  const gregYear = calendarDate.getFullYear();

  // Find this Babylonian year's Nisannu 1
  let nisannu1JD = getNisannu1JD(gregYear, lat, lng);
  const currentJD = toJD(calendarDate);

  if (currentJD < nisannu1JD) {
    // Before this year's Nisannu — we're still in last year's Babylonian year
    nisannu1JD = getNisannu1JD(gregYear - 1, lat, lng);
  }

  // SE year based on which Gregorian year Nisannu 1 falls in
  const nisannuMs = (nisannu1JD - 2440587.5) * 86400000;
  const nisannuGregYear = new Date(nisannuMs).getFullYear();
  const seYear = nisannuGregYear + 311;

  // Months & day within month
  const daysSinceNisannu = currentJD - nisannu1JD;
  const monthsSinceNisannu = Math.floor(daysSinceNisannu / SYNODIC_MONTH);
  const dayInMonth = Math.floor(daysSinceNisannu % SYNODIC_MONTH) + 1;

  // Intercalary year: next Nisannu more than 12.5 months away?
  const nextNisannu1JD = getNisannu1JD(nisannuGregYear + 1, lat, lng);
  const yearLengthMonths = (nextNisannu1JD - nisannu1JD) / SYNODIC_MONTH;
  const isIntercalaryYear = yearLengthMonths > 12.5;
  const totalMonths = isIntercalaryYear ? 13 : 12;

  const monthIndex = Math.min(monthsSinceNisannu, totalMonths - 1);
  const isIntercalary = isIntercalaryYear && monthIndex === 12;
  const monthName = isIntercalary ? 'Addaru II' : BABYLONIAN_MONTHS[monthIndex % 12];

  const deityIndex = monthIndex % 12;
  const monthDeity = MONTH_DEITIES[deityIndex];
  const monthDeityDesc = MONTH_DEITY_DESCS[deityIndex];

  return {
    seYear,
    monthName,
    monthIndex,
    day: Math.max(1, Math.min(dayInMonth, 30)),
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
    monthDeity,
    monthDeityDesc,
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

  const { name: planetaryRuler } = getBabylonianPlanetaryRuler(romanHour, isDay, now);

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
      : (points.find(p => p.type === 'sunrise' && p.time < currentEvent.time)?.time
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
    dayOfWeek: `Yūm ${planetaryRuler}`,
    indiction: 0,
    tutelaMensis: MONTH_DEITIES[babDate.monthIndex % 12],
    zodiacSign: getBabylonianZodiac(now),
  };
};

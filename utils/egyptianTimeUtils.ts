/**
 * egyptianTimeUtils.ts — Egyptian time calculation (Wnwt, Watches)
 * Aligned with Roman/Greek seasonal hours but with Egyptian specifics.
 */

import { Body, Observer, SearchRiseSet } from 'astronomy-engine';
import { getSunTimes, getMoonPhase } from './solar';
import { RomanTimeData, CivilDayPart } from '../types';
import { getEgyptianDate } from './egyptianCalendarUtils';

// Planetary hours (neutral/Latin as it's the Graeco-Roman standard)
const PLANETARY_HOURS_ORDER = [
  "Saturnus", "Iuppiter", "Mars", "Sol", "Venus", "Mercurius", "Luna"
];

const DAY_START_INDEX = [3, 6, 2, 5, 1, 4, 0];

const getPlanetaryRuler = (currentHour: number, isDay: boolean, date: Date): string => {
  const dayOfWeek = date.getDay();
  const startIndex = DAY_START_INDEX[dayOfWeek];
  let hoursPassed = currentHour - 1;
  if (!isDay) hoursPassed += 12;
  const rulerIndex = (startIndex + hoursPassed) % 7;
  return PLANETARY_HOURS_ORDER[rulerIndex];
};

const getEgyptianCivilDayPart = (isDay: boolean, hourFloat: number): CivilDayPart => {
  if (isDay) {
    if (hourFloat < 1.5)  return { name: "Amon-Ra", desc: "Amanecer (Ra triunfante)" };
    if (hourFloat < 4.0)  return { name: "Mañana", desc: "Período matutino" };
    if (hourFloat < 5.5)  return { name: "Hacia el Mediodía", desc: "Ascenso hacia el cenit" };
    if (hourFloat < 6.5)  return { name: "Ra-Horakhty", desc: "Mediodía (Ra en el cenit)" };
    if (hourFloat < 9.0)  return { name: "Tarde temprana", desc: "Descenso de Ra" };
    if (hourFloat < 11.0) return { name: "Atum", desc: "Ocaso (Atum se retira)" };
    return { name: "Crepúsculo", desc: "Hacia el Duat" };
  } else {
    if (hourFloat < 1.5)  return { name: "Crepúsculo", desc: "Entrada al Duat" };
    if (hourFloat < 3.0)  return { name: "Anochecer", desc: "Oscuridad creciente" };
    if (hourFloat < 5.5)  return { name: "Noche Profunda", desc: "Combate en el Duat" };
    if (hourFloat < 6.5)  return { name: "Media Noche", desc: "Séptima hora (Ra en el abismo)" };
    if (hourFloat < 8.0)  return { name: "Tras la Medianoche", desc: "Hacia el renacimiento" };
    if (hourFloat < 10.0) return { name: "Gallicinium", desc: "Canto del gallo (Aviso del alba)" };
    return { name: "Aurora", desc: "Victoria sobre Apep" };
  }
};

const getEgyptianWatch = (hour: number): { name: string, desc: string } => {
  // Ancient Egyptians divided the night into 3 watches (First, Middle, Last)
  if (hour <= 4) return { name: "Primera Guardia", desc: "Reloj de la noche (ẖt-hmt)" };
  if (hour <= 8) return { name: "Segunda Guardia", desc: "Reloj medio (ẖt-hr-ib)" };
  return { name: "Tercera Guardia", desc: "Reloj final (ẖt-pẖr)" };
};

const getLatinMoonPhaseName = (phase: number): string => {
  if (phase < 0.03 || phase > 0.97) return "Luna Nova";
  if (phase < 0.22) return "Luna Crescens";
  if (phase < 0.28) return "Luna Prima";
  if (phase < 0.47) return "Luna Gibbosa";
  if (phase < 0.53) return "Luna Plena";
  if (phase < 0.72) return "Luna Decrecens";
  if (phase < 0.78) return "Luna Ultima";
  return "Luna Cornuta";
};

/**
 * Local-noon Date of the Egyptian civil day containing `now`. The Egyptian day
 * (and the planetary day) begins at SUNRISE, so between local midnight and
 * sunrise it is still the previous calendar day. Every Egyptian date lookup
 * (clock, hero, hemerology, time string) should go through this anchor so
 * they agree on the day boundary.
 */
export const getEgyptianDayAnchor = (now: Date, lat: number, lng: number): Date => {
  // Last sunrise at or before `now` (astronomy-engine searches backwards with a
  // negative limit), taken as a date at the observer's mean local solar time so
  // the result does not depend on the device timezone.
  const rise = SearchRiseSet(Body.Sun, new Observer(lat, lng, 0), +1, new Date(now.getTime() + 1), -2);
  const sunrise = rise ? rise.date : getSunTimes(now, lat, lng).sunrise;
  const observerDate = new Date(sunrise.getTime() + lng * 240000);
  return new Date(observerDate.getUTCFullYear(), observerDate.getUTCMonth(), observerDate.getUTCDate(), 12, 0, 0, 0);
};

interface SunEvent {
  time: Date;
  type: 'sunrise' | 'sunset';
}

export const calculateEgyptianTime = (now: Date, lat: number, lng: number): RomanTimeData => {
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

  let nextSunriseDisplay = endTime;
  if (isDay) {
    const nextSr = points.find((p, idx) => idx > points.indexOf(nextEvent) && p.type === 'sunrise');
    if (nextSr) nextSunriseDisplay = nextSr.time;
  }

  const durationMs = endTime.getTime() - baseTime.getTime();
  const hourLengthMinutes = (durationMs / 1000 / 60) / 12;
  const elapsedMinutes = (now.getTime() - baseTime.getTime()) / 1000 / 60;
  
  let romanHour = Math.floor(elapsedMinutes / hourLengthMinutes) + 1;
  romanHour = Math.max(1, Math.min(12, romanHour));

  const hourFloat = elapsedMinutes / hourLengthMinutes;
  const civilDayPart = getEgyptianCivilDayPart(isDay, hourFloat);
  const vigilia = !isDay ? getEgyptianWatch(romanHour) : undefined;
  
  const moonPhase = getMoonPhase(now);
  
  // Egyptian day (and planetary day) starts at sunrise: one anchor date drives
  // the civil date, the weekday and the planetary-hour sequence, so the
  // Chaldean order runs on unbroken from day hours into the following night.
  const dayAnchor = getEgyptianDayAnchor(now, lat, lng);
  const egyptianDate = getEgyptianDate(dayAnchor);

  return {
    romanHour,
    isDay,
    hourName: `Hora ${romanHour}`,
    hourLengthMinutes,
    sunrise: isDay ? baseTime : [...points].reverse().find(p => p.type === 'sunrise' && p.time < baseTime)?.time || new Date(baseTime.getTime() - 12 * 3600 * 1000),
    sunset: isDay ? endTime : baseTime,
    nextSunrise: nextSunriseDisplay,
    romanDateString: `${egyptianDate.dayOfMonth} de ${egyptianDate.monthName}`,
    romanDateFull: `${egyptianDate.dayOfMonth} de ${egyptianDate.monthName}`,
    atticDate: undefined,
    moonPhase,
    moonPhaseLabel: getLatinMoonPhaseName(moonPhase),
    planetaryRuler: getPlanetaryRuler(romanHour, isDay, dayAnchor),
    civilDayPart,
    vigilia,
    nundinalLetter: '',
    isMarketDay: false,
    dayOfWeek: ['Dies Solis', 'Dies Lunae', 'Dies Martis', 'Dies Mercurii', 'Dies Iovis', 'Dies Veneris', 'Dies Saturni'][dayAnchor.getDay()],
    indiction: 0,
    tutelaMensis: '', 
    zodiacSign: '' 
  };
};

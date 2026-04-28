/**
 * egyptianTimeUtils.ts — Egyptian time calculation (Horai, Vigiliae, Latinized)
 * Reuses solar math but provides Latin terminology for Greek astronomical terms.
 */

import { getSunTimes, getMoonPhase } from './solar';
import { RomanTimeData, CivilDayPart } from '../types';
import { getEgyptianDate } from './egyptianCalendarUtils';

// Latin names for Greek astronomical terms
const PLANETARY_HOURS_LATIN = [
  "Saturnus", "Iuppiter", "Mars", "Sol", "Venus", "Mercurius", "Luna"
];

const DAY_START_INDEX = [3, 6, 2, 5, 1, 4, 0];

const getEgyptianPlanetaryRuler = (currentHour: number, isDay: boolean, date: Date): string => {
  const dayOfWeek = date.getDay();
  const startIndex = DAY_START_INDEX[dayOfWeek];
  let hoursPassed = currentHour - 1;
  if (!isDay) hoursPassed += 12;
  const rulerIndex = (startIndex + hoursPassed) % 7;
  return PLANETARY_HOURS_LATIN[rulerIndex];
};

const getLatinCivilDayPart = (isDay: boolean, hourFloat: number): CivilDayPart => {
  if (isDay) {
    if (hourFloat < 1.5)  return { name: "Diluculum", desc: "Amanecer" };
    if (hourFloat < 4.0)  return { name: "Mane", desc: "Mañana" };
    if (hourFloat < 5.5)  return { name: "Ante Meridiem", desc: "Antes del mediodía" };
    if (hourFloat < 6.5)  return { name: "Meridies", desc: "Mediodía" };
    if (hourFloat < 9.0)  return { name: "Post Meridiem", desc: "Tarde temprana" };
    if (hourFloat < 11.0) return { name: "Vespera", desc: "Atardecer" };
    return { name: "Crepusculum", desc: "Crepúsculo vespertino" };
  } else {
    if (hourFloat < 1.5)  return { name: "Crepusculum", desc: "Anochecer" };
    if (hourFloat < 3.0)  return { name: "Penumbra", desc: "Penumbra" };
    if (hourFloat < 5.0)  return { name: "Nox Profunda", desc: "Noche cerrada" };
    if (hourFloat < 6.5)  return { name: "Media Nox", desc: "Medianoche" };
    if (hourFloat < 8.0)  return { name: "Post Media Nox", desc: "Tras la medianoche" };
    if (hourFloat < 10.0) return { name: "Gallicinium", desc: "Canto del gallo" };
    return { name: "Aurora", desc: "Aurora" };
  }
};

const getVigilia = (romanHour: number): { name: string, desc: string } => {
  if (romanHour <= 3) return { name: "Vigilia I", desc: "Prima Vigilia" };
  if (romanHour <= 6) return { name: "Vigilia II", desc: "Secunda Vigilia" };
  if (romanHour <= 9) return { name: "Vigilia III", desc: "Tertia Vigilia" };
  return { name: "Vigilia IV", desc: "Quarta Vigilia" };
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

export const calculateEgyptianTime = (now: Date, lat: number, lng: number): RomanTimeData => {
  const { sunrise, sunset } = getSunTimes(now, lat, lng);
  const isDay = now >= sunrise && now < sunset;
  
  const baseTime = isDay ? sunrise : (now < sunrise ? new Date(sunrise.getTime() - 24*3600*1000) : sunset);
  const endTime = isDay ? sunset : (now < sunrise ? sunrise : new Date(sunset.getTime() + 24*3600*1000));
  
  const durationMs = endTime.getTime() - baseTime.getTime();
  const hourLengthMinutes = (durationMs / 1000 / 60) / 12;
  const elapsedMinutes = (now.getTime() - baseTime.getTime()) / 1000 / 60;
  
  let romanHour = Math.floor(elapsedMinutes / hourLengthMinutes) + 1;
  romanHour = Math.max(1, Math.min(12, romanHour));

  const civilDayPart = getLatinCivilDayPart(isDay, elapsedMinutes / hourLengthMinutes);
  const vigilia = !isDay ? getVigilia(romanHour) : undefined;
  
  const moonPhase = getMoonPhase(now);
  const egyptianDate = getEgyptianDate(now);

  return {
    romanHour,
    isDay,
    hourName: `Hora ${romanHour}`, // Use a neutral label or the Hour number
    hourLengthMinutes,
    sunrise,
    sunset,
    nextSunrise: now < sunrise ? sunrise : new Date(sunrise.getTime() + 24*3600*1000),
    romanDateString: `${egyptianDate.dayOfMonth} de ${egyptianDate.monthName}`,
    romanDateFull: `${egyptianDate.dayOfMonth} de ${egyptianDate.monthName}`,
    atticDate: undefined,
    moonPhase,
    moonPhaseLabel: getLatinMoonPhaseName(moonPhase),
    planetaryRuler: getEgyptianPlanetaryRuler(romanHour, isDay, now),
    civilDayPart,
    vigilia,
    nundinalLetter: '',
    isMarketDay: false,
    dayOfWeek: ['Dies Solis', 'Dies Lunae', 'Dies Martis', 'Dies Mercurii', 'Dies Iovis', 'Dies Veneris', 'Dies Saturni'][now.getDay()],
    indiction: 0,
    tutelaMensis: '', // We use the Egyptian deity instead
    zodiacSign: '' 
  };
};

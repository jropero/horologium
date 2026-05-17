// hellenicTimeUtils.ts — Greek time calculation (Horai, Phylakai, Olympiad)
// The base solar math (seasonal hours) is identical to Roman — reused from solar.ts

import { getSunTimes, getMoonPhase } from './solar';
import { RomanTimeData, CivilDayPart } from '../types';
import { getAtticDate, AtticDateResult } from './atticCalendarUtils';

// Greek hour names (day) — Ordinals in Ancient Greek
export const GREEK_HOURS_DAY = [
  "Πρώτη Ὥρα", "Δευτέρα Ὥρα", "Τρίτη Ὥρα", "Τετάρτη Ὥρα",
  "Πέμπτη Ὥρα", "Ἕκτη Ὥρα", "Ἑβδόμη Ὥρα", "Ὀγδόη Ὥρα",
  "Ἐνάτη Ὥρα", "Δεκάτη Ὥρα", "Ἑνδεκάτη Ὥρα", "Δωδεκάτη Ὥρα"
];

export const GREEK_HOURS_NIGHT = [
  "Πρώτη Ὥρα Νυκτός", "Δευτέρα Ὥρα Νυκτός", "Τρίτη Ὥρα Νυκτός", "Τετάρτη Ὥρα Νυκτός",
  "Πέμπτη Ὥρα Νυκτός", "Ἕκτη Ὥρα Νυκτός", "Ἑβδόμη Ὥρα Νυκτός", "Ὀγδόη Ὥρα Νυκτός",
  "Ἐνάτη Ὥρα Νυκτός", "Δεκάτη Ὥρα Νυκτός", "Ἑνδεκάτη Ὥρα Νυκτός", "Δωδεκάτη Ὥρα Νυκτός"
];

// Greek weekdays (planetary days — same system, Greek god names)
export const GREEK_WEEKDAYS = [
  "Ἡμέρα Ἡλίου", "Ἡμέρα Σελήνης", "Ἡμέρα Ἄρεως", "Ἡμέρα Ἑρμοῦ",
  "Ἡμέρα Διός", "Ἡμέρα Ἀφροδίτης", "Ἡμέρα Κρόνου"
];

// Planetary hours — same sequence, Greek names
export const PLANETARY_HOURS_GREEK = [
  "Κρόνος", "Ζεύς", "Ἄρης", "Ἥλιος", "Ἀφροδίτη", "Ἑρμῆς", "Σελήνη"
];

const DAY_START_INDEX = [3, 6, 2, 5, 1, 4, 0];

export const getGreekPlanetaryRuler = (currentHour: number, isDay: boolean, date: Date): string => {
  const dayOfWeek = date.getDay();
  const startIndex = DAY_START_INDEX[dayOfWeek];
  let hoursPassed = currentHour - 1;
  if (!isDay) hoursPassed += 12;
  const rulerIndex = (startIndex + hoursPassed) % 7;
  return PLANETARY_HOURS_GREEK[rulerIndex];
};

// Olympiad year calculation (776 BC = Ol. 1, Year 1)
export const getOlympiadYear = (gregorianYear: number): { olympiad: number; year: number; label: string } => {
  const yearsSinceFirstOlympiad = gregorianYear + 775; // 776 BC = year 0 in this system
  const olympiad = Math.floor(yearsSinceFirstOlympiad / 4) + 1;
  const year = (yearsSinceFirstOlympiad % 4) + 1;
  return {
    olympiad,
    year,
    label: `Ὀλ. ${toGreekNumeral(olympiad)}, ἔτος ${year}`
  };
};

// Simple Greek numeral conversion (for display)
const toGreekNumeral = (n: number): string => {
  // For simplicity, use standard numerals with Greek styling for large numbers
  // Ancient Greek used alphabetic numerals (Milesian system)
  if (n <= 0) return '0';

  const units = ['', 'αʹ', 'βʹ', 'γʹ', 'δʹ', 'εʹ', 'ϛʹ', 'ζʹ', 'ηʹ', 'θʹ'];
  const tens = ['', 'ιʹ', 'κʹ', 'λʹ', 'μʹ', 'νʹ', 'ξʹ', 'οʹ', 'πʹ', 'ϟʹ'];
  const hundreds = ['', 'ρʹ', 'σʹ', 'τʹ', 'υʹ', 'φʹ', 'χʹ', 'ψʹ', 'ωʹ', 'ϡʹ'];

  if (n < 10) return units[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return (tens[t] + (u > 0 ? units[u] : '')).replace(/ʹ(?=.*ʹ)/g, '');
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    const result = hundreds[h] + (rest > 0 ? toGreekNumeral(rest) : '');
    return result.replace(/ʹ(?=.*ʹ)/g, '');
  }
  // For numbers >= 1000, just use the number directly
  return n.toString();
};

// Greek zodiac signs
export const getGreekZodiacSign = (date: Date): string => {
  const d = date.getDate();
  const m = date.getMonth();
  if ((m === 2 && d >= 21) || (m === 3 && d <= 19)) return "Κριῷ";         // Aries
  if ((m === 3 && d >= 20) || (m === 4 && d <= 20)) return "Ταύρῳ";        // Taurus
  if ((m === 4 && d >= 21) || (m === 5 && d <= 20)) return "Διδύμοις";     // Gemini
  if ((m === 5 && d >= 21) || (m === 6 && d <= 22)) return "Καρκίνῳ";      // Cancer
  if ((m === 6 && d >= 23) || (m === 7 && d <= 22)) return "Λέοντι";       // Leo
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Παρθένῳ";      // Virgo
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Ζυγῷ";         // Libra
  if ((m === 9 && d >= 23) || (m === 10 && d <= 21)) return "Σκορπίῳ";     // Scorpio
  if ((m === 10 && d >= 22) || (m === 11 && d <= 21)) return "Τοξότῃ";     // Sagittarius
  if ((m === 11 && d >= 22) || (m === 0 && d <= 19)) return "Αἰγοκέρωτι";  // Capricorn
  if ((m === 0 && d >= 20) || (m === 1 && d <= 18)) return "Ὑδροχόῳ";     // Aquarius
  return "Ἰχθύσι";                                                         // Pisces
};

// Greek moon phase names
const getGreekMoonPhaseName = (phase: number): string => {
  if (phase < 0.03 || phase > 0.97) return "Νουμηνία";             // New Moon / Noumenia
  if (phase < 0.22) return "Μηνοειδής αὐξάνουσα";                  // Waxing Crescent
  if (phase < 0.28) return "Πρώτη Τετράς";                         // First Quarter (Dichotomia)
  if (phase < 0.47) return "Ἀμφίκυρτος αὐξάνουσα";                // Waxing Gibbous
  if (phase < 0.53) return "Πανσέληνος";                            // Full Moon
  if (phase < 0.72) return "Ἀμφίκυρτος φθίνουσα";                 // Waning Gibbous 
  if (phase < 0.78) return "Τελευταία Τετράς";                     // Last Quarter
  return "Μηνοειδής φθίνουσα";                                     // Waning Crescent
};

// Greek civil day parts (inspired by Athenian daily rhythms)
const getGreekCivilDayPart = (isDay: boolean, hourFloat: number): CivilDayPart => {
  if (isDay) {
    if (hourFloat < 1.5)  return { name: "Ὄρθρος", desc: "Amanecer" };
    if (hourFloat < 4.0)  return { name: "Ἀγορὰ πλήθουσα", desc: "Mercado lleno" };
    if (hourFloat < 5.5)  return { name: "Πρὸ μεσημβρίας", desc: "Antes del mediodía" };
    if (hourFloat < 6.5)  return { name: "Μεσημβρία", desc: "Mediodía" };
    if (hourFloat < 9.0)  return { name: "Δείλη πρωΐα", desc: "Primera tarde" };
    if (hourFloat < 11.0) return { name: "Δείλη ὀψία", desc: "Atardecer tardío" };
    return { name: "Ἑσπέρα", desc: "Crepúsculo vespertino" };
  } else {
    if (hourFloat < 1.5)  return { name: "Ἑσπέρα", desc: "Anochecer" };
    if (hourFloat < 3.0)  return { name: "Λυκόφως", desc: "Penumbra" };
    if (hourFloat < 5.0)  return { name: "Ἀκρόνυξ", desc: "Noche cerrada" };
    if (hourFloat < 6.5)  return { name: "Μεσονύκτιον", desc: "Medianoche" };
    if (hourFloat < 8.0)  return { name: "Μετὰ μεσονύκτιον", desc: "Tras la medianoche" };
    if (hourFloat < 10.0) return { name: "Ἀλεκτρυόνων ᾠδή", desc: "Canto del gallo" };
    return { name: "Ἕως", desc: "Aurora" };
  }
};

// Night watches — Phylakai (Greeks typically used 3 watches, sometimes 4)
const getPhylake = (romanHour: number): { name: string, desc: string } => {
  if (romanHour <= 4) return { name: "Πρώτη Φυλακή", desc: "Primera Guardia" };
  if (romanHour <= 8) return { name: "Δευτέρα Φυλακή", desc: "Segunda Guardia" };
  return { name: "Τρίτη Φυλακή", desc: "Tercera Guardia" };
};

// Greek month patron deities
const TUTELA_MENSIS_GREEK = [
  "Ποσειδῶν", "Ἀθηνᾶ", "Ἄρης", "Ἀφροδίτη", "Ἀπόλλων", "Ἑρμῆς",
  "Ζεύς", "Δημήτηρ", "Ἥφαιστος", "Ἄρτεμις", "Ἑστία", "Ἥρα"
];

interface SunEvent {
  time: Date;
  type: 'sunrise' | 'sunset';
}

export const calculateHellenicTime = (now: Date, lat: number, lng: number): RomanTimeData => {
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

  const elapsedMs = now.getTime() - baseTime.getTime();
  const elapsedMinutes = elapsedMs / 1000 / 60;

  let romanHour = Math.floor(elapsedMinutes / hourLengthMinutes) + 1;
  if (romanHour > 12) romanHour = 12;
  if (romanHour < 1) romanHour = 1;

  const hourName = isDay
    ? GREEK_HOURS_DAY[romanHour - 1]
    : GREEK_HOURS_NIGHT[romanHour - 1];

  const hourFloat = elapsedMinutes / hourLengthMinutes;
  const civilDayPart = getGreekCivilDayPart(isDay, hourFloat);
  const vigilia = !isDay ? getPhylake(romanHour) : undefined;

  const moonPhase = getMoonPhase(now);
  const moonPhaseLabel = getGreekMoonPhaseName(moonPhase);
  
  // The Attic day starts at sunset.
  // Use the real sunset time from the solar engine: when isDay is false,
  // baseTime IS the sunset. We compare against today's sunset to determine
  // if we've crossed into the next Attic day.
  const todaySunset = isDay ? endTime : baseTime;
  const isAfterSunset = now >= todaySunset && !isDay;
  const atticDate = getAtticDate(now, isAfterSunset);

  const olympiad = getOlympiadYear(now.getFullYear());

  return {
    romanHour,
    isDay,
    hourName,
    hourLengthMinutes,
    sunrise: isDay ? baseTime : points.find(p => p.type === 'sunrise' && p.time < baseTime)?.time || new Date(baseTime.getTime() - 12 * 3600 * 1000),
    sunset: isDay ? endTime : baseTime,
    nextSunrise: nextSunriseDisplay,
    romanDateString: `${atticDate.short} ${olympiad.label}`,
    romanDateFull: atticDate.full,
    atticDate,
    moonPhase,
    moonPhaseLabel,
    planetaryRuler: getGreekPlanetaryRuler(romanHour, isDay, now),
    civilDayPart,
    vigilia,
    nundinalLetter: '', // Greeks didn't use nundinal letters
    isMarketDay: false,
    dayOfWeek: GREEK_WEEKDAYS[now.getDay()],
    indiction: 0,
    tutelaMensis: TUTELA_MENSIS_GREEK[now.getMonth()],
    zodiacSign: getGreekZodiacSign(now)
  };
};

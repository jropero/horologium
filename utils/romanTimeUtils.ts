import { getSunTimes, getMoonPhase } from './solar';
import { RomanTimeData } from '../types';

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

// Abbreviations for the Roman date (Accusative/Ablative nuances handled by generic 'Kal/Non/Id')
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
  2: "pridie", // Special case
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

// Chaldean Order: Saturn (slowest) -> Moon (fastest)
export const PLANETARY_HOURS_ORDER = [
  "Saturnus",  // 0 - Saturday
  "Iuppiter",  // 1 - Thursday
  "Mars",      // 2 - Tuesday
  "Sol",       // 3 - Sunday
  "Venus",     // 4 - Friday
  "Mercurius", // 5 - Wednesday
  "Luna"       // 6 - Monday
];

// Starting index in the Chaldean order for each day of week (0=Sunday ... 6=Saturday)
// JS Date.getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// Map JS Day Index -> Index in PLANETARY_HOURS_ORDER
const DAY_START_INDEX = [
  3, // Sun -> Sol
  6, // Mon -> Luna
  2, // Tue -> Mars
  5, // Wed -> Mercurius
  1, // Thu -> Iuppiter
  4, // Fri -> Venus
  0  // Sat -> Saturnus
];

export const getPlanetaryRuler = (currentRomanHour: number, isDay: boolean, date: Date): string => {
  const dayOfWeek = date.getDay(); // 0-6
  const startIndex = DAY_START_INDEX[dayOfWeek];

  // Total hours passed since sunrise
  // Day hours: 1 to 12. Offset = hour - 1
  // Night hours: 1 to 12 (follow day 12). Offset = 12 + (hour - 1)

  let hoursPassed = currentRomanHour - 1;
  if (!isDay) {
    hoursPassed += 12;
  }

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

export interface RomanDateResult {
  short: string;
  full: string;
}

export const getRomanDate = (date: Date): RomanDateResult => {
  const day = date.getDate();
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();

  // Months with Nones on the 7th and Ides on the 15th (March, May, July, October)
  const isMarchMayJulyOct = [2, 4, 6, 9].includes(month);
  const nonesDate = isMarchMayJulyOct ? 7 : 5;
  const idesDate = isMarchMayJulyOct ? 15 : 13;

  let romanString = "";
  let fullLatinString = "";
  let refName = "";

  // Determine the reference point (Kalends, Nones, Ides)
  if (day === 1) {
    romanString = `Kalendis ${MONTH_ABBREVS[month]}`;
    fullLatinString = `Kalendis ${MONTH_NAMES_ABLATIVE[month]}`;
  } else if (day < nonesDate) {
    // Before Nones
    const daysBefore = nonesDate - day + 1; // Inclusive count
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
    // Before Ides
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
  } else {
    // Before Kalends of NEXT month
    const nextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const daysBefore = (lastDayOfMonth - day) + 1 + 1; // Remaining days + 1 for next month start + 1 for inclusive count

    // Handle Dec -> Jan year change logic implicitly by Date object, but for string we need correct month index
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

  // Append Year if desired
  return {
    short: `${romanString} ${toRoman(year)}`,
    full: fullLatinString
  };
};

const getLatinMoonPhaseName = (phase: number): string => {
  // Approximate phase names
  if (phase < 0.03 || phase > 0.97) return "Novilunium"; // New
  if (phase < 0.22) return "Luna Corniculata"; // Waxing Crescent (Horned)
  if (phase < 0.28) return "Prima Quadra"; // First Quarter
  if (phase < 0.47) return "Gibbosa crescens"; // Waxing Gibbous
  if (phase < 0.53) return "Plenilunium"; // Full
  if (phase < 0.72) return "Gibbosa menguans"; // Waning Gibbous
  if (phase < 0.78) return "Ultima Quadra"; // Last Quarter
  return "Luna Corniculata"; // Waning Crescent
};

interface SunEvent {
  time: Date;
  type: 'sunrise' | 'sunset';
}

export const calculateRomanTime = (now: Date, lat: number, lng: number): RomanTimeData => {
  // Generate sun times for a range of days (T-2 to T+2)
  const points: SunEvent[] = [];

  for (let i = -2; i <= 2; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const { sunrise, sunset } = getSunTimes(d, lat, lng);
    points.push({ time: sunrise, type: 'sunrise' });
    points.push({ time: sunset, type: 'sunset' });
  }

  // Sort events chronologically
  points.sort((a, b) => a.time.getTime() - b.time.getTime());

  // Find the interval containing 'now'
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

  // Next Sunrise logic
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

  // Moon Phase Calculation
  const moonPhase = getMoonPhase(now);
  const moonPhaseLabel = getLatinMoonPhaseName(moonPhase);

  const dateInfo = getRomanDate(now);

  return {
    romanHour,
    isDay,
    hourName,
    hourLengthMinutes,
    sunrise: isDay ? baseTime : points.find(p => p.type === 'sunrise' && p.time < baseTime)?.time || new Date(baseTime.getTime() - 12 * 3600 * 1000),
    sunset: isDay ? endTime : baseTime,
    nextSunrise: nextSunriseDisplay,
    romanDateString: dateInfo.short,
    romanDateFull: dateInfo.full,
    moonPhase,
    moonPhaseLabel,
    planetaryRuler: getPlanetaryRuler(romanHour, isDay, now)
  };
};
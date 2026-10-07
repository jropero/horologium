import { DefineStar, SearchRiseSet, Body, Observer } from 'astronomy-engine';
import { getMoonPhase } from './solar';

export interface AlgolState {
  phase: number;
  isEclipsed: boolean;
  stateText: string;
}

/**
 * Calculates the phase of Algol based on the astronomical ephemeris.
 * While the Egyptians recorded a period of 2.85 days, the true modern period
 * is 2.867328 days. We use the real period and a known modern epoch (T0) 
 * to calculate the exact position today.
 */
export const getAlgolPhase = (date: Date): AlgolState => {
  // Convert standard date to Julian Date
  const DAY_MS = 1000 * 60 * 60 * 24;
  const J1970 = 2440587.5;
  const jd = date.getTime() / DAY_MS + J1970;

  // Modern Astronomical Ephemeris for Algol (Beta Persei)
  // T0: Known modern epoch of primary minimum (JD 2452253.567)
  const T0 = 2452253.567; 
  // P: Orbital period in days
  const P = 2.867328;

  // Calculate cycles elapsed since T0
  const cycles = (jd - T0) / P;
  
  // The fractional part is the phase (0.0 to 1.0)
  let phase = cycles % 1;
  if (phase < 0) phase += 1;

  // Algol's primary eclipse lasts approx. 9.6 hours.
  // We use a 15% window for the "danger zone" (primary minimum).
  // The minimum occurs at phase 0.0.
  const isEclipsed = phase >= 0.925 || phase <= 0.075;

  return {
    phase,
    isEclipsed,
    stateText: isEclipsed 
      ? "El Ojo de Horus se oscurece (Mínimo estelar)" 
      : "El Ojo de Horus brilla con fuerza"
  };
};

/**
 * Wrapper for solar moon phase, exported for Egyptian context.
 */
export const getLunarPhase = (date: Date): number => {
  return getMoonPhase(date);
};

export interface AlgolEclipse {
  date: Date;
  isPast: boolean;
}

/**
 * Gets a list of past and future Algol eclipses relative to the given date.
 */
export const getAlgolEclipses = (currentDate: Date, pastCount: number, futureCount: number): AlgolEclipse[] => {
  const DAY_MS = 1000 * 60 * 60 * 24;
  const J1970 = 2440587.5;
  const jdCurrent = currentDate.getTime() / DAY_MS + J1970;
  
  const T0 = 2452253.567; 
  const P = 2.867328;

  const currentCycle = Math.floor((jdCurrent - T0) / P);
  const eclipses: AlgolEclipse[] = [];

  for (let i = currentCycle - pastCount + 1; i <= currentCycle + futureCount; i++) {
    const eclipseJD = T0 + i * P;
    const eclipseTime = (eclipseJD - J1970) * DAY_MS;
    eclipses.push({
      date: new Date(eclipseTime),
      isPast: eclipseTime <= currentDate.getTime()
    });
  }

  return eclipses;
};

export const isAlgolEclipsed = (date: Date): boolean => {
  const DAY_MS = 1000 * 60 * 60 * 24;
  const J1970 = 2440587.5;
  const jd = date.getTime() / DAY_MS + J1970;
  const T0 = 2452253.567; 
  const P = 2.867328;
  const cycles = (jd - T0) / P;
  let phase = cycles % 1;
  if (phase < 0) phase += 1;
  return phase >= 0.925 || phase <= 0.075;
};

// ── Sopdet (Sirius) heliacal rising ───────────────────────────────────────────
// RA=6h 45.1m, Dec=-16.716°, distance=8.6 ly (distance in light-years converted to parsecs * 3.26)
const SIRIUS_RA_H = 6.7525;
const SIRIUS_DEC_DEG = -16.7161;
const SIRIUS_DIST_LY = 8600; // astronomy-engine uses light-years for DefineStar

export interface SopdetEvent {
  rising: Date;
  setting: Date;
  daysSinceRising: number;
  phase: 'visible' | 'invisible';
}

let _sopdetCache: { key: string; result: SopdetEvent } | null = null;

// Heliacal rising: first morning the star rises within THRESHOLD minutes before sunrise.
// Heliacal setting: last evening the star sets within THRESHOLD minutes after sunset.
const THRESHOLD_MIN = 60;
const DAY_MS = 86400000;

function findHeliacalRising(year: number, observer: Observer): Date | null {
  // Sirius heliacal rising at inhabited latitudes falls between May and September
  let d = new Date(year, 4, 1);
  for (let i = 0; i < 180; i++) {
    const midnight = new Date(d); midnight.setHours(0, 0, 0, 0);
    const sr = SearchRiseSet(Body.Sun,   observer, +1, midnight, 1);
    const tr = SearchRiseSet(Body.Star1, observer, +1, midnight, 1);
    if (sr && tr) {
      const diff = (sr.date.getTime() - tr.date.getTime()) / 60000;
      if (diff > 0 && diff < THRESHOLD_MIN) return new Date(d);
    }
    d = new Date(d.getTime() + DAY_MS);
  }
  return null;
}

function findHeliacalSetting(year: number, observer: Observer): Date | null {
  // Heliacal setting (last visibility before disappearing into Sun's glare): April–July
  let d = new Date(year, 3, 1);
  for (let i = 0; i < 120; i++) {
    const noon = new Date(d); noon.setHours(12, 0, 0, 0);
    const ss = SearchRiseSet(Body.Sun,   observer, -1, noon, 1);
    const ts = SearchRiseSet(Body.Star1, observer, -1, noon, 1);
    if (ss && ts) {
      const diff = (ts.date.getTime() - ss.date.getTime()) / 60000;
      if (diff > 0 && diff < THRESHOLD_MIN) return new Date(d);
    }
    d = new Date(d.getTime() + DAY_MS);
  }
  return null;
}

export const getSopdetHeliacalEvent = (date: Date, lat: number, lng: number): SopdetEvent => {
  const year = date.getFullYear();
  const cacheKey = `${year}-${Math.round(lat * 10)}-${Math.round(lng * 10)}`;
  if (_sopdetCache?.key === cacheKey) return _sopdetCache.result;

  DefineStar(Body.Star1, SIRIUS_RA_H, SIRIUS_DEC_DEG, SIRIUS_DIST_LY);
  const observer = new Observer(lat, lng, 0);

  const rising  = findHeliacalRising(year,  observer) ?? findHeliacalRising(year - 1, observer) ?? new Date(year, 6, 19);
  const setting = findHeliacalSetting(year, observer) ?? findHeliacalSetting(year - 1, observer) ?? new Date(year, 5, 1);

  const today = new Date(date); today.setHours(0, 0, 0, 0);
  const risingDay  = new Date(rising);  risingDay.setHours(0, 0, 0, 0);
  const settingDay = new Date(setting); settingDay.setHours(0, 0, 0, 0);

  const daysSinceRising = Math.floor((today.getTime() - risingDay.getTime()) / DAY_MS);
  // Invisible window: setting (≈June) → rising (≈July), both within same year, setting < rising
  const phase: 'visible' | 'invisible' = (today >= settingDay && today < risingDay) ? 'invisible' : 'visible';

  const result: SopdetEvent = { rising, setting, daysSinceRising, phase };
  _sopdetCache = { key: cacheKey, result };
  return result;
};

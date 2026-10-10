import { DefineStar, SearchRiseSet, Body, Observer, Equator, Horizon } from 'astronomy-engine';
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
const ALGOL_T0 = 2452253.567; // JD of known primary minimum
const ALGOL_P  = 2.867328;    // orbital period in days
const ALGOL_ECLIPSE_HW = 0.075; // half-width of eclipse window as fraction of period

// Algol (Beta Persei): RA 3h 8m 10.1s, Dec +40° 57' 20", ~92.8 ly
const ALGOL_RA_H    = 3.13614;
const ALGOL_DEC_DEG = 40.9556;
const ALGOL_DIST_LY = 92.8;

export const getAlgolPhase = (date: Date): AlgolState => {
  const DAY_MS = 1000 * 60 * 60 * 24;
  const J1970 = 2440587.5;
  const jd = date.getTime() / DAY_MS + J1970;
  const cycles = (jd - ALGOL_T0) / ALGOL_P;
  let phase = cycles % 1;
  if (phase < 0) phase += 1;
  const isEclipsed = phase >= (1 - ALGOL_ECLIPSE_HW) || phase <= ALGOL_ECLIPSE_HW;
  return {
    phase,
    isEclipsed,
    stateText: isEclipsed
      ? "El Ojo de Horus se oscurece (Mínimo estelar)"
      : "El Ojo de Horus brilla con fuerza"
  };
};

export interface AlgolDailyData {
  phase: number;              // 0.0–1.0 within the 2.867-day cycle
  nextMinimumInHours: number; // hours until next eclipse minimum
  lastMinimumAgoHours: number;// hours since last eclipse minimum
  estimatedMagnitude: number; // 2.1 (bright) to 3.4 (at minimum)
  isEclipsing: boolean;
  periodDays: number;
  riseTime: Date | null;
  setTime: Date | null;
  transitTime: Date | null;
  altitudeAtMidnight: number;
}

export const getAlgolDailyData = (date: Date, lat: number, lng: number): AlgolDailyData => {
  const DAY_MS = 1000 * 60 * 60 * 24;
  const J1970 = 2440587.5;
  const jd = date.getTime() / DAY_MS + J1970;

  // Eclipse phase
  const cycles = (jd - ALGOL_T0) / ALGOL_P;
  let phase = cycles % 1;
  if (phase < 0) phase += 1;

  const nextCycleN = Math.ceil(cycles);
  const lastCycleN = Math.floor(cycles);
  const nextMinimumInHours  = (ALGOL_T0 + nextCycleN * ALGOL_P - jd) * 24;
  const lastMinimumAgoHours = (jd - (ALGOL_T0 + lastCycleN * ALGOL_P)) * 24;

  const distFromMin = Math.min(phase, 1 - phase);
  const isEclipsing = distFromMin <= ALGOL_ECLIPSE_HW;
  let estimatedMagnitude: number;
  if (isEclipsing) {
    const t = distFromMin / ALGOL_ECLIPSE_HW;
    estimatedMagnitude = 2.1 + 1.3 * Math.cos(t * Math.PI / 2);
  } else {
    estimatedMagnitude = 2.1;
  }

  // Positional data via astronomy-engine (Body.Star2 = Algol)
  DefineStar(Body.Star2, ALGOL_RA_H, ALGOL_DEC_DEG, ALGOL_DIST_LY);
  const observer = new Observer(lat, lng, 0);

  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);

  const riseResult = SearchRiseSet(Body.Star2, observer, +1, midnight, 1);
  const setResult  = SearchRiseSet(Body.Star2, observer, -1, midnight, 1);
  const riseTime   = riseResult?.date ?? null;
  const setTime    = setResult?.date  ?? null;
  const transitTime = (riseTime && setTime)
    ? new Date((riseTime.getTime() + setTime.getTime()) / 2)
    : null;

  const tonightMidnight = new Date(midnight.getTime() + DAY_MS);
  const altitudeAtMidnight = Horizon(tonightMidnight, observer, ALGOL_RA_H, ALGOL_DEC_DEG, 'normal').altitude;

  return { phase, nextMinimumInHours, lastMinimumAgoHours, estimatedMagnitude, isEclipsing, periodDays: ALGOL_P,
           riseTime, setTime, transitTime, altitudeAtMidnight };
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

  const currentCycle = Math.floor((jdCurrent - ALGOL_T0) / ALGOL_P);
  const eclipses: AlgolEclipse[] = [];

  for (let i = currentCycle - pastCount + 1; i <= currentCycle + futureCount; i++) {
    const eclipseJD = ALGOL_T0 + i * ALGOL_P;
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
  const cycles = (jd - ALGOL_T0) / ALGOL_P;
  let phase = cycles % 1;
  if (phase < 0) phase += 1;
  return phase >= (1 - ALGOL_ECLIPSE_HW) || phase <= ALGOL_ECLIPSE_HW;
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

// ── Sopdet daily astronomical data ───────────────────────────────────────────

export interface SiriusDailyData {
  riseTime: Date | null;
  setTime: Date | null;
  transitTime: Date | null;   // midpoint of rise/set, approximate meridian transit
  altitudeAtMidnight: number; // degrees above horizon at local midnight (negative = below)
  elongation: number;         // angular separation from the Sun in degrees
}

export const getSiriusDailyData = (date: Date, lat: number, lng: number): SiriusDailyData => {
  DefineStar(Body.Star1, SIRIUS_RA_H, SIRIUS_DEC_DEG, SIRIUS_DIST_LY);
  const observer = new Observer(lat, lng, 0);

  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);

  const riseResult = SearchRiseSet(Body.Star1, observer, +1, midnight, 1);
  const setResult  = SearchRiseSet(Body.Star1, observer, -1, midnight, 1);

  const riseTime = riseResult?.date ?? null;
  const setTime  = setResult?.date ?? null;

  let transitTime: Date | null = null;
  if (riseTime && setTime) {
    transitTime = new Date((riseTime.getTime() + setTime.getTime()) / 2);
  }

  // Altitude at tonight's midnight (start of next calendar day)
  const tonightMidnight = new Date(midnight.getTime() + DAY_MS);
  const horizCoords = Horizon(tonightMidnight, observer, SIRIUS_RA_H, SIRIUS_DEC_DEG, 'normal');
  const altitudeAtMidnight = horizCoords.altitude;

  // Angular separation from the Sun via spherical law of cosines
  const sunEq = Equator(Body.Sun, date, observer, true, true);
  const toRad = Math.PI / 180;
  const ra1  = sunEq.ra  * 15 * toRad;
  const dec1 = sunEq.dec * toRad;
  const ra2  = SIRIUS_RA_H    * 15 * toRad;
  const dec2 = SIRIUS_DEC_DEG * toRad;
  const cosAngle = Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra1 - ra2);
  const elongation = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180 / Math.PI;

  return { riseTime, setTime, transitTime, altitudeAtMidnight, elongation };
};

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

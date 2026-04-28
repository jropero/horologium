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


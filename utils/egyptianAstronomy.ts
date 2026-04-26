// egyptianAstronomy.ts — Egyptian Archaeoastronomy
// Based on PLOS ONE (2015): "Did the Ancient Egyptians Record the Period of the Eclipsing Binary Algol?"
// Updated with precise modern ephemeris for accurate real-time prediction.

export interface AlgolState {
  phase: number;
  isEclipsed: boolean;
  stateText: string;
}

/**
 * Calculates the phase of Algol based on the astronomical ephemeris.
 * While the Egyptians recorded a period of 2.85 days, the true modern period
 * is 2.867328 days. We use the real period and a known epoch (T0) to calculate 
 * the exact position today.
 */
export const getAlgolPhase = (date: Date): AlgolState => {
  // Convert standard date to Julian Date
  const DAY_MS = 1000 * 60 * 60 * 24;
  const J1970 = 2440587.5;
  const jd = date.getTime() / DAY_MS + J1970;

  // Astronomical Ephemeris for Algol (Beta Persei)
  // T0: Known epoch of primary minimum in Julian Date (e.g., JD 2440953.4657)
  const T0 = 2440953.4657; 
  // P: Orbital period in days
  const P = 2.867328;

  // Calculate cycles elapsed since T0
  const cycles = (jd - T0) / P;
  
  // The fractional part is the phase (0.0 to 1.0)
  let phase = cycles % 1;
  if (phase < 0) phase += 1;

  // Algol's primary eclipse (minimum brightness) lasts about 9.6 hours.
  // In a 2.867 day cycle, 9.6 hours is approximately 14% of the cycle.
  // The minimum occurs precisely at phase 0.0. 
  // We define the eclipse window as +/- 7% from phase 0.0.
  const isEclipsed = phase >= 0.93 || phase <= 0.07;

  return {
    phase,
    isEclipsed,
    stateText: isEclipsed 
      ? "El Ojo de Horus se oscurece (Mínimo estelar)" 
      : "El Ojo de Horus brilla con fuerza"
  };
};

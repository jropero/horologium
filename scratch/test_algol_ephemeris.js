const DAY_MS = 1000 * 60 * 60 * 24;
const J1970 = 2440587.5;

// Convert Date to Julian Date
const toJulianDate = (date) => date.getTime() / DAY_MS + J1970;

const getAlgolPhase = (date) => {
  // Astronomical Ephemeris for Algol (Beta Persei)
  // T0: Known epoch of primary minimum in Julian Date
  const T0 = 2440953.4657; 
  // P: Orbital period in days
  const P = 2.867328;

  const jd = toJulianDate(date);
  
  // Calculate cycles elapsed since T0
  const cycles = (jd - T0) / P;
  
  // The fractional part is the phase
  let phase = cycles % 1;
  if (phase < 0) phase += 1; // Normalize to 0-1 range

  // Algol's primary eclipse lasts about 9.6 hours.
  // In a 2.867 day cycle, 9.6 hours is approx 14% of the cycle.
  // The minimum occurs at phase 0 (or 1). 
  // So eclipse is roughly between phase 0.93 and 0.07.
  const isEclipsed = phase >= 0.93 || phase <= 0.07;

  return { jd, phase, isEclipsed };
};

console.log("Now (2026-04-26 18:00):", getAlgolPhase(new Date(2026, 3, 26, 18, 0, 0)));

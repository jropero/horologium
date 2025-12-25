// A robust implementation of solar calculations based on Astronomical Algorithms (Meeus/NOAA).
// Improves precision by accounting for atmospheric refraction (-0.833°), solar angular diameter,
// and equation of time variability.

// Constants
const PI = Math.PI;
const RAD = PI / 180;
const DEG = 180 / PI;

// Date/Time constants
const J1970 = 2440588;
const J2000 = 2451545;
const DAY_MS = 1000 * 60 * 60 * 24;

// Obliquity of the Earth
const e = RAD * 23.4397;

// Helper functions for date conversion
const toJulian = (date: Date) => date.valueOf() / DAY_MS - 0.5 + J1970;
const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * DAY_MS);
const toDays = (date: Date) => toJulian(date) - J2000;

// Sun position calculations
const getRightAscension = (l: number, b: number) => {
  return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
};

const getDeclination = (l: number, b: number) => {
  return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
};

const getSolarMeanAnomaly = (d: number) => {
  return RAD * (357.5291 + 0.98560028 * d);
};

const getEclipticLongitude = (M: number) => {
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)); // Equation of Center
  const P = RAD * 102.9372; // Perihelion of the Earth
  return M + C + P + PI; // Mean Longitude
};

const getSunCoords = (d: number) => {
  const M = getSolarMeanAnomaly(d);
  const L = getEclipticLongitude(M);

  return {
    dec: getDeclination(L, 0),
    ra: getRightAscension(L, 0)
  };
};

export const getSunTimes = (date: Date, lat: number, lng: number) => {
  // Normalize date to local noon to ensure we calculate for the correct calendar day
  // (Avoids edge cases where calculating at 11:59 PM might snap to the next solar cycle)
  const targetDate = new Date(date);
  targetDate.setHours(12, 0, 0, 0);

  const lw = RAD * -lng;
  const phi = RAD * lat;

  const d = toDays(targetDate);
  const n = Math.round(d - 0.0009 - lw / (2 * PI));
  const noon = n + 0.0009 + lw / (2 * PI); // Julian cycle for approximate noon

  // Calculate Solar Noon precisely (Equation of Time)
  const M = getSolarMeanAnomaly(noon);
  const L = getEclipticLongitude(M);
  const equationOfTime = noon + (0.0053 * Math.sin(M)) - (0.0069 * Math.sin(2 * L));
  const solarNoonJ = J2000 + equationOfTime;

  // Calculate Sunrise and Sunset
  // Standard altitude for sunrise/sunset is -0.833 degrees 
  // (Atmospheric refraction: 34' + Sun semi-diameter: 16')
  const h = -0.833 * RAD;

  // Recalculate sun declination at noon for better precision
  const sun = getSunCoords(equationOfTime);

  const cosH = (Math.sin(h) - Math.sin(phi) * Math.sin(sun.dec)) / (Math.cos(phi) * Math.cos(sun.dec));

  // Handle polar days/nights
  if (cosH < -1) {
    // Midnight Sun (Sun never sets)
    // Return full day range
    const startOfDay = new Date(targetDate); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate); endOfDay.setHours(23, 59, 59, 999);
    return { sunrise: startOfDay, sunset: endOfDay };
  } else if (cosH > 1) {
    // Polar Night (Sun never rises)
    // Return 0-length day at noon
    const solarNoonDate = fromJulian(solarNoonJ);
    return { sunrise: solarNoonDate, sunset: solarNoonDate };
  }

  const H = Math.acos(cosH); // Hour angle in radians
  const J_set = solarNoonJ + (H / (2 * PI));
  const J_rise = solarNoonJ - (H / (2 * PI));

  return {
    sunrise: fromJulian(J_rise),
    sunset: fromJulian(J_set)
  };
};

/**
 * Calculates the moon phase (0 to 1) using a calibrated Meeus algorithm.
 * Anchored to Jan 29, 2025 for high accuracy in the current era.
 * 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter
 */
export const getMoonPhase = (date: Date): number => {
  const jd = toJulian(date);
  const T = (jd - 2451545.0) / 36525.0;
  const RAD = Math.PI / 180;

  // Standard Meeus Mean Elements for Anomalies (High precision enough for M/M')
  // Sun Mean Anomaly
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  // Moon Mean Anomaly
  const M_ = 134.96340 + 477198.86752 * T + 0.0086972 * T * T;

  // Calibrated Mean Elongation (D)
  // Anchored to known New Moon: Jan 29, 2025 12:35 UTC (JD ~2460705.0243)
  // Mean daily motion of elongation: 12.19074912 degrees
  const knownNewMoonJD = 2460705.0243;
  const daysSinceRef = jd - knownNewMoonJD;
  const D_calibrated = daysSinceRef * 12.19074912;

  // Periodic terms (degrees) - Major inequalities (Evections, Variations, Equation of Center)
  const elongation = D_calibrated
    + 6.289 * Math.sin(M_ * RAD)
    - 2.100 * Math.sin(M * RAD)
    - 1.274 * Math.sin((2 * D_calibrated - M_) * RAD)
    + 0.658 * Math.sin(2 * D_calibrated * RAD)
    - 0.114 * Math.sin(2 * M_ * RAD)
    - 0.055 * Math.sin(2 * D_calibrated - 2 * M_ * RAD);

  // Normalize to 0-1
  const phase = (elongation % 360 + 360) % 360 / 360;
  return phase;
};
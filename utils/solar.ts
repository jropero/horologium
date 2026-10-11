import {
  MoonPhase, SearchMoonPhase, SearchRiseSet, SunPosition, Seasons,
  Body, Observer, Equator, Horizon,
} from 'astronomy-engine';

// JDE (Julian Day Ephemeris) ↔ JS Date; TT ≈ UTC within ~70 s — negligible for calendar use
const jdeToDate = (jde: number): Date => new Date((jde - 2440587.5) * 86400000);

// ── Bounded memo caches ───────────────────────────────────────────────────────
// SearchRiseSet / MoonPhase are the most expensive primitives in the app and get
// re-invoked with identical inputs on nearly every render (same calendar day,
// same coordinates — the clock tick re-renders every panel). Bounded maps with
// insertion-order eviction turn those repeat calls into O(1) lookups without
// growing unbounded.

const _sunTimesCache = new Map<string, { sunrise: Date; sunset: Date }>();
const _moonPhaseCache = new Map<string, number>();
const _SUN_TIMES_CACHE_MAX = 64;
const _MOON_PHASE_CACHE_MAX = 256;

function boundedMemo<T>(cache: Map<string, T>, key: string, max: number, compute: () => T): T {
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const value = compute();
  if (cache.size >= max) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
  return value;
}

// Local-midnight timestamp of the given date — the day key used by getSunTimes.
const calendarDayMs = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const coordsKey = (lat: number, lng: number): string => `${lat.toFixed(4)},${lng.toFixed(4)}`;

export const getSunTimes = (date: Date, lat: number, lng: number) =>
  boundedMemo(_sunTimesCache, `${calendarDayMs(date)}|${coordsKey(lat, lng)}`, _SUN_TIMES_CACHE_MAX, () => {
    // Normalize to local noon — anchors the search to the correct calendar day
    const targetDate = new Date(date);
    targetDate.setHours(12, 0, 0, 0);

    // Sunrise search starts at local midnight so the event falls within the 1-day window
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);

    const observer = new Observer(lat, lng, 0);
    const riseResult = SearchRiseSet(Body.Sun, observer, +1, midnight,     1);
    const setResult  = SearchRiseSet(Body.Sun, observer, -1, targetDate,   1);

    if (!riseResult || !setResult) {
      // Polar edge: altitude at local noon determines day vs. night
      const eq = Equator(Body.Sun, targetDate, observer, true, true);
      const hz = Horizon(targetDate, observer, eq.ra, eq.dec, 'normal');
      if (hz.altitude > 0) {
        const startOfDay = new Date(targetDate); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay   = new Date(targetDate); endOfDay.setHours(23, 59, 59, 999);
        return { sunrise: startOfDay, sunset: endOfDay };
      }
      return { sunrise: targetDate, sunset: targetDate };
    }

    return { sunrise: riseResult.date, sunset: setResult.date };
  });

export const getSolarLongitudeDeg = (date: Date): number =>
  ((SunPosition(date).elon % 360) + 360) % 360;

// Moon phase moves ~0.0009° per hour, so a 1-minute bucket is far finer than
// anything this app displays (lunar day / new-moon / full-moon windows).
export const getMoonPhase = (date: Date): number =>
  boundedMemo(_moonPhaseCache, `${Math.floor(date.getTime() / 60000)}`, _MOON_PHASE_CACHE_MAX, () => MoonPhase(date) / 360);

export const getMoonPosition = (
  date: Date, lat: number, lng: number
): { altitude: number; azimuth: number } => {
  try {
    const observer = new Observer(lat, lng, 0);
    const eq = Equator(Body.Moon, date, observer, true, true);
    const hz = Horizon(date, observer, eq.ra, eq.dec, 'normal');
    return { altitude: hz.altitude, azimuth: hz.azimuth };
  } catch {
    return { altitude: -90, azimuth: 180 };
  }
};

export const getPlanetPosition = (
  body: Body, date: Date, lat: number, lng: number
): { altitude: number; azimuth: number } => {
  try {
    const observer = new Observer(lat, lng, 0);
    const eq = Equator(body, date, observer, true, true);
    const hz = Horizon(date, observer, eq.ra, eq.dec, 'normal');
    return { altitude: hz.altitude, azimuth: hz.azimuth };
  } catch {
    return { altitude: -90, azimuth: 180 };
  }
};

// ── New-moon JDE helpers ───────────────────────────────────────────────────────
// k = lunation index relative to J2000 new moon (JDE 2451550.09766)

export const kForJDE = (jd: number): number =>
  Math.round((jd - 2451550.09766) / 29.530588861);

// True new moon JDE via SearchMoonPhase (~arcsecond precision).
export const trueNewMoonJDE = (k: number): number => {
  const approxJDE = 2451550.09766 + k * 29.530588861;
  // Start 1 day before the mean new moon to ensure SearchMoonPhase finds the right event.
  const result = SearchMoonPhase(0, jdeToDate(approxJDE - 1), 35);
  return result ? result.tt + 2451545.0 : approxJDE;
};

export const prevNewMoonJDE = (jd: number): number => {
  let k = kForJDE(jd);
  let nm = trueNewMoonJDE(k);
  if (nm > jd) { k--; nm = trueNewMoonJDE(k); }
  const nmNext = trueNewMoonJDE(k + 1);
  return nmNext <= jd ? nmNext : nm;
};

export const nextNewMoonJDE = (jd: number): number => {
  let k = kForJDE(jd) + 1;
  let nm = trueNewMoonJDE(k);
  while (nm <= jd) { k++; nm = trueNewMoonJDE(k); }
  return nm;
};

// ── Solstice / equinox JDE helpers ────────────────────────────────────────────

export const winterSolsticeJDE = (year: number): number =>
  Seasons(year).dec_solstice.tt + 2451545.0;

export const springEquinoxJDE = (year: number): number =>
  Seasons(year).mar_equinox.tt + 2451545.0;

export const summerSolsticeJDE = (year: number): number =>
  Seasons(year).jun_solstice.tt + 2451545.0;

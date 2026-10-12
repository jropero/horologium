// lunarCivilCalendar.ts — shared engine for observational lunisolar calendars
// whose day starts at sunset and whose month starts on the evening the new
// crescent is first seen (Babylonian, Attic).
//
// Model:
//   • Civil day  = the interval between two consecutive local sunsets. A moment
//     belongs to the civil day that began at the last sunset at or before it.
//   • Month start = the first sunset after a conjunction at which the crescent
//     is considered visible (minimum Moon age, see crescentSunset).
//   • Year start  = the first month start on or after a seasonal point
//     (spring equinox for Babylon, summer solstice for Athens).
//   • Day N of a month = the N-th civil day counted from the month-start sunset.
//
// All searches go through astronomy-engine with the observer's coordinates,
// so results do not depend on the device timezone.

import { Body, Observer, SearchMoonPhase, SearchRiseSet } from 'astronomy-engine';

const DAY_MS = 86400000;

// Crescent visibility is modelled by a minimum Moon age at sunset (per calendar,
// see `minAgeDays`). A pure age threshold keeps every month at 29 or 30 days:
// the crescent sunset always falls within one day after conjunction + minAge,
// and conjunctions are 29.27–29.83 days apart, so consecutive month starts are
// 29 or 30 sunsets apart — as in the historical calendars, where a month never
// exceeded 30 days. (An extra lag/altitude test would be closer to real first
// visibility but can produce impossible 31-day months.)

const observerFor = (lat: number, lng: number) => new Observer(lat, lng, 0);

// ── Sunsets ──────────────────────────────────────────────────────────────────

/** Last local sunset at or before `t` (null in polar day/night). */
export const lastSunsetAtOrBefore = (t: Date, lat: number, lng: number): Date | null => {
  const r = SearchRiseSet(Body.Sun, observerFor(lat, lng), -1, new Date(t.getTime() + 1), -2);
  return r ? r.date : null;
};

const nextSunsetAfter = (t: Date, obs: Observer): Date | null => {
  const r = SearchRiseSet(Body.Sun, obs, -1, t, 2);
  return r ? r.date : null;
};

/**
 * Start of the sunset-to-sunset civil day containing `t`.
 * Polar fallback: the civil day is pinned to 18:00 local mean solar time.
 */
export const civilDayStart = (t: Date, lat: number, lng: number): Date => {
  const ss = lastSunsetAtOrBefore(t, lat, lng);
  if (ss) return ss;
  const offsetMs = (lng / 15) * 3600000;
  const local = t.getTime() + offsetMs;
  let start = Math.floor(local / DAY_MS) * DAY_MS + 18 * 3600000;
  if (start > local) start -= DAY_MS;
  return new Date(start - offsetMs);
};

// ── Month starts ─────────────────────────────────────────────────────────────

/** Sunset at which the month beginning with conjunction `conj` starts. */
const crescentSunset = (conj: Date, obs: Observer, minAgeDays: number): Date => {
  const ss = nextSunsetAfter(new Date(conj.getTime() + minAgeDays * DAY_MS), obs);
  return ss ?? new Date(conj.getTime() + (minAgeDays + 0.5) * DAY_MS); // polar fallback
};

const nextConjunction = (after: Date): Date =>
  SearchMoonPhase(0, after, 40)!.date;

// ── Year starts and month lists (memoised) ───────────────────────────────────

const coordKey = (lat: number, lng: number) => `${lat.toFixed(3)},${lng.toFixed(3)}`;

const yearStartCache = new Map<string, Date>();
const yearMonthsCache = new Map<string, Date[]>();
const CACHE_MAX = 256;

const remember = <T>(cache: Map<string, T>, key: string, value: T): T => {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
  return value;
};

/**
 * First month-start sunset on or after `seasonalPoint`.
 * `tag` distinguishes calendars (e.g. 'bab', 'attic') in the cache;
 * `minAgeDays` is the Moon age at which the crescent counts as visible.
 */
export const getLunarYearStart = (
  tag: string, minAgeDays: number, seasonalPoint: Date, lat: number, lng: number
): Date => {
  const key = `${tag}|${minAgeDays}|${seasonalPoint.getTime()}|${coordKey(lat, lng)}`;
  const hit = yearStartCache.get(key);
  if (hit) return hit;

  const obs = observerFor(lat, lng);
  // Start ~35 days earlier: a conjunction just before the seasonal point can
  // still have its crescent after it.
  let conj = nextConjunction(new Date(seasonalPoint.getTime() - 35 * DAY_MS));
  for (let i = 0; i < 4; i++) {
    const ss = crescentSunset(conj, obs, minAgeDays);
    if (ss.getTime() >= seasonalPoint.getTime()) return remember(yearStartCache, key, ss);
    conj = nextConjunction(new Date(conj.getTime() + DAY_MS));
  }
  return remember(yearStartCache, key, crescentSunset(conj, obs, minAgeDays));
};

/**
 * Month-start sunsets from `yearStart` (inclusive) to `nextYearStart` (exclusive),
 * followed by `nextYearStart` itself as the closing boundary.
 */
export const getLunarYearMonths = (
  tag: string, minAgeDays: number, yearStart: Date, nextYearStart: Date, lat: number, lng: number
): Date[] => {
  const key = `${tag}|${minAgeDays}|${yearStart.getTime()}|${coordKey(lat, lng)}`;
  const hit = yearMonthsCache.get(key);
  if (hit) return hit;

  const obs = observerFor(lat, lng);
  const starts: Date[] = [yearStart];
  // The conjunction belonging to yearStart lies minAge…minAge+1 days before it.
  let conj = nextConjunction(new Date(yearStart.getTime() - (minAgeDays + 1.5) * DAY_MS));
  while (starts.length < 15) {
    conj = nextConjunction(new Date(conj.getTime() + DAY_MS));
    const ss = crescentSunset(conj, obs, minAgeDays);
    if (ss.getTime() >= nextYearStart.getTime() - 12 * 3600000) break;
    starts.push(ss);
  }
  starts.push(nextYearStart);
  return remember(yearMonthsCache, key, starts);
};

/** Whole civil days between two sunsets (sunset times drift only minutes per day). */
export const civilDaysBetween = (fromSunset: Date, toSunset: Date): number =>
  Math.round((toSunset.getTime() - fromSunset.getTime()) / DAY_MS);

export interface LunarCivilPosition {
  monthIndex: number;   // 0-based lunation within the year
  day: number;          // 1-based day of month
  monthLength: number;  // 29 or 30
  monthCount: number;   // 12 or 13
  dayStart: Date;       // sunset that began this civil day
}

/** Locates `dayStart` (a civil-day-start sunset) within a month list. */
export const positionInYear = (months: Date[], dayStart: Date): LunarCivilPosition => {
  const tol = 3 * 3600000;
  let i = 0;
  while (i + 1 < months.length - 1 && months[i + 1].getTime() <= dayStart.getTime() + tol) i++;
  const monthLength = civilDaysBetween(months[i], months[i + 1]);
  const day = civilDaysBetween(months[i], dayStart) + 1;
  return {
    monthIndex: i,
    day: Math.max(1, Math.min(day, monthLength)),
    monthLength,
    monthCount: months.length - 1,
    dayStart,
  };
};

/**
 * The daytime (local noon) of the civil day that starts at `sunset`.
 * Used to map a civil day to the Gregorian date shown in pickers.
 */
export const daytimeOfCivilDay = (sunset: Date): Date => {
  const approx = new Date(sunset.getTime() + 18 * 3600000); // ≈ local noon at the observer
  const noon = new Date(approx);
  noon.setHours(12, 0, 0, 0); // device-local noon, the picker's convention
  // When the device timezone is far from the observer's, device noon can fall
  // outside this civil day — then keep the observer-noon instant instead.
  const ms = noon.getTime() - sunset.getTime();
  return ms > 3600000 && ms < 22 * 3600000 ? noon : approx;
};

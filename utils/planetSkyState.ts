// planetSkyState.ts — Naked-eye state of the five planets, in the terms an
// observer of the Babylonian Astronomical Diaries recorded: in which zodiac sign
// the planet stands, whether it is visible at all (or lost in the Sun's glare),
// whether it is a morning or evening star, and whether it moves forward,
// stands still or runs backwards.

import {
  Body, GeoVector, Rotation_EQJ_ECT, RotateVector, SphereFromVector, Elongation,
} from 'astronomy-engine';
import { getPlanetPosition } from './solar';

export type NakedEyePlanet = 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn';

export interface PlanetSkyState {
  key: NakedEyePlanet;
  /** Tropical ecliptic longitude of date, degrees 0–360. */
  longitude: number;
  /** 0 = Aries … 11 = Pisces (tropical, like the rest of the app). */
  signIndex: number;
  degreeInSign: number;
  /** Degrees per day; negative while retrograde. */
  dailyMotion: number;
  motion: 'direct' | 'stationary' | 'retrograde';
  /** Angular distance from the Sun, degrees. */
  elongation: number;
  /** False while the planet is too close to the Sun to be seen. */
  visible: boolean;
  /** Morning star (west of the Sun) or evening star (east of the Sun). */
  apparition: 'morning' | 'evening';
  /** Above the observer's horizon right now. */
  aboveHorizon: boolean;
}

const BODIES: Record<NakedEyePlanet, Body> = {
  Mercury: Body.Mercury, Venus: Body.Venus, Mars: Body.Mars, Jupiter: Body.Jupiter, Saturn: Body.Saturn,
};

// Smallest elongation at which each planet can be seen in twilight. These are
// rough naked-eye limits (the true arcus visionis also depends on the angle of
// the ecliptic and on brightness), enough to tell "visible" from "in the glare".
const MIN_ELONGATION: Record<NakedEyePlanet, number> = {
  Mercury: 10, Venus: 6, Mars: 14, Jupiter: 11, Saturn: 13,
};

// Below this daily speed (°/day) the planet is treated as standing still.
const STATIONARY_SPEED: Record<NakedEyePlanet, number> = {
  Mercury: 0.15, Venus: 0.05, Mars: 0.03, Jupiter: 0.01, Saturn: 0.006,
};

const eclipticLongitudeOfDate = (body: Body, date: Date): number => {
  const v = RotateVector(Rotation_EQJ_ECT(date), GeoVector(body, date, true));
  return ((SphereFromVector(v).lon % 360) + 360) % 360;
};

const _cache = new Map<string, PlanetSkyState[]>();

/** State of the five planets; memoised per minute and location. */
export const getPlanetSkyStates = (date: Date, lat: number, lng: number): PlanetSkyState[] => {
  const key = `${Math.floor(date.getTime() / 60000)}|${lat.toFixed(3)},${lng.toFixed(3)}`;
  const hit = _cache.get(key);
  if (hit) return hit;

  const halfDay = new Date(date.getTime() - 43200000);
  const nextHalf = new Date(date.getTime() + 43200000);

  const states = (Object.keys(BODIES) as NakedEyePlanet[]).map((k): PlanetSkyState => {
    const body = BODIES[k];
    const longitude = eclipticLongitudeOfDate(body, date);
    let dailyMotion = eclipticLongitudeOfDate(body, nextHalf) - eclipticLongitudeOfDate(body, halfDay);
    if (dailyMotion > 180) dailyMotion -= 360;
    if (dailyMotion < -180) dailyMotion += 360;
    const motion = Math.abs(dailyMotion) < STATIONARY_SPEED[k]
      ? 'stationary'
      : dailyMotion < 0 ? 'retrograde' : 'direct';
    const el = Elongation(body, date);
    return {
      key: k,
      longitude,
      signIndex: Math.floor(longitude / 30) % 12,
      degreeInSign: longitude % 30,
      dailyMotion,
      motion,
      elongation: el.elongation,
      visible: el.elongation >= MIN_ELONGATION[k],
      apparition: el.visibility === 'morning' ? 'morning' : 'evening',
      aboveHorizon: getPlanetPosition(body, date, lat, lng).altitude > 0,
    };
  });

  if (_cache.size > 32) _cache.clear();
  _cache.set(key, states);
  return states;
};

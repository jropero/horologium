import {
  Body, DefineStar, Equator, Horizon, HorizonFromVector, MakeTime, Observer,
  RotateVector, Rotation_EQJ_HOR, RotationMatrix, Spherical, VectorFromSphere, AstroTime,
} from 'astronomy-engine';
import { getMoonPhase } from './solar';
import {
  getAlgolPhase,
  ALGOL_RA_H, ALGOL_DEC_DEG, ALGOL_DIST_LY,
  SIRIUS_RA_H, SIRIUS_DEC_DEG, SIRIUS_DIST_LY,
} from './egyptianAstronomy';

/**
 * Positional sky data for the Egyptian star-map panorama (EgyptianStarMap).
 * Everything is returned as apparent altitude/azimuth (degrees, azimuth clockwise
 * from north, refraction-corrected) for a given instant and observer.
 */

export interface SkyPoint {
  alt: number;
  az: number;
}

export interface SkyStar extends SkyPoint {
  mag: number;
}

export interface SkyAsterism {
  key: string;
  label: string;
  stars: SkyStar[];
  lines: [number, number][];
}

export interface SkyPlanet extends SkyPoint {
  key: string;
  label: string;
  color: string;
  radius: number;
}

export interface SkyMilkyWayPoint extends SkyPoint {
  /** Relative surface brightness of the band at this galactic longitude (0–1). */
  weight: number;
}

export interface SkySnapshot {
  sun: SkyPoint;
  moon: SkyPoint & { phase: number };
  sopdet: SkyPoint;
  algol: SkyPoint & { eclipsed: boolean };
  planets: SkyPlanet[];
  asterisms: SkyAsterism[];
  milkyWay: SkyMilkyWayPoint[];
}

// J2000 positions (RA hours, Dec degrees, visual magnitude).
type CatalogStar = [number, number, number];

// Sah — Orion, the body of Osiris. Belt = Alnitak, Alnilam, Mintaka.
const SAH: CatalogStar[] = [
  [5.9195, 7.407, 0.50],   // 0 Betelgeuse
  [5.4189, 6.350, 1.64],   // 1 Bellatrix
  [5.6793, -1.943, 1.77],  // 2 Alnitak
  [5.6036, -1.202, 1.69],  // 3 Alnilam
  [5.5334, -0.299, 2.23],  // 4 Mintaka
  [5.7959, -9.670, 2.06],  // 5 Saiph
  [5.2423, -8.202, 0.13],  // 6 Rigel
];
const SAH_LINES: [number, number][] = [[2, 3], [3, 4], [0, 2], [1, 4], [2, 5], [4, 6]];

// Meskhetyu — the Big Dipper, the foreleg of Set.
const MESKHETYU: CatalogStar[] = [
  [11.0621, 61.751, 1.79], // 0 Dubhe
  [11.0307, 56.382, 2.37], // 1 Merak
  [11.8972, 53.695, 2.44], // 2 Phecda
  [12.2571, 57.033, 3.31], // 3 Megrez
  [12.9005, 55.960, 1.77], // 4 Alioth
  [13.3988, 54.925, 2.27], // 5 Mizar
  [13.7923, 49.313, 1.86], // 6 Alkaid
];
const MESKHETYU_LINES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]];

// Egyptian planet names from the astronomical ceilings (Ramesseum, Nelson & Hoelscher 1929;
// LGG): Sbgw, (sbꜣ) ḏꜣ "the crosser", Ḥr-tꜣš-tꜣwj "Horus who bounds the Two Lands",
// Ḥr-kꜣ-pt "Horus bull of the sky". Mars is Ḥr-dšr "red Horus", its Middle Kingdom and
// Greco-Roman name (the Ramesseum calls it Ḥr-ꜣḫtj).
const PLANETS: { body: Body; key: string; label: string; color: string; radius: number }[] = [
  { body: Body.Mercury, key: 'mercury', label: 'Sebegu', color: '#d6c4b0', radius: 2.2 },
  { body: Body.Venus,   key: 'venus',   label: 'Seba-dja', color: '#fff6dc', radius: 3.4 },
  { body: Body.Mars,    key: 'mars',    label: 'Hor-desher', color: '#e0603a', radius: 2.6 },
  { body: Body.Jupiter, key: 'jupiter', label: 'Hor-tash-tawy', color: '#f3e6c4', radius: 3.0 },
  { body: Body.Saturn,  key: 'saturn',  label: 'Hor-ka-pet', color: '#dcc68c', radius: 2.6 },
];

// Galactic plane (b = 0) sampled every 3° of galactic longitude, converted once to
// J2000 RA/Dec. Galactic pole / node constants from the IAU 1958 definition (J2000 frame).
const NGP_RA = 192.85948, NGP_DEC = 27.12825, NCP_L = 122.93192;
const DEG = Math.PI / 180;
const MILKY_WAY_J2000: { ra: number; dec: number; weight: number }[] = (() => {
  const pts = [];
  const sd = Math.sin(NGP_DEC * DEG), cd = Math.cos(NGP_DEC * DEG);
  for (let l = 0; l <= 360; l += 3) {
    const dl = (NCP_L - l) * DEG;
    const dec = Math.asin(cd * Math.cos(dl)) / DEG;
    const ra = (NGP_RA + Math.atan2(Math.sin(dl), -sd * Math.cos(dl)) / DEG + 360) % 360;
    // Brightest toward the galactic centre (Sagittarius), faintest at the anticentre.
    const weight = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(l * DEG));
    pts.push({ ra, dec, weight });
  }
  return pts;
})();

const toHorizon = (rot: RotationMatrix, time: AstroTime, raDeg: number, decDeg: number): SkyPoint => {
  const v = RotateVector(rot, VectorFromSphere(new Spherical(decDeg, raDeg, 1), time));
  const h = HorizonFromVector(v, 'normal');
  return { alt: h.lat, az: h.lon };
};

const bodyHorizon = (body: Body, date: Date, observer: Observer): SkyPoint => {
  const eq = Equator(body, date, observer, true, true);
  const hz = Horizon(date, observer, eq.ra, eq.dec, 'normal');
  return { alt: hz.altitude, az: hz.azimuth };
};

export const computeSky = (date: Date, lat: number, lng: number): SkySnapshot => {
  const observer = new Observer(lat, lng, 0);
  const time = MakeTime(date);
  const rot = Rotation_EQJ_HOR(time, observer);

  // Same star slots as utils/egyptianAstronomy.ts (Star1 = Sirius, Star2 = Algol).
  DefineStar(Body.Star1, SIRIUS_RA_H, SIRIUS_DEC_DEG, SIRIUS_DIST_LY);
  DefineStar(Body.Star2, ALGOL_RA_H, ALGOL_DEC_DEG, ALGOL_DIST_LY);

  const asterism = (key: string, label: string, stars: CatalogStar[], lines: [number, number][]): SkyAsterism => ({
    key, label, lines,
    stars: stars.map(([ra, dec, mag]) => ({ ...toHorizon(rot, time, ra * 15, dec), mag })),
  });

  return {
    sun: bodyHorizon(Body.Sun, date, observer),
    moon: { ...bodyHorizon(Body.Moon, date, observer), phase: getMoonPhase(date) },
    sopdet: bodyHorizon(Body.Star1, date, observer),
    algol: { ...bodyHorizon(Body.Star2, date, observer), eclipsed: getAlgolPhase(date).isEclipsed },
    planets: PLANETS.map(({ body, ...rest }) => ({ ...rest, ...bodyHorizon(body, date, observer) })),
    asterisms: [
      asterism('sah', 'Sah', SAH, SAH_LINES),
      asterism('meskhetyu', 'Meskhetyu', MESKHETYU, MESKHETYU_LINES),
    ],
    milkyWay: MILKY_WAY_J2000.map(({ ra, dec, weight }) => ({ ...toHorizon(rot, time, ra, dec), weight })),
  };
};

/**
 * Projects a flat [raDeg, decDeg, mag, ...] catalogue to a flat [alt, az, mag, ...]
 * array, keeping only stars at or above the horizon.
 */
export const projectCatalog = (catalog: readonly number[], date: Date, lat: number, lng: number): Float32Array => {
  const time = MakeTime(date);
  const rot = Rotation_EQJ_HOR(time, new Observer(lat, lng, 0));
  const out = new Float32Array(catalog.length);
  let n = 0;
  for (let i = 0; i < catalog.length; i += 3) {
    const { alt, az } = toHorizon(rot, time, catalog[i], catalog[i + 1]);
    if (alt < 0) continue;
    out[n++] = alt;
    out[n++] = az;
    out[n++] = catalog[i + 2];
  }
  return out.subarray(0, n);
};

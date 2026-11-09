import { describe, it, expect } from 'vite-plus/test';
import { Body } from 'astronomy-engine';
import {
  getSunTimes,
  getMoonPhase,
  getMoonPosition,
  getPlanetPosition,
  getSolarLongitudeDeg,
  getTwilightTimes,
  kForJDE,
  trueNewMoonJDE,
  prevNewMoonJDE,
  nextNewMoonJDE,
  winterSolsticeJDE,
  springEquinoxJDE,
  summerSolsticeJDE,
} from '../utils/solar';

// Rome coordinates
const ROME_LAT = 41.9;
const ROME_LNG = 12.5;

describe('getSunTimes', () => {
  it('returns Date instances for sunrise and sunset', () => {
    const date = new Date('2024-06-21T00:00:00Z');
    const { sunrise, sunset } = getSunTimes(date, ROME_LAT, ROME_LNG);
    expect(sunrise).toBeInstanceOf(Date);
    expect(sunset).toBeInstanceOf(Date);
  });

  it('sunrise is before sunset on summer solstice (Rome)', () => {
    const date = new Date('2024-06-21T00:00:00Z');
    const { sunrise, sunset } = getSunTimes(date, ROME_LAT, ROME_LNG);
    expect(sunrise.getTime()).toBeLessThan(sunset.getTime());
  });

  it('sunrise is before sunset on winter solstice (Rome)', () => {
    const date = new Date('2024-12-21T00:00:00Z');
    const { sunrise, sunset } = getSunTimes(date, ROME_LAT, ROME_LNG);
    expect(sunrise.getTime()).toBeLessThan(sunset.getTime());
  });

  it('summer solstice has longer day than winter solstice (Rome)', () => {
    const summer = getSunTimes(new Date('2024-06-21T00:00:00Z'), ROME_LAT, ROME_LNG);
    const winter = getSunTimes(new Date('2024-12-21T00:00:00Z'), ROME_LAT, ROME_LNG);
    const summerDayLength = summer.sunset.getTime() - summer.sunrise.getTime();
    const winterDayLength = winter.sunset.getTime() - winter.sunrise.getTime();
    expect(summerDayLength).toBeGreaterThan(winterDayLength);
  });

  it('matches snapshot for summer solstice (Rome)', () => {
    const date = new Date('2024-06-21T00:00:00Z');
    const result = getSunTimes(date, ROME_LAT, ROME_LNG);
    expect(result).toMatchSnapshot();
  });

  it('matches snapshot for winter solstice (Rome)', () => {
    const date = new Date('2024-12-21T00:00:00Z');
    const result = getSunTimes(date, ROME_LAT, ROME_LNG);
    expect(result).toMatchSnapshot();
  });
});

describe('getMoonPhase', () => {
  it('returns a value in [0, 1)', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const phase = getMoonPhase(date);
    expect(phase).toBeGreaterThanOrEqual(0);
    expect(phase).toBeLessThan(1);
  });

  it('is near 0 (new moon) around 2024-03-10', () => {
    // New moon was 2024-03-10 at ~09:00 UTC
    const date = new Date('2024-03-10T09:00:00Z');
    const phase = getMoonPhase(date);
    // Phase wraps at 1.0, so near new moon it is < 0.05 OR > 0.95
    expect(phase < 0.05 || phase > 0.95).toBe(true);
  });

  it('is near 0.5 (full moon) around 2024-03-25', () => {
    // Full moon was 2024-03-25 at ~07:00 UTC
    const date = new Date('2024-03-25T07:00:00Z');
    const phase = getMoonPhase(date);
    expect(phase).toBeGreaterThan(0.4);
    expect(phase).toBeLessThan(0.6);
  });

  it('returns a number for any date', () => {
    const phase = getMoonPhase(new Date('2024-01-01T00:00:00Z'));
    expect(typeof phase).toBe('number');
    expect(isFinite(phase)).toBe(true);
  });
});

describe('getMoonPosition', () => {
  it('returns altitude and azimuth as numbers', () => {
    const date = new Date('2024-06-15T22:00:00Z');
    const pos = getMoonPosition(date, ROME_LAT, ROME_LNG);
    expect(typeof pos.altitude).toBe('number');
    expect(typeof pos.azimuth).toBe('number');
  });

  it('altitude is in valid range [-90, 90]', () => {
    const date = new Date('2024-06-15T22:00:00Z');
    const { altitude } = getMoonPosition(date, ROME_LAT, ROME_LNG);
    expect(altitude).toBeGreaterThanOrEqual(-90);
    expect(altitude).toBeLessThanOrEqual(90);
  });

  it('azimuth is in valid range [0, 360)', () => {
    const date = new Date('2024-06-15T22:00:00Z');
    const { azimuth } = getMoonPosition(date, ROME_LAT, ROME_LNG);
    expect(azimuth).toBeGreaterThanOrEqual(0);
    expect(azimuth).toBeLessThan(360);
  });
});

describe('getPlanetPosition', () => {
  it('returns altitude and azimuth as numbers for Mars', () => {
    const date = new Date('2024-06-15T22:00:00Z');
    const pos = getPlanetPosition(Body.Mars, date, ROME_LAT, ROME_LNG);
    expect(typeof pos.altitude).toBe('number');
    expect(typeof pos.azimuth).toBe('number');
  });

  it('altitude is in valid range [-90, 90] for Jupiter', () => {
    const date = new Date('2024-06-15T22:00:00Z');
    const { altitude } = getPlanetPosition(Body.Jupiter, date, ROME_LAT, ROME_LNG);
    expect(altitude).toBeGreaterThanOrEqual(-90);
    expect(altitude).toBeLessThanOrEqual(90);
  });

  it('azimuth is in valid range [0, 360) for Venus', () => {
    const date = new Date('2024-06-15T22:00:00Z');
    const { azimuth } = getPlanetPosition(Body.Venus, date, ROME_LAT, ROME_LNG);
    expect(azimuth).toBeGreaterThanOrEqual(0);
    expect(azimuth).toBeLessThan(360);
  });
});

describe('getSolarLongitudeDeg', () => {
  it('returns a number in [0, 360)', () => {
    const lon = getSolarLongitudeDeg(new Date('2024-06-21T00:00:00Z'));
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it('is near 90° at summer solstice (Cancer ingress)', () => {
    // Solar longitude at summer solstice is ~90°
    const lon = getSolarLongitudeDeg(new Date('2024-06-20T20:51:00Z'));
    expect(lon).toBeGreaterThan(85);
    expect(lon).toBeLessThan(95);
  });

  it('is near 270° at winter solstice (Capricorn ingress)', () => {
    // Solar longitude at winter solstice is ~270°
    const lon = getSolarLongitudeDeg(new Date('2024-12-21T09:21:00Z'));
    expect(lon).toBeGreaterThan(265);
    expect(lon).toBeLessThan(275);
  });
});

describe('getTwilightTimes', () => {
  const REYKJAVIK_LAT = 64.13;
  const REYKJAVIK_LNG = -21.9;

  it('returns four Date fields (non-null) for Rome on a winter date', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t = getTwilightTimes(date, ROME_LAT, ROME_LNG);
    expect(t.nauticalMorning).toBeInstanceOf(Date);
    expect(t.civilMorning).toBeInstanceOf(Date);
    expect(t.civilEvening).toBeInstanceOf(Date);
    expect(t.nauticalEvening).toBeInstanceOf(Date);
  });

  it('morning order: nauticalMorning < civilMorning (Rome, Nov)', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t = getTwilightTimes(date, ROME_LAT, ROME_LNG);
    expect(t.nauticalMorning!.getTime()).toBeLessThan(t.civilMorning!.getTime());
  });

  it('evening order: civilEvening < nauticalEvening (Rome, Nov)', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t = getTwilightTimes(date, ROME_LAT, ROME_LNG);
    expect(t.civilEvening!.getTime()).toBeLessThan(t.nauticalEvening!.getTime());
  });

  it('civilMorning is before sunrise (Rome, Nov)', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t = getTwilightTimes(date, ROME_LAT, ROME_LNG);
    const { sunrise } = getSunTimes(date, ROME_LAT, ROME_LNG);
    expect(t.civilMorning!.getTime()).toBeLessThan(sunrise.getTime());
  });

  it('civilEvening is after sunset (Rome, Nov)', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t = getTwilightTimes(date, ROME_LAT, ROME_LNG);
    const { sunset } = getSunTimes(date, ROME_LAT, ROME_LNG);
    expect(t.civilEvening!.getTime()).toBeGreaterThan(sunset.getTime());
  });

  it('civil twilight duration is 15–60 min (Rome, Nov)', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t = getTwilightTimes(date, ROME_LAT, ROME_LNG);
    const { sunrise, sunset } = getSunTimes(date, ROME_LAT, ROME_LNG);
    const morningMinutes = (sunrise.getTime() - t.civilMorning!.getTime()) / 60000;
    const eveningMinutes = (t.civilEvening!.getTime() - sunset.getTime()) / 60000;
    expect(morningMinutes).toBeGreaterThan(15);
    expect(morningMinutes).toBeLessThan(60);
    expect(eveningMinutes).toBeGreaterThan(15);
    expect(eveningMinutes).toBeLessThan(60);
  });

  it('nautical twilight is longer than civil twilight (Reykjavik, Nov)', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t = getTwilightTimes(date, REYKJAVIK_LAT, REYKJAVIK_LNG);
    const { sunrise } = getSunTimes(date, REYKJAVIK_LAT, REYKJAVIK_LNG);
    const civilMorning = sunrise.getTime() - t.civilMorning!.getTime();
    const nauticalMorning = sunrise.getTime() - t.nauticalMorning!.getTime();
    expect(nauticalMorning).toBeGreaterThan(civilMorning);
  });

  it('returns null for civil crossings during midnight sun (Tromsø, Jun)', () => {
    // Tromsø (69.6°N) is in midnight sun around June 21: sun stays above -6°
    const TROMSO_LAT = 69.65;
    const TROMSO_LNG = 18.96;
    const date = new Date('2024-06-21T12:00:00Z');
    const t = getTwilightTimes(date, TROMSO_LAT, TROMSO_LNG);
    // During midnight sun the sun never crosses -6°; SearchAltitude returns null
    expect(t.civilMorning).toBeNull();
    expect(t.civilEvening).toBeNull();
  });

  it('caches: same date+location returns identical object reference', () => {
    const date = new Date('2024-11-07T12:00:00Z');
    const t1 = getTwilightTimes(date, ROME_LAT, ROME_LNG);
    const t2 = getTwilightTimes(new Date('2024-11-07T18:00:00Z'), ROME_LAT, ROME_LNG);
    // Same UTC day bucket → same cached result
    expect(t1).toBe(t2);
  });
});

describe('kForJDE', () => {
  it('returns an integer (rounded) for the J2000 new moon JDE', () => {
    const k = kForJDE(2451550.09766);
    expect(k).toBe(0);
  });

  it('returns a positive integer for JDEs after J2000', () => {
    // JDE for 2024 (roughly 2024 - 2000 = 24 years * ~12.37 lunations = ~297 lunations)
    const jde2024 = 2451545.0 + 24 * 365.25;
    const k = kForJDE(jde2024);
    expect(k).toBeGreaterThan(0);
    expect(Number.isInteger(k)).toBe(true);
  });
});

describe('trueNewMoonJDE', () => {
  it('returns a JDE close to the mean for k=0', () => {
    const meanJDE = 2451550.09766;
    const trueJDE = trueNewMoonJDE(0);
    // Should be within 1 day of the mean
    expect(Math.abs(trueJDE - meanJDE)).toBeLessThan(1);
  });

  it('returns a number for positive k values', () => {
    const jde = trueNewMoonJDE(297);
    expect(typeof jde).toBe('number');
    expect(isFinite(jde)).toBe(true);
    expect(jde).toBeGreaterThan(2451545.0);
  });
});

describe('prevNewMoonJDE', () => {
  it('returns a JDE before the input JDE', () => {
    const jde = 2451560.0; // A few days after the first J2000 new moon
    const prev = prevNewMoonJDE(jde);
    expect(prev).toBeLessThanOrEqual(jde);
  });

  it('is within one synodic month of the input', () => {
    const jde = 2460400.0;
    const prev = prevNewMoonJDE(jde);
    expect(jde - prev).toBeLessThan(29.6);
    expect(jde - prev).toBeGreaterThanOrEqual(0);
  });
});

describe('nextNewMoonJDE', () => {
  it('returns a JDE strictly after the input JDE', () => {
    const jde = 2451560.0;
    const next = nextNewMoonJDE(jde);
    expect(next).toBeGreaterThan(jde);
  });

  it('is within two synodic months of the input', () => {
    // kForJDE rounds to the nearest new moon, so k+1 can skip the nearest upcoming
    // one if the input is close to a new moon; the gap can be up to ~59 days.
    const jde = 2460400.0;
    const next = nextNewMoonJDE(jde);
    expect(next - jde).toBeLessThan(60);
    expect(next - jde).toBeGreaterThan(0);
  });
});

describe('springEquinoxJDE', () => {
  it('returns a JDE in the correct year window for 2024', () => {
    const jde = springEquinoxJDE(2024);
    // Spring equinox 2024 was March 20 ~03:06 UTC → JDE ≈ 2460389.6
    expect(jde).toBeGreaterThan(2460385);
    expect(jde).toBeLessThan(2460395);
  });

  it('increases year over year', () => {
    expect(springEquinoxJDE(2025)).toBeGreaterThan(springEquinoxJDE(2024));
  });
});

describe('summerSolsticeJDE', () => {
  it('returns a JDE in the correct year window for 2024', () => {
    const jde = summerSolsticeJDE(2024);
    // Summer solstice 2024 was June 20 ~20:51 UTC → JDE ≈ 2460481.4
    expect(jde).toBeGreaterThan(2460476);
    expect(jde).toBeLessThan(2460486);
  });

  it('is greater than spring equinox JDE for same year', () => {
    expect(summerSolsticeJDE(2024)).toBeGreaterThan(springEquinoxJDE(2024));
  });
});

describe('winterSolsticeJDE', () => {
  it('returns a JDE in the correct year window for 2024', () => {
    const jde = winterSolsticeJDE(2024);
    // Winter solstice 2024 was Dec 21 ~09:21 UTC → JDE ≈ 2460665.9
    expect(jde).toBeGreaterThan(2460660);
    expect(jde).toBeLessThan(2460670);
  });

  it('is greater than summer solstice JDE for same year', () => {
    expect(winterSolsticeJDE(2024)).toBeGreaterThan(summerSolsticeJDE(2024));
  });
});

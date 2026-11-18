import { describe, it, expect } from 'vite-plus/test';
import { getMoonLimbTilt } from '../utils/solar';
import { moonRotation } from '../utils/sceneKit';

// Reference values from the method of Astronomy Engine's demo/nodejs/camera.js,
// computed independently with the demo's own call sequence (no refraction, no
// aberration). A quarter-lit waxing moon, 2026-11-14 17:00 UTC.
const WHEN = new Date('2026-11-14T17:00:00Z');

describe('getMoonLimbTilt', () => {
  it.each([
    ['Basel', 47.56, 7.59, -112.6],
    ['Babylon', 32.54, 44.42, -144.7],
    ['Quito', -0.18, -78.47, -18.9],
    ['Sydney', -33.87, 151.21, 95.4],
  ])('matches the camera.js result in %s', (_name, lat, lng, expected) => {
    expect(getMoonLimbTilt(WHEN, lat, lng).tiltDeg).toBeCloseTo(expected, 0);
  });

  it('gives the same lit fraction everywhere (it is geocentric)', () => {
    const basel = getMoonLimbTilt(WHEN, 47.56, 7.59).litFraction;
    const sydney = getMoonLimbTilt(WHEN, -33.87, 151.21).litFraction;
    expect(basel).toBeCloseTo(0.248, 2);
    expect(sydney).toBeCloseTo(basel, 2);
  });

  it('puts a waxing moon lit on the right in the north and on the left in the south', () => {
    expect(getMoonLimbTilt(WHEN, 47.56, 7.59).tiltDeg).toBeLessThan(0);
    expect(getMoonLimbTilt(WHEN, -33.87, 151.21).tiltDeg).toBeGreaterThan(0);
  });

  it('returns angles within (-180, 180]', () => {
    for (let h = 0; h < 48; h += 3) {
      const t = getMoonLimbTilt(new Date(WHEN.getTime() + h * 3600000), 32.54, 44.42).tiltDeg;
      expect(t).toBeGreaterThan(-180.0001);
      expect(t).toBeLessThanOrEqual(180);
    }
  });
});

describe('moonRotation', () => {
  it('keeps the old fixed -15 degrees without a tilt', () => {
    expect(moonRotation(0.2)).toBe(-15);
    expect(moonRotation(0.8, Number.NaN)).toBe(-15);
  });

  it('leaves the drawing as is when its lit side already faces the real direction', () => {
    // Waxing is drawn lit on the right (-90), waning lit on the left (+90).
    expect(moonRotation(0.2, -90)).toBe(0);
    expect(moonRotation(0.8, 90)).toBe(0);
  });

  it('turns the lit side to the top, the left and the bottom', () => {
    // SVG rotation is clockwise: -90 brings the right side to the top.
    expect(moonRotation(0.2, 0)).toBe(-90);
    expect(moonRotation(0.2, 90)).toBe(-180);
    expect(moonRotation(0.8, 0)).toBe(90);
    // A low crescent at Babylon: lit side down-right, the "boat" moon.
    expect(moonRotation(0.2, -144.7)).toBeCloseTo(54.7, 1);
  });
});

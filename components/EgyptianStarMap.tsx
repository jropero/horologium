import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { computeSky, projectCatalog, SkySnapshot } from '../utils/egyptianSkyMap';

/**
 * 360° draggable sky panorama drawn as the bottom layer of the Egyptian hero
 * (EgyptianCalendarInfo sky scene). Horizontal axis = azimuth (wrapping), vertical
 * axis = altitude (0° at the `horizon` line, clipped above ALT_MAX). The canvas owns
 * its own drag; the layers above it (skyline, weather, text) are pointer-events:none
 * so drags anywhere on the scene reach it.
 */

interface EgyptianStarMapProps {
  date: Date;
  lat: number;
  lng: number;
  isDay: boolean;
  sunrise: Date;
  sunset: Date;
  /** Horizon line as a fraction of the canvas height (from the top). */
  horizon?: number;
}

type SkyMode = 'curated' | 'full';

const PX_PER_DEG = 6;          // 360° → 2160px panorama
const ALT_MAX = 72;            // altitude shown at the top edge of the canvas
const COMPASS_PX = 16;         // compass band along the top edge
const INITIAL_AZIMUTH = 180;   // observer faces south on load
const TWILIGHT_MIN = 30;       // blend window around sunrise / sunset
const DAY_MS = 24 * 3600 * 1000;
// Curated mode keeps a faint backdrop of the brighter catalogue stars so the view
// is never empty when the Egyptian bodies are all below the horizon or off-view.
const BACKDROP_MAG_LIMIT = 4.5;
const BACKDROP_ALPHA = 0.85;

// Dev aid: opening the app with `?mockplanets` spreads every planet across the
// visible sky so all pictograms can be inspected regardless of the ephemeris.
// Order matches PLANETS in utils/egyptianSkyMap.ts (Mercury…Saturn).
const MOCK_PLANET_SKY: { alt: number; az: number }[] = [
  { alt: 14, az: 128 }, // Sebegu (Mercury)
  { alt: 26, az: 164 }, // Seba-dja (Venus)
  { alt: 42, az: 198 }, // Hor-desher (Mars)
  { alt: 30, az: 236 }, // Hor-tash-tawy (Jupiter)
  { alt: 54, az: 176 }, // Hor-ka-pet (Saturn)
];
const wantsMockPlanets = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('mockplanets');

// Sky palettes: [zenith, middle, horizon] as RGB.
type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) as RGB;
const NIGHT_SKY = ['#010408', '#040c18', '#0c0804'].map(hex);
const TWILIGHT_SKY = ['#0b1630', '#1a0f05', '#8b5e3c'].map(hex);
const DAY_SKY = ['#173a78', '#4f6e96', '#d4883c'].map(hex);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixRgb = (a: RGB, b: RGB, t: number): string =>
  `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const wrap360 = (deg: number) => ((deg % 360) + 360) % 360;

/** 0 = full night, 1 = full day, blended linearly within ±30 min of sunrise/sunset. */
const getDayFactor = (now: Date, isDay: boolean, sunrise: Date, sunset: Date): number => {
  const t = now.getTime();
  // romanTime only carries the current day/night boundaries, so also test the
  // same events shifted by a day (e.g. tomorrow's sunrise during the night).
  const nearest = (e: Date) =>
    [e.getTime() - DAY_MS, e.getTime(), e.getTime() + DAY_MS].reduce((best, c) =>
      Math.abs(c - t) < Math.abs(best - t) ? c : best);
  const win = TWILIGHT_MIN * 60000;
  const dRise = t - nearest(sunrise);
  if (Math.abs(dRise) <= win) return clamp01((dRise + win) / (2 * win));
  const dSet = t - nearest(sunset);
  if (Math.abs(dSet) <= win) return clamp01(1 - (dSet + win) / (2 * win));
  return isDay ? 1 : 0;
};

const starColor = (mag: number) => {
  // Bright stars white with a blue tint, dim stars blue-grey.
  const t = clamp01((mag - 0.5) / 5);
  return mixRgb([232, 240, 255], [138, 154, 184], t);
};
const starRadius = (mag: number) => Math.max(0.8, 2.6 - 0.36 * mag);
const starAlpha = (mag: number) => clamp01(1.2 - 0.1 * mag);

const GOLD_LABEL = 'rgba(212,168,50,0.70)';
const LINE_COLOR = 'rgba(212,168,50,0.25)';

/**
 * Distinct Egyptian planet pictograms, recovered from the pre-panorama SVG scene:
 * Seba-dja (Venus) blazes with rays, Hor-desher (Mars) is red, Hor-tash-tawy (Jupiter)
 * is banded and Hor-ka-pet (Saturn) wears a ring — so each body reads without its written name.
 */
const drawPlanet = (
  ctx: CanvasRenderingContext2D,
  key: string,
  x: number,
  y: number,
  r: number,
  color: string,
) => {
  ctx.save();
  ctx.translate(x, y);
  switch (key) {
    case 'venus': {
      // Seba-dja — the brilliant one, with four rays.
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.beginPath(); ctx.arc(0, 0, r * 1.7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]] as const) {
        ctx.beginPath();
        ctx.moveTo(dx * (r + 1.5), dy * (r + 1.5));
        ctx.lineTo(dx * r * 2.7, dy * r * 2.7);
        ctx.stroke();
      }
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'mars': {
      // Hor-desher — the red one.
      ctx.fillStyle = 'rgba(255,64,64,0.10)';
      ctx.beginPath(); ctx.arc(0, 0, r * 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(224,48,48,0.22)';
      ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,128,128,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case 'jupiter': {
      // Hor-tash-tawy — a banded disc.
      ctx.fillStyle = 'rgba(255,255,240,0.08)';
      ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = color;
      ctx.fillRect(-r, -r, r * 2, r * 2);
      ctx.fillStyle = 'rgba(192,112,48,0.40)';
      ctx.fillRect(-r, -r * 0.85, r * 2, r * 0.30);
      ctx.fillStyle = 'rgba(200,112,48,0.65)';
      ctx.fillRect(-r, -r * 0.45, r * 2, r * 0.32);
      ctx.fillStyle = 'rgba(160,80,32,0.50)';
      ctx.fillRect(-r, r * 0.15, r * 2, r * 0.22);
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,240,0.45)';
      ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case 'saturn': {
      // Hor-ka-pet — the ringed one.
      ctx.fillStyle = 'rgba(255,204,102,0.07)';
      ctx.beginPath(); ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2); ctx.fill();
      const ringX = r * 2, ringY = r * 0.62;
      ctx.strokeStyle = 'rgba(200,160,64,0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(0, 0, ringX, ringY, 0, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#f0e8c0';
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(212,170,68,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(0, 0, ringX, ringY, 0, 0, Math.PI); ctx.stroke();
      break;
    }
    default: {
      // Sebegu (Mercury) — a small swift disc.
      ctx.fillStyle = 'rgba(214,196,176,0.12)';
      ctx.beginPath(); ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      break;
    }
  }
  ctx.restore();
};

const EgyptianStarMap: React.FC<EgyptianStarMapProps> = ({ date, lat, lng, isDay, sunrise, sunset, horizon = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sopdetGlowRef = useRef<HTMLDivElement>(null);
  const centerAzRef = useRef(INITIAL_AZIMUTH);
  const sizeRef = useRef({ w: 0, h: 0 });
  const frameRef = useRef<number | null>(null);
  const inertiaRef = useRef<number | null>(null);
  const dragRef = useRef<{ id: number; lastX: number; lastT: number; velocity: number } | null>(null);

  const [mode, setMode] = useState<SkyMode>('curated');
  const [catalog, setCatalog] = useState<readonly number[] | null>(null);

  // Positions refresh once per minute; drawing in between only shifts the azimuth window.
  const minuteKey = Math.floor(date.getTime() / 60000);
  const sky: SkySnapshot = useMemo(() => {
    const snapshot = computeSky(date, lat, lng);
    if (wantsMockPlanets()) {
      snapshot.planets = snapshot.planets.map((p, i) => ({
        ...p,
        ...(MOCK_PLANET_SKY[i] ?? { alt: 24, az: 180 + i * 20 }),
      }));
    }
    return snapshot;
  }, [minuteKey, lat, lng]);
  const catalogStars = useMemo(
    () => (catalog ? projectCatalog(catalog, date, lat, lng) : null),
    [catalog, minuteKey, lat, lng],
  );
  const dayFactor = getDayFactor(date, isDay, sunrise, sunset);

  useEffect(() => {
    let cancelled = false;
    import('../utils/brightStarCatalog').then(m => { if (!cancelled) setCatalog(m.BRIGHT_STARS); });
    return () => { cancelled = true; };
  }, []);

  const draw = useCallback(() => {
    frameRef.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const { w, h } = sizeRef.current;
    if (!canvas || !ctx || w === 0 || h === 0) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const horizonY = h * horizon;
    const pxPerAlt = (horizonY - COMPASS_PX) / ALT_MAX;
    const centerAz = centerAzRef.current;
    const xFor = (az: number) => (wrap360(az - centerAz + 180) - 180) * PX_PER_DEG + w / 2;
    const yFor = (alt: number) => horizonY - alt * pxPerAlt;
    const onScreen = (x: number, y: number, m = 40) => x > -m && x < w + m && y > -m && y < horizonY + 2;
    const nightAlpha = clamp01(1 - dayFactor * 1.6);

    // Sky gradient: night → twilight → day.
    const stops = [0, 1, 2].map(i => dayFactor <= 0.5
      ? mixRgb(NIGHT_SKY[i], TWILIGHT_SKY[i], dayFactor * 2)
      : mixRgb(TWILIGHT_SKY[i], DAY_SKY[i], (dayFactor - 0.5) * 2));
    const grad = ctx.createLinearGradient(0, 0, 0, horizonY);
    grad.addColorStop(0, stops[0]);
    grad.addColorStop(0.55, stops[1]);
    grad.addColorStop(1, stops[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, horizonY);

    // Daytime scrim keeps the light foreground text readable over the bright sky.
    if (dayFactor > 0) {
      ctx.fillStyle = `rgba(12,8,4,${(0.4 * dayFactor).toFixed(3)})`;
      ctx.fillRect(0, 0, w, horizonY);
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, horizonY);
    ctx.clip();

    if (nightAlpha > 0) {
      ctx.globalAlpha = nightAlpha;

      // Nut's body — the Milky Way as a soft band along the galactic plane.
      ctx.lineCap = 'round';
      const mw = sky.milkyWay;
      for (const [width, alpha] of [[16, 0.07], [9, 0.09], [4, 0.12]] as const) {
        ctx.lineWidth = width * pxPerAlt;
        for (let i = 1; i < mw.length; i++) {
          const a = mw[i - 1], b = mw[i];
          if (a.alt < -8 && b.alt < -8) continue;
          const xa = xFor(a.az), xb = xFor(b.az);
          if (Math.abs(xa - xb) > 30 * PX_PER_DEG) continue; // wrap seam / near zenith
          if (Math.max(xa, xb) < -200 || Math.min(xa, xb) > w + 200) continue;
          ctx.strokeStyle = `rgba(180,200,255,${(alpha * (a.weight + b.weight) / 2).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(xa, yFor(a.alt));
          ctx.lineTo(xb, yFor(b.alt));
          ctx.stroke();
        }
      }

      // Catalogue stars: everything to mag 5.5 in full-sky mode, a faint
      // brighter-star backdrop in curated mode.
      if (catalogStars) {
        const full = mode === 'full';
        const magLimit = full ? Infinity : BACKDROP_MAG_LIMIT;
        const alphaScale = full ? 1 : BACKDROP_ALPHA;
        for (let i = 0; i < catalogStars.length; i += 3) {
          const mag = catalogStars[i + 2];
          if (mag > magLimit) break; // catalogue is sorted brightest first
          const x = xFor(catalogStars[i + 1]);
          const y = yFor(catalogStars[i]);
          if (!onScreen(x, y, 4)) continue;
          const r = starRadius(mag);
          ctx.globalAlpha = nightAlpha * starAlpha(mag) * alphaScale;
          ctx.fillStyle = starColor(mag);
          if (r < 1) {
            ctx.fillRect(x - r, y - r, r * 2, r * 2);
          } else {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = nightAlpha;
      }

      // Asterisms: Sah (Orion) and Meskhetyu (Big Dipper).
      ctx.font = '11px Cinzel, serif';
      ctx.textAlign = 'center';
      for (const ast of sky.asterisms) {
        const pts = ast.stars.map(s => ({ x: xFor(s.az), y: yFor(s.alt), s }));
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 1;
        for (const [i, j] of ast.lines) {
          const a = pts[i], b = pts[j];
          if (a.s.alt < 0 && b.s.alt < 0) continue;
          if (Math.abs(a.x - b.x) > w) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        let visible = 0, sx = 0, minY = Infinity;
        for (const { x, y, s } of pts) {
          if (s.alt < 0 || !onScreen(x, y)) continue;
          visible++; sx += x; minY = Math.min(minY, y);
          ctx.fillStyle = 'rgba(212,168,50,0.35)';
          ctx.beginPath();
          ctx.arc(x, y, starRadius(s.mag) + 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = starColor(s.mag);
          ctx.beginPath();
          ctx.arc(x, y, starRadius(s.mag), 0, Math.PI * 2);
          ctx.fill();
        }
        if (visible >= 2) {
          ctx.fillStyle = GOLD_LABEL;
          ctx.fillText(ast.label, sx / visible, Math.max(COMPASS_PX + 10, minY - 10));
        }
      }

      // Eye of Horus — Algol, dimmed and desaturated at eclipse minimum.
      const ax = xFor(sky.algol.az), ay = yFor(sky.algol.alt);
      if (sky.algol.alt > 0 && onScreen(ax, ay)) {
        const eclipsed = sky.algol.eclipsed;
        ctx.globalAlpha = nightAlpha * (eclipsed ? 0.45 : 1);
        ctx.fillStyle = eclipsed ? 'rgba(140,110,90,0.35)' : 'rgba(200,114,42,0.35)';
        ctx.beginPath();
        ctx.arc(ax, ay, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = eclipsed ? '#8a7466' : '#c8722a';
        ctx.beginPath();
        ctx.arc(ax, ay, eclipsed ? 1.4 : 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = nightAlpha;
        ctx.fillStyle = GOLD_LABEL;
        ctx.fillText('Ojo de Horus', ax, ay - 10);
      }

      // Sopdet — Sirius. The pulsing glow is a CSS-animated element positioned below.
      const sx = xFor(sky.sopdet.az), sy = yFor(sky.sopdet.alt);
      if (sky.sopdet.alt > 0 && onScreen(sx, sy)) {
        ctx.fillStyle = '#b8d8ff';
        ctx.beginPath();
        ctx.arc(sx, sy, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = GOLD_LABEL;
        ctx.fillText('Sopdet', sx, sy - 13);
      }
      ctx.globalAlpha = 1;
    }

    const glow = sopdetGlowRef.current;
    if (glow) {
      const sx = xFor(sky.sopdet.az), sy = yFor(sky.sopdet.alt);
      const show = nightAlpha > 0 && sky.sopdet.alt > 0 && onScreen(sx, sy);
      glow.style.display = show ? 'block' : 'none';
      glow.style.opacity = String(nightAlpha);
      glow.style.transform = `translate(${sx}px, ${sy}px)`;
    }

    // Planets: each body gets its own pictogram, labelled with its Egyptian name.
    ctx.font = '11px Cinzel, serif';
    ctx.textAlign = 'center';
    for (const p of sky.planets) {
      const x = xFor(p.az), y = yFor(p.alt);
      if (p.alt <= 0 || !onScreen(x, y)) continue;
      const r = p.radius * 1.6;
      drawPlanet(ctx, p.key, x, y, r, p.color);
      ctx.fillStyle = dayFactor > 0.6 ? 'rgba(255,240,210,0.85)' : GOLD_LABEL;
      ctx.fillText(p.label, x, y - r - 8);
    }

    // Iah — the Moon, lit limb turned toward the Sun.
    const mx = xFor(sky.moon.az), my = yFor(sky.moon.alt);
    if (sky.moon.alt > 0 && onScreen(mx, my)) {
      const r = 7;
      const dxSun = (wrap360(sky.sun.az - sky.moon.az + 180) - 180) * PX_PER_DEG;
      const dySun = -(sky.sun.alt - sky.moon.alt) * pxPerAlt;
      const angle = Math.atan2(dySun, dxSun);
      const c = Math.cos(sky.moon.phase * 2 * Math.PI); // 1 = new, -1 = full
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgba(232,240,255,0.12)';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f2ecd8';
      ctx.shadowColor = 'rgba(242,236,216,0.6)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
      // Terminator: bulges toward the lit side for a crescent, away for gibbous.
      ctx.ellipse(0, 0, Math.max(0.01, r * Math.abs(c)), r, 0, Math.PI / 2, -Math.PI / 2, c > 0);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = dayFactor > 0.6 ? 'rgba(255,240,210,0.85)' : GOLD_LABEL;
      ctx.fillText('Iah', mx, my - r - 8);
    }

    // Ra — the Sun.
    const sunX = xFor(sky.sun.az), sunY = yFor(sky.sun.alt);
    if (sky.sun.alt > -1 && onScreen(sunX, sunY, 60)) {
      const halo = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 46);
      halo.addColorStop(0, 'rgba(255,214,130,0.85)');
      halo.addColorStop(0.25, 'rgba(255,190,90,0.35)');
      halo.addColorStop(1, 'rgba(255,170,60,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 46, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe2a0';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,240,210,0.9)';
      ctx.fillText('Ra', sunX, sunY - 20);
    }
    ctx.restore();

    // Ground below the horizon (normally hidden behind the skyline silhouette).
    ctx.fillStyle = '#0c0804';
    ctx.fillRect(0, horizonY, w, h - horizonY);

    // Compass along the top edge: the bottom belongs to the skyline.
    ctx.font = '10px Cinzel, serif';
    ctx.textBaseline = 'middle';
    for (let az = 0; az < 360; az += 15) {
      const x = xFor(az);
      if (x < -20 || x > w + 20) continue;
      if (az % 90 === 0) {
        ctx.fillStyle = 'rgba(212,168,50,0.75)';
        ctx.fillText(['N', 'E', 'S', 'O'][az / 90], x, COMPASS_PX / 2 + 0.5);
      } else {
        ctx.fillStyle = 'rgba(212,168,50,0.30)';
        ctx.fillRect(x - 0.5, 2, 1, az % 45 === 0 ? 7 : 4);
      }
    }
    ctx.textBaseline = 'alphabetic';
  }, [sky, catalogStars, mode, dayFactor, horizon]);

  const scheduleDraw = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => { scheduleDraw(); }, [scheduleDraw]);

  // Track container size and keep the canvas backing store at device resolution.
  useEffect(() => {
    const container = containerRef.current, canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { w: width, h: height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      scheduleDraw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [scheduleDraw]);

  // Re-render once web fonts arrive so canvas labels use Cinzel.
  useEffect(() => {
    document.fonts?.ready.then(() => scheduleDraw());
  }, [scheduleDraw]);

  useEffect(() => () => {
    // Reset the refs too: StrictMode re-runs effects, and a stale frame id would
    // make scheduleDraw think a frame is still pending.
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (inertiaRef.current !== null) cancelAnimationFrame(inertiaRef.current);
    frameRef.current = null;
    inertiaRef.current = null;
  }, []);

  const stopInertia = () => {
    if (inertiaRef.current !== null) cancelAnimationFrame(inertiaRef.current);
    inertiaRef.current = null;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stopInertia();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { id: e.pointerId, lastX: e.clientX, lastT: e.timeStamp, velocity: 0 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.lastX;
    const dt = Math.max(1, e.timeStamp - drag.lastT);
    drag.velocity = lerp(drag.velocity, dx / dt, 0.6); // px per ms, smoothed
    drag.lastX = e.clientX;
    drag.lastT = e.timeStamp;
    centerAzRef.current = wrap360(centerAzRef.current - dx / PX_PER_DEG);
    scheduleDraw();
  };

  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>, fling: boolean) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    let v = e.timeStamp - drag.lastT < 80 ? drag.velocity : 0;
    if (!fling || Math.abs(v) < 0.05) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      centerAzRef.current = wrap360(centerAzRef.current - (v * dt) / PX_PER_DEG);
      v *= Math.pow(0.995, dt);
      draw();
      inertiaRef.current = Math.abs(v) > 0.02 ? requestAnimationFrame(step) : null;
    };
    inertiaRef.current = requestAnimationFrame(step);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
        // pan-y: horizontal drags scroll the sky, vertical swipes still scroll the page.
        style={{ touchAction: 'pan-y' }}
        role="img"
        aria-label="Mapa del cielo egipcio — arrastre para girar el horizonte"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={e => endDrag(e, true)}
        onPointerCancel={e => endDrag(e, false)}
      />
      <div ref={sopdetGlowRef} className="sopdet-glow" style={{ display: 'none' }} />
      <button
        type="button"
        onClick={e => { e.stopPropagation(); setMode(m => (m === 'curated' ? 'full' : 'curated')); }}
        className="absolute top-2 right-2 z-[4] pointer-events-auto w-8 h-8 flex items-center justify-center rounded-sm text-base leading-none transition-opacity opacity-60 hover:opacity-100 focus-visible:opacity-100"
        style={{ background: 'rgba(12,8,4,0.6)', border: '1px solid rgba(24,64,160,0.55)', color: 'rgba(212,168,50,0.9)' }}
        title={mode === 'curated' ? 'Mostrar el cielo completo' : 'Mostrar el cielo egipcio'}
        aria-label={mode === 'curated' ? 'Mostrar el cielo completo' : 'Mostrar el cielo egipcio'}
        aria-pressed={mode === 'full'}
      >
        {mode === 'curated' ? '𓇼' : '𓂀'}
      </button>
    </div>
  );
};

export default EgyptianStarMap;

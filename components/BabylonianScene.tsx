import React, { useId, useMemo } from 'react';
import { WeatherCondition } from '../types';
import { lerpColor } from '../utils/color';
import {
  GROUND_TOP,
  GROUND_Y,
  HORIZON_Y,
  SCENE_X0,
  SCENE_X1,
  generateBabylonianLandscape,
  riverEdges,
} from '../utils/babylonianLandscape';
import { SceneLight, fmt } from '../utils/sceneKit';
import { Stars, Sun } from './SceneSky';
import { SceneRainSplashes } from './SceneWeather';
import { Birds, MonumentShape, SceneDefs, SceneRoot, sceneFlags, sceneUid } from './SceneParts';
import './BabylonianScene.css';

/**
 * Everything inside the 300×200 SVG of the Babylonian hero. Built from the
 * shared scene kit (utils/sceneKit.ts, components/Scene*.tsx, SceneKit.css);
 * the landscape is `utils/babylonianLandscape.ts`.
 *
 * Layers, back to front: stars → Šamaš (sun) and Sin (moon) at their real
 * positions → weather (`children`) → birds → the plain, palm groves, Esagila
 * and Etemenanki → houses and palms inside the city → inner wall with the main
 * Ishtar Gate → outer wall with the front Ishtar Gate → ground, Processional
 * Way, Euphrates (reflections, bridge, reeds) → foreground date palms.
 *
 * Light. Besides the kit's `--haze`, `--rim` and the cloud colours, the scene
 * sets `--earth` (mud and baked brick in the current light), `--glaze` (the
 * lapis-blue glazed brick) and `--ochre` (the glazed animals of the gate). At
 * night or under the aurora the scene is lit: doors, windows and torches glow
 * with warm firelight.
 */

export interface SkyBody {
  x: number;
  y: number;
}

interface Props {
  /** Seed of the day's city (see `generateBabylonianLandscape`). */
  seed: number;
  isDay: boolean;
  /** 0–1 through the current day or night. */
  progress: number;
  /** Degrees; drives the twilight colours. */
  sunAltitude: number;
  starOpacity: number;
  weatherCond: WeatherCondition;
  aurora: boolean;
  /** Šamaš in the 300×200 frame, or null when below the horizon. */
  sun: SkyBody | null;
  /** Sin in the 300×200 frame, or null when below the horizon. */
  moon: (SkyBody & { phase: number }) | null;
  /** The weather layer, drawn between the sky bodies and the landscape. */
  children?: React.ReactNode;
}

interface BabylonianLight extends SceneLight {
  earth: string;
  glaze: string;
  ochre: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

type LightInput = Pick<Props, 'isDay' | 'sunAltitude' | 'weatherCond' | 'aurora'>;

/** Sun low in the sky (below 8°): golden light. */
const isGolden = (p: LightInput) => p.isDay && p.sunAltitude < 8;

type DaySky = 'wet' | 'grey' | 'fog' | 'golden' | 'partly' | 'clear';

const WET: WeatherCondition[] = ['rain', 'storm'];
const GREY: WeatherCondition[] = ['cloudy', 'snow'];

/** Which daytime light the weather and the sun's height give. */
const daySky = (p: LightInput): DaySky => {
  if (WET.includes(p.weatherCond)) return 'wet';
  if (p.weatherCond === 'fog') return 'fog';
  if (GREY.includes(p.weatherCond)) return 'grey';
  if (isGolden(p)) return 'golden';
  return p.weatherCond === 'partly-cloudy' ? 'partly' : 'clear';
};

type Palette = Omit<BabylonianLight, 'golden' | 'lit'>;

const OVERCAST: Palette = {
  haze: '#a3b0c4',
  rim: '#d7dee8',
  stone: '#b9b9b4',
  cloudLight: '#eef1f5',
  cloudShade: '#8f9cad',
  earth: '#a8957f',
  glaze: '#34548f',
  ochre: '#cdb072',
};

const CLEAR: Palette = {
  haze: '#a9c6ec',
  rim: '#dbeafe',
  stone: '#d6cdb6',
  cloudLight: '#ffffff',
  cloudShade: '#a7bde0',
  earth: '#c9a27a',
  glaze: '#2353b8',
  ochre: '#e0b85e',
};

/** Daytime palettes. Brick reads as earth, the accents stay lapis; golden hour is warm. */
const DAY: Record<DaySky, Palette> = {
  wet: {
    haze: '#5d6b82',
    rim: '#9fb0c4',
    stone: '#8e949c',
    cloudLight: '#8793a3',
    cloudShade: '#3b4656',
    earth: '#6f6458',
    glaze: '#26406f',
    ochre: '#a8935e',
  },
  grey: OVERCAST,
  fog: OVERCAST,
  golden: {
    haze: '#cf9f8c',
    rim: '#ffd29a',
    stone: '#e2bfa0',
    cloudLight: '#ffe0c2',
    cloudShade: '#9a7fae',
    earth: '#d39a68',
    glaze: '#2a4fa8',
    ochre: '#f0c060',
  },
  partly: CLEAR,
  clear: CLEAR,
};

const AURORA: Palette = {
  haze: '#12403b',
  rim: '#5eead4',
  stone: '#4c7d74',
  cloudLight: '#2f6e64',
  cloudShade: '#123c38',
  earth: '#2b3a3c',
  glaze: '#164a5a',
  ochre: '#8a9a68',
};

/** Night: lapis and indigo, warming towards the afterglow (1 at sunset, 0 at -6°). */
const nightPalette = (sunAltitude: number): Palette => {
  const warmth = clamp01(1 + sunAltitude / 6);
  return {
    haze: lerpColor('#141d3a', '#5a4a78', warmth),
    rim: lerpColor('#8597d6', '#f2b27a', warmth),
    stone: lerpColor('#474d63', '#9a7a66', warmth),
    cloudLight: lerpColor('#3b4772', '#d29a86', warmth),
    cloudShade: lerpColor('#161d36', '#4b3a62', warmth),
    earth: lerpColor('#2a3048', '#7a5a52', warmth),
    glaze: lerpColor('#1a2d66', '#2a3d80', warmth),
    ochre: lerpColor('#7a6a48', '#c09050', warmth),
  };
};

export const babylonianLight = (p: LightInput): BabylonianLight => {
  if (p.aurora) return { ...AURORA, golden: false, lit: true };
  if (!p.isDay) return { ...nightPalette(p.sunAltitude), golden: false, lit: true };
  return { ...DAY[daySky(p)], golden: isGolden(p), lit: false };
};

const DAY_GRADIENT: Record<DaySky, string> = {
  wet: 'linear-gradient(to bottom, #1f2937 0%, #334155 50%, #4b5a70 100%)',
  grey: 'linear-gradient(to bottom, #4b5873 0%, #7b8aa5 50%, #b9c4d6 100%)',
  fog: 'linear-gradient(to bottom, #8c9bb3 0%, #c5cfdc 55%, #e3e8ef 100%)',
  golden: 'linear-gradient(to bottom, #1e3a8a 0%, #3b55a8 38%, #c47a6a 72%, #f6c48a 100%)',
  partly: 'linear-gradient(to bottom, #24479a 0%, #4f78c0 45%, #9dbbe2 80%, #cad9ee 100%)',
  clear: 'linear-gradient(to bottom, #173a9c 0%, #2f62c6 40%, #84abe3 78%, #c8dbf3 100%)',
};

/** Night sky; twilight: civil (-6°) carries the warm horizon, the blue glow lasts to -18°. */
const nightGradient = (p: LightInput) => {
  if (p.weatherCond === 'fog') return 'linear-gradient(to bottom, #141b2b 0%, #263247 100%)';
  if (p.weatherCond !== 'clear' && p.weatherCond !== 'partly-cloudy')
    return 'linear-gradient(to bottom, #0a0f1c 0%, #121a2e 60%, #1c2540 100%)';
  const warmth = clamp01(1 + p.sunAltitude / 6);
  const dim = clamp01(1 + p.sunAltitude / 18);
  const c1 = lerpColor('#040914', '#1e2f6b', Math.max(warmth, dim * 0.5));
  const c2 = lerpColor('#0a1430', '#3f3a9a', Math.max(warmth * 0.9, dim * 0.4));
  const c3 = lerpColor('#13204a', '#c0607a', warmth);
  const c4 = lerpColor('#1a2752', '#f0a060', warmth);
  return `linear-gradient(to bottom, ${c1} 0%, ${c2} 40%, ${c3} 72%, ${c4} 100%)`;
};

/**
 * Sky gradient behind the scene (an HTML layer, so it can transition). Lapis
 * by day and night; warm near the horizon at golden hour and twilight.
 */
export const babylonianSkyGradient = (p: LightInput): string =>
  p.isDay ? DAY_GRADIENT[daySky(p)] : nightGradient(p);

const THICK: WeatherCondition[] = ['rain', 'storm', 'snow', 'fog'];
const VEIL = { filter: 'blur(2.5px)', opacity: 0.45 };

/** Sin, the moon god: lapis-tinted disc with an atmospheric halo, lit part cut by the phase. */
const SinMoon: React.FC<{ uid: string; phase: number }> = ({ uid, phase }) => {
  const r = 14;
  const p = ((phase % 1) + 1) % 1;
  const glow = 1 - Math.abs(p - 0.5) * 2;
  const waxing = p <= 0.5;
  const rx = Math.max(0.1, r * Math.abs(Math.cos(p * Math.PI * 2)));
  const bulge = (p > 0.25 && p <= 0.5) || p > 0.75 ? 1 : 0;
  const d = `M 0 -${r} A ${r} ${r} 0 0 ${waxing ? 1 : 0} 0 ${r} A ${fmt(rx)} ${r} 0 0 ${bulge} 0 -${r} Z`;
  return (
    <g transform="rotate(-15)">
      <defs>
        <clipPath id={`${uid}-sin-clip`}>
          <path d={d} />
        </clipPath>
        <radialGradient id={`${uid}-sin-light`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#c8d8f4" />
          <stop offset="100%" stopColor="#93c5fd" />
        </radialGradient>
        <radialGradient id={`${uid}-sin-dark`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0a1020" />
        </radialGradient>
        <radialGradient id={`${uid}-sin-corona`}>
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0" />
          <stop offset="39%" stopColor="#bfdbfe" stopOpacity={glow * 0.55} />
          <stop offset="58%" stopColor="#93c5fd" stopOpacity={glow * 0.22} />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-sin-atmo`}>
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity={glow * 0.35} />
          <stop offset="55%" stopColor="#93c5fd" stopOpacity={glow * 0.12} />
          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow > 0.1 && <circle r={r + 30} fill={`url(#${uid}-sin-atmo)`} />}
      <circle r={r + 22} fill={`url(#${uid}-sin-corona)`} />
      <circle r={r} fill={`url(#${uid}-sin-dark)`} />
      <g clipPath={`url(#${uid}-sin-clip)`}>
        <circle r={r} fill={`url(#${uid}-sin-light)`} />
        <g fill="#7f93b8" opacity="0.35">
          <ellipse cx="-4.6" cy="-4.4" rx="3.6" ry="2.9" />
          <ellipse cx="1.4" cy="-6" rx="2.6" ry="2" />
          <ellipse cx="5.4" cy="-3" rx="2.3" ry="2.8" />
          <ellipse cx="-6.6" cy="1.6" rx="2.2" ry="3.4" />
          <ellipse cx="2.4" cy="0.6" rx="2.4" ry="1.7" />
        </g>
      </g>
      <circle r={r} fill="none" stroke="#93c5fd" strokeWidth="0.5" opacity="0.5" />
    </g>
  );
};

/** A column of glints on the water under a low sun or the moon. */
const glitter = (x: number) => {
  let d = '';
  for (let y = HORIZON_Y + 2; y < 200; y += 1.6 + (y - HORIZON_Y) * 0.06) {
    const w = 0.8 + (y - HORIZON_Y) * 0.22;
    const off = Math.sin(y * 1.7) * w * 0.4;
    d += `M${fmt(x - w / 2 + off)} ${fmt(y)}h${fmt(w)}`;
  }
  return d;
};

const inRiver = (x: number) => {
  const { left, right } = riverEdges(195);
  return x > left + 4 && x < right - 4;
};

const BabylonianScene: React.FC<Props> = props => {
  const { seed, isDay, starOpacity, weatherCond, aurora, sun, moon, children } = props;
  const uid = sceneUid(useId(), 'bs');
  const land = useMemo(() => generateBabylonianLandscape(seed), [seed]);
  const light = babylonianLight(props);
  const { snow, fogStyle, birds, splashes } = sceneFlags(isDay, aurora, weatherCond);
  const veiled = THICK.includes(weatherCond);
  const etemenanki = land.far.find(m => m.kind === 'etemenanki');
  // The body whose light lies on the water: the moon at night, a low sun by day.
  const lowSun = light.golden ? sun : null;
  const glint = isDay ? lowSun : moon;
  const vars = {
    '--earth': light.earth,
    '--glaze': light.glaze,
    '--ochre': light.ochre,
  } as React.CSSProperties;

  return (
    <SceneRoot light={light} weatherCond={weatherCond}>
      <g className="bs-scene" style={vars}>
        <SceneDefs uid={uid} />
        <defs>
          <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="bs-water-stop bs-water-stop--far" />
            <stop offset="100%" className="bs-water-stop" />
          </linearGradient>
          <clipPath id={`${uid}-river`}>
            <path d={land.river} />
          </clipPath>
        </defs>

        <Stars uid={uid} opacity={starOpacity} />
        {sun && (
          <g
            transform={`translate(${fmt(sun.x)}, ${fmt(sun.y)})`}
            style={veiled ? VEIL : undefined}
          >
            <Sun uid={uid} golden={light.golden} />
          </g>
        )}
        {moon && (
          <g
            transform={`translate(${fmt(moon.x)}, ${fmt(moon.y)})`}
            style={veiled ? VEIL : undefined}
          >
            <SinMoon uid={uid} phase={moon.phase} />
          </g>
        )}

        {children}

        {birds && <Birds y={74} />}

        {/* Far: the plain, the groves beyond the river, Esagila and Etemenanki. */}
        <g style={fogStyle} className="bs-far">
          <path d={land.plain} className="bs-plain" />
          {land.far.map(m => (
            <MonumentShape key={m.id} m={m} lit={light.lit} uid={uid} />
          ))}
          <path d={land.farGrove} className="bs-far-grove" />
        </g>

        {/* Inside the walls, then the inner wall with the main gate. */}
        <g style={fogStyle} className="bs-mid">
          <g className="bs-houses">
            {land.city
              .filter(m => m.kind === 'house')
              .map((m, i) => (
                <MonumentShape key={`${m.id}-${i}`} m={m} lit={light.lit} uid={uid} />
              ))}
          </g>
          {land.city
            .filter(m => m.kind !== 'house')
            .map((m, i) => (
              <MonumentShape key={`${m.id}-${i}`} m={m} lit={light.lit} uid={uid} />
            ))}
          <MonumentShape m={land.innerWall} lit={light.lit} uid={uid} />
          <g className="bs-glazed">
            <MonumentShape m={land.mainGate} lit={light.lit} uid={uid} />
          </g>
        </g>

        {/* The outer wall with the front Ishtar Gate. */}
        <g style={fogStyle} className="bs-near">
          <MonumentShape m={land.outerWall} lit={light.lit} uid={uid} />
          <g className="bs-glazed">
            <MonumentShape m={land.ishtarGate} lit={light.lit} uid={uid} />
          </g>
        </g>

        {/* Ground, Processional Way, river. */}
        <g style={fogStyle}>
          <path d={`${GROUND_TOP} V 202 H ${SCENE_X0 - 5} Z`} fill={`url(#${uid}-ground)`} />
          {aurora && (
            <ellipse cx="150" cy="184" rx="190" ry="9" fill={`url(#${uid}-aurora-glow)`} />
          )}
          <path d={GROUND_TOP} className="sk-ground-rim" />
          <path d={land.way} className="bs-way" />
          <path d={land.wayDetail} className="bs-way-detail" />
          <path d={land.wayWalls} className="bs-way-walls" />
          <path d={land.tufts} className="sk-tufts" />
          {snow && (
            <path
              d={`M ${SCENE_X0 - 5} ${GROUND_Y} H ${SCENE_X1 + 5} V ${GROUND_Y + 3} Q 150 ${GROUND_Y + 5} ${SCENE_X0 - 5} ${GROUND_Y + 3} Z`}
              fill="#f0f4f8"
              opacity="0.85"
            />
          )}

          <path d={land.river} fill={`url(#${uid}-water)`} />
          <g clipPath={`url(#${uid}-river)`}>
            {etemenanki && (
              <path
                d={etemenanki.body}
                transform={`matrix(1 0 0 -1 0 ${HORIZON_Y * 2})`}
                className="bs-reflection"
              />
            )}
            {glint && inRiver(glint.x) && (
              <path
                d={glitter(glint.x)}
                className={isDay ? 'bs-glitter bs-glitter--sun' : 'bs-glitter'}
              />
            )}
            <path d={land.shimmer} className="bs-shimmer" />
          </g>
          <path d={land.banks} className="bs-banks" />
          <path d={land.bridge} className="bs-bridge" />
          <path d={land.bridgeDetail} className="sk-detail" />
          <path d={land.reeds} className="bs-reeds" />
          {splashes && <SceneRainSplashes />}
          {land.foreground.map((m, i) => (
            <path key={`${m.id}-${i}`} d={m.body} className="sk-foreground bs-palm" />
          ))}
        </g>
      </g>
    </SceneRoot>
  );
};

export default BabylonianScene;

import React, { useId, useMemo } from 'react';
import { WeatherCondition } from '../types';
import { lerpColor } from '../utils/color';
import {
  GROUND_TOP,
  POOL,
  POOL_SHORE_Y,
  SCENE_X0,
  SCENE_X1,
  generateChineseLandscape,
} from '../utils/chineseLandscape';
import { SceneLight, fmt } from '../utils/sceneKit';
import { Moon, Stars } from './SceneSky';
import { SceneRainSplashes } from './SceneWeather';
import { Birds, MonumentShape, SceneDefs, SceneRoot, sceneFlags, sceneUid } from './SceneParts';
import ChineseInstrument, { SunPos } from './ChineseInstrument';
import './ChineseScene.css';

/**
 * Everything inside the 300×200 SVG of the Zhongguo hero: Tang Chang'an seen
 * from the Leyou plateau, painted as an ink wash. Built on the scene kit; the
 * geometry is `utils/chineseLandscape.ts`, the instrument
 * `ChineseInstrument.tsx`.
 *
 * Layers, back to front: stars (with the Northern Dipper, 北斗) → sun / moon at
 * their real positions → weather (`children`) → wild geese → Qinling far,
 * mist, middle range, mist, loess terraces → city plain → south wall with the
 * Mingde gate → city mist → far shore of the Qujiang, back wards → Ci'en
 * temple and the Big Wild Goose Pagoda → front wards → the pool with its
 * reflections → the plateau → instrument → willows, rocks, pine.
 *
 * Light. Besides the kit variables the scene sets `--paper` (the unpainted
 * paper / mist colour every layer dissolves into), `--wash` (the ink),
 * `--lacquer` (faint vermilion of the gate columns) and `--water`. By day the
 * ink lies on warm xuan paper; at dusk the paper warms to vermilion; at night
 * paper and ink turn deep indigo and the ward windows and gate torches glow.
 */

export interface SkyBody {
  x: number;
  y: number;
}

interface Props {
  seed: number;
  isDay: boolean;
  sunAltitude: number;
  starOpacity: number;
  weatherCond: WeatherCondition;
  aurora: boolean;
  /** Sun in the frame, or null when below the horizon. */
  sun: SkyBody | null;
  /** Moon in the frame, or null when below the horizon. */
  moon: (SkyBody & { phase: number }) | null;
  /** Real sun position for the gnomon's shadow. */
  sunPos: SunPos | null;
  /** 0–1 through the day from the start of 子 (23:00), for the clepsydra arrow. */
  dayFrac: number;
  children?: React.ReactNode;
}

interface ChineseLight extends SceneLight {
  paper: string;
  wash: string;
  lacquer: string;
  water: string;
}

type LightInput = Pick<Props, 'isDay' | 'sunAltitude' | 'weatherCond' | 'aurora'>;
type Palette = Omit<ChineseLight, 'golden' | 'lit'>;
type DaySky = 'wet' | 'grey' | 'fog' | 'golden' | 'clear';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const isGolden = (p: LightInput) => p.isDay && p.sunAltitude < 8;

const daySky = (p: LightInput): DaySky => {
  if (p.weatherCond === 'rain' || p.weatherCond === 'storm') return 'wet';
  if (p.weatherCond === 'fog') return 'fog';
  if (p.weatherCond === 'cloudy' || p.weatherCond === 'snow') return 'grey';
  return isGolden(p) ? 'golden' : 'clear';
};

const DAY: Record<DaySky, Palette> = {
  clear: {
    haze: '#cfc7b2',
    rim: '#f6eedb',
    stone: '#d8cfb9',
    cloudLight: '#fbf7ec',
    cloudShade: '#bdb5a5',
    paper: '#ebe3cf',
    wash: '#2a2824',
    lacquer: '#b8432f',
    water: '#dcd8c8',
  },
  golden: {
    haze: '#d8b496',
    rim: '#ffd9a8',
    stone: '#e4c4a2',
    cloudLight: '#ffe6c8',
    cloudShade: '#b98a86',
    paper: '#efd5b6',
    wash: '#33251e',
    lacquer: '#c8452c',
    water: '#ecc9a6',
  },
  grey: {
    haze: '#bab9b1',
    rim: '#e8e6de',
    stone: '#c6c3ba',
    cloudLight: '#eeede8',
    cloudShade: '#9d9c95',
    paper: '#dcdad1',
    wash: '#292a2a',
    lacquer: '#9b4a3d',
    water: '#cbcbc4',
  },
  fog: {
    haze: '#d4d2ca',
    rim: '#eeede7',
    stone: '#cfccc4',
    cloudLight: '#f2f1ec',
    cloudShade: '#b5b4ae',
    paper: '#e4e2db',
    wash: '#3a3937',
    lacquer: '#9b4a3d',
    water: '#d6d5cf',
  },
  wet: {
    haze: '#80837d',
    rim: '#b8bab3',
    stone: '#9c9c96',
    cloudLight: '#9c9f9a',
    cloudShade: '#4d514e',
    paper: '#a7aaa3',
    wash: '#1a1c1b',
    lacquer: '#7e3a30',
    water: '#8f938e',
  },
};

const AURORA: Palette = {
  haze: '#12403b',
  rim: '#5eead4',
  stone: '#4c7d74',
  cloudLight: '#2f6e64',
  cloudShade: '#123c38',
  paper: '#173f3a',
  wash: '#020d0b',
  lacquer: '#7a3a34',
  water: '#10302c',
};

/** Indigo ink at night, warming to a vermilion afterglow near sunset (1 at 0°, 0 at -6°). */
const nightPalette = (sunAltitude: number): Palette => {
  const w = clamp01(1 + sunAltitude / 6);
  return {
    haze: lerpColor('#1d2442', '#5e4250', w),
    rim: lerpColor('#8896c8', '#f0a878', w),
    stone: lerpColor('#4c5268', '#9a7c6a', w),
    cloudLight: lerpColor('#38426a', '#c88a78', w),
    cloudShade: lerpColor('#141a32', '#4a3048', w),
    paper: lerpColor('#1f2748', '#73474e', w),
    wash: lerpColor('#03050f', '#160c0e', w),
    lacquer: lerpColor('#6e2a2a', '#a8402e', w),
    water: lerpColor('#1a223f', '#62424a', w),
  };
};

export const chineseLight = (p: LightInput): ChineseLight => {
  if (p.aurora) return { ...AURORA, golden: false, lit: true };
  if (!p.isDay) return { ...nightPalette(p.sunAltitude), golden: false, lit: true };
  return { ...DAY[daySky(p)], golden: isGolden(p), lit: false };
};

const DAY_GRADIENT: Record<DaySky, string> = {
  clear: 'linear-gradient(to bottom, #cdcfc6 0%, #e0dccb 45%, #efe7d3 100%)',
  golden: 'linear-gradient(to bottom, #b9b2a8 0%, #dcc3a6 45%, #eda57c 82%, #f3c296 100%)',
  grey: 'linear-gradient(to bottom, #a8a9a4 0%, #cecdc5 55%, #e0ddd4 100%)',
  fog: 'linear-gradient(to bottom, #cfcec8 0%, #e2e0da 60%, #ebeae4 100%)',
  wet: 'linear-gradient(to bottom, #575b59 0%, #7d817e 55%, #a2a59f 100%)',
};

const nightGradient = (p: LightInput) => {
  if (p.weatherCond === 'fog') return 'linear-gradient(to bottom, #141a2c 0%, #2a3248 100%)';
  if (p.weatherCond !== 'clear' && p.weatherCond !== 'partly-cloudy')
    return 'linear-gradient(to bottom, #0a0e1c 0%, #141a30 60%, #1e2542 100%)';
  const warmth = clamp01(1 + p.sunAltitude / 6);
  const dim = clamp01(1 + p.sunAltitude / 18);
  const c1 = lerpColor('#050816', '#26305e', Math.max(warmth, dim * 0.5));
  const c2 = lerpColor('#0b1230', '#4a3f7a', Math.max(warmth * 0.9, dim * 0.4));
  const c3 = lerpColor('#141c40', '#b8584a', warmth);
  const c4 = lerpColor('#1c2448', '#eea070', warmth);
  return `linear-gradient(to bottom, ${c1} 0%, ${c2} 40%, ${c3} 74%, ${c4} 100%)`;
};

/** Sky behind the scene (an HTML layer, so it can transition): paper by day, indigo by night. */
export const chineseSkyGradient = (p: LightInput): string =>
  p.isDay ? DAY_GRADIENT[daySky(p)] : nightGradient(p);

const THICK: WeatherCondition[] = ['rain', 'storm', 'snow', 'fog'];
const VEIL = { filter: 'blur(2.5px)', opacity: 0.45 };

/**
 * The sun as in Chinese painting: a plain disc without rays, pale gold high in
 * the sky, vermilion near the horizon.
 */
const InkSun: React.FC<{ uid: string; altitude: number }> = ({ uid, altitude }) => {
  const t = clamp01((altitude - 2) / 18);
  const disc = lerpColor('#d8432a', '#fff4d6', t);
  const halo = lerpColor('#e46a43', '#f6dc9c', t);
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-ink-sun`}>
          <stop offset="0%" stopColor={halo} stopOpacity="0.55" />
          <stop offset="35%" stopColor={halo} stopOpacity="0.18" />
          <stop offset="100%" stopColor={halo} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="30" fill={`url(#${uid}-ink-sun)`} className="sk-sun__halo" />
      <circle r="8.6" fill={disc} />
    </g>
  );
};

/**
 * The moon by day: only its lit part, a pale wash on the paper (the kit's moon
 * draws the night side as a dark disc, which reads as a hole by day).
 */
const DayMoon: React.FC<{ phase: number }> = ({ phase }) => {
  const r = 14;
  const p = ((phase % 1) + 1) % 1;
  const waxing = p <= 0.5;
  const rx = Math.max(0.1, r * Math.abs(Math.cos(p * Math.PI * 2)));
  const bulge = (p > 0.25 && p <= 0.5) || p > 0.75 ? 1 : 0;
  const d = `M 0 ${-r} A ${r} ${r} 0 0 ${waxing ? 1 : 0} 0 ${r} A ${fmt(rx)} ${r} 0 0 ${bulge} 0 ${-r} Z`;
  return (
    <g transform="rotate(-15)">
      <circle r={r} className="cs-daymoon-ghost" />
      <path d={d} className="cs-daymoon" />
    </g>
  );
};

/** Glints on the pool under the moon or a low sun. */
const glitter = (x: number) => {
  let d = '';
  for (let y = POOL_SHORE_Y + 1.6; y < 182; y += 1.3 + (y - POOL_SHORE_Y) * 0.08) {
    const w = 0.8 + (y - POOL_SHORE_Y) * 0.3;
    d += `M${fmt(x - w / 2 + Math.sin(y * 1.7) * w * 0.3)} ${fmt(y)}h${fmt(w)}`;
  }
  return d;
};

/** The body whose light lies on the pool: the moon at night, a low sun by day. */
const glintBody = (
  isDay: boolean,
  golden: boolean,
  sun: SkyBody | null,
  moon: SkyBody | null,
) => {
  if (!isDay) return moon;
  return golden ? sun : null;
};

/** Sun and moon at their real positions, veiled by thick weather. */
const SkyBodies: React.FC<{
  uid: string;
  isDay: boolean;
  sunAltitude: number;
  sun: SkyBody | null;
  moon: (SkyBody & { phase: number }) | null;
  veiled: boolean;
}> = ({ uid, isDay, sunAltitude, sun, moon, veiled }) => (
  <>
    {sun && (
      <g
        transform={`translate(${fmt(sun.x)}, ${fmt(sun.y)})`}
        style={veiled ? VEIL : undefined}
      >
        <InkSun uid={uid} altitude={sunAltitude} />
      </g>
    )}
    {moon && (
      <g
        transform={`translate(${fmt(moon.x)}, ${fmt(moon.y)}) scale(0.72)`}
        style={veiled ? VEIL : undefined}
      >
        {isDay ? <DayMoon phase={moon.phase} /> : <Moon uid={uid} phase={moon.phase} />}
      </g>
    )}
  </>
);

const ChineseScene: React.FC<Props> = props => {
  const {
    seed,
    isDay,
    starOpacity,
    weatherCond,
    aurora,
    sun,
    moon,
    sunPos,
    dayFrac,
    children,
  } = props;
  const uid = sceneUid(useId(), 'cs');
  const land = useMemo(() => generateChineseLandscape(seed), [seed]);
  const light = chineseLight(props);
  const { snow, fogStyle, birds, splashes } = sceneFlags(isDay, aurora, weatherCond);
  const veiled = THICK.includes(weatherCond);
  const glint = glintBody(isDay, light.golden, sun, moon);
  const vars = {
    '--paper': light.paper,
    '--wash': light.wash,
    '--lacquer': light.lacquer,
    '--water': light.water,
  } as React.CSSProperties;
  const mono = (m: Parameters<typeof MonumentShape>[0]['m']) => (
    <MonumentShape key={m.id + m.body.length} m={m} lit={light.lit} uid={uid} />
  );

  return (
    <SceneRoot light={light} weatherCond={weatherCond}>
      <g className="cs-scene" style={vars}>
        <SceneDefs uid={uid} />
        <defs>
          {(
            [
              ['far', 84, 158],
              ['mid', 128, 164],
              ['near', 146, 166],
            ] as const
          ).map(([k, y1, y2]) => (
            <linearGradient
              key={k}
              id={`${uid}-${k}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={y1}
              x2="0"
              y2={y2}
            >
              <stop offset="0%" className={`cs-${k}-stop cs-${k}-stop--top`} />
              <stop offset="55%" className={`cs-${k}-stop cs-${k}-stop--mid`} />
              <stop offset="100%" className="cs-paper-stop" />
            </linearGradient>
          ))}
          <linearGradient id={`${uid}-mist`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="cs-paper-stop" stopOpacity="0" />
            <stop offset="50%" className="cs-paper-stop" stopOpacity="0.85" />
            <stop offset="100%" className="cs-paper-stop" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${uid}-mist-c`}>
            <stop offset="0%" className="cs-paper-stop" stopOpacity="0.9" />
            <stop offset="100%" className="cs-paper-stop" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id={`${uid}-plain`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="159"
            x2="0"
            y2="184"
          >
            <stop offset="0%" className="cs-plain-stop cs-plain-stop--far" />
            <stop offset="100%" className="cs-plain-stop" />
          </linearGradient>
          <linearGradient
            id={`${uid}-pool`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="165"
            x2="0"
            y2="182"
          >
            <stop offset="0%" className="cs-water-stop cs-water-stop--far" />
            <stop offset="100%" className="cs-water-stop" />
          </linearGradient>
          <linearGradient
            id={`${uid}-plateau`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="170"
            x2="0"
            y2="206"
          >
            <stop offset="0%" className="cs-ground-stop cs-ground-stop--top" />
            <stop offset="100%" className="cs-ground-stop" />
          </linearGradient>
          <clipPath id={`${uid}-poolclip`}>
            <path d={POOL} />
          </clipPath>
        </defs>

        <Stars uid={uid} opacity={starOpacity} />
        <SkyBodies
          uid={uid}
          isDay={isDay}
          sunAltitude={props.sunAltitude}
          sun={sun}
          moon={moon}
          veiled={veiled}
        />

        {children}

        {/* Wild geese (the pagoda's name), in fair weather by day. */}
        {birds && (
          <g className="cs-geese">
            <Birds y={64} />
          </g>
        )}

        {/* Qinling: far range, mist, middle range, mist, loess terraces. */}
        <g style={fogStyle}>
          <path d={land.ridgeFar} fill={`url(#${uid}-far)`} />
          <path d={land.cunFar} className="cs-cun cs-cun--far" />
          <rect
            x={SCENE_X0 - 6}
            y="128"
            width={SCENE_X1 - SCENE_X0 + 12}
            height="26"
            fill={`url(#${uid}-mist)`}
          />
          <path d={land.ridgeMid} fill={`url(#${uid}-mid)`} />
          <path d={land.cunMid} className="cs-cun" />
          <rect
            x={SCENE_X0 - 6}
            y="142"
            width={SCENE_X1 - SCENE_X0 + 12}
            height="20"
            fill={`url(#${uid}-mist)`}
          />
          <path d={land.ridgeNear} fill={`url(#${uid}-near)`} />
          <path d={land.moss} className="cs-moss" />
        </g>

        {/* The city: plain, wall and gate, mist, wards, temple and pagoda. */}
        <g style={fogStyle}>
          <rect
            x={SCENE_X0 - 6}
            y="158"
            width={SCENE_X1 - SCENE_X0 + 12}
            height="28"
            fill={`url(#${uid}-plain)`}
          />
          <path d={land.wall} className="cs-wall" />
          <path d={`M ${SCENE_X0 - 6} 157.6 H ${SCENE_X1 + 6}`} className="cs-wall-top" />
          <g className="cs-gate">{mono(land.gate)}</g>
          <ellipse cx="150" cy="163" rx="150" ry="7" fill={`url(#${uid}-mist-c)`} />
          <g className="cs-city cs-city--far">{land.farShore.map(mono)}</g>
          <g className="cs-city cs-city--far">{land.wardsBack.map(mono)}</g>
          <g className="cs-city">{land.temple.map(mono)}</g>
          <g className="cs-pagoda">{mono(land.pagoda)}</g>
          <g className="cs-city cs-city--near">{land.wardsFront.map(mono)}</g>
          <g className="cs-willow-far">
            {land.willows.slice(2).map((w, i) => (
              <g key={i}>
                <path d={w.trunk} className="cs-willow-trunk" />
                <path d={w.strands} className="cs-willow" />
              </g>
            ))}
          </g>

          {/* The Qujiang pool: water, mirrored range, glints. */}
          <path d={POOL} fill={`url(#${uid}-pool)`} />
          <g clipPath={`url(#${uid}-poolclip)`}>
            <path
              d={land.ridgeMid}
              transform={`matrix(1 0 0 -1 0 ${POOL_SHORE_Y * 2 - 18})`}
              className="cs-reflection"
            />
            {glint && glint.x < 92 && (
              <path
                d={glitter(glint.x)}
                className={isDay ? 'cs-glitter cs-glitter--sun' : 'cs-glitter'}
              />
            )}
            <path
              d="M -40 170.5 h 38 M 10 173 h 30 M 46 171.6 h 26 M -30 176 h 44 M 30 177.5 h 40"
              className="cs-ripple"
            />
          </g>
        </g>

        {/* The plateau, the instrument, the foreground. */}
        <g style={fogStyle}>
          <path
            d={`${GROUND_TOP} L ${SCENE_X1 + 6} 206 L ${SCENE_X0 - 6} 206 Z`}
            fill={`url(#${uid}-plateau)`}
          />
          {aurora && (
            <ellipse cx="150" cy="184" rx="190" ry="9" fill={`url(#${uid}-aurora-glow)`} />
          )}
          <path d={GROUND_TOP} className="cs-ground-rim" />
          <path d={land.earth} className="cs-earth" />
          <path d={land.tufts} className="cs-tufts" />
          {snow && (
            <path
              d={`${GROUND_TOP} L ${SCENE_X1 + 6} 184 Q 150 185.5 ${SCENE_X0 - 6} 186 Z`}
              className="cs-snow"
            />
          )}
          {splashes && <SceneRainSplashes />}
          {/* No shadow under an overcast sky. */}
          <ChineseInstrument
            uid={uid}
            isDay={isDay}
            sun={veiled || weatherCond === 'cloudy' ? null : sunPos}
            dayFrac={dayFrac}
          />
          {land.willows.slice(0, 2).map((w, i) => (
            <g key={i}>
              <path d={w.trunk} className="cs-willow-trunk cs-willow-trunk--near" />
              <path d={w.strands} className="cs-willow cs-willow--near" />
            </g>
          ))}
          <path d={land.rocks} className="cs-rock" />
          <path d={land.rockDetail} className="cs-rock-detail" />
          <path d={land.pine.trunk} className="cs-pine-trunk" />
          <path d={land.pine.needles} className="cs-pine" />
          <path d={land.pine.needleDetail} className="cs-pine-detail" />
        </g>
      </g>
    </SceneRoot>
  );
};

export default ChineseScene;

import React from 'react';
import { WeatherCondition } from '../types';
import { Monument, SceneLight, sceneLightStyle } from '../utils/sceneKit';
import './SceneKit.css';

/**
 * Building blocks shared by the procedural hero scenes (RomanScene, and the
 * Hellenic / Babylonian scenes built on the same kit). Colours come from the
 * CSS variables that `SceneRoot` sets from a `SceneLight`; see SceneKit.css.
 */

/** Gradient / clip id prefix that is unique per mounted scene. */
export const sceneUid = (reactId: string, prefix: string) =>
  `${prefix}${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

/** Root <g> of a scene: applies the light variables and the state classes. */
export const SceneRoot: React.FC<{
  light: SceneLight;
  weatherCond: WeatherCondition;
  children: React.ReactNode;
}> = ({ light, weatherCond, children }) => (
  <g
    className={['scene', light.lit && 'scene--lit', weatherCond === 'snow' && 'scene--snow']
      .filter(Boolean)
      .join(' ')}
    style={sceneLightStyle(light) as React.CSSProperties}
  >
    {children}
  </g>
);

/** Gradients the parts below reference: `${uid}-ground`, `${uid}-torch`, `${uid}-aurora-glow`. */
export const SceneDefs: React.FC<{ uid: string }> = ({ uid }) => (
  <defs>
    <linearGradient id={`${uid}-ground`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" className="sk-ground-stop sk-ground-stop--top" />
      <stop offset="100%" className="sk-ground-stop" />
    </linearGradient>
    <radialGradient id={`${uid}-torch`}>
      <stop offset="0%" stopColor="#ffb347" stopOpacity="0.75" />
      <stop offset="40%" stopColor="#ff8c2b" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#ff8c2b" stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${uid}-aurora-glow`}>
      <stop offset="0%" stopColor="#5eead4" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
    </radialGradient>
  </defs>
);

/**
 * A built monument: silhouette with rim light, lit relief, engraved detail,
 * openings and windows that glow at night, and torches (only while `lit`).
 */
export const MonumentShape: React.FC<{ m: Monument; lit: boolean; uid: string }> = ({
  m,
  lit,
  uid,
}) => (
  <g>
    <path d={m.body} className="sk-body" />
    {m.relief && <path d={m.relief} className="sk-relief" />}
    {m.detail && <path d={m.detail} className="sk-detail" />}
    {m.openings && <path d={m.openings} className="sk-opening" />}
    {m.windows.map((w, i) => (
      <rect
        key={i}
        x={w.x}
        y={w.y}
        width={w.w}
        height={w.h}
        className={w.lit ? 'sk-window sk-window--lit' : 'sk-window'}
        style={{ animationDelay: `${-w.delay}s` }}
      />
    ))}
    {lit &&
      m.torches.map((t, i) => (
        <g key={i} className="sk-torch" style={{ animationDelay: `${-t.delay}s` }}>
          <circle cx={t.x} cy={t.y} r="5" fill={`url(#${uid}-torch)`} />
          <circle cx={t.x} cy={t.y} r="0.6" fill="#ffe2a0" />
        </g>
      ))}
  </g>
);

const BIRDS: [number, number, number][] = [
  [0, 0, 1],
  [7, 3.5, 0.8],
  [13, -2, 0.9],
  [21, 2, 0.7],
  [-6, 5, 0.75],
];

/** A small flock crossing the sky (fair weather by day). `y` is the flight height. */
export const Birds: React.FC<{ y?: number }> = ({ y = 60 }) => (
  <g className="sk-birds">
    {BIRDS.map(([bx, by, s], i) => (
      <path
        key={i}
        d="M-2.2 0Q-1.1 -1.4 0 0Q1.1 -1.4 2.2 0"
        transform={`translate(${bx} ${y + by}) scale(${s})`}
      />
    ))}
  </g>
);

const THICK_WEATHER: WeatherCondition[] = ['cloudy', 'rain', 'storm', 'snow', 'fog'];
const FAIR_WEATHER: WeatherCondition[] = ['clear', 'partly-cloudy'];
const WET_WEATHER: WeatherCondition[] = ['rain', 'storm'];

const THICK_VEIL = { filter: 'blur(2.5px)', opacity: 0.45 };
/** Partly cloudy: thin cloud drifts over the sun, a soft blur only. */
const LIGHT_VEIL = { filter: 'blur(1.2px)', opacity: 0.8 };

const veilFor = (isDay: boolean, weatherCond: WeatherCondition) => {
  if (!isDay) return undefined;
  if (THICK_WEATHER.includes(weatherCond)) return THICK_VEIL;
  return weatherCond === 'partly-cloudy' ? LIGHT_VEIL : undefined;
};

/** What the weather and the hour switch on or off in a scene. */
export const sceneFlags = (isDay: boolean, aurora: boolean, weatherCond: WeatherCondition) => ({
  snow: weatherCond === 'snow',
  /** Style for landscape groups: fog softens and fades them. */
  fogStyle: weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined,
  /** Thick weather in front of the sun: blur and dim it. */
  veiled: isDay && THICK_WEATHER.includes(weatherCond),
  /** Style for the sun / moon group: thick weather blurs and dims it, partly cloudy softens it. */
  veil: veilFor(isDay, weatherCond),
  birds: isDay && !aurora && FAIR_WEATHER.includes(weatherCond),
  splashes: !aurora && WET_WEATHER.includes(weatherCond),
});

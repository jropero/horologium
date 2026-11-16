import React, { useId, useMemo } from 'react';
import { WeatherCondition } from '../types';
import { lerpColor } from '../utils/color';
import { GROUND_TOP, Monument, generateRomanLandscape } from '../utils/romanLandscape';
import RomanSceneSky from './RomanSceneSky';
import RomanSceneInstrument from './RomanSceneInstrument';
import './RomanScene.css';

/**
 * Everything inside the 300×200 SVG of the Roman hero (Rome only; Hellas keeps
 * the older drawing in RomanClock).
 *
 * Layers, back to front: stars → hour arc → sun / moon → weather (`children`)
 * → mountains → aqueduct → monuments → ground → plinth with gnomon or
 * clepsydra → foreground trees.
 *
 * Light. The landscape is drawn in three colours set as CSS variables on the
 * root: `--haze` (the air: far layers take its colour, near ones stay close to
 * `--ink`), `--rim` (edge light and engraved detail) and `--stone` (the
 * plinth). They follow the time of day, the weather and the aurora. At night
 * (`roman-scene--lit`) windows, doors and arcades glow from inside.
 */

interface Props {
  /** Seed of the day's city (see `generateRomanLandscape`). */
  seed: number;
  isDay: boolean;
  /** 0–1 through the twelve hours of the current day or night. */
  progress: number;
  /** Degrees; drives the twilight colours. */
  sunAltitude: number;
  moonPhase: number;
  starOpacity: number;
  weatherCond: WeatherCondition;
  aurora: boolean;
  /** The weather layer, drawn between the sky bodies and the landscape. */
  children?: React.ReactNode;
}

interface SceneLight {
  haze: string;
  rim: string;
  stone: string;
  /** Sun near the horizon. */
  golden: boolean;
  /** Lamps and torches are burning. */
  lit: boolean;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const sceneLight = (p: Props): SceneLight => {
  const golden = p.isDay && (p.progress < 0.15 || p.progress > 0.85);
  if (p.aurora)
    return { haze: '#12403b', rim: '#5eead4', stone: '#4c7d74', golden: false, lit: true };
  if (!p.isDay) {
    // 1 at sunset / sunrise, 0 once the sun is 6° down.
    const warmth = clamp01(1 + p.sunAltitude / 6);
    return {
      haze: lerpColor('#151c36', '#6b4636', warmth),
      rim: lerpColor('#7c8bbd', '#f0a35e', warmth),
      stone: lerpColor('#474d63', '#9a7a66', warmth),
      golden: false,
      lit: true,
    };
  }
  if (p.weatherCond === 'rain' || p.weatherCond === 'storm')
    return { haze: '#5f6f82', rim: '#9aa8b8', stone: '#8e949c', golden, lit: false };
  if (p.weatherCond === 'cloudy' || p.weatherCond === 'fog' || p.weatherCond === 'snow')
    return { haze: '#aab6c4', rim: '#d5dbe3', stone: '#b9b9b4', golden, lit: false };
  if (golden) return { haze: '#d99a7c', rim: '#ffc38a', stone: '#e2bfa0', golden, lit: false };
  return { haze: '#9db8d3', rim: 'var(--gold-dim)', stone: '#d6cdb6', golden, lit: false };
};

const MonumentShape: React.FC<{ m: Monument; lit: boolean; uid: string }> = ({
  m,
  lit,
  uid,
}) => (
  <g>
    <path d={m.body} className="rs-body" />
    {m.relief && <path d={m.relief} className="rs-relief" />}
    {m.detail && <path d={m.detail} className="rs-detail" />}
    {m.openings && <path d={m.openings} className="rs-opening" />}
    {m.windows.map((w, i) => (
      <rect
        key={i}
        x={w.x}
        y={w.y}
        width={w.w}
        height={w.h}
        className={w.lit ? 'rs-window rs-window--lit' : 'rs-window'}
        style={{ animationDelay: `${-w.delay}s` }}
      />
    ))}
    {lit &&
      m.torches.map((t, i) => (
        <g key={i} className="rs-torch" style={{ animationDelay: `${-t.delay}s` }}>
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

const RomanScene: React.FC<Props> = props => {
  const { seed, isDay, progress, moonPhase, starOpacity, weatherCond, aurora, children } =
    props;
  const uid = `rs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const land = useMemo(() => generateRomanLandscape(seed), [seed]);
  const light = sceneLight(props);

  const snow = weatherCond === 'snow';
  const fog = weatherCond === 'fog';
  const fogStyle = fog ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined;
  const veiled =
    isDay &&
    (weatherCond === 'rain' || weatherCond === 'storm' || weatherCond === 'snow' || fog);
  const birds =
    isDay && !aurora && (weatherCond === 'clear' || weatherCond === 'partly-cloudy');

  return (
    <g
      className={`roman-scene${light.lit ? ' roman-scene--lit' : ''}${snow ? ' roman-scene--snow' : ''}`}
      style={
        {
          '--haze': light.haze,
          '--rim': light.rim,
          '--stone': light.stone,
        } as React.CSSProperties
      }
    >
      <defs>
        <linearGradient id={`${uid}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="rs-ground-stop rs-ground-stop--top" />
          <stop offset="100%" className="rs-ground-stop" />
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

      <RomanSceneSky
        uid={uid}
        isDay={isDay}
        progress={progress}
        moonPhase={moonPhase}
        starOpacity={starOpacity}
        golden={light.golden}
        veiled={veiled}
      />

      {children}

      {birds && (
        <g className="rs-birds">
          {BIRDS.map(([x, y, s], i) => (
            <path
              key={i}
              d="M-2.2 0Q-1.1 -1.4 0 0Q1.1 -1.4 2.2 0"
              transform={`translate(${x} ${60 + y}) scale(${s})`}
            />
          ))}
        </g>
      )}

      <g style={fogStyle}>
        <path d={land.ridgeFar} className="rs-ridge-far" />
        <path d={land.ridgeNear} className="rs-ridge-near" />
        <path d={land.aqueduct} className="rs-aqueduct" />
        <path d={land.aqueductDetail} className="rs-detail" />
        {land.monuments.map(m => (
          <MonumentShape key={m.id} m={m} lit={light.lit} uid={uid} />
        ))}
      </g>

      <g style={fogStyle}>
        <path d={`${GROUND_TOP} V 200 H 0 Z`} fill={`url(#${uid}-ground)`} />
        {aurora && (
          <ellipse cx="150" cy="182" rx="150" ry="9" fill={`url(#${uid}-aurora-glow)`} />
        )}
        <path d={GROUND_TOP} className="rs-ground-rim" />
        <path d={land.tufts} className="rs-tufts" />
        {snow && (
          <path
            d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z"
            fill="#f0f4f8"
            opacity="0.9"
          />
        )}
        <RomanSceneInstrument uid={uid} isDay={isDay} progress={progress} />
        {land.foreground.map(m => (
          <path key={m.id} d={m.body} className="rs-foreground" />
        ))}
      </g>
    </g>
  );
};

export default RomanScene;

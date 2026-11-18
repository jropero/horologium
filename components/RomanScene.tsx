import React, { useId, useMemo } from 'react';
import { WeatherCondition } from '../types';
import { lerpColor } from '../utils/color';
import {
  GROUND_TOP,
  SCENE_X0,
  SCENE_X1,
  generateRomanLandscape,
} from '../utils/romanLandscape';
import { SceneLight } from '../utils/sceneKit';
import SceneSky from './SceneSky';
import SceneInstrument from './SceneInstrument';
import { SceneRainSplashes } from './SceneWeather';
import { Birds, MonumentShape, SceneDefs, SceneRoot, sceneFlags, sceneUid } from './SceneParts';

/**
 * Everything inside the 300×200 SVG of the Roman hero (Rome only). Built from
 * the shared scene kit (utils/sceneKit.ts, components/Scene*.tsx,
 * SceneKit.css); only the palette (`sceneLight`) and the composition are Roman.
 *
 * Layers, back to front: stars → hour arc → sun / moon → weather (`children`)
 * → mountains → aqueduct → monuments → ground → plinth with gnomon or
 * clepsydra → foreground trees.
 *
 * Light. The landscape is drawn in three colours set as CSS variables on the
 * root: `--haze` (the air: far layers take its colour, near ones stay close to
 * `--ink`), `--rim` (edge light and engraved detail) and `--stone` (the
 * plinth). They follow the time of day, the weather and the aurora. At night
 * (`scene--lit`) windows, doors and arcades glow from inside.
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
  /** Bright-limb tilt (`getMoonLimbTilt`): the moon's lit side faces the real direction. */
  moonTilt?: number;
  starOpacity: number;
  weatherCond: WeatherCondition;
  aurora: boolean;
  /** The weather layer, drawn between the sky bodies and the landscape. */
  children?: React.ReactNode;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const sceneLight = (p: Props): SceneLight => {
  const golden = p.isDay && (p.progress < 0.15 || p.progress > 0.85);
  if (p.aurora)
    return {
      haze: '#12403b',
      rim: '#5eead4',
      stone: '#4c7d74',
      cloudLight: '#2f6e64',
      cloudShade: '#123c38',
      golden: false,
      lit: true,
    };
  if (!p.isDay) {
    // 1 at sunset / sunrise, 0 once the sun is 6° down.
    const warmth = clamp01(1 + p.sunAltitude / 6);
    return {
      haze: lerpColor('#151c36', '#6b4636', warmth),
      rim: lerpColor('#7c8bbd', '#f0a35e', warmth),
      stone: lerpColor('#474d63', '#9a7a66', warmth),
      cloudLight: lerpColor('#3d4868', '#c98a6a', warmth),
      cloudShade: lerpColor('#1a2138', '#4a3550', warmth),
      golden: false,
      lit: true,
    };
  }
  if (p.weatherCond === 'rain' || p.weatherCond === 'storm')
    return {
      haze: '#5f6f82',
      rim: '#9aa8b8',
      stone: '#8e949c',
      cloudLight: '#8793a3',
      cloudShade: '#3b4656',
      golden,
      lit: false,
    };
  if (p.weatherCond === 'cloudy' || p.weatherCond === 'fog' || p.weatherCond === 'snow')
    return {
      haze: '#aab6c4',
      rim: '#d5dbe3',
      stone: '#b9b9b4',
      cloudLight: '#eef1f5',
      cloudShade: '#8f9cad',
      golden,
      lit: false,
    };
  if (golden)
    return {
      haze: '#d99a7c',
      rim: '#ffc38a',
      stone: '#e2bfa0',
      cloudLight: '#ffe0c2',
      cloudShade: '#b9737f',
      golden,
      lit: false,
    };
  return {
    haze: '#9db8d3',
    rim: 'var(--gold-dim)',
    stone: '#d6cdb6',
    cloudLight: '#ffffff',
    cloudShade: '#a9b9cd',
    golden,
    lit: false,
  };
};

const RomanScene: React.FC<Props> = props => {
  const {
    seed,
    isDay,
    progress,
    moonPhase,
    moonTilt,
    starOpacity,
    weatherCond,
    aurora,
    children,
  } = props;
  const uid = sceneUid(useId(), 'rs');
  const land = useMemo(() => generateRomanLandscape(seed), [seed]);
  const light = sceneLight(props);
  const { snow, fogStyle, veiled, birds, splashes } = sceneFlags(isDay, aurora, weatherCond);

  return (
    <SceneRoot light={light} weatherCond={weatherCond}>
      <SceneDefs uid={uid} />

      <SceneSky
        uid={uid}
        isDay={isDay}
        progress={progress}
        moonPhase={moonPhase}
        moonTilt={moonTilt}
        starOpacity={starOpacity}
        golden={light.golden}
        veiled={veiled}
      />

      {children}

      {birds && <Birds />}

      <g style={fogStyle}>
        <path d={land.ridgeFar} className="sk-ridge-far" />
        <path d={land.ridgeNear} className="sk-ridge-near" />
        <path d={land.aqueduct} className="sk-aqueduct" />
        <path d={land.aqueductDetail} className="sk-detail" />
        {land.monuments.map(m => (
          <MonumentShape key={m.id} m={m} lit={light.lit} uid={uid} />
        ))}
      </g>

      <g style={fogStyle}>
        {/* Down to 206: on some phone sizes the hero shows slightly below y 200. */}
        <path d={`${GROUND_TOP} V 206 H ${SCENE_X0} Z`} fill={`url(#${uid}-ground)`} />
        {aurora && (
          <ellipse cx="150" cy="182" rx="190" ry="9" fill={`url(#${uid}-aurora-glow)`} />
        )}
        <path d={GROUND_TOP} className="sk-ground-rim" />
        <path d={land.tufts} className="sk-tufts" />
        {snow && (
          <path
            d={`M ${SCENE_X0} 180 L 0 180 Q 50 173 100 180 T 200 178 T 300 180 L ${SCENE_X1} 180 V 175 L 300 175 Q 250 172 200 175 T 100 177 T 0 175 L ${SCENE_X0} 175 Z`}
            fill="#f0f4f8"
            opacity="0.9"
          />
        )}
        {splashes && <SceneRainSplashes />}
        <SceneInstrument uid={uid} isDay={isDay} progress={progress} />
        {land.foreground.map(m => (
          <path key={m.id} d={m.body} className="sk-foreground" />
        ))}
      </g>
    </SceneRoot>
  );
};

export default RomanScene;

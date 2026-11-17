import React, { useId, useMemo } from 'react';
import { WeatherCondition } from '../types';
import { lerpColor } from '../utils/color';
import {
  GROUND_TOP,
  PANATHENAIC_WAY,
  HellenicLayout,
  HellenicMonument,
  SCENE_X0,
  SNOW_BAND,
  generateHellenicLandscape,
} from '../utils/hellenicLandscape';
import { SceneLight, sceneLightStyle } from '../utils/sceneKit';
import SceneSky, { Moon, Stars, Sun } from './SceneSky';
import SceneInstrument from './SceneInstrument';
import { SceneRainSplashes } from './SceneWeather';
import { Birds, MonumentShape, SceneDefs, SceneRoot, sceneFlags, sceneUid } from './SceneParts';
import './HellenicScene.css';

/**
 * Everything inside the 300×200 SVG of the Hellenic heroes: Athens from the
 * Pnyx, c. 406 BCE (geometry and sources in utils/hellenicLandscape.ts).
 * Built on the shared scene kit; only the palette and the composition are
 * Greek. Used by the clock hero (`RomanClock`, with the gnomon / klepsydra) and
 * by the info-bar hero (`HellenicCalendarInfo`, `layout="wide"`, no instrument,
 * sun and moon at their real altitude and azimuth via `bodies`).
 *
 * Layers, back to front: stars → hour arc → sun / moon → weather (`children`)
 * → Hymettos → Lykabettos → distant town → Acropolis rock → south slope →
 * Acropolis buildings → Hephaisteion, Agora, houses, trees → ground → figures
 * → instrument → foreground trees.
 *
 * Light. Besides the kit's `--haze`, `--rim` and `--stone`, the Greek scene
 * sets `--marble` (sunlit marble), `--marble-shade`, `--rock` (Acropolis
 * limestone), `--leaf`, `--earth` and `--tile` (roof terracotta); see
 * HellenicScene.css. By day the marble reads warm white against the Aegean
 * air; at night everything turns to moonlit blue and lamps glow.
 */

export interface HellenicLight extends SceneLight {
  marble: string;
  marbleShade: string;
  rock: string;
  leaf: string;
  earth: string;
  tile: string;
}

export interface HellenicLightInput {
  isDay: boolean;
  /** 0–1 through the twelve hours of the current day or night. */
  progress: number;
  /** Degrees; drives the twilight colours. */
  sunAltitude: number;
  weatherCond: WeatherCondition;
  aurora: boolean;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Palette of the Greek scene for the time of day, twilight, weather and aurora. */
export const hellenicSceneLight = (p: HellenicLightInput): HellenicLight => {
  const golden = p.isDay && (p.progress < 0.12 || p.progress > 0.88);
  if (p.aurora)
    return {
      haze: '#12403b',
      rim: '#5eead4',
      stone: '#4c7d74',
      cloudLight: '#2f6e64',
      cloudShade: '#123c38',
      marble: '#4f8a80',
      marbleShade: '#24504a',
      rock: '#2c5650',
      leaf: '#123430',
      earth: '#15322e',
      tile: '#3a5a50',
      golden: false,
      lit: true,
    };
  if (!p.isDay) {
    // 1 at sunset / sunrise, 0 once the sun is 6° down.
    const w = clamp01(1 + p.sunAltitude / 6);
    return {
      haze: lerpColor('#14223e', '#6c4a40', w),
      rim: lerpColor('#9db4e0', '#f4b070', w),
      stone: lerpColor('#4c566e', '#a0806a', w),
      cloudLight: lerpColor('#3e4b6c', '#cf8f6c', w),
      cloudShade: lerpColor('#1a2238', '#4c3652', w),
      marble: lerpColor('#5d6f96', '#d9a486', w),
      marbleShade: lerpColor('#2b3654', '#7e5c5c', w),
      rock: lerpColor('#2f3a55', '#80604e', w),
      leaf: lerpColor('#141d2a', '#30302a', w),
      earth: lerpColor('#18202f', '#4a3a30', w),
      tile: lerpColor('#3a3a52', '#8a5040', w),
      golden: false,
      lit: true,
    };
  }
  if (p.weatherCond === 'rain' || p.weatherCond === 'storm')
    return {
      haze: '#66778c',
      rim: '#aab6c4',
      stone: '#8e949c',
      cloudLight: '#8793a3',
      cloudShade: '#3b4656',
      marble: '#c2c4c6',
      marbleShade: '#7e8590',
      rock: '#7f7d78',
      leaf: '#3e4a3c',
      earth: '#5e5a50',
      tile: '#7c5a4c',
      golden,
      lit: false,
    };
  if (p.weatherCond === 'cloudy' || p.weatherCond === 'fog' || p.weatherCond === 'snow')
    return {
      haze: '#b2bfcb',
      rim: '#e6eaee',
      stone: '#c4c3be',
      cloudLight: '#eef1f5',
      cloudShade: '#8f9cad',
      marble: '#e8e5de',
      marbleShade: '#a8aaab',
      rock: '#a8a294',
      leaf: '#56614a',
      earth: '#8e846e',
      tile: '#a8705a',
      golden,
      lit: false,
    };
  if (golden)
    return {
      haze: '#dba286',
      rim: '#ffd39c',
      stone: '#ecc9a6',
      cloudLight: '#ffe0c2',
      cloudShade: '#b9737f',
      marble: '#ffe3c0',
      marbleShade: '#b98a80',
      rock: '#cf9c78',
      leaf: '#5e5a3c',
      earth: '#9e7254',
      tile: '#c86a44',
      golden,
      lit: false,
    };
  // Clear day: warm-white marble, Aegean air, dry Attic earth.
  return {
    haze: '#a6c4dc',
    rim: '#fff3d6',
    stone: '#e6dcc6',
    cloudLight: '#ffffff',
    cloudShade: '#a9bdd2',
    marble: '#f7eedb',
    marbleShade: '#b9b7b0',
    rock: '#c4b190',
    leaf: '#5f6b44',
    earth: '#a88e62',
    tile: '#b8643e',
    golden,
    lit: false,
  };
};

/** CSS variables of a Greek light (kit variables plus the Greek ones). */
export const hellenicLightStyle = (l: HellenicLight) =>
  ({
    ...sceneLightStyle(l),
    '--marble': l.marble,
    '--marble-shade': l.marbleShade,
    '--rock': l.rock,
    '--leaf': l.leaf,
    '--earth': l.earth,
    '--tile': l.tile,
  }) as React.CSSProperties;

interface Props extends HellenicLightInput {
  /** Seed of the day's city (see `generateHellenicLandscape`). */
  seed: number;
  layout?: HellenicLayout;
  moonPhase: number;
  starOpacity: number;
  /** Draw the gnomon (day) / klepsydra (night) at the centre (clock hero). */
  instrument?: boolean;
  /**
   * Sun and moon at given positions instead of the hour arc (info hero, which
   * places them by their real altitude and azimuth). `null` = below the horizon.
   */
  bodies?: { sun: { x: number; y: number } | null; moon: { x: number; y: number } | null };
  /** Extra figures standing on the ground, in front of the city. */
  figures?: React.ReactNode;
  /** The weather layer, drawn between the sky bodies and the landscape. */
  children?: React.ReactNode;
}

const Shapes: React.FC<{
  list: HellenicMonument[];
  depth: string;
  lit: boolean;
  uid: string;
}> = ({ list, depth, lit, uid }) => (
  <g className={depth}>
    {list.map((m, i) => (
      <g key={`${m.id}-${i}`} className={`hs-m hs-m--${m.kind}`}>
        <MonumentShape m={m} lit={lit} uid={uid} />
      </g>
    ))}
  </g>
);

const HellenicScene: React.FC<Props> = props => {
  const {
    seed,
    layout = 'clock',
    isDay,
    progress,
    moonPhase,
    starOpacity,
    weatherCond,
    aurora,
    instrument = false,
    bodies,
    figures,
    children,
  } = props;
  const uid = sceneUid(useId(), 'hs');
  const land = useMemo(() => generateHellenicLandscape(seed, layout), [seed, layout]);
  const light = hellenicSceneLight(props);
  const { snow, fogStyle, veiled, birds, splashes } = sceneFlags(isDay, aurora, weatherCond);
  const veil = veiled ? { filter: 'blur(2.5px)', opacity: 0.45 } : undefined;

  return (
    <SceneRoot light={light} weatherCond={weatherCond}>
      <g className="hs-scene" style={hellenicLightStyle(light)}>
        <SceneDefs uid={uid} />
        <defs>
          <linearGradient id={`${uid}-rock`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="hs-rock-stop hs-rock-stop--top" />
            <stop offset="100%" className="hs-rock-stop" />
          </linearGradient>
          <radialGradient id={`${uid}-lamp`}>
            <stop offset="0%" stopColor="#ffcf7a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffcf7a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {bodies ? (
          <>
            <Stars uid={uid} opacity={starOpacity} />
            {bodies.sun && isDay && (
              <g transform={`translate(${bodies.sun.x}, ${bodies.sun.y})`} style={veil}>
                <Sun uid={uid} golden={light.golden} />
              </g>
            )}
            {bodies.moon && !isDay && (
              <g transform={`translate(${bodies.moon.x}, ${bodies.moon.y})`}>
                <Moon uid={uid} phase={moonPhase} />
              </g>
            )}
          </>
        ) : (
          <SceneSky
            uid={uid}
            isDay={isDay}
            progress={progress}
            moonPhase={moonPhase}
            starOpacity={starOpacity}
            golden={light.golden}
            veiled={veiled}
          />
        )}

        {children}

        {birds && <Birds y={54} />}

        <g style={fogStyle}>
          <path d={land.ridgeFar} className="hs-hymettos" />
          <path d={land.lykabettos.body} className="hs-lykabettos" />
          <path d={land.lykabettos.shade} className="hs-lykabettos-shade" />
          <path d={land.lykabettos.scrub} className="hs-lykabettos-scrub" />
          <path d={land.town} className="hs-town" />
          {land.townWindows.map((w, i) => (
            <rect
              key={i}
              x={w.x}
              y={w.y}
              width={w.w}
              height={w.h}
              className="sk-window sk-window--lit hs-town-window"
              style={{ animationDelay: `${-w.delay}s` }}
            />
          ))}

          <path d={land.rock.body} fill={`url(#${uid}-rock)`} className="hs-rock" />
          <path d={land.rock.facets} className="hs-rock-lit" />
          <path d={land.rock.scrub} className="hs-scrub" />
          <path d={land.rock.wall} className="hs-wall" />
          <path d={land.rock.detail} className="hs-rock-detail" />

          <Shapes list={land.slope} depth="hs-depth-mid" lit={light.lit} uid={uid} />
          <Shapes list={land.acropolis} depth="hs-depth-mid" lit={light.lit} uid={uid} />
          {light.lit && (
            // Glow of the lamp of Kallimachos over the Erechtheion (Paus. 1.26.6–7).
            <circle cx="246" cy="146" r="7" fill={`url(#${uid}-lamp)`} className="sk-torch" />
          )}
          <Shapes list={land.city} depth="hs-depth-near" lit={light.lit} uid={uid} />
        </g>

        <g style={fogStyle}>
          <path d={`${GROUND_TOP} V 206 H ${SCENE_X0} Z`} fill={`url(#${uid}-ground)`} />
          {aurora && (
            <ellipse cx="150" cy="182" rx="190" ry="9" fill={`url(#${uid}-aurora-glow)`} />
          )}
          <path d={PANATHENAIC_WAY} className="hs-road" />
          <path d={GROUND_TOP} className="sk-ground-rim" />
          <path d={land.tufts} className="sk-tufts" />
          <path d={land.shrubs} className="hs-shrubs" />
          {snow && <path d={SNOW_BAND} fill="#f0f4f8" opacity="0.9" />}
          {splashes && <SceneRainSplashes />}
          {figures}
          {instrument && <SceneInstrument uid={uid} isDay={isDay} progress={progress} />}
          {land.foreground.map((m, i) => (
            <g key={`${m.id}-${i}`} className={`hs-fg hs-fg--${m.kind}`}>
              <path d={m.body} className="hs-foreground" />
              {m.relief && <path d={m.relief} className="hs-foreground-lit" />}
            </g>
          ))}
        </g>
      </g>
    </SceneRoot>
  );
};

export default HellenicScene;

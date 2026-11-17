import React, { useId } from 'react';
import { WeatherCondition } from '../types';
import { WeatherParticles } from '../utils/weatherParticles';
import { SCENE_W, SCENE_X0, seededRandom } from '../utils/sceneKit';
import { generateWindStreaks } from './WeatherSvgEffects';
import './SceneKit.css';

/**
 * Weather of the procedural hero scenes (scene kit). A hero passes it to
 * `WeatherSvgEffects` through its `effects` prop; `WeatherSvgEffects` keeps
 * handling the aurora crossfade. Heroes without a scene use the default
 * effects of `WeatherSvgEffects`.
 *
 * It is drawn between the sky bodies and the landscape, and takes its cloud
 * colours from the scene's light (`--cloud-light`, `--cloud-shade`, inherited
 * from `SceneRoot` or any ancestor that sets them), so clouds turn pink at
 * sunset and dark blue at night.
 *
 * Clouds: three depths of cumulus (far, mid, near). Each depth is a 300-wide
 * tile drawn twice and shifted by exactly one tile per loop, so the drift is
 * seamless. Rain and snow reuse the shared particles in two depths.
 */

interface Props {
  condition: WeatherCondition;
  weatherParticles: WeatherParticles;
  /** 0–1 */
  rainIntensity: number;
  /** km/h; speeds up the clouds and adds wind streaks from 28. */
  windGusts: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
/** Maps x from 0…range onto the full visible span (the shared particles cover 0…300). */
const spread = (x: number, range: number) => r1(SCENE_X0 + (x / range) * SCENE_W);
const rand = seededRandom(1177);

const circle = (cx: number, cy: number, r: number) =>
  `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0Z`;

/** Cumulus: a flat pill for the base and a row of lobes, biggest in the middle. */
const cloud = (x: number, baseY: number, w: number, h: number): string => {
  const cap = h * 0.2;
  const run = r1(w - 2 * cap);
  let d =
    `M${r1(x + cap)} ${r1(baseY)}h${run}a${r1(cap)} ${r1(cap)} 0 0 0 0 ${r1(-2 * cap)}` +
    `h${-run}a${r1(cap)} ${r1(cap)} 0 0 0 0 ${r1(2 * cap)}Z`;
  const lobes = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < lobes; i++) {
    const t = (i + 0.5) / lobes;
    const r = h * (0.28 + 0.3 * Math.sin(Math.PI * t)) * (0.8 + rand() * 0.4);
    d += circle(x + w * (0.12 + 0.76 * t), baseY - h * 0.25 - r * 0.55, r);
  }
  return d;
};

interface CloudLayer {
  key: string;
  clouds: string[];
  /** Seconds for one tile at no wind. */
  dur: number;
  opacity: number;
}

const tile = (count: number, pitch: number, place: (i: number) => string) =>
  Array.from({ length: count }, (_, i) => place(i * pitch));

const LAYERS: CloudLayer[] = [
  {
    key: 'far',
    clouds: tile(6, 50, x =>
      cloud(x + rand() * 20, 54 + rand() * 26, 28 + rand() * 16, 8 + rand() * 4),
    ),
    dur: 260,
    opacity: 0.6,
  },
  {
    key: 'mid',
    clouds: tile(4, 75, x =>
      cloud(x + rand() * 25, 38 + rand() * 30, 50 + rand() * 25, 14 + rand() * 6),
    ),
    dur: 160,
    opacity: 0.85,
  },
  {
    key: 'near',
    clouds: tile(3, 100, x =>
      cloud(x + rand() * 30, 24 + rand() * 18, 80 + rand() * 30, 20 + rand() * 8),
    ),
    dur: 100,
    opacity: 0.95,
  },
];

const SPLASHES = Array.from({ length: 18 }, () => ({
  x: r1(SCENE_X0 + rand() * SCENE_W),
  y: r1(183 + rand() * 15),
  dur: r1(0.7 + rand() * 0.6),
  delay: r1(-rand() * 2),
}));

const FOG_BANKS = [
  { cx: 60, cy: 118, rx: 150, ry: 13, dur: 46, dir: 1, o: 0.55 },
  { cx: 230, cy: 136, rx: 170, ry: 16, dur: 58, dir: -1, o: 0.6 },
  { cx: 130, cy: 154, rx: 190, ry: 18, dur: 40, dir: 1, o: 0.7 },
  { cx: 200, cy: 172, rx: 200, ry: 20, dur: 66, dir: -1, o: 0.8 },
];

const BOLT = 'M212 44L204 70L213 72L200 101L209 103L196 137L203 138L191 170';

/** Which cloud depths each sky shows. */
const cloudDepths = (condition: WeatherCondition): string[] => {
  if (condition === 'partly-cloudy') return ['far', 'mid'];
  if (condition === 'snow') return ['far', 'mid'];
  if (condition === 'cloudy' || condition === 'rain' || condition === 'storm')
    return ['far', 'mid', 'near'];
  return [];
};

const SceneWeather: React.FC<Props> = ({
  condition,
  weatherParticles,
  rainIntensity,
  windGusts,
}) => {
  const uid = `rw${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const windStreaks = React.useMemo(() => generateWindStreaks(windGusts), [windGusts]);
  const depths = cloudDepths(condition);
  const wet = condition === 'rain' || condition === 'storm';
  const heavy = wet || condition === 'snow';
  const overcast = heavy || condition === 'cloudy';
  const windSpeed = 1 + Math.min(windGusts, 90) / 40;

  return (
    <g className={`scene-weather${heavy ? ' scene-weather--heavy' : ''}`}>
      <defs>
        <linearGradient id={`${uid}-cloud`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="sw-cloud-stop sw-cloud-stop--light" />
          <stop offset="100%" className="sw-cloud-stop" />
        </linearGradient>
        <linearGradient id={`${uid}-veil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="sw-cloud-stop" stopOpacity="0.85" />
          <stop offset="100%" className="sw-cloud-stop" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={`${uid}-fog`}>
          <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#e5e7eb" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Overcast: the upper sky closes in. */}
      {overcast && (
        <rect
          x={SCENE_X0}
          y="0"
          width={SCENE_W}
          height={wet ? 130 : 100}
          fill={`url(#${uid}-veil)`}
          opacity={condition === 'storm' ? 0.95 : 0.7}
        />
      )}

      {LAYERS.filter(l => depths.includes(l.key)).map(l => (
        <g key={l.key} opacity={l.opacity}>
          <g className="sw-drift" style={{ animationDuration: `${r1(l.dur / windSpeed)}s` }}>
            {/* Three copies: the drift runs −300 → 0, and the view spans −30…330. */}
            {[-300, 0, 300].map(shift => (
              <g key={shift} transform={`translate(${shift} 0)`}>
                {l.clouds.map((d, i) => (
                  <path key={i} d={d} fill={`url(#${uid}-cloud)`} />
                ))}
              </g>
            ))}
          </g>
        </g>
      ))}

      {/* Lightning: on the same clock as the white flash over the hero. */}
      {condition === 'storm' && (
        <g className="sw-bolt" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={BOLT} stroke="#bcd4ff" strokeWidth="3.6" opacity="0.35" />
          <path d={BOLT} stroke="#ffffff" strokeWidth="1" />
        </g>
      )}

      {wet && (
        <>
          {/* Far rain: thinner, shorter, slower. */}
          <g stroke="#9fb0c6" strokeLinecap="round">
            {weatherParticles.rain.map(
              (drop, i) =>
                i % 2 === 0 && (
                  <line
                    key={`far-${i}`}
                    x1={spread((drop.x + 167) % 360, 360)}
                    y1={drop.y}
                    x2={spread((drop.x + 167) % 360, 360) + drop.drift * 0.55}
                    y2={drop.y + drop.length * 0.55}
                    strokeWidth={drop.width * 0.5}
                    opacity={drop.opacity * 0.6}
                    className="anim-fall"
                    style={
                      {
                        '--drift': `${drop.driftPx}px`,
                        '--dur': `${drop.dur * 1.4}s`,
                        animationDelay: `${drop.delay * 1.4}s`,
                      } as React.CSSProperties
                    }
                  />
                ),
            )}
          </g>
          <g stroke="#c3d0e2" strokeLinecap="round">
            {weatherParticles.rain.map((drop, i) => (
              <line
                key={`near-${i}`}
                x1={drop.x}
                y1={drop.y}
                x2={drop.x + drop.drift}
                y2={drop.y + drop.length}
                strokeWidth={drop.width}
                opacity={drop.opacity}
                className="anim-fall"
                style={
                  {
                    '--drift': `${drop.driftPx}px`,
                    '--dur': `${drop.dur}s`,
                    animationDelay: `${drop.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </g>
          <rect
            x={SCENE_X0}
            y="140"
            width={SCENE_W}
            height="60"
            fill={`url(#${uid}-mist)`}
            opacity={0.25 + rainIntensity * 0.5}
          />
        </>
      )}

      {condition === 'snow' && (
        <g fill="#ffffff">
          {weatherParticles.snow.map((flake, i) => (
            <React.Fragment key={i}>
              {/* Far flake, then the near one. */}
              <circle
                cx={spread((flake.x + 151) % 300, 300)}
                cy={flake.y}
                r={flake.r * 0.45}
                opacity={flake.opacity * 0.55}
                className="anim-fall"
                style={
                  {
                    '--drift': `${flake.drift * 0.6}px`,
                    '--dur': `${flake.dur * 1.6}s`,
                    animationDelay: `${flake.delay * 1.6}s`,
                  } as React.CSSProperties
                }
              />
              <circle
                cx={spread(flake.x, 300)}
                cy={flake.y}
                r={flake.r}
                opacity={flake.opacity}
                className="anim-fall"
                style={
                  {
                    '--drift': `${flake.drift}px`,
                    '--dur': `${flake.dur}s`,
                    animationDelay: `${flake.delay}s`,
                  } as React.CSSProperties
                }
              />
            </React.Fragment>
          ))}
        </g>
      )}

      {condition === 'fog' && (
        <>
          <rect
            x={SCENE_X0}
            y="100"
            width={SCENE_W}
            height="100"
            fill={`url(#${uid}-mist)`}
            opacity="0.8"
          />
          {FOG_BANKS.map(b => (
            <ellipse
              key={b.cy}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={`url(#${uid}-fog)`}
              opacity={b.o}
              className="sw-fog"
              style={
                {
                  '--shift': `${b.dir * 40}px`,
                  animationDuration: `${b.dur}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </>
      )}

      {windStreaks.map((streak, i) => (
        <line
          key={`wind-${i}`}
          x1={streak.startX}
          y1={streak.y}
          x2={streak.startX + streak.length}
          y2={streak.y}
          stroke="#e6dcc0"
          strokeWidth={streak.strokeWidth}
          strokeLinecap="round"
          className="anim-wind"
          style={
            {
              '--wd': `${streak.dur}s`,
              '--ws': `${streak.startX - streak.endX}px`,
              '--we': `${streak.endX - streak.startX}px`,
              '--wo': streak.opacity,
              animationDelay: `${streak.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </g>
  );
};

/**
 * Splashes where the rain hits the ground. Drawn by `RomanScene` on top of the
 * ground (the weather layer itself sits behind the landscape).
 */
export const SceneRainSplashes: React.FC = () => (
  <g className="sw-splashes">
    {SPLASHES.map((s, i) => (
      <ellipse
        key={i}
        cx={s.x}
        cy={s.y}
        rx="2.6"
        ry="0.7"
        className="sw-splash"
        style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
      />
    ))}
  </g>
);

export default SceneWeather;

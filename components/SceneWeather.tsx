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
 * Clouds: bands closed at the top of the sky (see `Band`). Rain and snow
 * reuse the shared particles in two depths.
 */

interface Props {
  condition: WeatherCondition;
  weatherParticles: WeatherParticles;
  /** 0–1 */
  rainIntensity: number;
  /** km/h; adds far cloud bands and wind streaks from 28. */
  windGusts: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
/** Maps x from 0…range onto the full visible span (the shared particles cover 0…300). */
const spread = (x: number, range: number) => r1(SCENE_X0 + (x / range) * SCENE_W);
const rand = seededRandom(1177);

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

/**
 * Cloud bands closed at the top of the sky (the original SVG weather): the
 * sky reads as covered, not as clouds floating in it. Each band is drawn in a
 * scene light colour, so it follows the hour (pink at dawn and dusk, dark
 * blue at night). `anim-cloud-*` (index.css) sway them back and forth.
 */
interface Band {
  d: string;
  /** Fill class in SceneKit.css. */
  tone: 'shade' | 'light' | 'storm' | 'storm-deep';
  anim: 'fast' | 'slow' | 'bg';
  opacity?: number;
}

const BG_BANDS: Band[] = [
  {
    d: 'M -200 35 Q 0 15 100 40 T 300 25 T 500 38 L 500 -20 L -200 -20 Z',
    tone: 'shade',
    anim: 'bg',
  },
  {
    d: 'M -200 58 Q 40 38 130 62 T 330 48 T 500 58 L 500 -20 L -200 -20 Z',
    tone: 'light',
    anim: 'bg',
    opacity: 0.7,
  },
];

const MID_BANDS: Band[] = [
  {
    d: 'M -200 40 Q 50 10 120 50 T 250 30 T 500 60 L 500 -20 L -200 -20 Z',
    tone: 'shade',
    anim: 'fast',
  },
  {
    d: 'M -200 70 Q 80 50 150 70 T 350 90 T 500 70 L 500 -20 L -200 -20 Z',
    tone: 'light',
    anim: 'slow',
    opacity: 0.6,
  },
];

const STORM_BANDS: Band[] = [
  {
    d: 'M -200 50 Q 30 20 80 40 T 180 30 T 280 50 T 500 30 L 500 -20 L -200 -20 Z',
    tone: 'storm',
    anim: 'slow',
  },
  {
    d: 'M -200 80 Q 70 50 160 80 T 350 60 T 500 80 L 500 -20 L -200 -20 Z',
    tone: 'storm-deep',
    anim: 'fast',
    opacity: 0.8,
  },
];

const SNOW_BANDS: Band[] = [
  {
    d: 'M -200 30 Q 60 5 140 35 T 350 20 T 500 30 L 500 -20 L -200 -20 Z',
    tone: 'shade',
    anim: 'slow',
  },
  {
    d: 'M -200 60 Q 80 35 170 55 T 350 50 T 500 60 L 500 -20 L -200 -20 Z',
    tone: 'light',
    anim: 'fast',
    opacity: 0.7,
  },
];

/** Opacity of the far (windy) bands; 0.15 otherwise. */
const BG_OPACITY: Partial<Record<WeatherCondition, number>> = {
  'partly-cloudy': 0.1,
  cloudy: 0.22,
};

/** Opacity of the mid bands per sky (the original values). */
const MID_OPACITY: Partial<Record<WeatherCondition, number>> = {
  'partly-cloudy': 0.16,
  cloudy: 0.39,
  rain: 0.23,
  storm: 0.23,
};

const BandGroup: React.FC<{ bands: Band[]; opacity: number }> = ({ bands, opacity }) => (
  <g opacity={opacity}>
    {bands.map(b => (
      <path
        key={b.d}
        d={b.d}
        className={`sw-band sw-band--${b.tone} anim-cloud-${b.anim}`}
        opacity={b.opacity}
      />
    ))}
  </g>
);

const SceneWeather: React.FC<Props> = ({
  condition,
  weatherParticles,
  rainIntensity,
  windGusts,
}) => {
  const uid = `rw${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const windStreaks = React.useMemo(() => generateWindStreaks(windGusts), [windGusts]);
  const mid = MID_OPACITY[condition];
  const cloudy = condition === 'cloudy' || condition === 'rain' || condition === 'storm';
  const wet = condition === 'rain' || condition === 'storm';
  const heavy = wet || condition === 'snow';

  return (
    <g className={`scene-weather${heavy ? ' scene-weather--heavy' : ''}`}>
      <defs>
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

      {/* Far bands, only when windy (as in the original weather). */}
      {windStreaks.length > 0 && (condition === 'partly-cloudy' || cloudy) && (
        <BandGroup bands={BG_BANDS} opacity={BG_OPACITY[condition] ?? 0.15} />
      )}
      {mid !== undefined && <BandGroup bands={MID_BANDS} opacity={mid} />}
      {condition === 'storm' && <BandGroup bands={STORM_BANDS} opacity={0.6} />}
      {condition === 'snow' && <BandGroup bands={SNOW_BANDS} opacity={0.6} />}

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
          className="sw-wind anim-wind"
          strokeWidth={streak.strokeWidth}
          strokeLinecap="round"
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

import React, { useEffect, useState } from 'react';
import { WeatherCondition } from '../types';
import { WeatherParticles } from '../utils/weatherParticles';
import AuroraSvg from './AuroraSvg';

/** Crossfade between the aurora placeholder and the real weather effects. */
const AURORA_FADE_MS = 1500;

interface WindStreak {
  y: number;
  length: number;
  opacity: number;
  dur: number;
  delay: number;
  startX: number;
  endX: number;
  strokeWidth: number;
}

function generateWindStreaks(gusts: number): WindStreak[] {
  if (gusts < 28) return [];
  const t = Math.min(1, (gusts - 28) / 61);
  const count = Math.round(6 + t * 16);
  return Array.from({ length: count }).map(() => {
    const dur = 1.2 - t * 0.5 + Math.random() * 0.6;
    const length = 18 + t * 40 + Math.random() * 15;
    return {
      y: 20 + Math.random() * 160,
      length,
      opacity: 0.18 + t * 0.22 + Math.random() * 0.08,
      dur,
      delay: -(Math.random() * dur * 3),
      startX: -length - Math.random() * 60,
      endX: 310 + Math.random() * 60,
      strokeWidth: 0.5 + t * 0.8 + Math.random() * 0.4,
    };
  });
}

interface Props {
  condition: WeatherCondition;
  weatherParticles: WeatherParticles;
  /** Unique DOM id for the fog ground gradient — must differ per rendered instance */
  fogGradientId: string;
  cloudOpacity?: number;
  stormOpacity?: number;
  /** 0–1 rain intensity; scales mist opacity during rain+wind. */
  rainIntensity?: number;
  /** Current wind gusts in km/h; shows wind streaks when ≥ 28. */
  windGusts?: number;
  /**
   * When true, renders an aurora borealis instead of the weather (no data: offline, failed or slow fetch).
   * Turning it off crossfades the aurora out and the real effects in.
   */
  offline?: boolean;
}

const WeatherSvgEffects: React.FC<Props> = ({
  condition,
  weatherParticles,
  fogGradientId,
  cloudOpacity = 0.65,
  stormOpacity = 0.6,
  rainIntensity = 0.5,
  windGusts = 0,
  offline = false,
}) => {
  // Keep the aurora mounted for the fade-out after `offline` turns false. Derived during
  // render (not in an effect) so there is no frame without either layer.
  const [prevOffline, setPrevOffline] = useState(offline);
  const [auroraLeaving, setAuroraLeaving] = useState(false);
  if (prevOffline !== offline) {
    setPrevOffline(offline);
    setAuroraLeaving(!offline);
  }
  useEffect(() => {
    if (!auroraLeaving) return;
    const t = setTimeout(() => setAuroraLeaving(false), AURORA_FADE_MS);
    return () => clearTimeout(t);
  }, [auroraLeaving]);

  const windStreaks = React.useMemo(() => generateWindStreaks(windGusts), [windGusts]);

  const fade = { animationDuration: `${AURORA_FADE_MS}ms` };
  const aurora = (offline || auroraLeaving) && (
    <AuroraSvg className={offline ? 'aurora-fade-in' : 'aurora-fade-out'} style={fade} />
  );

  const showEffects = !offline && condition !== 'clear';
  const cloudFill1 = '#94a3b8';
  const cloudFill2 = '#cbd5e1';
  const mistGradientId = `${fogGradientId}-mist`;

  return (
    <>
      {aurora}
      {showEffects && (
      <g className={auroraLeaving ? 'aurora-fade-in' : undefined} style={auroraLeaving ? fade : undefined}>
      {(condition === 'partly-cloudy' || condition === 'cloudy' || condition === 'rain' || condition === 'storm') && (
        <>
          {/* Far background cloud layers — only when windy */}
          {windStreaks.length > 0 && (
            <g opacity={condition === 'partly-cloudy' ? 0.10 : condition === 'cloudy' ? 0.22 : 0.15}>
              <path d="M -200 35 Q 0 15 100 40 T 300 25 T 500 38 L 500 -20 L -200 -20 Z" fill="#8fa3b8" className="anim-cloud-bg" />
              <path d="M -200 58 Q 40 38 130 62 T 330 48 T 500 58 L 500 -20 L -200 -20 Z" fill="#a3b5c5" opacity={0.7} className="anim-cloud-bg" />
            </g>
          )}
          {/* Mid cloud band — always shown */}
          <g opacity={condition === 'partly-cloudy' ? cloudOpacity * 0.25 : condition === 'cloudy' ? cloudOpacity * 0.6 : cloudOpacity * 0.35}>
            <path d="M -200 40 Q 50 10 120 50 T 250 30 T 500 60 L 500 -20 L -200 -20 Z" fill={cloudFill1} className="anim-cloud-fast" />
            <path d="M -200 70 Q 80 50 150 70 T 350 90 T 500 70 L 500 -20 L -200 -20 Z" fill={cloudFill2} opacity="0.6" className="anim-cloud-slow" />
          </g>
        </>
      )}

      {condition === 'snow' && (
        <g opacity="0.6">
          <path d="M -200 30 Q 60 5 140 35 T 350 20 T 500 30 L 500 -20 L -200 -20 Z" fill="#6b7280" className="anim-cloud-slow" />
          <path d="M -200 60 Q 80 35 170 55 T 350 50 T 500 60 L 500 -20 L -200 -20 Z" fill="#9ca3af" opacity="0.7" className="anim-cloud-fast" />
        </g>
      )}

      {condition === 'fog' && (
        <g>
          <defs>
            <linearGradient id={fogGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#d1d5db" stopOpacity="0" />
              <stop offset="40%"  stopColor="#d1d5db" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <rect x="-10" y="115" width="320" height="90" fill={`url(#${fogGradientId})`} opacity="0.85" />
          <ellipse cx="70"  cy="105" rx="130" ry="14" fill="#e5e7eb" opacity="0.5"  className="anim-cloud-slow" />
          <ellipse cx="220" cy="95"  rx="110" ry="11" fill="#f3f4f6" opacity="0.4"  className="anim-cloud-fast" />
          <ellipse cx="150" cy="120" rx="160" ry="16" fill="#e5e7eb" opacity="0.55" className="anim-cloud-slow" />
        </g>
      )}

      {(condition === 'storm' || condition === 'rain') && (
        <g className="animate-[pulse_10s_ease-in-out_infinite]" opacity={stormOpacity}>
          <path d="M -200 50 Q 30 20 80 40 T 180 30 T 280 50 T 500 30 L 500 -20 L -200 -20 Z" fill="#1e293b" className="anim-cloud-slow" />
          <path d="M -200 80 Q 70 50 160 80 T 350 60 T 500 80 L 500 -20 L -200 -20 Z" fill="#0f172a" opacity="0.8" className="anim-cloud-fast" />
        </g>
      )}

      {(condition === 'rain' || condition === 'storm') && (
        <>
          <g>
            {weatherParticles.rain.map((drop, i) => (
              <line
                key={`rain-${i}`}
                x1={drop.x}               y1={drop.y}
                x2={drop.x + drop.drift}  y2={drop.y + drop.length}
                stroke="#94a3b8"
                strokeWidth={drop.width}
                opacity={drop.opacity}
                className="anim-fall"
                style={{ '--drift': `${drop.driftPx}px`, '--dur': `${drop.dur}s`, animationDelay: `${drop.delay}s` } as React.CSSProperties}
              />
            ))}
          </g>
          {/* Ground mist + splash streaks — only when windy */}
          {windStreaks.length > 0 && (
            <>
              <defs>
                <linearGradient id={mistGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#94a3b8" stopOpacity={0} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={rainIntensity * 0.55} />
                </linearGradient>
              </defs>
              <rect
                x="-10" y="140" width="320" height="70"
                fill={`url(#${mistGradientId})`}
                className="anim-mist"
                style={{ '--md': '6s', '--mb': rainIntensity * 0.5 } as React.CSSProperties}
              />
              {([0.15, 0.35, 0.55, 0.72, 0.88] as const).map((frac, i) => (
                <line
                  key={`splash-${frac}`}
                  x1={frac * 300 - 6} y1={170 + i * 4}
                  x2={frac * 300 + 6} y2={170 + i * 4}
                  stroke="#cbd5e1"
                  strokeWidth={0.6}
                  strokeLinecap="round"
                  className="anim-mist"
                  style={{ '--md': `${3.5 + i * 0.7}s`, '--mb': rainIntensity * 0.4, animationDelay: `${i * 0.9}s` } as React.CSSProperties}
                />
              ))}
            </>
          )}
        </>
      )}

      {condition === 'snow' && (
        <g>
          {weatherParticles.snow.map((flake, i) => (
            <circle
              key={`snow-${i}`}
              cx={flake.x}  cy={flake.y}  r={flake.r}
              fill="#ffffff"
              opacity={flake.opacity}
              className="anim-fall"
              style={{ '--drift': `${flake.drift}px`, '--dur': `${flake.dur}s`, animationDelay: `${flake.delay}s` } as React.CSSProperties}
            />
          ))}
        </g>
      )}
      </g>
      )}

      {/* Wind streaks — rendered last (on top of all effects), only when not offline */}
      {!offline && windStreaks.length > 0 && (
        <g>
          {windStreaks.map((streak, i) => (
            <line
              key={`wind-${i}`}
              x1={streak.startX} y1={streak.y}
              x2={streak.startX + streak.length} y2={streak.y}
              stroke="#d4c5a0"
              strokeWidth={streak.strokeWidth}
              strokeLinecap="round"
              className="anim-wind"
              style={{
                '--wd': `${streak.dur}s`,
                '--ws': `${streak.startX - streak.endX}px`,
                '--we': `${streak.endX - streak.startX}px`,
                '--wo': streak.opacity,
                animationDelay: `${streak.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </g>
      )}
    </>
  );
};

export default WeatherSvgEffects;

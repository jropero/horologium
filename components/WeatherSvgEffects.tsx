import React from 'react';
import { WeatherCondition } from '../types';
import { WeatherParticles } from '../utils/weatherParticles';

interface Props {
  condition: WeatherCondition;
  weatherParticles: WeatherParticles;
  /** Unique DOM id for the fog ground gradient — must differ per rendered instance */
  fogGradientId: string;
  cloudOpacity?: number;
  stormOpacity?: number;
  /** When true (offline), renders cloud shapes in a greenish aura palette instead of gray. */
  offline?: boolean;
}

const WeatherSvgEffects: React.FC<Props> = ({
  condition,
  weatherParticles,
  fogGradientId,
  cloudOpacity = 0.65,
  stormOpacity = 0.6,
  offline = false,
}) => {
  if (condition === 'clear') return null;

  // Offline mode: northern lights aurora instead of clouds
  if (offline) {
    return (
      <>
        <defs>
          <filter id="aurora-bg-blur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          {/* Emerald green – peaks in the upper third */}
          <linearGradient id="aurora-g1-o" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#34d399" stopOpacity="0" />
            <stop offset="22%"  stopColor="#10b981" stopOpacity="0.70" />
            <stop offset="55%"  stopColor="#059669" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </linearGradient>
          {/* Teal – peaks high, near the top edge */}
          <linearGradient id="aurora-g2-o" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a5f3fc" stopOpacity="0.15" />
            <stop offset="12%"  stopColor="#22d3ee" stopOpacity="0.65" />
            <stop offset="45%"  stopColor="#06b6d4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0" />
          </linearGradient>
          {/* Purple fringe – very top only, fades quickly */}
          <linearGradient id="aurora-g3-o" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e9d5ff" stopOpacity="0.20" />
            <stop offset="10%"  stopColor="#a78bfa" stopOpacity="0.55" />
            <stop offset="35%"  stopColor="#34d399" stopOpacity="0.30" />
            <stop offset="70%"  stopColor="#059669" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </linearGradient>
          {/* Bright green – tallest band, provides the main glow column */}
          <linearGradient id="aurora-g4-o" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6ee7b7" stopOpacity="0" />
            <stop offset="18%"  stopColor="#34d399" stopOpacity="0.72" />
            <stop offset="62%"  stopColor="#10b981" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient sky glow behind all strips */}
        <ellipse cx="150" cy="42" rx="155" ry="50" fill="#10b981" opacity="0.09" filter="url(#aurora-bg-blur)" />

        {/* Strip 1 – green, x≈8→277 */}
        <path
          d="M 8 0 C -10 58 28 118 5 175 L 274 175 C 292 118 254 58 277 0 Z"
          fill="url(#aurora-g1-o)"
          opacity="0.32"
          className="anim-aurora-1"
        />

        {/* Strip 2 – teal, x≈65→334 */}
        <path
          d="M 65 0 C 80 58 48 118 68 175 L 332 175 C 350 118 320 58 334 0 Z"
          fill="url(#aurora-g2-o)"
          opacity="0.32"
          className="anim-aurora-2"
        />

        {/* Strip 3 – purple→green, x≈120→394 */}
        <path
          d="M 120 0 C 105 58 140 118 115 175 L 390 175 C 407 118 372 58 394 0 Z"
          fill="url(#aurora-g3-o)"
          opacity="0.36"
          className="anim-aurora-3"
        />

        {/* Strip 4 – green, x≈178→450 */}
        <path
          d="M 178 0 C 160 58 196 118 172 175 L 447 175 C 464 118 430 58 450 0 Z"
          fill="url(#aurora-g1-o)"
          opacity="0.30"
          className="anim-aurora-2"
          style={{ animationDelay: '-2.5s' }}
        />

        {/* Strip 5 – bright green, x≈238→514 */}
        <path
          d="M 238 0 C 220 58 255 118 233 175 L 512 175 C 522 118 492 58 514 0 Z"
          fill="url(#aurora-g4-o)"
          opacity="0.28"
          className="anim-aurora-1"
          style={{ animationDelay: '-5s' }}
        />
      </>
    );
  }

  const cloudFill1 = '#94a3b8';
  const cloudFill2 = '#cbd5e1';

  return (
    <>
      {(condition === 'partly-cloudy' || condition === 'cloudy' || condition === 'rain' || condition === 'storm') && (
        <g opacity={condition === 'partly-cloudy' ? cloudOpacity * 0.25 : condition === 'cloudy' ? cloudOpacity * 0.6 : cloudOpacity * 0.35}>
          <path d="M -200 40 Q 50 10 120 50 T 250 30 T 500 60 L 500 -20 L -200 -20 Z" fill={cloudFill1} className="anim-cloud-fast" />
          <path d="M -200 70 Q 80 50 150 70 T 350 90 T 500 70 L 500 -20 L -200 -20 Z" fill={cloudFill2} opacity="0.6" className="anim-cloud-slow" />
        </g>
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
    </>
  );
};

export default WeatherSvgEffects;

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
}

const WeatherSvgEffects: React.FC<Props> = ({
  condition,
  weatherParticles,
  fogGradientId,
  cloudOpacity = 0.65,
  stormOpacity = 0.6,
}) => {
  if (condition === 'clear') return null;

  return (
    <>
      {condition === 'cloudy' && (
        <g opacity={cloudOpacity}>
          <path d="M -200 40 Q 50 10 120 50 T 250 30 T 500 60 L 500 -20 L -200 -20 Z" fill="#94a3b8" className="anim-cloud-fast" />
          <path d="M -200 70 Q 80 50 150 70 T 350 90 T 500 70 L 500 -20 L -200 -20 Z" fill="#cbd5e1" opacity="0.6" className="anim-cloud-slow" />
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

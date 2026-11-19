import React, { useMemo } from 'react';
import { WeatherCondition } from '../types';
import { WeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';
import { generateSkyline } from '../utils/skylineGenerator';

interface Props {
  seed: number;
  isDay: boolean;
  moonPhase: number;
  starOpacity: number;
  weatherCond: WeatherCondition;
  weatherParticles: WeatherParticles;
  rainIntensity: number;
  windGusts: number;
  isOffline: boolean;
  auroraLayers?: { gl: boolean; svg: boolean };
  progressPercent: number;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function RomanClassicScene({
  seed,
  isDay,
  moonPhase,
  starOpacity,
  weatherCond,
  weatherParticles,
  rainIntensity,
  windGusts,
  isOffline,
  auroraLayers,
  progressPercent,
}: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stars = useMemo(() => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        x: Math.random() * 300,
        y: Math.random() * 150,
        size: Math.random() * 2 + 0.5,
        rotation: Math.random() * 90,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }
    return data;
  }, []); // intentionally no deps — fixed random stars per mount

  const skylineElements = useMemo(() => generateSkyline(seed), [seed]);

  const angle = 180 - progressPercent * 180;
  const rad = (angle * Math.PI) / 180;
  const pathRadius = 120;
  const cx = 150;
  const cy = 180;
  const objectX = cx + pathRadius * Math.cos(rad);
  const objectY = cy - pathRadius * Math.sin(rad);

  const renderMoon = (phase: number) => {
    const r = 16;
    const normalizedPhase = ((phase % 1) + 1) % 1;
    const isWaxing = normalizedPhase <= 0.5;
    const sweep1 = isWaxing ? 1 : 0;
    const rx = Math.max(0.1, r * Math.abs(Math.cos(normalizedPhase * Math.PI * 2)));
    const sweep2 =
      (normalizedPhase > 0.25 && normalizedPhase <= 0.5) || normalizedPhase > 0.75 ? 1 : 0;
    const d = `M 0 -${r} A ${r} ${r} 0 0 ${sweep1} 0 ${r} A ${rx} ${r} 0 0 ${sweep2} 0 -${r} Z`;
    const maskId = `rc-moon-mask-${normalizedPhase.toFixed(3)}`;

    const MoonTexture = ({ color, opacity = 1 }: { color: string; opacity?: number }) => (
      <g fill={color} opacity={opacity}>
        <circle cx="4" cy="5" r="3" />
        <circle cx="-5" cy="2" r="2.5" />
        <circle cx="-8" cy="-3" r="1.5" />
        <circle cx="3" cy="-6" r="2" />
        <ellipse cx="6" cy="-1" rx="2" ry="3" transform="rotate(30 6 -1)" />
        <ellipse cx="-2" cy="-8" rx="1.5" ry="2" transform="rotate(-20 -2 -8)" />
      </g>
    );

    return (
      <g transform="rotate(-15)">
        <defs>
          <clipPath id={maskId}>
            <path d={d} />
          </clipPath>
          <radialGradient id="rc-moon-light" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f4e8c1" />
            <stop offset="100%" stopColor="#c2b28f" />
          </radialGradient>
          <radialGradient id="rc-moon-dark" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="100%" stopColor="#121212" />
          </radialGradient>
          <filter id="rc-moon-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="0" cy="0" r={r} fill="url(#rc-moon-dark)" />
        <MoonTexture color="#000000" opacity={0.3} />
        <g clipPath={`url(#${maskId})`} filter="url(#rc-moon-glow)">
          <circle cx="0" cy="0" r={r} fill="url(#rc-moon-light)" />
          <MoonTexture color="#968661" opacity={0.5} />
        </g>
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#e3d6b3"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </g>
    );
  };

  const fogBlur =
    weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 as number } : undefined;
  const sunMoonBlur =
    (weatherCond === 'rain' ||
      weatherCond === 'storm' ||
      weatherCond === 'snow' ||
      weatherCond === 'fog') &&
    isDay
      ? { filter: 'blur(2.5px)', opacity: 0.45 as number }
      : undefined;

  return (
    <>
      {/* Stars + constellation lines */}
      <g style={{ opacity: starOpacity, transition: 'opacity 2000ms ease-in-out' }}>
        {stars.map((star, i) => (
          <path
            key={i}
            d={`M ${star.x} ${star.y - star.size}
                Q ${star.x + star.size / 4} ${star.y - star.size / 4} ${star.x + star.size} ${star.y}
                Q ${star.x + star.size / 4} ${star.y + star.size / 4} ${star.x} ${star.y + star.size}
                Q ${star.x - star.size / 4} ${star.y + star.size / 4} ${star.x - star.size} ${star.y}
                Q ${star.x - star.size / 4} ${star.y - star.size / 4} ${star.x} ${star.y - star.size} Z`}
            fill="#e3d6b3"
            fillOpacity={star.opacity}
            transform={`rotate(${star.rotation} ${star.x} ${star.y})`}
          />
        ))}
        <path
          d="M 50 40 L 80 50 L 100 70 L 120 60"
          stroke="#e3d6b3"
          strokeWidth="0.5"
          strokeDasharray="1 1"
          opacity="0.4"
          fill="none"
        />
        <path
          d="M 220 30 L 250 45 L 260 80"
          stroke="#e3d6b3"
          strokeWidth="0.5"
          strokeDasharray="1 1"
          opacity="0.4"
          fill="none"
        />
      </g>

      {/* Sun path arc */}
      <path
        d="M 30 180 A 120 120 0 0 1 270 180"
        fill="none"
        stroke="#cfb53b"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Sun or Moon */}
      <g transform={`translate(${objectX}, ${objectY})`} style={sunMoonBlur}>
        {isDay ? (
          <g className="roman-clock__sun">
            <circle r="10" fill="#cfb53b" stroke="#8a7826" strokeWidth="1" />
            {[...Array(12)].map((_, i) => (
              <React.Fragment key={i}>
                <line
                  x1="0"
                  y1="-14"
                  x2="0"
                  y2="-20"
                  stroke="#cfb53b"
                  strokeWidth="1.5"
                  transform={`rotate(${i * 30})`}
                />
                <path
                  d="M -2 -14 L 0 -18 L 2 -14"
                  fill="#cfb53b"
                  transform={`rotate(${i * 30 + 15})`}
                />
              </React.Fragment>
            ))}
          </g>
        ) : (
          renderMoon(moonPhase)
        )}
      </g>

      {/* Weather effects (original WeatherSvgEffects without custom effects) */}
      <g className="roman-clock__weather-effects">
        <WeatherSvgEffects
          condition={weatherCond}
          weatherParticles={weatherParticles}
          fogGradientId="fog-ground-roman-classic"
          rainIntensity={rainIntensity}
          windGusts={windGusts}
          offline={isOffline}
          auroraLayers={auroraLayers}
        />
      </g>

      {/* Procedural city skyline */}
      <g className="city-skyline" style={fogBlur}>
        {skylineElements.map(el => (
          <path
            key={el.id}
            d={el.path}
            fill="var(--ink)"
            stroke="var(--gold-dim)"
            strokeWidth="0.5"
            opacity={el.opacity}
          />
        ))}
      </g>

      {/* Ground fill */}
      <g style={fogBlur}>
        <path
          d="M 0 180 L 300 180 L 300 200 L 0 200 Z"
          fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'}
        />
        <path
          d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z"
          fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'}
          stroke={weatherCond === 'snow' ? '#f0f4f8' : 'var(--gold-dim)'}
          strokeWidth="1"
        />
        {weatherCond === 'snow' && (
          <path
            d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z"
            fill="#f0f4f8"
            opacity="0.9"
          />
        )}

        {/* Instrument: Gnomon (day) or Clepsydra (night) */}
        <defs>
          <clipPath id="rc-upper-vessel-clip">
            <path d="M 136 135 L 146 155 L 154 155 L 164 135 Z" />
          </clipPath>
          <clipPath id="rc-lower-vessel-clip">
            <path d="M 146 160 L 136 180 L 164 180 L 154 160 Z" />
          </clipPath>
          <linearGradient id="rc-water-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {isDay ? (
          <g>
            <ellipse cx="150" cy="180" rx="70" ry="14" fill="#8a7826" opacity="0.2" />
            <ellipse cx="150" cy="180" rx="60" ry="10" fill="#e3d6b3" opacity="0.15" />
            {/* Gnomon shadow */}
            <line
              x1="150"
              y1="180"
              x2={150 - Math.cos(rad) * 90}
              y2={185 + (1 - Math.sin(rad)) * 14}
              stroke="var(--hatch-color)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.4"
              className="roman-clock__svg-transition"
            />
            {/* Gnomon */}
            <path
              d="M 147 180 L 153 180 L 150 145 Z"
              fill="#cfb53b"
              stroke="#8a7826"
              strokeWidth="0.5"
            />
            <circle cx="150" cy="145" r="3" fill="#e3d6b3" />
          </g>
        ) : (
          <g className="roman-clock__svg-transition">
            <ellipse cx="150" cy="180" rx="30" ry="6" fill="#8a7826" opacity="0.1" />
            {/* Support arms */}
            <path
              d="M 132 133 Q 120 155 132 181"
              stroke="#cfb53b"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M 168 133 Q 180 155 168 181"
              stroke="#cfb53b"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            {/* Upper vessel */}
            <ellipse
              cx="150"
              cy="135"
              rx="14"
              ry="3"
              fill="none"
              stroke="#cfb53b"
              strokeWidth="0.75"
              opacity="0.8"
            />
            <path
              d="M 136 135 L 146 155 L 154 155 L 164 135"
              fill="#ffffff"
              opacity="0.05"
              stroke="#e3d6b3"
              strokeWidth="0.5"
            />
            {/* Water — upper (decreasing) */}
            <g clipPath="url(#rc-upper-vessel-clip)">
              <rect
                x="130"
                y={135 + 20 * progressPercent}
                width="40"
                height="20"
                fill="url(#rc-water-grad)"
              />
              {progressPercent < 1 && (
                <ellipse
                  cx="150"
                  cy={135 + 20 * progressPercent}
                  rx={14 - 10 * progressPercent}
                  ry={1}
                  fill="#87ceeb"
                  opacity="0.6"
                />
              )}
            </g>
            {/* Drip thread */}
            {progressPercent < 0.99 && (
              <line
                x1="150"
                y1="155"
                x2="150"
                y2={180 - 20 * progressPercent}
                stroke="#87ceeb"
                strokeWidth="1"
                strokeDasharray="3 3"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="6;0"
                  dur="0.3s"
                  repeatCount="indefinite"
                />
              </line>
            )}
            {/* Lower vessel */}
            <ellipse
              cx="150"
              cy="180"
              rx="14"
              ry="3"
              fill="none"
              stroke="#cfb53b"
              strokeWidth="0.75"
              opacity="0.8"
            />
            <path
              d="M 146 160 L 136 180 L 164 180 L 154 160"
              fill="#ffffff"
              opacity="0.05"
              stroke="#e3d6b3"
              strokeWidth="0.5"
            />
            {/* Water — lower (increasing) */}
            <g clipPath="url(#rc-lower-vessel-clip)">
              <rect
                x="130"
                y={180 - 20 * progressPercent}
                width="40"
                height="30"
                fill="url(#rc-water-grad)"
              />
              {progressPercent > 0 && (
                <ellipse
                  cx="150"
                  cy={180 - 20 * progressPercent}
                  rx={14 - 10 * (1 - progressPercent)}
                  ry={1}
                  fill="#87ceeb"
                  opacity="0.6"
                />
              )}
            </g>
            {/* Vessel connector */}
            <rect x="145" y="155" width="10" height="5" fill="#8a7826" />
            <path d="M 144 155 L 156 155" stroke="#cfb53b" strokeWidth="1" />
            <path d="M 144 160 L 156 160" stroke="#cfb53b" strokeWidth="1" />
            {/* Hour marks */}
            {[...Array(12)].map((_, i) => (
              <line
                key={`rc-clep-${i}`}
                x1="133"
                y1={180 - (20 / 12) * i}
                x2="135"
                y2={180 - (20 / 12) * i}
                stroke="#8a7826"
                strokeWidth="0.5"
                opacity="0.8"
              />
            ))}
          </g>
        )}
      </g>
    </>
  );
}

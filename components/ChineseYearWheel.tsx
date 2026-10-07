import React, { useMemo } from 'react';
import { SOLAR_TERMS } from '../utils/chineseCalendarData';
import { WeatherData } from '../types';
import { generateWeatherParticles, RAIN_INTENSITY } from '../utils/weatherParticles';

interface Props {
  currentTermIndex: number; // 0-based (0=立春 … 23=大寒)
  weather?: WeatherData | null;
}

const CX = 160, CY = 160;
const OUTER_R = 142;
const INNER_R = 72;
const LABEL_R = 107; // mid-sector radius for hanzi labels

const toRad = (deg: number) => (deg * Math.PI) / 180;

const SEASONS = [
  { hanzi: '春', es: 'Primavera', dim: '#0d3a22', bright: '#10b981', accent: '#34d399' },
  { hanzi: '夏', es: 'Verano',    dim: '#3b0a14', bright: '#e11d48', accent: '#fb7185' },
  { hanzi: '秋', es: 'Otoño',     dim: '#3d1a03', bright: '#d97706', accent: '#fbbf24' },
  { hanzi: '冬', es: 'Invierno',  dim: '#071827', bright: '#0ea5e9', accent: '#7dd3fc' },
];

// 春分=idx3, 夏至=idx9, 秋分=idx15, 冬至=idx21
const CARDINALS = new Set([3, 9, 15, 21]);

const getSeason = (idx: number) => SEASONS[Math.floor(idx / 6)];

const sectorPath = (idx: number): string => {
  const startDeg = -90 + idx * 15;
  const endDeg = startDeg + 15;
  const s = toRad(startDeg), e = toRad(endDeg);
  const x1 = CX + OUTER_R * Math.cos(s), y1 = CY + OUTER_R * Math.sin(s);
  const x2 = CX + OUTER_R * Math.cos(e), y2 = CY + OUTER_R * Math.sin(e);
  const x3 = CX + INNER_R * Math.cos(e), y3 = CY + INNER_R * Math.sin(e);
  const x4 = CX + INNER_R * Math.cos(s), y4 = CY + INNER_R * Math.sin(s);
  return `M ${x1} ${y1} A ${OUTER_R} ${OUTER_R} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${INNER_R} ${INNER_R} 0 0 0 ${x4} ${y4} Z`;
};

const progressArcPath = (termIndex: number): string => {
  const r = OUTER_R + 7;
  const endDeg = -90 + (termIndex + 0.5) * 15;
  const totalDeg = endDeg - (-90);
  const large = totalDeg > 180 ? 1 : 0;
  const startRad = toRad(-90);
  const endRad = toRad(endDeg);
  const x1 = CX + r * Math.cos(startRad), y1 = CY + r * Math.sin(startRad);
  const x2 = CX + r * Math.cos(endRad), y2 = CY + r * Math.sin(endRad);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

// Proper cloud shape: 3 bump-circles + flat base rect, all same fill.
// Rendered inside a <g opacity> so overlapping shapes merge into one cloud silhouette.
const CloudShape: React.FC<{ cx: number; cy: number; cls: string }> = ({ cx, cy, cls }) => (
  <g className={cls}>
    <ellipse cx={cx - 19} cy={cy + 7}  rx={16} ry={13} />
    <ellipse cx={cx + 2}  cy={cy - 4}  rx={22} ry={19} />
    <ellipse cx={cx + 22} cy={cy + 5}  rx={15} ry={12} />
    <rect    x={cx - 35}  y={cy + 7}   width={77} height={16} rx={5} />
  </g>
);

// Six clouds distributed around the wheel, alternating drift speed for parallax
const CLOUD_POSITIONS: [number, number, string][] = [
  [78,  95,  'anim-cloud-slow'],
  [243, 95,  'anim-cloud-fast'],
  [162, 58,  'anim-cloud-slow'],
  [160, 262, 'anim-cloud-fast'],
  [58,  212, 'anim-cloud-slow'],
  [262, 212, 'anim-cloud-fast'],
];

interface WheelWeatherProps {
  condition: string;
  rain: ReturnType<typeof generateWeatherParticles>['rain'];
  snow: ReturnType<typeof generateWeatherParticles>['snow'];
}

const WheelWeatherOverlay: React.FC<WheelWeatherProps> = ({ condition, rain, snow }) => {
  const showClouds = condition === 'cloudy';
  const showRainClouds = condition === 'rain' || condition === 'storm';
  const showFog = condition === 'fog';
  const showRain = condition === 'rain' || condition === 'storm';
  const showSnow = condition === 'snow';
  const showLightning = condition === 'storm';

  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 320 320"
    >
      <defs>
        <clipPath id="wheel-clip-zh">
          <circle cx={CX} cy={CY} r={OUTER_R + 12} />
        </clipPath>
        <radialGradient id="fog-zh-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#d1d5db" stopOpacity="0.05" />
          <stop offset="60%"  stopColor="#d1d5db" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.45" />
        </radialGradient>
      </defs>

      <g clipPath="url(#wheel-clip-zh)">
        {/* Fog: radial veil + drifting fog wisps */}
        {showFog && (
          <g opacity={0.55}>
            <circle cx={CX} cy={CY} r={OUTER_R + 12} fill="url(#fog-zh-radial)" />
            <ellipse cx="60"  cy="130" rx="120" ry="22" fill="#e5e7eb" opacity="0.35" className="anim-cloud-slow" />
            <ellipse cx="260" cy="160" rx="100" ry="18" fill="#f3f4f6" opacity="0.28" className="anim-cloud-fast" />
            <ellipse cx="155" cy="195" rx="130" ry="20" fill="#e5e7eb" opacity="0.32" className="anim-cloud-slow" />
            <ellipse cx="160" cy="108" rx="110" ry="16" fill="#f3f4f6" opacity="0.25" className="anim-cloud-fast" />
          </g>
        )}

        {/* Cloud-shaped puffs for cloudy */}
        {showClouds && (
          <g opacity={0.22} fill="#cbd5e1">
            {CLOUD_POSITIONS.map(([cx, cy, cls], i) => (
              <CloudShape key={i} cx={cx} cy={cy} cls={cls} />
            ))}
          </g>
        )}

        {/* Dark cloud-shaped puffs for rain/storm */}
        {showRainClouds && (
          <g opacity={0.32} fill="#1e293b">
            {CLOUD_POSITIONS.map(([cx, cy, cls], i) => (
              <CloudShape key={i} cx={cx} cy={cy} cls={cls} />
            ))}
          </g>
        )}

        {/* Rain drops */}
        {showRain && rain.map((drop, i) => (
          <line
            key={i}
            x1={drop.x} y1={drop.y}
            x2={drop.x + drop.drift} y2={drop.y + drop.length}
            stroke="#94a3b8"
            strokeWidth={drop.width}
            opacity={drop.opacity * 0.7}
            className="anim-fall"
            style={{ '--drift': `${drop.driftPx}px`, '--dur': `${drop.dur}s`, animationDelay: `${drop.delay}s` } as React.CSSProperties}
          />
        ))}

        {/* Snowflakes */}
        {showSnow && snow.map((flake, i) => (
          <circle
            key={i}
            cx={flake.x} cy={flake.y} r={flake.r}
            fill="#ffffff"
            opacity={flake.opacity * 0.8}
            className="anim-fall"
            style={{ '--drift': `${flake.drift}px`, '--dur': `${flake.dur}s`, animationDelay: `${flake.delay}s` } as React.CSSProperties}
          />
        ))}

        {/* Lightning flash */}
        {showLightning && (
          <rect x="0" y="0" width="320" height="320" fill="white" opacity="0.15" className="anim-lightning" />
        )}
      </g>
    </svg>
  );
};

const ChineseYearWheel: React.FC<Props> = ({ currentTermIndex, weather }) => {
  const activeTerm = SOLAR_TERMS[currentTermIndex];
  const activeSeason = getSeason(currentTermIndex);
  const condition = weather?.current.condition ?? 'clear';
  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 0] ?? 0;
  const weatherParticles = useMemo(() => generateWeatherParticles(rainIntensity), [rainIntensity]);

  return (
    <div className="w-full bg-ink/90 border border-gold-dim/20 rounded-xl p-4 shadow-xl">
      <h3 className="text-center text-gold-leaf font-serif text-sm uppercase tracking-widest mb-1">
        节气 · Ciclo Solar
      </h3>

      <div className="relative mx-auto max-w-xs">
        <svg width="100%" viewBox="0 0 320 320">
        {/* ── Sectors ── */}
        {SOLAR_TERMS.map((term, idx) => {
          const season = getSeason(idx);
          const isActive = idx === currentTermIndex;
          const isCardinal = CARDINALS.has(idx);
          const midDeg = -90 + (idx + 0.5) * 15;
          const midRad = toRad(midDeg);
          const tx = CX + LABEL_R * Math.cos(midRad);
          const ty = CY + LABEL_R * Math.sin(midRad);
          const textRot = midDeg + 90;

          return (
            <g key={term.id}>
              <path
                d={sectorPath(idx)}
                fill={isActive ? season.bright : season.dim}
                stroke={isActive ? season.accent : '#111827'}
                strokeWidth={isActive ? 1.5 : 0.5}
                opacity={isActive ? 1 : 0.85}
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? '#fef3c7' : isCardinal ? season.accent : '#6b7280'}
                fontSize={isActive ? 10 : isCardinal ? 9 : 8}
                fontWeight={isActive || isCardinal ? 'bold' : 'normal'}
                fontFamily="serif"
                transform={`rotate(${textRot}, ${tx}, ${ty})`}
              >
                {term.hanzi}
              </text>
            </g>
          );
        })}

        {/* ── Season boundary lines ── */}
        {[0, 6, 12, 18].map(termIdx => {
          const rad = toRad(-90 + termIdx * 15);
          return (
            <line
              key={termIdx}
              x1={CX + INNER_R * Math.cos(rad)} y1={CY + INNER_R * Math.sin(rad)}
              x2={CX + OUTER_R * Math.cos(rad)} y2={CY + OUTER_R * Math.sin(rad)}
              stroke="#1f2937"
              strokeWidth={2}
            />
          );
        })}

        {/* ── Season hanzi labels (outer corners) ── */}
        {SEASONS.map((season, sIdx) => {
          const midDeg = -90 + (sIdx * 6 + 3) * 15; // center of each season quadrant
          const rad = toRad(midDeg);
          const r = OUTER_R + 14;
          return (
            <text
              key={season.hanzi}
              x={CX + r * Math.cos(rad)}
              y={CY + r * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={season.accent}
              fontSize={11}
              fontWeight="bold"
              fontFamily="serif"
              opacity={0.7}
            >
              {season.hanzi}
            </text>
          );
        })}

        {/* ── Cardinal dots (equinoxes & solstices) ── */}
        {[3, 9, 15, 21].map(idx => {
          const season = getSeason(idx);
          const midRad = toRad(-90 + (idx + 0.5) * 15);
          return (
            <circle
              key={idx}
              cx={CX + (OUTER_R + 5) * Math.cos(midRad)}
              cy={CY + (OUTER_R + 5) * Math.sin(midRad)}
              r={3}
              fill={season.accent}
            />
          );
        })}

        {/* ── Progress arc ── */}
        <path
          d={progressArcPath(currentTermIndex)}
          fill="none"
          stroke="#fef3c7"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.45}
        />

        {/* ── Center circle ── */}
        <circle
          cx={CX} cy={CY} r={INNER_R - 5}
          fill="#07101d"
          stroke={activeSeason.accent}
          strokeWidth={1}
          opacity={0.6}
        />

        {/* ── Needle ── */}
        {(() => {
          const midRad = toRad(-90 + (currentTermIndex + 0.5) * 15);
          return (
            <line
              x1={CX} y1={CY}
              x2={CX + (INNER_R - 8) * Math.cos(midRad)}
              y2={CY + (INNER_R - 8) * Math.sin(midRad)}
              stroke="#fef3c7"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.55}
            />
          );
        })()}
        <circle cx={CX} cy={CY} r={3} fill="#fef3c7" opacity={0.8} />

        {/* ── Center text: current term ── */}
        <text
          x={CX} y={CY - 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fef3c7"
          fontSize={26}
          fontWeight="bold"
          fontFamily="serif"
        >
          {activeTerm?.hanzi}
        </text>
        <text
          x={CX} y={CY + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9ca3af"
          fontSize={7}
          fontFamily="sans-serif"
        >
          {activeTerm?.pinyin}
        </text>
        <text
          x={CX} y={CY + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#6b7280"
          fontSize={6}
          fontFamily="sans-serif"
        >
          {activeTerm?.translation}
        </text>
      </svg>

        {/* ── Weather overlay ── */}
        {condition !== 'clear' && (
          <WheelWeatherOverlay
            condition={condition}
            rain={weatherParticles.rain}
            snow={weatherParticles.snow}
          />
        )}
      </div>

      {/* ── Season legend ── */}
      <div className="flex justify-center gap-3 mt-1 mb-4">
        {SEASONS.map(s => (
          <div key={s.hanzi} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.bright }} />
            <span className="text-xs text-parchment/50">{s.hanzi} {s.es}</span>
          </div>
        ))}
      </div>

      {/* ── Term list by season ── */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {SEASONS.map((season, sIdx) => {
          const seasonTerms = SOLAR_TERMS.slice(sIdx * 6, sIdx * 6 + 6);
          return (
            <div key={season.hanzi}>
              <div
                className="text-sm font-bold uppercase tracking-widest mb-1.5 pb-0.5 border-b"
                style={{ color: season.accent, borderColor: season.accent + '40' }}
              >
                {season.hanzi} {season.es}
              </div>
              <div className="space-y-1">
                {seasonTerms.map((term, tIdx) => {
                  const globalIdx = sIdx * 6 + tIdx;
                  const isActive = globalIdx === currentTermIndex;
                  const isNext = globalIdx === (currentTermIndex + 1) % 24;
                  return (
                    <div
                      key={term.id}
                      className={`flex items-baseline gap-1.5 rounded px-1.5 py-0.5 ${
                        isActive ? 'bg-white/10' : ''
                      }`}
                    >
                      <span
                        className="font-bold text-base shrink-0 font-serif"
                        style={{ color: isActive ? season.accent : isNext ? season.accent + 'bb' : '#4b5563' }}
                      >
                        {term.hanzi}
                      </span>
                      <span
                        className={`text-xs leading-tight ${
                          isActive ? 'text-parchment/90' : isNext ? 'text-parchment/60' : 'text-parchment/35'
                        }`}
                      >
                        {term.translation}
                      </span>
                      {isActive && (
                        <span className="ml-auto text-xs shrink-0" style={{ color: season.accent }}>◀</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChineseYearWheel;

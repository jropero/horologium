import React, { useMemo } from 'react';
import { RomanTimeData, WeatherData } from '../types';
import { generateEgyptianSkyline } from '../utils/egyptianSkylineGenerator';
import { useCivilization } from '../contexts/CivilizationContext';
import { getEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getEgyptianMonthDeity } from '../utils/egyptianCalendarData';
import { getHemerologyForDate, Prognosis } from '../utils/egyptianHemerologyData';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';

interface EgyptianClockProps {
  modernTime: Date;
  romanTime: RomanTimeData;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

const EgyptianClock: React.FC<EgyptianClockProps> = ({
  modernTime,
  romanTime,
  loading,
  weather,
  onUpdateLocation,
  currentLat,
  currentLng
}) => {
  const { labels } = useCivilization();

  const stars = useMemo(() => {
    const starData = [];
    for (let i = 0; i < 50; i++) {
      starData.push({
        x: Math.random() * 300,
        y: Math.random() * 150,
        size: Math.random() * 2 + 0.5,
        rotation: Math.random() * 90,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    return starData;
  }, []);

  const skylineElements = useMemo(() => {
    const seed = modernTime.getFullYear() * 10000 + (modernTime.getMonth() + 1) * 100 + modernTime.getDate();
    return generateEgyptianSkyline(seed);
  }, [modernTime.getDate()]);

  const egyptianDateInfo = useMemo(() => {
    const eDate = getEgyptianDate(modernTime);
    const deity = getEgyptianMonthDeity(eDate.monthIndex);
    const hemerology = getHemerologyForDate(modernTime, eDate.monthIndex, eDate.dayOfMonth);

    // Determinar en qué tercio del día estamos para el chip
    let currentPrognosis: Prognosis = 'none';
    let partName = '';

    if (!romanTime.isDay) {
      currentPrognosis = hemerology.evening;
      partName = 'Noche';
    } else {
      if (romanTime.romanHour <= 4) {
        currentPrognosis = hemerology.morning;
        partName = 'Mañana';
      } else if (romanTime.romanHour <= 8) {
        currentPrognosis = hemerology.midday;
        partName = 'Mediodía';
      } else {
        currentPrognosis = hemerology.evening;
        partName = 'Tarde';
      }
    }

    return { eDate, deity, hemerology, currentPrognosis, partName };
  }, [modernTime.getDate(), romanTime.romanHour, romanTime.isDay]);

  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 63] ?? 0.45;
  const weatherParticles = useMemo(() => generateWeatherParticles(rainIntensity), [rainIntensity]);

  const progressPercent = useMemo(() => {
    if (!romanTime) return 0;

    const baseTime = romanTime.isDay ? romanTime.sunrise : romanTime.sunset;
    const totalDiffMinutes = (modernTime.getTime() - baseTime.getTime()) / 60000;
    const minutesIntoHour = totalDiffMinutes % romanTime.hourLengthMinutes;

    const hourIndex = romanTime.romanHour - 1;

    const percent = (hourIndex + (minutesIntoHour / romanTime.hourLengthMinutes)) / 12;
    return Math.min(Math.max(percent, 0), 1);
  }, [romanTime, modernTime]);

  const renderMoon = (phase: number) => {
    const r = 16;
    const normalizedPhase = (phase % 1 + 1) % 1;
    const isWaxing = normalizedPhase <= 0.5;
    const sweep1 = isWaxing ? 1 : 0;
    const rx = Math.max(0.1, r * Math.abs(Math.cos(normalizedPhase * Math.PI * 2)));

    let sweep2 = 0;
    if (normalizedPhase <= 0.25) sweep2 = 0;
    else if (normalizedPhase <= 0.5) sweep2 = 1;
    else if (normalizedPhase <= 0.75) sweep2 = 0;
    else sweep2 = 1;

    const d = `M 0 -${r} A ${r} ${r} 0 0 ${sweep1} 0 ${r} A ${rx} ${r} 0 0 ${sweep2} 0 -${r} Z`;
    const maskId = `moon-mask-${normalizedPhase.toFixed(3)}`;

    const MoonTexture = ({ color, opacity = 1 }: { color: string, opacity?: number }) => (
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
          <clipPath id={maskId}><path d={d} /></clipPath>
          <radialGradient id="moon-light" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f4e8c1" />
            <stop offset="100%" stopColor="#c2b28f" />
          </radialGradient>
          <radialGradient id="moon-dark" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="100%" stopColor="#121212" />
          </radialGradient>
          <filter id="moon-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="0" cy="0" r={r} fill="url(#moon-dark)" />
        <MoonTexture color="#000000" opacity={0.3} />
        <g clipPath={`url(#${maskId})`} filter="url(#moon-glow)">
          <circle cx="0" cy="0" r={r} fill="url(#moon-light)" />
          <MoonTexture color="#968661" opacity={0.5} />
        </g>
        <circle cx="0" cy="0" r={r} fill="none" stroke="#e3d6b3" strokeWidth="0.5" opacity="0.3" />
      </g>
    );
  };

  const weatherCond = weather?.current.condition ?? 'clear';

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-ink border-4 border-gold-dim rounded-lg ">
        <span className="font-serif text-2xl text-gold-leaf">{labels.loadingText}</span>
      </div>
    );
  }

  const angle = 180 - (progressPercent * 180);
  const rad = (angle * Math.PI) / 180;
  const pathRadius = 120;
  const cx = 150;
  const cy = 180;

  const objectX = cx + pathRadius * Math.cos(rad);
  const objectY = cy - pathRadius * Math.sin(rad);

  return (
    <div className="w-full max-w-2xl mx-auto shadow-2xl animate-fadeIn" style={{ background: '#0c0804', border: '4px solid rgba(24,64,160,0.55)', borderRadius: '2px' }}>

        <div className="relative overflow-hidden">
          <div className="relative w-full aspect-[16/9] overflow-hidden border-b-2" style={{ borderColor: 'rgba(24,64,160,0.35)' }}>
            <div className="absolute inset-0 woodcut-hatch opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-stardust opacity-30 pointer-events-none"></div>

            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background: (() => {
                  if (weatherCond === 'fog') {
                    return romanTime.isDay
                      ? 'linear-gradient(to bottom, #9ca3af 0%, #d1d5db 50%, #e5e7eb 100%)'
                      : 'linear-gradient(to bottom, #1f2937 0%, #374151 100%)';
                  }
                  if (weatherCond === 'snow') {
                    return romanTime.isDay
                      ? 'linear-gradient(to bottom, #6b7280 0%, #9ca3af 40%, #e5e7eb 100%)'
                      : 'linear-gradient(to bottom, #111827 0%, #1f2937 60%, #374151 100%)';
                  }
                  if (romanTime.isDay) {
                    if (progressPercent < 0.15) {
                      return 'linear-gradient(to bottom, #2b4162 0%, #fa9c7a 60%, var(--parchment) 100%)';
                    } else if (progressPercent > 0.85) {
                      return 'linear-gradient(to bottom, #1e3b70 0%, #29539b 40%, #fd746c 80%, var(--parchment) 100%)';
                    }
                    if (weatherCond === 'cloudy') {
                      return 'linear-gradient(to bottom, #94a3b8 0%, #cbd5e1 60%, #e2e8f0 100%)';
                    }
                    if (weatherCond === 'rain' || weatherCond === 'storm') {
                      return 'linear-gradient(to bottom, #334155 0%, #475569 50%, #64748b 100%)';
                    }
                    return 'linear-gradient(to bottom, #4a90e2 0%, #87ceeb 60%, var(--parchment) 100%)';
                  } else {
                    return 'linear-gradient(to bottom, #0f172a 0%, var(--ink) 100%)';
                  }
                })(),
                opacity: 1
              }}
            ></div>

            {weatherCond === 'storm' && (
              <div className="absolute inset-0 bg-white opacity-0 anim-lightning pointer-events-none z-10" />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 300 200" className="w-full h-full">
                <g className={`transition-opacity duration-1000 ${romanTime.isDay ? 'opacity-0' : 'opacity-100'}`}>
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
                </g>

                <path d="M 30 180 A 120 120 0 0 1 270 180" fill="none" stroke="#cfb53b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                <g
                  transform={`translate(${objectX}, ${objectY})`}
                  style={(weatherCond === 'rain' || weatherCond === 'storm' || weatherCond === 'snow' || weatherCond === 'fog') && romanTime.isDay
                    ? { filter: 'blur(2.5px)', opacity: 0.45 }
                    : undefined}
                >
                  {romanTime.isDay ? (
                    <g className="animate-[spin_20s_linear_infinite]">
                      <circle r="10" fill="#cfb53b" stroke="#8a7826" strokeWidth="1" />
                      {[...Array(12)].map((_, i) => (
                        <React.Fragment key={i}>
                          <line x1="0" y1="-14" x2="0" y2="-20" stroke="#cfb53b" strokeWidth="1.5" transform={`rotate(${i * 30})`} />
                          <path d="M -2 -14 L 0 -18 L 2 -14" fill="#cfb53b" transform={`rotate(${i * 30 + 15})`} />
                        </React.Fragment>
                      ))}
                    </g>
                  ) : (
                    renderMoon(romanTime.moonPhase)
                  )}
                </g>

                {weatherCond !== 'clear' && (
                  <g className="weather-effects pointer-events-none">
                    <WeatherSvgEffects
                      condition={weatherCond}
                      weatherParticles={weatherParticles}
                      fogGradientId="fog-ground-egy"
                    />
                  </g>
                )}

                <g className="city-skyline" style={weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined}>
                  {skylineElements.map(el => (
                    <path
                      key={el.id}
                      d={el.path}
                      fill="var(--ink)"
                      stroke="#10b981"
                      strokeWidth="0.5"
                      opacity={el.opacity}
                    />
                  ))}
                </g>
                <g style={weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined}>
                <path d="M 0 180 L 300 180 L 300 200 L 0 200 Z" fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'} />
                <path d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z" fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'} stroke={weatherCond === 'snow' ? '#f0f4f8' : '#10b981'} strokeWidth="1" />
                {weatherCond === 'snow' && (
                  <path d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z" fill="#f0f4f8" opacity="0.9" />
                )}

                <defs>
                  <clipPath id="upper-vessel-clip"><path d="M 136 135 L 146 155 L 154 155 L 164 135 Z" /></clipPath>
                  <clipPath id="lower-vessel-clip"><path d="M 146 160 L 136 180 L 164 180 L 154 160 Z" /></clipPath>
                  <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {romanTime.isDay ? (
                  <g>
                    <ellipse cx="150" cy="180" rx="70" ry="14" fill="#8a7826" opacity="0.2" />
                    <ellipse cx="150" cy="180" rx="60" ry="10" fill="#e3d6b3" opacity="0.15" />

                    <line
                      x1="150"
                      y1="180"
                      x2={150 - Math.cos(rad) * 90}
                      y2={185 + (1 - Math.sin(rad)) * 14}
                      stroke="var(--hatch-color)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity="0.4"
                      className="transition-all duration-1000"
                    />

                    {/* Egyptian Obelisk */}
                    <g>
                      <path d="M 147.5 180 L 148.5 148 L 151.5 148 L 152.5 180 Z" fill="#cfb53b" stroke="#8a7826" strokeWidth="0.5" />
                      <path d="M 148 148 L 150 140 L 152 148 Z" fill="#e3d6b3" stroke="#8a7826" strokeWidth="0.5" />
                      <line x1="150" y1="155" x2="150" y2="175" stroke="#8a7826" strokeWidth="0.5" />
                      <line x1="149" y1="160" x2="151" y2="160" stroke="#8a7826" strokeWidth="0.5" />
                      <line x1="149" y1="165" x2="151" y2="165" stroke="#8a7826" strokeWidth="0.5" />
                      <line x1="149" y1="170" x2="151" y2="170" stroke="#8a7826" strokeWidth="0.5" />
                      <rect x="145" y="178" width="10" height="2" fill="#8a7826" rx="0.5" />
                    </g>
                  </g>
                ) : (
                  <g className="transition-all duration-1000">
                    <ellipse cx="150" cy="180" rx="30" ry="6" fill="#8a7826" opacity="0.1" />
                    <path d="M 132 133 Q 120 155 132 181" stroke="#cfb53b" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <path d="M 168 133 Q 180 155 168 181" stroke="#cfb53b" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <ellipse cx="150" cy="135" rx="14" ry="3" fill="none" stroke="#cfb53b" strokeWidth="0.75" opacity="0.8" />
                    <path d="M 136 135 L 146 155 L 154 155 L 164 135" fill="#ffffff" opacity="0.05" stroke="#e3d6b3" strokeWidth="0.5" />
                    <g clipPath="url(#upper-vessel-clip)">
                      <rect x="130" y={135 + (20 * progressPercent)} width="40" height="20" fill="url(#water-grad)" />
                      {progressPercent < 1 && (
                        <ellipse cx="150" cy={135 + (20 * progressPercent)} rx={14 - (10 * progressPercent)} ry={1} fill="#87ceeb" opacity="0.6" />
                      )}
                    </g>
                    {progressPercent < 0.99 && (
                      <line x1="150" y1="155" x2="150" y2={180 - (20 * progressPercent)} stroke="#87ceeb" strokeWidth="1" strokeDasharray="3 3">
                        <animate attributeName="stroke-dashoffset" values="6;0" dur="0.3s" repeatCount="indefinite" />
                      </line>
                    )}
                    <ellipse cx="150" cy="180" rx="14" ry="3" fill="none" stroke="#cfb53b" strokeWidth="0.75" opacity="0.8" />
                    <path d="M 146 160 L 136 180 L 164 180 L 154 160" fill="#ffffff" opacity="0.05" stroke="#e3d6b3" strokeWidth="0.5" />
                    <g clipPath="url(#lower-vessel-clip)">
                      <rect x="130" y={180 - (20 * progressPercent)} width="40" height="30" fill="url(#water-grad)" />
                      {progressPercent > 0 && (
                        <ellipse cx="150" cy={180 - (20 * progressPercent)} rx={14 - (10 * (1 - progressPercent))} ry={1} fill="#87ceeb" opacity="0.6" />
                      )}
                    </g>
                    <rect x="145" y="155" width="10" height="5" fill="#8a7826" />
                    <path d="M 144 155 L 156 155" stroke="#cfb53b" strokeWidth="1" />
                    <path d="M 144 160 L 156 160" stroke="#cfb53b" strokeWidth="1" />
                    {[...Array(12)].map((_, i) => (
                      <line key={`clep-scale-${i}`} x1="133" y1={180 - (20 / 12) * i} x2="135" y2={180 - (20 / 12) * i} stroke="#8a7826" strokeWidth="0.5" opacity="0.8" />
                    ))}
                  </g>
                )}
                </g>{/* end fog-blur group: ground + central element */}
              </svg>
            </div>
          </div>

          <div className="p-5 text-center border-t-2" style={{ borderColor: 'rgba(24,64,160,0.30)' }}>
            {/* Hour + prognosis */}
            <h2 className="responsive-wrap text-2xl xs:text-3xl md:text-5xl font-serif font-bold text-parchment mb-3 uppercase tracking-wide items-center justify-center gap-3 xs:gap-4">
              <span>Hora {romanTime.romanHour}</span>
              {egyptianDateInfo.currentPrognosis !== 'none' && (
                <div className={`text-[9px] xs:text-[10px] md:text-xs px-2 py-1 rounded border flex items-center gap-1.5 transition-all animate-fadeIn
                  ${egyptianDateInfo.currentPrognosis === 'nefer'
                    ? 'bg-emerald-900/30 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-900/20 text-red-300 border-red-500/35'}`}
                >
                  <span className="text-xs xs:text-sm">{egyptianDateInfo.currentPrognosis === 'nefer' ? '☀️' : '🦂'}</span>
                  <span className="font-bold uppercase tracking-widest">
                    {egyptianDateInfo.currentPrognosis === 'nefer' ? 'Nefer' : 'Aha'}
                  </span>
                </div>
              )}
            </h2>

            {/* Date tracker */}
            {egyptianDateInfo.eDate.isEpagomenal ? (
              <div className="mb-5">
                <span className="font-bold uppercase tracking-widest text-sm" style={{ color: 'rgba(212,168,50,0.85)' }}>
                  {egyptianDateInfo.eDate.seasonHieroglyphic} Días Epagómenos {egyptianDateInfo.eDate.seasonHieroglyphic}
                </span>
                <div className="font-serif text-xs mt-1 text-parchment/60">Día {egyptianDateInfo.eDate.dayOfMonth}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full max-w-sm mx-auto mb-5 px-2">
                {[
                  {
                    label: 'Estación',
                    items: [0, 1, 2],
                    active: Math.floor(egyptianDateInfo.eDate.monthIndex / 4),
                    text: egyptianDateInfo.eDate.seasonName,
                    activeClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]',
                    doneClass: 'bg-emerald-700/40',
                  },
                  {
                    label: 'Mes',
                    items: [0, 1, 2, 3],
                    active: egyptianDateInfo.eDate.monthIndex % 4,
                    text: egyptianDateInfo.eDate.monthName,
                    activeClass: 'bg-[#1840a0] shadow-[0_0_8px_rgba(24,64,160,0.5)]',
                    doneClass: 'bg-[#1840a0]/30',
                  },
                  {
                    label: 'Década',
                    items: [0, 1, 2],
                    active: egyptianDateInfo.eDate.decade - 1,
                    text: `Día ${egyptianDateInfo.eDate.dayOfMonth}`,
                    activeClass: 'bg-gold-leaf shadow-[0_0_8px_rgba(212,168,50,0.4)]',
                    doneClass: 'bg-gold-leaf/25',
                  },
                ].map(({ label, items, active, text, activeClass, doneClass }) => (
                  <div key={label} className="responsive-wrap items-center gap-3">
                    <span className="text-[9px] uppercase tracking-widest font-bold w-14 text-right" style={{ color: 'rgba(212,168,50,0.60)' }}>{label}</span>
                    <div className="flex flex-1 gap-1">
                      {items.map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
                          i === active ? activeClass : i < active ? doneClass : 'bg-[#1840a0]/10'
                        }`} />
                      ))}
                    </div>
                    <span className="w-16 text-left text-xs font-serif text-parchment/75 font-bold">{text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Day/night + vigilia */}
            <div className="flex flex-col gap-3 justify-center items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-6 font-serif font-bold tracking-[0.3em] text-base text-egypt-primary">
                  <span style={{ color: 'rgba(212,168,50,0.55)' }}>❧</span>
                  <span>{romanTime.isDay ? labels.dayLabel : labels.nightLabel}</span>
                  <span style={{ color: 'rgba(212,168,50,0.55)' }}>☙</span>
                </div>
                {romanTime.vigilia && (
                  <div className="text-xs font-serif uppercase tracking-[0.2em] text-egypt-primary font-bold mt-1">
                    𓊹 {romanTime.vigilia.name} 𓊹
                  </div>
                )}
              </div>

              {/* Civil day part */}
              <div className="font-serif mt-2 mb-2 px-6 py-2.5 rounded border flex flex-col items-center w-full max-w-[260px] mx-auto"
                   style={{ background: 'rgba(24,64,160,0.12)', borderColor: 'rgba(24,64,160,0.35)' }}>
                <div className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(212,168,50,0.65)' }}>{labels.civilDayPartLabel}</div>
                <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-parchment text-base md:text-lg leading-tight">{romanTime.civilDayPart.name}</span>
                  <span className="text-[11px] md:text-sm font-bold italic text-egypt-primary mt-1 leading-snug">{romanTime.civilDayPart.desc}</span>
                </div>
              </div>

              {/* Planetary ruler + deity */}
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mt-2 px-4 pb-2">
                <div className="flex flex-col items-center text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(212,168,50,0.55)' }}>{labels.planetaryRulerLabel}</div>
                  <span className="font-bold text-parchment text-sm uppercase">{romanTime.planetaryRuler}</span>
                </div>
                <div className="hidden sm:block w-px h-10" style={{ background: 'rgba(24,64,160,0.30)' }}></div>
                <div className="w-16 h-px sm:hidden" style={{ background: 'rgba(24,64,160,0.30)' }}></div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(212,168,50,0.55)' }}>{labels.monthTutelaLabel}</div>
                  <span className="font-bold text-parchment text-lg">{egyptianDateInfo.deity.deity}</span>
                  <span className="text-xs font-bold text-gold-leaf">{egyptianDateInfo.deity.deityHieroglyphic}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default EgyptianClock;

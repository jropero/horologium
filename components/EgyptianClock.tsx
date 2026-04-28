import React, { useMemo, useState } from 'react';
import { Eye, Star, Info } from 'lucide-react';
import { RomanTimeData, WeatherData } from '../types';
import EgyptianCalendarModal from './EgyptianCalendarModal';
import WeatherModal from './WeatherModal';
import HorusEclipseModal from './HorusEclipseModal';
import { generateEgyptianSkyline } from '../utils/egyptianSkylineGenerator';
import { useCivilization } from '../contexts/CivilizationContext';
import { getEgyptianDate, formatEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getEgyptianMonthDeity } from '../utils/egyptianCalendarData';
import { getHemerologyForDate, Prognosis } from '../utils/egyptianHemerologyData';
import { getAlgolPhase, AlgolState } from '../utils/egyptianAstronomy';

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isHorusOpen, setIsHorusOpen] = useState(false);

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

  const algol = useMemo(() => getAlgolPhase(modernTime), [modernTime.getTime()]);

  const weatherParticles = useMemo(() => {
    return {
      rain: Array.from({ length: 40 }).map(() => ({
        x: Math.random() * 300,
        y: -30 - Math.random() * 50,
        length: Math.random() * 15 + 10,
        width: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        dur: 0.5 + Math.random() * 0.4,
        drift: -5 - Math.random() * 10
      })),
      snow: Array.from({ length: 30 }).map(() => ({
        x: Math.random() * 300,
        y: -20 - Math.random() * 50,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        dur: 3 + Math.random() * 4,
        drift: -20 + Math.random() * 40
      }))
    };
  }, []);

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
    <>
      <div className="w-full max-w-2xl mx-auto p-1 bg-ink/50 backdrop-blur-sm rounded-xl shadow-2xl animate-fadeIn">
        <div className="flex flex-col lg:flex-row h-full justify-between items-start lg:items-center gap-4 p-4 border-b-2 border-emerald-500/30 bg-ink">

          <div
            onClick={() => setIsCalendarOpen(true)}
            className="calendar-header-widget bg-ink/80 border border-gold-dim p-3 rounded shadow-lg w-full md:w-auto flex flex-col items-center md:items-end cursor-pointer hover:bg-white/5 hover:border-emerald-500 transition-all group relative ml-auto"
            title="Ver Calendario Egipcio"
          >
            <div className="text-gold-leaf font-serif text-sm uppercase tracking-widest flex items-center justify-center md:justify-end gap-3 font-bold">
              <span className="text-lg">{egyptianDateInfo.eDate.seasonHieroglyphic}</span>
              <span className="text-gold-dim/40 text-xs">|</span>
              <span>{egyptianDateInfo.eDate.monthName} {egyptianDateInfo.eDate.dayOfMonth}</span>
            </div>
            <div className="text-gold-dim font-serif text-xs italic mb-2 opacity-80">{formatEgyptianDate(egyptianDateInfo.eDate)}</div>
            <div className="flex items-center gap-3 justify-center md:justify-end text-parchment font-serif text-sm italic mt-1">
              <span className="text-xs px-2 py-0.5 border border-emerald-500/40 rounded bg-emerald-500/10 uppercase font-bold text-emerald-400">{egyptianDateInfo.eDate.seasonName}</span>
              <span className="flex items-center gap-1.5 bg-ink/40 px-2 py-0.5 rounded border border-gold-dim/20">
                <span className="text-gold-dim">☽</span>
                <span>{romanTime.moonPhaseLabel}</span>
              </span>
              <span className="text-gold-dim">•</span>
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHorusOpen(true);
                }}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all duration-700 cursor-pointer hover:scale-105 ${
                  algol.isEclipsed 
                    ? 'bg-roman-red/10 border-roman-red/30 text-roman-red opacity-70' 
                    : 'bg-gold-leaf/10 border-gold-leaf/30 text-gold-leaf drop-shadow-[0_0_5px_rgba(207,181,59,0.4)]'
                }`}
                title={algol.stateText}
              >
                <Eye className={`w-3.5 h-3.5 ${algol.isEclipsed ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Horus</span>
              </span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-end text-gold-dim font-serif text-xs mt-2 font-bold">
              <span>{egyptianDateInfo.deity.deity} {egyptianDateInfo.deity.deityHieroglyphic}</span>
            </div>
          </div>
        </div>

        <div className="woodcut-border p-2 bg-ink relative overflow-hidden">
          <div className="relative w-full aspect-[16/9] bg-midnight overflow-hidden border-2 border-emerald-500/30">
            <div className="absolute inset-0 woodcut-hatch opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-stardust opacity-30 pointer-events-none"></div>

            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background: (() => {
                  if (romanTime.isDay) {
                    if (progressPercent < 0.15) {
                      return 'linear-gradient(to bottom, #2b4162 0%, #fa9c7a 60%, var(--parchment) 100%)';
                    } else if (progressPercent > 0.85) {
                      return 'linear-gradient(to bottom, #1e3b70 0%, #29539b 40%, #fd746c 80%, var(--parchment) 100%)';
                    }
                    return 'linear-gradient(to bottom, #4a90e2 0%, #87ceeb 60%, var(--parchment) 100%)';
                  } else {
                    return 'linear-gradient(to bottom, #0f172a 0%, var(--ink) 100%)';
                  }
                })(),
                opacity: 1
              }}
            ></div>

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

                <g transform={`translate(${objectX}, ${objectY})`}>
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

                {weather && weather.current.condition !== 'clear' && (
                  <g className="weather-effects pointer-events-none" style={{ mixBlendMode: 'screen' }}>
                    {(weather.current.condition === 'cloudy' || weather.current.condition === 'fog') && (
                      <g opacity="0.4">
                        <path d="M -50 40 Q 50 10 120 50 T 250 30 T 350 60 L 350 -20 L -50 -20 Z" fill="#94a3b8" className="anim-cloud-fast" />
                        <path d="M -50 70 Q 80 50 150 70 T 350 90 L 350 -20 L -50 -20 Z" fill="#cbd5e1" opacity="0.6" className="anim-cloud-slow" />
                      </g>
                    )}
                    {(weather.current.condition === 'storm' || weather.current.condition === 'rain') && (
                      <g className="animate-[pulse_10s_ease-in-out_infinite]" opacity="0.6">
                        <path d="M -50 50 Q 30 20 80 40 T 180 30 T 280 50 T 350 30 L 350 -20 L -50 -20 Z" fill="#1e293b" />
                        <path d="M -50 80 Q 70 50 160 80 T 350 60 L 350 -20 L -50 -20 Z" fill="#0f172a" opacity="0.8" />
                      </g>
                    )}
                    {weather.current.condition === 'storm' && (
                      <rect x="0" y="0" width="300" height="200" fill="#ffffff" opacity="0" className="anim-lightning" />
                    )}
                    {(weather.current.condition === 'rain' || weather.current.condition === 'storm') && (
                      <g>
                        {weatherParticles.rain.map((drop, i) => (
                          <line
                            key={`rain-${i}`}
                            x1={drop.x}
                            y1={drop.y}
                            x2={drop.x + drop.drift}
                            y2={drop.y + drop.length}
                            stroke="#94a3b8"
                            strokeWidth={drop.width}
                            opacity={drop.opacity}
                            className="anim-fall"
                            style={{ '--drift': `${drop.drift * 10}px`, '--dur': `${drop.dur}s` } as React.CSSProperties}
                          />
                        ))}
                      </g>
                    )}
                    {weather.current.condition === 'snow' && (
                      <g>
                        {weatherParticles.snow.map((flake, i) => (
                          <circle
                            key={`snow-${i}`}
                            cx={flake.x}
                            cy={flake.y}
                            r={flake.r}
                            fill="#ffffff"
                            opacity={flake.opacity}
                            className="anim-fall"
                            style={{ '--drift': `${flake.drift}px`, '--dur': `${flake.dur}s` } as React.CSSProperties}
                          />
                        ))}
                      </g>
                    )}
                  </g>
                )}

                <g className="city-skyline">
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
                <path d="M 0 180 L 300 180 L 300 200 L 0 200 Z" fill="var(--ink)" />
                <path d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z" fill="var(--ink)" stroke="#10b981" strokeWidth="1" />

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
              </svg>
            </div>
          </div>

          <div className="bg-parchment border-t-4 border-double border-ink/20 p-4 text-center pb-6">
            <h2 className="responsive-wrap text-2xl xs:text-3xl md:text-5xl font-serif font-bold text-ink mb-3 uppercase tracking-wide drop-shadow-sm items-center justify-center gap-2 xs:gap-4">
              <span>Hora {romanTime.romanHour}</span>
              {egyptianDateInfo.currentPrognosis !== 'none' && (
                <div className={`text-[9px] xs:text-[10px] md:text-xs px-2 py-1 rounded-full border flex items-center gap-1.5 shadow-sm transition-all animate-fadeIn
                  ${egyptianDateInfo.currentPrognosis === 'nefer' 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                    : 'bg-red-100 text-roman-red border-roman-red/30'}`}
                >
                  <span className="text-xs xs:text-sm">{egyptianDateInfo.currentPrognosis === 'nefer' ? '☀️' : '🦂'}</span>
                  <span className="font-bold uppercase tracking-widest">
                    {egyptianDateInfo.currentPrognosis === 'nefer' ? 'Nefer' : 'Aha'}
                  </span>
                </div>
              )}
            </h2>

            {/* Visual Date Tracker */}
            {egyptianDateInfo.eDate.isEpagomenal ? (
              <div className="mb-6">
                <span className="text-amber-600 font-bold uppercase tracking-widest text-sm drop-shadow-sm">
                  {egyptianDateInfo.eDate.seasonHieroglyphic} Días Epagómenos {egyptianDateInfo.eDate.seasonHieroglyphic}
                </span>
                <div className="font-body text-xs mt-1 text-ink/70">Día {egyptianDateInfo.eDate.dayOfMonth}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full max-w-sm mx-auto mb-6 px-2">
                {/* Estación (3) */}
                <div className="responsive-wrap items-center gap-3">
                  <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold w-14 text-right">Estación</span>
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2].map(s => {
                      const seasonIndex = Math.floor(egyptianDateInfo.eDate.monthIndex / 4);
                      return (
                        <div key={s} className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
                          s === seasonIndex ? 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]' 
                          : s < seasonIndex ? 'bg-emerald-600/30' 
                          : 'bg-gold-dim/20'
                        }`} />
                      );
                    })}
                  </div>
                  <span className="w-16 text-left text-xs font-serif text-ink/90 font-bold uppercase tracking-wider">{egyptianDateInfo.eDate.seasonName}</span>
                </div>

                {/* Mes (4) */}
                <div className="responsive-wrap items-center gap-3">
                  <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold w-14 text-right">Mes</span>
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map(m => {
                      const monthOfSeason = (egyptianDateInfo.eDate.monthIndex % 4) + 1;
                      return (
                        <div key={m} className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
                          m === monthOfSeason ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                          : m < monthOfSeason ? 'bg-emerald-500/30' 
                          : 'bg-gold-dim/20'
                        }`} />
                      );
                    })}
                  </div>
                  <span className="w-16 text-left text-xs font-serif text-ink/90 font-bold uppercase tracking-wider">{egyptianDateInfo.eDate.monthName}</span>
                </div>

                {/* Década (3) */}
                <div className="responsive-wrap items-center gap-3">
                  <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold w-14 text-right">Década</span>
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map(d => {
                      const decade = egyptianDateInfo.eDate.decade;
                      return (
                        <div key={d} className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
                          d === decade ? 'bg-gold-leaf shadow-[0_0_8px_rgba(207,181,59,0.5)]' 
                          : d < decade ? 'bg-gold-leaf/30' 
                          : 'bg-gold-dim/20'
                        }`} />
                      );
                    })}
                  </div>
                  <span className="w-16 text-left text-[10px] font-body italic text-ink/70 font-bold">Día {egyptianDateInfo.eDate.dayOfMonth}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-6 text-emerald-700 font-serif font-bold tracking-[0.3em] text-base">
                  <span className="text-woodcut-green">❧</span>
                  <span>{romanTime.isDay ? labels.dayLabel : labels.nightLabel}</span>
                  <span className="text-woodcut-green">☙</span>
                </div>
                {romanTime.vigilia && (
                  <div className="text-xs font-serif uppercase tracking-[0.2em] text-emerald-600 drop-shadow-sm font-bold mt-1">
                    𓊹 {romanTime.vigilia.name} 𓊹
                  </div>
                )}
              </div>

              <div className="text-sm md:text-base font-serif text-ink mt-3 mb-3 bg-emerald-500/10 px-3 md:px-8 py-2.5 rounded-lg border border-emerald-500/30 shadow-sm flex flex-col items-center w-full max-w-[260px] mx-auto">
                <div className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-1">{labels.civilDayPartLabel}</div>
                <div className="flex flex-col items-center text-center px-1">
                  <span className="font-bold text-ink text-base md:text-lg leading-tight">{romanTime.civilDayPart.name}</span>
                  <span className="text-[11px] md:text-sm font-bold italic text-emerald-600 mt-1 leading-snug">{romanTime.civilDayPart.desc}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mt-4 px-4 pb-2 border-b border-gold-dim/20 sm:border-none">
                <div className="flex flex-col items-center text-ink/80 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dim mb-1">{labels.planetaryRulerLabel}</div>
                  <span className="font-bold text-ink text-sm uppercase">{romanTime.planetaryRuler}</span>
                </div>

                <div className="hidden sm:block w-px h-10 bg-gold-dim/30"></div>
                <div className="w-16 h-px sm:hidden bg-gold-dim/30"></div>

                <div className="flex flex-col items-center text-ink/80 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dim mb-1">{labels.monthTutelaLabel}</div>
                  <span className="font-bold text-ink text-lg">{egyptianDateInfo.deity.deity}</span>
                  <span className="text-xs font-bold">{egyptianDateInfo.deity.deityHieroglyphic}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EgyptianCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        startDate={modernTime}
      />

      <WeatherModal
        isOpen={isWeatherOpen}
        onClose={() => setIsWeatherOpen(false)}
        weather={weather}
        onUpdateLocation={onUpdateLocation}
        currentLat={currentLat}
        currentLng={currentLng}
      />

      <HorusEclipseModal
        isOpen={isHorusOpen}
        onClose={() => setIsHorusOpen(false)}
        currentDate={modernTime}
      />
    </>
  );
};

export default EgyptianClock;

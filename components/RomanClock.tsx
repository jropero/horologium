// --- START OF FILE components/RomanClock.tsx ---
import React, { useMemo, useState } from 'react';
import { RomanTimeData, WeatherData } from '../types';
import WeatherWidget from './WeatherWidget';
import RomanCalendarModal from './RomanCalendarModal';
import GreekCalendarModal from './GreekCalendarModal';
import WeatherModal from './WeatherModal';
import { generateSkyline } from '../utils/skylineGenerator';
import { generateGreekSkyline } from '../utils/greekSkylineGenerator';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';
import { OVID_ASTRONOMICAL_EVENTS, OVID_WEATHER_QUOTES } from '../utils/ovidFastiData';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';

interface RomanClockProps {
  modernTime: Date;
  romanTime: RomanTimeData;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}


const RomanClock: React.FC<RomanClockProps> = ({
  modernTime,
  romanTime,
  loading,
  weather,
  onUpdateLocation,
  currentLat,
  currentLng
}) => {
  const { civilization, labels } = useCivilization();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

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

  // Generar el skyline de forma procedural basándose en la fecha local
  const skylineElements = useMemo(() => {
    // Crear una semilla única para hoy (formato YYYYMMDD)
    const seed = modernTime.getFullYear() * 10000 + (modernTime.getMonth() + 1) * 100 + modernTime.getDate();
    return civilization === 'rome' ? generateSkyline(seed) : generateGreekSkyline(seed);
  }, [modernTime.getDate(), civilization]);

  const ovidAstroEvent = useMemo(() => {
    if (civilization !== 'rome') return null;
    const currentMonth = modernTime.getMonth() + 1;
    const currentDay = modernTime.getDate();
    return OVID_ASTRONOMICAL_EVENTS.find(e => e.month === currentMonth && e.day === currentDay);
  }, [modernTime.getDate(), modernTime.getMonth(), civilization]);

  const ovidWeatherQuote = useMemo(() => {
    if (civilization !== 'rome' || !weather) return null;
    const { condition, temperature, windSpeed } = weather.current;

    if (condition === 'rain' || condition === 'storm') return OVID_WEATHER_QUOTES.find(q => q.condition === 'rain');
    if (windSpeed > 20) return OVID_WEATHER_QUOTES.find(q => q.condition === 'wind');
    if (temperature < 5 || condition === 'snow') return OVID_WEATHER_QUOTES.find(q => q.condition === 'snow');
    if (temperature > 28 || condition === 'clear') return OVID_WEATHER_QUOTES.find(q => q.condition === 'clear');
    return null;
  }, [weather, civilization]);

  const rainCode = weather?.current.code ?? 63;
  const rainIntensity = RAIN_INTENSITY[rainCode] ?? 0.45;

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
    const normalizedPhase = (phase % 1 + 1) % 1; // Seguridad 0-1
    const isWaxing = normalizedPhase <= 0.5;

    // 1 para Creciente (arco base a la derecha), 0 para Menguante (arco base a la izquierda)
    const sweep1 = isWaxing ? 1 : 0;

    // Ancho de la elipse difuminadora (Terminator)
    const rx = Math.max(0.1, r * Math.abs(Math.cos(normalizedPhase * Math.PI * 2)));

    // Sweep del terminador basado en el cuartil
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
          <clipPath id={maskId}>
            <path d={d} />
          </clipPath>

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
    <>
      <div className="w-full max-w-4xl mx-auto p-1 bg-ink/50 backdrop-blur-sm rounded-xl shadow-2xl animate-fadeIn">
        <div className="woodcut-border p-2 bg-ink relative overflow-hidden">
          <div className="relative w-full aspect-[16/9] bg-midnight overflow-hidden border-2 border-gold-dim/30">
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
                      // Amanecer
                      return 'linear-gradient(to bottom, #2b4162 0%, #fa9c7a 60%, var(--parchment) 100%)';
                    } else if (progressPercent > 0.85) {
                      // Atardecer
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
                    // Noche
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
                {/* CAPA 1: Estrellas y arco */}
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
                  <path d="M 50 40 L 80 50 L 100 70 L 120 60" stroke="#e3d6b3" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.4" fill="none" />
                  <path d="M 220 30 L 250 45 L 260 80" stroke="#e3d6b3" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.4" fill="none" />
                </g>

                <path d="M 30 180 A 120 120 0 0 1 270 180" fill="none" stroke="#cfb53b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                {/* CAPA 2: El Sol y la Luna (detrás de las montañas/suelo) */}
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

                {/* CAPA 2.5: Efectos climáticos (Lluvia, Nieve, Nubes y Rayos) */}
                {weatherCond !== 'clear' && (
                  <g className="weather-effects pointer-events-none">
                    <WeatherSvgEffects
                      condition={weatherCond}
                      weatherParticles={weatherParticles}
                      fogGradientId="fog-ground-roman"
                    />
                  </g>
                )}

                {/* CAPA 3: El suelo oscuro y el Skyline Procedural */}
                <g className="city-skyline" style={weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined}>
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
                <g style={weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined}>
                <path d="M 0 180 L 300 180 L 300 200 L 0 200 Z" fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'} />
                <path d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z" fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'} stroke={weatherCond === 'snow' ? '#f0f4f8' : 'var(--gold-dim)'} strokeWidth="1" />
                {weatherCond === 'snow' && (
                  <path d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z" fill="#f0f4f8" opacity="0.9" />
                )}

                {/* CAPA 4: El Gnomon (Día) o La Clepsidra (Noche) */}
                <defs>
                  <clipPath id="upper-vessel-clip">
                    <path d="M 136 135 L 146 155 L 154 155 L 164 135 Z" />
                  </clipPath>
                  <clipPath id="lower-vessel-clip">
                    <path d="M 146 160 L 136 180 L 164 180 L 154 160 Z" />
                  </clipPath>
                  <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {romanTime.isDay ? (
                  <g>
                    {/* Pedestal iluminado para que resalte la base */}
                    <ellipse cx="150" cy="180" rx="70" ry="14" fill="#8a7826" opacity="0.2" />
                    <ellipse cx="150" cy="180" rx="60" ry="10" fill="#e3d6b3" opacity="0.15" />

                    {/* Sombra proyectada */}
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

                    {/* El Gnomon de bronce */}
                    <path d="M 147 180 L 153 180 L 150 145 Z" fill="#cfb53b" stroke="#8a7826" strokeWidth="0.5" />
                    <circle cx="150" cy="145" r="3" fill="#e3d6b3" />
                  </g>
                ) : (
                  <g className="transition-all duration-1000">
                    {/* Pedestal atenuado para la clepsidra */}
                    <ellipse cx="150" cy="180" rx="30" ry="6" fill="#8a7826" opacity="0.1" />

                    {/* Estructura Metálica Central (Soportes) */}
                    <path d="M 132 133 Q 120 155 132 181" stroke="#cfb53b" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <path d="M 168 133 Q 180 155 168 181" stroke="#cfb53b" strokeWidth="1.5" fill="none" opacity="0.5" />

                    {/* Vaso Superior */}
                    <ellipse cx="150" cy="135" rx="14" ry="3" fill="none" stroke="#cfb53b" strokeWidth="0.75" opacity="0.8" />
                    <path d="M 136 135 L 146 155 L 154 155 L 164 135" fill="#ffffff" opacity="0.05" stroke="#e3d6b3" strokeWidth="0.5" />

                    {/* Agua Vaso Superior (disminuye) */}
                    <g clipPath="url(#upper-vessel-clip)">
                      <rect x="130" y={135 + (20 * progressPercent)} width="40" height="20" fill="url(#water-grad)" />
                      {progressPercent < 1 && (
                        <ellipse
                          cx="150"
                          cy={135 + (20 * progressPercent)}
                          rx={14 - (10 * progressPercent)}
                          ry={1}
                          fill="#87ceeb"
                          opacity="0.6"
                        />
                      )}
                    </g>

                    {/* Hilo de goteo (Animado) */}
                    {progressPercent < 0.99 && (
                      <line x1="150" y1="155" x2="150" y2={180 - (20 * progressPercent)} stroke="#87ceeb" strokeWidth="1" strokeDasharray="3 3">
                        <animate attributeName="stroke-dashoffset" values="6;0" dur="0.3s" repeatCount="indefinite" />
                      </line>
                    )}

                    {/* Vaso Inferior */}
                    <ellipse cx="150" cy="180" rx="14" ry="3" fill="none" stroke="#cfb53b" strokeWidth="0.75" opacity="0.8" />
                    <path d="M 146 160 L 136 180 L 164 180 L 154 160" fill="#ffffff" opacity="0.05" stroke="#e3d6b3" strokeWidth="0.5" />

                    {/* Agua Vaso Inferior (aumenta) */}
                    <g clipPath="url(#lower-vessel-clip)">
                      <rect x="130" y={180 - (20 * progressPercent)} width="40" height="30" fill="url(#water-grad)" />
                      {progressPercent > 0 && (
                        <ellipse
                          cx="150"
                          cy={180 - (20 * progressPercent)}
                          rx={14 - (10 * (1 - progressPercent))}
                          ry={1}
                          fill="#87ceeb"
                          opacity="0.6"
                        />
                      )}
                    </g>

                    {/* Base de los vasos (Conector central) */}
                    <rect x="145" y="155" width="10" height="5" fill="#8a7826" />
                    <path d="M 144 155 L 156 155" stroke="#cfb53b" strokeWidth="1" />
                    <path d="M 144 160 L 156 160" stroke="#cfb53b" strokeWidth="1" />

                    {/* Picos de la Escala Métrica (Marcas de horas) */}
                    {[...Array(12)].map((_, i) => (
                      <line
                        key={`clep-scale-${i}`}
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
                </g>{/* end fog-blur group: ground + central element */}
              </svg>
            </div>
          </div>

          {/* Ovidian Lore Widgets (Moved below solar clock) */}
          {civilization === 'rome' && (ovidAstroEvent) && (
            <div className="flex flex-col gap-4 w-full items-center p-4 bg-ink border-y border-gold-dim/20">
              {/* Epic 2: Astronomical Omen */}
              {ovidAstroEvent && (
                <div className="w-full max-w-lg bg-indigo-950/40 border border-gold-leaf/30 rounded-lg p-3 flex flex-col gap-1 shadow-inner animate-pulse duration-[4000ms]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <span className="text-[9px] font-serif uppercase tracking-widest font-black text-gold-leaf">Omen Astrorum</span>
                  </div>
                  <p className="text-[11px] font-serif italic text-parchment/90 leading-relaxed border-l border-gold-leaf/20 pl-2">
                    "{ovidAstroEvent.text}"
                  </p>
                  <span className="text-[8px] text-gold-dim/60 self-end uppercase tracking-tighter mt-auto pt-1">
                    — Fasti, {ovidAstroEvent.reference}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="bg-parchment border-t-4 border-double border-ink/20 p-4 text-center pb-6">
            <h2 className="responsive-wrap text-2xl xs:text-3xl md:text-5xl font-serif font-bold text-ink mb-1 uppercase tracking-wide drop-shadow-sm items-center justify-center gap-2">
              {romanTime.hourName}
            </h2>
            {civilization === 'hellas' && (
              <div className="mb-4">
                <div className="font-serif text-xs opacity-70 tracking-widest uppercase text-ink/80">{transliterateGreek(romanTime.hourName)}</div>
                <div className="font-body text-sm font-bold opacity-90 italic text-roman-red mt-1">{translateGreekUI(romanTime.hourName)}</div>
              </div>
            )}
            <div className="flex flex-col items-center w-full">

              {/* Dies / Nox */}
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="flex items-center gap-6 text-roman-red font-serif font-bold tracking-[0.3em] text-base">
                  <span className="text-woodcut-green">❧</span>
                  <span>{romanTime.isDay ? labels.dayLabel : labels.nightLabel}</span>
                  <span className="text-woodcut-green">☙</span>
                </div>
                {romanTime.vigilia && (
                  <div className="text-xs font-serif uppercase tracking-[0.2em] text-roman-red drop-shadow-sm font-bold mt-1">
                    {civilization === 'rome' ? '⚔' : '🛡'} {romanTime.vigilia.name} {civilization === 'rome' ? '⚔' : '🛡'}
                  </div>
                )}
              </div>

              {/* Pars Diei Civilis */}
              <div className="w-full border-t border-ink/10 mt-4 pt-3">
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold-dim mb-1.5">{labels.civilDayPartLabel}</div>
                {civilization === 'rome' ? (
                  <>
                    <div className="font-serif font-bold text-ink text-base leading-tight">{romanTime.civilDayPart.name}</div>
                    <div className="text-[11px] italic text-ink/60 mt-0.5 leading-snug">{romanTime.civilDayPart.desc}</div>
                  </>
                ) : (
                  <>
                    <div className="font-serif font-bold text-ink text-base leading-tight">{romanTime.civilDayPart.name}</div>
                    <div className="font-serif text-[9px] opacity-70 tracking-widest uppercase mt-0.5">{transliterateGreek(romanTime.civilDayPart.name)}</div>
                    <div className="text-[11px] font-bold italic text-roman-red mt-0.5 leading-snug">{romanTime.civilDayPart.desc}</div>
                  </>
                )}
              </div>

              {/* Rector Horae + Tutela Mensis — always side by side */}
              <div className="w-full border-t border-ink/10 mt-4 pt-3 grid grid-cols-2">
                <div className="flex flex-col items-center border-r border-ink/10 px-2">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-dim mb-1.5">{labels.planetaryRulerLabel}</div>
                  {civilization === 'rome' ? (
                    <span className="font-serif font-bold text-ink text-sm uppercase">{romanTime.planetaryRuler}</span>
                  ) : (
                    <>
                      <span className="font-bold text-ink text-base">{romanTime.planetaryRuler}</span>
                      <span className="font-serif text-[9px] opacity-70 tracking-widest uppercase mt-0.5">{transliterateGreek(romanTime.planetaryRuler)}</span>
                      <span className="text-xs font-bold italic text-roman-red">{translateGreekUI(romanTime.planetaryRuler)}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-center px-2">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-dim mb-1.5">{labels.monthTutelaLabel}</div>
                  {civilization === 'rome' ? (
                    <span className="font-serif font-bold text-ink text-sm uppercase">{romanTime.tutelaMensis}</span>
                  ) : (
                    <>
                      <span className="font-bold text-ink text-base">{romanTime.tutelaMensis}</span>
                      <span className="font-serif text-[9px] opacity-70 tracking-widest uppercase mt-0.5">{transliterateGreek(romanTime.tutelaMensis)}</span>
                      <span className="text-xs font-bold italic text-roman-red">{translateGreekUI(romanTime.tutelaMensis)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Ortus / Occasus / Longitudo Horae */}
              <div className="w-full border-t border-ink/10 mt-4 pt-3 grid grid-cols-3 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-base leading-none">☀</span>
                  <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold-dim mt-1">Ortus Solis</div>
                  <div className="font-serif font-bold text-ink text-sm">
                    {String(romanTime.sunrise.getHours()).padStart(2, '0')}:{String(romanTime.sunrise.getMinutes()).padStart(2, '0')}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-0.5 border-x border-ink/10 px-1">
                  <span className="text-base leading-none">⧗</span>
                  <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold-dim mt-1">Longitudo Horae</div>
                  <div className="font-serif font-bold text-ink text-sm">
                    {Math.round(romanTime.hourLengthMinutes)} minuta
                  </div>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-base leading-none">☾</span>
                  <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold-dim mt-1">Occasus Solis</div>
                  <div className="font-serif font-bold text-ink text-sm">
                    {String(romanTime.sunset.getHours()).padStart(2, '0')}:{String(romanTime.sunset.getMinutes()).padStart(2, '0')}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 border-t-2 border-gold-dim/30 bg-ink">
          {/* Single Column Layout for all Widgets */}
          <div className="flex flex-col w-full items-center gap-4">

            {weather && (civilization === 'rome' || civilization === 'hellas') && (
              <div className="flex flex-col gap-2 w-full max-w-lg">
                <WeatherWidget
                  weather={weather}
                  onClick={() => setIsWeatherOpen(true)}
                  className="cursor-pointer"
                />
              </div>
            )}

            <div
              onClick={() => setIsCalendarOpen(true)}
              className={`calendar-header-widget bg-ink/80 border p-3 rounded shadow-lg w-full max-w-lg flex flex-col items-center cursor-pointer hover:bg-white/5 transition-all group relative
              ${civilization === 'hellas' ? 'border-sky-400/30 hover:border-sky-400' : 'border-gold-dim hover:border-gold-leaf'}`}
              title="Ver Calendario"
            >
              {civilization === 'rome' ? (
                <>
                  <div className="text-gold-leaf font-serif text-sm uppercase tracking-widest flex items-center justify-center gap-3 font-bold w-full">
                    <span className="text-xs opacity-90">{romanTime.dayOfWeek}</span>
                    <span className="opacity-40 text-xs">|</span>
                    <span>{romanTime.romanDateString}</span>
                    {romanTime.isMarketDay && (
                      <span className="text-xs opacity-90 text-amber-500">Nundinae</span>
                    )}
                  </div>
                  <div className="text-gold-dim font-serif text-xs italic mb-2 opacity-80 text-center w-full">{romanTime.romanDateFull}</div>
                  <div className="flex items-center gap-3 justify-center text-parchment font-serif text-sm italic mt-1 w-full">
                    <span className="text-xs px-2 py-0.5 border border-gold-dim/40 rounded bg-gold-dim/10 uppercase font-bold text-gold-leaf">{romanTime.nundinalLetter}</span>
                    <span>{romanTime.moonPhaseLabel}</span>
                    <span className="text-gold-dim">•</span>
                    <span>Sol in {romanTime.zodiacSign}</span>
                  </div>
                </>
              ) : romanTime.atticDate ? (
                <>
                  <div className="text-sky-400 font-serif text-sm uppercase tracking-widest flex items-center justify-center gap-3 font-bold w-full">
                    <span className="text-lg">☾</span>
                    <span>{romanTime.atticDate.monthName}</span>
                  </div>
                  <div className="text-gold-dim font-serif text-[10px] tracking-widest uppercase opacity-80">
                    {transliterateGreek(romanTime.atticDate.monthName)}
                  </div>
                  <div className="text-parchment font-serif text-xs italic mt-1 font-bold">
                    {romanTime.atticDate.spanishShort}
                  </div>
                  <div className="flex items-center gap-3 justify-center text-parchment font-serif text-sm italic mt-1.5 w-full">
                    <span>{romanTime.moonPhaseLabel}</span>
                    <span className="text-sky-400/40">•</span>
                    <span className="text-sky-300">{translateGreekUI(romanTime.zodiacSign)}</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {civilization === 'rome' ? (
        <RomanCalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          startDate={modernTime}
        />
      ) : (
        <GreekCalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          startDate={modernTime}
        />
      )}

      <WeatherModal
        isOpen={isWeatherOpen}
        onClose={() => setIsWeatherOpen(false)}
        weather={weather}
        onUpdateLocation={onUpdateLocation}
        currentLat={currentLat}
        currentLng={currentLng}
      />

    </>
  );
};

export default RomanClock;
// --- END OF FILE components/RomanClock.tsx ---
// --- START OF FILE horologium-main/components/RomanClock.tsx ---

import React, { useMemo, useState } from 'react';
import { RomanTimeData, WeatherData } from '../types';
// import { toRoman } from '../utils/romanTimeUtils';
import WeatherWidget from './WeatherWidget';
import RomanCalendarModal from './RomanCalendarModal';


interface RomanClockProps {
  modernTime: Date;
  romanTime: RomanTimeData;
  loading: boolean;
  weather: WeatherData | null;
}

const RomanClock: React.FC<RomanClockProps> = ({ modernTime, romanTime, loading, weather }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const stars = useMemo(() => {
    const starData =[];
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
  },[]);

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
    // Aseguramos que la fase esté estrictamente entre 0 y 1
    const normalizedPhase = Math.max(0, Math.min(1, phase));
    const isWaxing = normalizedPhase <= 0.5;
    
    // Calculamos la curvatura de la sombra (terminador)
    const progress = isWaxing ? normalizedPhase * 2 : (normalizedPhase - 0.5) * 2;
    const x = r * (1 - 2 * progress);

    // Generamos la máscara SVG matemática que recorta la fase exacta
    let d = "";
    if (isWaxing) {
      d = `M 0 -${r} A ${r} ${r} 0 0 1 0 ${r}`;
      const sweep = progress > 0.5 ? 1 : 0;
      d += ` A ${Math.abs(x)} ${r} 0 0 ${sweep} 0 -${r} Z`;
    } else {
      d = `M 0 -${r} A ${r} ${r} 0 0 0 0 ${r}`;
      const sweep = progress < 0.5 ? 1 : 0;
      d += ` A ${Math.abs(x)} ${r} 0 0 ${sweep} 0 -${r} Z`;
    }

    const maskId = `moon-mask-${normalizedPhase.toFixed(3)}`;

    // Nueva textura de cráteres más natural
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
      <g transform="rotate(-15)"> {/* Inclinación natural en el cielo del hemisferio norte */}
        <defs>
          <clipPath id={maskId}>
            <path d={d} />
          </clipPath>
          
          {/* Gradiente 3D esférico para la parte iluminada */}
          <radialGradient id="moon-light" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f4e8c1" />
            <stop offset="100%" stopColor="#c2b28f" />
          </radialGradient>

          {/* Gradiente 3D para la parte oscura (Luz Cenicienta o Earthshine) */}
          <radialGradient id="moon-dark" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="100%" stopColor="#121212" />
          </radialGradient>

          {/* Filtro de resplandor (Glow) que emite la luna */}
          <filter id="moon-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base de la luna: Representa la parte oscura sutilmente iluminada por la Tierra */}
        <circle cx="0" cy="0" r={r} fill="url(#moon-dark)" />
        <MoonTexture color="#000000" opacity={0.3} />

        {/* Parte iluminada: Se recorta según la fase del día y se le aplica el brillo */}
        <g clipPath={`url(#${maskId})`} filter="url(#moon-glow)">
          <circle cx="0" cy="0" r={r} fill="url(#moon-light)" />
          <MoonTexture color="#968661" opacity={0.5} />
        </g>

        {/* Borde exterior muy suave para definir la silueta completa del astro */}
        <circle cx="0" cy="0" r={r} fill="none" stroke="#e3d6b3" strokeWidth="0.5" opacity="0.3" />
      </g>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-ink border-4 border-gold-dim rounded-lg ">
        <span className="font-serif text-2xl text-gold-leaf">Astrolabium Consulitur...</span>
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
    <div className="relative w-full max-w-4xl mx-auto p-1 bg-ink/50 backdrop-blur-sm rounded-xl shadow-2xl">
      <div className="flex flex-col lg:flex-row h-full justify-between items-center gap-4 p-4 border-b-2 border-gold-dim/30 bg-ink">

        {weather && (
          <WeatherWidget weather={weather} />
        )}

        <div 
          onClick={() => setIsCalendarOpen(true)}
          className="bg-ink/80 border border-gold-dim p-2 rounded shadow-lg w-full md:w-auto text-center md:text-right cursor-pointer hover:bg-white/5 hover:border-gold-leaf transition-all group"
          title="Ver Fasti Romani (Calendario)"
        >
          <div className="text-gold-leaf font-serif text-xs uppercase tracking-widest">{romanTime.romanDateString}</div>
          <div className="text-gold-dim font-serif text-[10px] italic mb-1 opacity-80">{romanTime.romanDateFull}</div>
          <div className="flex items-center gap-2 justify-center md:justify-end text-parchment font-serif text-[11px] italic mt-1">
            <span>{romanTime.moonPhaseLabel}</span>
            <span className="text-gold-dim">•</span>
            <span>Sol in {romanTime.zodiacSign}</span>
          </div>
        </div>
      </div>

      <div className="woodcut-border p-2 bg-ink relative overflow-hidden">
        <div className="relative w-full aspect-[16/9] bg-midnight overflow-hidden border-2 border-gold-dim/30">
          <div className="absolute inset-0 woodcut-hatch opacity-20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-stardust opacity-30 pointer-events-none"></div>

          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              background: romanTime.isDay
                ? 'linear-gradient(to bottom, #4a90e2 0%, #87ceeb 60%, #e3d6b3 100%)'
                : 'linear-gradient(to bottom, #0f172a 0%, #1a1a1a 100%)',
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
                <path d="M 50 40 L 80 50 L 100 70 L 120 60" stroke="#e3d6b3" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.4" fill="none" />
                <path d="M 220 30 L 250 45 L 260 80" stroke="#e3d6b3" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.4" fill="none" />
              </g>

              <path d="M 30 180 A 120 120 0 0 1 270 180" fill="none" stroke="#cfb53b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

{romanTime.isDay && (
                <g>
                  <defs>
                    <filter id="shadow-blur">
                      <feGaussianBlur stdDeviation="2" />
                    </filter>
                  </defs>
                  
                  {/* Sombra proyectada (matemáticamente opuesta al sol) */}
                  <polygon 
                    points={`
                      148,180 
                      152,180 
                      ${150 - Math.cos(rad) * (30 + (1 - Math.sin(rad)) * 90)},${180 + Math.sin(rad) * 20}
                    `} 
                    fill="rgba(0,0,0,0.6)" 
                    filter="url(#shadow-blur)"
                    className="transition-all duration-1000"
                  />

                  {/* El Gnomon de bronce (palo físico en el centro) */}
                  <path d="M 149 180 L 151 180 L 150 145 Z" fill="#cfb53b" stroke="#8a7826" strokeWidth="0.5" />
                  <circle cx="150" cy="145" r="2" fill="#e3d6b3" />
                </g>
              )}

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

              <path d="M 0 180 L 300 180 L 300 200 L 0 200 Z" fill="#1a1a1a" />
              <path d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z" fill="#1a1a1a" stroke="#8a7826" strokeWidth="1" />
              <path d="M 220 180 V 165 L 230 155 L 240 165 V 180" fill="#1a1a1a" stroke="#8a7826" strokeWidth="0.5" />
              <path d="M 40 180 V 170 L 45 165 L 50 170 V 180" fill="#1a1a1a" stroke="#8a7826" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        <div className="bg-parchment border-t-4 border-double border-ink/20 p-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-ink mb-2 uppercase tracking-wide drop-shadow-sm">
            {romanTime.hourName}
          </h2>
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-4 text-roman-red font-serif font-bold tracking-[0.2em] text-sm">
                <span className="text-woodcut-green">❧</span>
                <span>{romanTime.isDay ? 'Dies' : 'Nox'}</span>
                <span className="text-woodcut-green">☙</span>
              </div>
              {/* Si es de noche, mostramos en qué guardia militar estamos */}
              {romanTime.vigilia && (
                <div className="text-[10px] font-serif uppercase tracking-widest text-roman-red/80 font-bold">
                  ⚔ {romanTime.vigilia.name} ⚔
                </div>
              )}
            </div>
   
            <div className="text-sm font-serif text-ink mt-1 mb-2 bg-gold-dim/10 px-6 py-1.5 rounded-sm border border-gold-dim/30 shadow-sm flex flex-col items-center">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-dim mb-0.5">Pars Diei Civilis</div>
              <div>
                <span className="font-bold text-ink">{romanTime.civilDayPart.name}</span>
                <span className="text-xs italic text-ink/70 ml-1.5">({romanTime.civilDayPart.desc})</span>
              </div>
            </div>

             <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 mt-2 text-[10px] md:text-xs uppercase tracking-widest text-ink/60 font-serif">
              <div>
                Rector Horae: <span className="font-bold text-ink">{romanTime.planetaryRuler}</span>
              </div>
              <div className="hidden sm:block text-ink/30">•</div>
              <div>
                Tutela Mensis: <span className="font-bold text-ink">{romanTime.tutelaMensis}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <RomanCalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        startDate={modernTime} 
      />
    </>
  );
};

export default RomanClock;
// --- END OF FILE horologium-main/components/RomanClock.tsx ---
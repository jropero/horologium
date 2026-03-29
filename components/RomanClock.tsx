// --- START OF FILE horologium-main/components/RomanClock.tsx ---

import React, { useMemo } from 'react';
import { RomanTimeData, WeatherData } from '../types';
import { toRoman } from '../utils/romanTimeUtils';
import WeatherWidget from './WeatherWidget';

interface RomanClockProps {
  modernTime: Date;
  romanTime: RomanTimeData;
  loading: boolean;
  weather: WeatherData | null;
}

const RomanClock: React.FC<RomanClockProps> = ({ modernTime, romanTime, loading, weather }) => {
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
    const isWaxing = phase < 0.5;
    const progress = isWaxing ? phase * 2 : (phase - 0.5) * 2; 

    const x = r * (1 - 2 * progress);

    let d = "";
    if (isWaxing) {
      d = `M 0 -${r} A ${r} ${r} 0 0 1 0 ${r}`;
      const sweep = progress > 0.5 ? 1 : 0;
      d += ` A ${Math.abs(x)} ${r} 0 0 ${sweep} 0 -${r}`;
    } else {
      d = `M 0 -${r} A ${r} ${r} 0 0 0 0 ${r}`;
      const sweep = progress < 0.5 ? 1 : 0;
      d += ` A ${Math.abs(x)} ${r} 0 0 ${sweep} 0 -${r}`;
    }

    const maskId = `moon-mask-${phase.toFixed(3)}`;

    const MoonTexture = ({ color }: { color: string }) => (
      <g fill={color}>
        <circle cx="2" cy="8" r="2.5" />
        <circle cx="-5" cy="2" r="2" />
        <circle cx="-9" cy="4" r="1.5" />
        <path d="M -4 -6 Q -8 -8 -10 -4 T -4 -2 T 0 -6 Z" />
        <path d="M 2 -4 Q 6 -7 9 -3 T 5 2 T 1 -2 Z" />
        <ellipse cx="10" cy="0" rx="2" ry="2.5" />
        <circle cx="0" cy="12" r="0.8" />
        <circle cx="6" cy="6" r="0.6" />
        <circle cx="-6" cy="-9" r="0.7" />
        <circle cx="5" cy="-10" r="0.9" />
      </g>
    );

    return (
      <g>
        <defs>
          <clipPath id={maskId}>
            <path d={d} />
          </clipPath>
        </defs>

        <circle cx="0" cy="0" r={r} fill="#2a2a2a" stroke="none" />
        <MoonTexture color="#1a1a1a" />

        <g clipPath={`url(#${maskId})`}>
          <circle cx="0" cy="0" r={r} fill="#e3d6b3" stroke="none" />
          <MoonTexture color="#d4c5a3" />
        </g>

        <circle cx="0" cy="0" r={r} fill="none" stroke="#e3d6b3" strokeWidth="1" />
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
    <div className="relative w-full max-w-4xl mx-auto p-1 bg-ink/50 backdrop-blur-sm rounded-xl shadow-2xl">
      <div className="flex flex-col lg:flex-row h-full justify-between items-center gap-4 p-4 border-b-2 border-gold-dim/30 bg-ink">

        {weather && (
          <WeatherWidget weather={weather} />
        )}

        <div className="bg-ink/80 border border-gold-dim p-2 rounded shadow-lg w-full md:w-auto text-center md:text-right">
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
            
<         div className="flex flex-col items-center gap-1">
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
  );
};

export default RomanClock;
// --- END OF FILE horologium-main/components/RomanClock.tsx ---
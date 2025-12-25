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

  // Generate static stars for the background
  const stars = useMemo(() => {
    const starData = [];
    // Generate 50 random stars
    for (let i = 0; i < 50; i++) {
      starData.push({
        x: Math.random() * 300,
        y: Math.random() * 150, // Keep mostly in the sky area
        size: Math.random() * 2 + 0.5, // Varying sizes
        rotation: Math.random() * 90,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    return starData;
  }, []);

  // Calculate percentage of day/night passed for celestial position
  // 0% = Start of 1st Hour, 100% = End of 12th Hour
  const progressPercent = useMemo(() => {
    if (!romanTime) return 0;

    // Total minutes in this 12-hour period
    const baseTime = romanTime.isDay ? romanTime.sunrise : romanTime.sunset;
    const totalDiffMinutes = (modernTime.getTime() - baseTime.getTime()) / 60000;
    const minutesIntoHour = totalDiffMinutes % romanTime.hourLengthMinutes;

    const hourIndex = romanTime.romanHour - 1; // 0-11

    const percent = (hourIndex + (minutesIntoHour / romanTime.hourLengthMinutes)) / 12;
    return Math.min(Math.max(percent, 0), 1);
  }, [romanTime, modernTime]);

  // Moon Phase Rendering Logic (reused for the sky moon)
  const renderMoon = (phase: number) => {
    const r = 16;
    // Phase 0..1. 
    const isWaxing = phase < 0.5;
    const progress = isWaxing ? phase * 2 : (phase - 0.5) * 2; // 0..1 magnitude

    const x = r * (1 - 2 * progress);

    let d = "";
    // Calculate the path for the LIT portion of the moon
    if (isWaxing) {
      d = `M 0 -${r} A ${r} ${r} 0 0 1 0 ${r}`;
      const sweep = progress > 0.5 ? 1 : 0;
      d += ` A ${Math.abs(x)} ${r} 0 0 ${sweep} 0 -${r}`;
    } else {
      d = `M 0 -${r} A ${r} ${r} 0 0 0 0 ${r}`;
      const sweep = progress < 0.5 ? 1 : 0;
      d += ` A ${Math.abs(x)} ${r} 0 0 ${sweep} 0 -${r}`;
    }

    // Unique ID for the mask to prevent conflicts
    const maskId = `moon-mask-${phase.toFixed(3)}`;

    // Detailed Texture (Craters / Maria) - Woodcut style
    const MoonTexture = ({ color }: { color: string }) => (
      <g fill={color}>
        {/* Tycho / Rayed crater bottom */}
        <circle cx="2" cy="8" r="2.5" />
        {/* Copernicus area */}
        <circle cx="-5" cy="2" r="2" />
        {/* Kepler */}
        <circle cx="-9" cy="4" r="1.5" />
        {/* Mare Imbrium */}
        <path d="M -4 -6 Q -8 -8 -10 -4 T -4 -2 T 0 -6 Z" />
        {/* Mare Serenitatis / Tranquillitatis */}
        <path d="M 2 -4 Q 6 -7 9 -3 T 5 2 T 1 -2 Z" />
        {/* Mare Crisium */}
        <ellipse cx="10" cy="0" rx="2" ry="2.5" />

        {/* Random small craters / texture dots */}
        <circle cx="0" cy="12" r="0.8" />
        <circle cx="6" cy="6" r="0.6" />
        <circle cx="-6" cy="-9" r="0.7" />
        <circle cx="5" cy="-10" r="0.9" />
      </g>
    );

    return (
      <g>
        {/* Define the Mask based on the phase shape */}
        <defs>
          <clipPath id={maskId}>
            <path d={d} />
          </clipPath>
        </defs>

        {/* 1. Earthshine (The dark unlit part) */}
        {/* Dim background circle */}
        <circle cx="0" cy="0" r={r} fill="#2a2a2a" stroke="none" />
        {/* Dim texture */}
        <MoonTexture color="#1a1a1a" />

        {/* 2. Lit Moon (The bright part) - Masked */}
        <g clipPath={`url(#${maskId})`}>
          {/* Bright background */}
          <circle cx="0" cy="0" r={r} fill="#e3d6b3" stroke="none" />
          {/* Contrast texture */}
          <MoonTexture color="#d4c5a3" />

          {/* Terminator Line Polish (Optional shadow at the edge for 3D feel?) 
                   For woodcut, sharp is better, so we skip blur/shadow.
               */}
        </g>

        {/* 3. Outer Ring */}
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

  // Calculate sun/moon position on the arc
  // 180 (Left/Sunrise) -> 0 (Right/Sunset)
  const angle = 180 - (progressPercent * 180);
  const rad = (angle * Math.PI) / 180;
  const pathRadius = 120;
  const cx = 150; // Center X of SVG
  const cy = 180; // Center Y (Horizon line)

  const objectX = cx + pathRadius * Math.cos(rad);
  const objectY = cy - pathRadius * Math.sin(rad);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8 p-1 bg-ink/50 backdrop-blur-sm rounded-xl shadow-2xl">
      {/* --- INFO HEADER (Mobile Friendly) --- */}
      <div className="flex flex-row h-full justify-between items-center gap-4 p-4 border-b-2 border-gold-dim/30 bg-ink">

        {/* Weather (Center) */}
        {weather && (
          <WeatherWidget weather={weather} />
        )}

        {/* Date (Right) */}
        <div className="bg-ink/80 border border-gold-dim p-2 rounded shadow-lg w-full md:w-auto text-center md:text-right">
          <div className="text-gold-leaf font-serif text-xs uppercase tracking-widest">{romanTime.romanDateString}</div>
          <div className="text-gold-dim font-serif text-[10px] italic mb-1 opacity-80">{romanTime.romanDateFull}</div>
          <div className="text-parchment font-serif text-xs italic">{romanTime.moonPhaseLabel}</div>
        </div>
      </div>

      <div className="woodcut-border p-2 bg-ink relative overflow-hidden">
        {/* --- SKY CONTAINER --- */}
        <div className="relative w-full aspect-[16/9] bg-midnight overflow-hidden border-2 border-gold-dim/30">
          {/* Background Texture */}
          <div className="absolute inset-0 woodcut-hatch opacity-20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-stardust opacity-30 pointer-events-none"></div>

          {/* Day/Night Gradient */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              background: romanTime.isDay
                ? 'linear-gradient(to bottom, #4a90e2 0%, #87ceeb 60%, #e3d6b3 100%)'
                : 'linear-gradient(to bottom, #0f172a 0%, #1a1a1a 100%)',
              opacity: 1
            }}
          ></div>

          {/* Celestial Path & Objects */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              {/* Decorative Stars (Visible mostly at night) */}
              <g className={`transition-opacity duration-1000 ${romanTime.isDay ? 'opacity-0' : 'opacity-100'}`}>
                {stars.map((star, i) => (
                  <path
                    key={i}
                    // Woodcut 4-point star shape
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

                {/* Decorative Constellation Lines */}
                <path d="M 50 40 L 80 50 L 100 70 L 120 60" stroke="#e3d6b3" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.4" fill="none" />
                <path d="M 220 30 L 250 45 L 260 80" stroke="#e3d6b3" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.4" fill="none" />
              </g>

              {/* The Arc Line */}
              <path d="M 30 180 A 120 120 0 0 1 270 180" fill="none" stroke="#cfb53b" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

              {/* Sun or Moon */}
              <g transform={`translate(${objectX}, ${objectY})`}>
                {romanTime.isDay ? (
                  <g className="animate-[spin_20s_linear_infinite]">
                    {/* Sun Body */}
                    <circle r="10" fill="#cfb53b" stroke="#8a7826" strokeWidth="1" />
                    {/* Sun Rays - Woodcut wavy and straight */}
                    {[...Array(12)].map((_, i) => (
                      <React.Fragment key={i}>
                        {/* Straight Ray */}
                        <line x1="0" y1="-14" x2="0" y2="-20" stroke="#cfb53b" strokeWidth="1.5" transform={`rotate(${i * 30})`} />
                        {/* Wavy Ray (implied by shape) */}
                        <path d="M -2 -14 L 0 -18 L 2 -14" fill="#cfb53b" transform={`rotate(${i * 30 + 15})`} />
                      </React.Fragment>
                    ))}
                  </g>
                ) : (
                  // Render Moon with Phase
                  renderMoon(romanTime.moonPhase)
                )}
              </g>

              {/* Horizon / Landscape */}
              <path d="M 0 180 L 300 180 L 300 200 L 0 200 Z" fill="#1a1a1a" />
              {/* Hills - Woodcut Style */}
              <path d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z" fill="#1a1a1a" stroke="#8a7826" strokeWidth="1" />

              {/* Stylized Medieval Town/Ruins */}
              <path d="M 220 180 V 165 L 230 155 L 240 165 V 180" fill="#1a1a1a" stroke="#8a7826" strokeWidth="0.5" />
              <path d="M 40 180 V 170 L 45 165 L 50 170 V 180" fill="#1a1a1a" stroke="#8a7826" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* --- BOTTOM INFO PANEL --- */}
        <div className="bg-parchment border-t-4 border-double border-ink/20 p-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-ink mb-2 uppercase tracking-wide drop-shadow-sm">
            {romanTime.hourName}
          </h2>
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex items-center gap-4 text-roman-red font-serif font-bold tracking-[0.2em] text-sm">
              <span className="text-woodcut-green">❧</span>
              <span>{romanTime.isDay ? 'Dies' : 'Nox'}</span>
              <span className="text-woodcut-green">☙</span>
            </div>
            {/* Planetary Ruler */}
            <div className="text-xs uppercase tracking-widest text-ink/60 font-serif">
              Rector Horae: <span className="font-bold text-ink">{romanTime.planetaryRuler}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RomanClock;
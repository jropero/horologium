import React from 'react';
import { WeatherData, WeatherSnapshot } from '../types';

const WeatherIcon = ({ condition, size = "w-6 h-6" }: { condition: string, size?: string }) => {
    if (condition === 'clear') return (
        <svg viewBox="0 0 24 24" className={`${size} text-gold-leaf filter drop-shadow-glow`} fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
        </svg>
    );
    // ... (repetir para los otros casos si estuvieran definidos, pero aquí solo tenemos el ejemplo)
    return (
        <div className={`${size} bg-gold-dim/20 rounded-full flex items-center justify-center`}>
            <span className="text-[10px]">☁️</span>
        </div>
    );
};

const ChronosRow: React.FC<{ data: WeatherSnapshot, isCurrent?: boolean }> = ({ data, isCurrent }) => (
    <div className={`grid grid-cols-subgrid col-span-3 md:col-span-4 items-center py-3 px-2 rounded transition-colors ${isCurrent ? 'bg-white/10' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}>
        {/* Año / Etiqueta */}
        <span className={`font-serif  text-sm md:text-lg tracking-tight ${isCurrent ? 'text-gold-leaf' : 'text-gold-dim'}`}>
            {data.yearLabel}
        </span>

        {/* Descripción Latina (Smaller & Wrapped on Mobile) */}
        <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <WeatherIcon condition={data.condition} size="w-5 h-5 md:w-6 h-6" />
            <span className="text-parchment font-serif text-sm md:text-xl italic drop-shadow-sm whitespace-normal leading-tight">
                {data.description}
            </span>
        </div>

        {/* Temperatura */}
        <span className="text-parchment font-serif text-base md:text-xl font-bold text-right pr-2">
            {Math.round(data.temperature)}°
        </span>

        {/* Viento Mini (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-2 justify-end">
            <div className="w-4 h-4 relative" style={{ transform: `rotate(${data.windDirection}deg)` }}>
                <svg viewBox="0 0 4 4" className="w-full h-full text-gold-dim fill-current">
                    <path d="M2 0 L4 4 L0 4 Z" />
                </svg>
            </div>
            <span className="text-base text-stone-500 font-body">{Math.round(data.windSpeed)}</span>
        </div>
    </div>
);

const ChronosWeatherWidget: React.FC<{ weather: WeatherData }> = ({ weather }) => {
    return (
        <div className="bg-ink/90 border border-gold-dim/40 p-6 rounded-lg shadow-2xl w-full max-w-2xl mx-auto mt-8 mb-8 relative overflow-hidden group">
            {/* Decorative background hatch */}
            <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 border-b border-gold-dim/20 pb-2 relative z-10">
                <span className="text-gold-leaf font-serif text-sm md:text-base uppercase tracking-[0.4em] font-bold">Annales coeli</span>
                <span className="text-gold-dim font-serif text-sm italic">Memoria Mundi</span>
            </div>

            <div className="grid grid-cols-[auto] md:grid-cols-[120px_1fr_60px_60px] gap-x-2 md:gap-x-4 relative z-10">
                {/* Hoy */}
                <ChronosRow data={weather.current} isCurrent={true} />

                {/* Divisor */}
                <div className="col-span-3 md:col-span-4 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-transparent my-2" />

                {/* Pasado */}
                {weather.historical.map((snap) => (
                    <ChronosRow key={snap.yearLabel} data={snap} />
                ))}
            </div>

            <div className="mt-6 text-center relative z-10">
                <p className="text-xs md:text-sm font-serif text-stone-500 italic uppercase tracking-[0.2em]">
                    Comparatio temporis in eodem loco
                </p>
            </div>
        </div>
    );
};

export default ChronosWeatherWidget;
import React from 'react';
import { WeatherData, WeatherSnapshot } from '../types';

const WeatherIcon = ({ condition, size = "w-5 h-5" }: { condition: string, size?: string }) => {
    // ... (Aquí van tus SVGs que ya tienes, pero usando la prop `size`)
    // Ejemplo rápido para 'clear':
    if (condition === 'clear') return (
        <svg viewBox="0 0 24 24" className={`${size} text-gold-leaf`} fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
        </svg>
    );
    // ... (repetir para los otros casos)
    return null;
};

const ChronosRow: React.FC<{ data: WeatherSnapshot, isCurrent?: boolean }> = ({ data, isCurrent }) => (
    <div className={`grid grid-cols-[100px_1fr_auto_auto] items-center gap-2 py-1.5 ${isCurrent ? 'bg-gold-leaf/5' : 'opacity-70'}`}>
        {/* Año / Etiqueta */}
        <span className={`font-serif text-sm font-bold tracking-tighter ${isCurrent ? 'text-gold-leaf' : 'text-gold-dim'}`}>
            {data.yearLabel}
        </span>

        {/* Descripción Latina */}
        <div className="flex items-center gap-2 overflow-hidden">
            <WeatherIcon condition={data.condition} size="w-5 h-5" />
            <span className="text-parchment font-serif text-base truncate italic">{data.description}</span>
        </div>

        {/* Temperatura */}
        <span className="text-stone-300 font-serif text-base text-right px-2">
            {Math.round(data.temperature)}°
        </span>

        {/* Viento Mini */}
        <div className="flex items-center gap-1 justify-end">
             <div className="w-3 h-3 relative" style={{ transform: `rotate(${data.windDirection}deg)` }}>
                <path d="M1.5 0 L3 3 L0 3 Z" fill="currentColor" className="text-gold-dim" />
             </div>
              <span className="text-sm text-stone-500 font-serif">{Math.round(data.windSpeed)}</span>
        </div>
    </div>
);

const ChronosWeatherWidget: React.FC<{ weather: WeatherData }> = ({ weather }) => {
    return (
        <div className="bg-ink/90 border-2 border-gold-dim p-3 rounded-md shadow-2xl w-full max-w-md mx-auto mt-6 mb-6">
            <div className="flex items-center justify-between mb-2 border-b border-gold-dim/30 pb-1">
                <span className="text-gold-leaf font-serif text-sm uppercase tracking-[0.3em]">Annales coeli</span>
                <span className="text-gold-dim font-serif text-xs italic">Memoria Mundi</span>
            </div>

            <div className="flex flex-col">
                {/* Hoy */}
                <ChronosRow data={weather.current} isCurrent={true} />
                
                {/* Divisor */}
                <div className="h-px bg-gradient-to-r from-transparent via-gold-dim/20 to-transparent my-1" />

                {/* Pasado */}
                {weather.historical.map((snap, i) => (
                    <ChronosRow key={snap.yearLabel} data={snap} />
                ))}
            </div>
            
            <div className="mt-2 text-center">
                <p className="text-xs font-serif text-stone-600 italic uppercase tracking-widest">
                    Comparatio temporis in eodem loco
                </p>
            </div>
        </div>
    );
};

export default ChronosWeatherWidget;
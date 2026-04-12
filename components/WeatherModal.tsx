import React from 'react';
import { X, Wind, Thermometer, CloudSun, History } from 'lucide-react';
import { WeatherData, WeatherSnapshot } from '../types';

interface WeatherModalProps {
    isOpen: boolean;
    onClose: () => void;
    weather: WeatherData | null;
}

const WeatherIcon = ({ condition, className = "w-12 h-12" }: { condition: string, className?: string }) => {
    switch (condition) {
        case 'clear':
            return (
                <svg viewBox="0 0 24 24" className={`${className} text-gold-leaf filter drop-shadow-glow`} fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                </svg>
            );
        case 'cloudy':
        case 'fog':
            return (
                <svg viewBox="0 0 24 24" className={`${className} text-parchment`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.28-1.72-4.16-3.93-4.43-.26-3.05-2.83-5.44-5.94-5.44-3.11 0-5.68 2.39-5.94 5.44C3.97 10.34 2.25 12.22 2.25 14.5c0 2.485 2.015 4.5 4.5 4.5h10.75z" />
                    <path d="M6 19v2M10 19v2M14 19v2M18 19v2" strokeDasharray="1 1" opacity="0.5" />
                </svg>
            );
        case 'rain':
            return (
                <svg viewBox="0 0 24 24" className={`${className} text-sky-400`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 14c2.485 0 4.5-2.015 4.5-4.5 0-2.28-1.72-4.16-3.93-4.43-.26-3.05-2.83-5.44-5.94-5.44-3.11 0-5.68 2.39-5.94 5.44C2.47 5.34.75 7.22.75 9.5c0 2.485 2.015 4.5 4.5 4.5h10.75z" />
                    <path d="M8 16l-2 4M12 16l-2 4M16 16l-2 4" />
                </svg>
            );
        case 'snow':
            return (
                <svg viewBox="0 0 24 24" className={`${className} text-white`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
                    <path d="M8 16l.01.01M8 20l.01.01M12 18l.01.01M12 22l.01.01M16 16l.01.01M16 20l.01.01" strokeWidth="3" strokeLinecap="round" />
                </svg>
            );
        case 'storm':
            return (
                <svg viewBox="0 0 24 24" className={`${className} text-yellow-500`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9" />
                    <path d="M13 11l-4 6h6l-4 6" />
                </svg>
            );
        default:
            return <CloudSun className={className} />;
    }
};

const ChronosItem: React.FC<{ data: WeatherSnapshot; isCurrent?: boolean }> = ({ data, isCurrent }) => (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
        isCurrent 
        ? 'border-gold-leaf bg-gold-leaf/10 shadow-[0_0_15px_rgba(207,181,59,0.1)]' 
        : 'border-gold-dim/20 bg-ink/40 hover:border-gold-dim/50'
    }`}>
        <div className="flex justify-between items-start mb-3">
            <span className={`font-serif text-lg font-bold tracking-widest ${isCurrent ? 'text-gold-leaf' : 'text-gold-dim'}`}>
                {data.yearLabel}
            </span>
            {isCurrent && (
                <span className="text-[10px] uppercase tracking-widest font-black px-1.5 py-0.5 border border-gold-leaf bg-gold-leaf/20 text-gold-leaf rounded">Hodie</span>
            )}
        </div>
        
        <div className="flex items-center gap-4">
            <WeatherIcon condition={data.condition} className="w-10 h-10 shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="text-parchment font-serif text-base italic leading-tight truncate">
                    {data.description}
                </div>
                <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-gold-dim">
                        <Thermometer className="w-3 h-3" />
                        <span className="text-sm font-bold">{Math.round(data.temperature)}°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-500">
                        <Wind className="w-3 h-3" />
                        <span className="text-xs">{Math.round(data.windSpeed)} km/h</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose, weather }) => {
    if (!isOpen || !weather) return null;

    const { current, historical } = weather;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-ink border-2 border-gold-dim rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative background hatch */}
                <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>

                {/* Header */}
                <div className="bg-ink p-4 border-b border-gold-dim/50 flex justify-between items-center relative z-10 shadow-md">
                    <div className="flex items-center gap-3 text-gold-leaf">
                        <CloudSun className="w-6 h-6" />
                        <h2 className="font-serif text-xl font-bold uppercase tracking-[0.3em]">
                            Annales Coeli
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-parchment/80 hover:text-roman-red hover:bg-gold-leaf/10 transition-colors p-2 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 sm:p-6 custom-scrollbar relative z-10">
                    
                    {/* Hero Section: Current Weather */}
                    <div className="bg-gradient-to-br from-gold-leaf/5 to-transparent border border-gold-leaf/30 rounded-2xl p-6 mb-8 shadow-inner">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <span className="text-gold-leaf font-serif text-xs uppercase tracking-[0.4em] mb-2 font-bold">Status Praesens</span>
                                <h3 className="text-3xl md:text-4xl font-serif font-bold text-parchment italic mb-2">
                                    {current.description}
                                </h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-gold-dim font-serif text-sm tracking-widest uppercase">Ventus:</span>
                                    <span className="text-parchment font-serif italic text-lg">{current.latinWindName}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <WeatherIcon condition={current.condition} className="w-24 h-24 filter drop-shadow-glow" />
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl md:text-6xl font-serif font-bold text-parchment">{Math.round(current.temperature)}°</span>
                                    <span className="text-gold-dim font-serif text-xs uppercase tracking-widest mt-1">Celsius</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gold-dim/20">
                            <div className="flex flex-col items-center p-3 bg-gold-leaf/5 rounded-lg border border-gold-dim/10">
                                <Wind className="w-5 h-5 text-gold-dim mb-2" />
                                <span className="text-[10px] uppercase text-stone-500 tracking-widest">Velocitas</span>
                                <span className="text-parchment font-bold">{Math.round(current.windSpeed)} km/h</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-gold-leaf/5 rounded-lg border border-gold-dim/10 text-center">
                                <div className="w-5 h-5 mb-2 relative" style={{ transform: `rotate(${current.windDirection}deg)` }}>
                                    <svg viewBox="0 0 24 24" className="w-full h-full text-gold-leaf fill-current">
                                        <path d="M12 2 L16 22 L12 18 L8 22 Z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] uppercase text-stone-500 tracking-widest">Directio</span>
                                <span className="text-parchment font-bold">{current.windDirection}°</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-gold-leaf/5 rounded-lg border border-gold-dim/10">
                                <Thermometer className="w-5 h-5 text-gold-dim mb-2" />
                                <span className="text-[10px] uppercase text-stone-500 tracking-widest">Aestus</span>
                                <span className="text-parchment font-bold">Variabilis</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-gold-leaf/5 rounded-lg border border-gold-dim/10">
                                <CloudSun className="w-5 h-5 text-gold-dim mb-2" />
                                <span className="text-[10px] uppercase text-stone-500 tracking-widest">Caelum</span>
                                <span className="text-parchment font-bold uppercase text-[10px]">
                                    {current.condition === 'clear' && 'Serenum'}
                                    {current.condition === 'cloudy' && 'Nubilum'}
                                    {current.condition === 'rain' && 'Pluvia'}
                                    {current.condition === 'snow' && 'Nix'}
                                    {current.condition === 'storm' && 'Tempestas'}
                                    {current.condition === 'fog' && 'Nebula'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Historical Comparison */}
                    <div className="flex items-center gap-3 mb-6">
                        <History className="w-5 h-5 text-gold-dim" />
                        <h4 className="font-serif text-lg text-gold-leaf uppercase tracking-[0.2em] font-bold">Memoria Mundi</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                        {historical.map((snap) => (
                            <ChronosItem key={snap.yearLabel} data={snap} />
                        ))}
                    </div>

                    <div className="mt-8 text-center pt-6 border-t border-gold-dim/20">
                        <p className="text-xs font-serif text-stone-500 italic uppercase tracking-[0.3em]">
                            Comparatio temporis in eodem loco per annos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherModal;

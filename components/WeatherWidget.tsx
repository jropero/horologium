import React from 'react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
    weather: WeatherData;
    className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, className = '' }) => {
    const { condition, description, temperature } = weather;

    // Woodcut icon paths
    const renderIcon = () => {
        switch (condition) {
            case 'clear':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold-leaf" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                    </svg>
                );
            case 'cloudy':
            case 'fog':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-parchment" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.28-1.72-4.16-3.93-4.43-.26-3.05-2.83-5.44-5.94-5.44-3.11 0-5.68 2.39-5.94 5.44C3.97 10.34 2.25 12.22 2.25 14.5c0 2.485 2.015 4.5 4.5 4.5h10.75z" />
                        <path d="M6 19v2M10 19v2M14 19v2M18 19v2" strokeDasharray="1 1" opacity="0.5" />
                    </svg>
                );
            case 'rain':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 14c2.485 0 4.5-2.015 4.5-4.5 0-2.28-1.72-4.16-3.93-4.43-.26-3.05-2.83-5.44-5.94-5.44-3.11 0-5.68 2.39-5.94 5.44C2.47 5.34.75 7.22.75 9.5c0 2.485 2.015 4.5 4.5 4.5h10.75z" />
                        <path d="M8 16l-2 4M12 16l-2 4M16 16l-2 4" />
                    </svg>
                );
            case 'snow':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
                        <path d="M8 16l.01.01M8 20l.01.01M12 18l.01.01M12 22l.01.01M16 16l.01.01M16 20l.01.01" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                );
            case 'storm':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9" />
                        <path d="M13 11l-4 6h6l-4 6" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex items-center gap-3 bg-ink/80 border border-gold-dim p-2 rounded shadow-lg ${className}`}>
            <div className="text-gold-leaf">
                {renderIcon()}
            </div>
            <div className="flex flex-col">
                <span className="text-gold-leaf font-serif text-xs uppercase tracking-widest leading-none mb-1">Caelum</span>
                <span className="text-parchment font-serif text-sm font-bold">{description}</span>
                <span className="text-stone-400 font-serif text-xs">{Math.round(temperature)}°C</span>
            </div>
        </div>
    );
};

export default WeatherWidget;

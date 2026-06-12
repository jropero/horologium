import React, { useMemo, useState } from 'react';
import { WeatherData } from '../types';
import { getMayaDate } from '../utils/mayaCalendarUtils';
import WeatherWidget from './WeatherWidget';
import LongCountDisplay from './LongCountDisplay';
import MayaCalendarModal from './MayaCalendarModal';
import WeatherModal from './WeatherModal';
import { useCivilization } from '../contexts/CivilizationContext';

interface MayaClockProps {
  modernTime: Date;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

const MayaClock: React.FC<MayaClockProps> = ({
  modernTime,
  loading,
  weather,
  onUpdateLocation,
  currentLat,
  currentLng,
}) => {
  const { labels } = useCivilization();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  const mayaDate = useMemo(() => getMayaDate(modernTime), [modernTime.getTime()]);

  const progressPercent = useMemo(() => {
    const hours = modernTime.getHours() + modernTime.getMinutes() / 60 + modernTime.getSeconds() / 3600;
    const sunriseHour = 6;
    const sunsetHour = 18;

    if (hours >= sunriseHour && hours < sunsetHour) {
      return (hours - sunriseHour) / (sunsetHour - sunriseHour);
    }
    if (hours >= sunsetHour) {
      return (hours - sunsetHour) / (24 - sunsetHour + sunriseHour);
    }
    return (hours + 24 - sunsetHour) / (24 - sunsetHour + sunriseHour);
  }, [modernTime.getHours(), modernTime.getMinutes(), modernTime.getSeconds()]);

  const skyGradient = useMemo(() => {
    const p = Math.min(Math.max(progressPercent, 0), 1);
    if (p < 0.08) {
      return 'linear-gradient(to bottom, #0f172a 0%, #1e1b4b 50%, #1a1a2e 100%)';
    }
    if (p < 0.2) {
      const t = (p - 0.08) / 0.12;
      const top = `oklch(${3 + t * 15}% ${0.03 + t * 0.06} ${260 - t * 40})`;
      const mid = `oklch(${10 + t * 15}% ${0.04 + t * 0.08} ${50 - t * 20})`;
      return `linear-gradient(to bottom, ${top} 0%, ${mid} 50%, #fbbf24 100%)`;
    }
    if (p < 0.7) {
      return 'linear-gradient(to bottom, #1e3a5f 0%, #4a90e2 40%, #87ceeb 80%, #f0f0e8 100%)';
    }
    if (p < 0.85) {
      const t = (p - 0.7) / 0.15;
      const top = `oklch(${12 - t * 6}% ${0.08 + t * 0.04} ${230 + t * 20})`;
      const mid = `oklch(${60 - t * 20}% ${0.1 + t * 0.1} ${200 + t * 40})`;
      return `linear-gradient(to bottom, ${top} 0%, ${mid} 50%, #f97316 100%)`;
    }
    return 'linear-gradient(to bottom, #0f172a 0%, #1e1b4b 50%, #1a1a2e 100%)';
  }, [progressPercent]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-ink border-4 border-gold-dim rounded-lg">
        <span className="font-serif text-2xl text-gold-leaf">{labels.loadingText}</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto p-1 bg-ink/50 backdrop-blur-sm rounded-xl shadow-2xl animate-fadeIn">
        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row h-full justify-between items-start lg:items-center gap-4 p-4 border-b-2 border-emerald-500/30 bg-ink">
          {weather && (
            <WeatherWidget
              weather={weather}
              onClick={() => setIsWeatherOpen(true)}
              className="cursor-pointer"
            />
          )}

          <div
            onClick={() => setIsCalendarOpen(true)}
            className="bg-ink/80 border border-gold-dim p-3 rounded shadow-lg w-full md:w-auto flex flex-col items-center md:items-end cursor-pointer hover:bg-white/5 hover:border-emerald-500 transition-all group relative ml-auto"
          >
            <div className="text-gold-leaf font-serif text-sm uppercase tracking-widest flex items-center gap-2 font-bold">
              <span className="text-emerald-400">
                Ver Correlación Larga
              </span>
              <span className="text-gold-dim/60 text-xs">•</span>
              <span className="text-emerald-300">
                Baktun
              </span>
            </div>
          </div>
        </div>

        {/* Main Stage */}
        <div className="p-2 bg-ink relative overflow-hidden">
          <div className="relative w-full aspect-[16/9] overflow-hidden border-2 border-emerald-500/30">
            <div className="absolute inset-0 woodcut-hatch opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-stardust opacity-30 pointer-events-none" />

            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{ background: skyGradient }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <LongCountDisplay longCount={mayaDate.longCount} />
            </div>
          </div>
        </div>
      </div>

      <MayaCalendarModal
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
    </>
  );
};

export default MayaClock;

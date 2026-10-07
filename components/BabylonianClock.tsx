import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { WeatherData } from '../types';
import { getBabylonianDate } from '../utils/babylonianCalendarUtils';
import { getBabylonianLore } from '../utils/babylonianLoreData';
import WeatherWidget from './WeatherWidget';
import WeatherModal from './WeatherModal';
import { useCivilization } from '../contexts/CivilizationContext';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BabylonianClockProps {
  modernTime: Date;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

// ─── Inline calendar modal ────────────────────────────────────────────────────

interface BabylonianCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  modernTime: Date;
  lat: number;
  lng: number;
}

const BabylonianCalendarModal: React.FC<BabylonianCalendarModalProps> = ({
  isOpen, onClose, modernTime, lat, lng,
}) => {
  const babDate = useMemo(
    () => getBabylonianDate(modernTime, lat, lng),
    [modernTime.getTime(), lat, lng]
  );
  const lore = getBabylonianLore(babDate.monthName);

  if (!isOpen) return null;

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const third1 = days.slice(0, 10);
  const third2 = days.slice(10, 20);
  const third3 = days.slice(20);

  const renderThird = (ds: number[], label: string, phase: string, color: string) => (
    <div className="flex-1 min-w-0">
      <div className={`text-center text-xs uppercase tracking-widest font-bold mb-2 ${color}`}>
        {label} <span className="opacity-60">· {phase}</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {ds.map(d => {
          const isToday = d === babDate.day;
          const isPast = d < babDate.day;
          let cls = 'bg-ink/40 text-blue-400 border border-blue-800/20';
          if (isToday) cls = 'bg-blue-400 text-ink font-bold shadow-[0_0_8px_rgba(96,165,250,0.6)] ring-1 ring-blue-300 scale-110';
          else if (isPast) cls = 'bg-blue-900/30 text-blue-300 border border-blue-700/20';
          return (
            <div
              key={d}
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-serif transition-all ${cls}`}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/85 backdrop-blur-md animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-ink border-4 border-blue-500/60 rounded-sm shadow-[0_0_50px_rgba(96,165,250,0.15)] overflow-hidden relative cursor-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-blue-500/30 bg-blue-950/20 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-blue-300 hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-blue-400/10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-blue-300 text-2xl mb-1">𒀭</div>
          <h2 className="text-xl font-serif font-black text-parchment uppercase tracking-widest">
            {babDate.monthName}
          </h2>
          <p className="text-xs text-blue-300 uppercase tracking-[0.3em] mt-0.5">
            Era Seléucida {babDate.seYear} · Mes {babDate.monthIndex + 1}
          </p>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-5 max-h-[65vh] overflow-y-auto custom-scrollbar overscroll-behavior-contain">

          {/* Month grid */}
          <div>
            <h3 className="text-xs font-serif uppercase tracking-widest text-blue-400 mb-3 text-center flex items-center justify-center gap-2 border-y border-blue-500/20 py-2">
              <span>☾</span> Ciclo Lunar de {babDate.monthName} <span>☽</span>
            </h3>
            <div className="flex gap-2">
              {renderThird(third1, 'Ūrhu', 'Creciente', 'text-blue-300')}
              {renderThird(third2, 'Nanduru', 'Llena', 'text-blue-400')}
              {renderThird(third3, 'Šalšu', 'Menguante', 'text-blue-400')}
            </div>
          </div>

          {/* Deity & festival */}
          {lore && (
            <div className="bg-blue-900/15 border border-blue-500/30 rounded p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lore.icon}</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    Deidad del Mes
                  </div>
                  <div className="text-lg font-serif font-black text-parchment">{lore.deity}</div>
                </div>
              </div>
              <p className="text-xs font-serif text-parchment/80 italic leading-relaxed">
                "{lore.description}"
              </p>
              <div className="mt-1 p-2 bg-blue-800/20 border border-blue-600/20 rounded text-left">
                <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-0.5">
                  Festival / Ritual
                </div>
                <div className="text-xs font-serif text-blue-100/90">{lore.festival}</div>
              </div>
              <div className="text-xs text-blue-400 font-serif">
                Signo zodiacal: <span className="text-blue-300 font-bold">{lore.zodiacSign}</span>
              </div>
            </div>
          )}

          {/* Current day stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              { label: 'Hora temporal', value: babDate.hourName },
              { label: 'Guardia',       value: babDate.watchName },
              { label: 'Planeta rector',value: babDate.planetaryRuler },
              { label: 'Fase lunar',    value: babDate.moonPhaseName },
            ].map(({ label, value }) => (
              <div key={label} className="bg-blue-900/15 border border-blue-500/20 rounded p-2">
                <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-0.5">{label}</div>
                <div className="text-xs font-serif text-parchment">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <button
          type="button"
          className="w-full p-3 bg-blue-500/10 border-t border-blue-500/30 text-blue-400 font-serif text-xs uppercase tracking-widest hover:bg-blue-500/20 transition-all font-bold"
          onClick={onClose}
        >
          Cerrar la Tablilla
        </button>
      </div>
    </div>
  );
};

// ─── Main clock ───────────────────────────────────────────────────────────────

const BabylonianClock: React.FC<BabylonianClockProps> = ({
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

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-ink border-4 border-blue-500/30 rounded-lg">
        <span className="font-serif text-2xl text-blue-400">{labels.loadingText}</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto p-1 bg-ink/50 backdrop-blur-sm rounded-xl shadow-2xl animate-fadeIn">

        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row h-full justify-between items-start lg:items-center gap-4 p-4 border-b-2 border-blue-500/30 bg-ink">
          {weather && (
            <WeatherWidget
              weather={weather}
              onClick={() => setIsWeatherOpen(true)}
              className="cursor-pointer"
            />
          )}

          <div
            onClick={() => setIsCalendarOpen(true)}
            className="bg-ink/80 border border-blue-500/30 p-3 rounded shadow-lg w-full md:w-auto flex flex-col items-center md:items-end cursor-pointer hover:bg-white/5 hover:border-blue-400 transition-all ml-auto"
          >
            <div className="text-blue-400 font-serif text-sm uppercase tracking-widest flex items-center gap-2 font-bold">
              <span className="text-blue-300">Ver Calendario Babilonio</span>
              <span className="text-blue-400 text-xs">•</span>
              <span className="text-blue-200">Era Seléucida</span>
            </div>
          </div>
        </div>

      </div>

      <BabylonianCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        modernTime={modernTime}
        lat={currentLat}
        lng={currentLng}
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

export default BabylonianClock;

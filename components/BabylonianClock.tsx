import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { WeatherData } from '../types';
import { getBabylonianDate } from '../utils/babylonianCalendarUtils';
import { getBabylonianLore } from '../utils/babylonianLoreData';
import { BABYLONIAN_ZODIAC_ES } from '../types/babylonia';
import WeatherWidget from './WeatherWidget';
import WeatherModal from './WeatherModal';
import { useCivilization } from '../contexts/CivilizationContext';
import './BabylonianClock.css';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BabylonianClockProps {
  modernTime: Date;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
  isTimeTraveling?: boolean;
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
  isOpen,
  onClose,
  modernTime,
  lat,
  lng,
}) => {
  const modernTimeMs = modernTime.getTime();
  const babDate = useMemo(
    () => getBabylonianDate(modernTime, lat, lng),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modernTimeMs, lat, lng],
  );
  const lore = getBabylonianLore(babDate.monthName);

  if (!isOpen) return null;

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const third1 = days.slice(0, 10);
  const third2 = days.slice(10, 20);
  const third3 = days.slice(20);

  const renderThird = (
    ds: number[],
    label: string,
    phase: string,
    colorMod: 'light' | 'main',
  ) => (
    <div className="babylonian-calendar-third">
      <div
        className={`babylonian-calendar-third-label babylonian-calendar-third-label--${colorMod}`}
      >
        {label} <span className="babylonian-calendar-third-phase">· {phase}</span>
      </div>
      <div className="babylonian-calendar-day-grid">
        {ds.map(d => {
          const isToday = d === babDate.day;
          const isPast = d < babDate.day;
          let dayClass = 'babylonian-calendar-day';
          if (isToday) dayClass += ' babylonian-calendar-day--today';
          else if (isPast) dayClass += ' babylonian-calendar-day--past';
          return (
            <div key={d} className={dayClass}>
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className="babylonian-calendar-modal-backdrop animate-fadeIn"
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose();
      }}
    >
      <div
        role="presentation"
        className="babylonian-calendar-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="babylonian-calendar-modal-header">
          <button
            type="button"
            onClick={onClose}
            className="babylonian-calendar-modal-close"
            aria-label="Cerrar"
          >
            <X />
          </button>
          <div className="babylonian-calendar-modal-dingir">𒀭</div>
          <h2 className="babylonian-calendar-modal-title">{babDate.monthName}</h2>
          <p className="babylonian-calendar-modal-gloss">
            {babDate.isIntercalary ? 'Mes intercalar' : lore?.monthGloss}
          </p>
          <p className="babylonian-calendar-modal-era">
            Era Seléucida {babDate.seYear} · Mes {babDate.monthIndex + 1}
          </p>
        </div>

        {/* Body */}
        <div className="babylonian-calendar-modal-body custom-scrollbar">
          {/* Month grid */}
          <div>
            <h3 className="babylonian-calendar-cycle-heading">
              <span>☾</span> Ciclo Lunar de {babDate.monthName} <span>☽</span>
            </h3>
            <div className="babylonian-calendar-thirds">
              {renderThird(third1, 'Ūrhu', 'Creciente', 'light')}
              {renderThird(third2, 'Nanduru', 'Llena', 'main')}
              {renderThird(third3, 'Šalšu', 'Menguante', 'main')}
            </div>
          </div>

          {/* Deity & festival */}
          {lore && (
            <div className="babylonian-calendar-deity">
              <div className="babylonian-calendar-deity-header">
                <span className="babylonian-calendar-deity-icon">{lore.icon}</span>
                <div>
                  <div className="babylonian-calendar-deity-label">Deidad del Mes</div>
                  <div className="babylonian-calendar-deity-name">{lore.festivalDeity}</div>
                  {lore.festivalDeityGloss && (
                    <div className="babylonian-calendar-deity-gloss">
                      {lore.festivalDeityGloss}
                    </div>
                  )}
                </div>
              </div>
              <p className="babylonian-calendar-deity-desc">
                {'"'}
                {lore.description}
                {'"'}
              </p>
              <div className="babylonian-calendar-deity-grid">
                <div className="babylonian-calendar-deity-card">
                  <div className="babylonian-calendar-deity-card-label">Regente del Mes</div>
                  <div className="babylonian-calendar-deity-card-content">
                    {lore.monthRegent}
                    {lore.regentNote && (
                      <span className="babylonian-calendar-regent-note">
                        {' '}
                        · {lore.regentNote}
                      </span>
                    )}
                  </div>
                  <div className="babylonian-calendar-regent-desc">
                    {babDate.monthRegentDesc}
                  </div>
                </div>
                <div className="babylonian-calendar-deity-card">
                  <div className="babylonian-calendar-deity-card-label">Festival / Ritual</div>
                  <div className="babylonian-calendar-deity-card-content">{lore.festival}</div>
                </div>
              </div>
              <div className="babylonian-calendar-zodiac">
                Signo zodiacal:{' '}
                <span className="babylonian-calendar-zodiac-sign">{lore.zodiacSign}</span>
                {lore.zodiacSign in BABYLONIAN_ZODIAC_ES && (
                  <span className="babylonian-calendar-zodiac-gloss">
                    {' '}
                    ≈{' '}
                    {BABYLONIAN_ZODIAC_ES[lore.zodiacSign as keyof typeof BABYLONIAN_ZODIAC_ES]}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Current day stats */}
          <div className="babylonian-calendar-stats">
            {[
              { label: 'Hora temporal', value: babDate.hourName, gloss: babDate.hourNameEs },
              { label: 'Guardia', value: babDate.watchName, gloss: babDate.watchDesc },
              {
                label: 'Planeta rector',
                value: babDate.planetaryRuler,
                gloss: babDate.planetaryRulerEs,
              },
              {
                label: 'Fase lunar',
                value: babDate.moonPhaseName,
                gloss: babDate.moonPhaseNameEs,
              },
            ].map(({ label, value, gloss }) => (
              <div key={label} className="babylonian-calendar-stat">
                <div className="babylonian-calendar-stat-label">{label}</div>
                <div className="babylonian-calendar-stat-value">{value}</div>
                <div className="babylonian-calendar-stat-gloss">{gloss}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <button type="button" className="babylonian-calendar-modal-footer" onClick={onClose}>
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
  isTimeTraveling = false,
}) => {
  const { labels } = useCivilization();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  if (loading) {
    return (
      <div className="babylonian-clock-loading">
        <span className="babylonian-clock-loading-text">{labels.loadingText}</span>
      </div>
    );
  }

  return (
    <>
      <div className="babylonian-clock animate-fadeIn">
        {/* Top Bar */}
        <div className="babylonian-clock-topbar">
          {weather && (
            <WeatherWidget
              weather={weather}
              onClick={() => setIsWeatherOpen(true)}
              className="babylonian-clock-weather-widget"
            />
          )}

          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsCalendarOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setIsCalendarOpen(true);
            }}
            className="babylonian-clock-calendar-trigger"
          >
            <div className="babylonian-clock-calendar-label">
              <span className="babylonian-clock-calendar-label-primary">
                Ver Calendario Babilonio
              </span>
              <span className="babylonian-clock-calendar-label-sep">•</span>
              <span className="babylonian-clock-calendar-label-secondary">Era Seléucida</span>
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
        isTimeTraveling={isTimeTraveling}
        travelDate={isTimeTraveling ? modernTime : undefined}
      />
    </>
  );
};

export default BabylonianClock;

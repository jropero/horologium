import React, { useEffect, useRef } from 'react';
import { X, Wind, Thermometer, CloudSun, History, Gauge, Map, Hourglass } from 'lucide-react';
import { WeatherData, WeatherSnapshot } from '../types';
import { LOCATIONS } from '../utils/locations';
import { Geolocation } from '@capacitor/geolocation';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import GlossedTerm from './GlossedTerm';
import { BABYLONIAN_UI_TERMS as BAB } from '../utils/civLabels';
import './WeatherModal.css';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
  /** True while the app is showing a time-travel date instead of the present. */
  isTimeTraveling?: boolean;
  /** The date/time currently being viewed (only meaningful while time traveling). */
  travelDate?: Date;
}

const WeatherIcon = ({
  condition,
  className = 'weather-icon--md',
}: {
  condition: string;
  className?: string;
}) => {
  switch (condition) {
    case 'clear':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} weather-icon--gold`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
      );
    case 'partly-cloudy':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} weather-icon--parchment`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="7.5" r="3.25" stroke="#cfb53b" />
          <path
            d="M9 1.5v1.4M9 12.1v1.4M2.5 7.5H4M14 7.5h1.5M4.4 2.9l1 1M13.6 12.1l-1-1"
            stroke="#cfb53b"
            opacity="0.7"
          />
          <path d="M17.5 21c2.2 0 4-1.8 4-4 0-2.03-1.53-3.7-3.5-3.94-.23-2.72-2.52-4.85-5.29-4.85-2.77 0-5.06 2.13-5.29 4.85-1.97.24-3.5 1.91-3.5 3.94 0 2.2 1.8 4 4 4h9.58z" />
        </svg>
      );
    case 'cloudy':
    case 'fog':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} weather-icon--parchment`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.28-1.72-4.16-3.93-4.43-.26-3.05-2.83-5.44-5.94-5.44-3.11 0-5.68 2.39-5.94 5.44C3.97 10.34 2.25 12.22 2.25 14.5c0 2.485 2.015 4.5 4.5 4.5h10.75z" />
          <path d="M6 19v2M10 19v2M14 19v2M18 19v2" strokeDasharray="1 1" opacity="0.5" />
        </svg>
      );
    case 'rain':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} weather-icon--rain`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 14c2.485 0 4.5-2.015 4.5-4.5 0-2.28-1.72-4.16-3.93-4.43-.26-3.05-2.83-5.44-5.94-5.44-3.11 0-5.68 2.39-5.94 5.44C2.47 5.34.75 7.22.75 9.5c0 2.485 2.015 4.5 4.5 4.5h10.75z" />
          <path d="M8 16l-2 4M12 16l-2 4M16 16l-2 4" />
        </svg>
      );
    case 'snow':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} weather-icon--white`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
          <path
            d="M8 16l.01.01M8 20l.01.01M12 18l.01.01M12 22l.01.01M16 16l.01.01M16 20l.01.01"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'storm':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} weather-icon--storm`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9" />
          <path d="M13 11l-4 6h6l-4 6" />
        </svg>
      );
    default:
      return <CloudSun className={className} />;
  }
};

const ChronosItem: React.FC<{
  data: WeatherSnapshot;
  isCurrent?: boolean;
  civilization: string;
}> = ({ data, isCurrent, civilization }) => (
  <div className={`chronos-item ${isCurrent ? 'chronos-item--current' : 'chronos-item--past'}`}>
    <div className="chronos-item__header">
      <span
        className={`chronos-item__year ${
          isCurrent ? 'chronos-item__year--current' : 'chronos-item__year--past'
        }`}
      >
        {data.yearLabel}
      </span>
      {isCurrent && (
        <span className="chronos-item__today-badge">
          {civilization === 'babylonia' ? (
            <GlossedTerm term={BAB.today} className="chronos-gloss-sm" />
          ) : (
            'Hodie'
          )}
        </span>
      )}
    </div>

    <div className="chronos-item__body">
      <WeatherIcon condition={data.condition} className="weather-icon--sm" />
      <div className="chronos-item__content">
        <div className="chronos-item__desc">
          {civilization === 'hellas' && data.greekDescription
            ? data.greekDescription
            : data.description}
        </div>
        {civilization === 'hellas' && data.greekDescription && (
          <div className="chronos-item__hellas-row">
            <span className="chronos-item__trans">
              {transliterateGreek(data.greekDescription)}
            </span>
            <span className="chronos-item__latin">{data.description}</span>
          </div>
        )}
        <div className="chronos-item__stats">
          <div className="chronos-item__temp">
            <Thermometer className="chronos-item__temp-icon" />
            <span className="chronos-item__temp-val">{Math.round(data.temperature)}°C</span>
          </div>
          <div className="chronos-item__wind">
            <Wind className="chronos-item__wind-icon" />
            <span className="chronos-item__wind-val">{Math.round(data.windSpeed)} km/h</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WeatherModal: React.FC<WeatherModalProps> = ({
  isOpen,
  onClose,
  weather,
  onUpdateLocation,
  currentLat,
  currentLng,
  isTimeTraveling = false,
  travelDate,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { civilization, labels } = useCivilization();
  const [isLocLoading, setIsLocLoading] = React.useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && weather) {
      dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen, weather]);

  const handleLocationSelect = async (loc: (typeof LOCATIONS)[0]) => {
    if (loc.id === 'gps') {
      setIsLocLoading(true);
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 3600000,
        });
        onUpdateLocation(position.coords.latitude, position.coords.longitude);
      } catch (error: any) {
        alert('Locus deprehendi non potuit: ' + error.message);
      } finally {
        setIsLocLoading(false);
      }
    } else if (loc.lat !== null && loc.lng !== null) {
      onUpdateLocation(loc.lat, loc.lng);
    }
  };

  const isLocActive = (loc: (typeof LOCATIONS)[0]) => {
    if (loc.id === 'gps') return false;
    return (
      Math.abs(currentLat - (loc.lat || 0)) < 0.001 &&
      Math.abs(currentLng - (loc.lng || 0)) < 0.001
    );
  };

  const dialogProps = {
    ref: dialogRef,
    className: 'weather-modal animate-fadeIn',
    onClose,
    onClick: (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onClose();
    },
  } as const;

  if (!weather) {
    return <dialog {...dialogProps} />;
  }

  const { current, historical } = weather;
  const statusLabel = isTimeTraveling ? 'Status Temporis' : 'Status Praesens';

  return (
    <dialog {...dialogProps}>
      <div className="weather-modal__panel">
        {/* Decorative background hatch */}
        <div className="weather-modal__hatch woodcut-hatch"></div>

        {/* Header */}
        <div className="weather-modal__header">
          <div className="weather-modal__header-title">
            <CloudSun className="weather-modal__header-cloud-icon" />
            <h2>
              {civilization === 'babylonia' ? (
                <GlossedTerm term={BAB.skyRecords} align="start" />
              ) : (
                'Annales Coeli'
              )}
            </h2>
          </div>
          <button onClick={onClose} className="weather-modal__close">
            <X className="weather-modal__close-icon" />
          </button>
        </div>

        {/* Time-travel banner */}
        {isTimeTraveling && (
          <div className="weather-modal__banner">
            <Hourglass className="weather-modal__banner-icon" />
            <span className="weather-modal__banner-label">Viaje Temporal</span>
            {travelDate && (
              <>
                <span className="weather-modal__banner-sep">·</span>
                <span className="weather-modal__banner-date">
                  {travelDate.toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </>
            )}
            <span className="weather-modal__banner-badge">
              {weather.isHistorical ? 'Datos históricos' : 'Sin registro · actual'}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="weather-modal__content custom-scrollbar">
          {/* Location Selector */}
          <div className="weather-modal__location">
            <div className="weather-modal__location-header">
              <Map className="weather-modal__loc-map-icon" />
              {civilization === 'babylonia' ? (
                <GlossedTerm
                  term={BAB.place}
                  align="start"
                  className="weather-modal__location-label"
                />
              ) : (
                <span className="weather-modal__location-label">Mutare Locum:</span>
              )}
            </div>
            <div className="weather-modal__location-scroll custom-scrollbar-thin">
              {LOCATIONS.map(loc => {
                const active = isLocActive(loc);
                const Icon = loc.icon;
                const isGps = loc.id === 'gps';

                let locMod = 'weather-modal__loc-btn--inactive';
                if (active) locMod = 'weather-modal__loc-btn--active';
                else if (isGps) locMod = 'weather-modal__loc-btn--gps';

                const btnClass = [
                  'weather-modal__loc-btn',
                  locMod,
                  isLocLoading && isGps ? 'animate-pulse' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationSelect(loc)}
                    disabled={isLocLoading}
                    className={btnClass}
                  >
                    <Icon className="loc-btn-icon" />
                    <span>{loc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hero Section: Current Weather */}
          <div className="weather-modal__hero">
            <div className="weather-modal__hero-main">
              <div className="weather-modal__hero-info">
                <span className="weather-modal__status-label">
                  {civilization === 'babylonia' ? (
                    <GlossedTerm
                      term={isTimeTraveling ? BAB.day : BAB.today}
                      align="start"
                      glossClassName="gloss-tracking-normal"
                    />
                  ) : (
                    statusLabel
                  )}
                </span>
                <h3 className="weather-modal__hero-title">
                  {civilization === 'hellas' && current.greekDescription
                    ? current.greekDescription
                    : current.description}
                </h3>
                {civilization === 'hellas' && current.greekDescription && (
                  <div className="weather-modal__hellas-row">
                    <span className="weather-modal__wind-trans">
                      {transliterateGreek(current.greekDescription)}
                    </span>
                    <span className="weather-modal__wind-latin">{current.description}</span>
                  </div>
                )}
                <div className="weather-modal__wind-row">
                  {civilization === 'babylonia' ? (
                    <GlossedTerm
                      term={BAB.wind}
                      className="weather-modal__wind-label"
                      glossClassName="weather-modal__wind-gloss"
                    />
                  ) : (
                    <span className="weather-modal__wind-label">{labels.windLabel}:</span>
                  )}
                  <div className="weather-modal__wind-name-col">
                    <span className="weather-modal__wind-name">
                      {civilization === 'hellas' && current.greekWindName
                        ? current.greekWindName
                        : current.latinWindName}
                    </span>
                    {civilization === 'hellas' && current.greekWindName && (
                      <>
                        <span className="weather-modal__wind-trans">
                          {transliterateGreek(current.greekWindName)}
                        </span>
                        <span className="weather-modal__wind-latin">
                          {current.latinWindName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="weather-modal__hero-right">
                <WeatherIcon condition={current.condition} className="weather-icon--lg" />
                <div className="weather-modal__temp-col">
                  <span className="weather-modal__temp">
                    {Math.round(current.temperature)}°
                  </span>
                  <span className="weather-modal__celsius">Celsius</span>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="weather-modal__metrics">
              <div className="weather-modal__metric">
                <Wind className="weather-modal__metric-icon" />
                <span className="weather-modal__metric-label">
                  {civilization === 'babylonia' ? 'Velocidad' : 'Velocitas'}
                </span>
                <span className="weather-modal__metric-value">
                  {Math.round(current.windSpeed)} km/h
                </span>
              </div>
              <div className="weather-modal__metric">
                <div
                  className="weather-modal__wind-arrow"
                  style={{ transform: `rotate(${current.windDirection}deg)` }}
                >
                  <svg viewBox="0 0 24 24" className="weather-modal__wind-arrow-svg">
                    <path d="M12 2 L16 22 L12 18 L8 22 Z" />
                  </svg>
                </div>
                <span className="weather-modal__metric-label">
                  {civilization === 'babylonia' ? 'Dirección' : 'Directio'}
                </span>
                <span className="weather-modal__metric-value">{current.windDirection}°</span>
              </div>
              <div className="weather-modal__metric">
                <Gauge className="weather-modal__metric-icon" />
                <span className="weather-modal__metric-label">
                  {civilization === 'babylonia' ? 'Presión' : 'Pressio'}
                </span>
                <span className="weather-modal__metric-value">
                  {Math.round(current.surfacePressure)} hPa
                </span>
              </div>
              <div className="weather-modal__metric">
                <CloudSun className="weather-modal__metric-icon" />
                {civilization === 'babylonia' ? (
                  <GlossedTerm
                    term={BAB.sky}
                    className="weather-modal__metric-label"
                    glossClassName="text-stone-500"
                  />
                ) : (
                  <span className="weather-modal__metric-label">{labels.skyLabel}</span>
                )}
                <span className="weather-modal__metric-value">
                  {current.condition === 'clear' && 'Serenum'}
                  {current.condition === 'partly-cloudy' && 'Nubes Sparsae'}
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
          <div className="weather-modal__history-header">
            <History className="weather-modal__history-icon" />
            <h4 className="weather-modal__history-title">
              {civilization === 'babylonia' ? (
                <GlossedTerm term={BAB.formerDays} align="start" />
              ) : (
                'Memoria Mundi'
              )}
            </h4>
          </div>

          <div className="weather-modal__history-grid">
            {historical.map(snap => (
              <ChronosItem key={snap.yearLabel} data={snap} civilization={civilization} />
            ))}
          </div>

          <div className="weather-modal__footer">
            <p>Comparatio temporis in eodem loco per annos</p>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default WeatherModal;

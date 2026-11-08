import React from 'react';
import './WeatherWidget.css';
import { WeatherData } from '../types';
import { useCivilization } from '../contexts/CivilizationContext';
import GlossedTerm from './GlossedTerm';
import { BABYLONIAN_UI_TERMS as BAB } from '../utils/civLabels';
import { transliterateGreek } from '../utils/greekTransliteration';

interface WeatherWidgetProps {
  weather: WeatherData;
  className?: string;
  onClick?: () => void;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, className = '', onClick }) => {
  const { civilization, labels } = useCivilization();
  // Extraemos los datos de 'current' para que el resto del código funcione
  const {
    condition,
    description,
    greekDescription,
    egyptianDescription,
    temperature,
    latinWindName,
    greekWindName,
    egyptianWindName,
    windDirection,
    windSpeed,
  } = weather.current;

  const fallbackDesc =
    civilization === 'aegyptus' && egyptianDescription ? egyptianDescription : description;
  const displayDesc =
    civilization === 'hellas' && greekDescription ? greekDescription : fallbackDesc;

  const fallbackWind =
    civilization === 'aegyptus' && egyptianWindName ? egyptianWindName : latinWindName;
  const displayWind = civilization === 'hellas' && greekWindName ? greekWindName : fallbackWind;

  const renderIcon = () => {
    switch (condition) {
      case 'clear':
        return (
          <svg
            viewBox="0 0 24 24"
            className="ww-svg-icon ww-svg-clear"
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
            className="ww-svg-icon ww-svg-cloud"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle
              cx="9"
              cy="7.5"
              r="3.25"
              stroke={civilization === 'aegyptus' ? '#fbbf24' : '#cfb53b'}
            />
            <path
              d="M9 1.5v1.4M9 12.1v1.4M2.5 7.5H4M14 7.5h1.5M4.4 2.9l1 1M13.6 12.1l-1-1"
              stroke={civilization === 'aegyptus' ? '#fbbf24' : '#cfb53b'}
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
            className="ww-svg-icon ww-svg-cloud"
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
            className="ww-svg-icon ww-svg-rain"
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
            className="ww-svg-icon ww-svg-snow"
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
            className="ww-svg-icon ww-svg-storm"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9" />
            <path d="M13 11l-4 6h6l-4 6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={onClick}
      className={`weather-widget${civilization === 'aegyptus' ? ' ww-aegyptus' : ''}${
        onClick ? ' clickable' : ''
      } ${className}`.trim()}
    >
      <div className="ww-icon-container">{renderIcon()}</div>
      <div className="ww-desc-section">
        <span className="ww-sky-label">
          {civilization === 'babylonia' ? (
            <GlossedTerm term={BAB.sky} align="start" className="ww-glossed-sm" />
          ) : (
            labels.skyLabel
          )}
        </span>
        <span className="ww-display-desc">{displayDesc}</span>
        {civilization === 'hellas' && greekDescription && (
          <div className="ww-greek-desc">
            <span className="ww-greek-transliteration">{transliterateGreek(displayDesc)}</span>
            <span className="ww-greek-latin">{description}</span>
          </div>
        )}
        {civilization === 'aegyptus' && (
          <span className="ww-egypt-desc">{egyptianDescription?.split(' ')[1]}</span>
        )}
        <span className="ww-temperature">{Math.round(temperature)}°C</span>
      </div>

      {/* SECCIÓN DE VIENTO */}
      {displayWind && (
        <div className="ww-wind-section">
          <span className="ww-wind-label">
            {civilization === 'babylonia' ? (
              <GlossedTerm term={BAB.wind} className="ww-glossed-sm" />
            ) : (
              labels.windLabel
            )}
          </span>

          <div className="ww-compass">
            {/* Rosa de los vientos de fondo */}
            <svg viewBox="0 0 24 24" className="ww-compass-bg">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="1" />
              <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="1" />
              <line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1" />
              <line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" />
            </svg>

            {/* Aguja 3D dinámica */}
            <svg
              viewBox="0 0 24 24"
              className="ww-compass-needle"
              style={{ transform: `rotate(${windDirection}deg)` }}
            >
              <g transform="translate(12,12)">
                <path
                  d="M0 -10 L3 2 L0 0 Z"
                  fill={civilization === 'aegyptus' ? '#34d399' : '#e3d6b3'}
                />
                <path
                  d="M0 -10 L-3 2 L0 0 Z"
                  fill={civilization === 'aegyptus' ? '#059669' : '#c9b993'}
                />
                <path
                  d="M0 10 L2 2 L0 0 Z"
                  fill={civilization === 'aegyptus' ? '#854d0e' : '#8a7826'}
                />
                <path
                  d="M0 10 L-2 2 L0 0 Z"
                  fill={civilization === 'aegyptus' ? '#422006' : '#5c4f15'}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="1.5"
                  fill="#1a1a1a"
                  stroke={civilization === 'aegyptus' ? '#34d399' : '#e3d6b3'}
                  strokeWidth="0.5"
                />
              </g>
            </svg>
          </div>

          <span className="ww-wind-name">{displayWind.split(' ')[0]}</span>
          {civilization === 'hellas' && greekWindName && (
            <div className="ww-greek-wind">
              <span className="ww-greek-wind-translit">
                {transliterateGreek(displayWind.split(' ')[0])}
              </span>
              <span className="ww-greek-wind-latin">{latinWindName.split(' ')[0]}</span>
            </div>
          )}
          {civilization === 'aegyptus' && (
            <div className="ww-egypt-wind">
              <span className="ww-egypt-wind-icon">{displayWind.split(' ').pop()}</span>
              <span className="ww-egypt-wind-latin">{latinWindName.split(' ')[0]}</span>
            </div>
          )}

          {windSpeed !== undefined && (
            <span className="ww-wind-speed">{Math.round(windSpeed)} km/h</span>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;

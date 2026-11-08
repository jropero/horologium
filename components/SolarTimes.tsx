import React from 'react';
import './SolarTimes.css';
import { useCivilization } from '../contexts/CivilizationContext';

interface SolarTimesProps {
  sunrise: Date;
  sunset: Date;
  currentHourLength: number;
  timezone?: string;
}

const SolarTimes: React.FC<SolarTimesProps> = ({
  sunrise,
  sunset,
  currentHourLength,
  timezone,
}) => {
  const { civilization, labels } = useCivilization();
  const isEgypt = civilization === 'aegyptus';
  const format = (d: Date) => {
    const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    if (timezone) opts.timeZone = timezone;
    return d.toLocaleTimeString('en-GB', opts);
  };

  return (
    <div className="solar-times">
      <div
        className={`solar-times-panel${isEgypt ? ' solar-times-panel--egypt' : ''}`}
        style={
          isEgypt
            ? {
                background: '#0c0804',
                borderColor: 'rgba(24,64,160,0.45)',
                borderRadius: '2px',
              }
            : undefined
        }
      >
        {!isEgypt && <div className="solar-times-hatch woodcut-hatch"></div>}

        <div className="solar-times-side">
          <div className="solar-times-icon--sun">☀</div>
          <div className="solar-times-text">
            <div className="solar-times-label">{labels.sunriseLabel}</div>
            <div className="solar-times-time">{format(sunrise)}</div>
          </div>
        </div>

        <div className="solar-times-divider"></div>

        {/* Hour Length Section */}
        <div className="solar-times-hour-section">
          <div className="solar-times-hour-label">{labels.hourLengthLabel}</div>
          <div className="solar-times-hour-value">
            {Math.round(currentHourLength)}{' '}
            <span className="solar-times-minute-unit">{labels.minuteUnit}</span>
          </div>
        </div>

        <div className="solar-times-divider"></div>

        <div className="solar-times-side solar-times-side--reversed">
          <div className="solar-times-icon--moon">☾</div>
          <div className="solar-times-text solar-times-text--right">
            <div className="solar-times-label">{labels.sunsetLabel}</div>
            <div className="solar-times-time">{format(sunset)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarTimes;

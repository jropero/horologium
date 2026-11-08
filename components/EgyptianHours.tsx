import React, { useMemo } from 'react';
import './EgyptianHours.css';
import { getSunTimes } from '../utils/solar';
import { NIGHT_HOURS, DAY_HOURS, HOURS_HEADING } from '../utils/egyptianHoursData';

interface Props {
  currentDate: Date;
  lat: number;
  lng: number;
}

interface Half {
  isDay: boolean;
  start: Date;
  end: Date;
}

/** The daylight or night half that contains `now` (each split into 12 unequal hours). */
function currentHalf(now: Date, lat: number, lng: number): Half {
  const msPerDay = 86400000;
  const y = getSunTimes(new Date(now.getTime() - msPerDay), lat, lng);
  const t = getSunTimes(now, lat, lng);
  const tm = getSunTimes(new Date(now.getTime() + msPerDay), lat, lng);
  if (now >= t.sunrise && now < t.sunset)
    return { isDay: true, start: t.sunrise, end: t.sunset };
  if (now >= t.sunset) return { isDay: false, start: t.sunset, end: tm.sunrise };
  return { isDay: false, start: y.sunset, end: t.sunrise };
}

// Egyptian hours of the day and night, each personified by its hour goddess.
// Replaces the Greco-Roman planetary hours, which Pharaonic Egypt did not know.
// eslint-disable-next-line sonarjs/cognitive-complexity
const EgyptianHours: React.FC<Props> = ({ currentDate, lat, lng }) => {
  const currentMinute = Math.floor(currentDate.getTime() / 60000);
  const half = useMemo(() => {
    try {
      return currentHalf(currentDate, lat, lng);
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMinute, lat, lng]);

  if (!half) return null;

  const hourMs = (half.end.getTime() - half.start.getTime()) / 12;
  const elapsed = currentDate.getTime() - half.start.getTime();
  const idx = Math.min(11, Math.max(0, Math.floor(elapsed / hourMs)));
  const progress = Math.min(1, Math.max(0, (elapsed - idx * hourMs) / hourMs));
  const hours = half.isDay ? DAY_HOURS : NIGHT_HOURS;
  const heading = half.isDay ? HOURS_HEADING.day : HOURS_HEADING.night;
  const book = half.isDay ? 'Libro del Día (Müller-Roth 2008)' : 'Amduat (Hornung 1963–67)';

  const renderHour = (h: (typeof DAY_HOURS)[0], i: number) => {
    const isCurrent = i === idx;
    const isPast = i < idx;
    const start = new Date(half.start.getTime() + i * hourMs);
    const timeStr = start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return (
      <div
        key={i}
        className={`egyptian-hours__hour-row${
          isCurrent ? ' egyptian-hours__hour-row--current' : ''
        }${isPast ? ' egyptian-hours__hour-row--past' : ''}`}
      >
        <div className="egyptian-hours__hour-top">
          <span className="egyptian-hours__hour-num">{i + 1}</span>
          <div className="egyptian-hours__hour-body">
            {h.translit && <span className="egyptian-hours__hour-translit">{h.translit}</span>}
            <span className="egyptian-hours__hour-name">{h.name}</span>
            {isCurrent && <span className="egyptian-hours__hour-ra">{h.ra}</span>}
          </div>
          <span className="egyptian-hours__hour-time">{timeStr}</span>
        </div>
        {isCurrent && (
          <div className="egyptian-hours__progress-bg">
            <div
              className="egyptian-hours__progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="egyptian-hours">
      <div className="egyptian-hours__card">
        <div className="egyptian-hours__header">
          <div className="egyptian-hours__header-line" />
          <span className="egyptian-hours__header-text">
            <span className="egyptian-hours__header-translit">{heading.translit}</span>
            <span className="egyptian-hours__header-es">{heading.es}</span>
          </span>
          <div className="egyptian-hours__header-line" />
        </div>
        <p className="egyptian-hours__meta">
          <span
            className={half.isDay ? 'egyptian-hours__meta-sun' : 'egyptian-hours__meta-moon'}
          >
            {half.isDay ? '☀' : '☽'}
          </span>{' '}
          wnwt · {Math.round(hourMs / 60000)}′
        </p>

        <div className="egyptian-hours__list">{hours.map(renderHour)}</div>
        <p className="egyptian-hours__book">{book}</p>
      </div>
    </div>
  );
};

export default EgyptianHours;

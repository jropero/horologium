import React, { useMemo } from 'react';
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
  if (now >= t.sunrise && now < t.sunset) return { isDay: true, start: t.sunrise, end: t.sunset };
  if (now >= t.sunset) return { isDay: false, start: t.sunset, end: tm.sunrise };
  return { isDay: false, start: y.sunset, end: t.sunrise };
}

// Egyptian hours of the day and night, each personified by its hour goddess.
// Replaces the Greco-Roman planetary hours, which Pharaonic Egypt did not know.
const EgyptianHours: React.FC<Props> = ({ currentDate, lat, lng }) => {
  const half = useMemo(() => {
    try { return currentHalf(currentDate, lat, lng); } catch { return null; }
  }, [Math.floor(currentDate.getTime() / 60000), lat, lng]);

  if (!half) return null;

  const hourMs = (half.end.getTime() - half.start.getTime()) / 12;
  const elapsed = currentDate.getTime() - half.start.getTime();
  const idx = Math.min(11, Math.max(0, Math.floor(elapsed / hourMs)));
  const progress = Math.min(1, Math.max(0, (elapsed - idx * hourMs) / hourMs));
  const hours = half.isDay ? DAY_HOURS : NIGHT_HOURS;
  const heading = half.isDay ? HOURS_HEADING.day : HOURS_HEADING.night;
  const book = half.isDay ? 'Libro del Día (Müller-Roth 2008)' : 'Amduat (Hornung 1963–67)';

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-2">
      <div className="bg-ink/90 border border-gold-dim/25 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-px flex-1 bg-gold-dim/20" />
          <span className="flex flex-col items-center leading-tight">
            <span className="text-gold-dim text-xs uppercase tracking-[0.3em] font-serif">{heading.translit}</span>
            <span className="text-xs italic text-parchment/60">{heading.es}</span>
          </span>
          <div className="h-px flex-1 bg-gold-dim/20" />
        </div>
        <p className="text-center text-xs font-serif tabular-nums text-gold-dim/80 mb-3">
          <span className={half.isDay ? 'text-amber-400' : 'text-sky-400'}>{half.isDay ? '☀' : '☽'}</span>
          {' '}wnwt · {Math.round(hourMs / 60000)}′
        </p>

        <div className="flex flex-col gap-1">
          {hours.map((h, i) => {
            const isCurrent = i === idx;
            const isPast = i < idx;
            const start = new Date(half.start.getTime() + i * hourMs);
            const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            return (
              <div
                key={i}
                className={`flex flex-col px-2 py-1.5 rounded-lg ${
                  isCurrent ? 'bg-gold-leaf/10 border border-gold-leaf/30' : 'border border-transparent'
                } ${isPast ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <span className={`font-serif text-xs w-6 text-right tabular-nums mt-0.5 ${isCurrent ? 'text-gold-leaf' : 'text-gold-dim/80'}`}>
                    {i + 1}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                    {h.translit && (
                      <span className={`font-serif text-xs italic leading-snug ${isCurrent ? 'text-gold-dim' : 'text-gold-dim/70'}`}>{h.translit}</span>
                    )}
                    <span className={`text-xs leading-snug ${isCurrent ? 'text-parchment' : 'text-parchment/75'}`}>{h.name}</span>
                    {isCurrent && (
                      <span className="text-xs leading-snug text-parchment/80 italic mt-0.5">{h.ra}</span>
                    )}
                  </div>
                  <span className={`font-serif text-xs tabular-nums shrink-0 mt-0.5 ${isCurrent ? 'text-gold-dim' : 'text-gold-dim/70'}`}>
                    {timeStr}
                  </span>
                </div>
                {isCurrent && (
                  <div className="ml-8 mt-1.5 h-1 rounded-full bg-gold-dim/15 overflow-hidden">
                    <div className="h-full bg-gold-leaf/70 rounded-full" style={{ width: `${progress * 100}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs italic text-parchment/45">{book}</p>
      </div>
    </div>
  );
};

export default EgyptianHours;

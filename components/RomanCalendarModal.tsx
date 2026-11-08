import React, { useMemo, useEffect, useRef } from 'react';
import { X, CalendarDays } from 'lucide-react';
import {
  getRomanDate,
  getNundinalLetter,
  NUNDINAE_LETTER,
  LATIN_WEEKDAYS,
} from '../utils/romanTimeUtils';
import { getRomanDayInfo } from '../utils/romanCalendarData';
import { OVID_MONTH_ETYMOLOGIES } from '../utils/ovidFastiData';
import './RomanCalendarModal.css';

interface RomanCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date;
}

const RomanCalendarModal: React.FC<RomanCalendarModalProps> = ({
  isOpen,
  onClose,
  startDate,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Generar solo los próximos 7 días (una semana)
  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const romanDate = getRomanDate(d);
      const info = getRomanDayInfo(d);

      const nundinalLetter = getNundinalLetter(d);
      const isMarketDay = nundinalLetter === NUNDINAE_LETTER;
      const dayOfWeek = LATIN_WEEKDAYS[d.getDay()];

      return {
        gregorianDate: d,
        romanShort: romanDate.short.split(' anno')[0],
        dayOfWeek,
        nundinalLetter,
        isMarketDay,
        info,
      };
    });
  }, [startDate]);

  const ovidMonthInfo = useMemo(() => {
    const currentMonth = startDate.getMonth() + 1;
    return OVID_MONTH_ETYMOLOGIES.find(m => m.month === currentMonth);
  }, [startDate]);

  return (
    <dialog
      ref={dialogRef}
      className="roman-calendar-modal animate-fadeIn"
      onClose={onClose}
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
    >
      <div className="rcm-panel">
        {/* Header del Modal */}
        <div className="rcm-header">
          <div className="rcm-header-title">
            <CalendarDays />
            <h2>Fasti Romani</h2>
          </div>
          {/* Botón de cierre más grande y táctil para móviles */}
          <button onClick={onClose} className="rcm-close-btn" aria-label="Cerrar calendario">
            <X />
          </button>
        </div>

        {/* Lista de 7 días */}
        <div className="rcm-content custom-scrollbar">
          <div className="rcm-separator">— Dies VII Sequentes —</div>

          {/* Epic 1: Ovid Etymology Banner */}
          {ovidMonthInfo && (
            <div className="rcm-ovid-banner">
              <div className="rcm-ovid-label">Etimología: Fastos</div>
              <p className="rcm-ovid-text">&quot;{ovidMonthInfo.text}&quot;</p>
              <div className="rcm-ovid-attribution">— Ovidio, {ovidMonthInfo.reference}</div>
            </div>
          )}

          {nextDays.map((day, idx) => {
            const isToday = idx === 0;
            const hasFestival = !!day.info.festivalName;

            let cardCls = 'rcm-day-card';
            if (isToday) cardCls += ' rcm-day-card--today';
            else if (hasFestival) cardCls += ' rcm-day-card--festival';

            return (
              <div key={idx} className={cardCls}>
                {/* Fecha Gregoriana (Izquierda) */}
                <div className="rcm-day-date-col">
                  <span className="rcm-day-date-text">
                    {day.gregorianDate.toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {isToday && <span className="rcm-today-badge">Hodie</span>}
                </div>

                {/* Info Romana (Derecha) */}
                <div className="rcm-day-info">
                  {/* Fila del día de la semana y nundinae */}
                  <div className="rcm-day-week-row">
                    <span className="rcm-day-of-week">{day.dayOfWeek}</span>
                    <div className="rcm-badges-row">
                      <span className="rcm-nundinal-letter" title="Littera Nundinalis">
                        {day.nundinalLetter}
                      </span>
                      {day.isMarketDay && <span className="rcm-nundinae-badge">Nundinae</span>}
                    </div>
                  </div>

                  <div className="rcm-date-row">
                    <h3 className="rcm-roman-date">{day.romanShort}</h3>
                    <span
                      className={`rcm-status-badge ${
                        ['N', 'NP'].includes(day.info.status)
                          ? 'rcm-status-badge--nefastus'
                          : 'rcm-status-badge--fastus'
                      }`}
                    >
                      {day.info.status}
                    </span>
                  </div>

                  {hasFestival && (
                    <div className="rcm-festival-name">
                      <span className="rcm-festival-star">✧</span> {day.info.festivalName}{' '}
                      <span className="rcm-festival-star">✧</span>
                    </div>
                  )}

                  <div className="rcm-god-row">
                    <span className="rcm-god-label">Deus:</span>
                    <span className="rcm-god-name">{day.info.god}</span>
                  </div>

                  {/* Descripción de la fiesta */}
                  {hasFestival && day.info.description && (
                    <div className="rcm-description-block">
                      <p className="rcm-description-text">&quot;{day.info.description}&quot;</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </dialog>
  );
};

export default RomanCalendarModal;

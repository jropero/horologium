import React, { useMemo } from 'react';
import { X, Eye, Sun } from 'lucide-react';
import { getAlgolEclipses } from '../utils/egyptianAstronomy';
import { getEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getHemerologyForDate } from '../utils/egyptianHemerologyData';
import './HorusEclipseModal.css';

interface HorusEclipseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
}

export interface ExceptionalDay {
  date: Date;
  type: 'good' | 'bad';
  isPast: boolean;
}

const HorusEclipseModal: React.FC<HorusEclipseModalProps> = ({
  isOpen,
  onClose,
  currentDate,
}) => {
  const exceptionalDays = useMemo(() => {
    if (!isOpen) return [];

    const findGoodDays = (
      start: Date,
      count: number,
      direction: 'back' | 'forward',
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ): ExceptionalDay[] => {
      const results: ExceptionalDay[] = [];
      const dayOffset = direction === 'back' ? -1 : 1;
      let checkDate = new Date(start);

      // Ajustar para empezar desde el día anterior/siguiente si buscamos pasado/futuro
      checkDate.setDate(checkDate.getDate() + dayOffset);

      let safety = 0;
      while (results.length < count && safety < 100) {
        safety++;
        const eDate = getEgyptianDate(checkDate);
        const hem = getHemerologyForDate(checkDate, eDate.monthIndex, eDate.dayOfMonth);

        if (hem.morning === 'nefer' && hem.midday === 'nefer' && hem.evening === 'nefer') {
          // Día excepcionalmente bueno
          // Solo si no hay eclipse de Algol en todo el día
          const eclipsesNear = getAlgolEclipses(checkDate, 1, 1);
          const hasEclipseThatDay = eclipsesNear.some(
            e =>
              e.date.getFullYear() === checkDate.getFullYear() &&
              e.date.getMonth() === checkDate.getMonth() &&
              e.date.getDate() === checkDate.getDate(),
          );

          if (!hasEclipseThatDay) {
            results.push({
              date: new Date(checkDate),
              type: 'good',
              isPast: checkDate.getTime() < currentDate.getTime(),
            });
          }
        }
        checkDate.setDate(checkDate.getDate() + dayOffset);
      }
      return results;
    };

    const futureBad = getAlgolEclipses(currentDate, 0, 5)
      .filter(e => e.date.getTime() > currentDate.getTime())
      .map(e => ({ ...e, type: 'bad' as const }));
    const futureGood = findGoodDays(currentDate, 5, 'forward');

    const all = [...futureBad, ...futureGood] as ExceptionalDay[];

    return all.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [currentDate, isOpen]);

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="horus-eclipse-modal animate-fadeIn" onClick={onClose}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="horus-eclipse-modal__panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="horus-eclipse-modal__header">
          <div className="horus-eclipse-modal__header-left">
            <Eye className="horus-eclipse-modal__header-icon" />
            <h2 className="horus-eclipse-modal__header-title">Próximos Eventos de Horus</h2>
          </div>
          <button
            onClick={onClose}
            className="horus-eclipse-modal__close-btn"
            aria-label="Cerrar modal"
          >
            <X className="horus-eclipse-modal__header-icon" />
          </button>
        </div>

        {/* List */}
        <div className="horus-eclipse-modal__body custom-scrollbar">
          <div className="horus-eclipse-modal__grid">
            {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
            {exceptionalDays.map((day, idx) => {
              const eDate = getEgyptianDate(day.date);
              const isBad = day.type === 'bad';

              return (
                <div
                  key={idx}
                  className={`horus-eclipse-modal__event-card ${
                    isBad
                      ? 'horus-eclipse-modal__event-card--bad'
                      : 'horus-eclipse-modal__event-card--good'
                  }`}
                >
                  <div className="horus-eclipse-modal__event-inner">
                    <div className="horus-eclipse-modal__event-top">
                      <div className="horus-eclipse-modal__event-dates">
                        <span className="horus-eclipse-modal__gregorian-date">
                          {day.date.toLocaleDateString('es-ES', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: isBad ? '2-digit' : undefined,
                            minute: isBad ? '2-digit' : undefined,
                          })}
                        </span>
                        <span className="horus-eclipse-modal__egyptian-date">
                          {eDate.isEpagomenal
                            ? `Epagomenai ${eDate.dayOfMonth}`
                            : `${eDate.dayOfMonth} de ${eDate.monthName}`}
                        </span>
                      </div>

                      <div className="horus-eclipse-modal__event-badges">
                        <div
                          className={`horus-eclipse-modal__badge ${
                            isBad
                              ? 'horus-eclipse-modal__badge--bad'
                              : 'horus-eclipse-modal__badge--good'
                          }`}
                        >
                          {isBad ? (
                            <Eye className="horus-eclipse-modal__badge-icon" />
                          ) : (
                            <Sun className="horus-eclipse-modal__badge-icon" />
                          )}
                          {isBad ? 'Eclipse Nefasto' : 'Suerte Suprema'}
                        </div>
                      </div>
                    </div>

                    <div className="horus-eclipse-modal__forecast-row">
                      <div className="horus-eclipse-modal__forecast-label">Pronóstico:</div>
                      <div className="horus-eclipse-modal__forecast-icons">
                        {isBad ? (
                          <>
                            <span className="horus-eclipse-modal__forecast-icon--bad">🦂</span>
                            <span className="horus-eclipse-modal__forecast-icon--bad">🦂</span>
                            <span className="horus-eclipse-modal__forecast-icon--bad">🦂</span>
                          </>
                        ) : (
                          <>
                            <span className="horus-eclipse-modal__forecast-icon--good">☀️</span>
                            <span className="horus-eclipse-modal__forecast-icon--good">☀️</span>
                            <span className="horus-eclipse-modal__forecast-icon--good">☀️</span>
                          </>
                        )}
                      </div>
                      <div className="horus-eclipse-modal__forecast-desc">
                        {isBad
                          ? 'El Ojo de Horus se oscurece'
                          : 'El Ojo de Horus brilla con fuerza'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorusEclipseModal;

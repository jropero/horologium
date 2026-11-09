// EgyptianCalendarModal.tsx — 7-day Alexandrian calendar modal
import React, { useMemo, useEffect, useRef } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { getEgyptianDate, EGYPTIAN_SEASONS } from '../utils/egyptianCalendarUtils';
import {
  getEgyptianMonthDeity,
  getEpagomenalDayInfo,
  getEgyptianFestivalInfo,
} from '../utils/egyptianCalendarData';
import { getAlgolPhase } from '../utils/egyptianAstronomy';
import { useCivilization } from '../contexts/CivilizationContext';
import './EgyptianCalendarModal.css';

// Decade progress bar for each day card
const DecadeProgress: React.FC<{ dayOfMonth: number; isEpagomenal: boolean }> = ({
  dayOfMonth,
  isEpagomenal,
}) => {
  if (isEpagomenal) return null;
  return (
    <div className="decade-progress">
      <div className="decade-progress__labels">
        <span>Déc. I (1)</span>
        <span>Déc. II (11)</span>
        <span>Déc. III (21-30)</span>
      </div>
      <div className="decade-progress__track">
        <div
          className="decade-progress__fill"
          style={{ width: `${(dayOfMonth / 30) * 100}%` }}
        />
      </div>
    </div>
  );
};

interface EgyptianCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date;
}

const EgyptianCalendarModal: React.FC<EgyptianCalendarModalProps> = ({
  isOpen,
  onClose,
  startDate,
}) => {
  const { labels } = useCivilization();
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

  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const egyptianDate = getEgyptianDate(d);
      const deity = getEgyptianMonthDeity(egyptianDate.monthIndex);
      const epagomenalInfo = egyptianDate.isEpagomenal
        ? getEpagomenalDayInfo(egyptianDate.dayOfMonth)
        : null;
      const festival = !egyptianDate.isEpagomenal
        ? getEgyptianFestivalInfo(egyptianDate.monthIndex, egyptianDate.dayOfMonth)
        : null;
      const algol = getAlgolPhase(d);

      return { gregorianDate: d, egyptianDate, deity, epagomenalInfo, festival, algol };
    });
  }, [startDate]);

  return (
    <dialog
      ref={dialogRef}
      className="egyptian-calendar-modal animate-fadeIn"
      onClose={onClose}
      onClick={e => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="egyptian-calendar-modal__panel">
        {/* Header */}
        <div className="egyptian-calendar-modal__header">
          <div className="egyptian-calendar-modal__header-left">
            <CalendarDays className="egyptian-calendar-modal__header-icon" />
            <h2 className="egyptian-calendar-modal__header-title">{labels.calendarTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="egyptian-calendar-modal__close-btn"
            aria-label="Cerrar calendario"
          >
            <X className="egyptian-calendar-modal__close-icon" />
          </button>
        </div>

        {/* Days list */}
        <div className="egyptian-calendar-modal__body custom-scrollbar">
          <div className="egyptian-calendar-modal__subtitle">{labels.calendarSubtitle}</div>

          {/* eslint-disable sonarjs/cognitive-complexity, sonarjs/no-nested-conditional */}
          {nextDays.map((day, idx) => {
            const isToday = idx === 0;
            const hasFestival = !!day.festival?.festivalName;
            const isEpag = day.egyptianDate.isEpagomenal;
            const season = isEpag
              ? null
              : EGYPTIAN_SEASONS[Math.floor(day.egyptianDate.monthIndex / 4)];

            const cardClass = [
              'egyptian-calendar-modal__day-card',
              isToday
                ? 'egyptian-calendar-modal__day-card--today'
                : isEpag
                  ? 'egyptian-calendar-modal__day-card--epagomenal'
                  : hasFestival
                    ? 'egyptian-calendar-modal__day-card--festival'
                    : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={idx} className={cardClass}>
                {/* Gregorian date (left) */}
                <div className="egyptian-calendar-modal__date-col">
                  <span className="egyptian-calendar-modal__date-text">
                    {day.gregorianDate.toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {isToday && (
                    <span className="egyptian-calendar-modal__today-badge">
                      {labels.todayLabel}
                    </span>
                  )}
                </div>

                {/* Egyptian date info (right) */}
                <div className="egyptian-calendar-modal__info-col">
                  {/* Season & Month */}
                  <div className="egyptian-calendar-modal__month-row">
                    <div className="egyptian-calendar-modal__month-name-group">
                      <span className="egyptian-calendar-modal__month-name">
                        {day.egyptianDate.isEpagomenal
                          ? 'Epagomenai'
                          : day.egyptianDate.monthName}
                      </span>
                      <span className="egyptian-calendar-modal__month-glyphs">
                        {day.egyptianDate.monthHieroglyphs}
                      </span>
                      {season && (
                        <span className="egyptian-calendar-modal__season">
                          {season.name} ({season.translation}) {season.hieroglyphic}
                        </span>
                      )}
                    </div>
                    {!isEpag && (
                      <span className="egyptian-calendar-modal__decade-badge">
                        Déc. {day.egyptianDate.decade}
                      </span>
                    )}
                  </div>

                  {/* Day display */}
                  <div className="egyptian-calendar-modal__day-display">
                    {isEpag && day.epagomenalInfo ? (
                      <>
                        <h3 className="egyptian-calendar-modal__day-title egyptian-calendar-modal__day-title--epag">
                          𓊹 {day.epagomenalInfo.celebration}
                        </h3>
                        <span className="egyptian-calendar-modal__day-subtitle">
                          {day.epagomenalInfo.deity} — {day.epagomenalInfo.domain}
                        </span>
                      </>
                    ) : (
                      <>
                        <h3 className="egyptian-calendar-modal__day-title">
                          Día {day.egyptianDate.dayOfMonth} de {day.egyptianDate.monthName}
                        </h3>
                        <span className="egyptian-calendar-modal__day-subtitle">
                          Día {day.egyptianDate.dayOfYear} del año
                        </span>
                      </>
                    )}
                  </div>

                  {/* Festival */}
                  {hasFestival && (
                    <div className="egyptian-calendar-modal__festival-row">
                      <div className="egyptian-calendar-modal__festival-name">
                        <span className="egyptian-calendar-modal__festival-icon">𓊹</span>{' '}
                        {day.festival!.festivalName}{' '}
                        <span className="egyptian-calendar-modal__festival-icon">𓊹</span>
                      </div>
                    </div>
                  )}

                  {/* Deity */}
                  <div className="egyptian-calendar-modal__deity-section">
                    <div className="egyptian-calendar-modal__deity-row">
                      <span className="egyptian-calendar-modal__deity-label">Netjer:</span>
                      <span className="egyptian-calendar-modal__deity-name">
                        {day.deity.deity}
                      </span>
                      <span className="egyptian-calendar-modal__deity-glyph">
                        {day.deity.deityHieroglyphic}
                      </span>
                    </div>
                    <div className="egyptian-calendar-modal__deity-domain">
                      {day.deity.domain}
                    </div>
                  </div>

                  {/* Festival or Epagomenal description */}
                  {(day.festival?.description ||
                    (isEpag && day.epagomenalInfo?.description)) && (
                    <div className="egyptian-calendar-modal__description">
                      <p className="egyptian-calendar-modal__description-text">
                        {'"'}
                        {day.festival?.description || day.epagomenalInfo?.description}
                        {'"'}
                      </p>
                    </div>
                  )}

                  {/* Algol Warning */}
                  {day.algol.isEclipsed && (
                    <div className="egyptian-calendar-modal__algol-warning">
                      <div className="egyptian-calendar-modal__algol-inner">
                        <span className="ecm-algol-pulse">✨</span>
                        <p className="egyptian-calendar-modal__algol-text">
                          Algol en eclipse. El Ojo de Horus se oscurece.
                        </p>
                      </div>
                    </div>
                  )}

                  <DecadeProgress
                    dayOfMonth={day.egyptianDate.dayOfMonth}
                    isEpagomenal={isEpag}
                  />
                </div>
              </div>
            );
          })}
          {/* eslint-enable sonarjs/cognitive-complexity, sonarjs/no-nested-conditional */}
        </div>
      </div>
    </dialog>
  );
};

export default EgyptianCalendarModal;

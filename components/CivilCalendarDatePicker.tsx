import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getAtticCalendarYear, getAtticYearAnchor } from '../utils/atticCalendarUtils';
import { getEgyptianCalendarYear, getEgyptianDate } from '../utils/egyptianCalendarUtils';
import {
  getBabylonianCalendarYear,
  getBabylonianYearAnchor,
} from '../utils/babylonianCalendarUtils';
import type { CivilCalendarYear } from '../types/civilCalendar';
import './CivilCalendarDatePicker.css';

export type CivilPickerCivilization = 'hellas' | 'aegyptus' | 'babylonia';

interface CivilCalendarDatePickerProps {
  civilization: CivilPickerCivilization;
  initialDate: Date;
  lat: number;
  lng: number;
  onConfirm: (date: Date) => void;
  onClose: () => void;
  /** When provided, renders a "Volver al presente" button inside the popup. */
  onReturnToLive?: () => void;
}

interface Selection {
  date: Date;
  monthName: string;
  day: number;
}

const TITLES: Record<CivilPickerCivilization, string> = {
  hellas: 'Ἡμερολόγιον Ἀττικόν',
  aegyptus: 'Calendario Alejandrino',
  babylonia: 'Warḫum Bābilim',
};

// Spanish gloss under the title, where the title is not already Spanish.
const TITLE_GLOSSES: Partial<Record<CivilPickerCivilization, string>> = {
  babylonia: 'Calendario babilonio',
};

const sameDate = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const atNoon = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);

/** Builds a full civil year for the given civilization. */
const buildYear = (
  civilization: CivilPickerCivilization,
  anchorGregYear: number,
  lat: number,
  lng: number,
): CivilCalendarYear => {
  switch (civilization) {
    case 'hellas':
      return getAtticCalendarYear(anchorGregYear, lat, lng);
    case 'aegyptus':
      return getEgyptianCalendarYear(anchorGregYear);
    case 'babylonia':
      return getBabylonianCalendarYear(anchorGregYear, lat, lng);
  }
};

/** Gregorian year that anchors the civil year containing `date`. */
const getAnchor = (
  civilization: CivilPickerCivilization,
  date: Date,
  lat: number,
  lng: number,
): number => {
  switch (civilization) {
    case 'hellas':
      return getAtticYearAnchor(date, lat, lng);
    case 'aegyptus':
      return getEgyptianDate(date).alexandrianYear;
    case 'babylonia':
      return getBabylonianYearAnchor(date, lat, lng);
  }
};

const CivilCalendarDatePicker: React.FC<CivilCalendarDatePickerProps> = ({
  civilization,
  initialDate,
  lat,
  lng,
  onConfirm,
  onClose,
  onReturnToLive,
}) => {
  const initialAnchor = useMemo(
    () => getAnchor(civilization, initialDate, lat, lng),
    [civilization, initialDate, lat, lng],
  );
  const [year, setYear] = useState<number>(initialAnchor);
  const [selected, setSelected] = useState<Selection | null>(() => {
    const cal = buildYear(
      civilization,
      getAnchor(civilization, initialDate, lat, lng),
      lat,
      lng,
    );
    const target = atNoon(initialDate);
    for (const m of cal.months) {
      const hit = m.days.find(d => sameDate(d.gregorian, target));
      if (hit) return { date: hit.gregorian, monthName: m.name, day: hit.day };
    }
    return null;
  });

  const calendar = useMemo(
    () => buildYear(civilization, year, lat, lng),
    [civilization, year, lat, lng],
  );

  const now = useMemo(() => atNoon(new Date()), []);
  const selectedMonthRef = useRef<HTMLDivElement>(null);

  // Bring the selected month into view when the popup opens.
  useEffect(() => {
    if (selectedMonthRef.current) {
      selectedMonthRef.current.scrollIntoView({ block: 'center' });
    }
  }, []);

  const pick = (monthName: string, day: number, date: Date) => {
    setSelected({ date, monthName, day });
  };

  const summary = selected
    ? `${selected.monthName} · día ${selected.day}`
    : 'Selecciona un día';

  return (
    <div
      role="button"
      tabIndex={0}
      className="civil-calendar-date-picker animate-fadeIn"
      data-civilization={civilization}
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose();
      }}
    >
      <div role="presentation" className="ccp-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ccp-header">
          <h3 className="ccp-title">⏳ Viaje Temporal</h3>
          <p className="ccp-civ-name">{TITLES[civilization]}</p>
          {TITLE_GLOSSES[civilization] && (
            <p className="ccp-gloss">{TITLE_GLOSSES[civilization]}</p>
          )}
          <p className="ccp-instruction">Elige un día del calendario anual · sin hora</p>
        </div>

        {/* Year navigation */}
        <div className="ccp-year-nav">
          <button
            onClick={() => setYear(y => y - 1)}
            className="ccp-nav-btn"
            aria-label="Año anterior"
          >
            <ChevronsLeft />
          </button>
          <div className="ccp-year-center">
            <div className="ccp-year-label">{calendar.yearLabel}</div>
            {calendar.yearSubtitle && (
              <div className="ccp-year-subtitle">{calendar.yearSubtitle}</div>
            )}
          </div>
          <button
            onClick={() => setYear(y => y + 1)}
            className="ccp-nav-btn"
            aria-label="Año siguiente"
          >
            <ChevronsRight />
          </button>
        </div>

        {/* Months */}
        <div className="ccp-months custom-scrollbar">
          {calendar.months.map(month => {
            const containsSelected =
              !!selected && month.days.some(d => sameDate(d.gregorian, selected.date));
            return (
              <div
                key={month.key}
                ref={containsSelected ? selectedMonthRef : undefined}
                className={`ccp-month${
                  month.kind === 'intercalary' ? ' ccp-month--intercalary' : ''
                }`}
              >
                {/* Month header */}
                <div className="ccp-month-header">
                  <span className="ccp-month-name">{month.name}</span>
                  {month.latin && <span className="ccp-month-latin">{month.latin}</span>}
                  {month.translation && (
                    <span className="ccp-month-translation">{month.translation}</span>
                  )}
                  {month.kind === 'intercalary' && (
                    <span className="ccp-month-badge">Intercalar</span>
                  )}
                  {month.kind === 'epagomenal' && (
                    <span className="ccp-month-badge">Epagómenos</span>
                  )}
                </div>

                {/* Day grid */}
                <div className="ccp-day-grid">
                  {month.days.map(d => {
                    const isSelected = !!selected && sameDate(d.gregorian, selected.date);
                    const isToday = sameDate(d.gregorian, now);
                    const dayMod = isSelected
                      ? 'ccp-day--selected'
                      : // eslint-disable-next-line sonarjs/no-nested-conditional
                        isToday
                        ? 'ccp-day--today'
                        : 'ccp-day--default';
                    return (
                      <button
                        key={d.day}
                        onClick={() => pick(month.name, d.day, d.gregorian)}
                        className={`ccp-day ${dayMod}`}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="ccp-actions">
          <div className="ccp-summary">{summary}</div>
          <button
            onClick={() => selected && onConfirm(selected.date)}
            disabled={!selected}
            className={`ccp-confirm ${
              selected ? 'ccp-confirm--active' : 'ccp-confirm--disabled'
            }`}
          >
            Viajar a esta fecha
          </button>
          {onReturnToLive && (
            <button onClick={onReturnToLive} className="ccp-return">
              Volver al presente
            </button>
          )}
          <button onClick={onClose} className="ccp-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CivilCalendarDatePicker;

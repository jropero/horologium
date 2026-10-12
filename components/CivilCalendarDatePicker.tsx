import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getAtticCalendarYear, getAtticYearAnchor } from '../utils/atticCalendarUtils';
import { getEgyptianCalendarYear, getEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getBabylonianCalendarYear, getBabylonianYearAnchor } from '../utils/babylonianCalendarUtils';
import type { CivilCalendarYear } from '../types/civilCalendar';

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

const ACCENTS: Record<CivilPickerCivilization, {
  text: string; border: string; soft: string; chip: string; fill: string;
}> = {
  hellas: {
    text: 'text-sky-400',
    border: 'border-sky-400/60',
    soft: 'border-sky-400/25',
    chip: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    fill: 'bg-sky-400 text-ink border-sky-400',
  },
  aegyptus: {
    text: 'text-emerald-400',
    border: 'border-emerald-400/60',
    soft: 'border-emerald-400/25',
    chip: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    fill: 'bg-emerald-400 text-ink border-emerald-400',
  },
  babylonia: {
    text: 'text-blue-400',
    border: 'border-blue-400/60',
    soft: 'border-blue-400/25',
    chip: 'bg-blue-400/10 text-blue-300 border-blue-400/30',
    fill: 'bg-blue-400 text-ink border-blue-400',
  },
};

const TITLES: Record<CivilPickerCivilization, string> = {
  hellas: 'Ἡμερολόγιον Ἀττικόν',
  aegyptus: 'Calendario Alejandrino',
  babylonia: 'Warḫum Bābilim',
};

const sameDate = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const atNoon = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);

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
const getAnchor = (civilization: CivilPickerCivilization, date: Date, lat: number, lng: number): number => {
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
  const accent = ACCENTS[civilization];
  const initialAnchor = useMemo(
    () => getAnchor(civilization, initialDate, lat, lng),
    [civilization, initialDate, lat, lng],
  );
  const [year, setYear] = useState<number>(initialAnchor);
  const [selected, setSelected] = useState<Selection | null>(() => {
    const cal = buildYear(civilization, getAnchor(civilization, initialDate, lat, lng), lat, lng);
    const target = atNoon(initialDate);
    for (const m of cal.months) {
      const hit = m.days.find((d) => sameDate(d.gregorian, target));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (monthName: string, day: number, date: Date) => {
    setSelected({ date, monthName, day });
  };

  const summary = selected
    ? `${selected.monthName} · día ${selected.day}`
    : 'Selecciona un día';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-ink border-2 ${accent.soft} rounded-xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b ${accent.soft} text-center shrink-0`}>
          <h3 className={`font-serif text-sm uppercase tracking-[0.3em] font-bold ${accent.text}`}>
            ⏳ Viaje Temporal
          </h3>
          <p className="font-serif text-lg sm:text-xl text-parchment font-bold tracking-wide mt-1">
            {TITLES[civilization]}
          </p>
          <p className="text-[10px] text-parchment/60 font-serif mt-0.5 tracking-wide">
            Elige un día del calendario anual · sin hora
          </p>
        </div>

        {/* Year navigation */}
        <div className={`flex items-center justify-between gap-1 px-3 py-2 border-b ${accent.soft} shrink-0`}>
          <button
            onClick={() => setYear((y) => y - 1)}
            className="p-2 rounded-lg text-gold-dim/70 hover:text-parchment hover:bg-white/5 transition-colors"
            aria-label="Año anterior"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center min-w-0">
            <div className={`font-serif text-base font-bold tracking-wide ${accent.text}`}>
              {calendar.yearLabel}
            </div>
            {calendar.yearSubtitle && (
              <div className="text-[10px] text-parchment/60 font-serif tracking-wide truncate">
                {calendar.yearSubtitle}
              </div>
            )}
          </div>
          <button
            onClick={() => setYear((y) => y + 1)}
            className="p-2 rounded-lg text-gold-dim/70 hover:text-parchment hover:bg-white/5 transition-colors"
            aria-label="Año siguiente"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>

        {/* Months */}
        <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain px-3 py-3 space-y-4">
          {calendar.months.map((month) => {
            const containsSelected = !!selected && month.days.some((d) => sameDate(d.gregorian, selected.date));
            return (
              <div
                key={month.key}
                ref={containsSelected ? selectedMonthRef : undefined}
                className={`rounded-lg border ${accent.soft} bg-black/20 overflow-hidden ${
                  month.kind === 'intercalary' ? 'ring-1 ring-amber-500/30' : ''
                }`}
              >
                {/* Month header */}
                <div className={`flex items-baseline gap-2 flex-wrap px-3 py-2 border-b ${accent.soft} bg-white/[0.03]`}>
                  <span className={`font-serif text-base font-bold ${accent.text}`}>{month.name}</span>
                  {month.latin && (
                    <span className="text-parchment/85 font-serif text-[13px] uppercase tracking-widest">
                      {month.latin}
                    </span>
                  )}
                  {month.translation && (
                    <span className="text-parchment/70 font-body text-[11px] italic truncate">
                      {month.translation}
                    </span>
                  )}
                  {month.kind === 'intercalary' && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-400 uppercase tracking-widest">
                      Intercalar
                    </span>
                  )}
                  {month.kind === 'epagomenal' && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-400 uppercase tracking-widest">
                      Epagómenos
                    </span>
                  )}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-10 gap-1 p-2">
                  {month.days.map((d) => {
                    const isSelected = !!selected && sameDate(d.gregorian, selected.date);
                    const isToday = sameDate(d.gregorian, now);
                    return (
                      <button
                        key={d.day}
                        onClick={() => pick(month.name, d.day, d.gregorian)}
                        className={`h-8 rounded-md font-serif text-sm tabular-nums transition-all active:scale-90 border
                          ${isSelected
                            ? accent.fill + ' font-bold shadow-[0_0_10px_rgba(0,0,0,0.4)]'
                            : isToday
                              ? `${accent.text} ${accent.border} bg-white/5`
                              : `text-parchment/85 border-transparent hover:bg-white/10 hover:text-parchment`
                          }`}
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
        <div className={`p-4 flex flex-col gap-2 shrink-0 border-t ${accent.soft}`}>
          <div className={`mx-auto w-fit max-w-full truncate font-serif text-xs text-parchment/80 tabular-nums bg-white/5 border ${accent.soft} rounded-full px-3 py-1`}>
            {summary}
          </div>
          <button
            onClick={() => selected && onConfirm(selected.date)}
            disabled={!selected}
            className={`w-full py-2.5 rounded-lg font-serif text-sm uppercase tracking-widest font-bold transition-all active:scale-[0.98] border
              ${selected
                ? `${accent.chip} hover:bg-white/10`
                : 'border-gold-dim/20 text-gold-dim/40 cursor-not-allowed'
              }`}
          >
            Viajar a esta fecha
          </button>
          {onReturnToLive && (
            <button
              onClick={onReturnToLive}
              className="w-full py-2 rounded-lg border border-amber-700/40 text-amber-400 font-serif text-xs uppercase tracking-widest hover:bg-amber-900/20 transition-all active:scale-[0.98]"
            >
              Volver al presente
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full text-center text-[10px] text-gold-dim/75 font-serif uppercase tracking-widest py-1.5 hover:text-gold-dim transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CivilCalendarDatePicker;

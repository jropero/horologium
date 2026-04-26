// EgyptianCalendarModal.tsx — 7-day Alexandrian calendar modal
import React, { useMemo } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { getEgyptianDate, EgyptianDateResult, EGYPTIAN_SEASONS } from '../utils/egyptianCalendarUtils';
import { getEgyptianMonthDeity, getEpagomenalDayInfo, getEgyptianFestivalInfo } from '../utils/egyptianCalendarData';
import { useCivilization } from '../contexts/CivilizationContext';

// Decade progress bar for each day card
const DecadeProgress: React.FC<{ dayOfMonth: number; isEpagomenal: boolean }> = ({ dayOfMonth, isEpagomenal }) => {
  if (isEpagomenal) return null;
  return (
    <div className="w-full mt-3 pt-3 border-t border-gold-dim/20">
      <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-gold-dim uppercase tracking-widest mb-1 opacity-80">
        <span>Déc. I (1)</span>
        <span>Déc. II (11)</span>
        <span>Déc. III (21-30)</span>
      </div>
      <div className="w-full h-1.5 bg-ink/50 border border-gold-dim/30 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
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

const EgyptianCalendarModal: React.FC<EgyptianCalendarModalProps> = ({ isOpen, onClose, startDate }) => {
  const { labels } = useCivilization();

  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const egyptianDate = getEgyptianDate(d);
      const deity = getEgyptianMonthDeity(egyptianDate.monthIndex);
      const epagomenalInfo = egyptianDate.isEpagomenal ? getEpagomenalDayInfo(egyptianDate.dayOfMonth) : null;
      const festival = !egyptianDate.isEpagomenal ? getEgyptianFestivalInfo(egyptianDate.monthIndex, egyptianDate.dayOfMonth) : null;

      return { gregorianDate: d, egyptianDate, deity, epagomenalInfo, festival };
    });
  }, [startDate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-ink border-2 border-gold-dim rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-ink p-3 sm:p-4 border-b border-gold-dim/50 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3 text-gold-leaf">
            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="font-serif text-base sm:text-xl font-bold uppercase tracking-widest">
              {labels.calendarTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-parchment/80 hover:text-roman-red hover:bg-white/10 transition-colors p-2 rounded-full"
            aria-label="Cerrar calendario"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Days list */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-4 custom-scrollbar bg-ink/5">
          <div className="text-center text-gold-dim font-serif text-xs uppercase tracking-[0.3em] mb-4">
            {labels.calendarSubtitle}
          </div>

          {nextDays.map((day, idx) => {
            const isToday = idx === 0;
            const hasFestival = !!day.festival?.festivalName;
            const isEpag = day.egyptianDate.isEpagomenal;
            const season = isEpag ? null : EGYPTIAN_SEASONS[Math.floor(day.egyptianDate.monthIndex / 4)];

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-lg border-2 flex flex-col sm:flex-row gap-4 transition-all duration-300 ${
                  isToday
                    ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : isEpag
                      ? 'border-amber-600/60 bg-amber-900/30'
                      : hasFestival
                        ? 'border-emerald-600/40 bg-emerald-900/20'
                        : 'border-gold-dim/30 bg-ink/40'
                }`}
              >
                {/* Gregorian date (left) */}
                <div className="flex sm:flex-col items-center sm:items-start sm:w-24 shrink-0 gap-2 sm:gap-1 border-b sm:border-b-0 sm:border-r border-gold-dim/40 pb-3 sm:pb-0 sm:pr-4">
                  <span className="text-parchment font-body text-base font-bold uppercase tracking-tight">
                    {day.gregorianDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && <span className="text-emerald-400 text-xs uppercase tracking-[0.2em] font-black border border-emerald-500/40 px-1.5 rounded-sm bg-emerald-500/10">{labels.todayLabel}</span>}
                </div>

                {/* Egyptian date info (right) */}
                <div className="flex-1 flex flex-col">
                  {/* Season & Month */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <span className="text-gold-leaf font-serif text-xs uppercase tracking-[0.2em] font-bold">
                        {day.egyptianDate.isEpagomenal ? 'Epagomenai' : day.egyptianDate.monthName}
                      </span>
                      <span className="text-gold-dim font-serif text-[10px] uppercase tracking-widest mt-0.5">
                        {day.egyptianDate.monthGreekName}
                      </span>
                      {season && (
                        <span className="text-parchment/80 font-body text-[11px] italic mt-0.5">
                          {season.name} ({season.translation}) {season.hieroglyphic}
                        </span>
                      )}
                    </div>
                    {!isEpag && (
                      <span className="text-[11px] px-2 py-0.5 border border-emerald-500/50 rounded-sm bg-emerald-500/10 text-emerald-400 font-serif self-start mt-1">
                        Déc. {day.egyptianDate.decade}
                      </span>
                    )}
                  </div>

                  {/* Day display */}
                  <div className="flex flex-col mb-1">
                    {isEpag && day.epagomenalInfo ? (
                      <>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-amber-400 leading-tight drop-shadow-sm">
                          𓊹 {day.epagomenalInfo.celebration}
                        </h3>
                        <span className="text-gold-leaf/90 font-body text-sm italic mt-1 font-bold">
                          {day.epagomenalInfo.deity} — {day.epagomenalInfo.domain}
                        </span>
                      </>
                    ) : (
                      <>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-parchment leading-tight drop-shadow-sm">
                          Día {day.egyptianDate.dayOfMonth} de {day.egyptianDate.monthName}
                        </h3>
                        <span className="text-gold-leaf/90 font-body text-sm italic mt-1 font-bold">
                          Día {day.egyptianDate.dayOfYear} del año
                        </span>
                      </>
                    )}
                  </div>

                  {/* Festival */}
                  {hasFestival && (
                    <div className="flex flex-col mt-2">
                      <div className="text-emerald-400 font-serif text-sm sm:text-base uppercase tracking-[0.2em] font-black flex items-center gap-2 drop-shadow-md">
                        <span className="text-lg">𓊹</span> {day.festival!.festivalName} <span className="text-lg">𓊹</span>
                      </div>
                    </div>
                  )}

                  {/* Deity */}
                  <div className="text-parchment/90 font-serif text-xs sm:text-sm mt-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className="text-gold-dim uppercase tracking-widest text-[10px] font-bold">Netjer:</span>
                      <span className="text-parchment font-bold tracking-wide">
                        {day.deity.deity}
                      </span>
                      <span className="text-gold-dim/70 text-[10px]">{day.deity.deityHieroglyphic}</span>
                    </div>
                    <div className="text-emerald-500 font-bold font-body italic text-sm">
                      {day.deity.domain}
                    </div>
                  </div>

                  {/* Festival or Epagomenal description */}
                  {(day.festival?.description || (isEpag && day.epagomenalInfo?.description)) && (
                    <div className="mt-3 pt-3 border-t border-gold-dim/30">
                      <p className="font-serif text-xs sm:text-sm text-parchment leading-relaxed text-justify opacity-90 italic">
                        "{day.festival?.description || day.epagomenalInfo?.description}"
                      </p>
                    </div>
                  )}

                  <DecadeProgress dayOfMonth={day.egyptianDate.dayOfMonth} isEpagomenal={isEpag} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EgyptianCalendarModal;

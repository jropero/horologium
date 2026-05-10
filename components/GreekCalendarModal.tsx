import React, { useMemo } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { getAtticDateForDisplay, ATTIC_MONTHS } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDefaultAtticDeity, getDailyAtticDeity } from '../utils/atticCalendarData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';

const LunarProgress: React.FC<{ dayOfMonth: number }> = ({ dayOfMonth }) => {
  const totalDays = 30; // standard approximation for Attic months
  return (
    <div className="w-full mt-3 pt-3 border-t border-gold-dim/20">
      <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-gold-dim uppercase tracking-widest mb-1 opacity-80">
        <span>Νουμηνία (1)</span>
        <span>Διχόμηνις (15)</span>
        <span>Ἔνη καὶ νέα (30)</span>
      </div>
      <div className="w-full h-1.5 bg-ink/50 border border-gold-dim/30 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-gold-leaf/80 shadow-[0_0_8px_rgba(207,181,59,0.6)]" 
          style={{ width: `${(dayOfMonth / totalDays) * 100}%` }}
        />
      </div>
    </div>
  );
};

interface GreekCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date;
}

const GreekCalendarModal: React.FC<GreekCalendarModalProps> = ({ isOpen, onClose, startDate }) => {
  const { labels } = useCivilization();

  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const { atticDate, moonPhase } = getAtticDateForDisplay(d);

      // Look up festival info
      const festival = getAtticFestivalInfo(atticDate.monthIndex, atticDate.dayOfMonth);
      const defaultDeity = getDefaultAtticDeity(atticDate.monthIndex);
      const dailyDeity = getDailyAtticDeity(atticDate.dayOfMonth, atticDate.monthLength);
      
      return {
        gregorianDate: d,
        atticDate,
        moonPhase,
        festival,
        defaultDeity,
        dailyDeity,
      };
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

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-lg border-2 flex flex-col sm:flex-row gap-4 transition-all duration-300 ${isToday
                  ? 'border-gold-leaf bg-gold-leaf/15 shadow-[0_0_15px_rgba(207,181,59,0.2)]'
                  : hasFestival
                    ? 'border-amber-600/60 bg-amber-900/30'
                    : 'border-gold-dim/30 bg-ink/40'
                }`}
              >
                {/* Gregorian date (left) */}
                <div className="flex sm:flex-col items-center sm:items-start sm:w-24 shrink-0 gap-2 sm:gap-1 border-b sm:border-b-0 sm:border-r border-gold-dim/40 pb-3 sm:pb-0 sm:pr-4">
                  <span className="text-parchment font-body text-base font-bold uppercase tracking-tight">
                    {day.gregorianDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && <span className="text-gold-leaf text-xs uppercase tracking-[0.2em] font-black border border-gold-leaf/40 px-1.5 rounded-sm bg-gold-leaf/10">{labels.todayLabel}</span>}
                </div>

                {/* Attic date info (right) */}
                <div className="flex-1 flex flex-col">
                  {/* Month name */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <span className="text-gold-leaf font-serif text-xs uppercase tracking-[0.2em] font-bold">
                        {day.atticDate.monthName}
                      </span>
                      <span className="text-gold-dim font-serif text-[10px] uppercase tracking-widest mt-0.5">
                        {transliterateGreek(day.atticDate.monthName)}
                      </span>
                      <span className="text-parchment/80 font-body text-[11px] italic mt-0.5">
                        Mes de {translateGreekUI(day.atticDate.monthName)}
                      </span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 border border-gold-dim/50 rounded-sm bg-ink/10 text-gold-leaf font-serif self-start mt-1" title="Fase lunar">
                      {day.moonPhase < 0.03 || day.moonPhase > 0.97 ? '🌑' :
                       day.moonPhase < 0.28 ? '🌒' :
                       day.moonPhase < 0.47 ? '🌓' :
                       day.moonPhase < 0.53 ? '🌕' :
                       day.moonPhase < 0.78 ? '🌗' : '🌘'}
                    </span>
                  </div>

                  {/* Attic day name */}
                  <div className="flex flex-col mb-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-parchment leading-tight drop-shadow-sm">
                      {day.atticDate.short}
                    </h3>
                    <span className="text-gold-dim/80 font-serif text-xs tracking-widest uppercase mt-1">
                      {transliterateGreek(day.atticDate.short.replace(/[0-9]/g, '').trim())}
                    </span>
                    <span className="text-gold-leaf/90 font-body text-sm italic mt-1 font-bold">
                      {day.atticDate.spanishShort}
                    </span>
                  </div>

                  {/* Festival */}
                  {hasFestival && (
                    <div className="flex flex-col mt-2">
                      <div className="text-festival font-serif text-sm sm:text-base uppercase tracking-[0.2em] font-black flex items-center gap-2 drop-shadow-md">
                        <span className="text-lg text-sky-400/50">🏛️</span> {day.festival!.festivalName} 
                      </div>
                      
                      {/* NUEVO: Nombre específico del día del festival */}
                      {day.festival!.festivalDayName && (
                        <span className="text-sky-400 font-serif text-[11px] font-bold uppercase tracking-widest mt-1">
                          • {day.festival!.festivalDayName}
                        </span>
                      )}

                      {/* NUEVO: Categoría y Apaphrades */}
                      <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                        {day.festival!.category && (
                          <span className="px-1.5 py-0.5 bg-ink/50 border border-gold-dim/40 text-gold-dim/80 font-serif text-[9px] uppercase tracking-wider rounded-sm">
                            {day.festival!.category}
                          </span>
                        )}
                        {day.festival!.isApaphrades && (
                          <span className="px-1.5 py-0.5 bg-rose-900/30 border border-rose-500/50 text-rose-400 font-serif text-[9px] uppercase tracking-wider rounded-sm animate-pulse">
                            🏺 Día Tabú (Apaphrades)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Deity */}
                  <div className="text-parchment/90 font-serif text-xs sm:text-sm mt-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className="text-gold-dim uppercase tracking-widest text-[10px] font-bold">Θεός:</span>
                      <span className="text-parchment font-bold tracking-wide">
                        {day.festival?.deity || day.dailyDeity?.deity || day.defaultDeity.deity}
                      </span>
                      <span className="text-gold-dim/70 text-[10px] uppercase tracking-widest">
                        ({transliterateGreek(day.festival?.deity || day.dailyDeity?.deity || day.defaultDeity.deity)})
                      </span>
                    </div>
                    <div className="text-roman-red font-bold font-body italic text-sm">
                      {translateGreekUI(day.festival?.deity || day.dailyDeity?.deity || day.defaultDeity.deity)}
                    </div>
                    {day.dailyDeity?.deityDesc && !day.festival?.festivalDesc && (
                      <div className="text-parchment/70 text-[10px] sm:text-xs italic mt-1 leading-relaxed">
                        {day.dailyDeity.deityDesc}
                      </div>
                    )}
                  </div>

                  {/* Festival description */}
                  {day.festival?.festivalDesc && (
                    <div className="mt-3 pt-3 border-t border-gold-dim/30">
                      <p className="font-serif text-xs sm:text-sm text-parchment leading-relaxed text-justify opacity-90 italic">
                        "{day.festival.festivalDesc}"
                      </p>
                    </div>
                  )}

                  {/* Lunar Progress */}
                  <LunarProgress dayOfMonth={day.atticDate.dayOfMonth} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GreekCalendarModal;

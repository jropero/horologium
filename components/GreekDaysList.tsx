import React, { useMemo } from 'react';
import { getAtticDateForDisplay } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDefaultAtticDeity, getDailyAtticDeity } from '../utils/atticCalendarData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';

interface GreekDaysListProps {
  startDate: Date;
  lat?: number;
  lng?: number;
}

// Moon phase emoji helper
const moonEmoji = (phase: number) =>
  phase < 0.03 || phase > 0.97 ? '🌑' :
  phase < 0.28 ? '🌒' :
  phase < 0.47 ? '🌓' :
  phase < 0.53 ? '🌕' :
  phase < 0.78 ? '🌗' : '🌘';

/**
 * The seven following Attic days with their god (Θεὸς τῆς Ἡμέρας) and, when one
 * falls, their festival. Formerly the body of `GreekCalendarModal`; folded into
 * the Greek page so the deity is visible without opening a modal.
 */
const GreekDaysList: React.FC<GreekDaysListProps> = ({ startDate, lat, lng }) => {
  const { labels } = useCivilization();

  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const { atticDate, moonPhase } = getAtticDateForDisplay(d, lat, lng);
      const festival = getAtticFestivalInfo(atticDate.monthIndex, atticDate.dayOfMonth);
      const defaultDeity = getDefaultAtticDeity(atticDate.monthIndex);
      const dailyDeity = getDailyAtticDeity(atticDate.dayOfMonth, atticDate.monthLength);

      return { atticDate, moonPhase, festival, defaultDeity, dailyDeity };
    });
  }, [startDate, lat, lng]);

  return (
    <div className="w-full flex flex-col">
      <div className="font-serif text-xs uppercase tracking-widest text-sky-400 flex items-center justify-center gap-3 border-y border-sky-700/30 py-2 bg-ink/20">
        {labels.calendarSubtitle}
      </div>

      <div className="flex flex-col">
        {nextDays.map((day, idx) => {
          const isToday = idx === 0;
          const hasFestival = !!day.festival?.festivalName;
          const isSacredDay = day.atticDate.dayOfMonth >= 1 && day.atticDate.dayOfMonth <= 8;
          const deity = day.festival?.deity || day.dailyDeity?.deity || day.defaultDeity.deity;
          const deityDesc = day.festival?.festivalDesc || day.dailyDeity?.deityDesc || '';

          // Detect month boundary
          const isNewMonth = idx > 0 && day.atticDate.monthName !== nextDays[idx - 1].atticDate.monthName;

          return (
            <React.Fragment key={idx}>
              {/* Month boundary marker */}
              {isNewMonth && (
                <div className="flex items-center gap-4 px-2 py-4 bg-sky-950/40 border-y border-sky-400/20">
                  <div className="h-px flex-1 bg-sky-400/30" />
                  <span className="text-sky-400 font-serif text-sm font-black uppercase tracking-[0.3em]">
                    {day.atticDate.monthName} — {transliterateGreek(day.atticDate.monthName)}
                  </span>
                  <div className="h-px flex-1 bg-sky-400/30" />
                </div>
              )}

              <div
                className={`flex items-start gap-4 px-1 py-5 border-b border-gold-dim/10 transition-all text-left
                  ${isToday
                    ? 'bg-gold-leaf/10 border-l-4 border-l-gold-leaf'
                    : isSacredDay
                      ? 'bg-amber-950/20 border-l-4 border-l-amber-500/50'
                      : hasFestival
                        ? 'bg-sky-950/20 border-l-4 border-l-sky-400/60'
                        : 'border-l-4 border-l-transparent hover:bg-white/[0.02]'
                  }`}
              >
                {/* LEFT: Day number + moon */}
                <div className="flex flex-col items-center w-14 shrink-0 pt-1">
                  <span className={`font-serif text-2xl font-black leading-none ${isToday ? 'text-gold-leaf' : 'text-parchment/80'}`}>
                    {day.atticDate.dayOfMonth}
                  </span>
                  <span className="text-xl mt-1">{moonEmoji(day.moonPhase)}</span>
                  {isToday && (
                    <span className="text-[8px] text-gold-leaf font-bold uppercase tracking-widest mt-2 bg-gold-leaf/20 px-1.5 py-0.5 rounded border border-gold-leaf/30">
                      {labels.todayLabel}
                    </span>
                  )}
                  {isSacredDay && !isToday && (
                    <span className="text-[7px] text-amber-500/80 font-bold uppercase tracking-widest mt-2 border border-amber-500/30 px-1 py-0.5 rounded leading-none text-center">
                      Día<br/>Sagrado
                    </span>
                  )}
                </div>

                {/* RIGHT: Day info */}
                <div className="flex-1 min-w-0">
                  {/* Day name (Attic) */}
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className={`font-serif text-lg sm:text-xl font-bold leading-tight ${isToday ? 'text-parchment' : 'text-parchment/90'}`}>
                      {day.atticDate.short}
                    </h3>
                    <span className="text-gold-dim font-body text-xs sm:text-sm italic">
                      {day.atticDate.spanishShort}
                    </span>
                  </div>

                  {/* Deity line - MORE PROMINENT */}
                  <div className={`mt-2 p-3 rounded border transition-all ${isSacredDay ? 'bg-amber-950/30 border-amber-500/30 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gold-dim text-[10px] uppercase tracking-widest font-black">Θεός:</span>
                      <span className={`font-serif text-base sm:text-lg font-black tracking-wide ${isSacredDay ? 'text-gold-leaf' : 'text-parchment'}`}>
                        {deity}
                      </span>
                      <span className="text-gold-dim/50 text-xs font-serif">({transliterateGreek(deity)})</span>
                    </div>
                    <div className="text-sky-400 font-serif text-sm font-bold italic mt-1 flex items-center gap-2">
                      <span className="w-4 h-px bg-sky-400/30" />
                      {translateGreekUI(deity)}
                    </div>

                    {/* Deity description */}
                    {deityDesc && (
                      <p className={`font-serif text-xs sm:text-sm italic mt-2 leading-relaxed ${isSacredDay ? 'text-parchment/90' : 'text-parchment/60'}`}>
                        "{deityDesc}"
                      </p>
                    )}
                  </div>

                  {/* ═══ FESTIVAL BLOCK ═══ */}
                  {hasFestival && (
                    <div className="mt-3 p-4 bg-sky-950/40 border border-sky-400/40 rounded-lg shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl text-sky-400 drop-shadow-glow">🏛️</span>
                        <span className="text-sky-300 font-serif text-base sm:text-lg font-black uppercase tracking-widest">
                          {day.festival!.festivalName}
                        </span>
                      </div>

                      {/* Festival day name */}
                      {day.festival!.festivalDayName && (
                        <span className="text-sky-400/80 font-serif text-xs font-black uppercase tracking-[0.2em] block mb-2 border-l-2 border-sky-400/40 pl-3">
                          {day.festival!.festivalDayName}
                        </span>
                      )}

                      {/* Tags row: category + apaphrades */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {day.festival!.category && (
                          <span className="px-2 py-1 bg-ink/60 border border-gold-dim/40 text-gold-dim font-serif text-[10px] uppercase tracking-widest rounded shadow-sm">
                            {day.festival!.category}
                          </span>
                        )}
                        {day.festival!.isApaphrades && (
                          <span className="px-2 py-1 bg-rose-900/40 border border-rose-500/50 text-rose-300 font-serif text-[10px] uppercase tracking-widest rounded shadow-sm animate-pulse">
                            🏺 Día Tabú (Apaphrades)
                          </span>
                        )}
                      </div>

                      {/* Festival description */}
                      {day.festival!.festivalDesc && (
                        <p className="font-serif text-sm sm:text-base text-parchment/80 italic leading-relaxed bg-white/5 p-3 rounded border border-white/5">
                          "{day.festival!.festivalDesc}"
                        </p>
                      )}

                      {/* Compact festival extras */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-serif">
                        {day.festival!.ritualOffering && (
                          <div className="flex items-center gap-2 p-2 bg-amber-950/20 border border-amber-500/20 rounded">
                            <span className="text-xl">{day.festival!.ritualOffering.icon}</span>
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-amber-500/60">Ofrenda</span>
                              <span className="text-amber-100/80">{day.festival!.ritualOffering.item}</span>
                            </div>
                          </div>
                        )}
                        {day.festival!.pannychisDesc && (
                          <div className="flex items-center gap-2 p-2 bg-indigo-950/20 border border-indigo-500/20 rounded">
                            <span className="text-xl animate-pulse">🕯️</span>
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-indigo-400/60">Vigilia</span>
                              <span className="text-indigo-100/80">{day.festival!.pannychisDesc}</span>
                            </div>
                          </div>
                        )}
                        {day.festival!.agonDesc && (
                          <div className="flex items-center gap-2 p-2 bg-emerald-950/20 border border-emerald-500/20 rounded">
                            <span className="text-xl">🌿</span>
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-emerald-400/60">Competición</span>
                              <span className="text-emerald-100/80">{day.festival!.agonDesc}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Aition */}
                      {day.festival!.aition && (
                        <div className="mt-4 pt-3 border-t border-sky-400/20 text-xs font-serif text-stone-400 italic flex gap-2 items-start">
                          <span className="text-base">📜</span>
                          <span className="leading-relaxed">{day.festival!.aition}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default GreekDaysList;

// EgyptianCalendarInfo.tsx — Egyptian calendar info panel
// Shows season, month, decade visualization, deity, and epagomenal highlights

import React, { useState, useEffect } from 'react';
import { getEgyptianDate, EgyptianDateResult, formatEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getEgyptianMonthDeity, getEpagomenalDayInfo, getEgyptianFestivalInfo } from '../utils/egyptianCalendarData';
import { getHemerologyForDate, DailyHemerology, Prognosis } from '../utils/egyptianHemerologyData';
import { getAlgolPhase } from '../utils/egyptianAstronomy';
import { getMoonPhase } from '../utils/solar';
import { useCivilization } from '../contexts/CivilizationContext';

interface EgyptianCalendarInfoProps {
  onClick?: () => void;
}

const EgyptianCalendarInfo: React.FC<EgyptianCalendarInfoProps> = ({ onClick }) => {
  const { civilization, labels } = useCivilization();
  const [egyptianDate, setEgyptianDate] = useState<EgyptianDateResult | null>(null);

  useEffect(() => {
    setEgyptianDate(getEgyptianDate(new Date()));
  }, []);

  if (civilization !== 'aegyptus' || !egyptianDate) return null;

  const deity = getEgyptianMonthDeity(egyptianDate.monthIndex);
  const epagomenalInfo = egyptianDate.isEpagomenal ? getEpagomenalDayInfo(egyptianDate.dayOfMonth) : null;
  const festival = !egyptianDate.isEpagomenal ? getEgyptianFestivalInfo(egyptianDate.monthIndex, egyptianDate.dayOfMonth) : null;

  // Decades visualization: 3 groups of 10 days
  const decade1 = Array.from({ length: 10 }, (_, i) => i + 1);
  const decade2 = Array.from({ length: 10 }, (_, i) => i + 11);
  const decade3 = Array.from({ length: 10 }, (_, i) => i + 21);
  const isCurrentDecade = (dec: number) => egyptianDate.decade === dec;

  const renderDecade = (days: number[], decadeNumber: number, title: string) => (
    <div className={`p-2 flex-1 rounded-md border-2 transition-all ${isCurrentDecade(decadeNumber) ? 'border-emerald-500/50 bg-emerald-500/5 shadow-sm' : 'border-gold-dim/20 bg-ink/20 opacity-70'}`}>
      <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold-dim mb-2 text-center">{title}</h4>
      <div className="flex flex-wrap gap-1 justify-center">
        {days.map(day => {
          const isToday = !egyptianDate.isEpagomenal && day === egyptianDate.dayOfMonth;
          return (
            <div
              key={day}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[7px] sm:text-[9px]
                ${isToday
                  ? 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.6)] font-bold scale-125 z-10'
                  : (isCurrentDecade(decadeNumber) ? 'bg-gold-leaf text-ink' : 'bg-gold-dim/40 text-parchment/80')
                }`}
            >
            </div>
          );
        })}
      </div>
    </div>
  );

  const hemerology = getHemerologyForDate(egyptianDate.monthIndex, egyptianDate.dayOfMonth);

  const PrognosisBlock = ({ title, prognosis }: { title: string, prognosis: Prognosis }) => {
    const isNefer = prognosis === 'nefer';
    const isAha = prognosis === 'aha';
    const isNone = prognosis === 'none';

    return (
      <div className={`flex-1 p-3 rounded border transition-all flex flex-col items-center gap-1
        ${isNefer ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' : 
          isAha ? 'bg-roman-red/30 text-roman-red border-roman-red/50' : 
          'bg-ink/40 text-gold-dim/40 border-gold-dim/20 opacity-50'}`}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">{title}</span>
        <div className="text-xl">
          {isNefer ? '☀️' : isAha ? '🦂' : '—'}
        </div>
        <span className="text-xs font-serif font-bold uppercase tracking-wider">
          {isNefer ? 'Nefer' : isAha ? 'Aha' : 'None'}
        </span>
        <span className="text-[8px] opacity-60">
          {isNefer ? '(Bueno)' : isAha ? '(Malo)' : '—'}
        </span>
      </div>
    );
  };

  const algol = getAlgolPhase(new Date());
  const moonPhase = getMoonPhase(new Date());

  const isNewMoon = moonPhase < 0.03 || moonPhase > 0.97;
  const isFullMoon = moonPhase > 0.47 && moonPhase < 0.53;

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
      onClick={onClick}
    >
      <div className="bg-ink/90 border-[4px] border-gold-dim p-0 rounded-sm shadow-2xl relative overflow-hidden group hover:border-emerald-500/60 transition-colors">

        {/* Egyptian border pattern — Top (lotus/papyrus motif) */}
        <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderBottom: '2px solid var(--gold-dim)' }}>
          <defs>
            <pattern id="egyptian-border" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10,2 L13,8 L10,6 L7,8 Z" fill="none" stroke="var(--gold-leaf)" strokeWidth="1" />
              <path d="M10,6 L10,18" stroke="var(--gold-leaf)" strokeWidth="1" />
              <path d="M0,18 L20,18" stroke="var(--gold-dim)" strokeWidth="0.5" />
              <path d="M5,14 Q10,10 15,14" fill="none" stroke="var(--gold-leaf)" strokeWidth="0.8" opacity="0.6" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="20" fill="url(#egyptian-border)" />
        </svg>

        <div className="p-5 md:p-8 flex flex-col items-center gap-6 text-center">

          {/* TOP: Season & Month */}
          <div className="border-b border-gold-dim/30 pb-4 w-full flex flex-col items-center justify-center gap-2">
            {/* Season hieroglyphic */}
            <div className="text-2xl filter drop-shadow-sm tracking-widest">{egyptianDate.seasonHieroglyphic}</div>
            <h3 className="font-serif text-xl md:text-2xl uppercase tracking-[0.2em] font-bold text-gold-leaf">
              {egyptianDate.isEpagomenal ? 'Epagomenai' : egyptianDate.monthName}
            </h3>
            <div className="font-serif text-xs opacity-70 tracking-widest text-gold-dim uppercase">
              {egyptianDate.isEpagomenal ? egyptianDate.monthGreekName : egyptianDate.monthGreekName}
            </div>
            <div className="text-sm italic text-parchment font-body bg-emerald-500/10 px-4 py-1 rounded-full shadow-inner border border-emerald-500/20">
              {egyptianDate.seasonName} — {egyptianDate.seasonTranslation}
            </div>
          </div>

          {/* EPAGOMENAL HIGHLIGHT */}
          {egyptianDate.isEpagomenal && epagomenalInfo && (
            <div className="w-full bg-gradient-to-b from-emerald-900/30 to-ink/60 p-6 rounded-lg border-2 border-emerald-500/40 shadow-lg">
              <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
                𓊹 Día Epagómeno {epagomenalInfo.dayNumber} 𓊹
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight">
                {epagomenalInfo.celebration}
              </h2>
              <p className="font-serif text-sm text-emerald-300/80 font-bold italic mt-2">
                {epagomenalInfo.deity} — {epagomenalInfo.domain}
              </p>
              <p className="font-serif text-sm text-parchment/70 italic mt-3 leading-relaxed">
                "{epagomenalInfo.description}"
              </p>
            </div>
          )}

          {/* MAIN DATE */}
          {!egyptianDate.isEpagomenal && (
            <div className="w-full my-2">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-sm leading-tight mb-1">
                {formatEgyptianDate(egyptianDate)}
              </h2>
              <p className="font-serif text-sm text-gold-leaf font-bold italic px-2 mt-2">
                Día {egyptianDate.dayOfYear} del año alejandrino
              </p>
            </div>
          )}

          {/* THE THREE DECADES (only for regular months) */}
          {!egyptianDate.isEpagomenal && (
            <div className="w-full bg-ink/40 p-4 rounded-lg border border-gold-dim/30">
              <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim/60 mb-4">Las tres Décadas del mes</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {renderDecade(decade1, 1, "Década I (1–10)")}
                {renderDecade(decade2, 2, "Década II (11–20)")}
                {renderDecade(decade3, 3, "Década III (21–30)")}
              </div>
            </div>
          )}

          {/* HEMEROLOGY SECTION */}
          <div className="w-full flex flex-col gap-3">
            <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim font-bold">Pronóstico del Día (Hemerología)</h3>
            <div className="flex gap-2 w-full">
              <PrognosisBlock title="Mañana" prognosis={hemerology.morning} />
              <PrognosisBlock title="Mediodía" prognosis={hemerology.midday} />
              <PrognosisBlock title="Tarde" prognosis={hemerology.evening} />
            </div>
            {hemerology.instruction && (
              <div className="bg-roman-red/5 border border-roman-red/20 p-3 rounded-md flex items-center gap-3 animate-pulse">
                <span className="text-xl">👁️</span>
                <p className="text-xs italic text-roman-red font-serif leading-tight text-left">
                  {hemerology.instruction}
                </p>
              </div>
            )}
          </div>

          {/* ASTRONOMICAL INFLUENCES */}
          <div className="w-full flex flex-col gap-2 mt-2">
            {algol.isEclipsed && (
              <div className="bg-roman-red/10 border border-roman-red/30 p-3 rounded-md flex items-center gap-3 shadow-inner">
                <span className="text-xl animate-pulse">✨</span>
                <p className="text-[11px] font-serif font-bold text-roman-red leading-tight text-left">
                  ¡Atención! Algol (El Ojo de Horus) está en eclipse hoy. Las fuerzas del Caos acechan.
                </p>
              </div>
            )}
            {(isNewMoon || isFullMoon) && (
              <div className="bg-gold-leaf/5 border border-gold-leaf/20 p-3 rounded-md flex items-center gap-3 shadow-inner">
                <span className="text-xl">🌙</span>
                <p className="text-[11px] font-serif font-bold text-gold-dim leading-tight text-left italic">
                  Fuerte influencia de Seth (Ciclo Lunar).
                </p>
              </div>
            )}
          </div>

          {/* FESTIVAL */}
          {festival && (
            <div className="w-full bg-emerald-500/5 p-4 rounded-lg border-2 border-emerald-500/30">
              <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
                𓊹 {festival.festivalName} 𓊹
              </div>
              <p className="font-serif text-sm text-parchment/90 italic">
                "{festival.description}"
              </p>
            </div>
          )}

          {/* DEITY OF THE MONTH */}
          <div className="flex flex-col items-center gap-2 w-full bg-gold-leaf/5 p-5 rounded-lg border-2 border-gold-leaf/20 transition-all shadow-sm group-hover:bg-gold-leaf/10">
            <div className="text-gold-leaf text-xs font-bold uppercase tracking-widest mb-1">
              {egyptianDate.isEpagomenal ? '— Madre Celeste —' : labels.godOfDayTitle}
            </div>
            <div className="text-2xl mb-1">{deity.deityHieroglyphic}</div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight">
              {deity.deity}
            </h2>
            <div className="text-xs text-emerald-500/80 font-bold uppercase tracking-widest">
              {deity.domain}
            </div>
            <p className="font-serif text-sm text-parchment font-bold italic px-4 mt-2 leading-relaxed">
              "{deity.description}"
            </p>
          </div>
        </div>

        {/* Bottom border — Nile wave pattern */}
        <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderTop: '2px solid var(--gold-dim)' }}>
          <defs>
            <pattern id="nile-waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 Q5,4 10,10 T20,10" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <path d="M0,15 Q5,9 10,15 T20,15" fill="none" stroke="var(--gold-dim)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="20" fill="url(#nile-waves)" />
        </svg>
      </div>
    </div>
  );
};

export default EgyptianCalendarInfo;

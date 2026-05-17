// EgyptianCalendarInfo.tsx — Egyptian calendar info panel
// Shows season, month, decade visualization, deity, and epagomenal highlights

import React, { useState, useEffect } from 'react';
import { getEgyptianDate, EgyptianDateResult, formatEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getEpagomenalDayInfo } from '../utils/egyptianCalendarData';
import { getEgyptianMonthDeity } from '../utils/egyptianDeities';
import { getFestivalsForDate, getNextEgyptianFestivals, Festival } from '../utils/egyptianFestivalsData';
import { getHemerologyForDate, DailyHemerology, Prognosis } from '../utils/egyptianHemerologyData';
import { getAlgolPhase, getLunarPhase } from '../utils/egyptianAstronomy';
import { useCivilization } from '../contexts/CivilizationContext';
import Nilometer from './Nilometer';
import { Waves, Feather, Wine, FishOff, Hammer, Ship, Skull, Music, ArrowDownToLine, Swords, Sparkles, Sailboat, Sprout, Moon, Bird, MoveUp, Crown, Sun, Flame, AlertTriangle, ArrowUpCircle, MicOff, Stars, ShieldAlert, Wheat, Shirt, SunMedium, Flower2, Ruler, Star, Eye, Scroll, Baby, PartyPopper, Landmark, Tent, CalendarClock } from 'lucide-react';

const FestivalIcon = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return null;
  switch (name) {
    case 'Waves':
      return <Waves className={className} size={18} />;
    case 'Feather':
      return <Feather className={className} size={18} />;
    case 'Wine':
      return <Wine className={className} size={18} />;
    case 'FishOff':
      return <FishOff className={className} size={18} />;
    case 'Hammer':
      return <Hammer className={className} size={18} />;
    case 'Ship':
      return <Ship className={className} size={18} />;
    case 'Skull':
      return <Skull className={className} size={18} />;
    case 'Music':
      return <Music className={className} size={18} />;
    case 'ArrowDownToLine':
      return <ArrowDownToLine className={className} size={18} />;
    case 'Swords':
      return <Swords className={className} size={18} />;
    case 'Sparkles':
      return <Sparkles className={className} size={18} />;
    case 'Sailboat':
      return <Sailboat className={className} size={18} />;
    case 'Sprout':
      return <Sprout className={className} size={18} />;
    case 'Moon':
      return <Moon className={className} size={18} />;
    case 'Bird':
      return <Bird className={className} size={18} />;
    case 'MoveUp':
      return <MoveUp className={className} size={18} />;
    case 'Crown':
      return <Crown className={className} size={18} />;
    case 'Sun':
      return <Sun className={className} size={18} />;
    case 'Flame':
      return <Flame className={className} size={18} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} size={18} />;
    case 'ArrowUpCircle':
      return <ArrowUpCircle className={className} size={18} />;
    case 'MicOff':
      return <MicOff className={className} size={18} />;
    case 'Stars':
      return <Stars className={className} size={18} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} size={18} />;
    case 'Wheat':
      return <Wheat className={className} size={18} />;
    case 'Shirt':
      return <Shirt className={className} size={18} />;
    case 'SunMedium':
      return <SunMedium className={className} size={18} />;
    case 'Flower2':
      return <Flower2 className={className} size={18} />;
    case 'Ruler':
      return <Ruler className={className} size={18} />;
    case 'Star':
      return <Star className={className} size={18} />;
    case 'Eye':
      return <Eye className={className} size={18} />;
    case 'Scroll':
      return <Scroll className={className} size={18} />;
    case 'Baby':
      return <Baby className={className} size={18} />;
    case 'PartyPopper':
      return <PartyPopper className={className} size={18} />;
    case 'Landmark':
      return <Landmark className={className} size={18} />;
    case 'Tent':
      return <Tent className={className} size={18} />;
    case 'CalendarClock':
      return <CalendarClock className={className} size={18} />;
    default:
      return null;
  }
};

interface EgyptianCalendarInfoProps {
  onClick?: () => void;
  currentDate?: Date;
}

const EgyptianCalendarInfo: React.FC<EgyptianCalendarInfoProps> = ({ onClick, currentDate = new Date() }) => {
  const { civilization, labels } = useCivilization();
  const [egyptianDate, setEgyptianDate] = useState<EgyptianDateResult | null>(null);
  const [showFestivals, setShowFestivals] = useState(false);

  useEffect(() => {
    setEgyptianDate(getEgyptianDate(currentDate));
  }, [currentDate]);

  if (civilization !== 'aegyptus' || !egyptianDate) return null;

  const deity = getEgyptianMonthDeity(egyptianDate.monthIndex);
  const epagomenalInfo = egyptianDate.isEpagomenal ? getEpagomenalDayInfo(egyptianDate.dayOfMonth) : null;

  // Decades visualization: 3 groups of 10 days
  const decade1 = Array.from({ length: 10 }, (_, i) => i + 1);
  const decade2 = Array.from({ length: 10 }, (_, i) => i + 11);
  const decade3 = Array.from({ length: 10 }, (_, i) => i + 21);
  const isCurrentDecade = (dec: number) => egyptianDate.decade === dec;

  const renderDecade = (days: number[], decadeNumber: number, title: string) => (
    <div className={`p-2 flex-1 rounded-md border-2 transition-all ${isCurrentDecade(decadeNumber) ? 'border-emerald-500/50 bg-emerald-500/5 shadow-sm' : 'border-gold-dim/20 bg-ink/20'}`}>
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

  const hemerology = getHemerologyForDate(currentDate, egyptianDate.monthIndex, egyptianDate.dayOfMonth);

  const PrognosisBlock = ({ title, prognosis }: { title: string, prognosis: Prognosis }) => {
    const isNefer = prognosis === 'nefer';
    const isAha = prognosis === 'aha';
    const isNone = prognosis === 'none';

    return (
      <div className={`flex-1 min-w-[100px] p-3 rounded border transition-all flex flex-col items-center gap-1
        ${isNefer ? 'bg-emerald-900/30 text-egypt-primary border-emerald-500/50' :
          isAha ? 'bg-roman-red/20 text-parchment border-roman-red/50' :
            'bg-ink/40 text-gold-dim/40 border-gold-dim/20 opacity-50'}`}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold">{title}</span>
        <div className="text-xl">
          {isNefer ? '☀️' : isAha ? '🦂' : '—'}
        </div>
        <span className="text-xs font-serif font-bold uppercase tracking-wider">
          {isNefer ? 'Nefer' : isAha ? 'Aha' : 'None'}
        </span>
        <span className="text-[8px] font-bold">
          {isNefer ? '(Bueno)' : isAha ? '(Malo)' : '—'}
        </span>
      </div>
    );
  };

  const algol = getAlgolPhase(currentDate);
  const moonPhase = getLunarPhase(currentDate);
  const lunarDay = Math.floor(moonPhase * 30) + 1;

  // Get festivals from the new definitive database
  const { civilFestivals, lunarFestivals } = getFestivalsForDate(egyptianDate.monthIndex, egyptianDate.dayOfMonth, lunarDay);

  const isNewMoon = moonPhase < 0.03 || moonPhase > 0.97;
  const isFullMoon = moonPhase > 0.47 && moonPhase < 0.53;

  return (
    <>
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
            <div className="text-4xl filter drop-shadow-[0_0_2px_rgba(207,181,59,0.5)] tracking-widest text-gold-leaf mb-2">
              {egyptianDate.seasonHieroglyphic}
            </div>
            <h3 className="font-serif text-xl md:text-2xl uppercase tracking-[0.2em] font-bold text-gold-leaf">
              {egyptianDate.isEpagomenal ? 'Epagomenai' : egyptianDate.monthName}
            </h3>
            <div className="font-serif text-sm tracking-widest text-gold-dim/80 uppercase font-bold flex flex-col items-center gap-1">
              <span className="text-2xl drop-shadow-sm text-gold-leaf">{egyptianDate.monthHieroglyphs}</span>
            </div>
            <div className="text-sm italic text-parchment font-body bg-emerald-500/10 px-4 py-1 rounded-full shadow-inner border border-emerald-500/20">
              {egyptianDate.seasonName} — {egyptianDate.seasonTranslation}
            </div>
          </div>

          {/* EPAGOMENAL HIGHLIGHT */}
          {egyptianDate.isEpagomenal && epagomenalInfo && (
            <div className="w-full bg-gradient-to-b from-emerald-900/30 to-ink/60 p-6 rounded-lg border-2 border-emerald-500/40 shadow-lg">
              <div className="text-egypt-primary text-xs font-bold uppercase tracking-widest mb-2">
                𓊹 Día Epagómeno {epagomenalInfo.dayNumber} 𓊹
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight">
                {epagomenalInfo.celebration}
              </h2>
              <p className="font-serif text-sm text-emerald-300/80 font-bold italic mt-2">
                {epagomenalInfo.deity} — {epagomenalInfo.domain}
              </p>
              <p className="font-serif text-sm text-parchment/90 italic mt-3 leading-relaxed">
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
                Día {egyptianDate.dayOfYear} del año alejandrino • Día Lunar {lunarDay}
              </p>
            </div>
          )}

          {/* THE THREE DECADES (only for regular months) */}
          {!egyptianDate.isEpagomenal && (
            <div 
              className="w-full bg-ink/40 p-4 rounded-lg border border-gold-dim/30 cursor-help hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group/decades"
              onClick={(e) => {
                e.stopPropagation();
                setShowFestivals(true);
              }}
            >
              <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim mb-4 group-hover/decades:text-egypt-primary transition-colors flex justify-between items-center">
                <span>Las tres Décadas del mes</span>
                <span className="text-[10px] animate-pulse">✨ Ver Próximos Festivales</span>
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {renderDecade(decade1, 1, "Década I (1–10)")}
                {renderDecade(decade2, 2, "Década II (11–20)")}
                {renderDecade(decade3, 3, "Década III (21–30)")}
              </div>
            </div>
          )}

          {/* NILOMETER — Dynamic Nile Water Level */}
          <Nilometer monthIndex={egyptianDate.monthIndex} seasonName={egyptianDate.seasonName} />

          {/* HEMEROLOGY SECTION */}
          <div className="w-full flex flex-col gap-3">
            <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim font-bold">Pronóstico del Día (Hemerología)</h3>
            <div className="responsive-wrap gap-2 w-full">
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
            {moonPhase >= 0.45 && moonPhase <= 0.55 && (
              <div className="bg-gold-leaf/20 text-gold-leaf border border-gold-leaf/50 p-3 rounded-md flex items-center gap-3 shadow-inner animate-pulse">
                <span className="text-xl">🌕</span>
                <p className="text-[11px] font-serif font-bold leading-tight text-left">
                  Ventana de Plenilunio: Día propicio para la entronización del Toro Apis en Menfis
                </p>
              </div>
            )}
            {algol.isEclipsed && (
              <div className="bg-roman-red/10 border border-roman-red/30 p-3 rounded-md flex items-center gap-3 shadow-inner">
                <span className="text-xl animate-pulse">✨</span>
                <p className="text-[11px] font-serif font-bold text-roman-red leading-tight text-left">
                  ¡Atención! Algol (El Ojo de Horus) está en eclipse hoy. Las fuerzas del Caos acechan.
                </p>
              </div>
            )}
            {isNewMoon && (
              <div className="bg-indigo-950/30 border border-indigo-500/40 p-3 rounded-md flex items-center gap-3 shadow-inner">
                <span className="text-xl">🌑</span>
                <p className="text-[11px] font-serif font-bold text-indigo-200 leading-tight text-left italic">
                  Noche de Estirar la Cuerda (Pedj-Shes). Sin la luz de la luna, Seshat guía a los arquitectos alineando los templos con las estrellas imperecederas de Mesekhtiu (Osa Mayor).
                </p>
              </div>
            )}
            {isFullMoon && (
              <div className="bg-gold-leaf/5 border border-gold-leaf/20 p-3 rounded-md flex items-center gap-3 shadow-inner">
                <span className="text-xl">🌕</span>
                <p className="text-[11px] font-serif font-bold text-gold-dim leading-tight text-left italic">
                  Plenilunio sagrado. Las fuerzas lunares de Khonsu iluminan el cielo de Kemet.
                </p>
              </div>
            )}
          </div>

          {/* FESTIVALS LIST */}
          {(civilFestivals.length > 0 || lunarFestivals.length > 0) && (
            <div className="w-full flex flex-col gap-3">
              <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim font-bold">Festividades del Día</h3>
              <div className="flex flex-col gap-3">
                {civilFestivals.map((f, i) => (
                  <div key={`civil-${i}`} className="w-full bg-emerald-500/5 p-4 rounded-lg border-2 border-emerald-500/30 text-left">
                    <div className="text-egypt-primary text-[10px] font-bold uppercase tracking-widest mb-1 flex justify-between items-center">
                      <span>𓊹 Festival Civil 𓊹</span>
                      <span className="text-gold-dim/60">Fijo</span>
                    </div>
                    <div className="text-parchment font-serif font-bold text-base mb-1 flex items-center gap-2">
                      <FestivalIcon name={f.icon} className="text-egypt-primary shrink-0" />
                      <span>{f.name}</span>
                    </div>
                    <p className="font-serif text-xs text-parchment/80 italic leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
                {lunarFestivals.map((f, i) => (
                  <div key={`lunar-${i}`} className="w-full bg-gold-leaf/5 p-4 rounded-lg border-2 border-gold-leaf/30 text-left">
                    <div className="text-gold-leaf text-[10px] font-bold uppercase tracking-widest mb-1 flex justify-between items-center">
                      <span>𓊹 Festival Lunar 𓊹</span>
                      <span className="text-gold-dim/60">Día {lunarDay}</span>
                    </div>
                    <div className="text-parchment font-serif font-bold text-base mb-1 flex items-center gap-2">
                      <FestivalIcon name={f.icon} className="text-gold-leaf shrink-0" />
                      <span>{f.name}</span>
                    </div>
                    <p className="font-serif text-xs text-parchment/80 italic leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* DEITY OF THE MONTH */}
          <div className="flex flex-col items-center gap-2 w-full bg-gold-leaf/5 p-5 rounded-lg border-2 border-gold-leaf/20 transition-all shadow-sm group-hover:bg-gold-leaf/10">
            <div className="text-gold-leaf text-xs font-bold uppercase tracking-widest mb-1">
              {egyptianDate.isEpagomenal ? '— Madre Celeste —' : labels.godOfDayTitle}
            </div>
            <div className="text-3xl mb-1 text-gold-leaf drop-shadow-md">𓊹</div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight">
              {deity.name}
            </h2>
            <div className="text-xs text-egypt-primary font-bold uppercase tracking-widest">
              {deity.title}
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

    {/* NEXT FESTIVALS MODAL */}
    {showFestivals && (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fadeIn cursor-pointer"
        onClick={() => setShowFestivals(false)}
      >
        <div 
          className="w-full max-w-lg bg-ink border-4 border-emerald-500/60 rounded-sm shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden relative cursor-pointer"
        >
            {/* Header */}
            <div className="p-6 border-b border-emerald-500/30 bg-emerald-950/20 text-center">
              <div className="text-egypt-primary text-3xl mb-2">𓊹</div>
              <h2 className="text-2xl font-serif font-black text-parchment uppercase tracking-widest drop-shadow-sm">
                Próximos Festivales
              </h2>
              <p className="text-[10px] text-egypt-primary/60 uppercase tracking-[0.3em] font-bold mt-1">
                Calendario Sagrado de Kemet
              </p>
            </div>

            {/* List */}
            <div className="p-6 flex flex-col gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar overscroll-behavior-contain">
              {getNextEgyptianFestivals(egyptianDate.monthIndex, egyptianDate.dayOfMonth, 3).map((f, i) => (
                <div key={i} className="group/fest">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-gold-leaf font-serif text-lg font-bold group-hover/fest:text-egypt-primary transition-colors leading-tight flex items-center gap-2">
                        <FestivalIcon name={f.icon} className="text-egypt-primary shrink-0" />
                        <span>{f.name}</span>
                      </h4>
                      <span className="text-[10px] text-gold-dim/60 font-bold uppercase tracking-widest">
                        {f.date}
                      </span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1 text-right">
                      <div className="text-[14px] text-egypt-primary font-black leading-none">{f.daysRemaining}</div>
                      <div className="text-[7px] text-emerald-500/60 uppercase font-bold tracking-tighter">días</div>
                    </div>
                  </div>
                  <p className="text-parchment/80 font-serif text-sm leading-relaxed italic border-l-2 border-emerald-500/20 pl-4 py-1">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <button 
              className="w-full p-4 bg-emerald-500/10 border-t border-emerald-500/30 text-egypt-primary font-serif text-xs uppercase tracking-widest hover:bg-emerald-500/20 transition-all font-bold"
              onClick={() => setShowFestivals(false)}
            >
              Cerrar Rollo Sagrado
            </button>

            {/* Decorative corners */}
            <div className="absolute top-2 left-2 text-emerald-500/20 text-xl">𓋹</div>
            <div className="absolute top-2 right-2 text-emerald-500/20 text-xl">𓋹</div>
            <div className="absolute bottom-16 left-2 text-emerald-500/20 text-xl">𓋹</div>
            <div className="absolute bottom-16 right-2 text-emerald-500/20 text-xl">𓋹</div>
          </div>
        </div>
    )}
    </>
  );
};

export default EgyptianCalendarInfo;

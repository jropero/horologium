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
import { Waves, Feather, Hammer, Ship, Music, Sparkles, Sailboat, Sprout, Moon, Bird, MoveUp, Crown, Sun, Flame, ArrowUpCircle, Wheat, Shirt, Eye, PartyPopper, Tent, CalendarClock, Ruler, Map, Circle, Compass, Sunrise } from 'lucide-react';

const FestivalIcon = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return null;
  switch (name) {
    case 'Waves':
      return <Waves className={className} size={18} />;
    case 'Feather':
      return <Feather className={className} size={18} />;
    case 'Hammer':
      return <Hammer className={className} size={18} />;
    case 'Ship':
      return <Ship className={className} size={18} />;
    case 'Music':
      return <Music className={className} size={18} />;
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
    case 'ArrowUpCircle':
      return <ArrowUpCircle className={className} size={18} />;
    case 'Wheat':
      return <Wheat className={className} size={18} />;
    case 'Shirt':
      return <Shirt className={className} size={18} />;
    case 'Eye':
      return <Eye className={className} size={18} />;
    case 'PartyPopper':
      return <PartyPopper className={className} size={18} />;
    case 'Tent':
      return <Tent className={className} size={18} />;
    case 'CalendarClock':
      return <CalendarClock className={className} size={18} />;
    case 'Ruler':
      return <Ruler className={className} size={18} />;
    case 'Map':
      return <Map className={className} size={18} />;
    case 'Circle':
      return <Circle className={className} size={18} />;
    case 'Compass':
      return <Compass className={className} size={18} />;
    case 'Sunrise':
      return <Sunrise className={className} size={18} />;
    default:
      return null;
  }
};

// ─── Temple lotus-papyrus frieze border ───────────────────────────────────────
//     Based on Egyptian tomb and temple wall paintings (New Kingdom):
//     alternating open lotus flowers and papyrus umbels on a deep ground
//     with red-ochre + blue banded strips top and bottom (mummy-case style).

const LotusFreizeBorder: React.FC<{ id: string }> = ({ id }) => (
  <svg className="w-full h-14 block" viewBox="0 0 200 36" preserveAspectRatio="none">
    <defs>
      {/* === Tile: 50 × 36 units === */}
      <pattern id={id} x="0" y="0" width="50" height="36" patternUnits="userSpaceOnUse">

        {/* Deep dark Nilotic ground */}
        <rect width="50" height="36" fill="#0c0804" />

        {/* ── Top band: Egyptian blue strip + red-ochre block ── */}
        <rect x="0" y="0"   width="50" height="2"   fill="#1840a0" />
        <rect x="0" y="2"   width="50" height="3"   fill="#c0391a" />
        {[12.5, 25, 37.5].map(x => (
          <line key={x} x1={x} y1="2" x2={x} y2="5" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
        ))}
        <line x1="0" y1="2" x2="50" y2="2" stroke="rgba(240,200,72,0.35)" strokeWidth="0.4" />
        <line x1="0" y1="5" x2="50" y2="5" stroke="rgba(212,168,50,0.92)" strokeWidth="0.7" />

        {/* ── Bottom band: red-ochre block + Egyptian blue strip ── */}
        <rect x="0" y="31"  width="50" height="3"   fill="#c0391a" />
        <rect x="0" y="34"  width="50" height="2"   fill="#1840a0" />
        {[12.5, 25, 37.5].map(x => (
          <line key={x} x1={x} y1="31" x2={x} y2="34" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
        ))}
        <line x1="0" y1="31" x2="50" y2="31" stroke="rgba(212,168,50,0.92)" strokeWidth="0.7" />
        <line x1="0" y1="34" x2="50" y2="34" stroke="rgba(240,200,72,0.35)" strokeWidth="0.4" />

        {/* ══════════════════════════════════════════════════════════════
            OPEN LOTUS — centred at (25, 23), ribs from calyx base
            ══════════════════════════════════════════════════════════════ */}

        {/* Coloured petal fill zones, radiating outward */}
        {/* Blue zone: between centre rib and inner pair */}
        <path d="M25,23 L22,9.5 L25,13 L28,9.5 Z"                fill="#2560c0" />
        <path d="M25,23 L18,12  L22,9.5 L24,13  Z"               fill="#1a4da8" />
        <path d="M25,23 L32,12  L28,9.5 L26,13  Z"               fill="#1a4da8" />
        {/* Green zone: between inner and outer pairs */}
        <path d="M25,23 L14,16  L18,12  L21,14  Z"               fill="#2a7a3a" />
        <path d="M25,23 L36,16  L32,12  L29,14  Z"               fill="#2a7a3a" />
        {/* Red zone: outer petals */}
        <path d="M25,23 L11,20  L14,16  L17,16  Z"               fill="#c03020" />
        <path d="M25,23 L39,20  L36,16  L33,16  Z"               fill="#c03020" />

        {/* Cream rib lines over the fills */}
        <line x1="25" y1="23" x2="25" y2="8.5"  stroke="rgba(238,228,200,0.85)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="23" x2="22" y2="9.5"  stroke="rgba(238,228,200,0.80)" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="25" y1="23" x2="28" y2="9.5"  stroke="rgba(238,228,200,0.80)" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="25" y1="23" x2="18" y2="12"   stroke="rgba(238,228,200,0.72)" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="25" y1="23" x2="32" y2="12"   stroke="rgba(238,228,200,0.72)" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="25" y1="23" x2="14" y2="16"   stroke="rgba(238,228,200,0.60)" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="25" y1="23" x2="36" y2="16"   stroke="rgba(238,228,200,0.60)" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="25" y1="23" x2="11" y2="20"   stroke="rgba(238,228,200,0.48)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="25" y1="23" x2="39" y2="20"   stroke="rgba(238,228,200,0.48)" strokeWidth="0.7" strokeLinecap="round" />

        {/* Arc spanning outer rib tips */}
        <path d="M11,20 A18,21 0 0,1 39,20" fill="none" stroke="rgba(238,228,200,0.38)" strokeWidth="0.8" />

        {/* Gold sepal cup at base */}
        <path d="M19,23.5 Q25,27 31,23.5 L30,21.5 Q25,25 20,21.5 Z" fill="rgba(212,168,40,0.9)" />
        {/* Gold calyx node */}
        <circle cx="25" cy="23" r="2.2" fill="rgba(212,168,40,0.97)" />

        {/* Lotus stem */}
        <line x1="25" y1="25.2" x2="25" y2="28" stroke="rgba(180,140,50,0.82)" strokeWidth="0.9" strokeLinecap="round" />

        {/* ══════════════════════════════════════════════════════════════
            PAPYRUS UMBEL — centred at x=0 (= x=50 tile edge, seamless)
            Ribs fan up from base at y=21; right half visible here,
            left half appears from adjacent tile repetition.
            ══════════════════════════════════════════════════════════════ */}

        {/* Stem */}
        <line x1="0" y1="21" x2="0" y2="28" stroke="rgba(180,140,50,0.82)" strokeWidth="0.9" strokeLinecap="round" />
        {/* Centre stalk */}
        <line x1="0" y1="21" x2="0"    y2="7.5"  stroke="#4a9a5a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right fan ribs (visible in this tile) */}
        <line x1="0" y1="21" x2="5"    y2="8.5"  stroke="#3a8a4a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0" y1="21" x2="9"    y2="10"   stroke="#2a7a3a" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="0" y1="21" x2="12"   y2="13"   stroke="#3a8a4a" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="0" y1="21" x2="14"   y2="17.5" stroke="#2a7a3a" strokeWidth="0.9" strokeLinecap="round" />
        {/* Left fan ribs (clipped here; appear in preceding tile) */}
        <line x1="0" y1="21" x2="-5"   y2="8.5"  stroke="#3a8a4a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0" y1="21" x2="-9"   y2="10"   stroke="#2a7a3a" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="0" y1="21" x2="-12"  y2="13"   stroke="#3a8a4a" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="0" y1="21" x2="-14"  y2="17.5" stroke="#2a7a3a" strokeWidth="0.9" strokeLinecap="round" />
        {/* Gold node at papyrus base */}
        <circle cx="0" cy="21" r="1.6" fill="rgba(212,168,40,0.95)" />

        {/* ── RIGHT edge papyrus (mirror of x=0, for right-side seamlessness) ── */}
        <line x1="50" y1="21" x2="50" y2="28"  stroke="rgba(180,140,50,0.82)" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="50" y1="21" x2="50"  y2="7.5"  stroke="#4a9a5a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="21" x2="45"  y2="8.5"  stroke="#3a8a4a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="50" y1="21" x2="41"  y2="10"   stroke="#2a7a3a" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="50" y1="21" x2="38"  y2="13"   stroke="#3a8a4a" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="50" y1="21" x2="36"  y2="17.5" stroke="#2a7a3a" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="50" y1="21" x2="55"  y2="8.5"  stroke="#3a8a4a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="50" y1="21" x2="59"  y2="10"   stroke="#2a7a3a" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="50" y1="21" x2="62"  y2="13"   stroke="#3a8a4a" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="50" y1="21" x2="64"  y2="17.5" stroke="#2a7a3a" strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="50" cy="21" r="1.6" fill="rgba(212,168,40,0.95)" />

        {/* ── Connecting curved stem at base ── */}
        <path d="M0,28 Q12.5,30 25,28 Q37.5,26 50,28"
              fill="none" stroke="rgba(180,140,50,0.68)" strokeWidth="0.7" />

        {/* ── Hanging lotus buds at midpoints (x=12.5, x=37.5) ── */}
        <line x1="12.5" y1="28.5" x2="12.5" y2="29.5" stroke="rgba(180,140,50,0.5)" strokeWidth="0.6" />
        <path d="M12.5,29.5 L10.5,33 L12.5,31.5 L14.5,33 Z" fill="#1a50b0" opacity="0.82" />

        <line x1="37.5" y1="28.5" x2="37.5" y2="29.5" stroke="rgba(180,140,50,0.5)" strokeWidth="0.6" />
        <path d="M37.5,29.5 L35.5,33 L37.5,31.5 L39.5,33 Z" fill="#1a50b0" opacity="0.82" />

      </pattern>
    </defs>

    <rect x="0" y="0" width="100%" height="36" fill="#0c0804" />
    <rect x="0" y="0" width="100%" height="36" fill={`url(#${id})`} />
  </svg>
);

interface EgyptianCalendarInfoProps {
  onClick?: () => void;
  currentDate?: Date;
}

const EgyptianCalendarInfo: React.FC<EgyptianCalendarInfoProps> = ({ onClick, currentDate = new Date() }) => {
  const { civilization, labels } = useCivilization();
  const [egyptianDate, setEgyptianDate] = useState<EgyptianDateResult | null>(null);
  const [showFestivals, setShowFestivals] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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
          const isToday    = !egyptianDate.isEpagomenal && day === egyptianDate.dayOfMonth;
          const isSelected = day === selectedDay;
          const { civilFestivals } = getFestivalsForDate(egyptianDate.monthIndex, day, 0);
          const hasFest = civilFestivals.length > 0;

          let cls: string;
          if (isSelected)   cls = 'bg-amber-400 text-ink shadow-[0_0_8px_rgba(251,191,36,0.7)] scale-125 z-10 ring-2 ring-amber-300';
          else if (isToday) cls = 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.6)] scale-125 z-10';
          else if (hasFest) cls = isCurrentDecade(decadeNumber) ? 'bg-amber-500/60 ring-1 ring-amber-400' : 'bg-amber-700/35 ring-1 ring-amber-600/40';
          else              cls = isCurrentDecade(decadeNumber) ? 'bg-gold-leaf text-ink' : 'bg-gold-dim/40 text-parchment/80';

          return (
            <button
              key={day}
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedDay(prev => prev === day ? null : day); }}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all cursor-pointer ${cls}`}
            />
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

        <LotusFreizeBorder id="lotus-top" />

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

              {/* Day info panel */}
              {(() => {
                if (selectedDay === null) return (
                  <p className="text-[10px] font-serif text-egypt-primary/40 text-center mt-2">Toca un día para ver su festival</p>
                );
                const { civilFestivals: sf } = getFestivalsForDate(egyptianDate.monthIndex, selectedDay, 0);
                return (
                  <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-900/10 p-3 text-left animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider">Día {selectedDay}</span>
                      <button type="button" onClick={() => setSelectedDay(null)} className="text-amber-600/50 hover:text-amber-400 text-xs px-1 cursor-pointer">✕</button>
                    </div>
                    {sf.length > 0 ? sf.map((f, i) => (
                      <div key={i} className="flex flex-col gap-0.5 mt-1">
                        <span className="text-sm font-serif font-bold text-amber-300">{f.name}</span>
                        <p className="text-xs font-serif text-parchment/80 leading-snug">{f.description}</p>
                      </div>
                    )) : (
                      <span className="text-xs font-serif text-parchment/50">Sin festival civil registrado para este día.</span>
                    )}
                  </div>
                );
              })()}
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

        <LotusFreizeBorder id="lotus-btm" />
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

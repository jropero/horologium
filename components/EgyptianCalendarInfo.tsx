// EgyptianCalendarInfo.tsx — Egyptian calendar info panel (restyled)
// Palette: lotus-papyrus SVG — Egyptian blue #1840a0, red-ochre #c0391a, gold, dark ground

import React, { useState, useEffect, useMemo } from 'react';
import { getEgyptianDate, EgyptianDateResult, formatEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getEpagomenalDayInfo } from '../utils/egyptianCalendarData';
import { getEgyptianMonthDeity } from '../utils/egyptianDeities';
import { getFestivalsForDate, getNextEgyptianFestivals } from '../utils/egyptianFestivalsData';
import { getHemerologyForDate, Prognosis } from '../utils/egyptianHemerologyData';
import { getAlgolPhase, getAlgolDailyData, getLunarPhase, getSopdetHeliacalEvent, getSiriusDailyData, SopdetEvent, SiriusDailyData, AlgolDailyData } from '../utils/egyptianAstronomy';
import { useCivilization } from '../contexts/CivilizationContext';
import Nilometer from './Nilometer';
import { generateEgyptianSkyline } from '../utils/egyptianSkylineGenerator';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';
import { WeatherData } from '../types';
import { Waves, Feather, Hammer, Ship, Music, Sparkles, Sailboat, Sprout, Moon, Bird, MoveUp, Crown, Sun, Flame, ArrowUpCircle, Wheat, Shirt, Eye, PartyPopper, Tent, CalendarClock, Ruler, Map, Circle, Compass, Sunrise } from 'lucide-react';
import HorusEclipseModal from './HorusEclipseModal';

const FestivalIcon = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return null;
  const props = { className, size: 16 };
  switch (name) {
    case 'Waves':        return <Waves {...props} />;
    case 'Feather':      return <Feather {...props} />;
    case 'Hammer':       return <Hammer {...props} />;
    case 'Ship':         return <Ship {...props} />;
    case 'Music':        return <Music {...props} />;
    case 'Sparkles':     return <Sparkles {...props} />;
    case 'Sailboat':     return <Sailboat {...props} />;
    case 'Sprout':       return <Sprout {...props} />;
    case 'Moon':         return <Moon {...props} />;
    case 'Bird':         return <Bird {...props} />;
    case 'MoveUp':       return <MoveUp {...props} />;
    case 'Crown':        return <Crown {...props} />;
    case 'Sun':          return <Sun {...props} />;
    case 'Flame':        return <Flame {...props} />;
    case 'ArrowUpCircle': return <ArrowUpCircle {...props} />;
    case 'Wheat':        return <Wheat {...props} />;
    case 'Shirt':        return <Shirt {...props} />;
    case 'Eye':          return <Eye {...props} />;
    case 'PartyPopper':  return <PartyPopper {...props} />;
    case 'Tent':         return <Tent {...props} />;
    case 'CalendarClock': return <CalendarClock {...props} />;
    case 'Ruler':        return <Ruler {...props} />;
    case 'Map':          return <Map {...props} />;
    case 'Circle':       return <Circle {...props} />;
    case 'Compass':      return <Compass {...props} />;
    case 'Sunrise':      return <Sunrise {...props} />;
    default:             return null;
  }
};

// ─── Temple lotus-papyrus frieze border ───────────────────────────────────────
const LotusFreizeBorder: React.FC<{ id: string }> = ({ id }) => (
  <svg className="w-full h-14 block" viewBox="0 0 200 36" preserveAspectRatio="none">
    <defs>
      <pattern id={id} x="0" y="0" width="50" height="36" patternUnits="userSpaceOnUse">
        <rect width="50" height="36" fill="#0c0804" />
        <rect x="0" y="0"   width="50" height="2"   fill="#1840a0" />
        <rect x="0" y="2"   width="50" height="3"   fill="#c0391a" />
        {[12.5, 25, 37.5].map(x => (
          <line key={x} x1={x} y1="2" x2={x} y2="5" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
        ))}
        <line x1="0" y1="2" x2="50" y2="2" stroke="rgba(240,200,72,0.35)" strokeWidth="0.4" />
        <line x1="0" y1="5" x2="50" y2="5" stroke="rgba(212,168,50,0.92)" strokeWidth="0.7" />
        <rect x="0" y="31"  width="50" height="3"   fill="#c0391a" />
        <rect x="0" y="34"  width="50" height="2"   fill="#1840a0" />
        {[12.5, 25, 37.5].map(x => (
          <line key={x} x1={x} y1="31" x2={x} y2="34" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
        ))}
        <line x1="0" y1="31" x2="50" y2="31" stroke="rgba(212,168,50,0.92)" strokeWidth="0.7" />
        <line x1="0" y1="34" x2="50" y2="34" stroke="rgba(240,200,72,0.35)" strokeWidth="0.4" />
        <path d="M25,23 L22,9.5 L25,13 L28,9.5 Z"                fill="#2560c0" />
        <path d="M25,23 L18,12  L22,9.5 L24,13  Z"               fill="#1a4da8" />
        <path d="M25,23 L32,12  L28,9.5 L26,13  Z"               fill="#1a4da8" />
        <path d="M25,23 L14,16  L18,12  L21,14  Z"               fill="#2a7a3a" />
        <path d="M25,23 L36,16  L32,12  L29,14  Z"               fill="#2a7a3a" />
        <path d="M25,23 L11,20  L14,16  L17,16  Z"               fill="#c03020" />
        <path d="M25,23 L39,20  L36,16  L33,16  Z"               fill="#c03020" />
        <line x1="25" y1="23" x2="25" y2="8.5"  stroke="rgba(238,228,200,0.85)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="23" x2="22" y2="9.5"  stroke="rgba(238,228,200,0.80)" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="25" y1="23" x2="28" y2="9.5"  stroke="rgba(238,228,200,0.80)" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="25" y1="23" x2="18" y2="12"   stroke="rgba(238,228,200,0.72)" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="25" y1="23" x2="32" y2="12"   stroke="rgba(238,228,200,0.72)" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="25" y1="23" x2="14" y2="16"   stroke="rgba(238,228,200,0.60)" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="25" y1="23" x2="36" y2="16"   stroke="rgba(238,228,200,0.60)" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="25" y1="23" x2="11" y2="20"   stroke="rgba(238,228,200,0.48)" strokeWidth="0.7" strokeLinecap="round" />
        <line x1="25" y1="23" x2="39" y2="20"   stroke="rgba(238,228,200,0.48)" strokeWidth="0.7" strokeLinecap="round" />
        <path d="M11,20 A18,21 0 0,1 39,20" fill="none" stroke="rgba(238,228,200,0.38)" strokeWidth="0.8" />
        <path d="M19,23.5 Q25,27 31,23.5 L30,21.5 Q25,25 20,21.5 Z" fill="rgba(212,168,40,0.9)" />
        <circle cx="25" cy="23" r="2.2" fill="rgba(212,168,40,0.97)" />
        <line x1="25" y1="25.2" x2="25" y2="28" stroke="rgba(180,140,50,0.82)" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="0" y1="21" x2="0" y2="28" stroke="rgba(180,140,50,0.82)" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="0" y1="21" x2="0"    y2="7.5"  stroke="#4a9a5a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="21" x2="5"    y2="8.5"  stroke="#3a8a4a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0" y1="21" x2="9"    y2="10"   stroke="#2a7a3a" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="0" y1="21" x2="12"   y2="13"   stroke="#3a8a4a" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="0" y1="21" x2="14"   y2="17.5" stroke="#2a7a3a" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="0" y1="21" x2="-5"   y2="8.5"  stroke="#3a8a4a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0" y1="21" x2="-9"   y2="10"   stroke="#2a7a3a" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="0" y1="21" x2="-12"  y2="13"   stroke="#3a8a4a" strokeWidth="1.0" strokeLinecap="round" />
        <line x1="0" y1="21" x2="-14"  y2="17.5" stroke="#2a7a3a" strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="0" cy="21" r="1.6" fill="rgba(212,168,40,0.95)" />
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
        <path d="M0,28 Q12.5,30 25,28 Q37.5,26 50,28"
              fill="none" stroke="rgba(180,140,50,0.68)" strokeWidth="0.7" />
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

// ─── Sky gradient by hour ────────────────────────────────────────────────────
const getSkyGradient = (hour: number): string => {
  if (hour < 5 || hour >= 21)
    return 'linear-gradient(to bottom, #030108 0%, #0a0418 45%, #1a0e05 80%, #2a1808 100%)';
  if (hour < 7)
    return 'linear-gradient(to bottom, #0a0205 0%, #5a1200 25%, #c0500a 55%, #e88020 80%, #f5c060 100%)';
  if (hour < 18)
    return 'linear-gradient(to bottom, #1a3a6e 0%, #2460a0 30%, #b08030 65%, #e8c070 85%, #f5dca0 100%)';
  return 'linear-gradient(to bottom, #1a0802 0%, #6a1500 30%, #c04010 60%, #e07020 85%, #f0b050 100%)';
};

// ─── Section header ──────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-center"
      style={{ color: 'rgba(212,168,50,0.85)' }}>
    {children}
  </h3>
);

// ─── Decade day grid ─────────────────────────────────────────────────────────
const DecadeGrid: React.FC<{
  egyptianDate: EgyptianDateResult;
  onShowFestivals: () => void;
}> = ({ egyptianDate, onShowFestivals }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const panels = [
    { days: Array.from({ length: 10 }, (_, i) => i + 1),  decade: 1, label: 'Década I',  sub: 'Primeros 10 días'  },
    { days: Array.from({ length: 10 }, (_, i) => i + 11), decade: 2, label: 'Década II', sub: 'Días centrales'    },
    { days: Array.from({ length: 10 }, (_, i) => i + 21), decade: 3, label: 'Década III', sub: 'Últimos días'     },
  ];

  const activeDecade = egyptianDate.decade;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {panels.map(({ days, decade, label, sub }) => {
          const isActive = decade === activeDecade;
          return (
            <div
              key={decade}
              className={`flex-1 p-2.5 rounded border transition-all duration-300
                ${isActive
                  ? 'border-gold-leaf/50 bg-[#1840a0]/10 shadow-[0_0_12px_rgba(212,168,50,0.08)] scale-[1.01]'
                  : 'border-[#1840a0]/20 bg-[#0c0804]/50'}`}
            >
              <div className="text-center mb-2 border-b border-[#1840a0]/20 pb-1.5">
                <div className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-gold-leaf' : 'text-gold-leaf/50'}`}>
                  {label}
                </div>
                <div className={`text-[8px] font-serif italic mt-0.5 uppercase tracking-wide ${isActive ? 'text-gold-leaf/70' : 'text-gold-leaf/30'}`}>
                  {sub}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {days.map(day => {
                  const isToday    = !egyptianDate.isEpagomenal && day === egyptianDate.dayOfMonth;
                  const isSelected = day === selectedDay;
                  const { civilFestivals } = getFestivalsForDate(egyptianDate.monthIndex, day, 0);
                  const hasFest = civilFestivals.length > 0;

                  let cls: string;
                  if (isSelected)   cls = 'bg-amber-400 shadow-[0_0_8px_rgba(212,168,50,0.7)] scale-125 z-10 ring-2 ring-amber-300';
                  else if (isToday) cls = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] scale-125 z-10';
                  else if (hasFest) cls = isActive ? 'bg-amber-500/60 ring-1 ring-amber-400/70' : 'bg-amber-700/45 ring-1 ring-amber-600/50';
                  else              cls = isActive ? 'bg-[#1840a0]/55 ring-1 ring-[#2255c0]/50' : 'bg-parchment/20 ring-1 ring-parchment/25';

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedDay(prev => prev === day ? null : day); }}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-all cursor-pointer ${cls}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected day info panel */}
      <div className={`mt-2 rounded border transition-all ${
        selectedDay !== null
          ? 'border-amber-600/40 bg-amber-950/20 p-3'
          : 'border-[#1840a0]/20 py-2 px-3'
      }`}>
        {selectedDay !== null ? (() => {
          const { civilFestivals: sf } = getFestivalsForDate(egyptianDate.monthIndex, selectedDay, 0);
          return (
            <div className="text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">Día {selectedDay}</span>
                <button type="button" onClick={() => setSelectedDay(null)} className="text-amber-600/60 hover:text-amber-300 text-xs px-1 cursor-pointer">✕</button>
              </div>
              {sf.length > 0 ? sf.map((f, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-sm font-serif font-bold text-amber-200">{f.name}</span>
                  <p className="text-xs font-serif text-parchment/80 leading-snug">{f.description}</p>
                </div>
              )) : (
                <span className="text-xs font-serif text-parchment/50">Sin festival civil registrado para este día.</span>
              )}
            </div>
          );
        })() : (
          <p className="text-xs font-serif text-center" style={{ color: 'rgba(212,168,50,0.5)' }}>
            Toca un día para ver su festival
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {[
          { cls: 'bg-emerald-400',      label: 'Hoy' },
          { cls: 'bg-amber-600/50 ring-1 ring-amber-400/60', label: 'Festival' },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-sm inline-block ${cls}`} />
            <span className="text-[10px] font-serif text-parchment/50 uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onShowFestivals(); }}
        className="mt-3 w-full py-1.5 text-[10px] font-serif font-bold uppercase tracking-widest text-parchment/60 border border-[#1840a0]/30 rounded hover:border-gold-leaf/40 hover:text-gold-leaf/80 transition-all"
      >
        ✨ Ver Próximos Festivales
      </button>
    </div>
  );
};

// ─── Prognosis card ──────────────────────────────────────────────────────────
const PrognosisCard: React.FC<{ title: string; prognosis: Prognosis }> = ({ title, prognosis }) => {
  const isNefer = prognosis === 'nefer';
  const isAha   = prognosis === 'aha';

  const theme = isNefer
    ? { bg: 'bg-emerald-900/25', border: 'border-emerald-500/40', label: 'text-emerald-300', icon: '☀️', text: 'Nefer', sub: 'Favorable' }
    : isAha
    ? { bg: 'bg-red-900/20',     border: 'border-red-500/35',     label: 'text-red-300',     icon: '🦂', text: 'Aha',   sub: 'Adverso'  }
    : { bg: 'bg-[#0c0804]/50',   border: 'border-[#1840a0]/15',   label: 'text-parchment/30', icon: '—', text: '—',    sub: '—'        };

  return (
    <div className={`flex-1 min-w-[90px] p-3 rounded border flex flex-col items-center gap-1 ${theme.bg} ${theme.border}`}>
      <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(212,168,50,0.6)' }}>{title}</span>
      <span className="text-lg leading-none">{theme.icon}</span>
      <span className={`text-xs font-serif font-bold uppercase tracking-wide ${theme.label}`}>{theme.text}</span>
      <span className={`text-[9px] ${theme.label} opacity-75`}>{theme.sub}</span>
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────
type ViewMode = 'calendar' | 'rites';

interface EgyptianCalendarInfoProps {
  onClick?: () => void;
  currentDate?: Date;
  lat?: number;
  lng?: number;
  weather?: WeatherData | null;
}

const EgyptianCalendarInfo: React.FC<EgyptianCalendarInfoProps> = ({ onClick, currentDate = new Date(), lat, lng, weather }) => {
  const { civilization, labels } = useCivilization();
  const [egyptianDate, setEgyptianDate] = useState<EgyptianDateResult | null>(null);
  const [showFestivals, setShowFestivals] = useState(false);
  const [sopdet, setSopdet] = useState<SopdetEvent | null>(null);
  const [sopdetDaily, setSopdetDaily] = useState<SiriusDailyData | null>(null);
  const [sopdetExpanded, setSopdetExpanded] = useState(false);
  const [algolDaily, setAlgolDaily] = useState<AlgolDailyData | null>(null);
  const [algolExpanded, setAlgolExpanded] = useState(false);
  const [view, setView] = useState<ViewMode>('calendar');
  const [isHorusOpen, setIsHorusOpen] = useState(false);

  useEffect(() => {
    setEgyptianDate(getEgyptianDate(currentDate));
    if (lat != null && lng != null) {
      setSopdet(getSopdetHeliacalEvent(currentDate, lat, lng));
      setSopdetDaily(getSiriusDailyData(currentDate, lat, lng));
      setAlgolDaily(getAlgolDailyData(currentDate, lat, lng));
    }
  }, [currentDate, lat, lng]);

  const skylineElements = useMemo(
    () => generateEgyptianSkyline(Math.floor((currentDate ?? new Date()).getTime() / 86400000)),
    [currentDate]
  );

  const stars = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      x: ((i * 5.37 + 13.7) % 300),
      y: ((i * 3.11 + 7.3) % 120),
      r: i % 5 === 0 ? 1.3 : 0.7,
      opacity: 0.25 + (i % 7) * 0.09,
    })),
  []);

  const weatherCond = weather?.current.condition ?? 'clear';
  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 63] ?? 0.45;
  const weatherParticles = useMemo(() => generateWeatherParticles(rainIntensity), [rainIntensity]);

  if (civilization !== 'aegyptus' || !egyptianDate) return null;

  const hour = currentDate.getHours();
  const isNight = hour < 6 || hour >= 20;
  const skyGradient = getSkyGradient(hour);

  const deity = getEgyptianMonthDeity(egyptianDate.monthIndex);
  const epagomenalInfo = egyptianDate.isEpagomenal ? getEpagomenalDayInfo(egyptianDate.dayOfMonth) : null;
  const hemerology = getHemerologyForDate(currentDate, egyptianDate.monthIndex, egyptianDate.dayOfMonth);
  const algol = getAlgolPhase(currentDate);
  const moonPhase = getLunarPhase(currentDate);
  const lunarDay = Math.floor(moonPhase * 30) + 1;
  const { civilFestivals, lunarFestivals } = getFestivalsForDate(egyptianDate.monthIndex, egyptianDate.dayOfMonth, lunarDay);
  const isNewMoon  = moonPhase < 0.03 || moonPhase > 0.97;
  const isFullMoon = moonPhase > 0.47 && moonPhase < 0.53;

  const hasAstroAlerts = algol.isEclipsed || isNewMoon || isFullMoon ||
    (moonPhase >= 0.45 && moonPhase <= 0.55);

  return (
    <>
    <div
      className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2 cursor-pointer"
      onClick={onClick}
    >
      {/* Main card */}
      <div
        className="border-[4px] p-0 rounded-sm shadow-2xl relative overflow-hidden group hover:border-gold-leaf/70 transition-colors"
        style={{ background: '#0c0804', borderColor: 'rgba(24,64,160,0.65)' }}
      >

        <LotusFreizeBorder id="lotus-top" />

        {/* ── Sky scene ─────────────────────────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden border-b-2"
          style={{ aspectRatio: '16/9', borderColor: 'rgba(24,64,160,0.35)' }}
        >
          {/* Sky gradient */}
          <div className="absolute inset-0 transition-all duration-1000" style={{ background: skyGradient }} />

          {/* Stars + weather effects */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
            {isNight && (
              <g>
                {stars.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.opacity} />
                ))}
              </g>
            )}
            {weatherCond !== 'clear' && (
              <WeatherSvgEffects
                condition={weatherCond}
                weatherParticles={weatherParticles}
                fogGradientId="fog-ground-egy-info"
                cloudOpacity={0.7}
                stormOpacity={0.65}
              />
            )}
            {weatherCond === 'storm' && (
              <rect x="0" y="0" width="300" height="200" fill="#ffffff" opacity="0" className="anim-lightning" />
            )}
          </svg>

          {/* Egyptian skyline */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 300 200"
            preserveAspectRatio="xMidYMax meet"
            style={weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined}
          >
            {skylineElements.map(el => (
              <path
                key={el.id}
                d={el.path}
                fill={weatherCond === 'snow' ? 'rgba(55,65,80,0.88)' : isNight ? 'rgba(40,20,5,0.92)' : 'rgba(100,55,15,0.82)'}
                stroke={weatherCond === 'snow' ? 'rgba(140,165,190,0.45)' : isNight ? 'rgba(80,40,10,0.4)' : 'rgba(160,90,20,0.35)'}
                strokeWidth="0.5"
                opacity={el.opacity}
              />
            ))}
            {/* Snow floor */}
            <path d="M 0 180 L 300 180 L 300 200 L 0 200 Z" fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'} />
            <path d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z" fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'} stroke={weatherCond === 'snow' ? '#f0f4f8' : '#10b981'} strokeWidth="1" />
            {weatherCond === 'snow' && (
              <path d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z" fill="#f0f4f8" opacity="0.9" />
            )}
          </svg>

          {/* Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center px-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <div style={{ fontSize: 'clamp(2.2rem, 9vw, 4rem)', lineHeight: 1, color: 'rgba(238,228,200,0.55)' }}>
              {egyptianDate.seasonHieroglyphic}
            </div>
            <h3
              className="font-serif font-black uppercase tracking-[0.15em] text-parchment leading-none"
              style={{ fontSize: 'clamp(1.6rem, 6.5vw, 3rem)' }}
            >
              {egyptianDate.isEpagomenal ? 'Epagomenai' : egyptianDate.monthName}
            </h3>
            <div style={{ fontSize: 'clamp(1rem, 4vw, 1.6rem)', color: 'rgba(238,228,200,0.45)' }}>
              {egyptianDate.monthHieroglyphs}
            </div>
            <div
              className="font-serif italic text-parchment/70 mt-1"
              style={{ fontSize: 'clamp(0.6rem, 2vw, 0.85rem)', letterSpacing: '0.2em' }}
            >
              {egyptianDate.seasonName} — {egyptianDate.seasonTranslation}
            </div>
          </div>
        </div>

        {/* ── Date strip ──────────────────────────────────────────────────── */}
        <div
          className="py-2 px-4 border-b"
          style={{ borderColor: 'rgba(24,64,160,0.30)', background: 'rgba(12,8,4,0.7)' }}
        >
          {!egyptianDate.isEpagomenal ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              {/* Full date — centred on mobile, inline on desktop */}
              <span className="text-xs font-serif font-bold text-parchment text-center leading-snug">
                {formatEgyptianDate(egyptianDate)}
              </span>
              {/* Secondary stats: compact row on both breakpoints */}
              <div className="flex items-center justify-center gap-3 mt-1 sm:mt-0">
                <span className="hidden sm:inline text-[#1840a0]/50 text-xs select-none">·</span>
                <span className="text-xs font-serif" style={{ color: 'rgba(212,168,50,0.75)' }}>
                  Día {egyptianDate.dayOfYear} del año
                </span>
                <span className="text-[#1840a0]/50 text-xs select-none">·</span>
                <span className="text-xs font-serif text-parchment/55">
                  Luna {lunarDay}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-xs font-serif font-bold text-parchment leading-snug">
                𓊹 Día Epagómeno {epagomenalInfo?.dayNumber} — {epagomenalInfo?.deity} 𓊹
              </span>
            </div>
          )}
        </div>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="p-5 md:p-7 flex flex-col gap-5">

          {/* EPAGOMENAL highlight (shown instead of view toggle) */}
          {egyptianDate.isEpagomenal && epagomenalInfo && (
            <div
              className="w-full p-6 rounded border-2 text-center"
              style={{ background: 'rgba(24,64,160,0.12)', borderColor: 'rgba(212,168,50,0.40)' }}
            >
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,168,50,0.75)' }}>
                𓊹 Celebración Epagómenal 𓊹
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment leading-tight mb-2">
                {epagomenalInfo.celebration}
              </h2>
              <p className="font-serif text-sm text-emerald-300 font-bold italic">
                {epagomenalInfo.deity} — {epagomenalInfo.domain}
              </p>
              <p className="font-serif text-sm text-parchment/85 italic mt-3 leading-relaxed">
                "{epagomenalInfo.description}"
              </p>
            </div>
          )}

          {/* View toggle (regular months only) */}
          {!egyptianDate.isEpagomenal && (
            <div
              className="flex gap-0 rounded overflow-hidden border w-full max-w-xs mx-auto"
              style={{ borderColor: 'rgba(24,64,160,0.45)' }}
            >
              {(['calendar', 'rites'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setView(v); }}
                  className={`flex-1 py-2 text-xs font-serif uppercase tracking-widest font-bold transition-all
                    ${view === v
                      ? 'text-parchment border-r'
                      : 'text-parchment/40 hover:text-parchment/70'}`}
                  style={view === v
                    ? { background: 'rgba(24,64,160,0.25)', borderColor: 'rgba(24,64,160,0.45)' }
                    : {}}
                >
                  {v === 'calendar' ? '☽ Calendario' : '𓊹 Ritos del Día'}
                </button>
              ))}
            </div>
          )}

          {/* ═══ CALENDAR VIEW ═══ */}
          {(view === 'calendar' || egyptianDate.isEpagomenal) && !egyptianDate.isEpagomenal && (
            <div className="flex flex-col gap-5">

              {/* Decade grid */}
              <div onClick={(e) => e.stopPropagation()}>
                <SectionHeader>Las Tres Décadas del Mes</SectionHeader>
                <div className="mt-3">
                  <DecadeGrid egyptianDate={egyptianDate} onShowFestivals={() => setShowFestivals(true)} />
                </div>
              </div>

              {/* Nilometer */}
              <div className="border-t pt-4" style={{ borderColor: 'rgba(24,64,160,0.25)' }}>
                <Nilometer monthIndex={egyptianDate.monthIndex} seasonName={egyptianDate.seasonName} />
              </div>

              {/* Sopdet */}
              {sopdet && (() => {
                const dateStr = sopdet.rising.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
                const fmtTime = (d: Date | null) =>
                  d ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) : '—';

                const SopdetExpandedPanel = () => {
                  if (!sopdetExpanded || !sopdetDaily) return null;
                  const { riseTime, transitTime, setTime, elongation, altitudeAtMidnight } = sopdetDaily;
                  return (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="grid grid-cols-3 gap-1 mb-2.5">
                        {([
                          { label: 'Salida', value: fmtTime(riseTime) },
                          { label: 'Cenit', value: fmtTime(transitTime) },
                          { label: 'Ocaso', value: fmtTime(setTime) },
                        ] as const).map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <p className="text-[9px] uppercase tracking-widest text-parchment/45 font-serif">{label}</p>
                            <p className="text-[11px] font-mono font-bold text-parchment/80">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] uppercase tracking-widest text-parchment/45 font-serif">Elongación del Sol</span>
                          <span className="text-[11px] font-mono font-bold text-parchment/80">{elongation.toFixed(1)}°</span>
                        </div>
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full transition-all"
                               style={{
                                 width: `${(elongation / 180) * 100}%`,
                                 background: elongation < 17 ? 'rgba(148,163,184,0.45)' : 'rgba(110,200,130,0.65)',
                               }} />
                        </div>
                        <p className="text-[9px] text-parchment/35 font-serif mt-0.5 italic">
                          {elongation < 17 ? 'Sumergida en el resplandor solar (umbral helíaco 17°)' : `${elongation.toFixed(0)}° del Sol · separada del resplandor solar`}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-widest text-parchment/45 font-serif">Altitud a medianoche</span>
                        <span className={`text-[11px] font-mono font-bold ${altitudeAtMidnight >= 0 ? 'text-emerald-400/75' : 'text-parchment/35'}`}>
                          {altitudeAtMidnight >= 0 ? '+' : ''}{altitudeAtMidnight.toFixed(1)}°
                        </span>
                      </div>
                      {altitudeAtMidnight < 0 && (
                        <p className="text-[9px] text-parchment/35 font-serif italic mt-0.5">Bajo el horizonte esta noche</p>
                      )}
                    </div>
                  );
                };

                if (sopdet.phase === 'invisible') {
                  const daysUntil = -sopdet.daysSinceRising;
                  return (
                    <div className="border-t pt-4" style={{ borderColor: 'rgba(24,64,160,0.25)' }}>
                      <button className="w-full text-left flex items-start gap-3 p-3 rounded border cursor-pointer"
                              style={{ background: 'rgba(30,20,60,0.35)', borderColor: 'rgba(80,60,160,0.30)' }}
                              onClick={() => setSopdetExpanded(v => !v)}>
                        <span className="text-lg shrink-0" style={{ color: 'rgba(180,160,240,0.85)' }}>✦</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[11px] font-serif font-bold uppercase tracking-widest text-indigo-300">Sopdet (Sirio) — invisible</p>
                            <span className="text-[10px] text-parchment/35 shrink-0">{sopdetExpanded ? '▴' : '▾'}</span>
                          </div>
                          <p className="text-[11px] font-serif text-parchment/75 italic leading-snug mt-0.5">
                            Oculta en el resplandor solar. <strong className="text-indigo-300">Peret Sopdet</strong> en {daysUntil} día{daysUntil !== 1 ? 's' : ''} ({dateStr}).
                          </p>
                          <SopdetExpandedPanel />
                        </div>
                      </button>
                    </div>
                  );
                }
                const days = sopdet.daysSinceRising;
                if (days === 0) return (
                  <div className="border-t pt-4" style={{ borderColor: 'rgba(24,64,160,0.25)' }}>
                    <button className="w-full text-left flex items-start gap-3 p-3 rounded border-2 animate-pulse cursor-pointer"
                            style={{ background: 'rgba(80,50,10,0.40)', borderColor: 'rgba(212,168,50,0.65)', boxShadow: '0 0 16px rgba(212,168,50,0.2)' }}
                            onClick={() => setSopdetExpanded(v => !v)}>
                      <span className="text-lg shrink-0 text-amber-300">✦</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[11px] font-serif font-bold uppercase tracking-widest text-amber-300">¡Peret Sopdet! — Salida helíaca de Sopdet</p>
                          <span className="text-[10px] text-parchment/35 shrink-0">{sopdetExpanded ? '▴' : '▾'}</span>
                        </div>
                        <p className="text-[11px] font-serif text-parchment/90 italic leading-snug mt-0.5">
                          Hoy Sopdet (Sirio) vuelve a aparecer antes del amanecer. Anuncia la crecida del Nilo y el inicio del Año Nuevo egipcio.
                        </p>
                        <SopdetExpandedPanel />
                      </div>
                    </button>
                  </div>
                );
                return (
                  <div className="border-t pt-4" style={{ borderColor: 'rgba(24,64,160,0.25)' }}>
                    <button className="w-full text-left flex items-start gap-3 p-3 rounded border cursor-pointer"
                            style={{ background: 'rgba(10,40,20,0.35)', borderColor: 'rgba(52,180,100,0.30)' }}
                            onClick={() => setSopdetExpanded(v => !v)}>
                      <span className="text-lg shrink-0 text-emerald-400">✦</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[11px] font-serif font-bold uppercase tracking-widest text-emerald-300">Sopdet (Sirio) — visible</p>
                          <span className="text-[10px] text-parchment/35 shrink-0">{sopdetExpanded ? '▴' : '▾'}</span>
                        </div>
                        <p className="text-[11px] font-serif text-parchment/75 italic leading-snug mt-0.5">
                          Día <strong className="text-emerald-300">{days}</strong> desde <strong className="text-emerald-300">Peret Sopdet</strong> ({dateStr}). La diosa custodia la crecida del Nilo.
                        </p>
                        <SopdetExpandedPanel />
                      </div>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ═══ RITES VIEW ═══ */}
          {view === 'rites' && !egyptianDate.isEpagomenal && (
            <div className="flex flex-col gap-5">

              {/* Hemerology */}
              <div>
                <SectionHeader>Pronóstico del Día · Hemerología</SectionHeader>
                <div className="flex gap-2 mt-3">
                  <PrognosisCard title="Mañana"   prognosis={hemerology.morning} />
                  <PrognosisCard title="Mediodía" prognosis={hemerology.midday} />
                  <PrognosisCard title="Tarde"    prognosis={hemerology.evening} />
                </div>
                {hemerology.instruction && (
                  <div className="mt-3 flex items-center gap-3 p-3 rounded border"
                       style={{ background: 'rgba(80,10,10,0.25)', borderColor: 'rgba(192,57,26,0.35)' }}>
                    <span className="text-lg shrink-0">👁️</span>
                    <p className="text-xs italic text-red-300 font-serif leading-tight text-left">
                      {hemerology.instruction}
                    </p>
                  </div>
                )}

              {/* Ojo de Horus / Algol */}
              <div
                className="mt-2 p-3 rounded border transition-all"
                style={{ background: algol.isEclipsed ? 'rgba(80,10,10,0.30)' : 'rgba(40,10,10,0.20)', borderColor: algol.isEclipsed ? 'rgba(192,57,26,0.50)' : 'rgba(192,57,26,0.25)' }}
              >
                {/* Header row — tap to expand */}
                <button
                  type="button"
                  className="w-full text-left flex items-center gap-3 cursor-pointer"
                  onClick={() => setAlgolExpanded(v => !v)}
                >
                  <span className={`text-lg shrink-0 ${algol.isEclipsed ? 'animate-pulse' : ''}`}>👁️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-serif font-bold text-red-300 uppercase tracking-wider">
                      Ojo de Horus · Algol {algol.isEclipsed ? '— ¡En Eclipse!' : ''}
                    </p>
                    <p className="text-[10px] font-serif text-parchment/55 italic">{algol.stateText}</p>
                  </div>
                  <span className="text-parchment/30 text-sm shrink-0">{algolExpanded ? '▴' : '▾'}</span>
                </button>

                {/* Expanded panel */}
                {algolExpanded && algolDaily && (() => {
                  const { phase, nextMinimumInHours, lastMinimumAgoHours, estimatedMagnitude, isEclipsing, periodDays,
                          riseTime, setTime, transitTime, altitudeAtMidnight } = algolDaily;

                  const fmtTime = (d: Date | null) =>
                    d ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) : '—';
                  const fmtHours = (h: number) => {
                    const hh = Math.floor(h);
                    const mm = Math.round((h - hh) * 60);
                    return `${hh}h ${mm.toString().padStart(2, '0')}m`;
                  };

                  const phaseBarPct = (phase * 100).toFixed(0);
                  const magFraction = (estimatedMagnitude - 2.1) / 1.3; // 0 = bright, 1 = dim

                  return (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(192,57,26,0.18)' }}>
                      {/* Rise / Transit / Set */}
                      <div className="grid grid-cols-3 gap-1 mb-2.5">
                        {([
                          { label: 'Salida', value: fmtTime(riseTime) },
                          { label: 'Cenit', value: fmtTime(transitTime) },
                          { label: 'Ocaso', value: fmtTime(setTime) },
                        ] as const).map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <p className="text-[9px] uppercase tracking-widest text-parchment/45 font-serif">{label}</p>
                            <p className="text-[11px] font-mono font-bold text-parchment/80">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[9px] uppercase tracking-widest text-parchment/45 font-serif">Altitud a medianoche</span>
                        <span className={`text-[11px] font-mono font-bold ${altitudeAtMidnight >= 0 ? 'text-amber-300/75' : 'text-parchment/35'}`}>
                          {altitudeAtMidnight >= 0 ? '+' : ''}{altitudeAtMidnight.toFixed(1)}°
                        </span>
                      </div>
                      {/* Cycle progress */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] uppercase tracking-widest text-parchment/45 font-serif">Fase en ciclo ({periodDays.toFixed(3)}d)</span>
                          <span className="text-[11px] font-mono font-bold text-parchment/80">{phaseBarPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full transition-all"
                               style={{
                                 width: `${phaseBarPct}%`,
                                 background: isEclipsing ? 'rgba(192,57,26,0.75)' : 'rgba(212,168,50,0.55)',
                               }} />
                          {/* Minimum marker at 0% and 100% edges */}
                          <div className="absolute top-0 left-0 w-0.5 h-full bg-red-500/60 rounded" />
                          <div className="absolute top-0 right-0 w-0.5 h-full bg-red-500/60 rounded" />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className="text-[8px] text-red-400/50 font-serif">mínimo</span>
                          <span className="text-[8px] text-red-400/50 font-serif">mínimo</span>
                        </div>
                      </div>

                      {/* Next / last minimum */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="text-center p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <p className="text-[9px] uppercase tracking-widest text-parchment/40 font-serif">Último mínimo</p>
                          <p className="text-[11px] font-mono font-bold text-parchment/70">hace {fmtHours(lastMinimumAgoHours)}</p>
                        </div>
                        <div className="text-center p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <p className="text-[9px] uppercase tracking-widest text-parchment/40 font-serif">Próximo mínimo</p>
                          <p className={`text-[11px] font-mono font-bold ${nextMinimumInHours < 6 ? 'text-red-400/90' : 'text-parchment/70'}`}>en {fmtHours(nextMinimumInHours)}</p>
                        </div>
                      </div>

                      {/* Estimated magnitude bar */}
                      <div className="mb-2.5">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] uppercase tracking-widest text-parchment/45 font-serif">Magnitud estimada</span>
                          <span className={`text-[11px] font-mono font-bold ${isEclipsing ? 'text-red-400/80' : 'text-amber-300/80'}`}>{estimatedMagnitude.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full transition-all"
                               style={{
                                 width: `${magFraction * 100}%`,
                                 background: isEclipsing ? 'rgba(192,57,26,0.70)' : 'rgba(212,168,50,0.40)',
                               }} />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className="text-[8px] text-amber-300/40 font-serif">2.1 brillante</span>
                          <span className="text-[8px] text-red-400/40 font-serif">3.4 opaco</span>
                        </div>
                      </div>

                      {/* Link to modal */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsHorusOpen(true); }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded border text-left cursor-pointer transition-all hover:border-red-500/40"
                        style={{ borderColor: 'rgba(192,57,26,0.25)', background: 'rgba(192,57,26,0.08)' }}
                      >
                        <span className="text-[10px] font-serif text-red-300/80 italic">Ver eclipses y días excepcionales</span>
                        <span className="text-parchment/30 text-sm">›</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
              </div>

              {/* Astronomical alerts */}
              {hasAstroAlerts && (
                <div className="flex flex-col gap-2 border-t pt-4" style={{ borderColor: 'rgba(24,64,160,0.25)' }}>
                  <SectionHeader>Influencias Astronómicas</SectionHeader>
                  <div className="flex flex-col gap-2 mt-2">
                    {moonPhase >= 0.45 && moonPhase <= 0.55 && (
                      <div className="flex items-start gap-3 p-3 rounded border"
                           style={{ background: 'rgba(212,168,50,0.08)', borderColor: 'rgba(212,168,50,0.35)' }}>
                        <span className="text-base shrink-0">🌕</span>
                        <p className="text-[11px] font-serif font-bold text-parchment/85 leading-snug">
                          Ventana de Plenilunio: Día propicio para la entronización del Toro Apis en Menfis.
                        </p>
                      </div>
                    )}
                    {algol.isEclipsed && (
                      <div className="flex items-start gap-3 p-3 rounded border"
                           style={{ background: 'rgba(80,10,10,0.25)', borderColor: 'rgba(192,57,26,0.35)' }}>
                        <span className="text-base shrink-0 animate-pulse">✨</span>
                        <p className="text-[11px] font-serif font-bold text-red-300 leading-snug">
                          ¡Algol (El Ojo de Horus) está en eclipse hoy! Las fuerzas del Caos acechan.
                        </p>
                      </div>
                    )}
                    {isNewMoon && (
                      <div className="flex items-start gap-3 p-3 rounded border"
                           style={{ background: 'rgba(20,10,50,0.30)', borderColor: 'rgba(80,60,160,0.35)' }}>
                        <span className="text-base shrink-0">🌑</span>
                        <p className="text-[11px] font-serif text-parchment/80 leading-snug italic">
                          Noche de Estirar la Cuerda (Pedj-Shes). Seshat guía a los arquitectos alineando los templos con las estrellas imperecederas.
                        </p>
                      </div>
                    )}
                    {isFullMoon && (
                      <div className="flex items-start gap-3 p-3 rounded border"
                           style={{ background: 'rgba(212,168,50,0.05)', borderColor: 'rgba(212,168,50,0.20)' }}>
                        <span className="text-base shrink-0">🌕</span>
                        <p className="text-[11px] font-serif text-parchment/80 leading-snug italic">
                          Plenilunio sagrado. Las fuerzas lunares de Khonsu iluminan el cielo de Kemet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Festivals */}
              {(civilFestivals.length > 0 || lunarFestivals.length > 0) && (
                <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: 'rgba(24,64,160,0.25)' }}>
                  <SectionHeader>Festividades del Día</SectionHeader>
                  <div className="flex flex-col gap-3 mt-1">
                    {civilFestivals.map((f, i) => (
                      <div key={`civil-${i}`} className="p-4 rounded border-2 text-left"
                           style={{ background: 'rgba(24,64,160,0.10)', borderColor: 'rgba(24,64,160,0.35)' }}>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex justify-between"
                             style={{ color: 'rgba(212,168,50,0.70)' }}>
                          <span>𓊹 Festival Civil 𓊹</span>
                          <span className="text-parchment/30">Fijo</span>
                        </div>
                        <div className="text-parchment font-serif font-bold text-base mb-1 flex items-center gap-2">
                          <FestivalIcon name={f.icon} className="text-emerald-400 shrink-0" />
                          <span>{f.name}</span>
                        </div>
                        <p className="font-serif text-xs text-parchment/75 italic leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                    {lunarFestivals.map((f, i) => (
                      <div key={`lunar-${i}`} className="p-4 rounded border-2 text-left"
                           style={{ background: 'rgba(212,168,50,0.06)', borderColor: 'rgba(212,168,50,0.30)' }}>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex justify-between"
                             style={{ color: 'rgba(212,168,50,0.70)' }}>
                          <span>𓊹 Festival Lunar 𓊹</span>
                          <span className="text-parchment/30">Día {lunarDay}</span>
                        </div>
                        <div className="text-parchment font-serif font-bold text-base mb-1 flex items-center gap-2">
                          <FestivalIcon name={f.icon} className="text-amber-400 shrink-0" />
                          <span>{f.name}</span>
                        </div>
                        <p className="font-serif text-xs text-parchment/75 italic leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Deity card (always shown) ──────────────────────────────── */}
          <div
            className="flex flex-col items-center gap-2 p-5 rounded border-2 text-center mt-1"
            style={{ background: 'rgba(212,168,50,0.05)', borderColor: 'rgba(212,168,50,0.22)' }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,168,50,0.65)' }}>
              {egyptianDate.isEpagomenal ? '— Madre Celeste —' : labels.godOfDayTitle}
            </div>
            <div className="text-3xl" style={{ color: 'rgba(212,168,50,0.90)' }}>𓊹</div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment leading-tight">
              {deity.name}
            </h2>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {deity.title}
            </div>
            <p className="font-serif text-sm text-parchment/85 italic px-4 mt-1 leading-relaxed">
              "{deity.description}"
            </p>
          </div>

        </div>

        <LotusFreizeBorder id="lotus-btm" />
      </div>
    </div>

    {/* ── Next Festivals Modal ──────────────────────────────────────────── */}
    {showFestivals && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn cursor-pointer"
        style={{ background: 'rgba(12,8,4,0.85)' }}
        onClick={() => setShowFestivals(false)}
      >
        <div
          className="w-full max-w-lg rounded-sm shadow-2xl overflow-hidden relative cursor-default"
          style={{ background: '#0c0804', border: '4px solid rgba(24,64,160,0.55)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b text-center" style={{ borderColor: 'rgba(24,64,160,0.30)', background: 'rgba(24,64,160,0.10)' }}>
            <div className="text-3xl mb-2" style={{ color: 'rgba(212,168,50,0.85)' }}>𓊹</div>
            <h2 className="text-2xl font-serif font-black text-parchment uppercase tracking-widest">
              Próximos Festivales
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mt-1" style={{ color: 'rgba(212,168,50,0.55)' }}>
              Calendario Sagrado de Kemet
            </p>
          </div>

          {/* List */}
          <div className="p-6 flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
            {getNextEgyptianFestivals(egyptianDate.monthIndex, egyptianDate.dayOfMonth, 3).map((f, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-serif text-lg font-bold text-parchment flex items-center gap-2">
                      <FestivalIcon name={f.icon} className="text-emerald-400 shrink-0" />
                      <span>{f.name}</span>
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,168,50,0.55)' }}>
                      {f.date}
                    </span>
                  </div>
                  <div className="p-2 rounded text-right" style={{ background: 'rgba(24,64,160,0.15)', border: '1px solid rgba(24,64,160,0.35)' }}>
                    <div className="text-base font-black text-emerald-300 leading-none">{f.daysRemaining}</div>
                    <div className="text-[7px] uppercase font-bold tracking-tighter text-parchment/40">días</div>
                  </div>
                </div>
                <p className="font-serif text-sm text-parchment/75 leading-relaxed italic border-l-2 pl-4 py-1"
                   style={{ borderColor: 'rgba(24,64,160,0.35)' }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <button
            className="w-full p-4 border-t font-serif text-xs uppercase tracking-widest font-bold text-parchment/60 hover:text-parchment/90 transition-all"
            style={{ borderColor: 'rgba(24,64,160,0.30)', background: 'rgba(24,64,160,0.08)' }}
            onClick={() => setShowFestivals(false)}
          >
            Cerrar Rollo Sagrado
          </button>

          <div className="absolute top-2 left-2 text-xl" style={{ color: 'rgba(24,64,160,0.25)' }}>𓋹</div>
          <div className="absolute top-2 right-2 text-xl" style={{ color: 'rgba(24,64,160,0.25)' }}>𓋹</div>
          <div className="absolute bottom-16 left-2 text-xl" style={{ color: 'rgba(24,64,160,0.25)' }}>𓋹</div>
          <div className="absolute bottom-16 right-2 text-xl" style={{ color: 'rgba(24,64,160,0.25)' }}>𓋹</div>
        </div>
      </div>
    )}
    <HorusEclipseModal
      isOpen={isHorusOpen}
      onClose={() => setIsHorusOpen(false)}
      currentDate={currentDate}
    />
    </>
  );
};

export default EgyptianCalendarInfo;

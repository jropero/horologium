import React, { useState, useEffect, useMemo } from 'react';
import { useCivilization } from '../contexts/CivilizationContext';
import { getBabylonianDate, getBabylonianCalendarMeta, BabylonianCalendarMeta } from '../utils/babylonianCalendarUtils';
import { getBabylonianLore, BabylonianDayEvent } from '../utils/babylonianLoreData';
import { generateBabylonianSkyline } from '../utils/babylonianSkylineGenerator';
import { BabylonianDate } from '../types/babylonia';
import { WeatherData } from '../types';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';

interface BabylonianCalendarInfoProps {
  currentDate?: Date;
  weather?: WeatherData | null;
  currentLat?: number;
  currentLng?: number;
}

// ─── Continuous moon-phase SVG ────────────────────────────────────────────────

const TinyMoon: React.FC<{ phase: number; size?: number; dim?: boolean }> = ({
  phase, size = 16, dim = false,
}) => {
  const r = (size - 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const topY = cy - r;
  const botY = cy + r;

  const isWaxing = phase <= 0.5;
  const norm = isWaxing ? phase * 2 : (1 - phase) * 2;

  const alpha = dim ? 0.35 : 0.9;
  const bgAlpha = dim ? 0.06 : 0.14;
  const litColor = `rgba(147,197,253,${alpha})`;   // blue-300
  const darkColor = `rgba(23,37,84,${bgAlpha})`;   // blue-950

  if (norm < 0.03) return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />
    </svg>
  );
  if (norm > 0.97) return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill={litColor} />
    </svg>
  );

  const termRx = r * (1 - norm * 2);
  const absTerm = Math.abs(termRx) || 0.01;
  const outerSweep = isWaxing ? 1 : 0;
  const innerSweep = isWaxing
    ? (termRx > 0 ? 0 : 1)
    : (termRx > 0 ? 1 : 0);

  const d = `M ${cx} ${topY} A ${r} ${r} 0 0 ${outerSweep} ${cx} ${botY} A ${absTerm} ${r} 0 0 ${innerSweep} ${cx} ${topY} Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />
      <path d={d} fill={litColor} />
    </svg>
  );
};

// ─── Special days ─────────────────────────────────────────────────────────────

interface SpecialDay {
  label: string;
  akkadian: string;
  dot: 'sapatu' | 'rest' | 'quarter' | 'new';
}

const SPECIAL_DAYS: Record<number, SpecialDay> = {
  1:  { label: 'Ittu ša Sîn',    akkadian: 'Luna nueva',                              dot: 'new'     },
  7:  { label: 'Māšaltu erbē',   akkadian: 'Séptimo día',                             dot: 'quarter' },
  14: { label: 'Ūm nūḥi',        akkadian: 'Día previo al Šapattu',                   dot: 'rest'    },
  15: { label: 'Šapattu',        akkadian: 'Día de reposo del corazón de los dioses',  dot: 'sapatu'  },
  19: { label: 'Ūm nūḥi libbi',  akkadian: 'Día de apaciguamiento de Ea',             dot: 'rest'    },
  21: { label: 'Māšaltu ešra',   akkadian: 'Vigésimoprimero',                          dot: 'quarter' },
  28: { label: 'Ūm nūḥi libbi',  akkadian: 'Día de apaciguamiento',                   dot: 'rest'    },
};

const DOT_COLORS: Record<SpecialDay['dot'], string> = {
  sapatu:  'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]',
  rest:    'bg-indigo-500',
  quarter: 'bg-sky-300',
  new:     'bg-indigo-500',
};

const SPECIAL_DAY_ICON: Record<SpecialDay['dot'], string> = {
  new:     '🌑',
  quarter: '☽',
  sapatu:  '🌕',
  rest:    '🌙',
};

const SPECIAL_DAY_THEME: Record<SpecialDay['dot'], { text: string; border: string; bg: string; glow: string }> = {
  new:     { text: 'text-indigo-400', border: 'border-indigo-500/40', bg: 'bg-indigo-900/15', glow: '' },
  quarter: { text: 'text-sky-400',    border: 'border-sky-500/35',    bg: 'bg-sky-900/15',    glow: '' },
  sapatu:  { text: 'text-amber-400',  border: 'border-amber-500/50',  bg: 'bg-amber-900/15',  glow: 'shadow-[0_0_30px_rgba(251,191,36,0.08)]' },
  rest:    { text: 'text-blue-400',   border: 'border-blue-600/35',   bg: 'bg-blue-900/10',   glow: '' },
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  akitu:      'text-sky-400',
  procession: 'text-violet-400',
  mourning:   'text-slate-400',
  marriage:   'text-pink-400',
  ritual:     'text-blue-300',
  festival:   'text-emerald-400',
  astronomy:  'text-cyan-400',
};

// ─── Day status card (Babylonian "Nonae" equivalent) ─────────────────────────

const DayStatusCard: React.FC<{
  day: number;
  lore: ReturnType<typeof getBabylonianLore>;
}> = ({ day, lore }) => {
  const special = SPECIAL_DAYS[day] ?? null;
  const event   = lore?.dayEvents?.[day] ?? null;
  const theme   = special
    ? SPECIAL_DAY_THEME[special.dot]
    : { text: 'text-blue-400', border: 'border-blue-700/30', bg: 'bg-blue-900/10', glow: '' };

  return (
    <div className={`w-full border ${theme.border} ${theme.bg} ${theme.glow} rounded-sm shadow-lg text-center flex flex-col items-center gap-4 p-5 relative overflow-hidden`}>

      {special?.dot === 'sapatu' && (
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Special day name — equivalent to Roman "Nonae" / "Idus" header */}
      {special ? (
        <div className={`border-b border-blue-600/40 pb-2 w-full flex items-center justify-center gap-3`}>
          <span className="text-2xl filter drop-shadow-md">{SPECIAL_DAY_ICON[special.dot]}</span>
          <h3 className={`font-serif text-lg uppercase tracking-[0.2em] font-bold ${theme.text}`}>
            {special.label}
          </h3>
        </div>
      ) : (
        <div className="border-b border-blue-600/30 pb-2 w-full flex items-center justify-center gap-3">
          <span className="text-xl opacity-50">𒀭</span>
          <h3 className="font-serif text-sm uppercase tracking-[0.25em] text-blue-500">
            Día {day} del mes
          </h3>
        </div>
      )}

      {/* Deity of the day — equivalent to Roman "Deus Hodiernus" */}
      {lore && (
        <div className="flex flex-col items-center gap-2 w-full bg-blue-950/30 p-5 rounded border border-blue-800/25 shadow-inner">
          <div className="text-blue-300 text-[10px] uppercase tracking-[0.3em] mb-1 flex items-center gap-3">
            <span className="opacity-40">—</span>
            Dios Hodiernus
            <span className="opacity-40">—</span>
          </div>
          <span className="text-3xl mb-1">{lore.icon}</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-parchment drop-shadow-md uppercase tracking-wider">
            {lore.deity}
          </h2>
          {special && (
            <p className="font-serif text-sm text-parchment/80 italic px-4 mt-2 leading-relaxed">
              "{special.akkadian}"
            </p>
          )}
        </div>
      )}

      {/* Day event — equivalent to Roman "Festum" */}
      {event && (
        <div className="mt-1 w-full animate-fadeIn">
          <div className={`text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-2 ${EVENT_TYPE_COLORS[event.type] ?? theme.text}`}>
            <span>✧</span> {event.shortLabel} <span>✧</span>
          </div>
          <p className="font-serif text-sm text-parchment/85 leading-relaxed px-2">
            {event.description}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Day grid (three-panel decade layout) ────────────────────────────────────

const PanelMoonSvg: React.FC<{ type: 'waxing' | 'full' | 'waning'; active: boolean }> = ({ type, active }) => {
  const cls = `w-5 h-5 mx-auto mb-1 transition-all ${active ? 'text-blue-300 drop-shadow-[0_0_6px_rgba(147,197,253,0.6)]' : 'text-blue-500/50'}`;
  if (type === 'waxing') return (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
      <path d="M12 2 A 10 10 0 0 1 12 22 A 8 10 0 0 0 12 2 Z" />
    </svg>
  );
  if (type === 'full') return (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
      <path d="M12 2 A 10 10 0 0 0 12 22 A 8 10 0 0 1 12 2 Z" />
    </svg>
  );
};

const DayGrid: React.FC<{
  today: number;
  monthLen: number;
  dayEvents?: Record<number, BabylonianDayEvent>;
}> = ({ today, monthLen, dayEvents }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleTap = (day: number) => {
    setSelectedDay(prev => prev === day ? null : day);
  };

  const panels: Array<{ days: number[]; moonType: 'waxing' | 'full' | 'waning'; title: string; subtitle: string }> = [
    { days: Array.from({ length: 10 }, (_, i) => i + 1),            moonType: 'waxing', title: 'Arḫu elû',   subtitle: 'Luna creciente' },
    { days: Array.from({ length: 10 }, (_, i) => i + 11),           moonType: 'full',   title: 'Arḫu šulum',  subtitle: 'Luna llena'     },
    { days: Array.from({ length: monthLen - 20 }, (_, i) => i + 21), moonType: 'waning', title: 'Arḫu erbu',  subtitle: 'Luna menguante' },
  ];

  let activePanel = 0;
  if (today >= 21) activePanel = 2;
  else if (today >= 11) activePanel = 1;

  const selSpecial = selectedDay !== null ? SPECIAL_DAYS[selectedDay] : null;
  const selEvent   = selectedDay !== null && dayEvents ? dayEvents[selectedDay] : null;
  const hasInfo    = selSpecial !== null || selEvent !== null;

  return (
    <div>
      <div className="flex flex-row justify-center gap-1.5 sm:gap-2 w-full">
        {panels.map(({ days, moonType, title, subtitle }) => {
          let panelIdx = 0;
          if (moonType === 'full') panelIdx = 1;
          else if (moonType === 'waning') panelIdx = 2;
          const active = panelIdx === activePanel;
          return (
            <div
              key={moonType}
              className={`p-2 sm:p-3 flex-1 rounded-lg border transition-all duration-500 relative overflow-hidden
                ${active
                  ? 'border-blue-400/50 bg-blue-900/10 shadow-[0_0_15px_rgba(96,165,250,0.1)] scale-[1.02] z-10'
                  : 'border-blue-800/30 bg-ink/30'
                }`}
            >
              {active && (
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="text-center mb-2 relative z-10 border-b border-blue-700/30 pb-2">
                <PanelMoonSvg type={moonType} active={active} />
                <h4 className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${active ? 'text-blue-300' : 'text-blue-500'}`}>{title}</h4>
                <div className="text-[8px] font-serif italic text-blue-400/60 tracking-wide uppercase mt-0.5">{subtitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-1 justify-items-center relative z-10">
                {days.map(day => {
                  const isToday     = day === today;
                  const isPast      = day < today;
                  const isSelected  = day === selectedDay;
                  const special     = SPECIAL_DAYS[day];
                  const hasFestival = dayEvents?.[day] !== undefined;

                  let cellClass = 'bg-ink/40 active:bg-blue-900/30';
                  if (isSelected)                      cellClass = 'bg-blue-400/20 ring-2 ring-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]';
                  else if (isToday)                    cellClass = 'bg-blue-400/15 ring-1 ring-blue-400/70';
                  else if (special?.dot === 'sapatu')  cellClass = 'bg-amber-500/20 ring-1 ring-amber-400/60';
                  else if (special?.dot === 'quarter') cellClass = 'bg-sky-900/30 ring-1 ring-sky-400/40';
                  else if (special?.dot === 'rest')    cellClass = 'bg-indigo-900/30 ring-1 ring-indigo-400/40';
                  else if (hasFestival)                cellClass = 'bg-emerald-900/25 ring-1 ring-emerald-500/40';

                  let numClass = 'text-blue-300';
                  if (isSelected) numClass = 'text-white';
                  else if (isToday) numClass = 'text-blue-200';
                  else if (isPast)  numClass = 'text-blue-400/50';

                  const phase = (day - 1) / monthLen;

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`relative flex flex-col items-center justify-center rounded-sm pt-1 pb-2 w-full gap-0 transition-all cursor-pointer select-none ${cellClass}`}
                      onClick={() => handleTap(day)}
                    >
                      <TinyMoon phase={phase} size={11} dim={isPast && !isToday} />
                      <span className={`text-[10px] font-serif leading-none font-bold ${numClass}`}>{day}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info panel */}
      <div className={`mt-3 rounded-lg border transition-all ${
        hasInfo && selectedDay !== null
          ? 'border-blue-500/40 bg-blue-900/20 p-3'
          : 'border-blue-800/30 bg-transparent py-2 px-3'
      }`}>
        {hasInfo && selectedDay !== null ? (
          <div className="flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-blue-400 uppercase tracking-wider">Día {selectedDay}</span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-blue-500 hover:text-blue-300 text-xs leading-none px-1"
                aria-label="Cerrar"
              >✕</button>
            </div>
            {selSpecial && (
              <div>
                <span className="text-xs font-serif font-bold text-blue-300">{selSpecial.label}</span>
                <p className="text-xs font-serif text-blue-100/90 mt-0.5 leading-snug">{selSpecial.akkadian}</p>
              </div>
            )}
            {selEvent && (
              <div className={selSpecial ? 'border-t border-blue-700/40 pt-2' : ''}>
                <span className={`text-xs font-serif font-bold ${EVENT_TYPE_COLORS[selEvent.type] ?? 'text-blue-300'}`}>
                  {selEvent.shortLabel}
                </span>
                <p className="text-xs font-serif text-blue-100/90 mt-0.5 leading-snug">{selEvent.description}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs font-serif text-blue-300 text-center">
            Toca un día para ver su significado
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {([
          { cls: 'bg-sky-900/50 ring-1 ring-sky-400/50',     label: 'Cuartos lunares' },
          { cls: 'bg-amber-500/25 ring-1 ring-amber-400/70', label: 'Šapattu' },
          { cls: 'bg-indigo-900/40 ring-1 ring-indigo-400/50', label: 'Ūm nūḥi' },
          { cls: 'bg-emerald-900/35 ring-1 ring-emerald-500/50', label: 'Festival' },
        ]).map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-sm inline-block ${cls}`} />
            <span className="text-xs text-blue-400 font-serif uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Lunisolar drift bar ──────────────────────────────────────────────────────

const LuniSolarBar: React.FC<{ meta: BabylonianCalendarMeta }> = ({ meta }) => {
  const { driftDays, springEquinoxDate, nisannu1Date, isIntercalaryYear, nextYearIsIntercalary, seYear } = meta;
  const pct = Math.min(driftDays / 30, 1);

  const fmtDate = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  const barColor = driftDays <= 10 ? 'bg-sky-400' : driftDays <= 20 ? 'bg-blue-400' : 'bg-indigo-400';
  const driftTextColor = driftDays <= 10 ? 'text-sky-400' : driftDays <= 20 ? 'text-blue-400' : 'text-indigo-400';

  return (
    <div className="w-full mt-3">
      <div className="flex items-center justify-between text-xs text-blue-400 font-serif uppercase tracking-wider mb-1">
        <span>Equinoccio vernal</span>
        <span className="text-blue-300 font-bold">Nisannu I</span>
        <span>+30 días</span>
      </div>

      <div className="relative w-full h-3 bg-blue-900/30 rounded-full border border-blue-700/30 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${barColor} opacity-60 rounded-full transition-all`}
          style={{ width: `${pct * 100}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-300 shadow-[0_0_4px_rgba(147,197,253,0.8)]"
          style={{ left: `${pct * 100}%` }}
        />
      </div>

      <div className="flex items-start justify-between mt-1 text-xs font-serif">
        <span className="text-blue-500">{fmtDate(springEquinoxDate)}</span>
        <div className="text-center">
          <span className={`font-bold ${driftTextColor}`}>+{driftDays}d</span>
          <span className="text-blue-400 ml-1">{fmtDate(nisannu1Date)}</span>
        </div>
        <span className="text-blue-400/60">+30d</span>
      </div>

      {isIntercalaryYear && (
        <div className="mt-2 text-xs font-serif text-indigo-400 text-center bg-indigo-900/15 border border-indigo-500/30 rounded px-2 py-1">
          Este año contiene <span className="font-bold">Addaru II</span> — el décimotercero mes intercalar.
        </div>
      )}
      {!isIntercalaryYear && nextYearIsIntercalary && (
        <div className="mt-2 text-xs font-serif text-blue-400 text-center">
          El próximo año (SE {seYear + 1}) requerirá un mes intercalar Addaru II.
        </div>
      )}
    </div>
  );
};

// ─── Metonic 19-year cycle ────────────────────────────────────────────────────

const MetonicCycle: React.FC<{ meta: BabylonianCalendarMeta }> = ({ meta }) => {
  const { metonicPosition, intercalaryPositions, seYear } = meta;
  const cycleStartSE = seYear - metonicPosition + 1;
  const positions = Array.from({ length: 19 }, (_, i) => i + 1);
  const row1 = positions.slice(0, 10);
  const row2 = positions.slice(10);

  const renderCell = (pos: number) => {
    const isIntercalary = intercalaryPositions.includes(pos);
    const isCurrent = pos === metonicPosition;

    let cls = 'bg-blue-900/20 border border-blue-800/30';
    if (isCurrent) cls = 'ring-2 ring-blue-400 bg-blue-400/20 shadow-[0_0_8px_rgba(96,165,250,0.4)] z-10 scale-110';
    else if (isIntercalary) cls = 'bg-indigo-900/30 border border-indigo-500/40';

    let numCls = 'text-blue-300';
    if (isCurrent) numCls = 'text-white';
    else if (isIntercalary) numCls = 'text-indigo-400';

    return (
      <div
        key={pos}
        title={`SE ${cycleStartSE + pos - 1}${isIntercalary ? ' — Addaru II' : ''}`}
        className={`relative flex flex-col items-center justify-center rounded transition-all ${cls}`}
        style={{ width: 28, height: 32 }}
      >
        <span className={`text-xs font-bold leading-none ${numCls}`}>{pos}</span>
        {isIntercalary && <span className="text-[10px] text-indigo-400 leading-none mt-0.5">II</span>}
        {isCurrent && (
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)]" />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="text-center">
        <div className="text-xs text-blue-400 uppercase tracking-widest font-serif font-bold">
          Ciclo de Metón — 19 años · 7 intercalares
        </div>
        <div className="text-xs text-blue-300 font-serif mt-0.5">
          SE {cycleStartSE} — SE {cycleStartSE + 18} · Año {metonicPosition} de 19
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1 justify-center">{row1.map(renderCell)}</div>
        <div className="flex gap-1 justify-center">{row2.map(renderCell)}</div>
      </div>

      <div className="flex gap-4 text-xs font-serif text-center">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-400/20 ring-1 ring-blue-400 inline-block" />
          <span className="text-blue-400">Año actual (SE {seYear})</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-900/30 border border-indigo-500/40 inline-block" />
          <span className="text-blue-400">Año intercalar (Addaru II)</span>
        </div>
      </div>

      <div className="text-xs font-serif text-blue-300 italic text-center leading-relaxed px-2">
        En 19 años solares hay exactamente 235 meses lunares (7 meses extra).<br/>
        Los astrónomos del Esagila descubrieron este ciclo en el siglo V a. C.
      </div>
    </div>
  );
};

// ─── Ishtar Gate palmette frieze border ───────────────────────────────────────
//     Matches the actual decorative bands of the Ishtar Gate (c. 575 BCE):
//     cream palmette fans with amber bases, turquoise S-scroll volutes between
//     them, all on a deep cobalt/lapis ground with amber brick strips top+bottom.

const CuneiformBorder: React.FC<{ id: string }> = ({ id }) => (
  <svg className="w-full h-14 block" viewBox="0 0 200 36" preserveAspectRatio="none">
    <defs>
      {/* === Tile: 50 × 36 units === */}
      <pattern id={id} x="0" y="0" width="50" height="36" patternUnits="userSpaceOnUse">

        {/* Cobalt / lapis lazuli ground */}
        <rect width="50" height="36" fill="#060e22" />

        {/* ── Amber brick strips top & bottom (like the Gate's outer border) ── */}
        <rect x="0" y="0"    width="50" height="4"   fill="rgba(210,150,40,0.88)" />
        <rect x="0" y="32"   width="50" height="4"   fill="rgba(210,150,40,0.88)" />
        {/* Mortar joints — vertical dividers every 12.5 units */}
        {[12.5, 25, 37.5].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="4"   stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" />
        ))}
        {[12.5, 25, 37.5].map(x => (
          <line key={x} x1={x} y1="32" x2={x} y2="36" stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" />
        ))}
        {/* Inner cream highlight line on brick strips */}
        <line x1="0" y1="4"  x2="50" y2="4"  stroke="rgba(238,225,190,0.35)" strokeWidth="0.6" />
        <line x1="0" y1="32" x2="50" y2="32" stroke="rgba(238,225,190,0.35)" strokeWidth="0.6" />

        {/* ── PALMETTE centred at (25, 18), ribs radiate from base (25, 26) ── */}

        {/* Amber base cup */}
        <path d="M17,30 Q25,33.5 33,30 L32,28 Q25,31 18,28 Z" fill="rgba(210,150,40,0.9)" />
        {/* Amber stem */}
        <rect x="23.2" y="24.5" width="3.6" height="3.5" fill="rgba(210,150,40,0.85)" rx="0.5" />

        {/* 7 cream ribs from (25, 24.5) — centre, 2 inner, 2 mid, 2 outer */}
        <line x1="25" y1="24.5" x2="25"   y2="5.5"  stroke="rgba(238,228,200,0.93)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="25" y1="24.5" x2="21.5" y2="6"    stroke="rgba(238,228,200,0.88)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="25" y1="24.5" x2="28.5" y2="6"    stroke="rgba(238,228,200,0.88)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="25" y1="24.5" x2="17"   y2="9"    stroke="rgba(238,228,200,0.82)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="24.5" x2="33"   y2="9"    stroke="rgba(238,228,200,0.82)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="24.5" x2="12"   y2="15"   stroke="rgba(238,228,200,0.7)"  strokeWidth="1.0" strokeLinecap="round" />
        <line x1="25" y1="24.5" x2="38"   y2="15"   stroke="rgba(238,228,200,0.7)"  strokeWidth="1.0" strokeLinecap="round" />

        {/* Arc connecting outer rib tips */}
        <path d="M12,15 A16,20 0 0,1 38,15" fill="none" stroke="rgba(238,228,200,0.45)" strokeWidth="1" />

        {/* Amber node at rib base */}
        <circle cx="25" cy="24.5" r="2.2" fill="rgba(210,150,40,0.97)" />

        {/* Small teal fill inside the palmette fan */}
        <path d="M25,24.5 L12,15 A16,20 0 0,1 38,15 Z"
              fill="rgba(0,160,185,0.14)" stroke="none" />

        {/* ── LEFT teal S-scroll volute, centred at (10, 18) ── */}
        {/* Upper lobe: C-curve opening right, curling clockwise */}
        <path d="M2,18 C2,11 7,9 12,12.5 C15,15 14,18 12,18"
              fill="rgba(0,165,190,0.22)" stroke="rgba(20,190,215,0.88)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Lower lobe: C-curve opening right, curling counter-clockwise */}
        <path d="M2,18 C2,25 7,27 12,23.5 C15,21 14,18 12,18"
              fill="rgba(0,165,190,0.22)" stroke="rgba(20,190,215,0.88)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Outer amber bead (open end of C) */}
        <circle cx="2"  cy="18" r="1.8" fill="rgba(210,150,40,0.95)" />
        {/* Inner cream dot (meeting point of both C-tips) */}
        <circle cx="12" cy="18" r="1.1" fill="rgba(238,228,200,0.8)" />

        {/* ── RIGHT teal S-scroll volute — mirror of left at (40, 18) ── */}
        <path d="M48,18 C48,11 43,9 38,12.5 C35,15 36,18 38,18"
              fill="rgba(0,165,190,0.22)" stroke="rgba(20,190,215,0.88)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M48,18 C48,25 43,27 38,23.5 C35,21 36,18 38,18"
              fill="rgba(0,165,190,0.22)" stroke="rgba(20,190,215,0.88)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="48" cy="18" r="1.8" fill="rgba(210,150,40,0.95)" />
        <circle cx="38" cy="18" r="1.1" fill="rgba(238,228,200,0.8)" />

      </pattern>
    </defs>

    <rect x="0" y="0" width="100%" height="36" fill="#060e22" />
    <rect x="0" y="0" width="100%" height="36" fill={`url(#${id})`} />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────

type ViewMode = 'month' | 'cycle';

const BabylonianCalendarInfo: React.FC<BabylonianCalendarInfoProps> = ({
  currentDate, weather, currentLat = 32.5, currentLng = 44.4,
}) => {
  const { civilization } = useCivilization();
  const [babData, setBabData] = useState<BabylonianDate | null>(null);
  const [meta, setMeta]      = useState<BabylonianCalendarMeta | null>(null);
  const [view, setView]      = useState<ViewMode>('month');

  useEffect(() => {
    const date = currentDate ?? new Date();
    setBabData(getBabylonianDate(date, currentLat, currentLng));
    setMeta(getBabylonianCalendarMeta(date));
  }, [currentDate, currentLat, currentLng]);

  const skylineElements = useMemo(
    () => generateBabylonianSkyline(Math.floor((currentDate ?? new Date()).getTime() / 86400000)),
    [currentDate]
  );

  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 63] ?? 0.45;
  const weatherParticles = useMemo(() => ({
    ...generateWeatherParticles(rainIntensity),
    stars: Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 300, y: Math.random() * 100,
      r: Math.random() * 1.2 + 0.3, opacity: Math.random() * 0.7 + 0.3,
    })),
  }), [rainIntensity]);

  if ((civilization as string) !== 'babylonia' || !babData || !meta) return null;

  const lore = getBabylonianLore(babData.monthName);
  const condition = weather?.current.condition ?? 'clear';

  const skyGradient = (() => {
    const p = babData.dayProgress;
    if (!babData.isDay) {
      if (condition === 'cloudy' || condition === 'fog' || condition === 'rain' || condition === 'storm') {
        return 'linear-gradient(to bottom, #0a0d14 0%, #111827 60%, #1c1008 100%)';
      }
      return 'linear-gradient(to bottom, #050208 0%, #0a0510 40%, #1a0a05 80%, #2a1005 100%)';
    }
    if (p < 0.08) return 'linear-gradient(to bottom, #0f0a02 0%, #4a1a05 30%, #b45309 70%, #fbbf24 100%)';
    if (p < 0.2)  return 'linear-gradient(to bottom, #1a0a05 0%, #7c3b1a 40%, #d97706 80%, #fde68a 100%)';
    if (condition === 'fog') {
      return babData.isDay
        ? 'linear-gradient(to bottom, #9ca3af 0%, #d1d5db 50%, #e5e7eb 100%)'
        : 'linear-gradient(to bottom, #1f2937 0%, #374151 100%)';
    }
    if (condition === 'snow') {
      return babData.isDay
        ? 'linear-gradient(to bottom, #6b7280 0%, #9ca3af 40%, #e5e7eb 100%)'
        : 'linear-gradient(to bottom, #111827 0%, #1f2937 60%, #374151 100%)';
    }
    if (p < 0.75) {
      if (condition === 'cloudy') {
        return 'linear-gradient(to bottom, #374151 0%, #6b7280 30%, #c4a55a 70%, #fde68a 100%)';
      }
      if (condition === 'rain' || condition === 'storm') {
        return 'linear-gradient(to bottom, #1e293b 0%, #334155 40%, #1c2333 80%, #111827 100%)';
      }
      return 'linear-gradient(to bottom, #1e3a6e 0%, #b45309 30%, #d97706 70%, #fde68a 100%)';
    }
    return 'linear-gradient(to bottom, #1a0a05 0%, #7c3b1a 40%, #d97706 80%, #fbbf24 100%)';
  })();

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2">
      <div className="bg-ink/90 border-[4px] border-blue-600/60 p-0 rounded-sm shadow-2xl relative overflow-hidden hover:border-blue-400 transition-colors">

        <CuneiformBorder id="cun-top" />

        <div className="p-5 md:p-8 flex flex-col items-center gap-5 text-center">

          {/* Sky scene */}
          <div className="relative w-full overflow-hidden border border-blue-500/30 rounded-sm" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 transition-all duration-2000" style={{ background: skyGradient }} />

            {/* Stars + weather — full-coverage layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
              {!babData.isDay && (
                <g>
                  {weatherParticles.stars.map((s, i) => (
                    <circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.opacity} />
                  ))}
                </g>
              )}
              <WeatherSvgEffects
                condition={condition}
                weatherParticles={weatherParticles}
                fogGradientId="fog-ground-bab"
                cloudOpacity={0.45}
                stormOpacity={0.65}
              />
              {condition === 'storm' && (
                <rect x="0" y="0" width="300" height="200" fill="#ffffff" opacity="0" className="anim-lightning" />
              )}
            </svg>

            {/* Ziggurat skyline — bottom-anchored, original proportions */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 300 200"
              preserveAspectRatio="xMidYMax meet"
              style={condition === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined}
            >
              {skylineElements.map(el => (
                <path
                  key={el.id}
                  d={el.path}
                  fill="rgba(120,53,15,0.85)"
                  stroke="rgba(180,83,9,0.4)"
                  strokeWidth="0.5"
                  opacity={el.opacity}
                />
              ))}
              {condition === 'snow' && (
                <>
                  {/* White ground strip */}
                  <path d="M 0 182 L 300 182 L 300 200 L 0 200 Z" fill="#dde1e7" />
                  <path d="M 0 182 Q 50 178 100 182 T 200 182 T 300 182 V 200 H 0 Z" fill="#dde1e7" stroke="#f0f4f8" strokeWidth="1" />
                  <path d="M 0 182 Q 50 178 100 182 T 200 180 T 300 182 V 178 Q 250 176 200 178 T 100 179 T 0 178 Z" fill="#f0f4f8" opacity="0.9" />
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center px-4">
              {/* 𒀭 + month name — prominent, inline */}
              <div className="flex flex-col items-center leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-parchment/70"
                    style={{ fontSize: 'clamp(1.4rem, 5.5vw, 2.2rem)' }}
                  >𒀭</span>
                  <span
                    className="font-serif text-parchment font-black uppercase tracking-[0.15em]"
                    style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', lineHeight: 1 }}
                  >
                    {babData.monthName}
                    {babData.isIntercalary && (
                      <span className="ml-2 text-orange-300" style={{ fontSize: '40%' }}>(intercalar)</span>
                    )}
                  </span>
                </div>
                <span
                  className="font-serif text-parchment/60 italic tracking-widest"
                  style={{ fontSize: 'clamp(0.6rem, 2vw, 0.85rem)' }}
                >
                  Warḫum {babData.monthIndex + 1}
                </span>
              </div>
              {/* SE year — smaller, below */}
              <div
                className="font-serif text-parchment/55 font-bold drop-shadow-md mt-1"
                style={{ fontSize: 'clamp(0.75rem, 2.8vw, 1.1rem)', letterSpacing: '0.2em' }}
              >
                SE {babData.seYear}
              </div>
              <div
                className="font-serif text-parchment/75 italic mt-1"
                style={{ fontSize: 'clamp(0.65rem, 2.2vw, 0.9rem)' }}
              >
                {babData.hourName}
              </div>
              <div
                className="font-serif text-parchment/60 tracking-wide"
                style={{ fontSize: 'clamp(0.6rem, 2vw, 0.8rem)' }}
              >
                {babData.planetaryRuler} · {babData.watchName}
              </div>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex gap-0 rounded-lg overflow-hidden border border-blue-600/40 w-full max-w-xs">
            {(['month', 'cycle'] as ViewMode[]).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`flex-1 py-2 text-xs font-serif uppercase tracking-widest font-bold transition-all
                  ${view === v
                    ? 'bg-blue-500/20 text-blue-300 border-r border-blue-600/40'
                    : 'text-blue-500 hover:text-blue-300 hover:bg-blue-900/20'
                  }`}
              >
                {v === 'month' ? '☽ Mes Lunar' : '⟳ Ciclo de Metón'}
              </button>
            ))}
          </div>

          {/* Month view */}
          {view === 'month' && (
            <div className="w-full flex flex-col gap-1">
              <div className="font-serif text-xs uppercase tracking-widest text-blue-400 flex items-center justify-center gap-3 border-y border-blue-700/30 py-2 bg-ink/20 mb-2">
                <span>☾</span>
                Warḫum: {meta.monthLengthDays} días lunares
                <span>☽</span>
              </div>

              <DayGrid
                today={babData.day}
                monthLen={meta.monthLengthDays}
                dayEvents={lore?.dayEvents}
              />

              {/* Day status card — Babylonian "Nonae / Deus Hodiernus" */}
              <DayStatusCard day={babData.day} lore={lore} />

              <div className="border-t border-blue-700/30 pt-3 mt-1">
                <div className="text-xs text-blue-400 uppercase tracking-widest font-serif font-bold mb-1 text-center">
                  Sincronía Lunar–Solar
                </div>
                <LuniSolarBar meta={meta} />
              </div>
            </div>
          )}

          {/* Cycle view */}
          {view === 'cycle' && (
            <div className="w-full flex flex-col gap-1">
              <div className="font-serif text-xs uppercase tracking-widest text-blue-400 flex items-center justify-center gap-3 border-y border-blue-700/30 py-2 bg-ink/20 mb-2">
                <span>𒀭</span>
                Ciclo de 19 años (Ciclo de Metón)
                <span>𒀭</span>
              </div>
              <MetonicCycle meta={meta} />
            </div>
          )}

          {/* Deity & festival */}
          {lore && (
            <div className="w-full bg-blue-900/15 p-5 rounded-lg border-2 border-blue-500/25 shadow-sm">
              <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                Deidad del Mes
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">{lore.icon}</span>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight">
                  {lore.deity}
                </h2>
              </div>
              <p className="font-serif text-sm text-parchment/90 italic px-4 leading-relaxed">
                "{lore.description}"
              </p>
              <div className="mt-4 p-3 bg-blue-800/20 border border-blue-600/25 rounded flex items-start gap-3">
                <span className="text-xl mt-0.5">🏛️</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-serif uppercase tracking-[0.15em] font-bold text-blue-400 mb-0.5">
                    Festival / Ritual Principal
                  </span>
                  <span className="text-sm font-serif text-blue-100/95 leading-snug">
                    {lore.festival}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Planetary ruler / watch / hour */}
          <div className="flex gap-4 w-full justify-center text-center">
            {[
              { title: 'Planeta Rector', main: babData.planetaryRuler, sub: babData.planetaryRulerEn },
              { title: 'Guardia',        main: babData.watchName,      sub: babData.watchDesc },
              { title: 'Hora Temporal',  main: babData.hourName,       sub: null },
            ].map(({ title, main, sub }) => (
              <div key={title} className="flex-1 bg-blue-900/15 border border-blue-500/25 rounded p-3">
                <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">{title}</div>
                <div className="font-serif text-parchment font-bold text-sm leading-tight">{main}</div>
                {sub && <div className="text-xs text-blue-300 mt-0.5">{sub}</div>}
              </div>
            ))}
          </div>

        </div>

        <CuneiformBorder id="cun-btm" />
      </div>
    </div>
  );
};

export default BabylonianCalendarInfo;

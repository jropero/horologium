import React, { useState, useEffect } from 'react';
import { useCivilization } from '../contexts/CivilizationContext';
import { getBabylonianDate, getBabylonianCalendarMeta, BabylonianCalendarMeta } from '../utils/babylonianCalendarUtils';
import { getBabylonianLore, BabylonianDayEvent } from '../utils/babylonianLoreData';
import { BabylonianDate } from '../types/babylonia';

interface BabylonianCalendarInfoProps {
  currentDate?: Date;
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

// ─── Day grid ─────────────────────────────────────────────────────────────────

const DayGrid: React.FC<{
  today: number;
  monthLen: number;
  dayEvents?: Record<number, BabylonianDayEvent>;
}> = ({ today, monthLen, dayEvents }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const days = Array.from({ length: monthLen }, (_, i) => i + 1);

  const handleTap = (day: number) => {
    setSelectedDay(prev => prev === day ? null : day);
  };

  const selSpecial = selectedDay !== null ? SPECIAL_DAYS[selectedDay] : null;
  const selEvent   = selectedDay !== null && dayEvents ? dayEvents[selectedDay] : null;
  const hasInfo    = selSpecial !== null || selEvent !== null;

  return (
    <div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {days.map(day => {
          const phase      = (day - 1) / monthLen;
          const isToday    = day === today;
          const isPast     = day < today;
          const isSelected = day === selectedDay;
          const special    = SPECIAL_DAYS[day];
          const hasFestival = dayEvents?.[day] !== undefined;

          let cellClass = 'bg-ink/30 active:bg-blue-900/30';
          if (isSelected) cellClass = 'bg-blue-400/20 ring-2 ring-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.4)]';
          else if (isToday) cellClass = 'bg-blue-400/15 ring-1 ring-blue-400/70';
          else if (special?.dot === 'sapatu') cellClass = 'bg-amber-900/20 ring-1 ring-amber-500/40';

          let numClass = 'text-blue-300';
          if (isSelected) numClass = 'text-white';
          else if (isToday) numClass = 'text-blue-200';
          else if (isPast) numClass = 'text-blue-400/60';

          return (
            <button
              key={day}
              type="button"
              className={`relative flex flex-col items-center justify-center rounded-sm py-2 gap-1 transition-all cursor-pointer select-none ${cellClass}`}
              onClick={() => handleTap(day)}
            >
              {hasFestival && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
              )}
              <TinyMoon phase={phase} size={16} dim={isPast && !isToday} />
              <span className={`text-xs font-serif leading-none font-bold ${numClass}`}>{day}</span>
              {special && (
                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${DOT_COLORS[special.dot]}`} />
              )}
            </button>
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
          { dot: 'new'     as const, label: 'Luna nueva' },
          { dot: 'quarter' as const, label: 'Cuartos lunares' },
          { dot: 'sapatu'  as const, label: 'Šapattu' },
          { dot: 'rest'    as const, label: 'Ūm nūḥi' },
        ] as const).map(({ dot, label }) => (
          <div key={dot} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full inline-block ${DOT_COLORS[dot]}`} />
            <span className="text-xs text-blue-400 font-serif uppercase tracking-wide">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block bg-emerald-400" />
          <span className="text-xs text-blue-400 font-serif uppercase tracking-wide">Festival histórico</span>
        </div>
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

const BabylonianCalendarInfo: React.FC<BabylonianCalendarInfoProps> = ({ currentDate }) => {
  const { civilization } = useCivilization();
  const [babData, setBabData] = useState<BabylonianDate | null>(null);
  const [meta, setMeta]      = useState<BabylonianCalendarMeta | null>(null);
  const [view, setView]      = useState<ViewMode>('month');

  useEffect(() => {
    const date = currentDate ?? new Date();
    setBabData(getBabylonianDate(date, 32.5, 44.4));
    setMeta(getBabylonianCalendarMeta(date));
  }, [currentDate]);

  if ((civilization as string) !== 'babylonia' || !babData || !meta) return null;

  const lore = getBabylonianLore(babData.monthName);
  const moonPhasePercent = Math.round(babData.moonPhase * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2">
      <div className="bg-ink/90 border-[4px] border-blue-600/60 p-0 rounded-sm shadow-2xl relative overflow-hidden hover:border-blue-400 transition-colors">

        <CuneiformBorder id="cun-top" />

        <div className="p-5 md:p-8 flex flex-col items-center gap-5 text-center">

          {/* Month header */}
          <div className="border-b border-blue-600/40 pb-4 w-full flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-blue-300 drop-shadow-[0_0_6px_rgba(147,197,253,0.5)]">𒀭</span>
              <h3 className="font-serif text-xl md:text-2xl uppercase tracking-[0.2em] font-bold text-blue-300">
                {babData.monthName}
              </h3>
            </div>
            <div className="text-sm italic text-parchment font-body bg-blue-500/10 px-4 py-1 rounded-full border border-blue-500/25">
              Warḫum {babData.monthIndex + 1}
              {babData.isIntercalary && (
                <span className="ml-2 text-indigo-400 text-xs font-bold">(Intercalar)</span>
              )}
            </div>
          </div>

          {/* SE year + day */}
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-parchment drop-shadow-sm leading-tight">
              SE {babData.seYear}
            </h2>
            <div className="font-serif text-base text-blue-300 font-bold italic mt-1">
              Día {babData.day} · Era Seléucida
            </div>
            <div className="text-xs text-blue-400 font-serif mt-1">
              Signo zodiacal: <span className="text-blue-200 font-bold">{babData.zodiacSign}</span>
              {' · '}
              <span className="text-blue-200 font-bold">{babData.moonPhaseName}</span>
              {' ('}{moonPhasePercent}%{')'}
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

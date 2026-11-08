import React, { useState, useEffect, useMemo } from 'react';
import { useCivilization } from '../contexts/CivilizationContext';
import {
  getBabylonianDate,
  getBabylonianCalendarMeta,
  BabylonianCalendarMeta,
} from '../utils/babylonianCalendarUtils';
import {
  getBabylonianLore,
  BabylonianDayEvent,
  BabylonianFonte,
  getNextBabylonianFestivals,
} from '../utils/babylonianLoreData';
import { generateBabylonianSkyline } from '../utils/babylonianSkylineGenerator';
import { BabylonianDate } from '../types/babylonia';
import { WeatherData } from '../types';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';
import { getMoonPosition } from '../utils/solar';
import './BabylonianCalendarInfo.css';

interface BabylonianCalendarInfoProps {
  currentDate?: Date;
  weather?: WeatherData | null;
  currentLat?: number;
  currentLng?: number;
}

// ─── Continuous moon-phase SVG ────────────────────────────────────────────────

const TinyMoon: React.FC<{ phase: number; size?: number; dim?: boolean }> = ({
  phase,
  size = 16,
  dim = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
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
  const litColor = `rgba(147,197,253,${alpha})`; // blue-300
  const darkColor = `rgba(23,37,84,${bgAlpha})`; // blue-950

  if (norm < 0.03)
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={darkColor} />
      </svg>
    );
  if (norm > 0.97)
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={litColor} />
      </svg>
    );

  const termRx = r * (1 - norm * 2);
  const absTerm = Math.abs(termRx) || 0.01;
  const outerSweep = isWaxing ? 1 : 0;
  // eslint-disable-next-line sonarjs/no-nested-conditional
  const innerSweep = isWaxing ? (termRx > 0 ? 0 : 1) : termRx > 0 ? 1 : 0;

  const d = `M ${cx} ${topY} A ${r} ${r} 0 0 ${outerSweep} ${cx} ${botY} A ${absTerm} ${r} 0 0 ${innerSweep} ${cx} ${topY} Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />
      <path d={d} fill={litColor} />
    </svg>
  );
};

// ─── Primary text quote (collapsible) ────────────────────────────────────────
const BabylonianFontePanel: React.FC<{ fonte: BabylonianFonte }> = ({ fonte }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bci-fonte-panel">
      <button onClick={() => setOpen(o => !o)} className="bci-fonte-toggle">
        <span className="bci-fonte-title">𒀭 {fonte.title}</span>
        <span className="bci-fonte-chevron">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="bci-fonte-body">
          <p className="bci-fonte-excerpt">{fonte.excerpt}</p>
          <p className="bci-fonte-source">{fonte.source}</p>
        </div>
      )}
    </div>
  );
};

// ─── Special days ─────────────────────────────────────────────────────────────

interface SpecialDay {
  label: string; // Akkadian name
  es: string; // Spanish gloss
  dot: 'sapatu' | 'rest' | 'quarter' | 'new';
}

// Day 7: sebūtu, "seventh day (of the month)" (from the ordinal sebû).
// Day 21: ūmu lemnu (UD.ḪUL.GÁL), "evil day", the hemerologies' label for it
// (Livingstone, Hemerologies of Assyrian and Babylonian Scholars, CUSAS 25, 2013).
const SPECIAL_DAYS: Record<number, SpecialDay> = {
  1: { label: 'Ittu ša Sîn', es: 'Luna nueva', dot: 'new' },
  7: { label: 'Sebūtu', es: 'Séptimo día', dot: 'quarter' },
  14: { label: 'Ūm nūḥi', es: 'Día previo al Šapattu', dot: 'rest' },
  15: { label: 'Šapattu', es: 'Día de reposo del corazón de los dioses', dot: 'sapatu' },
  19: { label: 'Ūm nūḥi libbi', es: 'Día de apaciguamiento de Ea', dot: 'rest' },
  21: { label: 'Ūmu lemnu', es: 'Día funesto', dot: 'quarter' },
  28: { label: 'Ūm nūḥi libbi', es: 'Día de apaciguamiento', dot: 'rest' },
};

const SPECIAL_DAY_ICON: Record<SpecialDay['dot'], string> = {
  new: '🌑',
  quarter: '☽',
  sapatu: '🌕',
  rest: '🌙',
};

const SPECIAL_DAY_THEME: Record<
  SpecialDay['dot'],
  { text: string; border: string; bg: string; glow: string }
> = {
  new: {
    text: 'bci-color-indigo',
    border: 'bci-border-indigo',
    bg: 'bci-bg-indigo',
    glow: '',
  },
  quarter: {
    text: 'bci-color-sky',
    border: 'bci-border-sky',
    bg: 'bci-bg-sky',
    glow: '',
  },
  sapatu: {
    text: 'bci-color-amber',
    border: 'bci-border-amber',
    bg: 'bci-bg-amber',
    glow: 'bci-glow-amber',
  },
  rest: {
    text: 'bci-color-blue',
    border: 'bci-border-rest',
    bg: 'bci-bg-rest',
    glow: '',
  },
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  akitu: 'bci-color-sky',
  procession: 'bci-color-violet',
  mourning: 'bci-color-slate',
  marriage: 'bci-color-pink',
  ritual: 'bci-color-blue-light',
  festival: 'bci-color-emerald',
  astronomy: 'bci-color-cyan',
};

// ─── Day status card (Babylonian "Nonae" equivalent) ─────────────────────────

const DayStatusCard: React.FC<{
  day: number;
  lore: ReturnType<typeof getBabylonianLore>;
}> = ({ day, lore }) => {
  const special = SPECIAL_DAYS[day] ?? null;
  const event = lore?.dayEvents?.[day] ?? null;
  const theme = special
    ? SPECIAL_DAY_THEME[special.dot]
    : { text: 'bci-color-blue', border: 'bci-border-default', bg: 'bci-bg-default', glow: '' };

  // Plain day with no special designation and no event — just a text label
  if (!special && !event) {
    return <p className="bci-day-plain">Día {day} del mes</p>;
  }

  return (
    <div className={`bci-day-card ${theme.border} ${theme.bg} ${theme.glow}`}>
      {special?.dot === 'sapatu' && <div className="bci-sapatu-glow-overlay" />}

      {special && (
        <div className="bci-day-special-header">
          <span className="bci-day-special-icon">{SPECIAL_DAY_ICON[special.dot]}</span>
          <div className="bci-day-special-info">
            <h3 className={`bci-day-special-title ${theme.text}`}>{special.label}</h3>
            <span className="bci-day-special-es">{special.es}</span>
          </div>
        </div>
      )}

      {/* Day event — equivalent to Roman "Festum" */}
      {event && (
        <div className="bci-day-event animate-fadeIn">
          <div className={`bci-day-event-type ${EVENT_TYPE_COLORS[event.type] ?? theme.text}`}>
            <span>✧</span> {event.shortLabel} <span>✧</span>
          </div>
          <p className="bci-day-event-desc">{event.description}</p>
        </div>
      )}
    </div>
  );
};

// ─── Sky moon renderer (Sin, the moon god) ───────────────────────────────────

const renderSinMoon = (phase: number) => {
  const r = 14;
  const normalizedPhase = ((phase % 1) + 1) % 1;
  const glowFactor = 1 - Math.abs(normalizedPhase - 0.5) * 2;
  const isWaxing = normalizedPhase <= 0.5;
  const sweep1 = isWaxing ? 1 : 0;
  const rx = Math.max(0.1, r * Math.abs(Math.cos(normalizedPhase * Math.PI * 2)));
  const sweep2 =
    // eslint-disable-next-line sonarjs/no-nested-conditional
    normalizedPhase > 0.25 && normalizedPhase <= 0.5 ? 1 : normalizedPhase > 0.75 ? 1 : 0;
  const d = `M 0 -${r} A ${r} ${r} 0 0 ${sweep1} 0 ${r} A ${rx} ${r} 0 0 ${sweep2} 0 -${r} Z`;
  const maskId = `bab-moon-mask-${normalizedPhase.toFixed(3)}`;
  return (
    <g transform="rotate(-15)">
      <defs>
        <clipPath id={maskId}>
          <path d={d} />
        </clipPath>
        <radialGradient id="bab-moon-light" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#c8d8f4" />
          <stop offset="100%" stopColor="#93c5fd" />
        </radialGradient>
        <radialGradient id="bab-moon-dark" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0a1020" />
        </radialGradient>
        <radialGradient id="bab-atmo-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity={glowFactor * 0.7} />
          <stop offset="55%" stopColor="#93c5fd" stopOpacity={glowFactor * 0.3} />
          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bab-corona" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0" />
          <stop offset="39%" stopColor="#bfdbfe" stopOpacity={glowFactor * 0.55} />
          <stop offset="58%" stopColor="#93c5fd" stopOpacity={glowFactor * 0.22} />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>
        <filter id="bab-atmo-blur" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {glowFactor > 0.1 && (
        <circle
          cx="0"
          cy="0"
          r={r + 28}
          fill="url(#bab-atmo-grad)"
          filter="url(#bab-atmo-blur)"
        />
      )}
      <circle cx="0" cy="0" r={r + 22} fill="url(#bab-corona)" />
      <circle cx="0" cy="0" r={r} fill="url(#bab-moon-dark)" />
      <g clipPath={`url(#${maskId})`}>
        <circle cx="0" cy="0" r={r} fill="url(#bab-moon-light)" />
      </g>
      <circle
        cx="0"
        cy="0"
        r={r}
        fill="none"
        stroke="#93c5fd"
        strokeWidth="0.5"
        opacity="0.5"
      />
    </g>
  );
};

// ─── Day grid (three-panel decade layout) ────────────────────────────────────

const PanelMoonSvg: React.FC<{ type: 'waxing' | 'full' | 'waning'; active: boolean }> = ({
  type,
  active,
}) => {
  const cls = `bci-panel-moon ${
    active ? 'bci-panel-moon--active' : 'bci-panel-moon--inactive'
  }`;
  if (type === 'waxing')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
        <path d="M12 2 A 10 10 0 0 1 12 22 A 8 10 0 0 0 12 2 Z" />
      </svg>
    );
  if (type === 'full')
    return (
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
  onShowFestivals: () => void;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}> = ({ today, monthLen, dayEvents, onShowFestivals }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleTap = (day: number) => {
    setSelectedDay(prev => (prev === day ? null : day));
  };

  const panels: Array<{
    days: number[];
    moonType: 'waxing' | 'full' | 'waning';
    title: string;
    subtitle: string;
  }> = [
    {
      days: Array.from({ length: 10 }, (_, i) => i + 1),
      moonType: 'waxing',
      title: 'Arḫu elû',
      subtitle: 'Luna creciente',
    },
    {
      days: Array.from({ length: 10 }, (_, i) => i + 11),
      moonType: 'full',
      title: 'Arḫu šulum',
      subtitle: 'Luna llena',
    },
    {
      days: Array.from({ length: monthLen - 20 }, (_, i) => i + 21),
      moonType: 'waning',
      title: 'Arḫu erbu',
      subtitle: 'Luna menguante',
    },
  ];

  let activePanel = 0;
  if (today >= 21) activePanel = 2;
  else if (today >= 11) activePanel = 1;

  const selSpecial = selectedDay !== null ? SPECIAL_DAYS[selectedDay] : null;
  const selEvent = selectedDay !== null && dayEvents ? dayEvents[selectedDay] : null;
  const hasInfo = selSpecial !== null || selEvent !== null;

  return (
    <div>
      <div className="bci-panels-row">
        {panels.map(({ days, moonType, title, subtitle }) => {
          let panelIdx = 0;
          if (moonType === 'full') panelIdx = 1;
          else if (moonType === 'waning') panelIdx = 2;
          const active = panelIdx === activePanel;
          return (
            <div
              key={moonType}
              className={`bci-panel ${active ? 'bci-panel--active' : 'bci-panel--inactive'}`}
            >
              {active && <div className="bci-panel-glow" />}

              <div className="bci-panel-header">
                <PanelMoonSvg type={moonType} active={active} />
                <h4
                  className={`bci-panel-title ${
                    active ? 'bci-panel-title--active' : 'bci-panel-title--inactive'
                  }`}
                >
                  {title}
                </h4>
                <div className="bci-panel-subtitle">{subtitle}</div>
              </div>

              <div className="bci-day-cells">
                {/* eslint-disable sonarjs/cognitive-complexity */}
                {days.map(day => {
                  const isToday = day === today;
                  const isPast = day < today;
                  const isSelected = day === selectedDay;
                  const special = SPECIAL_DAYS[day];
                  const hasFestival = dayEvents?.[day] !== undefined;

                  let cellClass = 'bci-day-btn--default';
                  if (isSelected) cellClass = 'bci-day-btn--selected';
                  else if (isToday) cellClass = 'bci-day-btn--today';
                  else if (special?.dot === 'sapatu') cellClass = 'bci-day-btn--sapatu';
                  else if (special?.dot === 'quarter') cellClass = 'bci-day-btn--quarter';
                  else if (special?.dot === 'rest') cellClass = 'bci-day-btn--rest';
                  else if (hasFestival) cellClass = 'bci-day-btn--festival';

                  let numClass = 'bci-day-num';
                  if (isSelected) numClass = 'bci-day-num bci-day-num--selected';
                  else if (isToday) numClass = 'bci-day-num bci-day-num--today';
                  else if (isPast) numClass = 'bci-day-num bci-day-num--past';

                  const phase = (day - 1) / monthLen;

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`bci-day-btn ${cellClass}`}
                      onClick={() => handleTap(day)}
                    >
                      <TinyMoon phase={phase} size={11} dim={isPast && !isToday} />
                      <span className={numClass}>{day}</span>
                    </button>
                  );
                })}
              </div>
              {/* eslint-enable sonarjs/cognitive-complexity */}
            </div>
          );
        })}
      </div>

      {/* Info panel */}
      <div
        className={`bci-info-panel ${
          hasInfo && selectedDay !== null ? 'bci-info-panel--open' : 'bci-info-panel--closed'
        }`}
      >
        {hasInfo && selectedDay !== null ? (
          <div className="bci-info-panel-content">
            <div className="bci-info-panel-top">
              <span className="bci-info-panel-day">Día {selectedDay}</span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="bci-info-panel-close"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            {selSpecial && (
              <div>
                <span className="bci-info-special-label">{selSpecial.label}</span>
                <p className="bci-info-special-es">{selSpecial.es}</p>
              </div>
            )}
            {selEvent && (
              <div className={selSpecial ? 'bci-info-event--with-special' : ''}>
                <span
                  className={`bci-info-event-label ${
                    EVENT_TYPE_COLORS[selEvent.type] ?? 'bci-color-blue-light'
                  }`}
                >
                  {selEvent.shortLabel}
                </span>
                <p className="bci-info-event-desc">{selEvent.description}</p>
                {selEvent.fonte && <BabylonianFontePanel fonte={selEvent.fonte} />}
              </div>
            )}
          </div>
        ) : (
          <p className="bci-empty-hint">Toca un día para ver su significado</p>
        )}
      </div>

      {/* Legend */}
      <div className="bci-legend">
        {(
          [
            { cls: 'bci-legend-swatch--quarter', label: 'Cuartos lunares' },
            {
              cls: 'bci-legend-swatch--sapatu',
              label: 'Šapattu',
              gloss: SPECIAL_DAYS[15].es,
            },
            {
              cls: 'bci-legend-swatch--rest',
              label: 'Ūm nūḥi',
              gloss: SPECIAL_DAYS[28].es,
            },
            { cls: 'bci-legend-swatch--festival', label: 'Festival' },
          ] as Array<{ cls: string; label: string; gloss?: string }>
        ).map(({ cls, label, gloss }) => (
          <div key={label} className="bci-legend-item">
            <span className={`bci-legend-swatch ${cls}`} />
            <span className="bci-legend-label">{label}</span>
            {gloss && <span className="bci-legend-gloss">· {gloss}</span>}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onShowFestivals();
        }}
        className="bci-festivals-btn"
      >
        𒀭 Ver Próximos Festivales
      </button>
    </div>
  );
};

// ─── Lunisolar drift bar ──────────────────────────────────────────────────────

const LuniSolarBar: React.FC<{ meta: BabylonianCalendarMeta }> = ({ meta }) => {
  const {
    driftDays,
    springEquinoxDate,
    nisannu1Date,
    isIntercalaryYear,
    nextYearIsIntercalary,
    seYear,
  } = meta;
  const pct = Math.min(driftDays / 30, 1);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  let barClass = 'bci-bar--indigo';
  if (driftDays <= 10) barClass = 'bci-bar--sky';
  else if (driftDays <= 20) barClass = 'bci-bar--blue';

  let driftClass = 'bci-color-indigo';
  if (driftDays <= 10) driftClass = 'bci-color-sky';
  else if (driftDays <= 20) driftClass = 'bci-color-blue';

  return (
    <div className="bci-lunar-bar">
      <div className="bci-lunar-bar-header">
        <span>Equinoccio vernal</span>
        <span className="bci-lunar-bar-nisannu">
          <span className="bci-lunar-bar-nisannu-label">Nisannu I</span>
          <span className="bci-warhum-gloss">{getBabylonianLore('Nisannu')?.monthGloss}</span>
        </span>
        <span>+30 días</span>
      </div>

      <div className="bci-lunar-track">
        <div className={`bci-lunar-fill ${barClass}`} style={{ width: `${pct * 100}%` }} />
        <div className="bci-lunar-cursor" style={{ left: `${pct * 100}%` }} />
      </div>

      <div className="bci-lunar-labels">
        <span className="bci-lunar-equinox-date">{fmtDate(springEquinoxDate)}</span>
        <div className="bci-lunar-center">
          <span className={`bci-lunar-drift ${driftClass}`}>+{driftDays}d</span>
          <span className="bci-lunar-nisannu-date">{fmtDate(nisannu1Date)}</span>
        </div>
        <span className="bci-lunar-30d">+30d</span>
      </div>

      {isIntercalaryYear && (
        <div className="bci-intercalary-note">
          Este año contiene <span style={{ fontWeight: 700 }}>Addaru II</span> — el
          décimotercero mes intercalar.
        </div>
      )}
      {!isIntercalaryYear && nextYearIsIntercalary && (
        <div className="bci-next-intercalary">
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

    let cellClass = 'bci-metonic-cell--default';
    if (isCurrent) cellClass = 'bci-metonic-cell--current';
    else if (isIntercalary) cellClass = 'bci-metonic-cell--intercalary';

    let numClass = 'bci-metonic-num bci-metonic-num--default';
    if (isCurrent) numClass = 'bci-metonic-num bci-metonic-num--current';
    else if (isIntercalary) numClass = 'bci-metonic-num bci-metonic-num--intercalary';

    return (
      <div
        key={pos}
        title={`SE ${cycleStartSE + pos - 1}${isIntercalary ? ' — Addaru II' : ''}`}
        className={`bci-metonic-cell ${cellClass}`}
      >
        <span className={numClass}>{pos}</span>
        {isIntercalary && <span className="bci-metonic-addaru">II</span>}
        {isCurrent && <span className="bci-metonic-dot" />}
      </div>
    );
  };

  return (
    <div className="bci-metonic">
      <div className="bci-metonic-header">
        <div className="bci-metonic-title">Ciclo de Metón — 19 años · 7 intercalares</div>
        <div className="bci-metonic-range">
          SE {cycleStartSE} — SE {cycleStartSE + 18} · Año {metonicPosition} de 19
        </div>
      </div>

      <div className="bci-metonic-rows">
        <div className="bci-metonic-row">{row1.map(renderCell)}</div>
        <div className="bci-metonic-row">{row2.map(renderCell)}</div>
      </div>

      <div className="bci-metonic-legend">
        <div className="bci-metonic-legend-item">
          <span className="bci-metonic-swatch-current" />
          <span className="bci-metonic-label">Año actual (SE {seYear})</span>
        </div>
        <div className="bci-metonic-legend-item">
          <span className="bci-metonic-swatch-intercalary" />
          <span className="bci-metonic-label">Año intercalar (Addaru II)</span>
        </div>
      </div>

      <div className="bci-metonic-note">
        En 19 años solares hay exactamente 235 meses lunares (7 meses extra).
        <br />
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
  <svg className="bci-frieze-svg" viewBox="0 0 200 36" preserveAspectRatio="none">
    <defs>
      {/* === Tile: 50 × 36 units === */}
      <pattern id={id} x="0" y="0" width="50" height="36" patternUnits="userSpaceOnUse">
        {/* Cobalt / lapis lazuli ground */}
        <rect width="50" height="36" fill="#060e22" />

        {/* ── Amber brick strips top & bottom (like the Gate's outer border) ── */}
        <rect x="0" y="0" width="50" height="4" fill="rgba(210,150,40,0.88)" />
        <rect x="0" y="32" width="50" height="4" fill="rgba(210,150,40,0.88)" />
        {/* Mortar joints — vertical dividers every 12.5 units */}
        {[12.5, 25, 37.5].map(x => (
          <line
            key={x}
            x1={x}
            y1="0"
            x2={x}
            y2="4"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="0.6"
          />
        ))}
        {[12.5, 25, 37.5].map(x => (
          <line
            key={x}
            x1={x}
            y1="32"
            x2={x}
            y2="36"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="0.6"
          />
        ))}
        {/* Inner cream highlight line on brick strips */}
        <line x1="0" y1="4" x2="50" y2="4" stroke="rgba(238,225,190,0.35)" strokeWidth="0.6" />
        <line
          x1="0"
          y1="32"
          x2="50"
          y2="32"
          stroke="rgba(238,225,190,0.35)"
          strokeWidth="0.6"
        />

        {/* ── PALMETTE centred at (25, 18), ribs radiate from base (25, 26) ── */}

        {/* Amber base cup */}
        <path d="M17,30 Q25,33.5 33,30 L32,28 Q25,31 18,28 Z" fill="rgba(210,150,40,0.9)" />
        {/* Amber stem */}
        <rect
          x="23.2"
          y="24.5"
          width="3.6"
          height="3.5"
          fill="rgba(210,150,40,0.85)"
          rx="0.5"
        />

        {/* 7 cream ribs from (25, 24.5) — centre, 2 inner, 2 mid, 2 outer */}
        <line
          x1="25"
          y1="24.5"
          x2="25"
          y2="5.5"
          stroke="rgba(238,228,200,0.93)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="24.5"
          x2="21.5"
          y2="6"
          stroke="rgba(238,228,200,0.88)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="24.5"
          x2="28.5"
          y2="6"
          stroke="rgba(238,228,200,0.88)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="24.5"
          x2="17"
          y2="9"
          stroke="rgba(238,228,200,0.82)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="24.5"
          x2="33"
          y2="9"
          stroke="rgba(238,228,200,0.82)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="24.5"
          x2="12"
          y2="15"
          stroke="rgba(238,228,200,0.7)"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="24.5"
          x2="38"
          y2="15"
          stroke="rgba(238,228,200,0.7)"
          strokeWidth="1.0"
          strokeLinecap="round"
        />

        {/* Arc connecting outer rib tips */}
        <path
          d="M12,15 A16,20 0 0,1 38,15"
          fill="none"
          stroke="rgba(238,228,200,0.45)"
          strokeWidth="1"
        />

        {/* Amber node at rib base */}
        <circle cx="25" cy="24.5" r="2.2" fill="rgba(210,150,40,0.97)" />

        {/* Small teal fill inside the palmette fan */}
        <path
          d="M25,24.5 L12,15 A16,20 0 0,1 38,15 Z"
          fill="rgba(0,160,185,0.14)"
          stroke="none"
        />

        {/* ── LEFT teal S-scroll volute, centred at (10, 18) ── */}
        {/* Upper lobe: C-curve opening right, curling clockwise */}
        <path
          d="M2,18 C2,11 7,9 12,12.5 C15,15 14,18 12,18"
          fill="rgba(0,165,190,0.22)"
          stroke="rgba(20,190,215,0.88)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Lower lobe: C-curve opening right, curling counter-clockwise */}
        <path
          d="M2,18 C2,25 7,27 12,23.5 C15,21 14,18 12,18"
          fill="rgba(0,165,190,0.22)"
          stroke="rgba(20,190,215,0.88)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Outer amber bead (open end of C) */}
        <circle cx="2" cy="18" r="1.8" fill="rgba(210,150,40,0.95)" />
        {/* Inner cream dot (meeting point of both C-tips) */}
        <circle cx="12" cy="18" r="1.1" fill="rgba(238,228,200,0.8)" />

        {/* ── RIGHT teal S-scroll volute — mirror of left at (40, 18) ── */}
        <path
          d="M48,18 C48,11 43,9 38,12.5 C35,15 36,18 38,18"
          fill="rgba(0,165,190,0.22)"
          stroke="rgba(20,190,215,0.88)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M48,18 C48,25 43,27 38,23.5 C35,21 36,18 38,18"
          fill="rgba(0,165,190,0.22)"
          stroke="rgba(20,190,215,0.88)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
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
  currentDate,
  weather,
  currentLat = 32.5,
  currentLng = 44.4,
}) => {
  const { civilization } = useCivilization();
  const [babData, setBabData] = useState<BabylonianDate | null>(null);
  const [meta, setMeta] = useState<BabylonianCalendarMeta | null>(null);
  const [view, setView] = useState<ViewMode>('month');
  const [showFestivals, setShowFestivals] = useState(false);

  useEffect(() => {
    const date = currentDate ?? new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBabData(getBabylonianDate(date, currentLat, currentLng));
    setMeta(getBabylonianCalendarMeta(date, currentLat, currentLng));
  }, [currentDate, currentLat, currentLng]);

  const skylineElements = useMemo(
    () =>
      generateBabylonianSkyline(Math.floor((currentDate ?? new Date()).getTime() / 86400000)),
    [currentDate],
  );

  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 63] ?? 0.45;
  const weatherParticles = useMemo(
    () => ({
      ...generateWeatherParticles(rainIntensity),
      stars: Array.from({ length: 60 }).map(() => ({
        // eslint-disable-next-line react-hooks/purity
        x: Math.random() * 300,
        // eslint-disable-next-line react-hooks/purity
        y: 20 + Math.random() * 170,
        // eslint-disable-next-line react-hooks/purity
        r: Math.random() * 1.2 + 0.3,
        // eslint-disable-next-line react-hooks/purity
        opacity: Math.random() * 0.7 + 0.3,
      })),
    }),
    [rainIntensity],
  );

  if ((civilization as string) !== 'babylonia' || !babData || !meta) return null;

  const lore = getBabylonianLore(babData.monthName);

  // Sin (moon god) — real sky position. Shown by day and night whenever the
  // Moon is above the horizon (a daytime Moon is a normal occurrence).
  // ?mockmoon=<phase> (0–1) pins the moon at center-sky for visual testing.
  const mockMoonPhase = new URLSearchParams(window.location.search).get('mockmoon');
  const sinPos = getMoonPosition(currentDate ?? new Date(), currentLat, currentLng);
  const sinVisible = mockMoonPhase !== null || sinPos.altitude >= 0;
  // Mapped into the same 300×200 frame as the ziggurat skyline, so the Moon
  // sits on the real horizon: 0° altitude hugs the rooftops, 90° nears the top.
  const sinX =
    mockMoonPhase !== null
      ? 65
      : Math.max(16, Math.min(284, 150 + ((sinPos.azimuth - 180) / 90) * 120));
  const sinY =
    mockMoonPhase !== null
      ? 115
      : Math.max(40, Math.min(175, 145 - (sinPos.altitude / 90) * 105));
  const sinPhase = mockMoonPhase !== null ? parseFloat(mockMoonPhase) : babData.moonPhase;
  const condition = weather?.current.condition ?? 'clear';

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const skyGradient = (() => {
    const p = babData.dayProgress;
    if (!babData.isDay) {
      if (
        condition === 'cloudy' ||
        condition === 'partly-cloudy' ||
        condition === 'fog' ||
        condition === 'rain' ||
        condition === 'storm'
      ) {
        return 'linear-gradient(to bottom, #0a0d14 0%, #111827 60%, #1c1008 100%)';
      }
      return 'linear-gradient(to bottom, #050208 0%, #0a0510 40%, #1a0a05 80%, #2a1005 100%)';
    }
    if (p < 0.08)
      return 'linear-gradient(to bottom, #0f0a02 0%, #4a1a05 30%, #b45309 70%, #fbbf24 100%)';
    if (p < 0.2)
      return 'linear-gradient(to bottom, #1a0a05 0%, #7c3b1a 40%, #d97706 80%, #fde68a 100%)';
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
      if (condition === 'partly-cloudy') {
        return 'linear-gradient(to bottom, #6a87a8 0%, #a8b8d0 30%, #c4a55a 70%, #fde68a 100%)';
      }
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
    <div className="babylonian-calendar-info">
      <div className="bci-outer-card">
        <CuneiformBorder id="cun-top" />

        <div className="bci-inner">
          {/* Sky scene */}
          <div className="bci-sky-scene">
            <div className="bci-sky-bg" style={{ background: skyGradient }} />

            {/* Stars + weather + Moon */}
            <svg
              className="bci-sky-svg-layer"
              viewBox="0 0 300 200"
              preserveAspectRatio="xMidYMax meet"
            >
              {!babData.isDay && (
                <g>
                  {weatherParticles.stars.map((s, i) => (
                    <circle
                      key={`star-${i}`}
                      cx={s.x}
                      cy={s.y}
                      r={s.r}
                      fill="#fff"
                      opacity={s.opacity}
                    />
                  ))}
                </g>
              )}
              {sinVisible && (
                <g transform={`translate(${sinX}, ${sinY})`}>{renderSinMoon(sinPhase)}</g>
              )}
              <WeatherSvgEffects
                condition={condition}
                weatherParticles={weatherParticles}
                fogGradientId="fog-ground-bab"
                cloudOpacity={0.7}
                stormOpacity={0.65}
                rainIntensity={rainIntensity}
                windGusts={weather?.current.windGusts ?? 0}
                offline={!!(weather?.isOffline || weather?.aurora)}
              />
              {condition === 'storm' && (
                <rect
                  x="0"
                  y="0"
                  width="300"
                  height="200"
                  fill="#ffffff"
                  opacity="0"
                  className="anim-lightning"
                />
              )}
            </svg>

            {/* Ziggurat skyline — bottom-anchored, original proportions */}
            <svg
              className="bci-skyline-svg"
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
                  <path
                    d="M 0 182 Q 50 178 100 182 T 200 182 T 300 182 V 200 H 0 Z"
                    fill="#dde1e7"
                    stroke="#f0f4f8"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0 182 Q 50 178 100 182 T 200 180 T 300 182 V 178 Q 250 176 200 178 T 100 179 T 0 178 Z"
                    fill="#f0f4f8"
                    opacity="0.9"
                  />
                </>
              )}
            </svg>
            <div className="bci-sky-overlay">
              {/* 𒀭 + month name — prominent, inline */}
              <div className="bci-hero-heading">
                <div className="bci-hero-dingir-row">
                  <span
                    className="bci-dingir"
                    style={{ fontSize: 'clamp(1.4rem, 5.5vw, 2.2rem)' }}
                  >
                    𒀭
                  </span>
                  <span
                    className="bci-month-name"
                    style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', lineHeight: 1 }}
                  >
                    {babData.monthName}
                    {babData.isIntercalary && (
                      <span className="bci-intercalary" style={{ fontSize: '40%' }}>
                        (intercalar)
                      </span>
                    )}
                  </span>
                </div>
                <span
                  className="bci-warhum"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)' }}
                >
                  Warḫum {babData.monthIndex + 1}
                </span>
              </div>
              {/* SE year — smaller, below */}
              <div
                className="bci-se-year"
                style={{ fontSize: 'clamp(0.75rem, 2.8vw, 1.1rem)', letterSpacing: '0.2em' }}
              >
                SE {babData.seYear}
              </div>
              <div
                className="bci-hour-name"
                style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.9rem)' }}
              >
                {babData.hourName}
              </div>
              <div
                className="bci-planet-watch"
                style={{ fontSize: 'clamp(0.75rem, 2vw, 0.8rem)' }}
              >
                {babData.planetaryRuler} · {babData.watchName}
              </div>
            </div>
          </div>

          {/* ── Efemérides del día + deidad del mes ── */}
          <div className="bci-daily-info">
            <DayStatusCard day={babData.day} lore={lore} />

            {lore && (
              <div className="bci-lore-card">
                <div className="bci-lore-header">
                  <span>𒀭</span> Deidad del Mes <span>𒀭</span>
                </div>
                <div className="bci-lore-deity-row">
                  <span className="bci-deity-icon">{lore.icon}</span>
                  <div className="bci-deity-info">
                    <h2 className="bci-deity-name">{lore.festivalDeity}</h2>
                    {lore.festivalDeityGloss && (
                      <span className="bci-deity-gloss">{lore.festivalDeityGloss}</span>
                    )}
                  </div>
                </div>
                <p className="bci-lore-desc">
                  {'"'}
                  {lore.description}
                  {'"'}
                </p>
                <div className="bci-lore-grid">
                  <div className="bci-lore-item">
                    <span className="bci-lore-item-dingir">𒀭</span>
                    <div className="bci-lore-item-body">
                      <span className="bci-lore-item-label">Regente del Mes</span>
                      <span className="bci-lore-item-value">
                        {lore.monthRegent}
                        {lore.regentNote && (
                          <span className="bci-regent-note"> · {lore.regentNote}</span>
                        )}
                      </span>
                      <span className="bci-regent-desc">{babData.monthRegentDesc}</span>
                    </div>
                  </div>
                  <div className="bci-lore-item">
                    <span className="bci-lore-item-dingir">🏛️</span>
                    <div className="bci-lore-item-body">
                      <span className="bci-lore-item-label">Festival / Ritual Principal</span>
                      <span className="bci-lore-item-value">{lore.festival}</span>
                    </div>
                  </div>
                </div>
                <p className="bci-lore-footnote">
                  Regente según las listas cuneiformes de los meses (IV R 33 · Astrolabio B).
                </p>
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="bci-view-toggle">
            {(['month', 'cycle'] as ViewMode[]).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`bci-toggle-btn ${
                  view === v ? 'bci-toggle-btn--active' : 'bci-toggle-btn--inactive'
                }`}
              >
                {v === 'month' ? '☽ Mes Lunar' : '⟳ Ciclo de Metón'}
              </button>
            ))}
          </div>

          {/* Month view */}
          {view === 'month' && (
            <div className="bci-view-panel">
              <div className="bci-view-header">
                <span>☾</span>
                <span>
                  Warḫum{' '}
                  <span
                    style={{
                      textTransform: 'none',
                      fontStyle: 'italic',
                      color: 'rgb(147 197 253 / 60%)',
                    }}
                  >
                    (mes)
                  </span>
                  : {meta.monthLengthDays} días lunares
                </span>
                <span>☽</span>
              </div>

              <DayGrid
                today={babData.day}
                monthLen={meta.monthLengthDays}
                dayEvents={lore?.dayEvents}
                onShowFestivals={() => setShowFestivals(true)}
              />

              <div className="bci-lunar-sync-section">
                <div className="bci-lunar-sync-title">Sincronía Lunar–Solar</div>
                <LuniSolarBar meta={meta} />
              </div>
            </div>
          )}

          {/* Cycle view */}
          {view === 'cycle' && (
            <div className="bci-view-panel">
              <div className="bci-view-header">
                <span>𒀭</span>
                Ciclo de 19 años (Ciclo de Metón)
                <span>𒀭</span>
              </div>
              <MetonicCycle meta={meta} />
            </div>
          )}

          {/* Planetary ruler / watch / hour */}
          <div className="bci-info-row">
            {[
              {
                title: 'Planeta Rector',
                main: babData.planetaryRuler,
                sub: babData.planetaryRulerEs,
              },
              { title: 'Guardia', main: babData.watchName, sub: babData.watchDesc },
              { title: 'Hora Temporal', main: babData.hourName, sub: babData.hourNameEs },
            ].map(({ title, main, sub }) => (
              <div key={title} className="bci-info-cell">
                <div className="bci-info-cell-label">{title}</div>
                <div className="bci-info-cell-main">{main}</div>
                {sub && <div className="bci-info-cell-sub">{sub}</div>}
              </div>
            ))}
          </div>
        </div>

        <CuneiformBorder id="cun-btm" />
      </div>

      {/* ── Próximos Festivales modal ───────────────────────────────────────── */}
      {showFestivals && babData && (
        <div
          role="button"
          tabIndex={0}
          className="bci-modal-backdrop"
          onClick={() => setShowFestivals(false)}
          onKeyDown={e => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')
              setShowFestivals(false);
          }}
        >
          <div role="presentation" className="bci-modal" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bci-modal-header">
              <div className="bci-modal-dingir">𒀭</div>
              <h2 className="bci-modal-title">Próximos Festivales</h2>
              <p className="bci-modal-subtitle">Calendario Sacro Babilónico</p>
            </div>

            {/* List */}
            <div className="bci-modal-list">
              {getNextBabylonianFestivals(babData.monthIndex, babData.day, 5).map((f, i) => (
                <div key={i}>
                  <div className="bci-festival-header">
                    <div className="bci-festival-info">
                      <h4 className="bci-festival-name">
                        <span>{f.monthIcon}</span>
                        <span>{f.shortLabel}</span>
                      </h4>
                      <span className="bci-festival-day">
                        Día {f.day} de {f.monthName}
                      </span>
                    </div>
                    <div className="bci-festival-countdown">
                      <div className="bci-festival-days-num">{f.daysRemaining}</div>
                      <div className="bci-festival-days-label">días</div>
                    </div>
                  </div>
                  <p className="bci-festival-desc">{f.description.split('(')[0].trim()}</p>
                  {f.fonte && <BabylonianFontePanel fonte={f.fonte} />}
                </div>
              ))}
            </div>

            {/* Footer */}
            <button className="bci-modal-footer" onClick={() => setShowFestivals(false)}>
              Cerrar Calendario Sacro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BabylonianCalendarInfo;

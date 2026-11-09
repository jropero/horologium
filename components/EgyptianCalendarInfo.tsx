// EgyptianCalendarInfo.tsx — Egyptian calendar info panel (restyled)
// Palette: lotus-papyrus SVG — Egyptian blue #1840a0, red-ochre #c0391a, gold, dark ground

import React, { useState, useMemo } from 'react';
import './EgyptianCalendarInfo.css';
import {
  getEgyptianDate,
  EgyptianDateResult,
  formatEgyptianDate,
} from '../utils/egyptianCalendarUtils';
import { getEpagomenalDayInfo } from '../utils/egyptianCalendarData';
import { getEgyptianMonthDeity } from '../utils/egyptianDeities';
import {
  getFestivalsForDate,
  getNextEgyptianFestivals,
  FestivalFonte as FestivalFonteData,
  HALL_OF_MAATI,
  CIVIL_FESTIVALS,
} from '../utils/egyptianFestivalsData';
import { getHemerologyForDate, Prognosis } from '../utils/egyptianHemerologyData';
import { getEgyptianDayAnchor } from '../utils/egyptianTimeUtils';
import {
  getAlgolPhase,
  getAlgolDailyData,
  getLunarPhase,
  getSopdetHeliacalEvent,
  getSiriusDailyData,
} from '../utils/egyptianAstronomy';
import { useCivilization } from '../contexts/CivilizationContext';
import Nilometer from './Nilometer';
import { generateEgyptianSkyline } from '../utils/egyptianSkylineGenerator';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';
import { WeatherData } from '../types';
import {
  Waves,
  Feather,
  Hammer,
  Ship,
  Music,
  Sparkles,
  Sailboat,
  Sprout,
  Moon,
  Bird,
  MoveUp,
  Crown,
  Sun,
  Flame,
  ArrowUpCircle,
  Wheat,
  Shirt,
  Eye,
  PartyPopper,
  Tent,
  CalendarClock,
  Ruler,
  Map,
  Circle,
  Compass,
  Sunrise,
} from 'lucide-react';
import HorusEclipseModal from './HorusEclipseModal';
import { getSunTimes } from '../utils/solar';
import EgyptianStarMap from './EgyptianStarMap';

const BORDER_BLUE_FAINT = 'rgba(24,64,160,0.25)';

const FestivalIcon = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return null;
  const props = { className, size: 16 };
  switch (name) {
    case 'Waves':
      return <Waves {...props} />;
    case 'Feather':
      return <Feather {...props} />;
    case 'Hammer':
      return <Hammer {...props} />;
    case 'Ship':
      return <Ship {...props} />;
    case 'Music':
      return <Music {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Sailboat':
      return <Sailboat {...props} />;
    case 'Sprout':
      return <Sprout {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'Bird':
      return <Bird {...props} />;
    case 'MoveUp':
      return <MoveUp {...props} />;
    case 'Crown':
      return <Crown {...props} />;
    case 'Sun':
      return <Sun {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'ArrowUpCircle':
      return <ArrowUpCircle {...props} />;
    case 'Wheat':
      return <Wheat {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'Eye':
      return <Eye {...props} />;
    case 'PartyPopper':
      return <PartyPopper {...props} />;
    case 'Tent':
      return <Tent {...props} />;
    case 'CalendarClock':
      return <CalendarClock {...props} />;
    case 'Ruler':
      return <Ruler {...props} />;
    case 'Map':
      return <Map {...props} />;
    case 'Circle':
      return <Circle {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Sunrise':
      return <Sunrise {...props} />;
    default:
      return null;
  }
};

// ─── Book of the Dead fonte quote (collapsible) ───────────────────────────────
const FestivalFontePanel: React.FC<{ fonte: FestivalFonteData }> = ({ fonte }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fonte-panel">
      <button onClick={() => setOpen(o => !o)} className="fonte-toggle-btn">
        <span className="fonte-spell">𓂀 {fonte.spell}</span>
        <span className="fonte-chevron">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="fonte-body">
          <p className="fonte-excerpt">{fonte.excerpt}</p>
          <p className="fonte-source">{fonte.source}</p>
        </div>
      )}
    </div>
  );
};

// ─── Temple lotus-papyrus frieze border ───────────────────────────────────────
const LotusFreizeBorder: React.FC<{ id: string }> = ({ id }) => (
  <svg className="lotus-frieze" viewBox="0 0 200 36" preserveAspectRatio="none">
    <defs>
      <pattern id={id} x="0" y="0" width="50" height="36" patternUnits="userSpaceOnUse">
        <rect width="50" height="36" fill="#0c0804" />
        <rect x="0" y="0" width="50" height="2" fill="#1840a0" />
        <rect x="0" y="2" width="50" height="3" fill="#c0391a" />
        {[12.5, 25, 37.5].map(x => (
          <line
            key={x}
            x1={x}
            y1="2"
            x2={x}
            y2="5"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="0.5"
          />
        ))}
        <line x1="0" y1="2" x2="50" y2="2" stroke="rgba(240,200,72,0.35)" strokeWidth="0.4" />
        <line x1="0" y1="5" x2="50" y2="5" stroke="rgba(212,168,50,0.92)" strokeWidth="0.7" />
        <rect x="0" y="31" width="50" height="3" fill="#c0391a" />
        <rect x="0" y="34" width="50" height="2" fill="#1840a0" />
        {[12.5, 25, 37.5].map(x => (
          <line
            key={x}
            x1={x}
            y1="31"
            x2={x}
            y2="34"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="0.5"
          />
        ))}
        <line x1="0" y1="31" x2="50" y2="31" stroke="rgba(212,168,50,0.92)" strokeWidth="0.7" />
        <line x1="0" y1="34" x2="50" y2="34" stroke="rgba(240,200,72,0.35)" strokeWidth="0.4" />
        <path d="M25,23 L22,9.5 L25,13 L28,9.5 Z" fill="#2560c0" />
        <path d="M25,23 L18,12  L22,9.5 L24,13  Z" fill="#1a4da8" />
        <path d="M25,23 L32,12  L28,9.5 L26,13  Z" fill="#1a4da8" />
        <path d="M25,23 L14,16  L18,12  L21,14  Z" fill="#2a7a3a" />
        <path d="M25,23 L36,16  L32,12  L29,14  Z" fill="#2a7a3a" />
        <path d="M25,23 L11,20  L14,16  L17,16  Z" fill="#c03020" />
        <path d="M25,23 L39,20  L36,16  L33,16  Z" fill="#c03020" />
        <line
          x1="25"
          y1="23"
          x2="25"
          y2="8.5"
          stroke="rgba(238,228,200,0.85)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="22"
          y2="9.5"
          stroke="rgba(238,228,200,0.80)"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="28"
          y2="9.5"
          stroke="rgba(238,228,200,0.80)"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="18"
          y2="12"
          stroke="rgba(238,228,200,0.72)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="32"
          y2="12"
          stroke="rgba(238,228,200,0.72)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="14"
          y2="16"
          stroke="rgba(238,228,200,0.60)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="36"
          y2="16"
          stroke="rgba(238,228,200,0.60)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="11"
          y2="20"
          stroke="rgba(238,228,200,0.48)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="23"
          x2="39"
          y2="20"
          stroke="rgba(238,228,200,0.48)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <path
          d="M11,20 A18,21 0 0,1 39,20"
          fill="none"
          stroke="rgba(238,228,200,0.38)"
          strokeWidth="0.8"
        />
        <path
          d="M19,23.5 Q25,27 31,23.5 L30,21.5 Q25,25 20,21.5 Z"
          fill="rgba(212,168,40,0.9)"
        />
        <circle cx="25" cy="23" r="2.2" fill="rgba(212,168,40,0.97)" />
        <line
          x1="25"
          y1="25.2"
          x2="25"
          y2="28"
          stroke="rgba(180,140,50,0.82)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="0"
          y2="28"
          stroke="rgba(180,140,50,0.82)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="0"
          y2="7.5"
          stroke="#4a9a5a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="5"
          y2="8.5"
          stroke="#3a8a4a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="9"
          y2="10"
          stroke="#2a7a3a"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="12"
          y2="13"
          stroke="#3a8a4a"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="14"
          y2="17.5"
          stroke="#2a7a3a"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="-5"
          y2="8.5"
          stroke="#3a8a4a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="-9"
          y2="10"
          stroke="#2a7a3a"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="-12"
          y2="13"
          stroke="#3a8a4a"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="21"
          x2="-14"
          y2="17.5"
          stroke="#2a7a3a"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="0" cy="21" r="1.6" fill="rgba(212,168,40,0.95)" />
        <line
          x1="50"
          y1="21"
          x2="50"
          y2="28"
          stroke="rgba(180,140,50,0.82)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="50"
          y2="7.5"
          stroke="#4a9a5a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="45"
          y2="8.5"
          stroke="#3a8a4a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="41"
          y2="10"
          stroke="#2a7a3a"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="38"
          y2="13"
          stroke="#3a8a4a"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="36"
          y2="17.5"
          stroke="#2a7a3a"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="55"
          y2="8.5"
          stroke="#3a8a4a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="59"
          y2="10"
          stroke="#2a7a3a"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="62"
          y2="13"
          stroke="#3a8a4a"
          strokeWidth="1.0"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="21"
          x2="64"
          y2="17.5"
          stroke="#2a7a3a"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <circle cx="50" cy="21" r="1.6" fill="rgba(212,168,40,0.95)" />
        <path
          d="M0,28 Q12.5,30 25,28 Q37.5,26 50,28"
          fill="none"
          stroke="rgba(180,140,50,0.68)"
          strokeWidth="0.7"
        />
        <line
          x1="12.5"
          y1="28.5"
          x2="12.5"
          y2="29.5"
          stroke="rgba(180,140,50,0.5)"
          strokeWidth="0.6"
        />
        <path d="M12.5,29.5 L10.5,33 L12.5,31.5 L14.5,33 Z" fill="#1a50b0" opacity="0.82" />
        <line
          x1="37.5"
          y1="28.5"
          x2="37.5"
          y2="29.5"
          stroke="rgba(180,140,50,0.5)"
          strokeWidth="0.6"
        />
        <path d="M37.5,29.5 L35.5,33 L37.5,31.5 L39.5,33 Z" fill="#1a50b0" opacity="0.82" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="36" fill="#0c0804" />
    <rect x="0" y="0" width="100%" height="36" fill={`url(#${id})`} />
  </svg>
);

// ─── Section header ──────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="eci-section-header">{children}</h3>
);

// ─── Decade day grid ─────────────────────────────────────────────────────────
const DecadeGrid: React.FC<{
  egyptianDate: EgyptianDateResult;
  onShowFestivals: () => void;
}> = ({ egyptianDate, onShowFestivals }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const panels = [
    {
      days: Array.from({ length: 10 }, (_, i) => i + 1),
      decade: 1,
      label: 'Década I',
      sub: 'Primeros 10 días',
    },
    {
      days: Array.from({ length: 10 }, (_, i) => i + 11),
      decade: 2,
      label: 'Década II',
      sub: 'Días centrales',
    },
    {
      days: Array.from({ length: 10 }, (_, i) => i + 21),
      decade: 3,
      label: 'Década III',
      sub: 'Últimos días',
    },
  ];

  const activeDecade = egyptianDate.decade;

  return (
    <div>
      <div className="decade-panels">
        {panels.map(({ days, decade, label, sub }) => {
          const isActive = decade === activeDecade;
          return (
            <div
              key={decade}
              className={`decade-panel ${
                isActive ? 'decade-panel--active' : 'decade-panel--inactive'
              }`}
            >
              <div className="decade-panel-header">
                <div
                  className={`decade-label ${
                    isActive ? 'decade-label--active' : 'decade-label--inactive'
                  }`}
                >
                  {label}
                </div>
                <div
                  className={`decade-sub ${
                    isActive ? 'decade-sub--active' : 'decade-sub--inactive'
                  }`}
                >
                  {sub}
                </div>
              </div>
              <div className="decade-dots">
                {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
                {days.map(day => {
                  const isToday = !egyptianDate.isEpagomenal && day === egyptianDate.dayOfMonth;
                  const isSelected = day === selectedDay;
                  const { civilFestivals } = getFestivalsForDate(
                    egyptianDate.monthIndex,
                    day,
                    0,
                  );
                  const hasFest = civilFestivals.length > 0;

                  let cls: string;
                  if (isSelected) cls = 'day-dot--selected';
                  else if (isToday) cls = 'day-dot--today';
                  else if (hasFest)
                    cls = isActive ? 'day-dot--fest-active' : 'day-dot--fest-inactive';
                  else cls = isActive ? 'day-dot--blue-active' : 'day-dot--plain';

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedDay(prev => (prev === day ? null : day));
                      }}
                      className={`day-dot ${cls}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected day info panel */}
      <div
        className={`day-info-panel ${
          selectedDay !== null ? 'day-info-panel--open' : 'day-info-panel--closed'
        }`}
      >
        {selectedDay !== null ? (
          (() => {
            const { civilFestivals: sf } = getFestivalsForDate(
              egyptianDate.monthIndex,
              selectedDay,
              0,
            );
            return (
              <div>
                <div className="day-info-title-row">
                  <span className="day-info-day-label">Día {selectedDay}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(null)}
                    className="day-info-close"
                  >
                    ✕
                  </button>
                </div>
                {sf.length > 0 ? (
                  sf.map((f, i) => (
                    <div key={i} className="day-info-fest">
                      <span className="day-info-fest-name">{f.name}</span>
                      <p className="day-info-fest-desc">{f.description}</p>
                    </div>
                  ))
                ) : (
                  <span className="day-info-empty">
                    Sin festival civil registrado para este día.
                  </span>
                )}
              </div>
            );
          })()
        ) : (
          <p className="day-info-hint">Toca un día para ver su festival</p>
        )}
      </div>

      {/* Legend */}
      <div className="decade-legend">
        <div className="decade-legend-item">
          <span className="decade-legend-dot decade-legend-dot--today" />
          <span className="decade-legend-label">Hoy</span>
        </div>
        <div className="decade-legend-item">
          <span className="decade-legend-dot decade-legend-dot--fest" />
          <span className="decade-legend-label">Festival</span>
        </div>
      </div>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onShowFestivals();
        }}
        className="decade-view-festivals-btn"
      >
        ✨ Ver Próximos Festivales
      </button>
    </div>
  );
};

// ─── Prognosis card ──────────────────────────────────────────────────────────
const PrognosisCard: React.FC<{ title: string; prognosis: Prognosis }> = ({
  title,
  prognosis,
}) => {
  const PROGNOSIS_DATA = {
    nefer: { variant: 'nefer', icon: '☀️', text: 'Nefer', sub: 'Favorable' },
    aha: { variant: 'aha', icon: '🦂', text: 'Aha', sub: 'Adverso' },
    neutral: { variant: 'neutral', icon: '—', text: '—', sub: '—' },
    none: { variant: 'neutral', icon: '—', text: '—', sub: '—' },
  } as const;
  const { variant, icon, text, sub } = PROGNOSIS_DATA[prognosis];

  return (
    <div className={`prognosis-card prognosis-card--${variant}`}>
      <span className="prognosis-title">{title}</span>
      <span className="prognosis-icon">{icon}</span>
      <span className={`prognosis-text prognosis-text--${variant}`}>{text}</span>
      <span className={`prognosis-sub prognosis-text--${variant}`}>{sub}</span>
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

const EgyptianCalendarInfo: React.FC<EgyptianCalendarInfoProps> = ({
  onClick,
  currentDate = new Date(),
  lat,
  lng,
  weather,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { civilization, labels } = useCivilization();
  const [showFestivals, setShowFestivals] = useState(false);
  const [showMaati, setShowMaati] = useState(false);
  const [sopdetExpanded, setSopdetExpanded] = useState(false);
  const [algolExpanded, setAlgolExpanded] = useState(false);
  const [view, setView] = useState<ViewMode>('calendar');
  const [isHorusOpen, setIsHorusOpen] = useState(false);

  // Stable local-midnight stamp: changes only when the calendar day changes,
  // so day-level astronomy (Egyptian date, Sopdet, Sirius) is computed once per
  // day+location instead of on every 15s clock tick.
  const dayKey = (() => {
    const d = new Date(currentDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();

  // The Egyptian civil day begins at sunrise (same anchor as calculateEgyptianTime
  // and EgyptianClock), so before sunrise the previous day's date is shown.
  const egyptianDayKey =
    lat != null && lng != null ? getEgyptianDayAnchor(currentDate, lat, lng).getTime() : dayKey;
  const egyptianDate = useMemo(
    () => getEgyptianDate(new Date(egyptianDayKey)),
    [egyptianDayKey],
  );

  // Sopdet heliacal event: depends on the year + coordinates (cached in egyptianAstronomy.ts).
  const sopdet = useMemo(
    () =>
      lat != null && lng != null ? getSopdetHeliacalEvent(new Date(dayKey), lat, lng) : null,
    [dayKey, lat, lng],
  );

  // Heavy daily tables are only computed when the user actually expands the panels.
  const sopdetDaily = useMemo(
    () =>
      sopdetExpanded && lat != null && lng != null
        ? getSiriusDailyData(new Date(dayKey), lat, lng)
        : null,
    [sopdetExpanded, dayKey, lat, lng],
  );
  // Algol phase is live (time-of-day sensitive), so it keeps refreshing while open.
  const algolDaily = useMemo(
    () =>
      algolExpanded && lat != null && lng != null
        ? getAlgolDailyData(currentDate, lat, lng)
        : null,
    [algolExpanded, currentDate, lat, lng],
  );

  // Skyline is a deterministic per-day pattern — seed it on the same day stamp it consumes.
  const skylineDay = Math.floor((currentDate ?? new Date()).getTime() / 86400000);
  const skylineElements = useMemo(() => generateEgyptianSkyline(skylineDay), [skylineDay]);

  const sunTimes = useMemo(
    () => (lat != null && lng != null ? getSunTimes(currentDate, lat, lng) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayKey, lat, lng],
  );
  const isNightMemo = useMemo(() => {
    if (sunTimes) {
      const t = currentDate.getTime();
      return t < sunTimes.sunrise.getTime() || t >= sunTimes.sunset.getTime();
    }
    const h = currentDate.getHours();
    return h < 6 || h >= 20;
  }, [currentDate, sunTimes]);

  const weatherCond = weather?.current.condition ?? 'clear';
  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 63] ?? 0.45;
  const weatherParticles = useMemo(
    () => generateWeatherParticles(rainIntensity),
    [rainIntensity],
  );

  // Remaining per-day values, grouped in one memo so the render body only
  // destructures precomputed data. All lookups here are cheap (data tables) or
  // cached (moon phase), so recomputing on the clock tick is negligible.
  const derived = useMemo(() => {
    const deity = getEgyptianMonthDeity(egyptianDate.monthIndex);
    const epagomenalInfo = egyptianDate.isEpagomenal
      ? getEpagomenalDayInfo(egyptianDate.dayOfMonth)
      : null;
    const hemerology = getHemerologyForDate(
      currentDate,
      egyptianDate.monthIndex,
      egyptianDate.dayOfMonth,
    );
    const algol = getAlgolPhase(currentDate);
    const moonPhase = getLunarPhase(currentDate);
    const lunarDay = Math.floor(moonPhase * 30) + 1;
    const { civilFestivals, lunarFestivals } = getFestivalsForDate(
      egyptianDate.monthIndex,
      egyptianDate.dayOfMonth,
      lunarDay,
    );
    const isNewMoon = moonPhase < 0.03 || moonPhase > 0.97;
    const isFullMoon = moonPhase > 0.47 && moonPhase < 0.53;
    const hasAstroAlerts =
      algol.isEclipsed || isNewMoon || isFullMoon || (moonPhase >= 0.45 && moonPhase <= 0.55);
    return {
      deity,
      epagomenalInfo,
      hemerology,
      algol,
      moonPhase,
      lunarDay,
      civilFestivals,
      lunarFestivals,
      isNewMoon,
      isFullMoon,
      hasAstroAlerts,
    };
  }, [currentDate, egyptianDate]);

  if (civilization !== 'aegyptus') return null;

  const {
    deity,
    epagomenalInfo,
    hemerology,
    algol,
    moonPhase,
    lunarDay,
    civilFestivals,
    lunarFestivals,
    isNewMoon,
    isFullMoon,
    hasAstroAlerts,
  } = derived;

  const isNight = isNightMemo;

  return (
    <>
      <div
        className="eci-wrapper"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.();
        }}
      >
        {/* Main card */}
        <div className="eci-card">
          <LotusFreizeBorder id="lotus-top" />

          {/* ── Sky scene ─────────────────────────────────────────────────── */}
          <div className="eci-sky">
            {/* Layers: star map (z-0, owns horizontal drag) → skyline → weather → text.
              Everything above the star map is pointer-events:none so drags reach it. */}
            {sunTimes ? (
              <EgyptianStarMap date={currentDate} lat={lat!} lng={lng!} horizon={0.9} />
            ) : (
              <div className="eci-sky-fallback" />
            )}

            {/* Weather effects */}
            <svg
              className="eci-weather-svg"
              viewBox="0 0 300 200"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Always mounted (also for 'clear') so the aurora can crossfade out */}
              <WeatherSvgEffects
                condition={weatherCond}
                weatherParticles={weatherParticles}
                fogGradientId="fog-ground-egy-info"
                cloudOpacity={0.7}
                stormOpacity={0.65}
                rainIntensity={rainIntensity}
                windGusts={weather?.current.windGusts ?? 0}
                offline={!!(weather?.isOffline || weather?.aurora)}
              />
              {weatherCond === 'storm' && (
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

            {/* Egyptian skyline */}
            <svg
              className="eci-skyline-svg"
              viewBox="0 0 300 200"
              preserveAspectRatio="xMidYMax meet"
              style={
                weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined
              }
            >
              {/* eslint-disable sonarjs/cognitive-complexity, sonarjs/no-nested-conditional */}
              {skylineElements.map(el => (
                <path
                  key={el.id}
                  d={el.path}
                  fill={
                    weatherCond === 'snow'
                      ? 'rgba(55,65,80,0.88)'
                      : isNight
                        ? 'rgba(40,20,5,0.92)'
                        : 'rgba(100,55,15,0.82)'
                  }
                  stroke={
                    weatherCond === 'snow'
                      ? 'rgba(140,165,190,0.45)'
                      : isNight
                        ? 'rgba(80,40,10,0.4)'
                        : 'rgba(160,90,20,0.35)'
                  }
                  strokeWidth="0.5"
                  opacity={el.opacity}
                />
              ))}
              {/* eslint-enable sonarjs/cognitive-complexity, sonarjs/no-nested-conditional */}
              {/* Snow floor */}
              <path
                d="M 0 180 L 300 180 L 300 200 L 0 200 Z"
                fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'}
              />
              <path
                d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z"
                fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'}
                stroke={weatherCond === 'snow' ? '#f0f4f8' : 'rgba(160,100,40,0.5)'}
                strokeWidth="1"
              />
              {weatherCond === 'snow' && (
                <path
                  d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z"
                  fill="#f0f4f8"
                  opacity="0.9"
                />
              )}
            </svg>

            {/* Text overlay */}
            <div className="eci-sky-text">
              <div className="eci-season-glyph">{egyptianDate.seasonHieroglyphic}</div>
              <h3 className="eci-month-name">
                {egyptianDate.isEpagomenal ? 'Epagomenai' : egyptianDate.monthName}
              </h3>
              <div className="eci-month-hieroglyphs">{egyptianDate.monthHieroglyphs}</div>
              <div className="eci-season-label">
                {egyptianDate.seasonName} — {egyptianDate.seasonTranslation}
              </div>
            </div>
          </div>

          {/* ── Date strip ──────────────────────────────────────────────────── */}
          <div className="eci-date-strip">
            {!egyptianDate.isEpagomenal ? (
              <div className="eci-date-row">
                <span className="eci-date-primary">{formatEgyptianDate(egyptianDate)}</span>
                <div className="eci-date-secondary">
                  <span className="eci-date-sep-sm">·</span>
                  <span className="eci-date-day-of-year">
                    Día {egyptianDate.dayOfYear} del año
                  </span>
                  <span className="eci-date-sep">·</span>
                  <span className="eci-date-lunar">Luna {lunarDay}</span>
                </div>
              </div>
            ) : (
              <div className="eci-epa-row">
                <span className="eci-epa-label">
                  𓊹 Día Epagómeno {epagomenalInfo?.dayNumber} — {epagomenalInfo?.deity} 𓊹
                </span>
              </div>
            )}
          </div>

          {/* ── Main content ─────────────────────────────────────────────────── */}
          <div className="eci-content">
            {/* ── Efemérides del día (bajo el hero, sobre el calendario) ──────── */}
            {!egyptianDate.isEpagomenal &&
              (civilFestivals.length > 0 || lunarFestivals.length > 0) && (
                <div className="eci-ephemerides">
                  <SectionHeader>Festividades de Hoy</SectionHeader>
                  <div className="eci-ephemerides-list">
                    {civilFestivals.map((f, i) => (
                      <div key={`civ-ephem-${i}`} className="eci-civil-fest-item">
                        <FestivalIcon name={f.icon} className="eci-icon--emerald" />
                        <div className="eci-fest-min-w">
                          <div className="eci-fest-type">
                            <span>𓊹 Festival Civil</span>
                            <span className="eci-fest-type-fixed">· Fijo</span>
                          </div>
                          <div className="eci-fest-name-sm">{f.name}</div>
                          <p className="eci-fest-desc-sm">{f.description}</p>
                        </div>
                      </div>
                    ))}
                    {lunarFestivals.map((f, i) => (
                      <div key={`lun-ephem-${i}`} className="eci-lunar-fest-item">
                        <FestivalIcon name={f.icon} className="eci-icon--amber" />
                        <div className="eci-fest-min-w">
                          <div className="eci-fest-type">
                            <span>𓊹 Festival Lunar</span>
                            <span className="eci-fest-type-fixed">· Día {lunarDay}</span>
                          </div>
                          <div className="eci-fest-name-sm">{f.name}</div>
                          <p className="eci-fest-desc-sm">{f.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* ── Deity card (always shown) ──────────────────────────────── */}
            <div className="eci-deity-card">
              <div className="eci-deity-label">
                {egyptianDate.isEpagomenal ? '— Madre Celeste —' : labels.godOfDayTitle}
              </div>
              <div className="eci-deity-glyph">𓊹</div>
              <h2 className="eci-deity-name">{deity.name}</h2>
              <div className="eci-deity-title">{deity.title}</div>
              <p className="eci-deity-quote">
                {'"'}
                {deity.description}
                {'"'}
              </p>
            </div>

            {/* EPAGOMENAL highlight (shown instead of view toggle) */}
            {egyptianDate.isEpagomenal && epagomenalInfo && (
              <div className="eci-epa-highlight">
                <div className="eci-epa-title">𓊹 Celebración Epagómenal 𓊹</div>
                <h2 className="eci-epa-celebration">{epagomenalInfo.celebration}</h2>
                <p className="eci-epa-deity-line">
                  {epagomenalInfo.deity} — {epagomenalInfo.domain}
                </p>
                <p className="eci-epa-desc">
                  {'"'}
                  {epagomenalInfo.description}
                  {'"'}
                </p>
                {CIVIL_FESTIVALS[`e-${egyptianDate.dayOfMonth}`]?.fonte && (
                  <FestivalFontePanel
                    fonte={CIVIL_FESTIVALS[`e-${egyptianDate.dayOfMonth}`]!.fonte!}
                  />
                )}
              </div>
            )}

            {/* View toggle (regular months only) */}
            {!egyptianDate.isEpagomenal && (
              <div className="eci-view-toggle">
                {(['calendar', 'rites'] as ViewMode[]).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setView(v);
                    }}
                    className={`eci-view-btn ${
                      view === v ? 'eci-view-btn--active' : 'eci-view-btn--inactive'
                    }`}
                  >
                    {v === 'calendar' ? '☽ Calendario' : '𓊹 Ritos del Día'}
                  </button>
                ))}
              </div>
            )}

            {/* ═══ CALENDAR VIEW ═══ */}
            {(view === 'calendar' || egyptianDate.isEpagomenal) &&
              !egyptianDate.isEpagomenal && (
                <div className="eci-calendar-view">
                  {/* Decade grid */}
                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    <SectionHeader>Las Tres Décadas del Mes</SectionHeader>
                    <div style={{ marginTop: '0.75rem' }}>
                      <DecadeGrid
                        egyptianDate={egyptianDate}
                        onShowFestivals={() => setShowFestivals(true)}
                      />
                    </div>
                  </div>

                  {/* Nilometer */}
                  <div className="eci-nilometer-sep">
                    <Nilometer
                      monthIndex={egyptianDate.monthIndex}
                      seasonName={egyptianDate.seasonName}
                    />
                  </div>

                  {/* Sopdet */}
                  {sopdet &&
                    // eslint-disable-next-line sonarjs/cognitive-complexity
                    (() => {
                      const dateStr = sopdet.rising.toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                      });
                      const fmtTime = (d: Date | null) =>
                        d
                          ? d.toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })
                          : '—';

                      const SopdetExpandedPanel = () => {
                        if (!sopdetExpanded || !sopdetDaily) return null;
                        const {
                          riseTime,
                          transitTime,
                          setTime,
                          elongation,
                          altitudeAtMidnight,
                        } = sopdetDaily;
                        return (
                          <div className="eci-sopdet-expanded">
                            <div className="eci-time-grid">
                              {(
                                [
                                  { label: 'Salida', value: fmtTime(riseTime) },
                                  { label: 'Cenit', value: fmtTime(transitTime) },
                                  { label: 'Ocaso', value: fmtTime(setTime) },
                                ] as const
                              ).map(({ label, value }) => (
                                <div key={label} className="eci-time-cell">
                                  <p className="eci-time-label">{label}</p>
                                  <p className="eci-time-value">{value}</p>
                                </div>
                              ))}
                            </div>
                            <div className="eci-elong-row">
                              <div className="eci-bar-header">
                                <span className="eci-bar-label">Elongación del Sol</span>
                                <span className="eci-bar-value">{elongation.toFixed(1)}°</span>
                              </div>
                              <div className="eci-bar-track">
                                <div
                                  className="eci-bar-fill"
                                  style={{
                                    width: `${(elongation / 180) * 100}%`,
                                    background:
                                      elongation < 17
                                        ? 'rgba(148,163,184,0.45)'
                                        : 'rgba(110,200,130,0.65)',
                                  }}
                                />
                              </div>
                              <p className="eci-bar-hint">
                                {elongation < 17
                                  ? 'Sumergida en el resplandor solar (umbral helíaco 17°)'
                                  : `${elongation.toFixed(
                                      0,
                                    )}° del Sol · separada del resplandor solar`}
                              </p>
                            </div>
                            <div className="eci-alt-row">
                              <span className="eci-bar-label">Altitud a medianoche</span>
                              <span
                                className={
                                  altitudeAtMidnight >= 0 ? 'eci-alt-visible' : 'eci-alt-hidden'
                                }
                              >
                                {altitudeAtMidnight >= 0 ? '+' : ''}
                                {altitudeAtMidnight.toFixed(1)}°
                              </span>
                            </div>
                            {altitudeAtMidnight < 0 && (
                              <p className="eci-alt-hint">Bajo el horizonte esta noche</p>
                            )}
                          </div>
                        );
                      };

                      if (sopdet.phase === 'invisible') {
                        const daysUntil = -sopdet.daysSinceRising;
                        return (
                          <div className="eci-sopdet-sep">
                            <button
                              className="eci-sopdet-btn eci-sopdet-btn--invisible"
                              onClick={() => setSopdetExpanded(v => !v)}
                            >
                              <span className="eci-sopdet-icon--invisible">✦</span>
                              <div className="eci-sopdet-flex">
                                <div className="eci-sopdet-title-row">
                                  <p className="eci-sopdet-title--invisible">
                                    Sopdet (Sirio) — invisible
                                  </p>
                                  <span className="eci-sopdet-chevron">
                                    {sopdetExpanded ? '▴' : '▾'}
                                  </span>
                                </div>
                                <p className="eci-sopdet-desc">
                                  Oculta en el resplandor solar.{' '}
                                  <strong style={{ color: '#a5b4fc' }}>Peret Sopdet</strong> en{' '}
                                  {daysUntil} día{daysUntil !== 1 ? 's' : ''} ({dateStr}).
                                </p>
                                <SopdetExpandedPanel />
                              </div>
                            </button>
                          </div>
                        );
                      }
                      const days = sopdet.daysSinceRising;
                      if (days === 0)
                        return (
                          <div className="eci-sopdet-sep">
                            <button
                              className="eci-sopdet-btn eci-sopdet-btn--rising animate-pulse"
                              onClick={() => setSopdetExpanded(v => !v)}
                            >
                              <span className="eci-sopdet-icon--rising">✦</span>
                              <div className="eci-sopdet-flex">
                                <div className="eci-sopdet-title-row">
                                  <p className="eci-sopdet-title--rising">
                                    ¡Peret Sopdet! — Salida helíaca de Sopdet
                                  </p>
                                  <span className="eci-sopdet-chevron">
                                    {sopdetExpanded ? '▴' : '▾'}
                                  </span>
                                </div>
                                <p
                                  className="eci-sopdet-desc"
                                  style={{
                                    color:
                                      'color-mix(in srgb, var(--parchment) 90%, transparent)',
                                  }}
                                >
                                  Hoy Sopdet (Sirio) vuelve a aparecer antes del amanecer.
                                  Anuncia la crecida del Nilo y el inicio del Año Nuevo egipcio.
                                </p>
                                <SopdetExpandedPanel />
                              </div>
                            </button>
                          </div>
                        );
                      return (
                        <div className="eci-sopdet-sep">
                          <button
                            className="eci-sopdet-btn eci-sopdet-btn--visible"
                            onClick={() => setSopdetExpanded(v => !v)}
                          >
                            <span className="eci-sopdet-icon--visible">✦</span>
                            <div className="eci-sopdet-flex">
                              <div className="eci-sopdet-title-row">
                                <p className="eci-sopdet-title--visible">
                                  Sopdet (Sirio) — visible
                                </p>
                                <span className="eci-sopdet-chevron">
                                  {sopdetExpanded ? '▴' : '▾'}
                                </span>
                              </div>
                              <p className="eci-sopdet-desc">
                                Día <strong style={{ color: '#6ee7b7' }}>{days}</strong> desde{' '}
                                <strong style={{ color: '#6ee7b7' }}>Peret Sopdet</strong> (
                                {dateStr}). La diosa custodia la crecida del Nilo.
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
              <div className="eci-rites-view">
                {/* Hemerology */}
                <div>
                  <SectionHeader>Pronóstico del Día · Hemerología</SectionHeader>
                  <div className="eci-heme-row">
                    <PrognosisCard title="Mañana" prognosis={hemerology.morning} />
                    <PrognosisCard title="Mediodía" prognosis={hemerology.midday} />
                    <PrognosisCard title="Tarde" prognosis={hemerology.evening} />
                  </div>
                  {hemerology.instruction && (
                    <div className="eci-heme-instruction">
                      <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>👁️</span>
                      <p className="eci-heme-instruction-text">{hemerology.instruction}</p>
                    </div>
                  )}

                  {/* Ojo de Horus / Algol */}
                  <div
                    className="eci-algol-panel"
                    style={{
                      background: algol.isEclipsed
                        ? 'rgba(80,10,10,0.30)'
                        : 'rgba(40,10,10,0.20)',
                      borderColor: algol.isEclipsed
                        ? 'rgba(192,57,26,0.50)'
                        : 'rgba(192,57,26,0.25)',
                    }}
                  >
                    {/* Header row — tap to expand */}
                    <button
                      type="button"
                      className="eci-algol-toggle"
                      onClick={() => setAlgolExpanded(v => !v)}
                    >
                      <span
                        className={`eci-algol-icon${algol.isEclipsed ? ' animate-pulse' : ''}`}
                      >
                        👁️
                      </span>
                      <div className="eci-algol-flex">
                        <p className="eci-algol-title">
                          Ojo de Horus · Algol {algol.isEclipsed ? '— ¡En Eclipse!' : ''}
                        </p>
                        <p className="eci-algol-state">{algol.stateText}</p>
                      </div>
                      <span className="eci-algol-chevron">{algolExpanded ? '▴' : '▾'}</span>
                    </button>

                    {/* Expanded panel */}
                    {algolExpanded &&
                      algolDaily &&
                      // eslint-disable-next-line sonarjs/cognitive-complexity
                      (() => {
                        const {
                          phase,
                          nextMinimumInHours,
                          lastMinimumAgoHours,
                          estimatedMagnitude,
                          isEclipsing,
                          periodDays,
                          riseTime,
                          setTime,
                          transitTime,
                          altitudeAtMidnight,
                        } = algolDaily;

                        // eslint-disable-next-line sonarjs/no-identical-functions
                        const fmtTime = (d: Date | null) =>
                          d
                            ? d.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })
                            : '—';
                        const fmtHours = (h: number) => {
                          const hh = Math.floor(h);
                          const mm = Math.round((h - hh) * 60);
                          return `${hh}h ${mm.toString().padStart(2, '0')}m`;
                        };

                        const phaseBarPct = (phase * 100).toFixed(0);
                        const magFraction = (estimatedMagnitude - 2.1) / 1.3; // 0 = bright, 1 = dim

                        return (
                          <div className="eci-algol-expanded">
                            {/* Rise / Transit / Set */}
                            <div className="eci-time-grid">
                              {(
                                [
                                  { label: 'Salida', value: fmtTime(riseTime) },
                                  { label: 'Cenit', value: fmtTime(transitTime) },
                                  { label: 'Ocaso', value: fmtTime(setTime) },
                                ] as const
                              ).map(({ label, value }) => (
                                <div key={label} className="eci-time-cell">
                                  <p className="eci-time-label">{label}</p>
                                  <p className="eci-time-value">{value}</p>
                                </div>
                              ))}
                            </div>
                            <div className="eci-algol-alt-row">
                              <span className="eci-bar-label">Altitud a medianoche</span>
                              <span
                                className={
                                  altitudeAtMidnight >= 0
                                    ? 'eci-algol-alt-visible'
                                    : 'eci-algol-alt-hidden'
                                }
                              >
                                {altitudeAtMidnight >= 0 ? '+' : ''}
                                {altitudeAtMidnight.toFixed(1)}°
                              </span>
                            </div>
                            {/* Cycle progress */}
                            <div className="eci-elong-row">
                              <div className="eci-bar-header">
                                <span className="eci-bar-label">
                                  Fase en ciclo ({periodDays.toFixed(3)}d)
                                </span>
                                <span className="eci-bar-value">{phaseBarPct}%</span>
                              </div>
                              <div className="eci-cycle-track">
                                <div
                                  className="eci-bar-fill"
                                  style={{
                                    width: `${phaseBarPct}%`,
                                    background: isEclipsing
                                      ? 'rgba(192,57,26,0.75)'
                                      : 'rgba(212,168,50,0.55)',
                                  }}
                                />
                                <div className="eci-cycle-marker eci-cycle-marker--left" />
                                <div className="eci-cycle-marker eci-cycle-marker--right" />
                              </div>
                              <div className="eci-cycle-minima">
                                <span className="eci-cycle-min-label">mínimo</span>
                                <span className="eci-cycle-min-label">mínimo</span>
                              </div>
                            </div>

                            {/* Next / last minimum */}
                            <div className="eci-minima-grid">
                              <div className="eci-minima-cell">
                                <p className="eci-minima-cell-label">Último mínimo</p>
                                <p className="eci-minima-cell-value">
                                  hace {fmtHours(lastMinimumAgoHours)}
                                </p>
                              </div>
                              <div className="eci-minima-cell">
                                <p className="eci-minima-cell-label">Próximo mínimo</p>
                                <p
                                  className={`eci-minima-cell-value${
                                    nextMinimumInHours < 6
                                      ? ' eci-minima-cell-value--urgent'
                                      : ''
                                  }`}
                                >
                                  en {fmtHours(nextMinimumInHours)}
                                </p>
                              </div>
                            </div>

                            {/* Estimated magnitude bar */}
                            <div className="eci-elong-row">
                              <div className="eci-bar-header">
                                <span className="eci-bar-label">Magnitud estimada</span>
                                <span
                                  className="eci-bar-value"
                                  style={{
                                    color: isEclipsing
                                      ? 'rgb(248 113 113 / 80%)'
                                      : 'rgb(252 211 77 / 80%)',
                                  }}
                                >
                                  {estimatedMagnitude.toFixed(2)}
                                </span>
                              </div>
                              <div className="eci-bar-track">
                                <div
                                  className="eci-bar-fill"
                                  style={{
                                    width: `${magFraction * 100}%`,
                                    background: isEclipsing
                                      ? 'rgba(192,57,26,0.70)'
                                      : 'rgba(212,168,50,0.40)',
                                  }}
                                />
                              </div>
                              <div className="eci-mag-label-row">
                                <span className="eci-mag-label-bright">2.1 brillante</span>
                                <span className="eci-mag-label-dim">3.4 opaco</span>
                              </div>
                            </div>

                            {/* Link to modal */}
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setIsHorusOpen(true);
                              }}
                              className="eci-algol-modal-btn"
                            >
                              <span className="eci-algol-modal-label">
                                Ver eclipses y días excepcionales
                              </span>
                              <span className="eci-algol-modal-arrow">›</span>
                            </button>
                          </div>
                        );
                      })()}
                  </div>
                </div>

                {/* Astronomical alerts */}
                {hasAstroAlerts && (
                  <div className="eci-astro-sep">
                    <SectionHeader>Influencias Astronómicas</SectionHeader>
                    <div className="eci-astro-list">
                      {moonPhase >= 0.45 && moonPhase <= 0.55 && (
                        <div className="eci-astro-item eci-astro-item--moon">
                          <span className="eci-astro-icon">🌕</span>
                          <p className="eci-astro-text">
                            Ventana de Plenilunio: Día propicio para la entronización del Toro
                            Apis en Menfis.
                          </p>
                        </div>
                      )}
                      {algol.isEclipsed && (
                        <div className="eci-astro-item eci-astro-item--algol">
                          <span className="eci-astro-icon animate-pulse">✨</span>
                          <p className="eci-astro-text eci-astro-text--algol">
                            ¡Algol (El Ojo de Horus) está en eclipse hoy! Las fuerzas del Caos
                            acechan.
                          </p>
                        </div>
                      )}
                      {isNewMoon && (
                        <div className="eci-astro-item eci-astro-item--newmoon">
                          <span className="eci-astro-icon">🌑</span>
                          <p className="eci-astro-text eci-astro-text--newmoon">
                            Noche de Estirar la Cuerda (Pedj-Shes). Seshat guía a los
                            arquitectos alineando los templos con las estrellas imperecederas.
                          </p>
                        </div>
                      )}
                      {isFullMoon && (
                        <div className="eci-astro-item eci-astro-item--fullmoon">
                          <span className="eci-astro-icon">🌕</span>
                          <p className="eci-astro-text eci-astro-text--fullmoon">
                            Plenilunio sagrado. Las fuerzas lunares de Khonsu iluminan el cielo
                            de Kemet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Festivals */}
                {(civilFestivals.length > 0 || lunarFestivals.length > 0) && (
                  <div className="eci-festivals-sep">
                    <SectionHeader>Festividades del Día</SectionHeader>
                    <div className="eci-festivals-list">
                      {civilFestivals.map((f, i) => (
                        <div key={`civil-${i}`} className="eci-civil-fest-card">
                          <div className="eci-fest-card-type">
                            <span>𓊹 Festival Civil 𓊹</span>
                            <span className="eci-fest-card-fixed">Fijo</span>
                          </div>
                          <div className="eci-fest-card-name">
                            <FestivalIcon name={f.icon} className="eci-icon--emerald" />
                            <span>{f.name}</span>
                          </div>
                          <p className="eci-fest-card-desc">{f.description}</p>
                          {f.fonte && <FestivalFontePanel fonte={f.fonte} />}
                        </div>
                      ))}
                      {lunarFestivals.map((f, i) => (
                        <div key={`lunar-${i}`} className="eci-lunar-fest-card">
                          <div className="eci-fest-card-type">
                            <span>𓊹 Festival Lunar 𓊹</span>
                            <span className="eci-fest-card-fixed">Día {lunarDay}</span>
                          </div>
                          <div className="eci-fest-card-name">
                            <FestivalIcon name={f.icon} className="eci-icon--amber" />
                            <span>{f.name}</span>
                          </div>
                          <p className="eci-fest-card-desc">{f.description}</p>
                          {f.fonte && <FestivalFontePanel fonte={f.fonte} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Hall of Maāti button ──────────────────────────────────────── */}
          <button onClick={() => setShowMaati(true)} className="eci-maati-btn">
            <span>𓀗</span>
            <span>Sala de la Doble Maāti · 42 Evaluadores</span>
            <span>𓀗</span>
          </button>

          <LotusFreizeBorder id="lotus-btm" />
        </div>
      </div>

      {/* ── Hall of Maāti Modal ──────────────────────────────────────────── */}
      {showMaati && (
        <div
          className="eci-modal-backdrop animate-fadeIn"
          style={{ background: 'rgba(12,8,4,0.90)' }}
          role="button"
          tabIndex={0}
          onClick={() => setShowMaati(false)}
          onKeyDown={e => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setShowMaati(false);
          }}
        >
          <div
            className="eci-modal-maati"
            role="presentation"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="eci-modal-header">
              <div className="eci-modal-glyph">𓀗 𓇋𓄿𓄿𓏏 𓀗</div>
              <h2 className="eci-modal-title">Sala de la Doble Maāti</h2>
              <p className="eci-modal-subtitle">
                42 Evaluadores · Confesión Negativa · Capítulo CXXV
              </p>
              <p className="eci-modal-papyrus">
                Papiro de Nebseni (BM 9,900) · Recensión Tebana
              </p>
            </div>

            {/* Preamble */}
            <div className="eci-modal-preamble">
              <p className="eci-modal-preamble-text">
                «Heme aquí; vengo a ti, mi Señor; me he traído a mí mismo para que pueda ver tus
                bellezas. Te conozco, y conozco tu nombre, y los nombres de los cuarenta y dos
                dioses que viven contigo en esta Sala de la Doble Maāti.»
              </p>
            </div>

            {/* Assessors list */}
            <div className="eci-modal-body">
              <div className="maati-list">
                {HALL_OF_MAATI.map(a => (
                  <div key={a.num} className="maati-assessor-row">
                    <div className="maati-num">{a.num}</div>
                    <div className="maati-content">
                      <div className="maati-desc">{a.description}</div>
                      <div className="maati-origin">{a.origin}</div>
                      <div className="maati-sin">{a.sinDenied}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <button className="eci-modal-footer-btn" onClick={() => setShowMaati(false)}>
              Cerrar la Sala
            </button>
          </div>
        </div>
      )}

      {/* ── Next Festivals Modal ──────────────────────────────────────────── */}
      {showFestivals && (
        <div
          className="eci-modal-backdrop animate-fadeIn"
          style={{ background: 'rgba(12,8,4,0.85)' }}
          role="button"
          tabIndex={0}
          onClick={() => setShowFestivals(false)}
          onKeyDown={e => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')
              setShowFestivals(false);
          }}
        >
          <div
            className="eci-modal-festivals"
            role="presentation"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="eci-modal-header--festivals">
              <div className="eci-modal-glyph--lg">𓊹</div>
              <h2 className="eci-modal-title--festivals">Próximos Festivales</h2>
              <p className="eci-modal-subtitle--festivals">Calendario Sagrado de Kemet</p>
            </div>

            {/* List */}
            <div className="eci-modal-body--festivals">
              {getNextEgyptianFestivals(
                egyptianDate.monthIndex,
                egyptianDate.dayOfMonth,
                3,
              ).map((f, i) => (
                <div key={i}>
                  <div className="festival-entry-header">
                    <div className="festival-entry-name-col">
                      <h4 className="festival-entry-name">
                        <FestivalIcon name={f.icon} className="eci-icon--emerald" />
                        <span>{f.name}</span>
                      </h4>
                      <span className="festival-entry-date">{f.date}</span>
                    </div>
                    <div className="festival-entry-days">
                      <div className="festival-days-num">{f.daysRemaining}</div>
                      <div className="festival-days-label">días</div>
                    </div>
                  </div>
                  <p className="festival-entry-desc">{f.description}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <button
              className="eci-modal-footer-btn--festivals"
              onClick={() => setShowFestivals(false)}
            >
              Cerrar Rollo Sagrado
            </button>

            <div className="festivals-corner festivals-corner--tl">𓋹</div>
            <div className="festivals-corner festivals-corner--tr">𓋹</div>
            <div className="festivals-corner festivals-corner--bl">𓋹</div>
            <div className="festivals-corner festivals-corner--br">𓋹</div>
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

import React, { useState, useEffect, useMemo } from 'react';
import './HellenicCalendarInfo.css';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import {
  getAtticFestivalInfo,
  getDailyAtticDeity,
  getDefaultAtticDeity,
  AtticFestivalInfo,
  checkApaphrades,
  getCategoryBadge,
  getNextAtticFestivals,
} from '../utils/atticCalendarData';
import GreekDaysList from './GreekDaysList';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';
import { generateGreekSkyline } from '../utils/greekSkylineGenerator';
import { getSunTimes, getMoonPosition, getMoonPhase } from '../utils/solar';
import { WeatherData } from '../types';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';

// ─── Greek meander frieze ─────────────────────────────────────────────────────

const MEANDER_URI = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="707 2266 19535 8465">' +
    '<rect x="707" y="2266" width="19535" height="8465" fill="#0d0e1a"/>' +
    '<g fill="#3a7898" stroke="none">' +
    '<polygon points="706 2726 14658 2726 14658 2261 706 2261" transform="matrix(1.4001 0 0 1.4001 -280.96 -899.66)"/>' +
    '<polygon points="2566 3657 2566 5982 1171 5982 1171 5517 2101 5517 2101 4122 706 4122 706 4587 1636 4587 1636 5052 706 5052 706 6447 3031 6447 3031 3191 706 3191 706 3657" transform="matrix(1.4001 0 0 1.4001 -280.96 -899.66)"/>' +
    '<polygon points="3962 7377 3962 3657 7217 3657 7217 5982 5822 5982 5822 5517 6752 5517 6752 4122 4427 4122 4427 7377 8612 7377 8612 3657 11867 3657 11867 5982 10472 5982 10472 5517 11402 5517 11402 4122 9077 4122 9077 7377 13262 7377 13262 3657 14658 3657 14658 3191 12797 3191 12797 6912 9542 6912 9542 4587 10937 4587 10937 5052 10007 5052 10007 6447 12332 6447 12332 3191 8147 3191 8147 6912 4892 6912 4892 4587 6287 4587 6287 5052 5357 5052 5357 6447 7682 6447 7682 3191 3496 3191 3496 6912 706 6912 706 7377" transform="matrix(1.4001 0 0 1.4001 -280.96 -899.66)"/>' +
    '<polygon points="14192 6912 14192 4587 14658 4587 14658 4122 13727 4122 13727 7377 14658 7377 14658 6912" transform="matrix(1.4001 0 0 1.4001 -280.96 -899.66)"/>' +
    '<polygon points="14658 7842 706 7842 706 8307 14658 8307" transform="matrix(1.4001 0 0 1.4001 -280.96 -899.66)"/>' +
    '</g></svg>',
)}`;

const GreekMeanderBorder: React.FC = () => (
  <div
    className="hel-meander-border"
    style={{
      backgroundImage: `url("${MEANDER_URI}")`,
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'repeat-x',
    }}
  />
);

// ─── Hoplite silhouette (black-figure style) ──────────────────────────────────
// Local coords: feet on y=0, facing +x, crest top ≈ -111, spear tip ≈ -150.
// The aspis is drawn as a full circle, as on Attic black-figure vases; the
// incised details (rim, lambda, greaves) are thin strokes over the silhouette.

const Hoplite: React.FC<{ fill: string; stroke: string; transform: string }> = ({
  fill,
  stroke,
  transform,
}) => (
  <g transform={transform} fill={fill} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round">
    {/* Dory (spear) behind the body, with leaf head and sauroter */}
    <path d="M -16.9 1 L -15.1 1 L -4.2 -137 L -6 -137 Z" />
    <path d="M -6.2 -136 Q -8.2 -142 -3.9 -151 Q -1.6 -142 -4 -136 Z" />
    <path d="M -17.2 1 L -14.8 1 L -15.8 5 Z" />

    {/* Chlamys (cloak) flowing behind */}
    <path d="M -6 -80 C -14 -78 -18 -66 -20 -56 C -22 -48 -25 -42 -29 -35 Q -24 -36 -22 -33 Q -19 -37 -15 -35 Q -12 -39 -9 -39 L -9 -60 Z" />

    {/* Legs with greaves */}
    <path d="M -8 -44 L -1 -44 L -4 -25 Q -5 -18 -8 -10 L -8 -3 L -2 -1 L -2 0 L -14 0 L -13 -3 Q -16 -12 -12 -25 Z" />
    <path d="M 1 -44 L 8 -44 Q 13 -34 13 -25 Q 12 -14 13 -4 L 20 -1 L 20 0 L 9 0 L 9 -5 Q 4 -15 6 -25 Q 4 -34 1 -44 Z" />

    {/* Torso and pteryges (tasselled skirt) */}
    <path d="M -10 -56 L 10 -56 L 9 -77 Q 0 -81 -9 -77 Z" />
    <path d="M -11 -56 L 11 -56 L 13 -40 L 11 -37.5 L 9 -40 L 7 -37.5 L 5 -40 L 3 -37.5 L 1 -40 L -1 -37.5 L -3 -40 L -5 -37.5 L -7 -40 L -9 -37.5 L -11 -40 L -13 -37.5 Z" />

    {/* Neck */}
    <path d="M 2 -83 L 8 -83 L 8 -76 L 2 -76 Z" />

    {/* Crest on its stalk */}
    <path d="M 2 -96 L 5 -96 L 5 -102 L 2 -102 Z" />
    <path d="M 13 -100 C 6 -103 -4 -103 -10 -97 C -12 -94 -14 -90 -15 -85 C -19 -93 -18 -104 -9 -109 C -1 -112 9 -110 14 -103 Z" />

    {/* Corinthian helmet; the eye slit is a hole (evenodd) */}
    <path
      fillRule="evenodd"
      d="M -3 -80 Q -5 -86 -3 -91 Q 1 -98 8 -97 Q 14 -96 14 -90 L 15 -86 L 13 -85 Q 14 -81 11 -78 L 6 -79 L 4 -84 L 1 -81 Z
         M 8 -90.5 L 13 -90.5 L 13 -89 L 8.5 -88.8 Z"
    />

    {/* Aspis */}
    <circle cx="7" cy="-60" r="21" />

    {/* Incised details */}
    <g fill="none" strokeWidth="0.6" opacity="0.8">
      <circle cx="7" cy="-60" r="17.5" />
      <path d="M -1 -48 L 7 -71 L 15 -48" strokeWidth="1.1" />
      <path d="M -12 -24 Q -8 -22 -4 -24" />
      <path d="M 6 -25 Q 10 -23 13 -25" />
      <path d="M 11 -101.5 C 4 -104 -5 -103 -11 -98" />
    </g>
  </g>
);

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
  const litColor = `rgba(125,211,252,${alpha})`;
  const darkColor = `rgba(12,22,64,${bgAlpha})`;

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
  const waxingInner = termRx > 0 ? 0 : 1;
  const waningInner = termRx > 0 ? 1 : 0;
  const innerSweep = isWaxing ? waxingInner : waningInner;

  const d = `M ${cx} ${topY} A ${r} ${r} 0 0 ${outerSweep} ${cx} ${botY} A ${absTerm} ${r} 0 0 ${innerSweep} ${cx} ${topY} Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />
      <path d={d} fill={litColor} />
    </svg>
  );
};

// ─── Panel moon icon ──────────────────────────────────────────────────────────

const PanelMoonSvg: React.FC<{ type: 'waxing' | 'full' | 'waning'; active: boolean }> = ({
  type,
  active,
}) => {
  const cls = `hel-panel-moon-icon${
    active ? ' hel-panel-moon-icon--active' : ' hel-panel-moon-icon--inactive'
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

// ─── Day grid ─────────────────────────────────────────────────────────────────

const DayGrid: React.FC<{
  today: number;
  monthLen: number;
  monthIndex: number;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}> = ({ today, monthLen, monthIndex }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const panels: Array<{
    days: number[];
    moonType: 'waxing' | 'full' | 'waning';
    title: string;
    subtitle: string;
  }> = [
    {
      days: Array.from({ length: 10 }, (_, i) => i + 1),
      moonType: 'waxing',
      title: 'Ἱστάμενος',
      subtitle: 'Creciente',
    },
    {
      days: Array.from({ length: 10 }, (_, i) => i + 11),
      moonType: 'full',
      title: 'Μεσῶν',
      subtitle: 'Plena',
    },
    {
      days: Array.from({ length: monthLen - 20 }, (_, i) => i + 21),
      moonType: 'waning',
      title: 'Φθίνων',
      subtitle: 'Menguante',
    },
  ];

  let activePanel = 0;
  if (today >= 21) activePanel = 2;
  else if (today >= 11) activePanel = 1;

  const selFest = selectedDay !== null ? getAtticFestivalInfo(monthIndex, selectedDay) : null;
  const selHoly = selectedDay !== null ? getDailyAtticDeity(selectedDay, monthLen) : null;

  const hasSelection = selectedDay !== null && (selFest || selHoly);

  let infoPanelMod = 'hel-info-panel--empty';
  if (hasSelection && selFest) infoPanelMod = 'hel-info-panel--festival';
  else if (hasSelection) infoPanelMod = 'hel-info-panel--holy';

  return (
    <div>
      <div className="hel-panels-row">
        {panels.map(({ days, moonType, title, subtitle }) => {
          let panelIdx = 0;
          if (moonType === 'full') panelIdx = 1;
          else if (moonType === 'waning') panelIdx = 2;
          const active = panelIdx === activePanel;

          return (
            <div
              key={moonType}
              className={`hel-panel ${active ? 'hel-panel--active' : 'hel-panel--inactive'}`}
            >
              {active && <div className="hel-panel-glow" />}

              <div className="hel-panel-header">
                <PanelMoonSvg type={moonType} active={active} />
                <h4
                  className={`hel-panel-title ${
                    active ? 'hel-panel-title--active' : 'hel-panel-title--inactive'
                  }`}
                >
                  {title}
                </h4>
                <div className="hel-panel-subtitle">{subtitle}</div>
              </div>

              <div className="hel-day-cells">
                {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
                {days.map(day => {
                  const isToday = day === today;
                  const isPast = day < today;
                  const isSelected = day === selectedDay;
                  const hasFest = getAtticFestivalInfo(monthIndex, day) !== null;
                  const hasHoly = getDailyAtticDeity(day, monthLen) !== null;

                  let stateClass = 'hel-day-btn--plain';
                  if (isSelected) stateClass = 'hel-day-btn--selected';
                  else if (isToday) stateClass = 'hel-day-btn--today';
                  else if (hasFest && !isPast) stateClass = 'hel-day-btn--festival-upcoming';
                  else if (hasFest && isPast) stateClass = 'hel-day-btn--festival-past';
                  else if (hasHoly && !isPast) stateClass = 'hel-day-btn--holy-upcoming';
                  else if (hasHoly && isPast) stateClass = 'hel-day-btn--holy-past';

                  let numStateClass = 'hel-day-num--default';
                  if (isSelected) numStateClass = 'hel-day-num--selected';
                  else if (isToday) numStateClass = 'hel-day-num--today';
                  else if (isPast) numStateClass = 'hel-day-num--past';

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`hel-day-btn ${stateClass}`}
                      onClick={() => setSelectedDay(prev => (prev === day ? null : day))}
                    >
                      <TinyMoon
                        phase={(day - 1) / monthLen}
                        size={11}
                        dim={isPast && !isToday}
                      />
                      <span className={`hel-day-num ${numStateClass}`}>{day}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info panel */}
      <div className={`hel-info-panel ${infoPanelMod}`}>
        {(() => {
          if (!hasSelection) {
            if (selectedDay !== null)
              return (
                <p className="hel-info-panel-empty-msg">
                  Sin celebración registrada para este día.
                </p>
              );
            return (
              <p className="hel-info-panel-empty-msg">Toca un día para ver su significado</p>
            );
          }
          return (
            <div className="hel-info-panel-content animate-fadeIn">
              <div className="hel-info-panel-row">
                <span className="hel-info-panel-day-label">Ἡμέρα {selectedDay}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="hel-info-panel-close"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
              {selFest ? (
                <div>
                  <span className="hel-info-panel-fest-name">{selFest.festivalName}</span>
                  {selFest.festivalDayName && (
                    <span className="hel-info-panel-fest-day-name">
                      {selFest.festivalDayName}
                    </span>
                  )}
                  <p className="hel-info-panel-fest-desc">{selFest.festivalDesc}</p>
                  {selFest.deity && (
                    <span className="hel-info-panel-deity">Deidad: {selFest.deity}</span>
                  )}
                </div>
              ) : (
                <div>
                  <span className="hel-info-panel-holy-name">{selHoly!.festivalName}</span>
                  <span className="hel-info-panel-holy-also">Día Sagrado</span>
                  <p className="hel-info-panel-fest-desc">{selHoly!.festivalDesc}</p>
                  {selHoly!.deity && (
                    <span className="hel-info-panel-deity">Deidad: {selHoly!.deity}</span>
                  )}
                </div>
              )}
              {selFest && selHoly && (
                <span className="hel-info-panel-also">
                  También hoy: {selHoly.festivalName} — {selHoly.deity}
                </span>
              )}
            </div>
          );
        })()}
      </div>

      {/* Legend */}
      <div className="hel-legend">
        {(
          [
            { mod: 'hel-swatch--today', label: 'Hoy' },
            { mod: 'hel-swatch--festival', label: 'Festival' },
            { mod: 'hel-swatch--holy', label: 'Día Sagrado' },
          ] as { mod: string; label: string }[]
        ).map(({ mod, label }) => (
          <div key={label} className="hel-legend-item">
            <span className={`hel-swatch ${mod}`} />
            <span className="hel-legend-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface HellenicCalendarInfoProps {
  atticDate?: AtticDateResult;
  weather?: WeatherData | null;
  currentLat?: number;
  currentLng?: number;
  currentDate?: Date;
}

type ViewMode = 'month' | 'festivals' | 'days';
const VIEW_LABELS: Record<ViewMode, string> = {
  month: '☽ Mes',
  festivals: '🏛️ Fiestas',
  days: '🕯️ 7 Ἡμέρες',
};

const DECADE_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Ἱστάμενος', subtitle: 'Creciente' },
  2: { title: 'Μεσῶν', subtitle: 'Plena' },
  3: { title: 'Φθίνων', subtitle: 'Menguante' },
};

// ─── Sky moon renderer (Selene) ───────────────────────────────────────────────

const renderSeleneMoon = (phase: number) => {
  const r = 14;
  const normalizedPhase = ((phase % 1) + 1) % 1;
  const isWaxing = normalizedPhase <= 0.5;
  const sweep1 = isWaxing ? 1 : 0;
  const rx = Math.max(0.1, r * Math.abs(Math.cos(normalizedPhase * Math.PI * 2)));
  const sweep2 =
    (normalizedPhase > 0.25 && normalizedPhase <= 0.5) || normalizedPhase > 0.75 ? 1 : 0;
  const d = `M 0 -${r} A ${r} ${r} 0 0 ${sweep1} 0 ${r} A ${rx} ${r} 0 0 ${sweep2} 0 -${r} Z`;
  const maskId = `hel-moon-mask-${normalizedPhase.toFixed(3)}`;
  return (
    <g transform="rotate(-15)">
      <defs>
        <clipPath id={maskId}>
          <path d={d} />
        </clipPath>
        <radialGradient id="hel-moon-light" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e0ecff" />
          <stop offset="100%" stopColor="#bdd4f4" />
        </radialGradient>
        <radialGradient id="hel-moon-dark" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#0d1a2e" />
          <stop offset="100%" stopColor="#060d18" />
        </radialGradient>
        <filter id="hel-moon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="0" cy="0" r={r + 4} fill="rgba(200,225,255,0.06)" />
      <circle cx="0" cy="0" r={r} fill="url(#hel-moon-dark)" />
      <g clipPath={`url(#${maskId})`} filter="url(#hel-moon-glow)">
        <circle cx="0" cy="0" r={r} fill="url(#hel-moon-light)" />
      </g>
      <circle
        cx="0"
        cy="0"
        r={r}
        fill="none"
        stroke="rgba(200,225,255,0.4)"
        strokeWidth="0.5"
      />
    </g>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const HellenicCalendarInfo: React.FC<HellenicCalendarInfoProps> = ({
  atticDate: propAtticDate,
  weather,
  currentLat = 37.9838,
  currentLng = 23.7275,
  currentDate,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { civilization, labels } = useCivilization();
  const [greekInfo, setGreekInfo] = useState<{
    festival: AtticFestivalInfo | null;
    dailyDeity: AtticFestivalInfo | null;
    atticDate: AtticDateResult;
  } | null>(null);
  const [view, setView] = useState<ViewMode>('month');

  useEffect(() => {
    const targetAtticDate = propAtticDate || getAtticDate(new Date(), currentLat, currentLng);
    const festival = getAtticFestivalInfo(
      targetAtticDate.monthIndex,
      targetAtticDate.dayOfMonth,
    );
    const dailyDeity = getDailyAtticDeity(
      targetAtticDate.dayOfMonth,
      targetAtticDate.monthLength,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreekInfo({ festival, dailyDeity, atticDate: targetAtticDate });
  }, [propAtticDate, currentLat, currentLng]);

  const { isDay, dayProgress, moonPhase, moonSvgX, moonSvgY, moonVisible } = useMemo(() => {
    const date = currentDate ?? new Date();
    const sun = getSunTimes(date, currentLat, currentLng);
    const now = date.getTime();
    const rise = sun.sunrise.getTime();
    const set = sun.sunset.getTime();
    const day = now >= rise && now <= set;
    const phase = getMoonPhase(date);

    let svgX = 150,
      svgY = 80,
      visible = false;
    if (!day) {
      const pos = getMoonPosition(date, currentLat, currentLng);
      if (pos.altitude >= 0) {
        svgX = Math.max(14, Math.min(286, 150 + ((pos.azimuth - 180) / 90) * 120));
        // Map horizon→y=165 (near skyline), zenith→y=15 (near top of sky)
        svgY = Math.max(14, Math.min(165, 165 - (pos.altitude / 90) * 150));
        visible = true;
      }
    }

    return {
      isDay: day,
      dayProgress: day ? (now - rise) / (set - rise) : 0,
      moonPhase: phase,
      moonSvgX: svgX,
      moonSvgY: svgY,
      moonVisible: visible,
    };
  }, [currentDate, currentLat, currentLng]);

  const skylineElements = useMemo(
    () => generateGreekSkyline(Math.floor((currentDate ?? new Date()).getTime() / 86400000)),
    [currentDate],
  );

  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 0] ?? 0;
  const weatherParticles = useMemo(
    () => ({
      ...generateWeatherParticles(rainIntensity),
      /* eslint-disable react-hooks/purity */
      stars: Array.from({ length: 60 }).map(() => ({
        x: Math.random() * 300,
        y: Math.random() * 100,
        r: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.7 + 0.3,
      })),
      /* eslint-enable react-hooks/purity */
    }),
    [rainIntensity],
  );

  if (civilization !== 'hellas' || !greekInfo) return null;

  const { festival, dailyDeity, atticDate } = greekInfo;
  const hasFestival = !!festival;
  const defaultDeity = getDefaultAtticDeity(atticDate.monthIndex);
  const apaphrades = checkApaphrades(atticDate.monthIndex, atticDate.dayOfMonth, festival);

  let displayDeityTitle = labels.godOfDayTitle || 'Θεὸς τῆς Ἡμέρας';
  let deityName: string;
  let deityDesc: string;

  if (hasFestival) {
    displayDeityTitle = labels.festivalLabel || 'Ἑορτή';
    deityName = festival!.festivalName || festival!.deity;
    deityDesc = festival!.festivalDesc || festival!.deityDesc;
  } else if (dailyDeity) {
    deityName = dailyDeity.deity;
    deityDesc = dailyDeity.deityDesc;
  } else {
    displayDeityTitle = '— Θεὸς τοῦ Μηνός —';
    deityName = defaultDeity.deity;
    deityDesc = defaultDeity.festivalDesc;
  }

  const condition = weather?.current.condition ?? 'clear';

  // Minoan/Aegean palette — keyed to the dusty kyanite blue of Knossian frescoes
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const skyGradient = (() => {
    if (!isDay) {
      if (
        condition === 'cloudy' ||
        condition === 'partly-cloudy' ||
        condition === 'fog' ||
        condition === 'rain' ||
        condition === 'storm'
      )
        return 'linear-gradient(to bottom, #060a10 0%, #0d1420 60%, #0f1208 100%)';
      // Deep Attic night: blue-slate, not Babylonian lapis
      return 'linear-gradient(to bottom, #030b18 0%, #071525 40%, #0e1e38 80%, #111630 100%)';
    }
    // Pre-dawn: Minoan blue emerging from darkness
    if (dayProgress < 0.08)
      return 'linear-gradient(to bottom, #060d1a 0%, #0f2035 30%, #1e4060 65%, #3a6a8a 100%)';
    // Early morning: deeper Aegean blue sky
    if (dayProgress < 0.2)
      return 'linear-gradient(to bottom, #0d1e32 0%, #1a3a5c 35%, #2e6080 70%, #5490b0 100%)';
    if (condition === 'fog')
      return 'linear-gradient(to bottom, #8aa8b8 0%, #b8cdd8 50%, #dce8ee 100%)';
    if (condition === 'snow')
      return 'linear-gradient(to bottom, #7090a0 0%, #a0bcc8 40%, #d8e8ee 100%)';
    if (dayProgress < 0.75) {
      if (condition === 'partly-cloudy')
        return 'linear-gradient(to bottom, #50688a 0%, #7d93b0 30%, #9fb3c8 70%, #c4d5e8 100%)';
      if (condition === 'cloudy')
        return 'linear-gradient(to bottom, #2a3d50 0%, #3a5568 30%, #527888 70%, #7a9aaa 100%)';
      if (condition === 'rain' || condition === 'storm')
        return 'linear-gradient(to bottom, #0d1a26 0%, #1a2e3e 40%, #111e2c 80%, #0a1218 100%)';
      // Pure Minoan fresco blue — the kyanite pigment of Knossos
      return 'linear-gradient(to bottom, #0e1f36 0%, #1a3858 25%, #3070a0 58%, #68b0cc 82%, #90c5d8 100%)';
    }
    // Aegean twilight — deep blue draining to lighter horizon
    return 'linear-gradient(to bottom, #0a1828 0%, #183050 30%, #2a5878 60%, #4888a8 100%)';
  })();

  let skylineFill = 'rgba(215,228,240,0.95)';
  if (!isDay) skylineFill = 'rgba(18,45,95,0.92)';
  else if (condition === 'snow') skylineFill = 'rgba(55,80,110,0.88)';
  else if (condition === 'fog') skylineFill = 'rgba(130,155,175,0.75)';

  let skylineStroke = 'rgba(80,128,162,0.38)';
  if (!isDay) skylineStroke = 'rgba(70,130,200,0.55)';
  else if (condition === 'snow') skylineStroke = 'rgba(140,180,210,0.50)';
  else if (condition === 'fog') skylineStroke = 'rgba(120,148,168,0.38)';

  const decadeLabel = DECADE_LABELS[atticDate.decade] ?? DECADE_LABELS[1];
  const nextFests = getNextAtticFestivals(atticDate.monthIndex, atticDate.dayOfMonth, 5);

  return (
    <div className="hellenic-calendar-info">
      <div className="hel-card">
        <GreekMeanderBorder />

        {/* ── Sky scene (full width) ─────────────────────────────────────── */}
        <div className="hel-sky-scene">
          <div className="hel-sky-bg" style={{ background: skyGradient }} />

          {/* Stars + weather overlay */}
          <svg
            className="hel-weather-svg"
            viewBox="0 0 300 200"
            preserveAspectRatio="xMidYMid slice"
          >
            {!isDay && (
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
            {moonVisible && (
              <g transform={`translate(${moonSvgX}, ${moonSvgY})`}>
                {renderSeleneMoon(moonPhase)}
              </g>
            )}
            <WeatherSvgEffects
              condition={condition}
              weatherParticles={weatherParticles}
              fogGradientId="fog-ground-hel"
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

          {/* Greek skyline */}
          <svg
            className="hel-skyline-svg"
            viewBox="0 0 300 200"
            preserveAspectRatio="xMidYMax meet"
            style={condition === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined}
          >
            {skylineElements.map(el => (
              <path
                key={el.id}
                d={el.path}
                fill={skylineFill}
                stroke={skylineStroke}
                strokeWidth="0.5"
                opacity={el.opacity}
              />
            ))}
            {/* Hoplite on watch in the gap between the two building zones;
                same day/night/weather palette as the buildings, drawn before
                the ground so his feet sink into the hill line */}
            <Hoplite
              fill={skylineFill}
              stroke={skylineStroke}
              transform="translate(126 189.5) scale(0.33)"
            />
            {/* Snow floor */}
            <path
              d="M 0 180 L 300 180 L 300 200 L 0 200 Z"
              fill={condition === 'snow' ? '#dde1e7' : 'var(--ink)'}
            />
            <path
              d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z"
              fill={condition === 'snow' ? '#dde1e7' : 'var(--ink)'}
              stroke={condition === 'snow' ? '#f0f4f8' : 'var(--gold-dim)'}
              strokeWidth="1"
            />
            {condition === 'snow' && (
              <path
                d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z"
                fill="#f0f4f8"
                opacity="0.9"
              />
            )}
          </svg>

          {/* Dark scrim for text contrast — radial so sky edges remain visible */}
          <div
            className="hel-dark-scrim"
            style={{
              background:
                'radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 65%, transparent 100%)',
            }}
          />

          {/* Month name overlay */}
          <div className="hel-month-overlay">
            <div className="hel-month-name-wrap">
              <span
                className="hel-month-name"
                style={{ fontSize: 'clamp(1.8rem,7.5vw,3.2rem)', lineHeight: 1 }}
              >
                {atticDate.monthName}
                {atticDate.isIntercalaryMonth && (
                  <span className="hel-intercalary" style={{ fontSize: '40%' }}>
                    (Ἐμβόλιμος)
                  </span>
                )}
              </span>
              <span
                className="hel-month-translation"
                style={{ fontSize: 'clamp(0.75rem,2vw,0.85rem)' }}
              >
                {translateGreekUI(atticDate.monthName)}
              </span>
            </div>

            {/* Day name only — strip ", MonthName" suffix to avoid repetition */}
            <div
              className="hel-day-name-overlay"
              style={{ fontSize: 'clamp(0.75rem,2.3vw,0.95rem)', letterSpacing: '0.12em' }}
            >
              {atticDate.short.split(',')[0].trim()}
            </div>
            <div
              className="hel-day-name-es"
              style={{ fontSize: 'clamp(0.75rem,1.8vw,0.85rem)' }}
            >
              {atticDate.spanishShort.split(',')[0].trim()}
            </div>
          </div>
        </div>

        <div className="hel-content">
          {/* ── Deity / festival of the day (always visible) ─────────────── */}
          {deityName && (
            <div className="hel-deity-card">
              {festival?.category && (
                <div className="hel-category-badge">{getCategoryBadge(festival.category)}</div>
              )}
              {festival?.isApaphrades && <div className="hel-apaphrades-overlay" />}

              <div className="hel-deity-title-row">
                <div className="hel-deity-title-row-inner">
                  {hasFestival && <span className="hel-title-emoji">🏛️</span>}
                  {displayDeityTitle}
                  {hasFestival && <span className="hel-title-emoji">🏛️</span>}
                </div>
                {hasFestival && (
                  <div className="hel-festival-icons">
                    {festival?.ritualOffering && <span title="Ofrenda Ritual">🏺</span>}
                    {festival?.pannychisDesc && (
                      <span title="Pannychis" className="hel-anim-pulse">
                        🕯️
                      </span>
                    )}
                    {festival?.agonDesc && <span title="Agōn">🌿</span>}
                    {festival?.economyDesc && <span title="Economía">🪙</span>}
                    {festival?.aition && <span title="Aition">📜</span>}
                  </div>
                )}
              </div>

              <h2 className="hel-deity-name">{deityName}</h2>
              <div className="hel-transliteration">{transliterateGreek(deityName)}</div>

              {festival?.festivalDayName && (
                <div className="hel-festival-day-name">{festival.festivalDayName}</div>
              )}

              <p className="hel-deity-desc">&quot;{deityDesc}&quot;</p>

              {festival?.participants && (
                <div className="hel-participants">
                  <span className="hel-participants-label">Participantes:</span>
                  <span className="hel-participants-value">{festival.participants}</span>
                </div>
              )}

              {festival?.ritualOffering && (
                <div className="hel-offering-box">
                  <span className="hel-offering-icon">{festival.ritualOffering.icon}</span>
                  <div className="hel-offering-text">
                    <span className="hel-offering-label">Ofrenda Tradicional</span>
                    <span className="hel-offering-item">{festival.ritualOffering.item}</span>
                  </div>
                </div>
              )}

              {festival?.pannychisDesc && (
                <div className="hel-pannychis-box">
                  <span className="hel-pannychis-icon hel-anim-pulse">🕯️</span>
                  <div className="hel-pannychis-text">
                    <span className="hel-pannychis-label">Pannychis (Vigilia Sagrada)</span>
                    <span className="hel-pannychis-desc">{festival.pannychisDesc}</span>
                  </div>
                </div>
              )}

              {festival?.agonDesc && (
                <div className="hel-agon-box">
                  <span className="hel-agon-icon">🌿</span>
                  <div className="hel-agon-text">
                    <span className="hel-agon-label">Agōn (Competición)</span>
                    <span className="hel-agon-desc">{festival.agonDesc}</span>
                  </div>
                </div>
              )}

              {festival?.economyDesc && (
                <div className="hel-economy-box">
                  <span className="hel-economy-icon">🪙</span>
                  <div className="hel-economy-text">
                    <span className="hel-economy-label">El Precio de la Piedad</span>
                    <span className="hel-economy-desc">{festival.economyDesc}</span>
                  </div>
                </div>
              )}

              {festival?.aition && (
                <div className="hel-aition-box">
                  <div className="hel-aition-header">
                    <span className="hel-aition-header-icon">📜</span>
                    <span className="hel-aition-header-label">Aition: El Mito Fundacional</span>
                  </div>
                  <p className="hel-aition-text">{festival.aition}</p>
                </div>
              )}
            </div>
          )}

          {/* ── View toggle ──────────────────────────────────────────────── */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div className="hel-view-toggle" onClick={e => e.stopPropagation()}>
            {(['month', 'festivals', 'days'] as ViewMode[]).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`hel-view-btn ${
                  view === v ? 'hel-view-btn--active' : 'hel-view-btn--inactive'
                }`}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>

          {/* ── MONTH VIEW ────────────────────────────────────────────────── */}
          {view === 'month' && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div className="hel-month-view" onClick={e => e.stopPropagation()}>
              <div className="hel-section-header">
                <span>☾</span>
                Μήν: {atticDate.monthLength} días lunares
                <span>☽</span>
              </div>

              <DayGrid
                today={atticDate.dayOfMonth}
                monthLen={atticDate.monthLength}
                monthIndex={atticDate.monthIndex}
              />

              {/* Apaphrades warning */}
              {apaphrades.isTaboo && (
                <div className="hel-apaphrades-box">
                  <div className="hel-apaphrades-stripe" />
                  <div className="hel-apaphrades-header">
                    <span className="hel-apaphrades-icon hel-anim-bounce">
                      {apaphrades.icon}
                    </span>
                    <div className="hel-apaphrades-title-wrap">
                      <span className="hel-apaphrades-name">Apaphrades Hemera</span>
                      <span className="hel-apaphrades-subtitle">(Día Nefasto y Prohibido)</span>
                    </div>
                  </div>
                  <p className="hel-apaphrades-reason">{apaphrades.reason}</p>
                  {apaphrades.instruction && (
                    <div className="hel-apaphrades-instruction">
                      <span className="hel-instruction-label">
                        <span className="hel-anim-pulse">⚠️</span> Instrucción de Supervivencia:
                      </span>
                      <p className="hel-instruction-text">
                        &quot;{apaphrades.instruction}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom info cards */}
              <div className="hel-info-cards">
                {(
                  [
                    { title: 'Δεκάς', main: decadeLabel.title, sub: decadeLabel.subtitle },
                    {
                      title: 'Ἡμέρα',
                      main: hasFestival
                        ? festival!.festivalName ?? festival!.deity
                        : dailyDeity?.deity ?? '—',
                      sub: hasFestival ? 'Ἑορτή' : 'Θεὸς Ἡμέρας',
                    },
                    {
                      title: 'Μήν',
                      main: `${atticDate.monthLength} ἡμέρ.`,
                      sub: atticDate.isIntercalaryMonth ? 'Ἐμβόλιμος' : 'Συνήθης',
                    },
                  ] as { title: string; main: string; sub: string }[]
                ).map(({ title, main, sub }) => (
                  <div key={title} className="hel-info-card">
                    <div className="hel-info-card-title">{title}</div>
                    <div className="hel-info-card-main">{main}</div>
                    <div className="hel-info-card-sub">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DAYS VIEW (7 following days — folded modal) ────────────────── */}
          {view === 'days' && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div className="hel-days-view" onClick={e => e.stopPropagation()}>
              <GreekDaysList
                startDate={currentDate ?? new Date()}
                lat={currentLat}
                lng={currentLng}
              />
            </div>
          )}

          {/* ── FESTIVALS VIEW ─────────────────────────────────────────────── */}
          {view === 'festivals' && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div className="hel-festivals-view" onClick={e => e.stopPropagation()}>
              <div className="hel-section-header">
                <span>🏛️</span> Próximos Festivales · Ἀθήναι <span>🏛️</span>
              </div>

              {nextFests.length === 0 ? (
                <p className="hel-info-panel-empty-msg" style={{ padding: '1rem 0' }}>
                  No hay festivales próximos registrados.
                </p>
              ) : (
                nextFests.map((f, i) => (
                  <div key={i} className="hel-fest-item">
                    <div className="hel-fest-item-top">
                      <div className="hel-fest-name-col">
                        <h4 className="hel-fest-name">{f.name}</h4>
                        <span className="hel-fest-date">{f.date}</span>
                      </div>
                      <div className="hel-fest-countdown">
                        <div className="hel-fest-countdown-num">{f.daysRemaining}</div>
                        <div className="hel-fest-countdown-label">días</div>
                      </div>
                    </div>
                    <p className="hel-fest-desc">{f.description}</p>
                    <div className="hel-fest-details">
                      {f.fullFestival?.ritualOffering && (
                        <div className="hel-fest-offering-row">
                          <span>{f.fullFestival.ritualOffering.icon}</span>
                          <span>
                            <b>Ofrenda:</b> {f.fullFestival.ritualOffering.item}
                          </span>
                        </div>
                      )}
                      {f.fullFestival?.pannychisDesc && (
                        <div className="hel-fest-vigilia-row">
                          <span className="hel-anim-pulse">🕯️</span>
                          <span>
                            <b>Vigilia:</b> {f.fullFestival.pannychisDesc}
                          </span>
                        </div>
                      )}
                      {f.fullFestival?.agonDesc && (
                        <div className="hel-fest-agon-row">
                          <span>🌿</span>
                          <span>
                            <b>Agōn:</b> {f.fullFestival.agonDesc}
                          </span>
                        </div>
                      )}
                      {f.fullFestival?.aition && (
                        <div className="hel-fest-aition-row">
                          <span>📜</span>
                          <span>
                            <b>Aition:</b> {f.fullFestival.aition}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="hel-footer">
          <p className="hel-footer-note">
            Νουμηνία (día 1) es el primer creciente visible, un día tras la conjunción
            astronómica. El día ático comienza al atardecer — por ello esta fecha puede diferir
            ~2 días de otros cómputos lunares.
          </p>
          <p className="hel-footer-disclaimer">
            Fecha según un modelo astronómico idealizado. El calendario civil ateniense se
            fijaba por decisión de los magistrados y podía diferir en días, o incluso en un mes
            entero, de este cálculo.
          </p>
        </div>

        <GreekMeanderBorder />
      </div>
    </div>
  );
};

export default HellenicCalendarInfo;

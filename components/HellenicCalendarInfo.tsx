import React, { useState, useEffect, useMemo } from 'react';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import {
  getAtticFestivalInfo, getDailyAtticDeity, AtticFestivalInfo,
  checkApaphrades, getCategoryBadge, getNextAtticFestivals,
} from '../utils/atticCalendarData';
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
  '</g></svg>'
)}`;

const GreekMeanderBorder: React.FC = () => (
  <div
    className="w-full h-14 block"
    style={{
      backgroundImage: `url("${MEANDER_URI}")`,
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'repeat-x',
    }}
  />
);

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
  const litColor = `rgba(125,211,252,${alpha})`;
  const darkColor = `rgba(12,22,64,${bgAlpha})`;

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

// ─── Panel moon icon ──────────────────────────────────────────────────────────

const PanelMoonSvg: React.FC<{ type: 'waxing' | 'full' | 'waning'; active: boolean }> = ({ type, active }) => {
  const cls = `w-5 h-5 mx-auto mb-1 transition-all ${active ? 'text-sky-300 drop-shadow-[0_0_6px_rgba(125,211,252,0.6)]' : 'text-sky-500/50'}`;
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

// ─── Day grid ─────────────────────────────────────────────────────────────────

const DayGrid: React.FC<{
  today: number;
  monthLen: number;
  monthIndex: number;
}> = ({ today, monthLen, monthIndex }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const panels: Array<{ days: number[]; moonType: 'waxing' | 'full' | 'waning'; title: string; subtitle: string }> = [
    { days: Array.from({ length: 10 }, (_, i) => i + 1),             moonType: 'waxing', title: 'Ἱστάμενος', subtitle: 'Creciente' },
    { days: Array.from({ length: 10 }, (_, i) => i + 11),            moonType: 'full',   title: 'Μεσῶν',     subtitle: 'Plena'      },
    { days: Array.from({ length: monthLen - 20 }, (_, i) => i + 21), moonType: 'waning', title: 'Φθίνων',    subtitle: 'Menguante'  },
  ];

  let activePanel = 0;
  if (today >= 21) activePanel = 2;
  else if (today >= 11) activePanel = 1;

  const selFest = selectedDay !== null ? getAtticFestivalInfo(monthIndex, selectedDay) : null;

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
                  ? 'border-sky-400/50 bg-sky-900/10 shadow-[0_0_15px_rgba(56,189,248,0.1)] scale-[1.02] z-10'
                  : 'border-sky-800/30 bg-ink/30'
                }`}
            >
              {active && (
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-sky-400/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="text-center mb-2 relative z-10 border-b border-sky-700/30 pb-2">
                <PanelMoonSvg type={moonType} active={active} />
                <h4 className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${active ? 'text-sky-300' : 'text-sky-500'}`}>{title}</h4>
                <div className="text-[8px] font-serif italic text-sky-400/60 tracking-wide uppercase mt-0.5">{subtitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-1 justify-items-center relative z-10">
                {days.map(day => {
                  const isToday    = day === today;
                  const isPast     = day < today;
                  const isSelected = day === selectedDay;
                  const hasFest    = getAtticFestivalInfo(monthIndex, day) !== null;

                  let cellClass = 'bg-ink/40 active:bg-sky-900/30';
                  if (isSelected)             cellClass = 'bg-sky-400/20 ring-2 ring-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]';
                  else if (isToday)           cellClass = 'bg-sky-400/15 ring-1 ring-sky-400/70';
                  else if (hasFest && !isPast) cellClass = 'bg-sky-700/30 ring-1 ring-sky-400/45';
                  else if (hasFest && isPast)  cellClass = 'bg-sky-900/30 ring-1 ring-sky-600/35';

                  let numClass = 'text-sky-300';
                  if (isSelected) numClass = 'text-white';
                  else if (isToday) numClass = 'text-sky-200';
                  else if (isPast)  numClass = 'text-sky-400/50';

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`relative flex flex-col items-center justify-center rounded-sm pt-1 pb-2 w-full gap-0 transition-all cursor-pointer select-none ${cellClass}`}
                      onClick={() => setSelectedDay(prev => prev === day ? null : day)}
                    >
                      <TinyMoon phase={(day - 1) / monthLen} size={11} dim={isPast && !isToday} />
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
        selFest && selectedDay !== null
          ? 'border-sky-500/40 bg-sky-900/20 p-3'
          : 'border-sky-800/30 bg-transparent py-2 px-3'
      }`}>
        {selFest && selectedDay !== null ? (
          <div className="flex flex-col gap-2 text-left animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-sky-400 uppercase tracking-wider">Ἡμέρα {selectedDay}</span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-sky-500 hover:text-sky-300 text-xs leading-none px-1"
                aria-label="Cerrar"
              >✕</button>
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-sky-300">{selFest.festivalName}</span>
              {selFest.festivalDayName && (
                <span className="ml-2 text-[10px] uppercase tracking-widest text-sky-400/70">{selFest.festivalDayName}</span>
              )}
              <p className="text-xs font-serif text-parchment/80 mt-0.5 leading-snug">{selFest.festivalDesc}</p>
              {selFest.deity && (
                <span className="text-[10px] text-gold-dim font-serif mt-1 block">Deidad: {selFest.deity}</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs font-serif text-sky-400/50 text-center">
            Toca un día para ver su significado
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {([
          { cls: 'bg-sky-400/15 ring-1 ring-sky-400/70', label: 'Hoy' },
          { cls: 'bg-sky-700/30 ring-1 ring-sky-400/45', label: 'Festival' },
        ] as { cls: string; label: string }[]).map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-sm inline-block ${cls}`} />
            <span className="text-xs text-sky-400 font-serif uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface HellenicCalendarInfoProps {
  atticDate?: AtticDateResult;
  onClick?: () => void;
  weather?: WeatherData | null;
  currentLat?: number;
  currentLng?: number;
  currentDate?: Date;
}

type ViewMode = 'month' | 'festivals';

const DECADE_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Ἱστάμενος', subtitle: 'Creciente' },
  2: { title: 'Μεσῶν',     subtitle: 'Plena'      },
  3: { title: 'Φθίνων',    subtitle: 'Menguante'  },
};

// ─── Sky moon renderer (Selene) ───────────────────────────────────────────────

const renderSeleneMoon = (phase: number) => {
  const r = 14;
  const normalizedPhase = (phase % 1 + 1) % 1;
  const isWaxing = normalizedPhase <= 0.5;
  const sweep1 = isWaxing ? 1 : 0;
  const rx = Math.max(0.1, r * Math.abs(Math.cos(normalizedPhase * Math.PI * 2)));
  let sweep2 = 0;
  if (normalizedPhase > 0.25 && normalizedPhase <= 0.5) sweep2 = 1;
  else if (normalizedPhase > 0.75) sweep2 = 1;
  const d = `M 0 -${r} A ${r} ${r} 0 0 ${sweep1} 0 ${r} A ${rx} ${r} 0 0 ${sweep2} 0 -${r} Z`;
  const maskId = `hel-moon-mask-${normalizedPhase.toFixed(3)}`;
  return (
    <g transform="rotate(-15)">
      <defs>
        <clipPath id={maskId}><path d={d} /></clipPath>
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
      <circle cx="0" cy="0" r={r} fill="none" stroke="rgba(200,225,255,0.4)" strokeWidth="0.5" />
    </g>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const HellenicCalendarInfo: React.FC<HellenicCalendarInfoProps> = ({
  atticDate: propAtticDate, onClick,
  weather, currentLat = 37.9838, currentLng = 23.7275, currentDate,
}) => {
  const { civilization, labels } = useCivilization();
  const [greekInfo, setGreekInfo] = useState<{
    festival: AtticFestivalInfo | null;
    dailyDeity: AtticFestivalInfo | null;
    atticDate: AtticDateResult;
  } | null>(null);
  const [view, setView] = useState<ViewMode>('month');

  useEffect(() => {
    const targetAtticDate = propAtticDate || getAtticDate(new Date());
    const festival = getAtticFestivalInfo(targetAtticDate.monthIndex, targetAtticDate.dayOfMonth);
    const dailyDeity = getDailyAtticDeity(targetAtticDate.dayOfMonth, targetAtticDate.monthLength);
    setGreekInfo({ festival, dailyDeity, atticDate: targetAtticDate });
  }, [propAtticDate]);

  const { isDay, dayProgress, moonPhase, moonSvgX, moonSvgY, moonVisible } = useMemo(() => {
    const date = currentDate ?? new Date();
    const sun = getSunTimes(date, currentLat, currentLng);
    const now = date.getTime();
    const rise = sun.sunrise.getTime();
    const set  = sun.sunset.getTime();
    const day  = now >= rise && now <= set;
    const phase = getMoonPhase(date);

    let svgX = 150, svgY = 80, visible = false;
    if (!day) {
      const pos = getMoonPosition(date, currentLat, currentLng);
      if (pos.altitude >= 0) {
        svgX = Math.max(14, Math.min(286, 150 + (pos.azimuth - 180) / 90 * 120));
        // Map horizon→y=165 (near skyline), zenith→y=15 (near top of sky)
        svgY = Math.max(14, Math.min(165, 165 - pos.altitude / 90 * 150));
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
    [currentDate]
  );

  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 0] ?? 0;
  const weatherParticles = useMemo(() => ({
    ...generateWeatherParticles(rainIntensity),
    stars: Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 300, y: Math.random() * 100,
      r: Math.random() * 1.2 + 0.3, opacity: Math.random() * 0.7 + 0.3,
    })),
  }), [rainIntensity]);

  if (civilization !== 'hellas' || !greekInfo) return null;

  const { festival, dailyDeity, atticDate } = greekInfo;
  const hasFestival = !!festival;
  const apaphrades = checkApaphrades(atticDate.monthIndex, atticDate.dayOfMonth, festival);

  let displayDeityTitle = labels.godOfDayTitle || "Θεὸς τῆς Ἡμέρας";
  let deityName = "";
  let deityDesc = "";

  if (hasFestival) {
    displayDeityTitle = labels.festivalLabel || "Ἑορτή";
    deityName = festival!.festivalName || festival!.deity;
    deityDesc = festival!.festivalDesc || festival!.deityDesc;
  } else if (dailyDeity) {
    deityName = dailyDeity.deity;
    deityDesc = dailyDeity.deityDesc;
  }

  const condition = weather?.current.condition ?? 'clear';

  // Minoan/Aegean palette — keyed to the dusty kyanite blue of Knossian frescoes
  const skyGradient = (() => {
    if (!isDay) {
      if (condition === 'cloudy' || condition === 'fog' || condition === 'rain' || condition === 'storm')
        return 'linear-gradient(to bottom, #060a10 0%, #0d1420 60%, #0f1208 100%)';
      // Deep Attic night: blue-slate, not Babylonian lapis
      return 'linear-gradient(to bottom, #030b18 0%, #071525 40%, #0e1e38 80%, #111630 100%)';
    }
    // Pre-dawn: Minoan blue emerging from darkness
    if (dayProgress < 0.08) return 'linear-gradient(to bottom, #060d1a 0%, #0f2035 30%, #1e4060 65%, #3a6a8a 100%)';
    // Early morning: deeper Aegean blue sky
    if (dayProgress < 0.2)  return 'linear-gradient(to bottom, #0d1e32 0%, #1a3a5c 35%, #2e6080 70%, #5490b0 100%)';
    if (condition === 'fog')   return 'linear-gradient(to bottom, #8aa8b8 0%, #b8cdd8 50%, #dce8ee 100%)';
    if (condition === 'snow')  return 'linear-gradient(to bottom, #7090a0 0%, #a0bcc8 40%, #d8e8ee 100%)';
    if (dayProgress < 0.75) {
      if (condition === 'cloudy') return 'linear-gradient(to bottom, #2a3d50 0%, #3a5568 30%, #527888 70%, #7a9aaa 100%)';
      if (condition === 'rain' || condition === 'storm') return 'linear-gradient(to bottom, #0d1a26 0%, #1a2e3e 40%, #111e2c 80%, #0a1218 100%)';
      // Pure Minoan fresco blue — the kyanite pigment of Knossos
      return 'linear-gradient(to bottom, #0e1f36 0%, #1a3858 25%, #3070a0 58%, #68b0cc 82%, #90c5d8 100%)';
    }
    // Aegean twilight — deep blue draining to lighter horizon
    return 'linear-gradient(to bottom, #0a1828 0%, #183050 30%, #2a5878 60%, #4888a8 100%)';
  })();

  const skylineFill   = !isDay
    ? 'rgba(18,45,95,0.92)'
    : condition === 'snow'
      ? 'rgba(55,80,110,0.88)'
      : condition === 'fog'
        ? 'rgba(130,155,175,0.75)'
        : 'rgba(215,228,240,0.95)';
  const skylineStroke = !isDay
    ? 'rgba(70,130,200,0.55)'
    : condition === 'snow'
      ? 'rgba(140,180,210,0.50)'
      : condition === 'fog'
        ? 'rgba(120,148,168,0.38)'
        : 'rgba(80,128,162,0.38)';

  const decadeLabel = DECADE_LABELS[atticDate.decade] ?? DECADE_LABELS[1];
  const nextFests = getNextAtticFestivals(atticDate.monthIndex, atticDate.dayOfMonth, 5);

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
      onClick={onClick}
    >
      <div className="bg-ink/90 border-[4px] border-gold-dim hover:border-gold-leaf transition-colors p-0 rounded-sm shadow-2xl relative overflow-hidden group">

        <GreekMeanderBorder />

        {/* ── Sky scene (full width) ─────────────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden border-b border-sky-500/30"
          style={{ aspectRatio: '16/9' }}
        >
          <div className="absolute inset-0 transition-all duration-2000" style={{ background: skyGradient }} />

          {/* Stars + weather overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 300 200"
            preserveAspectRatio="xMidYMid slice"
          >
            {!isDay && (
              <g>
                {weatherParticles.stars.map((s, i) => (
                  <circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.opacity} />
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
            />
            {condition === 'storm' && (
              <rect x="0" y="0" width="300" height="200" fill="#ffffff" opacity="0" className="anim-lightning" />
            )}
          </svg>

          {/* Greek skyline */}
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
                fill={skylineFill}
                stroke={skylineStroke}
                strokeWidth="0.5"
                opacity={el.opacity}
              />
            ))}
            {/* Snow floor */}
            <path d="M 0 180 L 300 180 L 300 200 L 0 200 Z" fill={condition === 'snow' ? '#dde1e7' : 'var(--ink)'} />
            <path d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z" fill={condition === 'snow' ? '#dde1e7' : 'var(--ink)'} stroke={condition === 'snow' ? '#f0f4f8' : 'var(--gold-dim)'} strokeWidth="1" />
            {condition === 'snow' && (
              <path d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z" fill="#f0f4f8" opacity="0.9" />
            )}
          </svg>

          {/* Dark scrim for text contrast — radial so sky edges remain visible */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 65%, transparent 100%)' }}
          />

          {/* Month name overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center px-4 pb-[20%]">
            <div className="flex flex-col items-center leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
              <span
                className="font-serif text-white font-black uppercase tracking-[0.15em]"
                style={{ fontSize: 'clamp(1.8rem,7.5vw,3.2rem)', lineHeight: 1 }}
              >
                {atticDate.monthName}
                {atticDate.isIntercalaryMonth && (
                  <span className="ml-2 text-sky-300" style={{ fontSize: '40%' }}>(Ἐμβόλιμος)</span>
                )}
              </span>
              <span
                className="font-serif text-sky-200/80 italic tracking-widest"
                style={{ fontSize: 'clamp(0.6rem,2vw,0.85rem)' }}
              >
                {translateGreekUI(atticDate.monthName)}
              </span>
            </div>

            {/* Day name only — strip ", MonthName" suffix to avoid repetition */}
            <div
              className="font-serif text-white/80 font-bold mt-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
              style={{ fontSize: 'clamp(0.65rem,2.3vw,0.95rem)', letterSpacing: '0.12em' }}
            >
              {atticDate.short.split(',')[0].trim()}
            </div>
            <div
              className="font-serif text-parchment/70 italic drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
              style={{ fontSize: 'clamp(0.6rem,1.8vw,0.85rem)' }}
            >
              {atticDate.spanishShort.split(',')[0].trim()}
            </div>
          </div>

        </div>

        <div className="p-5 md:p-8 flex flex-col items-center gap-5 text-center">

          {/* ── View toggle ──────────────────────────────────────────────── */}
          <div
            className="flex gap-0 rounded-lg overflow-hidden border border-sky-600/40 w-full max-w-xs"
            onClick={e => e.stopPropagation()}
          >
            {(['month', 'festivals'] as ViewMode[]).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`flex-1 py-2 text-xs font-serif uppercase tracking-widest font-bold transition-all
                  ${view === v
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'text-sky-500 hover:text-sky-300 hover:bg-sky-900/20'
                  }`}
              >
                {v === 'month' ? '☽ Mes Lunar' : '🏛️ Festivales'}
              </button>
            ))}
          </div>

          {/* ── MONTH VIEW ────────────────────────────────────────────────── */}
          {view === 'month' && (
            <div className="w-full flex flex-col gap-4" onClick={e => e.stopPropagation()}>

              <div className="font-serif text-xs uppercase tracking-widest text-sky-400 flex items-center justify-center gap-3 border-y border-sky-700/30 py-2 bg-ink/20">
                <span>☾</span>
                Μήν: {atticDate.monthLength} días lunares
                <span>☽</span>
              </div>

              <DayGrid
                today={atticDate.dayOfMonth}
                monthLen={atticDate.monthLength}
                monthIndex={atticDate.monthIndex}
              />

              {/* Deity / festival card */}
              {deityName && (
                <div className="w-full bg-sky-900/15 p-5 rounded-lg border-2 border-sky-500/25 shadow-sm relative overflow-hidden">
                  {festival?.category && (
                    <div className="absolute -top-3 right-4 px-2 py-0.5 bg-sky-900/80 border border-sky-400/50 text-sky-300 text-[10px] uppercase tracking-[0.1em] rounded-sm backdrop-blur-md shadow-lg font-serif z-20">
                      {getCategoryBadge(festival.category)}
                    </div>
                  )}
                  {festival?.isApaphrades && (
                    <div className="absolute inset-0 bg-rose-950/20 pointer-events-none rounded-lg" />
                  )}

                  <div className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-1 relative z-10 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      {hasFestival && <span className="text-sky-400/70 text-lg">🏛️</span>}
                      {displayDeityTitle}
                      {hasFestival && <span className="text-sky-400/70 text-lg">🏛️</span>}
                    </div>
                    {hasFestival && (
                      <div className="flex gap-3 mt-1 px-3 py-1 bg-sky-400/5 rounded-full border border-sky-400/20">
                        {festival?.ritualOffering && <span title="Ofrenda Ritual">🏺</span>}
                        {festival?.pannychisDesc && <span title="Pannychis" className="animate-pulse">🕯️</span>}
                        {festival?.agonDesc && <span title="Agōn">🌿</span>}
                        {festival?.economyDesc && <span title="Economía">🪙</span>}
                        {festival?.aition && <span title="Aition">📜</span>}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight relative z-10 mt-1">
                    {deityName}
                  </h2>
                  <div className="font-serif text-[10px] text-sky-300/70 tracking-widest uppercase mb-1 relative z-10">
                    {transliterateGreek(deityName)}
                  </div>

                  {festival?.festivalDayName && (
                    <div className="mt-3 mb-1 inline-block px-4 py-1.5 bg-sky-900/30 border-t border-b border-sky-400/30 text-sky-400 font-serif text-sm font-bold tracking-widest uppercase relative z-10 shadow-inner">
                      {festival.festivalDayName}
                    </div>
                  )}

                  <p className="font-serif text-sm text-parchment/90 italic px-4 mt-3 leading-relaxed relative z-10">
                    "{deityDesc}"
                  </p>

                  {festival?.participants && (
                    <div className="mt-4 pt-3 border-t border-sky-800/30 w-full text-center relative z-10 flex flex-col items-center">
                      <span className="text-sky-400/60 text-[9px] uppercase tracking-[0.2em] mb-1 font-bold">Participantes:</span>
                      <span className="text-xs font-serif text-sky-200 font-bold">{festival.participants}</span>
                    </div>
                  )}

                  {festival?.ritualOffering && (
                    <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-md relative z-10 flex items-start gap-3 shadow-sm">
                      <span className="text-2xl">{festival.ritualOffering.icon}</span>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-amber-500 mb-0.5">Ofrenda Tradicional</span>
                        <span className="text-xs font-serif text-amber-100/90 leading-snug">{festival.ritualOffering.item}</span>
                      </div>
                    </div>
                  )}

                  {festival?.pannychisDesc && (
                    <div className="mt-3 p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-md relative z-10 flex items-start gap-3 shadow-inner">
                      <span className="text-xl animate-pulse">🕯️</span>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-indigo-400 mb-0.5">Pannychis (Vigilia Sagrada)</span>
                        <span className="text-[11px] font-serif text-indigo-200/80 leading-snug italic">{festival.pannychisDesc}</span>
                      </div>
                    </div>
                  )}

                  {festival?.agonDesc && (
                    <div className="mt-3 p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-md relative z-10 flex items-start gap-3 shadow-inner">
                      <span className="text-xl">🌿</span>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-emerald-400 mb-0.5">Agōn (Competición)</span>
                        <span className="text-[11px] font-serif text-emerald-100/80 leading-snug">{festival.agonDesc}</span>
                      </div>
                    </div>
                  )}

                  {festival?.economyDesc && (
                    <div className="mt-3 p-3 bg-yellow-950/30 border border-yellow-500/40 rounded-md relative z-10 flex items-start gap-3 shadow-inner">
                      <span className="text-xl">🪙</span>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-yellow-500 mb-0.5">El Precio de la Piedad</span>
                        <span className="text-[11px] font-serif text-yellow-100/80 leading-snug italic">{festival.economyDesc}</span>
                      </div>
                    </div>
                  )}

                  {festival?.aition && (
                    <div className="mt-4 p-4 bg-stone-900/80 border border-stone-700/50 rounded-md relative z-10 flex flex-col items-start gap-2 shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📜</span>
                        <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-bold text-stone-300">Aition: El Mito Fundacional</span>
                      </div>
                      <p className="text-[12px] font-serif text-stone-400/90 leading-relaxed text-left border-l-2 border-stone-600/50 pl-3 italic">
                        {festival.aition}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Apaphrades warning */}
              {apaphrades.isTaboo && (
                <div className="w-full bg-rose-950/60 border-2 border-rose-900/80 p-4 sm:p-5 rounded-md flex flex-col gap-3 shadow-[inset_0_0_30px_rgba(225,29,72,0.15)] relative z-10">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#881337_10px,#881337_20px)] opacity-50 rounded-t-sm" />
                  <div className="flex items-center gap-4 border-b border-rose-900/50 pb-3">
                    <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(225,29,72,0.8)] animate-bounce">{apaphrades.icon}</span>
                    <div className="text-left flex flex-col">
                      <span className="text-base font-serif uppercase tracking-[0.15em] font-black text-rose-500 leading-none mb-1">Apaphrades Hemera</span>
                      <span className="text-[10px] font-serif text-rose-300/80 tracking-widest uppercase">(Día Nefasto y Prohibido)</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-rose-200/90 leading-relaxed text-left italic">{apaphrades.reason}</p>
                  {apaphrades.instruction && (
                    <div className="bg-rose-900/30 border border-rose-500/40 rounded p-3 mt-2 shadow-inner">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-1.5 flex items-center gap-2">
                        <span className="text-rose-500 animate-pulse">⚠️</span> Instrucción de Supervivencia:
                      </span>
                      <p className="font-serif text-xs text-rose-100/90 leading-snug text-left">"{apaphrades.instruction}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom info cards */}
              <div className="flex gap-3 w-full justify-center text-center">
                {([
                  { title: 'Δεκάς',  main: decadeLabel.title,  sub: decadeLabel.subtitle },
                  {
                    title: 'Ἡμέρα',
                    main: hasFestival ? (festival!.festivalName ?? festival!.deity) : (dailyDeity?.deity ?? '—'),
                    sub: hasFestival ? 'Ἑορτή' : 'Θεὸς Ἡμέρας',
                  },
                  {
                    title: 'Μήν',
                    main: `${atticDate.monthLength} ἡμέρ.`,
                    sub: atticDate.isIntercalaryMonth ? 'Ἐμβόλιμος' : 'Συνήθης',
                  },
                ] as { title: string; main: string; sub: string }[]).map(({ title, main, sub }) => (
                  <div key={title} className="flex-1 bg-sky-900/15 border border-sky-500/25 rounded p-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">{title}</div>
                    <div className="font-serif text-parchment font-bold text-sm leading-tight">{main}</div>
                    <div className="text-xs text-sky-300 mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ── FESTIVALS VIEW ─────────────────────────────────────────────── */}
          {view === 'festivals' && (
            <div className="w-full flex flex-col gap-5" onClick={e => e.stopPropagation()}>
              <div className="font-serif text-xs uppercase tracking-widest text-sky-400 flex items-center justify-center gap-3 border-y border-sky-700/30 py-2 bg-ink/20">
                <span>🏛️</span> Próximos Festivales · Ἀθήναι <span>🏛️</span>
              </div>

              {nextFests.length === 0 ? (
                <p className="text-xs font-serif text-sky-400/50 text-center py-4">No hay festivales próximos registrados.</p>
              ) : nextFests.map((f, i) => (
                <div key={i} className="border-b border-sky-800/20 pb-5 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-0.5 text-left">
                      <h4 className="text-gold-leaf font-serif text-base font-bold leading-tight">{f.name}</h4>
                      <span className="text-[10px] text-sky-400/60 font-bold uppercase tracking-widest">{f.date}</span>
                    </div>
                    <div className="bg-sky-400/10 border border-sky-400/30 rounded px-2 py-1 text-right ml-2 shrink-0">
                      <div className="text-sm text-sky-400 font-black leading-none">{f.daysRemaining}</div>
                      <div className="text-[7px] text-sky-400/60 uppercase font-bold tracking-tighter">días</div>
                    </div>
                  </div>
                  <p className="text-parchment/80 font-serif text-sm leading-relaxed italic border-l-2 border-sky-400/20 pl-3 py-1 text-left mb-2">
                    {f.description}
                  </p>
                  <div className="flex flex-col gap-1.5 pl-3">
                    {f.fullFestival?.ritualOffering && (
                      <div className="text-[10px] font-serif text-amber-200/70 flex items-center gap-2">
                        <span>{f.fullFestival.ritualOffering.icon}</span>
                        <span><b className="text-amber-500/80 uppercase tracking-tighter">Ofrenda:</b> {f.fullFestival.ritualOffering.item}</span>
                      </div>
                    )}
                    {f.fullFestival?.pannychisDesc && (
                      <div className="text-[10px] font-serif text-indigo-200/70 flex items-center gap-2">
                        <span className="animate-pulse">🕯️</span>
                        <span><b className="text-indigo-400/80 uppercase tracking-tighter">Vigilia:</b> {f.fullFestival.pannychisDesc}</span>
                      </div>
                    )}
                    {f.fullFestival?.agonDesc && (
                      <div className="text-[10px] font-serif text-emerald-200/70 flex items-center gap-2">
                        <span>🌿</span>
                        <span><b className="text-emerald-400/80 uppercase tracking-tighter">Agōn:</b> {f.fullFestival.agonDesc}</span>
                      </div>
                    )}
                    {f.fullFestival?.aition && (
                      <div className="text-[10px] font-serif text-stone-300/70 flex items-start gap-2 bg-stone-900/40 p-2 rounded mt-1 border-l-2 border-stone-600/50">
                        <span>📜</span>
                        <span><b className="text-stone-300 uppercase tracking-tighter">Aition:</b> {f.fullFestival.aition}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer note */}
        <div className="px-5 pt-3 pb-4 border-t border-sky-900/30 text-center space-y-2">
          <p className="text-xs text-sky-400/70 font-serif leading-relaxed">
            Νουμηνία (día 1) es el primer creciente visible, un día tras la conjunción astronómica. El día ático comienza al atardecer — por ello esta fecha puede diferir ~2 días de otros cómputos lunares.
          </p>
          <p className="text-xs text-sky-400/55 font-serif leading-relaxed italic">
            Fecha según un modelo astronómico idealizado. El calendario civil ateniense se fijaba por decisión de los magistrados y podía diferir en días, o incluso en un mes entero, de este cálculo.
          </p>
        </div>

        <GreekMeanderBorder />

      </div>
    </div>
  );
};

export default HellenicCalendarInfo;

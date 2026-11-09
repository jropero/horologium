// --- START OF FILE components/RomanClock.tsx ---
import React, { useMemo, useState } from 'react';
import { RomanTimeData, WeatherData } from '../types';
import WeatherWidget from './WeatherWidget';
import RomanCalendarModal from './RomanCalendarModal';
import WeatherModal from './WeatherModal';
import { generateSkyline } from '../utils/skylineGenerator';
import { generateGreekSkyline } from '../utils/greekSkylineGenerator';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';
import { OVID_ASTRONOMICAL_EVENTS } from '../utils/ovidFastiData';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';
import { getSunAltitude, getTwilightTimes } from '../utils/solar';
import './RomanClock.css';

const lerpColor = (a: string, b: string, t: number): string => {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff;
  const br = (bh >> 16) & 0xff,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl2 = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl2
    .toString(16)
    .padStart(2, '0')}`;
};

interface RomanClockProps {
  modernTime: Date;
  romanTime: RomanTimeData;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
  locationTimezone: string;
  isTimeTraveling?: boolean;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function RomanClock({
  modernTime,
  romanTime,
  loading,
  weather,
  onUpdateLocation,
  currentLat,
  currentLng,
  locationTimezone,
  isTimeTraveling = false,
}: RomanClockProps) {
  const { civilization, labels } = useCivilization();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  const modernDate = modernTime.getDate();
  const modernMonth = modernTime.getMonth();

  const stars = useMemo(() => {
    const starData = [];
    for (let i = 0; i < 50; i++) {
      /* eslint-disable react-hooks/purity */
      starData.push({
        x: Math.random() * 300,
        y: Math.random() * 150,
        size: Math.random() * 2 + 0.5,
        rotation: Math.random() * 90,
        opacity: Math.random() * 0.7 + 0.3,
      });
      /* eslint-enable react-hooks/purity */
    }
    return starData;
  }, []);

  // Generar el skyline de forma procedural basándose en la fecha local
  const skylineElements = useMemo(() => {
    // Crear una semilla única para hoy (formato YYYYMMDD)
    const seed = modernTime.getFullYear() * 10000 + (modernMonth + 1) * 100 + modernDate;
    return civilization === 'rome' ? generateSkyline(seed) : generateGreekSkyline(seed);
  }, [modernDate, modernMonth, modernTime, civilization]);

  const ovidAstroEvent = useMemo(() => {
    if (civilization !== 'rome') return null;
    const currentMonth = modernMonth + 1;
    const currentDay = modernDate;
    return OVID_ASTRONOMICAL_EVENTS.find(e => e.month === currentMonth && e.day === currentDay);
  }, [modernDate, modernMonth, civilization]);

  const rainCode = weather?.current.code ?? 63;
  const rainIntensity = RAIN_INTENSITY[rainCode] ?? 0.45;

  const weatherParticles = useMemo(
    () => generateWeatherParticles(rainIntensity),
    [rainIntensity],
  );

  // Sun altitude in degrees: positive = above horizon, 0 = horizon, -6 = civil twilight end
  const sunAltitude = useMemo(
    () => getSunAltitude(modernTime, currentLat, currentLng),
    [modernTime, currentLat, currentLng],
  );

  // Stars fade in/out across civil twilight band: 0 at horizon, 1 at -6°
  const starOpacity = sunAltitude > 0 ? 0 : Math.max(0, Math.min(1, -sunAltitude / 6));

  const calendarDay = Math.floor(modernTime.getTime() / 86400000);
  const twilightTimes = useMemo(
    () => getTwilightTimes(modernTime, currentLat, currentLng),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calendarDay, currentLat, currentLng],
  );

  // Civil and nautical twilight windows, shown whenever sun is below horizon within nautical band
  const twilightInfo = useMemo(() => {
    if (romanTime.isDay || sunAltitude <= -12 || sunAltitude > 0) return null;
    const isMorning = modernTime < romanTime.sunrise;
    const fmt = (d: Date | null) =>
      d
        ? d.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: locationTimezone,
          })
        : null;

    return {
      civil: {
        start: fmt(isMorning ? twilightTimes.civilMorning : romanTime.sunset),
        end: fmt(isMorning ? romanTime.sunrise : twilightTimes.civilEvening),
      },
      nautical: {
        start: fmt(isMorning ? twilightTimes.nauticalMorning : twilightTimes.civilEvening),
        end: fmt(isMorning ? twilightTimes.civilMorning : twilightTimes.nauticalEvening),
      },
    };
  }, [romanTime, modernTime, sunAltitude, twilightTimes, locationTimezone]);

  const progressPercent = useMemo(() => {
    if (!romanTime) return 0;

    const baseTime = romanTime.isDay ? romanTime.sunrise : romanTime.sunset;
    const totalDiffMinutes = (modernTime.getTime() - baseTime.getTime()) / 60000;
    const minutesIntoHour = totalDiffMinutes % romanTime.hourLengthMinutes;

    const hourIndex = romanTime.romanHour - 1;

    const percent = (hourIndex + minutesIntoHour / romanTime.hourLengthMinutes) / 12;
    return Math.min(Math.max(percent, 0), 1);
  }, [romanTime, modernTime]);

  const renderMoon = (phase: number) => {
    const r = 16;
    const normalizedPhase = ((phase % 1) + 1) % 1; // Seguridad 0-1
    const isWaxing = normalizedPhase <= 0.5;

    // 1 para Creciente (arco base a la derecha), 0 para Menguante (arco base a la izquierda)
    const sweep1 = isWaxing ? 1 : 0;

    // Ancho de la elipse difuminadora (Terminator)
    const rx = Math.max(0.1, r * Math.abs(Math.cos(normalizedPhase * Math.PI * 2)));

    // Sweep del terminador basado en el cuartil
    const sweep2 =
      (normalizedPhase > 0.25 && normalizedPhase <= 0.5) || normalizedPhase > 0.75 ? 1 : 0;

    const d = `M 0 -${r} A ${r} ${r} 0 0 ${sweep1} 0 ${r} A ${rx} ${r} 0 0 ${sweep2} 0 -${r} Z`;

    const maskId = `moon-mask-${normalizedPhase.toFixed(3)}`;

    const MoonTexture = ({ color, opacity = 1 }: { color: string; opacity?: number }) => (
      <g fill={color} opacity={opacity}>
        <circle cx="4" cy="5" r="3" />
        <circle cx="-5" cy="2" r="2.5" />
        <circle cx="-8" cy="-3" r="1.5" />
        <circle cx="3" cy="-6" r="2" />
        <ellipse cx="6" cy="-1" rx="2" ry="3" transform="rotate(30 6 -1)" />
        <ellipse cx="-2" cy="-8" rx="1.5" ry="2" transform="rotate(-20 -2 -8)" />
      </g>
    );

    return (
      <g transform="rotate(-15)">
        <defs>
          <clipPath id={maskId}>
            <path d={d} />
          </clipPath>

          <radialGradient id="moon-light" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f4e8c1" />
            <stop offset="100%" stopColor="#c2b28f" />
          </radialGradient>

          <radialGradient id="moon-dark" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="100%" stopColor="#121212" />
          </radialGradient>

          <filter id="moon-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="0" cy="0" r={r} fill="url(#moon-dark)" />
        <MoonTexture color="#000000" opacity={0.3} />

        <g clipPath={`url(#${maskId})`} filter="url(#moon-glow)">
          <circle cx="0" cy="0" r={r} fill="url(#moon-light)" />
          <MoonTexture color="#968661" opacity={0.5} />
        </g>

        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#e3d6b3"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </g>
    );
  };

  const weatherCond = weather?.current.condition ?? 'clear';
  const windGusts = weather?.current.windGusts ?? 0;
  const isOffline = !!weather?.isOffline || !!weather?.aurora;

  if (loading) {
    return (
      <div className="roman-clock__loading">
        <span className="roman-clock__loading-text">{labels.loadingText}</span>
      </div>
    );
  }

  const angle = 180 - progressPercent * 180;
  const rad = (angle * Math.PI) / 180;
  const pathRadius = 120;
  const cx = 150;
  const cy = 180;

  const objectX = cx + pathRadius * Math.cos(rad);
  const objectY = cy - pathRadius * Math.sin(rad);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const getSkyGradient = () => {
    if (weatherCond === 'fog') {
      if (romanTime.isDay)
        return 'linear-gradient(to bottom, #8aabcc 0%, #c5d8e4 55%, #e5e7eb 100%)';
      if (sunAltitude > -18) {
        const warmth = Math.max(0, Math.min(1, 1 + sunAltitude / 6));
        const dim = Math.max(0, Math.min(1, 1 + sunAltitude / 18));
        const base = Math.max(warmth, dim * 0.5);
        return `linear-gradient(to bottom, ${lerpColor(
          '#1f2937',
          '#374151',
          1 - base,
        )} 0%, ${lerpColor('#1f2937', '#6b7280', base * 0.4)} 100%)`;
      }
      return 'linear-gradient(to bottom, #1f2937 0%, #374151 100%)';
    }
    if (weatherCond === 'snow') {
      if (romanTime.isDay)
        return 'linear-gradient(to bottom, #6b7280 0%, #9ca3af 40%, #e5e7eb 100%)';
      if (sunAltitude > -18) {
        const warmth = Math.max(0, Math.min(1, 1 + sunAltitude / 6));
        const dim = Math.max(0, Math.min(1, 1 + sunAltitude / 18));
        const base = Math.max(warmth, dim * 0.5);
        return `linear-gradient(to bottom, ${lerpColor(
          '#111827',
          '#1f2937',
          1 - base,
        )} 0%, ${lerpColor('#1f2937', '#6b7280', base * 0.5)} 60%, #374151 100%)`;
      }
      return 'linear-gradient(to bottom, #111827 0%, #1f2937 60%, #374151 100%)';
    }
    if (romanTime.isDay) {
      if (progressPercent < 0.15) {
        return 'linear-gradient(to bottom, #2b4162 0%, #fa9c7a 60%, var(--parchment) 100%)';
      } else if (progressPercent > 0.85) {
        return 'linear-gradient(to bottom, #1e3b70 0%, #29539b 40%, #fd746c 80%, var(--parchment) 100%)';
      }
      if (weatherCond === 'partly-cloudy') {
        return 'linear-gradient(to bottom, #8aa3c2 0%, #cbd5e1 60%, var(--parchment) 100%)';
      }
      if (weatherCond === 'cloudy') {
        return 'linear-gradient(to bottom, #94a3b8 0%, #cbd5e1 60%, #e2e8f0 100%)';
      }
      if (weatherCond === 'rain' || weatherCond === 'storm') {
        return 'linear-gradient(to bottom, #334155 0%, #475569 50%, #64748b 100%)';
      }
      return 'linear-gradient(to bottom, #4a90e2 0%, #87ceeb 60%, var(--parchment) 100%)';
    }
    // Twilight: cover civil (-6°), nautical (-12°), and astronomical (-18°) bands.
    // warmth drives amber/gold (civil only); dim drives the blue glow through all bands.
    if (sunAltitude > -18) {
      const warmth = Math.max(0, Math.min(1, 1 + sunAltitude / 6));
      const dim = Math.max(0, Math.min(1, 1 + sunAltitude / 18));
      const c1 = lerpColor('#060d1c', '#1b2f6e', Math.max(warmth, dim * 0.5));
      const c2 = lerpColor('#0d1117', '#3730a3', Math.max(warmth * 0.9, dim * 0.4));
      const c3 = lerpColor('#0d1117', '#b45309', warmth);
      const c4 = lerpColor('#0a1020', '#d97706', warmth);
      return `linear-gradient(to bottom, ${c1} 0%, ${c2} 35%, ${c3} 65%, ${c4} 100%)`;
    }
    return 'linear-gradient(to bottom, #0f172a 0%, var(--ink) 100%)';
  };

  let calendarWidgetContent: React.ReactNode = null;
  if (civilization === 'rome') {
    calendarWidgetContent = (
      <>
        <div className="roman-clock__cal-date-row">
          <span className="roman-clock__cal-dow">{romanTime.dayOfWeek}</span>
          <span className="roman-clock__cal-sep">|</span>
          <span>{romanTime.romanDateString}</span>
          {romanTime.isMarketDay && <span className="roman-clock__cal-nundinae">Nundinae</span>}
        </div>
        <div className="roman-clock__cal-date-full">{romanTime.romanDateFull}</div>
        <div className="roman-clock__cal-moon-row">
          <span className="roman-clock__cal-nundinal">{romanTime.nundinalLetter}</span>
          <span>{romanTime.moonPhaseLabel}</span>
          <span className="roman-clock__cal-sep-dot">•</span>
          <span>Sol in {romanTime.zodiacSign}</span>
        </div>
      </>
    );
  } else if (romanTime.atticDate) {
    calendarWidgetContent = (
      <>
        <div className="roman-clock__cal-hellas-header">
          <span className="roman-clock__cal-hellas-moon-icon">☾</span>
          <span>{romanTime.atticDate.monthName}</span>
        </div>
        <div className="roman-clock__cal-hellas-translit">
          {transliterateGreek(romanTime.atticDate.monthName)}
        </div>
        <div className="roman-clock__cal-hellas-short">{romanTime.atticDate.spanishShort}</div>
        <div className="roman-clock__cal-hellas-moon-row">
          <span>{romanTime.moonPhaseLabel}</span>
          <span className="roman-clock__cal-hellas-sep">•</span>
          <span className="roman-clock__cal-hellas-zodiac">
            {translateGreekUI(romanTime.zodiacSign)}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="roman-clock">
        <div className="woodcut-border roman-clock__inner">
          <div className="roman-clock__hero">
            <div className="woodcut-hatch roman-clock__sky-hatch"></div>
            <div className="roman-clock__stardust"></div>

            <div
              className="roman-clock__sky"
              style={{
                background: getSkyGradient(),
                opacity: 1,
              }}
            ></div>

            {/* Offline / slow-fetch aurora sky — an opacity layer so it crossfades with the real sky
                (gradients can't be transitioned). Matches AURORA_FADE_MS in WeatherSvgEffects. */}
            <div
              className="roman-clock__aurora"
              style={{
                background: romanTime.isDay
                  ? 'linear-gradient(to bottom, #1a3526 0%, #27503a 55%, #1e4030 100%)'
                  : 'linear-gradient(to bottom, #030806 0%, #080f0a 65%, #0b1a0e 100%)',
                opacity: isOffline ? 1 : 0,
              }}
            />

            {weatherCond === 'storm' && (
              <div className="anim-lightning roman-clock__lightning" />
            )}

            {weatherCond === 'fog' && !romanTime.isDay && (
              <div
                className="roman-clock__fog-night"
                style={{
                  top: '57.5%',
                  background:
                    'linear-gradient(to bottom, transparent 0%, rgba(209,213,219,0.60) 40%, rgba(229,231,235,0.81) 100%)',
                }}
              />
            )}

            <div className="roman-clock__svg-container">
              <svg viewBox="0 0 300 200" className="roman-clock__svg">
                {/* CAPA 1: Estrellas y arco */}
                <g style={{ opacity: starOpacity, transition: 'opacity 2000ms ease-in-out' }}>
                  {stars.map((star, i) => (
                    <path
                      key={i}
                      d={`M ${star.x} ${star.y - star.size} 
                                  Q ${star.x + star.size / 4} ${star.y - star.size / 4} ${
                                    star.x + star.size
                                  } ${star.y} 
                                  Q ${star.x + star.size / 4} ${star.y + star.size / 4} ${
                                    star.x
                                  } ${star.y + star.size} 
                                  Q ${star.x - star.size / 4} ${star.y + star.size / 4} ${
                                    star.x - star.size
                                  } ${star.y} 
                                  Q ${star.x - star.size / 4} ${star.y - star.size / 4} ${
                                    star.x
                                  } ${star.y - star.size} Z`}
                      fill="#e3d6b3"
                      fillOpacity={star.opacity}
                      transform={`rotate(${star.rotation} ${star.x} ${star.y})`}
                    />
                  ))}
                  <path
                    d="M 50 40 L 80 50 L 100 70 L 120 60"
                    stroke="#e3d6b3"
                    strokeWidth="0.5"
                    strokeDasharray="1 1"
                    opacity="0.4"
                    fill="none"
                  />
                  <path
                    d="M 220 30 L 250 45 L 260 80"
                    stroke="#e3d6b3"
                    strokeWidth="0.5"
                    strokeDasharray="1 1"
                    opacity="0.4"
                    fill="none"
                  />
                </g>

                <path
                  d="M 30 180 A 120 120 0 0 1 270 180"
                  fill="none"
                  stroke="#cfb53b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />

                {/* CAPA 2: El Sol y la Luna */}
                <g
                  transform={`translate(${objectX}, ${objectY})`}
                  style={
                    (weatherCond === 'rain' ||
                      weatherCond === 'storm' ||
                      weatherCond === 'snow' ||
                      weatherCond === 'fog') &&
                    romanTime.isDay
                      ? { filter: 'blur(2.5px)', opacity: 0.45 }
                      : undefined
                  }
                >
                  {romanTime.isDay ? (
                    <g className="roman-clock__sun">
                      <circle r="10" fill="#cfb53b" stroke="#8a7826" strokeWidth="1" />
                      {[...Array(12)].map((_, i) => (
                        <React.Fragment key={i}>
                          <line
                            x1="0"
                            y1="-14"
                            x2="0"
                            y2="-20"
                            stroke="#cfb53b"
                            strokeWidth="1.5"
                            transform={`rotate(${i * 30})`}
                          />
                          <path
                            d="M -2 -14 L 0 -18 L 2 -14"
                            fill="#cfb53b"
                            transform={`rotate(${i * 30 + 15})`}
                          />
                        </React.Fragment>
                      ))}
                    </g>
                  ) : (
                    renderMoon(romanTime.moonPhase)
                  )}
                </g>

                {/* CAPA 2.5: Efectos climáticos (Lluvia, Nieve, Nubes y Rayos) */}
                {/* Always mounted (also for 'clear') so the aurora can crossfade out */}
                <g className="roman-clock__weather-effects">
                  <WeatherSvgEffects
                    condition={weatherCond}
                    weatherParticles={weatherParticles}
                    fogGradientId="fog-ground-roman"
                    rainIntensity={rainIntensity}
                    windGusts={windGusts}
                    offline={isOffline}
                  />
                </g>

                {/* CAPA 3: El suelo oscuro y el Skyline Procedural */}
                <g
                  className="city-skyline"
                  style={
                    weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined
                  }
                >
                  {skylineElements.map(el => (
                    <path
                      key={el.id}
                      d={el.path}
                      fill="var(--ink)"
                      stroke="var(--gold-dim)"
                      strokeWidth="0.5"
                      opacity={el.opacity}
                    />
                  ))}
                </g>
                <g
                  style={
                    weatherCond === 'fog' ? { filter: 'blur(1.8px)', opacity: 0.5 } : undefined
                  }
                >
                  <path
                    d="M 0 180 L 300 180 L 300 200 L 0 200 Z"
                    fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'}
                  />
                  <path
                    d="M 0 180 Q 50 160 100 180 T 200 180 T 300 180 V 200 H 0 Z"
                    fill={weatherCond === 'snow' ? '#dde1e7' : 'var(--ink)'}
                    stroke={weatherCond === 'snow' ? '#f0f4f8' : 'var(--gold-dim)'}
                    strokeWidth="1"
                  />
                  {weatherCond === 'snow' && (
                    <path
                      d="M 0 180 Q 50 173 100 180 T 200 178 T 300 180 V 175 Q 250 172 200 175 T 100 177 T 0 175 Z"
                      fill="#f0f4f8"
                      opacity="0.9"
                    />
                  )}

                  {/* CAPA 4: El Gnomon (Día) o La Clepsidra (Noche) */}
                  <defs>
                    <clipPath id="upper-vessel-clip">
                      <path d="M 136 135 L 146 155 L 154 155 L 164 135 Z" />
                    </clipPath>
                    <clipPath id="lower-vessel-clip">
                      <path d="M 146 160 L 136 180 L 164 180 L 154 160 Z" />
                    </clipPath>
                    <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
                    </linearGradient>
                  </defs>

                  {romanTime.isDay ? (
                    <g>
                      {/* Pedestal iluminado para que resalte la base */}
                      <ellipse cx="150" cy="180" rx="70" ry="14" fill="#8a7826" opacity="0.2" />
                      <ellipse
                        cx="150"
                        cy="180"
                        rx="60"
                        ry="10"
                        fill="#e3d6b3"
                        opacity="0.15"
                      />

                      {/* Sombra proyectada */}
                      <line
                        x1="150"
                        y1="180"
                        x2={150 - Math.cos(rad) * 90}
                        y2={185 + (1 - Math.sin(rad)) * 14}
                        stroke="var(--hatch-color)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        opacity="0.4"
                        className="roman-clock__svg-transition"
                      />

                      {/* El Gnomon de bronce */}
                      <path
                        d="M 147 180 L 153 180 L 150 145 Z"
                        fill="#cfb53b"
                        stroke="#8a7826"
                        strokeWidth="0.5"
                      />
                      <circle cx="150" cy="145" r="3" fill="#e3d6b3" />
                    </g>
                  ) : (
                    <g className="roman-clock__svg-transition">
                      {/* Pedestal atenuado para la clepsidra */}
                      <ellipse cx="150" cy="180" rx="30" ry="6" fill="#8a7826" opacity="0.1" />

                      {/* Estructura Metálica Central (Soportes) */}
                      <path
                        d="M 132 133 Q 120 155 132 181"
                        stroke="#cfb53b"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.5"
                      />
                      <path
                        d="M 168 133 Q 180 155 168 181"
                        stroke="#cfb53b"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.5"
                      />

                      {/* Vaso Superior */}
                      <ellipse
                        cx="150"
                        cy="135"
                        rx="14"
                        ry="3"
                        fill="none"
                        stroke="#cfb53b"
                        strokeWidth="0.75"
                        opacity="0.8"
                      />
                      <path
                        d="M 136 135 L 146 155 L 154 155 L 164 135"
                        fill="#ffffff"
                        opacity="0.05"
                        stroke="#e3d6b3"
                        strokeWidth="0.5"
                      />

                      {/* Agua Vaso Superior (disminuye) */}
                      <g clipPath="url(#upper-vessel-clip)">
                        <rect
                          x="130"
                          y={135 + 20 * progressPercent}
                          width="40"
                          height="20"
                          fill="url(#water-grad)"
                        />
                        {progressPercent < 1 && (
                          <ellipse
                            cx="150"
                            cy={135 + 20 * progressPercent}
                            rx={14 - 10 * progressPercent}
                            ry={1}
                            fill="#87ceeb"
                            opacity="0.6"
                          />
                        )}
                      </g>

                      {/* Hilo de goteo (Animado) */}
                      {progressPercent < 0.99 && (
                        <line
                          x1="150"
                          y1="155"
                          x2="150"
                          y2={180 - 20 * progressPercent}
                          stroke="#87ceeb"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            values="6;0"
                            dur="0.3s"
                            repeatCount="indefinite"
                          />
                        </line>
                      )}

                      {/* Vaso Inferior */}
                      <ellipse
                        cx="150"
                        cy="180"
                        rx="14"
                        ry="3"
                        fill="none"
                        stroke="#cfb53b"
                        strokeWidth="0.75"
                        opacity="0.8"
                      />
                      <path
                        d="M 146 160 L 136 180 L 164 180 L 154 160"
                        fill="#ffffff"
                        opacity="0.05"
                        stroke="#e3d6b3"
                        strokeWidth="0.5"
                      />

                      {/* Agua Vaso Inferior (aumenta) */}
                      <g clipPath="url(#lower-vessel-clip)">
                        <rect
                          x="130"
                          y={180 - 20 * progressPercent}
                          width="40"
                          height="30"
                          fill="url(#water-grad)"
                        />
                        {progressPercent > 0 && (
                          <ellipse
                            cx="150"
                            cy={180 - 20 * progressPercent}
                            rx={14 - 10 * (1 - progressPercent)}
                            ry={1}
                            fill="#87ceeb"
                            opacity="0.6"
                          />
                        )}
                      </g>

                      {/* Base de los vasos (Conector central) */}
                      <rect x="145" y="155" width="10" height="5" fill="#8a7826" />
                      <path d="M 144 155 L 156 155" stroke="#cfb53b" strokeWidth="1" />
                      <path d="M 144 160 L 156 160" stroke="#cfb53b" strokeWidth="1" />

                      {/* Picos de la Escala Métrica (Marcas de horas) */}
                      {[...Array(12)].map((_, i) => (
                        <line
                          key={`clep-scale-${i}`}
                          x1="133"
                          y1={180 - (20 / 12) * i}
                          x2="135"
                          y2={180 - (20 / 12) * i}
                          stroke="#8a7826"
                          strokeWidth="0.5"
                          opacity="0.8"
                        />
                      ))}
                    </g>
                  )}
                </g>
                {/* end fog-blur group: ground + central element */}
              </svg>
            </div>
          </div>

          {/* Ovidian Lore Widgets (Moved below solar clock) */}
          {civilization === 'rome' && ovidAstroEvent && (
            <div className="roman-clock__ovid-container">
              {/* Epic 2: Astronomical Omen */}
              {ovidAstroEvent && (
                <div className="roman-clock__ovid-widget">
                  <div className="roman-clock__ovid-header">
                    <span className="roman-clock__ovid-emoji">✨</span>
                    <span className="roman-clock__ovid-label">Omen Astrorum</span>
                  </div>
                  <p className="roman-clock__ovid-text">&quot;{ovidAstroEvent.text}&quot;</p>
                  <span className="roman-clock__ovid-ref">
                    — Fasti, {ovidAstroEvent.reference}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="roman-clock__info">
            <h2 className="responsive-wrap roman-clock__hour-name">{romanTime.hourName}</h2>
            {civilization === 'hellas' && (
              <div className="roman-clock__hellas-block">
                <div className="roman-clock__hellas-translit">
                  {transliterateGreek(romanTime.hourName)}
                </div>
                <div className="roman-clock__hellas-translation">
                  {translateGreekUI(romanTime.hourName)}
                </div>
              </div>
            )}
            <div className="roman-clock__content">
              {/* Dies / Nox */}
              <div className="roman-clock__dies-nox-wrapper">
                <div className="roman-clock__dies-nox-label">
                  <span className="roman-clock__fleuron">❧</span>
                  <span>{romanTime.isDay ? labels.dayLabel : labels.nightLabel}</span>
                  <span className="roman-clock__fleuron">☙</span>
                </div>
                {romanTime.vigilia && (
                  <div className="roman-clock__vigilia">
                    {civilization === 'rome' ? '⚔' : '🛡'} {romanTime.vigilia.name}{' '}
                    {civilization === 'rome' ? '⚔' : '🛡'}
                  </div>
                )}
              </div>

              {/* Pars Diei Civilis */}
              <div className="roman-clock__section">
                <div className="roman-clock__section-heading">{labels.civilDayPartLabel}</div>
                {civilization === 'rome' ? (
                  <>
                    <div className="roman-clock__civil-name">{romanTime.civilDayPart.name}</div>
                    <div className="roman-clock__civil-desc">{romanTime.civilDayPart.desc}</div>
                  </>
                ) : (
                  <>
                    <div className="roman-clock__civil-name">{romanTime.civilDayPart.name}</div>
                    <div className="roman-clock__civil-translit">
                      {transliterateGreek(romanTime.civilDayPart.name)}
                    </div>
                    <div className="roman-clock__civil-desc-hellas">
                      {romanTime.civilDayPart.desc}
                    </div>
                  </>
                )}
              </div>

              {/* Rector Horae + Tutela Mensis — always side by side */}
              <div className="roman-clock__grid-2">
                <div className="roman-clock__col-left">
                  <div className="roman-clock__col-heading">{labels.planetaryRulerLabel}</div>
                  {civilization === 'rome' ? (
                    <span className="roman-clock__latin-val">{romanTime.planetaryRuler}</span>
                  ) : (
                    <>
                      <span className="roman-clock__greek-name">
                        {romanTime.planetaryRuler}
                      </span>
                      <span className="roman-clock__greek-translit">
                        {transliterateGreek(romanTime.planetaryRuler)}
                      </span>
                      <span className="roman-clock__greek-translation">
                        {translateGreekUI(romanTime.planetaryRuler)}
                      </span>
                    </>
                  )}
                </div>
                <div className="roman-clock__col-right">
                  <div className="roman-clock__col-heading">{labels.monthTutelaLabel}</div>
                  {civilization === 'rome' ? (
                    <span className="roman-clock__latin-val">{romanTime.tutelaMensis}</span>
                  ) : (
                    <>
                      <span className="roman-clock__greek-name">{romanTime.tutelaMensis}</span>
                      <span className="roman-clock__greek-translit">
                        {transliterateGreek(romanTime.tutelaMensis)}
                      </span>
                      <span className="roman-clock__greek-translation">
                        {translateGreekUI(romanTime.tutelaMensis)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Ortus / Occasus / Longitudo Horae */}
              <div className="roman-clock__grid-3">
                <div className="roman-clock__time-col">
                  <span className="roman-clock__time-icon">☀︎</span>
                  <div className="roman-clock__time-heading">Ortus Solis</div>
                  <div className="roman-clock__time-val">
                    {romanTime.sunrise.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: locationTimezone,
                    })}
                  </div>
                </div>
                <div className="roman-clock__time-col roman-clock__time-col--mid">
                  <span className="roman-clock__time-icon">⧗</span>
                  <div className="roman-clock__time-heading">Longitudo Horae</div>
                  <div className="roman-clock__time-val">
                    {Math.round(romanTime.hourLengthMinutes)} minuta
                  </div>
                </div>
                <div className="roman-clock__time-col">
                  <span className="roman-clock__time-icon">☾</span>
                  <div className="roman-clock__time-heading">Occasus Solis</div>
                  <div className="roman-clock__time-val">
                    {romanTime.sunset.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: locationTimezone,
                    })}
                  </div>
                </div>
              </div>

              {twilightInfo && (
                <div className="roman-clock__twilight">
                  {[
                    { label: 'Crepusculum civile', ...twilightInfo.civil },
                    { label: 'Crepusculum nauticum', ...twilightInfo.nautical },
                  ].map(({ label, start, end }) => (
                    <div key={label} className="roman-clock__twilight-row">
                      <div className="roman-clock__twilight-label">{label}</div>
                      <div className="roman-clock__twilight-time">
                        {start} → {end}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="roman-clock__widgets">
          {/* Single Column Layout for all Widgets */}
          <div className="roman-clock__widgets-inner">
            {weather && (civilization === 'rome' || civilization === 'hellas') && (
              <div className="roman-clock__weather-wrap">
                <WeatherWidget
                  weather={weather}
                  onClick={() => setIsWeatherOpen(true)}
                  className="clickable"
                />
              </div>
            )}

            <div
              role={civilization === 'rome' ? 'button' : undefined}
              tabIndex={civilization === 'rome' ? 0 : undefined}
              onClick={civilization === 'rome' ? () => setIsCalendarOpen(true) : undefined}
              onKeyDown={
                civilization === 'rome'
                  ? e => {
                      if (e.key === 'Enter' || e.key === ' ') setIsCalendarOpen(true);
                    }
                  : undefined
              }
              className={`calendar-header-widget roman-clock__cal-widget ${
                civilization === 'hellas'
                  ? 'roman-clock__cal-widget--hellas'
                  : 'roman-clock__cal-widget--rome'
              }`}
              title={civilization === 'rome' ? 'Ver Calendario' : undefined}
            >
              {calendarWidgetContent}
            </div>
          </div>
        </div>
      </div>

      {civilization === 'rome' && (
        <RomanCalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          startDate={modernTime}
        />
      )}

      <WeatherModal
        isOpen={isWeatherOpen}
        onClose={() => setIsWeatherOpen(false)}
        weather={weather}
        onUpdateLocation={onUpdateLocation}
        currentLat={currentLat}
        currentLng={currentLng}
        isTimeTraveling={isTimeTraveling}
        travelDate={isTimeTraveling ? modernTime : undefined}
      />
    </>
  );
}

export default RomanClock;
// --- END OF FILE components/RomanClock.tsx ---

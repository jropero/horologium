// --- START OF FILE components/RomanClock.tsx ---
import React, { useMemo, useState } from 'react';
import { RomanTimeData, WeatherData } from '../types';
import WeatherWidget from './WeatherWidget';
import RomanCalendarModal from './RomanCalendarModal';
import WeatherModal from './WeatherModal';
import { lerpColor } from '../utils/color';
import RomanScene from './RomanScene';
import HellenicScene from './HellenicScene';
import SceneWeather from './SceneWeather';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';
import { OVID_ASTRONOMICAL_EVENTS } from '../utils/ovidFastiData';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import WeatherSvgEffects from './WeatherSvgEffects';
import { getSunAltitude, getTwilightTimes } from '../utils/solar';
import './RomanClock.css';

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

  // Semilla única para hoy (formato YYYYMMDD): el paisaje cambia cada día
  const skylineSeed = modernTime.getFullYear() * 10000 + (modernMonth + 1) * 100 + modernDate;

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
    // romanTime.sunrise is the sunrise that opened the current planetary day (yesterday's when
    // it's night-time), so we cannot use it to detect morning twilight. Instead we compare
    // proximity to sunset vs nextSunrise: whichever is closer tells us which twilight we're in.
    const isMorning =
      romanTime.nextSunrise.getTime() - modernTime.getTime() <
      modernTime.getTime() - romanTime.sunset.getTime();
    const fmt = (d: Date | null) =>
      d
        ? d.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: locationTimezone,
          })
        : null;

    // "Crepusculum" = evening twilight; "Diluculum" = morning twilight (Pliny, NH II.188)
    const prefix = isMorning ? 'Diluculum' : 'Crepusculum';
    return {
      isMorning,
      prefix,
      civil: {
        start: fmt(isMorning ? twilightTimes.civilMorning : romanTime.sunset),
        end: fmt(isMorning ? romanTime.nextSunrise : twilightTimes.civilEvening),
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

  // Always mounted (also for 'clear') so the aurora can crossfade out. Both scenes
  // (RomanScene, HellenicScene) bring their own effects.
  const weatherLayer = (
    <g className="roman-clock__weather-effects">
      <WeatherSvgEffects
        condition={weatherCond}
        weatherParticles={weatherParticles}
        fogGradientId="fog-ground-roman"
        rainIntensity={rainIntensity}
        windGusts={windGusts}
        offline={isOffline}
        auroraLayers={weather?.auroraLayers}
        effects={
          <SceneWeather
            condition={weatherCond}
            weatherParticles={weatherParticles}
            rainIntensity={rainIntensity}
            windGusts={windGusts}
          />
        }
      />
    </g>
  );

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
                {civilization === 'rome' ? (
                  <RomanScene
                    seed={skylineSeed}
                    isDay={romanTime.isDay}
                    progress={progressPercent}
                    sunAltitude={sunAltitude}
                    moonPhase={romanTime.moonPhase}
                    starOpacity={starOpacity}
                    weatherCond={weatherCond}
                    aurora={isOffline}
                  >
                    {weatherLayer}
                  </RomanScene>
                ) : (
                  <HellenicScene
                    seed={skylineSeed}
                    isDay={romanTime.isDay}
                    progress={progressPercent}
                    sunAltitude={sunAltitude}
                    moonPhase={romanTime.moonPhase}
                    starOpacity={starOpacity}
                    weatherCond={weatherCond}
                    aurora={isOffline}
                    instrument
                  >
                    {weatherLayer}
                  </HellenicScene>
                )}
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
                  <div className="roman-clock__time-heading">
                    Ortus
                    <br />
                    Solis
                  </div>
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
                  <div className="roman-clock__time-heading">
                    Longitudo
                    <br />
                    Horae
                  </div>
                  <div className="roman-clock__time-val">
                    {Math.round(romanTime.hourLengthMinutes)} minuta
                  </div>
                </div>
                <div className="roman-clock__time-col">
                  <span className="roman-clock__time-icon">☾</span>
                  <div className="roman-clock__time-heading">
                    Occasus
                    <br />
                    Solis
                  </div>
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
                    { label: `${twilightInfo.prefix} civile`, ...twilightInfo.civil },
                    { label: `${twilightInfo.prefix} nauticum`, ...twilightInfo.nautical },
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

import React, { useMemo } from 'react';
import './EgyptianClock.css';
import { RomanTimeData, WeatherData } from '../types';
import { useCivilization } from '../contexts/CivilizationContext';
import { getEgyptianDate } from '../utils/egyptianCalendarUtils';
import { getEgyptianMonthDeity } from '../utils/egyptianCalendarData';
import { getHemerologyForDate, Prognosis } from '../utils/egyptianHemerologyData';
import { getEgyptianDayAnchor } from '../utils/egyptianTimeUtils';

interface EgyptianClockProps {
  modernTime: Date;
  romanTime: RomanTimeData;
  loading: boolean;
  weather: WeatherData | null;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

const EgyptianClock: React.FC<EgyptianClockProps> = ({
  modernTime,
  romanTime,
  loading,
  weather: _weather,
  onUpdateLocation: _onUpdateLocation,
  currentLat,
  currentLng,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { labels } = useCivilization();

  // Egyptian day begins at sunrise (same anchor as calculateEgyptianTime).
  const dayAnchorMs = getEgyptianDayAnchor(modernTime, currentLat, currentLng).getTime();

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const egyptianDateInfo = useMemo(() => {
    const eDate = getEgyptianDate(new Date(dayAnchorMs));
    const deity = getEgyptianMonthDeity(eDate.monthIndex);
    const hemerology = getHemerologyForDate(modernTime, eDate.monthIndex, eDate.dayOfMonth);

    let currentPrognosis: Prognosis;
    let partName: string;

    if (!romanTime.isDay) {
      currentPrognosis = hemerology.evening;
      partName = 'Noche';
    } else {
      if (romanTime.romanHour <= 4) {
        currentPrognosis = hemerology.morning;
        partName = 'Mañana';
      } else if (romanTime.romanHour <= 8) {
        currentPrognosis = hemerology.midday;
        partName = 'Mediodía';
      } else {
        currentPrognosis = hemerology.evening;
        partName = 'Tarde';
      }
    }

    return { eDate, deity, hemerology, currentPrognosis, partName };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayAnchorMs, romanTime.romanHour, romanTime.isDay]);

  if (loading) {
    return (
      <div className="egyptian-clock--loading">
        <span className="egyptian-clock__loading-text">{labels.loadingText}</span>
      </div>
    );
  }

  return (
    <div className="egyptian-clock animate-fadeIn">
      <div className="egyptian-clock__body">
        {/* Hour + prognosis */}
        <h2 className="egyptian-clock__hour-heading responsive-wrap">
          <span>Hora {romanTime.romanHour}</span>
          {egyptianDateInfo.currentPrognosis !== 'none' && (
            <div
              className={`egyptian-clock__prognosis-badge animate-fadeIn ${
                egyptianDateInfo.currentPrognosis === 'nefer'
                  ? 'egyptian-clock__prognosis-badge--nefer'
                  : 'egyptian-clock__prognosis-badge--aha'
              }`}
            >
              <span className="egyptian-clock__prognosis-icon">
                {egyptianDateInfo.currentPrognosis === 'nefer' ? '☀️' : '🦂'}
              </span>
              <span className="egyptian-clock__prognosis-text">
                {egyptianDateInfo.currentPrognosis === 'nefer' ? 'Nefer' : 'Aha'}
              </span>
            </div>
          )}
        </h2>

        {/* Date tracker */}
        {egyptianDateInfo.eDate.isEpagomenal ? (
          <div className="egyptian-clock__epagomenal">
            <span className="egyptian-clock__epagomenal-label">
              {egyptianDateInfo.eDate.seasonHieroglyphic} Días Epagómenos{' '}
              {egyptianDateInfo.eDate.seasonHieroglyphic}
            </span>
            <div className="egyptian-clock__epagomenal-day">
              Día {egyptianDateInfo.eDate.dayOfMonth}
            </div>
          </div>
        ) : (
          <div className="egyptian-clock__tracks">
            {[
              {
                label: 'Estación',
                items: [0, 1, 2],
                active: Math.floor(egyptianDateInfo.eDate.monthIndex / 4),
                text: egyptianDateInfo.eDate.seasonName,
                trackKey: 'season' as const,
              },
              {
                label: 'Mes',
                items: [0, 1, 2, 3],
                active: egyptianDateInfo.eDate.monthIndex % 4,
                text: egyptianDateInfo.eDate.monthName,
                trackKey: 'month' as const,
              },
              {
                label: 'Década',
                items: [0, 1, 2],
                active: egyptianDateInfo.eDate.decade - 1,
                text: `Día ${egyptianDateInfo.eDate.dayOfMonth}`,
                trackKey: 'decade' as const,
              },
            ].map(({ label, items, active, text, trackKey }) => (
              <div key={label} className="egyptian-clock__track-row responsive-wrap">
                <span className="egyptian-clock__track-label">{label}</span>
                <div className="egyptian-clock__track-bars">
                  {items.map((_, i) => {
                    let mod = '';
                    if (i === active) mod = `egyptian-clock__track-bar--${trackKey}-active`;
                    else if (i < active) mod = `egyptian-clock__track-bar--${trackKey}-done`;
                    return <div key={i} className={`egyptian-clock__track-bar ${mod}`} />;
                  })}
                </div>
                <span className="egyptian-clock__track-text">{text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Day/night + vigilia */}
        <div className="egyptian-clock__daynight">
          <div className="egyptian-clock__daynight-row">
            <div className="egyptian-clock__daynight-label">
              <span className="egyptian-clock__daynight-ornament">❧</span>
              <span>{romanTime.isDay ? labels.dayLabel : labels.nightLabel}</span>
              <span className="egyptian-clock__daynight-ornament">☙</span>
            </div>
            {romanTime.vigilia && (
              <div className="egyptian-clock__vigilia">𓊹 {romanTime.vigilia.name} 𓊹</div>
            )}
          </div>

          {/* Civil day part */}
          <div className="egyptian-clock__civil-part">
            <div className="egyptian-clock__civil-part-label">{labels.civilDayPartLabel}</div>
            <div className="egyptian-clock__civil-part-content">
              <span className="egyptian-clock__civil-part-name">
                {romanTime.civilDayPart.name}
              </span>
              <span className="egyptian-clock__civil-part-desc">
                {romanTime.civilDayPart.desc}
              </span>
            </div>
          </div>

          {/* Planetary ruler + deity */}
          <div className="egyptian-clock__info-row">
            <div className="egyptian-clock__info-item">
              <div className="egyptian-clock__info-label">{labels.planetaryRulerLabel}</div>
              <span className="egyptian-clock__ruler-name">{romanTime.planetaryRuler}</span>
            </div>
            <div className="egyptian-clock__divider-v" />
            <div className="egyptian-clock__divider-h" />
            <div className="egyptian-clock__info-item">
              <div className="egyptian-clock__info-label">{labels.monthTutelaLabel}</div>
              <span className="egyptian-clock__deity-name">{egyptianDateInfo.deity.deity}</span>
              <span className="egyptian-clock__deity-hieroglyphic">
                {egyptianDateInfo.deity.deityHieroglyphic}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EgyptianClock;

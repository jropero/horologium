import React from 'react';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { getChineseLunisolarDate } from '../utils/chineseLunisolarUtils';
import { WeatherData } from '../types';
import ChineseCalendarInfo from './ChineseCalendarInfo';
import ChineseAnimalClock from './ChineseAnimalClock';
import ChineseYearWheel from './ChineseYearWheel';
import ChineseDatePillars from './ChineseDatePillars';
import ChineseWeatherOracle from './ChineseWeatherOracle';
import './ChineseClock.css';

const TERM_SEASONS = [
  { hanzi: '春', es: 'Primavera', seasonKey: 'spring' },
  { hanzi: '夏', es: 'Verano', seasonKey: 'summer' },
  { hanzi: '秋', es: 'Otoño', seasonKey: 'autumn' },
  { hanzi: '冬', es: 'Invierno', seasonKey: 'winter' },
];

interface ChineseClockProps {
  modernTime: Date;
  weather?: WeatherData | null;
}

const ChineseClock: React.FC<ChineseClockProps> = ({ modernTime, weather }) => {
  const { term, pentad, daysUntilChange } = getChineseCalendarData(modernTime);
  const lunar = getChineseLunisolarDate(modernTime);
  const termSeasonIdx = Math.floor((term.id - 1) / 6);
  const termInSeason = ((term.id - 1) % 6) + 1;
  const season = TERM_SEASONS[termSeasonIdx];

  const getTermIndex = (termId: number) => termId - 1;

  return (
    <div className="chinese-clock">
      {/* 1. Término solar */}
      <div className="chinese-clock__term-card">
        <div className="chinese-clock__term-label">节气 TÉRMINO SOLAR</div>
        <div
          className={`chinese-clock__season-badge chinese-clock__season-badge--${season.seasonKey}`}
        >
          <span>{season.hanzi}</span>
          <span>{season.es}</span>
          <span className="chinese-clock__season-dot">·</span>
          <span>{termInSeason} / 6</span>
        </div>
        <h2 className="chinese-clock__term-hanzi">{term.hanzi}</h2>
        <div className="chinese-clock__term-translation">
          {term.pinyin} — {term.translation}
        </div>

        <div className="chinese-clock__divider">
          <div className="chinese-clock__pentad-text">
            {pentad}ª Pentada · {term.pentads[pentad - 1]?.description || ''}
          </div>
        </div>

        <div className="chinese-clock__change-note">Cambio en {daysUntilChange} días</div>
      </div>

      {/* 2. Ciclo del Año */}
      <div className="chinese-clock__section">
        <ChineseYearWheel currentTermIndex={getTermIndex(term.id)} weather={weather} />
      </div>

      {/* 3. Costumbres */}
      <div className="chinese-clock__section">
        <ChineseCalendarInfo term={term} pentad={pentad} />
      </div>

      {/* 3b. Weather Oracle */}
      {weather && <ChineseWeatherOracle weather={weather} />}

      {/* 4. Fecha lunisolar + Tres Pilares */}
      <div className="chinese-clock__section">
        <ChineseDatePillars
          yearStemIndex={lunar.yearStemIndex}
          yearBranchIndex={lunar.yearBranchIndex}
          monthStemIndex={lunar.monthStemIndex}
          monthBranchIndex={lunar.monthBranchIndex}
          dayStemIndex={lunar.dayStemIndex}
          dayBranchIndex={lunar.dayBranchIndex}
          monthName={lunar.monthName}
          monthNumber={lunar.monthNumber}
          dayName={lunar.dayName}
          dayNumber={lunar.dayNumber}
          lunarNewYear={lunar.lunarNewYear}
          isLeapYear={lunar.isLeapYear}
          isLeapMonth={lunar.isLeapMonth}
        />
      </div>

      {/* 6. Reloj de las horas */}
      <div className="chinese-clock__section--last">
        <ChineseAnimalClock modernTime={modernTime} />
      </div>
    </div>
  );
};

export default ChineseClock;

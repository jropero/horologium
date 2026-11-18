import React from 'react';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { getChineseLunisolarDate } from '../utils/chineseLunisolarUtils';
import { WeatherData } from '../types';
import ChineseCalendarInfo from './ChineseCalendarInfo';
import ChineseAnimalClock from './ChineseAnimalClock';
import ChineseYearWheel from './ChineseYearWheel';
import ChineseDatePillars from './ChineseDatePillars';
import ChineseWeatherOracle from './ChineseWeatherOracle';
import ChineseHero from './ChineseHero';
import './ChineseClock.css';

const TERM_CAPTIONS: Record<number, string> = {
  1: "El viento del este rompe el hielo del Qujiang: Chang'an despierta al primer aliento de la primavera.",
  2: 'Los gansos salvajes emprenden el vuelo hacia el norte sobre la bruma de tinta que envuelve el Qinling.',
  3: "El melocotonero estalla en flor y los insectos despiertan bajo la tierra aún húmeda de Chang'an.",
  4: 'Las golondrinas regresan rasando el Qujiang: el día y la noche se equilibran sobre la capital eterna.',
  5: "Un arco de luz atraviesa el Qinling tras la lluvia, y el aire de Chang'an brilla como jade recién lavado.",
  6: "La lenteja de agua florece en el Qujiang y la lluvia de los cereales bendice los campos de Chang'an.",
  7: "La enredadera trepa sobre la roca y el calor comienza a posarse sobre los tejados rojos de Chang'an.",
  8: "El trigo dora la meseta y Chang'an respira el olor de la cosecha que se acerca bajo el sol alto.",
  9: "El alcaudón canta desde la roca al pie del pino y los campos de Chang'an se llenan de espigas maduras.",
  10: "El ciervo suelta su cornamenta en el solsticio más largo: el sol alcanza su cenit sobre Chang'an.",
  11: 'Los jóvenes halcones aprenden a remontar el vuelo sobre el Leyou mientras el calor hace temblar el aire.',
  12: 'Las luciérnagas flotan sobre el Qujiang en la noche más cálida del año, hilos de luz entre la tinta.',
  13: "El rocío blanco toca la hierba del Leyou: el otoño llega sin avisar y Chang'an muda de piel.",
  14: "Los gavillas reposan sobre la meseta y el calor se retira; Chang'an recibe la abundancia del año.",
  15: "Los gansos emprenden el vuelo hacia el sur sobrevolando el Qinling: el otoño ya es dueño de Chang'an.",
  16: 'El Qujiang retrocede y deja al descubierto la orilla de barro: el equinoccio divide el año en silencio.',
  17: 'El crisantemo abre su flor amarilla en la meseta y el rocío frío anuncia el fin del tiempo cálido.',
  18: 'Las hojas amarillas caen en remolinos alrededor de los sauces y la escarcha pinta el amanecer de blanco.',
  19: "El primer hielo bordea las orillas del Qujiang y el invierno pone su mano sobre Chang'an.",
  20: 'El vapor del frío asciende del Qujiang como espíritus de tinta hacia el cielo gris de la pequeña nieve.',
  21: 'Los brotes de 荔 rompen la tierra helada: incluso en la gran nevada, la vida empuja hacia la luz.',
  22: 'Una grieta en el hielo revela el agua viva del Qujiang: el solsticio más oscuro guarda la semilla de la luz.',
  23: 'La urraca comienza su nido en el sauce desnudo: el frío más profundo no apaga el instinto de crear.',
  24: 'El gran frío agrieta el hielo del Qujiang bajo la nieve acumulada en sus orillas: el año llega a su último aliento.',
};

const TERM_SEASONS = [
  { hanzi: '春', es: 'Primavera', seasonKey: 'spring' },
  { hanzi: '夏', es: 'Verano', seasonKey: 'summer' },
  { hanzi: '秋', es: 'Otoño', seasonKey: 'autumn' },
  { hanzi: '冬', es: 'Invierno', seasonKey: 'winter' },
];

interface ChineseClockProps {
  modernTime: Date;
  weather?: WeatherData | null;
  /** Observer's location for the hero's sun, moon and twilight (defaults: Xi'an). */
  currentLat?: number;
  currentLng?: number;
}

const ChineseClock: React.FC<ChineseClockProps> = ({
  modernTime,
  weather,
  currentLat = 34.26,
  currentLng = 108.94,
}) => {
  const { term, pentad, daysUntilChange } = getChineseCalendarData(modernTime);
  const lunar = getChineseLunisolarDate(modernTime);
  const termSeasonIdx = Math.floor((term.id - 1) / 6);
  const termInSeason = ((term.id - 1) % 6) + 1;
  const season = TERM_SEASONS[termSeasonIdx];

  const getTermIndex = (termId: number) => termId - 1;

  return (
    <div className="chinese-clock">
      {/* 0. Hero: Tang Chang'an in ink wash (ChineseHero) */}
      <ChineseHero
        modernTime={modernTime}
        weather={weather}
        lat={currentLat}
        lng={currentLng}
      />

      {/* Caption — colophon below the hero, one sentence per solar term */}
      <p className="chinese-clock__caption">{TERM_CAPTIONS[term.id]}</p>

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

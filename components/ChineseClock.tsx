import React from 'react';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { getChineseLunisolarDate } from '../utils/chineseLunisolarUtils';
import ChineseCalendarInfo from './ChineseCalendarInfo';
import ChineseAnimalClock from './ChineseAnimalClock';
import ChineseYearWheel from './ChineseYearWheel';
import ChineseDatePillars from './ChineseDatePillars';

const TERM_SEASONS = [
  { hanzi: '春', es: 'Primavera', color: 'text-emerald-400', border: 'border-emerald-600/40', bg: 'bg-emerald-900/30' },
  { hanzi: '夏', es: 'Verano',    color: 'text-rose-400',    border: 'border-rose-600/40',    bg: 'bg-rose-900/30'    },
  { hanzi: '秋', es: 'Otoño',     color: 'text-amber-400',   border: 'border-amber-600/40',   bg: 'bg-amber-900/30'   },
  { hanzi: '冬', es: 'Invierno',  color: 'text-sky-400',     border: 'border-sky-600/40',     bg: 'bg-sky-900/30'     },
];


interface ChineseClockProps {
  modernTime: Date;
}

const ChineseClock: React.FC<ChineseClockProps> = ({ modernTime }) => {
  const { term, pentad, daysUntilChange } = getChineseCalendarData(modernTime);
  const lunar = getChineseLunisolarDate(modernTime);
  const termSeasonIdx = Math.floor((term.id - 1) / 6);
  const termInSeason = ((term.id - 1) % 6) + 1;
  const season = TERM_SEASONS[termSeasonIdx];

  const getTermIndex = (termId: number) => termId - 1;


  return (
    <div className="flex flex-col items-center px-4 pb-24 text-parchment w-full max-w-lg mx-auto">
      {/* 1. Término solar */}
      <div className="w-full bg-ink/90 border border-gold-leaf/30 rounded-lg p-6 text-center shadow-xl mb-8">
        <div className="text-gold-leaf font-serif text-sm uppercase tracking-[0.3em] mb-3">节气 TÉRMINO SOLAR</div>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-3 ${season.bg} ${season.border} ${season.color}`}>
          <span>{season.hanzi}</span>
          <span>{season.es}</span>
          <span className="opacity-50">·</span>
          <span>{termInSeason} / 6</span>
        </div>
        <h2 className="text-4xl font-serif text-gold-leaf mb-1">{term.hanzi}</h2>
        <div className="text-lg text-parchment/80 mb-4">{term.pinyin} — {term.translation}</div>

        <div className="border-t border-gold-dim/20 pt-4 mt-2">
          <div className="text-sm text-parchment-dark">{pentad}ª Pentada · {term.pentads[pentad - 1]?.description || ''}</div>
        </div>

        <div className="text-xs text-parchment-dark/80 mt-4 italic">
          Cambio en {daysUntilChange} días
        </div>
      </div>

      {/* 2. Ciclo del Año */}
      <div className="w-full mb-8">
        <ChineseYearWheel currentTermIndex={getTermIndex(term.id)} />
      </div>

      {/* 3. Costumbres */}
      <div className="w-full mb-8">
        <ChineseCalendarInfo term={term} pentad={pentad} />
      </div>

      {/* 4. Fecha lunisolar + Tres Pilares */}
      <div className="w-full mb-8">
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
      <div className="w-full mb-12">
        <ChineseAnimalClock modernTime={modernTime} />
      </div>
    </div>
  );
};

export default ChineseClock;

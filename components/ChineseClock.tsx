import React from 'react';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { getChineseLunisolarDate, STEMS, BRANCHES } from '../utils/chineseLunisolarUtils';
import ChineseCalendarInfo from './ChineseCalendarInfo';
import ChineseAnimalClock from './ChineseAnimalClock';
import ChineseYearCycle from './ChineseYearCycle';
import SexagenaryCycleCard from './SexagenaryCycleCard';

const ELEMENT_BG: Record<string, string> = {
  '木': 'bg-emerald-500/20 border-emerald-500/40',
  '火': 'bg-red-500/20 border-red-500/40',
  '土': 'bg-amber-500/20 border-amber-500/40',
  '金': 'bg-yellow-500/20 border-yellow-500/40',
  '水': 'bg-cyan-500/20 border-cyan-500/40',
};
const ELEMENT_TEXT: Record<string, string> = {
  '木': 'text-emerald-300',
  '火': 'text-red-300',
  '土': 'text-amber-300',
  '金': 'text-yellow-300',
  '水': 'text-cyan-300',
};

interface ChineseClockProps {
  modernTime: Date;
}

const ChineseClock: React.FC<ChineseClockProps> = ({ modernTime }) => {
  const { term, pentad, daysUntilChange } = getChineseCalendarData(modernTime);
  const lunar = getChineseLunisolarDate(modernTime);

  const getTermIndex = (termId: number) => termId - 1;

  const yearStemInfo = STEMS[lunar.yearStemIndex];
  const yearBranchInfo = BRANCHES[lunar.yearBranchIndex];
  const monthStemInfo = STEMS[lunar.monthStemIndex];
  const monthBranchInfo = BRANCHES[lunar.monthBranchIndex];
  const dayStemInfo = STEMS[lunar.dayStemIndex];
  const dayBranchInfo = BRANCHES[lunar.dayBranchIndex];

  const ElementChip = ({ stem, branch }: { stem: typeof STEMS[0]; branch: typeof BRANCHES[0] }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${ELEMENT_BG[stem.elementHanzi] || 'border-gold-dim/20'} text-xs`}>
      <span className="font-bold text-parchment">{stem.hanzi}{branch.hanzi}</span>
      <span className={ELEMENT_TEXT[stem.elementHanzi] || 'text-parchment/60'}>·</span>
      <span className={ELEMENT_TEXT[stem.elementHanzi] || 'text-parchment/60'}>{stem.elementEs}</span>
      <span className="text-lg">{branch.animal}</span>
      <span className="text-parchment/60 text-[10px]">{branch.animalEs}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center px-4 pb-24 text-parchment w-full max-w-lg mx-auto">
      {/* 1. Reloj de las horas */}
      <div className="w-full mb-8">
        <ChineseAnimalClock modernTime={modernTime} />
      </div>
      
      {/* 2. Término solar */}
      <div className="w-full bg-ink/90 border border-gold-leaf/30 rounded-lg p-6 text-center shadow-xl mb-8">
        <div className="text-gold-leaf font-serif text-sm uppercase tracking-[0.3em] mb-2">节气 TÉRMINO SOLAR</div>
        <h2 className="text-4xl font-serif text-gold-leaf mb-1">{term.hanzi}</h2>
        <div className="text-lg text-parchment/80 mb-4">{term.pinyin} — {term.translation}</div>
        
        <div className="border-t border-gold-dim/20 pt-4 mt-2">
            <div className="text-sm text-parchment-dark">{pentad}ª Pentada · {term.pentads[pentad - 1]?.description || ''}</div>
        </div>

        <div className="text-xs text-parchment-dark/80 mt-4 italic">
          Cambio en {daysUntilChange} días
        </div>
      </div>

      {/* 3. Fecha lunisolar */}
      <div className="w-full bg-ink/90 border border-gold-leaf/30 rounded-lg p-5 shadow-xl mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-gold-leaf font-serif text-sm uppercase tracking-[0.3em]">农历</span>
          <span className="text-parchment/60 text-[11px] uppercase tracking-widest">CALENDARIO LUNAR</span>
        </div>

        <div className="text-center mb-4">
          <div className="text-2xl font-serif text-gold-leaf">{lunar.displayDate}</div>
          <div className="text-sm text-parchment/80 mt-1">
            Año {lunar.yearStemBranch} · {lunar.yearAnimal} ({yearBranchInfo.animalEs}) · Elemento {yearStemInfo.elementEs}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-parchment/70 w-16">Año</span>
            <ElementChip stem={yearStemInfo} branch={yearBranchInfo} />
            <span className="text-[10px] text-parchment/60 w-16 text-right">{lunar.year}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-parchment/70 w-16">Mes</span>
            <ElementChip stem={monthStemInfo} branch={monthBranchInfo} />
            <span className="text-[10px] text-parchment/60 w-16 text-right">{lunar.monthName}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-parchment/70 w-16">Día</span>
            <ElementChip stem={dayStemInfo} branch={dayBranchInfo} />
            <span className="text-[10px] text-parchment/60 w-16 text-right">{lunar.dayName}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 text-[11px] text-parchment/70 pt-3 border-t border-gold-dim/20">
          <span>🌑 Año Nuevo Lunar: {lunar.lunarNewYear}</span>
          {lunar.isLeapYear && <span className="text-amber-400">⏭ Año bisiesto (闰)</span>}
        </div>
      </div>

      {/* 4. Ciclo Sexagenario 天干地支 */}
      <div className="w-full mb-8">
        <SexagenaryCycleCard
          yearStemIndex={lunar.yearStemIndex}
          yearBranchIndex={lunar.yearBranchIndex}
          monthStemIndex={lunar.monthStemIndex}
          monthBranchIndex={lunar.monthBranchIndex}
          dayStemIndex={lunar.dayStemIndex}
          dayBranchIndex={lunar.dayBranchIndex}
        />
      </div>

      {/* 5. Costumbres */}
      <div className="w-full mb-8">
        <ChineseCalendarInfo term={term} pentad={pentad} />
      </div>

      {/* 6. Ciclo del Año */}
      <div className="w-full mb-12">
        <ChineseYearCycle currentTermIndex={getTermIndex(term.id)} />
      </div>
    </div>
  );
};

export default ChineseClock;

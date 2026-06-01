import React from 'react';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import ChineseCalendarInfo from './ChineseCalendarInfo';
import ChineseAnimalClock from './ChineseAnimalClock';
import ChineseYearCycle from './ChineseYearCycle';

interface ChineseClockProps {
  modernTime: Date;
}

const ChineseClock: React.FC<ChineseClockProps> = ({ modernTime }) => {
  const { term, pentad, daysUntilChange } = getChineseCalendarData(modernTime);
  
  // Calculate index for the year cycle (0-23)
  const getTermIndex = (termId: number) => termId - 1;

  return (
    <div className="flex flex-col items-center px-4 pb-24 text-parchment w-full max-w-lg mx-auto">
      {/* 1. Reloj de las horas (Shíchen / Animales) */}
      <div className="w-full mb-8">
        <ChineseAnimalClock modernTime={modernTime} />
      </div>
      
      {/* 2. Información del término solar y pentadas */}
      <div className="w-full bg-ink/90 border border-rose-600/30 rounded-lg p-6 text-center shadow-xl mb-8">
        <div className="text-rose-600 font-serif text-sm uppercase tracking-[0.3em] mb-2">节气</div>
        <h2 className="text-4xl font-serif text-gold-leaf mb-1">{term.hanzi}</h2>
        <div className="text-lg text-gold-dim mb-4">{term.pinyin} - {term.translation}</div>
        
        <div className="border-t border-gold-dim/20 pt-4 mt-2">
            <div className="text-sm opacity-70">第 {pentad} 候</div>
            <div className="text-base italic text-rose-100 mt-2">{term.pentads[pentad - 1]?.description || ''}</div>
        </div>

        <div className="text-xs text-gold-dim/50 mt-4 italic">
          Cambio en {daysUntilChange} días
        </div>
      </div>

      {/* 3. Detalles de costumbres y ritos */}
      <div className="w-full mb-8">
        <ChineseCalendarInfo term={term} pentad={pentad} />
      </div>

      {/* 4. Ciclo del Año (Rueda de 24 términos al final) */}
      <div className="w-full mb-12">
        <ChineseYearCycle currentTermIndex={getTermIndex(term.id)} />
      </div>
    </div>
  );
};

export default ChineseClock;

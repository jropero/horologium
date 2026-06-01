import React from 'react';
import { SOLAR_TERMS } from '../utils/chineseCalendarData';

interface Props {
  currentTermIndex: number;
}

const ChineseYearCycle: React.FC<Props> = ({ currentTermIndex }) => {
  const seasons = [
    { name: 'Primavera', color: 'text-emerald-500', bgActive: 'bg-emerald-600/20', border: 'border-emerald-600/50', terms: SOLAR_TERMS.slice(0, 6) },
    { name: 'Verano', color: 'text-rose-500', bgActive: 'bg-rose-600/20', border: 'border-rose-600/50', terms: SOLAR_TERMS.slice(6, 12) },
    { name: 'Otoño', color: 'text-amber-500', bgActive: 'bg-amber-600/20', border: 'border-amber-600/50', terms: SOLAR_TERMS.slice(12, 18) },
    { name: 'Invierno', color: 'text-sky-500', bgActive: 'bg-sky-600/20', border: 'border-sky-600/50', terms: SOLAR_TERMS.slice(18, 24) },
  ];

  return (
    <div className="w-full bg-ink/90 border border-gold-dim/20 rounded-xl p-4 shadow-xl mt-8">
      <h3 className="text-center text-gold-leaf font-serif text-sm uppercase tracking-widest mb-4">Ciclo del Año</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {seasons.map((season, sIdx) => (
          <div key={season.name} className="flex flex-col gap-2">
            <h4 className={`text-center text-[10px] uppercase tracking-widest ${season.color} font-bold`}>{season.name}</h4>
            <div className="grid grid-cols-1 gap-1">
              {season.terms.map((term, tIdx) => {
                const globalIndex = sIdx * 6 + tIdx;
                const isActive = globalIndex === currentTermIndex;
                const isPast = globalIndex < currentTermIndex;

                return (
                  <div 
                    key={term.id}
                    className={`
                      px-2 py-1.5 rounded flex flex-col items-center text-center transition-all duration-300
                      ${isActive 
                        ? `${season.bgActive} ${season.border} border shadow-[0_0_10px_rgba(255,255,255,0.1)] animate-pulse scale-105` 
                        : 'bg-ink-dark/50 border border-transparent'}
                      ${isPast ? 'opacity-40' : 'opacity-100'}
                    `}
                  >
                   
   <span className="text-[9px] text-parchment/40 self-start">{term.id}</span>
   <span className="text-xs font-bold text-parchment">{term.hanzi}</span>
   <span className="text-[9px] text-parchment/70 italic">{term.translation}</span>

                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChineseYearCycle;

import React from 'react';
import { SOLAR_TERMS } from '../utils/chineseCalendarData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTermIndex: number;
}

const ChineseSolarTermsModal: React.FC<Props> = ({ isOpen, onClose, currentTermIndex }) => {
  if (!isOpen) return null;

  const seasons = [
    { name: 'Primavera', color: 'border-emerald-600', terms: SOLAR_TERMS.slice(0, 6) },
    { name: 'Verano', color: 'border-rose-600', terms: SOLAR_TERMS.slice(6, 12) },
    { name: 'Otoño', color: 'border-amber-600', terms: SOLAR_TERMS.slice(12, 18) },
    { name: 'Invierno', color: 'border-sky-600', terms: SOLAR_TERMS.slice(18, 24) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-parchment text-ink w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl relative border border-gold-dim/40" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-ink hover:text-rose-800 font-bold transition-transform hover:scale-110 text-xl">✕</button>
        
        <h2 className="text-2xl font-serif font-bold text-center text-ink mb-8 uppercase tracking-widest">24 Términos Solares</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {seasons.map((season, sIdx) => (
            <div key={season.name} className={`border-t-4 ${season.color} pt-4`}>
              <h3 className="font-serif font-bold text-lg mb-4 text-ink/80">{season.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {season.terms.map((term, tIdx) => {
                  const globalIndex = sIdx * 6 + tIdx;
                  const isActive = globalIndex === currentTermIndex;
                  const isPast = globalIndex < currentTermIndex;
                  
                  return (
                    <div 
                      key={term.id}
                      className={`
                        p-3 rounded border transition-all duration-300
                        ${isActive 
                            ? 'bg-gold-dim/20 border-gold-leaf shadow-[0_0_15px_rgba(207,181,59,0.3)] animate-pulse' 
                            : 'bg-white/50 border-ink/10'}
                        ${isPast ? 'opacity-40' : 'opacity-100'}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-bold text-ink">{term.hanzi}</span>
                        <span className="text-[10px] text-ink/60 font-bold">{term.pinyin}</span>
                      </div>
                      <div className="text-[10px] text-ink/70 mt-1 italic">{term.translation}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChineseSolarTermsModal;

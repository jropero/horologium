import { LongCount } from '../types/maya';
import React from 'react';

interface LongCountDisplayProps {
  longCount: LongCount;
}

const PERIODS: { key: keyof LongCount; label: string; desc: string }[] = [
  { key: 'baktun', label: 'B\'ak\'tun', desc: '144,000 días' },
  { key: 'katun', label: 'K\'atun', desc: '7,200 días' },
  { key: 'tun', label: 'Tun', desc: '360 días' },
  { key: 'uinal', label: 'Winal', desc: '20 días' },
  { key: 'kin', label: 'K\'in', desc: '1 día' },
];

const LongCountDisplay: React.FC<LongCountDisplayProps> = ({ longCount }) => {
  return (
    <div className="flex flex-col items-center w-full px-4 py-8">
      <h3 className="text-emerald-500/80 font-serif text-sm uppercase tracking-[0.3em] font-bold mb-6 drop-shadow-md">
        La Cuenta Larga
      </h3>
      
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 lg:gap-6 bg-ink/60 backdrop-blur-md p-6 rounded-2xl border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        {PERIODS.map((period, idx) => (
          <React.Fragment key={period.key}>
            <div className="flex flex-col items-center group relative cursor-help">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-b from-emerald-900/40 to-ink border-2 border-emerald-500/40 rounded-full flex items-center justify-center shadow-inner group-hover:border-emerald-400 group-hover:scale-105 transition-all duration-300">
                <span className="text-3xl md:text-4xl lg:text-5xl font-black text-parchment drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  {longCount[period.key]}
                </span>
              </div>
              <div className="mt-3 text-center">
                <span className="block text-sm md:text-base font-serif font-bold uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  {period.label}
                </span>
                <span className="block text-[10px] md:text-xs text-gold-dim/70 italic mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {period.desc}
                </span>
              </div>
            </div>
            
            {idx < PERIODS.length - 1 && (
              <div className="hidden sm:flex text-2xl md:text-3xl text-emerald-500/30 pb-8 px-1 md:px-2">
                •
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LongCountDisplay;

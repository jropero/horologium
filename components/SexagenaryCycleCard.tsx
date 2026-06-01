import React from 'react';
import { STEMS, BRANCHES } from '../utils/chineseLunisolarUtils';

const ELEMENT_CHIP: Record<string, { bg: string; border: string; text: string; label: string }> = {
  '木': { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-300', label: 'Madera' },
  '火': { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-300', label: 'Fuego' },
  '土': { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-300', label: 'Tierra' },
  '金': { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', text: 'text-yellow-300', label: 'Metal' },
  '水': { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', text: 'text-cyan-300', label: 'Agua' },
};

interface SexagenaryCycleCardProps {
  yearStemIndex: number;
  yearBranchIndex: number;
  monthStemIndex: number;
  monthBranchIndex: number;
  dayStemIndex: number;
  dayBranchIndex: number;
}

const SexagenaryCycleCard: React.FC<SexagenaryCycleCardProps> = ({
  yearStemIndex, yearBranchIndex, monthStemIndex, monthBranchIndex, dayStemIndex, dayBranchIndex,
}) => {
  return (
    <div className="w-full bg-ink/90 border border-gold-leaf/30 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="text-center pt-4 pb-2 px-4 border-b border-gold-leaf/20">
        <div className="text-gold-leaf font-serif text-sm uppercase tracking-[0.3em]">天干地支</div>
        <div className="text-parchment/60 text-[11px] uppercase tracking-widest mt-0.5">CICLO SEXAGENARIO</div>
      </div>

      <div className="p-4 space-y-5">
        {/* Heavenly Stems */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-widest text-parchment font-bold">天干</span>
            <span className="text-parchment/50 text-[10px]">TRONCOS CELESTIALES</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {STEMS.map((s, i) => {
              const isActive = i === yearStemIndex || i === monthStemIndex || i === dayStemIndex;
              const chip = ELEMENT_CHIP[s.elementHanzi];
              return (
                <div
                  key={s.hanzi}
                  className={`
                    flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md border transition-all duration-300 min-w-[48px]
                    ${isActive
                      ? `${chip.bg} ${chip.border} scale-110 shadow-[0_0_10px_rgba(255,255,255,0.12)]`
                      : 'bg-black/40 border-gold-dim/25 text-parchment/70'
                    }
                  `}
                >
                  <span className={`text-lg font-bold ${isActive ? chip.text : 'text-parchment/90'}`}>{s.hanzi}</span>
                  <span className={`text-[9px] leading-tight ${isActive ? chip.text : 'text-parchment/60'}`}>{s.pinyin}</span>
                  <span className={`text-[8px] leading-tight ${isActive ? chip.text : 'text-parchment/50'}`}>{s.elementEs}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earthly Branches */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-widest text-parchment font-bold">地支</span>
            <span className="text-parchment/50 text-[10px]">RAMAS TERRESTRES</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {BRANCHES.map((b, i) => {
              const isActive = i === yearBranchIndex || i === monthBranchIndex || i === dayBranchIndex;
              const chip = ELEMENT_CHIP[b.elementHanzi];
              return (
                <div
                  key={b.hanzi}
                  className={`
                    flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md border transition-all duration-300 min-w-[56px]
                    ${isActive
                      ? `${chip.bg} ${chip.border} scale-105 shadow-[0_0_8px_rgba(255,255,255,0.12)]`
                      : 'bg-black/40 border-gold-dim/25 text-parchment/70'
                    }
                  `}
                >
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${isActive ? chip.text : 'text-parchment/90'}`}>{b.hanzi}</span>
                    <span className="text-base">{b.animal}</span>
                  </div>
                  <span className={`text-[9px] leading-tight ${isActive ? chip.text : 'text-parchment/60'}`}>{b.pinyin} {b.animalEs}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current cycle summary */}
        <div className="flex items-center justify-center gap-2 mt-2 pt-3 border-t border-gold-dim/20 text-xs flex-wrap">
          <span className="text-parchment/60">Año</span>
          <span className="text-parchment font-bold">{STEMS[yearStemIndex].hanzi}{BRANCHES[yearBranchIndex].hanzi}</span>
          <span className="text-parchment/30">·</span>
          <span className="text-parchment/60">Mes</span>
          <span className="text-parchment font-bold">{STEMS[monthStemIndex].hanzi}{BRANCHES[monthBranchIndex].hanzi}</span>
          <span className="text-parchment/30">·</span>
          <span className="text-parchment/60">Día</span>
          <span className="text-parchment font-bold">{STEMS[dayStemIndex].hanzi}{BRANCHES[dayBranchIndex].hanzi}</span>
        </div>

        {/* 五行 Element legend */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest text-parchment font-bold">五行</span>
            <span className="text-parchment/50 text-[10px]">CINCO ELEMENTOS</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(ELEMENT_CHIP).map(([el, c]) => (
              <div key={el} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${c.bg} ${c.border}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${c.text.replace('text-', 'bg-')}`} />
                <span className={`text-xs font-bold ${c.text}`}>{el}</span>
                <span className={`text-[11px] ${c.text}`}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cycle explanation */}
        <div className="text-center pt-2">
          <p className="text-parchment/60 text-[11px] italic leading-relaxed">
            10 troncos × 12 ramas = 60 combinaciones · Ciclo de 60 años, meses, días y horas (Shíchen)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SexagenaryCycleCard;

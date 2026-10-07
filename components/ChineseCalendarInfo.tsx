import React from 'react';
import { SolarTerm, ChineseCustom } from '../utils/chineseCalendarData';

interface Props {
  term: SolarTerm;
  pentad: number;
}

const CustomCard: React.FC<{ custom: ChineseCustom }> = ({ custom }) => (
  <div className="bg-white/50 border border-gold-dim/30 rounded-lg p-3 shadow-sm mb-2">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-xl">{custom.icon}</span>
      <div>
        <h4 className="font-bold text-ink/90 text-xs">{custom.title}</h4>
        <span className="text-xs bg-rose-200/60 text-rose-800 px-1 py-0.5 rounded uppercase tracking-wider font-semibold">
          {custom.type}
        </span>
      </div>
    </div>
    <p className="text-xs text-ink/90 leading-relaxed italic">"{custom.description}"</p>
  </div>
);

const ChineseCalendarInfo: React.FC<Props> = ({ term, pentad }) => {
  return (
    <div className="w-full max-w-lg bg-parchment text-ink rounded-lg p-4 shadow-xl border border-rose-600/30 mt-4">
      {/* Cabecera */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-serif font-bold text-ink">{term.hanzi} {term.pinyin}</h2>
        <p className="text-ink/80 text-xs mt-1">{term.translation}</p>
      </div>

      {/* Progreso de Pentadas */}
      <div className="mb-5">
          <div className="flex justify-between text-xs text-ink/60 uppercase tracking-widest mb-1">
              <span>1ª Pentada</span>
              <span>2ª Pentada</span>
              <span>3ª Pentada</span>
          </div>
          <div className="h-1.5 w-full bg-gold-dim/20 rounded-full flex overflow-hidden">
              {[1, 2, 3].map(p => (
                  <div key={p} className={`flex-1 ${pentad >= p ? 'bg-emerald-600' : 'bg-transparent'}`} />
              ))}
          </div>

          {/* Elevated omen */}
          <div className="mt-4 text-center px-2">
              <div className="text-xs text-ink/50 uppercase tracking-widest mb-2">{pentad}ª Pentada · Fenómeno</div>
              <p className="text-base font-serif italic text-ink/85 leading-snug">
                  "{term.pentads[pentad - 1]?.description || 'Sin datos'}"
              </p>
          </div>
      </div>

      {/* Sección de Ritos */}
      <div className="mb-4">
        <h3 className="font-bold text-ink/80 text-xs uppercase tracking-widest border-b border-ink/30 mb-2 pb-0.5">🏮 Ritos y Costumbres</h3>
        <div className="space-y-1">
          {term.customs.map((c, i) => <CustomCard key={i} custom={c} />)}
        </div>
      </div>

      {/* Sección Cultural Menor */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gold-dim/10 p-2 rounded border border-gold-dim/20">
          <h4 className="font-bold text-ink/80 text-xs uppercase mb-1">🥢 Sabores</h4>
          <ul className="text-xs list-disc pl-3 text-ink/90 space-y-0.5">
            {term.traditionalFoods.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="bg-rose-900/10 p-2 rounded border border-rose-900/20">
          <h4 className="font-bold text-rose-800 text-xs uppercase mb-1">🧘 Consejo</h4>
          <p className="text-xs text-ink/80 italic">{term.healthAdvice}</p>
        </div>
      </div>

      {/* Lunar reckoning note */}
      <div className="mt-4 pt-3 border-t border-rose-900/15 text-center">
        <p className="text-[10px] text-ink/35 leading-relaxed">
          月朔 (día 1) coincide con la conjunción astronómica exacta — el instante de luna nueva. Este cómputo puede diferir ~2 días del calendario griego ático, que usa el primer creciente visible.
        </p>
      </div>
    </div>
  );
};

export default ChineseCalendarInfo;

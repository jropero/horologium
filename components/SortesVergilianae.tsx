import React, { useState, useCallback } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { getRandomSors, SorsVergiliana } from '../utils/sortesVergilianae';
import { getRandomDiosemeia, Diosemeia } from '../utils/diosemeiaData';
import { EGYPTIAN_WISDOM, EgyptianWisdom } from '../utils/egyptianWisdomData';
import { useCivilization } from '../contexts/CivilizationContext';

const SortesVergilianae: React.FC = () => {
  const { civilization, labels } = useCivilization();
  const [sors, setSors] = useState<SorsVergiliana | null>(null);
  const [diosemeia, setDiosemeia] = useState<Diosemeia | null>(null);
  const [sorsAegyptiaca, setSorsAegyptiaca] = useState<EgyptianWisdom | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasConsulted, setHasConsulted] = useState(false);

  const handleConsult = useCallback(() => {
    setIsRevealing(true);
    setSors(null);
    setDiosemeia(null);
    setSorsAegyptiaca(null);

    // Small delay for dramatic effect
    setTimeout(() => {
      if (civilization === 'rome') {
        setSors(getRandomSors());
      } else if (civilization === 'hellas') {
        setDiosemeia(getRandomDiosemeia());
      } else {
        const randomIndex = Math.floor(Math.random() * EGYPTIAN_WISDOM.length);
        setSorsAegyptiaca(EGYPTIAN_WISDOM[randomIndex]);
      }
      setIsRevealing(false);
      setHasConsulted(true);
    }, 800);
  }, [civilization]);

  const currentSors = civilization === 'rome' ? sors : null;
  const currentDiosemeia = civilization === 'hellas' ? diosemeia : null;
  const currentAegyptiaca = civilization === 'aegyptus' ? sorsAegyptiaca : null;
  const hasSors = currentSors || currentDiosemeia || currentAegyptiaca;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 px-4 animate-fadeIn">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-lg overflow-hidden shadow-2xl backdrop-blur-md relative group">
        
        {/* Decorative background hatch */}
        <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold-dim/20 bg-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gold-leaf" />
            <span className="font-serif text-sm md:text-base uppercase tracking-[0.3em] text-gold-leaf font-bold">
              {labels.oracleTitle}
            </span>
          </div>
          <span className="font-body text-sm md:text-base text-parchment/40 italic">{labels.oracleSubtitle}</span>
        </div>

        {/* Oracle content */}
        <div className="p-8 flex flex-col items-center gap-6 min-h-[180px] justify-center relative z-10">

          {/* Revealed verse — Roman */}
          {currentSors && !isRevealing && (
            <div className="text-center animate-fadeIn">
              <blockquote className="font-body text-parchment text-2xl md:text-4xl italic leading-relaxed mb-4 drop-shadow-glow">
                «{currentSors.latin}»
              </blockquote>
              <div className="w-1/4 h-px bg-gold-dim/30 mx-auto mb-4"></div>
              <p className="font-serif italic text-lg md:text-xl text-parchment/70 mb-4 leading-relaxed">
                {currentSors.spanish}
              </p>
              <cite className="font-serif text-sm md:text-base uppercase tracking-[0.2em] text-gold-dim/80 not-italic font-bold">
                — {currentSors.source} —
              </cite>
            </div>
          )}

          {/* Revealed omen — Greek (Diosemeia) */}
          {currentDiosemeia && !isRevealing && (
            <div className="text-center animate-fadeIn flex flex-col gap-4 relative w-full max-w-lg mx-auto bg-ink/40 p-6 md:p-8 rounded-xl border border-sky-400/30 shadow-[inset_0_0_20px_rgba(56,189,248,0.05)]">
              {/* Esquinas ornamentales */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-sky-400/50"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-sky-400/50"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-sky-400/50"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-sky-400/50"></div>
              
              <div className="flex flex-col items-center justify-center gap-1 mb-2">
                  <span className="text-3xl animate-pulse filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">🌩️</span>
                  <span className="font-serif text-sm md:text-base uppercase tracking-[0.3em] font-bold text-sky-400 mt-2">
                      Diosemeia
                  </span>
                  <span className="font-serif text-[10px] uppercase tracking-widest text-sky-400/60">
                      (Señal Divina)
                  </span>
              </div>

              <div className="relative">
                <span className="absolute -left-2 -top-2 text-3xl text-sky-400/20 font-serif">«</span>
                <p className="font-serif italic text-base md:text-lg text-parchment leading-relaxed text-left border-l-2 border-sky-500/50 pl-4 py-1 z-10 relative">
                    {currentDiosemeia.event}
                </p>
              </div>

              <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent mx-auto my-2"></div>
              
              <div className="bg-roman-red/10 border border-roman-red/20 rounded p-3">
                <span className="font-serif text-[10px] uppercase tracking-[0.2em] font-bold text-roman-red/80 block mb-1">Pronóstico del Oráculo:</span>
                <p className="font-body font-black text-sm md:text-base text-roman-red uppercase tracking-wide">
                    {currentDiosemeia.meaning}
                </p>
              </div>

              <cite className="font-serif text-xs md:text-sm text-stone-500 mt-2">
                  — {currentDiosemeia.source} —
              </cite>
            </div>
          )}

          {/* Revealed verse — Egyptian */}
          {currentAegyptiaca && !isRevealing && (
            <div className="text-center animate-fadeIn flex flex-col gap-2 relative">
              <blockquote className="font-body text-parchment text-2xl md:text-4xl italic leading-relaxed mb-4 drop-shadow-glow">
                «{currentAegyptiaca.text}»
              </blockquote>
              <div className="w-1/4 h-px bg-emerald-600/30 mx-auto mb-4"></div>
              <cite className="font-serif text-sm md:text-base uppercase tracking-[0.2em] text-gold-dim/80 not-italic font-bold">
                — {currentAegyptiaca.author} —
              </cite>
              <p className="font-serif italic text-sm md:text-base text-parchment/50 mt-1 leading-relaxed">
                ({currentAegyptiaca.source})
              </p>
            </div>
          )}

          {/* Loading state */}
          {isRevealing && (
            <div className="text-center py-4">
              <Sparkles className="w-10 h-10 text-gold-leaf animate-spin mx-auto mb-4" />
              <span className="font-serif text-lg uppercase tracking-[0.3em] text-gold-dim font-bold animate-pulse">
                {labels.oracleConsulting}
              </span>
            </div>
          )}

          {/* Initial state */}
          {!hasSors && !isRevealing && (
            <div className="text-center max-w-sm flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full border border-gold-dim/20 flex items-center justify-center bg-white/5">
                 <BookOpen className="w-8 h-8 text-gold-dim opacity-30" />
               </div>
               <p className="font-body text-lg md:text-xl text-parchment/40 italic">
                 {labels.oraclePrompt}
               </p>
            </div>
          )}

          {/* Consult button */}
          <button
            onClick={handleConsult}
            disabled={isRevealing}
            className="
              group relative px-8 py-3 mt-4 font-serif text-lg uppercase tracking-[0.3em]
              text-parchment border border-gold-dim/50 rounded-lg
              bg-white/5 hover:bg-gold-dim/20 hover:border-gold-leaf
              transition-all duration-500 active:scale-95
              disabled:opacity-50 disabled:cursor-wait shadow-lg
            "
          >
            <span className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-gold-dim group-hover:text-gold-leaf transition-colors" />
              {hasConsulted ? labels.oracleConsultAgain : labels.oracleOpenBook}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortesVergilianae;

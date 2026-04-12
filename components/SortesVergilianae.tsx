import React, { useState, useCallback } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { getRandomSors, SorsVergiliana } from '../utils/sortesVergilianae';

const SortesVergilianae: React.FC = () => {
  const [sors, setSors] = useState<SorsVergiliana | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasConsulted, setHasConsulted] = useState(false);

  const handleConsult = useCallback(() => {
    setIsRevealing(true);
    setSors(null);

    // Small delay for dramatic effect
    setTimeout(() => {
      setSors(getRandomSors());
      setIsRevealing(false);
      setHasConsulted(true);
    }, 800);
  }, []);

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
              Sortes Vergilianae
            </span>
          </div>
          <span className="font-body text-sm md:text-base text-parchment/40 italic">Oraculum Poeticum</span>
        </div>

        {/* Oracle content */}
        <div className="p-8 flex flex-col items-center gap-6 min-h-[180px] justify-center relative z-10">

          {/* Revealed verse */}
          {sors && !isRevealing && (
            <div className="text-center animate-fadeIn">
              <blockquote className="font-body text-parchment text-2xl md:text-4xl italic leading-relaxed mb-4 drop-shadow-glow">
                «{sors.latin}»
              </blockquote>
              <div className="w-1/4 h-px bg-gold-dim/30 mx-auto mb-4"></div>
              <p className="font-serif italic text-lg md:text-xl text-parchment/70 mb-4 leading-relaxed">
                {sors.spanish}
              </p>
              <cite className="font-serif text-sm md:text-base uppercase tracking-[0.2em] text-gold-dim/80 not-italic font-bold">
                — {sors.source} —
              </cite>
            </div>
          )}

          {/* Loading state */}
          {isRevealing && (
            <div className="text-center py-4">
              <Sparkles className="w-10 h-10 text-gold-leaf animate-spin mx-auto mb-4" />
              <span className="font-serif text-lg uppercase tracking-[0.3em] text-gold-dim font-bold animate-pulse">
                Fata consuluntur...
              </span>
            </div>
          )}

          {/* Initial state */}
          {!sors && !isRevealing && (
            <div className="text-center max-w-sm flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full border border-gold-dim/20 flex items-center justify-center bg-white/5">
                 <BookOpen className="w-8 h-8 text-gold-dim opacity-30" />
               </div>
               <p className="font-body text-lg md:text-xl text-parchment/40 italic">
                 Abre el libro de Virgilio al azar y deja que los hados te guíen.
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
              {hasConsulted ? 'Iterum Consulere' : 'Librum Aperire'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortesVergilianae;

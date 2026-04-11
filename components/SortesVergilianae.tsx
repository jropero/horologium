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
    <div className="w-full max-w-xl mx-auto mt-6 px-2">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-sm overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm">

        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gold-dim/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold-dim" />
            <span className="font-serif text-[10px] uppercase tracking-[0.2em] text-gold-dim">
              Sortes Vergilianae
            </span>
          </div>
          <span className="font-body text-[10px] text-parchment/40 italic">Oraculum Poeticum</span>
        </div>

        {/* Oracle content */}
        <div className="p-4 flex flex-col items-center gap-3 min-h-[120px] justify-center">

          {/* Revealed verse */}
          {sors && !isRevealing && (
            <div className="text-center animate-[fadeIn_0.6s_ease-out]">
              <blockquote className="font-body text-parchment text-base sm:text-lg italic leading-relaxed mb-2">
                «{sors.latin}»
              </blockquote>
              <p className="font-body text-parchment/60 text-sm italic mb-2">
                {sors.spanish}
              </p>
              <cite className="font-serif text-[10px] uppercase tracking-widest text-gold-dim/60 not-italic">
                — {sors.source} —
              </cite>
            </div>
          )}

          {/* Loading state */}
          {isRevealing && (
            <div className="text-center">
              <Sparkles className="w-6 h-6 text-gold-leaf animate-spin mx-auto mb-2" />
              <span className="font-serif text-xs uppercase tracking-widest text-gold-dim/80 animate-pulse">
                Fata consuluntur...
              </span>
            </div>
          )}

          {/* Initial state */}
          {!sors && !isRevealing && (
            <p className="font-body text-[11px] text-parchment/40 italic text-center max-w-xs">
              Abre el libro de Virgilio al azar y deja que los hados te guíen.
            </p>
          )}

          {/* Consult button */}
          <button
            onClick={handleConsult}
            disabled={isRevealing}
            className="
              group relative px-6 py-2 mt-1 font-serif text-[11px] uppercase tracking-[0.2em]
              text-parchment border border-gold-dim/50 rounded
              bg-ink/60 hover:bg-gold-dim/15 hover:border-gold-leaf
              transition-all duration-300 active:scale-95
              disabled:opacity-50 disabled:cursor-wait
            "
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-gold-dim group-hover:text-gold-leaf transition-colors" />
              {hasConsulted ? 'Iterum Consulere' : 'Librum Aperire'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortesVergilianae;

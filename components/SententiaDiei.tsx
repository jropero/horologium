import React, { useState, useEffect } from 'react';
import { getSententiaOfTheDay, SENTENTIAE, Sententia } from '../utils/sententiaeData';
import { getApophthegmaOfTheDay, APOPHTHEGMATA, Apophthegma } from '../utils/apophthegmataData';
import { Feather, RefreshCw } from 'lucide-react';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';

interface SententiaDieiProps {
  currentDate: Date;
}

const SententiaDiei: React.FC<SententiaDieiProps> = ({ currentDate }) => {
  const { civilization, labels } = useCivilization();
  const [sententia, setSententia] = useState<Sententia | null>(null);
  const [apophthegma, setApophthegma] = useState<Apophthegma | null>(null);

  // Initialize with the quote of the day
  useEffect(() => {
    setSententia(getSententiaOfTheDay(currentDate));
    setApophthegma(getApophthegmaOfTheDay(currentDate));
  }, [currentDate.toDateString()]);

  const handleRandomize = () => {
    if (civilization === 'rome') {
      const randomIndex = Math.floor(Math.random() * SENTENTIAE.length);
      setSententia(SENTENTIAE[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * APOPHTHEGMATA.length);
      setApophthegma(APOPHTHEGMATA[randomIndex]);
    }
  };

  const quoteText = civilization === 'rome' ? sententia?.latin : apophthegma?.greek;
  const quoteAuthor = civilization === 'rome' ? sententia?.author : apophthegma?.author;
  const quoteTranslation = civilization === 'rome' ? sententia?.translation : apophthegma?.translation;
  const quoteTransliteration = civilization === 'hellas' && quoteText ? transliterateGreek(quoteText) : null;

  if (!quoteText) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      <div 
        onClick={handleRandomize}
        className="relative bg-ink/90 border border-gold-dim/40 rounded-lg p-8 shadow-2xl backdrop-blur-md group cursor-pointer hover:bg-ink/95 transition-all duration-300 active:scale-[0.98] overflow-hidden"
        title="Click for a random quote"
      >
        {/* Decorative background hatch */}
        <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>

        {/* Esquinas ornamentales */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        
        {/* Cabecera / Título */}
        <div className="flex flex-col items-center justify-center mb-6 opacity-70">
          <Feather className="text-gold-leaf/60 w-6 h-6 mb-2 group-hover:rotate-12 transition-transform" />
          <span className="font-serif text-xs md:text-sm uppercase tracking-[0.4em] text-gold-dim group-hover:text-gold-leaf transition-colors">
            {labels.quoteTitle}
          </span>
          <div className="w-16 h-px bg-gold-dim/30 mt-2"></div>
        </div>

        {/* Cita (Texto Principal) */}
        <div className="text-center px-4 mb-4 flex flex-col gap-2">
          <p className="font-serif italic text-2xl md:text-4xl text-parchment leading-relaxed drop-shadow-glow">
            "{quoteText}"
          </p>
          {quoteTransliteration && (
            <p className="font-serif text-sm md:text-base text-gold-dim/80 tracking-widest uppercase">
              {quoteTransliteration}
            </p>
          )}
        </div>

        {/* Autor */}
        <div className="text-center mb-6">
          <span className="font-body text-lg md:text-xl font-bold text-gold-leaf/80 uppercase tracking-[0.2em]">
            — {quoteAuthor} —
          </span>
        </div>

        <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-gold-dim/40 to-transparent mx-auto mb-6"></div>

        {/* Traducción al Español */}
        <div className="text-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          <p className="font-serif italic text-base md:text-lg text-parchment/70 max-w-lg mx-auto leading-relaxed">
            {quoteTranslation}
          </p>
        </div>

        {/* Icono de refresco sutil */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-40 transition-opacity">
          <RefreshCw className="w-5 h-5 text-gold-dim" />
        </div>
      </div>
    </div>
  );
};

export default SententiaDiei;

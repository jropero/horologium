import React, { useState, useEffect } from 'react';
import { getSententiaOfTheDay, SENTENTIAE, Sententia } from '../utils/sententiaeData';
import { getApophthegmaOfTheDay, APOPHTHEGMATA, Apophthegma } from '../utils/apophthegmataData';
import { getEgyptianWisdomOfTheDay, EGYPTIAN_WISDOM, EgyptianWisdom } from '../utils/egyptianWisdomData';
import { getBabylonianWisdomOfTheDay, BABYLONIAN_WISDOM, BabylonianWisdom } from '../utils/babylonianWisdomData';
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
  const [egyptianWisdom, setEgyptianWisdom] = useState<EgyptianWisdom | null>(null);
  const [babylonianWisdom, setBabylonianWisdom] = useState<BabylonianWisdom | null>(null);

  useEffect(() => {
    setSententia(getSententiaOfTheDay(currentDate));
    setApophthegma(getApophthegmaOfTheDay(currentDate));
    setEgyptianWisdom(getEgyptianWisdomOfTheDay(currentDate));
    setBabylonianWisdom(getBabylonianWisdomOfTheDay(currentDate));
  }, [currentDate.toDateString()]);

  const handleRandomize = () => {
    if (civilization === 'rome') {
      const randomIndex = Math.floor(Math.random() * SENTENTIAE.length);
      setSententia(SENTENTIAE[randomIndex]);
    } else if (civilization === 'hellas') {
      const randomIndex = Math.floor(Math.random() * APOPHTHEGMATA.length);
      setApophthegma(APOPHTHEGMATA[randomIndex]);
    } else if (civilization === 'babylonia') {
      const randomIndex = Math.floor(Math.random() * BABYLONIAN_WISDOM.length);
      setBabylonianWisdom(BABYLONIAN_WISDOM[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * EGYPTIAN_WISDOM.length);
      setEgyptianWisdom(EGYPTIAN_WISDOM[randomIndex]);
    }
  };

  const isBab = civilization === 'babylonia';
  const quoteText = civilization === 'rome' ? sententia?.latin
    : civilization === 'hellas' ? apophthegma?.greek
    : isBab ? babylonianWisdom?.text
    : egyptianWisdom?.text;
  const quoteAuthor = civilization === 'rome' ? sententia?.author
    : civilization === 'hellas' ? apophthegma?.author
    : isBab ? babylonianWisdom?.author
    : egyptianWisdom?.author;
  const quoteTranslation = civilization === 'rome' ? sententia?.translation
    : civilization === 'hellas' ? apophthegma?.translation
    : undefined;
  const quoteSource = isBab ? babylonianWisdom?.source
    : civilization === 'aegyptus' ? egyptianWisdom?.source
    : undefined;
  const quoteAkkadian = isBab ? babylonianWisdom?.akkadian : undefined;
  const quoteTransliteration = civilization === 'hellas' && quoteText ? transliterateGreek(quoteText) : null;

  if (!quoteText) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      <div
        onClick={handleRandomize}
        className={`relative border p-8 shadow-2xl group cursor-pointer transition-all duration-300 active:scale-[0.98] overflow-hidden ${
          civilization === 'aegyptus' ? '' : 'bg-ink/90 border-gold-dim/40 rounded-lg backdrop-blur-md hover:bg-ink/95'
        }`}
        style={civilization === 'aegyptus' ? { background: '#0c0804', borderColor: 'rgba(24,64,160,0.45)', borderRadius: '2px' } : undefined}
        title="Click for a random quote"
      >
        {civilization !== 'aegyptus' && <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>}

        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-dim/30 group-hover:border-gold-leaf/50 transition-colors"></div>
        
        {/* Cabecera / Título */}
        <div className="flex flex-col items-center justify-center mb-6">
          <Feather className="text-gold-leaf/80 w-6 h-6 mb-2 group-hover:rotate-12 transition-transform" />
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
            <p className="font-serif text-sm md:text-base text-gold-dim tracking-widest uppercase">
              {quoteTransliteration}
            </p>
          )}
          {quoteAkkadian && (
            <p className="font-serif text-sm text-gold-dim/70 tracking-wider italic mt-1">
              {quoteAkkadian}
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

        {/* Traducción / Fuente */}
        <div className="text-center group-hover:opacity-100 transition-opacity duration-500">
          {quoteTranslation && (
            <p className="font-serif italic text-base md:text-lg text-parchment/90 max-w-lg mx-auto leading-relaxed">
              {quoteTranslation}
            </p>
          )}
          {quoteSource && (
            <p className="font-serif italic text-sm text-gold-dim/90 mt-2">
              — {quoteSource} —
            </p>
          )}
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

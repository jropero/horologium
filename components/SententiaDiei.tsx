import React, { useState, useEffect } from 'react';
import { getSententiaOfTheDay, SENTENTIAE, Sententia } from '../utils/sententiaeData';
import { Feather, RefreshCw } from 'lucide-react';

interface SententiaDieiProps {
  currentDate: Date;
}

const SententiaDiei: React.FC<SententiaDieiProps> = ({ currentDate }) => {
  const [sententia, setSententia] = useState<Sententia | null>(null);

  // Initialize with the quote of the day
  useEffect(() => {
    setSententia(getSententiaOfTheDay(currentDate));
  }, [currentDate.toDateString()]);

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * SENTENTIAE.length);
    setSententia(SENTENTIAE[randomIndex]);
  };

  if (!sententia) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      <div 
        onClick={handleRandomize}
        className="relative bg-ink/80 border border-gold-dim/40 rounded-sm p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm group cursor-pointer hover:border-gold-leaf/60 transition-all duration-300 active:scale-[0.99]"
        title="Click for a random Roman sententia"
      >
        {/* Esquinas ornamentales estilo piedra/madera */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold-dim/50 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold-dim/50 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold-dim/50 group-hover:border-gold-leaf/50 transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold-dim/50 group-hover:border-gold-leaf/50 transition-colors"></div>
        
        {/* Cabecera / Título */}
        <div className="flex flex-col items-center justify-center mb-3 opacity-70">
          <Feather className="text-gold-leaf/60 w-4 h-4 mb-1 group-hover:rotate-12 transition-transform" />
          <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-gold-dim group-hover:text-gold-leaf transition-colors">
            Sententia Diei
          </span>
        </div>

        {/* Cita en Latín (Texto Principal) */}
        <div className="text-center px-2">
          <p className="font-serif italic text-lg md:text-xl text-parchment leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            "{sententia.latin}"
          </p>
        </div>

        {/* Autor */}
        <div className="text-center mt-2 mb-4">
          <span className="font-body text-xs md:text-sm font-bold text-parchment uppercase tracking-widest">
            — {sententia.author}
          </span>
        </div>

        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-dim/50 to-transparent mx-auto mb-3"></div>

        {/* Traducción al Español */}
        <div className="text-center opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          <p className="font-sans text-xs md:text-sm text-stone-400 font-light max-w-md mx-auto">
            {sententia.translation}
          </p>
        </div>

        {/* Icono de refresco sutil al hacer hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity">
          <RefreshCw className="w-3 h-3 text-gold-dim" />
        </div>
      </div>
    </div>
  );
};

export default SententiaDiei;

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scroll } from 'lucide-react';
import { useCivilization } from '../contexts/CivilizationContext';

const InfoSection: React.FC = () => {
  const { civilization, labels } = useCivilization();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-16 relative animate-fadeIn px-2">
      <div 
        className="bg-ink/95 text-parchment p-4 border border-gold-dim/40 rounded-t-lg flex justify-between items-center cursor-pointer hover:bg-black transition-all shadow-xl relative z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
            <Scroll className="text-gold-leaf w-6 h-6" />
            <h3 className="font-serif text-base md:text-lg font-bold uppercase tracking-[0.3em] text-gold-leaf">{labels.infoTitle}</h3>
        </div>
        {isOpen ? <ChevronUp className="text-gold-dim" /> : <ChevronDown className="text-gold-dim" />}
      </div>
      
      {isOpen && (
        <div className="bg-parchment/95 p-8 border-x border-b border-gold-dim/30 rounded-b-lg shadow-2xl relative overflow-hidden group">
          {/* Subtle background texture for the "scroll" */}
          <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>
          
          <div className="font-body text-xl text-ink leading-relaxed space-y-6 text-justify relative z-10">
             <p>
                <span className="float-left text-7xl font-serif font-bold text-roman-red mr-4 mt-[-8px] drop-shadow-sm leading-none">{labels.infoFirstLetter}</span>
                {labels.infoParagraph1}
             </p>
             <p>
                {labels.infoParagraph2}
             </p>
             <div className="flex justify-center my-8">
                <span className="text-3xl text-woodcut-green opacity-60">❦</span>
             </div>
             <p className="text-center font-serif text-base uppercase tracking-[0.3em] text-ink/60 font-bold">
                {labels.infoBottomMotto}
             </p>

             {civilization === 'aegyptus' && (
                <div className="mt-12 p-6 bg-emerald-900/5 border-t-2 border-emerald-500/20 rounded-b-lg">
                  <h4 className="font-serif text-lg font-bold uppercase tracking-widest text-emerald-800 mb-4 flex items-center gap-3">
                    <span className="text-2xl">𓂀</span>
                    El Secreto del Papiro de El Cairo 86637
                  </h4>
                  <p className="font-body text-lg text-ink/80 leading-relaxed text-justify">
                    El calendario que estás viendo esconde el descubrimiento astrofísico más antiguo de la humanidad (c. 1200 a.C.). Recientes estudios (PLOS ONE, 2015) han demostrado que los días de 'buena' y 'mala' suerte de este papiro no eran superstición aleatoria, sino el registro exacto de las variaciones de brillo de la estrella binaria Algol (con un ciclo de 2.85 días) y de la Luna (29.53 días). Para los egipcios, los eclipses de Algol simbolizaban la debilidad del Ojo de Horus, mientras que la Luna representaba al dios Seth.
                  </p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSection;
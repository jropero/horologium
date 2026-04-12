import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scroll } from 'lucide-react';

const InfoSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-16 relative animate-fadeIn px-2">
      <div 
        className="bg-ink/95 text-parchment p-4 border border-gold-dim/40 rounded-t-lg flex justify-between items-center cursor-pointer hover:bg-black transition-all shadow-xl relative z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
            <Scroll className="text-gold-leaf w-6 h-6" />
            <h3 className="font-serif text-base md:text-lg font-bold uppercase tracking-[0.3em] text-gold-leaf">De Temporibus Romanorum</h3>
        </div>
        {isOpen ? <ChevronUp className="text-gold-dim" /> : <ChevronDown className="text-gold-dim" />}
      </div>
      
      {isOpen && (
        <div className="bg-parchment/95 p-8 border-x border-b border-gold-dim/30 rounded-b-lg shadow-2xl relative overflow-hidden group">
          {/* Subtle background texture for the "scroll" */}
          <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>
          
          <div className="font-body text-xl text-ink leading-relaxed space-y-6 text-justify relative z-10">
             <p>
                <span className="float-left text-7xl font-serif font-bold text-roman-red mr-4 mt-[-8px] drop-shadow-sm leading-none">R</span>
                omani antiqui diem non sicut nos metiebantur. Dies illorum ab ortu solis incipiebat et ad occasum finiebatur, semper in duodecim partes aequales, quas <span className="italic">horas</span> vocabant, divisus.
             </p>
             <p>
                Quare, ut solis iter per caelum cum anni temporibus variat, ita et horae longitudo. Hieme, hora quadraginta quinque minuta tantum esse potest; aestate, ad septuaginta quinque extenditur.
             </p>
             <div className="flex justify-center my-8">
                <span className="text-3xl text-woodcut-green opacity-60">❦</span>
             </div>
             <p className="text-center font-serif text-base uppercase tracking-[0.3em] text-ink/60 font-bold">
                Tempus Fugit • Memento Mori
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSection;
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scroll } from 'lucide-react';

const InfoSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-16 relative">
      <div 
        className="bg-ink text-parchment p-3 border-x-4 border-gold-dim flex justify-between items-center cursor-pointer hover:bg-black transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
            <Scroll className="text-gold-leaf w-5 h-5" />
            <h3 className="font-serif text-sm md:text-base font-bold uppercase tracking-[0.2em] text-gold-leaf">De Temporibus Romanorum</h3>
        </div>
        {isOpen ? <ChevronUp className="text-gold-dim" /> : <ChevronDown className="text-gold-dim" />}
      </div>
      
      {isOpen && (
        <div className="bg-parchment p-8 border-x-4 border-b-4 border-gold-dim/30 shadow-2xl">
          <div className="font-body text-lg text-ink leading-relaxed space-y-4 text-justify">
             <p>
                <span className="float-left text-6xl font-serif font-bold text-roman-red mr-3 mt-[-10px] drop-shadow-sm">R</span>
                omani antiqui diem non sicut nos metiebantur. Dies illorum ab ortu solis incipiebat et ad occasum finiebatur, semper in duodecim partes aequales, quas <span className="italic">horas</span> vocabant, divisus.
             </p>
             <p>
                Quare, ut solis iter per caelum cum anni temporibus variat, ita et horae longitudo. Hieme, hora quadraginta quinque minuta tantum esse potest; aestate, ad septuaginta quinque extenditur.
             </p>
             <div className="flex justify-center my-6">
                <span className="text-2xl text-woodcut-green">❦</span>
             </div>
             <p className="text-center font-serif text-sm uppercase tracking-widest text-ink/70">
                Tempus Fugit • Memento Mori
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSection;
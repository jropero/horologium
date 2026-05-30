import React, { useState, useMemo } from 'react';
import { useCivilization } from '../contexts/CivilizationContext';
import { OVID_MONTH_ETYMOLOGIES, OVID_DIVINE_DIALOGUES, OVID_TABOOS } from '../utils/ovidFastiData';
import InterrogatioDivina from './InterrogatioDivina';

interface OvidianLoreProps {
    modernTime: Date;
}

const OvidianLore: React.FC<OvidianLoreProps> = ({ modernTime }) => {
    const { civilization } = useCivilization();
    const [isDialogueOpen, setIsDialogueOpen] = useState(false);

    const ovidMonthInfo = useMemo(() => {
        if (civilization !== 'rome') return null;
        const currentMonth = modernTime.getMonth() + 1; // 1-12
        return OVID_MONTH_ETYMOLOGIES.find(m => m.month === currentMonth);
    }, [modernTime.getMonth(), civilization]);

    const ovidDialogue = useMemo(() => {
        if (civilization !== 'rome') return null;
        const month = modernTime.getMonth() + 1;
        const day = modernTime.getDate();

        // 1. Janus: All January
        if (month === 1) return OVID_DIVINE_DIALOGUES.find(d => d.god === "Jano");
        
        // 2. Marte: March 1st (Matronalia)
        if (month === 3 && day === 1) return OVID_DIVINE_DIALOGUES.find(d => d.god === "Marte");
        
        // 3. Flora: Mensis Maius (Floralia range + rest of May)
        if ((month === 4 && day >= 28) || month === 5) return OVID_DIVINE_DIALOGUES.find(d => d.god === "Flora");
        
        // 4. Minerva: June 13th (Quinquatrus Minusculae)
        if (month === 6 && day === 13) return OVID_DIVINE_DIALOGUES.find(d => d.god.includes("Minerva"));

        return null;
    }, [modernTime.getDate(), modernTime.getMonth(), civilization]);

    const activeTaboos = useMemo(() => {
        if (civilization !== 'rome') return [];
        const month = modernTime.getMonth() + 1;
        const day = modernTime.getDate();
        
        return OVID_TABOOS.filter(t => {
            if (t.startMonth === t.endMonth) {
                return month === t.startMonth && day >= t.startDay && day <= t.endDay;
            }
            if (month === t.startMonth) return day >= t.startDay;
            if (month === t.endMonth) return day <= t.endDay;
            if (month > t.startMonth && month < t.endMonth) return true;
            return false;
        });
    }, [modernTime.getDate(), modernTime.getMonth(), civilization]);

    if (civilization !== 'rome' || (!ovidMonthInfo && !ovidDialogue && activeTaboos.length === 0)) {
        return null;
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 mb-2 animate-fadeIn">
            <div className="flex flex-col gap-4 w-full items-center p-6 bg-ink/80 backdrop-blur-sm border border-gold-dim/30 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/40 pointer-events-none"></div>

                <div className="text-center w-full border-b border-gold-dim/20 pb-3 mb-2 relative z-10 flex items-center justify-center gap-3">
                    <span className="text-gold-dim">❧</span>
                    <span className="font-serif text-sm uppercase tracking-widest text-gold-leaf font-bold">Fasti Ovidiani</span>
                    <span className="text-gold-dim">☙</span>
                </div>

                {/* Epic 1: Month Etymology Subtitle */}
                {ovidMonthInfo && (
                  <div className="text-center max-w-md mx-auto relative z-10">
                    <p className="text-[11px] md:text-sm font-serif italic text-parchment/80 leading-relaxed">
                        "{ovidMonthInfo.text}"
                    </p>
                    <div className="text-[9px] text-gold-dim/60 uppercase tracking-widest mt-2 font-bold">
                        — Fasti, {ovidMonthInfo.reference}
                    </div>
                  </div>
                )}

                {/* Epic 4: Divine Dialogue Trigger */}
                {ovidDialogue && (
                    <button 
                        onClick={() => setIsDialogueOpen(true)}
                        className="w-full max-w-lg flex items-center gap-4 bg-stone-800/60 border border-gold-leaf/40 hover:bg-gold-leaf/10 hover:border-gold-leaf p-4 rounded-lg shadow-lg transition-all group text-left mt-2 relative z-10"
                    >
                        <span className="text-2xl group-hover:scale-125 transition-transform shrink-0 drop-shadow-md">🏛️</span>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-serif uppercase tracking-widest text-gold-leaf font-black">Coloquio Divino</span>
                            <span className="text-[10px] font-serif italic text-parchment/60 leading-tight mt-1">Interrogar a {ovidDialogue.god}</span>
                        </div>
                    </button>
                )}

                {/* Epic 3: Omina et Signa (Taboos) */}
                {activeTaboos.length > 0 && (
                    <div className="w-full max-w-lg bg-roman-red/10 border border-roman-red/40 rounded-lg p-4 flex flex-col gap-2 shadow-sm mt-2 relative z-10">
                        <div className="flex items-center gap-2 text-roman-red">
                            <span className="text-lg">⚠️</span>
                            <span className="text-[10px] font-serif uppercase tracking-widest font-black">{activeTaboos[0].title}</span>
                        </div>
                        <p className="text-xs font-serif italic text-roman-red leading-relaxed border-l-2 border-roman-red/30 pl-3">
                            "{activeTaboos[0].text}"
                        </p>
                        <span className="text-[9px] text-roman-red/70 self-end uppercase tracking-tighter font-bold mt-1">
                            — Ovidio, {activeTaboos[0].reference}
                        </span>
                    </div>
                )}
            </div>

            {ovidDialogue && (
                <InterrogatioDivina
                    isOpen={isDialogueOpen}
                    onClose={() => setIsDialogueOpen(false)}
                    dialogue={ovidDialogue}
                />
            )}
        </div>
    );
};

export default OvidianLore;

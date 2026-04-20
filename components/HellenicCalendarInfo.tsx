import React, { useState, useEffect } from 'react';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDailyAtticDeity, AtticFestivalInfo } from '../utils/atticCalendarData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';

interface HellenicCalendarInfoProps {
  atticDate?: AtticDateResult;
  onClick?: () => void;
}

const HellenicCalendarInfo: React.FC<HellenicCalendarInfoProps> = ({ atticDate: propAtticDate, onClick }) => {
    const { civilization, labels } = useCivilization();
    const [greekInfo, setGreekInfo] = useState<{ 
      festival: AtticFestivalInfo | null; 
      dailyDeity: AtticFestivalInfo | null; 
      atticDate: AtticDateResult 
    } | null>(null);

    useEffect(() => {
        const targetAtticDate = propAtticDate || getAtticDate(new Date());
        const festival = getAtticFestivalInfo(targetAtticDate.monthIndex, targetAtticDate.dayOfMonth);
        const dailyDeity = getDailyAtticDeity(targetAtticDate.dayOfMonth, targetAtticDate.monthLength);
        
        setGreekInfo({ festival, dailyDeity, atticDate: targetAtticDate });
    }, [propAtticDate]);

    if (civilization !== 'hellas' || !greekInfo) return null;

    const { festival, dailyDeity, atticDate } = greekInfo;
    const hasFestival = !!festival;
    
    // Determine the displaying deity logic
    let displayDeityTitle = labels.godOfDayTitle || "Θεὸς τῆς Ἡμέρας";
    let deityName = "";
    let deityDesc = "";
    let secondaryDeity: AtticFestivalInfo | null = null;

    if (hasFestival) {
        displayDeityTitle = labels.festivalLabel || "Ἑορτή";
        deityName = festival!.festivalName || festival!.deity;
        deityDesc = festival!.festivalDesc || festival!.deityDesc;
        // If there's a festival, keep the daily deity as secondary
        secondaryDeity = dailyDeity;
    } else if (dailyDeity) {
        deityName = dailyDeity.deity;
        deityDesc = dailyDeity.deityDesc;
    }

    // Prepare arrays for decades visualization
    const decade1 = Array.from({ length: 10 }, (_, i) => i + 1);
    const decade2 = Array.from({ length: 10 }, (_, i) => i + 11);
    const decade3Length = atticDate.monthLength - 20;
    const decade3 = Array.from({ length: decade3Length }, (_, i) => i + 21);

    const isCurrentDecade = (dec: number) => atticDate.decade === dec;

    // Helper to render a visual block for a decade
    const renderDecade = (days: number[], decadeNumber: number, title: string) => (
        <div className={`p-2 flex-1 rounded-md border-2 transition-all ${isCurrentDecade(decadeNumber) ? 'border-gold-leaf/50 bg-gold-leaf/5 shadow-sm' : 'border-gold-dim/20 bg-ink/20 opacity-70'}`}>
            <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold-dim mb-2 text-center`}>{title}</h4>
            <div className="flex flex-wrap gap-1 justify-center">
                {days.map(day => {
                    const isToday = day === atticDate.dayOfMonth;
                    return (
                        <div 
                            key={day} 
                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[7px] sm:text-[9px]
                                ${isToday 
                                    ? 'bg-roman-red text-white shadow-[0_0_8px_rgba(139,37,0,0.6)] font-bold scale-125 z-10' 
                                    : (isCurrentDecade(decadeNumber) ? 'bg-gold-leaf text-ink' : 'bg-gold-dim/40 text-parchment/80')
                                }`}
                        >
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div 
          className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
          onClick={onClick}
        >
            <div className="bg-ink/90 border-[4px] border-gold-dim p-0 rounded-sm shadow-2xl relative overflow-hidden group hover:border-gold-leaf transition-colors">
                
                {/* SVG Greek Meander (Cenefa) - Top */}
                <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderBottom: '2px solid var(--gold-dim)' }}>
                     <defs>
                        <pattern id="meander" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0,5 l5,0 l0,10 l10,0 l0,-5 l-5,0 l0,5 l5,0 l0,-10 l-10,0 l0,5 l-5,0 Z" fill="none" stroke="var(--gold-leaf)" strokeWidth="1.5" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="20" fill="url(#meander)" />
                </svg>

                <div className="p-5 md:p-8 flex flex-col items-center gap-6 text-center">

                    {/* TOP: Month name & General Date Info */}
                    <div className="border-b border-gold-dim/30 pb-4 w-full flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl filter drop-shadow-sm">🏛️</span>
                            <h3 className="font-serif text-xl md:text-2xl uppercase tracking-[0.2em] font-bold text-gold-leaf">
                                {atticDate.monthName}
                            </h3>
                        </div>
                        <div className="font-serif text-xs opacity-70 tracking-widest text-gold-dim uppercase">{transliterateGreek(atticDate.monthName)}</div>
                        <div className="text-sm italic text-parchment font-body bg-gold-leaf/10 px-4 py-1 rounded-full shadow-inner border border-gold-leaf/20">Mes de {translateGreekUI(atticDate.monthName)}</div>
                    </div>

                    {/* MAIN: Date and decades timeline */}
                    <div className="w-full my-2">
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-sm leading-tight mb-1">
                            {atticDate.full}
                        </h2>
                        <div className="font-serif text-xs opacity-70 tracking-widest text-gold-dim uppercase mb-1">
                            {transliterateGreek(atticDate.full)}
                        </div>
                        <p className="font-serif text-base text-gold-leaf font-bold italic px-2 mt-2">
                            "{atticDate.spanishFull}"
                        </p>
                    </div>

                    {/* THE THREE DECADES OF THE LUNAR MONTH */}
                    <div className="w-full bg-ink/40 p-4 rounded-lg border border-gold-dim/30">
                        <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim/60 mb-4">Mēn: El Ciclo de tres Décadas</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {renderDecade(decade1, 1, "Ἱστάμενος (Creciente)")}
                            {renderDecade(decade2, 2, "Μεσῶν (Medio)")}
                            {renderDecade(decade3, 3, "Φθίνων (Menguante)")}
                        </div>
                    </div>

                    {/* DEITY / FESTIVAL OF THE DAY */}
                    {deityName && (
                        <div className="flex flex-col items-center gap-2 w-full bg-gold-leaf/5 p-5 rounded-lg border-2 border-gold-leaf/20 transition-all shadow-sm group-hover:bg-gold-leaf/10">
                            <div className="text-gold-leaf text-xs font-bold uppercase tracking-widest mb-1">
                                {displayDeityTitle}
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight`}>
                                {deityName}
                            </h2>
                            <div className="font-serif text-[10px] opacity-70 text-gold-dim tracking-widest uppercase mb-1">
                                {transliterateGreek(deityName)}
                            </div>
                            <p className="font-serif text-sm text-parchment font-bold italic px-4 mt-2 leading-relaxed">
                                "{deityDesc}"
                            </p>

                            {/* Secondary Daily Deity if obscured by a festival */}
                            {secondaryDeity && (
                                <div className="mt-4 pt-3 border-t border-gold-dim/20 w-full">
                                    <div className="text-gold-dim text-[10px] uppercase tracking-[0.2em] mb-1">Sacred Day of:</div>
                                    <div className="text-sm font-serif font-bold text-parchment">
                                        {secondaryDeity.deity} <span className="opacity-60 text-xs">({transliterateGreek(secondaryDeity.deity)})</span>
                                    </div>
                                    <p className="text-[11px] italic text-parchment/60 mt-1 line-clamp-2">
                                        {secondaryDeity.deityDesc}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* SVG Waves - Bottom */}
                <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderTop: '2px solid var(--gold-dim)' }}>
                    <defs>
                        <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0,10 Q5,0 10,10 T20,10" fill="none" stroke="var(--gold-leaf)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                            <path d="M0,15 Q5,5 10,15 T20,15" fill="none" stroke="var(--gold-dim)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="20" fill="url(#waves)" />
                </svg>

            </div>
        </div>
    );
};

export default HellenicCalendarInfo;

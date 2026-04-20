import React, { useState, useEffect } from 'react';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDailyAtticDeity, AtticFestivalInfo } from '../utils/atticCalendarData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';

const HellenicCalendarInfo: React.FC = () => {
    const { civilization, labels } = useCivilization();
    const [greekInfo, setGreekInfo] = useState<{ 
      festival: AtticFestivalInfo | null; 
      dailyDeity: AtticFestivalInfo | null; 
      atticDate: AtticDateResult 
    } | null>(null);

    useEffect(() => {
        const today = new Date();
        const atticDate = getAtticDate(today);
        const festival = getAtticFestivalInfo(atticDate.monthIndex, atticDate.dayOfMonth);
        const dailyDeity = getDailyAtticDeity(atticDate.dayOfMonth, atticDate.monthLength);
        
        setGreekInfo({ festival, dailyDeity, atticDate });
    }, []);

    if (civilization !== 'hellas' || !greekInfo) return null;

    const { festival, dailyDeity, atticDate } = greekInfo;
    const hasFestival = !!festival;
    
    // Determine the displaying deity logic
    let displayDeityTitle = labels.godOfDayTitle || "Θεὸς τῆς Ἡμέρας";
    let deityName = "";
    let deityDesc = "";

    if (hasFestival) {
        displayDeityTitle = labels.festivalLabel || "Ἑορτή";
        deityName = festival!.festivalName || festival!.deity;
        deityDesc = festival!.festivalDesc || festival!.deityDesc;
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
        <div className={`p-2 flex-1 rounded-md border-2 transition-all ${isCurrentDecade(decadeNumber) ? 'border-[#2c3e50] bg-white/80 shadow-sm' : 'border-[#bdc3c7]/50 bg-white/40 opacity-70'}`}>
            <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#2c3e50] mb-2 text-center`}>{title}</h4>
            <div className="flex flex-wrap gap-1 justify-center">
                {days.map(day => {
                    const isToday = day === atticDate.dayOfMonth;
                    return (
                        <div 
                            key={day} 
                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[7px] sm:text-[9px]
                                ${isToday 
                                    ? 'bg-[#c0392b] text-white shadow-[0_0_8px_rgba(192,57,43,0.6)] font-bold scale-125 z-10' 
                                    : (isCurrentDecade(decadeNumber) ? 'bg-[#34495e] text-white' : 'bg-[#95a5a6] text-white/80')
                                }`}
                        >
                            {/* In real greek calendar days of month 21-29 count backwards but for visual track we just use 1-10 dots */}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2">
            {/* Using a strictly light mode, blue & white style per instructions */}
            <div className="bg-[#fdfaf1] border-[4px] border-[#2c3e50] p-0 rounded-sm shadow-2xl relative overflow-hidden group">
                
                {/* SVG Greek Meander (Cenefa) - Top */}
                <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: '#fdfaf1', borderBottom: '2px solid #2c3e50' }}>
                     <defs>
                        <pattern id="meander" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0,5 l5,0 l0,10 l10,0 l0,-5 l-5,0 l0,5 l5,0 l0,-10 l-10,0 l0,5 l-5,0 Z" fill="none" stroke="#3498db" strokeWidth="1.5" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="20" fill="url(#meander)" />
                </svg>

                <div className="p-5 md:p-8 flex flex-col items-center gap-6 text-center">

                    {/* TOP: Month name & General Date Info */}
                    <div className="border-b border-[#2c3e50]/30 pb-4 w-full flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl filter drop-shadow-sm">🏛️</span>
                            <h3 className="font-serif text-xl md:text-2xl uppercase tracking-[0.2em] font-bold text-[#c0392b]">
                                {atticDate.monthName}
                            </h3>
                        </div>
                        <div className="font-serif text-xs opacity-70 tracking-widest text-[#34495e] uppercase">{transliterateGreek(atticDate.monthName)}</div>
                        <div className="text-sm italic text-[#2c3e50] font-body bg-[#ecf0f1] px-4 py-1 rounded-full shadow-inner">Mes de {translateGreekUI(atticDate.monthName)}</div>
                    </div>

                    {/* MAIN: Date and decades timeline */}
                    <div className="w-full my-2">
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-[#2c3e50] drop-shadow-sm leading-tight mb-1">
                            {atticDate.full}
                        </h2>
                        <div className="font-serif text-xs opacity-70 tracking-widest text-[#34495e] uppercase mb-1">
                            {transliterateGreek(atticDate.full)}
                        </div>
                        <p className="font-serif text-base text-[#c0392b] font-bold italic px-2 mt-2">
                            "{atticDate.spanishFull}"
                        </p>
                    </div>

                    {/* THE THREE DECADES OF THE LUNAR MONTH */}
                    <div className="w-full bg-[#ecf0f1]/50 p-4 rounded-lg border border-[#bdc3c7]">
                        <h3 className="font-serif text-xs uppercase tracking-widest text-[#7f8c8d] mb-4">Mēn: El Ciclo de tres Décadas</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {renderDecade(decade1, 1, "Ἱστάμενος (Creciente)")}
                            {renderDecade(decade2, 2, "Μεσῶν (Medio)")}
                            {renderDecade(decade3, 3, "Φθίνων (Menguante)")}
                        </div>
                    </div>

                    {/* DEITY / FESTIVAL OF THE DAY */}
                    {deityName && (
                        <div className="flex flex-col items-center gap-2 w-full bg-[#e8f4f8] p-5 rounded-lg border-2 border-[#3498db]/30 transition-all shadow-sm">
                            <div className="text-[#2980b9] text-xs font-bold uppercase tracking-widest mb-1">
                                {displayDeityTitle}
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-serif font-black text-[#2c3e50] drop-shadow-md leading-tight`}>
                                {deityName}
                            </h2>
                            <div className="font-serif text-[10px] opacity-70 text-[#34495e] tracking-widest uppercase mb-1">
                                {transliterateGreek(deityName)}
                            </div>
                            <p className="font-serif text-sm text-[#2c3e50] font-bold italic px-4 mt-2 leading-relaxed">
                                "{deityDesc}"
                            </p>
                        </div>
                    )}
                </div>

                {/* SVG Waves - Bottom */}
                <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: '#fdfaf1', borderTop: '2px solid #2c3e50' }}>
                    <defs>
                        <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0,10 Q5,0 10,10 T20,10" fill="none" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" />
                            <path d="M0,15 Q5,5 10,15 T20,15" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="20" fill="url(#waves)" />
                </svg>

            </div>
        </div>
    );
};

export default HellenicCalendarInfo;

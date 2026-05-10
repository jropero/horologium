import React, { useState, useEffect } from 'react';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDailyAtticDeity, AtticFestivalInfo, checkApaphrades, getCategoryBadge, getNextAtticFestivals } from '../utils/atticCalendarData';
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
    const [showFestivals, setShowFestivals] = useState(false);

    useEffect(() => {
        const targetAtticDate = propAtticDate || getAtticDate(new Date());
        const festival = getAtticFestivalInfo(targetAtticDate.monthIndex, targetAtticDate.dayOfMonth);
        const dailyDeity = getDailyAtticDeity(targetAtticDate.dayOfMonth, targetAtticDate.monthLength);
        
        setGreekInfo({ festival, dailyDeity, atticDate: targetAtticDate });
    }, [propAtticDate]);

    if (civilization !== 'hellas' || !greekInfo) return null;

    const { festival, dailyDeity, atticDate } = greekInfo;
    const hasFestival = !!festival;
    const apaphrades = checkApaphrades(atticDate.dayOfMonth, atticDate.monthLength, festival);
    
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

    const getMoonSvg = (type: string, isActive: boolean) => {
        const className = `w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 transition-all ${isActive ? 'text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]' : 'text-gold-dim/60'}`;
        switch (type) {
            case 'waxing':
                return (
                    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                        <path d="M12 2 A 10 10 0 0 1 12 22 A 8 10 0 0 0 12 2 Z" />
                    </svg>
                );
            case 'full':
                return (
                    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                );
            case 'waning':
                return (
                    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                        <path d="M12 2 A 10 10 0 0 0 12 22 A 8 10 0 0 1 12 2 Z" />
                    </svg>
                );
            default: return null;
        }
    };

    // Helper to render a visual block for a decade
    const renderDecade = (days: number[], decadeNumber: number, title: string, subtitle: string, moonType: string) => {
        const active = isCurrentDecade(decadeNumber);
        return (
        <div className={`p-3 flex-1 rounded-lg border transition-all duration-500 group relative overflow-hidden
            ${active 
                ? 'border-sky-400/50 bg-sky-900/10 shadow-[0_0_15px_rgba(56,189,248,0.1)] scale-[1.02] z-10' 
                : 'border-gold-dim/20 bg-ink/30 hover:bg-ink/50'}
        `}>
            {/* Background decorative element */}
            {active && (
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-sky-400/10 rounded-full blur-xl pointer-events-none"></div>
            )}
            
            <div className="text-center mb-3 relative z-10 border-b border-gold-dim/20 pb-2">
                {getMoonSvg(moonType, active)}
                <h4 className={`text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest ${active ? 'text-sky-400' : 'text-gold-dim'}`}>{title}</h4>
                <div className="text-[8px] sm:text-[9px] font-serif italic text-gold-dim/70 tracking-widest uppercase mt-0.5">{subtitle}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 md:gap-2 justify-items-center relative z-10">
                {days.map(day => {
                    const isToday = day === atticDate.dayOfMonth;
                    const isPast = day < atticDate.dayOfMonth;
                    
                    return (
                        <div 
                            key={day} 
                            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-sm sm:rounded-md flex items-center justify-center text-[8px] sm:text-[10px] md:text-[11px] font-serif transition-all
                                ${isToday 
                                    ? 'bg-sky-400 text-ink shadow-[0_0_10px_rgba(56,189,248,0.6)] font-bold scale-110 ring-1 ring-sky-300' 
                                    : isPast
                                        ? 'bg-gold-dim/20 text-gold-leaf/50 border border-gold-dim/30'
                                        : 'bg-ink/50 text-gold-dim/40 border border-gold-dim/10'
                                }`}
                            title={`Día ${day}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    )};

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
                        <div className="font-serif text-xs tracking-widest text-gold-dim uppercase">{transliterateGreek(atticDate.monthName)}</div>
                        <div className="text-sm italic text-parchment font-body bg-gold-leaf/10 px-4 py-1 rounded-full shadow-inner border border-gold-leaf/20">Mes de {translateGreekUI(atticDate.monthName)}</div>
                    </div>

                    {/* MAIN: Date and decades timeline */}
                    <div className="w-full my-2">
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-sm leading-tight mb-1">
                            {atticDate.full}
                        </h2>
                        <div className="font-serif text-xs tracking-widest text-gold-dim uppercase mb-1">
                            {transliterateGreek(atticDate.full)}
                        </div>
                        <p className="font-serif text-base text-gold-leaf font-bold italic px-2 mt-2">
                            "{atticDate.spanishFull}"
                        </p>
                    </div>

                    {/* THE THREE DECADES OF THE LUNAR MONTH */}
                    <div className="w-full mt-4 mb-2">
                        <h3 className="font-serif text-xs uppercase tracking-widest text-gold-leaf mb-5 flex items-center justify-center gap-3 border-y border-gold-dim/20 py-3 bg-ink/20">
                            <span className="text-sky-400">☾</span> Mēn: El Ciclo Lunar <span className="text-sky-400">☽</span>
                        </h3>
                        <div className="flex flex-row justify-center gap-1.5 sm:gap-2 md:gap-3 w-full cursor-help hover:opacity-80 transition-opacity" onClick={(e) => { e.stopPropagation(); setShowFestivals(true); }}>
                            {renderDecade(decade1, 1, "Ἱστάμενος", "Creciente", "waxing")}
                            {renderDecade(decade2, 2, "Μεσῶν", "Medio", "full")}
                            {renderDecade(decade3, 3, "Φθίνων", "Menguante", "waning")}
                        </div>
                    </div>

                    {/* DEITY / FESTIVAL OF THE DAY */}
                    {deityName && (
                        <div className="flex flex-col items-center gap-0 w-full transition-all group-hover:bg-ink/10 relative">
                            
                            {/* Etiqueta de Categoría (Basada en H.W. Parke) */}
                            {festival?.category && (
                                <div className="absolute -top-3 right-4 px-2 py-0.5 bg-sky-900/80 border border-sky-400/50 text-sky-300 text-[10px] uppercase tracking-[0.1em] rounded-sm backdrop-blur-md shadow-lg font-serif z-20 flex items-center gap-1.5">
                                    {getCategoryBadge(festival.category)}
                                </div>
                            )}

                            <div className="w-full bg-gold-leaf/5 p-5 rounded-lg border-2 border-gold-leaf/20 shadow-sm relative overflow-hidden">
                                {/* Si es día impuro (Apaphrades), fondo oscurecido */}
                                {festival?.isApaphrades && (
                                    <div className="absolute inset-0 bg-rose-950/20 pointer-events-none rounded-lg" />
                                )}

                                <div className="text-gold-leaf text-xs font-bold uppercase tracking-widest mb-1 relative z-10 flex justify-center items-center gap-2">
                                    {hasFestival && <span className="text-sky-400/70 text-lg">🏛️</span>}
                                    {displayDeityTitle}
                                    {hasFestival && <span className="text-sky-400/70 text-lg">🏛️</span>}
                                </div>

                                <h2 className={`text-2xl md:text-3xl font-serif font-black text-parchment drop-shadow-md leading-tight relative z-10`}>
                                    {deityName}
                                </h2>
                                
                                <div className="font-serif text-[10px] text-gold-dim tracking-widest uppercase mb-1 relative z-10">
                                    {transliterateGreek(deityName)}
                                </div>

                                {/* Sub-nombre del día del festival (Ej: Pithoigia, Choes, Agyrmos) */}
                                {festival?.festivalDayName && (
                                    <div className="mt-3 mb-1 inline-block px-4 py-1.5 bg-sky-900/30 border-t border-b border-sky-400/30 text-sky-400 font-serif text-sm font-bold tracking-widest uppercase relative z-10 shadow-inner">
                                        {festival.festivalDayName}
                                    </div>
                                )}

                                <p className="font-serif text-sm text-parchment/90 italic px-4 mt-3 leading-relaxed relative z-10">
                                    "{deityDesc}"
                                </p>

                                {/* Participantes Históricos */}
                                {festival?.participants && (
                                    <div className="mt-4 pt-3 border-t border-gold-dim/20 w-full text-center relative z-10 flex flex-col items-center">
                                        <span className="text-gold-dim/60 text-[9px] uppercase tracking-[0.2em] mb-1 font-bold">
                                            Participantes Históricos:
                                        </span>
                                        <span className="text-xs font-serif text-sky-200 font-bold">
                                            {festival.participants}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* ALERTA: Días Tabú / Impuros (Apaphrades Hemerai) */}
                            {apaphrades.isTaboo && (
                                <div className="w-full mt-4 bg-rose-950/40 border border-rose-900/80 p-3 rounded-md flex items-center gap-3 shadow-inner relative z-10">
                                    <span className="text-2xl filter drop-shadow-glow animate-pulse">🏺</span>
                                    <div className="text-left flex flex-col">
                                        <span className="text-xs font-serif uppercase tracking-[0.1em] font-bold text-rose-500 mb-0.5">
                                            Apaphrades Hemerai (Día Nefasto)
                                        </span>
                                        <p className="text-[11px] font-serif text-rose-200/80 leading-snug">
                                            {apaphrades.reason}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* NEXT FESTIVALS MODAL */}
                {showFestivals && (
                    <div 
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fadeIn cursor-pointer"
                        onClick={() => setShowFestivals(false)}
                    >
                        <div 
                            className="w-full max-w-lg bg-ink border-4 border-sky-400/60 rounded-sm shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden relative cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-sky-400/30 bg-sky-950/20 text-center">
                                <div className="text-sky-400 text-3xl mb-2">🏛️</div>
                                <h2 className="text-2xl font-serif font-black text-parchment uppercase tracking-widest drop-shadow-sm">
                                    Próximos Festivales
                                </h2>
                                <p className="text-[10px] text-sky-400/60 uppercase tracking-[0.3em] font-bold mt-1">
                                    Calendario Sagrado de Atenas
                                </p>
                            </div>

                            {/* List */}
                            <div className="p-6 flex flex-col gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-ink/20">
                                {getNextAtticFestivals(atticDate.monthIndex, atticDate.dayOfMonth, 3).map((f, i) => (
                                    <div key={i} className="group/fest">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-gold-leaf font-serif text-lg font-bold group-hover/fest:text-sky-400 transition-colors leading-tight">
                                                    {f.name}
                                                </h4>
                                                <span className="text-[10px] text-gold-dim/60 font-bold uppercase tracking-widest">
                                                    {f.date}
                                                </span>
                                            </div>
                                            <div className="bg-sky-400/10 border border-sky-400/30 rounded px-2 py-1 text-right">
                                                <div className="text-[14px] text-sky-400 font-black leading-none">{f.daysRemaining}</div>
                                                <div className="text-[7px] text-sky-400/60 uppercase font-bold tracking-tighter">días</div>
                                            </div>
                                        </div>
                                        <p className="text-parchment/80 font-serif text-sm leading-relaxed italic border-l-2 border-sky-400/20 pl-4 py-1">
                                            {f.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <button 
                                className="w-full p-4 bg-sky-400/10 border-t border-sky-400/30 text-sky-400 font-serif text-xs uppercase tracking-widest hover:bg-sky-400/20 transition-all font-bold"
                                onClick={() => setShowFestivals(false)}
                            >
                                Cerrar Rollo Sagrado
                            </button>
                        </div>
                    </div>
                )}

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

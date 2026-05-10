import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    const apaphrades = checkApaphrades(atticDate.monthIndex, atticDate.dayOfMonth, festival);
    
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
        <>
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

                                <div className="text-gold-leaf text-xs font-bold uppercase tracking-widest mb-1 relative z-10 flex flex-col items-center gap-1">
                                    <div className="flex justify-center items-center gap-2">
                                        {hasFestival && <span className="text-sky-400/70 text-lg">🏛️</span>}
                                        {displayDeityTitle}
                                        {hasFestival && <span className="text-sky-400/70 text-lg">🏛️</span>}
                                    </div>
                                    
                                    {/* Indicadores Rápidos de Contenido Enriquecido */}
                                    {hasFestival && (
                                        <div className="flex gap-3 mt-1 px-3 py-1 bg-sky-400/5 rounded-full border border-sky-400/20">
                                            {festival?.ritualOffering && <span title="Ofrenda Ritual" className="filter drop-shadow-sm">🏺</span>}
                                            {festival?.pannychisDesc && <span title="Pannychis (Vigilia)" className="filter drop-shadow-sm animate-pulse">🕯️</span>}
                                            {festival?.agonDesc && <span title="Agōn (Competición)" className="filter drop-shadow-sm">🌿</span>}
                                            {festival?.economyDesc && <span title="Economía y Liturgias" className="filter drop-shadow-sm">🪙</span>}
                                            {festival?.aition && <span title="Aition (Mito Fundacional)" className="filter drop-shadow-sm">📜</span>}
                                        </div>
                                    )}
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

                                {/* OFRENDA RITUAL ("El Menú de los Dioses") */}
                                {festival?.ritualOffering && (
                                    <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-md relative z-10 flex items-start gap-3 shadow-sm">
                                        <span className="text-2xl filter drop-shadow-md">{festival.ritualOffering.icon}</span>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-amber-500 mb-0.5">
                                                Ofrenda Tradicional
                                            </span>
                                            <span className="text-xs font-serif text-amber-100/90 leading-snug">
                                                {festival.ritualOffering.item}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* VIGILIA NOCTURNA (Pannychis y Lampadedromia) */}
                                {festival?.pannychisDesc && (
                                    <div className="mt-3 p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-md relative z-10 flex items-start gap-3 shadow-inner">
                                        <span className="text-xl animate-pulse filter drop-shadow-[0_0_5px_rgba(129,140,248,0.8)]">🕯️</span>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-indigo-400 mb-0.5">
                                                Pannychis (Vigilia Sagrada)
                                            </span>
                                            <span className="text-[11px] font-serif text-indigo-200/80 leading-snug italic">
                                                {festival.pannychisDesc}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* AGŌN (Juegos y Competiciones) */}
                                {festival?.agonDesc && (
                                    <div className="mt-3 p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-md relative z-10 flex items-start gap-3 shadow-inner">
                                        <span className="text-xl filter drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">🌿</span>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-emerald-400 mb-0.5">
                                                Agōn (Competición)
                                            </span>
                                            <span className="text-[11px] font-serif text-emerald-100/80 leading-snug">
                                                {festival.agonDesc}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* ECONOMÍA (Premios, Costes y Liturgias) */}
                                {festival?.economyDesc && (
                                    <div className="mt-3 p-3 bg-yellow-950/30 border border-yellow-500/40 rounded-md relative z-10 flex items-start gap-3 shadow-inner">
                                        <span className="text-xl filter drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]">🪙</span>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-serif uppercase tracking-[0.15em] font-bold text-yellow-500 mb-0.5">
                                                El Precio de la Piedad
                                            </span>
                                            <span className="text-[11px] font-serif text-yellow-100/80 leading-snug italic">
                                                {festival.economyDesc}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* AITION (Mito Fundacional) */}
                                {festival?.aition && (
                                    <div className="mt-4 p-4 bg-stone-900/80 border border-stone-700/50 rounded-md relative z-10 flex flex-col items-start gap-2 shadow-inner">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl filter drop-shadow-md">📜</span>
                                            <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-bold text-stone-300">
                                                Aition: El Mito Fundacional
                                            </span>
                                        </div>
                                        <p className="text-[12px] font-serif text-stone-400/90 leading-relaxed text-left border-l-2 border-stone-600/50 pl-3 italic">
                                            {festival.aition}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ALERTA: Días Tabú / Impuros (Apaphrades Hemerai) con Instrucciones */}
                            {apaphrades.isTaboo && (
                                <div className="w-full mt-6 bg-rose-950/60 border-2 border-rose-900/80 p-4 sm:p-5 rounded-md flex flex-col gap-3 shadow-[inset_0_0_30px_rgba(225,29,72,0.15)] relative z-10">
                                    
                                    {/* Barras de peligro "Atenienses" (estilo cuerda) */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#881337_10px,#881337_20px)] opacity-50 rounded-t-sm"></div>
                                    
                                    <div className="flex items-center gap-4 border-b border-rose-900/50 pb-3">
                                        <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(225,29,72,0.8)] animate-bounce">
                                            {apaphrades.icon}
                                        </span>
                                        <div className="text-left flex flex-col">
                                            <span className="text-base font-serif uppercase tracking-[0.15em] font-black text-rose-500 leading-none mb-1">
                                                Apaphrades Hemera
                                            </span>
                                            <span className="text-[10px] font-serif text-rose-300/80 tracking-widest uppercase">
                                                (Día Nefasto y Prohibido)
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs sm:text-sm font-serif text-rose-200/90 leading-relaxed text-left italic">
                                        {apaphrades.reason}
                                    </p>

                                    {apaphrades.instruction && (
                                        <div className="bg-rose-900/30 border border-rose-500/40 rounded p-3 mt-2 shadow-inner">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-1.5 flex items-center gap-2">
                                                <span className="text-rose-500 animate-pulse">⚠️</span> Instrucción de Supervivencia:
                                            </span>
                                            <p className="font-serif text-xs text-rose-100/90 leading-snug text-left">
                                                "{apaphrades.instruction}"
                                            </p>
                                        </div>
                                    )}
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

        {/* NEXT FESTIVALS MODAL */}
        {showFestivals && (
            <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fadeIn cursor-pointer"
                onClick={() => setShowFestivals(false)}
            >
                <div 
                    className="w-full max-w-lg bg-ink border-4 border-sky-400/60 rounded-sm shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden relative cursor-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-sky-400/30 bg-sky-950/20 text-center relative">
                        <button
                            onClick={() => setShowFestivals(false)}
                            className="absolute top-4 right-4 text-sky-400/60 hover:text-sky-400 transition-colors p-2 rounded-full hover:bg-sky-400/10 z-10"
                            aria-label="Cerrar"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="text-sky-400 text-3xl mb-2">🏛️</div>
                        <h2 className="text-2xl font-serif font-black text-parchment uppercase tracking-widest drop-shadow-sm">
                            Próximos Festivales
                        </h2>
                        <p className="text-[10px] text-sky-400/60 uppercase tracking-[0.3em] font-bold mt-1">
                            Calendario Sagrado de Atenas
                        </p>
                    </div>

                    {/* List */}
                    <div className="p-6 flex flex-col gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-ink/20 overscroll-behavior-contain">
                        {getNextAtticFestivals(atticDate.monthIndex, atticDate.dayOfMonth, 3).map((f, i) => (
                            <div key={i} className="group/fest border-b border-gold-dim/10 pb-6 last:border-0">
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
                                <p className="text-parchment/80 font-serif text-sm leading-relaxed italic border-l-2 border-sky-400/20 pl-4 py-1 mb-3">
                                    {f.description}
                                </p>

                                {/* Información Enriquecida en la lista de Próximos */}
                                <div className="grid grid-cols-1 gap-2 pl-4">
                                    {f.fullFestival?.ritualOffering && (
                                        <div className="text-[10px] font-serif text-amber-200/70 flex items-center gap-2">
                                            <span>{f.fullFestival.ritualOffering.icon}</span>
                                            <span><b className="text-amber-500/80 uppercase tracking-tighter">Ofrenda:</b> {f.fullFestival.ritualOffering.item}</span>
                                        </div>
                                    )}
                                    {f.fullFestival?.pannychisDesc && (
                                        <div className="text-[10px] font-serif text-indigo-200/70 flex items-center gap-2">
                                            <span className="animate-pulse">🕯️</span>
                                            <span><b className="text-indigo-400/80 uppercase tracking-tighter">Vigilia:</b> {f.fullFestival.pannychisDesc}</span>
                                        </div>
                                    )}
                                    {f.fullFestival?.agonDesc && (
                                        <div className="text-[10px] font-serif text-emerald-200/70 flex items-center gap-2">
                                            <span>🌿</span>
                                            <span><b className="text-emerald-400/80 uppercase tracking-tighter">Agōn:</b> {f.fullFestival.agonDesc}</span>
                                        </div>
                                    )}
                                    {f.fullFestival?.economyDesc && (
                                        <div className="text-[10px] font-serif text-yellow-200/70 flex items-center gap-2">
                                            <span>🪙</span>
                                            <span><b className="text-yellow-500/80 uppercase tracking-tighter">Economía:</b> {f.fullFestival.economyDesc}</span>
                                        </div>
                                    )}
                                    {f.fullFestival?.aition && (
                                        <div className="text-[10px] font-serif text-stone-300/70 flex items-start gap-2 bg-stone-900/40 p-2 rounded mt-1 border-l-2 border-stone-600/50">
                                            <span className="text-xs">📜</span>
                                            <span><b className="text-stone-300 uppercase tracking-tighter">Aition:</b> {f.fullFestival.aition}</span>
                                        </div>
                                    )}
                                </div>
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
        </>
    );
};

export default HellenicCalendarInfo;

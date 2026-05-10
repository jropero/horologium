
import React, { useState, useEffect } from 'react';
import { getRomanDayInfo, RomanDayInfo, getNextRomanFestivals } from '../utils/romanCalendarData';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDefaultAtticDeity, AtticFestivalInfo } from '../utils/atticCalendarData';
import { getHistoricalEvents } from '../utils/romanHistoryData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';

const RomanCalendarInfo: React.FC = () => {
    const { civilization, labels } = useCivilization();
    const [info, setInfo] = useState<RomanDayInfo | null>(null);
    const [showFestivals, setShowFestivals] = useState(false);
    const [greekInfo, setGreekInfo] = useState<{ festival: AtticFestivalInfo | null; defaultDeity: AtticFestivalInfo; atticDate: AtticDateResult } | null>(null);

    useEffect(() => {
        const today = new Date();
        setInfo(getRomanDayInfo(today));

        const atticDate = getAtticDate(today);
        const festival = getAtticFestivalInfo(atticDate.monthIndex, atticDate.dayOfMonth);
        const defaultDeity = getDefaultAtticDeity(atticDate.monthIndex);
        setGreekInfo({ festival, defaultDeity, atticDate });
    }, []);

    if (!info && !greekInfo) return null;

    const getStatusIcon = (status: string) => {
        if (status === 'F' || status === 'C') return "⚖️";
        if (status === 'N' || status === 'NP') return "🏛️";
        return "📜";
    };

    const getStatusColor = (status: string) => {
        if (status === 'F') return "text-emerald-600 dark:text-emerald-400";
        if (status === 'C') return "text-blue-600 dark:text-blue-400";
        if (status === 'N') return "text-rose-600 dark:text-rose-400";
        if (status === 'NP') return "text-amber-500 dark:text-amber-400";
        return "text-gold-leaf";
    };

    // Roman mode
    if (civilization === 'rome' && info) {
        return (
            <div className="w-full max-w-md mx-auto mt-6 mb-6">
                <div 
                    className="bg-ink/90 border border-gold-dim p-5 rounded-lg shadow-xl relative overflow-hidden text-center group cursor-pointer hover:border-roman-red transition-colors"
                    onClick={() => setShowFestivals(true)}
                >

                    {info.isMajorFestival && (
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-leaf via-transparent to-transparent" />
                    )}

                    <div className="relative z-10 flex flex-col items-center gap-4">

                        {/* TOP: Status & Date Type */}
                        <div className="border-b border-gold-dim/50 pb-2 w-full flex items-center justify-center gap-2">
                            <span className="text-2xl filter drop-shadow-glow">{getStatusIcon(info.status)}</span>
                            <h3 className={`font-serif text-lg uppercase tracking-[0.2em] ${getStatusColor(info.status)}`}>
                                {info.statusFull}
                            </h3>
                        </div>

                        {/* MAIN: Deus Diei */}
                        <div className="flex flex-col items-center gap-2 w-full bg-white/5 p-4 rounded border border-gold-dim/20 transition-all hover:bg-white/10">
                            <div className="text-gold-dim text-xs uppercase tracking-widest mb-1">{labels.godOfDayTitle}</div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-parchment drop-shadow-md">
                                {info.god}
                            </h2>
                            <p className="font-serif text-sm text-parchment/80 italic px-2">
                                "{info.description}"
                            </p>
                        </div>

                        {/* BOTTOM: Festival */}
                        {info.festivalName && (
                            <div className="mt-1 w-full animate-fadeIn">
                                <div className="text-festival opacity-80 text-[10px] uppercase tracking-widest mb-1">{labels.festivalLabel}</div>
                                <h2 className="font-serif text-xl font-bold text-festival mb-1 tracking-wide">
                                    {info.festivalName.toUpperCase()}
                                </h2>
                            </div>
                        )}

                        {/* EPHEMERIDES */}
                        {getHistoricalEvents(new Date()).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gold-dim/30 w-full animate-fadeIn">
                                <div className="text-parchment/90 text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                                    <span>📜</span> {labels.calendarInfoTitle} <span>📜</span>
                                </div>
                                <ul className="space-y-3">
                                    {getHistoricalEvents(new Date()).map((evt: any, i: number) => (
                                        <li key={i} className="flex flex-col text-center">
                                            <span className="text-gold-leaf font-serif italic text-sm">"{evt.latin}"</span>
                                            <span className="text-parchment/70 text-xs">{evt.spanish}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>

                {/* NEXT FESTIVALS MODAL */}
                {showFestivals && (
                    <div 
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fadeIn cursor-pointer"
                        onClick={() => setShowFestivals(false)}
                    >
                        <div 
                            className="w-full max-w-lg bg-ink border-4 border-roman-red rounded-sm shadow-[0_0_50px_rgba(153,27,27,0.3)] overflow-hidden relative cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-roman-red bg-rose-950/20 text-center">
                                <div className="text-roman-red text-3xl mb-2">🏛️</div>
                                <h2 className="text-2xl font-serif font-black text-parchment uppercase tracking-widest drop-shadow-sm">
                                    Proxima Festa
                                </h2>
                                <p className="text-[10px] text-roman-red uppercase tracking-[0.3em] font-bold mt-1">
                                    Calendarium Romanum
                                </p>
                            </div>

                            {/* List */}
                            <div className="p-6 flex flex-col gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-ink/20">
                                {getNextRomanFestivals(new Date(), 3).map((f, i) => (
                                    <div key={i} className="group/fest">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-gold-leaf font-serif text-lg font-bold group-hover/fest:text-roman-red transition-colors leading-tight">
                                                    {f.name}
                                                </h4>
                                                <span className="text-[10px] text-gold-dim/60 font-bold uppercase tracking-widest">
                                                    {f.date}
                                                </span>
                                            </div>
                                            <div className="bg-roman-red/10 border border-roman-red/30 rounded px-2 py-1 text-right">
                                                <div className="text-[14px] text-roman-red font-black leading-none">{f.daysRemaining}</div>
                                                <div className="text-[7px] text-roman-red/60 uppercase font-bold tracking-tighter">dies</div>
                                            </div>
                                        </div>
                                        <p className="text-parchment/80 font-serif text-sm leading-relaxed italic border-l-2 border-roman-red/20 pl-4 py-1">
                                            {f.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <button 
                                className="w-full p-4 bg-roman-red/10 border-t border-roman-red/30 text-roman-red font-serif text-xs uppercase tracking-widest hover:bg-roman-red/20 transition-all font-bold"
                                onClick={() => setShowFestivals(false)}
                            >
                                Claudere Fastos
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default RomanCalendarInfo;

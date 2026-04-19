
import React, { useState, useEffect } from 'react';
import { getRomanDayInfo, RomanDayInfo } from '../utils/romanCalendarData';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDefaultAtticDeity, AtticFestivalInfo } from '../utils/atticCalendarData';
import { getHistoricalEvents } from '../utils/romanHistoryData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';

const RomanCalendarInfo: React.FC = () => {
    const { civilization, labels } = useCivilization();
    const [info, setInfo] = useState<RomanDayInfo | null>(null);
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
                <div className="bg-ink/90 border border-gold-dim p-5 rounded-lg shadow-xl relative overflow-hidden text-center group">

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
                                <div className="text-parchment/60 text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
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
            </div>
        );
    }

    // Greek mode
    if (civilization === 'hellas' && greekInfo) {
        const deity = greekInfo.festival?.deity || greekInfo.defaultDeity.deity;
        const deityDesc = greekInfo.festival?.deityDesc || greekInfo.defaultDeity.deityDesc;
        const hasFestival = !!greekInfo.festival?.festivalName;
        const isMajor = greekInfo.festival?.isMajor || false;

        return (
            <div className="w-full max-w-md mx-auto mt-6 mb-6">
                <div className="bg-ink/90 border border-gold-dim p-5 rounded-lg shadow-xl relative overflow-hidden text-center group">

                    {isMajor && (
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-leaf via-transparent to-transparent" />
                    )}

                    <div className="relative z-10 flex flex-col items-center gap-4">

                        {/* TOP: Month name */}
                        <div className="border-b border-gold-dim/50 pb-2 w-full flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl filter drop-shadow-glow">🏛️</span>
                                <h3 className="font-serif text-lg md:text-xl uppercase tracking-[0.2em] text-gold-leaf">
                                    {greekInfo.atticDate.monthName} 
                                </h3>
                            </div>
                            <div className="font-serif text-[10px] opacity-70 tracking-widest text-gold-dim uppercase">{transliterateGreek(greekInfo.atticDate.monthName)}</div>
                            <div className="text-xs italic text-parchment/80 font-body">Mes de {translateGreekUI(greekInfo.atticDate.monthName)}</div>
                        </div>

                        {/* MAIN: Deity of the Day */}
                        <div className="flex flex-col items-center gap-2 w-full bg-white/5 p-4 rounded border border-gold-dim/20 transition-all hover:bg-white/10">
                            <div className="text-gold-dim text-[10px] uppercase tracking-widest mb-1">{labels.godOfDayTitle}</div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-parchment drop-shadow-md leading-tight">
                                {deity}
                            </h2>
                            <div className="font-serif text-xs opacity-70 tracking-widest uppercase mb-1">{transliterateGreek(deity)}</div>
                            <p className="font-serif text-sm text-roman-red font-bold italic px-2 mt-1">
                                "{deityDesc}"
                            </p>
                        </div>

                        {/* BOTTOM: Festival */}
                        {hasFestival && (
                            <div className="mt-2 w-full animate-fadeIn flex flex-col items-center">
                                <div className="text-festival opacity-80 text-[10px] uppercase tracking-widest mb-1">{labels.festivalLabel}</div>
                                <h2 className="font-serif text-xl font-bold text-festival tracking-wide text-center">
                                    {greekInfo.festival!.festivalName!.toUpperCase()}
                                </h2>
                                <div className="font-serif text-[10px] opacity-70 tracking-widest uppercase mt-0.5 text-festival">{transliterateGreek(greekInfo.festival!.festivalName!)}</div>
                                
                                {greekInfo.festival!.festivalDesc && (
                                    <p className="font-serif text-sm text-parchment/80 italic mt-3 px-4 text-center">
                                        "{greekInfo.festival!.festivalDesc}"
                                    </p>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default RomanCalendarInfo;


import React, { useState, useEffect } from 'react';
import { getRomanDayInfo, RomanDayInfo } from '../utils/romanCalendarData';
import { getHistoricalEvents } from '../utils/romanHistoryData';

const RomanCalendarInfo: React.FC = () => {
    const [info, setInfo] = useState<RomanDayInfo | null>(null);

    useEffect(() => {
        const today = new Date();
        setInfo(getRomanDayInfo(today));
    }, []);

    if (!info) return null;

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

                    {/* MAIN: Deus Diei (God of the Day - from 365 list) */}
                    <div className="flex flex-col items-center gap-2 w-full bg-white/5 p-4 rounded border border-gold-dim/20 transition-all hover:bg-white/10">
                        <div className="text-gold-dim text-xs uppercase tracking-widest mb-1">— Deus Hodiernus —</div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-parchment drop-shadow-md">
                            {info.god}
                        </h2>

                        {/* If it's NOT a named festival, description goes here. If it IS, description might be festival related below. 
                            Let's show the main description here regardless as it handles both now. 
                        */}
                        <p className="font-serif text-sm text-parchment/80 italic px-2">
                            "{info.description}"
                        </p>
                    </div>

                    {/* BOTTOM: Festival / Event Name (If specific) */}
                    {info.festivalName && (
                        <div className="mt-1 w-full animate-fadeIn">
                            <div className="text-amber-500/80 text-[10px] uppercase tracking-widest mb-1">✧ Festum ✧</div>
                            <h2 className="font-serif text-xl font-bold text-amber-500 mb-1 tracking-wide">
                                {info.festivalName.toUpperCase()}
                            </h2>
                        </div>
                    )}

                    {/* EPHEMERIDES (If any) */}
                    {getHistoricalEvents(new Date()).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gold-dim/30 w-full animate-fadeIn">
                            <div className="text-parchment/60 text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                                <span>📜</span> Memoria Rerum Gestarum <span>📜</span>
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
};

export default RomanCalendarInfo;

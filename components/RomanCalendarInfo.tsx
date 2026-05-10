
import React, { useState, useEffect } from 'react';
import { getRomanDayInfo, RomanDayInfo, getNextRomanFestivals } from '../utils/romanCalendarData';
import { getAtticDate, AtticDateResult } from '../utils/atticCalendarUtils';
import { getAtticFestivalInfo, getDefaultAtticDeity, AtticFestivalInfo } from '../utils/atticCalendarData';
import { getHistoricalEvents } from '../utils/romanHistoryData';
import { useCivilization } from '../contexts/CivilizationContext';
import { transliterateGreek } from '../utils/greekTransliteration';
import { translateGreekUI } from '../utils/greekTranslations';
import { 
    OVID_MOS_MAIORUM, 
    OVID_ANNALES_BELLI, 
    OVID_PRECES_ET_SACRA, 
    OVID_AEDES_ET_MONUMENTA,
    OVID_STATUS_EXPLANATIONS,
    OVID_SACRIFICIA
} from '../utils/ovidFastiData';
import { Info, X } from 'lucide-react';

interface RomanCalendarInfoProps {
    currentDate?: Date;
}

const RomanCalendarInfo: React.FC<RomanCalendarInfoProps> = ({ currentDate = new Date() }) => {
    const { civilization, labels } = useCivilization();
    const [info, setInfo] = useState<RomanDayInfo | null>(null);
    const [showFestivals, setShowFestivals] = useState(false);
    const [showStatusInfo, setShowStatusInfo] = useState(false);
    const [greekInfo, setGreekInfo] = useState<{ festival: AtticFestivalInfo | null; defaultDeity: AtticFestivalInfo; atticDate: AtticDateResult } | null>(null);

    useEffect(() => {
        setInfo(getRomanDayInfo(currentDate));

        const atticDate = getAtticDate(currentDate);
        const festival = getAtticFestivalInfo(atticDate.monthIndex, atticDate.dayOfMonth);
        const defaultDeity = getDefaultAtticDeity(atticDate.monthIndex);
        setGreekInfo({ festival, defaultDeity, atticDate });
    }, [currentDate]);

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

    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const mosMaiorum = OVID_MOS_MAIORUM.find(e => e.month === month && e.day === day);
    const annalesBelli = OVID_ANNALES_BELLI.find(e => e.month === month && e.day === day);
    
    const preces = OVID_PRECES_ET_SACRA.find(e => {
        if (e.startMonth === e.endMonth) {
            return month === e.startMonth && day >= e.startDay && day <= e.endDay;
        }
        if (month === e.startMonth) return day >= e.startDay;
        if (month === e.endMonth) return day <= e.endDay;
        if (month > e.startMonth && month < e.endMonth) return true;
        return false;
    });
    
    
    const monument = OVID_AEDES_ET_MONUMENTA.find(e => e.month === month && e.day === day);

    const sacrifice = OVID_SACRIFICIA.find(e => e.month === month && e.day === day) || OVID_SACRIFICIA.find(e => e.isGeneric);
    
    const statusExplanation = OVID_STATUS_EXPLANATIONS.find(e => e.status === info?.status) || 
                             (info?.status.startsWith('N') ? OVID_STATUS_EXPLANATIONS.find(e => e.status === 'N') : null);

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
                        <div className="border-b border-gold-dim/50 pb-2 w-full flex items-center justify-center gap-3">
                            <span className="text-2xl filter drop-shadow-glow">{getStatusIcon(info.status)}</span>
                            <h3 className={`font-serif text-lg uppercase tracking-[0.2em] ${getStatusColor(info.status)}`}>
                                {info.statusFull}
                            </h3>
                            {statusExplanation && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowStatusInfo(true); }}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors group flex-shrink-0"
                                    title="Explicación de Ovidio"
                                >
                                    <Info className="w-4 h-4 text-gold-dim group-hover:text-gold-leaf" />
                                </button>
                            )}
                        </div>

                        {/* MAIN: Deus Diei */}
                        <div className="flex flex-col items-center gap-2 w-full bg-stone-900/40 p-6 rounded border border-gold-dim/20 shadow-inner">
                            <div className="text-gold-dim text-[10px] uppercase tracking-[0.3em] mb-1 flex items-center gap-3">
                                <span className="opacity-40">—</span>
                                {labels.godOfDayTitle}
                                <span className="opacity-40">—</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-parchment drop-shadow-md uppercase tracking-wider">
                                {info.god}
                            </h2>
                            <p className="font-serif text-sm md:text-base text-parchment/80 italic px-4 mt-2 leading-relaxed">
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

                        {/* AITION OVIDIANO - FASTI */}
                        {info.ovidExcerpt && (
                            <div className="mt-5 p-4 bg-stone-900/80 border border-gold-dim/50 rounded-md relative z-10 flex flex-col items-start gap-3 shadow-inner w-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl filter drop-shadow-md">📜</span>
                                    <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-bold text-stone-300">
                                        Aition: Fastos de Ovidio
                                    </span>
                                </div>
                                <p className="text-[12px] md:text-sm font-serif text-parchment/90 leading-relaxed text-left border-l-2 border-gold-leaf/50 pl-4 py-1 italic">
                                    "{info.ovidExcerpt.text}"
                                </p>
                                <span className="text-[9px] md:text-[10px] text-gold-dim/70 self-end mt-1 uppercase tracking-widest font-bold">
                                    — Liber {info.ovidExcerpt.book}, vv. {info.ovidExcerpt.lines}
                                </span>
                            </div>
                        )}

                        {/* EPIC 4: Mos Maiorum (Curiosidad del Día) */}
                        {mosMaiorum && (
                            <div className="mt-4 p-4 bg-amber-900/20 border border-gold-dim/30 rounded-md relative z-10 flex flex-col items-start gap-2 w-full animate-fadeIn">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🍷</span>
                                    <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-black text-amber-500">
                                        Mos Maiorum: {mosMaiorum.title}
                                    </span>
                                </div>
                                <p className="text-[11px] md:text-xs font-serif text-parchment/90 leading-relaxed text-left italic">
                                    "{mosMaiorum.text}"
                                </p>
                                <span className="text-[8px] text-gold-dim/60 self-end uppercase tracking-widest">
                                    — Ovidio, {mosMaiorum.reference}
                                </span>
                            </div>
                        )}

                        {/* EPIC 5: Annales Belli (Memoria del Imperio) */}
                        {annalesBelli && (
                            <div className="mt-4 p-4 bg-roman-red/10 border border-roman-red/50 rounded-md relative z-10 flex flex-col items-start gap-2 w-full animate-fadeIn">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">⚔️</span>
                                    <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-black text-roman-red">
                                        Annales Belli: {annalesBelli.title}
                                    </span>
                                </div>
                                <p className="text-[11px] md:text-xs font-serif text-parchment/90 leading-relaxed text-left italic">
                                    "{annalesBelli.text}"
                                </p>
                                <span className="text-[8px] text-roman-red/60 self-end uppercase tracking-widest">
                                    — Ovidio, {annalesBelli.reference}
                                </span>
                            </div>
                        )}

                        {/* EPIC 6: Preces et Sacra */}
                        {preces && (
                            <div className="mt-4 p-5 bg-stone-900/90 border-2 border-parchment/30 rounded-md relative z-10 flex flex-col items-center gap-3 w-full animate-fadeIn shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <div className="flex items-center justify-center gap-3 border-b border-parchment/20 pb-2 w-full">
                                    <span className="text-xl">{preces.icon || "🙏"}</span>
                                    <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-black text-parchment">
                                        Preces et Sacra: {preces.title}
                                    </span>
                                    <span className="text-xl">{preces.icon || "🌬️"}</span>
                                </div>
                                <p className="text-[12px] md:text-[13px] font-serif text-parchment/90 leading-relaxed text-center italic w-full">
                                    "{preces.text}"
                                </p>
                                <span className="text-[8px] text-parchment/50 uppercase tracking-widest mt-1">
                                    — Ovidio, {preces.reference}
                                </span>
                            </div>
                        )}

                        {/* EPIC 7: Aedes et Monumenta */}
                        {monument && (
                            <div className="mt-4 p-4 bg-stone-800 border-x-4 border-stone-500 rounded-sm relative z-10 flex flex-col items-start gap-2 w-full animate-fadeIn shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🏛️</span>
                                    <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-black text-stone-300">
                                        Aedes et Monumenta: {monument.title}
                                    </span>
                                </div>
                                <p className="text-[11px] md:text-xs font-serif text-stone-400 leading-relaxed text-left border-l-2 border-stone-600 pl-3 italic">
                                    "{monument.text}"
                                </p>
                                <span className="text-[8px] text-stone-500 self-end uppercase tracking-widest font-bold">
                                    — Fasti, {monument.reference}
                                </span>
                            </div>
                        )}

                        {/* EPIC 10: Hostiae et Sacrificia */}
                        {sacrifice && (
                            <div className="mt-4 p-5 bg-stone-900/60 border border-stone-500/30 rounded-md relative z-10 flex flex-col items-center gap-3 w-full animate-fadeIn shadow-lg">
                                <div className="flex items-center justify-center gap-3 w-full">
                                    <span className="text-2xl filter drop-shadow-md">{sacrifice.icon || "🗡️"}</span>
                                    <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-black text-stone-300 text-center">
                                        Sacrificia: {sacrifice.title}
                                    </span>
                                </div>
                                <div className="w-full flex flex-col items-start gap-2 border-l-2 border-stone-500/30 pl-4 py-1">
                                    <p className="text-[12px] md:text-[13px] font-serif text-parchment/90 leading-relaxed text-left italic">
                                        "{sacrifice.text}"
                                    </p>
                                    <span className="text-[9px] text-stone-500 self-end uppercase tracking-widest font-bold mt-1">
                                        — Ovidio, {sacrifice.reference}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* EPHEMERIDES */}
                        {getHistoricalEvents(currentDate).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gold-dim/30 w-full animate-fadeIn">
                                <div className="text-parchment/90 text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                                    <span>📜</span> {labels.calendarInfoTitle} <span>📜</span>
                                </div>
                                <ul className="space-y-3">
                                    {getHistoricalEvents(currentDate).map((evt: any, i: number) => (
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
                                {getNextRomanFestivals(currentDate, 3).map((f, i) => (
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

                {/* EPIC 9: Status Info Modal */}
                {showStatusInfo && statusExplanation && (
                    <div 
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn cursor-pointer"
                        onClick={() => setShowStatusInfo(false)}
                    >
                        <div 
                            className="w-full max-w-sm bg-stone-900 border border-gold-leaf/50 p-6 rounded-lg shadow-2xl relative cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setShowStatusInfo(false)}
                                className="absolute top-4 right-4 text-gold-dim hover:text-gold-leaf transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="text-4xl filter drop-shadow-glow mb-2">{getStatusIcon(info.status)}</div>
                                <h3 className={`font-serif text-2xl uppercase tracking-[0.3em] font-black ${getStatusColor(info.status)}`}>
                                    Día {info.statusFull}
                                </h3>
                                <div className="w-16 h-px bg-gold-leaf/30" />
                                <p className="font-serif text-parchment/90 italic leading-relaxed">
                                    "{statusExplanation.text}"
                                </p>
                                <span className="text-[10px] text-gold-dim/60 uppercase tracking-widest font-bold">
                                    — Fastos, {statusExplanation.reference}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default RomanCalendarInfo;

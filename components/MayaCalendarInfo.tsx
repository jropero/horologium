import React, { useMemo } from 'react';
import { getMayaDate } from '../utils/mayaCalendarUtils';
import { getHaabLore } from '../utils/mayaLoreData';
import { TZOLKIN_NAMES, HAAB_NAMES } from '../types/maya';
import { Sun, Moon, Sparkles, Skull, Crown, Droplets, Leaf } from 'lucide-react';
import { useCivilization } from '../contexts/CivilizationContext';

interface MayaCalendarInfoProps {
  currentDate?: Date;
}

const MayaCalendarInfo: React.FC<MayaCalendarInfoProps> = ({ currentDate = new Date() }) => {
  const { civilization } = useCivilization();
  const mayaDate = useMemo(() => getMayaDate(currentDate), [currentDate]);

  if (civilization !== 'maya') return null;

  const haabLore = getHaabLore(mayaDate.haab.name);
  const isWayeb = mayaDate.haab.name === 'Wayeb\'';

  const tzolkinProgress = mayaDate.tzolkinIndex / 260;
  
  const currentMonthIndex = HAAB_NAMES.indexOf(mayaDate.haab.name);
  const haabProgress = currentMonthIndex === -1 ? 0 : (currentMonthIndex * 20 + mayaDate.haab.number) / 365;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-6 px-2 cursor-default transition-all">
      <div className="bg-ink/90 border-[4px] border-emerald-700/50 p-0 rounded-sm shadow-2xl relative overflow-hidden group hover:border-emerald-500/80 transition-colors">
        
        {/* Top Border Pattern */}
        <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderBottom: '2px solid rgba(16,185,129,0.3)' }}>
          <defs>
            <pattern id="maya-step" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,20 L0,15 L5,15 L5,10 L10,10 L10,5 L15,5 L15,0 L20,0" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="1" />
              <path d="M0,15 L5,15 L5,10 L10,10 L10,5 L15,5" fill="none" stroke="var(--gold-leaf)" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="20" fill="url(#maya-step)" />
        </svg>

        <div className="p-5 md:p-8 flex flex-col items-center gap-6 text-center">
          
          {/* TOP: Tzolk'in & Haab' */}
          <div className="border-b border-emerald-500/30 pb-6 w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            
            {/* Tzolk'in */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest mb-2">
                Tzolk'in (Calendario Divino)
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(207,181,59,0.2)" strokeWidth="4" />
                  <circle cx="48" cy="48" r="44" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="276" strokeDashoffset={276 * (1 - tzolkinProgress)} strokeLinecap="round" />
                </svg>
                <div className="flex flex-col items-center leading-none">
                  <span className="text-3xl font-black text-parchment drop-shadow-md">{mayaDate.tzolkin.number}</span>
                  <span className="text-sm font-serif text-emerald-400 mt-1 uppercase tracking-wider">{mayaDate.tzolkin.name}</span>
                </div>
              </div>
              <div className="text-[10px] text-gold-dim mt-2 font-serif">Día {mayaDate.tzolkinIndex} de 260</div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent"></div>

            {/* Haab' */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest mb-2">
                Haab' (Año Solar)
              </div>
              <div className={`relative w-24 h-24 flex items-center justify-center rounded-full border-4 ${isWayeb ? 'border-red-500/50 bg-red-900/20' : 'border-gold-dim/30 bg-ink/50'}`}>
                <div className="flex flex-col items-center leading-none">
                  <span className={`text-3xl font-black drop-shadow-md ${isWayeb ? 'text-red-400' : 'text-parchment'}`}>{mayaDate.haab.number}</span>
                  <span className={`text-sm font-serif mt-1 uppercase tracking-wider ${isWayeb ? 'text-red-400' : 'text-gold-leaf'}`}>{mayaDate.haab.name}</span>
                </div>
              </div>
              <div className="text-[10px] text-gold-dim mt-2 font-serif">Día {Math.floor(haabProgress * 365)} de 365</div>
            </div>

          </div>

          {/* LORE / MONTH HIGHLIGHT */}
          {haabLore && (
            <div className={`w-full p-6 rounded-lg border-2 shadow-lg transition-all ${isWayeb ? 'bg-gradient-to-b from-red-900/30 to-ink border-red-500/40' : 'bg-gradient-to-b from-emerald-900/20 to-ink border-emerald-500/30'}`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl">{haabLore.icon}</span>
                <h2 className={`text-2xl font-serif font-black uppercase tracking-widest ${isWayeb ? 'text-red-400' : 'text-emerald-400'}`}>
                  {haabLore.monthName}
                </h2>
                <span className="text-2xl">{haabLore.icon}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gold-leaf mb-4">
                {haabLore.title}
              </div>
              <p className="font-serif text-sm text-parchment/90 italic leading-relaxed max-w-lg mx-auto">
                "{haabLore.description}"
              </p>
              <div className="mt-4 pt-4 border-t border-emerald-500/20">
                <div className="text-[10px] text-emerald-500/60 uppercase tracking-widest mb-1">Ritual del Mes</div>
                <p className="text-xs text-gold-dim font-serif">{haabLore.ritual}</p>
              </div>
            </div>
          )}

          {/* LORD OF THE NIGHT */}
          <div className="w-full flex items-center justify-center gap-4 bg-ink/40 p-4 rounded-lg border border-gold-dim/20">
            <Moon className="text-indigo-400 w-5 h-5" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-indigo-300/70 font-bold">Señor de la Noche</span>
              <span className="text-sm font-serif font-bold text-indigo-200">Deidad {mayaDate.lordOfTheNight.id}</span>
            </div>
            <Moon className="text-indigo-400 w-5 h-5" />
          </div>

          {/* HAAB GRID (THE SCHEMA) */}
          <div className="w-full mt-2">
            <h3 className="font-serif text-xs uppercase tracking-widest text-gold-dim mb-4">La Rueda del Año Solar (Haab')</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {HAAB_NAMES.map((name, i) => {
                const isCurrent = i === currentMonthIndex;
                const isPast = i < currentMonthIndex;
                const isWayebMonth = name === 'Wayeb\'';
                const lore = getHaabLore(name);

                return (
                  <div
                    key={name}
                    className={`
                      p-2 rounded-md border text-center transition-all relative flex flex-col items-center justify-center min-h-[70px]
                      ${isCurrent 
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105 z-10' 
                        : isPast
                          ? 'border-gold-dim/10 bg-ink/40 opacity-60'
                          : isWayebMonth
                            ? 'border-red-500/30 bg-red-900/20'
                            : 'border-gold-dim/20 bg-ink/60 hover:border-emerald-500/30'
                      }
                    `}
                  >
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                    )}
                    <span className="text-lg leading-none mb-1">{lore?.icon}</span>
                    <span className={`text-[10px] sm:text-xs font-bold font-serif uppercase tracking-wider ${isCurrent ? 'text-emerald-300' : isWayebMonth ? 'text-red-400' : 'text-parchment'}`}>
                      {name}
                    </span>
                    <span className={`text-[8px] ${isCurrent ? 'text-emerald-500/80' : 'text-gold-dim/60'}`}>
                      {isWayebMonth ? '5 días' : '20 días'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Border Pattern */}
        <svg className="w-full h-8 block" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ background: 'transparent', borderTop: '2px solid rgba(16,185,129,0.3)' }}>
          <rect x="0" y="0" width="100%" height="20" fill="url(#maya-step)" transform="scale(1, -1) translate(0, -20)" />
        </svg>

      </div>
    </div>
  );
};

export default MayaCalendarInfo;

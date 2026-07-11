import React from 'react';
import { useCivilization } from '../contexts/CivilizationContext';

interface SolarTimesProps {
  sunrise: Date;
  sunset: Date;
  currentHourLength: number;
  timezone?: string;
}

const SolarTimes: React.FC<SolarTimesProps> = ({ sunrise, sunset, currentHourLength, timezone }) => {
  const { labels } = useCivilization();
  const format = (d: Date) => {
    const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    if (timezone) opts.timeZone = timezone;
    return d.toLocaleTimeString('en-GB', opts);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-2">
      <div className="flex flex-col md:flex-row justify-between items-center bg-ink/90 border border-gold-dim/40 p-5 rounded-lg shadow-xl gap-6 text-parchment relative overflow-hidden group transition-all hover:bg-ink/95">
        {/* Decorative background hatch */}
        <div className="absolute inset-0 woodcut-hatch opacity-10 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 z-10 flex-1 justify-center">
           <div className="text-gold-leaf text-3xl filter drop-shadow-glow">☀</div>
           <div className="text-center md:text-left flex flex-col">
              <div className="text-xs font-serif uppercase tracking-[0.2em] text-gold-dim mb-1">{labels.sunriseLabel}</div>
              <div className="font-body text-2xl md:text-3xl font-bold text-parchment leading-none">{format(sunrise)}</div>
           </div>
        </div>

        <div className="h-px w-24 md:w-px md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-gold-dim/40 to-transparent z-10"></div>
        
        {/* Hour Length Section */}
        <div className="flex flex-col items-center z-10 min-w-32">
           <div className="text-xs font-serif uppercase tracking-[0.2em] text-gold-dim mb-2">{labels.hourLengthLabel}</div>
           <div className="font-serif text-2xl text-gold-leaf font-bold drop-shadow-md">
             {Math.round(currentHourLength)} <span className="text-sm font-normal text-parchment/60 font-body">{labels.minuteUnit}</span>
           </div>
        </div>

        <div className="h-px w-24 md:w-px md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-gold-dim/40 to-transparent z-10"></div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-4 z-10 flex-1 justify-center">
           <div className="text-roman-red text-3xl filter drop-shadow-glow">☾</div>
           <div className="text-center md:text-right flex flex-col">
              <div className="text-xs font-serif uppercase tracking-[0.2em] text-gold-dim mb-1">{labels.sunsetLabel}</div>
              <div className="font-body text-2xl md:text-3xl font-bold text-parchment leading-none">{format(sunset)}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SolarTimes;
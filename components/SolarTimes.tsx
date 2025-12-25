import React from 'react';

interface SolarTimesProps {
  sunrise: Date;
  sunset: Date;
  currentHourLength: number;
}

const SolarTimes: React.FC<SolarTimesProps> = ({ sunrise, sunset, currentHourLength }) => {
  const format = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-2">
      <div className="flex flex-col md:flex-row justify-between items-center bg-ink/90 border border-gold-dim/50 p-4 rounded-lg shadow-lg gap-4 text-parchment relative overflow-hidden">
        {/* Decorative background hatch */}
        <div className="absolute inset-0 woodcut-hatch opacity-10 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 z-10">
           <div className="text-gold-leaf text-2xl">☀</div>
           <div className="text-center md:text-left">
              <div className="text-[0.6rem] font-serif uppercase tracking-widest text-gold-dim">Ortus Solis</div>
              <div className="font-body text-xl">{format(sunrise)}</div>
           </div>
        </div>

        <div className="h-px w-full md:w-px md:h-10 bg-gold-dim/30 z-10"></div>
        
        {/* Hour Length Section */}
        <div className="flex flex-col items-center z-10">
           <div className="text-[0.6rem] font-serif uppercase tracking-widest text-gold-dim mb-1">Longitudo Horae</div>
           <div className="font-serif text-lg text-gold-leaf font-bold">
             {Math.round(currentHourLength)} <span className="text-xs font-normal text-parchment/70">minuta</span>
           </div>
        </div>

        <div className="h-px w-full md:w-px md:h-10 bg-gold-dim/30 z-10"></div>

        <div className="flex items-center gap-3 z-10">
           <div className="text-center md:text-right">
              <div className="text-[0.6rem] font-serif uppercase tracking-widest text-gold-dim">Occasus Solis</div>
              <div className="font-body text-xl">{format(sunset)}</div>
           </div>
           <div className="text-roman-red text-2xl">☾</div>
        </div>
      </div>
    </div>
  );
};

export default SolarTimes;
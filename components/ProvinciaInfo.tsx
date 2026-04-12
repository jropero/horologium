import React, { useMemo } from 'react';
import { MapPin, Milestone } from 'lucide-react';
import { getRomanProvince, getDistanceToRome } from '../utils/romanProvinces';
import { toRoman } from '../utils/romanTimeUtils';

interface ProvinciaInfoProps {
  latitude: number;
  longitude: number;
}

const ProvinciaInfo: React.FC<ProvinciaInfoProps> = ({ latitude, longitude }) => {
  const province = useMemo(() => getRomanProvince(latitude, longitude), [latitude, longitude]);
  const distance = useMemo(() => getDistanceToRome(latitude, longitude), [latitude, longitude]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 px-2 animate-fadeIn">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-lg p-6 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-6 items-stretch relative overflow-hidden group">
        
        {/* Decorative background hatch */}
        <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>

        {/* Provincia */}
        <div className="flex-1 flex items-start gap-3 sm:border-r sm:border-gold-dim/20 sm:pr-4 z-10">
          <div className="p-2 bg-white/5 rounded-full mt-1">
            <MapPin className="w-5 h-5 text-gold-leaf" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs md:text-sm uppercase tracking-[0.3em] text-gold-dim/80 mb-1">Provincia Romana</span>
            {province ? (
              <>
                <span className="font-serif text-xl md:text-2xl text-parchment font-bold leading-tight drop-shadow-sm">{province.name}</span>
                <span className="font-body text-lg text-parchment/60 italic leading-snug mt-1">{province.desc}</span>
              </>
            ) : (
              <>
                <span className="font-serif text-xl text-parchment/50 italic">Extra Fines Imperii</span>
                <span className="font-body text-lg text-parchment/40 italic">Más allá de las fronteras del Imperio.</span>
              </>
            )}
          </div>
        </div>

        {/* Miliarium */}
        <div className="flex items-start gap-3 sm:pl-2 border-t sm:border-t-0 border-gold-dim/20 pt-4 sm:pt-0 z-10">
          <div className="p-2 bg-white/5 rounded-full mt-1">
            <Milestone className="w-5 h-5 text-gold-leaf" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs md:text-sm uppercase tracking-[0.3em] text-gold-dim/80 mb-1">Miliarium Aureum</span>
            <span className="font-serif text-xl md:text-2xl text-parchment font-bold leading-tight drop-shadow-sm">
              {toRoman(distance.romanMiles)} m.p.
            </span>
            <span className="font-body text-lg text-parchment/60 italic leading-snug mt-1">
              {distance.romanMiles.toLocaleString()} milia passuum ab Roma<br/>
              <span className="text-sm opacity-60">({distance.km.toLocaleString()} km)</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProvinciaInfo;

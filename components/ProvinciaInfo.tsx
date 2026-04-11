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
    <div className="w-full max-w-xl mx-auto mt-4 px-2">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-sm p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm flex flex-col sm:flex-row gap-4 items-stretch">

        {/* Provincia */}
        <div className="flex-1 flex items-start gap-2 sm:border-r sm:border-gold-dim/20 sm:pr-3">
          <MapPin className="w-4 h-4 text-gold-dim mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-serif text-[9px] uppercase tracking-[0.2em] text-gold-dim/70">Provincia Romana</span>
            {province ? (
              <>
                <span className="font-serif text-sm text-parchment font-bold leading-tight">{province.name}</span>
                <span className="font-body text-[11px] text-parchment/60 italic leading-tight mt-0.5">{province.desc}</span>
              </>
            ) : (
              <>
                <span className="font-serif text-sm text-parchment/50 italic">Extra Fines Imperii</span>
                <span className="font-body text-[11px] text-parchment/40 italic">Más allá de las fronteras del Imperio.</span>
              </>
            )}
          </div>
        </div>

        {/* Miliarium */}
        <div className="flex items-start gap-2 sm:pl-1 border-t sm:border-t-0 border-gold-dim/20 pt-2 sm:pt-0">
          <Milestone className="w-4 h-4 text-gold-dim mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-serif text-[9px] uppercase tracking-[0.2em] text-gold-dim/70">Miliarium Aureum</span>
            <span className="font-serif text-sm text-parchment font-bold leading-tight">
              {toRoman(distance.romanMiles)} m.p.
            </span>
            <span className="font-body text-[11px] text-parchment/60 italic leading-tight mt-0.5">
              {distance.romanMiles.toLocaleString()} milia passuum ab Roma ({distance.km.toLocaleString()} km)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProvinciaInfo;

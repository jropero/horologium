import React, { useMemo } from 'react';
import { MapPin, Milestone } from 'lucide-react';
import { getRomanProvince, getDistanceToRome } from '../utils/romanProvinces';
import { getGreekRegion, getDistanceToAthens } from '../utils/greekRegions';
import { getEgyptianRegion, getDistanceToHeliopolis } from '../utils/egyptianRegions';
import { toRoman } from '../utils/romanTimeUtils';
import { useCivilization } from '../contexts/CivilizationContext';

interface ProvinciaInfoProps {
  latitude: number;
  longitude: number;
}

const ProvinciaInfo: React.FC<ProvinciaInfoProps> = ({ latitude, longitude }) => {
  const { civilization, labels } = useCivilization();

  const province = useMemo(() => 
    civilization === 'rome' 
      ? getRomanProvince(latitude, longitude) 
      : null, 
    [latitude, longitude, civilization]
  );

  const greekRegion = useMemo(() => 
    civilization === 'hellas' 
      ? getGreekRegion(latitude, longitude) 
      : null, 
    [latitude, longitude, civilization]
  );

  const egyptianRegion = useMemo(() => 
    civilization === 'aegyptus' 
      ? getEgyptianRegion(latitude, longitude) 
      : null, 
    [latitude, longitude, civilization]
  );

  const distance = useMemo(() => 
    civilization === 'rome'
      ? getDistanceToRome(latitude, longitude)
      : null,
    [latitude, longitude, civilization]
  );

  const greekDistance = useMemo(() => 
    civilization === 'hellas'
      ? getDistanceToAthens(latitude, longitude)
      : null,
    [latitude, longitude, civilization]
  );

  const egyptianDistance = useMemo(() => 
    civilization === 'aegyptus'
      ? getDistanceToHeliopolis(latitude, longitude)
      : null,
    [latitude, longitude, civilization]
  );

  const regionName = civilization === 'rome' 
    ? province?.name 
    : civilization === 'hellas' 
      ? greekRegion?.name 
      : egyptianRegion?.name;

  const regionDesc = civilization === 'rome' 
    ? province?.desc 
    : civilization === 'hellas' 
      ? greekRegion?.desc 
      : egyptianRegion?.desc;

  const distanceDisplay = civilization === 'rome' && distance
    ? { value: toRoman(distance.romanMiles), detail: `${distance.romanMiles.toLocaleString()} ${labels.distanceFromLabel}`, km: distance.km }
    : civilization === 'hellas' && greekDistance
      ? { value: `${greekDistance.stadia.toLocaleString()}`, detail: labels.distanceFromLabel, km: greekDistance.km }
      : civilization === 'aegyptus' && egyptianDistance
        ? { value: `${egyptianDistance.iteru.toLocaleString()}`, detail: labels.distanceFromLabel, km: egyptianDistance.km }
        : null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 px-2 animate-fadeIn">
      <div className={`bg-ink/90 border rounded-lg p-6 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-6 items-stretch relative overflow-hidden group ${civilization === 'aegyptus' ? 'border-emerald-500/30' : 'border-gold-dim/40'}`}>
        
        {/* Decorative background hatch */}
        <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>

        {/* Provincia / Region */}
        <div className="flex-1 flex items-start gap-3 sm:border-r sm:border-gold-dim/20 sm:pr-4 z-10">
          <div className="p-2 bg-white/5 rounded-full mt-1">
            <MapPin className="w-5 h-5 text-gold-leaf" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs md:text-sm uppercase tracking-[0.3em] text-gold-dim/80 mb-1">{labels.regionTitle}</span>
            {regionName ? (
              <>
                <span className="font-serif text-xl md:text-2xl text-parchment font-bold leading-tight drop-shadow-sm">{regionName}</span>
                <span className="font-body text-lg text-parchment/60 italic leading-snug mt-1">{regionDesc}</span>
              </>
            ) : (
              <>
                <span className="font-serif text-xl text-parchment/50 italic">{labels.regionFallback}</span>
                <span className="font-body text-lg text-parchment/40 italic">{labels.regionFallbackDesc}</span>
              </>
            )}
          </div>
        </div>

        {/* Miliarium / Stadia */}
        <div className="flex items-start gap-3 sm:pl-2 border-t sm:border-t-0 border-gold-dim/20 pt-4 sm:pt-0 z-10">
          <div className="p-2 bg-white/5 rounded-full mt-1">
            <Milestone className="w-5 h-5 text-gold-leaf" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs md:text-sm uppercase tracking-[0.3em] text-gold-dim/80 mb-1">{labels.distanceTitle}</span>
            {distanceDisplay && (
              <>
                <span className="font-serif text-xl md:text-2xl text-parchment font-bold leading-tight drop-shadow-sm">
                  {distanceDisplay.value} {labels.distanceUnit}
                </span>
                <span className="font-body text-lg text-parchment/60 italic leading-snug mt-1">
                  {distanceDisplay.detail}<br/>
                  <span className="text-sm opacity-60">({distanceDisplay.km.toLocaleString()} km)</span>
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProvinciaInfo;

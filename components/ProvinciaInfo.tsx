import React, { lazy, Suspense, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Milestone, X } from 'lucide-react';
import { getRomanProvince, getDistanceToRome, getProvinceShapesVersion, subscribeProvinceShapes } from '../utils/romanProvinces';
import { getGreekRegion, getDistanceToAthens } from '../utils/greekRegions';
import { getEgyptianRegion, getDistanceToHeliopolis } from '../utils/egyptianRegions';
import { toRoman } from '../utils/romanTimeUtils';
import { useCivilization } from '../contexts/CivilizationContext';

const RomanMapCanvas = lazy(() => import('./RomanMapCanvas'));

interface ProvinciaInfoProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const ProvinciaInfo: React.FC<ProvinciaInfoProps> = ({ latitude, longitude, onLocationChange }) => {
  const { civilization, labels } = useCivilization();
  const [mapOpen, setMapOpen] = useState(false);
  const canOpenMap = civilization === 'rome';

  // Bumps once the real province boundaries have been fetched (first map open),
  // so the bar switches from the bounding-box fallback to point-in-polygon.
  const provinceShapesVersion = useSyncExternalStore(subscribeProvinceShapes, getProvinceShapesVersion);

  const province = useMemo(() => 
    civilization === 'rome' 
      ? getRomanProvince(latitude, longitude) 
      : null, 
    [latitude, longitude, civilization, provinceShapesVersion]
  );

  useEffect(() => {
    if (!mapOpen) return;
    // The map's own Escape handler (capture phase) closes an open city card first
    // and marks the event handled.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) setMapOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mapOpen]);

  useEffect(() => { if (!canOpenMap) setMapOpen(false); }, [canOpenMap]);

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
      <div
        className={`border p-6 shadow-2xl flex flex-col sm:flex-row gap-6 items-stretch relative overflow-hidden group ${
          civilization === 'aegyptus' ? '' : 'bg-ink/90 border-gold-dim/40 rounded-lg backdrop-blur-md'
        } ${canOpenMap ? 'cursor-pointer hover:border-gold-leaf/60 transition-colors focus-visible:outline-2 focus-visible:outline-gold-leaf' : ''}`}
        style={civilization === 'aegyptus' ? { background: '#0c0804', borderColor: 'rgba(24,64,160,0.45)', borderRadius: '2px' } : undefined}
        {...(canOpenMap && {
          role: 'button',
          tabIndex: 0,
          'aria-haspopup': 'dialog' as const,
          'aria-label': 'Abrir el mapa del Imperio',
          onClick: () => setMapOpen(true),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMapOpen(true); }
          },
        })}
      >
        {civilization !== 'aegyptus' && <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>}

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

      {mapOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-ink/85 overflow-y-auto overscroll-contain animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Mapa del Imperio Romano"
          onClick={e => { if (e.target === e.currentTarget) setMapOpen(false); }}
        >
          <div className="w-full max-w-6xl flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif text-sm md:text-base uppercase tracking-[0.3em] text-gold-leaf">Imperium Romanum</span>
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-parchment/70 hover:text-gold-leaf hover:bg-white/5"
                aria-label="Cerrar el mapa"
                autoFocus
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Suspense fallback={<div className="font-body italic text-lg text-parchment/70 text-center py-24">Desplegando el mapa del Imperio…</div>}>
              <RomanMapCanvas
                latitude={latitude}
                longitude={longitude}
                onLocationChange={onLocationChange}
                onClose={() => setMapOpen(false)}
              />
            </Suspense>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default ProvinciaInfo;

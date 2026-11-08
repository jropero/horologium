import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import './ProvinciaInfo.css';
import { createPortal } from 'react-dom';
import { MapPin, Milestone, X } from 'lucide-react';
import {
  getRomanProvince,
  getDistanceToRome,
  getProvinceShapesVersion,
  subscribeProvinceShapes,
} from '../utils/romanProvinces';
import { getGreekRegion, getDistanceToAthens } from '../utils/greekRegions';
import { getEgyptianRegion, getDistanceToHeliopolis } from '../utils/egyptianRegions';
import { toRoman } from '../utils/romanTimeUtils';
import { historicalYear } from '../utils/romanRoads';
import { useCivilization } from '../contexts/CivilizationContext';

const RomanMapCanvas = lazy(() => import('./RomanMapCanvas'));

interface ProvinciaInfoProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  /** The time-travel date; the map shows only the roads that existed then. Undefined when live. */
  travelDate?: Date;
}

const ProvinciaInfo: React.FC<ProvinciaInfoProps> = ({
  latitude,
  longitude,
  onLocationChange,
  travelDate,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { civilization, labels } = useCivilization();
  const [mapOpen, setMapOpen] = useState(false);
  const canOpenMap = civilization === 'rome';

  // Bumps once the real province boundaries have been fetched (first map open),
  // so the bar switches from the bounding-box fallback to point-in-polygon.
  const provinceShapesVersion = useSyncExternalStore(
    subscribeProvinceShapes,
    getProvinceShapesVersion,
  );

  const province = useMemo(
    () => (civilization === 'rome' ? getRomanProvince(latitude, longitude) : null),
    // provinceShapesVersion is a version counter from useSyncExternalStore; it forces re-run
    // when real province boundaries finish loading, though it isn't used directly in the callback
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latitude, longitude, civilization, provinceShapesVersion],
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!canOpenMap) setMapOpen(false);
  }, [canOpenMap]);

  const greekRegion = useMemo(
    () => (civilization === 'hellas' ? getGreekRegion(latitude, longitude) : null),
    [latitude, longitude, civilization],
  );

  const egyptianRegion = useMemo(
    () => (civilization === 'aegyptus' ? getEgyptianRegion(latitude, longitude) : null),
    [latitude, longitude, civilization],
  );

  const distance = useMemo(
    () => (civilization === 'rome' ? getDistanceToRome(latitude, longitude) : null),
    [latitude, longitude, civilization],
  );

  const greekDistance = useMemo(
    () => (civilization === 'hellas' ? getDistanceToAthens(latitude, longitude) : null),
    [latitude, longitude, civilization],
  );

  const egyptianDistance = useMemo(
    () => (civilization === 'aegyptus' ? getDistanceToHeliopolis(latitude, longitude) : null),
    [latitude, longitude, civilization],
  );

  let regionName: string | undefined;
  if (civilization === 'rome') regionName = province?.name;
  else if (civilization === 'hellas') regionName = greekRegion?.name;
  else regionName = egyptianRegion?.name;

  let regionDesc: string | undefined;
  if (civilization === 'rome') regionDesc = province?.desc;
  else if (civilization === 'hellas') regionDesc = greekRegion?.desc;
  else regionDesc = egyptianRegion?.desc;

  let distanceDisplay: { value: string; detail: string; km: number } | null = null;
  if (civilization === 'rome' && distance) {
    distanceDisplay = {
      value: toRoman(distance.romanMiles),
      detail: `${distance.romanMiles.toLocaleString()} ${labels.distanceFromLabel}`,
      km: distance.km,
    };
  } else if (civilization === 'hellas' && greekDistance) {
    distanceDisplay = {
      value: `${greekDistance.stadia.toLocaleString()}`,
      detail: labels.distanceFromLabel,
      km: greekDistance.km,
    };
  } else if (civilization === 'aegyptus' && egyptianDistance) {
    distanceDisplay = {
      value: `${egyptianDistance.iteru.toLocaleString()}`,
      detail: labels.distanceFromLabel,
      km: egyptianDistance.km,
    };
  }

  return (
    <div className="provincia-info animate-fadeIn">
      <div
        className={`pi-card${civilization !== 'aegyptus' ? ' pi-card--default' : ''}${
          canOpenMap ? ' pi-card--clickable' : ''
        }`}
        style={
          civilization === 'aegyptus'
            ? {
                background: '#0c0804',
                borderColor: 'rgba(24,64,160,0.45)',
                borderRadius: '2px',
              }
            : undefined
        }
        {...(canOpenMap && {
          role: 'button',
          tabIndex: 0,
          'aria-haspopup': 'dialog' as const,
          'aria-label': 'Abrir el mapa del Imperio',
          onClick: () => setMapOpen(true),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMapOpen(true);
            }
          },
        })}
      >
        {civilization !== 'aegyptus' && <div className="pi-hatch woodcut-hatch"></div>}

        {/* Provincia / Region */}
        <div className="pi-province">
          <div className="pi-icon-wrap">
            <MapPin className="pi-icon" />
          </div>
          <div className="pi-text-stack">
            <span className="pi-section-label">{labels.regionTitle}</span>
            {regionName ? (
              <>
                <span className="pi-region-name">{regionName}</span>
                <span className="pi-region-desc">{regionDesc}</span>
              </>
            ) : (
              <>
                <span className="pi-region-fallback">{labels.regionFallback}</span>
                <span className="pi-region-fallback-desc">{labels.regionFallbackDesc}</span>
              </>
            )}
          </div>
        </div>

        {/* Miliarium / Stadia */}
        <div className="pi-distance">
          <div className="pi-icon-wrap">
            <Milestone className="pi-icon" />
          </div>
          <div className="pi-text-stack">
            <span className="pi-section-label">{labels.distanceTitle}</span>
            {distanceDisplay && (
              <>
                <span className="pi-distance-value">
                  {distanceDisplay.value} {labels.distanceUnit}
                </span>
                <span className="pi-distance-detail">
                  {distanceDisplay.detail}
                  <br />
                  <span className="pi-distance-km">
                    ({distanceDisplay.km.toLocaleString()} km)
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {mapOpen &&
        createPortal(
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
          <div
            className="pi-modal-overlay animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-label="Mapa del Imperio Romano"
            onClick={e => {
              if (e.target === e.currentTarget) setMapOpen(false);
            }}
          >
            <div className="pi-modal-inner">
              <div className="pi-modal-header">
                <span className="pi-modal-title">Imperium Romanum</span>
                <button
                  type="button"
                  onClick={() => setMapOpen(false)}
                  className="pi-modal-close"
                  aria-label="Cerrar el mapa"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                >
                  <X className="pi-modal-close-icon" />
                </button>
              </div>
              <Suspense
                fallback={
                  <div className="pi-modal-fallback">Desplegando el mapa del Imperio…</div>
                }
              >
                <RomanMapCanvas
                  latitude={latitude}
                  longitude={longitude}
                  onLocationChange={onLocationChange}
                  onClose={() => setMapOpen(false)}
                  year={travelDate ? historicalYear(travelDate) : undefined}
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

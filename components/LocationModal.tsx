import React, { useState } from 'react';
import { X, Map } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { LOCATIONS } from '../utils/locations';
import { useCivilization } from '../contexts/CivilizationContext';
import GlossedTerm from './GlossedTerm';
import { BABYLONIAN_UI_TERMS as BAB } from '../utils/civLabels';
import './LocationModal.css';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onUpdateLocation,
  currentLat,
  currentLng,
}) => {
  const [loading, setLoading] = useState(false);
  const { civilization } = useCivilization();

  if (!isOpen) return null;

  const handleLocationSelect = async (loc: (typeof LOCATIONS)[0]) => {
    if (loc.id === 'gps') {
      setLoading(true);
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 3600000,
        });
        onUpdateLocation(position.coords.latitude, position.coords.longitude);
        onClose();
      } catch (error: any) {
        alert('Locus deprehendi non potuit: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else if (loc.lat !== null && loc.lng !== null) {
      onUpdateLocation(loc.lat, loc.lng);
      onClose();
    }
  };

  const isActive = (loc: (typeof LOCATIONS)[0]) => {
    if (loc.id === 'gps') return false;
    return (
      Math.abs(currentLat - (loc.lat || 0)) < 0.001 &&
      Math.abs(currentLng - (loc.lng || 0)) < 0.001
    );
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="location-modal animate-fadeIn" onClick={onClose}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="location-modal__panel" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="location-modal__close" aria-label="Cerrar">
          <X />
        </button>

        <div className="location-modal__header">
          <div className="location-modal__header-icon">
            <Map />
          </div>
          <h3 className="location-modal__title">
            {civilization === 'babylonia' ? <GlossedTerm term={BAB.place} /> : 'Selectio Loci'}
          </h3>
          <div className="location-modal__divider" />
        </div>

        <div className="location-modal__body custom-scrollbar">
          <div className="location-modal__grid">
            {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
            {LOCATIONS.map(loc => {
              const active = isActive(loc);
              const Icon = loc.icon;
              const isGps = loc.id === 'gps';

              let containerClass = 'loc-btn loc-btn--regular';
              if (active) containerClass = 'loc-btn loc-btn--active';
              else if (isGps) containerClass = 'loc-btn loc-btn--gps';

              let iconWrapperClass = 'loc-btn__icon loc-btn__icon--regular';
              if (active) iconWrapperClass = 'loc-btn__icon loc-btn__icon--active';
              else if (isGps) iconWrapperClass = 'loc-btn__icon loc-btn__icon--gps';

              const iconClass = `loc-btn__svg${
                active || isGps ? ' loc-btn__svg--accent' : ' loc-btn__svg--gold'
              }`;

              return (
                <button
                  key={loc.id}
                  onClick={() => handleLocationSelect(loc)}
                  disabled={loading}
                  className={`${containerClass}${loading && isGps ? ' animate-pulse' : ''}`}
                >
                  <div className={iconWrapperClass}>
                    <Icon className={iconClass} />
                  </div>

                  <span className="loc-btn__label">{loc.name}</span>

                  {active && <div className="loc-btn__dot animate-pulse" />}
                </button>
              );
            })}
          </div>

          <div className="location-modal__footer">
            <p className="location-modal__motto">
              &quot;Ubi bene, ibi patria&quot; — Donde se está bien, allí está la patria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

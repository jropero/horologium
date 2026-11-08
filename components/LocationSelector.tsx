import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { LOCATIONS } from '../utils/locations';
import { useCivilization } from '../contexts/CivilizationContext';
import GlossedTerm from './GlossedTerm';
import { BABYLONIAN_UI_TERMS as BAB } from '../utils/civLabels';
import './LocationSelector.css';

interface LocationSelectorProps {
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}
const LocationSelector: React.FC<LocationSelectorProps> = ({
  onUpdateLocation,
  currentLat,
  currentLng,
}) => {
  const [loading, setLoading] = useState(false);
  const { civilization } = useCivilization();

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
      } catch (error: any) {
        alert('Locus deprehendi non potuit: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else if (loc.lat !== null && loc.lng !== null) {
      onUpdateLocation(loc.lat, loc.lng);
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
    <div className="location-selector animate-fadeIn">
      <div className="location-selector-panel">
        {/* Header decoration */}
        <div className="location-selector-header">
          <div className="location-selector-map-icon">
            <Map />
          </div>
          <h3 className="location-selector-title">
            {civilization === 'babylonia' ? <GlossedTerm term={BAB.place} /> : 'Selectio Loci'}
          </h3>
          <div className="location-selector-divider"></div>
        </div>

        <div className="location-selector-grid">
          {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
          {LOCATIONS.map(loc => {
            const active = isActive(loc);
            const Icon = loc.icon;
            const isGps = loc.id === 'gps';

            const inactiveBtnMod = isGps
              ? 'location-selector-btn--gps'
              : 'location-selector-btn--inactive';
            const inactiveIconWrapMod = isGps
              ? 'location-selector-icon-wrap--gps'
              : 'location-selector-icon-wrap--inactive';
            const inactiveIconMod = isGps
              ? 'location-selector-icon--gps'
              : 'location-selector-icon--inactive';

            const btnClass = [
              'location-selector-btn',
              active ? 'location-selector-btn--active' : inactiveBtnMod,
              loading && isGps ? 'animate-pulse' : '',
            ]
              .filter(Boolean)
              .join(' ');

            const iconWrapClass = `location-selector-icon-wrap ${
              active ? 'location-selector-icon-wrap--active' : inactiveIconWrapMod
            }`;
            const iconClass = active ? 'location-selector-icon--active' : inactiveIconMod;

            return (
              <button
                key={loc.id}
                onClick={() => handleLocationSelect(loc)}
                disabled={loading}
                className={btnClass}
              >
                <div className={iconWrapClass}>
                  <Icon className={iconClass} />
                </div>

                <span className="location-selector-name">{loc.name}</span>

                {active && <div className="location-selector-active-dot animate-pulse"></div>}
              </button>
            );
          })}
        </div>

        <div className="location-selector-footer">
          <p className="location-selector-quote">
            &quot;Ubi bene, ibi patria&quot; — Donde se está bien, allí está la patria.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;

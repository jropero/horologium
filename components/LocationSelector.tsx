import React, { useState } from 'react';
import { MapPin, Navigation, Map } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';

interface LocationSelectorProps {
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

const LOCATIONS = [
  { id: 'gps', name: 'Actual (GPS)', icon: Navigation, lat: null, lng: null },
  { id: 'basilea', name: 'Basilea', icon: MapPin, lat: 47.5546368, lng: 7.5532081 },
  { id: 'parla', name: 'Parla', icon: MapPin, lat: 40.2348316, lng: -3.7876793 },
  { id: 'lagartera', name: 'Lagartera', icon: MapPin, lat: 39.9071497, lng: -5.2106728 },
  { id: 'corral', name: 'Corral de Almaguer', icon: MapPin, lat: 39.7608446, lng: -3.1667764 },
  { id: 'reikiavik', name: 'Reikiavik', icon: MapPin, lat: 64.1261865, lng: -21.9350214 },
];

const LocationSelector: React.FC<LocationSelectorProps> = ({ onUpdateLocation, currentLat, currentLng }) => {
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = async (loc: typeof LOCATIONS[0]) => {
    if (loc.id === 'gps') {
      setLoading(true);
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 3600000
        });
        onUpdateLocation(position.coords.latitude, position.coords.longitude);
      } catch (error: any) {
        alert("Locus deprehendi non potuit: " + error.message);
      } finally {
        setLoading(false);
      }
    } else if (loc.lat !== null && loc.lng !== null) {
      onUpdateLocation(loc.lat, loc.lng);
    }
  };

  const isActive = (loc: typeof LOCATIONS[0]) => {
    if (loc.id === 'gps') return false; // GPS is transient
    return Math.abs(currentLat - (loc.lat || 0)) < 0.001 && Math.abs(currentLng - (loc.lng || 0)) < 0.001;
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 px-2">
      <div className="text-center font-serif text-gold-dim text-[10px] uppercase tracking-[0.3em] mb-3 opacity-70">
        — Selectio Loci —
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LOCATIONS.map((loc) => {
          const active = isActive(loc);
          const Icon = loc.icon;

          return (
            <button
              key={loc.id}
              onClick={() => handleLocationSelect(loc)}
              disabled={loading}
              className={`
                relative flex items-center justify-center gap-2 p-2 rounded transition-all duration-300
                font-serif text-[11px] uppercase tracking-widest border
                ${active
                  ? 'bg-parchment text-ink border-gold-leaf shadow-[0_0_10px_rgba(207,181,59,0.3)]'
                  : 'bg-ink/70 text-parchment/60 border-gold-dim/30 hover:border-gold-leaf hover:text-parchment hover:bg-ink/80'}
                ${loading && loc.id === 'gps' ? 'animate-pulse' : ''}
              `}
            >
              <Icon className={`w-3 h-3 ${active ? 'text-roman-red' : 'text-gold-dim'}`} />
              <span className="truncate">{loc.name}</span>

              {active && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-roman-red rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSelector;

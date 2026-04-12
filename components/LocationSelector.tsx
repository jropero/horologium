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
  { id: 'santodomingo', name: 'Santo Domingo', icon: MapPin, lat: 18.4801874, lng: -70.0292817 },
  { id: 'auckland', name: 'Auckland', icon: MapPin, lat: -36.8318297, lng: 174.3969279 },
  { id: 'taipei', name: 'Taipéi', icon: MapPin, lat: 25.0174467, lng: 121.3415663 },
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
    if (loc.id === 'gps') return false; 
    return Math.abs(currentLat - (loc.lat || 0)) < 0.001 && Math.abs(currentLng - (loc.lng || 0)) < 0.001;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-12 px-2 animate-fadeIn">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-lg p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Header decoration */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-gold-leaf/40 mb-2">
            <Map className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg md:text-xl text-gold-leaf uppercase tracking-[0.3em] font-bold">
            Selectio Loci
          </h3>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => {
            const active = isActive(loc);
            const Icon = loc.icon;
            const isGps = loc.id === 'gps';

            return (
              <button
                key={loc.id}
                onClick={() => handleLocationSelect(loc)}
                disabled={loading}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-500
                  font-serif border group
                  ${active
                    ? 'bg-parchment text-ink border-gold-leaf shadow-[0_0_15px_rgba(207,181,59,0.4)] scale-[1.02]'
                    : isGps 
                      ? 'bg-roman-red/10 text-parchment border-roman-red/40 hover:bg-roman-red/20 hover:border-roman-red'
                      : 'bg-white/5 text-parchment/70 border-gold-dim/20 hover:border-gold-leaf hover:text-parchment hover:bg-white/10'}
                  ${loading && isGps ? 'animate-pulse' : ''}
                `}
              >
                <div className={`
                  p-2 rounded-full transition-colors duration-300
                  ${active ? 'bg-ink/10' : isGps ? 'bg-roman-red/20' : 'bg-white/5'}
                `}>
                  <Icon className={`w-5 h-5 ${active ? 'text-roman-red' : isGps ? 'text-roman-red' : 'text-gold-leaf'}`} />
                </div>
                
                <span className="text-sm md:text-base uppercase tracking-widest font-bold">
                  {loc.name}
                </span>

                {active && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-roman-red rounded-full animate-pulse shadow-[0_0_5px_#8b2500]"></div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
            <p className="font-body text-parchment/40 italic text-sm">
                "Ubi bene, ibi patria" — Donde se está bien, allí está la patria.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;

import React, { useState } from 'react';
import { X, Map } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { LOCATIONS } from '../utils/locations';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateLocation: (lat: number, lng: number) => void;
  currentLat: number;
  currentLng: number;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onUpdateLocation, currentLat, currentLng }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
        onClose();
      } catch (error: any) {
        alert("Locus deprehendi non potuit: " + error.message);
      } finally {
        setLoading(false);
      }
    } else if (loc.lat !== null && loc.lng !== null) {
      onUpdateLocation(loc.lat, loc.lng);
      onClose();
    }
  };

  const isActive = (loc: typeof LOCATIONS[0]) => {
    if (loc.id === 'gps') return false; 
    return Math.abs(currentLat - (loc.lat || 0)) < 0.001 && Math.abs(currentLng - (loc.lng || 0)) < 0.001;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-ink border-2 border-gold-dim/40 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-parchment/60 hover:text-gold-leaf transition-colors p-2 rounded-full hover:bg-white/5 z-10"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-ink p-6 border-b border-gold-dim/30 flex flex-col items-center gap-1 relative shrink-0">
          <div className="text-gold-leaf/40 mb-2">
            <Map className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg md:text-xl text-gold-leaf uppercase tracking-[0.3em] font-bold">
            Selectio Loci
          </h3>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent mt-2"></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
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
                    relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-300
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
                  
                  <span className="text-sm md:text-base uppercase tracking-widest font-bold text-center">
                    {loc.name}
                  </span>

                  {active && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-roman-red rounded-full animate-pulse shadow-[0_0_5px_#8b2500]"></div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <p className="font-body text-parchment/40 italic text-sm">
              "Ubi bene, ibi patria" — Donde se está bien, allí está la patria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Navigation } from 'lucide-react';

interface ControlsProps {
  latitude: number;
  longitude: number;
  onUpdateLocation: (lat: number, lng: number) => void;
  onRefreshTime: () => void;
}

const Controls: React.FC<ControlsProps> = ({ latitude, longitude, onUpdateLocation, onRefreshTime }) => {
  const [latInput, setLatInput] = useState(latitude.toString());
  const [lngInput, setLngInput] = useState(longitude.toString());

  // Sync state when props change (e.g. on mount from localStorage or geolocation update)
  useEffect(() => {
    setLatInput(latitude.toString());
    setLngInput(longitude.toString());
  }, [latitude, longitude]);

  const handleManualUpdate = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      onUpdateLocation(lat, lng);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatInput(position.coords.latitude.toFixed(4));
          setLngInput(position.coords.longitude.toFixed(4));
          onUpdateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert("Locus deprehendi non potuit: " + error.message);
        }
      );
    } else {
      alert("Geolocatio ab hoc navigatro non sustinetur.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 p-1">
      <div className="bg-parchment p-6 border-4 border-double border-ink/40 shadow-xl relative">
        {/* Decorative corners */}
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-ink"></div>
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-ink"></div>
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-ink"></div>
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-ink"></div>
        
        <h3 className="text-center font-serif text-ink font-bold uppercase tracking-widest mb-6 text-sm flex items-center justify-center gap-4">
            <span className="text-xl">❧</span> Locus Geographicus <span className="text-xl">☙</span>
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-body italic text-lg text-ink">Latitudo:</span>
            <input 
                type="text" 
                value={latInput} 
                onChange={(e) => setLatInput(e.target.value)}
                className="w-32 bg-transparent border-b-2 border-ink font-serif text-center focus:outline-none focus:border-roman-red text-ink"
            />
          </div>
          <div className="flex items-center gap-2">
             <span className="font-body italic text-lg text-ink">Longitudo:</span>
             <input 
                type="text" 
                value={lngInput} 
                onChange={(e) => setLngInput(e.target.value)}
                className="w-32 bg-transparent border-b-2 border-ink font-serif text-center focus:outline-none focus:border-roman-red text-ink"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button 
                onClick={handleManualUpdate}
                className="group relative px-6 py-2 font-serif font-bold text-sm uppercase tracking-widest text-ink transition-transform active:scale-95"
            >
                <div className="absolute inset-0 border border-ink transform skew-x-12 bg-gold-dim/20 group-hover:bg-gold-dim/40 transition-colors"></div>
                <span className="relative flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Computare
                </span>
            </button>

             <button 
                onClick={handleGeolocation}
                className="group relative px-6 py-2 font-serif font-bold text-sm uppercase tracking-widest text-parchment transition-transform active:scale-95"
            >
                <div className="absolute inset-0 bg-ink transform -skew-x-12 border border-gold-leaf group-hover:bg-black transition-colors shadow-lg"></div>
                <span className="relative flex items-center gap-2">
                    <Navigation className="w-4 h-4" /> Invenire Me
                </span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
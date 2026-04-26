import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Navigation, Bell, Sun, Moon, Landmark, Pyramid } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useCivilization } from '../contexts/CivilizationContext';

interface ControlsProps {
  latitude: number;
  longitude: number;
  onUpdateLocation: (lat: number, lng: number) => void;
  onRefreshTime: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  latitude, 
  longitude, 
  onUpdateLocation, 
  onRefreshTime,
  theme,
  onToggleTheme
}) => {
  const { civilization, setCivilization, labels } = useCivilization();
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

const handleGeolocation = async () => {
    try {
      // Pedimos la ubicación. Esto abrirá el pop-up de permisos nativo automáticamente.
      // Pedimos ubicación con caché y más tiempo de espera
      const position = await Geolocation.getCurrentPosition({ 
        enableHighAccuracy: false, 
        timeout: 30000,       // Le damos 30 segundos máximo para pensar
        maximumAge: 3600000   // Puede usar una ubicación de hace 1 hora (instantáneo)
      });
      
      setLatInput(position.coords.latitude.toFixed(4));
      setLngInput(position.coords.longitude.toFixed(4));
      onUpdateLocation(position.coords.latitude, position.coords.longitude);
    } catch (error: any) {
      alert("Locus deprehendi non potuit: " + error.message);
    }
  };

  const handleNotifications = async () => {
    try {
      // 1. Pedimos permiso al usuario (obligatorio en Android 13+)
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        perm = await LocalNotifications.requestPermissions();
      }
      
      if (perm.display === 'granted') {
        // 2. Programamos una notificación de prueba para dentro de 5 segundos
        await LocalNotifications.schedule({
          notifications:[
            {
              title: "🏛️ Tempus Fugit",
              body: "¡Las notificaciones han sido activadas con éxito!",
              id: 1,
              schedule: { at: new Date(Date.now() + 5000) }, // Suena en 5 segundos
              smallIcon: "ic_stat_icon_config_sample", // Icono por defecto de Android
            }
          ]
        });
        alert("¡Permiso concedido! Cierra la app o minimízala; recibirás un aviso en 5 segundos.");
      } else {
        alert("Se denegaron los permisos de notificación.");
      }
    } catch (e: any) {
      alert("Error al activar notificaciones: " + e.message);
    }
  };

  const handleCivToggle = () => {
    // Cycle: rome -> hellas -> aegyptus -> rome
    const next = civilization === 'rome' ? 'hellas' : civilization === 'hellas' ? 'aegyptus' : 'rome';
    setCivilization(next);
  };

  // Determine the next civilization label and styling for the toggle button
  const nextCivLabel = civilization === 'rome' ? labels.civToggleHellas : civilization === 'hellas' ? labels.civToggleAegyptus : labels.civToggleRome;
  const civButtonClass = civilization === 'rome'
    ? 'text-roman-red bg-roman-red/10 border-roman-red/50 hover:bg-roman-red/20'
    : civilization === 'hellas'
      ? 'text-sky-400 bg-sky-400/10 border-sky-400/50 hover:bg-sky-400/20'
      : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20';
  const CivIcon = civilization === 'aegyptus' ? Pyramid : Landmark;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-8 px-2 animate-fadeIn">
      <div className="bg-ink/90 border border-gold-dim/40 rounded-lg p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Decorative background hatch */}
        <div className="absolute inset-0 woodcut-hatch opacity-5 pointer-events-none"></div>

        {/* Header decoration */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="text-gold-leaf/40 mb-2">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg md:text-xl text-gold-leaf uppercase tracking-[0.4em] font-bold">
            {labels.controlsTitle}
          </h3>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent mt-2"></div>
        </div>

        <div className="flex flex-col gap-8 relative z-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-serif text-xs uppercase tracking-widest text-gold-dim ml-2 flex items-center gap-2">
                 <MapPin className="w-3 h-3" /> Latitudo
              </label>
              <input 
                  type="text" 
                  value={latInput} 
                  onChange={(e) => setLatInput(e.target.value)}
                  className="w-full bg-white/5 border border-gold-dim/30 rounded-lg py-3 px-4 font-serif text-lg text-parchment focus:outline-none focus:border-gold-leaf focus:bg-white/10 transition-all text-center"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-serif text-xs uppercase tracking-widest text-gold-dim ml-2 flex items-center gap-2">
                 <MapPin className="w-3 h-3" /> Longitudo
              </label>
              <input 
                  type="text" 
                  value={lngInput} 
                  onChange={(e) => setLngInput(e.target.value)}
                  className="w-full bg-white/5 border border-gold-dim/30 rounded-lg py-3 px-4 font-serif text-lg text-parchment focus:outline-none focus:border-gold-leaf focus:bg-white/10 transition-all text-center"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
             <button 
                onClick={handleManualUpdate}
                className="group relative flex items-center justify-center gap-3 px-6 py-4 font-serif font-bold text-sm md:text-base uppercase tracking-widest text-ink bg-parchment rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg border border-gold-leaf"
            >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" /> 
                {labels.computeBtn}
            </button>

             <button 
                onClick={handleGeolocation}
                className="group relative flex items-center justify-center gap-3 px-6 py-4 font-serif font-bold text-sm md:text-base uppercase tracking-widest text-parchment bg-roman-red/80 rounded-lg border border-roman-red hover:bg-roman-red transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
            >
                <Navigation className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                {labels.findMeBtn}
            </button>

          <button 
                onClick={onToggleTheme}
                className="group relative flex items-center justify-center gap-3 px-6 py-4 font-serif font-bold text-sm md:text-base uppercase tracking-widest bg-gold-leaf/10 text-gold-leaf rounded-lg border border-gold-leaf/50 hover:bg-gold-leaf/20 transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
            >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 animate-spin-slow" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                {theme === 'dark' ? labels.lightLabel : labels.darkLabel}
            </button>

          {/* Civilization Toggle */}
          <button 
                onClick={handleCivToggle}
                className={`group relative flex items-center justify-center gap-3 px-6 py-4 font-serif font-bold text-sm md:text-base uppercase tracking-widest rounded-lg border transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${civButtonClass}`}
            >
                <CivIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {nextCivLabel}
            </button>

            <button 
                onClick={handleNotifications}
                className="group relative flex items-center justify-center gap-3 px-6 py-4 font-serif font-bold text-sm md:text-base uppercase tracking-widest text-parchment bg-white/10 rounded-lg border border-gold-dim/50 hover:bg-white/20 transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
            >
                <Bell className="w-5 h-5 text-amber-500 animate-pulse" /> 
                {labels.notificationsBtn}
            </button>
        </div>

        <div className="mt-8 text-center opacity-40">
            <p className="font-body italic text-sm text-parchment">
                {labels.controlsFooter}
            </p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
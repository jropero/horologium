import React, { useState, useEffect, useMemo } from 'react';
import RomanClock from './components/RomanClock';
import EgyptianClock from './components/EgyptianClock';
import ChineseClock from './components/ChineseClock'; // Added
import BabylonianClock from './components/BabylonianClock';
import PlanetaryPositions from './components/PlanetaryPositions';
import BabylonianCalendarInfo from './components/BabylonianCalendarInfo';
import BottomNav from './components/BottomNav';
import Controls from './components/Controls';
import InfoSection from './components/InfoSection';
import SolarTimes from './components/SolarTimes';
import { RomanTimeData, WeatherCondition, WeatherData } from './types';
import { calculateRomanTime } from './utils/romanTimeUtils';
import { calculateHellenicTime } from './utils/hellenicTimeUtils';
import { calculateEgyptianTime } from './utils/egyptianTimeUtils';
import { calculateBabylonianTime } from './utils/babylonianCalendarUtils';
import { getSunTimes } from './utils/solar';
import { useWeather } from './hooks/useWeather';
import RomanCalendarInfo from './components/RomanCalendarInfo';
import HellenicCalendarInfo from './components/HellenicCalendarInfo';
import EgyptianCalendarInfo from './components/EgyptianCalendarInfo';
import GreekCalendarModal from './components/GreekCalendarModal';
import SententiaDiei from './components/SententiaDiei';
import LocationSelector from './components/LocationSelector';
import ProvinciaInfo from './components/ProvinciaInfo';
import EclipseForecast from './components/EclipseForecast';
import SortesVergilianae from './components/SortesVergilianae';
import OvidianLore from './components/OvidianLore';
import LocationModal from './components/LocationModal';
import { LOCATIONS, getTimezoneForLocation } from './utils/locations';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { CivilizationProvider, useCivilization } from './contexts/CivilizationContext';

// Default to Basilea
const DEFAULT_LAT = 47.5632;
const DEFAULT_LNG = 7.5744;

const AppContent: React.FC = () => {
  const { civilization, labels } = useCivilization();
  const [modernTime, setModernTime] = useState<Date>(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return new Date();
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-civ', civilization);
  }, [civilization]);

  // Initialize location from localStorage if available, otherwise default
  const [latitude, setLatitude] = useState<number>(() => {
    const saved = localStorage.getItem('romanClockLat');
    return saved ? parseFloat(saved) : DEFAULT_LAT;
  });

  const [longitude, setLongitude] = useState<number>(() => {
    const saved = localStorage.getItem('romanClockLng');
    return saved ? parseFloat(saved) : DEFAULT_LNG;
  });

  const [romanTimeData, setRomanTimeData] = useState<RomanTimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGreekCalendarOpen, setIsGreekCalendarOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isWeatherSelectorOpen, setIsWeatherSelectorOpen] = useState<boolean>(false);
  const [isTimeTraveling, setIsTimeTraveling] = useState<boolean>(() =>
    new URLSearchParams(window.location.search).has('date')
  );
  const [travelModalOpen, setTravelModalOpen] = useState<boolean>(false);
  const [travelInput, setTravelInput] = useState<string>('');

  // Determine current location name and timezone
  const currentLocation = LOCATIONS.find(loc => loc.id !== 'gps' && Math.abs(latitude - (loc.lat || 0)) < 0.001 && Math.abs(longitude - (loc.lng || 0)) < 0.001);
  const currentLocationName = currentLocation ? currentLocation.name : 'GPS / Custom';
  const locationTimezone = getTimezoneForLocation(latitude, longitude);

  // Calculate today's sun times for display
  const [todaysSunTimes, setTodaysSunTimes] = useState<{ sunrise: Date, sunset: Date } | null>(null);

  // --- Configuración inicial de Android (Status Bar) ---
  useEffect(() => {
    const setupNativeApp = async () => {
      try {
        // Ocultar la barra de estado superior de Android
        await StatusBar.hide();
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (e) {
        console.warn("StatusBar no disponible en web", e);
      }
    };
    setupNativeApp();
  }, []);

  // Update modern time every 15 seconds. Paused when time-traveling.
  useEffect(() => {
    if (isTimeTraveling) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has('date')) return;

    const timer = setInterval(() => {
      setModernTime(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, [isTimeTraveling]);

  // Recalculate time when location, minute, or civilization changes
  useEffect(() => {
    const updateTime = () => {
      const data = civilization === 'rome'
        ? calculateRomanTime(modernTime, latitude, longitude)
        : civilization === 'hellas'
          ? calculateHellenicTime(modernTime, latitude, longitude)
          : civilization === 'aegyptus'
            ? calculateEgyptianTime(modernTime, latitude, longitude)
            : civilization === 'babylonia'
              ? calculateBabylonianTime(modernTime, latitude, longitude)
              : calculateRomanTime(modernTime, latitude, longitude);
      setRomanTimeData(data);

      const sunTimes = getSunTimes(modernTime, latitude, longitude);
      setTodaysSunTimes(sunTimes);

      if (loading) {
        setLoading(false);
        // Ocultar Splash solo en la primera carga
        SplashScreen.hide();
      }
    };

    updateTime();
  }, [modernTime, latitude, longitude, loading, civilization]);

  // Weather Data
  const { weather } = useWeather(latitude, longitude);
  const [devWeatherCode, setDevWeatherCode] = useState<number | null>(null);

  const DEV_OPTIONS = [
    { code: null, label: 'Tiempo real' },
    { code: 0, label: 'Despejado' },
    { code: 3, label: 'Nublado' },
    { code: 45, label: 'Niebla' },
    { code: 61, label: 'Lluvia leve' },
    { code: 65, label: 'Lluvia intensa' },
    { code: 82, label: 'Lluvia violenta' },
    { code: 95, label: 'Tormenta' },
    { code: 73, label: 'Nieve' },
  ] as const;

  const DEV_CONDITION_MAP: Record<number, WeatherCondition> = {
    0: 'clear', 3: 'cloudy', 45: 'fog', 61: 'rain', 65: 'rain', 82: 'rain', 95: 'storm', 99: 'storm', 73: 'snow',
  };
  const effectiveWeather: WeatherData | null = useMemo(() => {
    if (devWeatherCode === null || !weather) return weather;
    return {
      ...weather,
      current: { ...weather.current, code: devWeatherCode, condition: DEV_CONDITION_MAP[devWeatherCode] ?? 'clear' },
    };
  }, [weather, devWeatherCode]);

  const handleUpdateLocation = (lat: number, lng: number) => {
    setLoading(true);
    setLatitude(lat);
    setLongitude(lng);
    localStorage.setItem('romanClockLat', lat.toString());
    localStorage.setItem('romanClockLng', lng.toString());
  };

  const toDatetimeLocal = (d: Date): string => {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  const openTravelModal = () => {
    setTravelInput(toDatetimeLocal(modernTime));
    setTravelModalOpen(true);
  };

  const applyTravelDate = () => {
    const d = new Date(travelInput);
    if (isNaN(d.getTime())) return;
    setModernTime(d);
    setIsTimeTraveling(true);
    setTravelModalOpen(false);
  };

  const returnToLive = () => {
    setIsTimeTraveling(false);
    setModernTime(new Date());
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-4 px-4 pb-24 md:pb-8 selection:bg-gold-leaf selection:text-ink">
      
      {/* Mobile Location + Dev Weather Selector */}
      <div className="fixed top-2 right-2 z-50 md:hidden flex flex-col items-end gap-1.5">
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="text-[10px] font-serif tracking-widest uppercase text-gold-dim/80 bg-ink/80 px-2.5 py-1 rounded-full border border-gold-dim/20 backdrop-blur-md shadow-lg active:scale-95 transition-all max-w-[100px] truncate"
        >
          {currentLocationName}
        </button>
        <button
          onClick={() => setIsWeatherSelectorOpen(true)}
          className="text-[9px] font-serif uppercase tracking-wider text-gold-dim/70 bg-ink/80 px-2 py-0.5 rounded-full border border-gold-dim/20 backdrop-blur-md shadow-lg active:scale-95 transition-all"
        >
          {devWeatherCode === null ? '☁ Tiempo real' : DEV_OPTIONS.find(o => o.code === devWeatherCode)?.label ?? '☁ Tiempo real'}
        </button>
        <button
          onClick={openTravelModal}
          className={`text-[9px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md shadow-lg active:scale-95 transition-all ${
            isTimeTraveling
              ? 'text-amber-400 bg-amber-950/80 border-amber-700/50'
              : 'text-gold-dim/70 bg-ink/80 border-gold-dim/20'
          }`}
        >
          {isTimeTraveling ? '⏳ Viajando' : '🕰 Fecha'}
        </button>
      </div>

      <header className="text-center relative z-10 w-full max-w-xl mx-auto border-b border-gold-dim/30 pb-2 pt-2 md:pt-0">
        <h1 className="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-widest drop-shadow-md">
          {labels.appTitle} <span className="text-gold-dim font-normal text-xl md:text-2xl">{labels.appSubtitle}</span>
        </h1>
      </header>

      {isTimeTraveling && (
        <div className="w-full max-w-xl mx-auto mt-2 flex items-center justify-between gap-2 bg-amber-950/50 border border-amber-700/40 rounded-lg px-3 py-1.5 text-xs z-10">
          <span className="font-serif text-amber-400/90 truncate">
            ⏳ {modernTime.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={openTravelModal} className="text-amber-400/70 hover:text-amber-300 font-serif underline underline-offset-2 transition-colors">
              Cambiar
            </button>
            <span className="text-amber-700/50">·</span>
            <button onClick={returnToLive} className="text-amber-400 hover:text-amber-200 font-serif font-bold transition-colors">
              Volver al presente
            </button>
          </div>
        </div>
      )}

      {civilization !== 'zhongguo' && civilization === 'hellas' && (
        <HellenicCalendarInfo
          atticDate={romanTimeData?.atticDate}
          onClick={() => setIsGreekCalendarOpen(true)}
          weather={effectiveWeather}
          currentLat={latitude}
          currentLng={longitude}
          currentDate={modernTime}
        />
      )}
      {civilization !== 'zhongguo' && civilization === 'aegyptus' && (
        <EgyptianCalendarInfo currentDate={modernTime} lat={latitude} lng={longitude} weather={effectiveWeather} />
      )}

      {civilization !== 'zhongguo' && civilization === 'babylonia' && (
        <BabylonianCalendarInfo
          currentDate={modernTime}
          weather={effectiveWeather}
          currentLat={latitude}
          currentLng={longitude}
        />
      )}

      {romanTimeData && (
        <div className="w-full max-w-2xl mx-auto">
          {civilization === 'aegyptus' ? (
            <EgyptianClock
              modernTime={modernTime}
              romanTime={romanTimeData}
              loading={loading}
              weather={effectiveWeather}
              onUpdateLocation={handleUpdateLocation}
              currentLat={latitude}
              currentLng={longitude}
            />
          ) : civilization === 'zhongguo' ? (
            <ChineseClock modernTime={modernTime} weather={effectiveWeather} />
          ) : civilization === 'babylonia' ? (
            <BabylonianClock
              modernTime={modernTime}
              loading={loading}
              weather={effectiveWeather}
              onUpdateLocation={handleUpdateLocation}
              currentLat={latitude}
              currentLng={longitude}
            />
          ) : (
            <RomanClock
              modernTime={modernTime}
              romanTime={romanTimeData}
              loading={loading}
              weather={effectiveWeather}
              onUpdateLocation={handleUpdateLocation}
              currentLat={latitude}
              currentLng={longitude}
            />
          )}
        </div>
      )}

      {civilization !== 'zhongguo' && civilization === 'rome' ? (
        <RomanCalendarInfo currentDate={modernTime} />
      ) : null}

      {civilization !== 'zhongguo' && civilization !== 'babylonia' && todaysSunTimes && romanTimeData && (
        <SolarTimes
          sunrise={todaysSunTimes.sunrise}
          sunset={todaysSunTimes.sunset}
          currentHourLength={romanTimeData.hourLengthMinutes}
          timezone={locationTimezone}
        />
      )}

      <PlanetaryPositions currentDate={modernTime} />

      {civilization !== 'zhongguo' && civilization !== 'babylonia' && <ProvinciaInfo latitude={latitude} longitude={longitude} />}

      {civilization !== 'zhongguo' && <SententiaDiei currentDate={modernTime} />}

      {civilization !== 'zhongguo' && civilization !== 'babylonia' && <SortesVergilianae />}
      
      {civilization !== 'zhongguo' && civilization !== 'babylonia' && <OvidianLore modernTime={modernTime} />}

      {civilization === 'rome' && (
        <EclipseForecast currentDate={modernTime} latitude={latitude} longitude={longitude} />
      )}

      {civilization !== 'zhongguo' && (
        <Controls
          latitude={latitude}
          longitude={longitude}
          onUpdateLocation={handleUpdateLocation}
          onRefreshTime={() => setModernTime(new Date())}
        />
      )}

      {civilization !== 'zhongguo' && (
        <LocationSelector
          onUpdateLocation={handleUpdateLocation}
          currentLat={latitude}
          currentLng={longitude}
        />
      )}

      <InfoSection />

      <GreekCalendarModal
        isOpen={isGreekCalendarOpen}
        onClose={() => setIsGreekCalendarOpen(false)}
        startDate={modernTime}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onUpdateLocation={handleUpdateLocation}
        currentLat={latitude}
        currentLng={longitude}
      />

      {travelModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setTravelModalOpen(false)}
        >
          <div
            className="bg-ink border-2 border-gold-dim/40 rounded-xl shadow-2xl w-full max-w-xs overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gold-dim/30 text-center">
              <h3 className="font-serif text-sm text-gold-leaf uppercase tracking-[0.3em] font-bold">⏳ Viaje Temporal</h3>
              <p className="text-[10px] text-gold-dim/60 font-serif mt-1 tracking-wide">Simula cualquier fecha y hora</p>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <input
                type="datetime-local"
                value={travelInput}
                min="0100-01-01T00:00"
                max="2100-12-31T23:59"
                onChange={e => setTravelInput(e.target.value)}
                className="w-full bg-stone-900 border border-gold-dim/30 rounded-lg px-3 py-2 font-serif text-sm text-parchment focus:outline-none focus:border-gold-leaf/60 [color-scheme:dark]"
              />
              <button
                onClick={applyTravelDate}
                className="w-full py-2.5 rounded-lg bg-gold-leaf/10 border border-gold-leaf/40 text-gold-leaf font-serif text-sm uppercase tracking-widest hover:bg-gold-leaf/20 transition-all font-bold"
              >
                Viajar a esta fecha
              </button>
              {isTimeTraveling && (
                <button
                  onClick={() => { returnToLive(); setTravelModalOpen(false); }}
                  className="w-full py-2 rounded-lg border border-amber-700/40 text-amber-400 font-serif text-xs uppercase tracking-widest hover:bg-amber-900/20 transition-all"
                >
                  Volver al presente
                </button>
              )}
              <button
                onClick={() => setTravelModalOpen(false)}
                className="w-full text-center text-[10px] text-gold-dim/50 font-serif uppercase tracking-widest py-1 hover:text-gold-dim transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isWeatherSelectorOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsWeatherSelectorOpen(false)}
        >
          <div
            className="bg-ink border-2 border-gold-dim/40 rounded-xl shadow-2xl w-full max-w-xs overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gold-dim/30 text-center">
              <h3 className="font-serif text-sm text-gold-leaf uppercase tracking-[0.3em] font-bold">Simular Tiempo</h3>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {DEV_OPTIONS.map(opt => (
                <button
                  key={opt.code ?? 'real'}
                  onClick={() => { setDevWeatherCode(opt.code as number | null); setIsWeatherSelectorOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-serif text-sm uppercase tracking-widest transition-all border
                    ${devWeatherCode === opt.code
                      ? 'bg-gold-leaf text-ink border-gold-leaf font-bold'
                      : 'text-parchment/80 border-gold-dim/20 hover:bg-gold-leaf/10 hover:border-gold-dim/50'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background vignette effect */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-0"></div>

      <footer className="mt-auto relative z-10 text-stone-400 font-serif text-xs tracking-widest pb-4">
        {labels.footerMotto}
      </footer>

      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CivilizationProvider>
      <AppContent />
    </CivilizationProvider>
  );
};

export default App;
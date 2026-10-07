import React, { useState, useEffect, useMemo } from 'react';
import RomanClock from './components/RomanClock';
import EgyptianClock from './components/EgyptianClock';
import ChineseClock from './components/ChineseClock'; // Added
import BabylonianClock from './components/BabylonianClock';
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

  // Update modern time every 15 seconds to prevent high CPU usage
  // Only if NOT in historical testing mode (no ?date parameter)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('date')) return;

    const timer = setInterval(() => {
      setModernTime(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

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
        <select
          value={devWeatherCode ?? ''}
          onChange={e => setDevWeatherCode(e.target.value === '' ? null : Number(e.target.value))}
          className="text-[9px] font-serif uppercase tracking-wider text-gold-dim/70 bg-ink/80 px-2 py-0.5 rounded-full border border-gold-dim/20 backdrop-blur-md shadow-lg appearance-none cursor-pointer"
        >
          <option value="">Tiempo real</option>
          <option value="0">Despejado</option>
          <option value="3">Nublado</option>
          <option value="45">Niebla</option>
          <option value="61">Lluvia leve</option>
          <option value="65">Lluvia intensa</option>
          <option value="82">Lluvia violenta</option>
          <option value="95">Tormenta</option>
          <option value="73">Nieve</option>
        </select>
      </div>

      <header className="text-center relative z-10 w-full max-w-xl mx-auto border-b border-gold-dim/30 pb-2 pt-2 md:pt-0">
        <h1 className="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-widest drop-shadow-md">
          {labels.appTitle} <span className="text-gold-dim font-normal text-xl md:text-2xl">{labels.appSubtitle}</span>
        </h1>
      </header>

      {civilization !== 'zhongguo' && civilization === 'hellas' && (
        <HellenicCalendarInfo
          atticDate={romanTimeData?.atticDate}
          onClick={() => setIsGreekCalendarOpen(true)}
        />
      )}
      {civilization !== 'zhongguo' && civilization === 'aegyptus' && (
        <EgyptianCalendarInfo currentDate={modernTime} />
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

      {civilization !== 'zhongguo' && civilization !== 'babylonia' && <ProvinciaInfo latitude={latitude} longitude={longitude} />}

      {civilization !== 'zhongguo' && <SententiaDiei currentDate={modernTime} />}

      {civilization !== 'zhongguo' && civilization !== 'babylonia' && <SortesVergilianae />}
      
      {civilization !== 'zhongguo' && civilization !== 'babylonia' && <OvidianLore modernTime={modernTime} />}

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
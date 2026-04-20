import React, { useState, useEffect } from 'react';
import RomanClock from './components/RomanClock';
import Controls from './components/Controls';
import InfoSection from './components/InfoSection';
import SolarTimes from './components/SolarTimes';
import { RomanTimeData } from './types';
import { calculateRomanTime } from './utils/romanTimeUtils';
import { calculateHellenicTime } from './utils/hellenicTimeUtils';
import { getSunTimes } from './utils/solar';
import { useWeather } from './hooks/useWeather';
import RomanCalendarInfo from './components/RomanCalendarInfo';
import HellenicCalendarInfo from './components/HellenicCalendarInfo';
import SententiaDiei from './components/SententiaDiei';
import LocationSelector from './components/LocationSelector';
import ProvinciaInfo from './components/ProvinciaInfo';
import SortesVergilianae from './components/SortesVergilianae';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { CivilizationProvider, useCivilization } from './contexts/CivilizationContext';

// Default to Basilea
const DEFAULT_LAT = 47.5632;
const DEFAULT_LNG = 7.5744;

const AppContent: React.FC = () => {
  const { civilization, labels } = useCivilization();
  const [modernTime, setModernTime] = useState<Date>(new Date());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('romanClockTheme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  // Handle theme and civilization background changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-civ', civilization);
    localStorage.setItem('romanClockTheme', theme);
  }, [theme, civilization]);

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
  useEffect(() => {
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
        : calculateHellenicTime(modernTime, latitude, longitude);
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

  const handleUpdateLocation = (lat: number, lng: number) => {
    setLoading(true);
    setLatitude(lat);
    setLongitude(lng);
    localStorage.setItem('romanClockLat', lat.toString());
    localStorage.setItem('romanClockLng', lng.toString());
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-4 px-4 selection:bg-gold-leaf selection:text-ink">
      <header className="text-center relative z-10 w-full max-w-xl mx-auto border-b border-gold-dim/30 pb-2">
        <h1 className="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-widest drop-shadow-md">
          {labels.appTitle} <span className="text-gold-dim font-normal text-xl md:text-2xl">{labels.appSubtitle}</span>
        </h1>
      </header>

      {civilization === 'hellas' && (
        <HellenicCalendarInfo />
      )}

      {romanTimeData && (
        <div className="w-full max-w-2xl mx-auto">
          <RomanClock
            modernTime={modernTime}
            romanTime={romanTimeData}
            loading={loading}
            weather={weather}
            onUpdateLocation={handleUpdateLocation}
            currentLat={latitude}
            currentLng={longitude}
          />
        </div>
      )}

      {civilization === 'rome' ? (
        <RomanCalendarInfo />
      ) : null}

      {todaysSunTimes && romanTimeData && (
        <SolarTimes
          sunrise={todaysSunTimes.sunrise}
          sunset={todaysSunTimes.sunset}
          currentHourLength={romanTimeData.hourLengthMinutes}
        />
      )}

      <ProvinciaInfo latitude={latitude} longitude={longitude} />

      <SententiaDiei currentDate={modernTime} />

      <SortesVergilianae />

      <Controls
        latitude={latitude}
        longitude={longitude}
        onUpdateLocation={handleUpdateLocation}
        onRefreshTime={() => setModernTime(new Date())}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      <LocationSelector
        onUpdateLocation={handleUpdateLocation}
        currentLat={latitude}
        currentLng={longitude}
      />

      <InfoSection />




      {/* Background vignette effect */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-0"></div>

      <footer className="mt-auto relative z-10 text-stone-500 font-serif text-xs tracking-widest opacity-40 pb-4">
        {labels.footerMotto}
      </footer>
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
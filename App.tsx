import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Menu, X, MapPin, CloudSun, Hourglass } from 'lucide-react';
import RomanClock from './components/RomanClock';
import PlanetaryPositions from './components/PlanetaryPositions';
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
import SententiaDiei from './components/SententiaDiei';
import LocationSelector from './components/LocationSelector';
import ProvinciaInfo from './components/ProvinciaInfo';
import EclipseForecast from './components/EclipseForecast';
import SortesVergilianae from './components/SortesVergilianae';
import OvidianLore from './components/OvidianLore';
import LocationModal from './components/LocationModal';
import DateTimePicker from './components/DateTimePicker';
import { LOCATIONS, getTimezoneForLocation } from './utils/locations';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { CivilizationProvider, useCivilization } from './contexts/CivilizationContext';

// Non-Roman civilizations are split into their own chunks, loaded on first switch
const EgyptianClock = lazy(() => import('./components/EgyptianClock'));
const ChineseClock = lazy(() => import('./components/ChineseClock'));
const BabylonianClock = lazy(() => import('./components/BabylonianClock'));
const EgyptianCalendarInfo = lazy(() => import('./components/EgyptianCalendarInfo'));
const BabylonianCalendarInfo = lazy(() => import('./components/BabylonianCalendarInfo'));
const CivilCalendarDatePicker = lazy(() => import('./components/CivilCalendarDatePicker'));

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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isWeatherSelectorOpen, setIsWeatherSelectorOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isTimeTraveling, setIsTimeTraveling] = useState<boolean>(() =>
    new URLSearchParams(window.location.search).has('date')
  );
  const [travelModalOpen, setTravelModalOpen] = useState<boolean>(false);

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

  // Weather Data — when time-traveling, load the weather recorded on that day/time.
  const { weather, error: weatherError } = useWeather(latitude, longitude, isTimeTraveling ? modernTime : undefined);
  const [devWeatherCode, setDevWeatherCode] = useState<number | null>(null);

  const DEV_OPTIONS = [
    { code: null, label: 'Tiempo real' },
    { code: 0, label: 'Despejado' },
    { code: 2, label: 'Parcialmente nublado' },
    { code: 3, label: 'Nublado' },
    { code: 45, label: 'Niebla' },
    { code: 61, label: 'Lluvia leve' },
    { code: 65, label: 'Lluvia intensa' },
    { code: 82, label: 'Lluvia violenta' },
    { code: 95, label: 'Tormenta' },
    { code: 73, label: 'Nieve' },
  ] as const;

  const DEV_CONDITION_MAP: Record<number, WeatherCondition> = {
    0: 'clear', 2: 'partly-cloudy', 3: 'cloudy', 45: 'fog', 61: 'rain', 65: 'rain', 82: 'rain', 95: 'storm', 99: 'storm', 73: 'snow',
  };
  const OFFLINE_WEATHER: WeatherData = {
    isOffline: true,
    isHistorical: false,
    historical: [],
    current: {
      condition: 'cloudy', code: 3, temperature: 15,
      description: 'Offline', windSpeed: 0, windDirection: 0,
      latinWindName: '', surfacePressure: 0, yearLabel: '',
    },
  };

  const effectiveWeather: WeatherData | null = useMemo(() => {
    if (weatherError && !weather) return OFFLINE_WEATHER;
    if (devWeatherCode === null || !weather) return weather;
    return {
      ...weather,
      current: { ...weather.current, code: devWeatherCode, condition: DEV_CONDITION_MAP[devWeatherCode] ?? 'clear' },
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather, weatherError, devWeatherCode]);

  const handleUpdateLocation = (lat: number, lng: number) => {
    setLoading(true);
    setLatitude(lat);
    setLongitude(lng);
    localStorage.setItem('romanClockLat', lat.toString());
    localStorage.setItem('romanClockLng', lng.toString());
  };

  const openTravelModal = () => {
    setTravelModalOpen(true);
  };

  const applyTravelDate = (d: Date) => {
    if (isNaN(d.getTime())) return;
    setModernTime(d);
    setIsTimeTraveling(true);
    setTravelModalOpen(false);
  };

  const returnToLive = () => {
    // Drop a ?date= deep link so a reload stays in the present
    const url = new URL(window.location.href);
    if (url.searchParams.has('date')) {
      url.searchParams.delete('date');
      window.history.replaceState(null, '', url);
    }
    setIsTimeTraveling(false);
    setModernTime(new Date());
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-4 px-4 pb-24 md:pb-8 selection:bg-gold-leaf selection:text-ink">
      
      {/* Mobile menu — burger button with dropdown (location, weather, date) */}
      <div className="fixed top-2 right-2 z-50 md:hidden flex flex-col items-end">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <button
          onClick={() => setIsMobileMenuOpen(open => !open)}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          className="relative w-9 h-9 flex items-center justify-center rounded-full text-gold-dim/80 bg-ink/90 border border-gold-dim/20 shadow-lg active:scale-95 transition-all"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          {isTimeTraveling && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
          )}
        </button>

        {isMobileMenuOpen && (
          <div className="mt-2 w-52 bg-ink/95 border border-gold-dim/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-fadeIn">
            <button
              onClick={() => { setIsLocationModalOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left border-b border-gold-dim/10 hover:bg-gold-leaf/10 active:bg-gold-leaf/15 transition-colors"
            >
              <MapPin className="w-4 h-4 shrink-0 text-gold-dim/70" />
              <span className="flex flex-col min-w-0">
                <span className="font-serif text-[10px] uppercase tracking-widest text-gold-dim/60">Locus</span>
                <span className="font-serif text-xs text-parchment/90 truncate">{currentLocationName}</span>
              </span>
            </button>

            <button
              onClick={() => { setIsWeatherSelectorOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left border-b border-gold-dim/10 hover:bg-gold-leaf/10 active:bg-gold-leaf/15 transition-colors"
            >
              <CloudSun className="w-4 h-4 shrink-0 text-gold-dim/70" />
              <span className="flex flex-col min-w-0">
                <span className="font-serif text-[10px] uppercase tracking-widest text-gold-dim/60">Caelum</span>
                <span className="font-serif text-xs text-parchment/90 truncate">
                  {devWeatherCode === null ? 'Tiempo real' : DEV_OPTIONS.find(o => o.code === devWeatherCode)?.label ?? 'Tiempo real'}
                </span>
              </span>
            </button>

            <button
              onClick={() => { openTravelModal(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gold-leaf/10 active:bg-gold-leaf/15 transition-colors"
            >
              <Hourglass className={`w-4 h-4 shrink-0 ${isTimeTraveling ? 'text-amber-400' : 'text-gold-dim/70'}`} />
              <span className="flex flex-col min-w-0">
                <span className="font-serif text-[10px] uppercase tracking-widest text-gold-dim/60">Tempus</span>
                <span className={`font-serif text-xs truncate ${isTimeTraveling ? 'text-amber-400' : 'text-parchment/90'}`}>
                  {isTimeTraveling ? 'Viajando' : 'Fecha actual'}
                </span>
              </span>
            </button>
          </div>
        )}
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
          weather={effectiveWeather}
          currentLat={latitude}
          currentLng={longitude}
          currentDate={modernTime}
        />
      )}
      {civilization !== 'zhongguo' && civilization === 'aegyptus' && (
        <Suspense fallback={null}>
          <EgyptianCalendarInfo currentDate={modernTime} lat={latitude} lng={longitude} weather={effectiveWeather} />
        </Suspense>
      )}

      {civilization !== 'zhongguo' && civilization === 'babylonia' && (
        <Suspense fallback={null}>
          <BabylonianCalendarInfo
            currentDate={modernTime}
            weather={effectiveWeather}
            currentLat={latitude}
            currentLng={longitude}
          />
        </Suspense>
      )}

      {romanTimeData && (
        <div className="w-full max-w-2xl mx-auto">
          <Suspense fallback={null}>
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
              isTimeTraveling={isTimeTraveling}
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
              isTimeTraveling={isTimeTraveling}
            />
          )}
          </Suspense>
        </div>
      )}

      {civilization !== 'zhongguo' && civilization === 'rome' ? (
        <RomanCalendarInfo currentDate={modernTime} lat={latitude} lng={longitude} />
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

      {civilization !== 'zhongguo' && civilization !== 'babylonia' && <ProvinciaInfo latitude={latitude} longitude={longitude} onLocationChange={handleUpdateLocation} />}

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

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onUpdateLocation={handleUpdateLocation}
        currentLat={latitude}
        currentLng={longitude}
      />

      <Suspense fallback={null}>
      {travelModalOpen && (
        civilization === 'hellas' || civilization === 'aegyptus' || civilization === 'babylonia' ? (
          <CivilCalendarDatePicker
            civilization={civilization}
            initialDate={modernTime}
            lat={latitude}
            lng={longitude}
            onConfirm={applyTravelDate}
            onClose={() => setTravelModalOpen(false)}
            onReturnToLive={isTimeTraveling ? () => { returnToLive(); setTravelModalOpen(false); } : undefined}
          />
        ) : (
          <DateTimePicker
            initialDate={modernTime}
            onConfirm={applyTravelDate}
            onClose={() => setTravelModalOpen(false)}
            onReturnToLive={isTimeTraveling ? () => { returnToLive(); setTravelModalOpen(false); } : undefined}
          />
        )
      )}
      </Suspense>

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
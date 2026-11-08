import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import './App.css';
import { Menu, X, MapPin, CloudSun, Hourglass, Sparkles } from 'lucide-react';
import RomanClock from './components/RomanClock';
import PlanetaryPositions from './components/PlanetaryPositions';
import EgyptianHours from './components/EgyptianHours';
import BabylonianSkyDiary from './components/BabylonianSkyDiary';
import BottomNav from './components/BottomNav';
import Controls from './components/Controls';
import InfoSection from './components/InfoSection';
import SolarTimes from './components/SolarTimes';
import { RomanTimeData, WeatherData } from './types';
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
import CustomWeatherModal from './components/CustomWeatherModal';
import { LOCATIONS, getTimezoneForLocation } from './utils/locations';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { CivilizationProvider, useCivilization } from './contexts/CivilizationContext';
import GlossedTerm from './components/GlossedTerm';
import { BABYLONIAN_UI_TERMS, GlossedTerm as Term } from './utils/civLabels';
import {
  CustomWeatherConfig,
  applyCustomWeather,
  customWeatherLabel,
  loadCustomWeather,
  saveCustomWeather,
} from './utils/customWeather';

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

// eslint-disable-next-line sonarjs/cognitive-complexity
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
  const [isCustomWeatherOpen, setIsCustomWeatherOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isTimeTraveling, setIsTimeTraveling] = useState<boolean>(() =>
    new URLSearchParams(window.location.search).has('date'),
  );
  const [travelModalOpen, setTravelModalOpen] = useState<boolean>(false);

  // Determine current location name and timezone
  const currentLocation = LOCATIONS.find(
    loc =>
      loc.id !== 'gps' &&
      Math.abs(latitude - (loc.lat || 0)) < 0.001 &&
      Math.abs(longitude - (loc.lng || 0)) < 0.001,
  );
  const currentLocationName = currentLocation ? currentLocation.name : 'GPS / Personalizada';
  const locationTimezone = getTimezoneForLocation(latitude, longitude);

  // Calculate today's sun times for display
  const [todaysSunTimes, setTodaysSunTimes] = useState<{ sunrise: Date; sunset: Date } | null>(
    null,
  );

  // --- Configuración inicial de Android (Status Bar) ---
  useEffect(() => {
    const setupNativeApp = async () => {
      try {
        // Ocultar la barra de estado superior de Android
        await StatusBar.hide();
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (e) {
        console.warn('StatusBar no disponible en web', e);
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
      let data;
      if (civilization === 'hellas') {
        data = calculateHellenicTime(modernTime, latitude, longitude);
      } else if (civilization === 'aegyptus') {
        data = calculateEgyptianTime(modernTime, latitude, longitude);
      } else if (civilization === 'babylonia') {
        data = calculateBabylonianTime(modernTime, latitude, longitude);
      } else {
        data = calculateRomanTime(modernTime, latitude, longitude);
      }
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
  const {
    weather,
    error: weatherError,
    slow: weatherSlow,
  } = useWeather(latitude, longitude, isTimeTraveling ? modernTime : undefined);

  // Custom sky chosen from the mobile menu (live weather, the aurora, or a preset
  // with custom temperature and wind). Persisted so it survives a reload.
  const [customWeather, setCustomWeather] = useState<CustomWeatherConfig>(() =>
    loadCustomWeather(),
  );
  useEffect(() => {
    saveCustomWeather(customWeather);
  }, [customWeather]);

  const OFFLINE_WEATHER: WeatherData = {
    isOffline: true,
    aurora: true,
    isHistorical: false,
    historical: [],
    current: {
      condition: 'cloudy',
      code: 3,
      temperature: 15,
      description: 'Offline',
      windSpeed: 0,
      windGusts: 0,
      windDirection: 0,
      latinWindName: '',
      surfacePressure: 0,
      yearLabel: '',
    },
  };

  const effectiveWeather: WeatherData | null = useMemo(() => {
    let base: WeatherData | null = weather;
    if (
      new URLSearchParams(window.location.search).get('offline') === '1' ||
      (weatherError && !weather) ||
      weatherSlow
    )
      base = OFFLINE_WEATHER;
    return applyCustomWeather(base, customWeather);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather, weatherError, weatherSlow, customWeather]);

  /** Turns the aurora on (custom sky) or back to the live weather. */
  const toggleAurora = () => {
    setCustomWeather(c =>
      c.aurora
        ? { ...c, mode: 'live', aurora: false, label: '' }
        : { ...c, mode: 'custom', aurora: true, code: 0, label: '' },
    );
  };

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

  // Mobile-menu headings: Latin, or Akkadian + Spanish gloss on the Babylonian page.
  const menuHeading = (latin: string, term: Term) =>
    civilization === 'babylonia' ? (
      <GlossedTerm
        term={term}
        align="start"
        className="menu-heading-babylonian"
        glossClassName="menu-gloss-babylonian"
      />
    ) : (
      <span className="menu-heading">{latin}</span>
    );

  let clockComponent = null;
  if (romanTimeData) {
    if (civilization === 'aegyptus') {
      clockComponent = (
        <EgyptianClock
          modernTime={modernTime}
          romanTime={romanTimeData}
          loading={loading}
          weather={effectiveWeather}
          onUpdateLocation={handleUpdateLocation}
          currentLat={latitude}
          currentLng={longitude}
        />
      );
    } else if (civilization === 'zhongguo') {
      clockComponent = <ChineseClock modernTime={modernTime} weather={effectiveWeather} />;
    } else if (civilization === 'babylonia') {
      clockComponent = (
        <BabylonianClock
          modernTime={modernTime}
          loading={loading}
          weather={effectiveWeather}
          onUpdateLocation={handleUpdateLocation}
          currentLat={latitude}
          currentLng={longitude}
          isTimeTraveling={isTimeTraveling}
        />
      );
    } else {
      clockComponent = (
        <RomanClock
          modernTime={modernTime}
          romanTime={romanTimeData}
          loading={loading}
          weather={effectiveWeather}
          onUpdateLocation={handleUpdateLocation}
          currentLat={latitude}
          currentLng={longitude}
          locationTimezone={locationTimezone}
          isTimeTraveling={isTimeTraveling}
        />
      );
    }
  }

  let hourPanel;
  if (civilization === 'aegyptus') {
    hourPanel = <EgyptianHours currentDate={modernTime} lat={latitude} lng={longitude} />;
  } else if (civilization === 'babylonia') {
    hourPanel = <BabylonianSkyDiary currentDate={modernTime} lat={latitude} lng={longitude} />;
  } else {
    hourPanel = <PlanetaryPositions currentDate={modernTime} lat={latitude} lng={longitude} />;
  }

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      {/* Mobile menu — burger button with dropdown (location, weather, date) */}
      <div className="mobile-menu">
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <button
          onClick={() => setIsMobileMenuOpen(open => !open)}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          className="mobile-menu-btn"
        >
          {isMobileMenuOpen ? (
            <X className="mobile-menu-btn-icon" />
          ) : (
            <Menu className="mobile-menu-btn-icon" />
          )}
          {isTimeTraveling && <span className="travel-dot" />}
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-menu-panel animate-fadeIn">
            <button
              onClick={() => {
                setIsLocationModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="menu-item-btn"
            >
              <MapPin className="menu-item-icon" />
              <span className="menu-item-content">
                {menuHeading('Locus', BABYLONIAN_UI_TERMS.place)}
                <span className="menu-item-desc">{currentLocationName}</span>
              </span>
            </button>

            <button
              onClick={() => {
                setIsCustomWeatherOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="menu-item-btn"
            >
              <CloudSun className="menu-item-icon" />
              <span className="menu-item-content">
                {menuHeading('Caelum', BABYLONIAN_UI_TERMS.sky)}
                <span className={`menu-item-desc${customWeather.aurora ? ' is-aurora' : ''}`}>
                  {customWeatherLabel(customWeather)}
                </span>
              </span>
            </button>

            <button
              onClick={() => {
                toggleAurora();
                setIsMobileMenuOpen(false);
              }}
              aria-pressed={customWeather.aurora}
              className="menu-item-btn"
            >
              <Sparkles
                className={`menu-item-icon${customWeather.aurora ? ' is-aurora' : ''}`}
              />
              <span className="menu-item-content">
                {menuHeading('Aurora', BABYLONIAN_UI_TERMS.sky)}
                <span className={`menu-item-desc${customWeather.aurora ? ' is-aurora' : ''}`}>
                  {customWeather.aurora ? 'Activada' : 'Desactivada'}
                </span>
              </span>
            </button>

            <button
              onClick={() => {
                openTravelModal();
                setIsMobileMenuOpen(false);
              }}
              className="menu-item-btn"
            >
              <Hourglass className={`menu-item-icon${isTimeTraveling ? ' is-travel' : ''}`} />
              <span className="menu-item-content">
                {menuHeading('Tempus', BABYLONIAN_UI_TERMS.day)}
                <span className={`menu-item-desc${isTimeTraveling ? ' is-travel' : ''}`}>
                  {isTimeTraveling ? 'Viajando' : 'Fecha actual'}
                </span>
              </span>
            </button>
          </div>
        )}
      </div>

      <header className="app-header">
        <h1 className="app-title">
          {labels.appTitle} <span className="app-subtitle">{labels.appSubtitle}</span>
        </h1>
      </header>

      <main id="main-content" tabIndex={-1}>
      {isTimeTraveling && (
        <div className="travel-banner">
          <span className="travel-banner-time">
            ⏳{' '}
            {modernTime.toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: locationTimezone,
            })}
            {locationTimezone !== Intl.DateTimeFormat().resolvedOptions().timeZone && (
              <span className="travel-location-note">({currentLocationName})</span>
            )}
          </span>
          <div className="travel-banner-controls">
            <button onClick={openTravelModal} className="travel-btn-change">
              Cambiar
            </button>
            <span className="travel-separator">·</span>
            <button onClick={returnToLive} className="travel-btn-return">
              Volver al presente
            </button>
          </div>
        </div>
      )}

      {/* Desktop control toolbar — compact pill buttons, hidden on mobile */}
      <div className="desktop-toolbar">
        <button onClick={() => setIsLocationModalOpen(true)} className="toolbar-btn">
          <MapPin className="toolbar-btn-icon" />
          {currentLocationName}
        </button>
        <button onClick={() => setIsCustomWeatherOpen(true)} className="toolbar-btn">
          <CloudSun className="toolbar-btn-icon" />
          <span className={customWeather.aurora ? 'toolbar-aurora-label--active' : ''}>
            {customWeatherLabel(customWeather)}
          </span>
        </button>
        <button
          onClick={toggleAurora}
          aria-pressed={customWeather.aurora}
          className={`toolbar-btn${customWeather.aurora ? ' toolbar-btn--aurora' : ''}`}
        >
          <Sparkles
            className={`toolbar-btn-icon${
              customWeather.aurora ? ' toolbar-btn-icon--aurora' : ''
            }`}
          />
          Aurora
        </button>
        <button
          onClick={openTravelModal}
          className={`toolbar-btn${isTimeTraveling ? ' toolbar-btn--traveling' : ''}`}
        >
          <Hourglass
            className={`toolbar-btn-icon${isTimeTraveling ? ' toolbar-btn-icon--travel' : ''}`}
          />
          {isTimeTraveling ? 'Viajando' : 'Tempus'}
        </button>
      </div>

      {/* Two-column zone — left: clock area, right: supplementary content */}
      <div className="main-grid">
        {/* LEFT COLUMN — CalendarInfo + Clock + RomanCalendarInfo + SolarTimes */}
        <div className="main-col-left">
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
              <EgyptianCalendarInfo
                currentDate={modernTime}
                lat={latitude}
                lng={longitude}
                weather={effectiveWeather}
              />
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

          {clockComponent && (
            <div className="clock-wrapper">
              <Suspense fallback={null}>{clockComponent}</Suspense>
            </div>
          )}

          {civilization !== 'zhongguo' &&
            civilization !== 'babylonia' &&
            todaysSunTimes &&
            romanTimeData && (
              <SolarTimes
                sunrise={todaysSunTimes.sunrise}
                sunset={todaysSunTimes.sunset}
                currentHourLength={romanTimeData.hourLengthMinutes}
                timezone={locationTimezone}
              />
            )}
          {hourPanel}
        </div>
        {/* end LEFT COLUMN */}

        {/* RIGHT COLUMN — supplementary content */}
        <div className="main-col-right">
          {civilization !== 'zhongguo' && <SententiaDiei currentDate={modernTime} />}
          {civilization !== 'zhongguo' && civilization === 'rome' ? (
            <RomanCalendarInfo currentDate={modernTime} lat={latitude} lng={longitude} />
          ) : null}
          {civilization !== 'zhongguo' && civilization !== 'babylonia' && <SortesVergilianae />}
          {civilization !== 'zhongguo' && civilization !== 'babylonia' && (
            <OvidianLore modernTime={modernTime} />
          )}
        </div>
        {/* end RIGHT COLUMN */}
      </div>
      {/* end two-column grid */}

      {/* FULL-WIDTH items below both columns */}
      {civilization !== 'zhongguo' && civilization !== 'babylonia' && (
        <ProvinciaInfo
          latitude={latitude}
          longitude={longitude}
          onLocationChange={handleUpdateLocation}
          travelDate={isTimeTraveling ? modernTime : undefined}
        />
      )}

      {civilization === 'rome' && (
        <EclipseForecast currentDate={modernTime} latitude={latitude} longitude={longitude} />
      )}

      {civilization !== 'zhongguo' && (
        <div className="mobile-only">
          <Controls
            latitude={latitude}
            longitude={longitude}
            onUpdateLocation={handleUpdateLocation}
            onRefreshTime={() => setModernTime(new Date())}
          />
        </div>
      )}

      {civilization !== 'zhongguo' && (
        <div className="mobile-only">
          <LocationSelector
            onUpdateLocation={handleUpdateLocation}
            currentLat={latitude}
            currentLng={longitude}
          />
        </div>
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
        {travelModalOpen &&
          (civilization === 'hellas' ||
          civilization === 'aegyptus' ||
          civilization === 'babylonia' ? (
            <CivilCalendarDatePicker
              civilization={civilization}
              initialDate={modernTime}
              lat={latitude}
              lng={longitude}
              onConfirm={applyTravelDate}
              onClose={() => setTravelModalOpen(false)}
              onReturnToLive={
                isTimeTraveling
                  ? () => {
                      returnToLive();
                      setTravelModalOpen(false);
                    }
                  : undefined
              }
            />
          ) : (
            <DateTimePicker
              initialDate={modernTime}
              onConfirm={applyTravelDate}
              onClose={() => setTravelModalOpen(false)}
              onReturnToLive={
                isTimeTraveling
                  ? () => {
                      returnToLive();
                      setTravelModalOpen(false);
                    }
                  : undefined
              }
            />
          ))}
      </Suspense>

      <CustomWeatherModal
        isOpen={isCustomWeatherOpen}
        onClose={() => setIsCustomWeatherOpen(false)}
        config={customWeather}
        onApply={setCustomWeather}
        liveWeather={weather}
      />

      {/* Background vignette effect */}
      <div className="bg-vignette"></div>

      </main>

      <footer className="app-footer">
        {labels.footerMotto}
        {labels.footerMottoEs && (
          <span className="footer-motto-es">{labels.footerMottoEs}</span>
        )}
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

import React, { useState, useEffect } from 'react';
import RomanClock from './components/RomanClock';
import Controls from './components/Controls';
import InfoSection from './components/InfoSection';
import SolarTimes from './components/SolarTimes';
import { RomanTimeData } from './types';
import { calculateRomanTime } from './utils/romanTimeUtils';
import { getSunTimes } from './utils/solar';
import { useWeather } from './hooks/useWeather';
import RomanCalendarInfo from './components/RomanCalendarInfo';

// Default to Basilea
const DEFAULT_LAT = 47.5632;
const DEFAULT_LNG = 7.5744;

const App: React.FC = () => {
  const [modernTime, setModernTime] = useState<Date>(new Date());

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

  // Update modern time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setModernTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recalculate Roman Time when location or minute changes
  useEffect(() => {
    const updateRomanTime = () => {
      const data = calculateRomanTime(modernTime, latitude, longitude);
      setRomanTimeData(data);

      const sunTimes = getSunTimes(modernTime, latitude, longitude);
      setTodaysSunTimes(sunTimes);

      setLoading(false);
    };

    updateRomanTime();
  }, [modernTime, latitude, longitude]);

  // Weather Data
  const { weather } = useWeather(latitude, longitude);

  const handleUpdateLocation = (lat: number, lng: number) => {
    setLoading(true);
    setLatitude(lat);
    setLongitude(lng);
    // Persist to local storage
    localStorage.setItem('romanClockLat', lat.toString());
    localStorage.setItem('romanClockLng', lng.toString());
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-4 px-4 selection:bg-gold-leaf selection:text-ink">
      <header className="text-center mb-4 relative z-10 w-full max-w-xl mx-auto border-b border-gold-dim/30 pb-2">
        <h1 className="font-serif text-2xl md:text-3xl text-parchment font-bold tracking-widest drop-shadow-md">
          HOROLOGIUM <span className="text-gold-dim font-normal text-xl md:text-2xl">ROMANUM</span>
        </h1>
      </header>

      {romanTimeData && (
        <RomanClock
          modernTime={modernTime}
          romanTime={romanTimeData}
          loading={loading}
          weather={weather}
        />
      )}

      <RomanCalendarInfo />

      {todaysSunTimes && romanTimeData && (
        <SolarTimes
          sunrise={todaysSunTimes.sunrise}
          sunset={todaysSunTimes.sunset}
          currentHourLength={romanTimeData.hourLengthMinutes}
        />
      )}

      <Controls
        latitude={latitude}
        longitude={longitude}
        onUpdateLocation={handleUpdateLocation}
        onRefreshTime={() => setModernTime(new Date())}
      />

      <InfoSection />

      {/* Background vignette effect */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-0"></div>

      <footer className="mt-auto relative z-10 text-stone-500 font-serif text-xs tracking-widest opacity-40 pb-4">
        AD ASTRA PER ASPERA
      </footer>
    </div>
  );
};

export default App;
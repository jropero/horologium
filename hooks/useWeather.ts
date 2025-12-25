import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { fetchWeather } from '../utils/weather';

export const useWeather = (lat: number, lng: number) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const getWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWeather(lat, lng);
                if (mounted) {
                    setWeather(data);
                }
            } catch (err) {
                if (mounted) {
                    console.error(err);
                    setError("Failed to fetch weather");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getWeather();

        // Refresh every 30 minutes
        const interval = setInterval(getWeather, 30 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [lat, lng]);

    return { weather, loading, error };
};

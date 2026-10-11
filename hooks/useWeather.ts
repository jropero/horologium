import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { fetchWeather } from '../utils/weather';

/**
 * Loads weather for a location.
 *
 * @param date Optional target date. When provided (time travel), the weather
 *   reflects that specific historical day/time and is not polled. Omit it to
 *   track live weather, refreshed every 30 minutes.
 */
export const useWeather = (lat: number, lng: number, date?: Date) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Primitive key so a new Date object with the same instant does not refetch.
    const dateKey = date ? date.getTime() : null;

    useEffect(() => {
        let mounted = true;

        const getWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWeather(lat, lng, date);
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

        // Live weather refreshes periodically; historical snapshots are immutable.
        if (dateKey === null) {
            const interval = setInterval(getWeather, 30 * 60 * 1000);
            return () => {
                mounted = false;
                clearInterval(interval);
            };
        }

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lat, lng, dateKey]);

    return { weather, loading, error };
};

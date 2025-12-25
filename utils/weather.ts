import { WeatherData, WeatherCondition } from '../types';

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
const WEATHER_CODES: Record<number, { condition: WeatherCondition, description: string }> = {
    0: { condition: 'clear', description: 'Caelum Serenum' }, // Clear sky
    1: { condition: 'clear', description: 'Caelum Placitum' }, // Mainly clear
    2: { condition: 'cloudy', description: 'Nubes Sparsae' }, // Partly cloudy
    3: { condition: 'cloudy', description: 'Nubilum' }, // Overcast
    45: { condition: 'fog', description: 'Nebula' }, // Fog
    48: { condition: 'fog', description: 'Nebula Gelida' }, // Depositing rime fog
    51: { condition: 'rain', description: 'Pluvia Levis' }, // Drizzle: Light
    53: { condition: 'rain', description: 'Pluvia Modica' }, // Drizzle: Moderate
    55: { condition: 'rain', description: 'Pluvia Gravis' }, // Drizzle: Dense
    56: { condition: 'rain', description: 'Pluvia Gelida Levis' }, // Freezing Drizzle: Light
    57: { condition: 'rain', description: 'Pluvia Gelida Gravis' }, // Freezing Drizzle: Dense
    61: { condition: 'rain', description: 'Imber Levis' }, // Rain: Slight
    63: { condition: 'rain', description: 'Imber Modicus' }, // Rain: Moderate
    65: { condition: 'rain', description: 'Imber Gravis' }, // Rain: Heavy
    66: { condition: 'rain', description: 'Imber Gelidus Levis' }, // Freezing Rain: Light
    67: { condition: 'rain', description: 'Imber Gelidus Gravis' }, // Freezing Rain: Heavy
    71: { condition: 'snow', description: 'Nix Levis' }, // Snow fall: Slight
    73: { condition: 'snow', description: 'Nix Modica' }, // Snow fall: Moderate
    75: { condition: 'snow', description: 'Nix Gravis' }, // Snow fall: Heavy
    77: { condition: 'snow', description: 'Granula Nivis' }, // Snow grains
    80: { condition: 'rain', description: 'Nimbi Pluvii' }, // Rain showers: Slight
    81: { condition: 'rain', description: 'Nimbi Pluvii Graves' }, // Rain showers: Moderate
    82: { condition: 'rain', description: 'Nimbi Pluvii Violenti' }, // Rain showers: Violent
    85: { condition: 'snow', description: 'Nimbi Nivales' }, // Snow showers slight
    86: { condition: 'snow', description: 'Nimbi Nivales Graves' }, // Snow showers heavy
    95: { condition: 'storm', description: 'Tempestas' }, // Thunderstorm: Slight or moderate
    96: { condition: 'storm', description: 'Tempestas cum Grandine' }, // Thunderstorm with slight hail
    99: { condition: 'storm', description: 'Tempestas Saeva' }  // Thunderstorm with heavy hail
};

export const fetchWeather = async (lat: number, lng: number): Promise<WeatherData | null> => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
        );

        if (!response.ok) {
            throw new Error('Weather fetch failed');
        }

        const data = await response.json();
        const current = data.current_weather;
        const code = current.weathercode;
        const temp = current.temperature;

        const info = WEATHER_CODES[code] || { condition: 'clear', description: 'Caelum Ignosum' };

        return {
            temperature: temp,
            condition: info.condition,
            description: info.description,
            code: code
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};

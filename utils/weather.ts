import { WeatherData, WeatherCondition, WeatherSnapshot } from '../types';

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

const getLatinWindName = (degrees: number): string => {
    if (degrees >= 337.5 || degrees < 22.5) return 'Septentrio (N)'; // Viento del Norte
    if (degrees >= 22.5 && degrees < 67.5) return 'Aquilo (NE)';      // Viento del Noreste
    if (degrees >= 67.5 && degrees < 112.5) return 'Subsolanus (E)';  // Viento del Este
    if (degrees >= 112.5 && degrees < 157.5) return 'Vulturnus (SE)'; // Viento del Sureste
    if (degrees >= 157.5 && degrees < 202.5) return 'Auster (S)';     // Viento del Sur
    if (degrees >= 202.5 && degrees < 247.5) return 'Africus (SW)';   // Viento del Suroeste
    if (degrees >= 247.5 && degrees < 292.5) return 'Favonius (W)';   // Viento del Oeste (Céfiro)
    if (degrees >= 292.5 && degrees < 337.5) return 'Caurus (NW)';    // Viento del Noroeste
    return 'Ventus';
};

const HISTORICAL_YEARS = [2003, 1973, 1949];

const getRomanYear = (year: number): string => {
    if (year === 2003) return "MMIII";
    if (year === 1973) return "MCMLXXIII";
    if (year === 1949) return "MCMXLIX";
    return year.toString();
};

export const fetchWeather = async (lat: number, lng: number): Promise<WeatherData | null> => {
    try {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        // URL para Clima Actual - Usamos 'current' para obtener surface_pressure
        const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure`;
 
        // URLs para Clima Histórico
        const historicalUrls = HISTORICAL_YEARS.map(year => {
            const dateStr = `${year}-${month}-${day}`;
            return `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&daily=weather_code,temperature_2m_mean,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
        });
 
        const responses = await Promise.all([
            fetch(currentUrl),
            ...historicalUrls.map(url => fetch(url))
        ]);
 
        // Procesar Actual
        const currData = await responses[0].json();
        const c = currData.current;
        const cInfo = WEATHER_CODES[c.weather_code] || { condition: 'clear', description: 'Caelum Ignosum' };
        
        const current: WeatherSnapshot = {
            temperature: c.temperature_2m,
            condition: cInfo.condition,
            description: cInfo.description,
            code: c.weather_code,
            windSpeed: c.wind_speed_10m,
            windDirection: c.wind_direction_10m,
            latinWindName: getLatinWindName(c.wind_direction_10m),
            surfacePressure: c.surface_pressure,
            yearLabel: "Hodie"
        };
 
        // Procesar Históricos
        const historical: WeatherSnapshot[] = [];
        for (let i = 1; i < responses.length; i++) {
            if (!responses[i].ok) continue;
            const data = await responses[i].json();
            const year = HISTORICAL_YEARS[i - 1];
            
            if (data.daily) {
                const code = data.daily.weather_code[0];
                const info = WEATHER_CODES[code] || { condition: 'clear', description: 'Caelum' };
                historical.push({
                    temperature: data.daily.temperature_2m_mean[0],
                    condition: info.condition,
                    description: info.description,
                    code: code,
                    windSpeed: data.daily.wind_speed_10m_max[0],
                    windDirection: data.daily.wind_direction_10m_dominant[0],
                    latinWindName: getLatinWindName(data.daily.wind_direction_10m_dominant[0]),
                    surfacePressure: 1013, // Valor por defecto para históricos si no se pide explícitamente
                    yearLabel: getRomanYear(year)
                });
            }
        }

        return { current, historical };
    } catch (error) {
        console.error("Error al consultar Chronos:", error);
        return null;
    }
};
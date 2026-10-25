import { WeatherData, WeatherCondition, WeatherSnapshot } from '../types';

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
const WEATHER_CODES: Record<number, { condition: WeatherCondition, description: string }> = {
    0: { condition: 'clear', description: 'Caelum Serenum' }, // Clear sky
    1: { condition: 'clear', description: 'Caelum Placitum' }, // Mainly clear
    2: { condition: 'partly-cloudy', description: 'Nubes Sparsae' }, // Partly cloudy
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

// Greek Anemoi — Tower of the Winds (Horologion of Andronikos)
export const getGreekWindName = (degrees: number): string => {
    if (degrees >= 337.5 || degrees < 22.5) return 'Βορέας (N)';      // Boreas — Frío/Nieve
    if (degrees >= 22.5 && degrees < 67.5) return 'Καικίας (NE)';     // Kaikias
    if (degrees >= 67.5 && degrees < 112.5) return 'Ἀπηλιώτης (E)';   // Apeliotes — Lluvia suave
    if (degrees >= 112.5 && degrees < 157.5) return 'Εὖρος (SE)';     // Euros
    if (degrees >= 157.5 && degrees < 202.5) return 'Νότος (S)';      // Notos — Tormentas
    if (degrees >= 202.5 && degrees < 247.5) return 'Λίψ (SW)';       // Lips
    if (degrees >= 247.5 && degrees < 292.5) return 'Ζέφυρος (W)';    // Zephyros — Brisa cálida
    if (degrees >= 292.5 && degrees < 337.5) return 'Σκίρων (NW)';    // Skiron
    return 'Ἄνεμος';
};

// Greek weather descriptions
const GREEK_WEATHER_CODES: Record<number, string> = {
    0: 'Αἰθρία',           // Clear sky
    1: 'Αἴθριον',           // Mainly clear
    2: 'Νέφη σποράδην',     // Partly cloudy
    3: 'Συννεφία',          // Overcast
    45: 'Ὀμίχλη',           // Fog
    48: 'Ὀμίχλη Παγετώδης', // Rime fog
    51: 'Ψακάς',            // Light drizzle
    53: 'Ψακάδες',          // Moderate drizzle
    55: 'Ψακάδες Πυκναί',   // Dense drizzle
    56: 'Ψακάδες Παγεταί',  // Freezing drizzle
    57: 'Ψακάδες Παγεταὶ Πυκναί',
    61: 'Ὑετός',            // Light rain
    63: 'Ὑετὸς Μέτριος',    // Moderate rain
    65: 'Ὄμβρος',           // Heavy rain
    66: 'Ὑετὸς Παγετός',
    67: 'Ὄμβρος Παγετός',
    71: 'Χιὼν Λεπτή',       // Light snow
    73: 'Χιὼν Μετρία',      // Moderate snow
    75: 'Χιὼν Βαρεῖα',      // Heavy snow
    77: 'Χιονόκοκκοι',      // Snow grains
    80: 'Ὄμβριοι',          // Rain showers
    81: 'Ὄμβριοι Βαρεῖς',
    82: 'Ὄμβριοι Σφοδροί',
    85: 'Νιφάδες',          // Snow showers
    86: 'Νιφάδες Βαρεῖαι',
    95: 'Κεραυνοβολία',     // Thunderstorm
    96: 'Κεραυνοβολία μετὰ Χαλάζης',
    99: 'Θύελλα Ἀγρία',     // Severe thunderstorm
};

export const getGreekWeatherDesc = (code: number): string => {
    return GREEK_WEATHER_CODES[code] || 'Οὐρανός';
};

// --- EGYPTIAN WEATHER (KEMET) ---
// Wind names based on the four sons of Horus and cardinal directions
export const getEgyptianWindName = (degrees: number): string => {
    if (degrees >= 337.5 || degrees < 22.5) return 'Mehit (N) 𓎔𓏏𓇯';      // North (Cool)
    if (degrees >= 22.5 && degrees < 67.5) return 'Mehit-Iabty (NE)';
    if (degrees >= 67.5 && degrees < 112.5) return 'Iabty (E) 𓋁𓃀𓏏𓏭𓇯';   // East
    if (degrees >= 112.5 && degrees < 157.5) return 'Resyt-Iabty (SE)';
    if (degrees >= 157.5 && degrees < 202.5) return 'Resyt (S) 𓉔𓋴𓇯';      // South (Hot)
    if (degrees >= 202.5 && degrees < 247.5) return 'Resyt-Imanty (SW)';
    if (degrees >= 247.5 && degrees < 292.5) return 'Imanty (W) 𓊿𓏏𓏭𓇯';   // West
    if (degrees >= 292.5 && degrees < 337.5) return 'Mehit-Imanty (NW)';
    return 'Ty 𓎗'; // Wind
};

const EGYPTIAN_WEATHER_CODES: Record<number, string> = {
    0: 'Gueben 𓅱𓃀𓈖',           // Bright/Clear
    1: 'Gueben 𓅱𓃀𓈖',
    2: 'Pet Ashet 𓇯 𓆼𓏤',       // Cloudy (Numerous sky)
    3: 'Pet Ashet 𓇯 𓆼𓏤',
    45: 'Shety 𓈙𓏏𓏭',            // Fog
    48: 'Shety 𓈙𓏏𓏭',
    51: 'Heit Levis 𓎛𓇋𓏏𓇶',      // Drizzle
    53: 'Heit 𓎛𓇋𓏏𓇶',
    55: 'Heit 𓎛𓇋𓏏𓇶',
    61: 'Heit 𓎛𓇋𓏏𓇶',
    63: 'Heit 𓎛𓇋𓏏𓇶',
    65: 'Heit 𓎛𓇋𓏏𓇶',
    71: 'Nix (Snow)',           // No direct Egyptian term for snow, using Latin/Descriptive
    80: 'Heit 𓎛𓇋𓏏𓇶',
    95: 'Nesh 𓈖𓈙',             // Storm
    99: 'Nesh 𓈖𓈙',
};

export const getEgyptianWeatherDesc = (code: number): string => {
    return EGYPTIAN_WEATHER_CODES[code] || 'Pet 𓇯'; // Sky
};

// --- CHINESE WEATHER (ZHONGGUO 中國) ---
// Eight Winds (八風, Bā Fēng) — from the Lüshi Chunqiu & Huainanzi
export const getChineseWindName = (degrees: number): string => {
    if (degrees >= 337.5 || degrees < 22.5)   return '廣莫風 Guǎng mò (N)';    // Viento del Gran Desierto
    if (degrees >= 22.5  && degrees < 67.5)   return '條風 Tiáo fēng (NE)';    // Viento Armonizador
    if (degrees >= 67.5  && degrees < 112.5)  return '明庶風 Míng shù (E)';    // Viento de la Multitud Luminosa
    if (degrees >= 112.5 && degrees < 157.5)  return '清明風 Qīng míng (SE)';  // Viento Claro y Brillante
    if (degrees >= 157.5 && degrees < 202.5)  return '景風 Jǐng fēng (S)';     // Viento Espléndido
    if (degrees >= 202.5 && degrees < 247.5)  return '涼風 Liáng fēng (SO)';   // Viento Fresco
    if (degrees >= 247.5 && degrees < 292.5)  return '閶闔風 Chāng hé (O)';    // Viento de la Puerta del Cielo
    if (degrees >= 292.5 && degrees < 337.5)  return '不周風 Bù zhōu (NO)';    // Viento Incompleto — ¡rompió el pilar del Cielo!
    return '風 Fēng';
};

const CHINESE_WEATHER_CODES: Record<number, string> = {
    0:  '天朗氣清 Tiān lǎng qì qīng',   // Clear sky — "Sky clear, air pure"
    1:  '風和日麗 Fēng hé rì lì',         // Mainly clear — "Wind gentle, sun beautiful"
    2:  '雲淡風輕 Yún dàn fēng qīng',    // Partly cloudy — "Clouds thin, breeze light"
    3:  '烏雲蔽日 Wū yún bì rì',          // Overcast — "Dark clouds cover the sun"
    45: '雲遮霧繞 Yún zhē wù rào',        // Fog — "Clouds cover, mist surrounds"
    48: '冰霧凝結 Bīng wù níng jié',      // Rime fog — "Icy mist coagulates"
    51: '細雨霏霏 Xì yǔ fēi fēi',         // Light drizzle — "Fine rain drizzles endlessly"
    53: '細雨霏霏 Xì yǔ fēi fēi',
    55: '甘霖普降 Gān lín pǔ jiàng',      // Dense drizzle — "Sweet heaven-rain falls everywhere"
    56: '冰雨霏霏 Bīng yǔ fēi fēi',
    57: '冰雨霏霏 Bīng yǔ fēi fēi',
    61: '甘霖普降 Gān lín pǔ jiàng',
    63: '大雨滂沱 Dà yǔ páng tuó',        // Moderate rain — "Great rain torrential"
    65: '傾盆大雨 Qīng pén dà yǔ',        // Heavy rain — "Upturned bucket rain"
    66: '冰雨滂沱 Bīng yǔ páng tuó',
    67: '傾盆冰雨 Qīng pén bīng yǔ',
    71: '瑞雪兆豐 Ruì xuě zhào fēng',     // Light snow — "Auspicious snow foretells harvest"
    73: '玉屑紛飛 Yù xiè fēn fēi',        // Moderate snow — "Jade shavings fly about"
    75: '大雪紛飛 Dà xuě fēn fēi',        // Heavy snow — "Great snow flies everywhere"
    77: '冰晶如玉 Bīng jīng rú yù',       // Snow grains — "Ice crystals like jade"
    80: '驟雨驟晴 Zhòu yǔ zhòu qíng',    // Showers — "Sudden rain, sudden clear"
    81: '龍王行雨 Lóng wáng xíng yǔ',    // Moderate showers — "The Dragon King sends rain"
    82: '龍王震怒 Lóng wáng zhèn nù',    // Violent showers — "The Dragon King rages"
    85: '玉屑飄飄 Yù xiè piāo piāo',
    86: '大雪如席 Dà xuě rú xí',
    95: '雷霆萬鈞 Léi tíng wàn jūn',     // Thunderstorm — "Thunder of ten thousand catties"
    96: '天公震怒 Tiān gōng zhèn nù',    // Thunderstorm + hail — "The Heavenly Lord rages"
    99: '雷霆震怒 Léi tíng zhèn nù',     // Severe thunderstorm
};

export const getChineseWeatherDesc = (code: number): string => {
    return CHINESE_WEATHER_CODES[code] || '天氣未詳 Tiānqì wèi xiáng';
};

const HISTORICAL_YEARS = [2003, 1973, 1949];

const pad2 = (n: number): string => String(n).padStart(2, '0');

const getRomanYear = (year: number): string => {
    if (year === 2003) return "MMIII";
    if (year === 1973) return "MCMLXXIII";
    if (year === 1949) return "MCMXLIX";
    return year.toString();
};

interface SnapshotInput {
    temperature: number;
    code: number;
    windSpeed: number;
    windGusts: number;
    windDirection: number;
    surfacePressure: number;
    yearLabel: string;
}

/** Builds a complete WeatherSnapshot (WMO code + civilization flavourings) from raw values. */
export const buildWeatherSnapshot = ({
    temperature,
    code,
    windSpeed,
    windGusts,
    windDirection,
    surfacePressure,
    yearLabel,
}: SnapshotInput): WeatherSnapshot => {
    const info = WEATHER_CODES[code] || { condition: 'clear', description: 'Caelum Ignosum' };
    return {
        temperature,
        condition: info.condition,
        description: info.description,
        greekDescription: getGreekWeatherDesc(code),
        egyptianDescription: getEgyptianWeatherDesc(code),
        chineseDescription: getChineseWeatherDesc(code),
        code,
        windSpeed,
        windGusts,
        windDirection,
        latinWindName: getLatinWindName(windDirection),
        greekWindName: getGreekWindName(windDirection),
        egyptianWindName: getEgyptianWindName(windDirection),
        chineseWindName: getChineseWindName(windDirection),
        surfacePressure,
        yearLabel,
    };
};

const HOURLY_VARS = 'temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,surface_pressure';

/** Index of the hourly row matching the target wall-clock hour, else the first usable row. */
const pickHourlyIndex = (hourly: any, target: Date): number => {
    if (!hourly || !Array.isArray(hourly.time) || !Array.isArray(hourly.temperature_2m)) return -1;
    const targetHour = target.getHours();
    for (let i = 0; i < hourly.time.length; i++) {
        if (Number(String(hourly.time[i]).slice(11, 13)) === targetHour && hourly.temperature_2m[i] != null) {
            return i;
        }
    }
    return hourly.temperature_2m.findIndex((v: number | null) => v != null);
};

const snapshotFromHourly = (hourly: any, index: number, yearLabel: string): WeatherSnapshot | null => {
    if (index < 0) return null;
    const temperature = hourly.temperature_2m?.[index];
    const code = hourly.weather_code?.[index];
    if (temperature == null || code == null) return null;
    return buildWeatherSnapshot({
        temperature,
        code,
        windSpeed: hourly.wind_speed_10m?.[index] ?? 0,
        windGusts: hourly.wind_gusts_10m?.[index] ?? 0,
        windDirection: hourly.wind_direction_10m?.[index] ?? 0,
        surfacePressure: hourly.surface_pressure?.[index] ?? 1013,
        yearLabel,
    });
};

/**
 * Weather for a specific historical date/time at a location.
 * Tries the archive (reanalysis) API first, then the forecast API's `past_days`
 * window for recent dates the archive has not published yet. Returns null when
 * the date is outside the historical range (e.g. the future).
 */
const fetchHistoricalSnapshot = async (lat: number, lng: number, target: Date): Promise<WeatherSnapshot | null> => {
    const dateStr = `${target.getFullYear()}-${pad2(target.getMonth() + 1)}-${pad2(target.getDate())}`;

    try {
        const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&hourly=${HOURLY_VARS}&timezone=auto`;
        const res = await fetch(archiveUrl);
        if (res.ok) {
            const data = await res.json();
            const snapshot = snapshotFromHourly(data.hourly, pickHourlyIndex(data.hourly, target), 'Hodie');
            if (snapshot) return snapshot;
        }
    } catch {
        // Fall through to the forecast past-days window.
    }

    const daysAgo = Math.ceil((Date.now() - target.getTime()) / 86400000);
    if (daysAgo >= 0 && daysAgo <= 92) {
        try {
            const pastDays = Math.min(92, Math.max(1, daysAgo + 1));
            const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=${HOURLY_VARS}&past_days=${pastDays}&timezone=auto`;
            const res = await fetch(forecastUrl);
            if (res.ok) {
                const data = await res.json();
                const index = pickHourlyIndex(data.hourly, target);
                if (index >= 0 && String(data.hourly.time[index]).slice(0, 10) === dateStr) {
                    return snapshotFromHourly(data.hourly, index, 'Hodie');
                }
            }
        } catch {
            // No historical data available.
        }
    }

    return null;
};

/**
 * Fetches weather for a location.
 * When `targetDate` is given (time travel), the current snapshot becomes the
 * weather recorded at that date/time and the comparison years are shifted to the
 * same month/day. Without it, everything is relative to the present.
 */
export const fetchWeather = async (lat: number, lng: number, targetDate?: Date): Promise<WeatherData | null> => {
    try {
        const now = new Date();
        // Treat a target within the hour as "live" so the minute-fresh forecast is kept.
        const isLive = !targetDate || Math.abs(now.getTime() - targetDate.getTime()) < 60 * 60 * 1000;

        // Reference day for the "same day in past years" comparison.
        const ref = targetDate ?? now;
        const month = pad2(ref.getMonth() + 1);
        const day = pad2(ref.getDate());

        // --- Selected day (historical) or present weather ---
        let current: WeatherSnapshot | null = null;
        let isHistorical = false;
        if (!isLive && targetDate) {
            current = await fetchHistoricalSnapshot(lat, lng, targetDate);
            if (current) isHistorical = true;
        }

        if (!current) {
            const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,surface_pressure`;
            const res = await fetch(currentUrl);
            if (res.ok) {
                const c = (await res.json()).current;
                if (c && c.temperature_2m != null) {
                    current = buildWeatherSnapshot({
                        temperature: c.temperature_2m,
                        code: c.weather_code,
                        windSpeed: c.wind_speed_10m ?? 0,
                        windGusts: c.wind_gusts_10m ?? 0,
                        windDirection: c.wind_direction_10m ?? 0,
                        surfacePressure: c.surface_pressure ?? 1013,
                        yearLabel: 'Hodie',
                    });
                }
            }
        }

        if (!current) return null;

        // --- Historical comparison: same day across HISTORICAL_YEARS ---
        const historicalUrls = HISTORICAL_YEARS.map(year => {
            const dateStr = `${year}-${month}-${day}`;
            return `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&daily=weather_code,temperature_2m_mean,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;
        });

        const responses = await Promise.all(historicalUrls.map(url => fetch(url)));

        const historical: WeatherSnapshot[] = [];
        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) continue;
            const data = await responses[i].json();
            const year = HISTORICAL_YEARS[i];
            const daily = data.daily;
            if (daily && daily.weather_code?.[0] != null && daily.temperature_2m_mean?.[0] != null) {
                historical.push(buildWeatherSnapshot({
                    temperature: daily.temperature_2m_mean[0],
                    code: daily.weather_code[0],
                    windSpeed: daily.wind_speed_10m_max?.[0] ?? 0,
                    windGusts: daily.wind_gusts_10m_max?.[0] ?? 0,
                    windDirection: daily.wind_direction_10m_dominant?.[0] ?? 0,
                    surfacePressure: 1013,
                    yearLabel: getRomanYear(year),
                }));
            }
        }

        return { current, historical, isHistorical };
    } catch (error) {
        console.error("Error al consultar Chronos:", error);
        throw error;
    }
};
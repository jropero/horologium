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
            greekDescription: getGreekWeatherDesc(c.weather_code),
            egyptianDescription: getEgyptianWeatherDesc(c.weather_code),
            chineseDescription: getChineseWeatherDesc(c.weather_code),
            code: c.weather_code,
            windSpeed: c.wind_speed_10m,
            windDirection: c.wind_direction_10m,
            latinWindName: getLatinWindName(c.wind_direction_10m),
            greekWindName: getGreekWindName(c.wind_direction_10m),
            egyptianWindName: getEgyptianWindName(c.wind_direction_10m),
            chineseWindName: getChineseWindName(c.wind_direction_10m),
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
                    greekDescription: getGreekWeatherDesc(code),
                    egyptianDescription: getEgyptianWeatherDesc(code),
                    chineseDescription: getChineseWeatherDesc(code),
                    code: code,
                    windSpeed: data.daily.wind_speed_10m_max[0],
                    windDirection: data.daily.wind_direction_10m_dominant[0],
                    latinWindName: getLatinWindName(data.daily.wind_direction_10m_dominant[0]),
                    greekWindName: getGreekWindName(data.daily.wind_direction_10m_dominant[0]),
                    egyptianWindName: getEgyptianWindName(data.daily.wind_direction_10m_dominant[0]),
                    chineseWindName: getChineseWindName(data.daily.wind_direction_10m_dominant[0]),
                    surfacePressure: 1013,
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
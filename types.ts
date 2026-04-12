// --- START OF FILE horologium-main/types.ts ---
export interface VigiliaData {
  name: string;
  desc: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface CivilDayPart {
  name: string;
  desc: string;
}

export interface RomanTimeData {
  romanHour: number; // 1-12
  isDay: boolean;
  hourName: string; // e.g., "Tertia Hora"
  hourLengthMinutes: number;
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  romanDateString: string;
  romanDateFull: string;
  moonPhase: number; // 0 to 1
  moonPhaseLabel: string; // e.g., "Plenilunium"
  planetaryRuler: string; // e.g., "Jupiter"
  civilDayPart: CivilDayPart;
  vigilia?: VigiliaData;
  nundinalLetter: string;
  isMarketDay: boolean;
  dayOfWeek: string;
  indiction: number;
  tutelaMensis: string;
  zodiacSign: string;
}

export type TimePeriod = "Dies" | "Nox";
export const TimePeriod = {
  Day: "Dies" as TimePeriod,
  Night: "Nox" as TimePeriod
};

export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'storm'
  | 'fog';

export interface WeatherSnapshot {
    temperature: number;
    condition: WeatherCondition;
    description: string;
    code: number;
    windSpeed: number;
    windDirection: number;
    latinWindName: string;
    surfacePressure: number;
    yearLabel: string; // "MMIII", "MCMLXXIII", etc.
}

export interface WeatherData {
    current: WeatherSnapshot;
    historical: WeatherSnapshot[]; // Un array con los años pasados
}
// --- END OF FILE horologium-main/types.ts ---
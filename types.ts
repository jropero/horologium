export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
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

export interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  description: string; // Latin description
  code: number; // WMO code
}
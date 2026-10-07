export type BabylonianBuildingType = 'ziggurat' | 'wall' | 'palm';

export interface BabylonianSkylineElement {
  id: string;
  type: BabylonianBuildingType;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

export const BABYLONIAN_MONTHS = [
  'Nisannu', 'Ayaru', 'Simanu', 'Duʾūzu', 'Abu', 'Ulūlu',
  'Tašrītu', 'Araḫsamnu', 'Kislīmu', 'Ṭebētu', 'Šabāṭu', 'Addaru'
] as const;

export type BabylonianMonth = typeof BABYLONIAN_MONTHS[number];

export const BABYLONIAN_ZODIAC = [
  'Agru', 'Gudanna', 'Mastabbagalgal', 'Pulukku',
  'Urgula', 'Širu', 'Zibanitu', 'Zuqaqīpu',
  'Pabilsag', 'Suḫurmāšu', 'Gula', 'Zibbātu'
] as const;

export interface BabylonianDate {
  seYear: number;
  monthName: string;
  monthIndex: number;
  day: number;
  isIntercalary: boolean;
  zodiacSign: string;
  planetaryRuler: string;
  planetaryRulerEn: string;
  watch: number;
  watchName: string;
  watchDesc: string;
  temporalHour: number;
  hourName: string;
  isDay: boolean;
  moonPhase: number;
  moonPhaseName: string;
  dayProgress: number;
  monthDeity: string;
  monthDeityDesc: string;
}

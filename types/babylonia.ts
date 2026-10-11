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

// Canonical monthly regents ("regentes del mes"). Source: the cuneiform month-regent
// lists (IV R 33; the Astrolabe B regent series), corroborated by the Iqqur īpuš
// menology (Labat 1965, no. 105) and Muss-Arnolt 1892 (JBL 11). Order matches
// BABYLONIAN_MONTHS.
//   5 Abu    → Ningishzida, with a Ninurta variant (traditions differ)
//  12 Addaru → the Sebitti ("the Seven great gods"); the Neo-Assyrian menology also
//              names the Seven, while Marduk "fish of Ea" is a separate tradition.
export const BABYLONIAN_MONTH_REGENTS = [
  'Anu y Enlil', 'Ea', 'Sîn', 'Ninurta', 'Ningishzida', 'Ištar',
  'Šamaš', 'Marduk', 'Nergal', 'Papsukkal', 'Adad', 'Sebitti',
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
  monthRegent: string;
  monthRegentDesc: string;
}

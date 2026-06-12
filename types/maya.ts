export type TzolkinDate = {
  number: number; // 1-13
  name: string;
};

export type HaabDate = {
  number: number; // 0-19
  name: string;
};

export type LongCount = {
  baktun: number;
  katun: number;
  tun: number;
  uinal: number;
  kin: number;
};

export type LordOfTheNight = {
  id: string; // e.g., 'G1' to 'G9'
};

export const TZOLKIN_NAMES = [
  'Imix', 
  'Ik', 
  'Ak\'bal', 
  'K\'an', 
  'Chikchan', 
  'Kimi', 
  'Manik', 
  'Lamat', 
  'Muluk', 
  'Ok', 
  'Chuwen', 
  'Eb', 
  'Ben', 
  'Ix', 
  'Men', 
  'K\'ib', 
  'Kab\'an', 
  'Etz\'nab', 
  'Kawak', 
  'Ajaw'
];

export const HAAB_NAMES = [
  'Pop', 
  'Wo\'', 
  'Sip', 
  'Zotz\'', 
  'Sek', 
  'Xul', 
  'Yaxk\'in', 
  'Mol', 
  'Ch\'en', 
  'Yax', 
  'Sak', 
  'Keh', 
  'Mak', 
  'K\'ank\'in', 
  'Muan', 
  'Pax', 
  'K\'ayab\'', 
  'Kumk\'u', 
  'Wayeb\''
];

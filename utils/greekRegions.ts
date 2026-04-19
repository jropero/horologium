// greekRegions.ts — Greek poleis/regions with bounding boxes + stadia distance

export interface GreekRegion {
  name: string;
  nameEs: string;
  desc: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

const REGIONS: GreekRegion[] = [
  // Grecia Central
  { name: "Ἀττική", nameEs: "Ática", desc: "Sede de Atenas, corazón de la democracia y cuna del teatro.", latMin: 37.6, latMax: 38.4, lngMin: 23.2, lngMax: 24.2 },
  { name: "Βοιωτία", nameEs: "Beocia", desc: "Tierra de Tebas y Platea, patria de Píndaro y Hesíodo.", latMin: 38.2, latMax: 38.8, lngMin: 22.6, lngMax: 23.6 },
  { name: "Φωκίς", nameEs: "Fócide", desc: "Sede de Delfos, el ombligo del mundo y oráculo de Apolo.", latMin: 38.3, latMax: 38.8, lngMin: 22.0, lngMax: 22.7 },
  { name: "Αἰτωλία", nameEs: "Etolia", desc: "Región occidental, tierra de la Liga Etolia.", latMin: 38.3, latMax: 39.0, lngMin: 21.0, lngMax: 22.0 },
  { name: "Ἀκαρνανία", nameEs: "Acarnania", desc: "Región costera occidental, patria de la Liga Acarnania.", latMin: 38.4, latMax: 39.0, lngMin: 20.5, lngMax: 21.3 },

  // Peloponeso
  { name: "Λακωνική", nameEs: "Laconia", desc: "Territorio de Esparta, la invencible polis guerrera.", latMin: 36.4, latMax: 37.3, lngMin: 22.0, lngMax: 23.0 },
  { name: "Κορινθία", nameEs: "Corintia", desc: "Istmo entre el Ática y el Peloponeso, encrucijada del mundo griego.", latMin: 37.6, latMax: 38.1, lngMin: 22.5, lngMax: 23.2 },
  { name: "Ἀργολίς", nameEs: "Argólida", desc: "Tierra de Argos, Micenas y Epidauro, la Grecia más antigua.", latMin: 37.2, latMax: 37.8, lngMin: 22.4, lngMax: 23.3 },
  { name: "Ἀρκαδία", nameEs: "Arcadia", desc: "Montañosa región central del Peloponeso, tierra pastoril por excelencia.", latMin: 37.1, latMax: 37.9, lngMin: 21.7, lngMax: 22.6 },
  { name: "Ἦλις", nameEs: "Élide", desc: "Sede de Olimpia, donde nacieron los Juegos Olímpicos.", latMin: 37.3, latMax: 38.0, lngMin: 21.2, lngMax: 21.9 },
  { name: "Μεσσηνία", nameEs: "Mesenia", desc: "Rica llanura fértil del suroeste, sometida largamente por Esparta.", latMin: 36.6, latMax: 37.4, lngMin: 21.5, lngMax: 22.2 },

  // Norte de Grecia
  { name: "Θεσσαλία", nameEs: "Tesalia", desc: "Gran llanura de caballos, hogar del monte Olimpo y de Aquiles.", latMin: 38.8, latMax: 40.0, lngMin: 21.5, lngMax: 23.0 },
  { name: "Μακεδονία", nameEs: "Macedonia", desc: "Tierra de Filipo II y Alejandro Magno, reino que unificó Grecia.", latMin: 40.0, latMax: 41.5, lngMin: 21.0, lngMax: 24.5 },
  { name: "Θράκη", nameEs: "Tracia", desc: "Región guerrera del noreste, cuna de Orfeo y Espartaco.", latMin: 40.5, latMax: 42.0, lngMin: 24.0, lngMax: 26.5 },
  { name: "Ἤπειρος", nameEs: "Epiro", desc: "Tierra del oráculo de Dodona, la más antigua profecía de Zeus.", latMin: 39.0, latMax: 40.5, lngMin: 19.5, lngMax: 21.5 },

  // Islas
  { name: "Κρήτη", nameEs: "Creta", desc: "Isla del laberinto de Minos, cuna de la civilización minoica.", latMin: 34.8, latMax: 35.7, lngMin: 23.4, lngMax: 26.4 },
  { name: "Κύπρος", nameEs: "Chipre", desc: "Isla sagrada de Afrodita, nacida de la espuma del mar.", latMin: 34.5, latMax: 35.8, lngMin: 32.0, lngMax: 34.7 },
  { name: "Εὔβοια", nameEs: "Eubea", desc: "Gran isla frente al Ática, patria de poderosas ciudades.", latMin: 38.0, latMax: 39.1, lngMin: 22.8, lngMax: 24.6 },

  // Jonia (Costa de Asia Menor)
  { name: "Ἰωνία", nameEs: "Jonia", desc: "Costa griega de Asia Menor: Mileto, Éfeso, Esmirna. Cuna de la filosofía.", latMin: 37.0, latMax: 39.5, lngMin: 26.0, lngMax: 28.5 },
  { name: "Αἰολίς", nameEs: "Eólide", desc: "Región de Lesbos y la costa norte de Asia Menor. Patria de Safo.", latMin: 38.5, latMax: 40.0, lngMin: 25.5, lngMax: 27.5 },

  // Magna Grecia
  { name: "Μεγάλη Ἑλλάς", nameEs: "Magna Grecia", desc: "Colonias griegas del sur de Italia: Siracusa, Tarento, Crotona.", latMin: 36.5, latMax: 41.0, lngMin: 14.0, lngMax: 18.5 },

  // Cirenaica
  { name: "Κυρηναϊκή", nameEs: "Cirenaica", desc: "Colonia griega del norte de África, sede de Cirene.", latMin: 30.5, latMax: 33.5, lngMin: 19.5, lngMax: 24.0 },

  // Ponto
  { name: "Πόντος", nameEs: "Ponto", desc: "Costa sur del Mar Negro, rica en comercio y colonias griegas.", latMin: 40.5, latMax: 42.5, lngMin: 35.0, lngMax: 42.0 },
];

export const getGreekRegion = (lat: number, lng: number): GreekRegion | null => {
  let bestMatch: GreekRegion | null = null;
  let bestArea = Infinity;

  for (const region of REGIONS) {
    if (lat >= region.latMin && lat <= region.latMax && lng >= region.lngMin && lng <= region.lngMax) {
      const area = (region.latMax - region.latMin) * (region.lngMax - region.lngMin);
      if (area < bestArea) {
        bestArea = area;
        bestMatch = region;
      }
    }
  }

  return bestMatch;
};

// Altar of the Twelve Gods in the Agora of Athens (point zero for Greek distances)
const ATHENS_LAT = 37.9755;
const ATHENS_LNG = 23.7228;

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 1 Greek Stadion ≈ 0.185 km
const KM_PER_STADION = 0.185;

export const getDistanceToAthens = (lat: number, lng: number): { km: number; stadia: number } => {
  const km = haversineKm(lat, lng, ATHENS_LAT, ATHENS_LNG);
  return {
    km: Math.round(km),
    stadia: Math.round(km / KM_PER_STADION),
  };
};

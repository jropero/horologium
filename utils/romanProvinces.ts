// Roman provinces approximated by geographic bounding boxes
// Each province has a Latin name, a Spanish description, and lat/lng bounds

export interface RomanProvince {
  name: string;
  nameEs: string;
  desc: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

const PROVINCES: RomanProvince[] = [
  // Hispania
  { name: "Hispania Tarraconensis", nameEs: "Hispania Tarraconense", desc: "La mayor provincia de Hispania, gobernada desde Tarraco.", latMin: 38.5, latMax: 43.8, lngMin: -4.0, lngMax: 3.5 },
  { name: "Hispania Baetica", nameEs: "Bética", desc: "Provincia senatorial rica en aceite y minerales, con capital en Corduba.", latMin: 36.0, latMax: 39.0, lngMin: -7.5, lngMax: -1.5 },
  { name: "Lusitania", nameEs: "Lusitania", desc: "Provincia occidental de Hispania con capital en Augusta Emerita.", latMin: 37.0, latMax: 42.0, lngMin: -9.5, lngMax: -4.0 },
  { name: "Gallaecia", nameEs: "Gallaecia", desc: "Región del noroeste hispano, rica en oro y estaño.", latMin: 41.5, latMax: 44.0, lngMin: -9.5, lngMax: -4.0 },

  // Gallia
  { name: "Gallia Narbonensis", nameEs: "Galia Narbonense", desc: "La Provincia por excelencia, primera conquista romana en la Galia.", latMin: 42.5, latMax: 45.0, lngMin: 1.5, lngMax: 7.5 },
  { name: "Gallia Lugdunensis", nameEs: "Galia Lugdunense", desc: "Provincia central de la Galia con capital en Lugdunum.", latMin: 45.0, latMax: 49.5, lngMin: -5.0, lngMax: 5.0 },
  { name: "Gallia Belgica", nameEs: "Galia Bélgica", desc: "Provincia septentrional habitada por los belgas, los más bravos según César.", latMin: 48.5, latMax: 52.0, lngMin: 1.0, lngMax: 7.0 },
  { name: "Gallia Aquitania", nameEs: "Aquitania", desc: "Provincia suroccidental de la Galia entre el Loira y los Pirineos.", latMin: 42.5, latMax: 47.5, lngMin: -2.0, lngMax: 2.0 },

  // Britannia
  { name: "Britannia", nameEs: "Britania", desc: "Isla conquistada por Claudio, frontera norte del Imperio.", latMin: 50.0, latMax: 58.0, lngMin: -8.0, lngMax: 2.0 },

  // Germania
  { name: "Germania Superior", nameEs: "Germania Superior", desc: "Provincia del alto Rin con capital en Mogontiacum.", latMin: 46.0, latMax: 50.5, lngMin: 5.5, lngMax: 10.0 },
  { name: "Germania Inferior", nameEs: "Germania Inferior", desc: "Provincia del bajo Rin con capital en Colonia Agrippina.", latMin: 50.0, latMax: 53.0, lngMin: 4.0, lngMax: 8.0 },

  // Raetia & Noricum
  { name: "Raetia", nameEs: "Recia", desc: "Provincia alpina entre la Galia y el Nórico, con capital en Augusta Vindelicorum.", latMin: 46.0, latMax: 49.0, lngMin: 8.5, lngMax: 13.0 },
  { name: "Noricum", nameEs: "Nórico", desc: "Provincia alpina conocida por su excelente hierro.", latMin: 46.0, latMax: 49.0, lngMin: 12.0, lngMax: 17.0 },

  // Italia
  { name: "Italia", nameEs: "Italia", desc: "El corazón del Imperio, sede de la Urbs Aeterna.", latMin: 36.5, latMax: 47.0, lngMin: 6.5, lngMax: 18.5 },

  // Pannonia
  { name: "Pannonia", nameEs: "Panonia", desc: "Provincia danubiana de gran importancia militar.", latMin: 45.0, latMax: 49.0, lngMin: 15.0, lngMax: 21.0 },

  // Dalmatia
  { name: "Dalmatia", nameEs: "Dalmacia", desc: "Provincia costera del Adriático oriental.", latMin: 42.0, latMax: 46.0, lngMin: 14.0, lngMax: 20.0 },

  // Graecia & Macedonia
  { name: "Macedonia", nameEs: "Macedonia", desc: "Antigua tierra de Alejandro, provincia senatorial bajo Roma.", latMin: 39.0, latMax: 42.5, lngMin: 19.0, lngMax: 27.0 },
  { name: "Achaea", nameEs: "Acaya", desc: "La Grecia clásica, cuna de la filosofía y las artes.", latMin: 36.0, latMax: 39.5, lngMin: 19.5, lngMax: 27.5 },

  // Asia Minor
  { name: "Asia", nameEs: "Asia", desc: "La más rica de las provincias, con capital en Ephesus.", latMin: 36.5, latMax: 41.0, lngMin: 26.0, lngMax: 32.0 },

  // Africa
  { name: "Africa Proconsularis", nameEs: "África Proconsular", desc: "El granero de Roma, con capital en Carthago renovada.", latMin: 30.0, latMax: 37.5, lngMin: 7.0, lngMax: 12.0 },
  { name: "Aegyptus", nameEs: "Egipto", desc: "Posesión personal del emperador, granero vital del Imperio.", latMin: 22.0, latMax: 31.5, lngMin: 24.0, lngMax: 37.0 },

  // Syria
  { name: "Syria", nameEs: "Siria", desc: "Rica provincia oriental con capital en Antioquía.", latMin: 32.0, latMax: 37.5, lngMin: 35.0, lngMax: 42.0 },

  // Mauretania
  { name: "Mauretania Tingitana", nameEs: "Mauritania Tingitana", desc: "Provincia norteafricana occidental con capital en Tingis.", latMin: 30.0, latMax: 36.0, lngMin: -10.0, lngMax: -1.0 },
];

export const getRomanProvince = (lat: number, lng: number): RomanProvince | null => {
  // Find the province with the smallest bounding box that contains the point
  // This gives priority to more specific provinces over larger ones
  let bestMatch: RomanProvince | null = null;
  let bestArea = Infinity;

  for (const prov of PROVINCES) {
    if (lat >= prov.latMin && lat <= prov.latMax && lng >= prov.lngMin && lng <= prov.lngMax) {
      const area = (prov.latMax - prov.latMin) * (prov.lngMax - prov.lngMin);
      if (area < bestArea) {
        bestArea = area;
        bestMatch = prov;
      }
    }
  }

  return bestMatch;
};

// --- MILIARIUM ---
// Rome coordinates: 41.9028° N, 12.4964° E (Milliarium Aureum in the Forum)
const ROME_LAT = 41.9028;
const ROME_LNG = 12.4964;

// Haversine formula to calculate distance in km
const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 1 Roman mile (mille passus) ≈ 1.48 km
const KM_PER_ROMAN_MILE = 1.48;

export const getDistanceToRome = (lat: number, lng: number): { km: number; romanMiles: number } => {
  const km = haversineKm(lat, lng, ROME_LAT, ROME_LNG);
  return {
    km: Math.round(km),
    romanMiles: Math.round(km / KM_PER_ROMAN_MILE),
  };
};

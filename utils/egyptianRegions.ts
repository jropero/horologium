// egyptianRegions.ts — Egyptian Nomes/Regions with bounding boxes + iteru distance

export interface EgyptianRegion {
  name: string;
  nameEs: string;
  desc: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

const REGIONS: EgyptianRegion[] = [
  // Delta / Bajo Egipto (Ta-Mehu)
  { 
    name: "𓐝𓂝𓎛𓏏𓇶 Ta-Mehu", 
    nameEs: "Bajo Egipto (Delta)", 
    desc: "La tierra del papiro y el Delta del Nilo, donde el río se abre en siete brazos hacia el Gran Verde.", 
    latMin: 30.0, latMax: 31.5, lngMin: 29.5, lngMax: 32.5 
  },
  { 
    name: "𓉺𓏌𓊖 Iwnw", 
    nameEs: "Heliópolis", 
    desc: "La Ciudad del Sol, centro del culto a Ra y Atum. El lugar donde surgió el Benben original.", 
    latMin: 30.05, latMax: 30.2, lngMin: 31.2, lngMax: 31.4 
  },
  { 
    name: "𓏠𓈖𓈖𓄿𓆑𓂋𓊖 Men-nefer", 
    nameEs: "Menfis", 
    desc: "El Muro Blanco, capital del Reino Antiguo y sede del dios Ptah.", 
    latMin: 29.7, latMax: 30.0, lngMin: 31.1, lngMax: 31.3 
  },
  { 
    name: "𓂋𓏤𓈎𓂧𓏏𓊖 Rakotis", 
    nameEs: "Alejandría", 
    desc: "La gran metrópolis del Mediterráneo, donde el conocimiento de Grecia se une a la magia de Egipto.", 
    latMin: 31.1, latMax: 31.3, lngMin: 29.8, lngMax: 30.1 
  },

  // Egipto Medio
  { 
    name: "𓆼𓏠𓈖𓅱𓊖 Khemenu", 
    nameEs: "Hermópolis", 
    desc: "La ciudad de los ocho dioses (Ogdoada) y hogar sagrado de Thoth.", 
    latMin: 27.6, latMax: 28.2, lngMin: 30.7, lngMax: 31.0 
  },
  { 
    name: "𓈅𓐍𓏏𓄿𓏏𓈖𓊖 Akhetaten", 
    nameEs: "Amarna", 
    desc: "El Horizonte de Atón, la ciudad efímera del faraón Akenatón.", 
    latMin: 27.5, latMax: 27.7, lngMin: 30.8, lngMax: 31.0 
  },

  // Alto Egipto (Ta-Shemau)
  { 
    name: "𓈙𓐝𓂝𓇶 Ta-Shemau", 
    nameEs: "Alto Egipto", 
    desc: "La tierra del loto, el valle estrecho del Nilo flanqueado por desiertos dorados.", 
    latMin: 22.0, latMax: 30.0, lngMin: 28.0, lngMax: 34.0 
  },
  { 
    name: "𓊖𓏏𓏤 Waset", 
    nameEs: "Tebas", 
    desc: "La ciudad de las cien puertas, capital del Reino Nuevo y dominio de Amón-Ra.", 
    latMin: 25.6, latMax: 25.8, lngMin: 32.5, lngMax: 32.7 
  },
  { 
    name: "𓎛𓏏𓊹𓈖𓏏𓂋𓊖 Abdju", 
    nameEs: "Abidós", 
    desc: "El lugar sagrado de Osiris, donde se encuentra la tumba de los primeros reyes.", 
    latMin: 26.1, latMax: 26.3, lngMin: 31.8, lngMax: 32.0 
  },
  { 
    name: "𓍋𓃀𓅱𓊖 Abu", 
    nameEs: "Elefantina", 
    desc: "La isla de los elefantes en la primera catarata, guardiana de las fuentes del Nilo.", 
    latMin: 24.0, latMax: 24.2, lngMin: 32.8, lngMax: 33.0 
  },
];

export const getEgyptianRegion = (lat: number, lng: number): EgyptianRegion | null => {
  let bestMatch: EgyptianRegion | null = null;
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

// Heliopolis (Iwnw) coordinates: 30.13, 31.30
const HELIOPOLIS_LAT = 30.13;
const HELIOPOLIS_LNG = 31.30;

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

// 1 Egyptian Iteru ≈ 10.5 km
const KM_PER_ITERU = 10.5;

export const getDistanceToHeliopolis = (lat: number, lng: number): { km: number; iteru: number } => {
  const km = haversineKm(lat, lng, HELIOPOLIS_LAT, HELIOPOLIS_LNG);
  return {
    km: Math.round(km),
    iteru: Number((km / KM_PER_ITERU).toFixed(1)),
  };
};

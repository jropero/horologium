// Roman provinces. Until the map has been opened once, lookups use the coarse
// bounding boxes below; after that, point-in-polygon against the real province
// boundaries of the klokantech/roman-empire dataset (fetched at runtime, never
// bundled) — see loadRomanMapData().

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

type ProvinceMeta = Pick<RomanProvince, 'name' | 'nameEs' | 'desc'>;
const metaOf = (name: string): ProvinceMeta => {
  const p = PROVINCES.find(x => x.name === name)!;
  return { name: p.name, nameEs: p.nameEs, desc: p.desc };
};

// Metadata for every `name` in provinces.geojson (Trajanic empire, AD 117).
// Names already covered above reuse those entries under their full Latin name.
const GEO_PROVINCE_META: Record<string, ProvinceMeta> = {
  'Britannia': metaOf('Britannia'),
  'Lugdunensis': metaOf('Gallia Lugdunensis'),
  'Belgica': metaOf('Gallia Belgica'),
  'Aquitania': metaOf('Gallia Aquitania'),
  'Narbonensis': metaOf('Gallia Narbonensis'),
  'Germania Inferior': metaOf('Germania Inferior'),
  'Germania Superior': metaOf('Germania Superior'),
  'Tarraconensis': metaOf('Hispania Tarraconensis'),
  'Baetica': metaOf('Hispania Baetica'),
  'Lusitania': metaOf('Lusitania'),
  'Raetia': metaOf('Raetia'),
  'Noricum': metaOf('Noricum'),
  'Dalmatia': metaOf('Dalmatia'),
  'Macedonia': metaOf('Macedonia'),
  'Achaia': metaOf('Achaea'),
  'Asia': metaOf('Asia'),
  'Africa Proconsularis': metaOf('Africa Proconsularis'),
  'Aegyptus': metaOf('Aegyptus'),
  'Syria': metaOf('Syria'),
  'Mauretania Tingitana': metaOf('Mauretania Tingitana'),

  'Alpes Graiae et Poeninae': { name: 'Alpes Graiae et Poeninae', nameEs: 'Alpes Grayos y Peninos', desc: 'Pequeña provincia alpina que guardaba los pasos del Gran y el Pequeño San Bernardo.' },
  'Alpes Cottiae': { name: 'Alpes Cottiae', nameEs: 'Alpes Cotios', desc: 'Antiguo reino del rey Cotio, aliado de Augusto, con capital en Segusio.' },
  'Alpes Maritimae': { name: 'Alpes Maritimae', nameEs: 'Alpes Marítimos', desc: 'Provincia alpina junto al mar, con capital en Cemenelum.' },
  'Sicilia': { name: 'Sicilia', nameEs: 'Sicilia', desc: 'La primera provincia de Roma, ganada a Cartago en la Primera Guerra Púnica.' },
  'Sardinia et Corsica': { name: 'Sardinia et Corsica', nameEs: 'Cerdeña y Córcega', desc: 'Islas del mar Tirreno, fuente de grano y de metales para la Urbs.' },
  'Pannonia Superior': { name: 'Pannonia Superior', nameEs: 'Panonia Superior', desc: 'Provincia danubiana con capital en Carnuntum, bastión frente a los marcomanos.' },
  'Pannonia Inferior': { name: 'Pannonia Inferior', nameEs: 'Panonia Inferior', desc: 'Provincia del Danubio medio con capital en Aquincum.' },
  'Moesia Superior': { name: 'Moesia Superior', nameEs: 'Mesia Superior', desc: 'Provincia del Danubio con capital en Viminacium, rica en minas de plata.' },
  'Moesia Inferior': { name: 'Moesia Inferior', nameEs: 'Mesia Inferior', desc: 'Provincia del bajo Danubio hasta el mar Negro, con capital en Tomis.' },
  'Dacia': { name: 'Dacia', nameEs: 'Dacia', desc: 'Conquistada por Trajano a Decébalo, famosa por sus minas de oro.' },
  'Thracia': { name: 'Thracia', nameEs: 'Tracia', desc: 'Antiguo reino cliente, provincia desde Claudio, con capital en Perinthus.' },
  'Bithynia et Pontus': { name: 'Bithynia et Pontus', nameEs: 'Bitinia y Ponto', desc: 'Provincia del mar Negro que gobernó Plinio el Joven, con capital en Nicomedia.' },
  'Galatia et Cappadocia': { name: 'Galatia et Cappadocia', nameEs: 'Galacia y Capadocia', desc: 'Amplio territorio de Anatolia central, con capital en Ancyra.' },
  'Lycia et Pamphylia': { name: 'Lycia et Pamphylia', nameEs: 'Licia y Panfilia', desc: 'Costa montañosa del sur de Anatolia, tierra de antiguas ligas de ciudades.' },
  'Cilicia': { name: 'Cilicia', nameEs: 'Cilicia', desc: 'Antiguo nido de piratas que Pompeyo limpió, con capital en Tarsus.' },
  'Cyprus': { name: 'Cyprus', nameEs: 'Chipre', desc: 'Isla del cobre, provincia senatorial con capital en Paphos.' },
  'Creta et Cyrene': { name: 'Creta et Cyrene', nameEs: 'Creta y Cirenaica', desc: 'Provincia doble que unía la isla de Creta con la Cirenaica africana, con capital en Gortyn.' },
  'Iudaea': { name: 'Iudaea', nameEs: 'Judea', desc: 'Provincia oriental, gobernada desde Caesarea Maritima.' },
  'Arabia': { name: 'Arabia', nameEs: 'Arabia Pétrea', desc: 'Antiguo reino nabateo anexionado por Trajano, con capital en Bostra.' },
  'Armenia Mesopotamia': { name: 'Armenia et Mesopotamia', nameEs: 'Armenia y Mesopotamia', desc: 'Efímeras conquistas de Trajano en Oriente, abandonadas por Adriano en el 117.' },
  'Numidia': { name: 'Numidia', nameEs: 'Numidia', desc: 'Tierra de jinetes y de la Legio III Augusta, acampada en Lambaesis.' },
  'Mauretania Caesariensis': { name: 'Mauretania Caesariensis', nameEs: 'Mauritania Cesariense', desc: 'Provincia norteafricana con capital en Iol Caesarea.' },
};

const ITALIA = metaOf('Italia');

/** Province names in the GeoJSON that are Roman numerals are the Augustan regions of Italia. */
const isItalianRegio = (geoName: string) => /^[IVX]+$/.test(geoName);

/** Display metadata for a provinces.geojson `name` ("I"–"XI" → "Italia (Regio I)"). */
export const getProvinceMeta = (geoName: string): ProvinceMeta => {
  if (isItalianRegio(geoName)) return { ...ITALIA, name: `Italia (Regio ${geoName})` };
  return GEO_PROVINCE_META[geoName] ?? { name: geoName, nameEs: geoName, desc: '' };
};

// --- GEOJSON DATA (fetched at runtime, cached per session) ---

const DATA_BASE = 'https://raw.githubusercontent.com/klokantech/roman-empire/master/data/';

type Position = [number, number];
interface Feature<G, P> { type: 'Feature'; properties: P; geometry: G }
export interface FeatureCollection<G, P> { type: 'FeatureCollection'; features: Feature<G, P>[] }

export type ProvincesGeoJSON = FeatureCollection<{ type: 'MultiPolygon'; coordinates: Position[][][] }, { name: string }>;
export type ProvinceLabelsGeoJSON = FeatureCollection<{ type: 'Point'; coordinates: Position }, { name: string }>;
export type PlacesGeoJSON = FeatureCollection<
  { type: 'Point'; coordinates: Position },
  { latin: string | null; modern: string; type: string; accuracy: number; startyear: number; endyear: number }
>;
export type RiversGeoJSON = FeatureCollection<{ type: 'MultiLineString'; coordinates: Position[][] }, Record<string, unknown>>;
export type LakesGeoJSON = FeatureCollection<{ type: 'Polygon'; coordinates: Position[][] }, Record<string, unknown>>;
export type FortificationsGeoJSON = FeatureCollection<{ type: 'LineString'; coordinates: Position[] }, Record<string, unknown>>;

export interface RomanMapData {
  provinces: ProvincesGeoJSON;
  labels: ProvinceLabelsGeoJSON;
  places: PlacesGeoJSON;
  rivers: RiversGeoJSON;
  lakes: LakesGeoJSON;
  fortifications: FortificationsGeoJSON;
}

let provincesCache: ProvincesGeoJSON | null = null;
let labelsCache: ProvinceLabelsGeoJSON | null = null;
let placesCache: PlacesGeoJSON | null = null;
let riversCache: RiversGeoJSON | null = null;
let lakesCache: LakesGeoJSON | null = null;
let fortificationsCache: FortificationsGeoJSON | null = null;
let pending: Promise<RomanMapData> | null = null;

const fetchJson = async <T,>(file: string): Promise<T> => {
  const res = await fetch(DATA_BASE + file);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
};

/** Fetches all map layers in parallel on first call; later calls resolve from the module cache. */
export const loadRomanMapData = (): Promise<RomanMapData> => {
  if (provincesCache && labelsCache && placesCache && riversCache && lakesCache && fortificationsCache) {
    return Promise.resolve({
      provinces: provincesCache, labels: labelsCache, places: placesCache,
      rivers: riversCache, lakes: lakesCache, fortifications: fortificationsCache,
    });
  }
  if (pending) return pending;
  pending = Promise.all([
    provincesCache ?? fetchJson<ProvincesGeoJSON>('provinces.geojson'),
    labelsCache ?? fetchJson<ProvinceLabelsGeoJSON>('provinces_label.geojson'),
    placesCache ?? fetchJson<PlacesGeoJSON>('places_medium.geojson'),
    riversCache ?? fetchJson<RiversGeoJSON>('10m_rivers_lake_centerlines.geojson'),
    lakesCache ?? fetchJson<LakesGeoJSON>('10m_lakes.geojson'),
    fortificationsCache ?? fetchJson<FortificationsGeoJSON>('fortifications.geojson'),
  ]).then(([provinces, labels, places, rivers, lakes, fortifications]) => {
    provincesCache = provinces;
    labelsCache = labels;
    placesCache = places;
    riversCache = rivers;
    lakesCache = lakes;
    fortificationsCache = fortifications;
    setProvinceShapes(provinces);
    return { provinces, labels, places, rivers, lakes, fortifications };
  }).finally(() => { pending = null; }); // a failed load can be retried
  return pending;
};

// --- POINT IN POLYGON ---

interface ProvinceShape {
  province: RomanProvince;
  polygons: Position[][][]; // [polygon][ring 0 = outer, 1.. = holes][point]
}

let provinceShapes: ProvinceShape[] | null = null;
let shapesVersion = 0;
const shapeListeners = new Set<() => void>();

const setProvinceShapes = (geo: ProvincesGeoJSON) => {
  provinceShapes = geo.features.map(f => {
    let latMin = Infinity, latMax = -Infinity, lngMin = Infinity, lngMax = -Infinity;
    for (const poly of f.geometry.coordinates) {
      for (const [lng, lat] of poly[0]) {
        if (lat < latMin) latMin = lat;
        if (lat > latMax) latMax = lat;
        if (lng < lngMin) lngMin = lng;
        if (lng > lngMax) lngMax = lng;
      }
    }
    return {
      province: { ...getProvinceMeta(f.properties.name), latMin, latMax, lngMin, lngMax },
      polygons: f.geometry.coordinates,
    };
  });
  shapesVersion++;
  shapeListeners.forEach(l => l());
};

/** For useSyncExternalStore: re-run province lookups once the real boundaries arrive. */
export const subscribeProvinceShapes = (listener: () => void) => {
  shapeListeners.add(listener);
  return () => { shapeListeners.delete(listener); };
};
export const getProvinceShapesVersion = () => shapesVersion;

/** Ray casting: count edge crossings of a horizontal ray from the point. */
const inRing = (lng: number, lat: number, ring: Position[]): boolean => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const inPolygon = (lng: number, lat: number, rings: Position[][]): boolean =>
  inRing(lng, lat, rings[0]) && !rings.slice(1).some(hole => inRing(lng, lat, hole));

/** Squared distance (in degrees²) from a point to a segment. */
const segDist2 = (px: number, py: number, [ax, ay]: Position, [bx, by]: Position): number => {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
  const cx = ax + t * dx - px, cy = ay + t * dy - py;
  return cx * cx + cy * cy;
};

// The dataset's coastlines are simplified, so a GPS fix on the shore can fall
// just outside every polygon; snap to the nearest province within ~25 km.
const COAST_SNAP_DEG = 0.25;

const getProvinceFromShapes = (shapes: ProvinceShape[], lat: number, lng: number): RomanProvince | null => {
  for (const { province: p, polygons } of shapes) {
    if (lat < p.latMin || lat > p.latMax || lng < p.lngMin || lng > p.lngMax) continue;
    if (polygons.some(rings => inPolygon(lng, lat, rings))) return p;
  }
  let best: RomanProvince | null = null;
  let bestD2 = COAST_SNAP_DEG * COAST_SNAP_DEG;
  for (const { province: p, polygons } of shapes) {
    if (lat < p.latMin - COAST_SNAP_DEG || lat > p.latMax + COAST_SNAP_DEG ||
        lng < p.lngMin - COAST_SNAP_DEG || lng > p.lngMax + COAST_SNAP_DEG) continue;
    for (const rings of polygons) {
      const ring = rings[0];
      for (let i = 1; i < ring.length; i++) {
        const d2 = segDist2(lng, lat, ring[i - 1], ring[i]);
        if (d2 < bestD2) { bestD2 = d2; best = p; }
      }
    }
  }
  return best;
};

export const getRomanProvince = (lat: number, lng: number): RomanProvince | null => {
  if (provinceShapes) return getProvinceFromShapes(provinceShapes, lat, lng);

  // Fallback before the boundaries are loaded: the province with the smallest
  // bounding box that contains the point (more specific beats larger).
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

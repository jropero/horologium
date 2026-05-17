// egyptianCalendarData.ts — Metadatos epigráficos y cronológicos del calendario egipcio
// Basado estrictamente en "The Reconstructed Chronology of the Egyptian Kings" (M.C. Tetley).

export interface EgyptianMonthDeity {
  monthName: string;
  deity: string;
  deityHieroglyphic: string;
  description: string;
  domain: string;
}

export interface EpagomenalDayInfo {
  dayNumber: number;
  deity: string;
  celebration: string;
  description: string;
  domain: string;
}

export interface EgyptianFestivalInfo {
  festivalName: string;
  deity: string;
  description: string;
  isMajor: boolean;
}

// Deidades patronas y nombres de los 12 meses (Basado en la Tabla 6.1 y 6.4 de Tetley, Clepsidra de Karnak y Ramesseum)
const MONTH_DEITIES: EgyptianMonthDeity[] = [
  { monthName: 'Thoth (Tekhy)', deity: 'Thoth', deityHieroglyphic: '𓅝𓏏𓏭', description: 'Originalmente llamado Tekhy en el Imperio Nuevo. Primer mes en el calendario del Bajo Egipto.', domain: 'Sabiduría y Medición del Tiempo' },
  { monthName: 'Phaophi (Menkhet)', deity: 'Ptah', deityHieroglyphic: '𓁰', description: 'Originalmente Menkhet. En la Clepsidra de Karnak y el Ramesseum está representado por el dios creador Ptah.', domain: 'Artesanía y Creación' },
  { monthName: 'Hathor', deity: 'Hathor', deityHieroglyphic: '𓉡', description: 'Diosa del amor y la alegría. Da nombre al tercer mes de la Inundación (Akhet).', domain: 'Festividad y Amor' },
  { monthName: 'Choiak (Ka-her-ka)', deity: 'Sekhmet', deityHieroglyphic: '𓁐', description: 'Originalmente Ka-her-ka ("Ka sobre Ka"). Representado en las listas astronómicas por la diosa leona Sekhmet.', domain: 'Poder y Protección' },
  { monthName: 'Tybi (Shef-bedet)', deity: 'Min', deityHieroglyphic: '𓋉', description: 'Originalmente Shef-bedet ("La hinchazón del farro"). Representado por el dios de la fertilidad Min.', domain: 'Fertilidad Agrícola' },
  { monthName: 'Mechir (Rokeh-wer)', deity: 'Rokeh-wer', deityHieroglyphic: '𓂋𓎡𓍢𓅨', description: 'Llamado "La Gran Quema". Mes asociado a rituales de fuego para repeler el caos.', domain: 'Fuego y Purificación' },
  { monthName: 'Phamenoth (Rokeh-nedjes)', deity: 'Rokeh-nedjes', deityHieroglyphic: '𓂋𓎡𓍢𓈖𓆓𓋴', description: 'Llamado "La Pequeña Quema". Continúa los rituales de fuego del mes anterior.', domain: 'Fuego Protector' },
  { monthName: 'Pharmouthi (Renenutet)', deity: 'Renenutet', deityHieroglyphic: '𓂋𓈖𓈖𓏏', description: 'Diosa serpiente de la cosecha. Primer mes de la estación de Shemu (Cosecha).', domain: 'Cosechas y Graneros' },
  { monthName: 'Pachons (Khonsu)', deity: 'Khonsu', deityHieroglyphic: '𓐍𓈖𓊽𓅱', description: 'Dios lunar. Segundo mes de la Cosecha.', domain: 'Luna y Viaje Celestial' },
  { monthName: 'Payni (Khenty-khety)', deity: 'Khenty-khety', deityHieroglyphic: '𓏃𓏏𓍈𓏏𓏭', description: 'Originalmente Khenty-khety, luego renombrado Payni (p-n-int) en honor a la "Fiesta del Valle".', domain: 'Ancestros y Festividad' },
  { monthName: 'Epiphi (Ipet-hemet)', deity: 'Ipet', deityHieroglyphic: '𓇋𓊪𓏏', description: 'Diosa hipopótamo. Sus festivales dominaban el final de la estación de cosecha.', domain: 'Maternidad y Renacimiento' },
  { monthName: 'Mesore (Re-Horakhty)', deity: 'Re-Horakhty', deityHieroglyphic: '𓇳𓅃𓈌𓏏𓏭', description: 'Re-Horus de los Dos Horizontes. Compartía posición con "Wep Renpet" en el Alto Egipto. Más tarde dio origen a Mesore ("Nacimiento de Re").', domain: 'Solsticio y Sol' },
];

// Días epagómenos (Heriu Renpet) - Tetley Pág. 48-49
const EPAGOMENAL_DAYS: EpagomenalDayInfo[] = [
  { dayNumber: 1, deity: 'Osiris', celebration: 'Nacimiento de Osiris', description: 'Señor del inframundo. Primer día de los 5 añadidos para completar el ciclo solar de 365 días.', domain: 'Resurrección' },
  { dayNumber: 2, deity: 'Horus', celebration: 'Nacimiento de Horus (Haroeris)', description: 'Dios halcón. Segundo día epagómeno.', domain: 'Realeza Celestial' },
  { dayNumber: 3, deity: 'Seth', celebration: 'Nacimiento de Seth', description: 'Dios del caos. Tercer día epagómeno.', domain: 'Desierto y Caos' },
  { dayNumber: 4, deity: 'Isis', celebration: 'Nacimiento de Isis', description: 'Diosa de la magia. Cuarto día epagómeno.', domain: 'Magia y Maternidad' },
  { dayNumber: 5, deity: 'Neftis', celebration: 'Nacimiento de Neftis', description: 'Hermana de Isis. Quinto día epagómeno, precediendo inmediatamente al Año Nuevo.', domain: 'Protección Funeraria' },
];

// --- Funciones exportadas ---

export const getEgyptianMonthDeity = (monthIndex: number): EgyptianMonthDeity => {
  if (monthIndex < 0 || monthIndex > 11) {
    return { monthName: 'Epagómenos', deity: 'Los Cinco Dioses', deityHieroglyphic: '𓊵𓏏𓊪𓅱', description: 'Días transicionales fuera de los meses regulares.', domain: 'Transición Cósmica' };
  }
  return MONTH_DEITIES[monthIndex];
};

export const getEpagomenalDayInfo = (epagomenalDayNumber: number): EpagomenalDayInfo | null => {
  if (epagomenalDayNumber === 6) {
    return { dayNumber: 6, deity: 'Ninguna (Decreto Ptolemaico)', celebration: 'Día Intercalar de Canopus', description: 'Día bisiesto introducido por Ptolomeo III (238 a.C.) y consolidado por Augusto (25 a.C.) para ajustar el calendario civil al año solar.', domain: 'Ajuste Astronómico' };
  }
  if (epagomenalDayNumber < 1 || epagomenalDayNumber > 5) return null;
  return EPAGOMENAL_DAYS[epagomenalDayNumber - 1];
};

// Festivales cronológicos ancla extraídos de los Capítulos 4, 8, 12, 13 y 31.
export const EGYPTIAN_FESTIVALS: Record<string, EgyptianFestivalInfo> = {
  "0-1": { festivalName: "Wep Renpet / Nacimiento de Re", deity: "Re-Horakhty", description: "Día de Año Nuevo. Usado frecuentemente para datar la apertura de los registros cronológicos y los nacimientos divinos.", isMajor: true },
  "0-18": { festivalName: "Festividad Fija de Wagy", deity: "Osiris", description: "Celebración mortuoria fija (a diferencia del Wagy móvil lunar). Clave en los papiros de Illahun (Din. 12).", isMajor: true },
  "1-15": { festivalName: "Inicio de la Fiesta de Opet", deity: "Amón-Ra", description: "Atestiguado bajo Thutmose III. El dios Amón viaja a Lúxor. Posteriormente movido al día 19 bajo Ramsés II.", isMajor: true },
  "3-1": { festivalName: "Fiesta de Hathor / Inicio de Khoiak", deity: "Hathor / Sokar", description: "En algunas listas (como las de cantantes de Illahun), el mes de Hathor iniciaba aquí, coincidiendo con los ritos de Khoiak.", isMajor: true },
  "4-1": { festivalName: "Fiesta de Neheb-Kau (Ka-her-ka)", deity: "Neheb-Kau", description: "Conmemora la ascensión y unificación del Ka real, abriendo la estación de Peret.", isMajor: true },
  "5-1": { festivalName: "Navegación de Anubis", deity: "Anubis", description: "Atestiguado en Medinet Habu (Lista 59). Procesión del señor de la necrópolis.", isMajor: false },
  "5-29": { festivalName: "Levantamiento del Cielo", deity: "Ptah", description: "Inicia la festividad de Ptah-al-sur-de-su-muro. Culmina a principios del siguiente mes.", isMajor: true },
  "6-1": { festivalName: "Gran Quema (Rokeh Wer)", deity: "Rokeh-wer", description: "Primer mes del año agrícola solar tras el orto helíaco en el Reino Medio.", isMajor: true },
  "7-1": { festivalName: "Pequeña Quema (Rokeh Nedjes)", deity: "Rokeh-nedjes", description: "Continúa los rituales apotropaicos de fuego iniciados en Rokeh Wer.", isMajor: false },
  "8-1": { festivalName: "Fiesta de Renenutet", deity: "Renenutet", description: "Abre la estación de Shemu (Cosecha). Registrado en las tumbas de Khaemhet y Neferhotep.", isMajor: true },
  "8-11": { festivalName: "Procesión de Min a la Terraza", deity: "Min", description: "Sincronizado frecuentemente con la luna nueva o la mañana posterior. Atestiguado en Medinet Habu.", isMajor: true },
  "9-25": { festivalName: "Hermosa Fiesta del Valle (Cruce del Río)", deity: "Amón-Ra", description: "Amón visita los templos funerarios de Occidente. Registrado bajo Seti II.", isMajor: true },
  "10-28": { festivalName: "Inicio de la Fiesta de Epiphi", deity: "Amón / Ipet", description: "Aparición de Amón-Ra; el festival cruzaba la barrera del mes extendiéndose a los primeros días de IV Shemu.", isMajor: true },
  "11-9": { festivalName: "Unión con el Disco Solar", deity: "Re-Horakhty", description: "Ceremonia ptolemaica documentada en el Templo de Esna.", isMajor: false },
  "11-24": { festivalName: "Fiesta de Ptah-al-sur-de-su-muro", deity: "Ptah", description: "Documentado en un grafito del año 34 de Ramsés II. Coincidió con una luna llena.", isMajor: true }
};

export const getEgyptianFestivalInfo = (monthIndex: number, dayOfMonth: number): EgyptianFestivalInfo | null => {
  const key = `${monthIndex}-${dayOfMonth}`;
  return EGYPTIAN_FESTIVALS[key] || null;
};
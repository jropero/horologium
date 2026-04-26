// egyptianCalendarData.ts — Metadatos mitológicos del calendario alejandrino

export interface EgyptianMonthDeity {
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

// Deidades patronas de los 12 meses
const MONTH_DEITIES: EgyptianMonthDeity[] = [
  { deity: 'Thoth', deityHieroglyphic: '𓅝𓏏𓏭', description: 'Dios de la sabiduría, la escritura y la luna. Inventor de los jeroglíficos y patrón de los escribas.', domain: 'Sabiduría y Escritura' },
  { deity: 'Ptah', deityHieroglyphic: '𓁰', description: 'Dios creador de Menfis. Artesano divino que creó el mundo mediante el pensamiento y la palabra.', domain: 'Creación y Artesanía' },
  { deity: 'Hathor', deityHieroglyphic: '𓉡', description: 'Diosa del amor, la belleza, la música y la maternidad. El mes Athyr lleva su nombre.', domain: 'Amor y Belleza' },
  { deity: 'Osiris', deityHieroglyphic: '𓁹𓊨𓏏', description: 'Dios de los muertos y la resurrección. En Choiak se celebraban los Misterios de Osiris.', domain: 'Muerte y Resurrección' },
  { deity: 'Horus', deityHieroglyphic: '𓅃', description: 'Dios del cielo con cabeza de halcón. Hijo de Osiris e Isis, vengador de su padre.', domain: 'Cielo y Realeza' },
  { deity: 'Sekhmet', deityHieroglyphic: '𓁐', description: 'Diosa leona de la guerra y la curación. "La Poderosa". Protectora contra las plagas.', domain: 'Guerra y Curación' },
  { deity: 'Amón-Ra', deityHieroglyphic: '𓇋𓏠𓈖𓇳', description: 'Rey de los dioses. Fusión de Amón (el oculto) y Ra (el sol). Patrón de Tebas.', domain: 'Sol y Soberanía' },
  { deity: 'Renenutet', deityHieroglyphic: '𓂋𓈖𓈖𓏏', description: 'Diosa serpiente de las cosechas y la abundancia. Protectora de los graneros.', domain: 'Cosechas y Abundancia' },
  { deity: 'Khonsu', deityHieroglyphic: '𓐍𓈖𓊽𓅱', description: 'Dios lunar, hijo de Amón y Mut. "El Viajero" que cruza el cielo nocturno.', domain: 'Luna y Sanación' },
  { deity: 'Khnum', deityHieroglyphic: '𓐍𓈖𓅓', description: 'Dios carnero, alfarero divino que moldeaba a los seres humanos en su torno. Guardián de las fuentes del Nilo.', domain: 'Creación y el Nilo' },
  { deity: 'Ra', deityHieroglyphic: '𓇳𓏤', description: 'Dios del sol. Viajaba por el cielo en su barca solar y cada noche atravesaba el inframundo.', domain: 'Sol y Renacimiento' },
  { deity: 'Isis', deityHieroglyphic: '𓊨𓏏𓆇', description: 'Diosa de la magia, la maternidad y la sabiduría. "La Gran Maga" que reconstruyó el cuerpo de Osiris.', domain: 'Magia y Maternidad' },
];

// Días epagómenos: nacimientos de los hijos de Nut
const EPAGOMENAL_DAYS: EpagomenalDayInfo[] = [
  { dayNumber: 1, deity: 'Osiris', celebration: 'Nacimiento de Osiris', description: 'Primer hijo de Nut y Geb. Nació como rey legítimo y civilizador de Egipto.', domain: 'Muerte, Resurrección y Fertilidad' },
  { dayNumber: 2, deity: 'Horus (Haroeris)', celebration: 'Nacimiento de Horus el Viejo', description: 'Horus el Viejo (Haroeris), hermano de Osiris. Su ojo derecho es el sol y el izquierdo la luna.', domain: 'Cielo y Protección' },
  { dayNumber: 3, deity: 'Seth', celebration: 'Nacimiento de Seth', description: 'Dios del caos y las tormentas. Nació desgarrando el costado de su madre Nut. Día nefasto.', domain: 'Caos, Tormentas y Desierto' },
  { dayNumber: 4, deity: 'Isis', celebration: 'Nacimiento de Isis', description: 'La Gran Maga, nacida en los pantanos del Delta del Nilo. Trajo la sabiduría y la magia al mundo.', domain: 'Magia, Sabiduría y Maternidad' },
  { dayNumber: 5, deity: 'Neftis', celebration: 'Nacimiento de Neftis', description: 'Señora de la Casa (Nebet-Het). Hermana de Isis y guía de las almas en el inframundo.', domain: 'Protección de los Muertos' },
];

// --- Funciones exportadas ---

export const getEgyptianMonthDeity = (monthIndex: number): EgyptianMonthDeity => {
  if (monthIndex < 0 || monthIndex > 11) {
    return { deity: 'Nut', deityHieroglyphic: '𓈖𓅱𓏏', description: 'Diosa del cielo estrellado. Madre de Osiris, Isis, Seth, Neftis y Horus el Viejo.', domain: 'Cielo y Estrellas' };
  }
  return MONTH_DEITIES[monthIndex];
};

export const getEpagomenalDayInfo = (epagomenalDayNumber: number): EpagomenalDayInfo | null => {
  if (epagomenalDayNumber === 6) {
    return { dayNumber: 6, deity: 'Thoth', celebration: 'Día adicional de Thoth', description: 'Día extra concedido por la victoria de Thoth sobre Khonsu. Solo aparece en años bisiestos.', domain: 'Sabiduría y Tiempo' };
  }
  if (epagomenalDayNumber < 1 || epagomenalDayNumber > 5) return null;
  return EPAGOMENAL_DAYS[epagomenalDayNumber - 1];
};

// Festivales principales
export const EGYPTIAN_FESTIVALS: Record<string, EgyptianFestivalInfo> = {
  "0-1":  { festivalName: "Wepet Renpet", deity: "Ra / Thoth", description: "Año Nuevo egipcio. 'La Apertura del Año'. Coincidía con la crecida del Nilo y la aparición helíaca de Sirio.", isMajor: true },
  "0-19": { festivalName: "Fiesta de Thoth", deity: "Thoth", description: "Gran festival en honor al dios de la sabiduría. Los escribas celebraban con ofrendas de tinta y papiro.", isMajor: true },
  "2-17": { festivalName: "Lamentación de Isis", deity: "Isis y Osiris", description: "Conmemoración de la muerte de Osiris. Las sacerdotisas de Isis recorrían las calles lamentándose.", isMajor: true },
  "3-26": { festivalName: "Misterios de Osiris", deity: "Osiris", description: "Ritos sagrados que rememoraban la muerte y resurrección de Osiris.", isMajor: true },
  "3-30": { festivalName: "Erección del Pilar Djed", deity: "Osiris", description: "Ceremonia de levantar el pilar Djed, símbolo de la columna vertebral de Osiris.", isMajor: true },
  "4-1":  { festivalName: "Fiesta de la Coronación", deity: "Horus", description: "Celebración de la coronación de Horus como rey legítimo.", isMajor: true },
  "6-1":  { festivalName: "Fiesta de Amón", deity: "Amón-Ra", description: "Gran procesión de Amón desde Karnak hasta Luxor.", isMajor: true },
  "8-1":  { festivalName: "Fiesta del Valle Hermoso", deity: "Amón-Ra", description: "La estatua de Amón cruzaba el Nilo para visitar los templos funerarios de Tebas.", isMajor: true },
  "10-15": { festivalName: "Fiesta de Ra", deity: "Ra", description: "Celebración del solsticio y la máxima potencia solar.", isMajor: true },
  "11-1":  { festivalName: "Nacimiento de Ra", deity: "Ra / Isis", description: "El nombre del mes Mesore significa 'Nacimiento de Ra'. Último mes antes de los epagómenos.", isMajor: true },
};

export const getEgyptianFestivalInfo = (monthIndex: number, dayOfMonth: number): EgyptianFestivalInfo | null => {
  const key = `${monthIndex}-${dayOfMonth}`;
  return EGYPTIAN_FESTIVALS[key] || null;
};

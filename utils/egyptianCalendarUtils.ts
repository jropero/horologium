// egyptianCalendarUtils.ts — Motor del Calendario Alejandrino
// Convierte fechas gregorianas al calendario alejandrino (egipcio-ptolemaico).
//
// ══════════════════════════════════════════════════════════════════════════
// MATEMÁTICA DEL CALENDARIO ALEJANDRINO
// ══════════════════════════════════════════════════════════════════════════
//
// El calendario alejandrino consta de:
//   • 12 meses de 30 días cada uno (360 días)
//   • 5 días epagómenos (Epagomenai) al final del año
//   • 1 día epagómeno adicional (6.º) en años bisiestos
//   Total: 365 o 366 días (sincronizado con el año solar)
//
// Cada mes se divide en 3 "décadas" (semanas de 10 días):
//   Década 1: días 1-10
//   Década 2: días 11-20
//   Década 3: días 21-30
//
// PUNTO DE ANCLAJE (Época):
//   El día 1 del mes de Thoth (1er mes del año) cae normalmente
//   el 29 de agosto gregoriano. Sin embargo, en el año gregoriano
//   ANTERIOR a un año bisiesto gregoriano, Thoth 1 cae el 30 de agosto.
//
//   Regla del bisiesto alejandrino:
//   El año alejandrino que comienza en agosto del año G es bisiesto
//   si (G + 1) es bisiesto en el calendario gregoriano.
//   Es decir, el 6.º día epagómeno se añade cuando el próximo año
//   gregoriano es bisiesto, lo que mantiene la sincronización.
//
// ESTACIONES EGIPCIAS:
//   Los 12 meses se agrupan en 3 estaciones de 4 meses:
//   • Akhet (𓐍𓏏𓇋𓈗) — Inundación (meses 1-4)
//   • Peret (𓉐𓂋𓏏𓇶) — Siembra/Crecimiento (meses 5-8)
//   • Shemu (𓈙𓈗𓅓𓅱) — Cosecha (meses 9-12)
// ══════════════════════════════════════════════════════════════════════════

// --- Interfaces ---

export interface EgyptianSeason {
  name: string;
  hieroglyphic: string;
  translation: string;
  months: number[]; // Índices de mes (0-11)
}

export interface EgyptianMonth {
  name: string;
  greekName: string;
  seasonIndex: number; // 0 = Akhet, 1 = Peret, 2 = Shemu
  monthInSeason: number; // 1-4 dentro de la estación
}

export interface EgyptianDateResult {
  /** Nombre de la estación (Akhet, Peret, Shemu o Epagomenai) */
  seasonName: string;
  /** Jeroglífico de la estación */
  seasonHieroglyphic: string;
  /** Traducción de la estación al español */
  seasonTranslation: string;
  /** Nombre del mes (Thoth, Phaophi, etc.) o 'Epagomenai' */
  monthName: string;
  /** Nombre griego del mes */
  monthGreekName: string;
  /** Día del mes (1-30) o día epagómeno (1-5/6) */
  dayOfMonth: number;
  /** Día del año alejandrino (1-365 o 1-366) */
  dayOfYear: number;
  /** Década del mes (1, 2 o 3). Los egipcios usaban semanas de 10 días. */
  decade: number;
  /** Índice del mes (0-11), o -1 para los días epagómenos */
  monthIndex: number;
  /** true si estamos en los días epagómenos */
  isEpagomenal: boolean;
  /** true si el año alejandrino actual es bisiesto (6 días epagómenos) */
  isLeapYear: boolean;
  /** Año alejandrino (aproximado, basado en el año gregoriano de inicio) */
  alexandrianYear: number;
}

// --- Datos de estaciones ---

export const EGYPTIAN_SEASONS: EgyptianSeason[] = [
  {
    name: 'Akhet',
    hieroglyphic: '𓐍𓏏𓇋𓈗',
    translation: 'Inundación',
    months: [0, 1, 2, 3],
  },
  {
    name: 'Peret',
    hieroglyphic: '𓉐𓂋𓏏𓇶',
    translation: 'Siembra',
    months: [4, 5, 6, 7],
  },
  {
    name: 'Shemu',
    hieroglyphic: '𓈙𓈗𓅓𓅱',
    translation: 'Cosecha',
    months: [8, 9, 10, 11],
  },
];

// --- Datos de los 12 meses ---

export const EGYPTIAN_MONTHS: EgyptianMonth[] = [
  { name: 'Thoth',     greekName: 'Θώθ',       seasonIndex: 0, monthInSeason: 1 },
  { name: 'Phaophi',   greekName: 'Φαῶφι',     seasonIndex: 0, monthInSeason: 2 },
  { name: 'Athyr',     greekName: 'Ἁθύρ',      seasonIndex: 0, monthInSeason: 3 },
  { name: 'Choiak',    greekName: 'Χοίακ',     seasonIndex: 0, monthInSeason: 4 },
  { name: 'Tybi',      greekName: 'Τῦβι',      seasonIndex: 1, monthInSeason: 1 },
  { name: 'Mechir',    greekName: 'Μεχίρ',     seasonIndex: 1, monthInSeason: 2 },
  { name: 'Phamenoth', greekName: 'Φαμενώθ',   seasonIndex: 1, monthInSeason: 3 },
  { name: 'Pharmuthi', greekName: 'Φαρμουθί',  seasonIndex: 1, monthInSeason: 4 },
  { name: 'Pachon',    greekName: 'Παχών',      seasonIndex: 2, monthInSeason: 1 },
  { name: 'Payni',     greekName: 'Παϋνί',     seasonIndex: 2, monthInSeason: 2 },
  { name: 'Epiphi',    greekName: 'Ἐπιφί',     seasonIndex: 2, monthInSeason: 3 },
  { name: 'Mesore',    greekName: 'Μεσορή',    seasonIndex: 2, monthInSeason: 4 },
];

// --- Funciones auxiliares ---

/**
 * Determina si un año gregoriano es bisiesto.
 * Regla: divisible por 4, excepto los siglos que no sean divisibles por 400.
 */
const isGregorianLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Calcula la fecha gregoriana de Thoth 1 para el año alejandrino
 * que comienza en el año gregoriano dado.
 *
 * Regla:
 *   - Si (gregorianYear + 1) es bisiesto → Thoth 1 = 30 de agosto
 *   - En caso contrario → Thoth 1 = 29 de agosto
 *
 * Esto se debe a que el día epagómeno adicional del año alejandrino
 * ANTERIOR desplaza Thoth 1 un día hacia adelante.
 */
const getThoth1 = (gregorianYear: number): Date => {
  const nextYearIsLeap = isGregorianLeapYear(gregorianYear + 1);
  // Si el próximo año gregoriano es bisiesto, el año alejandrino que ACABA
  // de terminar tuvo 6 epagómenos, lo que empuja Thoth 1 al 30 de agosto.
  const day = nextYearIsLeap ? 30 : 29;
  return new Date(gregorianYear, 7, day); // Mes 7 = Agosto (0-indexed)
};

/**
 * Determina si el año alejandrino que comienza en el año gregoriano dado
 * es bisiesto (tiene 6 días epagómenos en lugar de 5).
 *
 * El año alejandrino es bisiesto si el SIGUIENTE año gregoriano es bisiesto.
 * Esto mantiene la sincronización: el 6.º epagómeno se inserta justo
 * antes de que el año gregoriano bisiesto añada su 29 de febrero.
 */
const isAlexandrianLeapYear = (gregorianStartYear: number): boolean => {
  return isGregorianLeapYear(gregorianStartYear + 1);
};

// --- Función principal de conversión ---

/**
 * Convierte una fecha gregoriana al calendario alejandrino.
 *
 * Algoritmo:
 * 1. Determinar en qué año alejandrino cae la fecha gregoriana.
 *    El año alejandrino N comienza en agosto del año gregoriano N.
 *    Si la fecha es anterior a Thoth 1 del año actual, pertenece
 *    al año alejandrino anterior (que comenzó en agosto del año anterior).
 *
 * 2. Calcular el día del año alejandrino (1-indexed):
 *    dayOfYear = diferencia en días entre la fecha y Thoth 1 + 1
 *
 * 3. Convertir dayOfYear a mes y día:
 *    - Si dayOfYear <= 360: mes = floor((dayOfYear - 1) / 30), día = ((dayOfYear - 1) % 30) + 1
 *    - Si dayOfYear > 360: es un día epagómeno (1-5 o 1-6)
 *
 * 4. Calcular la década (semana de 10 días):
 *    decade = ceil(dayOfMonth / 10) → valores 1, 2 o 3
 */
export const getEgyptianDate = (gregorianDate: Date): EgyptianDateResult => {
  const year = gregorianDate.getFullYear();

  // Paso 1: Determinar el año gregoriano en que comenzó el año alejandrino actual.
  // El año alejandrino comienza en agosto. Si la fecha es anterior a Thoth 1
  // de este año, entonces estamos en el año alejandrino que comenzó el año pasado.
  let startYear = year;
  let thoth1 = getThoth1(startYear);

  if (gregorianDate < thoth1) {
    // La fecha es antes de Thoth 1 de este año → pertenece al año alejandrino anterior
    startYear = year - 1;
    thoth1 = getThoth1(startYear);
  }

  // Paso 2: Calcular el día del año alejandrino (1-indexed)
  const diffMs = gregorianDate.getTime() - thoth1.getTime();
  const dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  // Determinar si este año alejandrino es bisiesto
  const leapYear = isAlexandrianLeapYear(startYear);
  const totalEpagomenal = leapYear ? 6 : 5;
  const totalDays = 360 + totalEpagomenal; // 365 o 366

  // Paso 3: Convertir dayOfYear a mes/día
  if (dayOfYear > 360 && dayOfYear <= totalDays) {
    // ═══ DÍAS EPAGÓMENOS ═══
    // Los días epagómenos son los 5 (o 6) días al final del año,
    // después del mes 12 (Mesore) y antes de Thoth 1 del año siguiente.
    const epagomenalDay = dayOfYear - 360;
    return {
      seasonName: 'Epagomenai',
      seasonHieroglyphic: '𓇳𓏤𓏤𓏤𓏤𓏤',
      seasonTranslation: 'Días sobre el año',
      monthName: 'Epagomenai',
      monthGreekName: 'Ἐπαγόμεναι',
      dayOfMonth: epagomenalDay,
      dayOfYear,
      decade: 0, // No aplica para días epagómenos
      monthIndex: -1,
      isEpagomenal: true,
      isLeapYear: leapYear,
      alexandrianYear: startYear,
    };
  }

  // ═══ MESES REGULARES (1-360) ═══
  // Cada mes tiene exactamente 30 días.
  // monthIndex = floor((dayOfYear - 1) / 30) → 0-11
  // dayOfMonth = ((dayOfYear - 1) % 30) + 1 → 1-30
  const clampedDay = Math.max(1, Math.min(dayOfYear, 360));
  const monthIndex = Math.floor((clampedDay - 1) / 30);
  const dayOfMonth = ((clampedDay - 1) % 30) + 1;

  // Paso 4: Calcular la década (semana egipcia de 10 días)
  // Década 1: días 1-10, Década 2: días 11-20, Década 3: días 21-30
  const decade = Math.ceil(dayOfMonth / 10);

  const month = EGYPTIAN_MONTHS[monthIndex];
  const season = EGYPTIAN_SEASONS[month.seasonIndex];

  return {
    seasonName: season.name,
    seasonHieroglyphic: season.hieroglyphic,
    seasonTranslation: season.translation,
    monthName: month.name,
    monthGreekName: month.greekName,
    dayOfMonth,
    dayOfYear,
    decade,
    monthIndex,
    isEpagomenal: false,
    isLeapYear: leapYear,
    alexandrianYear: startYear,
  };
};

// --- Utilidad de visualización ---

/**
 * Genera una representación legible de la fecha alejandrina.
 * Ejemplo: "15 de Thoth, Akhet (Inundación) — Década 2"
 */
export const formatEgyptianDate = (result: EgyptianDateResult): string => {
  if (result.isEpagomenal) {
    return `Día epagómeno ${result.dayOfMonth} — Epagomenai (${result.seasonTranslation})`;
  }
  return `${result.dayOfMonth} de ${result.monthName} (${result.monthGreekName}), ${result.seasonName} ${result.seasonHieroglyphic} — Década ${result.decade}`;
};

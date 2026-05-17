/**
 * egyptianFestivalsData.ts
 * Base de datos de festividades egipcias estrictamente basadas en "The Reconstructed Chronology of the Egyptian Kings" (M.C. Tetley).
 * Referencias principales: Papiros de Illahun (Dinastía 12), Calendario de Medinet Habu (Dinastía 19/20) y Papiro Ebers.
 */

export interface Festival {
  name: string;
  description: string;
  icon?: string;
}

/**
 * CIVIL_FESTIVALS: Festividades de fecha fija en el calendario civil.
 * Clave: "mes-dia" (0 = I Akhet, 11 = IV Shemu, -1 = Epagómenos).
 */
export const CIVIL_FESTIVALS: Record<string, Festival> = {
  // I Akhet (Mes 0)
  "0-1": {
    name: "Wep Renpet / Nacimiento de Re / Neheb-Kau",
    description: "I Akhet 1. Múltiples atestiguaciones: El 'Abridor del Año' (Papiro Ebers), el 'Nacimiento de Re' (Papiro Cairo 86637, Din. 20), y Neheb-Kau según diversas interpretaciones.",
    icon: "Sunrise"
  },
  "0-18": {
    name: "Festividad Fija de Wagy",
    description: "I Akhet 18. Una de las dos formas del festival Wagy. Mientras la versión móvil dependía de la luna, esta era fija en el calendario civil (Illahun pBerlin 10282).",
    icon: "Flame"
  },
  "0-19": {
    name: "Fiesta de Thoth",
    description: "I Akhet 19. El festival que daba nombre al primer mes en el calendario grecorromano, atestiguado en Medinet Habu bajo Ramsés III.",
    icon: "Feather"
  },

  // II Akhet (Mes 1)
  "1-15": {
    name: "Inicio de la Fiesta de Opet",
    description: "II Akhet 15. En la época de Thutmose III, la fiesta de Amón coincidía con Opet y comenzaba el día 15, aunque luego se movió al día 19 bajo Ramsés II.",
    icon: "Ship"
  },

  // III Akhet (Mes 2)
  "2-1": {
    name: "Fiesta de Hathor",
    description: "III Akhet 1. Según listas de festivales, Hathor daba nombre al tercer mes, celebrándose en el primer día (o desplazado a IV Akhet 1).",
    icon: "Music"
  },

  // IV Akhet (Mes 3)
  "3-1": {
    name: "Fiesta de Hathor (variante) / Khoiak",
    description: "IV Akhet 1. Atestiguado en la lista de cantantes de Illahun y Medinet Habu. También atestiguado como inicio del festival de Khoiak/Neheb-Kau.",
    icon: "Crown"
  },
  "3-4": {
    name: "Masticación de Cebollas para Bastet",
    description: "IV Akhet 4. Festividad específica listada en el Calendario de Festivales de Medinet Habu (Lista 62).",
    icon: "Eye"
  },
  "3-30": {
    name: "Levantamiento del Pilar Djed",
    description: "IV Akhet 30. Culminación del mes de Khoiak, atestiguada por Jauhiainen en su estudio de los trabajadores de Deir el-Medina.",
    icon: "MoveUp"
  },

  // I Peret (Mes 4)
  "4-1": {
    name: "Fiesta de Neheb-Kau / Khoiak",
    description: "I Peret 1. Gardiner documentó repetidamente la fiesta de Neheb-Kau este día. En el Reino Medio se celebró como 'Ka-her-ka' (Khoiak).",
    icon: "Sprout"
  },
  "4-30": {
    name: "Periplous (Navegación) de Mut",
    description: "I Peret 30. Ostracon BM 29560 y Papiro Turín 68. La diosa Mut era llevada en navegación sagrada.",
    icon: "Sailboat"
  },

  // II Peret (Mes 5)
  "5-1": {
    name: "Navegación de Anubis",
    description: "II Peret 1. Listado en el Calendario de Medinet Habu (Lista 59) como el Festival de la Navegación del dios Anubis.",
    icon: "Ship"
  },

  // III Peret (Mes 6)
  "6-1": {
    name: "Gran Quema (Rokeh Wer)",
    description: "III Peret 1. Papiro de Illahun 10069. Era el primer mes del año solar/agrícola tras el orto helíaco en el Reino Medio.",
    icon: "Flame"
  },

  // IV Peret (Mes 7)
  "7-1": {
    name: "Pequeña Quema (Rokeh Nedjes)",
    description: "IV Peret 1. Papiro de Illahun 10069 (Reino Medio). Marca el octavo mes del calendario civil de entonces.",
    icon: "Flame"
  },
  "7-25": {
    name: "Fiesta Weresh",
    description: "IV Peret 25. Atestiguada en la Gran Estela de Dakhla bajo el reinado de Shoshenq I, vinculada a una procesión del dios Seth.",
    icon: "Tent"
  },

  // I Shemu (Mes 8)
  "8-1": {
    name: "Festival de Renenutet",
    description: "I Shemu 1. Festividad de la cosecha dedicada a Renenutet. Atestiguado en las tumbas de Khaemhet y Neferhotep (Dinastía 18) y en Medinet Habu.",
    icon: "Wheat"
  },
  "8-10": {
    name: "Fiesta de Vestir a Anubis",
    description: "I Shemu 10. Documentado en el Calendario de Festivales de Medinet Habu (Lista 65).",
    icon: "Shirt"
  },
  "8-11": {
    name: "Procesión de Min a la Terraza",
    description: "I Shemu 11. Lista 66 de Medinet Habu. Vinculado a la aparición de la luna nueva en la mañana.",
    icon: "Sun"
  },

  // II Shemu (Mes 9)
  "9-25": {
    name: "Cruce del Río (Hermosa Fiesta del Valle)",
    description: "II Shemu 25. Documentado en Ostracon Cairo CG 25538 bajo Seti II. Amón cruzaba el río hacia la orilla occidental.",
    icon: "Ship"
  },

  // IV Shemu (Mes 11)
  "11-9": {
    name: "Unión con el Disco Solar",
    description: "IV Shemu 9. Ceremonia en Esna (época grecorromana) conectada teológicamente con Wep Renpet y el dios Re-Horakhty.",
    icon: "Sun"
  },
  "11-24": {
    name: "Fiesta de Ptah-al-sur-de-su-muro",
    description: "IV Shemu 24. Documentado en un grafito de Saqqara en el año 34 de Ramsés II. Borchardt y Casperson demostraron que coincidía con una luna llena.",
    icon: "Hammer"
  },

  // Días Epagómenos (Mes -1)
  "e-1": { name: "Nacimiento de Osiris", description: "Primer día epagómeno. Dedicado a Osiris (Pág. 48-49).", icon: "Crown" },
  "e-2": { name: "Nacimiento de Horus", description: "Segundo día epagómeno. Dedicado a Horus.", icon: "Bird" },
  "e-3": { name: "Nacimiento de Seth", description: "Tercer día epagómeno. Dedicado a Seth.", icon: "Flame" },
  "e-4": { name: "Nacimiento de Isis", description: "Cuarto día epagómeno. Dedicado a Isis.", icon: "Sparkles" },
  "e-5": { name: "Nacimiento de Neftis", description: "Quinto día epagómeno. Dedicado a Neftis.", icon: "Moon" }
};

/**
 * LUNAR_FESTIVALS: Festividades dependientes estrictamente del día lunar.
 * Estas fueron la clave para la datación de Tetley, Casperson, Krauss y Luft.
 */
export const LUNAR_FESTIVALS: Record<number, Festival> = {
  1: {
    name: "Mover la Arena (hnp-sc) / Pedj-Shes (Estirar la Cuerda)",
    description: "Día de Luna Nueva (Psdntyw). En los Papiros de Illahun (Sesostris III) es el día para 'Mover la Arena'. También era el día prescriptivo para 'Estirar la Cuerda' y fundar templos (ej. Thutmose III, año 24).",
    icon: "Ruler"
  },
  3: {
    name: "Festival de la Vestimenta (mnht)",
    description: "Tercer día lunar. En los Papiros de Illahun sigue sistemáticamente dos días después al festival de Mover la Arena.",
    icon: "Shirt"
  },
  4: {
    name: "Festival de la Alegría (ihhy)",
    description: "Cuarto (ocasionalmente quinto) día lunar. Atestiguado en los Papiros de Berlín 10282, 10412 y 10052 durante los reinados de Sesostris III y Amenemhet III.",
    icon: "PartyPopper"
  },
  6: {
    name: "Día del Buen Pan",
    description: "Sexto día lunar. Preparación y ofrenda de panes sagrados recién horneados para el altar divino. Atestiguado en los Papiros de Illahun.",
    icon: "Wheat"
  },
  10: {
    name: "Excursión de la Tierra (hnt-nt-t3)",
    description: "Décimo día lunar. La deidad abandonaba su santuario para inspeccionar y bendecir los campos. Atestiguado en P. Berlin 10009 y 10011 (año 16 de Sesostris III).",
    icon: "Map"
  },
  15: {
    name: "Plenilunio (Smdt)",
    description: "Día de Luna Llena. Ocasión clave para festivales mayores, incluyendo las instalaciones del Toro Apis en Memphis.",
    icon: "Circle"
  },
  18: {
    name: "Fiesta Móvil de Wagy",
    description: "Día 18 lunar. Calculado en la tercera lunación tras el orto helíaco de Sirio. Usado en Illahun (P. Berlin 10006) para fijar la cronología de las Dinastías 5 y 12.",
    icon: "Flame"
  },
  20: {
    name: "Línea de la Milla del Nilo (sspt itrw)",
    description: "Día 20 (o 19/21) lunar. Registrado en el Papiro Berlín 10130 en el año 8 de Sesostris III.",
    icon: "Waves"
  },
  22: {
    name: "Festival de la Partida/Excursión (hnt)",
    description: "Día 22 lunar. Documentado en el año 12 de Sesostris III (P. Berlin 10165) y año 8 de Amenemhet III (P. Berlin 10218).",
    icon: "Compass"
  },
  23: {
    name: "Cuarto Menguante (dnit sn-nw)",
    description: "Día 23 lunar. Rituales de protección durante la fase de oscurecimiento y debilidad de la luna. Atestiguado en Illahun y Medinet Habu.",
    icon: "Moon"
  }
};

/**
 * Recupera los festivales (civiles y lunares) para una fecha dada.
 */
export function getFestivalsForDate(monthIndex: number, dayOfMonth: number, lunarDay: number): { civilFestivals: Festival[], lunarFestivals: Festival[] } {
  const civilFestivals: Festival[] = [];
  const lunarFestivals: Festival[] = [];

  const key = monthIndex === -1 ? `e-${dayOfMonth}` : `${monthIndex}-${dayOfMonth}`;
  if (CIVIL_FESTIVALS[key]) {
    civilFestivals.push(CIVIL_FESTIVALS[key]);
  }

  // --- RANGOS ESPECIALES ATESTIGUADOS EN EL LIBRO ---

  // Mes 1 (II Akhet), Días 16 al 30 (y hasta III Akhet 12): Continuación del Festival de Opet
  // El día 15 ya tiene entrada fija en CIVIL_FESTIVALS; este rango evita duplicación.
  if ((monthIndex === 1 && dayOfMonth >= 16) || (monthIndex === 2 && dayOfMonth <= 12)) {
    civilFestivals.push({
      name: "Días del Festival de Opet",
      description: "Bajo Thutmose III comenzaba el día 15, pero bajo Ramsés II se desplazó al 19 y duraba casi un mes (hasta III Akhet 12).",
      icon: "Ship"
    });
  }

  // Mes 5 (II Peret) 29 a Mes 6 (III Peret) 1: Levantar el Cielo / Fiesta de Ptah (Medinet Habu)
  if ((monthIndex === 5 && dayOfMonth >= 29) || (monthIndex === 6 && dayOfMonth === 1)) {
    civilFestivals.push({
      name: "Fiesta de Ptah / Levantamiento del Cielo",
      description: "Festividad celebrada en días consecutivos a final de II Peret e inicio de III Peret (Listas 60 y 61 de Medinet Habu).",
      icon: "ArrowUpCircle"
    });
  }

  // Mes 10 (III Shemu) 28 a Mes 11 (IV Shemu) 2: Festival de Epiphi
  if ((monthIndex === 10 && dayOfMonth >= 28) || (monthIndex === 11 && dayOfMonth <= 2)) {
    civilFestivals.push({
      name: "Días del Festival de Epiphi",
      description: "Días libres y de procesiones atestiguados bajo Ramsés X (IV Shemu 1-2) y Ramsés XI (III Shemu 28).",
      icon: "Tent"
    });
  }

  // Mes -1 (Epagómenos): Transición
  if (monthIndex === -1 && dayOfMonth >= 1 && dayOfMonth <= 5) {
    civilFestivals.push({
      name: "Período de los Días Epagómenos (Heriu Renpet)",
      description: "Los cinco días añadidos al final del año civil de 360 días para completar el ciclo solar, previos a Wep Renpet (Pág. 48-49).",
      icon: "CalendarClock"
    });
  }

  if (LUNAR_FESTIVALS[lunarDay]) {
    lunarFestivals.push(LUNAR_FESTIVALS[lunarDay]);
  }

  return { civilFestivals, lunarFestivals };
}

export function getNextEgyptianFestivals(monthIndex: number, dayOfMonth: number, count: number = 3): (Festival & { date: string, daysRemaining: number })[] {
  const results: (Festival & { date: string, daysRemaining: number })[] = [];
  let currentMonth = monthIndex;
  let currentDay = dayOfMonth + 1;

  for (let i = 0; i < 365 && results.length < count; i++) {
    const daysFromNow = i + 1;
    if (currentMonth === -1) {
      if (currentDay > 5) {
        currentMonth = 0;
        currentDay = 1;
      }
    } else {
      if (currentDay > 30) {
        currentMonth++;
        currentDay = 1;
        if (currentMonth > 11) {
          currentMonth = -1;
        }
      }
    }

    const key = currentMonth === -1 ? `e-${currentDay}` : `${currentMonth}-${currentDay}`;
    if (CIVIL_FESTIVALS[key]) {
      const monthName = currentMonth === -1 ? "Epagomenai" : ["Thoth", "Phaophi", "Athyr", "Choiak", "Tybi", "Mechir", "Phamenoth", "Pharmuthi", "Pachon", "Payni", "Epiphi", "Mesore"][currentMonth];
      results.push({
        ...CIVIL_FESTIVALS[key],
        date: `${currentDay} de ${monthName}`,
        daysRemaining: daysFromNow
      });
    }
    currentDay++;
  }
  return results.slice(0, count);
}
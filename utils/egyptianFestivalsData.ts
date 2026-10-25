/**
 * egyptianFestivalsData.ts
 * Base de datos de festividades egipcias estrictamente basadas en "The Reconstructed Chronology of the Egyptian Kings" (M.C. Tetley).
 * Referencias principales: Papiros de Illahun (Dinastía 12), Calendario de Medinet Habu (Dinastía 19/20) y Papiro Ebers.
 */

export interface FestivalFonte {
  spell: string;    // e.g. "Capítulo CXXX"
  excerpt: string;  // Quote in Spanish
  source: string;   // Citation
}

export interface Festival {
  name: string;
  description: string;
  icon?: string;
  fonte?: FestivalFonte;
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
  "0-20": {
    name: "Fiesta de la Embriaguez de Hathor",
    description: "I Akhet 20. 'Fiesta de la Embriaguez de la Señora de Dendera' (Dendera Cal. 1 y 2). La barca de Hathor es remada; procesión de la diosa al techo del templo y unión con el disco solar. Conectada con el mito en que Hathor/Sejmet fue apaciguada con cerveza y música para detener la destrucción de la humanidad. Total: 5 días de fiesta (Bleeker p. 244). Atestiguada en el Reino Medio (papiros de Illahun) y la época ptolemaica (Dendera, Edfu).",
    icon: "Music"
  },
  "0-22": {
    name: "Gran Procesión de Osiris",
    description: "I Akhet 22. Una de las atestaciones más sólidas del mes: confirmada en el Reino Medio (papiros de Illahun) y en el Reino Nuevo (Medinet Habu, entrada 705). La estatua de Osiris era llevada en solemne procesión. Deidad principal: Osiris / Amón-Re.",
    icon: "Crown"
  },

  // II Akhet (Mes 1)
  "1-19": {
    name: "Fiesta de Opet (Inicio)",
    description: "II Akhet 19. Primera jornada del gran festival de Amón en Opet, según el Calendario de Festividades de Medinet Habu bajo Ramsés III (Lista 29, entrada 743). Los tres barcos divinos de Amón, Mut y Jonsu procesionan desde Karnak hasta el templo de Luxor. Duración: 24 días (hasta III Akhet 12) bajo Ramsés III; 11 días bajo Tutmosis III. En el santuario interior de Luxor se renovaba la legitimidad divina del faraón. Bleeker interpreta el rito central como un posible *hieros gamos* entre Amón y su harén divino (p. 187). La víspera del festival (II Akhet 18) está atestiguada en MH 725.",
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
  "3-20": {
    name: "Purificación de la Enéada (Inicio del Ciclo de Sokar)",
    description: "IV Akhet 20. Inicio del ciclo de 10 días de Sokar. 'Purificación de la Enéada' (Medinet Habu, entrada 932). Deidad principal: Ptah-Sokar-Osiris con su Enéada. Fuente: El-Sabban (2000), Ch. 5; Bleeker (1967), p. 70.",
    icon: "Droplets"
  },
  "3-21": {
    name: "Apertura de la Ventana del Santuario de Sokar",
    description: "IV Akhet 21. Día de la apertura de la ventana en el santuario de Sokar. Primer rito formal del ciclo de 10 días que culmina con el levantamiento del pilar Djed. Fuente: Calendario de Festividades de Ramsés III, Medinet Habu (JEOL 7, pp. 336–337); Bleeker (1967).",
    icon: "Eye"
  },
  "3-22": {
    name: "Rotura de la Tierra (ḫbf tꜣ)",
    description: "IV Akhet 22. Día del festival de 'Rotura de la Tierra' (*ḫbf tꜣ*). El rey demarca con un pico el terreno sagrado; rito conectado con la fundación de templos y el inicio de la labranza. El Libro de los Muertos (1:21–22) alude a este acto junto al emplazamiento de la barca de Sokar sobre su trineo. Fuente: Calendario de Ramsés III (Medinet Habu); texto de Khoiak de Dendera (ed. Loret); Bleeker (1967).",
    icon: "Pickaxe"
  },
  "3-23": {
    name: "Procesión en el Santuario de Sokar",
    description: "IV Akhet 23. Día de la procesión interna en el santuario de Sokar. Tercer rito del ciclo decenario; preparaciones para la gran procesión de la barca *ḥnw* del día 26. Fuente: Calendario de Ramsés III, Medinet Habu (JEOL 7, pp. 336–337); Bleeker (1967).",
    icon: "Anchor"
  },
  "3-24": {
    name: "Colocación de Sokar 'entre los suyos'",
    description: "IV Akhet 24. Día de la colocación de Sokar 'en medio de los difuntos' (*m-qꜣb*). Cuarto rito del ciclo: el dios es presentado ante los muertos a quienes protege como divinidad ctónica. Fuente: Calendario de Ramsés III, Medinet Habu (JEOL 7, pp. 336–337); Bleeker (1967).",
    icon: "Crown"
  },
  "3-25": {
    name: "Festival Nḏrj.t — Guirnaldas de Cebollas",
    description: "IV Akhet 25. El festival *Nḏrj.t*: se trenzan guirnaldas de cebollas que se portarán en la procesión del día 26. La cebolla era símbolo de fertilidad (Kees); su conexión con Sokar sugiere que el dios era invocado como promotor de la fecundidad de la tierra. Distinto de la 'Masticación de Cebollas para Bastet' (IV Peret 4). Fuente: Bleeker (1967), p. 73; Medinet Habu.",
    icon: "Leaf"
  },
  "3-26": {
    name: "Fiesta de Sokar (Día Principal)",
    description: "IV Akhet 26. Festival principal del ciclo de Sokar. La sagrada barca *ḥnw* — la más antigua de las barcas divinas — es llevada en procesión solemne: el faraón y ocho pares de sacerdotes, príncipes y cortesanos la siguen tomando una cuerda; se porta el emblema de Nefertem y el halcón de Horus en un alto estandarte. En Edfu (ptolemaico) se inmola al asno salvaje de Seth y se da muerte a Apofis. Según Bleeker, la fecha coincidía con el solsticio de invierno en el calendario ptolemaico (p. 70), aunque esto es una coincidencia calendárica, no el origen del festival. Atestiguado desde el Reino Medio (Illahun) hasta la época ptolemaica (Esna, Edfu, Dendera). Fuentes: Bleeker (1967); El-Sabban (2000), MH Lista 47, entrada 1025.",
    icon: "Anchor"
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
    name: "Fiesta de Hathor, Señora de Agny",
    description: "I Peret 30. Atestiguado en el calendario de Esna (época ptolemaica): 'Fiesta de Hathor, Señora de Agny'. Atestiguación limitada a un único templo. Fuente: El-Sabban (2000), Ch. 6 (Esna).",
    icon: "Sailboat"
  },

  // II Peret (Mes 5)
  "5-1": {
    name: "Navegación de Anubis",
    description: "II Peret 1. Listado en el Calendario de Medinet Habu (Lista 59) como el Festival de la Navegación del dios Anubis.",
    icon: "Ship"
  },
  "5-21": {
    name: "Fiesta de la Victoria",
    description: "II Peret 21. 'Fiesta de la Victoria en todo el país' (Edfu Cal. 3: Hathor; Edfu Cal. 2: Horus; Esna: Heqa; Dendera Cal. 2). La diosa Hathor navega hacia Pakhet. En Edfu el día lleva el nombre del mes ('Mekhir'). Comienza la siembra de los jardines divinos. La convergencia de cuatro templos ptolemaicos indica que para la época ptolemaica esta festividad tenía alcance panegipció. Fuente: El-Sabban (2000), Ch. 6.",
    icon: "Star"
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
  "7-4": {
    name: "Masticación de Cebollas para Bastet",
    description: "IV Peret 4. Atestiguado en el Calendario de Festividades de Medinet Habu bajo Ramsés III (entrada 1373). La deidad principal es Amón-Re con su Enéada. Distinto del festival *Nḏrj.t* de guirnaldas de cebollas en IV Akhet 25, que pertenece al ciclo de Sokar. Fuente: El-Sabban (2000), Ch. 5.",
    icon: "Eye"
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

  // II Peret (Mes 5) — último día
  "5-30": {
    name: "Meh Utchat — Plenitud del Ojo de Ra",
    description: "II Peret 30. Último día del mes de Mekhir. El 'Ojo de Ra lleno en Heliópolis' (Utchat meh en Iunu). Dos capítulos independientes del Libro de los Muertos (Cap. CXL y Cap. CXXV) nombran explícitamente esta fecha como ocasión ritual, lo que la convierte en una de las más seguramente atestiguadas del calendario funerario. Se presentaban ofrendas ante un amuleto Utchat de lapislázuli o jaspe dorado mientras Ra aparecía en el horizonte.",
    icon: "Eye",
    fonte: {
      spell: "Capítulo CXL",
      excerpt: "«El Poder divino ha ascendido y resplandece en el horizonte, y el dios Tem ha surgido del perfume de cuanto de él emana. Los Khus brillan en el cielo y Het-benbenet se regocija, pues hay entre ellos una forma semejante a la suya; y hay gritos y clamores de júbilo en el santuario.»",
      source: "Libro de los Muertos · Cap. CXL (Papiro de Lepsius) · Último día de II Peret (Mekhir). Corroborado por Cap. CXXV (Papiro de Nu, BM 10,477). Trad. según Budge (1898); cotejar con Faulkner (1972)."
    }
  },

  // Días Epagómenos (Mes -1)
  "e-1": {
    name: "Nacimiento de Osiris",
    description: "Primer día epagómeno (Heriu Renpet 1). Los cinco días epagómenos nacieron cuando la diosa Nut ganó 1/72 parte de cada día de la luna al dios Thoth y los añadió al año de 360 días (Plutarco, Isis y Osiris, 12; Herodoto II.4). En el primero nació Osiris, señor del Occidente y juez de los muertos. Era día de gran carga ritual: el Libro de los Muertos dedica el Capítulo CXXX al «Cumpleaños de Osiris», y el hemerologio pSallier IV lo marca como día de potente actividad divina.",
    icon: "Crown",
    fonte: {
      spell: "Capítulo CXXX",
      excerpt: "«Los cielos se abren, la tierra se abre, el Oeste se abre, el Este se abre; la mitad sur del cielo se abre, la mitad norte del cielo se abre, las puertas se abren y los portones se lanzan de par en par ante Rā cuando surge en el horizonte.»",
      source: "Libro de los Muertos · Cap. CXXX (Papiro de Nu, BM 10,477, hoja 17) · Rúbrica: «Este capítulo se recitará en el Cumpleaños de Osiris.» Trad. según Budge (1898); cotejar con Faulkner (1972), Hechizo 130."
    }
  },
  "e-2": {
    name: "Nacimiento de Horus el Grande",
    description: "Segundo día epagómeno (Heriu Renpet 2). Nacimiento de Horus el Viejo (Haroeris), el dios halcón del cielo, cuya derecha es el sol y cuya izquierda es la luna. Distinto de Horus hijo de Osiris e Isis. En los textos de Dendera se describe como el «Horus de los dos horizontes» que nació antes de que el mundo fuera creado.",
    icon: "Bird"
  },
  "e-3": {
    name: "Nacimiento de Seth",
    description: "Tercer día epagómeno (Heriu Renpet 3). Nacimiento de Seth (Sutekh), señor del desierto, las tormentas y el caos primordial. Seth nació rasgando el vientre de su madre Nut prematuramente. En el calendario hemerológico (pSallier IV), el tercer día epagómeno suele estar marcado como «malo» (dw). A pesar de su papel adversario, Seth era venerado en el Delta y como guardián de la barca solar contra Apofis.",
    icon: "Flame"
  },
  "e-4": {
    name: "Nacimiento de Isis",
    description: "Cuarto día epagómeno (Heriu Renpet 4). Nacimiento de Isis (Aset), gran maga, madre de Horus y consorte de Osiris. El hemerologio la describe como protectora de los vivos y los muertos. En el culto ptolemaico de Filé, el cuarto día epagómeno se celebraba con lamentaciones rituales que anticipaban el luto por Osiris. Isis es la diosa del trono y de la magia solar-lunar.",
    icon: "Sparkles"
  },
  "e-5": {
    name: "Nacimiento de Neftis",
    description: "Quinto y último día epagómeno (Heriu Renpet 5). Nacimiento de Neftis (Nebthet, «Señora del Castillo»), hermana de Isis y guardiana de los muertos. Junto a Isis llora a Osiris en las lamentaciones funerarias; sus brazos alados protegen el cuerpo del difunto. Tras los cinco días de nacimientos divinos, el ciclo anual se reinicia con Wep Renpet («Apertura del Año»), I Akhet 1.",
    icon: "Moon"
  }
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
  // El día 19 tiene entrada fija en CIVIL_FESTIVALS como inicio oficial (MH Lista 29, entrada 743).
  // Este rango cubre los días de duración del festival sin duplicar la entrada inaugural.
  if ((monthIndex === 1 && dayOfMonth >= 16 && dayOfMonth !== 19) || (monthIndex === 2 && dayOfMonth <= 12)) {
    civilFestivals.push({
      name: "Días del Festival de Opet",
      description: "El festival de Opet duraba 24 días bajo Ramsés III (II Akhet 19 – III Akhet 12). Bajo Tutmosis III, 11 días.",
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
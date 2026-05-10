// atticCalendarData.ts — Major Athenian festivals keyed by Attic month and approximate day
import { ATTIC_MONTHS } from './atticCalendarUtils';

export interface AtticFestivalInfo {
  festivalName: string;
  festivalDesc: string;
  deity: string;
  deityDesc: string;
  festivalDayName?: string; 
  category?: 'Agrario y Fertilidad' | 'Cívico y Patriótico' | 'Mistérico y Ctónico' | 'Dramático y Dionisíaco' | 'Purificación y Expiación' | 'Familiar y Social';
  participants?: string;
  isApaphrades?: boolean;
}

// Keyed by "monthIndex-dayOfMonth" (monthIndex 0-11, dayOfMonth 1-30)
// This record is now deprecated in favor of the programmatic getAtticFestivalInfo
// but we keep the comment for reference if needed.

export const getAtticFestivalInfo = (monthIndex: number, dayOfMonth: number): AtticFestivalInfo | null => {
  // 0. HECATOMBAION (Pleno Verano)
  if (monthIndex === 0) {
    if (dayOfMonth === 12) return { festivalName: "Kronia", deity: "Kronos", deityDesc: "Antiguo dios de la cosecha.", festivalDesc: "Fiesta de la cosecha donde los esclavos cenaban junto a sus amos en un ambiente de total libertad.", category: "Familiar y Social", participants: "Ciudadanos y Esclavos" };
    if (dayOfMonth === 16) return { festivalName: "Synoikia", deity: "Atenea", deityDesc: "Diosa de la ciudad.", festivalDesc: "Conmemora la unificación mítica de Ática por Teseo.", category: "Cívico y Patriótico", participants: "Fylobasileis (Reyes de las tribus)" };
    if (dayOfMonth === 28) return { festivalName: "Panathenaia", deity: "Atenea Polias", deityDesc: "Diosa protectora de la ciudad.", festivalDesc: "El mayor festival de Atenas. Gran procesión para entregar el nuevo Peplos a la diosa, acompañado de hecatombes de vacas y competiciones atléticas.", category: "Cívico y Patriótico", participants: "Toda la ciudad, Kanephoroi, Ergastinai, Epheboi, Metecos" };
  }

  // 1. METAGEITNION (Finales de Verano) - Mes con menos festivales exactos, famoso por la fiesta de Heracles en Kynosarges.

  // 2. BOEDROMION (Principio de Otoño)
  if (monthIndex === 2) {
    if (dayOfMonth === 5) return { festivalName: "Genesia", deity: "Los Muertos", deityDesc: "Ancestros y caídos.", festivalDesc: "Día de recuerdo y luto público por los muertos, originalmente de los clanes aristocráticos.", category: "Mistérico y Ctónico", participants: "Familias atenienses", isApaphrades: true };
    if (dayOfMonth === 6) return { festivalName: "Festival de Artemisa Agrotera", deity: "Artemisa", deityDesc: "Cazadora y protectora en batalla.", festivalDesc: "Conmemoración de la victoria de Maratón. Se sacrificaban 500 cabras anuales en cumplimiento de un voto.", category: "Cívico y Patriótico", participants: "Polemarchos, Epheboi" };
    if (dayOfMonth === 7) return { festivalName: "Boedromia", deity: "Apolo Boedromios", deityDesc: "El que acude en ayuda al grito de guerra.", festivalDesc: "Acción de gracias militar marcando el fin de la temporada de campañas.", category: "Cívico y Patriótico", participants: "Ciudadanos y Militares" };
    
    // MISTERIOS ELEUSINOS
    const eleusisBase = { festivalName: "Misterios Eleusinos Mayores", deity: "Deméter y Perséfone", deityDesc: "Diosas del grano y del inframundo.", category: "Mistérico y Ctónico" as const, participants: "Mystai (Iniciados), Hierofante, Daiduchos" };
    if (dayOfMonth === 15) return { ...eleusisBase, festivalDayName: "Agyrmos (La Reunión)", festivalDesc: "Proclamación oficial invitando a los candidatos puros a la iniciación." };
    if (dayOfMonth === 16) return { ...eleusisBase, festivalDayName: "Halade Mystai (¡Al mar, iniciados!)", festivalDesc: "Los iniciados marchan a Falero para purificarse bañándose en el mar salado junto con un lechón." };
    if (dayOfMonth === 17) return { ...eleusisBase, festivalDayName: "Hither the Victims", festivalDesc: "Gran sacrificio oficial del estado a las Dos Diosas." };
    if (dayOfMonth === 18) return { ...eleusisBase, festivalDayName: "Epidauria", festivalDesc: "Llegada de Asclepio. Los rezagados se purifican y se rinde culto al dios de la medicina." };
    if (dayOfMonth === 19) return { ...eleusisBase, festivalDayName: "La Marcha a Eleusis", festivalDesc: "Gran procesión escoltando las 'Cosas Sagradas' de vuelta a Eleusis." };
    if (dayOfMonth === 20) return { ...eleusisBase, festivalDayName: "Telete (La Iniciación)", festivalDesc: "Noche de vigilia, ayuno y bebida del Kykeon. Revelación en el Telesterion." };
    if (dayOfMonth === 22) return { ...eleusisBase, festivalDayName: "Plemochoai", festivalDesc: "Rito vertiendo vasijas de agua al este y al oeste pidiendo fertilidad." };
  }

  // 3. PYANEPSION (Otoño - Siembra)
  if (monthIndex === 3) {
    if (dayOfMonth === 5) return { festivalName: "Proerosia", deity: "Deméter", deityDesc: "Diosa de la agricultura.", festivalDesc: "Sacrificio preliminar antes de la arada. Se ofrecían los primeros frutos (diezmos) de toda Grecia.", category: "Agrario y Fertilidad" };
    if (dayOfMonth === 7) return { festivalName: "Pyanepsia y Oschophoria", deity: "Apolo / Dionisio y Atenea Skiras", deityDesc: "Apolo de los primeros frutos / Dioses de la vid.", festivalDesc: "Se ofrecía un caldo de legumbres (Pyanepsia) y la rama Eiresione. Carrera de jóvenes vestidos de mujer portando ramas de vid (Oschophoria).", category: "Agrario y Fertilidad", participants: "Jóvenes, Oschophoroi, Deipnophoroi" };
    if (dayOfMonth === 8) return { festivalName: "Theseia", deity: "Teseo", deityDesc: "Héroe mítico de Atenas.", festivalDesc: "Fiesta del héroe, con banquetes, entrega de comida a los pobres y competiciones atléticas y militares.", category: "Cívico y Patriótico" };
    // THESMOPHORIA
    if (dayOfMonth === 11) return { festivalName: "Thesmophoria", festivalDayName: "Ánodos (El Camino Arriba)", deity: "Deméter y Perséfone", deityDesc: "Diosas de la fertilidad.", festivalDesc: "Las mujeres ciudadanas establecen su campamento cerca del Pnyx.", category: "Agrario y Fertilidad", participants: "Mujeres casadas ciudadanas exclusivamente" };
    if (dayOfMonth === 12) return { festivalName: "Thesmophoria", festivalDayName: "Nesteia (El Ayuno)", deity: "Deméter y Perséfone", deityDesc: "Diosas de la fertilidad.", festivalDesc: "Día de luto, ayuno sentadas en el suelo e intercambio de insultos rituales.", category: "Purificación y Expiación", participants: "Mujeres casadas", isApaphrades: true };
    if (dayOfMonth === 13) return { festivalName: "Thesmophoria", festivalDayName: "Kalligeneia (Día de la Hermosa Descendencia)", deity: "Deméter", deityDesc: "Diosa de la fertilidad.", festivalDesc: "Banquete festivo orando por la fertilidad humana y agrícola.", category: "Agrario y Fertilidad", participants: "Mujeres casadas" };
  }

  // 5. POSEIDEON (Diciembre - Invierno)
  if (monthIndex === 5) {
    if (dayOfMonth === 26) return { festivalName: "Haloa", deity: "Deméter y Dionisio", deityDesc: "Dioses de la tierra y la vid.", festivalDesc: "Fiesta de fertilidad en Eleusis. Banquete nocturno exclusivo para mujeres con abundancia de vino y símbolos fálicos para estimular las semillas.", category: "Agrario y Fertilidad", participants: "Mujeres, Sacerdotisas, Cortesanas" };
  }

  // 6. GAMELION (Mes de las Bodas)
  if (monthIndex === 6) {
    if (dayOfMonth === 12) return { festivalName: "Lenaia", deity: "Dionisio Lenaios", deityDesc: "Dios del vino y el teatro.", festivalDesc: "Festival dramático de invierno en el recinto del Lenaion. Famoso por sus competiciones de comedia.", category: "Dramático y Dionisíaco", participants: "Ciudadanos atenienses (sin extranjeros)" };
    if (dayOfMonth === 26) return { festivalName: "Theogamia (Hieros Gamos)", deity: "Zeus y Hera", deityDesc: "Reyes del Olimpo, protectores del matrimonio.", festivalDesc: "Celebración del matrimonio sagrado de los dioses, coincidiendo con la temporada popular de bodas en Atenas.", category: "Familiar y Social" };
  }

  // 7. ANTHESTERION (Finales de Invierno / Flores)
  if (monthIndex === 7) {
    if (dayOfMonth === 11) return { festivalName: "Anthesteria", festivalDayName: "Pithoigia (Apertura de Jarras)", deity: "Dionisio", deityDesc: "Dios del vino.", festivalDesc: "Se abrían las jarras del nuevo vino y se llevaban muestras al santuario en las Marismas.", category: "Dramático y Dionisíaco", participants: "Ciudadanos y Esclavos" };
    if (dayOfMonth === 12) return { festivalName: "Anthesteria", festivalDayName: "Choes (Las Jarras)", deity: "Dionisio", deityDesc: "Dios del vino.", festivalDesc: "Concurso de bebida en silencio. Matrimonio sagrado de la Basilinna con Dionisio.", category: "Dramático y Dionisíaco", participants: "Basilinna, Gerarai" };
    if (dayOfMonth === 13) return { festivalName: "Anthesteria", festivalDayName: "Chytrai (Las Ollas)", deity: "Hermes Ctónico", deityDesc: "Guía de los muertos.", festivalDesc: "Día aciago. Se cocían vegetales en ollas para los fantasmas que vagaban por la ciudad.", category: "Mistérico y Ctónico", isApaphrades: true };
    if (dayOfMonth === 23) return { festivalName: "Diasia", deity: "Zeus Meilichios", deityDesc: "Zeus 'el Apacible' (subterráneo).", festivalDesc: "El mayor festival de Zeus. Holocausto de víctimas o pasteles con forma de animal para expiar la culpa y apaciguar al dios.", category: "Purificación y Expiación", participants: "Toda la población" };
  }

  // 8. ELAPHEBOLION (Primavera)
  if (monthIndex === 8) {
    if (dayOfMonth === 6) return { festivalName: "Elaphebolia", deity: "Artemisa Elaphebolos", deityDesc: "Cazadora de ciervos.", festivalDesc: "Se ofrecían pasteles con forma de ciervos (elaphoi) hechos de masa, miel y sésamo.", category: "Agrario y Fertilidad" };
    if (dayOfMonth === 8) return { festivalName: "Asclepieia", deity: "Asclepio", deityDesc: "Dios de la curación.", festivalDesc: "Conmemora la llegada del dios a Atenas. Comida sagrada y sacrificios.", category: "Purificación y Expiación" };
    if (dayOfMonth === 9) return { festivalName: "Proagon", deity: "Dionisio", deityDesc: "Dios del Teatro.", festivalDesc: "Ceremonia preliminar a las Dionisias. Los dramaturgos y actores se presentaban sin máscaras ante el público.", category: "Dramático y Dionisíaco" };
    if (dayOfMonth >= 10 && dayOfMonth <= 13) return { festivalName: "Dionisias Urbanas (Grandes Dionisias)", deity: "Dionisio Eleuthereus", deityDesc: "Dios del teatro y el éxtasis.", festivalDesc: "El evento teatral supremo del mundo antiguo. Tragedias, comedias, procesión fálica masiva y ostentación del imperio ateniense ante visitantes extranjeros.", category: "Dramático y Dionisíaco", participants: "Atenienses, Extranjeros, Coregos, Huérfanos de guerra" };
    if (dayOfMonth === 14) return { festivalName: "Pandia", deity: "Zeus", deityDesc: "Dios supremo.", festivalDesc: "Festival de clausura tras las Dionisias, posiblemente un festival de la antigua tribu de Pandion.", category: "Cívico y Patriótico" };
  }

  // 9. MUNICHION
  if (monthIndex === 9) {
    if (dayOfMonth === 6) return { festivalName: "Delphinia", deity: "Artemisa / Apolo", deityDesc: "Dioses purificadores.", festivalDesc: "Procesión de doncellas llevando ramas de olivo (hiketeria) atadas con lana blanca al santuario Delphinion.", category: "Purificación y Expiación", participants: "Doncellas atenienses" };
    if (dayOfMonth === 16) return { festivalName: "Munichia", deity: "Artemisa", deityDesc: "Señora de las bestias y la luna.", festivalDesc: "Se ofrecían pasteles iluminados con velas (amphiphontes) para conmemorar a la diosa de la luna. Regata de los efebos.", category: "Agrario y Fertilidad" };
    if (dayOfMonth === 19) return { festivalName: "Olympieia", deity: "Zeus Olímpico", deityDesc: "Dios supremo.", festivalDesc: "Festival espectacular de la caballería ateniense (Hippodrome) en honor al inmenso templo de Zeus en el Ilisos.", category: "Cívico y Patriótico", participants: "Caballería Ateniense" };
  }

  // 10. THARGELION
  if (monthIndex === 10) {
    if (dayOfMonth === 6) return { festivalName: "Thargelia (Día 1)", deity: "Apolo", deityDesc: "Dios purificador.", festivalDesc: "Purificación violenta de la ciudad mediante dos chivos expiatorios humanos (Pharmakoi), alimentados a expensas del estado y luego expulsados.", category: "Purificación y Expiación", isApaphrades: true };
    if (dayOfMonth === 7) return { festivalName: "Thargelia (Día 2)", deity: "Apolo", deityDesc: "Dios protector de la cultura y cosechas.", festivalDesc: "Ofrenda de una olla con el primer grano (Thargelos). Gran competición de coros masculinos de las tribus.", category: "Cívico y Patriótico" };
    if (dayOfMonth === 19) return { festivalName: "Bendidia", deity: "Bendis (Artemisa Tracia)", deityDesc: "Diosa extranjera de la caza.", festivalDesc: "Espectacular carrera de antorchas a caballo de noche en el Pireo.", category: "Cívico y Patriótico", participants: "Tracios residentes y Atenienses" };
    if (dayOfMonth === 25) return { festivalName: "Plynteria", deity: "Atenea Polias", deityDesc: "Diosa protectora.", festivalDesc: "Día nefasto. La estatua de la diosa era despojada, el templo cerrado con cuerdas, y la estatua se lavaba en el mar de Falero.", category: "Purificación y Expiación", participants: "Praxiergidai, Epheboi", isApaphrades: true };
  }

  // 11. SKIROPHORION (Mes antes de la cosecha)
  if (monthIndex === 11) {
    if (dayOfMonth === 12) return { festivalName: "Skira", deity: "Atenea / Deméter", deityDesc: "Dioses de la ciudad y la fertilidad.", festivalDesc: "Procesión bajo un enorme toldo blanco (Skiron). Las mujeres sacrificaban lechones arrojándolos a cavernas (que luego se usaban en Thesmophoria).", category: "Agrario y Fertilidad", participants: "Sacerdotisas, Eteobutadai, Mujeres" };
    if (dayOfMonth === 14) return { festivalName: "Dipolieia (Bouphonia)", deity: "Zeus Polieus", deityDesc: "Protector de la ciudad.", festivalDesc: "Extraño rito antiguo donde se mataba a un buey de trabajo y luego el hacha ejecutora era llevada a juicio por 'asesinato'.", category: "Purificación y Expiación", participants: "Sacerdotes Bouphonia" };
    if (dayOfMonth === 30) return { festivalName: "Diisoteria", deity: "Zeus Soter y Atenea Soteira", deityDesc: "Dioses salvadores.", festivalDesc: "Gran festival en el Pireo para cerrar el año, con hecatombes, banquetes públicos y regatas.", category: "Cívico y Patriótico", participants: "Población y Epheboi" };
  }

  return null;
};

// Default deity for days without specific festival
export const getDefaultAtticDeity = (monthIndex: number): AtticFestivalInfo => {
  const monthDeities: Record<number, AtticFestivalInfo> = {
    0: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la protectora de la ciudad.", deity: "Ἀθηνᾶ", deityDesc: "Protectora de Atenas, diosa de la sabiduría." },
    1: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios de la luz.", deity: "Ἀπόλλων", deityDesc: "Dios de la luz, la música y la profecía." },
    2: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la cosecha.", deity: "Δημήτηρ", deityDesc: "Diosa de la cosecha y la tierra cultivada." },
    3: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios de la verdad.", deity: "Ἀπόλλων", deityDesc: "Dios de la verdad y la curación." },
    4: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al rey de los dioses.", deity: "Ζεύς", deityDesc: "Padre de los dioses, señor del Olimpo." },
    5: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios del mar.", deity: "Ποσειδῶν", deityDesc: "Dios de los mares y las aguas." },
    6: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la reina de los dioses.", deity: "Ἥρα", deityDesc: "Reina de los dioses, protectora del matrimonio." },
    7: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios del vino.", deity: "Διόνυσος", deityDesc: "Dios del vino, el éxtasis y el teatro." },
    8: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la caza.", deity: "Ἄρτεμις", deityDesc: "Diosa de la caza y los bosques." },
    9: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la luna.", deity: "Ἄρτεμις", deityDesc: "Diosa de la luna y la naturaleza salvaje." },
    10: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios sol.", deity: "Ἀπόλλων", deityDesc: "Dios sol, protector de las artes." },
    11: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la estrategia.", deity: "Ἀθηνᾶ", deityDesc: "Diosa de la estrategia y las artes." },
  };
  return monthDeities[monthIndex] || { festivalName: "Día Sagrado", festivalDesc: "Dedicado al padre de los dioses.", deity: "Ζεύς", deityDesc: "Padre de los dioses." };
};

// Daily deities for specific days of the month (excluding festivals)
export const getDailyAtticDeity = (dayOfMonth: number, monthLength: number): AtticFestivalInfo | null => {
  // Last day of month (29th or 30th)
  if (dayOfMonth === monthLength) {
    return {
      festivalName: "Nekysia",
      festivalDesc: "Día de purificación del hogar y ofrendas a los difuntos.",
      deity: "Ἑκάτη καὶ Νεκύσια",
      deityDesc: "Hécate (Hekateia/Deipna) y los ancestros fallecidos (Nekysia).",
    };
  }

  const dailyDeities: Record<number, AtticFestivalInfo> = {
    1: { 
      festivalName: "Noumenia",
      festivalDesc: "Luna Nueva. Sagrado para todos los dioses.",
      deity: "Νουμηνία", 
      deityDesc: "El día en que la luna (creciente) es visible por primera vez tras la Luna Nueva. Sagrado para todos los dioses, especialmente Apolo Neomenios y Hestia.", 
    },
    2: { 
      festivalName: "Agathos Daimon",
      festivalDesc: "Día del 'Buen Espíritu'.",
      deity: "Ἀγαθὸς Δาίμων", 
      deityDesc: "El 'Buen Espíritu'. Un día para honrar al protector personal y la prosperidad del hogar.", 
    },
    3: { 
      festivalName: "Tritogeneia",
      festivalDesc: "Cumpleaños de Atenea.",
      deity: "Ἀθηνᾶ Τριτογένεια", 
      deityDesc: "Cumpleaños de Atenea. Celebración de la diosa de la sabiduría y la guerra estratégica.", 
    },
    4: { 
      festivalName: "Tetras",
      festivalDesc: "Día de Heracles, Hermes, Afrodita y Eros.",
      deity: "Ἡρακλῆς, Ἑρμῆς, Ἀφροδίτη καὶ Ἔρως", 
      deityDesc: "Una poderosa combinación de Heracles, Hermes, Afrodita y Eros. Día de la fuerza, los viajes y el amor.", 
    },
    6: { 
      festivalName: "Artemisia",
      festivalDesc: "Cumpleaños de Artemisa.",
      deity: "Ἄρτεμις", 
      deityDesc: "Cumpleaños de Artemisa. Día sagrado para la diosa de la caza y la naturaleza salvaje.", 
    },
    7: { 
      festivalName: "Hebdome",
      festivalDesc: "Cumpleaños de Apolo.",
      deity: "Ἀπόλλων", 
      deityDesc: "Cumpleaños de Apolo. El día más sagrado de la primera década, dedicado al dios de la luz y la verdad.", 
    },
    8: { 
      festivalName: "Ogdoe",
      festivalDesc: "Día de Poseidón y Teseo.",
      deity: "Ποσειδῶν καὶ Θησεύς", 
      deityDesc: "Poseidón y Teseo. Día del mar y del heroico fundador de Atenas.", 
    },
    9: { 
      festivalName: "Enate",
      festivalDesc: "Día de Rea y las Musas.",
      deity: "Ῥέα καὶ Μοῦσαι", 
      deityDesc: "Rea (Madre de los Dioses) y las Musas. Día de la maternidad cósmica y la inspiración de las artes.", 
    },
    20: { 
      festivalName: "Eikas",
      festivalDesc: "Día de Apolo Eikadios.",
      deity: "Ἀπόλλων Εἰκάδιος καὶ Ἀθηνᾶ", 
      deityDesc: "Apolo Eikadios (del vigésimo día) y Atenea. Un día de sabiduría divina y claridad.", 
    },
  };

  return dailyDeities[dayOfMonth] || null;
};

// 1. Lógica dinámica para Días Nefastos (Apaphrades Hemerai)
export const checkApaphrades = (dayOfMonth: number, monthLength: number, festival: AtticFestivalInfo | null) => {
  // Si el festival en sí es nefasto (Plynteria, Chytrai, Nesteia, Thargelia)
  if (festival?.isApaphrades) {
    return {
      isTaboo: true,
      reason: "Día de Miasma o Luto por el festival. Templos principales cerrados al público."
    };
  }
  
  // Los últimos 3 días del mes (Fase Menguante Oscura)
  if (dayOfMonth >= monthLength - 2) {
    return {
      isTaboo: true,
      reason: "Fase lunar oscura (Φθίνων). Días dedicados a los espíritus ctónicos, a los muertos y a Hécate. No se inician negocios ni se abren los santuarios olímpicos."
    };
  }

  return { isTaboo: false };
};

// 2. Mapeo visual de categorías a Emojis
export const getCategoryBadge = (category?: string): string => {
  switch (category) {
    case 'Dramático y Dionisíaco': return '🎭 Teatro y Éxtasis';
    case 'Agrario y Fertilidad': return '🌾 Agrario y Fertilidad';
    case 'Mistérico y Ctónico': return '🏺 Mistérico y Ctónico';
    case 'Cívico y Patriótico': return '🏃 Cívico y Atlético';
    case 'Purificación y Expiación': return '🔥 Purificación (Miasma)';
    case 'Familiar y Social': return '🍷 Familiar y Social';
    default: return '🏛️ Religioso';
  }
};

// 3. Próximos festivales (Lógica para el popup)
export const getNextAtticFestivals = (monthIndex: number, dayOfMonth: number, limit: number = 3) => {
  const nextFestivals = [];
  let currentMonth = monthIndex;
  let currentDay = dayOfMonth + 1;

  for (let i = 1; i <= 90; i++) {
    if (currentDay > 30) {
      currentDay = 1;
      currentMonth = (currentMonth + 1) % 12;
    }
    const festival = getAtticFestivalInfo(currentMonth, currentDay);
    if (festival) {
      const last = nextFestivals[nextFestivals.length - 1];
      if (!last || last.name !== festival.festivalName) {
          nextFestivals.push({
            name: festival.festivalName,
            description: festival.festivalDesc,
            date: `Día ${currentDay} de ${ATTIC_MONTHS[currentMonth].latin}`,
            daysRemaining: i
          });
      }
      if (nextFestivals.length >= limit) break;
    }
    currentDay++;
  }
  return nextFestivals;
};

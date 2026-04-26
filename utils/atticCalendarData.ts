// atticCalendarData.ts — Major Athenian festivals keyed by Attic month and approximate day

export interface AtticFestivalInfo {
  festivalName?: string;
  deity: string;
  deityDesc: string;
  festivalDesc?: string;
  isMajor: boolean;
}

// Keyed by "monthIndex-dayOfMonth" (monthIndex 0-11, dayOfMonth 1-30)
export const ATTIC_FESTIVALS: Record<string, AtticFestivalInfo> = {
  // === HEKATOMBAION (0) — Jul/Aug ===
  "0-1":  { deity: "Ἀπόλλων Νεομήνιος", deityDesc: "Apolo protector de los comienzos de mes.", isMajor: false },
  "0-3":  { festivalName: "Ἀφροδίσια", deity: "Ἀφροδίτη", deityDesc: "Diosa del amor y la belleza.", festivalDesc: "Festividad en honor a Afrodita, con procesiones y ofrendas de flores.", isMajor: true },
  "0-12": { festivalName: "Κρόνια", deity: "Κρόνος", deityDesc: "Padre de Zeus, dios del tiempo.", festivalDesc: "Fiesta de la igualdad social. Amos y esclavos celebraban juntos, preludio a las Panateneas.", isMajor: true },
  "0-16": { festivalName: "Συνοίκια", deity: "Ἀθηνᾶ", deityDesc: "Diosa de la sabiduría y protectora de Atenas.", festivalDesc: "Celebración de la unificación del Ática bajo Teseo.", isMajor: false },
  "0-28": { festivalName: "Παναθήναια", deity: "Ἀθηνᾶ Πολιάς", deityDesc: "Atenea protectora de la ciudad.", festivalDesc: "La gran fiesta de Atenas. Procesión al Partenón, juegos atléticos, concursos musicales y entrega del peplo a Atenea. Cada 4 años se celebraban las Grandes Panateneas.", isMajor: true },

  // === METAGEITNION (1) — Aug/Sep ===
  "1-7":  { festivalName: "Μεταγείτνια", deity: "Ἀπόλλων Μεταγείτνιος", deityDesc: "Apolo del cambio de vecindad.", festivalDesc: "Festival en honor a Apolo como protector de los cambios y las mudanzas.", isMajor: false },
  "1-16": { deity: "Ἄρτεμις", deityDesc: "Diosa de la caza y la luna.", isMajor: false },

  // === BOEDROMION (2) — Sep/Oct ===
  "2-5":  { festivalName: "Γενέσια", deity: "Γῆ", deityDesc: "La Tierra, madre primigenia.", festivalDesc: "Día de los muertos. Los atenienses honraban a sus antepasados con ofrendas funerarias.", isMajor: true },
  "2-6":  { festivalName: "Ἀρτεμίσια", deity: "Ἄρτεμις Ἀγροτέρα", deityDesc: "Artemisa cazadora.", festivalDesc: "Conmemoración de la Batalla de Maratón (490 a.C.). Se sacrificaban 500 cabras a Artemisa para cumplir un voto.", isMajor: true },
  "2-15": { festivalName: "Ἐλευσίνια Μυστήρια", deity: "Δημήτηρ & Περσεφόνη", deityDesc: "Diosas de los misterios de Eleusis.", festivalDesc: "Inicio de los Grandes Misterios. Los iniciados marchaban desde Atenas hasta Eleusis en procesión sagrada. El rito prometía una vida mejor tras la muerte.", isMajor: true },
  "2-20": { deity: "Δημήτηρ", deityDesc: "Diosa de la cosecha y la fertilidad. Culminación de los Misterios.", isMajor: false },

  // === PYANEPSION (3) — Oct/Nov ===
  "3-7":  { festivalName: "Πυανέψια / Ὀσχοφόρια", deity: "Ἀπόλλων & Διόνυσος", deityDesc: "Dioses de la luz y el vino.", festivalDesc: "Fiesta de la cosecha (hervido de legumbres) y procesión del vino con ramas de vid (oschoi) liderada por jóvenes.", isMajor: true },
  "3-8":  { festivalName: "Θησεῖα", deity: "Θησεύς", deityDesc: "Héroe fundador de Atenas.", festivalDesc: "Festividad en honor al héroe Teseo, legendario rey que unificó el Ática y venció al Minotauro.", isMajor: true },
  "3-9":  { festivalName: "Στήνια", deity: "Δημήτηρ", deityDesc: "Diosa de la tierra cultivada.", festivalDesc: "Vigilia nocturna de las mujeres con bromas rituales, preámbulo de las Tesmoforias.", isMajor: false },
  "3-11": { festivalName: "Θεσμοφόρια", deity: "Δημήτηρ Θεσμοφόρος", deityDesc: "Deméter legisladora.", festivalDesc: "El festival más importante de las mujeres atenienses. Tres días de ayuno, ritos secretos y ofrendas para asegurar la fertilidad de la tierra.", isMajor: true },
  "3-19": { festivalName: "Ἀπατούρια", deity: "Ζεὺς Φράτριος & Ἀθηνᾶ", deityDesc: "Dioses de las fratrías.", festivalDesc: "Gran festival cívico de tres días donde los padres presentaban a sus hijos para ser registrados como ciudadanos atenienses.", isMajor: true },
  "3-30": { festivalName: "Χαλκεῖα", deity: "Ἀθηνᾶ Ἐργάνη & Ἥφαιστος", deityDesc: "Atenea de los oficios y Hefesto el herrero.", festivalDesc: "Fiesta de los artesanos y herreros. Se comenzaba a tejer el peplo para las próximas Panateneas.", isMajor: false },

  // === MAIMAKTERION (4) — Nov/Dec ===
  "4-1":  { deity: "Ζεὺς Μαιμάκτης", deityDesc: "Zeus tempestuoso, señor de las tormentas invernales.", isMajor: false },
  "4-20": { festivalName: "Πομπαῖα", deity: "Ζεὺς Μειλίχιος", deityDesc: "Zeus apacible.", festivalDesc: "Procesión de purificación portando el vellocino de Zeus para alejar los males del invierno.", isMajor: false },

  // === POSEIDEON (5) — Dec/Jan ===
  "5-1":  { deity: "Ποσειδῶν", deityDesc: "Dios del mar, los terremotos y los caballos.", isMajor: false },
  "5-8":  { festivalName: "Ποσείδεια", deity: "Ποσειδῶν", deityDesc: "Poseidón, señor de los mares.", festivalDesc: "Gran festival marítimo en honor a Poseidón con sacrificios y regatas.", isMajor: true },
  "5-16": { festivalName: "Διονύσια τὰ κατ' ἀγρούς", deity: "Διόνυσος", deityDesc: "Dios del vino y el teatro.", festivalDesc: "Dionisias Rurales. Fiestas con procesiones fálicas, cantos y representaciones dramáticas en los demos del Ática.", isMajor: true },
  "5-26": { festivalName: "Ἁλῶα", deity: "Δημήτηρ, Περσεφόνη & Διόνυσος", deityDesc: "Dioses de la fertilidad.", festivalDesc: "Festival agrario invernal reservado exclusivamente a las mujeres. Celebraba la fertilidad con banquetes secretos.", isMajor: true },

  // === GAMELION (6) — Jan/Feb ===
  "6-1":  { deity: "Ἥρα", deityDesc: "Diosa del matrimonio y la familia.", isMajor: false },
  "6-12": { festivalName: "Λέναια", deity: "Διόνυσος Ληναῖος", deityDesc: "Dioniso del lagar.", festivalDesc: "Festival de teatro con concursos de comedias y tragedias. Más íntimo que las Grandes Dionisias, solo para ciudadanos atenienses.", isMajor: true },
  "6-27": { festivalName: "Γαμέλια / Θεογαμία", deity: "Ζεὺς & Ἥρα", deityDesc: "Zeus y Hera, pareja divina.", festivalDesc: "Celebración del matrimonio sagrado (hierogamia) de Zeus y Hera. Mes propicio para las bodas.", isMajor: true },

  // === ANTHESTERION (7) — Feb/Mar ===
  "7-11": { festivalName: "Ἀνθεστήρια — Πιθοιγία", deity: "Διόνυσος", deityDesc: "Dios del vino.", festivalDesc: "Primer día de las Antesterias: apertura de las tinajas de vino nuevo. Celebración del final del invierno.", isMajor: true },
  "7-12": { festivalName: "Ἀνθεστήρια — Χόες", deity: "Διόνυσος", deityDesc: "Dios del éxtasis.", festivalDesc: "Segundo día: concurso de bebedores con jarras (choes). Los niños de 3 años recibían su primera corona.", isMajor: true },
  "7-13": { festivalName: "Ἀνθεστήρια — Χύτροι", deity: "Ἑρμῆς Χθόνιος", deityDesc: "Hermes conductor de almas.", festivalDesc: "Tercer día: ofrendas a los muertos con ollas de legumbres. Los espíritus de los difuntos paseaban por la ciudad y al final se les despedía: '¡Fuera, Keres, las Antesterias han terminado!'", isMajor: true },
  "7-20": { festivalName: "Μικρὰ Ἐλευσίνια", deity: "Δημήτηρ & Περσεφόνη", deityDesc: "Diosas de los misterios.", festivalDesc: "Los Pequeños Misterios en Agrae. Rito de purificación esencial y paso previo obligatorio antes de los Grandes Misterios de Eleusis.", isMajor: true },
  "7-23": { festivalName: "Διάσια", deity: "Ζεὺς Μειλίχιος", deityDesc: "Zeus apacible subterráneo.", festivalDesc: "Mayor festival de Zeus en Atenas. Sacrificios y ofrendas de pasteles con forma de animales.", isMajor: true },

  // === ELAPHEBOLION (8) — Mar/Apr ===
  "8-6":  { festivalName: "Ἐλαφηβόλια", deity: "Ἄρτεμις Ἐλαφηβόλος", deityDesc: "Artemisa cazadora de ciervos.", festivalDesc: "Caza ritual de ciervos jóvenes y ofrendas de pasteles con forma de ciervo.", isMajor: false },
  "8-10": { festivalName: "Μεγάλα Διονύσια", deity: "Διόνυσος Ἐλευθερεύς", deityDesc: "Dioniso libertador.", festivalDesc: "Las Grandes Dionisias: el mayor festival de teatro del mundo griego. Concursos de tragedias, comedias y ditirambos donde competían Esquilo, Sófocles y Eurípides. Miles de visitantes de toda Grecia.", isMajor: true },
  "8-17": { festivalName: "Πάνδια", deity: "Ζεύς", deityDesc: "Rey de los dioses.", festivalDesc: "Fiesta cívica y política en honor a Zeus, celebrada inmediatamente después de las Grandes Dionisias.", isMajor: true },

  // === MOUNICHION (9) — Apr/May ===
  "9-6":  { festivalName: "Δέλφινια", deity: "Ἀπόλλων Δελφίνιος", deityDesc: "Apolo de los delfines y la navegación.", festivalDesc: "Apertura de la temporada de navegación. Los barcos se botaban y se pedía protección para los viajes marítimos.", isMajor: false },
  "9-16": { festivalName: "Μουνυχία", deity: "Ἄρτεμις Μουνυχία", deityDesc: "Artemisa de Muniquia.", festivalDesc: "Procesión con antorchas al santuario de Artemisa en la colina de Muniquia (Pireo). Se ofrecían tortas redondas con velas encendidas.", isMajor: true },

  // === THARGELION (10) — May/Jun ===
  "10-6": { festivalName: "Θαργήλια", deity: "Ἀπόλλων & Ἄρτεμις", deityDesc: "Los gemelos divinos.", festivalDesc: "Festival de purificación y cosecha. Se expulsaban dos pharmakoi (chivos expiatorios) de la ciudad para purificarla. Después, ofrenda de las primicias de la cosecha.", isMajor: true },
  "10-19": { festivalName: "Βενδίδεια", deity: "Βενδῖς", deityDesc: "Diosa tracia de la caza.", festivalDesc: "Festival nocturno en el Pireo con carrera de antorchas a caballo. Es la fiesta que abre la República de Platón.", isMajor: false },
  "10-20": { festivalName: "Καλλυντήρια", deity: "Ἀθηνᾶ", deityDesc: "Atenea protectora.", festivalDesc: "Festival de limpieza sagrada del Erecteión y del templo de Atenea en la Acrópolis.", isMajor: true },
  "10-25": { festivalName: "Πλυντήρια", deity: "Ἀθηνᾶ", deityDesc: "Atenea protectora.", festivalDesc: "Día nefasto: se lavaba ritualmente la antigua estatua de Atenea (xoanon) y se cerraban los templos. Día de mala suerte.", isMajor: true },

  // === SKIROPHORION (11) — Jun/Jul ===
  "11-3":  { festivalName: "Ἀρρηφόρια", deity: "Ἀθηνᾶ Πολιάς", deityDesc: "Atenea de la ciudad.", festivalDesc: "Rito secreto: dos niñas (arréforas) descendían de noche de la Acrópolis portando cestas sagradas cuyo contenido era desconocido.", isMajor: true },
  "11-12": { festivalName: "Σκίρα / Σκιροφόρια", deity: "Ἀθηνᾶ, Ποσειδῶν, Ἥλιος", deityDesc: "Los tres dioses de la cosecha final.", festivalDesc: "Procesión desde la Acrópolis hasta Esciro bajo un gran parasol blanco. Las mujeres celebraban ritos de fertilidad con semillas.", isMajor: true },
  "11-14": { festivalName: "Διϊπόλεια / Βουφόνια", deity: "Ζεὺς Πολιεύς", deityDesc: "Zeus protector de la ciudad.", festivalDesc: "Antiguo rito: se colocaba grano sobre el altar de Zeus. El buey que lo comía era sacrificado y luego se celebraba un juicio ritual contra el cuchillo por 'asesinato'.", isMajor: true },
};

export const getAtticFestivalInfo = (monthIndex: number, dayOfMonth: number): AtticFestivalInfo | null => {
  const key = `${monthIndex}-${dayOfMonth}`;
  return ATTIC_FESTIVALS[key] || null;
};

// Default deity for days without specific festival
export const getDefaultAtticDeity = (monthIndex: number): AtticFestivalInfo => {
  const monthDeities: Record<number, AtticFestivalInfo> = {
    0: { deity: "Ἀθηνᾶ", deityDesc: "Protectora de Atenas, diosa de la sabiduría.", isMajor: false },
    1: { deity: "Ἀπόλλων", deityDesc: "Dios de la luz, la música y la profecía.", isMajor: false },
    2: { deity: "Δημήτηρ", deityDesc: "Diosa de la cosecha y la tierra cultivada.", isMajor: false },
    3: { deity: "Ἀπόλλων", deityDesc: "Dios de la verdad y la curación.", isMajor: false },
    4: { deity: "Ζεύς", deityDesc: "Padre de los dioses, señor del Olimpo.", isMajor: false },
    5: { deity: "Ποσειδῶν", deityDesc: "Dios de los mares y las aguas.", isMajor: false },
    6: { deity: "Ἥρα", deityDesc: "Reina de los dioses, protectora del matrimonio.", isMajor: false },
    7: { deity: "Διόνυσος", deityDesc: "Dios del vino, el éxtasis y el teatro.", isMajor: false },
    8: { deity: "Ἄρτεμις", deityDesc: "Diosa de la caza y los bosques.", isMajor: false },
    9: { deity: "Ἄρτεμις", deityDesc: "Diosa de la luna y la naturaleza salvaje.", isMajor: false },
    10: { deity: "Ἀπόλλων", deityDesc: "Dios sol, protector de las artes.", isMajor: false },
    11: { deity: "Ἀθηνᾶ", deityDesc: "Diosa de la estrategia y las artes.", isMajor: false },
  };
  return monthDeities[monthIndex] || { deity: "Ζεύς", deityDesc: "Padre de los dioses.", isMajor: false };
};

// Daily deities for specific days of the month (excluding festivals)
export const getDailyAtticDeity = (dayOfMonth: number, monthLength: number): AtticFestivalInfo | null => {
  // Last day of month (29th or 30th)
  if (dayOfMonth === monthLength) {
    return {
      deity: "Ἑκάτη καὶ Νεκύσια",
      deityDesc: "Hécate (Hekateia/Deipna) y los ancestros fallecidos (Nekysia). Día de purificación del hogar y ofrendas a los difuntos.",
      isMajor: false
    };
  }

  const dailyDeities: Record<number, AtticFestivalInfo> = {
    1: { 
      deity: "Νουμηνία", 
      deityDesc: "El día en que la luna (creciente) es visible por primera vez tras la Luna Nueva. Sagrado para todos los dioses, especialmente Apolo Neomenios y Hestia.", 
      isMajor: false 
    },
    2: { 
      deity: "Ἀγαθὸς Δαίμων", 
      deityDesc: "El 'Buen Espíritu'. Un día para honrar al protector personal y la prosperidad del hogar.", 
      isMajor: false 
    },
    3: { 
      deity: "Ἀθηνᾶ Τριτογένεια", 
      deityDesc: "Cumpleaños de Atenea. Celebración de la diosa de la sabiduría y la guerra estratégica.", 
      isMajor: false 
    },
    4: { 
      deity: "Ἡρακλῆς, Ἑρμῆς, Ἀφροδίτη καὶ Ἔρως", 
      deityDesc: "Una poderosa combinación de Heracles, Hermes, Afrodita y Eros. Día de la fuerza, los viajes y el amor.", 
      isMajor: false 
    },
    6: { 
      deity: "Ἄρτεμις", 
      deityDesc: "Cumpleaños de Artemisa. Día sagrado para la diosa de la caza y la naturaleza salvaje.", 
      isMajor: false 
    },
    7: { 
      deity: "Ἀπόλλων", 
      deityDesc: "Cumpleaños de Apolo. El día más sagrado de la primera década, dedicado al dios de la luz y la verdad.", 
      isMajor: false 
    },
    8: { 
      deity: "Ποσειδῶν καὶ Θησεύς", 
      deityDesc: "Poseidón y Teseo. Día del mar y del heroico fundador de Atenas.", 
      isMajor: false 
    },
    9: { 
      deity: "Ῥέα καὶ Μοῦσαι", 
      deityDesc: "Rea (Madre de los Dioses) y las Musas. Día de la maternidad cósmica y la inspiración de las artes.", 
      isMajor: false 
    },
    20: { 
      deity: "Ἀπόλλων Εἰκάδιος καὶ Ἀθηνᾶ", 
      deityDesc: "Apolo Eikadios (del vigésimo día) y Atenea. Un día de sabiduría divina y claridad.", 
      isMajor: false 
    },
  };

  return dailyDeities[dayOfMonth] || null;
};

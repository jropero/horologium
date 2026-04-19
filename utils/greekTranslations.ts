export const GREEK_TO_SPANISH: Record<string, string> = {
  // Weekdays
  "Ἡμέρα Ἡλίου": "Día del Sol",
  "Ἡμέρα Σελήνης": "Día de la Luna",
  "Ἡμέρα Ἄρεως": "Día de Marte",
  "Ἡμέρα Ἑρμοῦ": "Día de Mercurio",
  "Ἡμέρα Διός": "Día de Júpiter",
  "Ἡμέρα Ἀφροδίτης": "Día de Venus",
  "Ἡμέρα Κρόνου": "Día de Saturno",
  
  // Planets
  "Κρόνος": "Saturno",
  "Ζεύς": "Júpiter",
  "Ἄρης": "Marte",
  "Ἥλιος": "Sol",
  "Ἀφροδίτη": "Venus",
  "Ἑρμῆς": "Mercurio",
  "Σελήνη": "Luna",
  
  // Zodiac
  "Κριῷ": "Aries",
  "Ταύρῳ": "Tauro",
  "Διδύμοις": "Géminis",
  "Καρκίνῳ": "Cáncer",
  "Λέοντι": "Leo",
  "Παρθένῳ": "Virgo",
  "Ζυγῷ": "Libra",
  "Σκορπίῳ": "Escorpio",
  "Τοξότῃ": "Sagitario",
  "Αἰγοκέρωτι": "Capricornio",
  "Ὑδροχόῳ": "Acuario",
  "Ἰχθύσι": "Piscis",
  
  // Moon phases
  "Νουμηνία": "Luna Nueva",
  "Μηνοειδής αὐξάνουσα": "Luna Creciente",
  "Πρώτη Τετράς": "Cuarto Creciente",
  "Ἀμφίκυρτος αὐξάνουσα": "Gibosa Creciente",
  "Πανσέληνος": "Luna Llena",
  "Ἀμφίκυρτος φθίνουσα": "Gibosa Menguante",
  "Τελευταία Τετράς": "Cuarto Menguante",
  "Μηνοειδής φθίνουσα": "Luna Menguante",
  
  // Hours
  "Πρώτη Ὥρα": "Primera Hora", "Δευτέρα Ὥρα": "Segunda Hora", "Τρίτη Ὥρα": "Tercera Hora", 
  "Τετάρτη Ὥρα": "Cuarta Hora", "Πέμπτη Ὥρα": "Quinta Hora", "Ἕκτη Ὥρα": "Sexta Hora",
  "Ἑβδόμη Ὥρα": "Séptima Hora", "Ὀγδόη Ὥρα": "Octava Hora", "Ἐνάτη Ὥρα": "Novena Hora",
  "Δεκάτη Ὥρα": "Décima Hora", "Ἑνδεκάτη Ὥρα": "Undécima Hora", "Δωδεκάτη Ὥρα": "Duodécima Hora",
  
  "Πρώτη Ὥρα Νυκτός": "1ª Hora Nocturna", "Δευτέρα Ὥρα Νυκτός": "2ª Hora Nocturna", "Τρίτη Ὥρα Νυκτός": "3ª Hora Nocturna",
  "Τετάρτη Ὥρα Νυκτός": "4ª Hora Nocturna", "Πέμπτη Ὥρα Νυκτός": "5ª Hora Nocturna", "Ἕκτη Ὥρα Νυκτός": "6ª Hora Nocturna",
  "Ἑβδόμη Ὥρα Νυκτός": "7ª Hora Nocturna", "Ὀγδόη Ὥρα Νυκτός": "8ª Hora Nocturna", "Ἐνάτη Ὥρα Νυκτός": "9ª Hora Nocturna",
  "Δεκάτη Ὥρα Νυκτός": "10ª Hora Nocturna", "Ἑνδεκάτη Ὥρα Νυκτός": "11ª Hora Nocturna", "Δωδεκάτη Ὥρα Νυκτός": "12ª Hora Nocturna",
  
  // Tutela Mensis
  "Ποσειδῶν": "Poseidón", "Ἀθηνᾶ": "Atenea", "Ἥφαιστος": "Hefesto", "Ἄρτεμις": "Artemisa", 
  "Ἑστία": "Hestia", "Ἥρα": "Hera", "Δημήτηρ": "Deméter", "Ἀπόλλων": "Apolo",

  // Attic Months
  "Ἑκατομβαιών": "Hecatombeón",
  "Μεταγειτνιών": "Metageitnión",
  "Βοηδρομιών": "Boedromión",
  "Πυανεψιών": "Pyanepsión",
  "Μαιμακτηριών": "Maimacterión",
  "Ποσειδεών": "Poseideón",
  "Γαμηλιών": "Gamelión",
  "Ἀνθεστηριών": "Antesterión",
  "Ἐλαφηβολιών": "Elafebolión",
  "Μουνυχιών": "Muniquión",
  "Θαργηλιών": "Targelión",
  "Σκιροφοριών": "Esciroforión"
};

export const translateGreekUI = (text: string): string => {
  if (!text) return "";
  
  // Direct match
  if (GREEK_TO_SPANISH[text]) return GREEK_TO_SPANISH[text];

  // Try to find parts to replace (for constructed sentences)
  let translated = text;
  
  // Special rules:
  // "Sol in Κριῷ"
  if (text.startsWith("Sol in ")) {
    const sign = text.replace("Sol in ", "");
    if (GREEK_TO_SPANISH[sign]) {
      return `Sol en ${GREEK_TO_SPANISH[sign]}`;
    }
  }

  // It might be combined, but we often display bits isolated now, 
  // so having the map is enough for small chips.
  return GREEK_TO_SPANISH[text] || text;
};

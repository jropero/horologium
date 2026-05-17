// egyptianWisdomData.ts — Textos de sabiduría del Antiguo Egipto
// Citas auténticas de las grandes obras literarias egipcias.

export interface EgyptianWisdom {
  id: number;
  text: string;
  author: string;
  source: string;
}

export const EGYPTIAN_WISDOM: EgyptianWisdom[] = [
  // === Instrucciones de Ptahhotep (c. 2400 a.C.) ===
  { id: 1, text: "No seas arrogante a causa de tu conocimiento. Consulta al ignorante igual que al sabio, pues los límites del arte no pueden alcanzarse y ningún artesano posee la perfección.", author: "Ptahhotep", source: "Instrucciones de Ptahhotep" },
  { id: 2, text: "Si encuentras un orador en su momento, un sabio superior a ti, dobla tus brazos y muestra respeto.", author: "Ptahhotep", source: "Instrucciones de Ptahhotep" },
  { id: 3, text: "Sigue tu corazón mientras vivas. No hagas más de lo necesario ni acortes el tiempo dedicado al placer.", author: "Ptahhotep", source: "Instrucciones de Ptahhotep" },
  { id: 4, text: "La justicia es grande, duradera y eficaz. No ha sido perturbada desde los tiempos de Osiris.", author: "Ptahhotep", source: "Instrucciones de Ptahhotep" },

  // === Instrucciones de Amenemope (c. 1300 a.C.) ===
  { id: 5, text: "Mejor es el pan con un corazón feliz que la riqueza con aflicción.", author: "Amenemope", source: "Instrucciones de Amenemope" },
  { id: 6, text: "No muevas los mojones en los límites del campo cultivado, ni alteres la posición de la cuerda de medir.", author: "Amenemope", source: "Instrucciones de Amenemope" },
  { id: 7, text: "El hombre verdaderamente silencioso se mantiene apartado. Es como un árbol que crece en un jardín: florece y duplica su cosecha.", author: "Amenemope", source: "Instrucciones de Amenemope" },
  { id: 8, text: "No te rías de un ciego ni te burles de un enano. No impidas el paso al lisiado.", author: "Amenemope", source: "Instrucciones de Amenemope" },

  // === Libro de los Muertos (c. 1550 a.C.) ===
  { id: 9, text: "No he cometido iniquidad. No he robado. No he sido avaro. No he matado hombres. No he cometido engaño.", author: "Anónimo", source: "Libro de los Muertos, Confesión Negativa (Cap. 125)" },
  { id: 10, text: "Homenajeado seas, oh gran Dios, Señor de la Doble Maat. He venido ante ti, mi señor, para contemplar tu perfección.", author: "Anónimo", source: "Libro de los Muertos (Cap. 125)" },
  { id: 11, text: "Que mi corazón no se alce contra mí en el juicio. Que no haya oposición contra mí ante los jueces.", author: "Anónimo", source: "Libro de los Muertos (Cap. 30B)" },

  // === Textos de las Pirámides (c. 2400-2300 a.C.) ===
  { id: 12, text: "Oh Rey, tú no te has ido muerto: te has ido vivo. Siéntate en el trono de Osiris, con tu cetro en la mano, para dar órdenes a los vivos.", author: "Anónimo", source: "Textos de las Pirámides" },
  { id: 13, text: "El cielo llueve, las estrellas se oscurecen. Los arcos celestes tiemblan, los huesos del dios-tierra se estremecen ante la presencia del Rey.", author: "Anónimo", source: "Textos de las Pirámides, Himno Caníbal" },

  // === Instrucciones de Merikare (c. 2100 a.C.) ===
  { id: 14, text: "Sé hábil con las palabras y serás victorioso. La lengua es la espada del rey: el hablar es más fuerte que cualquier lucha.", author: "Khety III", source: "Instrucciones para Merikare" },
  { id: 15, text: "Haz justicia mientras permanezcas en la tierra. Consuela al que llora. No oprimas a la viuda.", author: "Khety III", source: "Instrucciones para Merikare" },

  // === El canto del arpista (c. 2000 a.C.) ===
  { id: 16, text: "Celebra el día alegre. No te canses de ello. Mira, nadie se lleva sus bienes consigo. Mira, nadie regresa después de haberse ido.", author: "Anónimo", source: "El Canto del Arpista (Tumba de Intef)" },

  // === Instrucciones de Ani (c. 1300 a.C.) ===
  { id: 17, text: "No comas pan mientras otro está de pie sin que le hayas tendido la mano hacia el pan.", author: "Ani", source: "Instrucciones de Ani" },
  { id: 18, text: "No hables demasiado. Calla y serás feliz. No seas de voz alta en la casa de Dios. Él aborrece los gritos.", author: "Ani", source: "Instrucciones de Ani" },

  // === Proverbios y máximas diversas ===
  { id: 19, text: "La boca del hombre es su salvación, pero su hablar es también causa de su ruina.", author: "Anónimo", source: "Sabiduría popular egipcia" },
  { id: 20, text: "El conocimiento no tiene límites, y nadie ha alcanzado aún su perfección.", author: "Imhotep", source: "Atribuido a Imhotep" },

  // === Citas históricas adicionales ===
  {
    id: 101,
    text: "No te enorgullezcas de tu saber, ni te confíes porque seas sabio. Consulta al ignorante tanto como al instruido, pues no hay límite para el arte.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep (Dinastía V)"
  },
  {
    id: 102,
    text: "La justicia (Maat) es grande y su valor perdura. No ha sido alterada desde los tiempos de Osiris. El que quebranta las leyes será castigado.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep (Dinastía V)"
  },
  {
    id: 103,
    text: "No cambies los linderos de los campos, ni alteres la cuerda de medir; no codicies la tierra de una viuda.",
    author: "Amenemope",
    source: "Instrucciones de Amenemope (Dinastía XX)"
  },
  {
    id: 104,
    text: "Mejor es la pobreza en la mano del dios, que la riqueza acumulada en el granero con injusticia.",
    author: "Amenemope",
    source: "Instrucciones de Amenemope (Dinastía XX)"
  },
  {
    id: 105,
    text: "Haz la justicia mientras estés en la tierra. Consuela al que llora, no oprimas a la viuda, y no expulses a un hombre de las propiedades de su padre.",
    author: "Rey Khety",
    source: "Instrucciones para el rey Merikare (Primer Período Intermedio)"
  },
  {
    id: 106,
    text: "Mi corazón es mío en la Casa de los Corazones. Mi pecho es mío en la Casa de la Justicia. Que no me sea arrebatado ni testifique contra mí en la balanza.",
    author: "Escriba Ani",
    source: "El Libro de los Muertos, Papiro de Ani (Dinastía XIX)"
  },
  {
    id: 107,
    text: "Construye una casa, pero ama también el silencio. No te dejes atrapar por las palabras apresuradas ni por las disputas de la calle.",
    author: "Escriba Any",
    source: "Las Instrucciones de Any (Dinastía XVIII)"
  },
  {
    id: 108,
    text: "La tienda del silencioso está abierta. El lugar del hombre de voz suave es espacioso. Pero el que tiene lengua afilada no encuentra refugio.",
    author: "Visir Kagemni",
    source: "Las Instrucciones de Kagemni (Dinastía IV)"
  },
  {
    id: 109,
    text: "Habla la verdad, haz la verdad. Porque es grande, es poderosa, es duradera. Su valor te guiará a la condición de venerable ante los dioses.",
    author: "Campesino Khunanup",
    source: "El Cuento del Campesino Elocuente (Dinastía XII)"
  },
  {
    id: 110,
    text: "El que escucha es el que prospera. Que el que escucha se convierta en un hombre que es escuchado.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep (Dinastía V)"
  },
  {
    id: 111,
    text: "No pases la noche temiendo el mañana. Al amanecer, ¿qué es el mañana? El hombre ignora cómo será el mañana, pues el Dios es quien traza el destino.",
    author: "Amenemope",
    source: "Instrucciones de Amenemope (Dinastía XX)"
  },
  {
    id: 112,
    text: "La lengua es una espada; la palabra es más fuerte que cualquier combate. Un rey sabio es una fortaleza invencible.",
    author: "Rey Khety",
    source: "Instrucciones para el rey Merikare (Primer Período Intermedio)"
  },
  {
    id: 113,
    text: "No he hecho llorar a nadie. No he ordenado matar. No he causado dolor a ningún hombre. Soy puro, soy puro, soy puro.",
    author: "Alma Justificada (El Difunto)",
    source: "El Libro de los Muertos, La Confesión Negativa (Imperio Nuevo)"
  },
  {
    id: 114,
    text: "Sigue a tu corazón el tiempo que vivas. No hagas más de lo que se te manda; no acortes el tiempo de seguir al corazón, pues a los dioses les ofende la tristeza.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep (Dinastía V)"
  },
  {
    id: 115,
    text: "No hables mucho, pues los dioses detestan la verborrea. Que tus palabras sean pocas y que pesen con justicia en la balanza de tu corazón.",
    author: "Escriba Any",
    source: "Las Instrucciones de Any (Dinastía XVIII)"
  },
  {
    id: 116,
    text: "Oh Rey, no has partido muerto, has partido vivo. Siéntate sobre el trono de Osiris, con tu cetro de poder en la mano, y da órdenes a los Vivos.",
    author: "Sacerdotes Lectores",
    source: "Textos de las Pirámides, Pirámide de Unas (Dinastía V)"
  },
  {
    id: 117,
    text: "No rías ante el ciego ni te burles del enano. No arruines los planes del cojo. El hombre es arcilla y paja, y el Dios es su Gran Constructor.",
    author: "Amenemope",
    source: "Instrucciones de Amenemope (Dinastía XX)"
  },
  {
    id: 118,
    text: "Si eres líder, busca siempre un camino excelente para que tu conducta esté libre de toda culpa ante los dioses y los hombres.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep (Dinastía V)"
  },
  {
    id: 119,
    text: "Pasa un día feliz y no te canses de él. Mira, nadie puede llevarse consigo sus bienes materiales; mira, nadie de los que han partido ha regresado.",
    author: "El Arpista Ciego",
    source: "Canto del Arpista, Tumba de Antef (Imperio Medio)"
  },
  {
    id: 120,
    text: "No separes tu corazón de tu lengua, y todos tus planes tendrán éxito. Sé firme en tus intenciones y la divinidad caminará a tu lado.",
    author: "Amenemope",
    source: "Instrucciones de Amenemope (Dinastía XX)"
  }
];

/**
 * Obtiene la cita de sabiduría del día, calculada según el día del año.
 * El algoritmo es idéntico al de sententiaeData.ts y apophthegmataData.ts:
 * se calcula el día del año (1-366) y se usa módulo sobre el array.
 */
export const getEgyptianWisdomOfTheDay = (date: Date): EgyptianWisdom => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = (dayOfYear - 1) % EGYPTIAN_WISDOM.length;
  return EGYPTIAN_WISDOM[index >= 0 ? index : 0];
};

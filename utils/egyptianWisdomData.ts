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

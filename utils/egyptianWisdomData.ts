// egyptianWisdomData.ts — Textos de sabiduría del Antiguo Egipto
// Citas auténticas de las grandes obras literarias egipcias (Sebayt y Textos Sagrados).

export interface EgyptianWisdom {
  id: number;
  text: string;
  author: string;
  source: string;
}

export const EGYPTIAN_WISDOM: EgyptianWisdom[] = [
  // === Instrucciones de Ptahhotep (Reino Antiguo, Dinastía V) ===
  {
    id: 1,
    text: "No te enorgullezcas de tu saber, ni te confíes porque seas sabio. Consulta al ignorante tanto como al instruido, pues no hay límite para el arte y ningún artesano alcanza la perfección absoluta.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 2,
    text: "Si encuentras a un adversario en su momento de ira, un sabio superior a ti, dobla tus brazos y dobla tu espalda. No te opongas a él y mostrarás tu dominio.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 3,
    text: "La justicia (Maat) es grande y su valor perdura. No ha sido alterada desde los tiempos de Osiris. El que quebranta las leyes será castigado.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 4,
    text: "Sigue a tu corazón el tiempo que vivas. No hagas más de lo que se te manda; no acortes el tiempo de seguir al corazón, pues a los dioses les ofende la tristeza.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 5,
    text: "El que escucha es el que prospera. Que el que escucha se convierta en un hombre que es escuchado.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },

  // === Instrucciones de Amenemope (Imperio Nuevo, Dinastía XX) ===
  {
    id: 6,
    text: "Mejor es el pan con un corazón feliz, que la riqueza con aflicción.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope"
  },
  {
    id: 7,
    text: "No cambies los linderos de los campos, ni alteres la cuerda de medir; no codicies la tierra de una viuda.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope"
  },
  {
    id: 8,
    text: "El hombre verdaderamente silencioso se mantiene apartado. Es como un árbol que crece en un jardín: florece y duplica su cosecha.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope"
  },
  {
    id: 9,
    text: "No rías ante el ciego ni te burles del enano. No arruines los planes del cojo. El hombre es arcilla y paja, y el Dios es su Gran Constructor.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope"
  },
  {
    id: 10,
    text: "No pases la noche temiendo el mañana. Al amanecer, ¿qué es el mañana? El hombre ignora cómo será el mañana, pues el Dios es quien traza el destino.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope"
  },

  // === Instrucciones para Merikare (Primer Período Intermedio, Dinastías IX-X) ===
  {
    id: 11,
    text: "La lengua es una espada para el hombre; la palabra es más fuerte que cualquier combate. Un rey sabio es una fortaleza invencible.",
    author: "Rey Khety III",
    source: "Instrucciones para el rey Merikare"
  },
  {
    id: 12,
    text: "Haz la justicia mientras estés en la tierra. Consuela al que llora, no oprimas a la viuda, y no expulses a un hombre de las propiedades de su padre.",
    author: "Rey Khety III",
    source: "Instrucciones para el rey Merikare"
  },

  // === Textos Funerarios y Canciones ===
  {
    id: 13,
    text: "No he hecho llorar a nadie. No he ordenado matar. No he causado dolor a ningún hombre. Soy puro, soy puro, soy puro.",
    author: "Alma Justificada (El Difunto)",
    source: "El Libro de los Muertos (Capítulo 125, La Confesión Negativa)"
  },
  {
    id: 14,
    text: "Oh corazón mío, corazón de mi madre. No te alces como testigo contra mí en el juicio. No te opongas a mí ante el guardián de la balanza.",
    author: "Alma Justificada",
    source: "El Libro de los Muertos (Capítulo 30B)"
  },
  {
    id: 15,
    text: "Oh Rey, no has partido muerto, has partido vivo. Siéntate sobre el trono de Osiris, con tu cetro de poder en la mano, y da órdenes a los Vivos.",
    author: "Sacerdotes Lectores",
    source: "Textos de las Pirámides (Cámara funeraria de Unas)"
  },
  {
    id: 16,
    text: "Pasa un día feliz y no te canses de él. Mira, nadie puede llevarse consigo sus bienes materiales; mira, nadie de los que han partido ha regresado.",
    author: "El Arpista Ciego",
    source: "Canto del Arpista (Tumba de Antef, Imperio Medio)"
  },

  // === Instrucciones de Any / Kagemni / Campesino Elocuente ===
  {
    id: 17,
    text: "Construye una casa, pero ama también el silencio. No te dejes atrapar por las palabras apresuradas ni por las disputas de la calle.",
    author: "Escriba Any",
    source: "Las Instrucciones de Any (Imperio Nuevo)"
  },
  {
    id: 18,
    text: "La tienda del silencioso está abierta. El lugar del hombre de voz suave es espacioso. Pero el que tiene lengua afilada no encuentra refugio.",
    author: "Visir Kagemni",
    source: "Las Instrucciones de Kagemni (Reino Antiguo)"
  },
  {
    id: 19,
    text: "Habla la verdad, haz la verdad. Porque es grande, es poderosa, es duradera. Su valor te guiará a la condición de venerable ante los dioses.",
    author: "Campesino Khunanup",
    source: "El Cuento del Campesino Elocuente (Imperio Medio)"
  },
  {
    id: 20,
    text: "No comas pan mientras otro está de pie a tu lado, sin que le hayas tendido la mano para compartirlo.",
    author: "Escriba Any",
    source: "Las Instrucciones de Any (Imperio Nuevo)"
  }
];

/**
 * Obtiene la cita de sabiduría del día, calculada de forma segura según el día del año.
 * Usamos Date.UTC para evitar errores de cálculo en días donde cambia el horario de verano/invierno.
 */
export const getEgyptianWisdomOfTheDay = (date: Date): EgyptianWisdom => {
  // Calculamos el inicio del año y la fecha actual en formato UTC estricto
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor((current - start) / oneDay);

  // Asignamos una cita basada en el número del día
  const index = (dayOfYear - 1) % EGYPTIAN_WISDOM.length;
  return EGYPTIAN_WISDOM[index >= 0 ? index : 0];
};
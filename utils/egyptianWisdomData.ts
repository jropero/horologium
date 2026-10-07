// egyptianWisdomData.ts — Textos de sabiduría del Antiguo Egipto
// Citas auténticas de las grandes obras literarias egipcias (Sebayt y Textos Sagrados).
// Fuente principal: M. Lichtheim, Ancient Egyptian Literature, 3 vols. (1973–1980).

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
  },

  // === Más de las Instrucciones de Ptahhotep ===
  {
    id: 21,
    text: "Si eres un hombre que preside, escucha en calma las palabras del suplicante. No lo rechaces antes de que haya aliviado su corazón de lo que quería decirte.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 22,
    text: "Qué dura y penosa es la condición del que tiene el corazón vacío. El hombre de buen corazón es como un jardín en flor.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 23,
    text: "Si quieres que tu conducta sea buena y preservarte de toda clase de mal, guárdate de la codicia. Es una enfermedad grave e incurable.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 24,
    text: "No dejes que tu corazón se ensoberbezca por tu saber. Habla tanto con el ignorante como con el sabio, pues los límites del arte no pueden alcanzarse y ningún artesano llega a dominar plenamente su habilidad.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 25,
    text: "Si eres un hombre de confianza enviado por un superior a otro superior, sé exactamente tal como te envían. Realiza la misión tal como te la encargó.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 26,
    text: "El amor al trabajo es duradero; el hombre que conoce su oficio en todas sus dimensiones puede sentarse entre los grandes.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },
  {
    id: 27,
    text: "No seas codicioso al repartir tu comida, ni avaro con tus amigos. La generosidad del corazón es el ornamento del hombre de bien.",
    author: "Visir Ptahhotep",
    source: "Las Instrucciones de Ptahhotep"
  },

  // === Más de las Instrucciones de Amenemope ===
  {
    id: 28,
    text: "No te sientes a hablar con el hombre colérico ni te acerques a él en conversación. Porque la violencia se precipita de su boca como el fuego sobre la hierba.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 9"
  },
  {
    id: 29,
    text: "Guárdate de robar al pobre y de oprimir al débil. No alargues tu mano hacia el bien del anciano, ni toques la palabra del rey.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 2"
  },
  {
    id: 30,
    text: "El hombre verdaderamente silencioso se mantiene apartado del camino del mal. Es como el oro puro que ha sido sometido a la prueba del fuego.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 9"
  },
  {
    id: 31,
    text: "No saludes al poderoso con interés en tu corazón, ni busques su conversación buscando ventaja. Habla con él según tu corazón sin doblez.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 10"
  },
  {
    id: 32,
    text: "No duermas mientras que un oficial está de pie; tu alma odia a aquel que duerme cuando debe estar vigilante.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 26"
  },
  {
    id: 33,
    text: "No codicides los bienes del hombre pequeño, ni tengas hambre de su pan. La riqueza del hombre pequeño tapa la garganta del grande.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 7"
  },
  {
    id: 34,
    text: "No te fijes en el granero del hombre codicioso; no desees su trigo. El hombre que vive del trabajo de sus manos tiene más tranquilidad.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 6"
  },
  {
    id: 35,
    text: "Pon tus asuntos en manos de los dioses y tu serenidad los asombrará.",
    author: "Escriba Amenemope",
    source: "Instrucciones de Amenemope, Capítulo 22"
  },

  // === Instrucciones de Amenemhat I (Imperio Medio, Dinastía XII) ===
  {
    id: 36,
    text: "Desconfía del subordinado cuyo nombre no conoces todavía. No te acerques solo a él ni te fíes de un hermano. No hagas amigos, pues no traen nada bueno.",
    author: "Faraón Amenemhat I",
    source: "Instrucciones de Amenemhat I"
  },
  {
    id: 37,
    text: "¿Es que un hombre puede prosperar solo? Nunca llega el éxito al que trabaja sin aliados. Pero el bien que haces siempre vuelve a tu propia casa.",
    author: "Faraón Amenemhat I",
    source: "Instrucciones de Amenemhat I"
  },

  // === Instrucciones de Hardjedef (Reino Antiguo, Dinastía IV) ===
  {
    id: 38,
    text: "Funda tu casa y toma una mujer de corazón firme. Un hijo nacerá para ti. Construye una casa para ti mismo mientras vivas; no supongas que tu casa se construirá cuando mueras.",
    author: "Príncipe Hardjedef",
    source: "Las Instrucciones de Hardjedef (Reino Antiguo)"
  },
  {
    id: 39,
    text: "La excelencia del hombre es aquello que ama. El que conoce su camino y lo sigue es un hombre que vale para todos.",
    author: "Príncipe Hardjedef",
    source: "Las Instrucciones de Hardjedef (Reino Antiguo)"
  },

  // === Más de las Instrucciones para el Rey Merikare ===
  {
    id: 40,
    text: "El cobarde no tiene el Día de la Batalla en su corazón. El héroe es el que sobresale en combate, y en la tranquilidad del cielo encontrará su recompensa.",
    author: "Rey Khety III",
    source: "Instrucciones para el rey Merikare"
  },
  {
    id: 41,
    text: "Sé hábil en las palabras, para que seas fuerte. La lengua es la espada del rey, y la palabra es más poderosa que cualquier combate.",
    author: "Rey Khety III",
    source: "Instrucciones para el rey Merikare"
  },
  {
    id: 42,
    text: "Dios conoce al que actúa por Él. Provee al que actúa por Él con larga vida; los que actúan para él en la tierra no tienen enemigos.",
    author: "Rey Khety III",
    source: "Instrucciones para el rey Merikare"
  },

  // === Instrucciones de Any (Imperio Nuevo) — adicionales ===
  {
    id: 43,
    text: "No te sientes en el lugar de uno mayor que tú ni entres en la casa de otro sin ser llamado. No hagas lo que no te agrada a ti mismo si lo hicieran a ti.",
    author: "Escriba Any",
    source: "Las Instrucciones de Any"
  },
  {
    id: 44,
    text: "El doble de cualquier cosa en el mundo que hayas recibido, devuélvelo. Así tu nombre será bueno y te irá bien.",
    author: "Escriba Any",
    source: "Las Instrucciones de Any"
  },
  {
    id: 45,
    text: "No abandones a una mujer de tu casa e ignores a sus hijos. Que tu corazón no dé la espalda a tu propio hogar.",
    author: "Escriba Any",
    source: "Las Instrucciones de Any"
  },

  // === Himno al Atón (Akhenatón, Dinastía XVIII) ===
  {
    id: 46,
    text: "¡Cuán numerosas son tus obras! Son ocultas a la vista del hombre. Oh Atón único, no hay otro semejante a ti. Tú creaste la tierra según tus deseos, cuando eras el único.",
    author: "Faraón Akhenatón",
    source: "Gran Himno al Atón (Tumba de Ay, Amarna)"
  },
  {
    id: 47,
    text: "Cuando te pones en el horizonte del oeste, la tierra está en tinieblas como si estuviera muerta. Cuando amaneces en el horizonte y brillas como el Atón de día, disipas la oscuridad y derramas tus rayos.",
    author: "Faraón Akhenatón",
    source: "Gran Himno al Atón (Tumba de Ay, Amarna)"
  },
  {
    id: 48,
    text: "Los hombres se despiertan y se ponen en pie cuando tú amaneces; se lavan sus cuerpos, toman sus ropas y alaban tu aparición. Toda la tierra hace su trabajo.",
    author: "Faraón Akhenatón",
    source: "Gran Himno al Atón (Tumba de Ay, Amarna)"
  },

  // === Himno a Osiris (Imperio Nuevo) ===
  {
    id: 49,
    text: "Salve, Osiris, señor de la eternidad, rey de los dioses, cuyos nombres son múltiples, cuyas formas son sagradas. Su corazón recuerda el pasado dentro de Per-Uat.",
    author: "Sacerdotes de Abidos",
    source: "Gran Himno a Osiris (Estela de Amenmos, Dinastía XVIII)"
  },
  {
    id: 50,
    text: "Isis extiende sus alas sobre él. Impide que la tierra caiga sobre él y obliga al aire a entrar en sus pulmones. Ella hace madurar las semillas que él sembró.",
    author: "Sacerdotes de Abidos",
    source: "Gran Himno a Osiris (Estela de Amenmos, Dinastía XVIII)"
  },

  // === Himno a Ra (Libro de los Muertos) ===
  {
    id: 51,
    text: "Salve, Ra-Atum que surgiste del Nun primordial. Tú que apareces como rey de los dioses del cielo. Tu madre Nut te rodea eternamente.",
    author: "Anónimo",
    source: "Libro de los Muertos, Capítulo 15 (Himno a Ra al amanecer)"
  },
  {
    id: 52,
    text: "Tu navío de la mañana cruza el cielo con viento favorable. El corazón de Maat está contento cuando tú llegas al horizonte.",
    author: "Anónimo",
    source: "Libro de los Muertos, Capítulo 15"
  },

  // === Más del Libro de los Muertos ===
  {
    id: 53,
    text: "No he pecado contra los hombres. No he maltratado a los animales. No he cometido lo que los dioses abhorrece. No he difamado a un sirviente ante su amo.",
    author: "Alma Justificada",
    source: "Libro de los Muertos, Capítulo 125 (Confesión Negativa, selección)"
  },
  {
    id: 54,
    text: "No he causado que el hambre durase, no he hecho llorar, no he matado ni mandé matar, no hice sufrir a ningún hombre.",
    author: "Alma Justificada",
    source: "Libro de los Muertos, Capítulo 125 (Confesión Negativa)"
  },

  // === Textos de las Pirámides (Reino Antiguo) ===
  {
    id: 55,
    text: "El cielo llora por ti, la tierra tiembla ante ti; la lluvia cae cuando tú asciendes al cielo entre los dioses.",
    author: "Sacerdotes de la Casa de la Vida",
    source: "Textos de las Pirámides, Encantamiento 204 (Unas)"
  },
  {
    id: 56,
    text: "El rey no ha muerto con la muerte de un mortal; el rey ha pasado como un dios que pasa. Has llegado al lugar donde las estrellas no mueren.",
    author: "Sacerdotes de la Casa de la Vida",
    source: "Textos de las Pirámides, Encantamiento 412"
  },

  // === Canto del Arpista — versiones adicionales ===
  {
    id: 57,
    text: "No hay nadie que regrese de allá para contarnos cómo están. Para contarnos sus necesidades y calmar nuestros corazones hasta que también nosotros viajemos al lugar al que ellos fueron.",
    author: "El Arpista Ciego",
    source: "Canto del Arpista (Tumba de Nefertari)"
  },

  // === Sátira de los Oficios (Dua-Khety, Imperio Medio) ===
  {
    id: 58,
    text: "El escriba es quien dirige el trabajo de todos los hombres. Para él no hay impuestos. Cuando paga su tributo en la escritura, no lleva carga.",
    author: "Escriba Dua-Khety",
    source: "Sátira de los Oficios (Papiro Sallier II, Imperio Medio)"
  },
  {
    id: 59,
    text: "No hay oficio sin supervisor excepto el del escriba, que él mismo es el supervisor. Si conoces la escritura, te irá mejor que en cualquier profesión.",
    author: "Escriba Dua-Khety",
    source: "Sátira de los Oficios"
  },

  // === Poesía amorosa (Papiro Chester Beatty, Imperio Nuevo) ===
  {
    id: 60,
    text: "Ojalá fuera la lavandera de mi amado, aunque fuera por un solo mes; así estaría junto a su cuerpo y mi mano tocaría lo que él toca.",
    author: "Anónimo",
    source: "Poesía amorosa egipcia (Papiro Chester Beatty I, Imperio Nuevo)"
  },
  {
    id: 61,
    text: "Mi amado me turba el corazón con su mirada. Ha hecho que todos los hombres me vuelvan el cuello. Él me mira y yo prosperaré; cuando su voz llega a mis oídos, mi vida se salva.",
    author: "Anónimo",
    source: "Poesía amorosa egipcia (Papiro Chester Beatty I)"
  },

  // === Instrucciones del hombre para su hijo (Imperio Medio) ===
  {
    id: 62,
    text: "Es el dios quien da el corazón al hombre de bien, para que pueda actuar para sí mismo. El que actúa para sí mismo no quedará jamás sin beneficio.",
    author: "Anónimo",
    source: "Instrucciones de un hombre para su hijo (Imperio Medio)"
  },

  // === El Diálogo de un hombre desilusionado con su alma ===
  {
    id: 63,
    text: "La muerte está ante mí hoy como la recuperación de un enfermo, como salir al exterior tras un encierro.",
    author: "Anónimo",
    source: "El Diálogo de un hombre con su alma (Papiro Berlín 3024, Imperio Medio)"
  },
  {
    id: 64,
    text: "La muerte está ante mí hoy como el olor de las flores de loto, como sentarse en la orilla de la embriaguez.",
    author: "Anónimo",
    source: "El Diálogo de un hombre con su alma (Papiro Berlín 3024)"
  },

  // === Más del Campesino Elocuente ===
  {
    id: 65,
    text: "La balanza no se inclina; la plomada no desvía su extremo. Lo que Maat mide no tiene errores. El bien hecho hoy es el tesoro de mañana.",
    author: "Campesino Khunanup",
    source: "El Cuento del Campesino Elocuente (Imperio Medio)"
  },
  {
    id: 66,
    text: "No respondas el bien con el mal. No hagas que una cosa se ponga en lugar de otra. No hay nada que sea más grande que la palabra verdadera.",
    author: "Campesino Khunanup",
    source: "El Cuento del Campesino Elocuente"
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
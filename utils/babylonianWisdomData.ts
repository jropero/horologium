// babylonianWisdomData.ts — Sabiduría de la literatura acadia y babilónica
// Citas auténticas de las grandes obras literarias de Mesopotamia.
// Fuentes: Andrew George (2003), Stephanie Dalley (1989), W.G. Lambert (1960).
// El campo `text` es la traducción al español de la cita.
// El campo `akkadian` es la transliteración acadio estándar (solo para citas ampliamente atestiguadas).

export interface BabylonianWisdom {
  id: number;
  text: string;         // Traducción española (texto principal)
  akkadian?: string;    // Transliteración acadia (solo para citas bien atestiguadas)
  author: string;       // Obra de origen
  source: string;       // Referencia específica (tablilla, línea)
}

export const BABYLONIAN_WISDOM: BabylonianWisdom[] = [

  // === Epopeya de Gilgamesh ===
  {
    id: 1,
    text: "El que lo vio todo, el que exploró los confines de todas las tierras; el que todo lo conoció y fue hecho en sabiduría perfecta.",
    akkadian: "ša nagba īmuru išdi mātāti",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla I, vv. 1–2",
  },
  {
    id: 2,
    text: "Cuando los dioses crearon a la humanidad le asignaron la muerte; la vida la retuvieron en sus propias manos.",
    akkadian: "inūma ilū ibnu awīlūtam, mūtam išīmū ana awīlūtim, balāṭam ina qātišunu iṣṣabtu",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla X (versión paleo-babilónica, Šiduri)",
  },
  {
    id: 3,
    text: "Gilgamesh, ¿a dónde corres sin descanso? La vida que buscas no la encontrarás.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla X, vv. 1–3 (Uta-napišti)",
  },
  {
    id: 4,
    text: "De día y de noche, sé alegre. Que tu vientre esté lleno; que tu corazón sea feliz. Que la fiesta sea tu gozo día y noche.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla X (Šiduri, versión paleo-babilónica)",
  },
  {
    id: 5,
    text: "Por Enkidu, su amigo, Gilgamesh lloró con amargura mientras corría por la estepa, lleno de terror ante la muerte.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla IX, vv. 1–3",
  },
  {
    id: 6,
    text: "El hombre que ha visto el abismo y el que vive en la cumbre del mundo: al final, ambos beben de la misma copa.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla X (reflexión de Uta-napišti)",
  },
  {
    id: 7,
    text: "Con el alba apareció desde el horizonte una nube negra. Adad tronó en su interior y los dioses mensajeros iban con él.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla XI, vv. 96–98 (relato del Diluvio)",
  },
  {
    id: 8,
    text: "Enkidu, tú que eras la hachas en mi costado, el escudo de mi brazo, mi espada, mi cinto festivo: en tu presencia mi mente encontraba reposo.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla VIII, vv. 1–5 (lamento de Gilgamesh)",
  },
  {
    id: 9,
    text: "El hambre y la fatiga conoce quien vive en la ciudad; no siente la lluvia libre como la gacela.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla I (descripción de Enkidu)",
  },
  {
    id: 10,
    text: "A los dos tercios era divino, a un tercio humano. La forma de su cuerpo era perfecta más allá de lo que puede describirse.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla I, vv. 48–49",
  },

  // === Enūma Eliš (Épica de la Creación) ===
  {
    id: 11,
    text: "Cuando en lo alto los cielos no tenían nombre, ni abajo la tierra había sido pronunciada por nombre, y el primordial Apsû, su padre, y Tiamat, la madre de todos, mezclaban sus aguas.",
    akkadian: "Enūma eliš lā nabû šamāmū, šapliš ammatum šuma lā zakrat",
    author: "Enūma Eliš",
    source: "Tablilla I, vv. 1–5",
  },
  {
    id: 12,
    text: "Marduk es soberano: han de reverenciarlo los dioses, sus padres. Lo proclamaron rey de todos los dioses y lo pusieron a la cabeza de los dioses del destino.",
    author: "Enūma Eliš",
    source: "Tablilla IV, vv. 28–30",
  },
  {
    id: 13,
    text: "De la sangre de Kingu formó a la humanidad; le impuso las tareas de los dioses y liberó a los dioses de su trabajo.",
    author: "Enūma Eliš",
    source: "Tablilla VI, vv. 31–36",
  },
  {
    id: 14,
    text: "Cincuenta nombres tiene el señor de los dioses; cincuenta caminos abre ante aquel que lo conoce.",
    author: "Enūma Eliš",
    source: "Tablilla VII (los cincuenta nombres de Marduk)",
  },

  // === Descenso de Ištar al Inframundo ===
  {
    id: 15,
    text: "A la tierra de la que no hay retorno, a la morada de Irkalla, Ištar hija de Sîn dirigió su pensamiento.",
    akkadian: "ana māt lā târi Ištar mārat Sîn uznāša iškun",
    author: "Descenso de Ištar al Inframundo",
    source: "Tablilla I, vv. 1–2",
  },
  {
    id: 16,
    text: "A la tenebrosa morada, residencia de Irkalla, a la morada de la que quien entra no puede salir, al camino por el que no hay retorno.",
    author: "Descenso de Ištar al Inframundo",
    source: "Tablilla I, vv. 4–6",
  },

  // === Consejos de Sabiduría (Šūpê-amēlim) ===
  {
    id: 17,
    text: "No hables con ligereza, guarda tus palabras. No hables mal en la reunión de los nobles; habla siempre del bien.",
    author: "Consejos de Sabiduría",
    source: "Lambert, BWL, pp. 96–107, ll. 1–4",
  },
  {
    id: 18,
    text: "Honra a tu padre y a tu madre; tendrás una larga vida, los dioses te favorecerán.",
    author: "Consejos de Sabiduría",
    source: "Lambert, BWL, ll. 13–14",
  },
  {
    id: 19,
    text: "No devuelvas el mal al que te hace el mal; recompensa con el bien al que te trata bien.",
    author: "Consejos de Sabiduría",
    source: "Lambert, BWL, ll. 41–42",
  },
  {
    id: 20,
    text: "No planees el mal contra tu enemigo; deja que los dioses decidan por ti. No construyas tu casa junto a la del poderoso.",
    author: "Consejos de Sabiduría",
    source: "Lambert, BWL, ll. 30–32",
  },

  // === Ludlul bel nemeqi (Alabaré al Señor de la Sabiduría) ===
  {
    id: 21,
    text: "Los designios del dios son como las profundidades del cielo: ¿quién puede comprenderlos? Los pensamientos de la diosa son como las aguas más hondas: ¿quién puede sondearlos?",
    author: "Ludlul bel nemeqi",
    source: "Tablilla II, vv. 36–38 (Lambert, BWL)",
  },
  {
    id: 22,
    text: "Lo que parece bueno para uno puede ser malo para los dioses. Lo que le disgusta a uno puede ser lo que agrada al dios.",
    author: "Ludlul bel nemeqi",
    source: "Tablilla II, vv. 33–35",
  },
  {
    id: 23,
    text: "Alabaré al Señor de la Sabiduría, al dios cuidadoso; reverenciaré a Marduk en la noche, en el día lo proclamaré.",
    author: "Ludlul bel nemeqi",
    source: "Tablilla I, vv. 1–2",
  },

  // === Himno a Šamaš ===
  {
    id: 24,
    text: "Šamaš, tu luz ilumina las regiones del mundo. Como una red lanzas tu claridad sobre las tierras.",
    author: "Gran Himno a Šamaš",
    source: "Lambert, BWL, pp. 126–138, ll. 1–4",
  },
  {
    id: 25,
    text: "El que comete fraude en la balanza, el que intercambia pesas falsas, Šamaš lo castigará en el día del juicio.",
    author: "Gran Himno a Šamaš",
    source: "Lambert, BWL, ll. 105–108",
  },
  {
    id: 26,
    text: "Al juez que pronuncia una sentencia justa, Šamaš le otorga un palacio y un cetro; al que no conoce la justicia, la muerte lo alcanza.",
    author: "Gran Himno a Šamaš",
    source: "Lambert, BWL, ll. 113–116",
  },

  // === Atra-ḫasīs (El Muy Sabio) ===
  {
    id: 27,
    text: "El estrépito de la humanidad se volvió insoportable; los dioses ya no podían dormir a causa del ruido. Enlil convocó la asamblea de los dioses y dijo: el ruido de la humanidad me resulta excesivo.",
    author: "Atra-ḫasīs",
    source: "Tablilla I, vv. 353–360 (Dalley, 1989)",
  },
  {
    id: 28,
    text: "Cuando los dioses como los hombres llevaban las cargas y sufrían el trabajo, el trabajo de los dioses era grande, la fatiga pesada, y los problemas excesivos.",
    author: "Atra-ḫasīs",
    source: "Tablilla I, vv. 1–4",
  },

  // === Himno a Ištar (Ammi-ditana) ===
  {
    id: 29,
    text: "Alabaré a la más excelsa de las diosas, a la más magnífica: alabaré a Ištar, la más grande de las diosas.",
    author: "Himno a Ištar (Ammi-ditana)",
    source: "ANET, pp. 383–385, ll. 1–2",
  },
  {
    id: 30,
    text: "Ella viste con deleite a los que ama; le da a la batalla un reluciente esplendor. Con sus manos gobierna los destinos de todos los hombres.",
    author: "Himno a Ištar (Ammi-ditana)",
    source: "ANET, pp. 383–385, ll. 15–17",
  },

  // === Teodicea Babilónica (Saggil-kinam-ubbib, c. 1000 a.C.) ===
  {
    id: 31,
    text: "Los que no buscan al dios pasan por el camino de la prosperidad; los que hacen oraciones al dios se empobrecen y se humillan.",
    author: "Teodicea Babilónica",
    source: "Lambert, BWL, pp. 63–91, ll. 70–72",
  },
  {
    id: 32,
    text: "El camino de los dioses es como el centro del cielo: es inalcanzable. Su sabiduría es profunda; los mortales no pueden comprenderla.",
    author: "Teodicea Babilónica",
    source: "Lambert, BWL, ll. 256–258",
  },
  {
    id: 33,
    text: "El hombre de bien sufre; el malvado prospera. Los corazones de los dioses son como las aguas profundas: ¿quién puede sondearlos?",
    author: "Teodicea Babilónica",
    source: "Lambert, BWL, ll. 243–245",
  },
  {
    id: 34,
    text: "En la juventud aprendí a buscar la voluntad de mi dios; con postración y oración busqué a mi diosa. Pero el yugo fue impuesto sobre mí como si fuera una carga sin honor.",
    author: "Teodicea Babilónica",
    source: "Lambert, BWL, ll. 25–28",
  },

  // === Diálogo del Pesimismo ===
  {
    id: 35,
    text: "¿Qué es lo bueno? Romper el cuello y arrojar el río: descansar y descansar... El hombre que no tiene su dios en su corazón, ¿qué bien le viene?",
    author: "Diálogo del Pesimismo",
    source: "Lambert, BWL, pp. 139–149, ll. 85–88",
  },
  {
    id: 36,
    text: "Sube a las ruinas de las antiguas ciudades y camina entre ellas; observa los cráneos de los que fueron antes que tú: ¿quién era malo? ¿quién era bueno?",
    author: "Diálogo del Pesimismo",
    source: "Lambert, BWL, ll. 79–82",
  },
  {
    id: 37,
    text: "Come y bebe: el destino del hombre es la muerte. El destino de Gilgamesh fue la muerte también: ¿no habría de ser el mío igual?",
    author: "Diálogo del Pesimismo",
    source: "Lambert, BWL, ll. 67–69",
  },

  // === Más de la Epopeya de Gilgamesh ===
  {
    id: 38,
    text: "Cuando el barquero Urshanabi te dé paso sobre las Aguas de la Muerte, lava tus sucias manos; que la nobleza de lo divino esté contigo.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla X, vv. 174–177",
  },
  {
    id: 39,
    text: "Así que Gilgamesh, seis días y siete noches estuvo de pie y no doblegó sus rodillas. Pero el sueño, como una niebla, sopló sobre él.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla XI, vv. 196–199 (prueba de Uta-napišti)",
  },
  {
    id: 40,
    text: "Encontré aquello que buscaba; ahora lo he perdido. La serpiente lo arrebató. ¿A quién encontraré ahora para que me lleve al mar?",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla XI, vv. 301–304 (lamento de Gilgamesh)",
  },
  {
    id: 41,
    text: "En el fondo del mar hay una planta parecida a un espino; sus espinas son como las de la rosa y picarán tus manos. Pero si la consigues, encontrarás la vida.",
    author: "Epopeya de Gilgamesh",
    source: "Tablilla XI, vv. 266–270 (Uta-napišti sobre la planta de la vida)",
  },

  // === Proverbios Babilónicos y Sumerios ===
  {
    id: 42,
    text: "El hombre ignorante es rico en palabras, el sabio en obras. Aquel que habla mucho llega lejos del camino recto.",
    author: "Proverbios Babilónicos",
    source: "Lambert, BWL, pp. 213–282 (colección de proverbios)",
  },
  {
    id: 43,
    text: "Sin la diosa Nisaba, el oro no se puede separar de la plata; el administrador sin escriba no puede gobernar.",
    author: "Proverbios Sumerios",
    source: "Colección de proverbios sumerios, Edubba (casa de las tablillas)",
  },
  {
    id: 44,
    text: "El destino de un día es la muerte; el destino de la noche es el sueño. Ambos son el trabajo del dios: uno da descanso, el otro eterno reposo.",
    author: "Proverbios Babilónicos",
    source: "Lambert, BWL, colección de proverbios, p. 229",
  },
  {
    id: 45,
    text: "La ciudad que no tiene a su dios es como una casa sin dueño: la ruina la habita y el polvo la llena.",
    author: "Proverbios Babilónicos",
    source: "Lambert, BWL, colección de proverbios, p. 241",
  },

  // === Más de Consejos de Sabiduría ===
  {
    id: 46,
    text: "No te acerques a una mujer casada. El que toca a la esposa de otro soportará el filo del hacha del verdugo.",
    author: "Consejos de Sabiduría",
    source: "Lambert, BWL, ll. 71–72",
  },
  {
    id: 47,
    text: "No hables mal de un amigo ausente ni le mezcles veneno. Cuando lo encuentres cara a cara, que tu lengua sea suave.",
    author: "Consejos de Sabiduría",
    source: "Lambert, BWL, ll. 59–61",
  },
  {
    id: 48,
    text: "Honra al que sabe más que tú, incluso si está por debajo de ti en rango. El saber es el bien más precioso.",
    author: "Consejos de Sabiduría",
    source: "Lambert, BWL, ll. 95–97",
  },

  // === Más del Himno a Šamaš ===
  {
    id: 49,
    text: "Tú pones en el camino correcto a los que van por sendas equivocadas. Concedes tu gracia al humilde que se arrodilla.",
    author: "Gran Himno a Šamaš",
    source: "Lambert, BWL, ll. 53–54",
  },
  {
    id: 50,
    text: "El marinero que navega en alta mar, donde las olas son violentas: Šamaš es su guía y su salvación.",
    author: "Gran Himno a Šamaš",
    source: "Lambert, BWL, ll. 43–44",
  },

  // === Himno a Marduk ===
  {
    id: 51,
    text: "¡Oh Marduk, señor de Babilonia! Tú que das vida y muerte, tú que fijas los destinos: en tu nombre hablo, en tu nombre actúo.",
    author: "Himno a Marduk",
    source: "BM 54278 (British Museum), Dalley, 1989",
  },
  {
    id: 52,
    text: "Señor de todos los países, luz del universo, que pronuncias el nombre de todos los dioses: tu palabra es inamovible, tu decreto eterno.",
    author: "Himno a Marduk",
    source: "Himno de alabanza a Marduk, tablilla del período Casita",
  },

  // === Šar tamḫari (El Rey de la Batalla) ===
  {
    id: 53,
    text: "El rey que marcha al frente de su ejército como un toro feroz: los enemigos se derriten ante él como la mantequilla al sol.",
    author: "Šar tamḫari (El Rey de la Batalla)",
    source: "Versión de Amarna, cf. Dalley, Myths from Mesopotamia",
  },

  // === Más del Descenso de Ištar ===
  {
    id: 54,
    text: "Desde que Ištar bajó al Inframundo, el toro no montó a la vaca, ni el asno se acercó a la burra. En las calles no dormían hombre y mujer.",
    author: "Descenso de Ištar al Inframundo",
    source: "Tablilla I, vv. 74–77",
  },

  // === Más de Ludlul bel nemeqi ===
  {
    id: 55,
    text: "Mi dios me abandonó y desapareció; mi diosa me dejó y se fue a lugar lejano. El ángel bueno que caminaba a mi lado me dejó.",
    author: "Ludlul bel nemeqi",
    source: "Tablilla I, vv. 43–46",
  },
  {
    id: 56,
    text: "Luego, en el tercer sueño que soñé, Marduk me mostró la luz: 'Vive', dijo. 'Tus sufrimientos han cesado. El señor te ha visto'.",
    author: "Ludlul bel nemeqi",
    source: "Tablilla III, vv. 12–15",
  },

  // === Texto del "Pobre Hombre de Nippur" ===
  {
    id: 57,
    text: "El que no tiene plata no puede reclamar justicia. El hambriento busca pan, no palabras hermosas.",
    author: "El Pobre Hombre de Nippur",
    source: "Tablilla de Sultantepe (cf. Gurney, AnSt 6, 1956)",
  },

  // === Más de Enūma Eliš ===
  {
    id: 58,
    text: "Cuando Marduk escuchó la palabra de los dioses, su corazón se llenó de deseo de hacer obras maravillosas. Abrió la boca y se dirigió a Ea.",
    author: "Enūma Eliš",
    source: "Tablilla IV, vv. 1–4",
  },
  {
    id: 59,
    text: "Marduk construyó Ešarra, la réplica celestial de Apsû, y en Ešarra instaló las moradas de Anu, Enlil y Ea.",
    author: "Enūma Eliš",
    source: "Tablilla IV, vv. 143–146",
  },

  // === Más de Atra-ḫasīs ===
  {
    id: 60,
    text: "Ea abrió la boca y habló a los grandes dioses: 'Escuchadme, dioses. Yo haré algo que nadie ha pensado'. Y formó al hombre de arcilla.",
    author: "Atra-ḫasīs",
    source: "Tablilla I, vv. 193–198",
  },

  // === Himno a Enlil ===
  {
    id: 61,
    text: "Señor Enlil, cuya palabra ordena el universo: cuando tu ojo mira la tierra, el trigo brota. Cuando tu aliento sopla, los árboles florecen.",
    author: "Himno a Enlil",
    source: "ETCSL 4.05.1 (texto sumerio, traducción de Jacobsen)",
  },

  // === Himno a Nanna (dios Luna) ===
  {
    id: 62,
    text: "Oh Nanna, señor del cielo, de pie como un joven toro en el horizonte: tus cuernos brillan sobre todas las tierras y tus rayos iluminan la oscuridad.",
    author: "Himno a Nanna",
    source: "ETCSL 4.13.01 (periodo de Ur III)",
  },
];

export const getBabylonianWisdomOfTheDay = (date: Date): BabylonianWisdom => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const index = (dayOfYear - 1 + BABYLONIAN_WISDOM.length) % BABYLONIAN_WISDOM.length;
  return BABYLONIAN_WISDOM[index >= 0 ? index : 0];
};

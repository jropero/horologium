export interface BabylonianDayEvent {
  shortLabel: string;   // Brief name shown in the day cell tooltip
  description: string;  // Full description shown on selection
  type: 'akitu' | 'procession' | 'mourning' | 'marriage' | 'ritual' | 'festival' | 'astronomy';
}

export interface BabylonianLore {
  monthName: string;    // Akkadian name
  deity: string;        // Patron deity
  description: string;  // 1-2 sentences about the month
  festival: string;     // Main festival or ritual
  zodiacSign: string;   // Babylonian zodiac sign
  icon: string;         // emoji
  dayEvents?: Record<number, BabylonianDayEvent>; // specific events keyed by day of month
}

export const BABYLONIAN_MONTH_LORE: BabylonianLore[] = [
  {
    monthName: 'Nisannu',
    deity: 'Marduk',
    description: 'El inicio del año sagrado — el Akītu de primavera se celebra en Babilonia durante once días. La estatua de Marduk parte del Esagila en gran procesión hacia el Bīt Akitu extramuros; en la cuarta noche los sacerdotes recitan el Enūma Eliš ante el dios. El rey es humillado ante Marduk, entrega su cetro y confiesa sus faltas; el día 8.º recupera su poder soberano para otro año.',
    festival: 'Akītu (Año Nuevo) — procesión de Marduk al Bīt Akitu; recitación del Enūma Eliš la noche del 4.º día; humillación y reinvestidura del rey ante Marduk el día 8.º.',
    zodiacSign: 'Agru',
    icon: '🌿',
    dayEvents: {
      1:  { shortLabel: 'Akītu comienza', description: 'El Akītu del año nuevo da inicio. La estatua de Marduk abandona el Esagila y parte en procesión hacia el Bīt Akitu extramuros de Babilonia.', type: 'akitu' },
      4:  { shortLabel: 'Enūma Eliš', description: 'En la noche del cuarto día, los sacerdotes recitan el Enūma Eliš — el poema de la creación — ante Marduk. El rey es humillado: depone su cetro y confiesa sus pecados ante el dios.', type: 'ritual' },
      8:  { shortLabel: 'Gran procesión', description: 'La gran procesión de Marduk regresa del Bīt Akitu al Esagila. El rey recupera su cetro y es reinvestido de autoridad real para el año venidero.', type: 'procession' },
      11: { shortLabel: 'Akītu concluye', description: 'El Akītu de once días concluye. Los destinos del año son fijados en la Asamblea de los Dioses en el templo Upuruppuu de Babylon.', type: 'akitu' },
    },
  },
  {
    monthName: 'Ayaru',
    deity: 'Ningirsu',
    description: 'El mes en que «la tierra se abre, los bueyes son uncidos y el campo se vuelve fértil» (Astrolabio B). Las Pléyades — las Sibitti — ascienden en el cielo del atardecer. El día 2, Nabû viaja desde Borsippa hasta el Ebursaba de Babilonia para desposar a la diosa Nana; el día 7, Nabû llega a Uruk y asume la corona de Anu como rey de los dioses.',
    festival: 'Matrimonio de Nabû y Nana — el día 2 Nabû parte del Ezida y entra al Ebursaba; el día 7 asume la coronación de Anu en el Eanna de Uruk; carreras sagradas de Nabû.',
    zodiacSign: 'Gudanna',
    icon: '🐮',
    dayEvents: {
      2:  { shortLabel: 'Boda de Nabû', description: 'Nabû parte del Ezida de Borsippa hacia Babilonia. Entra en el Ebursaba como desposado y se une a Nana, la diosa: «como la luna brillante ilumina la oscuridad.»', type: 'marriage' },
      6:  { shortLabel: 'Exposición de Nabû', description: 'La estatua de Nabû es llevada al jardín del templo para ser mostrada públicamente a los fieles, resplandeciente tras su boda con Nana.', type: 'procession' },
      7:  { shortLabel: 'Coronación de Nabû', description: 'Nabû llega al Eanna de Uruk y asume la corona de Anu como rey de los dioses: «porque ha tomado el reinado de Anu… viste la corona de Anu y [la palma de dátiles].»', type: 'ritual' },
      13: { shortLabel: 'E-ma de Ištar', description: 'En Asiria, el e-ma de Ištar se celebra en el Bīt Akitu. Aššur, Ninlil, Ninurta y Adad asisten al banquete del Akitu. Mesa preparada, ovejas sacrificadas, carne cocida ofrendada.', type: 'festival' },
    },
  },
  {
    monthName: 'Simanu',
    deity: 'Sîn',
    description: '«El mes del molde de ladrillos del rey; el rey usa el molde de ladrillos; todos los países construyen sus casas» (Astrolabio B). El rey coloca simbólicamente el primer ladrillo en el horno para inaugurar la temporada de construcción. El día 9, ritos junto al kiln del Eanna de Uruk; el día 25, la Señora de Babilonia (Bēlet-Babili) procesiona por las calles.',
    festival: 'Ritos del molde de ladrillos — el rey inaugura la temporada de construcción; ofrendas junto al horno del Eanna el día 9.º; procesión de Bēlet-Babili el día 25.º.',
    zodiacSign: 'Mastabbagalgal',
    icon: '🧱',
    dayEvents: {
      9:  { shortLabel: 'Ritos del horno', description: 'En el Eanna de Uruk, la diosa Askajaitu abandona su capilla. Se realiza un rito junto al kiln donde se cuecen los ladrillos: ocho ovejas son sacrificadas en las entradas del Eanna y se repite el rito en el horno.', type: 'ritual' },
      15: { shortLabel: 'Señora de los Dioses', description: 'En Babilonia, festival para la «Señora de los Dioses» en el Esagila. Las ofrendas y cánticos honran a la gran diosa del panteón.', type: 'festival' },
      25: { shortLabel: 'Procesión de Bēlet-Babili', description: 'En Nínive, Asurbanipal celebró: «En el mes Simanu, mes de Sin… el día 25, en que se celebra la procesión de la Señora de Babilonia.» La diosa recorre las calles de la ciudad.', type: 'procession' },
    },
  },
  {
    monthName: 'Duʾūzu',
    deity: 'Dumuzi',
    description: 'El gran mes del lamento: Dumuzi, el pastor-dios, es capturado por los demonios galla y arrastrado al Inframundo. «En el mes Dumuzi, cuando Ištar hizo llorar a las gentes de la tierra por Dumuzi, su amado.» Del día 26 al 28, la estatua del dios es expuesta sobre un féretro mientras lamentaciones llenan los templos. El día 11, las diosas del Esagila e Ezida se intercambian de morada para «alargar las noches» del solsticio de verano.',
    festival: 'Lamentaciones de Dumuzi-Tammuz — exposición del dios sobre un féretro los días 26.º–28.º; cantos fúnebres en las puertas de los templos; intercambio ritual de diosas entre el Esagila y el Ezida el día 11.º.',
    zodiacSign: 'Pulukku',
    icon: '🥀',
    dayEvents: {
      11: { shortLabel: 'Intercambio de diosas', description: 'Las hijas del Esagila (Silluštab y KA.TUN-na) van al Ezida: «En Dumuzi las noches son cortas; para alargar las noches las hijas del Esagila van al Ezida — el Ezida es la Casa de la Noche.» Rito del solsticio de verano.', type: 'ritual' },
      26: { shortLabel: 'Día del grito', description: '«El día 26 es el día del clamor.» En Asiria comienza la exposición ritual de la estatua de Dumuzi; el lamento colectivo se extiende por Nínive, Asur y Cala.', type: 'mourning' },
      27: { shortLabel: 'Dumuzi apresado', description: '«El día 27 es cuando él es capturado.» La estatua de Dumuzi yace sobre un féretro. En Uruk, el sacerdote kalu susurra encantaciones al oído del ídolo de madera para intentar revivirlo.', type: 'mourning' },
      28: { shortLabel: 'Día de Tammuz', description: '«El día 28 es el Día de Tammuz.» En Arbela la exposición dura hasta el 29. Un texto neoasirio describe: el cadáver del dios «asciende a las regiones superiores» cuando se empapa su imagen en cerveza.', type: 'mourning' },
    },
  },
  {
    monthName: 'Abu',
    deity: 'Gilgameš',
    description: 'El mes de los muertos — la festividad ab/pum consiste en un montículo sagrado sobre la entrada al Inframundo por donde los difuntos retornan al mundo de los vivos. Se encienden antorchas y braseros para que los muertos encuentren el camino. Durante nueve días se celebran carreras y combates de lucha en honor de Gilgameš. La noche del día 28, el exorcismo Maqlu es recitado para expulsar a las brujas que regresan del Sheol.',
    festival: 'Festival ab/pum — encendido de antorchas para los Anunnaki; combates y certámenes atléticos por nueve días en honor de Gilgameš; recitación del Maqlu la noche del día 28.º.',
    zodiacSign: 'Urgula',
    icon: '🔥',
    dayEvents: {
      1:  { shortLabel: 'Ab/pum se abre', description: 'El montículo sagrado (ab/pum) se abre sobre la puerta del Inframundo. Los difuntos regresan al mundo de los vivos; sus familias encienden antorchas y braseros en los umbrales para guiarlos. Los sacerdotes realizan ofrendas especiales a los Anunnaki.', type: 'ritual' },
      16: { shortLabel: 'Certámenes de Gilgameš', description: 'Comienzan nueve días de carreras a pie, luchas y certámenes atléticos en honor de Gilgameš. Los competidores representan la búsqueda del héroe en el Bosque de los Cedros: el que vence encarna a Gilgameš triunfante.', type: 'festival' },
      28: { shortLabel: 'Maqlu — exorcismo', description: 'La noche del día 28, el exorcista (āšipu) recita el ciclo ritual completo del Maqlu: nueve tablillas de conjuros para expulsar a las brujas que regresan del Sheol junto a los muertos. Se queman figuras de barro que representan a las brujas.', type: 'ritual' },
    },
  },
  {
    monthName: 'Ulūlu',
    deity: 'Ištar',
    description: '«La obra de las diosas» (gipir Ištarāte) — las estatuas de las diosas son llevadas al río sagrado para su lustración y purificación anual. En todo el país los templos celebran ritos de consagración. El día 3, Nabû abandona su morada y las puertas del Esagila se abren para Bēl y Nabû; en Uruk se celebra un matrimonio sagrado entre Anu y Antu. El día 17, el Akītu de Ištar de Arbela se celebra en Milkiya.',
    festival: '«Obra de las diosas» — lustración de estatuas divinas en el río sagrado; asamblea de los dioses en el Eturnunna el día 3.º; matrimonio sagrado de Anu y Antu en Uruk; Akītu de Ištar de Arbela el día 17.º.',
    zodiacSign: 'Širu',
    icon: '🌊',
    dayEvents: {
      1:  { shortLabel: 'Lustración de las diosas', description: '«La obra de las diosas» (gipir Ištarāte) da inicio. Las estatuas de las grandes diosas son transportadas en procesión hasta el río sagrado, donde son bañadas y purificadas con agua corriente antes de retornar a sus templos consagradas para el nuevo año.', type: 'procession' },
      3:  { shortLabel: 'Matrimonio de Anu y Antu', description: 'Nabû abandona su morada y las puertas del Esagila se abren para Bēl y Nabû. En el Eanna de Uruk, Anu y Antu celebran su matrimonio sagrado en el Eturnunna: las estatuas comparten el lecho divino mientras los sacerdotes recitan himnos nupciales.', type: 'marriage' },
      17: { shortLabel: 'Akītu de Ištar de Arbela', description: 'El Akītu de Ištar de Arbela se celebra en el santuario de Milkiya, extramuros de la ciudad. El rey acompaña la procesión de la diosa; las profetisas (raggintu) de Arbela proclaman oráculos en nombre de Ištar la guerrera.', type: 'akitu' },
    },
  },
  {
    monthName: 'Tašrītu',
    deity: 'Enlil',
    description: 'El segundo Akītu del año — el contrapeso otoñal de la gran fiesta de Nisannu. El día 3, Bēl es vestido para el festival; el día 8, la gran puerta del Esagila se abre y el Enūma Eliš es recitado ante el dios; la procesión de Bēl parte hacia el Bīt Akitu como en primavera. El día 27, en Nippur se celebra el festival del Montículo Sagrado con ofrendas a los antepasados de Enlil. «Las primicias del año son santificadas» (Astrolabio B).',
    festival: 'Segundo Akītu — Bēl procesiona al Bīt Akitu el día 8.º; Enūma Eliš recitado por los cantores; en Uruk, Anu reside siete días en el Bīt Akitu y retorna en gran procesión; festival del Montículo Sagrado en Nippur el día 27.º.',
    zodiacSign: 'Zibanitu',
    icon: '⚖️',
    dayEvents: {
      3:  { shortLabel: 'Preparación de Bēl', description: 'Los sacerdotes visten a la estatua de Bēl-Marduk con sus ropas de festival. El Esagila es decorado con guirnaldas de lana teñida y ofrendas de oro. Se preparan las barcas procesionales para transportar a los dioses al Bīt Akitu.', type: 'ritual' },
      8:  { shortLabel: 'Segundo Akītu', description: 'La gran puerta del Esagila se abre. Los cantores recitan el Enūma Eliš ante Marduk por segunda vez en el año. La procesión de Bēl parte hacia el Bīt Akitu otoñal; en Uruk, Anu reside siete días en el Bīt Akitu antes de su retorno triunfal.', type: 'akitu' },
      27: { shortLabel: 'Festival del Montículo', description: 'En Nippur, el festival del Montículo Sagrado (dūru) reúne a las comunidades para realizar ofrendas a los antepasados de Enlil. Los difuntos de linajes nobles son honrados con banquetes funerarios; sus nombres son recitados ante el dios.', type: 'festival' },
    },
  },
  {
    monthName: 'Araḫsamnu',
    deity: 'Adad',
    description: '«El mes en que el arado es liberado; la azada y el arado se disputan en el campo; el Akītu de la estación de la siembra se celebra; el mes de Adad, inspector de los canales del cielo y la tierra» (Astrolabio B). La Disputa entre la Azada y el Arado —conservada en sumerio— es recitada durante el festival. El arado es colgado en el granero hasta el año siguiente.',
    festival: 'Akītu de la siembra (a-ki-tu ur) — el arado es liberado del campo y guardado; recitación de la Disputa Azada-Arado; ofrendas a Adad para propiciar las lluvias de invierno y los canales.',
    zodiacSign: 'Zuqaqīpu',
    icon: '🌱',
    dayEvents: {
      1:  { shortLabel: 'Akītu de la siembra', description: 'El Akītu de la estación de la siembra (a-ki-tu ur) da inicio. Los agricultores llevan el arado al campo en procesión; sacerdotes de Adad bendicen los bueyes y los canales de riego. El Inspector de los Canales del Cielo — el propio Adad — es invocado para traer lluvias fértiles.', type: 'akitu' },
      18: { shortLabel: 'Disputa Azada–Arado', description: 'Los cantores recitan la «Disputa de la Azada y el Arado» en sumerio ante los dioses. El debate literario entre los dos instrumentos decide cuál es más valioso para la civilización. Al concluir, el arado es descolgado del campo y guardado en el granero hasta el año siguiente.', type: 'ritual' },
    },
  },
  {
    monthName: 'Kislīmu',
    deity: 'Nergal',
    description: '«El héroe poderoso Nergal que ha surgido del Inframundo, el arma abrumadora de los dos dioses» (Astrolabio B). En Kislīmu se corren carreras a pie en torno a cada centro de culto, rememorando la victoria de Ninurta sobre el pájaro Anzû. En el Eanna de Uruk, el Festival del Brasero (Kinunu) se celebra los días 1.º, 2.º, 6.º, 7.º, 14.º y 15.º: fuegos son encendidos en los braseros de todos los dioses.',
    festival: 'Festival del Brasero (Kinunu) — fuegos encendidos en los braseros de todos los dioses del Eanna; carreras a pie en cada ciudad en honor de la victoria de Ninurta sobre el Anzû.',
    zodiacSign: 'Pabilsag',
    icon: '🪔',
    dayEvents: {
      1:  { shortLabel: 'Kinunu — día 1', description: 'Primer día del Festival del Brasero (Kinunu) en el Eanna de Uruk. Al anochecer se encienden braseros en cada capilla del complejo; los sacerdotes alimentan los fuegos con maderas aromáticas. El humo perfumado asciende a los dioses del firmamento.', type: 'festival' },
      2:  { shortLabel: 'Kinunu — día 2', description: 'Segundo día del Kinunu. Las carreras a pie rodean el perímetro del templo rememorando la persecución del pájaro Anzû por Ninurta. Los victoriosos reciben guirnaldas de lana teñida en los colores del dios.', type: 'festival' },
      6:  { shortLabel: 'Kinunu — día 6', description: 'Día 6 del Kinunu: los braseros se renuevan con aceite fresco. Se realizan ofrendas nocturnas adicionales a Nergal, señor del Inframundo, para que proteja a los vivos durante el mes más frío.', type: 'festival' },
      7:  { shortLabel: 'Kinunu — día 7', description: 'Día 7 del Kinunu. El sacerdote šangû inspecciona personalmente los braseros de los grandes dioses del Eanna. Se ofrecen dátiles, cerveza y carne asada a Nergal y Ereshkigal en representación de los dioses del mundo inferior.', type: 'festival' },
      14: { shortLabel: 'Kinunu — día 14', description: 'Día 14 del Kinunu. Los braseros arden toda la noche; guardias del templo los vigilan. Las listas de préstamos y contratos del año son revisadas ante los dioses para su sanción divina.', type: 'festival' },
      15: { shortLabel: 'Kinunu — día 15', description: 'Día 15 y último del Kinunu: los braseros son apagados al amanecer y los residuos cenizosos son arrojados al río en señal de purificación. Las carreras finales concluyen el festival con un banquete comunal en el átrio del Eanna.', type: 'festival' },
    },
  },
  {
    monthName: 'Ṭebētu',
    deity: 'Anu',
    description: '«El mes Ṭebētu, el gran festival de Anu, el esplendor de Ištar» (Astrolabio B). El día 16, el Akītu de Ištar: «ella ilumina el Emagmaš; el rey es vestido de ropas puras.» Los días más cortos del año; el día 3, las diosas del Esagila y del Ezida se intercambian de templos para «alargar el día» y restablecer el equilibrio cósmico tras el solsticio. El Festival Nabru examina los presagios para el año venidero.',
    festival: 'Gran festival de Anu; Akītu de Ištar el día 16.º; intercambio ritual de diosas entre el Esagila y el Ezida para corregir el desequilibrio del solsticio de invierno; Festival Nabru de presagios.',
    zodiacSign: 'Suḫurmāšu',
    icon: '❄️',
    dayEvents: {
      3:  { shortLabel: 'Intercambio de diosas', description: 'Las hijas del Esagila van al Ezida y viceversa en el rito que «alarga el día» tras el solsticio de invierno. Este espejo del rito de Duʾūzu (que acortaba las noches) restaura el equilibrio cósmico: «el Ezida es la Casa de la Noche — las diosas traen su luz para alargar el día.»', type: 'ritual' },
      16: { shortLabel: 'Akītu de Ištar', description: 'El Akītu de Ištar ilumina el Emagmaš de Uruk. «El rey es vestido de ropas puras»: investido nuevamente ante la diosa guerrera. Los adivinos (bārû) examinan los presagios celestes para el año venidero en el Festival Nabru; sus tablillas son depositadas en el archivo del Esagila.', type: 'akitu' },
    },
  },
  {
    monthName: 'Šabāṭu',
    deity: 'Nabû',
    description: '«En Šabāṭu es el matrimonio de los dioses» — Bēl desposa a Beltiya; Nabû desposa a Tašmētu. Este mes abre el tramo más intenso del año litúrgico: el período Šabāṭu–Addaru–Nisannu. Desde el día 16, durante ocho días se recitan ante Aššur en el Bīt Dagan grandes lamentaciones sumerias, himnos y plegarias luilla; los peregrinos acuden desde todo el reino.',
    festival: 'Matrimonio sagrado de Bēl–Beltiya y Nabû–Tašmētu; ocho días de lamentaciones y cantos ante Aššur en el Bīt Dagan desde el día 16.º; «mes del banquete de Enlil» en Nippur.',
    zodiacSign: 'Gula',
    icon: '💍',
    dayEvents: {
      7:  { shortLabel: 'Matrimonio sagrado', description: 'Bēl desposa a Beltiya, su esposa divina; simultáneamente Nabû desposa a Tašmētu en el Ezida de Borsippa. El rito del hieros gamos une a los dioses del panteón en alianza: las estatuas son colocadas juntas en el lecho sagrado del adytu mientras los cantores recitan himnos nupciales.', type: 'marriage' },
      16: { shortLabel: 'Lamentaciones ante Aššur', description: 'Comienzan ocho días de lamentaciones sumerias (ershemma) en el Bīt Dagan de Asur. Los cantores (kalû) recitan himnos luilla mientras los peregrinos de todo el reino velan ante la imagen de Aššur. Las plegarias invocan la protección del dios para el reino ante las incertidumbres del año por venir.', type: 'mourning' },
    },
  },
  {
    monthName: 'Addaru',
    deity: 'Ea',
    description: '«En los vastos campos de Ningirsu la hoz no es abandonada; el mes de la alegría de Enki, el mes de Ea» (Astrolabio B). El festival garratu se celebra los días 17 y 18. El día 6, las estatuas de los dioses parten en solemne procesión. Los astrónomos del Esagila calculan si el año necesita un Addaru II intercalar; si Nisannu aún no alcanza la primavera, proclaman el décimotercero mes.',
    festival: 'Festival garratu los días 17.º y 18.º; procesión solemne de los dioses el día 6.º; cómputo astronómico del posible mes intercalar Addaru II para realinear el calendario lunar con las estaciones solares.',
    zodiacSign: 'Zibbātu',
    icon: '🌾',
    dayEvents: {
      6:  { shortLabel: 'Gran procesión de los dioses', description: 'Las estatuas de todos los grandes dioses del panteón parten en solemne procesión por las calles de Babilonia. El desfile sirve como despedida simbólica del año que cierra: los dioses «revisan» su ciudad antes del Akītu de primavera.', type: 'procession' },
      17: { shortLabel: 'Festival garratu', description: 'El festival garratu honra la cosecha antes del nuevo año. Se realizan ofrendas masivas de cebada, dátiles y cerveza a Ea, señor de la sabiduría y las aguas dulces. Los astrónomos del Esagila presentan sus cálculos al rey: si el próximo Nisannu llega antes del equinoccio de primavera, se proclama el mes intercalar Addaru II.', type: 'festival' },
      18: { shortLabel: 'Garratu — segundo día', description: 'Segundo día del garratu: banquetes en los patios de los grandes templos; los granjeros traen ofrendas de las primicias de la cosecha. En las tablillas astronómicas, los escribas registran la posición de la luna y el sol para confirmar o descartar el mes intercalar.', type: 'astronomy' },
    },
  },
];

export const getBabylonianLore = (monthName: string): BabylonianLore | undefined =>
  BABYLONIAN_MONTH_LORE.find(l => l.monthName === monthName || monthName.startsWith(l.monthName));

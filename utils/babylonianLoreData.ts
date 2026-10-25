import { BABYLONIAN_MONTH_REGENTS } from '../types/babylonia';

export interface BabylonianFonte {
  title: string;    // e.g. "Enūma Eliš · Tablilla IV"
  excerpt: string;  // verbatim excerpt, translated to Spanish
  source: string;   // edition citation
}

export interface BabylonianDayEvent {
  shortLabel: string;   // Brief name shown in the day cell tooltip
  description: string;  // Full description shown on selection
  type: 'akitu' | 'procession' | 'mourning' | 'marriage' | 'ritual' | 'festival' | 'astronomy';
  fonte?: BabylonianFonte;
}

export interface BabylonianLore {
  monthName: string;      // Akkadian name
  monthGloss: string;     // Spanish epithet of the month, quoted from its description (« » = a quotation there, mostly Astrolabe B)
  monthRegent: string;    // Canonical regent of the month (cuneiform regent lists)
  festivalDeity: string;  // Deity presiding the month's main festival / Astrolabe B menology
  festivalDeityGloss?: string; // Spanish epithet of festivalDeity, quoted from MONTH_REGENT_DESCS or this month's description
  regentNote?: string;    // Note on variants or ambiguity in the regent lists
  description: string;    // 1-2 sentences about the month
  festival: string;       // Main festival or ritual
  zodiacSign: string;     // Babylonian zodiac sign
  icon: string;           // emoji
  dayEvents?: Record<number, BabylonianDayEvent>; // specific events keyed by day of month
}

export const BABYLONIAN_MONTH_LORE: BabylonianLore[] = [
  {
    monthName: 'Nisannu',
    monthGloss: 'el inicio del año sagrado',
    monthRegent: BABYLONIAN_MONTH_REGENTS[0],
    festivalDeity: 'Marduk',
    festivalDeityGloss: 'rey de los dioses de Babilonia y señor de los destinos',
    description: 'El inicio del año sagrado — el Akītu de primavera se celebra en Babilonia durante once días. En la cuarta noche los sacerdotes recitan el Enūma Eliš ante Marduk. El quinto día, el Esagila es purificado al amanecer, Nabû llega desde Borsippa y el rey es humillado ante Bēl: depone su cetro y confiesa sus faltas; Marduk le devuelve la investidura. El día 8.º la gran procesión parte del Esagila hacia el Bīt Akitu extramuros; el día 11.º Marduk retorna y fija los destinos del año en el parak šīmāti.',
    festival: 'Akītu (Año Nuevo) — recitación del Enūma Eliš la noche del 4.º día; purificación del Esagila, llegada de Nabû y humillación-reinvestidura del rey el día 5.º; gran procesión de Marduk al Bīt Akitu el día 8.º; retorno y fijación de los destinos en el parak šīmāti el día 11.º.',
    zodiacSign: 'Agru',
    icon: '🌿',
    dayEvents: {
      1:  { shortLabel: 'Akītu comienza', description: 'El Akītu del año nuevo da inicio con la apertura ritual de las puertas del Esagila (pīt bābi). El sumo sacerdote (urigallu) entra al patio del gran templo; se realizan ofrendas regulares. La festividad de once días queda oficialmente inaugurada. (Çağirgan, Festivals 1; AB 244 rev. 30 — Linssen pp. 79, 90)', type: 'akitu' },
      4:  { shortLabel: 'Enūma Eliš', description: 'En la noche del cuarto día, los sacerdotes recitan el Enūma Eliš — el poema de la creación — ante Marduk. El épico narra la victoria de Marduk sobre Tiamat y su ascenso a rey de los dioses. (T-D, DT.15 col. VI, líneas 280–284)', type: 'ritual', fonte: { title: 'Enūma Eliš · Tablilla IV', excerpt: 'Tiamat y Marduk, el más sabio de los dioses, avanzaron el uno contra el otro para combatir. El señor extendió su red y la rodeó con ella; ante su rostro desplegó el viento Imhullū, que le seguía. Cuando Tiamat abrió su boca para devorarlo, él lanzó el Imhullū para que no pudiera cerrar los labios. Los vientos feroces distendieron su vientre; tomaron de ella su corazón y abrió desmesuradamente su boca. Él lanzó la lanza y desgarró su vientre, la cortó por la mitad y le arrancó el corazón: la sometió y extinguió su vida.', source: 'King, L. W. The Seven Tablets of Creation. Londres, 1902. Tablilla IV, ll. 93–104. Trad. al español.' } },
      5:  { shortLabel: 'Humillación del rey', description: 'Cuatro bēru antes del amanecer el urigallu purifica el Esagila; un carnero blanco (immeru peṣû) es decapitado y su cuerpo arrojado al Éufrates. Nabû llega desde el Ezida de Borsippa. El urigallu retira el cetro (ḫaṭṭu), el círculo dorado (manšaltu) y la espada del rey; le golpea la mejilla; el rey se arrodilla y confiesa su inocencia ante Bēl; el sacerdote le asegura el apoyo divino y le devuelve las insignias. Marduk y Nabû se reúnen en el santuario Upšukkannakku. (T-D, DT.109 + MNB.1848, líneas 414–450, pp. 144–145; Linssen RAcc. pp. 81–82)', type: 'ritual', fonte: { title: 'Ritual de Nisannu · DT.109 + MNB.1848', excerpt: 'El urigallu golpeó la mejilla del rey; el rey lloró. [El rey recitó:] «No he pecado, oh señor de los países; no he sido negligente con tu divinidad. He protegido a Babilonia; no la he destruido; he venerado el Esagila; no lo he olvidado.» [El sacerdote respondió:] «No temas [...]. Bēl escucha tu oración. Engrandecerá tu dominio, elevará tu reinado.» [Y le devolvió el cetro, el círculo de oro y la espada.]', source: 'Thureau-Dangin, F. Rituels Accadiens. Ernest Leroux, París, 1921. DT.109 + MNB.1848, ll. 414–450.' } },
      8:  { shortLabel: 'Gran procesión', description: 'La gran procesión de Marduk parte del Esagila en siete etapas solemnes: del santuario entre los cortinajes → al trono estelar → al parak šīmāti → a la calle procesional → a la barca → al Bīt Akitu extramuros de Babilonia. El rey encabeza el cortejo. (T-D p. 147; Linssen pp. 83–85, SBH VIII; diario astronómico no. −204)', type: 'procession' },
      11: { shortLabel: 'Akītu concluye', description: 'Marduk retorna triunfalmente al Esagila desde el Bīt Akitu. Al pasar por el parak šīmāti (Santuario de los Destinos), Marduk fija los destinos del año venidero. En el adytu, Marduk desposa a Zarpanītu en la fiesta del ḥadaššūtu. El Akītu de once días concluye. (T-D p. 148, Nbk. n°15, II, 57; Linssen pp. 83–85, SBH VIII)', type: 'akitu' },
    },
  },
  {
    monthName: 'Ayaru',
    monthGloss: '«la tierra se abre, los bueyes son uncidos»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[1],
    festivalDeity: 'Ningirsu',
    description: 'El mes en que «la tierra se abre, los bueyes son uncidos y el campo se vuelve fértil» (Astrolabio B). Las Pléyades — las Sibitti — ascienden en el cielo del atardecer. El día 2, Nabû viaja desde Borsippa hasta el Ebursaba de Babilonia para desposar a la diosa Nana; el día 7, Nabû llega a Uruk y asume la corona de Anu como rey de los dioses.',
    festival: 'Matrimonio de Nabû y Nana — el día 2 Nabû parte del Ezida y entra al Ebursaba; el día 7 asume la coronación de Anu en el Eanna de Uruk; carreras sagradas de Nabû.',
    zodiacSign: 'Gudanna',
    icon: '🐮',
    dayEvents: {
      2:  { shortLabel: 'Boda de Nabû', description: 'Nabû parte del Ezida de Borsippa hacia Babilonia. Entra en el Ebursaba como desposado y se une a Nana, la diosa: «como la luna brillante ilumina la oscuridad.»', type: 'marriage' },
      6:  { shortLabel: 'Exposición de Nabû', description: 'La estatua de Nabû es llevada al jardín del templo para ser mostrada públicamente a los fieles, resplandeciente tras su boda con Nana.', type: 'procession' },
      7:  { shortLabel: 'Coronación de Nabû', description: 'Nabû asume la corona de Anu como rey de los dioses: «porque ha tomado el reinado de Anu… viste la corona de Anu y [la palma de dátiles].» El ritual está atestiguado en Babilonia (Emeurur, jardín de Anu — Linssen, SBH VIII, II, 23ff.) y posiblemente también en el Eanna de Uruk (Cohen p. 311). Ciudad exacta incierta.', type: 'ritual' },
      13: { shortLabel: 'E-ma de Ištar', description: 'En Asiria, el e-ma de Ištar se celebra en el Bīt Akitu. Aššur, Ninlil, Ninurta y Adad asisten al banquete del Akitu. Mesa preparada, ovejas sacrificadas, carne cocida ofrendada.', type: 'festival' },
      17: { shortLabel: 'Procesión de Nanāja', description: 'La diosa Nanāja (Ištar en su aspecto nupcial) procesiona desde el Euršaba hasta el «jardín de la Montaña» en Babilonia. El rito sigue al matrimonio de Nabû y Ninkali del día 2. (Linssen, SBH VIII, II, 27–28, pp. 68, 90)', type: 'procession' },
    },
  },
  {
    monthName: 'Simanu',
    monthGloss: '«el mes del molde de ladrillos del rey»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[2],
    festivalDeity: 'Sîn',
    festivalDeityGloss: 'dios de la luna y señor del cómputo del tiempo',
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
    monthGloss: 'el gran mes del lamento',
    monthRegent: BABYLONIAN_MONTH_REGENTS[3],
    festivalDeity: 'Dumuzi',
    festivalDeityGloss: 'el pastor-dios',
    description: 'El gran mes del lamento: Dumuzi, el pastor-dios, es capturado por los demonios galla y arrastrado al Inframundo. «En el mes Dumuzi, cuando Ištar hizo llorar a las gentes de la tierra por Dumuzi, su amado.» Del día 26 al 28, la estatua del dios es expuesta sobre un féretro mientras lamentaciones llenan los templos. El día 11, las diosas del Esagila e Ezida se intercambian de morada para «alargar las noches» del solsticio de verano.',
    festival: 'Lamentaciones de Dumuzi-Tammuz — exposición del dios sobre un féretro los días 26.º–28.º; cantos fúnebres en las puertas de los templos; intercambio ritual de diosas entre el Esagila y el Ezida el día 11.º.',
    zodiacSign: 'Pulukku',
    icon: '🥀',
    dayEvents: {
      11: { shortLabel: 'Intercambio de diosas', description: 'Las hijas del Esagila (Silluštab y KA.TUN-na) van al Ezida: «En Dumuzi las noches son cortas; para alargar las noches las hijas del Esagila van al Ezida — el Ezida es la Casa de la Noche.» Rito del solsticio de verano.', type: 'ritual' },
      26: { shortLabel: 'Día del grito', description: '«El día 26 es el día del clamor.» En Asiria comienza la exposición ritual de la estatua de Dumuzi; el lamento colectivo se extiende por Nínive, Asur y Cala.', type: 'mourning' },
      27: { shortLabel: 'Dumuzi apresado', description: '«El día 27 es cuando él es capturado.» La estatua de Dumuzi yace sobre un féretro. En Uruk, el sacerdote kalu susurra encantaciones al oído del ídolo de madera para intentar revivirlo.', type: 'mourning', fonte: { title: 'Descenso de Ištar al País de los Muertos', excerpt: 'Al País Sin Retorno, la tierra [subterránea], / Ištar, hija de Sin, dirigió su pensamiento; / la hija de Sin dirigió su pensamiento / a la morada de Irkalla, la casa de las tinieblas, / a la casa de la que quien entra no vuelve, / al camino cuyo sendero no da la vuelta, / a la casa donde quien entra queda privado de luz, / donde el polvo es su sustento y la arcilla su alimento, / donde la luz no ven, en la oscuridad viven, / vestidos como pájaros, con alas por vestidura, / sobre puertas y cerrojos se extiende el polvo.', source: 'Rogers, R. W. Religion of Babylonia and Assyria. Eaton & Mains, Nueva York, 1908. Descenso de Ištar, ll. 1–11. Trad. al español.' } },
      28: { shortLabel: 'Día del Aprisco', description: '«El día 28 es el Día del Aprisco» (*u₄ TÚG.si₄*) — el redil donde los demonios galla capturaron a Dumuzi. En Arbela la exposición del dios sobre el féretro dura hasta el 29. Un texto neoasirio describe que el dios «asciende a las regiones superiores» cuando se empapa su imagen en cerveza. (Cohen p. 316–317, LKU 51 obv. 28–31)', type: 'mourning' },
    },
  },
  {
    monthName: 'Abu',
    monthGloss: 'el mes de los muertos',
    monthRegent: BABYLONIAN_MONTH_REGENTS[4],
    festivalDeity: 'Gilgameš',
    regentNote: 'con variante Ninurta',
    description: 'El mes de los muertos — la festividad ab/pum consiste en un montículo sagrado sobre la entrada al Inframundo por donde los difuntos retornan al mundo de los vivos. Se encienden antorchas y braseros para que los muertos encuentren el camino. Durante nueve días se celebran carreras y combates de lucha en honor de Gilgameš. La noche del día 28, el exorcismo Maqlu es recitado para expulsar a las brujas que regresan del Sheol.',
    festival: 'Festival ab/pum — encendido de antorchas para los Anunnaki; combates y certámenes atléticos por nueve días en honor de Gilgameš; recitación del Maqlu la noche del día 28.º.',
    zodiacSign: 'Urgula',
    icon: '🔥',
    dayEvents: {
      1:  { shortLabel: 'Ab/pum se abre', description: 'El montículo sagrado (ab/pum) se abre y los difuntos regresan al mundo de los vivos; las familias encienden antorchas y braseros en los umbrales para guiarlos. El día de apertura dentro del mes no está directamente citado en los textos cuneiformes; la asignación al día 1 es una inferencia razonable pero aproximada. (Cohen pp. 319–321)', type: 'ritual' },
      16: { shortLabel: 'Certámenes de Gilgameš', description: 'Durante nueve días se celebran carreras a pie, luchas y certámenes atléticos en honor de Gilgameš «en cada barrio de la ciudad» (Astrolabio B). El día de inicio no está explícitamente citado; el día 16 es aproximado. (Cohen p. 319, Astrolabio B)', type: 'festival' },
      28: { shortLabel: 'Maqlu — exorcismo', description: 'La noche del día 28, el exorcista (āšipu) recita el ciclo ritual completo del Maqlu: nueve tablillas de conjuros para expulsar a las brujas que regresan del Sheol junto a los muertos. Se queman figuras de barro que representan a las brujas.', type: 'ritual', fonte: { title: 'Maqlu · Tablilla I', excerpt: '«Os convoco, dioses de la noche; / os convoco, Noche, oscuridad y sombra. / Juzgad mi caso, pronunciad mi veredicto. / La bruja que me ha hechizado, / la seductora que ha domado mi cuerpo: / que su maleficio retorne a ella; / no tenga reposo esta noche.»', source: 'Abusch, T. The Magical Ceremony Maqlû. SBL Press, Leiden, 2016. Tablilla I, ll. 1–7. Trad. al español.' } },
    },
  },
  {
    monthName: 'Ulūlu',
    monthGloss: '«la obra de las diosas»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[5],
    festivalDeity: 'Ištar',
    festivalDeityGloss: 'señora del amor, la guerra y el planeta Venus',
    description: '«La obra de las diosas» (gipir Ištarāte) — las estatuas de las diosas son llevadas al río sagrado para su lustración y purificación anual. En todo el país los templos celebran ritos de consagración. El día 3, en el Eanna de Uruk, Ištar celebra su matrimonio sagrado (*ḥadaššūtu*); también se realizan ceremonias de vestimenta para Anu. «Todo el mes de Ulūlu está consagrado a Ištar» (K 3753, I, 9). El día 17, el Akītu de Ištar de Arbela se celebra en Milkiya.',
    festival: '«Obra de las diosas» — lustración de estatuas divinas en el río sagrado; matrimonio sagrado de Ištar (*ḥadaššūtu*) en el Eanna de Uruk el día 3.º; Akītu de Ištar de Arbela el día 17.º.',
    zodiacSign: 'Širu',
    icon: '💫',
    dayEvents: {
      1:  { shortLabel: 'Lustración de las diosas', description: '«La obra de las diosas» (gipir Ištarāte) da inicio. Las estatuas de las grandes diosas son transportadas en procesión hasta el río sagrado para su purificación anual. Cohen (p. 323) señala que el primer día datado es el 2; el día 1 como inicio es una inferencia aproximada no directamente citada.', type: 'procession' },
      3:  { shortLabel: 'Matrimonio sagrado de Ištar', description: 'En el Eanna de Uruk, Ištar celebra su matrimonio sagrado (*ḥadaššūtu*): «todo el mes de Ulūlu está consagrado a Ištar» (K 3753, I, 9). También se realizan ritos de vestimenta para Anu. Las estatuas comparten el lecho divino mientras los sacerdotes recitan himnos nupciales. (Cohen pp. 323–324, K 3753; Linssen pp. 70–71)', type: 'marriage', fonte: { title: 'Himno Nupcial de Inanna', excerpt: '«Esposo, amado de mi corazón, / tu encanto es dulce, tu dulzura es miel. / León, amado de mi corazón, / tu encanto es dulce, tu dulzura es miel. / Me has cautivado; déjame temblar ante ti, / esposo, quiero ser llevada al palacio.»', source: 'Jacobsen, T. The Treasures of Darkness. Yale University Press, 1976. Himno nupcial de Inanna-Dumuzi. Trad. al español.' } },
      17: { shortLabel: 'Akītu de Ištar de Arbela', description: 'El Akītu de Ištar de Arbela se celebra en el santuario de Milkiya, extramuros de la ciudad. El rey acompaña la procesión de la diosa; las profetisas (raggintu) de Arbela proclaman oráculos en nombre de Ištar la guerrera.', type: 'akitu' },
    },
  },
  {
    monthName: 'Tašrītu',
    monthGloss: '«las primicias del año son santificadas»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[6],
    festivalDeity: 'Enlil',
    festivalDeityGloss: 'señor del aire y de la tierra',
    description: 'El segundo Akītu del año — el contrapeso otoñal de la gran fiesta de Nisannu. El día 3, Bēl es vestido para el festival; el día 8, la gran puerta del Esagila se abre y el Enūma Eliš es recitado ante el dios; la procesión de Bēl parte hacia el Bīt Akitu como en primavera. El día 27, en Nippur se celebra el festival del Montículo Sagrado con ofrendas a los antepasados de Enlil. «Las primicias del año son santificadas» (Astrolabio B).',
    festival: 'Segundo Akītu — Bēl procesiona al Bīt Akitu el día 8.º; Enūma Eliš recitado por los cantores; en Uruk, Anu reside siete días en el Bīt Akitu y retorna en gran procesión; festival del Montículo Sagrado en Nippur el día 27.º.',
    zodiacSign: 'Zibanitu',
    icon: '⚖️',
    dayEvents: {
      3:  { shortLabel: 'Preparación de Bēl', description: 'Los sacerdotes visten a la estatua de Bēl-Marduk con sus ropas de festival. El Esagila es decorado con guirnaldas de lana teñida y ofrendas de oro. Se preparan las barcas procesionales para transportar a los dioses al Bīt Akitu.', type: 'ritual' },
      8:  { shortLabel: 'Segundo Akītu', description: 'La gran puerta del Esagila se abre. La procesión de Bēl parte hacia el Bīt Akitu otoñal; en Uruk, Anu reside siete días en el Bīt Akitu antes de su retorno triunfal. Los cantores recitan el Enūma Eliš ante Marduk (atestiguado a través de una tablilla Lambert no publicada, citada por Cohen p. 328; incierto para Tašrītu específicamente). (Cohen pp. 328–329; Linssen pp. 78, 90, BM 32206+)', type: 'akitu' },
      27: { shortLabel: 'Festival del Montículo', description: 'En Nippur, el festival del Montículo Sagrado (dūru) reúne a las comunidades para realizar ofrendas a los antepasados de Enlil. Los difuntos de linajes nobles son honrados con banquetes funerarios; sus nombres son recitados ante el dios.', type: 'festival' },
    },
  },
  {
    monthName: 'Araḫsamnu',
    monthGloss: '«el mes en que el arado es liberado»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[7],
    festivalDeity: 'Adad',
    festivalDeityGloss: 'dios de la tormenta, la lluvia y el trueno',
    description: '«El mes en que el arado es liberado; la azada y el arado se disputan en el campo; el Akītu de la estación de la siembra se celebra; el mes de Adad, inspector de los canales del cielo y la tierra» (Astrolabio B). La Disputa entre la Azada y el Arado —conservada en sumerio— es recitada durante el festival. El arado es colgado en el granero hasta el año siguiente.',
    festival: 'Akītu de la siembra (a-ki-tu ur) — el arado es liberado del campo y guardado; recitación de la Disputa Azada-Arado; ofrendas a Adad para propiciar las lluvias de invierno y los canales.',
    zodiacSign: 'Zuqaqīpu',
    icon: '🌱',
    dayEvents: {
      1:  { shortLabel: 'Akītu de la siembra', description: 'El Akītu de la estación de la siembra (a-ki-tu ur) se celebra este mes. Los sacerdotes de Adad bendicen los bueyes y los canales de riego. El día 1 como apertura es una inferencia; los textos confirman el festival a nivel de mes pero no asignan un día específico de inicio. (Cohen p. 331, Astrolabio B)', type: 'akitu' },
      5:  { shortLabel: 'Procesión de Mīšaru', description: 'El dios de la justicia Mīšaru procesiona desde el Eḫenunna (templo de Adad) hacia el templo de Adad principal en Uruk y Babilonia. La ceremonia evoca el papel de la justicia divina en la apertura de la temporada de siembra. (Cohen p. 332, BM 121206 vii; Linssen, TU 39 rev. 26; K 3753 pp. 68, 89)', type: 'procession' },
      18: { shortLabel: 'Brasero de Šamaš', description: 'Festival del brasero (*kinūnu*) de Šamaš en Babilonia: ofrendas en varios templos y procesión de los Hijos de Bēl (*mārī Bēl*) hasta el Enamḫe, templo de Adad en Babilonia. La «Disputa de la Azada y el Arado» es una tradición del mes entero (Astrolabio B), no un rito específico del día 18. (Linssen, BRM 4,25; SBH VII, pp. 64, 69, 90)', type: 'festival' },
    },
  },
  {
    monthName: 'Kislīmu',
    monthGloss: '«el héroe poderoso Nergal»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[8],
    festivalDeity: 'Nergal',
    festivalDeityGloss: 'señor del Inframundo, de la peste y de la guerra',
    description: '«El héroe poderoso Nergal que ha surgido del Inframundo, el arma abrumadora de los dos dioses» (Astrolabio B). En Kislīmu se corren carreras a pie en torno a cada centro de culto, rememorando la victoria de Ninurta sobre el pájaro Anzû. En el Eanna de Uruk, el Festival del Brasero (Kinunu) se celebra los días 1.º, 2.º, 6.º, 7.º, 14.º y 15.º: fuegos son encendidos en los braseros de todos los dioses.',
    festival: 'Festival del Brasero (Kinunu) — fuegos encendidos en los braseros de todos los dioses del Eanna; carreras a pie en cada ciudad en honor de la victoria de Ninurta sobre el Anzû.',
    zodiacSign: 'Pabilsag',
    icon: '🪔',
    dayEvents: {
      1:  { shortLabel: 'Kinunu — día 1', description: 'Primer día del Festival del Brasero (Kinunu) en el Eanna de Uruk. Al anochecer se encienden braseros en cada capilla del complejo; los sacerdotes alimentan los fuegos con maderas aromáticas. El humo perfumado asciende a los dioses del firmamento.', type: 'festival' },
      2:  { shortLabel: 'Kinunu — día 2', description: 'Segundo día del Kinunu. Las carreras a pie rodean el perímetro del templo rememorando la persecución del pájaro Anzû por Ninurta. Los victoriosos reciben guirnaldas de lana teñida en los colores del dios.', type: 'festival' },
      4:  { shortLabel: 'Rito de Marduk y Zarpanītu', description: 'En Babilonia, ceremonia solemne para Marduk y Zarpanītu en el Esagila: un esclavo montado en toro y el visir de Ea, Usmû, procesionan desde la celda del Esagila al templo del Akitu y regresan el mismo día. Los cantores (nāru) recitan el Enūma Eliš ante Bēl; se ofrendan lamentaciones y se presentan los kettle-drums de Bēl y Bēltīja. También llegan por barca ramas de palmera (libbi gišimmari) al carpa junto al templo de Ea. (Linssen, BM 32206+; SBH VII; BRM 4,25; BM 78076, pp. 69, 81, 91, 118)', type: 'ritual', fonte: { title: 'Enūma Eliš · Tablilla IV', excerpt: 'Tiamat y Marduk, el más sabio de los dioses, avanzaron el uno contra el otro para combatir. El señor extendió su red y la rodeó con ella; ante su rostro desplegó el viento Imhullū, que le seguía. Cuando Tiamat abrió su boca para devorarlo, él lanzó el Imhullū para que no pudiera cerrar los labios. Los vientos feroces distendieron su vientre; tomaron de ella su corazón y abrió desmesuradamente su boca. Él lanzó la lanza y desgarró su vientre, la cortó por la mitad y le arrancó el corazón: la sometió y extinguió su vida.', source: 'King, L. W. The Seven Tablets of Creation. Londres, 1902. Tablilla IV, ll. 93–104. Trad. al español.' } },
      6:  { shortLabel: 'Kinunu — día 6', description: 'Día 6 del Kinunu: los braseros se renuevan con aceite fresco. Se realizan ofrendas nocturnas adicionales a Nergal, señor del Inframundo, para que proteja a los vivos durante el mes más frío.', type: 'festival' },
      7:  { shortLabel: 'Kinunu — día 7', description: 'Día 7 del Kinunu. El sacerdote šangû inspecciona personalmente los braseros de los grandes dioses del Eanna. Se ofrecen dátiles, cerveza y carne asada a Nergal y Ereshkigal en representación de los dioses del mundo inferior.', type: 'festival' },
      14: { shortLabel: 'Kinunu — día 14', description: 'Día 14 del Kinunu. Los braseros arden toda la noche; guardias del templo los vigilan. Las listas de préstamos y contratos del año son revisadas ante los dioses para su sanción divina.', type: 'festival' },
      15: { shortLabel: 'Kinunu — día 15', description: 'Día 15 y último del Kinunu: los braseros son apagados al amanecer y los residuos cenizosos son arrojados al río en señal de purificación. Las carreras finales concluyen el festival con un banquete comunal en el átrio del Eanna.', type: 'festival' },
    },
  },
  {
    monthName: 'Ṭebētu',
    monthGloss: '«el gran festival de Anu, el esplendor de Ištar»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[9],
    festivalDeity: 'Anu',
    festivalDeityGloss: 'señor del cielo',
    description: '«El mes Ṭebētu, el gran festival de Anu, el esplendor de Ištar» (Astrolabio B). El día 16, el Akītu de Ištar: «ella ilumina el Emagmaš; el rey es vestido de ropas puras.» Los días más cortos del año; el día 3, las diosas del Esagila y del Ezida se intercambian de templos para «alargar el día» y restablecer el equilibrio cósmico tras el solsticio. El Festival Nabru examina los presagios para el año venidero.',
    festival: 'Gran festival de Anu; Akītu de Ištar el día 16.º; intercambio ritual de diosas entre el Esagila y el Ezida para corregir el desequilibrio del solsticio de invierno; Festival Nabru de presagios.',
    zodiacSign: 'Suḫurmāšu',
    icon: '❄️',
    dayEvents: {
      3:  { shortLabel: 'Intercambio de diosas', description: 'Las hijas del Esagila van al Ezida y viceversa en el rito que «alarga el día» tras el solsticio de invierno. Este espejo del rito de Duʾūzu (que acortaba las noches) restaura el equilibrio cósmico: «el Ezida es la Casa de la Noche — las diosas traen su luz para alargar el día.»', type: 'ritual' },
      16: { shortLabel: 'Vigilia nocturna de Anu', description: 'En el templo Rēš de Uruk, vigilia nocturna ante Anu y Antu: el cetro y el zapato-lámpara descienden al Gran Patio; Papsukkal, Nusku y Usmû se sientan en el atrio; se porta la antorcha ritual (gizillû) por los templos y se encienden pilas de leña en las puertas. La vigilia dura toda la noche. (Linssen, TU 41, pp. 59, 68, 89, 122–124). Nota: en Asiria, el «despertar» de Ištar en el Emagmaš de Asur es un festival distinto atestiguado en Cohen/Livingstone (ABRT 1 7ff.); el Emagmaš es asiriio, no está en Uruk.', type: 'ritual' },
      17: { shortLabel: 'Fin de la vigilia de Anu', description: 'Al amanecer concluye la vigilia nocturna de Anu en el Rēš de Uruk: la ceremonia šalām bīti («buen funcionamiento del templo») se realiza en las puertas y la vigilia queda formalmente clausurada con la apertura de las puertas al día. (Linssen, TU 41, pp. 122–124)', type: 'ritual' },
    },
  },
  {
    monthName: 'Šabāṭu',
    monthGloss: '«el matrimonio de los dioses»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[10],
    festivalDeity: 'Nabû',
    description: '«En Šabāṭu es el matrimonio de los dioses» — Bēl desposa a Beltiya; Nabû desposa a Tašmētu. Este mes abre el tramo más intenso del año litúrgico: el período Šabāṭu–Addaru–Nisannu. Desde el día 16, durante ocho días se recitan ante Aššur en el Bīt Dagan grandes lamentaciones sumerias, himnos y plegarias luilla; los peregrinos acuden desde todo el reino.',
    festival: 'Matrimonio sagrado de Bēl–Beltiya y Nabû–Tašmētu; lamentaciones y cantos ante Aššur en el Bīt Dagan desde el día 16.º hasta el día 10 de Addaru; «mes del banquete de Enlil» en Nippur.',
    zodiacSign: 'Gula',
    icon: '💍',
    dayEvents: {
      7:  { shortLabel: 'Matrimonio sagrado', description: 'Bēl desposa a Beltiya; Nabû desposa a Tašmētu en el Ezida de Borsippa. El rito del hieros gamos une a los dioses del panteón. Las estatuas son colocadas juntas en el lecho sagrado mientras los cantores recitan himnos nupciales. El matrimonio en este mes está atestiguado (Cohen p. 337, carta de Nergal-šarrani a Esarhadón, ABL 65); el día 7 específico no tiene respaldo textual directo — es aproximado.', type: 'marriage' },
      16: { shortLabel: 'Lamentaciones ante Aššur', description: 'Comienzan días de lamentaciones sumerias (ershemma) en el Bīt Dagan de Asur, que continúan hasta el día 10 de Addaru. Los cantores (kalû) recitan himnos luilla mientras los peregrinos velan ante la imagen de Aššur. (Cohen pp. 338–341, Van Driel, A 125 = Aššur 124ff.; BM 121206 vii)', type: 'mourning' },
    },
  },
  {
    monthName: 'Addaru',
    monthGloss: '«el mes de Ea»',
    monthRegent: BABYLONIAN_MONTH_REGENTS[11],
    festivalDeity: 'Ea',
    festivalDeityGloss: 'dios de las aguas dulces, la sabiduría y las artes mágicas',
    regentNote: 'los Siete grandes dioses',
    description: '«En los vastos campos de Ningirsu la hoz no es abandonada; el mes de la alegría de Enki, el mes de Ea» (Astrolabio B). El festival garratu se celebra los días 17 y 18. El día 6, las estatuas de los dioses parten en solemne procesión. Los astrónomos del Esagila calculan si el año necesita un Addaru II intercalar; si Nisannu aún no alcanza la primavera, proclaman el décimotercero mes.',
    festival: 'Festival garratu los días 17.º y 18.º; procesión solemne de los dioses el día 6.º; cómputo astronómico del posible mes intercalar Addaru II para realinear el calendario lunar con las estaciones solares.',
    zodiacSign: 'Zibbātu',
    icon: '🌾',
    dayEvents: {
      6:  { shortLabel: 'Gran procesión de los dioses', description: 'Las estatuas de todos los grandes dioses del panteón parten en solemne procesión por las calles de Babilonia. El desfile sirve como despedida simbólica del año que cierra: los dioses «revisan» su ciudad antes del Akītu de primavera.', type: 'procession' },
      8:  { shortLabel: 'Ceremonia de Antu', description: 'Ceremonia especial para Antu (consorte de Anu) en Uruk. El rito está atestiguado mediante la venta de un prebendario datada el 8 de Addaru (McEwan, Priest and Temple, 171; K.3753 ii; OECT 9, 40, 42, 44–45). (Linssen pp. 62, 89)', type: 'ritual' },
      17: { shortLabel: 'Festival garratu', description: 'El festival garratu honra la cosecha antes del nuevo año. Se realizan ofrendas masivas de cebada, dátiles y cerveza a Ea, señor de la sabiduría y las aguas dulces. Los astrónomos del Esagila presentan sus cálculos al rey: si el próximo Nisannu llega antes del equinoccio de primavera, se proclama el mes intercalar Addaru II.', type: 'festival' },
      18: { shortLabel: 'Garratu — segundo día', description: 'Segundo día del garratu: banquetes en los patios de los grandes templos; los granjeros traen ofrendas de las primicias de la cosecha. En las tablillas astronómicas, los escribas registran la posición de la luna y el sol para confirmar o descartar el mes intercalar.', type: 'astronomy' },
    },
  },
];

export const getBabylonianLore = (monthName: string): BabylonianLore | undefined =>
  BABYLONIAN_MONTH_LORE.find(l => l.monthName === monthName || monthName.startsWith(l.monthName));

export interface BabylonianUpcomingFestival {
  shortLabel: string;
  description: string;
  type: BabylonianDayEvent['type'];
  fonte?: BabylonianFonte;
  monthName: string;
  monthIcon: string;
  day: number;
  daysRemaining: number;
}

export function getNextBabylonianFestivals(monthIndex: number, day: number, count = 5): BabylonianUpcomingFestival[] {
  const results: BabylonianUpcomingFestival[] = [];
  let m = monthIndex;
  let d = day + 1;
  for (let i = 0; i < 370 && results.length < count; i++) {
    if (d > 30) { d = 1; m = (m + 1) % 12; }
    const lore = BABYLONIAN_MONTH_LORE[m];
    if (lore.dayEvents?.[d]) {
      results.push({
        ...lore.dayEvents[d],
        monthName: lore.monthName,
        monthIcon: lore.icon,
        day: d,
        daysRemaining: i + 1,
      });
    }
    d++;
  }
  return results;
}

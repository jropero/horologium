
export interface OvidMonthEtymology {
    month: number; // 1-12
    text: string;
    reference: string;
}

export interface OvidAstronomicalEvent {
    month: number; // 1-12
    day: number;
    text: string;
    reference: string;
}

export interface OvidTaboo {
    startMonth: number;
    startDay: number;
    endMonth: number;
    endDay: number;
    title: string;
    text: string;
    reference: string;
}

export interface OvidDialogue {
    god: string;
    month: number;
    questions: {
        question: string;
        answer: string;
        qRef: string;
        aRef: string;
    }[];
}

export interface OvidWeatherQuote {
    condition: string;
    text: string;
    reference: string;
}

export interface OvidHistoricalEvent {
    month: number;
    day: number;
    title: string;
    text: string;
    reference: string;
}

export interface OvidPrayer {
    startMonth: number;
    startDay: number;
    endMonth: number;
    endDay: number;
    title: string;
    text: string;
    reference: string;
    icon?: string;
}

export interface OvidMonument {
    month: number;
    day: number;
    title: string;
    text: string;
    reference: string;
}

export interface OvidStatusExplanation {
    status: string;
    text: string;
    reference: string;
}

export interface OvidSacrifice {
    month?: number;
    day?: number;
    isGeneric?: boolean;
    title: string;
    text: string;
    reference: string;
    icon?: string;
    crime?: string;
}

export const OVID_MONTH_ETYMOLOGIES: OvidMonthEtymology[] = [
    {
        month: 1,
        text: "Jano bifronte, tácito origen del año que pasa... Caos los antiguos, pues cosa vetusta soy, me llamaban.",
        reference: "Libro I, vv. 65, 103"
    },
    {
        month: 2,
        text: "Februa llamaron los padres romanos a ritos lustrales... El mes de éstos fue dicho, porque los Lupercos con cueros en tiras lustran todo el suelo.",
        reference: "Libro II, vv. 19, 31-32"
    },
    {
        month: 3,
        text: "De ti [Marte] el principio del año romano llamamos: será para el nombre de mi padre el mes primero. Se cumple la voz, y al mes llama con el nombre del padre.",
        reference: "Libro III, vv. 75-77"
    },
    {
        month: 4,
        text: "Mas juzgo que con lenguaje griego se fijó el mes de Venus; de las espumas [afros] del mar la diosa fue nombrada... [Otros] refieren que de tiempo abierto[aperire] Abril fue llamado: al que echándole mano reclama fértil Venus.",
        reference: "Libro IV, vv. 61-62, 87-88"
    },
    {
        month: 5,
        text: "¿Buscáis, de dónde juzgo dados al mes de Mayo los nombres? [...] De aquí brotó Majestad [Maiestas]... [O] Magna fue en otro tiempo reverencia de cana cabeza [Maiores]... [O que] Maya a sus hermanas superó en hermosura.",
        reference: "Libro V, vv. 1, 25, 57, 85"
    },
    {
        month: 6,
        text: "Junio posee el nombre del nombre mío [Juno]... Hoy también no por el nombre de este tiempo contiendo [Juventa]... Junio de éstos, juntos, el nombre tiene [Concordia].",
        reference: "Libro VI, vv. 26, 69, 96"
    }
];

export const OVID_ASTRONOMICAL_EVENTS: OvidAstronomicalEvent[] = [
    {
        month: 1,
        day: 9,
        text: "Al llegar de venideras Nonas la noche tercera... se buscarán en vano los brazos de octópodo Cáncer: él, cayendo, entrará en las occiduas aguas.",
        reference: "Libro I, vv. 311-314"
    },
    {
        month: 1,
        day: 10,
        text: "En tanto sobre los mares se eleva, astro brillante, el Delfín y en patrios vados su faz descubre.",
        reference: "Libro I, vv. 457-458"
    },
    {
        month: 2,
        day: 2,
        text: "Alguien levantando en aquella noche a los astros el rostro dirá: '¿dónde hoy la Lira que ayer fulgió se encuentra?'",
        reference: "Libro II, vv. 75-76"
    },
    {
        month: 2,
        day: 11,
        text: "Al venir noche tercera, verás que en seguida el Custodio de la Osa sus pies gemelos ha mostrado.",
        reference: "Libro II, vv. 153-154"
    },
    {
        month: 2,
        day: 14,
        text: "En un lugar están juntos tres astros, Cuervo y Serpiente, y Crátera en medio yace. En Idus aquéllos se ocultan, surgen en noche siguiente.",
        reference: "Libro II, vv. 243-245"
    },
    {
        month: 3,
        day: 8,
        text: "En seguida, viniendo la noche, atisbarás de la Cnósida la Corona. Por crimen Teseo fue hecha diosa.",
        reference: "Libro III, vv. 459-460"
    },
    {
        month: 3,
        day: 17,
        text: "Júpiter manda a las aves robarlas [las entrañas]: para éste las trajo el milano, y por sus hechos llegó a los astros.",
        reference: "Libro III, vv. 807-808"
    },
    {
        month: 4,
        day: 2,
        text: "Cuando pase la noche y el cielo a enrojecerse al principio comience... empezarán a aligerar los hombros del padre [Atlas] las Pléyades.",
        reference: "Libro IV, vv. 165-169"
    },
    {
        month: 4,
        day: 7,
        text: "Mas antes que el último día sus espectáculos pare, en el mar se hundirá Orión que porta espada.",
        reference: "Libro IV, vv. 387-388"
    },
    {
        month: 5,
        day: 2,
        text: "Mas cuando oscuros crepúsculos traigan la noche, ninguna Híade de toda la grey estará cubierta.",
        reference: "Libro V, vv. 163-164"
    },
    {
        month: 5,
        day: 3,
        text: "En noche menos de cuarta mostrará sus astros Quirón, semivarón unido al cuerpo de flavo potro.",
        reference: "Libro V, vv. 379-380"
    },
    {
        month: 5,
        day: 14,
        text: "La antes de Idus indica que Tauro su rostro estrellado alza. Bajo este signo queda sabida fábula. Cuando un toro sus lomos prestó a tiria doncella...",
        reference: "Libro V, vv. 603-605"
    },
    {
        month: 6,
        day: 26,
        text: "Alguien de suburbano templo volviendo no sobrio, hacia estrellas tales palabras lanza: 'tu faja hoy se oculta, y se ocultará acaso mañana: desde entonces, Orión, por mí será visible'.",
        reference: "Libro VI, vv. 785-788"
    }
];

export const OVID_TABOOS: OvidTaboo[] = [
    {
        startMonth: 5,
        startDay: 1,
        endMonth: 5,
        endDay: 31,
        title: "Tabú Nupcial de Lemuria",
        text: "Ni de viuda, ni aptos para teas de virgen los mismos tiempos. No vivió mucho la que buscó marido. Por esta causa también, si los proverbios te mueven, que el malo en mes de Mayo se casa, el vulgo dice.",
        reference: "Libro V, vv. 487-490"
    },
    {
        startMonth: 6,
        startDay: 1,
        endMonth: 6,
        endDay: 14,
        title: "Purificación de Vesta (Dies Religiosi)",
        text: "Hasta que de ilíaca Vesta el plácido Tíber arrastre purificaciones al mar... lícito no me será con boj peinar mis crines... También tú no te apresures. Mejor tendrá nupcias tu hija, cuando ígnea Vesta brille en el puro suelo.",
        reference: "Libro VI, vv. 227-234"
    }
];

export const OVID_DIVINE_DIALOGUES: OvidDialogue[] = [
    {
        god: "Jano",
        month: 1,
        questions: [
            {
                question: "Di, anda, ¿por qué en los fríos el nuevo año comienza, el cual debía empezar mejor por primavera? Todo entonces florece, entonces nueva edad hay del tiempo...",
                answer: "Invierno es primera del nuevo sol y del viejo la última: el mismo principio Febo [el sol] y el año toman.",
                qRef: "Libro I, vv. 149-151",
                aRef: "Libro I, vv. 163-164"
            },
            {
                question: "¿Por qué, aunque los númenes de otros aplaque, Jano, a ti primero incienso y vino ofrendo?",
                answer: "Para que puedas tener acceso por mí, que vigilio los umbrales, a cuantos dioses quieras.",
                qRef: "Libro I, vv. 171-172",
                aRef: "Libro I, vv. 173-174"
            },
            {
                question: "¿Qué, pues, significan el dátil y el higo rugoso, y la cándida miel dada en vasija nívea que nos regalamos hoy?",
                answer: "Presagio es causa de que aquel sabor siga a las cosas; de que el año acabe dulce su comenzado curso.",
                qRef: "Libro I, vv. 185-186",
                aRef: "Libro I, vv. 187-188"
            },
            {
                question: "¿Por qué en paz te ocultas y en armas movidas te muestras [abriendo las puertas de tu templo]?",
                answer: "Para que al pueblo que a la guerra marchó se abra el regreso, quitado el cerrojo, toda mi puerta se abre. En paz cierro las puertas, porque por nada pueda marcharse.",
                qRef: "Libro I, v. 277",
                aRef: "Libro I, vv. 279-281"
            }
        ]
    },
    {
        god: "Marte",
        month: 3,
        questions: [
            {
                question: "Bélico Marte, dejando un momento el escudo y el hasta... como seas para oficios viriles apto, dime, ¿por qué las matronas tus fiestas honran?",
                answer: "Las sabinas raptadas se lanzaron contra desnudas espadas y con sus llantos guerras de Marte acabado habían... De aquí, celebrar las Calendas de Marzo las madres latinas por no leve regalo tienen.",
                qRef: "Libro III, vv. 1, 169-170",
                aRef: "Libro III, vv. 229-232"
            }
        ]
    },
    {
        god: "Flora",
        month: 5,
        questions: [
            {
                question: "Dime, diosa, el origen cuál es de tus juegos.",
                answer: "[Los ediles impusieron multas a los que abusaban de los pastos públicos] A mí en parte fue dada la multa, y con grandes aplausos los vencedores fundaron juegos nuevos.",
                qRef: "Libro V, v. 277",
                aRef: "Libro V, vv. 291-292"
            },
            {
                question: "¿Por qué en estos juegos hay una mayor lascivia y diversión más libre?",
                answer: "No soy de las severas, no de las que grandes cosas prometen: quiero que mis ritos al coro plebeyo se abran. Y enseño a usar, mientras florea, de la belleza del tiempo; a despreciar la espina, cuando las rosas caigan.",
                qRef: "Libro V, vv. 331-332",
                aRef: "Libro V, vv. 351-354"
            },
            {
                question: "¿Por qué en vez de líbicas leonas, con red te aprisionan en el circo pacíficas cabras y asustadizas liebres?",
                answer: "No selvas, sino me concedieron los huertos, y las campiñas por fiera pugnaz no andables.",
                qRef: "Libro V, vv. 371-372",
                aRef: "Libro V, vv. 373-374"
            }
        ]
    },
    {
        god: "Minerva (Tritonia)",
        month: 6,
        questions: [
            {
                question: "¿Por qué el flautista, errante, en toda la Urbe circula? ¿Qué, larga estola; qué le significan máscaras?",
                answer: "[Estando exiliados en Tíbur, un liberto los emborrachó para devolverlos a Roma en secreto] Plaucio, para poder engañar por el aspecto y el número al senado, manda que cúbranse faz con máscaras... y para que la mujer flautista este grupo aumente, ordena que largos vestidos tengan; que así cubrirse bien pueden, no acaso se observen que contra los mandatos han vuelto.",
                qRef: "Libro VI, vv. 653-654",
                aRef: "Libro VI, vv. 685-689"
            },
            {
                question: "Saber me falta por qué Quincuatrías el día aquél se llama.",
                answer: "Marzo trata con tal nombre mis fiestas y también esta turba de mis inventos pende. Primera yo en taladrado boj por agujeros distantes hice que larga flauta sonidos diera.",
                qRef: "Libro VI, v. 693",
                aRef: "Libro VI, vv. 695-698"
            }
        ]
    }
];

export const OVID_WEATHER_QUOTES: OvidWeatherQuote[] = [
    {
        condition: "rain",
        text: "Fuertes lluvias a veces lanza el Austro cubierto de nubes... o cae fuerte lluvia con abundantes aguas.",
        reference: "Libro II, vv. 71, 494"
    },
    {
        condition: "storm",
        text: "Fuertes lluvias a veces lanza el Austro cubierto de nubes... o cae fuerte lluvia con abundantes aguas.",
        reference: "Libro II, vv. 71, 494"
    },
    {
        condition: "wind",
        text: "Acariciará el frígido Argestes las más altas aristas, y partirán desde aguas calabrias velas cándidas... o el tibio aire que de Céfiros viene.",
        reference: "Libro V, v. 161; Libro II, v. 148"
    },
    {
        condition: "cold",
        text: "El duro frío... por gélidas nieves se arda... y bajo la caída nieve yace la tierra.",
        reference: "Libro I, v. 680; Libro II, v. 72"
    },
    {
        condition: "snow",
        text: "El duro frío... por gélidas nieves se arda... y bajo la caída nieve yace la tierra.",
        reference: "Libro I, v. 680; Libro II, v. 72"
    },
    {
        condition: "heat",
        text: "Gratos soles entonces... cuando el día purpúreo con rápido carro guía... y de la luz los tiempos brillar hace.",
        reference: "Libro I, v. 157; Libro III, v. 518"
    },
    {
        condition: "clear",
        text: "Gratos soles entonces... cuando el día purpúreo con rápido carro guía... y de la luz los tiempos brillar hace.",
        reference: "Libro I, v. 157; Libro III, v. 518"
    }
];

export const OVID_MOS_MAIORUM: OvidHistoricalEvent[] = [
    {
        month: 1,
        day: 1,
        title: "Los Regalos de Año Nuevo",
        text: "Dije: '¿qué, pues, significan el dátil y el higo rugoso, y la cándida miel dada en vasija nívea?' Presagio es causa —dijo Jano— de que aquel sabor siga a las cosas; de que año acabe dulce su comenzado curso.",
        reference: "Libro I, vv. 185-188"
    },
    {
        month: 2,
        day: 21,
        title: "La magia negra de la diosa Tácita",
        text: "He allí, vieja añosa... con tres dedos tres granos de incienso en umbral deposita... ase entonces con plomo fundido encantados cordones, y a siete habas negras da vueltas en su boca... 'Lenguas hostiles y enemigas bocas atamos', dice, y alejándose ebria se va la vieja.",
        reference: "Libro II, vv. 571-582"
    },
    {
        month: 3,
        day: 15,
        title: "Los brindis de Anna Perenna",
        text: "Viene la plebe... Con sol empero y con vino arden, y tantos años suplican, cuantos ciatos [copas] tomen, y a número fijo beben. Allá encontrarás, el que se beba los años de Néstor...",
        reference: "Libro III, vv. 525-533"
    },
    {
        month: 3,
        day: 17,
        title: "La Toga Viril y la Mayoría de Edad",
        text: "¿Por qué se da la toga libre en este día? Porque Baco es joven; porque es padre... y porque es Líber (libre)... para que la asistencia festejar pudiera al novicio, se vio el día no ajeno para donar la toga.",
        reference: "Libro III, vv. 771-788"
    },
    {
        month: 5,
        day: 15,
        title: "El lanzamiento de muñecos al río - Los Argeos",
        text: "Aun luego la virgen suele arrojar desde un puente de roble simulacros de junco de primitivos hombres... que se lanzan, a ejemplo de Hércules, cuerpos falsos.",
        reference: "Libro V, vv. 621-632"
    }
];

export const OVID_ANNALES_BELLI: OvidHistoricalEvent[] = [
    {
        month: 2,
        day: 13,
        title: "La Masacre de los Fabios",
        text: "Este día fue aquel en el cual por las armas veyenses Fabios tres veces cien tres veces dos cayeron. Casa única había admitido las fuerzas y carga de la urbe...",
        reference: "Libro II, vv. 195-197"
    },
    {
        month: 2,
        day: 24,
        title: "La Expulsión de los Reyes - Regifugium",
        text: "Es visible herida vacía. Con clamor Bruto a Quirites subleva y refiere del rey los nefandos hechos. Proscrito es con su prole Tarquinio: toma leyes de un año el cónsul: a los reinos último fue aquel día.",
        reference: "Libro II, vv. 849-852"
    },
    {
        month: 3,
        day: 15,
        title: "El Asesinato de Julio César",
        text: "Iba a olvidar las espadas en el príncipe hundidas... 'sacrílegas manos con dardos en mí apuntaron. Yo misma al héroe arranqué y dejé simulacros desnudos. Fue la sombra de César quien sucumbió por hierro'.",
        reference: "Libro III, vv. 697-702"
    },
    {
        month: 6,
        day: 9,
        title: "El Desastre de Craso en Carras",
        text: "A veces por cierto con alegrías se mezclan tristezas, y al pueblo no agradan las fiestas con toda el alma. Junto al Éufrates Craso las águilas, su hijo y los suyos perdió, y él mismo se dio a la muerte el último.",
        reference: "Libro VI, vv. 463-466"
    },
    {
        month: 6,
        day: 21,
        title: "El Desastre del Lago Trasimeno ante Aníbal",
        text: "Que Flaminio y trasimenas orillas te sean testigos, que por aves avisan mucho propicios dioses. Si del viejo desastre los temerarios tiempos inquieres, del fin del mes el día aquél dos veces quinto.",
        reference: "Libro VI, vv. 765-768"
    }
];

export const OVID_PRECES_ET_SACRA: OvidPrayer[] = [
    {
        startMonth: 1,
        startDay: 24,
        endMonth: 1,
        endDay: 26,
        title: "Oración de los Campesinos",
        text: "Saciad a colonos ávidos con frutos inmensos... Dad vosotras a jóvenes siembras perpetuos aumentos, y nueva hierba no por gélidas nieves se arda. Mientras sembramos, abrid el cielo con vientos serenos; mientras se esconde, rociad con agua etérea el grano.",
        reference: "Libro I, vv. 677-682"
    },
    {
        startMonth: 4,
        startDay: 21,
        endMonth: 4,
        endDay: 21,
        title: "La Plegaria del Pastor",
        text: "Al par —di— por mi hato vela y por mayorales del hato... Si apacenté en sagrado, o me senté bajo un árbol sagrado... da venia a mi culpa... Que ubres plenas oprima, tráigame bronces el queso y a líquido suero den paso los mimbres ralos.",
        reference: "Libro IV, vv. 747-750, 769-770"
    },
    {
        startMonth: 5,
        startDay: 15,
        endMonth: 5,
        endDay: 15,
        title: "La descarada oración del Comerciante",
        text: "Quítame los perjurios del tiempo pretérito —dice—, quita al pretérito día las voces pérfidas... Que viniendo el día a mi servicio estén los perjurios y que descuiden los dioses, si digo algunos. Dame tan sólo lucros; dame, logrado el lucro, alegrías, y haz que al comprador me agrade haber burlado.",
        reference: "Libro V, vv. 681-690"
    },
    {
        startMonth: 2,
        startDay: 23,
        endMonth: 2,
        endDay: 23,
        title: "El Canto a los Límites de Piedra",
        text: "Tú a pueblos, ciudades y reinos ingentes marcas el límite: / lleno de pleitos todo el agro, sin ti, estaría. / Ninguna ambición tienes, por ningún oro estás corrompido, / guardas con fe leal los campos a ti confiados.",
        reference: "Libro II, vv. 659-662",
        icon: "🪨"
    },
    {
        startMonth: 3,
        startDay: 1,
        endMonth: 3,
        endDay: 1,
        title: "El Ruego de las Embarazadas",
        text: "Decid: 'tú la luz a nosotras nos diste, Lucina': / decid: 'tú al voto de parturienta llega'. / Si alguna empero está grávida, ruegue con crin desatada, / que muellemente sus partos resuelva aquélla.",
        reference: "Libro III, vv. 255-258",
        icon: "🚼"
    },
    {
        startMonth: 4,
        startDay: 25,
        endMonth: 4,
        endDay: 25,
        title: "Oración contra el Tizón",
        text: "Áspera Robígine perdona a las hierbas de Ceres... / Perdona, ruego, y de las mieses quita tus sórdidas manos, / ni dañes cultivos; que puedas dañarlos basta. / Ni a tiernos sembrados, sino abraza al rígido hierro / y, lo que a otros puede perder, pierde antes.",
        reference: "Libro IV, vv. 911, 921-924",
        icon: "🌾"
    },
    {
        startMonth: 6,
        startDay: 1,
        endMonth: 6,
        endDay: 1,
        title: "Conjuro contra los Vampiros",
        text: "Aves de la noche, perdonad entrañas pueriles / —exclama—: por párvulo víctima parva cae. / Tomad, os ruego, corazón por corazón, fibras por fibras. / Os entrego por otra mejor, esta ánima.",
        reference: "Libro VI, vv. 159-162",
        icon: "🦇"
    }
];

export const OVID_AEDES_ET_MONUMENTA: OvidMonument[] = [
    {
        month: 1,
        day: 16,
        title: "Templo de la Concordia",
        text: "Livia a ti aun, Concordia, consagra con magnífico templo, ella misma primero ésta mostró al marido. Aprende empero, viniente edad, que, donde hoy está el pórtico de Livia, techos hubo de inmensa casa... Ésta se igualó con el suelo, bajo ningún crimen del reino, mas porque pareció que dañaba con su lujo.",
        reference: "Libro VI, vv. 637-642"
    },
    {
        month: 6,
        day: 11,
        title: "Templo de la Concordia",
        text: "Livia a ti aun, Concordia, consagra con magnífico templo, ella misma primero ésta mostró al marido. Aprende empero, viniente edad, que, donde hoy está el pórtico de Livia, techos hubo de inmensa casa... Ésta se igualó con el suelo, bajo ningún crimen del reino, mas porque pareció que dañaba con su lujo.",
        reference: "Libro VI, vv. 637-642"
    },
    {
        month: 1,
        day: 30,
        title: "Ara Pacis",
        text: "El mismo carmen al ara de la Paz me condujo... Con guirnaldas del Accio ceñida en compuestos cabellos, ven Paz, y benévola queda en el orbe entero.",
        reference: "Libro I, vv. 709-712"
    },
    {
        month: 5,
        day: 12,
        title: "Templo de Marte Vengador",
        text: "El propio Vengador desde el cielo, para ver sus honores y sus templos en el foro augustal, desciende. Es ingente el dios y su obra... Observa en las puertas dardos de diversa figura y armas de las tierras, vencidas por su mílite.",
        reference: "Libro V, vv. 551-553, 561-562"
    }
];

export const OVID_STATUS_EXPLANATIONS: OvidStatusExplanation[] = [
    {
        status: "N",
        text: "Será nefasto aquél, a través del cual tres voces se callan [los tribunales cierran].",
        reference: "Libro I, v. 47"
    },
    {
        status: "NP",
        text: "Nefasto en parte: similar al nefasto, son días donde la actividad jurídica está restringida en las horas de sacrificio.",
        reference: "Libro I, v. 47 (interpretación)"
    },
    {
        status: "EN",
        text: "Endotercis: Días que son nefastos al principio y al final, pero fastos en el intervalo medio de los sacrificios.",
        reference: "Libro I, v. 50 (interpretación)"
    },
    {
        status: "F",
        text: "Fasto, a través del cual podrá por ley actuarse. Y no pienses que sus leyes para todo día persisten: el que ya será fasto, era nefasto al alba.",
        reference: "Libro I, vv. 48-50"
    },
    {
        status: "C",
        text: "Lo hay también en que es ley encerrar al pueblo en vallados [Días Comiciales para votar].",
        reference: "Libro I, v. 53"
    },
    {
        status: "Nundinae",
        text: "Lo hay también que siempre de ciclo noveno vuelve [El día de mercado o Nundinae].",
        reference: "Libro I, v. 54"
    }
];

export const OVID_SACRIFICIA: OvidSacrifice[] = [
    {
        month: 1,
        day: 9,
        title: "La Culpa de la Cerda",
        text: "Ceres primera gozóse en la sangre de ávida puerca: del culpable con justa muerte vengó sus bienes. Pues siembras que en primavera tiernos jugos lechaban, por hocico de cerda crinosa halló arrancadas.",
        reference: "Libro I, vv. 349-352",
        icon: "🐖",
        crime: "Destrozar las cosechas."
    },
    {
        month: 1,
        day: 9,
        title: "El Crimen del Chivo",
        text: "Alguien en la vid clavando los dientes... dijo: 'roe, chivo, la vid: de aquí empero, cuando estés junto al ara, será lo que en tus cuernos rociarse pueda'. Sigue el pacto a las voces: hoste por daño dado a ti, Baco, es rociado en los cuernos con derramado vino.",
        reference: "Libro I, vv. 355-360",
        icon: "🐐",
        crime: "Comerse las vides de uva."
    },
    {
        month: 1,
        day: 9,
        title: "La Culpa del Buey",
        text: "Cubre con tierra el cuerpo de un muerto novillo: lo que pides de mí te dará aquél, cubierto. Hace el pastor lo ordenado. Hierven enjambres de pútrido buey: muerta una sola, ánimas mil ha dado.",
        reference: "Libro I, vv. 377-380",
        icon: "🐂",
        crime: "Condenado para generar abejas de su cadáver putrefacto."
    },
    {
        month: 1,
        day: 9,
        title: "La Culpa de la Oveja",
        text: "Pide a la oveja el hado: gustó, ímproba, verbenas [hierbas sagradas], que a dioses del campo solía llevar piadosa vieja.",
        reference: "Libro I, vv. 381-382",
        icon: "🐑",
        crime: "Comerse las hierbas sagradas de una anciana."
    },
    {
        month: 1,
        day: 9,
        title: "La Ofrenda del Caballo",
        text: "Con su caballo aplaca Persia a Hiperión ceñido de rayos, para que no al dios veloz víctima tarda dése.",
        reference: "Libro I, vv. 385-386",
        icon: "🐎",
        crime: "Ninguno (Magia simpática: animal veloz para un dios veloz)."
    },
    {
        month: 1,
        day: 9,
        title: "La Culpa del Asno",
        text: "He aquí que rebuznando el asnillo... sacó de ronco hocico intempestivos ruidos. Se alza aterrada la Ninfa... Mas el dios muy preparado aun en sus partes viriles, a la luz de la luna risa de todos era. Fue castigado el autor del clamor con su muerte: y esta víctima al dios del Helesponto es grata.",
        reference: "Libro I, vv. 433-440",
        icon: "🫏",
        crime: "Rebuznar y arruinar la cita íntima del dios Príapo con la Ninfa Lotis."
    },
    {
        month: 1,
        day: 9,
        title: "El Crimen de las Aves",
        text: "Habíais estado intactas, aves, solaces del campo... Pero esto nada os ayuda, porque tenéis crimen de lengua y dioses juzgan que sus mentes abrís vosotras.",
        reference: "Libro I, vv. 441, 445-446",
        icon: "🕊️",
        crime: "Ser chismosas y revelar los secretos divinos."
    },
    {
        month: 1,
        day: 9,
        title: "El Crimen del Gallo",
        text: "De noche a diosa Noche se inmola el ave crestada, pues con son vigilante convida al tibio día.",
        reference: "Libro I, vv. 455-456",
        icon: "🐓",
        crime: "Despertar al día y acortar el reinado de la oscuridad."
    },
    {
        month: 2,
        day: 13,
        title: "El Carnero de los Idus",
        text: "Casto sacerdote en templo de Júpiter magno, los Idus, vísceras de un carnero castrado en flamas liba.",
        reference: "Libro II, vv. 587-588",
        icon: "🐏",
        crime: "Ofrenda lustral tradicional en los Idus de Febrero."
    },
    {
        month: 2,
        day: 15,
        title: "El Chivo de las Lupercalias",
        text: "Inmolada la cabra por costumbre a cornípedo Fauno... Nombróse el mes de esto [Februa], porque Lupercos con un cuero en tiras lustran todo el suelo y por expiación lo tienen.",
        reference: "Libro II, vv. 361, 31-32",
        icon: "🐐",
        crime: "Poder fecundador y purificador de su piel (azotes con tiras de cuero llamadas februa)."
    },
    {
        month: 2,
        day: 15,
        title: "El Perro de las Lupercalias",
        text: "Aunque Ovidio omite el detalle del sacrificio del perro en los Fastos, esta víctima se inmolaba junto al chivo en la gruta Lupercal por su conexión con la purificación y la custodia de los rebaños frente a los lobos.",
        reference: "Libro II, v. 361 (Contexto histórico)",
        icon: "🐕",
        crime: "Pureza y protección lustral (sacrificio apotropaico)."
    },
    {
        month: 2,
        day: 23,
        title: "La Oveja de las Terminalias",
        text: "Término común se esparce aun con degollado cordero y no se queja... En ella [la Vía Laurentina], que ritos con entrañas de rebaño lanígero se te hacen, Término, ve desde urbe sexta piedra.",
        reference: "Libro II, vv. 655, 681-682",
        icon: "🐑",
        crime: "Sangre sobre el mojón de piedra para santificar las fronteras y límites del agro."
    },
    {
        month: 2,
        day: 23,
        title: "El Cerdito de las Terminalias",
        text: "Término común se esparce... y no se queja, cuando puerca le dan lactante.",
        reference: "Libro II, vv. 655-656",
        icon: "🐖",
        crime: "Santificación rural del mojón de piedra de la propiedad privada."
    },
    {
        month: 2,
        day: 27,
        title: "Los Caballos de las Equirrias",
        text: "Y ya del mes segundo quedan dos noches, y Marte incita los rápidos potros a uncidos carros. De lo real quedó el puesto nombre de Equirrias, las cuales en su Campo el mismo dios divisa.",
        reference: "Libro II, vv. 857-860",
        icon: "🐎",
        crime: "Carreras consagradas a Marte (magia de velocidad y potencia militar)."
    },
    {
        month: 3,
        day: 1,
        title: "El Engaño de Numa: Por qué los Romanos no sacrifican humanos",
        text: "Dijo (Júpiter): 'una cabeza corta': 'obedeceré —el rey le responde—, cebolla ha de cortarse sacada de mis huertos'. Éste añadió: 'de hombre': dice aquél: 'tomarás los cabellos'. Pide éste un alma, 'de pez', le responde Numa. Rio y dijo: 'con esto harás que conjuras mis dardos, oh héroe...'",
        reference: "Libro III, vv. 339-344",
        icon: "🧅🐟",
        crime: "Sustitución ingeniosa de la ofrenda humana por elementos simbólicos (cebolla, cabello y pez)."
    },
    {
        month: 3,
        day: 7,
        title: "Vejove: El Sacrificio de la Oveja",
        text: "Y ante el santuario de Numa y el capitolino Tonante se inmola una oveja en alta mansión de Júpiter.",
        reference: "Libro III, vv. 69-70",
        icon: "🐑",
        crime: "Ofrenda tradicional al capitolino Vejove."
    },
    {
        month: 3,
        day: 15,
        title: "Anna Perenna: La Ofrenda de la Vaca",
        text: "(Numa) la vaca Alba llevó con un níveo toro al yugo... Y porque no diera un salto, presta a pararse en la tierra, fue apenas ya, por mano de Evandro detenida.",
        reference: "Libro III (Asociación mítica)",
        icon: "🐂",
        crime: "Asociación mítica con ritos antiguos de fundación y sacrificios propiciatorios del mes."
    },
    {
        month: 3,
        day: 23,
        title: "Tubilustrium: Purificación de las Trompetas",
        text: "De los cinco el último día lustrar trompetas canoras advierte y sacrificios hacer a fuerte diosa. Hoy puedes decir, alzando al sol el semblante: 'de la oveja de Frixo prensó éste ayer vellones'.",
        reference: "Libro III, vv. 849-852",
        icon: "🎺",
        crime: "Purificación de trompetas de guerra (tubae) a una diosa fuerte."
    },
    {
        month: 4,
        day: 11,
        title: "Cerealia: El Respeto al Buey",
        text: "Ministros de atado vestido, apartad del buey los cuchillos: que are el buey; sacrificad a perezosa puerca. Apta cerviz al yugo por la segur herirse no debe: que viva y a menudo labore en dura tierra.",
        reference: "Libro IV, vv. 413-416",
        icon: "🐂"
    },
    {
        month: 4,
        day: 15,
        title: "Fordicidia: La Vaca Preñada",
        text: "Ofreced sacrificios con una preñada vaca. Forda es la vaca encinta y fecunda... Grávida está hoy la grey, grávidas por simiente hoy las tierras: a Tierra plena víctima plena dase. Cae, parte en fuerte de Júpiter, curia tres veces diez vacas recibe... Y cuando ministros, de las vísceras becerros quitaron... la virgen que es mayor de edad los becerros quema en el fuego.",
        reference: "Libro IV, vv. 630-639",
        icon: "🐄🩸",
        crime: "Asegurar la fertilidad primaveral sacrificando una vaca encinta y consagrando las cenizas del feto becerro."
    },
    {
        month: 4,
        day: 19,
        title: "Cerealia: Las Zorras Incendiarias",
        text: "La causa pues por qué enviadas zorras llevan lomos por teas atadas debe por mí enseñarse... Ley de Carséolo veta que hoy también la zorra atrapada incendie; y porque penas pague, en las Cereales esta especie arde; y ella misma perece como perdió a las mieses.",
        reference: "Libro IV, vv. 681-682, 709-712",
        icon: "🦊🔥",
        crime: "Castigo ancestral a los zorros por esparcir fuego en los campos de trigo arrojándolos al circo con teas encendidas."
    },
    {
        month: 4,
        day: 21,
        title: "Parilia: El Sahumerio Purificador",
        text: "Ve, pueblo, llega al sahumerio del ara virgínea; Vesta lo dará, puro serás por don de Vesta. Será sangre equina y rescoldos de becerro el sahumerio, tercer objeto, inane tallo del haba dura.",
        reference: "Libro IV, vv. 731-734",
        icon: "🐎🩸",
        crime: "Purificación sagrada (suffimen) mediante la mezcla de cenizas de becerro, sangre de caballo y tallos de haba."
    },
    {
        month: 4,
        day: 25,
        title: "La Oveja de la Robigalia",
        text: "De antigua Robígine al bosque iba el flamen para, a las flamas, entrañas de perro, entrañas dar de oveja...",
        reference: "Libro IV, vv. 907-908",
        icon: "🐑",
        crime: "Aplacar a la diosa Robígine (roya del trigo) para proteger las cosechas."
    },
    {
        month: 4,
        day: 25,
        title: "El Perro de la Robigalia",
        text: "¿Por qué se da nueva víctima [el perro] en ritos, buscas? Oye la causa —el flamen me dijo entonces—. Hay un Can, lo llaman Icario: salido tal astro, tierra ardida está seca... Por un can sideral un can aquí al ara se impone, y nada, sino el nombre tiene, por qué perezca.",
        reference: "Libro IV, vv. 937-942",
        icon: "🐕",
        crime: "Sustitución mítica del Can sideral (Sirio) para conjurar sus ardientes rayos destructores."
    },
    {
        month: 5,
        day: 1,
        title: "Floralia: Cabras y Liebres Pacíficas",
        text: "¿Por qué en vez de líbicas leonas, con red te aprisionan pacíficas cabras y asustadizas liebres?... Respondió que no selvas, sino le concedieron los huertos, y las campiñas por fiera pugnaz no andables.",
        reference: "Libro V, vv. 371-374",
        icon: "🐇",
        crime: "Ofrenda de bestias mansas en los campos y huertos de la diosa Flora."
    },
    {
        month: 5,
        day: 1,
        title: "Floralia: La Ofrenda del Moretum",
        text: "'¿No avergüenza —dije— que sirvieran el herboso moreto en mesas de la dueña? ¿O es que subsiste causa?' 'Cuentan que antiguos usaron de leche pura y de hierbas... Cándido queso a destrozadas hierbas se mezcla, para que antiguas viandas conozca antigua diosa'.",
        reference: "Libro V, vv. 367-372",
        icon: "🥗",
        crime: "Ofrenda tradicional de queso y hierbas machacadas de los antiguos antepasados."
    },
    {
        month: 5,
        day: 9,
        title: "Lemuria: La Redención por las Habas Negras",
        text: "Y cuando en la onda de la fuente bien lavó puras sus manos, se vuelve y antes toma las habas negras, y vuelto las lanza. Mas mientras las lanza: '¡éstas yo envío; con estas habas —dice— redimo a mí y los míos!' Nueve veces dice esto y no voltea. Se piensa que júntalas la sombra y que atrás sigue sin que la vea nadie.",
        reference: "Libro V, vv. 435-440",
        icon: "🫘",
        crime: "Redención mágica de la familia escupiendo habas negras a los fantasmas hambrientos en la noche."
    },
    {
        month: 5,
        day: 12,
        title: "Ludi Martiales: El Sacrificio de Hirieo",
        text: "Cuando volvióle el ánimo, al buey que cultiva su pobre agro inmola y lo asa en magna lumbre... Asentido habían todos; ante la piel del buey todos se habían parado... Entonces lo húmedo echado encima cubrieron con tierra: ya diez meses y el niño nacido había.",
        reference: "Libro V, vv. 513-514, 531-534",
        icon: "🐂",
        crime: "Sacrificio hospitalario del único buey de un campesino en honor a los dioses visitantes."
    },
    {
        month: 5,
        day: 15,
        title: "Mercuralia: El Incienso de los Comerciantes",
        text: "Quienes profesan vender sus mercancías te ruegan, dándote incienso, que les otorgues lucros. Viene acá el mercader ceñido con túnica y puro con urna sahumada, agua... También sus cabellos con lauro rociante él mismo rocía y preces con voz que suele engañar pronuncia.",
        reference: "Libro V, vv. 671-672, 675-680",
        icon: "🪙",
        crime: "Ofrenda de incienso aromático a Mercurio para bendecir las ganancias y argucias de los comerciantes."
    },
    {
        month: 6,
        day: 1,
        title: "Calendas Fabarias: El Trueque Mágico de Carna",
        text: "[Carna] rocía entradas con aguas... y de bimestral puerca crudas entrañas coge; y así: 'aves de la noche, perdonad entrañas pueriles —exclama—: por párvulo víctima parva cae. Tomad, os ruego, corazón por corazón, fibras por fibras. Os entrego por otra mejor, esta ánima'.",
        reference: "Libro VI, vv. 157-162",
        icon: "🐖",
        crime: "Sustitución mágica de vidas ('animam pro meliore') entregando entrañas de cerdita para salvar al infante de las garras de las Estriges (lechuzas vampiro)."
    },
    {
        month: 6,
        day: 1,
        title: "Calendas Fabarias: Tocino y Habas",
        text: "La puerca era apreciada, muerta la puerca fiestas hacían. La tierra sólo habas y duras espeltas daba. Quien las dos mezcladas al par comiera en las sextas Calendas, niegan que se le puedan dañar las vísceras.",
        reference: "Libro VI, vv. 181-184",
        icon: "🍲",
        crime: "Banquete tradicional para la buena salud de las vísceras y el sistema digestivo."
    },
    {
        month: 6,
        day: 9,
        title: "Vestalia: El Descanso del Asno Coronado",
        text: "Llega a estos años algo de la costumbre vetusta: platillo puro lleva a Vesta ofrendadas viandas. He aquí el pan cuelga de coronadas borricas, y floridas guirnaldas ásperas muelas velan.",
        reference: "Libro VI, vv. 309-312",
        icon: "🫏",
        crime: "Costumbre antigua que rinde homenaje a los asnos de los molinos de pan velándolos con guirnaldas y roscas de pan."
    },
    {
        month: 6,
        day: 15,
        title: "Q.St.D.F.: La Ofrenda de los Argei",
        text: "Aun luego la virgen suele arrojar desde un puente de roble simulacros de junco de primitivos hombres... [Se decía] 'dad a falcífero anciano inmolados dos cuerpos del pueblo que recibidos sean por las etruscas aguas'... [o] que aquél [Hércules], hechos de paja, envió al agua Quirites: que se lanzan, a ejemplo de Hércules, cuerpos falsos.",
        reference: "Libro VI, vv. 621-622, 627-628, 631-632",
        icon: "🧍‍♂️🌊",
        crime: "Sustitución mítica de sacrificios humanos por simulacros y efigies de junco arrojadas al Tíber desde el puente de roble."
    },
    {
        isGeneric: true,
        title: "El Castigo por Chismosos",
        text: "Habíais estado intactas, aves, solaces del campo... Pero esto nada os ayuda, porque tenéis crimen de lengua y dioses juzgan que sus mentes abrís vosotras... De noche a diosa Noche se inmola el ave crestada [gallo], pues con son vigilante convida al tibio día.",
        reference: "Libro I, vv. 441, 445-446, 455-456",
        icon: "🐔"
    }
];

// atticCalendarData.ts — Major Athenian festivals keyed by Attic month and approximate day
import { ATTIC_MONTHS } from './atticCalendarUtils';

export interface AtticFestivalInfo {
  festivalName: string;
  festivalDesc: string;
  deity: string;
  deityDesc: string;
  festivalDayName?: string;
  category?: 'Agrario y Fertilidad' | 'Cívico y Patriótico' | 'Mistérico y Ctónico' | 'Dramático y Dionisíaco' | 'Purificación y Expiación' | 'Familiar y Social';
  participants?: string;
  isApaphrades?: boolean;
  // NUEVO:
  ritualOffering?: { item: string; icon: string };
  pannychisDesc?: string; // Descripción de la vigilia nocturna o carrera de antorchas
  agonDesc?: string; // Descripción de las competiciones, juegos o teatro
  economyDesc?: string; // Coste del festival, premios o financiación (Liturgias, Theorikon)
  aition?: string; // Mito fundacional que justifica el ritual
}

// Keyed by "monthIndex-dayOfMonth" (monthIndex 0-11, dayOfMonth 1-30)
// This record is now deprecated in favor of the programmatic getAtticFestivalInfo
// but we keep the comment for reference if needed.

export const getAtticFestivalInfo = (monthIndex: number, dayOfMonth: number): AtticFestivalInfo | null => {
  // 0. HECATOMBAION (Pleno Verano)
  if (monthIndex === 0) {
    if (dayOfMonth === 12) return {
      festivalName: "Kronia",
      deity: "Kronos",
      deityDesc: "Antiguo dios de la cosecha.",
      festivalDesc: "Fiesta de fin de cosecha donde esclavos y amos cenaban juntos en un ambiente de total libertad.",
      category: "Familiar y Social",
      participants: "Ciudadanos y Esclavos",
      // Aition: Gold Age framing removed — Parke gives only an agricultural explanation.
      // "Masters serving slaves" is a Roman Saturnalia detail, not attested for the Attic Kronia.
      aition: "Un festín de fin de cosecha antiquísimo que igualaba temporalmente las clases sociales. Ninguna fuente ática conserva un mito fundacional; la explicación es agrícola e institucional."
    };
    if (dayOfMonth === 16) return {
      festivalName: "Synoikia",
      // Parke + Deubner: Zeus Phratrios present alongside Athena; Eirene cult added 374 BC (Cephisodotus).
      deity: "Atenea y Zeus Phratrios",
      deityDesc: "Diosa de la ciudad y protector de las fratrías (+ Eirene desde 374 a.C.).",
      festivalDesc: "Conmemora la unificación del Ática por Teseo.",
      category: "Cívico y Patriótico",
      participants: "Fylobasileis (Reyes de las tribus)",
      aition: "Conmemora el Synoikismos atribuido a Teseo, la unificación de los demos del Ática (Tucídides 2.15)."
    };
    if (dayOfMonth === 28) return {
      festivalName: "Panathenaia",
      deity: "Atenea Polias",
      deityDesc: "Diosa protectora de la ciudad.",
      festivalDesc: "El mayor festival de Atenas. Gran procesión para entregar el nuevo Peplos a la diosa, acompañado de hecatombes de vacas y competiciones atléticas.",
      category: "Cívico y Patriótico",
      participants: "Toda la ciudad, Kanephoroi, Ergastinai, Epheboi, Metecos",
      pannychisDesc: "Vigilia nocturna con coros de doncellas y danzas. Se encendía el fuego del altar mediante una carrera de antorchas desde el altar de Eros.",
      agonDesc: "Certámenes atléticos y musicales. Destacan los 'Apobatai' (guerreros saltando de carros de 4 caballos en marcha) y la 'Evandria' (concurso tribal de tamaño, belleza y fuerza masculina).",
      economyDesc: "Los vencedores recibían las invaluables Ánforas Panatenaicas llenas de aceite de oliva de los olivos sagrados (Moriai) de la diosa.",
      // "o Asterión" removed — neither Parke nor Deubner mentions Asterión in the Gigantomachy context.
      aition: "Se teje un gigantesco vestido (peplo) a modo de vela de barco para Atenea, bordado con la Batalla de los Dioses y los Gigantes, conmemorando la victoria de Atenea sobre el gigante Encélado. La fiesta anual (día 28) y la Gran Panathenaia cuadrienal incluían los agonos completos."
    };
  }

  // 1. METAGEITNION (Finales de Verano)
  if (monthIndex === 1) {
    // Day uncertain: neither Parke nor Deubner assigns a day; Mikalson: UNCERTAIN. Day 7 is conventional.
    if (dayOfMonth === 7) return {
      festivalName: "Metageitnia",
      deity: "Apolo Metageitnios",
      deityDesc: "Apolo como dios del buen vecindario.",
      festivalDesc: "Festival homónimo del mes (día aproximado; ninguna fuente conserva la fecha exacta). Sacrificio y banquete comunitario para fortalecer los lazos entre vecinos.",
      category: "Familiar y Social",
      // Migration aition removed — neither Parke nor Deubner records this narrative.
      aition: "El nombre derivaba de μετοίκησις (cambio de vecindad). Ninguna fuente ática transmite los ritos; el festival está atestiguado también en Mileto, Delos, Éfeso y Samos."
    };
    // Day uncertain; festival character is feast + sacrifice, not athletics (Parke + Deubner).
    if (dayOfMonth === 15) return {
      festivalName: "Herakleia en Kynosarges",
      deity: "Heracles",
      deityDesc: "Héroe deificado, patrón de los atletas.",
      // "Festival atlético" corrected: Parke characterises it as feast + sacrifice. Athletics not mentioned.
      // "metecos" corrected to "nothoi (hijos de ciudadano y extranjera)" per both Parke and Deubner.
      festivalDesc: "Festival de sacrificio y banquete en el gimnasio de Kynosarges. Abierto a los nothoi (hijos de ciudadano y extranjera) junto con ciudadanos. Práctica singular: el buey era levantado entero sobre el altar antes del degüello. Doce Parasitoi participaban del sacrificio.",
      category: "Cívico y Patriótico",
      participants: "Ciudadanos, Nothoi (hijos de ciudadano y extranjera), doce Parasitoi",
      // White-dog etymology aition omitted — not in Parke 1977 or Deubner 1932.
      aition: "Kynosarges ('perro blanco'): nombre atestiguado por fuentes lexicográficas tardías. El bullicio del banquete en este santuario suburbano era conocido en toda Atenas."
    };
  }

  // 2. BOEDROMION (Principio de Otoño)
  if (monthIndex === 2) {
    if (dayOfMonth === 5) return {
      festivalName: "Genesia",
      // Deubner: sacrifice to Ge (Earth) as well as for the dead; app previously omitted Ge.
      deity: "Los Muertos / Ge (Tierra)",
      deityDesc: "Ancestros, caídos y la Tierra que los acoge.",
      festivalDesc: "Día de recuerdo y luto público por los muertos. Solón lo transformó de rito aristocrático de clan en festival estatal.",
      category: "Mistérico y Ctónico",
      participants: "Familias atenienses",
      isApaphrades: true,
      // Ge-blood-foundation aition removed — invented, not in Parke or Deubner.
      aition: "Solón convirtió un rito privado de los clanes aristocráticos en un día de duelo público por todos los ciudadanos caídos. No se conserva mito fundacional; la explicación es histórica."
    };
    if (dayOfMonth === 6) return {
      festivalName: "Festival de Artemisa Agrotera",
      deity: "Artemisa",
      deityDesc: "Cazadora y protectora en batalla.",
      festivalDesc: "Conmemoración de la victoria de Maratón. Se sacrificaban 500 cabras anuales en cumplimiento de un voto. El día 6 fue elegido porque Artemisa ya tenía culto en esa fecha mensual (Apolo, su hermano, nacía el 7).",
      category: "Cívico y Patriótico",
      participants: "Polemarchos, Epheboi",
      aition: "Antes de Maratón se prometió una cabra por cada persa muerto. Al morir más de 6.400 enemigos, la deuda era imposible de saldar de golpe; se renegoció en 500 cabras anuales."
    };
    if (dayOfMonth === 7) return {
      festivalName: "Boedromia",
      deity: "Apolo Boedromios",
      deityDesc: "El que acude en ayuda al grito de guerra.",
      festivalDesc: "Acción de gracias militar que marcaba el fin de la temporada de campañas.",
      category: "Cívico y Patriótico",
      participants: "Ciudadanos y Militares",
      aition: "El nombre significa 'correr a ayudar al oír un grito'. El mito asocia el festival con la llegada del héroe Ión en auxilio de Atenas; Parke lo considera una racionalización aetiológica tardía."
    };

    // MISTERIOS ELEUSINOS
    const eleusisBase = {
      festivalName: "Misterios Eleusinos Mayores",
      deity: "Deméter y Perséfone",
      deityDesc: "Diosas del grano y del inframundo.",
      category: "Mistérico y Ctónico" as const,
      participants: "Mystai (Iniciados), Hierofante, Daiduchos"
    };
    if (dayOfMonth === 15) return {
      ...eleusisBase,
      festivalDayName: "Agyrmos (La Reunión)",
      festivalDesc: "Proclamación oficial invitando a los candidatos puros a la iniciación.",
      aition: "El heraldo proclama que se alejen los impuros (bárbaros y los que tengan sangre en sus manos). El concepto de miasma implicaba que un participante impuro podría dañar el rito y a toda la comunidad."
    };
    if (dayOfMonth === 16) return {
      ...eleusisBase,
      festivalDayName: "Halade Mystai (¡Al mar, iniciados!)",
      // "a Falero" corrected: Parke says Piraeus or Phaleron; Deubner specifies Kantharos harbour (Piraeus).
      festivalDesc: "Los iniciados marchan al Pireo (o Falero) para purificarse bañándose en el mar salado junto con un lechón.",
      // Scapegoat interpretation removed — directly contradicts Parke. Pig = conventional Demeter fecundity offering.
      aition: "El lechón sacrificado era la ofrenda tradicional a Deméter, símbolo de fecundidad (Parke), no un portador de culpas. El baño en agua salada purificaba ritualmente al iniciado."
    };
    if (dayOfMonth === 17) return {
      ...eleusisBase,
      festivalDayName: "Hither the Victims",
      festivalDesc: "Gran sacrificio oficial del estado a las Dos Diosas."
    };
    if (dayOfMonth === 18) return {
      ...eleusisBase,
      festivalDayName: "Epidauria",
      festivalDesc: "Llegada de Asclepio. Los rezagados se purifican y se rinde culto al dios de la medicina."
    };
    if (dayOfMonth === 19) return {
      ...eleusisBase,
      festivalDayName: "La Marcha a Eleusis",
      festivalDesc: "Gran procesión escoltando las 'Cosas Sagradas' de vuelta a Eleusis.",
      // Gephyrismos aition corrected: Parke explicitly says the purpose is unknowable; the old-women-Demeter
      // link belongs to the Iambe/Baubo tradition (Homeric Hymn), not the gephyrismos.
      aition: "Gephyrismos (Los insultos del puente): hombres con el rostro cubierto lanzaban insultos anónimos y obscenidades a los peregrinos al cruzar el puente del Kefiso. El propósito exacto del rito es desconocido (Parke); posiblemente apotropaico, posiblemente una licencia tradicional."
    };
    if (dayOfMonth === 20) return {
      festivalName: "Misterios Eleusinos Mayores",
      festivalDayName: "Telete (La Iniciación)",
      deity: "Deméter y Perséfone",
      deityDesc: "Diosas del grano y del inframundo.",
      category: "Mistérico y Ctónico",
      participants: "Mystai (Iniciados), Hierofante, Daiduchos",
      festivalDesc: "Noche de vigilia, ayuno y bebida del Kykeon. Revelación en el Telesterion.",
      ritualOffering: { item: "Kykeon (bebida de harina de cebada, agua y poleo)", icon: "🥣" },
      pannychisDesc: "La iniciación suprema ocurría de noche dentro del Telesterion. Una gran luz brillaba en la oscuridad revelando las 'Cosas Sagradas'.",
      aition: "Los iniciados beben Kykeon (harina de cebada, agua y poleo) porque Deméter, de luto por Perséfone, rechazó el vino y pidió esta mezcla humilde, convirtiéndola en ley ritual."
    };
    if (dayOfMonth === 21) return {
      ...eleusisBase,
      festivalDayName: "Segundo día de revelaciones",
      festivalDesc: "Continuación de los ritos secretos en el Telesterion. Los epoptai (iniciados avanzados) recibían la visión suprema de las Cosas Sagradas.",
      pannychisDesc: "Segunda noche de vigilia sagrada. Los epoptai accedían al grado supremo de revelación.",
      aition: "El segundo día culminaba con la Epopteia: la visión definitiva que, según Plutarco, eliminaba el miedo a la muerte para siempre. Revelarla se castigaba con la muerte."
    };
    if (dayOfMonth === 22) return {
      ...eleusisBase,
      festivalDayName: "Plemochoai",
      festivalDesc: "Rito vertiendo vasijas de agua al este y al oeste pidiendo fertilidad.",
      ritualOffering: { item: "Plemochoai (Vasijas en forma de peonza volcadas hacia el este y oeste)", icon: "🏺" },
      aition: "Los iniciados vierten agua desde vasijas en forma de peonza murmurando una fórmula secreta: magia empática para invocar la lluvia y fertilizar las semillas."
    };
  }

  // 3. PYANEPSION (Otoño - Siembra)
  if (monthIndex === 3) {
    if (dayOfMonth === 5) return {
      festivalName: "Proerosia",
      deity: "Deméter",
      deityDesc: "Diosa de la agricultura.",
      festivalDesc: "Sacrificio preliminar antes de la arada. Se ofrecían los primeros frutos (diezmos) de toda Grecia.",
      category: "Agrario y Fertilidad",
      aition: "Una plaga prehistórica destruyó las plantas del mundo, y el Oráculo dictaminó que los campos solo volverían a ser fértiles si Atenas sacrificaba a Deméter en nombre de toda la humanidad."
    };
    if (dayOfMonth === 7) return {
      festivalName: "Pyanepsia y Oschophoria",
      // Parke + Agora inscription: Athena Skiras is the primary deity of the Oschophoria.
      deity: "Apolo (Pyanepsia) / Atenea Skiras y Dioniso (Oschophoria)",
      deityDesc: "Apolo de los primeros frutos / Atenea Skiras (primaria, confirmada por inscripción del Ágora) y Dioniso.",
      // Main Oschophoria rite was a procession of two Oschoporoi, not a general race.
      festivalDesc: "Se ofrecía un caldo de legumbres (Pyanepsia) y la rama Eiresione. Procesión solemne de dos jóvenes nobles (Oschophoroi) vestidos de mujer portando racimos de uva, desde un santuario de Dioniso hasta el templo de Atenea Skiras en Falero.",
      category: "Agrario y Fertilidad",
      participants: "Jóvenes, Oschophoroi (dos jóvenes nobles), Deipnophoroi",
      ritualOffering: { item: "Panspermia (caldo de todas las legumbres) y la Eiresione (rama de olivo envuelta en lana con frutos y pan)", icon: "🍲" },
      aition: "Pyanepsia: Se cocina panspermia porque Teseo hirvió todas sus sobras al volver de Creta. Eiresione: Teseo llevó ramas suplicantes ya existentes en su viaje a Delos. Oschophoria: El heraldo lleva su corona en el bastón y hay gritos de alegría y dolor por el regreso de Teseo y la muerte del rey Egeo. Deipnophoroi: Las mujeres cuentan cuentos imitando a las madres de los jóvenes enviados al Minotauro."
    };
    if (dayOfMonth === 8) return {
      festivalName: "Theseia",
      deity: "Teseo",
      deityDesc: "Héroe mítico de Atenas.",
      festivalDesc: "Fiesta del héroe, con banquetes, entrega de comida a los pobres y competiciones atléticas y militares.",
      category: "Cívico y Patriótico",
      aition: "En el 475 a.C., el general Cimón conquistó Esciros y encontró un esqueleto gigante con espada que creyeron ser Teseo. Se celebra comiendo 'athara' (papilla de leche) en honor al héroe."
    };
    // THESMOPHORIA (previously reviewed — not changed)
    if (dayOfMonth === 11) return { festivalName: "Thesmophoria", festivalDayName: "Ánodos (El Camino Arriba)", deity: "Deméter y Perséfone", deityDesc: "Diosas de la fertilidad y el mundo subterráneo.", festivalDesc: "Procesión de mujeres ciudadanas que ascienden al recinto junto al Pnyx y establecen su campamento ritual, abandonando sus hogares durante los tres días del festival.", category: "Agrario y Fertilidad", participants: "Mujeres casadas ciudadanas exclusivamente", aition: "El nombre ánodos ('camino hacia arriba') evoca el retorno de Perséfone desde el inframundo. Las mujeres suben al mismo tiempo del año en que la diosa asciende, imitando el movimiento de la tierra que vuelve a la vida. El rito llegó a Grecia traído por las hijas de Dánao desde Egipto, según Heródoto (2.171.1–3), quien afirmó no poder revelar sus misterios." };
    if (dayOfMonth === 12) return { festivalName: "Thesmophoria", festivalDayName: "Nesteia (El Ayuno)", deity: "Deméter y Perséfone", deityDesc: "Diosas de la fertilidad.", festivalDesc: "Día de luto y ayuno total: las mujeres no comen, se sientan en el suelo imitando a Deméter en su duelo, e intercambian insultos rituales (aischrologia). Los ritos eran secretos; Heródoto (2.171) afirmó conocerlos pero se negó a revelarlos.", category: "Purificación y Expiación", participants: "Mujeres casadas", isApaphrades: true, aition: "Las mujeres ayunan y se gritan obscenidades (aischrologia) porque la sirvienta Iambe logró arrancar la primera sonrisa a Deméter en su duelo contándole chistes groseros. El ayuno replica el de la diosa durante los nueve días que buscó a Perséfone sin comer ni beber (Himno Homérico a Deméter)." };
    if (dayOfMonth === 13) return { festivalName: "Thesmophoria", festivalDayName: "Kalligeneia (Día de la Hermosa Descendencia)", deity: "Deméter", deityDesc: "Diosa de la fertilidad y la maternidad.", festivalDesc: "Banquete festivo tras el ayuno. Las Antletriai (portadoras) descienden a las fosas sagradas subterráneas (mégara) para recuperar los restos de los lechones arrojados en las Skira de Skirophorion, y mezclan el humus fértil con las semillas de la siembra de otoño. Las mujeres celebran la maternidad y oran por una buena descendencia.", category: "Agrario y Fertilidad", participants: "Mujeres casadas", ritualOffering: { item: "Restos de lechones extraídos de las mégara (fosas), mezclados con semillas de trigo para la siembra de otoño", icon: "🐖" }, aition: "Kalligeneia significa 'hermosa descendencia'. La emergencia de Perséfone desde la tierra es la imagen central del día: así como ella asciende de las profundidades, las mujeres extraen el humus de las fosas. El contacto de los restos ctónicos con las semillas era magia simpática para fertilizar la cosecha (Stehle, en Parca–Tzanetou 2007, p. 169). También se cita en las fuentes un misterioso rito llamado 'Persecución Calcídica' (Chalcidicon Diogma): el mito explicaba que unas mujeres rezaron con tal furia que el ejército enemigo huyó hasta Calcis; Parke considera probable que este mito sea una invención tardía para explicar un nombre ya ininteligible (Parke, Festivals of the Athenians, p. 87)." };
    // Apaturia: no ancient source fixes the specific days 19/20/21 within Pyanepsion.
    // Different phratriai chose different dates. These are conventional placeholders only.
    if (dayOfMonth === 19) return {
      festivalName: "Apaturia",
      festivalDayName: "Dorpia (El Banquete)",
      deity: "Zeus Phratrios y Atenea Phratria",
      deityDesc: "Dioses protectores de las fratrías.",
      festivalDesc: "Primer día de las Apaturias (fecha convencional; cada fratría elegía sus propias fechas dentro del mes). Los miembros de cada fratría se reunían al anochecer para un banquete comunal.",
      category: "Familiar y Social",
      participants: "Miembros de las Fratrías (clanes)",
      aition: "El nombre se asocia al 'engaño' (apate): Melanto venció al rey beocio Janto cuando Dioniso apareció con una piel de cabra negra, distrayéndolo para el golpe mortal."
    };
    if (dayOfMonth === 20) return {
      festivalName: "Apaturia",
      festivalDayName: "Anarrhysis (El Sacrificio)",
      // Both Parke and Deubner: Anarrhysis sacrifice is to Zeus Phratrios and Athena Phratria.
      deity: "Zeus Phratrios y Atenea Phratria",
      deityDesc: "Protectores de las fratrías.",
      festivalDesc: "Segundo día (fecha convencional). Gran sacrificio comunitario de la fratría. Los niños recitaban poemas.",
      category: "Familiar y Social",
      agonDesc: "Los niños recitaban poemas de memoria. El mejor recitador de cada fratría recibía un premio (Platón, Timeo 21b).",
      aition: "La Anarrhysis recuerda el sacrificio tras la victoria de Melanto sobre Janto. Las ofrendas se dirigen a Zeus Phratrios y Atenea Phratria como guardianes del vínculo de clan."
    };
    if (dayOfMonth === 21) return {
      festivalName: "Apaturia",
      festivalDayName: "Koureotis (El Corte de Pelo)",
      // Parke + Deubner: Athena Phratria also present; new brides also made offerings (gamelia).
      deity: "Zeus Phratrios y Atenea Phratria",
      deityDesc: "Zeus protector de los clanes y Atenea de la fratría.",
      festivalDesc: "Tercer día y culminación (fecha convencional). Los padres presentaban a sus hijos recién nacidos y los efebos ante la fratría. Las recién casadas también ofrendaban (gamelia).",
      category: "Familiar y Social",
      participants: "Padres, Recién nacidos, Efebos, Nuevas esposas",
      ritualOffering: { item: "Meion (ofrenda menor por recién nacidos) y Koureion (sacrificio mayor por efebos, con corte de pelo ritual)", icon: "✂️" },
      aition: "El mechón de pelo cortado al efebo se ofrendaba a los dioses como símbolo de su paso a la ciudadanía. Sin este registro en la fratría, un ateniense no podía heredar ni votar."
    };
  }

  // 4. MAIMAKTERION (Noviembre - Tormentas)
  if (monthIndex === 4) {
    // Day uncertain: neither Parke nor Deubner nor Mikalson assigns a day. Day 10 is conventional.
    if (dayOfMonth === 10) return {
      festivalName: "Maimakteria",
      deity: "Zeus Maimaktes",
      deityDesc: "Zeus el Tempestuoso, señor de las tormentas invernales.",
      // Ram sacrifice and nephálio characterisation removed — neither in Parke nor Deubner.
      // Parke says only: prayers to moderate storm violence; no ritual details preserved.
      festivalDesc: "Festival homónimo del mes (día aproximado; no se conserva la fecha exacta). Oraciones a Zeus para moderar la violencia de las tormentas invernales; ningún detalle ritual específico ha sobrevivido en las fuentes.",
      category: "Purificación y Expiación",
      aition: "El nombre Maimaktes significa 'el furioso'. Zeus recibía este epíteto porque el mes de noviembre traía las peores tormentas del Egeo, hundiendo barcos y arruinando cosechas tardías."
    };
    if (dayOfMonth === 20) return {
      festivalName: "Pompaia",
      deity: "Zeus Meilikhios",
      deityDesc: "Zeus el Apacible (en su aspecto ctónico).",
      festivalDesc: "Procesión purificatoria. Se paseaba el Dion Koidion (Vellón de Zeus) por la ciudad para absorber las impurezas acumuladas.",
      category: "Purificación y Expiación",
      // Fleece origin corrected: Deubner explicitly states it came from a Zeus Meilichios sacrifice,
      // not from the Maimakteria ram. The caduceus (kērykeion) headed the procession.
      ritualOffering: { item: "Dion Koidion (vellón sagrado de un sacrificio a Zeus Meilichios, usado como amuleto purificador)", icon: "🧶" },
      aition: "El vellón procedía de un sacrificio a Zeus Meilichios. Quien lo pisara quedaba purificado. El caduceo (kērykeion) encabezaba la procesión; al final los elementos purificadores se arrojaban en un cruce de caminos."
    };
  }

  // 5. POSEIDEON (Diciembre - Invierno)
  if (monthIndex === 5) {
    // Posidea: tentatively day 8 (Poseidon's monthly day); ritual content almost entirely unknown.
    if (dayOfMonth === 8) return {
      festivalName: "Posidea",
      deity: "Poseidón",
      deityDesc: "Dios del mar y los terremotos.",
      festivalDesc: "Festival estatal del mes dedicado a Poseidón (día tentativo; apenas documentado). Ningún ritual específico se ha conservado en las fuentes.",
      category: "Cívico y Patriótico"
    };
    // Rural Dionysia: no fixed date. Parke: "not tied to a single date"; Mikalson: UNCERTAIN.
    // Day 19 is a conventional placeholder; each deme chose its own date.
    if (dayOfMonth === 19) return {
      festivalName: "Dionisias Rurales",
      deity: "Dionisio",
      deityDesc: "Dios del vino y la fertilidad.",
      festivalDesc: "Celebración local de invierno en los demes del Ática con procesiones fálicas (fecha variable; cada demo elegía su propia fecha en la segunda mitad del mes).",
      category: "Dramático y Dionisíaco",
      agonDesc: "Se jugaba al 'Askoliasmos': los jóvenes competían intentando saltar y mantenerse a la pata coja sobre odres de piel de cabra inflados y engrasados con vino."
      // Aition removed — neither Parke nor Deubner records any aition for the Rural Dionysia.
    };
    if (dayOfMonth === 26) return {
      festivalName: "Haloa",
      // Parke + Deubner: primary deities are Demeter + Kore. Dionysus secondary/probable.
      deity: "Deméter y Perséfone",
      deityDesc: "Diosas de la tierra y el ciclo agrario. Dioniso participaba con papel secundario.",
      // "símbolos fálicos" corrected: Parke says both male AND female genital models were carried.
      festivalDesc: "Fiesta de fertilidad en Eleusis. Banquete nocturno exclusivo para mujeres con abundancia de vino. Se portaban símbolos de órganos masculinos y femeninos para estimular la fertilidad de los campos.",
      category: "Agrario y Fertilidad",
      participants: "Mujeres, Sacerdotisas, Cortesanas",
      ritualOffering: { item: "Pasteles con formas de órganos masculinos y femeninos, abundancia de vino e incienso (sin sangre)", icon: "🥖" },
      pannychisDesc: "Banquete nocturno invernal a puerta cerrada, exclusivo para mujeres, con comida, vino y bromas obscenas para la fertilidad.",
      // "susurran a las mujeres que busquen amantes" removed — Parke explicitly says the content
      // of the priestesses' whispering is not recorded in any ancient source.
      aition: "Se portaban símbolos de fertilidad masculina y femenina como magia empática para las semillas recién sembradas. Ciertos alimentos estaban prohibidos: granadas, manzanas, huevos, aves domésticas y determinados peces."
    };
  }

  // 6. GAMELION (Mes de las Bodas)
  if (monthIndex === 6) {
    if (dayOfMonth === 12) return {
      festivalName: "Lenaia",
      deity: "Dionisio Lenaios",
      deityDesc: "Dios del vino y el teatro.",
      // "comedia" corrected: both Parke and Deubner attest tragic AND comic competitions equally.
      festivalDesc: "Festival dramático de invierno en el recinto del Lenaion. Competiciones de comedia y tragedia, en una celebración más íntima que las Grandes Dionisias, reservada a ciudadanos atenienses (sin metoikoi ni extranjeros).",
      category: "Dramático y Dionisíaco",
      participants: "Ciudadanos atenienses (sin extranjeros)"
      // Aition removed — neither Parke nor Deubner records any aition for the Lenaia.
    };
    // Day 27 per Erkhia sacrificial calendar (IG II² 1358), accepted by Mikalson (1975).
    // Parke: day 26; Deubner: ca. day 24.
    if (dayOfMonth === 27) return {
      festivalName: "Theogamia (Hieros Gamos)",
      deity: "Zeus y Hera",
      deityDesc: "Reyes del Olimpo, protectores del matrimonio.",
      festivalDesc: "Celebración del matrimonio sagrado de los dioses, coincidiendo con la temporada popular de bodas en Atenas. Se sacrificaba un lechón a Zeus Hēraios en la Acrópolis (IG I² 840.20).",
      category: "Familiar y Social",
      // Fertility-sparks aition removed — Parke: "no details of the festival are preserved."
      aition: "Se conmemora la unión sagrada de Zeus y Hera. Ningún otro detalle del ritual ha sobrevivido en las fuentes (Parke)."
    };
  }

  // 7. ANTHESTERION (Finales de Invierno / Flores)
  if (monthIndex === 7) {
    if (dayOfMonth === 11) return {
      festivalName: "Anthesteria",
      festivalDayName: "Pithoigia (Apertura de Jarras)",
      deity: "Dionisio",
      deityDesc: "Dios del vino.",
      festivalDesc: "Se abrían las jarras del nuevo vino y se llevaban muestras al santuario en las Marismas.",
      category: "Dramático y Dionisíaco",
      participants: "Ciudadanos y Esclavos",
      // "aterrados" and demonic-fermentation framing removed — Parke describes a standard
      // precautionary libation, not an apotropaic rite against demonic spirits.
      aition: "Los atenienses hacían una libación precautoria rogando que el nuevo vino fuera inofensivo y beneficioso: una precaución ritual estándar, no un conjuro contra espíritus."
    };
    if (dayOfMonth === 12) return {
      festivalName: "Anthesteria",
      festivalDayName: "Choes (Las Jarras)",
      deity: "Dionisio",
      deityDesc: "Dios del vino.",
      // Added: ship-chariot procession and children's choes (Deubner).
      festivalDesc: "Concurso de bebida en silencio. Matrimonio sagrado de la Basilinna con Dionisio. Procesión del dios en un barco sobre ruedas. Los niños de tres años recibían coronas de flores y jarras en miniatura (choes).",
      category: "Dramático y Dionisíaco",
      participants: "Basilinna, Gerarai",
      agonDesc: "Concurso de bebida: al sonido de la trompeta, los ciudadanos competían para ver quién vaciaba primero su jarra (chous) de casi 3 litros en absoluto silencio.",
      economyDesc: "El Rey (Archon Basileus) otorgaba al ganador del concurso un odre lleno de vino o un pastel especial como trofeo.",
      aition: "Se bebe en silencio y en jarras individuales porque el rey inventó este concurso para que el asesino Orestes pudiera beber sin compartir copa ni hablar con nadie, evitando contagiar su maldición a los demás."
    };
    if (dayOfMonth === 13) return {
      festivalName: "Anthesteria",
      festivalDayName: "Chytrai (Las Ollas)",
      deity: "Hermes Ctónico",
      deityDesc: "Guía de los muertos.",
      // Added Hydrophoria (attested by Parke + Deubner). Erigone reference removed — Parke
      // explicitly labels the Erigone-Chytroi connection "at least doubtful."
      festivalDesc: "Día aciago. Se cocían vegetales en ollas para los fantasmas que vagaban por la ciudad. Hidroforia: el estado vertía agua y mezcla de trigo y miel en la grieta del Olimpeion — la abertura que según el mito se tragó las aguas del Gran Diluvio de Deucalión.",
      category: "Mistérico y Ctónico",
      isApaphrades: true,
      ritualOffering: { item: "Chytrai (Ollas de barro con vegetales hervidos ofrecidos a Hermes y a los fantasmas)", icon: "🥘" },
      aition: "Se cocina una olla de vegetales que nadie prueba: representa el pánico de los supervivientes del Gran Diluvio que cocinaron pero huyeron antes de comer. Los fantasmas de los muertos (Keres) vagan por la ciudad este día."
    };
    if (dayOfMonth === 23) return {
      festivalName: "Diasia",
      deity: "Zeus Meilichios",
      // deityDesc corrected: Meilichios = "honey-sweet / open to appease", not "subterráneo".
      deityDesc: "Zeus 'el Apacible' o 'el que se deja propiciar' (de μείλιχος); culto con rasgos ctónicos.",
      // Added: celebrated outside the city near the Ilissos.
      festivalDesc: "El mayor festival de Zeus. Holocausto de víctimas o pasteles con forma de animal para apaciguar al dios. Se celebraba fuera de la ciudad, junto al Iliso (Tucídides 1.126).",
      category: "Purificación y Expiación",
      participants: "Toda la población",
      ritualOffering: { item: "Víctimas animales o, para los más pobres, pasteles horneados con forma de ovejas o cerdos", icon: "🥐" },
      // Cylon-penance aition removed — Parke: Diasia predates the Cylon affair; no aition recorded.
      aition: "Tucídides (1.126) lo llama el mayor festival de Zeus Meilichios. Sus orígenes son anteriores a la historia escrita: una ofrenda antiquísima de propiciación sin mito fundacional preservado."
    };
  }

  // 8. ELAPHEBOLION (Primavera)
  if (monthIndex === 8) {
    if (dayOfMonth === 6) return {
      festivalName: "Elaphebolia",
      deity: "Artemisa Elaphebolos",
      deityDesc: "Cazadora de ciervos.",
      festivalDesc: "Se ofrecían pasteles con forma de ciervos (elaphoi) hechos de masa, miel y sésamo.",
      category: "Agrario y Fertilidad",
      ritualOffering: { item: "Elaphoi (Pasteles con forma de ciervo hechos de masa, miel y sésamo)", icon: "🦌" },
      // Invented "deer accepted magically" aition removed — Parke gives only a practical explanation.
      aition: "En el siglo IV los ciervos reales eran prácticamente inobteniables; se usaban sustitutos de pastelería, como hacían las familias con menos recursos en otros festivales (p. ej. la Diasia). No se conserva ningún mito fundacional."
    };
    if (dayOfMonth === 8) return {
      festivalName: "Asclepieia",
      deity: "Asclepio",
      deityDesc: "Dios de la curación.",
      // "Conmemora la llegada del dios a Atenas" corrected: the arrival (Epidauria) is Boedromion 18.
      // The Mysteries-latecomer aition was misassigned here — it belongs to Boedromion 18.
      festivalDesc: "Festival de Asclepio en su santuario contiguo al teatro de Dioniso. Sacrificio y probable banquete sagrado. El culto llegó a Atenas en 420/19 a.C.; el santuario fue posiblemente organizado por Sófocles (Parke).",
      category: "Purificación y Expiación"
    };
    if (dayOfMonth === 9) return {
      festivalName: "Proagon",
      deity: "Dionisio",
      deityDesc: "Dios del Teatro.",
      festivalDesc: "Ceremonia preliminar a las Dionisias. Los dramaturgos y actores se presentaban sin máscaras ante el público.",
      category: "Dramático y Dionisíaco",
      // Theological "mortal citizens" aition removed — Parke gives only a practical explanation.
      aition: "El Proagon era la única forma de publicidad disponible: sin carteles ni programas, el público necesitaba saber de antemano qué obras y autores competirían (Parke)."
    };
    if (dayOfMonth >= 10 && dayOfMonth <= 13) return {
      festivalName: "Dionisias Urbanas (Grandes Dionisias)",
      deity: "Dionisio Eleuthereus",
      deityDesc: "Dios del teatro y el éxtasis.",
      // "montados en carros" removed — phallos-carts are a Rural Dionysia feature (Aristophanes,
      // Acharnians). At the City Dionysia phalli were carried in procession, not on carts.
      festivalDesc: "El evento teatral supremo del mundo antiguo. Tragedias, comedias, procesión con falos portados a hombros y ostentación del imperio ateniense ante visitantes extranjeros.",
      category: "Dramático y Dionisíaco",
      participants: "Atenienses, Extranjeros, Coregos, Huérfanos de guerra",
      agonDesc: "El Agón teatral supremo del mundo antiguo. Producción de tragedias y comedias evaluadas por 10 jueces elegidos por estricto sorteo para evitar sobornos.",
      economyDesc: "La entrada costaba 2 óbolos, pagados a los ciudadanos pobres por el Estado (Fondo Teórico). Los ciudadanos ricos financiaban las obras como un impuesto de honor (Choregia). En el teatro se exhibía el tributo en talentos de plata del imperio.",
      aition: "Se desfila con falos porque, cuando los atenienses despreciaron la estatua de Dioniso, el dios los castigó con una plaga genital. El Oráculo dijo que la única cura era adorar al dios paseando falos por la ciudad."
    };
    // Day 17 per Mikalson (1975), deduced from Photios + City Dionysia ending on day 16.
    // Neither Parke nor Deubner gives day 14.
    if (dayOfMonth === 17) return {
      festivalName: "Pandia",
      deity: "Zeus",
      deityDesc: "Dios supremo.",
      festivalDesc: "Festival de clausura inmediatamente tras las Dionisias (ca. día 17). Posiblemente vinculado a la antigua tribu de Pandion.",
      category: "Cívico y Patriótico"
      // "psychological brake" aition removed — both sources agree nothing is known about Pandia's content.
    };
  }

  // 9. MUNICHION
  if (monthIndex === 9) {
    if (dayOfMonth === 6) return {
      festivalName: "Delphinia",
      deity: "Artemisa / Apolo",
      deityDesc: "Dioses purificadores.",
      festivalDesc: "Procesión de doncellas llevando ramas de olivo (hiketeria) atadas con lana blanca al santuario Delphinion.",
      category: "Purificación y Expiación",
      participants: "Doncellas atenienses",
      aition: "Las muchachas llevan ramas de olivo con lana blanca porque Teseo hizo esa misma ofrenda de súplica antes de embarcar hacia Creta. Parke considera este vínculo teseico una racionalización secundaria del rito original (una supplicación femenina comunitaria a Artemisa)."
    };
    if (dayOfMonth === 16) return {
      festivalName: "Munichia",
      deity: "Artemisa",
      deityDesc: "Señora de las bestias y la luna.",
      // "y Brauronia" removed — Brauronia is an entirely separate festival at Brauron (Parke + Deubner).
      // "Las niñas actúan como osas" removed — belongs to the Arkteia/Brauronia, not the Munichia.
      // Added: Epheboi regatta around the promontory (both sources).
      festivalDesc: "Se ofrecían pasteles iluminados con velas (amphiphontes) para la diosa de la luna. Los Epheboi realizaban una regata alrededor del promontorio de Munichia.",
      category: "Agrario y Fertilidad",
      aition: "Se sacrifica una cabra vestida de mujer porque el hombre Émbaros engañó a la diosa vistiendo al animal con el traje de su hija para salvarla del sacrificio (Parke)."
    };
    if (dayOfMonth === 19) return {
      festivalName: "Olympieia",
      deity: "Zeus Olímpico",
      deityDesc: "Dios supremo.",
      festivalDesc: "Festival espectacular de la caballería ateniense en honor al inmenso templo de Zeus en el Ilisos.",
      category: "Cívico y Patriótico",
      participants: "Caballería Ateniense",
      agonDesc: "Competición militar conocida como 'Anthippasia': las tribus realizaban elaborados simulacros de cargas de caballería enfrentándose unas a otras en el Hipódromo.",
      // Phocion anecdote removed as founding aition — it was a historical incident (318 BC),
      // not the founding tradition. Peisistratos is the attested founder.
      aition: "El festival fue probablemente instituido por Pisístrato al poner los cimientos del gran templo jónico de Zeus junto al Iliso (completado por Adriano siglos después). El anécdota de Focón (318 a.C.) — ejecutado durante la celebración — es un hecho histórico, no el mito fundacional."
    };
  }

  // 10. THARGELION
  if (monthIndex === 10) {
    if (dayOfMonth === 6) return {
      festivalName: "Thargelia (Día 1)",
      deity: "Apolo",
      deityDesc: "Dios purificador.",
      // isApaphrades removed: day 6 is not a dies nefastus in Parke or Deubner. Only day 25 (Plynteria) carries that status in Thargelion.
      // Added fig-branches alongside squill: both Parke and Deubner specify both implements.
      festivalDesc: "Purificación violenta de la ciudad mediante dos chivos expiatorios humanos (Pharmakoi), golpeados con ramas de higuera y cebollas silvestres (escila) y expulsados.",
      category: "Purificación y Expiación",
      // Magical-disinfectant aition removed — not in Parke or Deubner.
      aition: "Dos pharmakoi (uno 'para los hombres' con collar de higos negros, otro 'para las mujeres' con higos blancos) eran golpeados y conducidos fuera de la ciudad. El día 6 era el día de purificación; el día 7 el de la ofrenda del thargelos."
    };
    if (dayOfMonth === 7) return {
      festivalName: "Thargelia (Día 2)",
      deity: "Apolo",
      deityDesc: "Dios protector de la cultura y cosechas.",
      // "coros masculinos" corrected: competition included men's AND boys' choirs.
      festivalDesc: "Ofrenda de una olla con el primer grano (Thargelos). Gran competición de coros de hombres y niños de las tribus.",
      category: "Cívico y Patriótico",
      agonDesc: "Concurso musical entre las diez tribus, que presentaban coros de 50 hombres y 50 niños cantando himnos a Apolo.",
      economyDesc: "El 'Choregos' victorioso (el rico financiador del coro) ganaba el derecho a dedicar un trípode de bronce en el templo de Apolo (el Pythion)."
    };
    if (dayOfMonth === 19) return {
      festivalName: "Bendidia",
      deity: "Bendis (Artemisa Tracia)",
      deityDesc: "Diosa extranjera de la caza.",
      // Added: dual procession structure (Athenian + Thracian simultaneously) — attested by both sources.
      festivalDesc: "Carrera de antorchas a caballo de noche en el Pireo. Doble procesión simultánea: una oficial ateniense desde el Pritaneo, otra de la comunidad tracia del Pireo.",
      category: "Cívico y Patriótico",
      participants: "Tracios residentes y Atenienses",
      pannychisDesc: "Vigilia nocturna (Pannychis) con carrera de antorchas a caballo en el Pireo.",
      // Grain-import aition removed — not in Parke or Deubner. Oracle of Dodona (not Delphi) added.
      aition: "El culto fue fundado en 429 a.C. con aprobación del oráculo de Dodona (no Delfos). Los metoikoi tracios del Pireo recibieron el derecho a adquirir terreno y fundar el santuario (Parke, Deubner). La asimilación con Artemisa fue posterior."
    };
    if (dayOfMonth === 25) return {
      festivalName: "Plynteria",
      deity: "Atenea Polias",
      deityDesc: "Diosa protectora.",
      // Scope corrected: ALL sanctuaries were roped off, not only Athena's temple (Parke + Deubner).
      // Added: the two Loutrides who performed the washing, and the Peplotheke.
      festivalDesc: "Día nefasto. La estatua de la diosa era despojada, todos los santuarios de Atenas cerrados con cuerdas, y la estatua procesionada (cubierta, sin mostrarse al público) hasta el mar de Falero para su lavado. Las Loutrides (Plyntrides) realizaban el lavado; la Peplotheke limpiaba el peplos.",
      category: "Purificación y Expiación",
      participants: "Praxiergidai, Epheboi, Loutrides",
      isApaphrades: true,
      aition: "En la procesión se llevan pastelitos de higo. El mito asegura que los higos fueron la primera comida civilizada cultivada por la humanidad, y se le ofrecen a Atenea como 'picnic' para su día de baño en el mar."
    };
  }

  // 11. SKIROPHORION (Mes antes de la cosecha)
  if (monthIndex === 11) {
    // Day 3: Mikalson (1975) — "evidence suggests strongly day 3 but not conclusive" (PROBABLE).
    if (dayOfMonth === 3) return {
      festivalName: "Arrephoria",
      deity: "Atenea Polias",
      deityDesc: "Diosa de la ciudad.",
      festivalDesc: "Dos niñas bajan por un pasadizo secreto de la Acrópolis llevando paquetes misteriosos (día probable según el calendario de Erquia; no confirmado con plena certeza).",
      category: "Mistérico y Ctónico",
      // Aition corrected: Pausanias (1.27.3) says only that the girls carried unknown objects.
      // The Kekrops-daughters/Erichthonius myth is a late aetiological gloss — the girls did not
      // open any box; that belongs to a different myth (Pandrossos, Herse, Aglauros).
      aition: "Pausanias (1.27.3) registra solo que las Arrephoren llevaban objetos cubiertos sin saber qué contenían, y regresaban con otros igualmente ocultos. La conexión con las hijas de Cécrope abriendo la cesta de Erictonio es una glosa aetiológica tardía; el significado del rito es desconocido."
    };
    if (dayOfMonth === 12) return {
      festivalName: "Skira (Skiroforia)",
      deity: "Atenea / Deméter y Perséfone",
      deityDesc: "Dioses de la ciudad y del ciclo ctónico de la tierra.",
      festivalDesc: "Procesión bajo un enorme toldo blanco (Skiron) desde la Acrópolis hasta el santuario de Skiron. Las mujeres arrojan lechones vivos a las fosas sagradas subterráneas (mégara), donde permanecerán varios meses. Sus restos serán recuperados en la Kalligeneia de las Tesmoforias y mezclados con las semillas de la siembra de otoño.",
      category: "Agrario y Fertilidad",
      participants: "Sacerdotisas, Eteobutadai, Mujeres",
      aition: "Se arrojan lechones a las fosas porque, cuando Hades raptó a Perséfone, los cerdos del porquero Eubuleo cayeron también al abismo junto con la diosa. Lo que desciende con la kore volverá transformado con ella: los restos ctónicos fertilizarán el grano en otoño. El enorme parasol blanco (Skiron) rememora la ofrenda de arcilla blanca (skiros) que Teseo consagró a Atenea."
    };
    if (dayOfMonth === 14) return {
      festivalName: "Dipolieia (Bouphonia)",
      deity: "Zeus Polieus",
      deityDesc: "Protector de la ciudad.",
      festivalDesc: "Extraño rito antiguo donde se mataba a un buey de trabajo y luego el hacha ejecutora era llevada a juicio por 'asesinato'.",
      category: "Purificación y Expiación",
      participants: "Sacerdotes Bouphonia",
      aition: "El sacerdote huye y se juzga al hacha porque el primer hombre que sacrificó un buey (Sopatro) huyó aterrado por la culpa. Al no poder castigar al hombre, se juzgó al arma."
    };
    // Day 30: modest state sacrifice to Zeus Soter alone (Lysias 26.6; Parke; Deubner).
    // Pan has no attested connection to day 30; the large Piraeus Diisoteria falls earlier in the month.
    if (dayOfMonth === 30) return {
      festivalName: "Eisiteria (Cierre de año)",
      deity: "Zeus Soter",
      deityDesc: "Zeus Salvador, protector de la ciudad.",
      festivalDesc: "Sacrificio oficial de fin de año a Zeus Soter en la Stoa de Zeus del Ágora. Lo realizaba el Rey Arconte y el Consejo saliente en nombre del estado. Celebración modesta e institucional que cerraba el año cívico.",
      category: "Cívico y Patriótico",
      participants: "Rey Arconte, Consejo saliente",
      // Pan and torch-race removed: Parke places Pan's torch-race tentatively in Boedromion.
      // "Great closing festival" description removed — the day-30 event was a small official rite.
      aition: "La primera referencia es Lisias (382 a.C., Lisias 26.6). No se conserva ningún mito fundacional."
    };
  }

  return null;
};

// Default deity for days without specific festival
export const getDefaultAtticDeity = (monthIndex: number): AtticFestivalInfo => {
  const monthDeities: Record<number, AtticFestivalInfo> = {
    0: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la protectora de la ciudad.", deity: "Ἀθηνᾶ", deityDesc: "Protectora de Atenas, diosa de la sabiduría." },
    1: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios de la luz.", deity: "Ἀπόλλων", deityDesc: "Dios de la luz, la música y la profecía." },
    2: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la cosecha.", deity: "Δημήτηρ", deityDesc: "Diosa de la cosecha y la tierra cultivada." },
    3: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios de la verdad.", deity: "Ἀπόλλων", deityDesc: "Dios de la verdad y la curación." },
    4: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al rey de los dioses.", deity: "Ζεύς", deityDesc: "Padre de los dioses, señor del Olimpo." },
    5: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios del mar.", deity: "Ποσειδῶν", deityDesc: "Dios de los mares y las aguas." },
    6: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la reina de los dioses.", deity: "Ἥρα", deityDesc: "Reina de los dioses, protectora del matrimonio." },
    7: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios del vino.", deity: "Διόνυσος", deityDesc: "Dios del vino, el éxtasis y el teatro." },
    8: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la caza.", deity: "Ἄρτεμις", deityDesc: "Diosa de la caza y los bosques." },
    9: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la luna.", deity: "Ἄρτεμις", deityDesc: "Diosa de la luna y la naturaleza salvaje." },
    10: { festivalName: "Día Sagrado", festivalDesc: "Dedicado al dios sol.", deity: "Ἀπόλλων", deityDesc: "Dios sol, protector de las artes." },
    11: { festivalName: "Día Sagrado", festivalDesc: "Dedicado a la diosa de la estrategia.", deity: "Ἀθηνᾶ", deityDesc: "Diosa de la estrategia y las artes." },
  };
  return monthDeities[monthIndex] || { festivalName: "Día Sagrado", festivalDesc: "Dedicado al padre de los dioses.", deity: "Ζεύς", deityDesc: "Padre de los dioses." };
};

// Daily deities for specific days of the month (excluding festivals)
export const getDailyAtticDeity = (dayOfMonth: number, monthLength: number): AtticFestivalInfo | null => {
  // Last day of month (29th or 30th)
  if (dayOfMonth === monthLength) {
    return {
      festivalName: "Nekysia",
      festivalDesc: "Día de purificación del hogar y ofrendas a los difuntos.",
      deity: "Ἑκάτη καὶ Νεκύσια",
      deityDesc: "Hécate (Hekateia/Deipna) y los ancestros fallecidos (Nekysia).",
    };
  }

  const dailyDeities: Record<number, AtticFestivalInfo> = {
    1: {
      festivalName: "Noumenia (Luna Nueva)",
      festivalDesc: "El día más afortunado del mes. Consagrado a los Dioses del Hogar.",
      deity: "Ἀπόλλων Ἀγυιεύς καὶ Ζεὺς Κτήσιος",
      deityDesc: "Día de los Dioses del Hogar. La Luna Nueva bendice el umbral de la casa y purifica los nuevos comienzos bajo la protección de Apolo y Zeus.",
    },
    2: {
      festivalName: "Agathos Daimon",
      festivalDesc: "Día del 'Buen Espíritu' que protege a la familia.",
      deity: "Ἀγαθὸς Δαίμων",
      deityDesc: "Día del Buen Espíritu. Se honra al protector invisible que habita en el hogar, brindando suerte y abundancia a través de la libación sagrada de vino puro.",
    },
    3: {
      festivalName: "Tritogeneia",
      festivalDesc: "Cumpleaños de Atenea, protectora de la sabiduría.",
      deity: "Ἀθηνᾶ Τριτογένεια",
      deityDesc: "Aniversario mensual del nacimiento de Atenea. Una jornada para la sabiduría, la estrategia y el ingenio de la Diosa que guía el destino de la ciudad.",
    },
    4: {
      festivalName: "Tetras Hierai",
      festivalDesc: "Día de la fuerza, elocuencia y amor.",
      deity: "Ἡρακλῆς, Ἑρμῆς, Ἀφροδίτη καὶ Ἔρως",
      deityDesc: "Día sagrado compartido por Heracles, Hermes, Afrodita y Eros. Una jornada poderosa para la fuerza, los viajes y el afecto.",
    },
    5: {
      festivalName: "Pempte Hierai",
      festivalDesc: "Día dedicado a Atenea y la justicia.",
      deity: "Ἀθηνᾶ",
      deityDesc: "Día sagrado de Atenea. Una jornada para honrar la justicia, la laboriosidad y la protección divina sobre el hogar y la ciudad.",
    },
    6: {
      festivalName: "Artemisia",
      festivalDesc: "Cumpleaños de Artemisa. Sacrificios en su honor.",
      deity: "Ἄρτεμις",
      deityDesc: "Aniversario mensual del nacimiento de Artemisa. Día para la pureza y los misterios de la naturaleza salvaje; se ofrecen sacrificios a la Señora de las Bestias.",
    },
    7: {
      festivalName: "Hebdome",
      festivalDesc: "Cumpleaños de Apolo. Día sagrado universal.",
      deity: "Ἀπόλλων",
      deityDesc: "Aniversario mensual de Apolo. El día más luminoso del mes, consagrado a la armonía, la profecía y las artes de Febo. Un día sagrado en toda la Hélade.",
    },
    8: {
      festivalName: "Ogdoe",
      festivalDesc: "Día de Poseidón y Teseo.",
      deity: "Ποσειδῶν καὶ Θησεύς",
      deityDesc: "Día del Mar y el Héroe. Consagrado al soberano de las aguas, Poseidón, y al mítico unificador de Ática, Teseo, celebrando la fuerza y el valor.",
    },
    9: {
      festivalName: "Enate",
      festivalDesc: "Día de Rea y las Musas.",
      deity: "Ῥέα καὶ Μοῦσαι",
      deityDesc: "Rea (Madre de los Dioses) y las Musas. Día de la maternidad cósmica y la inspiración de las artes.",
    },
    20: {
      festivalName: "Eikas",
      festivalDesc: "Día de Apolo Eikadios.",
      deity: "Ἀπόλλων Εἰκάδιος καὶ Ἀθηνᾶ",
      deityDesc: "Apolo Eikadios (del vigésimo día) y Atenea. Un día de sabiduría divina y claridad.",
    },
  };

  return dailyDeities[dayOfMonth] || null;
};

// 1. Lógica dinámica para Días Nefastos (Apaphrades Hemerai)
export function checkApaphrades(monthIndex: number, dayOfMonth: number, festival: AtticFestivalInfo | null) {
    // Caso 1: Chytrai (Las Ollas) - Anthesterion 13 (Mes 7)
    if (monthIndex === 7 && dayOfMonth === 13) {
        return {
            isTaboo: true,
            reason: "Día de las Ollas (Chytrai). Los fantasmas de los muertos (Keres) y los duendes del inframundo han sido invocados y vagan libremente por las calles de Atenas buscando asilo.",
            instruction: "Unta las puertas de tu casa con brea negra y mastica hojas de espino cerval (buckthorn) sin tragar. Al anochecer, grita: '¡Fuera, Keres, las Antesterias han terminado!'",
            icon: "👻"
        };
    }

    // Caso 2: Plynteria (Día de los Lavados) - Thargelion 25 (Mes 10)
    if (monthIndex === 10 && dayOfMonth === 25) {
        return {
            isTaboo: true,
            reason: "Día de los Lavados (Plynteria). La estatua sagrada de Atenea ha sido desvestida y llevada al mar. La diosa está temporalmente ausente y la ciudad carece de escudo divino.",
            instruction: "Acordona los templos con cuerdas gruesas para evitar que la impureza entre. Está estrictamente prohibido realizar asambleas, juramentos o negocios importantes hoy.",
            icon: "🚧"
        };
    }

    // Caso 3: Genérico para cualquier otro festival marcado en la base de datos como Apaphrades
    if (festival?.isApaphrades) {
        return {
            isTaboo: true,
            reason: "El aire está denso con impureza ritual (Miasma) o energías del inframundo. Es un día de luto, sacrificio chthonico o misterios ocultos.",
            instruction: "Mantén un perfil bajo. Evita iniciar proyectos, viajes o pronunciar palabras jactanciosas. Lávate las manos con agua salada si participas en ritos.",
            icon: "🏺"
        };
    }

    return { isTaboo: false, reason: "", instruction: "", icon: "" };
}

// 2. Mapeo visual de categorías a Emojis
export const getCategoryBadge = (category?: string): string => {
  switch (category) {
    case 'Dramático y Dionisíaco': return '🎭 Teatro y Éxtasis';
    case 'Agrario y Fertilidad': return '🌾 Agrario y Fertilidad';
    case 'Mistérico y Ctónico': return '🏺 Mistérico y Ctónico';
    case 'Cívico y Patriótico': return '🏃 Cívico y Atlético';
    case 'Purificación y Expiación': return '🔥 Purificación (Miasma)';
    case 'Familiar y Social': return '🍷 Familiar y Social';
    default: return '🏛️ Religioso';
  }
};

// 3. Próximos festivales (Lógica para el popup)
export const getNextAtticFestivals = (monthIndex: number, dayOfMonth: number, limit: number = 3) => {
  const nextFestivals = [];
  let currentMonth = monthIndex;
  let currentDay = dayOfMonth + 1;

  for (let i = 1; i <= 90; i++) {
    if (currentDay > 30) {
      currentDay = 1;
      currentMonth = (currentMonth + 1) % 12;
    }
    const festival = getAtticFestivalInfo(currentMonth, currentDay);
    if (festival) {
      const last = nextFestivals[nextFestivals.length - 1];
      if (!last || last.name !== festival.festivalName) {
          nextFestivals.push({
            name: festival.festivalName,
            description: festival.festivalDesc,
            date: `Día ${currentDay} de ${ATTIC_MONTHS[currentMonth].latin}`,
            daysRemaining: i,
            fullFestival: festival // Pass the whole object
          });
      }
      if (nextFestivals.length >= limit) break;
    }
    currentDay++;
  }
  return nextFestivals;
};

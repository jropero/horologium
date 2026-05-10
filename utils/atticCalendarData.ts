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
    if (dayOfMonth === 12) return { festivalName: "Kronia", deity: "Kronos", deityDesc: "Antiguo dios de la cosecha.", festivalDesc: "Fiesta de la cosecha donde los esclavos cenaban junto a sus amos en un ambiente de total libertad.", category: "Familiar y Social", participants: "Ciudadanos y Esclavos", aition: "Este festival recuerda la mítica Edad de Oro de Crono, cuando no existían clases sociales ni trabajo. Los amos servían la cena a los esclavos, aunque Plutarco se quejaba de que los 'aullidos insoportables' de los siervos hacían que los amos huyeran tras el primer plato." };
    if (dayOfMonth === 16) return { festivalName: "Synoikia", deity: "Atenea", deityDesc: "Diosa de la ciudad.", festivalDesc: "Conmemora la unificación mítica de Ática por Teseo.", category: "Cívico y Patriótico", participants: "Fylobasileis (Reyes de las tribus)", aition: "Se celebra la unificación de los pueblos del Ática como una epopeya sagrada. El mito asegura que Teseo viajó pueblo por pueblo convenciendo a los clanes para fundirse en la gran ciudad mágica de Atenas." };
    if (dayOfMonth === 28) return { festivalName: "Panathenaia", deity: "Atenea Polias", deityDesc: "Diosa protectora de la ciudad.", festivalDesc: "El mayor festival de Atenas. Gran procesión para entregar el nuevo Peplos a la diosa, acompañado de hecatombes de vacas y competiciones atléticas.", category: "Cívico y Patriótico", participants: "Toda la ciudad, Kanephoroi, Ergastinai, Epheboi, Metecos", pannychisDesc: "Vigilia nocturna con coros de doncellas y danzas. Se encendía el fuego del altar mediante una carrera de antorchas desde el altar de Eros.", agonDesc: "Certámenes atléticos y musicales. Destacan los 'Apobatai' (guerreros saltando de carros de 4 caballos en marcha) y la 'Evandria' (concurso tribal de tamaño, belleza y fuerza masculina).", economyDesc: "Los vencedores recibían las invaluables Ánforas Panatenaicas llenas de aceite de oliva de los olivos sagrados (Moriai) de la diosa.", aition: "Se teje un gigantesco vestido (peplo) a modo de vela de barco para Atenea, en el cual se borda la Batalla de los Dioses y los Gigantes. Esto conmemora la victoria épica de Atenea sobre el gigante Encélado (o Asterión) en los albores del tiempo." };
  }

  // 1. METAGEITNION (Finales de Verano) - Mes con menos festivales exactos, famoso por la fiesta de Heracles en Kynosarges.

  // 2. BOEDROMION (Principio de Otoño)
  if (monthIndex === 2) {
    if (dayOfMonth === 5) return { festivalName: "Genesia", deity: "Los Muertos", deityDesc: "Ancestros y caídos.", festivalDesc: "Día de recuerdo y luto público por los muertos, originalmente de los clanes aristocráticos.", category: "Mistérico y Ctónico", participants: "Familias atenienses", isApaphrades: true, aition: "Solón impuso este mito social: los caídos ya no pertenecían a sus familias, sino que la diosa Tierra (Ge) absorbía su sangre para convertirla en el cimiento invencible que unificaba a toda Atenas." };
    if (dayOfMonth === 6) return { festivalName: "Festival de Artemisa Agrotera", deity: "Artemisa", deityDesc: "Cazadora y protectora en batalla.", festivalDesc: "Conmemoración de la victoria de Maratón. Se sacrificaban 500 cabras anuales en cumplimiento de un voto.", category: "Cívico y Patriótico", participants: "Polemarchos, Epheboi", aition: "Se sacrifican 500 cabras anuales porque, antes de Maratón, se prometió una cabra por cada persa muerto. Al morir más de 6.400 enemigos, la deuda era tan grande que extinguiría las cabras del Ática, así que se renegoció pagar 'a plazos' 500 al año." };
    if (dayOfMonth === 7) return { festivalName: "Boedromia", deity: "Apolo Boedromios", deityDesc: "El que acude en ayuda al grito de guerra.", festivalDesc: "Acción de gracias militar marcando el fin de la temporada de campañas.", category: "Cívico y Patriótico", participants: "Ciudadanos y Militares", aition: "El nombre significa 'correr a ayudar al oír un grito'. El mito cuenta que, cuando los ejércitos de Eleusis iban a masacrar Atenas, el héroe Ión escuchó el clamor desesperado y bajó a la carga para salvarlos." };
    
    // MISTERIOS ELEUSINOS
    const eleusisBase = { festivalName: "Misterios Eleusinos Mayores", deity: "Deméter y Perséfone", deityDesc: "Diosas del grano y del inframundo.", category: "Mistérico y Ctónico" as const, participants: "Mystai (Iniciados), Hierofante, Daiduchos" };
    if (dayOfMonth === 15) return { ...eleusisBase, festivalDayName: "Agyrmos (La Reunión)", festivalDesc: "Proclamación oficial invitando a los candidatos puros a la iniciación.", aition: "El heraldo ruge advirtiendo a bárbaros y asesinos que se alejen. Este rito revive el terror neolítico a la impureza (miasma): un solo asesino oculto contaminaría la mirada de las Diosas y provocaría una plaga." };
    if (dayOfMonth === 16) return { ...eleusisBase, festivalDayName: "Halade Mystai (¡Al mar, iniciados!)", festivalDesc: "Los iniciados marchan a Falero para purificarse bañándose en el mar salado junto con un lechón.", aition: "Cada iniciado debe bañar un cerdito en el mar y luego degollarlo. Creían que el agua salada curaba el alma y que el pecado humano se transfería al cerdo, quien moría llevándose las culpas al inframundo." };
    if (dayOfMonth === 17) return { ...eleusisBase, festivalDayName: "Hither the Victims", festivalDesc: "Gran sacrificio oficial del estado a las Dos Diosas." };
    if (dayOfMonth === 18) return { ...eleusisBase, festivalDayName: "Epidauria", festivalDesc: "Llegada de Asclepio. Los rezagados se purifican y se rinde culto al dios de la medicina." };
    if (dayOfMonth === 19) return { ...eleusisBase, festivalDayName: "La Marcha a Eleusis", festivalDesc: "Gran procesión escoltando las 'Cosas Sagradas' de vuelta a Eleusis.", aition: "Gephyrismos (Los insultos del puente): Durante la marcha, los peregrinos cruzan un puente mientras los lugareños les gritan insultos y obscenidades. Esto imita a las ancianas que insultaron a Deméter, pero servía para espantar el 'mal de ojo' y la soberbia antes del rito." };
    if (dayOfMonth === 20) return { festivalName: "Misterios Eleusinos Mayores", festivalDayName: "Telete (La Iniciación)", deity: "Deméter y Perséfone", deityDesc: "Diosas del grano y del inframundo.", category: "Mistérico y Ctónico", participants: "Mystai (Iniciados), Hierofante, Daiduchos", festivalDesc: "Noche de vigilia, ayuno y bebida del Kykeon. Revelación en el Telesterion.", ritualOffering: { item: "Kykeon (bebida de cebada, agua y poleo)", icon: "🥣" }, pannychisDesc: "La iniciación suprema ocurría de noche dentro del Telesterion. Una gran luz brillaba en la oscuridad revelando las 'Cosas Sagradas'.", aition: "Los iniciados beben 'Kykeon' (cebada y poleo) en lugar de vino porque Deméter, de luto por Perséfone, rechazó el vino ofrecido por la reina de Eleusis y pidió esta mezcla humilde, convirtiéndola en ley ritual." };
    if (dayOfMonth === 22) return { ...eleusisBase, festivalDayName: "Plemochoai", festivalDesc: "Rito vertiendo vasijas de agua al este y al oeste pidiendo fertilidad.", ritualOffering: { item: "Plemochoai (Vasijas en forma de peonza volcadas hacia el este y oeste)", icon: "🏺" }, aition: "Los iniciados vierten agua desde vasijas en forma de peonza murmurando una fórmula secreta. Era magia empática: un truco prehistórico para invocar la lluvia e hipnotizar a las semillas para que crecieran." };
  }

  // 3. PYANEPSION (Otoño - Siembra)
  if (monthIndex === 3) {
    if (dayOfMonth === 5) return { festivalName: "Proerosia", deity: "Deméter", deityDesc: "Diosa de la agricultura.", festivalDesc: "Sacrificio preliminar antes de la arada. Se ofrecían los primeros frutos (diezmos) de toda Grecia.", category: "Agrario y Fertilidad", aition: "Una plaga prehistórica destruyó las plantas del mundo, y el Oráculo dictaminó que los campos solo volverían a ser fértiles si Atenas sacrificaba a Deméter en nombre de toda la humanidad." };
    if (dayOfMonth === 7) return { 
      festivalName: "Pyanepsia y Oschophoria", 
      deity: "Apolo / Dionisio y Atenea Skiras", 
      deityDesc: "Apolo de los primeros frutos / Dioses de la vid.", 
      festivalDesc: "Se ofrecía un caldo de legumbres (Pyanepsia) y la rama Eiresione. Carrera de jóvenes vestidos de mujer portando ramas de vid (Oschophoria).", 
      category: "Agrario y Fertilidad", 
      participants: "Jóvenes, Oschophoroi, Deipnophoroi", 
      ritualOffering: { item: "Panspermia (caldo de todas las legumbres) y la Eiresione (rama de olivo envuelta en lana con frutos y pan)", icon: "🍲" }, 
      aition: "Pyanepsia: Se cocina panspermia porque Teseo hirvió todas sus sobras al volver de Creta. Eiresione: Teseo inventó la rama decorada para agradecer a Apolo haberlos salvado. Oschophoria: El heraldo lleva su corona en el bastón y hay gritos de alegría y dolor por el regreso de Teseo y la muerte del rey Egeo. Deipnophoroi: Las mujeres cuentan cuentos imitando a las madres de los jóvenes que iban a ser sacrificados al Minotauro." 
    };
    if (dayOfMonth === 8) return { festivalName: "Theseia", deity: "Teseo", deityDesc: "Héroe mítico de Atenas.", festivalDesc: "Fiesta del héroe, con banquetes, entrega de comida a los pobres y competiciones atléticas y militares.", category: "Cívico y Patriótico", aition: "En el 475 a.C., el general Cimón conquistó la isla de Esciros tras ver a un águila picoteando un lugar: allí hallaron el esqueleto de un gigante con espada, que creyeron ser Teseo. Se celebra comiendo 'athara' (papilla de leche) en honor al héroe." };
    // THESMOPHORIA
    if (dayOfMonth === 11) return { festivalName: "Thesmophoria", festivalDayName: "Ánodos (El Camino Arriba)", deity: "Deméter y Perséfone", deityDesc: "Diosas de la fertilidad.", festivalDesc: "Las mujeres ciudadanas establecen su campamento cerca del Pnyx.", category: "Agrario y Fertilidad", participants: "Mujeres casadas ciudadanas exclusivamente", aition: "Las mujeres abandonan sus casas y suben a dormir al raso en cabañas. Con este éxodo imitan el sufrimiento de Deméter, quien vivió como vagabunda tras el secuestro de su hija Perséfone." };
    if (dayOfMonth === 12) return { festivalName: "Thesmophoria", festivalDayName: "Nesteia (El Ayuno)", deity: "Deméter y Perséfone", deityDesc: "Diosas de la fertilidad.", festivalDesc: "Día de luto, ayuno sentadas en el suelo e intercambio de insultos rituales.", category: "Purificación y Expiación", participants: "Mujeres casadas", isApaphrades: true, ritualOffering: { item: "Restos de lechones arrojados meses atrás en cavernas y recuperados por las Antletriai", icon: "🐖" }, aition: "Las mujeres ayunan y se gritan obscenidades (aischrologia) porque la sirvienta Iambe logró hacer sonreír a Deméter en su duelo contándole chistes verdes y groseros." };
    if (dayOfMonth === 13) return { festivalName: "Thesmophoria", festivalDayName: "Kalligeneia (Día de la Hermosa Descendencia)", deity: "Deméter", deityDesc: "Diosa de la fertilidad.", festivalDesc: "Banquete festivo orando por la fertilidad humana y agrícola.", category: "Agrario y Fertilidad", participants: "Mujeres casadas", aition: "La Persecución Calcídica: Las mujeres realizan un rito de persecución recordando que, en una guerra antigua, rezaron con tal furia que el ejército enemigo huyó y ellas los persiguieron corriendo hasta Calcis." };
    if (dayOfMonth >= 19 && dayOfMonth <= 21) return { festivalName: "Apaturia", deity: "Dionisio Melanaigis / Zeus Phratrios", deityDesc: "Dioses de las fratrías y clanes.", festivalDesc: "Festival de los clanes donde se registraba a los nuevos ciudadanos y recién nacidos.", category: "Familiar y Social", aition: "El nombre se asocia al 'engaño' (apate) porque Melanto venció al rey beocio Janto cuando Dioniso apareció tras Janto con una piel de cabra negra, distrayéndolo para el golpe mortal." };
  }

  // 5. POSEIDEON (Diciembre - Invierno)
  if (monthIndex === 5) {
    if (dayOfMonth === 19) return { festivalName: "Dionisias Rurales", deity: "Dionisio", deityDesc: "Dios del vino y la fertilidad.", festivalDesc: "Celebración local de invierno en los demes (pueblos) del Ática con procesiones fálicas.", category: "Dramático y Dionisíaco", agonDesc: "Se jugaba al 'Askoliasmos': los jóvenes competían intentando saltar y mantenerse a la pata coja sobre odres de piel de cabra inflados y engrasados con vino.", aition: "Los jóvenes saltan sobre un odre de vino engrasado como burla ritual hacia el chivo, el animal que devoraba las viñas sagradas. Bailar sobre la piel de la bestia muerta era la venganza del viñador." };
    if (dayOfMonth === 26) return { festivalName: "Haloa", deity: "Deméter y Dionisio", deityDesc: "Dioses de la tierra y la vid.", festivalDesc: "Fiesta de fertilidad en Eleusis. Banquete nocturno exclusivo para mujeres con abundancia de vino y símbolos fálicos para estimular las semillas.", category: "Agrario y Fertilidad", participants: "Mujeres, Sacerdotisas, Cortesanas", ritualOffering: { item: "Pasteles con forma de símbolos fálicos, abundancia de vino e incienso (sin sangre)", icon: "🥖" }, pannychisDesc: "Banquete nocturno invernal a puerta cerrada, exclusivo para mujeres, con comida, vino y bromas obscenas para la fertilidad.", aition: "Se comen pasteles con formas genitales y las sacerdotisas susurran a las mujeres que busquen amantes. Es magia simpática: al estimular la fertilidad humana, se estimulan las semillas de trigo recién plantadas." };
  }

  // 6. GAMELION (Mes de las Bodas)
  if (monthIndex === 6) {
    if (dayOfMonth === 12) return { festivalName: "Lenaia", deity: "Dionisio Lenaios", deityDesc: "Dios del vino y el teatro.", festivalDesc: "Festival dramático de invierno en el recinto del Lenaion. Famoso por sus competiciones de comedia.", category: "Dramático y Dionisíaco", participants: "Ciudadanos atenienses (sin extranjeros)", aition: "Las devotas (Lenai) y los coros invocan a Dionisio en lo más oscuro del invierno. El rito asume que la magia extática del vino y el teatro genera un calor divino capaz de derrotar al frío y resucitar las plantas." };
    if (dayOfMonth === 26) return { festivalName: "Theogamia (Hieros Gamos)", deity: "Zeus y Hera", deityDesc: "Reyes del Olimpo, protectores del matrimonio.", festivalDesc: "Celebración del matrimonio sagrado de los dioses, coincidiendo con la temporada popular de bodas en Atenas.", category: "Familiar y Social", aition: "Se celebra la unión carnal del Rey y la Reina del cielo para que esa chispa de fertilidad celestial caiga sobre los campos congelados del Ática y los prepare para la primavera." };
  }

  // 7. ANTHESTERION (Finales de Invierno / Flores)
  if (monthIndex === 7) {
    if (dayOfMonth === 11) return { festivalName: "Anthesteria", festivalDayName: "Pithoigia (Apertura de Jarras)", deity: "Dionisio", deityDesc: "Dios del vino.", festivalDesc: "Se abrían las jarras del nuevo vino y se llevaban muestras al santuario en las Marismas.", category: "Dramático y Dionisíaco", participants: "Ciudadanos y Esclavos", aition: "Los atenienses rezan aterrados para que el nuevo vino sea 'inofensiva'. Consideraban la fermentación un espíritu demoníaco; solo Dioniso podía domesticar el líquido y evitar que envenenara a la ciudad." };
    if (dayOfMonth === 12) return { festivalName: "Anthesteria", festivalDayName: "Choes (Las Jarras)", deity: "Dionisio", deityDesc: "Dios del vino.", festivalDesc: "Concurso de bebida en silencio. Matrimonio sagrado de la Basilinna con Dionisio.", category: "Dramático y Dionisíaco", participants: "Basilinna, Gerarai", agonDesc: "Concurso de bebida: al sonido de la trompeta, los ciudadanos competían para ver quién vaciaba primero su jarra (chous) de casi 3 litros en absoluto silencio.", economyDesc: "El Rey (Archon Basileus) otorgaba al ganador del concurso un odre lleno de vino o un pastel especial como trofeo.", aition: "Se bebe en silencio y en jarras individuales porque el rey inventó este concurso para que el asesino Orestes pudiera beber sin compartir copa ni hablar con nadie, evitando contagiar su maldición a los demás." };
    if (dayOfMonth === 13) return { festivalName: "Anthesteria", festivalDayName: "Chytrai (Las Ollas)", deity: "Hermes Ctónico", deityDesc: "Guía de los muertos.", festivalDesc: "Día aciago. Se cocían vegetales en ollas para los fantasmas que vagaban por la ciudad.", category: "Mistérico y Ctónico", isApaphrades: true, ritualOffering: { item: "Chytrai (Ollas de barro con vegetales hervidos ofrecidos a Hermes y a los fantasmas)", icon: "🥘" }, aition: "Se cocina una olla de vegetales que nadie come para conmemorar el Gran Diluvio: representa el pánico de los supervivientes que cocinaron pero huyeron antes de probar bocado. También recuerda el suicidio de la princesa Erígone." };
    if (dayOfMonth === 23) return { festivalName: "Diasia", deity: "Zeus Meilichios", deityDesc: "Zeus 'el Apacible' (subterráneo).", festivalDesc: "El mayor festival de Zeus. Holocausto de víctimas o pasteles con forma de animal para expiar la culpa y apaciguar al dios.", category: "Purificación y Expiación", participants: "Toda la población", ritualOffering: { item: "Víctimas animales o, para los más pobres, pasteles horneados con forma de ovejas o cerdos", icon: "🥐" }, aition: "Se queman víctimas enteras para calmar a Zeus Meilichios por terror. El festival es una penitencia lúgubre por la infame masacre de Cilón, para limpiar a Atenas de aquella sangre derramada." };
  }

  // 8. ELAPHEBOLION (Primavera)
  if (monthIndex === 8) {
    if (dayOfMonth === 6) return { festivalName: "Elaphebolia", deity: "Artemisa Elaphebolos", deityDesc: "Cazadora de ciervos.", festivalDesc: "Se ofrecían pasteles con forma de ciervos (elaphoi) hechos de masa, miel y sésamo.", category: "Agrario y Fertilidad", ritualOffering: { item: "Elaphoi (Pasteles con forma de ciervo hechos de masa, miel y sésamo)", icon: "🦌" }, aition: "Se hornean pasteles con forma de ciervos porque Artemisa exigía piezas reales, pero los atenienses las extinguieron cazando. El mito asegura que la diosa aceptó piadosamente estos sustitutos mágicos." };
    if (dayOfMonth === 8) return { festivalName: "Asclepieia", deity: "Asclepio", deityDesc: "Dios de la curación.", festivalDesc: "Conmemora la llegada del dios a Atenas. Comida sagrada y sacrificios.", category: "Purificación y Expiación", aition: "El festival ocurre en medio de los Misterios porque el propio Asclepio llegó tarde para iniciarse. Los atenienses repitieron los ritos solo para él. Desde entonces, el festival acoge a los peregrinos impuntuales." };
    if (dayOfMonth === 9) return { festivalName: "Proagon", deity: "Dionisio", deityDesc: "Dios del Teatro.", festivalDesc: "Ceremonia preliminar a las Dionisias. Los dramaturgos y actores se presentaban sin máscaras ante el público.", category: "Dramático y Dionisíaco", aition: "Los actores desfilan sin sus máscaras. En una cultura donde la máscara implicaba ser poseído por el dios, el Proagon demostraba que debajo de la magia divina seguían siendo ciudadanos mortales." };
    if (dayOfMonth >= 10 && dayOfMonth <= 13) return { festivalName: "Dionisias Urbanas (Grandes Dionisias)", deity: "Dionisio Eleuthereus", deityDesc: "Dios del teatro y el éxtasis.", festivalDesc: "El evento teatral supremo del mundo antiguo. Tragedias, comedias, procesión fálica masiva y ostentación del imperio ateniense ante visitantes extranjeros.", category: "Dramático y Dionisíaco", participants: "Atenienses, Extranjeros, Coregos, Huérfanos de guerra", agonDesc: "El Agón teatral supremo del mundo antiguo. Producción de tragedias y comedias evaluadas por 10 jueces elegidos por estricto sorteo para evitar sobornos.", economyDesc: "La entrada costaba 2 óbolos, pagados a los ciudadanos pobres por el Estado (Fondo Teórico). Los ciudadanos ricos financiaban las obras como un impuesto de honor (Choregia). En el teatro se exhibía el tributo en talentos de plata del imperio.", aition: "Se desfila con falos gigantes montados en carros porque, cuando los atenienses despreciaron la estatua de Dioniso, el dios los castigó con una plaga genital. El Oráculo dijo que la única cura era adorar al dios paseando falos gigantes por la ciudad." };
    if (dayOfMonth === 14) return { festivalName: "Pandia", deity: "Zeus", deityDesc: "Dios supremo.", festivalDesc: "Festival de clausura tras las Dionisias, posiblemente un festival de la antigua tribu de Pandion.", category: "Cívico y Patriótico", aition: "Tras el éxtasis de las Dionisias, este festival honra al rey Pandión. Funcionaba como un freno psicológico: Atenas debía recordar la estricta moralidad y el dolor del mundo real tras días de locura báquica." };
  }

  // 9. MUNICHION
  if (monthIndex === 9) {
    if (dayOfMonth === 6) return { festivalName: "Delphinia", deity: "Artemisa / Apolo", deityDesc: "Dioses purificadores.", festivalDesc: "Procesión de doncellas llevando ramas de olivo (hiketeria) atadas con lana blanca al santuario Delphinion.", category: "Purificación y Expiación", participants: "Doncellas atenienses", aition: "Las muchachas llevan ramas de olivo con lana blanca ('hiketeria') porque Teseo hizo esa misma ofrenda de súplica en el templo de Apolo justo antes de embarcar hacia Creta para ser sacrificado al Minotauro." };
    if (dayOfMonth === 16) return { festivalName: "Munichia y Brauronia", deity: "Artemisa", deityDesc: "Señora de las bestias y la luna.", festivalDesc: "Se ofrecían pasteles iluminados con velas (amphiphontes) para la diosa de la luna. Las niñas de Atenas actúan como osas en el santuario.", category: "Agrario y Fertilidad", aition: "Se sacrifica una cabra vestida de mujer porque el hombre Émbaros engañó a la diosa vistiendo al animal con el traje de su hija para salvarla del sacrificio. También recuerda el mito de las niñas 'osa' que apaciguaban a Artemisa por la muerte de su mascota sagrada." };
    if (dayOfMonth === 19) return { festivalName: "Olympieia", deity: "Zeus Olímpico", deityDesc: "Dios supremo.", festivalDesc: "Festival espectacular de la caballería ateniense (Hippodrome) en honor al inmenso templo de Zeus en el Ilisos.", category: "Cívico y Patriótico", participants: "Caballería Ateniense", agonDesc: "Competición militar conocida como 'Anthippasia': las tribus realizaban elaborados simulacros de cargas de caballería enfrentándose unas a otras en el Hipódromo.", aition: "La leyenda del festival se tiñó de tragedia cuando, en pleno desfile militar, el amado general Foción fue obligado a suicidarse, haciendo que los jinetes cabalgaran llorando bajo sus cascos festivos." };
  }

  // 10. THARGELION
  if (monthIndex === 10) {
    if (dayOfMonth === 6) return { festivalName: "Thargelia (Día 1)", deity: "Apolo", deityDesc: "Dios purificador.", festivalDesc: "Purificación violenta de la ciudad mediante dos chivos expiatorios humanos (Pharmakoi), alimentados a expensas del estado y luego expulsados.", category: "Purificación y Expiación", isApaphrades: true, aition: "Dos mendigos o criminales (Pharmakoi) son golpeados con cebollas silvestres y expulsados. Se creía que la cebolla actuaba como desinfectante mágico, absorbiendo la plaga de toda la ciudad dentro de esos dos desdichados." };
    if (dayOfMonth === 7) return { festivalName: "Thargelia (Día 2)", deity: "Apolo", deityDesc: "Dios protector de la cultura y cosechas.", festivalDesc: "Ofrenda de una olla con el primer grano (Thargelos). Gran competición de coros masculinos de las tribus.", category: "Cívico y Patriótico", agonDesc: "Intenso concurso musical entre las diez tribus, que presentaban coros de 50 hombres y 50 niños cantando himnos a Apolo.", economyDesc: "El 'Choregos' victorioso (el rico financiador del coro) ganaba el derecho a dedicar un trípode de bronce en el templo de Apolo (el Pythion)." };
    if (dayOfMonth === 19) return { festivalName: "Bendidia", deity: "Bendis (Artemisa Tracia)", deityDesc: "Diosa extranjera de la caza.", festivalDesc: "Espectacular carrera de antorchas a caballo de noche en el Pireo.", category: "Cívico y Patriótico", participants: "Tracios residentes y Atenienses", pannychisDesc: "Vigilia nocturna (Pannychis) que comenzaba con una espectacular y novedosa carrera de antorchas a caballo en el Pireo.", aition: "Atenas permitía esta carrera nocturna a caballo para agradar a los reyes tracios y asegurar la importación de trigo desde el Mar Negro, justificándolo mediante la asimilación de Bendis con Artemisa." };
    if (dayOfMonth === 25) return { festivalName: "Plynteria", deity: "Atenea Polias", deityDesc: "Diosa protectora.", festivalDesc: "Día nefasto. La estatua de la diosa era despojada, el templo cerrado con cuerdas, y la estatua se lavaba en el mar de Falero.", category: "Purificación y Expiación", participants: "Praxiergidai, Epheboi", isApaphrades: true, aition: "En la procesión se llevan pastelitos de higo. El mito asegura que los higos fueron la primera comida civilizada cultivada por la humanidad, y se le ofrecen a Atenea como 'picnic' para su día de baño en el mar." };
  }

  // 11. SKIROPHORION (Mes antes de la cosecha)
  if (monthIndex === 11) {
    if (dayOfMonth === 3) return { festivalName: "Arrephoria", deity: "Atenea Polias", deityDesc: "Diosa de la ciudad.", festivalDesc: "Dos niñas bajan por un pasadizo secreto de la Acrópolis llevando paquetes misteriosos.", category: "Mistérico y Ctónico", aition: "Las niñas recrean el mito de las hijas de Cécrope: Atenea les dio una caja cerrada, la abrieron por curiosidad, vieron a un bebé serpiente (Erictonio) y, locas de terror, se lanzaron por el acantilado." };
    if (dayOfMonth === 12) return { festivalName: "Skira", deity: "Atenea / Deméter", deityDesc: "Dioses de la ciudad y la fertilidad.", festivalDesc: "Procesión bajo un enorme toldo blanco (Skiron). Las mujeres sacrificaban lechones arrojándolos a cavernas.", category: "Agrario y Fertilidad", participants: "Sacerdotisas, Eteobutadai, Mujeres", aition: "Se arrojan lechones por la desaparición de los cerdos del porquero Eubuleo cuando Hades raptó a Perséfone. El enorme parasol (Skiron) se justifica como un homenaje a una estatua de arcilla blanca (skiros) que hizo Teseo al matar al Minotauro." };
    if (dayOfMonth === 14) return { festivalName: "Dipolieia (Bouphonia)", deity: "Zeus Polieus", deityDesc: "Protector de la ciudad.", festivalDesc: "Extraño rito antiguo donde se mataba a un buey de trabajo y luego el hacha ejecutora era llevada a juicio por 'asesinato'.", category: "Purificación y Expiación", participants: "Sacerdotes Bouphonia", aition: "El sacerdote huye y se juzga al hacha porque el primer hombre que sacrificó un buey (Sopatro) huyó aterrado por la culpa. Al no poder castigar al hombre, se juzgó al arma." };
    if (dayOfMonth === 30) return { festivalName: "Diisoteria y Carrera de Pan", deity: "Zeus Soter y Pan", deityDesc: "Dioses salvadores y rústicos.", festivalDesc: "Gran festival de cierre de año con una espectacular carrera de antorchas nocturna para el dios Pan.", category: "Cívico y Patriótico", participants: "Población y Epheboi", aition: "La carrera de antorchas para Pan fue la disculpa oficial de Atenas después de que el dios se quejara a Filípides de que lo ninguneaban. Se hizo para evitar su maldición antes de Maratón." };
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
      festivalName: "Noumenia",
      festivalDesc: "Luna Nueva. Sagrado para todos los dioses.",
      deity: "Νουμηνία", 
      deityDesc: "El día en que la luna (creciente) es visible por primera vez tras la Luna Nueva. Sagrado para todos los dioses, especialmente Apolo Neomenios y Hestia.", 
    },
    2: { 
      festivalName: "Agathos Daimon",
      festivalDesc: "Día del 'Buen Espíritu'.",
      deity: "Ἀγαθὸς Δาίμων", 
      deityDesc: "El 'Buen Espíritu'. Un día para honrar al protector personal y la prosperidad del hogar.", 
    },
    3: { 
      festivalName: "Tritogeneia",
      festivalDesc: "Cumpleaños de Atenea.",
      deity: "Ἀθηνᾶ Τριτογένεια", 
      deityDesc: "Cumpleaños de Atenea. Celebración de la diosa de la sabiduría y la guerra estratégica.", 
    },
    4: { 
      festivalName: "Tetras",
      festivalDesc: "Día de Heracles, Hermes, Afrodita y Eros.",
      deity: "Ἡρακλῆς, Ἑρμῆς, Ἀφροδίτη καὶ Ἔρως", 
      deityDesc: "Una poderosa combinación de Heracles, Hermes, Afrodita y Eros. Día de la fuerza, los viajes y el amor.", 
    },
    6: { 
      festivalName: "Artemisia",
      festivalDesc: "Cumpleaños de Artemisa.",
      deity: "Ἄρτεμις", 
      deityDesc: "Cumpleaños de Artemisa. Día sagrado para la diosa de la caza y la naturaleza salvaje.", 
    },
    7: { 
      festivalName: "Hebdome",
      festivalDesc: "Cumpleaños de Apolo.",
      deity: "Ἀπόλλων", 
      deityDesc: "Cumpleaños de Apolo. El día más sagrado de la primera década, dedicado al dios de la luz y la verdad.", 
    },
    8: { 
      festivalName: "Ogdoe",
      festivalDesc: "Día de Poseidón y Teseo.",
      deity: "Ποσειδῶν καὶ Θησεύς", 
      deityDesc: "Poseidón y Teseo. Día del mar y del heroico fundador de Atenas.", 
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

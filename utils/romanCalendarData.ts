import { ROMAN_YEAR_DATA, YearDayEntry } from './romanYearData';
import { getRomanYearDataKey } from './romanTimeUtils';

export type DayStatus = 'F' | 'N' | 'NP' | 'C' | 'EN';

export interface FonteAntiqua {
  month: number;      // 1 = Enero, 2 = Febrero... (internal matching key)
  day: number;        // (internal matching key)
  author: string;     // "Ovidius"
  work: string;       // "Fasti"
  book?: string;      // "I", "II", etc.
  lines?: string;     // "337-338"
  textLa?: string;    // Latin original
  textEs: string;     // Spanish translation
  type: 'aition' | 'ritual' | 'description' | 'etymology';
}

export interface RomanDayInfo {
    status: DayStatus;
    statusFull: string;
    festivalName?: string;
    description?: string; // Spanish Description of the Day/Festival
    god: string; // The specific God of the Day (Deus Diei)
    isMajorFestival: boolean;
    fontes?: FonteAntiqua[];
}

export const FONTES_ANTIQUI: FonteAntiqua[] = [
  {
    month: 1,
    day: 9,
    author: "Ovidius",
    work: "Fasti",
    book: "I",
    lines: "337–338, 349–350",
    textLa: "ante, deos homini quod conciliare valeret,\nfar erat et puri lucida mica salis,\n[…]\nprima Ceres avidae gavisa est sanguine porcae\nulta suas merita caede nocentis opes;",
    textEs: "Antes lo que podía conciliar con el hombre a los dioses / era una torta y de sal pura una pizca lúcida... Ceres primera gozóse en la sangre de ávida puerca: / del culpable con justa muerte vengó sus bienes.",
    type: "aition",
  },
  {
    month: 2,
    day: 15,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "365–370",
    textEs: "Rómulo y Remo desnudos en competencias lúdicas / son avisados de que les robaban sus ganados; / por rescatarlos, corren como están / y queda la fama que dio la costumbre.",
    type: "aition",
  },
  {
    month: 2,
    day: 21,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "533–536",
    textEs: "Honra es también a túmulos, aplacar las almas paternas, / y llevar parvos dones a construidas piras. / Pequeñeces piden los manes: por rico don les agrada / piedad: honda Estigia no ávidos dioses tiene.",
    type: "ritual",
  },
  {
    month: 3,
    day: 1,
    author: "Ovidius",
    work: "Fasti",
    book: "III",
    lines: "205, 217–218",
    textEs: "Las esposas congréganse en el templo llamado de Juno... / cuando las raptadas vienen entre maridos y padres, / y en el seno a sus hijos, prendas queridas, tienen...",
    type: "aition",
  },
  {
    month: 3,
    day: 17,
    author: "Ovidius",
    work: "Fasti",
    book: "III",
    lines: "735–736",
    textLa: "liba deo fiunt, sucis quia dulcibus idem\ngaudet, et a Baccho mella reperta ferunt.",
    textEs: "Se hacen al dios estos panes, pues de dulces jugos él mismo / disfruta, y dicen que por Baco la miel fue hallada.",
    type: "description",
  },
  {
    month: 4,
    day: 19,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "401–404",
    textEs: "Ceres primera, destinado el hombre a alimentos mejores, / cambió las bellotas por un manjar más útil. / Aquélla obligó a los toros a entregar al yugo su cuello: / vio entonces primero soles la tierra abierta.",
    type: "aition",
  },
  {
    month: 4,
    day: 21,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "735–738",
    textEs: "Lustra, pastor, hartas ovejas hacia primeros crepúsculos: / antes la onda se esparza, y barra la vara el suelo, / decórense los rediles con frondas y ramos clavados, / y larga corona las puertas ornadas cubra.",
    type: "ritual",
  },
  {
    month: 4,
    day: 25,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "911–912, 921",
    textEs: "Áspera Robígine perdona a las hierbas de Ceres, / y su leve cacumen trema en la tierra suma... / Perdona, ruego, y de las mieses quita tus sórdidas manos...",
    type: "ritual",
  },
  {
    month: 5,
    day: 2,
    author: "Ovidius",
    work: "Fasti",
    book: "V",
    lines: "195–196, 207–208",
    textEs: "Yo que Flora me llamo, era Cloris. Fue corrompida / por voz latina de mi nombre una letra griega... / Gozo siempre primavera: siempre es nitidísimo el año, / frondas el árbol tiene, pastos el suelo siempre.",
    type: "aition",
  },
  {
    month: 5,
    day: 9,
    author: "Ovidius",
    work: "Fasti",
    book: "V",
    lines: "429–432",
    textEs: "Cuando media noche ya sea, y den silencios los sueños... / recordador aquél del viejo rito y con temor de los dioses / surge; sus dos pies no tienen ningunos vínculos...",
    type: "ritual",
  },
  {
    month: 6,
    day: 9,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "291–294",
    textLa: "nec tu aliud Vestam quam vivam intellege flammam,\nnataque de flamma corpora nulla vides.\niure igitur virgo est, quae semina nulla remittit\nnec capit et comites virginitatis amat.",
    textEs: "Y tú a Vesta otra cosa que viva flama no entiendas; / y de la flama cuerpos ningunos ves nacidos. / Por ley, pues, es virgen, que semillas ningunas produce / ni acepta; y socias de su virginidad posee.",
    type: "description",
  },
  {
    month: 6,
    day: 11,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "475–476, 545",
    textEs: "Id, buenas madres (las Matrales son vuestra fiesta), / y dad flavas tortas a la tebana diosa... / Leucotea por los griegos, serás Matuta por los nuestros llamada...",
    type: "ritual",
  },
  {
    month: 1,
    day: 1,
    author: "Ovidius",
    work: "Fasti",
    book: "I",
    lines: "65–66, 117–118",
    textLa: "Iane biceps, anni tacite labentis origo,\nsolus de superis qui tua terga vides,\n[…]\nquicquid ubique vides, caelum, mare, nubila, terras,\nomnia sunt nostra clausa patentque manu.",
    textEs: "Jano bifronte, tácito origen del año que pasa, / único de supernos que tus espaldas miras... Lo que ves por doquiera: cielo, mar, tierra, nublados, / todo se cierra y por mi mano se abre.",
    type: "description",
  },
  {
    month: 1,
    day: 11,
    author: "Ovidius",
    work: "Fasti",
    book: "I",
    lines: "461–462, 473–474",
    textEs: "Dejando a Titón observará la próxima Aurora, / de la diosa de Arcadia pontificales ritos... / Cuando ésta en su alma había concebido los fuegos etéreos, / con boca plena de dios cantos veraces daba.",
    type: "aition",
  },
  {
    month: 1,
    day: 13,
    author: "Ovidius",
    work: "Fasti",
    book: "I",
    lines: "587–588, 590",
    textEs: "Casto sacerdote en templo de Júpiter magno, los Idus, / vísceras de un carnero castrado en flamas liba... / y con nombre de Augusto tu abuelo fue llamado.",
    type: "ritual",
  },
  {
    month: 1,
    day: 24, // Nota: Las Feriae Sementivae eran móviles, las asignamos al inicio de su rango
    author: "Ovidius",
    work: "Fasti",
    book: "I",
    lines: "671–674",
    textEs: "Tierra y Ceres, madres de frutos, son complacidas / con la torta y entrañas de una preñada puerca. / Un deber común salvaguardan Ceres y Tierra: / causa a los frutos ésta, les da lugar aquélla.",
    type: "ritual",
  },
  {
    month: 1,
    day: 30,
    author: "Ovidius",
    work: "Fasti",
    book: "I",
    lines: "709–712",
    textEs: "El mismo carmen al ara de la Paz me condujo... / Con guirnaldas del Accio ceñida en compuestos cabellos, / ven Paz, y benévola queda en el orbe entero.",
    type: "description",
  },
  {
    month: 2,
    day: 1,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "55–56",
    textEs: "Se dice que Sóspita, contigua a Madre frigia, fue honrada, / al principio del mes, con un santuario nuevo.",
    type: "description",
  },
  {
    month: 2,
    day: 17,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "475–476, 525–526",
    textEs: "Vacía es luz próxima. Mas dedicada tercera a Quirino. / Rómulo antes ha sido, quien este nombre tiene... / Fue hecha diosa Fórnace. A Fórnace los alegres colonos / ruegan para que sus mieses regule aquélla.",
    type: "description",
  },
  {
    month: 2,
    day: 22,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "617–620",
    textEs: "Las próximas Caristias nombraron los caros parientes, / y la turba cercana viene a asociados dioses. / Sin duda desde túmulos y cercanos que han perecido, / de pronto hasta los vivos place volver los rostros...",
    type: "description",
  },
  {
    month: 2,
    day: 23,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "640–641, 659–660",
    textEs: "El dios que los barbechos con su señal separa. / Término, ya piedra, ya eres estaca clavada en el agro... tú a pueblos, ciudades y reinos ingentes marcas el límite: / lleno de pleitos todo el agro, sin ti, estaría.",
    type: "description",
  },
  {
    month: 2,
    day: 24,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "849–852",
    textEs: "Es visible herida vacía. Con clamor Bruto a Quirites / subleva y refiere del rey los nefandos hechos. / Proscrito es con su prole Tarquinio: toma leyes de un año / el cónsul: a los reinos último fue aquel día.",
    type: "description",
  },
  {
    month: 2,
    day: 27,
    author: "Ovidius",
    work: "Fasti",
    book: "II",
    lines: "857–860",
    textEs: "Y ya del mes segundo quedan dos noches, y Marte / incita los rápidos potros a uncidos carros. / De lo real quedó el puesto nombre de Equirrias, / las cuales en su Campo el mismo dios divisa.",
    type: "description",
  },
  {
    month: 3,
    day: 15,
    author: "Ovidius",
    work: "Fasti",
    book: "III",
    lines: "523–526",
    textEs: "Tiene en los Idus alegre fiesta Ana Perena / no lejos de tus bordes, advenedizo Tíber. / Viene la plebe y acá y allá entre verdes hierbas dispersa / bebe, y con su pareja cada uno se recuesta.",
    type: "description",
  },
  {
    month: 3,
    day: 19,
    author: "Ovidius",
    work: "Fasti",
    book: "III",
    lines: "809, 811–812",
    textEs: "Hay único día intermedio, y a Minerva se hacen los ritos... / Huelga el primero de sangre, y recurrir al hierro no es lícito: / causa, porque en aquel día nació Minerva.",
    type: "aition",
  },
  {
    month: 3,
    day: 23,
    author: "Ovidius",
    work: "Fasti",
    book: "III",
    lines: "849–850",
    textEs: "De los cinco el último día lustrar trompetas canoras / advierte y sacrificios hacer a fuerte diosa.",
    type: "ritual",
  },
  {
    month: 4,
    day: 1,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "133–136",
    textEs: "Honráis según rito a la diosa, madres y nueras del Lacio... / Quitadle áureos collares de su cuello de mármol, quitadle / riquezas: ser lavada toda la diosa debe.",
    type: "ritual",
  },
  {
    month: 4,
    day: 4,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "179–182",
    textEs: "Deja que el cielo tres veces dé vuelta en su eje perpetuo... / sonará pronto flauta berecintia de cuerno torcido, / y la madre del Ida tendrá sus fiestas.",
    type: "description",
  },
  {
    month: 4,
    day: 13,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "621–622",
    textEs: "Bajo el conombre de Vencedor ocupa Júpiter Idus / de Abril. Los templos se le dieron en este día.",
    type: "description",
  },
  {
    month: 4,
    day: 15,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "630–634",
    textEs: "Ofreced sacrificios con una preñada vaca. / Forda es la vaca encinta y fecunda, de ferre llamada: / de aquí juzgan también que nombre tiene el feto. / Grávida está hoy la grey, grávidas por simiente hoy las tierras: / a Tierra plena víctima plena dase.",
    type: "ritual",
  },
  {
    month: 4,
    day: 23,
    author: "Ovidius",
    work: "Fasti",
    book: "IV",
    lines: "897–900",
    textEs: "Llegado había el Otoño manchado por uvas pisadas: / con mérito a Júpiter danse debidos vinos. / De aquí el día llamóse Vinales. Reclámalo Júpiter / y se regocija de que en sus fiestas entre.",
    type: "etymology",
  },
  {
    month: 5,
    day: 1,
    author: "Ovidius",
    work: "Fasti",
    book: "V",
    lines: "129–130, 147–148",
    textEs: "Las Calendas de Mayo vieron que ara y estatuas pequeñas / de los dioses se alzaron a protectores Lares... / Debo en tanto cantar a Buena Diosa. / Hay una mole nativa al sitio, la cosa dio los nombres...",
    type: "description",
  },
  {
    month: 5,
    day: 12,
    author: "Ovidius",
    work: "Fasti",
    book: "V",
    lines: "551–554",
    textEs: "El propio Vengador desde el cielo, para ver sus honores / y sus templos en el foro augustal, desciende. / Es ingente el dios y su obra. En la urbe de su hijo / no de otra manera Marte habitar debía.",
    type: "description",
  },
  {
    month: 5,
    day: 15,
    author: "Ovidius",
    work: "Fasti",
    book: "V",
    lines: "663, 665–666, 671–672",
    textEs: "Ven, nieto preclaro de Atlas... / de paz y de armas, y de dioses de alturas y abismos / árbitro, que con alado pie caminas... / Quienes profesan vender sus mercancías te ruegan, / dándote incienso, que les otorgues lucros.",
    type: "ritual",
  },
  {
    month: 5,
    day: 21,
    author: "Ovidius",
    work: "Fasti",
    book: "V",
    lines: "721–722",
    textEs: "A Jano vuelva quien busca qué son Agonales, / que empero en los fastos tienen también tal tiempo.",
    type: "description",
  },
  {
    month: 5,
    day: 23,
    author: "Ovidius",
    work: "Fasti",
    book: "V",
    lines: "725–726",
    textEs: "De Vulcano es la próxima luz, Tubilustros la llaman: / se purifican, que aquél hace, trompetas puras.",
    type: "description",
  },
  {
    month: 6,
    day: 1,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "101–102, 169–170",
    textEs: "Carna, a ti se da el primer día. Diosa es ésta del gozne: / lo cerrado su numen abre, y lo abierto cierra... / ¿Preguntas por qué pingües lardos en aquellas Calendas / se gustan, y está el haba mixta a la espelta cálida?",
    type: "description",
  },
  {
    month: 6,
    day: 5,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "213–216",
    textEs: "Buscaba si refería las Nonas a Sanco o a Fidio / o a ti, padre Semón. Sanco me dijo entonces: / 'a cualquiera de estos que las des, tendré yo el obsequio. / Los tres nombres llevo. Quisieron tal curenses'.",
    type: "description",
  },
  {
    month: 6,
    day: 7,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "237–240",
    textEs: "Me acordé entonces que yo juegos miré en las gramas / del Campo y fueron llamados, lúbrico Tíber, tuyos. / Día festivo para aquellos que linos húmedos guían, / y que con parvos cebos bronces recurvos cubren.",
    type: "description",
  },
  {
    month: 6,
    day: 13,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "651–654",
    textEs: "Y ya me ordeno narrar las Quincuatrías menores. / Hoy mis proyectos, oh flava Minerva, ampara. / '¿Por qué el flautista, errante, en toda la Urbe circula? / ¿Qué, larga estola; qué le significan máscaras?'",
    type: "description",
  },
  {
    month: 6,
    day: 15,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "713–714",
    textEs: "Éste es aquel día en que las purificaciones de Vesta, / tú, Tíber, metes al mar por etruscas aguas.",
    type: "ritual",
  },
  {
    month: 6,
    day: 24,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "773, 775–778",
    textEs: "¡Cuán pronto llegaron tus honores Poderosa Fortuna! / Id, a diosa Poderosa celebrad alegres Quirites: / en la margen del Tíber tiene de un rey regalos. / Parte a pie, parte también navegad en rápido esquife, / y no os apene de allí ebrios volver a casa.",
    type: "description",
  },
  {
    month: 6,
    day: 27,
    author: "Ovidius",
    work: "Fasti",
    book: "VI",
    lines: "793–794",
    textEs: "Estator tiene igual tiempo del templo, que Rómulo otrora / fundó ante los rostros del monte Palatino.",
    type: "description",
  },
];

// Función auxiliar para obtener el texto histórico según el tipo de día
const getDefaultStatusDescription = (status: DayStatus): string => {
    switch (status) {
        case 'F':
            return "Dies Fastus: Día en el que era lícito para el pretor administrar justicia y los ciudadanos podían tratar asuntos comerciales.";
        case 'C':
            return "Dies Comitialis: Día propicio para convocar a las asambleas populares (Comitia), realizar votaciones públicas y tratar asuntos del Estado.";
        case 'N':
            return "Dies Nefastus: Día reservado a los dioses en el que estaban estrictamente prohibidas las actividades judiciales y asambleas políticas.";
        case 'NP':
            return "Dies Nefastus Publicus: Festividad pública de gran importancia religiosa. Toda actividad comercial, judicial o política estaba suspendida en favor de los ritos.";
        case 'EN':
            return "Dies Endotercissus (o Intercisus): Día mixto. Nefasto por la mañana y al atardecer, pero fasto (hábil para negocios) en las horas centrales tras concluir los sacrificios matutinos.";
        default:
            return "Un día común en el calendario romano.";
    }
};

export const getRomanDayInfo = (date: Date): RomanDayInfo => {
    // Julian date before 1582 and leap-year-aware February mapping
    const key = getRomanYearDataKey(date);
    const [month, day] = key.split('-').map(Number);

    // Look up in our extensive year database
    const entry = ROMAN_YEAR_DATA[key];

    if (entry) {
        // Si hay una descripción de festival, la usamos. Si no, generamos una dinámica.
        let finalDescription = entry.festivalDesc;

        if (!finalDescription) {
            const statusFallback = getDefaultStatusDescription(entry.status);
            // Combinamos la descripción de la deidad (ej: "Diosa de la suerte.") con la explicación del tipo de día
            finalDescription = entry.deityDesc
                ? `${entry.deityDesc} ${statusFallback}`
                : statusFallback;
        }

        const fonte = FONTES_ANTIQUI.find(
            ex => ex.month === (month + 1) && ex.day === day
        );

        return {
            status: entry.status,
            statusFull: entry.statusFull,
            festivalName: entry.festivalName || undefined,
            description: finalDescription,
            god: entry.deity,
            isMajorFestival: entry.status === 'NP' || !!entry.festivalName, // Assume NP or named festival is major
            fontes: fonte ? [fonte] : undefined,
        };
    }

    // Fallback (Should typically not happen if 365 data is complete, but good for safety)
    return {
        status: 'F',
        statusFull: "Dies Fastus",
        isMajorFestival: false,
        god: "Genius Huius Diei", // El Genio del día actual
        description: getDefaultStatusDescription('F'),
    };
};

export const getNextRomanFestivals = (date: Date, limit: number = 3) => {
  const nextFestivals = [];
  const currentDate = new Date(date);

  for (let i = 1; i <= 60; i++) {
    currentDate.setDate(currentDate.getDate() + 1);
    const info = getRomanDayInfo(currentDate);
    if (info.festivalName) {
      nextFestivals.push({
        name: info.festivalName,
        description: info.description,
        date: currentDate.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' }),
        daysRemaining: i
      });
      if (nextFestivals.length >= limit) break;
    }
  }
  return nextFestivals;
};
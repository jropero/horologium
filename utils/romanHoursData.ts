// romanHoursData.ts — What the Romans themselves wrote about the hours.
//
// Planetary hours: the Chronograph of 354 (Calendar of Filocalus), planetary-week
// pages, ed. Mommsen, MGH Chronica Minora I pp. 42–45 (text at
// tertullian.org/fathers/chronography_of_354_04_planets_and_days.htm). Each caption
// reads "<planet> dies horaque eius cum erit nocturna sive diurna, … utile est" and
// every hour of the planet is rated B (bona), C (communis) or N (noxia). The rating
// depends only on the planet: Saturn and Mars N; Sol, Luna, Mercury C; Jupiter and
// Venus B. The Chronograph lists under each day the night *before* it; the ruler of
// any given hour is the same as in the app's sunrise-to-sunrise count, because the
// Chaldean sequence runs on unbroken.
//
// Civic day: Martial, Epigrammata 4.8 (hours I–X).
// Night (and the end of the day): Censorinus, De die natali 24. Censorinus names the
// parts of the night in order but does not tie them to hours; the mapping onto the
// twelve night hours below is ours and only approximate.
// Night watches: Vegetius, Epitoma rei militaris 3.8 — four vigiliae of three night
// hours each, kept by the water clock.

export type PlanetKey = 'Moon' | 'Mercury' | 'Venus' | 'Sun' | 'Mars' | 'Jupiter' | 'Saturn';

export type HourQuality = 'B' | 'C' | 'N';

export interface ChronographHour {
  quality: HourQuality;
  /** The "… utile est" (or, for Saturn, the general) clause of the caption, verbatim. */
  latin: string;
  spa: string;
}

export const CHRONOGRAPH_HOURS: Record<PlanetKey, ChronographHour> = {
  Saturn: {
    quality: 'N',
    latin: 'Omnia obscura laboriosaque fiunt.',
    spa: 'Todo resulta oscuro y trabajoso.',
  },
  Jupiter: {
    quality: 'B',
    latin: 'Beneficium petere, cum potente colloqui, rationem reddere utile est.',
    spa: 'Conviene pedir un favor, hablar con un poderoso, rendir cuentas.',
  },
  Mars: {
    quality: 'N',
    latin: 'Nomen militiae dare, arma militaria comparare utile est.',
    spa: 'Conviene alistarse en la milicia y procurarse armas.',
  },
  Sun: {
    quality: 'C',
    latin: 'Viam navigium ingredi, navem in aquam deducere utile est.',
    spa: 'Conviene emprender camino o travesía y botar una nave.',
  },
  Venus: {
    quality: 'B',
    latin: 'Sponsalia facere, pueros puellas in disciplina mittere utile est.',
    spa: 'Conviene celebrar esponsales y enviar a niños y niñas a la escuela.',
  },
  Mercury: {
    quality: 'C',
    latin: 'Vilicum actorem institorem in negotio ponere utile est.',
    spa: 'Conviene poner al frente del negocio a un capataz, un administrador o un factor.',
  },
  Moon: {
    quality: 'C',
    latin: 'Stercus in agro mittere, putea cisternas fabricare utile est.',
    spa: 'Conviene abonar el campo y construir pozos y cisternas.',
  },
};

export const QUALITY_LABEL: Record<HourQuality, { lat: string; spa: string }> = {
  B: { lat: 'bona',     spa: 'buena' },
  C: { lat: 'communis', spa: 'común' },
  N: { lat: 'noxia',    spa: 'nociva' },
};

export interface CivicHour {
  latin: string;
  spa: string;
  source: string;
}

const MARTIAL = 'Mart. 4.8';
const CENS = 'Censorinus 24';

// Day hours I–XII. Martial 4.8 covers I–X; XI–XII are Censorinus' "suprema",
// the last part of the day "ad solem occasum usque".
export const CIVIC_DAY_HOURS: CivicHour[] = [
  { latin: 'Prima salutantes atque altera conterit hora',     spa: 'La primera y la segunda hora las gastan los que saludan al patrón', source: MARTIAL },
  { latin: 'Prima salutantes atque altera conterit hora',     spa: 'La primera y la segunda hora las gastan los que saludan al patrón', source: MARTIAL },
  { latin: 'Exercet raucos tertia causidicos',                spa: 'La tercera hace trabajar a los roncos abogados',                     source: MARTIAL },
  { latin: 'In quintam varios extendit Roma labores',         spa: 'Roma prolonga sus diversas tareas hasta la quinta',                  source: MARTIAL },
  { latin: 'In quintam varios extendit Roma labores',         spa: 'Roma prolonga sus diversas tareas hasta la quinta',                  source: MARTIAL },
  { latin: 'Sexta quies lassis',                              spa: 'La sexta es descanso para los cansados',                             source: MARTIAL },
  { latin: 'Septima finis erit',                              spa: 'La séptima será el fin de los negocios',                             source: MARTIAL },
  { latin: 'Sufficit in nonam nitidis octava palaestris',     spa: 'La octava, hasta la novena, basta para las relucientes palestras',   source: MARTIAL },
  { latin: 'Imperat extructos frangere nona toros',           spa: 'La novena ordena hundir los lechos del banquete',                    source: MARTIAL },
  { latin: 'Hora libellorum decuma est',                      spa: 'La décima es la hora de los libritos (del poeta)',                   source: MARTIAL },
  { latin: 'Suprema, ad solem occasum usque',                 spa: 'La última parte del día, hasta la puesta del sol',                   source: CENS },
  { latin: 'Suprema, ad solem occasum usque',                 spa: 'La última parte del día, hasta la puesta del sol',                   source: CENS },
];

// Night hours I–XII, approximate placement of Censorinus' sequence.
export const CIVIC_NIGHT_HOURS: CivicHour[] = [
  { latin: 'Vespera',                          spa: 'El atardecer, antes de que salga el lucero de la tarde', source: CENS },
  { latin: 'Crepusculum',                      spa: 'El crepúsculo: no se sabe si es noche o día',           source: CENS },
  { latin: 'Luminibus accensis',               spa: 'Con las luces encendidas («prima face»)',                source: CENS },
  { latin: 'Concubium, cum itum est cubitum',  spa: 'La hora de acostarse',                                   source: CENS },
  { latin: 'Intempesta nox',                   spa: 'Noche cerrada, en que nada es oportuno hacer',          source: CENS },
  { latin: 'Ad mediam noctem',                 spa: 'Hacia la medianoche',                                    source: CENS },
  { latin: 'De media nocte',                   spa: 'Pasada la medianoche, inicio del día romano',            source: CENS },
  { latin: 'Gallicinium',                      spa: 'Cuando los gallos empiezan a cantar',                    source: CENS },
  { latin: 'Gallicinium',                      spa: 'Cuando los gallos empiezan a cantar',                    source: CENS },
  { latin: 'Conticinium',                      spa: 'Cuando los gallos han callado',                          source: CENS },
  { latin: 'Ante lucem',                       spa: 'Antes de la luz',                                        source: CENS },
  { latin: 'Diluculum',                        spa: 'El alba: ya hay luz, aunque el sol no ha salido',        source: CENS },
];

const VIGILIA_ORD = ['prima', 'secunda', 'tertia', 'quarta'];
const VIGILIA_ORD_ES = ['primera', 'segunda', 'tercera', 'cuarta'];

/** Military watch (Vegetius 3.8) of a night hour 1–12. */
export const vigiliaOf = (nightHour: number): { lat: string; spa: string } => {
  const i = Math.min(3, Math.floor((nightHour - 1) / 3));
  return { lat: `Vigilia ${VIGILIA_ORD[i]}`, spa: `${VIGILIA_ORD_ES[i]} guardia` };
};


import React, { useMemo, useState } from 'react';
import { useCivilization } from '../contexts/CivilizationContext';
import { getSunTimes, getSolarLongitudeDeg } from '../utils/solar';
import { getPlanetaryRuler } from '../utils/romanTimeUtils';
import {
  PlanetKey, CHRONOGRAPH_HOURS, QUALITY_LABEL, CIVIC_DAY_HOURS, CIVIC_NIGHT_HOURS, vigiliaOf,
} from '../utils/romanHoursData';

// Planetary hours are a Hellenistic invention (2nd–1st c. BCE; Cassius Dio 37.18–19
// explains the Chaldean order). This panel is therefore shown only for Rome, Hellas
// and — as a late import — China. Egypt and Babylon get their own hour panels.

const SYMBOLS: Record<PlanetKey, string> = {
  Moon: '☽', Mercury: '☿', Venus: '♀', Sun: '☀', Mars: '♂', Jupiter: '♃', Saturn: '♄',
};

const CIV_NAMES: Record<string, Record<PlanetKey, string>> = {
  rome:      { Moon: 'Luna',    Mercury: 'Mercurius', Venus: 'Venus',     Sun: 'Sol',    Mars: 'Mars',   Jupiter: 'Iuppiter', Saturn: 'Saturnus' },
  hellas:    { Moon: 'Σελήνη', Mercury: 'Ἑρμῆς',    Venus: 'Ἀφροδίτη', Sun: 'Ἥλιος', Mars: 'Ἄρης',  Jupiter: 'Ζεύς',     Saturn: 'Κρόνος'   },
  zhongguo:  { Moon: '太阴',    Mercury: '辰星',      Venus: '太白',      Sun: '太阳',   Mars: '荧惑',   Jupiter: '岁星',     Saturn: '镇星'     },
};

// Greek astronomical names of the planets, [Aristotle] De mundo 2, 392a
// ("ὁ τοῦ Φαίνοντος ἅμα καὶ Κρόνου καλούμενος κύκλος…").
const GREEK_STAR_NAMES: Partial<Record<PlanetKey, string>> = {
  Saturn: 'Φαίνων', Jupiter: 'Φαέθων', Mars: 'Πυρόεις', Mercury: 'Στίλβων', Venus: 'Φωσφόρος',
};

const LATIN_TO_KEY: Record<string, PlanetKey> = {
  Saturnus: 'Saturn', Iuppiter: 'Jupiter', Mars: 'Mars',
  Sol: 'Sun', Venus: 'Venus', Mercurius: 'Mercury', Luna: 'Moon',
};

// Vettius Valens, Anthologiae I.1 "Περὶ τῆς τῶν ἀστέρων φύσεως", ed. Kroll 1908
// (page.line). Verbatim excerpts, shortened with "…"; Kroll's editorial ⟨ ⟩ dropped.
// Valens describes what each planet signifies in a nativity; the hour takes on the
// nature of its ruler (Paulus Alexandrinus, Eisagogika 21, Περὶ τοῦ πολεύοντος καὶ
// διέποντος). Spanish renderings are ours, from the Greek.
interface HourAdvice { classical: string; spa: string; cite: string; }
const VALENS: Record<PlanetKey, HourAdvice> = {
  Sun:     { classical: 'σημαίνει … βασιλείαν, ἡγεμονίαν, νοῦν, φρόνησιν, μορφήν, κίνησιν, ὕψος τύχης',
             spa: 'Significa realeza, mando, intelecto, prudencia, belleza, movimiento, altura de fortuna.', cite: 'Val. I.1, p. 1.5' },
  Moon:    { classical: 'σημαίνει μὲν κατὰ γένεσιν ἀνθρώποις ζωήν, σῶμα, μητέρα, σύλληψιν',
             spa: 'Significa, en el nacimiento de los hombres, la vida, el cuerpo, la madre, la concepción.', cite: 'Val. I.1, p. 1.15' },
  Saturn:  { classical: 'ποιεῖ μὲν τοὺς ὑπ᾽ αὐτὸν γεννωμένους μικρολόγους, βασκάνους, πολυμερίμνους',
             spa: 'Hace a los nacidos bajo él mezquinos, envidiosos, llenos de preocupaciones.', cite: 'Val. I.1, p. 2.1' },
  Jupiter: { classical: 'σημαίνει τέκνωσιν, γονήν, ἐπιθυμίαν, ἔρωτας, … φιλίας μεγάλων ἀνδρῶν, εὐπορίας',
             spa: 'Significa la procreación, la descendencia, el deseo, los amores, la amistad de grandes hombres, la prosperidad.', cite: 'Val. I.1, p. 2.24' },
  Mars:    { classical: 'σημαίνει βίας, πολέμους, ἁρπαγάς, κραυγάς, ὕβρεις',
             spa: 'Significa violencias, guerras, rapiñas, gritos, ultrajes.', cite: 'Val. I.1, p. 2.35' },
  Venus:   { classical: 'ἐστὶ μὲν ἐπιθυμία καὶ ἔρως, σημαίνει δὲ μητέρα καὶ τροφόν',
             spa: 'Es deseo y amor; significa la madre y la nodriza.', cite: 'Val. I.1, p. 3.16' },
  Mercury: { classical: 'σημαίνει παιδείαν, γράμματα, ἔλεγχον, λόγον, ἀδελφότητα, ἑρμηνείαν',
             spa: 'Significa la educación, las letras, la refutación, la razón, la fraternidad, la interpretación.', cite: 'Val. I.1, p. 4.4' },
};

const HOURS_TITLE: Record<string, string> = {
  rome:      'Horae Planetarvm',
  hellas:    'Ὧραι τῶν Πλανητῶν',
  zhongguo:  '七曜',
};

// ── Zhongguo: the seven luminaries of the 宿曜经 ─────────────────────────
// T1299 juan 2, 七曜直日曆品 (docs/research/hours-and-planets-sources.md §6): the
// luminary (日曜 … 土曜) and its day names in Sogdian (胡名), Persian (波斯名) and
// Indian (天竺名). The foreign names are transliterations, kept in the traditional
// characters of the source.
interface Luminary { yao: string; es: string; hu: string; bosi: string; tianzhu: string; }
const ZH_LUMINARIES: Record<PlanetKey, Luminary> = {
  Sun:     { yao: '日曜', es: 'Sol',      hu: '蜜',   bosi: '曜森勿',   tianzhu: '阿儞底耶' },
  Moon:    { yao: '月曜', es: 'Luna',     hu: '莫',   bosi: '婁禍森勿', tianzhu: '蘇摩' },
  Mars:    { yao: '火曜', es: 'Marte',    hu: '雲漢', bosi: '勢森勿',   tianzhu: '盎哦囉迦' },
  Mercury: { yao: '水曜', es: 'Mercurio', hu: '咥',   bosi: '掣森勿',   tianzhu: '部陀' },
  Jupiter: { yao: '木曜', es: 'Júpiter',  hu: '鶻勿', bosi: '本森勿',   tianzhu: '勿哩訶娑跛底' },
  Venus:   { yao: '金曜', es: 'Venus',    hu: '那歇', bosi: '數森勿',   tianzhu: '戌羯羅' },
  Saturn:  { yao: '土曜', es: 'Saturno',  hu: '枳院', bosi: '翕森勿',   tianzhu: '賒乃以室折囉' },
};

// Plain-Spanish guide to the panel, opened with "¿Cómo leer este panel?".
const ZH_HELP: { term: string; text: string }[] = [
  { term: '七曜 · los siete astros', text: 'El Sol, la Luna y los cinco planetas visibles a simple vista. Los planetas llevan el nombre de un elemento (火 fuego, 水 agua, 木 madera, 金 metal, 土 tierra) y un nombre astronómico antiguo (荧惑, 辰星, 岁星, 太白, 镇星).' },
  { term: 'Horas planetarias', text: 'Desde la salida del sol, el día se divide en 12 horas de día y 12 de noche. Son horas desiguales: su duración cambia con las estaciones. Cada hora está regida por un astro, en un orden fijo: Saturno, Júpiter, Marte, Sol, Venus, Mercurio, Luna, y vuelta a empezar.' },
  { term: 'El astro del día', text: 'El astro de la primera hora da nombre a todo el día. Así nace la semana de siete días que aún usamos: domingo es el día del Sol, lunes el de la Luna, martes el de Marte…' },
  { term: 'Un sistema importado', text: 'No es un invento chino sino helenístico. Llegó a la China Tang en el año 759 con el 宿曜经 (Xiuyao jing), traducido por el monje 不空 (Amoghavajra), que da también los nombres sogdianos, persas e indios de cada día.' },
  { term: '时辰 · la hora china', text: 'La hora tradicional china era el 时辰, una doble hora de duración fija ligada a los doce animales. Es la que muestra el reloj de arriba.' },
];

// ── Parapegma data ────────────────────────────────────────────────────

interface StarDef {
  id: string;
  lat: string;
  grk: string;
  starSpa: string;       // Spanish star name
  // Target Sun longitude (degrees) at the event, derived from Columella De Re Rustica 11.2.
  // -1 means the event is not clearly attested and is skipped.
  riseLon: number;
  setLon: number;
  riseVerb: { rome: string; hellas: string };
  setVerb:  { rome: string; hellas: string };
  riseVerbSpa: string;
  setVerbSpa: string;
  riseNote: { rome: string; hellas: string };
  setNote:  { rome: string; hellas: string };
  riseNoteSpa: string;
  setNoteSpa: string;
}

// Sun longitudes derived from Columella's calendar dates: sunLon ≈ (dayOfYear − 79) mod 360,
// where day 79 = spring equinox (Mar 20). Verbs and notes follow Columella's exact Latin.
const STARS: StarDef[] = [
  // Vergiliae (Pleiades): celantur Apr 6 → sun 17°; exoriuntur mane May 7 → sun 48°
  { id: 'vergiliae', lat: 'Vergiliae', grk: 'Πλειάδες', starSpa: 'las Pléyades',
    riseLon: 48,  setLon: 17,
    riseVerb: { rome: 'exoriuntur mane', hellas: 'ἐπιτέλλουσιν' },
    setVerb:  { rome: 'celantur',        hellas: 'δύνουσιν' },
    riseVerbSpa: 'salen al alba',   setVerbSpa: 'se ocultan',
    riseNote: { rome: 'Favonius',        hellas: 'Ζέφυρος' },
    setNote:  { rome: 'interdum hiemat', hellas: 'ἐνίοτε χειμάζει' },
    riseNoteSpa: 'Favonio',         setNoteSpa: 'a veces hay temporal',
  },
  // Suculae (Hyades): celantur Apr 13 → sun 24°; exoriuntur May 21 → sun 62°
  { id: 'suculae', lat: 'Suculae', grk: 'Ὑάδες', starSpa: 'las Híades',
    riseLon: 62,  setLon: 24,
    riseVerb: { rome: 'exoriuntur',  hellas: 'ἐπιτέλλουσιν' },
    setVerb:  { rome: 'celantur',    hellas: 'δύνουσιν' },
    riseVerbSpa: 'salen',           setVerbSpa: 'se ocultan',
    riseNote: { rome: 'septentrionales venti', hellas: 'βόρειοι ἄνεμοι' },
    setNote:  { rome: 'hiemat',               hellas: 'χειμάζει' },
    riseNoteSpa: 'vientos septentrionales',   setNoteSpa: 'hay temporal',
  },
  // Canicula (Sirius): se celat Apr 30 → sun 41°; apparet Jul 26 → sun 128°
  { id: 'canicula', lat: 'Canicula', grk: 'Κύων', starSpa: 'Sirio',
    riseLon: 128, setLon: 41,
    riseVerb: { rome: 'apparet',  hellas: 'φαίνεται' },
    setVerb:  { rome: 'celatur',  hellas: 'κρύπτεται' },
    riseVerbSpa: 'aparece',         setVerbSpa: 'se oculta',
    riseNote: { rome: 'caligo aestuosa',        hellas: 'καῦμα ἀχλυῶδες' },
    setNote:  { rome: 'tempestatem significat', hellas: 'χειμῶνα σημαίνει' },
    riseNoteSpa: 'calor brumoso',   setNoteSpa: 'anuncia tormenta',
  },
  // Corona: occidit mane Jul 4 → sun 106°; exoriri incipit Oct 5 → sun 199°
  { id: 'corona', lat: 'Corona', grk: 'Στέφανος', starSpa: 'la Corona',
    riseLon: 199, setLon: 106,
    riseVerb: { rome: 'exoriri incipit',  hellas: 'ἄρχεται ἐπιτέλλειν' },
    setVerb:  { rome: 'mane occidit',     hellas: 'δύνει' },
    riseVerbSpa: 'empieza a salir', setVerbSpa: 'se pone al alba',
    riseNote: { rome: 'tempestatem significat', hellas: 'χειμῶνα σημαίνει' },
    setNote:  { rome: '',  hellas: '' },
    riseNoteSpa: 'anuncia tormenta',        setNoteSpa: '',
  },
  // Arcturus: mane occidit May 22 → sun 63°; exoritur Sep 5 → sun 169°
  { id: 'arcturus', lat: 'Arcturus', grk: 'Ἀρκτοῦρος', starSpa: 'Arturo',
    riseLon: 169, setLon: 63,
    riseVerb: { rome: 'exoritur',     hellas: 'ἐπιτέλλει' },
    setVerb:  { rome: 'mane occidit', hellas: 'δύνει' },
    riseVerbSpa: 'sale',            setVerbSpa: 'se pone al alba',
    riseNote: { rome: 'Favonius vel Corus',     hellas: 'Ζέφυρος ἢ Κόρος' },
    setNote:  { rome: 'tempestatem significat', hellas: 'χειμῶνα σημαίνει' },
    riseNoteSpa: 'Favonio o Coro',  setNoteSpa: 'anuncia tormenta',
  },
  // Vindemitor (Vindemiator): exoritur mane Aug 26 → sun 159°; setting not clearly attested
  { id: 'vindemitor', lat: 'Vindemitor', grk: 'Προτρυγητήρ', starSpa: 'el Vendimiador',
    riseLon: 159, setLon: -1,
    riseVerb: { rome: 'mane exoritur', hellas: 'ἐπιτέλλει ἕωθεν' },
    setVerb:  { rome: 'occidit',       hellas: 'δύνει' },
    riseVerbSpa: 'sale al alba',    setVerbSpa: 'se pone',
    riseNote: { rome: 'interdum pluvia', hellas: 'ἐνίοτε ὄμβρος' },
    setNote:  { rome: '',  hellas: '' },
    riseNoteSpa: 'a veces lluvia',  setNoteSpa: '',
  },
  // Haedi (Kids): exoriuntur Sep 27 → sun 191°; setting not clearly attested
  { id: 'haedi', lat: 'Haedi', grk: 'Ἔριφοι', starSpa: 'los Cabritos',
    riseLon: 191, setLon: -1,
    riseVerb: { rome: 'exoriuntur',  hellas: 'ἐπιτέλλουσιν' },
    setVerb:  { rome: 'occidunt',    hellas: 'δύνουσιν' },
    riseVerbSpa: 'salen',           setVerbSpa: 'se ponen',
    riseNote: { rome: 'nonnumquam Auster cum pluvia', hellas: 'ἐνίοτε Νότος μετ᾽ ὄμβρου' },
    setNote:  { rome: '',  hellas: '' },
    riseNoteSpa: 'a veces Austro con lluvia',          setNoteSpa: '',
  },
  // Fidicula (Vega/Lyra): mane occidit Aug 13 → sun 146°; mane exoritur Nov 16 → sun 241°
  { id: 'fidicula', lat: 'Fidicula', grk: 'Λύρα', starSpa: 'la Lira',
    riseLon: 241, setLon: 146,
    riseVerb: { rome: 'mane exoritur', hellas: 'ἐπιτέλλει ἕωθεν' },
    setVerb:  { rome: 'mane occidit',  hellas: 'δύνει' },
    riseVerbSpa: 'sale al alba',    setVerbSpa: 'se pone al alba',
    riseNote: { rome: 'Auster, interdum Aquilo', hellas: 'Νότος, ἐνίοτε Βορέας' },
    setNote:  { rome: 'autumnus incipit',        hellas: 'φθινόπωρον ἄρχεται' },
    riseNoteSpa: 'Austro, a veces Aquilón',      setNoteSpa: 'comienza el otoño',
  },
  // Aquila: mane oritur Dec 7 → sun 262°; setting not clearly attested with "mane"
  { id: 'aquila', lat: 'Aquila', grk: 'Ἀετός', starSpa: 'el Águila',
    riseLon: 262, setLon: -1,
    riseVerb: { rome: 'mane oritur', hellas: 'ἐπιτέλλει ἕωθεν' },
    setVerb:  { rome: 'occidit',     hellas: 'δύνει' },
    riseVerbSpa: 'sale al alba',    setVerbSpa: 'se pone',
    riseNote: { rome: 'Africus, interdum Auster', hellas: 'Λίψ, ἐνίοτε Νότος' },
    setNote:  { rome: '',  hellas: '' },
    riseNoteSpa: 'Africus, a veces Austro',        setNoteSpa: '',
  },
  // Delphinus: vespere exoritur Jun 10 → sun 82°; occasus Aug 15 → sun 148°
  { id: 'delphinus', lat: 'Delphinus', grk: 'Δελφίς', starSpa: 'el Delfín',
    riseLon: 82,  setLon: 148,
    riseVerb: { rome: 'vespere exoritur', hellas: 'ἑσπέρας ἐπιτέλλει' },
    setVerb:  { rome: 'occidit',          hellas: 'δύνει' },
    riseVerbSpa: 'sale al atardecer', setVerbSpa: 'se pone',
    riseNote: { rome: 'Favonius, interdum rorat', hellas: 'Ζέφυρος, ἐνίοτε ψεκάδες' },
    setNote:  { rome: 'tempestatem significat',   hellas: 'χειμῶνα σημαίνει' },
    riseNoteSpa: 'Favonio, a veces llovizna',      setNoteSpa: 'anuncia tormenta',
  },
];

interface SolarMarker {
  lon: number;
  rome: { main: string; sub?: string };
  hellas: { main: string; sub?: string };
  spa: { main: string; sub?: string };
}

const SOLAR_MARKERS: SolarMarker[] = [
  { lon:   0, rome: { main: 'Aequinoctium vernum',      sub: 'Sol Arietem ingreditur' },     hellas: { main: 'Ἰσημερία ἐαρινή',          sub: 'Ἥλιος εἰς Κριόν' },        spa: { main: 'Equinoccio de primavera',  sub: 'El Sol entra en Aries' } },
  { lon:  30, rome: { main: 'Sol Taurum ingreditur' },                                        hellas: { main: 'Ἥλιος εἰς Ταῦρον' },                                          spa: { main: 'El Sol entra en Tauro' } },
  { lon:  60, rome: { main: 'Sol Geminos ingreditur' },                                       hellas: { main: 'Ἥλιος εἰς Διδύμους' },                                         spa: { main: 'El Sol entra en Géminis' } },
  { lon:  90, rome: { main: 'Solstitium aestivum',      sub: 'Sol Cancrum ingreditur' },      hellas: { main: 'Θερινὴ τροπή',             sub: 'Ἥλιος εἰς Καρκίνον' },      spa: { main: 'Solsticio de verano',      sub: 'El Sol entra en Cáncer' } },
  { lon: 120, rome: { main: 'Sol Leonem ingreditur' },                                        hellas: { main: 'Ἥλιος εἰς Λέοντα' },                                           spa: { main: 'El Sol entra en Leo' } },
  { lon: 150, rome: { main: 'Sol Virginem ingreditur' },                                      hellas: { main: 'Ἥλιος εἰς Παρθένον' },                                         spa: { main: 'El Sol entra en Virgo' } },
  { lon: 180, rome: { main: 'Aequinoctium autumnale',   sub: 'Sol Libram ingreditur' },       hellas: { main: 'Ἰσημερία φθινοπωρινή',     sub: 'Ἥλιος εἰς Ζυγόν' },        spa: { main: 'Equinoccio de otoño',      sub: 'El Sol entra en Libra' } },
  { lon: 210, rome: { main: 'Sol Scorpium ingreditur' },                                      hellas: { main: 'Ἥλιος εἰς Σκορπίον' },                                         spa: { main: 'El Sol entra en Escorpio' } },
  { lon: 240, rome: { main: 'Sol Sagittarium ingreditur' },                                   hellas: { main: 'Ἥλιος εἰς Τοξότην' },                                          spa: { main: 'El Sol entra en Sagitario' } },
  { lon: 270, rome: { main: 'Bruma',                    sub: 'Sol Capricornum ingreditur' },  hellas: { main: 'Χειμερινὴ τροπή',          sub: 'Ἥλιος εἰς Αἰγόκερων' },    spa: { main: 'Solsticio de invierno',    sub: 'El Sol entra en Capricornio' } },
  { lon: 300, rome: { main: 'Sol Aquarium ingreditur' },                                      hellas: { main: 'Ἥλιος εἰς Ὑδροχόον' },                                         spa: { main: 'El Sol entra en Acuario' } },
  { lon: 330, rome: { main: 'Sol Pisces ingreditur' },                                        hellas: { main: 'Ἥλιος εἰς Ἰχθύας' },                                           spa: { main: 'El Sol entra en Piscis' } },
];

const SUN_DEG_PER_DAY = 360 / 365.25;

function daysUntilSunAt(targetLon: number, currentSunLon: number): number {
  const diff = ((targetLon - currentSunLon) + 360) % 360;
  return Math.round(diff / SUN_DEG_PER_DAY);
}

interface ParaEvent {
  date: Date;
  days: number;
  symbol: string;
  main: string;
  mainSpa?: string;
  sub?: string;
  subSpa?: string;
  isSolar: boolean;
}

function computeParapegmaEvents(currentDate: Date, civilization: string): ParaEvent[] {
  const date = currentDate;
  const sunLon = getSolarLongitudeDeg(date);
  const civ = civilization === 'hellas' ? 'hellas' : 'rome';
  const events: ParaEvent[] = [];

  for (const star of STARS) {
    const name = civ === 'hellas' ? star.grk : star.lat;

    if (star.riseLon >= 0) {
      const days = daysUntilSunAt(star.riseLon, sunLon);
      if (days > 0) {
        events.push({
          date: new Date(date.getTime() + days * 86400000),
          days,
          symbol: '✦',
          main: `${name} ${star.riseVerb[civ]}`,
          mainSpa: `${star.starSpa} ${star.riseVerbSpa}`,
          sub: star.riseNote[civ] || undefined,
          subSpa: star.riseNoteSpa || undefined,
          isSolar: false,
        });
      }
    }

    if (star.setLon >= 0) {
      const days = daysUntilSunAt(star.setLon, sunLon);
      if (days > 0) {
        events.push({
          date: new Date(date.getTime() + days * 86400000),
          days,
          symbol: '✦',
          main: `${name} ${star.setVerb[civ]}`,
          mainSpa: `${star.starSpa} ${star.setVerbSpa}`,
          sub: star.setNote[civ] || undefined,
          subSpa: star.setNoteSpa || undefined,
          isSolar: false,
        });
      }
    }
  }

  for (const marker of SOLAR_MARKERS) {
    const days = daysUntilSunAt(marker.lon, sunLon);
    if (days > 0) {
      const label = marker[civ];
      events.push({
        date: new Date(currentDate.getTime() + days * 86400000),
        days,
        symbol: '⊙',
        main: label.main,
        mainSpa: marker.spa.main,
        sub: label.sub,
        subSpa: marker.spa.sub,
        isSolar: true,
      });
    }
  }

  return events
    .filter(e => e.days > 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);
}

// ── Component ─────────────────────────────────────────────────────────

interface HourSlot {
  num: number;
  isDay: boolean;
  start: Date;
  end: Date;
  rulerKey: PlanetKey;
}

interface Props {
  currentDate: Date;
  lat: number;
  lng: number;
}

/** The 24 planetary hours of the day opened by `sunrise`. */
function buildPlanetaryDay(sunrise: Date, sunset: Date, nextSunrise: Date, lng: number): HourSlot[] {
  const dayHourMs   = (sunset.getTime() - sunrise.getTime()) / 12;
  const nightHourMs = (nextSunrise.getTime() - sunset.getTime()) / 12;
  const slots: HourSlot[] = [];
  for (let i = 0; i < 12; i++) {
    const start = new Date(sunrise.getTime() + i * dayHourMs);
    slots.push({ num: i + 1, isDay: true, start, end: new Date(start.getTime() + dayHourMs),
      rulerKey: LATIN_TO_KEY[getPlanetaryRuler(i + 1, true, sunrise, lng)] ?? 'Sun' });
  }
  for (let i = 0; i < 12; i++) {
    const start = new Date(sunset.getTime() + i * nightHourMs);
    slots.push({ num: i + 1, isDay: false, start, end: new Date(start.getTime() + nightHourMs),
      rulerKey: LATIN_TO_KEY[getPlanetaryRuler(i + 1, false, sunrise, lng)] ?? 'Moon' });
  }
  return slots;
}

const UI: Record<string, { dayLen: string; nightLen: string }> = {
  rome:     { dayLen: 'Hora diurna', nightLen: 'Hora nocturna' },
  hellas:   { dayLen: 'Ἡμερινὴ ὥρα', nightLen: 'Νυκτερινὴ ὥρα' },
  zhongguo: { dayLen: '昼时', nightLen: '夜时' },
};

const QUALITY_CLASS = {
  B: 'text-emerald-300 border-emerald-400/40',
  C: 'text-parchment/80 border-parchment/30',
  N: 'text-rose-300 border-rose-400/40',
} as const;

const PlanetaryPositions: React.FC<Props> = ({ currentDate, lat, lng }) => {
  const { civilization } = useCivilization();
  const [showHelp, setShowHelp] = useState(false);

  // ── Planetary hours ──────────────────────────────────────────────
  // The current planetary day (sunrise → next sunrise) plus the next one, so the
  // list can run on past the next sunrise instead of wrapping back into hours that
  // are already over.
  const { today, upcoming, currentIdx } = useMemo<{ today: HourSlot[]; upcoming: HourSlot[]; currentIdx: number }>(() => {
    try {
      const msPerDay = 86400000;
      const ySun  = getSunTimes(new Date(currentDate.getTime() - msPerDay), lat, lng);
      const tSun  = getSunTimes(currentDate, lat, lng);
      const tmSun = getSunTimes(new Date(currentDate.getTime() + msPerDay), lat, lng);

      const [rise, set, nextRise, nextSet, nextNextRise] = currentDate >= tSun.sunrise
        ? [tSun.sunrise, tSun.sunset, tmSun.sunrise, tmSun.sunset,
           getSunTimes(new Date(currentDate.getTime() + 2 * msPerDay), lat, lng).sunrise]
        : [ySun.sunrise, ySun.sunset, tSun.sunrise, tSun.sunset, tmSun.sunrise];

      const today = buildPlanetaryDay(rise, set, nextRise, lng);
      const upcoming = [...today, ...buildPlanetaryDay(nextRise, nextSet, nextNextRise, lng)];
      const idx = today.findIndex(h => currentDate >= h.start && currentDate < h.end);
      return { today, upcoming, currentIdx: Math.max(idx, 0) };
    } catch {
      return { today: [], upcoming: [], currentIdx: 0 };
    }
  }, [Math.floor(currentDate.getTime() / 60000), lat, lng]);

  // ── Parapegma ────────────────────────────────────────────────────
  const paraEvents = useMemo<ParaEvent[]>(() => {
    if (civilization !== 'rome' && civilization !== 'hellas') return [];
    try {
      return computeParapegmaEvents(currentDate, civilization);
    } catch {
      return [];
    }
  }, [Math.floor(currentDate.getTime() / 86400000), civilization]);

  const names      = CIV_NAMES[civilization] ?? CIV_NAMES.rome;
  const hoursTitle = HOURS_TITLE[civilization] ?? 'Horae';
  const paraTitle  = civilization === 'hellas' ? 'Παραπήγμα' : 'Parapegma';
  const ui         = UI[civilization] ?? UI.rome;

  // The current hour and the next three.
  const visibleSlots = upcoming.slice(currentIdx, currentIdx + 4);
  const current      = today[currentIdx];
  const progress     = current
    ? Math.min(1, Math.max(0, (currentDate.getTime() - current.start.getTime()) / (current.end.getTime() - current.start.getTime())))
    : 0;
  const minutesOf = (s?: HourSlot) => s ? Math.round((s.end.getTime() - s.start.getTime()) / 60000) : 0;
  const dayHourMin   = minutesOf(today[0]);
  const nightHourMin = minutesOf(today[12]);

  const dayWord = (days: number, civ: string) => {
    if (days === 0) return civ === 'hellas' ? 'σήμερον' : 'hodie';
    if (days === 1) return civ === 'hellas' ? 'αὔριον'  : 'cras';
    return civ === 'hellas' ? `μεθ' ${days} ἡμ.` : `in ${days} d.`;
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-2 flex flex-col gap-4">

      {/* ── Parapegma ────────────────────────────────────────────── */}
      {(civilization === 'rome' || civilization === 'hellas') && (
        <div className="bg-ink/90 border border-gold-dim/25 rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gold-dim/20" />
            <span className="text-gold-dim text-xs uppercase tracking-[0.3em] font-serif">{paraTitle}</span>
            <div className="h-px flex-1 bg-gold-dim/20" />
          </div>
          <div className="flex flex-col gap-1">
            {paraEvents.map((ev) => (
              <div key={`${ev.main}-${ev.days}`} className="flex items-baseline gap-2 px-1 py-0.5">
                <span className="text-gold-dim/80 font-serif text-xs w-20 shrink-0 tabular-nums">
                  {dayWord(ev.days, civilization)}
                </span>
                <span className={`text-base leading-none shrink-0 ${ev.isSolar ? 'text-amber-400/80' : 'text-gold-dim/60'}`}>
                  {ev.symbol}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-parchment/90 font-serif text-xs leading-snug">{ev.main}</span>
                  {ev.mainSpa && (
                    <span className="text-parchment/65 text-xs leading-tight italic">{ev.mainSpa}</span>
                  )}
                  {ev.sub && (
                    <span className="text-gold-dim/80 font-serif text-xs leading-tight mt-0.5">
                      {ev.sub}
                      {ev.subSpa && <span className="text-gold-dim/65 italic"> · {ev.subSpa}</span>}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 七曜 (Zhongguo) ───────────────────────────────────────── */}
      {civilization === 'zhongguo' && (
        <div className="bg-ink/90 border border-gold-dim/25 rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="h-px flex-1 bg-gold-dim/20" />
            <span className="flex flex-col items-center leading-tight">
              <span className="text-gold-dim text-base tracking-[0.3em] font-serif">{hoursTitle}</span>
              <span className="text-xs italic text-parchment/60">Los siete astros</span>
            </span>
            <div className="h-px flex-1 bg-gold-dim/20" />
          </div>
          <p className="text-center text-xs leading-snug text-parchment/70 mt-1 px-2">
            七曜由《宿曜经》(759) 传入唐代中国
            <span className="block italic text-parchment/55">
              Cada hora la rige uno de los siete astros. Este sistema llegó a la China Tang con el Xiuyao jing (759 d.C.).
            </span>
          </p>
          <div className="mt-2 mb-3 text-center">
            <button
              type="button"
              onClick={() => setShowHelp(v => !v)}
              aria-expanded={showHelp}
              className="text-xs font-serif text-gold-dim underline underline-offset-2 hover:text-gold-leaf"
            >
              {showHelp ? 'Cerrar explicación' : '¿Cómo leer este panel?'}
            </button>
          </div>
          {showHelp && (
            <dl className="mb-3 px-3 py-2 rounded-lg bg-parchment/5 border border-gold-dim/20 flex flex-col gap-2">
              {ZH_HELP.map(h => (
                <div key={h.term}>
                  <dt className="font-serif text-sm text-gold-dim">{h.term}</dt>
                  <dd className="text-xs text-parchment/80 leading-snug">{h.text}</dd>
                </div>
              ))}
            </dl>
          )}

          {today.length > 0 && (() => {
            const dayKey = today[0].rulerKey;
            const lum = ZH_LUMINARIES[dayKey];
            return (<>
              {/* The day and its ruler */}
              <h3 className="mb-1.5 text-xs uppercase tracking-[0.2em] text-parchment/60 font-serif">El día de hoy</h3>
              <div className="mb-4 px-3 py-2.5 rounded-lg bg-gold-leaf/10 border border-gold-leaf/30 flex items-center gap-3">
                <span className="text-2xl leading-none text-gold-leaf">{SYMBOLS[dayKey]}</span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-serif text-lg text-parchment leading-snug">
                    {lum.yao}日 <span className="text-gold-dim text-sm">· {names[dayKey]}</span>
                  </span>
                  <span className="text-xs italic text-parchment/70">{dayKey === 'Sun' ? 'Día del Sol' : dayKey === 'Moon' ? 'Día de la Luna' : `Día de ${lum.es}`}</span>
                  <span className="mt-1 text-xs text-parchment/60 leading-snug">
                    胡名 <span className="text-parchment/85">{lum.hu}</span> · 波斯名 <span className="text-parchment/85">{lum.bosi}</span> · 天竺名 <span className="text-parchment/85">{lum.tianzhu}</span>
                  </span>
                  <span className="text-xs italic text-parchment/50 leading-tight">nombre sogdiano · persa · indio del día (宿曜经)</span>
                </div>
              </div>

              {/* Hour lengths */}
              <h3 className="mb-1.5 text-xs uppercase tracking-[0.2em] text-parchment/60 font-serif">Las horas</h3>
              <div className="grid grid-cols-2 gap-2 mb-2 text-center">
                <div className="px-2 py-1.5 rounded-lg border border-gold-dim/20">
                  <span className="block font-serif text-sm text-parchment"><span className="text-amber-400">☀</span> {ui.dayLen} {dayHourMin} min</span>
                  <span className="block text-xs italic text-parchment/60">duración de una hora de día</span>
                </div>
                <div className="px-2 py-1.5 rounded-lg border border-gold-dim/20">
                  <span className="block font-serif text-sm text-parchment"><span className="text-sky-400">☽</span> {ui.nightLen} {nightHourMin} min</span>
                  <span className="block text-xs italic text-parchment/60">duración de una hora de noche</span>
                </div>
              </div>
            </>);
          })()}

          {/* Current hour and the next three */}
          <div className="flex flex-col gap-1">
            {visibleSlots.map((h, i) => {
              if (!h) return null;
              const isCurrent = h === current;
              const lum = ZH_LUMINARIES[h.rulerKey];
              const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              return (
                <div
                  key={`${h.start.getTime()}-${i}`}
                  className={`flex flex-col px-2 py-2 rounded-lg ${
                    isCurrent ? 'bg-gold-leaf/10 border border-gold-leaf/30' : 'border border-gold-dim/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xl leading-none w-6 text-center ${isCurrent ? 'text-gold-leaf' : 'text-parchment/75'}`}>
                      {SYMBOLS[h.rulerKey]}
                    </span>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className={`font-serif text-sm leading-snug ${isCurrent ? 'text-parchment' : 'text-parchment/85'}`}>
                        {lum.yao} <span className="text-gold-dim/80">· {names[h.rulerKey]}</span>
                      </span>
                      <span className="text-xs italic text-parchment/60 leading-tight">{lum.es}</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      {isCurrent && (
                        <span className="mb-0.5 px-1.5 rounded-full bg-gold-leaf/20 text-xs text-gold-leaf leading-tight">ahora</span>
                      )}
                      <span className="font-serif text-xs tabular-nums text-gold-dim">{fmt(h.start)}–{fmt(h.end)}</span>
                      <span className="text-xs text-parchment/60 leading-tight">
                        <span className={h.isDay ? 'text-amber-400' : 'text-sky-400'}>{h.isDay ? '☀' : '☽'}</span>{' '}
                        hora {h.num} {h.isDay ? 'del día' : 'de la noche'}
                      </span>
                    </div>
                  </div>
                  {isCurrent && (
                    <div className="ml-9 mt-1.5 h-1 rounded-full bg-gold-dim/15 overflow-hidden">
                      <div className="h-full bg-gold-leaf/70 rounded-full" style={{ width: `${progress * 100}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Horae Planetarum ─────────────────────────────────────── */}
      {civilization !== 'zhongguo' && (
      <div className="bg-ink/90 border border-gold-dim/25 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-px flex-1 bg-gold-dim/20" />
          <span className="text-gold-dim text-xs uppercase tracking-[0.3em] font-serif">{hoursTitle}</span>
          <div className="h-px flex-1 bg-gold-dim/20" />
        </div>

        {today.length > 0 && (
          <div className="flex justify-center gap-4 mb-3 text-xs font-serif tabular-nums text-gold-dim/80">
            <span><span className="text-amber-400">☀</span> {ui.dayLen} {dayHourMin}′</span>
            <span><span className="text-sky-400">☽</span> {ui.nightLen} {nightHourMin}′</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {visibleSlots.map((h, i) => {
            if (!h) return null;
            const isCurrent = h === current;
            const planet    = names[h.rulerKey];
            const sym       = SYMBOLS[h.rulerKey];
            const timeStr   = h.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const chrono    = civilization === 'rome' ? CHRONOGRAPH_HOURS[h.rulerKey] : undefined;
            const valens    = civilization === 'hellas' ? VALENS[h.rulerKey] : undefined;
            const starName  = civilization === 'hellas' ? GREEK_STAR_NAMES[h.rulerKey] : undefined;
            const civic     = civilization === 'rome'
              ? (h.isDay ? CIVIC_DAY_HOURS : CIVIC_NIGHT_HOURS)[h.num - 1]
              : undefined;
            const vigilia   = civilization === 'rome' && !h.isDay ? vigiliaOf(h.num) : undefined;
            return (
              <div
                key={`${h.start.getTime()}-${i}`}
                className={`flex flex-col px-2 py-2 rounded-lg ${
                  isCurrent ? 'bg-gold-leaf/10 border border-gold-leaf/30' : 'border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`text-xs w-4 text-center mt-0.5 ${h.isDay ? 'text-amber-400' : 'text-sky-400'}`}>
                    {h.isDay ? '☀' : '☽'}
                  </span>
                  <span className={`font-serif text-xs w-7 text-right tabular-nums mt-0.5 ${isCurrent ? 'text-gold-leaf' : 'text-gold-dim/80'}`}>
                    {toRomanNumeral(h.num)}
                  </span>
                  <span className={`text-base leading-none w-5 text-center mt-0.5 ${isCurrent ? 'text-gold-leaf' : 'text-parchment/80'}`}>
                    {sym}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                    <span className={`font-serif text-xs leading-snug ${isCurrent ? 'text-parchment' : 'text-parchment/80'}`}>
                      {planet}
                      {starName && <span className="text-gold-dim/70"> · {starName}</span>}
                    </span>
                    {isCurrent && chrono && (<>
                      <span className="font-serif text-xs italic leading-snug text-gold-dim">{chrono.latin}</span>
                      <span className="text-xs leading-snug text-parchment/90">{chrono.spa}</span>
                      <span className="font-serif text-xs italic leading-snug text-gold-dim/80 mt-1">{chrono.omens.latin}</span>
                      <span className="text-xs leading-snug text-parchment/75">{chrono.omens.spa}</span>
                      <span className="text-xs leading-tight text-parchment/50 italic">Chronographus a. 354</span>
                    </>)}
                    {isCurrent && valens && (<>
                      <span className="font-serif text-xs italic leading-snug text-gold-dim">{valens.classical}</span>
                      <span className="text-xs leading-snug text-parchment/90">{valens.spa}</span>
                      <span className="text-xs leading-tight text-parchment/50 italic">{valens.cite}</span>
                    </>)}
                    {isCurrent && civic && (
                      <span className="mt-1 pt-1 border-t border-gold-dim/15 flex flex-col gap-0.5">
                        <span className="font-serif text-xs italic leading-snug text-gold-dim">
                          {civic.latin}
                          {vigilia && <span className="not-italic text-gold-dim/70"> · {vigilia.lat}</span>}
                        </span>
                        <span className="text-xs leading-snug text-parchment/80">
                          {civic.spa}
                          {vigilia && <span className="text-parchment/60"> · {vigilia.spa}</span>}
                        </span>
                        <span className="text-xs leading-tight text-parchment/50 italic">
                          {civic.source}{vigilia ? ' · Veg. 3.8' : ''}
                        </span>
                      </span>
                    )}
                  </div>
                  {chrono && (
                    <span
                      title={`${QUALITY_LABEL[chrono.quality].lat} · ${QUALITY_LABEL[chrono.quality].spa}`}
                      className={`font-serif text-xs w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center rounded border ${QUALITY_CLASS[chrono.quality]}`}
                    >
                      {chrono.quality}
                    </span>
                  )}
                  <span className={`font-serif text-xs tabular-nums shrink-0 mt-0.5 ${isCurrent ? 'text-gold-dim' : 'text-gold-dim/70'}`}>
                    {timeStr}
                  </span>
                </div>
                {isCurrent && chrono && (
                  <span className="ml-[4.75rem] mt-1 text-xs font-serif text-parchment/60">
                    Hora {QUALITY_LABEL[chrono.quality].lat} · <span className="italic">hora {QUALITY_LABEL[chrono.quality].spa}</span>
                  </span>
                )}
                {isCurrent && (
                  <div className="ml-[4.75rem] mt-1.5 h-1 rounded-full bg-gold-dim/15 overflow-hidden">
                    <div className="h-full bg-gold-leaf/70 rounded-full" style={{ width: `${progress * 100}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
      )}
    </div>
  );
};

function toRomanNumeral(n: number): string {
  const map: [string, number][] = [
    ['XII',12],['XI',11],['X',10],['IX',9],['VIII',8],['VII',7],
    ['VI',6],['V',5],['IV',4],['III',3],['II',2],['I',1],
  ];
  for (const [s, v] of map) if (n === v) return s;
  return String(n);
}

export default PlanetaryPositions;

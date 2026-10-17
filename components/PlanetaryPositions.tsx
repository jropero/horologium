
import React, { useMemo } from 'react';
import { useCivilization } from '../contexts/CivilizationContext';
import { getSunTimes, getSolarLongitudeDeg } from '../utils/solar';
import { getPlanetaryRuler } from '../utils/romanTimeUtils';

type PlanetKey = 'Moon' | 'Mercury' | 'Venus' | 'Sun' | 'Mars' | 'Jupiter' | 'Saturn';

const SYMBOLS: Record<PlanetKey, string> = {
  Moon: '☽', Mercury: '☿', Venus: '♀', Sun: '☀', Mars: '♂', Jupiter: '♃', Saturn: '♄',
};

const CIV_NAMES: Record<string, Record<PlanetKey, string>> = {
  rome:      { Moon: 'Luna',    Mercury: 'Mercurius', Venus: 'Venus',     Sun: 'Sol',    Mars: 'Mars',   Jupiter: 'Iuppiter', Saturn: 'Saturnus' },
  hellas:    { Moon: 'Σελήνη', Mercury: 'Ἑρμῆς',    Venus: 'Ἀφροδίτη', Sun: 'Ἥλιος', Mars: 'Ἄρης',  Jupiter: 'Ζεύς',     Saturn: 'Κρόνος'   },
  aegyptus:  { Moon: 'Iah',     Mercury: 'Djehuty',   Venus: 'Nit',       Sun: 'Ra',     Mars: 'Hor',    Jupiter: 'Amun',     Saturn: 'Sobek'    },
  babylonia: { Moon: 'Sin',     Mercury: 'Nabû',      Venus: 'Ištar',     Sun: 'Šamaš',  Mars: 'Nergal', Jupiter: 'Marduk',   Saturn: 'Ninurta'  },
  zhongguo:  { Moon: '太阴',    Mercury: '辰星',      Venus: '太白',      Sun: '太阳',   Mars: '荧惑',   Jupiter: '岁星',     Saturn: '镇星'     },
};

const LATIN_TO_KEY: Record<string, PlanetKey> = {
  Saturnus: 'Saturn', Iuppiter: 'Jupiter', Mars: 'Mars',
  Sol: 'Sun', Venus: 'Venus', Mercurius: 'Mercury', Luna: 'Moon',
};

const HOURS_TITLE: Record<string, string> = {
  rome:      'Horae Planetarvm',
  hellas:    'Ὧραι τῶν Πλανητῶν',
  aegyptus:  'Usewet Netjeru',
  babylonia: 'Ūmū Kayyāmānu',
  zhongguo:  '時辰七曜',
};

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
  rulerKey: PlanetKey;
}

interface Props {
  currentDate: Date;
  lat: number;
  lng: number;
}

const PlanetaryPositions: React.FC<Props> = ({ currentDate, lat, lng }) => {
  const { civilization } = useCivilization();

  // ── Planetary hours ──────────────────────────────────────────────
  const { slots, currentIdx } = useMemo<{ slots: HourSlot[]; currentIdx: number }>(() => {
    try {
      const msPerDay = 86400000;
      const yesterday = new Date(currentDate.getTime() - msPerDay);
      const tomorrow  = new Date(currentDate.getTime() + msPerDay);

      const ySun  = getSunTimes(yesterday, lat, lng);
      const tSun  = getSunTimes(currentDate, lat, lng);
      const tmSun = getSunTimes(tomorrow, lat, lng);

      let dayStart: Date, daySunset: Date, dayEnd: Date;
      if (currentDate >= tSun.sunrise) {
        dayStart = tSun.sunrise; daySunset = tSun.sunset; dayEnd = tmSun.sunrise;
      } else {
        dayStart = ySun.sunrise; daySunset = ySun.sunset; dayEnd = tSun.sunrise;
      }

      const dayHourMs   = (daySunset.getTime() - dayStart.getTime())  / 12;
      const nightHourMs = (dayEnd.getTime()    - daySunset.getTime()) / 12;

      const slots: HourSlot[] = [];
      for (let i = 0; i < 12; i++) {
        const start = new Date(dayStart.getTime() + i * dayHourMs);
        slots.push({ num: i + 1, isDay: true,  start, rulerKey: LATIN_TO_KEY[getPlanetaryRuler(i + 1, true,  dayStart, lng)] ?? 'Sun'  });
      }
      for (let i = 0; i < 12; i++) {
        const start = new Date(daySunset.getTime() + i * nightHourMs);
        slots.push({ num: i + 1, isDay: false, start, rulerKey: LATIN_TO_KEY[getPlanetaryRuler(i + 1, false, dayStart, lng)] ?? 'Moon' });
      }

      const idx = slots.findIndex((h, i) => {
        const next = slots[i + 1];
        return currentDate >= h.start && (!next || currentDate < next.start);
      });
      return { slots, currentIdx: Math.max(idx, 0) };
    } catch {
      return { slots: [], currentIdx: 0 };
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

  const visibleSlots = slots.length > 0
    ? Array.from({ length: 8 }, (_, i) => slots[(currentIdx + i) % 24])
    : [];

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

      {/* ── Horae Planetarum ─────────────────────────────────────── */}
      <div className="bg-ink/90 border border-gold-dim/25 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gold-dim/20" />
          <span className="text-gold-dim text-xs uppercase tracking-[0.3em] font-serif">{hoursTitle}</span>
          <div className="h-px flex-1 bg-gold-dim/20" />
        </div>

        <div className="flex flex-col gap-0.5">
          {visibleSlots.map((h, i) => {
            if (!h) return null;
            const isCurrent = i === 0;
            const planet    = names[h.rulerKey];
            const sym       = SYMBOLS[h.rulerKey];
            const timeStr   = h.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            return (
              <div
                key={`${h.isDay}-${h.num}`}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                  isCurrent ? 'bg-gold-leaf/10 border border-gold-leaf/30' : 'border border-transparent'
                }`}
              >
                <span className={`text-xs w-4 text-center ${h.isDay ? 'text-amber-400/60' : 'text-sky-400/60'}`}>
                  {h.isDay ? '☀' : '☽'}
                </span>
                <span className={`font-serif text-xs w-7 text-right tabular-nums ${isCurrent ? 'text-gold-leaf' : 'text-gold-dim/60'}`}>
                  {toRomanNumeral(h.num)}
                </span>
                <span className={`text-base leading-none w-5 text-center ${isCurrent ? 'text-gold-leaf' : 'text-parchment/60'}`}>
                  {sym}
                </span>
                <span className={`font-serif text-xs flex-1 ${isCurrent ? 'text-parchment' : 'text-parchment/60'}`}>
                  {planet}
                </span>
                <span className={`font-serif text-xs tabular-nums ${isCurrent ? 'text-gold-dim/80' : 'text-gold-dim/60'}`}>
                  {timeStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>
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

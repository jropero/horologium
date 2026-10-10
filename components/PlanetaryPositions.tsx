
import React, { useMemo } from 'react';
import { EclipticLongitude, Elongation, MoonPhase, Body } from 'astronomy-engine';
import { useCivilization } from '../contexts/CivilizationContext';

type PlanetKey = 'Moon' | 'Mercury' | 'Venus' | 'Sun' | 'Mars' | 'Jupiter' | 'Saturn';

const PLANETS: PlanetKey[] = ['Moon', 'Mercury', 'Venus', 'Sun', 'Mars', 'Jupiter', 'Saturn'];

const SYMBOLS: Record<PlanetKey, string> = {
  Moon: '☽', Mercury: '☿', Venus: '♀', Sun: '☀', Mars: '♂', Jupiter: '♃', Saturn: '♄',
};

const ASTRO_BODY: Record<PlanetKey, Body> = {
  Moon: Body.Moon, Mercury: Body.Mercury, Venus: Body.Venus, Sun: Body.Sun,
  Mars: Body.Mars, Jupiter: Body.Jupiter, Saturn: Body.Saturn,
};

const CIV_NAMES: Record<string, Record<PlanetKey, string>> = {
  rome:      { Moon: 'Luna',    Mercury: 'Mercurius', Venus: 'Venus',     Sun: 'Sol',    Mars: 'Mars',   Jupiter: 'Iuppiter', Saturn: 'Saturnus' },
  hellas:    { Moon: 'Σελήνη', Mercury: 'Ἑρμῆς',    Venus: 'Ἀφροδίτη', Sun: 'Ἥλιος', Mars: 'Ἄρης',  Jupiter: 'Ζεύς',     Saturn: 'Κρόνος'   },
  aegyptus:  { Moon: 'Iah',     Mercury: 'Djehuty',   Venus: 'Nit',       Sun: 'Ra',     Mars: 'Hor',    Jupiter: 'Amun',     Saturn: 'Sobek'    },
  babylonia: { Moon: 'Sin',     Mercury: 'Nabû',      Venus: 'Ištar',     Sun: 'Šamaš',  Mars: 'Nergal', Jupiter: 'Marduk',   Saturn: 'Ninurta'  },
  zhongguo:  { Moon: '太阴',    Mercury: '辰星',      Venus: '太白',      Sun: '太阳',   Mars: '荧惑',   Jupiter: '岁星',     Saturn: '镇星'     },
};

const ZODIAC: Record<string, string[]> = {
  rome:      ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces'],
  hellas:    ['Κριός', 'Ταῦρος', 'Δίδυμοι', 'Καρκίνος', 'Λέων', 'Παρθένος', 'Ζυγός', 'Σκορπιός', 'Τοξότης', 'Αἰγόκερως', 'Ὑδροχόος', 'Ἰχθύες'],
  aegyptus:  ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces'],
  babylonia: ['Agru', 'Alu', 'Mastabbagalgal', 'Allul', 'Urgula', 'Širu', 'Zibanitu', 'Zuqaqipu', 'Pabilsag', 'Suhurmašu', 'Gu', 'Zibbatu'],
  zhongguo:  ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'],
};

const SECTION_TITLE: Record<string, string> = {
  rome:      'Stellae Planetariae',
  hellas:    'Ἀστέρες Πλανῆται',
  aegyptus:  'Sabau Netjeru',
  babylonia: 'Kakkabu Bibbu',
  zhongguo:  '五星七曜',
};

interface PlanetData {
  planet: PlanetKey;
  name: string;
  symbol: string;
  sign: string;
  status: string;
  statusCls: string;
}

interface Props {
  currentDate: Date;
}

const PlanetaryPositions: React.FC<Props> = ({ currentDate }) => {
  const { civilization } = useCivilization();

  const planets = useMemo<PlanetData[]>(() => {
    const names = CIV_NAMES[civilization] ?? CIV_NAMES.rome;
    const zodiac = ZODIAC[civilization] ?? ZODIAC.rome;

    const getSign = (lon: number) =>
      zodiac[Math.floor(((lon % 360) + 360) % 360 / 30)];

    return PLANETS.map((planet): PlanetData => {
      const base = { planet, name: names[planet], symbol: SYMBOLS[planet] };
      try {
        if (planet === 'Moon') {
          const lon = EclipticLongitude(ASTRO_BODY.Moon, currentDate);
          const mp = MoonPhase(currentDate);
          const illum = Math.round((1 - Math.cos(mp * Math.PI / 180)) / 2 * 100);
          const waxing = mp < 180;
          const phase =
            illum < 5  ? 'Nova' :
            illum > 95 ? 'Plena' :
            waxing     ? `Cres. ${illum}%` :
                         `Men. ${illum}%`;
          const statusCls =
            illum > 90 ? 'text-yellow-200' :
            illum < 5  ? 'text-stone-500'  :
                         'text-parchment/70';
          return { ...base, sign: getSign(lon), status: phase, statusCls };
        }

        const lon = EclipticLongitude(ASTRO_BODY[planet], currentDate);

        if (planet === 'Sun') {
          return { ...base, sign: getSign(lon), status: 'Diurnus', statusCls: 'text-yellow-400' };
        }

        const elong = Elongation(ASTRO_BODY[planet], currentDate);
        const deg = Math.round(elong.elongation);
        const isOuter = planet === 'Mars' || planet === 'Jupiter' || planet === 'Saturn';

        let status: string;
        let statusCls: string;
        if (deg < 10) {
          status = 'Soli iunct.';
          statusCls = 'text-stone-500';
        } else if (isOuter && deg > 170) {
          status = `Oppositio`;
          statusCls = 'text-yellow-300';
        } else {
          const eve = elong.visibility === 'evening';
          status = `${eve ? 'Vesp.' : 'Mat.'} ${deg}°`;
          statusCls = eve ? 'text-amber-400' : 'text-sky-400';
        }

        return { ...base, sign: getSign(lon), status, statusCls };
      } catch {
        return { ...base, sign: '—', status: '—', statusCls: 'text-stone-500' };
      }
    });
  }, [currentDate, civilization]);

  const title = SECTION_TITLE[civilization] ?? 'Stellae Planetariae';

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-2 bg-ink/90 border border-gold-dim/25 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px flex-1 bg-gold-dim/20" />
        <span className="text-gold-dim text-xs uppercase tracking-[0.3em] font-serif">{title}</span>
        <div className="h-px flex-1 bg-gold-dim/20" />
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {planets.map(({ planet, name, symbol, sign, status, statusCls }) => (
          <div
            key={planet}
            className="flex flex-col items-center gap-0.5 rounded-lg border border-gold-dim/20 bg-stone-900/60 px-1 py-2.5 text-center overflow-hidden"
          >
            <span className="text-xl leading-none text-gold-leaf/90 font-serif">{symbol}</span>
            <span className="text-xs font-serif font-bold text-parchment/90 leading-tight mt-0.5 tracking-wide w-full truncate px-0.5" title={name}>
              {name}
            </span>
            <span className="text-xs font-serif text-gold-dim/70 leading-tight w-full truncate px-0.5" title={sign}>{sign}</span>
            <span className={`text-xs font-serif leading-tight mt-0.5 w-full truncate px-0.5 ${statusCls}`} title={status}>{status}</span>
          </div>
        ))}
        {/* 8th invisible cell to complete the 4×2 grid */}
        <div className="invisible" />
      </div>
    </div>
  );
};

export default PlanetaryPositions;

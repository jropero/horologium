import React, { useMemo } from 'react';
import { getSunTimes } from '../utils/solar';
import { getWatch } from '../utils/babylonianCalendarUtils';
import { getPlanetSkyStates, NakedEyePlanet, PlanetSkyState } from '../utils/planetSkyState';
import { BABYLONIAN_ZODIAC, BABYLONIAN_ZODIAC_ES } from '../types/babylonia';
import { BABYLONIAN_UI_TERMS } from '../utils/civLabels';
import GlossedTerm from './GlossedTerm';

// The Babylonians had no planetary week and no planetary hours ("No weeks … are
// attested", Sachs & Hunger, Astronomical Diaries I, 1988, intro p. 13; the week is
// Greco-Roman, Bultrighini & Stern 2021). This panel shows instead what a Babylonian
// observer kept: the time in bēru and UŠ, the watch, and the planets as recorded in
// the Astronomical Diaries (naṣāru ša ginê, "regular watching").
//
// Time: the day runs sunset to sunset in 12 bēru ("double hours") of 30 UŠ
// (time-degrees of 4 min); times are counted from sunset or sunrise
// (ADRT I p. 16; Streck, RlA 13 "Tag" §1.5).
// Planets: Diaries writings and Akkadian names after ADRT I and the All Skies
// Encyclopaedia (Gössmann 1950). Listed in the Seleucid-era order of the Diaries:
// Jupiter, Venus, Mercury, Saturn, Mars.
// Signs: Late Babylonian abbreviations as in the ADRT I normal-star table. The app
// places the signs tropically (like getBabylonianZodiac); the Babylonian zodiac was
// sidereal, today about 25° away.
// Phenomena: UŠ station (nenmudu); ina NIM / ina ŠÚ "in the east / in the west". No Diaries term for retrograde motion is attested, so it is
// shown in Spanish only.

interface PlanetDef { key: NakedEyePlanet; logogram: string; akk?: string; es: string; }

const PLANETS: PlanetDef[] = [
  { key: 'Jupiter', logogram: 'MÚL.BABBAR',            es: 'la Estrella Blanca · Júpiter' },
  { key: 'Venus',   logogram: 'ᵈdele-bat', akk: 'Dilbat',      es: 'Venus' },
  { key: 'Mercury', logogram: 'GU₄.UD',    akk: 'Šiḫṭu',       es: 'Mercurio' },
  { key: 'Saturn',  logogram: 'GENNA',     akk: 'Kayyamānu',   es: 'el Constante · Saturno' },
  { key: 'Mars',    logogram: 'AN',        akk: 'Ṣalbatānu',   es: 'Marte' },
];

const SIGN_ABBR = ['ḪUN', 'MÚL', 'MAŠ.MAŠ', 'ALLA', 'A', 'ABSIN', 'RÍN', 'GÍR.TAB', 'PA', 'MÁŠ', 'GU', 'zib'];

const TERMS = {
  beru: { akk: 'bēru', es: 'doble hora' },
  us:   { akk: 'UŠ',   es: 'grado de tiempo, 4 min' },
};

interface Props {
  currentDate: Date;
  lat: number;
  lng: number;
}

interface TimeState {
  isDay: boolean;
  since: Date;
  hour: number; // temporal hour 1–12 of the current half, for the watch
}

function timeState(now: Date, lat: number, lng: number): TimeState {
  const msPerDay = 86400000;
  const y = getSunTimes(new Date(now.getTime() - msPerDay), lat, lng);
  const t = getSunTimes(now, lat, lng);
  const tm = getSunTimes(new Date(now.getTime() + msPerDay), lat, lng);
  const [isDay, start, end] = now >= t.sunrise && now < t.sunset
    ? [true, t.sunrise, t.sunset]
    : now >= t.sunset ? [false, t.sunset, tm.sunrise] : [false, y.sunset, t.sunrise];
  const hour = Math.min(12, Math.floor((now.getTime() - start.getTime()) / ((end.getTime() - start.getTime()) / 12)) + 1);
  return { isDay, since: start, hour };
}

function motionLabel(s: PlanetSkyState): { akk?: string; es: string } {
  if (s.motion === 'stationary') return { akk: 'UŠ', es: 'estacionario' };
  if (s.motion === 'retrograde') return { es: 'retrógrado' };
  return { es: 'directo' };
}

const BabylonianSkyDiary: React.FC<Props> = ({ currentDate, lat, lng }) => {
  const minute = Math.floor(currentDate.getTime() / 60000);
  const time = useMemo(() => {
    try { return timeState(currentDate, lat, lng); } catch { return null; }
  }, [minute, lat, lng]);
  const planets = useMemo(() => {
    try { return getPlanetSkyStates(currentDate, lat, lng); } catch { return []; }
  }, [minute, lat, lng]);

  if (!time) return null;

  const us = Math.floor((currentDate.getTime() - time.since.getTime()) / 240000);
  const beru = Math.floor(us / 30);
  const usRest = us % 30;
  const watch = getWatch(time.hour, time.isDay);
  const byKey = new Map(planets.map(p => [p.key, p]));

  return (
    <div className="w-full max-w-md mx-auto mt-6 mb-2">
      <div className="bg-ink/90 border border-gold-dim/25 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gold-dim/20" />
          <GlossedTerm term={BABYLONIAN_UI_TERMS.skyRecords} className="text-gold-dim text-sm uppercase tracking-[0.3em] font-serif" />
          <div className="h-px flex-1 bg-gold-dim/20" />
        </div>

        {/* ── Time since sunset / sunrise, and the watch ── */}
        <div className="flex justify-around items-start gap-2 mb-3 px-2 py-2 rounded-lg bg-gold-leaf/10 border border-gold-leaf/30">
          <div className="flex flex-col items-center text-center">
            <span className="font-serif text-sm text-parchment tabular-nums">
              {beru} <GlossedTerm term={TERMS.beru} className="text-gold-dim" /> {usRest} <GlossedTerm term={TERMS.us} className="text-gold-dim" />
            </span>
            <span className="text-xs italic text-parchment/65 mt-0.5">
              {time.isDay ? 'tras la salida del sol' : 'tras la puesta del sol'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-serif text-sm text-parchment">{watch.name}</span>
            <span className="text-xs italic text-parchment/65">{watch.desc}</span>
          </div>
        </div>

        {/* ── The planets, Diaries style ── */}
        <div className="flex flex-col gap-1">
          {PLANETS.map(def => {
            const s = byKey.get(def.key);
            if (!s) return null;
            const sign = BABYLONIAN_ZODIAC[s.signIndex];
            const motion = motionLabel(s);
            // Near opposition an outer planet is up from dusk to dawn: neither a
            // morning nor an evening star.
            const allNight = s.elongation >= 120;
            return (
              <div key={def.key} className={`flex items-start gap-2 px-2 py-1.5 rounded-lg ${s.visible ? '' : 'opacity-55'}`}>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-serif text-sm text-parchment leading-snug">
                    {def.logogram}
                    {def.akk && <span className="text-gold-dim/80"> · {def.akk}</span>}
                  </span>
                  <span className="text-xs italic text-parchment/60 leading-tight">{def.es}</span>
                </div>
                <div className="flex flex-col items-end text-right shrink-0">
                  <span className="font-serif text-sm text-gold-dim leading-snug tabular-nums">
                    {SIGN_ABBR[s.signIndex]} {Math.floor(s.degreeInSign)}°
                  </span>
                  <span className="text-xs italic text-parchment/60 leading-tight">
                    {sign} · {BABYLONIAN_ZODIAC_ES[sign]}
                  </span>
                </div>
                <div className="flex flex-col items-end text-right shrink-0 w-24">
                  {s.visible && !allNight ? (
                    <span className="font-serif text-sm text-parchment leading-snug">
                      {s.apparition === 'morning' ? 'ina NIM' : 'ina ŠÚ'}
                    </span>
                  ) : (
                    <span className="text-xs text-parchment/70 leading-snug">{s.visible ? 'visible' : 'invisible'}</span>
                  )}
                  <span className="text-xs italic text-parchment/60 leading-tight">
                    {!s.visible ? 'junto al Sol'
                      : allNight ? 'toda la noche'
                      : s.apparition === 'morning' ? 'al este, al alba' : 'al oeste, al anochecer'}
                  </span>
                  <span className="text-xs leading-tight text-parchment/60 mt-0.5">
                    {motion.akk && <span className="font-serif not-italic text-gold-dim/80">{motion.akk} · </span>}
                    <span className="italic">{motion.es}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs italic text-parchment/45">
          Según los Diarios Astronómicos de Babilonia
        </p>
      </div>
    </div>
  );
};

export default BabylonianSkyDiary;

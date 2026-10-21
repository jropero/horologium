import React, { useMemo, useState } from 'react';
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

// Plain-Spanish guide to the panel, opened with "¿Cómo leer este panel?". Facts as in
// the header comment and docs/research/hours-and-planets-sources.md §5.
const HELP: { term: string; text: string }[] = [
  { term: 'Naṣāru ša ginê', text: 'Título antiguo de los Diarios Astronómicos: desde el siglo VII a. C. los astrónomos de Babilonia anotaban cada noche lo que veían en el cielo. Este panel muestra lo que habrían anotado ahora.' },
  { term: 'bēru y UŠ', text: 'Así medían el tiempo. El día (de puesta a puesta de sol) tenía 12 bēru, "dobles horas"; cada bēru tenía 30 UŠ de 4 minutos. La hora se contaba desde la puesta o la salida del sol.' },
  { term: 'Maṣṣartu · guardia', text: 'La noche y el día se dividían en tres guardias cada uno, que cambian de duración con las estaciones.' },
  { term: 'Planetas', text: 'Los cinco planetas visibles a simple vista, con su nombre en los Diarios y en el orden en que estos los listan: Júpiter, Venus, Mercurio, Saturno, Marte.' },
  { term: 'Signo y grado', text: 'En qué signo del zodíaco está el planeta (abreviatura babilónica) y a cuántos grados dentro de él. La app usa el zodíaco tropical; el babilonio era sideral, hoy unos 25° desplazado.' },
  { term: 'ina NIM · ina ŠÚ', text: '"En el este" (estrella de la mañana, visible al alba) o "en el oeste" (visible al anochecer). "Junto al Sol" significa que su brillo lo oculta.' },
  { term: 'UŠ · estacionario', text: 'El planeta parece detenerse antes de cambiar de sentido. "Retrógrado" (hacia atrás) no tiene término atestiguado en los Diarios, por eso va solo en español.' },
];

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
  const [showHelp, setShowHelp] = useState(false);

  if (!time) return null;

  const us = Math.floor((currentDate.getTime() - time.since.getTime()) / 240000);
  const beru = Math.floor(us / 30);
  const usRest = us % 30;
  const minutesSince = Math.floor((currentDate.getTime() - time.since.getTime()) / 60000);
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
        <p className="-mt-1 mb-2 text-center text-xs italic text-parchment/65">
          Lo que un astrónomo de Babilonia anotaría ahora en su diario del cielo
        </p>
        <div className="mb-3 text-center">
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
            {HELP.map(h => (
              <div key={h.term}>
                <dt className="font-serif text-sm text-gold-dim">{h.term}</dt>
                <dd className="text-xs text-parchment/80 leading-snug">{h.text}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* ── Time since sunset / sunrise, and the watch ── */}
        <h3 className="mb-1.5 text-xs uppercase tracking-[0.2em] text-parchment/60 font-serif">El tiempo</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col items-center text-center px-2 py-2.5 rounded-lg bg-gold-leaf/10 border border-gold-leaf/30">
            <span className="text-xs text-parchment/60">Hora babilónica</span>
            <span className="font-serif text-lg text-parchment tabular-nums leading-snug mt-0.5">
              {beru} <span className="text-gold-dim text-sm">{TERMS.beru.akk}</span> {usRest} <span className="text-gold-dim text-sm">{TERMS.us.akk}</span>
            </span>
            <span className="text-xs text-parchment/75 tabular-nums">
              ≈ {Math.floor(minutesSince / 60)} h {minutesSince % 60} min {time.isDay ? 'tras la salida del sol' : 'tras la puesta del sol'}
            </span>
            <span className="text-xs italic text-parchment/55 mt-1 leading-tight">
              {TERMS.beru.akk} = {TERMS.beru.es} · {TERMS.us.akk} = {TERMS.us.es}
            </span>
          </div>
          <div className="flex flex-col items-center text-center px-2 py-2.5 rounded-lg bg-gold-leaf/10 border border-gold-leaf/30">
            <span className="text-xs text-parchment/60">Guardia</span>
            <span className="font-serif text-lg text-parchment leading-snug mt-0.5">{watch.name}</span>
            <span className="text-xs italic text-parchment/75">{watch.desc}</span>
            <span className="text-xs text-parchment/55 mt-1 leading-tight">
              {watch.watch}.ª de 3 guardias {time.isDay ? 'del día' : 'de la noche'}
            </span>
          </div>
        </div>

        {/* ── The planets, Diaries style ── */}
        <h3 className="mb-1.5 text-xs uppercase tracking-[0.2em] text-parchment/60 font-serif">Los planetas</h3>
        <div className="grid grid-cols-[minmax(0,1fr)_5.5rem_7rem] gap-x-2 px-2 pb-1 border-b border-gold-dim/20 text-xs text-parchment/55">
          <span>Planeta</span>
          <span className="text-right">Posición</span>
          <span className="text-right">Dónde se ve</span>
        </div>
        <div className="flex flex-col divide-y divide-gold-dim/10">
          {PLANETS.map(def => {
            const s = byKey.get(def.key);
            if (!s) return null;
            const sign = BABYLONIAN_ZODIAC[s.signIndex];
            const motion = motionLabel(s);
            // Near opposition an outer planet is up from dusk to dawn: neither a
            // morning nor an evening star.
            const allNight = s.elongation >= 120;
            return (
              <div key={def.key} className="grid grid-cols-[minmax(0,1fr)_5.5rem_7rem] gap-x-2 items-start px-2 py-2">
                <div className="flex items-start gap-2 min-w-0">
                  <span
                    aria-hidden
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.visible ? 'bg-gold-leaf' : 'border border-parchment/40'}`}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className={`font-serif text-sm leading-snug ${s.visible ? 'text-parchment' : 'text-parchment/60'}`}>
                      {def.logogram}
                      {def.akk && <span className="text-gold-dim/80"> · {def.akk}</span>}
                    </span>
                    <span className="text-xs italic text-parchment/60 leading-tight">{def.es}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="font-serif text-sm text-gold-dim leading-snug tabular-nums">
                    {SIGN_ABBR[s.signIndex]} {Math.floor(s.degreeInSign)}°
                  </span>
                  <span className="text-xs italic text-parchment/60 leading-tight">
                    {sign} · {BABYLONIAN_ZODIAC_ES[sign]}
                  </span>
                </div>
                <div className="flex flex-col items-end text-right">
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
                  <span className="mt-1 px-1.5 rounded-full border border-gold-dim/25 text-xs leading-tight text-parchment/70">
                    {motion.akk && <span className="font-serif text-gold-dim/80">{motion.akk} · </span>}
                    <span className="italic">{motion.es}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-center gap-4 text-xs text-parchment/55">
          <span className="flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-gold-leaf" />visible a simple vista</span>
          <span className="flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full border border-parchment/40" />oculto por el Sol</span>
        </div>
        <p className="mt-2 text-center text-xs italic text-parchment/45">
          Según los Diarios Astronómicos de Babilonia
        </p>
      </div>
    </div>
  );
};

export default BabylonianSkyDiary;

import React, { useMemo, useState } from 'react';
import { getSunTimes } from '../utils/solar';
import { getWatch } from '../utils/babylonianCalendarUtils';
import { getPlanetSkyStates, NakedEyePlanet, PlanetSkyState } from '../utils/planetSkyState';
import { BABYLONIAN_ZODIAC, BABYLONIAN_ZODIAC_ES } from '../types/babylonia';
import { BABYLONIAN_UI_TERMS } from '../utils/civLabels';
import GlossedTerm from './GlossedTerm';
import './BabylonianSkyDiary.css';

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

interface PlanetDef {
  key: NakedEyePlanet;
  logogram: string;
  akk?: string;
  es: string;
}

const PLANETS: PlanetDef[] = [
  { key: 'Jupiter', logogram: 'MÚL.BABBAR', es: 'la Estrella Blanca · Júpiter' },
  { key: 'Venus', logogram: 'ᵈdele-bat', akk: 'Dilbat', es: 'Venus' },
  { key: 'Mercury', logogram: 'GU₄.UD', akk: 'Šiḫṭu', es: 'Mercurio' },
  { key: 'Saturn', logogram: 'GENNA', akk: 'Kayyamānu', es: 'el Constante · Saturno' },
  { key: 'Mars', logogram: 'AN', akk: 'Ṣalbatānu', es: 'Marte' },
];

const SIGN_ABBR = [
  'ḪUN',
  'MÚL',
  'MAŠ.MAŠ',
  'ALLA',
  'A',
  'ABSIN',
  'RÍN',
  'GÍR.TAB',
  'PA',
  'MÁŠ',
  'GU',
  'zib',
];

const TERMS = {
  beru: { akk: 'bēru', es: 'doble hora' },
  us: { akk: 'UŠ', es: 'grado de tiempo, 4 min' },
};

// Plain-Spanish guide to the panel, opened with "¿Cómo leer este panel?". Facts as in
// the header comment and docs/research/hours-and-planets-sources.md §5.
const HELP: { term: string; text: string }[] = [
  {
    term: 'Naṣāru ša ginê',
    text: 'Título antiguo de los Diarios Astronómicos: desde el siglo VII a. C. los astrónomos de Babilonia compilaban cada mes lo que habían observado en el cielo. Este panel muestra lo que los Diarios registrarían esta noche.',
  },
  {
    term: 'bēru y UŠ',
    text: 'Así medían el tiempo. El día (de puesta a puesta de sol) tenía 12 bēru, "dobles horas"; cada bēru tenía 30 UŠ de 4 minutos. La hora se contaba desde la puesta o la salida del sol.',
  },
  {
    term: 'Maṣṣartu · guardia',
    text: 'La noche y el día se dividían en tres guardias cada uno, que cambian de duración con las estaciones.',
  },
  {
    term: 'Planetas',
    text: 'Los cinco planetas visibles a simple vista, con su nombre en los Diarios y en el orden en que estos los listan: Júpiter, Venus, Mercurio, Saturno, Marte.',
  },
  {
    term: 'Signo y grado',
    text: 'En qué signo del zodíaco está el planeta (abreviatura babilónica) y a cuántos grados dentro de él. La app usa el zodíaco tropical; el babilonio era sideral, hoy unos 25° desplazado.',
  },
  {
    term: 'ina NIM · ina ŠÚ',
    text: '"En el este" (estrella de la mañana, visible al alba) o "en el oeste" (visible al anochecer). "Junto al Sol" significa que su brillo lo oculta.',
  },
  {
    term: 'UŠ · estacionario',
    text: 'El planeta parece detenerse antes de cambiar de sentido. "Retrógrado" (hacia atrás) no tiene término atestiguado en los Diarios, por eso va solo en español.',
  },
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
  let isDay: boolean;
  let start: Date;
  let end: Date;
  if (now >= t.sunrise && now < t.sunset) {
    isDay = true;
    start = t.sunrise;
    end = t.sunset;
  } else if (now >= t.sunset) {
    isDay = false;
    start = t.sunset;
    end = tm.sunrise;
  } else {
    isDay = false;
    start = y.sunset;
    end = t.sunrise;
  }
  const hour = Math.min(
    12,
    Math.floor((now.getTime() - start.getTime()) / ((end.getTime() - start.getTime()) / 12)) +
      1,
  );
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
    try {
      return timeState(currentDate, lat, lng);
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute, lat, lng]);
  const planets = useMemo(() => {
    try {
      return getPlanetSkyStates(currentDate, lat, lng);
    } catch {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute, lat, lng]);
  const [showHelp, setShowHelp] = useState(false);

  if (!time) return null;

  const us = Math.floor((currentDate.getTime() - time.since.getTime()) / 240000);
  const beru = Math.floor(us / 30);
  const usRest = us % 30;
  const minutesSince = Math.floor((currentDate.getTime() - time.since.getTime()) / 60000);
  const watch = getWatch(time.hour, time.isDay);
  const byKey = new Map(planets.map(p => [p.key, p]));

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderPlanet = (def: (typeof PLANETS)[0]) => {
    const s = byKey.get(def.key);
    if (!s) return null;
    const sign = BABYLONIAN_ZODIAC[s.signIndex];
    const motion = motionLabel(s);
    const allNight = s.elongation >= 120;
    let apparitionText: string;
    if (!s.visible) {
      apparitionText = 'junto al Sol';
    } else if (allNight) {
      apparitionText = 'toda la noche';
    } else {
      apparitionText =
        s.apparition === 'morning' ? 'al este, al alba' : 'al oeste, al anochecer';
    }
    return (
      <div key={def.key} className="babylonian-sky-diary-planet-row">
        <div className="babylonian-sky-diary-planet-name-col">
          <span
            aria-hidden
            className={`babylonian-sky-diary-planet-dot ${
              s.visible
                ? 'babylonian-sky-diary-planet-dot--visible'
                : 'babylonian-sky-diary-planet-dot--hidden'
            }`}
          />
          <div className="babylonian-sky-diary-planet-name-stack">
            <span
              className={`babylonian-sky-diary-planet-logogram${
                s.visible ? '' : ' babylonian-sky-diary-planet-logogram--dim'
              }`}
            >
              {def.logogram}
              {def.akk && <span className="babylonian-sky-diary-planet-akk"> · {def.akk}</span>}
            </span>
            <span className="babylonian-sky-diary-planet-es">{def.es}</span>
          </div>
        </div>
        <div className="babylonian-sky-diary-planet-pos-col">
          <span className="babylonian-sky-diary-planet-sign">
            {SIGN_ABBR[s.signIndex]} {Math.floor(s.degreeInSign)}°
          </span>
          <span className="babylonian-sky-diary-planet-sign-gloss">
            {sign} · {BABYLONIAN_ZODIAC_ES[sign]}
          </span>
        </div>
        <div className="babylonian-sky-diary-planet-apparition-col">
          {s.visible && !allNight ? (
            <span className="babylonian-sky-diary-planet-apparition-akk">
              {s.apparition === 'morning' ? 'ina NIM' : 'ina ŠÚ'}
            </span>
          ) : (
            <span className="babylonian-sky-diary-planet-apparition-vis">
              {s.visible ? 'visible' : 'invisible'}
            </span>
          )}
          <span className="babylonian-sky-diary-planet-apparition-desc">{apparitionText}</span>
          <span className="babylonian-sky-diary-planet-motion">
            {motion.akk && (
              <span className="babylonian-sky-diary-planet-motion-akk">{motion.akk} · </span>
            )}
            <span className="babylonian-sky-diary-planet-motion-es">{motion.es}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="babylonian-sky-diary">
      <div className="babylonian-sky-diary-inner">
        <div className="babylonian-sky-diary-title-row">
          <div className="babylonian-sky-diary-divider" />
          <GlossedTerm
            term={BABYLONIAN_UI_TERMS.skyRecords}
            className="babylonian-sky-diary-title-term"
          />
          <div className="babylonian-sky-diary-divider" />
        </div>
        <p className="babylonian-sky-diary-subtitle">
          Lo que los Diarios Astronómicos registrarían esta noche
        </p>
        <div className="babylonian-sky-diary-help-toggle">
          <button
            type="button"
            onClick={() => setShowHelp(v => !v)}
            aria-expanded={showHelp}
            className="babylonian-sky-diary-help-btn"
          >
            {showHelp ? 'Cerrar explicación' : '¿Cómo leer este panel?'}
          </button>
        </div>
        {showHelp && (
          <dl className="babylonian-sky-diary-help-dl">
            {HELP.map(h => (
              <div key={h.term}>
                <dt className="babylonian-sky-diary-help-dt">{h.term}</dt>
                <dd className="babylonian-sky-diary-help-dd">{h.text}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* ── Time since sunset / sunrise, and the watch ── */}
        <h3 className="babylonian-sky-diary-section-title">El tiempo</h3>
        <div className="babylonian-sky-diary-time-grid">
          <div className="babylonian-sky-diary-time-cell">
            <span className="babylonian-sky-diary-time-label">Hora babilónica</span>
            <span className="babylonian-sky-diary-beru">
              {beru} <span className="babylonian-sky-diary-beru-unit">{TERMS.beru.akk}</span>{' '}
              {usRest} <span className="babylonian-sky-diary-beru-unit">{TERMS.us.akk}</span>
            </span>
            <span className="babylonian-sky-diary-time-approx">
              ≈ {Math.floor(minutesSince / 60)} h {minutesSince % 60} min{' '}
              {time.isDay ? 'tras la salida del sol' : 'tras la puesta del sol'}
            </span>
            <span className="babylonian-sky-diary-time-terms">
              {TERMS.beru.akk} = {TERMS.beru.es} · {TERMS.us.akk} = {TERMS.us.es}
            </span>
          </div>
          <div className="babylonian-sky-diary-time-cell">
            <span className="babylonian-sky-diary-time-label">Guardia</span>
            <span className="babylonian-sky-diary-watch-name">{watch.name}</span>
            <span className="babylonian-sky-diary-watch-desc">{watch.desc}</span>
            <span className="babylonian-sky-diary-watch-ordinal">
              {watch.watch}.ª de 3 guardias {time.isDay ? 'del día' : 'de la noche'}
            </span>
          </div>
        </div>

        {/* ── The planets, Diaries style ── */}
        <h3 className="babylonian-sky-diary-section-title">Los planetas</h3>
        <div className="babylonian-sky-diary-planets-header">
          <span>Planeta</span>
          <span className="babylonian-sky-diary-planets-header-right">Posición</span>
          <span className="babylonian-sky-diary-planets-header-right">Dónde se ve</span>
        </div>
        <div className="babylonian-sky-diary-planets-list">{PLANETS.map(renderPlanet)}</div>
        <div className="babylonian-sky-diary-legend">
          <span className="babylonian-sky-diary-legend-item">
            <span
              aria-hidden
              className="babylonian-sky-diary-legend-dot babylonian-sky-diary-legend-dot--visible"
            />
            visible a simple vista
          </span>
          <span className="babylonian-sky-diary-legend-item">
            <span
              aria-hidden
              className="babylonian-sky-diary-legend-dot babylonian-sky-diary-legend-dot--hidden"
            />
            oculto por el Sol
          </span>
        </div>
        <p className="babylonian-sky-diary-footer-note">
          Según los Diarios Astronómicos de Babilonia
        </p>
      </div>
    </div>
  );
};

export default BabylonianSkyDiary;

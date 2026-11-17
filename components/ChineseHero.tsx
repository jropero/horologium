import React, { useMemo } from 'react';
import { Body } from 'astronomy-engine';
import { WeatherData } from '../types';
import {
  getMoonPhase,
  getMoonPosition,
  getPlanetPosition,
  getSunAltitude,
  getSolarLongitudeDeg,
  getSunTimes,
} from '../utils/solar';
import { getChineseCalendarData } from '../utils/chineseCalendarUtils';
import { seasonBase } from '../utils/chineseSeasons';
import { getCurrentShichen } from '../utils/chineseTimeUtils';
import { RAIN_INTENSITY, generateWeatherParticles } from '../utils/weatherParticles';
import ChineseScene, { chineseSkyGradient } from './ChineseScene';
import { ARROW_X, arrowMarks } from './ChineseInstrument';
import SceneWeather from './SceneWeather';
import WeatherSvgEffects from './WeatherSvgEffects';
import './ChineseScene.css';

/**
 * 16:9 hero at the top of the Zhongguo page: sky gradient and aurora sky (HTML,
 * so they can transition), one SVG with sky, weather, landscape and the
 * instrument (ChineseScene), a paper vignette, the vermilion seal 長安 and, at
 * night, the current shíchén beside the clepsydra arrow.
 */

interface Props {
  modernTime: Date;
  weather?: WeatherData | null;
  lat: number;
  lng: number;
}

/**
 * The scene faces south: azimuth 180° is the centre, ±90° maps to ±120 units;
 * altitude 0° sits behind the Qinling, 90° near the top.
 */
const toFrame = (pos: { altitude: number; azimuth: number }) => ({
  x: Math.max(-20, Math.min(320, 150 + ((pos.azimuth - 180) / 90) * 120)),
  y: Math.max(22, 140 - pos.altitude * 1.3),
});

/** The 16:9 box shows x −27.8…327.8 of the 3:2 viewBox (`meet`): percentage position of a point. */
const VISIBLE_W = (200 * 16) / 9;
const toPercent = (x: number, y: number) => ({
  left: `${(((x + (VISIBLE_W - 300) / 2) / VISIBLE_W) * 100).toFixed(2)}%`,
  top: `${((y / 200) * 100).toFixed(2)}%`,
});

const ChineseHero: React.FC<Props> = ({ modernTime, weather, lat, lng }) => {
  const sky = useMemo(() => {
    const { sunrise, sunset } = getSunTimes(modernTime, lat, lng);
    const t = modernTime.getTime();
    const sunPos = getPlanetPosition(Body.Sun, modernTime, lat, lng);
    const moonPos = getMoonPosition(modernTime, lat, lng);
    const sunAltitude = getSunAltitude(modernTime, lat, lng);
    return {
      isDay: t >= sunrise.getTime() && t < sunset.getTime(),
      sunAltitude,
      sunPos,
      sun: sunPos.altitude >= -1 ? toFrame(sunPos) : null,
      moon:
        moonPos.altitude >= -1
          ? { ...toFrame(moonPos), phase: getMoonPhase(modernTime) }
          : null,
      starOpacity: sunAltitude > 0 ? 0 : Math.min(1, -sunAltitude / 6),
    };
  }, [modernTime, lat, lng]);

  // Same solar term as the term card below (and time travel); the base follows the sun.
  const { termId, season } = useMemo(
    () => ({
      termId: getChineseCalendarData(modernTime).term.id,
      season: seasonBase(getSolarLongitudeDeg(modernTime)),
    }),
    [modernTime],
  );

  // Same shíchén as the rest of the page (device clock, as in ChineseAnimalClock).
  const { current, progressPercent } = getCurrentShichen(modernTime);
  const dayFrac = (current.id - 1 + progressPercent) / 12;

  const condition = weather?.current.condition ?? 'clear';
  const aurora = !!(weather?.isOffline || weather?.aurora);
  const windGusts = weather?.current.windGusts ?? 0;
  const rainIntensity = RAIN_INTENSITY[weather?.current.code ?? 63] ?? 0.45;
  const weatherParticles = useMemo(
    () => generateWeatherParticles(rainIntensity),
    [rainIntensity],
  );
  const seed =
    modernTime.getFullYear() * 10000 + (modernTime.getMonth() + 1) * 100 + modernTime.getDate();
  const lightInput = {
    isDay: sky.isDay,
    sunAltitude: sky.sunAltitude,
    weatherCond: condition,
    aurora,
    warmth: season.warmth,
  };
  const night = !sky.isDay || undefined;
  const mark = arrowMarks(dayFrac);
  const labelPos = toPercent(ARROW_X + 3.6, mark.marks[mark.current]);

  return (
    <div className="chinese-hero">
      <div
        className="chinese-hero__sky"
        style={{ background: chineseSkyGradient(lightInput) }}
      />
      <div
        className="chinese-hero__aurora"
        style={{
          background: sky.isDay
            ? 'linear-gradient(to bottom, #12302d 0%, #1d4a43 55%, #173b36 100%)'
            : 'linear-gradient(to bottom, #030807 0%, #07110f 65%, #0a1a17 100%)',
          opacity: aurora ? 1 : 0,
        }}
      />
      <svg
        className="chinese-hero__svg"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <ChineseScene
          seed={seed}
          isDay={sky.isDay}
          sunAltitude={sky.sunAltitude}
          starOpacity={sky.starOpacity}
          weatherCond={condition}
          aurora={aurora}
          sun={sky.sun}
          moon={sky.moon}
          sunPos={sky.sunPos}
          dayFrac={dayFrac}
          termId={termId}
          season={season}
        >
          <WeatherSvgEffects
            condition={condition}
            weatherParticles={weatherParticles}
            fogGradientId="fog-ground-zhongguo"
            rainIntensity={rainIntensity}
            windGusts={windGusts}
            offline={aurora}
            auroraLayers={weather?.auroraLayers}
            effects={
              <SceneWeather
                condition={condition}
                weatherParticles={weatherParticles}
                rainIntensity={rainIntensity}
                windGusts={windGusts}
              />
            }
          />
          {condition === 'storm' && (
            <rect
              x="-40"
              y="0"
              width="380"
              height="200"
              fill="#ffffff"
              opacity="0"
              className="anim-lightning"
            />
          )}
        </ChineseScene>
      </svg>
      <div className="chinese-hero__paper" data-night={night} />
      <div className="chinese-hero__seal" data-night={night} aria-hidden="true">
        長安
      </div>
      {!sky.isDay && (
        <div
          className="chinese-hero__shichen"
          style={labelPos}
          title={`${current.branchHanzi} ${current.branchPinyin} · ${current.animalName}`}
        >
          {current.branchHanzi}
        </div>
      )}
    </div>
  );
};

export default ChineseHero;

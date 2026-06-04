import { chineseCalendarData, SolarTerm } from './chineseCalendarData';
import { getSolarLongitudeDeg } from './solar';

// Solar terms correspond to ecliptic longitudes at 15° intervals, starting from 315°:
// Lìchūn (315°), Yǔshuǐ (330°), Jīngzhé (345°), Chūnfēn (0°), Qīngmíng (15°), Gǔyǔ (30°),
// Lìxià (45°), Xiǎomǎn (60°), Mángzhòng (75°), Xiàzhì (90°), Xiǎoshǔ (105°), Dàshǔ (120°),
// Lìqiū (135°), Chǔshǔ (150°), Báilù (165°), Qiūfēn (180°), Hánlù (195°), Shuāngjiàng (210°),
// Lìdōng (225°), Xiǎoxuě (240°), Dàxuě (255°), Dōngzhì (270°), Xiǎohán (285°), Dàhán (300°)

export const getChineseCalendarData = (date: Date): { term: SolarTerm; pentad: number; daysUntilChange: number } => {
  const solarLon = getSolarLongitudeDeg(date);

  // Each solar term spans 15° of ecliptic longitude.
  // Lìchūn starts at 315° → termIndex = Math.floor(((lon - 315) mod 360) / 15)
  const termIndex = Math.floor((((solarLon - 315) % 360 + 360) % 360) / 15);
  const term = chineseCalendarData[termIndex];

  // Pentad: each term spans 15° in 3 pentads of ~5° each
  const termStart = (termIndex * 15 + 315) % 360;
  const offset = ((solarLon - termStart) % 360 + 360) % 360;
  const pentad = Math.min(Math.floor(offset / 5) + 1, 3);

  // Compute exact days until next term by scanning forward day by day
  const nextStart = ((termIndex + 1) * 15 + 315) % 360;
  let daysUntilChange = 0;
  for (let d = 0; d <= 20; d++) {
    const check = new Date(date);
    check.setDate(date.getDate() + d);
    const checkLon = getSolarLongitudeDeg(check);
    const diff = ((checkLon - nextStart) % 360 + 360) % 360;
    if (diff < 15) {
      daysUntilChange = d;
      break;
    }
  }

  return { term, pentad, daysUntilChange };
};

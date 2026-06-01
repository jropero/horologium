import { getMoonPhase, getSolarLongitudeDeg } from './solar';

const DAY_MS = 86400000;
const SYNODIC_MONTH = 29.53059;

// Major solar term angles (中气) at each 30° of ecliptic longitude
const MAJOR_TERM_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

// ---- Static Data ----

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const CHINESE_MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];

export interface StemInfo {
  hanzi: string;
  pinyin: string;
  elementHanzi: string;
  elementEs: string;
  yin: boolean;
  color: string;
}

export interface BranchInfo {
  hanzi: string;
  pinyin: string;
  animal: string;
  animalEs: string;
  elementHanzi: string;
  elementEs: string;
  color: string;
}

export const STEMS: StemInfo[] = [
  { hanzi: '甲', pinyin: 'jiǎ', elementHanzi: '木', elementEs: 'Madera', yin: false, color: 'text-emerald-400' },
  { hanzi: '乙', pinyin: 'yǐ', elementHanzi: '木', elementEs: 'Madera', yin: true, color: 'text-emerald-400' },
  { hanzi: '丙', pinyin: 'bǐng', elementHanzi: '火', elementEs: 'Fuego', yin: false, color: 'text-red-400' },
  { hanzi: '丁', pinyin: 'dīng', elementHanzi: '火', elementEs: 'Fuego', yin: true, color: 'text-red-400' },
  { hanzi: '戊', pinyin: 'wù', elementHanzi: '土', elementEs: 'Tierra', yin: false, color: 'text-amber-400' },
  { hanzi: '己', pinyin: 'jǐ', elementHanzi: '土', elementEs: 'Tierra', yin: true, color: 'text-amber-400' },
  { hanzi: '庚', pinyin: 'gēng', elementHanzi: '金', elementEs: 'Metal', yin: false, color: 'text-yellow-400' },
  { hanzi: '辛', pinyin: 'xīn', elementHanzi: '金', elementEs: 'Metal', yin: true, color: 'text-yellow-400' },
  { hanzi: '壬', pinyin: 'rén', elementHanzi: '水', elementEs: 'Agua', yin: false, color: 'text-cyan-400' },
  { hanzi: '癸', pinyin: 'guǐ', elementHanzi: '水', elementEs: 'Agua', yin: true, color: 'text-cyan-400' },
];

export const BRANCHES: BranchInfo[] = [
  { hanzi: '子', pinyin: 'zǐ', animal: '鼠', animalEs: 'Rata', elementHanzi: '水', elementEs: 'Agua', color: 'text-cyan-400' },
  { hanzi: '丑', pinyin: 'chǒu', animal: '牛', animalEs: 'Buey', elementHanzi: '土', elementEs: 'Tierra', color: 'text-amber-400' },
  { hanzi: '寅', pinyin: 'yín', animal: '虎', animalEs: 'Tigre', elementHanzi: '木', elementEs: 'Madera', color: 'text-emerald-400' },
  { hanzi: '卯', pinyin: 'mǎo', animal: '兔', animalEs: 'Conejo', elementHanzi: '木', elementEs: 'Madera', color: 'text-emerald-400' },
  { hanzi: '辰', pinyin: 'chén', animal: '龙', animalEs: 'Dragón', elementHanzi: '土', elementEs: 'Tierra', color: 'text-amber-400' },
  { hanzi: '巳', pinyin: 'sì', animal: '蛇', animalEs: 'Serpiente', elementHanzi: '火', elementEs: 'Fuego', color: 'text-red-400' },
  { hanzi: '午', pinyin: 'wǔ', animal: '马', animalEs: 'Caballo', elementHanzi: '火', elementEs: 'Fuego', color: 'text-red-400' },
  { hanzi: '未', pinyin: 'wèi', animal: '羊', animalEs: 'Cabra', elementHanzi: '土', elementEs: 'Tierra', color: 'text-amber-400' },
  { hanzi: '申', pinyin: 'shēn', animal: '猴', animalEs: 'Mono', elementHanzi: '金', elementEs: 'Metal', color: 'text-yellow-400' },
  { hanzi: '酉', pinyin: 'yǒu', animal: '鸡', animalEs: 'Gallo', elementHanzi: '金', elementEs: 'Metal', color: 'text-yellow-400' },
  { hanzi: '戌', pinyin: 'xū', animal: '狗', animalEs: 'Perro', elementHanzi: '土', elementEs: 'Tierra', color: 'text-amber-400' },
  { hanzi: '亥', pinyin: 'hài', animal: '猪', animalEs: 'Cerdo', elementHanzi: '水', elementEs: 'Agua', color: 'text-cyan-400' },
];

// Chinese day names: 初一 through 三十
const SIMP = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const CHINESE_DAYS = (() => {
  const d: string[] = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十'];
  for (let i = 11; i <= 19; i++) d.push(`十${SIMP[i - 11]}`);
  d.push('二十');
  for (let i = 21; i <= 29; i++) d.push(`廿${SIMP[i - 21]}`);
  d.push('三十');
  return d;
})();

export interface ChineseLunisolarDate {
  year: number;
  yearStem: string;
  yearBranch: string;
  yearStemBranch: string;
  yearStemIndex: number;
  yearBranchIndex: number;
  yearAnimal: string;
  monthNumber: number;
  monthName: string;
  monthStem: string;
  monthBranch: string;
  monthStemBranch: string;
  monthStemIndex: number;
  monthBranchIndex: number;
  dayNumber: number;
  dayName: string;
  dayStem: string;
  dayBranch: string;
  dayStemBranch: string;
  dayStemIndex: number;
  dayBranchIndex: number;
  isLeapMonth: boolean;
  isLeapYear: boolean;
  lunarNewYear: string;
  displayDate: string;
}

// Find the new moon ON or BEFORE the given date (day-level precision)
const findNewMoon = (date: Date): Date => {
  const d = new Date(date);
  let prevPhase = getMoonPhase(d);
  for (let i = 1; i <= 35; i++) {
    const check = new Date(d);
    check.setDate(check.getDate() - i);
    const phase = getMoonPhase(check);
    if (phase > 0.8 && prevPhase < 0.2) {
      const nmDate = new Date(d);
      nmDate.setDate(d.getDate() - (i - 1));
      nmDate.setHours(0, 0, 0, 0);
      return nmDate;
    }
    prevPhase = phase;
  }
  return d;
};

// Find the next new moon strictly after the given date
const findNextNewMoon = (date: Date): Date => {
  const d = new Date(date);
  let prevPhase = getMoonPhase(d);
  for (let i = 1; i <= 35; i++) {
    const check = new Date(d);
    check.setDate(d.getDate() + i);
    const phase = getMoonPhase(check);
    if (prevPhase > 0.8 && phase < 0.2) {
      check.setHours(0, 0, 0, 0);
      return check;
    }
    prevPhase = phase;
  }
  const fallback = new Date(date);
  fallback.setDate(date.getDate() + 30);
  return fallback;
};

// Check if a lunar month interval [start, end) contains any major solar term (中气)
const intervalContainsMajorTerm = (start: Date, end: Date): boolean => {
  const startLon = getSolarLongitudeDeg(start);
  const endLon = getSolarLongitudeDeg(end);
  const diff = ((endLon - startLon) % 360 + 360) % 360;

  for (const angle of MAJOR_TERM_ANGLES) {
    const angleDist = ((angle - startLon) % 360 + 360) % 360;
    if (angleDist > 1e-8 && angleDist < diff) return true;
  }
  return false;
};

// Find the winter solstice day (sun ecliptic longitude crosses 270°)
const findWinterSolstice = (year: number): Date => {
  const start = new Date(year, 11, 15);
  let prev = getSolarLongitudeDeg(start);
  for (let i = 1; i <= 25; i++) {
    const curr = new Date(year, 11, 15 + i);
    const lon = getSolarLongitudeDeg(curr);
    if (prev < 270 && lon >= 270) return curr;
    prev = lon;
  }
  const fallback = new Date(year, 11, 21);
  fallback.setHours(0, 0, 0, 0);
  return fallback;
};

// --- Public API ---

export const getYearStemBranch = (year: number) => {
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  const branchIdx = ((year - 4) % 12 + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
    animal: ZODIAC_ANIMALS[branchIdx],
    stemIndex: stemIdx,
    branchIndex: branchIdx,
    display: `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`
  };
};

const getMonthStemBranch = (yearStemIndex: number, chineseMonth: number) => {
  const stemIdx = ((yearStemIndex * 2 + chineseMonth + 1) % 10 + 10) % 10;
  const branchIdx = ((chineseMonth + 1) % 12 + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
    display: `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`
  };
};

const getDayStemBranch = (date: Date) => {
  // Reference: 2000-01-01 midnight (JD floor 2451544) = 甲午日 (cycle 30)
  const jd = date.getTime() / DAY_MS - 0.5 + 2440588;
  const cycle = ((Math.floor(jd) - 2451544 + 30) % 60 + 60) % 60;
  const stem = HEAVENLY_STEMS[cycle % 10];
  const branch = EARTHLY_BRANCHES[cycle % 12];
  return {
    stem,
    branch,
    display: `${stem}${branch}`,
    cycleNumber: cycle
  };
};

export const getChineseLunisolarDate = (date: Date): ChineseLunisolarDate => {
  const year = date.getFullYear();
  const winterSolstice = findWinterSolstice(year);
  const m11Start = findNewMoon(winterSolstice);

  // Determine which month-11 anchor to use
  let ws = winterSolstice;
  let m11 = m11Start;

  if (date < m11) {
    // Try previous year's winter solstice
    ws = findWinterSolstice(year - 1);
    m11 = findNewMoon(ws);

    if (date < m11) {
      ws = findWinterSolstice(year - 2);
      m11 = findNewMoon(ws);
    }
  }

  // Find the current new moon (start of our lunar month)
  const currentNM = findNewMoon(date);

  // Count lunations from month-11 start to current new moon
  const diffMs = currentNM.getTime() - m11.getTime();
  const lunations = Math.round(diffMs / (SYNODIC_MONTH * DAY_MS));

  // Chinese year determination: the year starts at month 1 (正月 = Chinese New Year).
  // CNY is the new moon 2 lunations after the month-11 start.
  const cnyDate = new Date(m11.getTime() + Math.round(2 * SYNODIC_MONTH * DAY_MS));

  // Check leap year: count lunations between this month-11 start and the next
  const nextWS = findWinterSolstice(ws.getFullYear() + 1);
  const nextM11 = findNewMoon(nextWS);
  const yearDays = (nextM11.getTime() - m11.getTime()) / DAY_MS;
  const lunationsInYear = Math.round(yearDays / SYNODIC_MONTH);
  const isLeapYear = lunationsInYear > 12;

  // Determine month number accounting for leap months
  let chineseMonth: number;
  let isLeapMonth = false;

  if (isLeapYear) {
    // Generate all new moons from m11 to nextM11
    const intervalNM: Date[] = [new Date(m11)];
    for (let i = 0; i < lunationsInYear; i++) {
      intervalNM.push(findNextNewMoon(intervalNM[i]));
    }

    // Find the first interval (after month 11) with no major term → leap month
    let leapIndex = -1;
    for (let i = 1; i < intervalNM.length - 1; i++) {
      if (!intervalContainsMajorTerm(intervalNM[i], intervalNM[i + 1])) {
        leapIndex = i;
        break;
      }
    }

    if (leapIndex < 0) {
      chineseMonth = ((11 + lunations - 1) % 12 + 12) % 12 + 1;
    } else if (lunations < leapIndex) {
      chineseMonth = ((11 + lunations - 1) % 12 + 12) % 12 + 1;
    } else {
      chineseMonth = ((11 + lunations - 2) % 12 + 12) % 12 + 1;
      if (lunations === leapIndex) isLeapMonth = true;
    }
  } else {
    chineseMonth = ((11 + lunations - 1) % 12 + 12) % 12 + 1;
  }

  const lunarYear = (chineseMonth >= 1 && chineseMonth <= 10)
    ? cnyDate.getFullYear()
    : cnyDate.getFullYear() - 1;

  // Sexagenary cycles
  const yearSB = getYearStemBranch(lunarYear);
  const monthSB = getMonthStemBranch(yearSB.stemIndex, chineseMonth);
  const daySB = getDayStemBranch(date);

  // Day of month (detect actual month length: 29 or 30 days)
  const nextNM = findNextNewMoon(currentNM);
  const monthLength = Math.round((nextNM.getTime() - currentNM.getTime()) / DAY_MS);
  const dayDiff = Math.floor((date.getTime() - currentNM.getTime()) / DAY_MS);
  const dayOfMonth = Math.min(Math.max(dayDiff + 1, 1), monthLength);

  const monthName = isLeapMonth ? `闰${CHINESE_MONTHS[(chineseMonth - 1 + 12) % 12]}` : CHINESE_MONTHS[(chineseMonth - 1 + 12) % 12];

  // Display string: the last day of the month is always called 三十
  const dayName = dayOfMonth === monthLength ? '三十' : (CHINESE_DAYS[dayOfMonth] || `${dayOfMonth}日`);
  const displayDate = `${yearSB.display}年${monthName}${dayName}`;

  const cnyDisplay = `${cnyDate.getFullYear()}-${String(cnyDate.getMonth() + 1).padStart(2, '0')}-${String(cnyDate.getDate()).padStart(2, '0')}`;

  return {
    year: lunarYear,
    yearStem: yearSB.stem,
    yearBranch: yearSB.branch,
    yearStemBranch: yearSB.display,
    yearStemIndex: yearSB.stemIndex,
    yearBranchIndex: yearSB.branchIndex,
    yearAnimal: yearSB.animal,
    monthNumber: chineseMonth,
    monthName,
    monthStem: monthSB.stem,
    monthBranch: monthSB.branch,
    monthStemBranch: monthSB.display,
    monthStemIndex: ((yearSB.stemIndex * 2 + chineseMonth + 1) % 10 + 10) % 10,
    monthBranchIndex: ((chineseMonth + 1) % 12 + 12) % 12,
    dayNumber: dayOfMonth,
    dayName,
    dayStem: daySB.stem,
    dayBranch: daySB.branch,
    dayStemBranch: daySB.display,
    dayStemIndex: daySB.cycleNumber % 10,
    dayBranchIndex: daySB.cycleNumber % 12,
    isLeapMonth,
    isLeapYear,
    lunarNewYear: cnyDisplay,
    displayDate
  };
};

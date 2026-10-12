import { getSolarLongitudeDeg, prevNewMoonJDE, winterSolsticeJDE, trueNewMoonJDE, kForJDE } from './solar';

const DAY_MS = 86400000;
// The Chinese calendar is reckoned in China Standard Time (UTC+8): new-moon
// days, the winter-solstice day and the 中气 test all use CST civil days,
// independent of the device timezone.
const CST_OFFSET_MS = 8 * 3600000;

const toJD = (ms: number): number => ms / DAY_MS + 2440587.5;
const jdToMs = (jd: number): number => (jd - 2440587.5) * DAY_MS;

/** CST civil day number (days since 1970-01-01 in UTC+8) of an instant. */
const cstDayOf = (ms: number): number => Math.floor((ms + CST_OFFSET_MS) / DAY_MS);
/** UTC instant at which a CST civil day begins. */
const cstDayStartMs = (day: number): number => day * DAY_MS - CST_OFFSET_MS;
/** YYYY-MM-DD of a CST civil day. */
const cstDayISO = (day: number): string => new Date(day * DAY_MS).toISOString().slice(0, 10);

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

// ---- Lunation helpers (all in CST civil days) ----

/** CST day on which lunation k's conjunction falls. */
const nmDayCache = new Map<number, number>();
const newMoonDay = (k: number): number => {
  let d = nmDayCache.get(k);
  if (d === undefined) {
    d = cstDayOf(jdToMs(trueNewMoonJDE(k)));
    nmDayCache.set(k, d);
  }
  return d;
};

/** Lunation index k of the month containing CST day `day` (conjunction on or before that day). */
const lunationOnOrBefore = (day: number): number => {
  // Search up to the END of the CST day (start of the next one), not 24 h past the moment.
  const nmJDE = prevNewMoonJDE(toJD(cstDayStartMs(day + 1)) - 1e-9);
  let k = kForJDE(nmJDE);
  // Guard against index/day disagreement at the boundaries.
  while (newMoonDay(k) > day) k--;
  while (newMoonDay(k + 1) <= day) k++;
  return k;
};

/** Does the lunar month [startDay, endDay) contain a major solar term (中气) on a CST day inside it? */
const monthContainsMajorTerm = (startDay: number, endDay: number): boolean => {
  const startLon = getSolarLongitudeDeg(new Date(cstDayStartMs(startDay)));
  const endLon = getSolarLongitudeDeg(new Date(cstDayStartMs(endDay)));
  const diff = ((endLon - startLon) % 360 + 360) % 360;
  for (const angle of MAJOR_TERM_ANGLES) {
    const angleDist = ((angle - startLon) % 360 + 360) % 360;
    if (angleDist < diff) return true;
  }
  return false;
};

interface MonthLabel { k: number; month: number; leap: boolean }
interface SuiLayout { k11: number; kNext11: number; months: MonthLabel[]; kNewYear: number }

/**
 * Layout of the 岁 (sui) from month 11 of Gregorian year y (the month containing the
 * December solstice) up to, but excluding, the next month 11.
 */
const suiCache = new Map<number, SuiLayout>();
const getSui = (y: number): SuiLayout => {
  const cached = suiCache.get(y);
  if (cached) return cached;
  const m11K = (yy: number) => lunationOnOrBefore(cstDayOf(jdToMs(winterSolsticeJDE(yy))));
  const k11 = m11K(y);
  const kNext11 = m11K(y + 1);
  const hasLeap = kNext11 - k11 > 12;
  const months: MonthLabel[] = [{ k: k11, month: 11, leap: false }];
  let m = 11;
  let leapDone = !hasLeap;
  for (let k = k11 + 1; k < kNext11; k++) {
    if (!leapDone && !monthContainsMajorTerm(newMoonDay(k), newMoonDay(k + 1))) {
      months.push({ k, month: m, leap: true });
      leapDone = true;
      continue;
    }
    m = m % 12 + 1;
    months.push({ k, month: m, leap: false });
  }
  const kNewYear = months.find(x => x.month === 1 && !x.leap)!.k;
  const layout = { k11, kNext11, months, kNewYear };
  suiCache.set(y, layout);
  return layout;
};

/** Lunation index of 正月初一 of Gregorian year Y (it always falls in the sui of Y-1). */
const newYearK = (Y: number): number => getSui(Y - 1).kNewYear;

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
    stemIndex: stemIdx,
    branchIndex: branchIdx,
    display: `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`
  };
};

const getDayStemBranch = (cstDay: number) => {
  // JDN of the CST civil date; day index = (JDN + 49) mod 60, 0 = 甲子.
  // Check: 2000-01-01 (JDN 2451545) = 54 = 戊午.
  const cycle = ((cstDay + 2440588 + 49) % 60 + 60) % 60;
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
  const day = cstDayOf(date.getTime());
  const kNow = lunationOnOrBefore(day);

  // Pick the sui (month-11 to month-11 span) that contains today.
  let y = new Date(day * DAY_MS).getUTCFullYear();
  let sui = getSui(y);
  while (kNow < sui.k11) sui = getSui(--y);
  while (kNow >= sui.kNext11) sui = getSui(++y);

  const label = sui.months[kNow - sui.k11];
  const chineseMonth = label.month;
  const isLeapMonth = label.leap;

  // Lunar year: changes at 正月初一. sui.kNewYear is New Year of Gregorian year y+1.
  const lunarYear = kNow >= sui.kNewYear ? y + 1 : y;
  // Leap year = the lunar year (New Year to New Year) has 13 months.
  const isLeapYear = newYearK(lunarYear + 1) - newYearK(lunarYear) > 12;
  const cnyDisplay = cstDayISO(newMoonDay(sui.kNewYear));

  // Sexagenary cycles
  const yearSB = getYearStemBranch(lunarYear);
  const monthSB = getMonthStemBranch(yearSB.stemIndex, chineseMonth);
  const daySB = getDayStemBranch(day);

  const dayOfMonth = day - newMoonDay(kNow) + 1;

  const baseMonthName = CHINESE_MONTHS[(chineseMonth - 1 + 12) % 12];
  const monthName = isLeapMonth ? `闰${baseMonthName}` : baseMonthName;

  // CHINESE_DAYS already has correct names for 1-30 (e.g. 廿九 for 29, 三十 for 30)
  const dayName = CHINESE_DAYS[dayOfMonth] || `${dayOfMonth}日`;
  const displayDate = `${yearSB.display}年${monthName}${dayName}`;

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
    monthStemIndex: monthSB.stemIndex,
    monthBranchIndex: monthSB.branchIndex,
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

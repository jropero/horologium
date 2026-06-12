import { TzolkinDate, HaabDate, LongCount, LordOfTheNight, TZOLKIN_NAMES, HAAB_NAMES } from '../types/maya';

export interface MayaDate {
  longCount: LongCount;
  tzolkin: TzolkinDate;
  haab: HaabDate;
  lordOfTheNight: LordOfTheNight;
  tzolkinIndex: number;
}

const getJulianDayNumber = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let y = year;
  let m = month;

  if (m <= 2) {
    y--;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524;
};

export const getMayaDate = (modernTime: Date): MayaDate => {
  const jdn = getJulianDayNumber(modernTime);
  const mdn = jdn - 584283;

  const longCount: LongCount = {
    baktun: Math.floor(mdn / 144000),
    katun: Math.floor((mdn % 144000) / 7200),
    tun: Math.floor((mdn % 7200) / 360),
    uinal: Math.floor((mdn % 360) / 20),
    kin: mdn % 20,
  };

  const tzolkin: TzolkinDate = {
    number: ((mdn + 3) % 13) + 1,
    name: TZOLKIN_NAMES[(mdn + 19) % 20],
  };

  const dayOffset = (mdn + 348) % 365;
  const haab: HaabDate = {
    number: dayOffset % 20,
    name: HAAB_NAMES[Math.floor(dayOffset / 20)],
  };

  const gIndex = mdn % 9;
  const lordOfTheNight: LordOfTheNight = {
    id: gIndex === 0 ? 'G9' : 'G' + gIndex,
  };

  const tzolkinIndex = ((mdn + 159) % 260) + 1;

  return { longCount, tzolkin, haab, lordOfTheNight, tzolkinIndex };
};

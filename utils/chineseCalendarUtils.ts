import { chineseCalendarData, SolarTerm } from './chineseCalendarData';

export const getChineseCalendarData = (date: Date): { term: SolarTerm; pentad: number; daysUntilChange: number } => {
  // Simple approximation: 24 terms in a year of 365 days = ~15.2 days per term
  // Solar terms typically start around Feb 4 (Day 35 of the year)
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diffInDays = (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
  
  // Offset to align Feb 4th with index 0 (Lìchūn)
  // Day 35 is roughly Lìchūn.
  const adjustedDay = (diffInDays - 35 + 365) % 365;
  const termIndex = Math.floor(adjustedDay / 15.2) % 24;
  
  const term = chineseCalendarData[termIndex] || chineseCalendarData[0];
  
  // Pentad logic: ~5 days per pentad (3 pentads per term)
  const dayInTerm = adjustedDay % 15.2;
  const pentad = Math.min(Math.floor(dayInTerm / 5) + 1, 3);
  
  const daysUntilChange = 15 - Math.floor(dayInTerm);

  return { term, pentad, daysUntilChange };
};


import { ROMAN_YEAR_DATA, YearDayEntry } from './romanYearData';

export type DayStatus = 'F' | 'N' | 'NP' | 'C' | 'EN';

export interface RomanDayInfo {
    status: DayStatus;
    statusFull: string;
    festivalName?: string;
    description?: string; // Spanish Description of the Day/Festival
    god: string; // The specific God of the Day (Deus Diei)
    isMajorFestival: boolean;
}

export const getRomanDayInfo = (date: Date): RomanDayInfo => {
    const month = date.getMonth();
    const day = date.getDate(); // 1-31
    const key = `${month}-${day}`;

    // Look up in our extensive year database
    const entry = ROMAN_YEAR_DATA[key];

    if (entry) {
        return {
            status: entry.status,
            statusFull: entry.statusFull,
            festivalName: entry.festivalName || undefined,
            description: entry.festivalDesc || entry.deityDesc,
            god: entry.deity,
            isMajorFestival: entry.status === 'NP' || !!entry.festivalName // Assume NP or named festival is major
        };
    }

    // Fallback (Should typically not happen if 365 data is complete, but good for safety)
    return {
        status: 'F',
        statusFull: "Dies Fastus",
        isMajorFestival: false,
        god: "Genius Huius Diei",
        description: "Un día común en el calendario romano.",
    };
}

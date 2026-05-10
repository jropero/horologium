import { getAtticDate } from '../utils/atticCalendarUtils';
const date = new Date('2026-03-02T12:00:00Z');
const attic = getAtticDate(date);
console.log(JSON.stringify(attic, null, 2));

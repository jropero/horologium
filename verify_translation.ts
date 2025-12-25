
import { getHistoricalEvents, HistoricalEvent } from './utils/romanHistoryData';

console.log("Verifying Bilingual Ephemerides...");

// Check March 15 (Ides of March)
const idesMarch = new Date('2025-03-15T12:00:00');
const eventsMarch15 = getHistoricalEvents(idesMarch);

if (eventsMarch15.length > 0) {
    eventsMarch15.forEach((evt: HistoricalEvent) => {
        console.log(`[LATIN]: ${evt.latin}`);
        console.log(`[SPANISH]: ${evt.spanish}`);
    });
} else {
    console.log("No events found for March 15 (Error?)");
}

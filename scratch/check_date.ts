import { getAtticDate } from '../utils/atticCalendarUtils';

function findFestivalDate(month: number, day: number) {
    const start = new Date('2026-01-01');
    for (let i = 0; i < 365; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const attic = getAtticDate(d);
        if (attic.monthIndex === month && attic.dayOfMonth === day) {
            return d.toISOString().split('T')[0];
        }
    }
    return null;
}

const tests = [
    { name: "Urban Dionysia (Teatro y Liturgias)", m: 8, d: 10 },
    { name: "Rural Dionysia (Askoliasmos)", m: 5, d: 19 },
    { name: "Thargelia (Coros y Trípodes)", m: 10, d: 7 },
    { name: "Panathenaia (Apobatai y Aceite)", m: 0, d: 28 }
];

tests.forEach(t => {
    console.log(`${t.name}: ?date=${findFestivalDate(t.m, t.d)}`);
});

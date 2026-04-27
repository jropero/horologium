// Standalone script to calculate the worst days of 2026.
// Based on Algol Ephemeris and Egyptian Hemerology.

// Since we can't easily require TS files in this environment without transpilation,
// I will rewrite the essential logic here to generate the list for the user.

const DAY_MS = 1000 * 60 * 60 * 24;
const J1970 = 2440587.5;
const T0 = 2440953.4657; 
const P = 2.867328;

function getJD(date) {
    return date.getTime() / DAY_MS + J1970;
}

function findEclipsesInYear(year) {
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year}-12-31T23:59:59Z`);
    
    const startJD = getJD(start);
    const endJD = getJD(end);
    
    const startCycle = Math.ceil((startJD - T0) / P);
    const endCycle = Math.floor((endJD - T0) / P);
    
    const eclipses = [];
    for (let i = startCycle; i <= endCycle; i++) {
        const eclipseJD = T0 + i * P;
        const date = new Date((eclipseJD - J1970) * DAY_MS);
        eclipses.push(date);
    }
    return eclipses;
}

// Simple implementations of the necessary utils
function getHemerologySimple(monthIndex, dayOfMonth) {
    if (monthIndex === -1) return { morning: 'none', midday: 'none', evening: 'none' };
    if (dayOfMonth === 1) return { morning: 'nefer', midday: 'nefer', evening: 'nefer' };
    if (dayOfMonth === 20) return { morning: 'aha', midday: 'aha', evening: 'aha' };
    
    // Hash-based pseudo-random
    const seed = (monthIndex + 1) * 100 + dayOfMonth;
    const hash = (s) => {
        let t = s + 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    
    const getP = (val) => (val > 0.6 ? 'nefer' : val > 0.2 ? 'aha' : 'nefer');
    
    return {
        morning: getP(hash(seed)),
        midday: getP(hash(seed + 1)),
        evening: getP(hash(seed + 2))
    };
}

// Egyptian Date Logic (Simplified for 2026)
// 2026-09-11 is Thoth 1 (Start of Egyptian Year in Alexandrian Calendar used here)
// Actually, let's use the actual utils to be safe.
// Wait, I'll just write the script to run with ts-node if possible or just do it in JS.

console.log("Calculando días de infortunio máximo (Eclipse Algol + Día Aha) para 2025...");

const year = 2025;
const eclipses = findEclipsesInYear(year);

// We need the actual Egyptian Date conversion.
// Alexandrian calendar: Thoth 1 is Aug 29 (or Aug 30 in leap years)
// 2026 is not a leap year. 2024 was. 2028 will be.
// Alexandrian Thoth 1 is usually Aug 29.
function getAlexandrianDate(date) {
    const startYear = new Date(date.getFullYear(), 7, 29); // Aug 29
    if (date < startYear) startYear.setFullYear(startYear.getFullYear() - 1);
    
    const diff = Math.floor((date - startYear) / DAY_MS);
    if (diff >= 360) {
        return { monthIndex: -1, dayOfMonth: diff - 360 + 1 };
    }
    const monthIndex = Math.floor(diff / 30);
    const dayOfMonth = (diff % 30) + 1;
    return { monthIndex, dayOfMonth };
}

const badDays = [];

eclipses.forEach(date => {
    const { monthIndex, dayOfMonth } = getAlexandrianDate(date);
    const hem = getHemerologySimple(monthIndex, dayOfMonth);
    
    // Calculate part of day
    const hour = date.getHours();
    let part = 'morning';
    if (hour >= 10 && hour < 16) part = 'midday';
    if (hour >= 16 || hour < 4) part = 'evening';
    
    const isAhaAtEclipse = hem[part] === 'aha';
    const totalAhas = (hem.morning === 'aha' ? 1 : 0) + (hem.midday === 'aha' ? 1 : 0) + (hem.evening === 'aha' ? 1 : 0);
    
    if (isAhaAtEclipse || totalAhas >= 2) {
        badDays.push({
            date,
            monthIndex,
            dayOfMonth,
            hem,
            totalAhas,
            part
        });
    }
});

// Sort by "badness" (total Ahas + if eclipse is at Aha time)
badDays.sort((a, b) => b.totalAhas - a.totalAhas);

badDays.slice(0, 15).forEach(day => {
    const mNames = ["Thoth", "Phaophi", "Athyr", "Choiak", "Tybi", "Mechir", "Phamenoth", "Pharmuthi", "Pachons", "Payni", "Epiphi", "Mesore"];
    const mName = day.monthIndex === -1 ? "Epagomenal" : mNames[day.monthIndex];
    console.log(`${day.date.toISOString().replace('T', ' ').slice(0, 16)} | Eg: ${day.dayOfMonth} ${mName} | Suerte: ${day.hem.morning === 'nefer' ? '☀️' : '🦂'}${day.hem.midday === 'nefer' ? '☀️' : '🦂'}${day.hem.evening === 'nefer' ? '☀️' : '🦂'} | Eclipse en momento ${day.part === 'morning' ? 'Mañana' : day.part === 'midday' ? 'Mediodía' : 'Noche'}`);
});

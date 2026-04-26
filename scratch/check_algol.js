const epoch = new Date(2000, 0, 1);
const now = new Date(2026, 3, 26, 18, 1, 55); // April 26, 2026
const diffMs = now.getTime() - epoch.getTime();
const diffDays = diffMs / (1000 * 60 * 60 * 24);
const cycleDays = 2.85;
const phase = (diffDays % cycleDays) / cycleDays;
const normalizedPhase = phase < 0 ? phase + 1 : phase;
const isEclipsed = normalizedPhase <= 0.15 || normalizedPhase >= 0.85;

console.log({
    diffDays,
    phase: normalizedPhase,
    isEclipsed
});

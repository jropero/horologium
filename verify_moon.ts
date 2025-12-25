const J1970 = 2440588;
const DAY_MS = 1000 * 60 * 60 * 24;

const toJulian = (date: Date) => date.valueOf() / DAY_MS - 0.5 + J1970;

const getMoonPhase = (date: Date): number => {
    const jd = toJulian(date);
    const T = (jd - 2451545.0) / 36525.0;

    const RAD = Math.PI / 180;

    // Mean Elongation of Moon
    const D = 297.85019 + 445267.111480 * T - 0.0019142 * T * T + T * T * T / 189474;

    // Sun Mean Anomaly
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T + T * T * T / 24490000;

    // Moon Mean Anomaly
    const M_ = 134.96340 + 477198.86752 * T + 0.0086972 * T * T + T * T * T / 56250;

    // Periodic terms (degrees)
    const elongation = D
        + 6.289 * Math.sin(M_ * RAD)
        - 2.100 * Math.sin(M * RAD)
        - 1.274 * Math.sin((2 * D - M_) * RAD)
        + 0.658 * Math.sin(2 * D * RAD)
        - 0.114 * Math.sin(2 * M_ * RAD)
        - 0.055 * Math.sin(2 * D - 2 * M_ * RAD);

    return (elongation % 360 + 360) % 360; // Degrees
};

// Known New Moon: Jan 6, 2000 at 18:14 UTC
const testDate = new Date('2000-01-06T18:14:00Z');
const elong = getMoonPhase(testDate);

console.log(`J2000 Check: ${testDate.toISOString()}`);
console.log(`Elongation: ${elong.toFixed(4)} degrees`);
console.log(`Expected: ~0 degrees (or 360)`);

if (elong < 1.0 || elong > 359.0) {
    console.log("PASS: Formula matches J2000.");
} else {
    console.log("FAIL: Formula drift at J2000.");
}

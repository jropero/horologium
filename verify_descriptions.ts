
import { ROMAN_YEAR_DATA } from './utils/romanYearData';

let festivalCount = 0;
let missingDescCount = 0;
let shortDescCount = 0;

console.log("Verifying Festival Descriptions...");

for (const [key, day] of Object.entries(ROMAN_YEAR_DATA)) {
    if (day.festivalName) {
        festivalCount++;
        if (!day.festivalDesc) {
            console.error(`MISSING DESC: ${key} - ${day.festivalName}`);
            missingDescCount++;
        } else {
            if (day.festivalDesc.length < 20) {
                console.warn(`SHORT DESC: ${key} - ${day.festivalName}: ${day.festivalDesc}`);
                shortDescCount++;
            }
            // Print a sample from each season
            if (key === '3-1' || key === '6-9' || key === '9-13' || key === '12-17') {
                console.log(`SAMPLE (${key} - ${day.festivalName}): ${day.festivalDesc}`);
            }
        }
    }
}

console.log(`\nTotal Festivals: ${festivalCount}`);
console.log(`Missing Descriptions: ${missingDescCount}`);
console.log(`Short Descriptions (<20 chars): ${shortDescCount}`);

if (missingDescCount === 0) {
    console.log("SUCCESS: All festivals have descriptions.");
} else {
    console.log("FAILURE: Some festivals are missing descriptions.");
}

// greekEra.ts — Greek chronological eras for display.
// Kept dependency-free so both the Hellenic time engine and the Attic
// calendar builders can share it without a circular import.

/**
 * Converts a number to Ancient Greek alphabetic numerals (Milesian system).
 * Used for the Olympiad label.
 */
export const toGreekNumeral = (n: number): string => {
  // For simplicity, use standard numerals with Greek styling for large numbers
  // Ancient Greek used alphabetic numerals (Milesian system)
  if (n <= 0) return '0';

  const units = ['', 'αʹ', 'βʹ', 'γʹ', 'δʹ', 'εʹ', 'ϛʹ', 'ζʹ', 'ηʹ', 'θʹ'];
  const tens = ['', 'ιʹ', 'κʹ', 'λʹ', 'μʹ', 'νʹ', 'ξʹ', 'οʹ', 'πʹ', 'ϟʹ'];
  const hundreds = ['', 'ρʹ', 'σʹ', 'τʹ', 'υʹ', 'φʹ', 'χʹ', 'ψʹ', 'ωʹ', 'ϡʹ'];

  if (n < 10) return units[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return (tens[t] + (u > 0 ? units[u] : '')).replace(/ʹ(?=.*ʹ)/g, '');
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    const result = hundreds[h] + (rest > 0 ? toGreekNumeral(rest) : '');
    return result.replace(/ʹ(?=.*ʹ)/g, '');
  }
  // For numbers >= 1000, just use the number directly
  return n.toString();
};

// Olympiad year calculation (776 BC = Ol. 1, Year 1)
export const getOlympiadYear = (gregorianYear: number): { olympiad: number; year: number; label: string } => {
  const yearsSinceFirstOlympiad = gregorianYear + 775; // 776 BC = year 0 in this system
  const olympiad = Math.floor(yearsSinceFirstOlympiad / 4) + 1;
  const year = (yearsSinceFirstOlympiad % 4) + 1;
  return {
    olympiad,
    year,
    label: `Ὀλ. ${toGreekNumeral(olympiad)}, ἔτος ${year}`
  };
};

export const transliterateGreek = (text: string): string => {
  if (!text) return '';

  let normalized = text.normalize("NFD");
  
  // Handlers for specific digraphs (gamma nasal)
  normalized = normalized.replace(/γ(?=[γκξχ])/g, "n");
  normalized = normalized.replace(/Γ(?=[γκξχ])/g, "N");

  // Diphthongs where upsilon is "u" instead of "y"
  // look for a, e, o followed by υ (all with possible intermediate combining marks)
  normalized = normalized.replace(/([αεοΑΕΟ][\u0300-\u036f]*)υ/g, "$1u");
  normalized = normalized.replace(/([αεοΑΕΟ][\u0300-\u036f]*)Υ/g, "$1U");

  // Handle rough breathing (\u0314). In NFD, it comes after the base letter.
  // We want to prepend 'h' (or 'H') to the base letter.
  normalized = normalized.replace(/([αεηιουωρΑΕΗΙΟΥΩΡ])([\u0300-\u0313]*)\u0314/g, (match, base, accents) => {
    if (base >= 'A' && base <= 'Ω') {
      // If capital, make H capital and base lowercase (e.g. Ἁ -> Ha)
      return 'H' + base.toLowerCase() + accents;
    }
    return 'h' + base + accents;
  });

  // Base character mappings
  const charMap: Record<string, string> = {
    'α': 'a', 'Α': 'A',
    'β': 'b', 'Β': 'B',
    'γ': 'g', 'Γ': 'G',
    'δ': 'd', 'Δ': 'D',
    'ε': 'e', 'Ε': 'E',
    'ζ': 'z', 'Ζ': 'Z',
    'η': 'e', 'Η': 'E', // To keep it standard Spanish/Latin looking, we use e instead of e with macron
    'θ': 'th', 'Θ': 'Th',
    'ι': 'i', 'Ι': 'I',
    'κ': 'k', 'Κ': 'K',
    'λ': 'l', 'Λ': 'L',
    'μ': 'm', 'Μ': 'M',
    'ν': 'n', 'Ν': 'N',
    'ξ': 'x', 'Ξ': 'X',
    'ο': 'o', 'Ο': 'O',
    'π': 'p', 'Π': 'P',
    'ρ': 'r', 'Ρ': 'R',
    'σ': 's', 'ς': 's', 'Σ': 'S',
    'τ': 't', 'Τ': 'T',
    'υ': 'y', 'Υ': 'Y', // Dipthongs already replaced with u above
    'φ': 'ph', 'Φ': 'Ph',
    'χ': 'ch', 'Χ': 'Ch',
    'ψ': 'ps', 'Ψ': 'Ps',
    'ω': 'o', 'Ω': 'O',
  };

  let result = "";
  for (const char of normalized) {
    if (charMap[char]) {
      result += charMap[char];
    } else {
      // Retain acute (\u0301), grave (\u0300) and circumflex (\u0342 mapped to circumflex)
      if (char === '\u0313' || char === '\u0314' || char === '\u0345') {
        // Drop smooth breathing, rough breathing (already handled), and iota subscript
        continue;
      }
      if (char === '\u0342' || char === '\u0303') {
        result += '\u0302'; // Convert greek perispomeni to standard circumflex
        continue;
      }
      result += char;
    }
  }

  return result.normalize("NFC");
};

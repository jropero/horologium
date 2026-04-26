// egyptianAstronomy.ts — Egyptian Archaeoastronomy
// Based on PLOS ONE (2015): "Did the Ancient Egyptians Record the Period of the Eclipsing Binary Algol?"

export interface AlgolState {
  phase: number;
  isEclipsed: boolean;
  stateText: string;
}

/**
 * Calculates the phase of Algol based on the historical cycle of 2.85 days
 * recorded in the Cairo Papyrus 86637.
 */
export const getAlgolPhase = (date: Date): AlgolState => {
  // Epoch: January 1, 2000
  const epoch = new Date(2000, 0, 1);
  const diffMs = date.getTime() - epoch.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const cycleDays = 2.85;
  const phase = (diffDays % cycleDays) / cycleDays;
  const normalizedPhase = phase < 0 ? phase + 1 : phase;

  // Algol's eclipse (minimum brightness) lasts about 10 hours.
  // In a 2.85 day cycle, 10 hours is approx 14-15% of the cycle.
  // We use the range [0.0 - 0.15] and [0.85 - 1.0] for the minimum.
  const isEclipsed = normalizedPhase <= 0.15 || normalizedPhase >= 0.85;

  return {
    phase: normalizedPhase,
    isEclipsed,
    stateText: isEclipsed 
      ? "El Ojo de Horus se oscurece (Mínimo estelar)" 
      : "El Ojo de Horus brilla con fuerza"
  };
};

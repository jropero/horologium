/**
 * egyptianHemerologyData.ts — Egyptian "Good and Bad Days" (Hemerology)
 * Based on the Cairo Papyrus 86637 and real-time astrophysics.
 */

import { getAlgolPhase, getLunarPhase } from './egyptianAstronomy';

export type Prognosis = 'nefer' | 'aha' | 'none';

export interface DailyHemerology {
  morning: Prognosis;
  midday: Prognosis;
  evening: Prognosis;
  instruction?: string;
}

/**
 * CAIRO_PAPYRUS_RECORDS: Historical dogmas from the Cairo Papyrus 86637.
 * Key format: "monthIndex-dayOfMonth" (0-indexed month, 1-indexed day).
 */
export const CAIRO_PAPYRUS_RECORDS: Record<string, DailyHemerology> = {
  "0-8": { morning: 'nefer', midday: 'nefer', evening: 'aha', instruction: "No salgas de casa durante la noche" },
  "0-15": { morning: 'nefer', midday: 'aha', evening: 'aha' },
  "0-22": { morning: 'aha', midday: 'aha', evening: 'aha', instruction: "No comas pescado hoy. Los dioses tomaron forma de pez" },
  "0-25": { morning: 'nefer', midday: 'nefer', evening: 'aha', instruction: "Quédate dentro de casa por la tarde" },
  "0-27": { morning: 'nefer', midday: 'nefer', evening: 'nefer', instruction: "Horus y Seth descansan. No mates serpientes hoy" },
  "1-16": { morning: 'aha', midday: 'aha', evening: 'aha', instruction: "Día aciago de Osiris. No te acerques a procesiones funerarias" },
  "2-24": { morning: 'aha', midday: 'aha', evening: 'aha', instruction: "Horus se enfrenta al Caos. Evita viajar" },
  "4-5": { morning: 'aha', midday: 'aha', evening: 'aha', instruction: "El poder de Sekhmet se desata" },
  "5-14": { morning: 'aha', midday: 'nefer', evening: 'nefer', instruction: "Aparición de Seth. Infortunio antes del amanecer" },
  "6-28": { morning: 'aha', midday: 'aha', evening: 'aha', instruction: "Osiris en el inframundo. No pronuncies conjuros" },
  "10-15": { morning: 'aha', midday: 'aha', evening: 'aha', instruction: "Las fuerzas de los dioses chocan en el cielo" },
  "11-13": { morning: 'aha', midday: 'aha', evening: 'aha', instruction: "Día de extremo peligro, no hagas trabajos pesados" }
};

/**
 * Returns the hemerology prognosis for a given Egyptian date.
 * Combines historical records with real-time astronomical observations.
 * 
 * @param date The real-world date for astronomical calculations.
 * @param monthIndex 0-11 for regular months, -1 for epagomenal days.
 * @param dayOfMonth 1-30 for regular months, 1-5/6 for epagomenal days.
 */
export const getHemerologyForDate = (date: Date, monthIndex: number, dayOfMonth: number): DailyHemerology => {
  // 1. Días de los Dioses (Epagómenos): No hay pronóstico hemerológico estándar.
  if (monthIndex === -1) {
    return { morning: 'none', midday: 'none', evening: 'none' };
  }

  // 2. Dogmas Universales del Mes
  if (dayOfMonth === 1) {
    return { morning: 'nefer', midday: 'nefer', evening: 'nefer' }; // Nacimiento del mes
  }
  if (dayOfMonth === 20) {
    return { morning: 'aha', midday: 'aha', evening: 'aha' }; // Número del Caos
  }

  // 3. Búsqueda en Papiro de El Cairo (O(1))
  const dateKey = `${monthIndex}-${dayOfMonth}`;
  if (CAIRO_PAPYRUS_RECORDS[dateKey]) {
    return CAIRO_PAPYRUS_RECORDS[dateKey];
  }

  // 4. Oráculo en Tiempo Real (Fallback Astrofísico)
  // El sacerdote observa el cielo real para los días no documentados.
  const moon = getLunarPhase(date);
  const algol = getAlgolPhase(date);

  // Mañana: Dominio de Seth (Luna). Peligro en Luna Nueva o Llena.
  const isSethActive = (moon < 0.05 || moon > 0.95) || (moon > 0.45 && moon < 0.55);
  const morning: Prognosis = isSethActive ? 'aha' : 'nefer';

  // Noche: Dominio de Horus (Algol). Peligro si el Ojo de Horus se oscurece.
  const evening: Prognosis = algol.isEclipsed ? 'aha' : 'nefer';

  // Mediodía: Equilibrio del Maat basado en el ciclo de 3 días.
  const midday: Prognosis = (dayOfMonth % 3 === 0) ? 'aha' : 'nefer';

  return { morning, midday, evening };
};

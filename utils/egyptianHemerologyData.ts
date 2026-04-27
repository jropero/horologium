// egyptianHemerologyData.ts — Egyptian "Good and Bad Days" (Hemerology)
// Based on the Cairo Papyrus 86637.
// Divides the day into Morning, Midday, and Evening/Night.

export type Prognosis = 'nefer' | 'aha' | 'none';

export interface DailyHemerology {
  morning: Prognosis;
  midday: Prognosis;
  evening: Prognosis;
  instruction?: string;
}

/**
 * Returns the hemerology prognosis for a given Egyptian date.
 * 
 * @param monthIndex 0-11 for regular months, -1 for epagomenal days.
 * @param dayOfMonth 1-30 for regular months, 1-5/6 for epagomenal days.
 */
export const getHemerologyForDate = (monthIndex: number, dayOfMonth: number): DailyHemerology => {
  // Regla 1 (Días Epagómenos): No hay pronóstico para estos días.
  if (monthIndex === -1) {
    return { morning: 'none', midday: 'none', evening: 'none' };
  }

  // Regla 2 (Día 1 del mes): Día de excelente suerte y festividad mensual.
  if (dayOfMonth === 1) {
    return { morning: 'nefer', midday: 'nefer', evening: 'nefer' };
  }

  // Regla 3 (Día 20 del mes): Número inherente a la mala suerte.
  if (dayOfMonth === 20) {
    return { morning: 'aha', midday: 'aha', evening: 'aha' };
  }

  // Regla 4 (Días específicos del Papiro de El Cairo):
  
  // Mes 0 (Akhet I)
  if (monthIndex === 0) {
    if (dayOfMonth === 8) {
      return { 
        morning: 'nefer', midday: 'nefer', evening: 'aha', 
        instruction: "No salgas de casa durante la noche" 
      };
    }
    if (dayOfMonth === 15) {
      return { morning: 'nefer', midday: 'aha', evening: 'aha' };
    }
    if (dayOfMonth === 22) {
      return { 
        morning: 'aha', midday: 'aha', evening: 'aha', 
        instruction: "No comas pescado hoy. Los dioses tomaron forma de pez" 
      };
    }
    if (dayOfMonth === 25) {
      return { 
        morning: 'nefer', midday: 'nefer', evening: 'aha', 
        instruction: "Quédate dentro de casa por la tarde" 
      };
    }
  }

  // Mes 5 (Peret II)
  if (monthIndex === 5 && dayOfMonth === 14) {
    return { 
      morning: 'aha', midday: 'nefer', evening: 'nefer', 
      instruction: "Aparición de Seth. Infortunio antes del amanecer" 
    };
  }

  // Regla 5 (Resto de días): Generador pseudo-aleatorio basado en una semilla.
  // Usamos el mes y el día para que sea consistente.
  const seed = (monthIndex + 1) * 100 + dayOfMonth;
  
  // Función simple de hash para obtener valores deterministas basados en la semilla
  const hash = (s: number) => {
    let t = s + 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const p1 = hash(seed);
  const p2 = hash(seed + 1);
  const p3 = hash(seed + 2);

  const getPrognosis = (val: number): Prognosis => {
    if (val > 0.2) return 'nefer';
    return 'aha'; // 20% de probabilidad de Aha
  };

  return {
    morning: getPrognosis(p1),
    midday: getPrognosis(p2),
    evening: getPrognosis(p3)
  };
};

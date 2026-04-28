/**
 * egyptianFestivalsData.ts
 * Base de datos de festividades egipcias basadas en los papiros de Illahun, Medinet Habu y el Ramesseum.
 */

export interface Festival {
  name: string;
  description: string;
}

/**
 * CIVIL_FESTIVALS: Festividades de fecha fija en el calendario civil (alejandrino/egipcio).
 * Mapeado por una clave string "mes-dia" o rangos lógicos.
 */
export const CIVIL_FESTIVALS: Record<string, Festival> = {
  "0-1": {
    name: "Wep Renpet (El Abridor del Año)",
    description: "Marca el inicio del año agrícola y la crecida del Nilo. Día de renovación, ofrendas a los dioses locales y celebración del cumpleaños de Ra-Horakhty."
  },
  "0-17": {
    name: "Víspera de Wagy",
    description: "Preparativos nocturnos para la gran festividad de los ancestros."
  },
  "0-18": {
    name: "Festival Fijo de Wagy",
    description: "Festividad mortuoria muy solemne. Se hacían ofrendas de comida y bebida para asegurar el viaje de los difuntos y de Osiris al más allá."
  },
  "0-19": {
    name: "Festival de Thoth",
    description: "Día dedicado al dios de la sabiduría, la luna y la escritura."
  },
  "2-30": {
    name: "Procesión de Hathor",
    description: "Dedicado a la diosa del amor, la embriaguez y la música. Conllevaba banquetes y cantos."
  },
  "3-26": {
    name: "Gran Festival de Sokar",
    description: "El dios halcón del inframundo es transportado en su barca Henu. Culminaba con la resurrección de Osiris."
  },
  "3-30": {
    name: "Levantamiento del Pilar Djed",
    description: "El Faraón erigía un pilar sagrado que simbolizaba la columna vertebral de Osiris, devolviendo la estabilidad al mundo."
  },
  "4-1": {
    name: "Festival de Neheb-Kau",
    description: "Marca el triunfo de Horus sobre Seth, la coronación del nuevo rey y el restablecimiento del Maat (orden cósmico)."
  },
  "5-1": {
    name: "Navegación de Anubis",
    description: "Ritos fluviales relacionados con la momificación y el dios chacal protector de los muertos."
  },
  "5-30": {
    name: "Levantamiento del Cielo y Fiesta de Ptah",
    description: "Festividad de origen menfita que conmemora el acto de la creación divina y el alzamiento de la bóveda celeste."
  },
  "6-1": {
    name: "Gran Quema (Rokeh Wer)",
    description: "Se encendían grandes hogueras sagradas para alejar a los demonios y las fuerzas del Caos durante la época fría."
  },
  "7-1": {
    name: "Pequeña Quema (Rokeh Nedjes)",
    description: "Continuación de los rituales de fuego apotropaicos para proteger a Egipto."
  },
  "7-4": {
    name: "Masticación de Cebollas para Bastet",
    description: "Un ritual nocturno para alejar el mal aliento de los espíritus malignos, honrando a la diosa leona/gata Bastet."
  },
  "8-1": {
    name: "Gran Festival de Renenutet",
    description: "Dedicado a la diosa serpiente protectora de los graneros. Se le ofrecían las primicias de la cosecha recién recolectada."
  },
  "8-10": {
    name: "Vistiendo a Anubis",
    description: "Ceremonias de renovación de las vendas y amuletos sagrados en la necrópolis."
  },
  "10-28": {
    name: "Inicio del Festival de Epiphi",
    description: "Fiestas de renovación del templo y de los ancestros reales."
  },
  "11-9": {
    name: "Unión con el Disco Solar",
    description: "Las estatuas de los dioses eran llevadas al techo del templo para recargarse con la energía directa del sol (Ra)."
  },
  // Epagómenos (usaremos monthIndex -1 en la lógica de búsqueda)
  "e-1": {
    name: "Nacimiento de Osiris",
    description: "Primer día fuera del tiempo. Día nefasto, origen del señor del inframundo."
  },
  "e-2": {
    name: "Nacimiento de Horus (Haroeris)",
    description: "Día afortunado. Nacimiento del halcón divino."
  },
  "e-3": {
    name: "Nacimiento de Seth",
    description: "Día terrible. Nacimiento del dios del caos y el desierto."
  },
  "e-4": {
    name: "Nacimiento de Isis",
    description: "Día hermoso. Nacimiento de la diosa de la magia y madre protectora."
  },
  "e-5": {
    name: "Nacimiento de Neftis",
    description: "Nacimiento de la diosa de los lamentos y protectora de los difuntos."
  }
};

/**
 * LUNAR_FESTIVALS: Festividades que dependen del día lunar (1-30).
 */
export const LUNAR_FESTIVALS: Record<number, Festival> = {
  1: {
    name: "Festival de Mover la Arena (hnp-s')",
    description: "Ritual de purificación de los cimientos de los templos y preparación del espacio sagrado al nacer la luna."
  },
  3: {
    name: "Festival de la Vestimenta (Mnht)",
    description: "Los sacerdotes cambiaban los ropajes y ornamentos de las estatuas divinas en los santuarios cerrados."
  },
  4: {
    name: "Festival de la Alegría (Ihhy)",
    description: "Día de júbilo, cantos y música rítmica en el recinto del templo."
  },
  6: {
    name: "Día del Buen Pan",
    description: "Preparación y ofrenda de panes sagrados recién horneados para el altar divino."
  },
  10: {
    name: "Excursión de la Tierra (hnt-nt-t3)",
    description: "La deidad abandonaba su santuario para inspeccionar y bendecir los campos circundantes."
  },
  15: {
    name: "Fiesta del Plenilunio",
    description: "Momento de máximo poder mágico. A menudo coincidía con la instalación de animales sagrados como el Toro Apis."
  },
  17: {
    name: "Festival Móvil de Wagy",
    description: "Calculado en la tercera lunación tras la aparición de Sirio, este antiguo ritual honraba a las almas transfiguradas (Akh)."
  },
  20: {
    name: "Línea de la Milla del Nilo (sspt itrw)",
    description: "Ceremonia vital de medición del nivel de las aguas y delimitación de fronteras tras la inundación."
  },
  22: {
    name: "Festival de la Partida (hnt)",
    description: "Procesiones sagradas hacia necrópolis u otros santuarios hermanos."
  },
  23: {
    name: "Cuarto Menguante (dnit sn-nw)",
    description: "Rituales de protección durante la fase de oscurecimiento y debilidad de la luna."
  }
};

/**
 * Recupera los festivales (tanto civiles como lunares) para una fecha dada.
 */
export function getFestivalsForDate(monthIndex: number, dayOfMonth: number, lunarDay: number): { civilFestivals: Festival[], lunarFestivals: Festival[] } {
  const civilFestivals: Festival[] = [];
  const lunarFestivals: Festival[] = [];

  // 1. Festivales Civiles Fijos (por clave)
  const key = monthIndex === -1 ? `e-${dayOfMonth}` : `${monthIndex}-${dayOfMonth}`;
  if (CIVIL_FESTIVALS[key]) {
    civilFestivals.push(CIVIL_FESTIVALS[key]);
  }

  // 2. Casos Especiales de Festivales Civiles (Rangos o Múltiples Días)
  
  // Mes 1, Días 15 al 30: Festival de Opet
  if (monthIndex === 1 && dayOfMonth >= 15 && dayOfMonth <= 30) {
    civilFestivals.push({
      name: "Festival de Opet",
      description: "La estatua de Amón viajaba en barca desde Karnak al templo de Lúxor para renovar la fuerza divina del Faraón."
    });
  }

  // Mes 3, Días 1 al 7: Festival de Khoiak (Ka-her-ka)
  if (monthIndex === 3 && dayOfMonth >= 1 && dayOfMonth <= 7) {
    civilFestivals.push({
      name: "Festival de Khoiak (Ka-her-ka)",
      description: "Semana de misterios osiríacos. Se fabricaban figuras de limo y semillas ('Osiris germinantes') como símbolo de vida."
    });
  }

  // Mes 6, Día 1: Doble festival (Ptah y Gran Quema)
  // El de Ptah ya se incluye por la clave "5-30 y 6-1" (que manejaremos aquí también para el día 1 del mes 6)
  if (monthIndex === 6 && dayOfMonth === 1) {
    civilFestivals.push({
      name: "Levantamiento del Cielo y Fiesta de Ptah",
      description: "Festividad de origen menfita que conmemora el acto de la creación divina y el alzamiento de la bóveda celeste."
    });
  }

  // 3. Festivales Lunares
  if (LUNAR_FESTIVALS[lunarDay]) {
    lunarFestivals.push(LUNAR_FESTIVALS[lunarDay]);
  }

  return { civilFestivals, lunarFestivals };
}

/**
 * Encuentra los próximos N festivales civiles fijos a partir de una fecha.
 */
export function getNextEgyptianFestivals(monthIndex: number, dayOfMonth: number, count: number = 3): (Festival & { date: string, daysRemaining: number })[] {
  const results: (Festival & { date: string, daysRemaining: number })[] = [];
  let currentMonth = monthIndex;
  let currentDay = dayOfMonth + 1; // Empezamos a buscar desde mañana

  // Iteramos hasta 365 días para cubrir todo el año
  for (let i = 0; i < 365 && results.length < count; i++) {
    const daysFromNow = i + 1;
    if (currentMonth === -1) {
      // Epagómenos
      if (currentDay > 5) {
        currentMonth = 0;
        currentDay = 1;
      }
    } else {
      if (currentDay > 30) {
        currentMonth++;
        currentDay = 1;
        if (currentMonth > 11) {
          currentMonth = -1; // Entramos en epagómenos
        }
      }
    }

    const key = currentMonth === -1 ? `e-${currentDay}` : `${currentMonth}-${currentDay}`;
    if (CIVIL_FESTIVALS[key]) {
      const monthName = currentMonth === -1 ? "Epagomenai" : ["Thoth", "Phaophi", "Athyr", "Choiak", "Tybi", "Mechir", "Phamenoth", "Pharmuthi", "Pachon", "Payni", "Epiphi", "Mesore"][currentMonth];
      results.push({
        ...CIVIL_FESTIVALS[key],
        date: `${currentDay} de ${monthName}`,
        daysRemaining: daysFromNow
      });
    }

    // Casos especiales (Opet, Khoiak, etc.) - Solo el primer día del rango para no saturar
    if (currentMonth === 1 && currentDay === 15) {
      results.push({ 
        name: "Festival de Opet", 
        description: "La estatua de Amón viajaba en barca desde Karnak al templo de Lúxor para renovar la fuerza divina del Faraón.", 
        date: "15 de Phaophi",
        daysRemaining: daysFromNow
      });
    }
    if (currentMonth === 3 && currentDay === 1) {
      results.push({ 
        name: "Festival de Khoiak (Ka-her-ka)", 
        description: "Semana de misterios osiríacos. Se fabricaban figuras de limo y semillas ('Osiris germinantes') como símbolo de vida.", 
        date: "1 de Choiak",
        daysRemaining: daysFromNow
      });
    }

    currentDay++;
  }

  return results.slice(0, count);
}

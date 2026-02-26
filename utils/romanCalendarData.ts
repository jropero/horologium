import { ROMAN_YEAR_DATA, YearDayEntry } from './romanYearData';

export type DayStatus = 'F' | 'N' | 'NP' | 'C' | 'EN';

export interface RomanDayInfo {
    status: DayStatus;
    statusFull: string;
    festivalName?: string;
    description?: string; // Spanish Description of the Day/Festival
    god: string; // The specific God of the Day (Deus Diei)
    isMajorFestival: boolean;
}

// Función auxiliar para obtener el texto histórico según el tipo de día
const getDefaultStatusDescription = (status: DayStatus): string => {
    switch (status) {
        case 'F':
            return "Dies Fastus: Día en el que era lícito para el pretor administrar justicia y los ciudadanos podían tratar asuntos comerciales.";
        case 'C':
            return "Dies Comitialis: Día propicio para convocar a las asambleas populares (Comitia), realizar votaciones públicas y tratar asuntos del Estado.";
        case 'N':
            return "Dies Nefastus: Día reservado a los dioses en el que estaban estrictamente prohibidas las actividades judiciales y asambleas políticas.";
        case 'NP':
            return "Dies Nefastus Publicus: Festividad pública de gran importancia religiosa. Toda actividad comercial, judicial o política estaba suspendida en favor de los ritos.";
        case 'EN':
            return "Dies Endotercissus (o Intercisus): Día mixto. Nefasto por la mañana y al atardecer, pero fasto (hábil para negocios) en las horas centrales tras concluir los sacrificios matutinos.";
        default:
            return "Un día común en el calendario romano.";
    }
};

export const getRomanDayInfo = (date: Date): RomanDayInfo => {
    const month = date.getMonth();
    const day = date.getDate(); // 1-31
    const key = `${month}-${day}`;

    // Look up in our extensive year database
    const entry = ROMAN_YEAR_DATA[key];

    if (entry) {
        // Si hay una descripción de festival, la usamos. Si no, generamos una dinámica.
        let finalDescription = entry.festivalDesc;

        if (!finalDescription) {
            const statusFallback = getDefaultStatusDescription(entry.status);
            // Combinamos la descripción de la deidad (ej: "Diosa de la suerte.") con la explicación del tipo de día
            finalDescription = entry.deityDesc
                ? `${entry.deityDesc} ${statusFallback}`
                : statusFallback;
        }

        return {
            status: entry.status,
            statusFull: entry.statusFull,
            festivalName: entry.festivalName || undefined,
            description: finalDescription,
            god: entry.deity,
            isMajorFestival: entry.status === 'NP' || !!entry.festivalName // Assume NP or named festival is major
        };
    }

    // Fallback (Should typically not happen if 365 data is complete, but good for safety)
    return {
        status: 'F',
        statusFull: "Dies Fastus",
        isMajorFestival: false,
        god: "Genius Huius Diei", // El Genio del día actual
        description: getDefaultStatusDescription('F'),
    };
}
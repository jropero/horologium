
// Ephemerides (Historical Events) for the Roman Year
// Key: "Month-Day"
// Value: Array of bilingual events

export interface HistoricalEvent {
    latin: string;
    spanish: string;
}

export const ROMAN_HISTORY_DATA: Record<string, HistoricalEvent[]> = {
    // JANUARY
    "0-1": [{ latin: "Ineunt consules magistratum.", spanish: "Comienzo del mandato de los cónsules (desde 153 a.C.)." }],
    "0-7": [{ latin: "Obitus Imperatoris Constantii II.", spanish: "Muerte del emperador Constancio II (361 d.C.)." }],
    "0-10": [{ latin: "C. Iulius Caesar Rubiconem transit.", spanish: "Julio César cruza el Rubicón (49 a.C.)." }],
    "0-16": [{ latin: "Octavianus titulo 'Augusti' a Senatu honoratur.", spanish: "Octavio recibe el título de 'Augusto' (27 a.C.)." }],
    "0-17": [{ latin: "Nuptiae Neronis et Poppaeae Sabinae.", spanish: "Boda de Nerón y Popea Sabina (38 d.C.)." }],

    // FEBRUARY
    "1-5": [{ latin: "Augustus 'Pater Patriae' appellatur.", spanish: "Augusto es nombrado 'Padre de la Patria' (2 a.C.)." }],
    "1-14": [{ latin: "C. Iulius Caesar dictator perpetuo creatur.", spanish: "Julio César es nombrado dictador perpetuo (44 a.C.)." }],

    // MARCH
    "2-1": [{ latin: "Ignis Vestae renovatur.", spanish: "Se renueva el fuego sagrado de Vesta." }],
    "2-6": [{ latin: "Comitia Pontificis Maximi.", spanish: "Elección del Pontífice Máximo." }],
    "2-15": [{ latin: "C. Iulius Caesar in Curia occiditur.", spanish: "Asesinato de Julio César (44 a.C.)." }],
    "2-18": [{ latin: "C. Caesar (Caligula) Imperator acclamatur.", spanish: "Calígula es proclamado Emperador (37 d.C.)." }],
    "2-28": [{ latin: "Obitus Imperatoris Pertinacis.", spanish: "Muerte del emperador Pertinax (193 d.C.)." }],

    // APRIL
    "3-21": [{ latin: "Natale Urbis Romae a Romulo conditae.", spanish: "Fundación de Roma por Rómulo (753 a.C.) - Parilia." }],
    "3-26": [{ latin: "Obitus Imperatoris Marci Aurelii.", spanish: "Muerte del emperador Marco Aurelio (180 d.C.)." }],

    // MAY
    "4-1": [{ latin: "Diocletianus imperium deponit.", spanish: "Diocleciano abdica (305 d.C.)." }],
    "4-11": [{ latin: "Dedicatio Constantinopolis Novae Romae.", spanish: "Dedicación de Constantinopla (330 d.C.)." }],

    // JUNE
    "5-9": [{ latin: "Obitus Neronis.", spanish: "Muerte del emperador Nerón (68 d.C.)." }],
    "5-24": [{ latin: "Clades ad Trasimenum Lacum.", spanish: "Batalla del Lago Trasimeno (217 a.C.)." }],

    // JULY
    "6-12": [{ latin: "Natalis C. Iulii Caesaris.", spanish: "Nacimiento de Julio César (100 a.C.)." }],
    "6-18": [{ latin: "Magnum Incendium Romae incipit.", spanish: "Comienza el Gran Incendio de Roma (64 d.C.)." }],
    "6-24": [{ latin: "Vespasianus Imperator agnoscitur.", spanish: "Vespasiano es reconocido Emperador (69 d.C.)." }],

    // AUGUST
    "7-2": [{ latin: "Clades Cannensis.", spanish: "Batalla de Cannas (216 a.C.)." }],
    "7-9": [{ latin: "Pharsalia Pugna.", spanish: "Batalla de Farsalia (48 a.C.)." }],
    "7-19": [{ latin: "Obitus Divi Augusti.", spanish: "Muerte de Augusto (14 d.C.)." }],
    "7-24": [{ latin: "Vesuvius mons ardet; Pompeii delentur.", spanish: "Erupción del Vesubio (79 d.C.)." }],

    // SEPTEMBER
    "8-2": [{ latin: "Actiaca Pugna.", spanish: "Batalla de Actium (31 a.C.)." }],
    "8-13": [{ latin: "Dedicatio Templi Iovis Optimi Maximi.", spanish: "Consagración del Templo de Júpiter Óptimo Máximo (509 a.C.)." }],
    "8-18": [{ latin: "Natalis Traiani.", spanish: "Nacimiento de Trajano (53 d.C.)." }],

    // OCTOBER
    "9-13": [{ latin: "Obitus Claudii veneno.", spanish: "Muerte de Claudio (54 d.C.)." }],
    "9-19": [{ latin: "Pugna apud Zamam.", spanish: "Batalla de Zama (202 a.C.)." }],
    "9-28": [{ latin: "Pugna ad Pontem Milvium.", spanish: "Batalla del Puente Milvio (312 d.C.)." }],

    // NOVEMBER
    "10-16": [{ latin: "Natalis Tiberii.", spanish: "Nacimiento de Tiberio (42 a.C.)." }],
    "10-17": [{ latin: "Natalis Vespasiani.", spanish: "Nacimiento de Vespasiano (9 d.C.)." }],

    // DECEMBER
    "11-5": [{ latin: "Oratio Ciceronis in Catilinam prima.", spanish: "Primera Catilinaria de Cicerón (63 a.C.)." }],
    "11-7": [{ latin: "Caedes M. Tullii Ciceronis.", spanish: "Asesinato de Cicerón (43 a.C.)." }],
    "11-15": [{ latin: "Natalis Neronis.", spanish: "Nacimiento de Nerón (37 d.C.)." }],
    "11-25": [{ latin: "Coronatio Caroli Magni.", spanish: "Coronación de Carlomagno (800 d.C.)." }],
};

export const getHistoricalEvents = (date: Date): HistoricalEvent[] => {
    const month = date.getMonth();
    const day = date.getDate();
    const key = `${month}-${day}`;
    return ROMAN_HISTORY_DATA[key] || [];
};

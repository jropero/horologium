export interface MayaLore {
  monthName: string;
  title: string;
  description: string;
  ritual: string;
  icon: string;
}

export const HAAB_LORE: MayaLore[] = [
  {
    monthName: 'Pop',
    title: 'Emperatriz Roja',
    description: 'El primer mes del Haab\' — un tiempo de renovación y nuevos comienzos.',
    ritual: 'Año Nuevo. Renovación de todos los artículos del hogar, barrido de la casa y purificación de los ídolos.',
    icon: '🧹',
  },
  {
    monthName: 'Wo\'',
    title: 'Ofrenda Verde',
    description: 'Un mes dedicado a los sacerdotes, curanderos y cazadores que buscan expiación y bendición.',
    ritual: 'Rituales para sacerdotes, cazadores y médicos. Danzas y sangrías.',
    icon: '🕯️',
  },
  {
    monthName: 'Sip',
    title: 'Ofrenda Roja',
    description: 'Continuación de los rituales de caza — los cazadores piden perdón por arrebatar la vida a los animales.',
    ritual: 'Rituales para sacerdotes, cazadores y médicos. Danzas y sangrías.',
    icon: '🏹',
  },
  {
    monthName: 'Zotz\'',
    title: 'Murciélago',
    description: 'Mes en el que los apicultores honran a los dioses protectores de las colmenas.',
    ritual: 'Festival de los apicultores.',
    icon: '🐝',
  },
  {
    monthName: 'Sek',
    title: 'Ofrenda Blanca',
    description: 'Los apicultores continúan sus ritos con ofrendas de miel y cera.',
    ritual: 'Festival de los apicultores.',
    icon: '🍯',
  },
  {
    monthName: 'Xul',
    title: 'Perro',
    description: 'El gran festival de K\'uk\'ulkan (Kukulcán), la serpiente emplumada.',
    ritual: 'Festival de Kukulcán. Procesiones y sacrificios de perros.',
    icon: '🐍',
  },
  {
    monthName: 'Yaxk\'in',
    title: 'Nuevo Sol',
    description: 'El sol está en su cenit — un tiempo de poder para la serpiente celestial.',
    ritual: 'Festival de Kukulcán. Procesiones y sacrificios.',
    icon: '☀️',
  },
  {
    monthName: 'Mol',
    title: 'Agua',
    description: 'Los artesanos celebran ceremonias para bendecir sus herramientas y su trabajo.',
    ritual: 'Festival de los artesanos — pintores, escultores y talladores renuevan su oficio.',
    icon: '🔨',
  },
  {
    monthName: 'Ch\'en',
    title: 'Cueva',
    description: 'Comienza la temporada de talla de los ídolos de madera.',
    ritual: 'Fabricación y renovación de ídolos de madera.',
    icon: '🪵',
  },
  {
    monthName: 'Yax',
    title: 'Verde',
    description: 'Los nuevos ídolos tallados en madera son consagrados y vestidos.',
    ritual: 'Fabricación y renovación de ídolos de madera.',
    icon: '🪆',
  },
  {
    monthName: 'Sak',
    title: 'Blanco',
    description: 'Los talleres continúan produciendo efigies sagradas para el año venidero.',
    ritual: 'Fabricación y renovación de ídolos de madera.',
    icon: '🗿',
  },
  {
    monthName: 'Keh',
    title: 'Venado',
    description: 'El último mes dedicado a la talla de ídolos antes de que el año cambie.',
    ritual: 'Fabricación y renovación de ídolos de madera.',
    icon: '🦌',
  },
  {
    monthName: 'Mak',
    title: 'Recinto',
    description: 'Un ritual sobrecogedor en el que los participantes caminan sobre brasas calientes.',
    ritual: 'Ritual de caminar sobre fuego. Extinción de fuegos y vertido de agua sobre corazones ardientes de animales.',
    icon: '🔥',
  },
  {
    monthName: 'K\'ank\'in',
    title: 'Sol Amarillo',
    description: 'Los guerreros se reúnen para honrar a sus deidades patronas con exhibiciones marciales.',
    ritual: 'Festival de los guerreros — danzas y preparación para la batalla.',
    icon: '⚔️',
  },
  {
    monthName: 'Muan',
    title: 'Búho',
    description: 'Los cultivadores de cacao y productores de miel realizan ofrendas para una cosecha abundante.',
    ritual: 'Festival de los cultivadores de cacao.',
    icon: '🦉',
  },
  {
    monthName: 'Pax',
    title: 'Época de Siembra',
    description: 'Los guerreros realizan una danza sombría que culmina con el sacrificio de un perro.',
    ritual: 'Danza Pax — los guerreros ofrecen el corazón de un perro a los dioses.',
    icon: '🥁',
  },
  {
    monthName: 'K\'ayab\'',
    title: 'Canto',
    description: 'Los alfareros honran a Ix Chel, diosa de la creación y la destrucción, con nuevas vasijas.',
    ritual: 'Festival de los alfareros — renovación de cerámica y ofrendas a Ix Chel.',
    icon: '🏺',
  },
  {
    monthName: 'Kumk\'u',
    title: 'Granero',
    description: 'El mundo se renueva en preparación para el cierre del año.',
    ritual: 'Festival del mundo — renovación y limpieza general.',
    icon: '🌍',
  },
  {
    monthName: 'Wayeb\'',
    title: 'Días sin Nombre',
    description: 'Cinco días nefastos fuera del calendario normal — se abre el portal al inframundo.',
    ritual: 'Los 5 días nefastos. Advertencia de permanecer bajo techo, evitar lavarse el pelo y no realizar trabajos duros para evitar desastres.',
    icon: '💀',
  },
];

export const getHaabLore = (monthName: string): MayaLore | undefined => {
  return HAAB_LORE.find((lore) => lore.monthName === monthName);
};

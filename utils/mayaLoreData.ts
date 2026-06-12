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
    title: 'Red Empress',
    description: 'The first month of the Haab\' — a time of renewal and new beginnings.',
    ritual: 'New Year. Renewal of all household items, sweeping the house, and purifying idols.',
    icon: '🧹',
  },
  {
    monthName: 'Wo\'',
    title: 'Green Offering',
    description: 'A month dedicated to priests, healers, and hunters seeking atonement and blessing.',
    ritual: 'Rituals for priests, hunters, and physicians. Dances and bloodletting.',
    icon: '🕯️',
  },
  {
    monthName: 'Sip',
    title: 'Red Offering',
    description: 'Continuation of the hunt rituals — hunters ask forgiveness for taking the lives of animals.',
    ritual: 'Rituals for priests, hunters, and physicians. Dances and bloodletting.',
    icon: '🏹',
  },
  {
    monthName: 'Zotz\'',
    title: 'Bat',
    description: 'A month when beekeepers honour the gods who protect the hives.',
    ritual: 'Festival of the beekeepers.',
    icon: '🐝',
  },
  {
    monthName: 'Sek',
    title: 'White Offering',
    description: 'Beekeepers continue their rites with offerings of honey and wax.',
    ritual: 'Festival of the beekeepers.',
    icon: '🍯',
  },
  {
    monthName: 'Xul',
    title: 'Dog',
    description: 'The great festival of K\'uk\'ulkan (Kukulcan), the feathered serpent.',
    ritual: 'Festival of Kukulcan. Processions and dog sacrifices.',
    icon: '🐍',
  },
  {
    monthName: 'Yaxk\'in',
    title: 'New Sun',
    description: 'The sun is at its zenith — a time of power for the celestial serpent.',
    ritual: 'Festival of Kukulcan. Processions and dog sacrifices.',
    icon: '☀️',
  },
  {
    monthName: 'Mol',
    title: 'Water',
    description: 'Artisans and craftsmen hold ceremonies to bless their tools and work.',
    ritual: 'Festival of the artisans — painters, sculptors, and carvers renew their craft.',
    icon: '🔨',
  },
  {
    monthName: 'Ch\'en',
    title: 'Cave',
    description: 'The carving season for wooden idols begins.',
    ritual: 'Making and renovating wooden idols.',
    icon: '🪵',
  },
  {
    monthName: 'Yax',
    title: 'Green',
    description: 'The newly carved wooden idols are consecrated and dressed.',
    ritual: 'Making and renovating wooden idols.',
    icon: '🪆',
  },
  {
    monthName: 'Sak',
    title: 'White',
    description: 'Workshops continue producing sacred effigies for the coming year.',
    ritual: 'Making and renovating wooden idols.',
    icon: '🗿',
  },
  {
    monthName: 'Keh',
    title: 'Deer',
    description: 'The last month dedicated to idol carving before the year turns.',
    ritual: 'Making and renovating wooden idols.',
    icon: '🦌',
  },
  {
    monthName: 'Mak',
    title: 'Enclosure',
    description: 'A terrifying ritual in which participants walk on hot coals.',
    ritual: 'Fire-walking ritual. Extinguishing fires and pouring water on burning hearts of animals.',
    icon: '🔥',
  },
  {
    monthName: 'K\'ank\'in',
    title: 'Yellow Sun',
    description: 'Warriors gather to honour their patron deities with martial displays.',
    ritual: 'Festival of the warriors — dances and preparation for battle.',
    icon: '⚔️',
  },
  {
    monthName: 'Muan',
    title: 'Owl',
    description: 'Cacao growers and honey producers make offerings for a bountiful harvest.',
    ritual: 'Festival of the cacao growers.',
    icon: '🦉',
  },
  {
    monthName: 'Pax',
    title: 'Planting Time',
    description: 'Warriors perform a sombre dance culminating in a dog sacrifice.',
    ritual: 'Pax dance — warriors offer a dog\'s heart to the gods.',
    icon: '🥁',
  },
  {
    monthName: 'K\'ayab\'',
    title: 'Song',
    description: 'Pottery makers honour Ix Chel, goddess of creation and destruction, with new vessels.',
    ritual: 'Festival of the potters — renewal of pottery and offerings to Ix Chel.',
    icon: '🏺',
  },
  {
    monthName: 'Kumk\'u',
    title: 'Granary',
    description: 'The world is renewed in preparation for the closing of the year.',
    ritual: 'Festival of the world — general renewal and cleaning.',
    icon: '🌍',
  },
  {
    monthName: 'Wayeb\'',
    title: 'Nameless Days',
    description: 'Five unlucky days outside the normal calendar — the portal to the underworld opens.',
    ritual: 'The 5 nameless, unlucky days. Warning to stay indoors, avoid washing hair, and do no hard work to prevent disaster.',
    icon: '💀',
  },
];

export const getHaabLore = (monthName: string): MayaLore | undefined => {
  return HAAB_LORE.find((lore) => lore.monthName === monthName);
};

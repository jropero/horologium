// Roman city data for the interactive empire map
// Coordinates sourced from Pleiades (pleiades.stoa.org) and DARE (dare.ht.lu.se)
// Province names match PROVINCES in romanProvinces.ts

export type CityType = 'capital' | 'major' | 'port' | 'fortress' | 'colony';

export interface RomanCity {
  name: string;
  modern?: string;
  lat: number;
  lng: number;
  type: CityType;
  province: string;
}

export const ROMAN_CITIES: RomanCity[] = [
  // ITALIA
  { name: 'Roma', modern: 'Rome', lat: 41.903, lng: 12.496, type: 'capital', province: 'Italia' },
  { name: 'Mediolanum', modern: 'Milan', lat: 45.464, lng: 9.189, type: 'major', province: 'Italia' },
  { name: 'Ravenna', modern: 'Ravenna', lat: 44.416, lng: 12.200, type: 'major', province: 'Italia' },
  { name: 'Aquileia', modern: 'Aquileia', lat: 45.769, lng: 13.370, type: 'major', province: 'Italia' },
  { name: 'Bononia', modern: 'Bologna', lat: 44.494, lng: 11.342, type: 'major', province: 'Italia' },
  { name: 'Capua', modern: 'Capua', lat: 41.107, lng: 14.213, type: 'major', province: 'Italia' },
  { name: 'Neapolis', modern: 'Naples', lat: 40.835, lng: 14.245, type: 'major', province: 'Italia' },
  { name: 'Brundisium', modern: 'Brindisi', lat: 40.636, lng: 17.940, type: 'port', province: 'Italia' },
  { name: 'Tarentum', modern: 'Taranto', lat: 40.476, lng: 17.229, type: 'major', province: 'Italia' },
  { name: 'Verona', lat: 45.438, lng: 10.992, type: 'major', province: 'Italia' },

  // SICILIA
  { name: 'Syracusae', modern: 'Syracuse', lat: 37.070, lng: 15.290, type: 'capital', province: 'Sicilia' },
  { name: 'Panormus', modern: 'Palermo', lat: 38.115, lng: 13.361, type: 'major', province: 'Sicilia' },

  // BRITANNIA
  { name: 'Londinium', modern: 'London', lat: 51.514, lng: -0.127, type: 'capital', province: 'Britannia' },
  { name: 'Eboracum', modern: 'York', lat: 53.958, lng: -1.082, type: 'fortress', province: 'Britannia' },
  { name: 'Camulodunum', modern: 'Colchester', lat: 51.890, lng: 0.900, type: 'colony', province: 'Britannia' },
  { name: 'Isca Silurum', modern: 'Caerleon', lat: 51.608, lng: -2.953, type: 'fortress', province: 'Britannia' },
  { name: 'Deva Victrix', modern: 'Chester', lat: 53.191, lng: -2.889, type: 'fortress', province: 'Britannia' },

  // GALLIA BELGICA
  { name: 'Durocortorum', modern: 'Reims', lat: 49.259, lng: 4.035, type: 'capital', province: 'Gallia Belgica' },
  { name: 'Augusta Treverorum', modern: 'Trier', lat: 49.750, lng: 6.638, type: 'major', province: 'Gallia Belgica' },
  { name: 'Gesoriacum', modern: 'Boulogne', lat: 50.727, lng: 1.614, type: 'port', province: 'Gallia Belgica' },

  // GERMANIA INFERIOR
  { name: 'Colonia Agrippina', modern: 'Cologne', lat: 50.938, lng: 6.960, type: 'capital', province: 'Germania Inferior' },
  { name: 'Noviomagus', modern: 'Nijmegen', lat: 51.843, lng: 5.865, type: 'fortress', province: 'Germania Inferior' },
  { name: 'Ulpia Traiana', modern: 'Xanten', lat: 51.660, lng: 6.454, type: 'colony', province: 'Germania Inferior' },

  // GALLIA LUGDUNENSIS
  { name: 'Lugdunum', modern: 'Lyon', lat: 45.764, lng: 4.834, type: 'capital', province: 'Gallia Lugdunensis' },
  { name: 'Caesarodunum', modern: 'Tours', lat: 47.390, lng: 0.690, type: 'major', province: 'Gallia Lugdunensis' },
  { name: 'Condate', modern: 'Rennes', lat: 48.117, lng: -1.677, type: 'major', province: 'Gallia Lugdunensis' },

  // GALLIA AQUITANIA
  { name: 'Burdigala', modern: 'Bordeaux', lat: 44.836, lng: -0.580, type: 'capital', province: 'Gallia Aquitania' },
  { name: 'Tolosa', modern: 'Toulouse', lat: 43.605, lng: 1.444, type: 'major', province: 'Gallia Aquitania' },
  { name: 'Augustoritum', modern: 'Limoges', lat: 45.850, lng: 1.260, type: 'major', province: 'Gallia Aquitania' },

  // GALLIA NARBONENSIS
  { name: 'Narbo Martius', modern: 'Narbonne', lat: 43.184, lng: 3.002, type: 'capital', province: 'Gallia Narbonensis' },
  { name: 'Massilia', modern: 'Marseille', lat: 43.296, lng: 5.382, type: 'port', province: 'Gallia Narbonensis' },
  { name: 'Arelate', modern: 'Arles', lat: 43.677, lng: 4.627, type: 'major', province: 'Gallia Narbonensis' },
  { name: 'Vienna', modern: 'Vienne', lat: 45.524, lng: 4.875, type: 'major', province: 'Gallia Narbonensis' },

  // HISPANIA TARRACONENSIS
  { name: 'Tarraco', modern: 'Tarragona', lat: 41.117, lng: 1.244, type: 'capital', province: 'Hispania Tarraconensis' },
  { name: 'Caesaraugusta', modern: 'Zaragoza', lat: 41.650, lng: -0.885, type: 'major', province: 'Hispania Tarraconensis' },
  { name: 'Carthago Nova', modern: 'Cartagena', lat: 37.600, lng: -0.985, type: 'port', province: 'Hispania Tarraconensis' },
  { name: 'Legio VII Gemina', modern: 'León', lat: 42.599, lng: -5.568, type: 'fortress', province: 'Hispania Tarraconensis' },
  { name: 'Toletum', modern: 'Toledo', lat: 39.862, lng: -4.024, type: 'major', province: 'Hispania Tarraconensis' },
  { name: 'Asturica Augusta', modern: 'Astorga', lat: 42.458, lng: -6.053, type: 'major', province: 'Hispania Tarraconensis' },

  // HISPANIA BAETICA
  { name: 'Corduba', modern: 'Córdoba', lat: 37.888, lng: -4.779, type: 'capital', province: 'Hispania Baetica' },
  { name: 'Hispalis', modern: 'Seville', lat: 37.389, lng: -5.984, type: 'major', province: 'Hispania Baetica' },
  { name: 'Gades', modern: 'Cádiz', lat: 36.527, lng: -6.289, type: 'port', province: 'Hispania Baetica' },
  { name: 'Italica', modern: 'Santiponce', lat: 37.443, lng: -6.049, type: 'colony', province: 'Hispania Baetica' },
  { name: 'Malaca', modern: 'Málaga', lat: 36.721, lng: -4.421, type: 'port', province: 'Hispania Baetica' },

  // LUSITANIA
  { name: 'Emerita Augusta', modern: 'Mérida', lat: 38.916, lng: -6.342, type: 'capital', province: 'Lusitania' },
  { name: 'Olisipo', modern: 'Lisbon', lat: 38.717, lng: -9.133, type: 'major', province: 'Lusitania' },
  { name: 'Bracara Augusta', modern: 'Braga', lat: 41.546, lng: -8.426, type: 'major', province: 'Lusitania' },

  // GERMANIA SUPERIOR
  { name: 'Mogontiacum', modern: 'Mainz', lat: 50.000, lng: 8.271, type: 'capital', province: 'Germania Superior' },
  { name: 'Argentoratum', modern: 'Strasbourg', lat: 48.578, lng: 7.755, type: 'fortress', province: 'Germania Superior' },

  // RAETIA
  { name: 'Augusta Vindelicorum', modern: 'Augsburg', lat: 48.370, lng: 10.897, type: 'capital', province: 'Raetia' },
  { name: 'Castra Regina', modern: 'Regensburg', lat: 49.022, lng: 12.102, type: 'fortress', province: 'Raetia' },

  // NORICUM
  { name: 'Virunum', lat: 46.680, lng: 14.520, type: 'capital', province: 'Noricum' },
  { name: 'Lauriacum', modern: 'Enns', lat: 48.215, lng: 14.482, type: 'fortress', province: 'Noricum' },

  // PANNONIA SUPERIOR
  { name: 'Carnuntum', modern: 'Petronell', lat: 48.122, lng: 16.858, type: 'capital', province: 'Pannonia Superior' },
  { name: 'Vindobona', modern: 'Vienna', lat: 48.208, lng: 16.373, type: 'fortress', province: 'Pannonia Superior' },
  { name: 'Savaria', modern: 'Szombathely', lat: 47.230, lng: 16.621, type: 'major', province: 'Pannonia Superior' },

  // PANNONIA INFERIOR
  { name: 'Aquincum', modern: 'Budapest', lat: 47.534, lng: 18.959, type: 'capital', province: 'Pannonia Inferior' },
  { name: 'Sirmium', modern: 'Sremska Mitrovica', lat: 44.978, lng: 19.611, type: 'major', province: 'Pannonia Inferior' },

  // DALMATIA
  { name: 'Salona', modern: 'Solin', lat: 43.540, lng: 16.480, type: 'capital', province: 'Dalmatia' },
  { name: 'Iader', modern: 'Zadar', lat: 44.119, lng: 15.232, type: 'major', province: 'Dalmatia' },
  { name: 'Narona', modern: 'Vid', lat: 43.028, lng: 17.601, type: 'major', province: 'Dalmatia' },

  // MOESIA SUPERIOR
  { name: 'Viminacium', modern: 'Kostolac', lat: 44.714, lng: 21.188, type: 'capital', province: 'Moesia Superior' },
  { name: 'Singidunum', modern: 'Belgrade', lat: 44.820, lng: 20.462, type: 'fortress', province: 'Moesia Superior' },
  { name: 'Naissus', modern: 'Niš', lat: 43.318, lng: 21.895, type: 'major', province: 'Moesia Superior' },

  // MOESIA INFERIOR
  { name: 'Tomis', modern: 'Constanța', lat: 44.180, lng: 28.657, type: 'capital', province: 'Moesia Inferior' },
  { name: 'Marcianopolis', modern: 'Devnya', lat: 43.224, lng: 27.566, type: 'major', province: 'Moesia Inferior' },
  { name: 'Noviodunum', modern: 'Isaccea', lat: 45.270, lng: 28.186, type: 'fortress', province: 'Moesia Inferior' },

  // DACIA
  { name: 'Ulpia Traiana Sarmizegetusa', lat: 45.510, lng: 22.790, type: 'capital', province: 'Dacia' },
  { name: 'Apulum', modern: 'Alba Iulia', lat: 46.068, lng: 23.580, type: 'fortress', province: 'Dacia' },
  { name: 'Napoca', modern: 'Cluj-Napoca', lat: 46.770, lng: 23.589, type: 'major', province: 'Dacia' },

  // THRACIA
  { name: 'Philippopolis', modern: 'Plovdiv', lat: 42.145, lng: 24.747, type: 'capital', province: 'Thracia' },
  { name: 'Adrianopolis', modern: 'Edirne', lat: 41.677, lng: 26.558, type: 'major', province: 'Thracia' },

  // MACEDONIA
  { name: 'Thessalonica', modern: 'Thessaloniki', lat: 40.636, lng: 22.945, type: 'capital', province: 'Macedonia' },
  { name: 'Philippi', lat: 41.013, lng: 24.285, type: 'major', province: 'Macedonia' },
  { name: 'Stobi', lat: 41.543, lng: 21.990, type: 'major', province: 'Macedonia' },

  // EPIRUS
  { name: 'Nicopolis', lat: 39.006, lng: 20.723, type: 'capital', province: 'Epirus' },
  { name: 'Dyrrachium', modern: 'Durrës', lat: 41.324, lng: 19.455, type: 'port', province: 'Epirus' },

  // ACHAEA
  { name: 'Corinthus', modern: 'Corinth', lat: 37.906, lng: 22.882, type: 'capital', province: 'Achaea' },
  { name: 'Athenae', modern: 'Athens', lat: 37.971, lng: 23.728, type: 'major', province: 'Achaea' },
  { name: 'Patrae', modern: 'Patras', lat: 38.246, lng: 21.735, type: 'port', province: 'Achaea' },
  { name: 'Sparta', lat: 37.075, lng: 22.427, type: 'major', province: 'Achaea' },

  // CRETA ET CYRENAICA
  { name: 'Cyrene', modern: 'Shahat', lat: 32.823, lng: 21.857, type: 'capital', province: 'Creta et Cyrenaica' },
  { name: 'Gortyna', lat: 35.065, lng: 24.944, type: 'major', province: 'Creta et Cyrenaica' },

  // CYPRUS
  { name: 'Paphos', modern: 'Paphos', lat: 34.776, lng: 32.425, type: 'capital', province: 'Cyprus' },
  { name: 'Salamis', lat: 35.185, lng: 33.897, type: 'major', province: 'Cyprus' },

  // ASIA
  { name: 'Ephesus', modern: 'Selçuk area', lat: 37.939, lng: 27.341, type: 'capital', province: 'Asia' },
  { name: 'Pergamum', modern: 'Bergama', lat: 39.133, lng: 27.182, type: 'major', province: 'Asia' },
  { name: 'Smyrna', modern: 'İzmir', lat: 38.418, lng: 27.128, type: 'major', province: 'Asia' },
  { name: 'Sardis', lat: 38.481, lng: 28.044, type: 'major', province: 'Asia' },
  { name: 'Miletus', lat: 37.531, lng: 27.278, type: 'port', province: 'Asia' },
  { name: 'Halicarnassus', modern: 'Bodrum area', lat: 37.038, lng: 27.423, type: 'major', province: 'Asia' },

  // BITHYNIA ET PONTUS
  { name: 'Nicomedia', modern: 'İzmit', lat: 40.766, lng: 29.919, type: 'capital', province: 'Bithynia et Pontus' },
  { name: 'Nicaea', modern: 'İznik', lat: 40.430, lng: 29.723, type: 'major', province: 'Bithynia et Pontus' },
  { name: 'Trapezus', modern: 'Trabzon', lat: 41.006, lng: 39.726, type: 'port', province: 'Bithynia et Pontus' },
  { name: 'Sinope', modern: 'Sinop', lat: 42.030, lng: 35.152, type: 'port', province: 'Bithynia et Pontus' },

  // GALATIA
  { name: 'Ancyra', modern: 'Ankara', lat: 39.933, lng: 32.860, type: 'capital', province: 'Galatia' },
  { name: 'Pessinus', lat: 39.180, lng: 31.520, type: 'major', province: 'Galatia' },

  // CAPPADOCIA
  { name: 'Caesarea Mazaca', modern: 'Kayseri', lat: 38.721, lng: 35.487, type: 'capital', province: 'Cappadocia' },
  { name: 'Melitene', modern: 'Malatya area', lat: 38.355, lng: 38.311, type: 'fortress', province: 'Cappadocia' },
  { name: 'Satala', lat: 40.072, lng: 39.578, type: 'fortress', province: 'Cappadocia' },

  // LYCIA ET PAMPHYLIA
  { name: 'Patara', lat: 36.265, lng: 29.319, type: 'capital', province: 'Lycia et Pamphylia' },
  { name: 'Perge', lat: 36.961, lng: 30.855, type: 'major', province: 'Lycia et Pamphylia' },
  { name: 'Attaleia', modern: 'Antalya', lat: 36.886, lng: 30.700, type: 'port', province: 'Lycia et Pamphylia' },

  // CILICIA
  { name: 'Tarsus', lat: 36.921, lng: 34.892, type: 'capital', province: 'Cilicia' },
  { name: 'Seleucia Pieria', lat: 36.128, lng: 35.927, type: 'port', province: 'Cilicia' },

  // SYRIA
  { name: 'Antiochia', modern: 'Antakya', lat: 36.204, lng: 36.160, type: 'capital', province: 'Syria' },
  { name: 'Palmyra', lat: 34.550, lng: 38.268, type: 'major', province: 'Syria' },
  { name: 'Damascus', modern: 'Damascus', lat: 33.510, lng: 36.292, type: 'major', province: 'Syria' },
  { name: 'Berytus', modern: 'Beirut', lat: 33.888, lng: 35.496, type: 'major', province: 'Syria' },
  { name: 'Heliopolis', modern: 'Baalbek', lat: 34.004, lng: 36.210, type: 'major', province: 'Syria' },
  { name: 'Laodicea', modern: 'Latakia', lat: 35.528, lng: 35.793, type: 'port', province: 'Syria' },

  // IUDAEA
  { name: 'Caesarea Maritima', lat: 32.500, lng: 34.893, type: 'capital', province: 'Iudaea' },
  { name: 'Hierusalem', modern: 'Jerusalem', lat: 31.769, lng: 35.217, type: 'major', province: 'Iudaea' },
  { name: 'Aelia Capitolina', modern: 'Jerusalem', lat: 31.769, lng: 35.217, type: 'major', province: 'Iudaea' },

  // ARABIA PETRAEA
  { name: 'Petra', modern: 'Petra', lat: 30.329, lng: 35.443, type: 'capital', province: 'Arabia Petraea' },
  { name: 'Bostra', modern: 'Bosra', lat: 32.520, lng: 36.476, type: 'major', province: 'Arabia Petraea' },

  // MESOPOTAMIA (Trajanic, 115–117 CE)
  { name: 'Nisibis', modern: 'Nusaybin', lat: 37.067, lng: 41.217, type: 'fortress', province: 'Mesopotamia' },
  { name: 'Edessa', modern: 'Şanlıurfa', lat: 37.158, lng: 38.796, type: 'major', province: 'Mesopotamia' },
  { name: 'Ctesiphon', lat: 33.097, lng: 44.580, type: 'major', province: 'Mesopotamia' },

  // ARMENIA (Trajanic)
  { name: 'Artaxata', modern: 'Artashat', lat: 39.958, lng: 44.555, type: 'capital', province: 'Armenia' },

  // AEGYPTUS
  { name: 'Alexandria', modern: 'Alexandria', lat: 31.200, lng: 29.919, type: 'capital', province: 'Aegyptus' },
  { name: 'Memphis', lat: 29.851, lng: 31.253, type: 'major', province: 'Aegyptus' },
  { name: 'Coptos', modern: 'Qift', lat: 25.998, lng: 32.821, type: 'major', province: 'Aegyptus' },

  // AFRICA PROCONSULARIS
  { name: 'Carthago', modern: 'Carthage', lat: 36.853, lng: 10.323, type: 'capital', province: 'Africa Proconsularis' },
  { name: 'Leptis Magna', modern: 'Al Khums area', lat: 32.638, lng: 14.292, type: 'major', province: 'Africa Proconsularis' },
  { name: 'Utica', lat: 37.055, lng: 10.057, type: 'major', province: 'Africa Proconsularis' },
  { name: 'Oea', modern: 'Tripoli', lat: 32.902, lng: 13.180, type: 'port', province: 'Africa Proconsularis' },

  // NUMIDIA
  { name: 'Cirta', modern: 'Constantine', lat: 36.366, lng: 6.612, type: 'capital', province: 'Numidia' },
  { name: 'Lambaesis', modern: 'Tazoult', lat: 35.488, lng: 6.264, type: 'fortress', province: 'Numidia' },
  { name: 'Theveste', modern: 'Tébessa', lat: 35.405, lng: 8.121, type: 'major', province: 'Numidia' },

  // CRETA ET CYRENAICA (Cyrene entry already above)

  // MAURETANIA CAESARIENSIS
  { name: 'Caesarea', modern: 'Cherchell', lat: 36.614, lng: 2.193, type: 'capital', province: 'Mauretania Caesariensis' },
  { name: 'Sitifis', modern: 'Sétif', lat: 36.190, lng: 5.405, type: 'major', province: 'Mauretania Caesariensis' },

  // MAURETANIA TINGITANA
  { name: 'Tingis', modern: 'Tangier', lat: 35.769, lng: -5.800, type: 'capital', province: 'Mauretania Tingitana' },
  { name: 'Volubilis', lat: 34.073, lng: -5.558, type: 'major', province: 'Mauretania Tingitana' },
  { name: 'Sala', modern: 'Rabat area', lat: 34.014, lng: -6.822, type: 'major', province: 'Mauretania Tingitana' },
];

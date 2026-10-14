// Roman provinces at Trajanic maximum extent (ca. 117 CE)
// Province polygons simplified from DARE (dare.ht.lu.se) and Barrington Atlas
// (Talbert ed., Princeton 2000). Coordinates: [lat, lng] pairs.

export interface RomanProvince {
  name: string;
  nameEs?: string;
  desc: string;
  polygon: [number, number][]; // [lat, lng], closed ring implied
}

// Ray-casting point-in-polygon. polygon[i] = [lat, lng].
function pointInPolygon(lat: number, lng: number, poly: [number, number][]): boolean {
  let inside = false;
  const n = poly.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const yi = poly[i][0], xi = poly[i][1];
    const yj = poly[j][0], xj = poly[j][1];
    if ((yi > lat) !== (yj > lat)) {
      const xInt = (xj - xi) * (lat - yi) / (yj - yi) + xi;
      if (lng < xInt) inside = !inside;
    }
  }
  return inside;
}

// Shoelace area (square degrees) for tiebreaking overlapping polygons.
function polygonArea(poly: [number, number][]): number {
  let a = 0;
  const n = poly.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    a += poly[j][1] * poly[i][0] - poly[i][1] * poly[j][0];
  }
  return Math.abs(a) / 2;
}

const PROVINCES: RomanProvince[] = [
  // ── BRITANNIA ──────────────────────────────────────────────────────────────
  {
    name: 'Britannia', nameEs: 'Britania',
    desc: 'Isla conquistada por Claudio, frontera norte del Imperio.',
    polygon: [
      [49.9,-5.7],[50.2,-1.0],[50.9,0.7],[51.2,1.3],[51.5,0.9],
      [52.9,0.4],[53.7,-0.1],[54.5,-1.0],[54.8,-3.4],[53.4,-4.7],
      [52.9,-4.2],[52.0,-5.3],[51.6,-5.1],[51.0,-3.0],[50.0,-5.3],
    ],
  },

  // ── GALLIA ─────────────────────────────────────────────────────────────────
  {
    name: 'Gallia Belgica', nameEs: 'Galia Bélgica',
    desc: 'Provincia septentrional habitada por los belgas, los más bravos según César.',
    polygon: [
      [48.8,1.8],[49.5,2.0],[50.5,2.5],[51.3,2.8],[51.4,4.9],
      [51.2,5.7],[50.3,6.7],[49.5,7.7],[48.5,6.0],[48.2,3.9],[48.3,2.5],
    ],
  },
  {
    name: 'Germania Inferior', nameEs: 'Germania Inferior',
    desc: 'Provincia del bajo Rin con capital en Colonia Agrippina.',
    polygon: [
      [51.3,2.8],[52.0,4.2],[52.5,4.6],[52.0,5.5],[51.5,6.0],
      [50.8,6.5],[50.3,6.7],[51.2,5.7],[51.4,4.9],
    ],
  },
  {
    name: 'Gallia Lugdunensis', nameEs: 'Galia Lugdunense',
    desc: 'Provincia central de la Galia con capital en Lugdunum.',
    polygon: [
      [43.5,1.8],[44.0,-0.5],[44.5,-1.5],[46.5,-2.5],[47.5,-2.5],
      [48.5,-1.5],[49.0,-0.5],[50.0,1.5],[49.5,2.0],[48.8,1.8],
      [48.3,2.5],[48.2,3.9],[48.5,6.0],[46.0,4.8],[44.8,3.5],[43.8,3.3],
    ],
  },
  {
    name: 'Gallia Aquitania', nameEs: 'Aquitania',
    desc: 'Provincia suroccidental de la Galia entre el Loira y los Pirineos.',
    polygon: [
      [43.3,-1.8],[43.5,-0.3],[44.0,-0.5],[44.5,-1.5],[46.5,-2.5],
      [47.5,-2.5],[45.5,-2.0],[44.5,-1.5],[44.0,-0.5],[43.5,1.8],
      [43.8,3.3],[44.8,3.5],[46.0,4.8],[45.5,3.5],[44.0,2.5],[43.5,1.8],
      [43.3,3.2],[42.5,3.2],[43.3,-1.8],
    ],
  },
  {
    name: 'Gallia Narbonensis', nameEs: 'Galia Narbonense',
    desc: 'La Provincia por excelencia, primera conquista romana en la Galia.',
    polygon: [
      [42.5,3.2],[43.0,-1.8],[43.3,-1.8],[43.5,-0.3],[44.0,-0.5],[43.5,1.8],
      [43.3,3.2],[43.5,4.5],[43.8,5.5],[43.5,7.2],[43.7,7.5],
      [44.0,8.6],[44.4,8.7],[46.0,9.0],[45.5,6.5],[44.8,5.5],[44.8,3.5],
      [44.0,3.3],[43.8,3.3],[43.3,3.2],
    ],
  },

  // ── HISPANIA ───────────────────────────────────────────────────────────────
  {
    name: 'Hispania Tarraconensis', nameEs: 'Hispania Tarraconense',
    desc: 'La mayor provincia de Hispania, gobernada desde Tarraco.',
    polygon: [
      [43.5,-8.5],[43.4,3.2],[42.5,3.2],[40.5,0.7],[38.0,0.3],
      [37.4,0.2],[36.8,-2.3],[36.0,-5.6],[38.0,-7.2],[38.1,-7.0],
      [38.2,-5.0],[38.6,-3.8],[38.1,-1.9],[38.5,-0.5],[40.0,-0.4],
      [40.5,-1.5],[41.5,-1.5],[42.0,-2.0],[42.5,-8.5],[43.0,-8.5],
    ],
  },
  {
    name: 'Hispania Baetica', nameEs: 'Bética',
    desc: 'Provincia senatorial rica en aceite y minerales, con capital en Corduba.',
    polygon: [
      [36.0,-5.6],[36.7,-4.4],[37.4,-1.8],[38.1,-1.9],[38.6,-3.8],
      [38.2,-5.0],[38.1,-7.0],[37.2,-7.4],[36.2,-6.3],
    ],
  },
  {
    name: 'Lusitania', nameEs: 'Lusitania',
    desc: 'Provincia occidental de Hispania con capital en Augusta Emerita.',
    polygon: [
      [37.2,-7.4],[38.1,-7.0],[38.5,-5.5],[39.5,-5.5],[40.5,-6.0],
      [41.0,-6.5],[42.0,-7.5],[42.5,-8.5],[42.0,-8.9],[41.5,-8.9],
      [39.5,-9.4],[38.6,-9.1],[37.0,-8.9],
    ],
  },

  // ── GERMANIA ───────────────────────────────────────────────────────────────
  {
    name: 'Germania Superior', nameEs: 'Germania Superior',
    desc: 'Provincia del alto Rin con capital en Mogontiacum.',
    polygon: [
      [47.6,7.6],[48.6,7.8],[50.0,8.3],[50.0,9.5],[49.5,9.5],
      [49.0,10.5],[48.5,10.0],[47.8,9.5],[47.0,7.5],[46.5,8.5],[46.0,9.0],
      [44.4,8.7],[44.0,7.5],[43.7,7.5],[47.0,7.5],[47.6,7.6],
    ],
  },

  // ── ALPINE PROVINCES ───────────────────────────────────────────────────────
  {
    name: 'Raetia', nameEs: 'Recia',
    desc: 'Provincia alpina entre la Galia y el Nórico, con capital en Augusta Vindelicorum.',
    polygon: [
      [47.6,7.6],[47.0,7.5],[47.8,9.5],[48.5,10.0],[49.0,10.5],
      [49.5,9.5],[49.0,12.5],[48.6,13.5],[47.5,13.5],[47.0,13.0],
      [46.5,12.5],[46.0,12.0],[46.0,9.0],[46.5,8.5],
    ],
  },
  {
    name: 'Noricum', nameEs: 'Nórico',
    desc: 'Provincia alpina conocida por su excelente hierro.',
    polygon: [
      [47.5,13.5],[48.6,13.5],[48.3,14.5],[48.2,16.4],[47.8,17.0],
      [46.8,16.5],[46.0,15.0],[46.0,13.0],[46.5,12.5],[47.0,13.0],
    ],
  },

  // ── PANNONIA ───────────────────────────────────────────────────────────────
  {
    name: 'Pannonia Superior', nameEs: 'Panonia Superior',
    desc: 'Provincia danubiana occidental con capital en Carnuntum.',
    polygon: [
      [48.2,16.4],[47.8,17.0],[47.5,18.8],[46.8,18.5],[46.5,16.8],
      [46.0,16.5],[45.5,16.0],[46.0,15.0],[46.8,16.5],[47.8,17.0],
      [48.2,16.4],[47.5,13.5],[46.0,13.0],[46.0,15.0],[46.5,16.5],
      [47.0,17.0],[47.5,17.5],[48.1,17.1],[48.2,16.4],
    ],
  },
  {
    name: 'Pannonia Inferior', nameEs: 'Panonia Inferior',
    desc: 'Provincia danubiana oriental con capital en Aquincum.',
    polygon: [
      [48.1,17.1],[47.5,17.5],[47.0,18.8],[46.1,18.7],[45.3,19.0],
      [44.8,20.5],[45.5,20.5],[46.0,20.0],[46.5,18.5],[47.5,18.8],
      [48.1,17.1],
    ],
  },

  // ── DALMATIA ───────────────────────────────────────────────────────────────
  {
    name: 'Dalmatia', nameEs: 'Dalmacia',
    desc: 'Provincia costera del Adriático oriental.',
    polygon: [
      [46.0,13.0],[46.0,15.0],[45.5,16.0],[46.0,16.5],[46.5,16.8],
      [46.0,20.0],[45.5,20.5],[44.8,20.5],[44.0,20.0],[43.0,17.5],
      [43.5,16.5],[44.1,15.2],[43.5,13.5],[43.0,15.5],[42.5,18.5],
      [42.0,19.5],[41.3,19.5],[41.0,19.3],[42.0,16.5],[43.0,14.0],
      [43.5,13.5],[44.5,13.0],[45.0,13.5],[46.0,13.0],
    ],
  },

  // ── ITALIA ─────────────────────────────────────────────────────────────────
  {
    name: 'Italia', nameEs: 'Italia',
    desc: 'El corazón del Imperio, sede de la Urbs Aeterna.',
    polygon: [
      [44.0,7.5],[44.4,8.7],[44.0,9.6],[43.5,10.5],[42.5,11.2],
      [41.5,12.4],[41.0,13.5],[40.5,14.5],[40.0,15.2],[39.5,16.5],
      [38.7,15.6],[38.1,15.7],[39.0,16.5],[39.5,17.5],[40.6,18.0],
      [41.0,16.5],[41.3,13.5],[41.6,12.4],[42.0,11.7],[43.0,10.8],
      [44.0,9.6],[44.4,8.9],[44.0,8.6],[43.7,7.5],[44.0,7.5],
      [46.0,9.0],[46.0,12.0],[46.5,12.5],[47.0,13.0],[47.5,13.5],
      [48.2,16.4],[48.1,17.1],[47.5,13.5],[44.0,8.5],[44.4,8.7],
      [44.0,7.5],
    ],
  },
  {
    name: 'Sicilia', nameEs: 'Sicilia',
    desc: 'El granero de la República, isla en el centro del Mediterráneo.',
    polygon: [
      [37.7,12.4],[38.2,12.5],[38.7,15.6],[38.0,15.7],[37.5,15.2],
      [36.7,15.1],[37.0,14.0],[36.7,13.0],[37.0,12.3],[37.5,12.3],
    ],
  },

  // ── MOESIA ─────────────────────────────────────────────────────────────────
  {
    name: 'Moesia Superior', nameEs: 'Mesia Superior',
    desc: 'Provincia danubiana con capital en Viminacium.',
    polygon: [
      [44.8,20.5],[44.0,20.0],[43.0,17.5],[42.5,18.5],[42.0,19.5],
      [41.3,19.5],[41.0,19.3],[42.0,20.0],[41.5,21.0],[42.0,22.5],
      [42.5,22.5],[43.0,21.5],[43.5,22.0],[44.0,22.5],[44.5,22.0],
      [45.2,21.5],[45.5,20.5],[44.8,20.5],
    ],
  },
  {
    name: 'Moesia Inferior', nameEs: 'Mesia Inferior',
    desc: 'Provincia danubiana con capital en Tomis.',
    polygon: [
      [44.0,22.5],[43.5,22.0],[43.0,21.5],[42.5,22.5],[42.0,22.5],
      [41.5,21.0],[42.0,20.0],[41.3,19.5],[41.0,21.0],[42.0,25.5],
      [42.5,27.5],[43.2,27.5],[43.8,28.0],[44.0,29.0],[45.2,29.7],
      [45.0,28.5],[44.5,27.0],[44.0,26.0],[44.5,24.5],[44.7,22.5],
      [44.0,22.5],
    ],
  },

  // ── DACIA ──────────────────────────────────────────────────────────────────
  {
    name: 'Dacia', nameEs: 'Dacia',
    desc: 'Provincia conquistada por Trajano en 106 d.C., rica en minas de oro.',
    polygon: [
      [44.7,22.5],[44.5,24.5],[44.0,26.0],[44.5,27.0],[45.0,28.5],
      [45.5,29.0],[46.0,29.5],[47.0,29.0],[47.5,26.5],[48.0,26.0],
      [48.0,24.0],[47.5,22.0],[47.0,22.0],[46.5,21.5],[45.5,21.5],
      [45.3,21.0],[44.7,22.5],
    ],
  },

  // ── THRACIA ────────────────────────────────────────────────────────────────
  {
    name: 'Thracia', nameEs: 'Tracia',
    desc: 'Provincia balcánica entre el Danubio y el Egeo.',
    polygon: [
      [42.0,22.5],[41.0,21.0],[41.3,19.5],[41.0,19.3],[40.5,19.5],
      [40.0,22.0],[40.8,26.5],[41.7,26.5],[42.0,28.0],[42.5,28.5],
      [42.0,27.5],[41.5,25.5],[42.0,24.0],[42.5,24.5],[43.0,25.5],
      [43.2,27.5],[42.5,27.5],[42.0,25.5],[41.5,21.0],[42.0,22.5],
    ],
  },

  // ── MACEDONIA ──────────────────────────────────────────────────────────────
  {
    name: 'Macedonia', nameEs: 'Macedonia',
    desc: 'Antigua tierra de Alejandro, provincia senatorial bajo Roma.',
    polygon: [
      [41.0,19.3],[42.0,19.5],[41.5,21.0],[42.0,22.5],[41.0,21.0],
      [41.0,22.5],[40.0,22.5],[40.5,22.0],[39.5,22.5],[39.5,20.5],
      [40.0,20.0],[41.3,19.5],[41.0,19.3],
    ],
  },
  {
    name: 'Epirus', nameEs: 'Epiro',
    desc: 'Provincia noroccidental griega, tierra de Pirro y los molosios.',
    polygon: [
      [41.3,19.5],[40.0,20.0],[39.5,20.5],[39.5,19.5],[39.0,20.7],
      [38.5,20.5],[39.0,21.5],[39.5,20.5],[40.0,20.0],[40.5,19.5],
      [41.0,19.3],[41.3,19.5],
    ],
  },

  // ── ACHAEA ─────────────────────────────────────────────────────────────────
  {
    name: 'Achaea', nameEs: 'Acaya',
    desc: 'La Grecia clásica, cuna de la filosofía y las artes.',
    polygon: [
      [39.5,22.5],[40.0,22.5],[40.5,22.0],[40.8,22.5],[41.0,22.5],
      [41.0,25.5],[40.8,26.5],[40.0,26.5],[39.0,26.5],[38.5,26.5],
      [37.0,22.5],[36.5,22.0],[37.0,22.0],[37.5,22.5],[38.0,23.5],
      [38.5,23.0],[38.5,22.0],[39.0,21.5],[38.5,20.5],[39.0,20.7],
      [39.5,19.5],[39.5,20.5],[39.5,22.5],
    ],
  },

  // ── CRETA ET CYRENAICA ─────────────────────────────────────────────────────
  {
    name: 'Creta et Cyrenaica', nameEs: 'Creta y Cirenaica',
    desc: 'Provincia que une la isla de Creta con la Pentápolis libia.',
    polygon: [
      [35.5,23.5],[35.7,26.5],[35.3,26.2],[35.0,25.7],[34.8,24.5],[35.2,23.7],
    ],
  },
  // Cyrenaica handled as a separate polygon
  {
    name: 'Creta et Cyrenaica', nameEs: 'Creta y Cirenaica',
    desc: 'Provincia que une la isla de Creta con la Pentápolis libia.',
    polygon: [
      [32.0,19.5],[33.5,22.5],[33.0,25.0],[30.5,25.0],[30.5,22.0],[31.5,19.5],
    ],
  },

  // ── CYPRUS ─────────────────────────────────────────────────────────────────
  {
    name: 'Cyprus', nameEs: 'Chipre',
    desc: 'Isla de Venus, productora de cobre y gobernada por senadores.',
    polygon: [
      [34.5,32.2],[35.2,33.9],[35.7,34.5],[35.6,33.0],[35.0,32.5],
    ],
  },

  // ── ANATOLIA (ASIA MINOR) ──────────────────────────────────────────────────
  {
    name: 'Bithynia et Pontus', nameEs: 'Bitinia y Ponto',
    desc: 'Provincia del norte de Anatolia con capital en Nicomedia.',
    polygon: [
      [41.0,27.5],[41.7,29.0],[41.5,31.0],[42.0,35.2],[41.0,37.5],
      [40.0,38.5],[40.5,38.0],[40.5,36.5],[40.0,35.0],[39.5,35.5],
      [39.5,33.5],[40.0,32.5],[40.5,31.5],[40.0,29.5],[40.5,27.5],[41.0,27.5],
    ],
  },
  {
    name: 'Asia', nameEs: 'Asia',
    desc: 'La más rica de las provincias, con capital en Éfeso.',
    polygon: [
      [40.5,27.5],[40.0,29.5],[40.5,31.5],[40.0,32.5],[39.5,33.5],
      [39.5,35.5],[40.0,35.0],[40.5,36.5],[38.5,36.5],[37.5,36.5],
      [36.5,28.5],[36.0,27.5],[37.0,27.0],[38.0,27.0],[38.5,26.5],[40.5,27.5],
    ],
  },
  {
    name: 'Lycia et Pamphylia', nameEs: 'Licia y Panfilia',
    desc: 'Provincia costera del sur de Anatolia.',
    polygon: [
      [36.5,28.5],[37.5,36.5],[36.5,36.5],[36.0,35.5],[36.0,32.5],
      [36.5,30.0],[36.0,27.5],[36.5,28.5],
    ],
  },
  {
    name: 'Galatia', nameEs: 'Galacia',
    desc: 'Provincia central de Anatolia con capital en Ancira.',
    polygon: [
      [40.5,31.5],[40.0,32.5],[39.5,33.5],[39.5,35.5],[40.0,35.0],
      [40.5,36.5],[40.5,38.0],[39.0,37.5],[38.5,36.5],[37.5,36.5],
      [38.0,34.0],[38.5,33.5],[38.5,32.0],[39.5,31.5],[40.0,32.5],[40.5,31.5],
    ],
  },
  {
    name: 'Cappadocia', nameEs: 'Capadocia',
    desc: 'Provincia oriental de Anatolia, frontera con Parto y Armenia.',
    polygon: [
      [40.5,36.5],[40.5,38.0],[40.0,38.5],[39.5,39.5],[38.5,40.0],
      [38.0,39.5],[37.5,38.5],[37.5,36.5],[38.5,36.5],[39.0,37.5],[40.5,38.0],
      [40.5,36.5],
    ],
  },
  {
    name: 'Cilicia', nameEs: 'Cilicia',
    desc: 'Estrecha provincia costera en el extremo suroriental de Anatolia.',
    polygon: [
      [36.5,36.5],[37.5,36.5],[37.5,38.5],[38.0,39.5],[37.5,40.0],
      [36.5,39.0],[36.0,37.5],[36.0,36.0],[36.5,36.5],
    ],
  },

  // ── LEVANT & EAST ──────────────────────────────────────────────────────────
  {
    name: 'Syria', nameEs: 'Siria',
    desc: 'Rica provincia oriental con capital en Antioquía.',
    polygon: [
      [36.5,36.0],[37.5,40.0],[37.0,41.0],[36.5,40.0],[35.5,38.0],
      [35.0,37.0],[34.5,38.5],[33.5,37.0],[33.0,36.0],[33.5,35.5],
      [34.0,36.5],[34.5,36.0],[35.5,36.0],[36.0,37.5],[36.5,39.0],
      [37.5,40.0],[36.5,36.0],
    ],
  },
  {
    name: 'Iudaea', nameEs: 'Judea',
    desc: 'Provincia de Palestina, escenario de la guerra judía.',
    polygon: [
      [33.5,35.5],[33.0,36.0],[33.5,37.0],[32.5,37.5],[31.5,35.5],
      [30.5,35.0],[31.5,34.5],[32.5,34.5],[33.5,35.5],
    ],
  },
  {
    name: 'Arabia Petraea', nameEs: 'Arabia Pétrea',
    desc: 'Provincia incorporada bajo Trajano en 106, con capital en Bostra.',
    polygon: [
      [32.5,37.5],[33.0,36.0],[33.5,35.5],[32.5,34.5],[31.5,34.5],
      [30.5,35.0],[29.5,35.0],[29.0,36.5],[30.0,38.0],[31.5,37.5],[32.5,37.5],
    ],
  },
  {
    name: 'Mesopotamia', nameEs: 'Mesopotamia',
    desc: 'Conquista efímera de Trajano entre el Éufrates y el Tigris.',
    polygon: [
      [37.0,41.0],[38.5,40.0],[39.5,39.5],[40.5,38.5],[41.5,44.0],
      [38.0,47.0],[35.5,47.0],[33.0,44.5],[33.1,44.5],[34.5,43.5],
      [35.5,42.0],[36.5,40.0],[37.0,41.0],
    ],
  },
  {
    name: 'Armenia', nameEs: 'Armenia',
    desc: 'Reino conquistado temporalmente por Trajano en 114 d.C.',
    polygon: [
      [40.5,38.5],[40.0,38.5],[39.5,39.5],[38.5,40.0],[37.5,40.0],
      [37.0,41.0],[36.5,40.0],[37.5,40.0],[38.5,42.0],[39.5,43.5],
      [40.0,46.0],[40.5,45.5],[41.5,44.0],[40.5,38.5],
    ],
  },

  // ── AFRICA ─────────────────────────────────────────────────────────────────
  {
    name: 'Aegyptus', nameEs: 'Egipto',
    desc: 'Posesión personal del emperador, granero vital del Imperio.',
    polygon: [
      [31.5,25.0],[31.5,34.0],[30.5,35.0],[29.5,35.0],[27.0,34.0],
      [24.0,32.5],[22.0,31.0],[22.0,25.0],[24.5,25.0],[27.0,25.0],
    ],
  },
  {
    name: 'Africa Proconsularis', nameEs: 'África Proconsular',
    desc: 'El granero de Roma, con capital en Carthago renovada.',
    polygon: [
      [37.1,11.5],[37.5,10.0],[37.1,9.0],[36.5,7.5],[36.0,6.5],[35.0,6.5],
      [30.0,6.5],[30.0,14.5],[31.5,14.5],[32.5,14.5],[33.0,13.0],
      [33.5,12.0],[37.1,11.5],
    ],
  },
  {
    name: 'Numidia', nameEs: 'Numidia',
    desc: 'Antigua tierra de Jugurta, rica en trigo y caballos.',
    polygon: [
      [36.5,7.5],[37.1,9.0],[37.5,10.0],[37.1,11.5],[36.0,8.5],
      [35.5,7.5],[35.0,6.5],[36.0,6.5],
    ],
  },
  {
    name: 'Mauretania Caesariensis', nameEs: 'Mauritania Cesariense',
    desc: 'Provincia norteafricana central con capital en Caesarea.',
    polygon: [
      [35.0,6.5],[35.5,7.5],[36.0,8.5],[37.1,11.5],[35.5,9.0],
      [35.0,8.0],[34.5,5.5],[35.0,3.0],[36.5,3.0],[36.5,5.5],
    ],
  },
  {
    name: 'Mauretania Tingitana', nameEs: 'Mauritania Tingitana',
    desc: 'Provincia norteafricana occidental con capital en Tingis.',
    polygon: [
      [36.0,-6.3],[37.1,-5.5],[35.9,-5.5],[35.5,-5.0],[35.0,-4.5],
      [34.5,-3.0],[34.0,-1.5],[34.5,0.0],[35.0,3.0],[34.5,5.5],
      [33.5,5.5],[32.0,3.5],[32.0,0.0],[33.5,-5.0],[35.0,-5.5],[36.0,-6.3],
    ],
  },
];

export const getRomanProvince = (lat: number, lng: number): RomanProvince | null => {
  // Find the smallest (most specific) polygon that contains the point
  let bestMatch: RomanProvince | null = null;
  let bestArea = Infinity;

  for (const prov of PROVINCES) {
    if (pointInPolygon(lat, lng, prov.polygon)) {
      const area = polygonArea(prov.polygon);
      if (area < bestArea) {
        bestArea = area;
        bestMatch = prov;
      }
    }
  }

  return bestMatch;
};

// Export all provinces for map rendering
export const getAllProvinces = (): RomanProvince[] => PROVINCES;

// --- MILIARIUM ---
// Rome coordinates: 41.9028° N, 12.4964° E (Milliarium Aureum in the Forum)
const ROME_LAT = 41.9028;
const ROME_LNG = 12.4964;

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const KM_PER_ROMAN_MILE = 1.48;

export const getDistanceToRome = (lat: number, lng: number): { km: number; romanMiles: number } => {
  const km = haversineKm(lat, lng, ROME_LAT, ROME_LNG);
  return { km: Math.round(km), romanMiles: Math.round(km / KM_PER_ROMAN_MILE) };
};

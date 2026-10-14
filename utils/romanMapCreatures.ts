// Mythological creatures hidden on the Roman map (RomanMapCanvas), revealed from
// zoom 3. Pliny's regional marvels mixed with Greco-Roman monsters. Descriptions are
// classical Latin: exact quotations cite the passage; "cf." marks an abridged or
// grammatically adapted line. Art is drawn once per creature in a 64×64 box
// centred on (0, 0), y down; the idle motion is CSS (see .creature-* in index.css).

export interface MapCreature {
  key: string;
  name: string;      // Latin, all caps
  lat: number;
  lng: number;
  sea: boolean;      // sea creatures bob, land creatures breathe
  desc: string;      // one-line Latin description
  source: string;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

// Muted earth palette matching the parchment map; sea creatures in dusty blue,
// lighter than the sea fill so they read against it.
const OUTLINE = '#2b2118';
const TERRA = '#a0603f';
const OLIVE = '#737a46';
const OCHRE = '#a88a52';
const UMBER = '#6e5238';
const BONE = '#dccfae';
const FEATHER = '#c2a56c';
const SEA_BLUE = '#8fa7b4';
const SEA_DEEP = '#61808f';
const FOAM = 'rgba(222,230,232,0.75)';

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

const shape = (ctx: Ctx, fill: string, build: () => void) => {
  ctx.beginPath();
  build();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.stroke();
};
const ellipse = (ctx: Ctx, fill: string, x: number, y: number, rx: number, ry: number, rot = 0) =>
  shape(ctx, fill, () => ctx.ellipse(x, y, rx, ry, rot, 0, TAU));
const poly = (ctx: Ctx, fill: string, pts: [number, number][]) =>
  shape(ctx, fill, () => { pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); });
const dot = (ctx: Ctx, x: number, y: number, r = 1.3) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = OUTLINE;
  ctx.fill();
};
const stroke = (ctx: Ctx, build: () => void, color = OUTLINE, width = 1.6) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  build();
  ctx.stroke();
  ctx.restore();
};
/** An outlined limb, neck or tail: a dark wide stroke under a coloured narrower one. */
const tube = (ctx: Ctx, color: string, width: number, build: () => void) => {
  stroke(ctx, build, OUTLINE, width + 2.6);
  stroke(ctx, build, color, width);
};
const waves = (ctx: Ctx, y = 27) =>
  stroke(ctx, () => {
    for (const x0 of [-24, 2]) {
      ctx.moveTo(x0, y);
      ctx.quadraticCurveTo(x0 + 5.5, y - 4, x0 + 11, y);
      ctx.quadraticCurveTo(x0 + 16.5, y + 4, x0 + 22, y);
    }
  }, FOAM, 1.4);
const legs = (ctx: Ctx, color: string, pairs: [number, number, number, number][]) =>
  pairs.forEach(([x1, y1, x2, y2]) => tube(ctx, color, 3, () => { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }));

export const CREATURES: MapCreature[] = [
  {
    key: 'hydra', name: 'HYDRA', lat: 38.5, lng: 25.3, sea: false,
    desc: 'quinquaginta atris immanis hiatibus Hydra',
    source: 'Verg. Aen. VI.576',
    draw: ctx => {
      const heads: [number, number][] = [[-22, -12], [-12, -23], [0, -28], [12, -23], [22, -12]];
      heads.forEach(([hx, hy], i) => tube(ctx, OLIVE, 3.2, () => {
        const bx = -10 + i * 5;
        ctx.moveTo(bx, 16);
        ctx.quadraticCurveTo(bx + (hx - bx) * 0.2 + (i % 2 ? 4 : -4), (16 + hy) / 2, hx, hy + 3);
      }));
      ellipse(ctx, OLIVE, 0, 20, 18, 8);
      heads.forEach(([hx, hy]) => {
        ellipse(ctx, OLIVE, hx, hy, 4.4, 3.2, hx < 0 ? -0.3 : 0.3);
        dot(ctx, hx + (hx < 0 ? -1 : 1), hy - 0.6, 0.9);
      });
      stroke(ctx, () => { ctx.moveTo(0, -31); ctx.lineTo(-1.5, -35); ctx.moveTo(0, -31); ctx.lineTo(1.5, -35); }, TERRA, 1);
    },
  },
  {
    key: 'scylla', name: 'SCYLLA', lat: 38.7, lng: 15.5, sea: true,
    desc: 'prima hominis facies et pulchro pectore virgo, postrema immani corpore pistrix',
    source: 'Verg. Aen. III.426–427',
    draw: ctx => {
      tube(ctx, SEA_BLUE, 5, () => { ctx.moveTo(8, 18); ctx.bezierCurveTo(22, 22, 28, 8, 22, -2); });
      poly(ctx, SEA_BLUE, [[22, -2], [16, -8], [28, -7]]);
      ellipse(ctx, SEA_DEEP, 0, 16, 16, 8);
      for (const [x, y, dir] of [[-17, 9, -1], [-8, 21, -1], [13, 12, 1]] as const) {
        ellipse(ctx, UMBER, x, y, 5, 3.4);
        poly(ctx, UMBER, [[x - dir * 1, y - 2.5], [x + dir * 1.5, y - 7], [x + dir * 2.5, y - 2]]);
        dot(ctx, x + dir * 2.5, y - 0.8, 0.8);
      }
      poly(ctx, BONE, [[-6, 10], [-5, -5], [5, -5], [6, 10]]);
      ellipse(ctx, BONE, 0, -11, 5, 5.5);
      shape(ctx, UMBER, () => { ctx.arc(0, -12, 5.6, Math.PI * 1.05, Math.PI * 1.95); ctx.closePath(); });
      dot(ctx, -1.8, -11, 0.8);
      dot(ctx, 1.8, -11, 0.8);
      waves(ctx);
    },
  },
  {
    key: 'cyclopes', name: 'CYCLOPES', lat: 37.3, lng: 14.2, sea: false,
    desc: 'monstrum horrendum, informe, ingens, cui lumen ademptum',
    source: 'Verg. Aen. III.658',
    draw: ctx => {
      legs(ctx, BONE, [[-6, 16, -7, 28], [6, 16, 7, 28]]);
      tube(ctx, UMBER, 3.5, () => { ctx.moveTo(10, 2); ctx.lineTo(23, -18); });
      ellipse(ctx, UMBER, 24, -20, 4.5, 5);
      poly(ctx, TERRA, [[-11, -4], [11, -4], [14, 18], [-14, 18]]);
      ellipse(ctx, BONE, 0, -14, 9, 8.5);
      ellipse(ctx, '#efe6cc', 0, -15, 4.2, 3);
      dot(ctx, 0, -15, 1.8);
      stroke(ctx, () => { ctx.moveTo(-5.5, -19.5); ctx.quadraticCurveTo(0, -22, 5.5, -19.5); });
      stroke(ctx, () => { ctx.moveTo(-3, -9); ctx.quadraticCurveTo(0, -7.5, 3, -9); }, OUTLINE, 1.2);
    },
  },
  {
    key: 'cynocephali', name: 'CYNOCEPHALI', lat: 48.0, lng: 12.0, sea: false,
    desc: 'capitibus caninis ferarum pellibus velantur, pro voce latratum edunt',
    source: 'cf. Plin. NH VII.23',
    draw: ctx => {
      legs(ctx, UMBER, [[-5, 14, -6, 28], [5, 14, 6, 28]]);
      tube(ctx, UMBER, 3, () => { ctx.moveTo(-9, -3); ctx.lineTo(-14, 10); });
      tube(ctx, UMBER, 3, () => { ctx.moveTo(9, -3); ctx.lineTo(15, 8); });
      stroke(ctx, () => { ctx.moveTo(18, -16); ctx.lineTo(14, 26); }, UMBER, 2);
      poly(ctx, TERRA, [[-9, -6], [9, -6], [11, 15], [-11, 15]]);
      stroke(ctx, () => { for (const x of [-6, -2, 2, 6]) { ctx.moveTo(x, 12); ctx.lineTo(x + 0.5, 15); } }, OUTLINE, 1);
      ellipse(ctx, UMBER, 0, -14, 6, 5);
      ellipse(ctx, UMBER, 6.5, -12, 5.5, 3);
      poly(ctx, UMBER, [[-4, -17], [-2.5, -26], [1.5, -18]]);
      dot(ctx, 2, -15.5, 0.9);
      dot(ctx, 11.6, -12.5, 1.1);
    },
  },
  {
    key: 'blemmyae', name: 'BLEMMYAE', lat: 28.0, lng: 25.0, sea: false,
    desc: 'Blemmyis traduntur capita abesse, ore et oculis pectori adfixis',
    source: 'Plin. NH V.46',
    draw: ctx => {
      legs(ctx, BONE, [[-6, 14, -7, 28], [6, 14, 7, 28]]);
      tube(ctx, BONE, 3, () => { ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-19, -2, -16, 9); });
      tube(ctx, BONE, 3, () => { ctx.moveTo(12, -10); ctx.quadraticCurveTo(19, -2, 16, 9); });
      shape(ctx, BONE, () => ctx.roundRect(-12, -16, 24, 30, [7, 7, 4, 4]));
      poly(ctx, TERRA, [[-12, 9], [12, 9], [13, 16], [-13, 16]]);
      for (const x of [-5, 5]) { ellipse(ctx, '#efe6cc', x, -7, 3.2, 2.2); dot(ctx, x, -7, 1.1); }
      stroke(ctx, () => { ctx.moveTo(0, -5); ctx.lineTo(-1, -1); ctx.lineTo(1, -1); }, OUTLINE, 1.1);
      stroke(ctx, () => { ctx.moveTo(-4, 3); ctx.quadraticCurveTo(0, 6, 4, 3); });
    },
  },
  {
    key: 'sciapodae', name: 'SCIAPODAE', lat: 25.0, lng: 38.0, sea: false,
    desc: 'in maiore aestu humi iacentes resupini umbra se pedum protegunt',
    source: 'cf. Plin. NH VII.23',
    draw: ctx => {
      ellipse(ctx, TERRA, -6, 21, 13, 5);
      ellipse(ctx, BONE, -22, 19, 5, 4.6);
      dot(ctx, -23, 18, 0.9);
      tube(ctx, BONE, 4, () => { ctx.moveTo(5, 19); ctx.quadraticCurveTo(9, 6, 7, -5); });
      ellipse(ctx, BONE, 3, -12, 19, 7, -0.12);
      for (const [x, y] of [[-15, -12], [-14, -16], [-12.5, -19.5], [-10, -21]] as const) ellipse(ctx, BONE, x, y, 2.4, 2);
      stroke(ctx, () => { ctx.moveTo(-6, -8); ctx.quadraticCurveTo(6, -6, 18, -11); }, OUTLINE, 1);
    },
  },
  {
    key: 'hippocampus', name: 'HIPPOCAMPUS', lat: 43.4, lng: -9.9, sea: true,
    desc: 'Nereides supra delphinos et cetos aut hippocampos sedentes',
    source: 'Plin. NH XXXVI.26',
    draw: ctx => {
      tube(ctx, SEA_BLUE, 5, () => { ctx.moveTo(4, 10); ctx.bezierCurveTo(14, 26, 28, 16, 22, 4); ctx.quadraticCurveTo(18, -1, 14, 4); });
      poly(ctx, SEA_DEEP, [[14, 4], [10, 0], [12, 7]]);
      tube(ctx, SEA_BLUE, 3, () => { ctx.moveTo(-8, 8); ctx.lineTo(-17, 13); });
      tube(ctx, SEA_BLUE, 3, () => { ctx.moveTo(-4, 10); ctx.lineTo(-12, 18); });
      poly(ctx, SEA_DEEP, [[-17, 13], [-21, 11], [-20, 16]]);
      poly(ctx, SEA_DEEP, [[-12, 18], [-16, 17], [-14, 22]]);
      ellipse(ctx, SEA_BLUE, -1, 5, 12, 7, -0.35);
      tube(ctx, SEA_BLUE, 7, () => { ctx.moveTo(-6, 0); ctx.lineTo(-11, -12); });
      for (let i = 0; i < 4; i++) poly(ctx, SEA_DEEP, [[-5 - i * 1.5, -2 - i * 3.2], [-1 - i * 1.5, -4 - i * 3.2], [-4.5 - i * 1.5, -5.5 - i * 3.2]]);
      ellipse(ctx, SEA_BLUE, -15, -15, 7.5, 4.5, -0.55);
      poly(ctx, SEA_BLUE, [[-11, -19], [-9, -24], [-8, -18]]);
      dot(ctx, -14, -17, 1);
      dot(ctx, -20.5, -12, 0.8);
      waves(ctx);
    },
  },
  {
    key: 'physeter', name: 'PHYSETER', lat: 56.0, lng: 2.0, sea: true,
    desc: 'in Gallico oceano physeter ingens columnae modo se attollens',
    source: 'Plin. NH IX.8',
    draw: ctx => {
      stroke(ctx, () => {
        ctx.moveTo(-8, 0); ctx.quadraticCurveTo(-10, -12, -16, -20);
        ctx.moveTo(-8, 0); ctx.quadraticCurveTo(-6, -13, 0, -21);
        ctx.moveTo(-8, 0); ctx.lineTo(-8, -18);
      }, FOAM, 1.6);
      poly(ctx, SEA_DEEP, [[18, 14], [30, 2], [28, 12], [32, 22]]);
      shape(ctx, SEA_DEEP, () => { ctx.ellipse(0, 16, 24, 14, 0, Math.PI, TAU); ctx.closePath(); });
      ellipse(ctx, SEA_BLUE, -6, 12, 9, 3.5, -0.1);
      dot(ctx, -14, 9, 1.2);
      stroke(ctx, () => { ctx.moveTo(-24, 14); ctx.quadraticCurveTo(-18, 13, -12, 15); }, OUTLINE, 1.2);
      waves(ctx, 22);
    },
  },
  {
    key: 'manticora', name: 'MANTICORA', lat: 35.2, lng: 42.0, sea: false,
    desc: 'triplici dentium ordine, facie et auriculis hominis, corpore leonis, cauda scorpionis',
    source: 'cf. Plin. NH VIII.75',
    draw: ctx => {
      tube(ctx, TERRA, 3.2, () => { ctx.moveTo(14, 4); ctx.bezierCurveTo(26, -2, 24, -18, 12, -20); });
      poly(ctx, UMBER, [[12, -20], [16, -24], [15, -17]]);
      legs(ctx, OCHRE, [[-10, 12, -11, 26], [-4, 13, -3, 26], [6, 13, 7, 26], [12, 11, 14, 25]]);
      ellipse(ctx, OCHRE, 1, 7, 16, 8);
      ellipse(ctx, TERRA, -15, -3, 10, 10);
      ellipse(ctx, BONE, -16, -3, 6, 6.5);
      dot(ctx, -18, -4.5, 0.9);
      dot(ctx, -13.8, -4.5, 0.9);
      stroke(ctx, () => { ctx.moveTo(-19, 0.5); ctx.lineTo(-13, 0.5); for (const x of [-18, -16, -14]) { ctx.moveTo(x, 0.5); ctx.lineTo(x, 2); } }, OUTLINE, 0.9);
    },
  },
  {
    key: 'gryps', name: 'GRYPS', lat: 54.0, lng: 38.0, sea: false,
    desc: 'ferarum volucri genere, eruente ex cuniculis aurum',
    source: 'Plin. NH VII.10',
    draw: ctx => {
      tube(ctx, OCHRE, 2.4, () => { ctx.moveTo(15, 8); ctx.quadraticCurveTo(26, 6, 24, -4); });
      legs(ctx, OCHRE, [[-8, 13, -10, 26], [-2, 14, -1, 26], [8, 14, 9, 26], [13, 12, 15, 25]]);
      ellipse(ctx, OCHRE, 2, 9, 14, 7);
      poly(ctx, FEATHER, [[-2, 4], [-8, -22], [0, -16], [6, -24], [10, -15], [17, -19], [15, 3]]);
      stroke(ctx, () => { ctx.moveTo(1, -2); ctx.lineTo(-3, -14); ctx.moveTo(6, -2); ctx.lineTo(5, -16); ctx.moveTo(11, -2); ctx.lineTo(12, -12); }, OUTLINE, 0.9);
      ellipse(ctx, BONE, -13, -2, 6.5, 6);
      poly(ctx, UMBER, [[-18, -3], [-25, 1], [-18, 2]]);
      dot(ctx, -14, -3.5, 1);
    },
  },
  {
    key: 'amphisbaena', name: 'AMPHISBAENA', lat: 30.0, lng: 15.0, sea: false,
    desc: 'geminum caput, hoc est et a cauda, tamquam parum esset uno ore fundi venenum',
    source: 'Plin. NH VIII.85',
    draw: ctx => {
      tube(ctx, OLIVE, 6, () => { ctx.moveTo(-22, 10); ctx.bezierCurveTo(-8, -16, 8, 30, 22, -4); });
      stroke(ctx, () => { ctx.moveTo(-14, 0); ctx.bezierCurveTo(-6, -6, 6, 20, 14, 6); }, '#5d6438', 1.2);
      for (const [x, y, rot, dir] of [[-25, 12, 0.5, -1], [25, -7, -0.6, 1]] as const) {
        ellipse(ctx, OLIVE, x, y, 5.5, 3.8, rot);
        dot(ctx, x + dir * 1.5, y - 1.5, 0.9);
        stroke(ctx, () => { const tx = x + dir * 5.5, ty = y + (dir < 0 ? 3 : -3); ctx.moveTo(tx, ty); ctx.lineTo(tx + dir * 4, ty - 1.5); ctx.moveTo(tx, ty); ctx.lineTo(tx + dir * 4, ty + 1.5); }, TERRA, 1);
      }
    },
  },
  {
    key: 'basiliscus', name: 'BASILISCUS', lat: 31.0, lng: 21.5, sea: false,
    desc: 'candida in capite macula ut quodam diademate insignis; sibilo omnes fugat serpentes',
    source: 'cf. Plin. NH VIII.78',
    draw: ctx => {
      tube(ctx, OLIVE, 5, () => { ctx.moveTo(14, 16); ctx.bezierCurveTo(16, 30, -20, 30, -16, 14); ctx.bezierCurveTo(-13, 2, 6, 8, 4, -8); });
      ellipse(ctx, OLIVE, 5, -12, 6.5, 4.5, -0.2);
      poly(ctx, '#ece3c8', [[0, -16], [1, -22], [3.5, -17], [5, -23.5], [7, -17], [9.5, -21.5], [10, -15]]);
      dot(ctx, 7, -12.5, 1);
      stroke(ctx, () => { ctx.moveTo(11, -11); ctx.lineTo(15, -12.5); ctx.moveTo(11, -11); ctx.lineTo(15, -9.5); }, TERRA, 1);
    },
  },
  {
    key: 'triton', name: 'TRITON', lat: 42.6, lng: 30.5, sea: true,
    desc: 'visum auditumque in quodam specu concha canentem Tritonem',
    source: 'Plin. NH IX.9',
    draw: ctx => {
      tube(ctx, SEA_BLUE, 7, () => { ctx.moveTo(0, 8); ctx.bezierCurveTo(4, 24, 18, 24, 22, 14); });
      poly(ctx, SEA_DEEP, [[22, 14], [30, 8], [27, 16], [30, 22]]);
      poly(ctx, BONE, [[-7, 9], [-6, -7], [6, -7], [7, 9]]);
      tube(ctx, BONE, 3, () => { ctx.moveTo(-5, -5); ctx.lineTo(-12, -13); });
      tube(ctx, BONE, 3, () => { ctx.moveTo(6, -4); ctx.lineTo(12, 4); });
      poly(ctx, OCHRE, [[-12, -12], [-22, -24], [-16, -14], [-13, -16]]);
      ellipse(ctx, BONE, 0, -13, 5, 5.5);
      shape(ctx, SEA_DEEP, () => { ctx.arc(0, -14, 5.8, Math.PI * 1.05, Math.PI * 1.95); ctx.closePath(); });
      poly(ctx, UMBER, [[-3.5, -10], [3.5, -10], [0, -5]]);
      dot(ctx, -1.8, -13.5, 0.8);
      dot(ctx, 1.8, -13.5, 0.8);
      waves(ctx);
    },
  },
  {
    key: 'leucrocuta', name: 'LEUCROCUTA', lat: 50.0, lng: 20.0, sea: false,
    desc: 'ore ad aures usque rescisso; hanc feram humanas voces tradunt imitari',
    source: 'cf. Plin. NH VIII.72',
    draw: ctx => {
      tube(ctx, OCHRE, 2, () => { ctx.moveTo(16, 4); ctx.quadraticCurveTo(24, 6, 25, 14); });
      ellipse(ctx, TERRA, 25, 15, 2.6, 3.2);
      legs(ctx, UMBER, [[-9, 12, -10, 27], [-4, 13, -4, 27], [8, 12, 9, 27], [13, 10, 15, 26]]);
      ellipse(ctx, OCHRE, 2, 6, 15, 7.5);
      ellipse(ctx, TERRA, -11, 2, 6, 7.5, 0.3);
      ellipse(ctx, UMBER, -17, -6, 9, 5.5, -0.15);
      poly(ctx, UMBER, [[-12, -10], [-10, -16], [-8, -9]]);
      stroke(ctx, () => { ctx.moveTo(-26, -5); ctx.quadraticCurveTo(-18, -2, -10, -7); }, BONE, 1.6);
      dot(ctx, -17, -8.5, 1);
    },
  },
  {
    key: 'phoenix', name: 'PHOENIX', lat: 30.5, lng: 32.5, sea: false,
    desc: 'unum in toto orbe nec visum magno opere',
    source: 'Plin. NH X.3',
    draw: ctx => {
      poly(ctx, TERRA, [[-15, 26], [-12, 14], [-8, 19], [-4, 8], [0, 16], [4, 6], [8, 18], [12, 12], [15, 26]]);
      poly(ctx, OCHRE, [[-8, 26], [-5, 18], [-1, 22], [2, 15], [5, 21], [8, 26]]);
      poly(ctx, TERRA, [[-3, -3], [-28, -20], [-22, -10], [-26, -6], [-6, 4]]);
      poly(ctx, TERRA, [[3, -3], [28, -20], [22, -10], [26, -6], [6, 4]]);
      stroke(ctx, () => { ctx.moveTo(-6, -1); ctx.lineTo(-22, -13); ctx.moveTo(6, -1); ctx.lineTo(22, -13); }, OUTLINE, 0.9);
      ellipse(ctx, OCHRE, 0, 2, 6, 9);
      ellipse(ctx, OCHRE, 0, -12, 4.5, 4.2);
      poly(ctx, UMBER, [[-1.5, -10], [0, -6], [1.5, -10]]);
      stroke(ctx, () => { for (const x of [-2, 0, 2]) { ctx.moveTo(x * 0.6, -16); ctx.lineTo(x * 1.6, -21); } }, TERRA, 1.3);
      dot(ctx, -1.6, -12.5, 0.8);
      dot(ctx, 1.6, -12.5, 0.8);
    },
  },
  {
    key: 'alces', name: 'ALCES', lat: 51.0, lng: 9.5, sea: false,
    desc: 'crura sine nodis articulisque habent neque quietis causa procumbunt',
    source: 'Caes. BG VI.27',
    draw: ctx => {
      tube(ctx, UMBER, 5, () => { ctx.moveTo(19, 28); ctx.lineTo(18, -16); ctx.moveTo(18, -6); ctx.lineTo(25, -14); });
      ellipse(ctx, OLIVE, 18, -22, 11, 8);
      legs(ctx, '#8a6a48', [[-12, 9, -13, 27], [-7, 10, -7, 27], [4, 9, 5, 27], [9, 7, 11, 26]]);
      ellipse(ctx, '#8a6a48', -2, 3, 14, 7, 0.12);
      tube(ctx, '#8a6a48', 5, () => { ctx.moveTo(-12, 0); ctx.lineTo(-17, -6); });
      ellipse(ctx, '#8a6a48', -20, -8, 6.5, 4, 0.35);
      poly(ctx, BONE, [[-18, -11], [-24, -21], [-20, -18], [-19, -23], [-16, -17], [-13, -21], [-15, -12]]);
      dot(ctx, -19, -9, 0.9);
    },
  },
  {
    key: 'geryon', name: 'GERYON', lat: 36.6, lng: -7.4, sea: false,
    desc: 'forma tricorporis umbrae',
    source: 'Verg. Aen. VI.289',
    draw: ctx => {
      legs(ctx, BONE, [[-9, 16, -11, 28], [-3, 16, -3, 28], [3, 16, 3, 28], [9, 16, 11, 28]]);
      poly(ctx, TERRA, [[-19, -2], [19, -2], [16, 17], [-16, 17]]);
      ellipse(ctx, OCHRE, -20, 6, 5.5, 7);
      stroke(ctx, () => { ctx.moveTo(-7, -2); ctx.lineTo(-6, 17); ctx.moveTo(7, -2); ctx.lineTo(6, 17); }, OUTLINE, 1);
      for (const [x, y] of [[-12, -9], [0, -13], [12, -9]] as const) {
        ellipse(ctx, BONE, x, y, 4.6, 5);
        shape(ctx, UMBER, () => { ctx.arc(x, y - 1, 5.2, Math.PI, TAU); ctx.closePath(); });
        stroke(ctx, () => { ctx.moveTo(x - 4, y - 6.5); ctx.quadraticCurveTo(x, y - 11, x + 4, y - 6.5); }, TERRA, 1.8);
        dot(ctx, x - 1.6, y + 0.5, 0.8);
        dot(ctx, x + 1.6, y + 0.5, 0.8);
      }
    },
  },
  {
    key: 'panotii', name: 'PANOTII', lat: 54.3, lng: -2.2, sea: false,
    desc: 'quibus magnae aures et ad ambiendum corpus omne patulae',
    source: 'Mela III.56',
    draw: ctx => {
      legs(ctx, BONE, [[-3, 14, -4, 27], [3, 14, 4, 27]]);
      ellipse(ctx, TERRA, 0, 4, 5.5, 11);
      for (const dir of [-1, 1]) {
        shape(ctx, FEATHER, () => ctx.ellipse(dir * 10, 4, 9, 20, dir * -0.12, 0, TAU));
        stroke(ctx, () => ctx.ellipse(dir * 10.5, 2, 4.5, 13, dir * -0.12, 0, TAU), UMBER, 1);
      }
      ellipse(ctx, BONE, 0, -13, 5, 5.5);
      dot(ctx, -1.8, -13.5, 0.8);
      dot(ctx, 1.8, -13.5, 0.8);
      stroke(ctx, () => { ctx.moveTo(-1.6, -10.5); ctx.quadraticCurveTo(0, -9.5, 1.6, -10.5); }, OUTLINE, 1);
    },
  },
];

export const CREATURE_ART_PX = 64;

/** Paints a creature once onto its own small canvas (at device resolution). */
export const paintCreature = (canvas: HTMLCanvasElement, creature: MapCreature) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = canvas.height = Math.round(CREATURE_ART_PX * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, (CREATURE_ART_PX / 2) * dpr, (CREATURE_ART_PX / 2) * dpr);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = OUTLINE;
  creature.draw(ctx);
};

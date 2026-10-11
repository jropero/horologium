const fs = require('fs');
const { Observer, Horizon } = require('astronomy-engine');

const src = fs.readFileSync('components/EgyptianCalendarInfo.tsx', 'utf8');
const m = src.match(/const STAR_CATALOG: \[number, number, number\]\[\] = \[([\s\S]*?)\n\];/);
if (!m) { console.error('catalog not found'); process.exit(1); }
const clean = m[1].replace(/\/\/[^\n]*/g, '');
const STAR_CATALOG = eval('[' + clean + ']');
console.log('stars:', STAR_CATALOG.length);

const lat = 47.5632, lng = 7.5744;
const obs = new Observer(lat, lng, 0);

const times = [
  '2026-10-11T14:27:00Z', // 16:27 CEST
  '2026-10-11T22:00:00Z', // midnight local
  '2026-10-11T00:00:00Z',
];

for (const t of times) {
  const date = new Date(t);
  let left = 0, right = 0;
  const buckets = [0,0,0,0,0,0];
  let up = 0;
  for (const [ra, dec] of STAR_CATALOG) {
    const hz = Horizon(date, obs, ra, dec, 'normal');
    if (hz.altitude < 0) continue;
    up++;
    let az = hz.azimuth;
    if (az < 0) az += 360;
    if (az < 180) left++; else right++;
    buckets[Math.min(5, Math.floor(az / 60))]++;
  }
  console.log(t, 'up:', up, 'left(0-180):', left, 'right(180-360):', right, 'buckets(60deg):', buckets.join(','));
}

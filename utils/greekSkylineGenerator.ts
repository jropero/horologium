// greekSkylineGenerator.ts — Greek architecture SVG path generator
// Clean colonnade silhouettes in left/right zones, matching Egypt's approach.
// Temple columns are separate sub-paths so sky shows through the gaps.

export type GreekBuildingType = 'parthenon' | 'stoa' | 'tholos' | 'olive' | 'ionic_column' | 'theatre' | 'herma' | 'oikos';

export interface GreekSkylineElement {
  id: string;
  type: GreekBuildingType;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

const PRNG = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = s * 16807 % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const generateGreekSkyline = (seed: number): GreekSkylineElement[] => {
  const rand = PRNG(seed);
  const elements: GreekSkylineElement[] = [];

  const leftZone  = { start: 5,   end: 112 };
  const rightZone = { start: 188, end: 295 };

  const generateElement = (xStart: number, zoneEnd: number): { el: GreekSkylineElement; nextX: number } | null => {
    const types: GreekBuildingType[] = ['parthenon', 'parthenon', 'tholos', 'olive', 'olive', 'ionic_column', 'theatre', 'stoa'];
    const type = types[Math.floor(rand() * types.length)];

    let width = 0, height = 0;
    const scale = 0.45 + rand() * 0.65;

    switch (type) {
      case 'parthenon':    width = 40 * scale; height = 34 * scale; break;
      case 'stoa':         width = 48 * scale; height = 16 * scale; break;
      case 'tholos':       width = 18 * scale; height = 22 * scale; break;
      case 'olive':        width = 18 * scale; height = 30 * scale; break;
      case 'ionic_column': width =  4 * scale; height = 38 * scale; break;
      case 'theatre':      width = 42 * scale; height = 22 * scale; break;
      default: break;
    }

    if (xStart + width > zoneEnd) return null;

    const cx = xStart + width / 2;
    let baseY = 180;
    if (cx >= 0 && cx <= 112) {
      const t = cx / 112;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    } else if (cx >= 188 && cx <= 300) {
      const t = (cx - 188) / 112;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    }

    let path = '';

    switch (type) {
      case 'parthenon': {
        // Colonnade: individual column rects (sky visible between them)
        // + solid entablature bar + pediment triangle
        const numCols = Math.max(4, Math.round(4 + (width / 40) * 2));
        const colH    = height * 0.68;
        const colW    = width / (numCols * 2.1); // column width; gap ≈ colW between each
        const spacing = width / numCols;
        const colBase = baseY;
        const colTop  = colBase - colH;

        // Each column as its own closed sub-path (sky shows between them)
        for (let i = 0; i < numCols; i++) {
          const lx = xStart + i * spacing + (spacing - colW) / 2;
          path += `M ${lx} ${colBase} L ${lx+colW} ${colBase} L ${lx+colW} ${colTop} L ${lx} ${colTop} Z `;
        }

        // Solid entablature bar across the top of the columns
        path += `M ${xStart-1} ${colTop} L ${xStart+width+1} ${colTop} L ${xStart+width+1} ${colTop-height*0.12} L ${xStart-1} ${colTop-height*0.12} Z `;

        // Pediment triangle
        const entTop = colTop - height * 0.12;
        path += `M ${xStart-1} ${entTop} L ${cx} ${entTop-height*0.20} L ${xStart+width+1} ${entTop} Z `;
        break;
      }

      case 'stoa': {
        // Long colonnade hall — thin columns with solid roof
        const numCols = Math.max(3, Math.round(width / 9));
        const colH    = height * 0.82;
        const colW    = Math.max(1.5, width / (numCols * 2.6));
        const spacing = width / numCols;

        for (let i = 0; i < numCols; i++) {
          const lx = xStart + i * spacing + (spacing - colW) / 2;
          path += `M ${lx} ${baseY} L ${lx+colW} ${baseY} L ${lx+colW} ${baseY-colH} L ${lx} ${baseY-colH} Z `;
        }
        // Solid roof slab
        path += `M ${xStart-1} ${baseY-colH} L ${xStart+width+1} ${baseY-colH} L ${xStart+width+1} ${baseY-height} L ${xStart-1} ${baseY-height} Z `;
        break;
      }

      case 'tholos': {
        // Circular temple: stepped base + dome arc
        const baseH = height * 0.32;
        path += `M ${xStart} ${baseY} L ${xStart+width} ${baseY} L ${xStart+width} ${baseY-baseH} L ${xStart} ${baseY-baseH} Z `;
        path += `M ${xStart-1} ${baseY-baseH} A ${width/2} ${height*0.68} 0 0 1 ${xStart+width+1} ${baseY-baseH} Z `;
        break;
      }

      case 'olive': {
        const trunkW = width * 0.14, trunkH = height * 0.32;
        path += `M ${cx-trunkW/2} ${baseY} L ${cx+trunkW/2} ${baseY} L ${cx+trunkW/2} ${baseY-trunkH} L ${cx-trunkW/2} ${baseY-trunkH} Z `;
        const cY = baseY - trunkH, crx = width * 0.52, cry = height * 0.40;
        // Main canopy
        path += `M ${cx-crx} ${cY} Q ${cx-crx*0.5} ${cY-cry*1.35} ${cx} ${cY-cry} Q ${cx+crx*0.5} ${cY-cry*1.35} ${cx+crx} ${cY} Q ${cx+crx*0.3} ${cY+3} ${cx} ${cY+2} Q ${cx-crx*0.3} ${cY+3} ${cx-crx} ${cY} Z `;
        // Secondary lobe for organic look
        path += `M ${cx-crx*0.65} ${cY+1} Q ${cx-crx*0.8} ${cY-cry*0.7} ${cx-crx*0.05} ${cY-cry*0.5} Q ${cx+crx*0.65} ${cY-cry*0.6} ${cx+crx*0.6} ${cY+1} Z `;
        break;
      }

      case 'ionic_column': {
        // Tall single column — shaft + wider capital slab
        path += `M ${xStart} ${baseY} L ${xStart+width} ${baseY} L ${xStart+width*0.85} ${baseY-height*0.88} L ${xStart+width*0.15} ${baseY-height*0.88} Z `;
        path += `M ${xStart-2} ${baseY-height*0.88} L ${xStart+width+2} ${baseY-height*0.88} L ${xStart+width+2} ${baseY-height} L ${xStart-2} ${baseY-height} Z `;
        break;
      }

      case 'theatre': {
        // Semicircular theatron with seating tier arcs
        path += `M ${xStart} ${baseY} A ${width/2} ${height} 0 0 1 ${xStart+width} ${baseY} Z `;
        for (let t = 1; t <= 3; t++) {
          const fr = t / 4.2;
          const aw = (width/2)*fr, ah = height*fr*0.9;
          path += `M ${cx-aw} ${baseY} A ${aw} ${ah} 0 0 1 ${cx+aw} ${baseY} A ${aw*0.87} ${ah*0.84} 0 0 0 ${cx-aw*0.87} ${baseY} Z `;
        }
        break;
      }
    }

    return {
      el: { id: `skyline-${type}-${Math.round(xStart)}`, type, path, x: xStart, y: baseY - height, width, height, opacity: 0.8 + rand() * 0.2 },
      nextX: xStart + width + 1 + rand() * 5,
    };
  };

  // Left zone
  let currentX = leftZone.start;
  while (currentX < leftZone.end) {
    const res = generateElement(currentX, leftZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  // Right zone
  currentX = rightZone.start;
  while (currentX < rightZone.end) {
    const res = generateElement(currentX, rightZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  return elements;
};

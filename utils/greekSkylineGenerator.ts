// greekSkylineGenerator.ts — Greek architecture SVG path generator
// Generates Parthenon-style temples, stoas, tholoi, olive trees, Ionic columns, theatres, hermai, oikoi

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

  const leftZone = { start: 5, end: 100 };
  const rightZone = { start: 200, end: 295 };

  const generateElement = (xStart: number, zoneEnd: number): { el: GreekSkylineElement, nextX: number } | null => {
    const types: GreekBuildingType[] = ['parthenon', 'stoa', 'tholos', 'olive', 'olive', 'ionic_column', 'theatre', 'herma', 'oikos'];
    const type = types[Math.floor(rand() * types.length)];

    let width = 0;
    let height = 0;
    const scale = 0.5 + rand() * 0.7;

    switch (type) {
      case 'parthenon': width = 30 * scale; height = 22 * scale; break;
      case 'stoa': width = 45 * scale; height = 12 * scale; break;
      case 'tholos': width = 18 * scale; height = 18 * scale; break;
      case 'olive': width = 12 * scale; height = 20 * scale; break;
      case 'ionic_column': width = 4 * scale; height = 30 * scale; break;
      case 'theatre': width = 40 * scale; height = 16 * scale; break;
      case 'herma': width = 5 * scale; height = 22 * scale; break;
      case 'oikos': width = 25 * scale; height = 12 * scale; break;
    }

    if (xStart + width > zoneEnd) return null;

    let path = '';
    const cx = xStart + width / 2;
    let baseY = 180;

    if (cx >= 0 && cx <= 100) {
      const t = cx / 100;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    } else if (cx >= 200 && cx <= 300) {
      const t = (cx - 200) / 100;
      baseY = 180 - 40 * t + 40 * t * t + 4;
    }

    switch (type) {
      case 'parthenon': {
        // Classic Greek temple with columns and pediment
        const colW = width * 0.08;
        const colH = height * 0.65;
        const numCols = 6;
        const spacing = width / (numCols + 1);

        // Stylobate (base platform with 3 steps)
        path += `M ${xStart - 2} ${baseY} L ${xStart + width + 2} ${baseY} L ${xStart + width + 2} ${baseY - 2} L ${xStart - 2} ${baseY - 2} Z `;
        path += `M ${xStart - 1} ${baseY - 2} L ${xStart + width + 1} ${baseY - 2} L ${xStart + width + 1} ${baseY - 4} L ${xStart - 1} ${baseY - 4} Z `;

        // Columns
        for (let i = 1; i <= numCols; i++) {
          const colX = xStart + spacing * i - colW / 2;
          path += `M ${colX} ${baseY - 4} L ${colX + colW} ${baseY - 4} L ${colX + colW} ${baseY - 4 - colH} L ${colX} ${baseY - 4 - colH} Z `;
        }

        // Entablature (architrave)
        const entY = baseY - 4 - colH;
        path += `M ${xStart - 1} ${entY} L ${xStart + width + 1} ${entY} L ${xStart + width + 1} ${entY - 3} L ${xStart - 1} ${entY - 3} Z `;

        // Pediment (triangular)
        path += `M ${xStart - 2} ${entY - 3} L ${cx} ${baseY - height} L ${xStart + width + 2} ${entY - 3} Z `;
        break;
      }

      case 'stoa': {
        // Long colonnade (covered walkway)
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height} L ${xStart} ${baseY - height} Z `;
        // Roof
        path += `M ${xStart - 1} ${baseY - height} L ${xStart + width + 1} ${baseY - height} L ${xStart + width + 1} ${baseY - height - 2} L ${xStart - 1} ${baseY - height - 2} Z `;
        // Columns along front
        const numCols = Math.max(4, Math.floor(width / 6));
        const colSpacing = width / numCols;
        for (let i = 0; i < numCols; i++) {
          const colX = xStart + i * colSpacing + colSpacing * 0.4;
          path += `M ${colX} ${baseY} L ${colX + 1.5} ${baseY} L ${colX + 1.5} ${baseY - height} L ${colX} ${baseY - height} Z `;
        }
        break;
      }

      case 'tholos': {
        // Circular temple (like at Delphi)
        const baseH = height * 0.4;
        // Circular base
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - baseH} L ${xStart} ${baseY - baseH} Z `;
        // Dome/conical roof
        path += `M ${xStart - 1} ${baseY - baseH} A ${width / 2} ${height * 0.6} 0 0 1 ${xStart + width + 1} ${baseY - baseH} Z `;
        // Small finial on top
        path += `M ${cx - 1} ${baseY - height + 2} L ${cx + 1} ${baseY - height + 2} L ${cx} ${baseY - height - 1} Z `;
        break;
      }

      case 'olive': {
        // Olive tree — rounded canopy on thin trunk
        const trunkW = width * 0.15;
        const trunkH = height * 0.4;
        // Trunk
        path += `M ${cx - trunkW / 2} ${baseY} L ${cx + trunkW / 2} ${baseY} L ${cx + trunkW / 2} ${baseY - trunkH} L ${cx - trunkW / 2} ${baseY - trunkH} Z `;
        // Canopy (irregular ellipse / organic shape)
        const canopyY = baseY - trunkH;
        const crx = width * 0.5;
        const cry = height * 0.35;
        path += `M ${cx - crx} ${canopyY} Q ${cx - crx * 0.6} ${canopyY - cry * 1.3} ${cx} ${canopyY - cry} Q ${cx + crx * 0.6} ${canopyY - cry * 1.3} ${cx + crx} ${canopyY} Q ${cx + crx * 0.3} ${canopyY + 2} ${cx} ${canopyY + 1} Q ${cx - crx * 0.3} ${canopyY + 2} ${cx - crx} ${canopyY} Z `;
        break;
      }

      case 'ionic_column': {
        // Ionic column with volute capital
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height} L ${xStart} ${baseY - height} Z `;
        // Capital with volutes (wider than column)
        path += `M ${xStart - 2} ${baseY - height} L ${xStart + width + 2} ${baseY - height} L ${xStart + width + 2} ${baseY - height - 2} L ${xStart - 2} ${baseY - height - 2} Z `;
        // Volute hints (small circles)
        path += `M ${xStart - 2} ${baseY - height - 1} A 1.5 1.5 0 1 1 ${xStart - 2} ${baseY - height - 1.01} `;
        path += `M ${xStart + width + 2} ${baseY - height - 1} A 1.5 1.5 0 1 1 ${xStart + width + 2} ${baseY - height - 1.01} `;
        break;
      }

      case 'theatre': {
        // Greek semicircular theatre (theatron)
        // Cavea (semicircular seating)
        path += `M ${xStart} ${baseY} A ${width / 2} ${height} 0 0 1 ${xStart + width} ${baseY} `;
        // Close the bottom
        path += `L ${xStart + width} ${baseY} L ${xStart} ${baseY} Z `;
        // Orchestra (small semicircle in center)
        const orchR = width * 0.2;
        path += `M ${cx - orchR} ${baseY} A ${orchR} ${orchR * 0.6} 0 0 1 ${cx + orchR} ${baseY} Z `;
        break;
      }

      case 'herma': {
        // Herm pillar (rectangular pillar with suggestion of head)
        // Base
        path += `M ${xStart - 1} ${baseY} L ${xStart + width + 1} ${baseY} L ${xStart + width + 1} ${baseY - 3} L ${xStart - 1} ${baseY - 3} Z `;
        // Shaft
        path += `M ${xStart} ${baseY - 3} L ${xStart + width} ${baseY - 3} L ${xStart + width} ${baseY - height + 4} L ${xStart} ${baseY - height + 4} Z `;
        // Head (circle on top)
        path += `M ${cx} ${baseY - height + 4} A ${width * 0.6} ${width * 0.6} 0 1 1 ${cx} ${baseY - height + 4.01} Z `;
        break;
      }

      case 'oikos': {
        // Simple Greek house
        // Main building
        path += `M ${xStart} ${baseY} L ${xStart + width * 0.7} ${baseY} L ${xStart + width * 0.7} ${baseY - height} L ${xStart} ${baseY - height} Z `;
        // Pitched roof
        path += `M ${xStart - 1} ${baseY - height} L ${xStart + width * 0.35} ${baseY - height - 5} L ${xStart + width * 0.7 + 1} ${baseY - height} Z `;
        // Courtyard wall
        path += `M ${xStart + width * 0.7} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height * 0.5} L ${xStart + width * 0.7} ${baseY - height * 0.5} Z `;
        break;
      }
    }

    return {
      el: {
        id: `skyline-${type}-${xStart}`,
        type,
        path,
        x: xStart,
        y: baseY - height,
        width,
        height,
        opacity: 0.8 + rand() * 0.2
      },
      nextX: xStart + width + 2 + rand() * 10
    };
  };

  // Left side
  let currentX = leftZone.start;
  while (currentX < leftZone.end) {
    const res = generateElement(currentX, leftZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  // Right side
  currentX = rightZone.start;
  while (currentX < rightZone.end) {
    const res = generateElement(currentX, rightZone.end);
    if (!res) { currentX += 5; continue; }
    elements.push(res.el);
    currentX = res.nextX;
  }

  return elements;
};

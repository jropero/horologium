export type BuildingType = 'temple' | 'aqueduct' | 'dome' | 'cypress' | 'column' | 'amphitheatre' | 'obelisk' | 'villa';

export interface SkylineElement {
  id: string;
  type: BuildingType;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

// Pseudo-random number generator given a seed
const PRNG = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = s * 16807 % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const generateSkyline = (seed: number): SkylineElement[] => {
  const rand = PRNG(seed);
  const elements: SkylineElement[] = [];

  const leftZone = { start: 5, end: 100 };
  const rightZone = { start: 200, end: 295 };

  const generateElement = (xStart: number, zoneEnd: number): { el: SkylineElement, nextX: number } | null => {
    const types: BuildingType[] = ['temple', 'aqueduct', 'dome', 'cypress', 'cypress', 'column', 'amphitheatre', 'obelisk', 'villa'];
    const type = types[Math.floor(rand() * types.length)];
    
    // Altura base (suelo) calculada dinámicamente según las colinas
    let width = 0;
    let height = 0;
    
    const scale = 0.5 + rand() * 0.7; // Factor de escala para variación

    switch (type) {
      case 'temple': width = 25 * scale; height = 20 * scale; break;
      case 'aqueduct': width = 40 * scale; height = 15 * scale; break;
      case 'dome': width = 20 * scale; height = 15 * scale; break;
      case 'cypress': width = 6 * scale; height = 25 * scale; break;
      case 'column': width = 4 * scale; height = 28 * scale; break;
      case 'amphitheatre': width = 45 * scale; height = 18 * scale; break;
      case 'obelisk': width = 6 * scale; height = 38 * scale; break;
      case 'villa': width = 30 * scale; height = 14 * scale; break;
    }

    if (xStart + width > zoneEnd) return null;

    let path = '';
    const cx = xStart + width / 2;
    let baseY = 180;
    
    // Las colinas son curvas de Bezier que bajan desde y=180 hasta y=170 en los centros de las zonas
    if (cx >= 0 && cx <= 100) {
        const t = cx / 100;
        baseY = 180 - 40 * t + 40 * t * t + 4; // +4 para que la base quede justo escondida tras la colina
    } else if (cx >= 200 && cx <= 300) {
        const t = (cx - 200) / 100;
        baseY = 180 - 40 * t + 40 * t * t + 4;
    }

    switch (type) {
      case 'temple':
        // Base rectangular
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height * 0.7} L ${xStart} ${baseY - height * 0.7} Z `;
        // Tejado (Frontón)
        path += `M ${xStart - 2} ${baseY - height * 0.7} L ${xStart + width / 2} ${baseY - height} L ${xStart + width + 2} ${baseY - height * 0.7} Z `;
        break;

      case 'aqueduct':
        // Bloque principal
        path += `M ${xStart} ${baseY} L ${xStart} ${baseY - height} L ${xStart + width} ${baseY - height} L ${xStart + width} ${baseY} `;
        // Recortar 3 arcos
        const archW = width / 3;
        for (let i = 0; i < 3; i++) {
            const ax = xStart + i * archW;
            // Arco desde abajo derecha, arriba hacia la izquierda, abajo izquierda
            path += `L ${ax + archW * 0.9} ${baseY} A ${archW * 0.4} ${height * 0.6} 0 0 0 ${ax + archW * 0.1} ${baseY} `;
        }
        path += 'Z';
        break;

      case 'dome':
        // Base cuadrangular
        const baseH = height * 0.5;
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - baseH} L ${xStart} ${baseY - baseH} Z `;
        // Cúpula (semicirculo)
        path += `M ${xStart} ${baseY - baseH} A ${width / 2} ${height * 0.5} 0 0 1 ${xStart + width} ${baseY - baseH} Z `;
        break;

      case 'cypress':
        path += `M ${xStart + width / 2} ${baseY - height} Q ${xStart + width} ${baseY - height * 0.2} ${xStart + width} ${baseY} L ${xStart} ${baseY} Q ${xStart} ${baseY - height * 0.2} ${xStart + width / 2} ${baseY - height} Z`;
        break;

      case 'column':
        // Columna cilíndrica
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height} L ${xStart} ${baseY - height} Z `;
        // Capitel
        path += `M ${xStart - 1} ${baseY - height} L ${xStart + width + 1} ${baseY - height} L ${xStart + width + 1} ${baseY - height - 2} L ${xStart - 1} ${baseY - height - 2} Z`;
        break;

      case 'amphitheatre':
        path += `M ${xStart} ${baseY} L ${xStart} ${baseY - height * 0.7} L ${xStart + width * 0.1} ${baseY - height} L ${xStart + width * 0.9} ${baseY - height} L ${xStart + width} ${baseY - height * 0.7} L ${xStart + width} ${baseY} `;
        const amphArchW = width / 4;
        for (let i = 3; i >= 0; i--) {
            const ax = xStart + i * amphArchW;
            path += `L ${ax + amphArchW * 0.8} ${baseY} A ${amphArchW * 0.3} ${height * 0.4} 0 0 0 ${ax + amphArchW * 0.2} ${baseY} `;
        }
        path += 'Z';
        break;

      case 'obelisk':
        path += `M ${xStart - 1} ${baseY} L ${xStart + width + 1} ${baseY} L ${xStart + width} ${baseY - 2} L ${xStart} ${baseY - 2} Z `;
        path += `M ${xStart} ${baseY - 2} L ${xStart + width} ${baseY - 2} L ${xStart + width * 0.8} ${baseY - height + 3} L ${xStart + width * 0.2} ${baseY - height + 3} Z `;
        path += `M ${xStart + width * 0.2} ${baseY - height + 3} L ${xStart + width * 0.8} ${baseY - height + 3} L ${xStart + width / 2} ${baseY - height} Z `;
        break;

      case 'villa':
        path += `M ${xStart} ${baseY} L ${xStart} ${baseY - height} L ${xStart + width * 0.3} ${baseY - height} L ${xStart + width * 0.3} ${baseY} Z `;
        path += `M ${xStart - 1} ${baseY - height} L ${xStart + width * 0.15} ${baseY - height - 4} L ${xStart + width * 0.3 + 1} ${baseY - height} Z `;
        path += `M ${xStart + width * 0.3} ${baseY} L ${xStart + width * 0.3} ${baseY - height * 0.6} L ${xStart + width} ${baseY - height * 0.6} L ${xStart + width} ${baseY} Z `;
        path += `M ${xStart + width * 0.3 - 1} ${baseY - height * 0.6} L ${xStart + width * 0.65} ${baseY - height * 0.9} L ${xStart + width + 2} ${baseY - height * 0.6} Z `;
        break;
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

  // Generar lado izquierdo
  let currentX = leftZone.start;
  while (currentX < leftZone.end) {
    const res = generateElement(currentX, leftZone.end);
    if (!res) {
        currentX += 5; // skip a bit if item was too large
        continue;
    }
    const { el, nextX } = res;
    elements.push(el);
    currentX = nextX;
  }

  // Generar lado derecho
  currentX = rightZone.start;
  while (currentX < rightZone.end) {
    const res = generateElement(currentX, rightZone.end);
    if (!res) {
        currentX += 5;
        continue;
    }
    const { el, nextX } = res;
    elements.push(el);
    currentX = nextX;
  }

  return elements;
};

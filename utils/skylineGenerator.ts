export type BuildingType = 'temple' | 'aqueduct' | 'dome' | 'cypress' | 'column';

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
    const types: BuildingType[] = ['temple', 'aqueduct', 'dome', 'cypress', 'cypress', 'column'];
    const type = types[Math.floor(rand() * types.length)];
    
    // Altura base (suelo) en el SVG del RomanClock es 180
    const baseY = 180;
    let width = 0;
    let height = 0;
    let path = '';
    
    const scale = 0.5 + rand() * 0.7; // Factor de escala para variación

    switch (type) {
      case 'temple':
        width = 25 * scale;
        height = 20 * scale;
        if (xStart + width > zoneEnd) return null;
        // Base rectangular
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height * 0.7} L ${xStart} ${baseY - height * 0.7} Z `;
        // Tejado (Frontón)
        path += `M ${xStart - 2} ${baseY - height * 0.7} L ${xStart + width / 2} ${baseY - height} L ${xStart + width + 2} ${baseY - height * 0.7} Z `;
        // Huecos entre columnas (sustraer o pintar encima, mejor dibujamos las columnas y el espacio como sólido, así que en SVG normal pintamos el bloque y recortamos líneas, pero es más fácil dibujar el contorno entero)
        // Alternativa simplificada: silueta maciza
        break;

      case 'aqueduct':
        width = 40 * scale;
        height = 15 * scale;
        if (xStart + width > zoneEnd) return null;
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
        width = 20 * scale;
        height = 15 * scale;
        if (xStart + width > zoneEnd) return null;
        // Base cuadrangular
        const baseH = height * 0.5;
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - baseH} L ${xStart} ${baseY - baseH} Z `;
        // Cúpula (semicirculo)
        path += `M ${xStart} ${baseY - baseH} A ${width / 2} ${height * 0.5} 0 0 1 ${xStart + width} ${baseY - baseH} Z `;
        break;

      case 'cypress':
        width = 6 * scale;
        height = 25 * scale;
        if (xStart + width > zoneEnd) return null;
        path += `M ${xStart + width / 2} ${baseY - height} Q ${xStart + width} ${baseY - height * 0.2} ${xStart + width} ${baseY} L ${xStart} ${baseY} Q ${xStart} ${baseY - height * 0.2} ${xStart + width / 2} ${baseY - height} Z`;
        break;

      case 'column':
        width = 4 * scale;
        height = 28 * scale;
        if (xStart + width > zoneEnd) return null;
        // Columna cilíndrica
        path += `M ${xStart} ${baseY} L ${xStart + width} ${baseY} L ${xStart + width} ${baseY - height} L ${xStart} ${baseY - height} Z `;
        // Capitel
        path += `M ${xStart - 1} ${baseY - height} L ${xStart + width + 1} ${baseY - height} L ${xStart + width + 1} ${baseY - height - 2} L ${xStart - 1} ${baseY - height - 2} Z`;
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

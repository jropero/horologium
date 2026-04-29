// egyptianDeities.ts — Base de Datos de Deidades basada en el friso de Edfu y reloj de Karnak

export interface EgyptianMonthDeityEdfu {
  name: string;
  title: string;
  description: string;
}

export const getEgyptianMonthDeity = (monthIndex: number): EgyptianMonthDeityEdfu => {
  const deities: EgyptianMonthDeityEdfu[] = [
    { 
      name: "Thoth", 
      title: "Señor del Tiempo", 
      description: "Dios de la sabiduría, la escritura y el cómputo del tiempo." 
    },
    { 
      name: "Ptah", 
      title: "El Creador", 
      description: "Dios menfita de los artesanos y la creación." 
    },
    { 
      name: "Hathor", 
      title: "La Dorada", 
      description: "Diosa del cielo, el amor, la música y la belleza." 
    },
    { 
      name: "Sekhmet", 
      title: "La Poderosa", 
      description: "Diosa leona de la guerra y la sanación." 
    },
    { 
      name: "Min", 
      title: "Señor del Desierto", 
      description: "Dios de la fertilidad y las caravanas del este." 
    },
    { 
      name: "Amón", 
      title: "El Oculto", 
      description: "Rey de los dioses y dios del viento." 
    },
    { 
      name: "Osiris", 
      title: "Señor de la Eternidad", 
      description: "Dios del inframundo y la resurrección." 
    },
    { 
      name: "Horus", 
      title: "El Elevado", 
      description: "Dios del cielo y señor de la realeza." 
    },
    { 
      name: "Renenutet", 
      title: "La que Nutre", 
      description: "Diosa serpiente de las cosechas y la abundancia." 
    },
    { 
      name: "Khonsu", 
      title: "El Viajero", 
      description: "Dios lunar que marca el paso del tiempo en la noche." 
    },
    { 
      name: "Mut", 
      title: "La Madre", 
      description: "Diosa madre celestial y consorte de Amón." 
    },
    { 
      name: "Ra-Harakhty", 
      title: "Horus de los Dos Horizontes", 
      description: "Dios solar en su máximo esplendor diurno." 
    }
  ];

  if (monthIndex < 0 || monthIndex > 11) {
    return { 
      name: "Nut", 
      title: "Madre Celeste", 
      description: "Diosa del cielo estrellado y protectora del cosmos." 
    };
  }

  return deities[monthIndex];
};

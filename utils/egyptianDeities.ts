// egyptianDeities.ts — Base de Datos de Deidades basada en el friso de Edfu y reloj de Karnak
//
// Descripciones ampliadas a partir de artículos de Wikipedia (consultados 2026-10-11),
// usando únicamente datos confirmados en las fuentes citadas:
//   - es.wikipedia.org: Thot, Ptah, Hathor, Sejmet, Min, Amón, Osiris, Horus, Renenutet,
//     Jonsu, Mut, Ra-Horajty, Nut
//   - en.wikipedia.org: Ptah, Min (god), Khonsu, Mut, Nut (goddess), Ra (sec. Ra-Horakhty)
// Ningún dato ha sido inventado: si un hecho no figura en estas fuentes, no se incluye.

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
      description: "Thoth, con cabeza de ibis o, menos frecuentemente, de babuino, era el dios de la inteligencia, los jeroglíficos, la magia, las artes, el juicio y la luna, con su templo principal en Hermópolis Magna. Actuaba como consejero de los dioses y mediador entre el mundo divino y el humano, y está atestiguado ya desde el Periodo arcaico (dos primeras dinastías). Su equivalente femenino era Seshat, diosa de la escritura, y su esposa Ma'at, diosa de la verdad."
    },
    {
      name: "Ptah",
      title: "El Creador",
      description: "Ptah era el gran dios creador de Menfis, venerado como \"maestro constructor\": inventor de la albañilería y patrón de arquitectos y artesanos, al que también se atribuía poder destructor y sanador. En la tríada menfita era el esposo de Sekhmet y el padre de Nefertem, y se le consideraba asimismo padre del sabio Imhotep. Los griegos lo identificaron con Hefesto y los romanos con Vulcano."
    },
    {
      name: "Hathor",
      title: "La Dorada",
      description: "Hathor, una de las principales diosas del Antiguo Egipto, era deidad del cielo, madre o consorte de Horus y del dios solar Ra, y madre simbólica de los faraones. Su lado benefactor representaba la música, la danza, la alegría, el amor, la sexualidad y el cuidado materno, mientras que, como Ojo de Ra, podía mostrar un carácter vengativo que protegía al dios de sus enemigos. Se la representaba con frecuencia como vaca o como mujer con un tocado de cuernos de vaca y disco solar. Se le dedicaron más templos que a ninguna otra diosa —el más destacado, el de Dendera— y fue una de las deidades más invocadas en oraciones privadas y ofrendas votivas, especialmente por las mujeres que deseaban tener hijos."
    },
    {
      name: "Sekhmet",
      title: "La Poderosa",
      description: "Sekhmet, símbolo de la fuerza y el poder, era la diosa de la guerra y de la venganza, pero también de la curación, protectora de los faraones a los que guiaba en la guerra; se decía que su aliento creó el desierto. Diosa solar, era considerada en muchas ocasiones la hija primogénita del dios Ra y estaba relacionada con Hathor y Bastet. Su culto estaba tan expandido que, cuando Amenemhat I (dinastía XII) instauró la capital en Itjtawy, su principal centro de culto se trasladó allí."
    },
    {
      name: "Min",
      title: "Señor del Desierto",
      description: "Min era el dios de la fertilidad y la vegetación, dios lunar y de la lluvia, protector de los comerciantes y los mineros, que representaba la fuerza generadora de la naturaleza. Su culto, originado en el periodo predinástico (4.º milenio a. C.), se representaba en forma humana masculina con el miembro erecto sujeto en la mano izquierda y el brazo derecho alzado empuñando un mayal. Los griegos lo identificaron con Pan y Príapo."
    },
    {
      name: "Amón",
      title: "El Oculto",
      description: "Amón, \"El Oculto\", fue un dios celeste de la creación que durante la XI dinastía se elevó a patrono de Tebas sustituyendo a Montu, y que tras la expulsión de los hicsos alcanzó la categoría de dios nacional, fundido con Ra como Amón-Ra, rey de los dioses. Figuraba desde el Imperio Antiguo en la Ogdóada de Hermópolis junto a su paredro Amonet. Como dios celeste era presentado como un hombre de piel azul, y llegó a ser identificado con Zeus en Grecia (Zeus Amón) y con Júpiter en Roma (Júpiter Amón)."
    },
    {
      name: "Osiris",
      title: "Señor de la Eternidad",
      description: "Osiris era el dios de la fertilidad, la agricultura, la resurrección y el más allá, representado con la piel verde, parcialmente momificado, portando la corona atef y, en sus brazos, el cayado y el mayal. Asesinado en una conspiración de su hermano Seth, fue devuelto a la vida por el poder mágico de su esposa Isis y de Neftis, convirtiéndose en juez soberano y supremo del Más Allá, guardián de las leyes de Maat. Abidos fue su gran ciudad de culto desde el Imperio Medio, y su asociación con las crecidas del Nilo lo mantuvo entre los dioses más populares; su culto se exportó a Grecia (Osiris-Apis, Serapis) y Roma."
    },
    {
      name: "Horus",
      title: "El Elevado",
      description: "Horus, el dios halcón, era una de las deidades más importantes de Egipto: dios de la realeza y del cielo, también de la guerra y la caza, venerado desde el Egipto prehistórico tardío, cuando ya era el dios tutelar de Hieracómpolis y el faraón era considerado manifestación de Horus en vida. Hijo póstumo de Isis y Osiris, derrotó a su tío Seth y fue coronado faraón, mientras su padre reinaba en el Más Allá. Como deidad cósmica, sus dos ojos eran el Sol y la Luna, y su Ojo de Udyat se convirtió en un poderoso símbolo protector. En el Templo de Edfu formaba la tríada divina con Hathor y Harsomtus."
    },
    {
      name: "Renenutet",
      title: "La que Nutre",
      description: "Renenutet era la diosa cobra de la alimentación, la fertilidad y la cosecha, guardiana del faraón y madre del dios del grano Nepri. Su nombre sugiere la idea de nodriza, y se la representaba como una mujer con cabeza de cobra amamantando al infante real; también daba alimento a los difuntos en el Más Allá. Terminó siendo identificada con Uadyet, la cobra de la corona de los faraones. Venerada desde tiempos predinásticos, su culto floreció especialmente en El Fayum bajo Amenemhat III, con capillas en lugares como Medinet Madi."
    },
    {
      name: "Khonsu",
      title: "El Viajero",
      description: "Khonsu era el dios egipcio de la Luna; su nombre significa \"viajero\", en alusión al viaje nocturno de la Luna a través del cielo. Junto con Thot marcó el paso del tiempo, y se le atribuía un papel decisivo en la creación de nueva vida en todas las criaturas. En Tebas formaba parte de la tríada divina junto con sus padres Amón y Mut, y estaba asociado a los babuinos."
    },
    {
      name: "Mut",
      title: "La Madre",
      description: "Mut, cuyo nombre significa \"la madre\", era una diosa madre originaria de Tebas, considerada el origen de todo lo creado, diosa del cielo y esposa de Amón. Diosa primordial asociada a las aguas de Nun —de las que a veces se decía que había dado a luz al mundo—, era sobre todo la madre del dios lunar Khonsu, con el que, junto a Amón, formaba la tríada tebana adorada en Karnak. Se la representaba como una mujer con la doble corona de los reyes de Egipto, y participaba en fiestas como la de Opet y la Bella Fiesta del Valle. Los griegos la identificaron con Hera."
    },
    {
      name: "Ra-Harakhty",
      title: "Horus de los Dos Horizontes",
      description: "Ra-Horajty, \"Ra (que es el) Horus del Horizonte\", nació del sincretismo del dios solar Ra con Horajty, la forma de Horus orientada al amanecer: la manifestación del sol en su cenit, entre Jepri, el sol naciente, y Atum, el sol poniente. Fue proclamado rey de los dioses en la tumba de Horemheb, y su figura es muy frecuente en los Libros de los Muertos del Tercer Período Intermedio."
    }
  ];

  if (monthIndex < 0 || monthIndex > 11) {
    return {
      name: "Nut",
      title: "Madre Celeste",
      description: "Nut, \"la grande que alumbró a los dioses\", era la diosa egipcia que personificaba el cielo, el firmamento estrellado: se la representaba desnuda, cubierta de estrellas, arqueada sobre la Tierra, o a veces como vaca. Era la diosa del cielo, las estrellas, las madres y la astronomía; los griegos la identificaron con Rea."
    };
  }

  return deities[monthIndex];
};
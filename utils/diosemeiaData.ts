export interface Diosemeia {
  event: string;
  meaning: string;
  source: string;
}

export const DIOSEMEIA_OMENS: Diosemeia[] =[
  {
    event: "Una racha repentina de viento ha partido en dos el gigantesco peplo de Atenea mientras desfilaba por el Cerámico atado al mástil de la nave ceremonial.",
    meaning: "La ira de los dioses ante la adulación excesiva. Tus proyectos fracasarán por culpa de tu arrogancia (hybris).",
    source: "El Peplo Rasgado (Parke, 302 a.C.)"
  },
  {
    event: "Mientras lavabas a tu cerdito sagrado en el mar del Pireo antes de los Misterios, un tiburón apareció de la nada, devoró la ofrenda y arrancó la pierna al iniciado.",
    meaning: "Presagio funesto. El Estado sufrirá una desgracia o revolución inminente. Mantente al margen de los asuntos públicos hoy.",
    source: "El Tiburón de los Misterios (Parke, 339 a.C.)"
  },
  {
    event: "Una inmensa nube de polvo, como si marcharan 30.000 hombres invisibles, se levanta desde Eleusis, flota hacia el mar y el viento aúlla el nombre sagrado de 'Iacchos'.",
    meaning: "Intervención divina. La victoria está asegurada contra tus enemigos más formidables; los dioses luchan a tu lado en la sombra.",
    source: "La Nube de Salamina (Parke / Heródoto, 480 a.C.)"
  },
  {
    event: "La gran serpiente sagrada que habita en el templo del Erecteón, protectora de la Acrópolis, ha rechazado su ofrenda mensual de pastel de miel.",
    meaning: "La diosa ha abandonado su propia casa. No hay esperanza en la resistencia pasiva; abandona tu posición actual y busca refugio.",
    source: "La Serpiente del Erecteón (Heródoto 8.41)"
  },
  {
    event: "El heraldo sagrado ha entrado en la ciudad llevando su corona de flores enrollada en el bastón en lugar de llevarla puesta en la cabeza, y la gente grita de alegría y dolor a la vez.",
    meaning: "Agravio y victoria mezclados. Obtendrás un gran triunfo, pero vendrá acompañado de una trágica pérdida personal.",
    source: "El retorno de Teseo (Parke, Oscoforias)"
  },
  {
    event: "Un trueno solitario ha retumbado con violencia en el cielo sin que haya una sola nube a la vista.",
    meaning: "Mensaje directo de Zeus. Lo que estabas pensando o haciendo en este exacto momento es el camino correcto. Procede sin dudar.",
    source: "Diosemeia celeste (Lore popular ateniense)"
  },
  {
    event: "Una lechuza ha volado silenciosamente por encima del Ágora y se ha posado en el tejado justo frente a ti.",
    meaning: "Sabiduría y favor divino. La deidad de la ciudad aprueba tu plan. Tu inteligencia te salvará de cualquier trampa.",
    source: "El ave de Atenea"
  },
  {
    event: "Durante una marcha ceremonial, el hombre que caminaba justo delante de ti ha tropezado y su escudo ha caído al suelo de piedra haciendo un ruido sordo.",
    meaning: "Tropiezo del destino. Cancela tus acuerdos comerciales o viajes importantes planificados para el día de hoy.",
    source: "Augurio militar hoplita"
  }
];

export const getRandomDiosemeia = (): Diosemeia => {
  const randomIndex = Math.floor(Math.random() * DIOSEMEIA_OMENS.length);
  return DIOSEMEIA_OMENS[randomIndex];
};

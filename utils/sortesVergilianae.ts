// Sortes Vergilianae — Random verses from Virgil's Aeneid
// Used as an oracle method in ancient Rome: open the book at random for divine guidance.

export interface SorsVergiliana {
  latin: string;
  spanish: string;
  source: string; // Book and line reference
}

export const SORTES: SorsVergiliana[] = [
  { latin: "Audentes fortuna iuvat.", spanish: "La fortuna favorece a los audaces.", source: "Aen. X, 284" },
  { latin: "Forsan et haec olim meminisse iuvabit.", spanish: "Quizá algún día recordar esto nos traiga placer.", source: "Aen. I, 203" },
  { latin: "Flectere si nequeo superos, Acheronta movebo.", spanish: "Si no puedo doblegar a los dioses, moveré el Infierno.", source: "Aen. VII, 312" },
  { latin: "Varium et mutabile semper femina.", spanish: "La mujer es siempre cosa voluble y cambiante.", source: "Aen. IV, 569" },
  { latin: "Timeo Danaos et dona ferentes.", spanish: "Temo a los griegos incluso cuando traen regalos.", source: "Aen. II, 49" },
  { latin: "Sunt lacrimae rerum et mentem mortalia tangunt.", spanish: "Hay lágrimas en las cosas y lo mortal toca el alma.", source: "Aen. I, 462" },
  { latin: "Fata viam invenient.", spanish: "Los hados encontrarán el camino.", source: "Aen. III, 395" },
  { latin: "Dux femina facti.", spanish: "Una mujer fue la líder de la hazaña.", source: "Aen. I, 364" },
  { latin: "Possunt quia posse videntur.", spanish: "Pueden porque creen que pueden.", source: "Aen. V, 231" },
  { latin: "Facilis descensus Averno.", spanish: "Fácil es el descenso al Averno.", source: "Aen. VI, 126" },
  { latin: "Tu ne cede malis, sed contra audentior ito.", spanish: "No cedas ante los males, sino avanza contra ellos con más audacia.", source: "Aen. VI, 95" },
  { latin: "Mens agitat molem.", spanish: "La mente mueve la materia.", source: "Aen. VI, 727" },
  { latin: "Nulla salus bello, pacem te poscimus omnes.", spanish: "No hay salvación en la guerra; todos te pedimos paz.", source: "Aen. XI, 362" },
  { latin: "Dis aliter visum.", spanish: "Los dioses decidieron de otra manera.", source: "Aen. II, 428" },
  { latin: "Non ignara mali, miseris succurrere disco.", spanish: "Conocedora del mal, aprendo a socorrer a los desgraciados.", source: "Aen. I, 630" },
  { latin: "Hoc opus, hic labor est.", spanish: "Esta es la obra, este es el esfuerzo.", source: "Aen. VI, 129" },
  { latin: "Amor omnibus idem.", spanish: "El amor es igual para todos.", source: "Georg. III, 244" },
  { latin: "Omnia vincit amor; et nos cedamus amori.", spanish: "El amor todo lo vence; cedamos también nosotros al amor.", source: "Ecl. X, 69" },
  { latin: "Macte nova virtute, puer; sic itur ad astra.", spanish: "¡Ánimo con tu nuevo valor, muchacho! Así se llega a las estrellas.", source: "Aen. IX, 641" },
  { latin: "Quae regio in terris nostri non plena laboris?", spanish: "¿Qué región de la tierra no está llena de nuestro sufrimiento?", source: "Aen. I, 460" },
  { latin: "Felix qui potuit rerum cognoscere causas.", spanish: "Feliz aquel que pudo conocer las causas de las cosas.", source: "Georg. II, 490" },
  { latin: "Durate, et vosmet rebus servate secundis.", spanish: "Resistid, y reservaos para tiempos mejores.", source: "Aen. I, 207" },
  { latin: "Exoriare aliquis nostris ex ossibus ultor.", spanish: "Que surja algún vengador de mis huesos.", source: "Aen. IV, 625" },
  { latin: "Nec te tua funera mater produxi.", spanish: "No te conduje yo, tu madre, a tu funeral.", source: "Aen. IX, 486" },
  { latin: "Una salus victis: nullam sperare salutem.", spanish: "La única salvación para los vencidos es no esperar salvación alguna.", source: "Aen. II, 354" },
  { latin: "Stat sua cuique dies.", spanish: "A cada cual le llega su día.", source: "Aen. X, 467" },
  { latin: "Sic vos non vobis mellificatis, apes.", spanish: "Así vosotras, abejas, hacéis la miel, pero no para vosotras.", source: "Attr. Virgilio" },
  { latin: "Labor omnia vicit improbus.", spanish: "El trabajo tenaz todo lo venció.", source: "Georg. I, 145" },
  { latin: "Optima quaeque dies miseris mortalibus aevi prima fugit.", spanish: "Los mejores días de la vida son los primeros en huir para los pobres mortales.", source: "Georg. III, 66" },
  { latin: "O passi graviora, dabit deus his quoque finem.", spanish: "¡Oh, vosotros que habéis sufrido cosas peores! Un dios pondrá fin también a esto.", source: "Aen. I, 199" },
];

export const getRandomSors = (): SorsVergiliana => {
  return SORTES[Math.floor(Math.random() * SORTES.length)];
};

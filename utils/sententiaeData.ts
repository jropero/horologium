export interface Sententia {
  id: number;
  latin: string;
  author: string;
  translation: string;
}

export const SENTENTIAE: Sententia[] = [
  // === CICERO ===
  { id: 1, latin: "Dum spiro, spero.", author: "Cicero", translation: "Mientras respiro, espero." },
  { id: 2, latin: "Cuiusvis hominis est errare, nullius nisi insipientis in errore perseverare.", author: "Cicero", translation: "Errar es de cualquier hombre; perseverar en el error, solo del necio." },
  { id: 3, latin: "Vivere est cogitare.", author: "Cicero", translation: "Vivir es pensar." },
  { id: 4, latin: "Pecunia nervus belli.", author: "Cicero", translation: "El dinero es el nervio de la guerra." },
  { id: 5, latin: "Salus populi suprema lex esto.", author: "Cicero", translation: "Que la salud del pueblo sea la ley suprema." },
  { id: 6, latin: "Historia magistra vitae.", author: "Cicero", translation: "La historia es la maestra de la vida." },
  { id: 7, latin: "O tempora, o mores!", author: "Cicero", translation: "¡Oh, tiempos! ¡Oh, costumbres!" },
  { id: 8, latin: "Usus magister est optimus.", author: "Cicero", translation: "La práctica es el mejor maestro." },
  { id: 9, latin: "Summum ius, summa iniuria.", author: "Cicero", translation: "Suma justicia, suma injusticia." },
  { id: 10, latin: "Omnium rerum principia parva sunt.", author: "Cicero", translation: "Los principios de todas las cosas son pequeños." },
  { id: 11, latin: "Epistula non erubescit.", author: "Cicero", translation: "Una carta no se sonroja." },
  { id: 12, latin: "Silent enim leges inter arma.", author: "Cicero", translation: "Las leyes guardan silencio en medio de las armas." },
  { id: 13, latin: "Stultorum plena sunt omnia.", author: "Cicero", translation: "Todo está lleno de necios." },
  { id: 14, latin: "Non nobis solum nati sumus.", author: "Cicero", translation: "No hemos nacido solo para nosotros mismos." },
  { id: 15, latin: "Ut sementem feceris, ita metes.", author: "Cicero", translation: "Como siembres, así cosecharás." },
  { id: 16, latin: "Amicus est tamquam alter idem.", author: "Cicero", translation: "Un amigo es como un segundo yo." },
  { id: 17, latin: "Sine amicitia vita est nulla.", author: "Cicero", translation: "Sin amistad, la vida no es nada." },
  { id: 18, latin: "Brevis a natura nobis vita data est; at memoria bene redditae vitae est sempiterna.", author: "Cicero", translation: "La naturaleza nos dio una vida breve; pero el recuerdo de una vida bien vivida es eterno." },
  { id: 19, latin: "Nescire autem quid ante quam natus sis acciderit, id est semper esse puerum.", author: "Cicero", translation: "Ignorar lo que ocurrió antes de tu nacimiento es ser siempre un niño." },
  { id: 20, latin: "Cedant arma togae, concedat laurea laudi.", author: "Cicero", translation: "Que las armas cedan a la toga, y el laurel a la elocuencia." },
  { id: 21, latin: "Nihil est aptius ad delectationem lectoris quam temporum varietates fortunaeque vicissitudines.", author: "Cicero", translation: "Nada deleita más al lector que los cambios de fortuna y las vicisitudes del destino." },
  { id: 22, latin: "Gratia, quae tarda est, ingrata est.", author: "Cicero", translation: "La gratitud que llega tarde, es ingratitud." },
  { id: 23, latin: "Mortem oppetere est melius quam servire.", author: "Cicero", translation: "Es mejor afrontar la muerte que servir como esclavo." },
  { id: 24, latin: "Ubi nihil erit quod scribas, id ipsum scribes.", author: "Cicero", translation: "Cuando no tengas nada que escribir, escribe eso mismo." },

  // === SENECA ===
  { id: 25, latin: "Non est ad astra mollis e terris via.", author: "Seneca", translation: "No hay camino fácil de la tierra a las estrellas." },
  { id: 26, latin: "Docendo discimus.", author: "Seneca", translation: "Enseñando aprendemos." },
  { id: 27, latin: "Ignis aurum probat, miseria fortes viros.", author: "Seneca", translation: "El fuego prueba el oro; la adversidad, a los valientes." },
  { id: 28, latin: "Homines dum docent discunt.", author: "Seneca", translation: "Los hombres aprenden mientras enseñan." },
  { id: 29, latin: "Otium sine litteris mors est et hominis vivi sepultura.", author: "Seneca", translation: "El ocio sin lectura es la muerte y la sepultura del hombre vivo." },
  { id: 30, latin: "Quemadmodum fabula, sic vita; non quam diu, sed quam bene acta sit, refert.", author: "Seneca", translation: "Como una obra de teatro, así es la vida: no importa cuánto dure, sino cuán bien se represente." },
  { id: 31, latin: "Neminem pecunia divitem fecit.", author: "Seneca", translation: "El dinero no ha hecho rico a nadie." },
  { id: 32, latin: "Si vis amari, ama.", author: "Seneca", translation: "Si quieres ser amado, ama." },
  { id: 33, latin: "Nullum magnum ingenium sine mixtura dementiae fuit.", author: "Seneca", translation: "No hubo ningún gran genio sin mezcla de locura." },
  { id: 34, latin: "Vivere militare est.", author: "Seneca", translation: "Vivir es luchar." },
  { id: 35, latin: "Non qui parum habet, sed qui plus cupit, pauper est.", author: "Seneca", translation: "No es pobre el que tiene poco, sino el que desea más." },
  { id: 36, latin: "Quod non vetat lex, hoc vetat fieri pudor.", author: "Seneca", translation: "Lo que no prohíbe la ley, lo prohíbe el pudor." },
  { id: 37, latin: "Longum iter est per praecepta, breve et efficax per exempla.", author: "Seneca", translation: "Largo es el camino de los preceptos, breve y eficaz el de los ejemplos." },
  { id: 38, latin: "Faber est suae quisque fortunae.", author: "Seneca", translation: "Cada cual es artífice de su propia suerte." },
  { id: 39, latin: "Difficile est animum perducere ad contemptionem animae.", author: "Seneca", translation: "Es difícil conducir el alma al desprecio de la muerte." },
  { id: 40, latin: "Non quia difficilia sunt non audemus, sed quia non audemus difficilia sunt.", author: "Seneca", translation: "No es que no nos atrevamos porque sea difícil; es difícil porque no nos atrevemos." },
  { id: 41, latin: "Ira initium insaniae est.", author: "Seneca", translation: "La ira es el comienzo de la locura." },
  { id: 42, latin: "Quam bene vivas refert, non quam diu.", author: "Seneca", translation: "Importa cuán bien vivas, no cuánto." },
  { id: 43, latin: "Ducunt volentem fata, nolentem trahunt.", author: "Seneca", translation: "El destino guía al que lo acepta y arrastra al que se resiste." },

  // === HORACIO ===
  { id: 44, latin: "Aequam memento rebus in arduis servare mentem.", author: "Horatius", translation: "Recuerda mantener la mente serena en las adversidades." },
  { id: 45, latin: "Carpe diem, quam minimum credula postero.", author: "Horatius", translation: "Aprovecha el día, confiando lo mínimo en el mañana." },
  { id: 46, latin: "Est modus in rebus, sunt certi denique fines.", author: "Horatius", translation: "Hay una medida en las cosas; existen unos límites precisos." },
  { id: 47, latin: "Nil sine magno vita labore dedit mortalibus.", author: "Horatius", translation: "La vida no da nada a los mortales sin gran trabajo." },
  { id: 48, latin: "Sapere aude, incipe.", author: "Horatius", translation: "Atrévete a saber, empieza." },
  { id: 49, latin: "Dulce et decorum est pro patria mori.", author: "Horatius", translation: "Es dulce y honroso morir por la patria." },
  { id: 50, latin: "Dimidium facti, qui coepit, habet.", author: "Horatius", translation: "Quien ha comenzado, ya tiene la mitad hecha." },
  { id: 51, latin: "Ira furor brevis est.", author: "Horatius", translation: "La ira es una breve locura." },
  { id: 52, latin: "Naturam expellas furca, tamen usque recurret.", author: "Horatius", translation: "Expulsa la naturaleza a golpes: siempre volverá." },
  { id: 53, latin: "Nunc est bibendum, nunc pede libero pulsanda tellus.", author: "Horatius", translation: "Ahora hay que beber, ahora hay que golpear la tierra con pie libre." },
  { id: 54, latin: "Pallida Mors aequo pulsat pede pauperum tabernas regumque turres.", author: "Horatius", translation: "La pálida Muerte golpea con pie igual las cabañas de los pobres y las torres de los reyes." },
  { id: 55, latin: "Eheu fugaces, Postume, Postume, labuntur anni.", author: "Horatius", translation: "¡Ay! Los años fugaces se deslizan, Póstumo, Póstumo." },
  { id: 56, latin: "Multa petentibus desunt multa.", author: "Horatius", translation: "A los que mucho piden, mucho les falta." },

  // === OVIDIO ===
  { id: 57, latin: "Omnia mutantur, nihil interit.", author: "Ovidius", translation: "Todo cambia, nada perece." },
  { id: 58, latin: "Gutta cavat lapidem, non vi sed saepe cadendo.", author: "Ovidius", translation: "La gota horada la piedra, no por la fuerza, sino cayendo a menudo." },
  { id: 59, latin: "Tempus edax rerum.", author: "Ovidius", translation: "El tiempo devorador de las cosas." },
  { id: 60, latin: "Video meliora proboque, deteriora sequor.", author: "Ovidius", translation: "Veo lo mejor y lo apruebo, pero sigo lo peor." },
  { id: 61, latin: "Perfer et obdura; dolor hic tibi proderit olim.", author: "Ovidius", translation: "Aguanta y resiste; este dolor te será útil algún día." },
  { id: 62, latin: "Exitus acta probat.", author: "Ovidius", translation: "El resultado justifica los hechos." },
  { id: 63, latin: "Nitimur in vetitum semper cupimusque negata.", author: "Ovidius", translation: "Siempre nos inclinamos hacia lo prohibido y deseamos lo que se nos niega." },
  { id: 64, latin: "Fas est et ab hoste doceri.", author: "Ovidius", translation: "Es lícito aprender incluso del enemigo." },
  { id: 65, latin: "Principiis obsta; sero medicina paratur.", author: "Ovidius", translation: "Resiste desde el principio; el remedio llega tarde." },
  { id: 66, latin: "Donec eris felix, multos numerabis amicos; tempora si fuerint nubila, solus eris.", author: "Ovidius", translation: "Mientras seas feliz, contarás muchos amigos; si los tiempos se nublan, estarás solo." },

  // === VIRGILIO ===
  { id: 67, latin: "Omnia vincit Amor; et nos cedamus Amori.", author: "Vergilius", translation: "El amor todo lo vence; cedamos también nosotros al amor." },
  { id: 68, latin: "Audentes fortuna iuvat.", author: "Vergilius", translation: "La fortuna favorece a los audaces." },
  { id: 69, latin: "Sed fugit interea, fugit irreparabile tempus.", author: "Vergilius", translation: "Pero mientras tanto huye, huye irremediablemente el tiempo." },
  { id: 70, latin: "Forsan et haec olim meminisse iuvabit.", author: "Vergilius", translation: "Quizá algún día nos agrade recordar estas cosas." },
  { id: 71, latin: "Mens agitat molem.", author: "Vergilius", translation: "La mente mueve la materia." },
  { id: 72, latin: "Possunt quia posse videntur.", author: "Vergilius", translation: "Pueden porque creen que pueden." },
  { id: 73, latin: "Macte nova virtute, puer; sic itur ad astra.", author: "Vergilius", translation: "¡Ánimo con tu nuevo valor, muchacho! Así se llega a las estrellas." },
  { id: 74, latin: "Labor omnia vicit improbus.", author: "Vergilius", translation: "El trabajo tenaz todo lo venció." },
  { id: 75, latin: "Felix qui potuit rerum cognoscere causas.", author: "Vergilius", translation: "Feliz quien pudo conocer las causas de las cosas." },
  { id: 76, latin: "Sunt lacrimae rerum et mentem mortalia tangunt.", author: "Vergilius", translation: "Hay lágrimas en las cosas y lo mortal conmueve el alma." },
  { id: 77, latin: "Facilis descensus Averno; noctes atque dies patet atri ianua Ditis.", author: "Vergilius", translation: "Fácil es el descenso al Averno; día y noche está abierta la puerta del oscuro Plutón." },

  // === JULIO CÉSAR ===
  { id: 78, latin: "Veni, vidi, vici.", author: "Iulius Caesar", translation: "Vine, vi, vencí." },
  { id: 79, latin: "Alea iacta est.", author: "Iulius Caesar", translation: "La suerte está echada." },
  { id: 80, latin: "Fere libenter homines id quod volunt credunt.", author: "Iulius Caesar", translation: "Los hombres creen fácilmente lo que desean." },
  { id: 81, latin: "Gallia est omnis divisa in partes tres.", author: "Iulius Caesar", translation: "Toda la Galia está dividida en tres partes." },

  // === PLINIO EL VIEJO ===
  { id: 82, latin: "In vino veritas.", author: "Plinius Maior", translation: "En el vino está la verdad." },
  { id: 83, latin: "Nulla dies sine linea.", author: "Plinius Maior", translation: "Ni un solo día sin una línea." },
  { id: 84, latin: "Domi suae quemque praeditum esse oportet.", author: "Plinius Maior", translation: "Cada cual debe estar preparado en su propia casa." },

  // === PUBLILIUS SYRUS ===
  { id: 85, latin: "Vincit qui se vincit.", author: "Publilius Syrus", translation: "Vence quien se vence a sí mismo." },
  { id: 86, latin: "Ubi concordia, ibi victoria.", author: "Publilius Syrus", translation: "Donde hay concordia, hay victoria." },
  { id: 87, latin: "Bis dat qui cito dat.", author: "Publilius Syrus", translation: "Quien da rápido, da dos veces." },
  { id: 88, latin: "Iracundiam qui vincit hostem superat maximum.", author: "Publilius Syrus", translation: "Quien vence la ira supera a su mayor enemigo." },
  { id: 89, latin: "Necessitas dat legem, non ipsa accipit.", author: "Publilius Syrus", translation: "La necesidad impone la ley; ella misma no la recibe." },
  { id: 90, latin: "Stultum est timere quod vitare non potes.", author: "Publilius Syrus", translation: "Es necio temer lo que no puedes evitar." },
  { id: 91, latin: "Maximo periclo custoditur quod multis placet.", author: "Publilius Syrus", translation: "Con el mayor peligro se custodia lo que a muchos agrada." },
  { id: 92, latin: "Beneficium accipere libertatem est vendere.", author: "Publilius Syrus", translation: "Aceptar un favor es vender la libertad." },

  // === JUVENAL ===
  { id: 93, latin: "Mens sana in corpore sano.", author: "Iuvenalis", translation: "Mente sana en cuerpo sano." },
  { id: 94, latin: "Panem et circenses.", author: "Iuvenalis", translation: "Pan y circos." },
  { id: 95, latin: "Quis custodiet ipsos custodes?", author: "Iuvenalis", translation: "¿Quién vigilará a los propios guardias?" },
  { id: 96, latin: "Rara avis in terris nigroque simillima cygno.", author: "Iuvenalis", translation: "Ave rara en la tierra, muy semejante a un cisne negro." },
  { id: 97, latin: "Nobilitas sola est atque unica virtus.", author: "Iuvenalis", translation: "La única y verdadera nobleza es la virtud." },

  // === TERENCIO ===
  { id: 98, latin: "Homo sum, humani nihil a me alienum puto.", author: "Terentius", translation: "Soy hombre, y nada humano me es ajeno." },
  { id: 99, latin: "Quot homines, tot sententiae.", author: "Terentius", translation: "Tantas opiniones como hombres hay." },
  { id: 100, latin: "Fortis fortuna adiuvat.", author: "Terentius", translation: "La fortuna ayuda a los valientes." },
  { id: 101, latin: "Veritas odium parit.", author: "Terentius", translation: "La verdad engendra odio." },

  // === PLAUTO ===
  { id: 102, latin: "Lupus est homo homini, non homo.", author: "Plautus", translation: "El hombre es un lobo para el hombre, no un hombre." },
  { id: 103, latin: "Dictum sapienti sat est.", author: "Plautus", translation: "Al sabio le basta con que se le diga." },
  { id: 104, latin: "Qui e nuce nucleum esse vult, frangit nucem.", author: "Plautus", translation: "El que quiere comer la nuez, ha de romper la cáscara." },

  // === LUCRECIO ===
  { id: 105, latin: "Ex nihilo nihil fit.", author: "Lucretius", translation: "De la nada, nada surge." },
  { id: 106, latin: "Suave mari magno, turbantibus aequora ventis, e terra magnum alterius spectare laborem.", author: "Lucretius", translation: "Es agradable, en el gran mar, contemplar desde tierra la fatiga ajena mientras los vientos agitan las olas." },
  { id: 107, latin: "Tantum religio potuit suadere malorum.", author: "Lucretius", translation: "A tanto mal pudo la religión persuadir a los hombres." },

  // === TÁCITO ===
  { id: 108, latin: "Solitudinem faciunt, pacem appellant.", author: "Tacitus", translation: "Crean un desierto y lo llaman paz." },
  { id: 109, latin: "Omne ignotum pro magnifico.", author: "Tacitus", translation: "Todo lo desconocido pasa por grandioso." },
  { id: 110, latin: "Res olim dissociabiles miscuit: principatum ac libertatem.", author: "Tacitus", translation: "Unió cosas que antes eran incompatibles: el principado y la libertad." },
  { id: 111, latin: "Corruptissima re publica plurimae leges.", author: "Tacitus", translation: "Cuando el Estado está más corrompido, más leyes hay." },

  // === SALUSTIO ===
  { id: 112, latin: "Concordia parvae res crescunt, discordia maximae dilabuntur.", author: "Sallustius", translation: "Con concordia crecen las pequeñas cosas; con discordia, las mayores se derrumban." },
  { id: 113, latin: "Omnis homines qui sese student praestare ceteris animalibus summa ope niti decet.", author: "Sallustius", translation: "Todo hombre que aspire a superar a los demás animales debe esforzarse con todas sus fuerzas." },

  // === MARCO AURELIO ===
  { id: 114, latin: "Obiectio nihil est nisi opinio obiectionis.", author: "Marcus Aurelius", translation: "Una objeción no es más que una opinión sobre la objeción." },
  { id: 115, latin: "Si non est, nihil ad nos; si est, non curat.", author: "Marcus Aurelius", translation: "Si no existe, nada nos importa; si existe, no se preocupa por nosotros." },

  // === PETRONIO ===
  { id: 116, latin: "Mundus universus exercet histrioniam.", author: "Petronius", translation: "El mundo entero hace teatro." },
  { id: 117, latin: "Qualis dominus, talis et servus.", author: "Petronius", translation: "Cual es el amo, tal es el siervo." },

  // === MARCIAL ===
  { id: 118, latin: "Non est vivere, sed valere vita.", author: "Martialis", translation: "Vivir no es estar vivo, sino encontrarse bien." },
  { id: 119, latin: "Vitam quae faciunt beatiorem, iucundissime Martialis, haec sunt.", author: "Martialis", translation: "Las cosas que hacen la vida más feliz, queridísimo Marcial, son estas." },

  // === CATÓN ===
  { id: 120, latin: "Ceterum censeo Carthaginem esse delendam.", author: "Cato Maior", translation: "Además opino que Cartago debe ser destruida." },
  { id: 121, latin: "Rem tene, verba sequentur.", author: "Cato Maior", translation: "Domina el asunto, las palabras vendrán solas." },

  // === VEGECIO ===
  { id: 122, latin: "Si vis pacem, para bellum.", author: "Vegetius", translation: "Si quieres paz, prepara la guerra." },

  // === TITO LIVIO ===
  { id: 123, latin: "Vae victis!", author: "Livius", translation: "¡Ay de los vencidos!" },
  { id: 124, latin: "Ab urbe condita.", author: "Livius", translation: "Desde la fundación de la ciudad." },

  // === QUINTILIANO ===
  { id: 125, latin: "Sat est superare inimicum, nimium est perdere.", author: "Quintilianus", translation: "Basta con vencer al enemigo; destruirlo es excesivo." },

  // === COLUMELA ===
  { id: 126, latin: "Prima cratera ad sitim pertinet, secunda ad hilaritatem, tertia ad voluptatem, quarta ad insaniam.", author: "Apuleius", translation: "La primera copa es para la sed, la segunda para la alegría, la tercera para el placer, la cuarta para la locura." },

  // === PROVERBIOS LATINOS CLÁSICOS (atestiguados en fuentes antiguas) ===
  { id: 127, latin: "Dura lex, sed lex.", author: "Proverbium", translation: "La ley es dura, pero es la ley." },
  { id: 128, latin: "De gustibus non est disputandum.", author: "Proverbium", translation: "Sobre gustos no se discute." },
  { id: 129, latin: "Festina lente.", author: "Augustus", translation: "Apresúrate despacio." },
  { id: 130, latin: "Acta est fabula, plaudite!", author: "Augustus", translation: "Se acabó la función, ¡aplaudid!" },
];

export const getSententiaOfTheDay = (date: Date): Sententia => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = (dayOfYear - 1) % SENTENTIAE.length;
  return SENTENTIAE[index >= 0 ? index : 0];
};

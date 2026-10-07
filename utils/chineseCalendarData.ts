export interface Pentad {
  id: number;
  description: string;
}

export type CustomType =
  | "Veneración Ancestral" | "Protección/Superstición" | "Celebración de la Naturaleza" | "Salud y Bienestar"
  | "Familiar / Respeto" | "Celebración" | "Rito Agrícola" | "Juego / Celebración" | "Veneración"
  | "Protección" | "Costumbre Agrícola" | "Protección / Salud" | "Tradición Culinaria"
  | "Costumbre Culinaria / Médica" | "Rito Estacional" | "Celebración de las Minorías (Dong)"
  | "Mantenimiento / Hogar" | "Contemplación" | "Rito Exorcista" | "Medicina Tradicional"
  | "Cuidado de la Salud / Culinario" | "Celebración Costera" | "Suerte y Salud" | "Bendición Agrícola"
  | "Tradición" | "Cuidado de la Salud" | "Preparación Familiar" | "Preparación Festiva";

export interface ChineseCustom {
  title: string;
  description: string;
  icon: string;
  type: CustomType;
}

export interface SolarTerm {
  id: number;
  pinyin: string;
  hanzi: string;
  translation: string;
  approximateDates: string;
  pentads: Pentad[];
  healthAdvice: string;
  customs: ChineseCustom[];
  traditionalFoods: string[];
}

export const chineseCalendarData: SolarTerm[] = [
  // Primavera (1-6)
  {
    id: 1, pinyin: "Lìchūn", hanzi: "立春", translation: "Comienzo de la Primavera", approximateDates: "4 - 18 de Febrero",
    pentads: [
      { id: 1, description: "Dongfeng Jiedong (东风解冻): Los vientos del este descongelan el hielo." },
      { id: 2, description: "Zhechong Shizhen (蛰虫始振): Los insectos invernantes comienzan a despertar." },
      { id: 3, description: "Yuzhi Fubing (鱼陟负冰): Los peces nadan hacia arriba bajo el hielo fragmentado." }
    ],
    healthAdvice: "Proteger el hígado, que es el órgano asociado a la madera y la primavera. Es crucial evitar el enojo o la frustración para no bloquear el flujo de Qi. Acuéstate tarde, levántate temprano y camina por el patio relajadamente.",
    customs: [
      { title: "咬春 Yao Chun (Morder la Primavera)", description: "En el primer día de primavera se muerden rábanos crudos y rollitos de primavera rellenos de verduras tiernas. El acto de 'morder' sacude al cuerpo del letargo invernal y, según la tradición, aleja las enfermedades durante todo el año.", icon: "🌯", type: "Celebración" },
      { title: "打春牛 Da Chun Niu (Azotar al Buey de Primavera)", description: "Un buey modelado en arcilla y relleno de los cinco granos era golpeado ritualmente por el magistrado local con varas de sauce. Al romperse, los campesinos recogían los fragmentos como talismán de buena cosecha. El rito despertaba simbólicamente a la tierra para la siembra.", icon: "🐂", type: "Rito Agrícola" },
      { title: "迎春 Ying Chun (Recibir la Primavera)", description: "El dios de la primavera Goumang (句芒), de rostro humano y cuerpo de ave, era recibido en procesión por funcionarios y aldeanos que salían de la ciudad a su encuentro. Los ritos de 迎春 abrían oficialmente la temporada de siembra y marcaban el fin de la inactividad invernal.", icon: "🌸", type: "Veneración" }
    ],
    traditionalFoods: ["Rollitos de primavera (春饼)", "Rábanos", "Cebolletas de primavera"]
  },
  {
    id: 2, pinyin: "Yǔshuǐ", hanzi: "雨水", translation: "Agua de Lluvia", approximateDates: "19 de Febrero - 4 de Marzo",
    pentads: [
      { id: 1, description: "Taji Yu (獭祭鱼): Las nutrias ofrecen pescado a los cielos." },
      { id: 2, description: "Houyan Bei (候雁北): Los gansos salvajes vuelan de regreso al norte." },
      { id: 3, description: "Caomu Mengdong (草木萌动): Los árboles y la hierba echan brotes." }
    ],
    healthAdvice: "El clima lluvioso incrementa la 'Humedad'. Abrigarse bien para proteger el Bazo y el Estómago del frío húmedo.",
    customs: [
      { title: "回娘家 Hui Niang Jia (Regreso al Hogar Materno)", description: "Las hijas casadas regresan al hogar de sus padres en este día. El yerno lleva un jamón entero y una jarra de vino como expresión material del agradecimiento por haber criado a su esposa. El regreso refuerza los lazos entre familias que el matrimonio une sin poder unir del todo.", icon: "🎁", type: "Familiar / Respeto" },
      { title: "认干爹 Ren Gan Die (Buscar Padrinos)", description: "En Sichuan, las madres salían con sus hijos pequeños a los caminos y puentes bajo la lluvia, esperando que un transeúnte benevolente aceptara ser padrino del niño. Se creía que vincular al hijo con un 'padre seco' de buen augurio le garantizaba salud y larga vida.", icon: "👶", type: "Protección/Superstición" }
    ],
    traditionalFoods: ["Gachas cálidas (粥)", "Sopa de semillas de loto", "Miel"]
  },
  {
    id: 3, pinyin: "Jīngzhé", hanzi: "惊蛰", translation: "Despertar de los Insectos", approximateDates: "5 - 19 de Marzo",
    pentads: [
      { id: 1, description: "Tao Shihua (桃始华): Los melocotoneros florecen." },
      { id: 2, description: "Canggeng Ming (仓庚鸣): Las oropéndolas comienzan a cantar." },
      { id: 3, description: "Ying Hua Wei Jiu (鹰化为鸠): Las águilas se transforman en palomas." }
    ],
    healthAdvice: "La energía Yang asciende velozmente, lo que puede causar boca seca y tos. Estiramientos suaves que abran los meridianos.",
    customs: [
      { title: "打小人 Da Xiao Ren (Golpear al Villano)", description: "En Hong Kong y el sur de China, figuras de papel que representan a enemigos, envidiosos o fuentes de mala suerte son golpeadas con zapatillas viejas mientras se recitan maldiciones. El rito barre las influencias negativas acumuladas y despeja el año antes de la temporada activa.", icon: "🥿", type: "Protección/Superstición" },
      { title: "祭白虎 Ji Bai Hu (Ofrenda al Tigre Blanco)", description: "El Tigre Blanco (白虎), guardián del oeste en la cosmología china, despierta en 惊蛰 hambriento y agresivo, presto a causar disputas y pleitos. Se le ofrecen trozos de cerdo con grasa y papel amarillo para apaciguarlo y asegurar un año sin conflictos.", icon: "🐅", type: "Protección/Superstición" }
    ],
    traditionalFoods: ["Peras (梨)", "Vegetales de hojas verdes oscuras"]
  },
  {
    id: 4, pinyin: "Chūnfēn", hanzi: "春分", translation: "Equinoccio de Primavera", approximateDates: "20 de Marzo - 3 de Abril",
    pentads: [
      { id: 1, description: "Xuanniao Zhi (玄鸟至): Las golondrinas regresan del sur." },
      { id: 2, description: "Lei Nai Fasheng (雷乃发声): El trueno suena en el cielo." },
      { id: 3, description: "Shidian (始电): Comienzan a aparecer los primeros relámpagos." }
    ],
    healthAdvice: "Equilibrio. No comer alimentos excesivamente fríos ni muy calientes.",
    customs: [
      { title: "立蛋 Li Dan (Equilibrar el Huevo)", description: "En el momento de perfecto equilibrio entre día y noche, se intenta sostener un huevo crudo de pie sobre su base, sin apoyo alguno. El juego es más difícil de lo que parece; lograrlo se interpreta como señal de armonía entre el yin y el yang del hogar.", icon: "🥚", type: "Juego / Celebración" },
      { title: "放风筝 Fang Feng Zheng (Volar Cometas)", description: "Los vientos del equinoccio son los más constantes del año. La tradición manda volar la cometa tanto de día como de noche y, llegado el momento, cortar el hilo: la cometa asciende llevándose consigo las enfermedades y los malos augurios, lejos del alcance de la familia.", icon: "🪁", type: "Celebración de la Naturaleza" },
      { title: "祭日 Ji Ri (Sacrificio al Sol)", description: "En el equinoccio de primavera, el Hijo del Cielo ofrendaba al Sol en el Altar del Sol (日坛) de Pekín, acto simétrico al 祭月 del equinoccio otoñal. Frutas, vino e incienso ante el astro naciente sellaban la alianza entre el poder imperial y las fuerzas del cielo.", icon: "☀️", type: "Veneración" }
    ],
    traditionalFoods: ["Verduras de primavera (春菜)", "Té de primavera recién recolectado"]
  },
  {
    id: 5, pinyin: "Qīngmíng", hanzi: "清明", translation: "Claridad Pura", approximateDates: "4 - 19 de Abril",
    pentads: [
      { id: 1, description: "Tong Shihua (桐始华): Los árboles Tung florecen." },
      { id: 2, description: "Tianshu Hua Wei Ru (田鼠化为鴽): Los ratones de campo se transforman en codornices." },
      { id: 3, description: "Hong Shi Jian (虹始见): Comienzan a aparecer los primeros arcoíris." }
    ],
    healthAdvice: "Evitar tristeza excesiva. Respirar aire fresco y hacer ejercicios de Qi Gong.",
    customs: [
      { title: "扫墓 Sao Mu (Barrer las Tumbas)", description: "Las familias visitan las tumbas de sus antepasados, retiran las malas hierbas, añaden tierra fresca sobre el túmulo y queman papel moneda y ofrendas. La presencia física —estar allí, con los muertos— es el tributo más íntimo que la tradición china exige.", icon: "🧹", type: "Veneración Ancestral" },
      { title: "踏青 Ta Qing (Pisar el Verde)", description: "Tras rendir homenaje a los muertos, las familias pasean por campos y colinas en plena floración. 踏青 ('pisar el verde') es el contrapeso vital de la visita fúnebre: la misma jornada que recuerda la muerte celebra el renacimiento de la naturaleza.", icon: "🌿", type: "Celebración de la Naturaleza" },
      { title: "插柳 Cha Liu (Clavar Ramas de Sauce)", description: "Ramas de sauce se clavan en los marcos de las puertas y se trenzan en coronas para el cabello. El sauce, que brota antes que ningún otro árbol, simboliza la vida que vence a la muerte, y se cree que ahuyenta los espíritus errabundos que abundan en la temporada de los ancestros.", icon: "🎋", type: "Protección" }
    ],
    traditionalFoods: ["Qingtuan (青团, bolas de arroz verde)", "Alimentos fríos (tradición Hanshi)"]
  },
  {
    id: 6, pinyin: "Gǔyǔ", hanzi: "谷雨", translation: "Lluvia de Grano", approximateDates: "20 de Abril - 4 de Mayo",
    pentads: [
      { id: 1, description: "Ping Shi Sheng (萍始生): La lenteja de agua empieza a crecer." },
      { id: 2, description: "Mingjiu Fu Qi Yu (鸣鸠拂其羽): Las tórtolas aletean." },
      { id: 3, description: "Daishou Jiang Sang (戴胜降于桑): Las abubillas se posan en las moreras." }
    ],
    healthAdvice: "Humedad alta. Proteger el Bazo. Evitar suelos húmedos.",
    customs: [
      { title: "采谷雨茶 Zhai Guyu Cha (Cosechar el Té de Guyu)", description: "Las hojas de té recogidas exactamente en los días de 谷雨 gozan de fama especial: la lluvia estacional las nutre sin resecarlas aún por el calor. Bebido una vez al año en su momento preciso, este té aclara los ojos, reduce el calor interno y tiene un frescor que los meses siguientes no repetirán.", icon: "🍵", type: "Costumbre Agrícola" },
      { title: "杀五毒 Sha Wu Du (Eliminar los Cinco Venenos)", description: "Con el calor creciente despiertan los cinco venenos: escorpión, serpiente, ciempiés, lagartija y sapo. Se pegan en las puertas estampas que los muestran sometidos y aplastados, convocando su derrota antes de que salgan a causar daño a niños y animales domésticos.", icon: "🦂", type: "Protección / Salud" },
      { title: "祭仓颉 Ji Cangjie (Honrar a Cangjie)", description: "En Shaanxi, la aldea natal del legendario Cangjie (仓颉), se celebran ofrendas al creador de la escritura china. La tradición dice que el día que inventó los caracteres, los cielos lloraron mijo y los fantasmas aullaron: el lenguaje escrito era un poder tan grande que asustaba al cosmos.", icon: "🖌️", type: "Veneración" }
    ],
    traditionalFoods: ["Té fresco de primavera", "Brotes de Toona sinensis (香椿芽)"]
  },
  // Verano (7-12)
  {
    id: 7, pinyin: "Lìxià", hanzi: "立夏", translation: "Comienzo del Verano", approximateDates: "5 - 20 de Mayo",
    pentads: [
      { id: 1, description: "Louguo Ming (蝼蝈鸣): Los grillos topo cantan." },
      { id: 2, description: "Qiuyin Chu (蚯蚓出): Las lombrices salen a la superficie." },
      { id: 3, description: "Wanggua Sheng (王瓜生): Los melones reales crecen." }
    ],
    healthAdvice: "Corazón asociado al verano. Mantener mente tranquila. Siestas cortas al mediodía.",
    customs: [
      { title: "称人 Cheng Ren (Pesar a las Personas)", description: "Una balanza de madera colgante esperaba en la plaza a toda la aldea. El peso de cada persona quedaba registrado; al final del verano se volvía a pesar: adelgazar era señal de que el calor había dañado la salud, y engordar era presagio de fortuna y buen año.", icon: "⚖️", type: "Protección / Salud" },
      { title: "斗蛋 Dou Dan (Batalla de Huevos)", description: "Los niños cuelgan huevos duros al cuello en redecillas de hilo de colores y los hacen chocar entre sí: gana quien rompe la cáscara del rival sin quebrar la propia. El huevo, símbolo de vitalidad solar, protege al niño durante los meses de calor intenso.", icon: "🥚", type: "Juego / Celebración" },
      { title: "尝新 Chang Xin (Probar lo Nuevo)", description: "El primer día de verano se honra probando 'las tres novedades' de la estación: cerezas, ciruelas verdes y productos del trigo recién cosechado. Es una acción de gracias ante la abundancia que comienza, compartida primero con los ancestros y luego con la familia.", icon: "🍒", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Arroz de cinco colores (五色饭)", "Huevos duros", "Sopa de ciruelas"]
  },
  {
    id: 8, pinyin: "Xiǎomǎn", hanzi: "小满", translation: "Pequeña Plenitud", approximateDates: "21 de Mayo - 5 de Junio",
    pentads: [
      { id: 1, description: "Kucai Xiu (苦菜秀): Las hierbas amargas abundan." },
      { id: 2, description: "Mi Cao Si (靡草死): Las hierbas delicadas mueren." },
      { id: 3, description: "Mai Qiu Zhi (麦秋至): El trigo se prepara para madurar." }
    ],
    healthAdvice: "Calor húmedo. Evitar crudos o muy fríos que debiliten el estómago.",
    customs: [
      { title: "祭三车 Ji San Che (Adorar a los Tres Vehículos)", description: "Los tejedores y agricultores ofrendaban a los tres vehículos que mueven la vida rural: la noria de agua para el arrozal, la rueca de seda para el telar y el molino para el grano. Sin ellos no hay comida ni vestido; su culto reconocía la deuda de la civilización con sus propias herramientas.", icon: "🎡", type: "Rito Agrícola" },
      { title: "吃苦菜 Chi Ku Cai (Comer Hierbas Amargas)", description: "Cuando el calor comienza a acumularse en el cuerpo, la medicina tradicional prescribe el amargor: las hierbas silvestres de sabor amargo drenan el exceso de calor del hígado, purifican la sangre y preparan el organismo para los meses más duros del verano.", icon: "🥗", type: "Costumbre Culinaria / Médica" },
      { title: "祭蚕神 Ji Can Shen (Adorar a la Diosa del Gusano de Seda)", description: "En las regiones sericícolas de Jiangnan, las familias ofrendaban a la Diosa del Gusano de Seda (蚕神娘娘) con fruta, incienso y papel dorado. De su bendición dependía que los capullos fueran abundantes y la seda fina: una cosecha fallida podía arruinar a familias enteras.", icon: "🐛", type: "Veneración" }
    ],
    traditionalFoods: ["Hierbas amargas (苦菜)", "Melón amargo (苦瓜)", "Moras (桑葚)"]
  },
  {
    id: 9, pinyin: "Mángzhòng", hanzi: "芒种", translation: "Grano en Espiga", approximateDates: "6 - 20 de Junio",
    pentads: [
      { id: 1, description: "Tanglang Sheng (螳螂生): Nacen las mantis religiosas." },
      { id: 2, description: "Ju Shi Ming (鵙始鸣): Los alcaudones comienzan a cantar." },
      { id: 3, description: "Fanshe Wu Sheng (反舌无声): Los sinsontes se quedan callados." }
    ],
    healthAdvice: "Aumenta la humedad y el calor. Siestas cortas, cambiar ropa sudada inmediatamente.",
    customs: [
      { title: "送花神 Song Hua Shen (Despedir al Dios de las Flores)", description: "En el último día en que las flores lucen plenas, se atan cintas y telas de colores a las ramas de los árboles como ofrenda de despedida al Dios de las Flores (花神). A partir de ahora, el jardín callará hasta la próxima primavera; el rito honra la belleza antes de que se marche.", icon: "🥀", type: "Rito Estacional" },
      { title: "煮青梅 Zhu Qing Mei (Hervir Ciruelas Verdes)", description: "La ciruela verde, amarga e intensa, se hierve con vino de arroz o azúcar para obtener una bebida que equilibra el calor sin enfriar en exceso. El aroma agridulce del 青梅酒 marca el inicio de los monzones y aparece en escena desde los tiempos del Romance de los Tres Reinos.", icon: "🫒", type: "Tradición Culinaria" },
      { title: "打泥仗 Da Ni Zhan (Batalla de Barro)", description: "En los campos de arroz del pueblo Dong del sur de China, la siembra culmina con una batalla de barro entre los trabajadores: cubiertos hasta las orejas, entre gritos y risas. El barro compartido celebra la unión de la comunidad con la tierra que los alimentará durante el año.", icon: "🌾", type: "Celebración de las Minorías (Dong)" }
    ],
    traditionalFoods: ["Ciruelas verdes (青梅)", "Vino de ciruela", "Alimentos ricos en potasio"]
  },
  {
    id: 10, pinyin: "Xiàzhì", hanzi: "夏至", translation: "Solsticio de Verano", approximateDates: "21 de Junio - 6 de Julio",
    pentads: [
      { id: 1, description: "Lujiao Jie (鹿角解): Los ciervos se desprenden de sus cuernos." },
      { id: 2, description: "Tiao Shi Ming (蜩始鸣): Las cigarras cantan fuertemente." },
      { id: 3, description: "Banxia Sheng (半夏生): Nace la Pinellia." }
    ],
    healthAdvice: "Yang al máximo. Acuéstate tarde y levántate temprano. Proteger el corazón.",
    customs: [
      { title: "吃面 Chi Mian (Comer Fideos de Verano)", description: "El día más largo del año se celebra con fideos elaborados del trigo recién cosechado, servidos fríos con pepino y salsa de sésamo. 'Comer fideos en el solsticio' es dicho popular en toda la China septentrional; el refresco de los fideos fríos compensa el yang extremo del día.", icon: "🍜", type: "Tradición Culinaria" },
      { title: "祭神祭祖 Ji Shen Ji Zu (Ofrendas al Cielo y los Ancestros)", description: "Cuando el yang alcanza su cima, el equilibrio es frágil. Las ofrendas al Dios de la Tierra (土地神) y a los ancestros pedían que la abundancia del verano no atrajera plagas, inundaciones o sequías que arruinaran la cosecha antes de que pudiera ser recogida.", icon: "🕯️", type: "Veneración" },
      { title: "赠扇 Zeng Shan (Regalar Abanicos)", description: "Regalar abanicos en el solsticio era gesto de cortesía refinada entre familias y amistades. El abanico lleva brisa al receptor; los saquitos de hierbas aromáticas adjuntos ahuyentan el calor y los insectos. Un regalo que es a la vez práctico y poético, como pide la etiqueta china.", icon: "🪭", type: "Salud y Bienestar" }
    ],
    traditionalFoods: ["Fideos de trigo nuevo", "Sopa de judías mungo (绿豆汤)", "Lichi"]
  },
  {
    id: 11, pinyin: "Xiǎoshǔ", hanzi: "小暑", translation: "Pequeño Calor", approximateDates: "7 - 22 de Julio",
    pentads: [
      { id: 1, description: "Wen Feng Zhi (温风至): Llegan los vientos cálidos." },
      { id: 2, description: "Xishu Ju (蟋蟀居壁): Los grillos se esconden en las paredes buscando frescor." },
      { id: 3, description: "Ying Nai Xue Xi (鹰乃学习): Las crías de halcón aprenden a volar." }
    ],
    healthAdvice: "Un corazón tranquilo trae frescor natural. Evitar enojarse.",
    customs: [
      { title: "晒书画 Shai Shu Hua (Airear Libros y Pinturas)", description: "La humedad del monzón amenaza el papel y la tinta. En los días secos de 小暑, los eruditos sacaban al patio sus libros, pinturas y rollos de caligrafía para airearlos bajo el sol antes de que el moho los destruyera. Lo que no se cuida en verano no sobrevive al invierno.", icon: "📚", type: "Mantenimiento / Hogar" },
      { title: "食新 Shi Xin (Probar el Arroz Nuevo)", description: "El arroz molido en el mismo día de su cosecha tiene un sabor y una fragancia que ningún envase conserva. Compartirlo con la familia y ofrendar los primeros granos a los ancestros en el altar doméstico honra el ciclo de la tierra que vuelve a entregar sus frutos.", icon: "🍚", type: "Tradición Culinaria" },
      { title: "赏荷 Shang He (Contemplar el Loto)", description: "Los literatos creían que contemplar el loto en flor —que emerge inmaculado del barro— enfriaba el corazón más eficazmente que el hielo. Las reuniones nocturnas junto a los estanques eran ocasión para poesía, vino y debate filosófico: la belleza como antídoto al calor.", icon: "🪷", type: "Contemplación" }
    ],
    traditionalFoods: ["Raíz de loto (莲藕)", "Sandía", "Anguila (鳗鱼)"]
  },
  {
    id: 12, pinyin: "Dàshǔ", hanzi: "大暑", translation: "Gran Calor", approximateDates: "23 de Julio - 7 de Agosto",
    pentads: [
      { id: 1, description: "Fucao Wei Ying (腐草为萤): La hierba podrida se transforma en luciérnagas." },
      { id: 2, description: "Tu Run Ru Shu (土润溽暑): La tierra está empapada y el aire es sofocante." },
      { id: 3, description: "Dayu Shixing (大雨时行): Caen fuertes aguaceros." }
    ],
    healthAdvice: "Sudoración masiva agota el Qi. Beber agua tibia, evitar helada.",
    customs: [
      { title: "送大暑船 Song Da Shu Chuan (Barco del Gran Calor)", description: "En Zhejiang, un barco de madera decorado con imágenes de dioses y colmado de ofrendas es llevado en procesión hasta el mar entre petardos y música de percusión. Al quemarlo, las llamas envían las plagas, enfermedades y males del año hacia las aguas, lejos de la aldea.", icon: "⛵", type: "Rito Exorcista" },
      { title: "饮伏茶 Yin Fu Cha (Té de Canícula)", description: "Durante los tres calores (三伏天), templos y asociaciones de vecinos instalaban en las calles grandes ollas de té herbal con menta, ortiga y hojas de loto, servido gratuitamente a cualquier transeúnte. El gesto de solidaridad convertía la calle en un espacio de cuidado mutuo frente al calor extremo.", icon: "🫖", type: "Salud y Bienestar" },
      { title: "冬病夏治 Dong Bing Xia Zhi (Tratar Enfermedades de Invierno en Verano)", description: "La paradoja de la TCM: el momento más caluroso del año es el ideal para tratar enfermedades del frío como el asma, la artritis y los dolores lumbares crónicos. La moxibustión abre los meridianos al máximo yang, expulsando el frío acumulado que no pudo salir durante el invierno.", icon: "🌿", type: "Medicina Tradicional" }
    ],
    traditionalFoods: ["Sopa de cordero (en algunas regiones)", "Lichi", "Té de crisantemo"]
  },
  // Otoño (13-18)
  {
    id: 13, pinyin: "Lìqiū", hanzi: "立秋", translation: "Comienzo del Otoño", approximateDates: "7 - 22 de Agosto",
    pentads: [
      { id: 1, description: "Liang Feng Zhi (凉风至): Llegan los vientos frescos." },
      { id: 2, description: "Bai Lu Jiang (白露降): Desciende el rocío blanco." },
      { id: 3, description: "Han Chan Ming (寒蝉鸣): Las cigarras del frío cantan." }
    ],
    healthAdvice: "Cuidado con el 'Tigre de Otoño'. Moderar sabores picantes, comer más sabores agrios para nutrir pulmones e hígado.",
    customs: [
      { title: "贴秋膘 Tie Qiu Biao (Añadir Grasa de Otoño)", description: "El calor del verano suprime el apetito y adelgaza. Con la llegada del otoño, la tradición manda 'pegar la grasa otoñal': un banquete de carne —cerdo estofado, cordero, pato— para recuperar el peso perdido y fortalecer el cuerpo ante el frío que se aproxima.", icon: "🥩", type: "Cuidado de la Salud / Culinario" },
      { title: "啃秋 Ken Qiu (Morder el Otoño)", description: "En el primer día de otoño se 'muerde el otoño' comiendo sandía: el último gran fruto del verano limpia el calor residual del cuerpo. En muchos lugares es costumbre comerla en la calle, sin cubiertos, a grandes bocados, como despedida solemne del estío.", icon: "🍉", type: "Celebración" },
      { title: "晒秋 Shai Qiu (Secar la Cosecha)", description: "En las aldeas de montaña de Hunan y Jiangxi, los tejados, balcones y cuerdas se cubren de chiles rojos, mazorcas de maíz amarillo y calabazas naranjas puestas a secar. El paisaje resultante —llamado 晒秋— es tan icónico que atrae a pintores y fotógrafos de todo el país.", icon: "🌶️", type: "Rito Agrícola" }
    ],
    traditionalFoods: ["Sandía", "Melocotones", "Carne de cerdo guisada", "Longan"]
  },
  {
    id: 14, pinyin: "Chǔshǔ", hanzi: "处暑", translation: "Fin del Calor", approximateDates: "23 de Agosto - 7 de Septiembre",
    pentads: [
      { id: 1, description: "Ying Nai Ji Niao (鹰乃祭鸟): Las águilas cazan aves y las exponen." },
      { id: 2, description: "Tiandi Shisu (天地始肃): El cielo y la tierra comienzan a volverse severos." },
      { id: 3, description: "He Nai Deng (禾乃登): Los cereales maduran." }
    ],
    healthAdvice: "Fatiga de Otoño. Dormir temprano y estirarse por la mañana.",
    customs: [
      { title: "放河灯 Fang He Deng (Soltar Linternas Flotantes)", description: "Durante el Mes del Fantasma (鬼月), pequeñas linternas con forma de loto se lanzan a ríos y lagos al caer la noche. Cada llama guía el espíritu de un difunto de regreso al más allá una vez terminado su período anual de libertad entre los vivos.", icon: "🪷", type: "Veneración Ancestral" },
      { title: "吃鸭子 Chi Ya Zi (Comer Pato)", description: "El pato es el alimento prescrito para 处暑: su naturaleza 'fría' en la clasificación de la TCM contrarresta el calor residual del verano. El pato viejo estofado durante horas con jengibre, hierbas medicinales y vino de arroz es el plato por excelencia de esta transición estacional.", icon: "🦆", type: "Tradición Culinaria" },
      { title: "开渔节 Kai Yu Jie (Festival de la Pesca)", description: "Tras meses de veda para permitir la recuperación de las especies, la apertura de la temporada de pesca en la costa oriental se celebra con fuegos artificiales, ofrendas al Dios del Mar y la salida simultánea de miles de barcos al amanecer, tiñendo el horizonte de luces.", icon: "🎣", type: "Celebración Costera" }
    ],
    traditionalFoods: ["Pato (鸭子)", "Pera de las nieves (雪梨)", "Lirio (百合)"]
  },
  {
    id: 15, pinyin: "Báilù", hanzi: "白露", translation: "Rocío Blanco", approximateDates: "8 - 22 de Septiembre",
    pentads: [
      { id: 1, description: "Hong Yan Lai (鸿雁来): Los gansos salvajes migran." },
      { id: 2, description: "Xuan Niao Gui (玄鸟归): Las golondrinas regresan al sur." },
      { id: 3, description: "Qun Niao Yang Xiu (群鸟养羞): Los pájaros almacenan comida." }
    ],
    healthAdvice: "Cuidar pies y cuello del frío. No dormir con el abdomen descubierto.",
    customs: [
      { title: "收清露 Shou Qing Lu (Recolectar Rocío Puro)", description: "Al amanecer de 白露, el rocío depositado en la cóncava superficie de las hojas de loto se recoge con sumo cuidado antes de que el sol lo evapore. Esta agua, que no ha tocado tierra, era considerada el elixir más refinado para preparar té medicinal o tónicos de belleza.", icon: "💧", type: "Medicina Tradicional" },
      { title: "饮白露茶 Yin Bailu Cha (Té de Rocío Blanco)", description: "El té cosechado en 白露 tiene carácter propio: el frío nocturno que deposita el rocío concentra los aceites de la hoja, dando una infusión más fragante y menos astringente que el té de primavera. Los catadores lo buscan específicamente y se elabora en cantidades limitadas.", icon: "🍵", type: "Tradición Culinaria" },
      { title: "吃龙眼 Chi Longyan (Comer Ojo de Dragón)", description: "En Fujian existe el dicho: 'un longan en 白露 equivale a una gallina entera'. El longan de este período alcanza su punto óptimo de dulzura y, según la TCM, su efecto tonificante sobre el bazo y el corazón es especialmente potente en el momento del año en que las defensas comienzan a necesitar refuerzo.", icon: "🍒", type: "Suerte y Salud" }
    ],
    traditionalFoods: ["Longan (龙眼)", "Batatas (红薯)", "Té de otoño", "Vino de arroz (米酒)"]
  },
  {
    id: 16, pinyin: "Qiūfēn", hanzi: "秋分", translation: "Equinoccio de Otoño", approximateDates: "23 de Septiembre - 7 de Octubre",
    pentads: [
      { id: 1, description: "Lei Shi Shou Sheng (雷始收声): El trueno se calla." },
      { id: 2, description: "Zhe Chong Pei Hu (蛰虫坯户): Los insectos sellan sus madrigueras." },
      { id: 3, description: "Shui Shi He (水始涸): Las aguas disminuyen." }
    ],
    healthAdvice: "El otoño rige los pulmones. Comer peras y sésamo blanco para combatir la sequedad. Protegerse del frío nocturno y evitar la tristeza prolongada.",
    customs: [
      { title: "祭月 Ji Yue (Ofrenda a la Luna)", description: "Ritual imperial del equinoccio otoñal: el Hijo del Cielo ofrendaba a la divinidad lunar con fruta, vino e incienso. Distinto de la Fiesta de Medio Otoño, aunque ambos honran la Luna.", icon: "🌕", type: "Veneración" },
      { title: "竖秋牛图 Qiu Niu Tu (Almanaque del Buey)", description: "Funcionarios agrícolas distribuían grabados del buey otoñal entre los agricultores, con predicciones meteorológicas y consejos de siembra para la temporada de cosecha.", icon: "🐂", type: "Costumbre Agrícola" },
      { title: "立蛋 Li Dan (Equilibrar el Huevo)", description: "En el instante de equilibrio perfecto entre día y noche, se intenta sostener un huevo de pie sin apoyo. Simboliza la armonía del yin y el yang.", icon: "🥚", type: "Juego / Celebración" }
    ],
    traditionalFoods: ["Cangrejo peludo (大闸蟹)", "Pera de otoño (秋梨)", "Castaña de agua (菱角)"]
  },
  // Términos 17-18 (Otoño tardío)
  {
    id: 17, pinyin: "Hánlù", hanzi: "寒露", translation: "Rocío Frío", approximateDates: "8 - 22 de Octubre",
    pentads: [
      { id: 1, description: "Hongyan Lai Bin (鸿雁来宾): Los gansos salvajes llegan en grandes bandadas." },
      { id: 2, description: "Que Ru Da Shui Wei Ge (雀入大水为蛤): Los gorriones desaparecen y se transforman en almejas." },
      { id: 3, description: "Ju You Huang Hua (菊有黄华): Los crisantemos florecen con pétalos amarillos." }
    ],
    healthAdvice: "Frío sube desde la tierra. Usar calcetines y remojar los pies en agua caliente antes de dormir.",
    customs: [
      { title: "登高 Deng Gao (Escalar las Alturas)", description: "La festividad de Chongyang (重阳节, el 9º día del 9º mes lunar) coincide con 寒露 y prescribe escalar colinas o torres. La tradición combina el aire puro del otoño con la vista de los crisantemos en flor; el número nueve (阳数之极) está asociado a la longevidad.", icon: "⛰️", type: "Cuidado de la Salud" },
      { title: "赏菊 Shang Ju (Contemplar los Crisantemos)", description: "El crisantemo florece cuando todo lo demás se marchita: símbolo confuciano de rectitud y resistencia ante la adversidad. Las exposiciones de otoño llevan siglos siendo ocasión de banquetes literarios donde se compone poesía y se bebe vino de crisantemo.", icon: "🌼", type: "Contemplación" },
      { title: "吃螃蟹 Chi Pangxie (Comer Cangrejo)", description: "El cangrejo peludo de pelo dorado (大闸蟹) alcanza en 寒露 su plenitud: las hembras repletas de huevas naranjas, los machos de crema blanca. Se sirve al vapor, acompañado de vinagre de Zhenjiang y jengibre fresco para neutralizar su naturaleza fría según la TCM.", icon: "🦀", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Semillas de sésamo (芝麻)", "Espino (山楂)", "Caqui (柿子)", "Cangrejo peludo (大闸蟹)"]
  },
  {
    id: 18, pinyin: "Shuāngjiàng", hanzi: "霜降", translation: "Descenso de la Escarcha", approximateDates: "23 de Octubre - 6 de Noviembre",
    pentads: [
      { id: 1, description: "Chai Nai Ji Shou (豺乃祭兽): Los dholes acumulan sus presas." },
      { id: 2, description: "Caomu Huang Luo (草木黄落): Las hojas se vuelven amarillas y caen." },
      { id: 3, description: "Zhe Chong Xian Fu (蛰虫咸俯): Los insectos se ocultan bajo tierra." }
    ],
    healthAdvice: "Sequedad otoñal y viento frío dañinos para estómago y articulaciones. Tonificar con sopas lentas.",
    customs: [
      { title: "吃柿子 Chi Shi Zi (Comer Caquis)", description: "El refrán popular es preciso: 'come caqui en 霜降 y no sufrirás de nariz en invierno'. El caqui madurado por la escarcha es más dulce y concentrado; según la TCM, lubrica los pulmones y calienta el estómago, preparando el cuerpo para la estación fría.", icon: "🍅", type: "Tradición Culinaria" },
      { title: "赏红叶 Shang Hong Ye (Contemplar las Hojas Rojas)", description: "Las montañas Xiangshan de Pekín, Tianpingshan de Suzhou y decenas de parajes más se llenan de visitantes para contemplar los arces japoneses teñidos de escarlata. La belleza efímera de la hoja roja es metáfora del otoño de la vida, apreciada en toda la tradición poética china.", icon: "🍁", type: "Celebración de la Naturaleza" },
      { title: "拔萝卜 Ba Luobo (Cosechar los Rábanos)", description: "Antes de que las primeras heladas duras congelen el suelo, las aldeas organizan la cosecha urgente del daikon (白萝卜). Arrancados, lavados y almacenados en sótanos o encurtidos en sal, serán la fuente de verdura durante todo el invierno.", icon: "🌾", type: "Rito Agrícola" }
    ],
    traditionalFoods: ["Caqui (柿子)", "Rábano blanco (白萝卜)", "Castañas (栗子)", "Pato asado"]
  },
  // Invierno (19-24)
  {
    id: 19, pinyin: "Lìdōng", hanzi: "立冬", translation: "Comienzo del Invierno", approximateDates: "7 - 21 de Noviembre",
    pentads: [
      { id: 1, description: "Shui Shi Bing (水始冰): El agua comienza a congelarse." },
      { id: 2, description: "Di Shi Dong (地始冻): La tierra comienza a endurecerse." },
      { id: 3, description: "Zhi Ru Da Shui Wei Shen (雉入大水为蜃): Los faisanes se transforman en almejas." }
    ],
    healthAdvice: "Ocultar el Yang y proteger el Yin. Acuéstate temprano, levántate tarde. Cabeza y espalda abrigadas.",
    customs: [
      { title: "贺冬 He Dong (Felicitar por el Invierno)", description: "En la corte imperial, la llegada del invierno era celebrada con ceremonias formales: el emperador ofrendaba al Cielo, distribuía ropa de abrigo entre los funcionarios y recompensaba a los soldados que habían servido durante el año. La estación más dura era recibida como un huésped honorable.", icon: "👑", type: "Veneración" },
      { title: "补冬 Bu Dong (Nutrirse para el Invierno)", description: "La lógica de la TCM es directa: el invierno es la estación del almacenamiento (藏). Nutrir el cuerpo con alimentos calóricos y cálidos —cordero, pollo negro, jengibre, dátiles rojos— deposita reservas de yang que el organismo irá consumiendo durante los meses de frío.", icon: "🍲", type: "Salud y Bienestar" },
      { title: "吃饺子 Chi Jiao Zi (Comer Empanadillas)", description: "Las empanadillas (饺子) tienen forma de oreja, y la tradición dice que comerlas en 立冬 protege las orejas del congelamiento invernal. El relleno caliente de carne y verdura es también el reconfortante inicio del largo invierno septentrional, reunión familiar obligada.", icon: "🥟", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Empanadillas de carne (饺子)", "Sopa de cordero", "Jengibre", "Dátiles rojos (红枣)"]
  },
  {
    id: 20, pinyin: "Xiǎoxuě", hanzi: "小雪", translation: "Pequeña Nieve", approximateDates: "22 de Noviembre - 6 de Diciembre",
    pentads: [
      { id: 1, description: "Hong Cang Bu Jian (虹藏不见): Los arcoíris se esconden." },
      { id: 2, description: "Tian Qi Shang Teng (天气上升): El Qi del cielo asciende." },
      { id: 3, description: "Bi Se Er Cheng Dong (闭塞而成冬): El cielo y la tierra se bloquean." }
    ],
    healthAdvice: "Proteger el estado de ánimo (evitar melancolía). Comer alimentos oscuros para nutrir los riñones.",
    customs: [
      { title: "腌腊肉 Yan La Rou (Curar las Carnes)", description: "Con las primeras heladas, llega el momento de preservar: cerdos, patos y embutidos frotados con sal, especias y licor de arroz se cuelgan en los aleros para secarse al frío invernal durante semanas. Listos para el Año Nuevo, las 腊肉 son el tesoro aromatico de cada hogar.", icon: "🥓", type: "Costumbre Agrícola" },
      { title: "酿米酒 Niang Jiu (Elaborar Vino de Invierno)", description: "El frío de 小雪 es el aliado del fermentador: las temperaturas bajas ralentizan y controlan la fermentación, produciendo un vino de arroz glutinoso limpio y de sabor suave. Muchas familias rurales elaboran el suyo propio, que madurará justo a tiempo para las festividades de primavera.", icon: "🍶", type: "Celebración" },
      { title: "吃糍粑 Chi Ci Ba (Comer Pastel de Arroz Glutinoso)", description: "En el suroeste de China, los pueblos Tujia golpean arroz glutinoso cocido en grandes morteros de piedra hasta hacerlo masa densa y elástica. Las 糍粑 resultantes se ofrendan al dios del búfalo de agua que labró los campos durante el año y luego se comparten en familia.", icon: "🍡", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Sésamo negro (黑芝麻)", "Frijoles negros (黑豆)", "Pollo negro (乌鸡)", "Carnes curadas (腊肉)"]
  },
  // Términos 21-24 (Pleno Invierno)
  {
    id: 21, pinyin: "Dàxuě", hanzi: "大雪", translation: "Gran Nieve", approximateDates: "7 - 21 de Diciembre",
    pentads: [
      { id: 1, description: "He Dan Bu Ming (鹖鴠不鸣): El ave del frío deja de cantar." },
      { id: 2, description: "Hu Shi Jiao (虎始交): Los tigres comienzan su época de apareamiento." },
      { id: 3, description: "Li Ting Chu (荔挺出): Brota la planta Liting." }
    ],
    healthAdvice: "Proteger cuello, hombros y pies. Masajear el punto Yongquan antes de dormir.",
    customs: [
      { title: "赏雪景 Guan Shang Xue Jing (Contemplar la Nieve)", description: "La nieve transforma el paisaje en el lienzo favorito de los poetas Tang y Song. Los literatos organizaban banquetes nocturnos bajo los ciruelos nevados, bebiendo vino caliente en copas de porcelana y recitando versos a la luz de las linternas: la belleza del frío como filosofía.", icon: "❄️", type: "Contemplación" },
      { title: "进补 Jin Bu (Tomar Tónicos de Invierno)", description: "La gran nevada es el mejor momento del invierno para los tónicos: el yang está más comprimido que nunca y el cuerpo absorbe con eficacia máxima los nutrientes calóricos. Sopas lentas de cordero con Astragalus (黄芪), sésamo negro y dátiles rojos caracterizan esta fase de fortalecimiento.", icon: "🍲", type: "Cuidado de la Salud" },
      { title: "制腊肠 Zhi Zuo Xiang Chang (Hacer Embutidos)", description: "La carne picada de cerdo, condimentada con salsa de soja, vino de arroz y cinco especias, se embute en tripa natural y se cuelga al exterior durante semanas de frío y viento. Las 腊肠 así elaboradas concentran un sabor que ningún proceso industrial puede replicar.", icon: "🌭", type: "Preparación Familiar" }
    ],
    traditionalFoods: ["Sopa de cordero con rábano", "Puerros (韭菜)", "Batatas asadas (烤红薯)"]
  },
  {
    id: 22, pinyin: "Dōngzhì", hanzi: "冬至", translation: "Solsticio de Invierno", approximateDates: "22 de Diciembre - 5 de Enero",
    pentads: [
      { id: 1, description: "Qiu Jiao Jie (蚯蚓结): Las lombrices se enroscan bajo tierra." },
      { id: 2, description: "Mi Jiao Jie (麋角解): El alce de David pierde sus cuernos." },
      { id: 3, description: "Shui Quan Dong (水泉动): Los manantiales comienzan a fluir." }
    ],
    healthAdvice: "Proteger el brote de Yang. No transpirar, meditar sentado para nutrir el Qi.",
    customs: [
      { title: "吃汤圆/饺子 Chi Tangyuan / Jiaozi (Reunión en la Mesa)", description: "La noche más larga del año convoca a la familia en torno a la mesa. Al norte, empanadillas (饺子) rellenas de carne y col; al sur, 汤圆, bolitas de arroz glutinoso con pasta de sésamo o flor de osmanto. Ambas redondas, ambas símbolo de reunión y plenitud.", icon: "🥣", type: "Tradición Culinaria" },
      { title: "数九九 Shu Jiu Jiu (Contar los Nueve Nueves)", description: "A partir del solsticio comienzan los 'nueve nueves': 81 días hasta la primavera. La costumbre es trazar un ciruelo de 81 pétalos sin rellenar; cada mañana se colorea uno según si hizo frío o calor. Cuando el último pétalo se pinta, la primavera ha llegado.", icon: "🌸", type: "Tradición" },
      { title: "祭天 Ji Tian (Sacrificio al Cielo)", description: "El solsticio de invierno era la festividad más solemne del calendario imperial. El Hijo del Cielo ayunaba tres días y ofrendaba al Cielo en el Altar del Cielo (天坛) de Pekín antes del amanecer. La legitimidad del mandato imperial renovaba su pacto con el cosmos en esta noche.", icon: "🏛️", type: "Veneración" }
    ],
    traditionalFoods: ["Tangyuan (汤圆)", "Jiaozi (饺子)", "Nueces (核桃)", "Jengibre"]
  },
  {
    id: 23, pinyin: "Xiǎohán", hanzi: "小寒", translation: "Pequeño Frío", approximateDates: "6 - 19 de Enero",
    pentads: [
      { id: 1, description: "Yan Bei Xiang (雁北乡): Los gansos comienzan a migrar al norte." },
      { id: 2, description: "Que Shi Chao (鹊始巢): Las urracas construyen sus nidos." },
      { id: 3, description: "Zhi Shi Gou (雉雊): Los faisanes cantan buscando pareja." }
    ],
    healthAdvice: "Proteger zona lumbar y riñones. Ejercicio tarde por la mañana.",
    customs: [
      { title: "吃腊八粥 Chi Laba Zhou (Gachas de Laba)", description: "El día 8 del mes 12 lunar, que cae en 小寒, las familias preparan las Gachas de Laba: una sopa de ocho ingredientes —arroz glutinoso, mijo, judías rojas, cacahuetes, dátiles, nueces, longan y piñones— que resume simbólicamente los frutos de la tierra de todo el año.", icon: "🍲", type: "Tradición" },
      { title: "采冰 Cai Bing (Cortar y Almacenar Hielo)", description: "Antes de la refrigeración, el hielo era un bien precioso en verano. En los ríos helados de 小寒, los trabajadores cortaban bloques con hachas y los transportaban a las neveras subterráneas imperiales y de las grandes familias, donde la paja los conservaría hasta el calor del año siguiente.", icon: "🧊", type: "Tradición" },
      { title: "准备年货 Zhun Bei Nian Huo (Preparativos de Año Nuevo)", description: "A menos de un mes del Año Nuevo Lunar, los mercados se llenan de farolillos rojos, pólvora, dulces tradicionales y ropa nueva. Preparar los 年货 ('bienes del año') es un ritual de optimismo: cada compra anticipa la prosperidad y la renovación del año por llegar.", icon: "🧧", type: "Preparación Festiva" }
    ],
    traditionalFoods: ["Gachas Laba (腊八粥)", "Arroz glutinoso frito", "Cordero", "Verduras de invierno"]
  },
  {
    id: 24, pinyin: "Dàhán", hanzi: "大寒", translation: "Gran Frío", approximateDates: "20 de Enero - 3 de Febrero",
    pentads: [
      { id: 1, description: "Ji Ru (鸡乳): Las gallinas comienzan a empollar." },
      { id: 2, description: "Zheng Niao Li Ji (征鸟厉疾): Las aves rapaces cazan con ferocidad extrema por la escasez del invierno." },
      { id: 3, description: "Shui Ze Fu Jian (水泽腹坚): El hielo en ríos y lagunas se vuelve sólido hasta el fondo." }
    ],
    healthAdvice: "No hacer cambios bruscos de temperatura. Estiramientos suaves para prepararse para la primavera.",
    customs: [
      { title: "尾牙 Wei Ya (Banquete de Fin de Año)", description: "En Taiwán y el sur de Fujian, el último día de mercado del año es el 尾牙: el patrón invita a sus trabajadores a un banquete de agradecimiento. La tradición dice que la dirección en que el jefe apunta la cabeza del pollo asado indicaba silenciosamente qué empleado sería despedido.", icon: "🥢", type: "Tradición" },
      { title: "除尘 Chu Chen (Limpiar el Polvo)", description: "En los días previos al Año Nuevo, cada rincón del hogar es barrido y fregado: el polvo acumulado es la mala suerte del año que termina. Ventanas, techos, muebles y altares domésticos son limpiados; lo viejo o roto se desecha sin sentimentalismo, haciendo sitio a lo nuevo.", icon: "🧽", type: "Preparación Festiva" },
      { title: "饮暖酒 Yin Nuan Jiu (Beber Vino Caliente)", description: "En el frío más crudo del año, la familia se reúne alrededor de un brasero y sirve vino de arroz tibio en copas pequeñas. El calor del licor, la conversación y el fuego contra el frío exterior son el antídoto perfecto al Gran Frío; el invierno termina como empezó: en familia.", icon: "🍶", type: "Salud y Bienestar" }
    ],
    traditionalFoods: ["Pasteles de arroz glutinoso (粑粑)", "Sopa de pollo negro (乌鸡汤)", "Sopa de castañas", "Vino caliente"]
  }
];

export const SOLAR_TERMS = chineseCalendarData;

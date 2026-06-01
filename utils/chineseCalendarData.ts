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
      { title: "Yao Chun (Morder la Primavera)", description: "Comer rábanos y rollitos de primavera para prevenir enfermedades.", icon: "🌯", type: "Celebración" },
      { title: "Da Chun Niu (Azotar al Buey de Primavera)", description: "Se fabricaba una figura de buey de barro. Los funcionarios la azotaban con ramas de sauce para despertar la agricultura.", icon: "🐂", type: "Rito Agrícola" },
      { title: "Ying Chun (Recibir la Primavera)", description: "Rituales de ofrenda al Dios de la Primavera (Goumang).", icon: "🌸", type: "Veneración" }
    ],
    traditionalFoods: ["Rollitos de primavera (Chunbing)", "Rábanos", "Cebolletas de primavera"]
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
      { title: "Hui Niang Jia (Regreso al Hogar Materno)", description: "Las hijas casadas regresan a visitar a sus padres llevándoles regalos.", icon: "🎁", type: "Familiar / Respeto" },
      { title: "Ren Gan Die (Buscar Padrinos)", description: "Las madres buscaban un padrino para sus hijos en los caminos bajo la lluvia.", icon: "👶", type: "Protección/Superstición" }
    ],
    traditionalFoods: ["Gachas (porridge) cálidas", "Sopa de semillas de loto", "Miel"]
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
      { title: "Da Xiao Ren (Golpear al Villano)", description: "Golpear figuras de papel con zapatos viejos para ahuyentar la mala suerte.", icon: "🥿", type: "Protección/Superstición" },
      { title: "Ji Bai Hu (Ofrenda al Tigre Blanco)", description: "Ofrendas al Tigre Blanco para apaciguar las disputas.", icon: "🐅", type: "Protección/Superstición" }
    ],
    traditionalFoods: ["Peras", "Vegetales de hojas verdes oscuras"]
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
      { title: "Li Dan (Levantar el Huevo)", description: "Intentar equilibrar un huevo crudo sobre su base.", icon: "🥚", type: "Juego / Celebración" },
      { title: "Fang Feng Zheng (Volar Cometas)", description: "Volar cometas para llevarse las desgracias.", icon: "🪁", type: "Celebración de la Naturaleza" },
      { title: "Ji Ri (Sacrificio al Sol)", description: "El emperador realizaba ofrendas al Templo del Sol.", icon: "☀️", type: "Veneración" }
    ],
    traditionalFoods: ["Verduras de primavera ('Chuncai')", "Té de primavera recién recolectado"]
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
      { title: "Sao Mu (Barrer las Tumbas)", description: "Limpiar y honrar las tumbas de los ancestros.", icon: "🧹", type: "Veneración Ancestral" },
      { title: "Ta Qing (Pisar el Verde)", description: "Pasear por el campo para disfrutar del renacer primaveral.", icon: "🌿", type: "Celebración de la Naturaleza" },
      { title: "Cha Liu (Clavar Ramas de Sauce)", description: "Usar sauce para ahuyentar espíritus malignos.", icon: "🎋", type: "Protección" }
    ],
    traditionalFoods: ["Qingtuan (bolas de arroz verde)", "Alimentos fríos"]
  },
  {
    id: 6, pinyin: "Gǔyǔ", hanzi: "谷雨", translation: "Lluvia de Grano", approximateDates: "20 de Abril - 4 de Mayo",
    pentads: [
      { id: 1, description: "Ping Shi Sheng (萍始生): La lenteja de agua empieza a crecer." },
      { id: 2, description: "Mingjiu Fu Qi Yu (鸣鸠拂其羽): Las palomas aletean." },
      { id: 3, description: "Daishou Jiang Sang (戴胜降于桑): Las abubillas se posan en las moreras." }
    ],
    healthAdvice: "Humedad alta. Proteger el Bazo. Evitar suelos húmedos.",
    customs: [
      { title: "Zhai Guyu Cha (Cosechar el Té de Guyu)", description: "El té recolectado aclara la vista y limpia el calor excesivo.", icon: "🍵", type: "Costumbre Agrícola" },
      { title: "Sha Wu Du (Eliminar los Cinco Venenos)", description: "Colgar pósteres para 'suprimir' insectos venenosos.", icon: "🦂", type: "Protección / Salud" },
      { title: "Ji Cangjie (Honrar a Cangjie)", description: "Ofrendas al inventor de los caracteres chinos.", icon: "🖌️", type: "Veneración" }
    ],
    traditionalFoods: ["Té fresco de primavera", "Brotes de Toona sinensis"]
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
      { title: "Cheng Ren (Pesar a las Personas)", description: "Pesarse para protegerse de enfermar por el calor estival.", icon: "⚖️", type: "Protección / Salud" },
      { title: "Dou Dan (Batalla de Huevos)", description: "Niños chocan huevos cocidos en redes coloridas.", icon: "🥚", type: "Juego / Celebración" },
      { title: "Chang Xin (Probar lo Nuevo)", description: "Comer las tres novedades: cerezas, ciruelas verdes y trigo nuevo.", icon: "🍒", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Arroz de cinco colores", "Huevos duros", "Sopa de ciruelas"]
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
      { title: "Ji San Che (Adorar a los Tres Vehículos)", description: "Ofrendas a norias, ruecas y molinos.", icon: "🎡", type: "Rito Agrícola" },
      { title: "Chi Ku Cai (Comer Hierbas Amargas)", description: "Limpia la sangre y reduce el calor interno.", icon: "🥗", type: "Costumbre Culinaria / Médica" },
      { title: "Ji Can Shen (Adorar al Dios Gusano de Seda)", description: "Sacrificios para una cosecha de seda próspera.", icon: "🐛", type: "Veneración" }
    ],
    traditionalFoods: ["Hierbas amargas (Kucai)", "Melón amargo", "Moras"]
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
      { title: "Song Hua Shen (Despedir al Dios de las Flores)", description: "Atar cintas a las ramas para despedir a los espíritus de las flores.", icon: "🥀", type: "Rito Estacional" },
      { title: "Zhu Qing Mei (Hervir Ciruelas Verdes)", description: "Hervir ciruelas ácidas en agua o vino.", icon: "🫒", type: "Tradición Culinaria" },
      { title: "Da Ni Zhan (Batalla de Barro)", description: "Lanzar barro en arrozales durante la siembra.", icon: "🌾", type: "Celebración de las Minorías (Dong)" }
    ],
    traditionalFoods: ["Ciruelas verdes", "Vino de ciruela", "Alimentos ricos en potasio"]
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
      { title: "Chi Mian (Comer Fideos de Verano)", description: "Comer fideos fríos tras la cosecha del nuevo trigo.", icon: "🍜", type: "Tradición Culinaria" },
      { title: "Ji Shen Ji Zu (Ofrendas)", description: "Sacrificios al Dios de la Tierra para disipar plagas.", icon: "🕯️", type: "Veneración" },
      { title: "Zeng Shan (Regalar Abanicos)", description: "Intercambio de abanicos y saquitos aromáticos.", icon: "🪭", type: "Salud y Bienestar" }
    ],
    traditionalFoods: ["Fideos de trigo nuevo", "Sopa de judías mungo", "Lichi"]
  },
  {
    id: 11, pinyin: "Xiǎoshǔ", hanzi: "小暑", translation: "Pequeño Calor", approximateDates: "7 - 22 de Julio",
    pentads: [
      { id: 1, description: "Wen Feng Zhi (温风至): Llegan los vientos cálidos." },
      { id: 2, description: "Xishu Ju (蟋蟀居): Los grillos se esconden buscando frescor." },
      { id: 3, description: "Ying Nai Xue Xi (鹰乃学习): Las crías de halcón aprenden a volar." }
    ],
    healthAdvice: "Un corazón tranquilo trae frescor natural. Evitar enojarse.",
    customs: [
      { title: "Shai Shu Hua (Secar Libros y Ropas)", description: "Sacar libros y pergaminos al sol para evitar humedad.", icon: "📚", type: "Mantenimiento / Hogar" },
      { title: "Shi Xin (Probar lo Nuevo)", description: "Degustar arroz recién molido.", icon: "🍚", type: "Tradición Culinaria" },
      { title: "Shang He (Contemplar el Loto)", description: "Ver lotos para calmar la mente frente al calor.", icon: "🪷", type: "Contemplación" }
    ],
    traditionalFoods: ["Raíz de loto", "Sandía", "Anguila"]
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
      { title: "Song Da Shu Chuan (Barco del Gran Calor)", description: "Quemar barcos ceremoniales para llevarse plagas.", icon: "⛵", type: "Rito Exorcista" },
      { title: "Yin Fu Cha (Té de Canícula)", description: "Té de hierbas gratuito para refrescar a viajeros.", icon: "🫖", type: "Salud y Bienestar" },
      { title: "Dong Bing Xia Zhi (Tratar Enfermedades)", description: "Moxibustión para expulsar frío acumulado.", icon: "🌿", type: "Medicina Tradicional" }
    ],
    traditionalFoods: ["Sopa de cordero", "Lichi", "Té de crisantemo"]
  },
  // Otoño (13-16)
  {
    id: 13, pinyin: "Lìqiū", hanzi: "立秋", translation: "Comienzo del Otoño", approximateDates: "7 - 22 de Agosto",
    pentads: [
      { id: 1, description: "Liang Feng Zhi (凉风至): Llegan los vientos frescos." },
      { id: 2, description: "Bai Lu Jiang (白露降): Desciende el rocío blanco." },
      { id: 3, description: "Han Chan Ming (寒蝉鸣): Las cigarras del frío cantan." }
    ],
    healthAdvice: "Cuidado con el 'Tigre de Otoño'. Moderar sabores picantes, comer más sabores agrios para nutrir pulmones e hígado.",
    customs: [
      { title: "Tie Qiu Biao (Añadir Grasa de Otoño)", description: "Comer carne para recuperar fuerzas tras el verano.", icon: "🥩", type: "Cuidado de la Salud / Culinario" },
      { title: "Ken Qiu (Morder el Otoño)", description: "Comer sandía para limpiar restos del calor estival.", icon: "🍉", type: "Celebración" },
      { title: "Shai Qiu (Secar la Cosecha)", description: "Secar chiles y maíz en tejados.", icon: "🌶️", type: "Rito Agrícola" }
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
      { title: "Fang He Deng (Soltar Linternas)", description: "Linternas de loto flotantes para guiar a las almas.", icon: "🪷", type: "Veneración Ancestral" },
      { title: "Chi Ya Zi (Comer Pato)", description: "El pato reduce el fuego interno.", icon: "🦆", type: "Tradición Culinaria" },
      { title: "Kai Yu Jie (Festival de la Pesca)", description: "Celebraciones por el fin de la veda de pesca.", icon: "🎣", type: "Celebración Costera" }
    ],
    traditionalFoods: ["Pato", "Pera de las nieves", "Lirio (Baihe)"]
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
      { title: "Shou Qing Lu (Recolectar Rocío Puro)", description: "Recoger rocío de hojas de loto para té o salud.", icon: "💧", type: "Medicina Tradicional" },
      { title: "Yin Bailu Cha (Té de Rocío Blanco)", description: "Té otoñal con sabor único.", icon: "🍵", type: "Tradición Culinaria" },
      { title: "Chi Longyan (Comer Ojo de Dragón)", description: "Nutre el bazo y tranquiliza nervios.", icon: "🍒", type: "Suerte y Salud" }
    ],
    traditionalFoods: ["Longan", "Batatas", "Té de otoño", "Vino de arroz"]
  },
  {
    id: 16, pinyin: "Qiūfēn", hanzi: "秋分", translation: "Equinoccio de Otoño", approximateDates: "23 de Septiembre - 7 de Octubre",
    pentads: [
      { id: 1, description: "Lei Shi Shou Sheng (雷始收声): El trueno se calla." },
      { id: 2, description: "Zhe Chong Pei Hu (蛰虫坯户): Los insectos sellan sus madrigueras." },
      { id: 3, description: "Shui Shi He (水始涸): Las aguas disminuyen." }
    ],
    healthAdvice: "Equilibrio. Relajación. No sudar profusamente.",
    customs: [
      { title: "Qiu Ji Yue (Sacrificio a la Luna)", description: "Antiguo ritual imperial al Dios de la Luna.", icon: "🌕", type: "Veneración" },
      { title: "Shu Qiu Niu (Entregar el Buey)", description: "Cantores llevan papeles rojos con imágenes de bueyes.", icon: "🧧", type: "Bendición Agrícola" },
      { title: "Li Dan (Levantar el Huevo)", description: "Equilibrar huevos para celebrar el equinoccio.", icon: "🥚", type: "Juego / Celebración" }
    ],
    traditionalFoods: ["Cangrejo peludo", "Amaranto silvestre", "Pasteles de luna"]
  },
  // Términos 17-20 (Otoño tardío)
  {
    id: 17, pinyin: "Hánlù", hanzi: "寒露", translation: "Rocío Frío", approximateDates: "8 - 22 de Octubre",
    pentads: [
      { id: 1, description: "Hongyan Lai Bin (鸿雁来宾): Los gansos salvajes llegan en grandes bandadas." },
      { id: 2, description: "Que Ru Da Shui Wei Ge (雀入大水为蛤): Los gorriones desaparecen y se transforman en almejas." },
      { id: 3, description: "Ju You Huang Hua (菊有黄华): Los crisantemos florecen con pétalos amarillos." }
    ],
    healthAdvice: "Frío sube desde la tierra. Usar calcetines y remojar los pies en agua caliente antes de dormir.",
    customs: [
      { title: "Deng Gao (Escalar las Alturas)", description: "Subir a colinas para respirar aire puro y alejar enfermedades.", icon: "⛰️", type: "Cuidado de la Salud" },
      { title: "Shang Ju (Contemplar los Crisantemos)", description: "Admirar la flor que resiste el frío mientras otras marchitan.", icon: "🌼", type: "Contemplación" },
      { title: "Chi Pangxie (Comer Cangrejo)", description: "Comer cangrejo con jengibre y vino de arroz caliente.", icon: "🦀", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Semillas de sésamo", "Espino", "Caqui", "Cangrejo peludo"]
  },
  {
    id: 18, pinyin: "Shuāngjiàng", hanzi: "霜降", translation: "Descenso de la Escarcha", approximateDates: "23 de Octubre - 6 de Noviembre",
    pentads: [
      { id: 1, description: "Chai Nai Ji Shou (豺乃祭兽): Los lobos y chacales acumulan sus presas." },
      { id: 2, description: "Caomu Huang Luo (草木黄落): Las hojas se vuelven amarillas y caen." },
      { id: 3, description: "Zhe Chong Xian Fu (蛰虫咸俯): Los insectos se ocultan bajo tierra." }
    ],
    healthAdvice: "Sequedad otoñal y viento frío dañinos para estómago y articulaciones. Tonificar con sopas lentas.",
    customs: [
      { title: "Chi Shi Zi (Comer Caquis)", description: "Come caquis en Shuangjiang y no tendrás secreción nasal en invierno.", icon: "🍅", type: "Tradición Culinaria" },
      { title: "Shang Hong Ye (Contemplar las Hojas Rojas)", description: "Pasear por las montañas para admirar los arces rojos.", icon: "🍁", type: "Celebración de la Naturaleza" },
      { title: "Ba Luobo (Cosechar los Rábanos)", description: "Cosecha urgente de rábanos antes de que se congelen.", icon: "🥕", type: "Rito Agrícola" }
    ],
    traditionalFoods: ["Caqui", "Rábano blanco", "Castañas", "Pato asado"]
  },
  {
    id: 19, pinyin: "Lìdōng", hanzi: "立冬", translation: "Comienzo del Invierno", approximateDates: "7 - 21 de Noviembre",
    pentads: [
      { id: 1, description: "Shui Shi Bing (水始冰): El agua comienza a congelarse." },
      { id: 2, description: "Di Shi Dong (地始冻): La tierra comienza a endurecerse." },
      { id: 3, description: "Zhi Ru Da Shui Wei Shen (雉入大水为蜃): Los faisanes se transforman en almejas." }
    ],
    healthAdvice: "Ocultar el Yang y proteger el Yin. Acuéstate temprano, levántate tarde. Cabeza y espalda abrigadas.",
    customs: [
      { title: "He Dong (Felicitar por el Invierno)", description: "Rituales imperiales de bienvenida al invierno y premiación de soldados.", icon: "👑", type: "Veneración" },
      { title: "Bu Dong (Nutrirse para el Invierno)", description: "Comer rico en calorías para almacenar energía.", icon: "🍲", type: "Salud y Bienestar" },
      { title: "Chi Jiao Zi (Comer Empanadillas)", description: "Previene la congelación de las orejas.", icon: "🥟", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Empanadillas de carne", "Sopa de cordero", "Jengibre", "Dátiles rojos"]
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
      { title: "Yan La Rou (Curar las Carnes)", description: "Salar y secar carnes para el Año Nuevo Lunar.", icon: "🥓", type: "Costumbre Agrícola" },
      { title: "Niang Jiu (Elaborar Vino de Invierno)", description: "Elaborar vino de arroz glutinoso.", icon: "🍶", type: "Celebración" },
      { title: "Chi Ci Ba (Comer Pastel de Arroz)", description: "Ofrenda de Ciba al Dios Búfalo de Agua.", icon: "🍡", type: "Tradición Culinaria" }
    ],
    traditionalFoods: ["Sésamo negro", "Frijoles negros", "Pollo negro", "Carnes curadas"]
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
      { title: "Guan Shang Xue Jing (Contemplar la Nieve)", description: "Banquetes para beber vino caliente y componer poemas bajo la nieve.", icon: "❄️", type: "Contemplación" },
      { title: "Jin Bu (Tomar Tónicos de Invierno)", description: "Nutrir el cuerpo con sopas herbales, cordero y jengibre.", icon: "🍲", type: "Cuidado de la Salud" },
      { title: "Zhi Zuo Xiang Chang (Hacer Embutidos)", description: "Secar chorizos y tiras de carne marinadas.", icon: "🌭", type: "Preparación Familiar" }
    ],
    traditionalFoods: ["Sopa de cordero con rábano", "Puerros", "Batatas asadas"]
  },
  {
    id: 22, pinyin: "Dōngzhì", hanzi: "冬至", translation: "Solsticio de Invierno", approximateDates: "22 de Diciembre - 5 de Enero",
    pentads: [
      { id: 1, description: "Qiu Jiao Jie (蚯蚓结): Las lombrices se enroscan bajo tierra." },
      { id: 2, description: "Mi Jiao Jie (麋角解): El alce pierde sus cuernos." },
      { id: 3, description: "Shui Quan Dong (水泉动): Los manantiales comienzan a fluir." }
    ],
    healthAdvice: "Proteger el brote de Yang. No transpirar, meditar sentado para nutrir el Qi.",
    customs: [
      { title: "Chi Tangyuan / Jiaozi (Comer Tangyuan o Jiaozi)", description: "Reunión familiar para comer empanadillas (norte) o bolitas dulces (sur).", icon: "🥣", type: "Tradición Culinaria" },
      { title: "Shu Jiu Jiu (Contar los Nueve Nueves)", description: "Pintar un pétalo de ciruelo por cada 9 días hasta la primavera.", icon: "🌸", type: "Tradición" },
      { title: "Ji Tian (Sacrificio al Cielo)", description: "El emperador realizaba ofrendas al Templo del Cielo.", icon: "🏛️", type: "Veneración" }
    ],
    traditionalFoods: ["Tangyuan", "Jiaozi", "Nueces", "Jengibre"]
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
      { title: "Chi Laba Zhou (Comer Gachas de Laba)", description: "Sopa dulce de cereales, frijoles y frutos secos para celebrar la cosecha.", icon: "🍲", type: "Tradición" },
      { title: "Cai Bing (Cortar Hielo)", description: "Almacenar hielo de ríos para el verano.", icon: "🧊", type: "Tradición" },
      { title: "Zhun Bei Nian Huo (Preparativos de Año Nuevo)", description: "Comprar decoraciones y comida para recibir el Año Nuevo Lunar.", icon: "🧧", type: "Preparación Festiva" }
    ],
    traditionalFoods: ["Gachas Laba", "Arroz glutinoso frito", "Cordero", "Verduras de invierno"]
  },
  {
    id: 24, pinyin: "Dàhán", hanzi: "大寒", translation: "Gran Frío", approximateDates: "20 de Enero - 3 de Febrero",
    pentads: [
      { id: 1, description: "Ji Ru Shui Ze Fu Jian (鸡乳水泽腹坚): Las gallinas empollan, hielo firme en los lagos." },
      { id: 2, description: "Zheng Niao Ji (征鸟厉): Las aves rapaces cazan con ferocidad.", description2: "Las aves rapaces se vuelven más feroces por la escasez." },
      { id: 3, description: "Shui Ze Fu Jian (水泽腹坚): Hielo firme en los lagos (Frío extremo)." }
    ],
    healthAdvice: "No hacer cambios bruscos de temperatura. Estiramientos suaves para prepararse para la primavera.",
    customs: [
      { title: "Wei Ya (Banquete de Fin de Año)", description: "Banquete de agradecimiento a los empleados por el año.", icon: "🥢", type: "Tradición" },
      { title: "Zha Chen (Limpiar el Polvo)", description: "Limpieza profunda para barrer la mala suerte.", icon: "🧽", type: "Preparación Festiva" },
      { title: "Yin Nuan Jiu (Beber Vino Caliente)", description: "Reunión familiar para beber vino de arroz caliente.", icon: "🍶", type: "Salud y Bienestar" }
    ],
    traditionalFoods: ["Rollos de arroz glutinoso (Babo)", "Sopa de pollo negro", "Sopa de castañas", "Vino caliente"]
  }
];

export const SOLAR_TERMS = chineseCalendarData;

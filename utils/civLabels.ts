// civLabels.ts — All UI strings for all civilizations (Rome, Hellas & Aegyptus)

export interface CivLabels {
  // App title & branding
  appTitle: string;
  appSubtitle: string;
  footerMotto: string;
  loadingText: string;

  // Clock & Time
  dayLabel: string;       // Dies / Ἡμέρα
  nightLabel: string;     // Nox / Νύξ
  civilDayPartLabel: string; // "Pars Diei Civilis" / "Μέρος τῆς Ἡμέρας"
  planetaryRulerLabel: string; // "Rector Horae" / "Ἄρχων Ὥρας"
  monthTutelaLabel: string;   // "Tutela Mensis" / "Προστάτης Μηνός"

  // Solar
  sunriseLabel: string;   // Ortus Solis / Ἀνατολὴ Ἡλίου
  sunsetLabel: string;    // Occasus Solis / Δύσις Ἡλίου
  hourLengthLabel: string; // Longitudo Horae / Μῆκος Ὥρας
  minuteUnit: string;     // minuta / λεπτά

  // Weather
  skyLabel: string;       // Caelum / Οὐρανός
  windLabel: string;      // Ventus / Ἄνεμος

  // Calendar
  calendarTitle: string;       // Fasti Romani / Ἡμερολόγιον Ἀττικόν
  calendarSubtitle: string;    // Dies VII Sequentes
  todayLabel: string;          // Hodie / Σήμερον
  godOfDayTitle: string;       // Deus Hodiernus / Θεὸς τῆς Ἡμέρας
  festivalLabel: string;       // Festum / Ἑορτή
  calendarInfoTitle: string;   // "Memoria Rerum Gestarum" / "Μνήμη Πράξεων"

  // Quotes
  quoteTitle: string;     // Sententia Diei / Ἀπόφθεγμα τῆς Ἡμέρας

  // Oracle
  oracleTitle: string;       // Sortes Vergilianae / Κλῆροι Ὁμηρικοί
  oracleSubtitle: string;    // Oraculum Poeticum / Χρησμὸς Ποιητικός
  oracleOpenBook: string;    // Librum Aperire / Βιβλίον Ἀνοῖξαι
  oracleConsultAgain: string; // Iterum Consulere / Πάλιν Ἐρωτῆσαι
  oracleConsulting: string;   // Fata consuluntur... / Οἱ Μοῖραι σκοποῦσι...
  oraclePrompt: string;       // Description text

  // Province / Region
  regionTitle: string;     // Provincia Romana / Ἑλληνικὴ Χώρα
  regionFallback: string;  // Extra Fines Imperii / Ἐκτὸς τοῦ Ἑλληνικοῦ Κόσμου
  regionFallbackDesc: string;
  distanceTitle: string;   // Miliarium Aureum / Βωμὸς τῶν Δώδεκα Θεῶν
  distanceUnit: string;    // m.p. (milia passuum) / στάδια
  distanceFromLabel: string; // "ab Roma" / "ἀπ' Ἀθηνῶν"

  // Controls
  controlsTitle: string;   // GUBERNACULA / ΚΥΒΕΡΝΗΤΗΡΙΑ
  computeBtn: string;      // Computare / Ὑπολογίσαι
  findMeBtn: string;       // Invenire Me / Εὑρεῖν Με
  controlsFooter: string;

  // Info Section
  infoTitle: string;         // De Temporibus Romanorum / Περὶ τοῦ Ἑλληνικοῦ Χρόνου
  infoFirstLetter: string;   // "R" / "Ο"
  infoParagraph1: string;
  infoParagraph2: string;
  infoBottomMotto: string;   // Tempus Fugit • Memento Mori / Πάντα ῥεῖ • Γνῶθι σεαυτόν
  infoBottomMottoEs?: string; // Spanish translation (omit for Latin)

  // Civilization-specific extras
  longCountLabel: string;
  tzolkinLabel: string;
  haabLabel: string;
  wayebWarning: string;

  // Civilization toggle
  civToggleRome: string;
  civToggleHellas: string;
  civToggleAegyptus: string;
  civToggleZhongguo: string;
  civToggleBabylonia: string;
}

export const getRomanLabels = (): CivLabels => ({
  appTitle: 'HOROLOGIUM',
  appSubtitle: 'ROMANUM',
  footerMotto: 'AD ASTRA PER ASPERA',
  loadingText: 'Astrolabium Consulitur...',

  dayLabel: 'Dies',
  nightLabel: 'Nox',
  civilDayPartLabel: 'Pars Diei Civilis',
  planetaryRulerLabel: 'Rector Horae',
  monthTutelaLabel: 'Tutela Mensis',

  sunriseLabel: 'Ortus Solis',
  sunsetLabel: 'Occasus Solis',
  hourLengthLabel: 'Longitudo Horae',
  minuteUnit: 'minuta',

  skyLabel: 'Caelum',
  windLabel: 'Ventus',

  longCountLabel: '',
  tzolkinLabel: '',
  haabLabel: '',
  wayebWarning: '',

  calendarTitle: 'Fasti Romani',
  calendarSubtitle: '— Dies VII Sequentes —',
  todayLabel: 'Hodie',
  godOfDayTitle: '— Deus Hodiernus —',
  festivalLabel: '✧ Festum ✧',
  calendarInfoTitle: 'Memoria Rerum Gestarum',

  quoteTitle: 'Sententia Diei',

  oracleTitle: 'Sortes Vergilianae',
  oracleSubtitle: 'Oraculum Poeticum',
  oracleOpenBook: 'Librum Aperire',
  oracleConsultAgain: 'Iterum Consulere',
  oracleConsulting: 'Fata consuluntur...',
  oraclePrompt: 'Abre el libro de Virgilio al azar y deja que los hados te guíen.',

  regionTitle: 'Provincia Romana',
  regionFallback: 'Extra Fines Imperii',
  regionFallbackDesc: 'Más allá de las fronteras del Imperio.',
  distanceTitle: 'Miliarium Aureum',
  distanceUnit: 'm.p.',
  distanceFromLabel: 'milia passuum ab Roma',

  controlsTitle: 'GUBERNACULA',
  computeBtn: 'Computare',
  findMeBtn: 'Invenire Me',
  controlsFooter: '"Tempus regit actum" — El tiempo rige el acto.',

  infoTitle: 'De Temporibus Romanorum',
  infoFirstLetter: 'R',
  infoParagraph1: 'omani antiqui diem non sicut nos metiebantur. Dies illorum ab ortu solis incipiebat et ad occasum finiebatur, semper in duodecim partes aequales, quas horas vocabant, divisus.',
  infoParagraph2: 'Quare, ut solis iter per caelum cum anni temporibus variat, ita et horae longitudo. Hieme, hora quadraginta quinque minuta tantum esse potest; aestate, ad septuaginta quinque extenditur.',
  infoBottomMotto: 'Tempus Fugit • Memento Mori',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleBabylonia: 'Babilonia',
});

export const getHellenicLabels = (): CivLabels => ({
  appTitle: 'ΧΡΟΝΟΣ',
  appSubtitle: 'ΕΛΛΗΝΙΚΟΣ',
  footerMotto: 'ΓΝΩΘΙ ΣΕΑΥΤΟΝ',
  loadingText: 'Ὁ Γνώμων Σκοπεῖται...',

  dayLabel: 'Ἡμέρα',
  nightLabel: 'Νύξ',
  civilDayPartLabel: 'Μέρος τῆς Ἡμέρας',
  planetaryRulerLabel: 'Ἄρχων Ὥρας',
  monthTutelaLabel: 'Προστάτης Μηνός',

  sunriseLabel: 'Ἀνατολὴ Ἡλίου',
  sunsetLabel: 'Δύσις Ἡλίου',
  hourLengthLabel: 'Μῆκος Ὥρας',
  minuteUnit: 'λεπτά',

  skyLabel: 'Οὐρανός',
  windLabel: 'Ἄνεμος',

  longCountLabel: '',
  tzolkinLabel: '',
  haabLabel: '',
  wayebWarning: '',

  calendarTitle: 'Ἡμερολόγιον Ἀττικόν',
  calendarSubtitle: '— Αἱ VII Ἑπόμεναι Ἡμέραι —',
  todayLabel: 'Σήμερον',
  godOfDayTitle: '— Θεὸς τῆς Ἡμέρας —',
  festivalLabel: '✧ Ἑορτή ✧',
  calendarInfoTitle: 'Μνήμη Πράξεων',

  quoteTitle: 'Ἀπόφθεγμα τῆς Ἡμέρας',

  oracleTitle: 'Κλῆροι Ὁμηρικοί',
  oracleSubtitle: 'Χρησμὸς Ποιητικός',
  oracleOpenBook: 'Βιβλίον Ἀνοῖξαι',
  oracleConsultAgain: 'Πάλιν Ἐρωτῆσαι',
  oracleConsulting: 'Οἱ Μοῖραι σκοποῦσι...',
  oraclePrompt: 'Abre al azar la Ilíada o la Odisea y deja que los hados te guíen.',

  regionTitle: 'Ἑλληνικὴ Χώρα',
  regionFallback: 'Ἐκτὸς τοῦ Ἑλληνικοῦ Κόσμου',
  regionFallbackDesc: 'Más allá de las fronteras del mundo helénico.',
  distanceTitle: 'Βωμὸς τῶν Δώδεκα Θεῶν',
  distanceUnit: 'στάδια',
  distanceFromLabel: 'στάδια ἀπ\' Ἀθηνῶν',

  controlsTitle: 'ΚΥΒΕΡΝΗΤΗΡΙΑ',
  computeBtn: 'Ὑπολογίσαι',
  findMeBtn: 'Εὑρεῖν Με',
  controlsFooter: '"Πάντα ῥεῖ" — Todo fluye.',

  infoTitle: 'Περὶ τοῦ Ἑλληνικοῦ Χρόνου',
  infoFirstLetter: 'Ο',
  infoParagraph1: 'ἱ Ἕλληνες τῆς ἀρχαιότητος τὴν ἡμέραν ὡσαύτως ἐμέτρουν. Ἡ ἡμέρα αὐτοῖς ἀπὸ ἀνατολῆς ἡλίου ἤρχετο καὶ εἰς δύσιν ἐτελεύτα, ἀεὶ εἰς δώδεκα μέρη ἴσα, ἃ ὥρας ἐκάλουν, διῃρημένη.',
  infoParagraph2: 'Ὅθεν, ὥσπερ ἡ τοῦ ἡλίου πορεία κατὰ τὰς ὥρας τοῦ ἔτους μεταβάλλεται, οὕτω καὶ τὸ τῆς ὥρας μῆκος. Χειμῶνος μὲν ὥρα τεσσαράκοντα πέντε λεπτὰ μόνον εἶναι δύναται· θέρους δὲ εἰς ἑβδομήκοντα πέντε ἐκτείνεται.',
  infoBottomMotto: 'Πάντα Ῥεῖ • Γνῶθι Σεαυτόν',
  infoBottomMottoEs: 'Todo Fluye • Conócete a Ti Mismo',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleBabylonia: 'Babilonia',
});

export const getEgyptianLabels = (): CivLabels => ({
  appTitle: 'HOROLOGIUM',
  appSubtitle: 'AEGYPTIACUM',
  footerMotto: 'MAAT HERU',
  loadingText: 'Sha en Thoth...',

  dayLabel: 'Heru',
  nightLabel: 'Gereh',
  civilDayPartLabel: 'Wnwt nt Hrw',
  planetaryRulerLabel: 'Netjer n Wnwt',
  monthTutelaLabel: 'Netjer n Abed',

  sunriseLabel: 'Weben Ra',
  sunsetLabel: 'Hotep Ra',
  hourLengthLabel: 'Aw n Wnwt',
  minuteUnit: 'at',

  skyLabel: 'Pet',
  windLabel: 'Tjaw',

  longCountLabel: '',
  tzolkinLabel: '',
  haabLabel: '',
  wayebWarning: '',

  calendarTitle: 'Calendario Alejandrino',
  calendarSubtitle: '— Heru VII Tepyt —',
  todayLabel: 'Min',
  godOfDayTitle: '— Netjer n Heru —',
  festivalLabel: '𓊹 Heb 𓊹',
  calendarInfoTitle: 'Seshw n Hau',

  quoteTitle: 'Sabiduría de Thoth',

  oracleTitle: 'Sabiduría de Thoth',
  oracleSubtitle: 'Medu Netjer',
  oracleOpenBook: 'Wn Medjat',
  oracleConsultAgain: 'Whm Senedj',
  oracleConsulting: 'Thoth sedjem...',
  oraclePrompt: 'Abre el rollo sagrado de Thoth y deja que la sabiduría milenaria te guíe.',

  regionTitle: 'Sepat Kemet',
  regionFallback: 'Her Tashet',
  regionFallbackDesc: 'Más allá de las fronteras de la Tierra Negra.',
  distanceTitle: 'Iwnw Heliopolis',
  distanceUnit: 'iteru',
  distanceFromLabel: 'iteru em Iwnw',

  controlsTitle: 'SEKHERU',
  computeBtn: 'Heseb',
  findMeBtn: 'Gemi Wi',
  controlsFooter: '"Maat heru" — La verdad es la ley.',

  infoTitle: 'Sha en Kemet',
  infoFirstLetter: 'K',
  infoParagraph1: 'emet, la Tierra Negra, medía el tiempo con la precisión de sus sacerdotes-astrónomos. El año egipcio constaba de 12 meses de 30 días, organizados en tres décadas de 10 días, más 5 días epagómenos al final.',
  infoParagraph2: 'Las tres estaciones —Akhet (Inundación), Peret (Siembra) y Shemu (Cosecha)— marcaban el ritmo de la vida junto al Nilo. El día comenzaba al amanecer, dividido en 12 horas diurnas y 12 nocturnas de duración variable.',
  infoBottomMotto: 'Ankh Udja Seneb • Maat Kheru',
  infoBottomMottoEs: 'Vida, Prosperidad, Salud • Justo de Voz',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleBabylonia: 'Babilonia',
});

export const getChineseLabels = (): CivLabels => ({
  appTitle: 'HOROLOGIUM',
  appSubtitle: 'ZHONGGUO',
  footerMotto: '天人合一',
  loadingText: '计算节气...',

  dayLabel: '昼',
  nightLabel: '夜',
  civilDayPartLabel: '时辰',
  planetaryRulerLabel: '值日星官',
  monthTutelaLabel: '月令',

  sunriseLabel: '日出',
  sunsetLabel: '日落',
  hourLengthLabel: '时节长度',
  minuteUnit: '分',

  skyLabel: '苍穹',
  windLabel: '风',

  longCountLabel: '',
  tzolkinLabel: '',
  haabLabel: '',
  wayebWarning: '',

  calendarTitle: 'Almanaque de las Estaciones',
  calendarSubtitle: '— 节气与候应 —',
  todayLabel: '今',
  godOfDayTitle: '— 候应 —',
  festivalLabel: '✧ 节庆 ✧',
  calendarInfoTitle: '自然现象',

  quoteTitle: '季候养生',

  oracleTitle: '易经占卜',
  oracleSubtitle: '周易智慧',
  oracleOpenBook: '起卦',
  oracleConsultAgain: '重占',
  oracleConsulting: '推演...',
  oraclePrompt: '静心沉思，由易经指引方向。',

  regionTitle: '神州大地',
  regionFallback: '四海之外',
  regionFallbackDesc: '九州之外的领域。',
  distanceTitle: '九州中心',
  distanceUnit: '里',
  distanceFromLabel: '里 (洛阳)',

  controlsTitle: '控制面板',
  computeBtn: '计算',
  findMeBtn: '定位',
  controlsFooter: '"顺天应时" — Armonía con el cielo.',

  infoTitle: '节气与自然',
  infoFirstLetter: '中国',
  infoParagraph1: 'China observó el sol durante milenios y dividió su trayectoria anual en veinticuatro puntos precisos: las Divisiones Estacionales (二十四节气). Cada una abarca quince grados de la eclíptica y dura aproximadamente quince días. A su vez, cada división se subdivide en tres pentadas (候, hòu) de cinco días, cada una asociada a un fenómeno natural: el canto de un pájaro, la floración de una planta, el despertar de un insecto.',
  infoParagraph2: 'Este sistema no es un simple calendario agrícola. Es una cosmología viva: la creencia de que el ser humano (人, rén), el cielo (天, tiān) y la tierra (地, dì) forman una unidad inseparable. Cada pentada es una instrucción sobre cómo vivir en armonía con el pulso del universo — qué comer, qué sembrar, cómo cuidar el cuerpo y el espíritu según el aliento (气, qì) que domina ese momento del año.',
  infoBottomMotto: '天人合一 • 顺应天时',
  infoBottomMottoEs: 'Cielo, Tierra y Hombre son Uno • Sigue el Ritmo del Cielo',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleBabylonia: 'Babilonia',
});

export const getBabylonianLabels = (): CivLabels => ({
  appTitle: 'BĒRU',
  appSubtitle: 'BĀBILIM',
  footerMotto: 'ENŪMA ELIŠ',
  loadingText: 'Los astrónomos consultan las tablillas...',

  dayLabel: 'Ūmu',
  nightLabel: 'Mūšu',
  civilDayPartLabel: 'Parte del Día',
  planetaryRulerLabel: 'Planeta Rector',
  monthTutelaLabel: 'Deidad del Mes',

  sunriseLabel: 'Ṣīt Šamši',
  sunsetLabel: 'Erēb Šamši',
  hourLengthLabel: 'Longitud de la Hora',
  minuteUnit: 'minutos',

  skyLabel: 'Šamû',
  windLabel: 'Šāru',

  longCountLabel: 'Era Seléucida',
  tzolkinLabel: 'Warḫum',
  haabLabel: 'Māšaltu',
  wayebWarning: '¡Mes Intercalar!',

  calendarTitle: 'Warḫum Bābilim',
  calendarSubtitle: '— Ciclo Lunar Sagrado —',
  todayLabel: 'Ūmu Annû',
  godOfDayTitle: 'Deidad del Mes',
  festivalLabel: '✧ Isinnu ✧',
  calendarInfoTitle: 'Sabiduría de los Escribas',

  quoteTitle: 'Sabiduría del Día',

  oracleTitle: 'Tablilla del Destino',
  oracleSubtitle: 'Oráculo de los Astrónomos',
  oracleOpenBook: 'Abrir la Tablilla',
  oracleConsultAgain: 'Consultar de Nuevo',
  oracleConsulting: 'Los kalû-sacerdotes consultan...',
  oraclePrompt: 'Los astrónomos del Esagila observan el cielo y revelan los presagios escritos en las tablillas de arcilla.',

  regionTitle: 'Región de Babilonia',
  regionFallback: 'Más Allá de los Ríos',
  regionFallbackDesc: 'Más allá del Éufrates y el Tigris.',
  distanceTitle: 'Esagila',
  distanceUnit: 'bēru',
  distanceFromLabel: 'bēru desde Babilonia',

  controlsTitle: 'CONTROLES',
  computeBtn: 'Calcular',
  findMeBtn: 'Encontrarme',
  controlsFooter: '"Enūma Eliš" — Cuando en lo alto los cielos no tenían nombre...',

  infoTitle: 'Sobre el Tiempo Babilonio',
  infoFirstLetter: 'B',
  infoParagraph1: 'abilonia, la gran ciudad del Éufrates, fue la cuna del tiempo medido. Sus astrónomos-sacerdotes inventaron el zodíaco de doce signos, los planetas de la semana y el sistema sexagesimal que aún usamos: 60 segundos, 60 minutos, 360 grados.',
  infoParagraph2: 'El calendario lunisolar babilonio sincronizaba la luna con las estaciones mediante meses intercalares proclamados por decreto real. Cada nuevo mes comenzaba con la primera crescent de luna visible — el dios Sîn anunciaba el inicio del Warḫum sagrado.',
  infoBottomMotto: 'Enūma Eliš • Ina Šamê Rabûti',
  infoBottomMottoEs: 'Cuando en lo Alto • Bajo los Grandes Cielos',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleBabylonia: 'Bābilim',
});

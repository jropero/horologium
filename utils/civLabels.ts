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
  lightLabel: string;      // Lux / Φῶς
  darkLabel: string;       // Nox / Σκότος
  notificationsBtn: string; // Nuntii / Ἀγγελίαι
  controlsFooter: string;

  // Info Section
  infoTitle: string;         // De Temporibus Romanorum / Περὶ τοῦ Ἑλληνικοῦ Χρόνου
  infoFirstLetter: string;   // "R" / "Ο"
  infoParagraph1: string;
  infoParagraph2: string;
  infoBottomMotto: string;   // Tempus Fugit • Memento Mori / Πάντα ῥεῖ • Γνῶθι σεαυτόν

  // Maya-specific
  longCountLabel: string;   // Cuenta Larga
  tzolkinLabel: string;     // Tzolk'in
  haabLabel: string;        // Haab'
  wayebWarning: string;     // ¡Días Nefastos!

  // Civilization toggle
  civToggleRome: string;   // Roma / Ρώμη
  civToggleHellas: string;  // Hellas / Ἑλλάς
  civToggleAegyptus: string; // Aegyptus / Αἴγυπτος
  civToggleZhongguo: string; // Zhongguo / 中国
  civToggleMaya: string;   // Maya
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
  lightLabel: 'Lux',
  darkLabel: 'Nox',
  notificationsBtn: 'Nuntii',
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
  civToggleMaya: 'Maya',
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
  lightLabel: 'Φῶς',
  darkLabel: 'Σκότος',
  notificationsBtn: 'Ἀγγελίαι',
  controlsFooter: '"Πάντα ῥεῖ" — Todo fluye.',

  infoTitle: 'Περὶ τοῦ Ἑλληνικοῦ Χρόνου',
  infoFirstLetter: 'Ο',
  infoParagraph1: 'ἱ Ἕλληνες τῆς ἀρχαιότητος τὴν ἡμέραν ὡσαύτως ἐμέτρουν. Ἡ ἡμέρα αὐτοῖς ἀπὸ ἀνατολῆς ἡλίου ἤρχετο καὶ εἰς δύσιν ἐτελεύτα, ἀεὶ εἰς δώδεκα μέρη ἴσα, ἃ ὥρας ἐκάλουν, διῃρημένη.',
  infoParagraph2: 'Ὅθεν, ὥσπερ ἡ τοῦ ἡλίου πορεία κατὰ τὰς ὥρας τοῦ ἔτους μεταβάλλεται, οὕτω καὶ τὸ τῆς ὥρας μῆκος. Χειμῶνος μὲν ὥρα τεσσαράκοντα πέντε λεπτὰ μόνον εἶναι δύναται· θέρους δὲ εἰς ἑβδομήκοντα πέντε ἐκτείνεται.',
  infoBottomMotto: 'Πάντα Ῥεῖ • Γνῶθι Σεαυτόν',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleMaya: 'Maya',
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
  lightLabel: 'Shu',
  darkLabel: 'Keku',
  notificationsBtn: 'Wehawy',
  controlsFooter: '"Maat heru" — La verdad es la ley.',

  infoTitle: 'Sha en Kemet',
  infoFirstLetter: 'K',
  infoParagraph1: 'emet, la Tierra Negra, medía el tiempo con la precisión de sus sacerdotes-astrónomos. El año egipcio constaba de 12 meses de 30 días, organizados en tres décadas de 10 días, más 5 días epagómenos al final.',
  infoParagraph2: 'Las tres estaciones —Akhet (Inundación), Peret (Siembra) y Shemu (Cosecha)— marcaban el ritmo de la vida junto al Nilo. El día comenzaba al amanecer, dividido en 12 horas diurnas y 12 nocturnas de duración variable.',
  infoBottomMotto: 'Ankh Udja Seneb • Maat Kheru',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleMaya: 'Maya',
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
  lightLabel: '昼',
  darkLabel: '夜',
  notificationsBtn: '消息',
  controlsFooter: '"顺天应时" — Armonía con el cielo.',

  infoTitle: '节气与自然',
  infoFirstLetter: 'Z',
  infoParagraph1: '中国传统历法将太阳周年运动轨迹分为二十四等分，即二十四节气。每一个节气又细分为三候，反映了自然界在不同阶段的物候变化，体现了古人“天人合一”的宇宙观。',
  infoParagraph2: '这种历法不仅指导了古代农耕生产，还深刻影响了中医养生与文化习俗。从春分到秋分，每一候都记录着花开叶落、候鸟迁徙的细微节律，让人与自然同频共振。',
  infoBottomMotto: '天人合一 • 顺应天时',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleMaya: 'Maya',
});

export const getMayaLabels = (): CivLabels => ({
  appTitle: 'HOROLOGIUM',
  appSubtitle: 'MAYA',
  footerMotto: 'IN LAK\'ECH',
  loadingText: 'Consultando el Tzolk\'in...',

  dayLabel: 'K\'in',
  nightLabel: 'Ak\'ab',
  civilDayPartLabel: 'Parte del Día',
  planetaryRulerLabel: 'Señor de la Hora',
  monthTutelaLabel: 'Deidad del Mes',

  sunriseLabel: 'Salil K\'in',
  sunsetLabel: 'Oc K\'in',
  hourLengthLabel: 'Longitud de la Hora',
  minuteUnit: 'minutos',

  skyLabel: 'Ka\'an',
  windLabel: 'Iik\'',

  longCountLabel: 'Cuenta Larga',
  tzolkinLabel: 'Tzolk\'in',
  haabLabel: 'Haab\'',
  wayebWarning: '¡Días Nefastos!',

  calendarTitle: 'Calendario Maya',
  calendarSubtitle: '— Ciclo Sagrado —',
  todayLabel: 'Hoy',
  godOfDayTitle: 'Señor de la Noche',
  festivalLabel: '✧ K\'iin ✧',
  calendarInfoTitle: 'Sabiduría de los Abuelos',

  quoteTitle: 'Refrán del Día',

  oracleTitle: 'Chilam Balam',
  oracleSubtitle: 'Oráculo de la Rueda Calendárica',
  oracleOpenBook: 'Abrir el Códice',
  oracleConsultAgain: 'Consultar de Nuevo',
  oracleConsulting: 'Los Ah Kin\'ob consultan...',
  oraclePrompt: 'Abre el Chilam Balam al azar y deja que la palabra de los antiguos te guíe.',

  regionTitle: 'Región Maya',
  regionFallback: 'Fuera del Mundo Maya',
  regionFallbackDesc: 'Más allá de las tierras del maíz y el jaguar.',
  distanceTitle: 'Ombligo del Mundo',
  distanceUnit: 'k\'in (días)',
  distanceFromLabel: 'días desde la Ciudad de las Pirámides',

  controlsTitle: 'CONTROLES',
  computeBtn: 'Calcular',
  findMeBtn: 'Encontrarme',
  lightLabel: 'K\'iin',
  darkLabel: 'Ak\'ab',
  notificationsBtn: 'Notificaciones',
  controlsFooter: '"In Lak\'ech" — Tú eres mi otro yo.',

  infoTitle: 'Sobre el Tiempo Maya',
  infoFirstLetter: 'M',
  infoParagraph1: 'aya, la civilización de las selvas y pirámides, desarrolló uno de los sistemas calendáricos más precisos de la antigüedad. Combinaban el Tzolk\'in (260 días) con el Haab\' (365 días) en una Rueda Calendárica de 52 años.',
  infoParagraph2: 'Junto a estos ciclos, la Cuenta Larga registraba fechas absolutas desde la creación del mundo (11 de agosto de 3114 a.C.). Los Ah Kin\'ob, sacerdotes del sol, observaban el movimiento de Venus y la Luna para sincronizar sus rituales con el cosmos.',
  infoBottomMotto: 'In Lak\'ech • Hala Ken\'',

  civToggleRome: 'Roma',
  civToggleHellas: 'Ἑλλάς',
  civToggleAegyptus: 'Aegyptus',
  civToggleZhongguo: '中国',
  civToggleMaya: 'Maya',
});

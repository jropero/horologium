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

  // Civilization toggle
  civToggleRome: string;   // Roma / Ρώμη
  civToggleHellas: string;  // Hellas / Ἑλλάς
  civToggleAegyptus: string; // Aegyptus / Αἴγυπτος
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
  civToggleAegyptus: 'Kemet',
});

// apophthegmataData.ts — Greek philosopher and dramatist quotes
// Authentic quotes with Ancient Greek originals and Spanish translations

export interface Apophthegma {
  id: number;
  greek: string;
  author: string;
  translation: string;
}

export const APOPHTHEGMATA: Apophthegma[] = [
  // === ΣΩΚΡΑΤΗΣ (Sócrates) ===
  { id: 1, greek: "Ἓν οἶδα ὅτι οὐδὲν οἶδα.", author: "Σωκράτης", translation: "Solo sé que no sé nada." },
  { id: 2, greek: "Ὁ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ.", author: "Σωκράτης", translation: "Una vida sin examen no merece ser vivida." },
  { id: 3, greek: "Γνῶθι σεαυτόν.", author: "Επτά Σοφοί (Dελφοί)", translation: "Conócete a ti mismo. (Máxima délfica adoptada por Sócrates)" },
  { id: 4, greek: "Ἀρχὴ σοφίας ἡ τῶν ὀνομάτων ἐπίσκεψις.", author: "Σωκράτης", translation: "El principio de la sabiduría es la investigación de los nombres." },
  { id: 5, greek: "Τὸ δέ μοι μάλιστα θαυμαστὸν ἐφάνη, ὅτι ἑαυτοὺς μὲν οὐ γιγνώσκουσι.", author: "Σωκράτης", translation: "Lo más asombroso es que no se conocen a sí mismos." },
  { id: 6, greek: "Ἕν μόνον ἀγαθόν, τὴν ἐπιστήμην, καὶ ἕν μόνον κακόν, τὴν ἀμαθίαν.", author: "Σωκράτης", translation: "Solo hay un bien: el conocimiento; y un solo mal: la ignorancia." },
  { id: 7, greek: "Φαῦλος ἄρχων ἑαυτοῦ, πῶς ἄλλων ἄρξει;", author: "Σωκράτης", translation: "Si no puede gobernarse a sí mismo, ¿cómo gobernará a otros?" },
  { id: 8, greek: "Κρεῖττόν ἐστιν ἀδικεῖσθαι ἢ ἀδικεῖν.", author: "Σωκράτης", translation: "Es mejor sufrir injusticia que cometerla." },

  // === ΠΛΑΤΩΝ (Platón) ===
  { id: 9, greek: "Ἡ ἀνάγκη μήτηρ τῆς ἐπινοίας.", author: "Πλάτων", translation: "La necesidad es la madre de la invención." },
  { id: 10, greek: "Θεὸς ἀεὶ γεωμετρεῖ.", author: "Πλάτων", translation: "Dios siempre hace geometría." },
  { id: 11, greek: "Μηδεὶς ἀγεωμέτρητος εἰσίτω.", author: "Πλάτων", translation: "Que nadie entre sin saber geometría." },
  { id: 12, greek: "Ἡ τιμωρία τοῦ σοφοῦ ὅς οὐ θέλει ἄρχειν ἐστὶ τὸ ὑπὸ φαυλοτέρου ἄρχεσθαι.", author: "Πλάτων", translation: "El castigo del sabio que no quiere gobernar es ser gobernado por uno peor." },
  { id: 13, greek: "Ἡ μουσικὴ νόμοις ἔμβαλε τοὺς μάλιστα δυναμένους εἰς τὴν ψυχήν.", author: "Πλάτων", translation: "La música da alma al universo, alas a la mente y vuelo a la imaginación." },
  { id: 14, greek: "Τὸ σκοτεινότατον μέρος τοῦ ζῆν, τὸ τρέφειν ἡδοναῖς ψυχήν.", author: "Πλάτων", translation: "La parte más oscura de la vida es alimentar el alma solo con placeres." },
  { id: 15, greek: "Κατ' ἀρχάς, ὁ τύραννος μειδιᾷ πᾶσιν.", author: "Πλάτων", translation: "Al principio, el tirano sonríe a todos." },
  { id: 16, greek: "Ὀφθαλμοὶ τῆς ψυχῆς, τοῦτό ἐστι τὸ τῆς σοφίας ἀληθινόν.", author: "Πλάτων", translation: "Los ojos del alma: eso es la verdadera sabiduría." },

  // === ΑΡΙΣΤΟΤΕΛΗΣ (Aristóteles) ===
  { id: 17, greek: "Ἄνθρωπος φύσει πολιτικὸν ζῷον.", author: "Ἀριστοτέλης", translation: "El hombre es por naturaleza un animal político." },
  { id: 18, greek: "Ῥίζα τῆς παιδείας πικρά, ὁ δὲ καρπὸς γλυκύς.", author: "Ἀριστοτέλης", translation: "La raíz de la educación es amarga, pero su fruto es dulce." },
  { id: 19, greek: "Ἔστι δὲ φίλος ἄλλος αὐτός.", author: "Ἀριστοτέλης", translation: "Un amigo es un segundo yo." },
  { id: 20, greek: "Μία χελιδὼν ἔαρ οὐ ποιεῖ.", author: "Ἀριστοτέλης", translation: "Una golondrina no hace primavera." },
  { id: 21, greek: "Ἐν τῷ πράττειν ἡδονὴ ἡ ζωή.", author: "Ἀριστοτέλης", translation: "En la acción está el placer de vivir." },
  { id: 22, greek: "Ὁ νόμος τάξις ἐστί, καὶ ἡ εὐνομία, εὐταξία.", author: "Ἀριστοτέλης", translation: "La ley es orden, y el buen gobierno es buen orden." },
  { id: 23, greek: "Ἕξιν ψυχῆς ἣ ὁρίζει τὸ εὔ.", author: "Ἀριστοτέλης", translation: "La virtud es un hábito del alma que define la excelencia." },
  { id: 24, greek: "Τὸ ὅλον ἐστὶ πλεῖον τῶν μερῶν.", author: "Ἀριστοτέλης", translation: "El todo es más que la suma de sus partes." },
  { id: 25, greek: "Ἡ ἐλπὶς ἐστιν ὄναρ ἐγρηγορότος.", author: "Ἀριστοτέλης", translation: "La esperanza es un sueño despierto." },

  // === ΕΠΙΚΟΥΡΟΣ (Epicuro) ===
  { id: 26, greek: "Λάθε βιώσας.", author: "Ἐπίκουρος", translation: "Vive oculto." },
  { id: 27, greek: "Ὁ θάνατος οὐδὲν πρὸς ἡμᾶς.", author: "Ἐπίκουρος", translation: "La muerte no es nada para nosotros." },
  { id: 28, greek: "Παντὸς ἡδέος φυσικὸν ἀρκοῦν πρὸς ἡδονὴν ζῆν.", author: "Ἐπίκουρος", translation: "Todo placer es en sí bueno, pero no todo placer debe elegirse." },
  { id: 29, greek: "Οὐ τὸ πλῆθος ἡ τοῦ βίου ζωή, ἀλλ' ἡ ἡδονή.", author: "Ἐπίκουρος", translation: "No es la duración sino la calidad lo que importa en la vida." },
  { id: 30, greek: "Ἀτάραξία ψυχῆς, τοῦτ' ἐστὶ τὸ τέλος.", author: "Ἐπίκουρος", translation: "La serenidad del alma: ese es el fin último." },

  // === ΗΡΑΚΛΕΙΤΟΣ (Heráclito) ===
  { id: 31, greek: "Πάντα ῥεῖ.", author: "Ἡράκλειτος", translation: "Todo fluye." },
  { id: 32, greek: "Δὶς ἐς τὸν αὐτὸν ποταμὸν οὐκ ἂν ἐμβαίης.", author: "Ἡράκλειτος", translation: "No te puedes bañar dos veces en el mismo río." },
  { id: 33, greek: "Πόλεμος πατὴρ πάντων.", author: "Ἡράκλειτος", translation: "La guerra es el padre de todas las cosas." },
  { id: 34, greek: "Ἦθος ἀνθρώπῳ δαίμων.", author: "Ἡράκλειτος", translation: "El carácter del hombre es su destino." },
  { id: 35, greek: "Ἡ ὁδὸς ἄνω κάτω μία καὶ ωὑτή.", author: "Ἡράκλειτος", translation: "El camino hacia arriba y hacia abajo es uno y el mismo." },
  { id: 36, greek: "Οὐκ ἐμοῦ, ἀλλὰ τοῦ Λόγου ἀκούσαντας ὁμολογεῖν σοφόν ἐστιν.", author: "Ἡράκλειτος", translation: "No escuchándome a mí, sino al Logos, es sabio reconocer que todo es uno." },

  // === ΔΗΜΟΚΡΙΤΟΣ (Demócrito) ===
  { id: 37, greek: "Ἡ εὐθυμίη γίνεται μετριότητι τέρψιος.", author: "Δημόκριτος", translation: "La felicidad nace de la moderación en el placer." },
  { id: 38, greek: "Ὁ φθόνος ἕλκεα ψυχῆς ποιεῖ.", author: "Δημόκριτος", translation: "La envidia crea úlceras en el alma." },
  { id: 39, greek: "Τόλμα πρήξιος ἀρχή.", author: "Δημόκριτος", translation: "La audacia es el principio de la acción." },

  // === ΘΑΛΗΣ (Tales de Mileto) ===
  { id: 40, greek: "Τὸ σοφώτατον χρόνος· ἀνευρίσκει γὰρ πάντα.", author: "Θαλῆς", translation: "Lo más sabio es el tiempo, pues todo lo descubre." },
  { id: 41, greek: "Χαλεπώτατον τὸ ἑαυτὸν γνῶναι.", author: "Θαλῆς", translation: "Lo más difícil es conocerse a uno mismo." },

  // === ΠΙΤΑΤΚΟΣ (Pítaco) ===
  { id: 42, greek: "Καιρὸν γνῶθι.", author: "Πιττακός", translation: "Conoce el momento oportuno." },

  // === ΣΟΦΟΚΛΗΣ (Sófocles) ===
  { id: 43, greek: "Πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει.", author: "Σοφοκλῆς", translation: "Muchas cosas asombrosas hay, pero ninguna tan asombrosa como el hombre." },
  { id: 44, greek: "Μηδένα πρὸ τῆς τελευτῆς μακάριζε.", author: "Σοφοκλῆς", translation: "A nadie llames feliz antes de su muerte." },
  { id: 45, greek: "Τὸν εὐτυχοῦντα πάντες εἰσὶ συγγενεῖς.", author: "Σοφοκλῆς", translation: "Todos son parientes del afortunado." },
  { id: 46, greek: "Οὐ γὰρ συνέχθειν, ἀλλὰ συμφιλεῖν ἔφυν.", author: "Σοφοκλῆς", translation: "No nací para compartir el odio, sino el amor." },
  { id: 47, greek: "Τῷ χρόνῳ πάντα κρύπτεται κἀκφύεται.", author: "Σοφοκλῆς", translation: "El tiempo todo lo oculta y todo lo revela." },

  // === ΕΥΡΙΠΙΔΗΣ (Eurípides) ===
  { id: 48, greek: "Οὐκ ἔστιν ἐν βροτοῖς τουτ' ὂς εὐδαίμων ἐφύ.", author: "Εὐριπίδης", translation: "No hay entre los mortales quien haya nacido feliz." },
  { id: 49, greek: "Τίς δ' οἶδεν εἰ τὸ ζῆν μέν ἐστι κατθανεῖν, τὸ κατθανεῖν δὲ ζῆν;", author: "Εὐριπίδης", translation: "¿Quién sabe si vivir es morir y morir es vivir?" },
  { id: 50, greek: "Δεινὸν τὸ τίκτειν· φιλότεκνον γὰρ ἅπαν.", author: "Εὐριπίδης", translation: "Es terrible dar a luz, pues engendra amor inquebrantable." },
  { id: 51, greek: "Ἐκ τῶν λίθων τούτων ἡ ἀρετὴ ψυχῆς φαίνεται.", author: "Εὐριπίδης", translation: "En la adversidad se muestra la virtud del alma." },
  { id: 52, greek: "Ὁ χρόνος δὲ δείξει.", author: "Εὐριπίδης", translation: "El tiempo lo revelará." },

  // === ΑΙΣΧΥΛΟΣ (Esquilo) ===
  { id: 53, greek: "Πάθει μάθος.", author: "Αἰσχύλος", translation: "Por el sufrimiento, el conocimiento." },
  { id: 54, greek: "Τῶν γὰρ ἡσύχων ξυνετός τε καὶ ἀγαθός.", author: "Αἰσχύλος", translation: "De los callados puede salir el más sabio y mejor." },
  { id: 55, greek: "Θεὸς μὲν αἰτίαν φύει βροτοῖς, ὅταν κακῶσαι δῶμα παμπήδην θέλῃ.", author: "Αἰσχύλος", translation: "Un dios siembra la culpa entre los mortales cuando quiere destruir una casa por completo." },

  // === ΠΙΝΔΑΡΟΣ (Píndaro) ===
  { id: 56, greek: "Γένοι' οἷος ἐσσὶ μαθών.", author: "Πίνδαρος", translation: "Sé quien eres, habiéndolo aprendido." },
  { id: 57, greek: "Ἄριστον μὲν ὕδωρ.", author: "Πίνδαρος", translation: "Lo mejor de todo es el agua." },
  { id: 58, greek: "Ἐπάμεροι· τί δέ τις; τί δ' οὔ τις; σκιᾶς ὄναρ ἄνθρωπος.", author: "Πίνδαρος", translation: "Seres de un día: ¿qué es uno? ¿qué no es? El hombre es el sueño de una sombra." },

  // === ΘΟΥΚΥΔΙΔΗΣ (Tucídides) ===
  { id: 59, greek: "Κτῆμα ἐς αἰεί.", author: "Θουκυδίδης", translation: "Una posesión para siempre." },
  { id: 60, greek: "Τὸ εὔδαιμον τὸ ἐλεύθερον, τὸ δ' ἐλεύθερον τὸ εὔψυχον.", author: "Θουκυδίδης", translation: "La felicidad es la libertad, y la libertad es el valor." },
  { id: 61, greek: "Ἄνδρες γὰρ πόλις, καὶ οὐ τείχη.", author: "Θουκυδίδης", translation: "Los hombres hacen la ciudad, no las murallas." },

  // === ΗΡΟΔΟΤΟΣ (Heródoto) ===
  { id: 62, greek: "Αἱ μεγάλαι πρήξιες μεγάλοισι κινδύνοισι ἐθέλουσι γίνεσθαι.", author: "Ἡρόδοτος", translation: "Las grandes hazañas suelen nacer de grandes peligros." },
  { id: 63, greek: "Ὀφθαλμοῖσι πιστότερα τῶν ὤτων.", author: "Ἡρόδοτος", translation: "Los ojos son testigos más fieles que los oídos." },

  // === ΠΕΡΙΚΛΗΣ (Pericles) ===
  { id: 64, greek: "Φιλοκαλοῦμέν τε γὰρ μετ' εὐτελείας καὶ φιλοσοφοῦμεν ἄνευ μαλακίας.", author: "Περικλῆς", translation: "Amamos la belleza con sencillez y la sabiduría sin afeminamiento." },
  { id: 65, greek: "Ἡ εὐδαιμονία ἐν τῇ ἐλευθερίᾳ, ἡ δ' ἐλευθερία ἐν τῇ εὐψυχίᾳ.", author: "Περικλῆς", translation: "La felicidad reside en la libertad, y la libertad en el coraje." },

  // === ΔΙΟΓΕΝΗΣ (Diógenes el Cínico) ===
  { id: 66, greek: "Ζητῶ ἄνθρωπον.", author: "Διογένης", translation: "Busco un hombre." },
  { id: 67, greek: "Μικρὸν ἀπὸ τοῦ ἡλίου μετάστηθι.", author: "Διογένης", translation: "Apártate un poco del sol. (A Alejandro Magno)" },
  { id: 68, greek: "Κοσμοπολίτης εἰμί.", author: "Διογένης", translation: "Soy ciudadano del mundo." },

  // === ΠΥΘΑΓΟΡΑΣ (Pitágoras) ===
  { id: 69, greek: "Ἀριθμὸς πάντων ἀρχή.", author: "Πυθαγόρας", translation: "El número es el principio de todas las cosas." },
  { id: 70, greek: "Κοσμεῖ σεαυτὸν σοφίᾳ.", author: "Πυθαγόρας", translation: "Adórnate con sabiduría." },
  { id: 71, greek: "Σίγα ἢ λέγε τι τῆς σιγῆς κρεῖττον.", author: "Πυθαγόρας", translation: "Calla, o di algo mejor que el silencio." },

  // === ΑΝΑΞΑΓΟΡΑΣ (Anaxágoras) ===
  { id: 72, greek: "Νοῦς πάντα διακοσμεῖ.", author: "Ἀναξαγόρας", translation: "La mente ordena todas las cosas." },

  // === ΞΕΝΟΦΩΝ (Jenofonte) ===
  { id: 73, greek: "Θάλαττα! Θάλαττα!", author: "Ξενοφῶν", translation: "¡El mar! ¡El mar!" },

  // === ΜΕΝΑΝΔΡΟΣ (Menandro) ===
  { id: 74, greek: "Ὃν οἱ θεοὶ φιλοῦσιν ἀποθνῄσκει νέος.", author: "Μένανδρος", translation: "A quien los dioses aman, muere joven." },
  { id: 75, greek: "Γάμει, κακῶν γὰρ ἐμπειρότερος γενήσει.", author: "Μένανδρος", translation: "Cásate y ganarás experiencia en desgracias." },

  // === ΙΣΟΚΡΑΤΗΣ (Isócrates) ===
  { id: 76, greek: "Τὴν δημοκρατίαν ταύτην γιγνώσκω ὡς πολιτεία σωτηρίαν ἔχουσα.", author: "Ἰσοκράτης", translation: "Reconozco esta democracia como el gobierno que contiene la salvación." },

  // === ΑΛΕΞΑΝΔΡΟΣ (Alejandro Magno) ===
  { id: 77, greek: "Οὐδὲν ἀδύνατον τῷ τολμῶντι.", author: "Ἀλέξανδρος", translation: "Nada es imposible para el que se atreve." },

  // === Proverbios y sentencias griegos ===
  { id: 78, greek: "Μηδὲν ἄγαν.", author: "Ἑπτὰ Σοφοί", translation: "Nada en exceso." },
  { id: 79, greek: "Μέτρον ἄριστον.", author: "Κλεόβουλος", translation: "La medida es lo mejor." },
  { id: 80, greek: "Μελέτη τὸ πᾶν.", author: "Περίανδρος", translation: "La práctica es todo." },
  { id: 81, greek: "Ἐγγύα, πάρα δ' Ἄτα.", author: "Θαλῆς", translation: "Da fianza y tendrás la ruina al lado." },
  { id: 82, greek: "Αἰὲν ἀριστεύειν.", author: "Ὅμηρος", translation: "Esforzarse siempre por ser el mejor." },
];

export const getApophthegmaOfTheDay = (date: Date): Apophthegma => {
  // Use Date.UTC to avoid DST-related drift (same fix as Egyptian wisdom)
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor((current - start) / oneDay);
  const index = (dayOfYear - 1) % APOPHTHEGMATA.length;
  return APOPHTHEGMATA[index >= 0 ? index : 0];
};

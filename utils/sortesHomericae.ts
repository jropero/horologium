// sortesHomericae.ts — Random verses from Homer's Iliad and Odyssey
// Used as a Greek oracle method: open the book at random for divine guidance.

export interface SorsHomerica {
  greek: string;
  spanish: string;
  source: string;
}

export const SORTES_HOMERICAE: SorsHomerica[] = [
  // === ODISEA ===
  { greek: "Ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον, ὃς μάλα πολλὰ πλάγχθη.", spanish: "Cuéntame, Musa, del hombre astuto que mucho vagó.", source: "Od. I, 1" },
  { greek: "Αὐτὰρ ἐπεὶ πόσιος καὶ ἐδητύος ἐξ ἔρον ἕντο.", spanish: "Y cuando hubieron saciado el deseo de comida y bebida.", source: "Od. I, 150" },
  { greek: "Τηλέμαχ', ἄλλα μὲν αὐτὸς ἐνὶ φρεσὶ σῇσι νοήσεις, ἄλλα δὲ καὶ δαίμων ὑποθήσεται.", spanish: "Telémaco, pensarás unas cosas por ti mismo, y un dios te sugerirá las demás.", source: "Od. III, 26" },
  { greek: "Πολλῶν δ' ἀνθρώπων ἴδεν ἄστεα καὶ νόον ἔγνω.", spanish: "Vio las ciudades de muchos hombres y conoció su manera de pensar.", source: "Od. I, 3" },
  { greek: "Ὣς δ' ὅτ' ἀνὴρ ἀπάλαμνος, ἐφ' ᾧ τε πολλοὶ ἴδωνται, κεῖτ' ἐν δαιτί.", spanish: "Como un hombre impotente que yace en un festín mientras otros lo observan.", source: "Od. XVIII, 1" },
  { greek: "Θάρσει· μηδέ τί τοι θάνατος καταθύμιος ἔστω.", spanish: "Ten ánimo; que la muerte no te preocupe en el corazón.", source: "Od. V, 397" },
  { greek: "Ξεῖνε, σὺ μέν με πρῶτον ἐρώτα μέμηνα δέ τοι ἐρέω.", spanish: "Extranjero, me preguntas primero, y yo te responderé la verdad.", source: "Od. IX, 16" },
  { greek: "Νόστος τοι πρῶτον μελήσει.", spanish: "El regreso será tu primera preocupación.", source: "Od. XI, 100" },
  { greek: "Τέτλαθι δή, κραδίη· καὶ κύντερον ἄλλο ποτ' ἔτλης.", spanish: "¡Aguanta, corazón! Cosas peores has sufrido otras veces.", source: "Od. XX, 18" },
  { greek: "Ἡμεῖς δ' αὖτε νέοι μεταπρεπέες γενεῇφι.", spanish: "Nosotros, los jóvenes, destacamos entre nuestra generación.", source: "Od. VIII, 36" },
  { greek: "Οὐ μὲν γάρ τι κακὸν βασιλευέμεν.", spanish: "No es malo ser rey.", source: "Od. I, 392" },
  { greek: "Αἰδοῖός τε κατ' ἄστυ μετὰ πρώτοισιν ἐτύχθη.", spanish: "Fue respetado en la ciudad entre los primeros.", source: "Od. VIII, 472" },

  // === ILÍADA ===
  { greek: "Μῆνιν ἄειδε, θεά, Πηληιάδεω Ἀχιλῆος, οὐλομένην.", spanish: "Canta, oh diosa, la cólera funesta del Pelida Aquiles.", source: "Il. I, 1" },
  { greek: "Αἰὲν ἀριστεύειν καὶ ὑπείροχον ἔμμεναι ἄλλων.", spanish: "Esforzarse siempre por ser el mejor y distinguirse entre los demás.", source: "Il. VI, 208" },
  { greek: "Ὡς φάτο· τὸν δ' ἄχεος νεφέλη ἐκάλυψε μέλαινα.", spanish: "Así habló, y una negra nube de dolor lo envolvió.", source: "Il. XVIII, 22" },
  { greek: "Ἐσθλοῦ γάρ ἐστι πατρός, ὃν εἴωθε τιμᾶν.", spanish: "Es propio de un buen padre ser honrado.", source: "Il. VI, 209" },
  { greek: "Φύλλων γενεὴ τοιήδε καὶ ἀνδρῶν.", spanish: "Como la generación de las hojas, así es la de los hombres.", source: "Il. VI, 146" },
  { greek: "Εἷς οἰωνὸς ἄριστος, ἀμύνεσθαι περὶ πάτρης.", spanish: "Un solo augurio es el mejor: defender la patria.", source: "Il. XII, 243" },
  { greek: "Οὐ χρὴ παννύχιον εὕδειν βουληφόρον ἄνδρα.", spanish: "No debe dormir toda la noche un hombre de consejo.", source: "Il. II, 24" },
  { greek: "Ἐν γὰρ χερσὶ τέλος πολέμου, ἐπέων δ' ἐνὶ βουλῇ.", spanish: "En las manos está el desenlace de la guerra; en las palabras, el del consejo.", source: "Il. XVI, 630" },
  { greek: "Κρατερὴ δ' ἐπικείσετ' ἀνάγκη.", spanish: "Una dura necesidad se impone.", source: "Il. VI, 458" },
  { greek: "Ζεὺς δ' ἀρετὴν ἄνδρεσσιν ὀφέλλει τε μινύθει τε.", spanish: "Zeus aumenta y disminuye la virtud de los hombres.", source: "Il. XX, 242" },
  { greek: "Αὐτὸς ἐπ' ἀθανάτοισι θεοῖσι μάχεσθαι κελεύεις;", spanish: "¿Me ordenas luchar yo solo contra los dioses inmortales?", source: "Il. V, 440" },
  { greek: "Ὡς ἔριδος πολέμοιό τε φύλοπις αἰνή.", spanish: "Así es la terrible contienda de la discordia y la guerra.", source: "Il. IV, 440" },
  { greek: "Ἀλλ' ἄγε δὴ μεθέμεν, ἵνα τις σταδίῃ μάχηται.", spanish: "Pero vamos, dejemos esto, que cada uno luche cuerpo a cuerpo.", source: "Il. III, 432" },
  { greek: "Πέπνυσο, μηδ' ἄρα σε νηπίαι ἐξαπάτωσιν.", spanish: "Sé prudente, y que las necedades no te engañen.", source: "Il. V, 440" },
  { greek: "Οἶδ' ὅτι μοι μοῖρ' ἐστὶ τεθνάμεναι ἐνθάδ'.", spanish: "Sé que mi destino es morir aquí.", source: "Il. XXII, 297" },
  { greek: "Ἄνδρα μοι, Μοῦσα, βοηθεῖν ζωῆς κρίσιν.", spanish: "Ayúdame, Musa, con la prueba de la vida.", source: "Il. IX, 413" },
  { greek: "Ἵπποι, νῦν δή μοι κομιδὴν ἀποτίνετον.", spanish: "Caballos, ahora pagadme el cuidado que os he dado.", source: "Il. VIII, 185" },
];

export const getRandomSorsHomerica = (): SorsHomerica => {
  return SORTES_HOMERICAE[Math.floor(Math.random() * SORTES_HOMERICAE.length)];
};

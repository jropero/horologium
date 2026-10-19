// egyptianHoursData.ts — The twelve hours (wnwt) of the night and of the day.
//
// Pharaonic Egypt had no planetary week or planetary hours (both are Greco-Roman;
// Bultrighini & Stern in S. Stern (ed.), Calendars in the Making, 2021, pp. 10–79).
// Each of its unequal hours was instead personified by an hour goddess.
//
// Night: the hour goddesses of the Amduat (Imy-Duat), names after E. Hornung,
//   Die Unterweltsbücher der Ägypter (1997) p. 18 and Das Amduat (1963–67), as listed
//   in de.wikipedia "Amduat" / "Stundengottheiten". Spanish renderings are ours,
//   from Hornung's German. Transliterations are given only where verified
//   (hours 1 and 12: Leitz, Altägyptische Sternuhren, 1995; von Lieven 2007).
//   The heading phrase is attested in the Amduat: "wnwt pw tpt nt grḥ"
//   ("it is the first hour of the night").
// Day: the hours of the Book of the Day (sšmw n rḫ rnw n nꜣ wnwt nt hrw), after
//   M. Müller-Roth, Das Buch vom Tage (2008), as listed in de.wikipedia
//   "Buch vom Tage". Lower confidence: other hour-goddess lists differ in hours 4–6,
//   8, 9 and 11; only hours 1 and 12 are verified with transliteration.

export interface EgyptianHour {
  /** Egyptological transliteration of the hour goddess's name, when verified. */
  translit?: string;
  /** Spanish rendering of the hour goddess's name. */
  name: string;
  /** What happens to Ra in this hour. */
  ra: string;
}

export const NIGHT_HOURS: EgyptianHour[] = [
  { translit: 'Wšmt-ḥꜣwt-ḫftjw=s', name: 'La que aplasta las frentes de sus enemigos',
    ra: 'Ra entra por el horizonte occidental; los babuinos lo saludan.' },
  { name: 'La sabia que protege a su señor',
    ra: 'La barca navega por las aguas de Wernes, tierra de la fertilidad.' },
  { name: 'La que corta los ba',
    ra: 'Ra atraviesa las aguas de Osiris.' },
  { name: 'La grande que está en la Duat',
    ra: 'En el desierto de Sokar la barca se vuelve serpiente y es remolcada por la arena.' },
  { name: 'La guía que está en medio de su barca',
    ra: 'La barca es remolcada sobre la caverna de Sokar y el túmulo de Osiris.' },
  { name: 'La que llega y da lo justo',
    ra: 'El ba de Ra se une a su cuerpo, protegido por la serpiente Mehen.' },
  { name: 'La que rechaza a Hiu y decapita al de rostro terrible',
    ra: 'Apofis es atado; la magia de Isis deja avanzar la barca.' },
  { name: 'Señora de la noche profunda',
    ra: 'Ra abre con su voz cinco puertas; los muertos reciben ropas nuevas.' },
  { name: 'La que adora y protege a su señor',
    ra: 'Doce remeros impulsan la barca; los muertos reciben pan y cerveza.' },
  { name: 'La furiosa que degüella a los traidores',
    ra: 'Guardias armados velan contra Apofis; Horus rescata a los ahogados.' },
  { name: 'La estrellada, señora de la barca, que rechaza al rebelde cuando sale',
    ra: 'Los ojos de Ra son sanados; los enemigos arden.' },
  { translit: 'Ptrt-nfrw-nb=s', name: 'La que contempla la perfección de su señor',
    ra: 'Ra renace como Jepri en el horizonte oriental.' },
];

export const DAY_HOURS: EgyptianHour[] = [
  { translit: 'S-ḫꜥ-nfrw-n-Rꜥ', name: 'La que hace aparecer la belleza de Ra',
    ra: 'Ra sale por el horizonte oriental.' },
  { name: 'La que ahuyenta la oscuridad',          ra: 'Ra asciende; lo acompaña Hu, la palabra creadora.' },
  { name: 'La que alegra los ba de los dioses',    ra: 'Ra navega por el cielo; lo acompaña Sia, el entendimiento.' },
  { name: 'Luz de la salida',                      ra: 'Ra sigue subiendo en su barca diurna.' },
  { name: 'La hora de la diosa Igeret',            ra: 'Ra se acerca a lo más alto del cielo.' },
  { name: 'La que se alza apresando a Seth',       ra: 'Ra en el cenit; su barca vence a Apofis.' },
  { name: 'La que ensancha el corazón',            ra: 'Ra empieza a descender; lo acompaña Horus.' },
  { name: 'Devenir y llegar a ser',                ra: 'Los dioses se alegran de la caída de Apofis.' },
  { name: 'Hora de la travesía al Campo de Juncos', ra: 'Ra cruza hacia Sejet-Iaru; lo acompaña Isis.' },
  { name: 'Bajar a la barca Sektet para cruzar',   ra: 'Ra pasa a su barca vespertina.' },
  { name: 'La que dispone las cuerdas de remolque', ra: 'Se preparan las sogas para llevar a Ra al ocaso.' },
  { name: 'Ocaso de este dios en el Occidente',    ra: 'Ra se pone por el horizonte occidental.' },
];

export const HOURS_HEADING = {
  day:   { translit: 'wnwt nt hrw', es: 'Las horas del día' },
  night: { translit: 'wnwt nt grḥ', es: 'Las horas de la noche' },
};

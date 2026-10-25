<div align="center">
<img width="1200" height="475" alt="Horologium Romanam Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Horologium Romanam

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-009688?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

**Español** | [Latine](README.la.md)

---

> [!TIP]
> **Página de Prueba:** Puedes ver la aplicación en funcionamiento y probar las últimas actualizaciones en: [ekult.co.uk/r/](https://ekult.co.uk/r/)

---

</div>

---

**Horologium Romanam** es una aplicación web inmersiva de alta fidelidad que recrea la percepción del tiempo de las grandes civilizaciones del Mediterráneo antiguo. Utiliza algoritmos astronómicos precisos para transformar el tiempo moderno en los sistemas de **horas temporales**,  donde el día y la noche se rigen por ritmos solares y estelares orgánicos.

## 🏛️ Características Destacadas

### 🌍 Civilizaciones (Multimodal)
- **Rome (Fasti Romani)**: Sistema clásico con Calendas, Nonas e Idus (incluido el *bis sextum* de los años bisiestos y el calendario juliano para fechas anteriores a 1582), ciclo de nundinas y año *Ab Urbe Condita*.
- **Hellas (Chronos)**: Calendario Ático completo con meses lunares (el día empieza al ocaso y cada mes con la primera luna creciente visible desde tu ubicación), sistema de tres décadas visuales, festivales con mitos fundacionales (Aition) validados contra fuentes académicas (Parke 1977, Deubner 1932, Mikalson 1975), y alertas de días nefastos (Apaphrades).
- **Aegyptus (Horus)**: Calendario Alejandrino/Copto con estaciones (Akhet, Peret, Shemu), hemerología "Buenos/Malos", ciclo de Algol (Ojo de Horus), entronización de Apis, 27 festivales del calendario civil y lunar validados contra fuentes académicas (El-Sabban 2000, Bleeker 1967, von Lieven 2007), **salida helíaca de Sopdet** (Sirio) y **Nilómetro dinámico** con niveles históricos. Cada fiesta incluye un panel desplegable con el capítulo correspondiente del **Libro de los Muertos** (Recensión Tebana, papiro de Ani, Nu y Nebseni) cuando la fuente lo permite; la **Sala de la Doble Maāti** presenta los 42 Evaluadores de la Confesión Negativa (Capítulo CXXV, papiro de Nebseni).
- **Babylonia (Ishtar)**: Calendario lunisolar babilónico con Era Seléucida, meses Nisannu–Addaru que empiezan al ocaso con la primera luna creciente visible desde tu ubicación, ciclo metónico de intercalación, guardia nocturna (maṣṣartu), días sagrados (Šapaṭu/día 15) y friso decorativo de la Puerta de Ishtar. Los términos y encabezados acadios (días, meses, deidades, planetas, guardias, horas) llevan su traducción al español en letra menor. Los **festivales y rituales del calendario lunisolar** —validados contra fuentes académicas (Cohen 1993, Linssen 2004, Thureau-Dangin 1921)— aparecen como puntos verdes en el calendario mensual; al tocarlos se despliega la descripción del rito y, cuando existe fuente primaria, un panel colapsable con el fragmento original en español (Enūma Eliš, Ritual de Humillación Real, Descenso de Ištar, himnos nupciales de Inanna, Maqlu). El botón **«𒀭 Ver Próximos Festivales»** muestra los próximos eventos del calendario sagrado.
- **Zhongguo (中国)**: Calendario lunisolar chino con los 24 Términos Solares (二十四节气), las Doce Ramas Terrestres (地支) como marco de horas, el ciclo sexagesimal (干支) del año, el mes y el día lunares (calculados en hora de China, UTC+8), el zodíaco de los 12 animales y la rueda del ciclo sexagenario del año.

### 🎨 Experiencia Visual y Estética
- **Diseño Mobile-First**: Barra de navegación inferior persistente para cambios rápidos de cultura y selector de tema dinámico optimizado para móviles.
- **Dualitas Thematis**: Soporte para modo oscuro profundo y un **Modo Pergamino** (claro) que evoca manuscritos antiguos.
- **Skyline Procedural**: Fondos dinámicos que generan templos romanos, acrópolis griegas, obeliscos egipcios o ziggurats babilónicos según la civilización activa.
- **Cielos Astronómicos**: Escenas nocturnas por civilización con posiciones reales de estrellas y Luna y efectos meteorológicos dinámicos (lluvia, nieve, niebla).
- **Mapa Estelar Egipcio (360°)**: El cielo del encabezado egipcio es un panorama arrastrable de todo el horizonte, calculado para la ubicación y la hora (también en el viaje temporal). Muestra Sopdet (Sirio), el Ojo de Horus (Algol, atenuado durante su eclipse), Sah (Orión), Meskhetyu (la Osa Mayor), el cuerpo de Nut (Vía Láctea), Iah (la Luna con su fase real), Ra y los cinco planetas, cada uno con un pictograma distintivo —Seba-dja radiante, Hor-desher rojo, Hor-tash-tawy con bandas, Hor-ka-pet con anillo— y su nombre egipcio. Un botón alterna con el **cielo completo** (2851 estrellas hasta magnitud 5.5); de día solo quedan el Sol y los planetas, con transición en el crepúsculo.
- **Mapa del Imperio Romano**: En Roma, la tarjeta de la provincia abre un mapa del Imperio en el 117 d.C. (provincias, unas 8000 ciudades, ríos, lagos y limes) que funciona sin conexión, también en Android; al tocar una ciudad se elige como ubicación. La capa **Viae**, que se puede activar y desactivar, dibuja las 14 769 calzadas de Itiner-e. Las vías principales son más gruesas que las secundarias, las conjeturales más claras y las hipotéticas punteadas. Los nombres latinos (*Via Appia*, *Via Egnatia*…) aparecen a lo largo del trazado. Al tocar una calzada se abre una ficha en latín: tramo, tipo, certeza, datación, constructor, longitud en millas romanas, itinerarios antiguos y fuentes. En el viaje temporal solo se muestran las calzadas datadas que existían en esa fecha, y las no datadas aparecen atenuadas. La ficha incluye además un deslizador *Iter per tempora* para recorrer los siglos solo en el mapa.
- **Accesibilidad WCAG AA**: Diseño optimizado para alta legibilidad con contrastes auditados y tipografía premium.

### 🕰️ Cronometría y Astronomía Avanzada
- **Temporis Exactio**: Cálculo en tiempo real de *Horae* (día) y *Vigiliae* (noche) basado en la latitud/longitud exacta.
- **Ojo de Horus (Algol)**: Seguimiento en tiempo real de la estrella variable Algol (2.86 días), codificada como las acciones de Horus en el Papiro de El Cairo 86637.
- **Rector Horae**: Identificación del regente planetario de cada hora según el orden caldeo. La hora en curso muestra el consejo clásico (latín o griego) y su traducción al español, extraídos de *Anthologiarum libri* de Vettius Valens (s. II d.C.).
- **Parapegma**: Calendario astronómico de ortos y ocasos de estrellas fijas con sus asociaciones meteorológicas, integrado en el panel de horas planetarias para Roma y Grecia.
- **Nilómetro Histórico**: Modelo hidrológico mes a mes que recrea visualmente el ciclo anual del Nilo (desde la inundación máxima en Phaophi hasta el estiaje en Epiphi).
- **Términos Solares Chinos**: Los 24 jié qì representados como ciclo de año con estado actual, siguiente término y pentagrama de la pentada actual.
- **Viaje Temporal**: Selector de fecha que muestra el calendario anual completo de cada cultura y numera los años según su propia era —la Olimpiada griega, el ciclo sótico egipcio (orto helíaco de Sopdet) y la Era Seléucida babilónica—; Roma y China conservan el selector gregoriano.
- **Previsión de Eclipses**: Widget con ilustraciones SVG y efemérides astronómicas reales de eclipses solares y lunares.

### 🔮 Sabiduría y Adivinación Antigua
- **Hemerología Egipcia**: Sistema de días "Buenos y Malos" (*Nefer* y *Aha*) basado en el Papiro de El Cairo 86637.
- **Libro de los Muertos**: Los festivales egipcios del calendario civil y lunar enlazan con el capítulo pertinente de la Recensión Tebana (papiro de Ani, Nu, Nebseni). La **Sala de la Doble Maāti** presenta los 42 Evaluadores de la Confesión Negativa (Capítulo CXXV).
- **Textos Sacros Babilónicos**: Los festivales del calendario babilónico enlazan con el fragmento primario del rito: el *Enūma Eliš* (la epopeya de la creación recitada en el Akītu), el Ritual de Humillación Real de las tablillas DT.109+MNB.1848, el *Descenso de Ištar al País Sin Retorno*, los himnos nupciales de Inanna y el exorcismo *Maqlu*.
- **Sortes Vergilianae**: Herramienta de adivinación clásica integrada utilizando fragmentos de la Eneida.
- **Sententiae & Apophthegmata**: Sabiduría diaria en Latín, Griego y Egipcio Antiguo, con transliteraciones y traducciones.

### 📱 Tecnología y Movilidad
- **PWA (Progressive Web App)**: Instalable en escritorio y móviles con soporte offline completo gracias a Service Workers.
- **Capacitor Integration**: Optimizado para Android con integración nativa (ocultación de barra de estado, splash screens).
- **Geolocalización Inteligente**: Localización automática o selección manual mediante un buscador global de ciudades.

## 🛠️ Stack Tecnológico

- **Core**: React 19, TypeScript 5.8.
- **Styling**: Tailwind CSS 4 (motor de alto rendimiento).
- **Build Tool**: Vite 6 con soporte PWA.
- **Mobile**: Capacitor 8 para empaquetado nativo en Android.
- **Geometría**: SVG dinámicos para el reloj y el skyline procedimental; Canvas 2D para el mapa estelar egipcio y el mapa del Imperio Romano.
- **Cálculo**: Algoritmos astronómicos de precisión para fases lunares y ciclos estelares ([astronomy-engine](https://github.com/cosinekitty/astronomy)).
- **Datos estelares**: Catálogo de Estrellas Brillantes de Yale, vía [d3-celestial](https://github.com/ofrohn/d3-celestial) (BSD-3-Clause).
- **Mapa romano**: Digital Atlas of the Roman Empire (DARE), vía [klokantech/roman-empire](https://github.com/klokantech/roman-empire).
- **Calzadas romanas**: [Itiner-e](https://itiner-e.org/), versión estática 2024 (de Soto, Pažout, Brughmans et al., *Scientific Data* 2025, [doi:10.5281/zenodo.17122148](https://doi.org/10.5281/zenodo.17122148)), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Los trazados se han simplificado con `scripts/buildRomanRoads.ts`.

## 🚀 Instalación y Desarrollo

1. **Clonación**:
   ```bash
   git clone https://github.com/jropero/horologium.git
   cd horologium
   ```

2. **Dependencias**:
   ```bash
   npm install
   ```

3. **Desarrollo Local**:
   ```bash
   npm run dev
   ```

### 📦 Compilación y Despliegue

El proyecto cuenta con un sistema de compilación dual para resolver los conflictos de rutas entre la PWA en subdirectorios y la app nativa:

- **Para Web (PWA)**:
  Compila utilizando rutas absolutas (ideal para subcarpetas como `/r/`):
  ```bash
  npm run build
  ```

- **Para Android (Capacitor)**:
  Compila utilizando rutas relativas (`base: './'`), requisito indispensable para que Capacitor cargue los recursos locales:
  ```bash
  npm run build:cap
  npx cap copy android
  npx cap run android
  ```

## 🏛️ Filosofía del Proyecto

> "Relinque temporis angustias, ad maiora natus es."

Este proyecto no es solo un reloj; es un puente hacia una cosmovisión donde el tiempo no era una medida rígida de oficina, sino un ritmo orgánico dictado por el sol, las estrellas y la herencia de las civilizaciones que forjaron el mundo.

---

*Desarrollado con dedicación histórica y excelencia técnica.*


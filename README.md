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
- **Rome (Fasti Romani)**: Sistema clásico con Calendas, Nonas e Idus, ciclo de nundinas y año *Ab Urbe Condita*.
- **Hellas (Chronos)**: Calendario Ático completo con meses lunares, sistema de tres décadas visuales, festivales con mitos fundacionales (Aition) y alertas de días nefastos (Apaphrades).
- **Aegyptus (Horus)**: Calendario Alejandrino/Copto con estaciones (Akhet, Peret, Shemu), hemerología "Buenos/Malos", ciclo de Algol (Ojo de Horus), entronización de Apis, festivales sagrados y **Nilómetro dinámico** con niveles históricos.

### 🎨 Experiencia Visual y Estética
- **Diseño Mobile-First**: Barra de navegación inferior persistente para cambios rápidos de cultura y selector de tema dinámico optimizado para móviles.
- **Dualitas Thematis**: Soporte para modo oscuro profundo y un **Modo Pergamino** (claro) que evoca manuscritos antiguos.
- **Skyline Procedural**: Fondos dinámicos que generan templos romanos, acrópolis griegas u obeliscos egipcios según la civilización activa.
- **Accesibilidad WCAG AA**: Diseño optimizado para alta legibilidad con contrastes auditados y tipografía premium.

### 🕰️ Cronometría y Astronomía Avanzada
- **Temporis Exactio**: Cálculo en tiempo real de *Horae* (día) y *Vigiliae* (noche) basado en la latitud/longitud exacta.
- **Ojo de Horus (Algol)**: Seguimiento en tiempo real de la estrella variable Algol (2.86 días), codificada como las acciones de Horus en el Papiro de El Cairo 86637.
- **Rector Horae**: Identificación del regente planetario de cada hora según el orden caldeo.
- **Nilómetro Histórico**: Modelo hidrológico mes a mes que recrea visualmente el ciclo anual del Nilo (desde la inundación máxima en Phaophi hasta el estiaje en Epiphi).

### 🔮 Sabiduría y Adivinación Antigua
- **Hemerología Egipcia**: Sistema de días "Buenos y Malos" (*Nefer* y *Aha*) basado en el Papiro de El Cairo 86637.
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
- **Geometría**: SVG dinámicos para el reloj y el skyline procedimental.
- **Cálculo**: Algoritmos astronómicos de precisión para fases lunares y ciclos estelares.

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


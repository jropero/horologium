<div align="center">
<img width="1200" height="475" alt="Horologium Romanam Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Horologium Romanam

**Español** | [Latine](README.la.md)

**Horologium Romanam** es una aplicación web inmersiva que recrea la experiencia de medir el tiempo tal y como lo hacían los antiguos romanos. A diferencia del tiempo moderno, el sistema romano se basaba en el ciclo solar, dividiendo el día y la noche en 12 horas de duración variable según la estación del año.

## ✨ Características Principales

- 🕰️ **Reloj de Horas Temporales**: Visualización del tiempo romano en tiempo real, con la división clásica entre *Horae* (día) y *Vigiliae* (noche).
- 📅 **Calendario Romano Dinámico**: Muestra la fecha actual siguiendo el sistema de Calendas, Nonas e Idus, incluyendo el año *Ab Urbe Condita* (A.U.C.).
- 🪐 **Rector Horae (Regente Planetario)**: Cálculo automático del regente de la hora actual basado en el orden de los caldeos (Saturno, Júpiter, Marte, Sol, Venus, Mercurio, Luna).
- 📜 **Efemérides (Res Gestae)**: Información histórica sobre eventos significativos ocurridos en la fecha actual a lo largo de la historia de Roma.
- 🌓 **Fases Lunares**: Seguimiento de la fase lunar actual con terminología latina (*Novilunium*, *Plenilunium*, etc.).
- 🌦️ **Clima en Latín**: Integración con servicios meteorológicos locales para mostrar el tiempo actual con descripciones poéticas en latín.
- 🖋️ **Sententia Diei**: Una cita clásica diaria para inspirar la jornada.

## 🛠️ Detalles Técnicos

El proyecto está construido con tecnologías modernas para garantizar una experiencia fluida y visualmente atractiva:

- **React 19 & TypeScript**: Lógica de aplicación robusta y tipado seguro.
- **Vite**: Herramienta de construcción ultrarrápida.
- **Lucide React**: Iconografía elegante y minimalista.
- **Algoritmos Solares**: Cálculos precisos de salida y puesta de sol basados en coordenadas geográficas para determinar la duración exacta de las horas temporales.
- **Open-Meteo API**: Datos climáticos en tiempo real sin necesidad de claves de API complejas.

## 🚀 Ejecución Local

Sigue estos pasos para ejecutar el proyecto en tu máquina:

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/horologium-romanam.git
   cd horologium-romanam
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configuración (Opcional):**
   Crea un archivo `.env.local` si deseas configurar variables de entorno adicionales, aunque el proyecto funciona por defecto con los valores predeterminados.

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## 🏛️ Inspiración y Filosofía

Esta herramienta nace del deseo de reconectar con la percepción clásica del tiempo, donde el ritmo de la vida estaba intrínsecamente ligado a la luz solar y al cosmos. "Ad astra per aspera".

---

*Desarrollado con pasión por la historia y la tecnología.*

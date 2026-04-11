/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'ink': '#1a1a1a',
        'gold-leaf': '#cfb53b',
        'gold-dim': '#8a7826',
        'parchment': '#e3d6b3',
        'parchment-dark': '#c9b993',
        'midnight': '#0f172a',
        'woodcut-green': '#4a5d43',
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        body: ['IM Fell English', 'serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/assets/textures/aged-paper.png')",
        'stardust': "url('/assets/textures/stardust.png')",
        'wood-pattern': "url('/assets/textures/wood-pattern.png')",
      }
    },
  },
  plugins: [],
}

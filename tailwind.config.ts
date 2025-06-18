import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',

  // THIS IS THE CORRECTED SECTION
  theme: {
    colors: {
      // By defining colors here (not in extend), we replace the default palette.
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      accent: 'rgb(var(--color-accent) / <alpha-value>)',
      'accent-secondary': 'rgb(var(--color-accent-secondary) / <alpha-value>)',
      base: 'rgb(var(--color-base) / <alpha-value>)',

      // It's good practice to also add transparent, current, and white
      // if you replace the whole palette.
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
    },
  },

  plugins: [],
}

export default config
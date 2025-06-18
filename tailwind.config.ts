// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  // The entire 'theme' object is removed.
  plugins: [],
}

export default config
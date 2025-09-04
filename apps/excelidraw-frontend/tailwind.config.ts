import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
     './public/**/*.{js,ts,jsx,tsx}',
     './screen/**/*.{js,ts,jsx,tsx}'

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config

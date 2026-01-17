import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#3b82f6',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #0f172a, #1e293b)',
      },
    },
  },
  plugins: [],
}
export default config


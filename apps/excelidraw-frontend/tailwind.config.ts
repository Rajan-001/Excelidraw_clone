/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',        // App Router (Next.js)
    './pages/**/*.{js,ts,jsx,tsx}',      // Pages Router
    './components/**/*.{js,ts,jsx,tsx}', // Local components
     '../../packages/ui/*.{js,ts,jsx,tsx}', // Shared packages (like @ui)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

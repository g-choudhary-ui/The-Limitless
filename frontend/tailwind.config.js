/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dusty Pink Palette (from user color swatches #D4B2A9 / #C88D88 / #BE726F)
        brand: {
          50: '#faf4f3',
          100: '#f5e8e6',
          200: '#eed4d0',
          300: '#e2b9b4',
          400: '#d39994',
          500: '#bf7a75',
          600: '#a8615c',
          700: '#8c4e4a',
          800: '#75423f',
          900: '#633937',
          950: '#371d1c',
        },
        // Warm Beige & Sand Palette (from user swatches #EDEAE3 / #E8D7C6 / #CFC5C3)
        beige: {
          50: '#fcfaf7',
          100: '#f7f2ea',
          200: '#efe6d8',
          300: '#e2d2be',
          400: '#cfb89c',
          500: '#bda081',
          600: '#a68666',
          700: '#86684e',
          800: '#6e5541',
          900: '#5a4536',
          950: '#30241b',
        },
        // Soft Terracotta & Rose Sand Highlights
        electric: {
          400: '#e3a893',
          500: '#d48b72',
          600: '#bd7157',
        },
        surface: {
          light: '#f9f6f0',
          card: '#ffffff',
          dark: '#1a1515',
          darkcard: '#241d1d',
          darkborder: '#3a2f2e'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}

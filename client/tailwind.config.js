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
        cream: {
          50: '#FDFCF7',
          100: '#FAF7EE',
          200: '#F5EEDC',
          300: '#EFE2C5',
          400: '#E3CCA1',
          500: '#D5B47B',
        },
        blush: {
          50: '#FDF6F6',
          100: '#FBECEE',
          200: '#F7D8DC',
          300: '#F0B8C1',
          400: '#E68CA0',
          500: '#D96582',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6ECE6',
          200: '#CFDBCF',
          300: '#ABC2AC',
          400: '#84A485',
          500: '#648766',
          600: '#4D6B4E',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


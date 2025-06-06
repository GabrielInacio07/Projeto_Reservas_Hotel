/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'hotel-blue': '#1E3A8A',
        'hotel-gold': '#D4AF37',
        'hotel-beige': '#F5F5DC',
        'hotel-gray': '#E5E7EB',
      },
      fontFamily: {
        'hotel': ['"Playfair Display"', 'serif'], // Usando Playfair Display conforme _document.js
      },
      animation: {
        'bounce-once': 'bounce 1s ease-in-out 1', // Animação que ocorre apenas uma vez
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
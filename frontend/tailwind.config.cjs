/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['system-ui', 'sans-serif']
      },
      colors: {
        love: {
          pink: '#ff4b8b',
          purple: '#8b5cf6',
          gold: '#fbbf24'
        }
      }
    }
  },
  plugins: []
};


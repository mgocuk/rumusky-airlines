/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#12253E',
          blue: '#1E5B70',
          cyan: '#D2A54E',
          gold: '#C49238',
          goldLight: '#FBF4E4',
          ivory: '#F4ECDC',
          bg: '#FAF6EE',
          surface: '#FFFFFF',
          text: '#1A2D45',
          muted: '#655D50',
          border: '#E6D8BD'
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        'card': '14px'
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(133, 98, 34, 0.07)',
        'elevated': '0 10px 30px -5px rgba(18, 37, 62, 0.09)'
      }
    },
  },
  plugins: [],
}

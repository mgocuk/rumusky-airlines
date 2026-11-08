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
          navy: '#0B2545',
          blue: '#0D6EFD',
          cyan: '#00B4DB',
          bg: '#F4F8FC',
          surface: '#FFFFFF',
          text: '#172B49',
          muted: '#5C6B7A',
          border: '#DCE5EF'
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
        'subtle': '0 4px 20px -2px rgba(11, 37, 69, 0.06)',
        'elevated': '0 10px 30px -5px rgba(11, 37, 69, 0.1)'
      }
    },
  },
  plugins: [],
}

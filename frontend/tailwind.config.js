/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sv: {
          brown: '#8B6969',
          tan: '#D2B48C',
          wheat: '#F5DEB3',
          pale: '#EEE8AA',
          cream: '#F0EAD6',
          background: '#F3F4F6'
        }
      }
    },
  },
  plugins: [],
}
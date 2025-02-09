const {heroui} = require("@heroui/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['Roboto','sans-serif'],
        poppins:['Poppins','sans-serif'],
      },
      colors: {
        primary: '#1884FF',
        secondary: '#f1c40f',
        dark: '#2c3e50',
        light: '#ecf0f1',
        error: '#e74c3c',
        success: '#2ecc71',
        warning: '#f1c40f',
        info: '#3498db',
        },
      darkMode: "class"
    },
  },
  plugins: [heroui()],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['Roboto','sans-serif'],
        poppins:['Poppins','sans-serif'],
      },
      colors: {
        primary: '#3498db',
        secondary: '#f1c40f',
        dark: '#2c3e50',
        light: '#ecf0f1',
        error: '#e74c3c',
        success: '#2ecc71',
        warning: '#f1c40f',
        info: '#3498db',
        },
        screens: {
          xs: "480px",
          ss: "620px",
          sm: '768px',
          md: '1060px',
          lg: '1200px',
          xl: '1700px',
        },
    },
  },
  plugins: [],
}
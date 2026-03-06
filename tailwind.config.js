/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tea: {
          dark: '#295517',  // Deep Forest Green
          light: '#99BF5E', // Fresh Leaf Green
          bg: '#F0FFE6',    // Soft Mint Background
          alert: '#C0392B', // Disease Red
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Ensure Tailwind scans your components
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
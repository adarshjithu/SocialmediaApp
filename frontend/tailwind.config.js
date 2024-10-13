/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This is correct
  ],
  theme: {
    extend: {
      screens: { // Make sure this is directly under 'extend'
        sm: '640px',  // Small screens (phones)
        md: '768px',  // Medium screens (tablets)
        lg: '1024px', // Large screens (laptops)
        xl: '1280px', // Extra large screens (desktops)
      },
    },
  },
  plugins: [],
};

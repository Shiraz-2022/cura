/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          extraLight: "#778DA920",
          light: "#778DA9",
          dark: "#01161E",
        },
        secondary: {
          light: "#FC904E",
          green: "#5D9A5C",
          blue: "#5C639A",
          purple: "#9A5C99",
          brown: "#9C4646",
          red: "#F23737",
        },
        accent: {},
        neutral: {
          light: "#E0E1DD",
          default: "#3C3F41",
          dark: "#01161E",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export const themeVars = {
  primary: {
    DEFAULT: "var(--color-primary)",
  },
  success: "var(--color-success)",
  error: "var(--color-error)",
  "white-theme": "var(--color-white-theme)",
  "black-theme": "var(--color-black-theme)",
};
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: themeVars,
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  darkMode: "selector",
};

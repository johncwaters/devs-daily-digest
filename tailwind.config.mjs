/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      primary: "#BF6C3B",
      secondary: "#F2CA99",
      background: "#BF9A78",
      green: "#13ce66",
      blue: "#011526",
    },
    fontFamily: {
      sans: ["Gnuolane", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      primary: "#BF6C3B",
      secondary: "#F2CA99",
      background: "#F2E3D0",
      black: "#00080D",
      green: "#13ce66",
      blue: "#011526",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
  },
  plugins: [],
};

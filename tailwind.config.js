/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#1A1A18",
        gold: "#C9A84C",
        bone: "#F5F0E8",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 12px 48px rgba(0, 0, 0, 0.24)",
      },
    },
  },
  plugins: [],
};

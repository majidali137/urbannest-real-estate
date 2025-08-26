/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    boxShadow: {
      "outline-orange": "0 0 0 2px rgba(255, 84, 0, 0.5)",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      "light-gray": "#6d6e6d",
      gray: "#2a2a2a",
      "gray-600": "#4d4d4d",
      "neutral-600": "#888888",
      orange: "#ff8633",
      lorange: "#ff954d",
      darkgray: "#212121",
      blue: "#057eff",
      red: "#ff0000",
      "light-red": "#ff4545",
    },
  },
  plugins: [],
};

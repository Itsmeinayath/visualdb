/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#141311",
        foreground: "#f3f0e6",
        card: "#1e1d1a",
        border: "#33312c",
        accent: {
          DEFAULT: "#e78253",
          foreground: "#141311",
        },
        muted: {
          DEFAULT: "#8c877d",
          foreground: "#a39e93",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
}

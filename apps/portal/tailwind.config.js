/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#6366f1",
        background: "#09090b",
        foreground: "#fafafa"
      }
    },
  },
  plugins: [],
}

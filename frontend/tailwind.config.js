/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAFA",
        ink: "#12161F",
        muted: "#5C6476",
        line: "#E8E9F0",
        slateink: "#0F1B2D",
        navy: { DEFAULT: "#242E48", deep: "#1F2739", soft: "#38436A" },
        peri: "#8C99CF",
        lav: "#DFDFEF",
        danger: "#B4554E",
        risk: {
          low: "#2E7D53",
          medium: "#B4801F",
          high: "#C2601F",
          critical: "#B3372F",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: { card: "28px", field: "14px" },
      boxShadow: {
        card: "0 40px 90px -50px rgba(28,38,84,.45), 0 2px 6px rgba(28,38,84,.04)",
        lift: "0 10px 22px -16px rgba(30,40,80,.6)",
        submit: "0 14px 28px -18px rgba(31,39,57,.9)",
      },
      keyframes: {
        rise: { from: { opacity: 0, transform: "translateY(14px) scale(.994)" }, to: { opacity: 1, transform: "none" } },
        fadeIn: { from: { opacity: 0, transform: "translateY(-4px)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: {
        rise: "rise .9s cubic-bezier(.16,.84,.3,1) both",
        fadeIn: "fadeIn .3s ease both",
      },
    },
  },
  plugins: [],
};

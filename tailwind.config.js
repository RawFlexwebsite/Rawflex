/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#080909",
        "cream-deep": "#121412",
        "cream-line": "#262926",
        ink: "#EAE6E2",
        emerald: {
          DEFAULT: "#F2EFEA",
          soft: "#9A958D",
          deep: "#0C0E0D",
        },
        gold: {
          DEFAULT: "#C7B79E",
          light: "#E4D8C4",
          pale: "#F0E9DC",
        },
        rose: {
          DEFAULT: "#D09A84",
          soft: "#E2B9A8",
        },
        panel: "#141614",
        panel2: "#1A1D1B",
        orange: {
          50: "#141614",   // dark panel
          100: "#262926",  // dark line
          200: "#C7B79E",  // gold DEFAULT
          400: "#E4D8C4",  // gold light
          500: "#F2EFEA",  // emerald DEFAULT
          600: "#C9C4BC",  // muted accent
          700: "#8E8981",  // dim accent
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      maxWidth: {
        wrap: "1400px",
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(0, 0, 0, 0.6)",
        card: "0 14px 34px -16px rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1400" },
          "100%": { strokeDashoffset: "0" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(.22,1,.36,1) forwards",
        drawLine: "drawLine 2.6s cubic-bezier(.22,1,.36,1) forwards",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        shimmer: "shimmer 6s ease-in-out infinite alternate",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

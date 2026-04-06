/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf7ff", 100: "#f3edff", 200: "#e9deff",
          300: "#d4bfff", 400: "#b794f6", 500: "#9b6deb",
          600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95"
        },
        accent: {
          50: "#fff1f6", 100: "#ffe4ed", 200: "#ffcede",
          300: "#ffa3c4", 400: "#ff6fa3", 500: "#f43f7a",
          600: "#e11d5c", 700: "#be1850"
        },
        warm: {
          50: "#fffbf5", 100: "#fff5e6", 200: "#ffe8c7",
          300: "#ffd49b", 400: "#ffb85c", 500: "#f99a2e"
        },
        sage: {
          50: "#f4faf4", 100: "#e6f5e7", 200: "#ceebd0",
          300: "#a5d7aa", 400: "#74bc7b", 500: "#50a058"
        },
        surface: {
          0:   "#ffffff",
          50:  "#f9f9f9",
          100: "#f3f3f3",
          200: "#e8e8e8",
          300: "#d1d1d1",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "system-ui", "sans-serif"],
        body:    ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text",    "system-ui", "sans-serif"],
        sans:    ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        sm:   "8px",
        DEFAULT: "8px",
        md:   "12px",
        lg:   "12px",
        xl:   "12px",
        "2xl": "16px",
        "3xl": "20px",
        full: "9999px",
      },
      boxShadow: {
        soft:     "0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
        card:     "0 1px 3px rgba(0,0,0,0.05)",
        glow:     "0 4px 20px -4px rgba(124,58,237,0.28)",
        "glow-lg":"0 8px 32px -8px rgba(124,58,237,0.32)",
        elevated: "0 8px 32px -8px rgba(0,0,0,0.10)",
        focus:    "0 0 0 3px rgba(124,58,237,0.15)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease-out forwards",
        "slide-in":   "slideIn 0.4s ease-out",
        float:        "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideIn:   { "0%": { opacity: 0, transform: "translateX(-8px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        float:     { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulseGlow: { "0%,100%": { boxShadow: "0 0 8px rgba(124,58,237,0.25)" }, "50%": { boxShadow: "0 0 20px rgba(124,58,237,0.45)" } },
      },
    },
  },
  plugins: [],
};

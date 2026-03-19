import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50:  "#fdf2f4",
          100: "#fce7eb",
          200: "#f8d0d9",
          300: "#f3aab8",
          400: "#eb7a92",
          500: "#df506e",
          600: "#cc3054",
          700: "#ab2144",
          800: "#8f1e3d",
          900: "#6e1a32",
          950: "#470d1e",
        },
        burgundy: {
          DEFAULT: "#4B0E23",
          dark:    "#2D0614",
          deep:    "#3A0B1C",
        },
        plum: {
          DEFAULT: "#5C1A3A",
          dark:    "#3D0F27",
        },
        gold: {
          light:   "#F5E6C8",
          DEFAULT: "#D4AF37",
          dark:    "#B8962E",
          muted:   "#C9A84C",
        },
      },
      fontFamily: {
        serif:      ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans:       ["var(--font-cormorant-sc)", "Cormorant SC", "serif"],
        body:       ["var(--font-jost)", "Jost", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #F5E6C8 0%, #D4AF37 50%, #B8962E 100%)",
        "wine-gradient":
          "linear-gradient(135deg, #2D0614 0%, #4B0E23 40%, #5C1A3A 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #1A0509 0%, #2D0614 50%, #3A0B1C 100%)",
      },
      boxShadow: {
        gold:    "0 0 30px rgba(212, 175, 55, 0.15)",
        "gold-lg": "0 0 60px rgba(212, 175, 55, 0.25)",
        luxury:  "0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.15)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        shimmer:      "shimmer 2s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,175,55,0.2)" },
          "50%":      { boxShadow: "0 0 40px rgba(212,175,55,0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

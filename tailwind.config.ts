import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep space / quantum dark base
        void: {
          950: "#05070d",
          900: "#0a0e1a",
          800: "#0f1524",
          700: "#161d31",
          600: "#1f2740",
        },
        // Energetic accents
        quantum: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          green: "#34f5a0",
          violet: "#a855f7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(34, 211, 238, 0.35)",
        "glow-lg": "0 0 40px rgba(34, 211, 238, 0.45)",
        "glow-green": "0 0 24px rgba(52, 245, 160, 0.4)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.4)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        shimmer: "shimmer 2s infinite",
      },
      backgroundImage: {
        "grid-quantum":
          "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;

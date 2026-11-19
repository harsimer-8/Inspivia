import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "forest-green": "var(--color-forest-green)",
        "moss-green": "var(--color-moss-green)",
        beige: "var(--color-beige)",
        "rosy-brown": "var(--color-rosy-brown)",
        "midnight-green": "var(--color-midnight-green)",
        // Aliases for convenience
        forest: "var(--color-forest-green)",
        moss: "var(--color-moss-green)",
        rosy: "var(--color-rosy-brown)",
        midnight: "var(--color-midnight-green)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-syne)", "var(--font-manrope)", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 28s linear infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

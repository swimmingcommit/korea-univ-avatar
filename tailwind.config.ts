import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: "#7A1626",
          light: "#A63D4F",
          dark: "#540E19",
          soft: "#F5EBE1",
        },
        cream: {
          DEFAULT: "#FAF6EE",
          paper: "#F5EFE6",
          dark: "#EDE4D8",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#DFC053",
          dark: "#9E7E17",
        },
        ink: {
          DEFAULT: "#1F1B18",
          light: "#4A453F",
          muted: "#7A746E",
        },
        ku: {
          crimson: "#7A1626",
          light: "#A63D4F",
          dark: "#540E19",
          cream: "#FAF6EE",
          gold: "#C9A227",
          ink: "#1F1B18",
          soft: "#F5EBE1",
          gray: "#7A746E",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "sans-serif"],
        display: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "sans-serif"],
      },
      lineHeight: {
        title: "1.35",
        body: "1.6",
      },
      animation: {
        "float-slow": "float 4s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 2.5s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.92", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

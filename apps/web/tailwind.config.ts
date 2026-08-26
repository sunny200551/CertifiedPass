import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#05070D",
          surface: "#0B0F1A",
          elevated: "#121826",
        },
        accent: {
          cyan: "#22D3EE",
          blue: "#3B82F6",
          violet: "#7C6BFF",
        },
        status: {
          verified: "#34D399",
          invalid: "#F87171",
          revoked: "#FB923C",
          pending: "#94A3B8",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "General Sans", "system-ui", "sans-serif"],
        body: ["Inter", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "cta-glow": "0 0 24px rgba(34, 211, 238, 0.25)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.40)",
        "verified-glow": "0 0 16px rgba(52, 211, 153, 0.35)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

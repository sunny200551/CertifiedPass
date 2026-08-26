import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#FBFBFD",
          surface: "#FFFFFF",
          elevated: "#F5F5F7",
        },
        slate: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        accent: {
          cyan: "#0EA5E9",
          blue: "#2563EB",
          indigo: "#4F46E5",
          purple: "#7C3AED",
        },
        status: {
          verified: "#10B981",
          invalid: "#EF4444",
          revoked: "#F59E0B",
          pending: "#64748B",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "-apple-system", "BlinkMacSystemFont", "Inter", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "monospace"],
      },
      boxShadow: {
        "apple-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "apple-md": "0 8px 24px -4px rgba(0, 0, 0, 0.07), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        "apple-lg": "0 20px 40px -8px rgba(0, 0, 0, 0.10), 0 8px 16px -4px rgba(0, 0, 0, 0.05)",
        "pass-glow": "0 12px 36px -6px rgba(79, 70, 229, 0.12), 0 4px 16px -2px rgba(14, 165, 233, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

/**
 * CertifiedPass Design Tokens — Tailwind CSS Preset
 *
 * Extend your Tailwind config with this preset to get all design token
 * values as Tailwind utilities.
 *
 * Usage in tailwind.config.ts:
 *   import preset from '@certifiedpass/design-tokens/tailwind-preset'
 *   export default { presets: [preset], ... }
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // Colors
      // -----------------------------------------------------------------------
      colors: {
        bg: {
          primary:  "#05070D",
          surface:  "#0B0F1A",
          elevated: "#121826",
        },
        border: {
          subtle: "#1E2536",
        },
        text: {
          primary:   "#F5F7FA",
          secondary: "#9AA4B8",
          muted:     "#4A5568",
        },
        accent: {
          cyan:   "#22D3EE",
          blue:   "#3B82F6",
          violet: "#7C6BFF",
        },
        status: {
          verified: "#34D399",
          invalid:  "#F87171",
          revoked:  "#FB923C",
          pending:  "#94A3B8",
        },
      },

      // -----------------------------------------------------------------------
      // Background
      // -----------------------------------------------------------------------
      backgroundColor: {
        "bg-primary":  "#05070D",
        "bg-surface":  "#0B0F1A",
        "bg-elevated": "#121826",
      },

      // -----------------------------------------------------------------------
      // Typography
      // -----------------------------------------------------------------------
      fontFamily: {
        display: ["Space Grotesk", "General Sans", "system-ui", "sans-serif"],
        body:    ["Inter", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "hero":    ["clamp(48px, 6vw, 72px)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display": ["clamp(40px, 4vw, 56px)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "h2":      ["clamp(28px, 3vw, 40px)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "h3":      ["24px",                    { lineHeight: "1.3" }],
        "h4":      ["20px",                    { lineHeight: "1.4" }],
        "body-lg": ["18px",                    { lineHeight: "1.7" }],
        "body":    ["16px",                    { lineHeight: "1.5" }],
        "body-sm": ["14px",                    { lineHeight: "1.5" }],
        "label":   ["12px",                    { lineHeight: "1.5", letterSpacing: "0.08em" }],
        "micro":   ["11px",                    { lineHeight: "1.5" }],
      },

      // -----------------------------------------------------------------------
      // Spacing
      // -----------------------------------------------------------------------
      spacing: {
        "1":  "4px",
        "2":  "8px",
        "3":  "12px",
        "4":  "16px",
        "5":  "20px",
        "6":  "24px",
        "8":  "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },

      // -----------------------------------------------------------------------
      // Border radius
      // -----------------------------------------------------------------------
      borderRadius: {
        sm:   "6px",
        md:   "10px",
        lg:   "12px",
        xl:   "16px",
        "2xl":"20px",
        full: "9999px",
      },

      // -----------------------------------------------------------------------
      // Box shadows
      // -----------------------------------------------------------------------
      boxShadow: {
        "cta-glow":      "0 0 24px rgba(34, 211, 238, 0.25)",
        "card-hover":    "0 8px 32px rgba(0, 0, 0, 0.40)",
        "verified-glow": "0 0 16px rgba(52, 211, 153, 0.35)",
        "focus-default": "0 0 0 2px rgba(34, 211, 238, 0.40)",
        "focus-ai":      "0 0 0 2px rgba(124, 107, 255, 0.50)",
      },

      // -----------------------------------------------------------------------
      // Background gradients (via backgroundImage)
      // -----------------------------------------------------------------------
      backgroundImage: {
        "gradient-cta":
          "linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)",
        "gradient-hero-glow":
          "radial-gradient(ellipse at 60% 40%, rgba(34,211,238,0.10) 0%, rgba(59,130,246,0.08) 50%, transparent 80%)",
        "gradient-card-glow":
          "radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.06) 0%, transparent 70%)",
      },

      // -----------------------------------------------------------------------
      // Animation durations (extend rather than replace Tailwind defaults)
      // -----------------------------------------------------------------------
      transitionDuration: {
        fast:     "150ms",
        normal:   "200ms",
        moderate: "300ms",
        slow:     "600ms",
      },
      transitionTimingFunction: {
        "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1.0)",
        "ease-press":  "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
      },

      // -----------------------------------------------------------------------
      // Z-index scale
      // -----------------------------------------------------------------------
      zIndex: {
        base:    "0",
        card:    "10",
        overlay: "100",
        nav:     "200",
        modal:   "300",
        toast:   "400",
        tooltip: "500",
      },
    },
  },
  plugins: [],
};

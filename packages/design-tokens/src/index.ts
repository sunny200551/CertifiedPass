/**
 * CertifiedPass Design Tokens — TypeScript export
 *
 * Use these typed constants in Three.js / Framer Motion / animation configs
 * where CSS custom properties aren't accessible (canvas, JS animations).
 */

// ---------------------------------------------------------------------------
// Colors — raw hex values as typed constants
// ---------------------------------------------------------------------------

export const colors = {
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
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  fonts: {
    display: "'Space Grotesk', 'General Sans', system-ui, sans-serif",
    body:    "'Inter', 'IBM Plex Sans', system-ui, sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', monospace",
  },
} as const;

// ---------------------------------------------------------------------------
// Motion — durations in milliseconds (for use in JS animations)
// ---------------------------------------------------------------------------

export const motion = {
  duration: {
    instant:  0,
    fast:     150,
    normal:   200,
    moderate: 300,
    slow:     600,
    seal:     1400,
    float:    4000,
  },
  easing: {
    linear:   "linear",
    easeOut:  [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
    easeIn:   [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
    easeInOut:[0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
    spring:   [0.34, 1.56, 0.64, 1.0] as [number, number, number, number],
  },
} as const;

// ---------------------------------------------------------------------------
// Three.js helpers — hex → Three.Color-compatible values
// ---------------------------------------------------------------------------

/** Convert a hex color string to a numeric value for Three.js Color */
export function hexToThreeColor(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

/** Accent cyan as Three.js color number */
export const THREE_ACCENT_CYAN = hexToThreeColor(colors.accent.cyan);
/** Accent blue as Three.js color number */
export const THREE_ACCENT_BLUE = hexToThreeColor(colors.accent.blue);
/** Status verified as Three.js color number */
export const THREE_STATUS_VERIFIED = hexToThreeColor(colors.status.verified);
/** Status invalid as Three.js color number */
export const THREE_STATUS_INVALID = hexToThreeColor(colors.status.invalid);
/** Status revoked as Three.js color number */
export const THREE_STATUS_REVOKED = hexToThreeColor(colors.status.revoked);

// ---------------------------------------------------------------------------
// Reduced motion detection
// ---------------------------------------------------------------------------

/**
 * Returns true if the user prefers reduced motion.
 * Always check this before running Three.js / Framer Motion animations.
 * Falls back to false in SSR contexts.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Returns an animation duration in milliseconds, collapsing to 0 if
 * the user prefers reduced motion.
 */
export function safeDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}

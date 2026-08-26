# CertifiedPass — Design System Reference

> Source of truth: [`packages/design-tokens/`](../packages/design-tokens/)

---

## Philosophy (§20.1)

**Minimalist-interactive, not maximalist-decorative.**

3D and motion exist to *explain state and build trust* — never as background noise.
Every animation answers "what changed?" If it doesn't, it's cut.

---

## Color Palette

| Token | Hex | CSS Variable | Use |
|-------|-----|-------------|-----|
| bg-primary | `#05070D` | `--bg-primary` | App background |
| bg-surface | `#0B0F1A` | `--bg-surface` | Cards, panels |
| bg-elevated | `#121826` | `--bg-elevated` | Modals, popovers |
| border-subtle | `#1E2536` | `--border-subtle` | Hairline borders |
| text-primary | `#F5F7FA` | `--text-primary` | Headings, primary text |
| text-secondary | `#9AA4B8` | `--text-secondary` | Body, meta |
| accent-cyan | `#22D3EE` | `--accent-cyan` | Primary — CTAs, active, verified glow |
| accent-blue | `#3B82F6` | `--accent-blue` | Secondary — gradient endpoint |
| accent-violet | `#7C6BFF` | `--accent-violet` | **AI-related UI only** |
| status-verified | `#34D399` | `--status-verified` | VERIFIED |
| status-invalid | `#F87171` | `--status-invalid` | INVALID |
| status-revoked | `#FB923C` | `--status-revoked` | REVOKED |
| status-pending | `#94A3B8` | `--status-pending` | Draft/pending |

### Gradient rules
- Hero glow: `--gradient-hero-glow` — radial cyan→blue at 8–15% opacity only
- CTA: `--gradient-cta` — solid linear gradient fill on primary buttons
- **No** full-bleed rainbow gradients, ever

### Glass surface rules
- Use ONLY for: navigation bar, modals, QR overlay
- Properties: `backdrop-filter: blur(20px)`, `rgba(255,255,255,0.04)` background
- **Do not** apply glass to every card — it loses meaning

---

## Typography

| Role | Font | Token |
|------|------|-------|
| Display / Headings | Space Grotesk | `--font-display` |
| Body / UI | Inter | `--font-body` |
| Hashes / Addresses / IDs | JetBrains Mono | `--font-mono` |

### Size scale
| Token | Value | Use |
|-------|-------|-----|
| `--text-hero` | clamp(48px, 6vw, 72px) | Hero H1 |
| `--text-h2` | clamp(28px, 3vw, 40px) | Section headings |
| `--text-body` | 16px | Standard body |
| `--text-label` | 12px + letter-spacing 0.08em | Status labels, uppercase tags |
| `--font-mono` | JetBrains Mono | **Always** use for hashes/addresses |

---

## 3D Elements — Placement Rules (§20.4)

3D appears in exactly **4 deliberate moments**. Nowhere else.

| Location | 3D Element | Purpose |
|----------|-----------|---------|
| Landing hero | Floating credential card (Y-axis rotate + sine bob) | "This becomes a real credential" |
| Issuance confirmation | Seal animation (rim-light trace → lock morph → flatten) | State confirmation — "it's locked" |
| Verification page | Hash comparison widget (two bars slide → lock/spark) | Visual proof of why status is what it is |
| Landing "How it works" | Pipeline nodes (Draft→Approve→Issue→Verify, scroll-activated) | Explain the lifecycle |

**3D is not:**
- A loading spinner substitute
- A background element
- Applied to dashboards, tables, or forms

---

## Motion Tokens

| Duration token | Value | Use |
|----------------|-------|-----|
| `--duration-fast` | 150ms | Button press, micro-interactions |
| `--duration-normal` | 200ms | Page transitions, card hover |
| `--duration-slow` | 600ms | Stat counter count-up |
| `--duration-seal` | 1400ms | Credential seal 3D animation |

### Specific animations
- **Button press:** `scale(0.98)` + glow on press, 150ms — NOT bounce
- **Card hover:** `translateY(-5px)` + border → `accent-cyan` at 30%, 200ms
- **VERIFIED badge:** single pulse ring, green, 600ms on mount
- **REVOKED badge:** 2px horizontal shake, 2 cycles, 300ms
- **Page transition:** 200ms fade + 8px upward slide — consistent everywhere
- **Stat counters:** count-up animation, 600ms ease-out on mount

### Reduced motion (mandatory)
All durations collapse to 0ms when `prefers-reduced-motion: reduce`. No exceptions.
The `prefersReducedMotion()` helper in `@certifiedpass/design-tokens` must be called before any Three.js or Framer Motion animation.

---

## Component Language

### Cards
```css
/* Standard card */
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-xl);  /* 16px */

/* On hover */
border-color: rgba(34, 211, 238, 0.30);
transform: translateY(-5px);
```
Use `.card` and `.card-glass` classes from `global.css`.

### Buttons
```css
/* Primary CTA */
background: var(--gradient-cta);   /* cyan → blue */
box-shadow: var(--shadow-cta-glow); /* on hover */
/* NO drop shadow — glow only */

/* Secondary CTA */
background: transparent;
border: 1px solid var(--accent-cyan);
color: var(--accent-cyan);
```

### Status pills
- Colored dot + uppercase label
- **No** full-color badge fill
- Use `.status-pill.status-verified` / `.status-invalid` / `.status-revoked` etc.

### AI field tags
- Violet tag (`.tag-ai`) shown on AI-generated fields in review table
- Tag disappears after issuer manually edits the field
- Focus ring on AI-editable fields: `--shadow-focus-ai` (violet)

### Hashes / IDs
- Always render in `--font-mono`
- Use `.hash-display` class for formatted display
- Always include a copy-to-clipboard affordance

---

## What Not to Do (§20.7)

❌ 3D blockchain/coin iconography  
❌ Generic "chain link" clip-art  
❌ Neon rainbow gradients  
❌ Particle confetti on issuance  
❌ Skeuomorphic wallet/coin imagery  
❌ APY-style stat tickers  
❌ Glass on every card  
❌ More than 4 3D moments  
❌ Motion that doesn't answer "what changed?"

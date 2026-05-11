# KALEIDO — Full-Stack E-Commerce Platform
## Master Build Specification v2.0
### Agent Instructions: Read this entire file before writing a single line of code. Execute every section in order. Log every completed milestone to `progress.md`.

---

## ██ AGENT EXECUTION PROTOCOL ██

```
WHEN YOU READ THIS FILE, DO THE FOLLOWING IN ORDER:
1. Create `progress.md` immediately with a build checklist derived from this document.
2. Complete each section below sequentially.
3. After finishing each major section, append a timestamped status entry to `progress.md`.
4. Never skip an animation, 3D effect, or visual detail — they are load-bearing features.
5. Do not use placeholder TODO comments unless the section is explicitly marked [DEFERRED].
6. Target: production-close code, zero broken imports, zero dead routes.
```

---

## 1. PROJECT IDENTITY

| Field | Value |
|---|---|
| **Name** | Kaleido |
| **Concept** | A hyper-visual e-commerce experience — every surface is alive. Think of a kaleidoscope: geometry, color, and motion coexist in a coherent, never-chaotic system. |
| **Inspirations** | Daraz.pk (breadth), Apple Store (detail quality), Linear.app (motion language), Stripe (micro-interactions) |
| **Tagline** | *"Shop in a new dimension."* |
| **Default Theme** | Dark Mode (toggle to Light) |
| **Typography Stack** | Display: `"Syne"` (Google Fonts) · Body: `"DM Sans"` · Monospace: `"JetBrains Mono"` |

---

## 2. FULL COLOR SYSTEM

### 2.1 Dark Mode (Default)

```css
:root[data-theme="dark"] {
  /* Backgrounds — layered for depth */
  --bg-void:        #080810;   /* deepest layer — used behind hero canvas */
  --bg-primary:     #0F0F0F;   /* main page background */
  --bg-secondary:   #1A1A1A;   /* card surfaces */
  --bg-surface:     #222226;   /* overlays, modals, dropdowns */
  --bg-raised:      #2A2A30;   /* hovered card, active input */

  /* Accents */
  --accent-cyan:    #00F5FF;   /* primary — glows, borders, cursor, progress */
  --accent-cyan-dim:#0891B2;   /* secondary cyan — secondary info elements */
  --accent-magenta: #C026D3;   /* CTAs, add-to-cart pulse, badges */
  --accent-mag-dim: #7E22CE;   /* deeper magenta — hover shadow layer */
  --accent-green:   #22C55E;   /* success states */
  --accent-amber:   #F59E0B;   /* stock warnings */
  --accent-red:     #EF4444;   /* error states */

  /* Text */
  --text-primary:   #F4F4F5;
  --text-secondary: #A1A1AA;
  --text-muted:     #52525B;
  --text-inverse:   #09090B;

  /* Borders */
  --border-subtle:  #27272A;
  --border-default: #3F3F46;
  --border-active:  #00F5FF;

  /* Glows (box-shadow shorthand values) */
  --glow-cyan:      0 0 12px rgba(0,245,255,0.45), 0 0 40px rgba(0,245,255,0.15);
  --glow-magenta:   0 0 12px rgba(192,38,211,0.5),  0 0 40px rgba(192,38,211,0.2);
  --glow-green:     0 0 12px rgba(34,197,94,0.5),   0 0 30px rgba(34,197,94,0.15);

  /* Gradients */
  --grad-hero:      linear-gradient(135deg, #080810 0%, #1A0F2E 60%, #0F1A2E 100%);
  --grad-btn:       linear-gradient(90deg, #00F5FF 0%, #C026D3 100%);
  --grad-btn-hover: linear-gradient(90deg, #C026D3 0%, #00F5FF 100%);
  --grad-card-edge: linear-gradient(135deg, rgba(0,245,255,0.08), rgba(192,38,211,0.08));
  --grad-shimmer:   linear-gradient(90deg, transparent, rgba(0,245,255,0.06), transparent);

  /* Glassmorphism */
  --glass-bg:       rgba(26, 26, 26, 0.65);
  --glass-border:   rgba(0, 245, 255, 0.12);
  --glass-blur:     blur(14px) saturate(180%);
}
```

### 2.2 Light Mode

```css
:root[data-theme="light"] {
  --bg-void:        #F0F2F8;
  --bg-primary:     #FFFFFF;
  --bg-secondary:   #F4F4F5;
  --bg-surface:     #E4E4E7;
  --bg-raised:      #D4D4D8;

  --accent-cyan:    #0891B2;
  --accent-magenta: #A21CAF;
  --accent-green:   #16A34A;
  --accent-amber:   #D97706;
  --accent-red:     #DC2626;

  --text-primary:   #09090B;
  --text-secondary: #52525B;
  --text-muted:     #A1A1AA;
  --text-inverse:   #F4F4F5;

  --border-subtle:  #E4E4E7;
  --border-default: #D4D4D8;
  --border-active:  #0891B2;

  --glow-cyan:      0 0 10px rgba(8,145,178,0.3), 0 0 30px rgba(8,145,178,0.1);
  --glow-magenta:   0 0 10px rgba(162,28,175,0.3), 0 0 30px rgba(162,28,175,0.1);

  --grad-hero:      linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 50%, #ECFEFF 100%);
  --grad-btn:       linear-gradient(90deg, #0891B2 0%, #A21CAF 100%);
  --glass-bg:       rgba(255,255,255,0.7);
  --glass-border:   rgba(8,145,178,0.18);
}
```

### 2.3 Theme Transition Rule
```css
*, *::before, *::after {
  transition:
    background-color 400ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color     400ms cubic-bezier(0.4, 0, 0.2, 1),
    color            300ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow       400ms cubic-bezier(0.4, 0, 0.2, 1);
}
/* Exception: exclude transitions on animated elements */
[data-no-theme-transition] { transition: none !important; }
```

---

## 3. TYPOGRAPHY SYSTEM

```css
/* Load via Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}

/* Type Scale */
--text-xs:   0.75rem;    /* 12px */
--text-sm:   0.875rem;   /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg:   1.125rem;   /* 18px */
--text-xl:   1.25rem;    /* 20px */
--text-2xl:  1.5rem;     /* 24px */
--text-3xl:  1.875rem;   /* 30px */
--text-4xl:  2.25rem;    /* 36px */
--text-5xl:  3rem;       /* 48px */
--text-6xl:  3.75rem;    /* 60px */
--text-7xl:  4.5rem;     /* 72px */
```

Headline rules:
- `font-family: var(--font-display)` on all `h1–h3` and hero text
- `font-family: var(--font-body)` on body, labels, buttons
- `font-family: var(--font-mono)` on price displays, order IDs, code snippets
- Letter-spacing: `h1` → `-0.03em`, `h2` → `-0.02em`, buttons → `0.04em uppercase`

---

## 4. CUSTOM CURSOR SYSTEM

Implement a fully custom cursor that replaces the OS cursor site-wide.

### 4.1 DOM Structure
```html
<!-- Injected once into <body> -->
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>
```

### 4.2 CSS
```css
#cursor-dot {
  position: fixed;
  width: 8px; height: 8px;
  background: var(--accent-cyan);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px var(--accent-cyan), 0 0 20px rgba(0,245,255,0.6);
  transition: transform 0.05s linear, width 0.2s ease, height 0.2s ease, background 0.2s;
}

#cursor-ring {
  position: fixed;
  width: 36px; height: 36px;
  border: 1.5px solid rgba(0,245,255,0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  transition: transform 0.12s cubic-bezier(0.23,1,0.32,1),
              width 0.25s ease, height 0.25s ease,
              border-color 0.2s, opacity 0.2s;
}

/* States */
body.cursor-hover #cursor-dot  { width: 12px; height: 12px; background: var(--accent-magenta); }
body.cursor-hover #cursor-ring { width: 52px; height: 52px; border-color: var(--accent-magenta); }
body.cursor-click #cursor-dot  { transform: translate(-50%,-50%) scale(0.7); }
body.cursor-text  #cursor-ring { width: 4px; height: 28px; border-radius: 2px; }
```

### 4.3 JavaScript (React hook `useCursor.ts`)
```typescript
// Track mousemove, apply dot position instantly, ring position with lerp
// Add/remove hover class when hovering [role="button"], a, button, [data-cursor="hover"]
// Add click class on mousedown/mouseup
// Disable on touch devices (matchMedia pointer: coarse)
```

---

## 5. BACKGROUND ANIMATION SYSTEMS

### 5.1 Hero Section — Three.js Particle Field

Use **Three.js** (or `@react-three/fiber`) to render a canvas behind the hero.

**Specification:**
- **Particle count:** 1,800
- **Geometry:** `THREE.BufferGeometry` with random positions in a `[-50, 50]³` volume
- **Material:** `THREE.PointsMaterial`, size `0.12`, color `#00F5FF`, transparent with alpha `0.7`
- **Animation loop:**
  - Rotate the entire Points object on Y axis at `0.00018` rad/frame
  - Rotate on X axis at `0.00008` rad/frame
  - Each particle drifts upward by `position.y += 0.004`; when `y > 50` reset to `-50`
- **Mouse interactivity:**
  - On `mousemove`, shift a uniform `uMouseOffset` that tilts the camera `±5°` (smooth lerp factor `0.04`)
- **Performance guard:** Pause the animation loop when `document.hidden === true`
- **Reduced motion:** If `prefers-reduced-motion: reduce`, render a static snapshot, no animation loop

### 5.2 Hexagonal Grid Background (Product Pages)

Pure CSS + SVG pattern — no JS required.

```css
.hex-grid-bg {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34z' fill='none' stroke='%2300F5FF' stroke-opacity='0.04' stroke-width='0.8'/%3E%3Cpath d='M28 100L0 84V50l28-16 28 16v34z' fill='none' stroke='%2300F5FF' stroke-opacity='0.04' stroke-width='0.8'/%3E%3C/svg%3E");
  background-size: 56px 100px;
  animation: hex-drift 18s linear infinite;
}

@keyframes hex-drift {
  0%   { background-position: 0 0; }
  100% { background-position: 56px 200px; }
}
```

### 5.3 Login / Order Confirmation — Floating Neon Orbs

```css
/* 6 pseudo-elements / divs with blur */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  animation: orb-float var(--dur, 12s) ease-in-out infinite alternate;
}
.orb-1 { width: 420px; height: 420px; background: #00F5FF; top: -10%; left: -8%;  --dur: 11s; }
.orb-2 { width: 320px; height: 320px; background: #C026D3; top: 40%; right: -5%; --dur: 14s; }
.orb-3 { width: 260px; height: 260px; background: #22C55E; bottom: -5%; left: 30%; --dur: 9s; }

@keyframes orb-float {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, -40px) scale(1.08); }
}
```

---

## 6. 3D EFFECTS SPECIFICATION

### 6.1 Product Card 3D Tilt (CSS Transform — No Library Required)

Each product card listens to `mousemove` within its bounding box and applies a CSS perspective transform.

```typescript
// useCardTilt.ts
const PERSPECTIVE = 900;   // px
const MAX_TILT     = 14;    // degrees
const GLARE_ALPHA  = 0.18;

function onMouseMove(e: MouseEvent, card: HTMLElement) {
  const rect = card.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const dx   = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
  const dy   = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

  const rotX = -dy * MAX_TILT;
  const rotY =  dx * MAX_TILT;

  card.style.transform = `
    perspective(${PERSPECTIVE}px)
    rotateX(${rotX}deg)
    rotateY(${rotY}deg)
    scale3d(1.035, 1.035, 1.035)
  `;

  // Glare overlay position
  const glareX = 50 + dx * 30;
  const glareY = 50 + dy * 30;
  card.style.setProperty('--glare-x', `${glareX}%`);
  card.style.setProperty('--glare-y', `${glareY}%`);
}

function onMouseLeave(card: HTMLElement) {
  card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
}
```

**Glare overlay (pseudo-element):**
```css
.product-card::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--glare-x, 50%) var(--glare-y, 50%),
    rgba(255,255,255, 0.18) 0%,
    transparent 65%
  );
  pointer-events: none;
  transition: opacity 0.3s;
  opacity: 0;
}
.product-card:hover::after { opacity: 1; }
```

### 6.2 Login / Signup Form — 3D Floating Card

The entire auth form container is wrapped in a 3D tilt container identical to the card, but with:
- `MAX_TILT = 8` degrees (more subtle — it's a form)
- `PERSPECTIVE = 1200px`
- A permanent soft cyan glow: `box-shadow: 0 25px 60px rgba(0,245,255,0.12), 0 0 0 1px var(--glass-border)`
- On mount: entrance animation — card starts at `rotateX(25deg) rotateY(-15deg) translateY(30px) scale(0.94)` and springs to identity over `900ms` using a spring easing curve

### 6.3 Product Detail — Full-Page 3D Image Parallax

```typescript
// On mousemove over the product image container:
const PARALLAX_LAYERS = [
  { selector: '.product-img-main',    depth: 0.025 },  // image itself
  { selector: '.product-img-shadow',  depth: 0.045 },  // drop shadow layer
  { selector: '.product-badges',      depth: 0.065 },  // "New", "Sale" badges
];

// For each layer:
layer.style.transform = `translate(${dx * depth * 100}px, ${dy * depth * 100}px)`;
// dx, dy are normalized mouse position from center of viewport (-0.5 to 0.5)
// Smooth with lerp factor 0.08
```

### 6.4 Hero — 3D Product Showcase Carousel

```
Architecture:
  - 5 featured products arranged on a CSS 3D carousel (rotateY, preserve-3d)
  - Each card offset: rotateY(0deg), rotateY(72deg), rotateY(144deg) etc.
  - translateZ(340px) to push cards outward on the cylinder
  - Auto-rotates every 3.5s: increment active index, animate --carousel-angle
  - Active card: scale(1.08) + glow box-shadow
  - Prev/next controls: chevron buttons with ripple effect

CSS:
  .carousel-scene {
    perspective: 1200px;
    perspective-origin: 50% 38%;
  }
  .carousel-track {
    transform-style: preserve-3d;
    transition: transform 0.85s cubic-bezier(0.77,0,0.175,1);
  }
  .carousel-card {
    backface-visibility: hidden;
    transform-style: preserve-3d;
    /* Each card: rotateY(Ndeg) translateZ(340px) */
  }
```

### 6.5 Cart Item — 3D Flip Remove Animation

When user clicks "Remove":
1. Card does a `rotateY(90deg)` in `300ms` (front face disappears)
2. Height collapses from computed height → `0px` in `280ms` with `margin-bottom → 0`
3. Siblings slide up smoothly via layout transition

```css
.cart-item-exit {
  animation: cart-flip-out 0.32s cubic-bezier(0.4,0,0.6,1) forwards;
  overflow: hidden;
}
@keyframes cart-flip-out {
  0%   { transform: perspective(600px) rotateY(0deg);   opacity: 1; max-height: 200px; }
  50%  { transform: perspective(600px) rotateY(90deg);  opacity: 0; max-height: 200px; }
  100% { transform: perspective(600px) rotateY(90deg);  opacity: 0; max-height: 0;     margin: 0; padding: 0; }
}
```

---

## 7. ANIMATION SYSTEM (Framer Motion)

### 7.1 Global Animation Variants

Define these in `src/lib/animations.ts` and reuse everywhere:

```typescript
export const fadeUp = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  })
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }  /* spring-like */
  }
};

export const slideFromRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
};

export const cardHover = {
  rest:  { scale: 1,    transition: { duration: 0.3, ease: 'easeOut' } },
  hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } }
};

export const shakeX = {
  animate: { x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.55, ease: 'easeInOut' } }
};

export const bounceIn = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 500, damping: 22 }
  }
};

export const successPop = {
  hidden:  { scale: 0.6, opacity: 0 },
  visible: { scale: [0.6, 1.15, 1], opacity: 1,
    transition: { duration: 0.5, ease: [0.34,1.56,0.64,1] }
  }
};
```

### 7.2 Page Transition Wrapper

Wrap every route in:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### 7.3 Skeleton Loading Component

```tsx
// Pulsing shimmer skeleton for product cards
const Skeleton = ({ className }) => (
  <div className={`skeleton ${className}`} />
);

/* CSS */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-raised)    40%,
    var(--bg-secondary) 80%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
  border-radius: 8px;
}
@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Cyan-tinted shimmer highlight — more branded than grey */
/* Replace the middle color with rgba(0,245,255,0.07) in dark mode */
```

### 7.4 Add-to-Cart Success Flow

Sequence (350ms total):
1. Button text morphs: `"Add to Cart"` → spinning cyan spinner (100ms)
2. Spinner → green checkmark SVG drawn via `stroke-dashoffset` animation (200ms)
3. Cart icon in navbar: bounces with `scale(1.35)` → `scale(1)` and counter increments with a flip animation (50ms delay)
4. Button returns to default state after 2 seconds

```css
.cart-icon-bounce {
  animation: cart-bounce 0.45s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes cart-bounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35) rotate(-8deg); }
  70%  { transform: scale(0.95) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); }
}
```

---

## 8. COMPONENT SPECIFICATIONS

### 8.1 Navbar

**Layout:** `sticky top-0`, `z-index: 1000`, `backdrop-filter: blur(18px) saturate(180%)`, `background: var(--glass-bg)`, `border-bottom: 1px solid var(--border-subtle)`

**Logo:** "KALEIDO" in Syne 700 weight. The "K" is rendered in `var(--accent-cyan)`. On hover, the entire logo does a subtle `skewX(-4deg)` + cyan text-shadow glow for 200ms.

**Search Bar:**
- Default state: compressed pill (48px wide) showing only a search icon
- Focus/click: expands to `340px` via `width` transition (`0.4s cubic-bezier(0.34,1.56,0.64,1)`)
- Active border: `1px solid var(--accent-cyan)` + `box-shadow: var(--glow-cyan)`
- Dropdown: search suggestions appear as a glassmorphic panel below with `fadeUp` entrance

**Nav Links:** Each link has a `::after` pseudo-element that's a `2px` line, initial `scaleX(0)`, scales to `scaleX(1)` on hover from center (`transform-origin: center`). Color: `var(--accent-cyan)`.

**Cart Icon:**
- Badge: magenta circle `24px`, JetBrains Mono for count
- On cart update: badge flips in via `rotateX(360deg)` over `400ms`

**Theme Toggle:**
- Sun/moon icon swap
- On toggle: entire icon does a `rotate(360deg)` as it morphs
- Background circles animate: dark → a filled black orb flies in from top-left; light → sun rays expand

**Mobile Hamburger:** Three lines that morph to an X via SVG path animation (no simple rotation trick — the lines actually redraw as X strokes).

### 8.2 Product Card

**Dimensions:** min-height `380px`, aspect ratio enforced for image `4:3`

**Layers (bottom to top):**
1. `bg-secondary` base
2. Gradient edge overlay (`--grad-card-edge`) at 0.6 opacity, appears on hover
3. Product image (zooms `scale(1.06)` on card hover, `overflow: hidden`)
4. Content section: title, price, rating
5. Add to cart button (hidden by default, slides up from bottom on hover)
6. Wishlist button (top-right corner, always visible)
7. Glare pseudo-element (always present, opacity 0 until tilt)
8. Cyan border glow on hover (`box-shadow: var(--glow-cyan)`)

**Image Zoom:**
```css
.card-image-wrap { overflow: hidden; border-radius: 12px 12px 0 0; }
.card-image {
  transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
}
.product-card:hover .card-image { transform: scale(1.06); }
```

**Add to Cart Reveal:**
```css
.card-cta {
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
              opacity    0.25s ease;
}
.product-card:hover .card-cta {
  transform: translateY(0);
  opacity: 1;
}
```

**Wishlist Heart:**
- Default: outline heart, `var(--text-muted)`
- On click: fills with magenta + scale bounce (`scale(1.4)` → `scale(1)`) + small particle burst (5 tiny hearts scatter 20px outward)
- Heart particles: 5 `<span>` elements with `position:absolute`, each animated `translate + fade` in different directions

**Rating Stars:** Custom SVG stars. Partial fills via `clipPath`. Active fill: `var(--accent-amber)`.

### 8.3 Product Detail Page

**Layout:** Two-column on desktop (image left, info right). Single column on mobile.

**Image Gallery:**
- Main image: `480px × 480px`, rounded `16px`, subtle inset shadow
- Thumbnails: horizontal scroll, `80px × 80px`, active thumbnail has cyan border + glow
- Image transition: crossfade `300ms` — do NOT use a hard swap
- Click to zoom: modal overlay with `backdrop-filter: blur(20px)`, image scales to `85vw` max, can drag to pan (use `usePointerCapture`)
- 3D parallax: as described in §6.3

**Price Display:** Use `JetBrains Mono`. If discounted, show original price in `--text-muted` with strikethrough, and a magenta badge showing `% OFF`.

**Stock Indicator:**
- In stock (>5 units): `var(--accent-green)` dot + "In Stock"
- Low stock (1-5): `var(--accent-amber)` pulsing dot + "Only N left"
- Out of stock: `var(--accent-red)` + "Sold Out"

```css
/* Pulsing dot for low stock */
.stock-dot-pulse {
  animation: pulse-ring 1.4s ease-out infinite;
}
@keyframes pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.6); }
  70%  { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
  100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
}
```

**Quantity Selector:**
```
[ − ] [ 2 ] [ + ]
Buttons: 36px × 36px, rounded-full, var(--bg-surface) bg
On press: scale(0.88) for 100ms (spring back)
Number: JetBrains Mono, 18px, centered
```

**Related Products Carousel:**
- Horizontal scroll with `scroll-snap-type: x mandatory`
- Custom scrollbar hidden (`::-webkit-scrollbar { display: none }`)
- Prev/next nav arrows with glassmorphic bg
- Parallax: as user scrolls right, cards shift slightly on Y axis (each card offset by `scrollX * 0.04`)

### 8.4 Cart Page

**Item Card Layout:**
```
[  IMAGE  ] | Product Name      | $XX.XX  | [−][qty][+] | [🗑]
  80×80     | Category tag       | unit    |             |
             | Variant (if any)  |         |             |
```

**Quantity Debounce:** 600ms debounce on `PUT /api/cart/:itemId`. While pending, show a subtle spinner on the quantity display. On resolve, flash the row with a quick `background-color` pulse to `rgba(0,245,255,0.06)`.

**Row Shake on Quantity Change:**
```typescript
// After API resolves, fire shakeX animation on that row for 500ms
```

**Price Breakdown Panel (sticky right column on desktop):**
- Subtotal
- Estimated Shipping (free over $50, else $4.99 — calculate client-side)
- Tax (8.5% — calculate client-side)
- **Total** (Syne Bold, 24px)
- Promo code input: on submit `→ loading spinner → success (green glow + "✓ Applied") or error (shake + red border)`
- "Proceed to Checkout" button: full-width, magenta gradient, height `52px`, on hover gradient reverses direction (180deg)

**Empty Cart State:**
- Large SVG illustration of an empty cart (design inline as SVG — don't use an img tag)
- Animated: cart wheels spin slowly, a small bird sits on the handle and bobs up/down
- CTA: "Start Exploring" → routes to home

### 8.5 Checkout (Multi-Step)

**Step Indicator:**
```
●━━━━━━━━━●━━━━━━━━━●
1 Address   2 Payment   3 Confirm
```
- Active step: filled cyan circle + Syne Bold label
- Completed step: checkmark in cyan circle
- Inactive step: hollow circle, muted label
- Connecting line: fills with cyan as steps complete (CSS width transition)

**Step 1 — Shipping Address:**
- Fields: Full Name, Email, Phone, Address Line 1, Address Line 2 (optional), City, State/Province, Postal Code, Country
- Each field: on focus, label floats up (floating label pattern), border turns cyan, subtle glow
- Error state: red border + shake + error message fades in below

**Step 2 — Payment Method:**
Three cards (radio-button style):
1. 💳 Credit / Debit Card (form expands inline with card number, expiry, CVV — animate height open)
2. PayPal (static "You'll be redirected" note)
3. Cash on Delivery

Active card selection: cyan border + glow + checkmark badge top-right

**Credit Card Visual:**
Render a visual 3D card preview that updates in real time as the user types:
- Card front: card number (formatted as XXXX XXXX XXXX XXXX), cardholder name, expiry
- On CVV focus: card flips to show back (CSS `rotateY(180deg)`, `backface-visibility: hidden`)
- Gradient background changes based on card brand (Visa → navy, Mastercard → red-orange gradient)
- Card has a glossy reflection pseudo-element

**Step 3 — Order Summary:**
- Read-only list of items with thumbnail, name, qty, price
- Final total breakdown
- "Place Order" button: magenta → loading → success checkmark

### 8.6 Order Confirmation Page

**Confetti System:**
Use `canvas-confetti` library (npm install canvas-confetti).

```typescript
// Fire sequence on mount:
confetti({ particleCount: 80, spread: 55, origin: { y: 0.6 }, colors: ['#00F5FF', '#C026D3', '#22C55E'] });
// 400ms later:
confetti({ particleCount: 40, angle: 60,  spread: 45, origin: { x: 0, y: 0.7 } });
confetti({ particleCount: 40, angle: 120, spread: 45, origin: { x: 1, y: 0.7 } });
```

**Success Checkmark:**
SVG circle + check, drawn via `stroke-dashoffset` animation:
```css
.check-circle {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: draw-check 0.8s ease forwards 0.3s;
}
@keyframes draw-check {
  to { stroke-dashoffset: 0; }
}
```
Circle color: `var(--accent-green)`. Check color: white. Circle fills with a `var(--accent-green)` fill at opacity 0.15 after drawing.

**Order Number Display:**
```tsx
<span className="font-mono text-2xl tracking-widest text-cyan-glow">
  #{orderId}
</span>
```
With a subtle typewriter effect: characters appear one by one at `60ms` intervals.

---

## 9. BACKEND ARCHITECTURE

### 9.1 Folder Structure

```
kaleido-backend/
├── src/
│   ├── config/
│   │   ├── db.ts              # Mongoose connect
│   │   └── env.ts             # Validated env vars (zod)
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Cart.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── cart.routes.ts
│   │   └── order.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   └── order.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # verifyJWT
│   │   ├── error.middleware.ts   # global error handler
│   │   └── rateLimit.middleware.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── apiResponse.ts        # { success, data, message, error }
│   │   └── asyncHandler.ts       # wraps controllers in try/catch
│   └── app.ts                    # Express app setup
├── scripts/
│   └── seed.ts                   # 20+ products seed
├── .env.example
└── package.json
```

### 9.2 Mongoose Models (Full Schema)

```typescript
// User.ts
const userSchema = new Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  passwordHash:  { type: String, required: true },
  avatar:        { type: String, default: '' },
  wishlist:      [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  addresses:     [{
    label:      String,   // "Home", "Work"
    line1:      String,
    line2:      String,
    city:       String,
    state:      String,
    postalCode: String,
    country:    { type: String, default: 'PK' },
    isDefault:  { type: Boolean, default: false }
  }],
  role:          { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken:  { type: String },
  createdAt:     { type: Date, default: Date.now }
});

// Product.ts
const productSchema = new Schema({
  name:        { type: String, required: true },
  slug:        { type: String, unique: true },
  description: String,
  price:       { type: Number, required: true },
  comparePrice:Number,    // original price for "% OFF" display
  category:    { type: String, enum: ['electronics', 'fashion', 'home-decor', 'beauty', 'sports'] },
  subcategory: String,
  brand:       String,
  stock:       { type: Number, default: 0 },
  images:      [String],  // URLs (use picsum.photos or unsplash for seed)
  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 }
  },
  tags:        [String],
  isFeatured:  { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

// Cart.ts
const cartSchema = new Schema({
  user:  { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product:  { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1, min: 1, max: 99 },
    price:    Number   // snapshot price at time of add
  }],
  promoCode:    String,
  discountPct:  { type: Number, default: 0 }
}, { timestamps: true });

// Order.ts
const orderSchema = new Schema({
  user:     { type: Schema.Types.ObjectId, ref: 'User' },
  items:    [{
    product:  { type: Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    image:    String,
    price:    Number,
    quantity: Number
  }],
  shippingAddress: {
    name: String, line1: String, line2: String,
    city: String, state: String, postalCode: String, country: String, phone: String
  },
  paymentMethod:  { type: String, enum: ['card', 'paypal', 'cod'] },
  subtotal:       Number,
  shippingCost:   Number,
  tax:            Number,
  total:          Number,
  status:         { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  promoCode:      String,
  discountAmount: { type: Number, default: 0 }
}, { timestamps: true });
```

### 9.3 API Endpoints

```
AUTH
POST  /api/auth/register          body: { name, email, password }
POST  /api/auth/login             body: { email, password }       → sets httpOnly refresh cookie
POST  /api/auth/logout            clears cookie
GET   /api/auth/me                [protected] → current user
POST  /api/auth/refresh           uses httpOnly cookie to rotate tokens

PRODUCTS
GET   /api/products               ?page=1&limit=12&category=&sort=newest|price_asc|price_desc|rating&minPrice=&maxPrice=&q=
GET   /api/products/featured      returns isFeatured:true (max 5)
GET   /api/products/:id

CART
GET   /api/cart                   [protected]
POST  /api/cart                   body: { productId, quantity }
PUT   /api/cart/:itemId           body: { quantity }
DELETE /api/cart/:itemId          [protected]
POST  /api/cart/promo             body: { code } → validates & applies

ORDERS
POST  /api/orders                 [protected] body: { shippingAddress, paymentMethod }
GET   /api/orders/:id             [protected]
GET   /api/orders/mine            [protected] → user's order history

WISHLIST (bonus)
POST  /api/wishlist/toggle        body: { productId } → toggle add/remove
GET   /api/wishlist               [protected]
```

### 9.4 JWT Strategy

```typescript
// Access token:  15 minutes, stored in memory (Zustand store)
// Refresh token: 7 days, stored in httpOnly Secure SameSite=Strict cookie

// On 401 from API: interceptor auto-calls POST /api/auth/refresh
// If refresh fails: clear store, redirect to /login
```

### 9.5 Seed Script (`scripts/seed.ts`)

Provide **24 products** across 5 categories. Use `https://picsum.photos/seed/{productName}/600/600` for images.

Categories breakdown:
- Electronics: 6 products (headphones, smartwatch, laptop, keyboard, phone, tablet)
- Fashion: 6 products (jacket, sneakers, tote bag, sunglasses, watch, hoodie)
- Home Decor: 5 products (lamp, vase, mirror, throw blanket, candle set)
- Beauty: 4 products (skincare set, perfume, lipstick, facial mist)
- Sports: 3 products (yoga mat, water bottle, resistance bands)

Each product must have:
- Realistic name and description (2–3 sentences)
- Price in USD ($12–$499)
- comparePrice set for 30% of products (creating "sale" items)
- stock between 0–150 (2 products have stock: 0)
- rating.average between 3.5–5.0, rating.count between 8–1,200
- isFeatured: true on 5 products
- 3 image URLs per product (use different picsum seeds)

---

## 10. FRONTEND ARCHITECTURE

### 10.1 Folder Structure

```
kaleido-frontend/
├── public/
│   └── favicon.svg           # Kaleido "K" icon in cyan
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/               # Primitive components (Button, Input, Badge, etc.)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageWrapper.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   └── ProductCarousel.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── StepIndicator.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── CreditCardPreview.tsx
│   │   ├── effects/
│   │   │   ├── ParticleField.tsx     # Three.js canvas
│   │   │   ├── CursorTracker.tsx
│   │   │   ├── HexGridBackground.tsx
│   │   │   └── ConfettiTrigger.tsx
│   │   └── common/
│   │       ├── Skeleton.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── SuccessCheck.tsx
│   │       └── ThemeToggle.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useCursor.ts
│   │   ├── useCardTilt.ts
│   │   ├── useParallax.ts
│   │   ├── useDebounce.ts
│   │   └── useTheme.ts
│   ├── store/
│   │   ├── authStore.ts      # Zustand
│   │   ├── cartStore.ts      # Zustand
│   │   └── themeStore.ts     # Zustand (persisted)
│   ├── api/
│   │   ├── axios.ts          # Instance with interceptors
│   │   ├── auth.api.ts
│   │   ├── products.api.ts
│   │   ├── cart.api.ts
│   │   └── orders.api.ts
│   ├── lib/
│   │   ├── animations.ts     # Framer Motion variants (see §7.1)
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts          # All TypeScript interfaces
│   ├── styles/
│   │   ├── globals.css       # CSS variables + resets
│   │   └── animations.css    # Keyframe animations
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.ts        # Extended with Kaleido design tokens
├── vite.config.ts
└── package.json
```

### 10.2 Tailwind Config Extension

```typescript
// tailwind.config.ts
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        cyan:    { DEFAULT: '#00F5FF', dim: '#0891B2' },
        magenta: { DEFAULT: '#C026D3', dim: '#7E22CE' },
        void:    '#080810',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'shimmer':       'skeleton-shimmer 1.6s ease-in-out infinite',
        'orb-float':     'orb-float 12s ease-in-out infinite alternate',
        'hex-drift':     'hex-drift 18s linear infinite',
        'cart-bounce':   'cart-bounce 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        'draw-check':    'draw-check 0.8s ease forwards',
        'pulse-ring':    'pulse-ring 1.4s ease-out infinite',
      },
      backdropBlur: { glass: '14px' },
      boxShadow: {
        'glow-cyan':    '0 0 12px rgba(0,245,255,0.45), 0 0 40px rgba(0,245,255,0.15)',
        'glow-magenta': '0 0 12px rgba(192,38,211,0.5),  0 0 40px rgba(192,38,211,0.2)',
        'glow-green':   '0 0 12px rgba(34,197,94,0.5),   0 0 30px rgba(34,197,94,0.15)',
        'card-rest':    '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':   '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,245,255,0.3)',
      },
    }
  }
}
```

### 10.3 React Query Setup

```typescript
// src/api/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,   // 2 minutes
      gcTime:    1000 * 60 * 10,  // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

// Query Keys convention:
// ['products', filters]
// ['product', id]
// ['cart']
// ['orders', userId]
// ['wishlist']
```

---

## 11. PAGE-BY-PAGE VISUAL SPECIFICATION

### 11.1 Home Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (sticky, glassmorphic)                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO SECTION                    height: 100vh          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Three.js particle canvas (absolute, z:0)       │   │
│  │                                                 │   │
│  │  [Left: Headline + CTA]   [Right: 3D Carousel]  │   │
│  │                                                 │   │
│  │  Headline: "Shop in a New Dimension."           │   │
│  │  Sub: "Immersive products. Electric experience" │   │
│  │  CTA: [Explore Now →]  [View Deals]             │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  CATEGORY STRIP (horizontal scroll, 5 pills)            │
│  All | Electronics | Fashion | Home | Beauty | Sports   │
├─────────────────────────────────────────────────────────┤
│  FILTER BAR (collapsible on mobile)                     │
│  [Price Range Slider] [Rating Filter] [Sort By ▼]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PRODUCT GRID (3 cols desktop, 2 tablet, 1 mobile)      │
│  Cards fade-up staggered (0.07s delay increment)        │
│                                                         │
│  [Card][Card][Card]                                     │
│  [Card][Card][Card]                                     │
│  [Card][Card][Card]                                     │
│  [Card][Card][Card]  ← 12 per page                      │
│                                                         │
│  [Load More] or infinite scroll trigger                  │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

**Hero CTA Buttons:**
- "Explore Now →": solid magenta gradient, 52px height, Syne 600, `letter-spacing: 0.06em`
- "View Deals": ghost button with cyan border, `backdrop-filter: blur(4px)`

### 11.2 Product Detail Layout

```
┌──────────────────────────┬─────────────────────────────┐
│  IMAGE GALLERY (left)    │  PRODUCT INFO (right)       │
│  ┌────────────────────┐  │  Brand tag (muted)          │
│  │   Main Image       │  │  Product Name (Syne 700)    │
│  │   480×480          │  │  ★★★★☆ (4.2 · 312 reviews) │
│  │   [parallax]       │  │                             │
│  └────────────────────┘  │  $149.99  ~~$199.99~~  25%OFF│
│  [🖼][🖼][🖼] thumbnails  │                             │
│                          │  ── Description ──           │
│                          │  2-3 sentences of body text │
│                          │                             │
│                          │  Quantity: [−][2][+]        │
│                          │                             │
│                          │  [   Add to Cart   ]        │
│                          │  [   Buy Now       ]        │
│                          │                             │
│                          │  🚚 Free shipping over $50  │
│                          │  🔒 Secure checkout         │
└──────────────────────────┴─────────────────────────────┘
│                                                         │
│  Related Products (horizontal snap carousel)            │
└─────────────────────────────────────────────────────────┘
```

---

## 12. RESPONSIVE BREAKPOINTS

```css
/* Tailwind custom screens */
screens: {
  'xs':  '375px',
  'sm':  '640px',
  'md':  '768px',
  'lg':  '1024px',
  'xl':  '1280px',
  '2xl': '1536px',
}

/* Grid adaptation */
product-grid:  1 col (xs–sm) → 2 col (md) → 3 col (lg+)
hero:          stacked (xs–md) → side-by-side (lg+)
detail:        stacked (xs–md) → two-column  (lg+)
cart:          stacked summary (xs–lg) → sticky right panel (xl+)
checkout:      single column throughout, max-width 680px centered
```

---

## 13. PERFORMANCE & ACCESSIBILITY

### 13.1 Performance
- All images: `loading="lazy"`, `decoding="async"`, `width` + `height` set
- Three.js canvas: `powerPreference: "high-performance"`, limited to 60fps via `clock.getDelta`
- CSS animations: exclusively `transform` and `opacity` — no animating `width`, `height`, `top`, `left`
- Code splitting: lazy-load route components with `React.lazy` + `Suspense`
- Font loading: `display=swap` + preconnect to Google Fonts
- React Query: prefetch product list on navbar hover over "Products"

### 13.2 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Keep functional transitions (theme switch colors) via .respect-motion class */
}
```
In JS: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before starting Three.js loop.

### 13.3 Accessibility
- All interactive elements: `focus-visible` styles matching hover glow (no default browser outline)
- Product cards: `role="article"`, `aria-label="{product name}"`
- Cart badge: `aria-label="Cart, {n} items"`
- Theme toggle: `aria-pressed`, `aria-label="Toggle dark/light mode"`
- Form fields: `<label>` associated via `htmlFor`, error messages via `aria-describedby`
- Skip-to-content link at top of each page
- Contrast ratios: all text passes WCAG AA (tested against both themes)

---

## 14. ENVIRONMENT CONFIGURATION

### `.env.example` (Backend)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kaleido
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### `.env.example` (Frontend)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Kaleido
```

---

## 15. README (Include This Verbatim)

````markdown
# Kaleido — E-Commerce Platform

> "Shop in a new dimension." — A hyper-visual MERN stack e-commerce app.

## Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm 9+

## Setup

```bash
# 1. Clone & install
git clone <repo-url>
cd kaleido

# 2. Backend
cd backend
cp .env.example .env          # Fill in your secrets
npm install
npm run seed                  # Seeds 24 products into MongoDB
npm run dev                   # Starts on :5000

# 3. Frontend (new terminal)
cd ../frontend
cp .env.example .env          # Set VITE_API_BASE_URL
npm install
npm run dev                   # Starts on :5173
```

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run seed` | Seed database with sample products |
| `npm run lint` | ESLint |

## Features
- JWT auth (access + httpOnly refresh cookie)
- Product browsing with filtering, sorting, pagination
- Full cart management with debounced quantity updates
- Multi-step checkout (address → payment → confirm)
- Order placement & confirmation with confetti
- Dark / Light theme toggle
- Custom animated cursor
- 3D product card tilt
- Three.js particle background
- Framer Motion page transitions
- React Query data layer
- Zustand state management
- Fully responsive (mobile → desktop)
````

---

## 16. PROGRESS TRACKING (Agent: Write This File)

When you begin execution, immediately create `progress.md` with this structure:

```markdown
# Kaleido Build Progress

## Status: 🔄 IN PROGRESS
Last updated: {timestamp}

## Checklist

### Phase 1: Backend Foundation
- [ ] Folder structure created
- [ ] Express app + middleware setup
- [ ] MongoDB connection
- [ ] User model + auth routes (register/login/logout/me/refresh)
- [ ] JWT strategy (access + refresh)
- [ ] Product model + routes (GET list, GET by id)
- [ ] Cart model + routes (GET, POST, PUT, DELETE)
- [ ] Order model + routes (POST, GET by id)
- [ ] Seed script (24 products)
- [ ] .env.example

### Phase 2: Frontend Foundation
- [ ] Vite + React + TypeScript init
- [ ] Tailwind config with Kaleido tokens
- [ ] Google Fonts import (Syne, DM Sans, JetBrains Mono)
- [ ] CSS variables (dark + light themes)
- [ ] Zustand stores (auth, cart, theme)
- [ ] Axios instance with interceptors
- [ ] React Query client
- [ ] React Router v6 setup
- [ ] Animation variants (lib/animations.ts)

### Phase 3: Effects & Global Systems
- [ ] Custom cursor (CursorTracker.tsx)
- [ ] Theme toggle with smooth transition
- [ ] Three.js particle field (ParticleField.tsx)
- [ ] Hex grid background CSS
- [ ] Floating orb backgrounds
- [ ] Skeleton component
- [ ] Loading spinner
- [ ] Success checkmark SVG animation

### Phase 4: Pages
- [ ] Home page (hero + filters + product grid)
- [ ] Product detail page (gallery + parallax + related)
- [ ] Login page (3D tilt form + particle bg)
- [ ] Signup page
- [ ] Cart page (item list + summary + promo)
- [ ] Checkout page (multi-step + card preview)
- [ ] Order confirmation (confetti + typewriter order ID)
- [ ] 404 page

### Phase 5: Animations & Polish
- [ ] Product card 3D tilt (useCardTilt hook)
- [ ] Product card hover effects (glow, image zoom, CTA reveal)
- [ ] Wishlist heart pop + particles
- [ ] Add-to-cart button sequence (spinner → checkmark → cart bounce)
- [ ] Cart item shake on quantity change
- [ ] Cart item 3D flip remove animation
- [ ] Form shake on error
- [ ] Page transitions (AnimatePresence)
- [ ] Staggered product grid entrance
- [ ] Hero 3D carousel
- [ ] Image parallax (product detail)
- [ ] Checkout credit card 3D flip
- [ ] Confetti on order confirmation
- [ ] Typewriter effect on order ID

### Phase 6: Responsive + Accessibility
- [ ] Mobile nav (hamburger SVG morph)
- [ ] Responsive grid breakpoints
- [ ] Focus-visible styles
- [ ] ARIA labels
- [ ] prefers-reduced-motion support
- [ ] Contrast ratio verification

### Phase 7: Final
- [ ] README.md
- [ ] .env.example files
- [ ] All API endpoints tested
- [ ] No console errors
- [ ] No broken imports
- [ ] Build succeeds (npm run build)

## Completed Milestones
<!-- Agent: append entries here as you complete phases -->
```

---

## 17. FINAL NOTES FOR AGENTS

1. **Never cut corners on animations** — they are the product's primary differentiator. Every effect listed must be present.
2. **TypeScript everywhere** — no `any` types except in rare edge cases (comment why).
3. **No hardcoded colors** — always use CSS variables.
4. **Three.js canvas must degrade gracefully** — if WebGL unavailable, show a CSS gradient fallback.
5. **The seed script must be idempotent** — running it twice should not duplicate products.
6. **API errors must always return** `{ success: false, message: string, error?: any }` — never crash with unhandled promise rejections.
7. **Cart state must sync** between Zustand (client) and MongoDB (server) — on page load, always fetch from server to override client state.
8. **Checkout is protected** — unauthenticated users hitting `/checkout` get redirected to `/login?redirect=/checkout` with a toast explaining why.
9. **All forms use React Hook Form + Zod** for validation — no manual `useState` form management.
10. **Update `progress.md` after every phase** with a timestamp and a one-line status note.

---

## 18. EXPANSION SPECIFICATIONS (MULTI-VENDOR & ADVANCED FEATURES)

### 18.1 Phase 8: Seller & Admin Ecosystem

**Seller Portal:**
- **Dashboard:** Glassmorphic layout with 3D-effect cards showing "Lifetime Earnings" (with a floating coin animation), "Recent Orders" (staggered list), and "Store Health".
- **Inventory Control:** A table with a "Cyberpunk" aesthetic. Products have statuses: `Draft`, `Pending Approval`, `Active`, `Rejected`.
- **Order Management:** Sellers can update order status: `Processing`, `Shipped`, `Delivered`. Each status change triggers a 3D "Stamp" animation.

**Admin Panel:**
- **System Overview:** Global stats using glowing line charts.
- **Moderation Queue:** Admins approve or reject new products from sellers. Rejection requires a reason, which is sent to the seller.
- **User Management:** Ability to promote users to `seller` or `admin`, or ban/suspend accounts.

**Backend RBAC:**
- `checkRole(['seller', 'admin'])` middleware for protected routes.
- `Product` model updated with `sellerId` and `moderationStatus`.

### 18.2 Phase 9: Marketplace Features (Advanced)

**Product Reviews & Social Proof:**
- **Review System:** Users who purchased a product can leave a review. Reviews include a "Verified Purchase" badge that glows.
- **Star Ratings:** 3D animated stars that "fill up" based on the average rating.
- **Social Sharing:** "Share to 3rd Dimension" button that generates a high-quality product preview card for social media.

**Advanced Search & Discovery:**
- **Search-as-you-type:** Results appear in a glassmorphic overlay with thumbnails and prices.
- **Category Tree:** Deep-nested categories with a "Drill-down" animation.
- **Wishlist Sync:** Wishlist is saved to the database. When a wishlist item goes on sale, the user gets a "Neon Notification".

**Real-time Interaction:**
- **Socket.io Integration:** 
  - "Someone just bought this!" toast notifications.
  - Live order tracking updates.
  - Seller chat (optional/deferred).

### 18.3 Phase 10: Immersive Visualizations & 3D Polish

**3D Product Exploration:**
- **GLB/GLTF Viewer:** Use `@google/model-viewer` for high-fidelity 3D exploration.
- **3D Exploded View:** (For electronics) Clicking "Details" triggers a 3D animation where the product parts separate.

**Interactive Analytics:**
- **Revenue Charts:** Recharts with custom `linearGradient` fills matching the Kaleido color palette.
- **Traffic Heatmap:** A 3D globe visualization (Three.js) showing where orders are coming from.

**Final Polish:**
- **Advanced Shaders:** Custom noise and chromatic aberration effects on the hero canvas.
- **Deployment Ready:** CI/CD pipeline setup for production stability.

---

## 19. REVISED PROGRESS TRACKING

### Phase 8: Seller & Admin Ecosystem
- [x] Role-based access control (RBAC) implementation
- [x] Seller Registration & Onboarding flow
- [x] Seller Dashboard (Analytics, Sales charts, Recent orders)
- [x] Inventory Management (CRUD for products with status)
- [x] Admin Control Center (Moderation, User management, System stats)
- [x] Seller-specific order fulfillment workflow

### Phase 9: Marketplace Features (Advanced)
- [x] Product Reviews (Rich text + Star ratings)
- [x] Advanced Search (Search-as-you-type, Category filtering)
- [x] Wishlist Persistence (Syncing with DB)
- [x] Real-time Order Status Notifications (Socket.io)
- [x] Coupon & Voucher System

### Phase 10: Immersive Visualizations & 3D Polish
- [ ] 3D GLB/GLTF Model Viewer integration
- [ ] Interactive Data Charts (Earnings & Traffic)
- [ ] 3D "Supply Chain" Tracking Animation
- [ ] Advanced Glassmorphism Shaders for Dashboards
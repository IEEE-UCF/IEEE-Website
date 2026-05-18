# IEEE UCF Website — Styling Guide

This document is the source of truth for how we style the IEEE UCF website. All colors, typography, spacing, and component patterns should follow what's defined here. The goal is one look across every page, including admin.

For a plain-English explanation of how `globals.css`, Tailwind v4 `@theme`, semantic tokens, shadcn components, and app components fit together, see `docs/STYLING-ARCHITECTURE.md`.

---

## Table of Contents

1. [How the token system works](#1-how-the-token-system-works)
2. [Color palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Common component patterns](#4-common-component-patterns)
5. [Gradients and backgrounds](#5-gradients-and-backgrounds)
6. [Animations](#6-animations)
7. [Anti-patterns — what not to write](#7-anti-patterns--what-not-to-write)

---

## 1. How the token system works

We use **Tailwind CSS v4** with its `@theme` directive. Tokens defined in `src/app/globals.css` under `@theme` are automatically available as Tailwind utility classes — no config file needed.

```css
/* globals.css */
@theme {
  --color-ieee-dark-yellow: #ffc72c;
  --font-heading: heading-font, sans-serif;
}
```

This gives you:

```tsx
// These work out of the box — no brackets, no var()
<div className="bg-ieee-dark-yellow font-heading" />
```

Tailwind generates `bg-ieee-*`, `text-ieee-*`, `border-ieee-*`, `ring-ieee-*`, `from-ieee-*`, `to-ieee-*`, `fill-ieee-*`, and `stroke-ieee-*` for every color token. Font tokens generate `font-*` utilities.

The CSS variables themselves (`--color-ieee-*`) are also available for use inside arbitrary Tailwind values and plain CSS when you need them in a context that can't use a utility class (e.g., inside a gradient string).

---

## 2. Color palette

### IEEE brand colors

| Token | Utility class | Hex | Usage |
|---|---|---|---|
| `--color-ieee-black` | `ieee-black` | `#000000` | True black backgrounds |
| `--color-ieee-near-black` | `ieee-near-black` | `#0c0a09` | Main surface / card backgrounds |
| `--color-ieee-warm-dark` | `ieee-warm-dark` | `#3d3110` | Warm gradient stops, section dividers |
| `--color-ieee-dark-grey` | `ieee-dark-grey` | `#2d2d2d` | Secondary surfaces, borders, muted backgrounds |
| `--color-ieee-grey` | `ieee-grey` | `#75787b` | Muted text, inactive states, dividers |
| `--color-ieee-light-grey` | `ieee-light-grey` | `#acb1b6` | Secondary/supporting text |
| `--color-ieee-white` | `ieee-white` | `#ffffff` | Same as `white` — prefer `white` for clarity |
| `--color-ieee-dark-yellow` | `ieee-dark-yellow` | `#ffc72c` | Primary accent — buttons, active nav, headings |
| `--color-ieee-bright-yellow` | `ieee-bright-yellow` | `#ffd100` | Hover states, glow effects, highlights |

### How to choose between the two yellows

- **`ieee-dark-yellow`** is the default accent. Use it for filled buttons, active indicators, and section headings.
- **`ieee-bright-yellow`** is the hover/interaction state. Use it for `hover:text-ieee-bright-yellow`, glow gradients, and focus rings.

```tsx
// Correct
<button className="bg-ieee-dark-yellow hover:bg-ieee-bright-yellow text-black">
  Join Us
</button>

// Also correct — yellow text that glows brighter on hover
<a className="text-ieee-dark-yellow hover:text-ieee-bright-yellow transition-colors">
  Learn More
</a>
```

### Text color hierarchy

| Context | Class |
|---|---|
| Primary content, headings | `text-white` |
| Supporting / secondary text | `text-ieee-light-grey` |
| Muted / timestamps / metadata | `text-ieee-grey` |
| Accent / brand emphasis | `text-ieee-dark-yellow` |
| Hover / interactive accent | `hover:text-ieee-bright-yellow` |
| Destructive actions | `text-red-400` (Tailwind built-in, dark-mode-friendly) |
| Success states | `text-green-400` |

### Background hierarchy

| Layer | Class | Notes |
|---|---|---|
| Page background | `bg-ieee-black` or `bg-ieee-near-black` | Full-page wrapper |
| Card / panel surface | `bg-ieee-near-black` | Most content cards |
| Elevated surface | `bg-ieee-dark-grey/60` | Overlays, secondary panels |
| Subtle fill | `bg-ieee-dark-grey/40` | Hover states, inactive areas |
| Border | `border-ieee-dark-grey` | Default card borders |
| Accent border | `border-ieee-bright-yellow` | Focus rings, highlighted cards |

---

## 3. Typography

All fonts are Open Sans variants loaded from `/public/fonts/`. They are registered as Tailwind utilities — use the utility class, never the raw font-family name.

### Font scale

| Utility | Weight | Use for |
|---|---|---|
| `font-display` | ExtraBold | Hero section titles only |
| `font-display-italic` | ExtraBold Italic | Decorative hero text |
| `font-heading` | Bold | Page headings, section titles, button labels, nav labels |
| `font-heading-italic` | Bold Italic | Rarely used — pull quotes |
| `font-subheading` | Medium | Card titles, accordion triggers, form labels |
| `font-subheading-italic` | Medium Italic | Taglines, emphasized supporting text |
| `font-body` | Light | Body copy, nav links, descriptions |
| `font-body-italic` | Light Italic | Captions, secondary descriptions |

### Text size + font pairings

```tsx
// Hero (home page only)
<h1 className="font-display text-ieee-bright-yellow text-7xl lg:text-8xl">
  IEEE UCF
</h1>

// Page header (events, about, connect, etc.)
<h1 className="font-heading text-ieee-bright-yellow text-5xl sm:text-6xl">
  Events
</h1>

// Section heading
<h2 className="font-heading text-white text-2xl">
  Upcoming Events
</h2>

// Card title
<h3 className="font-subheading text-white text-xl">
  General Meeting
</h3>

// Body copy
<p className="font-body text-white text-xl lg:text-2xl">
  Join us for our next general meeting.
</p>

// Supporting / secondary text
<p className="font-body text-ieee-light-grey text-base">
  Hosted in the Engineering building.
</p>

// Metadata (timestamp, tags)
<span className="font-body text-ieee-grey text-sm">
  Jan 15, 2025
</span>

// Button label
<span className="font-heading text-sm tracking-wide uppercase">
  Register
</span>

// Nav link
<a className="font-body text-white hover:text-ieee-dark-yellow transition-colors">
  About
</a>
```

### Letter spacing

Upper-cased labels (nav section titles, tags, badge text) should use `tracking-[0.2em]` for legibility:

```tsx
<span className="font-heading text-xs tracking-[0.2em] text-ieee-dark-yellow uppercase">
  IEEE UCF
</span>
```

---

## 4. Common component patterns

### Glow button

The standard call-to-action pattern across the site. A filled button with a blurred gradient halo that brightens on hover.

```tsx
<div className="relative group w-fit">
  {/* Glow layer */}
  <div className="absolute -inset-1 bg-gradient-to-r from-ieee-bright-yellow to-ieee-bright-yellow rounded-sm blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
  {/* Button */}
  <button className="relative px-8 py-3 bg-ieee-dark-yellow text-black font-heading rounded-sm hover:bg-ieee-bright-yellow transition-colors">
    Get Started
  </button>
</div>
```

### Dark card

```tsx
<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
  <h3 className="font-subheading text-white text-xl mb-2">Card Title</h3>
  <p className="font-body text-ieee-light-grey text-base">Card description text.</p>
</div>
```

### Animated border card (spin-glow ring)

Used on the about page flip card and event cards. A conic gradient ring that spins behind the card.

```tsx
<div className="relative group">
  {/* Spinning conic ring — sits behind the card */}
  <div className="animated-border pointer-events-none absolute inset-0 z-0 rounded-2xl bg-[conic-gradient(var(--color-ieee-bright-yellow)_20deg,transparent_120deg)] animate-spin-slow" />
  {/* Card content — positioned above the ring */}
  <div className="relative z-10 bg-ieee-near-black rounded-2xl p-6 text-white">
    Content here
  </div>
</div>
```

### Skill / tag badge

```tsx
// Hardware tag
<span className="font-body text-white text-sm px-3 py-1 rounded-sm bg-ieee-light-grey">
  Hardware
</span>

// Software tag
<span className="font-body text-white text-sm px-3 py-1 rounded-sm bg-ieee-grey">
  Software
</span>

// Status / team tag
<span className="font-subheading text-white text-sm px-3 py-1 rounded-sm bg-ieee-dark-grey">
  Active
</span>
```

### Form inputs (dark theme)

```tsx
<label className="block text-sm font-subheading text-ieee-light-grey mb-1">
  Email
</label>
<input
  className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-md
             placeholder:text-ieee-grey
             focus:outline-none focus:ring-2 focus:ring-ieee-bright-yellow focus:border-ieee-bright-yellow"
/>
```

### Section divider heading

```tsx
<div className="text-ieee-dark-yellow font-heading text-xl tracking-[0.2em] uppercase mb-4">
  Resources
</div>
```

---

## 5. Gradients and backgrounds

### Hero radial gradient

The standard full-page hero background — near-black center, yellow glow at the bottom edge.

```tsx
<div className="[background:radial-gradient(125%_125%_at_50%_10%,var(--color-ieee-near-black)_40%,var(--color-ieee-dark-yellow)_100%)]" />
```

The `animated-background` variant adds a slow pan animation:

```tsx
<div className="animated-background [background:radial-gradient(125%_125%_at_50%_10%,var(--color-ieee-near-black)_5%,transparent_100%)]" />
```

### Section transition gradient

Used between hero sections and content sections to blend from near-black into warm dark:

```tsx
<div className="[background:radial-gradient(125%_125%_at_50%_10%,var(--color-ieee-warm-dark)_40%,var(--color-ieee-black)_100%)]" />
```

### Rule for gradients

- Always use `var(--color-ieee-*)` inside gradient strings — never bare hex codes like `#0c0a09` or `#FFC72C`.
- The CSS variables are set by the `@theme` block, so they're always in sync with the design tokens.

---

## 6. Animations

We have three animation systems in the project. Use them for the right job:

| System | Use for |
|---|---|
| **CSS keyframes** (`globals.css`) | Simple, looping utility animations: `.float`, `.typewriter`, `.animated-border`, `.animated-background`, `.particles-container` |
| **GSAP + ScrollTrigger** | Scroll-driven entrance animations (fade in on scroll, stagger reveal, parallax) |
| **Tailwind** (`animate-spin`, `animate-pulse`) | Icon spinners, loading states |

**Framer Motion** is in `package.json` but is not currently used for any production animations. Don't add new Framer Motion usage without first discussing — GSAP already handles scroll animation.

### Available CSS animation classes

```tsx
<div className="float">          {/* gentle up/down bob, 4s loop */}
<div className="typewriter">     {/* typing + cursor blink */}
<div className="animated-border">{/* rotating conic gradient border */}
<div className="animated-background"> {/* slow background pan */}
<div className="particles-container"> {/* particle field wrapper */}
  <div className="particle" />  {/* individual floating particle */}
```

---

## 7. Anti-patterns — what not to write

These patterns were in the codebase before and should not be reintroduced.

### ❌ Raw CSS variables in Tailwind classes

```tsx
// Wrong — verbose and bypasses the token system
<div className="text-[var(--ieee-bright-yellow)]" />

// Right — uses the generated utility
<div className="text-ieee-bright-yellow" />
```

### ❌ Arbitrary font values

```tsx
// Wrong — not discoverable, no autocomplete
<div className="font-[heading-font]" />

// Right
<div className="font-heading" />
```

### ❌ Generic font name strings

```tsx
// Wrong — not a registered token
<div className="font-['Open Sans']" />

// Right — pick the appropriate weight
<div className="font-body" />      // Light
<div className="font-subheading" /> // Medium
<div className="font-heading" />    // Bold
```

### ❌ Hardcoded hex in Tailwind classes

```tsx
// Wrong — hardcoded color, invisible to the token system
<div className="bg-[#0c0a09]" />
<div className="bg-[#ffc72c]" />

// Right
<div className="bg-ieee-near-black" />
<div className="bg-ieee-dark-yellow" />
```

### ❌ Hardcoded hex inside gradient strings

```tsx
// Wrong
<div className="[background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_40%,#FFC72C_100%)]" />

// Right — use the CSS variables
<div className="[background:radial-gradient(125%_125%_at_50%_10%,var(--color-ieee-near-black)_40%,var(--color-ieee-dark-yellow)_100%)]" />
```

### ❌ Generic Tailwind grays for brand text

```tsx
// Wrong — creates visual inconsistency with the IEEE palette
<p className="text-gray-400" />
<p className="text-gray-600" />

// Right
<p className="text-ieee-light-grey" />  // secondary text
<p className="text-ieee-grey" />        // muted / metadata
```

### ❌ Light/white admin components

Admin pages should use the same dark IEEE theme as the rest of the site. Do not use `bg-white`, `bg-gray-50`, `bg-gray-100`, or `shadow-md` without a dark background wrapper.

```tsx
// Wrong — looks like a different product
<div className="bg-white rounded-lg shadow-md p-6">

// Right
<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
```

### ❌ Adding new color values without a token

If a new color is needed (e.g., a new brand extension), add it to `@theme` in `globals.css` first, then use the generated utility. Never introduce a one-off hex without a token.

---

*Last updated: 2026-05-18 — reflects the `style/unify-design-tokens-and-typography` migration.*

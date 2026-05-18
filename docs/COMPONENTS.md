# IEEE UCF Website — Component & Interactive Element Guide

This document covers every interactive pattern used on the site: buttons, links, form inputs, cards, and state feedback. For color tokens and typography, see [STYLING.md](./STYLING.md).

---

## Table of Contents

1. [Button variants](#1-button-variants)
2. [GlowButton — the marquee CTA](#2-glowbutton--the-marquee-cta)
3. [Link elements](#3-link-elements)
4. [Form inputs](#4-form-inputs)
5. [Cards](#5-cards)
6. [Hover and interaction states](#6-hover-and-interaction-states)
7. [Disabled states](#7-disabled-states)
8. [Status and feedback](#8-status-and-feedback)
9. [Anti-patterns](#9-anti-patterns)

---

## 1. Button variants

The Shadcn `<Button>` component (`src/components/ui/button.tsx`) is configured with six IEEE-branded variants. Use it for all standard buttons. All variants use `font-heading` and `rounded-sm` by default.

```tsx
import { Button } from '@/components/ui/button';
```

### `default` — Primary action

Filled yellow. Use for the single most important action in a view (submit, register, scan).

```tsx
<Button>Join IEEE UCF</Button>
<Button size="lg">Register Now</Button>
<Button size="sm">Save</Button>
```

Visual: `bg-ieee-dark-yellow text-black hover:bg-ieee-bright-yellow`

### `secondary` — Supporting action

Dark grey surface. Use for secondary actions that sit alongside a primary (cancel, go back, close).

```tsx
<Button variant="secondary">Cancel</Button>
<Button variant="secondary">Close</Button>
```

Visual: `bg-ieee-dark-grey text-white hover:bg-ieee-grey`

### `outline` — Low-emphasis / bordered

Transparent with a grey border that turns yellow on hover. Use for filter pills, tag buttons, or secondary emphasis without heavy visual weight.

```tsx
<Button variant="outline">Gold Tier</Button>
<Button variant="outline" size="sm">Filter</Button>
```

Visual: `border border-ieee-grey text-white hover:border-ieee-bright-yellow hover:text-ieee-bright-yellow`

### `ghost` — Icon actions / subtle

No background, text turns yellow on hover. Use for icon-only buttons (close ×, expand ›) and inline actions where a filled button would be too heavy.

```tsx
<Button variant="ghost" size="icon">
  <XMarkIcon />
</Button>
<Button variant="ghost">View Details</Button>
```

Visual: `text-white hover:text-ieee-bright-yellow`

### `destructive` — Irreversible actions

Red. Use only for sign out, delete, or any action that cannot be undone.

```tsx
<Button variant="destructive">Sign Out</Button>
<Button variant="destructive">Delete Account</Button>
```

Visual: `bg-red-700 text-white hover:bg-red-600`

### `link` — Inline hyperlink style

Yellow underline on hover. Use inside body text when you need a clickable word or phrase that should look like a hyperlink.

```tsx
<Button variant="link">Learn more</Button>
```

Visual: `text-ieee-dark-yellow hover:text-ieee-bright-yellow hover:underline`

### Size variants

| Size | Height | Use for |
|---|---|---|
| `sm` | 32px | Dense UI, table rows, tag actions |
| `default` | 36px | Standard forms, admin panels |
| `lg` | 44px | Primary CTA in a form or modal |
| `icon` | 36×36px | Icon-only buttons (close, expand, toggle) |

### Using Button as a link (`asChild`)

When the button should navigate, use `asChild` with Next.js `<Link>` so the semantics are correct:

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

<Button asChild>
  <Link href="/events">View Events</Link>
</Button>

<Button variant="outline" asChild>
  <Link href="/about">Learn More</Link>
</Button>
```

---

## 2. GlowButton — the marquee CTA

`GlowButton` (`src/components/ui/glow-button.tsx`) is the two-layer animated CTA used for high-visibility call-to-action moments — hero sections, sponsorship CTAs, and page-level prompts. It is **not** a replacement for `<Button>` in forms or admin panels.

```tsx
import { GlowButton } from '@/components/ui/glow-button';
```

### Basic usage

```tsx
<GlowButton>
  <span className="text-white font-heading">Join IEEE UCF</span>
</GlowButton>
```

### As a navigation link

Wrap in Next.js `<Link>` — GlowButton handles the visual shell, Link handles the routing:

```tsx
<Link href="/connect">
  <GlowButton>
    <span className="text-white font-heading">Get Involved</span>
  </GlowButton>
</Link>
```

### With an icon

```tsx
<GlowButton>
  <DiscordIcon className="w-5 h-5 text-white" />
  <span className="text-white font-heading">Sign In with Discord</span>
</GlowButton>
```

### Custom inner padding

Use `innerClassName` to override the default `px-8 py-4` if the context needs tighter or looser padding:

```tsx
<GlowButton innerClassName="px-5 py-2">
  <span className="text-white font-heading text-sm">OPEN PDF</span>
</GlowButton>
```

### When to use GlowButton vs Button

| Situation | Use |
|---|---|
| Hero section CTA | `GlowButton` |
| Sponsorship / PDF actions | `GlowButton` |
| About page flip / reveal prompt | `GlowButton` |
| Form submit | `<Button>` |
| Admin panel action | `<Button>` |
| Cancel / secondary in a form | `<Button variant="secondary">` |
| Icon-only toggle | `<Button variant="ghost" size="icon">` |

---

## 3. Link elements

### Navigation links (navbar / footer)

Text-only links that turn yellow on hover. Do not add borders or backgrounds.

```tsx
// Desktop nav link
<Link href="/events" className="font-body text-sm text-white hover:text-ieee-dark-yellow transition-colors">
  Events
</Link>

// Mobile nav link
<Link href="/about" className="font-subheading text-white hover:text-ieee-bright-yellow inline-flex h-10 w-full items-center transition-colors gap-3">
  About
</Link>

// Footer link
<Link href="/projects" className="font-body text-white hover:text-ieee-bright-yellow transition-colors">
  Projects
</Link>
```

### Social / external links

Same pattern. Include an icon to signal external navigation:

```tsx
<a
  href="https://discord.gg/ieeeucf"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-x-5 font-body text-white hover:text-ieee-bright-yellow transition-colors"
>
  <DiscordIcon className="w-6 h-6" />
  Discord
</a>
```

### Inline body links

Use `<Button variant="link">` for links inside paragraphs. For plain `<a>` in markdown or rich-text content, apply:

```tsx
<a className="text-ieee-dark-yellow hover:text-ieee-bright-yellow underline-offset-4 hover:underline transition-colors">
  Read the full report
</a>
```

---

## 4. Form inputs

All form inputs use the dark IEEE theme. The standard input pattern is:

- Background: `bg-ieee-dark-grey`
- Default border: `border-ieee-grey`
- Focus border + ring: `focus:border-ieee-bright-yellow focus:ring-ieee-bright-yellow`
- Text: `text-white`
- Placeholder: `placeholder:text-ieee-grey`

### Text input

```tsx
<div className="flex flex-col gap-1">
  <label className="text-sm font-subheading text-ieee-light-grey">
    Email Address
  </label>
  <input
    type="email"
    placeholder="you@ucf.edu"
    className="px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
               placeholder:text-ieee-grey
               focus:outline-none focus:border-ieee-bright-yellow focus:ring-1 focus:ring-ieee-bright-yellow
               transition-colors"
  />
</div>
```

### Textarea

```tsx
<textarea
  rows={4}
  placeholder="Tell us about yourself"
  className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
             placeholder:text-ieee-grey
             focus:outline-none focus:border-ieee-bright-yellow focus:ring-1 focus:ring-ieee-bright-yellow
             transition-colors resize-none"
/>
```

### Select / dropdown

```tsx
<select className="w-full px-3 py-2 bg-ieee-dark-grey border border-ieee-grey text-white rounded-sm
                   focus:outline-none focus:border-ieee-bright-yellow
                   transition-colors">
  <option value="" disabled>Select an option</option>
  <option value="hw">Hardware</option>
  <option value="sw">Software</option>
</select>
```

### Checkbox

```tsx
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="dues"
    className="h-4 w-4 accent-ieee-dark-yellow border-ieee-grey rounded"
  />
  <label htmlFor="dues" className="text-sm font-subheading text-ieee-light-grey">
    Requires dues
  </label>
</div>
```

### Form action row

Always end a form with a row of buttons. Primary action last (rightmost), secondary first:

```tsx
<div className="flex justify-end gap-2 mt-6">
  <Button variant="secondary" type="button" onClick={onClose}>
    Cancel
  </Button>
  <Button type="submit" disabled={isPending}>
    {isPending ? 'Saving...' : 'Save Changes'}
  </Button>
</div>
```

For destructive actions in the same row (e.g., sign out on the settings page), add the destructive button on the far left, separated from the main action group:

```tsx
<div className="flex justify-between items-center mt-6">
  <Button variant="destructive" type="button">
    Sign Out
  </Button>
  <div className="flex gap-2">
    <Button variant="secondary" type="button">Cancel</Button>
    <Button type="submit">Save</Button>
  </div>
</div>
```

---

## 5. Cards

### Standard dark card

```tsx
<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6">
  <h3 className="font-subheading text-white text-xl mb-2">Card Title</h3>
  <p className="font-body text-ieee-light-grey text-base">Description text.</p>
</div>
```

### Clickable / hoverable card

Add `cursor-pointer`, `transition-transform`, and `hover:scale-102`. Keep scale subtle — max `hover:scale-103`:

```tsx
<div className="bg-ieee-near-black border border-ieee-dark-grey rounded-lg p-6
                cursor-pointer transition-transform hover:scale-102 hover:border-ieee-grey">
  ...
</div>
```

### Active / selected card state

Replace the default border with bright yellow:

```tsx
<div className={`bg-ieee-near-black border rounded-lg p-6 transition-colors ${
  isSelected ? 'border-ieee-bright-yellow' : 'border-ieee-dark-grey'
}`}>
  ...
</div>
```

### Card with animated glow ring (special)

Reserved for featured cards — about page flip card, highlighted events. The conic gradient ring spins behind the card:

```tsx
<div className="relative group">
  {/* Spinning ring — lives behind the card */}
  <div className="animated-border pointer-events-none absolute inset-0 z-0 rounded-2xl
                  bg-[conic-gradient(var(--color-ieee-bright-yellow)_20deg,transparent_120deg)]
                  animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  {/* Card surface */}
  <div className="relative z-10 bg-ieee-near-black border border-ieee-dark-grey rounded-2xl p-6 text-white">
    Content here
  </div>
</div>
```

---

## 6. Hover and interaction states

### Scale on hover

Use consistent scale values. Do not mix them arbitrarily:

| Value | Use for |
|---|---|
| `hover:scale-102` | Cards, form buttons, nav items |
| `hover:scale-110` | Small icon elements, avatar images |
| `hover:scale-150` | Close / expand icon-only buttons inside cards |

### Color transitions

Always pair a color hover state with `transition-colors`:

```tsx
className="text-white hover:text-ieee-bright-yellow transition-colors"
className="bg-ieee-dark-yellow hover:bg-ieee-bright-yellow transition-colors"
className="border-ieee-grey hover:border-ieee-bright-yellow transition-colors"
```

Use `transition-all` only when multiple properties change simultaneously (e.g., color + scale together). `transition-colors` is more performant for color-only changes.

### Focus visible

The `<Button>` component handles focus-visible styling automatically (`focus-visible:ring-2 focus-visible:ring-ieee-bright-yellow`). For custom inputs and native buttons, add it manually:

```tsx
className="focus:outline-none focus:ring-2 focus:ring-ieee-bright-yellow focus:ring-offset-2 focus:ring-offset-ieee-near-black"
```

---

## 7. Disabled states

Disabled elements must be visually muted and not respond to hover:

```tsx
// Button component — handled automatically via disabled:pointer-events-none disabled:opacity-50

// Custom button or native <button>
className="... disabled:bg-ieee-grey disabled:text-ieee-dark-grey disabled:cursor-not-allowed disabled:pointer-events-none"

// Input
className="... disabled:opacity-50 disabled:cursor-not-allowed"
```

Never use `disabled:bg-gray-400` or other generic Tailwind grays — they break the visual palette.

---

## 8. Status and feedback

### Success

```tsx
<div className="flex items-center gap-3 bg-green-950 border border-green-800 rounded-lg p-4">
  <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
  <p className="font-body text-green-400 text-sm">Changes saved successfully.</p>
</div>
```

### Error

```tsx
<div className="flex items-center gap-3 bg-red-950 border border-red-800 rounded-lg p-4">
  <XCircleIcon className="w-5 h-5 text-red-400 shrink-0" />
  <p className="font-body text-red-400 text-sm">{errorMessage}</p>
</div>
```

### Warning / info

```tsx
<div className="flex items-center gap-3 bg-ieee-dark-yellow/10 border border-ieee-dark-yellow/40 rounded-lg p-4">
  <InformationCircleIcon className="w-5 h-5 text-ieee-dark-yellow shrink-0" />
  <p className="font-body text-ieee-light-grey text-sm">Note: dues are required for this event.</p>
</div>
```

### Loading spinner

Use Tailwind's built-in `animate-spin` with an SVG ring. Color with `text-ieee-dark-yellow`:

```tsx
<svg className="w-6 h-6 text-ieee-dark-yellow animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
</svg>
```

### Inline pending text (inside buttons)

```tsx
<Button type="submit" disabled={isPending}>
  {isPending ? 'Saving...' : 'Save Changes'}
</Button>
```

---

## 9. Anti-patterns

### ❌ Blue buttons anywhere on the site

Blue is not an IEEE UCF brand color. Any `bg-blue-*`, `bg-indigo-*` on a button is wrong.

```tsx
// Wrong
<button className="bg-blue-600 hover:bg-blue-700 ...">Submit</button>

// Right
<Button>Submit</Button>
// or
<button className="bg-ieee-dark-yellow hover:bg-ieee-bright-yellow text-black font-heading ...">Submit</button>
```

### ❌ Generic gray cancel / close buttons

```tsx
// Wrong
<button className="bg-gray-500 text-white ...">Close</button>

// Right
<Button variant="secondary">Close</Button>
```

### ❌ Mixing hover:scale values

```tsx
// Wrong — inconsistent across the codebase
hover:scale-103  // on one card
hover:scale-105  // on the next

// Right — pick from the standard set (102, 110, 150)
hover:scale-102
```

### ❌ Missing transition on hover color changes

```tsx
// Wrong — abrupt color snap
<button className="text-white hover:text-ieee-bright-yellow">

// Right — smooth transition
<button className="text-white hover:text-ieee-bright-yellow transition-colors">
```

### ❌ Light modal / form dialogs

Admin forms and modals must use the dark IEEE surface, not white backgrounds.

```tsx
// Wrong
<div className="bg-white p-8 rounded-lg text-black">

// Right
<div className="bg-ieee-near-black border border-ieee-dark-grey p-8 rounded-lg text-white">
```

### ❌ Using GlowButton for form actions

`GlowButton` is a decorative marketing element. Don't use it for submit, cancel, or admin actions — that's what `<Button>` is for.

```tsx
// Wrong — GlowButton in a form action row
<GlowButton onClick={handleSubmit}>
  <span>Submit Form</span>
</GlowButton>

// Right
<Button type="submit">Submit Form</Button>
```

---

*Last updated: 2026-05-18 — reflects `style/unify-design-tokens-and-typography` migration.*

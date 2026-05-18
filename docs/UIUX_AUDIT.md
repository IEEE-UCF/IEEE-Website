# IEEE UCF Website — Styling, Visual & UI/UX Audit

**Audit date:** 2026-06-22
**Branch audited:** `style/unify-design-tokens-and-typography`
**Scope:** Visual consistency, design-token adherence, responsive layout, accessibility (contrast, motion, semantics), image/performance hygiene, and leftover debris.

This document records findings only — no code has been changed. Each item lists the issue, file(s), why it matters, and the recommended fix. It complements [STYLING.md](./STYLING.md) and [COMPONENTS.md](./COMPONENTS.md), which describe the *intended* system; this audit catches where the live code diverges from it.

---

## Summary

The token migration (`@theme` colors/fonts, standardized `Button`, `GlowButton`) is a real improvement and the foundation is good. But several high-traffic surfaces — the navbar, the sign-in CTA, the settings page — were written before or around the migration and **don't follow the system the docs describe**. The most important finding is a recurring white-on-yellow contrast failure on primary call-to-action buttons.

| # | Severity | Issue | File(s) |
|---|----------|-------|---------|
| 1 | High | White text on yellow — fails contrast, on primary CTAs | navbar, signin, settings, register, avatarmenu |
| 2 | High | Global `body` background defaults to light `stone-100` | `globals.css` |
| 3 | High | `text-md` is not a real Tailwind class (used 11×) | 6 files |
| 4 | Medium | Navbar breakpoint gap: nav + hamburger both show 640–1024px | `navbar.tsx` |
| 5 | Medium | Dead "CONNECT" styling branch never renders | `navbar.tsx` |
| 6 | Medium | `/test/*` pages never migrated — old gray/blue theme | `app/test/*` |
| 7 | Medium | Settings/signin bypass the standardized `Button` | `settings/page.tsx`, `signin.tsx` |
| 8 | Medium | No `prefers-reduced-motion` for heavy animations | `globals.css`, `page.tsx` |
| 9 | Medium | Oversized images for tiny render targets; `priority` overuse | navbar, footer, `page.tsx` |
| 10 | Low | Generic/duplicate `alt` text | navbar, footer, `page.tsx` |
| 11 | Low | Footer external links missing `target`/`rel`; socials commented out | `footer.tsx` |
| 12 | Low | Missing aria labels on icon-only / toggle buttons | `navbar.tsx` |
| 13 | Low | White dropdown panels on dark theme | `settings/page.tsx` |
| 14 | Low | Leftover debris (empty bars, commented blocks, blank loading state) | multiple |
| 15 | Low | Vestigial shadcn light/dark token system never used | `globals.css` |

---

## High severity

### 1. White text on yellow background — contrast failure on primary CTAs

**Files:** `src/components/navbar.tsx:70,113,281`, `src/components/signin.tsx:14`, `src/app/settings/page.tsx:123`, `src/app/auth/register/page.tsx:136`, `src/components/avatarmenu.tsx:41,50`

The pattern `bg-ieee-dark-yellow text-white` (and the bright-yellow hover variants) appears on the **most important buttons on the site**: the "Sign In with Discord" CTA, the navbar sign-in/connect buttons, the register button, and the settings success banner.

White (`#ffffff`) on IEEE yellow (`#ffc72c`) yields a contrast ratio of roughly **1.5:1** — well below the WCAG AA minimum of 4.5:1 for normal text. The text is genuinely hard to read. Black text on the same yellow is ~13:1 (passes AAA).

This also **directly contradicts the project's own design system**: the standardized `Button` component uses `text-black` on yellow, and `COMPONENTS.md` lists white-on-yellow as an anti-pattern.

**Fix:** Replace `text-white` with `text-black` everywhere the background is `ieee-dark-yellow` / `ieee-bright-yellow`. On `avatarmenu.tsx`, the `hover:bg-ieee-bright-yellow` rows keep `text-white`, so text nearly disappears on hover — switch to `hover:text-black`.

---

### 2. Global `body` background defaults to a light color on a dark site

**File:** `src/globals.css:161-163`

```css
body {
  background: var(--color-stone-100);
}
```

The entire site is a dark theme, but the base `body` background is a near-white stone color. Most pages paper over this by setting their own `bg-black`, but any page (or any brief moment before content paints, or any gap/overscroll area) shows a jarring light background. `--color-stone-100` is also a default Tailwind token, not an IEEE brand token — inconsistent with the unification effort.

**Fix:** Set `body { background: var(--color-ieee-black); color: var(--color-ieee-white); }` so the dark theme is the floor, and remove redundant per-page `bg-black` where appropriate.

---

### 3. `text-md` is not a valid Tailwind class

**Files (11 uses):** `src/app/settings/page.tsx:242,261`, `src/components/navbar.tsx:186,205,233,262`, `src/components/signin.tsx:23`, `src/components/pg/aboutheader.tsx:40`, `src/components/pg/aboutofficers.tsx:196`, `src/components/pg/eventsidebar.tsx:213,214`

Tailwind's scale is `text-sm` → `text-base` → `text-lg`. There is **no `text-md`** — every one of these silently does nothing, so the intended font size never applies and the element falls back to inherited size. This is a common mistake but it's load-bearing here (e.g. the two settings buttons use `text-md` and `text-lg` and were presumably meant to match).

**Fix:** Replace `text-md` with `text-base` (the intended "medium" size).

---

## Medium severity

### 4. Navbar responsive breakpoint gap

**File:** `src/components/navbar.tsx:63,129`

The desktop nav is shown with `sm:flex hidden` (visible at ≥640px), but the hamburger button is hidden with `lg:hidden` (visible at <1024px). Between **640px and 1024px both the full desktop nav and the hamburger button render at the same time**. The two controls should switch at the same breakpoint.

**Fix:** Align the breakpoints — e.g. desktop nav `hidden lg:flex` and hamburger `lg:hidden`.

---

### 5. Dead "CONNECT" styling branch

**File:** `src/components/navbar.tsx:69-84`

The code branches on `route.title === "CONNECT"` to render a special glow-button treatment, but the route title is defined as `"Connect"` (line 14). The string comparison never matches, so the Connect link silently renders as a plain text link and the intended highlighted CTA never appears.

**Fix:** Compare against the actual title (`"Connect"`), or normalize case. Better: use the shared `GlowButton` component for this CTA instead of an inline reimplementation.

---

### 6. `/test/*` pages were never migrated to the IEEE theme

**Files:** `src/app/test/test-qr/page.tsx`, `src/app/test/show-id/page.tsx`, `src/app/test/scan-qr/page.tsx`

These pages still use the pre-migration light theme — `bg-gray-100`, `bg-gray-50`, `bg-blue-600 hover:bg-blue-700`, `bg-gray-400`, `text-gray-700`. They look like a different product, and they're surfaced to admins directly from the navbar ("Demo Event Scanner", "Testing" — `navbar.tsx:29-33`). See also the security audit (#3) recommending these not ship to production at all.

**Fix:** Either delete the test pages before launch, or restyle them with IEEE tokens if they must remain. Remove their links from the production navbar regardless.

---

### 7. Settings and sign-in bypass the standardized `Button` component

**Files:** `src/app/settings/page.tsx:240-264`, `src/components/signin.tsx:12-20`

The settings Save/Cancel/Sign-Out buttons and the Discord sign-in button reimplement button styling inline rather than using the `Button` component's variants. Consequences: Sign Out uses `bg-red-600` while the `destructive` variant is `bg-red-700` (slightly off); Save uses the dead `text-md`; and all three duplicate styling the design system already centralizes.

**Fix:** Use `<Button variant="secondary">` for Cancel, `<Button variant="destructive">` for Sign Out, and the default variant for Save. This also fixes the white-on-yellow and `text-md` issues for free.

---

### 8. No `prefers-reduced-motion` support for heavy animations

**Files:** `src/globals.css` (`float`, `float-up-down` particles, `typewriter`, `chase-border` spin), `src/app/page.tsx` (GSAP scroll reveals)

The homepage runs several continuous/large-motion animations — floating hero, six floating particles, a typewriter caret, spinning conic-gradient card borders, and scroll-triggered slide-ins — with no reduced-motion fallback. Users with vestibular sensitivity (and the OS "reduce motion" setting) get no relief. None of the custom CSS or the GSAP setup checks the media query.

**Fix:** Wrap continuous animations in `@media (prefers-reduced-motion: no-preference) { ... }`, or add a global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }` and guard the GSAP calls with `window.matchMedia('(prefers-reduced-motion: reduce)')`.

---

### 9. Oversized images for tiny render targets; `priority` overuse

**Files:** `src/components/navbar.tsx` (icons `width={2000} height={2000}` rendered at `h-7 w-7` = 28px), `src/components/footer.tsx:26-32` (`2000×2000` rendered at 96–160px, `alt="Events Photo"`), `src/app/page.tsx:106-112` (hero `3000×3000`), `:174-180` (all 5 carousel GIFs marked `priority`)

Declaring 2000–3000px intrinsic sizes for elements painted at 28–160px wastes bandwidth and hurts LCP. Marking every carousel slide `priority` defeats the purpose — `priority` should be reserved for the single above-the-fold LCP image; applying it to all five forces eager loading of large GIFs.

**Fix:** Set realistic `width`/`height` (or use `sizes`) matching render size; keep `priority` on at most the hero image; lazy-load carousel slides. Consider converting decorative GIFs to video/`<Image>`-friendly formats.

---

## Low severity / polish

### 10. Generic and duplicate `alt` text
Nav icons all use `alt="Profile"` (`navbar.tsx`), carousel images use `alt="Photo"` (`page.tsx:176`), footer logo uses `alt="Events Photo"` (`footer.tsx:30`). Screen-reader users hear meaningless or wrong labels. Use descriptive alt (or `alt=""` for purely decorative icons paired with visible text labels).

### 11. Footer external links and missing socials
**File:** `src/components/footer.tsx` — the IEEE policy links (lines 58-91) navigate in the same tab; external links should have `target="_blank" rel="noopener noreferrer"`. The entire social-media icon block (Instagram/LinkedIn/YouTube/Facebook/GitHub) is commented out (lines 10-17), so the footer ships with no social links despite the org having all of them.

### 12. Missing aria labels on icon-only / toggle buttons
**File:** `src/components/navbar.tsx:127-136` — the hamburger toggle has no `aria-label` and no `aria-expanded`, so its purpose and state are invisible to assistive tech. Add `aria-label="Toggle menu"` and `aria-expanded={menuOpen}`.

### 13. White dropdown panels on a dark theme
**File:** `src/app/settings/page.tsx:173,186` — `<SelectContent className="bg-white">` renders white dropdowns on the otherwise-dark settings form. Readable but visually jarring and inconsistent. Restyle with `bg-ieee-near-black` + light text to match.

### 14. Leftover debris
- `src/components/footer.tsx:22` — an empty `<div className="bg-accent w-full">` paints a thin light bar (shadcn `accent` token) at the top of the footer.
- `src/components/footer.tsx:1` — "i stole the component i made from another project... will edit later".
- `src/components/navbar.tsx:122,158-163` — commented-out logo/markup blocks.
- `src/app/dashboard/page.tsx:18,44` — commented-out sections still carrying `bg-gray-900/60`.
- `src/app/settings/page.tsx:96-100` — the loading state is a bare empty gradient `<div>` with no spinner or skeleton, so it reads as a broken/blank page while the profile loads.
- `src/app/admin/dashboard/page.tsx:28-31` — stray empty `<Card>` with loose "Event Check-In" text (also noted in the security audit).

### 15. Vestigial shadcn light/dark token system
**File:** `src/globals.css:77-144` — full `:root` (light) and `.dark` OKLch palettes are defined, but the site is hardcoded to IEEE dark colors and never toggles a theme. The shadcn token layer adds maintenance surface (and the misleading light defaults behind finding #2) without being used. Either wire up a real theme toggle or prune the unused palette down to what the shadcn primitives actually consume.

---

## Recommended fix order

Quick, high-impact, low-risk first:

1. White-on-yellow → black text (#1) — accessibility + brand consistency, mechanical change
2. `text-md` → `text-base` (#3) — mechanical find/replace, 11 sites
3. `body` dark background (#2) — one rule
4. Navbar breakpoint + dead CONNECT branch (#4, #5)
5. Route settings/signin through `Button` (#7) — resolves #1 and #3 there too
6. Reduced-motion fallback (#8) — one global media query + GSAP guard

`/test/*` cleanup (#6) and the token-system decision (#15) are product calls — confirm before acting.

---

*This audit reflects the named branch as of the audit date. Re-audit after the high-severity items land, ideally with a live contrast checker and a screen-reader pass.*

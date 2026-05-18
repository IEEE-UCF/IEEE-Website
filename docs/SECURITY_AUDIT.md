# IEEE UCF Website — Security & Stability Audit

**Audit date:** 2026-06-22
**Branch audited:** `style/unify-design-tokens-and-typography`
**Scope:** Authentication, authorization, tRPC API surface, database access, middleware, secrets handling, deployment configuration.

This document records findings only. Nothing here has been changed in code yet — each item lists the issue, the file, the risk, and the recommended fix so it can be triaged and scheduled.

---

## Summary

The authorization layer is fundamentally sound. Every tRPC mutation is gated by the correct procedure (`adminProcedure` / `officerProcedure` / `memberProcedure`), all inputs are Zod-validated, Drizzle parameterizes every query (no SQL-injection surface), and no secrets are committed to the repository (`.env` is gitignored, git history is clean, dev TLS certs are local-only and ignored).

The findings below are hardening gaps and deployment-readiness issues, not active breaches. They are ordered by severity.

| # | Severity | Issue | File |
|---|----------|-------|------|
| 1 | High | PII logged on every request | `src/lib/trpc/trpc.ts` |
| 2 | High | No security headers / CSP | `next.config.ts` |
| 3 | High | Public dev/showcase pages world-accessible | `src/app/component-showcase`, `src/app/style-guide` |
| 4 | Medium | Internal DB error messages leaked to clients | all routers |
| 5 | Medium | Protected-route middleware only checks cookie existence | `src/middleware.ts` |
| 6 | Medium | No rate limiting | API surface |
| 7 | Medium | `.gitignore` misses some env variants | `.gitignore` |
| 8 | Medium | Officers can read full member PII | `src/lib/trpc/routers/member.ts` |
| 9 | Low | Leftover UI debris in admin dashboard | `src/app/admin/dashboard/page.tsx` |
| 10 | Low | Dead code in tRPC context | `src/lib/trpc/trpc.ts` |
| 11 | Low | Per-request self-fetch in middleware | `src/middleware.ts` |
| 12 | Low | QR identity is unsigned | `src/lib/trpc/routers/event.ts` |
| 13 | Low | `any` types in scan hook | `src/components/pg/memberqrcode-scan.ts` |

---

## High severity — address before deploying

### 1. PII logged on every request

**File:** `src/lib/trpc/trpc.ts:33`

```ts
console.log('>>> tRPC Request from', source, 'by', session?.user);
```

`session.user` contains the member's name, email, Discord ID, and admin flags. This writes member PII to server logs on **every** tRPC call — a privacy/compliance concern and log noise in production.

**Fix:** Gate behind `process.env.NODE_ENV === 'development'`, or remove. The `[TRPC] <path> took <n>ms` timing log on line 73 should likewise be dev-only.

---

### 2. No security headers / Content-Security-Policy

**File:** `next.config.ts`

There is no `headers()` block. The site ships without HSTS, `X-Frame-Options` / `frame-ancestors` (clickjacking protection), `X-Content-Type-Options`, `Referrer-Policy`, or a Content-Security-Policy. This is the single largest deployment gap.

**Fix:** Add an async `headers()` function returning a baseline set:

```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(self), geolocation=()' },
      // Add a Content-Security-Policy once script/style sources are inventoried.
    ],
  }];
}
```

Note: `camera=(self)` must remain enabled because the QR scanner needs camera access.

---

### 3. Public dev/showcase pages are world-accessible

**Files:** `src/app/component-showcase/page.tsx`, `src/app/style-guide/page.tsx`, `src/app/test/*`

Neither showcase page is in the middleware's `protectedRoutes` or `adminRoutes`. `/component-showcase` mounts the **real** `QREventScanner` and `FormPopup` wired to live tRPC. Server-side mutations remain admin-gated (nothing can actually be created/scanned by an anonymous visitor), but exposing the admin event-creation UI — and triggering a camera-permission prompt — on a public URL is poor posture.

**Fix:** Either gate these routes behind admin in `src/middleware.ts`, or exclude them from production builds (e.g. render a 404 when `NODE_ENV === 'production'`). The `/test/*` routes are already admin-gated by middleware but ideally should not ship to production at all.

---

## Medium severity

### 4. Internal error messages leaked to clients

**Files:** all routers — e.g. `src/lib/trpc/routers/event.ts:141`, `src/lib/trpc/routers/member.ts:111`

```ts
message: error instanceof Error ? error.message : 'Failed to ...'
```

Raw database errors (constraint names, column details) propagate to the client. This leaks schema internals.

**Fix:** In production, log the real error server-side and return a generic message to the client. A small helper that branches on `NODE_ENV` keeps this DRY across routers.

---

### 5. Protected-route middleware only checks cookie existence

**File:** `src/middleware.ts:16-23`

`/dashboard` and `/settings` only check that a `next-auth.session-token` cookie *exists* — any non-empty value passes the redirect gate and renders the page shell. Data is safe because tRPC re-validates the session server-side, but a forged cookie still reaches the authenticated UI shell. The `/admin` path does a proper session fetch and is not affected.

**Fix:** Apply the same session-validation fetch used for admin routes to protected routes, or accept this as defense-in-depth (the real protection is at the data layer) and document the decision.

---

### 6. No rate limiting

**Scope:** entire API surface (`/api/trpc`, `/api/auth`)

`completeRegistration`, the Discord auth flow, and all public queries have no throttling. On a public deployment this invites abuse and scraping.

**Fix:** Add edge rate limiting (e.g. Vercel + Upstash Redis) on at least `/api/trpc` and `/api/auth`.

---

### 7. `.gitignore` does not cover all env variants

**File:** `.gitignore`

It ignores exact `.env` and `.env*.local`, but **`.env.production` and `.env.development` would be committed** if created. A real production env file could be pushed by accident.

**Fix:** Replace the `.env` rule with `.env*` plus an explicit `!.env.example` allow-list.

---

### 8. Officers can read full member PII

**File:** `src/lib/trpc/routers/member.ts:141` (`getById`)

`getById` is an `officerProcedure` that returns the entire member row — including date of birth, personal email, and phone number — to any officer. Compare with `src/lib/trpc/routers/officer.ts`, which correctly projects only public fields.

**Fix:** If officers should not see DOB / personal email, project a narrower field set (principle of least privilege). If this access is intended, document it.

---

## Low severity / stability

### 9. Leftover UI debris in admin dashboard

**File:** `src/app/admin/dashboard/page.tsx:28-31` — an empty `<Card>` containing a stray "Event Check-In" text node. Appears accidental; remove.

### 10. Dead code in tRPC context

**File:** `src/lib/trpc/trpc.ts:15-23` — `isomorphicGetSession` has two identical branches; the `Authorization`-header check does nothing. Simplify to a single `getServerSession` call.

### 11. Per-request self-fetch in middleware

**File:** `src/middleware.ts:33` — every `/admin` and `/test` request performs a server-side `fetch('/api/auth/session')`, adding latency. This is an accepted limitation of database session strategy (cannot use `getToken` to read the role from a JWT), but worth knowing as a performance cost.

### 12. QR identity is unsigned

**File:** `src/lib/trpc/routers/event.ts:184` (`addAttendee`)

Check-in trusts a plaintext Discord ID embedded in the member QR code. This is acceptable given officer-gating plus the duplicate-check (CONFLICT) and dues guards, but anyone who knows a member's Discord ID could be checked in by an officer. Documented as accepted risk for an attendance system.

### 13. `any` types in scan hook

**File:** `src/components/pg/memberqrcode-scan.ts` — `result: any` and `data?: any` weaken type safety in the scan-parsing path. Tighten to typed shapes.

---

## Recommended pre-deploy order

Quick, low-risk, self-contained items first:

1. Remove/gate PII logging (#1) — one line
2. Add security headers (#2)
3. Generic production error messages (#4)
4. `.gitignore` env fix (#7)
5. Gate or exclude showcase + test pages (#3)

Items #3 and #6 involve product decisions (delete the showcase pages vs. admin-gate them; choice of rate-limit provider) and should be confirmed before implementation.

---

*This audit covers code on the named branch as of the audit date. Re-audit after the high-severity items are addressed and before any public production launch.*

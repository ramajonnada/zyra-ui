# Security Practices

This file tracks security-relevant decisions, past fixes, and standing rules for this repo.
Update it whenever a real vulnerability is found and fixed, or a new practice is adopted — don't
let this go stale the way a "someday" doc would.

For the Phase 2 (Pro/backend) build order and full checklist, see
[PHASE2_LAUNCH_CHECKLIST.md](PHASE2_LAUNCH_CHECKLIST.md) — its architecture table and build order
should stay consistent with the rules below.

---

## Standing rules — apply to every change

1. **Never bypass Angular's built-in sanitization.** Avoid `bypassSecurityTrustHtml()` and
   directly setting `innerHTML` with content that came from a user or any untrusted source, unless
   it's been sanitized through a trusted library first. Normal template binding (`{{ }}`,
   property bindings) keeps Angular's automatic sanitization active — prefer it by default.
2. **Keep Angular updated regularly.** Don't let it drift for months — new CVEs surface
   periodically, and staying current turns each one into a quick patch instead of a pile-up.
3. **Run `npm audit --omit=dev` before each release**, or periodically otherwise. It's free and
   catches known vulnerabilities in production dependencies before they ship.
4. **Any future user-entered content (comments, profile fields, etc.) goes through normal
   Angular template binding**, never raw HTML injection — this is what keeps sanitization
   automatic rather than something to remember per-feature.
5. **Secrets never go in source code or the browser bundle.** `.env*` files are gitignored (see
   `.gitignore`); Razorpay/Supabase secret keys belong in Vercel environment variables, server-side
   only. Verified clean as of this writing — no secrets or hardcoded API keys found in the repo.
6. **Consider a Content-Security-Policy (CSP) header before Pro launches** — defense-in-depth so
   that even if some injection slipped through, a good CSP limits what it can actually do (e.g.
   blocking exfiltration to an attacker's server). Not urgent pre-Pro, but should land before
   real user accounts/payments exist.

## Phase 2 (Pro/backend) specific rules

These apply once Supabase + Razorpay + Vercel functions actually get built — see
[PHASE2_LAUNCH_CHECKLIST.md](PHASE2_LAUNCH_CHECKLIST.md) for the full build order and the
2026-07-29 switch from Stripe to Razorpay (Stripe's onboarding doesn't support new India business
signups).

7. **Row-Level Security (RLS) on every Supabase table, from the first migration** — without it,
   any authenticated user can query other users' rows directly from the browser. Never ship a
   table "temporarily" without RLS.
8. **Never trust the browser for "did they pay."** Only a verified Razorpay webhook (server-to-server,
   signature checked) can mark a user as Pro — the client-side "payment succeeded" message is not
   proof of anything on its own.
9. **Idempotent webhook handling** — Razorpay can and will send the same event more than once.
   Check the event ID against already-processed events before acting, so a retry can't double-grant
   access or double-send anything.

---

## Fix log

### 2026-07-27 — Angular core packages: critical SSRF + XSS vulnerabilities

**Found via:** `npm audit --omit=dev` during a routine security recheck.

**Issues:**
- `@angular/ssr@21.0.4` — critical: SSRF, HTTP header injection, open redirect (runs on every
  live SSR request to zyraui.dev)
- `@angular/compiler` and dependents (`@angular/core`, `@angular/common`,
  `@angular/platform-browser`, `@angular/platform-server`, `@angular/router`) at `21.0.6` — 4 XSS
  advisories: i18n attribute binding sanitization gaps, SVG script attribute XSS, two-way binding
  sanitization bypass, template/attribute namespace sanitization bypass.

**Fix:** Bumped `@angular/core` + dependents to `21.2.18` via `ng update @angular/core@21
@angular/cli@21 --allow-dirty`, then manually aligned `@angular/cli` and `@angular/build` to
`21.2.19` (they weren't auto-updated — `ng update` treats "still satisfies `^21.0.4`" as "already
up to date", which left the build tooling behind core and briefly broke the build with
`this.manifest.allowedHosts is not iterable` until the versions were aligned).

**Verified:** `npm audit --omit=dev` → 0 vulnerabilities. Full type-check, build (92 prerendered
routes), and both test suites (467 site + 945 library) pass clean after the bump.

**Was this exploited?** No evidence of exploitation — this was a publicly disclosed vulnerability
in the Angular framework itself (not introduced by this codebase), now patched.

---

## How to check current status

```bash
npm audit --omit=dev   # production dependencies only — this is what actually matters for zyraui.dev
npm audit               # includes dev tooling (Vite, Vitest, etc.) — lower priority, never reaches users
```

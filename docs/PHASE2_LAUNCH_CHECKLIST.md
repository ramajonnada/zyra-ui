# Phase 2 (ZyraUI Pro) — Launch Checklist

This is the personal prep checklist for launching Phase 2 (ZyraUI Pro) — separate from
[SPRINT_PLAN.md](SPRINT_PLAN.md)'s component work. Nothing here blocks Sprint 8 (the charting
engine) from being built; it blocks Pro components from actually being *sold*. See
[PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) for the long-term phase plan and the chat history for
why each decision below was made.

**Decided stack:** Supabase (Postgres + Auth) + Razorpay (billing) + Vercel serverless functions.
Use the free tiers only for development and staging; production needs budgeted plans with explicit
spend controls for Vercel, Razorpay, and private GitHub Packages. Pro components ship as a public
package that is feature-gated after install with the runtime license key — not through trial-only
private-registry auth. See `PROJECTS-memory/project_phase2_backend_stack.md` (Claude's memory)
for the full decision history.

**Note:** the runtime license key is a UX/trial mechanism, not a security boundary — like AG Grid
Enterprise or FullCalendar Premium, a determined user can inspect and bypass client-side JS
regardless of the check. The actual protection for Pro source is keeping it in a **separate private
GitHub repo** (never published to the public `zyra-ng-ui` repo), not the license check itself. Don't
design around the license key as if it were access control.

**Payment provider note (2026-07-29):** A real Stripe signup attempt for a standard business account
under the Stripe Payments product in India failed during onboarding with the error that India was
not available as a business location for that account type. That single failed attempt does not prove
Stripe is unavailable in India for every product or account type; Razorpay remains the better fit
here because its onboarding and billing flow already matched the project’s India-first requirements.

Security practices that apply to this build are tracked separately in
[SECURITY.md](SECURITY.md) — read it alongside this file, don't duplicate rules here.

---

## 0. Architecture at a glance

| Piece | Choice | Why |
|---|---|---|
| Database + Auth | Supabase (Postgres + built-in Auth) | Development free tier, production plan with spend controls |
| Billing | Razorpay | Confirmed working for India; production costs should be budgeted for transaction fees and webhook volume |
| Backend logic | Vercel serverless functions | Site already deploys there; production plan and usage limits need budget control |
| Pro component distribution | Private GitHub repo + public package with runtime license gate | Keeps Pro source separate from the public repo while avoiding trial-only private-registry auth |
| Pro access gating | Runtime license key, not install-time private-registry gate | Lets people install and try the package; the key unlocks functionality after installation |

## 1. Learn first

- [ ] **Sessions vs tokens** — how Supabase Auth keeps a user logged in
- [ ] **Webhooks** — Razorpay reports "payment succeeded" to your *server*, never trust the client for this
- [ ] **Environment variables / secrets** — Razorpay secret key + Supabase service-role key are server-only, never in browser code or git
- [ ] **Row-Level Security (RLS)** — Supabase tables are client-exposed by default; RLS is what actually protects other users' data
- [ ] **Idempotency** — Razorpay can send the same webhook twice; handlers must not double-grant access

## 2. Accounts & setup

- [x] ~~Confirm Stripe onboarding works for India~~ — **checked 2026-07-29: it doesn't.** Stripe's
      signup flow does not offer India as a selectable business location for new accounts. Switched
      to Razorpay as a result — see the payment provider note above.
- [ ] Create a Razorpay account (test mode first) — get test API key/secret
- [ ] Create a Supabase project (free tier) — Postgres + Auth together
- [ ] Create a GitHub account/org for the private Pro package repo
- [ ] Confirm you have a bank account Razorpay can pay out to

## 3. Legal / compliance

- [ ] Update `/terms` and `/privacy` on zyra-ui to cover payment/subscription terms once Pro exists
- [ ] Write a refund policy (Razorpay's onboarding also expects a ToS/privacy link)

## 4. Build order (once the above is done)

- [ ] Build a new login page against Supabase Auth (BUG-07's old dead `login.ts` no longer exists
      in the repo — this is a fresh build, not a wire-up)
- [ ] Create Supabase `users` / `subscriptions` tables **with RLS enabled from the start** — never
      ship a table without RLS, even temporarily. Define owner-scoped policies, add appropriate
      `WITH CHECK` rules, grant role-specific access for app and admin use, and test cross-user
      read/write denial before launch. Keep the Supabase service-role key server-only because it
      bypasses RLS.
- [ ] Create Razorpay plan + Checkout flow (test mode first)
- [ ] Vercel serverless function: Razorpay webhook → updates Supabase subscription status
      — verify the webhook signature, enforce a unique constraint on `x-razorpay-event-id`, claim
      each event atomically together with the subscription update, and enforce monotonic status
      transitions so duplicate or out-of-order deliveries cannot regress state
- [ ] Account/billing page with subscription management
- [ ] Runtime license-key check in the Pro package components
- [ ] Create a private GitHub repo for Pro component source, separate from the public `zyra-ui` repo,
      but publish the Pro package publicly and gate features after install with the runtime license
      key rather than granting trial users private-registry auth
- [ ] Add and enforce a Content-Security-Policy (CSP) header before this goes live with real accounts/payments — allow only approved payment and authentication origins, include `object-src 'none'`, `base-uri 'none'`, and an appropriate `frame-ancestors` directive, reject `unsafe-inline`, `unsafe-eval`, and wildcard sources unless a documented exception exists, and do not use a report-only policy
- [ ] Run `npm audit --omit=dev` clean before the first Pro release ships (see [SECURITY.md](SECURITY.md))

## International customers (later, not now)

- [ ] If international customers become real, add Paddle or Lemon Squeezy (Merchant of Record —
      handles tax collection for many jurisdictions) alongside Razorpay, rather than replacing it.
      Confirm jurisdiction- and transaction-specific coverage, including B2B reverse-charge
      limitations, and confirm any remaining local tax obligations before enabling international
      sales. Razorpay's international card support exists but settles in INR and isn't as smooth as
      a dedicated international provider.

## Not needed yet

- Don't build any of this before Sprint 8 (charting engine) ships — Phase 2 backend work is a
  separate initiative from the component work, and there's nothing to sell until Pro components
  exist.
- Don't set up GitHub Packages token automation until the Razorpay → Supabase → license flow is
  actually being wired — premature before that.

---

*Created 2026-07-24, alongside the Sprint 7 → Sprint 8 transition. Updated 2026-07-27 with the
architecture summary and security cross-references. Updated 2026-07-29: switched billing provider
from Stripe to Razorpay after confirming Stripe doesn't support new India business signups.*

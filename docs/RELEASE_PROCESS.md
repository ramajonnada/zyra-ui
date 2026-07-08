# Zyra UI — Release Process

This is the policy layer: branch flow, versioning decisions, and hotfixes. For the mechanical step-by-step (what command to run, in what order) see [RELEASING.md](RELEASING.md) — that doc assumes you've already decided *what* to release and *what version number* to use; this one is about making those decisions.

## Branch flow

- **`main`** — production. Vercel deploys from here. Never push directly.
- **`dev`** — integration branch. Everything lands here first.
- **Feature branches** — always cut from `dev`, PR back into `dev`.

```bash
git checkout dev
git pull
git checkout -b feat/your-feature-name
```

A release is: merge `dev` → `main` (after everything in this doc below is done), which is what triggers the Vercel production deploy and is the point of no return for the npm publish.

## Deciding the version number

Two independent things version separately:

- **`zyra-ng-ui`** (the library) — versioned per [Semantic Versioning](https://semver.org/), bumped with `npm run bump:lib -- <version>`. This is what gets published to npm and is what consumers depend on.
- **`zyra-workspace`** (the root `package.json`, the site itself) — its own version, bumped separately, not tied to the library's.

For the library version, ask: does this change break anything a consumer might be relying on?

| Change | Bump | Real example from this repo |
|---|---|---|
| New component, new optional input, non-breaking feature | Minor (`1.7.0` → `1.8.0`) | Adding `zyra-switch` |
| Bug fix, visual polish, internal refactor with no API change | Patch (`1.7.0` → `1.7.1`) | Fixing a focus-trap edge case |
| Renamed/removed public API — component inputs, exported types, **or CSS custom property names** | Major (`2.0.0` → `3.0.0`) | The `v3.0.0` release, which renamed every `--zyra-*` color token to `--zyra-color-*` |

The token rename is the concrete precedent here: a CSS variable rename is a breaking change exactly like a TypeScript API rename, because consumers who override tokens directly in their own stylesheets depend on the exact name. Don't ship that kind of change as a minor version just because no `.ts` file's public signature changed — check [TOKENS.md](TOKENS.md) before deciding.

## When to release

Roughly weekly or monthly, whenever enough has accumulated in `dev`. Don't release for the sake of a cadence — release when:

- One or more components are genuinely done (see [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) for "done").
- A bug fix or breaking change needs to reach consumers.
- A theme/token change needs to ship (see [THEME_SYSTEM.md](THEME_SYSTEM.md)).

## Hotfixes

For a production bug that can't wait for the normal `dev` → `main` cycle:

1. Branch from `main`, not `dev`: `git checkout -b fix/urgent-thing main`.
2. Fix, test, `npm run check:lib` if it touches the library.
3. PR into `main` directly.
4. **Immediately after merging, also merge/cherry-pick the same fix into `dev`** — otherwise the next normal release from `dev` silently reverts the hotfix.
5. Follow the version-bump rules above (a hotfix is almost always a patch release).

## Pre-flight before merging to main

Everything in [RELEASING.md](RELEASING.md)'s "Step 3 — Run the release" table must pass: pre-publish check, format, lint, tests, both builds. `npm run release` runs all of it and stops on first failure — don't hand-run individual steps and skip ones that seem "obviously fine."

## After release

- Confirm the Vercel deployment actually succeeded (check the dashboard or `vercel ls`) — a green `npm run release` doesn't guarantee the site build succeeded on Vercel's infra specifically; environment differences have caused deploy-only failures before.
- Confirm the published npm version resolves: `npm view zyra-ng-ui version`.
- Post the launch announcement `npm run release` prints out.

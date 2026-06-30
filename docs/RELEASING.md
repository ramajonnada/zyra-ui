# Releasing zyra-ng-ui

This document is for maintainers. It describes the full release process — from bumping the version to publishing npm and deploying the website.

Contributors do **not** need to follow these steps. If you're contributing a feature or fix, see [CONTRIBUTING.md](CONTRIBUTING.md) instead.

---

## When to release

We release roughly once a week or once a month depending on how much has accumulated in `main`. A release is worth doing when:

- One or more new components are ready
- Significant bug fixes or API changes have landed
- Theme or token changes need to ship

---

## Step 1 — Bump the version

Decide the new version following [Semantic Versioning](https://semver.org/):

| Change type | Example |
|---|---|
| New components / features | `1.7.0` → `1.8.0` |
| Bug fixes / polish only | `1.7.0` → `1.7.1` |
| Breaking API changes | `1.7.0` → `2.0.0` |

Run the bump script — it updates all version references in one command:

```bash
npm run version:bump -- 1.8.0
```

This updates:
- `projects/zyra-ng-ui/package.json` — library version
- `package.json` — npm dependency version
- `projects/zyra-ui/src/app/shared/version.ts` — displayed version in the website
- `CHANGELOG.md` — scaffolds a new empty entry with today's date

---

## Step 2 — Fill in the changelog

Open `CHANGELOG.md` and fill in the scaffolded entry that was just created. Use this structure:

```markdown
## [1.8.0] — 2026-07-15

### Added
- `zyra-date-picker`: New date picker component with range support

### Changed
- `zyra-tabs`: Improved keyboard navigation

### Fixed
- `zyra-modal`: Focus trap edge case on Safari
```

Only document things that affect library consumers. Skip internal refactors unless they change behaviour.

---

## Step 3 — Run the release

Once the changelog is filled in, run:

```bash
npm run release
```

This runs every checklist item in order and **stops immediately if anything fails**:

| Step | What it does |
|---|---|
| ✅ Format check | Ensures all files match Prettier config |
| ✅ Lint | Runs ESLint on both projects |
| ✅ Tests | Runs unit tests headlessly |
| ✅ Build library | Compiles `zyra-ng-ui` to `dist/` |
| ✅ Build website | Production build of the marketing site |
| ✅ Publish to npm | `npm publish dist/zyra-ng-ui --access public` |
| ✅ Git push | Pushes to `main`, triggers Vercel deploy |
| ✅ GitHub release | Creates a release with changelog notes |
| ✅ Launch post | Prints a ready-to-paste social post |

Fix any failures, then re-run `npm run release`. It is safe to re-run.

---

## Step 4 — Post the announcement

After the script finishes, it prints a pre-written launch post. Copy it and post to:

- [Threads](https://threads.net)
- [X / Twitter](https://x.com)
- GitHub Discussions (optional)

---

## Fixing a failed release mid-way

If the script fails partway through:

- **Before npm publish** — fix the issue and re-run `npm run release`. Nothing was published yet.
- **After npm publish but before git push** — run `git push origin main` manually, then `gh release create`.
- **After git push** — Vercel auto-deploys. Just create the GitHub release manually: `gh release create v1.8.0 --generate-notes`.

---

## Local preview before releasing

To preview changes in the browser before running the full release:

```bash
npm run start:local
```

This builds the library from source and serves the website at `http://localhost:4200`.

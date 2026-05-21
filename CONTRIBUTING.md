# Contributing to Zyra UI

Thanks for your interest! Here's how to get started.

## Setup

```bash
git clone https://github.com/ramajonnada/zyra-ui.git
cd zyra-ui
npm install
```

Run the playground:
```bash
npx ng serve zyra-ui
```

Build the library:
```bash
npx ng build zyra-ng-ui
```

## Branch workflow

- `main` — stable, protected. Never push directly.
- `dev` — integration branch for ongoing work.
- Feature branches — always branch off `dev`:

```bash
git checkout dev
git pull
git checkout -b feat/your-feature-name
```

Open a PR from your feature branch → `dev`, then `dev` → `main` for releases.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|--------|-------------|
| `feat:` | New component or feature |
| `fix:` | Bug fix |
| `chore:` | Build scripts, deps, config |
| `refactor:` | Code change with no behavior change |
| `style:` | CSS/SCSS only changes |
| `perf:` | Performance improvement |
| `docs:` | Documentation only |

Example: `feat(zyra-select): add multi-select support`

## Library changes

If you modify anything in `projects/zyra-ng-ui/`:
1. Bump the version in `projects/zyra-ng-ui/package.json`
2. Update `projects/zyra-ui/src/app/shared/version.ts` to match
3. Add an entry to `CHANGELOG.md` with what changed
4. The maintainer will publish to npm after merging

## Code style

- Angular standalone components only — no NgModules
- Signals-first: use `input()`, `output()`, `model()`, `signal()`, `computed()`
- Use `booleanAttribute` transform for boolean inputs so attribute syntax works (`<zyra-button loading>`)
- CSS variables for all theming — no hardcoded colors
- Support both light and dark mode
- Use `DOCUMENT` injection token instead of `document` directly (SSR safety)
- For slot-based content projection, use directive markers (e.g. `ZyrPrefix`, `ZyrSuffix`) so `@ContentChild` can detect projected content

## Current components

| Component | Selector | Notes |
|-----------|----------|-------|
| ZyraButton | `zyra-button` | CVA-free, event-based |
| ZyraCard | `zyra-card` | Header/footer slots |
| ZyraBadge | `zyra-badge` | Status variants |
| ZyraAvatar | `zyra-avatar` | Online indicator |
| ZyraInput | `zyra-input` | Full CVA, password toggle |
| ZyraFormField | `zyra-form-field` | Wraps ZyraInput with label, hints, icons |
| ZyrPrefix | `[zyrPrefix]` | Directive — custom prefix slot in ZyraFormField |
| ZyrSuffix | `[zyrSuffix]` | Directive — custom suffix slot in ZyraFormField |
| ZyraSpinner | `zyra-spinner` | Size + color variants |
| ZyraToast | `zyra-toast` | Auto-dismiss notifications |
| ZyraTooltip | `zyra-tooltip` | Position-aware tooltip |
| ZyraToggle | `zyra-toggle` | Full CVA |
| ZyraChip | `zyra-chip` | Selectable + dismissible |
| ZyraAlert | `zyra-alert` | Dismiss animation, aria-live |
| ZyraModal | `zyra-modal` | Focus trap, SSR-safe |
| ZyraAccordion | `zyra-accordion` | Single/multi open |
| ZyraProgress | `zyra-progress` | Linear, indeterminate |
| ZyraDivider | `zyra-divider` | Horizontal + vertical |

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## Proposing new components

Open a [feature request](.github/ISSUE_TEMPLATE/feature_request.md) first so we can align on the API before implementation.

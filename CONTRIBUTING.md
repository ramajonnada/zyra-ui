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

| Prefix      | When to use                         |
| ----------- | ----------------------------------- |
| `feat:`     | New component or feature            |
| `fix:`      | Bug fix                             |
| `chore:`    | Build scripts, deps, config         |
| `refactor:` | Code change with no behavior change |
| `style:`    | CSS/SCSS only changes               |
| `perf:`     | Performance improvement             |
| `docs:`     | Documentation only                  |

Example: `feat(zyra-select): add multi-select support`

## Library changes

If you modify anything in `projects/zyra-ng-ui/`, add an entry to `CHANGELOG.md` describing what changed. The maintainer will handle versioning and publishing using the release process described in [RELEASING.md](docs/RELEASING.md).

## Code style

- Angular standalone components only — no NgModules
- Signals-first: use `input()`, `output()`, `model()`, `signal()`, `computed()`
- Use `booleanAttribute` transform for boolean inputs so attribute syntax works (`<zyra-button loading>`)
- CSS variables for all theming — no hardcoded colors
- Support both light and dark mode
- Use `DOCUMENT` injection token instead of `document` directly (SSR safety)
- For slot-based content projection, use directive markers (e.g. `ZyrPrefix`, `ZyrSuffix`) so `@ContentChild` can detect projected content

## Current components

| Component           | Selector                | Notes                                               |
| ------------------- | ----------------------- | --------------------------------------------------- |
| ZyraButton          | `zyra-button`           | CVA-free, event-based; 5 variants, 3 sizes          |
| ZyraCard            | `zyra-card`             | Header/footer slots, 4 variants, clickable mode     |
| ZyraBadge           | `zyra-badge`            | Status labels, dot indicator, 5 variants            |
| ZyraAvatar          | `zyra-avatar`           | Image + initials fallback, presence dot             |
| ZyraInput           | `zyra-input`            | Full CVA, password toggle, prefix icon, clear btn   |
| ZyraFormField       | `zyra-form-field`       | Wraps Input/Textarea; auto error from validators    |
| ZyrPrefix           | `[zyrPrefix]`           | Directive — custom prefix slot in ZyraFormField     |
| ZyrSuffix           | `[zyrSuffix]`           | Directive — custom suffix slot in ZyraFormField     |
| ZyraTextarea        | `zyra-textarea`         | Full CVA, auto-resize, ZyraFormField integration    |
| ZyraSelect          | `zyra-select`           | Full CVA, keyboard nav, 3 appearances               |
| ZyraOption          | `zyra-option`           | Option item for ZyraSelect                          |
| ZyraCheckbox        | `zyra-checkbox`         | Indeterminate state, 3 sizes, two-way [(checked)]   |
| ZyraRadioGroup      | `zyra-radio-group`      | Arrow key navigation, vertical/horizontal           |
| ZyraRadio           | `zyra-radio`            | Radio item for ZyraRadioGroup                       |
| ZyraToggle          | `zyra-toggle`           | role="switch", 3 sizes, two-way [(checked)]         |
| ZyraSpinner         | `zyra-spinner`          | 4 color variants, 4 sizes, role="status"            |
| ZyraProgress        | `zyra-progress`         | Linear bar, indeterminate mode, 5 variants          |
| ZyraAlert           | `zyra-alert`            | Dismissible, role="alert", aria-live                |
| ZyraToast           | `zyra-toast`            | Auto-dismiss; use via ZyraToastService              |
| ZyraToastContainer  | `zyra-toast-container`  | Mount once in app root                              |
| ZyraTooltip         | `zyra-tooltip`          | 4 positions, hover + focus                          |
| ZyraModal           | `zyra-modal`            | Focus trap, ESC to close, 4 sizes, [(open)]         |
| ZyraChip            | `zyra-chip`             | Dismissible + selectable, 6 variants                |
| ZyraDivider         | `zyra-divider`          | Horizontal/vertical, solid/dashed/dotted            |
| ZyraSkeleton        | `zyra-skeleton`         | 20+ preset layouts (card, list, dashboard…)         |
| ZyraAccordion       | `zyra-accordion`        | Single/multi open, CSS grid animation               |
| ZyraAccordionItem   | `zyra-accordion-item`   | Item for ZyraAccordion                              |
| ZyraTabs            | `zyra-tabs`             | 4 variants, icons, badges, closeable, vertical      |
| ZyraTab             | `zyra-tab`              | Tab item for ZyraTabs                               |

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## Proposing new components

Open a [feature request](.github/ISSUE_TEMPLATE/feature_request.md) first so we can align on the API before implementation.

param(
    [string]$Repo = "ramajonnada/zyra-ui"
)

$ErrorActionPreference = "Stop"

function Ensure-Gh {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        throw "GitHub CLI is not installed. Install it from https://cli.github.com/ and run: gh auth login"
    }
}

function Ensure-Label {
    param(
        [string]$Name,
        [string]$Color,
        [string]$Description
    )

    gh label create $Name --repo $Repo --color $Color --description $Description 2>$null
    if ($LASTEXITCODE -ne 0) {
        gh label edit $Name --repo $Repo --color $Color --description $Description
    }
}

function Ensure-Milestone {
    param([string]$Title)

    $existing = gh api "repos/$Repo/milestones?state=all" --jq ".[] | select(.title == `"$Title`") | .title"
    if (-not $existing) {
        gh api "repos/$Repo/milestones" -f title="$Title" | Out-Null
    }
}

function New-RoadmapIssue {
    param(
        [string]$Title,
        [string]$Body,
        [string[]]$Labels,
        [string]$Milestone
    )

    $existing = gh issue list --repo $Repo --state all --search "`"$Title`" in:title" --json title --jq ".[] | select(.title == `"$Title`") | .title"
    if ($existing) {
        Write-Host "Skipped existing issue: $Title"
        return
    }

    $labelArgs = @()
    foreach ($label in $Labels) {
        $labelArgs += @("--label", $label)
    }

    gh issue create --repo $Repo --title $Title --body $Body --milestone $Milestone @labelArgs | Out-Null
    Write-Host "Created issue: $Title"
}

Ensure-Gh

$labels = @(
    @{ Name = "type: docs"; Color = "0075ca"; Description = "Documentation, examples, and guides" },
    @{ Name = "type: component"; Color = "5319e7"; Description = "Library component work" },
    @{ Name = "type: blocks"; Color = "0e8a16"; Description = "Ready-made UI blocks" },
    @{ Name = "type: theme"; Color = "fbca04"; Description = "Theme tokens and theme builder" },
    @{ Name = "type: ai"; Color = "bfdadc"; Description = "AI usage docs and prompts" },
    @{ Name = "type: testing"; Color = "d4c5f9"; Description = "Tests and quality checks" },
    @{ Name = "type: seo"; Color = "c2e0c6"; Description = "SEO, sitemap, metadata, and trust signals" },
    @{ Name = "priority: high"; Color = "b60205"; Description = "High priority" },
    @{ Name = "priority: medium"; Color = "fbca04"; Description = "Medium priority" },
    @{ Name = "priority: low"; Color = "0e8a16"; Description = "Low priority" },
    @{ Name = "status: blocked"; Color = "000000"; Description = "Blocked by another task or decision" },
    @{ Name = "good first issue"; Color = "7057ff"; Description = "Good for first-time contributors" }
)

foreach ($label in $labels) {
    Ensure-Label -Name $label.Name -Color $label.Color -Description $label.Description
}

$milestones = @(
    "Sprint 1: Docs polish + AI page",
    "Sprint 2: Blocks system",
    "Sprint 3: Theme builder",
    "Sprint 4: Quality + release"
)

foreach ($milestone in $milestones) {
    Ensure-Milestone -Title $milestone
}

$issues = @(
    @{
        Title = "Audit public API against component showcase data"
        Milestone = "Sprint 1: Docs polish + AI page"
        Labels = @("type: docs", "type: component", "priority: high")
        Body = @"
Compare `projects/zyra-ng-ui/src/public-api.ts` with `projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts`.

Checklist:
- [ ] List every exported component.
- [ ] Confirm every exported component exists in `UI_COMPONENT_SHOWCASE`.
- [ ] Confirm every showcase item has a matching live demo folder.
- [ ] Note missing docs, demo, API, accessibility, and test gaps.
"@
    },
    @{
        Title = "Fix component docs encoding issues"
        Milestone = "Sprint 1: Docs polish + AI page"
        Labels = @("type: docs", "priority: high", "good first issue")
        Body = @"
Clean broken characters in docs and templates.

Checklist:
- [ ] Replace broken dash characters.
- [ ] Replace broken multiplication/close characters.
- [ ] Review `ui-components.data.ts`.
- [ ] Review PR template text.
- [ ] Run format check.
"@
    },
    @{
        Title = "Standardize component docs data"
        Milestone = "Sprint 1: Docs polish + AI page"
        Labels = @("type: docs", "priority: high")
        Body = @"
Make component docs consistent across the gallery and detail pages.

Checklist:
- [ ] Standardize component descriptions.
- [ ] Standardize example code style.
- [ ] Ensure examples use standalone Angular components.
- [ ] Ensure examples import from `zyra-ng-ui`.
- [ ] Make examples copy-paste ready.
- [ ] Add missing API props.
- [ ] Add missing variants.
- [ ] Add missing accessibility notes.
- [ ] Add related component links.
"@
    },
    @{
        Title = "Polish components gallery page"
        Milestone = "Sprint 1: Docs polish + AI page"
        Labels = @("type: docs", "priority: medium")
        Body = @"
Improve `/components` so visitors can quickly discover components.

Checklist:
- [ ] Review gallery layout.
- [ ] Add category filters.
- [ ] Add component search.
- [ ] Add optional New/Popular badge support.
- [ ] Add install command CTA.
- [ ] Add quick links to `/docs` and `/use-with-ai`.
"@
    },
    @{
        Title = "Polish component detail page"
        Milestone = "Sprint 1: Docs polish + AI page"
        Labels = @("type: docs", "type: component", "priority: high")
        Body = @"
Improve `/components/:component` as the main component documentation experience.

Checklist:
- [ ] Reorder sections: Header, Live Preview, Install/Import, Usage Example, Variants, API, Accessibility, Related Components.
- [ ] Add import snippet section.
- [ ] Add copy button for import snippets.
- [ ] Keep copy button for full example code.
- [ ] Add GitHub edit link.
- [ ] Add source link.
- [ ] Add invalid slug state.
- [ ] Improve SEO title and description.
- [ ] Confirm SSR/prerender for component slugs.
"@
    },
    @{
        Title = "Improve docs setup page"
        Milestone = "Sprint 1: Docs polish + AI page"
        Labels = @("type: docs", "priority: high")
        Body = @"
Use `/docs` for setup, installation, and theming guidance.

Checklist:
- [ ] Add installation section.
- [ ] Add peer dependencies section.
- [ ] Add global styles import section.
- [ ] Add `provideZyra()` setup section.
- [ ] Add dark/light theme setup.
- [ ] Add design token customization.
- [ ] Add first component example.
- [ ] Add troubleshooting section.
- [ ] Link to component gallery and blocks page.
"@
    },
    @{
        Title = "Add Use With AI page"
        Milestone = "Sprint 1: Docs polish + AI page"
        Labels = @("type: ai", "type: docs", "priority: high")
        Body = @"
Create `/use-with-ai` to make Zyra UI easier to use with AI coding tools.

Checklist:
- [ ] Add route.
- [ ] Add page folder.
- [ ] Add server route.
- [ ] Add navigation link where appropriate.
- [ ] Add AI usage rules.
- [ ] Add prompt card for login page.
- [ ] Add prompt card for dashboard page.
- [ ] Add prompt card for settings page.
- [ ] Add prompt card for form validation.
- [ ] Add prompt card for modal workflow.
- [ ] Add prompt card for theme customization.
- [ ] Add copy button for every prompt.
- [ ] Add SEO metadata.
"@
    },
    @{
        Title = "Add blocks route and data system"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: high")
        Body = @"
Create the same kind of structured system for ready-made blocks that components already use.

Checklist:
- [ ] Add `/blocks` route.
- [ ] Add `/blocks/:block` route.
- [ ] Add `projects/zyra-ui/src/app/pages/blocks`.
- [ ] Create `blocks.data.ts`.
- [ ] Create blocks gallery page.
- [ ] Create block detail page.
- [ ] Create `ZyraBlock` interface.
- [ ] Add copy-code support.
- [ ] Add SEO metadata.
- [ ] Add SSR/prerender entries.
"@
    },
    @{
        Title = "Add Login Form block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: high")
        Body = @"
Add a copy-paste ready login form block.

Checklist:
- [ ] Build live preview.
- [ ] Use Zyra components.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Signup Form block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: medium")
        Body = @"
Add a copy-paste ready signup form block.

Checklist:
- [ ] Build live preview.
- [ ] Use Zyra components.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Settings Form block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: high")
        Body = @"
Add a settings form block for common SaaS/user preference screens.

Checklist:
- [ ] Build live preview.
- [ ] Use inputs, toggles, cards, and buttons.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Pricing Cards block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: medium")
        Body = @"
Add pricing card block for product and SaaS pages.

Checklist:
- [ ] Build live preview.
- [ ] Use Zyra cards, badges, and buttons.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Dashboard Stats block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: high")
        Body = @"
Add dashboard stats cards block.

Checklist:
- [ ] Build live preview.
- [ ] Use cards, badges, progress, and icons if needed.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Empty State block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: medium", "good first issue")
        Body = @"
Add reusable empty state block.

Checklist:
- [ ] Build live preview.
- [ ] Use Zyra card/button components.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Profile Card block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: medium")
        Body = @"
Add profile card block.

Checklist:
- [ ] Build live preview.
- [ ] Use avatar, badge, card, and button components.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Notification Settings block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: medium")
        Body = @"
Add notification settings block.

Checklist:
- [ ] Build live preview.
- [ ] Use toggles, cards, dividers, and buttons.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Form Validation block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: high")
        Body = @"
Add form validation block.

Checklist:
- [ ] Build live preview.
- [ ] Use form-field and input components.
- [ ] Show error and success states.
- [ ] Add responsive layout.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Modal Confirmation block"
        Milestone = "Sprint 2: Blocks system"
        Labels = @("type: blocks", "priority: medium")
        Body = @"
Add modal confirmation workflow block.

Checklist:
- [ ] Build live preview.
- [ ] Use modal and button components.
- [ ] Add confirm/cancel actions.
- [ ] Support dark/light themes.
- [ ] Add copyable example code.
- [ ] Add components-used list.
"@
    },
    @{
        Title = "Add Theme Builder page"
        Milestone = "Sprint 3: Theme builder"
        Labels = @("type: theme", "priority: high")
        Body = @"
Create `/theme-builder` so visitors can generate CSS token overrides.

Checklist:
- [ ] Add route.
- [ ] Add page folder.
- [ ] Add accent color control.
- [ ] Add radius control.
- [ ] Add theme mode toggle.
- [ ] Add live preview using Zyra components.
- [ ] Generate CSS token output.
- [ ] Add copy CSS button.
- [ ] Add reset theme button.
- [ ] Add SEO metadata.
"@
    },
    @{
        Title = "Review component API consistency"
        Milestone = "Sprint 4: Quality + release"
        Labels = @("type: component", "priority: high")
        Body = @"
Review public component APIs before growing the library further.

Checklist:
- [ ] Review prop names.
- [ ] Make boolean props consistent.
- [ ] Make size props consistent.
- [ ] Make variant props consistent.
- [ ] Make output event names consistent.
- [ ] Document any breaking changes before release.
"@
    },
    @{
        Title = "Run accessibility pass on existing components"
        Milestone = "Sprint 4: Quality + release"
        Labels = @("type: component", "type: testing", "priority: high")
        Body = @"
Check keyboard, ARIA, focus, disabled, loading, and theme states.

Checklist:
- [ ] Check Button.
- [ ] Check Modal.
- [ ] Check Accordion.
- [ ] Check Toggle.
- [ ] Check Tooltip.
- [ ] Check Toast dismiss.
- [ ] Check ARIA behavior for each component.
- [ ] Check focus rings.
- [ ] Check dark/light theme styling.
"@
    },
    @{
        Title = "Improve key component tests"
        Milestone = "Sprint 4: Quality + release"
        Labels = @("type: testing", "priority: high")
        Body = @"
Improve test coverage for the components most likely to affect users.

Checklist:
- [ ] Improve Button tests.
- [ ] Improve Input tests.
- [ ] Improve Toast tests.
- [ ] Improve Modal tests.
- [ ] Improve Toggle tests.
- [ ] Improve Accordion tests.
- [ ] Improve theme service tests.
- [ ] Add token output tests if needed.
"@
    },
    @{
        Title = "Upgrade homepage product story"
        Milestone = "Sprint 4: Quality + release"
        Labels = @("type: docs", "priority: high")
        Body = @"
Make the homepage clearly explain why Zyra UI matters.

Checklist:
- [ ] Update hero message.
- [ ] Add install command.
- [ ] Add component preview section.
- [ ] Add blocks preview section.
- [ ] Add AI usage CTA.
- [ ] Add theme builder CTA.
- [ ] Add GitHub and npm CTA.
- [ ] Add Why Zyra UI section.
"@
    },
    @{
        Title = "Update SEO, sitemap, and trust signals"
        Milestone = "Sprint 4: Quality + release"
        Labels = @("type: seo", "priority: medium")
        Body = @"
Update site metadata and trust signals after adding new pages.

Checklist:
- [ ] Update `llms.txt`.
- [ ] Update `sitemap.xml`.
- [ ] Add `/blocks` to sitemap.
- [ ] Add `/use-with-ai` to sitemap.
- [ ] Add `/theme-builder` to sitemap.
- [ ] Add Open Graph metadata.
- [ ] Improve page titles.
- [ ] Add npm badge.
- [ ] Add GitHub link.
- [ ] Add changelog link.
- [ ] Add roadmap section or page.
"@
    },
    @{
        Title = "Run release checklist"
        Milestone = "Sprint 4: Quality + release"
        Labels = @("type: testing", "priority: high")
        Body = @"
Final release checklist before publishing and announcing.

Checklist:
- [ ] Run format check.
- [ ] Run lint.
- [ ] Run tests.
- [ ] Build library.
- [ ] Build website.
- [ ] Fix build issues.
- [ ] Update changelog.
- [ ] Bump package version.
- [ ] Publish `zyra-ng-ui`.
- [ ] Deploy website.
- [ ] Create launch post.
"@
    }
)

foreach ($issue in $issues) {
    New-RoadmapIssue -Title $issue.Title -Body $issue.Body -Labels $issue.Labels -Milestone $issue.Milestone
}

Write-Host ""
Write-Host "Done. Create a GitHub Project board named 'Zyra UI Roadmap' and add these issues to it."
Write-Host "Suggested columns: Backlog, Ready, In Progress, Review, Done."

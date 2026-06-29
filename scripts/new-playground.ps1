<#
.SYNOPSIS
    Scaffolds a new playground entry for a zyra-ng-ui component.

.DESCRIPTION
    Creates the renderer component and inserts stubs into playground-registry.ts
    and ui-components.data.ts. Claude only needs to fill in the content.

.PARAMETER Name
    Kebab-case component name WITHOUT the "zyra-" prefix.
    Example: "date-picker"

.EXAMPLE
    .\scripts\new-playground.ps1 -Name date-picker
#>

param(
    [Parameter(Mandatory = $true)]
    [string] $Name
)

# ── Helpers ───────────────────────────────────────────────────────────────────

function ToPascalCase([string] $kebab) {
    (($kebab -split '-') | ForEach-Object {
        $_.Substring(0, 1).ToUpper() + $_.Substring(1)
    }) -join ''
}

function ToTitleCase([string] $kebab) {
    (($kebab -split '-') | ForEach-Object {
        $_.Substring(0, 1).ToUpper() + $_.Substring(1)
    }) -join ' '
}

function Abort([string] $msg) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

function Ok([string] $msg) {
    Write-Host "  [OK] $msg" -ForegroundColor Green
}

function Skip([string] $msg) {
    Write-Host "  [--] $msg" -ForegroundColor Yellow
}

# ── Derive names ──────────────────────────────────────────────────────────────

$Name = $Name.ToLower().Trim()
if ($Name -match '^zyra-') { $Name = $Name -replace '^zyra-', '' }
if ($Name -notmatch '^[a-z][a-z0-9-]*$') {
    Abort "Name must be kebab-case (e.g. 'date-picker'). Got: '$Name'"
}

$fullName      = "zyra-$Name"                    # zyra-date-picker
$pascalName    = ToPascalCase $Name              # DatePicker
$className     = "Zyra$pascalName"               # ZyraDatePicker
$rendererClass = "${pascalName}Renderer"         # DatePickerRenderer
$titleName     = ToTitleCase $Name               # Date Picker

Write-Host ""
Write-Host "Scaffolding playground: $fullName  ($className)" -ForegroundColor Cyan

# ── Paths ─────────────────────────────────────────────────────────────────────

$root         = Split-Path $PSScriptRoot -Parent
$renderersDir = "$root\projects\zyra-ui\src\app\pages\ui-components\shared\playground\renderers"
$registryFile = "$root\projects\zyra-ui\src\app\pages\ui-components\shared\playground\playground-registry.ts"
$dataFile     = "$root\projects\zyra-ui\src\app\pages\ui-components\ui-components.data.ts"
$rendererFile = "$renderersDir\$Name-renderer.ts"

Write-Host ""

# ── Guard: renderer already exists ────────────────────────────────────────────

if (Test-Path $rendererFile) {
    Abort "Renderer already exists: $rendererFile"
}

# ── 1. Renderer component ─────────────────────────────────────────────────────

$bt = [char]96  # backtick — [char]96 is reliable; literal ` is ambiguous in PS strings
$rendererContent = @"
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { $className } from 'zyra-ng-ui';

@Component({
    selector: 'pg-$Name-renderer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [$className],
    template: ${bt}
        <$fullName />
    ${bt},
})
export class $rendererClass {
    // TODO: add signal inputs matching playground-registry controls
}
"@

Set-Content -Path $rendererFile -Value $rendererContent -Encoding utf8
Ok "$Name-renderer.ts"

# ── 2. Import in playground-registry.ts ───────────────────────────────────────

$registryContent = Get-Content $registryFile -Raw

if ($registryContent -match [regex]::Escape("from './renderers/$Name-renderer'")) {
    Skip "playground-registry.ts (import already present)"
} else {
    # Insert new import after the last existing renderer import line
    $newImport = "import { $rendererClass } from './renderers/$Name-renderer';"
    $registryContent = $registryContent -replace "(import \{ TooltipRenderer \} from '\./renderers/tooltip-renderer';)", "`$1`n$newImport"
    Set-Content -Path $registryFile -Value $registryContent -Encoding utf8 -NoNewline
    Ok "playground-registry.ts  (+import)"
}

# ── 3. Registry entry ─────────────────────────────────────────────────────────

$registryContent = Get-Content $registryFile -Raw

if ($registryContent -match [regex]::Escape("'$Name':")) {
    Skip "playground-registry.ts (entry already present)"
} else {
    $registryEntry = @"

    // ── $titleName ──────────────────────────────────────────────────────
    '$Name': {
        renderer: $rendererClass,
        controls: [
            // TODO: add controls
            // { type: 'button-group', key: 'variant', label: 'variant', options: ['a', 'b'], defaultValue: 'a' },
            // { type: 'toggle',       key: 'disabled', label: 'states', toggleLabel: 'disabled', defaultValue: false },
            // { type: 'text',         key: 'label',    label: 'label',  placeholder: 'Text…',    defaultValue: '' },
        ],
        codeTemplate: (s) => ${bt}<$fullName />${bt},
    },

"@

    # Insert before the closing };
    $registryContent = $registryContent -replace '\n\};(\s*)$', "$registryEntry`n};`$1"
    Set-Content -Path $registryFile -Value $registryContent -Encoding utf8 -NoNewline
    Ok "playground-registry.ts  (+entry)"
}

# ── 4. Showcase card in ui-components.data.ts ─────────────────────────────────

$dataContent = Get-Content $dataFile -Raw

if ($dataContent -match [regex]::Escape("slug: '$Name'")) {
    Skip "ui-components.data.ts (card already present)"
} else {
    $showcaseCard = @"

    {
        slug: '$Name',
        title: '$titleName',
        selector: '$fullName',
        importName: '$className',
        category: 'General',
        description: 'TODO: add description.',
        icon: appIcons.bolt,
        accent: 'teal',
        highlights: [
            'TODO: highlight 1',
            'TODO: highlight 2',
            'TODO: highlight 3',
        ],
        exampleCode: ``import { Component } from '@angular/core';
import { $className } from 'zyra-ng-ui';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [$className],
  template: \`
    <$fullName />
  \`,
})
export class DemoComponent {}``,
        variants: [
            // TODO: { name: 'variant-name', description: 'description' },
        ],
        apiProps: [
            // TODO: { name: 'propName', type: 'string', default: '-', description: 'description' },
        ],
        a11yNotes: [
            // TODO: 'accessibility note',
        ],
        relatedSlugs: [],
    },
"@

    # Insert before ] satisfies readonly UiComponentShowcaseCard[];
    $dataContent = $dataContent -replace '\] satisfies readonly UiComponentShowcaseCard\[\];', "$showcaseCard`n] satisfies readonly UiComponentShowcaseCard[];"
    Set-Content -Path $dataFile -Value $dataContent -Encoding utf8 -NoNewline
    Ok "ui-components.data.ts  (+card)"
}

# ── Summary ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "Done. 3 changes made." -ForegroundColor Cyan
Write-Host ""
Write-Host "Claude fills in:" -ForegroundColor White
Write-Host "  1. Renderer template + inputs  $Name-renderer.ts"
Write-Host "  2. Controls + codeTemplate     playground-registry.ts"
Write-Host "  3. apiProps, variants, a11y    ui-components.data.ts"
Write-Host ""

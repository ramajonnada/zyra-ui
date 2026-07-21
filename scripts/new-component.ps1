<#
.SYNOPSIS
    Scaffolds a new zyra-ng-ui library component.

.DESCRIPTION
    Creates the 4 component files (.ts, .html, .scss, .spec.ts), adds the
    public-api.ts export, and inserts a Tier 3 token stub into
    _tokens-components.scss.

.PARAMETER Name
    Kebab-case component name WITHOUT the "zyra-" prefix.
    Example: "date-picker"  →  creates zyra-date-picker.*

.EXAMPLE
    .\scripts\new-component.ps1 -Name date-picker
#>

param(
    [Parameter(Mandatory = $true)]
    [string] $Name
)

# ── Helpers ──────────────────────────────────────────────────────────────────

function ToPascalCase([string] $kebab) {
    (($kebab -split '-') | ForEach-Object {
        $_.Substring(0, 1).ToUpper() + $_.Substring(1)
    }) -join ''
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

# ── Derive names ─────────────────────────────────────────────────────────────

$Name = $Name.ToLower().Trim()
if ($Name -match '^zyra-') { $Name = $Name -replace '^zyra-', '' }
if ($Name -notmatch '^[a-z][a-z0-9-]*$') {
    Abort "Name must be kebab-case letters/digits (e.g. 'date-picker'). Got: '$Name'"
}

$fullName   = "zyra-$Name"                    # zyra-date-picker
$className  = "Zyra$(ToPascalCase $Name)"     # ZyraDatePicker
$bemBase    = "zyr-$Name"                     # zyr-date-picker
$hostName   = "$(ToPascalCase $Name)Host"     # DatePickerHost

Write-Host ""
Write-Host "Scaffolding component: $fullName  ($className)" -ForegroundColor Cyan

# ── Paths ─────────────────────────────────────────────────────────────────────

$root            = Split-Path $PSScriptRoot -Parent
$compDir         = "$root\projects\zyra-ng-ui\src\lib\components\$fullName"
$pubApi          = "$root\projects\zyra-ng-ui\src\public-api.ts"
$tokensComponents = "$root\projects\zyra-ng-ui\src\lib\styles\_tokens-components.scss"

# ── Guard: already exists ──────────────────────────────────────────────────────

if (Test-Path $compDir) {
    Abort "Directory already exists: $compDir"
}

New-Item -ItemType Directory -Path $compDir | Out-Null
Write-Host ""
Write-Host "  Created: $compDir"

# ── 1. .ts ────────────────────────────────────────────────────────────────────

$tsContent = @"
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
    selector: '$fullName',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './$fullName.html',
    styleUrl: './$fullName.scss',
})
export class $className {
    // ── Inputs ────────────────────────────────────────────────

    // ── Computed ──────────────────────────────────────────────
    hostClass = computed(() => '$bemBase');
}
"@

Set-Content -Path "$compDir\$fullName.ts" -Value $tsContent -Encoding utf8
Ok "$fullName.ts"

# ── 2. .html ──────────────────────────────────────────────────────────────────

$htmlContent = @"
<div [class]="hostClass()">
    <ng-content />
</div>
"@

Set-Content -Path "$compDir\$fullName.html" -Value $htmlContent -Encoding utf8
Ok "$fullName.html"

# ── 3. .scss ──────────────────────────────────────────────────────────────────

$scssContent = @"
.$bemBase {
    // ── Layout ───────────────────────────────────────────────
    display: block;

    // ── Theme tokens ──────────────────────────────────────────
    background:    var(--zyra-color-$Name-bg);
    color:         var(--zyra-color-$Name-text);
    border-radius: var(--zyra-radius-md);
}
"@

Set-Content -Path "$compDir\$fullName.scss" -Value $scssContent -Encoding utf8
Ok "$fullName.scss"

# ── 4. .spec.ts ───────────────────────────────────────────────────────────────

$specContent = @"
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { $className } from './$fullName';

// ── Host fixtures ─────────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [$className],
    template: ``<$fullName>content</$fullName>``,
})
class ${hostName}Component {}

@Component({
    standalone: true,
    imports: [$className],
    template: ``<$fullName />``,
})
class ${hostName}EmptyComponent {}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('$className', () => {
    let fixture: ComponentFixture<${hostName}Component>;
    let component: $className;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [${hostName}Component],
        }).compileComponents();

        fixture = TestBed.createComponent(${hostName}Component);
        // Grab the first $className instance inside the host
        component = fixture.debugElement.children[0].componentInstance as $className;
        fixture.detectChanges();
    });

    // ── Render ────────────────────────────────────────────────────────────────

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('$fullName')).not.toBeNull();
    });

    it('applies the BEM root class "$bemBase"', () => {
        expect(fixture.nativeElement.querySelector('.$bemBase')).not.toBeNull();
    });

    it('projects slotted content inside the host', () => {
        const host: HTMLElement = fixture.nativeElement.querySelector('.$bemBase');
        expect(host?.textContent?.trim()).toBe('content');
    });

    // ── hostClass computed ─────────────────────────────────────────────────────

    it('hostClass() returns "$bemBase" by default', () => {
        expect(component.hostClass()).toBe('$bemBase');
    });

    // ── Inputs (add tests here as you define inputs) ───────────────────────────
    //
    // Example pattern:
    //   it('myInput defaults to false', () => {
    //       expect(component.myInput()).toBeFalse();
    //   });
    //
    //   it('myInput changes are reflected in the DOM', () => {
    //       fixture.componentRef.setInput('myInput', true);
    //       fixture.detectChanges();
    //       // assert DOM change
    //   });

    // ── Accessibility ──────────────────────────────────────────────────────────

    it('root element is in the document', () => {
        const el: HTMLElement = fixture.nativeElement.querySelector('$fullName');
        expect(el.isConnected).toBeTrue();
    });
});

describe('$className — empty slot', () => {
    it('renders without projected content without throwing', async () => {
        await TestBed.configureTestingModule({
            imports: [${hostName}EmptyComponent],
        }).compileComponents();

        const f = TestBed.createComponent(${hostName}EmptyComponent);
        expect(() => f.detectChanges()).not.toThrow();
    });
});
"@

Set-Content -Path "$compDir\$fullName.spec.ts" -Value $specContent -Encoding utf8
Ok "$fullName.spec.ts"

# ── 5. public-api.ts ──────────────────────────────────────────────────────────

$exportLine = "export * from './lib/components/$fullName/$fullName';"
$pubContent = Get-Content $pubApi -Raw

if ($pubContent -match [regex]::Escape($exportLine)) {
    Skip "public-api.ts (export already present)"
} else {
    # Append before the trailing newline
    $pubContent = $pubContent.TrimEnd() + "`n$exportLine`n"
    Set-Content -Path $pubApi -Value $pubContent -Encoding utf8 -NoNewline
    Ok "public-api.ts  (+export)"
}

# ── 6. _tokens-components.scss stub (tier 3 — applies to all 5 themes) ───────
#
# Tier 3 tokens reference tier 2 (semantic) tokens, which are themselves
# per-theme aliases — so one stub here covers dark/light/ocean/amber/rose
# automatically. Never write raw values or per-theme stubs into the 5 raw
# theme files for component styling; see docs/THEME_SYSTEM.md.

$componentToken = @"

    // ── $className ───────────────────────────────────────────
    --zyra-color-$Name-bg:     var(--zyra-color-surface-inset);
    --zyra-color-$Name-text:   var(--zyra-color-foreground);
    --zyra-color-$Name-border: var(--zyra-color-border-color);
"@

$tokensContent = Get-Content $tokensComponents -Raw
if ($tokensContent -match [regex]::Escape("--zyra-color-$Name-bg")) {
    Skip "_tokens-components.scss (tokens already present)"
} else {
    # Insert before the closing }
    $tokensContent = $tokensContent -replace '(\s*\}\s*)$', "$componentToken`n}"
    Set-Content -Path $tokensComponents -Value $tokensContent -Encoding utf8 -NoNewline
    Ok "_tokens-components.scss  (+tokens)"
}

# ── Summary ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "Done. 6 changes made." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps for you:" -ForegroundColor White
Write-Host "  1. Fill in inputs/outputs/computed logic in  $fullName.ts"
Write-Host "  2. Build the template in                     $fullName.html"
Write-Host "  3. Adjust the --zyra-color-$Name-* token stub in _tokens-components.scss"
Write-Host "     if the defaults (surface-inset/foreground/border-color) aren't right"
Write-Host "  4. Style with real token values in           $fullName.scss"
Write-Host "  5. Run:  ng build zyra-ng-ui"
Write-Host ""
Write-Host "MANDATORY token-tier rules (see CLAUDE.md) — verify before committing:" -ForegroundColor Yellow
Write-Host "  - Never read a raw per-theme token directly (--zyra-color-accent, -text," -ForegroundColor Yellow
Write-Host "    -border, -bg-app/panel/surface/raised, bare -success/-warning/-danger/-info," -ForegroundColor Yellow
Write-Host "    -text-inverse). Use the Tier 2/3 alias instead. Quick self-check:" -ForegroundColor Yellow
Write-Host "      grep -nE ""var\(--zyra-color-(accent|text|border|bg-app|bg-panel|bg-surface|" -ForegroundColor DarkGray
Write-Host "      bg-raised|card-bg|card-border|card-section-bg|danger|success|warning|info|" -ForegroundColor DarkGray
Write-Host "      text-muted|text-dim|text-inverse|border-strong)\)"" $fullName.scss" -ForegroundColor DarkGray
Write-Host "  - Never reference another component's Tier 3 token (e.g. a new component" -ForegroundColor Yellow
Write-Host "    must NOT use --zyra-color-sidebar-hover-bg) — add your own stub instead." -ForegroundColor Yellow
Write-Host "  - No hardcoded #hex / rgba() color values — tokens only." -ForegroundColor Yellow
Write-Host "  - Add a 'Tokens' entry for this component in:" -ForegroundColor Yellow
Write-Host "      projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts" -ForegroundColor Yellow
Write-Host "    (add a 'tokens: TokenEntry[]' array to its UiComponentShowcaseCard entry —" -ForegroundColor Yellow
Write-Host "    the shared doc-page template renders it automatically, no HTML changes needed)." -ForegroundColor Yellow
Write-Host ""
Write-Host "Tip: after adding inputs/signals, regenerate the spec:" -ForegroundColor DarkCyan
Write-Host "  node scripts/gen-spec.js projects/zyra-ng-ui/src/lib/components/$fullName/$fullName.ts --force"
Write-Host ""

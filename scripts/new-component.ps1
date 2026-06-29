<#
.SYNOPSIS
    Scaffolds a new zyra-ng-ui library component.

.DESCRIPTION
    Creates the 4 component files (.ts, .html, .scss, .spec.ts), adds the
    public-api.ts export, and inserts CSS token stubs into both theme files.

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

$root      = Split-Path $PSScriptRoot -Parent
$compDir   = "$root\projects\zyra-ng-ui\src\lib\components\$fullName"
$pubApi    = "$root\projects\zyra-ng-ui\src\public-api.ts"
$lightTheme = "$root\projects\zyra-ng-ui\src\lib\styles\_light-theme.scss"
$darkTheme  = "$root\projects\zyra-ng-ui\src\lib\styles\_dark-theme.scss"

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
    background:    var(--$bemBase-bg);
    color:         var(--$bemBase-color);
    border-radius: var(--zyr-radius-md);
}
"@

Set-Content -Path "$compDir\$fullName.scss" -Value $scssContent -Encoding utf8
Ok "$fullName.scss"

# ── 4. .spec.ts ───────────────────────────────────────────────────────────────

$specContent = @"
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { $className } from './$fullName';

@Component({
    standalone: true,
    imports: [$className],
    template: ``<$fullName>content</$fullName>``,
})
class ${hostName}Component {}

describe('$className', () => {
    let fixture: ComponentFixture<${hostName}Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [${hostName}Component],
        }).compileComponents();

        fixture = TestBed.createComponent(${hostName}Component);
        fixture.detectChanges();
    });

    it('renders the host element', () => {
        expect(fixture.nativeElement.querySelector('$fullName')).not.toBeNull();
    });

    it('applies the host class', () => {
        expect(fixture.nativeElement.querySelector('.$bemBase')).not.toBeNull();
    });

    it('projects content', () => {
        const host: HTMLElement = fixture.nativeElement.querySelector('.$bemBase');
        expect(host?.textContent?.trim()).toBe('content');
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

# ── 6. _light-theme.scss token stub ───────────────────────────────────────────

$lightToken = @"

    // ── $className ────────────────────────────────────────────
    --$bemBase-bg:    var(--zyr-bg-2);
    --$bemBase-color: var(--zyr-text);
"@

$lightContent = Get-Content $lightTheme -Raw
if ($lightContent -match [regex]::Escape("--$bemBase-bg")) {
    Skip "_light-theme.scss (tokens already present)"
} else {
    # Insert before the closing }
    $lightContent = $lightContent -replace '(\s*\}\s*)$', "$lightToken`n}"
    Set-Content -Path $lightTheme -Value $lightContent -Encoding utf8 -NoNewline
    Ok "_light-theme.scss  (+tokens)"
}

# ── 7. _dark-theme.scss token stub ────────────────────────────────────────────

$darkToken = @"

    // ── $className ────────────────────────────────────────────
    --$bemBase-bg:    var(--zyr-bg-3);
    --$bemBase-color: var(--zyr-text);
"@

$darkContent = Get-Content $darkTheme -Raw
if ($darkContent -match [regex]::Escape("--$bemBase-bg")) {
    Skip "_dark-theme.scss (tokens already present)"
} else {
    $darkContent = $darkContent -replace '(\s*\}\s*)$', "$darkToken`n}"
    Set-Content -Path $darkTheme -Value $darkContent -Encoding utf8 -NoNewline
    Ok "_dark-theme.scss  (+tokens)"
}

# ── Summary ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "Done. 7 changes made." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps for you:" -ForegroundColor White
Write-Host "  1. Fill in inputs/outputs/computed logic in  $fullName.ts"
Write-Host "  2. Build the template in                     $fullName.html"
Write-Host "  3. Style with real token values in           $fullName.scss"
Write-Host "  4. Replace --$bemBase-* stubs with real values in both theme files"
Write-Host "  5. Run:  ng build zyra-ng-ui"
Write-Host ""

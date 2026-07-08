<#
.SYNOPSIS
    Wires the zyra-breadcrumb component + JSON-LD SEO breadcrumb into an
    existing marketing-site page.

.DESCRIPTION
    Every page under projects/zyra-ui/src/app/{pages,blog}/... that has an
    SEO entry follows the same 7-point pattern when it also shows a
    breadcrumb: OnDestroy on the class, ZyraBreadcrumb/ZyraBreadcrumbItem in
    both the top-level zyra-ng-ui import and the @Component imports array, a
    breadcrumbJsonLd import, a readonly breadcrumbItems array, an
    injectJsonLd call at the end of ngOnInit, an ngOnDestroy that calls
    removeJsonLd, and a <zyra-breadcrumb> block at the top of the template.
    This script applies all 7 so it doesn't have to be redone by hand (or
    re-derived by Claude) for every new page.

.PARAMETER Page
    Path to the page, relative to projects/zyra-ui/src/app, without extension.
    Example: "pages/about/about"  or  "blog/blog-list/blog-list"

.PARAMETER Crumbs
    One or more "Label|Url" pairs, in order. Example:
    -Crumbs "Home|https://www.zyraui.dev/" "About|https://www.zyraui.dev/about"

.EXAMPLE
    .\scripts\add-breadcrumb.ps1 -Page pages/pricing/pricing -Crumbs "Home|https://www.zyraui.dev/" "Pricing|https://www.zyraui.dev/pricing"

.NOTES
    Static breadcrumbItems only (a readonly array literal). Pages with a
    route-dependent breadcrumb (computed from params, e.g. ui-component-detail
    or blog-details) need a computed() signal instead — skip this script and
    wire those two spots by hand.
#>

param(
    [Parameter(Mandatory = $true)]
    [string] $Page,

    [Parameter(Mandatory = $true)]
    [string[]] $Crumbs
)

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

# ── Paths ─────────────────────────────────────────────────────────────────────

$root    = Split-Path $PSScriptRoot -Parent
$appDir  = "$root\projects\zyra-ui\src\app"
$tsFile  = "$appDir\$Page.ts"
$htmlFile = "$appDir\$Page.html"

if (-not (Test-Path $tsFile))   { Abort "Not found: $tsFile" }
if (-not (Test-Path $htmlFile)) { Abort "Not found: $htmlFile" }

$depth = ($Page -split '/').Length - 1
if ($depth -ne 2) {
    Abort "Expected a page two levels deep (e.g. 'pages/about/about'), got depth $depth for '$Page'"
}
$jsonldImportPath = "../../shared/breadcrumb-jsonld"

# ── Parse crumbs ──────────────────────────────────────────────────────────────

$parsedCrumbs = foreach ($c in $Crumbs) {
    $parts = $c -split '\|', 2
    if ($parts.Length -ne 2) { Abort "Crumb must be 'Label|Url', got: '$c'" }
    [PSCustomObject]@{ Label = $parts[0]; Url = $parts[1] }
}

Write-Host ""
Write-Host "Wiring breadcrumb into: $Page" -ForegroundColor Cyan
Write-Host ""

$ts = Get-Content $tsFile -Raw

if ($ts -match [regex]::Escape('breadcrumbItems')) {
    Abort "breadcrumbItems already present in $tsFile — nothing to do."
}

# ── 1. OnDestroy on the @angular/core import ──────────────────────────────────

if ($ts -match "import \{ Component, OnInit, inject \} from '@angular/core';") {
    $ts = $ts -replace "import \{ Component, OnInit, inject \} from '@angular/core';", "import { Component, OnDestroy, OnInit, inject } from '@angular/core';"
    Ok "OnDestroy import"
} elseif ($ts -match 'OnDestroy') {
    Skip "OnDestroy import (already present)"
} else {
    Abort "Could not find the expected '@angular/core' import line — wire OnDestroy in by hand."
}

# ── 2. 'implements OnInit' -> 'implements OnInit, OnDestroy' ──────────────────

if ($ts -match 'implements OnInit \{') {
    $ts = $ts -replace 'implements OnInit \{', 'implements OnInit, OnDestroy {'
    Ok "implements OnDestroy"
} else {
    Abort "Could not find 'implements OnInit {' on the class declaration — wire it in by hand."
}

# ── 3. breadcrumb-jsonld import, anchored after the SeoService import ────────

$seoImportPattern = "(import \{ SeoService \} from '[^']+seo\.service';\r?\n)"
if ($ts -match $seoImportPattern) {
    $ts = $ts -replace $seoImportPattern, "`$1import { breadcrumbJsonLd, BreadcrumbLink } from '$jsonldImportPath';`n"
    Ok "breadcrumbJsonLd import"
} else {
    Abort "Could not find the SeoService import line to anchor on — wire the breadcrumb-jsonld import in by hand."
}

# ── 4. ZyraBreadcrumb/ZyraBreadcrumbItem in the zyra-ng-ui component import ───

$zyraImportRegex = [regex]"import \{([^}]*\bZyra[A-Z][A-Za-z]*\b[^}]*)\} from 'zyra-ng-ui';"
$zyraImportMatch = $zyraImportRegex.Matches($ts) | Where-Object { $_.Groups[1].Value -notmatch '\btype\b' } | Select-Object -First 1

if ($null -eq $zyraImportMatch) {
    Abort "Could not find a zyra-ng-ui component import line to extend — add ZyraBreadcrumb/ZyraBreadcrumbItem by hand."
} elseif ($zyraImportMatch.Value -match 'ZyraBreadcrumb\b') {
    Skip "zyra-ng-ui import (ZyraBreadcrumb already present)"
} else {
    $names = $zyraImportMatch.Groups[1].Value.Trim().TrimEnd(',')
    $newImport = "import { $names, ZyraBreadcrumb, ZyraBreadcrumbItem } from 'zyra-ng-ui';"
    $ts = $ts.Substring(0, $zyraImportMatch.Index) + $newImport + $ts.Substring($zyraImportMatch.Index + $zyraImportMatch.Length)
    Ok "zyra-ng-ui import  (+ZyraBreadcrumb, ZyraBreadcrumbItem)"
}

# ── 5. ZyraBreadcrumb/ZyraBreadcrumbItem in the @Component imports array ──────

$decoratorImportsRegex = [regex]"(imports: \[)([^\]]*)(\])"
$decoratorMatch = $decoratorImportsRegex.Match($ts)

if (-not $decoratorMatch.Success) {
    Abort "Could not find the @Component 'imports: [...]' array — add ZyraBreadcrumb/ZyraBreadcrumbItem by hand."
} elseif ($decoratorMatch.Groups[2].Value -match 'ZyraBreadcrumb\b') {
    Skip "@Component imports array (already present)"
} else {
    $inner = $decoratorMatch.Groups[2].Value.TrimEnd() -replace ',\s*$', ''
    $replacement = "$($decoratorMatch.Groups[1].Value)$inner, ZyraBreadcrumb, ZyraBreadcrumbItem$($decoratorMatch.Groups[3].Value)"
    $ts = $ts.Substring(0, $decoratorMatch.Index) + $replacement + $ts.Substring($decoratorMatch.Index + $decoratorMatch.Length)
    Ok "@Component imports array  (+ZyraBreadcrumb, ZyraBreadcrumbItem)"
}

# ── 6. readonly breadcrumbItems array, anchored right before ngOnInit ────────

$crumbLines = ($parsedCrumbs | ForEach-Object { "        { label: '$($_.Label)', url: '$($_.Url)' }," }) -join "`n"
$breadcrumbField = @"
    readonly breadcrumbItems: readonly BreadcrumbLink[] = [
$crumbLines
    ];
"@

# Line-anchored (^) with Multiline so the indent capture can't swallow a
# preceding blank line the way a plain \s* would.
$ngOnInitAnchor = [regex]::new('^([ \t]*)ngOnInit\(\): void \{', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$ngOnInitAnchorMatch = $ngOnInitAnchor.Match($ts)

if (-not $ngOnInitAnchorMatch.Success) {
    Abort "Could not find 'ngOnInit(): void {' to anchor on — add breadcrumbItems/injectJsonLd/ngOnDestroy by hand."
}

$classIndent = $ngOnInitAnchorMatch.Groups[1].Value
$insertAt = $ngOnInitAnchorMatch.Index
$ts = $ts.Substring(0, $insertAt) + "$breadcrumbField`n`n" + $ts.Substring($insertAt)
Ok "breadcrumbItems field"

# ── 7. injectJsonLd call at the end of ngOnInit + ngOnDestroy method ──────────
#
# Anchored on the closing brace of ngOnInit's own body — a line consisting of
# ONLY whitespace + '}' followed immediately by a newline. This deliberately
# excludes nested-block closers like the setSEO({ ... }) call's "});" line,
# since those have ')' (not a newline) right after the '}'.

$ngOnInitRegex = [regex]"(\r?\n$([regex]::Escape($classIndent))ngOnInit\(\): void \{[\s\S]*?)\r?\n$([regex]::Escape($classIndent))\}\r?\n"
$ngOnInitMatch = $ngOnInitRegex.Match($ts)

if (-not $ngOnInitMatch.Success) {
    Abort "Could not find ngOnInit's own closing brace — add injectJsonLd/ngOnDestroy by hand."
} else {
    $bodyIndent = "$classIndent    "
    $injectLine = "$bodyIndent" + "this.seo.injectJsonLd('breadcrumb-jsonld', breadcrumbJsonLd(this.breadcrumbItems));"
    $closeAndDestroy = "$classIndent}`n`n${classIndent}ngOnDestroy(): void {`n${bodyIndent}this.seo.removeJsonLd('breadcrumb-jsonld');`n$classIndent}`n"
    $replacement = $ngOnInitMatch.Groups[1].Value + "`n`n" + $injectLine + "`n" + $closeAndDestroy
    $ts = $ts.Substring(0, $ngOnInitMatch.Index) + $replacement + $ts.Substring($ngOnInitMatch.Index + $ngOnInitMatch.Length)
    Ok "injectJsonLd call + ngOnDestroy method"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($tsFile, $ts, $utf8NoBom)

# ── 8. <zyra-breadcrumb> block at the top of the template ────────────────────

$html = Get-Content $htmlFile -Raw

if ($html -match '<zyra-breadcrumb>') {
    Skip "$($Page.Split('/')[-1]).html (breadcrumb block already present)"
} else {
    $breadcrumbBlock = @"
    <zyra-breadcrumb>
        @for (crumb of breadcrumbItems; track crumb.label; let last = `$last) {
            <zyra-breadcrumb-item [href]="crumb.url" [current]="last">{{ crumb.label }}</zyra-breadcrumb-item>
        }
    </zyra-breadcrumb>

"@
    $html = $html -replace '(<main[^>]*>\r?\n)', "`$1$breadcrumbBlock"
    [System.IO.File]::WriteAllText($htmlFile, $html, $utf8NoBom)
    Ok "$($Page.Split('/')[-1]).html  (+breadcrumb block)"
}

# ── Summary ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "Done." -ForegroundColor Cyan
Write-Host ""
Write-Host "Verify by hand:" -ForegroundColor White
Write-Host "  1. The <zyra-breadcrumb> block landed right after the opening <main> tag"
Write-Host "  2. ngOnInit's injectJsonLd call sits after setSEO(), not before"
Write-Host "  3. npm run build:app"
Write-Host ""

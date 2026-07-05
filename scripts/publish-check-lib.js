#!/usr/bin/env node
'use strict';

/**
 * publish-check-lib.js
 *
 * Pre-publish sanity check for zyra-ng-ui. Run this before `npm run publish:lib`
 * or `npm run release` — it catches the mistakes that are cheap to catch now and
 * expensive to fix after `npm publish` (versions can't be unpublished after 24h,
 * and consumers may have already installed a broken release).
 *
 * Usage:
 *   node scripts/publish-check-lib.js
 *   npm run check:lib
 *
 * Exits non-zero if any check fails.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const LIB_PKG_PATH = path.join(ROOT, 'projects/zyra-ng-ui/package.json');
const ROOT_PKG_PATH = path.join(ROOT, 'package.json');
const VERSION_TS_PATH = path.join(ROOT, 'projects/zyra-ui/src/app/shared/version.ts');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');
const LIB_SRC_DIR = path.join(ROOT, 'projects/zyra-ng-ui/src/lib');

let failures = 0;
let warnings = 0;

function pass(label) {
    console.log(`\x1b[32m✔\x1b[0m  ${label}`);
}

function fail(label, detail) {
    console.log(`\x1b[31m✖\x1b[0m  ${label}`);
    if (detail) console.log(`   ${detail}`);
    failures++;
}

function warn(label, detail) {
    console.log(`\x1b[33m⚠\x1b[0m  ${label}`);
    if (detail) console.log(`   ${detail}`);
    warnings++;
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function exec(cmd, cwd = ROOT) {
    return execSync(cmd, { cwd, encoding: 'utf8' }).trim();
}

// ── 1. Version consistency across every file that has to agree ─────────────

const libPkg = readJson(LIB_PKG_PATH);
const version = libPkg.version;
console.log(`\nAuditing zyra-ng-ui v${version} before publish...\n`);

const rootPkg = readJson(ROOT_PKG_PATH);
const rootDepRange = rootPkg.dependencies?.['zyra-ng-ui'];
if (rootDepRange === `^${version}`) {
    pass(`Root package.json dependency matches (^${version})`);
} else {
    fail(
        'Root package.json dependency out of sync',
        `Expected ^${version}, found ${rootDepRange ?? '(missing)'}. Run: node scripts/bump-version-lib.js ${version}`,
    );
}

if (fs.existsSync(VERSION_TS_PATH)) {
    const versionTs = fs.readFileSync(VERSION_TS_PATH, 'utf8');
    if (versionTs.includes(`'${version}'`)) {
        pass(`LIBRARY_VERSION constant matches (${version})`);
    } else {
        fail('LIBRARY_VERSION constant out of sync', `${VERSION_TS_PATH} does not contain '${version}'`);
    }
} else {
    warn('version.ts not found', VERSION_TS_PATH);
}

// ── 2. CHANGELOG has a real, filled-in entry for this version ──────────────

const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
const marker = `## [${version}]`;
const markerIdx = changelog.indexOf(marker);
if (markerIdx === -1) {
    fail('CHANGELOG.md has no entry for this version', `Expected a "${marker}" heading`);
} else {
    const nextMarkerIdx = changelog.indexOf('\n## [', markerIdx + marker.length);
    const section = changelog.slice(markerIdx, nextMarkerIdx === -1 ? undefined : nextMarkerIdx);
    const bodyLines = section
        .split('\n')
        .slice(1)
        .filter((l) => l.trim().startsWith('-'));
    const emptyBullets = bodyLines.filter((l) => l.trim() === '-');
    if (bodyLines.length === 0) {
        fail('CHANGELOG.md entry is empty', `Fill in what changed under "${marker}"`);
    } else if (emptyBullets.length > 0) {
        fail('CHANGELOG.md has unfilled bullet points', `${emptyBullets.length} empty "-" line(s) under "${marker}"`);
    } else {
        pass(`CHANGELOG.md entry for ${version} is filled in (${bodyLines.length} line(s))`);
    }
}

// ── 3. Version not already published ────────────────────────────────────────

try {
    const published = JSON.parse(exec(`npm view ${libPkg.name} versions --json`));
    if (published.includes(version)) {
        fail(`Version ${version} is already published`, 'Bump the version again — npm will reject a duplicate publish');
    } else {
        pass(`Version ${version} is not yet on the npm registry`);
    }
} catch (e) {
    warn('Could not check published versions', e.message.split('\n')[0]);
}

// ── 4. Working tree state ───────────────────────────────────────────────────

const gitStatus = exec('git status --porcelain');
if (gitStatus) {
    warn('Working tree has uncommitted changes', 'Publishing from a dirty tree makes the release hard to reproduce/tag later');
} else {
    pass('Working tree is clean');
}

// ── 5. No debug leftovers in library source ─────────────────────────────────

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!['node_modules', '.spec.ts'].some((skip) => full.includes(skip))) walk(full, files);
        } else if (/\.(ts)$/.test(entry.name) && !entry.name.endsWith('.spec.ts')) {
            files.push(full);
        }
    }
    return files;
}

const debugPattern = /\bconsole\.(log|debug)\(|debugger;/;
const offenders = [];
for (const file of walk(LIB_SRC_DIR)) {
    const src = fs.readFileSync(file, 'utf8');
    if (debugPattern.test(src)) offenders.push(path.relative(ROOT, file));
}
if (offenders.length > 0) {
    fail(`Found console.log/debugger in library source`, offenders.join('\n   '));
} else {
    pass('No console.log/debugger left in library source');
}

// ── 6. Lint, test, build ─────────────────────────────────────────────────────

function runStep(label, cmd) {
    try {
        execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
        pass(label);
    } catch (e) {
        fail(label, e.stdout?.toString().split('\n').slice(-15).join('\n   '));
    }
}

runStep('Lint (zyra-ng-ui)', 'npx ng lint zyra-ng-ui');
runStep('Tests (zyra-ng-ui, headless)', 'npx ng test zyra-ng-ui --watch=false --browsers=ChromeHeadless');
runStep('Library build', 'npm run build:lib');

// ── 7. package.json "exports" map targets exist in the built dist output ────
// ng-packagr copies these into dist/zyra-ng-ui, not projects/zyra-ng-ui (source),
// so this must run after the build step above.

function collectExportPaths(node, out = []) {
    if (typeof node === 'string') {
        out.push(node);
    } else if (node && typeof node === 'object') {
        for (const value of Object.values(node)) collectExportPaths(value, out);
    }
    return out;
}

const styleExports = [...new Set(collectExportPaths(libPkg.exports ?? {}))];
const distDir = path.join(ROOT, 'dist/zyra-ng-ui');
if (fs.existsSync(distDir)) {
    const missingExports = styleExports.filter((rel) => !fs.existsSync(path.join(distDir, rel)));
    if (missingExports.length > 0) {
        fail('package.json "exports" references files missing from dist/zyra-ng-ui', missingExports.join('\n   '));
    } else {
        pass(`All ${styleExports.length} package.json "exports" targets exist in dist`);
    }
} else {
    warn('Skipped exports check', 'dist/zyra-ng-ui not built');
}

// ── 8. Dry-run publish ───────────────────────────────────────────────────────

if (fs.existsSync(path.join(ROOT, 'dist/zyra-ng-ui/package.json'))) {
    try {
        exec('npm publish --dry-run --access public', path.join(ROOT, 'dist/zyra-ng-ui'));
        pass('Dry-run publish succeeded');
    } catch (e) {
        fail('Dry-run publish failed', e.message.split('\n')[0]);
    }
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(60));
if (failures > 0) {
    console.log(`\x1b[31m${failures} check(s) failed\x1b[0m, ${warnings} warning(s). Fix before publishing.`);
    process.exit(1);
} else if (warnings > 0) {
    console.log(`All checks passed, but \x1b[33m${warnings} warning(s)\x1b[0m — review before publishing.`);
} else {
    console.log('\x1b[32mAll checks passed.\x1b[0m Safe to run: npm run publish:lib');
}

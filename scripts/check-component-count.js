#!/usr/bin/env node
'use strict';

/**
 * check-component-count.js
 *
 * Counts components defined in ui-components.data.ts (source of truth) and
 * verifies every hardcoded reference across the site is in sync.
 *
 * Usage:
 *   node scripts/check-component-count.js          -- report only
 *   node scripts/check-component-count.js --fix    -- report + auto-fix mismatches
 */

const fs = require('fs');
const path = require('path');

const FIX = process.argv.includes('--fix');
const ROOT = path.resolve(__dirname, '..');

// ── Source of truth ────────────────────────────────────────────────────────
const DATA_FILE = path.join(
    ROOT,
    'projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts',
);

function countComponents() {
    const src = fs.readFileSync(DATA_FILE, 'utf8');
    const matches = [...src.matchAll(/slug:\s*'([a-z0-9-]+)'/g)];
    return { count: matches.length, slugs: matches.map((m) => m[1]) };
}

// ── Check definitions ──────────────────────────────────────────────────────
// Each check has:
//   file     — relative path from root
//   label    — human-readable description
//   find(src, n) — returns the found number, or null if not found
//   fix(src, n)  — returns the corrected file content

const CHECKS = [
    {
        file: 'projects/zyra-ui/src/app/components/sidebar/sidebar.ts',
        label: 'Sidebar badge (sidebar.ts)',
        find(src) {
            const m = src.match(/badge:\s*'(\d+)'/);
            return m ? parseInt(m[1], 10) : null;
        },
        fix(src, n) {
            return src.replace(/badge:\s*'\d+'/, `badge: '${n}'`);
        },
    },
    {
        file: 'projects/zyra-ui/src/app/pages/about/about.html',
        label: 'About page hero copy (about.html)',
        find(src) {
            const m = src.match(/(\d+)\s+components,/);
            return m ? parseInt(m[1], 10) : null;
        },
        fix(src, n) {
            return src.replace(/\d+(\s+components,)/, `${n}$1`);
        },
    },
    {
        file: 'projects/zyra-ui/src/app/pages/docs/docs.html',
        label: 'Docs page heading (docs.html)',
        find(src) {
            const m = src.match(/All\s+(\d+)\s+components/);
            return m ? parseInt(m[1], 10) : null;
        },
        fix(src, n) {
            return src.replace(/All\s+\d+(\s+components)/, `All ${n}$1`);
        },
    },
];

// ── Note: home.html uses {{ componentCount }} which is auto-derived from
//    UI_COMPONENT_SHOWCASE.length — no hardcoded value, always correct. ─────

// ── Runner ─────────────────────────────────────────────────────────────────

function run() {
    const { count: expected, slugs } = countComponents();

    console.log(`\nSource of truth: ${DATA_FILE}`);
    console.log(`Components found: ${expected}`);
    console.log(`  ${slugs.join(', ')}\n`);
    console.log('─'.repeat(64));

    let issues = 0;

    for (const check of CHECKS) {
        const filePath = path.join(ROOT, check.file);

        if (!fs.existsSync(filePath)) {
            console.log(`  SKIP  ${check.label}`);
            console.log(`        File not found: ${check.file}\n`);
            continue;
        }

        const src = fs.readFileSync(filePath, 'utf8');
        const found = check.find(src);

        if (found === null) {
            console.log(`  WARN  ${check.label}`);
            console.log(`        No numeric count pattern found in ${check.file}\n`);
            continue;
        }

        if (found === expected) {
            console.log(`  OK    ${check.label}`);
            console.log(`        Value: ${found} ✓\n`);
        } else {
            issues++;
            console.log(`  FAIL  ${check.label}`);
            console.log(`        Found: ${found}  →  Expected: ${expected}`);

            if (FIX) {
                const fixed = check.fix(src, expected);
                fs.writeFileSync(filePath, fixed, 'utf8');
                console.log(`        Fixed: ${check.file}`);
            } else {
                console.log(`        Run with --fix to update automatically`);
            }

            console.log();
        }
    }

    console.log('─'.repeat(64));

    if (issues === 0) {
        console.log(`All ${CHECKS.length} checks passed. Component count is ${expected} everywhere.\n`);
        process.exitCode = 0;
    } else if (FIX) {
        console.log(`Fixed ${issues} out-of-sync reference(s). Component count is now ${expected} everywhere.\n`);
        process.exitCode = 0;
    } else {
        console.log(`${issues} out-of-sync reference(s) found. Run with --fix to update them.\n`);
        process.exitCode = 1;
    }
}

run();

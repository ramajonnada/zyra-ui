#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LIB_COMPONENTS_DIR = path.join(ROOT, 'projects/zyra-ng-ui/src/lib/components');
const PLAYGROUND_REGISTRY_FILE = path.join(
    ROOT,
    'projects/zyra-ui/src/app/pages/ui-components/shared/playground/playground-registry.ts',
);
const SHOWCASE_DATA_FILE = path.join(
    ROOT,
    'projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts',
);

function listDirs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
}

function hasFile(dir, predicate) {
    if (!fs.existsSync(dir)) return false;
    return fs.readdirSync(dir).some(predicate);
}

function getShowcaseSlugs() {
    const content = fs.readFileSync(SHOWCASE_DATA_FILE, 'utf8');
    const slugs = new Set();
    for (const match of content.matchAll(/slug:\s*'([a-z0-9-]+)'/g)) {
        slugs.add(match[1]);
    }
    return slugs;
}

function getRegistrySlugs() {
    const content = fs.readFileSync(PLAYGROUND_REGISTRY_FILE, 'utf8');
    const slugs = new Set();
    // Match renderer imports — every registered component has one
    for (const match of content.matchAll(/import \{ \w+Renderer \} from '\.\/renderers\/([a-z0-9-]+)-renderer'/g)) {
        slugs.add(match[1]);
    }
    return slugs;
}

function toSlug(libDirName) {
    return libDirName.replace(/^zyra-/, '');
}

function audit() {
    const libDirs = listDirs(LIB_COMPONENTS_DIR);
    const showcaseSlugs = getShowcaseSlugs();
    const registrySlugs = getRegistrySlugs();

    const rows = libDirs.map((libDirName) => {
        const slug = toSlug(libDirName);
        const libDir = path.join(LIB_COMPONENTS_DIR, libDirName);

        const hasLibSpec = hasFile(libDir, (f) => f.endsWith('.spec.ts'));
        const hasRegistryEntry = registrySlugs.has(slug);
        const hasShowcaseEntry = showcaseSlugs.has(slug);

        const missing = [];
        if (!hasLibSpec) missing.push('lib spec');
        if (!hasRegistryEntry) missing.push('playground registry');
        if (!hasShowcaseEntry) missing.push('showcase data');

        return {
            slug,
            hasLibSpec,
            hasRegistryEntry,
            hasShowcaseEntry,
            status: missing.length === 0 ? 'OK' : `Missing: ${missing.join(', ')}`,
        };
    });

    const colWidths = {
        slug: Math.max(9, ...rows.map((r) => r.slug.length)),
        status: Math.max(6, ...rows.map((r) => r.status.length)),
    };

    const header = `${'Component'.padEnd(colWidths.slug)} | Lib Spec | Registry | Showcase | Status`;
    console.log(header);
    console.log('-'.repeat(header.length));

    let failures = 0;
    for (const row of rows) {
        if (row.status !== 'OK') failures++;
        console.log(
            `${row.slug.padEnd(colWidths.slug)} | ${row.hasLibSpec ? 'Yes' : 'No '.padEnd(3)}      | ${
                row.hasRegistryEntry ? 'Yes' : 'No '
            }      | ${row.hasShowcaseEntry ? 'Yes' : 'No '}      | ${row.status}`,
        );
    }

    console.log('-'.repeat(header.length));
    console.log(`${rows.length} components checked, ${failures} incomplete.`);

    if (failures > 0) {
        process.exitCode = 1;
    }
}

audit();

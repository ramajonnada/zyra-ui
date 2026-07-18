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

// Components live one level deeper, under a category folder
// (projects/zyra-ng-ui/src/lib/components/<category>/zyra-<name>/).
function listComponentDirs(componentsRoot) {
    const categories = listDirs(componentsRoot);
    const result = [];
    for (const category of categories) {
        const categoryDir = path.join(componentsRoot, category);
        for (const name of listDirs(categoryDir)) {
            result.push({ name, dir: path.join(categoryDir, name) });
        }
    }
    return result;
}

function hasFile(dir, predicate) {
    if (!fs.existsSync(dir)) return false;
    return fs.readdirSync(dir).some(predicate);
}

// A compound component (e.g. zyra-button-group) can be colocated inside a
// sibling component's directory (e.g. zyra-button/) instead of getting its
// own top-level folder — same convention as zyra-sidebar-item living inside
// zyra-sidebar/. Directory-name matching alone misses these, so also search
// every component directory for a `zyra-<slug>.spec.ts` file directly.
function findLibSpec(componentDirs, slug) {
    const specFileName = `zyra-${slug}.spec.ts`;
    for (const { dir } of componentDirs) {
        if (fs.existsSync(path.join(dir, specFileName))) return true;
    }
    return false;
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
    const componentDirs = listComponentDirs(LIB_COMPONENTS_DIR);
    const showcaseSlugs = getShowcaseSlugs();
    const registrySlugs = getRegistrySlugs();

    // Union of every slug source: a directory-per-component slug, a showcase
    // entry, or a registry entry all count as "this component should exist".
    // Union (not just directory names) is what catches compound components
    // like zyra-button-group that are colocated in a sibling's directory.
    const dirSlugs = componentDirs.map(({ name }) => toSlug(name));
    const allSlugs = Array.from(new Set([...dirSlugs, ...showcaseSlugs, ...registrySlugs])).sort();

    const rows = allSlugs.map((slug) => {
        const hasLibSpec = dirSlugs.includes(slug)
            ? hasFile(componentDirs.find((d) => toSlug(d.name) === slug).dir, (f) => f.endsWith('.spec.ts'))
            : findLibSpec(componentDirs, slug);
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

#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LIB_COMPONENTS_DIR = path.join(ROOT, 'projects/zyra-ng-ui/src/lib/components');
const APP_COMP_DIR = path.join(ROOT, 'projects/zyra-ui/src/app/pages/ui-components/comp');
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

function toSlug(libDirName) {
	return libDirName.replace(/^zyra-/, '');
}

function audit() {
	const libDirs = listDirs(LIB_COMPONENTS_DIR);
	const showcaseSlugs = getShowcaseSlugs();

	const rows = libDirs.map((libDirName) => {
		const slug = toSlug(libDirName);
		const libDir = path.join(LIB_COMPONENTS_DIR, libDirName);
		const appDir = path.join(APP_COMP_DIR, slug);

		const hasLibSpec = hasFile(libDir, (f) => f.endsWith('.spec.ts'));
		const hasAppDemo = fs.existsSync(appDir) && hasFile(appDir, (f) => /\.ts$/.test(f) && !f.endsWith('.spec.ts'));
		const hasAppSpec = hasFile(appDir, (f) => f.endsWith('.spec.ts'));
		const hasShowcaseEntry = showcaseSlugs.has(slug);

		const missing = [];
		if (!hasLibSpec) missing.push('lib spec');
		if (!hasAppDemo) missing.push('app demo');
		if (!hasAppSpec) missing.push('app spec');
		if (!hasShowcaseEntry) missing.push('showcase data');

		return {
			slug,
			hasLibSpec,
			hasAppDemo,
			hasAppSpec,
			hasShowcaseEntry,
			status: missing.length === 0 ? 'OK' : `Missing: ${missing.join(', ')}`,
		};
	});

	const colWidths = {
		slug: Math.max(9, ...rows.map((r) => r.slug.length)),
		status: Math.max(6, ...rows.map((r) => r.status.length)),
	};

	const header = `${'Component'.padEnd(colWidths.slug)} | Lib Spec | App Demo | App Spec | Showcase | Status`;
	console.log(header);
	console.log('-'.repeat(header.length));

	let failures = 0;
	for (const row of rows) {
		if (row.status !== 'OK') failures++;
		console.log(
			`${row.slug.padEnd(colWidths.slug)} | ${row.hasLibSpec ? 'Yes' : 'No '.padEnd(3)}      | ${
				row.hasAppDemo ? 'Yes' : 'No '
			}      | ${row.hasAppSpec ? 'Yes' : 'No '}      | ${row.hasShowcaseEntry ? 'Yes' : 'No '}      | ${row.status}`,
		);
	}

	console.log('-'.repeat(header.length));
	console.log(`${rows.length} components checked, ${failures} incomplete.`);

	if (failures > 0) {
		process.exitCode = 1;
	}
}

audit();

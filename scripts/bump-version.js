#!/usr/bin/env node
/**
 * Usage: node scripts/bump-version.js <new-version>
 *    or: npm run version:bump -- 1.8.0
 *
 * Updates all version references when releasing a new zyra-ng-ui version:
 *   - projects/zyra-ng-ui/package.json        (library source version)
 *   - package.json                            (zyra-ng-ui npm dependency)
 *   - projects/zyra-ui/src/app/shared/version.ts  (LIBRARY_VERSION constant)
 *   - CHANGELOG.md                            (scaffolds a new entry)
 *   - public/sitemap.xml                      (adds missing component + blog URLs)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
    const original = fs.readFileSync(filePath, 'utf8');
    const indent = original.startsWith('{\n\t') ? '\t' : 2;
    fs.writeFileSync(filePath, JSON.stringify(data, null, indent) + '\n');
}

function bump(version) {
    if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
        console.error('Usage: node scripts/bump-version.js <version>  (e.g. 1.8.0)');
        process.exit(1);
    }

    const today = new Date().toISOString().slice(0, 10);

    // 1. Library source package.json
    const libPkgPath = path.join(ROOT, 'projects/zyra-ng-ui/package.json');
    const libPkg = readJson(libPkgPath);
    const prevVersion = libPkg.version;
    libPkg.version = version;
    writeJson(libPkgPath, libPkg);
    console.log(`✔ projects/zyra-ng-ui/package.json  ${prevVersion} → ${version}`);

    // 2. Root package.json dependency
    const rootPkgPath = path.join(ROOT, 'package.json');
    const rootPkg = readJson(rootPkgPath);
    rootPkg.dependencies['zyra-ng-ui'] = `^${version}`;
    writeJson(rootPkgPath, rootPkg);
    console.log(`✔ package.json (dependency)          ^${prevVersion} → ^${version}`);

    // 3. version.ts
    const versionTsPath = path.join(ROOT, 'projects/zyra-ui/src/app/shared/version.ts');
    const versionTs = fs.readFileSync(versionTsPath, 'utf8');
    const updatedTs = versionTs.replace(
        /LIBRARY_VERSION\s*=\s*'[^']*'/,
        `LIBRARY_VERSION = '${version}'`,
    );
    fs.writeFileSync(versionTsPath, updatedTs);
    console.log(`✔ shared/version.ts                  LIBRARY_VERSION → '${version}'`);

    // 4. Scaffold CHANGELOG entry
    const changelogPath = path.join(ROOT, 'CHANGELOG.md');
    let changelog = fs.readFileSync(changelogPath, 'utf8');
    const entry = `## [${version}] — ${today}

### Added
-

### Changed
-

### Fixed
-

---

`;
    changelog = changelog.replace(/^(# Changelog.*?\n---\n\n)/s, `$1${entry}`);
    fs.writeFileSync(changelogPath, changelog);
    console.log(`✔ CHANGELOG.md                       scaffolded [${version}] entry`);

    // 5. Sync sitemap
    syncSitemap(today);

    console.log('');
    console.log(`Version bumped to ${version}. Fill in the CHANGELOG entry, then run:`);
    console.log(`  npm install`);
}

function syncSitemap(today) {
    const BASE = 'https://www.zyraui.dev';
    const sitemapPath = path.join(ROOT, 'projects/zyra-ui/public/sitemap.xml');
    const dataPath = path.join(
        ROOT,
        'projects/zyra-ui/src/app/pages/ui-components/ui-components.data.ts',
    );
    const contentDir = path.join(ROOT, 'projects/zyra-ui/src/content');

    let sitemap = fs.readFileSync(sitemapPath, 'utf8');

    // Component slugs from data file
    const componentSlugs = [...dataPath]
        .join('')
        .replace(/.*/, fs.readFileSync(dataPath, 'utf8'))
        .match(/slug:\s*'([a-z0-9-]+)'/g)
        ?.map((m) => m.match(/'([a-z0-9-]+)'/)[1]) ?? [];

    // Blog slugs from content directory
    const blogSlugs = fs
        .readdirSync(contentDir)
        .filter((f) => f.endsWith('.md') && f !== 'index.json')
        .map((f) => f.replace(/\.md$/, ''));

    let added = 0;

    function addIfMissing(url, priority, changefreq) {
        if (sitemap.includes(`<loc>${url}</loc>`)) return;
        const entry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        sitemap = sitemap.replace('</urlset>', `${entry}\n</urlset>`);
        console.log(`  + ${url}`);
        added++;
    }

    componentSlugs.forEach((slug) =>
        addIfMissing(`${BASE}/components/${slug}`, '0.8', 'monthly'),
    );
    blogSlugs.forEach((slug) => addIfMissing(`${BASE}/blog/${slug}`, '0.7', 'monthly'));

    fs.writeFileSync(sitemapPath, sitemap);

    if (added > 0) {
        console.log(`✔ sitemap.xml                        +${added} new URL(s)`);
    } else {
        console.log(`✔ sitemap.xml                        already up to date`);
    }
}

bump(process.argv[2]);

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.zyraui.dev';
const today = new Date().toISOString().split('T')[0];

// For low-churn legal pages, stamping `today` on every build/deploy tells
// crawlers the content changed when it usually hasn't — pull the real last
// commit date for the page's source file instead. Falls back to `today`
// only if git history isn't available (e.g. a shallow checkout).
function lastCommitDate(relativeFilePath) {
    try {
        const out = execSync(`git log -1 --format=%ad --date=short -- "${relativeFilePath}"`, {
            cwd: resolve(__dirname, '../../..'),
            encoding: 'utf-8',
        }).trim();
        return out || today;
    } catch {
        return today;
    }
}

const indexJson = resolve(__dirname, '../src/content/index.json');
// Source of truth for component slugs — same file (and same regex) that
// scripts/check-component-count.js parses — so the sitemap can never drift
// out of sync with the actual showcase the way the old hand-maintained
// component-slugs.json did (it had 22 of 56 real components).
const componentsDataFile = resolve(
    __dirname,
    '../src/app/pages/ui-components/ui-components.data.ts',
);
const outputPath = resolve(__dirname, '../public/sitemap.xml');

const posts = JSON.parse(readFileSync(indexJson, 'utf-8'));
const componentsDataSrc = readFileSync(componentsDataFile, 'utf-8');
const componentSlugs = [...componentsDataSrc.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]);

function url(loc, lastmod, changefreq, priority) {
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const staticPages = [
    url(`${BASE_URL}/`,          today,        'weekly',  '1.0'),
    url(`${BASE_URL}/docs`,       today,        'weekly',  '0.9'),
    url(`${BASE_URL}/docs/installation`, today, 'monthly', '0.8'),
    url(`${BASE_URL}/docs/components`,   today, 'monthly', '0.8'),
    url(`${BASE_URL}/docs/theming`,      today, 'monthly', '0.8'),
    url(`${BASE_URL}/docs/theme-tokens`, today, 'monthly', '0.8'),
    url(`${BASE_URL}/blog`,       today,        'weekly',  '0.8'),
    url(`${BASE_URL}/about`,      today,        'monthly', '0.6'),
    url(`${BASE_URL}/contact`,    today,        'monthly', '0.6'),
    url(
        `${BASE_URL}/privacy`,
        lastCommitDate('projects/zyra-ui/src/app/components/privacy-policy/privacy-policy.html'),
        'yearly',
        '0.3',
    ),
    url(
        `${BASE_URL}/terms`,
        lastCommitDate('projects/zyra-ui/src/app/components/terms-of-services/terms-of-services.html'),
        'yearly',
        '0.3',
    ),
];

const componentPages = componentSlugs.map((slug) =>
    url(`${BASE_URL}/docs/components/${slug}`, today, 'monthly', '0.8'),
);

const blogPages = posts.map((post) => {
    const lastmod = post.date?.trim() || today;
    return url(`${BASE_URL}/blog/${post.slug}`, lastmod, 'monthly', '0.7');
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Static pages -->
${staticPages.join('\n')}

  <!-- Component pages -->
${componentPages.join('\n')}

  <!-- Blog posts -->
${blogPages.join('\n')}

</urlset>`;

writeFileSync(outputPath, sitemap, 'utf-8');
console.log(`✔ sitemap.xml generated — ${staticPages.length} static, ${componentPages.length} components, ${blogPages.length} blog posts`);

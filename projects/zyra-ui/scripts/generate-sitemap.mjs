import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.zyraui.dev';
const today = new Date().toISOString().split('T')[0];

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
    url(`${BASE_URL}/privacy`,    today,        'yearly',  '0.3'),
    url(`${BASE_URL}/terms`,      today,        'yearly',  '0.3'),
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

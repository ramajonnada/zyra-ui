import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.zyraui.dev';
const today = new Date().toISOString().split('T')[0];

const indexJson = resolve(__dirname, '../src/content/index.json');
const componentSlugsJson = resolve(__dirname, './component-slugs.json');
const outputPath = resolve(__dirname, '../public/sitemap.xml');

const posts = JSON.parse(readFileSync(indexJson, 'utf-8'));
const componentSlugs = JSON.parse(readFileSync(componentSlugsJson, 'utf-8'));

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
    url(`${BASE_URL}/components`, today,        'weekly',  '0.9'),
    url(`${BASE_URL}/docs`,       today,        'weekly',  '0.9'),
    url(`${BASE_URL}/blog`,       today,        'weekly',  '0.8'),
    url(`${BASE_URL}/about`,      today,        'monthly', '0.6'),
    url(`${BASE_URL}/contact`,    today,        'monthly', '0.6'),
    url(`${BASE_URL}/privacy`,    today,        'yearly',  '0.3'),
    url(`${BASE_URL}/terms`,      today,        'yearly',  '0.3'),
];

const componentPages = componentSlugs.map((slug) =>
    url(`${BASE_URL}/components/${slug}`, today, 'monthly', '0.8'),
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

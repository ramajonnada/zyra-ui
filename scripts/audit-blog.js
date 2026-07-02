#!/usr/bin/env node
// Blog post audit script — run before committing any blog post.
// Usage:
//   node scripts/audit-blog.js                  — audit all posts
//   node scripts/audit-blog.js <slug>           — audit one post

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT   = resolve(__dir, '..');
const INDEX  = resolve(ROOT, 'projects/zyra-ui/src/content/index.json');
const CONTENT = resolve(ROOT, 'projects/zyra-ui/src/content');

// ── Helpers ───────────────────────────────────────────────────────────────────

const BOLD  = (s) => `\x1b[1m${s}\x1b[0m`;
const RED   = (s) => `\x1b[31m${s}\x1b[0m`;
const YELLOW= (s) => `\x1b[33m${s}\x1b[0m`;
const GREEN = (s) => `\x1b[32m${s}\x1b[0m`;
const DIM   = (s) => `\x1b[2m${s}\x1b[0m`;

function extractFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    const fm = {};
    for (const line of match[1].split('\n')) {
        const [key, ...rest] = line.split(':');
        if (key && rest.length) fm[key.trim()] = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
    }
    return fm;
}

function stripFrontmatter(content) {
    return content.replace(/^---[\s\S]*?---\n/, '').trim();
}

// Rough word count from markdown (strip code blocks + html)
function wordCount(md) {
    return md
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/[#*`_[\]()>]/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length;
}

function estimateReadTime(words) {
    return Math.max(1, Math.round(words / 200));
}

// ── Rules — each returns { level: 'error'|'warn'|'info', message } or null ───

const RULES = [

    // 1. Required frontmatter fields
    ({ fm, slug }) => {
        const required = ['title', 'description', 'slug', 'date'];
        const missing = required.filter(f => !fm[f]);
        if (missing.length) return { level: 'error', message: `Missing frontmatter fields: ${missing.join(', ')}` };
        return null;
    },

    // 2. Slug in frontmatter must match filename
    ({ fm, slug }) => {
        if (fm.slug && fm.slug !== slug) {
            return { level: 'error', message: `Slug mismatch — filename: "${slug}", frontmatter: "${fm.slug}"` };
        }
        return null;
    },

    // 3. Must exist in index.json
    ({ slug, indexEntry }) => {
        if (!indexEntry) return { level: 'error', message: `Not found in index.json — run: node scripts/new-blog.js to add it` };
        return null;
    },

    // 4. index.json must have readTime filled
    ({ indexEntry }) => {
        if (indexEntry && (!indexEntry.readTime || indexEntry.readTime.trim() === '')) {
            return { level: 'warn', message: `index.json: readTime is empty` };
        }
        return null;
    },

    // 5. index.json must have description filled
    ({ indexEntry }) => {
        if (indexEntry && (!indexEntry.description || indexEntry.description.trim() === '')) {
            return { level: 'warn', message: `index.json: description is empty` };
        }
        return null;
    },

    // 6. index.json must have at least 2 FAQ entries filled
    ({ indexEntry }) => {
        if (!indexEntry?.faq) return null;
        const filled = indexEntry.faq.filter(f => f.q && f.a);
        if (filled.length < 2) return { level: 'warn', message: `index.json: only ${filled.length} FAQ entries filled (need at least 2)` };
        return null;
    },

    // 7. Must have a TL;DR blockquote
    ({ body }) => {
        if (!body.includes('**TL;DR:**')) {
            return { level: 'warn', message: `Missing TL;DR blockquote at top of post` };
        }
        return null;
    },

    // 8. Must have a ## Frequently asked questions section
    ({ body }) => {
        if (!/##\s+Frequently asked questions/i.test(body)) {
            return { level: 'warn', message: `Missing "## Frequently asked questions" section` };
        }
        return null;
    },

    // 9. Outdated Angular syntax — *ngIf / *ngFor / *ngSwitch
    ({ body, slug }) => {
        const lines = body.split('\n');
        const hits = [];
        lines.forEach((line, i) => {
            // skip lines inside code blocks that are showing "before" examples intentionally
            if (/\*ngIf|\*ngFor|\*ngSwitch/.test(line)) {
                hits.push(`line ${i + 1}: ${line.trim().slice(0, 80)}`);
            }
        });
        if (hits.length) {
            return {
                level: 'warn',
                message: `Uses outdated Angular syntax (*ngIf/*ngFor/*ngSwitch):\n      ${hits.slice(0, 3).join('\n      ')}${hits.length > 3 ? `\n      ...and ${hits.length - 3} more` : ''}`,
            };
        }
        return null;
    },

    // 10. Fake Angular APIs — known non-existent APIs
    ({ body }) => {
        const fakeApis = [
            { pattern: /signalForm\s*\(/, name: 'signalForm()' },
            { pattern: /from\s+['"]@angular\/forms['"]\s*.*signalForm/, name: 'signalForm from @angular/forms' },
            { pattern: /linkedSignal\s*\(/, name: 'linkedSignal()' },
            { pattern: /provideZonelessChangeDetection\s*\(\)/, name: null }, // this IS real — skip
        ];
        const found = fakeApis
            .filter(a => a.name && a.pattern.test(body))
            .map(a => a.name);
        if (found.length) {
            return { level: 'error', message: `Potentially fake/incorrect Angular APIs used: ${found.join(', ')}` };
        }
        return null;
    },

    // 11. Broken image references
    ({ body, slug }) => {
        const imageMatches = [...body.matchAll(/!\[.*?\]\(([^)]+)\)/g)];
        const broken = [];
        for (const [, src] of imageMatches) {
            if (src.startsWith('http')) continue; // external — skip
            const imgPath = resolve(ROOT, 'projects/zyra-ui/src/assets', src.replace(/^\//, ''));
            const imgPath2 = resolve(ROOT, 'projects/zyra-ui/public', src.replace(/^\//, ''));
            if (!existsSync(imgPath) && !existsSync(imgPath2)) {
                broken.push(src);
            }
        }
        if (broken.length) {
            return { level: 'warn', message: `Broken image references: ${broken.join(', ')}` };
        }
        return null;
    },

    // 12. Emoji usage — warn if emojis appear in headings or body text
    ({ body }) => {
        const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        const lines = body.split('\n');
        const hits = lines.filter(l => emojiPattern.test(l)).length;
        if (hits > 0) {
            return { level: 'warn', message: `Contains ${hits} line(s) with emojis — keep blog tone professional` };
        }
        return null;
    },

    // 13. Must have at least one code block
    ({ body }) => {
        if (!body.includes('```')) {
            return { level: 'warn', message: `No code blocks found — technical blog posts should have code examples` };
        }
        return null;
    },

    // 14. Minimum content length
    ({ words }) => {
        if (words < 300) {
            return { level: 'error', message: `Too short — only ${words} words (minimum 300)` };
        }
        if (words < 600) {
            return { level: 'warn', message: `Short post — ${words} words (recommended 600+)` };
        }
        return null;
    },

    // 15. Read time estimate vs index.json
    ({ words, indexEntry }) => {
        if (!indexEntry?.readTime) return null;
        const estimated = estimateReadTime(words);
        const declared = parseInt(indexEntry.readTime);
        if (isNaN(declared)) return null;
        if (Math.abs(estimated - declared) > 3) {
            return { level: 'warn', message: `Read time mismatch — estimated ~${estimated} min, index.json says "${indexEntry.readTime}"` };
        }
        return null;
    },

    // 16. Title length
    ({ fm }) => {
        if (fm.title && fm.title.length > 80) {
            return { level: 'warn', message: `Title is ${fm.title.length} chars — keep under 80 for SEO` };
        }
        return null;
    },

    // 17. Description length
    ({ fm }) => {
        if (!fm.description) return null;
        if (fm.description.length < 50) return { level: 'warn', message: `Description too short (${fm.description.length} chars) — aim for 120–160` };
        if (fm.description.length > 170) return { level: 'warn', message: `Description too long (${fm.description.length} chars) — Google truncates at 160` };
        return null;
    },

    // 18. "Thank you" sign-off — unprofessional ending
    ({ body }) => {
        if (/^thank you\s*$/im.test(body)) {
            return { level: 'warn', message: `Post ends with "Thank you" — remove this, use a proper final-thoughts section` };
        }
        return null;
    },
];

// ── Audit a single post ───────────────────────────────────────────────────────

function auditPost(filePath, indexEntries) {
    const filename = basename(filePath, '.md');
    const content  = readFileSync(filePath, 'utf8');
    const fm       = extractFrontmatter(content);
    const body     = stripFrontmatter(content);
    const words    = wordCount(body);
    const indexEntry = indexEntries.find(e => e.slug === filename);

    const ctx = { fm, body, slug: filename, words, indexEntry };

    const results = RULES.map(rule => rule(ctx)).filter(Boolean);
    const errors  = results.filter(r => r.level === 'error');
    const warns   = results.filter(r => r.level === 'warn');

    return { slug: filename, words, errors, warns };
}

// ── Main ──────────────────────────────────────────────────────────────────────

const indexEntries = JSON.parse(readFileSync(INDEX, 'utf8'));

// Determine which files to audit
const targetSlug = process.argv[2];
let files;

if (targetSlug) {
    const path = resolve(CONTENT, `${targetSlug}.md`);
    if (!existsSync(path)) {
        console.error(RED(`\n✗ File not found: ${path}\n`));
        process.exit(1);
    }
    files = [path];
} else {
    files = readdirSync(CONTENT)
        .filter(f => f.endsWith('.md'))
        .map(f => resolve(CONTENT, f));
}

// Check for orphaned index.json entries (slug in index but no .md file)
if (!targetSlug) {
    const mdSlugs = readdirSync(CONTENT).filter(f => f.endsWith('.md')).map(f => basename(f, '.md'));
    const orphaned = indexEntries.filter(e => !mdSlugs.includes(e.slug));
    if (orphaned.length) {
        console.log(YELLOW(`\n⚠  index.json has ${orphaned.length} entr${orphaned.length === 1 ? 'y' : 'ies'} with no matching .md file:`));
        orphaned.forEach(e => console.log(DIM(`   - ${e.slug}`)));
    }
}

// Run audit
let totalErrors = 0;
let totalWarns  = 0;
const results   = [];

for (const file of files) {
    results.push(auditPost(file, indexEntries));
}

// ── Print results ─────────────────────────────────────────────────────────────

console.log(`\n${BOLD('Blog Post Audit')}  ${DIM(`(${files.length} post${files.length === 1 ? '' : 's'})`)}\n`);
console.log('─'.repeat(60));

for (const r of results) {
    const hasIssues = r.errors.length + r.warns.length > 0;
    const status = r.errors.length   ? RED('✗ FAIL')
                 : r.warns.length    ? YELLOW('⚠ WARN')
                 : GREEN('✓ PASS');

    console.log(`\n${status}  ${BOLD(r.slug)}  ${DIM(`(~${r.words} words, ~${estimateReadTime(r.words)} min read)`)}`);

    for (const e of r.errors) {
        console.log(RED(`       ✗ [error] ${e.message}`));
    }
    for (const w of r.warns) {
        console.log(YELLOW(`       ⚠ [warn]  ${w.message}`));
    }
    if (!hasIssues) {
        console.log(DIM(`       No issues found.`));
    }

    totalErrors += r.errors.length;
    totalWarns  += r.warns.length;
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(60)}`);

if (totalErrors === 0 && totalWarns === 0) {
    console.log(GREEN(`\n✓ All posts passed — ${results.length} post${results.length === 1 ? '' : 's'} clean.\n`));
} else {
    const parts = [];
    if (totalErrors) parts.push(RED(`${totalErrors} error${totalErrors === 1 ? '' : 's'}`));
    if (totalWarns)  parts.push(YELLOW(`${totalWarns} warning${totalWarns === 1 ? '' : 's'}`));
    console.log(`\nResult: ${parts.join(', ')} across ${results.length} post${results.length === 1 ? '' : 's'}.`);

    if (totalErrors > 0) {
        console.log(RED('\nFix all errors before committing.\n'));
        process.exit(1);
    } else {
        console.log(YELLOW('\nWarnings are advisory — fix before publishing.\n'));
    }
}

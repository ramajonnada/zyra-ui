#!/usr/bin/env node
// Usage:
//   node scripts/new-blog.js                  — list existing topics
//   node scripts/new-blog.js <slug> "<title>" — scaffold a new blog post

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const INDEX = resolve(ROOT, 'projects/zyra-ui/src/content/index.json');
const CONTENT = resolve(ROOT, 'projects/zyra-ui/src/content');

const index = JSON.parse(readFileSync(INDEX, 'utf8'));

// ── List mode ────────────────────────────────────────────────────────────────
if (process.argv.length < 4) {
    console.log('\nExisting blog topics:\n');
    index.forEach((p, i) => {
        console.log(`  ${String(i + 1).padStart(2, ' ')}. [${p.date}] ${p.title}`);
        console.log(`      slug: ${p.slug}\n`);
    });
    console.log('Usage to scaffold: node scripts/new-blog.js <slug> "<Title>"\n');
    process.exit(0);
}

// ── Scaffold mode ────────────────────────────────────────────────────────────
const slug = process.argv[2].trim().toLowerCase().replace(/\s+/g, '-');
const title = process.argv[3].trim();
const today = new Date().toISOString().split('T')[0];

// Guard: duplicate slug
if (index.some((p) => p.slug === slug)) {
    console.error(`\n✗ Slug "${slug}" already exists in index.json\n`);
    process.exit(1);
}

const mdPath = resolve(CONTENT, `${slug}.md`);
if (existsSync(mdPath)) {
    console.error(`\n✗ File already exists: ${mdPath}\n`);
    process.exit(1);
}

// ── Write markdown file ───────────────────────────────────────────────────────
const mdContent = `---
title: "${title}"
description: ""
category:
    - "Angular"
    - "Angular 21"
tags:
    - "angular"
keywords:
    - "${title}"
date: "${today}T10:00:00.000Z"
slug: "${slug}"
---

# ${title}

> **TL;DR:**

---

## Introduction

<!-- Write the blog post here -->
`;

writeFileSync(mdPath, mdContent, 'utf8');

// ── Prepend to index.json ─────────────────────────────────────────────────────
const newEntry = {
    imageUrl: '',
    readTime: '',
    slug,
    title,
    description: '',
    category: ['Angular 21'],
    tags: ['angular'],
    keywords: [title],
    date: today,
    faq: [
        { q: '', a: '' },
        { q: '', a: '' },
        { q: '', a: '' },
        { q: '', a: '' },
    ],
};

index.unshift(newEntry);
writeFileSync(INDEX, JSON.stringify(index, null, '\t'), 'utf8');

console.log(`
✓ Scaffolded: projects/zyra-ui/src/content/${slug}.md
✓ Added to:   projects/zyra-ui/src/content/index.json

Next steps:
  1. Fill in the markdown file
  2. Update description, tags, keywords, readTime, and FAQ in index.json
  3. Run: npm run blog:list  to confirm it appears
`);

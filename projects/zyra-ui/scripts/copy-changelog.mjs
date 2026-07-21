import { copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The repo root CHANGELOG.md is the single source of truth (also what gets
// linked from npm/GitHub) — copy it into public/ so the site's Changelog
// page can serve it as a static asset without duplicating its content.
const source = resolve(__dirname, '../../../CHANGELOG.md');
const dest = resolve(__dirname, '../public/changelog.md');

copyFileSync(source, dest);
console.log('✔ changelog.md copied to projects/zyra-ui/public/');

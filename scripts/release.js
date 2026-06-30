#!/usr/bin/env node
/**
 * Usage: node scripts/release.js
 *    or: npm run release
 *
 * Runs the full release checklist in order. Stops immediately on failure.
 * Steps:
 *   1. Format check
 *   2. Lint
 *   3. Tests
 *   4. Build library
 *   5. Build website (production)
 *   6. Publish zyra-ng-ui to npm
 *   7. Commit + push (triggers Vercel deploy)
 *   8. Create GitHub release with changelog notes
 *   9. Print launch post template
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── Helpers ─────────────────────────────────────────────────────────────────

function run(label, cmd) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`▶  ${label}`);
  console.log(`   ${cmd}`);
  console.log('─'.repeat(60));
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    console.log(`✔  ${label} passed\n`);
  } catch {
    console.error(`\n✖  ${label} FAILED — fix the errors above and re-run.\n`);
    process.exit(1);
  }
}

function readVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'projects/zyra-ng-ui/package.json'), 'utf8'));
  return pkg.version;
}

function extractChangelog(version) {
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const startMarker = `## [${version}]`;
  const start = changelog.indexOf(startMarker);
  if (start === -1) return `Release ${version}`;
  const afterStart = changelog.indexOf('\n', start) + 1;
  const nextSection = changelog.indexOf('\n## [', afterStart);
  const body = changelog.slice(afterStart, nextSection === -1 ? undefined : nextSection).trim();
  return body.replace(/^---\s*$/m, '').trim();
}

// ── Main ────────────────────────────────────────────────────────────────────

const version = readVersion();

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log(`║   zyra-ng-ui  Release Checklist  —  v${version.padEnd(20)}║`);
console.log('╚══════════════════════════════════════════════════════════╝');

// 1. Format
run('Format check', 'npm run format:check');

// 2. Lint
run('Lint', 'npm run lint');

// 3. Tests
run('Tests', 'npm run test -- --watch=false --browsers=ChromeHeadless');

// 4. Build library
run('Build library', 'npm run build:lib');

// 5. Build website
run('Build website (production)', 'ng build zyra-ui --configuration=production-published');

// 6. Publish npm
run('Publish zyra-ng-ui to npm', 'npm publish dist/zyra-ng-ui --access public');

// 7. Commit + push
const changedFiles = execSync('git status --porcelain', { cwd: ROOT }).toString().trim();
if (changedFiles) {
  run('Git commit release changes', `git add -A && git commit -m "chore(release): v${version}"`);
}
run('Git push (triggers Vercel deploy)', 'git push origin main');

// 8. GitHub release
const notes = extractChangelog(version);
const notesFile = path.join(ROOT, '.release-notes.tmp.md');
fs.writeFileSync(notesFile, notes);
try {
  run(
    `Create GitHub release v${version}`,
    `gh release create v${version} --title "v${version}" --notes-file "${notesFile}"`,
  );
} finally {
  fs.unlinkSync(notesFile);
}

// 9. Launch post template
console.log('\n');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║   ✅  All steps complete!  Copy this for your post:     ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');
console.log(buildLaunchPost(version, notes));
console.log('\n');

function buildLaunchPost(ver, changelog) {
  const added = (changelog.match(/^- .+/gm) || []).slice(0, 3).join('\n');
  return `🚀 zyra-ng-ui v${ver} is live on npm!

${added || 'New components and improvements.'}

→ npm i zyra-ng-ui@${ver}
→ Docs: https://zyraui.com
→ Changelog: https://github.com/ramajonnada/zyra-ui/releases/tag/v${ver}

#Angular #OpenSource #UI #ZyraUI`;
}

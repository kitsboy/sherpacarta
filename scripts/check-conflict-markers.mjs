/**
 * Conflict/diff-marker guard for production sources.
 *
 * Born from the 2026-09-08 incident: a literal "+  <section ..." rebase
 * artifact shipped on public/verify.html and sat in production for hours
 * because nothing failed on it. git diff --check only catches markers in
 * staged diffs — this checks the actual tree content regardless of git state.
 *
 * Scanned shapes (at line start):
 *   <<<<<<< / >>>>>>>  conflict start/end markers
 *   =======            conflict divider (exactly 7 equals alone on a line)
 *   "+ "               stray diff-add line
 *   "- "               stray diff-remove line
 *
 * Convention: FAIL [file:line] — same as the CI trust-check steps.
 * Zero dependencies, run standalone: node scripts/check-conflict-markers.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['index.html', 'public'];
const EXCLUDED_DIRS = new Set(['vendor', 'node_modules', '.git']);
const EXTENSIONS = new Set(['.html', '.js']);

const PATTERNS = [
  { re: /^(<{7}|>{7})( |$)/, label: 'conflict marker' },
  { re: /^={7}$/, label: 'conflict divider (======)' },
  { re: /^\+ /, label: 'stray diff-add line (+ )' },
  { re: /^- /, label: 'stray diff-remove line (- )' },
];

function listFiles(target) {
  const abs = path.resolve(target);
  const stat = fs.statSync(abs);
  if (stat.isFile()) return [abs];
  const found = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      found.push(...listFiles(path.join(abs, entry.name)));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      found.push(path.join(abs, entry.name));
    }
  }
  return found;
}

const files = ROOTS.flatMap((root) => (fs.existsSync(root) ? listFiles(root) : []));
const failures = [];

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const { re, label } of PATTERNS) {
      if (re.test(line)) {
        failures.push(`FAIL [${rel}:${i + 1}]: ${label}\n     ${line.trim().slice(0, 100)}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error(
    `Found ${failures.length} stray diff/conflict marker${failures.length === 1 ? '' : 's'} in production sources:\n`,
  );
  for (const f of failures) console.error(f + '\n');
  console.error(
    'Fix: remove the artifact lines above. These usually come from an interrupted rebase/merge — the content is corrupted and must not ship.',
  );
  process.exit(1);
}

console.log(`Conflict/diff-marker checks passed (${files.length} files)`);

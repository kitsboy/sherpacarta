#!/usr/bin/env node
/** Publish @giveabit/sherpacarta and @giveabit/sherpacarta-mcp to npm */
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, cwd) {
  console.log(`\n→ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

try {
  execSync('npm whoami', { stdio: 'pipe' });
} catch {
  console.error('\n❌ Not logged in to npm.');
  console.error('Run: npm login');
  console.error('Or set NPM_TOKEN and run: npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN');
  console.error('\nDry-run available: npm publish --dry-run --access public');
  process.exit(1);
}

for (const pkg of ['sherpacarta', 'sherpacarta-mcp']) {
  const dir = join(root, 'packages', pkg);
  run('npm publish --access public', dir);
}

console.log('\n✅ Both packages published to npm');
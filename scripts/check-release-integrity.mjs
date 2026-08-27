import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const manifest = readJson('public/release-manifest.json');
const releases = readJson('public/data/releases.json');
const hash = readJson('public/api/v1/hash.json');

const failures = [];
if (manifest.product !== 'sherpacarta') failures.push('manifest product must be sherpacarta');
if (manifest.document.version !== releases.current.version) failures.push('manifest/current release version mismatch');
if (manifest.document.articleCount !== releases.current.articleCount) failures.push('manifest/current article count mismatch');
if (manifest.document.hashAlgorithm !== hash.algorithm) failures.push('manifest/hash algorithm mismatch');
if (manifest.proof.pendingIsConfirmed !== false) failures.push('pending proof claim must remain false');
if (!/^\/[a-z0-9/_-]+\.json$/.test(manifest.document.hashEndpoint)) failures.push('hash endpoint must be a local JSON path');

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'));
  process.exit(1);
}
console.log('Release integrity checks passed');

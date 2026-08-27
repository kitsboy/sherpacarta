import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const next = fs.readFileSync('public/js/sc-next100.js', 'utf8');
const core = fs.readFileSync('public/sc-core.js', 'utf8');
const css = fs.readFileSync('public/sc-main.css', 'utf8');
const checks = [
  ['required sign field exists', html.includes('id="sign-name"') && html.includes('required')],
  ['country explicitly optional', html.includes('class="optional">optional')],
  ['character counters exist', html.includes('sign-name-count') && html.includes('sign-country-count')],
  ['review dialog has accessible description', html.includes('aria-describedby="sign-review-description"')],
  ['review has edit path', html.includes('id="sign-review-cancel"') && html.includes('Change details')],
  ['review has close control', html.includes('sign-review-close')],
  ['draft persistence exists', next.includes('SIGN_DRAFT_KEY') && next.includes('localStorage.setItem(SIGN_DRAFT_KEY')],
  ['draft restoration exists', next.includes('restoreSignDraft')],
  ['input validation rejects weak names', next.includes('meaningful') && next.includes('Enter at least two letters or numbers')],
  ['escape cancellation exists', next.includes("event.key === 'Escape'")],
  ['backdrop cancellation exists', next.includes('event.target === review')],
  ['focus trap exists', next.includes('trapReviewFocus')],
  ['duplicate protection remains', core.includes('You have already signed')],
  ['local signature timestamp is stored', core.includes('ts:Date.now()')],
  ['draft is cleared after signing', core.includes("localStorage.removeItem('sc_sign_draft')")],
  ['public publishing remains opt-in', html.includes('Optional Nostr publish')],
  ['disabled state is styled', css.includes('.sign-submit:disabled')],
  ['reduced motion is covered', css.includes('prefers-reduced-motion')],
  ['no server submission in home sign flow', !next.includes('fetch(')],
  ['local export and import controls exist', html.includes('exportLocalSignData') && html.includes('importLocalSignData')],
  ['local clear control exists', html.includes('clearLocalSignData')],
  ['local receipt action exists', core.includes('sign-post-success') && next.includes('downloadLocalSignatureReceipt')],
  ['local sharing remains optional', next.includes('shareLocalSignature') && next.includes('navigator.share')],
  ['undo path exists', next.includes('undoLastLocalSignature')],
  ['storage size feedback exists', next.includes('updateStorageInfo')],
  ['import validates structure', next.includes('Array.isArray(data.signers)')],
  ['post-sign metadata is visible', core.includes('toLocaleString()') && core.includes('Your commitment is saved locally')],
  ['receipt copy and print actions exist', core.includes('Copy receipt') && core.includes('Print certificate') && next.includes('copyLocalSignatureReceipt') && next.includes('printLocalSignatureCertificate')],
  ['undo action is visible after signing', core.includes("undo.textContent='Undo'")],
  ['import preview supports merge and replace', next.includes('Import ${incoming.length}') && next.includes("['Merge', false]") && next.includes("['Replace', true]")],
  ['Nostr publishing is explicitly optional', html.includes('public and optional') && html.includes('nothing is sent automatically')],
  ['receipt output escapes display name', next.includes("replace(/[<&>]/g, '')")],
  ['storage failures announce status', next.includes('Draft could not be saved on this device')],
];
const failures = checks.filter(([, ok]) => !ok);
if (failures.length) { console.error(failures.map(([name]) => `FAIL: ${name}`).join('\n')); process.exit(1); }
console.log(`Sign-flow checks passed (${checks.length})`);

/**
 * Pure reply matcher — no network, no keys.
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const knowledge = JSON.parse(readFileSync(join(root, 'knowledge.json'), 'utf8'));

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function shouldEscalate(text) {
  const t = norm(text);
  return knowledge.limits.escalateKeywords.some((k) => t.includes(norm(k)));
}

export function craftReply(text) {
  const t = norm(text);
  if (!t) {
    return { kind: 'fallback', text: knowledge.fallback, topic: null };
  }
  if (shouldEscalate(text)) {
    return { kind: 'escalate', text: knowledge.escalate, topic: 'escalate' };
  }
  for (const topic of knowledge.topics) {
    if (topic.match.some((m) => t.includes(norm(m)))) {
      return { kind: 'topic', text: topic.reply, topic: topic.id };
    }
  }
  return { kind: 'fallback', text: knowledge.fallback, topic: null };
}

export function getSeedNotes() {
  return knowledge.seedNotes || [];
}

export function getIdentity() {
  return knowledge.identity;
}

export { knowledge };

#!/usr/bin/env node
import { craftReply } from '../lib/reply.mjs';

const samples = [
  'what is SherpaCarta?',
  'how do I sign?',
  'is this a real parliament e-petition?',
  'where do I donate bitcoin?',
  'hello',
  'we want a partnership and investment',
  'random noise xyz',
];

for (const s of samples) {
  const r = craftReply(s);
  console.log('Q:', s);
  console.log('→', r.kind, r.topic || '');
  console.log(r.text.slice(0, 160).replace(/\n/g, ' / '));
  console.log('---');
}

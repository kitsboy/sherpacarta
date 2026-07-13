/**
 * GET /api/canada/pow
 * Issues a one-time proof-of-work challenge for campaign sign bot defense.
 */
import { corsHeaders, json } from './_shared.js';

export async function onRequest(context) {
  const { request, env } = context;
  const methods = 'GET, OPTIONS';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, methods) });
  }
  if (request.method !== 'GET') {
    return json(request, { error: 'Method not allowed' }, 405, methods);
  }

  const challenge = crypto.randomUUID();
  const difficulty = parseInt(env.POW_DIFFICULTY || '4', 10) || 4;

  if (env.PETITION_KV) {
    await env.PETITION_KV.put(`pow:${challenge}`, '1', { expirationTtl: 300 });
  }

  return json(
    request,
    {
      challenge,
      difficulty: Math.min(6, Math.max(3, difficulty)),
      alg: 'sha256-prefix',
      hint: 'Find nonce where SHA-256(challenge:nonce) starts with difficulty zero hex chars',
    },
    200,
    methods
  );
}
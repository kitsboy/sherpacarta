export async function onRequest() {
  return new Response(JSON.stringify({ ok: true, ping: 'batch-v3-locked', t: Date.now() }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

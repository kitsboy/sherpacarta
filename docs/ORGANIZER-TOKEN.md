# Organizer token — paper batch logging

Paper batch logs (`POST /api/canada/batch`) require a shared secret so random visitors cannot inflate campaign totals.

## Cloudflare setup (one-time)

1. Open **Cloudflare Dashboard → Workers & Pages → sherpacarta → Settings → Environment variables**
2. Add **Production** secret: `ORGANIZER_TOKEN` (32+ random hex chars)
3. Optional: add the same secret to **Preview** if you test organizer flows on preview URLs
4. Redeploy is **not** required after adding secrets — they bind immediately to Functions

**Status (2026-07-13):** `ORGANIZER_TOKEN` is set in **Production** on the `sherpacarta` Pages project. The plaintext value is in `.organizer-token.local` on M3 (gitignored). Copy it to your password manager.

## Organizer browser setup

On https://sherpacarta.org/canada/organizer:

1. Expand **Unlock remote logging**
2. Paste the token (or use the built-in unlock field)
3. Click **Save token** — stored in `sessionStorage.sc_organizer_token` for this tab only
4. Log a paper batch — request sends header `X-Organizer-Token: <token>`

Alternative (devtools console):

```js
sessionStorage.setItem('sc_organizer_token', '<ORGANIZER_TOKEN>');
```

## API

```http
POST /api/canada/batch
Content-Type: application/json
X-Organizer-Token: <ORGANIZER_TOKEN>

{"count":12,"province":"BC","event":"Library table","attestation":true}
```

Also accepts `Authorization: Bearer <ORGANIZER_TOKEN>`.

Without a valid token → **503** (`not_configured`) or **401** (`unauthorized`).

## Rotate token

1. Generate: `openssl rand -hex 32`
2. Update CF Pages secret
3. Tell organizers the new value (secure channel)
4. Old token stops working immediately

## Local backup

If the API rejects a batch, the organizer page still saves `{ count, province, event, ts }` in `localStorage.sc_paper_batches` on that device.
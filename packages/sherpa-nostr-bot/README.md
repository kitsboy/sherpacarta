# Sherpa Nostr bot (`sherpa@giveabit.io`)

Public product guide for **SherpaCarta**. Answers FAQ on Nostr mentions. Escalates hard topics.

## Security

| Rule | |
|------|--|
| **nsec never in git** | Use env `SHERPA_NSEC` only |
| **Assert identity** | Bot refuses to start if nsec ≠ sherpa pubkey |
| **Rate limit** | One auto-reply per pubkey per 6h |
| **Escalation** | Legal / press / money secrets → webhook / human |

Cam holds nsec in password manager. Kimi puts it on THOR secrets when deploying.

## Quick start (Cam — seed wall)

```bash
cd packages/sherpa-nostr-bot
npm install
export SHERPA_NSEC='nsec1…'   # paste once in your shell; do not save to repo
npm run seed
```

Check https://sherpacarta.org/nostr after ~1 minute.

Optional subset:

```bash
SHERPA_SEED_IDS=intro,canada npm run seed
```

## Bot (THOR / Kimi)

```bash
cd packages/sherpa-nostr-bot
npm install --omit=dev
export SHERPA_NSEC=…          # from THOR secret store
export SHERPA_APPROVE=1       # week 1: log only
npm run bot
```

Production: `SHERPA_APPROVE=0` (or unset) + systemd/docker + optional `SHERPA_ESCALATE_WEBHOOK`.

## Test replies without keys

```bash
npm run test-reply
```

## Knowledge

Edit `knowledge.json` — topics, escalations, seed notes. No secrets in that file.

# sherpacarta — Last Updated 2026-10-22 by Sherpa (THOR weekly guide refresh)

- **2026-10-22 `54bd520`** (Sherpa, guide refresh) — docs-only push that went live this deploy:
  prepended this log entry + untracked the stale committed `dist/index.html` snapshot that
  carried the retired "zero tracking" copy (it no longer exists on `main`, so `git grep`
  is clean; the Pages build regenerates `dist/` fresh). No JS/CSS change — cache stamps
  unchanged: SW **v9.10**, asset **v=921**.
  Live commit this run: **`54bd520`** (verified via Cloudflare Pages production deploy
  `36aa6e42-d691-4e4d-b8c5-c5389a772dfc`, stage `deploy` status `success`).
  Cache: `v=921` · SW `v9.10`

Two releases landed since the previous log entry:

- **2026-10-20 `ed9be12`** (Ziggy) — retired the absolute "zero tracking" claim repo-wide
  (homepage, press, video script, Nostr-bot knowledge, meta tags, share cards) and redrew
  the share cards. New honest line: page counts go to our own counter
  (`analytics.giveabit.io`), your IP address is **not** saved there. Version bump for the
  JS change: SW **v9.10**, asset **v=921**.
- **2026-10-19 `d3fa0a9` → `56d51ce`** (PRs #1 + #2) — site's own update feed: `/feed.xml`
  (RSS) + `/feed.json` (JSON twin) + small "RSS" chip in the footer. Feed description:
  "Own pages only. Sibling news is not mixed in." Served within the v9.10 / v=921 deploy.

Commit: `ed9be12` (HEAD, live since 2026-10-20/21, verified this run)
Cache: `v=921` · SW `v9.10`

# sherpacarta — Last Updated 2026-09-27 by Sherpa (THOR)
Brief: lint debt cleared 1230 -> 0 (dead-code removal + correct legacy-global config); version
stamp bumped for the JS change (SW v9.9, v=920) so returning visitors clear the stale bundle.
Commit: `e598166` (lint) + version-bump commit (see `git rev-parse --short HEAD`)
Cache: `v=920` · SW `v9.9`

# sherpacarta — Last Updated 2026-09-15 by Kimi (THOR)
Brief: stats strip ships the real numbers instead of 0; build tag advanced for the change.
Commit: `9a8a531`
Cache: `v=918` · SW `v9.7` · BUILD `20260915-735`

# sherpacarta — Last Updated 2026-09-11 by Grok
Brief: Stamp widget stays clickable above the ironic cookie banner (padding + pointer-events).
Commit: `3c2abc9`
Cache: `v=918` · SW `v9.7`

# @giveabit/sherpacarta

JavaScript SDK for the [SherpaCarta](https://sherpacarta.org) Global Digital Magna Carta API.

**Status:** Package scaffolded locally (BUILD 647). Not yet published to npm — run `npm run publish:packages` from repo root after `npm login`.

## Install

```bash
npm install @giveabit/sherpacarta
```

## Usage

```js
import { SherpaCarta, SherpaCartaClient } from '@giveabit/sherpacarta';

// Search articles
const results = await SherpaCarta.search('privacy');

// Get single article
const art = await SherpaCarta.getArticle(11);

// Canonical SHA-256 hash (for Satohash stamping)
const hash = await SherpaCarta.getHash();

// Custom base URL (self-hosted mirror)
const local = new SherpaCartaClient('https://my-mirror.example/api/v1');
```

## API

- `getCharter()` — full article index
- `getArticle(num)` — single article JSON
- `search(query)` — client-side search over charter index
- `getHash()` — canonical hash metadata
- `getCatalog()` — API endpoint catalog

CC0-1.0 · Part of [Give A Bit](https://giveabit.io)
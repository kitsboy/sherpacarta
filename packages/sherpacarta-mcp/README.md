# @giveabit/sherpacarta-mcp

MCP (Model Context Protocol) server for [SherpaCarta](https://sherpacarta.org).

**Status:** Package scaffolded locally (BUILD 647). Not yet published to npm — run `npm run publish:packages` from repo root after `npm login`.

## Run

```bash
npx @giveabit/sherpacarta-mcp
```

Or from this repo:

```bash
node packages/sherpacarta-mcp/server.mjs
```

## Tools

| Tool | Description |
|------|-------------|
| `search_charter` | Search articles by keyword |
| `get_article` | Get article by number |
| `get_charter_hash` | SHA-256 canonical hash |
| `list_articles` | Full article index |

## Claude Desktop config

```json
{
  "mcpServers": {
    "sherpacarta": {
      "command": "npx",
      "args": ["@giveabit/sherpacarta-mcp"]
    }
  }
}
```

Set `SHERPACARTA_API` to override the API base URL.

CC0-1.0 · [Give A Bit](https://giveabit.io)
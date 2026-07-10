#!/usr/bin/env node
/**
 * SherpaCarta MCP Server — stdio transport
 * Implements: search_charter, get_article, get_charter_hash, list_articles
 */
import { createInterface } from 'readline';

const API = process.env.SHERPACARTA_API || 'https://sherpacarta.org/api/v1';

async function api(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

const TOOLS = [
  {
    name: 'search_charter',
    description: 'Search SherpaCarta charter articles by keyword or article number',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search term e.g. privacy, Art. 11' } },
      required: ['query'],
    },
  },
  {
    name: 'get_article',
    description: 'Retrieve a specific charter article by number',
    inputSchema: {
      type: 'object',
      properties: { num: { type: 'string', description: 'Article number e.g. 11' } },
      required: ['num'],
    },
  },
  {
    name: 'get_charter_hash',
    description: 'Get SHA-256 hash of canonical charter text for OpenTimestamp stamping',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_articles',
    description: 'List all charter articles with titles and chapters',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function handleTool(name, args) {
  switch (name) {
    case 'search_charter': {
      const data = await api('/charter.json');
      const q = String(args.query || '').toLowerCase();
      const hits = (data.articles || []).filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          String(a.num).includes(q) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(q))
      );
      return { content: [{ type: 'text', text: JSON.stringify(hits, null, 2) }] };
    }
    case 'get_article': {
      const n = String(args.num).replace(/^Art\.?\s*/i, '').trim();
      if (!/^\d{1,3}$/.test(n)) {
        throw new Error('Article number must be 1–3 digits (e.g. 11)');
      }
      const art = await api(`/articles/${n}.json`);
      return { content: [{ type: 'text', text: JSON.stringify(art, null, 2) }] };
    }
    case 'get_charter_hash': {
      const hash = await api('/hash.json');
      return { content: [{ type: 'text', text: JSON.stringify(hash, null, 2) }] };
    }
    case 'list_articles': {
      const data = await api('/charter.json');
      return { content: [{ type: 'text', text: JSON.stringify(data.articles, null, 2) }] };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

const rl = createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line) => {
  let req;
  try {
    req = JSON.parse(line);
  } catch {
    return;
  }

  const { id, method, params } = req;

  try {
    if (method === 'initialize') {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'sherpacarta-mcp', version: '1.0.0' },
        },
      });
    } else if (method === 'tools/list') {
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    } else if (method === 'tools/call') {
      const result = await handleTool(params.name, params.arguments || {});
      send({ jsonrpc: '2.0', id, result });
    } else if (method === 'notifications/initialized') {
      // no response
    } else {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (e) {
    send({ jsonrpc: '2.0', id, error: { code: -32000, message: e.message } });
  }
});

process.stderr.write('SherpaCarta MCP server ready (stdio)\n');
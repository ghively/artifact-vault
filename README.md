# Artifact Vault v3

A personal artifact library for AI-generated code, dashboards, and tools.

## Quick Start

```bash
npm install
npm run db:generate   # Generate migrations
npm run db:migrate    # Apply migrations
npm run dev           # Start at http://localhost:3000
```

## Architecture

- **Next.js 15** (App Router) + TypeScript
- **SQLite** via Drizzle ORM (zero external services)
- **MCP Server** for Claude Code integration

See [SPEC.md](./SPEC.md) for full design details.

## Running the MCP Server

The MCP server is a separate entry point from the Next.js app. Build it, then
point Claude Code at the compiled output:

```bash
npm run build          # builds the Next.js app AND dist/mcp/index.js
npm run mcp            # runs the MCP server standalone (node dist/mcp/index.js)
```

Add it to your Claude Code MCP config (see [SPEC.md](./SPEC.md#mcp-config-for-claude-code)
for the full example):

```json
{
  "mcpServers": {
    "artifact-vault": {
      "command": "node",
      "args": ["/path/to/artifact-vault/dist/mcp/index.js"]
    }
  }
}
```

The MCP server reads/writes the same SQLite database (`./data/artifacts.db`) as the web app.

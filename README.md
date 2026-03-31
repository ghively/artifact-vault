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

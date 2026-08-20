import { defineConfig } from "tsup";

// Builds the standalone MCP server entry point (src/mcp/index.ts) into
// dist/mcp/index.js, as documented in SPEC.md and referenced by the
// `npm run mcp` script. This is separate from `next build`, which only
// compiles the Next.js app and never touches src/mcp/*.
export default defineConfig({
  entry: ["src/mcp/index.ts"],
  outDir: "dist/mcp",
  format: ["cjs"],
  platform: "node",
  target: "node18",
  clean: true,
  sourcemap: false,
  dts: false,
  // Runtime dependencies are left external (resolved from node_modules at
  // run time) rather than bundled — required for better-sqlite3's native
  // bindings, and avoids ESM/CJS dual-package hazards for the rest.
  external: [
    "better-sqlite3",
    "drizzle-orm",
    "drizzle-orm/*",
    "nanoid",
    "@modelcontextprotocol/sdk",
    "@modelcontextprotocol/sdk/*",
    "zod",
  ],
});

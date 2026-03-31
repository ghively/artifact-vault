#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { mcpTools } from "./tools.js";
import {
  handleSaveArtifact,
  handleGetArtifact,
  handleSearchArtifacts,
  handleListArtifacts,
  handleDeleteArtifact,
} from "./tools.js";

const server = new Server(
  {
    name: "artifact-vault",
    version: "3.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      mcpTools.save_artifact,
      mcpTools.get_artifact,
      mcpTools.search_artifacts,
      mcpTools.list_artifacts,
      mcpTools.delete_artifact,
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: params } = request.params;

  try {
    switch (name) {
      case "save_artifact":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await handleSaveArtifact(params), null, 2),
            },
          ],
        };

      case "get_artifact":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await handleGetArtifact(params), null, 2),
            },
          ],
        };

      case "search_artifacts":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await handleSearchArtifacts(params), null, 2),
            },
          ],
        };

      case "list_artifacts":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await handleListArtifacts(params), null, 2),
            },
          ],
        };

      case "delete_artifact":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await handleDeleteArtifact(params), null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
          }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Artifact Vault MCP server running");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

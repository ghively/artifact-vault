import { z } from "zod";
import { db } from "../db";
import { artifacts, artifactVersions } from "../db/schema";
import { eq, like, desc, sql, and, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { slugify, autoTag } from "../lib";
import { artifactTypes } from "../db/schema";

export const mcpTools = {
  save_artifact: {
    name: "save_artifact",
    description: "Save a new artifact or update an existing one by name",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the artifact",
        },
        content: {
          type: "string",
          description: "The content/code of the artifact",
        },
        type: {
          type: "string",
          description: `The type of artifact. Must be one of: ${artifactTypes.join(", ")}`,
          enum: artifactTypes,
        },
        description: {
          type: "string",
          description: "Optional description of the artifact",
        },
        project: {
          type: "string",
          description: "Optional project name for grouping",
        },
        tags: {
          type: "string",
          description: "Optional comma-separated tags (auto-generated if not provided)",
        },
      },
      required: ["name", "content", "type"],
    },
  },

  get_artifact: {
    name: "get_artifact",
    description: "Retrieve an artifact by name or ID",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name or ID of the artifact to retrieve",
        },
      },
      required: ["name"],
    },
  },

  search_artifacts: {
    name: "search_artifacts",
    description: "Search artifacts by query, type, tag, or project",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to match against name, description, or content",
        },
        type: {
          type: "string",
          description: `Filter by artifact type. Must be one of: ${artifactTypes.join(", ")}`,
          enum: artifactTypes,
        },
        tag: {
          type: "string",
          description: "Filter by tag",
        },
        project: {
          type: "string",
          description: "Filter by project name",
        },
      },
    },
  },

  list_artifacts: {
    name: "list_artifacts",
    description: "List all artifacts with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: `Filter by artifact type. Must be one of: ${artifactTypes.join(", ")}`,
          enum: artifactTypes,
        },
        project: {
          type: "string",
          description: "Filter by project name",
        },
        limit: {
          type: "number",
          description: "Maximum number of artifacts to return (default: 50)",
        },
      },
    },
  },

  delete_artifact: {
    name: "delete_artifact",
    description: "Delete an artifact by name or ID",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name or ID of the artifact to delete",
        },
      },
      required: ["name"],
    },
  },
};

export async function handleSaveArtifact(params: any) {
  const { name, content, type, description, project, tags } = params;

  if (!name || !content || !type) {
    throw new Error("name, content, and type are required");
  }

  if (!artifactTypes.includes(type)) {
    throw new Error(`Invalid type. Must be one of: ${artifactTypes.join(", ")}`);
  }

  // Check if artifact with same name+project exists
  const conditions = [
    eq(artifacts.name, name),
    project ? eq(artifacts.project, project) : sql`(${artifacts.project} IS NULL OR ${artifacts.project} = '')`
  ];

  const [existing] = await db
    .select()
    .from(artifacts)
    .where(and(...conditions))
    .limit(1);

  const now = new Date().toISOString();
  const parsedTags = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : autoTag(content, type);

  if (existing) {
    // Update existing artifact
    const contentChanged = content !== existing.content;
    const newVersion = contentChanged ? existing.version + 1 : existing.version;

    const updates: any = {
      updatedAt: now,
    };

    if (description !== undefined) updates.description = description;
    if (content !== undefined) updates.content = content;
    if (type !== undefined) updates.type = type;
    if (tags !== undefined) updates.tags = JSON.stringify(parsedTags);
    if (contentChanged) updates.version = newVersion;

    await db
      .update(artifacts)
      .set(updates)
      .where(eq(artifacts.id, existing.id));

    if (contentChanged && content) {
      await db.insert(artifactVersions).values({
        id: nanoid(),
        artifactId: existing.id,
        version: newVersion,
        content,
        createdAt: now,
      });
    }

    const [updated] = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, existing.id))
      .limit(1);

    return {
      success: true,
      action: "updated",
      artifact: {
        ...updated,
        tags: JSON.parse(updated.tags),
      },
    };
  } else {
    // Create new artifact
    const id = nanoid();
    const slug = slugify(name);

    const newArtifact = {
      id,
      name,
      slug,
      description: description || null,
      content,
      type,
      tags: JSON.stringify(parsedTags),
      project: project || null,
      version: 1,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(artifacts).values(newArtifact);

    await db.insert(artifactVersions).values({
      id: nanoid(),
      artifactId: id,
      version: 1,
      content,
      createdAt: now,
    });

    return {
      success: true,
      action: "created",
      artifact: {
        ...newArtifact,
        tags: parsedTags,
      },
    };
  }
}

export async function handleGetArtifact(params: any) {
  const { name } = params;

  if (!name) {
    throw new Error("name is required");
  }

  const [artifact] = await db
    .select()
    .from(artifacts)
    .where(or(eq(artifacts.id, name), eq(artifacts.name, name)))
    .limit(1);

  if (!artifact) {
    throw new Error(`Artifact not found: ${name}`);
  }

  return {
    ...artifact,
    tags: JSON.parse(artifact.tags),
  };
}

export async function handleSearchArtifacts(params: any) {
  const { query, type, tag, project } = params;

  const conditions = [];

  if (query) {
    conditions.push(
      sql`(${like(artifacts.name, `%${query}%`)} OR ${like(
        artifacts.description,
        `%${query}%`
      )} OR ${like(artifacts.content, `%${query}%`)})`
    );
  }

  if (type && artifactTypes.includes(type)) {
    conditions.push(eq(artifacts.type, type));
  }

  if (tag) {
    conditions.push(sql`${artifacts.tags} LIKE '%' || ${tag} || '%'`);
  }

  if (project) {
    conditions.push(eq(artifacts.project, project));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const items = await db
    .select()
    .from(artifacts)
    .where(whereClause)
    .orderBy(desc(artifacts.updatedAt))
    .limit(50);

  return {
    items: items.map((item) => ({
      ...item,
      tags: JSON.parse(item.tags),
    })),
    count: items.length,
  };
}

export async function handleListArtifacts(params: any) {
  const { type, project, limit = 50 } = params;

  const conditions = [];

  if (type && artifactTypes.includes(type)) {
    conditions.push(eq(artifacts.type, type));
  }

  if (project) {
    conditions.push(eq(artifacts.project, project));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const items = await db
    .select()
    .from(artifacts)
    .where(whereClause)
    .orderBy(desc(artifacts.updatedAt))
    .limit(limit);

  return {
    items: items.map((item) => ({
      ...item,
      tags: JSON.parse(item.tags),
    })),
    count: items.length,
  };
}

export async function handleDeleteArtifact(params: any) {
  const { name } = params;

  if (!name) {
    throw new Error("name is required");
  }

  const [existing] = await db
    .select()
    .from(artifacts)
    .where(or(eq(artifacts.id, name), eq(artifacts.name, name)))
    .limit(1);

  if (!existing) {
    throw new Error(`Artifact not found: ${name}`);
  }

  await db.delete(artifacts).where(eq(artifacts.id, existing.id));

  return {
    success: true,
    deleted: existing.name,
  };
}

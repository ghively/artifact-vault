import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { artifacts, artifactVersions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";
import { autoTag } from "@/lib/auto-tag";
import { artifactTypes } from "@/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [artifact] = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id))
      .limit(1);

    if (!artifact) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...artifact,
      tags: JSON.parse(artifact.tags),
    });
  } catch (error) {
    console.error("Error fetching artifact:", error);
    return NextResponse.json(
      { error: "Failed to fetch artifact" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      content,
      type,
      project,
      tags: userTags,
    } = body;

    const [existing] = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    if (type && !artifactTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${artifactTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const contentChanged = content && content !== existing.content;
    const newVersion = contentChanged ? existing.version + 1 : existing.version;

    const updates: any = {
      updatedAt: now,
    };

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (content !== undefined) updates.content = content;
    if (type !== undefined) updates.type = type;
    if (project !== undefined) updates.project = project;
    if (userTags !== undefined) {
      updates.tags = JSON.stringify(userTags);
    }
    if (contentChanged) {
      updates.version = newVersion;
    }
    if (name) updates.slug = slugify(name);

    await db
      .update(artifacts)
      .set(updates)
      .where(eq(artifacts.id, id));

    if (contentChanged && content) {
      await db.insert(artifactVersions).values({
        id: nanoid(),
        artifactId: id,
        version: newVersion,
        content,
        createdAt: now,
      });
    }

    const [updated] = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id))
      .limit(1);

    return NextResponse.json({
      ...updated,
      tags: JSON.parse(updated.tags),
    });
  } catch (error) {
    console.error("Error updating artifact:", error);
    return NextResponse.json(
      { error: "Failed to update artifact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [existing] = await db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Artifact not found" },
        { status: 404 }
      );
    }

    await db.delete(artifacts).where(eq(artifacts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting artifact:", error);
    return NextResponse.json(
      { error: "Failed to delete artifact" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { artifacts, artifactVersions } from "@/db/schema";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";
import { autoTag } from "@/lib/auto-tag";
import { eq, like, desc, sql, and } from "drizzle-orm";
import { artifactTypes } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const tag = searchParams.get("tag");
    const project = searchParams.get("project");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (search) {
      conditions.push(
        sql`(${like(artifacts.name, `%${search}%`)} OR ${like(
          artifacts.description,
          `%${search}%`
        )} OR ${like(artifacts.content, `%${search}%`)})`
      );
    }

    if (type && artifactTypes.includes(type as any)) {
      conditions.push(eq(artifacts.type, type));
    }

    if (tag) {
      conditions.push(sql`${artifacts.tags} LIKE '%' || ${tag} || '%'`);
    }

    if (project) {
      conditions.push(eq(artifacts.project, project));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, totalResult] = await Promise.all([
      db
        .select()
        .from(artifacts)
        .where(whereClause)
        .orderBy(desc(artifacts.updatedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(artifacts)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching artifacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch artifacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      content,
      type,
      project,
      tags: userTags,
    } = body;

    if (!name || !content || !type) {
      return NextResponse.json(
        { error: "Name, content, and type are required" },
        { status: 400 }
      );
    }

    if (!artifactTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${artifactTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const id = nanoid();
    const slug = slugify(name);
    const now = new Date().toISOString();
    const tags = userTags || autoTag(content, type);

    const newArtifact = {
      id,
      name,
      slug,
      description: description || null,
      content,
      type,
      tags: JSON.stringify(tags),
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

    return NextResponse.json(
      { ...newArtifact, tags },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating artifact:", error);
    return NextResponse.json(
      { error: "Failed to create artifact" },
      { status: 500 }
    );
  }
}

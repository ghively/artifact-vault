import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const artifacts = sqliteTable("artifacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  content: text("content").notNull(),
  type: text("type").notNull(),
  tags: text("tags").notNull(), // JSON array string
  project: text("project"),
  version: integer("version").notNull().default(1),
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const artifactVersions = sqliteTable("artifact_versions", {
  id: text("id").primaryKey(),
  artifactId: text("artifact_id")
    .notNull()
    .references(() => artifacts.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
});

export const artifactsRelations = relations(artifacts, ({ many }) => ({
  versions: many(artifactVersions),
}));

export const artifactVersionsRelations = relations(artifactVersions, ({ one }) => ({
  artifact: one(artifacts, {
    fields: [artifactVersions.artifactId],
    references: [artifacts.id],
  }),
}));

export type Artifact = typeof artifacts.$inferSelect;
export type NewArtifact = typeof artifacts.$inferInsert;
export type ArtifactVersion = typeof artifactVersions.$inferSelect;
export type NewArtifactVersion = typeof artifactVersions.$inferInsert;

export const artifactTypes = [
  "html",
  "react",
  "svg",
  "mermaid",
  "code",
  "markdown",
  "json",
  "css",
  "text",
  "python",
  "typescript",
  "javascript",
  "shell",
] as const;

export type ArtifactType = (typeof artifactTypes)[number];

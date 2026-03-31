import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "artifacts.db");

const sqlite = new Database(dbPath);

const db = drizzle(sqlite);

console.log("Running database migrations...");

const migrationsFolder = path.join(process.cwd(), "src/db/migrations");

// Check if migrations folder exists
if (!fs.existsSync(migrationsFolder)) {
  console.log("Migrations folder not found. Creating initial schema...");
  // Create tables directly
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS artifacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      type TEXT NOT NULL,
      tags TEXT NOT NULL,
      project TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS artifact_versions (
      id TEXT PRIMARY KEY,
      artifact_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_artifacts_slug ON artifacts(slug);
    CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(type);
    CREATE INDEX IF NOT EXISTS idx_artifacts_project ON artifacts(project);
    CREATE INDEX IF NOT EXISTS idx_artifacts_updated_at ON artifacts(updated_at);
    CREATE INDEX IF NOT EXISTS idx_artifact_versions_artifact_id ON artifact_versions(artifact_id);
  `);
  console.log("Database schema created successfully!");
} else {
  console.log("Migrations folder found. Running migrations...");
  await migrate(db, { migrationsFolder });
  console.log("Migrations completed successfully!");
}

sqlite.close();
console.log("Database initialized at:", dbPath);

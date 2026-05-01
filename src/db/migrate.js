import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPool } from "./pool.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const migrationsDir = path.join(rootDir, "db", "migrations");

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function appliedMigrationIds(client) {
  const result = await client.query("SELECT id FROM schema_migrations ORDER BY id");
  return new Set(result.rows.map(row => row.id));
}

async function migrationFiles() {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith(".sql"))
    .map(entry => entry.name)
    .sort();
}

async function runMigration(client, fileName) {
  const sql = await fs.readFile(path.join(migrationsDir, fileName), "utf8");
  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [fileName]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function migrate() {
  const pool = createPool();
  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await appliedMigrationIds(client);
    const files = await migrationFiles();
    const pending = files.filter(fileName => !applied.has(fileName));

    for (const fileName of pending) {
      console.log(`Applying ${fileName}`);
      await runMigration(client, fileName);
    }

    console.log(pending.length ? `Applied ${pending.length} migration(s).` : "Database is already up to date.");
  } finally {
    client.release();
    await pool.end();
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  migrate().catch(error => {
    console.error(error.message || error);
    process.exit(1);
  });
}

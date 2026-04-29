import fs from "node:fs/promises";
import path from "node:path";

let poolPromise;
let poolAttached = false;

function postgresEnabled() {
  return Boolean(globalThis.process?.env?.DATABASE_URL);
}

function postgresSsl() {
  const url = globalThis.process?.env?.DATABASE_URL || "";
  if (globalThis.process?.env?.PGSSLMODE === "disable") return false;
  if (url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return { rejectUnauthorized: false };
}

async function getPool() {
  if (!postgresEnabled()) return null;
  if (!poolPromise) {
    poolPromise = (async () => {
      const { Pool } = await import("pg");
      const pool = new Pool({
        connectionString: globalThis.process.env.DATABASE_URL,
        ssl: postgresSsl(),
        max: Number(globalThis.process.env.PG_POOL_MAX || 3),
        idleTimeoutMillis: 20_000,
        connectionTimeoutMillis: 10_000
      });

      if (!poolAttached) {
        try {
          const { attachDatabasePool } = await import("@vercel/functions");
          attachDatabasePool(pool);
        } catch {
          // Optional Vercel helper. Local Postgres and other hosts work without it.
        }
        poolAttached = true;
      }
      return pool;
    })();
  }
  return poolPromise;
}

async function ensurePostgres(seedDatabase, normalizeDatabase) {
  const pool = await getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nexcrm_state (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  const seed = normalizeDatabase(seedDatabase());
  await pool.query(
    `INSERT INTO nexcrm_state (id, data) VALUES ('main', $1::jsonb) ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(seed)]
  );
}

async function readPostgres(seedDatabase, normalizeDatabase) {
  await ensurePostgres(seedDatabase, normalizeDatabase);
  const pool = await getPool();
  const result = await pool.query("SELECT data FROM nexcrm_state WHERE id = 'main'");
  const data = result.rows[0]?.data || seedDatabase();
  return normalizeDatabase(data);
}

async function writePostgres(db, normalizeDatabase) {
  const pool = await getPool();
  const next = normalizeDatabase(db);
  await pool.query(
    `UPDATE nexcrm_state SET data = $1::jsonb, updated_at = now() WHERE id = 'main'`,
    [JSON.stringify(next)]
  );
}

export function createStore({ dbPath, seedDatabase, normalizeDatabase }) {
  async function ensureFileDatabase() {
    try {
      await fs.access(dbPath);
    } catch {
      await fs.mkdir(path.dirname(dbPath), { recursive: true });
      await writeFileDatabase(seedDatabase());
    }
  }

  async function readFileDatabase() {
    await ensureFileDatabase();
    const raw = await fs.readFile(dbPath, "utf8");
    return normalizeDatabase(JSON.parse(raw));
  }

  async function writeFileDatabase(db) {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, `${JSON.stringify(normalizeDatabase(db), null, 2)}\n`, "utf8");
  }

  return {
    usingPostgres: postgresEnabled,
    async ensureDatabase() {
      if (postgresEnabled()) {
        await ensurePostgres(seedDatabase, normalizeDatabase);
        return;
      }
      await ensureFileDatabase();
    },
    async readDatabase() {
      if (postgresEnabled()) return readPostgres(seedDatabase, normalizeDatabase);
      return readFileDatabase();
    },
    async writeDatabase(db) {
      if (postgresEnabled()) {
        await writePostgres(db, normalizeDatabase);
        return;
      }
      await writeFileDatabase(db);
    }
  };
}

import { Pool } from "pg";

export function databaseUrl() {
  return globalThis.process?.env?.DATABASE_URL || "";
}

export function postgresSsl() {
  const url = databaseUrl();
  if (globalThis.process?.env?.PGSSLMODE === "disable") return false;
  if (url.includes("localhost") || url.includes("127.0.0.1")) return false;
  return { rejectUnauthorized: false };
}

export function createPool() {
  const connectionString = databaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }

  return new Pool({
    connectionString,
    ssl: postgresSsl(),
    max: Number(globalThis.process?.env?.PG_POOL_MAX || 3),
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000
  });
}

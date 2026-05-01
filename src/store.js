import fs from "node:fs/promises";
import path from "node:path";
import { createPool, databaseUrl } from "./db/pool.js";

let poolPromise;

function postgresEnabled() {
  return Boolean(databaseUrl());
}

async function getPool() {
  if (!postgresEnabled()) return null;
  poolPromise ||= Promise.resolve(createPool());
  return poolPromise;
}

function toIso(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function toDateOnly(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function optionalText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function sourceIdFromName(name) {
  const normalized = String(name || "Manual")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `src_${normalized || "manual"}`;
}

function mapRole(row, menusByRole) {
  return {
    id: row.id,
    name: row.name,
    customerScope: row.customer_scope,
    alertScope: row.alert_scope,
    menus: menusByRole.get(row.id) || [],
    locked: row.locked
  };
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role_id,
    email: row.email || "",
    active: row.active,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    deletedAt: toIso(row.deleted_at)
  };
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color
  };
}

function mapCustomer(row) {
  return {
    id: row.id,
    company: row.company,
    contact: row.contact,
    phone: row.phone || "",
    email: row.email || "",
    line: row.line_handle || "",
    lineUserId: row.line_user_id || "",
    categoryId: row.category_id || "cat_general",
    note: row.note || "",
    status: row.status || "ใหม่",
    ownerId: row.owner_id || "",
    source: row.source_name || "Manual",
    followUpDate: toDateOnly(row.follow_up_date),
    callCount: Number(row.call_count || 0),
    hasPurchase: Boolean(row.has_purchase),
    purchasedAt: toIso(row.purchased_at),
    closedLostAt: toIso(row.closed_lost_at),
    closeLostReason: row.close_lost_reason || "",
    lostToCompetitor: row.lost_to_competitor || "",
    lastContactAt: toIso(row.last_contact_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    deletedAt: toIso(row.deleted_at)
  };
}

function mapActivity(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    type: row.activity_type,
    activityType: row.activity_type,
    title: row.title,
    reason: row.reason || "",
    note: row.note || "",
    count: Number(row.count || 1),
    createdBy: row.created_by || "",
    createdAt: toIso(row.created_at)
  };
}

function mapAlert(row) {
  return {
    id: row.id,
    customerId: row.customer_id || "",
    userId: row.user_id || "",
    type: row.type,
    title: row.title,
    message: row.message || "",
    severity: row.severity || "info",
    resolved: Boolean(row.resolved),
    resolvedAt: toIso(row.resolved_at),
    createdAt: toIso(row.created_at)
  };
}

async function tableExists(pool, tableName) {
  const result = await pool.query("SELECT to_regclass($1) AS table_name", [`public.${tableName}`]);
  return Boolean(result.rows[0]?.table_name);
}

async function readRelationalDatabase(pool) {
  const [
    roleRows,
    menuRows,
    userRows,
    categoryRows,
    sourceRows,
    settingRows,
    customerRows,
    activityRows,
    alertRows
  ] = await Promise.all([
    pool.query("SELECT * FROM roles ORDER BY id"),
    pool.query("SELECT * FROM role_menus ORDER BY role_id, menu_key"),
    pool.query("SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at, id"),
    pool.query("SELECT * FROM customer_categories ORDER BY sort_order, name"),
    pool.query("SELECT * FROM sources ORDER BY locked DESC, name"),
    pool.query("SELECT * FROM settings WHERE key = 'system'"),
    pool.query(`
      SELECT customers.*, sources.name AS source_name
      FROM customers
      LEFT JOIN sources ON sources.id = customers.source_id
      WHERE customers.deleted_at IS NULL
      ORDER BY customers.created_at DESC, customers.id DESC
    `),
    pool.query("SELECT * FROM activities ORDER BY created_at DESC, id DESC"),
    pool.query("SELECT * FROM alerts ORDER BY created_at DESC, id DESC")
  ]);

  const menusByRole = new Map();
  for (const menu of menuRows.rows) {
    const menus = menusByRole.get(menu.role_id) || [];
    menus.push(menu.menu_key);
    menusByRole.set(menu.role_id, menus);
  }

  return {
    users: userRows.rows.map(mapUser),
    customerCategories: categoryRows.rows.map(mapCategory),
    sources: sourceRows.rows.map(row => row.name),
    roles: roleRows.rows.map(row => mapRole(row, menusByRole)),
    customers: customerRows.rows.map(mapCustomer),
    activities: activityRows.rows.map(mapActivity),
    alerts: alertRows.rows.map(mapAlert),
    settings: settingRows.rows[0]?.value || {}
  };
}

async function writeRelationalDatabase(pool, db, normalizeDatabase) {
  const next = normalizeDatabase(db);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM alerts");
    await client.query("DELETE FROM activities");
    await client.query("DELETE FROM customers");
    await client.query("DELETE FROM users");
    await client.query("DELETE FROM role_menus");
    await client.query("DELETE FROM roles");
    await client.query("DELETE FROM customer_categories");
    await client.query("DELETE FROM sources");
    await client.query("DELETE FROM settings");

    for (const role of next.roles) {
      await client.query(
        `INSERT INTO roles (id, name, customer_scope, alert_scope, locked)
         VALUES ($1, $2, $3, $4, $5)`,
        [role.id, role.name, role.customerScope || "own", role.alertScope || "own", Boolean(role.locked)]
      );
      for (const menu of role.menus || []) {
        await client.query(
          "INSERT INTO role_menus (role_id, menu_key) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [role.id, menu]
        );
      }
    }

    for (const category of next.customerCategories) {
      await client.query(
        `INSERT INTO customer_categories (id, name, color, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [category.id, category.name, category.color || "#277c75", next.customerCategories.indexOf(category) + 1]
      );
    }

    for (const source of next.sources) {
      await client.query(
        `INSERT INTO sources (id, name, locked)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [sourceIdFromName(source), source, ["Manual", "LineOA", "API"].includes(source)]
      );
    }

    const roleIds = new Set(next.roles.map(role => role.id));
    for (const user of next.users) {
      await client.query(
        `INSERT INTO users (id, name, username, password_hash, role_id, email, active, created_at, updated_at, deleted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8::timestamptz, now()), $9::timestamptz, $10::timestamptz)`,
        [
          user.id,
          user.name,
          user.username,
          user.passwordHash,
          roleIds.has(user.role) ? user.role : "Sale",
          user.email || "",
          user.active !== false,
          user.createdAt || null,
          user.updatedAt || null,
          user.deletedAt || null
        ]
      );
    }

    const userIds = new Set(next.users.map(user => user.id));
    const categoryIds = new Set(next.customerCategories.map(category => category.id));
    const sourceIdsByName = new Map(next.sources.map(source => [source, sourceIdFromName(source)]));

    for (const customer of next.customers) {
      await client.query(
        `INSERT INTO customers (
          id, company, contact, phone, email, line_handle, line_user_id, category_id, owner_id, source_id,
          status, note, follow_up_date, call_count, has_purchase, purchased_at, closed_lost_at,
          close_lost_reason, lost_to_competitor, last_contact_at, created_at, updated_at, deleted_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13::date, $14, $15, $16::timestamptz, $17::timestamptz,
          $18, $19, $20::timestamptz, COALESCE($21::timestamptz, now()), $22::timestamptz, $23::timestamptz
        )`,
        [
          customer.id,
          customer.company,
          customer.contact,
          customer.phone || "",
          customer.email || "",
          customer.line || "",
          optionalText(customer.lineUserId),
          categoryIds.has(customer.categoryId) ? customer.categoryId : null,
          userIds.has(customer.ownerId) ? customer.ownerId : null,
          sourceIdsByName.get(customer.source) || sourceIdFromName("Manual"),
          customer.status || "ใหม่",
          customer.note || "",
          customer.followUpDate || null,
          Number(customer.callCount || 0),
          Boolean(customer.hasPurchase),
          customer.purchasedAt || null,
          customer.closedLostAt || null,
          customer.closeLostReason || "",
          customer.lostToCompetitor || "",
          customer.lastContactAt || null,
          customer.createdAt || null,
          customer.updatedAt || null,
          customer.deletedAt || null
        ]
      );
    }

    const customerIds = new Set(next.customers.map(customer => customer.id));
    for (const activity of next.activities) {
      if (!customerIds.has(activity.customerId)) continue;
      await client.query(
        `INSERT INTO activities (id, customer_id, activity_type, title, reason, note, count, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::timestamptz, now()))`,
        [
          activity.id,
          activity.customerId,
          activity.activityType || activity.type || "call",
          activity.title || activity.reason || "บันทึกกิจกรรม",
          activity.reason || "",
          activity.note || "",
          Number(activity.count || 1),
          userIds.has(activity.createdBy) ? activity.createdBy : null,
          activity.createdAt || null
        ]
      );
    }

    for (const alert of next.alerts) {
      await client.query(
        `INSERT INTO alerts (id, customer_id, user_id, type, title, message, severity, resolved, resolved_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::timestamptz, COALESCE($10::timestamptz, now()))`,
        [
          alert.id,
          customerIds.has(alert.customerId) ? alert.customerId : null,
          userIds.has(alert.userId) ? alert.userId : null,
          alert.type || "follow_up",
          alert.title,
          alert.message || "",
          alert.severity || "info",
          Boolean(alert.resolved),
          alert.resolvedAt || null,
          alert.createdAt || null
        ]
      );
    }

    await client.query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ('system', $1::jsonb, now())`,
      [JSON.stringify(next.settings || {})]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function importLegacyStateIfNeeded(pool, normalizeDatabase) {
  const hasLegacyState = await tableExists(pool, "nexcrm_state");
  if (!hasLegacyState) return;

  const customerCount = await pool.query("SELECT COUNT(*)::int AS count FROM customers");
  if (Number(customerCount.rows[0]?.count || 0) > 0) return;

  const legacy = await pool.query("SELECT data FROM nexcrm_state WHERE id = 'main'");
  if (!legacy.rows[0]?.data) return;

  await writeRelationalDatabase(pool, legacy.rows[0].data, normalizeDatabase);
}

async function ensurePostgres(seedDatabase, normalizeDatabase) {
  const pool = await getPool();
  const ready = await tableExists(pool, "schema_migrations");
  if (!ready) {
    throw new Error("Database schema is missing. Run npm run db:migrate before starting NexCRM.");
  }

  const userCount = await pool.query("SELECT COUNT(*)::int AS count FROM users");
  if (Number(userCount.rows[0]?.count || 0) === 0) {
    await writeRelationalDatabase(pool, seedDatabase(), normalizeDatabase);
    return;
  }

  await importLegacyStateIfNeeded(pool, normalizeDatabase);
}

async function readPostgres(seedDatabase, normalizeDatabase) {
  await ensurePostgres(seedDatabase, normalizeDatabase);
  const pool = await getPool();
  return normalizeDatabase(await readRelationalDatabase(pool));
}

async function writePostgres(db, normalizeDatabase) {
  const pool = await getPool();
  await writeRelationalDatabase(pool, db, normalizeDatabase);
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

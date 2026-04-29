import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { ACTIVITY_TYPES, DEFAULT_CATEGORIES, DEFAULT_ROLES, DEFAULT_SOURCES, MENU_KEYS, contentTypes } from "./src/config.js";
import { parseBody, sendJson, sendText } from "./src/http.js";
import { canAccessMenu, canSeeAllCustomers, findVisibleCustomer, publicSettings, requireSettingsAccess, roleDefinition, roleMenus, visibleActivities, visibleAlerts, visibleCustomers } from "./src/rbac.js";
import { hashPassword, id, issueSessionToken, readSessionToken } from "./src/security.js";
import { createStore } from "./src/store.js";
import { nowIso } from "./src/time.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(globalThis.process?.env?.PORT || 3000);
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = globalThis.process?.env?.VERCEL ? path.join(os.tmpdir(), "nexcrm") : path.join(ROOT, "data");
const DB_PATH = globalThis.process?.env?.NEXCRM_DB_PATH || path.join(DATA_DIR, "db.json");
const sessions = new Map();

function seedDatabase() {
  const createdAt = nowIso();
  return {
    users: [
      {
        id: "usr_superadmin",
        name: "Super Admin",
        username: "Superadmin",
        passwordHash: "1bf2f85487b184cfc956366204e4f45a49f1effa18c9bb67d32abc66784fb7dd",
        role: "Superadmin",
        email: "admin@nexcrm.local",
        active: true,
        createdAt
      },
      {
        id: "usr_sale01",
        name: "Kanda Sale",
        username: "kanda",
        passwordHash: hashPassword("Sale1234!"),
        role: "Sale",
        email: "kanda@nexcrm.local",
        active: true,
        createdAt
      }
    ],
    customerCategories: DEFAULT_CATEGORIES,
    sources: DEFAULT_SOURCES,
    roles: DEFAULT_ROLES,
    customers: [
      {
        id: "cus_orchid",
        company: "Orchid Digital Co., Ltd.",
        contact: "คุณมีนา",
        phone: "0812345678",
        email: "meena@orchiddigital.co.th",
        line: "@orchid.meena",
        lineUserId: "U-orchid-001",
        note: "ติดตามโปรเจค CRM phase 2",
        status: "กำลังติดตาม",
        ownerId: "usr_sale01",
        source: "Manual",
        followUpDate: "2026-04-30",
        callCount: 2,
        lastContactAt: "2026-04-28T04:12:00.000Z",
        createdAt
      },
      {
        id: "cus_northstar",
        company: "Northstar Supply",
        contact: "คุณภาคิน",
        phone: "0897654321",
        email: "pakin@northstar.example",
        line: "@northstar.pk",
        lineUserId: "U-northstar-014",
        note: "รอใบเสนอราคาและ demo",
        status: "รอเอกสาร",
        ownerId: "usr_superadmin",
        source: "LineOA",
        followUpDate: "2026-04-29",
        callCount: 1,
        lastContactAt: "2026-04-27T09:35:00.000Z",
        createdAt
      },
      {
        id: "cus_river",
        company: "Riverstone Hotel Group",
        contact: "คุณอร",
        phone: "0861112233",
        email: "orn@riverstone.example",
        line: "@river.orn",
        lineUserId: "U-river-302",
        note: "สนใจระบบแจ้งเตือน Sale",
        status: "นัดติดตาม",
        ownerId: "usr_sale01",
        source: "API",
        followUpDate: "2026-05-02",
        callCount: 0,
        lastContactAt: "",
        createdAt
      }
    ],
    activities: [
      {
        id: "act_seed_1",
        customerId: "cus_orchid",
        type: "call",
        title: "โทรติดตาม",
        reason: "ถามความคืบหน้าโปรเจค",
        note: "ลูกค้าขอปรับ scope และให้ส่งราคาใหม่",
        count: 2,
        createdBy: "usr_sale01",
        createdAt: "2026-04-28T04:12:00.000Z"
      },
      {
        id: "act_seed_2",
        customerId: "cus_northstar",
        type: "line",
        title: "นำเข้าจาก LineOA",
        reason: "ลูกค้าทักเข้ามาขอข้อมูล",
        note: "สนใจ demo ภายในสัปดาห์นี้",
        count: 1,
        createdBy: "usr_superadmin",
        createdAt: "2026-04-27T09:35:00.000Z"
      }
    ],
    alerts: [
      {
        id: "alr_today",
        customerId: "cus_northstar",
        type: "follow_up",
        title: "ถึงเวลาติดตาม Northstar Supply",
        message: "นัดติดตามวันนี้",
        severity: "warning",
        resolved: false,
        createdAt: "2026-04-29T02:00:00.000Z"
      }
    ],
    settings: {
      companyName: "NexCrm Local",
      companyPhone: "020000000",
      companyEmail: "hello@nexcrm.local",
      lineMode: "lineapp",
      lineOaId: "@nexcrm",
      lineChannelId: "",
      lineChannelSecret: "",
      emailProvider: "gmail",
      apiToken: "nexcrm-local-api-token",
      webhookUrl: "/api/webhook/line",
      notifyBeforeDays: 1,
      notifyDailyDigest: true,
      newCustomerDays: 30,
      oldCustomerDays: 90,
      closedLostCallLimit: 6,
      closedLostDayLimit: 45,
      defaultOwnerId: "usr_superadmin",
      updatedAt: createdAt
    }
  };
}

function normalizeDatabase(db) {
  db.users ||= [];
  db.customers ||= [];
  db.activities ||= [];
  db.alerts ||= [];
  db.users = db.users.map(user => ({
    role: "Sale",
    active: true,
    ...user
  }));
  db.customerCategories = Array.isArray(db.customerCategories) && db.customerCategories.length
    ? db.customerCategories
    : DEFAULT_CATEGORIES;
  const customerSources = db.customers.map(customer => customer.source).filter(Boolean);
  db.sources = [...new Set([...(Array.isArray(db.sources) ? db.sources : DEFAULT_SOURCES), ...customerSources])];
  const savedRoles = Array.isArray(db.roles) ? db.roles : [];
  db.roles = DEFAULT_ROLES.map(defaultRole => {
    const saved = savedRoles.find(role => role.id === defaultRole.id || role.name === defaultRole.name) || {};
    if (defaultRole.locked) return { ...defaultRole };
    return {
      ...defaultRole,
      ...saved,
      menus: Array.isArray(saved.menus) ? saved.menus.filter(menu => MENU_KEYS.includes(menu)) : defaultRole.menus,
      customerScope: saved.customerScope ? saved.customerScope === "all" ? "all" : "own" : defaultRole.customerScope,
      alertScope: saved.alertScope ? saved.alertScope === "all" ? "all" : "own" : defaultRole.alertScope
    };
  });
  db.settings = {
    companyName: "NexCrm Local",
    companyPhone: "",
    companyEmail: "",
    lineMode: "lineapp",
    lineOaId: "@nexcrm",
    lineChannelId: "",
    lineChannelSecret: "",
    emailProvider: "gmail",
    apiToken: "nexcrm-local-api-token",
    webhookUrl: "/api/webhook/line",
    notifyBeforeDays: 1,
    notifyDailyDigest: true,
    newCustomerDays: 30,
    oldCustomerDays: 90,
    closedLostCallLimit: 6,
    closedLostDayLimit: 45,
    defaultOwnerId: db.users[0]?.id || "",
    updatedAt: nowIso(),
    ...(db.settings || {})
  };
  const defaultCategory = db.customerCategories[0]?.id || "cat_general";
  db.customers = db.customers.map(customer => ({
    categoryId: defaultCategory,
    hasPurchase: false,
    purchasedAt: "",
    closedLostAt: "",
    closeLostReason: "",
    lostToCompetitor: "",
    ...customer,
    note: customer.latestActivityNote || customer.note || ""
  }));
  db.activities = db.activities.map(activity => ({
    activityType: activity.type || "call",
    title: activity.title || activity.reason || "บันทึกกิจกรรม",
    ...activity
  }));
  return db;
}

const store = createStore({ dbPath: DB_PATH, seedDatabase, normalizeDatabase });
const ensureDatabase = store.ensureDatabase;
const readDatabase = store.readDatabase;
const writeDatabase = store.writeDatabase;

function cleanCustomer(input, fallback = {}) {
  return {
    id: fallback.id || id("cus"),
    company: String(input.company || fallback.company || "").trim(),
    contact: String(input.contact || fallback.contact || "").trim(),
    phone: String(input.phone || fallback.phone || "").trim(),
    email: String(input.email || fallback.email || "").trim(),
    line: String(input.line || fallback.line || "").trim(),
    lineUserId: String(input.lineUserId || fallback.lineUserId || "").trim(),
    categoryId: String(input.categoryId || fallback.categoryId || "cat_general").trim(),
    note: String(input.latestActivityNote || input.note || fallback.note || "").trim(),
    status: String(input.status || fallback.status || "ใหม่").trim(),
    ownerId: String(input.ownerId || fallback.ownerId || "").trim(),
    source: String(input.source || fallback.source || "Manual").trim(),
    followUpDate: String(input.followUpDate || fallback.followUpDate || "").trim(),
    callCount: Number.isFinite(Number(fallback.callCount)) ? Number(fallback.callCount) : 0,
    hasPurchase: Boolean(input.hasPurchase ?? fallback.hasPurchase ?? false),
    purchasedAt: String(input.purchasedAt || fallback.purchasedAt || "").trim(),
    closedLostAt: String(input.closedLostAt || fallback.closedLostAt || "").trim(),
    closeLostReason: String(input.closeLostReason || fallback.closeLostReason || "").trim(),
    lostToCompetitor: String(input.lostToCompetitor || fallback.lostToCompetitor || "").trim(),
    lastContactAt: fallback.lastContactAt || "",
    createdAt: fallback.createdAt || nowIso()
  };
}

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function sessionSecret(db) {
  return globalThis.process?.env?.NEXCRM_SESSION_SECRET || db.settings.apiToken || "nexcrm-session-v1";
}

function currentUser(req, db) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = readSessionToken(token, sessionSecret(db));
  if (session?.userId) {
    return db.users.find(user => user.id === session.userId && user.active) || null;
  }
  if (token && sessions.has(token)) {
    const userId = sessions.get(token);
    return db.users.find(user => user.id === userId && user.active) || null;
  }
  if (token && token === db.settings.apiToken) {
    return { id: "api_client", username: "api", name: "External API", role: "API", active: true };
  }
  return null;
}

function booleanValue(value, fallback = true) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return fallback;
}

function hasWebhookAuth(req, db, url) {
  const headerToken = req.headers["x-api-key"] || "";
  const queryToken = url.searchParams.get("token") || "";
  return headerToken === db.settings.apiToken || queryToken === db.settings.apiToken;
}

function addActivity(db, activity) {
  const next = { id: id("act"), createdAt: nowIso(), ...activity };
  db.activities.unshift(next);
  return next;
}

function activityDefinition(type) {
  return ACTIVITY_TYPES.find(item => item.id === type) || ACTIVITY_TYPES[0];
}

function applyActivityToCustomer(customer, body) {
  const type = String(body.activityType || body.type || "call").trim();
  const definition = activityDefinition(type);
  const note = String(body.note || body.latestActivityNote || "").trim();
  const reason = String(body.reason || definition.label).trim();
  const createdAt = nowIso();

  if (type === "call") {
    customer.callCount = Number(customer.callCount || 0) + 1;
  }
  customer.lastContactAt = createdAt;
  if (note) customer.note = note;
  if (body.followUpDate !== undefined) customer.followUpDate = String(body.followUpDate || "").trim();
  if (definition.status) customer.status = definition.status;
  if (definition.marksPurchase) {
    customer.hasPurchase = true;
    customer.purchasedAt = String(body.purchasedAt || createdAt).trim();
    customer.closedLostAt = "";
    customer.closeLostReason = "";
    customer.lostToCompetitor = "";
  }
  if (definition.marksLost) {
    customer.hasPurchase = false;
    customer.status = "ปิดไม่ได้";
    customer.closedLostAt = createdAt;
    customer.closeLostReason = note || reason;
    customer.lostToCompetitor = String(body.lostToCompetitor || "").trim();
  }

  return {
    customerId: customer.id,
    type,
    activityType: type,
    title: definition.label,
    reason,
    note,
    count: type === "call" ? customer.callCount : 1,
    createdAt
  };
}

function upsertFollowUpAlert(db, customer) {
  if (!customer.followUpDate) return null;
  const existing = db.alerts.find(alert => alert.customerId === customer.id && alert.type === "follow_up" && !alert.resolved);
  if (existing) return existing;
  const alert = {
    id: id("alr"),
    customerId: customer.id,
    type: "follow_up",
    title: `ติดตาม ${customer.company || customer.contact}`,
    message: `นัดติดตามวันที่ ${customer.followUpDate}`,
    severity: "info",
    resolved: false,
    createdAt: nowIso()
  };
  db.alerts.unshift(alert);
  return alert;
}

async function serveStatic(req, res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const type = contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch {
    const fallback = await fs.readFile(path.join(PUBLIC_DIR, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fallback);
  }
}

async function handleApi(req, res, url) {
  const method = req.method || "GET";
  const pathname = url.pathname;

  if (method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, { ok: true, app: "NexCrm", time: nowIso() });
    return;
  }

  const db = await readDatabase();

  if (method === "POST" && pathname === "/api/login") {
    const body = await parseBody(req);
    const username = String(body.username || "").trim();
    const passwordHash = hashPassword(String(body.password || ""));
    const user = db.users.find(item => item.username === username && item.passwordHash === passwordHash && item.active);
    if (!user) {
      sendJson(res, 401, { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      return;
    }
    const token = issueSessionToken(user.id, sessionSecret(db));
    sessions.set(token, user.id);
    sendJson(res, 200, { token, user: publicUser(user) });
    return;
  }

  if (method === "POST" && pathname === "/api/webhook/line") {
    if (!hasWebhookAuth(req, db, url)) {
      sendJson(res, 401, { error: "Invalid API token" });
      return;
    }
    const body = await parseBody(req);
    const profile = body.profile || body;
    const lineUserId = String(profile.userId || profile.lineUserId || "").trim();
    const existing = db.customers.find(customer => customer.lineUserId && customer.lineUserId === lineUserId);
    const payload = cleanCustomer({
      company: profile.company || profile.displayName || "Line Contact",
      contact: profile.contact || profile.displayName || "",
      phone: profile.phone || "",
      email: profile.email || "",
      line: profile.line || lineUserId || "",
      lineUserId,
      note: profile.note || body.message || "นำเข้าจาก LineOA",
      status: profile.status || "ใหม่",
      ownerId: db.settings.defaultOwnerId,
      source: "LineOA",
      followUpDate: profile.followUpDate || ""
    }, existing || {});
    if (existing) {
      Object.assign(existing, payload);
    } else {
      db.customers.unshift(payload);
    }
    addActivity(db, {
      customerId: payload.id,
      type: "line",
      title: "นำเข้าจาก LineOA",
      reason: "Webhook",
      note: payload.note,
      count: 1,
      createdBy: "api_client"
    });
    await writeDatabase(db);
    sendJson(res, existing ? 200 : 201, { customer: payload });
    return;
  }

  const user = currentUser(req, db);
  if (!user) {
    sendJson(res, 401, { error: "กรุณาเข้าสู่ระบบ" });
    return;
  }

  if (method === "GET" && pathname === "/api/me") {
    sendJson(res, 200, { user: publicUser(user) });
    return;
  }

  if (method === "GET" && pathname === "/api/bootstrap") {
    const canManage = canAccessMenu(db, user, "settings");
    sendJson(res, 200, {
      user: publicUser(user),
      users: canManage ? db.users.map(publicUser) : [publicUser(user)],
      customers: visibleCustomers(db, user),
      customerCategories: db.customerCategories,
      sources: db.sources,
      roles: db.roles,
      permissions: {
        menus: roleMenus(db, user),
        customerScope: roleDefinition(db, user)?.customerScope || "own",
        alertScope: roleDefinition(db, user)?.alertScope || "own"
      },
      activityTypes: ACTIVITY_TYPES,
      activities: visibleActivities(db, user),
      alerts: visibleAlerts(db, user),
      settings: publicSettings(db, user)
    });
    return;
  }

  if (method === "GET" && pathname === "/api/customers") {
    sendJson(res, 200, { customers: visibleCustomers(db, user) });
    return;
  }

  if (method === "POST" && pathname === "/api/customers") {
    const body = await parseBody(req);
    const customerInput = canSeeAllCustomers(db, user) ? body : { ...body, ownerId: user.id };
    const customer = cleanCustomer(customerInput, { ownerId: canSeeAllCustomers(db, user) ? db.settings.defaultOwnerId : user.id });
    if (!customer.company || !customer.contact) {
      sendJson(res, 422, { error: "กรุณากรอกชื่อบริษัทและชื่อผู้ติดต่อ" });
      return;
    }
    db.customers.unshift(customer);
    addActivity(db, {
      customerId: customer.id,
      type: "created",
      title: "สร้างลูกค้าใหม่",
      reason: customer.source,
      note: customer.note,
      count: 1,
      createdBy: user.id
    });
    upsertFollowUpAlert(db, customer);
    await writeDatabase(db);
    sendJson(res, 201, { customer });
    return;
  }

  if (method === "POST" && pathname === "/api/customers/import-line") {
    const body = await parseBody(req);
    const sampleNumber = db.customers.filter(customer => customer.source === "LineOA").length + 1;
    const customer = cleanCustomer({
      company: body.company || `Line Prospect ${sampleNumber}`,
      contact: body.contact || "ลูกค้าจาก Line",
      phone: body.phone || "0800000000",
      email: body.email || `line${sampleNumber}@example.com`,
      line: body.line || `@line.prospect.${sampleNumber}`,
      lineUserId: body.lineUserId || `U-demo-${Date.now()}`,
      note: body.note || "นำเข้าจาก LineOA และรอติดตาม",
      status: body.status || "ใหม่",
      ownerId: canSeeAllCustomers(db, user) ? body.ownerId || db.settings.defaultOwnerId : user.id,
      source: "LineOA",
      followUpDate: body.followUpDate || ""
    });
    db.customers.unshift(customer);
    addActivity(db, {
      customerId: customer.id,
      type: "line",
      title: "นำเข้าจาก LineOA",
      reason: "Manual sync",
      note: customer.note,
      count: 1,
      createdBy: user.id
    });
    await writeDatabase(db);
    sendJson(res, 201, { customer });
    return;
  }

  const customerMatch = pathname.match(/^\/api\/customers\/([^/]+)$/);
  if (customerMatch && method === "PUT") {
    const customer = findVisibleCustomer(db, user, customerMatch[1]);
    if (!customer) {
      sendJson(res, 404, { error: "ไม่พบข้อมูลลูกค้า" });
      return;
    }
    const body = await parseBody(req);
    const customerInput = canSeeAllCustomers(db, user) ? body : { ...body, ownerId: customer.ownerId || user.id };
    Object.assign(customer, cleanCustomer(customerInput, customer), { id: customer.id });
    upsertFollowUpAlert(db, customer);
    await writeDatabase(db);
    sendJson(res, 200, { customer });
    return;
  }

  const callMatch = pathname.match(/^\/api\/customers\/([^/]+)\/calls$/);
  if (callMatch && method === "POST") {
    const customer = findVisibleCustomer(db, user, callMatch[1]);
    if (!customer) {
      sendJson(res, 404, { error: "ไม่พบข้อมูลลูกค้า" });
      return;
    }
    const body = await parseBody(req);
    const activity = addActivity(db, {
      ...applyActivityToCustomer(customer, { ...body, activityType: "call" }),
      createdBy: user.id
    });
    await writeDatabase(db);
    sendJson(res, 201, { customer, activity });
    return;
  }

  const activityMatch = pathname.match(/^\/api\/customers\/([^/]+)\/activities$/);
  if (activityMatch && method === "POST") {
    const customer = findVisibleCustomer(db, user, activityMatch[1]);
    if (!customer) {
      sendJson(res, 404, { error: "ไม่พบข้อมูลลูกค้า" });
      return;
    }
    const body = await parseBody(req);
    const activity = addActivity(db, {
      ...applyActivityToCustomer(customer, body),
      createdBy: user.id
    });
    await writeDatabase(db);
    sendJson(res, 201, { customer, activity });
    return;
  }

  if (method === "GET" && pathname === "/api/customer-categories") {
    sendJson(res, 200, { customerCategories: db.customerCategories });
    return;
  }

  if (method === "POST" && pathname === "/api/customer-categories") {
    if (!requireSettingsAccess(db, user, res)) return;
    const body = await parseBody(req);
    const name = String(body.name || "").trim();
    if (!name) {
      sendJson(res, 422, { error: "กรุณากรอกชื่อหมวดหมู่" });
      return;
    }
    const category = {
      id: id("cat"),
      name,
      color: String(body.color || "#277c75").trim()
    };
    db.customerCategories.push(category);
    await writeDatabase(db);
    sendJson(res, 201, { category });
    return;
  }

  if (method === "GET" && pathname === "/api/sources") {
    sendJson(res, 200, { sources: db.sources });
    return;
  }

  if (method === "POST" && pathname === "/api/sources") {
    if (!requireSettingsAccess(db, user, res)) return;
    const body = await parseBody(req);
    const name = String(body.name || "").trim();
    if (!name) {
      sendJson(res, 422, { error: "กรุณากรอกชื่อแหล่งที่มา" });
      return;
    }
    if (db.sources.some(source => source.toLowerCase() === name.toLowerCase())) {
      sendJson(res, 409, { error: "แหล่งที่มานี้มีอยู่แล้ว" });
      return;
    }
    db.sources.push(name);
    await writeDatabase(db);
    sendJson(res, 201, { source: name, sources: db.sources });
    return;
  }

  const sourceMatch = pathname.match(/^\/api\/sources\/(.+)$/);
  if (sourceMatch && method === "DELETE") {
    if (!requireSettingsAccess(db, user, res)) return;
    const source = decodeURIComponent(sourceMatch[1]);
    if (DEFAULT_SOURCES.includes(source)) {
      sendJson(res, 422, { error: "ไม่สามารถลบแหล่งที่มาหลักของระบบได้" });
      return;
    }
    if (db.customers.some(customer => customer.source === source)) {
      sendJson(res, 409, { error: "มีลูกค้าที่ใช้แหล่งที่มานี้อยู่" });
      return;
    }
    db.sources = db.sources.filter(item => item !== source);
    await writeDatabase(db);
    sendJson(res, 200, { sources: db.sources });
    return;
  }

  if (method === "GET" && pathname === "/api/roles") {
    if (!requireSettingsAccess(db, user, res)) return;
    sendJson(res, 200, { roles: db.roles });
    return;
  }

  if (method === "PUT" && pathname === "/api/roles") {
    if (!requireSettingsAccess(db, user, res)) return;
    const body = await parseBody(req);
    const incoming = Array.isArray(body.roles) ? body.roles : [];
    db.roles = DEFAULT_ROLES.map(defaultRole => {
      if (defaultRole.locked) return { ...defaultRole };
      const saved = incoming.find(role => role.id === defaultRole.id) || {};
      return {
        ...defaultRole,
        customerScope: saved.customerScope ? saved.customerScope === "all" ? "all" : "own" : defaultRole.customerScope,
        alertScope: saved.alertScope ? saved.alertScope === "all" ? "all" : "own" : defaultRole.alertScope,
        menus: Array.isArray(saved.menus) ? saved.menus.filter(menu => MENU_KEYS.includes(menu)) : defaultRole.menus
      };
    });
    await writeDatabase(db);
    sendJson(res, 200, { roles: db.roles });
    return;
  }

  if (method === "GET" && pathname === "/api/users") {
    if (!requireSettingsAccess(db, user, res)) return;
    sendJson(res, 200, { users: db.users.map(publicUser) });
    return;
  }

  if (method === "POST" && pathname === "/api/users") {
    if (!requireSettingsAccess(db, user, res)) return;
    const body = await parseBody(req);
    if (!body.username || !body.name) {
      sendJson(res, 422, { error: "กรุณากรอกชื่อและ username" });
      return;
    }
    const username = String(body.username).trim();
    const userExists = db.users.some(item => item.username === username);
    if (userExists) {
      sendJson(res, 409, { error: "username นี้ถูกใช้แล้ว" });
      return;
    }
    const newUser = {
      id: id("usr"),
      name: String(body.name).trim(),
      username,
      passwordHash: hashPassword(String(body.password || "Nexcrm1234!")),
      role: db.roles.some(role => role.id === body.role) ? String(body.role).trim() : "Sale",
      email: String(body.email || "").trim(),
      active: booleanValue(body.active, true),
      createdAt: nowIso()
    };
    db.users.push(newUser);
    await writeDatabase(db);
    sendJson(res, 201, { user: publicUser(newUser) });
    return;
  }

  const userMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
  if (userMatch && method === "PUT") {
    if (!requireSettingsAccess(db, user, res)) return;
    const target = db.users.find(item => item.id === userMatch[1]);
    if (!target) {
      sendJson(res, 404, { error: "ไม่พบผู้ใช้" });
      return;
    }
    const body = await parseBody(req);
    const username = String(body.username || "").trim();
    const name = String(body.name || "").trim();
    if (!username || !name) {
      sendJson(res, 422, { error: "กรุณากรอกชื่อและ username" });
      return;
    }
    const userExists = db.users.some(item => item.id !== target.id && item.username === username);
    if (userExists) {
      sendJson(res, 409, { error: "username นี้ถูกใช้แล้ว" });
      return;
    }
    target.name = name;
    target.username = username;
    target.email = String(body.email || "").trim();
    if (target.id !== user.id) {
      target.role = db.roles.some(role => role.id === body.role) ? String(body.role).trim() : target.role;
      target.active = booleanValue(body.active, target.active);
    } else {
      target.active = true;
    }
    if (String(body.password || "").trim()) {
      target.passwordHash = hashPassword(String(body.password));
    }
    target.updatedAt = nowIso();
    await writeDatabase(db);
    sendJson(res, 200, { user: publicUser(target) });
    return;
  }

  if (userMatch && method === "DELETE") {
    if (!requireSettingsAccess(db, user, res)) return;
    const target = db.users.find(item => item.id === userMatch[1]);
    if (!target) {
      sendJson(res, 404, { error: "ไม่พบผู้ใช้" });
      return;
    }
    if (target.id === user.id) {
      sendJson(res, 422, { error: "ไม่สามารถลบผู้ใช้ที่กำลังล็อกอินอยู่" });
      return;
    }
    target.active = false;
    target.deletedAt = nowIso();
    await writeDatabase(db);
    sendJson(res, 200, { user: publicUser(target) });
    return;
  }

  if (method === "PUT" && pathname === "/api/settings") {
    if (!requireSettingsAccess(db, user, res)) return;
    const body = await parseBody(req);
    db.settings = {
      ...db.settings,
      ...body,
      apiToken: db.settings.apiToken,
      updatedAt: nowIso()
    };
    await writeDatabase(db);
    sendJson(res, 200, { settings: publicSettings(db, user) });
    return;
  }

  const alertMatch = pathname.match(/^\/api\/alerts\/([^/]+)\/resolve$/);
  if (alertMatch && method === "POST") {
    const alert = visibleAlerts(db, user).find(item => item.id === alertMatch[1]);
    if (!alert) {
      sendJson(res, 404, { error: "ไม่พบแจ้งเตือน" });
      return;
    }
    alert.resolved = true;
    alert.resolvedAt = nowIso();
    await writeDatabase(db);
    sendJson(res, 200, { alert });
    return;
  }

  sendJson(res, 404, { error: "ไม่พบ API endpoint" });
}

export async function handleRequest(req, res) {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
}

export default handleRequest;

export async function startServer(port = PORT) {
  await ensureDatabase();
  const server = http.createServer(handleRequest);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      server.off("error", reject);
      resolve();
    });
  });
  console.log(`NexCrm running at http://localhost:${port}`);
  return server;
}

const isDirectRun =
  typeof process !== "undefined" &&
  process.argv?.[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  startServer().catch(error => {
    console.error(error);
    process.exit(1);
  });
}


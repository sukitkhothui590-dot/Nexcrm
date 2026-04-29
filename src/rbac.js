import { DEFAULT_ROLES, MENU_KEYS } from "./config.js";
import { sendJson } from "./http.js";

export function roleDefinition(db, user) {
  if (!user) return null;
  if (user.role === "API") {
    return { id: "API", name: "API", customerScope: "all", alertScope: "all", menus: ["api"] };
  }
  return db.roles.find(role => role.id === user.role || role.name === user.role)
    || db.roles.find(role => role.id === "Sale")
    || DEFAULT_ROLES[0];
}

export function roleMenus(db, user) {
  const role = roleDefinition(db, user);
  return Array.isArray(role?.menus) ? role.menus.filter(menu => MENU_KEYS.includes(menu)) : [];
}

export function canAccessMenu(db, user, menu) {
  return roleMenus(db, user).includes(menu);
}

export function canSeeAllCustomers(db, user) {
  return roleDefinition(db, user)?.customerScope === "all";
}

export function canSeeAllAlerts(db, user) {
  return roleDefinition(db, user)?.alertScope === "all";
}

export function visibleCustomers(db, user) {
  if (canSeeAllCustomers(db, user)) return db.customers;
  return db.customers.filter(customer => customer.ownerId === user.id);
}

export function visibleCustomerIds(db, user) {
  return new Set(visibleCustomers(db, user).map(customer => customer.id));
}

export function visibleActivities(db, user) {
  const ids = visibleCustomerIds(db, user);
  return db.activities.filter(activity => ids.has(activity.customerId));
}

export function visibleAlerts(db, user) {
  if (canSeeAllAlerts(db, user)) return db.alerts;
  const ids = visibleCustomerIds(db, user);
  return db.alerts.filter(alert => ids.has(alert.customerId) || alert.userId === user.id);
}

export function findVisibleCustomer(db, user, customerId) {
  return visibleCustomers(db, user).find(customer => customer.id === customerId) || null;
}

export function publicSettings(db, user) {
  const settings = { ...db.settings };
  if (!canAccessMenu(db, user, "api")) {
    settings.apiToken = "";
  }
  return settings;
}

export function requireSettingsAccess(db, user, res) {
  if (canAccessMenu(db, user, "settings")) return true;
  sendJson(res, 403, { error: "ไม่มีสิทธิ์จัดการตั้งค่า" });
  return false;
}

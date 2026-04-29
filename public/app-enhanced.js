const app = document.querySelector("#app");

const icons = {
  customers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 21a6 6 0 0 0-12 0"/><circle cx="12" cy="8" r="5"/></svg>',
  alerts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.3 21h3.4"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1A1.7 1.7 0 0 0 4.45 6.3l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 .4 1.1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.2.36.6.6 1 .6h.6a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-.4 1Z"/></svg>',
  api: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15v-4"/><path d="M12 17V7"/><path d="M17 13V9"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L9 10.72a16 16 0 0 0 4.28 4.28l1.28-1.28a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>',
  line: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5c0 4.1-4 7.5-9 7.5-.9 0-1.8-.1-2.6-.3L4 21l1.6-4A7 7 0 0 1 3 11.5C3 7.4 7 4 12 4s9 3.4 9 7.5Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8 12 3 7 8"/><path d="M12 3v12"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg>'
};

const fallbackActivityTypes = [
  { id: "call", label: "โทรติดตาม", status: "กำลังติดตาม" },
  { id: "visit", label: "ไปพบลูกค้า", status: "นัดติดตาม" },
  { id: "site_visit", label: "ไปเยี่ยมลูกค้า", status: "นัดติดตาม" },
  { id: "demo", label: "Demo / นำเสนอระบบ", status: "กำลังติดตาม" },
  { id: "quote", label: "เสนอราคา", status: "เสนอราคา" },
  { id: "negotiate", label: "ต่อรองราคา", status: "ต่อรองราคา" },
  { id: "document", label: "ส่งเอกสาร / สัญญา", status: "รอเอกสาร" },
  { id: "payment", label: "รับชำระเงิน / มีการซื้อขาย", status: "ปิดการขาย" },
  { id: "won", label: "ปิดการขาย", status: "ปิดการขาย" },
  { id: "after_sale", label: "ติดตามหลังการขาย", status: "ดูแลหลังการขาย" },
  { id: "lost", label: "ปิดไม่ได้", status: "ปิดไม่ได้" }
];

const state = {
  token: localStorage.getItem("nexcrm.token") || "",
  user: null,
  view: "customers",
  query: "",
  filter: "all",
  filterMenuOpen: false,
  categoryMenuOpen: false,
  categoryFilter: "all",
  reportRange: 30,
  reportBucket: "day",
  settingsTab: "system",
  selectedId: "",
  customers: [],
  users: [],
  alerts: [],
  activities: [],
  customerCategories: [],
  sources: [],
  roles: [],
  permissions: { menus: ["customers", "alerts", "reports", "settings", "api"], customerScope: "all", alertScope: "all" },
  activityTypes: fallbackActivityTypes,
  settings: {},
  modal: null,
  sidebarOpen: false,
  toast: ""
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function api(path, options = {}) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {})
    }
  }).then(async response => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  });
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: String(value).includes("T") ? "short" : undefined
  }).format(date);
}

function toDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function monthKey(date) {
  return date.toISOString().slice(0, 7);
}

function yearKey(date) {
  return String(date.getFullYear());
}

function daysSince(value) {
  const date = toDate(value);
  if (!date) return 0;
  return Math.floor((Date.now() - date.getTime()) / 86400000);
}

function categoryById(id) {
  return state.customerCategories.find(category => category.id === id) || state.customerCategories[0] || { id: "cat_general", name: "ทั่วไป", color: "#277c75" };
}

function activityById(id) {
  return state.activityTypes.find(type => type.id === id) || fallbackActivityTypes.find(type => type.id === id) || fallbackActivityTypes[0];
}

function customerKind(customer) {
  const age = daysSince(customer.createdAt);
  const oldDays = Number(state.settings.oldCustomerDays || 90);
  const newDays = Number(state.settings.newCustomerDays || 30);
  const lostCalls = Number(state.settings.closedLostCallLimit || 6);
  const lostDays = Number(state.settings.closedLostDayLimit || 45);
  if (customer.status === "ปิดไม่ได้" || customer.closedLostAt) return "ปิดไม่ได้";
  if (!customer.hasPurchase && customer.status !== "ปิดการขาย" && ((customer.callCount || 0) >= lostCalls || age >= lostDays)) return "เสี่ยงปิดไม่ได้";
  if (customer.hasPurchase || customer.purchasedAt || customer.status === "ปิดการขาย" || age > oldDays) return "ลูกค้าเก่า";
  if (!customer.hasPurchase && age <= newDays) return "ลูกค้าใหม่";
  return "กำลังติดตาม";
}

function customerFilterOptions() {
  return [
    ["all", "ทั้งหมด"],
    ["new", "ลูกค้าใหม่"],
    ["old", "ลูกค้าเก่า"],
    ["lost", "ปิดไม่ได้"],
    ["added7", "เพิ่มมาภายใน 7 วัน"],
    ["added30", "เพิ่มมาภายใน 30 วัน"]
  ];
}

function activeFilterLabel() {
  return customerFilterOptions().find(([key]) => key === state.filter)?.[1] || "ตัวกรอง";
}

function activeCategoryLabel() {
  if (state.categoryFilter === "all") return "ทุกหมวดหมู่";
  return categoryById(state.categoryFilter).name;
}

const allMenus = [
  ["customers", "ลูกค้า", icons.customers],
  ["alerts", "การแจ้งเตือน", icons.alerts],
  ["reports", "รายงาน", icons.report],
  ["settings", "ตั้งค่า", icons.settings],
  ["api", "API", icons.api]
];

function roleById(id) {
  return state.roles.find(role => role.id === id || role.name === id) || state.roles.find(role => role.id === "Sale") || { id: "Sale", name: "Sale", menus: ["customers", "alerts"], customerScope: "own", alertScope: "own" };
}

function roleName(id) {
  return roleById(id).name || id;
}

function canUseMenu(key) {
  const menus = state.permissions?.menus || roleById(state.user?.role).menus || [];
  return menus.includes(key);
}

function firstAllowedView() {
  return allMenus.find(([key]) => canUseMenu(key))?.[0] || "customers";
}

function sourceOptions() {
  const values = [...new Set([...(state.sources || []), ...state.customers.map(customer => customer.source).filter(Boolean), "Manual"])];
  return values;
}

function statusClass(status, followUpDate, customer) {
  const kind = customer ? customerKind(customer) : "";
  const today = new Date().toISOString().slice(0, 10);
  if (kind.includes("ปิดไม่ได้") || followUpDate && followUpDate < today) return "red";
  if (status === "ปิดการขาย" || kind === "ลูกค้าเก่า") return "green";
  if (String(status).includes("ติดตาม") || String(status).includes("นัด") || String(status).includes("เสนอ") || String(status).includes("ต่อรอง")) return "amber";
  if (String(status).includes("ใหม่")) return "green";
  return "";
}

function setToast(message) {
  state.toast = message;
  render();
  clearTimeout(setToast.timer);
  setToast.timer = setTimeout(() => {
    state.toast = "";
    render();
  }, 2600);
}

async function loadBootstrap() {
  const data = await api("/api/bootstrap");
  state.user = data.user;
  state.users = data.users || [];
  state.customers = data.customers || [];
  state.activities = data.activities || [];
  state.alerts = data.alerts || [];
  state.customerCategories = data.customerCategories || [];
  state.sources = data.sources || ["Manual", "LineOA", "API"];
  state.roles = data.roles || [];
  state.permissions = data.permissions || state.permissions;
  state.activityTypes = data.activityTypes || fallbackActivityTypes;
  state.settings = data.settings || {};
  if (!canUseMenu(state.view)) state.view = firstAllowedView();
  if (!state.selectedId && state.customers[0]) state.selectedId = state.customers[0].id;
}

function selectedCustomer() {
  return state.customers.find(customer => customer.id === state.selectedId) || state.customers[0] || null;
}

function customerActivities(customerId) {
  return state.activities.filter(activity => activity.customerId === customerId);
}

function brand() {
  return `
    <div class="brand">
      <div class="brand-mark">N</div>
      <div>
        <span class="brand-text">NexCrm</span>
        <span class="brand-sub">Sales workspace</span>
      </div>
    </div>
  `;
}

function navItems() {
  return allMenus.filter(([key]) => canUseMenu(key));
}

function renderLogin() {
  app.innerHTML = `
    <section class="login-screen">
      <form class="login-panel" data-form="login">
        ${brand()}
        <h1>เข้าสู่ระบบ</h1>
        <p>ระบบบันทึกข้อมูลลูกค้าและติดตามงานขายในที่เดียว</p>
        <div class="form-grid">
          <div class="field"><label for="username">Username</label><input id="username" name="username" autocomplete="username" value="Superadmin" required></div>
          <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" value="Superadmin1234!" required></div>
          <button class="btn primary" type="submit">${icons.save} เข้าสู่ระบบ</button>
        </div>
        ${state.toast ? `<div class="login-error">${escapeHtml(state.toast)}</div>` : ""}
        <div class="login-help">ค่าเริ่มต้น: Superadmin / Superadmin1234!</div>
      </form>
    </section>
  `;
}

function renderSidebar() {
  return `
    <aside class="sidebar ${state.sidebarOpen ? "open" : ""}">
      ${brand()}
      <nav class="nav-group" aria-label="NexCrm navigation">
        ${navItems().map(([key, label, icon]) => `
          <button class="nav-button ${state.view === key ? "active" : ""}" data-view="${key}">
            ${icon}<span>${label}</span>
          </button>
        `).join("")}
      </nav>
      <div class="sidebar-footer">
        <span class="tiny-label">Logged in</span>
        <div class="user-line">
          <span>${escapeHtml(state.user?.name || "User")}</span>
          <button class="icon-only" data-action="logout" title="ออกจากระบบ">${icons.close}</button>
        </div>
      </div>
    </aside>
  `;
}

function renderTopbar() {
  const unresolved = state.alerts.filter(alert => !alert.resolved).length;
  return `
    <header class="topbar">
      <div class="search">
        <button class="icon-only mobile-menu" data-action="toggle-sidebar" title="เมนู">${icons.menu}</button>
        ${icons.search}
        <input data-search placeholder="ค้นหาบริษัท ผู้ติดต่อ เบอร์โทร Line หมวดหมู่" value="${escapeHtml(state.query)}">
      </div>
      <div class="top-actions">
        ${canUseMenu("alerts") ? `<button class="btn warning" data-view="alerts">${icons.alerts} ${unresolved} แจ้งเตือน</button>` : ""}
        ${canUseMenu("customers") ? `<button class="btn" data-action="import-line">${icons.upload} ดึงจาก Line</button>` : ""}
        ${canUseMenu("customers") ? `<button class="btn primary" data-action="open-customer">${icons.plus} เพิ่มลูกค้า</button>` : ""}
      </div>
    </header>
  `;
}

function filteredCustomers() {
  const query = state.query.trim().toLowerCase();
  return state.customers.filter(customer => {
    const category = categoryById(customer.categoryId);
    const text = [customer.company, customer.contact, customer.phone, customer.email, customer.line, customer.note, customer.status, category.name, customerKind(customer)]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesCategory = state.categoryFilter === "all" || customer.categoryId === state.categoryFilter;
    const age = daysSince(customer.createdAt);
    const matchesFilter =
      state.filter === "all" ||
      (state.filter === "new" && customerKind(customer) === "ลูกค้าใหม่") ||
      (state.filter === "old" && customerKind(customer) === "ลูกค้าเก่า") ||
      (state.filter === "lost" && customerKind(customer).includes("ปิดไม่ได้")) ||
      (state.filter === "added7" && age <= 7) ||
      (state.filter === "added30" && age <= 30);
    return matchesQuery && matchesCategory && matchesFilter;
  });
}

function emailLink(customer) {
  const email = encodeURIComponent(customer.email || "");
  if (!email) return "#";
  if (state.settings.emailProvider === "outlook") return `https://outlook.office.com/mail/deeplink/compose?to=${email}`;
  if (state.settings.emailProvider === "teams") return `https://teams.microsoft.com/l/chat/0/0?users=${email}`;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
}

function lineLink(customer) {
  const line = encodeURIComponent(String(customer.line || customer.lineUserId || "").replace(/^@/, ""));
  if (!line) return "#";
  if (state.settings.lineMode === "lineoa") return `https://manager.line.biz/account/${encodeURIComponent(state.settings.lineOaId || "")}`;
  return `line://ti/p/${line}`;
}

function renderCustomers() {
  const rows = filteredCustomers();
  return `
    <section class="content-panel">
      <div class="panel-head">
        <div class="heading-block">
          <h1>ลูกค้า</h1>
          <p>${rows.length} รายการ จากทั้งหมด ${state.customers.length} รายการ</p>
        </div>
        <div class="panel-tools">
          <div class="filter-menu">
            <button class="filter-trigger filter-trigger-stack ${state.categoryFilter !== "all" ? "active" : ""}" data-action="toggle-category-menu" type="button" title="แสดงหมวดหมู่">
              ${icons.menu}
              <span class="filter-copy">
                <small>แสดงหมวดหมู่</small>
                <b>${escapeHtml(activeCategoryLabel())}</b>
              </span>
            </button>
            ${state.categoryMenuOpen ? `
              <div class="filter-popover">
                <button class="${state.categoryFilter === "all" ? "active" : ""}" data-category-filter="all" type="button">ทุกหมวดหมู่</button>
                ${state.customerCategories.map(category => `<button class="${state.categoryFilter === category.id ? "active" : ""}" data-category-filter="${category.id}" type="button">${escapeHtml(category.name)}</button>`).join("")}
              </div>
            ` : ""}
          </div>
          <div class="filter-menu">
            <button class="filter-trigger filter-trigger-stack ${state.filter !== "all" ? "active" : ""}" data-action="toggle-filter-menu" type="button" title="ประเภทลูกค้า">
              ${icons.menu}
              <span class="filter-copy">
                <small>ประเภทลูกค้า</small>
                <b>${escapeHtml(activeFilterLabel())}</b>
              </span>
            </button>
            ${state.filterMenuOpen ? `
              <div class="filter-popover">
                ${customerFilterOptions().map(([key, label]) => `<button class="${state.filter === key ? "active" : ""}" data-filter="${key}" type="button">${escapeHtml(label)}</button>`).join("")}
              </div>
            ` : ""}
          </div>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ชื่อบริษัท</th>
              <th>ชื่อผู้ติดต่อ</th>
              <th>เบอร์โทร</th>
              <th>อีเมลล์</th>
              <th>Line</th>
              <th>หมวดหมู่</th>
              <th>บันทึกกิจกรรมล่าสุด</th>
              <th>สถานะ</th>
              <th>นัดติดตาม</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(customer => {
              const category = categoryById(customer.categoryId);
              const kind = customerKind(customer);
              return `
                <tr class="${state.selectedId === customer.id ? "selected" : ""}" data-select-customer="${customer.id}">
                  <td>
                    <div class="company-cell">
                      <strong>${escapeHtml(customer.company)}</strong>
                      <span>${escapeHtml(customer.source)} · โทร ${customer.callCount || 0} ครั้ง · ${escapeHtml(kind)}</span>
                    </div>
                  </td>
                  <td>${escapeHtml(customer.contact)}</td>
                  <td><button class="link-button table-contact contact-phone" data-action="call" data-id="${customer.id}" title="${escapeHtml(customer.phone || "-")}">${escapeHtml(customer.phone || "-")}</button></td>
                  <td><a class="link-button table-contact contact-email" href="${emailLink(customer)}" target="_blank" rel="noreferrer" title="${escapeHtml(customer.email || "-")}">${escapeHtml(customer.email || "-")}</a></td>
                  <td><a class="link-button table-contact contact-line" href="${lineLink(customer)}" target="_blank" rel="noreferrer" title="${escapeHtml(customer.line || "-")}">${escapeHtml(customer.line || "-")}</a></td>
                  <td><span class="category-chip" style="--chip:${escapeHtml(category.color)}">${escapeHtml(category.name)}</span></td>
                  <td class="note-cell">${escapeHtml(customer.note || "-")}</td>
                  <td><span class="status ${statusClass(customer.status, customer.followUpDate, customer)}">${escapeHtml(customer.status || "-")}</span></td>
                  <td>${formatDate(customer.followUpDate)}</td>
                </tr>
              `;
            }).join("") || `<tr><td colspan="9"><div class="empty">ไม่พบข้อมูลลูกค้า</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
    ${renderDetailPanel()}
  `;
}

function renderDetailPanel() {
  const customer = selectedCustomer();
  if (!customer) return `<aside class="detail-panel"><div class="empty">เลือกลูกค้าเพื่อดูประวัติ</div></aside>`;
  const activities = customerActivities(customer.id);
  const category = categoryById(customer.categoryId);
  return `
    <aside class="detail-panel">
      <div class="detail-top">
        <div class="detail-title">
          <div>
            <h2>${escapeHtml(customer.company)}</h2>
            <p>${escapeHtml(customer.contact)} · ${escapeHtml(customerKind(customer))}</p>
          </div>
          <button class="icon-only" data-action="edit-customer" data-id="${customer.id}" title="แก้ไข">${icons.settings}</button>
        </div>
        <div class="quick-grid">
          <div class="quick-stat"><b>${customer.callCount || 0}</b><span>ครั้งที่โทร</span></div>
          <div class="quick-stat"><b>${activities.length}</b><span>กิจกรรม</span></div>
          <div class="quick-stat"><b>${customer.hasPurchase ? "ซื้อแล้ว" : "ยังไม่ซื้อ"}</b><span>ซื้อขาย</span></div>
        </div>
      </div>
      <div class="detail-body">
        <div class="field-list">
          <div class="field-line"><span>หมวดหมู่</span><strong>${escapeHtml(category.name)}</strong></div>
          <div class="field-line"><span>เบอร์โทร</span><strong>${escapeHtml(customer.phone || "-")}</strong></div>
          <div class="field-line"><span>อีเมลล์</span><strong>${escapeHtml(customer.email || "-")}</strong></div>
          <div class="field-line"><span>Line</span><strong>${escapeHtml(customer.line || "-")}</strong></div>
          <div class="field-line"><span>ล่าสุด</span><strong>${formatDate(customer.lastContactAt)}</strong></div>
          ${customer.status === "ปิดไม่ได้" ? `<div class="field-line"><span>เหตุผล</span><strong>${escapeHtml(customer.closeLostReason || "-")}</strong></div>` : ""}
        </div>
        <section class="detail-section">
          <h3>บันทึกล่าสุด</h3>
          <p class="latest-note">${escapeHtml(customer.note || "-")}</p>
        </section>
        <section class="detail-section">
          <h3>ปุ่มการติดต่อ</h3>
          <div class="row-actions contact-actions">
          <a class="btn" href="${lineLink(customer)}" target="_blank" rel="noreferrer">${icons.line} Line</a>
            <button class="btn primary" data-action="call" data-id="${customer.id}">${icons.phone} โทร</button>
            <a class="btn" href="${emailLink(customer)}" target="_blank" rel="noreferrer">${icons.mail} อีเมลล์</a>
          </div>
        </section>
        <section class="detail-section">
          <div class="detail-section-head">
            <h3>บันทึกกิจกรรม</h3>
            <button class="btn" data-action="open-activity" data-id="${customer.id}">${icons.plus} บันทึกกิจกรรม</button>
          </div>
        </section>
        <div class="timeline">
          ${activities.map(activity => `
            <article class="timeline-item">
              <div class="timeline-icon">${activity.activityType === "call" || activity.type === "call" ? icons.phone : activity.activityType === "line" || activity.type === "line" ? icons.line : icons.plus}</div>
              <div class="timeline-card">
                <strong>${escapeHtml(activity.title || activityById(activity.activityType || activity.type).label)} ${activity.count && activity.activityType === "call" ? `#${activity.count}` : ""}</strong>
                <p>${escapeHtml(activity.reason || "")}</p>
                <p>${escapeHtml(activity.note || "")}</p>
                <time>${formatDate(activity.createdAt)}</time>
              </div>
            </article>
          `).join("") || `<div class="empty">ยังไม่มี log</div>`}
        </div>
      </div>
    </aside>
  `;
}

function rangeCustomers(days, offset = 0) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() - offset);
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  return state.customers.filter(customer => {
    const created = toDate(customer.createdAt);
    return created && created >= start && created <= end;
  });
}

function buildSeries(days, bucket) {
  const current = rangeCustomers(days, 0);
  const previous = rangeCustomers(days, days);
  const keyer = bucket === "year" ? yearKey : bucket === "month" ? monthKey : dayKey;
  const keys = [];
  const now = new Date();
  const steps = bucket === "year" ? Math.min(5, Math.ceil(days / 365) + 1) : bucket === "month" ? Math.min(12, Math.ceil(days / 30) + 1) : Math.min(days, 30);
  for (let i = steps - 1; i >= 0; i--) {
    const d = new Date(now);
    if (bucket === "year") d.setFullYear(d.getFullYear() - i);
    else if (bucket === "month") d.setMonth(d.getMonth() - i);
    else d.setDate(d.getDate() - i);
    keys.push(keyer(d));
  }
  const countBy = (items, key) => items.filter(customer => {
    const date = toDate(customer.createdAt);
    return date && keyer(date) === key;
  }).length;
  return keys.map(key => ({
    label: key,
    current: countBy(current, key),
    previous: countBy(previous, key)
  }));
}

function renderReports() {
  const current = rangeCustomers(state.reportRange);
  const previous = rangeCustomers(state.reportRange, state.reportRange);
  const newCount = current.filter(customer => customerKind(customer) === "ลูกค้าใหม่").length;
  const oldCount = current.filter(customer => customerKind(customer) === "ลูกค้าเก่า").length;
  const lostCount = current.filter(customer => customerKind(customer).includes("ปิดไม่ได้")).length;
  const series = buildSeries(Number(state.reportRange), state.reportBucket);
  const max = Math.max(1, ...series.flatMap(item => [item.current, item.previous]));
  return `
    <section class="content-panel" style="grid-column: 1 / -1;">
      <div class="panel-head">
        <div class="heading-block">
          <h1>รายงาน</h1>
          <p>เปรียบเทียบจำนวนลูกค้าที่เข้ามา ลูกค้าใหม่ ลูกค้าเก่า และปิดไม่ได้</p>
        </div>
        <div class="panel-tools">
          <div class="segmented">
            ${[[7, "7 วัน"], [15, "15 วัน"], [30, "30 วัน"], [365, "1 ปี"]].map(([days, label]) => `<button class="${Number(state.reportRange) === days ? "active" : ""}" data-report-range="${days}">${label}</button>`).join("")}
          </div>
          <div class="segmented">
            ${[["day", "วัน"], ["month", "เดือน"], ["year", "ปี"]].map(([key, label]) => `<button class="${state.reportBucket === key ? "active" : ""}" data-report-bucket="${key}">${label}</button>`).join("")}
          </div>
        </div>
      </div>
      <div class="report-grid">
        ${metricCard("ลูกค้าที่เข้ามา", current.length, previous.length)}
        ${metricCard("ลูกค้าใหม่", newCount, previous.filter(customer => customerKind(customer) === "ลูกค้าใหม่").length)}
        ${metricCard("ลูกค้าเก่า", oldCount, previous.filter(customer => customerKind(customer) === "ลูกค้าเก่า").length)}
        ${metricCard("ปิดไม่ได้ / เสี่ยง", lostCount, previous.filter(customer => customerKind(customer).includes("ปิดไม่ได้")).length)}
      </div>
      <div class="chart-panel">
        <div class="chart-head">
          <h3>กราฟแท่งเปรียบเทียบ</h3>
          <div class="legend"><span class="legend-current"></span>ช่วงปัจจุบัน <span class="legend-prev"></span>ช่วงก่อนหน้า</div>
        </div>
        <div class="bar-chart">
          ${series.map(item => `
            <div class="bar-group">
              <div class="bars">
                <span class="bar current" style="height:${Math.max(6, item.current / max * 150)}px" title="${item.current}"></span>
                <span class="bar previous" style="height:${Math.max(6, item.previous / max * 150)}px" title="${item.previous}"></span>
              </div>
              <small>${escapeHtml(item.label)}</small>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="list-page">
        <div class="data-list">
          ${current.map(customer => `
            <div class="list-row">
              <div>
                <h3>${escapeHtml(customer.company)}</h3>
                <p>${escapeHtml(customer.contact)} · ${escapeHtml(customerKind(customer))} · ${escapeHtml(categoryById(customer.categoryId).name)} · ${formatDate(customer.createdAt)}</p>
              </div>
              <span class="status ${statusClass(customer.status, customer.followUpDate, customer)}">${escapeHtml(customer.status)}</span>
            </div>
          `).join("") || `<div class="empty">ไม่มีลูกค้าในช่วงนี้</div>`}
        </div>
      </div>
    </section>
  `;
}

function metricCard(label, current, previous) {
  const diff = current - previous;
  const sign = diff > 0 ? "+" : "";
  return `
    <article class="metric-card">
      <span>${escapeHtml(label)}</span>
      <strong>${current}</strong>
      <small>${sign}${diff} เทียบช่วงก่อนหน้า</small>
    </article>
  `;
}

function renderUsers() {
  return `
    <section class="content-panel" style="grid-column: 1 / -1;">
      <div class="panel-head">
        <div class="heading-block"><h1>ผู้ใช้</h1><p>จัดการผู้ใช้งานและสิทธิ์ในระบบ</p></div>
        <button class="btn primary" data-action="open-user">${icons.plus} เพิ่มผู้ใช้</button>
      </div>
      <div class="list-page"><div class="data-list">
        ${state.users.map(user => `
          <div class="list-row">
            <div><h3>${escapeHtml(user.name)}</h3><p>${escapeHtml(user.username)} · ${escapeHtml(user.email || "-")} · ${escapeHtml(roleName(user.role))}</p></div>
            <div class="row-actions user-actions">
              <span class="status ${user.active ? "green" : "red"}">${user.active ? "ใช้งาน" : "ปิดใช้งาน"}</span>
              <button class="btn" data-action="edit-user" data-id="${user.id}">แก้ไข</button>
              <button class="btn danger" data-action="delete-user" data-id="${user.id}" ${state.user?.id === user.id ? "disabled" : ""}>ลบ</button>
            </div>
          </div>
        `).join("")}
      </div></div>
    </section>
  `;
}

function renderAlerts() {
  return `
    <section class="content-panel" style="grid-column: 1 / -1;">
      <div class="panel-head">
        <div class="heading-block"><h1>แจ้งเตือน</h1><p>Event สำหรับติดตามงานขายและลูกค้าที่ใกล้ถึงนัด</p></div>
      </div>
      <div class="list-page"><div class="data-list">
        ${state.alerts.map(alert => {
          const customer = state.customers.find(item => item.id === alert.customerId);
          return `
            <div class="list-row">
              <div><h3>${escapeHtml(alert.title)}</h3><p>${escapeHtml(alert.message)} · ${customer ? escapeHtml(customer.contact) : "ไม่ผูกลูกค้า"} · ${formatDate(alert.createdAt)}</p></div>
              ${alert.resolved ? `<span class="status green">ปิดแล้ว</span>` : `<button class="btn" data-action="resolve-alert" data-id="${alert.id}">${icons.save} ปิดแจ้งเตือน</button>`}
            </div>
          `;
        }).join("") || `<div class="empty">ยังไม่มีแจ้งเตือน</div>`}
      </div></div>
    </section>
  `;
}

function renderSettingsTabs() {
  return `
    <div class="settings-tabs">
      <div class="segmented">
        <button class="${state.settingsTab === "system" ? "active" : ""}" data-settings-tab="system">ระบบ</button>
        <button class="${state.settingsTab === "users" ? "active" : ""}" data-settings-tab="users">ผู้ใช้</button>
        <button class="${state.settingsTab === "roles" ? "active" : ""}" data-settings-tab="roles">สิทธิ์ Role</button>
      </div>
    </div>
  `;
}

function renderSettingsUsersPanel() {
  return `
    <section class="content-panel" style="grid-column: 1 / -1;">
      <div class="panel-head">
        <div class="heading-block"><h1>ตั้งค่า</h1><p>ผู้ใช้เป็นแท็บหนึ่งในเมนูตั้งค่า</p></div>
        <button class="btn primary" data-action="open-user">${icons.plus} เพิ่มผู้ใช้</button>
      </div>
      ${renderSettingsTabs()}
      <div class="list-page"><div class="data-list">
        ${state.users.map(user => `
          <div class="list-row">
            <div><h3>${escapeHtml(user.name)}</h3><p>${escapeHtml(user.username)} · ${escapeHtml(user.email || "-")} · ${escapeHtml(roleName(user.role))}</p></div>
            <div class="row-actions user-actions">
              <span class="status ${user.active ? "green" : "red"}">${user.active ? "ใช้งาน" : "ปิดใช้งาน"}</span>
              <button class="btn" data-action="edit-user" data-id="${user.id}">แก้ไข</button>
              <button class="btn danger" data-action="delete-user" data-id="${user.id}" ${state.user?.id === user.id ? "disabled" : ""}>ลบ</button>
            </div>
          </div>
        `).join("")}
      </div></div>
    </section>
  `;
}

function renderSettingsRolesPanel() {
  const editableRoles = state.roles.filter(role => role.id !== "Superadmin");
  return `
    <section class="content-panel" style="grid-column: 1 / -1;">
      <div class="panel-head">
        <div class="heading-block"><h1>ตั้งค่า</h1><p>กำหนดสิทธิ์การเห็นลูกค้า เมนู และการแจ้งเตือนของแต่ละ Role</p></div>
        <button class="btn primary" data-action="save-roles">${icons.save} บันทึกสิทธิ์</button>
      </div>
      ${renderSettingsTabs()}
      <div class="settings-grid role-settings">
        ${editableRoles.map(role => `
          <section class="settings-section role-card" data-role-card="${escapeHtml(role.id)}">
            <h3>${escapeHtml(role.name)}</h3>
            <div class="form-grid two">
              <div class="field">
                <label>การเห็นลูกค้า</label>
                <select data-role-customer-scope="${escapeHtml(role.id)}">
                  <option value="own" ${role.customerScope !== "all" ? "selected" : ""}>เห็นเฉพาะลูกค้าตัวเอง</option>
                  <option value="all" ${role.customerScope === "all" ? "selected" : ""}>เห็นลูกค้าทั้งหมด</option>
                </select>
              </div>
              <div class="field">
                <label>การแจ้งเตือน</label>
                <select data-role-alert-scope="${escapeHtml(role.id)}">
                  <option value="own" ${role.alertScope !== "all" ? "selected" : ""}>เห็นเฉพาะงานตัวเอง</option>
                  <option value="all" ${role.alertScope === "all" ? "selected" : ""}>เห็นของทุกคน</option>
                </select>
              </div>
            </div>
            <div class="permission-grid">
              <span class="permission-title">เมนูที่เห็นได้</span>
              ${allMenus.map(([key, label]) => `
                <label class="check-row">
                  <input type="checkbox" data-role-menu="${escapeHtml(role.id)}" value="${key}" ${role.menus?.includes(key) ? "checked" : ""}>
                  <span>${escapeHtml(label)}</span>
                </label>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSettings() {
  if (state.settingsTab === "roles") return renderSettingsRolesPanel();
  if (state.settingsTab === "users") return renderSettingsUsersPanel();
  return `
    <section class="content-panel" style="grid-column: 1 / -1;">
      <div class="panel-head">
        <div class="heading-block"><h1>ตั้งค่า</h1><p>เชื่อมต่อ LineOA, Email, บริษัท, หมวดหมู่ และเกณฑ์รายงาน</p></div>
        <button class="btn primary" data-action="save-settings">${icons.save} บันทึก</button>
      </div>
      ${renderSettingsTabs()}
      <form class="settings-grid" data-form="settings">
        <section class="settings-section">
          <h3>ข้อมูลบริษัท</h3>
          <div class="form-grid">
            ${field("companyName", "บริษัท", state.settings.companyName)}
            ${field("companyPhone", "เบอร์กลาง", state.settings.companyPhone)}
            ${field("companyEmail", "Email บริษัท", state.settings.companyEmail)}
          </div>
        </section>
        <section class="settings-section">
          <h3>LineOA</h3>
          <div class="form-grid">
            <div class="field"><label>โหมดเปิด Line</label><select name="lineMode"><option value="lineapp" ${state.settings.lineMode === "lineapp" ? "selected" : ""}>Line ในเครื่อง</option><option value="lineoa" ${state.settings.lineMode === "lineoa" ? "selected" : ""}>LineOA Manager</option></select></div>
            ${field("lineOaId", "LineOA ID", state.settings.lineOaId)}
            ${field("lineChannelId", "Channel ID", state.settings.lineChannelId)}
            ${field("lineChannelSecret", "Channel Secret", state.settings.lineChannelSecret, false, "password")}
          </div>
        </section>
        <section class="settings-section">
          <h3>Email และเจ้าของลูกค้า</h3>
          <div class="form-grid">
            <div class="field"><label>ผู้ให้บริการ Email</label><select name="emailProvider"><option value="gmail" ${state.settings.emailProvider === "gmail" ? "selected" : ""}>Gmail</option><option value="outlook" ${state.settings.emailProvider === "outlook" ? "selected" : ""}>Microsoft Outlook</option><option value="teams" ${state.settings.emailProvider === "teams" ? "selected" : ""}>Microsoft Teams</option></select></div>
            <div class="field"><label>ผู้ดูแลลูกค้าเริ่มต้น</label><select name="defaultOwnerId">${state.users.map(user => `<option value="${user.id}" ${state.settings.defaultOwnerId === user.id ? "selected" : ""}>${escapeHtml(user.name)}</option>`).join("")}</select></div>
          </div>
        </section>
        <section class="settings-section">
          <h3>เกณฑ์รายงาน</h3>
          <div class="form-grid two">
            ${field("newCustomerDays", "ลูกค้าใหม่ภายในกี่วัน", state.settings.newCustomerDays, false, "number")}
            ${field("oldCustomerDays", "ลูกค้าเก่าเมื่อเกินกี่วัน", state.settings.oldCustomerDays, false, "number")}
            ${field("closedLostCallLimit", "เสี่ยงปิดไม่ได้เมื่อโทรเกินกี่ครั้ง", state.settings.closedLostCallLimit, false, "number")}
            ${field("closedLostDayLimit", "เสี่ยงปิดไม่ได้เมื่อเกินกี่วัน", state.settings.closedLostDayLimit, false, "number")}
            ${field("notifyBeforeDays", "เตือนล่วงหน้า (วัน)", state.settings.notifyBeforeDays, false, "number")}
            <div class="field"><label>สรุปรายวัน</label><select name="notifyDailyDigest"><option value="true" ${state.settings.notifyDailyDigest ? "selected" : ""}>เปิด</option><option value="false" ${!state.settings.notifyDailyDigest ? "selected" : ""}>ปิด</option></select></div>
          </div>
        </section>
      </form>
      <div class="settings-grid category-settings">
        <section class="settings-section">
          <h3>หมวดหมู่ลูกค้า</h3>
          <form class="form-grid two" data-form="category">
            ${field("name", "ชื่อหมวดหมู่", "", true)}
            ${field("color", "สี", "#277c75", false, "color")}
            <button class="btn primary" type="submit">${icons.plus} เพิ่มหมวดหมู่</button>
          </form>
        </section>
        <section class="settings-section">
          <h3>หมวดหมู่ที่มีอยู่</h3>
          <div class="category-list">
            ${state.customerCategories.map(category => `<span class="category-chip" style="--chip:${escapeHtml(category.color)}">${escapeHtml(category.name)}</span>`).join("")}
          </div>
        </section>
        <section class="settings-section">
          <h3>แหล่งที่มา</h3>
          <form class="form-grid two" data-form="source">
            ${field("name", "ชื่อแหล่งที่มา", "", true)}
            <button class="btn primary" type="submit">${icons.plus} เพิ่มแหล่งที่มา</button>
          </form>
        </section>
        <section class="settings-section">
          <h3>แหล่งที่มาที่มีอยู่</h3>
          <div class="tag-list">
            ${sourceOptions().map(source => `
              <span class="tag-pill">
                ${escapeHtml(source)}
                ${["Manual", "LineOA", "API"].includes(source) ? "" : `<button type="button" data-action="delete-source" data-source="${escapeHtml(source)}" title="ลบแหล่งที่มา">${icons.close}</button>`}
              </span>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderApi() {
  const origin = window.location.origin;
  const token = state.settings.apiToken || "";
  const example = `curl -X POST ${origin}/api/customers/:id/activities \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer ${token}" \\\n  -d "{\\"activityType\\":\\"quote\\",\\"reason\\":\\"เสนอราคา\\",\\"note\\":\\"ส่งใบเสนอราคาแล้ว\\"}"`;
  return `
    <section class="content-panel" style="grid-column: 1 / -1;">
      <div class="panel-head">
        <div class="heading-block"><h1>API</h1><p>เชื่อมต่อข้อมูลลูกค้าจากภายนอกและอัปเดทกิจกรรมเข้าระบบ</p></div>
        <button class="btn" data-action="copy" data-copy="${escapeHtml(token)}">${icons.copy} Copy Token</button>
      </div>
      <div class="api-grid">
        <article class="api-card"><h3>POST /api/customers</h3><p>สร้างข้อมูลลูกค้าจากระบบภายนอก</p><div class="code-box">company, contact, phone, email, line, categoryId, latestActivityNote</div></article>
        <article class="api-card"><h3>POST /api/customers/:id/activities</h3><p>บันทึกกิจกรรม เช่น พบลูกค้า เสนอราคา ต่อรอง ปิดการขาย ปิดไม่ได้</p><div class="code-box">activityType: call | visit | quote | negotiate | won | lost</div></article>
        <article class="api-card"><h3>POST /api/webhook/line</h3><p>รับข้อมูลจาก LineOA Webhook หรือระบบกลาง</p><div class="code-box">x-api-key: ${escapeHtml(token)}</div></article>
      </div>
      <div class="list-page"><div class="code-box">${escapeHtml(example)}</div></div>
    </section>
  `;
}

function renderWorkspace() {
  if (!canUseMenu(state.view)) state.view = firstAllowedView();
  const views = {
    customers: renderCustomers,
    reports: renderReports,
    alerts: renderAlerts,
    settings: renderSettings,
    api: renderApi
  };
  return `
    <div class="app-shell">
      ${renderSidebar()}
      <div class="main">
        ${renderTopbar()}
        <main class="workspace">${(views[state.view] || renderCustomers)()}</main>
      </div>
      ${renderModal()}
      ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
    </div>
  `;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal.type === "activity") return renderActivityModal();
  if (state.modal.type === "customer") return renderCustomerModal(state.modal.customerId);
  if (state.modal.type === "user") return renderUserModal();
  return "";
}

function renderActivityModal() {
  const customer = state.customers.find(item => item.id === state.modal.customerId);
  if (!customer) return "";
  const selectedType = state.modal.defaultType || "call";
  return `
    <div class="modal-backdrop">
      <form class="modal-card" data-form="activity" data-id="${customer.id}" data-open-phone="${state.modal.openPhone ? "true" : "false"}">
        <div class="modal-head">
          <div><h2>บันทึกกิจกรรม</h2><div class="tiny-label" style="color: var(--muted);">${escapeHtml(customer.company)} · ${escapeHtml(customer.phone || "")}</div></div>
          <button class="icon-only" type="button" data-action="close-modal" title="ปิด">${icons.close}</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="field"><label>กิจกรรม</label><select name="activityType" required>${state.activityTypes.filter(type => !["created", "line"].includes(type.id)).map(type => `<option value="${type.id}" ${selectedType === type.id ? "selected" : ""}>${escapeHtml(type.label)}</option>`).join("")}</select></div>
            <div class="field"><label>รายละเอียดกิจกรรม</label><input name="reason" value="${escapeHtml(activityById(selectedType).label)}" required></div>
            <div class="field"><label>บันทึกกิจกรรมล่าสุด</label><textarea name="note" required>${escapeHtml(customer.note || "ติดตามโปรเจค")}</textarea></div>
            <div class="form-grid two">
              ${field("followUpDate", "นัดติดตามครั้งถัดไป", customer.followUpDate, false, "date")}
              ${field("lostToCompetitor", "ซื้อกับเจ้าอื่น / คู่แข่ง (ถ้ามี)", customer.lostToCompetitor || "")}
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn" type="button" data-action="close-modal">ยกเลิก</button>
          <button class="btn primary" type="submit">${icons.save} บันทึก</button>
        </div>
      </form>
    </div>
  `;
}

function renderCustomerModal(customerId) {
  const customer = state.customers.find(item => item.id === customerId) || {};
  const isEdit = Boolean(customer.id);
  return `
    <div class="modal-backdrop">
      <form class="modal-card" data-form="customer" data-id="${customer.id || ""}">
        <div class="modal-head">
          <h2>${isEdit ? "แก้ไขลูกค้า" : "เพิ่มลูกค้า"}</h2>
          <button class="icon-only" type="button" data-action="close-modal" title="ปิด">${icons.close}</button>
        </div>
        <div class="modal-body">
          <div class="form-grid two">
            ${field("company", "ชื่อบริษัท", customer.company, true)}
            ${field("contact", "ชื่อผู้ติดต่อ", customer.contact, true)}
            ${field("phone", "เบอร์โทร", customer.phone)}
            ${field("email", "อีเมลล์", customer.email)}
            ${field("line", "Line", customer.line)}
            ${field("followUpDate", "นัดติดตาม", customer.followUpDate, false, "date")}
            <div class="field"><label>หมวดหมู่ลูกค้า</label><select name="categoryId">${state.customerCategories.map(category => `<option value="${category.id}" ${customer.categoryId === category.id ? "selected" : ""}>${escapeHtml(category.name)}</option>`).join("")}</select></div>
            <div class="field"><label>สถานะ</label><select name="status">${["ใหม่", "กำลังติดตาม", "นัดติดตาม", "เสนอราคา", "ต่อรองราคา", "รอเอกสาร", "ปิดการขาย", "ดูแลหลังการขาย", "ปิดไม่ได้"].map(status => `<option ${customer.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></div>
            <div class="field"><label>แหล่งที่มา</label><select name="source">${sourceOptions().map(source => `<option value="${escapeHtml(source)}" ${customer.source === source ? "selected" : ""}>${escapeHtml(source)}</option>`).join("")}</select></div>
            <div class="field"><label>ผู้ดูแลลูกค้า</label><select name="ownerId">${state.users.map(user => `<option value="${user.id}" ${(customer.ownerId || state.user?.id) === user.id ? "selected" : ""}>${escapeHtml(user.name)}</option>`).join("")}</select></div>
          </div>
          <div class="field" style="margin-top: 11px;"><label>บันทึกกิจกรรมล่าสุด</label><textarea name="latestActivityNote">${escapeHtml(customer.note || "")}</textarea></div>
        </div>
        <div class="modal-actions">
          <button class="btn" type="button" data-action="close-modal">ยกเลิก</button>
          <button class="btn primary" type="submit">${icons.save} บันทึก</button>
        </div>
      </form>
    </div>
  `;
}

function renderUserModal() {
  const user = state.users.find(item => item.id === state.modal.userId) || {};
  const isEdit = Boolean(user.id);
  const isSelf = Boolean(user.id && user.id === state.user?.id);
  const roleOptions = state.roles.length ? state.roles : [{ id: "Sale", name: "Sale" }, { id: "Manager", name: "Manager" }, { id: "Executive", name: "ผู้บริหาร" }];
  return `
    <div class="modal-backdrop">
      <form class="modal-card" data-form="user" data-id="${user.id || ""}">
        <div class="modal-head"><h2>${isEdit ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}</h2><button class="icon-only" type="button" data-action="close-modal" title="ปิด">${icons.close}</button></div>
        <div class="modal-body">
          <div class="form-grid two">
            ${field("name", "ชื่อ", user.name || "", true)}
            ${field("username", "Username", user.username || "", true)}
            ${field("email", "Email", user.email || "")}
            ${field("password", isEdit ? "Password ใหม่ (เว้นว่างถ้าไม่เปลี่ยน)" : "Password", isEdit ? "" : "Nexcrm1234!", !isEdit, "password")}
            <div class="field"><label>Role</label><select name="role" ${isSelf ? "disabled" : ""}>${roleOptions.map(role => `<option value="${escapeHtml(role.id)}" ${(user.role || "Sale") === role.id || (user.role || "Sale") === role.name ? "selected" : ""}>${escapeHtml(role.name)}</option>`).join("")}</select></div>
            <div class="field"><label>สถานะ</label><select name="active" ${isSelf ? "disabled" : ""}><option value="true" ${user.active !== false ? "selected" : ""}>ใช้งาน</option><option value="false" ${user.active === false ? "selected" : ""}>ปิดใช้งาน</option></select></div>
          </div>
        </div>
        <div class="modal-actions"><button class="btn" type="button" data-action="close-modal">ยกเลิก</button><button class="btn primary" type="submit">${icons.save} บันทึก</button></div>
      </form>
    </div>
  `;
}

function field(name, label, value = "", required = false, type = "text") {
  return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${escapeHtml(value ?? "")}" ${required ? "required" : ""}></div>`;
}

function render() {
  if (!state.token || !state.user) {
    renderLogin();
    return;
  }
  app.innerHTML = renderWorkspace();
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function handleLogin(form) {
  const result = await api("/api/login", { method: "POST", body: JSON.stringify(formData(form)) });
  state.token = result.token;
  state.user = result.user;
  localStorage.setItem("nexcrm.token", result.token);
  await loadBootstrap();
  setToast("เข้าสู่ระบบแล้ว");
  render();
}

async function saveActivity(form) {
  const customerId = form.dataset.id;
  const customer = state.customers.find(item => item.id === customerId);
  const data = formData(form);
  const result = await api(`/api/customers/${customerId}/activities`, { method: "POST", body: JSON.stringify(data) });
  state.customers = state.customers.map(item => item.id === customerId ? result.customer : item);
  state.activities.unshift(result.activity);
  state.modal = null;
  render();
  if (form.dataset.openPhone === "true" && data.activityType === "call") {
    setToast("บันทึกการโทรแล้ว กำลังเปิดหน้าการโทร");
    setTimeout(() => { window.location.href = `tel:${customer.phone}`; }, 350);
  } else {
    setToast("บันทึกกิจกรรมแล้ว");
  }
}

async function saveCustomer(form) {
  const data = formData(form);
  const customerId = form.dataset.id;
  const result = await api(customerId ? `/api/customers/${customerId}` : "/api/customers", {
    method: customerId ? "PUT" : "POST",
    body: JSON.stringify(data)
  });
  if (customerId) state.customers = state.customers.map(item => item.id === customerId ? result.customer : item);
  else {
    state.customers.unshift(result.customer);
    state.selectedId = result.customer.id;
  }
  state.modal = null;
  await loadBootstrap();
  setToast("บันทึกลูกค้าแล้ว");
  render();
}

async function saveUser(form) {
  const userId = form.dataset.id;
  const result = await api(userId ? `/api/users/${userId}` : "/api/users", {
    method: userId ? "PUT" : "POST",
    body: JSON.stringify(formData(form))
  });
  if (userId) {
    state.users = state.users.map(user => user.id === userId ? result.user : user);
    if (state.user?.id === userId) state.user = result.user;
  } else {
    state.users.push(result.user);
  }
  state.modal = null;
  setToast(userId ? "แก้ไขผู้ใช้แล้ว" : "เพิ่มผู้ใช้แล้ว");
  render();
}

async function deleteUser(id) {
  if (!window.confirm("ต้องการลบผู้ใช้นี้หรือไม่? ระบบจะปิดการใช้งานเพื่อไม่ให้ประวัติลูกค้าหาย")) return;
  const result = await api(`/api/users/${id}`, { method: "DELETE" });
  state.users = state.users.map(user => user.id === id ? result.user : user);
  setToast("ลบ/ปิดใช้งานผู้ใช้แล้ว");
  render();
}

async function saveCategory(form) {
  const result = await api("/api/customer-categories", { method: "POST", body: JSON.stringify(formData(form)) });
  state.customerCategories.push(result.category);
  state.modal = null;
  setToast("เพิ่มหมวดหมู่แล้ว");
  render();
}

async function saveSource(form) {
  const result = await api("/api/sources", { method: "POST", body: JSON.stringify(formData(form)) });
  state.sources = result.sources || [...state.sources, result.source];
  setToast("เพิ่มแหล่งที่มาแล้ว");
  render();
}

async function deleteSource(source) {
  if (!window.confirm(`ต้องการลบแหล่งที่มา "${source}" หรือไม่?`)) return;
  const result = await api(`/api/sources/${encodeURIComponent(source)}`, { method: "DELETE" });
  state.sources = result.sources || state.sources.filter(item => item !== source);
  setToast("ลบแหล่งที่มาแล้ว");
  render();
}

async function saveRoles() {
  const roles = state.roles
    .filter(role => role.id !== "Superadmin")
    .map(role => ({
      id: role.id,
      customerScope: document.querySelector(`[data-role-customer-scope="${role.id}"]`)?.value || role.customerScope,
      alertScope: document.querySelector(`[data-role-alert-scope="${role.id}"]`)?.value || role.alertScope,
      menus: [...document.querySelectorAll(`[data-role-menu="${role.id}"]:checked`)].map(input => input.value)
    }));
  const result = await api("/api/roles", { method: "PUT", body: JSON.stringify({ roles }) });
  state.roles = result.roles;
  await loadBootstrap();
  setToast("บันทึกสิทธิ์ Role แล้ว");
  render();
}

async function saveSettings() {
  const form = document.querySelector('[data-form="settings"]');
  if (!form) return;
  const data = formData(form);
  ["notifyBeforeDays", "newCustomerDays", "oldCustomerDays", "closedLostCallLimit", "closedLostDayLimit"].forEach(key => {
    data[key] = Number(data[key] || 0);
  });
  data.notifyDailyDigest = data.notifyDailyDigest === "true";
  const result = await api("/api/settings", { method: "PUT", body: JSON.stringify(data) });
  state.settings = result.settings;
  setToast("บันทึกการตั้งค่าแล้ว");
  render();
}

async function importLine() {
  const result = await api("/api/customers/import-line", { method: "POST", body: JSON.stringify({}) });
  state.customers.unshift(result.customer);
  state.selectedId = result.customer.id;
  state.view = "customers";
  setToast("ดึงข้อมูลจาก LineOA แล้ว");
  render();
}

async function resolveAlert(id) {
  const result = await api(`/api/alerts/${id}/resolve`, { method: "POST", body: "{}" });
  state.alerts = state.alerts.map(alert => alert.id === id ? result.alert : alert);
  setToast("ปิดแจ้งเตือนแล้ว");
  render();
}

function copyText(value) {
  navigator.clipboard?.writeText(value).then(() => setToast("คัดลอกแล้ว"));
}

app.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target.closest("form");
  if (!form) return;
  const runners = {
    login: handleLogin,
    activity: saveActivity,
    customer: saveCustomer,
    user: saveUser,
    category: saveCategory,
    source: saveSource
  };
  const runner = runners[form.dataset.form];
  if (runner) runner(form).catch(error => setToast(error.message));
});

app.addEventListener("input", event => {
  if (event.target.matches("[data-search]")) {
    state.query = event.target.value;
    const caret = event.target.selectionStart || state.query.length;
    render();
    const search = document.querySelector("[data-search]");
    if (search) {
      search.focus();
      search.setSelectionRange(caret, caret);
    }
  }
});

app.addEventListener("click", event => {
  const actionEl = event.target.closest("[data-action]");
  const viewEl = event.target.closest("[data-view]");
  const filterEl = event.target.closest("[data-filter]");
  const categoryFilterEl = event.target.closest("[data-category-filter]");
  const rangeEl = event.target.closest("[data-report-range]");
  const bucketEl = event.target.closest("[data-report-bucket]");
  const settingsTabEl = event.target.closest("[data-settings-tab]");
  const selectEl = event.target.closest("[data-select-customer]");

  if (viewEl) {
    state.view = viewEl.dataset.view;
    state.sidebarOpen = false;
    state.filterMenuOpen = false;
    state.categoryMenuOpen = false;
    render();
    return;
  }
  if (filterEl) {
    state.filter = filterEl.dataset.filter;
    state.filterMenuOpen = false;
    state.categoryMenuOpen = false;
    render();
    return;
  }
  if (categoryFilterEl) {
    state.categoryFilter = categoryFilterEl.dataset.categoryFilter;
    state.categoryMenuOpen = false;
    state.filterMenuOpen = false;
    render();
    return;
  }
  if (rangeEl) {
    state.reportRange = Number(rangeEl.dataset.reportRange);
    render();
    return;
  }
  if (bucketEl) {
    state.reportBucket = bucketEl.dataset.reportBucket;
    render();
    return;
  }
  if (settingsTabEl) {
    state.settingsTab = settingsTabEl.dataset.settingsTab;
    render();
    return;
  }
  if (selectEl && !actionEl) {
    state.selectedId = selectEl.dataset.selectCustomer;
    render();
    return;
  }
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;
  if (action === "toggle-sidebar") state.sidebarOpen = !state.sidebarOpen;
  if (action === "toggle-category-menu") {
    state.categoryMenuOpen = !state.categoryMenuOpen;
    state.filterMenuOpen = false;
    render();
    return;
  }
  if (action === "toggle-filter-menu") {
    state.filterMenuOpen = !state.filterMenuOpen;
    state.categoryMenuOpen = false;
    render();
    return;
  }
  if (action === "logout") {
    localStorage.removeItem("nexcrm.token");
    state.token = "";
    state.user = null;
  }
  if (action === "call") state.modal = { type: "activity", customerId: id, defaultType: "call", openPhone: true };
  if (action === "open-activity") state.modal = { type: "activity", customerId: id, defaultType: "visit", openPhone: false };
  if (action === "open-customer") state.modal = { type: "customer" };
  if (action === "edit-customer") state.modal = { type: "customer", customerId: id };
  if (action === "open-user") state.modal = { type: "user" };
  if (action === "edit-user") state.modal = { type: "user", userId: id };
  if (action === "close-modal") state.modal = null;
  if (action === "save-settings") saveSettings().catch(error => setToast(error.message));
  if (action === "save-roles") saveRoles().catch(error => setToast(error.message));
  if (action === "import-line") importLine().catch(error => setToast(error.message));
  if (action === "resolve-alert") resolveAlert(id).catch(error => setToast(error.message));
  if (action === "delete-user") deleteUser(id).catch(error => setToast(error.message));
  if (action === "delete-source") deleteSource(actionEl.dataset.source || "").catch(error => setToast(error.message));
  if (action === "copy") copyText(actionEl.dataset.copy || "");
  render();
});

(async function init() {
  if (!state.token) {
    renderLogin();
    return;
  }
  try {
    await loadBootstrap();
  } catch {
    localStorage.removeItem("nexcrm.token");
    state.token = "";
    state.user = null;
  }
  render();
})();

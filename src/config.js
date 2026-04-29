export const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ico": "image/x-icon"
};

export const DEFAULT_CATEGORIES = [
  { id: "cat_general", name: "ทั่วไป", color: "#277c75" },
  { id: "cat_key", name: "Key Account", color: "#3d6f92" },
  { id: "cat_project", name: "โปรเจค", color: "#c9842d" },
  { id: "cat_vip", name: "VIP", color: "#b9574d" }
];

export const ACTIVITY_TYPES = [
  { id: "call", label: "โทรติดตาม", status: "กำลังติดตาม" },
  { id: "visit", label: "ไปพบลูกค้า", status: "นัดติดตาม" },
  { id: "site_visit", label: "ไปเยี่ยมลูกค้า", status: "นัดติดตาม" },
  { id: "demo", label: "Demo / นำเสนอระบบ", status: "กำลังติดตาม" },
  { id: "quote", label: "เสนอราคา", status: "เสนอราคา" },
  { id: "negotiate", label: "ต่อรองราคา", status: "ต่อรองราคา" },
  { id: "document", label: "ส่งเอกสาร / สัญญา", status: "รอเอกสาร" },
  { id: "payment", label: "รับชำระเงิน / มีการซื้อขาย", status: "ปิดการขาย", marksPurchase: true },
  { id: "won", label: "ปิดการขาย", status: "ปิดการขาย", marksPurchase: true },
  { id: "after_sale", label: "ติดตามหลังการขาย", status: "ดูแลหลังการขาย" },
  { id: "lost", label: "ปิดไม่ได้", status: "ปิดไม่ได้", marksLost: true },
  { id: "line", label: "นำเข้าจาก LineOA", status: "ใหม่" },
  { id: "created", label: "สร้างลูกค้าใหม่", status: "ใหม่" }
];

export const MENU_KEYS = ["customers", "alerts", "reports", "settings", "api"];
export const DEFAULT_SOURCES = ["Manual", "LineOA", "API"];

export const DEFAULT_ROLES = [
  {
    id: "Sale",
    name: "Sale",
    customerScope: "own",
    alertScope: "own",
    menus: ["customers", "alerts"]
  },
  {
    id: "Manager",
    name: "Manager",
    customerScope: "all",
    alertScope: "all",
    menus: ["customers", "alerts", "reports", "settings"]
  },
  {
    id: "Executive",
    name: "ผู้บริหาร",
    customerScope: "all",
    alertScope: "all",
    menus: MENU_KEYS
  },
  {
    id: "Superadmin",
    name: "Superadmin",
    customerScope: "all",
    alertScope: "all",
    menus: MENU_KEYS,
    locked: true
  }
];

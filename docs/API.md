# NexCrm API

Base URL:

```text
http://localhost:3000
```

บน Vercel ให้เปลี่ยนเป็น URL ของ deployment

## Database

ระบบใช้ PostgreSQL เมื่อมี environment variable:

```text
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
```

ตารางเริ่มต้นอยู่ที่ `db/schema.sql` และระบบจะสร้างให้อัตโนมัติเมื่อ API ถูกเรียกครั้งแรก

## Auth

Login เพื่อรับ token:

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "username": "Superadmin",
  "password": "Superadmin1234!"
}
```

ใช้ token:

```http
Authorization: Bearer <token>
```

## Bootstrap

```http
GET /api/bootstrap
Authorization: Bearer <token>
```

คืนค่าข้อมูลเริ่มต้น เช่น user, customers, settings, roles, sources, activities, alerts

## Customers

สร้างลูกค้า:

```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "company": "Example Co., Ltd.",
  "contact": "คุณตัวอย่าง",
  "phone": "0812345678",
  "email": "hello@example.com",
  "line": "@example",
  "source": "Manual",
  "categoryId": "cat_general",
  "latestActivityNote": "ติดตามโปรเจคใหม่"
}
```

แก้ไขลูกค้า:

```http
PUT /api/customers/:id
Authorization: Bearer <token>
Content-Type: application/json
```

## Activities

บันทึกกิจกรรม:

```http
POST /api/customers/:id/activities
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "activityType": "quote",
  "reason": "เสนอราคา",
  "note": "ส่งใบเสนอราคาแล้ว",
  "followUpDate": "2026-05-15"
}
```

ค่าที่รองรับใน `activityType` เช่น `call`, `visit`, `site_visit`, `demo`, `quote`, `negotiate`, `document`, `payment`, `won`, `after_sale`, `lost`

## LineOA Webhook

```http
POST /api/webhook/line
x-api-key: <apiToken>
Content-Type: application/json
```

```json
{
  "profile": {
    "displayName": "Line Customer",
    "userId": "Uxxxx",
    "company": "Line Prospect",
    "phone": "0800000000",
    "email": "line@example.com",
    "line": "@line.prospect"
  },
  "message": "สนใจสินค้า"
}
```

## Settings

ตั้งค่าระบบ:

```http
PUT /api/settings
Authorization: Bearer <token>
Content-Type: application/json
```

ต้องใช้ role ที่มีสิทธิ์เมนู `ตั้งค่า`

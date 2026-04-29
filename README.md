# NexCrm

NexCrm เป็นเว็บแอป CRM ขนาดเล็กสำหรับบันทึกข้อมูลลูกค้า ติดตามกิจกรรม Sale โทร/Line/Email และดูรายงานลูกค้าใหม่ ลูกค้าเก่า และปิดไม่ได้

## ฟีเจอร์หลัก

- Login ด้วย username/password
- จัดการข้อมูลลูกค้า หมวดหมู่ลูกค้า แหล่งที่มา และผู้ดูแลลูกค้า
- บันทึกกิจกรรม เช่น โทรติดตาม ไปพบลูกค้า เสนอราคา ต่อรองราคา ปิดการขาย และปิดไม่ได้
- แจ้งเตือนงานติดตามลูกค้า
- รายงานจำนวนลูกค้าที่เข้ามา ลูกค้าใหม่ ลูกค้าเก่า และปิดไม่ได้ พร้อมกราฟเปรียบเทียบ
- ตั้งค่า Role: Sale, Manager, ผู้บริหาร, Superadmin
- API สำหรับสร้าง/อัปเดตลูกค้า และรับข้อมูลจาก LineOA webhook

## โครงสร้างไฟล์

```text
api/[...path].js        Vercel serverless API entry
public/                Frontend static files
src/config.js          ค่าตั้งต้นของระบบ เช่น Role, Activity, Category
src/http.js            ตัวช่วยรับ/ส่ง HTTP JSON
src/rbac.js            สิทธิ์การเห็นเมนู ลูกค้า และแจ้งเตือน
src/security.js        password hash และ id generator
src/time.js            time helper
server.js              local server และ API routing หลัก
```

## ใช้งานบนเครื่อง

```bash
npm start
```

เปิด `http://localhost:3000`

ค่าเริ่มต้น:

```text
Username: Superadmin
Password: Superadmin1234!
```

## PostgreSQL

ตั้งค่า environment variable:

```text
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
```

เมื่อมี `DATABASE_URL` ระบบจะใช้ PostgreSQL อัตโนมัติ โดยสร้างตาราง `nexcrm_state` ตาม `db/schema.sql`

ถ้าไม่มี `DATABASE_URL` ระบบจะ fallback เป็นไฟล์ `data/db.json` สำหรับ Localhost

## Deploy บน Vercel

โปรเจกต์นี้มี `api/[...path].js` สำหรับ Vercel serverless และ `public/` สำหรับ static frontend แล้ว สามารถ deploy ได้ทันทีผ่าน Vercel

ต้องตั้งค่า `DATABASE_URL` ใน Vercel Project Environment Variables เพื่อใช้ PostgreSQL ถาวร เช่น Vercel Postgres, Supabase หรือ Neon

## ตรวจโค้ด

```bash
npm run check
```

# NexCrm Proposal

## วัตถุประสงค์

พัฒนาเว็บแอป CRM ขนาดเล็ก ใช้งานเร็ว ดูแลง่าย และเหมาะสำหรับทีม Sale ที่ต้องการเก็บข้อมูลลูกค้า ติดตามกิจกรรม และสรุปรายงานในที่เดียว

## ขอบเขตระบบ

- ระบบ Login และจัดการผู้ใช้
- จัดการลูกค้า หมวดหมู่ลูกค้า และแหล่งที่มา
- บันทึกกิจกรรมการขาย เช่น โทร ไปพบลูกค้า เสนอราคา ต่อรองราคา ปิดการขาย และปิดไม่ได้
- เชื่อมต่อ LineOA webhook สำหรับนำข้อมูลลูกค้าเข้าระบบ
- เปิดการติดต่อผ่าน Line, tel link และ Email provider
- แจ้งเตือนงานติดตาม
- รายงานลูกค้าใหม่ ลูกค้าเก่า ลูกค้าที่เข้ามา และปิดไม่ได้
- Role-based access control สำหรับ Sale, Manager, ผู้บริหาร และ Superadmin

## สิทธิ์ผู้ใช้งาน

- Sale: เห็นเฉพาะลูกค้าของตัวเอง และแจ้งเตือนของตัวเอง
- Manager: เห็นลูกค้าทั้งหมด เห็นแจ้งเตือนทุกคน และดูรายงาน/ตั้งค่าได้ตามที่กำหนด
- ผู้บริหาร: เห็นข้อมูลทั้งหมด รวมถึงรายงานและ API
- Superadmin: สิทธิ์สูงสุดสำหรับดูแลระบบ

## แนวทางเทคนิค

- Frontend: HTML, CSS, JavaScript แบบ lean code ไม่มี framework หนัก
- Backend: Node.js HTTP server และ Vercel serverless API entry
- Storage:
  - Production/Vercel: PostgreSQL ผ่าน `DATABASE_URL`
  - MVP schema: ตาราง `nexcrm_state` เก็บข้อมูลเป็น `jsonb` เพื่อให้ระบบเล็กและ deploy ได้เร็ว
  - Localhost: ถ้าไม่มี `DATABASE_URL` จะใช้ไฟล์ `data/db.json` เป็น fallback

## งานต่อยอดที่แนะนำ

- แยก PostgreSQL เป็นตาราง relational เต็มรูปแบบเมื่อจำนวนข้อมูลและ report โตขึ้น
- เพิ่ม audit log สำหรับการแก้ไขข้อมูลสำคัญ
- เพิ่ม export รายงานเป็น CSV/XLSX
- เพิ่ม OAuth/SSO หรือเชื่อมต่อระบบผู้ใช้จริงขององค์กร
- เพิ่ม webhook signature verification สำหรับ LineOA

CREATE TABLE IF NOT EXISTS roles (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  customer_scope text NOT NULL DEFAULT 'own' CHECK (customer_scope IN ('own', 'all')),
  alert_scope text NOT NULL DEFAULT 'own' CHECK (alert_scope IN ('own', 'all')),
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_menus (
  role_id text NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  menu_key text NOT NULL CHECK (menu_key IN ('customers', 'alerts', 'reports', 'settings', 'api')),
  PRIMARY KEY (role_id, menu_key)
);

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role_id text NOT NULL REFERENCES roles(id),
  email text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS customer_categories (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  color text NOT NULL DEFAULT '#277c75',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS sources (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  company text NOT NULL,
  contact text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  line_handle text NOT NULL DEFAULT '',
  line_user_id text UNIQUE,
  category_id text REFERENCES customer_categories(id) ON DELETE SET NULL,
  owner_id text REFERENCES users(id) ON DELETE SET NULL,
  source_id text REFERENCES sources(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'ใหม่',
  note text NOT NULL DEFAULT '',
  follow_up_date date,
  call_count integer NOT NULL DEFAULT 0 CHECK (call_count >= 0),
  has_purchase boolean NOT NULL DEFAULT false,
  purchased_at timestamptz,
  closed_lost_at timestamptz,
  close_lost_reason text NOT NULL DEFAULT '',
  lost_to_competitor text NOT NULL DEFAULT '',
  last_contact_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS activities (
  id text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  title text NOT NULL,
  reason text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  count integer NOT NULL DEFAULT 1 CHECK (count >= 0),
  created_by text REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id text PRIMARY KEY,
  customer_id text REFERENCES customers(id) ON DELETE CASCADE,
  user_id text REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'danger', 'success')),
  resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_tokens (
  id text PRIMARY KEY,
  name text NOT NULL,
  token_hash text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  actor_user_id text REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_customers_owner_id ON customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_category_id ON customers(category_id);
CREATE INDEX IF NOT EXISTS idx_customers_source_id ON customers(source_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_follow_up_date ON customers(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers(deleted_at);
CREATE INDEX IF NOT EXISTS idx_activities_customer_id ON activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_customer_id ON alerts(customer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

INSERT INTO roles (id, name, customer_scope, alert_scope, locked)
VALUES
  ('Sale', 'Sale', 'own', 'own', false),
  ('Manager', 'Manager', 'all', 'all', false),
  ('Executive', 'ผู้บริหาร', 'all', 'all', false),
  ('Superadmin', 'Superadmin', 'all', 'all', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO role_menus (role_id, menu_key)
VALUES
  ('Sale', 'customers'),
  ('Sale', 'alerts'),
  ('Manager', 'customers'),
  ('Manager', 'alerts'),
  ('Manager', 'reports'),
  ('Manager', 'settings'),
  ('Executive', 'customers'),
  ('Executive', 'alerts'),
  ('Executive', 'reports'),
  ('Executive', 'settings'),
  ('Executive', 'api'),
  ('Superadmin', 'customers'),
  ('Superadmin', 'alerts'),
  ('Superadmin', 'reports'),
  ('Superadmin', 'settings'),
  ('Superadmin', 'api')
ON CONFLICT (role_id, menu_key) DO NOTHING;

INSERT INTO customer_categories (id, name, color, sort_order)
VALUES
  ('cat_general', 'ทั่วไป', '#277c75', 10),
  ('cat_key', 'Key Account', '#3d6f92', 20),
  ('cat_project', 'โปรเจค', '#c9842d', 30),
  ('cat_vip', 'VIP', '#b9574d', 40)
ON CONFLICT (id) DO NOTHING;

INSERT INTO sources (id, name, locked)
VALUES
  ('src_manual', 'Manual', true),
  ('src_lineoa', 'LineOA', true),
  ('src_api', 'API', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, username, password_hash, role_id, email, active)
VALUES
  ('usr_superadmin', 'Super Admin', 'Superadmin', '1bf2f85487b184cfc956366204e4f45a49f1effa18c9bb67d32abc66784fb7dd', 'Superadmin', 'admin@nexcrm.local', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO settings (key, value)
VALUES
  ('system', '{
    "companyName": "NexCrm",
    "companyPhone": "",
    "companyEmail": "",
    "lineMode": "lineapp",
    "lineOaId": "@nexcrm",
    "emailProvider": "gmail",
    "notifyBeforeDays": 1,
    "notifyDailyDigest": true,
    "newCustomerDays": 30,
    "oldCustomerDays": 90,
    "closedLostCallLimit": 6,
    "closedLostDayLimit": 45,
    "defaultOwnerId": "usr_superadmin"
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

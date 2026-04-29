CREATE TABLE IF NOT EXISTS nexcrm_state (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE nexcrm_state IS 'NexCrm MVP state store. Stores app data as jsonb for lean deployment; can be normalized into relational CRM tables later.';

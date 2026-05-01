# NexCRM Database

## Migration Command

Set `DATABASE_URL`, then run:

```bash
npm run db:migrate
```

The migration runner:

- Creates `schema_migrations`
- Runs pending SQL files in `db/migrations`
- Wraps each migration in a transaction
- Skips migrations already applied

## Runtime Behavior

When `DATABASE_URL` is configured, NexCRM reads and writes the normalized PostgreSQL tables listed below. When `DATABASE_URL` is not configured, the app falls back to the local JSON file store for development.

The old `nexcrm_state` JSONB table is only used as a one-time import source. If that table exists and the relational `customers` table is empty, the app imports the legacy state into the relational schema. After that, writes go to the normalized tables.

## Main Tables

- `roles`
- `role_menus`
- `users`
- `customer_categories`
- `sources`
- `customers`
- `activities`
- `alerts`
- `settings`
- `api_tokens`
- `audit_logs`

## Relationship Summary

```text
roles 1--N users
roles 1--N role_menus
users 1--N customers
customer_categories 1--N customers
sources 1--N customers
customers 1--N activities
customers 1--N alerts
users 1--N alerts
users 1--N audit_logs
```

## Design Notes

- IDs remain `text` for compatibility with the current app IDs such as `usr_*`, `cus_*`, and `act_*`.
- Customer delete should be soft delete through `deleted_at`.
- User delete should also be soft delete through `deleted_at` and `active = false`.
- Activities are append-only CRM history.
- `audit_logs` is reserved for important data changes.
- `settings.value` uses `jsonb` because system settings change often and are low volume.
- `api_tokens.token_hash` stores only a hash, never raw API tokens.
- The current compatibility repository writes a full normalized app snapshot inside one transaction. This keeps the existing API behavior stable, but high-concurrency production workloads should move to endpoint-specific insert/update queries later.

Do not drop the old `nexcrm_state` table until the production migration has been verified and backed up.

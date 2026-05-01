# Vercel Deployment

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables before production use:

```text
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
NEXCRM_SESSION_SECRET=<long-random-secret>
```

Optional:

```text
PG_POOL_MAX=3
PGSSLMODE=disable
```

Use `PGSSLMODE=disable` only for local or trusted non-SSL PostgreSQL connections. Hosted providers such as Vercel Postgres, Neon, and Supabase should normally use SSL.

## Build Settings

Recommended Vercel settings:

```text
Framework Preset: Other
Install Command: npm install
Build Command: npm run build
Output Directory: public
```

The `npm run build` command runs syntax checks for the server, API entrypoints, and frontend script.

## Routing

`vercel.json` routes API requests through `api/router.js`:

```text
/api/:path* -> /api/router?path=:path*
```

Static frontend files are served from `public/`.

## Data Safety

Do not deploy with file storage for real production data. If `DATABASE_URL` is missing, the app falls back to local JSON storage. On Vercel this storage is temporary and can be lost.

## Pre-Deploy Checklist

- Run `npm run build`.
- Run `npm run db:migrate` after setting `DATABASE_URL`.
- Confirm `DATABASE_URL` is configured in Vercel.
- Confirm `NEXCRM_SESSION_SECRET` is configured in Vercel.
- Do not upload `.env`, `.vercel`, `node_modules`, or `data/db.json`.
- After deployment, open `/api/health` and confirm it returns `{ "ok": true }`.

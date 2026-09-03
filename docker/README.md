# Local offline stack

Everything needed to run the site with **no cloud dependencies** — a local Postgres in
place of Neon, and MinIO (S3-compatible) in place of Vercel Blob.

| Service | Host address | Purpose | Credentials |
| --- | --- | --- | --- |
| `postgres` | `localhost:5432` | app database (`ieee-website`) | `postgres` / `postgres` |
| `minio` (S3 API) | `localhost:9000` | media storage | `minioadmin` / `minioadmin` |
| `minio` (console) | `localhost:9001` | browse objects in a UI | `minioadmin` / `minioadmin` |
| `minio-init` | — | one-shot: creates the `media-public` + `resumes-private` buckets | — |

Container data lives in `docker/data/postgres` and `docker/data/minio` (bind mounts,
git-ignored).

## Start

```bash
cd docker
docker compose up -d
```

Then point the app at it — in the repo root `.env.local` (see `.env.example`):

```
DB_PROVIDER=local
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/ieee-website
POSTGRES_URL=postgres://postgres:postgres@127.0.0.1:5432/ieee-website

STORAGE_PROVIDER=local
NEXT_PUBLIC_STORAGE_PROVIDER=local
S3_ENDPOINT=http://127.0.0.1:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET_PUBLIC=media-public
S3_BUCKET_PRIVATE=resumes-private
S3_PUBLIC_BASE_URL=http://localhost:9000/media-public
```

## Create / update the schema

`src/lib/database/schema.ts` is the single source of truth. `drizzle.config.ts` (repo
root) loads `.env.local` automatically, so no inline `DATABASE_URL` is needed.

```bash
pnpm db:migrate     # apply committed migrations from drizzle/  (use this on a fresh DB)
pnpm db:generate    # after editing schema.ts → writes a new drizzle/NNNN_*.sql
pnpm db:check       # verify migrations are consistent with schema.ts
pnpm db:studio      # browse the DB at https://local.drizzle.studio
pnpm db:push        # sync schema.ts straight to the DB, no migration file (throwaway DBs only)
```

Workflow for a schema change: edit `schema.ts` → `pnpm db:generate` → review the SQL in
`drizzle/` → commit it → `pnpm db:migrate`. Don't use `push` against a database whose
migrations you care about.

## Seed data

Test fixtures live in `src/testing/db/` (`seed.ts` + `data/*.json`). Note some fixtures
are stale vs the current schema; seed the tables you need:

```bash
cd src/testing/db
pnpm dlx tsx seed.ts --seed events,committees \
  postgres://postgres:postgres@127.0.0.1:5432/ieee-website
```

To make yourself an admin after logging in via Discord:

```sql
UPDATE members SET administrator = true, officer_status = true
WHERE user_id = (SELECT id FROM users WHERE email = 'you@example.com');
```

## Browse the database

```bash
pnpm db:studio   # starts a local server; open https://local.drizzle.studio in a browser
```

Drizzle Studio is not a container — `drizzle-kit studio` runs a local process on
`127.0.0.1:4983` that the hosted `local.drizzle.studio` UI connects to. Keep the command
running while you use it. (`docker compose ps` + the MinIO console at `:9001` cover the
container side.)

## Common commands

```bash
docker compose ps                 # status
docker compose logs -f postgres   # tail a service
docker compose stop               # stop, keep data
docker compose down               # remove containers, keep data (bind mount)
docker compose down && rm -rf data  # full reset
docker compose exec postgres psql -U postgres -d ieee-website   # psql shell

# backup / restore the DB
docker compose exec -T postgres pg_dump -U postgres --clean --if-exists ieee-website > backup.sql
docker compose exec -T postgres psql -U postgres -d ieee-website < backup.sql
```

## Notes

- `name: ieee-local` is pinned in the compose file, so container / network names are
  stable no matter which directory you run `docker compose` from.
- Ports 5432 / 9000 / 9001 must be free. Stop any local Postgres or another MinIO first.
- **Use `127.0.0.1`, not `localhost`, for the server-side connection strings.** On Docker
  Desktop for Windows, `localhost` can resolve to IPv6 `::1` and `postgres-js` / the AWS
  SDK then hang until timeout. `S3_PUBLIC_BASE_URL` is browser-facing, so `localhost` is
  fine there.
- MinIO has no local "download" tool needed — the `minio-init` one-shot handles buckets.
- First `docker compose up` after a `down` can take a few seconds for host port
  forwarding to settle; a transient connection refusal right after start is normal.

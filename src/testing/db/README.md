# Database seed tooling

Seed fixtures for the local dev database. **The Postgres / MinIO containers live in
`docker/`** at the repo root — see `docker/README.md`. This folder is only `seed.ts` +
`data/*.json`.

> Some fixtures in `data/*.json` are stale vs the current `src/lib/database/schema.ts`
> (e.g. `members.json` still has an `email` column, `events.json` uses `host_type`). Seed
> only the tables you actually need until the fixtures are refreshed.

## Usage

```bash
# 1. start the stack + create the schema (from the repo root)
cd docker && docker compose up -d && cd ..
pnpm db:migrate

# 2. seed selected tables
pnpm db:seed -- --seed events,committees \
  postgres://postgres:postgres@127.0.0.1:5432/ieee-website
```

`pnpm db:seed` runs `tsx src/testing/db/seed.ts`; everything after `--` is passed through.

### Flags

- `--wipe` — **drops every table** first (then you must re-run `pnpm db:migrate` before
  seeding again). Prefer omitting it.
- `--seed` — seed all tables (default).
- `--seed a,b,c` — seed only the named tables, e.g. `--seed members,events`.

## Making yourself an admin

After logging in through Discord once:

```sql
UPDATE members SET administrator = true, officer_status = true
WHERE user_id = (SELECT id FROM users WHERE email = 'you@example.com');
```

## Viewing the schema / data

`pnpm db:studio` → https://local.drizzle.studio. The current schema is defined entirely by
`src/lib/database/schema.ts`; `drizzle/0000_init.sql` is its generated SQL form.

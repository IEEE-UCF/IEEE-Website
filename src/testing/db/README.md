## Quick DB Setup
```bash
docker compose up --detach
bun seed.ts --wipe <db_url>
drizzle-kit generate --config drizzle.config.ts # (if schema changed)
drizzle-kit migrate --config drizzle.config.ts
bun seed.ts --all <db_url>

```

### Seed Script Flags
- `--wipe`: wipe all tables before seeding
- `--seed`: seed all tables (default)
- `--seed [comma-separated table names]`: seed only specified tables (e.g., `--seed members,events`)


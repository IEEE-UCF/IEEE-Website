# Database Testing

## Quick Start

### Using the Management Script (Recommended)
```bash
# Full setup (start container + push schema + seed data)
./test-db.sh setup

# Or step by step:
./test-db.sh start    # Start container
./test-db.sh seed     # Seed data
./test-db.sh status   # Check status
```

### Manual Setup
```bash
# Start PostgreSQL container
docker compose up -d

# Generate schema migrations (if schema changed)
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed the database with test data
npx tsx seed.ts
```

## Management Script

The `test-db.sh` script provides convenient commands for managing the test database:

```bash
./test-db.sh {start|stop|restart|logs|setup|reset|seed|shell|status}
```

**Commands:**
- `start` - Start the database container
- `stop` - Stop the database container
- `restart` - Restart the database container
- `logs` - Show database logs (follow mode)
- `setup` - Full setup: start + push schema + seed
- `reset` - Reset database: wipe all data + push schema + seed
- `seed` - Seed database with test data
- `shell` - Open PostgreSQL shell
- `status` - Check database container status

## DB Setup (Detailed)
```bash
# Start PostgreSQL in detached mode
docker compose up --detach

# Option 1: Quick setup (recommended)
npx tsx seed.ts

# Option 2: Step-by-step
pnpm db:generate      # Generate migrations (only if schema.ts changed)
pnpm db:push          # Push schema to database
npx tsx seed.ts       # Seed with test data
```

## Seed Script Usage

### Basic Commands
```bash
# Seed all tables with test data (default)
npx tsx seed.ts

# Wipe all tables (clean slate)
npx tsx seed.ts --wipe

# Seed specific tables only
npx tsx seed.ts --seed users,members,events

# Use custom database URL
npx tsx seed.ts --dburl "postgres://user:pass@host:5432/dbname"
```

### Seed Script Flags
- `--wipe`: Drop all tables before seeding (clean database)
- `--seed`: Seed all tables (default behavior)
- `--seed [table1,table2,...]`: Seed only specified tables (comma-separated, no spaces)
- `--dburl [url]`: Use custom database connection string

## Environment Variables
Add to your `.env` file:
```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/ieee-website"
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/ieee-website"
```

## Troubleshooting

### Connection Issues
```bash
# Check if container is running
docker ps

# Check container logs
docker compose logs

# Restart container
docker compose restart
```

### Schema Sync Issues
```bash
# Drop all tables and start fresh
npx tsx seed.ts --wipe
pnpm db:push
npx tsx seed.ts
```

### Port Conflicts
If port 5432 is already in use, modify `docker-compose.yml`:
```yaml
ports:
  - '5433:5432'  # Change left side to available port
```
Then update DATABASE_URL accordingly.

## Schema Documentation

For detailed schema documentation including all tables, relationships, and indexes, see:
- **[SCHEMA.md](../../lib/database/SCHEMA.md)** - Comprehensive schema reference
- **[schema.dbml](../../lib/database/schema.dbml)** - DBML for visual diagram generation at [dbdiagram.io](https://dbdiagram.io)

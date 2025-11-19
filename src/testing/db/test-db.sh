#!/bin/bash

# IEEE Website Test Database Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script's directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo -e "${GREEN}IEEE Test Database Manager${NC}\n"

case "$1" in
    start)
        echo "Starting PostgreSQL container..."
        (cd "$SCRIPT_DIR" && docker compose up -d)
        echo -e "${GREEN}✓ Database container started${NC}"
        ;;
    
    stop)
        echo "Stopping PostgreSQL container..."
        (cd "$SCRIPT_DIR" && docker compose down)
        echo -e "${GREEN}✓ Database container stopped${NC}"
        ;;
    
    restart)
        echo "Restarting PostgreSQL container..."
        (cd "$SCRIPT_DIR" && docker compose restart)
        echo -e "${GREEN}✓ Database container restarted${NC}"
        ;;
    
    logs)
        echo "Showing database logs..."
        (cd "$SCRIPT_DIR" && docker compose logs -f)
        ;;
    
    setup)
        echo "Setting up database..."
        (cd "$SCRIPT_DIR" && docker compose up -d)
        sleep 2
        echo "Pushing schema..."
        (cd "$PROJECT_ROOT" && pnpm db:push)
        echo "Seeding database..."
        (cd "$SCRIPT_DIR" && npx tsx seed.ts)
        echo -e "${GREEN}✓ Database setup complete!${NC}"
        ;;
    
    reset)
        echo -e "${YELLOW}Resetting database (this will delete all data)...${NC}"
        (cd "$SCRIPT_DIR" && npx tsx seed.ts --wipe)
        sleep 1
        (cd "$PROJECT_ROOT" && pnpm db:push)
        (cd "$SCRIPT_DIR" && npx tsx seed.ts)
        echo -e "${GREEN}✓ Database reset complete!${NC}"
        ;;
    
    seed)
        echo "Seeding database..."
        (cd "$SCRIPT_DIR" && npx tsx seed.ts)
        echo -e "${GREEN}✓ Database seeded${NC}"
        ;;
    
    shell)
        echo "Connecting to PostgreSQL shell..."
        docker exec -it db-db-1 psql -U postgres -d ieee-website
        ;;
    
    status)
        echo "Checking database status..."
        docker ps | grep -E "CONTAINER|postgres" || echo -e "${RED}No database container running${NC}"
        ;;
    
    *)
        echo "Usage: $0 {start|stop|restart|logs|setup|reset|seed|shell|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the database container"
        echo "  stop    - Stop the database container"
        echo "  restart - Restart the database container"
        echo "  logs    - Show database logs"
        echo "  setup   - Full setup (start + push schema + seed)"
        echo "  reset   - Reset database (wipe + push + seed)"
        echo "  seed    - Seed database with test data"
        echo "  shell   - Open PostgreSQL shell"
        echo "  status  - Check database container status"
        exit 1
        ;;
esac

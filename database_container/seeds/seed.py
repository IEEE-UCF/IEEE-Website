import os
import psycopg2
import json
import argparse
from dotenv import load_dotenv

# --- Environment and Path Setup ---
project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(dotenv_path=os.path.join(project_root, '.env'))
DATABASE_URL = os.getenv('DATABASE_URL')
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Define the order of seeding to respect foreign key constraints
SEED_ORDER = [
    'members',
    'sponsorships',
    'committees',
    'projects',
    'committee_members',
    'project_members',
    'events',
    'event_attendees',
    'member_permissions'
]

def seed_database(args):
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        print("Clearing all tables...")
        # The order here matters for truncation due to foreign keys
        cur.execute("TRUNCATE TABLE " + ", ".join(SEED_ORDER) + " RESTART IDENTITY CASCADE;")

        if args.clear_only:
            conn.commit()
            print("Database cleared successfully. No new data was seeded.")
            return

        # Determine which tables to seed
        tables_to_seed = []
        if args.all or not any([getattr(args, table) for table in SEED_ORDER if hasattr(args, table)]):
            tables_to_seed = SEED_ORDER
        else:
            for table in SEED_ORDER:
                if hasattr(args, table) and getattr(args, table):
                    tables_to_seed.append(table)
        
        for table_name in tables_to_seed:
            print(f"Seeding {table_name}...")
            file_path = os.path.join(DATA_DIR, f"{table_name}.json")
            
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            if not data:
                print(f"No data found for {table_name}. Skipping.")
                continue

            # Dynamically generate the INSERT statement
            columns = data[0].keys()
            placeholders = '%s, ' * len(columns)
            placeholders = placeholders.strip(', ')
            sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
            
            # Convert list of dicts to list of tuples
            values_to_insert = [tuple(item.values()) for item in data]
            
            cur.executemany(sql, values_to_insert)

        conn.commit()
        print("\nDatabase seeded successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Seed the database with sample data from JSON files.')
    parser.add_argument('--all', action='store_true', help='Seed all tables (default behavior).')
    parser.add_argument('--clear-only', action='store_true', help='Clear all data from tables without seeding.')

    # Add arguments for each table dynamically
    for table in SEED_ORDER:
        parser.add_argument(f'--{table}', action='store_true', help=f'Seed the {table} table.')

    args = parser.parse_args()
    seed_database(args)


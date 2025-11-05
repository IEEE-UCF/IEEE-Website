# ---------------------------------------------------------------------------
# DATABASE SEEDING SCRIPT
# Author: Dawn Balaschak Novemeber 4th 2025
# ---------------------------------------------------------------------------
# This script populates the PostgreSQL database with sample data for development
# and testing purposes. It is designed to be run from the project root.
#
# It performs the following actions:
#   1. Loads database credentials from the .env file in the project root.
#   2. Connects to the PostgreSQL database.
#   3. Clears all existing data from the tables to ensure a clean state.
#   4. Reads sample data from the corresponding JSON files in the ./data/ directory.
#   5. Dynamically builds and executes SQL INSERT statements to populate the tables.
#
# The script can be controlled with command-line flags to seed specific tables
# or to clear the database without seeding new data.
# ---------------------------------------------------------------------------

import os
import psycopg2
import json
import argparse
from dotenv import load_dotenv

# --- Environment and Path Setup ---

# Get the absolute path of the project's root directory.
# The script is in /database_container/seeds/, so we go up two levels.
project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

# Construct the path to the .env file and load it.
# This makes the DATABASE_URL available as an environment variable.
load_dotenv(dotenv_path=os.path.join(project_root, '.env'))

# Fetch the database connection string from the environment.
DATABASE_URL = os.getenv('DATABASE_URL')

# Define the directory where the JSON data files are stored.
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# --- Seeding Configuration ---

# Define the order of table seeding. This is crucial to respect foreign key constraints.
# Tables that are referenced by other tables (like 'members') must be seeded first.
# Join tables (like 'committee_members') must be seeded after the tables they link.
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
    """Connects to the database, clears tables, and inserts new data based on arguments."""
    conn = None
    try:
        # Establish a connection to the PostgreSQL database.
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # --- 1. Clear Existing Data ---
        print("Clearing all tables...")
        # TRUNCATE is used to quickly delete all rows from the specified tables.
        # RESTART IDENTITY resets any auto-incrementing primary key sequences.
        # CASCADE automatically truncates any tables that have foreign-key references
        # to the tables being truncated, ensuring a complete wipe in the correct order.
        cur.execute("TRUNCATE TABLE " + ", ".join(SEED_ORDER) + " RESTART IDENTITY CASCADE;")

        # If the --clear-only flag was passed, commit the truncation and exit.
        if args.clear_only:
            conn.commit()
            print("Database cleared successfully. No new data was seeded.")
            return

        # --- 2. Determine Which Tables to Seed ---
        tables_to_seed = []
        # If --all is specified, or if no specific table flags are given, seed all tables.
        if args.all or not any([getattr(args, table) for table in SEED_ORDER if hasattr(args, table)]):
            tables_to_seed = SEED_ORDER
        else:
            # Otherwise, build a list of tables to seed based on the provided flags.
            for table in SEED_ORDER:
                if hasattr(args, table) and getattr(args, table):
                    tables_to_seed.append(table)
        
        # --- 3. Insert New Data ---
        for table_name in tables_to_seed:
            print(f"Seeding {table_name}...")
            file_path = os.path.join(DATA_DIR, f"{table_name}.json")
            
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            if not data:
                print(f"No data found for {table_name}. Skipping.")
                continue

            # --- Dynamic SQL Generation ---
            # Get the column names from the keys of the first object in the JSON data.
            columns = data[0].keys()
            # Create a string of placeholders (%s) for the values.
            placeholders = '%s, ' * len(columns)
            placeholders = placeholders.strip(', ')
            # Build the final INSERT statement dynamically.
            # This makes the script adaptable; it will work even if columns are added/removed
            # in the JSON files, as long as they match the database schema.
            sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
            
            # psycopg2's executemany function requires a list of tuples, not a list of dicts.
            # This list comprehension converts our data into the required format.
            values_to_insert = [tuple(item.values()) for item in data]
            
            # Execute the INSERT statement for all rows in the data list.
            cur.executemany(sql, values_to_insert)

        # Commit all the changes to the database.
        conn.commit()
        print("\nDatabase seeded successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        # If any error occurs, print it and the transaction will be rolled back implicitly.
        print(f"Error: {error}")
    finally:
        # Ensure the database connection is always closed, whether an error occurred or not.
        if conn is not None:
            conn.close()

# --- Script Entry Point ---
if __name__ == '__main__':
    # This block runs when the script is executed directly from the command line.
    
    # Set up the argument parser to handle command-line flags.
    parser = argparse.ArgumentParser(description='Seed the database with sample data from JSON files.')
    parser.add_argument('--all', action='store_true', help='Seed all tables (default behavior).')
    parser.add_argument('--clear-only', action='store_true', help='Clear all data from tables without seeding.')

    # Dynamically create a flag for each table defined in SEED_ORDER.
    for table in SEED_ORDER:
        parser.add_argument(f'--{table}', action='store_true', help=f'Seed the {table} table.')

    # Parse the arguments provided from the command line.
    args = parser.parse_args()
    
    # Call the main function with the parsed arguments.
    seed_database(args)


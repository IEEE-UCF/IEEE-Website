# Database Schema Maintenance Guide
#### Updated Novemeber 4th 2025, by Dawn Balaschak

This document outlines the required steps to perform whenever a developer makes a change to the database schema in `src/lib/schema.ts`. Following this process ensures that the database, seed data, and documentation all remain consistent.

## Schema Change Workflow

When you modify `src/lib/schema.ts` (e.g., add a column, create a table, change a data type), you must perform the following steps as part of the same task and pull request.

### Step 1: Modify the Schema

Make your desired changes to the Drizzle schema definitions in the `src/lib/schema.ts` file.

### Step 2: Generate a New Migration

Once your schema is updated, you need to generate a new SQL migration file that records this change. This allows the change to be applied to other developers' local databases and to the production database.

Run the following command from the project root:

```bash
pnpm run db:generate
```

This will create a new `.sql` file in the `drizzle/` directory. 

*(Note: A `db:generate` script should be added to `package.json` for the command `drizzle-kit generate` to standardize this process. This has been implemented as of 11/4/2025 and needs testing)* 

### Step 3: Apply Migrations to Your Local Database

To apply the new migration (and any other pending migrations) to your local Docker database, run the `db:push` command:

```bash
pnpm run db:push
```

This will update your local database to reflect the new schema. Make sure your Docker container is running before executing this command.

### Step 4: Update Seed Data

If your schema change affects the structure of the tables, you may need to update the sample data.

1.  **Modify JSON Files**: Go to the `database_container/seeds/data/` directory and update the relevant `.json` files. For example, if you added a new non-nullable column to the `members` table, you must add a value for it to each member object in `members.json`.
2.  **Test the Seed Script**: Run the seed script to confirm that it works with the new schema and data.
    ```bash
    pnpm run db:seed
    ```

### Step 5: Update Documentation

Keeping documentation in sync with the schema is critical for team collaboration.

1.  **Update the Data Dictionary (`DB_SCHEMA_REFERNCE.md`)**: Manually edit `DB_SCHEMA_REFERNCE.md` to reflect your changes. Add new tables, columns, indexes, and relationships as needed.
2.  **Update the Visual Diagram (`DB_diagram.md`)**: Manually edit the DBML code in `DB_diagram.md` so the visual diagram on dbdiagram.io will be accurate.
3.  **Export Updated Diagram (`DB_design.png`)**: After updaing the Visual Diagram code, use a tool to export it for visualization for documentation. Note, it may be possible to export and update the Database Server Directly, but do not do that

### Step 6: Commit All Changes

Ensure that all the files generated and modified in the previous steps are included in your commit. A complete schema change commit should include:

*   `src/lib/schema.ts` (your schema change)
*   The new migration file in the `drizzle/` directory (e.g., `drizzle/0001_... .sql`)
*   Any updated JSON files in `database_container/seeds/data/`
*   The updated `DATABASE.md` file.
*   The updated `DB_diagram.md` file.
*   The updated `DB_design.png` file.

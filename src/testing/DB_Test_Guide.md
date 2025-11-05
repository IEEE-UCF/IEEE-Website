# PostgreSQL Setup and Usage Guide
#### Authored by Dawn Balaschak Novemeber 11th, 2025

This document provides an overview of how to set up and run the PostgreSQL database for local development. This is for testing purposes only, as that the schemas are still under going changes and will need updates. However, there is a need for the ability to work with a adta server for confirmation on services working. This is what this guide is meant to do, give developers the ability to work with updated data tables for development purposes only. There are various other references on the database structure which provide more details into the current database design.

## 1. Docker Setup (Local Database)

To run a local PostgreSQL database, we use Docker and Docker Compose.

1.  **Install Docker Desktop**: Make sure you have Docker Desktop installed and running on your machine.
2.  **Start the Database**: Open a terminal, navigate to the `database_container` directory, and run the following command:
    ```bash
    docker-compose up -d
    ```
    This will start a PostgreSQL container in the background.
    

## 2. Dependencies

The application uses the `postgres` package as the database driver for Drizzle ORM.

*   **Node.js Installation**: If you don't have it installed, run the following command:
    ```bash
    pnpm install postgres
    ```
*   **Python Installation**: For the seeding script, install the dependencies from the `database_container` directory:
    ```bash
    pip install -r requirements.txt
    ```

## 3. Environment Variables

The application requires a `DATABASE_URL` environment variable to connect to the database.

1.  **Create a `.env` file**: In the root of the project, create a file named `.env`.
2.  **Add the `DATABASE_URL`**: Add the following line to your `.env` file for the local Docker database:
    ```
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ieee-website"
    ```

## 4. Database Migrations

We use `drizzle-kit` to manage the database schema. A script is provided in `package.json` to apply schema changes.

*   **Run Migrations**: To create or update the database tables based on the schema defined in `src/lib/schema.ts`, run the following command from the project root:
    ```bash
    pnpm run db:push
    ```

## 5. Database Seeding

The project includes a Python script to seed the database with a comprehensive set of test data. This script can be controlled with command-line flags for granular seeding.

*   **Run the Seed Script**: Use the `db:seed` command from the project root.

*   **Usage Examples**:
    *   **Seed all tables** (default behavior):
        ```bash
        pnpm run db:seed
        ```
    *   **Seed specific tables** (add flags after `--`):
        ```bash
        pnpm run db:seed -- --members --events
        ```
    *   **Clear the database** (without seeding new data):
        ```bash
        pnpm run db:seed -- --clear-only
        ```

*   **Available Flags**:
    *   `--all`
    *   `--members`
    *   `--sponsorships`
    *   `--committees`
    *   `--projects`
    *   `--events`
    *   `--permissions`
    *   `--clear-only`

## 6. Connecting with pgAdmin

You can connect to the local PostgreSQL database using a GUI tool like pgAdmin.

*   **Connection Details**:
    *   **Host**: `localhost`
    *   **Port**: `5432`
    *   **Maintenance Database**: `ieee-website`
    *   **Username**: `postgres`
    *   **Password**: `postgres`


# Database Migrations

This directory contains SQL migration files that are automatically run when the application starts.

## How Migrations Work

1. Migration files are numbered (e.g., `001_add_new_statuses.sql`)
2. When the app starts, it checks which migrations have been run
3. It executes any pending migrations in order
4. Executed migrations are tracked in the `migrations` table

## Creating a New Migration

1. Create a new `.sql` file in this directory
2. Use a numbered prefix (e.g., `002_my_migration.sql`)
3. Write your SQL DDL statements
4. The migration will run automatically on next deployment

## Manual Migration

To run migrations manually:

```bash
npm run migrate
```

## Migration Files

- `001_add_new_statuses.sql` - Adds 'No Response' and 'Applications Closed' status options

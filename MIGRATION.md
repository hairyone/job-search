# Data Migration Guide: Railway to Supabase

This guide explains how to export your data from Railway PostgreSQL and import it into Supabase.

## Prerequisites

- Access to Railway dashboard
- Supabase account created
- PostgreSQL client tools installed (optional, for local export)

## Option 1: Using Railway's pg_dump (Recommended)

### Step 1: Export Data from Railway

1. **Get Railway Database Credentials**
   - Go to your Railway project
   - Click on the PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` (format: `postgresql://user:password@host:port/dbname`)

2. **Run pg_dump to Export**
   
   Open your terminal and run:
   ```bash
   # Replace with your actual Railway DATABASE_URL
   pg_dump "postgresql://user:password@host.railway.app:port/railway" \
     --clean \
     --no-owner \
     --no-acl \
     -f railway_backup.sql
   ```
   
   Or if you don't have pg_dump installed locally:
   ```bash
   # Use Railway CLI
   railway run pg_dump $DATABASE_URL --clean --no-owner --no-acl -f railway_backup.sql
   ```

### Step 2: Set Up Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name, password, and region
   - Wait for database to provision (~2 minutes)

2. **Get Supabase Connection String**
   - In Supabase dashboard, go to "Settings" → "Database"
   - Find "Connection string" section
   - Copy the connection string (choose "Connection pooling" for better performance)
   - Format: `postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

### Step 3: Import Data to Supabase

**Method A: Using SQL Editor (Easiest)**

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Open your `railway_backup.sql` file in a text editor
4. Copy the entire content
5. Paste into Supabase SQL Editor
6. Click "Run"

**Method B: Using psql Command Line**

```bash
# Replace with your Supabase connection string
psql "postgresql://postgres.xxx:[YOUR_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres" \
  -f railway_backup.sql
```

### Step 4: Verify Migration

1. In Supabase dashboard, go to "Table Editor"
2. Verify all tables are present:
   - `jobs`
   - `attachments`
   - `contacts`
   - `migrations`
3. Check row counts match your Railway database

## Option 2: Manual Export via Railway Dashboard

### If You Have Small Amount of Data

1. **Export from Railway**
   - Go to Railway project → PostgreSQL service
   - Click "Query" tab
   - Run: `SELECT * FROM jobs;`
   - Copy results
   - Repeat for `attachments`, `contacts` tables

2. **Import to Supabase**
   - Go to Supabase → Table Editor
   - Create tables first (run schema from `server/db.js`)
   - Insert data manually or via SQL Editor

## Option 3: Using Database Migration Tools

### Using TablePlus or DBeaver

1. **Connect to Both Databases**
   - Add Railway database connection
   - Add Supabase database connection

2. **Export and Import**
   - In TablePlus: Right-click tables → Export → SQL
   - Switch to Supabase connection
   - Import SQL file

## Troubleshooting

### Error: "role does not exist"
- Remove `SET ROLE` statements from the SQL dump
- Use `--no-owner` flag when running pg_dump

### Error: "permission denied"
- Remove `GRANT` and `REVOKE` statements from SQL dump
- Use `--no-acl` flag when running pg_dump

### Migration Scripts Not Showing
- The `migrations` table tracks which migrations have run
- If it's empty after import, manually insert records:
  ```sql
  INSERT INTO migrations (filename, executed_at) 
  VALUES ('001_add_new_statuses.sql', NOW());
  ```

## After Migration

1. **Update Environment Variables**
   - In Vercel, set `DATABASE_URL` to your Supabase connection string
   - Keep all other env vars (`AUTH_USERNAME`, `AUTH_PASSWORD`, etc.)

2. **Test Your Application**
   - Deploy to Vercel
   - Verify all data appears correctly
   - Test creating, updating, deleting records

3. **Shut Down Railway** (Optional)
   - Once verified, you can delete your Railway project to avoid charges

## Quick Commands Reference

```bash
# Export from Railway
pg_dump "$RAILWAY_DATABASE_URL" --clean --no-owner --no-acl -f backup.sql

# Import to Supabase
psql "$SUPABASE_DATABASE_URL" -f backup.sql

# Verify record counts
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM jobs;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM attachments;"
```

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Verify connection strings are correct
3. Ensure your database password doesn't contain special characters that need URL encoding

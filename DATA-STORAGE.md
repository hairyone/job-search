# Database Data Storage Guide

This document explains where your job application data is stored and how to manage it.

## Current Setup: Host Filesystem (Bind Mount)

Your database data is stored in a **local folder** on your computer:

```
./data/postgres/
```

This folder is in your project directory and contains all your job application data.

## Why This Is Better for Personal Use

| Feature | Host Folder (Current) | Docker Volume |
|---------|----------------------|---------------|
| **Easy to find** | ✅ `./data/postgres/` | ❌ Hidden in Docker |
| **Easy to backup** | ✅ Copy folder | ❌ Need Docker commands |
| **Easy to access** | ✅ Browse directly | ❌ Need Docker exec |
| **Easy to migrate** | ✅ Copy to USB/cloud | ❌ Complex export |
| **Visible in file browser** | ✅ Yes | ❌ No |
| **Backup with Time Machine/etc** | ✅ Automatic | ❌ Not included |
| **Clear ownership** | ✅ Your files | ❌ Docker's files |

## Where Is My Data?

All your job application data is in:

```bash
job-search/
└── data/
    └── postgres/     # ← All your database data here
        ├── base/
        ├── global/
        ├── pg_wal/
        └── ... (PostgreSQL files)
```

**Don't edit these files directly!** They're PostgreSQL's internal format. Use the application or SQL queries to access your data.

## Backing Up Your Data

### Method 1: Copy the Folder (Easiest)

```bash
# Backup
cp -r ./data/postgres ./data/postgres-backup-$(date +%Y%m%d)

# Or zip it
tar -czf job-tracker-backup-$(date +%Y%m%d).tar.gz ./data/postgres
```

Your data is now backed up!

### Method 2: SQL Export (More Portable)

```bash
# Export to SQL file (works anywhere)
docker exec job-tracker-db pg_dump -U postgres job_tracker > my-jobs-backup.sql

# Restore from SQL file
docker exec -i job-tracker-db psql -U postgres job_tracker < my-jobs-backup.sql
```

### Method 3: Automatic Backups

Add this to your routine:

```bash
# Weekly backup script
#!/bin/bash
BACKUP_DIR="$HOME/Backups/job-tracker"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d).tar.gz" ./data/postgres
echo "Backup created: $BACKUP_DIR/backup-$(date +%Y%m%d).tar.gz"
```

## Migrating to Another Computer

### Option 1: Copy Data Folder

1. **On old computer:**
   ```bash
   # Stop the application
   docker-compose down
   
   # Copy the data folder
   cp -r ./data ~/Desktop/job-tracker-data
   # Or: tar -czf ~/Desktop/job-tracker-data.tar.gz ./data
   ```

2. **On new computer:**
   ```bash
   # Set up the application
   git clone <your-repo>
   cd job-search
   
   # Copy data folder
   cp -r ~/Desktop/job-tracker-data ./data
   # Or: tar -xzf ~/Desktop/job-tracker-data.tar.gz
   
   # Start application
   docker-compose up -d
   ```

Done! All your jobs are on the new computer.

### Option 2: SQL Export/Import

1. **On old computer:**
   ```bash
   docker exec job-tracker-db pg_dump -U postgres job_tracker > jobs-export.sql
   ```

2. **On new computer:**
   ```bash
   # Set up and start application
   docker-compose up -d
   
   # Import data
   docker exec -i job-tracker-db psql -U postgres job_tracker < jobs-export.sql
   ```

## Cloud Backup Integration

Your data folder can be automatically backed up by:

✅ **Dropbox** - Put project in Dropbox folder  
✅ **Google Drive** - Sync `./data` folder  
✅ **iCloud** - Put project in iCloud Drive  
✅ **OneDrive** - Sync the data folder  
✅ **Time Machine** (Mac) - Automatically includes it  
✅ **Backblaze** - Automatically backs up  
✅ **Git** - Add to private repo (if < 100MB)  

**Note:** The `.gitignore` file excludes `data/` by default to prevent accidentally committing to public repos.

## Data Size

Your job tracker database is very small:

- **Empty database:** ~50 MB (PostgreSQL overhead)
- **100 job applications:** ~51 MB (about 10 KB per job)
- **1000 job applications:** ~60 MB

You can easily keep years of data!

## Switching Back to Docker Volumes

If you prefer Docker volumes (not recommended for personal use):

Edit `docker-compose.yml` and change:
```yaml
volumes:
  - ./data/postgres:/var/lib/postgresql/data
```

To:
```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```

And add at the bottom:
```yaml
volumes:
  postgres-data:
```

## Accessing Your Data Directly

Even though data is in PostgreSQL format, you can query it:

```bash
# Open PostgreSQL shell
docker exec -it job-tracker-db psql -U postgres job_tracker

# Inside psql:
SELECT company, position, status FROM jobs;
\q  # to exit
```

## Security Note

The `./data/postgres` folder contains your database files. Keep it secure:

- ✅ Included in `.gitignore` - Won't be committed to public repos
- ⚠️ Contains all your job data - Back it up!
- ⚠️ Don't share publicly - Has your application history
- ✅ OK to sync to personal cloud storage (Dropbox, iCloud, etc.)

## Troubleshooting

### Permission Errors

If you get permission errors when starting Docker:

```bash
# Give Docker permission to write to data folder
sudo chown -R $(whoami) ./data

# Or on some systems:
sudo chown -R 999:999 ./data  # PostgreSQL user in container
```

### Data Folder Already Exists

When you first run `docker-compose up -d`, Docker creates the `./data/postgres` folder automatically.

If you're migrating existing data, make sure to:
1. Stop containers: `docker-compose down`
2. Replace the folder
3. Start containers: `docker-compose up -d`

### Corrupted Database

If database becomes corrupted:

```bash
# Stop containers
docker-compose down

# Backup current data (just in case)
mv ./data/postgres ./data/postgres-corrupted

# Start fresh (will create new empty database)
docker-compose up -d

# Restore from SQL backup if you have one
docker exec -i job-tracker-db psql -U postgres job_tracker < backup.sql
```

## Summary

**Your job data is in:** `./data/postgres/`

**To backup:** Copy the folder or use `pg_dump`

**To migrate:** Copy folder to new computer

**To access:** Use the app or SQL queries

**Cloud sync:** Works with any cloud storage service

**Size:** Very small (~50-60 MB for hundreds of jobs)

This approach gives you **full control** over your data while keeping it easy to use with Docker! 🗄️

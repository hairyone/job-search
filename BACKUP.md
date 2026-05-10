# Backup & Restore Guide

Complete guide for backing up and restoring your job application data.

## Why Backup?

Your job application history is valuable:
- 📊 Track your job search progress over time
- 📝 Reference past applications and interviews
- 💼 Build your career history database
- 🔒 Protect against accidental deletion or hardware failure

**Recommendation:** Backup at least once a week, or after adding important applications.

---

## Quick Backup Methods

### Method 1: Copy Data Folder (Easiest)

**Best for:** Quick local backups

```bash
# Simple copy with date stamp
cp -r ./data/postgres ./data/postgres-backup-$(date +%Y%m%d)

# Or copy to safe location
cp -r ./data/postgres ~/Backups/job-tracker-$(date +%Y%m%d)

# Or create compressed archive
tar -czf ~/Backups/job-tracker-$(date +%Y%m%d).tar.gz ./data/postgres
```

**To restore:**
```bash
# Stop the database
docker-compose down

# Restore the data folder
rm -rf ./data/postgres
cp -r ~/Backups/job-tracker-20260510 ./data/postgres

# Or extract from archive
tar -xzf ~/Backups/job-tracker-20260510.tar.gz -C ./data/

# Start the database
docker-compose up -d
```

**Pros:**
- ✅ Very fast
- ✅ Preserves exact database state
- ✅ No SQL knowledge needed

**Cons:**
- ❌ Large file size (~50MB even for small databases)
- ❌ Only works with same PostgreSQL version
- ❌ Must stop database first

---

### Method 2: SQL Export (Most Portable)

**Best for:** Sharing backups, migrating between systems, version control

```bash
# Export to SQL file
docker exec job-tracker-db pg_dump -U postgres job_tracker > backup.sql

# Or with timestamp
docker exec job-tracker-db pg_dump -U postgres job_tracker > backup-$(date +%Y%m%d).sql

# Compress it (recommended)
docker exec job-tracker-db pg_dump -U postgres job_tracker | gzip > backup-$(date +%Y%m%d).sql.gz
```

**To restore:**
```bash
# Make sure database is running
docker-compose up -d

# From uncompressed SQL file
docker exec -i job-tracker-db psql -U postgres job_tracker < backup.sql

# From compressed file
gunzip -c backup-20260510.sql.gz | docker exec -i job-tracker-db psql -U postgres job_tracker
```

**Pros:**
- ✅ Small file size (just your data)
- ✅ Human-readable SQL
- ✅ Works across PostgreSQL versions
- ✅ Can edit before restoring
- ✅ Database can stay running

**Cons:**
- ❌ Slower than folder copy
- ❌ Requires Docker to be running

---

### Method 3: Both (Recommended!)

```bash
# Complete backup script
BACKUP_DIR=~/Backups/job-tracker
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

# SQL export (small, portable)
docker exec job-tracker-db pg_dump -U postgres job_tracker | gzip > "$BACKUP_DIR/sql-$DATE.sql.gz"

# Data folder (exact copy)
tar -czf "$BACKUP_DIR/data-$DATE.tar.gz" ./data/postgres

echo "Backups created in $BACKUP_DIR"
ls -lh "$BACKUP_DIR"
```

---

## Automated Backup Solutions

### Option 1: Daily Backup Script (Linux/Mac)

Create a file `backup.sh`:

```bash
#!/bin/bash
# Daily backup script for job tracker

BACKUP_DIR=~/Backups/job-tracker
DATE=$(date +%Y%m%d)
KEEP_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create SQL backup
echo "Creating SQL backup..."
docker exec job-tracker-db pg_dump -U postgres job_tracker | \
  gzip > "$BACKUP_DIR/backup-$DATE.sql.gz"

# Delete old backups (keep last 30 days)
find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +$KEEP_DAYS -delete

echo "✅ Backup complete: $BACKUP_DIR/backup-$DATE.sql.gz"
echo "📊 Backups in folder:"
ls -lht "$BACKUP_DIR" | head -10
```

Make it executable and run it:
```bash
chmod +x backup.sh
./backup.sh
```

**Schedule it to run daily:**
```bash
# Add to crontab (runs daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * cd /home/yourusername/job-search && ./backup.sh
```

### Option 2: Cloud Sync (Automatic)

Put your data folder in a cloud-synced location:

**Dropbox:**
```bash
# Stop database
docker-compose down

# Move data to Dropbox
mv ./data ~/Dropbox/job-tracker-data

# Create symbolic link
ln -s ~/Dropbox/job-tracker-data ./data

# Start database
docker-compose up -d
```

**Google Drive / OneDrive / iCloud:**
- Same approach as Dropbox above
- Or use their desktop apps to sync the `./data` folder

**Pros:**
- ✅ Automatic syncing
- ✅ Version history
- ✅ Access from anywhere
- ✅ Off-site backup

**Cons:**
- ⚠️ Uses cloud storage quota
- ⚠️ May sync while database is running (can cause issues)

### Option 3: Git (For Small Databases)

If your database is small and you want version control:

```bash
# Remove data/ from .gitignore temporarily
# Create SQL export instead
docker exec job-tracker-db pg_dump -U postgres job_tracker > data-export.sql

# Add to git
git add data-export.sql
git commit -m "Backup: $(date)"
git push
```

**Only recommended if:**
- Your export is < 10 MB
- Using a private repository
- Want version history

---

## Restore Scenarios

### Scenario 1: Restore Last Backup (Oops, deleted some jobs!)

```bash
# Stop database
docker-compose down

# Restore from SQL backup
docker-compose up -d
sleep 3  # Wait for database to start

# Clear and restore
docker exec -i job-tracker-db psql -U postgres -c "DROP DATABASE job_tracker;"
docker exec -i job-tracker-db psql -U postgres -c "CREATE DATABASE job_tracker;"
gunzip -c ~/Backups/job-tracker/backup-20260510.sql.gz | \
  docker exec -i job-tracker-db psql -U postgres job_tracker

echo "✅ Restored from backup"
```

### Scenario 2: Move to New Computer

**On old computer:**
```bash
# Create portable backup
docker exec job-tracker-db pg_dump -U postgres job_tracker | \
  gzip > ~/Desktop/my-jobs-backup.sql.gz

# Copy this file to USB drive or cloud
```

**On new computer:**
```bash
# Set up application
git clone <your-repo>
cd job-search
npm run install:all

# Start database
docker-compose up -d
sleep 5

# Import data
gunzip -c ~/Desktop/my-jobs-backup.sql.gz | \
  docker exec -i job-tracker-db psql -U postgres job_tracker

# Start app
npm run local
```

### Scenario 3: Test on Copy Without Affecting Original

```bash
# Create a test database
docker exec -i job-tracker-db psql -U postgres -c "CREATE DATABASE job_tracker_test;"

# Restore backup to test database
gunzip -c backup.sql.gz | \
  docker exec -i job-tracker-db psql -U postgres job_tracker_test

# Connect to test database to experiment
docker exec -it job-tracker-db psql -U postgres job_tracker_test
```

### Scenario 4: Merge Backups from Two Computers

```bash
# Export from computer 1
docker exec job-tracker-db pg_dump -U postgres job_tracker > computer1.sql

# Export from computer 2
docker exec job-tracker-db pg_dump -U postgres job_tracker > computer2.sql

# On merge computer, import both (will combine unique entries)
docker exec -i job-tracker-db psql -U postgres job_tracker < computer1.sql
docker exec -i job-tracker-db psql -U postgres job_tracker < computer2.sql

# Note: This may create duplicates if same jobs exist in both
```

---

## Backup Best Practices

### How Often to Backup

- **Daily:** If actively job hunting (10+ applications/week)
- **Weekly:** If casually job hunting (1-5 applications/week)
- **Before major changes:** Before bulk deletes or updates
- **Before upgrades:** Before updating the application

### Where to Store Backups

**Good:**
- ✅ External hard drive (off-site)
- ✅ Cloud storage (Dropbox, Google Drive)
- ✅ NAS (network storage)
- ✅ USB drive (keep separate from computer)

**Bad:**
- ❌ Same disk as application (won't help if disk fails)
- ❌ Same folder as application (might delete accidentally)

**Best:** Follow the 3-2-1 rule:
- **3** copies of your data
- **2** different storage types
- **1** off-site backup

Example:
1. Original data on laptop
2. Daily backup to external drive
3. Weekly backup to cloud storage

### What to Include in Backups

**Essential:**
- `./data/postgres/` (database files) OR
- `backup.sql.gz` (SQL export)

**Optional but recommended:**
- `.env` file (your configuration)
- Custom code changes (if any)

**Not needed:**
- `node_modules/` (can reinstall)
- `client/build/` (can rebuild)
- Logs

---

## Quick Reference Commands

```bash
# Create SQL backup
docker exec job-tracker-db pg_dump -U postgres job_tracker | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore SQL backup
gunzip -c backup.sql.gz | docker exec -i job-tracker-db psql -U postgres job_tracker

# Copy data folder backup
cp -r ./data/postgres ~/Backups/job-tracker-backup-$(date +%Y%m%d)

# Restore data folder backup
docker-compose down
rm -rf ./data/postgres
cp -r ~/Backups/job-tracker-backup-20260510 ./data/postgres
docker-compose up -d

# View backup size
du -sh ~/Backups/job-tracker/*

# List your jobs (verify backup)
docker exec -it job-tracker-db psql -U postgres job_tracker -c "SELECT COUNT(*) FROM jobs;"

# Check database size
docker exec -it job-tracker-db psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('job_tracker'));"
```

---

## Troubleshooting

### "Database already exists" when restoring

```bash
# Drop and recreate database first
docker exec -i job-tracker-db psql -U postgres -c "DROP DATABASE job_tracker;"
docker exec -i job-tracker-db psql -U postgres -c "CREATE DATABASE job_tracker;"

# Then restore
gunzip -c backup.sql.gz | docker exec -i job-tracker-db psql -U postgres job_tracker
```

### "No space left on device"

```bash
# Check disk space
df -h

# Clean up old Docker images/containers
docker system prune -a

# Delete old backups
rm ~/Backups/job-tracker/backup-2025*.sql.gz
```

### Backup file is huge

```bash
# Use compression (reduces size by 80-90%)
docker exec job-tracker-db pg_dump -U postgres job_tracker | gzip -9 > backup.sql.gz

# Check compressed size
ls -lh backup.sql.gz
```

### Permission denied when restoring

```bash
# Give read permission
chmod 644 backup.sql.gz

# If still fails, copy to temp location
cp backup.sql.gz /tmp/
gunzip -c /tmp/backup.sql.gz | docker exec -i job-tracker-db psql -U postgres job_tracker
```

---

## Testing Your Backups

**Always test that backups work!** Here's a quick test:

```bash
# 1. Create a backup
docker exec job-tracker-db pg_dump -U postgres job_tracker | gzip > test-backup.sql.gz

# 2. Note the number of jobs
docker exec -it job-tracker-db psql -U postgres job_tracker -c "SELECT COUNT(*) FROM jobs;"

# 3. Create test database
docker exec -i job-tracker-db psql -U postgres -c "CREATE DATABASE test_restore;"

# 4. Restore to test database
gunzip -c test-backup.sql.gz | docker exec -i job-tracker-db psql -U postgres test_restore

# 5. Verify same number of jobs
docker exec -it job-tracker-db psql -U postgres test_restore -c "SELECT COUNT(*) FROM jobs;"

# 6. Clean up
docker exec -i job-tracker-db psql -U postgres -c "DROP DATABASE test_restore;"

# If numbers match, your backup works! ✅
```

---

## Summary

**Quick backup (weekly):**
```bash
docker exec job-tracker-db pg_dump -U postgres job_tracker | gzip > ~/Backups/backup-$(date +%Y%m%d).sql.gz
```

**Quick restore:**
```bash
gunzip -c ~/Backups/backup-20260510.sql.gz | docker exec -i job-tracker-db psql -U postgres job_tracker
```

**Remember:**
- 💾 Backup regularly (at least weekly)
- 🔄 Test your backups occasionally
- 📦 Keep multiple backup versions
- ☁️ Store backups off-site
- 📅 Delete old backups (keep last 30 days)

Your job search data is valuable - protect it! 🔒

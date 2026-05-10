#!/bin/bash
# Automated backup script for Job Application Tracker
# Creates compressed SQL backups and optionally keeps last N days

# Configuration
BACKUP_DIR=~/Backups/job-tracker
KEEP_DAYS=30
CONTAINER_NAME=job-tracker-db
DB_USER=postgres
DB_NAME=job_tracker

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate filename with timestamp
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql.gz"

echo -e "${BLUE}🔄 Starting backup...${NC}"

# Check if Docker container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${YELLOW}⚠️  Warning: Database container is not running!${NC}"
    echo "Starting container..."
    docker-compose up -d
    sleep 3
fi

# Create backup
echo -e "${BLUE}📦 Creating SQL backup...${NC}"
if docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_FILE"; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup created successfully!${NC}"
    echo -e "   File: $BACKUP_FILE"
    echo -e "   Size: $BACKUP_SIZE"
else
    echo -e "${YELLOW}❌ Backup failed!${NC}"
    exit 1
fi

# Count records in backup
RECORD_COUNT=$(docker exec $CONTAINER_NAME psql -U $DB_USER $DB_NAME -t -c "SELECT COUNT(*) FROM jobs;")
echo -e "${BLUE}📊 Database contains: $RECORD_COUNT job applications${NC}"

# Delete old backups
if [ $KEEP_DAYS -gt 0 ]; then
    echo -e "${BLUE}🧹 Cleaning up backups older than $KEEP_DAYS days...${NC}"
    DELETED=$(find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +$KEEP_DAYS -delete -print | wc -l)
    if [ $DELETED -gt 0 ]; then
        echo -e "${GREEN}   Deleted $DELETED old backup(s)${NC}"
    else
        echo -e "   No old backups to delete"
    fi
fi

# Show recent backups
echo -e "${BLUE}📂 Recent backups:${NC}"
ls -lht "$BACKUP_DIR"/backup-*.sql.gz 2>/dev/null | head -5 | while read line; do
    echo "   $line"
done

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo -e "${BLUE}💾 Total backup size: $TOTAL_SIZE${NC}"

echo -e "${GREEN}✅ Backup complete!${NC}"
echo ""
echo "To restore this backup:"
echo "  gunzip -c \"$BACKUP_FILE\" | docker exec -i $CONTAINER_NAME psql -U $DB_USER $DB_NAME"

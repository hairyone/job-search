#!/bin/bash
# Automated backup script for Job Application Tracker
# Creates compressed SQL backups and keeps the last N days of backups.

set -e

BACKUP_DIR=~/Backups/job-tracker
KEEP_DAYS=30
CONTAINER_NAME=job-tracker-db
DB_USER=postgres
DB_NAME=job_tracker

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql.gz"

echo -e "${BLUE}Backup starting...${NC}"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}Database container is not running. Starting stack...${NC}"
    docker compose up -d
    # Wait for postgres healthcheck
    until docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null | grep -q healthy; do
        sleep 1
    done
fi

echo -e "${BLUE}Creating SQL backup...${NC}"
if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}Backup created: $BACKUP_FILE ($BACKUP_SIZE)${NC}"
else
    echo -e "${YELLOW}Backup failed.${NC}"
    exit 1
fi

RECORD_COUNT=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USER" "$DB_NAME" -t -c "SELECT COUNT(*) FROM jobs;")
echo -e "${BLUE}Database contains: $RECORD_COUNT job applications${NC}"

if [ "$KEEP_DAYS" -gt 0 ]; then
    DELETED=$(find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +"$KEEP_DAYS" -delete -print | wc -l)
    if [ "$DELETED" -gt 0 ]; then
        echo -e "${GREEN}Deleted $DELETED old backup(s)${NC}"
    fi
fi

echo ""
echo "Recent backups:"
ls -lht "$BACKUP_DIR"/backup-*.sql.gz 2>/dev/null | head -5
echo ""
echo "To restore:"
echo "  gunzip -c \"$BACKUP_FILE\" | docker exec -i $CONTAINER_NAME psql -U $DB_USER $DB_NAME"
